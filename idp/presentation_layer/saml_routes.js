const { Router } = require('express');
const samlp = require('samlp');
const SessionParticipants = require('samlp/lib/sessionParticipants');

const { asyncHandler } = require('./utils.js');
const { openLoginPage, openSSOFailedPage } = require('./saml_handlers.js');
const ProfileMapper = require('../data_layer/ProfileMapper.js');

const serviceProviders = require('../service_providers.js');
const { SP_BASE_URL, SP_ASSERTION_RELATIVE_URL, SP_ENTITY_ID, IDP_BASE_URL, IDP_METADATA_RELATIVE_URL, IDP_SSO_GET_RELATIVE_URL, IDP_SSO_POST_RELATIVE_URL, IDP_SLO_GET_RELATIVE_URL, IDP_SLO_POST_RELATIVE_URL, IDP_ENTITY_ID, IDP_PRIVATE_KEY, IDP_CERTIFICATE } = require('../saml_config.js');

const metadata = {
    issuer: IDP_ENTITY_ID,
    cert: IDP_CERTIFICATE,
    redirectEndpointPath: `${IDP_BASE_URL}${IDP_SSO_GET_RELATIVE_URL}`,
    postEndpointPath: `${IDP_BASE_URL}${IDP_SSO_POST_RELATIVE_URL}`
};

const router = Router();

router.get(`${IDP_SSO_GET_RELATIVE_URL}`, asyncHandler(handleSingleSignOnRequest));
router.post(`${IDP_SSO_POST_RELATIVE_URL}`, asyncHandler(handleSingleSignOnRequest));
router.get(`${IDP_SLO_GET_RELATIVE_URL}`, handleSingleLogOutRequest);
router.post(`${IDP_SLO_POST_RELATIVE_URL}`, handleSingleLogOutRequest);
router.get(`${IDP_METADATA_RELATIVE_URL}`, samlp.metadata(metadata));

async function handleSingleSignOnRequest(req, res, next) {
    const authnRequest = await parseAuthnRequest(req);

    // if no authn request provided, ignore.
    if (authnRequest == null) {
        req.ssoFailureReason = 'NO_AUTHN_REQUEST';
        await openSSOFailedPage(req, res, next);
        return;
    }
    req.session.authnRequest = authnRequest;

    // if service provider not known, ignore.
    const serviceProvider = serviceProviders.find(sp => (sp.entityId == authnRequest.issuer));
    if (serviceProvider == null) {
        req.ssoFailureReason = 'UNKNOWN_SP';
        await openSSOFailedPage(req, res, next);
        return;
    }

    // valid authnRequest, and already logged in!
    // return successful login automatically.
    if (req.session.user != null) {
        await handleSuccessfulLogin(req, res, next);
        return;
    }

    // valid authnRequest, but not logged in!
    // open login page.
    await openLoginPage(req, res, next);
    return;
}

async function handleSingleLogOutRequest(req, res, next) {
    if (req.session.user == null) {
        res.redirect('/');
        return;
    }

    const participants = [
        {
            serviceProviderId: SP_ENTITY_ID,
            sessionIndex: String(hashCode(req.session.id)),
            nameId: req.session.user.userName,
            serviceProviderLogoutURL: `${SP_BASE_URL}${SP_ASSERTION_RELATIVE_URL}`
        }
    ];
    
    samlp.logout({
        issuer: SP_ENTITY_ID,
        key: IDP_PRIVATE_KEY,
        cert: IDP_CERTIFICATE,
        sessionParticipants: new SessionParticipants(participants),
        RelayState: 'IdPInitiated',
        clearIdPSession: function(callback) {
            req.session.destroy();
            callback();
        }
    })(req, res, next);
}

async function handleSuccessfulLogin(req, res, next) {
    const authnRequest = req.session.authnRequest;
    if (authnRequest == null) {
        next(new Error('No AuthnRequest found!'));
        return;
    }

    const user = req.session.user;
    if (user == null) {
        next(new Error('No user found!'));
        return;
    }

    const serviceProvider = serviceProviders.find(sp => (sp.entityId == authnRequest.issuer));

    const authOptions = {
        sessionIndex: hashCode(req.session.id),
        issuer: IDP_ENTITY_ID,
        key: IDP_PRIVATE_KEY,
        cert: IDP_CERTIFICATE,
        encryptionPublicKey: serviceProvider.publicKey,
        encryptionCert: serviceProvider.cert,
        signResponse: true,
        RelayState: authnRequest.relayState,
        profileMapper: localProfile => new ProfileMapper(localProfile),
        getPostURL: (wtrealm, wreply, req, callback) => callback(null, authnRequest.acsUrl || serviceProvider.assertionUrl),
        getUserFromRequest: req => req.session.user
    };

    delete req.session.authnRequest;

    samlp.auth(authOptions)(req, res, next);
}

/**
 * Asynchronously parses an authentication request.
 *
 * @returns {Promise<any>} The SAML authentication request.
 */
function parseAuthnRequest(req) {
    return new Promise(function (resolve, reject) {
        samlp.parseRequest(req, {}, function(err, data) {
            if (data) {
                let relayState = null;
                if (req.method === 'POST') {
                    relayState = req.body.RelayState;
                } else {
                    relayState = req.query.RelayState;
                }

                const authnRequest = {
                    relayState: relayState,
                    id: data.id,
                    issuer: data.issuer,
                    destination: data.destination,
                    acsUrl: data.assertionConsumerServiceURL,
                    forceAuthn: data.forceAuthn === 'true'
                };

                return resolve(authnRequest);
            }

            return reject(err);
        });
    });
}

function hashCode(str) {
    let hash = 0;
    if (str.length != 0) {
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash | 0;
        }
    }
    return hash;
}

module.exports.router = router;
module.exports.handleSuccessfulLogin = handleSuccessfulLogin;

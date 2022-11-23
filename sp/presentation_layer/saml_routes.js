const { Router } = require('express');
const { ServiceProvider, IdentityProvider } = require('saml2-js');

const { asyncHandler } = require('./utils.js');
const { handleSamlLogin } = require('./saml_handlers.js');

const { SP_BASE_URL, SP_METADATA_RELATIVE_URL, SP_ASSERTION_RELATIVE_URL, SP_PRIVATE_KEY, SP_CERTIFICATE } = require('../saml_config.js');
const { IDP_BASE_URL, IDP_METADATA_RELATIVE_URL, IDP_SSO_GET_RELATIVE_URL, IDP_SLO_GET_RELATIVE_URL, IDP_CERTIFICATE } = require('../saml_config.js');

const sp = new ServiceProvider({
    entity_id: `${SP_BASE_URL}${SP_METADATA_RELATIVE_URL}`,
    private_key: SP_PRIVATE_KEY,
    certificate: SP_CERTIFICATE,
    assert_endpoint: `${SP_BASE_URL}${SP_ASSERTION_RELATIVE_URL}`,
    sign_get_request: true,
    allow_unencrypted_assertion: false
});

const idp = new IdentityProvider({
    sso_login_url: `${IDP_BASE_URL}${IDP_SSO_GET_RELATIVE_URL}`,
    sso_logout_url: `${IDP_BASE_URL}${IDP_SLO_GET_RELATIVE_URL}`,
    certificates: [ IDP_CERTIFICATE ]
});

const idpEntityId = `${IDP_BASE_URL}${IDP_METADATA_RELATIVE_URL}`;

const router = new Router();

router.get(`${SP_METADATA_RELATIVE_URL}`, function(req, res, next) {
    res.type('application/xml');
    res.send(sp.create_metadata());
});

router.post(`${SP_ASSERTION_RELATIVE_URL}`, asyncHandler(handleAssertion));

async function handleAssertion(req, res, next) {
    let samlResponse;
    try {
        samlResponse = await parsePostAssertion(req.body);
    } catch (e) {
        res.status(400);
        res.send('Illegal SAML request!');
        return;
    }

    if (samlResponse.type === 'authn_response') {
        const userId = samlResponse.user.name_id;
        const sessionIndex = samlResponse.user.session_index;

        req.samlLoginData = { userId, sessionIndex  };

        await handleSamlLogin(req, res, next);
    } else if (samlResponse.type === 'logout_response') {
        req.session.destroy();

        res.redirect('/');
    } else if (samlResponse.type === 'logout_request') {
        const relayState = req.query.RelayState || (req.body && req.body.RelayState);

        const logoutUrl = await createLogoutResponseUrl(relayState);

        req.session.destroy();

        res.redirect(logoutUrl);
    } else {
        res.status(500);
        res.send('Illegal SAML request!');
    }
}

async function redirectToLoginUrl(req, res, next) {
    const loginUrl = await createLoginRequestUrl();
    res.redirect(loginUrl);
}

async function redirectToLogoutUrl(req, res, next) {
    const { userId, sessionIndex  } = req.samlLogoutData;

    const logoutUrl = await createLogoutRequestUrl(userId, sessionIndex);

    res.redirect(logoutUrl);
}

function createLoginRequestUrl() {
    return new Promise(function (resolve, reject) {
        sp.create_login_request_url(idp, {}, function(err, loginUrl, requestId) {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(loginUrl);
        });
    });
}

function createLogoutRequestUrl(nameId, sessionIndex) {
    return new Promise(function (resolve, reject) {
        sp.create_logout_request_url(idp, { name_id: nameId, session_index: sessionIndex }, function(err, logoutURL) {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(logoutURL);
        });
    });
}

function createLogoutResponseUrl(relayState) {
    return new Promise(function (resolve, reject) {
        sp.create_logout_response_url(idp, { relay_state: relayState }, function (err, logoutURL) {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(logoutURL);
        })
    });
}

function parsePostAssertion(assertion) {
    return new Promise(function (resolve, reject) {
        const options = { request_body: assertion };
        sp.post_assert(idp, options, function(err, samlResponse) {
            if (err != null) {
                reject(err);
                return;
            }

            resolve(samlResponse);
        });
    });
}

module.exports.router = router;
module.exports.redirectToLoginUrl = redirectToLoginUrl;
module.exports.redirectToLogoutUrl = redirectToLogoutUrl;

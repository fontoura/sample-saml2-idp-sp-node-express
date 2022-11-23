const fs = require('fs');

const SP_PROTOCOL = 'http';
const SP_HOST = 'localhost';
const SP_PORT = 5000;
const SP_BASE_URL = `${SP_PROTOCOL}://${SP_HOST}:${SP_PORT}`;
const SP_METADATA_RELATIVE_URL = '/metadata.xml';
const SP_ASSERTION_RELATIVE_URL = '/assert';

const SP_ENTITY_ID = `${SP_BASE_URL}${SP_METADATA_RELATIVE_URL}`;
const SP_PUBLIC_KEY = fs.readFileSync('./sp-public-key.pem').toString();
const SP_CERTIFICATE = fs.readFileSync('./sp-certificate.pem').toString();

const IDP_PROTOCOL = 'http';
const IDP_HOST = 'localhost';
const IDP_PORT = 4000;
const IDP_BASE_URL = `${IDP_PROTOCOL}://${IDP_HOST}:${IDP_PORT}`;
const IDP_METADATA_RELATIVE_URL = '/metadata';
const IDP_SSO_GET_RELATIVE_URL = '/saml/sso';
const IDP_SSO_POST_RELATIVE_URL = '/saml/sso';
const IDP_SLO_GET_RELATIVE_URL = '/saml/slo';
const IDP_SLO_POST_RELATIVE_URL = '/saml/slo';

const IDP_ENTITY_ID = `${IDP_BASE_URL}${IDP_METADATA_RELATIVE_URL}`;
const IDP_CERTIFICATE = fs.readFileSync('./idp-certificate.pem').toString();
const IDP_PRIVATE_KEY = fs.readFileSync('./idp-private-key.pem').toString();

module.exports.SP_PROTOCOL = SP_PROTOCOL;
module.exports.SP_HOST = SP_HOST;
module.exports.SP_PORT = SP_PORT;
module.exports.SP_BASE_URL = SP_BASE_URL;
module.exports.SP_METADATA_RELATIVE_URL = SP_METADATA_RELATIVE_URL;
module.exports.SP_ASSERTION_RELATIVE_URL = SP_ASSERTION_RELATIVE_URL;

module.exports.SP_ENTITY_ID = SP_ENTITY_ID;
module.exports.SP_PUBLIC_KEY = SP_PUBLIC_KEY;
module.exports.SP_CERTIFICATE = SP_CERTIFICATE;

module.exports.IDP_PROTOCOL = IDP_PROTOCOL;
module.exports.IDP_HOST = IDP_HOST;
module.exports.IDP_PORT = IDP_PORT;
module.exports.IDP_BASE_URL = IDP_BASE_URL;
module.exports.IDP_METADATA_RELATIVE_URL = IDP_METADATA_RELATIVE_URL;
module.exports.IDP_SSO_GET_RELATIVE_URL = IDP_SSO_GET_RELATIVE_URL;
module.exports.IDP_SSO_POST_RELATIVE_URL = IDP_SSO_POST_RELATIVE_URL;
module.exports.IDP_SLO_GET_RELATIVE_URL = IDP_SLO_GET_RELATIVE_URL;
module.exports.IDP_SLO_POST_RELATIVE_URL = IDP_SLO_POST_RELATIVE_URL;

module.exports.IDP_ENTITY_ID = IDP_ENTITY_ID;
module.exports.IDP_PRIVATE_KEY = IDP_PRIVATE_KEY;
module.exports.IDP_CERTIFICATE = IDP_CERTIFICATE;

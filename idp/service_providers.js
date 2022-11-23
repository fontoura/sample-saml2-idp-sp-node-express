const fs = require('fs');

const { SP_BASE_URL, SP_METADATA_RELATIVE_URL, SP_ASSERTION_RELATIVE_URL, SP_PUBLIC_KEY, SP_CERTIFICATE } = require('./saml_config.js');

module.exports = [
    {
        'entityId': `${SP_BASE_URL}${SP_METADATA_RELATIVE_URL}`,
        'assertionUrl': `${SP_BASE_URL}${SP_ASSERTION_RELATIVE_URL}`,
        'publicKey': SP_PUBLIC_KEY,
        'cert': SP_CERTIFICATE
    }
];

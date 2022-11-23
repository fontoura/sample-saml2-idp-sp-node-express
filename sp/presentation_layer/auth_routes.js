const { Router } = require('express');
const { asyncHandler } = require('./utils.js');

const { redirectToLoginUrl, redirectToLogoutUrl } = require('./saml_routes.js');

const router = new Router();

router.get('/', function(req, res) {
    const { userData, samlData } = req.session;

    let status = '';
    if (userData != null) {
        status += `<div>You are logged as <b>${userData.userName}</b> (e-mail: <b>${userData.email}</b>).</div>`;
        if (samlData != null) {
            status += `<div>You have logged in using SAML. Your session ID is <u>${samlData.sessionIndex}</u>.</div>`;
        }
    }

    res.status(200);
    res.send(`${status}<a href="/login">Click here to login</a> | <a href="/logout">Click here to logout</a>`);
});

router.get('/login', asyncHandler(redirectToLoginUrl));

router.get('/logout', function (req, res, next) {
    const { userData, samlData } = req.session;
    if (userData == null && samlData == null) {
        res.redirect('/');
        return;
    }

    const userId = userData.userName;
    const { sessionIndex } = samlData;

    const samlLogoutData = { userId, sessionIndex };

    req.samlLogoutData = samlLogoutData;

    next();
}, asyncHandler(redirectToLogoutUrl));

module.exports.router = router;

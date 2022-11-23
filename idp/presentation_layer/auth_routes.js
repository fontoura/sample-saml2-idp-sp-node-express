
const { Router } = require('express');

const { asyncHandler } = require('./utils.js');
const { handleSuccessfulLogin } = require('./saml_routes.js');

const router = Router();

router.post('/form/login', asyncHandler(handleLoginRequest));

async function handleLoginRequest(req, res, next) {
    const { username, password } = req.body;
    const user = await authenticateUser( username, password );
    if (user != null) {
        req.session.user = user;
        await handleSuccessfulLogin(req, res, next);
        return;
    }

    res.redirect('/error.html');
}

async function authenticateUser(username, password) {
    if (username === 'admin' && password === 'admin') {
        return {
            userName: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@admin.com'
        };
    }
    return null;
}

module.exports.router = router;

const { findUser } = require('../data_layer/user_data.js');

async function handleSamlLogin(req, res, next) {
    const { samlLoginData } = req;

    const { userId, sessionIndex } = samlLoginData;

    const userData = await findUser(userId);
    const samlData = { sessionIndex };

    req.session.userData = userData;
    req.session.samlData = samlData;

    res.redirect('/');
}

module.exports.handleSamlLogin = handleSamlLogin;

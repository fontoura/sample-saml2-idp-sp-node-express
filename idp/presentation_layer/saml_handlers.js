async function openLoginPage(req, res, next) {
    res.redirect('/login.html')
}

async function openSSOFailedPage(req, res, next) {
    const reason = req.ssoFailureReason;
    if (reason == 'NO_AUTHN_REQUEST') {
        res.redirect('/error.html');
    } else if (reason == 'UNKNOWN_SP') {
        res.redirect('/error.html');
    } else {
        res.redirect('/error.html');
    }
}

module.exports.openLoginPage = openLoginPage;
module.exports.openSSOFailedPage = openSSOFailedPage;

const express = require('express');
const session = require('express-session');

const { router: samlRouter } = require('./presentation_layer/saml_routes.js');
const { router: authRouter } = require('./presentation_layer/auth_routes.js');

const { SP_HOST, SP_PORT } = require('./saml_config.js');

const app = express();

app.set('host', SP_HOST);
app.set('port', SP_PORT);

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'United Federation of Planets',
    resave: false,
    saveUninitialized: true,
    name: 'sp_sid',
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(samlRouter);
app.use(authRouter);

app.listen(SP_PORT);

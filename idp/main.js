const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const { router: samlRouter } = require('./presentation_layer/saml_routes.js');
const { router: authRouter } = require('./presentation_layer/auth_routes.js');
const { IDP_HOST, IDP_PORT } = require('./saml_config.js');

const app = express();

app.set('host', IDP_HOST);
app.set('port', IDP_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'The Galactic Republic',
    resave: false,
    saveUninitialized: true,
    name: 'idp_sid',
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(samlRouter);
app.use(authRouter);

app.listen(IDP_PORT);

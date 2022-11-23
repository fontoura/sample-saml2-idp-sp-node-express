# SAM2 IdP and SP in Node.js

Sample projects with a Service Provider (SP) and an Identity Provider (IdP).

The SP runs on port 5000 and the IdP on port 4000.

This is not meant to be a production-ready project; it is merely meant to be a working example of an IdP and a SP on Node.js.

Thanks to Karl McGuiness for making a working example of SAMLP, so I could figure out how this library works.

> Sample certificates and keys have been comitted for convenience.

## Command Cheatsheet

To run either project:

    npm start

To create a new certificate and private key for the IdP:

    openssl req -x509 -new -newkey rsa:2048 -nodes -subj '/C=BR/ST=Parana/L=Curitiba/O=FontouraLtd/CN=SampleIdP' -keyout idp-private-key.pem -out idp-certificate.pem -days 7300

To get the public key of the IdP based on the certificate:

    openssl x509 -pubkey -noout -in idp-certificate.pem > idp-public-key.pem

To create a new certificate and private key for the SP:

    openssl req -x509 -new -newkey rsa:2048 -nodes -subj '/C=BR/ST=Parana/L=Curitiba/O=FontouraLtd/CN=SampleSP' -keyout sp-private-key.pem -out sp-certificate.pem -days 7300

To get the public key of the SP based on the certificate:

    openssl x509 -pubkey -noout -in sp-certificate.pem > sp-public-key.pem

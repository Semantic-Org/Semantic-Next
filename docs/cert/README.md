# Self Signed Certs

These are self signed certs created with [`mkcert`](https://github.com/FiloSottile/mkcert) and used to serve the documentation to `https://dev.semantic-ui.com` in the browser.

You will need to install these certs locally for Chrome to show the SSL certs as trusted, and for the 'playground' section to work.

## Certificate Generation

To generate a new self-signed TLS/SSL certificate (`cert.pem`) and private key (`key.pem`) suitable for local development or internal use (valid for 3650 days, approximately 10 years, using `localhost` as the Common Name), run the following command within this directory:

```bash
openssl pkcs12 -export -out dev.semantic-ui.com.pfx -inkey dev.semantic-ui.com-key.pem -in dev.semantic-ui.com.pem
```

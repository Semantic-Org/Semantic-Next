# Development SSL Certificates

CA-signed certificates for `https://dev.semantic-ui.com`. See `docs/README.md` for installation instructions.

## Regenerating Certificates

```bash
# Generate CA (10 year validity)
openssl genrsa -out ca-key.pem 2048
openssl req -new -x509 -key ca-key.pem -out ca.pem -days 3650 -subj "/CN=Semantic UI Dev CA/O=Semantic UI LLC"

# Generate server cert signed by CA
openssl genrsa -out dev.semantic-ui.com-key.pem 2048
openssl req -new -key dev.semantic-ui.com-key.pem -out temp.csr -subj "/CN=dev.semantic-ui.com/O=Semantic UI LLC"
echo "subjectAltName=DNS:dev.semantic-ui.com,DNS:localhost" > /tmp/san.ext
openssl x509 -req -in temp.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out dev.semantic-ui.com.pem -days 3650 -extfile /tmp/san.ext
rm temp.csr /tmp/san.ext ca.srl

# Generate .pfx for Windows (no password)
openssl pkcs12 -export -nokeys -in ca.pem -out ca.pfx -passout pass:
```

All developers must reinstall the CA after regeneration.

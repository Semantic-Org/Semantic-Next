#!/usr/bin/env bash
# Generate local-dev CA and server cert for https://dev.semantic-ui.com.
# Run from docs/ via `npm run cert`.

set -euo pipefail

cd "$(dirname "$0")/.."

mkdir -p cert
cd cert

if [[ -f ca-key.pem || -f dev.semantic-ui.com-key.pem ]]; then
  echo "Certs already exist in docs/cert/. Delete them first if you want to regenerate."
  exit 1
fi

# CA (10 year validity)
openssl genrsa -out ca-key.pem 2048
openssl req -new -x509 -key ca-key.pem -out ca.pem -days 3650 \
  -subj "/CN=Semantic UI Dev CA/O=Semantic UI LLC"

# Server cert signed by CA
openssl genrsa -out dev.semantic-ui.com-key.pem 2048
openssl req -new -key dev.semantic-ui.com-key.pem -out temp.csr \
  -subj "/CN=dev.semantic-ui.com/O=Semantic UI LLC"
echo "subjectAltName=DNS:dev.semantic-ui.com,DNS:localhost" > san.ext
openssl x509 -req -in temp.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
  -out dev.semantic-ui.com.pem -days 3650 -extfile san.ext
rm temp.csr san.ext ca.srl

# .pfx for Windows (no password)
openssl pkcs12 -export -nokeys -in ca.pem -out ca.pfx -passout pass:

echo
echo "Certs generated in docs/cert/."
echo "Install ca.pem (or ca.pfx on Windows) in your OS trust store, then add"
echo "  127.0.0.1 dev.semantic-ui.com"
echo "to /etc/hosts. See docs/cert/README.md."

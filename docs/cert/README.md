# Local-Dev SSL Certs

Self-signed CA and server cert for `https://dev.semantic-ui.com`. Required for the docs site's REPL.

## Setup

From `docs/`:

```bash
npm run cert
```

This populates `docs/cert/` with:

- `ca.pem`, `ca-key.pem` — local CA (10 year validity)
- `ca.pfx` — Windows-trust-store form of the CA
- `dev.semantic-ui.com.pem`, `dev.semantic-ui.com-key.pem` — server cert

## Trust the CA

- **macOS**: open Keychain Access → drag `ca.pem` into the System keychain → set "Always Trust" for SSL.
- **Windows**: double-click `ca.pfx` → install into "Trusted Root Certification Authorities".
- **Linux**: `sudo cp ca.pem /usr/local/share/ca-certificates/semantic-ui-dev-ca.crt && sudo update-ca-certificates`.

## Add to hosts

`/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 dev.semantic-ui.com
```

Restart the dev server and visit `https://dev.semantic-ui.com`.

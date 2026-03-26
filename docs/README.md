Semantic UI’s documentation uses Astro and can run locally:


```bash
# from project root not docs root
npm run dev
```

> Only run `npm run dev` from project root. If you run `npm run dev` from docs it will not find linked packages from monorepo.

This command:
- Builds and watches core packages.
- Runs the Astro dev server at [http://localhost:4321](http://localhost:4321) with live reload.

To build a static copy of the docs you can run
```bash
npm build-docs
```

This is used during the Vercel deploy, and has slightly different behavior than the local server.

## Setup dev.semantic-ui.com for Playground

Install the CA certificate and modify your hosts file to redirect `https://dev.semantic-ui.com` for local testing.

This allows the playground to work with CORS and prevents browser errors from insecure connections.

### Install the CA Certificate

- **Windows:**
  1. Double-click `ca.pfx` in the `cert` directory.
  2. Click "Install Certificate," choose "Local Machine" and click "Next."
  3. Leave the password blank and click "Next."
  4. Select "Place all certificates in the following store," click Browse and choose **"Trusted Root Certification Authorities"** (not "Personal"), then click "Next" and "Finish."

- **macOS:**
  1. Double-click `ca.pem` from the `cert` directory.
  2. Keychain Access will open. Choose "System" from the dropdown and click "Add."
  3. Find the certificate in Keychain Access, double-click it, and set "When using this certificate" to "Always Trust."

- **Linux (Ubuntu/Debian):**
  1. Install to the system CA store:
  ```bash
  sudo cp cert/ca.pem /usr/local/share/ca-certificates/semantic-ui-dev-ca.crt && sudo update-ca-certificates
  ```

  2. Install to Chrome's certificate database:
  ```bash
  sudo apt install libnss3-tools
  certutil -d sql:$HOME/.pki/nssdb -A -t "CT,c,c" -n "Semantic UI Dev CA" -i cert/ca.pem
  ```

### Modify Hosts File

Add a host entry to redirect `dev.semantic-ui.com` to localhost:

- **Windows:** Open `Notepad` as Administrator, then open `C:\Windows\System32\drivers\etc\hosts` and add:

```
127.0.0.1 dev.semantic-ui.com
```

- **macOS/Linux:** Edit `/etc/hosts`:

```bash
sudo nano /etc/hosts
```

Then add the line:

```
127.0.0.1 dev.semantic-ui.com
```

Now, when running the docs server (`npm run dev`), you can visit [https://dev.semantic-ui.com](https://dev.semantic-ui.com) to test HTTPS locally.

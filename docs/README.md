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

It is recommended to install the dummy SSL cert and modify your host files to redirect `https://dev.semantic-ui.com` for lcoal testing.

This will allow you to use the playground with CORS and prevetn other errors from your browser not liking you using insecure connections.

### Install the SSL Certificate

- **Windows:**
  1. Double-click the certificate file (`cert.pem`) located in the project’s `cert` directory.
  2. Click "Install Certificate," then choose "Local Machine" and click "Next."
  3. Select "Place all certificates in the following store," choose "Trusted Root Certification Authorities," then click "Next" and "Finish."

- **macOS:**
  1. Double-click the certificate file (`cert.pem`) from the project’s `cert` directory.
  2. Keychain Access will open. Choose "System" from the dropdown and click "Add."
  3. Find the certificate in Keychain Access, double-click it, and set "When using this certificate" to "Always Trust."

- **Linux (Ubuntu/Debian):**
  1. Copy the certificate file (`cert.pem`) to `/usr/local/share/ca-certificates/`:

  ```bash
  sudo cp cert/cert.pem /usr/local/share/ca-certificates/dev-semantic-ui.crt
  ```

  2. Update the certificates:

  ```bash
  sudo update-ca-certificates
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

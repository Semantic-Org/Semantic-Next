# CDN Tooling

Cloudflare Worker + R2 upload for `cdn.semantic-ui.com`.

## Deploy Worker

The Worker is deployed manually (CI token doesn't have Workers permissions yet):

```bash
cd tools/cdn && npx wrangler deploy
```

Deploy after changing `worker/index.js`. Not needed for upload-only changes.

## Upload Files

Handled by CI on main merge (canary) and tag push (release). To run manually:

```bash
# Canary
cd tools/cdn && node upload.js --version canary

# Tagged release
cd tools/cdn && node upload.js --version 0.18.0 --latest
```

Requires `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME` env vars.

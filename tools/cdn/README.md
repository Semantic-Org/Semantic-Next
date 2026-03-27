# CDN Tooling

Cloudflare Worker + R2 upload for `cdn.semantic-ui.com`.

## Endpoints

### CSS

```
https://cdn.semantic-ui.com/css                          → latest (302 redirect)
https://cdn.semantic-ui.com/css@0.18.0                   → versioned (immutable)
https://cdn.semantic-ui.com/css@canary                   → canary (60s TTL)
https://cdn.semantic-ui.com/semantic-ui.css              → latest (legacy alias)
https://cdn.semantic-ui.com/semantic-ui@0.18.0.css       → versioned (legacy alias)
```

### Import Map

```
https://cdn.semantic-ui.com/importmap.js                 → latest loader (synchronous, inline)
https://cdn.semantic-ui.com/importmap@0.18.0.js          → versioned loader (immutable)
https://cdn.semantic-ui.com/importmap@canary.js           → canary loader
https://cdn.semantic-ui.com/importmap@0.18.0.json        → raw JSON
```

### SUI Packages (CDN format — bare imports rewritten to full URLs)

```
https://cdn.semantic-ui.com/core@0.18.0                  → framework entry point (JS)
https://cdn.semantic-ui.com/component@0.18.0             → defineComponent entry point (JS)
https://cdn.semantic-ui.com/reactivity@0.18.0            → signals/reactions (JS)
https://cdn.semantic-ui.com/query@0.18.0                 → DOM query (JS)
https://cdn.semantic-ui.com/templating@0.18.0            → template engine (JS)
https://cdn.semantic-ui.com/renderer@0.18.0              → lit renderer (JS)
https://cdn.semantic-ui.com/compiler@0.18.0              → template compiler (JS)
https://cdn.semantic-ui.com/utils@0.18.0                 → utilities (JS)
https://cdn.semantic-ui.com/specs@0.18.0                 → component specs (JS)
https://cdn.semantic-ui.com/tailwind@0.18.0              → tailwind plugin (JS)
```

Sub-path exports:
```
https://cdn.semantic-ui.com/core@0.18.0/button.min.js    → individual component
https://cdn.semantic-ui.com/specs@0.18.0/icons/meta      → sub-path (extensionless OK)
```

Full npm path alias (301 redirect to clean path):
```
https://cdn.semantic-ui.com/@semantic-ui/core@0.18.0     → redirects to /core@0.18.0
```

### Vendor Packages (third-party, CDN-rewritten)

```
https://cdn.semantic-ui.com/vendor/lit@3.3.2/index.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/directive.js
https://cdn.semantic-ui.com/vendor/lit@3.3.2/directives/repeat.js
https://cdn.semantic-ui.com/vendor/lit-element@4.2.1/lit-element.js
https://cdn.semantic-ui.com/vendor/lit-html@3.3.2/lit-html.js
https://cdn.semantic-ui.com/vendor/@lit/reactive-element@2.1.1/reactive-element.js
https://cdn.semantic-ui.com/vendor/@lit-labs/ssr-dom-shim@1.4.0/index.js
https://cdn.semantic-ui.com/vendor/tailwindcss-iso@1.0.6/src/browser/index.js
https://cdn.semantic-ui.com/vendor/tailwindcss@4.1.12/dist/lib.mjs
```

### Version Aliases

```
https://cdn.semantic-ui.com/core@latest                  → 302 to exact version
https://cdn.semantic-ui.com/core@canary                  → served directly (60s TTL)
```

`latest` updates on tagged release. `canary` updates on every main merge. Vendor packages are always pinned — no `latest`/`canary`.

### Proposed: Combo Endpoint (not yet implemented)

```
https://cdn.semantic-ui.com/core@0.18.0/button,input,modal  → custom component set
https://cdn.semantic-ui.com/core@0.18.0/standard             → preset (~15 common components)
https://cdn.semantic-ui.com/core@0.18.0/form                 → preset (form components)
```

See [cdn-combo-endpoint.md](../../ai/plans/cdn-combo-endpoint.md) for details.

## Usage Examples

### Using pre-built UI components (import map)

```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<script src="https://cdn.semantic-ui.com/importmap.js"></script>
<script type="module">
  import '@semantic-ui/core';
</script>
<ui-button primary>Click Me</ui-button>
```

### Building custom components

```html
<script type="importmap">
{
  "imports": {
    "@semantic-ui/component": "https://cdn.semantic-ui.com/component@0.18.0"
  }
}
</script>
<script type="module">
  import { defineComponent } from '@semantic-ui/component';
  defineComponent({
    tagName: 'my-counter',
    template: 'Count: {count}',
    defaultState: { count: 0 },
    onCreated({ state }) {
      setInterval(() => state.count.increment(), 1000);
    }
  });
</script>
<my-counter></my-counter>
```

### Proposed: Combo endpoint (not yet implemented)

```html
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
<script type="module" src="https://cdn.semantic-ui.com/core@0.18.0/button,input,modal"></script>
<ui-button primary>Click Me</ui-button>
```

## Operations

### Deploy Worker

Deployed manually (CI token doesn't have Workers permissions yet):

```bash
cd tools/cdn && npx wrangler deploy
```

Deploy after changing `worker/index.js`. Not needed for upload-only changes.

### Upload Files

Handled by CI on main merge (canary) and tag push (release). To run manually:

```bash
# Canary
cd tools/cdn && node upload.js --version canary

# Tagged release
cd tools/cdn && node upload.js --version 0.18.0 --latest

# Force overwrite vendor packages (one-time migration)
cd tools/cdn && node upload.js --version canary --force-vendor
```

Requires `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME` env vars.

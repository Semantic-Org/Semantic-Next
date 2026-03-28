# Agent Task: CDN Combo Endpoint

## What You're Building

A comma-separated component selector and named preset system for `cdn.semantic-ui.com`. This enables loading specific UI components with a single `<script>` tag — no import map, no configuration.

```html
<script type="module" src="https://cdn.semantic-ui.com/core@canary/button,input,modal"></script>
<link rel="stylesheet" href="https://cdn.semantic-ui.com/css">
```

## Context

Read these files first:
- `ai/plans/cdn-combo-endpoint.md` — the full plan with design decisions, URL structure, and implementation details
- `tools/cdn/README.md` — all current CDN endpoints and how they work
- `tools/cdn/worker/index.js` — the Cloudflare Worker source you'll be modifying
- `tools/cdn/upload.js` — the upload script (needs preset manifest upload)
- `CLAUDE.md` — project conventions

The CDN is already operational. SUI packages are served as CDN format files with all bare imports rewritten to full `cdn.semantic-ui.com` URLs. The Worker handles routing, version aliases, CORS, and cache headers.

## What To Implement

### 1. Worker: Combo URL Detection and Shim Generation

In `tools/cdn/worker/index.js`, add combo URL handling to the `parseRoute` function and the `sui` case in the fetch handler.

**Detection:** A request to `/core@{version}/{names}` where `{names}` contains commas OR matches a preset name (and isn't an existing file path) is a combo request.

**Shim generation:** The Worker generates a JS module that re-exports each requested component's CDN format file:

```js
// Generated for /core@canary/button,input,modal
export * from "https://cdn.semantic-ui.com/core@canary/button.js";
export * from "https://cdn.semantic-ui.com/core@canary/input.js";
export * from "https://cdn.semantic-ui.com/core@canary/modal.js";
```

The individual CDN files already have their imports rewritten to full URLs. The browser follows the import chain, deduplicates shared deps by URL identity.

**Important:** Combo endpoints are only for `core` (the UI component package). Other packages like `component`, `reactivity` etc. are served individually.

### 2. Preset Manifest

Create a preset manifest that maps preset names to component lists. Upload it to R2 at `_meta/presets.json`.

```json
{
  "standard": ["button", "input", "label", "icon", "image", "menu", "segment", "container", "divider", "card", "table", "spinner", "modal"],
  "form": ["input"],
  "layout": ["container", "segment", "rail", "divider", "card", "table"]
}
```

Note: `form` and `layout` presets are intentionally minimal right now — only list components that currently exist. They'll grow as more components are built.

The Worker should fetch presets from R2 (`_meta/presets.json`) on combo requests that match a preset name, or hardcode them in the Worker for simplicity (fewer R2 reads). Your call — either approach works.

### 3. Upload Script Updates

In `tools/cdn/upload.js`, add a step to generate and upload the preset manifest alongside the import maps.

### 4. Cache Strategy

Combo shims are tiny (<1KB) and deterministic for a given version + component list. Use the same cache headers as the version: `immutable` for tagged versions, 60s for canary, 5min for latest redirects.

### 5. Update README

Add the combo endpoint to `tools/cdn/README.md` — move it from "Proposed" to the main endpoints section.

## Testing

The CDN is live at `cdn.semantic-ui.com`. After implementing:
1. Deploy the Worker: `cd tools/cdn && npx wrangler deploy`
2. Test: `curl https://cdn.semantic-ui.com/core@canary/button,input`
3. Test preset: `curl https://cdn.semantic-ui.com/core@canary/standard`
4. Test in browser: create a test HTML page and verify components render

The test page at `docs/public/cdn-test.html` can be updated to use the combo endpoint.

## Constraints

- Combo endpoint is core package ONLY — don't add it for other packages
- The Worker runs on Cloudflare's edge — no filesystem, no Node.js APIs
- Don't modify the esbuild plugin or build scripts — this is purely Worker + upload changes
- Follow commit format: `Category: Description` (see CLAUDE.md)

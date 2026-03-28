# Agent Task: CDN Index Pages

## What You're Building

Two HTML pages for `cdn.semantic-ui.com`:
1. **Root landing page** (`cdn.semantic-ui.com/`) — quick start guide, package listing, import examples
2. **Package info page** (`cdn.semantic-ui.com/component@0.18.0`) — served when a human visits a package URL in a browser

## Context

Read these files first:
- `ai/plans/cdn-site.md` — search for "CDN Index Pages" section for the full scope
- `tools/cdn/README.md` — all current CDN endpoints, usage examples, and URL structure
- `tools/cdn/worker/index.js` — the Cloudflare Worker you'll be modifying
- `CLAUDE.md` — project conventions

Use the `frontend-design` skill for design work.

The CDN is operational. The Worker currently serves a plain text "Semantic UI CDN" for the root, and serves JS directly when a package URL has no filepath. The pages need to coexist with JS serving.

## What To Implement

### 1. Root Landing Page

Create `tools/cdn/templates/index.html` — a static HTML page that includes:

- **Quick start section** with the two main usage patterns:
  - Using pre-built components (CSS link + importmap loader + import core)
  - Building custom components (static import map + defineComponent)
- **Package grid** showing all SUI packages with descriptions
- **URL reference** — how versioning works, canary vs latest vs pinned
- **Links** to docs (next.semantic-ui.com) and GitHub

The page should be clean, professional, and match the Semantic UI visual language. No client-side framework — pure HTML/CSS. Dark mode support via `prefers-color-scheme`.

**Version numbers in examples** will need to be templated (the upload script generates the page with current versions baked in). Use `{{VERSION}}` as a placeholder that the upload script replaces.

### 2. Package Info Page

When a human visits `cdn.semantic-ui.com/component@0.18.0` in a browser, they should see an info page instead of raw JS. Use **content negotiation**: if the `Accept` header includes `text/html`, serve the info page. Otherwise, serve the JS entry point (current behavior).

The info page should show:
- Package name and version
- Entry point URL (copy-paste ready)
- Import map snippet (copy-paste ready)
- Link to docs

Create `tools/cdn/templates/package.html` as a template. The Worker generates it dynamically using the package name and version from the URL.

### 3. Worker Changes

In `tools/cdn/worker/index.js`:

**Root route:** The `case 'root'` handler currently tries to read `_meta/index.html` from R2. Update the upload script to generate and upload the landing page, OR embed it in the Worker directly (your call on the tradeoff — R2 means updating on each release, embedded means Worker redeploy).

**Package info route:** In the `case 'sui'` handler, before serving JS for the no-filepath case, check the `Accept` header:
```js
const acceptsHtml = request.headers.get('Accept')?.includes('text/html');
if (!filepath && acceptsHtml) {
  // Serve package info page
}
```

This preserves the existing behavior for ES module imports (which send `Accept: */*`) while showing a useful page for browser navigation.

### 4. Upload Script Changes

If using R2 for the landing page: in `tools/cdn/upload.js`, add a step to generate the HTML from the template (replacing `{{VERSION}}` with the current version) and upload to `_meta/index.html`.

## Design Guidelines

- Match the Semantic UI brand: clean, professional, generous whitespace
- Use the Lato font (Google Fonts) — same as the docs site
- Primary color: `#2185d0`
- Support dark mode via CSS media query
- Mobile responsive
- No JavaScript required for the pages to function
- Code examples should be syntax-highlighted via CSS (no JS highlighter)

## Testing

After implementing:
1. Deploy the Worker: `cd tools/cdn && npx wrangler deploy`
2. Visit `cdn.semantic-ui.com/` in a browser — should show landing page
3. Visit `cdn.semantic-ui.com/component@canary` in a browser — should show info page
4. `curl https://cdn.semantic-ui.com/component@canary` — should still return JS (not HTML)
5. Verify the JS serving isn't broken by the content negotiation

## Constraints

- Pure HTML/CSS — no client-side framework or build step
- Don't modify the esbuild plugin or build scripts
- The Worker runs on Cloudflare's edge — keep the HTML generation simple
- Follow commit format: `Category: Description` (see CLAUDE.md)
- Don't use emojis unless explicitly asked

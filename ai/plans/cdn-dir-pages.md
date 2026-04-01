# CDN Directory Pages

## Goal

Serve HTML info pages when users browse CDN URLs directly in a browser. Currently bare URLs either serve raw JS or 404 — a human visiting `cdn.semantic-ui.com/` or `cdn.semantic-ui.com/icons/` gets no useful context.

## Pages Needed

| URL pattern | What it shows |
|---|---|
| `cdn.semantic-ui.com/` | Root landing — quick start, import methods, package grid |
| `cdn.semantic-ui.com/core@0.18.0` | Package index — entry point, import snippet, link to docs |
| `cdn.semantic-ui.com/icons/` | Icon sets listing — available libraries, usage snippet |
| `cdn.semantic-ui.com/fonts/` | Font sets listing — available fonts, usage snippet |

## Design Considerations

- **Content negotiation** for package URLs: `Accept: text/html` → info page, otherwise → JS entry point. Icon/font dir pages are HTML-only (no competing content type).
- Pages are **static HTML** — no client-side rendering framework. Generated at build/upload time with current version numbers baked in.
- Stored in R2 at `_meta/` prefix (root landing already uses `_meta/index.html`).
- The root landing page exists in R2 but is minimal — needs a real design pass.
- Prior art: `scripts/cdn/gh-pages/index.html` (1+ years stale, structural reference only).

## Origin

Extracted from the archived [CDN Site plan](archive/cdn-site.md) (lines 233-259, "CDN Index Pages" section) which scoped this but never broke it into a standalone plan. The `/icons/` and `/fonts/` dir pages are new scope added during the CDN Asset Sets work.

## Dependencies

- [CDN Asset Sets](cdn-asset-sets.md) — icons/fonts routes must exist first

## Status

Not started. Initial scope — needs a pair session to decide design approach (template system, content negotiation details, how pages get generated/uploaded).

# CDN Directory Pages

## Goal

Serve HTML info pages when users browse CDN URLs directly in a browser. Currently bare URLs either serve raw JS or redirect — a human visiting `cdn.semantic-ui.com/` or `cdn.semantic-ui.com/icons/` gets no useful context.

## Routing: Trailing Slash

Following jsdelivr's convention: trailing slash = HTML directory page, no trailing slash = serve the asset. No content negotiation needed — path-based only.

| URL | Behavior |
|---|---|
| `/core@0.18.0` | JS entry point (existing) |
| `/core@0.18.0/` | HTML dir page — entry point, import snippet, link to docs |
| `/icons/` | HTML listing — available icon libraries, usage snippet |
| `/icons@0.18.0/` | Same, versioned |
| `/fonts/` | HTML listing — available fonts, usage snippet |
| `/` | Root landing — quick start, import methods, package grid |

Note: bare `/icons` and `/fonts` (no trailing slash) currently 302 redirect to the default set (lucide/lato). Dir pages would be the trailing-slash variant, not a replacement.

## Pages Needed

| Page | Content |
|---|---|
| Root (`/`) | Quick start snippet, import methods (combo, import map, direct), package grid with versions |
| Package index (`/core@0.18.0/`) | Entry point URL, import snippet, link to docs, list of available components |
| Icons listing (`/icons/`) | Available libraries (lucide, phosphor, tabler, material-symbols, heroicons, brands), usage snippet |
| Fonts listing (`/fonts/`) | Available fonts (lato), usage snippet |

## Design Considerations

- **Static HTML** — no client-side rendering framework. Generated at build/upload time with current version numbers baked in.
- Stored in R2 at `_meta/` prefix (root landing already uses `_meta/index.html`).
- Worker detects trailing slash and serves the corresponding dir page from R2.
- The root landing page exists in R2 but is minimal — needs a real design pass.
- Prior art: jsdelivr dir pages, `scripts/cdn/gh-pages/index.html` (1+ years stale, structural reference only).

## Origin

Extracted from the archived [CDN Site plan](archive/cdn-site.md) (lines 233-259, "CDN Index Pages" section). The `/icons/` and `/fonts/` dir pages are new scope added during the CDN Asset Sets work (2026-04-01).

## Dependencies

None — CDN Asset Sets is complete.

## Status

Not started. Initial scope — needs a pair session to decide page design and generation approach.

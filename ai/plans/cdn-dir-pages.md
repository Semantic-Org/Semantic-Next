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
| `/` | Root landing — quick start, loader reference, package directory |

Note: bare `/icons` and `/fonts` (no trailing slash) currently 302 redirect to the default set (lucide/lato). Dir pages would be the trailing-slash variant, not a replacement.

## Pages

### Root (`/`) — wireframe complete

Source of truth: `cdn-root-wireframe.html`

Two top-level tabs: **Usage** and **Directory**.

**Usage tab** contains:

| Section | Content |
|---|---|
| Quick Start | Tabbed examples — Components, Authoring, Tailwind, Reactivity, Query, Utils. Each shows a `/load` tag + working code sample in `<script type="module">`. |
| Jump To | 3-column TOC with anchor links. Full-bleed background band. |
| Customization | Components (cherry-pick), Bundles (named presets), Packages (bare attributes), Versions (`version` attr), CSS, Fonts, Icons. Each with code sample + hint. |
| Advanced | Direct ESM (skip the loader, full URLs), Embedding (`="none"` suppression), Custom Import Maps (mix SUI + third-party via standard import map), Bundle Reference (standard/extended/full table). |
| Reference | JS Loading table (all bare attributes + behavior), CSS & Assets table (css/icons/fonts attrs). |

**Directory tab** contains:

| Section | Content |
|---|---|
| Framework | `/load`, `/css`, `/css/{layer}`, `/core` |
| Packages | 9 standalone packages with npm names + descriptions |
| Assets | `/icons` (6 sets), `/fonts` (lato) |
| Vendor | lit, lit-html, lit-element, @lit/reactive-element, tailwindcss with pinned versions |
| Versioning | `@0.18.0` (immutable 1yr), `@canary` (60s), `@latest` (302, 5min), bare (=latest) |

**Open items for root page:**
- Directory tab should show current version numbers per-package (baked in at build time)
- Directory tab links should use trailing-slash hrefs pointing to sub-page dir pages
- Tailwind tab content may need revision as API evolves

### Package index (`/core@0.18.0/`) — not started

Entry point URL, import snippet, link to docs, list of available components. Component list sourced from specs at build time. Heaviest sub-page — depends on spec format.

### Icons listing (`/icons/`) — not started

Available libraries (lucide, phosphor, tabler, material-symbols, heroicons, brands), usage snippet showing `<ui-icon>` and `/load` with `icons` attribute. One code sample + one table.

### Fonts listing (`/fonts/`) — not started

Available fonts (lato), usage snippet showing `/load` with `fonts` attribute. Simplest page — one code sample, one table row.

## Design

- **Dark theme** matching SUI docs site — bg `#0f1116`, code blocks `#12151a`, accent `#5c93f5`.
- **Fonts** — Lato for body, IBM Plex Mono for code.
- **Syntax highlighting** — GitHub Dark palette with highlighted lines (blue left border).
- **Prose style** — "Use X to do Y" construction throughout. Reference voice, not persuasive. Terse, code-forward.
- **Static HTML** with vanilla JS for tabs. No framework. Generated at build/upload time with current version numbers baked in.
- **Full-bleed sections** use proper HTML structure (close container, full-width wrapper, nested container) — no negative margins.

## Import Methods

The `/load` endpoint is the primary import method. Three tiers of usage:

| Method | Audience | Description |
|---|---|---|
| `/load` with bare attributes | Most users | One script tag. Attributes declare what to load. CSS/fonts/icons auto-injected for components. |
| Custom import map | Power users | Standard `<script type="importmap">` with full CDN URLs. Mix SUI packages with third-party ESM from esm.sh, unpkg, etc. No loader needed. |
| Direct ESM | Embedders, bundlers | Raw `<link>` and `<script type="module">` tags with full URLs. You manage everything. |

The term "combo endpoint" is retired. The `/load` endpoint replaces it.

## Storage

- Stored in R2 at `_meta/` prefix (root landing uses `_meta/index.html`).
- Worker detects trailing slash and serves the corresponding dir page from R2.
- Sub-pages stored at e.g. `_meta/icons/index.html`, `_meta/fonts/index.html`, `_meta/core/0.18.0/index.html`.

## Build Integration

Dir pages are generated at build time alongside existing artifacts. Version numbers, package lists, and component enumerations are sourced from the build system and baked into static HTML. No runtime templating.

Open question: generate from a shared HTML template with variable interpolation, or maintain each page as a standalone build output? Template approach is cleaner but adds a build dependency. Standalone is simpler but risks drift between pages.

## Origin

Extracted from the archived [CDN Site plan](archive/cdn-site.md) (lines 233-259, "CDN Index Pages" section). The `/icons/` and `/fonts/` dir pages are new scope added during the CDN Asset Sets work (2026-04-01). The root page wireframe was designed in a pair session (2026-04-02) alongside the `/load` endpoint plan.

## Dependencies

- `/load` endpoint plan (scoped, not implemented)
- CDN Asset Sets (complete)

## Status

Root page wireframe complete. Sub-pages not started. Build integration not started.

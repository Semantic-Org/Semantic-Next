# Icon Sets

Each folder is a self-contained CSS file plus its SVGs, exposed through `@semantic-ui/core` as a public CSS export. Importing one of these files makes the `<ui-icon>` primitive resolve canonical names (`<ui-icon home>`, `<ui-icon search>`) to the icons that library provides.

## Consuming downstream

The stable surface is `package.json` `exports` — not the files in this directory. Always import via the public path:

```js
import '@semantic-ui/core/icon/sets/lucide.css';
// or phosphor, tabler, material-symbols, heroicons, brands
```

Swapping libraries is a one-line change. Markup stays the same.

Bundlers (Vite, Webpack, Parcel, Next, Astro, Remix, Nuxt) follow the `url('./svg/...')` references inside the CSS, copy the SVGs through to the output, and rewrite the URLs automatically. For build-step-free consumption use the CDN (`https://cdn.semantic-ui.com/icons/{set}`), not the npm files directly.

## How a set is structured

Each generated set is two pieces:

```
{library}/
  {library}.css     — :root custom properties pointing at svg/ files
  svg/              — SVG sources copied from the upstream npm package
```

The CSS has two sections:

1. **Native definitions** — `--icon-{library-native-name}: url('./svg/{file}.svg')` for every SVG present
2. **Canonical aliases** — `--icon-{canonical}: var(--icon-{library-native})` only when the canonical name differs from the library's native name

User-facing aliases (e.g. `cancel` → `close`) are **not** in CSS — they're resolved in JavaScript by the `<ui-icon>` component via `iconAliases` from `@semantic-ui/specs/icons/meta`. That keeps every set's CSS small and the alias table single-sourced.

## Rendering technique

The five generated sets (Lucide, Phosphor, Tabler, Material Symbols, Heroicons) are monochrome — they use CSS `mask-image` so icons inherit `currentColor`. The `brands` set is hand-maintained colored framework logos and uses `background-image` instead to preserve native SVG colors.

| Folder | Library | Technique |
|--------|---------|-----------|
| `lucide/` | [Lucide](https://lucide.dev) | mask |
| `phosphor/` | [Phosphor](https://phosphoricons.com) | mask |
| `tabler/` | [Tabler Icons](https://tabler.io/icons) | mask |
| `material-symbols/` | [Material Symbols](https://fonts.google.com/icons) | mask |
| `heroicons/` | [Heroicons](https://heroicons.com) | mask |
| `brands/` | Framework logos (hand-maintained) | background-image |

## Regenerating

The five monochrome sets are generated from `packages/specs/src/icons/mappings.js`. After editing that file:

```bash
cd packages/specs && npm run build:icons
```

This rebuilds `icons.meta.js`, the per-library CSS, and copies the SVGs from the installed upstream npm packages. The `brands/` set is not generated — its SVGs and CSS are edited by hand.

For the full architecture and maintenance workflows see the `icon-system` skill and `maintain-icon-vocabulary` workflow.

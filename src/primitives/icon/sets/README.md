# Icon Sets

Each folder contains a CSS file that maps CSS custom properties to SVG icons for a specific icon library. These files power the `<ui-icon>` component — when you write `<ui-icon home>`, the component resolves `--icon-home` from whichever icon set CSS is loaded on the page.

## How it works

The CSS files are generated from a central mappings file at `packages/specs/src/icons/mappings.js`. That file defines ~291 canonical icon names (like `home`, `save`, `warning`) and maps each one to the corresponding icon name in each library.

Each generated CSS file has three sections:

1. **Native definitions** — `--icon-{library-name}: url('./{library-name}.svg')` for each SVG
2. **Canonical names** — `--icon-{canonical}: var(--icon-{native})` so that markup like `<ui-icon home>` resolves to the library-specific icon (e.g., Lucide's `house`)
3. **Aliases** — `--icon-{alias}: var(--icon-{native})` for alternative names (e.g., `cancel` and `dismiss` both point to the close icon)

This means you can swap icon libraries by changing a single CSS import — all your markup stays the same.

## Regenerating

After editing `mappings.js`, regenerate the CSS files:

```
cd packages/specs
npm run icons:generate-css
```

This runs `scripts/generate-icon-css.js`, which reads the mappings and writes out `index.css` for each library.

## Libraries

| Folder | Library | Technique |
|--------|---------|-----------|
| `lucide/` | [Lucide](https://lucide.dev) | SVG mask |
| `phosphor/` | [Phosphor](https://phosphoricons.com) | SVG mask |
| `tabler/` | [Tabler Icons](https://tabler.io/icons) | SVG mask |
| `material-symbols/` | [Material Symbols](https://fonts.google.com/icons) | SVG mask |
| `heroicons/` | [Heroicons](https://heroicons.com) | SVG mask |
| `dev/` | Framework logos | SVG image (multicolor) |

All five icon libraries use the mask technique (monochrome SVGs that inherit `currentColor`). The `dev` set is a separate hand-maintained set of colored framework logos using the image technique.

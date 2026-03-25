# Icon Scripts

Scripts for building icon set CSS, metadata, and downloading SVG assets from upstream icon libraries. All scripts read from `src/icons/mappings.js` as their source of truth.

## Usage

```bash
npm run build:icons          # Run all three scripts
npm run icons:build-css      # Build CSS for all icon sets
npm run icons:build-meta     # Build icons.meta.js (icon name list)
npm run icons:download-svg   # Download SVG files from npm packages
npm run watch:icons          # Watch mappings.js and rebuild on change
```

**`icons:build-css` runs first** — the download script parses the generated CSS to determine which SVGs are needed.

## `build-icon-css.js`

Generates a CSS file for each icon set (lucide, phosphor, tabler, material-symbols, heroicons) in `src/primitives/icon/sets/<library>/`. Each CSS file contains three sections:

1. **Native Icon Definitions** — `--icon-<native-name>` pointing to the library's SVG
2. **Canonical Names** — `--icon-<canonical-name>: var(--icon-<native-name>)` aliases that map Semantic UI's standard names to library-specific names
3. **Aliases** — Additional shorthand aliases (e.g. `--icon-cancel: var(--icon-x)`)

This structure allows icon sets to be swapped without changing markup — canonical names resolve through CSS custom property indirection.

## `build-icon-meta.js`

Generates `src/icons/icons.meta.js` — a simple array export of all canonical icon names from `mappings.js`.

## `build-icon-svg.js`

Copies SVG files from installed npm packages (e.g. `lucide-static`, `@phosphor-icons/core`) into each icon set's `svg/` directory. Only downloads SVGs that are referenced in the generated CSS — install the icon library dev dependencies first (`npm install`), then run the script.

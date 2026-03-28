# Agent Task: Switch Playground Production Path to CDN

## What You're Building

Change the docs playground's production path to use `cdn.semantic-ui.com` instead of jsdelivr. This means playground examples on the production docs site will load packages from the SUI CDN.

## Context

Read these files first:
- `docs/src/helpers/injections.js` — defines `packageBase`, `suiBase`, `isStaticBuild`, `isProductionBuild`
- `docs/src/pages/examples/importmap.json.js` — generates the import map for playground examples
- `tools/cdn/README.md` — CDN endpoint reference
- `CLAUDE.md` — project conventions

Read the build system context via MCP (`contributing/build-system`) for background on how the playground consumes packages.

## Current State

The playground has three package resolution paths:

| Environment | Source | Config |
|---|---|---|
| Local dev | `dev.semantic-ui.com/node_modules/` via Vite | `isStaticBuild=false` |
| Preview deploy (Vercel) | Self-hosted from `docs/public/packages/` | `isStaticBuild=true`, `isProductionBuild=false` |
| Production (Vercel) | `cdn.jsdelivr.net/npm` | `isProductionBuild=true` |

The task: change the **production** path from jsdelivr to `cdn.semantic-ui.com`.

## What To Change

### 1. `docs/src/helpers/injections.js`

Change the production `packageBase` from jsdelivr to the SUI CDN:

```js
// Before
export const packageBase = isProductionBuild
  ? 'https://cdn.jsdelivr.net/npm'
  : isStaticBuild
    ? `${import.meta.env.SITE}/packages`
    : `${import.meta.env.SITE}/node_modules`;

const suiBase = isProductionBuild
  ? `${packageBase}/@semantic-ui/core@${PACKAGE_VERSION}`
  : `${packageBase}/@semantic-ui/core`;
```

The production `packageBase` should point to `cdn.semantic-ui.com`. The `suiBase` needs to use the CDN's clean URL format (no `@semantic-ui/` scope prefix).

The `headLibraryJS` template (around line 437) loads `${suiBase}/dist/bundle/semantic-ui.js` and `${suiBase}/dist/semantic-ui.css`. These paths need to map to what the CDN Worker serves.

**Important:** The playground loads the **bundle** format (self-contained, all deps included) via `<script>` and `<link>` tags in the sandbox iframe. It also uses the **import map** for user code in the editor. These are two separate resolution paths — both need to point at the CDN.

### 2. `docs/src/pages/examples/importmap.json.js`

The production import map currently uses jsdelivr with `+esm` suffix. Change it to use CDN bare URLs:

```js
// Before (production)
packageImports.imports[pkg] = `${packageBase}/${pkg}@${PACKAGE_VERSION}/+esm`;

// After (production)
// Use the CDN's bare URL format — Worker resolves the entry point
```

The tailwind special case at the bottom of the file can be removed since the CDN handles tailwind the same as all other packages.

### 3. Consider: Version Pinning

Production should pin to a specific version, not `canary`. Use `PACKAGE_VERSION` (from the root `package.json` via Astro's Vite define). The CDN needs to have that version uploaded — this only works after a tagged release that runs the CDN deploy workflow.

**If the version isn't on the CDN yet**, the playground will 404. For now, you could use `canary` for production too (it always exists), with a TODO to switch to `PACKAGE_VERSION` after the first tagged release with CDN deployment.

## Testing

1. Run the docs dev server: `npm run dev`
2. Open a playground example
3. Check the browser network tab — imports should resolve from `cdn.semantic-ui.com`
4. Deploy a Vercel preview and verify it works there too

## Constraints

- Don't change the local dev path (node_modules via Vite) — that stays as-is
- Don't change the preview deploy path (self-hosted from public/packages/) — that stays as-is
- Only change the production (`isProductionBuild`) path
- The playground uses `playground-elements` which runs in a service worker iframe — CORS headers on the CDN are already set
- Follow commit format: `Category: Description` (see CLAUDE.md)

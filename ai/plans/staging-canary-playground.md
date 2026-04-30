# Staging Canary Playground

## Goal

Make the playground on `staging.semantic-ui.com` exercise main-HEAD code instead of the last-published version. Today the importmap on staging either pins to `${PACKAGE_VERSION}` on jsDelivr (which 404s when main has moved past `latest`) or falls through to `isStaticBuild` self-hosting. Both paths leave a window where the docs describe features the playground can't actually run.

The CDN already serves `@canary` overwritten on every main merge with 60s TTL — `cdn.semantic-ui.com/<pkg>@canary` resolves to whatever main last built. Wiring the importmap to use it on staging deploys makes canary a real surface, not a theoretical one.

## Stopping point

Staging deploys (Vercel preview + main branch) build an importmap pointing at `cdn.semantic-ui.com/<pkg>@canary`. Production deploys (tagged) keep their current jsDelivr-pinned importmap unchanged.

Not in scope:

- Moving production off jsDelivr. jsDelivr is free for OSS and npm-backed; cdn.semantic-ui.com runs on Cloudflare R2 + Worker on the maintainer's bill. Keep production redundant and free.
- An npm `canary` dist-tag. The CDN canary covers the docs-site canary need; an npm canary is a separate (larger) decision driven by downstream-consumer demand.

## Implementation

`docs/src/pages/examples/importmap.json.js` — add a third mode alongside `isProductionBuild` / `isStaticBuild`:

```js
if (isStagingBuild) {
  packageImports.imports[pkg] = `https://cdn.semantic-ui.com/${pkg.replace('@semantic-ui/', '')}@canary`;
  continue;
}
```

The canary URLs use the bare-package format (`/component@canary`, not `/@semantic-ui/component@canary`) per the CDN's clean-path convention. Tailwind keeps its existing `bundle/tailwind.js` override since it has external deps that need bundling — same caveat as production.

`@helpers/injections.js` — add `isStagingBuild` flag. Detection logic:

```js
// Vercel sets VERCEL_ENV: 'production' | 'preview' | 'development'
// Production = tagged release. Preview = main branch + PR previews.
const isStagingBuild = process.env.VERCEL_ENV === 'preview'
  || (process.env.VERCEL_GIT_COMMIT_REF === 'main' && process.env.VERCEL_ENV !== 'production');
```

PR previews also get canary, which is the right call — a docs-changing PR's preview should run the same playground code as staging.

The mode order in `importmap.json.js` becomes: `isProductionBuild` → `isStagingBuild` → `isStaticBuild` → local dev. Production wins if both flags are somehow set (defensive).

## Smoke test

After the change deploys to staging:

1. Hit `staging.semantic-ui.com/playground` (or any example page).
2. View Network tab — confirm imports resolve to `cdn.semantic-ui.com/<pkg>@canary`, not jsDelivr.
3. Confirm a primitive renders (e.g. `ui-button`).
4. Make a trivial change to a primitive on main, push, wait for Vercel + CDN canary upload, refresh staging — change should appear within ~1 min (60s canary TTL).

Step 4 is the load-bearing one. If it fails, either Vercel didn't pick up the new flag or the CDN canary upload didn't run on the merge.

## Risk

- **Canary CDN downtime breaks staging playground.** Acceptable — staging is internal-facing; jsDelivr-on-production stays untouched. If canary is down for a stretch, fall back to flipping the staging build to `isStaticBuild` mode (which self-hosts from `dist/bundle/`).
- **Stale canary content.** 60s TTL means a regression on main can show up in staging for up to a minute after the fix lands. Tolerable for a canary surface; flagging in case it confuses a debugging session.

## Dependencies

None. CDN canary endpoints already exist (`tools/cdn/README.md`); CI already uploads canary on main merge. This plan is just wiring the docs-side importmap to consume what's already published.

## Status

`scoped` — single file change in `docs/src/pages/examples/importmap.json.js` plus a flag in `@helpers/injections.js`. Verifiable on the next staging deploy. Agent-executable.

/*
  The bundles this bot weighs, discovered from the workspace rather than
  hand-listed so new packages and primitives are picked up with no edit here.

    - packages   every `packages/*` whose build emits a bundle, measured as
                 its *bundled* min (deps inlined). That's the real shipped
                 cost and the only view where a change ripples honestly: edit
                 `reactivity` and the `component` bundle everyone ships grows
                 with it.
    - framework  the assembled `@semantic-ui/core` payload.
    - primitives the design-system entry points declared in core's `exports`,
                 measured as their *cdn* min (framework left as external URLs)
                 so a primitive row moves only on that primitive's own code,
                 not on every shared-dependency edit already shown framework-wide.

  Headline is `@semantic-ui/component` — the bundle you need to ship any
  component. When a PR doesn't move it, the reporter promotes the changed
  bundle whose package shipped the most code instead.

  The reporter tolerates a file present on only one side (a new or removed
  bundle) and skips one absent from both.
*/
import fs from 'node:fs';
import path from 'node:path';

// Packages consumed so piecemeal that their whole-package bundle is an upper
// bound, not a per-consumer cost — a new export adds bytes here but tree-shakes
// to zero for real consumers. These are still measured and shown, but they
// don't drive the severity banner. Opt-out, not opt-in: every other package
// (including ones not built yet, like form / data / sync) counts as a real
// shipped bundle by default. `utils` is pure independent functions; the rest
// of the trio (reactivity, query) are standalone products whose bundle is a
// real signal, so they stay in.
const TREE_SHAKEN = new Set(['utils']);

// org-stripped, lowercased package name — matches the build's output filename
// rule (internal-packages/scripts/src/lib/build.js).
function bundleName(pkgName) {
  return pkgName.replace(/^@[^/]+\//, '').replace(/\//g, '-').toLowerCase();
}

function discoverPackages(repoRoot) {
  const dir = path.join(repoRoot, 'packages');
  if (!fs.existsSync(dir)) { return []; }
  const out = [];
  for (const entry of fs.readdirSync(dir).sort()) {
    const pkgPath = path.join(dir, entry, 'package.json');
    if (!fs.existsSync(pkgPath)) { continue; }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.name?.startsWith('@semantic-ui/')) { continue; }
    const buildsBundle = (pkg.wireit?.build?.dependencies ?? []).includes('build:bundle');
    if (!buildsBundle) { continue; }
    const name = bundleName(pkg.name);
    out.push({
      id: `pkg-${name}`,
      label: name,
      group: 'package',
      scope: name,
      file: `packages/${entry}/dist/bundle/${name}.min.js`,
      headline: name === 'component',
      treeShaken: TREE_SHAKEN.has(name),
    });
  }
  return out;
}

// primitive names from core's public surface: any export condition resolving
// to a per-primitive dist bundle (excluding the assembled framework itself).
function discoverPrimitives(repoRoot) {
  const corePath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(corePath)) { return []; }
  const core = JSON.parse(fs.readFileSync(corePath, 'utf8'));
  const names = new Set();
  for (const conditions of Object.values(core.exports ?? {})) {
    if (typeof conditions !== 'object' || conditions === null) { continue; }
    for (const target of Object.values(conditions)) {
      if (typeof target !== 'string') { continue; }
      const m = target.match(/dist\/(?:cdn|bundle)\/([a-z0-9-]+)\.min\.js$/);
      if (m && m[1] !== 'semantic-ui') { names.add(m[1]); }
    }
  }
  return [...names].sort().map((name) => ({
    id: `prim-${name}`,
    label: name,
    group: 'primitive',
    scope: 'design-system',
    file: `dist/cdn/${name}.min.js`,
  }));
}

export function discoverTargets(repoRoot) {
  return [
    ...discoverPackages(repoRoot),
    {
      id: 'core-bundled',
      label: 'framework',
      group: 'framework',
      scope: 'design-system',
      file: 'dist/bundle/semantic-ui.min.js',
    },
    ...discoverPrimitives(repoRoot),
  ];
}

// Source counted for the lines-of-code signal: hand-authored JS that ships to
// npm (each package's `src`, plus the first-party `src/` design system).
// Generated component specs are excluded so a spec edit doesn't inflate the
// count with regenerated output.
export const locExclude = [/\.component\.js$/];

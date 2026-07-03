/*
  Source tracing for the size bot, built on esbuild's metafile. Static — no PR
  code is executed, esbuild parses only. The harness builds these itself so the
  numbers come from the main-pinned harness on both sides of the diff.

  Two instruments, both rendered sparsely (SNR is the reporter's contract):
    - bundleModules: per-module minified bytes inside a package bundle. The
      reporter reduces this to one `from` cell on a changed bundle — where the
      delta came from, never a table of everything.
    - exportCosts: the minified cost of importing each export alone, plus its
      module-graph fingerprint. Exports with the same fingerprint co-move by
      construction, so the reporter renders one row per group, named by its
      master — a single export can grow 40% while the whole-package bundle
      barely wiggles, and that is the row this exists to show.
*/
import fs from 'node:fs';
import path from 'node:path';

import * as esbuild from 'esbuild';

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const CONCURRENCY = 8;

export function packageInfo(repoRoot, packageDir) {
  const packagePath = path.join(repoRoot, 'packages', packageDir, 'package.json');
  if (!fs.existsSync(packagePath)) { return null; }
  const packageFile = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const entryRelative = packageFile.module ?? packageFile.main ?? 'src/index.js';
  const entry = path.join(repoRoot, 'packages', packageDir, entryRelative);
  if (!fs.existsSync(entry)) { return null; }
  // third-party dependencies stay external like the package build. workspace siblings bundle in,
  // matching the shipped composition — cross-package retention (component growing because of
  // utils) is the attribution case that matters most
  const external = Object.keys({
    ...packageFile.dependencies,
    ...packageFile.peerDependencies,
  }).filter((dep) => !isWorkspacePackage(repoRoot, dep));
  return { entry, external, name: packageFile.name };
}

function isWorkspacePackage(repoRoot, dep) {
  const dir = dep.replace(/^@[^/]+\//, '');
  return fs.existsSync(path.join(repoRoot, 'packages', dir, 'package.json'));
}

async function build(repoRoot, options) {
  return esbuild.build({
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    metafile: true,
    logLevel: 'silent',
    absWorkingDir: path.resolve(repoRoot),
    ...options,
  });
}

// 'packages/utils/src/strings.js' / 'node_modules/@semantic-ui/utils/src/strings.js' -> 'utils/strings.js'
export function moduleKey(inputPath) {
  const normalized = inputPath.replace(/\\/g, '/');
  const viaPackages = /^packages\/([^/]+)\/src\/(.+)$/.exec(normalized);
  if (viaPackages) { return `${viaPackages[1]}/${viaPackages[2]}`; }
  const viaNodeModules = /^node_modules\/@[^/]+\/([^/]+)\/src\/(.+)$/.exec(normalized);
  if (viaNodeModules) { return `${viaNodeModules[1]}/${viaNodeModules[2]}`; }
  return normalized;
}

export async function bundleModules(repoRoot, { entry, external }) {
  const result = await build(repoRoot, { entryPoints: [entry], external });
  const output = Object.values(result.metafile.outputs)[0];
  const modules = {};
  for (const [inputPath, input] of Object.entries(output.inputs)) {
    const key = moduleKey(inputPath);
    modules[key] = (modules[key] ?? 0) + input.bytesInOutput;
  }
  return modules;
}

export async function listExports(repoRoot, { entry, external }) {
  const result = await build(repoRoot, { entryPoints: [entry], external, minify: false });
  const output = Object.values(result.metafile.outputs)[0];
  return (output.exports ?? []).filter((name) => IDENTIFIER.test(name)).sort();
}

export async function exportCosts(repoRoot, { entry, external }, names) {
  const costs = {};
  for (let i = 0; i < names.length; i += CONCURRENCY) {
    const chunk = names.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(async (name) => {
      try {
        // alias the binding so reserved-word export names (default, new) import legally
        const result = await build(repoRoot, {
          external,
          stdin: {
            contents: `import { ${name} as probe } from ${JSON.stringify(entry)}; console.log(probe);`,
            resolveDir: repoRoot,
            loader: 'js',
          },
        });
        const output = Object.values(result.metafile.outputs)[0];
        // the fingerprint: exports sharing a graph co-move, the reporter groups on it
        const graph = Object.keys(output.inputs)
          .filter((input) => !input.startsWith('<'))
          .map(moduleKey)
          .sort()
          .join('|');
        return [name, { cost: result.outputFiles[0].contents.length, graph }];
      }
      catch {
        // an unpriceable export (removed, renamed) reads as absent — the reporter
        // renders a group that lost its last member as removed
        return null;
      }
    }));
    for (const priced of results) {
      if (priced) { costs[priced[0]] = priced[1]; }
    }
  }
  return costs;
}

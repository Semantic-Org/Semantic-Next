import * as esbuild from 'esbuild';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';
import { CDN_CONFIG } from './lib/config.js';

/*
  Builds CDN-ready versions of vendor (third-party) packages.
  Rewrites all bare module imports to cdn.semantic-ui.com/vendor/ URLs.

  Output: dist/vendor-cdn/{package}/{entrypoint}
*/

const ROOT = process.env.BASE_DIR || process.cwd();
const OUT_DIR = join(ROOT, 'dist', 'vendor-cdn');

// Vendor packages and their entry points to build
// Each entry maps sub-paths to source files relative to node_modules
function getVendorEntries() {
  const entries = [];

  // Recursively discover all vendor packages starting from SUI deps
  const vendorDeps = new Map();
  const visited = new Set();
  const packagesDir = join(ROOT, 'packages');
  const suiPackages = readdirSync(packagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  function addVendorDeps(deps) {
    for (const [dep, version] of Object.entries(deps)) {
      if (dep.startsWith('@semantic-ui/')) { continue; }
      if (visited.has(dep)) { continue; }
      visited.add(dep);
      vendorDeps.set(dep, version);

      // Recursively add this package's dependencies
      const depPkgPath = join(ROOT, 'node_modules', ...dep.split('/'), 'package.json');
      if (existsSync(depPkgPath)) {
        const depPkg = JSON.parse(readFileSync(depPkgPath, 'utf-8'));
        addVendorDeps({ ...depPkg.dependencies, ...depPkg.peerDependencies });
      }
    }
  }

  for (const pkg of suiPackages) {
    const pkgJson = JSON.parse(readFileSync(join(packagesDir, pkg, 'package.json'), 'utf-8'));
    addVendorDeps({ ...pkgJson.dependencies, ...pkgJson.peerDependencies });
  }

  const rootPkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  addVendorDeps(rootPkg.peerDependencies || {});

  // For each vendor dep, find entry points from exports
  for (const [packageName] of vendorDeps) {
    const pkgDir = join(ROOT, 'node_modules', ...packageName.split('/'));
    const pkgJsonPath = join(pkgDir, 'package.json');
    if (!existsSync(pkgJsonPath)) { continue; }

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    const version = pkgJson.version;
    const exports = pkgJson.exports;

    if (!exports) {
      // Simple package with just a main entry
      const entry = pkgJson.module || pkgJson.main;
      if (entry) {
        entries.push({
          packageName,
          version,
          subpath: '.',
          source: join(pkgDir, entry),
          outfile: join(OUT_DIR, packageName, version, entry.replace(/^\.\//, '')),
        });
      }
      continue;
    }

    // Walk exports to find all JS entry points
    for (const [exportPath, conditions] of Object.entries(exports)) {
      // Skip server-only export paths
      if (exportPath.includes('server') || exportPath.includes('node')) { continue; }

      let source;
      if (typeof conditions === 'string') {
        source = conditions;
      }
      else if (typeof conditions === 'object') {
        // Skip exports that only have node/default (no browser entry)
        if (conditions.node && !conditions.browser && !conditions.import) { continue; }
        // Prefer browser-compatible entry
        source = conditions.browser || conditions.import || conditions.module || conditions.default;
        // Handle nested conditions (e.g., lit's browser.development/default)
        if (typeof source === 'object') {
          source = source.default || source.development || source.production;
        }
      }

      if (!source || typeof source !== 'string') { continue; }
      if (!source.endsWith('.js') && !source.endsWith('.mjs')) { continue; }
      // Skip types
      if (source.includes('.d.')) { continue; }

      const sourcePath = join(pkgDir, source);
      if (!existsSync(sourcePath)) { continue; }

      const outPath = join(OUT_DIR, packageName, version, source.replace(/^\.\//, ''));

      entries.push({
        packageName,
        version,
        subpath: exportPath,
        source: sourcePath,
        outfile: outPath,
      });
    }
  }

  return entries;
}

// Collect all vendor dependencies and their versions for the resolver
function getAllVendorDeps() {
  const deps = {};
  const packagesDir = join(ROOT, 'packages');
  const suiPackages = readdirSync(packagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const pkg of suiPackages) {
    const pkgJson = JSON.parse(readFileSync(join(packagesDir, pkg, 'package.json'), 'utf-8'));
    Object.assign(deps, pkgJson.dependencies || {}, pkgJson.peerDependencies || {});
  }

  // Add root peerDeps
  const rootPkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  Object.assign(deps, rootPkg.peerDependencies || {});

  return deps;
}

function getInstalledVersion(packageName) {
  let dir = ROOT;
  while (dir !== resolve(dir, '..')) {
    const pkgPath = join(dir, 'node_modules', ...packageName.split('/'), 'package.json');
    if (existsSync(pkgPath)) {
      return JSON.parse(readFileSync(pkgPath, 'utf-8')).version;
    }
    dir = resolve(dir, '..');
  }
  return null;
}

function getVendorEntrypoint(packageName) {
  const pkgPath = join(ROOT, 'node_modules', ...packageName.split('/'), 'package.json');
  if (!existsSync(pkgPath)) { return null; }
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const mainExport = pkg.exports?.['.'];
    if (mainExport && typeof mainExport === 'object') {
      let source = mainExport.browser || mainExport.import || mainExport.module || mainExport.default;
      if (typeof source === 'object') {
        source = source.default || source.development || source.production;
      }
      if (typeof source === 'string') { return source.replace(/^\.\//, ''); }
    }
    const entry = pkg.module || pkg.main;
    if (entry) { return entry.replace(/^\.\//, ''); }
  }
  catch { /* fall through */ }
  return null;
}

async function buildVendorCDN() {
  const entries = getVendorEntries();
  const allDeps = getAllVendorDeps();

  console.log(`Building CDN format for ${entries.length} vendor entry points...`);

  const SUI_SCOPE = '@semantic-ui/';
  const cdnRoot = CDN_CONFIG.cdnRoot;

  for (const entry of entries) {
    mkdirSync(dirname(entry.outfile), { recursive: true });

    // Merge all deps: SUI deps + this vendor package's own deps
    const vendorPkgJson = JSON.parse(readFileSync(
      join(ROOT, 'node_modules', ...entry.packageName.split('/'), 'package.json'),
      'utf-8',
    ));
    const vendorDeps = {
      ...allDeps,
      ...vendorPkgJson.dependencies,
      ...vendorPkgJson.peerDependencies,
    };

    try {
      await esbuild.build({
        entryPoints: [entry.source],
        outfile: entry.outfile,
        format: 'esm',
        bundle: true,
        platform: 'browser',
        sourcemap: true,
        loader: { '.wasm': 'file' },
        plugins: [
          resolveBareImports({
            packageJson: { dependencies: vendorDeps, peerDependencies: {} },
            cdnRoot,
            resolveEntrypoint(packageName) {
              if (packageName.startsWith(SUI_SCOPE)) {
                return '';
              }
              return getVendorEntrypoint(packageName);
            },
            resolveVersion(packageName, declaredVersion) {
              if (packageName.startsWith(SUI_SCOPE)) {
                if (process.env.CDN_CHANNEL === 'canary') { return 'canary'; }
                return declaredVersion;
              }
              return getInstalledVersion(packageName) || declaredVersion;
            },
            resolvePackagePath(packageName) {
              if (packageName.startsWith(SUI_SCOPE)) {
                return packageName.slice(SUI_SCOPE.length);
              }
              return `vendor/${packageName}`;
            },
          }),
        ],
        logLevel: 'warning',
      });
    }
    catch (err) {
      console.warn(`  Failed to build ${entry.packageName}/${entry.subpath}: ${err.message}`);
      continue;
    }
  }

  console.log(`Vendor CDN build complete → dist/vendor-cdn/`);
}

buildVendorCDN();

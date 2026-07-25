/**
 * Pre-deploy smoke test: scan CDN build output for unresolvable imports.
 *
 * Two failure modes are checked:
 *
 * 1. Bare imports (e.g. from "@lit/reactive-element") work with import maps
 *    but break when loaded directly via the combo endpoint. All imports in
 *    CDN format files must be rewritten to full cdn.semantic-ui.com URLs.
 *
 * 2. Rewritten /vendor/ URLs must correspond to a file the vendor build
 *    actually emitted. The rewriter (lib/config.js) and the vendor build
 *    (build-vendor-cdn.js) resolve export conditions independently, so any
 *    drift between them ships a bundle importing a file that does not exist.
 *
 * Scans each file for import/export statements anchored to statement
 * boundaries (^ or ;), ignoring string literals in minified code.
 *
 * Usage: node check-bare-imports.js
 * Runs automatically in CI before upload.
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import glob from 'tiny-glob';

import { parseRoute } from './worker/index.js';

const ROOT = resolve(import.meta.dirname, '../..');
const VENDOR_DIR = resolve(ROOT, 'dist', 'vendor-cdn');

// Bare = doesn't start with . / or a URL scheme
const isBare = (specifier) => /^[^./]/.test(specifier) && !specifier.includes('://');

// Resolve a /vendor/ URL back to the file the vendor build should have emitted.
// routing comes from the Worker itself so this check cannot drift from what actually serves
function vendorTarget(specifier) {
  let pathname;
  try {
    ({ pathname } = new URL(specifier));
  }
  catch {
    return null;
  }

  const route = parseRoute(pathname);
  if (route.type !== 'vendor') { return null; }

  const { name, version, filepath } = route;
  return {
    relative: `${name}/${version}/${filepath}`,
    absolute: resolve(VENDOR_DIR, ...name.split('/'), version, filepath),
  };
}

let bareErrors = 0;
let missingErrors = 0;

async function checkDir(dir, label) {
  let files;
  try {
    files = await glob(`${dir}/**/*.{js,mjs}`, { cwd: ROOT });
  }
  catch {
    console.warn(`  ${label}: directory not found, skipping`);
    return;
  }

  files = files.filter(f => !f.endsWith('.map'));
  if (files.length === 0) {
    console.warn(`  ${label}: no files found`);
    return;
  }

  let checked = 0;
  for (const file of files) {
    const raw = readFileSync(resolve(ROOT, file), 'utf-8');

    // Strip banner comment so regex anchors start at real code
    const code = raw.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '');

    // Match import/export-from and side-effect imports anchored to statement boundaries
    const fromStatements = code.matchAll(/(?:^|;)\s*(?:import|export)\b[^;]*?\bfrom\s*["']([^"']+)["']/g);
    const sideEffects = code.matchAll(/(?:^|;)\s*import\s*["']([^"']+)["']/g);

    for (const match of [...fromStatements, ...sideEffects]) {
      const specifier = match[1];

      if (isBare(specifier)) {
        console.error(`  BARE IMPORT in ${file}`);
        console.error(`    ${specifier}`);
        bareErrors++;
        continue;
      }

      const target = vendorTarget(specifier);
      if (target && !existsSync(target.absolute)) {
        console.error(`  MISSING VENDOR FILE referenced by ${file}`);
        console.error(`    ${specifier}`);
        console.error(`    expected dist/vendor-cdn/${target.relative}`);
        missingErrors++;
      }
    }
    checked++;
  }

  console.log(`  ${label}: ${checked} files checked`);
}

console.log('Checking for bare imports in CDN build output...\n');

await checkDir('dist/cdn', 'SUI components');
await checkDir('dist/vendor-cdn', 'Vendor packages');
await checkDir('packages/*/dist/cdn', 'SUI packages');

console.log('');
if (bareErrors > 0) {
  console.error(`FAILED: ${bareErrors} bare import(s) found. These will break without an import map.`);
}
if (missingErrors > 0) {
  console.error(`FAILED: ${missingErrors} vendor URL(s) reference files the vendor build did not emit.`);
  console.error('Check that build-vendor-cdn.js ran and resolves the same export condition as lib/config.js.');
}

if (bareErrors > 0 || missingErrors > 0) {
  process.exit(1);
}
console.log('OK: No bare imports, all vendor URLs resolve.');

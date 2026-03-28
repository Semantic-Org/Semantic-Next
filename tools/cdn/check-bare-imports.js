/**
 * Pre-deploy smoke test: scan CDN build output for bare module imports.
 *
 * Bare imports (e.g. from "@lit/reactive-element") work with import maps
 * but break when loaded directly via the combo endpoint. All imports in
 * CDN format files must be rewritten to full cdn.semantic-ui.com URLs.
 *
 * Only checks the import block at the top of each file — ES module
 * imports must appear before any other statements.
 *
 * Usage: node check-bare-imports.js
 * Runs automatically in CI before upload.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import glob from 'tiny-glob';

const ROOT = resolve(import.meta.dirname, '../..');

// Bare = doesn't start with . / or a URL scheme
const isBare = (specifier) => /^[^./]/.test(specifier) && !specifier.includes('://');

let errors = 0;

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
    const content = readFileSync(resolve(ROOT, file), 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trimStart();

      // Skip empty lines, comments, and banners at the top
      if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        continue;
      }

      // Stop at first line that isn't an import/export-from statement
      if (!trimmed.startsWith('import') && !trimmed.startsWith('export')) {
        break;
      }

      // Extract specifiers from this line
      const matches = trimmed.matchAll(/\bfrom\s*["']([^"']+)["']/g);
      const sideEffects = trimmed.matchAll(/\bimport\s*["']([^"']+)["']/g);

      for (const match of [...matches, ...sideEffects]) {
        if (isBare(match[1])) {
          console.error(`  BARE IMPORT in ${file}`);
          console.error(`    ${match[1]}`);
          errors++;
        }
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
if (errors > 0) {
  console.error(`FAILED: ${errors} bare import(s) found. These will break without an import map.`);
  process.exit(1);
}
else {
  console.log('OK: No bare imports found.');
}

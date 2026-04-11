/**
 * Pre-deploy smoke test: verify sourcemaps exist alongside CDN build output.
 *
 * Every .min.js and .min.css file in the CDN dist directories must have a
 * corresponding .map file, and must contain a sourceMappingURL comment
 * pointing to that map.
 *
 * Usage: node check-sourcemaps.js
 * Runs automatically in CI before upload.
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import glob from 'tiny-glob';

const ROOT = resolve(import.meta.dirname, '../..');

let errors = 0;

function checkFile(filePath) {
  const mapPath = `${filePath}.map`;
  const relPath = filePath.replace(ROOT + '/', '');
  const relMapPath = mapPath.replace(ROOT + '/', '');

  // Check .map file exists
  if (!existsSync(mapPath)) {
    console.error(`  MISSING MAP: ${relMapPath}`);
    console.error(`    for: ${relPath}`);
    errors++;
    return;
  }

  // Check sourceMappingURL comment
  const content = readFileSync(filePath, 'utf-8');
  const expectedMapName = relMapPath.split('/').pop();

  const jsMatch = content.match(/\/\/# sourceMappingURL=(\S+)/);
  const cssMatch = content.match(/\/\*# sourceMappingURL=(\S+)\s*\*\//);
  const match = jsMatch || cssMatch;

  if (!match) {
    console.error(`  MISSING sourceMappingURL: ${relPath}`);
    errors++;
    return;
  }

  if (match[1] !== expectedMapName) {
    console.error(`  WRONG sourceMappingURL in ${relPath}`);
    console.error(`    expected: ${expectedMapName}`);
    console.error(`    found:    ${match[1]}`);
    errors++;
  }
}

async function checkDir(pattern, label) {
  let files;
  try {
    files = await glob(pattern, { cwd: ROOT });
  }
  catch {
    console.warn(`  ${label}: directory not found, skipping`);
    return;
  }

  if (files.length === 0) {
    console.warn(`  ${label}: no minified files found`);
    return;
  }

  for (const file of files) {
    checkFile(resolve(ROOT, file), label);
  }
  console.log(`  ${label}: ${files.length} files checked`);
}

console.log('Checking sourcemaps in CDN build output...\n');

await checkDir('dist/cdn/**/*.min.{js,css}', 'SUI components');
await checkDir('packages/*/dist/cdn/**/*.min.js', 'SUI packages');

// Framework CSS (served from dist/, not dist/cdn/)
const frameworkCSS = resolve(ROOT, 'dist/semantic-ui.min.css');
if (existsSync(frameworkCSS)) {
  checkFile(frameworkCSS, 'Framework CSS');
  console.log('  Framework CSS: checked');
}
else {
  console.warn('  Framework CSS: dist/semantic-ui.min.css not found, skipping');
}

console.log('');
if (errors > 0) {
  console.error(`FAILED: ${errors} sourcemap issue(s) found.`);
  process.exit(1);
}
else {
  console.log('OK: All sourcemaps present and correctly referenced.');
}

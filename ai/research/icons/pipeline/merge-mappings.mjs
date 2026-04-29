// Merge per-library cross-mapping data into packages/specs/src/icons/mappings.js.
//
// Inputs (default): {library}.json files in this directory, format:
//   { "icon-name": { "value": "library-native-name", "reason": "..." } }
//
// Behavior:
//   - Fill mode (default): replaces empty-string placeholders only ('lucide: '' -> 'lucide: 'house'').
//     Safe to re-run; leaves populated values alone. Use this after adding new entries to
//     mappings.js with empty library fields.
//   - Update mode (--update): overwrites existing values too. Use when an upstream library
//     rename means the current value in mappings.js is stale.
//
// Usage:
//   node merge-mappings.mjs [--library lucide|phosphor|tabler|material|heroicons] [--update]
//   node merge-mappings.mjs --library phosphor --update
//
// Library aliases: 'material' -> materialSymbols field.

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(dir, '../../../..');
const mappingsPath = join(repoRoot, 'packages/specs/src/icons/mappings.js');

const libraryFields = {
  lucide: 'lucide',
  phosphor: 'phosphor',
  tabler: 'tabler',
  material: 'materialSymbols',
  heroicons: 'heroicons',
};

const args = process.argv.slice(2);
const update = args.includes('--update');
const libIdx = args.indexOf('--library');
const onlyLib = libIdx >= 0 ? args[libIdx + 1] : null;

if (onlyLib && !libraryFields[onlyLib]) {
  console.error(`Unknown library: ${onlyLib}. Choices: ${Object.keys(libraryFields).join(', ')}`);
  process.exit(1);
}

const merged = {};

for (const [prefix, field] of Object.entries(libraryFields)) {
  if (onlyLib && prefix !== onlyLib) { continue; }
  merged[field] = {};
  const path = join(dir, `${prefix}.json`);
  if (!existsSync(path)) {
    console.warn(`  MISSING: ${prefix}.json`);
    continue;
  }
  const data = JSON.parse(readFileSync(path, 'utf8'));
  for (const [icon, entry] of Object.entries(data)) {
    const value = (typeof entry === 'object' && entry !== null)
      ? (entry.value !== undefined ? entry.value : entry)
      : entry;
    merged[field][icon] = value;
  }
  console.log(`Loaded ${prefix}.json: ${Object.keys(data).length} entries`);
}

let src = readFileSync(mappingsPath, 'utf8');
const stats = { replaced: 0, nulled: 0, updated: 0, missing: 0, unchanged: 0 };

for (const [field, iconMap] of Object.entries(merged)) {
  for (const [icon, value] of Object.entries(iconMap)) {
    const target = (value === null || value === undefined) ? 'null' : `'${value}'`;
    const escaped = icon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const fillRe = new RegExp(`('${escaped}':\\s*\\{[^}]*?)(${field}:\\s*)'()'`, 's');
    if (fillRe.test(src)) {
      src = src.replace(fillRe, `$1$2${target}`);
      if (target === 'null') { stats.nulled++; }
      else { stats.replaced++; }
      continue;
    }

    if (update) {
      const updateRe = new RegExp(`('${escaped}':\\s*\\{[^}]*?)(${field}:\\s*)('[^']*'|null)`, 's');
      const match = src.match(updateRe);
      if (match) {
        if (match[3] !== target) {
          src = src.replace(updateRe, `$1$2${target}`);
          stats.updated++;
        }
        else {
          stats.unchanged++;
        }
        continue;
      }
    }
    else {
      const presentRe = new RegExp(`'${escaped}':\\s*\\{[^}]*?${field}:\\s*('[^']+'|null)`, 's');
      if (presentRe.test(src)) {
        stats.unchanged++;
        continue;
      }
    }

    console.warn(`  NOT FOUND: ${icon}.${field} = ${target}`);
    stats.missing++;
  }
}

writeFileSync(mappingsPath, src);

console.log('\n--- Merge Results ---');
console.log(`Filled:    ${stats.replaced} (empty -> value)`);
console.log(`Nulled:    ${stats.nulled} (empty -> null)`);
if (update) { console.log(`Updated:   ${stats.updated} (overwrite existing)`); }
console.log(`Unchanged: ${stats.unchanged}`);
console.log(`Not found: ${stats.missing} (entry missing in mappings.js)`);

const totalEmpty = (src.match(/:\s*''/g) || []).length;
if (totalEmpty === 0) {
  console.log('\nAll fields populated.');
}
else {
  console.log(`\n${totalEmpty} empty fields remaining`);
}

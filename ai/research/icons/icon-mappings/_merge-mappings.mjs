import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const mappingsPath = join(dir, 'mappings.js');

// Library keys in the mappings file
const libraries = {
  lucide: 'lucide',
  phosphor: 'phosphor',
  tabler: 'tabler',
  material: 'materialSymbols',
  heroicons: 'heroicons',
};

const groups = ['A', 'B', 'C', 'D', 'E'];

// Merge all JSON fragments for each library
const merged = {}; // { libraryField: { iconName: value } }

for (const [filePrefix, fieldName] of Object.entries(libraries)) {
  merged[fieldName] = {};
  for (const group of groups) {
    const jsonPath = join(dir, `_${filePrefix}-${group}.json`);
    if (!existsSync(jsonPath)) {
      console.warn(`  MISSING: _${filePrefix}-${group}.json`);
      continue;
    }
    const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
    for (const [iconName, entry] of Object.entries(data)) {
      const value = (typeof entry === 'object' && entry !== null)
        ? (entry.value !== undefined ? entry.value : entry)
        : entry;
      merged[fieldName][iconName] = value;
    }
    console.log(`  Loaded _${filePrefix}-${group}.json (${Object.keys(data).length} icons)`);
  }
  console.log(`${fieldName}: ${Object.keys(merged[fieldName]).length} total icons\n`);
}

// Read the mappings file
let src = readFileSync(mappingsPath, 'utf8');

// Track stats
const stats = { replaced: 0, nulled: 0, missing: 0, alreadySet: 0 };

// For each library field, replace '' values with merged values
for (const [fieldName, iconMap] of Object.entries(merged)) {
  // Match pattern:  'iconName': { ... fieldName: '' ... }
  // We need to find each icon entry and replace the specific field
  for (const [iconName, value] of Object.entries(iconMap)) {
    if (value === null || value === undefined) {
      // Replace '' with null for this field in this icon's entry
      const re = new RegExp(
        `('${escapeRegex(iconName)}':\\s*\\{[^}]*?)(${fieldName}:\\s*)'()'`,
        's',
      );
      if (re.test(src)) {
        src = src.replace(re, `$1$2null`);
        stats.nulled++;
      }
      continue;
    }

    // Replace '' with the actual value
    const re = new RegExp(
      `('${escapeRegex(iconName)}':\\s*\\{[^}]*?)(${fieldName}:\\s*)'()'`,
      's',
    );
    if (re.test(src)) {
      src = src.replace(re, `$1$2'${value}'`);
      stats.replaced++;
    }
    else {
      // Check if already set (not empty string)
      const checkRe = new RegExp(
        `'${escapeRegex(iconName)}':\\s*\\{[^}]*?${fieldName}:\\s*'[^']+'`,
        's',
      );
      if (checkRe.test(src)) {
        stats.alreadySet++;
      }
      else {
        console.warn(`  NOT FOUND: ${iconName}.${fieldName} = '${value}'`);
        stats.missing++;
      }
    }
  }
}

writeFileSync(mappingsPath, src);

console.log('\n--- Merge Results ---');
console.log(`Replaced:    ${stats.replaced} (empty -> value)`);
console.log(`Nulled:      ${stats.nulled} (empty -> null)`);
console.log(`Already set: ${stats.alreadySet} (skipped)`);
console.log(`Not found:   ${stats.missing} (entry missing in mappings.js)`);

// Count remaining empty strings per library
for (const fieldName of Object.values(libraries)) {
  const emptyCount = (src.match(new RegExp(`${fieldName}:\\s*''`, 'g')) || []).length;
  if (emptyCount > 0) {
    console.log(`\nWARNING: ${emptyCount} empty values remaining for ${fieldName}`);
  }
}

const totalEmpty = (src.match(/:\s*''/g) || []).length;
if (totalEmpty === 0) {
  console.log('\nAll fields populated!');
}
else {
  console.log(`\n${totalEmpty} total empty fields remaining`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

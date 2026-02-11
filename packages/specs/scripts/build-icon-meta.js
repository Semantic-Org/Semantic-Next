import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { iconMappings } from '../src/icons/mappings.js';

const iconsDir = join(dirname(fileURLToPath(import.meta.url)), '../src/icons');
const names = Object.keys(iconMappings);

const aliases = {};
for (const [name, mapping] of Object.entries(iconMappings)) {
  if (mapping.aliases?.length) {
    for (const alias of mapping.aliases) {
      aliases[alias] = name;
    }
  }
}

const out = [
  '// Auto-generated — do not edit',
  `export const iconNames = ${JSON.stringify(names, null, 2)};`,
  '',
  `export const iconAliases = ${JSON.stringify(aliases, null, 2)};`,
  '',
].join('\n');

writeFileSync(join(iconsDir, 'icons.meta.js'), out);
console.log(`Generated icons.meta.js with ${names.length} icons and ${Object.keys(aliases).length} aliases`);

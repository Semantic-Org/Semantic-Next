import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { iconMappings } from '../src/icons/mappings.js';

const iconsDir = join(dirname(fileURLToPath(import.meta.url)), '../src/icons');
const names = Object.keys(iconMappings);

// Build grouped alias arrays: [canonical, alias1, alias2, ...]
const aliasGroups = [];
let aliasCount = 0;
for (const [name, mapping] of Object.entries(iconMappings)) {
  if (mapping.aliases?.length) {
    aliasGroups.push([name, ...mapping.aliases]);
    aliasCount += mapping.aliases.length;
  }
}

const out = [
  '// Auto-generated — do not edit',
  `export const iconNames = ${JSON.stringify(names, null, 2)};`,
  '',
  `export const iconAliasGroups = ${JSON.stringify(aliasGroups)};`,
  '// Grouped format reduces bundle size ~40% vs flat object — expanded once at module load',
  'function expandAliases(groups) {',
  '  const aliases = {};',
  '  for (const [canonical, ...names] of groups) {',
  '    for (const name of names) aliases[name] = canonical;',
  '  }',
  '  return aliases;',
  '}',
  'export const iconAliases = expandAliases(iconAliasGroups);',
  '',
].join('\n');

writeFileSync(join(iconsDir, 'icons.meta.js'), out);
console.log(
  `Generated icons.meta.js with ${names.length} icons and ${aliasCount} aliases in ${aliasGroups.length} groups`,
);

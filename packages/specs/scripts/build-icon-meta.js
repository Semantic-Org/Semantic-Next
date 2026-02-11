import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { iconMappings } from '../src/icons/mappings.js';

const iconsDir = join(dirname(fileURLToPath(import.meta.url)), '../src/icons');
const names = Object.keys(iconMappings);
const out = `// Auto-generated — do not edit\nexport const iconNames = ${JSON.stringify(names, null, 2)};\n`;

writeFileSync(join(iconsDir, 'icons.meta.js'), out);
console.log(`Generated icons.meta.js with ${names.length} icons`);

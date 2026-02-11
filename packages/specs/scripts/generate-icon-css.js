import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { iconMappings as mappings } from '../src/icons/mappings.js';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const setsDir = join(scriptsDir, '../../../src/primitives/icon/sets');

const libraries = {
  lucide: { dir: 'lucide', field: 'lucide', label: 'Lucide Icons' },
  phosphor: { dir: 'phosphor', field: 'phosphor', label: 'Phosphor Icons' },
  tabler: { dir: 'tabler', field: 'tabler', label: 'Tabler Icons' },
  materialSymbols: { dir: 'material-symbols', field: 'materialSymbols', label: 'Material Symbols' },
  heroicons: { dir: 'heroicons', field: 'heroicons', label: 'Heroicons' },
};

import { ICON_CATEGORIES } from '../src/icons/index.js';
const categoryOrder = ICON_CATEGORIES;

function categoryLabel(cat) {
  return cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

for (const [libKey, lib] of Object.entries(libraries)) {
  // Collect data grouped by category
  const byCategory = {};
  const nativeSeen = new Set();

  for (const [canonical, entry] of Object.entries(mappings)) {
    const native = entry[lib.field];
    if (native === null || native === undefined || native === '') { continue; }

    const cat = entry.category;
    if (!byCategory[cat]) { byCategory[cat] = { natives: [], canonicals: [], aliases: [] }; }
    const bucket = byCategory[cat];

    // Section 1: native definitions (deduplicated)
    if (!nativeSeen.has(native)) {
      nativeSeen.add(native);
      bucket.natives.push({ native, canonical });
    }

    // Section 2: canonical mapping (only when name differs from native)
    if (canonical !== native) {
      bucket.canonicals.push({ canonical, native });
    }

    // Section 3: aliases
    if (entry.aliases) {
      for (const alias of entry.aliases) {
        if (alias === native || alias === canonical) { continue; }
        bucket.aliases.push({ alias, native });
      }
    }
  }

  // Sort categories
  const cats = Object.keys(byCategory).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Build CSS
  let css = `/* ${lib.label} (Mask-based) */\n:root {\n`;

  // Section 1: Native Icon Definitions
  css += '\n  /* ==============================\n';
  css += '   * Native Icon Definitions\n';
  css += '   * ============================== */\n';
  for (const cat of cats) {
    const { natives } = byCategory[cat];
    if (natives.length === 0) { continue; }
    css += `\n  /* ${categoryLabel(cat)} */\n`;
    for (const { native } of natives) {
      css += `  --icon-${native}: url('./svg/${native}.svg');\n`;
    }
  }

  // Section 2: Canonical Name Mappings
  css += '\n  /* ==============================\n';
  css += '   * Canonical Names\n';
  css += '   * ============================== */\n';
  for (const cat of cats) {
    const { canonicals } = byCategory[cat];
    if (canonicals.length === 0) { continue; }
    css += `\n  /* ${categoryLabel(cat)} */\n`;
    for (const { canonical, native } of canonicals) {
      css += `  --icon-${canonical}: var(--icon-${native});\n`;
    }
  }

  // Section 3: Aliases
  css += '\n  /* ==============================\n';
  css += '   * Aliases\n';
  css += '   * ============================== */\n';
  for (const cat of cats) {
    const { aliases } = byCategory[cat];
    if (aliases.length === 0) { continue; }
    css += `\n  /* ${categoryLabel(cat)} */\n`;
    for (const { alias, native } of aliases) {
      css += `  --icon-${alias}: var(--icon-${native});\n`;
    }
  }

  css += '}\n';

  const outPath = join(setsDir, lib.dir, `${lib.dir}.css`);
  writeFileSync(outPath, css);

  const nativeCount = nativeSeen.size;
  const canonicalCount = cats.reduce((n, c) => n + byCategory[c].canonicals.length, 0);
  const aliasCount = cats.reduce((n, c) => n + byCategory[c].aliases.length, 0);
  console.log(
    `${lib.dir}: ${nativeCount} native + ${canonicalCount} canonical + ${aliasCount} aliases = ${
      nativeCount + canonicalCount + aliasCount
    } vars`,
  );
}

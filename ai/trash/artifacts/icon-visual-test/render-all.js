import { execSync } from 'child_process';
import * as fs from 'fs';
import { join } from 'path';

const svgDir = '/home/jack/semantic/next/src/primitives/icon/sets/lucide/svg';
const outBase = '/home/jack/semantic/next/ai/workspace/icon-visual-test/production';
const pngDir = join(outBase, 'pngs');
const batchDir = join(outBase, 'batches');

// Import mappings to get categories and native lucide names
import { iconMappings } from '@semantic-ui/specs';

fs.mkdirSync(pngDir, { recursive: true });
fs.mkdirSync(batchDir, { recursive: true });

// Group icons by category
const byCategory = {};
for (const [canonical, entry] of Object.entries(iconMappings)) {
  const cat = entry.category;
  if (!byCategory[cat]) { byCategory[cat] = []; }
  byCategory[cat].push({ canonical, lucide: entry.lucide });
}

// Render all SVGs to PNGs
let rendered = 0;
let missing = 0;
for (const icons of Object.values(byCategory)) {
  for (const { lucide } of icons) {
    if (!lucide) { continue; }
    const svgPath = join(svgDir, `${lucide}.svg`);
    const pngPath = join(pngDir, `${lucide}.png`);
    try {
      const svg = fs.readFileSync(svgPath, 'utf8').replace(/currentColor/g, 'black');
      const tmpSvg = join(outBase, '_tmp.svg');
      fs.writeFileSync(tmpSvg, svg);
      execSync(`convert -background white -density 384 "${tmpSvg}" -resize 96x96 "${pngPath}"`, { stdio: 'pipe' });
      rendered++;
    }
    catch (e) {
      console.warn(`MISS: ${lucide}`);
      missing++;
    }
  }
}
console.log(`Rendered ${rendered} PNGs (${missing} missing)\n`);

// Build batches: one per category, split if > 30
const MAX_BATCH = 30;
const batches = [];

for (const [category, icons] of Object.entries(byCategory)) {
  // Filter to icons that have a lucide mapping and rendered successfully
  const valid = icons.filter(i => i.lucide && fs.existsSync(join(pngDir, `${i.lucide}.png`)));

  if (valid.length <= MAX_BATCH) {
    batches.push({ category, part: null, icons: valid });
  }
  else {
    // Split into chunks
    for (let i = 0; i < valid.length; i += MAX_BATCH) {
      const chunk = valid.slice(i, i + MAX_BATCH);
      const part = Math.floor(i / MAX_BATCH) + 1;
      batches.push({ category, part, icons: chunk });
    }
  }
}

// For each batch, create a directory with anonymized PNGs and a manifest
for (let b = 0; b < batches.length; b++) {
  const batch = batches[b];
  const batchName = batch.part ? `${batch.category}-${batch.part}` : batch.category;
  const batchPath = join(batchDir, batchName);
  fs.mkdirSync(batchPath, { recursive: true });

  const manifest = {};
  batch.icons.forEach((icon, i) => {
    const num = i + 1;
    fs.copyFileSync(join(pngDir, `${icon.lucide}.png`), join(batchPath, `${num}.png`));
    manifest[num] = icon.canonical;
  });

  fs.writeFileSync(join(batchPath, '_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`${batchName}: ${batch.icons.length} icons`);
}

// Write batch index for the orchestrator
const batchIndex = batches.map(b => ({
  name: b.part ? `${b.category}-${b.part}` : b.category,
  category: b.category,
  count: b.icons.length,
}));
fs.writeFileSync(join(outBase, 'batch-index.json'), JSON.stringify(batchIndex, null, 2));
console.log(`\n${batches.length} batches written`);

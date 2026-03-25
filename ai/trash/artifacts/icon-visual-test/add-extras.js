import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const svgDir = '/home/jack/semantic/next/src/primitives/icon/sets/lucide/svg';
const outDir = '/home/jack/semantic/next/ai/workspace/icon-visual-test/samples';
const manifest = JSON.parse(readFileSync(join(outDir, '_manifest.json'), 'utf8'));

for (const icon of ['save', 'wand-sparkles']) {
  const id = randomUUID().slice(0, 8);
  let svg = readFileSync(join(svgDir, `${icon}.svg`), 'utf8');
  svg = svg.replace(/<!--.*?-->/gs, '').replace(/class="[^"]*"/g, '').replace(/\s+>/g, '>').trim();
  writeFileSync(join(outDir, `${id}.svg`), svg);
  manifest[id] = icon;
  console.log(`${id} ← ${icon}`);
}

writeFileSync(join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2));

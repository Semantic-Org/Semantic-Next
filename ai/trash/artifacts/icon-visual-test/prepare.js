import { randomUUID } from 'crypto';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const svgDir = '/home/jack/semantic/next/src/primitives/icon/sets/lucide/svg';
const outDir = '/home/jack/semantic/next/ai/workspace/icon-visual-test/samples';

import { mkdirSync } from 'fs';
mkdirSync(outDir, { recursive: true });

// 10 diverse icons: simple arrows, abstract concepts, complex objects, potentially ambiguous ones
const testIcons = [
  'house', // home — should be a house shape
  'trash-2', // trash — could be a bin/can
  'shield-check', // shield with checkmark
  'floppy-disk', // save — retro object
  'refresh-ccw', // refresh — circular arrows
  'chart-pie', // pie chart
  'flask-conical', // flask — science
  'fingerprint', // fingerprint pattern
  'venetian-mask', // incognito — mask shape
  'sparkles', // sparkles/magic — abstract
];

const manifest = {};

for (const icon of testIcons) {
  const id = randomUUID().slice(0, 8);
  const svgPath = join(svgDir, `${icon}.svg`);

  let svg;
  try {
    svg = readFileSync(svgPath, 'utf8');
  }
  catch {
    console.warn(`SKIP: ${icon} — file not found`);
    continue;
  }

  // Strip identifying info
  svg = svg
    .replace(/<!--.*?-->/gs, '') // remove comments (license with name)
    .replace(/class="[^"]*"/g, '') // remove class attributes
    .replace(/\s+>/g, '>') // clean up trailing whitespace before >
    .trim();

  writeFileSync(join(outDir, `${id}.svg`), svg);
  manifest[id] = icon;
  console.log(`${id} ← ${icon}`);
}

writeFileSync(
  join(outDir, '_manifest.json'),
  JSON.stringify(manifest, null, 2),
);

console.log('\nManifest written. Do NOT share _manifest.json with the describing agent.');

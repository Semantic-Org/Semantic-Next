import * as fs from 'fs';
import { join } from 'path';

const batchDir = '/home/jack/semantic/next/ai/workspace/icon-visual-test/production/batches';
const mappingsPath = '/home/jack/semantic/next/packages/specs/src/icons/mappings.js';

// Read all batch results
const batches = fs.readdirSync(batchDir).filter(d => fs.statSync(join(batchDir, d)).isDirectory());

const descriptions = {};
let matched = 0;
let missing = 0;

for (const batch of batches) {
  const descPath = join(batchDir, batch, 'descriptions.json');
  const manifestPath = join(batchDir, batch, '_manifest.json');

  if (!fs.existsSync(descPath)) {
    console.warn(`SKIP: ${batch} — no descriptions.json`);
    continue;
  }

  const descs = JSON.parse(fs.readFileSync(descPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const [num, canonical] of Object.entries(manifest)) {
    if (descs[num]) {
      descriptions[canonical] = descs[num];
      matched++;
    }
    else {
      console.warn(`MISS: ${batch}/${num} (${canonical}) — no description`);
      missing++;
    }
  }
}

console.log(`\nMatched: ${matched}, Missing: ${missing}`);

// Read mappings.js and inject visual + usage fields
let source = fs.readFileSync(mappingsPath, 'utf8');

let injected = 0;
for (const [canonical, desc] of Object.entries(descriptions)) {
  // Find the description field for this icon and add visual + usage after it
  const descRegex = new RegExp(
    `('${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[^}]*?description:\\s*'[^']*')`,
    's',
  );

  const match = source.match(descRegex);
  if (match) {
    const visual = desc.visual.replace(/'/g, "\\'");
    const usage = desc.usage.replace(/'/g, "\\'");
    source = source.replace(
      match[1],
      `${match[1]},\n    visual: '${visual}',\n    usage: '${usage}'`,
    );
    injected++;
  }
  else {
    console.warn(`INJECT FAIL: ${canonical}`);
  }
}

fs.writeFileSync(mappingsPath, source);
console.log(`Injected ${injected} visual descriptions into mappings.js`);

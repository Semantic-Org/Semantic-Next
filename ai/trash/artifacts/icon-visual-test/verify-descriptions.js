// Step 2: Verify descriptions against canonical names
// Outputs a list of flagged icons where the description doesn't match what the name implies
import * as fs from 'fs';
import { join } from 'path';

const batchDir = '/home/jack/semantic/next/ai/workspace/icon-visual-test/production/batches';
const outPath = '/home/jack/semantic/next/ai/workspace/icon-visual-test/production/verify-input.json';

const batches = fs.readdirSync(batchDir).filter(d => fs.statSync(join(batchDir, d)).isDirectory());

const allDescriptions = {};
let total = 0;

for (const batch of batches) {
  const descPath = join(batchDir, batch, 'descriptions.json');
  const manifestPath = join(batchDir, batch, '_manifest.json');
  if (!fs.existsSync(descPath)) { continue; }

  const descs = JSON.parse(fs.readFileSync(descPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const [num, canonical] of Object.entries(manifest)) {
    if (descs[num]) {
      allDescriptions[canonical] = {
        visual: descs[num].visual,
        usage: descs[num].usage,
        batch,
        num,
      };
      total++;
    }
  }
}

fs.writeFileSync(outPath, JSON.stringify(allDescriptions, null, 2));
console.log(`Prepared ${total} descriptions for verification`);

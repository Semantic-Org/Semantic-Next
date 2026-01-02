import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../..');

async function bundleSpecs() {
  const specFiles = await glob('src/primitives/**/specs/*.spec.json', { cwd: ROOT });

  const specs = {};
  const index = [];

  for (const file of specFiles) {
    const spec = JSON.parse(readFileSync(join(ROOT, file), 'utf-8'));
    const tagName = spec.tagName;

    if (!tagName) { continue; }

    specs[tagName] = spec;

    index.push({
      tagName,
      name: spec.name,
      description: spec.description,
      pluralTagName: spec.pluralTagName || null,
    });
  }

  const srcData = join(__dirname, '../src/data');
  const distData = join(__dirname, '../dist/data');

  mkdirSync(srcData, { recursive: true });
  mkdirSync(distData, { recursive: true });

  const specsJson = JSON.stringify(specs, null, 2);
  const indexJson = JSON.stringify(index, null, 2);

  writeFileSync(join(srcData, 'specs.json'), specsJson);
  writeFileSync(join(srcData, 'index.json'), indexJson);
  writeFileSync(join(distData, 'specs.json'), specsJson);
  writeFileSync(join(distData, 'index.json'), indexJson);

  console.log(`Bundled ${index.length} component specs`);
}

bundleSpecs();

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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

  return { specs, index };
}

async function bundleContext() {
  const manifestPath = join(ROOT, 'ai/meta/context-manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('No context manifest found, skipping context bundling');
    return null;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const docs = {};

  for (const doc of manifest.documents) {
    const filePath = join(ROOT, doc.path);
    if (existsSync(filePath)) {
      docs[doc.id] = readFileSync(filePath, 'utf-8');
    }
  }

  return { manifest, docs };
}

async function main() {
  const srcData = join(__dirname, '../src/data');
  const distData = join(__dirname, '../dist/data');

  mkdirSync(srcData, { recursive: true });
  mkdirSync(distData, { recursive: true });

  // Bundle component specs
  const { specs, index } = await bundleSpecs();
  const specsJson = JSON.stringify(specs, null, 2);
  const indexJson = JSON.stringify(index, null, 2);

  writeFileSync(join(srcData, 'specs.json'), specsJson);
  writeFileSync(join(srcData, 'index.json'), indexJson);
  writeFileSync(join(distData, 'specs.json'), specsJson);
  writeFileSync(join(distData, 'index.json'), indexJson);

  console.log(`Bundled ${index.length} component specs`);

  // Bundle context docs
  const context = await bundleContext();
  if (context) {
    const manifestJson = JSON.stringify(context.manifest, null, 2);
    const docsJson = JSON.stringify(context.docs, null, 2);

    writeFileSync(join(srcData, 'context-manifest.json'), manifestJson);
    writeFileSync(join(srcData, 'context-docs.json'), docsJson);
    writeFileSync(join(distData, 'context-manifest.json'), manifestJson);
    writeFileSync(join(distData, 'context-docs.json'), docsJson);

    console.log(`Bundled ${context.manifest.documents.length} context documents`);
  }
}

main();

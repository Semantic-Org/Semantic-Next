import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
  Copies the playground compile worker and its typescript module from
  node_modules into public/sandbox so the dev server serves them as
  static assets. Served through vite's transform pipeline instead, the
  9MB typescript module balloons to ~45MB per request and concurrent
  module workers fail to boot (see playground-worker-fix.js).

  public/sandbox/internal/ is gitignored — this runs via predev.
*/

const docsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(docsDir, 'node_modules/playground-elements');
const target = path.join(docsDir, 'public/sandbox');

fs.mkdirSync(path.join(target, 'internal'), { recursive: true });
fs.copyFileSync(
  path.join(source, 'playground-typescript-worker.js'),
  path.join(target, 'playground-typescript-worker.js'),
);
fs.copyFileSync(
  path.join(source, 'internal/typescript.js'),
  path.join(target, 'internal/typescript.js'),
);
console.log('[prep-playground-worker] copied compile worker to public/sandbox');

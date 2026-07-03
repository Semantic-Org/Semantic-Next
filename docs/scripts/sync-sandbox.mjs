import { promises as fs } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/*
  Copies the @semantic-ui/playground sandbox assets (tooling worker, service
  worker) into public/sandbox/, where they serve statically in dev and copy
  into builds — never entering the Vite transform pipeline. Rerun after
  rebuilding the playground package's assets.
*/

const require = createRequire(import.meta.url);
const assetsDir = resolve(dirname(require.resolve('@semantic-ui/playground/package.json')), 'dist/assets');
const targetDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sandbox');

await fs.rm(resolve(targetDir, 'chunks'), { recursive: true, force: true });
await fs.cp(assetsDir, targetDir, { recursive: true });
console.log(`[docs] sandbox assets synced from ${assetsDir}`);

import { promises as fs } from 'fs';
import { resolve } from 'path';

import * as esbuild from 'esbuild';

/*
  Builds the two self-contained sandbox assets:
  - tooling-worker.js (+ lazy typescript-service chunk via code splitting)
  - service-worker.js
  Consumers serve dist/assets/ statically — the assets never enter a dev
  server's transform pipeline, which is what made per-instance workers race.
*/

const baseDir = resolve(import.meta.dirname, '..');
const outDir = resolve(baseDir, 'dist/assets');
const packageFile = JSON.parse(await fs.readFile(resolve(baseDir, 'package.json'), 'utf-8'));

await fs.rm(outDir, { recursive: true, force: true });

const shared = {
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  sourcemap: false,
  define: {
    BUILD_VERSION: JSON.stringify(packageFile.version),
  },
  logLevel: 'warning',
};

await esbuild.build({
  ...shared,
  entryPoints: [resolve(baseDir, 'src/worker/worker.js')],
  outdir: outDir,
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  entryNames: 'tooling-worker',
});

await esbuild.build({
  ...shared,
  entryPoints: [resolve(baseDir, 'src/serving/service-worker.js')],
  outfile: resolve(outDir, 'service-worker.js'),
});

const version = `export const engineVersion = ${JSON.stringify(packageFile.version)};\n`;
await fs.writeFile(resolve(baseDir, 'src/generated/version.js'), version);

const sizes = await Promise.all(
  (await fs.readdir(outDir, { recursive: true }))
    .filter(name => name.endsWith('.js'))
    .map(async (name) => {
      const stats = await fs.stat(resolve(outDir, name));
      return `${name}: ${(stats.size / 1024).toFixed(0)}KB`;
    }),
);
console.log(`[playground] assets built — ${sizes.join(', ')}`);

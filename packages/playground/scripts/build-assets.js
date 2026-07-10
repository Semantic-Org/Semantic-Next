import { promises as fs } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';

import * as esbuild from 'esbuild';

/*
  Builds the self-contained sandbox assets:
  - tooling-worker.js (+ lazy typescript-service chunk via code splitting)
  - service-worker.js
  - lib.d.ts (concatenated default-lib closure for the language service)
  Consumers serve dist/assets/ statically — the assets never enter a dev
  server's transform pipeline, which is what made per-instance workers race.
*/

const require = createRequire(import.meta.url);
const baseDir = resolve(import.meta.dirname, '..');
const outDir = resolve(baseDir, 'dist/assets');
const packageFile = JSON.parse(await fs.readFile(resolve(baseDir, 'package.json'), 'utf-8'));

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

/* generated before bundling so both the page side and the worker bundles import one version value */
const version = `export const engineVersion = ${JSON.stringify(packageFile.version)};\n`;
await fs.writeFile(resolve(baseDir, 'src/generated/version.js'), version);

const shared = {
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  sourcemap: false,
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

/*
  Concatenate the default-lib reference closure into one lib.d.ts the language
  service fetches lazily. Declaration merging makes the concatenation valid —
  the /// references only exist to stitch the separate files together.
*/
const libDir = dirname(require.resolve('typescript/lib/typescript.js'));
const seen = new Set();
const collectLib = async (name) => {
  if (seen.has(name)) {
    return '';
  }
  seen.add(name);
  const content = await fs.readFile(resolve(libDir, name), 'utf-8');
  let result = '';
  for (const match of content.matchAll(/\/\/\/\s*<reference\s+lib="([^"]+)"\s*\/>/g)) {
    result += await collectLib(`lib.${match[1]}.d.ts`);
  }
  return result + content.replace(/\/\/\/\s*<reference[^>]*>\s*/g, '');
};
await fs.writeFile(resolve(outDir, 'chunks/lib.d.ts'), await collectLib('lib.es2022.full.d.ts'));

const sizes = await Promise.all(
  (await fs.readdir(outDir, { recursive: true }))
    .filter(name => /\.(js|ts)$/.test(name))
    .map(async (name) => {
      const stats = await fs.stat(resolve(outDir, name));
      return `${name}: ${(stats.size / 1024).toFixed(0)}KB`;
    }),
);
console.log(`[playground] assets built — ${sizes.join(', ')}`);

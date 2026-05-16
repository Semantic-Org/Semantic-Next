#!/usr/bin/env node
/*
  esbuild dev server for examples/.

  Discovers every example directory (one level under examples/), bundles its
  component.js (and page.js, if present) into dist/<id>/, and serves the
  whole examples/ folder at http://localhost:3000. Each page.html (written
  by scripts/sync.js) references /dist/<id>/component.js for the bundle and
  loads @semantic-ui/core from a CDN for first-party primitives.
*/

import * as esbuild from 'esbuild';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/*
  Route `.css?raw` and `.html?raw` imports to the text loader (returning the
  file as a string) while letting bare `.css` imports use esbuild's default
  `css` loader so they bundle into a real CSS sidecar. Without this, a single
  `.css: 'text'` loader entry would clobber `sui.js`'s framework CSS imports.
*/
const rawTextPlugin = {
  name: 'raw-text',
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, async (args) => {
      // Delegate path resolution to esbuild (handles relative and bare imports).
      const result = await build.resolve(args.path.replace(/\?raw$/, ''), {
        kind: args.kind,
        importer: args.importer,
        resolveDir: args.resolveDir,
        namespace: args.namespace,
      });
      if (result.errors.length > 0) { return { errors: result.errors }; }
      return { path: result.path, namespace: 'raw-text' };
    });
    build.onLoad({ filter: /.*/, namespace: 'raw-text' }, async (args) => ({
      contents: await readFile(args.path, 'utf8'),
      loader: 'text',
      watchFiles: [args.path],
    }));
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(EXAMPLES_DIR, 'src');

async function exists(path) {
  try {
    await stat(path);
    return true;
  }
  catch {
    return false;
  }
}

async function findEntryPoints() {
  const points = [resolve(EXAMPLES_DIR, 'sui.js')];
  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) { continue; }
    const component = resolve(SRC_DIR, entry.name, 'component.js');
    const page = resolve(SRC_DIR, entry.name, 'page.js');
    if (await exists(component)) { points.push(component); }
    if (await exists(page)) { points.push(page); }
  }
  return points;
}

const entryPoints = await findEntryPoints();

const ctx = await esbuild.context({
  entryPoints,
  bundle: true,
  format: 'esm',
  sourcemap: true,
  target: ['chrome130', 'firefox130', 'safari17'],
  outdir: resolve(EXAMPLES_DIR, 'dist'),
  outbase: EXAMPLES_DIR,
  plugins: [rawTextPlugin],
  // SVGs are inlined as data URLs so CSS `url(...)` references in lucide.css
  // resolve from inside the bundled stylesheet without a separate fetch.
  loader: {
    '.html': 'text',
    '.svg': 'dataurl',
    '.wasm': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
  },
  logLevel: 'info',
});

await ctx.watch();
const { port } = await ctx.serve({ servedir: EXAMPLES_DIR, port: 3000 });
console.log(`\nExamples server:  http://localhost:${port}/\n`);

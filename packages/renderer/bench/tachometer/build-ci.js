/*
  Builds bench.js into a self-contained bundle for CI comparison.
  Used by the benchmarks workflow to create current/baseline bundles
  from different git refs.

  Usage: node build-ci.js <outdir>
    outdir: 'current' or 'baseline' — writes to dist/<outdir>/bench.js
*/
import * as esbuild from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outdir = process.argv[2] || 'current';

await esbuild.build({
  entryPoints: [join(__dirname, 'bench.js')],
  bundle: true,
  outfile: join(__dirname, 'dist', outdir, 'bench.js'),
  format: 'esm',
  loader: { '.html': 'text' },
});

console.log(`Built bench → dist/${outdir}/bench.js`);

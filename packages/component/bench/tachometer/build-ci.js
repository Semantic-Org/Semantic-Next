/*
  Builds bench files into self-contained bundles for CI comparison.
  Used by the benchmarks workflow to create current/baseline bundles
  from different git refs.

  Usage: node build-ci.js <outdir>
    outdir: 'current' or 'baseline' — writes to dist/<outdir>/
*/
import * as esbuild from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outdir = process.argv[2] || 'current';
const outBase = join(__dirname, 'dist', outdir);

const benchFiles = ['bench-krausest.js', 'bench-todo.js', 'bench-hydrate.js'];

await Promise.all(benchFiles.map(file =>
  esbuild.build({
    entryPoints: [join(__dirname, file)],
    bundle: true,
    outfile: join(outBase, file),
    format: 'esm',
    loader: { '.html': 'text' },
  })
));

console.log(`Built ${benchFiles.join(', ')} → dist/${outdir}/`);

import * as esbuild from 'esbuild';
import { readdirSync } from 'node:fs';

const harnessDir = new URL('./harness/', import.meta.url).pathname;
const operations = readdirSync(harnessDir)
  .filter(f => f.endsWith('.js') && f !== 'bench-utils.js')
  .map(f => f.replace('.js', ''));

for (const op of operations) {
  await esbuild.build({
    entryPoints: [`bench/tachometer/harness/${op}.js`],
    bundle: true,
    outfile: `bench/tachometer/dist/${op}.js`,
    format: 'esm',
    loader: { '.html': 'text', '.css': 'text' },
    // tachometer provides /bench.js at runtime — mark as external
    external: ['/bench.js'],
  });
}

console.log(`Built ${operations.length} harness bundles: ${operations.join(', ')}`);

import semanticUI from '@semantic-ui/esbuild';
import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/main.js',
  format: 'esm',
  sourcemap: true,
  target: ['chrome130', 'firefox130', 'safari17'],
  loader: {
    '.html': 'text',
    '.css': 'text',
  },
  plugins: [semanticUI()],
});

await ctx.watch();

const { host, port } = await ctx.serve({
  servedir: '.',
  port: 8080,
});

console.log(`Benchmark server running at http://localhost:${port}`);

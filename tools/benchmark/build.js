import * as esbuild from 'esbuild';
import { astPlugin } from './esbuild-plugin-ast.js';

await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/main.js',
  format: 'esm',
  minify: true,
  target: ['chrome130', 'firefox130', 'safari17'],
  loader: {
    '.html': 'text',
    '.css': 'text',
  },
  plugins: [astPlugin],
});

console.log('Build complete: dist/main.js');

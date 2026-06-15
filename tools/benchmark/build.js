import semanticUI from '@semantic-ui/esbuild';
import * as esbuild from 'esbuild';

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
  plugins: [semanticUI()],
});

console.log('Build complete: dist/main.js');

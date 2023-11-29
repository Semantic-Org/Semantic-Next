import * as esbuild from 'esbuild';
import { globSync } from 'glob' ;
import { browserTarget } from './config.js';
import { logPlugin } from './plugins.js';

const cssConcat = await esbuild.build({
  entryPoints: [
    'src/**/*.css'
  ],
  target: browserTarget,
  bundle: true,
  plugins: [ logPlugin('CSS Concat') ],
  loader: {
    '.css': 'css',
  },
  entryNames: '[dir]/[name]-inline',
  outbase: 'src',
  outdir: 'src',
});

let jsBuild = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.js',
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: browserTarget,
  loader: {
    '.html': 'text',
    '.css': 'text',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.svg': 'file',
    '.gif': 'file',
  },
  plugins: [ logPlugin('JS') ],
  outbase: 'src',
  outdir: 'server/ui',
});

let themeBuild = await esbuild.context({
  entryPoints: globSync('./src/themes/**/*.css'),
  bundle: false,
  minify: false,
  sourcemap: true,
  target: browserTarget,
  plugins: [ logPlugin('CSS') ],
  loader: {
    '.css': 'css',
  },
  outdir: 'server/ui/theme',
});

await Promise.all([
  cssConcat.watch(),
  jsBuild.watch(),
  themeBuild.watch(),
]);

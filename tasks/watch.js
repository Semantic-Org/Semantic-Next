import * as esbuild from 'esbuild';
import { globSync } from 'glob' ;
import { browserTarget } from './config.js';
import { logPlugin } from './plugins.js';

const cssConcat = await esbuild.context({
  entryPoints: [
    'src/**/css/*.css'
  ],
  target: browserTarget,
  bundle: true,
  plugins: [ logPlugin('CSS Concat') ],
  loader: {
    '.css': 'css',
  },
  entryNames: '[dir]/../[name]',
  outbase: 'src',
  outdir: 'src',
});

let jsBuild = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.js',
  ],
  format: 'esm',
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

let cssBuild = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.css',
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: browserTarget,
  plugins: [ logPlugin('SUI CSS') ],
  loader: {
    '.css': 'css',
  },
  outdir: 'server/ui/',
});

let themeBuild = await esbuild.context({
  entryPoints: [
    './src/themes/base/base.css',
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: browserTarget,
  plugins: [ logPlugin('Theme CSS') ],
  loader: {
    '.css': 'css',
  },
  outdir: 'server/ui/theme',
});

await Promise.all([
  cssConcat.watch(),
  jsBuild.watch(),
  cssBuild.watch(),
  themeBuild.watch(),
]);

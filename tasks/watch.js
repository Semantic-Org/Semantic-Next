import * as esbuild from 'esbuild';
import {
  globSync
} from 'glob' ;

let
  target = [
    'chrome58',
    'firefox57',
    'safari11',
    'edge18'
  ]
;

let context1 = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.js',
  ],
  bundle: true,
  //minify: true,
  sourcemap: true,
  target,
  loader: {
    '.html': 'text',
    '.css': 'text',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.svg': 'file',
    '.gif': 'file',
  },
  outdir: 'server/ui',
});

const files = globSync('./src/themes/**/*.css');

let context2 = await esbuild.context({
  entryPoints: files,
  bundle: false,
  //minify: true,
  sourcemap: true,
  target,
  loader: {
    '.css': 'css',
  },
  outdir: 'server/ui/theme',
});

await Promise.all([context1.watch(), context2.watch()]);
console.log('watching...');

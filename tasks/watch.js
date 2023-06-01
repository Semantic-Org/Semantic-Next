import * as esbuild from 'esbuild';
import { glob } from 'glob-promise';

const files = glob.sync('src/**/*.js');

let context = await esbuild.context({
  entryPoints: [
    'src/semantic-ui.js',
  ],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
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

await context.watch();
console.log('watching...');

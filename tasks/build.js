import * as esbuild from 'esbuild';
import { globPlugin } from 'esbuild-plugin-glob';
import { lessLoader } from 'esbuild-plugin-less';
import { browserTarget } from './config.js';

const cssConcat = await esbuild.build({
  entryPoints: [
    'src/**/*.css'
  ],
  target: browserTarget,
  bundle: true,
  plugins: [globPlugin()],
  loader: {
    '.css': 'css-global',
  },
  entryNames: '[dir]/[name]-inline',
  outbase: 'src',
  outdir: 'src',
});

const jsBuild = await esbuild.build({
  entryPoints: [
    'src/**/*.js'
  ],
  target: browserTarget,
  bundle: true,
  plugins: [globPlugin()],
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

const cssBuild = await esbuild.build({
  entryPoints: [
    'src/**/*.less'
  ],
  target: browserTarget,
  bundle: true,
  plugins: [globPlugin(), lessLoader()],
  outdir: 'server/ui',
});

await Promise.all([jsBuild, cssBuild]);

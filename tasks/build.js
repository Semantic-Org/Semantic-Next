import * as esbuild from 'esbuild';
import { globPlugin } from 'esbuild-plugin-glob';
import { lessLoader } from 'esbuild-plugin-less';

let
  target = [
    'es2020',
    'chrome58',
    'ios15',
    'edge18',
    'firefox57',
    'node12',
    'safari11',
  ],

  jsBuild = await esbuild.build({
    entryPoints: [
      'src/**/*.js'
    ],
    target,
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
  }),

  cssBuild = await esbuild.build({
    entryPoints: [
      'src/**/*.less'
    ],
    bundle: true,
    plugins: [globPlugin(), lessLoader()],
    outdir: 'server/ui',
  })
;

await Promise.all([jsBuild, cssBuild]);

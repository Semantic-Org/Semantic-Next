import * as esbuild from 'esbuild';
import { globPlugin } from 'esbuild-plugin-glob';
import { lessLoader } from 'esbuild-plugin-less';

let
  target = [
    'es2020',
    'chrome58',
    'ios15',
    'edge16',
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
    outdir: 'serve/rui',
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

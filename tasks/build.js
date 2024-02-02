import * as esbuild from 'esbuild';
import { BROWSER_TARGET } from 'lib/config.js';
import { logPlugin } from 'lib/log.js';

const cssConcat = await esbuild.build({
  entryPoints: [
    'src/**/css/*.css'
  ],
  target: BROWSER_TARGET,
  bundle: true,
  plugins: [ logPlugin('CSS Concat') ],
  loader: {
    '.css': 'css',
  },
  entryNames: '[dir]/../[name]',
  outbase: 'src',
  outdir: 'src',
});

/*
  Exports all components as one js file
*/
let jsBuild = await esbuild.build({
  entryPoints: [
    './src/semantic-ui.js',
  ],
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
      useDefineForClassFields: false,
      verbatimModuleSyntax: true
    },
  },
  format: 'esm',
  bundle: true,
  minify: false,
  sourcemap: true,
  loader: {
    '.ts': 'ts',
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
  outdir: 'dev/ui',
});


/*
  Exports global css
*/
let cssBuild = await esbuild.build({
  entryPoints: [
    './src/semantic-ui.css',
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: BROWSER_TARGET,
  plugins: [ logPlugin('SUI CSS') ],
  loader: {
    '.css': 'css',
  },
  outdir: 'dev/ui/',
});

/*
  Exports themes as separate css
*/
let themeBuild = await esbuild.build({
  entryPoints: [
    './src/themes/base/base.css',
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: BROWSER_TARGET,
  plugins: [ logPlugin('Theme CSS') ],
  loader: {
    '.css': 'css',
  },
  outdir: 'dev/ui/theme',
});

await Promise.all([
  cssConcat,
  jsBuild,
  cssBuild,
  themeBuild,
]);

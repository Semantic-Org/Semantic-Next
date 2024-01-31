import * as esbuild from 'esbuild';
import { BROWSER_TARGET } from '../config.js';
import { logPlugin } from '../plugins.js';

/*
  Takes all css parts of a component and creates
  a single css file for JS css imports
*/
const cssConcat = await esbuild.context({
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
let jsBuild = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.js',
  ],
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
      useDefineForClassFields: false,
      verbatimModuleSyntax: false
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
let cssBuild = await esbuild.context({
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
  Takes a full JSON spec file and creates a smaller JSON
  file which is consumed by a component
*/
/*const specBuild = await esbuild.context({
  entryPoints: [
    'src/spec.js'
  ],
  target: BROWSER_TARGET,
  bundle: true,
  plugins: [ logPlugin('Spec Build') ],
  loader: {
    '.css': 'css',
  },
  entryNames: '[dir]/../[name]',
  outbase: 'src',
  outdir: 'src',
});
*/

/*
  Exports themes as separate css
*/
let themeBuild = await esbuild.context({
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
  cssConcat.watch(),
  jsBuild.watch(),
  cssBuild.watch(),
  themeBuild.watch(),
]);
let { host, port } = await jsBuild.serve({
  servedir: 'dev',
});

console.log(`Server up ${host}:${port}`);

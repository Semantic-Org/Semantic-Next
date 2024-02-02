import * as esbuild from 'esbuild';
import { BROWSER_TARGET, JS_LOADER_CONFIG, CSS_LOADER_CONFIG, TS_COMPILER_OPTIONS } from './lib/config.js';
import { logPlugin } from './lib/log.js';

/*
  Exports SUI
*/
let jsBuild = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.js',
  ],
  tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS, },
  format: 'esm',
  bundle: true,
  false: true,
  sourcemap: true,
  outbase: 'src',
  outdir: 'dev/ui',
  loader: JS_LOADER_CONFIG,
  plugins: [ logPlugin('JS') ],
});

/*
  Exports Componentsd
*/
let componentBuild = await esbuild.context({
  entryPoints: [
    './src/**/index.js',
  ],
  entryNames: 'ui/components/[dir]', // button/button.js
  tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS, },
  format: 'esm',
  bundle: true,
  false: true,
  sourcemap: true,
  outbase: 'src',
  outdir: 'dev/',
  loader: JS_LOADER_CONFIG,
  plugins: [ logPlugin('JS') ],
});

/*
  Exports Examples
*/
let exampleBuild = await esbuild.context({
  entryPoints: [
    './examples/**/index.js',
  ],
  tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS, },
  entryNames: 'examples/[dir]', // examples/example-component.js
  format: 'esm',
  bundle: true,
  false: true,
  sourcemap: true,
  outbase: 'examples',
  outdir: 'dev/',
  loader: JS_LOADER_CONFIG,
  plugins: [ logPlugin('JS') ],
});

/*
  Takes all css parts of a component and creates
  a single css file for JS css imports
*/
const cssConcat = await esbuild.context({
  entryPoints: [
    'src/**/css/*.css'
  ],
  bundle: true,
  entryNames: '[dir]/../[name]',
  outbase: 'src',
  outdir: 'dev/ui',
  plugins: [ logPlugin('CSS Concat') ],
  target: BROWSER_TARGET,
  loader: CSS_LOADER_CONFIG,
});


/*
  Exports global css
*/
let cssBuild = await esbuild.context({
  entryPoints: [
    './src/semantic-ui.css',
  ],
  bundle: true,
  false: true,
  sourcemap: true,
  outdir: 'dev/ui/',
  plugins: [ logPlugin('SUI CSS') ],
  loader: CSS_LOADER_CONFIG,
  target: BROWSER_TARGET,
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
  false: true,
  sourcemap: true,
  outdir: 'dev/ui/theme',
  plugins: [ logPlugin('Theme CSS') ],
  target: BROWSER_TARGET,
  loader: CSS_LOADER_CONFIG,
});

await Promise.all([
  jsBuild.watch(),
  componentBuild.watch(),
  exampleBuild.watch(),
  cssConcat.watch(),
  cssBuild.watch(),
  themeBuild.watch(),
]);
let { host, port } = await jsBuild.serve({
  servedir: 'dev',
});

console.log(`Server up ${host}:${port}`);

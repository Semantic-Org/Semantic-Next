import * as esbuild from 'esbuild';
import { logPlugin } from './log.js';
import {
  BROWSER_TARGET,
  JS_LOADER_CONFIG,
  CSS_LOADER_CONFIG,
  TS_COMPILER_OPTIONS
} from './config.js';

export const buildProject = async ({
  watch = false,
  includeExamples = false,
  includePackages = false,
  outDir = 'docs/public/semantic/',
  uiDir = `${outDir}/ui`
} = {}) => {

  const esbuilder = (watch)
    ? esbuild.context
    : esbuild.build
  ;

  let tasks = [];

  /*
    Export Concat Components
  */
  let jsBuild = await esbuilder({
    entryPoints: [
      './src/semantic-ui.js',
    ],
    tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS, },
    format: 'esm',
    bundle: true,
    minify: false,
    sourcemap: true,
    outbase: 'src',
    outdir: uiDir,
    loader: JS_LOADER_CONFIG,
    plugins: [ logPlugin('JS') ],
  });
  tasks.push(jsBuild);

  /*
    Exports Individual Components
  */
  let componentBuild = await esbuilder({
    entryPoints: [
      './src/**/index.js',
    ],
    entryNames: 'ui/components/[dir]', // button/button.js
    tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS, },
    format: 'esm',
    bundle: true,
    minify: false,
    sourcemap: true,
    outbase: 'src',
    outdir: `${outDir}`,
    loader: JS_LOADER_CONFIG,
    plugins: [ logPlugin('JS') ],
  });
  tasks.push(componentBuild);

  /*
    Takes all css parts of a component and creates
    a single css file for JS css imports
  */
  let cssConcat = await esbuilder({
    entryPoints: [
      'src/**/css/*.css'
    ],
    bundle: true,
    entryNames: '[dir]/../[name]',
    outbase: 'src',
    outdir: uiDir,
    plugins: [ logPlugin('CSS Concat') ],
    target: BROWSER_TARGET,
    loader: CSS_LOADER_CONFIG,
  });
  tasks.push(cssConcat);


  /*
    Exports global css
  */
  let cssBuild = await esbuilder({
    entryPoints: [
      './src/semantic-ui.css',
    ],
    bundle: true,
    minify: false,
    sourcemap: true,
    outdir: uiDir,
    plugins: [ logPlugin('SUI CSS') ],
    loader: CSS_LOADER_CONFIG,
    target: BROWSER_TARGET,
  });
  tasks.push(cssBuild);

  /*
    Takes a full JSON spec file and creates a smaller JSON
    file which is consumed by a component
  */
  /*let specBuild = await esbuilder({
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
  let themeBuild = await esbuilder({
    entryPoints: [
      './src/themes/base/base.css',
    ],
    bundle: true,
    minify: false,
    sourcemap: true,
    outdir: `${outDir}/ui/theme`,
    plugins: [ logPlugin('Theme CSS') ],
    target: BROWSER_TARGET,
    loader: CSS_LOADER_CONFIG,
  });
  tasks.push(themeBuild);

  /*
    Exports Examples
  */
  if(includeExamples) {
    let exampleBuild = await esbuilder({
      entryPoints: [
        './examples/**/index.js',
      ],
      tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS, },
      entryNames: 'examples/[dir]', // examples/example-component.js
      format: 'esm',
      bundle: true,
      minify: false,
      sourcemap: true,
      outbase: 'examples',
      outdir: `${outDir}`,
      loader: JS_LOADER_CONFIG,
      plugins: [ logPlugin('JS') ],
    });
    tasks.push(exampleBuild);
  }

  if(watch) {
    tasks = tasks.map(task => task.watch());
  }
  return await Promise.all(tasks);
};

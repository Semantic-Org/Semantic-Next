import * as esbuild from 'esbuild';
import { logPlugin } from './log.js';
import { BROWSER_TARGET, JS_LOADER_CONFIG, CSS_LOADER_CONFIG, TS_COMPILER_OPTIONS } from './config.js';
import * as fs from 'fs';

export const buildProject = async ({
  watch = false, // watch for changes
  includeJavascript = true, // include concatenated build
  includeComponents = true, // include web components
  includeCSS = true, // include global css
  includeThemes = true, // include themes
  includeExamples = false, // include examples like 'todo'
  outDir = 'dist', // base directory to output
  minify = true, // minify files
  bundle = true, // bundle files
  sourcemap = true, // include sourcemaps
  serveDir = false, // serve director after building
  uiDir = `${outDir}/ui`,
} = {}) => {
  const esbuilder = watch ? esbuild.context : esbuild.build;
  let tasks = [];

  if (includeJavascript) {

    /*
      Export Concat Components
    */
    let jsBuild = await esbuilder({
      entryPoints: ['./src/semantic-ui.js'],
      tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
      format: 'esm',
      metafile: true,
      bundle,
      minify,
      sourcemap,
      outbase: 'src',
      outdir: uiDir,
      loader: JS_LOADER_CONFIG,
      plugins: [logPlugin('SUI')],
    });
    tasks.push(jsBuild);
  }

  if (includeComponents) {

    /*
      Exports Individual Components
    */
    let componentBuild = await esbuilder({
      entryPoints: ['./src/components/**/index.js'],
      entryNames: 'ui/[dir]', // button/button.js
      tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
      format: 'esm',
      bundle,
      minify,
      sourcemap,
      outbase: 'src',
      outdir: `${outDir}`,
      loader: JS_LOADER_CONFIG,
      plugins: [logPlugin('Components')],
    });
    tasks.push(componentBuild);
  }

  if (includeCSS) {
    /*
      Exports global css
    */
    let cssBuild = await esbuilder({
      entryPoints: ['./src/semantic-ui.css'],
      bundle,
      minify,
      sourcemap,
      outdir: uiDir,
      plugins: [logPlugin('SUI CSS')],
      loader: CSS_LOADER_CONFIG,
      target: BROWSER_TARGET,
    });
    tasks.push(cssBuild);

  }

  if (includeThemes) {

    /*
      Exports themes as separate css
    */
    let themeBuild = await esbuilder({
      entryPoints: ['./src/themes/base/base.css'],
      bundle,
      minify,
      sourcemap,
      outdir: `${outDir}/theme`,
      plugins: [logPlugin('Theme CSS')],
      target: BROWSER_TARGET,
      loader: CSS_LOADER_CONFIG,
    });
    tasks.push(themeBuild);
  }

  /*
    Exports Examples
  */
  if (includeExamples) {
    let exampleBuild = await esbuilder({
      entryPoints: ['./examples/**/index.js'],
      tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
      entryNames: 'examples/[dir]', // examples/example-component.js
      format: 'esm',
      bundle,
      minify,
      sourcemap,
      outbase: 'examples',
      outdir: `${outDir}`,
      loader: JS_LOADER_CONFIG,
      plugins: [logPlugin('Examples')],
    });
    tasks.push(exampleBuild);
  }
  if(serveDir) {
    let { host, port } = await tasks[0].serve({
      servedir: serveDir,
    });
    console.log(`Server up ${host}:${port}`);
  }
  if (watch) {
    tasks = tasks.map((task) => task.watch());
  }
  return await Promise.all(tasks);
};

import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import { resolve, dirname } from 'path';
import { BROWSER_TARGET, CSS_LOADER_CONFIG, JS_LOADER_CONFIG, TS_COMPILER_OPTIONS } from '../utils/config.js';
import { logPlugin } from '../utils/log.js';

/**
 * Build the main UI framework
 * Adapted from tasks/lib/build-project.js
 */
export async function buildUIFramework({
  watch = false, // watch for changes
  includeJavascript = true, // include concatenated build
  includeComponents = true, // include web components
  includeCSS = true, // include global css
  includeThemes = true, // include themes
  includeExamples = true, // include examples like 'todo'
  baseDir = process.cwd(), // Root directory of the package
  outDir = 'dist', // base directory to output
  minify = true, // minify files
  bundle = true, // bundle files
  sourcemap = true, // include sourcemaps
  serveDir = false, // serve directory after building
  createDirectImports = true, // create direct import structure
} = {}) {
  try {
    const esbuilder = watch ? esbuild.context : esbuild.build;
    const tasks = [];
    
    // Read package.json for banner
    const packageJsonPath = resolve(baseDir, 'package.json');
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    // Create banner
    const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description || ''}
 *
 * @license ${pkg.license || 'MIT'}
 * @copyright (c) ${new Date().getFullYear()} ${pkg.author || ''}
 * @homepage ${pkg.homepage || ''}
 */`;

    if (includeJavascript) {
      /*
        Export Concat Components (both minified and unminified)
      */
      // Minified
      let jsBuildMin = await esbuilder({
        entryPoints: ['./src/semantic-ui.js'],
        tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
        format: 'esm',
        metafile: true,
        bundle,
        minify: true,
        sourcemap,
        outbase: 'src',
        outfile: resolve(outDir, 'semantic-ui.min.js'),
        loader: JS_LOADER_CONFIG,
        banner: { js: banner },
        plugins: [logPlugin('All Components (minified)')],
      });
      tasks.push(jsBuildMin);
      
      // Unminified
      let jsBuild = await esbuilder({
        entryPoints: ['./src/semantic-ui.js'],
        tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
        format: 'esm',
        metafile: true,
        bundle,
        minify: false,
        sourcemap,
        outbase: 'src',
        outfile: resolve(outDir, 'semantic-ui.js'),
        loader: JS_LOADER_CONFIG,
        banner: { js: banner },
        plugins: [logPlugin('All Components')],
      });
      tasks.push(jsBuild);
    }

    if (includeComponents) {
      /*
        Exports Individual Components
      */
      // Minified
      let componentBuildMin = await esbuilder({
        entryPoints: ['./src/components/**/index.js'],
        entryNames: '[dir].min', // button.min.js
        tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
        format: 'esm',
        bundle,
        minify: true,
        sourcemap,
        outbase: 'src/components',
        outdir: outDir,
        loader: JS_LOADER_CONFIG,
        banner: { js: banner },
        plugins: [logPlugin('Individual Components (minified)')],
      });
      tasks.push(componentBuildMin);
      
      // Unminified
      let componentBuild = await esbuilder({
        entryPoints: ['./src/components/**/index.js'],
        entryNames: '[dir]', // button.js
        tsconfigRaw: { compilerOptions: TS_COMPILER_OPTIONS },
        format: 'esm',
        bundle,
        minify: false,
        sourcemap,
        outbase: 'src/components',
        outdir: outDir,
        loader: JS_LOADER_CONFIG,
        banner: { js: banner },
        plugins: [logPlugin('Individual Components')],
      });
      tasks.push(componentBuild);
      
      // Only create a bundled version of the entire framework
      // Individual components should NOT be bundled to avoid dependency duplication
      const bundledDir = resolve(baseDir, outDir, 'bundled');
      await fs.mkdir(bundledDir, { recursive: true });
      
    }

    if (includeCSS) {
      /*
        Exports global css (both minified and unminified)
      */
      // Minified
      let cssBuildMin = await esbuilder({
        entryPoints: ['./src/semantic-ui.css'],
        bundle,
        minify: true,
        sourcemap,
        outfile: resolve(outDir, 'global.min.css'),
        plugins: [logPlugin('Global CSS (minified)')],
        loader: CSS_LOADER_CONFIG,
        target: BROWSER_TARGET,
      });
      tasks.push(cssBuildMin);
      
      // Unminified
      let cssBuild = await esbuilder({
        entryPoints: ['./src/semantic-ui.css'],
        bundle,
        minify: false,
        sourcemap,
        outfile: resolve(outDir, 'global.css'),
        plugins: [logPlugin('Global CSS')],
        loader: CSS_LOADER_CONFIG,
        target: BROWSER_TARGET,
      });
      tasks.push(cssBuild);
      
      // Create global.css alias for semantic-ui.css
      // Minified
      await fs.copyFile(
        resolve(outDir, 'semantic-ui.min.css'),
        resolve(outDir, 'global.min.css')
      );
      
      // Unminified
      await fs.copyFile(
        resolve(outDir, 'semantic-ui.css'),
        resolve(outDir, 'global.css')
      );
      
      // Also copy sourcemaps if they exist
      try {
        if (sourcemap) {
          await fs.copyFile(
            resolve(outDir, 'semantic-ui.min.css.map'),
            resolve(outDir, 'global.min.css.map')
          );
          
          await fs.copyFile(
            resolve(outDir, 'semantic-ui.css.map'),
            resolve(outDir, 'global.css.map')
          );
        }
      } catch (error) {
        // Ignore if sourcemap doesn't exist
      }
    }

    if (includeThemes) {
      /*
        Exports themes as separate css (both minified and unminified)
      */
      // Minified
      let themeBuildMin = await esbuilder({
        entryPoints: ['./src/themes/base/base.css'],
        bundle,
        minify: true,
        sourcemap,
        outfile: resolve(outDir, 'theme.min.css'),
        plugins: [logPlugin('Theme CSS (minified)')],
        target: BROWSER_TARGET,
        loader: CSS_LOADER_CONFIG,
      });
      tasks.push(themeBuildMin);
      
      // Unminified
      let themeBuild = await esbuilder({
        entryPoints: ['./src/themes/base/base.css'],
        bundle,
        minify: false,
        sourcemap,
        outfile: resolve(outDir, 'theme.css'),
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
        outdir: outDir,
        loader: JS_LOADER_CONFIG,
        plugins: [logPlugin('Examples')],
      });
      tasks.push(exampleBuild);
    }
    
    if (serveDir) {
      let { host, port } = await tasks[0].serve({
        servedir: serveDir,
      });
      console.log(`Server up ${host}:${port}`);
    }
    
    if (watch) {
      tasks.forEach(task => task.watch());
    }
    
    return {
      success: true,
      tasks,
    };
  } catch (error) {
    console.error('❌ UI Framework Build failed:', error);
    return {
      success: false,
      error,
    };
  }
}

export default buildUIFramework;

// Handle direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    const result = await buildUIFramework();
    if (!result.success) {
      process.exit(1);
    }
  })();
}

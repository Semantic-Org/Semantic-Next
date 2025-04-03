import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import { resolve } from 'path';
import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';
import { BROWSER_TARGET } from '../utils/config.js';
import { log, logPlugin } from '../utils/log.js';

/**
 * Build the UI framework for distribution
 * Creates CDN-compatible bundles for the whole framework and individual components
 */
export async function buildUICDN({
  baseDir = process.cwd(), // Root directory of the package
  cacheDir = '.cache', // Cache directory for entrypoint resolution
  cdnRoot = 'https://cdn.jsdelivr.net/npm', // CDN base URL
  directReplacements = {}, // Map of packages to direct URLs
  logging = 'normal', // Logging verbosity
  target = ['esnext'], // JavaScript target
  minify = true, // Whether to minify
  sourcemap = true, // Whether to generate sourcemaps
  format = 'esm', // Module format
  outDir = 'dist', // Output directory
  createComponentBundles = true, // Whether to create individual component bundles
  platform = 'neutral', // Target platform
  buildUnminified = true, // Whether to build unminified versions
} = {}) {
  try {
    // Resolve paths
    const CACHE_DIR = resolve(baseDir, cacheDir);
    const componentsDir = resolve(baseDir, 'src/components');

    // Read package.json
    const packageJsonPath = resolve(baseDir, 'package.json');
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Ensure output directory exists
    const outputDir = resolve(baseDir, outDir);
    await fs.mkdir(outputDir, { recursive: true });

    // Create banner
    const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description || ''}
 *
 * @license ${pkg.license || 'MIT'}
 * @copyright (c) ${new Date().getFullYear()} ${pkg.author || ''}
 * @homepage ${pkg.homepage || ''}
 */`;

    // Build the main bundle
    log('CDN Build', 'Building main UI framework bundle');
    
    // Main bundle - minified
    const mainEntrypoint = resolve(baseDir, 'src/semantic-ui.js');
    const mainOutputPathMin = resolve(outputDir, 'semantic-ui.min.js');
    
    const mainResult = await esbuild.build({
      entryPoints: [mainEntrypoint],
      bundle: true,
      format,
      outfile: mainOutputPathMin,
      platform,
      target,
      minify: true,
      sourcemap,
      metafile: true,
      banner: { js: banner },
      loader: {
        '.js': 'js',
        '.ts': 'ts',
        '.html': 'text',
        '.css': 'text',
        '.png': 'file',
        '.svg': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
      },
      plugins: [
        resolveBareImports({
          packageJson: pkg,
          cacheDir: CACHE_DIR,
          cdnRoot,
          logging,
          directReplacements,
        }),
        logPlugin('CDN Main (minified)'),
      ],
    });
    
    // Main bundle - unminified (if requested)
    if (buildUnminified) {
      const mainOutputPath = resolve(outputDir, 'semantic-ui.js');
      
      await esbuild.build({
        entryPoints: [mainEntrypoint],
        bundle: true,
        format,
        outfile: mainOutputPath,
        platform,
        target,
        minify: false,
        sourcemap,
        metafile: true,
        banner: { js: banner },
        loader: {
          '.js': 'js',
          '.ts': 'ts',
          '.html': 'text',
          '.css': 'text',
          '.png': 'file',
          '.svg': 'file',
          '.jpg': 'file',
          '.jpeg': 'file',
          '.gif': 'file',
        },
        plugins: [
          resolveBareImports({
            packageJson: pkg,
            cacheDir: CACHE_DIR,
            cdnRoot,
            logging,
            directReplacements,
          }),
          logPlugin('CDN Main'),
        ],
      });
    }
    
    // Build CSS - minified
    log('CDN Build', 'Building CSS');
    
    const cssEntrypoint = resolve(baseDir, 'src/semantic-ui.css');
    const cssOutputPathMin = resolve(outputDir, 'global.min.css');
    
    const cssResult = await esbuild.build({
      entryPoints: [cssEntrypoint],
      bundle: true,
      outfile: cssOutputPathMin,
      minify: true,
      sourcemap,
      plugins: [logPlugin('CDN CSS (minified)')],
      loader: {
        '.css': 'css',
        '.png': 'file',
        '.svg': 'dataurl',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
      },
      target: BROWSER_TARGET,
    });
    
    // CSS - unminified
    if (buildUnminified) {
      const cssOutputPath = resolve(outputDir, 'global.css');
      
      await esbuild.build({
        entryPoints: [cssEntrypoint],
        bundle: true,
        outfile: cssOutputPath,
        minify: false,
        sourcemap,
        plugins: [logPlugin('CDN CSS')],
        loader: {
          '.css': 'css',
          '.png': 'file',
          '.svg': 'dataurl',
          '.jpg': 'file',
          '.jpeg': 'file',
          '.gif': 'file',
        },
        target: BROWSER_TARGET,
      });
    }
    
    // Build theme
    log('CDN Build', 'Building theme');
    
    const themeEntrypoint = resolve(baseDir, 'src/themes/base/base.css');
    const themeOutputPathMin = resolve(outputDir, 'theme.min.css');
    
    const themeResult = await esbuild.build({
      entryPoints: [themeEntrypoint],
      bundle: true,
      outfile: themeOutputPathMin,
      minify: true,
      sourcemap,
      plugins: [logPlugin('CDN Theme (minified)')],
      loader: {
        '.css': 'css',
        '.png': 'file',
        '.svg': 'dataurl',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
      },
      target: BROWSER_TARGET,
    });
    
    // Theme - unminified
    if (buildUnminified) {
      const themeOutputPath = resolve(outputDir, 'theme.css');
      
      await esbuild.build({
        entryPoints: [themeEntrypoint],
        bundle: true,
        outfile: themeOutputPath,
        minify: false,
        sourcemap,
        plugins: [logPlugin('CDN Theme')],
        loader: {
          '.css': 'css',
          '.png': 'file',
          '.svg': 'dataurl',
          '.jpg': 'file',
          '.jpeg': 'file',
          '.gif': 'file',
        },
        target: BROWSER_TARGET,
      });
    }

    // Build individual component bundles
    if (createComponentBundles) {
      log('CDN Build', 'Building individual component bundles');
      
      // Get all component directories
      const componentDirs = await fs.readdir(componentsDir);
      
      for (const componentDir of componentDirs) {
        const stats = await fs.stat(resolve(componentsDir, componentDir));
        
        if (stats.isDirectory()) {
          try {
            const componentEntrypoint = resolve(componentsDir, componentDir, 'index.js');
            const componentOutputPathMin = resolve(outputDir, `${componentDir}.min.js`);
            
            // Minified version
            await esbuild.build({
              entryPoints: [componentEntrypoint],
              bundle: true,
              format,
              outfile: componentOutputPathMin,
              platform,
              target,
              minify: true,
              sourcemap,
              banner: { js: banner },
              loader: {
                '.js': 'js',
                '.ts': 'ts',
                '.html': 'text',
                '.css': 'text',
                '.png': 'file',
                '.svg': 'file',
                '.jpg': 'file',
                '.jpeg': 'file',
                '.gif': 'file',
              },
              plugins: [
                resolveBareImports({
                  packageJson: pkg,
                  cacheDir: CACHE_DIR,
                  cdnRoot,
                  logging,
                  directReplacements,
                }),
                logPlugin(`CDN ${componentDir} (minified)`),
              ],
            });
            
            // Unminified version (if requested)
            if (buildUnminified) {
              const componentOutputPath = resolve(outputDir, `${componentDir}.js`);
              
              await esbuild.build({
                entryPoints: [componentEntrypoint],
                bundle: true,
                format,
                outfile: componentOutputPath,
                platform,
                target,
                minify: false,
                sourcemap,
                banner: { js: banner },
                loader: {
                  '.js': 'js',
                  '.ts': 'ts',
                  '.html': 'text',
                  '.css': 'text',
                  '.png': 'file',
                  '.svg': 'file',
                  '.jpg': 'file',
                  '.jpeg': 'file',
                  '.gif': 'file',
                },
                plugins: [
                  resolveBareImports({
                    packageJson: pkg,
                    cacheDir: CACHE_DIR,
                    cdnRoot,
                    logging,
                    directReplacements,
                  }),
                  logPlugin(`CDN ${componentDir}`),
                ],
              });
            }
            
            // Create component directory with component-specific imports
            const componentCdnDir = resolve(outputDir, componentDir);
            await fs.mkdir(componentCdnDir, { recursive: true });
            
            // Create index files in the component directory
            // Minified
            await fs.writeFile(
              resolve(componentCdnDir, 'index.min.js'),
              `export * from '../${componentDir}.min.js';`
            );
            
            // Unminified (if requested)
            if (buildUnminified) {
              await fs.writeFile(
                resolve(componentCdnDir, 'index.js'),
                `export * from '../${componentDir}.js';`
              );
            }
            
            log('CDN Component', `Built ${componentDir}`);
          } catch (error) {
            log('CDN Component Error', `${componentDir}: ${error.message}`);
          }
        }
      }
    }
    
    // Create a package.json for the CDN build
    const cdnPackageJson = {
      name: `${pkg.name}-cdn`,
      version: pkg.version,
      type: 'module',
      main: './semantic-ui.min.js',
      module: './semantic-ui.min.js',
      description: `CDN version of ${pkg.name}`,
      author: pkg.author,
      license: pkg.license,
    };
    
    await fs.writeFile(
      resolve(outputDir, 'package.json'),
      JSON.stringify(cdnPackageJson, null, 2),
    );
    
    // Calculate total size of all files
    const mainStats = await fs.stat(mainOutputPathMin);
    const mainSize = (mainStats.size / 1024).toFixed(2);
    
    log('CDN Build Complete', `Main bundle: ${mainSize}KB`);
    
    return {
      success: true,
      paths: {
        mainMin: mainOutputPathMin,
        cssMin: cssOutputPathMin,
        themeMin: themeOutputPathMin,
      },
      sizes: {
        main: mainSize,
      },
    };
  } catch (error) {
    console.error('❌ CDN Build failed:', error);
    return {
      success: false,
      error,
    };
  }
}

export default buildUICDN;

// Handle direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    const result = await buildUICDN();
    if (!result.success) {
      process.exit(1);
    }
  })();
}

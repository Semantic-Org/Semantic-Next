import * as esbuild from 'esbuild';
import { resolve } from 'path';
import fs from 'fs/promises';
import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';

/**
 * Builds a CDN-ready version with resolved imports
 */
export async function buildCDN(options = {}) {
  console.log('DEBUG: build-cdn.js script is being executed');
  console.log('DEBUG: options:', JSON.stringify(options, null, 2));
  const {
    baseDir = process.cwd(),         // Root directory of the package
    cacheDir = '.cache',                // Cache directory for entrypoint resolution
    cdnRoot = 'https://cdn.jsdelivr.net/npm', // CDN base URL
    directReplacements = {},            // Map of packages to direct URLs
    logging = 'normal',                 // Logging verbosity
    target = ['esnext'],                // JavaScript target
    minify = true,                      // Whether to minify
    sourcemap = true,                   // Whether to generate sourcemaps
    format = 'esm',                     // Module format
    outDir = 'dist/cdn',                // Output directory
    outFile = 'index.min.js',               // Output filename
    entrypoint = null,                  // Custom entrypoint override
    platform = 'neutral',               // Target platform
    createPackageJson = true            // Whether to create a package.json
  } = options;
  
  try {
    // Resolve paths
    const CACHE_DIR = resolve(baseDir, cacheDir);
    
    // Read package.json
    const packageJsonPath = resolve(baseDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    // Determine entrypoint
    const entry = entrypoint || packageJson.module || packageJson.main || 'src/index.js';
    const entrypointPath = resolve(baseDir, entry);
    
    console.log(`📦 Using entrypoint: ${entry}`);
    
    // Ensure output directory exists
    const outputDir = resolve(baseDir, outDir);
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = resolve(outputDir, outFile);

    const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description || ''}
 *
 * @license ${pkg.license || 'MIT'}
 * @copyright (c) ${new Date().getFullYear()} ${pkg.author || ''}
 * @homepage ${pkg.homepage || ''}
 *
 * This source code is licensed under the ${pkg.license || 'MIT'} license found in the
 * LICENSE file in the root directory of this source tree.
 */`;
    
    console.log('🏗️ Building CDN bundle with transformed imports...');
    // CDN build with transformed imports
    const result = await esbuild.build({
      entryPoints: [entrypointPath],
      bundle: true,
      format,
      outfile: outputPath,
      platform,
      target,
      minify,
      sourcemap,
      metafile: true,
      banner,
      plugins: [
        resolveBareImports({
          packageJson,
          cacheDir: CACHE_DIR,
          cdnRoot,
          logging,
          directReplacements
        })
      ],
    });
    
    // Calculate build size
    const stats = await fs.stat(outputPath);
    const size = (stats.size / 1024).toFixed(2);
    
    console.log(`\n✅ CDN Build complete: ${size}KB`);
    console.log(`   - Output: ${outputPath}`);
    if (sourcemap) {
      console.log(`   - Sourcemap generated`);
    }
    
    // Create a package.json for the CDN build if requested
    if (createPackageJson) {
      const cdnPackageJson = {
        name: packageJson.name,
        version: packageJson.version,
        type: "module",
        main: `./${outFile}`,
        module: `./${outFile}`,
        description: `CDN version of ${packageJson.name}`,
        author: packageJson.author,
        license: packageJson.license
      };
      
      await fs.writeFile(
        resolve(outputDir, 'package.json'),
        JSON.stringify(cdnPackageJson, null, 2)
      );
      
      console.log(`   - Created package.json in output directory`);
    }
    
    return {
      success: true,
      path: outputPath,
      size,
      meta: result.metafile
    };
    
  } catch (error) {
    console.error('❌ CDN Build failed:', error);
    return {
      success: false,
      error
    };
  }
}

export default buildCDN;

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('DEBUG: build-cdn.js is being run directly from command line');
  
  // Wrap in async function to handle top-level await
  (async function() {
    const result = await buildCDN();
    
    if (!result.success) {
      process.exit(1);
    }
  })();
}

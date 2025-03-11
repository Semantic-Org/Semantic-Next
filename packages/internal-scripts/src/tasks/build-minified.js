import * as esbuild from 'esbuild';
import { resolve } from 'path';
import fs from 'fs/promises';
import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';

/**
 * Builds a CDN-ready version with resolved imports
 */
export async function build(options = {}) {
  console.log('DEBUG: build.js script is being executed');
  console.log('DEBUG: options:', JSON.stringify(options, null, 2));
  const {
    baseDir = process.cwd(),   // Root directory of the package
    target = ['esnext'],       // JavaScript target
    minify = true,             // Whether to minify
    sourcemap = true,          // Whether to generate sourcemaps
    format = 'esm',            // Module format
    outDir = 'dist/',          // Output directory
    outFile = `index.min.js`,  // Output filename
    entrypoint = null,         // Custom entrypoint override
    platform = 'neutral',      // Target platform
    logLevel = 'info',         // log level
    createPackageJson = true   // Whether to create a package.json
  } = options;

  try {
    // Read package.json
    const packageJsonPath = resolve(baseDir, 'package.json');
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Determine entrypoint
    const entry = entrypoint || pkg.module || pkg.main || 'src/index.js';
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

    console.log('🏗️ Building bundle with transformed imports...');
    // build with transformed imports
    const result = await esbuild.build({
      entryPoints: [entrypointPath],
      bundle: true,
      format,
      platform,
      outfile: outputPath,
      target,
      minify,
      logLevel,
      sourcemap,
      banner: { js: banner },
      legalComments: 'none', // we are not bundling external deps
      external: Object.keys(pkg.dependencies || {}),
      metafile: true,
    });

    // Calculate build size
    const stats = await fs.stat(outputPath);
    const size = (stats.size / 1024).toFixed(2);

    console.log(`\n✅ Build complete: ${size}KB`);
    console.log(`   - Output: ${outputPath}`);
    if (sourcemap) {
      console.log(`   - Sourcemap generated`);
    }

    return {
      success: true,
      path: outputPath,
      size,
      meta: result.metafile
    };

  } catch (error) {
    console.error('❌ Build failed:', error);
    return {
      success: false,
      error
    };
  }
}

export default build;

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('DEBUG: build.js is being run directly from command line');
  
  // Wrap in async function to handle top-level await
  (async function() {
    const result = await build();
    
    if (!result.success) {
      process.exit(1);
    }
  })();
}

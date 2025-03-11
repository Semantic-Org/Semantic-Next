import * as esbuild from 'esbuild';
import { resolve } from 'path';
import fs from 'fs/promises';
import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';

/**
 * Builds a CDN-ready version with resolved imports
 */
export async function build(options = {}) {
  console.log('HERE!');
  const {
    packageDir = process.cwd(),               // Root directory of the package
    target = ['es2020'],                      // JavaScript target
    minify = true,                            // Whether to minify
    sourcemap = true,                         // Whether to generate sourcemaps
    format = 'esm',                           // Module format
    outDir = 'dist/',                         // Output directory
    outFile = 'index.js',                     // Output filename
    entrypoint = null,                        // Custom entrypoint override
    platform = 'browser',                     // Target platform
    createPackageJson = true                  // Whether to create a package.json
  } = options;

  try {
    // Read package.json
    const packageJsonPath = resolve(packageDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Determine entrypoint
    const entry = entrypoint || packageJson.module || packageJson.main || 'src/index.js';
    const entrypointPath = resolve(packageDir, entry);

    console.log(`📦 Using entrypoint: ${entry}`);

    // Ensure output directory exists
    const outputDir = resolve(packageDir, outDir);
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = resolve(outputDir, outFile);

    console.log('🏗️ Building CDN bundle with transformed imports...');
    // build with transformed imports
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
    });

    // Calculate build size
    const stats = await fs.stat(outputPath);
    const size = (stats.size / 1024).toFixed(2);

    console.log(`\n✅ Build complete: ${size}KB`);
    console.log(`   - Output: ${outputPath}`);
    if (sourcemap) {
      console.log(`   - Sourcemap generated`);
    }

    // Create a package.json for the build if requested
    if (createPackageJson) {
      const cdnPackageJson = {
        name: packageJson.name,
        version: packageJson.version,
        type: "module",
        main: `./${outFile}`,
        module: `./${outFile}`,
        description: `Minified version of ${packageJson.name}`,
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
    console.error('❌ Build failed:', error);
    return {
      success: false,
      error
    };
  }
}

export default build;

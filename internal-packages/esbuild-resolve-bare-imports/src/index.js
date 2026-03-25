// scripts/plugins/resolve-bare-imports.js
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * esbuild plugin that resolves bare module imports to URLs with
 * built-in caching and entrypoint resolution.
 */
export function resolveBareImports(options = {}) {
  const {
    packageJson = {},
    onlyDependencies = null, // If provided, only transform these dependencies
    cacheDir = '.cache',
    cdnRoot = 'https://cdn.jsdelivr.net/npm',
    logging = 'silent', // 'silent', 'minimal', 'normal', 'verbose'
    // Custom resolver function (packageName, version, entrypoint) => string
    resolver = null,
    // Direct replacements for packages - bypasses resolution
    directReplacements = {},
  } = options;

  // Default resolver function that converts to CDN URLs
  const defaultResolver = (packageName, version, entrypoint) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    // Fix: Ensure no double slashes in URL path
    const cleanEntrypoint = entrypoint.startsWith('/') ? entrypoint.substring(1) : entrypoint;
    return `${cdnRoot}/${packageName}@${cleanVersion}/${cleanEntrypoint}`;
  };

  // Use the provided resolver or fall back to the default
  const resolveUrl = resolver || defaultResolver;

  // Determine which dependencies to process
  const dependencies = onlyDependencies || {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  };

  // Logging utilities
  const log = {
    error: (...args) => {
      if (logging !== 'silent') { console.error(...args); }
    },
    warn: (...args) => {
      if (logging !== 'silent') { console.warn(...args); }
    },
    info: (...args) => {
      if (['normal', 'verbose'].includes(logging)) { console.log(...args); }
    },
    verbose: (...args) => {
      if (logging === 'verbose') { console.log(...args); }
    },
  };

  // Function to parse a bare import into package name and subpath
  const parseImport = (importPath) => {
    if (importPath.startsWith('@')) {
      // This is a scoped package
      const parts = importPath.split('/');
      if (parts.length <= 2) {
        // Just the scoped package name, no subpath
        return {
          packageName: importPath,
          subPath: null,
        };
      }

      // Scoped package with subpath
      const packageName = `${parts[0]}/${parts[1]}`;
      const subPath = parts.slice(2).join('/');
      return {
        packageName,
        subPath,
      };
    }
    else {
      // Regular package
      const parts = importPath.split('/');
      if (parts.length === 1) {
        // Just the package name, no subpath
        return {
          packageName: importPath,
          subPath: null,
        };
      }

      // Regular package with subpath
      const packageName = parts[0];
      const subPath = parts.slice(1).join('/');
      return {
        packageName,
        subPath,
      };
    }
  };

  // Ensure cache directory exists
  const ensureCacheDir = async () => {
    await fs.mkdir(cacheDir, { recursive: true });
  };

  // Get cached entrypoint
  const getCachedEntrypoint = async (packageName, version) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    const cacheKey = `${packageName}@${cleanVersion}`;
    const cachePath = path.join(cacheDir, `${cacheKey.replace(/\//g, '_')}.json`);

    try {
      if (existsSync(cachePath)) {
        const cache = JSON.parse(await fs.readFile(cachePath, 'utf-8'));
        log.verbose(`📦 Cache hit for ${packageName}@${cleanVersion}: ${cache.entrypoint}`);
        return cache.entrypoint;
      }
    }
    catch (error) {
      log.warn(`⚠️ Cache read error for ${cacheKey}:`, error.message);
    }

    return null;
  };

  // Save entrypoint to cache
  const saveEntrypointToCache = async (packageName, version, entrypoint) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    const cacheKey = `${packageName}@${cleanVersion}`;
    const cachePath = path.join(cacheDir, `${cacheKey.replace(/\//g, '_')}.json`);

    try {
      await fs.writeFile(
        cachePath,
        JSON.stringify(
          {
            entrypoint,
            packageName,
            version: cleanVersion,
          },
          null,
          2,
        ),
      );
      log.verbose(`💾 Cached entrypoint for ${packageName}@${cleanVersion}: ${entrypoint}`);
    }
    catch (error) {
      log.warn(`⚠️ Failed to save cache for ${cacheKey}:`, error.message);
    }
  };

  // Fetch entrypoint from jsDelivr API
  const getEntrypoint = async (packageName, version) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    try {
      // First check cache
      await ensureCacheDir();
      const cachedEntrypoint = await getCachedEntrypoint(packageName, version);
      if (cachedEntrypoint !== null) {
        return cachedEntrypoint;
      }

      log.verbose(`🔍 Fetching entrypoint for ${packageName}@${cleanVersion}...`);

      // Query jsDelivr API
      const response = await fetch(
        `https://data.jsdelivr.com/v1/packages/npm/${packageName}@${cleanVersion}/entrypoints`,
      );

      if (!response.ok) {
        log.warn(`⚠️ Couldn't fetch entrypoint for ${packageName}@${cleanVersion}, using default`);
        // Cache the default to avoid repeated failed requests
        const defaultEntrypoint = 'dist/index.min.js';
        await saveEntrypointToCache(packageName, version, defaultEntrypoint);
        return defaultEntrypoint;
      }

      const data = await response.json();

      // Get the entrypoint or use default
      const entrypoint = data?.entrypoints?.js?.file || 'dist/index.min.js';
      log.verbose(`✅ Found entrypoint for ${packageName}@${cleanVersion}: ${entrypoint}`);

      // Save to permanent cache
      await saveEntrypointToCache(packageName, version, entrypoint);

      return entrypoint;
    }
    catch (error) {
      log.warn(`⚠️ Error fetching entrypoint for ${packageName}@${cleanVersion}:`, error.message);
      return 'dist/index.min.js';
    }
  };

  // Process all dependencies to fetch entrypoints
  const processAllDependencies = async () => {
    log.info('🔍 Fetching dependency entrypoints...');
    const entrypoints = {};

    for (const [packageName, version] of Object.entries(dependencies)) {
      // Skip packages with direct replacements - we don't need to fetch entrypoints
      if (directReplacements[packageName]) {
        log.info(`  ✓ ${packageName}: using direct replacement`);
        continue;
      }

      const entrypoint = await getEntrypoint(packageName, version);
      entrypoints[packageName] = entrypoint;
      log.info(`  ✓ ${packageName}: ${entrypoint}`);
    }

    return entrypoints;
  };

  // The actual esbuild plugin
  return {
    name: 'resolve-bare-imports',
    setup(build) {
      let entrypointsPromise = processAllDependencies();

      // Handle all bare module imports
      build.onResolve({ filter: /^[^\.\/]/ }, async (args) => {
        const importPath = args.path;
        const { packageName, subPath } = parseImport(importPath);

        // Check for direct replacement first
        if (directReplacements[importPath]) {
          log.verbose(`🔄 Using direct replacement for ${importPath}: ${directReplacements[importPath]}`);
          return {
            path: directReplacements[importPath],
            external: true,
          };
        }

        // Check for direct replacement of base package for subpath imports
        if (directReplacements[packageName]) {
          const replacement = directReplacements[packageName];

          if (subPath) {
            // Handle subpath with direct replacement
            const baseUrl = replacement.endsWith('/') ? replacement : `${replacement}/`;
            const resolvedUrl = `${baseUrl}${subPath}`;

            log.verbose(`🔄 Using direct replacement for ${importPath}: ${resolvedUrl}`);
            return {
              path: resolvedUrl,
              external: true,
            };
          }
          else {
            // Direct replacement with no subpath
            log.verbose(`🔄 Using direct replacement for ${packageName}: ${replacement}`);
            return {
              path: replacement,
              external: true,
            };
          }
        }

        // Skip packages not in our dependencies list if onlyDependencies is provided
        if (onlyDependencies && !dependencies[packageName]) {
          log.verbose(`⏩ Skipping ${importPath} (not in onlyDependencies)`);
          return null;
        }

        // Skip packages not specified in any dependency
        if (!dependencies[packageName]) {
          log.verbose(`⏩ Skipping ${importPath} (not a dependency)`);
          return null;
        }

        // Get version for the package
        const version = dependencies[packageName] || 'latest';

        // Handle subpath case
        if (subPath) {
          log.verbose(`🔀 Subpath import: ${packageName} -> ${subPath}`);

          // Resolve the URL using the resolver
          const resolvedUrl = resolveUrl(packageName, version, subPath);
          log.verbose(`🔄 Resolved import: ${importPath} -> ${resolvedUrl}`);

          return {
            path: resolvedUrl,
            external: true,
          };
        }

        // Handle regular package (no subpath)
        // Await the entrypoints to be loaded
        const entrypoints = await entrypointsPromise;
        const entrypoint = entrypoints[packageName] || 'dist/index.min.js';

        // Resolve the URL using the resolver
        const resolvedUrl = resolveUrl(packageName, version, entrypoint);
        log.verbose(`🔄 Resolved import: ${packageName} -> ${resolvedUrl}`);

        return {
          path: resolvedUrl,
          external: true,
        };
      });
    },
  };
}

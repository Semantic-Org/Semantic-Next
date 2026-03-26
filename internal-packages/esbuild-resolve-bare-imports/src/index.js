import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * esbuild plugin that resolves bare module imports to URLs with
 * built-in caching and entrypoint resolution.
 *
 * @param {Object} options
 * @param {Object} options.packageJson - The package.json of the package being built
 * @param {Object} options.onlyDependencies - If provided, only transform these dependencies
 * @param {string} options.cacheDir - Directory for caching resolved entrypoints
 * @param {string} options.cdnRoot - Base URL for the CDN
 * @param {string} options.logging - Log level: 'silent', 'minimal', 'normal', 'verbose'
 * @param {Function} options.resolver - Custom URL builder: (packageName, version, entrypoint) => string
 * @param {Object} options.directReplacements - Bypass resolution for specific packages
 * @param {Function} options.resolveEntrypoint - Resolve a package's entrypoint locally: (packageName, version, packageJson) => string|null
 * @param {Function} options.resolveVersion - Override the version for a package: (packageName, declaredVersion) => string
 * @param {Function} options.resolvePackagePath - Transform the package name in the URL: (packageName) => string
 */
export function resolveBareImports(options = {}) {
  const {
    packageJson = {},
    onlyDependencies = null,
    cacheDir = '.cache',
    cdnRoot = 'https://cdn.jsdelivr.net/npm',
    logging = 'silent',
    resolver = null,
    directReplacements = {},
    resolveEntrypoint = null,
    resolveVersion = null,
    resolvePackagePath = null,
  } = options;

  const defaultResolver = (packageName, version, entrypoint) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    const cleanEntrypoint = entrypoint.startsWith('/') ? entrypoint.substring(1) : entrypoint;
    const packagePath = resolvePackagePath
      ? resolvePackagePath(packageName)
      : packageName;
    return `${cdnRoot}/${packagePath}@${cleanVersion}/${cleanEntrypoint}`;
  };

  const resolveUrl = resolver || defaultResolver;

  const dependencies = onlyDependencies || {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  };

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

  const parseImport = (importPath) => {
    if (importPath.startsWith('@')) {
      const parts = importPath.split('/');
      if (parts.length <= 2) {
        return { packageName: importPath, subPath: null };
      }
      return {
        packageName: `${parts[0]}/${parts[1]}`,
        subPath: parts.slice(2).join('/'),
      };
    }
    else {
      const parts = importPath.split('/');
      if (parts.length === 1) {
        return { packageName: importPath, subPath: null };
      }
      return {
        packageName: parts[0],
        subPath: parts.slice(1).join('/'),
      };
    }
  };

  const ensureCacheDir = async () => {
    await fs.mkdir(cacheDir, { recursive: true });
  };

  const getCachedEntrypoint = async (packageName, version) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    const cacheKey = `${packageName}@${cleanVersion}`;
    const cachePath = path.join(cacheDir, `${cacheKey.replace(/\//g, '_')}.json`);

    try {
      if (existsSync(cachePath)) {
        const cache = JSON.parse(await fs.readFile(cachePath, 'utf-8'));
        log.verbose(`Cache hit for ${packageName}@${cleanVersion}: ${cache.entrypoint}`);
        return cache.entrypoint;
      }
    }
    catch (error) {
      log.warn(`Cache read error for ${cacheKey}:`, error.message);
    }

    return null;
  };

  const saveEntrypointToCache = async (packageName, version, entrypoint) => {
    const cleanVersion = version.replace(/[\^~]/g, '');
    const cacheKey = `${packageName}@${cleanVersion}`;
    const cachePath = path.join(cacheDir, `${cacheKey.replace(/\//g, '_')}.json`);

    try {
      await fs.writeFile(
        cachePath,
        JSON.stringify({ entrypoint, packageName, version: cleanVersion }, null, 2),
      );
      log.verbose(`Cached entrypoint for ${packageName}@${cleanVersion}: ${entrypoint}`);
    }
    catch (error) {
      log.warn(`Failed to save cache for ${cacheKey}:`, error.message);
    }
  };

  // Resolve a package's entrypoint using the local callback or jsdelivr API
  const getEntrypoint = async (packageName, version) => {
    const cleanVersion = version.replace(/[\^~]/g, '');

    // Try the local resolver first
    if (resolveEntrypoint) {
      try {
        const localResult = await resolveEntrypoint(packageName, cleanVersion);
        if (localResult) {
          log.verbose(`Local entrypoint for ${packageName}@${cleanVersion}: ${localResult}`);
          await saveEntrypointToCache(packageName, version, localResult);
          return localResult;
        }
      }
      catch (error) {
        log.warn(`Local entrypoint resolution failed for ${packageName}:`, error.message);
      }
    }

    // Fall back to cache → jsdelivr API
    try {
      await ensureCacheDir();
      const cachedEntrypoint = await getCachedEntrypoint(packageName, version);
      if (cachedEntrypoint !== null) {
        return cachedEntrypoint;
      }

      log.verbose(`Fetching entrypoint for ${packageName}@${cleanVersion}...`);

      const response = await fetch(
        `https://data.jsdelivr.com/v1/packages/npm/${packageName}@${cleanVersion}/entrypoints`,
      );

      if (!response.ok) {
        log.warn(`Couldn't fetch entrypoint for ${packageName}@${cleanVersion}, using default`);
        const defaultEntrypoint = 'dist/index.min.js';
        await saveEntrypointToCache(packageName, version, defaultEntrypoint);
        return defaultEntrypoint;
      }

      const data = await response.json();
      const entrypoint = data?.entrypoints?.js?.file || 'dist/index.min.js';
      log.verbose(`Found entrypoint for ${packageName}@${cleanVersion}: ${entrypoint}`);

      await saveEntrypointToCache(packageName, version, entrypoint);
      return entrypoint;
    }
    catch (error) {
      log.warn(`Error fetching entrypoint for ${packageName}@${cleanVersion}:`, error.message);
      return 'dist/index.min.js';
    }
  };

  const getVersion = (packageName, declaredVersion) => {
    if (resolveVersion) {
      return resolveVersion(packageName, declaredVersion);
    }
    return declaredVersion;
  };

  const processAllDependencies = async () => {
    log.info('Resolving dependency entrypoints...');
    const entrypoints = {};

    for (const [packageName, version] of Object.entries(dependencies)) {
      if (directReplacements[packageName]) {
        log.info(`  ${packageName}: using direct replacement`);
        continue;
      }

      const resolvedVersion = getVersion(packageName, version);
      const entrypoint = await getEntrypoint(packageName, resolvedVersion);
      entrypoints[packageName] = entrypoint;
      log.info(`  ${packageName}: ${entrypoint}`);
    }

    return entrypoints;
  };

  return {
    name: 'resolve-bare-imports',
    setup(build) {
      let entrypointsPromise = processAllDependencies();

      build.onResolve({ filter: /^[^\.\/]/ }, async (args) => {
        const importPath = args.path;
        const { packageName, subPath } = parseImport(importPath);

        // Direct replacements take priority
        if (directReplacements[importPath]) {
          log.verbose(`Direct replacement for ${importPath}: ${directReplacements[importPath]}`);
          return {
            path: directReplacements[importPath],
            external: true,
          };
        }

        if (directReplacements[packageName]) {
          const replacement = directReplacements[packageName];
          if (subPath) {
            const baseUrl = replacement.endsWith('/') ? replacement : `${replacement}/`;
            const resolvedUrl = `${baseUrl}${subPath}`;
            log.verbose(`Direct replacement for ${importPath}: ${resolvedUrl}`);
            return { path: resolvedUrl, external: true };
          }
          else {
            log.verbose(`Direct replacement for ${packageName}: ${replacement}`);
            return { path: replacement, external: true };
          }
        }

        // Skip packages not in the dependency list
        if (onlyDependencies && !dependencies[packageName]) {
          log.verbose(`Skipping ${importPath} (not in onlyDependencies)`);
          return null;
        }
        if (!dependencies[packageName]) {
          log.verbose(`Skipping ${importPath} (not a dependency)`);
          return null;
        }

        const declaredVersion = dependencies[packageName] || 'latest';
        const version = getVersion(packageName, declaredVersion);

        if (subPath) {
          log.verbose(`Subpath import: ${packageName} -> ${subPath}`);
          const resolvedUrl = resolveUrl(packageName, version, subPath);
          log.verbose(`Resolved: ${importPath} -> ${resolvedUrl}`);
          return { path: resolvedUrl, external: true };
        }

        // Main entrypoint
        const entrypoints = await entrypointsPromise;
        const entrypoint = entrypoints[packageName] || 'dist/index.min.js';
        const resolvedUrl = resolveUrl(packageName, version, entrypoint);
        log.verbose(`Resolved: ${packageName} -> ${resolvedUrl}`);

        return { path: resolvedUrl, external: true };
      });
    },
  };
}

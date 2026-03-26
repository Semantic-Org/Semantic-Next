import { build, getPackageFile } from './lib/build.js';

/*
  Builds CDN format: bare module imports rewritten to CDN URLs.
  Also builds sub-path exports as separate entry points so that
  imports like '@semantic-ui/core/button' resolve on the CDN.
*/

export const buildCDN = async ({
  watch = false,
  minify = true,
  ...config
} = {}) => {
  const tasks = [];

  // Main entry point
  tasks.push(
    build({
      ...config,
      watch,
      cdn: true,
      minify: false,
    }),
  );

  if (minify) {
    tasks.push(
      build({
        ...config,
        watch,
        cdn: true,
        minify: true,
      }),
    );
  }

  // Build sub-path exports as separate CDN entry points
  // Only when no custom entryPoints are provided (packages, not framework)
  if (!config.entryPoints?.length) {
    const packageFile = await getPackageFile();
    const exports = packageFile.exports || {};

    for (const [exportPath, conditions] of Object.entries(exports)) {
      // Skip the main export (already built above) and non-JS exports
      if (exportPath === '.') { continue; }
      if (exportPath.endsWith('.css')) { continue; }

      // Resolve the source entry from export conditions
      const source = typeof conditions === 'string'
        ? conditions
        : conditions.import || conditions.browser || conditions.default;
      if (!source || !source.endsWith('.js')) { continue; }

      // Derive the output name from the export path: ./icons/meta → icons/meta
      const outName = exportPath.replace(/^\.\//, '');

      const subpathConfig = {
        ...config,
        watch,
        cdn: true,
        entryPoints: [source],
        outdir: 'dist/cdn',
        addOutfile: false,
        addLog: false,
      };

      tasks.push(
        build({ ...subpathConfig, minify: false, entryNames: outName }),
      );

      if (minify) {
        tasks.push(
          build({
            ...subpathConfig,
            minify: true,
            entryNames: outName,
            outExtension: { '.js': '.min.js', '.css': '.min.css' },
          }),
        );
      }
    }
  }

  return Promise.all(tasks);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildCDN();
  })();
}

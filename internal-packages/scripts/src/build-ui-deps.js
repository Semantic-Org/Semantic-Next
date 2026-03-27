import { callback as callbackPlugin } from '@semantic-ui/esbuild-callback';
import { SpecReader } from '@semantic-ui/specs';
import { asyncEach, isArray } from '@semantic-ui/utils';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import glob from 'tiny-glob';
import { pathToFileURL } from 'url';
import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';
import { validateSpec } from './lib/validate-spec.js';

/*
  Generate component spec JS from source spec
*/
const generateComponentSpecJS = async (spec, plural = false, specSettings = {}, sourceFile = '') => {
  const readerSettings = {
    plural,
    ...specSettings,
  };
  const reader = new SpecReader(spec, readerSettings);
  const componentSpec = reader.getWebComponentSpec();
  const filename = plural
    ? `${spec?.pluralTagName?.replace('ui-', '')}.component.js`
    : 'component.js';

  const sourceFileName = sourceFile
    ? sourceFile.split('/').pop()
    : (spec?.tagName?.replace('ui-', '') || 'spec') + '.spec.js';
  return `// Auto-generated from ${sourceFileName}\nexport default ${JSON.stringify(componentSpec, null, 2)};\n`;
};

/*
  We need to flatten css imported by the web components
  because they read them as a files (js bundler will not parse @import in css)
*/
export const buildUIDeps = async ({
  watch = false,
} = {}) => {
  const cssComponentBundle = build({
    banner: { css: INTERNAL_CSS_BANNER },
    type: 'css',
    minify: false,
    addBanner: false,
    metafile: false,
    sourcemap: false,
    watch,
    bundle: true,
    log: { header: 'UI Components', text: 'CSS Bundle' },
    entryPoints: [
      'src/primitives/**/css/*.css',
    ],
    entryNames: '[dir]/../[name]-bundle',
    outbase: 'src',
    outdir: 'src',
  });

  /* No page css used currently */
  // const pageCSSBundle = build({
  //   banner: { css: INTERNAL_CSS_BANNER },
  //   type: 'css',
  //   minify: false,
  //   addBanner: false,
  //   metafile: false,
  //   sourcemap: false,
  //   watch,
  //   bundle: true,
  //   log: { header: 'UI Components', text: 'Page CSS Bundle' },
  //   entryPoints: [
  //     'src/primitives/**/page-css/*.css',
  //   ],
  //   entryNames: '[dir]/../[name]-bundle',
  //   outbase: 'src',
  //   outdir: 'src',
  // });

  // Get all .spec.js source files
  const specJsFiles = await glob('src/primitives/**/specs/*.spec.js');
  const entryPoints = specJsFiles;

  // Collected during createComponentSpecs, written by generatePresetManifest
  const bundles = {};

  const createComponentSpecs = async () => {
    await asyncEach(entryPoints, async (entryPath) => {
      try {
        // Load JS module with cache busting for watch mode
        const specModule = await import(`${pathToFileURL(entryPath).href}?t=${Date.now()}`);
        const spec = specModule.default;

        // Validate JS specs are pure data
        validateSpec(spec, entryPath);

        // Generate JSON snapshot for machine readability (LLMs, tooling)
        const jsonPath = entryPath.replace('.spec.js', '.spec.json');
        const jsonContent = `${JSON.stringify(spec, null, 2)}\n`;
        writeFileSync(jsonPath, jsonContent);

        // Generate component spec JS
        const componentSpecJS = await generateComponentSpecJS(spec, false, {}, entryPath);
        const componentJSPath = entryPath.replace('.spec.js', '.component.js');
        writeFileSync(componentJSPath, componentSpecJS);

        // Generate plural variant if supported
        if (spec?.supportsPlural) {
          const pluralComponentSpecJS = await generateComponentSpecJS(spec, true, {}, entryPath);
          const pluralName = spec?.pluralTagName.replace('ui-', '');
          const pluralJSPath = resolve(dirname(entryPath), `${pluralName}.component.js`);
          writeFileSync(pluralJSPath, pluralComponentSpecJS);
        }

        // Collect bundle assignments for CDN preset manifest
        if (spec.bundle) {
          const componentName = spec.tagName.replace('ui-', '');
          const bundleNames = isArray(spec.bundle) ? spec.bundle : [spec.bundle];
          for (const name of bundleNames) {
            if (!bundles[name]) {
              bundles[name] = [];
            }
            bundles[name].push(componentName);
          }
        }
      }
      catch (e) {
        console.error(`Error processing ${entryPath}:`, e.message);
        throw e; // Don't silently skip errors in new system
      }
    });
  };

  /*
    Write CDN preset manifest from bundle fields collected during spec generation.
    Aggregates into { presetName: [componentName, ...] } at dist/presets.json.
  */
  const generatePresetManifest = async () => {
    if (Object.keys(bundles).length > 0) {
      const distDir = resolve('dist');
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      writeFileSync(
        resolve(distDir, 'presets.json'),
        JSON.stringify(bundles, null, 2) + '\n',
      );
    }
  };

  // Set up a separate esbuild watcher for spec files
  let specWatcher;
  if (watch) {
    // Use esbuild to watch the .spec.js files by treating them as entry points
    // with a plugin that rebuilds our component specs
    if (entryPoints.length > 0) {
      specWatcher = build({
        watch,
        write: false, // Don't write output, just watch
        logLevel: 'silent', // Suppress esbuild's own logs
        log: { header: 'UI Components', text: 'Specs Built' },
        entryPoints,
        outdir: '.temp-watch', // Required by esbuild when multiple entry points
        plugins: [
          callbackPlugin({
            onComplete: async (result, { isRebuild }) => {
              if (isRebuild) {
                try {
                  await createComponentSpecs();
                }
                catch (error) {
                  // nothing
                }
              }
            },
          }),
        ],
      });
    }
  }

  // Preset manifest depends on data collected during spec generation
  await Promise.all([
    cssComponentBundle,
    createComponentSpecs(),
    specWatcher,
  ].filter(Boolean));

  return await generatePresetManifest();
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    // Check for --watch flag in command line arguments
    const watch = process.argv.includes('--watch');
    await buildUIDeps({ watch });
  })();
}

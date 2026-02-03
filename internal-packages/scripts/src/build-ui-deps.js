import { callback as callbackPlugin } from '@semantic-ui/esbuild-callback';
import { SpecReader } from '@semantic-ui/specs';
import { asyncEach } from '@semantic-ui/utils';
import { writeFileSync } from 'fs';
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

  const pageCSSBundle = build({
    banner: { css: INTERNAL_CSS_BANNER },
    type: 'css',
    minify: false,
    addBanner: false,
    metafile: false,
    sourcemap: false,
    watch,
    bundle: true,
    log: { header: 'UI Components', text: 'Page CSS Bundle' },
    entryPoints: [
      'src/primitives/**/page-css/*.css',
    ],
    entryNames: '[dir]/../[name]-bundle',
    outbase: 'src',
    outdir: 'src',
  });

  // Get all .spec.js source files
  const specJsFiles = await glob('src/primitives/**/specs/*.spec.js');
  const entryPoints = specJsFiles;

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
      }
      catch (e) {
        console.error(`Error processing ${entryPath}:`, e.message);
        throw e; // Don't silently skip errors in new system
      }
    });
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

  return await Promise.all([
    cssComponentBundle,
    pageCSSBundle,
    createComponentSpecs(),
    specWatcher,
  ].filter(Boolean));
};

// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    // Check for --watch flag in command line arguments
    const watch = process.argv.includes('--watch');
    await buildUIDeps({ watch });
  })();
}

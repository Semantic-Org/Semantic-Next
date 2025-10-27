import { callback as callbackPlugin } from '@semantic-ui/esbuild-callback';
import { SpecReader } from '@semantic-ui/specs';
import { asyncEach, each } from '@semantic-ui/utils';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import glob from 'tiny-glob';
import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';

/*
  Generate component spec JS directly without intermediate JSON file
*/
const generateComponentSpecJS = async (spec, plural = false, specSettings = {}) => {
  const readerSettings = {
    plural,
    ...specSettings,
  };
  const reader = new SpecReader(spec, readerSettings);
  const componentSpec = reader.getWebComponentSpec();
  const filename = plural
    ? `${spec?.pluralTagName?.replace('ui-', '')}-component.js`
    : 'component.js';
  return `// Auto-generated from ${spec?.tagName?.replace('ui-', '') || 'spec'}.json\nexport default ${
    JSON.stringify(componentSpec, null, 2)
  };\n`;
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

  // External glob needed for proper negation support
  const allFiles = await glob('src/primitives/**/specs/*.json');
  const entryPoints = allFiles.filter(path => !path.endsWith('-component.json'));

  const createComponentSpecs = async () => {
    await asyncEach(entryPoints, async (entryPath) => {
      try {
        const contents = readFileSync(entryPath, 'utf8');
        const spec = JSON.parse(contents);

        // Generate component spec JS directly
        const componentSpecJS = await generateComponentSpecJS(spec, false);
        const componentJSPath = entryPath.replace('.json', '-component.js');
        writeFileSync(componentJSPath, componentSpecJS);

        // Generate plural variant if supported
        if (spec?.supportsPlural) {
          const pluralComponentSpecJS = await generateComponentSpecJS(spec, true);
          const pluralName = spec?.pluralTagName.replace('ui-', '');
          const pluralJSPath = resolve(dirname(entryPath), `${pluralName}-component.js`);
          writeFileSync(pluralJSPath, pluralComponentSpecJS);
        }
      }
      catch (e) {
        // Silently skip malformed JSON files
      }
    });
  };

  // Convert raw spec JSON to JS modules to avoid ESM JSON import compatibility issues
  const generateJSExportsFromSpecs = async () => {
    await createComponentSpecs();

    // Only process raw spec files (not component specs, which are generated directly above)
    const rawSpecFiles = await glob('src/primitives/*/specs/*.json');
    const filteredRawSpecs = rawSpecFiles.filter(path => !path.endsWith('-component.json'));

    each(filteredRawSpecs, (jsonFile) => {
      try {
        const jsonContent = readFileSync(jsonFile, 'utf-8');
        const spec = JSON.parse(jsonContent);
        const jsContent = `// Auto-generated from ${jsonFile.split('/').pop()}\nexport default ${
          JSON.stringify(spec, null, 2)
        };\n`;
        const jsFile = jsonFile.replace('.json', '.js');
        writeFileSync(jsFile, jsContent);
      }
      catch (error) {
        console.error(`Error processing ${jsonFile}:`, error.message);
      }
    });
  };

  const generateJSExports = generateJSExportsFromSpecs();

  // Set up a separate esbuild watcher for JSON spec files
  let specWatcher;
  if (watch) {
    // Get all spec files to watch
    const specsPattern = 'src/primitives/**/specs/*.json';
    const watchedFiles = await glob(specsPattern);
    const specFiles = watchedFiles.filter(path => !path.endsWith('-component.json'));

    // Use esbuild to watch the JSON files by treating them as entry points
    // with a plugin that rebuilds our spec JS files
    if (specFiles.length > 0) {
      specWatcher = build({
        watch,
        write: false, // Don't write output, just watch
        logLevel: 'silent', // Suppress esbuild's own logs
        entryPoints: specFiles,
        outdir: '.temp-watch', // Required by esbuild when multiple entry points
        plugins: [
          callbackPlugin({
            onComplete: async (result, { isRebuild }) => {
              if (!isRebuild) {
                console.log(`[UI Deps] Watching ${specFiles.length} spec files for changes...`);
              }
              else {
                console.log(`[UI Deps] Spec files changed, rebuilding...`);
                try {
                  await createComponentSpecs();
                  await generateJSExportsFromSpecs();
                  console.log(`[UI Deps] Spec files rebuilt successfully`);
                }
                catch (error) {
                  console.error(`[UI Deps] Error rebuilding specs:`, error.message);
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
    createComponentSpecs(),
    generateJSExports,
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

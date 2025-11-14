import { callback as callbackPlugin } from '@semantic-ui/esbuild-callback';
import { SpecReader } from '@semantic-ui/specs';
import { asyncEach, each } from '@semantic-ui/utils';
import { readFileSync, writeFileSync } from 'fs';
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

  // External glob needed for proper negation support
  // Support both .json (legacy) and .spec.js (new) during transition
  const jsonFiles = await glob('src/primitives/**/specs/*.json');
  const specJsFiles = await glob('src/primitives/**/specs/*.spec.js');

  const allFiles = [...jsonFiles, ...specJsFiles];
  // Exclude all generated files (*.component.js, *.component.json, *.spec.json)
  const entryPoints = allFiles.filter(path =>
    !path.endsWith('.component.json')
    && !path.endsWith('.component.js')
    && !path.endsWith('.spec.json') // Generated JSON from .spec.js
  );

  const createComponentSpecs = async () => {
    await asyncEach(entryPoints, async (entryPath) => {
      try {
        let spec;
        const isJsSpec = entryPath.endsWith('.spec.js');

        if (isJsSpec) {
          // Load JS module with cache busting for watch mode
          const specModule = await import(`${pathToFileURL(entryPath).href}?t=${Date.now()}`);
          spec = specModule.default;

          // Validate JS specs are pure data
          validateSpec(spec, entryPath);

          // Generate JSON snapshot for machine readability (LLMs, tooling)
          const jsonPath = entryPath.replace('.spec.js', '.spec.json');
          const jsonContent = `${JSON.stringify(spec, null, 2)}\n`;
          writeFileSync(jsonPath, jsonContent);
        }
        else {
          // Legacy JSON loading
          const contents = readFileSync(entryPath, 'utf8');
          spec = JSON.parse(contents);
        }

        // Generate component spec JS directly
        const componentSpecJS = await generateComponentSpecJS(spec, false, {}, entryPath);
        const componentJSPath = isJsSpec
          ? entryPath.replace('.spec.js', '.component.js')
          : entryPath.replace('.json', '.component.js');
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

  // Convert raw spec JSON to JS modules to avoid ESM JSON import compatibility issues
  // Note: .spec.js files don't need conversion - they're already JS modules
  const generateJSExportsFromSpecs = async () => {
    await createComponentSpecs();

    // Only process legacy JSON spec files (not .spec.js/json or .component.js)
    const rawSpecFiles = await glob('src/primitives/*/specs/*.json');
    const filteredRawSpecs = rawSpecFiles.filter(path =>
      !path.endsWith('.component.json')
      && !path.endsWith('.spec.json')
    );

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

  // Set up a separate esbuild watcher for spec files
  let specWatcher;
  if (watch) {
    // Get all spec files to watch (legacy .json and source .spec.js)
    const jsonSpecFiles = await glob('src/primitives/**/specs/*.json');
    const jsSpecFiles = await glob('src/primitives/**/specs/*.spec.js');

    // Exclude all generated files from watch
    const watchedFiles = [...jsonSpecFiles, ...jsSpecFiles].filter(
      path =>
        !path.endsWith('.component.json')
        && !path.endsWith('.component.js')
        && !path.endsWith('.spec.json'), // Don't watch generated JSON
    );

    // Use esbuild to watch the spec files by treating them as entry points
    // with a plugin that rebuilds our component specs
    if (watchedFiles.length > 0) {
      specWatcher = build({
        watch,
        write: false, // Don't write output, just watch
        logLevel: 'silent', // Suppress esbuild's own logs
        entryPoints: watchedFiles,
        outdir: '.temp-watch', // Required by esbuild when multiple entry points
        plugins: [
          callbackPlugin({
            onComplete: async (result, { isRebuild }) => {
              if (isRebuild) {
                try {
                  await createComponentSpecs();
                  await generateJSExportsFromSpecs();
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

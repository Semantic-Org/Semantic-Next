import { dirname, resolve } from 'path';
import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';
import { SpecReader } from '@semantic-ui/specs';
import { writeFileSync, readFileSync } from 'fs';
import glob from 'tiny-glob';
import { each, asyncEach } from '@semantic-ui/utils';

/*
  Transforms raw component specs into web component specs
  that defineComponent uses for attribute/setting validation
*/
export const writeComponentSpec = async ({
  spec,
  path,
  plural = false,
  specSettings = {}
} = {}) => {
  const readerSettings = {
    plural,
    ...specSettings
  };
  const reader = new SpecReader(spec, readerSettings);
  const componentSpec = reader.getWebComponentSpec();
  const json = JSON.stringify(componentSpec, null, 2);
  let result;
  try {
    result = writeFileSync(path, json);
  } catch (err) {
    console.log(err);
  }
  return result;
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
    watch: watch,
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

  const createComponentSpecs = asyncEach(entryPoints, async (entryPath) => {
    try {
      const contents = readFileSync(entryPath, 'utf8');
      const spec = JSON.parse(contents);
      await writeComponentSpec({
        spec,
        path: entryPath.replace('.json', '-component.json')
      });
      if(spec?.supportsPlural) {
        const pluralName = spec?.pluralTagName.replace('ui-', '');
        const pluralPath = resolve(dirname(entryPath), `${pluralName}-component.json`);
        await writeComponentSpec({
          spec,
          plural: true,
          path: pluralPath
        });
      }
    }
    catch(e) {
      // Silently skip malformed JSON files
    }
  });

  // Convert JSON to JS modules to avoid ESM JSON import compatibility issues
  // when using "import 'foo.json' with { type: "json" };" with bundlers
  const generateJSExportsFromSpecs = async () => {
    await createComponentSpecs;

    const jsonSpecFiles = await glob('src/primitives/*/specs/*.json');

    each(jsonSpecFiles, (jsonFile) => {
      try {
        const jsonContent = readFileSync(jsonFile, 'utf-8');
        const spec = JSON.parse(jsonContent);
        const jsContent = `// Auto-generated from ${jsonFile.split('/').pop()}\nexport default ${JSON.stringify(spec, null, 2)};\n`;
        const jsFile = jsonFile.replace('.json', '.js');
        writeFileSync(jsFile, jsContent);
      }
      catch (error) {
        console.error(`Error processing ${jsonFile}:`, error.message);
      }
    });
  };

  const generateJSExports = generateJSExportsFromSpecs();

  return await Promise.all([
    cssComponentBundle,
    createComponentSpecs,
    generateJSExports
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildUIDeps();
  })();
}

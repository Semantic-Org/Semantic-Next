import { dirname, resolve } from 'path';
import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';
import { SpecReader } from '@semantic-ui/specs';
import { writeFileSync, readFileSync } from 'fs';
import glob from 'tiny-glob';
/*
  Write a component spec file to JSON

  Spec json files are compiled down into
  "component specs" which are used by defineComponent
  to specify the available properties on a component

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

  /*
    component css
    (this includes theme and component css)
  */
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

  /*
    Create component specs which are used to outline
    specs for component attributes and settings
  */

  // we unfortunately have to use external glob
  // because built in glob does not support negation
  // and we dont want our writes to trigger rerun
  const allFiles = await glob('src/primitives/**/specs/*.json');
  const entryPoints = allFiles.filter(path => !path.includes('component.json'));

  // Process spec files directly without esbuild
  const createComponentSpecs = (async () => {
    for (const entryPath of entryPoints) {
      if(entryPath.includes('component.json')) {
        continue;
      }
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
        // invalid json
      }
    }
    return { success: true };
  })();

  // Generate JS exports from component specs (after component specs are created)
  const generateJSExports = createComponentSpecs.then(async () => {

    // Find all component JSON specs
    const componentSpecFiles = await glob('src/primitives/*/specs/*-component.json');

    let count = 0;

    for (const jsonFile of componentSpecFiles) {
      try {
        // Read the JSON spec
        const jsonContent = readFileSync(jsonFile, 'utf-8');
        const spec = JSON.parse(jsonContent);

        // Generate the JS export content
        const jsContent = `// Auto-generated from ${jsonFile.split('/').pop()}\nexport default ${JSON.stringify(spec, null, 2)};\n`;

        // Create the .js file path (same location, different extension)
        const jsFile = jsonFile.replace('.json', '.js');

        // Write the JS file
        writeFileSync(jsFile, jsContent);
        count++;
      }
      catch (error) {
        console.error(`Error processing ${jsonFile}:`, error.message);
      }
    }

    console.log(`Generated ${count} JS spec files`);
  });

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

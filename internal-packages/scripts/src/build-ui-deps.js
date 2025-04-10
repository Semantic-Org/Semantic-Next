import { dirname, resolve } from 'path';
import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';
import { SpecReader } from '@semantic-ui/specs';
import { writeFileSync } from 'fs';
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
    result = await writeFileSync(path, json);
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
      'src/**/css/*.css',
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
  const allFiles = await glob('src/**/specs/*.json');
  const entryPoints = allFiles.filter(path => !path.includes('component.json'));
  const createComponentSpecs = build({
    minify: false,
    addBanner: false,
    metafile: false,
    sourcemap: false,
    watch: watch,
    write: false,
    log: { header: 'UI Components', text: 'Component Spec JSON' },
    entryPoints: entryPoints,
    outdir: '/dev/null',
    // Use onLoad to intercept JSON spec files during load
    async onLoad({path, contents}) {
      if(path.includes('component.json')) {
        return;
      }
      try {
        const spec = JSON.parse(contents);
        await writeComponentSpec({
          spec,
          path: path.replace('.json', '-component.json')
        });
        if(spec?.supportsPlural) {
          const pluralName = spec?.pluralTagName.replace('ui-', '');
          const pluralPath = resolve(dirname(path), `${pluralName}-component.json`);
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
      return;
    },
  });

  return await Promise.all([
    cssComponentBundle,
    createComponentSpecs
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildUIDeps();
  })();
}

import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';
import { SpecReader } from '@semantic-ui/specs';
import { writeFile } from 'fs/promises';

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
  const reader = new SpecReader(spec, {
    plural,
    ...specSettings
  });
  const componentSpec = reader.getWebComponentSpec();
  const json = JSON.stringify(componentSpec, null, 2);
  let result;
  try {
    result = await writeFile(path, json);;
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
  */

  const createComponentSpecs = build({
    type: 'css',
    minify: false,
    addBanner: false,
    metafile: false, // We don't need metafile anymore as we're using onLoad
    sourcemap: false,
    watch: watch,
    write: false,
    log: { header: 'UI Components', text: 'Create Component Specs' },
    entryPoints: [
      'src/**/spec/*.json',
    ],
    outdir: '/dev/null',
    // Use onLoad to intercept JSON spec files during load
    async onLoad({path, contents}) {
      if(path.includes('component.json')) {
        return;
      }
      writeComponentSpec({
        spec: contents,
        path: path.replace('button.json', 'button-component.json')
      });
      if(contents?.supportsPlural) {
        writeComponentSpec({
          spec: contents,
          path: path.replace('button.json', 'button-plural-component.json')
        });
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

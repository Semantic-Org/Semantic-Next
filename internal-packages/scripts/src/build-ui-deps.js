import { build } from './lib/build.js';
import { INTERNAL_CSS_BANNER } from './lib/config.js';
import { SpecReader } from '@semantic-ui/specs';

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

  return await Promise.all([
    cssComponentBundle,
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildUIDeps();
  })();
}

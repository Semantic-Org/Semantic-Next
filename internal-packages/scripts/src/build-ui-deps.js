import { build } from './lib/build.js';

/*
  We need to flatten css imported by the web components
  because they read them as a files (js bundler will not parse @import in css)
*/
export const buildUIDeps = async ({
  watch = false,
} = {}) => {

  /*
    component-scoped shadow-dom css
  */
  const cssShadowConcat = build({
    type: 'css',
    addBanner: false,
    metafile: false,
    sourcemap: false,
    watch: watch,
    bundle: true,
    log: { header: 'UI Deps', message: 'Shadow CSS' },
    entryPoints: [
      'src/**/css/shadow/*.css',
    ],
    entryNames: '[dir]/../[name]-shadow',
    outbase: 'src',
    outdir: 'src',
  });

  return await Promise.all([
    cssShadowConcat,
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildUIDeps();
  })();
}

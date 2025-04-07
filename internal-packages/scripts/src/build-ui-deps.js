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

  /*
    component-scoped theming css
  */
  const cssThemeConcat = build({
    type: 'css',
    watch: watch,
    bundle: true,
    log: { header: 'UI Deps', message: 'Theme CSS' },
    entryPoints: [
      'src/**/css/theme/*.css',
    ],
    entryNames: '[dir]/../[name]-theme',
    outbase: 'src',
    outdir: 'src',
  });

  /*
    page-scoped css
  */
  const cssPageConcat = build({
    type: 'css',
    watch: watch,
    bundle: true,
    log: { header: 'UI Deps', message: 'Page CSS' },
    entryPoints: [
      'src/**/css/page/*.css',
    ],
    entryNames: '[dir]/../[name]-page',
    outbase: 'src',
    outdir: 'src',
  });

  return await Promise.all([
    cssPageConcat,
    cssThemeConcat,
    cssShadowConcat,
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildUIDeps();
  })();
}

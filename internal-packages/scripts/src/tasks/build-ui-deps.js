import * as esbuild from 'esbuild';
import { BROWSER_TARGET } from '../utils/config.js';
import { logPlugin } from '../utils/log.js';

/**
 * Build dependencies (CSS concatenation)
 * Adapted from tasks/lib/build-deps.js
 */
export const buildDeps = async ({
  watch = false,
  baseDir = process.cwd(),
} = {}) => {
  const esbuilder = (watch)
    ? esbuild.context
    : esbuild.build;

  /*
    This is CSS that will be imported into the
    web component to style the shadow dom
  */
  const cssShadowConcat = await esbuilder({
    entryPoints: [
      'src/**/css/shadow/*.css',
    ],
    target: BROWSER_TARGET,
    bundle: true,
    plugins: [logPlugin('CSS Concat (Shadow)')],
    loader: {
      '.css': 'css',
    },
    entryNames: '[dir]/../[name]-shadow',
    outbase: 'src',
    outdir: 'src',
  });

  /*
    This is CSS that will be imported into
    the page to style the page
  */
  const cssPageConcat = await esbuilder({
    entryPoints: [
      'src/**/css/page/*.css',
    ],
    target: BROWSER_TARGET,
    bundle: true,
    plugins: [logPlugin('CSS Concat (Page)')],
    loader: {
      '.css': 'css',
    },
    entryNames: '[dir]/../[name]-page',
    outbase: 'src',
    outdir: 'src',
  });

  if (watch) {
    return await Promise.all([
      cssPageConcat.watch(),
      cssShadowConcat.watch(),
    ]);
  }
  else {
    return await Promise.all([
      cssPageConcat,
      cssShadowConcat,
    ]);
  }
};

export default buildDeps;

// Handle direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildDeps();
  })();
}
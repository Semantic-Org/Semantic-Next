import * as esbuild from 'esbuild';
import { logPlugin } from './log.js';
import {
  BROWSER_TARGET,
} from './config.js';

export const buildDeps = async ({
  watch = false
}) => {

  const esbuilder = (watch)
    ? esbuild.context
    : esbuild.build
  ;

  /*
    This is CSS that will be imported into the
    web component to style the shadow dom
  */
  const cssShadowConcat = await esbuilder({
    entryPoints: [
      'src/**/css/shadow/*.css'
    ],
    target: BROWSER_TARGET,
    bundle: true,
    plugins: [ logPlugin('CSS Concat') ],
    loader: {
      '.css': 'css',
    },
    entryNames: '[dir]/../[name]-shadow',
    outbase: 'src',
    outdir: 'src',
  });

  /*
    This is CSS that will be imported into
    the page to style the light dom
  */
  const cssLightConcat = await esbuilder({
    entryPoints: [
      'src/**/css/light/*.css'
    ],
    target: BROWSER_TARGET,
    bundle: true,
    plugins: [ logPlugin('CSS Concat') ],
    loader: {
      '.css': 'css',
    },
    entryNames: '[dir]/../[name]-light',
    outbase: 'src',
    outdir: 'src',
  });

  if(watch) {
    return await Promise.all([
      cssLightConcat.watch(),
      cssShadowConcat.watch(),
    ]);
  }
  else {
    return await Promise.all([
      cssLightConcat,
      cssShadowConcat,
    ]);
  }

};

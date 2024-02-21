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
    Takes all css parts of a component and creates
    a single css file for JS css imports
  */
  const cssConcat = await esbuilder({
    entryPoints: [
      'src/**/css/*.css'
    ],
    target: BROWSER_TARGET,
    bundle: true,
    plugins: [ logPlugin('CSS Concat') ],
    loader: {
      '.css': 'css',
    },
    entryNames: '[dir]/../[name]',
    outbase: 'src',
    outdir: 'src',
  });

  if(watch) {
    return await Promise.all([
      cssConcat.watch()
    ]);
  }
  else {
    return await Promise.all([
      cssConcat
    ]);
  }

};

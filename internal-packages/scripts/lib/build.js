import { resolve, dirname } from 'path';
import fs from 'fs/promises';
import * as esbuild from 'esbuild';

import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';
import { log as logPlugin } from '@semantic-ui/esbuild-log';

import { getBanner, JS_BUILD_CONFIG, CSS_BUILD_CONFIG, CDN_CONFIG } from './config.js';

// resolve base dir relative to where script is run
// this may be run from "npm run" so this is a common failure point
// especially using tools like wireit or meta task runners
const BASE_DIR = process.env.BASE_DIR || process.cwd();

/*
  Provides base build config but without entrpoints / in & out dirs
*/
export const getESBuildConfig = async function({
  baseDir = BASE_DIR,
  type = 'javascript',

  cdn = false, // whether to rewrite bare module imports for cdn
  cdnConfig = CDN_CONFIG, // config for resolve-bare-imports plugin

  // most commonly changed
  minify = false, // whether to minify output
  bundle = false, // whether to bundle deps
  outdir = '', // custom outdir
  outfile = '', // custom out file,
  sourceMap = true, // whether to include source maps

  // less commonly changed
  browser = true, // target browser
  metafile = true, // whether to include metafile
  readEntrypoints = true, // read entrypoints from package.json
  addBanner = true, // add banner with details from package.json
  addLog = true, // automatically create log
  packageFile, // avoid grabbing package.json again
  log, // custom log message,
  addOutfile = true, // automatically add outfile
  outfileDir = {
    bundle: 'dist/bundle/',
    cdn: 'dist/cdn/',
    standard: 'dist/',
  }
}) {

  let config = {};

  // default base config stored in config constants
  if(type == 'javascript') {
    config = JS_BUILD_CONFIG;
  }
  if(type == 'css') {
    config = CSS_BUILD_CONFIG;
  }

  if(minify) {
    config.minify = true;
  }

  if(metafile) {
    config.metafile = true;
  }

  if(browser) {
    config.platform = 'browser';
  }

  if((readEntrypoints || addBanner || addLog || addOutfile) && !packageFile) {
    packageFile = await getPackageFile();
  }

  /* Configure several settings from package.json */
  if(packageFile) {

    // create banner from package info
    if(addBanner) {
      const banner = getBanner(packageFile);
      if(type == 'css') {
        config.banner = { css: banner };
      }
      else {
        config.banner = { js: banner };
      }
    }

    // naive main entrypoint evaluation
    if(readEntrypoints) {
      const entry = packageFile.module || packageFile.main;
      const entrypointPath = resolve(baseDir, entry);
      config.entryPoints = [entrypointPath];
    }

    if(!log && addLog) {
      let header = 'Build';
      if(bundle) {
        header += ' Bundled';
      }
      if(minify) {
        header += ' Minified';
      }
      log = {
        header: header,
        message: packageFile?.title || packageFile.name
      };
    }

    // automatically select outfile name
    if(!outfile && addOutfile) {

      // add folder path
      if(bundle) {
        outfile += outfileDir.bundle;
      }
      else if(cdn) {
        outfile += outfileDir.cdn;
      }
      else {
        outfile += outfileDir.standard;
      }

      // add package name as filename
      outfile += (packageFile.name || 'index')
        .replace(/^\@.*\//, "") // remove org
        .replace(/\//g, '-') // hyphen spaces
        .replace(/[<>:"/\\|?*]/g, '') // remove chars not permissable in files
        .toLowerCase(); // lowercase

      // add file extension
      if(minify) {
        outfile += '.min';
      }
      if(type == 'javascript') {
        outfile += '.js';
      }
      else if(type == 'css') {
        outfile += '.css';
      }
    }
  }

  // add plugins
  if(log || cdn) {
    config.plugins = [];

    if(log) {
      config.plugins.push( logPlugin(log) );
    }
    if(cdn) {
      config.plugins.push( resolveBareImports(cdnConfig) );
    }
  }
  if(log) {
    config.plugins = [logPlugin(log)];
  }

  if(outdir) {
    config.outdir = outdir;
  }

  if(outfile) {
    config.outfile = outfile;
  }

  return config;
};

/*
  Performs build with ESBuild
*/
export const build = async ({
  watch = false,
  showLogs = true,
  displayFilesize = true,
  ...userConfig
} = {}) => {
  try {
    const buildConfig = await getESBuildConfig(userConfig);
    if(watch) {
      return await esbuild.build(buildConfig).watch();
    }
    else {
      delete buildConfig.plugins;
      // perform build
      const result = await esbuild.build(buildConfig);

      const { outfile } = buildConfig;
      const outdir = dirname(outfile);
      // log filesize of outfile
      if(showLogs) {
        let buildMessage = `\n✅ Build complete`;
        if(displayFilesize && buildConfig.outfile) {
          const stats = await fs.stat(outfile);
          const size = (stats.size / 1024).toFixed(2);
          buildMessage+= `: ${size}KB`;
        }
      }

      // create metafile on esbuild stats
      // this can be used to analyze build at https://esbuild.github.io/analyze/
      if(result.metafile) {
        const metafilePath = resolve(outdir, 'metafile.json');
        await fs.writeFile(metafilePath, JSON.stringify(result.metafile));
      }

      return {
        success: true
      };
    }
  }
  catch(error) {
    if(showLogs) {
      console.error('\n❌ Build failed:', error);
    }
    return {
      success: false,
      error,
    };
  }
};

// alias for code legibility
export const watch = async (...args) => {
  return await build({
    watch: true,
    ...args
  })
};

/* Gets package.json from current working directory */
export const getPackageFile = async function(baseDir = BASE_DIR) {
  const packageJsonPath = resolve(baseDir, 'package.json');
  return JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
}

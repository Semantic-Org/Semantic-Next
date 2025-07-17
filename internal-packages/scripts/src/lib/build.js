import { resolve, dirname } from 'path';
import fs from 'fs/promises';

import * as esbuild from 'esbuild';
import glob from 'tiny-glob';

import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';
import { log as logPlugin } from '@semantic-ui/esbuild-log';
import { callback as callbackPlugin } from '@semantic-ui/esbuild-callback';

import { getBanner, JS_BUILD_CONFIG, CSS_BUILD_CONFIG, CDN_CONFIG } from './config.js';


// resolve base dir relative to where script is run
// this may be run from "npm run" so this is a common failure point
// especially using tools like wireit or meta task runners
const BASE_DIR = process.env.BASE_DIR || process.cwd();

/* Gets package.json from current working directory */
export const getPackageFile = async function(baseDir = BASE_DIR) {
  const packageJsonPath = resolve(baseDir, 'package.json');
  return JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
};

/* Gets filesize of a file */
export const getFileSize = async (src) => {
  const stats = await fs.stat(src);
  const size = (stats.size / 1024).toFixed(2);
  return `${size}KB`;
};


/*
  Provides base build config but without entrpoints / in & out dirs
*/
export const getESBuildConfig = async function({
  baseDir = BASE_DIR,
  type = 'javascript',

  cdn = false, // whether to rewrite bare module imports for cdn
  esm = false, // whether to rewrite as a single file minified esm import
  cdnConfig = CDN_CONFIG, // config for resolve-bare-imports plugin

  // most commonly changed
  minify = false, // whether to minify output
  bundle = false, // whether to bundle deps
  outdir = '', // custom outdir
  outfile = '', // custom out file,
  entryPoints = [], // custom entrypionts
  filterEntries = null, // optional function to filter entry points
  plugins = [], // custom additional plugins
  sourcemap = true, // whether to include source maps
  onLoad = null, // callback function after build
  onComplete = null, // callback function after build

  // less commonly changed
  platform = 'browser', // target browser
  metafile = false, // whether to include metafile
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
  },
  ...additionalConfig // allow any other config value to be passed through
}) {

  let config = {};

  // default base config stored in config constants
  if(type == 'javascript') {
    config = JS_BUILD_CONFIG;
  }
  if(type == 'css') {
    config = CSS_BUILD_CONFIG;
  }

  if(additionalConfig) {
    config = {
      ...config,
      ...additionalConfig
    };
  }

  config = {
    ...config,
    sourcemap,
    bundle,
    minify,
    metafile,
    platform
  };

  if((cdn || readEntrypoints || addBanner || addLog || addOutfile) && !packageFile) {
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
    if(entryPoints.length) {
      // If filterEntries is provided and entryPoints contains glob patterns
      if(filterEntries && entryPoints.some(ep => ep.includes('*'))) {
        const resolvedEntries = [];
        for(const pattern of entryPoints) {
          if(pattern.includes('*')) {
            const globEntries = await getEntryPoints(pattern, filterEntries);
            resolvedEntries.push(...globEntries);
          } else {
            resolvedEntries.push(pattern);
          }
        }
        config.entryPoints = resolvedEntries;
      } else {
        config.entryPoints = entryPoints;
      }
    }
    else if(readEntrypoints) {
      const entry = packageFile.module || packageFile.main;
      const entryPointPath = resolve(baseDir, entry);
      config.entryPoints = [entryPointPath];
    }

    if(!log && addLog) {
      let header = 'Build';
      if(cdn) {
        header += ' CDN';
      }
      else if(bundle) {
        header += ' Bundled';
      }
      if(minify) {
        header += ' (Min)';
      }
      log = {
        header: header,
        text: packageFile?.title || packageFile.name
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
      else if(esm) {
        // For ESM builds, use standard directory but with esm indication
        outfile += outfileDir.standard;
      }
      else {
        outfile += outfileDir.standard;
      }

      // add package name as filename
      outfile += (packageFile.name || 'index')
        .replace(/^\@.*\//, '') // remove org
        .replace(/\//g, '-') // hyphen spaces
        .replace(/[<>:"/\\|?*]/g, '') // remove chars not permissable in files
        .toLowerCase(); // lowercase

      // add file extension
      if(esm) {
        // esm can be inferred skipping for now
        // outfile += '.esm';
      }
      if(minify) {
        outfile += '.min';
        config.outExtension = {
          '.js': '.min.js',
          '.css': '.min.css',
        };
      }
      if(type == 'javascript') {
        outfile += '.js';
      }
      else if(type == 'css') {
        outfile += '.css';
      }
    }
  }

  config.plugins = plugins;

  // add plugins
  if(log || cdn) {
    if(log) {
      config.plugins.push( logPlugin(log) );
    }
    if(cdn) {
      // this will resolve all bare module imports to a cdnized link
      // i.e. import { defineComponent } from 'https://link-to-cdn/@semantic-ui/component/';
      // this is used with import maps or direct browser usage
      config.bundle = true;
      config.plugins.push( resolveBareImports({
        packageJson: packageFile,
        ...cdnConfig
      }) );
    }
    if(onLoad || onComplete) {
      const callbackConfig = {};
      if(onLoad) {
        callbackConfig.onLoad = onLoad;
      }
      if(onComplete) {
        callbackConfig.onComplete = onComplete;
      }
      config.plugins.push( callbackPlugin(callbackConfig) );
    }
  }

  // ESM version is basically a single-file version
  // it DOES NOT bundle dependendencies
  // in many cases this is functionally equivalent to the module src
  // i.e src/[entrypoint]
  // however it might have some use in specialized builds
  if(esm) {
    config.format = 'esm';
    config.bundle = true;

    // this will avoid bundling any dependencies
    if(packageFile && (packageFile.dependencies || packageFile.peerDependencies)) {
      const externalDeps = {
        ...packageFile.dependencies,
        ...packageFile.peerDependencies,
      };
      config.external = Object.keys(externalDeps);
      config.legalComments = 'none'; // we are not bundling external deps
    }
  }

  // can only have outdir or outfile
  if(outdir) {
    config.outdir = outdir;
  }
  else if(outfile) {
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

    // watch has a different build endpoint
    const builder = watch
      ? esbuild.context
      : esbuild.build
    ;

    if(watch) {
      const context = await builder(buildConfig);
      return context.watch();
    }
    else {
      // perform build
      const result = await builder(buildConfig);

      let { outfile, outdir } = buildConfig;
      outdir = outdir || dirname(outfile);

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
      console.error('❌ Build failed:', error);
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
  });
};

/**
 * Asynchronously resolves entry points from a glob pattern.
 *
 * @param {string} globPattern - The glob pattern to resolve.
 * @param {function(string): boolean} [filter] - An optional function to filter the resolved paths.
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths.
 */
async function getEntryPoints(globPattern, filter = () => true) {
  const pattern = globPattern.replace(/\\/g, '/');
  const allEntries = await glob(pattern);
  return allEntries.filter(filter);
}

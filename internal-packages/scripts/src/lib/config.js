// package is package.json
export const getBanner = (packageFile) => `/**
 * ${packageFile.name} v${packageFile.version}
 * ${packageFile.description || ''}
 *
 * @license ${packageFile.license || 'MIT'}
 * @copyright (c) ${new Date().getFullYear()} ${packageFile.author || ''}
 * @homepage ${packageFile.homepage || ''}
 *
 * This source code is licensed under the ${packageFile.license || 'MIT'} license found in the
 * LICENSE file in the root directory of this source tree.
 */`;

export const JS_BUILD_CONFIG = {

  // target browser by default for dist
  target: ['chrome80', 'edge80', 'firefox78', 'safari14', 'ios14', 'opera67'],
  platform: 'browser',

  // source is in ESM
  format: 'esm',

  // build tools should log
  logLevel: 'info',

  // needed to load css and inline for web components
  loader: {
    '.ts': 'ts',
    '.html': 'text',
    '.css': 'text',
    '.png': 'file',
    '.svg': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
  },
};

export const CSS_BUILD_CONFIG = {

  // target browser by default for dist
  target: ['chrome80', 'edge80', 'firefox78', 'safari14', 'ios14', 'opera67'],

  // source is in ESM
  format: 'esm',

  // build tools should log
  platform: 'browser',

  // build tools should log
  logLevel: 'info',

  // needed to load css and inline for web components
  loader: {
    '.ts': 'ts',
    '.html': 'text',
    '.css': 'text',
    '.png': 'file',
    '.svg': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
  },
};

/* Used when generating CDNized copy (note these are identical to defaults) */
export const CDN_CONFIG = {
  cdnRoot: 'https://cdn.jsdelivr.net/npm',
  directReplacements: {},
  cacheDir: '.cache',
  logging: 'normal',
}

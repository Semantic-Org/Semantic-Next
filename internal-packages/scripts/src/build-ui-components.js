import { buildESM } from './build-esm.js';
import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';

/*
  Web component javascript reads css imports as a file
  and will not process import links. So we need to
  bundle nested css files for the web component to consume
*/
export const buildUIComponents = async ({
  watch = false,
} = {}) => {

  /* Export each component individually */
  const sharedConfig = {
    watch,
    type: 'javascript',
    entryPoints: ['./src/components/**/index.js'],
    entryNames: 'ui/[dir]', // button/button.js
    outbase: 'src',
  };

  /*
    Exports Individual Components
  */
  let esmBuild = buildESM({
    ...sharedConfig,
    log: { header: 'UI Components', message: 'Build ESM' },
  });

  let bundleBuild = buildESM({
    ...sharedConfig,
    esm: true,
    minify: false,
    log: { header: 'UI Components', message: 'Build Bundle' },
  });

  let cdnBuild = buildESM({
    ...sharedConfig,
    esm: true,
    minify: false,
    log: { header: 'UI Components', message: 'Build CDN' },
  });

  /*
    component-scoped theming css
  */

  return await Promise.all([
    esmBuild,
    bundleBuild,
    cdnBuild,
  ]);

};


// Wrapped for NPM wireit consumption
(async function() {

  const result = await buildUIComponents();

  process.exit(1);
})();

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
    entryNames: '[dir]', // button.js,
    outbase: 'src/components',
  };

  /*
    Exports Individual Components
  */
  let esmBuild = buildESM({
    ...sharedConfig,
    outdir: 'dist',
    log: { header: 'UI Components', text: 'Build ESM' },
  });

  let bundleBuild = buildBundle({
    ...sharedConfig,
    outdir: 'dist/bundle',
    log: { header: 'UI Components', text: 'Build Bundle' },
  });

  let cdnBuild = buildCDN({
    ...sharedConfig,
    outdir: 'dist/cdn',
    log: { header: 'UI Components', text: 'Build CDN' },
  });

  await Promise.all([
    esmBuild,
    bundleBuild,
    cdnBuild,
  ]);

};


// Wrapped for NPM wireit consumption
(async function() {

  const result = await buildUIComponents();

})();

import { buildESM } from './build-esm.js';
import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';

/*
  This exports each individual component from framework
  as a separate file for consuming as standalone components
*/
export const buildUIComponents = async ({
  watch = false,
} = {}) => {

  const tasks = [];

  const sharedConfig = {
    watch,
    type: 'javascript',
    entryPoints: ['./src/components/**/index.js'],
    entryNames: '[dir]', // button.js,
    outbase: 'src/components',
  };

  tasks.push(
    buildESM({
      ...sharedConfig,
      outdir: 'dist',
      log: { header: 'UI Components', text: 'Build ESM' },
    })
  );

  tasks.push(
    buildBundle({
      ...sharedConfig,
      outdir: 'dist/bundle',
      log: { header: 'UI Components', text: 'Build Bundle' },
    })
  );

  tasks.push(
    buildCDN({
      ...sharedConfig,
      outdir: 'dist/cdn',
      log: { header: 'UI Components', text: 'Build CDN' },
    })
  );

  await Promise.all(tasks);

};


// Wrapped for NPM wireit consumption
(async function() {

  const result = await buildUIComponents();
  process.exit();

})();

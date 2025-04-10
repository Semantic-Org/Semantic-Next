import { buildESM } from './build-esm.js';
import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';


/*
  This exports all components together as a framework
  for use as a single include
*/
export const buildUIFramework = async ({
  watch = false,
} = {}) => {

  const tasks = [];


  /*
    Exports JS Bundle
  */
  const jsConfig = {
    watch,
    entryPoints: ['src/index.js'],
    entryNames: 'semantic-ui',
    type: 'javascript',
  };

  tasks.push(
    buildESM({
      ...jsConfig,
      outdir: 'dist',
      log: { header: 'Framework JS', text: 'Build ESM' },
    })
  );

  tasks.push(
    buildBundle({
      ...jsConfig,
      outdir: 'dist/bundle',
      log: { header: 'Framework JS', text: 'Build Bundle' },
    })
  );

  tasks.push(
    buildCDN({
      ...jsConfig,
      outdir: 'dist/cdn',
      log: { header: 'Framework JS', text: 'Build CDN' },
    })
  );

  /*
    Exports CSS Bundle
    (note these are identical but included in each location for uniformity)
  */

  // entry points are auto discovered from package.json
  const cssConfig = {
    watch,
    type: 'css',
    entryPoints: ['src/index.css'],
    entryNames: 'semantic-ui',
  };

  tasks.push(
    buildESM({
      ...cssConfig,
      outdir: 'dist',
      log: { header: 'Framework CSS', text: 'Build ESM' },
    })
  );

  tasks.push(
    buildBundle({
      ...cssConfig,
      outdir: 'dist/bundle',
      log: { header: 'Framework CSS', text: 'Build Bundle' },
    })
  );

  tasks.push(
    buildCDN({
      ...cssConfig,
      outdir: 'dist/cdn',
      log: { header: 'Framework CSS', text: 'Build CDN' },
    })
  );

  await Promise.all(tasks);

};

// Wrapped for NPM wireit consumption
(async function() {

  const result = await buildUIFramework();

})();

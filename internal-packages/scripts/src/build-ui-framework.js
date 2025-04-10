import { buildESM } from './build-esm.js';
import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';


/*
  This exports all components together as a framework
  for use as a single include
*/
export const buildUIFramework = async ({
  watch = false,
  includeESM = true,
  includeCDN = true,
  includeBundle = true,
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

  if(includeESM) {
    tasks.push(
      buildESM({
        ...jsConfig,
        outdir: 'dist',
        log: { header: 'Framework JS', text: 'Build ESM' },
      })
    );
  }

  if(includeBundle) {
    tasks.push(
      buildBundle({
        ...jsConfig,
        outdir: 'dist/bundle',
        log: { header: 'Framework JS', text: 'Build Bundle' },
      })
    );
  }

  if(includeCDN) {
    tasks.push(
      buildCDN({
        ...jsConfig,
        outdir: 'dist/cdn',
        log: { header: 'Framework JS', text: 'Build CDN' },
      })
    );
  }

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

  if(includeESM) {
    tasks.push(
      buildESM({
        ...cssConfig,
        outdir: 'dist',
        log: { header: 'Framework CSS', text: 'Build ESM' },
      })
    );
  }

  if(includeBundle) {
    tasks.push(
      buildBundle({
        ...cssConfig,
        outdir: 'dist/bundle',
        log: { header: 'Framework CSS', text: 'Build Bundle' },
      })
    );
  }

  if(includeCDN) {
    tasks.push(
      buildCDN({
        ...cssConfig,
        outdir: 'dist/cdn',
        log: { header: 'Framework CSS', text: 'Build CDN' },
      })
    );
  }

  await Promise.all(tasks);

};

// Wrapped for NPM wireit consumption
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    const result = await buildUIFramework();
  })();
}

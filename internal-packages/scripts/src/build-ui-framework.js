import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';
import { buildESM } from './build-esm.js';

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

  if (includeESM) {
    tasks.push(
      buildESM({
        ...jsConfig,
        outdir: 'dist',
        log: { header: 'Framework JS', text: 'Build ESM' },
      }),
    );
  }

  if (includeBundle) {
    tasks.push(
      buildBundle({
        ...jsConfig,
        outdir: 'dist/bundle',
        log: { header: 'Framework JS', text: 'Build Bundle' },
      }),
    );
  }

  if (includeCDN) {
    tasks.push(
      buildCDN({
        ...jsConfig,
        outdir: 'dist/cdn',
        log: { header: 'Framework JS', text: 'Build CDN' },
      }),
    );
  }

  /*
    Exports CSS Bundle
    CSS has no bare module imports so CDN format is identical to the others.
    Only ESM (dist/) and Bundle (dist/bundle/) are built — the CDN Worker
    serves CSS from dist/ directly.
  */

  // entry points are auto discovered from package.json
  const cssConfig = {
    watch,
    type: 'css',
    entryPoints: ['src/css/all.css'],
    entryNames: 'semantic-ui',
  };

  // CSS sub-layers for /css/tokens, /css/reset, /css/base endpoints
  const cssLayerConfigs = [
    { entryPoints: ['src/css/tokens.css'], entryNames: 'tokens' },
    { entryPoints: ['src/css/global/reset.css'], entryNames: 'reset' },
    { entryPoints: ['src/css/global/base.css'], entryNames: 'base' },
  ];

  if (includeESM) {
    tasks.push(
      buildESM({
        ...cssConfig,
        outdir: 'dist',
        log: { header: 'Framework CSS', text: 'Build ESM' },
      }),
      ...cssLayerConfigs.map(layer =>
        buildESM({
          watch,
          type: 'css',
          ...layer,
          outdir: 'dist',
          log: { header: 'CSS Layer', text: `Build ${layer.entryNames}` },
        })
      ),
    );
  }

  if (includeBundle) {
    tasks.push(
      buildBundle({
        ...cssConfig,
        outdir: 'dist/bundle',
        log: { header: 'Framework CSS', text: 'Build Bundle' },
      }),
      ...cssLayerConfigs.map(layer =>
        buildBundle({
          watch,
          type: 'css',
          ...layer,
          outdir: 'dist/bundle',
          log: { header: 'CSS Layer', text: `Build ${layer.entryNames}` },
        })
      ),
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

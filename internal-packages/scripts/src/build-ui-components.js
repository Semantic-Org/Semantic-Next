import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';
import { buildESM } from './build-esm.js';

/*
  This exports each individual component from framework
  as a separate file for consuming as standalone components
*/
export const buildUIComponents = async ({
  watch = false,
  includeESM = true,
  includeCDN = true,
  includeBundle = true,
} = {}) => {
  const tasks = [];

  // Build primitives (former components)
  const primitivesConfig = {
    watch,
    type: 'javascript',
    entryPoints: ['./src/primitives/**/index.js'],
    entryNames: '[dir]', // button.js,
    outbase: 'src/primitives',
    filterEntries: (path) => {
      return !path.endsWith('src/primitives/index.js');
    }
  };

  // Build new components  
  const componentsConfig = {
    watch,
    type: 'javascript',
    entryPoints: ['./src/components/**/index.js'],
    entryNames: '[dir]', // mobile-menu.js,
    outbase: 'src/components',
    filterEntries: (path) => {
      return !path.endsWith('src/components/index.js');
    }
  };

  // Build behaviors if they exist
  const behaviorsConfig = {
    watch,
    type: 'javascript',
    entryPoints: ['./src/behaviors/**/index.js'],
    entryNames: '[dir]', // behavior-name.js,
    outbase: 'src/behaviors',
    filterEntries: (path) => {
      return !path.endsWith('src/behaviors/index.js');
    }
  };

  if (includeESM) {
    tasks.push(
      buildESM({
        ...primitivesConfig,
        outdir: 'dist',
        log: { header: 'UI Primitives', text: 'Build ESM' },
      }),
      buildESM({
        ...componentsConfig,
        outdir: 'dist',
        log: { header: 'UI Components', text: 'Build ESM' },
      }),
      buildESM({
        ...behaviorsConfig,
        outdir: 'dist',
        log: { header: 'UI Behaviors', text: 'Build ESM' },
      }),
    );
  }

  if (includeBundle) {
    tasks.push(
      buildBundle({
        ...primitivesConfig,
        outdir: 'dist/bundle',
        log: { header: 'UI Primitives', text: 'Build Bundle' },
      }),
      buildBundle({
        ...componentsConfig,
        outdir: 'dist/bundle',
        log: { header: 'UI Components', text: 'Build Bundle' },
      }),
      buildBundle({
        ...behaviorsConfig,
        outdir: 'dist/bundle',
        log: { header: 'UI Behaviors', text: 'Build Bundle' },
      }),
    );
  }

  if (includeCDN) {
    tasks.push(
      buildCDN({
        ...primitivesConfig,
        outdir: 'dist/cdn',
        log: { header: 'UI Primitives', text: 'Build CDN' },
      }),
      buildCDN({
        ...componentsConfig,
        outdir: 'dist/cdn',
        log: { header: 'UI Components', text: 'Build CDN' },
      }),
      buildCDN({
        ...behaviorsConfig,
        outdir: 'dist/cdn',
        log: { header: 'UI Behaviors', text: 'Build CDN' },
      }),
    );
  }

  await Promise.all(tasks);
};

// Wrapped for NPM wireit consumption
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    const result = await buildUIComponents();
    process.exit();
  })();
}

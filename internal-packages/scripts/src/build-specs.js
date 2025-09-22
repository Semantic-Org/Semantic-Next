import { buildESM } from './build-esm.js';

/*
  This exports specs files to dist/ folder for consuming via package exports
  Builds both specs.js and component-specs.js to avoid downstream issues with raw text imports
  Only builds ESM version since specs are just JSON data exports
*/
export const buildSpecs = async ({
  watch = false,
} = {}) => {
  const config = {
    watch,
    type: 'javascript',
    entryPoints: ['./src/specs/specs.js', './src/specs/component-specs.js'],
    entryNames: '[name]', // preserves original filename
    outbase: 'src/specs',
    outdir: 'dist',
    log: { header: 'Specs', text: 'Build ESM' },
  };

  await buildESM(config);
};

// Wrapped for NPM wireit consumption
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    const result = await buildSpecs();
    process.exit();
  })();
}

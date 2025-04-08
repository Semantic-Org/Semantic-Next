import { build } from './lib/build.js';
import { buildUIDeps } from './build-ui-deps.js';

/*
  This watch script will watch for changes in internal deps
  and rebuild them while coding. This is used so that files consumed
  in the docs have the latest css
*/
export const watch = async ({
  watch = false,
} = {}) => {


  // watch for changes
  const buildDeps = buildUIDeps({
    watch: true
  });

  return await Promise.all([
    buildDeps,
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await watch();
  })();
}

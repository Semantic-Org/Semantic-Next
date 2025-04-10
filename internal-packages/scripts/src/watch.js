import { build } from './lib/build.js';

import { buildUIDeps } from './build-ui-deps.js';
import { buildESM } from './build-esm.js';
import { buildBundle } from './build-bundle.js';
import { buildCDN } from './build-cdn.js';
import { buildUIComponents } from './build-ui-components.js';

/*
  This watch script will watch for changes in internal deps
  and rebuild them while coding. This is used so that files consumed
  in the docs have the latest css
*/
export const watch = async ({
  watch = false,
} = {}) => {


  const watch1 = buildUIDeps({
    watch: true
  });

  const watch2 = buildESM({
    watch: true
  });

  const watch3 = buildBundle({
    watch: true
  });

  const watch4 = buildCDN({
    watch: true
  });

  const watch5 = buildUIComponents({
    watch: true
  });

  return await Promise.all([
    watch1,
    watch2,
    watch3,
    watch4,
    watch5,
  ]);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await watch();
  })();
}

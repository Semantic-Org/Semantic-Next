import { build } from './lib/build.js';

import { buildUIDeps } from './build-ui-deps.js';
import { buildUIComponents } from './build-ui-components.js';
import { buildUIFramework } from './build-ui-framework.js';

/*
  This watch script will watch for changes in internal deps
  and rebuild them while coding. This is used so that files consumed
  in the docs have the latest css
*/
export const watch = async ({
  watchDeps = true, // this is included so you can modify source code while developing
  watchFramework = true, // this is included because the playground uses this build in dev
  watchComponents = false, // this is not necessary unless consuming individual components
} = {}) => {

  const watches = [];

  if(watchDeps) {
    watches.push(
      buildUIDeps({
        watch: true
      })
    );
  }

  if(watchComponents) {
    watches.push(
      buildUIComponents({
        watch: true,
        includeESM: true,
        includeBundle: false,
        includeCDN: false,
      })
    );
  }

  if(watchFramework) {
    watches.push(
      buildUIFramework({
        watch: true,
        includeESM: true,
        includeBundle: false,
        includeCDN: false,
      })
    );
  }

  return await Promise.all(watches);

};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    return watch();
  })();
}

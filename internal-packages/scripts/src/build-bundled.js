import { build } from './lib/build.js';


// This is called from npm script to build a package
(async function() {

  const result = await build({
    bundle: true
  });

  const minResult = await build({
    bundle: true,
    minify: true,
  });

  if (!result?.success) {
    process.exit(1);
  }

})();

import { buildCDN } from './tasks/build-cdn.js';

const baseDir = process.env.BASE_DIR;

// This is called from npm script to build a package with bare import rewrites
(async function() {
  const result = await buildCDN({
    baseDir
  });
  if (!result.success) {
    process.exit(1);
  }
})();

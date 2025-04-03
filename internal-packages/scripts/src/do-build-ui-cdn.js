import { buildUICDN } from './tasks/build-ui-cdn.js';

await buildUICDN({
  // Default options for CLI
  minify: true,
  sourcemap: true,
  createComponentBundles: true,
});
import { buildUIFramework } from './tasks/build-ui-framework.js';

await buildUIFramework({
  // Default options for CLI
  includeJavascript: true,
  includeComponents: true,
  includeCSS: true,
  includeThemes: true,
  includeExamples: false,
  minify: true,
  bundle: true,
  sourcemap: true,
  createFlatImports: true,
});

import { buildDeps } from './lib/build-deps.js';
import { buildProject } from './lib/build-project.js';

await buildDeps({
  watch: true,
});

await buildProject({
  watch: true,
  includeComponents: false,
  includeJavascript: false,
  outDir: 'docs/src/css/sui',
});

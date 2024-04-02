import { buildDeps } from './lib/build-deps.js';
import { buildProject } from './lib/build-project.js';

await buildDeps({
  watch: false
});

await buildProject({
  watch: false,
  includeExamples: false,
  uiDir: 'dist',
  outDir: 'dist'
});

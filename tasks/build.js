import { buildDeps } from './lib/build-deps.js';
import { buildProject } from './lib/build-project.js';

await buildDeps({
  watch: false
});

await buildProject({
  watch: false,
  includeComponents: true,
  includeJavascript: true,
  includeCSS: true,
  includeThemes: true,
  includeExamples: true,
  uiDir: 'dist',
  outDir: 'dist'
});

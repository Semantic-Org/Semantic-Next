import { buildDeps } from './lib/build-deps.js';
import { buildProject } from './lib/build-project.js';
import { buildPlayground } from './lib/build-playground.js';

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

// copies packages for use in docs REPL playground environment in docs
await buildPlayground({
  watch: false
});

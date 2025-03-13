import { buildDeps } from './lib/build-deps.js';
import { buildPlayground } from './lib/build-playground.js';
import { buildProject } from './lib/build-project.js';

await buildDeps({
  watch: true,
});

await buildProject({
  watch: true,
  includeComponents: false,
  includeJavascript: false,
  includeCSS: true,
  includeThemes: true,
  includeExamples: false,
  uiDir: 'dist',
  outDir: 'dist',
});

// copies packages for use in docs REPL environment
await buildPlayground({
  watch: true,
});

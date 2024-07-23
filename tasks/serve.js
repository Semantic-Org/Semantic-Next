import { buildDeps } from './lib/build-deps.js';
import { buildProject } from './lib/build-project.js';

// build once
await buildDeps({
  watch: false
});

await buildProject({
  watch: false,
  minify: false,
  includeComponents: true,
  includeJavascript: true,
  includeCSS: true,
  includeThemes: true,
  includeExamples: true,
  outDir: 'dev/',
});

await buildDeps({
  watch: true,
});

// serve
await buildProject({
  watch: true,
  minify: false,
  serveDir: 'dev',
  includeComponents: true,
  includeJavascript: true,
  includeCSS: true,
  includeThemes: true,
  includeExamples: true,
  outDir: 'dev/',
});

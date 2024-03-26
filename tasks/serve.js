import { buildDeps } from './lib/build-deps.js';
import { buildProject } from './lib/build-project.js';

// build once
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
  outDir: 'dev/ui',
});

// serve
await buildDeps({
  watch: true,
});

await buildProject({
  watch: true,
  serveDir: 'dev',
  includeComponents: true,
  includeJavascript: true,
  includeCSS: true,
  includeThemes: true,
  includeExamples: true,
  outDir: 'dev/ui',
});

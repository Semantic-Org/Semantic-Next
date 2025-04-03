import { buildDeps } from './tasks/build-ui-deps.js';

await buildDeps({
  watch: false,
});

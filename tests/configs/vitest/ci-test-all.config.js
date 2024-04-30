import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['basic', 'junit'],
    outputFile: './tests/results/test-results-all-junit.xml',
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js',
  },
});

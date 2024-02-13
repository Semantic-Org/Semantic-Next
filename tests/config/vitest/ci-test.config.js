import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['junit'],
    outputFile: './tests/results/test-results-junit.xml'
  },
  workspace: './vitest.workspace.js'
});

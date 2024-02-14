import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
    },
    outdir: 'tests/',
    reporter: ['default'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: [
        'packages/**/src/**/*.js'
      ],
      reportsDirectory: './tests/coverage',
      reportOnFailure: true
    },
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});

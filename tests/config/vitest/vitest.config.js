import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: true,
  },
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
    }
  },
  workspace: './vitest.workspace.js'
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: true,
  },
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium'
    },
    outdir: 'tests/',
    reporter: ['html'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reports: ['html'],
      include: [
        'packages/**/src/**/*.js'
      ],
      reportsDirectory: './tests/coverage',
      reportOnFailure: true
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});

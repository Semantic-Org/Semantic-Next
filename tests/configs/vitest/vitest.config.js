import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium'
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
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});

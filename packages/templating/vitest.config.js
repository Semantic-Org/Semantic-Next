import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    reporter: ['default'],
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      screenshotFailures: false,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    workspace: './vitest.workspace.js'
  },
});

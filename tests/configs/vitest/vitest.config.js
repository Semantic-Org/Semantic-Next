import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
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
    workspace: './tests/configs/vitest/workspaces/vitest.all.workspace.js'
  },
});

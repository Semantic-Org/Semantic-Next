import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/browser/**/*.test.js'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
    pool: 'threads',
    testTimeout: 30_000,
    onConsoleLog(log) {
      if (log.includes('Lit is in dev mode.')) { return false; }
    },
  },
});

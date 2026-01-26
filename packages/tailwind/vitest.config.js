import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    reporters: ['default'],
    coverage: {
      enabled: false,
      provider: 'istanbul',
      reporter: ['text'],
      include: ['src/**/*.js'],
    },
    onConsoleLog(log) {
      if (log.includes('Lit is in dev mode.')) { return false; }
    },
    projects: [
      {
        test: {
          include: [
            '**/test/unit/**/*.test.{ts,js}',
            '**/test/*.test.{ts,js}',
          ],
          name: 'node',
          environment: 'node',
        },
      },
      {
        test: {
          include: ['**/test/dom/**/*.test.{ts,js}'],
          name: 'jsdom',
          environment: 'jsdom',
        },
      },
      {
        test: {
          include: ['**/test/browser/**/*.test.{ts,js}'],
          name: 'browser',
          testTimeout: 30000,
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            screenshotFailures: false,
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});

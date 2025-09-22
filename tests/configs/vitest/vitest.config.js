import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    onConsoleLog (log) {
      if (log.includes('Lit is in dev mode.')) return false;
    },
    projects: [
      {
        test: {
          include: [
            '**/test/unit/**/*.test.{ts,js}',
            '**/test/*.test.{ts,js}'
          ],
          name: 'node',
          environment: 'node',
          setupFiles: ['tests/setup/node-setup.js'],
        }
      },
      {
        test: {
          include: ['**/test/dom/**/*.test.{ts,js}'],
          name: 'jsdom',
          environment: 'jsdom',
          setupFiles: ['tests/setup/dom-setup.js'],
        }
      },
      {
        test: {
          include: ['**/test/browser/**/*.test.{ts,js}'],
          name: 'browser',
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
          setupFiles: ['tests/setup/browser-setup.js'],
        }
      },
    ]
  },
});

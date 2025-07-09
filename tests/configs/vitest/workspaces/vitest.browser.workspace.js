import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
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
    }
  },
]);

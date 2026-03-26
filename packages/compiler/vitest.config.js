import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    pool: 'threads',
    reporters: ['default'],
    coverage: {
      enabled: false,
      provider: 'istanbul',
      reporter: ['text'],
      include: ['src/**/*.js'],
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

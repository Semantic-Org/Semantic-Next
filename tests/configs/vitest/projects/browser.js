import { playwright } from '@vitest/browser-playwright';
import { configDefaults } from 'vitest/config';

export default {
  test: {
    include: ['**/test/browser/**/*.test.{ts,js}'],
    exclude: [...configDefaults.exclude, 'tools/cdn/**'],
    name: 'browser',
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
    setupFiles: ['tests/setup/browser-setup.js'],
  }
};

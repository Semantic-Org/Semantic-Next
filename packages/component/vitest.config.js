import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      include: [
        'test/unit/**/*.test.{ts,js}',
        'test/*.test.{ts,js}'
      ],
      name: 'node',
      environment: 'node',
      setupFiles: ['../../test/setup/node-setup.js'],
    }
  },
  {
    test: {
      include: ['test/dom/**/*.test.{ts,js}'],
      name: 'jsdom',
      environment: 'jsdom',
      setupFiles: ['../../test/setup/dom-setup.js'],
    }
  },
  {
    test: {
      include: ['test/browser/**/*.test.{ts,js}'],
      name: 'browser',
      testTimeout: 30000,
      browser: {
        enabled: true,
        provider: 'playwright',
        headless: true,
        instances: [{
          browser: 'chromium',
        }],
      },
      setupFiles: ['../../test/setup/browser-setup.js'],
      onConsoleLog (log) {
        if (log.includes('Lit is in dev mode.')) return false;
      }
    }
  },
]);

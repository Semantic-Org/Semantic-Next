import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
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
        provider: 'playwright',
        name: 'chromium'
      },
      setupFiles: ['tests/setup/browser-setup.js'],
    }
  },
]);

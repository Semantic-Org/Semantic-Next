import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*',
  {
    test: {
      include: ['tests/browser/**/*.{browser}.test.{ts,js}'],
      name: 'browser',
      browser: {
        enabled: true,
        headless: true,
        name: 'chrome'
      },
    }
  },
  {
    test: {
      include: ['tests/dom/**/*.{browser}.test.{ts,js}'],
      name: 'happy-dom',
      environment: 'happy-dom',
    }
  },
  {
    test: {
      include: ['tests/unit/**/*.{node}.test.{ts,js}'],
      name: 'node',
      environment: 'node',
    }
  }
]);

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
    }
  },
  {
    test: {
      include: ['**/test/dom/**/*.test.{ts,js}'],
      name: 'jsdom',
      environment: 'jsdom',
    }
  },
]);

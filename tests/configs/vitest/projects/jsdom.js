import { exclude } from './exclude.js';

export default {
  test: {
    include: ['**/test/dom/**/*.test.{ts,js}'],
    exclude,
    name: 'jsdom',
    environment: 'jsdom',
    setupFiles: ['tests/setup/dom-setup.js'],
  }
};

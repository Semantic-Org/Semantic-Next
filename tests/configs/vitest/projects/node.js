import { exclude } from './exclude.js';

export default {
  test: {
    include: [
      '**/test/unit/**/*.test.{ts,js}',
      '**/test/*.test.{ts,js}'
    ],
    exclude,
    name: 'node',
    environment: 'node',
    setupFiles: ['tests/setup/node-setup.js'],
  }
};

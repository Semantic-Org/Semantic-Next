export default {
  test: {
    include: [
      '**/test/unit/**/*.test.{ts,js}',
      '**/test/*.test.{ts,js}'
    ],
    exclude: ['**/node_modules/**', 'docs/**'],
    name: 'node',
    environment: 'node',
    setupFiles: ['tests/setup/node-setup.js'],
  }
};

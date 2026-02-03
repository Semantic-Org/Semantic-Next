export default {
  test: {
    include: [
      '**/test/unit/**/*.test.{ts,js}',
      '**/test/*.test.{ts,js}'
    ],
    name: 'node',
    environment: 'node',
    setupFiles: ['tests/setup/node-setup.js'],
  }
};

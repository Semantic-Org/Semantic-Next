export default {
  test: {
    include: ['**/test/dom/**/*.test.{ts,js}'],
    exclude: ['**/node_modules/**', 'docs/**'],
    name: 'jsdom',
    environment: 'jsdom',
    setupFiles: ['tests/setup/dom-setup.js'],
  }
};

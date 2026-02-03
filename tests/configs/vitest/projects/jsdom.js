export default {
  test: {
    include: ['**/test/dom/**/*.test.{ts,js}'],
    name: 'jsdom',
    environment: 'jsdom',
    setupFiles: ['tests/setup/dom-setup.js'],
  }
};

import { $ } from '@semantic-ui/query';

// Adds a new method called maskInput() to all query instances
$.plugin.maskInput = function({ type = 'alphanumeric' } = {}) {
  this.on('keydown', (event) => {
    const presets = {
      alpha: /[a-zA-Z]/,
      numeric: /[0-9]/,
      alphanumeric: /[a-zA-Z0-9]/,
    };
    // allow all special keys
    if (event.key.length > 1) {
      return;
    }
    const regex = type instanceof RegExp
      ? type
      : presets[type];

    if (event.key.search(regex) === -1) {
      event.preventDefault();
    }
  });
};

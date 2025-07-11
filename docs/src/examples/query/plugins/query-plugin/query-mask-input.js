import { $ } from '@semantic-ui/query';

$.fn.maskInput = function({ type = 'alphanumeric' } = {}) {
  this.on('keydown', (event) => {
    const presets = {
      alpha: /[a-z]/,
      numeric: /[0-9]/,
      alphanumeric: /[a-z0-9]/,
    };

    const regex = type instanceof RegExp
      ? type
      : presets[type];

    if (event.key.search(regex) === -1) {
      event.preventDefault();
    }
  });
};

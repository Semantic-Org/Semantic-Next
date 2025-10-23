import { $ } from '@semantic-ui/query';

const $output = $('.output pre');
const $input = $('.input');
const $button = $('.button');

// Display current attributes
const showAttributes = () => {
  const inputAttrs = Array.from($input[0].attributes)
    .map(attr => `${attr.name}="${attr.value}"`)
    .join('\n  ');

  const buttonAttrs = Array.from($button[0].attributes)
    .map(attr => `${attr.name}="${attr.value}"`)
    .join('\n  ');

  $output.text(`<ui-input\n  ${inputAttrs}>\n\n<ui-button\n  ${buttonAttrs}>`);
};

// Add single attribute
$('.single').on('click', () => {
  // Add disabled attribute (empty string value)
  $input.addAttr('disabled');
  $button.addAttr('disabled');

  showAttributes();
});

// Add multiple attributes
$('.multiple').on('click', () => {
  // Add array of boolean attributes
  $input.addAttr(['disabled', 'readonly', 'required']);
  $button.addAttr(['disabled', 'aria-pressed']);

  showAttributes();
});

// Reset attributes
$('.reset').on('click', () => {
  $input.removeAttr('disabled').removeAttr('readonly').removeAttr('required');
  $button.removeAttr('disabled').removeAttr('aria-pressed');

  showAttributes();
});

// Show initial state
showAttributes();

import { $ } from '@semantic-ui/query';

const $output = $('.output pre');
const $input = $('.input');
const $textarea = $('.textarea');

// Display current attributes
const showAttributes = () => {
  const inputAttrs = Array.from($input[0].attributes)
    .map(attr => `${attr.name}="${attr.value}"`)
    .join('\n  ');

  const textareaAttrs = Array.from($textarea[0].attributes)
    .map(attr => `${attr.name}="${attr.value}"`)
    .join('\n  ');

  $output.text(`<input\n  ${inputAttrs}>\n\n<textarea\n  ${textareaAttrs}>`);
};

// Add single attribute
$('.single').on('click', () => {
  // Add disabled attribute (empty string value)
  $input.addAttr('disabled');
  $textarea.addAttr('disabled');

  showAttributes();
});

// Add multiple attributes
$('.multiple').on('click', () => {
  // Add array of boolean attributes
  $input.addAttr(['disabled', 'readonly', 'required']);
  $textarea.addAttr(['disabled', 'readonly', 'required']);

  showAttributes();
});

// Reset attributes
$('.reset').on('click', () => {
  $input.removeAttr('disabled').removeAttr('readonly').removeAttr('required');
  $textarea.removeAttr('disabled').removeAttr('readonly').removeAttr('required');

  showAttributes();
});

// Show initial state
showAttributes();

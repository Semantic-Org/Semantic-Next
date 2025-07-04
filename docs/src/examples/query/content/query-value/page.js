import { $ } from '@semantic-ui/query';

const updateOutput = () => {
  const textValue = $('.input').value() || '';
  const selectValue = $('.select').value() || '';
  const textareaValue = $('.textarea').value() || '';

  $('.output').text(`Text: "${textValue}" | Select: "${selectValue}" | Textarea: "${textareaValue}"`);
};

// Listen for input changes
$('.input').on('input', updateOutput);
$('.select').on('change', updateOutput);
$('.textarea').on('input', updateOutput);

// Set values
$('.set').on('click', () => {
  $('.input').value('Sample text');
  $('.select').value('option2');
  $('.textarea').value('Sample textarea content');
  updateOutput();
});

// Clear values
$('.clear').on('click', () => {
  $('.input').value('');
  $('.select').value('');
  $('.textarea').value('');
  updateOutput();
});

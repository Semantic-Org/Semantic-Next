import { $ } from '@semantic-ui/query';

// Get current text
$('.get').on('click', () => {
  const text = $('.target').text();
  $('.output').text(`Current text: "${text}"`);
});

// Set new text
$('.set').on('click', () => {
  $('.target').text('Text has been updated!');
  $('.output').text('Text content changed');
});

// Clear text
$('.clear').on('click', () => {
  $('.target').text('');
  $('.output').text('Text cleared');
});

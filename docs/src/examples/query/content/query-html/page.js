import { $ } from '@semantic-ui/query';

// Get current HTML
$('.get').on('click', () => {
  const html = $('.target').html();
  $('.output').text(`Current HTML: ${html}`);
});

// Set new HTML
$('.set').on('click', () => {
  $('.target').html('<p>Updated <em>HTML</em> content with <span>nested elements</span></p>');
  $('.output').text('HTML content changed');
});

// Clear HTML
$('.clear').on('click', () => {
  $('.target').html('');
  $('.output').text('HTML cleared');
});

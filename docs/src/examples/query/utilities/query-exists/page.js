import { $ } from '@semantic-ui/query';

// Check if .item exists
$('.check').on('click', () => {
  const exists = $('.item').exists();
  $('.status').text(`'.item' exists: ${exists ? 'Yes' : 'No'}`);
});

// Check if .missing exists
$('.missing').on('click', () => {
  const exists = $('.missing').exists();
  $('.status').text(`'.missing' exists: ${exists ? 'Yes' : 'No'}`);
});

// Add missing element
$('.add').on('click', () => {
  if (!$('.missing').exists()) {
    $('body').append('<div class="missing">Added Missing Item</div>');
    $('.status').text('Added .missing element');
  }
  else {
    $('.status').text('.missing already exists');
  }
});

// Remove existing element
$('.remove').on('click', () => {
  if ($('.item').exists()) {
    $('.item').remove();
    $('.status').text('Removed .item element');
  }
  else {
    $('.status').text('.item does not exist');
  }
});

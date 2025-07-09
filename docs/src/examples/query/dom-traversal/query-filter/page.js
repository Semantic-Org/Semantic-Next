import { $ } from '@semantic-ui/query';

const updateDisplay = ($filtered) => {
  // Reset all items
  $('.item').removeClass('filtered hidden');

  // Highlight filtered items
  $filtered.addClass('filtered');

  // Hide non-filtered items
  $('.item').not('.filtered').addClass('hidden');

  // Update count
  $('.count').text($filtered.length);
};

$('.filter-active').on('click', () => {
  // Filter using CSS selector
  const $filtered = $('.item').filter('.active');
  updateDisplay($filtered);
});

$('.filter-important').on('click', () => {
  // Filter using attribute selector
  const $filtered = $('.item').filter('[data-type="important"]');
  updateDisplay($filtered);
});

$('.filter-function').on('click', () => {
  // Filter using function
  const $filtered = $('.item').filter((el) => {
    return $(el).hasClass('active') && $(el).attr('data-type') !== 'normal';
  });
  updateDisplay($filtered);
});

$('.reset-btn').on('click', () => {
  $('.item').removeClass('filtered hidden');
  $('.count').text($('.item').length);
});

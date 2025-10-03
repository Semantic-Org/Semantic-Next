import { $ } from '@semantic-ui/query';

// Hide block elements
$('.hide-blocks').on('click', () => {
  $('.block-item').hide();
});

// Hide inline elements
$('.hide-inlines').on('click', () => {
  $('.inline-item').hide();
});

// Hide flex container
$('.hide-flex').on('click', () => {
  $('.flex-container').hide();
});

// Hide all elements
$('.hide-all').on('click', () => {
  $('.item').hide();
});

// Show all elements to reset
$('.show-all').on('click', () => {
  $('.item').show();
});

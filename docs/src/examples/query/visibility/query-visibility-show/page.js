import { $ } from '@semantic-ui/query';

// Show all elements with natural display calculation
$('.show-all').on('click', () => {
  $('.elements > *').show();
});

// Show all elements with fast calculation (calculate: false)
$('.show-fast').on('click', () => {
  $('.elements > *').show({ calculate: false });
});

// Hide all elements to reset
$('.hide-all').on('click', () => {
  $('.elements > *').hide();
});

import { $ } from '@semantic-ui/query';

let clickCount = 0;

// Event that fires only once
$('.single').one('click', () => {
  $('.log').append('<div>Single-use handler fired! (will not fire again)</div>');
});

// Regular event that fires every time
$('.multiple').on('click', () => {
  clickCount++;
  $('.log').append(`<div>Regular handler fired ${clickCount} times</div>`);
});

import { $ } from '@semantic-ui/query';

let clicks = 0;

$('.target').on('click', () => {
  clicks++;
  $('.counter').text(`Clicks: ${clicks}`);
});

$('.trigger').on('click', () => {
  $('.target').click();
});
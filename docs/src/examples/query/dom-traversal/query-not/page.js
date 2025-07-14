import { $ } from '@semantic-ui/query';

$('.select').on('click', () => {
  // Select all items except .special ones
  $('.item').removeClass('selected');
  $('.item').not('.special').addClass('selected');
});

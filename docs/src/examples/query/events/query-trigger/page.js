import { $ } from '@semantic-ui/query';

$('.trigger').on('click', () => {
  $('.target').trigger('focus');
});
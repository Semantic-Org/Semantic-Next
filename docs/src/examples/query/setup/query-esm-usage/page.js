import { $ } from '@semantic-ui/query';

$('.test').on('click', () => {
  $('.demo').text('Query working!');
  $('.demo').addClass('success');
});
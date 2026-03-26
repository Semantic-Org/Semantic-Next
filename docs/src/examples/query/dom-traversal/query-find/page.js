import { $ } from '@semantic-ui/query';

$('.highlight').on('click', () => {
  // Only finds .item elements inside .container
  $('.container').find('.item').addClass('found');
});

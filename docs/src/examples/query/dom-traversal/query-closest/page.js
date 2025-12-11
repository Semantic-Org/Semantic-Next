import { $ } from '@semantic-ui/query';

$('.find').on('click', () => {
  const $ancestor = $('.inner').closest('.box');
  $ancestor.addClass('found');
  $('.count').text($ancestor.length);
});

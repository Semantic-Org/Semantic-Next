import { $ } from '@semantic-ui/query';

$('.find').on('click', () => {
  const $ancestors = $('.inner').closestAll('.box');
  $ancestors.addClass('found');
  $('.count').text($ancestors.length);
});

import { $ } from '@semantic-ui/query';

const $parent = $('.parent');

$('.all').on('click', () => {
  $('.child').removeClass('highlighted');
  $parent.children().addClass('highlighted');
  $('.count').text($parent.children().length);
});

$('.items').on('click', () => {
  $('.child').removeClass('highlighted');
  $parent.children('.item').addClass('highlighted');
  $('.count').text($parent.children('.item').length);
});

$('.special').on('click', () => {
  $('.child').removeClass('highlighted');
  $parent.children('.special').addClass('highlighted');
  $('.count').text($parent.children('.special').length);
});

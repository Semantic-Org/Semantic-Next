import { $ } from '@semantic-ui/query';

const $target = $('.target');

$('.all').on('click', () => {
  $('.item').removeClass('highlighted');
  $target.siblings().addClass('highlighted');
  $('.count').text($target.siblings().length);
});

$('.special-siblings').on('click', () => {
  $('.item').removeClass('highlighted');
  $target.siblings('.special').addClass('highlighted');
  $('.count').text($target.siblings('.special').length);
});

$('.reset').on('click', () => {
  $('.item').removeClass('highlighted');
  $('.count').text('0');
});

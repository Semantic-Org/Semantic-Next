import { $ } from '@semantic-ui/query';

$('.completed').on('click', () => {
  const $done = $('.item').filter('.done');
  $('.item').addClass('dim');
  $done.removeClass('dim');
  $('.count').text($done.length);
});

$('.all').on('click', () => {
  $('.item').removeClass('dim');
  $('.count').text(4);
});

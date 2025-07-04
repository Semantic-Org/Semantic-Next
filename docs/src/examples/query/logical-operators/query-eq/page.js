import { $ } from '@semantic-ui/query';

$('.first').on('click', () => {
  $('.item').removeClass('selected');
  $('.item').eq(0).addClass('selected');
  $('.status').text('Selected first item (index 0)');
});

$('.second').on('click', () => {
  $('.item').removeClass('selected');
  $('.item').eq(1).addClass('selected');
  $('.status').text('Selected second item (index 1)');
});

$('.last').on('click', () => {
  $('.item').removeClass('selected');
  $('.item').eq(3).addClass('selected');
  $('.status').text('Selected last item (index 3)');
});

$('.clear').on('click', () => {
  $('.item').removeClass('selected');
  $('.status').text('Cleared all selections');
});

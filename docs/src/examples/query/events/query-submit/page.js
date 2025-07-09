import { $ } from '@semantic-ui/query';

$('.form').on('submit', function(e) {
  e.preventDefault();
  $('.status').text('Form submitted!').addClass('success');
});

setTimeout(() => {
  $('.form').submit();
}, 2000);
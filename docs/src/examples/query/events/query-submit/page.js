import { $ } from '@semantic-ui/query';

$('form').on('submit', function(event) {
  event.preventDefault();
  $('.status').text('Form submitted!').addClass('success');
});

$('ui-button.submit').on('click', () => {
  $('form').submit();
});

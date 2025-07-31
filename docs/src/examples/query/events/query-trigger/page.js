import { $ } from '@semantic-ui/query';

// log on mousenter of input
$('.target').on('mouseenter', function() {
  $('.log').append('<p>mouse entered input</p>');
});

// trigger focus event including native behavior
$('.trigger').on('click', () => {
  $('.target').trigger('focus');
});

// trigger mouseenter event manually
$('.trigger-mouseenter').on('click', () => {
  $('.target').trigger('mouseenter');
});

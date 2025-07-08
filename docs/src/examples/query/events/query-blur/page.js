import { $ } from '@semantic-ui/query';

$('.input').on('focus', function() {
  $(this).addClass('focused');
  setTimeout(() => {
    $(this).blur();
  }, 1000);
});

$('.input').on('blur', function() {
  $(this).removeClass('focused').addClass('blurred');
});
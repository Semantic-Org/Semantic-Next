import { $ } from '@semantic-ui/query';

$('.increment').on('click', () => {
  $('ui-counter').component().increment();
});

$('.reset').on('click', () => {
  $('ui-counter').component().reset();
});
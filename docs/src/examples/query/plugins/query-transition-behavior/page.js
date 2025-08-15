import { Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('ui-button').on('click', () => {
  const animation = $('.animation').val();
  const direction = $('.direction').val();
  const duration = $('.duration').val() || 'auto';
  const interval = $('.interval').val();

  console.log({
    animation,
    direction,
    duration,
    interval,
  });
  $('.box').transition({
    animation,
    direction,
    duration,
    interval,
  });
});

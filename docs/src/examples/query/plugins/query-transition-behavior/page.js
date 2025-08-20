import { Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('ui-button').on('click', () => {
  const animation = $('.animation').val();
  const groupOrder = $('.direction').val();

  let duration = $('.duration').val() || 'auto';
  let interval = $('.interval').val();

  if (duration !== 'auto') {
    duration = Number(duration);
  }
  if (interval) {
    interval = Number(interval);
  }

  $('.box').transition({
    animation,
    groupOrder,
    duration,
    interval,
  });
});

import { Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('ui-button').on('click', () => {
  const animation = $('.animation').val();
  const groupOrder = $('.direction').val();
  const duration = $('.duration').val() || 'auto';
  const interval = $('.interval').val();

  $('.box').transition({
    animation,
    groupOrder,
    duration,
    interval,
  });
});

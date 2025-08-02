import { Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('ui-button').on('click', () => {
  $('.box').transition('toggle');
});

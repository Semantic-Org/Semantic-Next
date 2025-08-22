import { $ } from '@semantic-ui/query';

import './query-automarkdown.js';

// Initialize plugin
$('ul').automarkdown();

// Add markdown content
$('.add').on('click', () => {
  const input = $('ui-input').val();
  $('<li></li>').text(input).appendTo('ul');
});

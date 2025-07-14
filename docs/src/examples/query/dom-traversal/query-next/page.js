import { $ } from '@semantic-ui/query';

$('.item').on('click', function() {
  // Reset highlighting
  $('.item').removeClass('highlighted');

  // Highlight next sibling
  $(this).next().addClass('highlighted');
});

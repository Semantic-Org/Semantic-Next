import { $ } from '@semantic-ui/query';

$('.child').on('click', function() {
  // Reset highlighting
  $('.box').removeClass('highlighted');

  // Highlight parent
  $(this).parent().addClass('highlighted');
});

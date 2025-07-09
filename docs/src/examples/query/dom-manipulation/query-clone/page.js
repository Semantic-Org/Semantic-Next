import { $ } from '@semantic-ui/query';

const $clones = $('.clones');

$('.clone-btn').on('click', () => {
  // Clone the original element
  const $cloned = $('.original').clone();

  // Append clone to clones container
  $clones.append($cloned);
});

$('.clear-btn').on('click', () => {
  // Remove all cloned elements
  $clones.html('');
});

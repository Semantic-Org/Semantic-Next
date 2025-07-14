import { $ } from '@semantic-ui/query';

// Show initial count
$('.total').text($('.item').count());

// Remove items with 'remove' class
$('.item.remove').remove();

// Update count after removal
setTimeout(() => {
  $('.total').text($('.item').count());
}, 100);

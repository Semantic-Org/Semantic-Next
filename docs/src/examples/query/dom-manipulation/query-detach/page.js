import { $ } from '@semantic-ui/query';

let clickCount = 0;
let detachedItems = null;

// Add click handlers to item buttons
$('.item-btn').on('click', () => {
  clickCount++;
  $('.count').text(clickCount);
});

$('.detach-btn').on('click', () => {
  // Detach items (preserves event handlers)
  detachedItems = $('.item').detach();
});

$('.reattach-btn').on('click', () => {
  if (detachedItems) {
    // Reattach items - event handlers still work!
    $('.container').append(detachedItems);
    detachedItems = null;
  }
});

import { $ } from '@semantic-ui/query';

function updatePosition() {
  const pos = $('.box').pagePosition();
  $('.position').text(`top: ${Math.round(pos.top)}px, left: ${Math.round(pos.left)}px`);
}

// Show initial position
requestAnimationFrame(updatePosition);

// Move box to specific coordinates
$('.move').on('click', () => {
  $('.box').pagePosition({ top: 100, left: 50 });
  updatePosition();
});

// Reset to original position
$('.reset').on('click', () => {
  $('.box').pagePosition({ top: 0, left: 0 });
  updatePosition();
});

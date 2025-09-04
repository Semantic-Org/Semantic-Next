import { $ } from '@semantic-ui/query';

function updatePosition() {
  // pagePosition() returns position relative to document including scroll
  const pos = $('.box').pagePosition();

  $('.page-top').text(Math.round(pos.top));
  $('.page-left').text(Math.round(pos.left));
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

import { $ } from '@semantic-ui/query';

function updateBounds() {
  const bounds = $('.box').bounds();

  $('.top').text(Math.round(bounds.top));
  $('.left').text(Math.round(bounds.left));
  $('.width').text(Math.round(bounds.width));
  $('.height').text(Math.round(bounds.height));
  $('.right').text(Math.round(bounds.right));
  $('.bottom').text(Math.round(bounds.bottom));
}

// Show initial bounds
updateBounds();

// Toggle element size
$('.resize').on('click', () => {
  $('.box').toggleClass('resized');
  // Wait for transition to complete
  setTimeout(updateBounds, 300);
});

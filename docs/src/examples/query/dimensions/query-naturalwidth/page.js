import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  // naturalWidth() returns unconstrained width
  const naturalWidth = $('.element').naturalWidth();
  $('.natural-width').text(naturalWidth);

  // Compare with actual constrained width
  const constrainedWidth = $('.element').width();
  const overflow = naturalWidth - constrainedWidth;

  $('.constrained-width').text(constrainedWidth);
  $('.overflow').text(overflow);
};

requestAnimationFrame(getDimensions);

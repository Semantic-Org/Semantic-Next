import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  // naturalHeight() returns unconstrained height
  const naturalHeight = $('.element').naturalHeight();
  $('.natural-height').text(naturalHeight);

  // Compare with actual constrained height
  const constrainedHeight = $('.element').height();
  const overflow = naturalHeight - constrainedHeight;

  $('.constrained-height').text(constrainedHeight);
  $('.overflow').text(overflow);
};

requestAnimationFrame(getDimensions);

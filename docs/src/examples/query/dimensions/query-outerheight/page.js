import { $ } from '@semantic-ui/query';

// Get dimensions
const getHeights = () => {
  // display outer height
  const outerHeight = $('.box').outerHeight();
  $('.outer-height').text(outerHeight);

  // Display other measurements
  const height = $('.box').height();
  const innerHeight = $('.box').innerHeight();
  const borderHeight = outerHeight - innerHeight;
  $('.height').text(height);
  $('.inner-height').text(innerHeight);
  $('.border-height').text(borderHeight);
};

requestAnimationFrame(getHeights);

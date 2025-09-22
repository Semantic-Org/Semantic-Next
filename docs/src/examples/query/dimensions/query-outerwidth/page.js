import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  // outerWidth() includes content, padding, and border
  const outerWidth = $('.box').outerWidth();
  $('.outer-width').text(outerWidth);

  // Show the breakdown
  const width = $('.box').width();
  const innerWidth = $('.box').innerWidth();
  const borderWidth = outerWidth - innerWidth;

  $('.width').text(width);
  $('.inner-width').text(innerWidth);
  $('.border-width').text(borderWidth);
};

requestAnimationFrame(getDimensions);

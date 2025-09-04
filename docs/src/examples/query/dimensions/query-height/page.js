import { $ } from '@semantic-ui/query';

// Get dimensions
const getHeights = () => {
  // Get current height
  const originalHeight = $('.box').height();
  $('.original-height').text(originalHeight);

  // Set height to 150px and get the new value
  $('.box').height(150);
  const newHeight = $('.box').height();
  $('.box-height').text(newHeight);
  $('.new-height').text(newHeight);

  // Compare with other elements
  const containerHeight = $('.container').height();
  const contentHeight = $('.content').height();
  $('.container-height').text(containerHeight);
  $('.content-height').text(contentHeight);
};

requestAnimationFrame(getHeights);

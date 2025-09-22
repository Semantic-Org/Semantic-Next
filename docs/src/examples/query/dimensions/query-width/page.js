import { $ } from '@semantic-ui/query';

// Get dimensions
const getWidths = () => {
  // Get current width
  const originalWidth = $('.box').width();
  $('.original-width').text(originalWidth);

  // Set width to 300px and get the new value
  $('.box').width(300);
  const newWidth = $('.box').width();
  $('.box-width').text(newWidth);
  $('.new-width').text(newWidth);

  // Compare with another element
  const anotherWidth = $('.another').width();
  $('.another-width').text(anotherWidth);
};

requestAnimationFrame(getWidths);

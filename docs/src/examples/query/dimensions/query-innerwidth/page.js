import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  const box = $('.box');

  // innerWidth() includes content width plus padding
  const innerWidth = box.innerWidth();
  $('.inner-width').text(innerWidth);

  // Calculate the components
  const width = box.width();
  const padding = innerWidth - width;
  $('.width').text(width);
  $('.padding').text(padding);
};

requestAnimationFrame(getDimensions);

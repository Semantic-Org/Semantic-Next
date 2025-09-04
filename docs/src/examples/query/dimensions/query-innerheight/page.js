import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  const box = $('.box');

  // innerHeight() includes content height plus padding
  const innerHeight = box.innerHeight();
  $('.inner-height').text(innerHeight);

  // Calculate the components
  const height = box.height();
  const padding = innerHeight - height;
  $('.height').text(height);
  $('.padding').text(padding);
};

requestAnimationFrame(getDimensions);

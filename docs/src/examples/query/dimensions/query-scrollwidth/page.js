import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  // scrollWidth() returns total content width including hidden overflow
  const scrollWidth = $('.container').scrollWidth();
  $('.scroll-width').text(scrollWidth);

  // Compare with visible width
  const visibleWidth = $('.container').width();
  const hiddenContent = scrollWidth - visibleWidth;

  $('.visible-width').text(visibleWidth);
  $('.hidden-content').text(hiddenContent);
};

requestAnimationFrame(getDimensions);

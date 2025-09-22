import { $ } from '@semantic-ui/query';

// Get dimensions
const getDimensions = () => {
  // scrollHeight() returns total content height including hidden overflow
  const scrollHeight = $('.container').scrollHeight();
  $('.scroll-height').text(scrollHeight);

  // Compare with visible height
  const visibleHeight = $('.container').height();
  const hiddenContent = scrollHeight - visibleHeight;

  $('.visible-height').text(visibleHeight);
  $('.hidden-content').text(hiddenContent);
};

requestAnimationFrame(getDimensions);

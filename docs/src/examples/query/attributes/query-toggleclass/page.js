import { $ } from '@semantic-ui/query';

const updateStatus = () => {
  const classes = $('.box').attr('class');
  $('.classes').text(classes);
};

// Toggle primary class
$('.primary').on('click', () => {
  $('.box').toggleClass('primary');
  updateStatus();
});

// Toggle large class
$('.large').on('click', () => {
  $('.box').toggleClass('large');
  updateStatus();
});

// Toggle round class
$('.round').on('click', () => {
  $('.box').toggleClass('round');
  updateStatus();
});

// Initialize status
updateStatus();

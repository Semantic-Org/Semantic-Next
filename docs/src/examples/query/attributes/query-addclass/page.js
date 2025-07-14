import { $ } from '@semantic-ui/query';

const changeBox = () => {
  const classes = $('.box').attr('class');
  $('.classes').text(classes);
};

// Add primary class
$('.primary').on('click', () => {
  $('.box').addClass('primary');
  changeBox();
});

// Add large class
$('.large').on('click', () => {
  $('.box').addClass('large');
  changeBox();
});

// Add rounded class
$('.rounded').on('click', () => {
  $('.box').addClass('rounded');
  changeBox();
});

// Reset all classes
$('.reset').on('click', () => {
  $('.box').attr('class', 'box');
  changeBox();
});

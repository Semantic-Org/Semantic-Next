import { $ } from '@semantic-ui/query';

const updateClasses = (classToCheck) => {
  const classes = $('.box').attr('class');
  $('.list').text(classes);
};

const checkClass = (classToCheck) => {
  const hasClass = $('.box').hasClass(classToCheck);
  $('.status').text(`Has '${classToCheck}' class: ${hasClass ? 'Yes' : 'No'}`);
};

// Check for styled class
$('.styled').on('click', () => {
  checkClass('styled');
});

// Check for large class
$('.large').on('click', () => {
  checkClass('large');
});

// Check for round class
$('.round').on('click', () => {
  checkClass('round');
});

// Toggle round class to demonstrate checking
$('.toggle').on('click', () => {
  $('.box').toggleClass('round');
  updateClasses();
});

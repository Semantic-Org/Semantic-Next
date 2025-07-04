import { $ } from '@semantic-ui/query';

const initialClasses = $('.box').attr('class');

const updateStatus = () => {
  const classes = $('.box').attr('class');
  $('.status').text(classes);
};

// Remove single class
$('.remove.styled').on('click', function() {
  $('.box').removeClass('styled');
  $(this).addClass('disabled');
  updateStatus();
});
$('.remove.round').on('click', function() {
  $('.box').removeClass('round');
  $(this).addClass('disabled');
  updateStatus();
});

// Remove multiple classes
$('.remove.all').on('click', function() {
  $('.box').removeClass('styled round');
  $(this).addClass('disabled');
  updateStatus();
});

// Reset to initial state
$('.reset').on('click', function() {
  $('.box').addClass(initialClasses);
  $('ui-button').removeClass('disabled');
  updateStatus();
});

// set initial classes
updateStatus();

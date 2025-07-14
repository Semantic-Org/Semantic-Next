import { $ } from '@semantic-ui/query';

const initialClasses = $('.box').attr('class');

// Remove single class
$('.remove.styled').on('click', function() {
  $('.box').removeClass('styled');
  updateStatus(this);
});
$('.remove.round').on('click', function() {
  $('.box').removeClass('round');
  updateStatus(this);
});

// Remove multiple classes
$('.remove.all').on('click', function() {
  $('.box').removeClass('styled round');
  updateStatus(this);
});

// Reset to initial state
$('.reset').on('click', function() {
  $('.box').addClass(initialClasses);
  $('ui-button').removeAttr('disabled');
  updateStatus();
});

const updateStatus = (el) => {
  // update text with classes
  const classes = $('.box').attr('class');
  $('.status').text(classes);
  // disable button
  if (el) {
    $(el).attr('disabled', 'disabled');
  }
};
// set initial classes
updateStatus();

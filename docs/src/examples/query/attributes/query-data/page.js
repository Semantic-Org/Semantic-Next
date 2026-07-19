import { $ } from '@semantic-ui/query';

// Get specific data attributes
const displayId = function() {
  const userId = $('.user').data('id');
  const allData = $('.user').data();
  $('.id').text(`User id is: ${userId}`);
  $('.data').text(JSON.stringify(allData));
};

const setId = (userId) => {
  // set id to 99
  $('.user').data('id', userId);
};

$('ui-button').on('click', () => {
  setId(99);
  displayId();
});

displayId();

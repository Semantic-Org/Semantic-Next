import { $ } from '@semantic-ui/query';

// Get specific data attributes
const displayID = function() {
  const userID = $('.user').data('id');
  const allData = $('.user').data();
  $('.id').text(`User id is: ${userID}`);
  $('.data').text(JSON.stringify(allData));
};

const setID = (userID) => {
  // set id to 99
  $('.user').data('id', userID);
};

$('ui-button').on('click', () => {
  setID(99);
  displayID();
});

displayID();

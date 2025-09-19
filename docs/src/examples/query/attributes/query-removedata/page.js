import { $ } from '@semantic-ui/query';

// Display current data attributes
const displayData = function() {
  const allData = $('.user').data();
  const dataString = JSON.stringify(allData, null, 2);
  $('.current-data').html(`<strong>Current data:</strong><pre>${dataString}</pre>`);
};

// Remove single data attribute
$('.remove-single').on('click', () => {
  $('.user').removeData('age');
  $('.removed').text('Removed: age');
  displayData();
});

// Remove multiple data attributes using space-separated string
$('.remove-multiple').on('click', () => {
  $('.user').removeData('role status');
  $('.removed').text('Removed: role, status');
  displayData();
});

// Remove ID to show visual feedback working
$('.remove-id').on('click', () => {
  $('.user').removeData('id');
  $('.removed').text('Removed: id (notice badge disappears!)');
  displayData();
});

// Add all data attributes back
$('.reset').on('click', () => {
  $('.user')
    .data('id', '123')
    .data('name', 'John Hellinger')
    .data('age', '22')
    .data('role', 'admin')
    .data('status', 'active');
  $('.removed').text('All data attributes restored');
  displayData();
});

// Initial display
displayData();

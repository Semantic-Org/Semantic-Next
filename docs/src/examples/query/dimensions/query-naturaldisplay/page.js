import { $ } from '@semantic-ui/query';

$('ui-button.toggle-visibility').on('click', () => {
  $('.element').toggleClass('hidden');
});

$('ui-button.check').on('click', updateMeasurements);

// Initial measurements
updateMeasurements();

function updateMeasurements() {
  // Get natural display values for each element
  const blockDisplay = $('.block').naturalDisplay();
  const inlineDisplay = $('.inline').naturalDisplay();
  const hiddenDisplay = $('.hidden').naturalDisplay();
  const flexDisplay = $('.flex').naturalDisplay();

  // Display measurements - show what naturalDisplay() returns
  $('.block-display').text(blockDisplay || 'undefined');
  $('.inline-display').text(inlineDisplay || 'undefined');
  $('.hidden-display').text(hiddenDisplay || 'undefined');
  $('.flex-display').text(flexDisplay || 'undefined');
}

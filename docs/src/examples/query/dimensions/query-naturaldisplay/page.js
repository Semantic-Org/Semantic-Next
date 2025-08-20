import { $ } from '@semantic-ui/query';

$('ui-button')
  .filter('.toggle')
  .on('click', toggleVisibility).end()
  .filter('.check')
  .on('click', updateMeasurements);

function updateMeasurements() {
  // Get natural display values for each element
  const blockDisplay = $('.block.element').naturalDisplay();
  const inlineDisplay = $('.inline.element').naturalDisplay();
  const flexDisplay = $('.flex.element').naturalDisplay();

  // Display measurements - show what naturalDisplay() returns
  $('.display')
    .filter('.block').text(blockDisplay).end()
    .filter('.inline').text(inlineDisplay).end()
    .filter('.flex').text(flexDisplay).end();
}

function clearMeasurements() {
  $('.display').text('Click to display measurements');
}

function toggleVisibility() {
  clearMeasurements();
  $('.element').toggleClass('hidden');
}

// Initial measurements
updateMeasurements();

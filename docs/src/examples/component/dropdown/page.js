import { $ } from '@semantic-ui/query';
import { isEmpty } from '@semantic-ui/utils';

// Display selection in the result areas
const showSelection = (elementId, value) => {
  const displayValue = !isEmpty(value) ? value : 'Nothing';
  $(`#${elementId}`).html(`Selected: ${displayValue}`);
};

// Basic dropdown
$('#basic-dropdown').on('change', (event) => {
  showSelection('basic-result', event.detail.value);
});

// Icon dropdown
$('#icon-dropdown').on('change', (event) => {
  showSelection('icon-result', event.detail.value);
});

// Variant dropdown
$('#variant-dropdown').on('change', (event) => {
  showSelection('variant-result', event.detail.value);
});

// Log all dropdown changes
$('ui-dropdown').on('change', (event) => {
  console.log('Dropdown changed:', event.detail);
});
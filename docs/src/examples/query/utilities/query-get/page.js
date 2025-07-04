import { $ } from '@semantic-ui/query';

// Get specific element at index 1 (second element)
const secondElement = $('.color').get(1);
$('.second-element').text(secondElement.textContent);

// Get all elements as native array
const allElements = $('.color').get();
$('.all-elements').text(`${allElements.length} elements`);

// Show that .get() returns native DOM elements, not Query objects
$('.element-type').text(secondElement.constructor.name);

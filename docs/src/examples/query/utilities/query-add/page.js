import { $ } from '@semantic-ui/query';

// Start with red boxes
const $collection = $('.red');

// Add blue boxes to the collection
// and apply styling to all combined elements
$collection.add('.blue').addClass('highlighted');

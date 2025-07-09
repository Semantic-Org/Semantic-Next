import { $ } from '@semantic-ui/query';

// Get dimensions
const constrainedWidth = $('.element').width();
const naturalWidth = $('.element').naturalWidth();
const difference = naturalWidth - constrainedWidth;

// Display measurements
$('.constrained-width').text(constrainedWidth);
$('.natural-width').text(naturalWidth);
$('.difference').text(difference);

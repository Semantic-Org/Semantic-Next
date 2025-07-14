import { $ } from '@semantic-ui/query';

// Get dimensions
const constrainedHeight = $('.element').height();
const naturalHeight = $('.element').naturalHeight();
const difference = naturalHeight - constrainedHeight;

// Display measurements
$('.constrained-height').text(constrainedHeight);
$('.natural-height').text(naturalHeight);
$('.difference').text(difference);

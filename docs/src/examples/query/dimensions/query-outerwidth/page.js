import { $ } from '@semantic-ui/query';

// Get dimensions
const width = $('.box').width();
const innerWidth = $('.box').innerWidth();
const outerWidth = $('.box').outerWidth();
const borderWidth = outerWidth - innerWidth;

// Display measurements
$('.width').text(width);
$('.inner-width').text(innerWidth);
$('.outer-width').text(outerWidth);
$('.border-width').text(borderWidth);

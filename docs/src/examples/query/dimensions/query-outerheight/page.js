import { $ } from '@semantic-ui/query';

// Get dimensions
const height = $('.box').height();
const innerHeight = $('.box').innerHeight();
const outerHeight = $('.box').outerHeight();
const borderHeight = outerHeight - innerHeight;

// Display measurements
$('.height').text(height);
$('.inner-height').text(innerHeight);
$('.outer-height').text(outerHeight);
$('.border-height').text(borderHeight);

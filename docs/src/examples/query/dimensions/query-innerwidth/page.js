import { $ } from '@semantic-ui/query';

const box = $('.box');

// Get dimensions
const width = box.width();
const innerWidth = box.innerWidth();
const difference = innerWidth - width;

// Display measurements
$('.width').text(width);
$('.inner-width').text(innerWidth);
$('.difference').text(difference);

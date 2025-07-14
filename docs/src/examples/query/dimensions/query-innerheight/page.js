import { $ } from '@semantic-ui/query';

const box = $('.box');

// Get dimensions
const height = box.height();
const innerHeight = box.innerHeight();
const difference = innerHeight - height;

// Display measurements
$('.height').text(height);
$('.inner-height').text(innerHeight);
$('.difference').text(difference);

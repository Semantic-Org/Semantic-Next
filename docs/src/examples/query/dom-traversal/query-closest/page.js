import { $ } from '@semantic-ui/query';

// Find closest ancestors from target element
const target = $('.target');

$('.section').text(target.closest('.section').length > 0 ? 'Found' : 'Not found');
$('.container').text(target.closest('.container').length > 0 ? 'Found' : 'Not found');
$('.active').text(target.closest('.active').length > 0 ? 'Found' : 'Not found');

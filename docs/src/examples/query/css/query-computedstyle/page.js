import { $ } from '@semantic-ui/query';

const backgroundColor = $('.container').computedStyle('background-color');

// Get computed style values (as they actually appear)
$('.output').text(`Background is ${backgroundColor}`);

import { $ } from '@semantic-ui/query';

// Slice middle items (index 1 to 4)
const middle = $('.item').slice(1, 4);
middle.addClass('sliced');
$('.middle').text(middle.map(el => el.textContent).join(', '));

// Slice last 3 items
const lastThree = $('.item').slice(-3);
$('.last').text(lastThree.map(el => el.textContent).join(', '));

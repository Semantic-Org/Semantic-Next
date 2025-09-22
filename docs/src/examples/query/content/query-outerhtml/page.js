import { $ } from '@semantic-ui/query';

// Get outer HTML (includes the element's own tag)
const boxOuter = $('.box').outerHTML();

$('.html').text(boxOuter);

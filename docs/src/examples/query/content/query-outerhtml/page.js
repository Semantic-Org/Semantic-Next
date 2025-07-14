import { $ } from '@semantic-ui/query';

// Get outer HTML (includes the element's own tag)
const boxOuter = $('.box').outerHTML();
const cardOuter = $('.card').outerHTML();

$('.boxhtml').text(boxOuter);
$('.cardhtml').text(cardOuter);

// Demonstrate replacement with outerHTML
setTimeout(() => {
  $('.box').outerHTML('<div class="replaced">Replaced entire element</div>');
}, 2000);

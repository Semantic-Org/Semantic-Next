import { $ } from '@semantic-ui/query';

// Get initial widths
$('.boxwidth').text($('.box').width());
$('.anotherwidth').text($('.another').width());

// Set new width on box
$('.box').width(300);

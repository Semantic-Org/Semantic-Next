import { $ } from '@semantic-ui/query';

// Get initial heights
$('.outer').text($('.container').height());
$('.inner').text($('.content').height());
$('.fixed').text($('.box').height());

// Set new height on box element
$('.box').height(150);

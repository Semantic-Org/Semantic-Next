import { $ } from '@semantic-ui/query';

// Get dimensions
const visibleHeight = $('.container').height();
const scrollHeight = $('.container').scrollHeight();
const hiddenContent = scrollHeight - visibleHeight;

// Display measurements
$('.visible-height').text(visibleHeight);
$('.scroll-height').text(scrollHeight);
$('.hidden-content').text(hiddenContent);

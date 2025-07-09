import { $ } from '@semantic-ui/query';

// Get dimensions
const visibleWidth = $('.container').width();
const scrollWidth = $('.container').scrollWidth();
const hiddenContent = scrollWidth - visibleWidth;

// Display measurements
$('.visible-width').text(visibleWidth);
$('.scroll-width').text(scrollWidth);
$('.hidden-content').text(hiddenContent);

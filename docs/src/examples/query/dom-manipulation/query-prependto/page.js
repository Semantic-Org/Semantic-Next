import { $ } from '@semantic-ui/query';

// Move priority items to the beginning of containers using prependTo
$('.item').prependTo('.container');

// Create new header and prepend it to first container
$('<div class="header">PRIORITY SECTION</div>').prependTo('.container:first-child');

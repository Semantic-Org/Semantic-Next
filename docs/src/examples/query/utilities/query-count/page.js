import { $ } from '@semantic-ui/query';

// Count different element collections
$('.total').text($('span').count());
$('.fruits').text($('.fruit').count());
$('.vegetables').text($('.vegetable').count());
$('.headings').text($('h3').count());
$('.none').text($('.nonexistent').count());

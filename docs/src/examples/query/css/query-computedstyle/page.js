import { $ } from '@semantic-ui/query';

// Get computed style values (as they actually appear)
$('.fontsize').text($('.child').computedStyle('font-size'));
$('.display').text($('.child').computedStyle('display'));
$('.margin').text($('.child').computedStyle('margin-top'));

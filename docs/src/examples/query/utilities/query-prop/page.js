import { $ } from '@semantic-ui/query';

// Get DOM properties (not attributes)
$('.checked').text($('.checkbox').prop('checked'));
$('.disabled').text($('.input').prop('disabled'));
$('.index').text($('.select').prop('selectedIndex'));
$('.value').text($('.input').prop('value'));

// Set properties
$('.checkbox').prop('checked', true);
$('.input').prop('disabled', false);

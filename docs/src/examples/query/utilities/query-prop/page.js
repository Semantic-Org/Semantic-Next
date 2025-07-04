import { $ } from '@semantic-ui/query';

// Get DOM properties (not attributes)
$('.checkbox-checked').text($('.checkbox').prop('checked'));
$('.input-disabled').text($('.input').prop('disabled'));
$('.select-index').text($('.select').prop('selectedIndex'));
$('.input-value').text($('.input').prop('value'));

// Set properties
$('.checkbox').prop('checked', true);
$('.input').prop('disabled', false);

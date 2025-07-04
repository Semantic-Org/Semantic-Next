import { $ } from '@semantic-ui/query';

// Show initial state
$('.input').text($('.field').attr('disabled') || 'none');
$('.button').text($('.btn').attr('disabled') || 'none');
$('.width').text($('.pic').attr('width') || 'none');
$('.data').text($('.pic').attr('data-temp') || 'none');

// Remove attributes
$('.field').removeAttr('disabled');
$('.btn').removeAttr('disabled');
$('.pic').removeAttr('width');
$('.pic').removeAttr('data-temp');

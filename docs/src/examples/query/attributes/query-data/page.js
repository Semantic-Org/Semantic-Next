import { $ } from '@semantic-ui/query';

// Get specific data attributes
$('.userid').text($('.user').data('id'));
$('.role').text($('.user').data('role'));
$('.price').text($('.product').data('price'));

// Get all data attributes as objects
$('.userdata').text(JSON.stringify($('.user').data()));
$('.productdata').text(JSON.stringify($('.product').data()));

// Set new data attributes
$('.user').data('lastLogin', '2024-01-15');
$('.product').data('stock', '25');

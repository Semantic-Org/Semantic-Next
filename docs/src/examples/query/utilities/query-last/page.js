import { $ } from '@semantic-ui/query';

// Directly demonstrate .last() method
$('.item').last().addClass('last');

// Show the text content of the last item
const lastText = $('.item').last().text();
$('.result').text(`Last item text: "${lastText}"`);

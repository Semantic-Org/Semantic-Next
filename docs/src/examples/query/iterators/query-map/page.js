import { $ } from '@semantic-ui/query';

// Map to get original values
const original = $('.number').map((el) => $(el).text());
$('.original').text(original.join(', '));

// Map to double the values
const doubled = $('.number').map((el) => $(el).text() * 2);
$('.doubled').text(doubled.join(', '));

// Map to get text content with prefix
const numbers = $('.number').map((el) => $(el).text()).join(' | ');
$('.text').text(numbers);

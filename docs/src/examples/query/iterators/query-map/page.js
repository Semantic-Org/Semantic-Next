import { $ } from '@semantic-ui/query';

// Map to get original values
const original = $('.number').map((el) => parseInt(el.textContent));
$('.original').text(original.join(', '));

// Map to double the values
const doubled = $('.number').map((el) => parseInt(el.textContent) * 2);
$('.doubled').text(doubled.join(', '));

// Map to get text content with prefix
const textArray = $('.number').map((el) => `Value: ${el.textContent}`);
$('.text').text(textArray.join(' | '));

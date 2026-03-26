import { $ } from '@semantic-ui/query';

// Extract text from each element
const values = $('.number').map(el => $(el).text());
$('.extracted').text(values.join(', '));

// Transform each value
const doubled = $('.number').map(el => $(el).text() * 2);
$('.doubled').text(doubled.join(', '));

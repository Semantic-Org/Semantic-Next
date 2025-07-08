import { escapeRegExp } from '@semantic-ui/utils';

const productName = "Men's T-Shirt (Large) - $19.99";
const searchTerm = 'T-Shirt (Large)';

const escapedSearch = escapeRegExp(searchTerm);
const regex = new RegExp(escapedSearch, 'i');

console.log('Product:', productName);
console.log('Search term:', searchTerm);
console.log('Escaped search:', escapedSearch);
console.log('Found match:', regex.test(productName));

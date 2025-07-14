import { getArticle } from '@semantic-ui/utils';

console.log(getArticle('apple'));
console.log(getArticle('banana'));
console.log(getArticle('umbrella'));

// with word included
console.log(getArticle('apple', { includeWord: true }));
console.log(getArticle('umbrella', { includeWord: true }));

// with capitalization and word
console.log(getArticle('elephant', { capitalize: true, includeWord: true }));

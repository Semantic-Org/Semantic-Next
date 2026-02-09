import { bench, describe } from 'vitest';
import {
  camelToKebab,
  capitalize,
  capitalizeWords,
  escapeHTML,
  getArticle,
  joinWords,
  kebabToCamel,
  toTitleCase,
  truncate,
} from '../packages/utils/src/strings.js';

describe('string utilities', () => {
  const shortString = 'hello world';
  const longString = 'the quick brown fox jumps over the lazy dog '.repeat(10);
  const htmlString = '<script>alert("XSS")</script> & <div>content</div>';
  const kebabString = 'this-is-a-kebab-case-string-with-many-words';
  const camelString = 'thisIsACamelCaseStringWithManyWords';

  bench('kebabToCamel - short string', () => {
    kebabToCamel('hello-world');
  });

  bench('kebabToCamel - long string', () => {
    kebabToCamel(kebabString);
  });

  bench('camelToKebab - short string', () => {
    camelToKebab('helloWorld');
  });

  bench('camelToKebab - long string', () => {
    camelToKebab(camelString);
  });

  bench('capitalize', () => {
    capitalize(shortString);
  });

  bench('capitalizeWords', () => {
    capitalizeWords(longString);
  });

  bench('toTitleCase - short', () => {
    toTitleCase('the quick brown fox');
  });

  bench('toTitleCase - long', () => {
    toTitleCase(longString);
  });

  bench('joinWords - small list', () => {
    joinWords(['apple', 'banana', 'cherry']);
  });

  bench('joinWords - large list with options', () => {
    const words = Array.from({ length: 20 }, (_, i) => `item${i}`);
    joinWords(words, { oxford: true, quotes: true });
  });

  bench('getArticle', () => {
    getArticle('umbrella');
    getArticle('house');
  });

  bench('truncate - short text', () => {
    truncate(shortString, 50);
  });

  bench('truncate - long text with word boundary', () => {
    truncate(longString, 100, { wordBoundary: true });
  });

  bench('truncate - long text without word boundary', () => {
    truncate(longString, 100, { wordBoundary: false });
  });

  bench('escapeHTML - simple', () => {
    escapeHTML('<div>test</div>');
  });

  bench('escapeHTML - complex', () => {
    escapeHTML(htmlString);
  });
});

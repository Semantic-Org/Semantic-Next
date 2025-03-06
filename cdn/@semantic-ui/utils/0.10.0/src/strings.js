import { isArray, isString, isFunction } from './types.js';
import { noop } from './functions.js';

/*-------------------
       Strings
--------------------*/

/*
  HTML Attributes -> JS Properties
*/

// attr-name to varName
export const kebabToCamel = (str = '') => {
  return str.replace(/-./g, (m) => m[1].toUpperCase());
};

export const camelToKebab = (str = '') => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

export const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str = '') => {
  return str
    .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
    .replace(/\b(\w+)\b/g, (match) => match.toLowerCase())
    .replace(/\b(\w)/g, (match) => match.toUpperCase());
};

export const toTitleCase = (str = '') => {
  const stopWords = [
    'the',
    'a',
    'an',
    'and',
    'but',
    'for',
    'at',
    'by',
    'from',
    'to',
    'in',
    'on',
    'of',
    'or',
    'nor',
    'with',
    'as',
  ];
  if(!isString(str)) {
    return;
  }
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Always capitalize the first word and any word not in stopWords
      if (index === 0 || !stopWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

export const joinWords = (words, {
  separator = ', ',
  lastSeparator = ' and ',
  oxford = true,
  quotes = false,
  transform = noop
} = {}) => {
  if (!isArray(words) || words.length === 0) {
    return '';
  }

  const processedWords = words.map(word => {
    let processed = word;
    if (isFunction(transform)) {
      processed = transform(word);
    }
    return quotes ? `"${processed}"` : processed;
  });

  if (processedWords.length === 1) {
    return processedWords[0];
  }

  if (processedWords.length === 2) {
    return processedWords.join(lastSeparator);
  }

  const lastWord = processedWords.pop();
  let result = processedWords.join(separator);

  if (oxford && separator.trim() !== lastSeparator.trim()) {
    result += separator.trim();
  }

  return result + lastSeparator + lastWord;
};

export const getArticle = (word, settings = {}) => {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const firstLetter = word.toLowerCase()[0];
  const article = vowels.includes(firstLetter)
    ? 'an'
    : 'a'
  ;
  return (settings.capitalize)
    ? capitalize(article)
    : article
  ;
};

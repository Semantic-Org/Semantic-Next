import { isString } from './types.js';

/*-------------------
     Title Case
--------------------*/

// lives in its own module so the attribute codec path that imports strings.js never carries the
// vocabulary. the config assignment below is a side effect bundlers keep once a module is entered

export const toTitleCase = (str = '') => {
  if (!isString(str)) {
    return;
  }
  const stopWords = toTitleCase.config.stopWords;
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, arr) => {
      // Always capitalize the first word, last word, and any word not in stopWords
      if (index === 0 || index === arr.length - 1 || !stopWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

// the words that stay lowercase mid-title. style guides disagree here (AP capitalizes long
// prepositions, Chicago lowercases them all), so the list is editable once at app boot.
// humanize's titleCase mode reads the same vocabulary
toTitleCase.config = {
  stopWords: [
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
  ],
};

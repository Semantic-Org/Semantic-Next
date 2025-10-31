import { noop } from './functions.js';
import { isArray, isFunction, isString } from './types.js';

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
  if (!isString(str)) {
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
  transform = noop,
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
    : 'a';
  const finalArticle = (settings.capitalize)
    ? capitalize(article)
    : article;

  return settings.includeWord
    ? `${finalArticle} ${word}`
    : finalArticle;
};

export const truncate = (text, length, options = {}) => {
  const {
    suffix = '…',
    wordBoundary = true,
    locale = 'en',
  } = options;

  if (!text) {
    return '';
  }

  const chars = Array.from(text);
  const suffixChars = Array.from(suffix);

  if (chars.length <= length) {
    return text;
  }

  const cutoff = Math.max(0, length - suffixChars.length);

  if (wordBoundary && typeof Intl?.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
    let count = 0;
    let truncated = '';

    for (const { segment } of segmenter.segment(text)) {
      const segLen = Array.from(segment).length;
      if (count + segLen > cutoff) { break; }

      truncated += segment;
      count += segLen;
    }

    if (!truncated) {
      truncated = chars.slice(0, cutoff).join('');
    }

    return truncated.trimEnd() + suffix;
  }

  let truncated = chars.slice(0, cutoff).join('');

  if (wordBoundary) {
    const boundaryChars = /[\s.,!?;:()-]/g;
    const matches = [...truncated.matchAll(boundaryChars)];
    if (matches.length > 0) {
      // Backtrack to the last found boundary.
      truncated = truncated.slice(0, matches[matches.length - 1].index);
    }
  }

  return truncated.trimEnd() + suffix;
};

export const escapeHTML = (string) => {
  const htmlEscapes = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "'": '&#39',
  };
  const htmlRegExp = /[&<>"']/g;
  const hasHTML = RegExp(htmlRegExp.source);
  return (string && hasHTML.test(string))
    ? string.replace(htmlRegExp, (chr) => htmlEscapes[chr])
    : string;
};

export const reverseString = (str = '', options = {}) => {
  if (!str) {
    return '';
  }

  const { locale = 'en' } = options;

  // Use Intl.Segmenter for proper grapheme cluster handling (flags, skin tones, etc.)
  if (typeof Intl?.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(str), s => s.segment);
    return segments.reverse().join('');
  }

  // Fallback to Array.from for older environments (handles basic emojis)
  return Array.from(str).reverse().join('');
};

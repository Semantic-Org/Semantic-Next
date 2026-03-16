import { noop } from './functions.js';
import { isArray, isFunction, isString } from './types.js';

/*-------------------
       Strings
--------------------*/

const segmenterCache = new Map();
const getSegmenter = (locale, granularity) => {
  const key = `${locale}:${granularity}`;
  let segmenter = segmenterCache.get(key);
  if (!segmenter) {
    segmenter = new Intl.Segmenter(locale, { granularity });
    segmenterCache.set(key, segmenter);
  }
  return segmenter;
};

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
  return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};

const stopWords = new Set([
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
]);

export const toTitleCase = (str = '') => {
  if (!isString(str)) {
    return;
  }
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, arr) => {
      // Always capitalize the first word, last word, and any word not in stopWords
      if (index === 0 || index === arr.length - 1 || !stopWords.has(word)) {
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
    const segmenter = getSegmenter(locale, 'word');
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

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const escapeHTMLRegExp = /[&<>"']/g;

export const escapeHTML = (string) => {
  if (!string) { return ''; }
  return escapeHTMLRegExp.test(string)
    ? string.replace(escapeHTMLRegExp, (chr) => htmlEscapes[chr])
    : string;
};

const htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};
const unescapeHTMLRegExp = /&(?:amp|lt|gt|quot|#39);/g;

export const unescapeHTML = (string) => {
  return (string && unescapeHTMLRegExp.test(string))
    ? string.replace(unescapeHTMLRegExp, (entity) => htmlUnescapes[entity])
    : string;
};

export const reverseString = (str = '', options = {}) => {
  if (!str) {
    return '';
  }

  const { locale = 'en' } = options;

  // Use Intl.Segmenter for proper grapheme cluster handling (flags, skin tones, etc.)
  if (typeof Intl?.Segmenter === 'function') {
    const segmenter = getSegmenter(locale, 'grapheme');
    const segments = Array.from(segmenter.segment(str), s => s.segment);
    return segments.reverse().join('');
  }

  // Fallback to Array.from for older environments (handles basic emojis)
  return Array.from(str).reverse().join('');
};

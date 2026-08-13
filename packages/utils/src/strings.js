import { configured, identity } from './functions.js';
import { isArray, isFunction, isIterable, isMap, isNumber, isPlainObject, isString } from './types.js';

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
export const kebabToCamel = (str = '', { separator = '_' } = {}) => {
  const parts = str.split('-');
  let out = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    if (!seg) { continue; }
    const c = seg.charCodeAt(0);
    if (c >= 48 && c <= 57) {
      out += separator + seg;
    }
    else {
      out += seg[0].toUpperCase() + seg.slice(1);
    }
  }
  return out;
};

const UNDERSCORE_DIGIT_REGEX = /_(?=[0-9])/g;
const digitSepRegexCache = new Map();

export const camelToKebab = (str = '', { lossless = false, separator = '_' } = {}) => {
  const normalized = lossless ? str : (str[0]?.toLowerCase() + str.slice(1));
  let digitSepRegex;
  if (separator === '_') {
    digitSepRegex = UNDERSCORE_DIGIT_REGEX;
  }
  else {
    digitSepRegex = digitSepRegexCache.get(separator);
    if (!digitSepRegex) {
      digitSepRegex = new RegExp(`\\${separator}(?=[0-9])`, 'g');
      digitSepRegexCache.set(separator, digitSepRegex);
    }
  }
  return normalized
    .replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
    .replace(digitSepRegex, '-');
};

export const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str = '') => {
  return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};

// the words that stay lowercase mid-title. style guides disagree here (AP capitalizes long
// prepositions, Chicago lowercases them all), so the list is editable once at app boot.
// humanize's titleCase mode reads the same vocabulary
export const toTitleCase = /* @__PURE__ */ configured(
  (str = '') => {
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
  },
  {
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
  },
);

// split an identifier into words: acronym runs stay whole (getHTTPResponse -> get, HTTP, Response),
// a plural acronym keeps its trailing s (userIDs -> user, IDs), and caseless scripts keep their
// combining marks so vocalized Devanagari/Arabic/Hebrew/Thai don't shatter per codepoint
const HUMANIZE_WORD_RE =
  /\p{Lu}{2,}s(?![\p{Ll}\p{M}])|\p{Lu}+(?=\p{Lu}\p{Ll})|[\p{Lu}\p{Lt}]?[\p{Ll}\p{Lm}\p{M}]+|\p{Lu}+|[\p{Lo}\p{Lm}\p{M}]+|\p{N}+/gu;

const PLURAL_ACRONYM_RE = /^\p{Lu}{2,}s$/u;

const isAcronym = (word) =>
  (word.length > 1 && word === word.toUpperCase() && word !== word.toLowerCase()) || PLURAL_ACRONYM_RE.test(word);

// global defaults plus a token vocabulary, seeded with the highest-frequency lowercase acronyms.
// extend once at app boot (humanize.config.terms.sku = 'SKU') and every call inherits it
export const humanize = /* @__PURE__ */ configured(
  (str = '', options = {}) => {
    if (!isString(str)) { return ''; }

    const { titleCase, dropId, constantCase } = { ...humanize.config, ...options };
    // call terms layer over the global vocabulary so an app sets it once and overrides per call
    const terms = options.terms ? { ...humanize.config.terms, ...options.terms } : humanize.config.terms;

    // normalize so decomposed accents (NFD café, ÉCOLE) collapse before the casing pass
    const words = str.normalize('NFC').match(HUMANIZE_WORD_RE);
    if (!words) { return ''; }

    // strip a trailing id segment (user_id -> User), but never the only word
    if (dropId && words.length > 1 && words[words.length - 1].toLowerCase() === 'id') {
      words.pop();
    }

    const cased = words.map((word, index) => {
      const lower = word.toLowerCase();
      // hasOwn so a token like 'constructor' or '__proto__' can't read an inherited Object member
      if (Object.hasOwn(terms, lower)) { return terms[lower]; }
      // constantCase opts out of acronym preservation so shouting enums (IN_PROGRESS) sentence-case
      if (!constantCase && isAcronym(word)) { return word; }
      if (titleCase) {
        const isEdge = index === 0 || index === words.length - 1;
        return (isEdge || !toTitleCase.config.stopWords.includes(lower)) ? capitalize(lower) : lower;
      }
      return index === 0 ? capitalize(lower) : lower;
    });

    return cased.join(' ');
  },
  {
    titleCase: false,
    dropId: true,
    constantCase: false,
    terms: { id: 'ID', url: 'URL', api: 'API' },
  },
);

export const joinWords = (words, {
  separator = ', ',
  lastSeparator = ' and ',
  oxford = true,
  quotes = false,
  transform = identity,
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

const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

// words whose sound contradicts their spelling, where the vowel heuristic reads them wrong.
// extend once at app boot (getArticle.config.exceptions.faq = 'an') and every call inherits it
export const getArticle = /* @__PURE__ */ configured(
  (word, settings = {}) => {
    const lower = word.toLowerCase();
    const exceptions = getArticle.config.exceptions;
    // hasOwn so a word like 'constructor' can't read an inherited Object member as its article
    const article = Object.hasOwn(exceptions, lower)
      ? exceptions[lower]
      : (vowels.has(lower[0]) ? 'an' : 'a');
    const finalArticle = (settings.capitalize)
      ? capitalize(article)
      : article;

    return settings.includeWord
      ? `${finalArticle} ${word}`
      : finalArticle;
  },
  {
    exceptions: {
      hour: 'an',
      honest: 'an',
      honor: 'an',
      honour: 'an',
      heir: 'an',
      unique: 'a',
      university: 'a',
      unicorn: 'a',
      user: 'a',
      one: 'a',
      once: 'a',
      euro: 'a',
    },
  },
);

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

const WHITESPACE_RE = /\s+/g;
const NON_WORD_RE = /[^\w-]+/g;
const UNDERSCORE_RE = /_/g;

// normalize a string into a lowercase, hyphen-joined token (slug-style)
export const tokenize = (str = '') => {
  return (str || '').replace(WHITESPACE_RE, '-')
    .replace(NON_WORD_RE, '')
    .replace(UNDERSCORE_RE, '-')
    .toLowerCase();
};

/*-------------------
     Similarity
--------------------*/

const SURROGATE_RE = /[\uD800-\uDFFF]/;

// bit-parallel Levenshtein (Myers 1999) for the hot path: unit costs, no swaps,
// shorter string at most 32 units. one DP row lives in two machine words, so a
// comparison is O(n) bitwise ops. the alphabet table (256KB) is allocated on
// first use and cleared after each run, so it costs nothing until the first call
let bitAlphabet = null;

const bitDistance = (pattern, text) => {
  bitAlphabet ??= new Uint32Array(0x10000);
  const m = pattern.length;
  const last = 1 << (m - 1);
  let vp = -1;
  let vn = 0;
  let distance = m;
  for (let i = 0; i < m; i++) {
    bitAlphabet[pattern.charCodeAt(i)] |= 1 << i;
  }
  for (let j = 0; j < text.length; j++) {
    const eq = bitAlphabet[text.charCodeAt(j)];
    const d0 = (((eq & vp) + vp) ^ vp) | eq | vn;
    const hp = vn | ~(d0 | vp);
    const hn = vp & d0;
    if (hp & last) {
      distance++;
    }
    if (hn & last) {
      distance--;
    }
    const shifted = (hp << 1) | 1;
    vp = (hn << 1) | ~(d0 | shifted);
    vn = shifted & d0;
  }
  for (let i = 0; i < m; i++) {
    bitAlphabet[pattern.charCodeAt(i)] = 0;
  }
  return distance;
};

// the general engine: weighted costs, adjacent swaps (the restricted
// Damerau-Levenshtein recurrence), and a max cutoff. with max set, work stays
// inside the diagonal band that can still finish at or under it, and bails once
// a whole row exceeds it — row minima never decrease under nonnegative costs,
// though a swap reads back two rows, hence the two-row check before bailing
const dpDistance = (a, b, { insertCost, deleteCost, replaceCost, swaps, swapCost, max }) => {
  const m = a.length;
  const n = b.length;
  let prevPrev = swaps ? new Float64Array(n + 1) : null;
  let prev = new Float64Array(n + 1);
  let curr = new Float64Array(n + 1);
  for (let j = 0; j <= n; j++) {
    prev[j] = j * insertCost;
  }
  const minIndel = Math.min(insertCost, deleteCost);
  const band = (max === Infinity || minIndel === 0) ? Infinity : Math.floor(max / minIndel);
  let lastRowMin = 0;
  for (let i = 1; i <= m; i++) {
    const from = band === Infinity ? 1 : Math.max(1, i - band);
    const to = band === Infinity ? n : Math.min(n, i + band);
    curr[0] = i * deleteCost;
    if (from > 1) {
      curr[from - 1] = Infinity;
    }
    let rowMin = from > 1 ? Infinity : curr[0];
    const unitA = a[i - 1];
    for (let j = from; j <= to; j++) {
      const unitB = b[j - 1];
      let cost;
      if (unitA === unitB) {
        // a free match never loses to an indel detour under nonnegative costs
        cost = prev[j - 1];
      }
      else {
        cost = prev[j - 1] + replaceCost;
        const deleted = prev[j] + deleteCost;
        if (deleted < cost) {
          cost = deleted;
        }
        const inserted = curr[j - 1] + insertCost;
        if (inserted < cost) {
          cost = inserted;
        }
        if (swaps && i > 1 && j > 1 && unitA === b[j - 2] && a[i - 2] === unitB) {
          const swapped = prevPrev[j - 2] + swapCost;
          if (swapped < cost) {
            cost = swapped;
          }
        }
      }
      curr[j] = cost;
      if (cost < rowMin) {
        rowMin = cost;
      }
    }
    if (to < n) {
      curr[to + 1] = Infinity;
    }
    if (rowMin > max && (!swaps || lastRowMin > max)) {
      return Infinity;
    }
    lastRowMin = rowMin;
    if (swaps) {
      const spare = prevPrev;
      prevPrev = prev;
      prev = curr;
      curr = spare;
    }
    else {
      const spare = prev;
      prev = curr;
      curr = spare;
    }
  }
  return prev[n] > max ? Infinity : prev[n];
};

const toCharCodes = (str, from, to) => {
  const codes = new Uint16Array(to - from);
  for (let i = from; i < to; i++) {
    codes[i - from] = str.charCodeAt(i);
  }
  return codes;
};

// one pipeline behind editDistance and similarity: both need the distance,
// similarity also needs the unit length that normalizes it
const computeDistance = (a, b, options) => {
  const {
    minScore = 0,
    ignoreCase = false,
    normalize = true,
    grapheme = false,
    locale = 'en',
    swaps = false,
    insertCost = 1,
    deleteCost = 1,
    replaceCost = 1,
    swapCost = 1,
  } = options;
  if (!(insertCost >= 0 && deleteCost >= 0 && replaceCost >= 0 && swapCost >= 0)) {
    throw new Error('editDistance: costs must be numbers >= 0');
  }
  let max = (isNumber(options.max) && !Number.isNaN(options.max)) ? options.max : Infinity;

  a = a == null ? '' : String(a);
  b = b == null ? '' : String(b);
  if (normalize) {
    a = a.normalize('NFC');
    b = b.normalize('NFC');
  }
  if (ignoreCase) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  if (a === b) {
    return { distance: max < 0 ? Infinity : 0, length: 0 };
  }

  // the unit of comparison: grapheme clusters on request, code points when an
  // astral character is present (an emoji reads as one edit, not two surrogate
  // halves), raw code units otherwise so the common case converts nothing
  let seqA = a;
  let seqB = b;
  if (grapheme && typeof Intl?.Segmenter === 'function') {
    seqA = Array.from(getSegmenter(locale, 'grapheme').segment(a), (s) => s.segment);
    seqB = Array.from(getSegmenter(locale, 'grapheme').segment(b), (s) => s.segment);
  }
  else if (SURROGATE_RE.test(a) || SURROGATE_RE.test(b)) {
    seqA = Array.from(a, (c) => c.codePointAt(0));
    seqB = Array.from(b, (c) => c.codePointAt(0));
  }
  const length = Math.max(seqA.length, seqB.length);
  if (minScore > 0) {
    // a score floor is a distance ceiling once the length is known. the epsilon
    // keeps float slop from rejecting a boundary-exact score
    max = Math.min(max, (1 - minScore) * length + 1e-9);
  }

  // a shared prefix or suffix costs nothing under any cost model
  let start = 0;
  let endA = seqA.length;
  let endB = seqB.length;
  while (start < endA && start < endB && seqA[start] === seqB[start]) {
    start++;
  }
  while (endA > start && endB > start && seqA[endA - 1] === seqB[endB - 1]) {
    endA--;
    endB--;
  }
  const m = endA - start;
  const n = endB - start;
  if (m === 0 || n === 0) {
    const distance = (m * deleteCost) + (n * insertCost);
    return { distance: distance > max ? Infinity : distance, length };
  }
  // the length difference alone bounds the distance from below
  if (Math.abs(m - n) * Math.min(insertCost, deleteCost) > max) {
    return { distance: Infinity, length };
  }

  const codeUnits = isString(seqA);
  let distance;
  if (codeUnits && !swaps && insertCost === 1 && deleteCost === 1 && replaceCost === 1 && Math.min(m, n) <= 32) {
    const trimmedA = a.slice(start, endA);
    const trimmedB = b.slice(start, endB);
    // levenshtein is symmetric under unit costs, so the shorter side patterns
    distance = (m <= n) ? bitDistance(trimmedA, trimmedB) : bitDistance(trimmedB, trimmedA);
    if (distance > max) {
      distance = Infinity;
    }
  }
  else {
    const dpA = codeUnits ? toCharCodes(a, start, endA) : seqA.slice(start, endA);
    const dpB = codeUnits ? toCharCodes(b, start, endB) : seqB.slice(start, endB);
    distance = dpDistance(dpA, dpB, { insertCost, deleteCost, replaceCost, swaps, swapCost, max });
  }
  return { distance, length };
};

/*
  How many single-character edits (inserts, deletes, replacements, and with
  swaps on, adjacent swaps) turn one string into the other. 0 means identical.
  Compares Unicode code points after NFC normalization by default, grapheme
  clusters with grapheme: true. max caps the search and returns Infinity once
  the distance provably exceeds it, the cheap-rejection shape a fuzzy-match
  loop wants. Per-operation costs are options, so the metric bends to the
  weighted variants (replaceCost: 2 reads as insert/delete-only distance).
  For a normalized 0..1 score, use similarity.
*/
export const editDistance = (a, b, options = {}) => {
  return computeDistance(a, b, options).distance;
};

/*
  How alike two strings read, 0..1, where 1 is identical: 1 - editDistance over
  the longer string's length. min is a score floor that lets the comparison
  stop early and report 0. Unit edit costs by definition, and the same text
  options as editDistance (ignoreCase, normalize, grapheme, locale, swaps)
*/
export const similarity = (a, b, options = {}) => {
  const { min = 0, ignoreCase, normalize, grapheme, locale, swaps } = options;
  const { distance, length } = computeDistance(a, b, { ignoreCase, normalize, grapheme, locale, swaps, minScore: min });
  if (distance === 0) {
    return 1;
  }
  if (distance === Infinity) {
    return 0;
  }
  return 1 - distance / length;
};

// the shapes callers hold a vocabulary in: an array or Set of names, a lone
// name, or the keys of a plain object or Map (a config's options, a registry)
const listCandidates = (candidates) => {
  if (isArray(candidates)) {
    return candidates;
  }
  if (isString(candidates)) {
    return [candidates];
  }
  if (isMap(candidates)) {
    return [...candidates.keys()];
  }
  if (isPlainObject(candidates)) {
    return Object.keys(candidates);
  }
  if (isIterable(candidates)) {
    return [...candidates];
  }
  return [];
};

/*
  The nearest candidate to a mistyped word, or null when nothing reads close
  enough to say confidently — the lookup behind a did-you-mean teaching
  message. Returns the candidate verbatim, never prose, so the caller owns the
  sentence around it. threshold is the minimum similarity to suggest (0..1, so
  it scales with word length), and case differences and adjacent swaps read as
  typos by default. Ties keep the earlier candidate, so order candidates by
  preference when it matters. count asks for the plausible candidates as an
  array, best-first, up to count of them, [] when none — same confidence gate,
  this is the judgment call, not the ruler. To rank everything under an
  explicit edit cap, filter with editDistance and max instead
*/
export const suggest = (word, candidates, options = {}) => {
  const { threshold = 0.6, ignoreCase = true, swaps = true, count } = options;
  const names = listCandidates(candidates);

  if (isNumber(count) && !Number.isNaN(count)) {
    const seen = new Set();
    const scored = [];
    for (const candidate of names) {
      if (candidate == null) {
        continue;
      }
      const name = String(candidate);
      if (seen.has(name)) {
        continue;
      }
      seen.add(name);
      const score = similarity(word, name, { ignoreCase, swaps, min: threshold });
      if (score >= threshold && score > 0) {
        scored.push({ name, score });
      }
    }
    // stable sort, so equal scores keep candidate order like the singular's ties
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, Math.max(0, count)).map((entry) => entry.name);
  }

  let best = null;
  let bestScore = 0;
  for (const candidate of names) {
    if (candidate == null) {
      continue;
    }
    const name = String(candidate);
    // the running best tightens the floor, so weaker candidates bail early
    const score = similarity(word, name, { ignoreCase, swaps, min: Math.max(threshold, bestScore) });
    if (score >= threshold && score > bestScore) {
      best = name;
      bestScore = score;
      if (score === 1) {
        break;
      }
    }
  }
  return best;
};

import { capitalize } from './strings.js';
import { toTitleCase } from './to-title-case.js';
import { isString } from './types.js';

/*-------------------
      Humanize
--------------------*/

// lives in its own module so the attribute codec path that imports strings.js never carries the
// vocabulary. the config assignment below is a side effect bundlers keep once a module is entered

// split an identifier into words: acronym runs stay whole (getHTTPResponse -> get, HTTP, Response),
// a plural acronym keeps its trailing s (userIDs -> user, IDs), and caseless scripts keep their
// combining marks so vocalized Devanagari/Arabic/Hebrew/Thai don't shatter per codepoint
const HUMANIZE_WORD_RE =
  /\p{Lu}{2,}s(?![\p{Ll}\p{M}])|\p{Lu}+(?=\p{Lu}\p{Ll})|[\p{Lu}\p{Lt}]?[\p{Ll}\p{Lm}\p{M}]+|\p{Lu}+|[\p{Lo}\p{Lm}\p{M}]+|\p{N}+/gu;

const PLURAL_ACRONYM_RE = /^\p{Lu}{2,}s$/u;

const isAcronym = (word) =>
  (word.length > 1 && word === word.toUpperCase() && word !== word.toLowerCase()) || PLURAL_ACRONYM_RE.test(word);

export const humanize = (str = '', options = {}) => {
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
};

// global defaults plus a token vocabulary, seeded with the highest-frequency lowercase acronyms.
// extend once at app boot (humanize.config.terms.sku = 'SKU') and every call inherits it
humanize.config = {
  titleCase: false,
  dropId: true,
  constantCase: false,
  terms: { id: 'ID', url: 'URL', api: 'API' },
};

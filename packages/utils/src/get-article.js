import { capitalize } from './strings.js';

/*-------------------
      Articles
--------------------*/

// lives in its own module so the attribute codec path that imports strings.js never carries the
// vocabulary. the config assignment below is a side effect bundlers keep once a module is entered

const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

export const getArticle = (word, settings = {}) => {
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
};

// words whose sound contradicts their spelling, where the vowel heuristic reads them wrong.
// extend once at app boot (getArticle.config.exceptions.faq = 'an') and every call inherits it
getArticle.config = {
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
};

import {
  camelToKebab,
  capitalize,
  capitalizeWords,
  editDistance,
  escapeHTML,
  getArticle,
  humanize,
  joinWords,
  kebabToCamel,
  reverseString,
  similarity,
  suggest,
  tokenize,
  toTitleCase,
  truncate,
  unescapeHTML,
} from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('String Utilities', () => {
  it('should convert kebab-case to camelCase with lossless encoding by default', () => {
    expect(kebabToCamel('test-string')).toBe('testString');
    expect(kebabToCamel('background-color')).toBe('backgroundColor');
    expect(kebabToCamel('grid-2x2')).toBe('grid_2x2');
    expect(kebabToCamel('heading-1')).toBe('heading_1');
    expect(kebabToCamel('arrow-down-a-z')).toBe('arrowDownAZ');
    expect(kebabToCamel('a-large-small')).toBe('aLargeSmall');
  });

  it('should convert camelCase to kebab-case with lossless decoding by default', () => {
    expect(camelToKebab('testString')).toBe('test-string');
    expect(camelToKebab('backgroundColor')).toBe('background-color');
    expect(camelToKebab('grid_2x2')).toBe('grid-2x2');
    expect(camelToKebab('heading_1')).toBe('heading-1');
    expect(camelToKebab('step_1Of_3')).toBe('step-1-of-3');
  });

  it('should round-trip attr → prop → attr', () => {
    const attrs = [
      'arrow-down',
      'text-cursor-input',
      'wifi-off',
      'background-color',
      'grid-2x2',
      'grid-3x3',
      'heading-1',
      'heading-6',
      'volume-2',
      'columns-3',
      'arrow-down-a-z',
      'a-large-small',
      'a-arrow-up',
      'sort-a-z',
      'a-z',
      'step-1-of-3',
      'layer-2-opacity',
      'gap-x-4',
      'icon-arrow-up-1-0',
      'aria-label',
      'data-test-id',
    ];
    for (const attr of attrs) {
      expect(camelToKebab(kebabToCamel(attr))).toBe(attr);
    }
  });

  it('should round-trip prop → attr → prop', () => {
    const props = [
      'arrowDown',
      'backgroundColor',
      'textCursorInput',
      'wifiOff',
      'fontSize',
      'tabIndex',
      'isDisabled',
      'onChange',
      'grid_2x2',
      'heading_1',
      'columns_3',
      'step_1Of_3',
    ];
    for (const prop of props) {
      expect(kebabToCamel(camelToKebab(prop))).toBe(prop);
    }
  });

  it('should support a custom separator', () => {
    const opts = { separator: '$' };
    expect(kebabToCamel('grid-2x2', opts)).toBe('grid$2x2');
    expect(camelToKebab('grid$2x2', opts)).toBe('grid-2x2');
  });

  it('should handle empty segments from consecutive or trailing hyphens', () => {
    expect(kebabToCamel('foo--bar')).toBe('fooBar');
    expect(kebabToCamel('foo-')).toBe('foo');
    expect(kebabToCamel('--foo')).toBe('Foo');
    expect(kebabToCamel('')).toBe('');
  });

  it('should silently lowercase leading PascalCase by default', () => {
    expect(camelToKebab('FooBar')).toBe('foo-bar');
    expect(camelToKebab('BackgroundColor')).toBe('background-color');
  });

  it('should preserve leading uppercase in lossless mode for exact round-trip', () => {
    expect(camelToKebab('FooBar', { lossless: true })).toBe('-foo-bar');
    expect(kebabToCamel(camelToKebab('FooBar', { lossless: true }))).toBe('FooBar');
  });

  it('should capitalize the first letter of each word', () => {
    expect(capitalizeWords('test string')).toBe('Test String');
  });

  it('should convert a string to title case', () => {
    expect(toTitleCase('a simple test')).toBe('A Simple Test');
  });

  it('should handle stopwords in title case (not capitalize stopwords except first word)', () => {
    expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    expect(toTitleCase('a tale of two cities')).toBe('A Tale of Two Cities');
    expect(toTitleCase('the lord of the rings')).toBe('The Lord of the Rings');
  });

  describe('joinWords', () => {
    it('should join words with default settings', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words)).toBe('apple, banana, and cherry');
    });

    it('should handle an empty array', () => {
      expect(joinWords([])).toBe('');
    });

    it('should handle a single word', () => {
      expect(joinWords(['apple'])).toBe('apple');
    });

    it('should handle two words', () => {
      expect(joinWords(['apple', 'banana'])).toBe('apple and banana');
    });

    it('should use custom separator', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { separator: '; ' })).toBe('apple; banana; and cherry');
    });

    it('should use custom last separator', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { lastSeparator: ' or ' })).toBe('apple, banana, or cherry');
    });

    it('should not use Oxford comma when specified', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { oxford: false })).toBe('apple, banana and cherry');
    });

    it('should add quotes when specified', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { quotes: true })).toBe('"apple", "banana", and "cherry"');
    });

    it('should apply transform function when provided', () => {
      const words = ['apple', 'banana', 'cherry'];
      const transform = (word) => word.toUpperCase();
      expect(joinWords(words, { transform })).toBe('APPLE, BANANA, and CHERRY');
    });

    it('should handle complex configuration', () => {
      const words = ['apple', 'banana', 'cherry', 'date'];
      const options = {
        separator: '; ',
        lastSeparator: ' or ',
        oxford: false,
        quotes: true,
        transform: (word) => word.charAt(0).toUpperCase() + word.slice(1),
      };
      expect(joinWords(words, options)).toBe('"Apple"; "Banana"; "Cherry" or "Date"');
    });

    it('should handle non-array input', () => {
      expect(joinWords('not an array')).toBe('');
    });

    it('should handle array with falsy values', () => {
      const words = ['apple', '', null, 'banana', undefined, 'cherry'];
      expect(joinWords(words)).toBe('apple, , , banana, , and cherry');
    });
  });

  describe('getArticle', () => {
    it('should return "an" for words starting with vowels', () => {
      expect(getArticle('apple')).toBe('an');
      expect(getArticle('elephant')).toBe('an');
      expect(getArticle('igloo')).toBe('an');
      expect(getArticle('orange')).toBe('an');
      expect(getArticle('umbrella')).toBe('an');
    });

    it('should return "a" for words starting with consonants', () => {
      expect(getArticle('banana')).toBe('a');
      expect(getArticle('cat')).toBe('a');
      expect(getArticle('dog')).toBe('a');
    });

    it('should capitalize the article when capitalize option is true', () => {
      expect(getArticle('apple', { capitalize: true })).toBe('An');
      expect(getArticle('banana', { capitalize: true })).toBe('A');
    });

    it('should include the word when includeWord option is true', () => {
      expect(getArticle('apple', { includeWord: true })).toBe('an apple');
      expect(getArticle('banana', { includeWord: true })).toBe('a banana');
    });

    it('should combine capitalize and includeWord options', () => {
      expect(getArticle('apple', { capitalize: true, includeWord: true })).toBe('An apple');
      expect(getArticle('banana', { capitalize: true, includeWord: true })).toBe('A banana');
    });

    it('should handle uppercase words', () => {
      expect(getArticle('APPLE')).toBe('an');
      expect(getArticle('BANANA')).toBe('a');
    });

    it('reads sound-contradicts-spelling words from the exceptions vocabulary', () => {
      expect(getArticle('hour')).toBe('an');
      expect(getArticle('honest')).toBe('an');
      expect(getArticle('university')).toBe('a');
      expect(getArticle('one')).toBe('a');
    });

    it('reads inherited Object members as ordinary words, not exceptions', () => {
      expect(getArticle('constructor')).toBe('a');
    });

    it('extends via getArticle.config.exceptions, set once and inherited', () => {
      getArticle.config.exceptions.faq = 'an';
      try {
        expect(getArticle('FAQ', { includeWord: true })).toBe('an FAQ');
      }
      finally {
        delete getArticle.config.exceptions.faq;
      }
    });
  });

  describe('truncate', () => {
    it('should return original text if shorter than length', () => {
      expect(truncate('short', 10)).toBe('short');
    });

    it('should return original text if exactly equal to length', () => {
      expect(truncate('exactly10c', 10)).toBe('exactly10c');
    });

    it('should truncate text longer than length with default suffix', () => {
      expect(truncate('This is a long text that should be truncated', 20)).toBe('This is a long text…');
    });

    it('should truncate at word boundary by default', () => {
      expect(truncate('This is a very long sentence', 15)).toBe('This is a very…');
    });

    it('should disable word boundary when specified', () => {
      // Hard cut at the character limit, even if it falls mid-word
      expect(truncate('Abcdefghij klmnop', 14, { wordBoundary: false })).toBe('Abcdefghij kl…');
    });

    it('should truncate at punctuation boundaries (comma, period, etc)', () => {
      expect(truncate('Hello, world. How are you?', 15)).toBe('Hello, world.…');
      expect(truncate('First-second-third-fourth', 15)).toBe('First-second-…');
      expect(truncate('Test (with parentheses)', 15)).toBe('Test (with…');
      expect(truncate('One; two: three!', 12)).toBe('One; two:…');
    });

    it('should use a custom suffix and trim trailing space', () => {
      // CORRECTED: Expects 'This is [more]' (length 14), which honors the max length of 15.
      // The trailing space after 'is' is correctly trimmed.
      expect(truncate('This is a test string', 15, { suffix: ' [more]' })).toBe('This is [more]');
    });

    it('should handle empty or null text', () => {
      expect(truncate('', 10)).toBe('');
      expect(truncate(null, 10)).toBe('');
      expect(truncate(undefined, 10)).toBe('');
    });

    it('should handle text with no spaces when word boundary is enabled', () => {
      // CORRECTED: Expects the longest possible string within the length limit.
      // 'verylongtextwi…' has a length of 15.
      expect(truncate('verylongtextwithoutspaces', 15)).toBe('verylongtextwi…');
    });

    it('should account for suffix length in truncation', () => {
      // CORRECTED: Expects 'Thi [more]' (length 10), honoring the max length of 10.
      expect(truncate('This is a test', 10, { suffix: ' [more]' })).toBe('Thi [more]');
    });

    it('should properly truncate emoji and combined graphemes', () => {
      expect(truncate('👍👍👍👍👍', 4)).toBe('👍👍👍…'); // Doesn't split emoji
    });

    it('should respect locale-aware boundaries when using Intl.Segmenter', () => {
      // Example: Japanese text (no spaces)
      expect(truncate('これはとても長い文です', 8, { locale: 'ja' })).toBe('これはとても…');
    });
  });

  describe('reverseString', () => {
    it('should reverse a simple string', () => {
      expect(reverseString('hello')).toBe('olleh');
      expect(reverseString('world')).toBe('dlrow');
    });

    it('should reverse a string with spaces', () => {
      expect(reverseString('hello world')).toBe('dlrow olleh');
    });

    it('should handle empty strings', () => {
      expect(reverseString('')).toBe('');
      expect(reverseString()).toBe('');
    });

    it('should handle single character strings', () => {
      expect(reverseString('a')).toBe('a');
      expect(reverseString('X')).toBe('X');
    });

    it('should properly handle Unicode characters and emojis', () => {
      expect(reverseString('Hello 👋')).toBe('👋 olleH');
      expect(reverseString('🎉🎊🎈')).toBe('🎈🎊🎉');
    });

    it('should handle complex grapheme clusters with Intl.Segmenter', () => {
      // Emoji with skin tone modifier
      expect(reverseString('Hello 👋🏽')).toBe('👋🏽 olleH');

      // Flag emojis (regional indicator symbols)
      expect(reverseString('🇺🇸🇬🇧')).toBe('🇬🇧🇺🇸');

      // Combined diacritics
      expect(reverseString('café')).toBe('éfac');

      // Zero-width joiner sequences (family emoji)
      expect(reverseString('AB👨‍👩‍👧CD')).toBe('DC👨‍👩‍👧BA');
    });

    it('should handle numbers in strings', () => {
      expect(reverseString('12345')).toBe('54321');
      expect(reverseString('abc123')).toBe('321cba');
    });

    it('should handle special characters', () => {
      expect(reverseString('a!b@c#')).toBe('#c@b!a');
      expect(reverseString('test-string_123')).toBe('321_gnirts-tset');
    });

    it('should handle palindromes correctly', () => {
      expect(reverseString('racecar')).toBe('racecar');
      expect(reverseString('noon')).toBe('noon');
    });

    it('should handle strings with only spaces', () => {
      expect(reverseString('   ')).toBe('   ');
    });

    it('should handle mixed case strings', () => {
      expect(reverseString('HeLLo WoRLd')).toBe('dLRoW oLLeH');
    });

    it('should respect locale option for international text', () => {
      // Japanese text
      expect(reverseString('こんにちは', { locale: 'ja' })).toBe('はちにんこ');
    });
  });
});

describe('capitalize', () => {
  it('should capitalize the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should leave already-capitalized strings unchanged', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('toTitleCase — edge cases', () => {
  it('should return undefined for non-string input', () => {
    expect(toTitleCase(42)).toBeUndefined();
    expect(toTitleCase(null)).toBeUndefined();
  });

  it('should handle single word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('should capitalize last word even if stopword', () => {
    expect(toTitleCase('living in the')).toBe('Living in The');
  });

  it('reads its stop words from toTitleCase.config, shared with humanize titleCase', () => {
    toTitleCase.config.stopWords.push('versus');
    try {
      expect(toTitleCase('cats versus dogs today')).toBe('Cats versus Dogs Today');
      expect(humanize('cats_versus_dogs_today', { titleCase: true })).toBe('Cats versus Dogs Today');
    }
    finally {
      toTitleCase.config.stopWords.pop();
    }
    expect(toTitleCase('cats versus dogs today')).toBe('Cats Versus Dogs Today');
  });
});

describe('escapeHTML / unescapeHTML', () => {
  it('should escape single quotes (apostrophes)', () => {
    expect(escapeHTML("it's")).toBe('it&#39;s');
  });

  it('should escape ampersands', () => {
    expect(escapeHTML('rock & roll')).toBe('rock &amp; roll');
  });

  it('should round-trip all special characters', () => {
    const original = '<div class="test">&\'value\'</div>';
    expect(unescapeHTML(escapeHTML(original))).toBe(original);
  });
});

describe('tokenize', () => {
  it('lowercases and hyphen-joins words', () => {
    expect(tokenize('Hello World')).toBe('hello-world');
    expect(tokenize('A simple-test_string')).toBe('a-simple-test-string');
  });

  it('strips special characters', () => {
    expect(tokenize('Hello! @World #2024')).toBe('hello-world-2024');
  });

  it('collapses runs of whitespace into one hyphen', () => {
    expect(tokenize('hello   world')).toBe('hello-world');
  });

  it('converts underscores to hyphens', () => {
    expect(tokenize('some_thing')).toBe('some-thing');
  });

  it('returns an empty string for null, undefined, and empty input', () => {
    expect(tokenize(null)).toBe('');
    expect(tokenize(undefined)).toBe('');
    expect(tokenize('')).toBe('');
  });
});

describe('humanize', () => {
  it('humanizes snake, kebab, camel, and Pascal identifiers', () => {
    expect(humanize('first_name')).toBe('First name');
    expect(humanize('user-profile')).toBe('User profile');
    expect(humanize('createdAt')).toBe('Created at');
    expect(humanize('EmployeeSalary')).toBe('Employee salary');
  });

  it('keeps acronym runs intact', () => {
    expect(humanize('getHTTPResponse')).toBe('Get HTTP response');
    expect(humanize('parseXMLToJSON')).toBe('Parse XML to JSON');
    expect(humanize('IOError')).toBe('IO error');
  });

  it('preserves a leading acronym', () => {
    expect(humanize('URLParser')).toBe('URL parser');
  });

  it('splits letter and digit boundaries', () => {
    expect(humanize('address_line_1')).toBe('Address line 1');
    expect(humanize('phone2')).toBe('Phone 2');
  });

  it('drops a trailing id segment by default', () => {
    expect(humanize('user_id')).toBe('User');
    expect(humanize('productID')).toBe('Product');
    expect(humanize('order-id')).toBe('Order');
  });

  it('never drops id when it is the only word', () => {
    expect(humanize('id')).toBe('ID');
  });

  it('only drops a standalone id, not id inside a word', () => {
    expect(humanize('valid')).toBe('Valid');
    expect(humanize('uuid')).toBe('Uuid');
    expect(humanize('user_ids')).toBe('User ids');
  });

  it('keeps the id segment when dropId is false', () => {
    expect(humanize('user_id', { dropId: false })).toBe('User ID');
  });

  it('title-cases with stop words when titleCase is set', () => {
    expect(humanize('employee_salary', { titleCase: true })).toBe('Employee Salary');
    expect(humanize('terms_of_service', { titleCase: true })).toBe('Terms of Service');
    expect(humanize('getHTTPResponse', { titleCase: true })).toBe('Get HTTP Response');
  });

  it('preserves shouting acronyms by default but sentence-cases them with constantCase', () => {
    expect(humanize('IN_PROGRESS')).toBe('IN PROGRESS');
    expect(humanize('IN_PROGRESS', { constantCase: true })).toBe('In progress');
    expect(humanize('FIRST_NAME', { constantCase: true })).toBe('First name');
    expect(humanize('USER_ID', { constantCase: true })).toBe('User');
    expect(humanize('MAX_RETRIES', { constantCase: true, titleCase: true })).toBe('Max Retries');
  });

  it('normalizes already-spaced and mixed-case input', () => {
    expect(humanize('First Name')).toBe('First name');
    expect(humanize('  spaced   out  ')).toBe('Spaced out');
  });

  it('keeps plural acronyms intact', () => {
    expect(humanize('URLs')).toBe('URLs');
    expect(humanize('getURLs')).toBe('Get URLs');
    expect(humanize('userIDs')).toBe('User IDs');
    expect(humanize('parsePDFs')).toBe('Parse PDFs');
    expect(humanize('UUIDs')).toBe('UUIDs');
  });

  it('preserves accented and caseless letters', () => {
    expect(humanize('café_table')).toBe('Café table');
    expect(humanize('東京_station')).toBe('東京 station');
  });

  it('keeps combining-mark scripts and modifier letters whole', () => {
    expect(humanize('हिन्दी')).toBe('हिन्दी');
    expect(humanize('مُحَمَّد')).toBe('مُحَمَّد');
    expect(humanize('Iʻll')).toBe('Iʻll');
  });

  it('is independent of unicode normalization form', () => {
    expect(humanize('café'.normalize('NFD'))).toBe('Café');
  });

  it('returns an empty string for empty, separator-only, and non-string input', () => {
    expect(humanize('')).toBe('');
    expect(humanize('___')).toBe('');
    expect(humanize(null)).toBe('');
    expect(humanize(undefined)).toBe('');
    expect(humanize(42)).toBe('');
  });

  it('rescues common lowercase acronyms (id, url, api) by default', () => {
    expect(humanize('api_url')).toBe('API URL');
    expect(humanize('image_url')).toBe('Image URL');
    expect(humanize('id_card')).toBe('ID card');
  });

  it('matches the whole token, never a substring', () => {
    expect(humanize('valid')).toBe('Valid');
    expect(humanize('curl_command')).toBe('Curl command');
  });

  it('reads inherited Object members as ordinary words, not term overrides', () => {
    expect(humanize('constructor')).toBe('Constructor');
    expect(humanize('toString')).toBe('To string');
  });

  it('layers per-call terms over the default vocabulary', () => {
    expect(humanize('oauth_api', { terms: { oauth: 'OAuth' } })).toBe('OAuth API');
  });

  it('reads humanize.config for set-once-forget customization', () => {
    const savedTerms = humanize.config.terms;
    humanize.config.terms = { ...savedTerms, sku: 'SKU' };
    try {
      expect(humanize('product_sku')).toBe('Product SKU');
    }
    finally {
      humanize.config.terms = savedTerms;
    }
  });
});

describe('editDistance', () => {
  // full-matrix Wagner-Fischer with the OSA swap extension, the slow reference
  // the optimized engines are fuzzed against
  const referenceDistance = (a, b, options = {}) => {
    const {
      swaps = false,
      insertCost = 1,
      deleteCost = 1,
      replaceCost = 1,
      swapCost = 1,
    } = options;
    a = Array.from(a);
    b = Array.from(b);
    const m = a.length;
    const n = b.length;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) {
      d[i][0] = i * deleteCost;
    }
    for (let j = 0; j <= n; j++) {
      d[0][j] = j * insertCost;
    }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        let cost = Math.min(
          d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : replaceCost),
          d[i - 1][j] + deleteCost,
          d[i][j - 1] + insertCost,
        );
        if (swaps && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          cost = Math.min(cost, d[i - 2][j - 2] + swapCost);
        }
        d[i][j] = cost;
      }
    }
    return d[m][n];
  };

  // deterministic LCG so fuzz failures reproduce
  let lcgSeed = 42;
  const rand = (limit) => {
    lcgSeed = (lcgSeed * 1103515245 + 12345) % 2147483648;
    return lcgSeed % limit;
  };
  const randomString = (alphabet, maxLength) => {
    const length = rand(maxLength + 1);
    let out = '';
    for (let i = 0; i < length; i++) {
      out += alphabet[rand(alphabet.length)];
    }
    return out;
  };

  it('counts single-character edits', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('saturday', 'sunday')).toBe(3);
    expect(editDistance('flaw', 'lawn')).toBe(2);
    expect(editDistance('banana', 'orange')).toBe(5);
  });

  it('returns 0 for identical strings', () => {
    expect(editDistance('hello', 'hello')).toBe(0);
    expect(editDistance('', '')).toBe(0);
  });

  it('is symmetric under default costs', () => {
    expect(editDistance('kitten', 'sitting')).toBe(editDistance('sitting', 'kitten'));
    expect(editDistance('abc', '')).toBe(editDistance('', 'abc'));
  });

  it('handles empty strings as pure insertions or deletions', () => {
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('abc', '')).toBe(3);
  });

  it('treats nullish as empty and stringifies other input', () => {
    expect(editDistance(null, 'ab')).toBe(2);
    expect(editDistance(undefined, undefined)).toBe(0);
    expect(editDistance(42, '42')).toBe(0);
    expect(editDistance(true, 'true')).toBe(0);
  });

  it('supports ignoreCase', () => {
    expect(editDistance('Color', 'colour')).toBe(2);
    expect(editDistance('Color', 'colour', { ignoreCase: true })).toBe(1);
    expect(editDistance('ABC', 'abc', { ignoreCase: true })).toBe(0);
  });

  it('normalizes canonically equivalent spellings by default', () => {
    expect(editDistance('café', 'café')).toBe(0);
    expect(editDistance('café', 'café', { normalize: false })).toBe(2);
  });

  it('compares code points, not code units, when astral characters are present', () => {
    expect(editDistance('👍', '👎')).toBe(1);
    expect(editDistance('a👍b', 'ab')).toBe(1);
    expect(editDistance('👍', '')).toBe(1);
  });

  it('compares grapheme clusters with grapheme: true', () => {
    expect(editDistance('👩🏽‍🚀', '🧑🏻‍🚀')).toBe(2);
    expect(editDistance('👩🏽‍🚀', '🧑🏻‍🚀', { grapheme: true })).toBe(1);
    expect(editDistance('🇺🇸', '', { grapheme: true })).toBe(1);
  });

  it('caps the search with max, returning Infinity beyond it', () => {
    expect(editDistance('banana', 'orange', { max: 2 })).toBe(Infinity);
    expect(editDistance('banana', 'orange', { max: 5 })).toBe(5);
    expect(editDistance('kitten', 'sitting', { max: 3 })).toBe(3);
    expect(editDistance('abc', 'abc', { max: 0 })).toBe(0);
    expect(editDistance('abc', 'abd', { max: 0 })).toBe(Infinity);
  });

  it('rejects on length difference alone under max', () => {
    expect(editDistance('ab', 'a'.repeat(100), { max: 3 })).toBe(Infinity);
  });

  it('treats a non-numeric max as no cap', () => {
    expect(editDistance('abc', 'xyz', { max: NaN })).toBe(3);
    expect(editDistance('abc', 'xyz', { max: '2' })).toBe(3);
  });

  it('counts adjacent swaps as one edit with swaps: true', () => {
    expect(editDistance('teh', 'the')).toBe(2);
    expect(editDistance('teh', 'the', { swaps: true })).toBe(1);
    expect(editDistance('recieve', 'receive', { swaps: true })).toBe(1);
    expect(editDistance('ab', 'ba', { swaps: true })).toBe(1);
  });

  it('uses the restricted (OSA) swap reading, never editing a swapped pair again', () => {
    expect(editDistance('ca', 'abc', { swaps: true })).toBe(3);
  });

  it('supports weighted operation costs', () => {
    expect(editDistance('abc', 'ab', { deleteCost: 5 })).toBe(5);
    expect(editDistance('ab', 'abc', { deleteCost: 5 })).toBe(1);
    expect(editDistance('a', 'b', { replaceCost: 3 })).toBe(2);
    expect(editDistance('abc', 'adc', { replaceCost: 3 })).toBe(2);
    expect(editDistance('a', 'b', { replaceCost: 2 })).toBe(2);
    expect(editDistance('ab', 'ba', { swaps: true, swapCost: 0.5 })).toBe(0.5);
  });

  it('throws on negative costs', () => {
    expect(() => editDistance('a', 'b', { insertCost: -1 })).toThrow();
    expect(() => editDistance('a', 'b', { swapCost: -0.5 })).toThrow();
  });

  it('crosses the 32-unit bit-parallel boundary correctly', () => {
    const base = 'abcdefghijklmnopqrstuvwxyzabcdef';
    expect(base).toHaveLength(32);
    expect(editDistance(base, base.slice(0, 31) + 'x')).toBe(1);
    expect(editDistance(base + 'g', base)).toBe(1);
    expect(editDistance(base + 'g', base + 'h')).toBe(1);
    expect(editDistance('x'.repeat(40), 'y'.repeat(40))).toBe(40);
  });

  it('matches a reference implementation on random inputs', () => {
    for (let i = 0; i < 800; i++) {
      const alphabet = i % 2 === 0 ? ['a', 'b'] : ['a', 'b', 'c', 'd'];
      const a = randomString(alphabet, 12);
      const b = randomString(alphabet, 12);
      const swaps = rand(2) === 1;
      expect(editDistance(a, b, { swaps }), `"${a}" vs "${b}" swaps ${swaps}`)
        .toBe(referenceDistance(a, b, { swaps }));
    }
  });

  it('matches a reference implementation on random weighted costs', () => {
    const costs = [0.5, 1, 2, 3];
    for (let i = 0; i < 400; i++) {
      const options = {
        swaps: rand(2) === 1,
        insertCost: costs[rand(4)],
        deleteCost: costs[rand(4)],
        replaceCost: costs[rand(4)],
        swapCost: costs[rand(4)],
      };
      const a = randomString(['a', 'b', 'c'], 10);
      const b = randomString(['a', 'b', 'c'], 10);
      expect(editDistance(a, b, options), `"${a}" vs "${b}" ${JSON.stringify(options)}`)
        .toBe(referenceDistance(a, b, options));
    }
  });

  it('matches a reference implementation under a max cap', () => {
    for (let i = 0; i < 400; i++) {
      const a = randomString(['a', 'b', 'c'], 12);
      const b = randomString(['a', 'b', 'c'], 12);
      const swaps = rand(2) === 1;
      const max = rand(6);
      const expected = referenceDistance(a, b, { swaps });
      expect(editDistance(a, b, { swaps, max }), `"${a}" vs "${b}" max ${max} swaps ${swaps}`)
        .toBe(expected > max ? Infinity : expected);
    }
  });

  it('matches a reference implementation on long strings past the bit-parallel path', () => {
    for (let i = 0; i < 60; i++) {
      const a = randomString(['a', 'b', 'c', 'd', 'e'], 45);
      const b = randomString(['a', 'b', 'c', 'd', 'e'], 45);
      expect(editDistance(a, b), `"${a}" vs "${b}"`).toBe(referenceDistance(a, b));
    }
  });
});

describe('similarity', () => {
  it('scores 0..1 against the longer string', () => {
    expect(similarity('kitten', 'sitting')).toBeCloseTo(1 - 3 / 7, 10);
    expect(similarity('abc', 'xyz')).toBe(0);
    expect(similarity('ab', 'abcd')).toBeCloseTo(0.5, 10);
  });

  it('returns 1 for identical strings, including empty', () => {
    expect(similarity('hello', 'hello')).toBe(1);
    expect(similarity('', '')).toBe(1);
    expect(similarity(null, undefined)).toBe(1);
  });

  it('returns 0 when one string is empty', () => {
    expect(similarity('abc', '')).toBe(0);
    expect(similarity('', 'abc')).toBe(0);
  });

  it('supports the shared text options', () => {
    expect(similarity('JavaScript', 'javascript', { ignoreCase: true })).toBe(1);
    expect(similarity('café', 'café')).toBe(1);
    expect(similarity('teh', 'the', { swaps: true })).toBeCloseTo(1 - 1 / 3, 10);
  });

  it('stops early below the min floor and reports 0', () => {
    expect(similarity('abc', 'xyz', { min: 0.7 })).toBe(0);
    expect(similarity('kitten', 'sitting', { min: 0.9 })).toBe(0);
    expect(similarity('kitten', 'sitting', { min: 0.5 })).toBeCloseTo(1 - 3 / 7, 10);
  });

  it('returns a boundary-exact score at min, not 0', () => {
    expect(similarity('aaaaaaaaaa', 'aaaaaaaaab', { min: 0.9 })).toBeCloseTo(0.9, 10);
  });

  it('scores graphemes as units with grapheme: true', () => {
    expect(similarity('👩🏽‍🚀', '🧑🏻‍🚀', { grapheme: true })).toBe(0);
    expect(similarity('👩🏽‍🚀x', '🧑🏻‍🚀x', { grapheme: true })).toBeCloseTo(0.5, 10);
  });
});

describe('suggest', () => {
  it('returns the nearest candidate', () => {
    expect(suggest('stirng', ['string', 'number', 'boolean'])).toBe('string');
    expect(suggest('bolean', ['string', 'number', 'boolean'])).toBe('boolean');
  });

  it('returns null when nothing reads close enough', () => {
    expect(suggest('xyz', ['string', 'number'])).toBe(null);
    expect(suggest('q', ['string', 'number'])).toBe(null);
  });

  it('a later, strictly closer candidate replaces an earlier one', () => {
    expect(suggest('recieve', ['recede', 'receive'])).toBe('receive');
  });

  it('ties keep the earlier candidate', () => {
    expect(suggest('teh', ['the', 'tea'])).toBe('the');
    expect(suggest('teh', ['tea', 'the'])).toBe('tea');
  });

  it('reads case differences as typos by default, returning the candidate verbatim', () => {
    expect(suggest('FORCE', ['force', 'quiet'])).toBe('force');
    expect(suggest('FORCE', ['force'], { ignoreCase: false })).toBe(null);
  });

  it('reads adjacent swaps as typos by default', () => {
    expect(suggest('sroted', ['sorted', 'sordid'])).toBe('sorted');
    expect(suggest('teh', ['the', 'tea'], { swaps: false })).toBe('tea');
  });

  it('returns an exact candidate as-is', () => {
    expect(suggest('force', ['force', 'quiet'])).toBe('force');
  });

  it('threshold tightens or loosens the suggestion bar', () => {
    expect(suggest('kitten', ['sitting'])).toBe(null);
    expect(suggest('kitten', ['sitting'], { threshold: 0.5 })).toBe('sitting');
    expect(suggest('stirng', ['string'], { threshold: 0.9 })).toBe(null);
  });

  it('threshold 0 returns the nearest candidate sharing anything at all', () => {
    expect(suggest('zzz', ['abc', 'zbc'], { threshold: 0 })).toBe('zbc');
    expect(suggest('zzz', ['abc'], { threshold: 0 })).toBe(null);
  });

  it('reads a plain object or Map as its keys', () => {
    expect(suggest('colr', { color: '#f00', size: 'large' })).toBe('color');
    expect(suggest('colr', new Map([['color', 1], ['size', 2]]))).toBe('color');
  });

  it('reads a Set, a lone string, and any iterable', () => {
    expect(suggest('colr', new Set(['color', 'size']))).toBe('color');
    expect(suggest('colr', 'color')).toBe('color');
    function* names() {
      yield 'color';
      yield 'size';
    }
    expect(suggest('colr', names())).toBe('color');
  });

  it('skips nullish candidates and stringifies the rest', () => {
    expect(suggest('colr', ['color', null, undefined])).toBe('color');
    expect(suggest('41', [42, 41])).toBe('41');
  });

  it('handles empty and nullish input', () => {
    expect(suggest('word', [])).toBe(null);
    expect(suggest('word', null)).toBe(null);
    expect(suggest(null, ['null'])).toBe(null);
    expect(suggest('', ['color'])).toBe(null);
  });
});

describe('suggest — count', () => {
  it('count returns the plausible candidates as an array, best-first', () => {
    expect(suggest('stirng', ['strong', 'string', 'number'], { count: 5 })).toEqual(['string', 'strong']);
  });

  it('count caps the list length', () => {
    expect(suggest('stirng', ['strong', 'string', 'number'], { count: 1 })).toEqual(['string']);
    expect(suggest('stirng', ['strong', 'string'], { count: 0 })).toEqual([]);
    expect(suggest('stirng', ['strong', 'string'], { count: Infinity })).toEqual(['string', 'strong']);
  });

  it('count returns [] when nothing reads close enough', () => {
    expect(suggest('xyz', ['string', 'number'], { count: 3 })).toEqual([]);
    expect(suggest('word', [], { count: 3 })).toEqual([]);
    expect(suggest('word', null, { count: 3 })).toEqual([]);
  });

  it('equal scores keep candidate order', () => {
    expect(suggest('teh', ['the', 'tea'], { count: 2 })).toEqual(['the', 'tea']);
    expect(suggest('teh', ['tea', 'the'], { count: 2 })).toEqual(['tea', 'the']);
  });

  it('keeps the confidence gate and options in plural mode', () => {
    expect(suggest('kitten', ['sitting'], { count: 3 })).toEqual([]);
    expect(suggest('kitten', ['sitting'], { count: 3, threshold: 0.5 })).toEqual(['sitting']);
    expect(suggest('FORCE', ['force', 'quiet'], { count: 3 })).toEqual(['force']);
    expect(suggest('FORCE', ['force'], { count: 3, ignoreCase: false })).toEqual([]);
  });

  it('reads the same generous candidate shapes', () => {
    expect(suggest('colr', { color: '#f00', colour: '#f00', size: 'large' }, { count: 3 })).toEqual([
      'color',
      'colour',
    ]);
    expect(suggest('colr', new Set(['color', 'size']), { count: 3 })).toEqual(['color']);
  });

  it('drops exact duplicate and nullish candidates', () => {
    expect(suggest('colr', ['color', 'color', 'size'], { count: 3 })).toEqual(['color']);
    expect(suggest('colr', ['color', null, undefined], { count: 3 })).toEqual(['color']);
  });

  it('an exact match leads the list', () => {
    expect(suggest('force', ['forces', 'force'], { count: 3 })).toEqual(['force', 'forces']);
  });

  it('threshold 0 still requires sharing something', () => {
    expect(suggest('zzz', ['abc', 'zbc'], { count: 3, threshold: 0 })).toEqual(['zbc']);
  });

  it('a non-numeric count keeps the singular shape', () => {
    expect(suggest('stirng', ['string'], { count: undefined })).toBe('string');
    expect(suggest('stirng', ['string'], { count: NaN })).toBe('string');
  });
});

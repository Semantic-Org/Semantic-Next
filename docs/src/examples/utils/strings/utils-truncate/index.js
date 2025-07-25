import { truncate } from '@semantic-ui/utils';

// Basic truncation
console.log(truncate('This is a long text that needs truncating', 20));

// With emojis (Unicode-aware)
console.log(truncate('Hello 👋 World 🌍 Welcome!', 12));

// Custom suffix
console.log(truncate('This is a test message', 10, { suffix: ' [more]' }));

// Japanese text with locale
console.log(truncate('こんにちは世界です', 8, { locale: 'ja' }));
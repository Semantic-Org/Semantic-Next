import { reverseString } from '@semantic-ui/utils';

// Basic usage
console.log(reverseString('hello'));
console.log(reverseString('world'));

// With spaces
console.log(reverseString('hello world'));

// With emojis
console.log(reverseString('Hello 👋'));
console.log(reverseString('🎉🎊🎈'));

// Complex grapheme clusters (flags, skin tones)
console.log(reverseString('🇺🇸🇬🇧'));
console.log(reverseString('Hello 👋🏽'));

// Edge cases
console.log(reverseString(''));
console.log(reverseString('a'));

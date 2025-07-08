import { escapeHTML } from '@semantic-ui/utils';

const userInput = '<script>alert("XSS")</script>';
const safeOutput = escapeHTML(userInput);

console.log('User input:', userInput);
console.log('Safe output:', safeOutput);

const htmlString = 'Price: $5 & "free" shipping';
console.log('HTML escaped:', escapeHTML(htmlString));

const noSpecialChars = 'Regular text';
console.log('No change needed:', escapeHTML(noSpecialChars));

const allSpecialChars = '&<>"\'';
console.log('All special chars:', escapeHTML(allSpecialChars));

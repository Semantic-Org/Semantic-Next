import { indentLines } from '@semantic-ui/utils';

// basic usage with default 2 spaces
const code = 'function test() {\n  return true;\n}';
console.log(indentLines(code));

// custom indentation
console.log(indentLines(code, 4));

// single line
console.log(indentLines('single line', 2));

// useful for template processing
const template = `const greeting = 'Hello';
const name = 'World';
console.log(greeting, name);`;

console.log(indentLines(template, 2));

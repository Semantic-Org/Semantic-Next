import { isDOM } from '@semantic-ui/utils';

// Note: In browser environment
const div = document.createElement('div');
const textNode = document.createTextNode('hello');
const fragment = document.createDocumentFragment();

console.log(isDOM(div));
console.log(isDOM(document));
console.log(isDOM(window));
console.log(isDOM(fragment));
console.log(isDOM(textNode));
console.log(isDOM('not dom'));

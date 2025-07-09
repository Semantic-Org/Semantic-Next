import { isNode } from '@semantic-ui/utils';

const div = document.createElement('div');
const textNode = document.createTextNode('hello');
const comment = document.createComment('comment');

console.log(isNode(div));
console.log(isNode(textNode));
console.log(isNode(comment));
console.log(isNode(document));
console.log(isNode('not a node'));

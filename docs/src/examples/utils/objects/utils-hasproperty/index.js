import { hasProperty } from '@semantic-ui/utils';

const obj = { a: 1, b: 2 };
console.log(hasProperty(obj, 'a'));
console.log(hasProperty(obj, 'toString'));

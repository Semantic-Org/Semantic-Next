import { joinWords } from '@semantic-ui/utils';

console.log(joinWords(['apple', 'banana', 'orange']));
console.log(joinWords(['apple', 'banana']));
console.log(joinWords(['apple']));

// with custom options
console.log(joinWords(['red', 'green', 'blue'], { oxford: false }));
console.log(joinWords(['cat', 'dog', 'bird'], { quotes: true }));
console.log(joinWords(['one', 'two', 'three'], { lastSeparator: ' or ' }));

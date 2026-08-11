import { parsePath } from '@semantic-ui/utils';

// every segment reads as a type: field, key, index, or wildcard
console.log(parsePath('lines[#a1].tax'));
console.log(parsePath('lines.*.tax'));

// the two index spellings parse to the same segment
console.log(parsePath('lines[2].qty'));
console.log(parsePath('lines.2.qty'));

// a key carries any character except ']'
console.log(parsePath('users[#jack@semantic-ui.com].role')[1]);

// a path that does not parse is null, never a guess
console.log(parsePath('lines[#a1'));
console.log(parsePath('lines[abc]'));

// results are shared, so a repeated parse hands back the same array
console.log(parsePath('lines[#a1].tax') === parsePath('lines[#a1].tax'));

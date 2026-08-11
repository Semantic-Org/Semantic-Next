import { splitPath } from '@semantic-ui/utils';

// splits on the dots outside brackets
console.log(splitPath('order.customer.email'));

// a bracket keeps its segment whole, so a dot inside a key is identity
console.log(splitPath('users[#jack@semantic-ui.com].role'));
console.log(splitPath('lines[2].qty'));

// segments are contiguous substrings of the source, so joining rebuilds it
const path = 'teams[#core.ui].members[#200.40.50].role';
console.log(splitPath(path));
console.log(splitPath(path).join('.') === path);

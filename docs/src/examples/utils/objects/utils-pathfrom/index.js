import { parsePath, pathFrom, splitPath } from '@semantic-ui/utils';

// the inverse of parsePath
console.log(pathFrom(parsePath('users[#jack@semantic-ui.com].role')));

// and of splitPath
console.log(pathFrom(splitPath('teams[#core.ui].members')));

// segments and plain strings mix in one array
console.log(pathFrom(['order.lines', { type: 'key', key: 'a1' }, 'qty']));

// a positional index emits the dot form, so a bracket spelling normalizes
console.log(pathFrom(parsePath('lines[2].qty')));

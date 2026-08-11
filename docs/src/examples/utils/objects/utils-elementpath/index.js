import { elementPath, get } from '@semantic-ui/utils';

const team = {
  members: [
    { id: 'a1', role: 'owner' },
    { id: 'jack@semantic-ui.com', role: 'editor' },
  ],
};

// by key in the bracket form, by index in the dot form
console.log(elementPath('team.members', { key: 'a1' }));
console.log(elementPath('team.members', { index: 1 }));

// a key and an index are different address spaces
console.log(elementPath('team.members', { key: '1' }));

// the path it builds reads back through get
const path = elementPath('team.members', { key: 'jack@semantic-ui.com' });
console.log(get({ team }, path));

// a key carrying ']' cannot ride the grammar, so it throws instead of emitting
// a path nothing can parse
try {
  elementPath('team.members', { key: 'lot]7' });
}
catch (error) {
  console.log(error.message);
}

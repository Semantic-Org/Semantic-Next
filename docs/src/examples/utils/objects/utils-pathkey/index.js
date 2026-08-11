import { elementPath, pathKey } from '@semantic-ui/utils';

const members = [
  { id: 'jack@semantic-ui.com', role: 'owner' },
  { id: 7, role: 'editor' },
  { id: 'lot]7', role: 'viewer' },
  { name: 'anonymous' },
];

// the key as it can appear in a path, String coerced
console.log(pathKey(members[0]));
console.log(pathKey(members[1]));

// null when the key cannot ride the grammar, or the element carries none
console.log(pathKey(members[2]));
console.log(pathKey(members[3]));

// custom identity fields, first present wins
console.log(pathKey({ sku: 'A1' }, ['sku']));

// the route from an item to its path: ask for a key, fall back to position
members.forEach((member, index) => {
  const key = pathKey(member);
  console.log(
    key === null
      ? elementPath('members', { index })
      : elementPath('members', { key }),
  );
});

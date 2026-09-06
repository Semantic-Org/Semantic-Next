import { fill } from '@semantic-ui/utils';

// a whole sentence stays one editable string
console.log(fill('Name {chosenName} is already taken', { chosenName: 'jack' }));

// a key that resolves to nothing keeps its placeholder, so the typo shows itself
console.log(fill('Welcome back, {frist}', { first: 'jack' }));
console.log(fill('Welcome back, {first}', {}, { missing: 'friend' }));

// values first, defaults second
const copy = { appName: 'Semantic', plan: 'free' };
console.log(fill('{appName} on the {plan} plan', { plan: 'pro' }, { defaults: copy }));
console.log(fill('{appName} on the {plan} plan', {}, { defaults: copy }));

// keys read the path grammar
console.log(fill('{user.name} invited {user.guests[0]}', { user: { name: 'jack', guests: ['mira'] } }));

// a value a string can't faithfully hold reads as missing, transform says how it prints
console.log(fill('Renews {date}', { date: new Date('2026-01-02') }));
console.log(fill('Renews {date}', { date: new Date('2026-01-02') }, {
  transform: (value) => value.toISOString().slice(0, 10),
}));

// another placeholder grammar
console.log(fill('Hello ${name}', { name: 'jack' }, { open: '${', close: '}' }));

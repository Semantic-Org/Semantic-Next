import { get, keyedPath, set } from '@semantic-ui/utils';

const doc = { items: [{ id: 'a', qty: 1 }, { id: 'b', qty: 2 }], plain: [{ n: 1 }] };

console.log(keyedPath(doc, 'items.0.qty'));
console.log(keyedPath(doc, 'items[1]'));
console.log(keyedPath(doc, 'plain.0.n'));

const alreadyKeyed = 'items[#a].qty';
console.log(keyedPath(doc, alreadyKeyed) === alreadyKeyed);

const bySku = { rows: [{ sku: 'A1', qty: 1 }] };
console.log(keyedPath(bySku, 'rows.0.qty'));
console.log(keyedPath(bySku, 'rows.0.qty', ['sku']));

const cart = { items: [{ id: 'a', qty: 1 }, { id: 'b', qty: 2 }] };
const target = keyedPath(cart, 'items.1.qty');
cart.items.unshift({ id: 'z', qty: 9 });
console.log(get(cart, 'items.1.qty'));
set(cart, target, 20);
console.log(cart.items);

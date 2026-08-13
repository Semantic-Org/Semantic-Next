import { suggest } from '@semantic-ui/utils';

// The nearest candidate to a mistyped word
console.log(suggest('stirng', ['string', 'number', 'boolean']));

// null when nothing reads close enough
console.log(suggest('xyz', ['string', 'number', 'boolean']));

// A plain object or Map reads as its keys
console.log(suggest('colr', { color: '#f00', size: 'large' }));

// Case differences and adjacent swaps read as typos
console.log(suggest('FORCE', ['force', 'quiet']));
console.log(suggest('sroted', ['sorted', 'sordid']));

// Tighten or loosen the suggestion bar
console.log(suggest('kitten', ['sitting']));
console.log(suggest('kitten', ['sitting'], { threshold: 0.5 }));

// count returns the plausible candidates, best-first
console.log(suggest('stirng', ['strong', 'string', 'number'], { count: 3 }));
console.log(suggest('xyz', ['string', 'number'], { count: 3 }));

// The caller owns the sentence around the suggestion
const match = suggest('paddign', ['padding', 'margin', 'border']);
console.log(`unknown property 'paddign'${match ? `, did you mean '${match}'?` : ''}`);

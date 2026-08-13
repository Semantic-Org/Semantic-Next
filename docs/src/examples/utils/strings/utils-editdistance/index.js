import { editDistance } from '@semantic-ui/utils';

// Number of single-character edits between two strings
console.log(editDistance('kitten', 'sitting'));

// Case-insensitive comparison
console.log(editDistance('Color', 'colour', { ignoreCase: true }));

// Adjacent swaps count as one edit
console.log(editDistance('teh', 'the'));
console.log(editDistance('teh', 'the', { swaps: true }));

// Cap the search for cheap candidate filtering
console.log(editDistance('banana', 'orange', { max: 2 }));

// Unicode-aware by default: composed and decomposed spellings read as identical
console.log(editDistance('café', 'café'));
console.log(editDistance('👍', '👎'));

// Grapheme clusters as single units
console.log(editDistance('👩🏽‍🚀', '🧑🏻‍🚀'));
console.log(editDistance('👩🏽‍🚀', '🧑🏻‍🚀', { grapheme: true }));

// Weighted operation costs
console.log(editDistance('abc', 'ab', { deleteCost: 5 }));

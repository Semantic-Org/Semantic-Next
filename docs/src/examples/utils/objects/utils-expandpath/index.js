import { expandPath } from '@semantic-ui/utils';

const invoice = {
  lines: [
    { id: 'a1', qty: 2, cost: 10 },
    { id: 'jack@semantic-ui.com', qty: 1, cost: 40 },
  ],
  drafts: [{ qty: 1 }, { qty: 3 }],
};

// a path with neither a leading dot nor a wildcard addresses itself
console.log(expandPath('invoice.total'));

// a leading dot resolves against { from }, one dot per trailing segment
console.log(expandPath('.cost', { from: 'lines[#a1].qty' }));
console.log(expandPath('..total', { from: 'lines[#a1].qty' }));

// a wildcard enumerates { doc }: keyed elements by key, keyless by position
console.log(expandPath('lines.*.cost', { doc: invoice }));
console.log(expandPath('drafts.*.qty', { doc: invoice }));

// both spellings compose in one call
console.log(expandPath('..*.cost', { from: 'lines[#a1].qty', doc: invoice }));

// a level that is not an array contributes nothing
console.log(expandPath('missing.*.x', { doc: invoice }));

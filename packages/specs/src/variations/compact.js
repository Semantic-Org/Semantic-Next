export const COMPACT_OPTIONS = [
  { name: 'Compact', value: 'compact', description: 'reduce its padding slightly' },
  { name: 'Very Compact', value: 'very', description: 'reduce its padding greatly' },
];

export const COMPACT_VARIATION = {
  name: 'Compact',
  attribute: 'compact',
  usageLevel: 3,
  description: 'reduce its padding',
  compoundAliases: true,
  options: COMPACT_OPTIONS,
};

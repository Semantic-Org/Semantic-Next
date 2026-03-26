export const EMPHASIS_OPTIONS = [
  { name: 'Primary', value: 'primary', description: 'have primary emphasis' },
  { name: 'Secondary', value: 'secondary', description: 'have secondary emphasis' },
  { name: 'Tertiary', value: 'tertiary', description: 'have tertiary emphasis' },
];

export const EMPHASIS_TYPE = {
  name: 'Emphasis',
  attribute: 'emphasis',
  includeAttributeClass: true,
  usageLevel: 2,
  description: 'be emphasized in a layout',
  options: EMPHASIS_OPTIONS,
};

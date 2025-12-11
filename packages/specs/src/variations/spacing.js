export const SPACING_OPTIONS = [
  { name: 'Mini', value: 'mini', description: 'appear with minimal spacing' },
  { name: 'Tiny', value: 'tiny', description: 'appear with very small spacing' },
  { name: 'Small', value: 'small', description: 'appear with small spacing' },
  { name: 'Medium', value: 'medium', description: 'appear with normal spacing' },
  { name: 'Large', value: 'large', description: 'appear with large spacing' },
  { name: 'Big', value: 'big', description: 'appear with big spacing' },
  { name: 'Huge', value: 'huge', description: 'appear with huge spacing' },
  { name: 'Massive', value: 'massive', description: 'appear with massive spacing' },
];

export const SPACING_VARIATION = {
  name: 'Spacing',
  attribute: 'spacing',
  usageLevel: 1,
  description: 'adjust vertical spacing',
  options: SPACING_OPTIONS,
};

export const ATTACHED_OPTIONS = [
  { name: 'Top Attached', value: 'top', description: 'appear attached to the top of other content' },
  { name: 'Attached', value: 'attached', description: 'attach to content above and below' },
  { name: 'Bottom Attached', value: 'bottom', description: 'attach to the bottom' },
  { name: 'Left Attached', value: 'left', description: 'attach to the left' },
  { name: 'Right Attached', value: 'right', description: 'attach to the right' },
];

export const ATTACHED_VARIATION = {
  name: 'Attached',
  attribute: 'attached',
  includeAttributeClass: true,
  separateExamples: true,
  usageLevel: 2,
  description: 'attach to other content',
  options: ATTACHED_OPTIONS,
};

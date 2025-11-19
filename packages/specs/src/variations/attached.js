export const ATTACHED_OPTIONS = [
  { name: 'Top Attached', value: 'top-attached', description: 'appear attached to the top of other content' },
  { name: 'Attached', value: 'attached', description: 'attach to content above and below' },
  { name: 'Bottom Attached', value: 'bottom-attached', description: 'attach to the bottom' },
  { name: 'Left Attached', value: 'left-attached', description: 'attach to the left' },
  { name: 'Right Attached', value: 'right-attached', description: 'attach to the right' },
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

export const COLOR_OPTIONS = [
  { name: 'Red', value: 'red', description: 'be red' },
  { name: 'Orange', value: 'orange', description: 'be orange' },
  { name: 'Yellow', value: 'yellow', description: 'be yellow' },
  { name: 'Olive', value: 'olive', description: 'be olive' },
  { name: 'Green', value: 'green', description: 'be green' },
  { name: 'Teal', value: 'teal', description: 'be teal' },
  { name: 'Blue', value: 'blue', description: 'be blue' },
  { name: 'Violet', value: 'violet', description: 'be violet' },
  { name: 'Purple', value: 'purple', description: 'be purple' },
  { name: 'Pink', value: 'pink', description: 'be pink' },
  { name: 'Brown', value: 'brown', description: 'be brown' },
  { name: 'Grey', value: 'grey', description: 'be grey' },
  { name: 'Slate', value: 'slate', description: 'be slate' },
];

export const COLORED_VARIATION = {
  name: 'Colored',
  attribute: 'color',
  includeAttributeClass: true,
  usageLevel: 3,
  description: 'be colored',
  options: COLOR_OPTIONS,
};

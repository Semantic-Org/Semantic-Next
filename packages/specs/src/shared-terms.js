/*******************************
          Options
*******************************/

export const SIZE_OPTIONS = [
  { name: 'Mini', value: 'mini', description: 'appear extremely small' },
  { name: 'Tiny', value: 'tiny', description: 'appear very small' },
  { name: 'Small', value: 'small', description: 'appear small' },
  { name: 'Medium', value: 'medium', description: 'appear normal sized' },
  { name: 'Large', value: 'large', description: 'appear larger than normal' },
  { name: 'Big', value: 'big', description: 'appear much larger than normal' },
  { name: 'Huge', value: 'huge', description: 'appear very much larger than normal' },
  { name: 'Massive', value: 'massive', description: 'appear extremely larger than normal' },
];

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

export const FLOATED_OPTIONS = [
  { name: 'Left Floated', value: 'left-floated', description: 'appear to the left of content' },
  { name: 'Right Floated', value: 'right-floated', description: 'appear to the right of content' },
];

export const ATTACHED_OPTIONS = [
  { name: 'Top Attached', value: 'top-attached', description: 'appear attached to the top of other content' },
  { name: 'Attached', value: 'attached', description: 'attach to content above and below' },
  { name: 'Bottom Attached', value: 'bottom-attached', description: 'attach to the bottom' },
  { name: 'Left Attached', value: 'left-attached', description: 'attach to the left' },
  { name: 'Right Attached', value: 'right-attached', description: 'attach to the right' },
];

export const COMPACT_OPTIONS = [
  { name: 'Compact', value: 'compact', description: 'reduce its padding slightly' },
  { name: 'Very Compact', value: 'very-compact', description: 'reduce its padding greatly' },
];

export const PADDED_OPTIONS = [
  { name: 'Padded', value: 'padded', description: 'have standard increased padding' },
  { name: 'Very Padded', value: 'very-padded', description: 'have extra increased padding' },
];

export const HORIZONTAL_ALIGNED_OPTIONS = [
  { name: 'Left Aligned', value: 'left-aligned', description: 'align content to the left' },
  { name: 'Center Aligned', value: 'center-aligned', description: 'align content to the center' },
  { name: 'Right Aligned', value: 'right-aligned', description: 'align content to the right' },
];

export const VERTICAL_ALIGNED_OPTIONS = [
  { name: 'Top Aligned', value: 'top-aligned', description: 'align content to the top' },
  { name: 'Middle Aligned', value: 'middle-aligned', description: 'align content to the middle' },
  { name: 'Bottom Aligned', value: 'bottom-aligned', description: 'align content to the bottom' },
];

export const EMPHASIS_OPTIONS = [
  { name: 'Primary', value: 'primary', description: 'have primary emphasis' },
  { name: 'Secondary', value: 'secondary', description: 'have secondary emphasis' },
  { name: 'Tertiary', value: 'tertiary', description: 'have tertiary emphasis' },
];

/*******************************
          States
*******************************/

export const HOVER_STATE = {
  name: 'Hover',
  attribute: 'hover',
  description: 'be hovered',
};

export const FOCUS_STATE = {
  name: 'Focus',
  attribute: 'focus',
  description: 'be focused by the keyboard',
};

export const ACTIVE_STATE = {
  name: 'Active',
  attribute: 'active',
  description: 'be activated',
};

export const LOADING_STATE = {
  name: 'Loading',
  attribute: 'loading',
  description: 'indicate it is loading content',
};

export const PRESSED_STATE = {
  name: 'Pressed',
  attribute: 'pressed',
  description: 'be pressed by a pointer',
};

export const DISABLED_STATE = {
  name: 'Disabled',
  attribute: 'disabled',
  includeAttributeClass: true,
  description: 'have interactions disabled',
  options: [
    {
      name: 'Disabled',
      value: 'disabled',
      description: 'disable interactions',
    },
    {
      name: 'Clickable Disabled',
      value: 'clickable-disabled',
      description: 'allow interactions but appear disabled',
    },
  ],
};

/*******************************
          Types
*******************************/

export const EMPHASIS_TYPE = {
  name: 'Emphasis',
  attribute: 'emphasis',
  includeAttributeClass: true,
  usageLevel: 2,
  description: 'be emphasized in a layout',
  options: EMPHASIS_OPTIONS,
};

/*******************************
        Variations
*******************************/

export const SIZE_VARIATION = {
  name: 'Size',
  attribute: 'size',
  usageLevel: 1,
  description: 'vary in size',
  options: SIZE_OPTIONS,
};

export const FLUID_VARIATION = {
  name: 'Fluid',
  attribute: 'fluid',
  usageLevel: 1,
  description: 'take the width of its container',
};

export const COMPACT_VARIATION = {
  name: 'Compact',
  attribute: 'compact',
  usageLevel: 3,
  description: 'reduce its padding',
  options: COMPACT_OPTIONS,
};

export const PADDED_VARIATION = {
  name: 'Padded',
  attribute: 'padded',
  usageLevel: 2,
  description: 'increase its padding',
  options: PADDED_OPTIONS,
};

export const COLORED_VARIATION = {
  name: 'Colored',
  attribute: 'color',
  includeAttributeClass: true,
  usageLevel: 3,
  description: 'be colored',
  options: COLOR_OPTIONS,
};

export const FLOATED_VARIATION = {
  name: 'Floated',
  attribute: 'floated',
  usageLevel: 1,
  description: 'align to the left or right of its container',
  options: FLOATED_OPTIONS,
};

export const ATTACHED_VARIATION = {
  name: 'Attached',
  attribute: 'attached',
  includeAttributeClass: true,
  separateExamples: true,
  usageLevel: 2,
  description: 'attach to other content',
  options: ATTACHED_OPTIONS,
};

export const HORIZONTAL_ALIGNED_VARIATION = {
  name: 'Text Alignment',
  attribute: 'text-align',
  usageLevel: 2,
  description: 'have its text aligned',
  options: HORIZONTAL_ALIGNED_OPTIONS,
};

export const VERTICAL_ALIGNED_VARIATION = {
  name: 'Vertical Alignment',
  attribute: 'vertical-align',
  usageLevel: 2,
  description: 'have its content vertically aligned',
  options: VERTICAL_ALIGNED_OPTIONS,
};

export const CIRCULAR_VARIATION = {
  name: 'Circular',
  attribute: 'circular',
  usageLevel: 3,
  description: 'be rounded like a circle',
};

/*******************************
         Helpers
*******************************/

/* Add Custom Examples to Shared Options */
export const addOptionExamples = (options, customExamples = {}) => {
  return options.map(opt => ({
    ...opt,
    exampleCode: customExamples[opt.value] || opt.exampleCode,
  }));
};

/* Filter Options by Function or Array of Values */
export const filterVariationOptions = (variation, filter) => {
  const filterFn = Array.isArray(filter)
    ? (opt) => filter.includes(opt.value)
    : filter;

  return {
    ...variation,
    options: variation.options.filter(filterFn),
  };
};

/* Get State Constants by Names */
export const getStates = (stateNames) => {
  const stateMap = {
    hover: HOVER_STATE,
    focus: FOCUS_STATE,
    active: ACTIVE_STATE,
    loading: LOADING_STATE,
    pressed: PRESSED_STATE,
    disabled: DISABLED_STATE,
  };

  return stateNames.map(name => stateMap[name]).filter(Boolean);
};

/* Get Variation Constants by Names */
export const getVariations = (variationNames) => {
  const variationMap = {
    size: SIZE_VARIATION,
    fluid: FLUID_VARIATION,
    compact: COMPACT_VARIATION,
    padded: PADDED_VARIATION,
    colored: COLORED_VARIATION,
    floated: FLOATED_VARIATION,
    attached: ATTACHED_VARIATION,
    'horizontal-aligned': HORIZONTAL_ALIGNED_VARIATION,
    'vertical-aligned': VERTICAL_ALIGNED_VARIATION,
    circular: CIRCULAR_VARIATION,
  };

  return variationNames.map(name => variationMap[name]).filter(Boolean);
};

/* Set Usage Level for Variation or Type */
export const withUsageLevel = (item, usageLevel) => {
  return {
    ...item,
    usageLevel,
  };
};

/* Modify Arbitrary Properties of Variation, Type, or State */
export const modifyVariation = (item, overrides) => {
  return {
    ...item,
    ...overrides,
  };
};

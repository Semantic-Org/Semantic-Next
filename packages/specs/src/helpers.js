import {
  ACTIVE_STATE,
  DISABLED_STATE,
  FOCUS_STATE,
  HOVER_STATE,
  LOADING_STATE,
  PRESSED_STATE,
} from './states/index.js';

import {
  ATTACHED_VARIATION,
  CIRCULAR_VARIATION,
  COLORED_VARIATION,
  COMPACT_VARIATION,
  FLOATED_VARIATION,
  FLUID_VARIATION,
  HORIZONTAL_ALIGNED_VARIATION,
  PADDED_VARIATION,
  SIZE_VARIATION,
  VERTICAL_ALIGNED_VARIATION,
} from './variations/index.js';

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

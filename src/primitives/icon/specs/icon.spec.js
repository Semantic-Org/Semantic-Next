import {
  ICON_OPTIONS,
  SIZE_VARIATION,
  COLORED_VARIATION,
  COLOR_OPTIONS,
  modifyVariation,
  withUsageLevel,
  getStates,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Icon',
  description: 'An icon is a glyph used to represent something else',
  tagName: 'ui-icon',
  bundle: 'standard',
  exportName: 'Icon',
  content: [
    {
      name: 'Icon',
      attribute: 'icon',
      description: 'specify what icon should appear',
      usageLevel: 1,
      options: ICON_OPTIONS,
    },
  ],
  states: getStates(['disabled', 'loading']).map(state => withUsageLevel(state, 1)),
  variations: [
    {
      name: 'Link',
      description: 'be formatted as a link',
      usageLevel: 1,
    },
    {
      name: 'Fitted',
      description: 'be fitted without any space to the left or right of it.',
      usageLevel: 1,
    },
    COLORED_VARIATION,
    SIZE_VARIATION,
    modifyVariation(SIZE_VARIATION, {
      includeAttributeClass: true
    }),
    {
      name: 'Spin',
      description: 'be formatted to spin like a loader',
      usageLevel: 3,
      attribute: 'spin',
    },
  ],
  settings: [
    {
      name: 'set',
      type: 'string',
      attribute: 'set',
      description: 'The icon set to use',
    },
    {
      name: 'href',
      type: 'string',
      attribute: 'href',
      description: 'Link to a page',
    },
    {
      name: 'target',
      type: 'string',
      attribute: 'target',
      description: 'The target for a link',
    },
  ],
  supportsPlural: true,
  pluralName: 'Icons',
  pluralTagName: 'ui-icons',
  pluralDescription: 'Icons exist together as a group',
  pluralVariations: [
    'colored',
    'size',
  ],
  examples: {
    defaultAttributes: {
      icon: 'check',
    },
  },
};

import {
  EMPHASIS_TYPE,
  DISABLED_STATE,
  LOADING_STATE,
  COMPACT_VARIATION,
  PADDED_VARIATION,
  FLOATED_VARIATION,
  HORIZONTAL_ALIGNED_VARIATION,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Segment',
  description: 'A segment is used to create a grouping of related content',
  tagName: 'ui-segment',
  bundle: 'standard',
  exportName: 'Segment',

  content: [],

  types: [
    EMPHASIS_TYPE,
    {
      name: 'Vertical',
      attribute: 'vertical',
      description: 'format content to be aligned as part of a vertical group',
      usageLevel: 2,
    },
    {
      name: 'Raised',
      attribute: 'raised',
      description: 'be formatted to raise above the page',
      usageLevel: 3,
    },
    {
      name: 'Stacked',
      attribute: 'stacked',
      description: 'be formatted to show it contains multiple pages',
      usageLevel: 5,
    },
    {
      name: 'Piled',
      attribute: 'piled',
      description: 'be formatted to look like a pile of pages',
      usageLevel: 5,
    },
  ],

  states: [
    {
      name: 'Disabled',
      attribute: 'disabled',
      description: 'show its content is disabled',
      usageLevel: 2,
    },
    {
      name: 'Loading',
      attribute: 'loading',
      description: 'show its content is being loaded',
      usageLevel: 2,
    },
  ],

  variations: [
    {
      name: 'Attached',
      attribute: 'attached',
      description: 'be attached to other content on a page',
      includeAttributeClass: true,
      options: [
        {
          name: 'Top Attached',
          value: 'top-attached',
          description: 'be attached on top side only',
        },
        {
          name: 'Attached',
          value: 'attached',
          description: 'be attached on both sides',
        },
        {
          name: 'Bottom Attached',
          value: 'bottom-attached',
          description: 'be attached on bottom side only',
        },
      ],
      usageLevel: 2,
    },
    PADDED_VARIATION,
    {
      name: 'Inline',
      attribute: 'inline',
      usageLevel: 3,
      description: 'can appear inline',
    },
    COMPACT_VARIATION,
    {
      name: 'Colored',
      attribute: 'color',
      description: 'be colored',
      includeAttributeClass: true,
      options: [
        { name: 'Red', value: 'red' },
        { name: 'Orange', value: 'orange' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Olive', value: 'olive' },
        { name: 'Green', value: 'green' },
        { name: 'Teal', value: 'teal' },
        { name: 'Blue', value: 'blue' },
        { name: 'Violet', value: 'violet' },
        { name: 'Purple', value: 'purple' },
        { name: 'Pink', value: 'pink' },
        { name: 'Brown', value: 'brown' },
        { name: 'Grey', value: 'grey' },
        { name: 'Black', value: 'black' },
      ],
      usageLevel: 2,
    },
    {
      name: 'Circular',
      attribute: 'circular',
      description: 'be circular',
      usageLevel: 3,
    },
    {
      name: 'Clearing',
      attribute: 'clearing',
      description: 'clear floated content',
      usageLevel: 3,
    },
    FLOATED_VARIATION,
    HORIZONTAL_ALIGNED_VARIATION,
    {
      name: 'Basic',
      attribute: 'basic',
      description: 'have no special formatting',
      usageLevel: 2,
    },
  ],

  events: [],
  settings: [],

  supportsPlural: true,
  pluralName: 'Segments',
  pluralTagName: 'ui-segments',
  pluralExportName: 'Segments',
  pluralDescription: 'Segments can be grouped together',

  pluralContent: [],

  pluralSharedTypes: ['raised', 'stacked', 'piled'],

  pluralOnlyTypes: [
    {
      name: 'Horizontal',
      attribute: 'horizontal',
      description: 'be arranged horizontally',
      usageLevel: 3,
    },
  ],

  pluralSharedVariations: ['compact', 'basic'],

  pluralOnlyVariations: [],

  examples: {
    defaultAttributes: {},
    defaultPluralContent: `<ui-segment>First</ui-segment>
<ui-segment>Second</ui-segment>
<ui-segment>Third</ui-segment>`,
  },
};

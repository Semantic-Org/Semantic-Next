import {
  getStates,
  getVariations,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Input',
  description: 'A menu displays grouped navigation actions',
  tagName: 'ui-input',
  exportName: 'Input',
  content: [
    {
      name: 'Placeholder',
      attribute: 'placeholder',
      description: 'include placeholder text',
      exampleCode: `<ui-input placeholder="Search..."></ui-input>`,
    },
    {
      name: 'Icon',
      includeAttributeClass: true,
      attribute: 'icon',
      couplesWith: ['ui-icon'],
      description: 'include an icon',
      exampleCode: `<ui-input icon="search"></ui-input>`,
    },
    {
      name: 'Label',
      includeAttributeClass: true,
      attribute: 'label',
      description: 'include a label',
      exampleCode: `<ui-input label="ctrl+k"></ui-input>`,
    },
  ],
  types: [
    {
      name: 'Search',
      attribute: 'search',
      description: 'can be formatted to appear as a search',
      exampleCode: `<ui-input search></ui-input>`,
    },
  ],
  states: getStates(['hover', 'focus', 'active', 'disabled']),
  variations: [
    ...getVariations(['fluid', 'size']),
  ],
  events: [
    {
      eventName: 'change',
      description: 'occurs after the value changes',
      arguments: [
        {
          name: 'value',
          description: 'the updated value',
        },
      ],
    },
  ],
  settings: [
    {
      name: 'Name',
      type: 'string',
      attribute: 'name',
      description: 'can specify the form field name',
    },
    {
      name: 'Type',
      type: 'string',
      attribute: 'type',
      defaultValue: 'text',
      description: 'can specify the form html input type',
    },
    {
      name: 'Debounced',
      type: 'boolean',
      attribute: 'debounced',
      defaultValue: false,
      description: 'can specify the input value should be debounced',
    },
    {
      name: 'Debounce Interval',
      type: 'number',
      attribute: 'debounce-interval',
      defaultValue: 150,
      description: 'can specify the input debounce interval in milliseconds',
    },
    {
      name: 'Clearable',
      type: 'string',
      attribute: 'clearable',
      description: 'can show an icon to reset the inputted value',
    },
    {
      name: 'Value',
      type: 'string',
      attribute: 'value',
      description: 'can specify a value to store',
    },
  ],
  examples: {
    defaultAttributes: {},
    defaultContent: '',
  },
};

// src/primitives/input/specs/input.json
var uiType = 'element';
var name = 'Input';
var description = 'A menu displays grouped navigation actions';
var tagName = 'ui-input';
var exportName = 'UIInput';
var content = [
  {
    name: 'Placeholder',
    attribute: 'placeholder',
    description: 'include placeholder text',
    exampleCode: '<ui-input placeholder="Search..."></ui-input>',
  },
  {
    name: 'Icon',
    includeAttributeClass: true,
    attribute: 'icon',
    couplesWith: ['ui-icon'],
    description: 'include an icon',
    exampleCode: '<ui-input icon="search"></ui-input>',
  },
  {
    name: 'Label',
    includeAttributeClass: true,
    attribute: 'label',
    description: 'include a label',
    exampleCode: '<ui-input label="ctrl+k"></ui-input>',
  },
];
var types = [
  {
    name: 'Search',
    attribute: 'search',
    description: 'can be formatted to appear as a search',
    exampleCode: '<ui-input search></ui-input>',
  },
];
var states = [
  {
    name: 'Hover',
    attribute: 'hover',
    description: 'be hovered',
  },
  {
    name: 'Focus',
    attribute: 'focused',
    description: 'be focused by the keyboard',
  },
  {
    name: 'Active',
    attribute: 'active',
    description: 'be activated',
  },
  {
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
  },
];
var variations = [
  {
    name: 'Fluid',
    attribute: 'fluid',
    usageLevel: 1,
    description: 'take the width of its container',
  },
  {
    name: 'Size',
    attribute: 'size',
    usageLevel: 1,
    description: 'vary in size',
    separateExamples: true,
    options: [
      {
        name: 'Mini',
        value: 'mini',
        description: 'appear extremely small',
      },
      {
        name: 'Tiny',
        value: 'tiny',
        description: 'appear very small',
      },
      {
        name: 'Small',
        value: 'small',
        description: 'appear small',
      },
      {
        name: 'Medium',
        value: 'medium',
        description: 'appear normal sized',
      },
      {
        name: 'Large',
        value: 'large',
        description: 'appear larger than normal',
      },
      {
        name: 'Big',
        value: 'big',
        description: 'appear much larger than normal',
      },
      {
        name: 'Huge',
        value: 'huge',
        description: 'appear very much larger than normal',
      },
      {
        name: 'Massive',
        value: 'massive',
        description: 'appear extremely larger than normal',
      },
    ],
  },
];
var events = [
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
];
var settings = [
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
];
var examples = {
  defaultAttributes: {},
  defaultContent: '',
};
var input_default = {
  uiType,
  name,
  description,
  tagName,
  exportName,
  content,
  types,
  states,
  variations,
  events,
  settings,
  examples,
};
export {
  content,
  description,
  events,
  examples,
  exportName,
  input_default as default,
  name,
  settings,
  states,
  tagName,
  types,
  uiType,
  variations,
};

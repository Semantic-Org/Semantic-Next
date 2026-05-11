// Source spec - you author this
export default {
  uiType: 'element',
  name: 'Widget',
  tagName: 'ui-widget',
  exportName: 'UIWidget',

  types: [],
  states: [],

  variations: [
    {
      name: 'Size',
      attribute: 'size',
      options: [
        { name: 'Small', value: 'small' },
        { name: 'Large', value: 'large' },
      ],
    },
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      includeAttributeClass: true,
      options: [
        {
          name: 'Primary',
          value: 'primary',
          description: 'be emphasized with primary color',
        },
        {
          name: 'Secondary',
          value: 'secondary',
          description: 'be emphasized with secondary color',
        },
      ],
    },
  ],

  settings: [],
  events: [],
};

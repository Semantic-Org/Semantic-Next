export default {
  uiType: 'element',
  name: 'Badge',
  tagName: 'ui-badge',
  exportName: 'UIBadge',

  types: [
    {
      name: 'Status',
      attribute: 'status',
      options: [
        { name: 'Success', value: 'success' },
        { name: 'Warning', value: 'warning' },
        { name: 'Error', value: 'error' },
      ],
    },
  ],

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
  ],

  settings: [],
  events: [],
};

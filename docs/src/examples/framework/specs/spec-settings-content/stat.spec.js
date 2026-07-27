export default {
  uiType: 'element',
  name: 'Stat',
  tagName: 'ui-stat',
  exportName: 'UIStat',

  // content names a fillable region, the template reads {label} and {>slot label}
  content: [
    {
      name: 'Label',
      attribute: 'label',
      slot: 'label',
      description: 'name the measurement',
    },
  ],

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
  ],

  // settings carry values, not classes
  settings: [
    {
      name: 'Count',
      type: 'number',
      attribute: 'count',
      defaultValue: 0,
      description: 'the measured value',
    },
    {
      name: 'Unit',
      type: 'string',
      attribute: 'unit',
      description: 'suffix shown after the count',
    },
  ],

  events: [],
};

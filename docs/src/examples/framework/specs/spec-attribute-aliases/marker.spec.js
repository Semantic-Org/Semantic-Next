export default {
  uiType: 'element',
  name: 'Marker',
  tagName: 'ui-marker',
  exportName: 'UIMarker',

  types: [],
  states: [],

  variations: [
    {
      // declared first, so it keeps the bare `left` and `right`
      name: 'Floated',
      attribute: 'floated',
      options: [
        { name: 'Left', value: 'left' },
        { name: 'Right', value: 'right' },
      ],
    },
    {
      name: 'Attached',
      attribute: 'attached',
      options: [
        { name: 'Top', value: 'top' },
        { name: 'Bottom', value: 'bottom' },
        { name: 'Left', value: 'left' },
        { name: 'Right', value: 'right' },
      ],
    },
    {
      name: 'Corner',
      attribute: 'corner',
      options: [
        { name: 'Top Left', value: 'top-left' },
        { name: 'Top Right', value: 'top-right' },
      ],
    },
    {
      // opting in removes the bare form, so only fade-animated resolves
      name: 'Animated',
      attribute: 'animated',
      compoundAliases: true,
      options: [
        { name: 'Fade', value: 'fade' },
        { name: 'Slide', value: 'slide' },
      ],
    },
  ],

  settings: [],
  events: [],
};

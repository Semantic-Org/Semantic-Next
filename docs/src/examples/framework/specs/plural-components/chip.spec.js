export default {
  uiType: 'element',
  name: 'Chip',
  tagName: 'ui-chip',
  exportName: 'UIChip',

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
      name: 'Primary',
      attribute: 'primary',
      description: 'stand out from the other chips',
    },
  ],

  settings: [],
  events: [],

  // the group tag, built from this same file
  supportsPlural: true,
  pluralName: 'Chips',
  pluralTagName: 'ui-chips',
  pluralExportName: 'UIChips',

  // sizing a group sizes its chips, primary stays per chip
  pluralSharedVariations: ['size'],

  pluralOnlyVariations: [
    {
      name: 'Stacked',
      attribute: 'stacked',
      description: 'arrange the group vertically',
    },
  ],
};

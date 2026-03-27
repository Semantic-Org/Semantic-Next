import {
  SIZE_VARIATION,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Label',
  description: 'A label displays content classification',
  tagName: 'ui-label',
  exportName: 'Label',
  bundle: 'standard',
  content: [],
  types: [
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      description: 'adjust its emphasis in a layout',
      usageLevel: 1,
      options: [
        {
          name: 'Secondary',
          value: 'secondary',
          description: 'can be de-emphasized in a layout',
        },
        {
          name: 'Outline',
          value: 'outline',
          description: 'can be very de-emphasized in a layout',
        },
      ],
    },
  ],
  variations: [
    {
      name: 'Badge',
      attribute: 'badge',
      description: 'be used as a badge to display counts or simple information next to text',
      usageLevel: 2,
      exampleCode: `<ui-label badge>12</ui-label><ui-label secondary badge>22</ui-label><ui-label outline badge>52</ui-label>`,
    },
    SIZE_VARIATION,
  ],
  events: [],
  settings: [],
};

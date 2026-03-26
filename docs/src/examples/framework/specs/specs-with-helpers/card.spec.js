// Using helpers to include common variations and states
import { getStates, getVariations } from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Widget',
  tagName: 'ui-widget',
  exportName: 'UIWidget',

  types: [],

  states: getStates(['disabled']),

  variations: [
    ...getVariations(['size', 'fluid']),
    {
      name: 'Animation',
      attribute: 'animation',
      description: 'have an animation',
      options: [
        {
          name: 'Blink',
          value: 'blink',
          description: 'blink like the 90s',
        },
        {
          name: 'Wiggle',
          value: 'wiggle',
          description: 'wiggle back and forth',
        },
        {
          name: 'Bounce',
          value: 'bounce',
          description: 'bounce up and down',
        },
      ],
    },
  ],

  settings: [],
  events: [],
};

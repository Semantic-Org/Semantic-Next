import {
  getVariations,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Spinner',
  description: 'A spinner indicates indeterminate activity',
  tagName: 'ui-spinner',
  exportName: 'UISpinner',

  content: [
    {
      name: 'Text',
      attribute: 'text',
      slot: 'text',
      description: 'include a loading message',
      usageLevel: 2,
      exampleCode: `<ui-spinner text="Loading..."></ui-spinner>`,
    },
  ],

  types: [],
  states: [
    {
      name: 'Active',
      attribute: 'active',
      description: 'force the spinner to be visible',
      usageLevel: 2,
    },
    {
      name: 'Hidden',
      attribute: 'hidden',
      description: 'force the spinner to be hidden',
      usageLevel: 2,
    },
  ],

  variations: [
    ...getVariations(['size', 'colored']),
    {
      name: 'Centered',
      attribute: 'centered',
      description: 'appear centered within its container',
      usageLevel: 2,
      exampleCode: `<ui-spinner centered></ui-spinner>`,
    },
    {
      name: 'Overlay',
      attribute: 'overlay',
      description: 'overlay its parent content with a loading state',
      usageLevel: 2,
      exampleCode: `
        <ui-segment>
          <ui-spinner overlay></ui-spinner>
          <p>Content being loaded</p>
        </ui-segment>
      `,
    },
  ],

  settings: [],
  events: [],

  examples: {
    defaultAttributes: {},
    defaultContent: '',
  },
};

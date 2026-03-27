import {
  SIZE_VARIATION,
  filterVariationOptions,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Modal',
  description: 'A modal displays content that temporarily blocks interactions with the main view of a site',
  tagName: 'ui-modal',
  exportName: 'Modal',
  bundle: 'standard',
  content: [],
  types: [
    {
      name: 'Glass',
      attribute: 'glass',
      description: 'can appear as glass',
      usageLevel: 3,
    },
  ],
  variations: [
    {
      name: 'Aligned',
      attribute: 'aligned',
      description: 'adjust its alignment',
      usageLevel: 1,
      options: [
        {
          name: 'Top Aligned',
          value: ['top-aligned'],
          description: 'appear aligned to top of browser',
          exampleCode: `<ui-modal top-aligned>Modal Content</ui-modal>`,
        },
      ],
    },
    filterVariationOptions(SIZE_VARIATION, ['tiny', 'small', 'medium', 'large', 'big']),
  ],
  events: [
    {
      eventName: 'show',
      description: 'occurs after the modal starts to show',
    },
    {
      eventName: 'visible',
      description: 'occurs after the modal is visible',
    },
    {
      eventName: 'hide',
      description: 'occurs when the modal begins to hide',
    },
    {
      eventName: 'hidden',
      description: 'occurs after the modal is hidden',
    },
  ],
  settings: [
    {
      name: 'Closeable',
      type: 'boolean',
      defaultValue: true,
      attribute: 'closeable',
      description: 'can allow the modal to be dismissed by clicking on the backdrop.',
    },
  ],
};

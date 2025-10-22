// src/primitives/modal/specs/modal.json
var uiType = 'element';
var name = 'Modal';
var description = 'A modal displays content that temporarily blocks interactions with the main view of a site';
var tagName = 'ui-modal';
var exportName = 'UIModal';
var content = [];
var types = [
  {
    name: 'Glass',
    attribute: 'glass',
    description: 'can appear as glass',
    usageLevel: 3,
  },
];
var variations = [
  {
    name: 'Aligned',
    attribute: 'aligned',
    description: 'adjust its alignment',
    usageLevel: 1,
    options: [
      {
        name: 'Top Aligned',
        value: [
          'top-aligned',
        ],
        description: 'appear aligned to top of browser',
        exampleCode: '<ui-modal top-aligned>Modal Content</ui-modal>',
      },
    ],
  },
  {
    name: 'Size',
    attribute: 'size',
    usageLevel: 1,
    description: 'vary in size',
    options: [
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
    ],
  },
];
var events = [
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
];
var settings = [
  {
    name: 'Closeable',
    type: 'boolean',
    defaultValue: true,
    attribute: 'closeable',
    description: 'can allow the modal to be dismissed by clicking on the backdrop.',
  },
];
var modal_default = {
  uiType,
  name,
  description,
  tagName,
  exportName,
  content,
  types,
  variations,
  events,
  settings,
};
export {
  content,
  description,
  events,
  exportName,
  modal_default as default,
  name,
  settings,
  tagName,
  types,
  uiType,
  variations,
};

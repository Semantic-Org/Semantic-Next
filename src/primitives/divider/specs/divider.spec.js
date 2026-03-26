import {
  SPACING_VARIATION,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Divider',
  description: 'A divider visually segments content into groups',
  tagName: 'ui-divider',
  exportName: 'Divider',
  content: [
    {
      name: 'Text',
      attribute: 'text',
      description: 'include centered text',
      usageLevel: 1,
      exampleCode: `<ui-divider text="Or"></ui-divider>`,
    },
    {
      name: 'Icon',
      attribute: 'icon',
      couplesWith: ['ui-icon'],
      description: 'include a centered icon',
      usageLevel: 2,
      exampleCode: `<ui-divider icon="tag"></ui-divider>`,
    },
    {
      name: 'Image',
      attribute: 'image',
      description: 'include an image',
      usageLevel: 3,
      exampleCode: `<ui-divider image="/images/avatar/small/jenny.jpg" text="Jenny"></ui-divider>`,
    },
  ],
  types: [
    {
      name: 'Vertical',
      attribute: 'vertical',
      description: 'divide content vertically',
      usageLevel: 3,
      exampleCode: `<ui-divider vertical></ui-divider>`,
    },
    {
      name: 'Styled',
      attribute: 'styled',
      description: 'be styled with different visual treatments',
      usageLevel: 2,
      options: [
        {
          name: 'Solid',
          value: 'solid',
          description: 'use a solid line',
        },
        {
          name: 'Dashed',
          value: 'dashed',
          description: 'use a dashed line',
        },
        {
          name: 'Dotted',
          value: 'dotted',
          description: 'use a dotted line',
        },
        {
          name: 'Fade',
          value: 'fade',
          description: 'fade from transparent at edges',
        },
        {
          name: 'Soft',
          value: 'soft',
          description: 'use shadow with no hard line',
        },
        {
          name: 'Double',
          value: 'double',
          description: 'use a double line',
        },
      ],
      exampleCode: `<ui-divider styled="fade"></ui-divider>`,
    },
  ],
  states: [],
  variations: [
    SPACING_VARIATION,
    {
      name: 'Raised',
      attribute: 'raised',
      description: 'add depth with a dual-line effect',
      usageLevel: 3,
      exampleCode: `<ui-divider raised></ui-divider>`,
    },
    {
      name: 'Align',
      attribute: 'align',
      description: 'align text or icon position',
      usageLevel: 3,
      options: [
        {
          name: 'Start',
          value: 'start',
          description: 'align to the start (left/top)',
        },
        {
          name: 'Center',
          value: 'center',
          description: 'align to the center (default)',
        },
        {
          name: 'End',
          value: 'end',
          description: 'align to the end (right/bottom)',
        },
      ],
      exampleCode: `<ui-divider text="Section" align="start"></ui-divider>`,
    },
    {
      name: 'Thickness',
      attribute: 'thickness',
      description: 'control line thickness',
      usageLevel: 4,
      options: [
        {
          name: 'Thin',
          value: 'thin',
          description: 'appear with a thin line',
        },
        {
          name: 'Medium',
          value: 'medium',
          description: 'appear with normal thickness',
        },
        {
          name: 'Thick',
          value: 'thick',
          description: 'appear with a thick line',
        },
      ],
      exampleCode: `<ui-divider thickness="thick"></ui-divider>`,
    },
    {
      name: 'Inset',
      attribute: 'inset',
      description: 'indent its content from the start edge',
      usageLevel: 4,
      options: [
        {
          name: 'Small',
          value: 'inset-small',
          description: 'inset a small amount',
        },
        {
          name: 'Medium',
          value: 'inset-medium',
          description: 'inset a medium amount',
        },
        {
          name: 'Large',
          value: 'inset-large',
          description: 'inset a large amount',
        },
      ],
      exampleCode: `<ui-divider inset="medium"></ui-divider>`,
    },
    {
      name: 'Hidden',
      attribute: 'hidden',
      description: 'divide without a visible line',
      usageLevel: 4,
      exampleCode: `<ui-divider hidden></ui-divider>`,
    },
    {
      name: 'Clearing',
      attribute: 'clearing',
      description: 'clear floated content',
      usageLevel: 5,
      exampleCode: `<ui-divider clearing></ui-divider>`,
    },
  ],
  settings: [],
  events: [],
  supportsPlural: false,
  examples: {
    defaultAttributes: {},
    defaultContent: '',
    defaultPluralContent: '',
  },
};

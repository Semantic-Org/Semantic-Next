import {
  COLOR_OPTIONS,
  ATTACHED_OPTIONS,
  ATTACHED_VARIATION,
  addOptionExamples,
  getStates,
  getVariations,
  modifyVariation,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Button',
  description: 'A button indicates a possible user action.',
  tagName: 'ui-button',
  exportName: 'UIButton',
  examples: {
    defaultPluralContent: `
      <ui-button>One</ui-button>
      <ui-button>Two</ui-button>
      <ui-button>Three</ui-button>
    `,
  },

  content: [
    {
      name: 'Icon',
      includeAttributeClass: true,
      attribute: 'icon',
      couplesWith: ['ui-icon'],
      description: 'include an icon',
      exampleCode: `<ui-button icon="pause">Pause</ui-button>`,
    },
    {
      name: 'Image',
      attribute: 'image',
      description: 'include an image',
      usageLevel: 2,
      separateExamples: false,
      exampleCode: [
        `<ui-button>
          <img src="/images/avatar/small/jenny.jpg" />
          Add Jenny
        </ui-button>`,
        `<ui-button>
          <ui-image src="/images/new-avatar/small/dima.jpg"></ui-image>
          Add Dima
        </ui-button>`,
      ],
    },
    {
      name: 'Badge',
      attribute: 'badge',
      description: 'display a notification badge',
      usageLevel: 3,
      exampleCode: `<ui-button badge="5">Messages</ui-button>`,
    },
  ],

  types: [
    {
      name: 'Icon Only',
      attribute: 'icon-only',
      description: 'be displayed without text',
      exampleCode: `<ui-button icon="save" icon-only></ui-button>\n<ui-button icon="hard-drive" icon-only></ui-button>`,
    },
    {
      name: 'Link',
      attribute: 'link',
      description: 'be formatted as a page link',
      usageLevel: 1,
    },
    {
      name: 'Styled',
      attribute: 'styled',
      description: 'be styled to fit into a layout',
      usageLevel: 1,
      separateExamples: false,
      includeAttributeClass: true,
      options: [
        {
          name: 'Subtle',
          value: 'subtle',
          description: 'be styled to be de-emphasized',
        },
        {
          name: 'Flat',
          value: 'flat',
          description: 'be styled to appear flat',
        },
        {
          name: 'Outline',
          value: 'outline',
          description: 'be styled to appear outlined',
        },
        {
          name: 'Ghost',
          value: 'ghost',
          description: 'only show styling when hovered',
        },
      ],
    },
    {
      name: 'Animated',
      attribute: 'animated',
      description: 'animate to show hidden content',
      includeAttributeClass: true,
      usageLevel: 3,
      options: [
        {
          name: 'Animated',
          value: ['horizontal-animated'],
          description: 'animate hidden content horizontally',
          exampleCode: `
            <ui-button animated>
              <span slot="visible">Hover Me</span>
              <span slot="hidden">Hidden</span>
            </ui-button>
          `,
        },
        {
          name: 'Vertical Animated',
          value: 'vertical-animated',
          description: 'animate hidden content vertically',
          exampleCode: `
            <ui-button vertical-animated>
              <span slot="visible">Hover Me</span>
              <span slot="hidden">Hidden</span>
            </ui-button>
          `,
        },
        {
          name: 'Fade Animated',
          value: ['fade-animated'],
          description: 'fade in hidden content',
          exampleCode: `
            <ui-button fade-animated>
              <span slot="visible">Hover Me</span>
              <span slot="hidden">Hidden</span>
            </ui-button>
          `,
        },
      ],
    },
  ],

  states: getStates(['hover', 'pressed', 'focus', 'active', 'disabled', 'loading']),

  variations: [
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      description: 'be emphasized in a layout',
      usageLevel: 1,
      includeAttributeClass: true,
      options: [
        {
          name: 'Primary',
          value: 'primary',
          description: 'be emphasized as the first action that should be taken',
        },
        {
          name: 'Secondary',
          value: 'secondary',
          description: 'be emphasized as a secondary option'
        },
      ],
    },
    ...getVariations(['floated', 'fluid', 'compact', 'size', 'circular']),

    modifyVariation(ATTACHED_VARIATION, {
      options: addOptionExamples(ATTACHED_OPTIONS, {
        'top-attached': `
          <ui-button top-attached>Top Action</ui-button>
          <ui-segment bottom-attached>Attached content below</ui-segment>
        `,
        'attached': `
          <ui-segment top-attached>Content above</ui-segment>
          <ui-button attached>Middle Action</ui-button>
          <ui-segment bottom-attached>Content below</ui-segment>
        `,
        'bottom-attached': `
          <ui-segment top-attached>Attached content above</ui-segment>
          <ui-button bottom-attached>Bottom Action</ui-button>
        `,
        'left-attached': `
          <ui-segments horizontal>
            <ui-button left-attached icon="user">View Profile</ui-button>
            <ui-segment>Text to the right</ui-segment>
          </ui-segments>
        `,
        'right-attached': `
          <ui-segments horizontal>
            <ui-segment>Text to the left</ui-segment>
            <ui-button right-attached icon="user">View Profile</ui-button>
          </ui-segments>
        `,
      }),
    }),
    {
      name: 'Toggle',
      attribute: 'toggle',
      description: 'emphasize its active state',
      usageLevel: 3,
      exampleCode: `
        <ui-button toggle>Inactive</ui-button>
        <ui-button toggle active>Active</ui-button>
      `,
    },
    {
      name: 'Type',
      attribute: 'type',
      description: 'be a standard html button type',
      usageLevel: 3,
      options: [
        {
          name: 'Submit',
          value: 'submit',
          description: 'submit the surrounding form',
        },
        {
          name: 'Reset',
          value: 'reset',
          description: 'reset the surrounding form',
        },
      ],
    },
    {
      name: 'Colored',
      attribute: 'color',
      includeAttributeClass: true,
      description: 'be colored',
      usageLevel: 3,
      separateExamples: true,
      // Generate repetitive color examples programmatically!
      singularExampleCode: [
        COLOR_OPTIONS.map(c => `<ui-button ${c.value}>${c.name}</ui-button>`).join('\n'),
        COLOR_OPTIONS.map(c => `<ui-button subtle ${c.value}>${c.name}</ui-button>`).join('\n'),
        COLOR_OPTIONS.map(c => `<ui-button flat ${c.value}>${c.name}</ui-button>`).join('\n'),
        COLOR_OPTIONS.map(c => `<ui-button outline ${c.value}>${c.name}</ui-button>`).join('\n'),
        COLOR_OPTIONS.map(c => `<ui-button ghost ${c.value}>${c.name}</ui-button>`).join('\n'),
      ],
      options: COLOR_OPTIONS,
    },
    {
      name: 'Social Site',
      attribute: 'social',
      value: 'social',
      usageLevel: 5,
      description: 'appear formatted with the brand colors of a social website',
      includeAttributeClass: true,
      options: [
        {
          name: 'Instagram',
          value: 'instagram',
          description: 'match the brand colors of Instagram',
          exampleCode: `<ui-button instagram icon="instagram">Instagram</ui-button>`,
        },
        {
          name: 'Facebook',
          value: 'facebook',
          description: 'match the brand colors of Facebook',
          exampleCode: `<ui-button facebook icon="facebook">Facebook</ui-button>`,
        },
        {
          name: 'Twitter',
          value: 'twitter',
          description: 'match the brand colors of Twitter',
          exampleCode: `<ui-button twitter icon="twitter">Twitter</ui-button>`,
        },
        {
          name: 'Linkedin',
          value: 'linkedin',
          description: 'match the brand colors of LinkedIn',
          exampleCode: `<ui-button linkedin icon="linkedin">LinkedIn</ui-button>`,
        },
        {
          name: 'Youtube',
          value: 'youtube',
          description: 'match the brand colors of YouTube',
          exampleCode: `<ui-button youtube icon="youtube">YouTube</ui-button>`,
        },
      ],
    },
    {
      name: 'Positive',
      attribute: 'positive',
      usageLevel: 2,
      description: 'indicate a positive action',
      options: [
        {
          name: 'Positive',
          value: 'positive',
          description: 'be positive',
        },
        {
          name: 'Subtle Positive',
          value: 'subtle-positive',
          description: 'subtly hint at a positive action',
        },
      ],
    },
    {
      name: 'Warning',
      attribute: 'warning',
      usageLevel: 2,
      description: 'indicate a potentially dangerous action',
      options: [
        {
          name: 'Warning',
          value: 'warning',
          description: 'be dangerous',
        },
        {
          name: 'Subtle Warning',
          value: 'subtle-warning',
          description: 'subtly hint it may be dangerous',
        },
      ],
    },
    {
      name: 'Negative',
      attribute: 'negative',
      usageLevel: 2,
      description: 'indicate a negative action',
      options: [
        {
          name: 'Negative',
          value: 'negative',
          description: 'be negative',
        },
        {
          name: 'Subtle Negative',
          value: 'subtle-negative',
          description: 'subtly hint at a negative action',
        },
      ],
    },
    {
      name: 'Info',
      attribute: 'info',
      usageLevel: 2,
      description: 'indicate it contains information',
      options: [
        {
          name: 'Info',
          value: 'info',
          description: 'appear dangerous',
        },
        {
          name: 'Subtle Info',
          value: 'subtle-info',
          description: 'subtly hint it may be dangerous',
        },
      ],
    },
    {
      name: 'Transparent',
      attribute: 'transparent',
      usageLevel: 2,
      description: 'appear transparent',
      exampleCode: `
        <div class="transparent segments">
          <div class="standard segment">
            <ui-button transparent>Transparent</ui-button>
          </div>
        </div>
      `,
    },
  ],

  settings: [
    {
      name: 'Icon After',
      type: 'boolean',
      attribute: 'icon-after',
      defaultValue: false,
      description: 'Enable to position the icon after the text',
    },
    {
      name: 'Href',
      type: 'string',
      attribute: 'href',
      description: 'link to a webpage',
    },
  ],

  // Plural (group) support
  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'ui-buttons',
  pluralExportName: 'UIButtons',
  pluralDescription: 'Buttons can exist together as a group',

  pluralContent: [
    {
      name: 'Conditional',
      attribute: 'conditional',
      slot: 'conditional',
      description: 'show a conditional choice',
      exampleCode: `
        <ui-buttons>
          <ui-button>Cancel</ui-button>
          <span class="conditional">or</span>
          <ui-button primary>Save</ui-button>
        </ui-buttons>
      `,
    },
  ],

  pluralSharedTypes: ['styled', 'icon'],

  pluralOnlyTypes: [
    {
      name: 'Vertical',
      attribute: 'vertical',
      description: 'be arranged vertically',
      usageLevel: 3,
    },
  ],

  pluralOnlyVariations: [
    {
      name: 'Separate',
      attribute: 'separate',
      description: 'have separated items',
    },
    {
      name: 'Equal Width',
      attribute: 'equal-width',
      description: 'have the same width for each button',
      includeAttributeClass: true,
      usageLevel: 3,
      options: [
        {
          name: 'Two',
          value: 'two',
          description: 'have two items evenly split',
          exampleCode: `
            <ui-buttons equal-width="two">
              <ui-button>One</ui-button>
              <ui-button>Two</ui-button>
            </ui-buttons>
          `,
        },
        {
          name: 'Three',
          value: 'three',
          description: 'have three items evenly split',
          exampleCode: `
            <ui-buttons equal-width="three">
              <ui-button>One</ui-button>
              <ui-button>Two</ui-button>
              <ui-button>Three</ui-button>
            </ui-buttons>
          `,
        },
        {
          name: 'Four',
          value: 'four',
          description: 'have four items evenly split',
          exampleCode: `
            <ui-buttons equal-width="four">
              <ui-button>One</ui-button>
              <ui-button>Two</ui-button>
              <ui-button>Three</ui-button>
              <ui-button>Four</ui-button>
            </ui-buttons>
          `,
        },
        {
          name: 'Five',
          value: 'five',
          description: 'have five items evenly split',
          exampleCode: `
            <ui-buttons equal-width="five">
              <ui-button>One</ui-button>
              <ui-button>Two</ui-button>
              <ui-button>Three</ui-button>
              <ui-button>Four</ui-button>
              <ui-button>Five</ui-button>
            </ui-buttons>
          `,
        },
        {
          name: 'Six',
          value: 'six',
          description: 'have six items evenly split',
          exampleCode: `
            <ui-buttons equal-width="six">
              <ui-button>One</ui-button>
              <ui-button>Two</ui-button>
              <ui-button>Three</ui-button>
              <ui-button>Four</ui-button>
              <ui-button>Five</ui-button>
              <ui-button>Six</ui-button>
            </ui-buttons>
          `,
        },
      ],
    },
  ],

  pluralSharedVariations: [
    'size',
    'floated',
    'compact',
    'color',
    'styled',
    'attached',
  ],
};

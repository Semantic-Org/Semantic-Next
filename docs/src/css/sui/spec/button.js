const ButtonSpec = {

  /*******************************
             Definition
  *******************************/

  uiType: 'element',
  name: 'Button',
  description: 'A button indicates possible user action',

  /*******************************
             Singular

  *******************************/

  tagName: 'ui-button',
  exportName: 'UIButton',

  content: [
    {
      name: 'Text',
      looseCoupling: true,
      attribute: 'text',
      couplesWith: ['icon'],
      slot: 'default',
      description: 'A button can can contain text content',
    },
    {
      name: 'Icon',
      looseCoupling: true,
      includeAttributeClass: true,
      attribute: 'icon',
      couplesWith: ['icon'],
      slot: 'icon',
      description: 'A button can be formatted to include an icon',
    },

    {
      name: 'Label',
      looseCoupling: true,
      attribute: 'label',
      couplesWith: ['label'],
      slot: 'label',
      description: 'A button can be formatted to include a label',
    },

  ],

  /*-------------------
          Types
  --------------------*/

  types: [

    {
      name: 'Emphasis',
      attribute: 'emphasis',
      description: 'A button can be formatted to show different levels of emphasis',
      usageLevel: 1,
      options: [
        {
          name: 'Primary',
          value: 'primary',
          description: 'This button should appear to be emphasized as the first action that should be taken over other options.',
          example: '<ui-button emphasis="primary">Primary</ui-button>'
        },
        {
          name: 'Secondary',
          value: 'secondary',
          description: 'This button should appear to be emphasized as a secondary option that should appear after other options',
          example: '<ui-button emphasis="secondary">Secondary</ui-button>'
        },
      ],
    },

    {
      name: 'Icon',
      attribute: 'icon-only',
      description: 'A button can appear with only an icon',
      example: '<ui-button icon="pause">Pause</ui-button>',
      usageLevel: 2,
    },

    {
      name: 'Labeled',
      attribute: 'labeled',
      description: 'A button can appear specially formatted to attach to a label element',
      usageLevel: 3,

      looseCoupling: true,
      couplesWith: ['label'],

      options: [
        {
          name: 'Labeled',
          value: ['labeled', 'right-labeled'],
          description: 'A button can be formatted so that a label appears to the right'
        },
        {
          name: 'Left Labeled',
          value: 'left-labeled',
          description: 'A button can be formatted so that a label appears to the left'
        },
      ],
    },

    {
      name: 'Toggle',
      description: 'A button can be formatted to emphasize its active state',
      usageLevel: 3,
    },

    {
      name: 'Animated',
      attribute: 'animated',
      description: 'A button can animate to show hidden content',
      includeAttributeClass: true,
      usageLevel: 3,
      options: [
        {
          name: 'Animated',
          value: [true, 'horizontal-animated'],
          description: 'A button can be formatted to animate hidden content horizontally'
        },
        {
          name: 'Vertical Animated',
          value: 'vertical-animated',
          description: 'A button can be formatted to animate hidden content vertically'
        },
        {
          name: 'Fade Animated',
          value: 'fade-animated',
          description: 'A button can be formatted to fade in hidden content'
        },
      ],
    },

  ],

  /*-------------------
         States
  --------------------*/

  states: [
    {
      name: 'Hover',
      attribute: 'hover',
      description: 'A button can show it is currently hovered',
    },
    {
      name: 'Focus',
      attribute: 'focus',
      description: 'A button can show it is currently focused by the keyboard',
    },
    {
      name: 'Active',
      attribute: 'active',
      description: 'A button can show it is currently the activated',
    },
    {
      name: 'Disabled',
      attribute: 'disabled',
      includeAttributeClass: true,
      description: 'A button can disable interactions',
      options: [
        {
          name: 'Disabled',
          value: 'disabled',
          description: 'A button can disable interactions',
        },
        {
          name: 'Clickable Disabled',
          value: 'clickable-disabled',
          description: 'A button can allow interactions but warn that it is interactable.',
        },
      ],
    },
    {
      name: 'Loading',
      attribute: 'loading',
      description: 'A button can show a loading indicator',
    },
  ],

  /*-------------------
        Variations
  --------------------*/

  variations: [
    {
      name: 'Attached',
      attribute: 'attached',
      description: 'A button can be attached',
      usageLevel: 2,
      includeAttributeClass: true,
      options: [
        {
          name: 'Attached',
          value: 'attached',
          description: 'A button can appear attached both above and below'
        },
        {
          name: 'Bottom Attached',
          value: 'bottom-attached',
          description: 'A button can appear attached to the bottom of other content'
        },
        {
          name: 'Top Attached',
          value: 'top-attached',
          description: 'A button can appear attached to the top of other content'
        },
        {
          name: 'Left Attached',
          value: 'left-attached',
          description: 'A button can appear attached to the left of other content'
        },
        {
          name: 'Right Attached',
          value: 'right-attached',
          description: 'A button can appear attached to the right of other content'
        },
      ]
    },

    {
      name: 'Basic',
      attribute: 'styling',
      description: 'A button can be formatted to appear de-emphasized over other elements in the page.',
      usageLevel: 2,
      options: [
        {
          name: 'Basic',
          value: 'basic',
          description: 'A button can appear slightly less pronounced.'
        },
        {
          name: 'Very Basic',
          value: 'very-basic',
          description: 'A button can be much less pronounced.'
        },
      ]
    },

    {
      name: 'Circular',
      attribute: 'circular',
      description: 'A button can be formatted to appear circular',
      usageLevel: 3,
    },

    {
      name: 'Colored',
      attribute: 'color',
      description: 'A button can be colored',
      usageLevel: 3,
      options: [
        {
          name: 'Red',
          value: 'red',
          description: 'A button can be red'
        },
        {
          name: 'Orange',
          value: 'orange',
          description: 'A button can be orange'
        },
        {
          name: 'Yellow',
          value: 'yellow',
          description: 'A button can be yellow'
        },
        {
          name: 'Olive',
          value: 'olive',
          description: 'A button can be olive'
        },
        {
          name: 'Green',
          value: 'green',
          description: 'A button can be green'
        },
        {
          name: 'Teal',
          value: 'teal',
          description: 'A button can be teal'
        },
        {
          name: 'Blue',
          value: 'blue',
          description: 'A button can be blue'
        },
        {
          name: 'Violet',
          value: 'violet',
          description: 'A button can be violet'
        },
        {
          name: 'Purple',
          value: 'purple',
          description: 'A button can be purple'
        },
        {
          name: 'Pink',
          value: 'pink',
          description: 'A button can be pink'
        },
        {
          name: 'Brown',
          value: 'brown',
          description: 'A button can be brown'
        },
        {
          name: 'Grey',
          value: 'grey',
          description: 'A button can be grey'
        },
        {
          name: 'Black',
          value: 'black',
          description: 'A button can be black'
        },
      ]
    },

    {
      name: 'Compact',
      attribute: 'compact',
      usageLevel: 3,
      description: 'A button can reduce its padding to fit into tighter spaces without adjusting its font size',
      options: [
        {
          name: 'Compact',
          value: true,
          description: 'A button can reduce its padding size slightly.'
        },
        {
          name: 'Very Compact',
          value: 'very-compact',
          description: 'A button can reduce its padding size greatly.'
        },
      ]
    },

    {
      name: 'Social Site',
      attribute: 'social',
      value: 'social',
      usageLevel: 5,
      description: 'A button can appear formatted with the brand colors of a social website',
      options: [
        {
          name: 'Facebook',
          value: 'facebook',
          description: 'A button can link to facebook'
        },
        {
          name: 'Twitter',
          value: 'twitter',
          description: 'A button can link to twitter'
        },
        {
          name: 'Linkedin',
          value: 'linkedin',
          description: 'A button can link to linkedin'
        },
        {
          name: 'Instagram',
          value: 'instagram',
          description: 'A button can link to instagram'
        },
        {
          name: 'Youtube',
          value: 'youtube',
          description: 'A button can link to youtube'
        },
      ]
    },

    {
      name: 'Positive',
      attribute: 'positive',
      usageLevel: 2,
      description: 'A button can be associated with a positive action',
      options: [
        {
          name: 'Positive',
          value: ['positive'],
          description: 'A button be positive.'
        },
        {
          name: 'Subtle Positive',
          value: 'subtle-positive',
          description: 'A button can subtly hint at a positive action'
        },
      ]
    },

    {
      name: 'Warning',
      attribute: 'warning',
      usageLevel: 2,
      description: 'A button can be associated with a potentially dangerous action',
      options: [
        {
          name: 'Warning',
          value: ['warning'],
          description: 'may be dangerous.'
        },
        {
          name: 'Subtle Warning',
          value: 'subtle-warning',
          description: 'A button can subtly hint it may be dangerous'
        },
      ]
    },

    {
      name: 'Negative',
      attribute: 'negative',
      usageLevel: 2,
      description: 'A button can be associated with a negative action',
      options: [
        {
          name: 'Negative',
          value: ['negative'],
          description: 'A button be negative.'
        },
        {
          name: 'Subtle Negative',
          value: 'subtle-negative',
          description: 'A button can subtly hint at a negative action'
        },
      ]
    },

    {
      name: 'Info',
      attribute: 'info',
      usageLevel: 2,
      description: 'A button can be associated with a potentially dangerous action',
      options: [
        {
          name: 'Info',
          value: ['info'],
          description: 'may be dangerous.'
        },
        {
          name: 'Subtle Info',
          value: 'subtle-info',
          description: 'A button can subtly hint it may be dangerous'
        },
      ]
    },

    {
      name: 'Transparent',
      attribute: 'transparent',
      usageLevel: 2,
      description: 'A button can apper transparent',
    },

    {
      name: 'Floated',
      attribute: 'floated',
      usageLevel: 1,
      description: 'A button can be aligned to the left or right of its container',
      options: [
        {
          name: 'Left Floated',
          value: ['left-floated'],
          description: 'A button can appear to the left of content.'
        },
        {
          name: 'Right Floated',
          value: 'right-floated',
          description: 'A button can appear to the right of content.'
        },
      ]
    },

    {
      name: 'Fluid',
      attribute: 'fluid',
      usageLevel: 1,
      description: 'A button can take the width of its container',
    },

    {
      name: 'Size',
      attribute: 'size',
      usageLevel: 1,
      description: 'A button can vary in size',
      options: [
        {
          name: 'Mini',
          value: 'mini',
          description: 'An element can appear extremely small'
        },
        {
          name: 'Tiny',
          value: 'tiny',
          description: 'An element can appear very small'
        },
        {
          name: 'Small',
          value: 'small',
          description: 'An element can appear small'
        },
        {
          name: 'Medium',
          value: 'medium',
          description: 'An element can appear normal sized'
        },
        {
          name: 'Large',
          value: 'large',
          description: 'An element can appear larger than normal'
        },
        {
          name: 'Big',
          value: 'big',
          description: 'An element can appear much larger than normal'
        },
        {
          name: 'Huge',
          value: 'huge',
          description: 'An element can appear very much larger than normal'
        },
        {
          name: 'Massive',
          value: 'massive',
          description: 'An element can appear extremely larger than normal'
        },
      ]
    },

    {
      name: 'Inverted',
      description: 'A button can be formatted to appear on dark backgrounds',
      usageLevel: 2,
      attribute: 'inverted',
    },
  ],

  settings: [

    {
      name: 'Icon After',
      type: Boolean,
      attribute: 'icon-after',
      defaultValue: false,
      description: 'Enable to position the icon after the text',
    },

  ],

  /*******************************
              Plural
  *******************************/

  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'ui-buttons',
  pluralExportName: 'UIButtons',
  pluralDescription: 'Buttons can exist together as a group',

  pluralContent: [
    {
      name: 'Or',
      attribute: 'or',
      slot: 'or',
      description: 'A button group can be formatted to show a conditional choice',
    },
  ],

  pluralSharedTypes: [],
  pluralOnlyTypes: [
    {
      name: 'vertical',
      attribute: 'vertical',
      description: 'A button group can be formatted to show buttons in a vertical stack',
      usageLevel: 3,
    }
  ],

  pluralOnlyVariations: [
    {
      name: 'Separate',
      attribute: 'separate',
      description: 'A button group can appear with their buttons separated',
    },
    {
      name: 'Equal Width',
      attribute: 'equal-width',
      description: 'A button group can be formatted to have the same width for each button',
      usageLevel: 3,
      options: [
        {
          name: 'Two',
          value: 'two',
          description: 'A button group can have two items evenly split'
        },
        {
          name: 'Three',
          value: 'three',
          description: 'A button group can have three items evenly split'
        },
        {
          name: 'Four',
          value: 'four',
          description: 'A button group can have four items evenly split'
        },
        {
          name: 'Five',
          value: 'five',
          description: 'A button group can have five items evenly split'
        },
        {
          name: 'Six',
          value: 'six',
          description: 'A button group can have six items evenly split'
        },
      ],
    },
  ],

  pluralSharedVariations: [
    'inverted',
    'size',
    'floated',
    'compact',
    'color',
    'attached',
  ]

};

export default ButtonSpec;
export { ButtonSpec };

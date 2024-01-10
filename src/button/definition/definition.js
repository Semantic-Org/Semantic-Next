export const ButtonDefinition = {

  /*******************************
             Definition
  *******************************/

  uiType: 'element',
  name: 'Button',
  description: 'A button indicates possible user action',
  tagName: 'button',

  /*******************************
             Singular
  *******************************/

  content: [
    {
      name: 'Text',
      looseCoupling: true,
      couplesWith: ['icon'],
      slot: 'icon',
      description: 'A button can can contain text content',
    },
    {
      name: 'Icon',
      looseCoupling: true,
      couplesWith: ['icon'],
      slot: 'icon',
      description: 'A button can be formatted to include an icon',
    },

    {
      name: 'Label',
      looseCoupling: true,
      couplesWith: ['label'],
      slot: 'label',
      description: 'A button can be formatted to include a label',
    },

    {
      name: 'Or',
      slot: 'or',
      description: 'A button group can be formatted to show a conditional choice',
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
      adoptionLevel: 1,
      options: [
        {
          name: 'Primary',
          value: 'primary',
          description: 'This button should appear to be emphasized as the first action that should be taken over other options.'
        },
        {
          name: 'Secondary',
          value: 'secondary',
          description: 'This button should appear to be emphasized as a secondary option that should appear after other options'
        },
      ]
    },

    {
      name: 'Icon',
      attribute: 'icon',
      description: 'A button can appear with an icon',
      adoptionLevel: 2,

      looseCoupling: true,
      couplesWith: ['icon'],
      distinctHTML: true,
    },

    {
      name: 'Labeled',
      attribute: 'labeled',
      description: 'A button can appear specially formatted to attach to a label element',
      adoptionLevel: 3,

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
      distinctHTML: true,
    },

    {
      name: 'Labeled Icon',
      description: 'A button can be formatted so that the icon appears separately.',
      looseCoupling: true,
      adoptionLevel: 3,
      options: [
        {
          name: 'Labeled',
          value: 'labeled',
          description: 'A button can be formatted so that the icon appears to the right'
        },
        {
          name: 'Left Labeled',
          value: 'left-labeled',
          description: 'A button can be formatted so that the icon appears to the left'
        },
      ],
      distinctHTML: true,
    },

    {
      name: 'Toggle',
      description: 'A button can be formatted to emphasize its active state',
      adoptionLevel: 3,
      options: [
        {
          name: 'Toggle',
          value: true,
          description: 'A button can be formatted to animate hidden content horizontally'
        },
      ],
      distinctHTML: true,
    },

    {
      name: 'Animated',
      description: 'A button can animate to show hidden content',
      adoptionLevel: 5,
      options: [
        {
          name: 'Animated',
          value: 'animated',
          description: 'A button can be formatted to animate hidden content horizontally'
        },
        {
          name: 'Vertical Animated',
          value: 'vertical-animated',
          description: 'A button can be formatted to animate hidden content vertically'
        },
        {
          name: 'Fade Animated',
          value: 'vertical-animated',
          description: 'A button can be formatted to fade in hidden content'
        },
      ],
      distinctHTML: true,
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
      description: 'A button can show it is currently unable to be interacted with',
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
      value: 'attached',
      description: 'A button can be attached',
      adoptionLevel: 2,
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
      value: 'styling',
      description: 'A button can be formatted to appear de-emphasized over other elements in the page.',
      adoptionLevel: 3,
      options: [
        {
          name: 'Basic',
          value: 'basic',
          description: 'A button can appear slightly less pronounced.'
        },
        {
          name: 'Very Basic',
          value: 'very-basic',
          description: 'A button can appear to be much less pronounced.'
        },
      ]
    },

    {
      name: 'Circular',
      value: 'circular',
      description: 'A button can be formatted to appear circular.',
      adoptionLevel: 3,
      options: [
        {
          name: 'Circular',
          value: true,
        },
      ]
    },

    {
      name: 'Colored',
      value: 'color',
      description: 'A button can be colored',
      adoptionLevel: 3,
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
      value: 'compact',
      adoptionLevel: 3,
      description: 'A button can reduce its padding to fit into tighter spaces without adjusting its font size',
      options: [
        {
          name: 'Compact',
          value: 'compact',
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
      value: 'social',
      adoptionLevel: 5,
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
          name: 'Google Plus',
          value: 'google plus',
          description: 'A button can link to google plus'
        },
        {
          name: 'Vk',
          value: 'vk',
          description: 'A button can link to vk'
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
      value: 'positive',
      adoptionLevel: 2,
      description: 'A button can appear to be associated with a positive action',
      options: [
        {
          name: 'Positive',
          value: 'positive',
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
      name: 'Negative',
      value: 'negative',
      adoptionLevel: 2,
      description: 'A button can appear to be associated with a negative action',
      options: [
        {
          name: 'Negative',
          value: 'negative',
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
      name: 'Floated',
      value: 'floated',
      adoptionLevel: 1,
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
      value: 'fluid',
      adoptionLevel: 1,
      description: 'A button can take the width of its container',
    },

    {
      name: 'Size',
      value: 'size',
      adoptionLevel: 1,
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
      adoptionLevel: 2,
      attribute: 'inverted',
    },
  ],


  /*******************************
              Plural
  *******************************/

  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'buttons',
  pluralDescription: 'Buttons can exist together as a group',

};

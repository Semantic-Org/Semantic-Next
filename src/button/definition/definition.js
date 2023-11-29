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
      name: 'Active',
      attribute: 'active',
      description: 'A button can show it is currently the active user selection',
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
      name: 'Styling',
      value: 'styling',
      description: 'A button can be formatted to appear de-emphasized over other elements in the page.',
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
      name: 'Size',
      value: 'size',
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
      description: 'A button can be formatted to appear on dark backgrounds.',
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

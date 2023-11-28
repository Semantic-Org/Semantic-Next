(() => {
  // src/button/button-definition.js
  var ButtonDefinition = {
    /*******************************
               Definition
    *******************************/
    uiType: "element",
    name: "Button",
    description: "A button indicates possible user action",
    tagName: "button",
    /*******************************
               Singular
    *******************************/
    /*-------------------
            Types
    --------------------*/
    types: [
      {
        name: "Emphasis",
        description: "A button can be formatted to show different levels of emphasis",
        adoptionLevel: 1,
        options: [
          {
            name: "Primary",
            attribute: "primary",
            description: "This button should appear to be emphasized as the first action that should be taken over other options."
          },
          {
            name: "Secondary",
            attribute: "secondary",
            description: "This button should appear to be emphasized as a secondary option that should appear after other options"
          }
        ]
      },
      {
        name: "Icon Only",
        description: "A button can appear with only an icon",
        adoptionLevel: 2,
        looseCoupling: true,
        couplesWith: ["icon"],
        options: [
          {
            name: "Icon Only",
            attribute: "icon"
          }
        ],
        distinctHTML: true
      },
      {
        name: "Labeled",
        description: "A button can appear specially formatted to attach to a label element",
        adoptionLevel: 3,
        looseCoupling: true,
        couplesWith: ["label"],
        options: [
          {
            name: "Labeled",
            attribute: "labeled",
            description: "A button can be formatted so that a label appears to the right"
          },
          {
            name: "Left Labeled",
            attribute: "left-labeled",
            description: "A button can be formatted so that a label appears to the left"
          }
        ],
        distinctHTML: true
      },
      {
        name: "Labeled Icon",
        description: "A button can be formatted so that the icon appears separately.",
        looseCoupling: true,
        adoptionLevel: 3,
        options: [
          {
            name: "Labeled",
            attribute: "labeled",
            description: "A button can be formatted so that the icon appears to the right"
          },
          {
            name: "Left Labeled",
            attribute: "left-labeled",
            description: "A button can be formatted so that the icon appears to the left"
          }
        ],
        distinctHTML: true
      },
      {
        name: "Animated",
        description: "A button can animate to show hidden content",
        adoptionLevel: 5,
        options: [
          {
            name: "Animated",
            attribute: "animated",
            description: "A button can be formatted to animate hidden content horizontally"
          },
          {
            name: "Vertical Animated",
            attribute: "vertical-animated",
            description: "A button can be formatted to animate hidden content vertically"
          },
          {
            name: "Fade Animated",
            attribute: "vertical-animated",
            description: "A button can be formatted to fade in hidden content"
          }
        ],
        distinctHTML: true
      }
    ],
    /*-------------------
           States
    --------------------*/
    states: [
      {
        name: "Active",
        attribute: "active",
        description: "A button can show it is currently the active user selection"
      },
      {
        name: "Disabled",
        attribute: "disabled",
        description: "A button can show it is currently unable to be interacted with"
      },
      {
        name: "Loading",
        attribute: "loading",
        description: "A button can show a loading indicator"
      }
    ],
    /*-------------------
          Variations
    --------------------*/
    variations: [
      {
        name: "Basic",
        description: "A button can be formatted to appear deemphasized over other elements in the page.",
        options: [
          {
            name: "Basic",
            attribute: "basic",
            description: "A button can appear slightly less pronounced."
          },
          {
            name: "Very Basic",
            attribute: "very-basic",
            description: "A button can appear to be much less pronounced."
          }
        ]
      },
      {
        name: "Inverted",
        description: "A button can be formatted to appear on dark backgrounds.",
        options: [
          {
            name: "Inverted",
            attribute: "inverted"
          }
        ]
      }
    ],
    /*******************************
                Plural
    *******************************/
    supportsPlural: true,
    pluralName: "Buttons",
    pluralTagName: "buttons",
    pluralDescription: "Buttons can exist together as a group"
  };
})();

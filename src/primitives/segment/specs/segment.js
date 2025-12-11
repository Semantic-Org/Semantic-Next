// Auto-generated from segment.json
export default {
  "uiType": "element",
  "name": "Segment",
  "description": "A segment is used to create a grouping of related content",
  "tagName": "ui-segment",
  "exportName": "UISegment",
  "content": [],
  "types": [
    {
      "name": "Emphasis",
      "attribute": "emphasis",
      "includeAttributeClass": true,
      "description": "be formatted to call attention to itself",
      "options": [
        {
          "name": "Primary",
          "value": "primary",
          "description": "have primary emphasis"
        },
        {
          "name": "Secondary",
          "value": "secondary",
          "description": "have secondary emphasis"
        },
        {
          "name": "Tertiary",
          "value": "tertiary",
          "description": "have tertiary emphasis"
        }
      ],
      "usageLevel": 2
    },
    {
      "name": "Vertical",
      "attribute": "vertical",
      "description": "format content to be aligned as part of a vertical group",
      "usageLevel": 2
    },
    {
      "name": "Raised",
      "attribute": "raised",
      "description": "be formatted to raise above the page",
      "usageLevel": 3
    },
    {
      "name": "Stacked",
      "attribute": "stacked",
      "description": "be formatted to show it contains multiple pages",
      "usageLevel": 5
    },
    {
      "name": "Piled",
      "attribute": "piled",
      "description": "be formatted to look like a pile of pages",
      "usageLevel": 5
    }
  ],
  "states": [
    {
      "name": "Disabled",
      "attribute": "disabled",
      "description": "show its content is disabled",
      "usageLevel": 2
    },
    {
      "name": "Loading",
      "attribute": "loading",
      "description": "show its content is being loaded",
      "usageLevel": 2
    }
  ],
  "variations": [
    {
      "name": "Attached",
      "attribute": "attached",
      "description": "be attached to other content on a page",
      "includeAttributeClass": true,
      "options": [
        {
          "name": "Top Attached",
          "value": "top-attached",
          "description": "be attached on top side only"
        },
        {
          "name": "Attached",
          "value": "attached",
          "description": "be attached on both sides"
        },
        {
          "name": "Bottom Attached",
          "value": "bottom-attached",
          "description": "be attached on bottom side only"
        }
      ],
      "usageLevel": 2
    },
    {
      "name": "Padded",
      "attribute": "padded",
      "description": "increase its padding",
      "options": [
        {
          "name": "Padded",
          "value": "padded",
          "description": "have standard increased padding"
        },
        {
          "name": "Very Padded",
          "value": "very-padded",
          "description": "have extra increased padding"
        }
      ],
      "usageLevel": 2
    },
    {
      "name": "Inline",
      "attribute": "inline",
      "usageLevel": 3,
      "description": "can appear inline with other "
    },
    {
      "name": "Compact",
      "attribute": "compact",
      "usageLevel": 3,
      "description": "reduce its padding",
      "options": [
        {
          "name": "Compact",
          "value": "compact",
          "description": "reduce its padding slightly"
        },
        {
          "name": "Very Compact",
          "value": "very-compact",
          "description": "reduce its padding greatly"
        }
      ]
    },
    {
      "name": "Colored",
      "attribute": "color",
      "description": "be colored",
      "includeAttributeClass": true,
      "options": [
        {
          "name": "Red",
          "value": "red"
        },
        {
          "name": "Orange",
          "value": "orange"
        },
        {
          "name": "Yellow",
          "value": "yellow"
        },
        {
          "name": "Olive",
          "value": "olive"
        },
        {
          "name": "Green",
          "value": "green"
        },
        {
          "name": "Teal",
          "value": "teal"
        },
        {
          "name": "Blue",
          "value": "blue"
        },
        {
          "name": "Violet",
          "value": "violet"
        },
        {
          "name": "Purple",
          "value": "purple"
        },
        {
          "name": "Pink",
          "value": "pink"
        },
        {
          "name": "Brown",
          "value": "brown"
        },
        {
          "name": "Grey",
          "value": "grey"
        },
        {
          "name": "Black",
          "value": "black"
        }
      ],
      "usageLevel": 2
    },
    {
      "name": "Circular",
      "attribute": "circular",
      "description": "be circular",
      "usageLevel": 3
    },
    {
      "name": "Clearing",
      "attribute": "clearing",
      "description": "clear floated content",
      "usageLevel": 3
    },
    {
      "name": "Floated",
      "attribute": "floated",
      "description": "appear to the left or right of other content",
      "options": [
        {
          "name": "Left Floated",
          "value": "left-floated",
          "description": "float to the left"
        },
        {
          "name": "Right Floated",
          "value": "right-floated",
          "description": "float to the right"
        }
      ],
      "usageLevel": 2
    },
    {
      "name": "Text Alignment",
      "attribute": "text-align",
      "description": "have its text aligned",
      "options": [
        {
          "name": "Left Aligned",
          "value": "left-aligned",
          "description": "align text to the left"
        },
        {
          "name": "Center Aligned",
          "value": "center-aligned",
          "description": "center align text"
        },
        {
          "name": "Right Aligned",
          "value": "right-aligned",
          "description": "align text to the right"
        }
      ],
      "usageLevel": 2
    },
    {
      "name": "Basic",
      "attribute": "basic",
      "description": "have no special formatting",
      "usageLevel": 2
    }
  ],
  "events": [],
  "settings": [],
  "supportsPlural": true,
  "pluralName": "Segments",
  "pluralTagName": "ui-segments",
  "pluralExportName": "UISegments",
  "pluralDescription": "Segments can be grouped together",
  "pluralContent": [],
  "pluralSharedTypes": [
    "raised",
    "stacked",
    "piled"
  ],
  "pluralOnlyTypes": [
    {
      "name": "Horizontal",
      "attribute": "horizontal",
      "description": "be arranged horizontally",
      "usageLevel": 3
    }
  ],
  "pluralSharedVariations": [
    "compact",
    "basic"
  ],
  "pluralOnlyVariations": [],
  "examples": {
    "defaultAttributes": {},
    "defaultPluralContent": "<ui-segment>First</ui-segment>\n<ui-segment>Second</ui-segment>\n<ui-segment>Third</ui-segment>"
  }
};

// Auto-generated from divider.json
export default {
  "uiType": "element",
  "name": "Divider",
  "description": "A divider visually segments content into groups",
  "tagName": "ui-divider",
  "exportName": "UIDivider",
  "content": [
    {
      "name": "Text",
      "attribute": "text",
      "description": "include centered text",
      "usageLevel": 1,
      "exampleCode": "<ui-divider text=\"Or\"></ui-divider>"
    },
    {
      "name": "Icon",
      "attribute": "icon",
      "couplesWith": [
        "ui-icon"
      ],
      "description": "include a centered icon",
      "usageLevel": 2,
      "exampleCode": "<ui-divider icon=\"tag\"></ui-divider>"
    }
  ],
  "types": [
    {
      "name": "Vertical",
      "attribute": "vertical",
      "description": "divide content vertically",
      "usageLevel": 3,
      "exampleCode": "<ui-divider vertical></ui-divider>"
    },
    {
      "name": "Styled",
      "attribute": "styled",
      "description": "be styled with different visual treatments",
      "usageLevel": 2,
      "options": [
        {
          "name": "Solid",
          "value": "solid",
          "description": "use a solid line"
        },
        {
          "name": "Fade",
          "value": "fade",
          "description": "fade from transparent at edges"
        },
        {
          "name": "Soft",
          "value": "soft",
          "description": "use shadow with no hard line"
        },
        {
          "name": "Double",
          "value": "double",
          "description": "use a double line"
        }
      ],
      "exampleCode": "<ui-divider styled=\"fade\"></ui-divider>"
    }
  ],
  "states": [],
  "variations": [
    {
      "name": "Spacing",
      "attribute": "spacing",
      "description": "adjust vertical spacing",
      "usageLevel": 1,
      "options": [
        {
          "name": "Mini",
          "value": "mini",
          "description": "appear with minimal spacing"
        },
        {
          "name": "Tiny",
          "value": "tiny",
          "description": "appear with very small spacing"
        },
        {
          "name": "Small",
          "value": "small",
          "description": "appear with small spacing"
        },
        {
          "name": "Medium",
          "value": "medium",
          "description": "appear with normal spacing"
        },
        {
          "name": "Large",
          "value": "large",
          "description": "appear with large spacing"
        },
        {
          "name": "Big",
          "value": "big",
          "description": "appear with big spacing"
        },
        {
          "name": "Huge",
          "value": "huge",
          "description": "appear with huge spacing"
        },
        {
          "name": "Massive",
          "value": "massive",
          "description": "appear with massive spacing"
        }
      ],
      "exampleCode": "<ui-divider large></ui-divider>"
    },
    {
      "name": "Hidden",
      "attribute": "hidden",
      "description": "divide without a visible line",
      "usageLevel": 4,
      "exampleCode": "<ui-divider hidden></ui-divider>"
    },
    {
      "name": "Clearing",
      "attribute": "clearing",
      "description": "clear floated content",
      "usageLevel": 5,
      "exampleCode": "<ui-divider clearing></ui-divider>"
    }
  ],
  "settings": [],
  "events": [],
  "supportsPlural": false,
  "examples": {
    "defaultAttributes": {},
    "defaultContent": "",
    "defaultPluralContent": ""
  }
};

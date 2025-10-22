// src/primitives/card/specs/card.json
var uiType = 'element';
var name = 'Card';
var description = 'A card displays segmented content in a manner similar to a playing card.';
var tagName = 'ui-card';
var exportName = 'UICard';
var examples = {};
var content = [
  {
    name: 'Icon',
    includeAttributeClass: true,
    attribute: 'icon',
    couplesWith: ['ui-icon'],
    description: 'include an icon',
    exampleCode: '<ui-card icon="pause"></ui-card>\n<ui-card>\n  <ui-icon pause slot="icon"></ui-icon>\n</ui-card>',
  },
  {
    name: 'Header',
    attribute: 'header',
    description: 'include an header',
    exampleCode:
      '<ui-card header="Header"></ui-card>\n<ui-card>\n  <div class="header">Header</div>\n</ui-card>\n<ui-card>\n  <div slot="header">Header</div>\n</ui-card>',
  },
  {
    name: 'Description',
    attribute: 'description',
    description: 'include a description',
    exampleCode:
      '<ui-card description="Description"></ui-card>\n<ui-card>\n  <div class="description">Description</div>\n</ui-card>\n<ui-card>\n  <div slot="description">Description</div>\n</ui-card>',
  },
  {
    name: 'Subheader',
    attribute: 'subheader',
    description: 'include an subheader',
    exampleCode:
      '<ui-card header="Header" subheader="Subheader"></ui-card>\n<ui-card>\n  <div class="header">Header</div>\n  <div class="subheader">Subheader</div>\n</ui-card>\n<ui-card>\n  <div slot="header">Header</div>\n  <div slot="subheader">Subheader</div>\n</ui-card>',
  },
  {
    name: 'Image',
    attribute: 'image',
    couplesWith: ['ui-image'],
    description: 'include an image',
    exampleCode: '<ui-card image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>',
  },
];
var types = [];
var states = [
  {
    name: 'Hover',
    attribute: 'hover',
    description: 'be hovered',
  },
  {
    name: 'Focus',
    attribute: 'focused',
    description: 'be focused by the keyboard',
  },
  {
    name: 'Disabled',
    attribute: 'disabled',
    includeAttributeClass: true,
    description: 'have interactions disabled',
    options: [
      {
        name: 'Disabled',
        value: 'disabled',
        description: 'disable interactions',
      },
      {
        name: 'Clickable Disabled',
        value: 'clickable-disabled',
        description: 'allow interactions but appear disabled',
      },
    ],
  },
];
var variations = [
  {
    name: 'Fluid',
    attribute: 'fluid',
    usageLevel: 1,
    description: 'take the width of its container',
  },
  {
    name: 'Link',
    attribute: 'link',
    usageLevel: 1,
    description: 'can be formatted as if the card can be clicked',
  },
  {
    name: 'Horizontal',
    attribute: 'horizontal',
    usageLevel: 1,
    description: 'can have content horizontally oriented',
    exampleCode: '<ui-card horizontal image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>',
  },
];
var settings = [
  {
    name: 'Href',
    type: 'string',
    attribute: 'href',
    description: 'link to a url',
  },
];
var supportsPlural = true;
var pluralName = 'Cards';
var pluralTagName = 'ui-cards';
var pluralExportName = 'UICards';
var pluralDescription = 'Cards can exist together as a group';
var pluralContent = [];
var pluralSharedTypes = ['link'];
var pluralOnlyTypes = [];
var pluralOnlyVariations = [
  {
    name: 'doubling',
    attribute: 'doubling',
    description: 'A group of cards can double its column width for mobile',
    usageLevel: 3,
  },
  {
    name: 'stackable',
    attribute: 'stackable',
    description: 'A group of cards can automatically stack rows to a single columns on mobile devices',
    usageLevel: 3,
  },
  {
    name: 'Spaced',
    attribute: 'spaced',
    description: 'A group of cards can adjust its spacing',
    usageLevel: 2,
    options: [
      {
        name: 'Spaced',
        value: 'spaced',
        description: 'A card group have increased spacing',
      },
      {
        name: 'Three',
        value: 'very-spaced',
        description: 'A card group can have very increased spacing',
      },
    ],
  },
  {
    name: 'Count',
    attribute: 'count',
    description: 'A group of cards can set how many cards should exist in a row',
    usageLevel: 3,
    options: [
      {
        name: 'Two',
        value: 'two',
        description: 'A card group can have two items per row',
      },
      {
        name: 'Three',
        value: 'three',
        description: 'A card group can have three items per row',
      },
      {
        name: 'Four',
        value: 'four',
        description: 'A card group can have four items per row',
      },
      {
        name: 'Five',
        value: 'five',
        description: 'A card group can have five items per row',
      },
      {
        name: 'Six',
        value: 'six',
        description: 'A card group can have six items per row',
      },
    ],
  },
];
var pluralSharedVariations = [];
var card_default = {
  uiType,
  name,
  description,
  tagName,
  exportName,
  examples,
  content,
  types,
  states,
  variations,
  settings,
  supportsPlural,
  pluralName,
  pluralTagName,
  pluralExportName,
  pluralDescription,
  pluralContent,
  pluralSharedTypes,
  pluralOnlyTypes,
  pluralOnlyVariations,
  pluralSharedVariations,
};
export {
  card_default as default,
  content,
  description,
  examples,
  exportName,
  name,
  pluralContent,
  pluralDescription,
  pluralExportName,
  pluralName,
  pluralOnlyTypes,
  pluralOnlyVariations,
  pluralSharedTypes,
  pluralSharedVariations,
  pluralTagName,
  settings,
  states,
  supportsPlural,
  tagName,
  types,
  uiType,
  variations,
};

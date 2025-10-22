// src/primitives/menu/specs/menu.json
var uiType = 'element';
var name = 'Menu';
var description = 'A menu displays grouped navigation actions';
var tagName = 'ui-menu';
var exportName = 'UIMenu';
var content = [
  {
    name: 'Item',
    tagName: 'menu-item',
    subcomponent: 'true',
    description: 'can include a menu item',
    usageLevel: 1,
  },
];
var types = [
  {
    name: 'Selection',
    attribute: 'selection',
    description: 'allow for selection between choices',
    usageLevel: 1,
  },
];
var variations = [
  {
    name: 'Evenly Spaced',
    attribute: 'evenly-spaced',
    description: 'have its items split space evenly',
    usageLevel: 1,
  },
  {
    name: 'Fitted',
    attribute: 'fitted',
    description: 'can remove its margin',
    usageLevel: 2,
  },
  {
    name: 'Vertical',
    attribute: 'vertical',
    description: 'can be displayed vertically',
    usageLevel: 1,
  },
  {
    name: 'Inset',
    attribute: 'inset',
    description: 'can have its menu items inset',
    usageLevel: 1,
  },
];
var events = [
  {
    eventName: 'change',
    description: 'can specify a function to occur after the value changes',
    arguments: [
      {
        name: 'value',
        description: 'the updated value',
      },
    ],
  },
];
var settings = [
  {
    name: 'Menu Items',
    type: 'array',
    attribute: 'items',
    description: 'can automatically generate menu items',
  },
  {
    name: 'Value',
    type: 'string',
    attribute: 'value',
    description: 'can specify the active menu item value when generating menu items',
  },
];
var examples = {
  defaultContent:
    '\n  <menu-item active>One</menu-item>\n  <menu-item>Two</menu-item>\n  <menu-item>Three</menu-item>\n',
};
var menu_default = {
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
  examples,
};
export {
  content,
  description,
  events,
  examples,
  exportName,
  menu_default as default,
  name,
  settings,
  tagName,
  types,
  uiType,
  variations,
};

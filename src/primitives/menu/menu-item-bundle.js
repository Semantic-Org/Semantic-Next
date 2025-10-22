// src/primitives/menu/specs/menu-item.json
var uiType = 'element';
var name = 'Menu Item';
var description = 'A menu item displays an individual selection in a menu';
var parentTag = 'ui-menu';
var tagName = 'menu-item';
var exportName = 'UIMenuItem';
var content = [
  {
    name: 'Icon',
    includeAttributeClass: true,
    attribute: 'icon',
    couplesWith: ['ui-icon'],
    slot: 'icon',
    description: 'include an icon',
    exampleCode: '<menu-item icon="home">Home</menu-item>',
  },
  {
    name: 'label',
    type: 'string',
    attribute: 'label',
    description: 'can specify a text label',
  },
  {
    name: 'badge',
    type: 'string',
    attribute: 'badge',
    description: 'can specify a badge to appear next to text',
  },
  {
    name: 'Href',
    type: 'string',
    attribute: 'href',
    description: 'can specify a link',
  },
  {
    name: 'Value',
    type: 'string',
    attribute: 'value',
    description: 'can specify a value',
  },
];
var states = [
  {
    name: 'Hover',
    attribute: 'hover',
    description: 'hovered',
  },
  {
    name: 'Focus',
    attribute: 'focused',
    description: 'focused by the keyboard',
  },
  {
    name: 'Active',
    attribute: 'active',
    description: 'activated',
  },
  {
    name: 'Disabled',
    attribute: 'disabled',
    description: 'disable interactions',
  },
];
var menu_item_default = {
  uiType,
  name,
  description,
  parentTag,
  tagName,
  exportName,
  content,
  states,
};
export { content, description, exportName, menu_item_default as default, name, parentTag, states, tagName, uiType };

import {
  getStates,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Menu Item',
  description: 'A menu item displays an individual selection in a menu',
  parentTag: 'ui-menu',
  tagName: 'menu-item',
  exportName: 'MenuItem',
  content: [
    {
      name: 'Icon',
      includeAttributeClass: true,
      attribute: 'icon',
      couplesWith: ['ui-icon'],
      slot: 'icon',
      description: 'include an icon',
      exampleCode: `<menu-item icon="home">Home</menu-item>`,
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
  ],
  settings: [
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
  ],
  states: getStates(['hover', 'focus', 'active', 'disabled']),
};

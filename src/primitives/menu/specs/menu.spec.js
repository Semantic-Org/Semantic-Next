export default {
  uiType: 'element',
  name: 'Menu',
  description: 'A menu displays grouped navigation actions',
  tagName: 'ui-menu',
  exportName: 'Menu',
  content: [
    {
      name: 'Item',
      tagName: 'menu-item',
      subcomponent: 'true',
      description: 'can include a menu item',
      usageLevel: 1,
    },
  ],
  types: [
    {
      name: 'Selection',
      attribute: 'selection',
      description: 'allow for selection between choices',
      usageLevel: 1,
    },
    {
      name: 'Sliding',
      attribute: 'sliding',
      description: 'indicate active selection with a sliding indicator',
      usageLevel: 1,
    },
  ],
  variations: [
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
    {
      name: 'Icon Only',
      attribute: 'icon-only',
      description: 'display only icons with labels shown as tooltips',
      usageLevel: 2,
    },
  ],
  events: [
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
  ],
  settings: [
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
    {
      name: 'Tooltip Settings',
      type: 'object',
      attribute: 'tooltip-settings',
      defaultValue: { duration: 0 },
      description: 'can configure tooltip settings when using icon-only',
    },
  ],
  examples: {
    defaultContent: `
  <menu-item active>One</menu-item>
  <menu-item>Two</menu-item>
  <menu-item>Three</menu-item>
`,
  },
};

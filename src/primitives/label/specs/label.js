// Auto-generated from label.json
export default {
  'uiType': 'element',
  'name': 'Label',
  'description': 'A label displays content classification',
  'tagName': 'ui-label',
  'exportName': 'UILabel',
  'content': [],
  'types': [
    {
      'name': 'Emphasis',
      'attribute': 'emphasis',
      'description': 'adjust its emphasis in a layout',
      'usageLevel': 1,
      'options': [
        {
          'name': 'Secondary',
          'value': 'secondary',
          'description': 'can be de-emphasized in a layout',
        },
        {
          'name': 'Outline',
          'value': 'outline',
          'description': 'can be very de-emphasized in a layout',
        },
      ],
    },
  ],
  'variations': [
    {
      'name': 'Badge',
      'attribute': 'badge',
      'description': 'be used as a badge to display counts or simple information next to text',
      'usageLevel': 2,
      'exampleCode':
        '<ui-label badge>12</ui-label><ui-label secondary badge>22</ui-label><ui-label outline badge>52</ui-label>',
    },
    {
      'name': 'Size',
      'attribute': 'size',
      'usageLevel': 1,
      'description': 'vary in size',
      'options': [
        {
          'name': 'Mini',
          'value': 'mini',
          'description': 'appear extremely small',
        },
        {
          'name': 'Tiny',
          'value': 'tiny',
          'description': 'appear very small',
        },
        {
          'name': 'Small',
          'value': 'small',
          'description': 'appear small',
        },
        {
          'name': 'Medium',
          'value': 'medium',
          'description': 'appear normal sized',
        },
        {
          'name': 'Large',
          'value': 'large',
          'description': 'appear larger than normal',
        },
        {
          'name': 'Big',
          'value': 'big',
          'description': 'appear much larger than normal',
        },
        {
          'name': 'Huge',
          'value': 'huge',
          'description': 'appear very much larger than normal',
        },
        {
          'name': 'Massive',
          'value': 'massive',
          'description': 'appear extremely larger than normal',
        },
      ],
    },
  ],
  'events': [],
  'settings': [],
};

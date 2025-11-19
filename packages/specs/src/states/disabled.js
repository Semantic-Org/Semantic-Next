export const DISABLED_STATE = {
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
};

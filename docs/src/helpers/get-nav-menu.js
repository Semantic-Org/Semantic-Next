export const getNavMenu = () => {
  const menu = [
    {
      name: 'Guide',
      icon: 'info circle',
      pages: [
        { name: 'Introduction', url: '/todo' },
        { name: 'Using Web Components', url: '/page-2' },
        { name: 'Web Components', url: '/page-3' },
      ],
    },
    {
      name: 'Theming',
      url: '/theming',
      icon: 'paint brush',
      pages: [
        { name: 'Using Themes', url: '/test' },
        { name: 'Creating Themes', url: '/page-a' },
        { name: 'Dev Tools', url: '/page-2' },
        { name: 'Figma & Prototyping', url: '/page-2' },
      ],
    },
    {
      name: 'CSS Components',
      icon: 'heart',
      pages: [
        { name: 'Site & Colors', url: '/page-3' },
        { name: 'Headers', url: '/page-4' },
        { name: 'Icons', url: '/page-4' },
      ],
    },
    {
      name: 'UI Components',
      icon: 'cubes ',
      pages: [
        { name: 'Site & Colors', url: '/page-3' },
        { name: 'Headers', url: '/page-4' },
        { name: 'Icons', url: '/page-4' },
      ],
    },
  ];
  return menu;
};

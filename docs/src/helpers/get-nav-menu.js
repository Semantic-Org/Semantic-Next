export const getNavMenu = () => {
  const menu = [
    {
      name: 'Guide',
      icon: 'info circle',
      pages: [
        { name: 'Introduction', url: '/page-1' },
        { name: 'Using Web Components', url: '/page-2' },
        { name: 'Web Components', url: '/page-3' },
      ],
    },
    {
      name: 'Theming',
      active: true,
      icon: 'paint brush',
      pages: [
        { name: 'Using Themes', url: '/button', active: true },
        { name: 'Creating Themes', url: '/todo' },
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
        {
          name: 'Essential',
          pages: [
            { name: 'Page 5', url: '/page-5' },
            { name: 'Page 6', url: '/page-6' },
          ],
        },
        {
          name: 'Form Components',
          pages: [
            { name: 'Page 7', url: '/page-7' },
            { name: 'Page 8', url: '/page-8' },
          ],
        },
        {
          name: 'Website Components',
          pages: [
            { name: 'Page 7', url: '/page-7' },
            { name: 'Page 8', url: '/page-8' },
          ],
        },
        {
          name: 'App Components',
          pages: [
            { name: 'Page 7', url: '/page-7' },
            { name: 'Page 8', url: '/page-8' },
          ],
        },
      ],
    },
  ];
  return menu;
};

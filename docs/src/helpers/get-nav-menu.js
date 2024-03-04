import { getCollection } from 'astro:content';

export const getNavMenu = async () => {

  const components = await getCollection('components');

  const componentPages = components.map(page => ({
    name: page.data.title,
    url: `/components/${page.slug}`,
  }));

  const menu = [
    {
      name: 'UI Components',
      url: '/test',
      icon: 'layers',
      pages: componentPages,
    },
    {
      name: 'Guide',
      url: '/guide',
      icon: 'book-open',
      pages: [
        { name: 'Introduction', url: '/todo' },
        { name: 'Using Web Components', url: '/page-2' },
        { name: 'Web Components', url: '/page-3' },
      ],
    },
    {
      name: 'Theming',
      url: '/theming',
      icon: 'tool',
      pages: [
        { name: 'Creating Themes', url: '/page-a' },
        { name: 'Dev Tools', url: '/page-2' },
        { name: 'Figma & Prototyping', url: '/page-2' },
      ],
    },
  ];
  return menu;
};

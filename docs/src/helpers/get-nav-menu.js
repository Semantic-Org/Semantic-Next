import { getCollection } from 'astro:content';

export const getNavMenu = async () => {

  const components = await getCollection('components');

  const componentPages = components.map(page => ({
    name: page.data.title,
    url: `/components/${page.slug}`,
    matchSubPaths: true,
  }));

  const menu = [
    {
      name: 'Introduction',
      url: '/introduction',
      icon: 'open book',
      pages: [
        {
          name: 'Quick Start',
          url: '/getting-started'
        },
        {
          name: 'Usage',
          url: '/usage'
        },
        {
          name: 'Expert Guide',
          url: '/expert-guide'
        },
        {
          name: 'Web Components',
          url: '/web-components'
        },
        {
          name: 'Templating',
          url: '/templating'
        }
      ]
    },
    {
      name: 'Components',
      url: '/components',
      icon: 'layers',
      pages: componentPages,
    },
    {
      name: 'Test',
      url: '/test',
      icon: 'code',
    },
  ];
  return menu;
};

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

import { getCollection } from 'astro:content';

export const getNavMenu = async (category) => {

  const components = await getCollection('components');

  const componentPages = components.map(page => ({
    name: page.data.title,
    url: `/ui/${page.slug}`,
    matchSubPaths: true,
  }));

  const frameworkMenu = [

    {
      name: 'Components',
      url: '/components',
      icon: 'package',
      pages: [
        {
          name: 'Lifecycle',
          url: '/components/lifecycle'
        },
        {
          name: 'Data Sources',
          url: '/components/data'
        },
        {
          name: 'DOM Manipulation',
          url: '/components/dom'
        },
        {
          name: 'Events',
          url: '/components/dom'
        },
        {
          name: 'Reactivity',
          url: '/components/reactivity'
        },
      ]
    },
    {
      name: 'Templates',
      url: '/templates',
      icon: 'table',
      pages: [
        {
          name: 'Control Structures',
          url: '/templates/control'
        },
        {
          name: 'Looping',
          url: '/templates/looping'
        },
        {
          name: 'Outputting Data',
          url: '/templates/data'
        },
        {
          name: 'Calling Methods',
          url: '/templates/methods'
        },
        {
          name: 'Global Helpers',
          url: '/templates/helpers'
        },
        {
          name: 'Outputting HTML',
          url: '/templates/html'
        },
        {
          name: 'Subtemplates',
          url: '/templates/sub-templates'
        },
      ]
    },
    {
      name: 'Server Side Rendering',
      url: '/ssr',
      icon: 'server',
      pages: [
        {
          name: 'Overview',
          url: '/ssr/overview'
        },
        {
          name: 'Best Practices',
          url: '/ssr/best-practices'
        },
        {
          name: 'Gotchas',
          url: '/ssr/gotchas'
        },
      ]
    },
    {
      name: 'Reactivity',
      description: 'Signals',
      url: '/reactivity',
      icon: 'cpu',
      pages: [
        {
          name: 'Variables',
          description: 'Signal',
          url: '/reactivity/reactive-var'
        },
        {
          name: 'Reactions',
          description: 'Computation',
          url: '/reactivity/reaction'
        },
        {
          name: 'Flushing Changes',
          url: '/reactivity/flush'
        },
        {
          name: 'Stopping Reactions',
          url: '/reactivity/peek'
        },
        {
          name: 'Avoiding Reactivity',
          url: '/reactivity/peek'
        },
        {
          name: 'Performance',
          url: '/reactivity/guard'
        },
        {
          name: 'Array Helpers',
          url: '/reactivity/events'
        },
        {
          name: 'Object Helpers',
          url: '/reactivity/content'
        },
        {
          name: 'Debugging',
          url: '/reactivity/sizing'
        },
      ]
    },
    {
      name: 'Query',
      description: 'DOM Helpers',
      url: '/query',
      icon: 'mouse-pointer',
      pages: [
        {
          name: 'DOM Traversal',
          url: '/query/dom'
        },
        {
          name: 'Attributes',
          url: '/query/attributes'
        },
        {
          name: 'Events',
          url: '/query/events'
        },
        {
          name: 'Content',
          url: '/query/content'
        },
        {
          name: 'Sizing',
          url: '/query/sizing'
        },
        {
          name: 'DOM Manipulation',
          url: '/query/dom-manipulation'
        },
        {
          name: 'Utilities',
          url: '/query/utilities'
        },
        {
          name: 'Forms',
          url: '/query/form'
        },
      ]
    },
    {
      name: 'Utils',
      description: 'JS Helpers',
      url: '/utils',
      icon: 'tool',
      pages: [
        {
          name: 'Types',
          url: '/utils/types'
        },
        {
          name: 'Arrays',
          url: '/utils/arrays'
        },
        {
          name: 'Objects',
          url: '/utils/objects'
        },
        {
          name: 'Strings',
          url: '/utils/strings'
        },
        {
          name: 'Regular Expressions',
          url: '/utils/regex'
        },
        {
          name: 'Looping',
          url: '/utils/looping'
        },
        {
          name: 'Equality',
          url: '/utils/equality'
        },
        {
          name: 'Cloning',
          url: '/utils/cloning'
        },
        {
          name: 'Crypto',
          url: '/utils/crypto'
        },
        {
          name: 'Errors',
          url: '/utils/errors'
        },
        {
          name: 'SSR',
          url: '/utils/ssr'
        },
      ]
    },
  ];

  const uiMenu = [
    {
      name: 'Getting Started',
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
      name: 'Tutorial',
      url: '/tutorial',
      icon: 'help circle',
    },
    {
      name: 'UI Components',
      url: '/ui',
      icon: 'layers',
      pages: componentPages,
    },
    {
      name: 'Test',
      url: '/test',
      icon: 'code',
    },
  ];

  const menus = {
    framework: frameworkMenu,
    ui: uiMenu,
  };
  return menus[category];
};

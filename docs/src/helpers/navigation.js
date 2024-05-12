import { getCollection } from 'astro:content';
import { firstMatch, groupBy, asyncEach, each, flatten, keys, isArray, inArray, isString, any } from '@semantic-ui/utils';

const components = await getCollection('components');
const componentPages = components.map(page => ({
  name: page.data.title,
  url: `/ui/${page.slug}`,
  matchSubPaths: true,
}));

const examples = await getCollection('examples');
const examplePages = examples.map(page => ({
  ...page.data,
  url: `/examples/${page.slug}`,
}));

export const topbarMenu =  [
  {
    _id: 'ui',
    name: 'Design Framework',
    url: '/introduction',
  },
  {
    _id: 'framework',
    name: 'Tech Docs',
    url: '/components',
  },
  {
    _id: 'examples',
    name: 'Examples',
    url: '/examples/counter',
    baseURL: '/examples'
  },
  {
    _id: 'playground',
    name: 'Playground',
    url: '/playground',
  },
];


export const sidebarMenuUI = [
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
        name: 'Framework Integration',
        url: '/framework-integration'
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

export const sidebarMenuFramework = [
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


const createExampleMenu = () => {
  const categories = groupBy(examplePages, 'category');
  let menu = [];

  each(categories, (examples, category) => {
    let subcategories = groupBy(examples, 'subcategory');
    let pages = [];
    if(keys(subcategories).length) {
      // has subcategories
      each(subcategories, (examples, subcategory) => {
        pages.push({
          name: subcategory,
          pages: examples.map(example => ({
            name: example.title,
            url: example.url
          }))
        });
      });
    }
    else {
      // no subcategories
      pages = examples.map(example => ({
        name: example.title,
        url: example.url
      }));
    }
    menu.push({
      name: category,
      pages
    });
  });
  return menu;
};
export const sidebarMenuExamples = createExampleMenu();

export const removeTrailingSlash = (url = '') => {
  return isString(url)
    ? url.replace(/\/$/, '')
    : url
  ;
};

export const getActiveTopbarSection = async (activeURL = '') => {
  activeURL = removeTrailingSlash(activeURL);
  const topbarMenuWithLinks = await getTopBarMenu();
  const isActive = (item) => {
    if(isArray(item.baseURLs) && any(item.baseURLs, baseURL => activeURL.startsWith(baseURL))) {
      return true;
    }
    if(item.baseURL && activeURL.startsWith(item.baseURL)) {
      return true;
    }
    if (item?.url === activeURL) {
      return true;
    }
    return false;
  };
  const activeItem = firstMatch(topbarMenuWithLinks, isActive);
  return activeItem?._id;
};


export const getSidebarMenu = async ({url, topbarSection}) => {
  let menu = [];
  if(url && !topbarSection) {
    topbarSection = await getActiveTopbarSection(url);
  }
  if(topbarSection == 'ui') {
    menu = sidebarMenuUI;
  }
  else if(topbarSection == 'framework') {
    menu = sidebarMenuFramework;
  }
  else if(topbarSection == 'examples') {
    menu = sidebarMenuExamples;
  }
  return menu;
};

export const getFlattenedSidebarMenu = async (topbarSection) => {
  const menu = await getSidebarMenu({ topbarSection: topbarSection });
  const menuArrays = menu.map(section => {
    const parentItem = { name: section.name, url: section.url };
    return [
      parentItem,
      ...(section.pages || [])
    ];
  });
  return flatten(menuArrays);
};

export const getTopBarMenu = async () => {
  const menu = topbarMenu;
  await asyncEach(menu, async item => {
    const flattenedMenu = await getFlattenedSidebarMenu(item._id);
    const urls = flattenedMenu.map(page => page.url);
    item.baseURLs = urls;
  });
  return menu;
};

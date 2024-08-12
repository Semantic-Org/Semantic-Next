import { getCollection } from 'astro:content';
import { firstMatch, get, groupBy, asyncEach, each, flatten, keys, isArray, inArray, isString, any, unique } from '@semantic-ui/utils';

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
    name: 'UI Framework',
    url: '/introduction',
  },
  {
    _id: 'framework',
    name: 'Tech Guide',
    url: '/components',
  },
  {
    _id: 'api',
    name: 'API Reference',
    url: '/api',
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
        name: 'Using Components',
        url: '/usage'
      },
      {
        name: 'What are Web Components',
        url: '/web-components'
      },
      /*{
        name: 'Expert Guide',
        url: '/expert-guide'
      },*/
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
        name: 'Creating Components',
        url: '/components/create'
      },
      {
        name: 'Defining Functionality',
        url: '/components/instances'
      },
      {
        name: 'Lifecycle Events',
        url: '/components/lifecycle'
      },
      {
        name: 'Templates & Data Context',
        url: '/components/rendering'
      },
      {
        name: 'Event Listeners',
        url: '/components/events'
      },
      {
        name: 'Reactivity',
        url: '/components/reactivity'
      },
      {
        name: 'Accessing DOM',
        url: '/components/dom'
      },
      {
        name: 'CSS & Styling',
        url: '/components/styling'
      },
      {
        name: 'Key Bindings',
        url: '/components/keys'
      },
    ]
  },
  {
    name: 'Templates',
    url: '/templates',
    icon: 'table',
    pages: [
      {
        name: 'Expressions',
        url: '/templates/expressions'
      },
      {
        name: 'Conditionals',
        url: '/templates/conditionals'
      },
      {
        name: 'Loops',
        url: '/templates/looping'
      },
      {
        name: 'Content Slots',
        url: '/templates/slots'
      },
      {
        name: 'Global Helpers',
        url: '/templates/helpers'
      },
      {
        name: 'Subtemplates',
        url: '/templates/subtemplates'
      },
      {
        name: 'Snippets',
        url: '/templates/snippets'
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
        name: 'Variables & Reactions',
        description: 'Signal',
        url: '/reactivity/variables'
      },
      {
        name: 'Flushing',
        url: '/reactivity/flush'
      },
      {
        name: 'Reactive Computations',
        url: '/reactivity/computations'
      },
      {
        name: 'Controlling Reactivity',
        url: '/reactivity/controls'
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
        url: '/reactivity/debugging'
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

  const getCategoryIcon = (category) => {
    const group = firstMatch(sidebarMenuFramework, (group => group.name == category));
    if(group) {
      return group?.icon;
    }
  };

  each(categories, (examples, category) => {
    let subcategories = groupBy(examples, 'subcategory');
    let pages = [];
    if(keys(subcategories).length) {
      // has subcategories
      each(subcategories, (examples, subcategory) => {
        pages.push({
          name: subcategory,
          pages: examples.map(example => ({
            name: example.shortTitle || example.title,
            url: example.url
          }))
        });
      });
    }
    else {
      // no subcategories
      pages = examples.map(example => ({
        name: example.shortTitle || example.title,
        url: example.url
      }));
    }
    menu.push({
      name: category,
      icon: getCategoryIcon(category),
      pages
    });
  });
  return menu.filter(menu => menu);
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
  const topbarMenuWithLinks = await getTopbarMenu();
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

export const getMobileMenu = async ({url, topbarSection}) => {
  let menu = [];
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
  return flatten(menuArrays).filter(Boolean);
};

export const getTopbarMenu = async () => {
  const menu = topbarMenu;
  await asyncEach(menu, async item => {
    const flattenedMenu = await getFlattenedSidebarMenu(item._id);
    const urls = flattenedMenu.map(page => page.url);
    item.baseURLs = urls;
  });
  return menu;
};

export const getRailMenu = (headings) => {
  let menu = [];
  let menuGroup;

  const headingLevels = unique(headings.map(heading => heading.depth)).sort();
  const lowestHeadingLevel = headingLevels[0];

  each(headings, heading => {
    // new grouping
    if(heading.depth == lowestHeadingLevel) {
      if(menuGroup) {
        menu.push(menuGroup);
      }
      menuGroup = {
        id: heading.slug,
        title: heading.text,
        items: []
      };
    }
    else if(menuGroup) {
      // only pay attention to 1 level deeper
      if(heading.depth == headingLevels[1]) {
        menuGroup.items.push({
          id: heading.slug,
          title: heading.text
        });
      }
    }
  });
  menu.push(menuGroup);
  return menu.filter(Boolean);
};

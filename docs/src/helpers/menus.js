import { sortBy } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';

/* UI Component pages are generated dynamically */
const primitives = sortBy(await getCollection('primitives'), 'slug');
export const primitivePages = primitives.map(page => ({
  name: page.data.title,
  description: page.data.description,
  imageSrc: page.data.imageSrc,
  darkImageSrc: page.data.darkImageSrc,
  url: `/ui/primitives/${page.slug}`,
  matchSubPaths: true,
}));

const components = sortBy(await getCollection('components'), 'slug');
export const componentPages = components.map(page => ({
  name: page.data.title,
  description: page.data.description,
  imageSrc: page.data.imageSrc,
  darkImageSrc: page.data.darkImageSrc,
  url: `/ui/components/${page.slug}`,
  matchSubPaths: true,
}));

const behaviors = sortBy(await getCollection('behaviors'), 'slug');
export const behaviorPages = behaviors.map(page => ({
  name: page.data.title,
  description: page.data.description,
  imageSrc: page.data.imageSrc,
  darkImageSrc: page.data.darkImageSrc,
  url: `/ui/behaviors/${page.slug}`,
  matchSubPaths: true,
}));

/* Define sort order for example categories */
const exampleCategorySortOrder = [
  'Framework',
  'UI Components',
  'Templates',
  'Reactivity',
  'Query',
  'Utils',
];

/* Define sort order for subcategories within each category */
const subCategorySortOrder = {
  'Framework': [
    'Intro',
    'Usage',
    'Lifecycle',
    'Events',
    'Styling',
    'Settings',
    'Keybinding',
    'Comms',
    'Specs',
  ],
  'UI Components': [
    'Interactive',
    'Data Display',
    'Complex',
    'Feedback',
    'Form Elements',
    'Canvas',
    'SVG',
  ],
  'Templates': [
    'Conditionals',
    'Loops',
    'Expressions',
    'Expression Syntax',
    'Events',
    'Slots',
    'Snippets',
    'Subtemplates',
    'Async',
    'Reactivity',
    'Helpers',
  ],
  'Reactivity': [
    'Introduction',
    'Signals',
    'Reactions',
    'Flushing',
    'Settings',
    'Helpers',
    'Performance',
    'Controls',
    'Advanced',
  ],
  'Query': [
    'Setup',
    'Introduction',
    'Selectors',
    'Plugins / Behaviors',
    'Standard Plugins',
    'Components',
    'Attributes',
    'Content',
    'CSS',
    'Dimensions',
    'Visibility',
    'DOM Manipulation',
    'DOM Traversal',
    'DOM Access',
    'Events',
    'Iterators',
    'Logical Operators',
    'Collections',
  ],
  'Utils': [
    'Setup',
    'Looping',
    'Arrays',
    'Objects',
    'Types',
    'Strings',
    'Functions',
    'Colors',
    'CSS',
    'HTML',
    'Browser',
    'Cloning',
    'Crypto',
    'Dates',
    'Debug',
    'Environment',
    'Equality',
    'Numbers',
    'Regex',
    'Debug',
  ],
};

/* Standardized Icons across Subsections for Sidebar Menu */
export const standardMenuIcons = {
  'User Guides': 'book',
  'Authoring Guide': 'book',
  'Authoring Guides': 'book',
  'Guide': 'book',
  'Guides': 'book',
  'User Guides': 'book',
  'Start Here': 'zap',
  'start': 'zap',
  'Getting Started': 'zap',
  'Introduction': 'zap',
  'Quick Start': 'zap',
  'Install & Setup': 'zap',
  'Tokens': 'theme',
  'Styling': 'theme',
  'CSS Tokens': 'theme',
  'CSS Framework': 'theme',
  'CSS Theming': 'theme',
  'Templates': 'table',
  'Framework': 'package',
  'Primitives': 'layers',
  'UI Primitives': 'layers',
  'Components': 'package',
  'UI Components': 'package',
  'Behaviors': 'cpu',
  'UI Behaviors': 'cpu',
  'Reactivity': 'activity',
  'Query': 'mouse pointer',
  'Advanced Usage': 'server',
  'API References': 'code',
  'API Reference': 'code',
  'Reference Docs': 'code',
  'Utils': 'tool',
};

/* Export subcategory sort order for use in navigation.js */
export { subCategorySortOrder };

/* Create dynamic menu entries for examples based on actual categories */
const exampleCategoryMenus = exampleCategorySortOrder.map(category => {
  const categoryID = category.toLowerCase().replace(/\s+/g, '-');
  return {
    _id: `examples-${categoryID}`,
    name: category,
    url: `/examples/${categoryID}`, // handled by navigation
    baseURL: `/examples/${categoryID}`,
  };
});

/* Topbar Menu */
export const topbarDisplayMenu = [
  {
    _id: 'ui',
    _ids: ['start', 'css', 'primitives', 'components', 'behaviors'],
    name: 'UI Framework',
    url: '/ui/start',
  },
  {
    /* This is the ids of the submenu in sidebar */
    _ids: ['framework', 'api'],
    name: 'Docs',
    url: '/docs/guides',
  },
  {
    _id: 'learn',
    name: 'Learn',
    url: '/learn/selection',
    baseURL: '/learn',
  },
  {
    /* This is the ids of the submenu in sidebar */
    _ids: exampleCategoryMenus.map(menu => menu._id),
    name: 'Examples',
    url: '/examples/counter',
    baseURL: '/examples',
  }, /*
  {
    _id: 'playground',
    name: 'Playground',
    url: '/playground',
  },*/
];

/* These are all site sections topbar and sidebar together  */
export const topbarMenu = [
  // UI Framework
  {
    _id: 'start',
    name: 'Start Here',
    icon: 'zap',
    url: '/ui/start',
  },
  {
    _id: 'css',
    name: 'Styling',
    icon: 'theme',
    url: '/ui/css',
  },
  {
    _id: 'primitives',
    name: 'Primitives',
    icon: 'layers',
    url: '/ui/primitives',
  },
  {
    _id: 'components',
    name: 'Components',
    icon: 'package',
    url: '/ui/components',
  },
  {
    _id: 'behaviors',
    name: 'Behaviors',
    icon: 'cpu',
    url: '/ui/behaviors',
  },
  // API Docs
  {
    _id: 'framework',
    name: 'Guide',
    url: '/docs/guides',
  },
  {
    _id: 'api',
    name: 'API Reference',
    url: '/docs/api',
  },
  // Learn
  {
    _id: 'learn',
    name: 'Learn',
    url: '/learn/selection',
    baseURL: '/learn',
  },
  // Examples
  ...exampleCategoryMenus,
  /*
  {
    _id: 'playground',
    name: 'Playground',
    url: '/playground',
  },
  */
];

/* Setup & Install Sidebar */
export const sidebarMenuStart = [
  {
    name: 'Introduction',
    url: '/ui/start',
    icon: 'book open',
  },
  {
    name: 'Why Semantic?',
    url: '/ui/start/why-semantic',
    icon: 'zap',
  },
  {
    name: 'Installation',
    url: '/ui/start/install',
    icon: 'code',
  },
  {
    name: "What's New?",
    icon: 'sparkles',
    url: '/ui/start/whats-new',
    description: '0.12.0',
  },
  {
    name: 'Roadmap',
    icon: 'calendar',
    url: '/ui/roadmap',
  },
  {
    name: 'Getting Started',
    url: '/ui/start/guides',
    icon: 'book',
    pages: [
      {
        name: 'Using UI',
        url: '/ui/start/guides/using-ui',
      },
      {
        name: 'Creating UI',
        url: '/ui/start/guides/creating-ui',
      },
      {
        name: 'Theming',
        url: '/ui/start/guides/theming',
      },
    ],
  },
  {
    name: 'Ecosystems',
    url: '/ui/start/ecosystems',
    icon: 'box',
    pages: [
      {
        name: 'Vanilla JS',
        url: '/ui/start/ecosystems/vanilla',
      },
      {
        name: 'React',
        url: '/ui/start/ecosystems/react',
      },
      {
        name: 'Svelte',
        url: '/ui/start/ecosystems/svelte',
      },
      {
        name: 'Vue',
        url: '/ui/start/ecosystems/vue',
      },
      {
        name: 'Angular',
        url: '/ui/start/ecosystems/angular',
      },
      {
        name: 'Astro',
        url: '/ui/start/ecosystems/astro',
      },
      {
        name: 'Next',
        url: '/ui/start/ecosystems/next',
      },
    ],
  },
  {
    name: 'Philosophy',
    url: '/ui/start/philosophy',
    icon: 'chat',
    pages: [
      {
        name: 'Natural Language',
        url: '/ui/start/philosophy/natural-language',
      },
      {
        name: 'About the Project',
        url: '/ui/start/philosophy/project',
      },
    ],
  },
];

/* CSS Token Sidebar */
export const sidebarMenuCSS = [
  {
    name: 'CSS Tokens',
    url: '/ui/css/tokens',
    icon: 'theme',
    pages: [
      {
        name: 'Colors',
        url: '/ui/css/tokens/colors',
      },
      {
        name: 'Text',
        url: '/ui/css/tokens/text',
      },
      {
        name: 'Spacing',
        url: '/ui/css/tokens/spacing',
      },
      {
        name: 'Sizes',
        url: '/ui/css/tokens/sizes',
      },
      {
        name: 'Gradients',
        url: '/ui/css/tokens/gradients',
      },
      {
        name: 'Shadows',
        url: '/ui/css/tokens/shadows',
      },
    ],
  },
  {
    name: 'Styling Guide',
    url: '/ui/css/concepts',
    icon: 'book',
    pages: [
      {
        name: 'Basic Theming',
        url: '/ui/css/concepts/theming',
      },
      {
        name: 'Dark Mode',
        url: '/ui/css/concepts/dark-mode',
      },
      {
        name: 'Styling Web Components',
        url: '/ui/css/concepts/components',
      },
      {
        name: 'Responsive Patterns',
        url: '/ui/css/concepts/responsive',
      },
      {
        name: 'Style Inheritance',
        url: '/ui/css/concepts/style',
      },
      {
        name: 'Dynamic Sizing',
        url: '/ui/css/concepts/sizes',
      },
    ],
  },
];

/* Primitive Sidebar */
export const sidebarMenuPrimitives = [
  {
    name: 'Primitives',
    url: '/ui/primitives',
    icon: 'layers',
    pages: primitivePages,
  },
];

/* Component Sidebar */
export const sidebarMenuComponents = [
  {
    name: 'Components',
    url: '/ui/components',
    icon: 'package',
    pages: componentPages,
  },
];

/* Behavior Sidebar */
export const sidebarMenuBehaviors = [
  {
    name: 'Behaviors',
    url: '/ui/behaviors',
    icon: 'cpu',
    pages: behaviorPages,
  },
];

/* Component Framework Sidebar — re-exported from standalone file */
export { sidebarMenuFramework } from './doc-menu-items.js';

/* API Reference Sidebar — re-exported from standalone file */
export { sidebarMenuAPI } from './doc-menu-items.js';

import { sortBy } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';

/* UI Component pages are generated dynamically */
const primitives = sortBy(await getCollection('primitives'), 'slug');
export const primitivePages = primitives.map(page => ({
  name: page.data.title,
  url: `/ui/primitives/${page.slug}`,
  matchSubPaths: true,
}));

const components = sortBy(await getCollection('components'), 'slug');
export const componentPages = components.map(page => ({
  name: page.data.title,
  url: `/ui/components/${page.slug}`,
  matchSubPaths: true,
}));

const behaviors = sortBy(await getCollection('behaviors'), 'slug');
export const behaviorPages = behaviors.map(page => ({
  name: page.data.title,
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
    'Events',
    'Iterators',
    'Logical Operators',
    'Utilities',
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
    'Browser',
    'Dates',
    'Numbers',
    'Environment',
    'Crypto',
    'Equality',
    'Cloning',
    'Errors',
    'Regex',
  ],
};

/* Standardized Icons across Subsections for Sidebar Menu */
export const standardMenuIcons = {
  'User Guide': 'book',
  'Authoring Guide': 'book',
  'Authoring Guides': 'book',
  'Guides': 'book',
  'Start Here': 'zap',
  'Install': 'zap',
  'Getting Started': 'zap',
  'Introduction': 'zap',
  'Quick Start': 'zap',
  'Install & Setup': 'zap',
  'Tokens': 'droplet',
  'Styling': 'droplet',
  'CSS Tokens': 'droplet',
  'CSS Framework': 'droplet',
  'CSS Theming': 'droplet',
  'User Guide': 'home',
  'Templates': 'table',
  'Framework': 'package',
  'Primitives': 'layers',
  'UI Primitives': 'layers',
  'Components': 'package',
  'UI Components': 'package',
  'Behaviors': 'cpu',
  'UI Behaviors': 'cpu',
  'Reactivity': 'cpu',
  'Query': 'mouse pointer',
  'Advanced Usage': 'server',
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
    _ids: ['install', 'css', 'primitives', 'components', 'behaviors'],
    name: 'UI Framework',
    url: '/why-semantic',
  },
  {
    /* This is the ids of the submenu in sidebar */
    _ids: ['framework', 'api'],
    name: 'Docs',
    url: '/docs',
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
    _id: 'install',
    name: 'Start Here',
    url: '/why-semantic',
  },
  {
    _id: 'css',
    name: 'Styling',
    url: '/css',
  },
  {
    _id: 'primitives',
    name: 'Primitives',
    url: '/ui/primitives',
  },
  {
    _id: 'components',
    name: 'Components',
    url: '/ui/components',
  },
  {
    _id: 'behaviors',
    name: 'Behaviors',
    url: '/ui/behaviors',
  },
  // API Docs
  {
    _id: 'framework',
    name: 'User Guide',
    url: '/docs',
  },
  {
    _id: 'api',
    name: 'API Reference',
    url: '/api',
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
export const sidebarMenuInstall = [
  {
    name: 'Why Semantic UI?',
    url: '/why-semantic',
    icon: 'zap',
  },
  {
    name: 'Installation',
    url: '/install',
    icon: 'code',
  },
  {
    name: "What's New?",
    icon: 'radio',
    url: '/whats-new',
  },
  {
    name: 'Frameworks',
    url: '/frameworks',
    icon: 'box',
    pages: [
      {
        name: 'Vanilla JS',
        url: '/install/frameworks/vanilla',
      },
      {
        name: 'React',
        url: '/install/frameworks/react',
      },
      {
        name: 'Vue',
        url: '/install/frameworks/vue',
      },
      {
        name: 'Angular',
        url: '/install/frameworks/angular',
      },
      {
        name: 'Svelte',
        url: '/install/frameworks/svelte',
      },
    ],
  },
  {
    name: 'Basic Guides',
    url: '/usage',
    icon: 'book',
    pages: [
      {
        name: 'Using UI Components',
        url: '/usage/primitives',
      },
      {
        name: 'Theming',
        url: '/usage/theming',
      },
      {
        name: 'Creating UI Components',
        url: '/usage/components',
      },
    ],
  },
  {
    name: 'Philosophy',
    url: '/install',
    icon: 'message-circle',
    pages: [
      {
        name: 'Natural Language',
        url: '/about/natural-language',
      },
      {
        name: 'About the Project',
        url: '/about/project',
      },
    ],
  },
];

/* CSS Token Sidebar */
export const sidebarMenuCSS = [
  {
    name: 'CSS Tokens',
    url: '/css/tokens',
    icon: 'droplet',
    pages: [
      {
        name: 'Colors',
        url: '/css/tokens/colors',
      },
      {
        name: 'Text',
        url: '/css/tokens/text',
      },
      {
        name: 'Spacing',
        url: '/css/tokens/spacing',
      },
      {
        name: 'Sizes',
        url: '/css/tokens/sizes',
      },
      {
        name: 'Gradients',
        url: '/css/tokens/gradients',
      },
      {
        name: 'Shadows',
        url: '/css/tokens/shadows',
      },
    ],
  },
  {
    name: 'Core Concepts',
    url: '/css/concepts',
    icon: 'droplet',
    pages: [
      {
        name: 'Basic Theming',
        url: '/css/concepts/theming',
      },
      {
        name: 'Dark Mode',
        url: '/css/concepts/dark-mode',
      },
      {
        name: 'Styling Web Components',
        url: '/css/concepts/components',
      },
      {
        name: 'Responsive Patterns',
        url: '/css/concepts/responsive',
      },
      {
        name: 'Style Inheritance',
        url: '/css/concepts/style',
      },
      {
        name: 'Dynamic Sizing',
        url: '/css/concepts/sizes',
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
    url: '/ui-components',
    icon: 'package',
    pages: componentPages,
  },
];

/* Behavior Sidebar */
export const sidebarMenuBehaviors = [
  {
    name: 'Behaviors',
    url: '/behaviors',
    icon: 'package',
    pages: behaviorPages,
  },
];

/* Component Framework Sidebar */
export const sidebarMenuFramework = [
  {
    name: 'Overview',
    url: '/docs',
    icon: 'open book',
  },
  {
    name: 'Components',
    url: '/components',
    icon: 'package',
    pages: [
      {
        name: 'Creating',
        url: '/components/create',
      },
      {
        name: 'Functionality',
        url: '/components/instances',
      },
      {
        name: 'Lifecycle',
        url: '/components/lifecycle',
      },
      {
        name: 'Templates & Data',
        url: '/components/rendering',
      },
      {
        name: 'Settings',
        url: '/components/settings',
      },
      {
        name: 'State',
        url: '/components/state',
      },
      {
        name: 'Events',
        url: '/components/events',
      },
      {
        name: 'Reactivity',
        url: '/components/reactivity',
      },
      {
        name: 'DOM',
        url: '/components/dom',
      },
      {
        name: 'Styling',
        url: '/components/styling',
      },
      {
        name: 'Key Bindings',
        url: '/components/keys',
      },
    ],
  },
  {
    name: 'Templates',
    url: '/templates',
    icon: 'table',
    pages: [
      {
        name: 'Expressions',
        url: '/templates/expressions',
      },
      {
        name: 'Conditionals',
        url: '/templates/conditionals',
      },
      {
        name: 'Loops',
        url: '/templates/loops',
      },
      {
        name: 'Async',
        url: '/templates/async',
      },
      {
        name: 'Slots',
        url: '/templates/slots',
      },
      {
        name: 'Subtemplates',
        url: '/templates/subtemplates',
      },
      {
        name: 'Snippets',
        url: '/templates/snippets',
      },
      {
        name: 'Reactivity',
        url: '/templates/reactivity',
      },
      {
        name: 'Helpers',
        url: '/templates/helpers',
      },
    ],
  },
  {
    name: 'Reactivity',
    description: 'Signals',
    url: '/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Signals',
        description: 'Reactive state primitive',
        url: '/reactivity/signals',
      },
      {
        name: 'Dependent Signals',
        description: 'Derived and computed signals',
        url: '/reactivity/dependent-signals',
      },
      {
        name: 'Reactions',
        description: 'Reactive computations',
        url: '/reactivity/reactions',
      },
      {
        name: 'Mutations',
        url: '/reactivity/mutation-helpers',
      },
      {
        name: 'Flushing',
        url: '/reactivity/flush',
      },
      {
        name: 'Reactive Controls',
        url: '/reactivity/controls',
      },
      {
        name: 'Performance',
        url: '/reactivity/performance',
      },
      {
        name: 'Debugging',
        url: '/reactivity/debugging',
      },
      {
        name: 'Advanced Options',
        description: 'Equality & Cloning',
        url: '/reactivity/signal-options',
      },
    ],
  },
  {
    name: 'Query',
    description: 'DOM Helpers',
    url: '/query',
    icon: 'mouse-pointer',
    pages: [
      {
        name: 'Basics',
        url: '/query/basics',
      },
      {
        name: 'Shadow DOM',
        url: '/query/shadow-dom',
      },
      {
        name: 'Components',
        url: '/query/components',
      },
      {
        name: 'Chaining',
        url: '/query/chaining',
      },
      {
        name: 'Plugins',
        url: '/query/plugins',
      },
      {
        name: 'Browser Usage',
        url: '/query/browser',
      },
    ],
  },
  {
    name: 'Advanced Usage',
    url: '/advanced',
    icon: 'server',
    pages: [
      {
        name: 'Common Issues',
        url: '/advanced/common-issues',
      },
      {
        name: 'Server Side Rendering',
        url: '/advanced/ssr',
      },
    ],
  },
];

export const sidebarMenuAPI = [
  {
    name: 'Components',
    url: '/api/component',
    icon: 'package',
    pages: [
      {
        name: 'Define Component',
        url: '/api/component/define-component',
      },
      {
        name: 'Utility Functions',
        url: '/api/component/utilities',
      },
      {
        name: 'Base Class',
        url: '/api/component/web-component-base',
      },
    ],
  },
  {
    name: 'Template Helpers',
    url: '/api/helpers',
    icon: 'book-open',
    pages: [
      {
        name: 'Arrays',
        url: '/api/helpers/arrays',
      },
      {
        name: 'Comparison',
        url: '/api/helpers/comparison',
      },
      {
        name: 'CSS',
        url: '/api/helpers/css',
      },
      {
        name: 'Dates',
        url: '/api/helpers/dates',
      },
      {
        name: 'Debug',
        url: '/api/helpers/debug',
      },
      {
        name: 'Logical Operators',
        url: '/api/helpers/logical',
      },
      {
        name: 'Numeric',
        url: '/api/helpers/numeric',
      },
      {
        name: 'Objects',
        url: '/api/helpers/objects',
      },
      {
        name: 'Reactivity',
        url: '/api/helpers/reactivity',
      },
      {
        name: 'Strings',
        url: '/api/helpers/strings',
      },
    ],
  },
  {
    name: 'Reactivity',
    url: '/api/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Signal',
        url: '/api/reactivity/signal',
      },
      {
        name: 'Reaction',
        url: '/api/reactivity/reaction',
      },
      {
        name: 'Scheduler',
        url: '/api/reactivity/scheduler',
      },
      {
        name: 'Dependency',
        url: '/api/reactivity/dependency',
      },
      {
        name: 'Number Helpers',
        url: '/api/reactivity/number-helpers',
      },
      {
        name: 'Boolean Helpers',
        url: '/api/reactivity/boolean-helpers',
      },
      {
        name: 'Array Helpers',
        url: '/api/reactivity/array-helpers',
      },
      {
        name: 'Collection Helpers',
        url: '/api/reactivity/collection-helpers',
      },
      {
        name: 'Date Helpers',
        url: '/api/reactivity/date-helpers',
      },
    ],
  },
  {
    name: 'Query',
    url: '/api/query',
    icon: 'mouse-pointer',
    pages: [
      {
        name: 'Basic Usage',
        url: '/api/query/basic',
      },
      {
        name: 'Attributes',
        url: '/api/query/attributes',
      },
      {
        name: 'Components',
        url: '/api/query/components',
      },
      {
        name: 'Content',
        url: '/api/query/content',
      },
      {
        name: 'CSS',
        url: '/api/query/css',
      },
      {
        name: 'Dimensions & Size',
        url: '/api/query/dimensions',
      },
      {
        name: 'Display & Visibility',
        url: '/api/query/visibility',
      },
      {
        name: 'DOM Manipulation',
        url: '/api/query/dom-manipulation',
      },
      {
        name: 'DOM Traversal',
        url: '/api/query/dom-traversal',
      },
      {
        name: 'Events',
        url: '/api/query/events',
      },
      {
        name: 'Iterators',
        url: '/api/query/iterators',
      },
      {
        name: 'Logical Operators',
        url: '/api/query/logical-operators',
      },
      {
        name: 'Utilities',
        url: '/api/query/utilities',
      },
      {
        name: 'Internal',
        url: '/api/query/internal',
      },
    ],
  },
  {
    name: 'Utils',
    url: '/api/utils',
    icon: 'tool',
    pages: [
      {
        name: 'Arrays',
        url: '/api/utils/arrays',
      },
      {
        name: 'Browser',
        url: '/api/utils/browser',
      },
      {
        name: 'Cloning',
        url: '/api/utils/cloning',
      },
      {
        name: 'Colors',
        url: '/api/utils/colors',
      },
      {
        name: 'Crypto',
        url: '/api/utils/crypto',
      },
      {
        name: 'Dates',
        url: '/api/utils/dates',
      },
      {
        name: 'Environment',
        url: '/api/utils/environment',
      },
      {
        name: 'Equality',
        url: '/api/utils/equality',
      },
      {
        name: 'Errors',
        url: '/api/utils/errors',
      },
      {
        name: 'Functions',
        url: '/api/utils/functions',
      },
      {
        name: 'Looping',
        url: '/api/utils/looping',
      },
      {
        name: 'Numbers',
        url: '/api/utils/numbers',
      },
      {
        name: 'Objects',
        url: '/api/utils/objects',
      },
      {
        name: 'Types',
        url: '/api/utils/types',
      },
      {
        name: 'Regular Expressions',
        url: '/api/utils/regex',
      },
      {
        name: 'Strings',
        url: '/api/utils/strings',
      },
    ],
  },
  {
    name: 'Template Compiler',
    url: '/api/templating',
    icon: 'table',
    pages: [
      {
        name: 'Template Compiler',
        url: '/api/templating/template-compiler',
      },
      {
        name: 'Abstract Syntax Tree (AST)',
        url: '/api/templating/ast',
      },
      {
        name: 'Template',
        url: '/api/templating/template',
      },
      {
        name: 'String Scanner',
        url: '/api/templating/string-scanner',
      },
    ],
  },
  {
    name: 'Renderer',
    url: '/api/renderer',
    icon: 'edit-3',
    pages: [
      {
        name: 'Lit Renderer',
        url: '/api/renderer/lit-renderer',
      },
      {
        name: 'Lit Directives',
        url: '/api/renderer/lit-directives',
      },
    ],
  },
];

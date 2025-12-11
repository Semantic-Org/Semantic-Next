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
  'Tokens': 'droplet',
  'Styling': 'droplet',
  'CSS Tokens': 'droplet',
  'CSS Framework': 'droplet',
  'CSS Theming': 'droplet',
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
    icon: 'droplet',
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
    icon: 'radio',
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
    icon: 'message-circle',
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
    icon: 'droplet',
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
    icon: 'package',
    pages: behaviorPages,
  },
];

/* Component Framework Sidebar */
export const sidebarMenuFramework = [
  {
    name: 'Overview',
    url: '/docs/guides',
    icon: 'open book',
  },
  {
    name: 'Components',
    url: '/docs/guides/components',
    icon: 'package',
    pages: [
      {
        name: 'Creating',
        url: '/docs/guides/components/create',
      },
      {
        name: 'Functionality',
        url: '/docs/guides/components/instances',
      },
      {
        name: 'Lifecycle',
        url: '/docs/guides/components/lifecycle',
      },
      {
        name: 'Templates & Data',
        url: '/docs/guides/components/rendering',
      },
      {
        name: 'Settings',
        url: '/docs/guides/components/settings',
      },
      {
        name: 'State',
        url: '/docs/guides/components/state',
      },
      {
        name: 'Events',
        url: '/docs/guides/components/events',
      },
      {
        name: 'Reactivity',
        url: '/docs/guides/components/reactivity',
      },
      {
        name: 'DOM',
        url: '/docs/guides/components/dom',
      },
      {
        name: 'Styling',
        url: '/docs/guides/components/styling',
      },
      {
        name: 'Key Bindings',
        url: '/docs/guides/components/keys',
      },
      {
        name: 'Specs',
        url: '/docs/guides/components/specs',
      },
    ],
  },
  {
    name: 'Templates',
    url: '/docs/guides/templates',
    icon: 'table',
    pages: [
      {
        name: 'Expressions',
        url: '/docs/guides/templates/expressions',
      },
      {
        name: 'Conditionals',
        url: '/docs/guides/templates/conditionals',
      },
      {
        name: 'Loops',
        url: '/docs/guides/templates/loops',
      },
      {
        name: 'Async',
        url: '/docs/guides/templates/async',
      },
      {
        name: 'Slots',
        url: '/docs/guides/templates/slots',
      },
      {
        name: 'Subtemplates',
        url: '/docs/guides/templates/subtemplates',
      },
      {
        name: 'Snippets',
        url: '/docs/guides/templates/snippets',
      },
      {
        name: 'Reactivity',
        url: '/docs/guides/templates/reactivity',
      },
      {
        name: 'Helpers',
        url: '/docs/guides/templates/helpers',
      },
    ],
  },
  {
    name: 'Reactivity',
    description: 'Signals',
    url: '/docs/guides/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Signals',
        description: 'Reactive state primitive',
        url: '/docs/guides/reactivity/signals',
      },
      {
        name: 'Dependent Signals',
        description: 'Derived and computed signals',
        url: '/docs/guides/reactivity/dependent-signals',
      },
      {
        name: 'Reactions',
        description: 'Reactive computations',
        url: '/docs/guides/reactivity/reactions',
      },
      {
        name: 'Mutations',
        url: '/docs/guides/reactivity/mutation-helpers',
      },
      {
        name: 'Flushing',
        url: '/docs/guides/reactivity/flush',
      },
      {
        name: 'Reactive Controls',
        url: '/docs/guides/reactivity/controls',
      },
      {
        name: 'Performance',
        url: '/docs/guides/reactivity/performance',
      },
      {
        name: 'Debugging',
        url: '/docs/guides/reactivity/debugging',
      },
      {
        name: 'Advanced Options',
        description: 'Equality & Cloning',
        url: '/docs/guides/reactivity/signal-options',
      },
    ],
  },
  {
    name: 'Query',
    description: 'DOM Helpers',
    url: '/docs/guides/query',
    icon: 'mouse-pointer',
    pages: [
      {
        name: 'Basics',
        url: '/docs/guides/query/basics',
      },
      {
        name: 'Shadow DOM',
        url: '/docs/guides/query/shadow-dom',
      },
      {
        name: 'Components',
        url: '/docs/guides/query/components',
      },
      {
        name: 'Chaining',
        url: '/docs/guides/query/chaining',
      },
      {
        name: 'Plugins',
        url: '/docs/guides/query/plugins',
      },
      {
        name: 'Browser Usage',
        url: '/docs/guides/query/browser',
      },
    ],
  },
  {
    name: 'Advanced Usage',
    url: '/docs/guides/advanced',
    icon: 'server',
    pages: [
      {
        name: 'Common Issues',
        url: '/docs/guides/advanced/common-issues',
      },
      {
        name: 'Server Side Rendering',
        url: '/docs/guides/advanced/ssr',
      },
    ],
  },
];

export const sidebarMenuAPI = [
  {
    name: 'Components',
    url: '/docs/api/component',
    icon: 'package',
    pages: [
      {
        name: 'Define Component',
        url: '/docs/api/component/define-component',
      },
      {
        name: 'Utility Functions',
        url: '/docs/api/component/utilities',
      },
      {
        name: 'Base Class',
        url: '/docs/api/component/web-component-base',
      },
    ],
  },
  {
    name: 'Specs',
    url: '/docs/api/specs',
    icon: 'file-text',
    pages: [
      {
        name: 'SpecReader',
        url: '/docs/api/specs/spec-reader',
      },
      {
        name: 'Spec Helpers',
        url: '/docs/api/specs/shared-terms',
      },
      {
        name: 'Generate Docs',
        url: '/docs/api/specs/documentation',
      },
      {
        name: 'Parsing HTML',
        url: '/docs/api/specs/parsing',
      },
      {
        name: 'Generating HTML',
        url: '/docs/api/specs/generation',
      },
      {
        name: 'Utilities',
        url: '/docs/api/specs/utilities',
      },
    ],
  },
  {
    name: 'Template Helpers',
    url: '/docs/api/helpers',
    icon: 'book-open',
    pages: [
      {
        name: 'Arrays',
        url: '/docs/api/helpers/arrays',
      },
      {
        name: 'Comparison',
        url: '/docs/api/helpers/comparison',
      },
      {
        name: 'CSS',
        url: '/docs/api/helpers/css',
      },
      {
        name: 'Dates',
        url: '/docs/api/helpers/dates',
      },
      {
        name: 'Debug',
        url: '/docs/api/helpers/debug',
      },
      {
        name: 'Logical Operators',
        url: '/docs/api/helpers/logical',
      },
      {
        name: 'Numeric',
        url: '/docs/api/helpers/numeric',
      },
      {
        name: 'Objects',
        url: '/docs/api/helpers/objects',
      },
      {
        name: 'Reactivity',
        url: '/docs/api/helpers/reactivity',
      },
      {
        name: 'Strings',
        url: '/docs/api/helpers/strings',
      },
    ],
  },
  {
    name: 'Reactivity',
    url: '/docs/api/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Signal',
        url: '/docs/api/reactivity/signal',
      },
      {
        name: 'Reaction',
        url: '/docs/api/reactivity/reaction',
      },
      {
        name: 'Scheduler',
        url: '/docs/api/reactivity/scheduler',
      },
      {
        name: 'Dependency',
        url: '/docs/api/reactivity/dependency',
      },
      {
        name: 'Number Helpers',
        url: '/docs/api/reactivity/number-helpers',
      },
      {
        name: 'Boolean Helpers',
        url: '/docs/api/reactivity/boolean-helpers',
      },
      {
        name: 'Array Helpers',
        url: '/docs/api/reactivity/array-helpers',
      },
      {
        name: 'Collection Helpers',
        url: '/docs/api/reactivity/collection-helpers',
      },
      {
        name: 'Date Helpers',
        url: '/docs/api/reactivity/date-helpers',
      },
    ],
  },
  {
    name: 'Query',
    url: '/docs/api/query',
    icon: 'mouse-pointer',
    pages: [
      {
        name: 'Setup',
        url: '/docs/api/query/setup',
      },
      {
        name: 'Constructor',
        url: '/docs/api/query/constructor',
      },
      {
        name: 'Attributes',
        url: '/docs/api/query/attributes',
      },
      {
        name: 'Components',
        url: '/docs/api/query/components',
      },
      {
        name: 'Content',
        url: '/docs/api/query/content',
      },
      {
        name: 'CSS',
        url: '/docs/api/query/css',
      },
      {
        name: 'Dimensions',
        url: '/docs/api/query/dimensions',
      },
      {
        name: 'Display & Visibility',
        url: '/docs/api/query/visibility',
      },
      {
        name: 'DOM Manipulation',
        url: '/docs/api/query/dom-manipulation',
      },
      {
        name: 'DOM Traversal',
        url: '/docs/api/query/dom-traversal',
      },
      {
        name: 'DOM Access',
        url: '/docs/api/query/dom-access',
      },
      {
        name: 'Events',
        url: '/docs/api/query/events',
      },
      {
        name: 'Iterators',
        url: '/docs/api/query/iterators',
      },
      {
        name: 'Logical Operators',
        url: '/docs/api/query/logical-operators',
      },
      {
        name: 'Position & Intersection',
        url: '/docs/api/query/position',
      },
      {
        name: 'Collections',
        url: '/docs/api/query/collections',
      },
      {
        name: 'Internal',
        url: '/docs/api/query/internal',
      },
    ],
  },
  {
    name: 'Utils',
    url: '/docs/api/utils',
    icon: 'tool',
    pages: [
      {
        name: 'Arrays',
        url: '/docs/api/utils/arrays',
      },
      {
        name: 'Browser',
        url: '/docs/api/utils/browser',
      },
      {
        name: 'Cloning',
        url: '/docs/api/utils/cloning',
      },
      {
        name: 'Colors',
        url: '/docs/api/utils/colors',
      },
      {
        name: 'Crypto',
        url: '/docs/api/utils/crypto',
      },
      {
        name: 'Dates',
        url: '/docs/api/utils/dates',
      },
      {
        name: 'Debug',
        url: '/docs/api/utils/debug',
      },
      {
        name: 'Environment',
        url: '/docs/api/utils/environment',
      },
      {
        name: 'Equality',
        url: '/docs/api/utils/equality',
      },
      {
        name: 'Functions',
        url: '/docs/api/utils/functions',
      },
      {
        name: 'HTML',
        url: '/docs/api/utils/html',
      },
      {
        name: 'Looping',
        url: '/docs/api/utils/looping',
      },
      {
        name: 'Numbers',
        url: '/docs/api/utils/numbers',
      },
      {
        name: 'Objects',
        url: '/docs/api/utils/objects',
      },
      {
        name: 'Types',
        url: '/docs/api/utils/types',
      },
      {
        name: 'Regular Expressions',
        url: '/docs/api/utils/regex',
      },
      {
        name: 'Strings',
        url: '/docs/api/utils/strings',
      },
    ],
  },
  {
    name: 'Template Compiler',
    url: '/docs/api/templating',
    icon: 'table',
    pages: [
      {
        name: 'Template Compiler',
        url: '/docs/api/templating/template-compiler',
      },
      {
        name: 'Abstract Syntax Tree (AST)',
        url: '/docs/api/templating/ast',
      },
      {
        name: 'Template',
        url: '/docs/api/templating/template',
      },
      {
        name: 'String Scanner',
        url: '/docs/api/templating/string-scanner',
      },
    ],
  },
  {
    name: 'Renderer',
    url: '/docs/api/renderer',
    icon: 'edit-3',
    pages: [
      {
        name: 'Lit Renderer',
        url: '/docs/api/renderer/lit-renderer',
      },
      {
        name: 'Lit Directives',
        url: '/docs/api/renderer/lit-directives',
      },
    ],
  },
];

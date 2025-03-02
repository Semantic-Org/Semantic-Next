import { getCollection } from 'astro:content';
const components = await getCollection('components');
const componentPages = components.map(page => ({
  name: page.data.title,
  url: `/ui/${page.slug}`,
  matchSubPaths: true,
}));


/* Topbar Menu */
export const topbarDisplayMenu =  [
  {
    _ids: ['framework', 'api', 'ui'],
    name: 'Documentation',
    url: '/introduction',
  },
  {
    _id: 'learn',
    name: 'Learn',
    url: '/learn/selection',
    baseURL: '/learn'
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

/* The menu including all menu groupings for secondary menus */
export const topbarMenu =  [
  {
    _id: 'framework',
    name: 'Authoring Guide',
    url: '/introduction',
  },
  {
    _id: 'api',
    name: 'API Docs',
    url: '/api',
  },
  {
    _id: 'ui',
    name: 'UI Library',
    url: '/usage',
  },
  {
    _id: 'learn',
    name: 'Learn',
    url: '/learn/selection',
    baseURL: '/learn'
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


/* UI Component Sidebar */
export const sidebarMenuUI = [
  {
    name: 'Usage',
    url: '/usage',
    icon: 'open book',
    pages: [
      {
        name: 'HTML Usage',
        url: '/usage/html'
      },
      {
        name: 'Frameworks Usage',
        url: '/usage/framework'
      },/*
      {
        name: 'Web Components',
        url: '/usage/web-components'
      },*/
    ]
  },
  {
    name: 'UI Primitives',
    url: '/ui',
    icon: 'layers',
    pages: componentPages,
  },/*
  {
    name: 'Test',
    url: '/test',
    icon: 'code',
  },*/
];

/* Component Framework Sidebar */
export const sidebarMenuFramework = [
  {
    name: 'Introduction',
    url: '/introduction',
    icon: 'open book',
  },
  {
    name: 'Components',
    url: '/components',
    icon: 'package',
    pages: [
      {
        name: 'Creating',
        url: '/components/create'
      },
      {
        name: 'Functionality',
        url: '/components/instances'
      },
      {
        name: 'Lifecycle',
        url: '/components/lifecycle'
      },
      {
        name: 'Templates & Data',
        url: '/components/rendering'
      },
      {
        name: 'Settings',
        url: '/components/settings'
      },
      {
        name: 'State',
        url: '/components/state'
      },
      {
        name: 'Events',
        url: '/components/events'
      },
      {
        name: 'Reactivity',
        url: '/components/reactivity'
      },
      {
        name: 'DOM',
        url: '/components/dom'
      },
      {
        name: 'Styling',
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
        url: '/templates/loops'
      },
      {
        name: 'Slots',
        url: '/templates/slots'
      },
      {
        name: 'Subtemplates',
        url: '/templates/subtemplates'
      },
      {
        name: 'Snippets',
        url: '/templates/snippets'
      },
      {
        name: 'Helpers',
        url: '/templates/helpers'
      },
    ]
  },/*
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
  },*/
  {
    name: 'Reactivity',
    description: 'Signals',
    url: '/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Basics',
        description: 'Signal',
        url: '/reactivity/variables'
      },
      {
        name: 'Mutations',
        url: '/reactivity/mutation-helpers'
      },
      {
        name: 'Flushing',
        url: '/reactivity/flush'
      },
      {
        name: 'Controls',
        url: '/reactivity/computations'
      },
      {
        name: 'Performance',
        url: '/reactivity/controls'
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
    ]
  },/*
  {
    name: 'Errata',
    icon: 'book',
    url: '/getting-started'
  },*/
];


export const sidebarMenuAPI = [
  {
    name: 'Components',
    url: '/api/component',
    icon: 'package',
    pages: [
      {
        name: 'Define Component',
        url: '/api/component/define-component'
      },
      {
        name: 'Utility Functions',
        url: '/api/component/utilities'
      },
      {
        name: 'Base Class',
        url: '/api/component/web-component-base'
      },
    ]
  },
  {
    name: 'Template Helpers',
    url: '/api/helpers',
    icon: 'book-open',
    pages: [
      {
        name: 'Arrays',
        url: '/api/helpers/arrays'
      },
      {
        name: 'Comparison',
        url: '/api/helpers/comparison'
      },
      {
        name: 'CSS',
        url: '/api/helpers/css'
      },
      {
        name: 'Dates',
        url: '/api/helpers/dates'
      },
      {
        name: 'Debug',
        url: '/api/helpers/debug'
      },
      {
        name: 'Logical Operators',
        url: '/api/helpers/logical'
      },
      {
        name: 'Numeric',
        url: '/api/helpers/numeric'
      },
      {
        name: 'Objects',
        url: '/api/helpers/objects'
      },
      {
        name: 'Reactivity',
        url: '/api/helpers/reactivity'
      },
      {
        name: 'Strings',
        url: '/api/helpers/strings'
      },
    ]
  },
  {
    name: 'Reactivity',
    url: '/api/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Signal',
        url: '/api/reactivity/signal'
      },
      {
        name: 'Reaction',
        url: '/api/reactivity/reaction'
      },
      {
        name: 'Scheduler',
        url: '/api/reactivity/scheduler'
      },
      {
        name: 'Dependency',
        url: '/api/reactivity/dependency'
      },
      {
        name: 'Number Helpers',
        url: '/api/reactivity/number-helpers'
      },
      {
        name: 'Boolean Helpers',
        url: '/api/reactivity/boolean-helpers'
      },
      {
        name: 'Array Helpers',
        url: '/api/reactivity/array-helpers'
      },
      {
        name: 'Collection Helpers',
        url: '/api/reactivity/collection-helpers'
      },
      {
        name: 'Date Helpers',
        url: '/api/reactivity/date-helpers'
      },
    ]
  },
  {
    name: 'Query',
    url: '/api/query',
    icon: 'mouse-pointer',
    pages: [
      {
        name: 'Basic Usage',
        url: '/api/query/basic'
      },
      {
        name: 'Attributes',
        url: '/api/query/attributes'
      },
      {
        name: 'Components',
        url: '/api/query/components'
      },
      {
        name: 'Content',
        url: '/api/query/content'
      },
      {
        name: 'CSS',
        url: '/api/query/css'
      },
      {
        name: 'Size & Dimensions',
        url: '/api/query/dimensions'
      },
      {
        name: 'DOM Manipulation',
        url: '/api/query/dom-manipulation'
      },
      {
        name: 'DOM Traversal',
        url: '/api/query/dom-traversal'
      },
      {
        name: 'Events',
        url: '/api/query/events'
      },
      {
        name: 'Iterators',
        url: '/api/query/iterators'
      },
      {
        name: 'Logical Operators',
        url: '/api/query/logical-operators'
      },
      {
        name: 'Utilities',
        url: '/api/query/utilities'
      },
    ]
  },
  {
    name: 'Utils',
    url: '/api/utils',
    icon: 'tool',
    pages: [
      {
        name: 'Arrays',
        url: '/api/utils/arrays'
      },
      {
        name: 'Browser',
        url: '/api/utils/browser'
      },
      {
        name: 'Cloning',
        url: '/api/utils/cloning'
      },
      {
        name: 'Crypto',
        url: '/api/utils/crypto'
      },
      {
        name: 'Dates',
        url: '/api/utils/dates'
      },
      {
        name: 'Equality',
        url: '/api/utils/equality'
      },
      {
        name: 'Errors',
        url: '/api/utils/errors'
      },
      {
        name: 'Functions',
        url: '/api/utils/functions'
      },
      {
        name: 'Looping',
        url: '/api/utils/looping'
      },
      {
        name: 'Numbers',
        url: '/api/utils/numbers'
      },
      {
        name: 'Objects',
        url: '/api/utils/objects'
      },
      {
        name: 'Types',
        url: '/api/utils/types'
      },
      {
        name: 'Regular Expressions',
        url: '/api/utils/regex'
      },
      {
        name: 'SSR',
        url: '/api/utils/ssr'
      },
      {
        name: 'Strings',
        url: '/api/utils/strings'
      },
    ]
  },
  {
    name: 'Template Compiler',
    url: '/api/templating',
    icon: 'table',
    pages: [
      {
        name: 'Template Compiler',
        url: '/api/templating/template-compiler'
      },
      {
        name: 'Abstract Syntax Tree (AST)',
        url: '/api/templating/ast'
      },
      {
        name: 'Template',
        url: '/api/templating/template'
      },
      {
        name: 'String Scanner',
        url: '/api/templating/string-scanner'
      },
    ]
  },
  {
    name: 'Renderer',
    url: '/api/renderer',
    icon: 'edit-3',
    pages: [
      {
        name: 'Lit Renderer',
        url: '/api/renderer/lit-renderer'
      },
      {
        name: 'Lit Directives',
        url: '/api/renderer/lit-directives'
      },
    ]
  },
];

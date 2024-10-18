import { getCollection } from 'astro:content';
const components = await getCollection('components');
const componentPages = components.map(page => ({
  name: page.data.title,
  url: `/ui/${page.slug}`,
  matchSubPaths: true,
}));


/* Topbar Menu */
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
  /*
  {
    _id: 'playground',
    name: 'Playground',
    url: '/playground',
  },*/
];


/* UI Component Sidebar */
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

/* Component Framework Sidebar */
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
        url: '/templates/loops'
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
        name: 'Basic Usage',
        url: '/query/basic'
      },
      {
        name: 'Attributes',
        url: '/query/attributes'
      },
      {
        name: 'Components',
        url: '/query/components'
      },
      {
        name: 'Content',
        url: '/query/content'
      },
      {
        name: 'CSS',
        url: '/query/css'
      },
      {
        name: 'Size & Dimensions',
        url: '/query/dimensions'
      },
      {
        name: 'DOM Manipulation',
        url: '/query/dom-manipulation'
      },
      {
        name: 'DOM Traversal',
        url: '/query/dom-traversal'
      },
      {
        name: 'Events',
        url: '/query/events'
      },
      {
        name: 'Iterators',
        url: '/query/iterators'
      },
      {
        name: 'Logical Operators',
        url: '/query/logical-operators'
      },
      {
        name: 'Utilities',
        url: '/query/utilities'
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
        name: 'Arrays',
        url: '/utils/arrays'
      },
      {
        name: 'Browser',
        url: '/utils/browser'
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
        name: 'Dates',
        url: '/utils/dates'
      },
      {
        name: 'Equality',
        url: '/utils/equality'
      },
      {
        name: 'Errors',
        url: '/utils/errors'
      },
      {
        name: 'Functions',
        url: '/utils/functions'
      },
      {
        name: 'Looping',
        url: '/utils/looping'
      },
      {
        name: 'Numbers',
        url: '/utils/numbers'
      },
      {
        name: 'Types',
        url: '/utils/types'
      },
      {
        name: 'Objects',
        url: '/utils/objects'
      },
      {
        name: 'Regular Expressions',
        url: '/utils/regex'
      },
      {
        name: 'SSR',
        url: '/utils/ssr'
      },
      {
        name: 'Strings',
        url: '/utils/strings'
      },
    ]
  },
  {
    name: 'Template Helpers',
    url: '/helpers',
    icon: 'table',
    pages: [
      {
        name: 'Arrays',
        url: '/helpers/arrays'
      },
      {
        name: 'Comparison',
        url: '/helpers/comparison'
      },
      {
        name: 'CSS',
        url: '/helpers/css'
      },
      {
        name: 'Dates',
        url: '/helpers/dates'
      },
      {
        name: 'Debug',
        url: '/helpers/debug'
      },
      {
        name: 'Logical Operators',
        url: '/helpers/logical'
      },
      {
        name: 'Numeric',
        url: '/helpers/numeric'
      },
      {
        name: 'Objects',
        url: '/helpers/objects'
      },
      {
        name: 'Reactivity',
        url: '/helpers/reactivity'
      },
      {
        name: 'Strings',
        url: '/helpers/strings'
      },
    ]
  },
];

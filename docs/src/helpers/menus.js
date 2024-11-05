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
    _id: 'learn',
    name: 'Learn',
    url: '/learn/111-introduction',
    baseURL: '/learn'
  },
  {
    _id: 'framework',
    name: 'Framework',
    url: '/components',
  },

  {
    _id: 'api',
    name: 'API Reference',
    url: '/api',
  },
  {
    _id: 'ui',
    name: 'UI Components',
    url: '/introduction',
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
    name: 'Usage Guide',
    url: '/introduction',
    icon: 'open book',
    pages: [
      {
        name: 'Project Setup',
        url: '/getting-started'
      },
      {
        name: 'Framework Usage',
        url: '/framework-integration'
      },
      {
        name: 'Usage in HTML',
        url: '/usage'
      },
      {
        name: 'What are Web Components',
        url: '/web-components'
      },
    ]
  },
  {
    name: 'UI Components',
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
        name: 'Template Helpers',
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
    ]
  },
  {
    name: 'Templating',
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
    name: 'Reactivity',
    url: '/api/reactivity',
    icon: 'cpu',
    pages: [
      {
        name: 'Reactive Var',
        url: '/api/reactivity/reactive-var'
      },
      {
        name: 'Reaction',
        url: '/api/reactivity/reaction'
      },
      {
        name: 'Flushing Reactions',
        url: '/api/reactivity/flushing'
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
        name: 'Types',
        url: '/api/utils/types'
      },
      {
        name: 'Objects',
        url: '/api/utils/objects'
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
];

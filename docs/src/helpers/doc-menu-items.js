/*
  Static menu items for user documentation (Guides + API Reference).
  Extracted from menus.js so the manifest builder can also import it
  without needing Astro dependencies.
*/

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
      { name: 'Creating', url: '/docs/guides/components/create' },
      { name: 'Functionality', url: '/docs/guides/components/instances' },
      { name: 'Lifecycle', url: '/docs/guides/components/lifecycle' },
      { name: 'Templates & Data', url: '/docs/guides/components/rendering' },
      { name: 'Settings', url: '/docs/guides/components/settings' },
      { name: 'State', url: '/docs/guides/components/state' },
      { name: 'Events', url: '/docs/guides/components/events' },
      { name: 'Reactivity', url: '/docs/guides/components/reactivity' },
      { name: 'DOM', url: '/docs/guides/components/dom' },
      { name: 'Styling', url: '/docs/guides/components/styling' },
      { name: 'Key Bindings', url: '/docs/guides/components/keys' },
      { name: 'Specs', url: '/docs/guides/components/specs' },
    ],
  },
  {
    name: 'Templates',
    url: '/docs/guides/templates',
    icon: 'table',
    pages: [
      { name: 'Expressions', url: '/docs/guides/templates/expressions' },
      { name: 'Conditionals', url: '/docs/guides/templates/conditionals' },
      { name: 'Loops', url: '/docs/guides/templates/loops' },
      { name: 'Async', url: '/docs/guides/templates/async' },
      { name: 'Slots', url: '/docs/guides/templates/slots' },
      { name: 'Subtemplates', url: '/docs/guides/templates/subtemplates' },
      { name: 'Snippets', url: '/docs/guides/templates/snippets' },
      { name: 'Reactivity', url: '/docs/guides/templates/reactivity' },
      { name: 'Helpers', url: '/docs/guides/templates/helpers' },
    ],
  },
  {
    name: 'Reactivity',
    description: 'Signals',
    url: '/docs/guides/reactivity',
    icon: 'activity',
    pages: [
      { name: 'Signals', description: 'Reactive state primitive', url: '/docs/guides/reactivity/signals' },
      {
        name: 'Dependent Signals',
        description: 'Derived and computed signals',
        url: '/docs/guides/reactivity/dependent-signals',
      },
      { name: 'Reactions', description: 'Reactive computations', url: '/docs/guides/reactivity/reactions' },
      { name: 'Mutations', url: '/docs/guides/reactivity/mutation-helpers' },
      { name: 'Flushing', url: '/docs/guides/reactivity/flush' },
      { name: 'Reactive Controls', url: '/docs/guides/reactivity/controls' },
      { name: 'Performance', url: '/docs/guides/reactivity/performance' },
      { name: 'Debugging', url: '/docs/guides/reactivity/debugging' },
      { name: 'Advanced Options', description: 'Equality & Cloning', url: '/docs/guides/reactivity/signal-options' },
    ],
  },
  {
    name: 'Query',
    description: 'DOM Helpers',
    url: '/docs/guides/query',
    icon: 'mouse-pointer',
    pages: [
      { name: 'Basics', url: '/docs/guides/query/basics' },
      { name: 'Shadow DOM', url: '/docs/guides/query/shadow-dom' },
      { name: 'Components', url: '/docs/guides/query/components' },
      { name: 'Chaining', url: '/docs/guides/query/chaining' },
      { name: 'Plugins', url: '/docs/guides/query/plugins' },
      { name: 'Browser Usage', url: '/docs/guides/query/browser' },
    ],
  },
  {
    name: 'Advanced Usage',
    url: '/docs/guides/advanced',
    icon: 'server',
    pages: [
      { name: 'Common Issues', url: '/docs/guides/advanced/common-issues' },
      { name: 'Server Side Rendering', url: '/docs/guides/advanced/ssr' },
    ],
  },
];

export const sidebarMenuAPI = [
  {
    name: 'Components',
    url: '/docs/api/component',
    icon: 'package',
    pages: [
      { name: 'Define Component', url: '/docs/api/component/define-component' },
      { name: 'Utility Functions', url: '/docs/api/component/utilities' },
      { name: 'Base Class', url: '/docs/api/component/web-component-base' },
    ],
  },
  {
    name: 'Specs',
    url: '/docs/api/specs',
    icon: 'file-text',
    pages: [
      { name: 'SpecReader', url: '/docs/api/specs/spec-reader' },
      { name: 'Spec Helpers', url: '/docs/api/specs/shared-terms' },
      { name: 'Generate Docs', url: '/docs/api/specs/documentation' },
      { name: 'Parsing HTML', url: '/docs/api/specs/parsing' },
      { name: 'Generating HTML', url: '/docs/api/specs/generation' },
      { name: 'Utilities', url: '/docs/api/specs/utilities' },
    ],
  },
  {
    name: 'Template Helpers',
    url: '/docs/api/helpers',
    icon: 'book-open',
    pages: [
      { name: 'Arrays', url: '/docs/api/helpers/arrays' },
      { name: 'Comparison', url: '/docs/api/helpers/comparison' },
      { name: 'CSS', url: '/docs/api/helpers/css' },
      { name: 'Dates', url: '/docs/api/helpers/dates' },
      { name: 'Debug', url: '/docs/api/helpers/debug' },
      { name: 'Logical Operators', url: '/docs/api/helpers/logical' },
      { name: 'Numeric', url: '/docs/api/helpers/numeric' },
      { name: 'Objects', url: '/docs/api/helpers/objects' },
      { name: 'Reactivity', url: '/docs/api/helpers/reactivity' },
      { name: 'Strings', url: '/docs/api/helpers/strings' },
    ],
  },
  {
    name: 'Reactivity',
    url: '/docs/api/reactivity',
    icon: 'activity',
    pages: [
      { name: 'Signal', url: '/docs/api/reactivity/signal' },
      { name: 'Reaction', url: '/docs/api/reactivity/reaction' },
      { name: 'Scheduler', url: '/docs/api/reactivity/scheduler' },
      { name: 'Dependency', url: '/docs/api/reactivity/dependency' },
      { name: 'Number Helpers', url: '/docs/api/reactivity/number-helpers' },
      { name: 'Boolean Helpers', url: '/docs/api/reactivity/boolean-helpers' },
      { name: 'Array Helpers', url: '/docs/api/reactivity/array-helpers' },
      { name: 'Collection Helpers', url: '/docs/api/reactivity/collection-helpers' },
      { name: 'Date Helpers', url: '/docs/api/reactivity/date-helpers' },
    ],
  },
  {
    name: 'Query',
    url: '/docs/api/query',
    icon: 'mouse-pointer',
    pages: [
      { name: 'Setup', url: '/docs/api/query/setup' },
      { name: 'Constructor', url: '/docs/api/query/constructor' },
      { name: 'Attributes', url: '/docs/api/query/attributes' },
      { name: 'Components', url: '/docs/api/query/components' },
      { name: 'Content', url: '/docs/api/query/content' },
      { name: 'CSS', url: '/docs/api/query/css' },
      { name: 'Dimensions', url: '/docs/api/query/dimensions' },
      { name: 'Display & Visibility', url: '/docs/api/query/visibility' },
      { name: 'DOM Manipulation', url: '/docs/api/query/dom-manipulation' },
      { name: 'DOM Traversal', url: '/docs/api/query/dom-traversal' },
      { name: 'DOM Access', url: '/docs/api/query/dom-access' },
      { name: 'Events', url: '/docs/api/query/events' },
      { name: 'Iterators', url: '/docs/api/query/iterators' },
      { name: 'Logical Operators', url: '/docs/api/query/logical-operators' },
      { name: 'Position & Intersection', url: '/docs/api/query/position' },
      { name: 'Collections', url: '/docs/api/query/collections' },
      { name: 'Internal', url: '/docs/api/query/internal' },
    ],
  },
  {
    name: 'Utils',
    url: '/docs/api/utils',
    icon: 'tool',
    pages: [
      { name: 'Arrays', url: '/docs/api/utils/arrays' },
      { name: 'Browser', url: '/docs/api/utils/browser' },
      { name: 'Cloning', url: '/docs/api/utils/cloning' },
      { name: 'Colors', url: '/docs/api/utils/colors' },
      { name: 'Crypto', url: '/docs/api/utils/crypto' },
      { name: 'Dates', url: '/docs/api/utils/dates' },
      { name: 'Debug', url: '/docs/api/utils/debug' },
      { name: 'Environment', url: '/docs/api/utils/environment' },
      { name: 'Equality', url: '/docs/api/utils/equality' },
      { name: 'Functions', url: '/docs/api/utils/functions' },
      { name: 'HTML', url: '/docs/api/utils/html' },
      { name: 'Looping', url: '/docs/api/utils/looping' },
      { name: 'Numbers', url: '/docs/api/utils/numbers' },
      { name: 'Objects', url: '/docs/api/utils/objects' },
      { name: 'Types', url: '/docs/api/utils/types' },
      { name: 'Regular Expressions', url: '/docs/api/utils/regex' },
      { name: 'Strings', url: '/docs/api/utils/strings' },
    ],
  },
  {
    name: 'Template Compiler',
    url: '/docs/api/templating',
    icon: 'table',
    pages: [
      { name: 'Template Compiler', url: '/docs/api/templating/template-compiler' },
      { name: 'Abstract Syntax Tree (AST)', url: '/docs/api/templating/ast' },
      { name: 'Template', url: '/docs/api/templating/template' },
      { name: 'String Scanner', url: '/docs/api/templating/string-scanner' },
    ],
  },
  {
    name: 'Renderer',
    url: '/docs/api/renderer',
    icon: 'brush',
    pages: [
      { name: 'Lit Renderer', url: '/docs/api/renderer/lit-renderer' },
      { name: 'Lit Directives', url: '/docs/api/renderer/lit-directives' },
    ],
  },
];

/**
 * Build a lookup from doc URL path to { section, category, order }.
 * Used by the manifest builder to attach menu metadata to doc pages.
 */
export function buildDocCategoryLookup() {
  const lookup = {};
  let order = 0;

  function processMenu(menu, section) {
    for (const item of menu) {
      const path = item.url.replace('/docs/', '');
      lookup[path] = { section, category: item.name, order: order++ };
      if (item.pages) {
        for (const page of item.pages) {
          const pagePath = page.url.replace('/docs/', '');
          lookup[pagePath] = { section, category: item.name, order: order++ };
        }
      }
    }
  }

  processMenu(sidebarMenuFramework, 'Guides');
  processMenu(sidebarMenuAPI, 'API');

  return lookup;
}

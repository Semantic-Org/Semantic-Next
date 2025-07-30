# Query Plugin Architecture Guide

> **For:** AI agents implementing DOM manipulation plugins in Semantic UI Query  
> **Purpose:** Technical reference for Query plugin development patterns  
> **Prerequisites:** Understanding of Query system from [ai/packages/query.md](../packages/query.md)  
> **Related:** [Plugin Registration](../../packages/query/src/register-plugin.js) • [Simple Plugin Example](../../docs/src/examples/query/plugins/query-plugin/) • [Complex Plugin Example](../../docs/src/examples/query/plugins/query-behavior/)

---

## Plugin Architecture Overview

The Query system provides two distinct plugin mechanisms:

1. **Simple Plugins** - Direct prototype extension for baseline Query methods
2. **Complex Plugins** - Full behavior registration for component-like functionality

## Simple Plugins: Prototype Extension

### Definition
Simple plugins extend `Query.prototype` directly via `$.plugin`, adding new methods to all Query instances.

### Implementation Pattern
```javascript
import { $ } from '@semantic-ui/query';

$.plugin.methodName = function(options = {}) {
  // `this` is the Query instance
  return this.each((element) => {
    // Logic per element
  });
};
```

### Characteristics
- Direct method addition to Query prototype
- Access to full Query instance via `this`
- No lifecycle management
- No settings persistence
- No event abstraction beyond Query's native `.on()`

### When to Use
- Adding utility methods to Query baseline
- Simple DOM manipulation helpers
- One-off functionality that doesn't require state
- Methods that should feel like native Query operations

### Example Analysis
The mask-input plugin demonstrates this pattern:
- Adds `.maskInput()` method to all Query instances
- Uses existing Query `.on()` for event handling
- Stateless operation per invocation
- Direct prototype extension via `$.plugin.maskInput`

**Reference**: [docs/src/examples/query/plugins/query-plugin/mask-input-plugin.js](../../docs/src/examples/query/plugins/query-plugin/mask-input-plugin.js)

## Complex Plugins: Behavior Registration

### Definition
Complex plugins use `registerPlugin()` to create full behavioral systems with lifecycle management, settings, events, and state.

### Implementation Pattern
```javascript
import { registerPlugin } from '@semantic-ui/query';

registerPlugin({
  name: 'pluginName',
  defaultSettings: {},
  
  // Configuration objects for customization and i18n
  selectors: {
    trigger: '.plugin-trigger'
  },
  classNames: {
    active: 'active'
  },
  errors: {
    noTarget: 'No target found'
  },
  templates: {
    content: '<div class="plugin-content"></div>'
  },
  
  // CSS injection with constructed stylesheets
  css: `
    .plugin { /* styles */ }
    .plugin.active { /* active styles */ }
  `,
  
  createPlugin: ({ $, el, $el, self, settings, selectors, classNames, errors, templates }) => ({
    // Plugin methods with access to configuration objects
  }),
  
  // Event templating with {key} syntax
  events: {
    'click {trigger}': ({ $, el, $el, self, settings, selectors, classNames, errors, templates, event, target, value, data }) => {  // Uses selectors.trigger
      // Event handlers with automatic selector interpolation
    }
  },
  
  setup: ({ $, settings, $elements, templates }) => {
    // Shared initialization returning properties for self
  }
});
```

### Architecture Components

#### Registration
- **Plugin Map**: `Query.plugins` static Map stores registered plugins
- **Method Creation**: Automatically creates `$.prototype[name]` method
- **Defaults Exposure**: Settings/selectors/errors exposed on `$.prototype[name]`

#### Configuration System
- **Object Types**: `selectors`, `classNames`, `errors`, `templates` for customization
- **Deep Merging**: Runtime settings use `deepExtend()` to preserve nested object properties
- **Global Override**: Users can modify `$.pluginName.selectors`, `$.pluginName.classNames` etc.
- **Data Attributes**: HTML `data-*` attributes automatically override settings
- **Event Templating**: `{key}` syntax in event strings references configuration objects

#### Instance Management
- **Namespace Storage**: Instance stored as `element[namespace]`
- **Lifecycle Callbacks**: `onCreated`, `onDestroyed` hooks
- **Settings Management**: Deep merging prevents configuration object clobbering
- **CSS Injection**: Automatic stylesheet adoption with constructed stylesheet caching

#### Event System
- **Declarative Binding**: Object literal event specification
- **Selector Interpolation**: `{key}` placeholders replaced with configuration values at runtime (only works in event object keys)
- **Event Parsing**: String-based event/selector parsing with delegation support
- **Abort Controllers**: Automatic cleanup via AbortController pattern

#### Method Invocation
- **String Methods**: `$element.plugin('methodName', ...args)`
- **Return Value Collection**: Intelligent single/array return handling
- **Natural Language Lookup**: CamelCase and dot notation method resolution

### When to Use
- Component-like behaviors requiring state management
- Complex event handling patterns
- Settings that need persistence/override
- Functionality modeled after classic Semantic UI modules
- Multi-method APIs with shared context

### Example Analysis
The tooltip plugin demonstrates the full `registerPlugin()` architecture:
- CSS integration with automatic adoption
- Shared state via `setup()` function
- Declarative event handling with delegation
- Multi-method API (`show()`, `hide()`, `toggle()`)
- Settings management with data attribute override

**Reference**: [docs/src/examples/query/plugins/query-behavior/query-tooltip.js](../../docs/src/examples/query/plugins/query-behavior/query-tooltip.js)

### Architecture Abstractions

#### Already Abstracted from Classic SUI
1. **Plugin Registration**: Unified `registerPlugin()` vs manual `$.fn.module` creation
2. **Instance Storage**: Automatic `element[namespace]` vs manual data storage
3. **Settings Management**: Built-in merging, data override, global defaults
4. **Event Handling**: Declarative events object vs manual binding
5. **Method Invocation**: Natural language lookup vs complex invoke logic
6. **CSS Integration**: Automatic stylesheet adoption with caching
7. **Lifecycle Management**: Standard callbacks vs scattered lifecycle code
8. **Return Value Handling**: Intelligent collection vs manual array management

#### Available for Enhancement
1. **Performance Tracking**: Debug/timing system from classic modules
2. **MutationObserver**: Declarative DOM change handling pattern

## Plugin Selection Decision Matrix

| Requirement | Simple Plugin | Complex Plugin |
|-------------|---------------|-----------------|
| Add Query method | ✓ Preferred | ✗ Overkill |
| State management | ✗ Manual only | ✓ Built-in |
| Event handling | ✗ Manual `.on()` | ✓ Declarative |
| Settings persistence | ✗ None | ✓ Automatic |
| Lifecycle hooks | ✗ None | ✓ Standard |
| Method collection | ✗ Single method | ✓ Multi-method API |
| CSS integration | ✗ Manual | ✓ Automatic injection |
| Data override | ✗ Manual | ✓ Built-in |
| Configuration objects | ✗ None | ✓ selectors/classNames/errors/templates |
| Event templating | ✗ None | ✓ {key} interpolation |
| Deep merging | ✗ N/A | ✓ Nested object preservation |
| i18n support | ✗ Manual | ✓ Via errors/templates objects |

## Implementation Context

### Query Foundation
For complete Query capabilities, reference [ai/packages/query.md](../packages/query.md) rather than duplicating functionality documentation.

### Classic SUI Heritage
Complex plugins abstract patterns from classic Semantic UI jQuery modules. The plugin architecture handles:
- Module initialization patterns
- Settings inheritance and override
- Event namespace management
- Instance lifecycle
- Method invocation complexity
- Return value collection logic

### Performance Considerations
Both plugin types inherit Query's Shadow DOM traversal capabilities and performance optimizations. Complex plugins add minimal overhead through the Plugin class abstraction.

---

*This guide serves as technical specification for AI agents. For implementation examples, examine the referenced source files.*
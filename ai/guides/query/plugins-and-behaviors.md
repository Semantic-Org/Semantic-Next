# Query Plugins and Behaviors - Canonical Guide

> **For:** AI agents implementing Query extensions, plugins, and behaviors  
> **Purpose:** Complete technical specification for Query extension architecture  
> **Prerequisites:** [Mental Model](/ai/foundations/mental-model.md) • [Query Package](/ai/packages/query.md)  
> **Related:** [Implementation](../../packages/query/src/register-behavior.js) • [Behavior Class](../../packages/query/src/behavior.js)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Simple Plugins (Prototype Extension)](#simple-plugins-prototype-extension)
- [Behaviors (Complex Plugins)](#behaviors-complex-plugins)
- [Behavior Registration API](#behavior-registration-api)
- [Configuration Objects & Templating](#configuration-objects--templating)
- [Event System](#event-system)
- [Mutation Observers](#mutation-observers)
- [Method Invocation & Custom Invocation](#method-invocation--custom-invocation)
- [Lifecycle Management](#lifecycle-management)
- [CSS Integration](#css-integration)
- [Instance Management](#instance-management)
- [Return Value Collection](#return-value-collection)
- [Real-World Patterns](#real-world-patterns)
- [Decision Matrix](#decision-matrix)

---

## Architecture Overview

Query provides two extension mechanisms, each suited for different complexity levels:

```
Simple Plugins ($.plugin)
├── Direct prototype extension
├── Stateless operations
├── Method chaining support
└── No lifecycle management

Behaviors (registerBehavior)
├── Full instance management
├── Settings persistence
├── Event delegation system
├── Mutation observers
├── CSS injection
├── Lifecycle hooks
└── Configuration objects
```

### Core Files

- **Registration**: `/packages/query/src/register-behavior.js` - Behavior registration logic
- **Behavior Class**: `/packages/query/src/behavior.js` - Core behavior implementation
- **Helpers**: `/packages/query/src/helpers.js` - Plugin alias exposure

---

## Simple Plugins (Prototype Extension)

### Definition Pattern

Simple plugins extend `Query.prototype` directly through the `$.plugin` alias:

```javascript
import { $ } from '@semantic-ui/query';

// $.plugin is an alias for Query.prototype
$.plugin.methodName = function(options = {}) {
  // `this` is the Query instance with full API access
  
  // Support chaining by returning this
  return this.each((element, index) => {
    // Operations per element
  });
};
```

### Access Patterns

```javascript
// Through $.fn (jQuery compatibility)
$.fn.methodName = function() { /* ... */ };

// Through $.plugin (semantic clarity)
$.plugin.methodName = function() { /* ... */ };

// Direct prototype access
Query.prototype.methodName = function() { /* ... */ };

// All three are equivalent: $.fn === $.plugin === Query.prototype
```

### Characteristics

- **Scope**: Method available on all Query instances immediately
- **State**: No built-in state management (must handle manually)
- **Events**: Use Query's `.on()` method directly
- **Return**: Should return `this` for chaining or collected values
- **Memory**: No automatic cleanup

### Example: Input Masking Plugin

```javascript
$.plugin.maskInput = function({ type = 'alphanumeric' } = {}) {
  this.on('keydown', (event) => {
    const presets = {
      alpha: /[a-zA-Z]/,
      numeric: /[0-9]/,
      alphanumeric: /[a-zA-Z0-9]/,
    };
    
    // Allow special keys (arrows, backspace, etc.)
    if (event.key.length > 1) return;
    
    const regex = type instanceof RegExp ? type : presets[type];
    if (event.key.search(regex) === -1) {
      event.preventDefault();
    }
  });
  
  return this; // Enable chaining
};

// Usage
$('input').maskInput({ type: 'numeric' }).addClass('validated');
```

---

## Behaviors (Complex Plugins)

### Architecture Components

Behaviors provide a complete plugin system with:

1. **Instance Management**: Per-element behavior instances
2. **Settings System**: Defaults, runtime updates, data overrides
3. **Event Delegation**: Declarative event configuration
4. **Mutation Observers**: DOM change monitoring
5. **CSS Injection**: Automatic stylesheet management
6. **Lifecycle Hooks**: Creation and destruction callbacks
7. **Method API**: String-based and direct invocation

---

## Behavior Registration API

### Complete Registration Interface

```javascript
import { registerBehavior } from '@semantic-ui/query';

registerBehavior({
  // Required
  name: 'behaviorName',              // Method name on Query instances
  
  // Optional
  namespace: 'storageKey',            // Property name on DOM element (defaults to name)
  
  // Settings
  defaultSettings: {                  // Base configuration
    option1: 'value',
    option2: 100,
  },
  allowDataOverride: true,            // Allow data-* attributes to override (default: true)
  
  // Configuration Objects (for templating and i18n)
  selectors: {                        // DOM selectors
    trigger: '.behavior-trigger',
    content: '.behavior-content',
  },
  classNames: {                       // CSS class names
    active: 'active',
    visible: 'visible',
    hidden: 'hidden',
  },
  errors: {                           // Error messages (localizable)
    noTarget: 'No target element found',
    invalid: 'Invalid configuration',
  },
  templates: {                        // HTML templates
    wrapper: '<div class="wrapper"></div>',
    content: '<div class="content">{text}</div>',
  },
  
  // CSS Injection
  css: `                              // Injected as constructed stylesheet
    .behavior { display: block; }
    .behavior.active { opacity: 1; }
  `,
  
  // Behavior Factory
  createBehavior: ({ $, el, $el, self, settings, /* all config objects */ }) => ({
    // Methods become available on behavior instance
    show() { /* ... */ },
    hide() { /* ... */ },
    toggle() { /* ... */ },
  }),
  
  // Setup (runs once, shared across instances)
  setup: ({ $, settings, $elements, templates }) => ({
    // Return properties that become part of `self`
    sharedCache: new Map(),
    $overlay: $('<div>').appendTo('body'),
  }),
  
  // Events
  events: {
    'click .trigger': ({ self, event }) => { /* ... */ },
    'global scroll window': ({ self }) => { /* ... */ },
  },
  
  // Mutations
  mutations: {
    'add .item': ({ $added, self }) => { /* ... */ },
    'attributes [data-value]': ({ newValue, oldValue }) => { /* ... */ },
  },
  
  // Custom Invocation (for string-based APIs)
  customInvocation: ({ methodName, methodArgs, self }) => {
    // Handle non-standard method calls
    return self.performAction(methodName, ...methodArgs);
  },
  
  // Lifecycle
  onCreated: ({ el, settings }) => { /* ... */ },
  onDestroyed: ({ el }) => { /* ... */ },
});
```

---

## Configuration Objects & Templating

### Configuration Object Types

Configuration objects provide customizable constants that can be overridden globally or per-instance:

```javascript
registerBehavior({
  name: 'tooltip',
  
  // Define configuration objects
  selectors: {
    trigger: '.tooltip-trigger',
    close: '.close-button',
  },
  classNames: {
    visible: 'visible',
    animating: 'animating',
  },
  errors: {
    noContent: 'Tooltip content not found',
  },
  templates: {
    tooltip: '<div class="tooltip"><div class="content"></div></div>',
  },
});
```

### Templating System

Configuration objects support `{key}` templating in event and mutation strings:

```javascript
registerBehavior({
  name: 'accordion',
  
  selectors: {
    header: '.accordion-header',
    content: '.accordion-content',
  },
  
  settings: {
    triggerElement: '.custom-trigger',
  },
  
  events: {
    // {header} replaced with selectors.header at runtime
    'click {header}': ({ self }) => {
      self.toggle();
    },
    
    // Settings can also be used in templates
    'mouseenter {triggerElement}': ({ self }) => {
      self.preview();
    },
  },
  
  mutations: {
    // Templating works in mutation strings too
    'add {content}': ({ $added }) => {
      $added.hide();
    },
  },
});
```

### Runtime Override Patterns

```javascript
// Global override (affects all future instances)
$.tooltip.selectors.trigger = '.custom-trigger';
$.tooltip.errors.noContent = 'Contenu introuvable'; // i18n

// Per-instance override
$('.element').tooltip({
  selectors: { trigger: '.my-trigger' },
  templates: { tooltip: '<div class="custom-tooltip"></div>' },
});

// Data attribute override (when allowDataOverride: true)
<div data-show-delay="500" data-trigger="hover"></div>
```

---

## Event System

### Event Declaration Syntax

```javascript
events: {
  // Standard event on behavior element
  'click': handler,
  
  // Delegated event within behavior element
  'click .button': handler,
  
  // Multiple events
  'mouseenter, mouseleave': handler,
  
  // Multiple selectors
  'click .btn1, click .btn2': handler,
  
  // Global events (outside behavior element)
  'global scroll window': handler,
  'global resize document': handler,
  
  // Deep events (cross shadow DOM boundaries)
  'deep click ui-button': handler,
  
  // Direct binding (non-bubbling events)
  'bind customEvent .element': handler,
  
  // With templating
  'click {trigger}': handler,  // Uses selectors/settings
};
```

### Event Handler Parameters

All event handlers receive comprehensive context:

```javascript
events: {
  'click .button': ({ 
    // Core parameters
    $,                    // Query constructor
    el,                   // Raw behavior element
    $el,                  // Query-wrapped behavior element
    self,                 // Behavior instance with all methods
    
    // Configuration
    settings,             // Current merged settings
    selectors,            // Selector configuration
    classNames,           // Class name configuration
    errors,               // Error messages
    templates,            // HTML templates
    
    // Event specific
    event,                // Native event object
    target,               // Event target element
    value,                // Input value or event.detail.value
    data,                 // Combined dataset + event.detail
  }) => {
    // Handler implementation
  }
};
```

### Event Delegation & Bubbling

The behavior system handles complex event bubbling automatically:

```javascript
// Bubble mapping for non-bubbling events
const bubbleMap = {
  blur: 'focusout',
  focus: 'focusin',
  load: 'DOMContentLoaded',
  unload: 'beforeunload',
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
};
```

### Event Cleanup

Events use `AbortController` for automatic cleanup:

```javascript
// In behavior constructor
this.controller = new AbortController();

// All events bound with abort signal
$element.on(eventName, handler, { 
  abortController: this.controller 
});

// Cleanup on destroy
this.controller.abort('behavior destroyed');
```

---

## Mutation Observers

### Mutation Declaration Syntax

```javascript
mutations: {
  // Watch for any changes to .item elements
  '.item': handler,
  
  // Only additions
  'add .item': handler,
  
  // Only removals
  'remove .item': handler,
  
  // Observe specific container for changes
  'observe .container => .item': handler,
  
  // Attribute changes
  'attributes .element': handler,
  
  // Text content changes
  'text .element': handler,
  
  // With templating
  '{listItem}': handler,  // Uses selectors/settings
};
```

### Mutation Handler Parameters

```javascript
mutations: {
  'add .item': ({
    // Core parameters (same as events)
    $, el, $el, self, settings, selectors, classNames, errors, templates,
    
    // Mutation specific
    mutations,            // Array of MutationRecord objects
    $added,               // Query collection of added elements
    $removed,             // Query collection of removed elements
    $target,              // Query-wrapped mutation target
    target,               // Raw mutation target
    
    // For attribute mutations
    attributeName,        // Changed attribute name
    oldValue,             // Previous value
    newValue,             // Current value
  }) => {
    // Handler implementation
  }
};
```

### Mutation Observer Configuration

The system automatically configures `MutationObserver` options based on keywords:

```javascript
// Default configuration
{
  childList: true,      // Watch for added/removed nodes
  subtree: true,        // Watch entire subtree
}

// Additional options by keyword
'attributes': {
  attributes: true,
  attributeOldValue: true,
}

'text': {
  characterData: true,
  characterDataOldValue: true,
}
```

### Example: Auto-Markdown Behavior

```javascript
registerBehavior({
  name: 'automarkdown',
  
  defaultSettings: {
    watch: '.raw',  // Selector to watch
  },
  
  createBehavior: ({ $, self }) => ({
    addMarkdown(element) {
      const $element = $(element);
      const html = self.convertToMarkdown($element.text());
      $element.html(html);
    },
    
    convertToMarkdown(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // **bold**
        .replace(/\*(.*?)\*/g, '<em>$1</em>');            // *italic*
    },
  }),
  
  mutations: {
    // Template replaced with settings.watch value
    '{watch}': ({ self, $added }) => {
      $added.each(self.addMarkdown);
    },
  },
});

// Usage
$('ul').automarkdown({ watch: 'li' });
```

---

## Method Invocation & Custom Invocation

### Standard Method Invocation

Behaviors support multiple invocation patterns:

```javascript
// String method invocation
$('.element').behavior('methodName', arg1, arg2);

// Natural language lookup
$('.element').behavior('toggle state');    // Calls toggleState()
$('.element').behavior('is visible');      // Calls isVisible()
$('.element').behavior('get value');       // Calls getValue() or get.value

// Direct instance access
const element = document.querySelector('.element');
element.behaviorName.methodName();         // Direct call
```

### Method Lookup Algorithm

The behavior system uses intelligent method resolution:

```javascript
// Lookup order for 'toggle state':
1. toggleState()         // CamelCase conversion
2. toggle.state          // Dot notation traversal
3. toggle['state']       // Property access
4. customInvocation()    // Fallback handler
```

### Custom Invocation

For flexible string-based APIs like transitions:

```javascript
registerBehavior({
  name: 'transition',
  
  createBehavior: ({ self }) => ({
    performTransition(type, duration) {
      // Implementation
    },
  }),
  
  customInvocation: ({ methodName, methodArgs, self }) => {
    // methodName could be 'fade in', 'slide up', etc.
    return self.performTransition(methodName, ...methodArgs);
  },
});

// Enables usage like:
$('.modal').transition('fade in', 500);
$('.panel').transition('slide down', 300);
```

---

## Lifecycle Management

### Behavior Lifecycle Flow

```
Registration Phase
├── registerBehavior() called
├── Query.behaviors.set(name, behavior)
└── Query.prototype[name] created

Initialization Phase
├── $element.behavior() called
├── setup() runs once (first instance only)
├── Behavior constructor
│   ├── Settings merged (defaults → user → data attributes)
│   ├── createBehavior() called
│   ├── Instance attached to element[namespace]
│   ├── Events attached with AbortController
│   ├── Mutations attached
│   └── onCreated() callback
└── Instance ready

Usage Phase
├── Method calls via string or direct access
├── Settings updates trigger reinitialize
└── Events and mutations active

Destruction Phase
├── destroy() called (or element removed)
├── Mutation observers disconnected
├── AbortController aborts all events
├── onDestroyed() callback
└── element[namespace] deleted
```

### Setup Function

Runs once per behavior type, creates shared resources:

```javascript
setup: ({ $, settings, $elements, templates }) => {
  // Note: different parameters than other callbacks
  // $elements is plural (all elements being initialized)
  
  // Return shared resources
  return {
    cache: new Map(),
    $sharedTooltip: $(templates.tooltip).appendTo('body'),
    sharedState: { count: 0 },
  };
}

// Returned properties become part of `self` in all instances
createBehavior: ({ self }) => ({
  useShared() {
    self.cache.set('key', 'value');        // From setup
    self.$sharedTooltip.show();            // From setup
    self.sharedState.count++;              // From setup
  },
});
```

---

## CSS Integration

### Constructed Stylesheet Adoption

Behaviors can inject CSS efficiently using constructed stylesheets:

```javascript
registerBehavior({
  name: 'tooltip',
  
  css: `
    .tooltip {
      position: absolute;
      padding: 8px;
      background: black;
      color: white;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .tooltip.visible {
      opacity: 1;
    }
  `,
});
```

### CSS Caching Strategy

- Stylesheets are cached and reused across instances
- Uses browser's Constructed Stylesheet API
- Automatic adoption to element's document
- Cleaned up when no instances remain

---

## Instance Management

### Storage Pattern

Behaviors are stored directly on DOM elements:

```javascript
// Default: stored at element[behaviorName]
element.tooltip = behaviorInstance;

// Custom namespace: stored at element[namespace]
registerBehavior({
  name: 'tooltip',
  namespace: 'myTooltip',  // element.myTooltip
});
```

### Instance Access

```javascript
// Get instance via Query
const instance = $('.element').tooltip('instance');

// Direct element access
const element = document.querySelector('.element');
const instance = element.tooltip;

// Behavior static method
const instance = Behavior.getInstance(element, 'tooltip');
```

### Reinitialization

Settings updates trigger full reinitialization:

```javascript
// Initial setup
$('.element').tooltip({ delay: 100 });

// Reinitialize with new settings
$('.element').tooltip({ delay: 200, position: 'top' });
// → Destroys old instance, creates new one
```

---

## Return Value Collection

### Intelligent Return Handling

The behavior system intelligently collects return values:

```javascript
// Single element - returns single value
const isVisible = $('.single').tooltip('is visible');  // true

// Multiple elements - returns array
const states = $('.multiple').tooltip('is visible');    // [true, false, true]

// Deduplication - same values collapsed
$('.three-elements').tooltip('get type');  // 'info' (all returned 'info')
$('.three-elements').tooltip('get type');  // ['info', 'warning'] (different values)

// Void methods - returns Query instance for chaining
$('.element').tooltip('show').addClass('active');
```

### Collection Algorithm

```javascript
if (isArray(returnedValue)) {
  returnedValue.push(response);
}
else if (returnedValue !== undefined) {
  if (returnedValue !== response) {
    returnedValue = [returnedValue, response];  // Different values
  }
  // Same value - keep single value
}
else if (response !== undefined) {
  returnedValue = response;
}
```

---

## Real-World Patterns

### Pattern: Shared Tooltip

Multiple elements share a single tooltip element:

```javascript
registerBehavior({
  name: 'tooltip',
  
  setup: ({ $, templates }) => ({
    // Single tooltip for all instances
    $tooltip: $(templates.tooltip).appendTo('body'),
  }),
  
  createBehavior: ({ self, el, settings }) => ({
    show() {
      // Update shared tooltip content
      self.$tooltip
        .find('.content').html(settings.content).end()
        .addClass('visible');
      
      // Position relative to this element
      const rect = el.getBoundingClientRect();
      self.$tooltip.css({
        top: rect.top - 40,
        left: rect.left,
      });
    },
  }),
});
```

### Pattern: Transition System

Complex string-based API with animation detection:

```javascript
registerBehavior({
  name: 'transition',
  
  createBehavior: ({ $el, self }) => ({
    animate(settings) {
      const animation = self.detectAnimation(settings.animation);
      return self.playAnimation(animation, settings);
    },
    
    detectAnimation(name) {
      // Create test element with animation classes
      const $test = $('<div>')
        .addClass(name)
        .addClass('transition')
        .appendTo('body');
      
      // Check computed animations
      const animations = $test.el().getAnimations();
      
      // Cache and return animation data
      return self.cacheAnimation(name, animations);
    },
  }),
  
  // Handle string invocations like .transition('fade in')
  customInvocation: ({ methodName, methodArgs, self }) => {
    const [duration, callback] = methodArgs;
    return self.animate({
      animation: methodName,
      duration: duration || 'auto',
      onComplete: callback || (() => {}),
    });
  },
});
```

### Pattern: Auto-Enhancement

Behaviors that automatically enhance dynamically added content:

```javascript
registerBehavior({
  name: 'autoenhance',
  
  defaultSettings: {
    enhance: '[data-enhance]',
  },
  
  createBehavior: ({ self }) => ({
    enhance(element) {
      // Apply enhancements
      $(element).addClass('enhanced');
    },
  }),
  
  mutations: {
    // Watch for matching elements
    'add {enhance}': ({ $added, self }) => {
      $added.each(self.enhance);
    },
  },
  
  onCreated: ({ $el, self, settings }) => {
    // Enhance existing elements on creation
    $el.find(settings.enhance).each(self.enhance);
  },
});
```

---

## Decision Matrix

### When to Use Simple Plugins

| Scenario | Example |
|----------|---------|
| Utility methods | `.maskInput()`, `.formatDate()` |
| One-time operations | `.shuffle()`, `.randomize()` |
| Stateless transformations | `.wrapInner()`, `.unwrap()` |
| Simple event binding | `.clickOutside()` |
| DOM manipulation helpers | `.moveAfter()`, `.swapWith()` |

### When to Use Behaviors

| Scenario | Example |
|----------|---------|
| Stateful components | Tooltips, modals, accordions |
| Complex event handling | Drag & drop, gestures |
| Settings persistence | Configurable plugins |
| Animation systems | Transitions, effects |
| DOM monitoring | Auto-enhance, lazy loading |
| Multi-method APIs | `.show()`, `.hide()`, `.toggle()` |
| Resource management | Shared overlays, caching |

### Feature Comparison

| Feature | Simple Plugin | Behavior |
|---------|--------------|----------|
| **Setup complexity** | Minimal | Structured |
| **State management** | Manual | Built-in |
| **Settings system** | Manual | Automatic merging |
| **Data attributes** | Manual parsing | Auto-override |
| **Event handling** | Query `.on()` | Declarative + delegation |
| **Event cleanup** | Manual | Automatic (AbortController) |
| **Mutation observers** | Manual | Declarative syntax |
| **CSS injection** | Manual | Automatic + cached |
| **Method invocation** | Direct only | String + natural language |
| **Return values** | Manual | Intelligent collection |
| **Lifecycle hooks** | None | onCreate/onDestroy |
| **Instance storage** | Manual | Automatic on element |
| **Configuration objects** | None | selectors/classNames/errors/templates |
| **Templating** | None | `{key}` interpolation |
| **Custom invocation** | N/A | Fallback handler |
| **Shared resources** | Manual | setup() function |
| **Memory footprint** | Minimal | Per-instance overhead |

---

## Implementation Guidelines

### Simple Plugin Best Practices

1. **Always return `this` or values** - Enable chaining
2. **Use `.each()` for element iteration** - Handle collections properly
3. **Namespace events** - Prevent conflicts: `.on('click.myplugin')`
4. **Check element type** - Validate expected DOM elements
5. **Document options** - Clear parameter documentation

### Behavior Best Practices

1. **Use configuration objects** - Enable customization and i18n
2. **Implement standard methods** - `show()`, `hide()`, `toggle()`, `destroy()`
3. **Cache expensive operations** - Use setup() for shared resources
4. **Handle settings updates** - Reinitialize gracefully
5. **Clean up resources** - Implement proper onDestroyed cleanup
6. **Use semantic naming** - Match framework conventions
7. **Document templates** - Provide template structure documentation
8. **Test mutation observers** - Verify DOM monitoring behavior
9. **Consider performance** - Use CSS animations when possible
10. **Provide data attributes** - Enable HTML-based configuration

---

## Source References

- **Core Implementation**: `/packages/query/src/register-behavior.js`
- **Behavior Class**: `/packages/query/src/behavior.js`
- **Helper Exports**: `/packages/query/src/helpers.js`
- **Simple Plugin Example**: `/docs/src/examples/query/plugins/query-plugin/`
- **Tooltip Behavior**: `/docs/src/examples/query/plugins/query-behavior/`
- **Mutation Example**: `/docs/src/examples/query/plugins/query-behavior-mutations/`
- **Transition Behavior**: `/src/behaviors/transition/`

---

*This canonical guide serves as the complete technical specification for Query plugins and behaviors. For implementation details, consult the source references.*
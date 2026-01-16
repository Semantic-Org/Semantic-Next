# SUI DevTools Extension: Build Plan & Context Loading Strategy

> **For Agentic LLM Development Teams**
>
> This document provides explicit context loading strategies, verified API references, and a phased build plan for developing the Semantic UI DevTools Chrome extension.

---

## Document Relationship

This document is paired with **`sui-devtools-proposal.md`** which contains:
- High-level architecture and design rationale
- UI mockups and panel layouts
- Complete feature specifications
- Open questions and design decisions

**Use this document for**: Implementation details, API references, build phases, testing
**Use the proposal for**: Understanding what we're building and why

When implementing, read relevant sections from both:
1. **Proposal** → Understand the feature goal and UI design
2. **Build Plan** → Get exact API calls and implementation steps

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Context Loading Strategy](#context-loading-strategy)
3. [Verified API Reference](#verified-api-reference)
4. [Build Phases](#build-phases)
5. [Testing Strategy](#testing-strategy)
6. [File Structure](#file-structure)
7. [Validated Example: ui-menu](#validated-example-ui-menu)
8. [API Quick Reference](#api-quick-reference)

---

## Project Overview

### What We're Building

A Chrome DevTools extension that provides:
- Component tree visualization (semantic hierarchy, not raw DOM)
- Spec-aware styling panel with live attribute editing
- Runtime introspection (settings, state, component methods)
- Event handler inspection and live event monitoring
- CSS variable debugging via CSS layer inspection

### Key Architectural Decisions

1. **Component Detection**: `el.component !== undefined` (not tag prefix)
2. **Data Access**: All via element properties (`el.template`, `el.component`, `el.componentSpec`, etc.)
3. **CSS Discovery**: CSSOM traversal of `el.shadowRoot.adoptedStyleSheets` with `@layer` parsing
4. **Reactivity**: Use SUI's Reaction system for live state observation
5. **Specs**: Bundle from `@semantic-ui/core/specs`, lazy-load with Map caching

---

## Context Loading Strategy

### Priority 1: Core Component APIs (Load First)

These files define the element properties DevTools reads. **Read before writing bridge code.**

| File | Key APIs |
|------|----------|
| `packages/component/src/web-component.js` | `el.settings`, `el.getSettings()`, `el.defaultSettings` |
| `packages/component/src/define-component.js` | `el.template`, `el.component`, `el.componentSpec` |
| `packages/templating/src/template.js` | `template.events`, `template.keys`, `template.state`, `template.data` |
| `packages/query/src/query.js` | `$$()` shadow-piercing queries |

### Priority 2: Spec System (Load for Styles Tab)

| File | Key APIs |
|------|----------|
| `src/specs/specs.js` | All `*Spec` and `*ComponentSpec` exports |
| Any `*.spec.json` file | `types`, `variations`, `states`, `settings`, `events` structure |
| Any `*.component.js` spec | `allowedValues`, `optionAttributes`, `propertyTypes` |

### Priority 3: CSS Layer Structure (Load for Styles Tab)

| File | Key Information |
|------|-----------------|
| `src/primitives/*/definition/*-definition.css` | `@layer {component}.definition.{category}.{value}` |
| `src/primitives/*/theme/*-theme.css` | `@layer {component}.theme.{category}.{value}` |

### Priority 4: Reactivity (Load for Live Updates)

| File | Key APIs |
|------|----------|
| `packages/reactivity/src/signal.js` | `signal.get()`, `signal.set()`, `signal.peek()` |
| `packages/reactivity/src/reaction.js` | `Reaction.create()`, `reaction.stop()` |

### Template Hierarchy Methods

Templates can traverse component hierarchy without manual DOM walking:

```javascript
template.findParent('componentName')   // Find ancestor component
template.findChild('componentName')    // Find descendant component
template.findChildren('componentName') // Find all descendants
```

These handle shadow DOM boundaries automatically - useful for building the component tree.

---

## Verified API Reference

### Element Properties (from web-component.js, define-component.js)

```javascript
// After component renders (willUpdate in define-component.js):
el.template           // Template instance - USE THIS for live data
el.component          // Component instance (same as el.template.instance)
el.componentSpec      // Runtime spec (passed to defineComponent)

// Settings system (web-component.js):
el.settings           // Reactive proxy
el.settingsVars       // Map<string, Signal>
el.defaultSettings    // Default values object
```

### Template Instance (from template.js)

```javascript
// Properties:
template.events       // Object: { 'click .btn': handler }
template.keys         // Object: { 'esc': handler, 'ctrl+s': handler }
template.defaultState // Object: original state definition
template.state        // Object: { signalName: Signal } - USE THIS for live state
template.css          // String: component CSS
template.instance     // Object: component instance/self (same as el.component)
template.data         // Object: THE AUTHORITATIVE DATA CONTEXT - this is what templates evaluate against
template.templateName // String: component name for tree display

// Lifecycle flags (useful for DevTools status):
template.initialized  // Boolean: initialize() has been called
template.rendered     // Boolean: first render complete
template.destroyed    // Boolean: component torn down

// Shadow DOM query methods (simplest approach for DOM inspection):
template.$('.selector')   // Query inside shadow root (Query object)
template.$$('.selector')  // Query all with shadow piercing (Query object)

// Parent/child traversal (use these for tree building as alternative to DOM traversal):
template.findParent('componentName')   // Returns { ...component, ...data }
template.findChild('componentName')    // Returns { ...component, ...data }
template.findChildren('componentName') // Returns array of above

// Event string parsing (handles bubbling, modifiers, multiple selectors):
template.parseEventString('deep click .btn')  // Returns [{ eventName, eventType, selector }]
```

**Data Context Clarification**:
- `template.data` is the **live, authoritative** data context used for template evaluation
- `template.getDataContext()` returns merged `{ ...data, ...state, ...instance }` for display

### Settings Access

```javascript
// Get all current settings as a complete snapshot:
el.getSettings()      // Returns plain object with all current values

// For individual reactive settings:
el.settings.propertyName  // Reactive proxy access
```

**Recommended**: Use `el.getSettings()` to retrieve all settings values - it guarantees a complete snapshot of current values.

### Settings Reactivity

The `el.settings` proxy creates Signals lazily when properties are accessed. This enables reactive observation:

```javascript
// Reading el.settings.fitted:
// 1. Creates a Signal for 'fitted' if not exists
// 2. Calls signal.get() which creates a reactive dependency
// 3. Returns the current value

// For DevTools live updates, create a Reaction that reads settings:
Reaction.create(() => {
  const fitted = el.settings.fitted;  // Creates dependency
  updatePanel({ fitted });            // Called when fitted changes
});
```

### Reading and Writing Component Values

**Reading** - Use `el.getSettings()` for a complete snapshot:
```javascript
el.getSettings()        // { fitted: true, size: 'large', items: [], ... }
el.size                 // 'large' (resolved property value)
```

**Writing** - Set the property directly, SUI handles serialization:
```javascript
el.fitted = true        // Boolean: adds/removes attribute
el.size = 'large'       // String: sets attribute value
el.items = [{id: 1}]    // Array/Object: JSON serialized automatically
```

### Signal API (from reactivity package)

```javascript
// Signal instance methods:
signal.get()          // Read value (creates reactive dependency)
signal.set(value)     // Write value (triggers reactions)
signal.peek()         // Read without dependency
signal.value          // Property accessor (getter/setter)
signal.clear()        // Set to undefined

// Built-in helpers (type-specific):
signal.toggle()                      // Boolean: flip value
signal.increment(n)                  // Number: add n (default 1)
signal.decrement(n)                  // Number: subtract n
signal.push(item)                    // Array: add to end
signal.removeItem(id)                // Array: remove by _id field
signal.setProperty(key, value)       // Object: set nested property
signal.setArrayProperty(id, k, v)    // Array: set property on item by _id
```

**Note**: These helpers are used extensively in SUI components (see examples like `todo-list`, `form-builder`). DevTools should be aware of them when displaying state.

### Reaction API (from reactivity package)

```javascript
// Create a reaction:
const reaction = Reaction.create(() => {
  // This runs when dependencies change
  const value = someSignal.get();  // Creates dependency
});

// Stop a reaction:
reaction.stop();

// Utility:
Reaction.afterFlush(callback)  // Run after DOM updates
Reaction.nonreactive(fn)       // Run without tracking
```

### Runtime Spec vs Full JSON Spec

**Two spec types** - know which to use:

| Spec Type | Source | Contains | Use For |
|-----------|--------|----------|---------|
| `el.componentSpec` | Runtime (*.component.js) | types, variations, states, settings, propertyTypes, allowedValues | UI controls, validation |
| Bundled JSON spec | Build-time (*.spec.json) | events, descriptions, examples, full documentation | Events tab, tooltips, dropdowns |

**Runtime componentSpec** (on element):
```javascript
el.componentSpec = {
  tagName: "ui-button",
  types: ["emphasis", "link", "styled"],
  variations: ["fluid", "compact", "size"],
  states: ["hover", "active", "disabled", "loading"],
  settings: ["icon-only", "icon-after", "href"],
  optionAttributes: { "primary": "emphasis", "large": "size" },
  allowedValues: { "size": ["mini", "tiny", "small", "medium", "large"] },
  propertyTypes: { "fluid": "boolean", "size": "string" },
  defaultValues: { "icon-only": false },
  // NOTE: No 'events' field - use bundled JSON spec for events
}
```

**Bundled JSON spec** (from build):
```javascript
// Contains events, descriptions, examples not in runtime spec
fullSpec.events = [
  { eventName: "click", description: "Fired when clicked", arguments: [...] }
]
```

### Spec Import Convention

```javascript
// From @semantic-ui/core/specs:
import { ButtonComponentSpec, ButtonSpec } from '@semantic-ui/core/specs';

// ButtonComponentSpec = processed runtime spec (on el.componentSpec)
// ButtonSpec = raw JSON with descriptions, examples, etc.

// To build spec lookup by tagName:
const specsByTag = {};
for (const [name, spec] of Object.entries(Specs)) {
  if (spec.tagName) specsByTag[spec.tagName] = spec;
}
```

### Full Spec Structure (from *.spec.json)

```javascript
// Raw spec (ButtonSpec) has descriptions and examples:
spec = {
  uiType: "element",
  name: "Button",
  description: "A button indicates a possible user action",
  exportName: "UIButton",

  // With descriptions and examples:
  types: [
    {
      name: "Emphasis",
      attribute: "emphasis",
      description: "emphasize importance",
      options: [
        { name: "Primary", value: "primary", exampleCode: "..." }
      ]
    }
  ],

  events: [
    {
      eventName: "click",
      description: "fired when clicked",
      arguments: [{ name: "event", description: "..." }]
    }
  ],

  examples: {
    defaultContent: "<span>Click Me</span>",
    defaultAttributes: { primary: true }
  }
}
```

### CSS Layer Naming Convention

SUI uses two distinct layer types:

| Layer Type | Pattern | Contains |
|------------|---------|----------|
| **Definition** | `{component}.definition.{category}.{value}` | CSS rules (selectors, properties) |
| **Theme** | `{component}.theme.{category}.{value}` | CSS variables (custom properties on `:host`) |

**Definition layers** - CSS rules that apply styles:
```css
@layer menu.definition.content.menu {
  .menu {
    display: flex;
    flex-direction: row;
    gap: var(--menu-gap);
    background: var(--menu-background);
  }
}

@layer menu.definition.variations.fitted {
  :host([fitted]),
  .fitted.menu {
    margin: 0;
  }
}
```

**Theme layers** - CSS variable declarations:
```css
@layer menu.theme.content.menu {
  :host {
    --menu-margin: var(--vertically-spaced);
    --menu-gap: var(--4px);
    --menu-background: none;
  }
}

@layer menu.theme.variations.inset {
  :host {
    --menu-inset-padding: 3px 4px;
    --menu-inset-border-radius: var(--border-radius);
  }
}
```

**Layer categories** (apply to both definition and theme):

| Category | Maps To | Example |
|----------|---------|---------|
| `content` | Base styles | `menu.definition.content.item` |
| `types` | `spec.types` | `menu.definition.types.selection` |
| `variations` | `spec.variations` | `menu.theme.variations.vertical` |
| `states` | `spec.states` | `button.definition.states.disabled` |
| `plural` | Group styles | `button.definition.plural` |

### CSS Variable Structure

**Source**: `emphasis.css`, `emphasis-variables.css`

Variables are declared on `:host` and reference global design tokens:

```css
/* emphasis-variables.css - Variable declarations on :host */
:host {
  /* Primary - references global tokens */
  --button-primary-color: var(--primary-color);
  --button-primary-text-color: var(--button-inverted-text-color);
  --button-primary-box-shadow: var(--button-colored-box-shadow);

  /* State modifiers using oklch color math */
  --button-primary-color-hover: oklch(from var(--button-primary-color) calc(l + var(--hover-lightness)) c h);
  --button-primary-color-focus: oklch(from var(--button-primary-color) calc(l + var(--focus-lightness)) c h);
  --button-primary-color-down: oklch(from var(--button-primary-color) calc(l + var(--down-lightness)) c h);
}
```

```css
/* emphasis.css - Using the variables in selectors */
.primary.button {
  background-color: var(--button-primary-color);
  color: var(--button-primary-text-color);
  box-shadow: var(--button-primary-box-shadow);

  /* Scoped overrides for styled variant */
  --button-styled-background: var(--primary-background);
  --button-styled-text-color: var(--primary-text-color);

  &:hover {
    background-color: var(--button-primary-color-hover);
  }
}
```

**Variable Naming Pattern**: `--{component}-{variation}-{property}[-{state}]`

Examples:
- `--button-primary-color` - Base color for primary button
- `--button-primary-color-hover` - Hover state color
- `--button-styled-background` - Scoped override for styled variant

### CSSOM Access (for CSS Discovery)

```javascript
// Styles are on shadow root, NOT the element:
const styleSheets = el.shadowRoot.adoptedStyleSheets;

// Traverse rules:
for (const sheet of styleSheets) {
  for (const rule of sheet.cssRules) {
    if (rule instanceof CSSLayerBlockRule) {
      console.log(rule.name);     // "button.definition.types.emphasis"
      console.log(rule.cssRules); // Nested style rules
    }
  }
}
```

**Important Note on @import Layers**: The CSS uses `@import url(...) layer(...)` syntax. When these are processed by the browser and adopted into the shadow root, they become `CSSLayerBlockRule` objects. The layer names are preserved and accessible via `rule.name`.

### Reactivity API

**Source**: `reactivity.md`

```javascript
// === SIGNAL ===
const signal = new Signal(initialValue, options);

// Reading
signal.get()          // Read value, creates dependency in Reaction
signal.peek()         // Read value WITHOUT creating dependency
signal.value          // Property accessor (same as get())

// Writing
signal.set(newValue)  // Set value, triggers reactions if changed
signal.value = val    // Property setter (same as set())
signal.clear()        // Set to undefined

// Type-specific helpers
signal.toggle()                    // Boolean: flip
signal.increment(n)                // Number: add n (default 1)
signal.decrement(n)                // Number: subtract n
signal.push(item)                  // Array: add to end
signal.removeItem(id)              // Array: remove by id field
signal.setProperty(key, value)     // Object: set property
signal.setArrayProperty(idx, k, v) // Array: set property on item

// Derived signals
const count = items.derive(arr => arr.length);  // From single signal
const total = Signal.computed(() => a.get() + b.get());  // From multiple

// === REACTION ===

// Create reaction (runs immediately by default)
const reaction = Reaction.create((ctx) => {
  const val = signal.get();  // Creates dependency

  if (ctx.firstRun) {
    // First execution only
  }
});

// Stop reaction (cleanup)
reaction.stop();

// Static utilities
Reaction.afterFlush(callback)     // Run after all reactions complete
Reaction.nonreactive(() => {})    // Execute without tracking dependencies
Reaction.flush()                  // Force immediate execution of pending
Reaction.guard(() => value)       // Only trigger if computed result changes
```

### Live State Observation (DevTools Pattern)

The extension **bundles its own copy** of `@semantic-ui/reactivity` (it's tiny ~4KB). This allows creating reactions on any component's signals:

```javascript
// bridge.js - bundled with @semantic-ui/reactivity
import { Reaction } from '@semantic-ui/reactivity';

function observeComponentState(elementId, callback) {
  const el = findElementById(elementId);
  const state = el.template.state;

  // Create reaction that tracks all state signals
  const reaction = Reaction.create(() => {
    const snapshot = {};
    for (const [key, signal] of Object.entries(state)) {
      snapshot[key] = signal.get();  // Creates dependency via Scheduler.current
    }
    callback(snapshot);
  });

  return reaction;  // Caller responsible for reaction.stop()
}

// Usage in DevTools
let currentReaction = null;

function selectComponent(elementId) {
  // Cleanup previous observation
  if (currentReaction) {
    currentReaction.stop();
  }

  // Start observing new component
  currentReaction = observeComponentState(elementId, (state) => {
    sendToPanel({ type: 'STATE_UPDATE', elementId, state });
  });
}
```

**Why this works**:
- Signals use `Scheduler.current` for dependency tracking (global, not component-scoped)
- Any `Reaction.create()` can observe any Signal from anywhere
- The reaction lifecycle is managed by DevTools, independent of component lifecycle
- When signal values change, `Scheduler` queues our reaction, callback fires

### Bridge Script Bundling

**SUI is pure ESM with no global exports.** However, the bridge script is **bundled** before injection, so it can import from `@semantic-ui/reactivity`.

**Build Setup**:
```javascript
// build/bundle-bridge.js (using esbuild, rollup, or similar)
import { build } from 'esbuild';

await build({
  entryPoints: ['content/bridge.js'],
  bundle: true,
  format: 'iife',  // Immediately-invoked function expression for injection
  outfile: 'dist/bridge.bundle.js',
  external: [],  // Bundle everything, including @semantic-ui/reactivity
});
```

**Bridge Entry Point**:
```javascript
// content/bridge.js (before bundling)
import { Reaction } from '@semantic-ui/reactivity';

window.__SUI_DEVTOOLS__ = {
  // Reaction is available here after bundling
  stateReactions: new Map(),

  startStateObservation(id, callback) {
    const el = this.findElementById(id);
    const state = el.template?.state;

    const reaction = Reaction.create(() => {
      const snapshot = {};
      for (const [key, signal] of Object.entries(state)) {
        snapshot[key] = signal.get();
      }
      callback(id, snapshot);
    });

    this.stateReactions.set(id, reaction);
  },
  // ...
};
```

**Why This Works**:
- Bridge is bundled at build time, `@semantic-ui/reactivity` is inlined (~4KB)
- The bundled IIFE runs in page context with full access to component signals
- Signals on the page use the same `Scheduler` system - our Reaction hooks in seamlessly

---

## Build Phases

### Phase 1: Foundation (Detection & Tree)

**Goal**: Working panel with component tree and basic selection.

**Test Criteria**:
- [ ] Extension loads in DevTools
- [ ] Panel shows "Semantic UI" tab
- [ ] Tree populates with SUI components on page
- [ ] Clicking tree node logs component to console
- [ ] Hovering tree node highlights element on page

**Implementation Steps**:

1. **Extension Scaffold**
   ```
   Create: manifest.json, devtools.html, devtools.js
   Create: panel/panel.html, panel/panel.js, panel/panel.css
   Create: background/service-worker.js
   Create: content/content-script.js, content/bridge.js
   ```

2. **Bridge Script** (content/bridge.js)
   ```javascript
   // Must implement:
   window.__SUI_DEVTOOLS__ = {
     isReady: false,

     // Detection
     isSUIComponent(el) {
       return el?.nodeType === Node.ELEMENT_NODE &&
              el?.component !== undefined;
     },

     // Tree building
     getComponentTree() { /* ... */ },

     // Element registry (WeakMap for GC)
     getComponentId(el) { /* ... */ },
     findElementById(id) { /* ... */ },

     // Highlighting
     highlightElement(id) { /* ... */ },
     clearHighlight() { /* ... */ },
   };
   ```

3. **Messaging Layer**
   - Service worker routes messages between panel and content script
   - Content script relays to/from bridge via postMessage

4. **Tree View Component**
   - Render hierarchical component list
   - Handle expand/collapse
   - Handle selection

**Files to Create**:
- `manifest.json`
- `devtools.html` / `devtools.js`
- `panel/panel.html` / `panel/panel.js` / `panel/panel.css`
- `panel/components/tree-view.js`
- `background/service-worker.js`
- `content/content-script.js`
- `content/bridge.js`
- `shared/constants.js`

---

### Phase 2: Developer Tab

**Goal**: Full runtime introspection panel.

**Test Criteria**:
- [ ] Settings table shows property | default | current
- [ ] Modified settings are visually highlighted
- [ ] State signals show current values
- [ ] Component methods are listed
- [ ] "Log to Console" works

**Implementation Steps**:

1. **Extend Bridge**
   ```javascript
   window.__SUI_DEVTOOLS__ = {
     // ... existing ...

     getComponentData(id) {
       const el = this.findElementById(id);
       return {
         settings: this.extractSettings(el),
         state: this.extractState(el),
         component: this.extractComponentInfo(el),
         template: this.extractTemplateInfo(el),
         element: this.extractElementInfo(el),
       };
     },

     extractSettings(el) {
       const defaults = el.defaultSettings || {};
       const current = el.getSettings?.() || {};  // Complete snapshot of all settings
       return { defaults, current };
     },

     extractState(el) {
       const state = el.template?.state || {};
       const result = {};
       for (const [key, signal] of Object.entries(state)) {
         if (signal?.get) {
           result[key] = signal.get();
         }
       }
       return result;
     },

     logToConsole(id) {
       const el = this.findElementById(id);
       console.group(el.tagName.toLowerCase());
       console.log('Element:', el);
       console.log('Component:', el.component);
       console.log('State:', el.template?.state);
       console.log('Settings:', el.settings);
       console.groupEnd();
     },
   };
   ```

2. **Developer Tab Component**
   - Collapsible sections for settings/state/component/element
   - Diff highlighting for modified settings
   - Method list with parameter hints

**Files to Create/Modify**:
- `panel/components/developer-tab.js`
- Modify `content/bridge.js`

---

### Phase 3: Styles Tab

**Goal**: Spec-aware styling panel with CSS layer inspection.

**Test Criteria**:
- [ ] Variations show as clickable chips
- [ ] Current values are highlighted
- [ ] Clicking chip updates element attribute
- [ ] CSS layers are listed by spec category
- [ ] CSS variables show computed values
- [ ] Color swatches render for color values

**Implementation Steps**:

1. **Bundle Specs**
   ```javascript
   // build-specs.js - run at extension build time
   import * as Specs from '@semantic-ui/core/specs';

   const bundled = {};
   for (const [name, spec] of Object.entries(Specs)) {
     if (spec.tagName) {
       bundled[spec.tagName] = spec;
     }
   }

   fs.writeFileSync('shared/bundled-specs.js',
     `export default ${JSON.stringify(bundled)}`);
   ```

2. **Extend Bridge for CSS**
   ```javascript
   window.__SUI_DEVTOOLS__ = {
     // ... existing ...

     getCSSLayers(id) {
       const el = this.findElementById(id);
       const shadowRoot = el.shadowRoot;
       if (!shadowRoot) return {};

       const layers = {};
       const styleSheets = shadowRoot.adoptedStyleSheets || [];

       for (const sheet of styleSheets) {
         this.traverseCSSRules(sheet.cssRules, layers);
       }

       return layers;
     },

     traverseCSSRules(rules, layers) {
       for (const rule of rules) {
         if (rule instanceof CSSLayerBlockRule) {
           const parsed = this.parseLayerName(rule.name);
           if (parsed) {
             if (!layers[parsed.category]) {
               layers[parsed.category] = {};
             }
             layers[parsed.category][parsed.specValue || 'base'] = {
               layerName: rule.name,
               variables: this.extractVariables(rule.cssRules),
             };
           }
           // Recurse for nested layers
           if (rule.cssRules.length) {
             this.traverseCSSRules(rule.cssRules, layers);
           }
         }
       }
     },

     parseLayerName(name) {
       // Pattern: {component}.{layerType}.{category}.{value}
       // layerType is 'definition' (CSS rules) or 'theme' (CSS variables)
       const parts = name.split('.');
       if (parts[1] !== 'definition' && parts[1] !== 'theme') return null;
       return {
         component: parts[0],        // 'menu'
         layerType: parts[1],        // 'definition' or 'theme'
         category: parts[2],         // 'content', 'types', 'variations', 'states'
         specValue: parts[3] || null // 'menu', 'selection', 'fitted', etc.
       };
     },

     updateAttribute(id, attr, value) {
       const el = this.findElementById(id);
       // Set via property - SUI handles serialization based on propertyType
       el[attr] = value;
     },
   };
   ```

3. **Styles Tab Component**
   - Spec data merged with CSS layer data
   - Variation/state chips with click handlers
   - CSS variable table with computed values

**Files to Create/Modify**:
- `panel/components/styles-tab.js`
- `shared/bundled-specs.js` (generated)
- `build/build-specs.js`
- Modify `content/bridge.js`

---

### Phase 4: Events Tab & Polish

**Goal**: Event inspection and production-ready UX.

**Test Criteria**:
- [ ] Spec events listed with descriptions
- [ ] Registered handlers (from template.events) shown
- [ ] Key bindings (from template.keys) shown
- [ ] Live event stream captures events
- [ ] Recording can be paused/cleared
- [ ] Element picker works
- [ ] Keyboard navigation in tree

**Implementation Steps**:

1. **Extend Bridge for Events**
   ```javascript
   window.__SUI_DEVTOOLS__ = {
     // ... existing ...

     eventLog: [],
     eventListeners: new Map(),

     getEventHandlers(id) {
       const el = this.findElementById(id);
       const template = el.template;
       const tagName = el.tagName.toLowerCase();

       // Events come from bundled JSON spec, NOT componentSpec
       // componentSpec has: types, variations, states, settings, propertyTypes
       // Full JSON spec has: events with descriptions, arguments, etc.
       const fullSpec = this.getBundledSpec(tagName);

       return {
         specEvents: fullSpec?.events || [],
         registeredHandlers: this.parseEventHandlers(el),
         keyBindings: this.parseKeyBindings(template?.keys),
       };
     },

     parseEventHandlers(el) {
       const template = el.template;
       if (!template?.events) return [];

       // Use template.parseEventString() which handles:
       // - Event bubbling mapping (blur→focusout, focus→focusin, etc.)
       // - Multiple events with commas: 'click, mousedown .btn'
       // - Multiple selectors with commas: 'click .foo, .bar'
       // - Modifiers: 'deep', 'global', 'bind'
       return Object.entries(template.events).map(([eventString, handler]) => {
         const parsed = template.parseEventString(eventString);
         return parsed.map(({ eventName, eventType, selector }) => ({
           eventString,
           modifier: eventType === 'delegate' ? null : eventType,
           eventName,
           selector: selector || '(element)',
           handlerName: handler.name || 'anonymous',
         }));
       }).flat();
     },

     parseKeyBindings(keys) {
       if (!keys) return [];
       // Key format: 'esc', 'ctrl+s', 'shift+enter', 'cmd+k cmd+p' (sequence)
       return Object.entries(keys).map(([keyCombo, handler]) => ({
         keyCombo,
         handlerName: handler.name || 'anonymous',
       }));
     },

     startEventMonitoring(id) {
       const el = this.findElementById(id);
       const spec = el.componentSpec;
       const eventNames = [
         ...(spec?.events?.map(e => e.eventName || e) || []),
         'click', 'change', 'input'
       ];

       const listeners = [];
       for (const eventName of [...new Set(eventNames)]) {
         const listener = (event) => {
           this.logEvent(id, eventName, event);
         };
         el.addEventListener(eventName, listener);
         listeners.push({ eventName, listener });
       }

       this.eventListeners.set(id, { el, listeners });
     },

     stopEventMonitoring(id) {
       const data = this.eventListeners.get(id);
       if (data) {
         for (const { eventName, listener } of data.listeners) {
           data.el.removeEventListener(eventName, listener);
         }
         this.eventListeners.delete(id);
       }
     },
   };
   ```

2. **Element Picker**
   ```javascript
   window.__SUI_DEVTOOLS__ = {
     // ... existing ...

     pickerActive: false,
     pickerOverlay: null,

     startElementPicker() { /* ... */ },
     stopElementPicker() { /* ... */ },
   };
   ```

3. **Live State Observation (Bundled Reaction)**

   The bridge bundles `@semantic-ui/reactivity` to enable true reactive updates:

   ```javascript
   // bridge.js - imports bundled reactivity
   import { Reaction } from '@semantic-ui/reactivity';

   window.__SUI_DEVTOOLS__ = {
     // ... existing ...

     stateReactions: new Map(),  // elementId -> Reaction

     startStateObservation(id, callback) {
       // Cleanup any existing reaction for this element
       this.stopStateObservation(id);

       const el = this.findElementById(id);
       const state = el.template?.state;

       if (!state) return null;

       const reaction = Reaction.create(() => {
         const snapshot = {};
         for (const [key, signal] of Object.entries(state)) {
           snapshot[key] = signal.get();  // Creates dependency
         }
         callback(id, snapshot);
       });

       this.stateReactions.set(id, reaction);
       return true;
     },

     stopStateObservation(id) {
       const reaction = this.stateReactions.get(id);
       if (reaction) {
         reaction.stop();
         this.stateReactions.delete(id);
       }
     },

     stopAllStateObservation() {
       for (const [id, reaction] of this.stateReactions) {
         reaction.stop();
       }
       this.stateReactions.clear();
     },
   };
   ```

4. **Console Helpers**
   ```javascript
   injectConsoleHelpers() {
     window.$sui = {
       selected: null,
       tree: () => this.getComponentTree(),
       inspect: (el) => { /* trigger panel selection */ },
       log: (el) => { /* log component details */ },
     };
   },
   ```

**Files to Create/Modify**:
- `panel/components/events-tab.js`
- Modify `content/bridge.js`
- Polish all existing components

---

## Testing Strategy

### Manual Testing Checklist

**Phase 1**:
```
1. Load extension in chrome://extensions (developer mode)
2. Open any page with SUI components
3. Open DevTools → Semantic UI panel
4. Verify tree shows components
5. Click component → verify console log
6. Hover component → verify highlight
```

**Phase 2**:
```
1. Select a component in tree
2. Verify Developer tab shows settings table
3. Modify a setting in page → verify tab updates (if reactive)
4. Click "Log to Console" → verify output
5. Verify methods list matches actual component
```

**Phase 3**:
```
1. Select a ui-button with variations
2. Verify chips show current values highlighted
3. Click different size → verify element updates
4. Verify CSS layers are categorized correctly
5. Verify computed values resolve correctly
```

**Phase 4**:
```
1. Verify event handlers list matches template.events
2. Enable recording → interact with component → verify log
3. Use element picker → click component → verify selection
4. Test keyboard navigation (arrows) in tree
```

### Test Pages

Create test HTML files with various SUI components:

```html
<!-- test/basic.html -->
<ui-button primary large icon="save">Save</ui-button>
<ui-button secondary disabled>Cancel</ui-button>

<!-- test/nested.html -->
<ui-card>
  <ui-header>Title</ui-header>
  <ui-button>Action</ui-button>
</ui-card>

<!-- test/complex.html -->
<ui-panels>
  <ui-panel label="Editor">
    <ui-menu vertical>
      <menu-item active>File</menu-item>
      <menu-item>Edit</menu-item>
    </ui-menu>
  </ui-panel>
</ui-panels>
```

---

## File Structure

```
sui-devtools/
├── manifest.json
├── devtools.html
├── devtools.js
├── panel/
│   ├── panel.html
│   ├── panel.js
│   ├── panel.css
│   └── components/
│       ├── tree-view.js
│       ├── tabs.js
│       ├── styles-tab.js
│       ├── developer-tab.js
│       └── events-tab.js
├── background/
│   └── service-worker.js
├── content/
│   ├── content-script.js
│   └── bridge.js
├── shared/
│   ├── constants.js
│   ├── bundled-specs.js (generated)
│   └── messaging.js
├── build/
│   └── build-specs.js
├── test/
│   ├── basic.html
│   ├── nested.html
│   └── complex.html
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## Validated Example: ui-menu

This example was extracted from a live component and validates the API patterns:

```javascript
// From: JSON.stringify({ tagName, component, templateState, settings, componentSpec })
{
  "tagName": "UI-MENU",
  "component": [
    "setValue",
    "getValue",
    "isValueActive",
    "selectValue",
    "selectIndex",
    "templateName"
  ],
  "templateState": [],
  "settings": {
    "fitted": true,
    "items": [],
    "value": ""
  },
  "componentSpec": {
    "tagName": "ui-menu",
    "content": ["item"],
    "types": ["selection"],
    "variations": ["evenly-spaced", "fitted", "vertical", "inset"],
    "settings": ["items", "value"],
    "attributes": ["item", "selection", "evenly-spaced", "fitted", "vertical", "inset", "items", "value"],
    "propertyTypes": {
      "selection": "boolean",
      "fitted": "boolean",
      "vertical": "boolean",
      "items": "array",
      "value": "string"
    },
    "defaultValues": {
      "items": [],
      "value": ""
    }
  }
}
```

**CSS layers found in this component's shadow root:**

| Layer | Type | Purpose |
|-------|------|---------|
| `menu.definition.content.menu` | Definition | Base `.menu` flex container rules |
| `menu.definition.content.item` | Definition | `.item` styling and hover/active states |
| `menu.definition.types.selection` | Definition | Selection type rules |
| `menu.definition.variations.fitted` | Definition | `:host([fitted])` margin reset |
| `menu.definition.variations.vertical` | Definition | Vertical flex-direction |
| `menu.theme.content.menu` | Theme | `--menu-*` variable declarations |
| `menu.theme.content.menuItem` | Theme | `--menu-item-*` variable declarations |
| `menu.theme.type.selection` | Theme | `--menu-selection-*` variables |
| `menu.theme.variations.inset` | Theme | `--menu-inset-*` variables |

---

## API Quick Reference

Before implementing any API call, verify the property/method exists in the source file.

**Canonical Property Paths**:

| Data | Access Path | Notes |
|------|-------------|-------|
| Event handlers | `el.template.events` | Object of event string → handler |
| State signals | `el.template.state` | Object of name → Signal |
| Live template data | `el.template.data` | Authoritative data context |
| Runtime spec | `el.componentSpec` | types, variations, states, propertyTypes, allowedValues |
| Spec events | Bundled JSON spec | `componentSpec` has no events - use bundled spec |
| Adopted styles | `el.shadowRoot.adoptedStyleSheets` | Array of CSSStyleSheet |
| All settings | `el.getSettings()` | Complete snapshot of current values |
| Parse event string | `template.parseEventString(str)` | Handles bubbling, modifiers, selectors |
| Signal read | `signal.get()` or `signal.value` | `.value` is a property, not a method |

**Architecture Notes**:
- SUI is pure ESM with no global exports - the bridge bundles `@semantic-ui/reactivity` inline
- Reactions created by the bridge can observe any Signal on the page via the shared Scheduler

**Bridge Script Capabilities**:

The bridge script is **bundled** at build time (via esbuild/rollup), which enables:
- Import from `@semantic-ui/reactivity` (bundled inline, ~4KB)
- Import from `@semantic-ui/utils` - use `clone()` for safe serialization, `each()` for iteration, etc.
- Use `Reaction.create()` for live state observation
- Access element properties (`el.component`, `el.template`, etc.)
- Call methods on signals directly (`el.template.state.foo.get()`)

**Always use `@semantic-ui/utils`** for utility functions instead of reimplementing. Key functions:
- `clone()` - safe deep clone that handles circular refs, DOM elements, functions
- `each()` - iterate objects, arrays, Maps, Sets
- `isEqual()` - deep equality comparison
- `kebabToCamel()` / `camelToKebab()` - case conversion

**Note on Signal values**: Signals internally clone values using `clone()` from utils (except class instances which pass by reference). So `signal.get()` returns cloned data for objects/arrays - safe to serialize directly.

Use `signal.canCloneValue(value)` to check if a value can be safely serialized:
```javascript
if (signal.canCloneValue(value)) {
  // Safe to serialize
} else {
  // Class instance - display as [ClassName]
}
```

---

## Summary

This build plan provides:

1. **Explicit context loading order** - Know exactly which files to read
2. **Verified API references** - Canonical property paths with source locations
3. **Phased implementation** - Each phase is independently testable
4. **Test criteria** - Clear success metrics for each phase
5. **API quick reference** - Consolidated table of correct access patterns

Start with Phase 1, verify all tests pass, then proceed to Phase 2. Each phase builds on the previous and can be demonstrated independently.

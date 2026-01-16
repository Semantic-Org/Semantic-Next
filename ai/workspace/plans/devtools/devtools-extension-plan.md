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

1. **Component Detection**: `el.constructor?.template !== undefined` (static property on SUI components, survives minification)
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
| `packages/templating/src/template.js` | `template.events`, `template.keys`, `template.state`, `template.getDataContext()` |
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

**Data Context**: `template.getDataContext()` returns `{ ...data, ...state, ...instance }` - the actual template data context used for expression evaluation.

### Settings Access

```javascript
// Get all current settings as a complete snapshot:
el.getSettings()      // Returns plain object with all current values

// For individual reactive settings:
el.settings.propertyName  // Reactive proxy access

// For direct signal access (use for live observation):
el.settingsVars           // Map<string, Signal> - direct access to setting signals
el.settingsVars.get('fitted')?.get()  // Read signal value
```

**When to use which**:
- `el.getSettings()` → Snapshot for displaying in panel (non-reactive)
- `el.settingsVars` → Direct signal access for creating Reactions (reactive observation)

### Settings Reactivity

The `el.settings` proxy creates Signals lazily when properties are accessed. This enables reactive observation:

```javascript
// Reading el.settings.fitted:
// 1. Creates a Signal for 'fitted' if not exists
// 2. Calls signal.get() which creates a reactive dependency
// 3. Returns the current value

// For DevTools live updates, create a Reaction that reads settings:
Reaction.create((computation) => {
  // Self-cleanup: reactions can stop themselves
  if (el.template?.destroyed) {
    computation.stop();
    return;
  }

  const fitted = el.settings.fitted;  // Creates dependency
  updatePanel({ fitted });            // Called when fitted changes
});
```

**Reaction self-cleanup**: The callback receives the reaction instance as `computation`. Call `computation.stop()` to stop from within. This pattern handles component destruction automatically - no external cleanup needed.

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

**Not all components have specs.** Only UI primitives (`ui-button`, `ui-menu`, etc.) are spec-based. User-created components and internal components may have `el.componentSpec === undefined`.

DevTools must handle both cases:
- **With spec**: Styles tab with variations/types chips organized by spec, full event descriptions
- **Without spec**: CSS panel showing raw CSS layers from shadow root (no spec-based chips, but CSS is still inspectable via `el.shadowRoot.adoptedStyleSheets`)

**Two spec types** for primitives:

| Spec Type | Source | Contains | Use For |
|-----------|--------|----------|---------|
| `el.componentSpec` | Runtime (*.component.js) | types, variations, states, settings, events (names only), propertyTypes, allowedValues | UI controls, validation |
| Bundled JSON spec | Build-time (*.spec.json) | events with descriptions/arguments, examples, full documentation | Events tab tooltips, dropdowns |

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
  events: ["click", "focus"],  // Event names; bundled spec has descriptions/arguments
}
```

**Bundled JSON spec** (from build):
```javascript
// Contains events, descriptions, examples not in runtime spec
// Example from menu.spec.json:
fullSpec.events = [
  {
    eventName: "change",
    description: "can specify a function to occur after the value changes",
    arguments: [
      { name: "value", description: "the updated value" }
    ]
  }
]
```

### Spec Import Convention

```javascript
// From @semantic-ui/core/specs:
import { ButtonComponentSpec, ButtonSpec } from '@semantic-ui/core/specs';

// ButtonComponentSpec = processed runtime spec (on el.componentSpec)
// ButtonSpec = raw JSON with descriptions, examples, etc.

// To build spec lookup by tagName (duck type: full specs have exportName):
import * as Specs from '@semantic-ui/core/specs';

const fullSpecsByTag = {};
for (const spec of Object.values(Specs)) {
  if (spec?.exportName) {
    fullSpecsByTag[spec.tagName] = spec;
  }
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

    const reaction = Reaction.create((computation) => {
      // Self-cleanup when component destroyed
      if (el.template?.destroyed) {
        computation.stop();
        this.stateReactions.delete(id);
        return;
      }

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
- [ ] Tree shows full DOM structure (not just SUI components)
- [ ] SUI components are visually distinguished (bold, icon, or color)
- [ ] Shadow DOM is expanded inline (no separate shadow root tree)
- [ ] Filtered nodes (comments, astro-island) are hidden by default
- [ ] Filter toggles in settings panel work (show/hide filtered nodes)
- [ ] Clicking tree node logs component to console
- [ ] Hovering tree node highlights element on page

**Full DOM Tree Architecture** (improved over native Elements view):

The tree shows ALL DOM nodes - not just SUI components - but with intelligent filtering to reduce noise. This provides:
- Complete DOM context (where is this button in the page?)
- Shadow DOM expansion inline (no separate tree like native Elements)
- Filtering of Lit comment nodes, wrapper elements, and other noise
- Visual distinction for SUI components vs regular DOM

```typescript
// Minimal data sent with tree (lightweight)
interface TreeNode {
  id: string;              // Unique ID from WeakMap registry
  nodeType: 'element' | 'text' | 'comment';
  tagName: string | null;  // e.g., "ui-button", "div", null for text
  displayName: string;     // e.g., "Button" (SUI), "div" (DOM), "#text" (text)
  isSUI: boolean;          // true for SUI components (visual highlighting)
  hasChildren: boolean;    // For expand/collapse UI
  hasShadow: boolean;      // true if element has shadowRoot
  depth: number;           // For indentation
  textPreview?: string;    // For text nodes: first 50 chars
  filtered?: boolean;      // true if node matches a filter (hidden by default)
}

// Full data sent only when component is selected (on-demand)
interface InspectedElement {
  id: string;
  tagName: string;
  isSUI: boolean;
  settings: { defaults: Record<string, any>; current: Record<string, any> } | null;
  state: Record<string, any> | null;
  methods: string[] | null;
  spec: { types: string[]; variations: string[]; states: string[]; events: any[] } | null;
  handlers: { events: any[]; keys: any[] } | null;
  css: { layers: any[]; variables: any[] };
  attributes: Record<string, string>;
  computedStyles: { display: string; position: string; width: string; height: string };
}
```

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
   window.__SUI_DEVTOOLS__ = {
     isReady: false,

     // Node registry (WeakMap for GC-friendly stable IDs)
     nodeRegistry: new WeakMap(),  // Node -> id
     nodesById: new Map(),         // id -> Node
     nextId: 1,

     // Filtering settings (synced from panel)
     filterSettings: {
       hideCommentNodes: true,      // Lit comment markers
       hideWrapperElements: true,   // astro-island, etc.
       hideScripts: true,           // <script> tags
       hideEmptyText: true,         // whitespace-only text nodes
     },

     // Known wrapper elements to filter (tag names)
     wrapperElements: new Set([
       'astro-island',
       'astro-slot',
       'astro-static-slot',
     ]),

     getOrCreateId(node) {
       let id = this.nodeRegistry.get(node);
       if (!id) {
         id = `node-${this.nextId++}`;
         this.nodeRegistry.set(node, id);
         this.nodesById.set(id, node);

         // Cleanup on destroy for SUI components
         if (this.isSUIComponent(node)) {
           node.addEventListener('destroyed', () => {
             this.nodesById.delete(id);
           }, { once: true });
         }
       }
       return id;
     },

     findNodeById(id) {
       return this.nodesById.get(id);
     },

     // Detection - SUI components have a static `template` property on their constructor
     // This is defined in define-component.js: `static template = litTemplate`
     // Using this instead of constructor.name because minification can rename classes
     isSUIComponent(el) {
       return el?.nodeType === Node.ELEMENT_NODE &&
              el?.constructor?.template !== undefined;
     },

     // Check if node should be filtered (hidden by default)
     shouldFilter(node) {
       const { filterSettings } = this;

       // Comment nodes (Lit markers like <!----> or <!--?lit...-->)
       if (node.nodeType === Node.COMMENT_NODE) {
         return filterSettings.hideCommentNodes;
       }

       // Text nodes - filter if empty/whitespace
       if (node.nodeType === Node.TEXT_NODE) {
         return filterSettings.hideEmptyText && !node.textContent.trim();
       }

       // Element nodes
       if (node.nodeType === Node.ELEMENT_NODE) {
         const tagName = node.tagName.toLowerCase();

         // Scripts
         if (tagName === 'script' && filterSettings.hideScripts) {
           return true;
         }

         // Known wrapper elements
         if (this.wrapperElements.has(tagName) && filterSettings.hideWrapperElements) {
           return true;
         }
       }

       return false;
     },

     // Full DOM tree building - returns ALL nodes with filtering metadata
     getComponentTree() {
       const roots = [];

       // Start from document.body children
       for (const child of document.body.childNodes) {
         const treeNode = this.buildTreeNode(child, 0);
         if (treeNode) roots.push(treeNode);
       }

       return roots;
     },

     buildTreeNode(node, depth) {
       if (!node) return null;

       const nodeType = node.nodeType;
       const isElement = nodeType === Node.ELEMENT_NODE;
       const isText = nodeType === Node.TEXT_NODE;
       const isComment = nodeType === Node.COMMENT_NODE;

       // Skip nodes we don't handle
       if (!isElement && !isText && !isComment) return null;

       const isSUI = isElement && this.isSUIComponent(node);
       const filtered = this.shouldFilter(node);
       const tagName = isElement ? node.tagName.toLowerCase() : null;

       // Build child nodes - shadow DOM first, then light DOM
       let children = [];

       if (isElement) {
         // Shadow DOM children (rendered as collapsible #shadow-root in UI)
         if (node.shadowRoot) {
           for (const shadowChild of node.shadowRoot.childNodes) {
             const childNode = this.buildTreeNode(shadowChild, depth + 1);
             if (childNode) {
               childNode.inShadow = true;
               children.push(childNode);
             }
           }
         }

         // Light DOM children
         for (const child of node.childNodes) {
           const childNode = this.buildTreeNode(child, depth + 1);
           if (childNode) children.push(childNode);
         }
       }

       return {
         id: this.getOrCreateId(node),
         nodeType: isElement ? 'element' : (isText ? 'text' : 'comment'),
         tagName,
         displayName: this.getDisplayName(node),
         isSUI,
         hasChildren: children.length > 0,
         hasShadow: isElement && !!node.shadowRoot,
         depth,
         textPreview: isText ? node.textContent.trim().slice(0, 50) : undefined,
         filtered,
         children: children.length > 0 ? children : undefined,
       };
     },

     getDisplayName(node) {
       if (node.nodeType === Node.TEXT_NODE) {
         const text = node.textContent.trim();
         return text ? `"${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"` : '#text';
       }
       if (node.nodeType === Node.COMMENT_NODE) {
         return '#comment';
       }

       // Element node
       const el = node;

       // For SUI components, prefer spec name
       if (this.isSUIComponent(el) && el.componentSpec?.name) {
         return el.componentSpec.name;
       }

       // For SUI components without spec name, convert tag: ui-button -> Button
       if (this.isSUIComponent(el)) {
         return el.tagName.toLowerCase()
           .replace(/^ui-/, '')
           .replace(/-./g, m => m[1].toUpperCase())
           .replace(/^./, m => m.toUpperCase());
       }

       // Regular DOM element - just use tag name
       return el.tagName.toLowerCase();
     },

     // Update filter settings from panel
     setFilterSettings(settings) {
       this.filterSettings = { ...this.filterSettings, ...settings };
     },

     // Full data - fetched on selection (lazy loading)
     getInspectedElement(id) {
       const node = this.findNodeById(id);
       if (!node) return null;

       // For non-element nodes, return minimal info
       if (node.nodeType !== Node.ELEMENT_NODE) {
         return {
           id,
           nodeType: node.nodeType === Node.TEXT_NODE ? 'text' : 'comment',
           textContent: node.textContent,
         };
       }

       const el = node;
       const isSUI = this.isSUIComponent(el);

       if (isSUI && el.template?.destroyed) {
         return { error: 'Component destroyed' };
       }

       return {
         id,
         tagName: el.tagName.toLowerCase(),
         isSUI,
         // Only include SUI-specific data for SUI components
         settings: isSUI ? this.extractSettings(el) : null,
         state: isSUI ? this.extractState(el) : null,
         methods: isSUI ? this.extractMethods(el) : null,
         spec: isSUI ? this.extractSpecInfo(el) : null,
         handlers: isSUI ? this.extractHandlers(el) : null,
         css: this.extractCSS(el),  // CSS available for any element with shadow root
         // Standard DOM info for all elements
         attributes: this.extractAttributes(el),
         computedStyles: this.extractComputedStyles(el),
       };
     },

     extractAttributes(el) {
       const attrs = {};
       for (const attr of el.attributes) {
         attrs[attr.name] = attr.value;
       }
       return attrs;
     },

     extractComputedStyles(el) {
       const computed = getComputedStyle(el);
       return {
         display: computed.display,
         position: computed.position,
         width: computed.width,
         height: computed.height,
       };
     },

     // Highlighting
     highlightElement(id) { /* ... */ },
     clearHighlight() { /* ... */ },
   };
   ```

3. **Messaging Layer**
   - Service worker routes messages between panel and content script
   - Content script relays to/from bridge via postMessage

4. **Tree View Component** (panel/components/tree-view.js)
   - Render hierarchical component list
   - Handle expand/collapse with keyboard navigation
   - Handle selection and hover highlighting

   **Default expansion state** (matches native DevTools behavior):
   - All nodes collapsed by default
   - Top-level nodes (direct children of `<body>`) are visible but collapsed
   - User expands nodes manually via click or arrow keys
   - When selecting via element picker, auto-expand path to selected node

**Files to Create**:
- `manifest.json`
- `devtools.html` / `devtools.js`
- `panel/panel.html` / `panel/panel.js` / `panel/panel.css`
- `panel/components/tree-view.js`
- `panel/components/filter-settings.js`
- `background/service-worker.js`
- `content/content-script.js`
- `content/bridge.js`
- `shared/constants.js`

---

### Phase 2: Developer Tab

**Goal**: Full runtime introspection panel using lazy-loaded data.

**Test Criteria**:
- [ ] Settings table shows property | default | current
- [ ] Modified settings are visually highlighted
- [ ] State signals show current values
- [ ] Component methods are listed
- [ ] "Log to Console" works

**Implementation Steps**:

1. **Extend Bridge with extract helpers** (for `getInspectedElement`)
   ```javascript
   window.__SUI_DEVTOOLS__ = {
     // ... existing from Phase 1 ...

     // These are called by getInspectedElement (lazy loading)
     extractSettings(el) {
       const defaults = el.defaultSettings || {};
       const current = el.getSettings?.() || {};
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
   import { writeFileSync, mkdirSync } from 'fs';

   // Duck type: full specs have exportName, component specs don't
   const fullSpecsByTag = {};
   for (const spec of Object.values(Specs)) {
     if (spec?.exportName) {
       fullSpecsByTag[spec.tagName] = spec;
     }
   }

   mkdirSync('shared/specs', { recursive: true });
   writeFileSync('shared/specs/index.js',
     `export default ${JSON.stringify(fullSpecsByTag, null, 2)};`);
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

       // componentSpec.events has event names like ['change', 'click']
       // Bundled JSON spec has full event objects with descriptions, arguments
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

2. **Element Picker** (toolbar button like native DevTools)

   The picker allows clicking any element on the page to select it in the tree.

   ```javascript
   window.__SUI_DEVTOOLS__ = {
     // ... existing ...

     pickerActive: false,
     pickerOverlay: null,
     pickerHighlight: null,

     startElementPicker(onSelect) {
       if (this.pickerActive) return;
       this.pickerActive = true;

       // Create overlay to capture clicks without affecting page
       this.pickerOverlay = document.createElement('div');
       this.pickerOverlay.style.cssText = `
         position: fixed; inset: 0; z-index: 999999;
         cursor: crosshair; background: transparent;
       `;

       // Create highlight element
       this.pickerHighlight = document.createElement('div');
       this.pickerHighlight.style.cssText = `
         position: fixed; pointer-events: none; z-index: 999998;
         background: rgba(99, 102, 241, 0.1);
         border: 2px solid rgba(99, 102, 241, 0.8);
         border-radius: 2px; transition: all 0.05s;
       `;
       document.body.appendChild(this.pickerHighlight);

       // Track element under cursor
       let currentElement = null;

       const handleMouseMove = (e) => {
         // Get element under cursor (temporarily hide overlay)
         this.pickerOverlay.style.pointerEvents = 'none';
         const el = document.elementFromPoint(e.clientX, e.clientY);
         this.pickerOverlay.style.pointerEvents = 'auto';

         if (el && el !== currentElement) {
           currentElement = el;
           const rect = el.getBoundingClientRect();
           Object.assign(this.pickerHighlight.style, {
             top: rect.top + 'px',
             left: rect.left + 'px',
             width: rect.width + 'px',
             height: rect.height + 'px',
             display: 'block',
           });
         }
       };

       const handleClick = (e) => {
         e.preventDefault();
         e.stopPropagation();
         if (currentElement) {
           const id = this.getOrCreateId(currentElement);
           onSelect(id, currentElement);
         }
         this.stopElementPicker();
       };

       const handleKeydown = (e) => {
         if (e.key === 'Escape') {
           this.stopElementPicker();
         }
       };

       this.pickerOverlay.addEventListener('mousemove', handleMouseMove);
       this.pickerOverlay.addEventListener('click', handleClick);
       document.addEventListener('keydown', handleKeydown);
       document.body.appendChild(this.pickerOverlay);

       // Store cleanup refs
       this._pickerCleanup = () => {
         this.pickerOverlay?.removeEventListener('mousemove', handleMouseMove);
         this.pickerOverlay?.removeEventListener('click', handleClick);
         document.removeEventListener('keydown', handleKeydown);
       };
     },

     stopElementPicker() {
       if (!this.pickerActive) return;
       this.pickerActive = false;
       this._pickerCleanup?.();
       this.pickerOverlay?.remove();
       this.pickerHighlight?.remove();
       this.pickerOverlay = null;
       this.pickerHighlight = null;
     },
   };
   ```

   **Panel toolbar button**:
   ```html
   <button class="picker-btn" title="Select element on page (Ctrl+Shift+C)">
     <svg><!-- cursor icon --></svg>
   </button>
   ```

   Keyboard shortcut `Ctrl+Shift+C` matches Chrome DevTools convention.

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

       const reaction = Reaction.create((computation) => {
         // Self-cleanup: reaction stops itself when component destroyed
         if (el.template?.destroyed) {
           computation.stop();
           this.stateReactions.delete(id);
           return;
         }

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
│       ├── filter-settings.js
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
| Full data context | `el.template.getDataContext()` | Merged `{ ...data, ...state, ...instance }` |
| Runtime spec | `el.componentSpec` | types, variations, states, propertyTypes, allowedValues |
| Event names | `el.componentSpec.events` | Array of event names like `['change']` |
| Event details | Bundled JSON spec | Full objects with descriptions, arguments |
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

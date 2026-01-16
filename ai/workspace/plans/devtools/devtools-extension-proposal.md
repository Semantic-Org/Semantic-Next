# SUI DevTools Extension: Complete Technical Proposal

> A Chrome DevTools extension for debugging Semantic UI web components, providing spec-aware inspection, CSS variable debugging, and runtime introspection.

---

## Document Relationship

This proposal is paired with **`sui-devtools-build-plan.md`** which contains:
- Context loading strategy for LLM agents
- Verified API references with line numbers
- Phased implementation steps
- Testing checklists

**Use this document for**: Architecture, design rationale, UI specifications
**Use the build plan for**: Implementation details, exact API calls, testing

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Extension Structure](#extension-structure)
4. [Component Detection & Tree Building](#component-detection--tree-building)
5. [Panel UI Design](#panel-ui-design)
6. [Tab Specifications](#tab-specifications)
7. [Element Inspection Integration](#element-inspection-integration)
8. [Console Integration](#console-integration)
9. [Messaging Architecture](#messaging-architecture)
10. [Implementation Plan](#implementation-plan)
11. [Open Questions & Alternatives](#open-questions--alternatives)

---

## Executive Summary

### Goals

1. **Simplify web component inspection** - Standard DevTools shows raw Shadow DOM with Lit comment nodes; we show semantic component structure
2. **Spec-aware debugging** - Show valid attributes, variations, states from the component spec alongside current values
3. **CSS variable debugging** - Surface the CSS custom property system (global tokens + component-specific vars) in an actionable UI
4. **Runtime introspection** - Expose `el.component`, `el.template.state`, settings with default vs current comparison
5. **Native-feeling UX** - Mirror Chrome DevTools patterns (tree view, tabbed inspector, element picker)

### Non-Goals (v1)

- Editing/hot-reloading component code
- Network request interception
- Performance profiling
- Time-travel debugging

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Chrome DevTools                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     "Semantic UI" Panel                                │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────────────────┐ │  │
│  │  │   Tree View     │  │              Tabbed Inspector               │ │  │
│  │  │                 │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │ │  │
│  │  │  ▼ ui-panels    │  │  │ Styles  │ │Developer│ │ Events  │       │ │  │
│  │  │    ▼ ui-panel   │  │  └─────────┘ └─────────┘ └─────────┘       │ │  │
│  │  │      ui-button  │  │                                             │ │  │
│  │  │    ▼ ui-panel   │  │  [Tab content based on selection]          │ │  │
│  │  │      ui-menu    │  │                                             │ │  │
│  │  │        ...      │  │                                             │ │  │
│  │  └─────────────────┘  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
         │                              │
         │  chrome.runtime messages     │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Service Worker                                       │
│   Routes messages between DevTools panel and content scripts                 │
│   Maintains connection state per tab                                         │
└─────────────────────────────────────────────────────────────────────────────┘
         │                              │
         │  chrome.tabs.sendMessage     │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Content Script                                       │
│   Injected into every page                                                   │
│   Detects SUI presence, injects bridge script                               │
│   Relays messages between bridge and service worker                          │
└─────────────────────────────────────────────────────────────────────────────┘
         │                              │
         │  window.postMessage          │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Injected Bridge Script (Page Context)                     │
│                                                                              │
│   window.__SUI_DEVTOOLS_BRIDGE__ = {                                        │
│     getComponentTree()          // Build semantic tree using $$             │
│     getComponentData(id)        // Full data for selected component         │
│     highlightElement(id)        // Show overlay on page                     │
│     startElementPicker()        // Click-to-select mode                     │
│     updateAttribute(id, ...)    // Live editing (Styles tab)               │
│     getSpecForComponent(id)     // Runtime spec access                      │
│   }                                                                          │
│                                                                              │
│   Uses: Query ($$), el.component, el.componentSpec, el.template             │
│   Observes: MutationObserver for tree updates                               │
│   Intercepts: Custom events for Events tab                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **Bridge in page context** - Required to access `el.component`, `el.template`, and Query's `$$`
2. **Content script as relay** - Can't postMessage directly from page to DevTools; content script bridges the gap
3. **Service worker for routing** - Manifest V3 requirement; handles tab-specific connections
4. **Panel as separate document** - Standard DevTools extension pattern; full control over UI

---

## Extension Structure

```
sui-devtools/
├── manifest.json              # Extension manifest (v3)
├── devtools.html              # DevTools page entry point
├── devtools.js                # Creates the panel
├── panel/
│   ├── panel.html             # Main panel UI
│   ├── panel.js               # Panel logic
│   ├── panel.css              # Panel styles (DevTools-like)
│   ├── components/
│   │   ├── tree-view.js       # Component tree
│   │   ├── tabs.js            # Tab switcher
│   │   ├── styles-tab.js      # Styles/Spec tab
│   │   ├── developer-tab.js   # Developer tab
│   │   └── events-tab.js      # Events tab
│   └── utils/
│       ├── messaging.js       # Panel ↔ background communication
│       └── formatting.js      # Data display helpers
├── background/
│   └── service-worker.js      # Message routing
├── content/
│   ├── content-script.js      # Page injection, message relay
│   └── bridge.js              # Injected into page context
├── shared/
│   ├── constants.js           # Message types, etc.
│   └── specs/                 # Bundled JSON specs (optional)
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "Semantic UI DevTools",
  "version": "1.0.0",
  "description": "Developer tools for Semantic UI web components",
  "devtools_page": "devtools.html",
  "permissions": [
    "scripting",
    "activeTab"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content-script.js"],
      "run_at": "document_start",
      "all_frames": true
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["content/bridge.js"],
      "matches": ["<all_urls>"]
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## Component Detection & Tree Building

### Detection Strategy

**Key Insight**: SUI components are identified by `el.component !== undefined`, not by tag name prefix.

```javascript
// bridge.js - Component detection
function isSUIComponent(el) {
  return el.nodeType === Node.ELEMENT_NODE &&
         el.component !== undefined;
}
```

### Tree Traversal

We leverage Query's `$$` for shadow-piercing traversal, but build our own semantic tree that filters out:
- Lit comment nodes
- Internal shadow DOM implementation details
- Non-component elements

```javascript
// bridge.js - Tree building
const componentRegistry = new WeakMap();
let nextId = 1;

function getComponentId(el) {
  if (!componentRegistry.has(el)) {
    componentRegistry.set(el, {
      id: `sui-${nextId++}`,
      element: el
    });
  }
  return componentRegistry.get(el).id;
}

function findElementById(id) {
  // Reverse lookup - iterate registry
  // In practice, maintain a Map<id, WeakRef<Element>> for this
  for (const [el, data] of componentRegistry) {
    if (data.id === id) return el;
  }
  return null;
}

function buildComponentTree(root = document.body) {
  const tree = [];

  const traverse = (node, parentId = null) => {
    // Skip non-elements and comment nodes (Lit markers)
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const isComponent = isSUIComponent(node);

    if (isComponent) {
      const id = getComponentId(node);
      const children = [];

      // Traverse light DOM children
      for (const child of node.children) {
        traverse(child, id);
      }

      // Traverse shadow DOM (SUI components have shadowRoot)
      if (node.shadowRoot) {
        for (const child of node.shadowRoot.children) {
          traverseShadow(child, id, children);
        }
      }

      tree.push({
        id,
        parentId,
        tagName: node.tagName.toLowerCase(),
        label: buildComponentLabel(node),
        hasChildren: children.length > 0,
        children,
        depth: getDepth(node),
      });
    } else {
      // Not a component, but may contain components
      for (const child of node.children) {
        traverse(child, parentId);
      }
    }
  };

  const traverseShadow = (node, parentId, siblingList) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    if (isSUIComponent(node)) {
      // Found a nested component - add to parent's children
      const id = getComponentId(node);
      siblingList.push(serializeForTree(node));
      // Don't recurse into this component's shadow - it's its own subtree
    } else {
      // Implementation detail element - look inside for components
      for (const child of node.children) {
        traverseShadow(child, parentId, siblingList);
      }
      if (node.shadowRoot) {
        for (const child of node.shadowRoot.children) {
          traverseShadow(child, parentId, siblingList);
        }
      }
    }
  };

  traverse(root);
  return buildHierarchy(tree);
}

function buildComponentLabel(el) {
  const tag = el.tagName.toLowerCase();
  const parts = [tag];

  // Add key identifying attributes
  if (el.id) parts.push(`#${el.id}`);

  // Pull variations/states from attributes
  const highlights = [];
  const componentSpec = el.componentSpec;

  if (componentSpec) {
    // Check for active types
    for (const type of componentSpec.types || []) {
      if (el.hasAttribute(type)) {
        highlights.push(el.getAttribute(type) || type);
      }
    }
    // Check for key states
    for (const state of ['disabled', 'loading', 'active']) {
      if (el.hasAttribute(state)) highlights.push(state);
    }
    // Check for size
    const size = el.getAttribute('size');
    if (size) highlights.push(size);
  }

  // Add label setting if present
  // Check for label in settings
  const label = el.settings?.label;
  if (label) {
    parts.push(`"${label}"`);
  }

  if (highlights.length) {
    parts.push(`[${highlights.join(', ')}]`);
  }

  return parts.join(' ');
}

function serializeForTree(el) {
  return {
    id: getComponentId(el),
    tagName: el.tagName.toLowerCase(),
    label: buildComponentLabel(el),
    hasChildren: hasComponentChildren(el),
  };
}

function hasComponentChildren(el) {
  // Check light DOM
  for (const child of el.children) {
    if (isSUIComponent(child)) return true;
    if (hasComponentChildren(child)) return true;
  }
  // Check shadow DOM
  if (el.shadowRoot) {
    for (const child of el.shadowRoot.children) {
      if (isSUIComponent(child)) return true;
      if (hasComponentChildren(child)) return true;
    }
  }
  return false;
}
```

### Tree Updates via MutationObserver

```javascript
// bridge.js - Tree observation
let treeObserver = null;

function startTreeObservation(callback) {
  if (treeObserver) return;

  treeObserver = new MutationObserver((mutations) => {
    let needsUpdate = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Check if any added/removed nodes are or contain SUI components
        for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isSUIComponent(node) || containsSUIComponent(node)) {
              needsUpdate = true;
              break;
            }
          }
        }
      }
      if (needsUpdate) break;
    }

    if (needsUpdate) {
      // Debounce updates
      clearTimeout(treeObserver._updateTimeout);
      treeObserver._updateTimeout = setTimeout(() => {
        callback(buildComponentTree());
      }, 100);
    }
  });

  treeObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function containsSUIComponent(el) {
  if (isSUIComponent(el)) return true;
  if (el.children) {
    for (const child of el.children) {
      if (containsSUIComponent(child)) return true;
    }
  }
  if (el.shadowRoot) {
    for (const child of el.shadowRoot.children) {
      if (containsSUIComponent(child)) return true;
    }
  }
  return false;
}
```

---

## Panel UI Design

### Layout

The panel mirrors Chrome DevTools Elements panel layout:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [🔍] [⟳]                                              Semantic UI DevTools│
├────────────────────────┬─────────────────────────────────────────────────┤
│                        │  [Styles] [Developer] [Events]                  │
│   Component Tree       │─────────────────────────────────────────────────│
│                        │                                                 │
│   ▼ ui-panels          │   (Tab content area)                           │
│     ▼ ui-panel         │                                                 │
│       • ui-button      │                                                 │
│       • ui-icon        │                                                 │
│     ▶ ui-panel         │                                                 │
│   ▼ ui-modal           │                                                 │
│     • ui-header        │                                                 │
│     ...                │                                                 │
│                        │                                                 │
├────────────────────────┴─────────────────────────────────────────────────┤
│ <ui-button primary large>                                    Copy Path ▼ │
└──────────────────────────────────────────────────────────────────────────┘
```

### Visual Design Principles

1. **Match DevTools aesthetic** - Dark theme, monospace fonts for code, similar spacing
2. **Familiar interactions** - Click to select, arrow keys to navigate tree, hover to highlight
3. **Progressive disclosure** - Collapsed sections, expandable details
4. **Copy-friendly** - Easy to copy selectors, data, CSS

### Tree View Interactions

| Action | Behavior |
|--------|----------|
| Click node | Select component, update inspector tabs |
| Double-click node | Expand/collapse (if has children) |
| Arrow Up/Down | Navigate tree |
| Arrow Right | Expand node |
| Arrow Left | Collapse node / go to parent |
| Hover node | Highlight element on page |
| Right-click | Context menu (Copy selector, Log to console, Show in Elements) |

---

## Tab Specifications

### Tab 1: Styles

**Purpose**: Spec-aware styling panel showing variations, states, and CSS variables.

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Styles                                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ▼ Types                                                                  │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ emphasis: ( ) none (●) primary ( ) secondary                    │   │
│   │                                                                 │   │
│   │ Layer: button.definition.types.emphasis              [Toggle ▼] │   │
│   │ ┌─────────────────────────────────────────────────────────────┐ │   │
│   │ │ .primary.button {                                           │ │   │
│   │ │   --button-primary-color        #2185d0             ■      │ │   │
│   │ │   --button-primary-text-color   #ffffff             ■      │ │   │
│   │ │   --button-primary-box-shadow   0 0 0 0 rgba(...)          │ │   │
│   │ │ }                                                           │ │   │
│   │ └─────────────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Variations                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ size:  [mini][tiny][small][●medium][large][big][huge][massive]  │   │
│   │ color: [red][orange][yellow]...[●blue]...[slate]                │   │
│   │ styled: [subtle][flat][outline][ghost]                          │   │
│   │ [✓] fluid  [ ] circular  [ ] transparent                        │   │
│   │                                                                 │   │
│   │ Layer: button.definition.variations.size             [Toggle ▼] │   │
│   │ (click to expand size-specific CSS variables)                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ States                                                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ [ ] hover  [ ] focus  [ ] active  [✓] disabled  [ ] loading     │   │
│   │                                                                 │   │
│   │ Layer: button.definition.states.disabled             [Toggle ▼] │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Base Styles                                                            │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Layer: button.definition.content.button                         │   │
│   │ ┌─────────────────────────────────────────────────────────────┐ │   │
│   │ │ .button {                                                   │ │   │
│   │ │   --button-padding             0.75em 1.5em                │ │   │
│   │ │   --button-background          var(--standard-5)    → #f5f5│ │   │
│   │ │   --button-text-color          var(--text-color)    → #333 │ │   │
│   │ │   --button-border              1px solid var(--bor...      │ │   │
│   │ │   --button-font-family         var(--page-font)            │ │   │
│   │ │   --button-font-weight         var(--bold)                 │ │   │
│   │ │ }                                                           │ │   │
│   │ └─────────────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Available Parts (::part)                                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ icon • content • badge                                          │   │
│   │                                                                 │   │
│   │ ui-button::part(icon) { }                          [Copy]      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- CSS organized by spec category (types, variations, states, content)
- Layer names shown for direct CSS file navigation
- Variables show both declaration and computed value (→ resolved)
- Color swatches (■) for color values
- Clickable variation/state chips for live editing

#### Data Sources

**Key Insight**: SUI uses CSS `@layer` rules that map 1:1 to spec sections. The layer naming convention is:
```
{component}.definition.{category}.{specValue}
```

For example:
- `button.definition.types.emphasis` → Type styles for emphasis
- `button.definition.content.button` → Base content styles
- `button.definition.variations.size` → Size variation styles
- `button.definition.states.disabled` → Disabled state styles

This makes CSS discovery trivial—we parse layers from the shadow root's adopted stylesheets.

```javascript
function getStylesTabData(el) {
  const componentSpec = el.componentSpec;  // Runtime spec
  const fullSpec = getFullSpec(el.tagName.toLowerCase());  // JSON spec with descriptions

  return {
    // From componentSpec - for UI controls
    variations: buildVariationsUI(componentSpec, el, fullSpec),
    states: buildStatesUI(componentSpec, el),
    types: buildTypesUI(componentSpec, el),

    // CSS from shadow root layers - organized by spec category
    cssLayers: getComponentCSSByLayer(el),

    // Computed values for currently active variables
    computedVars: getComputedVariables(el),

    // Parts exported by component
    parts: getExportedParts(el),
  };
}

/*******************************
     CSS Layer Extraction
*******************************/

function getComponentCSSByLayer(el) {
  // Styles are on the SHADOW ROOT, not the element
  const shadowRoot = el.shadowRoot;
  if (!shadowRoot) return {};

  const styleSheets = shadowRoot.adoptedStyleSheets || [];
  const layeredCSS = {
    types: {},
    variations: {},
    states: {},
    content: {},
  };

  for (const sheet of styleSheets) {
    traverseCSSRules(sheet.cssRules, layeredCSS);
  }

  return layeredCSS;
}

function traverseCSSRules(cssRules, layeredCSS) {
  for (const rule of cssRules) {
    if (rule instanceof CSSLayerBlockRule) {
      const parsed = parseLayerName(rule.name);

      if (parsed && layeredCSS[parsed.category]) {
        const key = parsed.specValue || 'base';

        if (!layeredCSS[parsed.category][key]) {
          layeredCSS[parsed.category][key] = {
            layerName: rule.name,
            rules: [],
          };
        }

        // Extract rules with their CSS variables
        layeredCSS[parsed.category][key].rules.push(
          ...extractRulesWithVariables(rule.cssRules)
        );
      }

      // Layers can be nested
      if (rule.cssRules.length) {
        traverseCSSRules(rule.cssRules, layeredCSS);
      }
    }
  }
}

function parseLayerName(layerName) {
  // Pattern: {component}.definition.{category}.{value}
  // Example: "button.definition.types.emphasis"
  const parts = layerName.split('.');

  if (parts.length < 3 || parts[1] !== 'definition') {
    return null;
  }

  return {
    component: parts[0],           // 'button'
    category: parts[2],            // 'types', 'content', 'variations', 'states'
    specValue: parts[3] || null,   // 'emphasis', 'size', etc.
  };
}

function extractRulesWithVariables(cssRules) {
  const rules = [];

  for (const rule of cssRules) {
    if (rule instanceof CSSStyleRule) {
      const variables = [];

      for (const prop of rule.style) {
        const value = rule.style.getPropertyValue(prop);

        // Extract CSS variable references
        if (value.includes('var(--')) {
          const varMatches = [...value.matchAll(/var\(--([^,)]+)/g)];
          for (const match of varMatches) {
            variables.push({
              property: prop,
              variable: `--${match[1]}`,
              rawValue: value,
            });
          }
        }

        // Also capture direct variable declarations
        if (prop.startsWith('--')) {
          variables.push({
            property: prop,
            variable: prop,
            rawValue: value,
            isDeclared: true,
          });
        }
      }

      if (variables.length > 0) {
        rules.push({
          selector: rule.selectorText,
          variables,
        });
      }
    }
  }

  return rules;
}

/*******************************
     Computed Values
*******************************/

function getComputedVariables(el) {
  // Get computed styles to resolve actual values
  const computed = getComputedStyle(el);
  const shadowRoot = el.shadowRoot;

  // Collect all variable names from the layers
  const allVarNames = new Set();
  const styleSheets = shadowRoot?.adoptedStyleSheets || [];

  for (const sheet of styleSheets) {
    collectVariableNames(sheet.cssRules, allVarNames);
  }

  // Resolve computed values
  const computedVars = {};
  for (const varName of allVarNames) {
    const value = computed.getPropertyValue(varName).trim();
    if (value) {
      computedVars[varName] = {
        value,
        isColor: isColorValue(value),
      };
    }
  }

  return computedVars;
}

function collectVariableNames(cssRules, varNames) {
  for (const rule of cssRules) {
    if (rule instanceof CSSStyleRule) {
      for (const prop of rule.style) {
        if (prop.startsWith('--')) {
          varNames.add(prop);
        }
        const value = rule.style.getPropertyValue(prop);
        const matches = [...value.matchAll(/var\(--([^,)]+)/g)];
        for (const match of matches) {
          varNames.add(`--${match[1]}`);
        }
      }
    } else if (rule.cssRules) {
      collectVariableNames(rule.cssRules, varNames);
    }
  }
}

function isColorValue(value) {
  // Check if value looks like a color
  return /^(#|rgb|hsl|oklch|color\(|transparent|currentcolor)/i.test(value.trim());
}

/*******************************
     Spec-Driven UI Builders
*******************************/

function buildVariationsUI(spec, el, fullSpec) {
  const result = [];

  for (const variation of spec.variations || []) {
    const currentValue = el.getAttribute(variation);
    const allowedValues = spec.allowedValues?.[variation];
    const propertyType = spec.propertyTypes?.[variation];

    // Find description from full spec
    const fullVariation = fullSpec?.variations?.find(v =>
      v.attribute === variation || v.name?.toLowerCase() === variation
    );

    if (allowedValues) {
      // Enumerated variation (size, color, etc.)
      result.push({
        name: variation,
        type: 'enum',
        options: allowedValues,
        current: currentValue,
        description: fullVariation?.description,
        layerName: `${spec.tagName?.replace('ui-', '')}.definition.variations.${variation}`,
      });
    } else if (propertyType === 'boolean') {
      // Boolean variation (fluid, circular)
      result.push({
        name: variation,
        type: 'boolean',
        current: el.hasAttribute(variation),
        description: fullVariation?.description,
      });
    }
  }

  return result;
}

function buildTypesUI(spec, el) {
  const result = [];

  for (const type of spec.types || []) {
    const currentValue = el.getAttribute(type);
    const allowedValues = spec.allowedValues?.[type];

    result.push({
      name: type,
      options: allowedValues || [],
      current: currentValue,
      hasValue: el.hasAttribute(type),
      layerName: `${spec.tagName?.replace('ui-', '')}.definition.types.${type}`,
    });
  }

  return result;
}

function buildStatesUI(spec, el) {
  const result = [];

  for (const state of spec.states || []) {
    result.push({
      name: state,
      current: el.hasAttribute(state),
      layerName: `${spec.tagName?.replace('ui-', '')}.definition.states.${state}`,
    });
  }

  return result;
}
```

#### Live Editing

Clicking a variation/state chip should update the element in real-time:

```javascript
function updateAttribute(elementId, attribute, value) {
  const el = findElementById(elementId);
  if (!el) return;

  if (value === null || value === false) {
    el.removeAttribute(attribute);
  } else if (value === true) {
    el.setAttribute(attribute, '');
  } else {
    el.setAttribute(attribute, value);
  }
}
```

---

### Tab 2: Developer

**Purpose**: Runtime introspection of component instance, settings, state, and data context.

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Developer                                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ▼ Settings                                                               │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Property          Default         Current                       │   │
│   │ ─────────────────────────────────────────────────────────────── │   │
│   │ direction         "vertical"      "vertical"                    │   │
│   │ resizable         true            true                          │   │
│   │ minSize           "0px"           "200px"          ← modified   │   │
│   │ maxSize           "0px"           "0px"                         │   │
│   │ size              "grow"          "natural"        ← modified   │   │
│   │ label             ""              "Editor"         ← modified   │   │
│   │ canMinimize       true            false            ← modified   │   │
│   │ minimized         false           false                         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ State (signals)                                                        │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ resizing          false                                         │   │
│   │ initialized       true                                          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Component Instance (el.component)                                      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Methods                                                         │   │
│   │   getClassMap()                                                 │   │
│   │   getNaturalSize(panel, options)                                │   │
│   │   getIndex()                                                    │   │
│   │   startResize(event)                                            │   │
│   │   toggleMinimize()                                              │   │
│   │   minimize()                                                    │   │
│   │   maximize()                                                    │   │
│   │                                                                 │   │
│   │ Properties                                                      │   │
│   │   lastPanelSize: 45.2                                          │   │
│   │   initialSize: undefined                                        │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Element Info                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Tag: ui-panel                                                   │   │
│   │ ID: editor-panel                                                │   │
│   │ Classes: resizable, vertical                                    │   │
│   │                                                                 │   │
│   │ Attributes                                                      │   │
│   │   direction="vertical"                                          │   │
│   │   label="Editor"                                                │   │
│   │   min-size="200px"                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│                                                         [Log to Console] │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Data Extraction

```javascript
function getDeveloperTabData(el) {
  const component = el.component;
  const componentSpec = el.componentSpec;
  const template = el.template;

  // Default settings stored directly on element (set in web-component.js)
  const defaultSettings = el.defaultSettings || {};

  // Current settings via the reactive proxy
  const currentSettings = {};
  if (el.settingsVars) {
    // settingsVars is a Map<propertyName, Signal>
    for (const [key, signal] of el.settingsVars) {
      currentSettings[key] = signal.get();
    }
  }

  // Default state from template
  const defaultState = template?.defaultState || {};

  return {
    settings: buildSettingsComparison(defaultSettings, currentSettings),
    // Use template.state for live Signal objects
    state: extractStateSignals(template?.state, defaultState),
    component: {
      methods: getComponentMethods(component),
      properties: getComponentProperties(component),
    },
    // Template internals (for advanced debugging)
    template: {
      events: template?.events ? Object.keys(template.events) : [],
      keys: template?.keys ? Object.keys(template.keys) : [],
      hasCSS: !!template?.css,
      subTemplates: template?.subTemplates ? Object.keys(template.subTemplates) : [],
    },
    element: {
      tagName: el.tagName.toLowerCase(),
      id: el.id,
      classList: [...el.classList],
      attributes: getAttributesMap(el),
    },
  };
}

function buildSettingsComparison(defaults, current) {
  const allKeys = new Set([...Object.keys(defaults), ...Object.keys(current)]);
  const result = [];

  for (const key of allKeys) {
    const defaultVal = defaults[key];
    const currentVal = current[key];
    const isModified = !deepEqual(defaultVal, currentVal);

    result.push({
      property: key,
      default: formatValue(defaultVal),
      current: formatValue(currentVal),
      isModified,
      type: typeof currentVal,
    });
  }

  return result;
}

function extractStateSignals(state) {
  if (!state) return [];

  const result = [];
  for (const [key, signal] of Object.entries(state)) {
    // Signals have a .get() method
    if (signal && typeof signal.get === 'function') {
      result.push({
        name: key,
        value: formatValue(signal.get()),
        isSignal: true,
      });
    }
  }
  return result;
}

function getComponentMethods(component) {
  if (!component) return [];

  const methods = [];
  const proto = Object.getPrototypeOf(component);
  const ownKeys = Object.keys(component);
  const protoKeys = proto ? Object.getOwnPropertyNames(proto) : [];

  for (const key of [...ownKeys, ...protoKeys]) {
    if (typeof component[key] === 'function' && !key.startsWith('_')) {
      methods.push({
        name: key,
        // Try to extract parameter names from function signature
        params: extractParams(component[key]),
      });
    }
  }

  return methods;
}

function getComponentProperties(component) {
  if (!component) return [];

  const props = [];
  for (const key of Object.keys(component)) {
    const value = component[key];
    if (typeof value !== 'function') {
      props.push({
        name: key,
        value: formatValue(value),
        type: typeof value,
      });
    }
  }
  return props;
}
```

#### Console Integration

```javascript
// "Log to Console" button
function logToConsole(elementId) {
  const el = findElementById(elementId);
  if (!el) return;

  console.group(`%c${el.tagName.toLowerCase()}`, 'color: #2185d0; font-weight: bold');
  console.log('Element:', el);
  console.log('Component (el.component):', el.component);
  console.log('State (el.template.state):', el.template?.state);
  console.log('Settings (el.settings):', el.settings);
  console.log('Spec (el.componentSpec):', el.componentSpec);
  console.groupEnd();

  // Also store as $sui.selected for easy access
  window.$sui = window.$sui || {};
  window.$sui.selected = el;
  console.log('%c→ Also available as $sui.selected', 'color: #888');
}
```

---

### Tab 3: Events

**Purpose**: Show event handlers defined in spec, attached handlers, and live event stream.

#### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Events                                                         [▶ Record]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ▼ Spec Events (from component definition)                                │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Event Name        Description                                   │   │
│   │ ─────────────────────────────────────────────────────────────── │   │
│   │ resizeStart       Fired when panel resize begins                │   │
│   │ resizeDrag        Fired during panel resize                     │   │
│   │ resizeEnd         Fired when panel resize completes             │   │
│   │ initialized       Fired when panel is fully initialized         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Registered Handlers (from el.template.events)                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Event String                          Handler                   │   │
│   │ ─────────────────────────────────────────────────────────────── │   │
│   │ click .toggle-size                    → toggleMinimize()        │   │
│   │ dblclick .self.label                  → toggleMinimize()        │   │
│   │ dblclick .handle                      → setPreviousNaturalSize()│   │
│   │ mousedown, touchstart .handle         → startResize(event)      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Key Bindings (from el.template.keys)                                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Key Combo         Handler                                       │   │
│   │ ─────────────────────────────────────────────────────────────── │   │
│   │ Escape            → closeModal()                                │   │
│   │ Cmd+K             → openSearch()                                │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ▼ Live Event Stream                                         [Clear] [⏸] │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ 12:34:56.123  resizeStart   { initialSize: 45.2, direction... } │   │
│   │ 12:34:56.156  resizeDrag    { initialSize: 45.2, endPositio... } │   │
│   │ 12:34:56.189  resizeDrag    { initialSize: 45.2, endPositio... } │   │
│   │ 12:34:56.234  resizeEnd     { initialSize: 45.2, finalSize:... } │   │
│   │ 12:34:58.001  click         { target: ui-icon.toggle-size }     │   │
│   │                                                                 │   │
│   │ [Click event to expand details]                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Event Handler Access

**Key Discovery**: The `events` object from `defineComponent` is stored on `el.template.events`.

```javascript
function getRegisteredHandlers(el) {
  const template = el.template;
  const events = template?.events;

  if (!events || typeof events !== 'object') {
    return [];
  }

  // events object format: { 'click .button': handlerFn, 'deep change ui-dropdown': handlerFn }
  return Object.entries(events).map(([eventString, handler]) => {
    // Parse event string: "modifier event selector"
    // Examples: "click .button", "deep change ui-dropdown", "global scroll window"
    const parts = eventString.split(' ');

    let modifier = null;
    let eventName = parts[0];
    let selector = parts.slice(1).join(' ');

    // Check for modifiers (deep, global)
    if (['deep', 'global'].includes(parts[0])) {
      modifier = parts[0];
      eventName = parts[1];
      selector = parts.slice(2).join(' ');
    }

    // Handle multiple events: "mouseenter, mouseleave .item"
    const eventNames = eventName.split(',').map(e => e.trim());

    return {
      eventString,
      events: eventNames,
      selector: selector || '(element)',
      modifier,
      handlerName: handler.name || 'anonymous',
      // Can't serialize the actual function, but we can show its signature
      handlerPreview: getFunctionPreview(handler),
    };
  });
}

function getFunctionPreview(fn) {
  if (!fn) return '';
  const str = fn.toString();
  // Extract first line or parameter list
  const match = str.match(/^[^{]+/);
  return match ? match[0].trim().slice(0, 80) : 'ƒ()';
}

function getKeyBindings(el) {
  const template = el.template;
  const keys = template?.keys;

  if (!keys || typeof keys !== 'object') {
    return [];
  }

  return Object.entries(keys).map(([keyCombo, handler]) => ({
    keyCombo,
    handlerName: handler.name || 'anonymous',
  }));
}
```

#### Event Interception

**Approach**: Wrap `dispatchEvent` on watched elements to capture custom events.

```javascript
// bridge.js - Event monitoring
const eventListeners = new Map();  // elementId -> Set<listener>
const eventLog = [];
const MAX_LOG_SIZE = 1000;

function startEventMonitoring(elementId) {
  const el = findElementById(elementId);
  if (!el) return;

  // Get spec events to know what to listen for
  const specEvents = el.componentSpec?.events || [];
  const eventNames = specEvents.map(e => typeof e === 'string' ? e : e.name);

  // Also listen for common component events
  const commonEvents = ['click', 'change', 'input', 'focus', 'blur'];
  const allEvents = [...new Set([...eventNames, ...commonEvents])];

  const listeners = new Set();

  for (const eventName of allEvents) {
    const listener = (event) => {
      logEvent(elementId, eventName, event);
    };
    el.addEventListener(eventName, listener);
    listeners.add({ eventName, listener });
  }

  eventListeners.set(elementId, { el, listeners });
}

function stopEventMonitoring(elementId) {
  const data = eventListeners.get(elementId);
  if (!data) return;

  for (const { eventName, listener } of data.listeners) {
    data.el.removeEventListener(eventName, listener);
  }
  eventListeners.delete(elementId);
}

function logEvent(elementId, eventName, event) {
  const entry = {
    timestamp: Date.now(),
    elementId,
    eventName,
    detail: event.detail ? sanitizeForTransport(event.detail) : null,
    target: event.target?.tagName?.toLowerCase(),
    bubbles: event.bubbles,
    composed: event.composed,
  };

  eventLog.push(entry);
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog.shift();
  }

  // Notify panel
  postToContentScript({
    type: 'EVENT_LOGGED',
    payload: entry,
  });
}

function getRegisteredHandlers(el) {
  // This requires access to the component's internal event registry
  // The events object from defineComponent is stored somewhere accessible

  // Option 1: If events are exposed on the element/component
  const events = el.component?._events || el._events;

  // Option 2: Parse from component definition (if accessible)
  // This may not be possible at runtime without source access

  // Return what we can find
  if (events && typeof events === 'object') {
    return Object.entries(events).map(([selector, handler]) => ({
      selector: selector.split(' ').slice(1).join(' ') || '(element)',
      event: selector.split(' ')[0],
      handler: handler.name || 'anonymous',
    }));
  }

  return [];
}
```

---

## Element Inspection Integration

### Element Picker (Click-to-Select)

Mirror Chrome's element picker behavior: click the 🔍 icon, hover elements on page with overlay, click to select.

```javascript
// bridge.js - Element picker
let pickerActive = false;
let pickerOverlay = null;

function startElementPicker() {
  if (pickerActive) return;
  pickerActive = true;

  // Create overlay element
  pickerOverlay = document.createElement('div');
  pickerOverlay.id = 'sui-devtools-picker-overlay';
  pickerOverlay.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 2147483647;
    background: rgba(33, 133, 208, 0.1);
    border: 2px solid rgba(33, 133, 208, 0.8);
    border-radius: 2px;
    transition: all 0.05s ease-out;
  `;
  document.body.appendChild(pickerOverlay);

  document.addEventListener('mousemove', pickerMouseMove, true);
  document.addEventListener('click', pickerClick, true);
  document.addEventListener('keydown', pickerKeyDown, true);
}

function stopElementPicker() {
  if (!pickerActive) return;
  pickerActive = false;

  document.removeEventListener('mousemove', pickerMouseMove, true);
  document.removeEventListener('click', pickerClick, true);
  document.removeEventListener('keydown', pickerKeyDown, true);

  if (pickerOverlay) {
    pickerOverlay.remove();
    pickerOverlay = null;
  }
}

function pickerMouseMove(event) {
  // Find the nearest SUI component
  let target = event.target;
  let suiComponent = null;

  while (target && target !== document.body) {
    if (isSUIComponent(target)) {
      suiComponent = target;
      break;
    }
    // Check if inside shadow root
    const host = target.getRootNode()?.host;
    if (host && isSUIComponent(host)) {
      suiComponent = host;
      break;
    }
    target = target.parentElement;
  }

  if (suiComponent) {
    const rect = suiComponent.getBoundingClientRect();
    pickerOverlay.style.display = 'block';
    pickerOverlay.style.top = `${rect.top}px`;
    pickerOverlay.style.left = `${rect.left}px`;
    pickerOverlay.style.width = `${rect.width}px`;
    pickerOverlay.style.height = `${rect.height}px`;

    // Store for click
    pickerOverlay._currentTarget = suiComponent;
  } else {
    pickerOverlay.style.display = 'none';
    pickerOverlay._currentTarget = null;
  }
}

function pickerClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const target = pickerOverlay._currentTarget;
  if (target) {
    const id = getComponentId(target);
    postToContentScript({
      type: 'ELEMENT_PICKED',
      payload: { id },
    });
  }

  stopElementPicker();
}

function pickerKeyDown(event) {
  if (event.key === 'Escape') {
    stopElementPicker();
    postToContentScript({
      type: 'PICKER_CANCELLED',
    });
  }
}
```

### Highlight on Hover (Tree → Page)

```javascript
// bridge.js - Highlight element
let highlightOverlay = null;

function highlightElement(elementId) {
  const el = findElementById(elementId);

  if (!highlightOverlay) {
    highlightOverlay = document.createElement('div');
    highlightOverlay.id = 'sui-devtools-highlight';
    highlightOverlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 2147483646;
      background: rgba(33, 133, 208, 0.1);
      border: 1px dashed rgba(33, 133, 208, 0.5);
      transition: all 0.1s ease-out;
    `;
    document.body.appendChild(highlightOverlay);
  }

  if (el) {
    const rect = el.getBoundingClientRect();
    highlightOverlay.style.display = 'block';
    highlightOverlay.style.top = `${rect.top}px`;
    highlightOverlay.style.left = `${rect.left}px`;
    highlightOverlay.style.width = `${rect.width}px`;
    highlightOverlay.style.height = `${rect.height}px`;
  } else {
    highlightOverlay.style.display = 'none';
  }
}

function clearHighlight() {
  if (highlightOverlay) {
    highlightOverlay.style.display = 'none';
  }
}
```

---

## Console Integration

### Automatic Query Injection

When DevTools opens, inject `$` and `$$` helpers if not already present.

```javascript
// bridge.js - Console helpers
function injectConsoleHelpers() {
  // Only inject if not already defined by the page
  if (typeof window.$ === 'undefined') {
    // Assuming Query is available via SUI
    if (window.SUI?.Query) {
      window.$ = (selector, options) => new window.SUI.Query(selector, options);
    }
  }

  if (typeof window.$$ === 'undefined') {
    if (window.SUI?.Query) {
      window.$$ = (selector, options) => new window.SUI.Query(selector, { ...options, pierceShadow: true });
    }
  }

  // SUI DevTools namespace
  window.$sui = {
    selected: null,  // Currently selected component element

    // Quick access helpers
    tree: () => buildComponentTree(),
    find: (selector) => $$(`[data-sui-id="${selector}"], ${selector}`).filter(el => isSUIComponent(el)),

    // Inspect any element
    inspect: (el) => {
      if (isSUIComponent(el)) {
        const id = getComponentId(el);
        postToContentScript({
          type: 'INSPECT_REQUEST',
          payload: { id },
        });
      }
    },

    // Log component details
    log: (el) => {
      el = el || window.$sui.selected;
      if (!el) {
        console.log('No component selected. Use $sui.inspect(element) first.');
        return;
      }
      console.group(`%c${el.tagName.toLowerCase()}`, 'color: #2185d0; font-weight: bold');
      console.log('Element:', el);
      console.log('Component:', el.component);
      console.log('State:', el.template?.state);
      console.log('Settings:', el.settings);
      console.log('Spec:', el.componentSpec);
      console.groupEnd();
    },
  };

  console.log(
    '%cSUI DevTools%c Ready. Helpers: $sui.selected, $sui.tree(), $sui.find(selector), $sui.log()',
    'color: #2185d0; font-weight: bold',
    'color: inherit'
  );
}
```

---

## Messaging Architecture

### Message Types

```javascript
// shared/constants.js
export const MessageTypes = {
  // Panel → Bridge (via content script + service worker)
  GET_TREE: 'GET_TREE',
  GET_COMPONENT_DATA: 'GET_COMPONENT_DATA',
  HIGHLIGHT_ELEMENT: 'HIGHLIGHT_ELEMENT',
  CLEAR_HIGHLIGHT: 'CLEAR_HIGHLIGHT',
  START_PICKER: 'START_PICKER',
  STOP_PICKER: 'STOP_PICKER',
  UPDATE_ATTRIBUTE: 'UPDATE_ATTRIBUTE',
  START_EVENT_MONITOR: 'START_EVENT_MONITOR',
  STOP_EVENT_MONITOR: 'STOP_EVENT_MONITOR',
  LOG_TO_CONSOLE: 'LOG_TO_CONSOLE',

  // Bridge → Panel (via content script + service worker)
  TREE_UPDATED: 'TREE_UPDATED',
  COMPONENT_DATA: 'COMPONENT_DATA',
  ELEMENT_PICKED: 'ELEMENT_PICKED',
  PICKER_CANCELLED: 'PICKER_CANCELLED',
  EVENT_LOGGED: 'EVENT_LOGGED',
  SUI_DETECTED: 'SUI_DETECTED',
  SUI_NOT_FOUND: 'SUI_NOT_FOUND',
};
```

### Service Worker (Message Router)

```javascript
// background/service-worker.js
const connections = new Map();  // tabId -> { panel, contentScript }

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sui-devtools-panel') {
    // Panel connecting
    const tabId = port.sender?.tab?.id || extractTabId(port);

    if (!connections.has(tabId)) {
      connections.set(tabId, {});
    }
    connections.get(tabId).panel = port;

    port.onMessage.addListener((message) => {
      // Forward to content script
      chrome.tabs.sendMessage(tabId, message);
    });

    port.onDisconnect.addListener(() => {
      const conn = connections.get(tabId);
      if (conn) {
        conn.panel = null;
        if (!conn.contentScript) {
          connections.delete(tabId);
        }
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Message from content script
  const tabId = sender.tab?.id;
  if (!tabId) return;

  const conn = connections.get(tabId);
  if (conn?.panel) {
    conn.panel.postMessage(message);
  }
});
```

### Content Script (Relay)

```javascript
// content/content-script.js

// Inject bridge script into page context
function injectBridge() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content/bridge.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

// Listen for messages from bridge (page context)
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== 'sui-devtools-bridge') return;

  // Forward to service worker
  chrome.runtime.sendMessage(event.data);
});

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward to bridge
  window.postMessage({
    source: 'sui-devtools-content',
    ...message,
  }, '*');
});

// Detect SUI on page load
function detectSUI() {
  // Check for SUI presence
  const hasSUI = document.querySelector('[class*="ui-"]')?.component !== undefined ||
                 typeof window.SUI !== 'undefined';

  window.postMessage({
    source: 'sui-devtools-content',
    type: hasSUI ? 'SUI_DETECTED' : 'SUI_NOT_FOUND',
  }, '*');
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectBridge();
    setTimeout(detectSUI, 100);  // Give SUI time to initialize
  });
} else {
  injectBridge();
  setTimeout(detectSUI, 100);
}
```

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goal**: Working panel with tree view and basic selection.

1. **Extension scaffold**
   - manifest.json, devtools.html, panel structure
   - Service worker message routing
   - Content script + bridge injection

2. **Component detection**
   - `isSUIComponent()` detection
   - `buildComponentTree()` traversal
   - WeakMap-based ID registry

3. **Tree view UI**
   - Hierarchical component display
   - Expand/collapse
   - Click to select

4. **Basic highlight**
   - Hover tree node → highlight on page
   - Element overlay positioning

### Phase 2: Inspection (Week 3-4)

**Goal**: Full inspector tabs with real data.

1. **Developer tab**
   - Settings comparison (default vs current)
   - State signal extraction
   - Component methods/properties listing
   - "Log to Console" functionality

2. **Element picker**
   - Click-to-select mode
   - Picker overlay
   - Keyboard cancel (Escape)

3. **Bidirectional sync**
   - Click in tree → select in panel + highlight on page
   - Pick on page → select in tree + show in panel

### Phase 3: Styles Tab (Week 5-6)

**Goal**: Spec-aware styling panel.

1. **Spec integration**
   - Load runtime spec from `el.componentSpec`
   - Load full JSON spec from bundled files (for descriptions, examples)

2. **Variations/States UI**
   - Render clickable chips for enumerated variations
   - Checkboxes for boolean variations/states
   - Radio buttons for types

3. **Live editing**
   - Click chip → update attribute on element
   - Immediate visual feedback

4. **CSS Variables**
   - Extract component-specific variables
   - Show computed values
   - Identify inherited tokens

### Phase 4: Events & Polish (Week 7-8)

**Goal**: Events tab and production-ready UX.

1. **Events tab**
   - Spec events listing
   - Live event stream with recording
   - Event detail expansion

2. **Console integration**
   - `$sui` namespace
   - Auto-inject `$` and `$$` if not present

3. **Polish**
   - Keyboard navigation in tree
   - Context menus
   - Copy functionality
   - Error handling
   - Performance optimization

4. **Testing**
   - Test with real SUI applications
   - Edge cases (deeply nested, dynamic components)

---

## Open Questions & Alternatives

### 1. Full Spec Access ✅ RESOLVED

**Question**: How do we get full spec data (descriptions, example code) at runtime?

**Answer**: Specs are exported via `/specs` export condition from `@semantic-ui/core`:

```javascript
import { ButtonSpec, CardSpec, ... } from '@semantic-ui/core/specs';
```

**Implementation**:
- Bundle all specs into the extension (they're JSON-serializable)
- At runtime, match `el.tagName.toLowerCase()` to find the corresponding spec
- Use `el.componentSpec` for runtime data, bundled spec for descriptions/examples

```javascript
// In extension
import * as Specs from '@semantic-ui/core/specs';

// Duck type: full specs have exportName, component specs don't
const fullSpecsByTag = {};
for (const spec of Object.values(Specs)) {
  if (spec?.exportName) {
    fullSpecsByTag[spec.tagName] = spec;
  }
}

function getFullSpec(tagName) {
  return fullSpecsByTag[tagName];
}
```

### 2. Event Handler Registry ✅ RESOLVED

**Question**: How do we show which event handlers are registered by the component?

**Answer**: Event handlers are stored on `el.template.events`:

```javascript
// Access registered event handlers
const handlers = el.template.events;
// Returns: { 'click .toggle-size': fn, 'dblclick .handle': fn, ... }

// Key bindings also available
const keys = el.template.keys;
// Returns: { 'Escape': fn, 'Cmd+K': fn, ... }
```

### 3. Default Settings Access ✅ RESOLVED

**Question**: How do we get default settings for comparison?

**Answer**: Defaults are stored on `el.defaultSettings`:

```javascript
// Set in web-component.js constructor
const defaults = el.defaultSettings;

// Current settings via proxy
const current = el.settings.propertyName;

// Or via settingsVars Map
const signal = el.settingsVars.get('propertyName');
const currentValue = signal?.get();
```

### 4. CSS Variable Discovery ✅ RESOLVED

**Question**: How do we enumerate all CSS custom properties a component uses?

**Answer**: SUI uses CSS `@layer` rules with a naming convention that maps 1:1 to spec sections:

```
{component}.definition.{category}.{specValue}
```

The styles are on the **shadow root's adopted stylesheets** (`el.shadowRoot.adoptedStyleSheets`), and we can traverse them via CSSOM:

```javascript
function getComponentCSSByLayer(el) {
  // IMPORTANT: Styles are on the shadow root, not the element
  const shadowRoot = el.shadowRoot;
  if (!shadowRoot) return {};

  const styleSheets = shadowRoot.adoptedStyleSheets || [];
  const layeredCSS = {};

  for (const sheet of styleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule instanceof CSSLayerBlockRule) {
        const parsed = parseLayerName(rule.name);
        // Organize by category: types, variations, states, content
        // ...
      }
    }
  }

  return layeredCSS;
}
```

This gives us:
- **Complete variable coverage** - every CSS variable the component uses
- **Organized by spec category** - types, variations, states, content
- **Direct spec→CSS mapping** - layer name tells us which spec feature it's for
- **Computed value resolution** - use `getComputedStyle(el).getPropertyValue(varName)`

### 5. Parts Discovery

**Question**: How do we know which `::part()` names a component exports?

**Options**:

| Option | Pros | Cons |
|--------|------|------|
| **A: Parse template for `part=` attributes** | Accurate | Need template access |
| **B: Add to spec system** | Authoritative | Framework change |
| **C: Query shadow DOM** | Works at runtime | Only finds rendered parts |

**Recommendation**: Use (C) for v1 - query shadow DOM for elements with `part` attribute:

```javascript
function getExportedParts(el) {
  if (!el.shadowRoot) return [];

  const partsElements = el.shadowRoot.querySelectorAll('[part]');
  const parts = new Set();

  for (const partEl of partsElements) {
    const partAttr = partEl.getAttribute('part');
    // part attribute can have multiple space-separated values
    partAttr.split(/\s+/).forEach(p => parts.add(p));
  }

  return [...parts];
}
```

### 6. Performance with Large Trees

**Question**: How do we handle pages with hundreds of components?

**Approach**:

| Technique | Implementation |
|-----------|----------------|
| **Virtual scrolling** | Only render visible tree nodes using fixed-height items |
| **Lazy child loading** | Don't traverse children until node is expanded |
| **Debounced updates** | Batch MutationObserver callbacks (100ms debounce) |
| **Incremental tree building** | Build tree in chunks using requestIdleCallback |

```javascript
// Lazy children - only compute when expanded
function getTreeNode(el, expanded = false) {
  return {
    id: getComponentId(el),
    tagName: el.tagName.toLowerCase(),
    label: buildComponentLabel(el),
    hasChildren: hasComponentChildren(el), // Quick check
    children: expanded ? getChildNodes(el) : null, // Lazy
  };
}
```

### 7. State Signal Observation

**Question**: Should we show live state updates in the Developer tab?

**Option**: Use `Reaction` to observe state changes and push updates to panel.

```javascript
// bridge.js - bundled with @semantic-ui/reactivity
import { Reaction } from '@semantic-ui/reactivity';

function observeComponentState(el, callback) {
  // IMPORTANT: Use el.template.state, NOT el.dataContext.state
  // el.dataContext is a snapshot with spread values, not live signals
  const state = el.template?.state;
  if (!state) return null;

  return Reaction.create(() => {
    const snapshot = {};
    for (const [key, signal] of Object.entries(state)) {
      if (signal?.get) {
        snapshot[key] = signal.get();  // Creates reactive dependency
      }
    }
    callback(snapshot);
  });
}
```

**Note**: The bridge script bundles `@semantic-ui/reactivity` (~4KB). SUI has no globals - it's pure ESM.

**Recommendation**: Implement in Phase 4 - the build plan already includes bundled Reaction support.

---

## Appendix: Key SUI APIs Used

> **Note**: All APIs below are verified against source code. Line numbers reference the files in the Context Loading Strategy.

### Element Properties (set by framework)

**Source**: `define-component.js` lines 119-130, `web-component.js` lines 173-240

```javascript
// After component renders (set in willUpdate):
el.template           // Template instance (litTemplate.clone())
el.component          // Component instance (this.template.instance)
el.componentSpec      // Runtime spec (passed to defineComponent)

// Settings system (web-component.js):
el.settings           // Reactive proxy (createSettingsProxy)
el.settingsVars       // Map<string, Signal>
el.defaultSettings    // Object from setDefaultSettings()
```

### Template Instance (`el.template`)

**Source**: `template.js` constructor lines 35-91

```javascript
// Constructor stores these directly:
template.events       // Object: { 'click .btn': handler } (line 63)
template.keys         // Object: { 'Escape': handler } (line 65)
template.defaultState // Object: original state definition (line 70)
template.state        // Object: { signalName: Signal } (line 71)
template.css          // String: component CSS (line 67)
template.instance     // Object: component instance/self (line 161)
template.reactions    // Array: bound reactions (line 69)
template.ast          // Compiled template AST (line 66)

// Methods:
template.getDataContext()  // Returns merged data + state + instance (line 253-259)
template.initialize()      // Sets up instance, events, lifecycle (line 158-227)
```

### Live Data Sources (Use These)

```javascript
// State (live Signal objects)
el.template.state           // { signalName: Signal }
el.template.state.foo.get() // Current value

// Component instance & methods
el.component                // Same as el.template.instance

// Settings
el.settings                 // Reactive proxy
el.getSettings()            // Current values as object

// Template data
el.template.data            // Data passed to component
```

### Runtime Spec (`el.componentSpec`)

**Source**: Example from `button.component.js`

```javascript
componentSpec = {
  tagName: "ui-button",
  content: ["icon", "image", "badge"],
  contentAttributes: ["icon", "image", "badge"],
  types: ["emphasis", "link", "styled", "toggle", "animated"],
  variations: ["floated", "fluid", "compact", "size", ...],
  states: ["hover", "pressed", "focus", "active", "disabled", "loading"],
  settings: ["icon-only", "icon-after", "href"],
  attributes: [...],  // All observed attributes

  // Key for DevTools:
  optionAttributes: { "primary": "emphasis", "large": "size", ... },
  allowedValues: { "size": ["mini", "tiny", ...], "emphasis": ["primary", "secondary"] },
  propertyTypes: { "icon": "string", "fluid": "boolean", ... },
  defaultValues: { "icon-only": false, ... },
  attributeClasses: ["icon", "emphasis", "styled", ...],
  inheritedPluralVariations: ["size", "floated", ...],
}
```

### Full Spec Structure (from `@semantic-ui/core/specs`)

**Source**: `specs.js` exports, `menu.spec.json` structure

```javascript
// Import pattern:
import { ButtonSpec, MenuSpec } from '@semantic-ui/core/specs';

// Full spec includes runtime fields PLUS:
spec = {
  uiType: "element",
  name: "Menu",
  description: "A menu displays grouped navigation actions",
  exportName: "UIMenu",

  // Structured with descriptions:
  content: [{
    name: "Item",
    tagName: "menu-item",
    description: "can include a menu item",
    usageLevel: 1,
  }],

  types: [{
    name: "Selection",
    attribute: "selection",
    description: "allow for selection between choices",
    usageLevel: 1,
  }],

  variations: [{
    name: "Vertical",
    attribute: "vertical",
    description: "can be displayed vertically",
    usageLevel: 1,
  }],

  events: [{
    eventName: "change",
    description: "can specify a function to occur after the value changes",
    arguments: [{ name: "value", description: "the updated value" }],
  }],

  settings: [{
    name: "Menu Items",
    type: "array",
    attribute: "items",
    description: "can automatically generate menu items",
  }],

  examples: {
    defaultContent: "\n  <menu-item active>One</menu-item>\n  ...",
  },
}
```

### CSS Layer Naming Convention

**Source**: `button-definition.css` (verified)

CSS is organized via `@import` with explicit layer names:

```css
/* Content layers - base styles */
@import url('./content/button.css') layer(button.definition.content.button);
@import url('./content/icon.css') layer(button.definition.content.icon);

/* State layers - maps to spec.states */
@import url('./states/hover.css') layer(button.definition.states.hover);
@import url('./states/disabled.css') layer(button.definition.states.disabled);

/* Type layers - maps to spec.types */
@import url('./types/emphasis.css') layer(button.definition.types.emphasis);
@import url('./types/styled.css') layer(button.definition.types.styled);

/* Variation layers - maps to spec.variations */
@import url('./variations/sizing.css') layer(button.definition.variations.sizing);
@import url('./variations/colored.css') layer(button.definition.variations.colored);

/* Plural (group) layer */
@import url('./plural/buttons.css') layer(button.definition.plural);
```

**Pattern**: `{component}.definition.{category}.{specValue}`

| Category | Spec Mapping | Example |
|----------|--------------|---------|
| `content` | Base styles, content slots | `button.definition.content.icon` |
| `states` | `spec.states[]` | `button.definition.states.disabled` |
| `types` | `spec.types[]` | `button.definition.types.emphasis` |
| `variations` | `spec.variations[]` | `button.definition.variations.sizing` |
| `plural` | Group/collection styles | `button.definition.plural` |

### CSSOM Access

```javascript
// Styles are on shadow root (NOT the element):
const styleSheets = el.shadowRoot.adoptedStyleSheets;

// Traverse layer rules:
for (const sheet of styleSheets) {
  for (const rule of sheet.cssRules) {
    if (rule instanceof CSSLayerBlockRule) {
      console.log(rule.name);     // "button.definition.types.emphasis"
      console.log(rule.cssRules); // Nested CSSStyleRule objects
    }
  }
}

// Get computed variable value:
const computed = getComputedStyle(el);
const value = computed.getPropertyValue('--button-padding');
```

### Query Utilities

**Source**: `query.js`

```javascript
// Constructor options (line 68):
new Query(selector, { root = document, pierceShadow = false })

// Shadow-piercing query (querySelectorAllDeep, lines 137-229):
$$('selector')              // Finds across shadow boundaries
$$('ui-dropdown .item')     // Finds .item inside dropdown's shadow DOM

// Component access:
$(el).component()           // Returns el.component
```

### Reactivity

**Source**: Referenced in `template.js` imports, Signal/Reaction from `@semantic-ui/reactivity`

```javascript
// Signal (used in template.state):
const signal = new Signal(initialValue);
signal.get()          // Read (creates dependency in Reaction)
signal.set(value)     // Write (triggers Reactions)
signal.peek()         // Read without dependency
signal.value          // Property accessor

// Reaction (template.js line 764-766):
template.reaction(fn)  // Scoped reaction, auto-cleaned on destroy

// Direct usage:
import { Reaction } from '@semantic-ui/reactivity';
const r = Reaction.create(() => {
  const val = signal.get();  // Creates dependency
});
r.stop();  // Cleanup
```

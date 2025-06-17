# Agent Memory & Project Architecture

This document outlines the core architectural decisions and technical implementation details for the `@semantic-ui/tailwind` package, a Semantic UI component plugin for Tailwind CSS integration.

## 1. Primary Goal & Core Problem

The primary objective is to provide seamless Tailwind CSS integration with Semantic UI web components. This plugin automatically scans component definitions for Tailwind classes and generates the appropriate CSS for shadow DOM encapsulation.

Key challenges addressed:

* **Shadow DOM Compatibility**: Tailwind CSS needs to be scoped within web component shadow boundaries
* **Component Definition Scanning**: Classes can appear in templates, JavaScript functions, CSS files, and sub-templates  
* **Async Plugin Architecture**: Since WASM loading is async, plugins must be applied before `defineComponent()` rather than during
* **Environment Consistency**: Must work identically in browser and Node.js environments

## 2. Architectural Solution: Pre-Processing Plugin Pattern

Instead of integrating into `defineComponent()` directly (which would require async support), the plugin transforms component definitions before they are passed to `defineComponent()`.

### 2.1. Plugin API Design

The plugin follows a simple transformation pattern:

```javascript
// Before
let definition = {
  tagName: 'my-component',
  template: '<div class="px-4 py-2">Content</div>',
  css: '@theme { --color-blue: #007bff; }'
};

// Transform
definition = await TailwindPlugin(definition);

// After - CSS replaced with generated Tailwind CSS
defineComponent(definition);
```

This approach:
- Keeps `defineComponent()` synchronous for SSR compatibility
- Allows chaining multiple async plugins
- Provides clear transformation pipeline
- Maintains component definition immutability

### 2.2. Environment-Specific Implementations

The package provides conditional exports that automatically select the correct Tailwind engine:

```json
"exports": {
  ".": {
    "types": "./types/index.d.ts",
    "cdn": "./dist/bundle/tailwind.js",
    "unpkg": "./dist/bundle/tailwind.js",
    "jsdelivr": "./dist/bundle/tailwind.js",
    "browser": "./src/browser.js",
    "node": "./src/server.js", 
    "default": "./src/server.js"
  }
}
```

**Browser Implementation (`src/browser.js`)**:
```javascript
import { generateTailwindCSS } from 'tailwindcss-iso';
```

**Server Implementation (`src/server.js`)**:
```javascript
import { generateTailwindCSS } from 'tailwindcss-iso';
```

Both implementations share identical logic but import from different `tailwindcss-iso` endpoints to ensure the correct engine is used.

## 3. Component Scanning Strategy

The plugin comprehensively scans component definitions for Tailwind class usage:

### 3.1. Content Sources Scanned

* **Template HTML**: Primary source of Tailwind classes
* **Component CSS**: @theme, @utility, and custom CSS with embedded classes
* **JavaScript Functions**: All lifecycle and event handler functions converted to strings
* **Key Handlers**: Keyboard event handling functions in the keys object
* **Sub-templates**: Recursive scanning of nested template definitions

### 3.2. Content Extraction (`extract-definition-content.js`)

```javascript
export function extractDefinitionContent(definition) {
  // Scans:
  // - definition.template
  // - definition.css  
  // - definition.createComponent.toString()
  // - definition.onCreated.toString()
  // - definition.onRendered.toString()
  // - definition.onDestroyed.toString()
  // - definition.onThemeChanged.toString()
  // - definition.onAttributeChanged.toString()
  // - definition.events[key].toString()
  // - definition.keys[key].toString()
  // - definition.subTemplates recursively
  
  return { html, js, css, content };
}
```

This comprehensive scanning ensures all Tailwind classes are detected regardless of where they appear in the component definition.

## 4. CSS Generation & Replacement

### 4.1. Tailwind Compilation

The plugin uses `tailwindcss-iso` to generate CSS:

```javascript
const tailwindCSS = await generateTailwindCSS({
  content, // Combined HTML + JS content
  css,     // Component CSS with @theme/@utility
});
```

### 4.2. Definition Transformation

The generated CSS completely replaces the component's original CSS:

```javascript
return {
  ...definition,
  css: tailwindCSS, // Replace with generated CSS
};
```

This ensures:
- All Tailwind utilities are available in shadow DOM
- Component-specific @theme customizations are applied
- Custom @utility definitions are compiled
- Existing component CSS is preserved and enhanced

## 5. Integration with Semantic UI Framework

### 5.1. Component Lifecycle Integration

```javascript
import { defineComponent, getText } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

// Standard component definition
const template = await getText('./component.html');
const css = await getText('./component.css');

let definition = {
  tagName: 'my-component',
  template,
  css,
  defaultSettings: { /* ... */ }
};

// Apply Tailwind transformation
definition = await TailwindPlugin(definition);

// Define component with enhanced CSS
export const MyComponent = defineComponent(definition);
```

### 5.2. Shadow DOM Optimization

The generated CSS is specifically optimized for shadow DOM:
- Tailwind utilities are scoped to the component
- No global style pollution
- CSS custom properties work across shadow boundaries
- @theme customizations respect component isolation

## 6. Performance Considerations

### 6.1. Async Pipeline

Since the plugin is async, component modules must use top-level await or async initialization:

```javascript
// Top-level await (recommended)
export const MyComponent = defineComponent(
  await TailwindPlugin(definition)
);

// Or async factory pattern
export async function createMyComponent() {
  return defineComponent(await TailwindPlugin(definition));
}
```

### 6.2. Build-Time Optimization

For production builds, the plugin transformation can be moved to build time:
- Pre-compile all component definitions
- Generate static CSS bundles
- Eliminate runtime WASM loading in browser

## 7. Package Structure

```
@semantic-ui/tailwind/
├── src/
│   ├── browser.js                   # Browser-specific plugin (WASM)
│   ├── server.js                    # Server-specific plugin (Native)
│   └── extract-definition-content.js # Shared content extraction logic
├── dist/
│   └── bundle/
│       └── tailwind.js              # CDN bundle for browsers
├── types/
│   └── index.d.ts                   # TypeScript definitions
├── test/
│   └── basic.test.js                # Test suite
└── package.json                     # Conditional exports + dependencies
```

### 7.1. Dependencies

- **Runtime**: `tailwindcss-iso` (isomorphic Tailwind compiler)
- **Shared**: `@semantic-ui/component`, `@semantic-ui/utils`
- **Peer**: `tailwindcss` (for configuration and theme extensions)
- **Dev**: `vitest` (testing framework)

## 8. Usage Patterns

### 8.1. Basic Component

```javascript
let definition = {
  tagName: 'ui-button',
  template: '<button class="px-4 py-2 bg-blue-500 text-white"><slot></slot></button>',
  css: '@theme { --color-blue-500: #3b82f6; }'
};

definition = await TailwindPlugin(definition);
export const Button = defineComponent(definition);
```

### 8.2. Complex Component with Sub-templates

```javascript
let definition = {
  tagName: 'ui-card',
  template: '<div class="bg-white shadow-lg">{>header}{>body}</div>',
  css: '@utility shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }',
  subTemplates: {
    header: {
      template: '<header class="p-4 border-b"><slot name="header"></slot></header>'
    },
    body: {
      template: '<div class="p-4"><slot></slot></div>'
    }
  }
};

definition = await TailwindPlugin(definition);
export const Card = defineComponent(definition);
```

This architecture provides a clean, performant, and flexible way to integrate Tailwind CSS with Semantic UI components while maintaining the framework's design principles.
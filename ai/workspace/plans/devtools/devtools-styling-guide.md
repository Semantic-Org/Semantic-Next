# Chrome DevTools Visual Parity Guide

> **Comprehensive styling reference for making your SUI DevTools extension indistinguishable from native Chrome DevTools**

---

## Table of Contents

1. [Extracting Native DevTools Styles](#extracting-native-devtools-styles)
2. [Design Tokens & CSS Variables](#design-tokens--css-variables)
3. [Typography System](#typography-system)
4. [Color Palette (Light & Dark)](#color-palette-light--dark)
5. [Component Patterns](#component-patterns)
6. [Tree View Styling](#tree-view-styling)
7. [Tabbed Panel Styling](#tabbed-panel-styling)
8. [Table/Property List Styling](#tableproperty-list-styling)
9. [Interactive Elements](#interactive-elements)
10. [Syntax Highlighting](#syntax-highlighting)
11. [Icons & Visual Indicators](#icons--visual-indicators)
12. [Complete panel.css Reference](#complete-panelcss-reference)

---

## Extracting Native DevTools Styles

### Method 1: DevTools-on-DevTools (Best for Live Inspection)

```bash
# Open DevTools on any page, then:
# macOS: Cmd + Shift + I
# Windows/Linux: Ctrl + Shift + I

# This opens a second DevTools window inspecting the first one
# Navigate to Elements tab and inspect any component
```

### Method 2: Chromium Source (Authoritative Reference)

The DevTools frontend is open source:

```bash
# Clone the DevTools frontend
git clone https://chromium.googlesource.com/devtools/devtools-frontend

# Key style files:
# front_end/ui/legacy/inspectorCommon.css     - Base variables & reset
# front_end/ui/legacy/inspectorStyle.css      - Core component styles
# front_end/ui/legacy/inspectorSyntaxHighlight.css - Code highlighting
# front_end/panels/elements/elementsTreeOutline.css - Tree view
# front_end/ui/components/treeOutline.css     - Modern tree component
```

### Method 3: npm Package (Easier Access)

```bash
npm install chrome-devtools-frontend

# Then explore:
# node_modules/chrome-devtools-frontend/front_end/
```

### Method 4: Chrome's Internal Styles (Runtime)

```javascript
// In DevTools-on-DevTools console:
// Get all CSS custom properties used
const styles = getComputedStyle(document.documentElement);
const props = [];
for (let i = 0; i < styles.length; i++) {
  if (styles[i].startsWith('--')) {
    props.push(`${styles[i]}: ${styles.getPropertyValue(styles[i])}`);
  }
}
console.log(props.join('\n'));
```

---

## Design Tokens & CSS Variables

Chrome DevTools uses a comprehensive token system. Here are the critical ones:

### Core Spacing

```css
:root {
  /* DevTools uses a 4px base grid */
  --spacing-unit: 4px;
  
  /* Common spacing values */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  
  /* Panel-specific */
  --panel-padding: 0;
  --section-padding: 8px;
  --tree-indent: 12px;
  --tree-row-height: 20px;
}
```

### Border Radius

```css
:root {
  /* DevTools is mostly sharp corners */
  --border-radius-none: 0;
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  
  /* Used sparingly for specific elements */
  --chip-radius: 3px;
  --button-radius: 2px;
}
```

---

## Typography System

### Font Stack

```css
:root {
  /* Primary monospace - used for most content */
  --monospace-font-family: Menlo, Monaco, Consolas, "Liberation Mono", 
                           "Courier New", monospace;
  
  /* System UI - used for tabs, labels, toolbar */
  --default-font-family: ".SFNSDisplay-Regular", "Helvetica Neue", 
                         "Lucida Grande", sans-serif;
  
  /* Platform-specific (Chrome detects OS) */
  /* macOS: -apple-system, BlinkMacSystemFont */
  /* Windows: "Segoe UI" */
  /* Linux: "Ubuntu", "Cantarell" */
}
```

### Font Sizes (Critical for Parity)

```css
:root {
  /* DevTools uses notably small text */
  --font-size-default: 11px;        /* Most content */
  --font-size-small: 10px;          /* Secondary info */
  --font-size-toolbar: 12px;        /* Tab labels, buttons */
  --font-size-heading: 11px;        /* Section headers (same as default!) */
  
  /* Line heights */
  --line-height-default: 1.4;
  --line-height-code: 1.2;
  --line-height-tree: 20px;         /* Fixed for tree rows */
}
```

### Font Weights

```css
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;        /* Tab labels, some headers */
  --font-weight-bold: 600;          /* Rarely used */
}
```

---

## Color Palette (Light & Dark)

### Light Theme

```css
[data-theme="light"], :root {
  /* Backgrounds */
  --color-background: #f3f3f3;              /* Main panel bg */
  --color-background-elevation-1: #fff;     /* Cards, sidebars */
  --color-background-elevation-2: #f9f9f9;  /* Nested sections */
  --color-background-hover: rgba(0, 0, 0, 0.05);
  --color-background-selected: #e8f0fe;     /* Selected item */
  --color-background-selected-unfocused: #e8e8e8;
  
  /* Text */
  --color-text-primary: #303942;
  --color-text-secondary: #5f6368;
  --color-text-disabled: #9aa0a6;
  --color-text-accent: #1a73e8;             /* Links, active items */
  
  /* Borders */
  --color-border: #cacdd1;
  --color-border-light: #e0e0e0;
  --color-border-focus: #1a73e8;
  
  /* Syntax Highlighting */
  --color-syntax-tag: #881280;              /* HTML tags, tag names */
  --color-syntax-attribute: #994500;        /* Attribute names */
  --color-syntax-attribute-value: #1a1aa6;  /* Attribute values, strings */
  --color-syntax-comment: #236e25;
  --color-syntax-keyword: #881280;
  --color-syntax-number: #1c00cf;
  --color-syntax-string: #c41a16;
  --color-syntax-property: #881280;
  --color-syntax-css-property: #c80000;
  --color-syntax-css-value: #222;
  
  /* States */
  --color-modified: #e37400;                /* Changed values indicator */
  --color-error: #d93025;
  --color-warning: #f9ab00;
  --color-success: #188038;
  
  /* Special */
  --color-link: #1a73e8;
  --color-selection: rgba(26, 115, 232, 0.15);
}
```

### Dark Theme

```css
[data-theme="dark"] {
  /* Backgrounds */
  --color-background: #202124;
  --color-background-elevation-1: #292a2d;
  --color-background-elevation-2: #35363a;
  --color-background-hover: rgba(255, 255, 255, 0.05);
  --color-background-selected: #3c4043;
  --color-background-selected-unfocused: #35363a;
  
  /* Text */
  --color-text-primary: #e8eaed;
  --color-text-secondary: #9aa0a6;
  --color-text-disabled: #5f6368;
  --color-text-accent: #8ab4f8;
  
  /* Borders */
  --color-border: #3c4043;
  --color-border-light: #5f6368;
  --color-border-focus: #8ab4f8;
  
  /* Syntax Highlighting (Dark) */
  --color-syntax-tag: #5db0d7;
  --color-syntax-attribute: #9bbbdc;
  --color-syntax-attribute-value: #f28b54;
  --color-syntax-comment: #898989;
  --color-syntax-keyword: #5db0d7;
  --color-syntax-number: #9980ff;
  --color-syntax-string: #f28b54;
  --color-syntax-property: #5db0d7;
  --color-syntax-css-property: #9bbbdc;
  --color-syntax-css-value: #e8eaed;
  
  /* States */
  --color-modified: #fdd663;
  --color-error: #f28b82;
  --color-warning: #fdd663;
  --color-success: #81c995;
  
  /* Special */
  --color-link: #8ab4f8;
  --color-selection: rgba(138, 180, 248, 0.2);
}
```

### Theme Detection

```css
/* Match system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Apply dark theme variables */
  }
}

/* Or detect from DevTools context */
```

```javascript
// In panel.js - detect DevTools theme
function detectTheme() {
  // DevTools exposes theme via chrome.devtools.panels
  const isDark = chrome.devtools.panels.themeName === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
}

// Listen for theme changes
chrome.devtools.panels.onThemeChanged?.addListener(detectTheme);
detectTheme();
```

---

## Component Patterns

### Panel Container

```css
.devtools-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background);
  font-family: var(--default-font-family);
  font-size: var(--font-size-default);
  color: var(--color-text-primary);
  overflow: hidden;
}
```

### Split Pane (Tree + Inspector)

```css
.split-pane {
  display: flex;
  flex: 1;
  min-height: 0;
}

.split-pane-left {
  width: 250px;
  min-width: 150px;
  max-width: 50%;
  border-right: 1px solid var(--color-border);
  overflow: auto;
}

.split-pane-right {
  flex: 1;
  min-width: 200px;
  overflow: auto;
}

/* Resize handle */
.split-handle {
  width: 4px;
  cursor: col-resize;
  background: transparent;
  position: relative;
}

.split-handle:hover,
.split-handle.dragging {
  background: var(--color-border-focus);
}
```

---

## Tree View Styling

This is critical for the Elements-like tree. Native DevTools tree uses very specific styling:

```css
/* Tree container */
.tree-view {
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-default);
  line-height: var(--line-height-tree);
  user-select: none;
  outline: none;
}

/* Tree row - includes expand arrow + content */
.tree-row {
  display: flex;
  align-items: center;
  height: 20px;                    /* Fixed height is important */
  padding-left: calc(var(--depth, 0) * var(--tree-indent));
  padding-right: 8px;
  white-space: nowrap;
  cursor: default;
}

/* Hover state */
.tree-row:hover {
  background: var(--color-background-hover);
}

/* Selected state */
.tree-row.selected {
  background: var(--color-background-selected);
}

.tree-row.selected:not(:focus-within) {
  background: var(--color-background-selected-unfocused);
}

/* Expand/collapse arrow */
.tree-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-right: 2px;
  font-size: 10px;
  color: var(--color-text-secondary);
  transition: transform 0.1s ease;
}

.tree-arrow::before {
  content: '▶';
  font-size: 8px;
}

.tree-row.expanded > .tree-arrow::before {
  transform: rotate(90deg);
}

.tree-row:not(.has-children) > .tree-arrow {
  visibility: hidden;
}

/* Tree node content - the tag name and attributes */
.tree-node-content {
  display: inline;
}

/* Tag name styling - matches DevTools Elements panel */
.tree-tag-name {
  color: var(--color-syntax-tag);
}

/* Attribute styling */
.tree-attribute-name {
  color: var(--color-syntax-attribute);
}

.tree-attribute-value {
  color: var(--color-syntax-attribute-value);
}

/* Brackets and punctuation */
.tree-punctuation {
  color: var(--color-text-secondary);
}

/* Component label (extra info) */
.tree-label {
  color: var(--color-text-secondary);
  margin-left: 4px;
  font-style: italic;
}
```

### Tree Node HTML Structure

```html
<div class="tree-row selected has-children expanded" style="--depth: 1">
  <span class="tree-arrow"></span>
  <span class="tree-node-content">
    <span class="tree-punctuation">&lt;</span>
    <span class="tree-tag-name">ui-button</span>
    <span class="tree-attribute-name"> primary</span>
    <span class="tree-attribute-name"> size</span>
    <span class="tree-punctuation">=</span>
    <span class="tree-attribute-value">"large"</span>
    <span class="tree-punctuation">&gt;</span>
  </span>
  <span class="tree-label">[primary, large]</span>
</div>
```

---

## Tabbed Panel Styling

DevTools tabs have a very specific appearance:

```css
/* Tab bar container */
.tab-bar {
  display: flex;
  align-items: stretch;
  height: 27px;                     /* Exact DevTools height */
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 0 8px;
  gap: 0;
}

/* Individual tab */
.tab {
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-family: var(--default-font-family);
  font-size: var(--font-size-toolbar);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}

.tab:hover {
  color: var(--color-text-primary);
  background: var(--color-background-hover);
}

/* Active tab */
.tab.active {
  color: var(--color-text-accent);
}

/* Active indicator - the blue underline */
.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-text-accent);
}

/* Tab content area */
.tab-content {
  flex: 1;
  overflow: auto;
  padding: var(--section-padding);
}
```

---

## Table/Property List Styling

For the Developer tab's settings table:

```css
/* Property table */
.property-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-default);
}

.property-table th {
  text-align: left;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
  padding: 4px 8px;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-background-elevation-2);
  position: sticky;
  top: 0;
}

.property-table td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: top;
}

.property-table tr:hover {
  background: var(--color-background-hover);
}

/* Property name (first column) */
.property-name {
  color: var(--color-syntax-property);
  white-space: nowrap;
}

/* Property value */
.property-value {
  color: var(--color-text-primary);
  word-break: break-word;
}

/* Modified indicator */
.property-value.modified {
  position: relative;
}

.property-value.modified::after {
  content: '← modified';
  color: var(--color-modified);
  font-style: italic;
  margin-left: 8px;
  font-size: var(--font-size-small);
}

/* Value types */
.value-string { color: var(--color-syntax-string); }
.value-number { color: var(--color-syntax-number); }
.value-boolean { color: var(--color-syntax-keyword); }
.value-null { color: var(--color-text-disabled); }
.value-object { color: var(--color-text-secondary); }
```

---

## Interactive Elements

### Variation Chips (for Styles tab)

```css
/* Chip group */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 4px 0;
}

/* Individual chip */
.chip {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  background: var(--color-background-elevation-2);
  border: 1px solid var(--color-border);
  border-radius: var(--chip-radius);
  cursor: pointer;
  user-select: none;
}

.chip:hover {
  background: var(--color-background-hover);
  border-color: var(--color-border-light);
}

/* Active/selected chip */
.chip.active {
  background: var(--color-background-selected);
  border-color: var(--color-border-focus);
  color: var(--color-text-accent);
}
```

### Checkboxes (Boolean toggles)

```css
/* Custom checkbox that matches DevTools style */
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: var(--font-size-default);
}

.checkbox input {
  appearance: none;
  width: 12px;
  height: 12px;
  border: 1px solid var(--color-text-secondary);
  border-radius: 2px;
  background: var(--color-background-elevation-1);
  cursor: pointer;
}

.checkbox input:checked {
  background: var(--color-text-accent);
  border-color: var(--color-text-accent);
}

.checkbox input:checked::after {
  content: '✓';
  display: block;
  font-size: 10px;
  color: white;
  text-align: center;
  line-height: 12px;
}
```

### Buttons

```css
/* Small toolbar buttons */
.toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  background: none;
  border-radius: var(--button-radius);
  cursor: pointer;
  color: var(--color-text-secondary);
}

.toolbar-button:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.toolbar-button.active {
  color: var(--color-text-accent);
  background: var(--color-selection);
}

/* Text buttons */
.text-button {
  padding: 4px 12px;
  font-size: var(--font-size-default);
  font-family: var(--default-font-family);
  color: var(--color-text-accent);
  background: none;
  border: 1px solid var(--color-text-accent);
  border-radius: var(--button-radius);
  cursor: pointer;
}

.text-button:hover {
  background: var(--color-selection);
}
```

---

## Syntax Highlighting

For CSS code display in the Styles tab:

```css
/* Code block container */
.code-block {
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-default);
  line-height: 1.4;
  background: var(--color-background-elevation-1);
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: 8px;
  overflow-x: auto;
}

/* CSS rule display */
.css-rule {
  margin: 4px 0;
}

.css-selector {
  color: var(--color-text-primary);
}

.css-property {
  color: var(--color-syntax-css-property);
  margin-left: 16px;
}

.css-value {
  color: var(--color-syntax-css-value);
}

.css-variable {
  color: var(--color-syntax-property);
}

.css-punctuation {
  color: var(--color-text-secondary);
}

/* Color swatch inline */
.color-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  vertical-align: middle;
}

/* Resolved value (→ indicator) */
.resolved-value {
  color: var(--color-text-secondary);
}

.resolved-value::before {
  content: '→';
  margin: 0 4px;
}
```

---

## Icons & Visual Indicators

### Using System Icons

DevTools uses a combination of Unicode symbols and SVG icons:

```css
/* Common icon patterns */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Element picker icon (inspect cursor) */
.icon-picker::before {
  content: url("data:image/svg+xml,...");
  /* Or use: ⎁ or similar Unicode */
}

/* Refresh icon */
.icon-refresh::before {
  content: '↻';
}

/* Expand/collapse */
.icon-expand::before { content: '▶'; }
.icon-collapse::before { content: '▼'; }

/* Status indicators */
.icon-modified::before {
  content: '●';
  color: var(--color-modified);
  font-size: 8px;
}
```

### Toolbar Layout

```css
.toolbar {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 4px;
  gap: 4px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.toolbar-separator {
  width: 1px;
  height: 16px;
  background: var(--color-border);
  margin: 0 4px;
}
```

---

## Section Headers (Collapsible)

```css
/* Collapsible section */
.section {
  border-bottom: 1px solid var(--color-border-light);
}

.section-header {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 8px;
  background: var(--color-background-elevation-2);
  cursor: pointer;
  user-select: none;
}

.section-header:hover {
  background: var(--color-background-hover);
}

.section-arrow {
  margin-right: 4px;
  font-size: 10px;
  transition: transform 0.1s;
}

.section.collapsed .section-arrow {
  transform: rotate(-90deg);
}

.section-title {
  font-size: var(--font-size-default);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.section-content {
  padding: 8px;
}

.section.collapsed .section-content {
  display: none;
}
```

---

## Complete panel.css Reference

Here's a production-ready CSS file incorporating all the above:

```css
/* ========================================
   SUI DevTools Panel Styles
   Visual parity with Chrome DevTools
   ======================================== */

/* ========================================
   CSS Custom Properties (Design Tokens)
   ======================================== */

:root {
  /* Spacing */
  --spacing-unit: 4px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --tree-indent: 12px;
  --tree-row-height: 20px;
  
  /* Typography */
  --monospace-font-family: Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-default: 11px;
  --font-size-small: 10px;
  --font-size-toolbar: 12px;
  --line-height-default: 1.4;
  --line-height-tree: 20px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  
  /* Borders */
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --chip-radius: 3px;
}

/* Light theme (default) */
:root,
[data-theme="light"] {
  --color-background: #f3f3f3;
  --color-background-elevation-1: #fff;
  --color-background-elevation-2: #f9f9f9;
  --color-background-hover: rgba(0, 0, 0, 0.05);
  --color-background-selected: #e8f0fe;
  --color-background-selected-unfocused: #e8e8e8;
  
  --color-text-primary: #303942;
  --color-text-secondary: #5f6368;
  --color-text-disabled: #9aa0a6;
  --color-text-accent: #1a73e8;
  
  --color-border: #cacdd1;
  --color-border-light: #e0e0e0;
  --color-border-focus: #1a73e8;
  
  --color-syntax-tag: #881280;
  --color-syntax-attribute: #994500;
  --color-syntax-attribute-value: #1a1aa6;
  --color-syntax-comment: #236e25;
  --color-syntax-keyword: #881280;
  --color-syntax-number: #1c00cf;
  --color-syntax-string: #c41a16;
  --color-syntax-property: #881280;
  --color-syntax-css-property: #c80000;
  --color-syntax-css-value: #222;
  
  --color-modified: #e37400;
  --color-error: #d93025;
  --color-warning: #f9ab00;
  --color-success: #188038;
  --color-link: #1a73e8;
  --color-selection: rgba(26, 115, 232, 0.15);
}

/* Dark theme */
[data-theme="dark"] {
  --color-background: #202124;
  --color-background-elevation-1: #292a2d;
  --color-background-elevation-2: #35363a;
  --color-background-hover: rgba(255, 255, 255, 0.05);
  --color-background-selected: #3c4043;
  --color-background-selected-unfocused: #35363a;
  
  --color-text-primary: #e8eaed;
  --color-text-secondary: #9aa0a6;
  --color-text-disabled: #5f6368;
  --color-text-accent: #8ab4f8;
  
  --color-border: #3c4043;
  --color-border-light: #5f6368;
  --color-border-focus: #8ab4f8;
  
  --color-syntax-tag: #5db0d7;
  --color-syntax-attribute: #9bbbdc;
  --color-syntax-attribute-value: #f28b54;
  --color-syntax-comment: #898989;
  --color-syntax-keyword: #5db0d7;
  --color-syntax-number: #9980ff;
  --color-syntax-string: #f28b54;
  --color-syntax-property: #5db0d7;
  --color-syntax-css-property: #9bbbdc;
  --color-syntax-css-value: #e8eaed;
  
  --color-modified: #fdd663;
  --color-error: #f28b82;
  --color-warning: #fdd663;
  --color-success: #81c995;
  --color-link: #8ab4f8;
  --color-selection: rgba(138, 180, 248, 0.2);
}

/* ========================================
   Base Reset & Panel Layout
   ======================================== */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: var(--default-font-family);
  font-size: var(--font-size-default);
  color: var(--color-text-primary);
  background: var(--color-background);
  line-height: var(--line-height-default);
}

/* Panel container */
.devtools-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ========================================
   Toolbar
   ======================================== */

.toolbar {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 4px;
  gap: 2px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  background: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
}

.toolbar-button:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.toolbar-button.active {
  color: var(--color-text-accent);
  background: var(--color-selection);
}

.toolbar-button svg {
  width: 16px;
  height: 16px;
}

.toolbar-separator {
  width: 1px;
  height: 16px;
  background: var(--color-border);
  margin: 0 4px;
}

.toolbar-spacer {
  flex: 1;
}

/* ========================================
   Split Pane
   ======================================== */

.split-pane {
  display: flex;
  flex: 1;
  min-height: 0;
}

.split-pane-left {
  width: 250px;
  min-width: 150px;
  max-width: 50%;
  border-right: 1px solid var(--color-border);
  overflow: auto;
  background: var(--color-background-elevation-1);
}

.split-pane-right {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.split-handle {
  width: 4px;
  cursor: col-resize;
  background: transparent;
  flex-shrink: 0;
}

.split-handle:hover,
.split-handle.dragging {
  background: var(--color-border-focus);
}

/* ========================================
   Tree View
   ======================================== */

.tree-view {
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-default);
  line-height: var(--line-height-tree);
  user-select: none;
  outline: none;
  padding: 4px 0;
}

.tree-row {
  display: flex;
  align-items: center;
  height: var(--tree-row-height);
  padding-left: calc(var(--depth, 0) * var(--tree-indent) + 4px);
  padding-right: 8px;
  white-space: nowrap;
  cursor: default;
}

.tree-row:hover {
  background: var(--color-background-hover);
}

.tree-row.selected {
  background: var(--color-background-selected);
}

.tree-row.selected:not(:focus-within) {
  background: var(--color-background-selected-unfocused);
}

.tree-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-right: 2px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.tree-arrow::before {
  content: '▶';
  font-size: 8px;
  transition: transform 0.1s ease;
}

.tree-row.expanded > .tree-arrow::before {
  transform: rotate(90deg);
}

.tree-row:not(.has-children) > .tree-arrow {
  visibility: hidden;
}

.tree-tag-name {
  color: var(--color-syntax-tag);
}

.tree-attribute-name {
  color: var(--color-syntax-attribute);
}

.tree-attribute-value {
  color: var(--color-syntax-attribute-value);
}

.tree-punctuation {
  color: var(--color-text-secondary);
}

.tree-label {
  color: var(--color-text-secondary);
  margin-left: 4px;
  font-style: italic;
}

/* ========================================
   Tabs
   ======================================== */

.tab-bar {
  display: flex;
  align-items: stretch;
  height: 27px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 0;
  flex-shrink: 0;
}

.tab {
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-family: var(--default-font-family);
  font-size: var(--font-size-toolbar);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}

.tab:hover {
  color: var(--color-text-primary);
  background: var(--color-background-hover);
}

.tab.active {
  color: var(--color-text-accent);
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-text-accent);
}

.tab-content {
  flex: 1;
  overflow: auto;
}

.tab-panel {
  display: none;
  height: 100%;
  overflow: auto;
}

.tab-panel.active {
  display: block;
}

/* ========================================
   Sections (Collapsible)
   ======================================== */

.section {
  border-bottom: 1px solid var(--color-border-light);
}

.section-header {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 8px;
  background: var(--color-background-elevation-2);
  cursor: pointer;
  user-select: none;
}

.section-header:hover {
  background: var(--color-background-hover);
}

.section-arrow {
  width: 12px;
  margin-right: 4px;
  font-size: 10px;
  color: var(--color-text-secondary);
  transition: transform 0.1s;
}

.section-arrow::before {
  content: '▼';
}

.section.collapsed .section-arrow::before {
  content: '▶';
}

.section-title {
  font-size: var(--font-size-default);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.section-content {
  padding: 8px;
}

.section.collapsed .section-content {
  display: none;
}

/* ========================================
   Property Table
   ======================================== */

.property-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-default);
}

.property-table th {
  text-align: left;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
  padding: 4px 8px;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-background-elevation-2);
  position: sticky;
  top: 0;
}

.property-table td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: top;
}

.property-table tr:hover {
  background: var(--color-background-hover);
}

.property-name {
  color: var(--color-syntax-property);
  white-space: nowrap;
}

.property-value {
  color: var(--color-text-primary);
  word-break: break-word;
}

.property-value.modified::after {
  content: ' ← modified';
  color: var(--color-modified);
  font-style: italic;
  font-size: var(--font-size-small);
}

/* Value type colors */
.value-string { color: var(--color-syntax-string); }
.value-number { color: var(--color-syntax-number); }
.value-boolean { color: var(--color-syntax-keyword); }
.value-null { color: var(--color-text-disabled); font-style: italic; }
.value-object { color: var(--color-text-secondary); }
.value-array { color: var(--color-text-secondary); }

/* ========================================
   Chips (Variation selectors)
   ======================================== */

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 4px 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  background: var(--color-background-elevation-2);
  border: 1px solid var(--color-border);
  border-radius: var(--chip-radius);
  cursor: pointer;
  user-select: none;
  transition: all 0.1s;
}

.chip:hover {
  background: var(--color-background-hover);
  border-color: var(--color-border-light);
}

.chip.active {
  background: var(--color-background-selected);
  border-color: var(--color-border-focus);
  color: var(--color-text-accent);
}

/* ========================================
   Checkboxes
   ======================================== */

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: var(--font-size-default);
}

.checkbox input[type="checkbox"] {
  appearance: none;
  width: 12px;
  height: 12px;
  border: 1px solid var(--color-text-secondary);
  border-radius: 2px;
  background: var(--color-background-elevation-1);
  cursor: pointer;
  position: relative;
}

.checkbox input[type="checkbox"]:checked {
  background: var(--color-text-accent);
  border-color: var(--color-text-accent);
}

.checkbox input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: -1px;
  left: 1px;
  font-size: 10px;
  color: white;
}

/* ========================================
   Code Blocks
   ======================================== */

.code-block {
  font-family: var(--monospace-font-family);
  font-size: var(--font-size-default);
  line-height: 1.4;
  background: var(--color-background-elevation-1);
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: 8px;
  overflow-x: auto;
  margin: 4px 0;
}

.css-selector {
  color: var(--color-text-primary);
}

.css-property {
  color: var(--color-syntax-css-property);
  padding-left: 16px;
}

.css-value {
  color: var(--color-syntax-css-value);
}

.css-variable {
  color: var(--color-syntax-property);
}

.css-punctuation {
  color: var(--color-text-secondary);
}

/* Color swatch */
.color-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  vertical-align: middle;
}

/* Resolved value */
.resolved-value {
  color: var(--color-text-secondary);
}

.resolved-value::before {
  content: ' → ';
}

/* ========================================
   Status Bar (Bottom)
   ======================================== */

.status-bar {
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  background: var(--color-background-elevation-2);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.status-bar-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-bar-separator {
  width: 1px;
  height: 12px;
  background: var(--color-border);
  margin: 0 8px;
}

/* ========================================
   Empty State
   ======================================== */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  text-align: center;
  padding: 24px;
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state-title {
  font-size: var(--font-size-toolbar);
  margin-bottom: 8px;
}

.empty-state-description {
  font-size: var(--font-size-default);
}

/* ========================================
   Scrollbar Styling (matches DevTools)
   ======================================== */

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-corner {
  background: transparent;
}
```

---

## Additional Tips for Pixel-Perfect Parity

### 1. Use the Exact Font Stack
The monospace font rendering is critical. DevTools uses platform-specific fonts:
- **macOS**: Menlo
- **Windows**: Consolas
- **Linux**: Liberation Mono or DejaVu Sans Mono

### 2. Match the 11px Font Size
This is the most distinctive aspect. Modern web UIs typically use 14-16px; DevTools is notably smaller at 11px.

### 3. Fixed Row Heights
Tree rows and table rows should be exactly 20px. This creates the dense, information-rich feel.

### 4. Subtle Hover States
DevTools hover states are very subtle (5% opacity overlays). Avoid heavy hover effects.

### 5. Theme Sync
Always sync with DevTools theme using `chrome.devtools.panels.themeName`:

```javascript
// panel.js
function syncTheme() {
  const theme = chrome.devtools.panels.themeName;
  document.documentElement.dataset.theme = theme;
}

chrome.devtools.panels.onThemeChanged?.addListener(syncTheme);
syncTheme();
```

### 6. Test in Actual DevTools
The panel renders differently than a normal web page. Always test with the extension loaded in actual DevTools, not just in a browser tab.

---

## Resources

- **Chromium DevTools Source**: https://chromium.googlesource.com/devtools/devtools-frontend
- **DevTools Protocol Viewer**: https://chromedevtools.github.io/devtools-protocol/
- **Chrome Extensions Docs**: https://developer.chrome.com/docs/extensions/
- **DevTools Theme Variables** (extract with DevTools-on-DevTools)

This guide should give you everything needed to create an SUI DevTools extension that feels completely native. The key is attention to the small details: font sizes, spacing, colors, and interaction patterns that Chrome users already expect.

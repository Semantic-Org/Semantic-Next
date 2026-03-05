---
title: Component HTML Authoring
description: Canonical patterns for writing HTML inside a component's shadow DOM template — semantic class naming, role-based structures, accessibility integration, and DOM patterns.
keywords: [HTML, semantic markup, class naming, accessibility, ARIA, data attributes, DOM structure, shadow DOM, parts, slots]
audience: authoring
skill: component-html
---

# Component HTML Authoring

> **Skill:** `sui:component-html`
> **Purpose:** Canonical patterns for writing HTML inside a component's shadow DOM template — semantic class naming, role-based structures, accessibility integration, and DOM patterns.
> **Last Updated:** 2026-03-04

---

**Golden rule: Class names describe purpose, not implementation.** Write `.sidebar`, not `.flex-column-left`. Write `.header`, not `.grid-row-1`.

## Core Philosophy

Apply natural language concepts to markup, creating intuitive, semantic, and maintainable HTML that describes purpose rather than implementation.

---

## Class Naming Patterns

### Semantic Element Naming

**Use natural language that describes purpose, not implementation:**

```html
<!-- ✅ Natural language describing function -->
<div class="slider">
  <div class="track"></div>
  <div class="fill"></div>
  <div class="handle"></div>
</div>

<!-- ✅ Purpose-driven naming -->
<div class="color-picker">
  <div class="preview">
    <div class="current-color"></div>
  </div>
  <div class="controls">
    <div class="hex-input"></div>
  </div>
</div>

<!-- ❌ WRONG: Implementation details -->
<div class="flex-container">
  <div class="absolute-positioned"></div>
  <div class="grid-item-3-columns"></div>
</div>
```

### Role-Based Naming

Use element roles and content hierarchy:

```html
<!-- ✅ Content hierarchy -->
<div class="accordion">
  <div class="section">
    <div class="header">
      <span class="title">Section Title</span>
      <span class="icon">↓</span>
    </div>
    <div class="content">Section content</div>
  </div>
</div>

<!-- ✅ Form structure -->
<div class="field">
  <label class="label">Email</label>
  <input class="input" type="email">
  <div class="error">Please enter a valid email</div>
  <div class="help">We'll never share your email</div>
</div>
```

---

## DOM Structure Patterns

### Hierarchical Nesting

**Reflect content relationships through natural DOM nesting:**

```html
<!-- ✅ Natural containment hierarchy -->
<div class="dashboard">
  <div class="sidebar">
    <div class="navigation">
      <div class="section">
        <div class="header">Navigation</div>
        <div class="items">
          <div class="item">Home</div>
          <div class="item">Settings</div>
        </div>
      </div>
    </div>
  </div>
  <div class="content">
    <div class="header">
      <div class="title">Dashboard</div>
      <div class="actions">
        <button class="action">Refresh</button>
      </div>
    </div>
  </div>
</div>
```

### Container Patterns

```html
<!-- ✅ Form containers -->
<form class="settings-form">
  <div class="fields">
    <div class="field">
      <label>Theme</label>
      <input placeholder="Enter theme">
    </div>
    <div class="field">
      <label>Language</label>
      <select>
        <option>English</option>
      </select>
    </div>
  </div>
  <div class="actions">
    <button class="cancel">Cancel</button>
    <button class="save">Save</button>
  </div>
</form>
```

---

## Element Targeting

### Use Classes, Never IDs

**MANDATORY**: Use class names for element targeting, never IDs.

```html
<!-- ✅ CORRECT: Class-based targeting -->
<button class="submit">Submit</button>
<input class="email" type="email">
<div class="color-swatch" data-color="red"></div>

<!-- ❌ WRONG: ID-based targeting -->
<button id="submitBtn">Submit</button>
<input id="emailInput" type="email">
<div id="redSwatch"></div>
```

**Why avoid IDs:**
- **Reusability**: Classes allow multiple instances, IDs enforce uniqueness
- **Maintainability**: Class-based selectors are more flexible
- **Component isolation**: Classes work better with Shadow DOM
- **Semantic clarity**: Purpose described by class name, not arbitrary ID

---

## Data Attributes

### State and Interaction Data

**Use data attributes for component state and JavaScript hooks:**

```html
<!-- ✅ Component state -->
<div class="accordion-section" data-index="0" data-expanded="true">
  <div class="header" data-action="toggle">Click to expand</div>
  <div class="content">Section content</div>
</div>

<!-- ✅ Dynamic content -->
<div class="color-swatch"
     data-color="red"
     data-shade="500"
     data-value="#dc3545">
</div>

<!-- ✅ Component configuration -->
<div class="chart"
     data-type="bar"
     data-animation="true"
     data-responsive="true">
</div>
```

---

## Accessibility Integration

### Semantic HTML with ARIA

**Seamlessly integrate accessibility attributes:**

```html
<!-- ✅ Semantic navigation -->
<nav class="main-navigation" role="navigation" aria-label="Main navigation">
  <div class="items" role="menubar">
    <div class="item" role="menuitem" tabindex="0">Home</div>
    <div class="item" role="menuitem" tabindex="0">About</div>
  </div>
</nav>

<!-- ✅ Interactive components -->
<div class="dropdown" role="combobox" aria-expanded="false">
  <div class="trigger" aria-haspopup="listbox">Select option</div>
  <div class="menu" role="listbox">
    <div class="item" role="option">Option 1</div>
  </div>
</div>
```

---

## CSS Parts for Styling

### Exposing Component Internals

**Use `part` attribute for external styling hooks:**

```html
<!-- ✅ Styleable component parts -->
<div class="slider">
  <div class="track" part="track"></div>
  <div class="fill" part="fill"></div>
  <div class="handle" part="handle"></div>
</div>

<!-- External styling -->
<style>
slider-component::part(handle) {
  background: var(--primary-color);
  border-radius: 50%;
}
</style>
```

---

## Quick Reference

```html
<!-- Class naming: purpose, not implementation -->
<div class="sidebar">       ✅ Purpose
<div class="flex-left">      ❌ Implementation

<!-- Always classes, never IDs -->
<button class="submit">      ✅
<button id="submitBtn">      ❌

<!-- Data attributes for state -->
<div data-expanded="true">   ✅ State
<div class="is-expanded">    ⚠️ Acceptable, but data-* preferred for JS hooks

<!-- ARIA on interactive elements -->
<div role="combobox" aria-expanded="false">  ✅

<!-- CSS parts for external styling -->
<div class="handle" part="handle">           ✅
```

### DO / DON'T

```html
<!-- ❌ WRONG - flat structure -->
<div class="dashboard-sidebar-nav-section-header">Title</div>
<div class="dashboard-sidebar-nav-section-item">Home</div>

<!-- ✅ RIGHT - nested hierarchy -->
<div class="dashboard">
  <div class="sidebar">
    <div class="section">
      <div class="header">Title</div>
      <div class="item">Home</div>
    </div>
  </div>
</div>

<!-- ❌ WRONG - implementation naming -->
<div class="grid-3-col responsive-flex-wrap">

<!-- ✅ RIGHT - semantic naming -->
<div class="card-grid">
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Component CSS** | `sui:component-css` | Writing CSS that targets these HTML patterns |
| **Component Specs** | `sui:component-specs` | How specs define content slots and component structure |
| **Style Components** | `sui:style-components` | Customizing component appearance from outside |
| **Use Components** | `sui:use-components` | Consuming these components as an end user |

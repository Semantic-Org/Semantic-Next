# Semantic UI Primitive Usage Guide

**Purpose**: Guide for using existing UI primitives when building custom components  
**Audience**: Developers composing custom components from Semantic UI primitives

## Core Philosophy

**Build WITH primitives, not FROM scratch.** Semantic UI is being rebuilt with modern web standards and currently provides core components like button, card, container, icon, input, label, menu, modal, rail, and segment. As more components are completed, custom components should compose these primitives with minimal additional CSS.

## Component Discovery

### Finding Available Primitives

**Check the components directory structure:**

```bash
src/components/
├── button/             # Button component and variants
├── card/               # Card components for content display
├── container/          # Layout container component
├── icon/               # Icon system with 200+ Feather icons
├── input/              # Input fields and form controls  
├── label/              # Label components for UI elements
├── menu/               # Navigation and menu systems
├── modal/              # Modal dialogs and overlays
├── rail/               # Side rail components
├── segment/            # Content segment containers
└── ...                 # More components being added regularly
```

### Component Specification Files

**MANDATORY**: Always check the spec file before using attributes or icons:

```javascript
// Example: src/components/button/specs/button-component.json
{
  "attributes": ["size", "emphasis", "icon", "loading"],
  "sizes": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
  "emphasis": ["primary", "secondary", "positive", "negative"],
  "icons": ["arrow-right", "arrow-left", "download", "upload", ...],
  "variants": ["fluid", "compact", "circular"]
}
```

## Attribute Verification Workflow

### Step-by-Step Verification

1. **Identify the component**: `<ui-button>`, `<ui-input>`, etc.
2. **Find the spec file**: `src/components/{component}/{component}-component.json`
3. **Read available attributes**: Check `attributes`, `sizes`, `emphasis`, `icons` arrays
4. **Use exact values**: Copy precise attribute names and values from spec

```html
<!-- ✅ CORRECT: Verified in ui-button-component.json -->
<ui-button size="large" emphasis="primary" icon="arrow-right">
  Submit Form
</ui-button>

<!-- ❌ WRONG: Unverified attributes -->
<ui-button big primary right-arrow>
  Submit Form
</ui-button>
```

## Flexible Attribute Syntax

### Concise vs Verbose Syntax

**Semantic UI supports multiple attribute patterns:**

```html
<!-- ✅ RECOMMENDED: Concise syntax -->
<ui-button large primary>Submit</ui-button>
<ui-input fluid placeholder="Enter email">
<ui-dropdown search multiple>

<!-- ✅ ACCEPTABLE: Verbose syntax -->
<ui-button size="large" emphasis="primary">Submit</ui-button>
<ui-input fluid="true" placeholder="Enter email">
<ui-dropdown search="true" multiple="true">

<!-- ✅ ACCEPTABLE: Class-based syntax -->
<ui-button class="large primary">Submit</ui-button>
```

### Fuzzy Attribute Matching

**The system supports flexible icon and value syntax:**

```html
<!-- All equivalent - system normalizes to "arrow-right" -->
<ui-button icon="arrow-right">Next</ui-button>
<ui-button icon="right arrow">Next</ui-button>
<ui-button icon="right-arrow">Next</ui-button>

<!-- All equivalent - system normalizes to "chevron-down" -->
<ui-dropdown icon="chevron-down">
<ui-dropdown icon="chevron down">
<ui-dropdown icon="down chevron">
```

## Component Composition Patterns

### Layout Composition

**Use semantic HTML structure with UI primitives:**

```html
<!-- ✅ Dashboard composition -->
<div class="dashboard">
  <div class="sidebar">
    <ui-menu vertical>
      <ui-menu-item active>Dashboard</ui-menu-item>
      <ui-menu-item>Analytics</ui-menu-item>
      <ui-menu-item>Settings</ui-menu-item>
    </ui-menu>
  </div>
  
  <div class="content">
    <div class="header">
      <h1 class="title">Dashboard</h1>
      <div class="actions">
        <ui-button icon="refresh">Refresh</ui-button>
        <ui-button primary icon="plus">Add Item</ui-button>
      </div>
    </div>
    
    <div class="widgets">
      <ui-card>
        <ui-card-content>
          <ui-statistic>
            <ui-statistic-value>2,204</ui-statistic-value>
            <ui-statistic-label>Total Users</ui-statistic-label>
          </ui-statistic>
        </ui-card-content>
      </ui-card>
    </div>
  </div>
</div>
```

### Form Composition

**Combine form primitives with semantic structure:**

```html
<!-- ✅ Settings form composition -->
<form class="settings-form">
  <ui-segment>
    <h3 class="section-title">Account Settings</h3>
    
    <div class="fields">
      <ui-field>
        <label>Display Name</label>
        <ui-input placeholder="Enter your name" value="John Doe">
      </ui-field>
      
      <ui-field>
        <label>Email Notifications</label>
        <ui-checkbox checked>Receive email updates</ui-checkbox>
      </ui-field>
      
      <ui-field>
        <label>Theme Preference</label>
        <ui-dropdown selection>
          <ui-dropdown-item value="auto">Auto</ui-dropdown-item>
          <ui-dropdown-item value="light">Light</ui-dropdown-item>
          <ui-dropdown-item value="dark">Dark</ui-dropdown-item>
        </ui-dropdown>
      </ui-field>
    </div>
    
    <div class="actions">
      <ui-button>Cancel</ui-button>
      <ui-button primary>Save Changes</ui-button>
    </div>
  </ui-segment>
</form>
```

## Component Styling Integration

### Using Design Tokens with Primitives

**Style containers while letting primitives handle their own styling:**

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing);
  min-height: 100vh;
  
  .sidebar {
    background: var(--standard-5);
    padding: var(--spacing);
  }
  
  .content {
    background: var(--page-background);
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing);
      border-bottom: 1px solid var(--standard-15);
      
      .title {
        font-size: var(--h2);
        font-weight: var(--bold);
        margin: 0;
      }
      
      .actions {
        display: flex;
        gap: var(--compact-spacing);
      }
    }
  }
}
```

### Component Customization

**Use CSS custom properties for primitive customization:**

```css
/* Customize primitives through CSS custom properties */
ui-button {
  --button-padding: var(--12px) var(--16px);
  --button-border-radius: var(--large-border-radius);
}

ui-card {
  --card-max-width: 400px;
  --card-shadow: var(--floating-shadow);
}

/* Container-specific overrides */
.compact-layout ui-button {
  --button-padding: var(--6px) var(--8px);
}
```

## Interactive Component Patterns

### Event Handling

**Handle component events and coordinate behavior:**

```javascript
// Component interaction coordination
class DashboardComponent extends WebComponent {
  connectedCallback() {
    super.connectedCallback();
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    // Handle menu navigation
    this.$.navigationMenu.addEventListener('item-selected', (event) => {
      this.navigateToSection(event.detail.value);
    });
    
    // Handle form submissions
    this.$.settingsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.saveSettings();
    });
    
    // Handle modal interactions
    this.$.addItemButton.addEventListener('click', () => {
      this.$.addItemModal.show();
    });
  }
  
  navigateToSection(section) {
    // Update content area
    this.currentSection = section;
    this.requestUpdate();
  }
}
```

### State Management

**Coordinate primitive states through parent component:**

```javascript
// Coordinate multiple component states
updateFormState(isValid) {
  // Update button states
  this.$.saveButton.disabled = !isValid;
  this.$.saveButton.loading = this.isSaving;
  
  // Update field states
  this.$.emailField.error = !this.isEmailValid;
  this.$.passwordField.error = !this.isPasswordValid;
}

handleAsyncOperation = async () => {
  // Show loading states
  this.$.submitButton.loading = true;
  this.$.form.disabled = true;
  
  try {
    await this.performOperation();
    this.$.successMessage.show();
  } catch (error) {
    this.$.errorMessage.content = error.message;
    this.$.errorMessage.show();
  } finally {
    // Reset loading states
    this.$.submitButton.loading = false;
    this.$.form.disabled = false;
  }
};
```

## Responsive Component Layouts

### Container Query Integration

**Make component layouts responsive using container queries:**

```css
.dashboard {
  container: dashboard / inline-size;
}

/* Responsive layout adjustments */
@container dashboard (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    
    .sidebar {
      order: 2;
      padding: var(--compact-spacing);
    }
    
    .content .header {
      flex-direction: column;
      gap: var(--compact-spacing);
    }
  }
}

@container dashboard (max-width: 480px) {
  .dashboard .header .actions {
    width: 100%;
    justify-content: stretch;
    
    ui-button {
      flex: 1;
    }
  }
}
```

## Cross-References

**Related guides:**
- **HTML structure**: See `ai/guides/html/style-guide.md` for semantic markup patterns
- **CSS architecture**: See `ai/guides/styling/css-guide.md` for styling and nesting patterns  
- **Design tokens**: See `ai/guides/styling/tokens/token-usage.md` for token usage and verification

## Best Practices Summary

### ✅ DO
1. **Always verify attributes in component spec files**
2. **Use concise attribute syntax when possible**
3. **Compose layouts with semantic HTML + UI primitives**
4. **Style containers, let primitives handle their own styling**
5. **Coordinate primitive states through parent components**

### ❌ DON'T
1. **Assume attributes exist without checking spec files**
2. **Override primitive internal styling unnecessarily**
3. **Recreate functionality that primitives already provide**
4. **Use hardcoded values when design tokens exist**
5. **Build complex components from scratch when primitives can be composed**

## Common Component Combinations

### Data Display

```html
<!-- Stats dashboard -->
<ui-grid columns="three">
  <ui-card>
    <ui-statistic color="blue">
      <ui-statistic-value>2,204</ui-statistic-value>
      <ui-statistic-label>Users</ui-statistic-label>
    </ui-statistic>
  </ui-card>
  <!-- Additional cards... -->
</ui-grid>
```

### Navigation Patterns

```html
<!-- Breadcrumb navigation -->
<ui-breadcrumb>
  <ui-breadcrumb-section>Home</ui-breadcrumb-section>
  <ui-breadcrumb-divider>/</ui-breadcrumb-divider>
  <ui-breadcrumb-section>Products</ui-breadcrumb-section>
  <ui-breadcrumb-divider>/</ui-breadcrumb-divider>
  <ui-breadcrumb-section active>Laptops</ui-breadcrumb-section>
</ui-breadcrumb>
```

### Content Organization

```html
<!-- Tabbed content -->
<ui-tab-menu>
  <ui-tab-menu-item active data-tab="overview">Overview</ui-tab-menu-item>
  <ui-tab-menu-item data-tab="details">Details</ui-tab-menu-item>
  <ui-tab-menu-item data-tab="reviews">Reviews</ui-tab-menu-item>
</ui-tab-menu>

<ui-tab-content active data-tab="overview">
  <ui-segment>
    <!-- Overview content -->
  </ui-segment>
</ui-tab-content>
```

This guide ensures you leverage the full power of Semantic UI's primitive components while building maintainable, consistent, and accessible custom components.
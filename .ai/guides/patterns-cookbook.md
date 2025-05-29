# Semantic UI Patterns Cookbook

> **For:** AI agents implementing complex component patterns and best practices  
> **Prerequisites:** [Mental Model](../foundations/mental-model.md) and [Component Generation](../guides/component-generation-instructions.md)  
> **Related:** [Quick Reference](../foundations/quick-reference.md) • [HTML/CSS Guide](../guides/html-css-style-guide.md)  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## Table of Contents

- [Component Communication Patterns](#component-communication-patterns)
- [State Management Patterns](#state-management-patterns)
- [Event Handling Patterns](#event-handling-patterns)
- [Template Patterns](#template-patterns)
- [Reactivity Patterns](#reactivity-patterns)
- [Performance Patterns](#performance-patterns)
- [Architecture Patterns](#architecture-patterns)
- [Common Recipes](#common-recipes)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Migration Patterns](#migration-patterns)

---

## Query Library Patterns

### Component Configuration Patterns

#### .initialize() Pattern (Before DOM Insertion)

**Use when**: Component needs non-serializable settings or complex configuration before being added to DOM

```javascript
// Pattern: Pre-configure component with complex settings
function createAdvancedDataTable(containerId, config) {
  const container = $(`#${containerId}`);
  
  // Create component markup
  container.html('<ui-data-table></ui-data-table>');
  
  // Initialize with complex settings before it's processed
  container.find('ui-data-table').initialize({
    // Function settings (not serializable to attributes)
    dataProvider: config.getDataProvider(),
    itemRenderer: (item, index) => config.renderItem(item, index),
    onSelectionChange: (selected) => config.onSelect(selected),
    
    // Complex object settings
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'date', label: 'Date', formatter: config.dateFormatter },
      { key: 'status', label: 'Status', renderer: config.statusRenderer }
    ],
    
    // Dynamic arrays from JavaScript
    allowedActions: config.getActions(),
    validationRules: config.getValidationSchema(),
    
    // Theme configuration
    theme: {
      headerStyle: config.theme.header,
      rowStyle: config.theme.row,
      colors: config.theme.palette
    }
  });
}

// Pattern: Dynamic component creation with initialization
function addConfigurableComponent(parentSelector, componentType, settings) {
  const parent = $(parentSelector);
  const componentId = `component-${Date.now()}`;
  
  // Add component to DOM
  parent.append(`<${componentType} id="${componentId}"></${componentType}>`);
  
  // Initialize with settings that can't be attributes
  $(`#${componentId}`).initialize(settings);
  
  return componentId;
}
```

#### .settings() Pattern (After DOM Insertion)

**Use when**: Component is already in DOM and needs runtime configuration updates

```javascript
// Pattern: Runtime configuration updates
function updateComponentConfiguration(selector, newConfig) {
  $(selector).settings({
    // Update callback functions
    onDataChange: newConfig.dataChangeHandler,
    onError: (error) => newConfig.handleError(error),
    
    // Update complex data structures
    filterCriteria: newConfig.getFilters(),
    sortOptions: newConfig.getSortOptions(),
    
    // Update validation
    validationRules: {
      required: newConfig.requiredFields,
      custom: newConfig.customValidators
    }
  });
}

// Pattern: Conditional settings based on user permissions
function configureComponentForUser(selector, user) {
  const settings = {
    readOnly: !user.canEdit,
    availableActions: user.getAllowedActions(),
    dataFilters: user.getDataFilters(),
    onAction: (action) => user.canPerform(action) ? executeAction(action) : showError()
  };
  
  $(selector).settings(settings);
}

// Pattern: Settings inheritance and override
function setupComponentHierarchy(parentSelector, childComponents) {
  const baseSettings = $(parentSelector).dataContext().settings;
  
  childComponents.forEach(child => {
    $(child.selector).settings({
      // Inherit from parent
      theme: baseSettings.theme,
      locale: baseSettings.locale,
      
      // Override specific settings
      ...child.overrides,
      
      // Add child-specific functionality
      onAction: (action) => {
        child.handleAction(action);
        // Notify parent
        $(parentSelector).getComponent().childActionPerformed(child.id, action);
      }
    });
  });
}
```

#### .component() Pattern (Template Access)

**Use when**: Need direct access to component's template instance and methods

```javascript
// Pattern: Direct component manipulation
function controlComponent(selector) {
  const template = $(selector).component();
  
  // Call template methods directly
  template.openPanel();
  template.selectItem(itemId);
  template.validateForm();
  
  // Access template state
  const currentValue = template.state.selectedValue.get();
  template.state.isLoading.set(true);
  
  // Access template instance properties
  const hasErrors = template.hasValidationErrors();
  const isReady = template.isInitialized();
  
  return {
    getValue: () => template.getCurrentValue(),
    setValue: (value) => template.updateValue(value),
    reset: () => template.resetToDefaults(),
    validate: () => template.performValidation()
  };
}

// Pattern: Component orchestration
function orchestrateComponents(components) {
  const controllers = components.map(selector => {
    const template = $(selector).component();
    return {
      selector,
      template,
      isValid: () => template.validate(),
      getData: () => template.getData(),
      reset: () => template.reset()
    };
  });
  
  return {
    validateAll: () => controllers.every(c => c.isValid()),
    collectData: () => controllers.reduce((data, c) => ({
      ...data,
      [c.selector]: c.getData()
    }), {}),
    resetAll: () => controllers.forEach(c => c.reset())
  };
}
```

#### .dataContext() Pattern (Context Inspection)

**Use when**: Need to inspect or debug component's internal state and data context

```javascript
// Pattern: Component debugging and inspection
function debugComponent(selector) {
  const context = $(selector).dataContext();
  
  console.group(`Component Debug: ${selector}`);
  console.log('Current State:', context.state);
  console.log('Settings:', context.settings);
  console.log('Available Methods:', Object.keys(context.self));
  console.log('Element:', context.el);
  
  // Inspect reactive state
  Object.keys(context.state).forEach(key => {
    const signal = context.state[key];
    console.log(`State.${key}:`, signal.get());
  });
  
  // Inspect settings
  Object.keys(context.settings).forEach(key => {
    console.log(`Settings.${key}:`, context.settings[key]);
  });
  
  console.groupEnd();
  
  return context;
}

// Pattern: Dynamic component analysis
function analyzeComponentCapabilities(selector) {
  const context = $(selector).dataContext();
  
  return {
    // Available methods
    methods: Object.keys(context.self).filter(key => 
      typeof context.self[key] === 'function'
    ),
    
    // Current state values
    stateSnapshot: Object.keys(context.state).reduce((snapshot, key) => {
      snapshot[key] = context.state[key].get();
      return snapshot;
    }, {}),
    
    // Settings configuration
    settings: { ...context.settings },
    
    // Component metadata
    tagName: context.el.tagName.toLowerCase(),
    isConnected: context.el.isConnected,
    hasChildren: context.el.children.length > 0
  };
}

// Pattern: Live component monitoring
function monitorComponent(selector, onUpdate) {
  const context = $(selector).dataContext();
  
  // Monitor state changes
  Object.keys(context.state).forEach(key => {
    context.reaction(() => {
      const value = context.state[key].get();
      onUpdate({
        type: 'state',
        key,
        value,
        timestamp: Date.now()
      });
    });
  });
  
  // Monitor settings changes (if reactive)
  Object.keys(context.settings).forEach(key => {
    try {
      context.reaction(() => {
        const value = context.settings[key];
        onUpdate({
          type: 'settings',
          key,
          value,
          timestamp: Date.now()
        });
      });
    } catch (e) {
      // Setting not reactive
    }
  });
}
```

### Programmatic Component Patterns

#### Component Factory Pattern

```javascript
// Pattern: Component factory with pre-configuration
class ComponentFactory {
  static createConfiguredComponent(type, config) {
    const componentId = `${type}-${Date.now()}`;
    const element = document.createElement(type);
    element.id = componentId;
    
    // Pre-configure before adding to DOM
    $(element).initialize(config.settings);
    
    // Add to configured parent
    $(config.parent).append(element);
    
    // Apply additional configuration
    if (config.styles) {
      $(element).css(config.styles);
    }
    
    if (config.classes) {
      $(element).addClass(config.classes);
    }
    
    // Return controller interface
    return {
      id: componentId,
      element,
      component: () => $(element).component(),
      settings: (newSettings) => $(element).settings(newSettings),
      remove: () => $(element).remove()
    };
  }
  
  static createDataBoundComponent(type, dataSource, config = {}) {
    return this.createConfiguredComponent(type, {
      ...config,
      settings: {
        ...config.settings,
        dataProvider: () => dataSource.getData(),
        onDataChange: (data) => dataSource.updateData(data),
        onError: (error) => dataSource.handleError(error)
      }
    });
  }
}

// Usage
const dropdown = ComponentFactory.createConfiguredComponent('ui-dropdown', {
  parent: '#container',
  settings: {
    items: getDropdownItems(),
    onSelect: handleSelection,
    filterFunction: customFilter
  },
  classes: 'fluid search',
  styles: { width: '100%' }
});
```

#### Batch Component Configuration Pattern

```javascript
// Pattern: Configure multiple components with shared settings
function configureDashboardComponents(config) {
  const components = [
    'ui-chart[data-type="sales"]',
    'ui-chart[data-type="traffic"]', 
    'ui-chart[data-type="conversions"]'
  ];
  
  // Apply shared configuration
  const sharedSettings = {
    theme: config.theme,
    animations: config.animations,
    onError: config.errorHandler,
    locale: config.locale
  };
  
  components.forEach(selector => {
    $(selector).settings(sharedSettings);
  });
  
  // Apply component-specific settings
  $('ui-chart[data-type="sales"]').settings({
    dataProvider: config.salesDataProvider,
    refreshInterval: 60000,
    alerts: config.salesAlerts
  });
  
  $('ui-chart[data-type="traffic"]').settings({
    dataProvider: config.trafficDataProvider,
    refreshInterval: 30000,
    realTime: true
  });
  
  $('ui-chart[data-type="conversions"]').settings({
    dataProvider: config.conversionsDataProvider,
    refreshInterval: 300000,
    historicalData: true
  });
}
```

#### Template-as-Settings Pattern ⭐ **FUNDAMENTAL**

**The preferred pattern for building flexible components with user-configurable rendering**

```javascript
// Define custom template components
// user-row.js
export const UserRowTemplate = defineComponent({
  template: `
    <tr class="user-row">
      <td><img src="{avatar}" alt="{name}" /></td>
      <td>{name}</td>
      <td>{email}</td>
      <td><span class="role {role.toLowerCase()}">{role}</span></td>
    </tr>
  `,
  css: `
    .user-row img { width: 32px; height: 32px; border-radius: 50%; }
    .role.admin { background: #e74c3c; color: white; }
    .role.user { background: #3498db; color: white; }
  `
});

// admin-row.js  
export const AdminRowTemplate = defineComponent({
  template: `
    <tr class="admin-row">
      <td>{name}</td>
      <td>
        {#each permission in permissions}
          <span class="permission">{permission}</span>
        {/each}
      </td>
      <td>{formatDate lastLogin 'MMM DD, YYYY'}</td>
    </tr>
  `,
  css: `
    .admin-row .permission { 
      background: #2ecc71; 
      color: white; 
      padding: 2px 6px; 
      margin: 0 2px; 
      border-radius: 3px; 
    }
  `
});

// Parent component using template-as-settings
const defaultSettings = {
  rowTemplate: new Template(),  // `new Template()` here acts as a placeholder in defaultSettings,
                               // indicating that `rowTemplate` is expected to be a `Template` instance.
                               // This placeholder would typically be overridden at runtime with a specific
                               // `Template` instance, often one returned by `defineComponent` (when called
                               // without a `tagName`).
  emptyTemplate: new Template(),
  headers: [],
  rows: []
};

// Component template uses the settings
// Template: 
// {#each rows as row}
//   {>template name=rowTemplate data=row}
// {else}
//   {>template name=emptyTemplate}
// {/each}

// Runtime configuration
function setupUserTable() {
  $('dynamic-table').settings({
    headers: ['Avatar', 'Name', 'Email', 'Role'],
    rowTemplate: UserRowTemplate,
    emptyTemplate: UserEmptyTemplate,
    rows: userData
  });
}

function setupAdminTable() {
  $('dynamic-table').settings({
    headers: ['Name', 'Permissions', 'Last Login'],
    rowTemplate: AdminRowTemplate,  // Completely different rendering
    emptyTemplate: AdminEmptyTemplate,
    rows: adminData
  });
}
```

**Advanced Template-as-Settings Patterns**:

```javascript
// Pattern: Context-aware template selection
function configureDataView(viewType, userRole) {
  const templateMap = {
    'user-summary': {
      template: UserSummaryTemplate,
      headers: ['Name', 'Email', 'Status']
    },
    'user-detailed': {
      template: UserDetailedTemplate,
      headers: ['Avatar', 'Full Name', 'Contact', 'Role', 'Last Active']
    },
    'admin-audit': {
      template: AdminAuditTemplate,
      headers: ['User', 'Action', 'Resource', 'Timestamp', 'IP']
    }
  };
  
  const config = templateMap[`${userRole}-${viewType}`] || templateMap['user-summary'];
  
  $('data-view').settings({
    itemTemplate: config.template,
    headers: config.headers,
    emptyTemplate: getEmptyTemplate(viewType)
  });
}

// Pattern: Conditional template rendering based on data
const smartItemTemplate = defineComponent({
  template: `
    {#if type === 'user'}
      {>template name=userTemplate data=this}
    {else if type === 'product'}
      {>template name=productTemplate data=this}
    {else if type === 'order'}
      {>template name=orderTemplate data=this}
    {else}
      {>template name=genericTemplate data=this}
    {/if}
  `,
  
  createComponent: ({ settings }) => ({
    userTemplate: settings.userTemplate,
    productTemplate: settings.productTemplate,
    orderTemplate: settings.orderTemplate,
    genericTemplate: settings.genericTemplate
  })
});

// Usage with multiple sub-templates
$('mixed-list').settings({
  itemTemplate: smartItemTemplate,
  userTemplate: UserCardTemplate,
  productTemplate: ProductCardTemplate,
  orderTemplate: OrderCardTemplate,
  genericTemplate: DefaultCardTemplate
});

// Pattern: Template factory for dynamic generation
class TemplateFactory {
  static createFieldTemplate(fieldType, config) {
    const templates = {
      text: () => defineComponent({
        template: `<input type="text" value="{value}" placeholder="{placeholder}" />`,
        css: config.textFieldStyles
      }),
      
      select: () => defineComponent({
        template: `
          <select value="{value}">
            {#each option in options}
              <option value="{option.value}">{option.label}</option>
            {/each}
          </select>
        `,
        css: config.selectFieldStyles
      }),
      
      multiselect: () => defineComponent({
        template: `
          <div class="multiselect">
            {#each option in options}
              <label>
                <input type="checkbox" value="{option.value}" checked="{isSelected option.value}" />
                {option.label}
              </label>
            {/each}
          </div>
        `,
        createComponent: ({ state }) => ({
          isSelected: (value) => state.selectedValues.get().includes(value)
        })
      })
    };
    
    return templates[fieldType]?.() || templates.text();
  }
}

// Usage with template factory
function setupDynamicForm(formConfig) {
  const fieldTemplates = {};
  
  formConfig.fields.forEach(field => {
    fieldTemplates[`${field.name}Template`] = TemplateFactory.createFieldTemplate(
      field.type, 
      formConfig.styling
    );
  });
  
  $('dynamic-form').settings({
    formTemplate: DynamicFormTemplate,
    fields: formConfig.fields,
    ...fieldTemplates
  });
}
```

**Why Template-as-Settings is Fundamental**:

1. **Maximum Flexibility**: Users can completely customize rendering without modifying core component
2. **Type Safety**: Template components are actual JavaScript modules with proper imports
3. **Reusability**: Templates can be shared across multiple component instances
4. **Performance**: Templates are compiled once and reused
5. **Maintainability**: Clear separation between data logic and presentation logic
6. **Testability**: Templates can be tested independently

**Common Use Cases**:
- **Data Tables**: Row templates, cell templates, header templates, empty state templates
- **Lists**: Item templates, group header templates, loading templates
- **Cards**: Content templates based on card type, action templates
- **Forms**: Field templates based on field type, validation message templates
- **Modals**: Content templates, header templates, footer templates
- **Menus**: Item templates, separator templates, group templates

---

## Component Communication Patterns

### Parent-Child Communication Decision Tree

```
Child needs to communicate with Parent:
├── One-way notification (child → parent) → Use dispatchEvent()
│   ├── Examples: panel toggled, button clicked, field validated
│   ├── Benefits: Web standards, decoupled, available to users
│   └── Pattern: child.dispatchEvent('eventname', data)
│
├── Accessing parent data/methods → Use findParent()
│   ├── Examples: get shared state, call parent utility methods
│   ├── Benefits: Direct access, type safety, immediate
│   └── Pattern: findParent('parent-tag').method()
│
└── Bi-directional data binding → Combination approach
    ├── Parent exposes signals for direct access
    ├── Child dispatches events for notifications
    └── Use both patterns as appropriate
```

### Child → Parent Notification Pattern (dispatchEvent)

**Use when**: Child needs to notify parent of state changes, user interactions, or events

```javascript
// Child component (ui-accordion-panel)
const createComponent = ({ dispatchEvent, state }) => ({
  toggle() {
    const wasOpen = state.isOpen.get();
    state.isOpen.toggle();
    
    // Notify parent and any listeners
    dispatchEvent('toggle', {
      panelId: this.id,
      isOpen: state.isOpen.get(),
      wasOpen
    });
  },
  
  onContentLoad() {
    dispatchEvent('contentloaded', {
      panelId: this.id,
      contentHeight: this.getContentHeight()
    });
  }
});

// Parent component (ui-accordion) listens via events
const events = {
  'deep toggle ui-accordion-panel': ({ data, self }) => {
    if (self.settings.exclusive && data.isOpen) {
      self.closeOtherPanels(data.panelId);
    }
    
    // Also dispatch to external listeners
    self.dispatchEvent('paneltoggle', data);
  }
};
```

### Child → Parent Data Access Pattern (findParent)

**Use when**: Child needs to access parent data, call parent methods, or get shared configuration

```javascript
// Child component (ui-button) accessing parent (ui-button-group)
const createComponent = ({ findParent, state }) => ({
  updateSelection() {
    const group = findParent('ui-button-group');
    const mode = group.getSelectionMode();    // Get parent config
    const selected = group.getSelected();     // Get parent state
    
    if (mode === 'single') {
      group.clearOtherSelections(this.id);   // Call parent method
    }
    
    // Still notify via event for external listeners
    this.dispatchEvent('selected', { buttonId: this.id });
  },
  
  getTheme() {
    // Access parent's theme configuration
    return findParent('ui-button-group').theme;
  }
});
```

### Bi-directional Communication Pattern

**Use when**: Parent and child need to share state and coordinate behavior

```javascript
// Parent (ui-form) exposes signals and listens to events
const createComponent = ({ signal }) => ({
  formData: signal({}),           // Exposed for children
  errors: signal({}),
  
  updateField(name, value) {
    this.formData.setProperty(name, value);
  },
  
  setFieldError(name, error) {
    this.errors.setProperty(name, error);
  }
});

const events = {
  // Listen to child field changes
  'deep valuechange ui-form-field': ({ data, self }) => {
    self.updateField(data.fieldName, data.value);
    self.validateField(data.fieldName);
  },
  
  // Listen to child validation events
  'deep validation ui-form-field': ({ data, self }) => {
    self.setFieldError(data.fieldName, data.error);
  }
};

// Child (ui-form-field) accesses parent data and dispatches events
const createComponent = ({ findParent, dispatchEvent, state }) => ({
  onValueChange(newValue) {
    state.value.set(newValue);
    
    // Notify parent via event (web standards compliant)
    dispatchEvent('valuechange', {
      fieldName: this.name,
      value: newValue,
      oldValue: state.previousValue.get()
    });
  },
  
  getFormData() {
    // Access parent's shared state directly
    return findParent('ui-form').formData.get();
  },
  
  validate() {
    const isValid = this.runValidation();
    
    // Notify parent of validation result
    dispatchEvent('validation', {
      fieldName: this.name,
      isValid,
      error: isValid ? null : this.getValidationError()
    });
  }
});
```

---

## State Management Patterns

### Local Component State Pattern

**Use when**: State is only relevant to the individual component

```javascript
const defaultState = {
  isExpanded: false,
  animation: 'none',
  contentHeight: 0
};

const createComponent = ({ state }) => ({
  toggle() {
    state.isExpanded.toggle();
    state.animation.set('expanding');
  },
  
  onAnimationComplete() {
    state.animation.set('none');
  }
});
```

### Shared Parent-Child State Pattern

**Use when**: Multiple related components need to coordinate state

```javascript
// Parent exposes shared signals
const createComponent = ({ signal }) => ({
  selectedItems: signal(new Set()),
  selectionMode: signal('multiple'),
  
  toggleSelection(itemId) {
    const selected = this.selectedItems.get();
    if (selected.has(itemId)) {
      selected.delete(itemId);
    } else {
      if (this.selectionMode.get() === 'single') {
        selected.clear();
      }
      selected.add(itemId);
    }
    this.selectedItems.set(new Set(selected));
  }
});

// Children access parent's shared state
const createComponent = ({ findParent, reaction, state }) => ({
  onCreated() {
    const parent = findParent('item-list');
    
    reaction(() => {
      const isSelected = parent.selectedItems.get().has(this.id);
      state.selected.set(isSelected);
    });
  }
});
```

### Settings-Driven State Pattern

**Use when**: Component behavior changes based on configuration

```javascript
const defaultSettings = {
  mode: 'single',
  autoClose: true,
  duration: 300
};

const defaultState = {
  activeItems: []
};

const createComponent = ({ settings, state, reaction }) => ({
  onCreated() {
    // React to settings changes
    reaction(() => {
      if (settings.mode === 'single' && state.activeItems.get().length > 1) {
        // Auto-adjust state when settings change
        const firstItem = state.activeItems.get()[0];
        state.activeItems.set([firstItem]);
      }
    });
  },
  
  addActiveItem(item) {
    const current = state.activeItems.get();
    if (settings.mode === 'single') {
      state.activeItems.set([item]);
    } else {
      state.activeItems.set([...current, item]);
    }
  }
});
```

### Cross-Component State Synchronization Pattern

**Use when**: Distant components need to share state through a common ancestor

```javascript
// Top-level data provider
const createComponent = ({ signal }) => ({
  globalSelection: signal(new Set()),
  currentUser: signal(null),
  theme: signal('light'),
  
  updateSelection(items) {
    this.globalSelection.set(new Set(items));
  }
});

// Descendant components access shared state
const createComponent = ({ findParent, reaction }) => ({
  onCreated() {
    const app = findParent('app-shell');
    
    reaction(() => {
      const selected = app.globalSelection.get();
      this.updateUI(selected.has(this.itemId));
    });
  },
  
  selectItem() {
    const app = findParent('app-shell');
    const selection = new Set(app.globalSelection.get());
    selection.add(this.itemId);
    app.updateSelection(Array.from(selection));
  }
});
```

---

## Event Handling Patterns

### Event Delegation Pattern (Standard)

**Use when**: Handling events within your component's template

```javascript
const events = {
  // Handles all buttons, even dynamically added ones
  'click .action-button': ({ target, data, self }) => {
    const action = data.action;
    const itemId = data.itemId;
    self.performAction(action, itemId);
  },
  
  // Multiple event types on same elements
  'mouseenter, mouseleave .hover-item': ({ event, target, state }) => {
    const isEnter = event.type === 'mouseenter';
    state.hoveredItem.set(isEnter ? target.dataset.itemId : null);
  }
};
```

### Global Event Pattern

**Use when**: Responding to page-level events outside your component

```javascript
const events = {
  'global scroll window': ({ self }) => {
    self.updateScrollPosition();
  },
  
  'global resize window': ({ self, afterFlush }) => {
    self.recalculateLayout();
    afterFlush(() => {
      self.adjustChildPositions();
    });
  },
  
  'global keydown document': ({ event, self }) => {
    if (event.key === 'Escape' && self.isModalOpen()) {
      self.closeModal();
      event.preventDefault();
    }
  },
  
  'global hashchange window': ({ self }) => {
    self.syncWithURLHash();
  }
};
```

### Deep Event Pattern (Parent-Child Components)

**Use when**: Parent component managing intentional child components

```javascript
// Accordion managing panels
const events = {
  'deep toggle ui-accordion-panel': ({ data, self }) => {
    if (self.settings.exclusive && data.isOpen) {
      self.closeOtherPanels(data.panelId);
    }
    self.updateActiveCount();
  },
  
  'deep contentchange ui-accordion-panel': ({ data, self }) => {
    self.adjustPanelHeight(data.panelId, data.newHeight);
  }
};

// Button group managing buttons
const events = {
  'deep click ui-button': ({ target, data, self }) => {
    if (self.settings.selectionMode === 'single') {
      self.clearOtherSelections();
    }
    self.setSelected(data.buttonId, true);
  }
};

// Form managing fields
const events = {
  'deep valuechange ui-form-field': ({ data, self }) => {
    self.setFieldValue(data.fieldName, data.value);
    self.validateField(data.fieldName);
  },
  
  'deep focus ui-form-field': ({ data, self }) => {
    self.setActiveField(data.fieldName);
  }
};
```

### Custom Event Chain Pattern

**Use when**: Creating a chain of custom events through component hierarchy

```javascript
// Child dispatches to parent
const createComponent = ({ dispatchEvent }) => ({
  onUserAction() {
    dispatchEvent('itemaction', {
      action: 'select',
      itemId: this.id,
      timestamp: Date.now()
    });
  }
});

// Parent processes and re-dispatches
const events = {
  'deep itemaction ui-list-item': ({ data, self }) => {
    self.processItemAction(data);
    
    // Re-dispatch for external listeners
    self.dispatchEvent('listchange', {
      type: 'itemaction',
      originalData: data,
      listId: self.id
    });
  }
};

// Grandparent handles final event
const events = {
  'deep listchange ui-list': ({ data, self }) => {
    self.updateGlobalState(data);
    self.logUserActivity(data);
  }
};
```

### Event Data Transformation Pattern

**Use when**: Converting data attributes to strongly typed event data

```html
<button 
  class="quantity-btn" 
  data-action="increment" 
  data-item-id="123" 
  data-amount="5"
  data-allow-negative="false"
>+</button>
```

```javascript
const events = {
  'click .quantity-btn': ({ data, self }) => {
    // data attributes auto-converted to proper types
    const { action, itemId, amount, allowNegative } = data;
    // amount = 5 (number), allowNegative = false (boolean)
    
    self.updateQuantity(itemId, action === 'increment' ? amount : -amount, allowNegative);
  }
};
```

---

## Template Patterns

### Conditional Rendering Pattern

```html
<!-- Progressive loading states -->
{#if loading}
  <div class="loading-spinner">Loading...</div>
{else if error}
  <div class="error-message">
    <h3>Error occurred</h3>
    <p>{error.message}</p>
    <button onclick="{retry}">Retry</button>
  </div>
{else if hasAny data}
  <div class="content">
    {#each item in data}
      <div class="item">{item.name}</div>
    {else}
      <div class="empty">No items to display</div>
    {/each}
  </div>
{else}
  <div class="empty-state">
    <h3>Welcome!</h3>
    <p>Get started by adding some items.</p>
    <button onclick="{showAddDialog}">Add Item</button>
  </div>
{/if}
```

### Dynamic Component Pattern

```html
<!-- Render different components based on data -->
{#each item in items}
  {#if item.type === 'text'}
    {>textComponent data=item}
  {else if item.type === 'image'}
    {>imageComponent data=item}
  {else if item.type === 'video'}
    {>videoComponent data=item}
  {else}
    {>unknownComponent data=item}
  {/if}
{/each}

<!-- Or use dynamic template name -->
{#each item in items}
  {>template name="{item.type}Component" data=item}
{/each}
```

### Snippet Composition Pattern

```html
<!-- Reusable UI patterns -->
{#snippet actionButton variant="primary"}
  <button class="ui button {variant}" onclick="{action}">
    {>slot icon}
    <span class="text">{>slot}</span>
  </button>
{/snippet}

{#snippet statusBadge}
  <span class="badge {status.toLowerCase()}">
    {status}
  </span>
{/snippet}

<!-- Usage in template -->
<div class="item-card">
  <h3>{title}</h3>
  <p>{description}</p>
  
  <div class="item-meta">
    {>statusBadge status=item.status}
    <span class="date">{formatDate item.createdAt}</span>
  </div>
  
  <div class="actions">
    {>actionButton variant="primary" action="{edit}"}
      <i class="edit icon">{>slot icon}</i>
      Edit
    {/actionButton}
    
    {>actionButton variant="secondary" action="{delete}"}
      <i class="trash icon">{>slot icon}</i>
      Delete
    {/actionButton}
  </div>
</div>
```

### Form Pattern with Validation

```html
<form class="ui form {#if errors}has-errors{/if}">
  {#each field in formFields}
    <div class="field {#if errors[field.name]}error{/if}">
      <label>{field.label}</label>
      
      {#if field.type === 'select'}
        <select 
          name="{field.name}" 
          value="{values[field.name]}"
          onchange="{updateField}"
        >
          {#each option in field.options}
            <option value="{option.value}">{option.label}</option>
          {/each}
        </select>
      {else if field.type === 'textarea'}
        <textarea 
          name="{field.name}" 
          value="{values[field.name]}"
          placeholder="{field.placeholder}"
          onchange="{updateField}"
        ></textarea>
      {else}
        <input 
          type="{field.type || 'text'}" 
          name="{field.name}" 
          value="{values[field.name]}"
          placeholder="{field.placeholder}"
          onchange="{updateField}"
        />
      {/if}
      
      {#if errors[field.name]}
        <div class="error-message">{errors[field.name]}</div>
      {/if}
    </div>
  {/each}
  
  <div class="actions">
    <button 
      type="submit" 
      class="ui primary button"
      disabled="{!valid || submitting}"
      onclick="{submit}"
    >
      {#if submitting}Submitting...{else}Submit{/if}
    </button>
    <button type="button" onclick="{reset}">Reset</button>
  </div>
</form>
```

---

## Reactivity Patterns

### Derived State Pattern

```javascript
const createComponent = ({ state, reaction }) => ({
  onCreated() {
    // Computed properties that update automatically
    reaction(() => {
      const items = state.items.get();
      const filter = state.filter.get();
      
      const filtered = items.filter(item => {
        if (filter === 'completed') return item.completed;
        if (filter === 'active') return !item.completed;
        return true;
      });
      
      state.filteredItems.set(filtered);
      state.itemCount.set(filtered.length);
    });
    
    // Validation reaction
    reaction(() => {
      const values = state.formValues.get();
      const errors = this.validate(values);
      state.errors.set(errors);
      state.isValid.set(Object.keys(errors).length === 0);
    });
  }
});
```

### Reactive Settings Pattern

```javascript
const createComponent = ({ settings, state, reaction, $ }) => ({
  onCreated() {
    // React to settings changes
    reaction(() => {
      const theme = settings.theme;
      $(':host').attr('data-theme', theme);
    });
    
    reaction(() => {
      const size = settings.size;
      $(':host').toggleClass('compact', size === 'small');
    });
    
    // Auto-adjust state when settings change
    reaction(() => {
      if (settings.maxItems && state.items.get().length > settings.maxItems) {
        const trimmed = state.items.get().slice(0, settings.maxItems);
        state.items.set(trimmed);
      }
    });
  }
});
```

### External Data Synchronization Pattern

```javascript
const createComponent = ({ state, reaction, settings }) => ({
  onCreated() {
    // Sync with external API
    reaction(() => {
      const query = state.searchQuery.get();
      if (query.length > 2) {
        this.debounceSearch(query);
      }
    });
    
    // Sync with localStorage
    reaction(() => {
      const preferences = state.userPreferences.get();
      if (settings.persistPreferences) {
        localStorage.setItem('preferences', JSON.stringify(preferences));
      }
    });
    
    // Sync with URL
    reaction(() => {
      const filters = state.activeFilters.get();
      const params = new URLSearchParams();
      filters.forEach(filter => params.append('filter', filter));
      window.history.replaceState({}, '', `?${params}`);
    });
  }
});
```

### Performance Optimization Pattern

```javascript
const createComponent = ({ state, reaction, afterFlush }) => ({
  onCreated() {
    // Batch expensive operations
    reaction(() => {
      const items = state.items.get();
      const needsRecalc = state.needsRecalculation.get();
      
      if (needsRecalc) {
        afterFlush(() => {
          this.recalculateLayout();
          this.updatePositions();
          state.needsRecalculation.set(false);
        });
      }
    });
    
    // Debounced reactions
    let timeout;
    reaction(() => {
      const searchTerm = state.searchTerm.get();
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.performSearch(searchTerm);
      }, 300);
    });
  }
});
```

---

## Performance Patterns

### Lazy Loading Pattern

```javascript
const createComponent = ({ state, $, isClient }) => ({
  onRendered() {
    if (!isClient) return;
    
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    $('.lazy-load').each((el) => {
      observer.observe(el);
    });
  },
  
  async loadContent(element) {
    const src = element.dataset.src;
    try {
      const content = await fetch(src).then(r => r.text());
      element.innerHTML = content;
      element.classList.add('loaded');
    } catch (error) {
      element.classList.add('error');
    }
  }
});
```

### Virtual Scrolling Pattern

```javascript
const createComponent = ({ state, reaction, $ }) => ({
  onCreated() {
    reaction(() => {
      const items = state.allItems.get();
      const scrollTop = state.scrollTop.get();
      const containerHeight = state.containerHeight.get();
      const itemHeight = 50; // Fixed height
      
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );
      
      state.visibleItems.set(items.slice(startIndex, endIndex));
      state.offsetY.set(startIndex * itemHeight);
    });
  },
  
  onScroll(event) {
    state.scrollTop.set(event.target.scrollTop);
  }
});
```

### Memory Management Pattern

```javascript
const createComponent = ({ state, reaction }) => ({
  observers: new Set(),
  timers: new Set(),
  
  onCreated() {
    // Track external resources for cleanup
    const observer = new MutationObserver(this.handleMutation);
    this.observers.add(observer);
    
    const timer = setInterval(this.updateTime, 1000);
    this.timers.add(timer);
  },
  
  onDestroyed() {
    // Cleanup external resources
    this.observers.forEach(observer => observer.disconnect());
    this.timers.forEach(timer => clearInterval(timer));
    this.observers.clear();
    this.timers.clear();
  }
});
```

---

## Architecture Patterns

### Component Composition Pattern

```javascript
// Base component
const createBaseComponent = ({ state, settings }) => ({
  // Common functionality
  show() { state.visible.set(true); },
  hide() { state.visible.set(false); },
  toggle() { state.visible.toggle(); }
});

// Extended component
const createComponent = ({ state, settings, ...args }) => ({
  ...createBaseComponent({ state, settings, ...args }),
  
  // Extended functionality
  slideDown() {
    this.show();
    // Add slide animation
  }
});
```

### Plugin Pattern

```javascript
// Core component
const createComponent = ({ state, settings, plugins = [] }) => ({
  // Core functionality
  
  onCreated() {
    // Initialize plugins
    plugins.forEach(plugin => {
      if (plugin.onCreated) {
        plugin.onCreated.call(this);
      }
    });
  }
});

// Plugin definition
const draggablePlugin = {
  onCreated() {
    this.makeDraggable();
  },
  
  makeDraggable() {
    // Add drag functionality
  }
};

// Usage
defineComponent({
  createComponent: ({ ...args }) => createComponent({
    ...args,
    plugins: [draggablePlugin]
  })
});
```

### Factory Pattern

```javascript
// Component factory
const createListComponent = (config) => {
  const defaults = {
    itemComponent: 'ui-list-item',
    selectionMode: 'multiple',
    sortable: false
  };
  
  const settings = { ...defaults, ...config };
  
  return defineComponent({
    defaultSettings: settings,
    
    createComponent: ({ state, settings }) => ({
      addItem(item) {
        state.items.push({
          ...item,
          component: settings.itemComponent
        });
      }
    })
  });
};

// Usage
const todoList = createListComponent({
  itemComponent: 'todo-item',
  selectionMode: 'none',
  sortable: true
});
```

---

## Common Recipes

### Modal Dialog Pattern

```javascript
const defaultState = {
  isOpen: false,
  content: null,
  backdrop: true
};

const createComponent = ({ state, $, dispatchEvent }) => ({
  open(content) {
    state.content.set(content);
    state.isOpen.set(true);
    $('body').addClass('modal-open');
    
    dispatchEvent('modalopen');
  },
  
  close() {
    state.isOpen.set(false);
    $('body').removeClass('modal-open');
    
    dispatchEvent('modalclose');
  }
});

const events = {
  'click .backdrop': ({ self, state }) => {
    if (state.backdrop.get()) {
      self.close();
    }
  },
  
  'global keydown document': ({ event, self, state }) => {
    if (event.key === 'Escape' && state.isOpen.get()) {
      self.close();
    }
  }
};
```

### Drag and Drop Pattern

```javascript
const createComponent = ({ state, $, dispatchEvent }) => ({
  onRendered() {
    this.makeDraggable();
  },
  
  makeDraggable() {
    let dragData = null;
    
    $('.draggable').on('dragstart', (event) => {
      dragData = {
        id: event.target.dataset.id,
        type: event.target.dataset.type
      };
      event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    });
    
    $('.drop-zone').on('dragover', (event) => {
      event.preventDefault();
    });
    
    $('.drop-zone').on('drop', (event) => {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      
      dispatchEvent('itemdropped', {
        item: data,
        dropZone: event.target.dataset.zone
      });
    });
  }
});
```

### Infinite Scroll Pattern

```javascript
const createComponent = ({ state, $, settings }) => ({
  onRendered() {
    const sentinel = $('.scroll-sentinel');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !state.loading.get()) {
        this.loadMore();
      }
    });
    
    observer.observe(sentinel[0]);
  },
  
  async loadMore() {
    if (state.hasMore.get()) {
      state.loading.set(true);
      
      try {
        const newItems = await this.fetchItems(state.page.get());
        state.items.push(...newItems);
        state.page.increment();
        state.hasMore.set(newItems.length === settings.pageSize);
      } finally {
        state.loading.set(false);
      }
    }
  }
});
```

---

## Anti-Patterns to Avoid

### ❌ Direct DOM Manipulation Without Reactivity

```javascript
// DON'T DO THIS
const createComponent = ({ $ }) => ({
  updateCount(count) {
    $('.counter').text(count); // Direct DOM update
  }
});

// DO THIS INSTEAD
const defaultState = { count: 0 };
// Template: <span class="counter">{count}</span>
const createComponent = ({ state }) => ({
  updateCount(count) {
    state.count.set(count); // Reactive update
  }
});
```

### ❌ Global State Instead of Component Tree

```javascript
// DON'T DO THIS
import { globalStore } from './store.js';

const createComponent = () => ({
  getData() {
    return globalStore.data; // Global dependency
  }
});

// DO THIS INSTEAD
const createComponent = ({ findParent }) => ({
  getData() {
    return findParent('data-provider').data.get(); // Component tree
  }
});
```

### ❌ Breaking Event Delegation

```javascript
// DON'T DO THIS
const createComponent = ({ $ }) => ({
  onRendered() {
    $('.dynamic-button').on('click', this.handler); // Won't work for dynamic content
  }
});

// DO THIS INSTEAD
const events = {
  'click .dynamic-button': ({ self }) => self.handler() // Event delegation
};
```

### ❌ Ignoring Lifecycle for Cleanup

```javascript
// DON'T DO THIS
const createComponent = () => ({
  startTimer() {
    setInterval(this.update, 1000); // Never cleaned up
  }
});

// DO THIS INSTEAD
const createComponent = () => ({
  timers: new Set(),
  
  startTimer() {
    const timer = setInterval(this.update, 1000);
    this.timers.add(timer);
  },
  
  onDestroyed() {
    this.timers.forEach(timer => clearInterval(timer));
  }
});
```

### ❌ Mixing Reactive and Non-Reactive Patterns

```javascript
// DON'T DO THIS
const createComponent = ({ state }) => ({
  updateData(data) {
    state.items.value.push(data); // Mutating without reactivity
    this.rerenderManually();
  }
});

// DO THIS INSTEAD
const createComponent = ({ state }) => ({
  updateData(data) {
    state.items.push(data); // Reactive mutation
  }
});
```

### ❌ Overusing Deep Events

```javascript
// DON'T DO THIS
const events = {
  'deep click random-component': () => {} // Unrelated components
};

// DO THIS INSTEAD
const events = {
  'deep click ui-button': () => {}  // Intentional parent-child relationship
};
```

---

## Migration Patterns

### From jQuery to Semantic UI

```javascript
// jQuery pattern
$('.button').on('click', function() {
  $(this).addClass('active');
  $('#counter').text(parseInt($('#counter').text()) + 1);
});

// Semantic UI pattern
const defaultState = { counter: 0 };

const events = {
  'click .button': ({ target, state, $ }) => {
    $(target).addClass('active');
    state.counter.increment();
  }
};

// Template: <span id="counter">{counter}</span>
```

### From React to Semantic UI

```javascript
// React pattern
const [count, setCount] = useState(0);
const [items, setItems] = useState([]);

const addItem = (item) => {
  setItems(prev => [...prev, item]);
  setCount(prev => prev + 1);
};

// Semantic UI pattern
const defaultState = {
  count: 0,
  items: []
};

const createComponent = ({ state }) => ({
  addItem(item) {
    state.items.push(item);
    state.count.increment();
  }
});
```

### From Vue to Semantic UI

```javascript
// Vue pattern
export default {
  data() {
    return { message: 'Hello' };
  },
  computed: {
    reversed() {
      return this.message.split('').reverse().join('');
    }
  }
};

// Semantic UI pattern
const defaultState = { message: 'Hello' };

const createComponent = ({ state, reaction }) => ({
  onCreated() {
    reaction(() => {
      const reversed = state.message.get().split('').reverse().join('');
      state.reversed.set(reversed);
    });
  }
});
```

---

**Source References:**
- Component Examples: `/docs/src/examples/`
- Event Documentation: `/docs/src/pages/components/events.mdx`
- API Documentation: `/docs/src/pages/api/`
- Implementation: `/packages/`
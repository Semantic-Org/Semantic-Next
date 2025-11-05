# PrimeReact Listbox Component - Usage Patterns Research

**Research Date:** 2025-11-05
**Component:** Listbox
**Framework:** PrimeReact
**Version Researched:** 10.9.7+ (current)
**Documentation:** https://primereact.org/listbox/

---

## 1. Component Overview

The **Listbox** component is PrimeReact's form-focused selection input that enables users to select one or multiple items from a list. Unlike the Menu component (which is for navigation/commands), the Listbox is designed as a **form control** for capturing user selections and binding selected values to application state.

**Key Characteristics:**
- **Primary Purpose:** Form input for single/multiple selection
- **Selection Focus:** Emphasis on capturing selected values, not executing commands
- **Data-Driven:** Accepts an `options` array with flexible data binding
- **Controlled Component:** Uses `value` and `onChange` pattern
- **Rich Customization:** Supports templates, filtering, grouping, and virtual scrolling
- **Accessibility:** Full WAI-ARIA ListBox pattern compliance
- **Performance:** Virtual scrolling for large datasets

**Architectural Position:**
- **Form Input** (not navigation tool)
- **Replaces** `<select>` elements in forms
- **Sibling Components:** Select (unstyled alternative), Dropdown (similar with search), MultiSelect
- **ARIA Role:** `role="listbox"` (not `role="menu"`)

---

## 2. Selection Capabilities

### 2.1 Single Selection (Default)

Single selection is the default mode where only one item can be selected at a time:

```javascript
import { Listbox } from 'primereact/listbox';
import { useState } from 'react';

export default function SingleSelectionDemo() {
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Tokyo', code: 'TYO' }
  ];

  return (
    <Listbox
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      options={cities}
      optionLabel="name"
      placeholder="Select a city"
    />
  );
}
```

**Key Props:**
- `value`: Currently selected item (single object or primitive)
- `onChange`: Fired when selection changes, receives `{ value, stopPropagation() }`
- `options`: Array of items to display
- `optionLabel`: Property key for display text (defaults to "label")

### 2.2 Multiple Selection

Enable multi-select with the `multiple` prop:

```javascript
import { Listbox } from 'primereact/listbox';
import { useState } from 'react';

export default function MultipleSelectionDemo() {
  const [selectedCities, setSelectedCities] = useState([]);

  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Tokyo', code: 'TYO' }
  ];

  return (
    <Listbox
      multiple
      value={selectedCities}
      onChange={(e) => setSelectedCities(e.value)}
      options={cities}
      optionLabel="name"
      placeholder="Select cities"
      checkbox
    />
  );
}
```

**Multiple Selection Features:**
- `multiple`: Enables multi-select mode
- `value`: Array of selected items
- `checkbox`: Displays checkboxes for visual selection indicator (recommended for multi-select)
- `metaKeySelection`: Requires Ctrl/Cmd key to add/remove items (default: false for multiple mode)

**Behavior:**
- Without `metaKeySelection`: Click to toggle selection (recommended for multi-select)
- With `metaKeySelection`: Must hold Ctrl/Cmd to add/remove items
- Shift-click: Selects range of items

### 2.3 Meta Key Selection

Require the Ctrl/Cmd key for toggling selections:

```javascript
<Listbox
  multiple
  metaKeySelection
  value={selectedItems}
  onChange={(e) => setSelectedItems(e.value)}
  options={items}
  optionLabel="name"
  // With metaKeySelection, users must hold Ctrl/Cmd to select multiple
/>
```

**Use Case:** When you want to prevent accidental multi-selection and require deliberate action.

### 2.4 Selection State

Track additional selection metadata:

```javascript
// Understanding the onChange event
onChange={(e) => {
  console.log(e.value);           // The selected item(s)
  console.log(e.originalEvent);   // The native DOM event
  e.stopPropagation();            // Prevent event bubbling
  setSelectedValue(e.value);
}}
```

**Event Structure:**
- `e.value`: The selected item(s) - single object in single mode, array in multiple mode
- `e.originalEvent`: The underlying browser event (click, keyboard)
- `stopPropagation()`: Method to prevent event bubbling

---

## 3. Data Binding Patterns

### 3.1 Basic Options Array

Listbox accepts flexible data formats for options:

```javascript
// 1. Array of strings (simplest)
const colors = ['Red', 'Green', 'Blue'];
<Listbox value={selected} options={colors} />

// 2. Array of objects with optionLabel
const cities = [
  { name: 'New York', code: 'NY' },
  { name: 'London', code: 'LDN' }
];
<Listbox
  value={selected}
  options={cities}
  optionLabel="name"
/>

// 3. Array of objects with optionLabel and optionValue (for form submission)
const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' }
];
<Listbox
  value={selected}
  options={countries}
  optionLabel="name"
  optionValue="code"  // Will store 'US' instead of entire object
/>
```

**Key Props:**
- `optionLabel`: Property to display as label (defaults to "label")
- `optionValue`: Property to use as value (defaults to entire object; undefined means use full object)
- When `optionValue` is specified, `value` will be the extracted property instead of the full object

### 3.2 Dynamic Data

Update options dynamically based on application state:

```javascript
import { useEffect, useState } from 'react';
import { Listbox } from 'primereact/listbox';

export default function DynamicListboxDemo() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  return (
    <Listbox
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.value)}
      options={categories}
      optionLabel="name"
      placeholder="Select a category"
      disabled={loading}
    />
  );
}
```

### 3.3 Grouped Data

Group options with `optionGroupLabel` and `optionGroupChildren`:

```javascript
const groupedCities = [
  {
    label: 'United States',
    code: 'USA',
    items: [
      { name: 'New York', code: 'NY' },
      { name: 'Los Angeles', code: 'LA' }
    ]
  },
  {
    label: 'Europe',
    code: 'EU',
    items: [
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' }
    ]
  }
];

export default function GroupedListboxDemo() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <Listbox
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      options={groupedCities}
      optionLabel="name"
      optionGroupLabel="label"
      optionGroupChildren="items"
      placeholder="Select a city"
    />
  );
}
```

**Props:**
- `optionGroupLabel`: Property containing the group label
- `optionGroupChildren`: Property containing the array of items in the group
- Groups are non-selectable; only child items can be selected

### 3.4 Complex Object Binding

When items contain nested properties:

```javascript
const users = [
  {
    id: 1,
    profile: { firstName: 'John', lastName: 'Doe' },
    email: 'john@example.com'
  },
  {
    id: 2,
    profile: { firstName: 'Jane', lastName: 'Smith' },
    email: 'jane@example.com'
  }
];

// Display nested property
<Listbox
  value={selected}
  options={users}
  optionLabel={(option) => `${option.profile.firstName} ${option.profile.lastName}`}
  // optionLabel can be a function for computed labels
/>

// Or store just the ID
<Listbox
  value={selected}
  options={users}
  optionLabel={(option) => `${option.profile.firstName} ${option.profile.lastName}`}
  optionValue="id"  // Will store the user ID
/>
```

**Pattern:** `optionLabel` can be a string (property key) or a function that receives the option and returns the display text.

### 3.5 Disabled Items

Disable specific items in the list:

```javascript
const items = [
  { name: 'Option 1', code: '1' },
  { name: 'Option 2 (unavailable)', code: '2', disabled: true },
  { name: 'Option 3', code: '3' },
  { name: 'Option 4 (unavailable)', code: '4', disabled: true }
];

// Inform Listbox about the disabled property
<Listbox
  value={selected}
  options={items}
  optionLabel="name"
  optionDisabled="disabled"  // Property name indicating disabled state
/>
```

**Behavior:**
- Disabled items appear visually grayed out
- Cannot be selected via click or keyboard
- Skipped during arrow key navigation

---

## 4. Custom Item Templates

### 4.1 Basic Item Template

Customize how each option appears:

```javascript
import { Listbox } from 'primereact/listbox';

const cities = [
  { name: 'New York', country: 'USA', population: '8.3M' },
  { name: 'London', country: 'UK', population: '9M' }
];

const itemTemplate = (option) => {
  return (
    <div className="flex align-items-center gap-2">
      <img
        alt={option.name}
        src={`https://cdn.jsdelivr.net/npm/country-flags@1.5.7/svg/${option.country.toLowerCase()}.svg`}
        style={{ width: '24px' }}
      />
      <div>
        <div className="font-bold">{option.name}</div>
        <div className="text-sm text-gray-500">{option.country}</div>
      </div>
    </div>
  );
};

export default function TemplatedListboxDemo() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <Listbox
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      options={cities}
      optionLabel="name"
      itemTemplate={itemTemplate}
      valueTemplate={itemTemplate}  // Use same template for display value
      placeholder="Select a city"
    />
  );
}
```

**Template Function Signature:**
```typescript
itemTemplate?: (option: any, index?: number) => React.ReactNode;
valueTemplate?: (option: any) => React.ReactNode;
```

### 4.2 Selection Indicator Template

Customize how selected items appear:

```javascript
const valueTemplate = (option) => {
  if (!option) {
    return <span>No selection</span>;
  }

  return (
    <div className="flex align-items-center gap-2">
      <span className="badge bg-primary">{option.category}</span>
      <span>{option.name}</span>
    </div>
  );
};

<Listbox
  value={selected}
  onChange={(e) => setSelected(e.value)}
  options={items}
  optionLabel="name"
  itemTemplate={itemTemplate}
  valueTemplate={valueTemplate}
/>
```

**Key Differences:**
- `itemTemplate`: Renders each option in the dropdown list
- `valueTemplate`: Renders the selected value in the closed state
- Both can be different or use the same template function

### 4.3 Rich Content Templates

Include badges, buttons, and complex layouts:

```javascript
const priorityTemplate = (option) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-900',
    medium: 'bg-yellow-100 text-yellow-900',
    low: 'bg-green-100 text-green-900'
  };

  return (
    <div className="flex align-items-center justify-content-between">
      <span>{option.name}</span>
      <span className={`badge ${priorityColors[option.priority]}`}>
        {option.priority.toUpperCase()}
      </span>
    </div>
  );
};

<Listbox
  value={selected}
  options={items}
  itemTemplate={priorityTemplate}
/>
```

### 4.4 HTML Content in Templates

Templates support any React JSX:

```javascript
const userTemplate = (option) => {
  return (
    <div className="flex align-items-center gap-3 p-2">
      <img
        src={option.avatar}
        alt={option.name}
        className="rounded-full"
        style={{ width: '32px', height: '32px' }}
      />
      <div className="flex flex-column">
        <span className="font-bold">{option.name}</span>
        <span className="text-sm text-gray-500">{option.email}</span>
      </div>
      {option.online && <span className="indicator online"></span>}
    </div>
  );
};

<Listbox
  value={selected}
  options={users}
  itemTemplate={userTemplate}
  valueTemplate={(option) => option ? `${option.name} (${option.email})` : 'Select user'}
/>
```

---

## 5. Filtering Capabilities

### 5.1 Built-in Filter

Enable search/filter with the `filter` prop:

```javascript
import { Listbox } from 'primereact/listbox';
import { useState } from 'react';

export default function FilteredListboxDemo() {
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Tokyo', code: 'TYO' },
    { name: 'Los Angeles', code: 'LAX' }
  ];

  return (
    <Listbox
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      options={cities}
      optionLabel="name"
      filter  // Enable built-in filter input
      filterBy="name"  // Search property
      placeholder="Select a city"
      emptyFilterMessage="No cities found"
    />
  );
}
```

**Filter Props:**
- `filter`: Enables filter input field (boolean)
- `filterBy`: Property to search (defaults to optionLabel)
- `filterInputProps`: Props to customize filter input element
- `emptyFilterMessage`: Message when no results match filter
- `filterPlaceholder`: Placeholder text for filter input

### 5.2 Custom Filter Template

Customize the filter input appearance:

```javascript
const filterTemplate = (options) => {
  return (
    <div className="flex align-items-center gap-2 p-2">
      <i className="pi pi-search text-gray-400"></i>
      <input
        type="text"
        placeholder={options.placeholder}
        onChange={(e) => options.filterOptions(e.target.value)}
        className="p-inputtext p-component flex-1"
        autoFocus
      />
      {options.value && (
        <button
          onClick={() => options.filterOptions('')}
          className="p-button-small p-button-text"
        >
          Clear
        </button>
      )}
    </div>
  );
};

<Listbox
  filter
  filterTemplate={filterTemplate}
  // ... other props
/>
```

**Template Function Signature:**
```typescript
filterTemplate?: (options: {
  placeholder: string;
  filterOptions: (value: string) => void;
  value?: string;
}) => React.ReactNode;
```

### 5.3 Filter Behavior Options

Control how filtering works:

```javascript
<Listbox
  filter
  filterBy="name"
  filterMatchMode="contains"  // Options: 'contains', 'startsWith', 'endsWith', 'equals'
  filterLocale="en-US"        // Locale for string comparison
  showFilterClear              // Show clear button in filter
  // ... other props
/>
```

**Match Modes:**
- `"contains"`: Default, searches anywhere in text
- `"startsWith"`: Matches beginning of text
- `"endsWith"`: Matches end of text
- `"equals"`: Exact match only

---

## 6. Virtual Scrolling

### 6.1 Large Dataset Handling

For lists with thousands of items, use virtual scrolling:

```javascript
import { Listbox } from 'primereact/listbox';
import { useState, useEffect } from 'react';

export default function VirtualScrollListboxDemo() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Generate 100,000 items
    const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      category: `Category ${(i % 10) + 1}`
    }));
    setItems(largeDataset);
  }, []);

  return (
    <Listbox
      value={selected}
      onChange={(e) => setSelected(e.value)}
      options={items}
      optionLabel="name"
      optionValue="id"
      virtualScrollerOptions={{
        itemSize: 38,  // Height of each item in pixels
        lazy: false    // Set to true for server-side virtualization
      }}
      style={{ height: '400px' }}
      listStyle={{ height: '100%', overflow: 'auto' }}
      filter
      filterBy="name"
    />
  );
}
```

**VirtualScroller Options:**
- `itemSize`: Height of each item (required for proper scrolling)
- `lazy`: Enable lazy loading from server
- `delay`: Delay before fetching lazy data
- `onLazyLoad`: Callback for server-side data fetching

### 6.2 Server-Side Virtualization

Fetch data on-demand as user scrolls:

```javascript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);

const onLazyLoad = async (event) => {
  setLoading(true);
  const { first, rows } = event;

  try {
    const response = await fetch(`/api/items?skip=${first}&take=${rows}`);
    const newItems = await response.json();
    setItems(prev => [...prev, ...newItems]);
  } finally {
    setLoading(false);
  }
};

<Listbox
  value={selected}
  onChange={(e) => setSelected(e.value)}
  options={items}
  optionLabel="name"
  virtualScrollerOptions={{
    itemSize: 38,
    lazy: true,
    onLazyLoad: onLazyLoad
  }}
/>
```

### 6.3 Performance Considerations

**When to Use Virtual Scrolling:**
- Lists with 100+ items
- Items with complex templates (images, nested components)
- Mobile or low-power devices

**Performance Tips:**
- Set accurate `itemSize` value
- Use simple, lightweight templates
- Memoize item templates with `React.memo` if complex
- For server-side data, implement efficient pagination

---

## 7. Differences from Display-Focused List Component

### 7.1 ListBox vs List Component

| Feature | Listbox | List Component |
|---------|---------|----------------|
| **Purpose** | Form input (selecting values) | Display (showing data) |
| **Selection** | Selection-focused with feedback | No selection capability |
| **ARIA Role** | `role="listbox"` | `role="list"` |
| **Use Case** | `<select>` replacement | Displaying items, feeds, results |
| **Value Binding** | `value` and `onChange` props | No value state |
| **Interaction** | Click/keyboard to select | Display-only (read-only) |
| **Styling** | Form input styling | List display styling |
| **Filtering** | Built-in filter support | N/A (application responsibility) |
| **Multiple Selection** | Native support via `multiple` | N/A |
| **Focus Management** | Roving tabindex, focus trap | Standard tab order |
| **Validation** | Form validation support | N/A |
| **Disabled Items** | Native support | N/A (manual styling) |
| **Virtual Scrolling** | Built-in VirtualScroller | Optional, separate component |

### 7.2 Listbox as Form Control

Listbox is a **form input**, not a display component:

```javascript
import { Form, Formik } from 'formik';
import { Listbox } from 'primereact/listbox';

export default function FormWithListboxDemo() {
  const initialValues = {
    selectedCategory: null,
    selectedTags: []
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log('Form submitted:', values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div>
            <label htmlFor="category">Category:</label>
            <Listbox
              id="category"
              value={values.selectedCategory}
              onChange={(e) => setFieldValue('selectedCategory', e.value)}
              options={categories}
              optionLabel="name"
              placeholder="Select a category"
            />
          </div>

          <div>
            <label htmlFor="tags">Tags:</label>
            <Listbox
              id="tags"
              multiple
              value={values.selectedTags}
              onChange={(e) => setFieldValue('selectedTags', e.value)}
              options={tags}
              optionLabel="name"
              checkbox
              placeholder="Select tags"
            />
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
```

### 7.3 Command vs Selection

**Menu (command execution):**
```javascript
// Menu: Execute actions
const items = [
  { label: 'Edit', command: () => handleEdit() },
  { label: 'Delete', command: () => handleDelete() }
];
```

**Listbox (value selection):**
```javascript
// Listbox: Select and store values
const items = [
  { name: 'Edit Option', value: 'edit' },
  { name: 'Delete Option', value: 'delete' }
];
// Selected value is used, not executed as command
```

### 7.4 Focus and Navigation

**Listbox keyboard navigation:**
- Arrow keys navigate items
- Space/Enter select item
- Escape closes if in overlay context
- Roving tabindex pattern (only one item in tab order)
- Focus trap when activated

**Display list keyboard navigation:**
- Standard tab order
- No special keyboard shortcuts
- No selection mechanism

---

## 8. State Management

### 8.1 Controlled Component Pattern

Listbox uses React's controlled component pattern:

```javascript
import { useState } from 'react';
import { Listbox } from 'primereact/listbox';

export default function ControlledListboxDemo() {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  return (
    <>
      <Listbox
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.value)}
        options={items}
        optionLabel="name"
      />

      {selectedItem && <p>Selected: {selectedItem.name}</p>}

      <button onClick={() => setSelectedItem(items[0])}>
        Reset to first item
      </button>
    </>
  );
}
```

**Controlled Pattern:**
- `value` prop provides current selection
- `onChange` callback updates state
- Parent component owns and controls state
- External manipulation possible via state updates

### 8.2 Initial Value

Set the initial selected value:

```javascript
const [selectedCity, setSelectedCity] = useState(cities[0]);  // Pre-select first

// Or null for no initial selection
const [selectedCity, setSelectedCity] = useState(null);

<Listbox
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.value)}
  options={cities}
  optionLabel="name"
/>
```

### 8.3 Clearing Selection

Programmatically clear the selection:

```javascript
const [selected, setSelected] = useState(null);

const handleClear = () => setSelected(null);

<>
  <Listbox
    value={selected}
    onChange={(e) => setSelected(e.value)}
    options={items}
    optionLabel="name"
  />
  <button onClick={handleClear}>Clear Selection</button>
</>
```

---

## 9. Accessibility

### 9.1 ARIA Attributes

Listbox implements full WCAG 2.1 Level AA compliance:

```html
<!-- Rendered with ARIA attributes -->
<div role="listbox" aria-label="Select a city" aria-disabled="false">
  <div role="option" aria-selected="true">Selected Item</div>
  <div role="option" aria-selected="false">Other Item</div>
  <div role="option" aria-selected="false" aria-disabled="true">Disabled Item</div>
</div>
```

**ARIA Props:**
```javascript
<Listbox
  aria-label="Select a category"        // Accessible name
  aria-labelledby="category-label"      // Label element ID
  aria-describedby="help-text"          // Help text
  aria-invalid={false}                   // Validation state
  disabled={false}                       // Disabled state
/>
```

### 9.2 Keyboard Navigation

| Key | Action |
|-----|--------|
| **Down Arrow** | Move to next option |
| **Up Arrow** | Move to previous option |
| **Home** | Jump to first option |
| **End** | Jump to last option |
| **Space** | Toggle selection (single/multiple) |
| **Enter** | Select focused option |
| **Shift+Down** | Extend selection to next (multiple) |
| **Shift+Up** | Extend selection to previous (multiple) |
| **Ctrl+A** | Select all (multiple mode) |
| **Type Letter** | Jump to first option starting with letter |

### 9.3 Screen Reader Support

```javascript
// Provide context for screen readers
<div>
  <label id="city-label">Select a city</label>
  <Listbox
    aria-labelledby="city-label"
    aria-describedby="city-help"
    options={cities}
    // ...
  />
  <p id="city-help">Choose your preferred city from the list</p>
</div>
```

**Announcements:**
- Component role and name announced
- Selected state announced for each option
- Disabled state announced
- Item count announced in some screen readers

---

## 10. Styling & Theming

### 10.1 CSS Classes

```javascript
<Listbox
  className="custom-listbox"
  listClassName="custom-list"
  optionGroupLabelClassName="custom-group-label"
  style={{ height: '300px' }}
/>
```

**Built-in CSS Classes:**
- `p-listbox`: Main container
- `p-listbox-list`: List container
- `p-listbox-item`: Individual option
- `p-listbox-item-group`: Group item
- `p-listbox-item-selected`: Selected state
- `p-listbox-item-disabled`: Disabled state
- `p-listbox-filter`: Filter input

### 10.2 PrimeReact Themes

Listbox inherits theme automatically:

```javascript
// Import theme in app entry point
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Component uses theme automatically
<Listbox {...props} />
```

### 10.3 Tailwind CSS Integration

```javascript
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';

export default function App() {
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <Listbox unstyled options={items} {...props} />
    </PrimeReactProvider>
  );
}
```

### 10.4 PassThrough API

Low-level DOM customization:

```javascript
<Listbox
  options={items}
  pt={{
    root: { className: 'border-2 border-blue-500' },
    listContainer: { className: 'max-h-96' },
    item: { className: 'hover:bg-blue-100' },
    itemGroup: { className: 'font-bold bg-gray-100' },
    filterContainer: { className: 'sticky top-0' }
  }}
  {...props}
/>
```

---

## 11. Composition Patterns

### 11.1 In Forms

Listbox is designed for form integration:

```javascript
import { useState } from 'react';
import { Listbox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function FormDemo() {
  const [formData, setFormData] = useState({
    category: null,
    priority: null,
    assignee: null
  });
  const toast = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.priority) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select category and priority'
      });
      return;
    }

    // Submit form
    console.log('Submitting:', formData);
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Form submitted'
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Category *</label>
          <Listbox
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.value })}
            options={categories}
            optionLabel="name"
            placeholder="Select a category"
          />
        </div>

        <div className="field">
          <label>Priority *</label>
          <Listbox
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.value })}
            options={priorities}
            optionLabel="name"
            placeholder="Select priority"
          />
        </div>

        <Button label="Submit" type="submit" />
      </form>
    </>
  );
}
```

### 11.2 In Data Tables

Use Listbox within table cells for selection:

```javascript
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Listbox } from 'primereact/listbox';

const statusBodyTemplate = (rowData, options) => {
  const statuses = [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Pending', value: 'pending' }
  ];

  return (
    <Listbox
      value={rowData.status}
      onChange={(e) => {
        // Update row status
        rowData.status = e.value;
      }}
      options={statuses}
      optionLabel="name"
      optionValue="value"
      className="w-full"
    />
  );
};

export default function DataTableWithListboxDemo() {
  const [rows, setRows] = useState([
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'inactive' }
  ]);

  return (
    <DataTable value={rows}>
      <Column field="name" header="Name" />
      <Column body={statusBodyTemplate} header="Status" />
    </DataTable>
  );
}
```

### 11.3 With Dependent Dropdowns

Chain Listbox selections:

```javascript
import { useState } from 'react';
import { Listbox } from 'primereact/listbox';

export default function DependentListboxesDemo() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const countries = [
    { name: 'USA', code: 'US' },
    { name: 'Canada', code: 'CA' }
  ];

  const citiesByCountry = {
    US: [
      { name: 'New York', country: 'US' },
      { name: 'Los Angeles', country: 'US' }
    ],
    CA: [
      { name: 'Toronto', country: 'CA' },
      { name: 'Vancouver', country: 'CA' }
    ]
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.value);
    setSelectedCity(null);  // Reset city when country changes
  };

  const availableCities = selectedCountry
    ? citiesByCountry[selectedCountry.code]
    : [];

  return (
    <>
      <div>
        <label>Country:</label>
        <Listbox
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries}
          optionLabel="name"
          placeholder="Select country"
        />
      </div>

      {selectedCountry && (
        <div>
          <label>City:</label>
          <Listbox
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={availableCities}
            optionLabel="name"
            placeholder="Select city"
            disabled={availableCities.length === 0}
          />
        </div>
      )}
    </>
  );
}
```

---

## 12. Best Practices

### 12.1 Performance

**Memoize Options:**
```javascript
const options = useMemo(
  () => largeDataset.map(item => ({
    name: item.title,
    value: item.id
  })),
  [largeDataset]
);
```

**Use Virtual Scrolling:**
```javascript
// For 100+ items
<Listbox
  options={items}
  virtualScrollerOptions={{ itemSize: 38 }}
  style={{ height: '400px' }}
/>
```

### 12.2 User Experience

**Provide Clear Labels:**
```javascript
<div>
  <label htmlFor="listbox-category">Product Category</label>
  <Listbox
    id="listbox-category"
    placeholder="Choose a category..."
    // ...
  />
</div>
```

**Disable When Inappropriate:**
```javascript
<Listbox
  disabled={!isEditable || isLoading}
  options={items}
  // ...
/>
```

**Show Empty State:**
```javascript
<Listbox
  options={items}
  emptyMessage="No items available"
  emptyFilterMessage="No matches found"
  // ...
/>
```

### 12.3 Validation Integration

```javascript
<Listbox
  value={formData.category}
  onChange={(e) => {
    setFormData({ ...formData, category: e.value });
    setErrors({ ...errors, category: null });
  }}
  options={categories}
  optionLabel="name"
  invalid={!!errors.category}
  className={errors.category ? 'p-invalid' : ''}
/>
{errors.category && <small className="p-error">{errors.category}</small>}
```

---

## 13. Key Findings & Recommendations

### 13.1 Core Strengths

1. **Form-Centric Design**: Purpose-built for form input, not navigation
2. **Flexible Data Binding**: Handles primitives, objects, grouped data
3. **Rich Customization**: Templates and PassThrough API for full control
4. **Accessibility First**: Full WCAG 2.1 AA compliance out of the box
5. **Performance Ready**: Virtual scrolling built-in for large datasets
6. **Integration**: Seamless with React forms, Formik, state management

### 13.2 Compared to Menu Component

| Aspect | Menu | Listbox |
|--------|------|---------|
| **Primary Use** | Navigation/commands | Form input |
| **Selection** | Navigation actions | Value selection |
| **ARIA Pattern** | Menu button | ListBox |
| **Data Structure** | MenuModel (commands) | Options array (values) |
| **Typical Trigger** | Button click | Always visible |
| **Value Handling** | Execute command | Store selected value |

### 13.3 Listbox is NOT a Display List

Unlike a display-focused "List" component, Listbox:
- Is a **form input**, not a presentation layer
- Requires `value` and `onChange` for state management
- Uses `role="listbox"` (not `role="list"`)
- Focuses on selection, not just information display
- Replaces `<select>` elements in forms

### 13.4 When to Use Listbox

**Best For:**
- Single/multiple selection forms
- `<select>` replacement
- Searchable selection inputs
- Grouped option selection
- Custom item rendering in selections
- Large dataset selection with virtual scrolling

**NOT For:**
- Displaying read-only lists
- Navigation menus
- Command execution
- Pure information display (use a List component instead)

---

## 14. Architectural Differences: Selection vs. Display

### Selection-Focused (Listbox)
- Form control with state management
- User interaction changes application state
- ARIA role="listbox" pattern
- Keyboard supports selection shortcuts
- Filtering is about finding selectable items
- Value binding drives the component
- Suited for: Forms, input fields, decision-making

### Display-Focused (List)
- Information presentation
- User interaction triggers navigation or events
- ARIA role="list" pattern
- Keyboard supports basic navigation
- Filtering is about finding displayable items
- Read-only by default
- Suited for: News feeds, result lists, content displays

---

## Research Metadata

- **Total Coverage:** Complete API documentation
- **Research Date:** 2025-11-05
- **Component Category:** Form Input / Selection Control
- **Related Components:** Menu, Select, Dropdown, MultiSelect, DataTable
- **Framework:** PrimeReact 10.9.7+
- **Documentation:** https://primereact.org/listbox/
- **Purpose:** Inform Semantic UI List and Select component development

---

**Research Completed:** 2025-11-05
**Researcher:** Claude (Anthropic)
**Objective:** Document PrimeReact Listbox as a selection-focused component distinct from display-focused List components, identifying patterns and best practices for Semantic UI implementation.

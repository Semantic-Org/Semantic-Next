# Semantic UI Classic - Dropdown Usage Patterns

> Last Modified: 2025-11-04
> Source: https://semantic-ui.com/modules/dropdown.html

## 1. Component Overview

The Semantic UI Dropdown is a remarkably **versatile, multi-purpose component** that unifies several distinct interaction patterns into a single cohesive module. Unlike modern frameworks that separate concerns into Select, Menu, Combobox, and Autocomplete components, Semantic UI's Dropdown serves as a unified solution for: form selection dropdowns, searchable/filterable selection fields, multi-select inputs, action menus, and contextual navigation menus. This design philosophy emphasizes reusability and consistent behavior across different use cases, reducing cognitive overhead for developers who only need to learn one API.

The component functions both as a form control (replacing native `<select>` elements) and as an interactive menu system, supporting both mouse and keyboard navigation, remote data loading, custom content rendering, and progressive enhancement with or without JavaScript.

## 2. Basic Usage

### Class-Based Initialization (No JavaScript Required)

The simplest dropdown requires only HTML markup with specific class names:

```html
<!-- Simple dropdown menu (no JavaScript) -->
<div class="ui dropdown">
  <div class="text">File</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">New</div>
    <div class="item">Open...</div>
    <div class="item">Save as...</div>
  </div>
</div>
```

**Structure breakdown**:
- `.ui.dropdown` - Root container establishing dropdown context
- `.text` - Current selection display area
- `.dropdown.icon` - Visual indicator (chevron/caret)
- `.menu` - Hidden container for dropdown options
- `.item` - Individual selectable options

### Selection Dropdown (Form Control)

Selection dropdowns integrate with forms and can initialize from native `<select>` elements:

```html
<!-- From native select -->
<select class="ui dropdown">
  <option value="">Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>

<!-- Custom markup with hidden input -->
<div class="ui selection dropdown">
  <input type="hidden" name="gender">
  <i class="dropdown icon"></i>
  <div class="default text">Select Gender</div>
  <div class="menu">
    <div class="item" data-value="male">Male</div>
    <div class="item" data-value="female">Female</div>
  </div>
</div>
```

**Key differences**:
- `.selection` modifier adds form control styling
- Hidden `<input>` stores selected value for form submission
- `.default.text` provides placeholder until selection
- `data-value` attributes map to form values

### JavaScript Initialization

```javascript
// Initialize all dropdowns
$('.ui.dropdown').dropdown();

// With configuration
$('.ui.dropdown').dropdown({
  on: 'hover',              // Trigger event
  action: 'activate',       // Selection behavior
  transition: 'slide down', // Animation
  duration: 200             // Animation duration
});

// Initialize with JavaScript-defined values
$('.dropdown').dropdown({
  values: [
    { name: 'Male', value: 'male', selected: true },
    { name: 'Female', value: 'female' },
    { name: 'Other', value: 'other' }
  ]
});
```

## 3. API/Classes

### Core Classes

| Class | Purpose | Applied To |
|-------|---------|------------|
| `.ui.dropdown` | Base dropdown container | Root `<div>` |
| `.selection` | Form control styling | Root `<div>` |
| `.search` | Adds search input field | Root `<div>` |
| `.multiple` | Multi-select mode | Root `<div>` |
| `.inline` | Renders inline with text | Root `<div>` |
| `.floating` | Detached appearance | Root `<div>` |
| `.button` | Styled as button | Root `<div>` |
| `.icon` | Icon-only trigger | Root `<div>` |
| `.labeled` | With labeled content | Root `<div>` |
| `.compact` | Minimal width | Root `<div>` |
| `.fluid` | Full width | Root `<div>` |
| `.scrolling` | Scrollable menu | Root `<div>` |
| `.simple` | No JavaScript mode | Root `<div>` |

### Menu Direction Classes

| Class | Purpose |
|-------|---------|
| `.upward` | Opens upward instead of down |
| `.left menu` | Menu aligns to left |
| `.right menu` | Menu aligns to right |

### Pointing Classes

| Class | Effect |
|-------|--------|
| `.pointing` | Default downward pointing |
| `.top pointing` | Points upward |
| `.left pointing` | Points to left |
| `.right pointing` | Points to right |

### State Classes

| Class | State | Applied By |
|-------|-------|------------|
| `.active` | Menu is open | JavaScript |
| `.visible` | Menu is visible | JavaScript |
| `.loading` | Showing loading spinner | JavaScript |
| `.disabled` | Prevents interaction | Manual or JavaScript |
| `.error` | Error state styling | Manual or JavaScript |
| `.selected` | Currently selected item | JavaScript |

### Content Classes

| Class | Purpose | Applied To |
|-------|---------|------------|
| `.item` | Selectable option | Menu children |
| `.header` | Non-selectable section header | Menu children |
| `.divider` | Visual separator | Menu children |
| `.message` | Informational content | Menu children |
| `.text` | Display area for current selection | Trigger element |
| `.default.text` | Placeholder text | Trigger element |
| `.dropdown.icon` | Dropdown indicator icon | Icon element |
| `.label` | Selected item chip (multi-select) | Auto-generated |
| `.description` | Secondary item text | Item child |

### Modifier Classes

| Class | Effect |
|-------|--------|
| `.clearable` | Adds clear button (v2.4.0+) |
| `.scrolling` | Fixed-height scrollable menu |
| `.long` | More menu height |
| `.very long` | Maximum menu height |

## 4. jQuery API

### Initialization

```javascript
// Basic initialization
$('.ui.dropdown').dropdown();

// With settings object
$('.ui.dropdown').dropdown({
  // Settings here
});
```

### Methods (Behaviors)

**Value Management**:
```javascript
// Get current value(s)
$('.dropdown').dropdown('get value');           // Returns string or array
$('.dropdown').dropdown('get text');            // Returns display text
$('.dropdown').dropdown('get item', value);     // Returns jQuery element

// Set value(s)
$('.dropdown').dropdown('set selected', value); // Single value
$('.dropdown').dropdown('set selected', [values]); // Multiple values
$('.dropdown').dropdown('set exactly', [values]); // Replace all selections

// Clear selection
$('.dropdown').dropdown('clear');
$('.dropdown').dropdown('restore defaults');
```

**Menu Management**:
```javascript
// Setup menu from data
$('.dropdown').dropdown('setup menu', values);

// Refresh dropdown (reprocess menu items)
$('.dropdown').dropdown('refresh');

// Change all menu values
$('.dropdown').dropdown('change values', values);
```

**Visibility Control**:
```javascript
$('.dropdown').dropdown('show');           // Open menu
$('.dropdown').dropdown('hide');           // Close menu
$('.dropdown').dropdown('toggle');         // Toggle open/close
$('.dropdown').dropdown('hide others');    // Close all other dropdowns
```

**State Management**:
```javascript
$('.dropdown').dropdown('set active');        // Set active state
$('.dropdown').dropdown('set visible');       // Show menu
$('.dropdown').dropdown('remove active');     // Remove active state
$('.dropdown').dropdown('remove visible');    // Hide menu
```

**Queries**:
```javascript
$('.dropdown').dropdown('is selection');   // Boolean
$('.dropdown').dropdown('is animated');    // Boolean
$('.dropdown').dropdown('is visible');     // Boolean
$('.dropdown').dropdown('is hidden');      // Boolean
```

**Event Binding**:
```javascript
$('.dropdown').dropdown('bind touch events');
$('.dropdown').dropdown('bind mouse events');
$('.dropdown').dropdown('determine intent');
```

**Restoration**:
```javascript
$('.dropdown').dropdown('restore defaults');
$('.dropdown').dropdown('restore default text');
$('.dropdown').dropdown('restore placeholder text');
```

**Destruction**:
```javascript
$('.dropdown').dropdown('destroy');
```

### Settings Object

**Behavior Settings**:
```javascript
{
  on: 'click',                  // Event to trigger menu (hover/click)
  action: 'activate',           // Selection behavior (activate/select/combo/nothing/hide)
  allowReselection: false,      // Allow clicking same item
  allowAdditions: false,        // Allow user-created options
  hideAdditions: true,          // Hide additions on blur

  forceSelection: true,         // Force valid selection on blur
  selectOnKeydown: true,        // Select on arrow key nav
  allowTab: true,               // Enable tab key

  fullTextSearch: false,        // Search entire text vs start
  preserveHTML: true,           // Keep HTML in options
  sortSelect: false,            // Sort select options

  match: 'both',                // Search matching (both/value/text)
  minCharacters: 1,             // Chars before search starts

  direction: 'auto',            // Menu direction (auto/upward/downward)
  keepOnScreen: true,           // Prevent menu off-screen

  transition: 'auto',           // Animation effect
  duration: 200,                // Animation duration

  showOnFocus: true,            // Show menu on input focus
  allowCategorySelection: false // Allow selecting category headers
}
```

**Multi-Select Settings**:
```javascript
{
  useLabels: true,              // Show selection as labels
  maxSelections: false,         // Maximum selections (number or false)
  glyphWidth: 1.037,           // Label width calculation
  label: {
    transition: 'scale',        // Label animation
    duration: 200,              // Label animation duration
    variation: false            // Label style variation
  }
}
```

**Search Settings**:
```javascript
{
  allowAdditions: false,        // Enable tagging mode
  hideAdditions: true,          // Hide user additions on blur
  additionLabel: 'Add ',        // Prefix for addition labels
  additionPosition: 'bottom',   // Where to place additions

  filterRemoteData: false,      // Client-side filter API results
  saveRemoteData: true,         // SessionStorage caching
  throttle: 200                 // API request throttle
}
```

**API Integration**:
```javascript
{
  apiSettings: {
    url: 'search/?query={query}',
    cache: false,
    throttle: 200,
    // Standard API module settings
  },

  fields: {
    remoteValues: 'results',    // Path to results array
    values: 'values',           // Values array property
    name: 'name',               // Display name field
    value: 'value',             // Value field
    text: 'text'                // Display text field
  }
}
```

**Callback Settings**:
```javascript
{
  onChange: function(value, text, $choice) {
    // Called when selection changes
    // this = dropdown element
  },

  onAdd: function(addedValue, addedText, $addedChoice) {
    // Called when item added (multi-select)
  },

  onRemove: function(removedValue, removedText, $removedChoice) {
    // Called when item removed (multi-select)
  },

  onLabelCreate: function(value, text) {
    // Called when label created (must return label HTML)
    return $(this);
  },

  onLabelRemove: function(value) {
    // Called when label removed, return false to prevent
    return true;
  },

  onLabelSelect: function($selectedLabels) {
    // Called when labels clicked
  },

  onNoResults: function(searchValue) {
    // Called when search has no results
    return true;
  },

  onShow: function() {
    // Called before menu shows, return false to prevent
  },

  onHide: function() {
    // Called before menu hides, return false to prevent
  }
}
```

**Message Settings**:
```javascript
{
  message: {
    addResult: 'Add <b>{term}</b>',
    count: '{count} selected',
    maxSelections: 'Max {maxCount} selections',
    noResults: 'No results found.',
    serverError: 'There was an error contacting the server'
  }
}
```

**Selector Settings** (CSS selectors for internal structure):
```javascript
{
  selector: {
    addition: '.addition',
    dropdown: '.ui.dropdown',
    icon: '> .dropdown.icon',
    input: '> input[type="hidden"], > select',
    item: '.item',
    label: '> .label',
    remove: '> .label > .delete.icon',
    siblingLabel: '.label',
    menu: '.menu',
    message: '.message',
    menuIcon: '.dropdown.icon',
    search: 'input.search, .menu > .search > input, .menu input.search',
    sizer: '> input.sizer',
    text: '> .text:not(.icon)',
    unselectable: '.disabled, .filtered'
  }
}
```

**Class Name Settings** (CSS classes applied dynamically):
```javascript
{
  className: {
    active: 'active',
    addition: 'addition',
    animating: 'animating',
    disabled: 'disabled',
    dropdown: 'ui dropdown',
    filtered: 'filtered',
    hidden: 'hidden transition',
    item: 'item',
    label: 'ui label',
    loading: 'loading',
    menu: 'menu',
    message: 'message',
    multiple: 'multiple',
    placeholder: 'default',
    sizer: 'sizer',
    search: 'search',
    selected: 'selected',
    selection: 'selection',
    upward: 'upward',
    leftward: 'left',
    visible: 'visible'
  }
}
```

## 5. Types & Variants

### Selection Dropdown (Form Control)

**Purpose**: Replace native `<select>` elements with styled dropdown interface

```html
<div class="ui selection dropdown">
  <input type="hidden" name="gender">
  <i class="dropdown icon"></i>
  <div class="default text">Gender</div>
  <div class="menu">
    <div class="item" data-value="male">Male</div>
    <div class="item" data-value="female">Female</div>
  </div>
</div>
```

**Characteristics**:
- Integrates with forms via hidden input
- Styled as form field
- Supports validation
- Single selection by default

### Search Dropdown (Filterable Selection)

**Purpose**: Filter large option lists by typing

```html
<div class="ui search selection dropdown">
  <input type="hidden" name="country">
  <i class="dropdown icon"></i>
  <div class="default text">Select Country</div>
  <div class="menu">
    <div class="item" data-value="af">Afghanistan</div>
    <div class="item" data-value="ax">Aland Islands</div>
    <!-- 250+ more countries -->
  </div>
</div>
```

**Characteristics**:
- Adds search input automatically
- Filters options as user types
- Configurable search behavior (full text vs prefix)
- Highlights matching text

**Search Configuration**:
```javascript
$('.ui.search.dropdown').dropdown({
  fullTextSearch: true,        // Search anywhere in text
  match: 'both',               // Search both value and text
  minCharacters: 2             // Start search after 2 chars
});
```

### Multi-Select Dropdown

**Purpose**: Select multiple values with visual labels

```html
<div class="ui multiple selection dropdown">
  <input type="hidden" name="skills">
  <i class="dropdown icon"></i>
  <div class="default text">Skills</div>
  <div class="menu">
    <div class="item" data-value="angular">Angular</div>
    <div class="item" data-value="css">CSS</div>
    <div class="item" data-value="design">Graphic Design</div>
    <div class="item" data-value="ember">Ember</div>
  </div>
</div>
```

**Characteristics**:
- Multiple `.selected` items
- Selected items displayed as removable labels
- Hidden input stores comma-delimited values
- Optional `maxSelections` limit
- Can disable labels with `useLabels: false` (shows count instead)

**Multi-Select with Search (Tagging)**:
```html
<div class="ui multiple search selection dropdown">
  <!-- Combined multi-select + search + custom additions -->
</div>
```

```javascript
$('.ui.multiple.search.dropdown').dropdown({
  allowAdditions: true,         // Enable user additions
  hideAdditions: true,          // Hide additions on blur
  additionLabel: 'Add ',        // Label prefix
  maxSelections: 5              // Limit selections
});
```

### Menu Dropdown (Action Menu)

**Purpose**: Action menus and navigation dropdowns

```html
<div class="ui dropdown">
  <div class="text">File</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">New</div>
    <div class="item">
      <i class="dropdown icon"></i>
      Open
      <div class="menu">
        <div class="item">Recent</div>
        <div class="item">From Drive</div>
      </div>
    </div>
    <div class="item">Save as...</div>
    <div class="divider"></div>
    <div class="item">Exit</div>
  </div>
</div>
```

**Characteristics**:
- No form integration
- Supports nested submenus
- Hover or click triggers
- Actions via click handlers

### Inline Dropdown

**Purpose**: Contextual selection within prose

```html
<p>
  You can pick your favorite fruit
  <div class="ui inline dropdown">
    <div class="text">apple</div>
    <i class="dropdown icon"></i>
    <div class="menu">
      <div class="item">apple</div>
      <div class="item">orange</div>
      <div class="item">banana</div>
    </div>
  </div>
  from the list.
</p>
```

**Characteristics**:
- Renders inline with text flow
- Compact presentation
- Minimal styling

### Pointing Dropdown

**Purpose**: Visual arrow connecting menu to trigger

```html
<!-- Points down from trigger -->
<div class="ui pointing dropdown">
  <div class="text">Filter Posts</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">All</div>
    <div class="item">Important</div>
    <div class="item">Announcements</div>
  </div>
</div>

<!-- Points up toward trigger -->
<div class="ui top pointing dropdown">
  <!-- ... -->
</div>

<!-- Points left/right -->
<div class="ui left pointing dropdown">
  <!-- ... -->
</div>
```

**Characteristics**:
- CSS triangle/arrow indicator
- Multiple directional variants
- Often used in toolbars/headers

### Floating Dropdown

**Purpose**: Menu appears detached below trigger

```html
<div class="ui floating dropdown labeled icon button">
  <i class="filter icon"></i>
  <span class="text">Filter Posts</span>
  <div class="menu">
    <div class="item">All</div>
    <div class="item">Important</div>
  </div>
</div>
```

**Characteristics**:
- Subtle shadow/border separation
- Used with buttons
- No pointing arrow

### Simple Dropdown (No JavaScript)

**Purpose**: CSS-only hover dropdowns

```html
<div class="ui simple dropdown">
  <div class="text">File</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">New</div>
    <div class="item">Open...</div>
  </div>
</div>
```

**Characteristics**:
- Opens on hover via CSS
- No JavaScript required
- Limited functionality
- Good for progressive enhancement

### Button Dropdown

**Purpose**: Dropdown styled as button

```html
<div class="ui dropdown button">
  <div class="text">Actions</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">Edit</div>
    <div class="item">Delete</div>
  </div>
</div>

<!-- Icon-only button -->
<div class="ui icon dropdown button">
  <i class="wrench icon"></i>
  <div class="menu">
    <div class="item">Settings</div>
    <div class="item">Help</div>
  </div>
</div>
```

**Characteristics**:
- Full button styling
- Can be icon-only
- Combines with button variations (colored, sized, etc.)

## 6. States & Modifiers

### Active State

**Applied when**: Menu is open

```html
<div class="ui active dropdown">
  <!-- Dropdown with open menu -->
</div>
```

**Effects**:
- Menu becomes visible
- Trigger element highlights
- Icon may rotate
- Applied/removed by JavaScript

### Disabled State

**Applied when**: Interaction should be prevented

```html
<div class="ui disabled dropdown">
  <div class="text">Disabled</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">Option 1</div>
  </div>
</div>

<!-- Disabled individual items -->
<div class="menu">
  <div class="disabled item">Disabled Option</div>
</div>
```

**Effects**:
- Grayed out appearance
- Prevents clicking/opening
- No hover effects
- Can apply to entire dropdown or individual items

### Loading State

**Applied when**: Data is being fetched

```html
<div class="ui loading selection dropdown">
  <!-- Automatically shows spinner -->
</div>
```

```javascript
// Programmatically set loading
$('.dropdown').addClass('loading');
// Or via API
$('.dropdown').dropdown('set loading');
```

**Effects**:
- Loading spinner replaces icon
- Prevents interaction during load
- Used with remote data fetching

### Error State

**Applied when**: Validation fails or errors occur

```html
<div class="ui error selection dropdown">
  <input type="hidden" name="gender">
  <i class="dropdown icon"></i>
  <div class="default text">Gender</div>
  <div class="menu">
    <div class="item" data-value="male">Male</div>
  </div>
</div>
```

**Effects**:
- Red error border/highlight
- Integrates with form validation
- Can be set manually or via validation rules

### Upward Direction

**Applied when**: Should open upward instead of down

```html
<div class="ui upward selection dropdown">
  <!-- Opens upward -->
</div>
```

```javascript
// Automatic upward detection
$('.dropdown').dropdown({
  direction: 'auto'  // Detects available space
});
```

**Effects**:
- Menu appears above trigger
- Useful for dropdowns near bottom of viewport
- Can be automatic or forced

### Fluid (Full Width)

**Purpose**: Stretch to full container width

```html
<div class="ui fluid selection dropdown">
  <!-- Full width -->
</div>
```

**Effects**:
- 100% width of parent container
- Useful in form layouts
- Responsive behavior

### Compact

**Purpose**: Minimize width to content

```html
<div class="ui compact selection dropdown">
  <!-- Minimal width -->
</div>
```

**Effects**:
- No minimum width constraint
- Sizes to content
- Useful in tight spaces

### Scrolling Menu

**Purpose**: Fixed-height menu with scrollbar

```html
<div class="ui scrolling dropdown">
  <div class="text">Many Options</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <!-- Many items -->
  </div>
</div>

<!-- Longer scrolling area -->
<div class="ui long scrolling dropdown">
  <!-- ... -->
</div>
```

**Effects**:
- Fixed max-height
- Vertical scrollbar for overflow
- Incompatible with nested submenus

### Clearable

**Purpose**: Add clear button to remove selection (v2.4.0+)

```javascript
$('.ui.dropdown').dropdown({
  clearable: true
});
```

**Effects**:
- X icon appears when value selected
- Clicking X clears selection
- Returns to default/placeholder state

## 7. Composition Patterns

### With Forms

**Integration with form validation**:

```html
<form class="ui form">
  <div class="field">
    <label>Gender</label>
    <div class="ui selection dropdown">
      <input type="hidden" name="gender">
      <i class="dropdown icon"></i>
      <div class="default text">Gender</div>
      <div class="menu">
        <div class="item" data-value="male">Male</div>
        <div class="item" data-value="female">Female</div>
      </div>
    </div>
  </div>
</form>
```

```javascript
$('.ui.form').form({
  fields: {
    gender: {
      identifier: 'gender',
      rules: [
        { type: 'empty', prompt: 'Please select a gender' }
      ]
    }
  }
});
```

**Multi-select validation**:
```javascript
$('.ui.form').form({
  fields: {
    skills: {
      identifier: 'skills',
      rules: [
        { type: 'minCount[2]', prompt: 'Select at least 2 skills' },
        { type: 'maxCount[5]', prompt: 'Select at most 5 skills' }
      ]
    }
  }
});
```

### With Icons

**Basic icon integration**:
```html
<div class="menu">
  <div class="item">
    <i class="file icon"></i>
    New File
  </div>
  <div class="item">
    <i class="folder icon"></i>
    New Folder
  </div>
</div>
```

**Icon dropdown trigger**:
```html
<div class="ui icon dropdown button">
  <i class="settings icon"></i>
  <div class="menu">
    <div class="item">Edit Settings</div>
    <div class="item">View Profile</div>
  </div>
</div>
```

### With Flags (Country Selection)

```html
<div class="ui search selection dropdown">
  <input type="hidden" name="country">
  <i class="dropdown icon"></i>
  <div class="default text">Select Country</div>
  <div class="menu">
    <div class="item" data-value="af">
      <i class="af flag"></i>
      Afghanistan
    </div>
    <div class="item" data-value="ax">
      <i class="ax flag"></i>
      Aland Islands
    </div>
  </div>
</div>
```

### With Images/Avatars

```html
<div class="ui selection dropdown">
  <input type="hidden" name="user">
  <div class="default text">Select User</div>
  <div class="menu">
    <div class="item" data-value="jenny">
      <img class="ui avatar image" src="jenny.jpg">
      Jenny Hess
    </div>
    <div class="item" data-value="elliot">
      <img class="ui avatar image" src="elliot.jpg">
      Elliot Fu
    </div>
  </div>
</div>
```

### With Labels/Badges

**Item descriptions**:
```html
<div class="menu">
  <div class="item">
    <span class="text">Important</span>
    <span class="description">54 messages</span>
  </div>
  <div class="item">
    <span class="text">Announcements</span>
    <span class="description">12 messages</span>
  </div>
</div>
```

**Label integration**:
```html
<div class="item">
  <span class="text">Premium Feature</span>
  <span class="ui blue label">Pro</span>
</div>
```

### With Headers and Dividers

```html
<div class="menu">
  <div class="header">
    <i class="tags icon"></i>
    Filter by category
  </div>
  <div class="item">All</div>
  <div class="divider"></div>
  <div class="header">Development</div>
  <div class="item">Bug Reports</div>
  <div class="item">Feature Requests</div>
  <div class="divider"></div>
  <div class="header">Design</div>
  <div class="item">UI/UX</div>
  <div class="item">Mockups</div>
</div>
```

### Nested Menus (Multiple Levels)

```html
<div class="ui dropdown">
  <div class="text">File</div>
  <i class="dropdown icon"></i>
  <div class="menu">
    <div class="item">New</div>
    <div class="item">
      <i class="dropdown icon"></i>
      Open
      <div class="menu">
        <div class="item">Recent Files</div>
        <div class="item">From Cloud</div>
        <div class="item">From Device</div>
      </div>
    </div>
    <div class="item">Save</div>
  </div>
</div>
```

```javascript
$('.ui.dropdown').dropdown({
  allowCategorySelection: true  // Make parent items selectable
});
```

**Note**: Scrolling menus are incompatible with submenus.

### In Button Groups

```html
<div class="ui buttons">
  <button class="ui button">Save</button>
  <div class="ui floating dropdown icon button">
    <i class="dropdown icon"></i>
    <div class="menu">
      <div class="item">Save as Draft</div>
      <div class="item">Save and Publish</div>
      <div class="item">Save Template</div>
    </div>
  </div>
</div>
```

### In Navigation Menus

```html
<div class="ui menu">
  <a class="item">Home</a>
  <div class="ui dropdown item">
    Products
    <i class="dropdown icon"></i>
    <div class="menu">
      <div class="item">Software</div>
      <div class="item">Hardware</div>
      <div class="item">Services</div>
    </div>
  </div>
  <a class="item">About</a>
</div>
```

### With Search Input in Menu

```html
<div class="menu">
  <div class="ui icon search input">
    <i class="search icon"></i>
    <input type="text" placeholder="Search users...">
  </div>
  <div class="divider"></div>
  <div class="header">Recent</div>
  <div class="item">John Doe</div>
  <div class="item">Jane Smith</div>
</div>
```

### Message Content

```html
<div class="menu">
  <div class="message">
    <div class="header">
      No Results
    </div>
    <p>Your search returned no results.</p>
  </div>
</div>
```

## 8. Styling & Theming

### Size Variations

Dropdowns inherit standard Semantic UI size modifiers:

```html
<div class="ui mini selection dropdown"></div>
<div class="ui tiny selection dropdown"></div>
<div class="ui small selection dropdown"></div>
<div class="ui selection dropdown"></div>       <!-- Default/medium -->
<div class="ui large selection dropdown"></div>
<div class="ui big selection dropdown"></div>
<div class="ui huge selection dropdown"></div>
<div class="ui massive selection dropdown"></div>
```

### Button Styled Variations

When styled as button, inherits button variations:

```html
<!-- Colors -->
<div class="ui primary dropdown button">Primary</div>
<div class="ui secondary dropdown button">Secondary</div>
<div class="ui positive dropdown button">Positive</div>
<div class="ui negative dropdown button">Negative</div>

<!-- Basic -->
<div class="ui basic dropdown button">Basic</div>

<!-- Inverted -->
<div class="ui inverted dropdown button">Inverted</div>
```

### Custom Styling via CSS

**Targeting specific elements**:
```css
/* Custom trigger styling */
.ui.dropdown > .text {
  font-weight: bold;
  color: #333;
}

/* Custom menu styling */
.ui.dropdown .menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Custom item styling */
.ui.dropdown .menu > .item {
  padding: 12px 16px;
}

/* Hover state */
.ui.dropdown .menu > .item:hover {
  background: #f0f0f0;
}

/* Selected item */
.ui.dropdown .menu > .item.selected {
  background: #e0e0e0;
  font-weight: bold;
}

/* Custom label styling (multi-select) */
.ui.dropdown > .label {
  background: #2185d0;
  color: white;
  border-radius: 4px;
}
```

### LESS Variables

Semantic UI uses LESS for theming. Key variables (from theming documentation):

```less
// Dropdown specific variables
@selectionBorderRadius: @defaultBorderRadius;
@selectionPadding: 0.78571429em 1em;
@selectionMinHeight: 2.71428571em;

// Menu
@menuBorderRadius: @defaultBorderRadius;
@menuBoxShadow: 0px 2px 3px 0px rgba(34, 36, 38, 0.15);
@menuMaxHeight: 14rem;

// Item
@itemPadding: 0.78571429rem 1.14285714rem;
@hoveredItemBackground: rgba(0, 0, 0, 0.05);
@selectedItemBackground: rgba(0, 0, 0, 0.03);

// Colors
@defaultTextColor: rgba(0, 0, 0, 0.87);
@hoveredTextColor: rgba(0, 0, 0, 0.95);
@selectedTextColor: rgba(0, 0, 0, 0.95);

// Icons
@iconMargin: 0em 0em 0em 1em;
@dropdownIconOpacity: 0.8;

// Transitions
@selectionTransition: box-shadow @defaultDuration @defaultEasing;
@menuTransition: opacity @defaultDuration @defaultEasing;
```

### Theme Customization

Users can override variables in their site theme:

```less
// site/modules/dropdown.variables
@selectionBorderRadius: 4px;
@menuBoxShadow: 0 4px 8px rgba(0,0,0,0.1);
@itemPadding: 1rem 1.5rem;
```

### Animation Transitions

Available transition effects:

```javascript
$('.dropdown').dropdown({
  transition: 'slide down',  // Default
  // Options: auto, slide down, slide up, fade, scale, etc.
  duration: 200
});
```

## 9. Accessibility

### Keyboard Navigation

**Supported keyboard interactions**:

| Key | Action |
|-----|--------|
| `Enter` | Open menu / Select focused item |
| `Space` | Open menu / Select focused item |
| `Escape` | Close menu |
| `Up Arrow` | Navigate to previous item |
| `Down Arrow` | Navigate to next item |
| `Left Arrow` | Move to parent menu (nested) |
| `Right Arrow` | Open submenu (nested) |
| `Tab` | Close menu and move to next field |
| `Shift + Tab` | Close menu and move to previous field |
| Letters | Quick search/jump to matching items |

**Keyboard configuration**:
```javascript
$('.dropdown').dropdown({
  allowTab: true,              // Enable tab key navigation
  selectOnKeydown: true,       // Select as you arrow through
  forceSelection: true         // Require valid selection
});
```

### Focus Management

- Dropdown receives focus on click/tab
- Search input auto-focuses when menu opens (search dropdowns)
- Focus returns to trigger when menu closes
- Focused items highlighted during keyboard navigation

### Tab Index

```javascript
$('.dropdown').dropdown({
  allowTab: true  // Enables tabindex and tab navigation
});
```

Creates proper tab order in forms.

### Screen Reader Support

**Limited documented support**. Key considerations:

- Uses `<input type="hidden">` for form values (not accessible)
- No documented ARIA attributes in examples
- Visual-only state indicators (no `aria-expanded`, `aria-selected`)
- No `role="combobox"` or `role="listbox"` annotations

**Recommended improvements** (not in default implementation):
```html
<!-- Would need custom enhancement -->
<div class="ui dropdown"
     role="combobox"
     aria-expanded="false"
     aria-haspopup="listbox">
  <div class="text" aria-live="polite">Select option</div>
  <div class="menu" role="listbox">
    <div class="item" role="option" aria-selected="false">Option 1</div>
  </div>
</div>
```

### Touch Support

```javascript
$('.dropdown').dropdown({
  touchDelay: 50  // Delay before touch counts as touch (not swipe)
});

// Explicit touch event binding
$('.dropdown').dropdown('bind touch events');
```

**Touch behaviors**:
- Tap to open menu
- Tap item to select
- Swipe to scroll (scrolling menus)
- Touch delay prevents accidental activations

### Limitations

1. **No native semantic HTML**: Doesn't use `<select>` for progressive enhancement
2. **ARIA gaps**: Missing standard combobox ARIA patterns
3. **Screen reader testing**: Not documented as tested with screen readers
4. **Keyboard shortcuts**: No documented skip-to-letter functionality
5. **Mobile considerations**: Relies on custom implementation vs native controls

## 10. Best Practices

### When to Use Each Type

**Selection Dropdown**:
- Replacing `<select>` elements in forms
- Form fields requiring single selection
- Need validation integration
- Want consistent styling across browsers

**Search Selection**:
- Large option lists (10+ items)
- Country/state selection
- User directories
- Any list benefiting from filtering

**Multi-Select**:
- Tag/category selection
- Skills/interests selection
- Filtering by multiple criteria
- Any scenario requiring multiple choices

**Search Multi-Select (Tagging)**:
- User-generated tags
- Free-form categorization
- Dynamic option creation
- Flexible input scenarios

**Menu Dropdown**:
- Action menus (File, Edit, View)
- Toolbar actions
- Navigation menus
- Context menus
- Right-click alternatives

**Inline Dropdown**:
- Contextual selections in prose
- Minimal visual weight needed
- Settings toggles in text
- Embedded choices in paragraphs

**Simple Dropdown**:
- Progressive enhancement base
- No JavaScript available
- Basic hover menus
- Static navigation

### Performance Recommendations

**Initialization**:
```javascript
// Don't initialize on hidden dropdowns
$('.dropdown:visible').dropdown();

// Or initialize only when needed
$('.dropdown').one('click', function() {
  $(this).dropdown().trigger('click');
});
```

**Large Lists**:
```javascript
// Use search to filter large lists
$('.dropdown').dropdown({
  minCharacters: 2,    // Don't search until 2+ chars
  fullTextSearch: false // Prefix search is faster
});
```

**Remote Data**:
```javascript
// Cache results
$('.dropdown').dropdown({
  apiSettings: {
    cache: true
  },
  saveRemoteData: true,  // SessionStorage caching
  throttle: 300          // Limit API requests
});
```

**Multi-Select with Many Items**:
```javascript
// Disable labels for better performance
$('.dropdown').dropdown({
  useLabels: false  // Shows count instead
});
```

### Initialization Timing

**Best**: Pre-rendered HTML (fastest)
```html
<!-- Markup already in place -->
<div class="ui selection dropdown">
  <!-- Full structure -->
</div>
```

**Good**: Initialize from `<select>` on page load
```javascript
$(document).ready(function() {
  $('select.dropdown').dropdown();
});
```

**Acceptable**: Dynamic initialization
```javascript
// Initialize after content loads
$('.dropdown-container').on('content:loaded', function() {
  $(this).find('.dropdown').dropdown();
});
```

### Form Integration Best Practices

**Always use hidden inputs for forms**:
```html
<input type="hidden" name="field_name">
<!-- Not: relying on dropdown internal state -->
```

**Integrate with validation**:
```javascript
$('.ui.form').form({
  fields: {
    dropdown_field: {
      identifier: 'dropdown_field',
      rules: [{ type: 'empty', prompt: 'Required' }]
    }
  }
});
```

**Clear on form reset**:
```javascript
$('form').on('reset', function() {
  $(this).find('.dropdown').dropdown('clear');
});
```

### Event Handling Best Practices

**Use onChange callback**:
```javascript
$('.dropdown').dropdown({
  onChange: function(value, text, $choice) {
    // React to selection changes
    console.log('Selected:', value);
  }
});
```

**For multi-select, use onAdd/onRemove**:
```javascript
$('.dropdown').dropdown({
  onAdd: function(addedValue, addedText, $addedChoice) {
    // Handle individual additions
  },
  onRemove: function(removedValue, removedText, $removedChoice) {
    // Handle individual removals
  }
});
```

**Prevent default for custom actions**:
```javascript
$('.dropdown').dropdown({
  action: 'nothing',  // Prevent default behavior
  onChange: function(value) {
    // Custom action logic
    if (value === 'custom_action') {
      performAction();
      return false; // Prevent selection
    }
  }
});
```

### API/Remote Data Best Practices

**Expected server response format**:
```json
{
  "success": true,
  "results": [
    {
      "name": "Display Name",
      "value": "form_value",
      "text": "Display Name",
      "description": "Optional description"
    }
  ]
}
```

**Configuration**:
```javascript
$('.dropdown').dropdown({
  apiSettings: {
    url: '/api/search?q={query}',
    cache: true,
    throttle: 300,
    onResponse: function(response) {
      // Transform response if needed
      return {
        success: true,
        results: response.data.map(item => ({
          name: item.label,
          value: item.id,
          text: item.label
        }))
      };
    }
  },
  fields: {
    remoteValues: 'results',  // Path to results array
    name: 'name',
    value: 'value',
    text: 'text'
  }
});
```

### Accessibility Considerations

While Semantic UI Classic dropdowns have **limited built-in accessibility**, developers should:

1. **Add ARIA attributes manually** for critical interfaces
2. **Test with keyboard-only navigation**
3. **Consider native `<select>` for simple cases** (better accessibility)
4. **Use search dropdowns** to reduce keyboard navigation burden
5. **Provide clear labels and instructions**
6. **Test with screen readers** for critical forms

### Common Pitfalls

**Don't initialize twice**:
```javascript
// Bad
$('.dropdown').dropdown().dropdown();

// Good - check if initialized
if (!$('.dropdown').hasClass('initialized')) {
  $('.dropdown').dropdown();
}
```

**Don't mix selection types**:
```html
<!-- Bad - mixing selection and multiple -->
<div class="ui selection multiple dropdown">

<!-- Good - clear intent -->
<div class="ui multiple selection dropdown">
```

**Scrolling + Submenus conflict**:
```html
<!-- Bad - scrolling disables submenus -->
<div class="ui scrolling dropdown">
  <div class="menu">
    <div class="item">
      <div class="menu"><!-- Submenu won't work --></div>
    </div>
  </div>
</div>
```

**Hidden dropdown initialization**:
```javascript
// Bad - initializing hidden dropdown
$('.hidden-dropdown').dropdown();

// Good - initialize when visible
$('.hidden-dropdown').on('shown', function() {
  $(this).dropdown();
});
```

## 11. Historical Context

### Version Evolution

**Semantic UI 1.x** (2013-2014):
- Initial release of dropdown module
- Basic selection and menu functionality
- jQuery-dependent architecture
- Simple state management

**Semantic UI 2.0** (2015):
- Major refactor of dropdown internals
- Added search functionality
- Multi-select support
- Remote data loading via API integration
- Improved keyboard navigation
- Touch event support

**Semantic UI 2.2** (2017):
- Enhanced search capabilities
- `allowAdditions` (tagging mode)
- Better positioning logic (`keepOnScreen`)
- Improved submenu support

**Semantic UI 2.4** (2018):
- **Clearable** functionality added
- Performance improvements
- Better mobile support
- Enhanced callback system

**Semantic UI 2.5+** (2019-present):
- Maintenance updates
- Bug fixes
- Community contributions
- Framework entered maintenance mode (~2020)

### Design Philosophy Evolution

**Early approach** (v1.x):
- Focused on visual consistency
- Simple dropdown replacement for `<select>`
- Basic interaction patterns

**Maturation** (v2.x):
- Recognized need for unified component
- Consolidated multiple patterns into single API
- Emphasized versatility over specialization
- jQuery ecosystem integration

**Modern context** (current):
- Framework in maintenance mode
- Community-maintained
- Legacy approach compared to modern frameworks
- Still widely deployed in production systems

### Feature Addition Timeline

| Version | Feature Added |
|---------|---------------|
| 1.0 | Basic dropdown, selection mode |
| 2.0 | Search, multi-select, API integration |
| 2.1 | Improved keyboard navigation |
| 2.2 | Tagging mode (`allowAdditions`) |
| 2.3 | Enhanced positioning logic |
| 2.4 | **Clearable** option, label callbacks |
| 2.5 | Maintenance and stability focus |

## 12. Comparison Notes

### Unified vs. Specialized Approach

**Semantic UI's Unified Approach**:

**Advantages**:
- **Single API to learn**: One component handles select, combobox, menu, multi-select
- **Consistent behavior**: Same keyboard shortcuts, event system across use cases
- **Shared configuration**: Settings like `action`, `on`, `transition` work everywhere
- **Reduced bundle size**: One component vs. multiple specialized components
- **Easier migration**: Changing dropdown types requires minimal code changes

**Disadvantages**:
- **Larger component**: More code even for simple dropdowns
- **Configuration complexity**: Many settings irrelevant for specific use cases
- **Maintenance burden**: Changes affect multiple use cases
- **Accessibility challenges**: Hard to optimize ARIA for all patterns
- **Performance overhead**: Features you don't use still loaded

### Modern Framework Comparison

**Modern Approach** (React, Vue, Web Components):
- **Select/Combobox**: Form control only
- **Menu/Dropdown**: Action menus
- **Autocomplete**: Search with suggestions
- **Multi-Select**: Specialized multi-selection
- **Typeahead**: Text input with completion

**Semantic UI consolidates these into one**:
```javascript
// Semantic UI - one component, many configs
$('.dropdown').dropdown({ /* config */ });

// Modern approach - different components
<Select />
<Combobox />
<Menu />
<MultiSelect />
<Autocomplete />
```

### Framework Feature Comparison

| Feature | Semantic UI | Modern Frameworks |
|---------|-------------|-------------------|
| **Single/Multi-Select** | ✅ Single component | ❌ Separate components |
| **Search/Filter** | ✅ Built-in | ✅ Some built-in, some separate |
| **Tagging** | ✅ `allowAdditions` | ✅ Dedicated Tagger component |
| **Action Menus** | ✅ Same component | ❌ Separate Menu component |
| **Remote Data** | ✅ API integration | ✅ Usually via props |
| **Nested Menus** | ✅ Supported | ⚠️ Separate Menu component |
| **Keyboard Nav** | ✅ Comprehensive | ✅ Usually better (ARIA) |
| **Accessibility** | ⚠️ Limited ARIA | ✅ Full ARIA patterns |
| **Bundle Size** | ⚠️ Larger (unified) | ✅ Smaller (specialized) |
| **Learning Curve** | ✅ One API | ⚠️ Multiple components |
| **Type Safety** | ❌ jQuery-based | ✅ TypeScript first |
| **Framework Agnostic** | ✅ jQuery only | ✅ Web components |

### When Semantic UI's Approach Excels

1. **Rapid prototyping**: One component handles many use cases
2. **Consistent UX**: Same behavior across application
3. **jQuery ecosystems**: Fits naturally in existing jQuery projects
4. **Simple projects**: Don't need specialized optimization
5. **Legacy support**: Maintaining existing Semantic UI applications

### When Specialized Components Excel

1. **Accessibility requirements**: Need full ARIA support
2. **Performance critical**: Only load what you need
3. **Type safety**: TypeScript-first development
4. **Modern frameworks**: React/Vue/Svelte ecosystems
5. **Progressive enhancement**: Native `<select>` fallback
6. **Framework agnostic**: Web components standard
7. **Tree shaking**: Eliminate unused code

### Recommendations for Web Component Translation

**Option 1: Maintain Unified Approach**

Create `<ui-dropdown>` with configuration-driven behavior:

```html
<!-- Selection mode -->
<ui-dropdown mode="selection" name="gender">
  <option value="male">Male</option>
  <option value="female">Female</option>
</ui-dropdown>

<!-- Search mode -->
<ui-dropdown mode="search" searchable>
  <!-- ... -->
</ui-dropdown>

<!-- Multi-select mode -->
<ui-dropdown mode="multiple" max-selections="5">
  <!-- ... -->
</ui-dropdown>

<!-- Menu mode -->
<ui-dropdown mode="menu">
  <!-- ... -->
</ui-dropdown>
```

**Pros**:
- Familiar to Semantic UI users
- Single component to maintain
- Easier migration path

**Cons**:
- Larger component size
- Complex internal logic
- Accessibility harder to optimize

**Option 2: Separate Components**

Break into specialized components:

```html
<!-- Form selection -->
<ui-select name="gender">
  <option value="male">Male</option>
</ui-select>

<!-- Searchable selection -->
<ui-combobox name="country" searchable>
  <!-- ... -->
</ui-combobox>

<!-- Multi-select -->
<ui-multi-select name="skills" max="5">
  <!-- ... -->
</ui-multi-select>

<!-- Action menu -->
<ui-menu>
  <ui-menu-item>Action 1</ui-menu-item>
</ui-menu>
```

**Pros**:
- Smaller bundle size per component
- Optimized accessibility per use case
- Better TypeScript support
- Follows web standards philosophy
- Tree-shakeable

**Cons**:
- More components to learn
- Different APIs for similar concepts
- Migration requires more changes

**Option 3: Hybrid Approach**

Core `<ui-dropdown>` with specialized extensions:

```html
<!-- Core dropdown (minimal) -->
<ui-dropdown>
  <button slot="trigger">Select</button>
  <ui-dropdown-menu>
    <ui-dropdown-item>Item 1</ui-dropdown-item>
  </ui-dropdown-menu>
</ui-dropdown>

<!-- Specialized form control -->
<ui-select extends="ui-dropdown" name="field">
  <!-- Optimized for forms -->
</ui-select>

<!-- Specialized multi-select -->
<ui-multi-select extends="ui-dropdown">
  <!-- Optimized for multiple -->
</ui-multi-select>
```

**Pros**:
- Shared core logic
- Specialized optimizations
- Progressive complexity
- Familiar patterns

**Cons**:
- Complex inheritance
- API surface can be confusing

### Recommended Approach: Separate with Shared Primitives

**Best of both worlds**:

1. **Shared primitives** (`ui-popover`, `ui-menu`, `ui-listbox`)
2. **Specialized components** that compose primitives
3. **Consistent API patterns** across components

```html
<!-- Selection uses listbox primitive -->
<ui-select>
  <ui-listbox>
    <ui-option>Item 1</ui-option>
  </ui-listbox>
</ui-select>

<!-- Menu uses same menu primitive -->
<ui-menu-button>
  <ui-menu>
    <ui-menu-item>Action 1</ui-menu-item>
  </ui-menu>
</ui-menu-button>

<!-- Combobox composes input + listbox -->
<ui-combobox>
  <input type="text">
  <ui-listbox>
    <ui-option>Suggestion 1</ui-option>
  </ui-listbox>
</ui-combobox>
```

**Benefits**:
- **Reusable primitives** reduce code duplication
- **Specialized components** optimize for use case
- **Consistent patterns** (all use `ui-listbox`, `ui-menu`)
- **Smaller bundles** (only load what you need)
- **Better accessibility** (optimized ARIA per component)
- **Web standards aligned** (follows ARIA authoring practices)

**Migration Path**:
- Map Semantic UI dropdown modes to specific components
- Provide compatibility layer for gradual migration
- Document equivalencies clearly

### Key Differences to Address

1. **jQuery dependency**: Eliminate, use native DOM APIs
2. **Class-based API**: Use attributes and properties
3. **Settings object**: Convert to component properties/attributes
4. **Callbacks**: Use native Custom Events
5. **Behaviors**: Convert to methods on component instance
6. **Global initialization**: Use automatic custom element registration
7. **ARIA**: Add comprehensive accessibility support
8. **Progressive enhancement**: Support SSR and no-JS scenarios

---

## Summary

The Semantic UI Classic Dropdown is a **highly versatile, unified component** that consolidates form selection, search, multi-select, and menu functionality into a single API. Its class-based + jQuery architecture emphasizes developer convenience through a consistent API, but this comes at the cost of component size and accessibility limitations.

**Key Strengths**:
- Unified API reduces learning curve
- Comprehensive feature set (search, multi-select, remote data, tagging)
- Rich composition patterns (icons, images, flags, nested menus)
- Extensive configuration via settings object
- Well-documented callbacks and behaviors

**Key Limitations**:
- Limited built-in accessibility (no ARIA patterns)
- jQuery dependency
- Larger bundle size (all features always loaded)
- Complex internal state management
- In maintenance mode (no active development)

**For Web Component Translation**:
Recommend **separate specialized components** (`<ui-select>`, `<ui-combobox>`, `<ui-multi-select>`, `<ui-menu>`) that compose shared primitives (`<ui-listbox>`, `<ui-popover>`, `<ui-menu>`). This approach:
- Aligns with modern web standards and ARIA authoring practices
- Enables smaller bundles and better tree-shaking
- Allows accessibility optimization per use case
- Maintains conceptual familiarity through consistent primitive APIs
- Supports progressive enhancement and framework-agnostic usage

The unified approach was valuable in the jQuery era for consistency, but modern web component architecture benefits from specialized components with shared primitives—delivering the best of both worlds: consistency through primitives, optimization through specialization.

# Semantic UI Classic - Input Usage Patterns

## Component URL
https://semantic-ui.com/elements/input.html
Status: ✅ Working
Version: Semantic UI 2.x
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Extensive documentation with HTML markup patterns, CSS classes, states, variations, sizes, icon patterns, labeled inputs, action patterns, and accessibility considerations.

## Component Definition
- **Core purpose**: Elicit a response from a user through text input entry. A fundamental form element that serves as the foundation for collecting user data across forms, searches, filters, and other interactive contexts.
- **Mental model**: A flexible, extensible text input field that can be enhanced with labels, icons, buttons, and visual variations while maintaining semantic HTML structure and accessibility.
- **Semantic meaning**: Represents user input capability, commonly used for form fields, search queries, and data entry.

## Pattern Support Levels
- **Native**: Built on standard `<input>` HTML element with CSS class modifiers
- **Composed**: Via container wrapping for icons, labels, and action buttons
- **CSS-only**: Visual variations through class-based styling

## Basic Usage

### Minimal Structure
```html
<div class="ui input">
  <input type="text" placeholder="Search...">
</div>
```

### With Placeholder
```html
<div class="ui input">
  <input type="text" placeholder="Enter text...">
</div>
```

### Form Field Integration
```html
<div class="ui form">
  <div class="field">
    <label>Username</label>
    <div class="ui input">
      <input type="text" placeholder="Enter username">
    </div>
  </div>
</div>
```

## HTML Structure Pattern

### Standard Input Container
```html
<div class="ui input">
  <input type="text">
</div>
```

**Key Components:**
- Container: `<div class="ui input">` - Required wrapper for styling and state management
- Input: `<input type="text">` or other input types - Native form input element
- Optional: `<i class="icon">` for icon variants
- Optional: `<label>` for labeled inputs
- Optional: `<button>` for action inputs

### Icon Input Structure
```html
<div class="ui icon input">
  <input type="text" placeholder="Search...">
  <i class="search icon"></i>
</div>
```

**Icon Placement:**
- Icon placed **after** input element in markup (appears visually on right by default)
- Icon position determined by CSS, not markup order
- Note: Input icons do not receive `pointer-events` unless using `link icon` class

### Labeled Input Structure
```html
<div class="ui labeled input">
  <div class="ui label">
    $
  </div>
  <input type="text" placeholder="0.00">
</div>
```

### Action Input Structure
```html
<div class="ui action input">
  <input type="text" placeholder="Search...">
  <button class="ui button">Search</button>
</div>
```

### Left Icon Input
```html
<div class="ui left icon input">
  <i class="user icon"></i>
  <input type="text" placeholder="Username">
</div>
```

## Input Types

### Text Input (Default)
```html
<div class="ui input">
  <input type="text" placeholder="Enter text">
</div>
```

### Email Input
```html
<div class="ui input">
  <input type="email" placeholder="name@example.com">
</div>
```

### Password Input
```html
<div class="ui input">
  <input type="password" placeholder="Enter password">
</div>
```

### Number Input
```html
<div class="ui input">
  <input type="number" placeholder="Enter number">
</div>
```

### Search Input
```html
<div class="ui input">
  <input type="search" placeholder="Search...">
</div>
```

### URL Input
```html
<div class="ui input">
  <input type="url" placeholder="https://example.com">
</div>
```

### Telephone Input
```html
<div class="ui input">
  <input type="tel" placeholder="(555) 123-4567">
</div>
```

## States

### Focus State
```html
<div class="ui focus input">
  <input type="text" placeholder="Focused input...">
</div>
```

**Visual Feedback:**
- Border highlight or color change
- Shadow effect (typically)
- Indicates active user interaction

### Disabled State
```html
<div class="ui input">
  <input type="text" placeholder="Disabled" disabled>
</div>
```

**Characteristics:**
- `disabled` attribute on input element
- Reduced opacity or grayscale appearance
- No user interaction allowed
- Cursor indicates non-interactive state

### Error State
```html
<div class="ui error input">
  <input type="text" placeholder="Invalid input">
</div>
```

**Characteristics:**
- `.error` class on container
- Red or error-colored border/styling
- Indicates validation failure
- Often paired with error messages

### Loading State
```html
<div class="ui loading input">
  <input type="text" placeholder="Loading...">
  <i class="search icon"></i>
</div>
```

**Note:** "An icon input field can show that it is currently loading data" and modifies the icon display automatically with animation.

### Readonly State
```html
<div class="ui input">
  <input type="text" value="Read-only content" readonly>
</div>
```

**Characteristics:**
- `readonly` attribute on input element
- Content visible but cannot be edited
- Can be selected and copied
- Different visual treatment from disabled

## Visual Variations

### Icon Input
```html
<div class="ui icon input">
  <input type="text" placeholder="Search...">
  <i class="search icon"></i>
</div>
```

**Features:**
- Icon displayed inside input field
- Icons do not receive pointer events by default
- Reduces visual clutter

### Left Icon Input
```html
<div class="ui left icon input">
  <i class="user icon"></i>
  <input type="text" placeholder="Username">
</div>
```

**Use Cases:**
- Username or user-related inputs
- Category/type indicators
- Semantic visual associations

### Labeled Input (Prefix)
```html
<div class="ui labeled input">
  <div class="ui label">
    $
  </div>
  <input type="text" placeholder="0.00">
</div>
```

**Common Prefixes:**
- Currency symbols: `$`, `€`, `¥`
- Domain extensions: `.com`, `.net`, `.org`
- Units: `kg`, `lbs`, `cm`

### Labeled Input (Suffix)
```html
<div class="ui right labeled input">
  <input type="text" placeholder="Enter domain">
  <div class="ui label">
    .com
  </div>
</div>
```

### Labeled with Dropdown
```html
<div class="ui labeled input">
  <div class="ui dropdown label">
    <div class="text">http://</div>
    <i class="dropdown icon"></i>
    <div class="menu">
      <div class="item">http://</div>
      <div class="item">https://</div>
    </div>
  </div>
  <input type="text" placeholder="example.com">
</div>
```

### Action Input
```html
<div class="ui action input">
  <input type="text" placeholder="Search...">
  <button class="ui button">Search</button>
</div>
```

**Common Actions:**
- Search button
- Submit button
- Checkout button
- Send button

### Transparent Input
```html
<div class="ui transparent input">
  <input type="text" placeholder="Search...">
</div>
```

**Characteristics:**
- Removes background color
- Minimal appearance
- Useful for subtle inputs in dashboards or data tables

### Inverted Input
```html
<div class="ui inverted input">
  <input type="text" placeholder="Search...">
</div>
```

**Use Cases:**
- Dark background contexts
- Inverted color schemes
- Header/navbar inputs

### Fluid Input
```html
<div class="ui fluid input">
  <input type="text" placeholder="Full width...">
</div>
```

**Characteristics:**
- Expands to fill container width
- Responsive sizing
- Common in forms and search bars

## Size Patterns

### Mini Input
```html
<div class="ui mini input">
  <input type="text" placeholder="Mini">
</div>
```

### Small Input
```html
<div class="ui small input">
  <input type="text" placeholder="Small">
</div>
```

### Medium Input (Default)
```html
<div class="ui input">
  <input type="text" placeholder="Medium (default)">
</div>
```

### Large Input
```html
<div class="ui large input">
  <input type="text" placeholder="Large">
</div>
```

### Big Input
```html
<div class="ui big input">
  <input type="text" placeholder="Big">
</div>
```

### Huge Input
```html
<div class="ui huge input">
  <input type="text" placeholder="Huge">
</div>
```

### Massive Input
```html
<div class="ui massive input">
  <input type="text" placeholder="Massive">
</div>
```

**Note:** "Inputs will automatically size themselves unless you manually declare a width."

## Prefix & Suffix Patterns

### Currency Input
```html
<div class="ui labeled input">
  <div class="ui label">
    $
  </div>
  <input type="text" placeholder="0.00">
</div>
```

### Domain Extension Input
```html
<div class="ui right labeled input">
  <input type="text" placeholder="mysite">
  <div class="ui label">
    .com
  </div>
</div>
```

### Unit Input
```html
<div class="ui right labeled input">
  <input type="text" placeholder="100">
  <div class="ui label">
    kg
  </div>
</div>
```

### URL Input with Dropdown Prefix
```html
<div class="ui action input">
  <select class="ui compact dropdown">
    <option selected>http://</option>
    <option>https://</option>
  </select>
  <input type="text" placeholder="example.com">
</div>
```

## Label & Placeholder Patterns

### Input with Label Above
```html
<div class="ui form">
  <div class="field">
    <label>Email Address</label>
    <div class="ui input">
      <input type="email" placeholder="example@domain.com">
    </div>
  </div>
</div>
```

### Input with Placeholder Only
```html
<div class="ui input">
  <input type="text" placeholder="Enter your name...">
</div>
```

### Input with Label and Helper Text
```html
<div class="ui form">
  <div class="field">
    <label>Username</label>
    <div class="ui input">
      <input type="text" placeholder="Enter username">
    </div>
    <small style="display: block; margin-top: 8px;">
      Username must be at least 3 characters
    </small>
  </div>
</div>
```

### Input with Error Message
```html
<div class="ui form">
  <div class="field error">
    <label>Email Address</label>
    <div class="ui input">
      <input type="email" value="invalid-email">
    </div>
    <span class="error-message" style="color: #e0b4b4;">
      Please enter a valid email address
    </span>
  </div>
</div>
```

## Validation Patterns

### Basic Validation (Form Integration)
```html
<div class="ui form">
  <div class="field">
    <label>Username</label>
    <div class="ui input">
      <input type="text" name="username" required>
    </div>
  </div>

  <button class="ui button" type="submit">Submit</button>
</div>

<script>
  $('.ui.form').form({
    fields: {
      username: 'empty'
    }
  });
</script>
```

### Email Validation
```html
<div class="ui form">
  <div class="field">
    <label>Email Address</label>
    <div class="ui input">
      <input type="email" name="email" required>
    </div>
  </div>
</div>

<script>
  $('.ui.form').form({
    fields: {
      email: 'email'
    }
  });
</script>
```

### Minimum Length Validation
```html
<div class="ui form">
  <div class="field">
    <label>Password</label>
    <div class="ui input">
      <input type="password" name="password" minlength="8">
    </div>
  </div>
</div>

<script>
  $('.ui.form').form({
    fields: {
      password: 'minLength[8]'
    }
  });
</script>
```

### Custom Validation
```javascript
$('.ui.form').form({
  fields: {
    username: {
      identifier: 'username',
      rules: [
        {
          type: 'empty',
          prompt: 'Username is required'
        },
        {
          type: 'minLength[3]',
          prompt: 'Username must be at least 3 characters'
        }
      ]
    }
  }
});
```

## Integration Patterns

### Search Input with Icon and Button
```html
<div class="ui form">
  <div class="field">
    <div class="ui icon input">
      <input type="text" placeholder="Search...">
      <i class="search icon"></i>
    </div>
  </div>
</div>
```

### Inline Form Input
```html
<div class="ui form">
  <div class="inline fields">
    <div class="field">
      <label>First Name</label>
      <div class="ui input">
        <input type="text" placeholder="First Name">
      </div>
    </div>
    <div class="field">
      <label>Last Name</label>
      <div class="ui input">
        <input type="text" placeholder="Last Name">
      </div>
    </div>
  </div>
</div>
```

### Input in Card
```html
<div class="ui card">
  <div class="content">
    <div class="ui form">
      <div class="field">
        <label>Enter value</label>
        <div class="ui input">
          <input type="text">
        </div>
      </div>
    </div>
  </div>
</div>
```

### Input in Table Cell
```html
<table class="ui table">
  <tbody>
    <tr>
      <td>
        <div class="ui mini input">
          <input type="text" value="Editable">
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

## CSS Classes Reference

### Container Classes
| Class | Description |
|-------|-------------|
| `.ui.input` | Base input container (required) |
| `.ui.icon.input` | Input with icon on right |
| `.ui.left.icon.input` | Input with icon on left |
| `.ui.labeled.input` | Input with label/prefix container |
| `.ui.right.labeled.input` | Input with label/suffix on right |
| `.ui.action.input` | Input with action button |
| `.ui.transparent.input` | Removes background |
| `.ui.inverted.input` | Light text on dark background |
| `.ui.fluid.input` | Full width container |

### State Classes
| Class | Description |
|-------|-------------|
| `.focus` | Applied when input has focus |
| `.disabled` | Applied when input is disabled |
| `.error` | Applied for validation error state |
| `.loading` | Applied when loading data |

### Size Classes
| Class | Description |
|-------|-------------|
| `.mini` | Extra small input |
| `.small` | Small input |
| (default) | Medium input (no size class) |
| `.large` | Large input |
| `.big` | Very large input |
| `.huge` | Extra large input |
| `.massive` | Maximum size input |

### Combination Examples
```html
<!-- Small transparent input -->
<div class="ui small transparent input">
  <input type="text">
</div>

<!-- Large fluid action input -->
<div class="ui large fluid action input">
  <input type="text" placeholder="Search...">
  <button class="ui button">Search</button>
</div>

<!-- Icon input with fluid sizing -->
<div class="ui fluid icon input">
  <input type="text" placeholder="Search...">
  <i class="search icon"></i>
</div>

<!-- Labeled large input -->
<div class="ui large labeled input">
  <div class="ui label">
    $
  </div>
  <input type="text" placeholder="Amount">
</div>
```

## Accessibility

### Native HTML Features
- Uses standard `<input>` element
- Native keyboard support
- Native form element behavior
- Screen reader compatibility

### Accessible Labeling
```html
<!-- Linked label (best practice) -->
<label for="username">Username:</label>
<div class="ui input">
  <input id="username" type="text">
</div>

<!-- Or with form field structure -->
<div class="ui form">
  <div class="field">
    <label>Username</label>
    <div class="ui input">
      <input type="text">
    </div>
  </div>
</div>
```

### Accessible Error States
```html
<div class="field error">
  <label for="email">Email Address</label>
  <div class="ui input">
    <input id="email" type="email" aria-describedby="email-error">
  </div>
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>
</div>
```

### Accessible Placeholder
```html
<!-- Good: Placeholder plus label -->
<label for="search">Search</label>
<div class="ui input">
  <input id="search" type="text" placeholder="Enter search term...">
</div>

<!-- Avoid: Placeholder only (no visible label) -->
<div class="ui input">
  <input type="text" placeholder="Search...">
</div>
```

### Input Attributes for Accessibility
- Use `type` attribute appropriately (email, tel, number, etc.)
- Use `required` attribute for mandatory fields
- Use `readonly` instead of `disabled` when content should be shown
- Use `aria-label` or `aria-labelledby` when visible labels aren't available
- Use `aria-describedby` for helper text and error messages

## Advanced Patterns

### Dynamic Error Handling
```html
<div class="ui form">
  <div class="field">
    <label>Username</label>
    <div class="ui input">
      <input id="username" type="text">
    </div>
    <span id="username-error" style="display:none; color: #e0b4b4;">
      Username is already taken
    </span>
  </div>
</div>

<script>
  $('#username').on('blur', function() {
    // Check username availability
    $.get('/api/check-username', { username: this.value }, function(data) {
      if (!data.available) {
        $('#username-error').show();
        $('#username').parents('.field').addClass('error');
      } else {
        $('#username-error').hide();
        $('#username').parents('.field').removeClass('error');
      }
    });
  });
</script>
```

### Combo Input (Select + Input)
```html
<div class="ui action input">
  <select class="ui compact dropdown">
    <option value="http">http://</option>
    <option value="https">https://</option>
  </select>
  <input type="text" placeholder="example.com">
</div>
```

### Clearable Input
```html
<div class="ui icon input">
  <input type="text" placeholder="Search...">
  <i class="times link icon" onclick="this.previousElementSibling.value=''; this.previousElementSibling.focus();"></i>
</div>
```

### Search Input with Suggestions
```html
<div class="ui search">
  <div class="ui icon input">
    <input class="prompt" type="text" placeholder="Search...">
    <i class="search icon"></i>
  </div>
  <div class="results"></div>
</div>

<script>
  $('.ui.search').search({
    apiSettings: {
      url: '/api/search?query={query}'
    }
  });
</script>
```

### Autocomplete Input
```html
<div class="field">
  <label>Country</label>
  <div class="ui input">
    <input type="text" list="countries" placeholder="Enter country name">
    <datalist id="countries">
      <option value="United States">
      <option value="United Kingdom">
      <option value="Canada">
    </datalist>
  </div>
</div>
```

### Loading/Progress State
```html
<div class="ui form">
  <div class="field">
    <label>Saving...</label>
    <div class="ui loading input">
      <input type="text" value="Saving your changes...">
      <i class="spinner loading icon"></i>
    </div>
  </div>
</div>
```

## Important Implementation Notes

### Icon Pointer Events
**Critical Note:** "Input icons do not receive `pointer-events` unless a `link icon` is used."
- By default, icons are non-interactive
- Use `link icon` class to make icons clickable
- Useful for action icons (clear, search, submit)

```html
<!-- Clickable icon (with link icon class) -->
<div class="ui icon input">
  <input type="text">
  <i class="link search icon"></i>
</div>

<!-- Non-clickable icon (default) -->
<div class="ui icon input">
  <input type="text">
  <i class="info icon"></i>
</div>
```

### Loading State Behavior
- Automatically modifies icon display when `.loading` class is applied
- Icon animates to indicate loading state
- Typically paired with disabled input to prevent editing during operations

### Focus Management
- Focus state applied via CSS based on input element's focus
- Container can receive `.focus` class for styling
- Native focus outline can be overridden via CSS

## Composition Patterns

### In Forms
- Always wrap in `.ui.form` parent for consistent styling
- Use `.field` or `.fields` containers for organization
- Supports validation integration
- Label positioning customizable

### In Grids
- Can be used within grid columns for responsive layouts
- Fluid input fills grid column width
- Combine with grid size classes for responsive sizing

### In Segments
- Common pattern for grouped related inputs
- Provides visual separation
- Often used in settings or configuration screens

## Notes

### Documentation Gaps
- No explicit mention of readonly attribute handling
- No discussion of datalists or native autocomplete
- No HTML5 validation API integration notes
- Limited discussion of focus/blur event patterns
- No mentioned patterns for multi-line textarea alternative

### Semantic UI Classic Specific Characteristics
1. **Class-Based System**: Pure CSS class modifiers, no component library
2. **jQuery Enhancement**: Minimal JavaScript for form validation
3. **Native HTML Foundation**: Built on standard `<input>` elements
4. **Extensible Architecture**: Can be combined with other UI components
5. **No Shadow DOM**: Standard DOM structure with CSS styling

### Unique Patterns Observed
1. **Dual Label Placement**: Both left (labeled input) and right (right labeled input) label patterns
2. **Icon Flexibility**: Support for icons in multiple positions with pointer-events control
3. **Action Input**: Built-in support for action buttons within input containers
4. **Size Gradient**: Seven distinct size options (mini to massive)
5. **State Transparency**: Loading state with automatic icon animation

### Best Practices for Implementation
1. Always wrap input in `.ui.input` container
2. Use semantic input types (email, tel, number) for better UX
3. Provide visible labels or aria-labels for accessibility
4. Use fluid class for full-width inputs in responsive designs
5. Combine with form validation for error states
6. Consider icon placement and pointer-events for usability
7. Use size classes consistently across related inputs

## Research Metadata

**Research Date:** 2025-11-05
**Documentation Source:** https://semantic-ui.com/elements/input.html
**Framework Version:** Semantic UI 2.x (Classic)
**Component Category:** Element (Form Component)
**JavaScript Dependency:** Optional (required for form validation integration)
**Key Dependencies:** None (standalone element)

**Related Components:**
- Form (container and validation)
- Icon (icon display)
- Label (labeling and prefixes)
- Button (action inputs)
- Search (autocomplete variation)

**Documentation Completeness:**
- ✅ HTML structure and markup patterns
- ✅ CSS classes and size modifiers
- ✅ State patterns (focus, disabled, error, loading)
- ✅ Visual variations (icon, labeled, action, transparent, inverted, fluid)
- ✅ Integration patterns with forms
- ✅ Accessibility with labels and semantic HTML
- ⚠️ Limited JavaScript API documentation
- ⚠️ No explicit ARIA attribute recommendations
- ❌ No CSS variable/LESS customization reference
- ❌ No keyboard interaction documentation
- ❌ No screen reader testing notes

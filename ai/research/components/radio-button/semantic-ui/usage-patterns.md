# Semantic UI Classic - Radio Button Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/modules/checkbox.html
Status: ✅ Working (Radio buttons documented as checkbox variation)
Version: Classic (jQuery-based)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of checkbox patterns including radio buttons. Radio buttons are presented as a checkbox variant with exclusive selection behavior. Includes detailed API reference, behavioral methods, callbacks, and both declarative HTML and JavaScript approaches.

## Component Definition
- **Core purpose**: Provides mutually exclusive selection within a group of options. Radio buttons allow users to select exactly one option from a set of choices.
- **Mental model**: A group of circular selection indicators where selecting one automatically deselects all others in the same group. Users understand radios as "pick exactly one" controls, commonly used for survey questions, settings, and exclusive choices.
- **Semantic meaning**: Communicates exclusive selection through circular visual indicator, name-based grouping (`name` attribute), and mutually exclusive behavior. The radio type enforces the constraint that only one option can be selected at a time within a named group.

## Pattern Support Levels
- **Native**: Dedicated class/API with JavaScript behavior module
- **Composed**: Via HTML composition with standard input elements
- **CSS-only**: Visual styling works without JavaScript, but callbacks require JS initialization

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text label | ✅ | Native | Standard text label with `<label>` element |
| No label (fitted) | ✅ | Native | `class="ui fitted checkbox"` - radio without visible label |
| HTML label content | ✅ | Composed | Labels can contain HTML markup |
| Linked label | ✅ | Native | Label `for` attribute links to input `id` for click handling |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard radio | ✅ | Native | `<div class="ui radio checkbox">` with `input type="radio"` |
| Slider radio | ✅ | Native | `class="ui slider checkbox"` with `input type="radio"` - slider style |
| Toggle radio | ✅ | Native | `class="ui toggle checkbox"` with `input type="radio"` - toggle switch style |
| Radio group | ✅ | Native | Multiple radios sharing same `name` attribute for exclusive selection |
| Fitted radio | ✅ | Native | `class="ui fitted radio checkbox"` - compact, no label spacing |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked | ✅ | Native | `checked` attribute on input or `.checkbox('check')` method |
| Unchecked | ✅ | Native | Default state or `.checkbox('uncheck')` method |
| Disabled | ✅ | Native | `disabled` attribute on input or `class="ui disabled checkbox"` |
| Read-only | ✅ | Native | `class="ui read-only checkbox"` - prevents interaction |
| Indeterminate | ❌ | N/A | Not applicable to radio buttons (checkbox-only feature) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size variations; requires custom CSS |
| Color options | ❌ | CSS-only | No built-in color variations; customizable via CSS |
| Fitted | ✅ | Native | `class="ui fitted checkbox"` - removes label spacing |
| Slider style | ✅ | Native | `class="ui slider checkbox"` - slider appearance |
| Toggle style | ✅ | Native | `class="ui toggle checkbox"` - toggle switch appearance |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | Fires on any state change |
| onChecked callback | ✅ | Native | Fires specifically when checked |
| onUnchecked callback | ✅ | Native | Fires when unchecked (though rare for radios) |
| beforeChecked callback | ✅ | Native | Fires before check (return false cancels) |
| beforeUnchecked callback | ✅ | Native | Fires before uncheck (return false cancels) |
| Programmatic control | ✅ | Native | Full API: check, uncheck, toggle, enable, disable |
| Event attachment | ✅ | Native | `attach events(selector, behavior)` connects radio to other elements |
| Conditional validation | ✅ | Composed | Use before* callbacks for validation logic |
| Uncheckable control | ✅ | Native | `uncheckable: 'auto'` prevents unchecking for radios by default |

## Code Examples

### Basic Radio Button Group
```html
<!-- Standard Radio Group -->
<div class="field">
  <label>How often do you use checkboxes?</label>
  <div class="ui radio checkbox">
    <input type="radio" name="frequency" value="weekly">
    <label>Once a week</label>
  </div>
  <div class="ui radio checkbox">
    <input type="radio" name="frequency" value="2-3weekly">
    <label>2-3 times a week</label>
  </div>
  <div class="ui radio checkbox">
    <input type="radio" name="frequency" value="daily">
    <label>Once a day</label>
  </div>
  <div class="ui radio checkbox">
    <input type="radio" name="frequency" value="twicedaily">
    <label>Twice a day</label>
  </div>
</div>
```

### Slider Radio Buttons
```html
<!-- Slider Style Radio Group -->
<div class="field">
  <label>Select throughput</label>
  <div class="ui slider checkbox">
    <input type="radio" name="throughput" value="20">
    <label>20 mbps max</label>
  </div>
  <div class="ui slider checkbox">
    <input type="radio" name="throughput" value="10">
    <label>10 mbps max</label>
  </div>
  <div class="ui slider checkbox">
    <input type="radio" name="throughput" value="5">
    <label>5 mbps max</label>
  </div>
  <div class="ui slider checkbox">
    <input type="radio" name="throughput" value="unlimited">
    <label>Unmetered</label>
  </div>
</div>
```

### Toggle Radio Buttons
```html
<!-- Toggle Style Radio (less common pattern) -->
<div class="ui toggle checkbox">
  <input type="radio" name="newsletter" value="yes">
  <label>Subscribe to weekly newsletter</label>
</div>
<div class="ui toggle checkbox">
  <input type="radio" name="newsletter" value="no">
  <label>No newsletter</label>
</div>
```

### States
```html
<!-- Checked State -->
<div class="ui radio checkbox">
  <input type="radio" name="status" checked>
  <label>Active</label>
</div>

<!-- Disabled State -->
<div class="ui disabled radio checkbox">
  <input type="radio" name="status" disabled>
  <label>Disabled</label>
</div>

<!-- Read-Only State -->
<div class="ui read-only radio checkbox">
  <input type="radio" name="status">
  <label>Read Only</label>
</div>
```

### Fitted Radio (No Label Spacing)
```html
<!-- Fitted Radio - compact presentation -->
<div class="ui fitted radio checkbox">
  <input type="radio" name="compact">
</div>
```

### With ID Linking
```html
<!-- Explicit ID/For Linking -->
<div class="ui radio checkbox">
  <input type="radio" name="option" id="option1" value="1">
  <label for="option1">Option One</label>
</div>
<div class="ui radio checkbox">
  <input type="radio" name="option" id="option2" value="2">
  <label for="option2">Option Two</label>
</div>
```

## JavaScript API

### Initialization
```javascript
// Basic initialization
$('.ui.checkbox').checkbox();

// With settings
$('.ui.radio.checkbox').checkbox({
  uncheckable: 'auto',  // Prevents unchecking for radios
  fireOnInit: false,
  onChange: function() {
    console.log('Radio state changed');
  },
  onChecked: function() {
    console.log('Radio checked');
  },
  onUnchecked: function() {
    console.log('Radio unchecked (rare)');
  }
});
```

### State Modification Methods
```javascript
// Check a radio (triggers callbacks)
$('.ui.radio.checkbox').checkbox('check');

// Uncheck (rarely used for radios)
$('.ui.radio.checkbox').checkbox('uncheck');

// Toggle state (switches between checked/unchecked)
$('.ui.radio.checkbox').checkbox('toggle');

// Set checked without triggering callbacks
$('.ui.radio.checkbox').checkbox('set checked');

// Set unchecked without triggering callbacks
$('.ui.radio.checkbox').checkbox('set unchecked');

// Enable interaction
$('.ui.radio.checkbox').checkbox('enable');

// Disable interaction
$('.ui.radio.checkbox').checkbox('disable');

// Set enabled without callbacks
$('.ui.radio.checkbox').checkbox('set enabled');

// Set disabled without callbacks
$('.ui.radio.checkbox').checkbox('set disabled');
```

### Query Methods
```javascript
// Check if element is a radio
var isRadio = $('.ui.checkbox').checkbox('is radio');

// Check if currently checked
var isChecked = $('.ui.checkbox').checkbox('is checked');

// Check if currently unchecked
var isUnchecked = $('.ui.checkbox').checkbox('is unchecked');

// Check if state can change
var canChange = $('.ui.checkbox').checkbox('can change');

// Check if can be unchecked (respects uncheckable setting)
var canUncheck = $('.ui.checkbox').checkbox('can uncheck');

// Check if checking is allowed
var shouldAllowCheck = $('.ui.checkbox').checkbox('should allow check');

// Check if unchecking is allowed
var shouldAllowUncheck = $('.ui.checkbox').checkbox('should allow uncheck');
```

### Event Attachment
```javascript
// Attach events from one element to control checkbox
$('.ui.radio.checkbox').checkbox('attach events', '.check.button', 'check');
$('.ui.radio.checkbox').checkbox('attach events', '.uncheck.button', 'uncheck');
$('.ui.radio.checkbox').checkbox('attach events', '.toggle.button', 'toggle');
```

## Callback Events

### All Callbacks
```javascript
$('.ui.radio.checkbox').checkbox({
  // Called before checkbox is checked
  // Return false to prevent checking
  beforeChecked: function() {
    console.log('About to check');
    // Validation logic here
    return true; // or false to cancel
  },

  // Called before checkbox is unchecked
  // Return false to prevent unchecking
  beforeUnchecked: function() {
    console.log('About to uncheck');
    return true; // or false to cancel
  },

  // Called after checkbox is checked
  onChecked: function() {
    console.log('Checked');
  },

  // Called after checkbox is unchecked
  onUnchecked: function() {
    console.log('Unchecked');
  },

  // Called after any state change (check or uncheck)
  onChange: function() {
    console.log('State changed');
  },

  // Called after checkbox is enabled
  onEnable: function() {
    console.log('Enabled');
  },

  // Called after checkbox is disabled
  onDisable: function() {
    console.log('Disabled');
  }
});
```

### Radio Group Coordination Example
```javascript
// Initialize all radios in a group
$('.ui.radio.checkbox').checkbox();

// Listen for changes across the group
$('input[name="frequency"]').change(function() {
  var selectedValue = $('input[name="frequency"]:checked').val();
  console.log('Selected:', selectedValue);
});

// Or use onChange callback
$('.ui.radio.checkbox').checkbox({
  onChange: function() {
    var $radio = $(this);
    if ($radio.checkbox('is checked')) {
      var value = $radio.find('input').val();
      console.log('Selected value:', value);
    }
  }
});
```

### Conditional Checking with Validation
```javascript
$('.ui.radio.checkbox').checkbox({
  beforeChecked: function() {
    // Validate before allowing selection
    if (!isValidSelection()) {
      alert('This option is not currently available');
      return false; // Prevent checking
    }
    return true; // Allow checking
  }
});

function isValidSelection() {
  // Your validation logic
  return true;
}
```

### Master Radio Controller Pattern
```javascript
// Example: Control other elements based on radio selection
$('.ui.radio.checkbox[name="plan"]').checkbox({
  onChecked: function() {
    var planType = $(this).find('input').val();

    // Show/hide relevant sections
    $('.plan-details').hide();
    $('.plan-details[data-plan="' + planType + '"]').show();

    // Update pricing display
    updatePricing(planType);
  }
});
```

## Settings Reference

### All Settings
```javascript
$('.ui.radio.checkbox').checkbox({
  // Whether checkbox can be unchecked
  // 'auto' prevents unchecking for radios, allows for checkboxes
  uncheckable: 'auto', // true, false, 'auto'

  // Fire callbacks on initialization
  fireOnInit: false,

  // Selector settings (rarely customized)
  selector: {
    input: 'input[type=checkbox], input[type=radio]',
    label: 'label'
  },

  // Class names (rarely customized)
  className: {
    checked: 'checked',
    disabled: 'disabled',
    radio: 'radio',
    readOnly: 'read-only'
  },

  // Debug settings
  name: 'Checkbox',
  namespace: 'checkbox',
  silent: false,
  debug: false,
  performance: true,
  verbose: false
});
```

## Notable Features

### 1. Unified Checkbox/Radio API
- **Shared module**: Radio buttons use the same JavaScript module as checkboxes
- **Type detection**: Component automatically detects radio vs checkbox via `input[type]`
- **`is radio` method**: Programmatic way to determine if element functions as radio
- **Intelligent defaults**: `uncheckable: 'auto'` prevents unchecking radios while allowing checkbox unchecking

### 2. Uncheckable Behavior
- **Radio default**: Radios cannot be unchecked once selected (standard HTML behavior)
- **Override option**: Setting `uncheckable: true` allows radios to be unchecked (non-standard)
- **Checkbox flexibility**: Checkboxes can toggle freely regardless of setting
- **Use case**: One-way selections where user must pick an option

### 3. Exclusive Selection via Name Attribute
- **Native HTML**: Relies on standard `name` attribute for grouping
- **Automatic coordination**: Browser handles mutual exclusivity
- **No special JS**: Semantic UI doesn't add custom radio group logic
- **Standard behavior**: Follows HTML spec for radio button groups

### 4. Visual Style Variations
- **Standard radio**: Traditional circular radio button appearance
- **Slider style**: Horizontal slider switch appearance (`class="ui slider checkbox"`)
- **Toggle style**: Toggle switch appearance (`class="ui toggle checkbox"`)
- **Fitted variant**: Removes label spacing for compact layouts
- **Flexibility**: Same functionality with different visual presentations

### 5. Comprehensive Callback System
- **Before callbacks**: `beforeChecked`, `beforeUnchecked` with cancellation via return false
- **After callbacks**: `onChecked`, `onUnchecked`, `onChange`
- **State callbacks**: `onEnable`, `onDisable`
- **Validation support**: Before callbacks enable validation logic
- **Event coordination**: Multiple callback hooks for complex interactions

### 6. Dual Method Variants
- **With callbacks**: `check()`, `uncheck()`, `enable()`, `disable()` trigger callbacks
- **Without callbacks**: `set checked`, `set unchecked`, `set enabled`, `set disabled` skip callbacks
- **Use case separation**: Callback versions for user actions, set versions for programmatic state
- **Prevents loops**: Set methods avoid infinite callback loops in complex UIs

### 7. Event Attachment Helper
- **`attach events` method**: Connect external elements to control checkbox
- **Behavior binding**: Specify which checkbox behavior to trigger
- **Decoupled controls**: Separate UI elements can control checkbox state
- **Example**: Buttons that check/uncheck/toggle specific radios

### 8. Read-Only State
- **Non-standard**: `class="ui read-only checkbox"` prevents interaction
- **Different from disabled**: Read-only maintains visual active appearance
- **Form submission**: Read-only values still submit (unlike disabled)
- **Use case**: Display current selection while preventing changes

### 9. Query Methods for State
- **`is checked`/`is unchecked`**: Current state queries
- **`can change`**: Whether state modification is allowed
- **`can uncheck`**: Respects uncheckable setting
- **`should allow check/uncheck`**: Combined validation and settings check
- **Conditional logic**: Enable complex UI behaviors based on state

### 10. jQuery Module Pattern
- **Behavior module**: Follows Semantic UI's consistent module architecture
- **Method invocation**: String-based method calls via jQuery plugin
- **State storage**: Uses jQuery data() for component state
- **Chainable**: Standard jQuery chainable API

## Research Notes

### Framework Architecture
- **jQuery dependency**: Classic version built on jQuery (not React/Vue/Angular)
- **Shared module**: Radio and checkbox share the same JavaScript behavior module
- **CSS framework**: Visual styling through compositional class names
- **Progressive enhancement**: Works with or without JavaScript initialization

### Design Philosophy
- **HTML standards first**: Leverages native HTML radio button behavior
- **Semantic class names**: Human-readable classes (`radio`, `slider`, `toggle`)
- **Flexible styling**: Same functionality with multiple visual presentations
- **Minimal JavaScript**: Only adds callbacks and helpers, doesn't reinvent radio logic

### Radio-Specific Characteristics
- **Uncheckable default**: `uncheckable: 'auto'` prevents unchecking for radios
- **Rare uncheck callbacks**: `onUnchecked` fires only if uncheckable override used
- **Group coordination**: Relies entirely on native HTML `name` attribute grouping
- **No custom group API**: Unlike some frameworks, no JavaScript-based group management

### Implementation Approach
- **Type detection**: Component checks `input[type]` to determine radio vs checkbox
- **Behavior sharing**: ~90% of checkbox code applies to radios
- **Exclusive selection**: Browser handles mutual exclusivity, not JavaScript
- **Minimal overhead**: No custom event coordination for radio groups

### Common Patterns
- **Survey questions**: Radio groups for "pick one" questions
- **Settings panels**: Exclusive option selection (plan types, preferences)
- **Multi-step forms**: Choice selection in form flows
- **Slider alternatives**: Slider style for rating scales or range selections
- **Toggle groups**: Toggle style for binary grouped choices

### Styling Flexibility
- **No size variations**: Unlike buttons, checkboxes don't have built-in size classes
- **Custom theming**: Colors and dimensions customizable via CSS
- **Style types**: Standard, slider, toggle provide visual variety
- **Fitted mode**: Removes spacing for inline or compact layouts

### Accessibility Considerations
- **Native semantics**: Uses standard `<input type="radio">` for screen reader support
- **Label association**: `for` attribute properly associates labels with inputs
- **Keyboard navigation**: Standard tab/arrow key behavior for radio groups
- **ARIA support**: Could be enhanced with ARIA attributes (not shown in docs)
- **Disabled state**: Properly conveys unavailable options

### Form Integration
- **Standard submission**: Radio values submit normally with forms
- **Name grouping**: Standard `name` attribute for exclusive selection
- **Value attribute**: Uses standard HTML `value` for form data
- **Validation**: Can integrate with form validation via callbacks
- **Read-only mode**: Prevents changes while allowing value submission

### jQuery Method Invocation Pattern
```javascript
// String-based method calls
$('.ui.checkbox').checkbox('check');      // Call method
$('.ui.checkbox').checkbox('is checked'); // Call query
$('.ui.checkbox').checkbox({              // Initialize with settings
  onChange: function() { }
});
```

### Callback vs Set Methods Strategy
- **User actions**: Use callback methods (`check`, `uncheck`) to trigger onChange, onChecked, etc.
- **Programmatic updates**: Use set methods (`set checked`, `set unchecked`) to avoid callbacks
- **Prevents loops**: Set methods crucial for avoiding infinite loops in complex UIs
- **State synchronization**: Set methods for syncing state from external sources

### Migration to Modern Frameworks
- **Class-based API**: Translates to component props/classes in React/Vue
- **jQuery methods**: Replace with refs and component methods
- **Callbacks**: Map to event handlers or lifecycle hooks
- **Shared module**: Modern versions separate radio and checkbox components

### Historical Context
- **Pre-component era**: Designed before React/Vue/Angular component models
- **jQuery dominance**: Reflects web development patterns of early 2010s
- **CSS architecture**: Pioneered semantic, compositional class naming
- **Behavior modules**: Consistent pattern across all Semantic UI components

### Differences from Checkbox
- **Uncheckable**: Radios default to `uncheckable: 'auto'` (prevents unchecking)
- **Group behavior**: Radios require `name` attribute for mutual exclusivity
- **Uncheck callbacks**: Rarely fire for radios (only with uncheckable override)
- **Visual indicator**: Circular appearance vs square for checkboxes
- **Selection model**: Exclusive (one) vs multiple (many) selection

### Notable Limitations
- **No built-in sizes**: Must customize sizes via CSS
- **No color variations**: No semantic color classes like buttons
- **Basic ARIA**: Documentation doesn't emphasize accessibility attributes
- **No group wrapper**: No special container component for radio groups
- **Manual styling**: Custom appearance requires CSS knowledge

### Best Practices from Documentation
1. **Always use name attribute**: Required for radio group exclusivity
2. **Include value attribute**: Necessary for form submission
3. **Link labels properly**: Use `for` attribute or wrap input with label
4. **Initialize with jQuery**: Call `.checkbox()` to enable callbacks
5. **Use fitted sparingly**: Only when label spacing is problematic
6. **Leverage before callbacks**: For validation before state changes
7. **Choose appropriate style**: Standard for forms, slider/toggle for settings
8. **Consider read-only**: Instead of disabled when showing current state
9. **Use set methods**: For programmatic updates to avoid callback loops
10. **Group visually**: Use proper markup structure to group related radios

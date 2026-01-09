# Semantic UI Classic - Checkbox Usage Patterns

## Component URL
https://semantic-ui.com/modules/checkbox.html
Status: ✅ Working
Version: Semantic UI 2.x
Last Verified: 2025-11-04

## Documentation Quality
**Comprehensive** - Extensive documentation with multiple types, states, jQuery API, callbacks, and detailed behavior control

## Component Definition
- **Core purpose**: Enable users to select a value from a small set of options, often binary, with support for multiple interaction patterns (checkbox, radio, slider, toggle)
- **Mental model**: A versatile form input component that unifies standard checkboxes, radio buttons, and visual toggle variations into a single module with extensive programmatic control
- **Semantic meaning**: Provides binary or exclusive choice selection with visual feedback and state management

## Unique Characteristic
Semantic UI Classic's Checkbox is distinctive because it **unifies four distinct interaction patterns** (standard checkbox, radio, slider, toggle) into a single module with a sophisticated jQuery API that differentiates between user-triggered and programmatic state changes. The component features a dual API approach where methods like `check` trigger callbacks while `set checked` bypasses them, enabling fine-grained control over state management and event propagation.

## Pattern Support Levels
- **Native**: Dedicated class-based API and jQuery behaviors (e.g., `class="ui checkbox"`, `.checkbox('check')`)
- **Composed**: Via HTML structure with input + label pattern
- **JavaScript-Enhanced**: Rich jQuery API for state management, callbacks, and event attachment

## Type Patterns

| Type | Present | Support | CSS Class | Description |
|------|---------|---------|-----------|-------------|
| Standard checkbox | ✅ | Native | `ui checkbox` | Basic checkbox for multiple selections |
| Radio button | ✅ | Native | `ui radio checkbox` | Exclusive option selection (input type="radio") |
| Slider | ✅ | Native | `ui slider checkbox` | Emphasized selection with slider appearance |
| Toggle | ✅ | Native | `ui toggle checkbox` | On/off switch with toggle appearance |

## State Patterns

| State | Present | Support | CSS Class | Details |
|-------|---------|---------|-----------|---------|
| Checked | ✅ | Native | `.checked` | Selected state, can be set via attribute or JavaScript |
| Unchecked | ✅ | Native | (no class) | Default unselected state |
| Indeterminate | ✅ | JavaScript-only | `.indeterminate` | Neither fully checked nor unchecked (JavaScript-only, commonly used for parent checkboxes in hierarchies) |
| Disabled | ✅ | Native | `.disabled` | Non-interactive state, prevents user interaction |
| Read-only | ✅ | Native | `.read-only` | Cannot be changed but visually distinct from disabled |
| Fitted | ✅ | Native | `.fitted` | No padding reserved for labels (label-less variant) |

## HTML Structure Pattern

### Basic Structure
```html
<div class="ui checkbox">
  <input type="checkbox" name="option">
  <label>Label text</label>
</div>
```

**Key Components:**
- Container: `<div class="ui checkbox">` - Required wrapper with type modifier classes
- Input: `<input type="checkbox">` or `<input type="radio">` - Native form input
- Label: `<label>` - Text label, clickable area expansion

**Linked Labels (Alternative):**
```html
<div class="ui checkbox">
  <input type="checkbox" id="unique-id">
  <label for="unique-id">Label text</label>
</div>
```

**Notes:**
- Linked labels (via `for` attribute) provide basic label interaction without JavaScript
- JavaScript initialization enhances label behavior and provides callbacks
- Input element must be inside the `.ui.checkbox` container

## jQuery API

### Initialization
```javascript
$('.ui.checkbox').checkbox();

// With settings
$('.ui.checkbox').checkbox({
  uncheckable: true,
  fireOnInit: false,
  onChange: function() { /* ... */ }
});
```

### State Change Methods (With Callbacks)

| Method | Description | Triggers Callbacks |
|--------|-------------|-------------------|
| `toggle` | Switch current state | ✅ Yes |
| `check` | Set to checked state | ✅ Yes |
| `uncheck` | Set to unchecked state | ✅ Yes |
| `indeterminate` | Set to indeterminate state | ✅ Yes |
| `determinate` | Set to determinate state | ✅ Yes |
| `enable` | Enable interaction | ✅ Yes |
| `disable` | Disable interaction | ✅ Yes |

### Programmatic Methods (Without Callbacks)

| Method | Description | Triggers Callbacks |
|--------|-------------|-------------------|
| `set checked` | Set to checked without callbacks | ❌ No |
| `set unchecked` | Set to unchecked without callbacks | ❌ No |
| `set indeterminate` | Set to indeterminate without callbacks | ❌ No |
| `set determinate` | Set to determinate without callbacks | ❌ No |
| `set enabled` | Enable without callbacks | ❌ No |
| `set disabled` | Disable without callbacks | ❌ No |

**Critical Distinction:**
> "Calling a behavior like `check` will trigger an element's callbacks, however using `set checked` will adjust the checkbox state _without triggering callbacks_. This differentiation is important to differentiate between programmatic changes, and user-invoked changes to state."

### Query Methods (Return Booleans)

| Method | Returns | Description |
|--------|---------|-------------|
| `is radio` | Boolean | Whether element is radio selection |
| `is checked` | Boolean | Whether currently checked |
| `is unchecked` | Boolean | Whether currently unchecked |
| `can change` | Boolean | Whether able to be changed |
| `can uncheck` | Boolean | Whether able to be unchecked |
| `should allow check` | Boolean | Validates if element can be checked (includes beforeChecked callback) |
| `should allow uncheck` | Boolean | Validates if element can be unchecked (includes beforeUnchecked callback) |
| `should allow determinate` | Boolean | Validates determinate state availability |
| `should allow indeterminate` | Boolean | Validates indeterminate state availability |

### Utility Methods

| Method | Description |
|--------|-------------|
| `attach events(selector, behavior)` | Attach checkbox events to another element. Default behavior is 'toggle', but other methods can be specified |

### Method Invocation Examples
```javascript
// Toggle state
$('.ui.checkbox').checkbox('toggle');

// Check with callbacks
$('.ui.checkbox').checkbox('check');

// Set checked without callbacks (programmatic)
$('.ui.checkbox').checkbox('set checked');

// Query state
var isChecked = $('.ui.checkbox').checkbox('is checked');

// Attach to external button
$('.ui.checkbox').checkbox('attach events', '.toggle.button');
$('.ui.checkbox').checkbox('attach events', '.check.button', 'check');
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `uncheckable` | String/Boolean | `"auto"` | Whether an input will allow no selection. Set to `true`/`false` or `"auto"`. Auto disallows unchecking for radio buttons only. When `false`, creates one-way checkbox (can check but not uncheck) |
| `fireOnInit` | Boolean | `false` | Whether callbacks for checked status should be fired on initialization as well as change |

### Module Debug Settings
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `silent` | Boolean | `false` | Silences all console output |
| `debug` | Boolean | `false` | Debug output to console |
| `performance` | Boolean | `true` | Show performance logs |
| `verbose` | Boolean | `false` | Debug output includes all internal behaviors |

## Callbacks

### After-Event Callbacks

| Callback | Context Parameter | Description |
|----------|------------------|-------------|
| `onChange` | `HTMLInputElement` | Fired after checkbox is either checked or unchecked |
| `onChecked` | `HTMLInputElement` | Fired after checkbox is checked |
| `onUnchecked` | `HTMLInputElement` | Fired after checkbox is unchecked |
| `onIndeterminate` | `HTMLInputElement` | Fired after checkbox is set to indeterminate |
| `onDeterminate` | `HTMLInputElement` | Fired after checkbox is set to determinate |
| `onEnable` | `HTMLInputElement` | Fired after checkbox is enabled |
| `onDisable` | `HTMLInputElement` | Fired after checkbox is disabled |

### Before-Event Callbacks (Cancellable)

| Callback | Context Parameter | Description |
|----------|------------------|-------------|
| `beforeChecked` | `HTMLInputElement` | Fired before checkbox is checked. Return `false` to cancel |
| `beforeUnchecked` | `HTMLInputElement` | Fired before checkbox is unchecked. Return `false` to cancel |
| `beforeIndeterminate` | `HTMLInputElement` | Fired before checkbox is set to indeterminate. Return `false` to cancel |
| `beforeDeterminate` | `HTMLInputElement` | Fired before checkbox is set to determinate. Return `false` to cancel |

### Callback Context
All callbacks receive the checkbox's input element as the `this` context. The input element (HTMLInputElement) is also passed as a parameter.

### Callback Examples
```javascript
$('.ui.checkbox').checkbox({
  onChecked: function() {
    console.log('Checkbox checked:', this);
  },
  onUnchecked: function() {
    console.log('Checkbox unchecked:', this);
  },
  onChange: function() {
    console.log('State changed:', this.checked);
  },
  beforeChecked: function() {
    // Validate before checking
    if (someCondition) {
      return false; // Cancel check action
    }
    return true; // Allow check
  }
});
```

## Code Examples

### Standard Checkbox
```html
<div class="ui checkbox">
  <input type="checkbox">
  <label>Make my profile visible</label>
</div>

<!-- With name attribute -->
<div class="ui checkbox">
  <input type="checkbox" name="newsletter">
  <label>Subscribe to newsletter</label>
</div>

<!-- Pre-checked -->
<div class="ui checkbox">
  <input type="checkbox" checked="checked">
  <label>I agree to the terms</label>
</div>
```

### Radio Button
```html
<!-- Radio group (same name) -->
<div class="ui form">
  <div class="grouped fields">
    <div class="ui radio checkbox">
      <input type="radio" name="frequency" value="once">
      <label>Once a week</label>
    </div>
    <div class="ui radio checkbox">
      <input type="radio" name="frequency" value="twice">
      <label>2-3 times a week</label>
    </div>
    <div class="ui radio checkbox">
      <input type="radio" name="frequency" value="daily">
      <label>Once a day</label>
    </div>
  </div>
</div>
```

### Slider Checkbox
```html
<div class="ui slider checkbox">
  <input type="checkbox">
  <label>Accept terms and conditions</label>
</div>

<!-- Slider radio -->
<div class="ui slider radio checkbox">
  <input type="radio" name="option" value="yes">
  <label>Yes</label>
</div>
```

### Toggle Checkbox
```html
<div class="ui toggle checkbox">
  <input type="checkbox">
  <label>Subscribe to weekly newsletter</label>
</div>

<!-- Pre-checked toggle -->
<div class="ui toggle checkbox">
  <input type="checkbox" checked="checked">
  <label>Enable notifications</label>
</div>
```

### Disabled State
```html
<!-- Disabled via class -->
<div class="ui disabled checkbox">
  <input type="checkbox" disabled>
  <label>Disabled checkbox</label>
</div>

<!-- Disabled checked -->
<div class="ui disabled checkbox">
  <input type="checkbox" checked="checked" disabled>
  <label>Disabled and checked</label>
</div>

<!-- Toggle disabled -->
<div class="ui disabled toggle checkbox">
  <input type="checkbox" disabled>
  <label>Disabled toggle</label>
</div>
```

### Read-Only State
```html
<div class="ui read-only checkbox">
  <input type="checkbox">
  <label>Read only checkbox</label>
</div>

<div class="ui read-only checkbox">
  <input type="checkbox" checked="checked">
  <label>Read only checked</label>
</div>
```

### Fitted Checkbox
```html
<!-- No padding for labels -->
<div class="ui fitted checkbox">
  <input type="checkbox">
  <label></label>
</div>

<!-- Slider fitted -->
<div class="ui fitted slider checkbox">
  <input type="checkbox">
  <label></label>
</div>

<!-- Toggle fitted -->
<div class="ui fitted toggle checkbox">
  <input type="checkbox">
  <label></label>
</div>
```

### Indeterminate State (JavaScript-Only)
```html
<div class="ui checkbox" id="parent-checkbox">
  <input type="checkbox">
  <label>Select all</label>
</div>

<script>
// Set indeterminate state
$('#parent-checkbox').checkbox('indeterminate');

// Or programmatically without callbacks
$('#parent-checkbox').checkbox('set indeterminate');
</script>
```

### Grouped Checkbox Pattern (Master-Child)
```html
<div class="ui checkbox" id="master">
  <input type="checkbox">
  <label>Select all</label>
</div>

<div class="ui checkbox child-checkbox">
  <input type="checkbox" name="option1">
  <label>Option 1</label>
</div>
<div class="ui checkbox child-checkbox">
  <input type="checkbox" name="option2">
  <label>Option 2</label>
</div>
<div class="ui checkbox child-checkbox">
  <input type="checkbox" name="option3">
  <label>Option 3</label>
</div>

<script>
// Master checkbox controls children
$('#master').checkbox({
  onChange: function() {
    if($(this).is(':checked')) {
      $('.child-checkbox').checkbox('check');
    } else {
      $('.child-checkbox').checkbox('uncheck');
    }
  }
});

// Children update master (including indeterminate state)
$('.child-checkbox').checkbox({
  onChange: function() {
    var allChecked = $('.child-checkbox input:checked').length === $('.child-checkbox').length;
    var noneChecked = $('.child-checkbox input:checked').length === 0;

    if(allChecked) {
      $('#master').checkbox('set checked');
    } else if(noneChecked) {
      $('#master').checkbox('set unchecked');
    } else {
      $('#master').checkbox('set indeterminate');
    }
  }
});
</script>
```

### Event Attachment Pattern
```html
<div class="ui checkbox" id="agree">
  <input type="checkbox">
  <label>I agree</label>
</div>

<button class="ui button toggle-button">Toggle Agreement</button>
<button class="ui button check-button">Agree</button>

<script>
// Attach toggle behavior to external button
$('#agree').checkbox('attach events', '.toggle-button');

// Attach specific method to button
$('#agree').checkbox('attach events', '.check-button', 'check');
</script>
```

### Advanced Callbacks Example
```javascript
$('.ui.checkbox').checkbox({
  // Fired on any change
  onChange: function() {
    console.log('State changed to:', this.checked);
  },

  // Specific state callbacks
  onChecked: function() {
    console.log('Now checked');
  },
  onUnchecked: function() {
    console.log('Now unchecked');
  },

  // Validation before state change
  beforeChecked: function() {
    // Custom validation logic
    if (!validateCondition()) {
      alert('Cannot check this option');
      return false; // Cancel the check action
    }
    return true;
  },

  // Indeterminate state tracking
  onIndeterminate: function() {
    console.log('Set to indeterminate');
  },
  onDeterminate: function() {
    console.log('Set to determinate');
  },

  // Enable/disable callbacks
  onEnable: function() {
    console.log('Checkbox enabled');
  },
  onDisable: function() {
    console.log('Checkbox disabled');
  }
});
```

### One-Way Checkbox (Uncheckable: false)
```javascript
$('.ui.checkbox').checkbox({
  uncheckable: false,
  onChecked: function() {
    console.log('Once checked, cannot be unchecked by user');
  }
});
```

### Fire Callbacks on Initialization
```javascript
$('.ui.checkbox').checkbox({
  fireOnInit: true,
  onChange: function() {
    console.log('Fires on init if checkbox is checked');
  }
});
```

### Form Integration
```html
<form class="ui form">
  <div class="field">
    <div class="ui checkbox">
      <input type="checkbox" name="terms" required>
      <label>I agree to the Terms and Conditions</label>
    </div>
  </div>

  <div class="grouped fields">
    <label>How often should we contact you?</label>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="frequency" value="weekly">
        <label>Weekly</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="frequency" value="monthly">
        <label>Monthly</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="frequency" value="never">
        <label>Never</label>
      </div>
    </div>
  </div>

  <button class="ui button" type="submit">Submit</button>
</form>

<script>
$('.ui.form').form({
  fields: {
    terms: 'checked',
    frequency: 'checked'
  }
});
</script>
```

## CSS Classes Reference

### Container Classes
| Class | Description |
|-------|-------------|
| `.ui.checkbox` | Base checkbox container (required) |
| `.ui.radio.checkbox` | Radio button variant |
| `.ui.slider.checkbox` | Slider variant |
| `.ui.toggle.checkbox` | Toggle variant |

### State Classes (Applied by JavaScript)
| Class | Description |
|-------|-------------|
| `.checked` | Applied when checkbox is checked |
| `.disabled` | Applied when checkbox is disabled |
| `.read-only` | Applied for read-only state |
| `.indeterminate` | Applied when in indeterminate state |

### Modifier Classes
| Class | Description |
|-------|-------------|
| `.fitted` | Removes padding for labels (label-less checkboxes) |

### Combination Examples
```html
<!-- Toggle slider (rare but possible) -->
<div class="ui toggle slider checkbox">

<!-- Fitted radio -->
<div class="ui fitted radio checkbox">

<!-- Disabled toggle -->
<div class="ui disabled toggle checkbox">
```

## Composition Patterns

### In Forms
Checkboxes integrate naturally with Semantic UI's form component:
- Use within `.field` or `.grouped fields` containers
- Form validation can require checkboxes to be checked
- Radio groups share a common name attribute
- Labels provide enhanced clickable areas

### With Other Components
- **Buttons**: Use `attach events` to connect checkbox behavior to buttons
- **Lists**: Checkboxes can appear in list items for selection lists
- **Tables**: Common pattern for row selection in data tables
- **Cards**: Toggle options within card content
- **Segments**: Group related checkboxes within segments

## Styling & Theming

### CSS Architecture
- Class-based styling system
- State classes applied/removed by JavaScript
- Visual variants use modifier classes
- LESS variable customization (not documented in detail on the page)

### Visual Variants
1. **Standard**: Default checkbox appearance
2. **Radio**: Circular selection indicator
3. **Slider**: Emphasized slide animation
4. **Toggle**: Switch-like on/off appearance

### State Visual Feedback
- **Checked**: Visual indicator (checkmark, filled circle, positioned slider/toggle)
- **Disabled**: Reduced opacity, no interaction cursor
- **Read-only**: Similar to disabled but semantically different
- **Indeterminate**: Dash/line indicator (for parent checkboxes in hierarchies)

## Accessibility

### Documented Accessibility Features
- Uses native `<input type="checkbox">` and `<input type="radio">` elements
- Associated `<label>` elements for enhanced clickable area
- `for` attribute linking supported for explicit label association
- `disabled` attribute for non-interactive state
- Native form integration and keyboard support via standard inputs

### Accessibility Gaps (Not Documented)
- No explicit ARIA attribute documentation (aria-checked, aria-disabled, etc.)
- No keyboard interaction documentation beyond native input behavior
- No focus management guidance
- No screen reader testing notes

### Accessibility Best Practices (Implied)
- Always include meaningful label text
- Use linked labels (id/for) when structure allows
- Ensure sufficient color contrast for visual variants
- Provide form validation feedback for required checkboxes
- Group related radio buttons with fieldset/legend (form best practice)

## Best Practices

### When to Use Each Type

**Standard Checkbox:**
- Multiple independent selections
- Optional form fields
- Feature toggles
- Filter selections

**Radio Button:**
- Exclusive choice selection (only one can be selected)
- Required form fields with predefined options
- Setting selection (e.g., frequency, preference)

**Slider:**
- Emphasize the selection action
- Binary choices where visual prominence is important
- Terms acceptance with visual weight
- Premium or important toggles

**Toggle:**
- On/off settings
- Feature enable/disable
- User preferences
- Real-time state changes

### State Management Best Practices

1. **Differentiate User vs. Programmatic Changes:**
   - Use `check`/`uncheck` for user-triggered changes (with callbacks)
   - Use `set checked`/`set unchecked` for programmatic updates (without callbacks)

2. **Validation:**
   - Use `beforeChecked`/`beforeUnchecked` callbacks for conditional logic
   - Return `false` to cancel user action
   - Provide user feedback when actions are cancelled

3. **Hierarchical Checkboxes:**
   - Use indeterminate state for parent checkboxes when children are partially selected
   - Update parent state programmatically (`set checked`, `set indeterminate`) to avoid callback loops
   - Handle child changes with callbacks to update parent

4. **Radio Button Groups:**
   - Always use same `name` attribute for mutually exclusive options
   - Consider `uncheckable: false` for radio semantics
   - Initialize with one option selected for required fields

5. **Event Attachment:**
   - Use `attach events` to connect external UI elements
   - Specify behavior method for non-toggle actions
   - Useful for custom UI patterns and accessibility enhancements

### Performance Considerations
- Initialize checkboxes once on page load or content insertion
- Use `set` methods for bulk updates to avoid callback overhead
- Consider event delegation for dynamically added checkboxes
- Use `fireOnInit: false` (default) unless callbacks are needed on initialization

## Historical Context

### Version Evolution
- Semantic UI 2.x documentation (current)
- Module namespace: "checkbox"
- Stable API with comprehensive behavior coverage

### Design Decisions
1. **Unified Module:** Combining checkbox, radio, slider, and toggle into one module reduces complexity and provides consistent API
2. **Dual Method API:** Separation of callback-triggering methods vs. programmatic methods enables sophisticated state management
3. **Before/After Callbacks:** Provides validation and cancellation points for state changes
4. **Indeterminate Support:** First-class support for hierarchical checkbox patterns
5. **Event Attachment:** Enables custom UI patterns and accessibility enhancements beyond standard label clicking

## Comparison Notes

### What Makes Semantic UI's Approach Unique

1. **Four Types in One Module:**
   - Most frameworks separate checkboxes, radios, and toggles/switches
   - Semantic UI unifies them with type modifiers (radio, slider, toggle)
   - Shared API and behaviors across all types

2. **Sophisticated State Management:**
   - Explicit differentiation between user and programmatic state changes
   - Dual method API: `check` (with callbacks) vs. `set checked` (without callbacks)
   - Before/after callback pattern for validation and cancellation

3. **First-Class Indeterminate Support:**
   - Built-in methods: `indeterminate`, `set indeterminate`
   - Dedicated callbacks: `onIndeterminate`, `beforeIndeterminate`
   - Designed for master-child checkbox patterns

4. **Event Attachment System:**
   - Connect checkbox behavior to external elements
   - Specify which behavior to trigger
   - Enables custom UI patterns

5. **jQuery-Based API:**
   - Method invocation via `.checkbox('methodName')`
   - Settings and callbacks passed to initialization
   - Behavior-based architecture

6. **Class-Based Visual Variants:**
   - Pure CSS class modifiers (no props)
   - `ui radio checkbox`, `ui slider checkbox`, `ui toggle checkbox`
   - Combines with other modifiers: `ui fitted toggle checkbox`

7. **Uncheckable Setting:**
   - Unique one-way checkbox behavior
   - Auto-detects radio buttons for appropriate defaults
   - Enables custom interaction patterns

### Advantages for Web Component Translation

1. **Clear API Surface:**
   - Well-defined methods map to web component methods
   - Settings translate to component properties
   - Callbacks map to custom events

2. **State Management Pattern:**
   - Dual API approach (user vs. programmatic) provides guidance for event dispatching
   - Before/after callback pattern maps to cancellable events

3. **Type System:**
   - Type variants can be component properties or separate components
   - Visual variants achieved through CSS classes or component variants

4. **Composition Patterns:**
   - Input + label pattern maps to slot-based composition
   - Fitted variant suggests optional label slot

### Challenges for Web Component Translation

1. **jQuery Dependency:**
   - Method invocation pattern needs translation to web component methods
   - Selector-based event attachment needs alternative approach

2. **Class-Based State:**
   - State classes applied by JavaScript
   - Web components can use internal state with Shadow DOM CSS

3. **Indeterminate API:**
   - HTML5 has native `indeterminate` property on checkboxes
   - Can leverage standard API vs. custom implementation

4. **Event Attachment Pattern:**
   - `.checkbox('attach events', selector)` needs modern equivalent
   - Could use event delegation or ref-based approach

5. **Form Integration:**
   - Native form association in web components
   - Need to ensure FormData integration

## Implementation Considerations for Web Components

### API Design Recommendations

**Properties:**
```javascript
{
  type: 'checkbox' | 'radio' | 'slider' | 'toggle',
  checked: boolean,
  indeterminate: boolean,
  disabled: boolean,
  readonly: boolean,
  fitted: boolean,
  uncheckable: boolean | 'auto',
  fireOnInit: boolean,
  name: string,
  value: string
}
```

**Methods:**
```javascript
check()          // With events
uncheck()        // With events
toggle()         // With events
setChecked()     // Without events
setUnchecked()   // Without events
setIndeterminate() // Without events
enable()
disable()
```

**Events:**
```javascript
// Cancellable events (before)
'beforecheck'
'beforeuncheck'
'beforeindeterminate'
'beforedeterminate'

// After events
'change'
'checked'
'unchecked'
'indeterminate'
'determinate'
'enable'
'disable'
```

### Composition Approach

**Option 1: Single Component with Type Property**
```html
<ui-checkbox type="toggle" checked>Enable notifications</ui-checkbox>
<ui-checkbox type="slider">Accept terms</ui-checkbox>
<ui-checkbox type="radio" name="frequency">Weekly</ui-checkbox>
```

**Option 2: Separate Components per Type**
```html
<ui-checkbox checked>Standard checkbox</ui-checkbox>
<ui-radio-button name="frequency">Weekly</ui-radio-button>
<ui-toggle checked>Enable notifications</ui-toggle>
<ui-slider>Accept terms</ui-slider>
```

**Recommendation:** Option 1 (single component) maintains Semantic UI's unified approach and reduces component count, but Option 2 may be more semantic and familiar to developers.

### Shadow DOM Considerations

- Slot-based label composition
- CSS custom properties for theming
- Part-based styling for visual variants
- State reflected in host attributes for external styling

### Form Association

- Use `ElementInternals` for form participation
- Reflect value and checked state to form
- Support `disabled` and `readonly` states
- Integrate with form validation

### Native HTML Enhancement

- Build on native `<input type="checkbox">` and `<input type="radio">`
- Leverage native `indeterminate` property
- Preserve native keyboard interactions
- Maintain accessibility features

## Key Takeaways

1. **Unified Component:** Checkbox, radio, slider, and toggle are variants of one module with shared API
2. **Dual State API:** Clear distinction between user-triggered (with callbacks) and programmatic (without callbacks) state changes
3. **Rich Callbacks:** Before/after pattern enables validation, cancellation, and side effects
4. **Indeterminate First-Class:** Built-in support for hierarchical checkbox patterns with dedicated methods and callbacks
5. **jQuery Architecture:** Behavior-based API with method invocation, settings, and callbacks
6. **Class-Based Variants:** Visual types achieved through CSS class modifiers
7. **Event Attachment:** Sophisticated pattern for connecting checkbox behavior to external elements
8. **Form Integration:** Natural integration with forms, validation, and standard HTML patterns
9. **Uncheckable Option:** Unique one-way checkbox behavior for custom interaction patterns
10. **No JavaScript Required:** Basic functionality works without JavaScript through linked labels

## Research Metadata

**Research Date:** 2025-11-04
**Documentation Source:** https://semantic-ui.com/modules/checkbox.html
**Framework Version:** Semantic UI 2.x (Classic)
**Component Category:** Module (Form Component)
**JavaScript Dependency:** jQuery (optional for basic functionality, required for API)
**Key Dependencies:** None (standalone module)

**Related Components:**
- Form (container and validation)
- Button (for event attachment)
- List (for selection patterns)
- Table (for row selection)

**Documentation Completeness:**
- ✅ HTML structure and markup
- ✅ CSS classes and modifiers
- ✅ JavaScript API and behaviors
- ✅ Settings and configuration
- ✅ Callbacks and event handling
- ✅ Code examples for all types
- ⚠️ Limited accessibility documentation
- ❌ No LESS variable reference
- ❌ No theming customization guide
- ❌ No migration or version history

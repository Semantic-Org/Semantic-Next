# PrimeReact Checkbox Component - Usage Pattern Report

## 1. Component Overview

The PrimeReact Checkbox is a styled, React-controlled component that extends the standard HTML checkbox element with theming capabilities and customizable appearance. It follows React's controlled component pattern, requiring explicit state management through props, and integrates seamlessly with PrimeReact's comprehensive theming system. The component is designed for both single selection and multiple selection use cases, with support for custom icons and extensive styling options.

## 2. Basic Usage

### Single Checkbox (Controlled)

```javascript
import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';

function BasicExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      onChange={e => setChecked(e.checked)}
      checked={checked}
    />
  );
}
```

**Key Points:**
- Requires both `checked` and `onChange` props for controlled behavior
- Event object has `e.checked` property containing the new boolean state
- No uncontrolled mode - component must be explicitly managed

### Checkbox with Label

```javascript
<div>
  <Checkbox
    inputId="accept"
    onChange={e => setAccepted(e.checked)}
    checked={accepted}
  />
  <label htmlFor="accept" className="p-checkbox-label">
    I accept the terms and conditions
  </label>
</div>
```

**Key Points:**
- Use `inputId` prop to connect label via `htmlFor`
- Label is external to component (not a built-in prop)
- PrimeReact provides `p-checkbox-label` class for label styling

## 3. Props/API

### Complete Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **id** | string | null | Unique identifier for the component element |
| **inputId** | string | null | Identifier for the inner native checkbox input (use for label association) |
| **value** | any | null | Value of the checkbox (used in group scenarios) |
| **name** | string | null | Name attribute of the native checkbox input |
| **checked** | boolean | false | Specifies whether the checkbox is checked |
| **trueValue** | any | true | Value to emit when checkbox is checked (advanced scenarios) |
| **falseValue** | any | false | Value to emit when checkbox is unchecked (advanced scenarios) |
| **style** | object | null | Inline styles for the container element |
| **className** | string | null | CSS class name(s) for the container element |
| **disabled** | boolean | false | When true, checkbox cannot be interacted with |
| **required** | boolean | false | When true, marks the field as required |
| **readOnly** | boolean | false | When true, checkbox is read-only (displays state but not interactive) |
| **tabIndex** | number | null | Specifies the tab order of the element |
| **icon** | string | 'pi pi-check' | CSS class for the checkbox icon (PrimeIcons by default) |
| **tooltip** | any | null | Content to display in tooltip |
| **tooltipOptions** | object | null | Configuration object for tooltip behavior |

### Events API

| Event | Parameters | Description |
|-------|------------|-------------|
| **onChange** | `event.originalEvent`: Native event<br/>`event.value`: Checkbox value<br/>`event.checked`: Boolean checked state | Callback fired when the checked state changes |
| **onMouseDown** | event: Native mouse event | Callback fired when mouse button is pressed on checkbox |
| **onContextMenu** | event: Native context menu event | Callback fired on right-click |

### Event Object Structure

```javascript
{
  originalEvent: SyntheticEvent,  // React synthetic event
  value: any,                     // Value from 'value' prop
  checked: boolean                // New checked state
}
```

## 4. Variants & Patterns

### Controlled Pattern (Standard)

```javascript
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onChange={e => setChecked(e.checked)}
/>
```

**Note:** PrimeReact Checkbox does not support uncontrolled mode. State must be managed externally.

### Indeterminate State

**Not directly supported.** PrimeReact Checkbox v8 does not have a built-in indeterminate prop. If needed, would require custom implementation using the `icon` prop or CSS styling.

### Disabled State

```javascript
<Checkbox
  checked={checked}
  onChange={e => setChecked(e.checked)}
  disabled={true}
/>
```

Renders checkbox in a disabled visual state with no interaction possible.

### Invalid State

**Not directly supported via prop.** Would need to be implemented via:
- Custom `className` for invalid styling
- Combining with PrimeReact form validation components
- Manual ARIA attributes

Example approach:
```javascript
<Checkbox
  checked={checked}
  onChange={e => setChecked(e.checked)}
  className={errors.terms ? 'p-invalid' : ''}
/>
{errors.terms && <small className="p-error">Required</small>}
```

### Checkbox Groups (Multiple Selection)

```javascript
const [selectedCities, setSelectedCities] = useState([]);

const onCityChange = (e) => {
  let selected = [...selectedCities];

  if (e.checked) {
    selected.push(e.value);
  } else {
    selected.splice(selected.indexOf(e.value), 1);
  }

  setSelectedCities(selected);
};

// Render multiple checkboxes
<div>
  <Checkbox
    inputId="ny"
    value="New York"
    onChange={onCityChange}
    checked={selectedCities.includes('New York')}
  />
  <label htmlFor="ny" className="p-checkbox-label">New York</label>
</div>

<div>
  <Checkbox
    inputId="la"
    value="Los Angeles"
    onChange={onCityChange}
    checked={selectedCities.includes('Los Angeles')}
  />
  <label htmlFor="la" className="p-checkbox-label">Los Angeles</label>
</div>
```

**Key Pattern:**
- Maintain array of selected values in state
- Use `value` prop to identify each checkbox
- Use `.includes()` to determine `checked` state
- Handler adds/removes from array based on `e.checked`

### Icon Customization

```javascript
// Using custom icon class
<Checkbox
  checked={checked}
  onChange={e => setChecked(e.checked)}
  icon="pi pi-heart"
/>

// Or custom icon from other icon libraries
<Checkbox
  checked={checked}
  onChange={e => setChecked(e.checked)}
  icon="fas fa-check"
/>
```

Default icon is `'pi pi-check'` from PrimeIcons library.

### Advanced: Custom True/False Values

```javascript
// Emit custom values instead of boolean
const [status, setStatus] = useState('inactive');

<Checkbox
  checked={status === 'active'}
  onChange={e => setStatus(e.checked ? 'active' : 'inactive')}
  trueValue="active"
  falseValue="inactive"
/>
```

**Note:** The `trueValue` and `falseValue` props allow emitting non-boolean values, useful for specific state management scenarios.

### Read-Only State

```javascript
<Checkbox
  checked={true}
  onChange={e => {}}
  readOnly={true}
/>
```

Displays the checkbox state without allowing user interaction.

## 5. Composition Patterns

### Form Integration

PrimeReact Checkboxes are commonly used with:

1. **Form Layout Components:**
   ```javascript
   <div className="field-checkbox">
     <Checkbox inputId="accept" checked={accept} onChange={e => setAccept(e.checked)} />
     <label htmlFor="accept">I agree</label>
   </div>
   ```

2. **Validation Libraries (Formik, React Hook Form):**
   ```javascript
   // With Formik
   <Field name="terms">
     {({ field, form }) => (
       <Checkbox
         inputId="terms"
         checked={field.value}
         onChange={e => form.setFieldValue('terms', e.checked)}
       />
     )}
   </Field>
   ```

3. **Grid/List Layouts:**
   ```javascript
   <div className="grid">
     {options.map(option => (
       <div key={option.key} className="col-12 md:col-6">
         <Checkbox
           inputId={option.key}
           value={option.key}
           checked={selected.includes(option.key)}
           onChange={onSelectionChange}
         />
         <label htmlFor={option.key}>{option.name}</label>
       </div>
     ))}
   </div>
   ```

### Typical Application Patterns

- **Terms Acceptance:** Single checkbox for user agreements
- **Multi-Select Filters:** Checkbox groups for filtering lists/tables
- **Feature Toggles:** Settings panels with on/off options
- **Task Lists:** Todo-style interfaces with completion tracking
- **Permission Management:** Role/permission selection matrices

## 6. Styling & Theming

### CSS Class Structure

```html
<div class="p-checkbox [custom-classes]">
  <div class="p-checkbox-box [p-highlight] [p-disabled]">
    <span class="p-checkbox-icon [pi pi-check]"></span>
  </div>
  <input type="checkbox" />
</div>
```

**Core Classes:**
- `p-checkbox` - Container element
- `p-checkbox-box` - Visual checkbox box
- `p-checkbox-icon` - Icon element inside box
- `p-highlight` - Applied when checked
- `p-disabled` - Applied when disabled

**External Classes:**
- `p-checkbox-label` - Recommended class for labels

### Custom Styling via Props

```javascript
// Inline styles
<Checkbox
  style={{ marginRight: '1rem' }}
  className="custom-checkbox"
  checked={checked}
  onChange={e => setChecked(e.checked)}
/>

// Custom CSS
.custom-checkbox .p-checkbox-box {
  border-color: #3b82f6;
}

.custom-checkbox .p-checkbox-box.p-highlight {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
```

### PrimeReact Theming System

PrimeReact Checkbox integrates with the framework's theming:

**Free Themes:**
- **Bootstrap** - bootstrap4-light-blue, bootstrap4-dark-blue, etc.
- **Material Design** - md-light-indigo, md-dark-indigo (includes compact variants)
- **Tailwind** - tailwind-light
- **Fluent UI** - fluent-light
- **PrimeOne Design** - lara-light-blue, lara-dark-blue, saga-blue, vela-blue, arya-blue

**Premium Themes:**
- Available via PrimeReact Theme Designer subscription
- Allows full customization and theme creation

### Input Style Modes

PrimeReact supports two global input style modes:

1. **Outlined (default)** - Border-based styling
2. **Filled** - Background-based styling

Configure globally via PrimeReact configuration:
```javascript
import { PrimeReactProvider } from 'primereact/api';

<PrimeReactProvider value={{ inputStyle: 'filled' }}>
  <App />
</PrimeReactProvider>
```

### PassThrough API

**Note:** PrimeReact v8 documentation does not explicitly detail a PassThrough API for Checkbox. This feature may be available in later versions (v10+) which allows direct prop passing to internal elements.

## 7. Accessibility

**Current Status:** The PrimeReact v8 documentation states:

> "This section is under development. After the necessary tests and improvements are made, it will be shared with the users as soon as possible."

### Inferred Accessibility Features

Based on the component structure and props:

**Native Input Element:**
- Component renders a native `<input type="checkbox">` element
- Inherits native checkbox keyboard support (Space to toggle)
- Receives focus via Tab navigation

**Label Association:**
- `inputId` prop enables proper label association via `htmlFor`
- Ensures screen reader announcement of label text

**ARIA Attributes (Potential):**
- `required` prop likely maps to `aria-required`
- `disabled` prop maps to native disabled state
- Component may include implicit ARIA roles

**Recommended Practices:**
- Always provide associated labels
- Use `inputId` and `htmlFor` for proper connections
- Include visible labels (not just placeholder/tooltips)
- Ensure sufficient color contrast for visual indicators

### Expected Keyboard Support

Based on native checkbox behavior:

- **Tab** - Move focus to/from checkbox
- **Space** - Toggle checked state
- **Shift+Tab** - Move focus backward

## 8. Best Practices

### When to Use Checkboxes

**Appropriate Use Cases:**
- Binary yes/no choices
- Multiple selection from a list (non-exclusive options)
- Enabling/disabling features or settings
- Confirming acceptance of terms
- Toggling individual items in a collection

**When NOT to Use:**
- Single selection from multiple options → Use RadioButton instead
- Mutually exclusive choices → Use RadioButton or Dropdown
- On/off state with immediate effect → Consider ToggleButton or Switch

### Common Patterns

1. **Always Use Controlled Components:**
   ```javascript
   // Good
   const [checked, setChecked] = useState(false);
   <Checkbox checked={checked} onChange={e => setChecked(e.checked)} />

   // Not supported in PrimeReact
   <Checkbox defaultChecked={true} />
   ```

2. **Provide Labels for Accessibility:**
   ```javascript
   // Good
   <Checkbox inputId="terms" />
   <label htmlFor="terms">I accept</label>

   // Avoid - no label
   <Checkbox />
   ```

3. **Use value Prop for Groups:**
   ```javascript
   // Good - clear identification
   <Checkbox value="option1" checked={selected.includes('option1')} />

   // Avoid - unclear which checkbox
   <Checkbox checked={check1} onChange={e => setCheck1(e.checked)} />
   ```

4. **Handle Arrays Immutably:**
   ```javascript
   // Good
   const newSelection = [...selected, newValue];

   // Avoid
   selected.push(newValue); // Mutates state
   ```

### Gotchas & Common Issues

1. **Event Object Structure:**
   - Use `e.checked` not `e.target.checked`
   - Use `e.value` to get the checkbox's value prop

2. **No Uncontrolled Mode:**
   - Unlike native checkboxes, PrimeReact requires state management
   - Cannot use `defaultChecked` pattern

3. **Label Positioning:**
   - Label is external to component
   - Must manually manage layout/spacing
   - No built-in label position prop

4. **Group State Management:**
   - More complex than native checkboxes
   - Requires manual array manipulation
   - Must maintain separate onChange handlers or unified handler with value checks

5. **Indeterminate State:**
   - Not built-in
   - Requires custom implementation if needed

6. **Boolean vs Custom Values:**
   - Default behavior uses boolean checked state
   - `trueValue`/`falseValue` props change this but may complicate logic

### Performance Considerations

- Checkbox is a lightweight component
- For large checkbox lists (50+), consider virtualization
- Memoize onChange handlers in lists to prevent re-renders:
  ```javascript
  const handleChange = useCallback((value) => {
    return (e) => {
      // handle change
    };
  }, [dependencies]);
  ```

## 9. Comparison Notes

### Unique Characteristics vs Standard Checkboxes

**Advantages:**
1. **Consistent Styling:** Cross-browser consistent appearance via themed components
2. **Rich Theming:** Extensive theme library with easy switching
3. **React Integration:** First-class React component with proper event handling
4. **Icon Customization:** Easy icon replacement via prop
5. **Tooltip Support:** Built-in tooltip functionality

**Limitations:**
1. **No Uncontrolled Mode:** Always requires state management (unlike native inputs)
2. **No Indeterminate State:** Missing common checkbox feature
3. **External Labels:** Labels not built into component API
4. **Event Structure:** Custom event object (not native event pattern)
5. **Bundle Size:** Adds library overhead vs native checkbox

### vs Native HTML Checkbox

| Feature | PrimeReact Checkbox | Native Checkbox |
|---------|-------------------|-----------------|
| Styling | Themed, customizable | Browser default |
| State Management | Controlled only | Controlled or uncontrolled |
| Indeterminate | Not supported | Supported |
| Accessibility | Basic (developing) | Full native support |
| Bundle Size | +Library overhead | Zero |
| React Integration | Native component | Requires wrapper |

### vs Other React Checkbox Libraries

**Compared to Material-UI Checkbox:**
- Similar controlled-only pattern
- MUI has indeterminate support
- MUI has more comprehensive accessibility docs
- PrimeReact has more extensive theming options

**Compared to Ant Design Checkbox:**
- Ant Design has Checkbox.Group component (more ergonomic for groups)
- PrimeReact requires manual group implementation
- Similar styling customization approaches
- Both lack uncontrolled mode

**Compared to Chakra UI Checkbox:**
- Chakra has both controlled and uncontrolled modes
- Chakra has indeterminate support
- PrimeReact has more pre-built themes
- Chakra has more flexible styling system

### Key Differentiators

1. **Theming Ecosystem:** PrimeReact's strength is its comprehensive, production-ready theme collection
2. **React-Only Pattern:** Fully embraces controlled components (no hybrid approach)
3. **Enterprise Focus:** Part of larger PrimeReact suite designed for business applications
4. **Simple API:** Minimal props surface area, straightforward to use
5. **Custom Event Object:** Non-standard event shape may require adaptation when migrating code

## Summary

PrimeReact Checkbox is a solid, themed checkbox component best suited for React applications requiring consistent cross-browser styling and enterprise-grade theming. Its controlled-only pattern aligns well with React best practices, though developers should be aware of limitations like missing indeterminate state and the need for manual group management. The component shines in form-heavy applications where visual consistency and theming flexibility are priorities, particularly when using other PrimeReact components for a cohesive design system.

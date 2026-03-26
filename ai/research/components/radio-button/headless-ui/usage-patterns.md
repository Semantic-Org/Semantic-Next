# Headless UI - Radio Group Component

## Component Overview

The Headless UI Radio Group is a completely unstyled, accessible form component that provides the same functionality as native HTML radio inputs without any default styling. It's designed for building custom selection interfaces while maintaining semantic HTML and full accessibility standards.

**Core purpose**: Enables users to select a single option from a set of mutually exclusive choices through a fully accessible, keyboard-navigable interface that can be styled exactly as needed.

**Architecture**: A composition-based component system where RadioGroup manages state and context, while Radio, Label, Description, and Field components compose together to create semantic, accessible radio selections. The "headless" approach means zero styling is provided - developers have complete control over appearance.

**Common use cases**: Plan selection, payment method choice, preference settings, any single-choice selection from multiple options, form fields requiring radio button semantics.

## Documentation Quality

**Status**: Production-ready, actively maintained

**URL**: https://headlessui.com/react/radio-group

**Documentation Assessment**:
- Clear, concise examples showing common patterns
- Strong focus on accessibility features
- Good coverage of controlled/uncontrolled modes
- Excellent explanation of styling approaches (data attributes vs render props)
- Well-documented form integration
- Clear API reference with all props
- Code examples are practical and copy-paste ready
- Notable emphasis on "headless" philosophy (zero styling)

## Component Definition

### Core Purpose
Provides fully accessible radio group functionality with complete styling freedom. Handles state management, keyboard navigation, focus management, and ARIA attributes while letting developers control all visual aspects.

### Mental Model
Think of RadioGroup as an invisible state manager that wraps a collection of Radio options. It handles all the complex accessibility logic (ARIA attributes, keyboard navigation, focus management) while remaining completely invisible visually. You bring the styling through CSS, Tailwind, or any styling approach.

### Semantic Meaning
Represents a set of mutually exclusive options where exactly one choice must be selected. Maps to the semantic meaning of HTML radio inputs but with enhanced accessibility and flexibility for complex values (objects, not just strings).

## Content Patterns

### Text Content
- **Label**: Required for each radio option, associated via Field wrapper
- **Description**: Optional helper text that auto-associates with radio via aria-describedby
- **Legend**: Optional Fieldset/Legend wrapper for group labeling

### Icon Support
No built-in icon components. Icons can be added as custom children within Radio or Label components since everything is unstyled.

### Custom Content
Full flexibility for custom content:
- Complex layouts within Radio components
- Custom indicator graphics (checkmarks, circles, etc.)
- Images or icons as part of the selection
- Rich content in descriptions
- Any HTML/JSX structure

Example pattern:
```jsx
<Radio value={plan}>
  {({ checked }) => (
    <>
      <CustomIcon checked={checked} />
      <span>{plan.name}</span>
      <span className="price">{plan.price}</span>
    </>
  )}
</Radio>
```

## Type Patterns

### Single Radio Selection
The component is fundamentally a radio group - single selection by design. Multiple selections would require a different component (CheckboxGroup in Headless UI).

### Radio Group
Core component pattern:
```jsx
<RadioGroup value={selected} onChange={setSelected}>
  <Radio value="option1" />
  <Radio value="option2" />
  <Radio value="option3" />
</RadioGroup>
```

### Button-Style Radios
No built-in "button-style" variant. Achieved through custom styling:
```jsx
<Radio value={option}>
  {({ checked }) => (
    <div className={`button-style ${checked ? 'selected' : ''}`}>
      {option}
    </div>
  )}
</Radio>
```

### Visual Variations
Since the component is completely unstyled, all visual variations are achieved through custom CSS or styling libraries. Common patterns include:
- Traditional circle indicators
- Button group appearance
- Card-based selections
- Inline vs block layouts

## State Patterns

### Disabled State
**Group-level**: `disabled` prop on RadioGroup disables all options
```jsx
<RadioGroup disabled value={selected} onChange={setSelected}>
  {/* All radios disabled */}
</RadioGroup>
```

**Individual radio**: `disabled` prop on specific Radio
```jsx
<Radio value="option" disabled />
```

State tracking via:
- `data-disabled` attribute for CSS targeting
- `disabled` boolean in render prop function

### Checked State
**Automatic tracking**: RadioGroup manages checked state based on `value` prop
**Visual feedback**:
- `data-checked` attribute on checked Radio
- `checked` boolean in render prop: `{({ checked }) => ...}`

### Error State
No built-in error state. Implement via:
- Custom props/context
- ARIA attributes (aria-invalid, aria-errormessage)
- Custom styling classes

### Required State
No built-in required indicator. Implement via:
- HTML `required` attribute on hidden input (when using `name` prop)
- Custom visual indicators
- Form validation logic

### Focus State
**Automatic**: Built-in focus management with keyboard navigation
**Visual tracking**:
- `data-focus` attribute for styling focused radio
- `data-autofocus` attribute for auto-focused elements
- `focus` boolean in render prop

### Hover State
**Visual tracking**:
- `data-hover` attribute for CSS hover states
- `hover` boolean in render prop

### Active State
**Visual tracking**:
- `data-active` attribute for pressed/active state
- `active` boolean in render prop

## Variation Patterns

### Size Variations
No built-in sizes. Implement through custom styling:
```jsx
<Radio className="size-small" value={option} />
<Radio className="size-large" value={option} />
```

### Orientation
No explicit `orientation` prop. Layout achieved through CSS:

**Horizontal**:
```jsx
<RadioGroup className="flex flex-row gap-4" value={selected} onChange={setSelected}>
  {/* Radios in a row */}
</RadioGroup>
```

**Vertical**:
```jsx
<RadioGroup className="flex flex-col gap-2" value={selected} onChange={setSelected}>
  {/* Radios in a column */}
</RadioGroup>
```

### Color Schemes
Entirely custom. No built-in color props. Implement through:
- CSS classes
- Inline styles
- CSS-in-JS
- Tailwind color utilities

### Spacing
Controlled via CSS on parent containers. Common pattern:
```jsx
<RadioGroup className="space-y-2" value={selected} onChange={setSelected}>
  {/* Radios with vertical spacing */}
</RadioGroup>
```

## Interactive Patterns

### onChange Handler
**Signature**: `onChange(value)`
**Timing**: Fires when selection changes
**Both modes**: Works in controlled and uncontrolled modes

```jsx
<RadioGroup
  value={selected}
  onChange={(value) => {
    console.log('Selected:', value)
    setSelected(value)
  }}
>
  {/* Radios */}
</RadioGroup>
```

### Controlled Mode
Full external control of state:
```jsx
const [selected, setSelected] = useState('option1')

<RadioGroup value={selected} onChange={setSelected}>
  <Radio value="option1" />
  <Radio value="option2" />
</RadioGroup>
```

### Uncontrolled Mode
Internal state management via `defaultValue`:
```jsx
<RadioGroup defaultValue="option1" onChange={handleChange}>
  <Radio value="option1" />
  <Radio value="option2" />
</RadioGroup>
```

Note: "Headless UI will track its state internally for you" in uncontrolled mode, but `onChange` still fires for side effects.

### Form Integration
**Native form support** via `name` prop:
```jsx
<RadioGroup name="plan" value={selected} onChange={setSelected}>
  {/* Creates hidden input for form submission */}
</RadioGroup>
```

Features:
- Hidden input kept in sync with RadioGroup state
- FormData API compatible
- Works with traditional form submissions
- Complex values encoded with square bracket notation
- Optional `form` prop to associate with specific form by ID

### Keyboard Navigation
**Built-in support**:
- **Arrow keys**: Cycle through options (wraps around)
- **Space/Enter**: Select focused option
- **Tab**: Move focus to/from group

### Value Comparison
**Simple values**: Direct comparison for strings, numbers
**Complex values**: Use `by` prop for object comparison

```jsx
// Compare by field
<RadioGroup value={selected} onChange={setSelected} by="id">
  <Radio value={{id: 1, name: 'Option 1'}} />
</RadioGroup>

// Custom comparison function
<RadioGroup
  value={selected}
  onChange={setSelected}
  by={(a, b) => a.id === b.id}
>
  <Radio value={{id: 1, name: 'Option 1'}} />
</RadioGroup>
```

## Code Examples

### Example 1: Basic Radio Group
```jsx
import { useState } from 'react'
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

const plans = ['Startup', 'Business', 'Enterprise']

export function BasicRadioGroup() {
  const [selected, setSelected] = useState(plans[0])

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      {plans.map((plan) => (
        <Field key={plan}>
          <Radio value={plan} />
          <Label>{plan}</Label>
        </Field>
      ))}
    </RadioGroup>
  )
}
```

### Example 2: With Descriptions
```jsx
import { RadioGroup, Radio, Field, Label, Description } from '@headlessui/react'

const plans = [
  { name: 'Startup', description: 'For small teams' },
  { name: 'Business', description: 'For growing companies' },
  { name: 'Enterprise', description: 'For large organizations' }
]

export function RadioWithDescriptions() {
  const [selected, setSelected] = useState(plans[0])

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      {plans.map((plan) => (
        <Field key={plan.name}>
          <Radio value={plan} />
          <Label>{plan.name}</Label>
          <Description>{plan.description}</Description>
        </Field>
      ))}
    </RadioGroup>
  )
}
```

### Example 3: Styling with Data Attributes
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'
import './styles.css'

export function StyledRadioGroup() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <Field>
        <Radio
          value="option1"
          className="radio-option"
        />
        <Label>Option 1</Label>
      </Field>
      <Field>
        <Radio
          value="option2"
          className="radio-option"
        />
        <Label>Option 2</Label>
      </Field>
    </RadioGroup>
  )
}

// CSS
// .radio-option[data-checked] { background: blue; }
// .radio-option[data-disabled] { opacity: 0.5; }
// .radio-option[data-focus] { outline: 2px solid blue; }
```

### Example 4: Styling with Render Props
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

export function RenderPropsRadio() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <Field>
        <Radio value="option1">
          {({ checked, disabled }) => (
            <div className={`
              radio-option
              ${checked ? 'bg-blue-500 text-white' : 'bg-gray-100'}
              ${disabled ? 'opacity-50' : ''}
            `}>
              {checked && <CheckIcon />}
              Option 1
            </div>
          )}
        </Radio>
      </Field>
    </RadioGroup>
  )
}
```

### Example 5: Disabled States
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

export function DisabledRadio() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <Field>
        <Radio value="option1" />
        <Label>Enabled Option</Label>
      </Field>
      <Field>
        <Radio value="option2" disabled />
        <Label>Disabled Option</Label>
      </Field>
    </RadioGroup>
  )
}

// Entire group disabled
export function DisabledGroup() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup disabled value={selected} onChange={setSelected}>
      {/* All radios disabled */}
    </RadioGroup>
  )
}
```

### Example 6: Uncontrolled Mode
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

export function UncontrolledRadio() {
  const handleChange = (value) => {
    console.log('Selection changed to:', value)
  }

  return (
    <RadioGroup defaultValue="option1" onChange={handleChange}>
      <Field>
        <Radio value="option1" />
        <Label>Option 1</Label>
      </Field>
      <Field>
        <Radio value="option2" />
        <Label>Option 2</Label>
      </Field>
    </RadioGroup>
  )
}
```

### Example 7: Complex Object Values
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

const plans = [
  { id: 1, name: 'Startup', price: '$10/mo' },
  { id: 2, name: 'Business', price: '$20/mo' },
  { id: 3, name: 'Enterprise', price: '$50/mo' }
]

export function ObjectValueRadio() {
  const [selected, setSelected] = useState(plans[0])

  return (
    <RadioGroup value={selected} onChange={setSelected} by="id">
      {plans.map((plan) => (
        <Field key={plan.id}>
          <Radio value={plan}>
            {({ checked }) => (
              <div className={checked ? 'selected' : ''}>
                <span>{plan.name}</span>
                <span>{plan.price}</span>
              </div>
            )}
          </Radio>
        </Field>
      ))}
    </RadioGroup>
  )
}
```

### Example 8: Form Integration
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

export function FormIntegration() {
  const [selected, setSelected] = useState('standard')

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log('Shipping method:', formData.get('shipping'))
  }

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup name="shipping" value={selected} onChange={setSelected}>
        <Field>
          <Radio value="standard" />
          <Label>Standard Shipping</Label>
        </Field>
        <Field>
          <Radio value="express" />
          <Label>Express Shipping</Label>
        </Field>
      </RadioGroup>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Example 9: With Fieldset/Legend
```jsx
import { RadioGroup, Radio, Field, Label, Fieldset, Legend } from '@headlessui/react'

export function RadioWithFieldset() {
  const [selected, setSelected] = useState('email')

  return (
    <Fieldset>
      <Legend>Notification preferences</Legend>
      <RadioGroup value={selected} onChange={setSelected}>
        <Field>
          <Radio value="email" />
          <Label>Email</Label>
        </Field>
        <Field>
          <Radio value="sms" />
          <Label>SMS</Label>
        </Field>
        <Field>
          <Radio value="push" />
          <Label>Push notifications</Label>
        </Field>
      </RadioGroup>
    </Fieldset>
  )
}
```

### Example 10: Horizontal Layout with Tailwind
```jsx
import { RadioGroup, Radio, Field, Label } from '@headlessui/react'

export function HorizontalRadio() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup
      value={selected}
      onChange={setSelected}
      className="flex flex-row gap-4"
    >
      <Field className="flex items-center gap-2">
        <Radio
          value="option1"
          className="size-5 rounded-full border-2 border-gray-300 data-[checked]:bg-blue-500 data-[checked]:border-blue-500"
        />
        <Label>Option 1</Label>
      </Field>
      <Field className="flex items-center gap-2">
        <Radio
          value="option2"
          className="size-5 rounded-full border-2 border-gray-300 data-[checked]:bg-blue-500 data-[checked]:border-blue-500"
        />
        <Label>Option 2</Label>
      </Field>
    </RadioGroup>
  )
}
```

## Key Properties/Props

### RadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T` | `undefined` | Currently selected value (controlled mode) |
| `defaultValue` | `T` | `undefined` | Initial value for uncontrolled mode |
| `onChange` | `(value: T) => void` | `undefined` | Callback fired when selection changes |
| `by` | `string \| ((a: T, b: T) => boolean)` | Compares by `id` field | Strategy for comparing object values |
| `disabled` | `boolean` | `false` | Disables entire radio group |
| `name` | `string` | `undefined` | Form field name (creates hidden input) |
| `form` | `string` | `undefined` | ID of form to associate with |
| `as` | `React.ElementType` | `'div'` | Element to render as |

### Radio Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T` | (required) | Value for this radio option |
| `disabled` | `boolean` | `false` | Disables this specific radio |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `as` | `React.ElementType` | `'span'` | Element to render as |

### Field Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'div'` | Element to render as |
| `disabled` | `boolean` | `false` | Disables all inputs within field |

### Label Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'label'` | Element to render as |
| `passive` | `boolean` | `false` | Prevents label click from activating control |

### Description Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'p'` | Element to render as |

### Render Prop State

When using render props on Radio, the following state is available:

| Property | Type | Description |
|----------|------|-------------|
| `checked` | `boolean` | Whether this radio is currently selected |
| `disabled` | `boolean` | Whether this radio is disabled |
| `hover` | `boolean` | Whether this radio is being hovered |
| `focus` | `boolean` | Whether this radio has focus |
| `active` | `boolean` | Whether this radio is being pressed |
| `autofocus` | `boolean` | Whether this radio was auto-focused |

### Data Attributes

All Radio elements receive the following data attributes for CSS targeting:

| Attribute | Condition | Description |
|-----------|-----------|-------------|
| `data-checked` | When selected | Radio is currently checked |
| `data-disabled` | When disabled | Radio is disabled |
| `data-focus` | When focused | Radio has keyboard focus |
| `data-hover` | When hovered | Radio is being hovered |
| `data-active` | When pressed | Radio is being actively pressed |
| `data-autofocus` | When auto-focused | Radio was auto-focused on mount |

## Accessibility Features

### ARIA Support
**Automatic ARIA attributes**:
- `role="radiogroup"` on RadioGroup
- `role="radio"` on Radio elements
- `aria-checked` reflects checked state
- `aria-disabled` reflects disabled state
- `aria-describedby` auto-associates Description with Radio

**Manual ARIA support**:
- `aria-label` can be added to RadioGroup or Radio
- `aria-labelledby` can reference external labels
- `aria-invalid` for error states (custom implementation)
- `aria-errormessage` for error descriptions (custom implementation)

### Keyboard Navigation
**Full keyboard support**:
- **Arrow Up/Down** or **Arrow Left/Right**: Navigate between options (wraps around)
- **Space** or **Enter**: Select focused option
- **Tab**: Move focus to/from radio group
- Automatic roving tabindex management

### Focus Management
**Intelligent focus handling**:
- First radio receives `tabindex="0"` by default
- Selected radio receives focus when tabbing into group
- Arrow key navigation updates focus
- `autoFocus` prop for initial focus
- Visible focus indicators via `data-focus` attribute

### Screen Reader Support
**Semantic HTML**:
- Proper radiogroup and radio roles
- Checked state announced via aria-checked
- Disabled state announced via aria-disabled
- Label automatically associated with radio
- Description auto-linked via aria-describedby

**Announcements**:
- Selection changes announced to screen readers
- Group label read before options (via Legend or aria-label)
- Current selection state always available

### Color Contrast
**Developer responsibility**:
- No built-in styles means developers must ensure WCAG compliance
- Data attributes make it easy to provide sufficient contrast for all states
- Common pattern: Distinct visual difference for checked vs unchecked

### Form Integration
**Native form semantics**:
- Hidden input created with `name` prop
- Works with standard form submissions
- Compatible with FormData API
- Validation via native HTML attributes

## Notable Features

### Headless Philosophy
**Complete styling freedom**: Zero styling out of the box means:
- No CSS to override or fight against
- Works with any styling approach (CSS, Tailwind, CSS-in-JS, etc.)
- No bundle size from unused styles
- Full design system compatibility

### Two Styling Approaches

**1. Data Attributes** (Recommended for CSS/Tailwind):
```css
.radio[data-checked] { background: blue; }
.radio[data-disabled] { opacity: 0.5; }
.radio[data-focus] { outline: 2px solid blue; }
```

**2. Render Props** (Recommended for dynamic styling):
```jsx
<Radio value="option">
  {({ checked, disabled, focus }) => (
    <div className={`${checked ? 'bg-blue' : 'bg-gray'}`}>
      Option
    </div>
  )}
</Radio>
```

### Object Value Support
**Complex value handling**:
- Not limited to strings/numbers like native radio inputs
- Compare objects by field: `by="id"`
- Custom comparison functions: `by={(a, b) => a.id === b.id}`
- Full TypeScript type safety with generics

### Form Integration
**Native form compatibility**:
- Adding `name` prop creates hidden input
- Synced with RadioGroup state automatically
- Works with traditional form submissions
- FormData API compatible
- Complex values encoded appropriately

### Fragment Rendering
**Maximum flexibility**:
- Render as React Fragment for zero DOM footprint
- Use render props for full control: `<Radio as={Fragment}>{...}</Radio>`
- Useful for complex custom layouts

### TypeScript Support
**Full type safety**:
- Generic types for value typing
- IntelliSense for all props
- Type-safe render props
- Type-safe onChange handlers

## Common Patterns

1. **Plan Selection Cards**: Use render props with card-style layouts showing checked state with visual indicators
2. **Settings Preferences**: Vertical radio lists with descriptions for each option
3. **Payment Method Selection**: Complex objects (card details) as values with custom comparison
4. **Inline Options**: Horizontal layout with button-style radios for compact choices
5. **Form Fields**: Integration with form libraries using `name` prop for native submission
6. **Multi-section Forms**: Fieldset/Legend wrapping for semantic grouping
7. **Conditional Rendering**: Disable options based on other form state
8. **Custom Indicators**: Replace default radio circles with custom graphics using render props

## Related Components

- **Checkbox/CheckboxGroup** - For multiple selection (Headless UI)
- **Listbox** - For dropdown single selection (Headless UI)
- **Combobox** - For searchable single selection (Headless UI)
- **Switch** - For on/off toggle (Headless UI)
- **Field** - Wrapper for associating labels and descriptions (Headless UI)
- **Label** - Text label component (Headless UI)
- **Description** - Helper text component (Headless UI)
- **Fieldset/Legend** - Form grouping components (Headless UI)

## Research Notes

### Design Philosophy
Headless UI's approach is fundamentally different from styled component libraries:
- **No opinions on appearance**: Zero styling allows unlimited customization
- **Focus on behavior**: Handles complex accessibility and interaction logic
- **Web standards first**: Uses semantic HTML and ARIA best practices
- **Framework-specific**: Leverages React/Vue features fully (not web components)

### Implementation Approach
- **Context-based state**: RadioGroup provides context to Radio children
- **Render prop flexibility**: Both data attributes and render props supported
- **Smart defaults**: Sensible behavior without configuration
- **Escape hatches**: Can render as Fragment or custom elements for maximum control

### Comparison to Other Libraries
Unlike styled libraries (MUI, Chakra, Ant Design):
- No predefined visual language
- No theme system (bring your own)
- Smaller bundle size (no CSS)
- More setup required (must style everything)
- Maximum design flexibility

Unlike native HTML radio inputs:
- Better keyboard navigation
- Object value support
- Proper focus management
- Better accessibility out of the box
- Composition patterns for complex layouts

### Best Use Cases
Ideal for:
- Projects with custom design systems
- Design-heavy applications needing pixel-perfect control
- Teams comfortable with CSS/Tailwind
- Applications requiring maximum flexibility

Not ideal for:
- Rapid prototyping (styled libraries faster)
- Teams wanting "out of the box" appearance
- Projects without design resources

---

**Research completed:** 2025-11-05
**Component:** Radio Group
**Framework:** Headless UI
**Documentation:** https://headlessui.com/react/radio-group
**Last Modified:** 2025-11-05

**Notable Features:**
- Completely unstyled "headless" approach for maximum design freedom
- Dual styling methods: data attributes for CSS, render props for JS
- Full object value support with custom comparison strategies
- Native form integration via hidden input synchronization
- Complete accessibility with automatic ARIA attributes
- Comprehensive keyboard navigation with roving tabindex
- Both controlled and uncontrolled modes supported
- Fragment rendering for zero DOM footprint
- TypeScript generics for type-safe value handling
- Works with any styling approach (CSS, Tailwind, CSS-in-JS, etc.)

# Headless UI Checkbox Component - Usage Pattern Report

## 1. Component Overview

Headless UI's Checkbox component provides native HTML checkbox functionality as an **unstyled, headless component**. This means it delivers all the behavior, state management, and accessibility features you need, but **no styling whatsoever**. The component is a "clean slate" that gives you complete design flexibility to style checkboxes however you'd like using CSS frameworks like Tailwind CSS, CSS-in-JS solutions, or traditional CSS.

As a headless component, it focuses exclusively on managing checkbox state (checked/unchecked/indeterminate), accessibility (ARIA attributes, keyboard support), and form integration, leaving all visual presentation entirely up to the implementer.

## 2. Installation & Setup

### Installation

```bash
npm install @headlessui/react
```

### Basic Import

```javascript
import { Checkbox, Field, Label, Description } from '@headlessui/react'
```

The Headless UI Checkbox is designed specifically for React applications and requires React 18 or higher.

## 3. Basic Usage

### Minimal Example (With Custom Styling)

Since Headless UI provides no default styles, you must add all styling yourself. Here's a basic example using Tailwind CSS:

```javascript
import { useState } from 'react'
import { Checkbox } from '@headlessui/react'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Checkbox
      checked={enabled}
      onChange={setEnabled}
      className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-checked:bg-blue-500"
    >
      {/* Checkmark icon */}
      <svg
        className="hidden size-4 fill-white group-data-checked:block"
        viewBox="0 0 14 14"
      >
        <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth={2} fill="none" />
      </svg>
    </Checkbox>
  )
}
```

**Explanation:**
- The `Checkbox` component renders as a `<span>` by default (customizable via `as` prop)
- `checked` and `onChange` create a controlled component pattern
- All visual styling comes from `className` - the component provides NO default appearance
- `data-checked` attribute is automatically added when checked, enabling conditional styling
- You must build your own visual indicator (checkmark icon, background change, etc.)

### With Label and Description

```javascript
import { useState } from 'react'
import { Checkbox, Field, Label, Description } from '@headlessui/react'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Field className="flex items-center gap-2">
      <Checkbox
        checked={enabled}
        onChange={setEnabled}
        className="group size-6 rounded-md bg-white/10 ring-1 ring-white/15 data-checked:bg-blue-500"
      >
        <svg className="hidden size-4 fill-white group-data-checked:block" viewBox="0 0 14 14">
          <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth={2} fill="none" />
        </svg>
      </Checkbox>
      <div>
        <Label className="text-sm font-medium">Enable notifications</Label>
        <Description className="text-xs text-gray-500">
          Receive email notifications about account activity
        </Description>
      </div>
    </Field>
  )
}
```

**Explanation:**
- `Field` groups the checkbox, label, and description together
- `Label` is automatically clickable to toggle the checkbox (accessibility handled automatically)
- `Description` is connected via `aria-describedby` for screen reader support
- All components require custom styling via `className`

## 4. API/Props

### Checkbox Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `String \| Component` | `"span"` | The element or component to render as |
| `checked` | `Boolean` | — | Controlled checked state (use with `onChange`) |
| `defaultChecked` | `Boolean` | — | Initial checked state for uncontrolled component |
| `onChange` | `Function` | — | Callback when checked state changes: `(checked: boolean) => void` |
| `indeterminate` | `Boolean` | `false` | Display indeterminate state (visual only, doesn't affect form value) |
| `disabled` | `Boolean` | `false` | Disable user interaction |
| `autoFocus` | `Boolean` | `false` | Automatically focus on mount |
| `name` | `String` | — | Form field name (creates hidden input for form submission) |
| `value` | `String` | `"on"` | Value submitted when checked (only used with `name` prop) |
| `form` | `String` | — | ID of associated form element |

### Field Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `String \| Component` | `"div"` | The element or component to render as |
| `disabled` | `Boolean` | `false` | Disable all form controls within the field |

### Label Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `String \| Component` | `"label"` | The element or component to render as |
| `passive` | `Boolean` | `false` | If `true`, clicking the label won't toggle the control |

### Description Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `String \| Component` | `"p"` | The element or component to render as |

## 5. State Management

### Checked/Unchecked States

#### Controlled Component (Recommended)

```javascript
const [isChecked, setIsChecked] = useState(false)

<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
/>
```

The parent component owns and manages the state. Every change triggers `onChange` with the new boolean value.

#### Uncontrolled Component

```javascript
<Checkbox
  defaultChecked={true}
  name="accept-terms"
/>
```

The checkbox manages its own internal state. Useful when working with traditional HTML forms where you don't need to react to state changes in JavaScript.

### Indeterminate State

The indeterminate state is a visual-only state (common in "select all" scenarios):

```javascript
const [items, setItems] = useState([
  { id: 1, checked: false },
  { id: 2, checked: true },
  { id: 3, checked: false }
])

const allChecked = items.every(item => item.checked)
const someChecked = items.some(item => item.checked)
const indeterminate = someChecked && !allChecked

<Checkbox
  checked={allChecked}
  indeterminate={indeterminate}
  onChange={(checked) => {
    setItems(items.map(item => ({ ...item, checked })))
  }}
  className="data-indeterminate:bg-gray-500"
/>
```

When `indeterminate={true}`, the component adds a `data-indeterminate` attribute for styling purposes.

### Controlled vs Uncontrolled

**Controlled:**
- Use `checked` + `onChange`
- Parent component manages state
- Can react to changes immediately
- Required for complex UI logic

**Uncontrolled:**
- Use `defaultChecked`
- Component manages its own state
- Simpler for basic forms
- State accessed via form submission or refs

**Important:** Don't mix controlled and uncontrolled patterns - choose one approach per checkbox.

## 6. Composition Patterns

### Basic Field Structure

```javascript
<Field>
  <Label>Label text</Label>
  <Description>Helper text</Description>
  <Checkbox checked={value} onChange={setValue} />
</Field>
```

The `Field` component provides automatic accessibility wiring - labels and descriptions are properly associated without manual ID management.

### Multiple Checkboxes in a Group

```javascript
function CheckboxGroup() {
  const [selected, setSelected] = useState(['email', 'sms'])

  const toggle = (value) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  return (
    <div className="space-y-2">
      <Field>
        <Checkbox
          checked={selected.includes('email')}
          onChange={() => toggle('email')}
        />
        <Label>Email notifications</Label>
      </Field>
      <Field>
        <Checkbox
          checked={selected.includes('sms')}
          onChange={() => toggle('sms')}
        />
        <Label>SMS notifications</Label>
      </Field>
    </div>
  )
}
```

### Disabled Field

```javascript
<Field disabled>
  <Label>Disabled option</Label>
  <Checkbox
    checked={value}
    onChange={setValue}
    className="data-disabled:opacity-50 data-disabled:cursor-not-allowed"
  />
</Field>
```

Setting `disabled` on `Field` disables all child form controls and adds `data-disabled` attribute.

### Custom Render Element

```javascript
<Checkbox
  as="button"
  checked={value}
  onChange={setValue}
/>
```

Change the underlying HTML element while preserving all checkbox behavior.

## 7. Styling Approaches

Since Headless UI provides **zero styling**, you must implement all visual presentation. Here are the primary approaches:

### Data Attributes (Recommended with Tailwind CSS)

Headless UI automatically applies data attributes based on component state:

**Available Data Attributes:**
- `data-checked` - Applied when checkbox is checked
- `data-indeterminate` - Applied when indeterminate
- `data-disabled` - Applied when disabled
- `data-focus` - Applied when focused
- `data-hover` - Applied when hovered
- `data-active` - Applied when being clicked/pressed
- `data-autofocus` - Applied when autofocused
- `data-changing` - Applied during state transitions

```javascript
<Checkbox
  className={`
    size-6 rounded border-2 border-gray-300
    data-checked:bg-blue-500
    data-checked:border-blue-500
    data-focus:ring-2
    data-focus:ring-blue-500
    data-disabled:opacity-50
    data-disabled:cursor-not-allowed
    data-hover:border-blue-400
    transition-colors
  `}
  checked={enabled}
  onChange={setEnabled}
>
  <CheckIcon className="hidden data-checked:block" />
</Checkbox>
```

### Render Props Pattern

Access state values directly in the component tree:

```javascript
<Checkbox checked={enabled} onChange={setEnabled}>
  {({ checked, disabled, focus, hover }) => (
    <span className={clsx(
      'size-6 rounded',
      checked && 'bg-blue-500',
      disabled && 'opacity-50',
      focus && 'ring-2 ring-blue-500',
      hover && !disabled && 'border-blue-400'
    )}>
      {checked && <CheckIcon />}
    </span>
  )}
</Checkbox>
```

### CSS-in-JS (Styled Components, Emotion)

```javascript
import styled from 'styled-components'

const StyledCheckbox = styled(Checkbox)`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  border: 2px solid #d1d5db;

  &[data-checked] {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  &[data-focus] {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
```

### Traditional CSS with Classes

```css
.checkbox {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  border: 2px solid #d1d5db;
  transition: all 0.2s;
}

.checkbox[data-checked] {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkbox[data-focus] {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
```

## 8. Accessibility

Headless UI Checkbox provides comprehensive built-in accessibility support:

### ARIA Attributes

- **Role:** Automatically applies `role="checkbox"`
- **aria-checked:** Synced with checked state (`"true"`, `"false"`, or `"mixed"` for indeterminate)
- **aria-disabled:** Applied when disabled
- **aria-labelledby:** Automatically generated ID links label to checkbox
- **aria-describedby:** Automatically generated ID links description to checkbox

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` | Toggle checkbox checked/unchecked |
| `Enter` | Submit the parent form (if checkbox is inside a form) |
| `Tab` | Move focus to/from the checkbox |

### Screen Reader Support

- Labels are announced when checkbox receives focus
- Descriptions provide additional context
- State changes (checked/unchecked) are announced
- Disabled state is announced
- Indeterminate state is announced as "mixed"

### Focus Management

```javascript
<Checkbox
  autoFocus // Focus on mount
  className="focus:outline-none data-focus:ring-2 data-focus:ring-blue-500"
  checked={enabled}
  onChange={setEnabled}
/>
```

Proper focus indicators are critical for keyboard navigation. Always style the `data-focus` state.

### Best Practices for Accessibility

1. **Always provide a Label:** Even if visually hidden, include a label for screen readers
2. **Use Description for complex options:** Provide additional context when needed
3. **Style focus states clearly:** Make focus indicators obvious for keyboard users
4. **Don't rely on color alone:** Use icons/text to indicate checked state
5. **Test with keyboard navigation:** Ensure all functionality works without a mouse
6. **Test with screen readers:** Verify announcements make sense

## 9. Best Practices

### When to Use Headless UI vs Styled Component Libraries

**Use Headless UI when:**
- You need complete design control
- You have a custom design system
- You want to use Tailwind CSS or custom styling
- You're building a component library
- File size is a critical concern
- You want to avoid style conflicts

**Use styled component libraries (Material-UI, Chakra UI, etc.) when:**
- You want to ship quickly with minimal custom styling
- You're prototyping and don't need custom designs
- Your design closely matches a popular design system
- Team has limited CSS expertise
- You want opinionated, production-ready components out of the box

### Common Patterns

#### Form Integration

```javascript
// Works seamlessly with HTML forms
<form onSubmit={handleSubmit}>
  <Checkbox
    name="terms"
    value="accepted"
    defaultChecked={false}
  />
  <button type="submit">Submit</button>
</form>
```

Adding a `name` prop creates a hidden `<input type="checkbox">` that submits with the form.

#### Select All Pattern

```javascript
function SelectAll() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', checked: false },
    { id: 2, name: 'Item 2', checked: false },
  ])

  const allChecked = items.every(item => item.checked)
  const someChecked = items.some(item => item.checked)

  return (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={someChecked && !allChecked}
        onChange={(checked) => {
          setItems(items.map(item => ({ ...item, checked })))
        }}
      />
      {items.map(item => (
        <Checkbox
          key={item.id}
          checked={item.checked}
          onChange={(checked) => {
            setItems(items.map(i =>
              i.id === item.id ? { ...i, checked } : i
            ))
          }}
        />
      ))}
    </>
  )
}
```

#### Animated Transitions

```javascript
<Checkbox
  className={`
    transition-all duration-200 ease-out
    data-changing:scale-95
    data-checked:bg-blue-500
  `}
  checked={enabled}
  onChange={setEnabled}
>
  <CheckIcon className="transition-opacity data-checked:opacity-100 opacity-0" />
</Checkbox>
```

The `data-changing` attribute is applied during state transitions for frame-perfect animations.

### Performance Considerations

- Headless UI is extremely lightweight since it contains no styles
- Use `React.memo()` for checkbox lists to prevent unnecessary re-renders
- Leverage the `data-changing` attribute for optimized transition animations
- Consider virtual scrolling for large checkbox lists

### Testing Recommendations

1. **Test keyboard navigation:** Ensure Space/Enter work correctly
2. **Test with screen readers:** Verify state announcements
3. **Test form submission:** Confirm values submit correctly
4. **Test disabled state:** Ensure no interaction when disabled
5. **Validate accessibility:** Use tools like axe or Lighthouse

## 10. Comparison Notes

### Headless UI vs Traditional Styled Libraries

| Aspect | Headless UI | Styled Libraries (MUI, Chakra) |
|--------|-------------|--------------------------------|
| **Styling** | Zero styles included - complete control | Pre-styled with theme customization |
| **File Size** | Minimal (behavior only) | Larger (includes CSS/styles) |
| **Design Flexibility** | Unlimited - build any design | Limited to theme system |
| **Time to Ship** | Slower - must build all styles | Faster - styles included |
| **Learning Curve** | Moderate - must understand data attributes | Easier - use provided props |
| **Style Conflicts** | None - no styles to conflict | Potential conflicts with global CSS |
| **Accessibility** | Built-in, comprehensive | Built-in, comprehensive |
| **TypeScript** | Excellent support | Excellent support |

### Philosophy Differences

**Headless UI Philosophy:**
"We provide the behavior, you provide the appearance." This approach treats styling and behavior as separate concerns. The library handles state management, accessibility, and interaction patterns while leaving all visual presentation to you.

**Traditional Library Philosophy:**
"We provide complete, production-ready components." These libraries include both behavior and appearance, offering a faster path to production at the cost of design flexibility.

### Key Advantages of Headless Approach

1. **No style resets needed:** No default styles to override
2. **Perfect Tailwind integration:** Data attributes work seamlessly with Tailwind utilities
3. **Future-proof:** Your styles won't break when the library updates
4. **Framework agnostic styling:** Use any CSS solution (Tailwind, CSS-in-JS, CSS Modules, etc.)
5. **Smaller bundle size:** Only ship the JavaScript you need
6. **No specificity battles:** No cascade conflicts with your styles

### Trade-offs to Consider

**Advantages:**
- Complete design control
- Minimal bundle size
- No style conflicts
- Perfect for custom design systems

**Disadvantages:**
- More initial setup required
- Must build all visual states yourself
- More code to maintain
- Slower development for standard designs

### When Headless Shines

- Building custom design systems
- Tailwind CSS projects
- Applications requiring precise brand compliance
- Component libraries for multiple brands
- Projects where bundle size is critical
- Teams with strong design/CSS expertise

---

## Summary of Key Findings

### Headless UI Philosophy

Headless UI's Checkbox component exemplifies the "headless" component philosophy: **separate behavior from presentation**. The library provides all the functionality you need (state management, accessibility, keyboard support, form integration) without imposing any visual design decisions. This gives you complete freedom to style components exactly how you want while ensuring they remain accessible and functional.

### Core Characteristics

1. **Unstyled by Design:** No CSS included - you must style everything yourself
2. **Data Attribute API:** State exposed via data attributes (`data-checked`, `data-disabled`, etc.)
3. **Render Props Support:** Access state directly in component tree for dynamic styling
4. **Comprehensive Accessibility:** ARIA attributes, keyboard support, and screen reader compatibility built-in
5. **Form Integration:** Works seamlessly with HTML forms via `name` and `value` props
6. **Composable Architecture:** Field/Label/Description components work together automatically

### Best Use Cases

Headless UI Checkbox is ideal for:
- Projects using Tailwind CSS or other utility-first frameworks
- Custom design systems requiring precise visual control
- Applications where bundle size matters
- Teams that want separation between behavior and styling
- Situations where you need to avoid style conflicts with existing CSS

It's less suitable for:
- Rapid prototyping where speed matters more than custom design
- Teams with limited CSS expertise
- Projects that need components to work immediately without styling effort

The headless approach requires more upfront effort but provides unmatched flexibility and avoids the common pitfalls of overriding default styles in traditional component libraries.

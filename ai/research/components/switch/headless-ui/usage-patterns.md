# Headless UI - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://headlessui.com/react/switch
Status: ✅ Working
Version: 2.1 (Latest release)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent technical documentation with detailed examples covering controlled/uncontrolled modes, form integration, styling patterns (data attributes and render props), accessibility features, and keyboard interactions. Includes TypeScript support and multiple code examples.

## Component Definition
- **Core purpose**: Provides an accessible on/off toggle control that matches native checkbox behavior but with custom visual styling
- **Mental model**: A binary toggle switch that users can click or keyboard-activate to change between checked/unchecked states
- **Semantic meaning**: Represents an on/off state for a setting or option, similar to a checkbox but typically used for instant state changes rather than form submissions

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`)
- **Composed**: Via composition/children (e.g., `<Switch>{content}</Switch>`)
- **CSS-only**: Requires custom styling (e.g., `className`, `style`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Composed | Via `<Label>` component wrapped in `<Field>`, automatically associates with switch and makes label clickable. Use `passive` prop on Label to disable click behavior |
| Icons | ✅ | CSS-only | No dedicated icon prop; icons can be rendered as children with conditional logic based on switch state |
| Loading indicator | ❌ | N/A | No built-in loading state support |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `checked` prop (controlled) or `defaultChecked` (uncontrolled). State exposed via `data-checked` attribute and render props |
| Disabled | ✅ | Native | `disabled` prop prevents interaction. Exposed via `data-disabled` attribute |
| Loading | ❌ | N/A | No built-in loading state |
| Read-only | ❌ | N/A | No dedicated read-only prop; must implement via disabled or custom logic |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No size prop; size controlled entirely through CSS classes or styles |
| Color options | ❌ | CSS-only | No color/theme prop; styling done via CSS classes (supports Tailwind data-attribute modifiers like `data-checked:bg-blue-600`) |
| Label placement | ✅ | Composed | Labels positioned via standard layout (Field component with Label, Description, and Switch children). Flexibility through custom layout |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Default behavior - clicking switch toggles state |
| Keyboard control | ✅ | Native | Space key toggles, Enter key submits parent form. Full keyboard accessibility built-in |
| onChange handler | ✅ | Native | `onChange` callback receives new checked state as boolean parameter |
| Controlled mode | ✅ | Native | Use `checked` + `onChange` props for React state management |
| Uncontrolled mode | ✅ | Native | Use `defaultChecked` prop; component manages internal state. Suitable for HTML forms with FormData |

## Code Examples

### Basic Controlled Usage
```jsx
import { useState } from 'react'
import { Switch } from '@headlessui/react'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
    </Switch>
  )
}
```

### With Label and Description
```jsx
import { Field, Label, Description, Switch } from '@headlessui/react'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Field>
      <Label>Enable notifications</Label>
      <Description>Get notified about important changes</Description>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
    </Field>
  )
}
```

### Uncontrolled with Form Integration
```jsx
function Example() {
  return (
    <form>
      <Switch
        name="notifications"
        value="enabled"
        defaultChecked={false}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
    </form>
  )
}
```

### Using Render Props for Styling
```jsx
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch checked={enabled} onChange={setEnabled}>
      {({ checked, disabled }) => (
        <span
          className={clsx(
            'inline-flex h-6 w-11 items-center rounded-full',
            checked ? 'bg-blue-600' : 'bg-gray-200',
            disabled && 'opacity-50'
          )}
        >
          <span
            className={clsx(
              'size-4 rounded-full bg-white transition',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </span>
      )}
    </Switch>
  )
}
```

### Disabled State
```jsx
function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      disabled
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 data-disabled:opacity-50"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
    </Switch>
  )
}
```

### With Icons
```jsx
import { Switch } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
    >
      <span className="inline-block size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6">
        {enabled ? (
          <CheckIcon className="h-4 w-4 text-blue-600" />
        ) : (
          <XMarkIcon className="h-4 w-4 text-gray-400" />
        )}
      </span>
    </Switch>
  )
}
```

[View Live Examples](https://headlessui.com/react/switch)

## Notable Features

### Completely Unstyled by Design
Headless UI provides zero default styling, giving complete control over appearance. All visual design is implemented through CSS classes or inline styles.

### Data Attribute State Exposure
Components expose their state through data attributes (`data-checked`, `data-disabled`, `data-focus`, `data-hover`, `data-active`, `data-autofocus`, `data-changing`) enabling modern CSS frameworks like Tailwind to style based on component state using modifier syntax.

### Flexible Rendering with "as" Prop
Can render as any HTML element or custom React component:
```jsx
<Switch as="div" checked={enabled} onChange={setEnabled} />
<Switch as={CustomComponent} checked={enabled} onChange={setEnabled} />
```

### Form Integration
When `name` prop is provided, automatically creates a hidden input that syncs with switch state for HTML form submission and FormData collection:
```jsx
<Switch name="terms" value="accept" checked={agreed} onChange={setAgreed} />
// Creates: <input type="hidden" name="terms" value="accept" />
```

### Dual Styling Approaches
- **Data attributes**: Modern approach using data-* attributes with CSS
- **Render props**: Traditional approach passing state to function children for conditional logic

### Field Component Integration
The `Field` component provides automatic accessibility features:
- Auto-generates IDs for proper association
- Links Label with Switch for clickability
- Associates Description with Switch for screen readers
- Manages focus and ARIA attributes

### Animation-Friendly
Designed to work seamlessly with CSS transitions and animation libraries (Framer Motion, React Spring). State changes are predictable and animation-compatible.

## Research Notes

### Headless Philosophy
Headless UI follows a "completely unstyled" approach, providing behavior and accessibility without any default visual design. This is a significant departure from traditional UI libraries and offers maximum flexibility but requires more CSS implementation work.

### TypeScript Support
Full TypeScript definitions included. All props are properly typed with excellent IDE autocomplete support.

### React-Specific
This is a React-specific library (not framework-agnostic web components). Vue version available separately as `@headlessui/vue`.

### No Built-in Theming System
Unlike libraries with theme systems, Headless UI expects consumers to implement all styling. This works well with utility-first CSS frameworks like Tailwind CSS.

### Accessibility First
Built with WCAG guidelines in mind. Proper ARIA attributes, keyboard navigation, and screen reader support are handled automatically.

### Minimal API Surface
The component API is intentionally minimal, focusing on core functionality. Advanced features (loading states, sizes, variants) are expected to be implemented by consumers through CSS and composition patterns.

### State Transition Tracking
The `data-changing` attribute appears during state transitions, enabling custom transition animations or loading states during async operations.

### Documentation Strengths
- Clear separation between controlled and uncontrolled modes
- Excellent TypeScript examples
- Good coverage of form integration patterns
- Clear explanation of styling approaches

### Comparison to Traditional Switch Components
Unlike traditional component libraries that provide pre-styled switches with size/color variants, Headless UI provides only the behavior layer. This means:
- **More work upfront**: Must implement all visual styling
- **More flexibility**: No fighting against default styles
- **Better for design systems**: Can match exact brand requirements
- **Smaller bundle size**: No CSS shipped with the library

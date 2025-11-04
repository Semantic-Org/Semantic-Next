# Headless UI - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://headlessui.com/react/button
Status: ✅ Working
Version: v2.1 (React)
Last Verified: 2024-11-04

## Documentation Quality
Good - Clear, concise documentation with practical code examples. Focuses on core functionality and styling integration patterns.

## Component Definition
- **Core purpose**: Provides a light wrapper around the native button element with enhanced state tracking for styling. Acts as an improved button primitive with built-in hover, focus, active, and disabled state management.
- **Mental model**: An enhanced native button that exposes its interaction states through both data attributes and render props, enabling precise styling control without requiring JavaScript logic for state management.
- **Semantic meaning**: Represents a clickable action element with accessible semantics and enhanced developer ergonomics for styling different interaction states.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling (Headless UI is unstyled)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children can be any React node; text content passed as children |
| Icon support | ✅ | Composed | Icons rendered as children or composed with text |
| Icon + Text | ✅ | Composed | Full control over layout via children composition |
| Custom content | ✅ | Composed | Any React node can be passed as children, including complex nested elements |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Button types | ✅ | Native | Native `type` prop (button/submit/reset) - CSS-only styling |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop with `data-disabled` attribute for styling |
| Active | ✅ | Native | Automatic `data-active` attribute when button is pressed |
| Hover | ✅ | Native | Automatic `data-hover` attribute on mouse hover |
| Focus | ✅ | Native | Automatic `data-focus` attribute when focused, plus `autoFocus` prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size prop - all visual styling is custom |
| Variants | ❌ | CSS-only | No built-in variant system - styling must be implemented with CSS/Tailwind |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard React `onClick` and other native event handlers |
| As element | ✅ | Native | Polymorphic `as` prop (default: `button`) to render as different elements/components |
| Accessibility | ✅ | Native | Built on native button semantics with automatic ARIA attributes via state data attributes |

## Code Examples

### Basic Button with Data Attributes
```jsx
import { Button } from '@headlessui/react'

function Example() {
  return (
    <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
      Save changes
    </Button>
  )
}
```

### Button with Disabled State
```jsx
<Button
  disabled
  className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-disabled:bg-gray-500 data-hover:bg-sky-500"
>
  Save changes
</Button>
```

### Using Render Props for State Access
```jsx
import { Button } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'

function Example() {
  return (
    <Button as={Fragment}>
      {({ hover, active }) => (
        <button className={clsx(
          'rounded px-4 py-2 text-sm text-white',
          !hover && !active && 'bg-sky-600',
          hover && !active && 'bg-sky-500',
          active && 'bg-sky-700'
        )}>
          Save changes
        </button>
      )}
    </Button>
  )
}
```

### Polymorphic Button (as link)
```jsx
// Render as a different element using the 'as' prop
<Button as="a" href="/profile" className="...">
  View Profile
</Button>
```

### AutoFocus Example
```jsx
<Button autoFocus className="...">
  Default Action
</Button>
```

## Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | String \| Component | `button` | Polymorphic prop to render as different element/component |
| `disabled` | Boolean | `false` | Disables button and applies `data-disabled` attribute |
| `autoFocus` | Boolean | `false` | Focuses button on mount, adds `data-autofocus` attribute |
| `type` | String | `button` | Native button type (button/submit/reset) |
| `className` | String | - | CSS classes for styling |
| `children` | ReactNode \| Function | - | Content or render prop function |

## State Data Attributes

All interaction states are automatically exposed as data attributes for CSS styling:

- `data-disabled` - Applied when button is disabled
- `data-focus` - Applied when button has focus
- `data-hover` - Applied when button is hovered
- `data-active` - Applied when button is pressed/active
- `data-autofocus` - Applied when autoFocus prop was set

## Render Prop State Object

When using render props pattern, the following state properties are available:

```typescript
{
  hover: boolean,      // Mouse is hovering over button
  active: boolean,     // Button is being pressed
  disabled: boolean,   // Button is disabled
  focus: boolean,      // Button has focus
  autofocus: boolean   // autoFocus prop was set
}
```

## Notable Features

### 1. Dual Styling API
Headless UI Button provides two complementary approaches for styling:
- **Data attributes**: Clean, declarative CSS with Tailwind's data modifiers (`data-hover:`, `data-active:`)
- **Render props**: Programmatic control with JavaScript-based conditional styling

### 2. Automatic State Tracking
The component automatically tracks all interaction states without requiring manual event handlers or state management. This eliminates boilerplate for common button state logic.

### 3. Polymorphic Component Pattern
The `as` prop enables rendering the button functionality with different HTML elements or custom components while preserving all button behavior and accessibility.

### 4. Native Button Foundation
Built as a thin wrapper around the native `<button>` element, ensuring standard HTML button semantics and accessibility features work out of the box.

### 5. Framework for Unstyled Components
Headless UI's philosophy: provide behavior and accessibility, leave all visual design to the consumer. This makes the Button component extremely flexible and integration-friendly.

### 6. Tailwind CSS Integration
Documentation examples prominently feature Tailwind CSS utility classes, showing how data attributes integrate seamlessly with Tailwind's modifier syntax.

## Research Notes

### Documentation Observations
- Documentation is well-structured and concise, focusing on practical implementation patterns
- Heavy emphasis on Tailwind CSS integration, which appears to be the primary styling approach
- Examples are practical and immediately usable
- Limited to React implementation (no Vue/Angular variants mentioned in this documentation)

### Framework Philosophy
Headless UI is fundamentally different from traditional component libraries:
- **Zero styling**: No default visual appearance whatsoever
- **Behavior-focused**: Provides interaction states, accessibility, and component logic
- **Styling flexibility**: Complete freedom to implement any design system
- **Integration-first**: Designed to work within existing design systems rather than impose one

### Accessibility Approach
Rather than manually managing ARIA attributes, Headless UI exposes semantic state through data attributes, allowing CSS to reflect the component's accessible state visually. This creates a direct connection between accessible state and visual presentation.

### Comparison to Traditional Button Components
Unlike component libraries that provide visual variants (primary, secondary, danger, etc.), Headless UI Button:
- Provides no visual styling
- Offers no size or variant props
- Focuses exclusively on state management and accessibility
- Requires consumers to implement all visual design

This makes it ideal for:
- Custom design systems that need behavior without opinions
- Teams with established design languages
- Applications requiring full visual control
- Gradual adoption without conflicting styles

### Developer Experience
The dual API (data attributes vs render props) provides flexibility:
- **Data attributes**: Simpler, more declarative, works well with Tailwind
- **Render props**: More powerful, enables complex conditional logic

This allows developers to choose the approach that fits their use case and styling methodology.

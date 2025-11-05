# PrimeReact - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/inputswitch/
Status: ✅ Working
Version: 10.9.7
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear API documentation with examples, accessibility guidance, and state management patterns. Documentation is concise but covers essential use cases.

## Component Definition
- **Core purpose**: Provides a binary toggle control for boolean state selection, replacing traditional checkbox inputs with a more modern sliding switch UI.
- **Mental model**: A physical toggle switch - users conceptualize this as an on/off mechanism with immediate visual feedback. The sliding animation reinforces the metaphor of physically moving a switch.
- **Semantic meaning**: Communicates binary state (on/off, yes/no, enabled/disabled) with emphasis on immediate state changes rather than form submission. Typically used for settings and preferences where the action takes effect immediately.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`)
- **Composed**: Via composition/children (e.g., `<Switch>{content}</Switch>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Composed | Labels are external and associated via `inputId` prop linked to a standard `<label htmlFor="...">` element. No built-in label props. |
| Icons | ❌ | N/A | No documented support for icons within the switch component itself. |
| Loading indicator | ❌ | N/A | No loading state is documented or supported. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | Controlled via `checked` boolean prop. Component displays as "active initially" when checked is true. |
| Disabled | ✅ | Native | `disabled` boolean prop prevents interaction and focus. Component visually indicates disabled state. |
| Loading | ❌ | N/A | No loading state support documented. |
| Read-only | ❌ | N/A | No explicit read-only state. Use disabled for non-interactive display. |
| Invalid | ✅ | CSS-only | Achieved through `className="p-invalid"` to indicate validation failure. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | N/A | No size variations documented. Single default size only. |
| Color options | ❌ | N/A | No color variations documented. Uses theme defaults. |
| Label placement | ✅ | Composed | External label placement controlled by HTML structure. Standard `<label>` element positioned before or after the InputSwitch. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Standard click interaction toggles the switch state. |
| Keyboard control | ✅ | Native | Tab key for focus navigation, Space key to toggle state. Built-in keyboard accessibility. |
| onChange handler | ✅ | Native | Required event handler receives object with `value` property: `onChange={(e) => setChecked(e.value)}` |
| Controlled mode | ✅ | Native | Primary pattern - requires both `checked` and `onChange` props. Fully controlled component. |
| Uncontrolled mode | ❌ | N/A | No uncontrolled mode documented. Always requires state management. |

## Code Examples

### Basic Usage (Controlled)
```jsx
import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';

export default function BasicDemo() {
    const [checked, setChecked] = useState(false);

    return (
        <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    );
}
```

### With External Label
```jsx
export default function LabelDemo() {
    const [checked, setChecked] = useState(false);

    return (
        <div className="flex align-items-center">
            <label htmlFor="switch1" className="mr-2">Remember Me</label>
            <InputSwitch
                inputId="switch1"
                checked={checked}
                onChange={(e) => setChecked(e.value)}
            />
        </div>
    );
}
```

### Disabled State
```jsx
export default function DisabledDemo() {
    return (
        <InputSwitch checked={false} disabled />
    );
}
```

### Invalid State
```jsx
export default function InvalidDemo() {
    const [checked, setChecked] = useState(false);

    return (
        <InputSwitch
            className="p-invalid"
            checked={checked}
            onChange={(e) => setChecked(e.value)}
        />
    );
}
```

### Accessibility Example
```jsx
export default function AccessibilityDemo() {
    const [checked, setChecked] = useState(false);

    return (
        <div>
            {/* Option 1: With label element */}
            <label htmlFor="switch2">Enable Notifications</label>
            <InputSwitch
                inputId="switch2"
                checked={checked}
                onChange={(e) => setChecked(e.value)}
            />

            {/* Option 2: With aria-label */}
            <InputSwitch
                aria-label="Toggle dark mode"
                checked={checked}
                onChange={(e) => setChecked(e.value)}
            />

            {/* Option 3: With aria-labelledby */}
            <span id="switch-label">Dark Mode</span>
            <InputSwitch
                aria-labelledby="switch-label"
                checked={checked}
                onChange={(e) => setChecked(e.value)}
            />
        </div>
    );
}
```

[View Live](https://primereact.org/inputswitch/)

## Notable Features
- **Fully Controlled Pattern**: Component strictly follows controlled component pattern - no uncontrolled mode available. This ensures predictable state management but requires boilerplate.
- **Minimal API Surface**: Very simple API with only essential props. No size variations, colors, or icons - focusing on the core toggle functionality.
- **Strong Accessibility**: Built-in keyboard navigation and screen reader support with multiple ARIA labeling options.
- **Hidden Native Input**: Implements a hidden native checkbox with switch role for screen readers, providing semantic HTML foundation.
- **Standard Event Object Pattern**: onChange handler receives object with `value` property rather than raw event, following PrimeReact's consistent event handling pattern.
- **CSS Class-Based Validation**: Uses className prop with "p-invalid" class for validation states rather than dedicated validation prop.
- **No Loading State**: Unlike some modern switch implementations, no built-in loading or pending state support.

## Research Notes
- Documentation is well-structured and accessible without issues.
- PrimeReact focuses on controlled components exclusively - no support for uncontrolled usage patterns.
- The component is intentionally minimal - no size variants, color options, or icon support. This contrasts with some UI libraries that offer more visual customization.
- The invalid state through className rather than a dedicated prop suggests PrimeReact prefers generic styling mechanisms over component-specific APIs.
- Label handling is entirely external through standard HTML label elements and ARIA attributes, keeping the switch component focused on state management.
- The onChange handler's `e.value` pattern (rather than `e.target.value`) is consistent with PrimeReact's event handling but differs from native DOM events.
- No mention of animation customization or transitions - likely handled entirely through CSS theming.
- The strict controlled-only pattern may require more boilerplate but ensures predictable behavior in React applications.

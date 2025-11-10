# PrimeReact - Slider Usage Patterns

## Component URL
https://primereact.org/slider/
Status: ✅ Working
Version: Current
Last Verified: 2025-11-10

## Documentation Quality
Good - Comprehensive documentation with multiple examples, accessibility guidance, and clear API reference. Includes practical use cases and integration patterns.

## Component Definition
- **Core purpose**: Provides a graphical slider control for selecting numeric values or ranges through direct manipulation with immediate visual feedback.
- **Mental model**: A draggable handle on a track that maps position to a numeric value, similar to volume controls or filter adjustments. Users think of it as "dragging to adjust a value."
- **Semantic meaning**: Represents a numeric input mechanism that communicates adjustable values within a bounded range, often used for settings, filters, or parameter controls.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `value` prop accepts single numeric value, `onChange` returns `e.value` |
| Range (min-max) | ✅ | Native | `range` boolean prop enables dual-handle mode with array values `[min, max]` |
| Labels/marks | ❌ | N/A | No visible track marks or labels shown in documentation |
| Tooltips on handle | ❌ | N/A | No tooltip feature visible in examples |
| Custom handle content | ❌ | N/A | No custom handle rendering shown |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default mode with single numeric `value` prop |
| Range (dual handles) | ✅ | Native | Enabled via `range` boolean prop, value becomes array `[min, max]` |
| Vertical orientation | ✅ | Native | `orientation="vertical"` prop for vertical layout |
| Reverse direction | ❌ | N/A | No reverse/RTL direction mentioned |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ⚠️ | Unknown | Not explicitly shown in documentation but likely supported via standard props |
| Read-only | ⚠️ | Unknown | Not explicitly shown in documentation |
| Error state | ❌ | N/A | No error state handling visible |
| Loading | ❌ | N/A | No loading state shown |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop defines movement increment size (e.g., `step={20}`) |
| Track marks | ❌ | N/A | No visible track marks feature |
| Color customization | ✅ | CSS-only | Via `className` and PrimeReact theming system |
| Size variants | ✅ | CSS-only | Width controlled via `className="w-14rem"` or similar utility classes |
| Track styling | ✅ | CSS-only | Customizable through PrimeReact theme variables and custom classes |

## Code Examples
```jsx
// Basic single value slider
import { Slider } from 'primereact/slider';
import { useState } from 'react';

export default function BasicDemo() {
    const [value, setValue] = useState(0);

    return (
        <Slider value={value} onChange={(e) => setValue(e.value)} />
    );
}
```

```jsx
// Range slider with dual handles
export default function RangeDemo() {
    const [value, setValue] = useState([20, 80]);

    return (
        <Slider value={value} onChange={(e) => setValue(e.value)} range />
    );
}
```

```jsx
// Slider with step increments
export default function StepDemo() {
    const [value, setValue] = useState(0);

    return (
        <Slider value={value} onChange={(e) => setValue(e.value)} step={20} />
    );
}
```

```jsx
// Vertical orientation
export default function VerticalDemo() {
    const [value, setValue] = useState(50);

    return (
        <Slider
            value={value}
            onChange={(e) => setValue(e.value)}
            orientation="vertical"
        />
    );
}
```

```jsx
// Integration with input field (two-way binding)
import { InputText } from 'primereact/inputtext';

export default function InputDemo() {
    const [value, setValue] = useState(50);

    return (
        <div className="flex flex-column gap-2">
            <InputText value={value} onChange={(e) => setValue(e.target.value)} />
            <Slider value={value} onChange={(e) => setValue(e.value)} />
        </div>
    );
}
```

## Notable Features
- **Controlled component pattern**: Requires explicit `value` and `onChange` props following React controlled component conventions
- **Keyboard accessibility**: Full keyboard support including arrow keys (fine adjustment), Home/End (boundaries), Page Up/Down (10-step increments)
- **ARIA compliance**: Proper ARIA roles (`slider`) and attributes (`aria-orientation`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`)
- **Input integration**: Seamless two-way binding with text inputs for combined slider/numeric entry UI
- **Practical examples**: Documentation includes real-world use case (image filter adjustment) demonstrating typical implementation patterns
- **Event object structure**: `onChange` receives object with `e.value` property rather than raw value
- **Responsive sizing**: Uses PrimeReact/Tailwind utility classes for dimensional control

## Research Notes
- Documentation is well-structured with clear examples for each major feature
- Some common patterns (tooltips, track marks, labels) are not present in the current API
- State handling (disabled, readonly) not explicitly documented but may be available through standard HTML/React props
- No explicit error or validation state patterns shown
- Theming and customization appears to rely on PrimeReact's global theme system rather than component-specific props
- Range mode implementation is straightforward: single boolean prop switches between single value and dual-handle array mode
- Step increments work in both single and range modes
- The component follows React's controlled component pattern strictly - no uncontrolled mode shown

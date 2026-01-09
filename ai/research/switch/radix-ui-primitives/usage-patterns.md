# Radix UI Primitives - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/primitives/docs/components/switch
Status: ✅ Working
Version: 1.2.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear API reference, accessibility details, keyboard interactions, and styling guidance.

## Component Definition
- **Core purpose**: A binary toggle control that switches between two mutually exclusive states (checked/unchecked). Used for feature toggles like "Airplane mode" or enabling/disabling settings.
- **Mental model**: A digital representation of a physical switch or toggle. Users think of it as "on/off" or "enabled/disabled" - a binary choice that takes immediate effect.
- **Semantic meaning**: Communicates immediate state changes rather than form submission. Visually and functionally distinct from checkboxes, which typically represent selection within a form context.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`)
- **Composed**: Via composition/children (e.g., `<Switch.Root><Switch.Thumb /></Switch.Root>`)
- **CSS-only**: Requires custom styling (e.g., `[data-state="checked"]`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ❌ | — | No built-in label support. Labels must be implemented separately using external elements with proper ARIA associations. |
| Icons | ❌ | — | No native icon support. Icons can be added as children within Switch.Root or Switch.Thumb via composition. |
| Loading indicator | ❌ | — | No built-in loading state. Would need to be implemented via custom styling or additional composed elements. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | Controlled via `checked` prop or `defaultChecked` for uncontrolled mode. Exposed via `[data-state="checked|unchecked"]` attribute. |
| Disabled | ✅ | Native | `disabled` prop prevents interaction. Exposed via `[data-disabled]` attribute for styling. |
| Loading | ❌ | — | No native loading state support. |
| Read-only | ❌ | — | No explicit read-only mode. Would need to be implemented via custom logic and disabled state styling. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No native size variants. Implemented entirely through custom CSS styling on Root and Thumb components. |
| Color options | ❌ | CSS-only | No native color/theme variants. Styling controlled through CSS using data attributes. |
| Label placement | ❌ | Composed | Labels handled externally. Common pattern is wrapping Switch with a label element or using aria-labelledby. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Clicking the switch toggles between checked/unchecked states automatically. |
| Keyboard control | ✅ | Native | Space and Enter keys toggle the state. Fully accessible with proper focus management. |
| onChange handler | ✅ | Native | `onCheckedChange(checked: boolean)` callback fires when state changes. |
| Controlled mode | ✅ | Native | Pass both `checked` and `onCheckedChange` props. Component state controlled externally. |
| Uncontrolled mode | ✅ | Native | Use `defaultChecked` prop. Component manages its own internal state. |

## Code Examples
```jsx
// Basic uncontrolled usage
import * as Switch from '@radix-ui/react-switch';

<Switch.Root defaultChecked>
  <Switch.Thumb />
</Switch.Root>

// Controlled mode with state management
const [checked, setChecked] = React.useState(false);

<Switch.Root checked={checked} onCheckedChange={setChecked}>
  <Switch.Thumb />
</Switch.Root>

// Form integration with name and value
<form>
  <Switch.Root name="airplane-mode" value="on">
    <Switch.Thumb />
  </Switch.Root>
</form>

// Disabled state
<Switch.Root disabled>
  <Switch.Thumb />
</Switch.Root>

// With styling using data attributes
<Switch.Root
  className="w-11 h-6 bg-gray-200 rounded-full data-[state=checked]:bg-blue-500"
>
  <Switch.Thumb
    className="block w-5 h-5 bg-white rounded-full transition-transform data-[state=checked]:translate-x-5"
  />
</Switch.Root>
```

## Notable Features
- **Composition-based architecture**: Clean separation between Root (container/logic) and Thumb (visual indicator) components.
- **Automatic form integration**: Renders a hidden input element when used within forms to ensure proper event propagation and form data submission.
- **Data attributes for styling**: `[data-state]` and `[data-disabled]` attributes enable powerful CSS-based styling without JavaScript.
- **Full keyboard accessibility**: Space and Enter keys work out of the box, adhering to ARIA switch role specifications.
- **Controlled and uncontrolled modes**: Flexible API supporting both paradigms - use `checked`+`onCheckedChange` for controlled, or `defaultChecked` for uncontrolled.
- **Small bundle size**: 4.31 kB gzipped - lightweight primitive implementation.
- **Headless design**: No default styling, giving developers complete control over visual appearance.
- **asChild pattern**: Both Root and Thumb support the `asChild` prop for render delegation to custom components.

## Research Notes
- Documentation is exceptionally clear and well-organized with API reference, accessibility guidance, and keyboard interaction details.
- The component follows Radix UI's headless primitive philosophy - provides behavior and accessibility without prescriptive styling.
- The two-part composition (Root + Thumb) is minimal but effective, giving flexibility for custom implementations.
- No built-in support for loading states, icons, or labels keeps the primitive focused and lightweight.
- The automatic form integration feature (hidden input rendering) is a thoughtful touch for progressive enhancement.
- Data attribute approach to styling (`[data-state]`, `[data-disabled]`) is elegant and aligns with modern CSS practices.
- The primitive nature means most visual variations (size, color, label placement) are intentionally left to implementation via CSS or composition.

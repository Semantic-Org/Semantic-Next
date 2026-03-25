# ShadCN - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/switch
Status: ✅ Working
Version: Current (based on Radix UI v1.2.6)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear examples and integration patterns, though documentation relies heavily on Radix UI's comprehensive API reference for detailed prop information.

## Component Definition
- **Core purpose**: A binary toggle control that allows users to switch between checked and unchecked states, functioning as an accessible alternative to traditional checkboxes for on/off scenarios.
- **Mental model**: Users think of this as a physical toggle switch - sliding between two states with immediate visual feedback. Unlike checkboxes which imply selection from a list, switches suggest an immediate state change or setting activation.
- **Semantic meaning**: Communicates an on/off state or binary setting that takes effect immediately upon toggling. Common in settings panels and feature toggles where the action is instantaneous rather than submitted as part of a form.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`, `disabled={true}`)
- **Composed**: Via composition/children (e.g., using Switch.Root + Switch.Thumb)
- **CSS-only**: Requires custom styling (e.g., `className` with Tailwind classes)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Composed | External Label component using `htmlFor` attribute for accessibility. No built-in label prop. |
| Icons | ❌ | CSS-only | No dedicated icon support. Could be added via custom styling or modifying component source. |
| Loading indicator | ❌ | CSS-only | Not supported natively. Would require custom implementation. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `checked` prop (controlled), `defaultChecked` (uncontrolled). `onCheckedChange` callback receives boolean. |
| Disabled | ✅ | Native | Boolean `disabled` prop. Prevents interaction and applies disabled styling via `data-disabled` attribute. |
| Loading | ❌ | CSS-only | Not built-in. Could be implemented via custom data attribute or state. |
| Read-only | ❌ | CSS-only | Not natively supported. Could use disabled state or custom implementation. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size variants. Can be customized via className or CSS custom properties. |
| Color options | ❌ | CSS-only | No color prop. Theme colors applied via Tailwind classes in component definition. Can be customized by modifying component source. |
| Label placement | ✅ | Composed | Label placement controlled by flex layout. Example shows label after switch with `space-x-2` spacing. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Built into Radix UI Switch primitive. Toggles checked state on click. |
| Keyboard control | ✅ | Native | Space and Enter keys toggle state. Full keyboard navigation support from Radix UI. |
| onChange handler | ✅ | Native | `onCheckedChange` callback: `(checked: boolean) => void`. Fires when state changes. |
| Controlled mode | ✅ | Native | `checked` prop with `onCheckedChange` handler. Standard React controlled component pattern. |
| Uncontrolled mode | ✅ | Native | `defaultChecked` prop for initial state. Component manages internal state. |

## Code Examples

### Basic Usage
```jsx
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
```

### Controlled Mode (Inferred from Radix UI)
```jsx
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ControlledSwitch() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="controlled-switch"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label htmlFor="controlled-switch">
        {checked ? "On" : "Off"}
      </Label>
    </div>
  )
}
```

### Uncontrolled Mode (Inferred from Radix UI)
```jsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function UncontrolledSwitch() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="uncontrolled-switch" defaultChecked={true} />
      <Label htmlFor="uncontrolled-switch">Default On</Label>
    </div>
  )
}
```

### Form Integration (Inferred from Radix UI)
```jsx
import { Switch } from "@/components/ui/switch"

export function FormSwitch() {
  return (
    <form>
      <Switch
        name="notifications"
        value="enabled"
        required
      />
    </form>
  )
}
```

### Disabled State (Inferred from Radix UI)
```jsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function DisabledSwitch() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-switch" disabled />
      <Label htmlFor="disabled-switch">Disabled</Label>
    </div>
  )
}
```

[View Live](https://ui.shadcn.com/docs/components/switch)

## Implementation Architecture

### Component Structure (from Radix UI)
The Switch is built from two Radix UI primitives:
- **Switch.Root**: Container element that renders the interactive switch control and a hidden `input` element for form participation
- **Switch.Thumb**: Visual indicator that shows the current state (slides between positions)

### Key Props (from Radix UI)

**Switch.Root Props:**
- `asChild`: boolean - Merge props with custom element
- `defaultChecked`: boolean - Initial unchecked state for uncontrolled mode
- `checked`: boolean - Controlled checked state
- `onCheckedChange`: (checked: boolean) => void - State change callback
- `disabled`: boolean - Disables interaction
- `required`: boolean - Form requirement
- `name`: string - Form field name
- `value`: string - Form submission value (default: "on")

**Switch.Thumb Props:**
- `asChild`: boolean - Merge props with custom element

### Data Attributes for Styling
Both Root and Thumb expose these data attributes:
- `[data-state]`: "checked" | "unchecked"
- `[data-disabled]`: Present when disabled

### Installation
```bash
pnpm dlx shadcn@latest add switch
```

## Notable Features

### 1. Built on Radix UI Primitives
- Inherits excellent accessibility from Radix UI's Switch component
- Implements full WAI-ARIA switch pattern
- Automatic keyboard navigation (Space/Enter to toggle)
- Proper focus management and ARIA attributes

### 2. Copy-Paste Component Model
- Unlike traditional npm packages, ShadCN copies component source into your project
- Provides full code ownership and customization control
- No library lock-in - you own and maintain the code
- Can be modified directly without ejecting or forking

### 3. Form Integration
- Automatically renders hidden input element for native form submission
- Supports standard form attributes: `name`, `value`, `required`
- Works with FormData API
- Integrates with form libraries like React Hook Form

### 4. Tailwind CSS Styling
- Pre-styled with Tailwind utility classes
- Uses Tailwind's design tokens for consistent theming
- Supports dark mode via Tailwind's dark mode utilities
- Easy to customize by modifying Tailwind classes in component source

### 5. Accessibility First
- Full keyboard support (Space and Enter keys)
- Proper ARIA attributes (`role="switch"`, `aria-checked`)
- Focus management with visible focus indicators
- Screen reader compatible
- Follows W3C Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch

### 6. TypeScript Support
- Full TypeScript definitions from Radix UI
- Type-safe props and event handlers
- IntelliSense support in editors

### 7. Minimal Bundle Size
- Radix UI Switch: 4.31 kB (gzip)
- No large styling library overhead
- Tree-shakeable when using modular imports

### 8. Composition Pattern
- Follows React composition patterns
- Separate Label component for flexibility
- Label association via standard `htmlFor`/`id` pattern
- Encourages accessible markup structure

## Styling Approach

### Default Styling (Tailwind Classes)
The ShadCN implementation uses these styling patterns:
- Root: Background color changes based on `data-state`
- Thumb: Translates position based on `data-state`
- Disabled: Reduced opacity and cursor styling via `data-disabled`
- Focus: Focus ring using Tailwind's focus utilities
- Transitions: Smooth animations for state changes

### Customization Methods
1. **Modify Component Source**: Edit the copied component file directly
2. **Tailwind Classes**: Add/modify utility classes in component
3. **CSS Custom Properties**: Use Tailwind's CSS variables
4. **className Prop**: Pass additional classes to override defaults

## Integration with Form Libraries

### React Hook Form (Documented by ShadCN)
ShadCN provides extensive documentation for React Hook Form integration:
- Register switch with form state
- Validation support
- Error handling
- Type-safe form schemas with Zod

### Formik Support
Works with Formik through standard form field patterns:
- Use `checked` and `onCheckedChange` with Formik's field helpers
- Integrates with Formik's validation system

### Native HTML Forms
Supports native form submission:
- Hidden input element included automatically
- Standard form attributes (`name`, `value`, `required`)
- Works with FormData API

## Comparison to Checkbox

### When to Use Switch vs Checkbox
**Use Switch when:**
- Action takes effect immediately
- Represents on/off state or binary setting
- Commonly used in settings panels
- State change is obvious and expected to be instantaneous

**Use Checkbox when:**
- Part of a form that requires submission
- Multiple items can be selected independently
- Selection from a list of options
- Changes don't take effect until form submission

### Semantic Differences
- **Switch**: Implies immediate action (like a light switch)
- **Checkbox**: Implies selection that may be submitted later
- **ARIA Role**: Switch uses `role="switch"`, Checkbox uses `role="checkbox"`
- **User Expectation**: Switch = instant feedback, Checkbox = pending selection

## Research Notes

### Documentation Access
- Primary documentation readily available and well-organized
- Relies on Radix UI documentation for comprehensive API details
- Examples are clear and production-ready
- Installation via CLI is straightforward

### Framework Approach
- **Distribution Model**: Copy-paste rather than npm package
- **Styling**: Opinionated Tailwind implementation (not headless)
- **Customization**: Source code ownership for full control
- **Dependencies**: Minimal (React + Radix UI primitives)

### Key Observations

1. **Simplicity**: The API surface is minimal, focusing on essential functionality
2. **Composition Over Props**: No built-in label prop, favors composition with separate Label component
3. **No Size/Color Variants**: Unlike many component libraries, no built-in size or color props - customization via direct code modification
4. **Accessibility Priority**: Built on Radix UI ensures accessibility is not an afterthought
5. **Developer Experience**: Copy-paste model provides transparency and learning opportunity
6. **Modern React Patterns**: Uses controlled/uncontrolled patterns familiar to React developers
7. **Form-First**: Strong emphasis on form integration and validation

### Strengths
- Excellent accessibility out of the box
- Full code ownership and customization control
- Minimal API surface area (easy to learn)
- Strong TypeScript support
- Works seamlessly with modern form libraries
- Transparent implementation (can read and learn from source)

### Limitations
- No built-in size or color variants (requires manual customization)
- No icon support without custom implementation
- Tailwind-dependent (not suitable for non-Tailwind projects without refactoring)
- Limited styling API (no CSS custom properties by default)
- No loading state pattern
- Manual updates required (not versioned like npm packages)

### Unique Innovations
- **Copy-Paste Distribution**: Revolutionary approach to component libraries - you own the code
- **Radix + Tailwind**: Combines headless primitives (behavior) with utility-first styling
- **CLI Installation**: `shadcn` CLI for adding components to project
- **Selective Adoption**: Can pick individual components without installing entire library

### Suitability for Different Projects
**Excellent for:**
- Tailwind CSS projects
- Projects wanting component code ownership
- Teams comfortable maintaining component code
- Projects with custom design systems built on Tailwind
- Developers who want to learn component implementation

**Less Suitable for:**
- Non-Tailwind projects (requires significant refactoring)
- Teams wanting versioned, maintained component libraries
- Projects needing many pre-built size/color variants
- Rapid prototyping with minimal customization

## Recommendations for Semantic UI Implementation

### Adopt These Patterns
1. ✅ **Accessibility First**: Follow Radix UI's comprehensive ARIA implementation
2. ✅ **Controlled/Uncontrolled Modes**: Support both patterns with `checked`/`defaultChecked`
3. ✅ **Form Integration**: Use ElementInternals (web component equivalent of hidden input)
4. ✅ **Composition Over Props**: Separate label component rather than built-in label prop
5. ✅ **Data Attributes**: Expose `data-state` and `data-disabled` for styling hooks
6. ✅ **Keyboard Navigation**: Full Space/Enter key support with proper focus management

### Consider These Additions
1. 🔶 **Size Variants**: Add sm/md/lg sizes (ShadCN lacks this)
2. 🔶 **Color Variants**: Add semantic color system (primary/success/warning/error)
3. 🔶 **CSS Custom Properties**: For theming without code modification
4. 🔶 **CSS Parts**: Shadow DOM `::part()` selectors for external styling
5. 🔶 **Icon Support**: Slots for custom icons on thumb
6. 🔶 **Loading State**: Pattern for async operations

### Different Approach for Web Components
1. **Shadow DOM Encapsulation**: Semantic UI can use Shadow DOM for true style isolation
2. **CSS Custom Properties**: Enable theming without modifying source code
3. **CSS Parts API**: Allow external styling of internal elements
4. **Framework Agnostic**: Works in vanilla JS, React, Vue, Angular, etc.
5. **Self-Contained**: No external Label component needed (can use internal label or slots)

### Semantic UI Advantages
- Can provide built-in size/color variants (ShadCN requires manual customization)
- CSS custom properties for theming (ShadCN uses Tailwind classes)
- Framework agnostic (ShadCN is React-specific)
- Versioned releases with dependency management (ShadCN is copy-paste)
- Can be used directly in HTML (ShadCN requires React build step)

## Related Components
- **Checkbox**: For selection rather than immediate state changes
- **Radio**: For exclusive selection from multiple options
- **Toggle**: Sometimes used synonymously with Switch
- **Button**: For action triggers rather than state representation

## Additional Resources
- **ShadCN Documentation**: https://ui.shadcn.com/docs/components/switch
- **Radix UI Switch**: https://www.radix-ui.com/primitives/docs/components/switch
- **W3C Switch Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/switch
- **Package**: @radix-ui/react-switch v1.2.6 (4.31 kB gzip)

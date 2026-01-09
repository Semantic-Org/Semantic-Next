# Chakra UI - PasswordInput Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/password-input
Status: ✅ Working
Version: v3.x (Chakra UI latest)
Last Verified: 2025-11-05

## Documentation Quality
**Assessment**: The Chakra UI v3 PasswordInput component documentation exists and is accessible, though the page structure makes automated extraction challenging. The component appears to be part of Chakra UI v3's composable component system, consistent with their architectural direction. Based on the available information and comparison with similar Chakra v3 components, the documentation likely includes comprehensive examples, props tables, and composition patterns.

**Documentation Completeness**:
- Component purpose and overview: Present
- Code examples: Present (but not fully extractable via automated tools)
- Props documentation: Expected to be present
- Accessibility documentation: Implied through Chakra's standard practices
- Integration examples: Present (mentions react-hook-form integration)

## Component Definition
- **Core purpose**: A specialized form input component designed specifically for secure password entry, extending standard input functionality with password-specific features including visibility toggle, strength indicators, and proper security handling.
- **Mental model**: A password input is an enhanced text input that defaults to obscuring characters for security, with a built-in toggle button to temporarily reveal the entered text. It's a form control that balances security (hiding sensitive data) with usability (allowing users to verify their entry).
- **Semantic meaning**: Communicates to users and systems that this field expects sensitive password data, should be treated securely, and provides standard password interaction patterns (hide/show toggle).

## Pattern Support Levels
- **Native**: Chakra UI v3 provides native support for the PasswordInput component with built-in visibility toggle, multiple sizes, form integration, and accessibility features. The component is a first-class form control with dedicated API and styling.
- **Composed**: The v3 architecture likely follows Chakra's composable pattern with sub-components (e.g., PasswordInput.Root, PasswordInput.Input, PasswordInput.Visibility) that can be arranged to create custom layouts while maintaining functionality.
- **CSS-only**: Not applicable - the password visibility toggle requires JavaScript for interaction, making this a fully interactive component rather than a CSS-only pattern.

## Core Patterns

### Size Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| xs (extra small) | ✅ | Native | Smallest password input size for compact UIs |
| sm (small) | ✅ | Native | Small password input size |
| md (medium) | ✅ | Native | Default password input size |
| lg (large) | ✅ | Native | Large password input size for emphasis |

### State Management
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uncontrolled | ✅ | Native | Standard usage without state management |
| Controlled | ✅ | Native | Using `value` and `onChange` props for state control |
| Visibility controlled | ✅ | Native | Using `visible` and `onVisibleChange` props to control password visibility |
| Form library integration | ✅ | Native | Compatible with react-hook-form |

### Input States
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default | ✅ | Native | Standard enabled password input state |
| Disabled | ✅ | Native | Disabled state preventing interaction |
| Invalid/Error | ✅ | Native | Error state with `data-invalid` attribute |
| Focus | ✅ | Native | Focus state with customizable focus ring |

### Password-Specific Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Visibility toggle | ✅ | Native | Built-in show/hide password button |
| Password strength meter | ✅ | Composed | PasswordStrengthMeter component for password validation feedback |
| Secure input masking | ✅ | Native | Default obscured text display |

### Form Integration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Field wrapper | ✅ | Composed | Integration with Field component for labels and helper text |
| Fieldset grouping | ✅ | Composed | Works within Fieldset for form organization |
| Form validation | ✅ | Native | Support for validation states |
| React Hook Form | ✅ | Native | Direct integration with react-hook-form library |

## Code Examples

**Note**: Due to limitations in automated extraction from the Chakra UI documentation site, the following examples are reconstructed based on Chakra UI v3 patterns and the confirmed features from the documentation. For exact code examples, please refer directly to https://chakra-ui.com/docs/components/password-input

### Basic Usage
```jsx
import { PasswordInput } from "@/components/ui/password-input"

function BasicExample() {
  return (
    <PasswordInput placeholder="Enter your password" />
  )
}
```

### Size Variants
```jsx
import { PasswordInput } from "@/components/ui/password-input"
import { Stack } from "@chakra-ui/react"

function SizeExample() {
  return (
    <Stack gap={4}>
      <PasswordInput size="xs" placeholder="Extra small" />
      <PasswordInput size="sm" placeholder="Small" />
      <PasswordInput size="md" placeholder="Medium (default)" />
      <PasswordInput size="lg" placeholder="Large" />
    </Stack>
  )
}
```

### Controlled Component
```jsx
"use client"
import { useState } from "react"
import { PasswordInput } from "@/components/ui/password-input"

function ControlledExample() {
  const [password, setPassword] = useState("")

  return (
    <PasswordInput
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter password"
    />
  )
}
```

### Controlled Visibility
```jsx
"use client"
import { useState } from "react"
import { PasswordInput } from "@/components/ui/password-input"

function VisibilityExample() {
  const [visible, setVisible] = useState(false)

  return (
    <PasswordInput
      visible={visible}
      onVisibleChange={(details) => setVisible(details.visible)}
      placeholder="Password with controlled visibility"
    />
  )
}
```

### With Password Strength Meter
```jsx
"use client"
import { useState } from "react"
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input"
import { Stack } from "@chakra-ui/react"

function PasswordStrengthExample() {
  const [password, setPassword] = useState("")

  // Calculate password strength (0-100)
  const calculateStrength = (pass) => {
    let strength = 0
    if (pass.length >= 8) strength += 25
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25
    if (/\d/.test(pass)) strength += 25
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 25
    return strength
  }

  return (
    <Stack gap={2}>
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create strong password"
      />
      <PasswordStrengthMeter value={calculateStrength(password)} />
    </Stack>
  )
}
```

### React Hook Form Integration
```jsx
"use client"
import { useForm } from "react-hook-form"
import { PasswordInput } from "@/components/ui/password-input"
import { Button, Stack } from "@chakra-ui/react"

function FormExample() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <PasswordInput
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" }
          })}
          placeholder="Enter password"
          invalid={!!errors.password}
        />
        {errors.password && <Text color="red.500">{errors.password.message}</Text>}
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  )
}
```

### With Field Wrapper (Label and Helper Text)
```jsx
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"

function FieldExample() {
  return (
    <Field label="Password" helperText="Must be at least 8 characters" required>
      <PasswordInput placeholder="Enter your password" />
    </Field>
  )
}
```

### Disabled State
```jsx
import { PasswordInput } from "@/components/ui/password-input"

function DisabledExample() {
  return (
    <PasswordInput
      disabled
      value="example-password"
      placeholder="Disabled password input"
    />
  )
}
```

### Invalid/Error State
```jsx
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"

function ErrorExample() {
  return (
    <Field
      label="Password"
      invalid
      errorText="Password must contain at least one uppercase letter"
    >
      <PasswordInput placeholder="Enter password" invalid />
    </Field>
  )
}
```

## Styling Approaches

### Component Architecture (v3)
Based on Chakra UI v3's composable architecture, the PasswordInput likely uses a structure similar to:
- **Root wrapper**: Main container that manages state and composition
- **Input element**: The actual password input field
- **Visibility toggle**: Button to show/hide password text
- **Strength indicator**: Optional component for password strength visualization

### CSS Variables and Theming
The component integrates with Chakra UI's design token system:
- `--input-height`: Controls the height of the input (mapped to size variants)
- `--focus-ring-color`: Customizes focus ring appearance
- Standard Chakra color palette tokens for backgrounds, borders, and text
- Border radius: `var(--chakra-radii-l2)`

### Size Mapping
Password input sizes are mapped to the Input component sizes:
- `xs`: Extra small for compact UIs
- `sm`: Small for dense layouts
- `md`: Medium (default) for standard forms
- `lg`: Large for prominent password fields

### State Styling
- **Focus state**: Visible focus ring using `--focus-ring-color`
- **Invalid state**: Uses `data-invalid` attribute for error styling
- **Disabled state**: Reduced opacity and pointer-events disabled
- **Placeholder**: Standard placeholder text styling

### Custom Styling
Following Chakra UI v3 patterns, styling can be customized through:
- Style props on the component
- Theme configuration
- CSS-in-JS patterns
- Design token overrides

## Accessibility Patterns

### Keyboard Navigation
Based on Chakra UI's accessibility standards:
- **Tab**: Navigate to/from the password input
- **Shift + Tab**: Navigate backwards
- **Enter**: Submit form (when in a form)
- **Visibility toggle button** is keyboard accessible

### ARIA Attributes
Expected ARIA implementation (standard for Chakra UI):
- Proper `type="password"` attribute on input
- `aria-invalid` when in error state
- `aria-required` when field is required
- `aria-describedby` linking to helper text or error messages
- Toggle button has appropriate `aria-label` (e.g., "Show password" / "Hide password")

### Screen Reader Support
- Password input announces as "password" input type
- Visibility state changes are announced
- Error messages are associated and announced
- Required status is communicated
- Helper text is properly associated

### Focus Management
- Clear visible focus indicators
- Focus ring customization through `--focus-ring-color`
- Focus state distinct from hover state
- No focus trap issues

### Form Integration Accessibility
- Proper label association
- Error messages programmatically associated
- Field validation states properly communicated
- Group context provided when within fieldsets

## Notable Features

### 1. Built-in Visibility Toggle
Unlike basic input components, PasswordInput includes native visibility toggle functionality without requiring additional composition or custom implementation.

### 2. Password Strength Meter
Chakra provides a dedicated `PasswordStrengthMeter` component that integrates seamlessly with the PasswordInput, allowing for visual password strength feedback.

### 3. Size Flexibility
Multiple size variants (xs, sm, md, lg) allow the component to adapt to different UI contexts and design requirements.

### 4. React Hook Form Integration
Native support for react-hook-form makes form validation and state management straightforward without custom wrapper components.

### 5. Controlled Visibility State
Beyond just toggling visibility within the component, developers can control the visibility state externally using `visible` and `onVisibleChange` props, enabling advanced use cases like synchronized visibility across multiple password fields.

### 6. Composable Architecture (v3)
Following Chakra UI v3's design philosophy, the component likely exposes sub-components that can be composed for custom layouts while maintaining accessibility and functionality.

### 7. Design Token Integration
Full integration with Chakra UI's design token system enables consistent theming across the application and easy customization through token overrides.

### 8. Form Validation States
Native support for validation states (invalid, required) with proper visual feedback and accessibility attributes.

## Research Notes

### Documentation Access Limitations
The Chakra UI v3 documentation site structure presents challenges for automated content extraction. The documentation exists and is comprehensive, but the technical architecture (likely using a React-based documentation framework) makes direct code example extraction difficult without browser-based scraping.

### Version Context
This research focuses on Chakra UI v3, which represents a significant architectural shift from v2:
- **v3 approach**: Composable components with explicit sub-component structure
- **v2 approach**: Monolithic components with all features built-in

The PasswordInput component in v3 likely follows the composable pattern used in other v3 components like Checkbox, Select, and Input.

### Confirmed Features
From documentation verification:
- Component exists and is documented at the official URL
- Size variants: xs, sm, md, lg
- Controlled component support via `value` and `onChange`
- Visibility control via `visible` and `onVisibleChange`
- Password strength meter companion component
- React Hook Form integration
- Form Field wrapper support

### Implementation Import Path
The component is imported from `@/components/ui/password-input`, suggesting it may be part of Chakra UI's "snippets" system - pre-built component compositions that can be added to projects via CLI. This is consistent with v3's approach of providing flexible, customizable component recipes.

### Comparison with Other Frameworks
The PasswordInput component represents a middle ground between:
- **Headless libraries** (Radix, Headless UI): Provides more built-in styling and functionality
- **Opinionated libraries** (Ant Design, MUI): More flexible and customizable
- **Native HTML**: Significantly enhanced with visibility toggle, strength meter, and accessibility features

### Best Practices Observed
Based on the component design:
1. Always provide labels through Field wrapper for accessibility
2. Use size variants to match surrounding UI elements
3. Integrate password strength meter for user-facing password creation
4. Leverage react-hook-form for validation logic
5. Maintain controlled visibility state when synchronizing across multiple password fields

### Related Components
The PasswordInput integrates with Chakra UI's broader form ecosystem:
- **Field**: For labels, helper text, and error messages
- **Fieldset**: For grouping related form fields
- **Input**: Shares size and styling patterns
- **PinInput**: Related secure input component for numeric codes

### Future Considerations
For developers evaluating this component:
- Verify specific API details directly from the official documentation
- Test accessibility with screen readers in your target environment
- Consider custom strength calculation logic based on security requirements
- Evaluate whether snippet-based installation fits your project architecture

---

**Research Methodology**: This report combines direct documentation access, web search results, architectural analysis based on Chakra UI v3 patterns, and comparison with documented similar components. Code examples are reconstructed based on confirmed features and v3 composition patterns. For production implementation, always verify against the official documentation at https://chakra-ui.com/docs/components/password-input

**Limitations**: Automated extraction of code examples from the documentation site was not fully possible due to the site's technical architecture. Examples provided are reconstructed based on confirmed features and Chakra UI v3 patterns but may differ slightly from the exact examples in the documentation.

**Confidence Level**: High for feature existence and component capabilities; Medium for exact API details and code syntax. Direct documentation review recommended for production implementation.

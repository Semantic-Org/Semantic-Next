# Mantine - PasswordInput Usage Patterns

## Component URL
https://mantine.dev/core/password-input/
Status: ✅ Working
Version: 8.3.6 (Package: @mantine/core)
Last Verified: 2025-11-05

## Documentation Quality
**Rating: ★★★★★ Excellent**

The documentation is comprehensive and well-structured with:
- Interactive live demos with expand/collapse code sections
- Complete Styles API visualization with hover-highlighting
- Multiple practical examples covering common use cases
- Accessibility guidance with multiple implementation patterns
- Source code and edit links for all examples
- Clear prop documentation with type information
- Related component cross-references
- Advanced integration examples (strength meter with Progress/Popover)

The documentation effectively balances basic usage with advanced patterns, making it accessible to both beginners and experienced developers.

## Component Definition

- **Core purpose**: Specialized input component for capturing password data with built-in visibility toggle functionality
- **Mental model**: A TextInput with password-specific enhancements (masking, reveal toggle) while inheriting all standard input capabilities from the Input component family
- **Semantic meaning**: Communicates secure credential entry with user control over visibility, signaling sensitive data handling to both users and assistive technologies

## Pattern Support Levels

- **Native**: Features built directly into the PasswordInput component (visibility toggle, controlled/uncontrolled visibility state, password masking, error states)
- **Composed**: Patterns achieved by combining PasswordInput with other Mantine components (strength meter with Progress/Popover, form validation with @mantine/form)
- **CSS-only**: Visual customization through Mantine's theming system, Styles API, and CSS custom properties without changing component behavior

## Core Patterns

### Component Inheritance & Extension

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Extends Input component | ✅ | Native | Inherits all Input and Input.Wrapper props and behaviors |
| Standard input attributes | ✅ | Native | Supports all native HTML input element props |
| Polymorphic component | ✅ | Native | Can render as any HTML element or React component |

### Visibility Control

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in toggle button | ✅ | Native | Eye icon button to show/hide password by default |
| Controlled visibility | ✅ | Native | `visible` and `onVisibilityChange` props for state management |
| Uncontrolled visibility | ✅ | Native | Component manages visibility state internally |
| Synchronized visibility | ✅ | Composed | Multiple password inputs sharing visibility state via controlled mode |
| Custom toggle icons | ✅ | Native | `visibilityToggleIcon` prop accepts custom component |
| Toggle accessibility | ✅ | Native | `visibilityToggleButtonProps` for aria-label customization |

### Size Variants

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| xs | ✅ | Native | Extra small size variant |
| sm | ✅ | Native | Small size variant |
| md | ✅ | Native | Medium size variant (default) |
| lg | ✅ | Native | Large size variant |
| xl | ✅ | Native | Extra large size variant |

### Visual Variants

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default variant | ✅ | Native | Standard input appearance with border |
| Filled variant | ✅ | Native | Filled background appearance |
| Unstyled variant | ✅ | Native | No default styles, for custom styling |

### Border Radius Options

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| xs | ✅ | Native | Extra small radius |
| sm | ✅ | Native | Small radius |
| md | ✅ | Native | Medium radius (default) |
| lg | ✅ | Native | Large radius |
| xl | ✅ | Native | Extra large radius |

### Label & Description

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label prop | ✅ | Native | Built-in label with automatic association |
| Required indicator | ✅ | Native | Asterisk with `withAsterisk` prop |
| Description text | ✅ | Native | Help text below input |
| Label order | ✅ | Native | Control label position via `labelProps` |

### Error States

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Boolean error | ✅ | Native | Error state without message |
| Error with message | ✅ | Native | String prop displays error text |
| Error styling | ✅ | Native | Red border and error text color |

### Sections (Icon Positioning)

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left section | ✅ | Native | `leftSection` prop for icons/content on left |
| Right section | ✅ | Native | `rightSection` prop (replaces visibility toggle) |
| Section width control | ✅ | Native | `leftSectionWidth` and `rightSectionWidth` props |
| Section pointer events | ✅ | Native | Control interactivity with pointer-events props |

### State Management

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled mode | ✅ | Native | `value` and `onChange` props |
| Uncontrolled mode | ✅ | Native | `defaultValue` prop with internal state |
| Ref access | ✅ | Native | `ref` prop for imperative DOM access |
| Disabled state | ✅ | Native | `disabled` prop (hides visibility toggle) |

### Form Integration

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Native form support | ✅ | Native | Standard `name` attribute for FormData |
| @mantine/form integration | ✅ | Composed | Documented integration with Mantine's form library |
| React Hook Form | ✅ | Composed | Compatible with popular form libraries |

### Advanced Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Password strength meter | ✅ | Composed | Example with Progress and Popover components |
| Validation requirements | ✅ | Composed | Checklist pattern for password requirements |
| Placeholder text | ✅ | Native | Standard `placeholder` attribute |

## Code Examples

### Basic Usage
```jsx
import { PasswordInput } from '@mantine/core';

function Demo() {
  return (
    <PasswordInput
      label="Password"
      description="Password must include at least one letter, number and special character"
      placeholder="Your password"
    />
  );
}
```

### Controlled Component
```jsx
import { useState } from 'react';
import { PasswordInput } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <PasswordInput
      label="Password"
      placeholder="Password"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}
```

### Synchronized Visibility Across Multiple Inputs
```jsx
import { useState } from 'react';
import { PasswordInput, Stack } from '@mantine/core';

function Demo() {
  const [visible, setVisible] = useState(false);

  return (
    <Stack>
      <PasswordInput
        label="Password"
        placeholder="Password"
        visible={visible}
        onVisibilityChange={setVisible}
      />
      <PasswordInput
        label="Confirm password"
        placeholder="Confirm password"
        visible={visible}
        onVisibilityChange={setVisible}
      />
    </Stack>
  );
}
```

### Custom Visibility Toggle Icons
```jsx
import { PasswordInput } from '@mantine/core';
import { IconEyeCheck, IconEyeOff } from '@tabler/icons-react';

function CustomIcon({ reveal }) {
  return reveal ? <IconEyeCheck /> : <IconEyeOff />;
}

function Demo() {
  return (
    <PasswordInput
      label="Password"
      placeholder="Password"
      visibilityToggleIcon={CustomIcon}
    />
  );
}
```

### Password Strength Meter
```jsx
import { useState } from 'react';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

function PasswordRequirement({ meets, label }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;
  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function Demo() {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Popover opened={popoverOpened} position="bottom" width="target">
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          <PasswordInput
            label="Your password"
            placeholder="Your password"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb="xs" />
        <PasswordRequirement
          label="Includes at least 6 characters"
          meets={value.length > 5}
        />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
}
```

### With Left and Right Sections
```jsx
import { PasswordInput } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

function Demo() {
  return (
    <PasswordInput
      label="Password"
      placeholder="Password"
      leftSection={<IconLock size={16} />}
    />
  );
}
```

**Note:** Using `rightSection` prop replaces the default visibility toggle button.

### Error States
```jsx
import { PasswordInput, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      {/* Boolean error */}
      <PasswordInput
        label="Password"
        placeholder="Password"
        error
      />

      {/* Error with message */}
      <PasswordInput
        label="Password"
        placeholder="Password"
        error="Password must include at least one special character"
      />
    </Stack>
  );
}
```

### Disabled State
```jsx
import { PasswordInput } from '@mantine/core';

function Demo() {
  return (
    <PasswordInput
      label="Password"
      placeholder="Password"
      disabled
    />
  );
}
```

**Note:** When disabled, the visibility toggle button is hidden.

### Using Ref for Imperative Access
```jsx
import { useRef } from 'react';
import { PasswordInput, Button, Group } from '@mantine/core';

function Demo() {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <PasswordInput
        label="Password"
        placeholder="Password"
        ref={ref}
      />
      <Group mt="md">
        <Button onClick={() => ref.current?.focus()}>
          Focus input
        </Button>
      </Group>
    </>
  );
}
```

## Styling Approaches

### Styles API

The PasswordInput component exposes the following selectors for styling customization:

| Selector | Description |
|----------|-------------|
| `root` | Root element |
| `wrapper` | Root Input element (wraps input and sections) |
| `input` | Input element |
| `section` | Left and right sections |
| `innerInput` | Actual `<input>` element |
| `label` | Label element |
| `required` | Required asterisk element |
| `description` | Description text element |
| `error` | Error text element |
| `visibilityToggle` | Visibility toggle button |

### Styling Methods

**1. Styles Prop (Object-based):**
```jsx
<PasswordInput
  styles={{
    input: { backgroundColor: 'var(--mantine-color-gray-1)' },
    label: { fontSize: 'var(--mantine-font-size-lg)' },
  }}
/>
```

**2. ClassNames Prop (Class-based):**
```jsx
<PasswordInput
  classNames={{
    input: 'custom-input',
    label: 'custom-label',
  }}
/>
```

**3. CSS Custom Properties:**
```css
.password-input {
  --psi-icon-size: 1.5rem;
}
```

**4. Theme Overrides:**
```jsx
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  components: {
    PasswordInput: {
      defaultProps: {
        size: 'md',
        radius: 'sm',
      },
      styles: {
        input: { borderWidth: 2 },
      },
    },
  },
});
```

**5. Unstyled Variant:**
```jsx
<PasswordInput variant="unstyled" />
```

Provides a clean slate for completely custom styling.

## Accessibility Patterns

### Screen Reader Support

**Three Accessibility Implementation Patterns:**

**1. With Visible Label (Recommended):**
```jsx
<PasswordInput
  label="Password"
  placeholder="Enter your password"
/>
```
Automatically associates label with input for screen reader announcement.

**2. With aria-label (No Visible Label):**
```jsx
<PasswordInput
  aria-label="Password"
  placeholder="Enter your password"
/>
```
Provides screen reader label when visual label is not desired.

**3. Custom Toggle Button Label:**
```jsx
<PasswordInput
  label="Password"
  visibilityToggleButtonProps={{
    'aria-label': 'Toggle password visibility'
  }}
/>
```
Customizes the accessibility label for the visibility toggle button.

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus input field |
| `Shift + Tab` | Focus previous element |
| `Enter` | Submit form (when in form context) |
| `Space` | Toggle visibility (when toggle button focused) |
| `Enter` | Toggle visibility (when toggle button focused) |

### Focus Management

- Input receives focus ring on keyboard navigation
- Visibility toggle button is keyboard accessible
- Focus indicators follow Mantine's default focus ring styling
- Supports `:focus-visible` for keyboard-only focus indicators

### ARIA Attributes

**Automatically Applied:**
- Input has associated label via `id`/`for` attributes
- Error state announced with `aria-invalid` when error prop is set
- Error message associated via `aria-describedby`
- Description text associated via `aria-describedby`

**User-Configurable:**
- `aria-label` - Label for screen readers when label prop not used
- `visibilityToggleButtonProps['aria-label']` - Custom label for toggle button

### Accessibility Requirements

According to documentation:
> PasswordInput is required to have `label` or `aria-label` to be accessible, otherwise screen reader users will not be able to understand what the input is for.

## Notable Features

### 1. Inheritance from Input Component
PasswordInput extends Mantine's Input component, inheriting all its capabilities while adding password-specific features. This provides consistency across the component library.

### 2. Flexible Visibility Control
Offers both controlled and uncontrolled visibility modes, enabling advanced patterns like synchronized visibility across multiple password fields (useful for password/confirm password scenarios).

### 3. Custom Icon Integration
The `visibilityToggleIcon` prop accepts a component with a `reveal` boolean prop, allowing complete customization of the toggle icons while maintaining functionality.

### 4. Section System with Trade-offs
The left/right section system is powerful but comes with a notable trade-off: using `rightSection` removes the default visibility toggle. This design decision ensures layout consistency.

### 5. Comprehensive Styles API
Exposes 9 different styling targets through the Styles API, enabling granular customization while maintaining encapsulation.

### 6. Disabled State Behavior
When disabled, the visibility toggle is automatically hidden, preventing interaction with the reveal functionality in a disabled state.

### 7. Advanced Integration Examples
The password strength meter example demonstrates sophisticated composition with Progress and Popover components, providing a real-world pattern for password creation flows.

### 8. Variant System
Three visual variants (default, filled, unstyled) provide baseline styling options that cover common design patterns while supporting full customization.

### 9. Size System
Five size variants (xs, sm, md, lg, xl) provide comprehensive sizing options that integrate with Mantine's global sizing system.

### 10. TypeScript Support
Full TypeScript types with generics for polymorphic component support, providing excellent developer experience and type safety.

## Research Notes

### Strengths
- **Comprehensive documentation** with interactive examples and clear API reference
- **Excellent accessibility** with multiple implementation patterns documented
- **Flexible customization** through Styles API, theme system, and CSS custom properties
- **Thoughtful defaults** with password-specific behavior (masking, toggle) built-in
- **Component composition** examples show real-world integration patterns
- **Consistent API** through inheritance from Input component family

### Limitations
- **Right section trade-off**: Using `rightSection` removes the visibility toggle (documented but may surprise users)
- **No strength meter built-in**: Password strength validation requires manual implementation (though well-documented example provided)
- **Visibility toggle always right-aligned**: No built-in support for left-aligned toggle
- **No paste button**: Some password managers benefit from explicit paste affordance (not provided)

### Design Philosophy
Mantine's PasswordInput follows a "sensible defaults with escape hatches" philosophy:
- Default behavior handles common cases (visibility toggle, masking)
- Props provide customization for specific needs (custom icons, sections)
- Styles API enables deep customization when needed
- Composition patterns support advanced use cases

### Comparison Considerations
When compared to other frameworks:
- **More opinionated** than headless alternatives (Radix, Headless UI)
- **More flexible** than highly styled libraries with limited customization
- **Better documented** than many alternatives with real-world examples
- **TypeScript-first** with excellent type safety

### Web Component Implementation Notes
For adapting to a web component implementation:
- Visibility toggle could be implemented with slots for maximum flexibility
- The section system maps well to named slots (left-section, right-section)
- Styles API targets could map to CSS parts (::part(input), ::part(toggle))
- The `visible` prop pattern works naturally with boolean attributes
- Event-driven visibility changes map to CustomEvents
- The disabled hiding toggle behavior should be preserved

### Framework Integration Patterns
The component demonstrates mature framework integration:
- Works seamlessly with `@mantine/form` for validation
- Compatible with React Hook Form and other form libraries
- Proper ref forwarding for imperative access
- Standard controlled/uncontrolled patterns
- Native form participation through standard attributes

### Future Enhancement Opportunities
Based on the documentation:
- Built-in password strength indicator (currently requires composition)
- Configurable toggle position (left vs right)
- Copy/paste button integration
- Password generation integration
- Caps lock warning indicator
- Password peek timeout (auto-hide after delay)

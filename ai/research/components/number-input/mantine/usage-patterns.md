# Mantine - Number Input Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/number-input/
Status: ✅ Working
Version: Current (v7)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with extensive examples, detailed API reference, and clear explanations of behavior.

## Component Definition
- **Core purpose**: Capture and format numeric input from users with built-in validation and formatting controls
- **Mental model**: A specialized text input that only accepts numbers, with optional increment/decrement controls and advanced formatting capabilities
- **Semantic meaning**: Represents a numeric value input field with optional constraints, formatting, and visual feedback

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={10}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value display | ✅ | Native | `value` and `defaultValue` props accept string or number |
| Formatting (currency, percent) | ✅ | Native | `prefix="$"` and `suffix="%"` props for adding text |
| Prefix/suffix support | ✅ | Native | Dedicated `prefix` and `suffix` props for text display |
| Custom formatting | ✅ | Native | Built on `react-number-format` with extensive formatting options including decimal/thousand separators |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Integer input | ✅ | Native | `allowDecimal={false}` disables decimal input |
| Decimal/float input | ✅ | Native | Default behavior allows decimals, controlled by `allowDecimal` |
| Currency input | ✅ | Native | Use `prefix="$"` with `decimalScale={2}` and `fixedDecimalScale` |
| Percentage input | ✅ | Native | Use `suffix="%"` with optional `min={0}` and `max={100}` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop prevents all interaction |
| Read-only | ✅ | Native | `readOnly` prop (inherited from Input component) |
| Loading | ✅ | Native | Not explicitly shown but likely inherited from Input component |
| Error state | ✅ | Native | `error` prop accepts boolean or error message string |
| Focus state | ✅ | Native | Standard HTML focus behavior with styling support |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Standard Mantine size variants: xs, sm, md, lg, xl |
| Min/max values | ✅ | Native | `min` and `max` props with configurable `clampBehavior` |
| Step increment | ✅ | Native | `step` prop defines increment/decrement amount |
| Precision control | ✅ | Native | `decimalScale` limits decimal places, `fixedDecimalScale` forces display |
| Stepper controls | ✅ | Native | Built-in increment/decrement buttons, hideable with `hideControls` |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard input | ✅ | Native | Standard numeric keyboard input with validation |
| Mouse wheel | ❌ | Not mentioned | No explicit mouse wheel support documented |
| Stepper buttons | ✅ | Native | Click increment/decrement buttons, with hold-to-repeat functionality |
| Keyboard shortcuts | ✅ | Native | Arrow up/down for increment/decrement (standard behavior) |

## Code Examples

### Basic Usage
```tsx
import { NumberInput } from '@mantine/core';
import { useState } from 'react';

function Demo() {
  const [value, setValue] = useState<string | number>('');
  return (
    <NumberInput
      value={value}
      onChange={setValue}
      label="Basic number input"
      placeholder="Enter a number"
    />
  );
}
```

### Currency Formatting
```tsx
<NumberInput
  label="Price"
  prefix="$"
  decimalScale={2}
  fixedDecimalScale
  defaultValue={99.99}
  placeholder="0.00"
/>
```

### Min/Max with Clamping
```tsx
<NumberInput
  label="Enter value between 10 and 20"
  min={10}
  max={20}
  clampBehavior="strict"
  defaultValue={15}
/>
```

### Percentage Input
```tsx
<NumberInput
  label="Completion"
  suffix="%"
  min={0}
  max={100}
  defaultValue={75}
  step={5}
/>
```

### Thousand Separators
```tsx
<NumberInput
  label="Large number"
  thousandSeparator=","
  defaultValue={1000000}
  placeholder="1,000,000"
/>
```

### Custom Decimal Separator
```tsx
<NumberInput
  label="European format"
  decimalSeparator=","
  thousandSeparator="."
  defaultValue={20573.45}
/>
```

### With Left Section Icon
```tsx
import { IconCurrencyDram } from '@tabler/icons-react';

<NumberInput
  label="Price"
  leftSection={<IconCurrencyDram size={20} />}
  defaultValue={100}
/>
```

### Hold to Increment/Decrement
```tsx
<NumberInput
  label="Hold to repeat"
  stepHoldDelay={500}
  stepHoldInterval={100}
  defaultValue={0}
/>
```

### Proportional Hold Interval
```tsx
<NumberInput
  label="Proportional speed"
  stepHoldDelay={500}
  stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
  defaultValue={0}
/>
```

### Programmatic Control
```tsx
import { useRef } from 'react';
import { NumberInput, NumberInputHandlers, Button, Group } from '@mantine/core';

function Demo() {
  const handlersRef = useRef<NumberInputHandlers>(null);

  return (
    <>
      <NumberInput
        handlersRef={handlersRef}
        step={2}
        min={10}
        max={20}
        defaultValue={15}
      />
      <Group mt="md">
        <Button onClick={() => handlersRef.current?.increment()}>
          Increment
        </Button>
        <Button onClick={() => handlersRef.current?.decrement()}>
          Decrement
        </Button>
      </Group>
    </>
  );
}
```

### Error States
```tsx
// Boolean error
<NumberInput error label="Invalid input" />

// With error message
<NumberInput error="Value must be between 0 and 100" label="Percentage" />
```

### Disabled State
```tsx
<NumberInput
  disabled
  label="Disabled input"
  defaultValue={100}
/>
```

### Without Controls
```tsx
<NumberInput
  hideControls
  label="Plain number input"
  placeholder="No increment/decrement buttons"
/>
```

[View Live Examples](https://mantine.dev/core/number-input/)

## Notable Features

### Value Type Coercion
The component intelligently handles value types: when the value can be represented as a number, `onChange` receives a number. However, empty states return `''`, unsafe integers return strings, and partial decimal values like `0.` remain strings. This provides flexibility while maintaining type safety.

### Clamp Behavior Options
Three clamping modes provide different UX patterns:
- **"clamp" (default)**: Value is clamped on blur
- **"strict"**: Prevents input outside min/max range
- **"none"**: No clamping enforcement

### Built on react-number-format
Leverages the mature `react-number-format` library, inheriting its robust formatting capabilities including international number formats, custom separators, and grouping styles (thousand, lakh, wan).

### Hold-to-Repeat with Customization
The stepper buttons support hold-to-repeat functionality with configurable delays and intervals. The `stepHoldInterval` can accept a function for proportional acceleration, creating smooth progressive increment behavior.

### Programmatic Control via Ref
The `handlersRef` exposes `increment()` and `decrement()` methods, enabling external controls to manipulate the value programmatically without managing the value state directly.

### Thousand Grouping Styles
Supports multiple international grouping conventions:
- **"thousand"**: 1,000,000 (Western)
- **"lakh"**: 10,00,000 (Indian)
- **"wan"**: 100,0000 (Chinese)
- **"none"**: No grouping

### Left/Right Sections
Inherited from the Input component, `leftSection` and `rightSection` allow for icons, text, or interactive elements on either side of the input. The `pointerEvents` props enable or disable interaction with these sections.

### Form Integration
Seamlessly integrates with form libraries through standard `value`/`onChange` pattern. The component properly handles both controlled and uncontrolled modes via `value`/`defaultValue`.

## Research Notes

### Observations
- Mantine's NumberInput is exceptionally feature-rich, going beyond basic numeric input to provide sophisticated formatting capabilities
- The component API is well-designed with sensible defaults while exposing fine-grained control for advanced use cases
- Documentation is thorough with numerous practical examples covering common scenarios
- The reliance on `react-number-format` provides battle-tested formatting logic

### Accessibility Considerations
The documentation emphasizes the need for either a `label` prop or `aria-label` for screen reader support. The component inherits Input accessibility features, ensuring proper ARIA attributes and keyboard navigation.

### Integration Patterns
The component follows Mantine's consistent API patterns, making it intuitive for developers familiar with other Mantine components. The Styles API support via `classNames` enables deep customization while maintaining the component's functionality.

---

**Research completed**: November 5, 2025
**Component**: NumberInput
**Framework**: Mantine (v7)
**Documentation**: https://mantine.dev/core/number-input/

# Chakra UI - Number Input Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/number-input
Status: ✅ Working
Version: v3.28.1 (latest), v2 documentation also available
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Chakra UI provides thorough documentation with multiple versions (v2 and v3), detailed API reference, interactive Storybook examples, and source code access.

## Component Definition
- **Core purpose**: Enable users to enter numeric values with integrated stepper controls for incrementing and decrementing values. Provides fine-grained control over numeric input with built-in validation, formatting, and interaction patterns.
- **Mental model**: A specialized text input field optimized for numbers, with adjacent +/- buttons (steppers) for precise value adjustment. Users can type directly, use arrow keys, mouse wheel, or click stepper buttons to modify values.
- **Semantic meaning**: A form control specifically for numeric data entry that communicates precision, boundaries, and increment behavior. Indicates to users that only numeric values are expected and provides affordances for incremental adjustment.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `min={0}`, `max={100}`)
- **Composed**: Via composition/children (e.g., `<NumberInputStepper><NumberIncrementStepper /></NumberInputStepper>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value display | ✅ | Native | Displays current numeric value in input field; accessible via `value` and `defaultValue` props |
| Formatting (currency, percent) | ✅ | Native | `format` prop accepts function to transform display value (e.g., `format={(val) => \`$${val}\``}); `parse` prop reverses transformation for internal value storage |
| Prefix/suffix support | ✅ | Native | Implemented through `format` and `parse` functions for custom prefixes/suffixes; `formatOptions` prop maps to `Intl.NumberFormatOptions` for locale-based formatting |
| Custom formatting | ✅ | Native | `format` and `parse` props allow complete control over display vs. internal value representation; supports locale-based formatting via `formatOptions` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Integer input | ✅ | Native | Default behavior without `precision` prop; `step={1}` for integer increments; `pattern="[0-9]*"` for integer-only validation |
| Decimal/float input | ✅ | Native | `precision` prop controls decimal places (e.g., `precision={2}` for 2 decimals); `step={0.01}` for decimal increments; `inputMode="decimal"` for mobile keyboards |
| Currency input | ✅ | Native | `format={(val) => \`$${val}\`}` with `parse={(val) => val.replace(/^\$/, '')}` for display/storage separation; `formatOptions` supports `Intl.NumberFormat` for locale-aware currency |
| Percentage input | ✅ | Native | Similar to currency using `format`/`parse` functions; `formatOptions` can specify `style: 'percent'` for proper internationalization |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `isDisabled` prop (or `disabled` alias) disables all interactions; visual feedback via reduced opacity; steppers and input field become non-interactive |
| Read-only | ✅ | Native | `isReadOnly` prop (or `readOnly` alias) prevents editing but allows focus and value reading; steppers remain visible but non-functional |
| Loading | ⚠️ | Composed | Not directly supported; can be implemented by composing with Spinner in InputRightElement or setting `isDisabled` during async operations |
| Error state | ✅ | Native | `isInvalid` prop applies error styling; integrates with Chakra's Field component for error messages; sets `aria-invalid` automatically |
| Focus state | ✅ | Native | `focusBorderColor` and `errorBorderColor` props customize focus appearance; `focusInputOnChange` prop controls whether input receives focus during stepper use |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with values: "xs", "sm", "md" (default), "lg"; controls height and padding of entire component including steppers |
| Min/max values | ✅ | Native | `min` and `max` props set boundaries (defaults: `Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`); `keepWithinRange` prop prevents out-of-range values; `clampValueOnBlur` clamps to boundaries on blur |
| Step increment | ✅ | Native | `step` prop defines increment/decrement interval (default: 1); supports decimal steps (e.g., `step={0.1}`) for fine-grained control |
| Precision control | ✅ | Native | `precision` prop specifies number of decimal places for rounding; works independently of `step` value |
| Stepper controls | ✅ | Composed | `NumberInputStepper` container with `NumberIncrementStepper` and `NumberDecrementStepper` children; positioned on right side; can be omitted for stepper-less input |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard input | ✅ | Native | Direct number entry via keyboard; `inputMode` prop sets mobile keyboard type ("decimal", "numeric", "tel"); `pattern` prop for validation regex (default: `[0-9]*(.[0-9]+)?`) |
| Mouse wheel | ✅ | Native | `allowMouseWheel` prop enables scroll-to-change behavior when input is focused; disabled by default to prevent accidental changes |
| Stepper buttons | ✅ | Composed | Click increment/decrement buttons to change value by `step` amount; automatic repeat on hold (press and hold behavior); accessible via keyboard when focused |
| Keyboard shortcuts | ✅ | Native | Up/Down arrow keys increment/decrement when input focused; Home/End keys jump to min/max values; PageUp/PageDown for larger increments (10x step) |

## Code Examples
```jsx
// Basic usage
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'

<NumberInput defaultValue={15} min={0} max={100}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// With step and precision
<NumberInput precision={2} step={0.01} defaultValue={10.5}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// Currency formatting
<NumberInput
  format={(value) => `$${value}`}
  parse={(value) => value.replace(/^\$/, '')}
  defaultValue={50}
>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// Controlled component
import { useState } from 'react'

function ControlledExample() {
  const [value, setValue] = useState(10)

  return (
    <NumberInput
      value={value}
      onChange={(valueAsString, valueAsNumber) => setValue(valueAsNumber)}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

// Size variants
<NumberInput size="xs" defaultValue={5} />
<NumberInput size="sm" defaultValue={10} />
<NumberInput size="md" defaultValue={15} /> {/* default */}
<NumberInput size="lg" defaultValue={20} />

// Disabled state
<NumberInput isDisabled defaultValue={42}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// Read-only state
<NumberInput isReadOnly value={100}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// With validation (error state)
<NumberInput isInvalid value={150} max={100}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// Mouse wheel enabled
<NumberInput allowMouseWheel defaultValue={25}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

// Without steppers (input only)
<NumberInput defaultValue={50}>
  <NumberInputField />
</NumberInput>

// With custom character validation
<NumberInput
  isValidCharacter={(char) => /[0-9]/.test(char)}
  defaultValue={123}
>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>
```
[View Live](https://chakra-ui.com/docs/components/number-input) • [Storybook Examples](https://storybook.chakra-ui.com) • [v2 Docs](https://v2.chakra-ui.com/docs/components/number-input)

## Notable Features
- **Multipart component architecture**: Composed of 5 distinct parts (root, field, stepper container, increment button, decrement button) allowing granular styling and customization through theming system
- **Built on Ark UI foundation**: Latest version (v3) uses Ark UI's headless NumberInput primitive, providing robust accessibility and interaction patterns
- **Dual value callbacks**: `onChange` receives both `valueAsString` and `valueAsNumber` parameters, eliminating need for manual parsing
- **Intelligent clamping**: `clampValueOnBlur` automatically corrects out-of-range values to nearest boundary on blur or Enter key
- **Character validation**: `isValidCharacter` prop allows custom validation of each entered character in real-time
- **Locale-aware formatting**: `formatOptions` prop maps directly to `Intl.NumberFormatOptions`, supporting internationalization without custom code
- **Accessibility-first**: Built with proper ARIA attributes; `getAriaValueText` prop allows custom screen reader announcements
- **RTL support**: Full right-to-left language support with automatic layout mirroring
- **Keyboard power-user features**: Home/End for min/max, PageUp/PageDown for 10x step increments
- **Recipe-based theming**: Styling defined in `/theme/recipes/number-input.ts` for consistent customization across applications

## Research Notes
- Chakra UI maintains two parallel documentation sites: v2 (legacy) and v3 (current), both fully accessible
- v3 represents a significant architectural shift, moving to Ark UI primitives while maintaining API compatibility where possible
- The v2 documentation provides more detailed prop descriptions and examples in some cases
- Component supports all standard Input props through NumberInputField, enabling composition with other Chakra form components
- The framework's approach emphasizes composition: stepper controls are optional child components rather than always-present features
- Chakra's variant system (outline, filled, flushed, unstyled) applies to NumberInput, maintaining consistency with other form controls
- Integration with Field component provides automatic label association, helper text, and error message handling
- The component's source code is readily available on GitHub, and Storybook provides interactive exploration of all patterns

# PrimeReact - Number Input Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/inputnumber/
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides detailed information about all props, formatting modes, button layouts, keyboard interactions, and includes multiple practical code examples.

## Component Definition
- **Core purpose**: Provides numerical input with advanced formatting capabilities including currency, percentage, precision control, and optional stepper buttons for increment/decrement operations.
- **Mental model**: An enhanced numeric input field that combines text input with specialized number formatting, localization support, and visual spinner controls. Think of it as a specialized text input that understands numbers and their presentation formats.
- **Semantic meaning**: Represents a spinbutton control in the UI (ARIA role: spinbutton), communicating that users can input numeric values through typing or incrementing/decrementing with buttons or keyboard arrows.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={10}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value display | ✅ | Native | `value` and `onValueChange` props for controlled input |
| Formatting (currency, percent) | ✅ | Native | `mode="currency"` with `currency="USD"` prop, percentage via `prefix="%"` |
| Prefix/suffix support | ✅ | Native | `prefix` and `suffix` props for custom text before/after value |
| Custom formatting | ✅ | Native | Via `locale`, `currencyDisplay`, `useGrouping`, `minFractionDigits`, `maxFractionDigits` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Integer input | ✅ | Native | Default behavior, or with `maxFractionDigits={0}` |
| Decimal/float input | ✅ | Native | `mode="decimal"` (default) with `minFractionDigits` and `maxFractionDigits` |
| Currency input | ✅ | Native | `mode="currency"` with `currency="USD"` (ISO 4217 standard) |
| Percentage input | ✅ | Native | Using `prefix="%"` or `suffix="%"` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop prevents interaction and focus |
| Read-only | ❌ | CSS-only | Not explicitly documented, would require custom implementation |
| Loading | ❌ | CSS-only | Not built-in, would require custom spinner overlay |
| Error state | ✅ | Native | `invalid` prop for failed validation styling |
| Focus state | ✅ | Native | Automatic focus management with keyboard support |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size prop, would use CSS/style prop |
| Min/max values | ✅ | Native | `min` and `max` props for boundary constraints |
| Step increment | ✅ | Native | `step` prop controls increment/decrement amount |
| Precision control | ✅ | Native | `minFractionDigits` and `maxFractionDigits` for decimal places |
| Stepper controls | ✅ | Native | `showButtons` prop with `buttonLayout="stacked|horizontal|vertical"` |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard input | ✅ | Native | Standard text input with number validation |
| Mouse wheel | ❌ | CSS-only | Not documented, likely requires custom event handling |
| Stepper buttons | ✅ | Native | Increment/decrement buttons via `showButtons` prop |
| Keyboard shortcuts | ✅ | Native | Up/Down arrows for increment/decrement, Home/End for min/max, Tab for focus |

## Code Examples
```jsx
// Basic numeric input
<InputNumber value={value1} onValueChange={(e) => setValue1(e.value)} />

// Currency input with US locale
<InputNumber
  inputId="currency-us"
  value={value1}
  onValueChange={(e) => setValue1(e.value)}
  mode="currency"
  currency="USD"
  locale="en-US"
/>

// Currency with different locales
<InputNumber
  inputId="currency-germany"
  value={value2}
  onValueChange={(e) => setValue2(e.value)}
  mode="currency"
  currency="EUR"
  locale="de-DE"
/>

<InputNumber
  inputId="currency-japan"
  value={value4}
  onValueChange={(e) => setValue4(e.value)}
  mode="currency"
  currency="JPY"
  locale="jp-JP"
/>

// Percentage input
<InputNumber
  value={value2}
  onValueChange={(e) => setValue2(e.value)}
  prefix="%"
/>

// Prefix and suffix combinations
<InputNumber
  value={value1}
  onValueChange={(e) => setValue1(e.value)}
  suffix=" mi"
/>

<InputNumber
  value={value3}
  onValueChange={(e) => setValue3(e.value)}
  prefix="Expires in "
  suffix=" days"
/>

<InputNumber
  value={value4}
  onValueChange={(e) => setValue4(e.value)}
  prefix="&uarr; "
  suffix="℃"
  min={0}
  max={40}
/>

// Min/max boundaries
<InputNumber
  value={value4}
  onValueChange={(e) => setValue4(e.value)}
  min={0}
  max={100}
/>

// Precision control
<InputNumber
  value={value3}
  onValueChange={(e) => setValue3(e.value)}
  minFractionDigits={2}
  maxFractionDigits={5}
/>

// Horizontal button layout
<InputNumber
  value={value2}
  onValueChange={(e) => setValue2(e.value)}
  showButtons
  buttonLayout="horizontal"
  step={0.25}
  mode="currency"
  currency="EUR"
/>

// Vertical button layout
<InputNumber
  value={value}
  onValueChange={(e) => setValue(e.value)}
  showButtons
  buttonLayout="vertical"
  style={{ width: '4rem' }}
/>

// Disabled state
<InputNumber
  value={value}
  disabled
  prefix="%"
/>

// Invalid/error state
<InputNumber
  invalid
  value={value}
  onValueChange={(e) => setValue(e.value)}
  mode="decimal"
  minFractionDigits={2}
/>

// Locale-specific formatting
<InputNumber
  value={value1}
  onValueChange={(e) => setValue1(e.value)}
  minFractionDigits={2}
/>

<InputNumber
  value={value3}
  onValueChange={(e) => setValue3(e.value)}
  locale="de-DE"
  minFractionDigits={2}
/>

<InputNumber
  value={value4}
  onValueChange={(e) => setValue4(e.value)}
  locale="en-IN"
  minFractionDigits={2}
/>

// Filled variant
<InputNumber
  variant="filled"
  value={value}
  onValueChange={(e) => setValue(e.value)}
/>
```
[View Live Examples](https://primereact.org/inputnumber/)

## Notable Features
- **ISO 4217 Currency Support**: Full support for international currency codes (USD, EUR, JPY, etc.) with proper formatting based on currency type
- **Locale-Aware Formatting**: Automatically formats numbers according to user locale (thousand separators, decimal separators, digit grouping)
- **Flexible Button Layouts**: Three distinct button layouts (stacked, horizontal, vertical) for different UI requirements
- **Customizable Stepper Icons**: Ability to customize increment/decrement button icons via `incrementButtonIcon` and `decrementButtonIcon`
- **Button Style Customization**: Separate class names for styling increment and decrement buttons (`incrementButtonClassName`, `decrementButtonClassName`)
- **Comprehensive Keyboard Support**: Full keyboard accessibility with arrow keys, Home/End, and Tab navigation
- **ARIA Spinbutton Implementation**: Proper accessibility with spinbutton role and aria-valuemin/max/now attributes
- **Precision Constraints**: Fine-grained control over decimal places with min/max fraction digit settings
- **Decimal Mode**: Explicit decimal mode for non-currency numeric inputs
- **Grouping Control**: Optional thousand separator grouping via `useGrouping` prop

## Research Notes
- Documentation is well-organized with clear code examples for each feature
- No built-in size variants (small/medium/large) - sizing would be handled through CSS
- Read-only state not explicitly documented but could likely be achieved through custom implementation
- No built-in loading state pattern shown
- Mouse wheel interaction for incrementing/decrementing not documented
- Currency display mode can be configured as "symbol" or "code" via `currencyDisplay` prop
- The component appears focused on formatting and localization rather than visual variants
- Very strong internationalization support with locale-based formatting
- Button layouts provide good flexibility for different design requirements (compact stacked, inline horizontal, or side-by-side vertical)
- The prefix/suffix pattern is particularly powerful, supporting HTML entities (e.g., `&uarr;`, `℃`) and multi-word text

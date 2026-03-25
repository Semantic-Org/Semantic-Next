# HeroUI - Number Input Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/number-input
Status: ✅ Working
Version: v2.8.0 (formerly NextUI)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with detailed examples, API reference, validation patterns, and accessibility guidance.

## Component Definition
- **Core purpose**: Enable users to enter numeric values with stepper controls for increment/decrement operations, supporting various number formats (currency, percentage, units) with built-in validation.
- **Mental model**: A specialized text input that constrains input to valid numbers and provides visual controls for adjusting values up or down.
- **Semantic meaning**: Communicates a numeric data entry field with clear boundaries (min/max) and formatting context (currency, percentage, measurement units).

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={10}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value display | ✅ | Native | Value controlled via `value` and `defaultValue` props |
| Formatting (currency, percent) | ✅ | Native | `formatOptions` prop accepts `Intl.NumberFormatOptions` for currency, percent, unit formatting |
| Prefix/suffix support | ✅ | Composed | `startContent` and `endContent` props for custom prefix/suffix elements (e.g., currency symbols) |
| Custom formatting | ✅ | Native | Full `Intl.NumberFormatOptions` support including `signDisplay`, `minimumFractionDigits`, `maximumFractionDigits` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Integer input | ✅ | Native | Default behavior, controlled via `step` prop |
| Decimal/float input | ✅ | Native | Configured via `formatOptions.minimumFractionDigits` and `maximumFractionDigits` |
| Currency input | ✅ | Native | `formatOptions={{style: "currency", currency: "USD"}}` with multiple currency support (USD, EUR, ARS, etc.) |
| Percentage input | ✅ | Native | `formatOptions={{style: "percent"}}` |
| Unit-based input | ✅ | Native | `formatOptions={{style: "unit", unit: "inch", unitDisplay: "long"}}` for measurements |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `isDisabled` prop prevents all interaction |
| Read-only | ✅ | Native | `isReadOnly` prevents editing while displaying value |
| Loading | ❌ | N/A | No loading state documented |
| Error state | ✅ | Native | `isInvalid` prop paired with `errorMessage` for validation feedback |
| Focus state | ✅ | Native | `data-focus-visible` attribute for keyboard focus styling |
| Required state | ✅ | Native | `isRequired` prop adds visual indicator and validation requirement |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: `sm`, `md` (default), `lg` |
| Min/max values | ✅ | Native | `minValue` and `maxValue` props set numeric boundaries |
| Step increment | ✅ | Native | `step` prop controls increment/decrement amount (default: 1) |
| Precision control | ✅ | Native | `formatOptions.minimumFractionDigits` and `maximumFractionDigits` for decimal precision |
| Stepper controls | ✅ | Native | `hideStepper` prop to show/hide increment/decrement buttons |
| Color variants | ✅ | Native | `color` prop: `default`, `primary`, `secondary`, `success`, `warning`, `danger` |
| Visual variants | ✅ | Native | `variant` prop: `flat`, `bordered`, `underlined`, `faded` |
| Radius options | ✅ | Native | `radius` prop: `none`, `sm`, `md`, `lg`, `full` |
| Label placement | ✅ | Native | `labelPlacement`: `inside`, `outside`, `outside-left` |
| Full width | ✅ | Native | `fullWidth` prop (default: true) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard input | ✅ | Native | Direct numeric entry via keyboard |
| Mouse wheel | ✅ | Native | Scroll to adjust value, can be disabled via `isWheelDisabled` |
| Stepper buttons | ✅ | Native | Visual +/- buttons for increment/decrement operations |
| Keyboard shortcuts | ✅ | Native | Arrow up/down keys for increment/decrement |
| Clear button | ✅ | Native | `isClearable` prop adds clear button with `onClear` callback |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom validation | ✅ | Native | `validate` function prop for custom validation logic |
| Real-time validation | ✅ | Native | Works with controlled `value` state |
| Server validation | ✅ | Composed | Via HeroUI `Form` component with `validationErrors` |
| Error messages | ✅ | Native | `errorMessage` prop supports both static text and dynamic rendering |

## Code Examples
```jsx
// Basic usage
<NumberInput
  className="max-w-xs"
  placeholder="Enter the amount"
/>
```

```jsx
// Currency input with prefix
<NumberInput
  label="Price"
  placeholder="0.00"
  startContent={<span className="text-default-400">$</span>}
  formatOptions={{style: "currency", currency: "USD"}}
/>
```

```jsx
// With min/max validation
<NumberInput
  label="Amount"
  placeholder="100-1000"
  minValue={100}
  maxValue={1000}
  isRequired
  errorMessage="Value must be between 100 and 1000"
/>
```

```jsx
// Custom validation function
<NumberInput
  label="Quantity"
  validate={(value) => {
    if (value < 100) return "Must be >= 100";
    if (value > 1000) return "Must be <= 1000";
    return null;
  }}
/>
```

```jsx
// Controlled component
const [value, setValue] = React.useState();
<NumberInput
  value={value}
  onValueChange={setValue}
/>
```

```jsx
// Percentage input
<NumberInput
  label="Percentage"
  placeholder="0.00"
  formatOptions={{style: "percent"}}
/>
```

```jsx
// Unit-based input
<NumberInput
  label="Length"
  placeholder="0.00"
  formatOptions={{
    style: "unit",
    unit: "inch",
    unitDisplay: "long"
  }}
/>
```

```jsx
// With currency selector suffix
<NumberInput
  label="Price"
  placeholder="0.00"
  formatOptions={{style: "currency", currency: selectedCurrency}}
  endContent={
    <select onChange={handleCurrencyChange}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="ARS">ARS</option>
    </select>
  }
/>
```

[View Documentation](https://www.heroui.com/docs/components/number-input)

## Notable Features
- **React Aria Foundation**: Built on top of React Aria's `useNumberField` hook providing robust accessibility and internationalization
- **Intl.NumberFormat Integration**: Full support for `Intl.NumberFormatOptions` enabling localized number formatting across 100+ locales
- **10+ CSS Slots**: Granular styling control via slots including `base`, `label`, `input`, `inputWrapper`, `clearButton`, `stepperButton`, `stepperWrapper`, and more
- **Form Integration**: First-class integration with HeroUI Form component for validation state management
- **Data Attributes**: State-based styling via data attributes (`data-invalid`, `data-disabled`, `data-focus`, `data-hover`, `data-filled`)
- **Dual Event Handlers**: Both `onChange` (native) and `onValueChange` (numeric) callbacks for flexibility with form libraries
- **Wheel Control**: Mouse wheel input with opt-out via `isWheelDisabled`
- **Clear Functionality**: Built-in clear button with `isClearable` prop and `onClear` callback
- **Accessibility**: Native `<input type="number">` foundation with full ARIA support and keyboard navigation

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| HeroUI Form | ✅ | Native | Validation state management via Form component |
| Formik | ✅ | Compatible | Works with standard form library patterns |
| React Hook Form | ✅ | Compatible | Compatible via standard onChange patterns |

## Research Notes
- HeroUI is the rebranded version of NextUI (v2.8.0 as of verification)
- Documentation is extremely comprehensive with multiple validation examples
- Strong focus on accessibility and internationalization
- Provides both controlled and uncontrolled component patterns
- Extensive theming support via CSS variables and Tailwind classes
- Built on React Aria providing battle-tested accessibility patterns
- Package: `@heroui/number-input` (modular package architecture)

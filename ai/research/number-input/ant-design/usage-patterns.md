# Ant Design - Number Input Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/input-number
Status: ✅ Working
Version: 5.x (Current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Ant Design provides detailed documentation with extensive examples, API reference, TypeScript definitions, and interactive demos.

## Component Definition
- **Core purpose**: Enable users to input numeric values with built-in validation, formatting, and stepper controls, ensuring values stay within defined constraints and follow specified increments.
- **Mental model**: A specialized text input that only accepts numbers, with optional increment/decrement buttons (steppers) and built-in min/max validation. Users can type values directly or use controls to adjust values by defined steps.
- **Semantic meaning**: Communicates a numeric-only input field with optional boundaries and formatting rules, typically used for quantities, measurements, prices, or any scenario requiring numeric input with constraints.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `min={0}`, `max={100}`, `step={1}`)
- **Composed**: Via composition/children (e.g., `addonBefore`, `addonAfter`)
- **CSS-only**: Requires custom styling (e.g., custom variants beyond built-in options)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value display | ✅ | Native | Value displayed directly in input field with optional formatting |
| Formatting (currency, percent) | ✅ | Native | `formatter` prop accepts function to format display value |
| Prefix/suffix support | ✅ | Native | `prefix` and `suffix` props for icons/text inside input; `addonBefore` and `addonAfter` for content outside input box |
| Custom formatting | ✅ | Native | `formatter` and `parser` props work together to customize display and parse user input |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Integer input | ✅ | Native | Set `precision={0}` or use `step={1}` without decimal precision |
| Decimal/float input | ✅ | Native | `precision` prop controls decimal places; `stringMode` for high-precision decimals |
| Currency input | ✅ | Native | Use `formatter` to add currency symbols and thousand separators, `parser` to extract numeric value |
| Percentage input | ✅ | Native | Use `formatter` to append % symbol, `parser` to extract numeric value |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled={true}` prop prevents interaction |
| Read-only | ✅ | Native | `readOnly={true}` prop allows viewing but prevents editing |
| Loading | ❌ | CSS-only | No built-in loading state, must implement with custom styling |
| Error state | ✅ | Native | `status="error"` prop displays error styling |
| Focus state | ✅ | Native | Automatic focus state handling with customizable styles |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: "large", "middle" (default), "small" |
| Min/max values | ✅ | Native | `min` and `max` props define valid range |
| Step increment | ✅ | Native | `step` prop defines increment/decrement value; keyboard modifiers (Ctrl/Cmd) multiply by 0.1, Shift multiplies by 10 |
| Precision control | ✅ | Native | `precision` prop sets decimal places; `stringMode` for arbitrary precision using strings |
| Stepper controls | ✅ | Native | `controls` prop: boolean to show/hide, or object `{ upIcon, downIcon }` to customize icons |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard input | ✅ | Native | Direct numeric keyboard input with validation |
| Mouse wheel | ✅ | Native | `changeOnWheel` prop (default true) allows scrolling to change value; Shift key modifier for 10x step |
| Stepper buttons | ✅ | Native | Click up/down arrows to increment/decrement by step value |
| Keyboard shortcuts | ✅ | Native | Up/Down arrows adjust value by step; Ctrl/Cmd + Up/Down for 0.1x step; Shift + scroll for 10x step |

## Code Examples
```jsx
// Basic usage
import { InputNumber } from 'antd';

function BasicExample() {
  return (
    <InputNumber min={1} max={10} defaultValue={3} />
  );
}

// Currency formatting
function CurrencyExample() {
  return (
    <InputNumber
      defaultValue={1000}
      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
    />
  );
}

// Percentage formatting
function PercentExample() {
  return (
    <InputNumber
      min={0}
      max={100}
      defaultValue={100}
      formatter={(value) => `${value}%`}
      parser={(value) => value.replace('%', '')}
    />
  );
}

// With prefix/suffix
function PrefixSuffixExample() {
  return (
    <InputNumber
      prefix="$"
      suffix="USD"
      defaultValue={100}
    />
  );
}

// With addon before/after
function AddonExample() {
  return (
    <InputNumber
      addonBefore="+"
      addonAfter="$"
      defaultValue={100}
    />
  );
}

// Disabled and read-only states
function StateExample() {
  return (
    <>
      <InputNumber disabled defaultValue={100} />
      <InputNumber readOnly defaultValue={100} />
    </>
  );
}

// Different sizes
function SizeExample() {
  return (
    <>
      <InputNumber size="large" defaultValue={100} />
      <InputNumber size="middle" defaultValue={100} />
      <InputNumber size="small" defaultValue={100} />
    </>
  );
}

// Custom step and precision
function StepPrecisionExample() {
  return (
    <InputNumber
      min={0}
      max={10}
      step={0.1}
      precision={2}
      defaultValue={3.14}
    />
  );
}

// High precision with stringMode
function HighPrecisionExample() {
  return (
    <InputNumber
      stringMode
      min="0"
      max="999999999999999999999999999999"
      step="0.00000000001"
      defaultValue="0.000000000001"
    />
  );
}

// Custom stepper icons
function CustomControlsExample() {
  return (
    <InputNumber
      controls={{
        upIcon: <PlusOutlined />,
        downIcon: <MinusOutlined />
      }}
      defaultValue={100}
    />
  );
}

// Status variants
function StatusExample() {
  return (
    <>
      <InputNumber status="error" defaultValue={100} />
      <InputNumber status="warning" defaultValue={100} />
    </>
  );
}

// Visual variants
function VariantExample() {
  return (
    <>
      <InputNumber variant="outlined" defaultValue={100} />
      <InputNumber variant="filled" defaultValue={100} />
      <InputNumber variant="borderless" defaultValue={100} />
    </>
  );
}

// Controlled component
function ControlledExample() {
  const [value, setValue] = useState(0);

  return (
    <InputNumber
      value={value}
      onChange={setValue}
    />
  );
}

// Change event handling
function EventExample() {
  const handleChange = (value) => {
    console.log('Changed:', value);
  };

  return (
    <InputNumber
      onChange={handleChange}
      defaultValue={3}
    />
  );
}
```
[View Live Examples](https://ant.design/components/input-number/#components-input-number-demo-basic)

## Notable Features
- **stringMode**: Enables arbitrary precision by working with string values instead of numbers, essential for financial calculations or very large/small numbers
- **Keyboard modifiers**: Intelligent keyboard shortcuts where Ctrl/Cmd decreases step to 0.1x and Shift increases to 10x when using arrow keys or mouse wheel
- **Integrated formatting**: Built-in formatter/parser pattern allows seamless display formatting while maintaining numeric values internally
- **Visual variants**: Four distinct style variants (outlined, filled, borderless) for different UI contexts
- **Addon composition**: Both prefix/suffix (inside input) and addonBefore/addonAfter (outside input) for maximum flexibility
- **RTL support**: Built-in right-to-left language support
- **TypeScript generics**: Component accepts generic type parameter for type-safe value handling

## API Reference

### InputNumber Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | - | Current value (controlled mode) |
| `defaultValue` | `number \| string` | - | Initial value (uncontrolled mode) |
| `min` | `number \| string` | `-Infinity` | Minimum value |
| `max` | `number \| string` | `Infinity` | Maximum value |
| `step` | `number \| string` | `1` | Increment/decrement step |
| `precision` | `number` | - | Decimal precision (number of decimal places) |
| `stringMode` | `boolean` | `false` | Enable high-precision decimal support using strings |
| `formatter` | `(value: number \| string) => string` | - | Format display value |
| `parser` | `(value: string) => number \| string` | - | Parse input back to number |
| `disabled` | `boolean` | `false` | Disable the input |
| `readOnly` | `boolean` | `false` | Make input read-only |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Input size |
| `status` | `'error' \| 'warning'` | - | Validation status |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Visual variant |
| `prefix` | `ReactNode` | - | Prefix content inside input |
| `suffix` | `ReactNode` | - | Suffix content inside input |
| `addonBefore` | `ReactNode` | - | Content before input box |
| `addonAfter` | `ReactNode` | - | Content after input box |
| `controls` | `boolean \| { upIcon?: ReactNode; downIcon?: ReactNode }` | `true` | Show/hide or customize stepper controls |
| `keyboard` | `boolean` | `true` | Enable keyboard input |
| `changeOnWheel` | `boolean` | `true` | Allow mouse wheel to change value |
| `onChange` | `(value: number \| string \| null) => void` | - | Callback when value changes |
| `onStep` | `(value: number, info: { offset: number; type: 'up' \| 'down' }) => void` | - | Callback when using step buttons |
| `onPressEnter` | `(e: React.KeyboardEvent) => void` | - | Callback when Enter key pressed |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `bordered` | `boolean` | `true` | ⚠️ Deprecated: use `variant` instead |

## Research Notes
- The Ant Design website uses client-side rendering, making it challenging to scrape content directly. Documentation was gathered through web search and GitHub source code analysis.
- Ant Design's InputNumber is built on top of `rc-input-number` (React Component library), which provides the core functionality.
- The component provides excellent TypeScript support with generic type parameters for value typing.
- The `stringMode` feature is particularly notable for handling JavaScript's numeric precision limitations in financial or scientific applications.
- Version 5.x introduced the `variant` prop to replace the deprecated `bordered` prop, providing more styling flexibility.
- The keyboard modifier system (Ctrl/Cmd for 0.1x, Shift for 10x) provides power users with efficient value adjustment capabilities.
- Ant Design follows a consistent API pattern across input components, making it intuitive for developers familiar with other Ant Design components.

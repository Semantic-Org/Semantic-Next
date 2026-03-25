# Component Pattern Research: Number Input

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 6 (Chakra UI, Ant Design, Nuxt UI, Mantine, HeroUI, PrimeReact)
- Date: 2025-11-05
- Unique patterns identified: 25+ distinct patterns across content, type, state, variation, and interactive categories

## Component Definition Consensus

Number Input is a specialized form control that enables users to enter numeric values with validation, formatting, and stepper controls for increment/decrement operations. Frameworks consistently conceptualize this as:

- **Core purpose**: Capture numeric input with built-in validation, boundary enforcement (min/max), and formatting capabilities
- **Mental model**: An enhanced text input field that constrains input to valid numbers, with optional visual stepper controls (+/- buttons) for adjusting values incrementally
- **Semantic meaning**: A form control specifically for numeric data entry that communicates precision requirements, boundaries, and formatting context (currency, percentages, measurements)

All frameworks implement this as a composable or integrated component with native support for stepper controls, though the architectural approach varies (composition-based vs prop-based).

## Terminology Variations

### Component Names
- **InputNumber** (3 frameworks): Ant Design, PrimeReact, Nuxt UI
- **NumberInput** (3 frameworks): Chakra UI, Mantine, HeroUI

### Prop Naming Patterns
- **Value boundaries**: `min`/`max` (5 frameworks) vs `minValue`/`maxValue` (HeroUI)
- **Disabled state**: `disabled` (3) vs `isDisabled` (3)
- **Error state**: `invalid` (2) vs `isInvalid` (2) vs `status="error"` (1) vs Field integration (1)
- **Read-only**: `readOnly` (3) vs `isReadOnly` (2)
- **Stepper visibility**: `hideControls` (1) vs `showButtons` (1) vs `controls` (1) vs composition-based (3)
- **Formatting**: `formatter`/`parser` (2) vs `format`/`parse` (1) vs `formatOptions` (3)

### Value Event Handlers
- **onChange** (5 frameworks) - most common
- **onValueChange** (2 frameworks) - PrimeReact, HeroUI
- Dual callbacks (1 framework) - Chakra provides both `valueAsString` and `valueAsNumber`

## Pattern Inventory

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Numeric value display | Display current numeric value in input field | 6/6 (100%) | Level 1 | All |
| Currency formatting | Format as currency with symbols and thousand separators | 6/6 (100%) | Level 1 | All via native formatting |
| Percentage formatting | Display values as percentages | 6/6 (100%) | Level 1 | All via native formatting |
| Prefix/suffix support | Add text before/after value (e.g., "$", "USD", "%") | 5/6 (83%) | Level 2 | All except Nuxt UI |
| Custom formatting | User-defined formatting logic via functions or options | 6/6 (100%) | Level 1 | All |
| Locale-aware formatting | Automatic formatting based on user locale | 6/6 (100%) | Level 1 | All via Intl.NumberFormat |

### Type Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Integer input | Whole number input without decimals | 6/6 (100%) | Level 1 | All (default behavior) |
| Decimal/float input | Support for decimal values | 6/6 (100%) | Level 1 | All |
| Currency input | Specialized currency formatting | 6/6 (100%) | Level 1 | All |
| Percentage input | Percentage value formatting | 6/6 (100%) | Level 1 | All |
| Unit-based input | Measurements with units (e.g., "5 inches") | 1/6 (17%) | Level 5 | HeroUI only |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Disabled | Prevent all interaction | 6/6 (100%) | Level 1 | All |
| Read-only | Allow viewing but prevent editing | 4/6 (67%) | Level 3 | Chakra, Ant, Mantine, HeroUI |
| Error/Invalid | Display validation error state | 6/6 (100%) | Level 1 | All |
| Focus | Visual feedback when input is focused | 6/6 (100%) | Level 1 | All |
| Loading | Show loading indicator during async operations | 1/6 (17%) | Level 5 | Mantine only (others composition) |
| Required | Indicate field is required | 1/6 (17%) | Level 5 | HeroUI only |

### Variation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size options | Multiple size variants (xs, sm, md, lg, xl) | 5/6 (83%) | Level 2 | All except PrimeReact |
| Min/max values | Boundary constraints for valid values | 6/6 (100%) | Level 1 | All |
| Step increment | Control increment/decrement amount | 6/6 (100%) | Level 1 | All |
| Precision control | Decimal place control | 6/6 (100%) | Level 1 | All |
| Stepper controls | Increment/decrement buttons | 6/6 (100%) | Level 1 | All (show/hide options) |
| Visual variants | Different visual styles (outline, filled, etc.) | 3/6 (50%) | Level 3 | Ant, Nuxt, HeroUI |
| Color variants | Color theming options | 1/6 (17%) | Level 5 | HeroUI only |
| Button layouts | Different stepper button arrangements | 2/6 (33%) | Level 4 | PrimeReact (3 layouts), Nuxt (2 orientations) |

### Interactive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Keyboard input | Direct numeric entry via keyboard | 6/6 (100%) | Level 1 | All |
| Stepper buttons | Click to increment/decrement | 6/6 (100%) | Level 1 | All |
| Keyboard shortcuts | Arrow keys for increment/decrement | 6/6 (100%) | Level 1 | All |
| Mouse wheel scrolling | Scroll to change value | 3/6 (50%) | Level 3 | Chakra, Ant, HeroUI (+ Mantine unknown) |
| Hold-to-repeat | Press and hold stepper for continuous change | 2/6 (33%) | Level 4 | Chakra, Mantine |
| Keyboard modifiers | Ctrl/Shift for modified step amounts | 1/6 (17%) | Level 5 | Ant Design only |
| Clear button | Button to clear current value | 1/6 (17%) | Level 5 | HeroUI only |
| Home/End keys | Jump to min/max values | 2/6 (33%) | Level 4 | Chakra, PrimeReact |

### Advanced Formatting Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Intl.NumberFormat support | Native internationalization API | 6/6 (100%) | Level 1 | All frameworks |
| Thousand separators | Comma/period grouping | 6/6 (100%) | Level 1 | All |
| Custom decimal separators | User-defined decimal point character | 2/6 (33%) | Level 4 | Mantine, PrimeReact |
| Thousand grouping styles | Indian (lakh), Chinese (wan), etc. | 1/6 (17%) | Level 5 | Mantine only |
| Sign display control | Control + sign visibility | 1/6 (17%) | Level 5 | HeroUI only |

### Validation & Clamping Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Clamp on blur | Auto-correct to boundaries when focus lost | 2/6 (33%) | Level 4 | Chakra, Mantine |
| Strict clamping | Prevent input outside boundaries | 2/6 (33%) | Level 4 | Ant Design, Mantine |
| Custom validation | User-defined validation functions | 1/6 (17%) | Level 5 | HeroUI only |
| Real-time validation | Validate as user types | 1/6 (17%) | Level 5 | HeroUI only |

## Notable Patterns

### Highly Adopted (Level 1-2)
These patterns have achieved near-universal adoption and represent the core feature set:

- **Core numeric input**: All frameworks provide value display, keyboard input, and basic validation
- **Stepper controls**: Universal support for increment/decrement buttons (100%)
- **Boundary constraints**: Min/max value enforcement is standard across all frameworks (100%)
- **Step increments**: Control over increment amount is universally supported (100%)
- **Precision control**: Decimal place management is a first-class feature everywhere (100%)
- **Formatting trinity**: Currency, percentage, and custom formatting are universal (100%)
- **State management**: Disabled, error, and focus states are consistently supported (100%)
- **Keyboard accessibility**: Arrow key shortcuts are universally implemented (100%)
- **Size variants**: 83% of frameworks provide multiple size options

### Emerging Patterns (Level 3-4)
Patterns with moderate adoption indicating evolving best practices:

- **Read-only state**: 67% support indicates this is becoming standard
- **Mouse wheel interaction**: 50% explicit support (may be higher but undocumented)
- **Visual variants**: 50% provide multiple visual styles (outline, filled, etc.)
- **Button layouts**: 33% offer alternative stepper button arrangements
- **Hold-to-repeat**: 33% implement continuous increment on button hold
- **Clamp behaviors**: 33% provide configurable clamping strategies
- **Custom decimal separators**: 33% allow customization beyond locale defaults
- **Advanced keyboard shortcuts**: 33% implement Home/End or modifier keys

### Unique Innovations (Level 5)
Framework-specific innovations that may indicate future trends:

- **Ant Design keyboard modifiers**: Ctrl/Cmd for 0.1x step, Shift for 10x step - power-user feature
- **Ant Design stringMode**: High-precision decimal handling via strings for financial apps
- **Mantine thousand grouping styles**: Support for Indian lakh and Chinese wan numbering
- **Mantine proportional acceleration**: Configurable function for smooth hold-to-increment behavior
- **Mantine programmatic control**: Exposed increment/decrement methods via ref
- **HeroUI unit-based input**: First-class support for measurement units (inches, meters, etc.)
- **HeroUI validation patterns**: Built-in custom, real-time, and server validation
- **HeroUI clear button**: Native clear functionality with callback
- **HeroUI extensive theming**: 10+ CSS slots for granular styling control
- **PrimeReact button layouts**: Three distinct layouts (stacked, horizontal, vertical)

## Pattern Correlations

### When currency/percentage formatting exists:
- Prefix/suffix support present in 5/6 cases (83%)
- Custom formatting always present (100%)
- Locale-aware formatting always present (100%)

### When stepper controls exist:
- Step increment control always present (100%)
- Keyboard shortcuts always present (100%)
- Min/max boundaries always present (100%)

### When size variants exist:
- Visual variants present in 3/5 cases (60%)
- Multiple sizes correlate with more comprehensive component systems

### Framework Architecture Patterns:
- **Composition-based** (Chakra): Stepper as optional child components
- **Prop-based** (Ant, Mantine, PrimeReact): Boolean or config object props
- **Hybrid** (Nuxt, HeroUI): Props with slot-based customization

## Implementation Notes

### Common Technical Approaches:

1. **Formatting Architecture**:
   - **Function-based**: Chakra, Ant Design use `format`/`parse` or `formatter`/`parser` functions
   - **Options-based**: Nuxt UI, HeroUI, PrimeReact use `formatOptions` with Intl.NumberFormat
   - **Hybrid**: Mantine combines prefix/suffix props with react-number-format options

2. **Underlying Libraries**:
   - **Chakra UI**: Built on Ark UI primitives (v3)
   - **Nuxt UI**: Built on Reka UI's NumberField
   - **Mantine**: Built on react-number-format
   - **HeroUI**: Built on React Aria's useNumberField
   - **Ant Design**: Built on rc-input-number
   - **PrimeReact**: Custom implementation

3. **Accessibility Foundations**:
   - All frameworks implement proper ARIA spinbutton role
   - Most leverage established accessibility libraries (React Aria, Ark UI, Reka UI)
   - Native HTML `input[type="number"]` used as foundation by some

4. **Value Type Handling**:
   - Most return numeric types from onChange/onValueChange
   - String mode support for high precision (Ant Design, Mantine)
   - Edge cases (empty, NaN) typically return `null` or empty string

### Naming Convention Patterns:
- **Boolean props**: Most use `is` prefix (isDisabled, isInvalid, isReadOnly)
- **Event handlers**: Consistent `on` prefix (onChange, onValueChange, onBlur)
- **Stepper terminology**: "increment/decrement" (4) vs "up/down" (1) vs generic "controls" (1)

### Internationalization Support:
All frameworks support locale-aware formatting, but approaches vary:
- **Intl.NumberFormat integration**: All 6 frameworks
- **Locale prop**: 5/6 explicit (all except Chakra which may use system locale)
- **Currency codes**: ISO 4217 support in all currency-enabled frameworks
- **RTL support**: Explicitly mentioned in 2 frameworks (Chakra, Ant)

## Architectural Insights

### Component Composition Models:

1. **Multipart Architecture** (Chakra UI):
   - 5 distinct parts: root, field, stepper container, increment, decrement
   - Allows granular control and styling of each element
   - Stepper is optional via composition pattern

2. **Monolithic with Props** (Ant Design, Mantine, PrimeReact):
   - Single component with comprehensive prop API
   - Stepper controlled via props (show/hide, customize icons)
   - Simpler API but less compositional flexibility

3. **Hybrid Slot-Based** (Nuxt UI, HeroUI):
   - Single component with slot overrides
   - Props for common cases, slots for advanced customization
   - Balances simplicity with flexibility

### Validation Strategies:

1. **Native HTML validation**: Most frameworks leverage browser validation
2. **Custom validation functions**: HeroUI provides `validate` prop
3. **Form integration**: Most integrate with form libraries (React Hook Form, Formik)
4. **Inline error display**: Error messages via companion Field/FormField components

### Performance Considerations:

- **Hold-to-repeat optimization**: Configurable intervals to prevent excessive updates
- **Debouncing**: Not explicitly documented but likely used for onChange callbacks
- **Value parsing**: Most frameworks optimize parsing to avoid unnecessary re-renders

## Framework-Specific Strengths

### Chakra UI
- **Strength**: Composition architecture with multipart theming
- **Unique**: Ark UI foundation, dual value callbacks (string + number)
- **Best for**: Design systems requiring deep customization

### Ant Design
- **Strength**: Power-user keyboard features and stringMode precision
- **Unique**: Keyboard modifiers (0.1x, 10x), addon before/after composition
- **Best for**: Data-heavy applications with power users

### Nuxt UI
- **Strength**: First-class internationalization via @internationalized/number
- **Unique**: Dual orientation support (horizontal/vertical)
- **Best for**: International applications with Vue/Nuxt stack

### Mantine
- **Strength**: Most comprehensive formatting options
- **Unique**: International grouping styles (lakh, wan), proportional acceleration
- **Best for**: Applications requiring advanced numeric formatting

### HeroUI
- **Strength**: Extensive validation and theming system
- **Unique**: Unit-based inputs, 10+ CSS slots, clear button
- **Best for**: Applications requiring complex validation and extensive theming

### PrimeReact
- **Strength**: Flexible stepper layouts and locale support
- **Unique**: Three button layouts (stacked, horizontal, vertical)
- **Best for**: Enterprise applications with diverse layout requirements

## Sophisticated Design Patterns

### Chakra UI - Real-Time Character Validation

**What it does**: The `isValidCharacter` prop validates each keystroke before it's committed to the input, preventing invalid characters from ever appearing in the field. Example: `isValidCharacter={(char) => /[0-9.-]/.test(char)}` allows numeric, decimal point, and minus characters while blocking letters and symbols in real-time.

**Why it's sophisticated**: Most form controls perform validation after the fact (on blur or submit). Number Input is unique because it must validate during typing since only a specific character set is valid. This prevents user frustration of typed characters being rejected or stripped out, creating a seamless experience where the input field only ever contains valid characters.

**Evidence of design maturity**:
- Validates at the character level rather than the full value, enabling fine-grained control over what can be typed
- Prevents invalid state from ever being visible to users, eliminating the need for post-typing error messages for character validation
- Works seamlessly with localization needs where different locales use different decimal separators and grouping characters

### Mantine - Proportional Hold Acceleration

**What it does**: The `stepHoldInterval` prop accepts a function (not just a fixed number) that calculates acceleration based on hold duration. Example: `stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}` creates exponential acceleration where holding the stepper button causes rapid increments that accelerate smoothly over time.

**Why it's sophisticated**: The naive approach is a fixed interval, but this creates poor UX: either increment is too slow (many clicks needed) or too fast (hard to land on target value). A proportional function solves the classic "press and hold" problem elegantly—users get responsive initial feedback (slow at first) that naturally accelerates, matching human expectation of physical controls. This is specific to stepper interaction patterns.

**Evidence of design maturity**:
- Recognizes that hold-to-repeat needs variable speed based on hold duration, not constant speed
- Provides bounds checking (`Math.max(..., 25)`) to prevent overwhelming update rates that would break the UI
- Allows developers to define acceleration curves that match their specific domain (financial, measurements, etc.)

### Ant Design - Keyboard Modifier Step Multipliers

**What it does**: Intelligent modifier keys multiply the step amount during both arrow key and mouse wheel input: Ctrl/Cmd decreases to 0.1x step, and Shift increases to 10x step. When `step={1}`, holding Ctrl gives 0.1 increments while Shift gives 10 increments, allowing users to switch between fine and coarse adjustments without lifting their hands.

**Why it's sophisticated**: Number Input is unique among form controls in requiring both fine-grained (decimal precision) and coarse-grained (large range) adjustments. Modifier keys solve this elegantly without cluttering the UI with additional buttons or controls. This pattern recognizes that power users need speed while casual users need precision, and keyboard modifiers provide context-dependent behavior that experts expect from numeric tools.

**Evidence of design maturity**:
- Uses established keyboard conventions (Ctrl for fine-tuning, Shift for magnification) familiar to users of professional tools like spreadsheets, DAWs, and video editors
- Works consistently across both keyboard arrows and mouse wheel, providing redundant pathways to the same functionality
- Avoids exposing three separate step values (fine, normal, coarse); instead derives them mathematically from a single step value

## Recommendations for Implementation

Based on pattern prevalence, a robust Number Input implementation should include:

### Essential Features (Level 1-2, >70% adoption):
1. Numeric value display with controlled/uncontrolled modes
2. Min/max boundary constraints with validation
3. Step increment control
4. Decimal precision control
5. Currency and percentage formatting
6. Prefix/suffix support
7. Stepper buttons (show/hide option)
8. Keyboard shortcuts (arrows, at minimum)
9. Disabled and error states
10. Multiple size variants
11. Focus state management
12. Locale-aware formatting via Intl.NumberFormat

### Recommended Features (Level 3-4, 30-70% adoption):
1. Read-only state
2. Mouse wheel support (with opt-out)
3. Visual variants (outline, filled, etc.)
4. Hold-to-repeat on stepper buttons
5. Clamp behavior options (blur, strict, none)
6. Custom decimal separators
7. Advanced keyboard shortcuts (Home/End)

### Optional Innovations (Level 5, <30% adoption):
1. Keyboard modifiers for step multiplication
2. High-precision string mode
3. Unit-based input support
4. Custom validation functions
5. Clear button functionality
6. Programmatic increment/decrement via ref
7. Alternative button layouts
8. Proportional acceleration

## Testing Considerations

Based on observed patterns, comprehensive testing should cover:

1. **Boundary validation**: Min/max enforcement and edge cases
2. **Keyboard interaction**: Arrow keys, Enter, Tab, Home/End
3. **Stepper functionality**: Click and hold-to-repeat behaviors
4. **Formatting**: Currency, percentage, custom formats across locales
5. **Precision**: Decimal rounding and display
6. **State management**: Disabled, read-only, error states
7. **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
8. **Internationalization**: Multiple locales, RTL support, number formats

## Raw Data

Individual framework reports available at:
- `/ai/research/number-input/chakra-ui/usage-patterns.md`
- `/ai/research/number-input/ant-design/usage-patterns.md`
- `/ai/research/number-input/nuxt-ui/usage-patterns.md`
- `/ai/research/number-input/mantine/usage-patterns.md`
- `/ai/research/number-input/heroui/usage-patterns.md`
- `/ai/research/number-input/primereact/usage-patterns.md`

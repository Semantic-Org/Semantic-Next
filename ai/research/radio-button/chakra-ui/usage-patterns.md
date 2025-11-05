# Chakra UI - Radio Usage Patterns

## Component URL
https://v2.chakra-ui.com/docs/components/radio
Status: ✅ Working (v2 docs) | ⚠️ v3 site accessible but less detailed

**Note**: The v2 documentation provides comprehensive examples and API details. The v3 site (chakra-ui.com) is accessible but references Ark UI foundation and Storybook examples rather than inline documentation.

## Documentation Quality
**Excellent** - Comprehensive documentation with clear examples, complete props reference, theming guide, custom radio button patterns using hooks, and accessibility information. Well-structured with practical examples ranging from basic to advanced usage.

## Component Definition
- **Core purpose**: Enables users to select a single option from a series of mutually exclusive choices
- **Mental model**: A form control for exclusive selection patterns where only one option can be selected at a time, typically grouped using RadioGroup for coordinated state management
- **Semantic meaning**: Represents a single choice within a set of options for surveys, preferences, configurations, or any scenario requiring mutually exclusive selection

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text labels | ✅ | Primary pattern - text rendered as children of Radio component with `spacing` prop for label-to-control gap (default: "0.5rem") |
| Icon support | ⚠️ | Not explicitly documented, but can be included in children alongside or instead of text |
| Custom content | ✅ | Children can contain any React nodes, enabling complex label compositions |
| Empty/unlabeled | ✅ | Radio can be used without children, though accessibility requires proper labeling via aria-label or aria-labelledby |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single radio | ✅ | Individual Radio component with `isChecked` and `onChange` for standalone usage |
| Radio group | ✅ | RadioGroup component manages state across multiple Radio children with coordinated selection |
| Custom radio buttons | ✅ | `useRadio` and `useRadioGroup` hooks enable fully custom styled radio alternatives (e.g., card-style buttons) |
| Button-style radios | ✅ | Demonstrated via custom radio pattern with box styling that mimics button appearance |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Checked | ✅ | Controlled via `isChecked` or `value` (in RadioGroup context) with visual indicator |
| Unchecked | ✅ | Default state, visually distinct from checked state |
| Disabled | ✅ | `isDisabled` prop on Radio or RadioGroup (cascades to all children), prevents interaction, reduced opacity |
| Invalid/Error | ✅ | `isInvalid` prop sets visual error state and `aria-invalid` attribute |
| Required | ✅ | `isRequired` prop sets `aria-required` for accessibility |
| Read-only | ✅ | `isReadOnly` prop prevents changes while maintaining visual appearance |
| Focusable when disabled | ✅ | `isFocusable` prop maintains keyboard focus capability even when disabled |
| Default checked | ✅ | `defaultChecked` for uncontrolled Radio, `defaultValue` for RadioGroup |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Three sizes: `sm`, `md` (default), `lg` - affects both control and label sizing |
| Color schemes | ✅ | `colorScheme` prop supports any theme color (examples: blue [default], red, green, orange, teal) |
| Orientation | ✅ | Achieved via Stack component: `direction='row'` (horizontal) or vertical (default) |
| Spacing control | ✅ | `spacing` prop on RadioGroup passed to Stack wrapper, controls gap between radio options |
| Custom styling | ✅ | Full theming system with anatomy parts (control, label, container), custom sizes/variants via theme config |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| onChange handler | ✅ | Radio: `onChange(event)` fires on state change; RadioGroup: `onChange(value)` fires with selected value |
| Controlled mode | ✅ | Radio: `isChecked` + `onChange`; RadioGroup: `value` + `onChange` |
| Uncontrolled mode | ✅ | Radio: `defaultChecked`; RadioGroup: `defaultValue` |
| Form integration | ✅ | `name` prop on RadioGroup applies to all children, `value` prop on Radio for form submission |
| Input props pass-through | ✅ | `inputProps` prop accepts additional native input attributes |
| Aria support | ✅ | `aria-describedby`, automatic `aria-invalid`, `aria-required` |

## Code Examples

### Basic Usage (Controlled)
```jsx
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'

function RadioExample() {
  const [value, setValue] = React.useState('1')

  return (
    <RadioGroup onChange={setValue} value={value}>
      <Stack direction='row'>
        <Radio value='1'>First</Radio>
        <Radio value='2'>Second</Radio>
        <Radio value='3'>Third</Radio>
      </Stack>
    </RadioGroup>
  )
}
```

### Uncontrolled with Default Value
```jsx
<RadioGroup defaultValue='2'>
  <Stack spacing={5}>
    <Radio value='1'>Option 1</Radio>
    <Radio value='2'>Option 2</Radio>
    <Radio value='3'>Option 3</Radio>
  </Stack>
</RadioGroup>
```

### Size Variations
```jsx
<Stack>
  <Radio size='sm' name='1' colorScheme='red'>
    Small Radio
  </Radio>
  <Radio size='md' name='1' colorScheme='green'>
    Medium Radio
  </Radio>
  <Radio size='lg' name='1' colorScheme='orange' defaultChecked>
    Large Radio
  </Radio>
</Stack>
```

### Color Schemes
```jsx
<RadioGroup defaultValue='2'>
  <Stack spacing={5} direction='row'>
    <Radio colorScheme='red' value='1'>
      Red Radio
    </Radio>
    <Radio colorScheme='green' value='2'>
      Green Radio
    </Radio>
  </Stack>
</RadioGroup>
```

### Disabled State
```jsx
<RadioGroup defaultValue='1'>
  <Stack>
    <Radio value='1' isDisabled>
      Checked and Disabled
    </Radio>
    <Radio value='2'>
      Unchecked and Enabled
    </Radio>
    <Radio value='3'>
      Unchecked and Enabled
    </Radio>
  </Stack>
</RadioGroup>
```

### Invalid State
```jsx
<Radio isInvalid>Invalid Radio</Radio>
```

### Horizontal Layout
```jsx
<RadioGroup defaultValue='1'>
  <Stack spacing={4} direction='row'>
    <Radio value='1' isDisabled>Radio 1</Radio>
    <Radio value='2'>Radio 2</Radio>
    <Radio value='3'>Radio 3</Radio>
  </Stack>
</RadioGroup>
```

### Vertical Layout (Default)
```jsx
<RadioGroup defaultValue='1'>
  <Stack spacing={3}>
    <Radio value='1'>Radio 1</Radio>
    <Radio value='2'>Radio 2</Radio>
    <Radio value='3'>Radio 3</Radio>
  </Stack>
</RadioGroup>
```

### Custom Radio Buttons (Card Style)
```jsx
import { useRadio, useRadioGroup, Box, HStack } from '@chakra-ui/react'

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

function Example() {
  const options = ['react', 'vue', 'svelte']

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: console.log,
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}
```

### Form Integration Pattern
```jsx
// Recommended: name on RadioGroup
<RadioGroup name='form-field-name'>
  <Radio value='1'>Radio 1</Radio>
  <Radio value='2'>Radio 2</Radio>
</RadioGroup>

// Avoid: name on individual Radio components
<RadioGroup>
  <Radio name='form-field-name' value='1'>Radio 1</Radio>
  <Radio name='form-field-name' value='2'>Radio 2</Radio>
</RadioGroup>
```

## Component Props Reference

### Radio Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Value returned on form submission |
| `isChecked` | `boolean` | — | Controlled checked state (requires onChange) |
| `defaultChecked` | `boolean` | — | Initial checked state for uncontrolled usage |
| `isDisabled` | `boolean` | `false` | Disables interaction |
| `isInvalid` | `boolean` | — | Sets invalid visual state and aria-invalid |
| `isReadOnly` | `boolean` | `false` | Read-only mode |
| `isRequired` | `boolean` | — | Sets aria-required |
| `isFocusable` | `boolean` | — | Maintains focus capability when disabled |
| `colorScheme` | `string` | `"blue"` | Color variant (any theme color) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control sizing |
| `name` | `string` | — | Form field name |
| `onChange` | `(event: ChangeEvent) => void` | — | Fired on checked state change |
| `spacing` | `ResponsiveValue<string>` | `"0.5rem"` | Gap between label and control |
| `aria-describedby` | `string` | — | References labeling element ID |
| `inputProps` | `InputHTMLAttributes` | — | Additional input element props |

### RadioGroup Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Applied to all child Radios (takes precedence) |
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | — | Initial selected value |
| `onChange` | `(value: string) => void` | — | Fired with new value when selection changes |
| `isDisabled` | `boolean` | — | Disables all child radios |

## Notable Features

### 1. Two-Level Component Architecture
RadioGroup manages coordinated state while individual Radio components handle rendering. This separation enables both grouped and standalone usage patterns.

### 2. Hook-Based Customization
`useRadio` and `useRadioGroup` hooks provide full control for creating custom radio button alternatives (cards, buttons, etc.) while maintaining accessibility and behavior.

### 3. Composition Pattern
Works seamlessly with Stack component for layout control. Spacing and orientation handled by Stack rather than RadioGroup props, maintaining separation of concerns.

### 4. Name Prop Hierarchy
RadioGroup's `name` prop takes precedence over individual Radio `name` props, preventing form submission issues in grouped contexts.

### 5. Comprehensive State API
Supports controlled/uncontrolled patterns, disabled, invalid, required, read-only states with proper ARIA attributes for each.

### 6. Theme-First Design
Multi-part anatomy (control, label, container) enables granular theming. Custom sizes and variants defined through theme configuration rather than inline props.

### 7. Color Scheme Flexibility
`colorScheme` prop accepts any color from theme palette, enabling brand-consistent radio buttons without custom CSS.

### 8. Accessibility Built-In
Automatic ARIA attributes (`aria-invalid`, `aria-required`), keyboard navigation support, focus management, and proper semantic HTML structure.

## Implementation Details Worth Noting

### Semantic HTML Foundation
Uses native `<input type="radio">` elements, ensuring proper form behavior, accessibility, and browser compatibility.

### Spacing Control Strategy
The `spacing` prop on Radio controls label-to-control gap, while RadioGroup uses Stack's `spacing` for option separation. This dual-level spacing provides precise layout control.

### State Management Patterns
Supports both controlled (external state with `value`/`onChange`) and uncontrolled (internal state with `defaultValue`) patterns, with RadioGroup automatically managing child Radio states.

### Custom Radio Flexibility
The `useRadio` hook exposes `getInputProps` and `getRadioProps` for building custom controls while maintaining hidden native input for accessibility and form integration.

### Visual Styling Approach
Uses CSS-in-JS with theme tokens for consistent styling. The `_checked`, `_focus`, `_disabled` pseudo-props enable declarative state styling.

## Research Notes

### Documentation Evolution
- **v2 Documentation**: Comprehensive, detailed API reference with inline examples
- **v3 Documentation**: References Ark UI foundation, directs to Storybook for interactive examples, less detailed inline docs
- **Migration**: Chakra UI v3 adopts Ark UI as headless foundation, providing battle-tested accessibility and behavior

### Framework Approach
Chakra UI emphasizes:
- Composition over configuration (Stack for layout, separate Radio components)
- Theme-first customization (sizes/variants in theme config)
- Hook-based extensibility (useRadio/useRadioGroup for custom implementations)
- Accessibility by default (proper ARIA, keyboard navigation, semantic HTML)

### API Design Philosophy
- **Controlled/Uncontrolled Duality**: Supports both patterns equally well
- **Explicit State Props**: `isDisabled`, `isInvalid`, `isRequired` provide clear, discoverable API
- **Value-Based Selection**: RadioGroup works with string values rather than indices or complex objects
- **Minimal Inline Styling**: Prefers theme configuration over inline style props

### Composition Patterns
RadioGroup expects Radio children but doesn't enforce it, enabling wrapper components. Stack integration is conventional but not required. This flexibility supports diverse layout needs.

### Differences from Other Frameworks

1. **Hook-Based Customization**: `useRadio`/`useRadioGroup` hooks enable fully custom UIs while maintaining behavior
2. **Theme-First Sizing**: Sizes defined in theme anatomy rather than inline props
3. **Stack Integration**: Layout handled by composition with Stack rather than RadioGroup layout props
4. **Color Scheme Pattern**: `colorScheme` prop maps to theme palette, ensuring consistency
5. **No Built-In Descriptions**: Help text and error messages handled via separate components (FormControl, Field)

## Patterns to Consider for Semantic UI

### Strengths to Adopt
1. **Hook-based customization pattern** - enables custom radio UIs without reimplementing logic
2. **Two-level architecture** - RadioGroup for coordination, Radio for rendering
3. **Value-based selection** - simple string matching rather than complex state objects
4. **Comprehensive state props** - isInvalid, isRequired, isReadOnly, isFocusable for complete control
5. **Spacing at multiple levels** - label-to-control and option-to-option separation

### Potential Improvements
1. **Built-in orientation prop** - RadioGroup could accept `orientation` instead of requiring Stack
2. **Description/helper text support** - built-in support for help text without external components
3. **Error message integration** - RadioGroup could handle error states and messages directly
4. **Icon support** - explicit API for icons before/after labels
5. **Alignment control** - built-in vertical alignment options for complex label content

### Questions for Semantic UI Design
1. Should we provide both composition-based (Stack) and prop-based (`orientation`) layout patterns?
2. How should RadioGroup handle error messages and help text - built-in or via composition?
3. Should we expose hooks (useRadio/useRadioGroup) or prefer slots/templates for customization?
4. What's the balance between inline props and theme configuration for visual variants?
5. Should we support button-style radios as a built-in variant or leave to custom implementation?
6. How should label content complexity (multi-line, icons, badges) be handled - slots or children?
7. Should RadioGroup support keyboard navigation beyond native radio behavior (arrow keys to adjacent options)?

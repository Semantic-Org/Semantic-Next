# Chakra UI - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/switch
Status: ✅ Working
Version: v3.28.1 (current), v2 documentation also reviewed
Last Verified: 2025-11-05

## Documentation Quality
**Good** - Well-structured documentation with clear navigation and multiple resource links (Source, Storybook, Recipe, Ark UI docs). The v3 documentation is minimal but supplemented by comprehensive v2 docs. Interactive examples available through Storybook. Component uses modern composition patterns in v3 with simpler API in v2.

## Component Definition
- **Core purpose**: Captures binary state in forms (on/off, enabled/disabled, yes/no scenarios). A form control alternative to checkboxes when the action is immediate or the context is settings/preferences.
- **Mental model**: A physical toggle switch that users flip between two states. Unlike checkboxes which suggest selection from a set, switches indicate state change or activation.
- **Semantic meaning**: Communicates immediate state change (e.g., "Turn on notifications") rather than selection for later submission. The visual metaphor mirrors physical toggle switches found on devices.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `isChecked={true}`, `size="lg"`)
- **Composed**: Via composition/children (e.g., `<Switch.Root><Switch.Control /></Switch.Root>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Native (v2) / Composed (v3) | **v2**: Use with `FormLabel` component; **v3**: `<Switch.Label>` sub-component. Labels should always accompany switches for accessibility. Spacing controlled via `spacing` prop in v2. |
| Icons | ✅ | Composed (v3) | **v3**: `<Switch.ThumbIndicator>` component allows icons on the thumb. Icons can indicate on/off states visually. |
| Loading indicator | ❌ | Not present | No native loading state. Would require custom implementation with opacity/spinner overlay. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | **v2**: `isChecked` (controlled), `defaultChecked` (uncontrolled). **v3**: Similar pattern with composition. Primary binary state. |
| Disabled | ✅ | Native | **v2**: `isDisabled` prop. Applies `opacity: 0.5` and `cursor: not-allowed`. Can be made focusable with `isFocusable` prop. |
| Loading | ❌ | Not present | No native loading state support. |
| Read-only | ✅ | Native | **v2**: `isReadOnly` prop. Prevents interaction while maintaining visual appearance. |
| Invalid | ✅ | Native | **v2**: `isInvalid` prop. Applies error styling for form validation. |
| Required | ✅ | Native | **v2**: `isRequired` prop. Marks field as required in forms. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | **v2**: `sm`, `md`, `lg` via `size` prop. Default: `md`. Controls overall component dimensions. Dimensions: default 40px width × 20px height. |
| Color options | ✅ | Native | **v2**: `colorScheme` prop with values: whiteAlpha, blackAlpha, gray, red, orange, yellow, green, teal, blue, cyan, purple, pink. Default: blue. **v3**: `colorPalette` prop (similar options). Applied to checked state background. |
| Label placement | ✅ | CSS/Layout | Labels positioned via layout components (FormControl, HStack, etc.). **v3**: `<Switch.Label>` can be positioned anywhere in composition. Typically placed right of switch (LTR) with flex layout. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Cursor changes to pointer on hover. Click toggles state with smooth CSS transition (150ms cubic-bezier easing). |
| Keyboard control | ✅ | Native | Follows checkbox keyboard workflow (Space to toggle). Focus-visible states with 2px outline. Full keyboard navigation support. |
| onChange handler | ✅ | Native | **v2**: `onChange` event handler receives standard React `ChangeEvent`. Called when switch state changes. |
| Controlled mode | ✅ | Native | **v2**: Use `isChecked` prop with `onChange` handler. State managed by parent component. |
| Uncontrolled mode | ✅ | Native | **v2**: Use `defaultChecked` prop. Component manages own state internally. Can access value via ref. |
| onBlur/onFocus | ✅ | Native | **v2**: `onBlur` and `onFocus` event handlers for focus management. |

## Code Examples

### v3 Basic Usage (Composition Pattern)
```jsx
import { Switch } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Switch.Root>
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>Activate Chakra</Switch.Label>
    </Switch.Root>
  )
}
```

### v3 With Thumb Indicator (Icon)
```jsx
import { Switch } from "@chakra-ui/react"
import { CheckIcon } from "@chakra-ui/icons"

const Demo = () => {
  return (
    <Switch.Root>
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb>
          <Switch.ThumbIndicator>
            <CheckIcon />
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </Switch.Control>
      <Switch.Label>Enable notifications</Switch.Label>
    </Switch.Root>
  )
}
```

### v2 Basic Usage with Label
```jsx
import { Switch, FormControl, FormLabel } from '@chakra-ui/react'

<FormControl display='flex' alignItems='center'>
  <FormLabel htmlFor='email-alerts' mb='0'>
    Enable email alerts?
  </FormLabel>
  <Switch id='email-alerts' />
</FormControl>
```

### v2 Size Variants
```jsx
import { Switch, Stack } from '@chakra-ui/react'

<Stack align='center' direction='row'>
  <Switch size='sm' />
  <Switch size='md' />
  <Switch size='lg' />
</Stack>
```

### v2 Color Schemes
```jsx
import { Switch, Stack } from '@chakra-ui/react'

<Stack direction='row'>
  <Switch colorScheme='red' />
  <Switch colorScheme='teal' size='lg' />
  <Switch colorScheme='green' />
  <Switch colorScheme='purple' />
</Stack>
```

### v2 State Variants
```jsx
import { Switch, FormControl, FormLabel, SimpleGrid } from '@chakra-ui/react'

<FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
  <FormLabel>isChecked:</FormLabel>
  <Switch isChecked />

  <FormLabel>isDisabled:</FormLabel>
  <Switch isDisabled defaultChecked />

  <FormLabel>isFocusable:</FormLabel>
  <Switch isFocusable isDisabled />

  <FormLabel>isInvalid:</FormLabel>
  <Switch isInvalid />

  <FormLabel>isReadOnly:</FormLabel>
  <Switch isReadOnly />

  <FormLabel>isRequired:</FormLabel>
  <Switch isRequired />
</FormControl>
```

### v2 Controlled Component
```jsx
import { useState } from 'react'
import { Switch, FormControl, FormLabel } from '@chakra-ui/react'

function ControlledSwitch() {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <FormControl display='flex' alignItems='center'>
      <FormLabel htmlFor='controlled-switch' mb='0'>
        Enable feature
      </FormLabel>
      <Switch
        id='controlled-switch'
        isChecked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
    </FormControl>
  )
}
```

[View Live v3 Docs](https://chakra-ui.com/docs/components/switch)
[View Live v2 Docs](https://v2.chakra-ui.com/docs/components/switch)

## Notable Features

### Version Differences
- **v3 Architecture**: Modern composition pattern with sub-components (`Switch.Root`, `Switch.Control`, `Switch.Thumb`, `Switch.Label`, `Switch.HiddenInput`, `Switch.ThumbIndicator`). Provides fine-grained control over structure and styling.
- **v2 Architecture**: Single component with props-based API. Simpler for basic use cases but less flexible for composition.
- **Migration Path**: v3 maintains similar functionality but requires restructuring to composition pattern.

### Unique Patterns
- **Hidden Input Pattern** (v3): `<Switch.HiddenInput />` maintains proper form semantics while allowing visual customization of the switch control.
- **Thumb Indicator** (v3): Dedicated component for adding icons/content to the switch thumb, enabling richer visual states.
- **Multi-part Theming** (v2): Component structure with named parts (`container`, `thumb`, `track`) allows granular style customization.
- **RTL Support**: Automatic transform calculation for right-to-left languages.

### CSS Implementation Details
- **Smooth Animations**: 150ms cubic-bezier easing on all state transitions
- **Focus Indicators**: 2px outline on focus-visible for keyboard navigation
- **Disabled Styling**: `opacity: 0.5` and `cursor: not-allowed`
- **Responsive Dimensions**: CSS custom properties (`--switch-width`, `--switch-height`) enable dynamic sizing
- **Default Dimensions**: 40px width × 20px height for standard size

### Accessibility Features
- **ARIA Support**: Full ARIA attributes for disabled/checked states
- **Keyboard Navigation**: Standard checkbox workflow (Space to toggle)
- **Label Association**: Must always be accompanied by label for screen reader support
- **Focus Management**: `isFocusable` prop allows keyboard focus even when disabled
- **Semantic HTML**: Uses proper input semantics with visual overlay

### Form Integration
- **Native Form Support**: Works with standard HTML forms via `name` and `value` props
- **Validation States**: `isInvalid` and `isRequired` props for form validation
- **Event Handling**: Standard React event handlers (`onChange`, `onBlur`, `onFocus`)
- **Controlled/Uncontrolled**: Full support for both patterns

## Research Notes

### Documentation Access
- **v3 Documentation**: Minimal with focus on composition patterns. Interactive examples available via Storybook.
- **v2 Documentation**: More comprehensive with detailed props tables and examples. Better for understanding full API surface.
- **Combined Approach**: Referenced both versions to understand evolution and full capability set.

### Framework Approach
- **Composition over Configuration** (v3): Shift towards composition patterns provides greater flexibility but requires more boilerplate.
- **Ark UI Foundation**: v3 built on Ark UI headless components, providing better accessibility and cross-framework support.
- **Design System Integration**: Uses CSS custom properties and color palette system for theming, enabling easy design system integration.

### Notable Observations
- Switch component treated distinctly from Checkbox, emphasizing immediate state change vs. selection
- Strong accessibility focus with comprehensive ARIA support and keyboard navigation
- Smooth animations and transitions prioritized for polished user experience
- v3 architecture enables richer customization (icons, indicators) through composition
- No native loading state, suggesting switches should represent immediate state rather than pending operations

---

**Research Methodology**: Combined web documentation review (v3 and v2), CSS analysis, and search results to compile comprehensive usage patterns. Cross-referenced multiple sources to ensure accuracy of prop definitions and behavior patterns.

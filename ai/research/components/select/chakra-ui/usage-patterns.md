# Chakra UI - Select Usage Patterns

## Component URL
https://v2.chakra-ui.com/docs/components/select
Status: ✅ Working (v2 docs) | ❌ 404 (main site - appears to have moved or is in transition)

**Note**: The main chakra-ui.com URL returns 404, but the v2.chakra-ui.com documentation is accessible and comprehensive.

## Documentation Quality
**Good** - Clear, concise documentation with practical examples. Well-structured with props table, usage examples, anatomy breakdown, and theming information. Examples demonstrate variants, sizes, states, and customization patterns.

## Component Definition
- **Core purpose**: Enables users to select a single option from a predefined list of choices
- **Mental model**: A native HTML select element enhanced with Chakra UI's design system styling and form control integration
- **Semantic meaning**: Form input control for choosing from multiple options - recommended for 5+ options (use radio group for fewer)

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Options | ✅ | Standard `<option>` elements as children - uses native HTML pattern |
| Placeholder | ✅ | Via `placeholder` prop on the Select component |
| Option groups | ⚠️ | Not documented, but likely supports native `<optgroup>` elements |
| Custom option content | ❌ | Limited to native select capabilities (text only in options) |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single select | ✅ | Default behavior - standard select dropdown |
| Multi-select | ❌ | Not documented - would require native `multiple` attribute or separate component |
| Searchable | ❌ | Not a native feature - would need custom implementation or separate component |
| Clearable | ⚠️ | Not documented - could potentially be implemented via custom solution |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Disabled | ✅ | Via `isDisabled` prop - prevents user interaction |
| Invalid | ✅ | Via `isInvalid` prop - applies error styling |
| ReadOnly | ✅ | Via `isReadOnly` prop - prevents changes but allows tab focus |
| Required | ✅ | Via `isRequired` prop - marks field as mandatory |
| Loading | ❌ | No loading state documented |
| Controlled | ✅ | Via standard React `value` and `onChange` props |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Four sizes: `xs` (24px), `sm` (32px), `md` (40px, default), `lg` (48px) |
| Visual variants | ✅ | Four variants: `outline` (default), `filled`, `flushed`, `unstyled` |
| Color schemes | ✅ | Standard Chakra color schemes: `whiteAlpha`, `blackAlpha`, `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink` |
| Icon customization | ✅ | Via `icon` prop - can replace default dropdown arrow |
| Icon size | ✅ | Via `iconSize` prop - controls icon dimensions |

## Code Examples

### Basic Usage
```jsx
import { Select } from '@chakra-ui/react'

// Simple select with placeholder
<Select placeholder='Select option'>
  <option value='option1'>Option 1</option>
  <option value='option2'>Option 2</option>
  <option value='option3'>Option 3</option>
</Select>
```

### Size Variants
```jsx
import { Select, Stack } from '@chakra-ui/react'

<Stack spacing={3}>
  <Select placeholder='extra small size' size='xs' />
  <Select placeholder='small size' size='sm' />
  <Select placeholder='medium size' size='md' />
  <Select placeholder='large size' size='lg' />
</Stack>
```

### Visual Variants
```jsx
import { Select, Stack } from '@chakra-ui/react'

<Stack spacing={3}>
  <Select variant='outline' placeholder='Outline' />
  <Select variant='filled' placeholder='Filled' />
  <Select variant='flushed' placeholder='Flushed' />
  <Select variant='unstyled' placeholder='Unstyled' />
</Stack>
```

### Custom Icon
```jsx
import { Select } from '@chakra-ui/react'
import { MdArrowDropDown } from 'react-icons/md'

<Select icon={<MdArrowDropDown />} placeholder='Custom icon'>
  <option value='option1'>Option 1</option>
  <option value='option2'>Option 2</option>
  <option value='option3'>Option 3</option>
</Select>

// With custom icon size
<Select
  icon={<MdArrowDropDown />}
  iconSize='24px'
  placeholder='Custom icon with size'
>
  <option value='option1'>Option 1</option>
  <option value='option2'>Option 2</option>
</Select>
```

### Custom Styling
```jsx
<Select
  bg='tomato'
  borderColor='tomato'
  color='white'
  placeholder='Custom styling'
>
  <option value='option1'>Option 1</option>
  <option value='option2'>Option 2</option>
  <option value='option3'>Option 3</option>
</Select>
```

### Form States
```jsx
import { Select, Stack } from '@chakra-ui/react'

<Stack spacing={3}>
  {/* Disabled */}
  <Select placeholder='Disabled' isDisabled>
    <option value='option1'>Option 1</option>
    <option value='option2'>Option 2</option>
  </Select>

  {/* Invalid */}
  <Select placeholder='Invalid' isInvalid>
    <option value='option1'>Option 1</option>
    <option value='option2'>Option 2</option>
  </Select>

  {/* Read-only */}
  <Select placeholder='Read-only' isReadOnly value='option1'>
    <option value='option1'>Option 1</option>
    <option value='option2'>Option 2</option>
  </Select>

  {/* Required */}
  <Select placeholder='Required' isRequired>
    <option value='option1'>Option 1</option>
    <option value='option2'>Option 2</option>
  </Select>
</Stack>
```

### With Color Scheme
```jsx
<Stack spacing={3}>
  <Select colorScheme='red' placeholder='Red color scheme' />
  <Select colorScheme='blue' placeholder='Blue color scheme' />
  <Select colorScheme='green' placeholder='Green color scheme' />
</Stack>
```

### Controlled Component
```jsx
import { Select } from '@chakra-ui/react'
import { useState } from 'react'

function ControlledSelect() {
  const [value, setValue] = useState('')

  return (
    <Select
      placeholder='Select option'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <option value='option1'>Option 1</option>
      <option value='option2'>Option 2</option>
      <option value='option3'>Option 3</option>
    </Select>
  )
}
```

### Theming Example (Component Customization)
```jsx
import { extendTheme } from '@chakra-ui/react'
import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

// Custom variant
const customVariant = definePartsStyle({
  field: {
    background: 'gray.100',
    border: '2px solid',
    borderColor: 'gray.300',
    _hover: {
      borderColor: 'gray.400',
    },
  },
  icon: {
    color: 'gray.500',
  },
})

// Custom size
const xl = definePartsStyle({
  field: {
    fontSize: 'xl',
    px: '6',
    h: '16',
  },
  icon: {
    fontSize: '2xl',
  },
})

// Complete theme config
const selectTheme = defineMultiStyleConfig({
  variants: { custom: customVariant },
  sizes: { xl },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
})

const theme = extendTheme({
  components: { Select: selectTheme },
})
```

## Component Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `"whiteAlpha" \| "blackAlpha" \| "gray" \| "red" \| "orange" \| "yellow" \| "green" \| "teal" \| "blue" \| "cyan" \| "purple" \| "pink"` | — | Controls the visual color appearance of the component |
| `isDisabled` | `boolean` | `false` | If `true`, the select will be disabled |
| `isInvalid` | `boolean` | `false` | If `true`, the select will have error styling |
| `isReadOnly` | `boolean` | `false` | If `true`, prevents changing the value (still focusable) |
| `isRequired` | `boolean` | `false` | If `true`, the select is marked as required |
| `size` | `"lg" \| "md" \| "sm" \| "xs"` | `"md"` | The size of the select component |
| `variant` | `"outline" \| "filled" \| "flushed" \| "unstyled"` | `"outline"` | The visual style variant of the select |
| `icon` | `React.ReactElement` | — | Custom icon to replace the default dropdown arrow |
| `iconSize` | `string` | — | Size of the icon (any CSS size value) |
| `placeholder` | `string` | — | Placeholder text when no option is selected |

**Note**: The Select component composes Box, so it accepts all Box props plus all native HTML select element attributes.

## Component Anatomy

The Select is a **multipart component** consisting of:

1. **field**: The actual select input element
2. **icon**: The dropdown arrow indicator

Each part can be styled independently through theming.

## Notable Features

### 1. Native HTML Select Foundation
Built on top of the native `<select>` element, which means:
- Inherits browser accessibility features
- Works with native form submission
- Supports standard HTML attributes
- Browser-consistent behavior

### 2. Chakra Form Control Integration
Integrates seamlessly with Chakra's form control system:
- Consistent state management (`isDisabled`, `isInvalid`, `isReadOnly`, `isRequired`)
- Standardized styling across form elements
- Works with FormControl, FormLabel, FormErrorMessage, etc.

### 3. Theme-First Design
Heavy emphasis on theme customization:
- Multipart anatomy allows granular styling
- Size and variant system extensible through theme
- Default props configurable at theme level

### 4. Icon Customization
Unique feature allowing replacement of dropdown arrow:
- Accepts any React element as icon
- Icon size independently controllable
- Maintains proper positioning and styling

### 5. Variant System
Four distinct visual styles for different use cases:
- **outline**: Clear boundaries, works in most contexts
- **filled**: Subtle background, reduces visual noise
- **flushed**: Minimal style, fits inline with text
- **unstyled**: Complete control, no default styling

### 6. Size Consistency
Four standardized sizes align with other form elements:
- Creates visual hierarchy in forms
- Consistent spacing and proportions
- Integrates with layout system

### 7. Dark Mode Support
Built-in dark mode support through Chakra's color mode system:
- Automatic color adaptation
- Color schemes work in both modes
- Maintains contrast and accessibility

### 8. Package Organization
Part of `@chakra-ui/select` package, indicating focused responsibility as a form input primitive.

## Implementation Details Worth Noting

### Native Select Element
- Uses native `<select>` and `<option>` elements
- No custom dropdown implementation
- Browser handles all dropdown logic
- Limited styling control over options (browser dependent)

### Box Composition
Composes the Box component, which means:
- Inherits all Box styling capabilities
- Supports responsive styles
- Compatible with style props system
- Can use all Chakra spacing/sizing utilities

### Multipart Component Architecture
- Separate styling for field and icon
- Allows precise control over each element
- Theme can target parts independently
- Maintains consistent internal structure

### Form State Management
Consistent boolean props for states:
- `is` prefix convention (isDisabled, isInvalid, etc.)
- Predictable API across form elements
- Easy to derive state from form validation

### Icon Positioning
Icon automatically positioned based on text direction:
- RTL support built-in
- Proper spacing maintained
- Non-interactive (doesn't trigger dropdown)

## Research Notes

### Documentation Access
- **Main site** (chakra-ui.com): Returns 404 errors on component pages
- **v2 site** (v2.chakra-ui.com): Fully functional and comprehensive
- **Observation**: Chakra UI appears to be in transition to v3 or restructuring their documentation

### Framework Approach
Chakra UI's select philosophy:
- Enhance native HTML rather than replace it
- Integrate with broader form system
- Theme-based customization over inline props
- Consistent API across form controls

### API Design Philosophy
- Uses `is` prefix for boolean state props
- Size and variant as standardized patterns
- Color scheme system for theming
- Icon customization for brand flexibility

### Limitations of Native Select
- Limited option styling (browser dependent)
- No multi-select documented
- No search/filter functionality
- No custom option content (rich media, icons in options)

### Differences from Other Frameworks

1. **Native foundation** - Builds on `<select>` rather than custom implementation
2. **Multipart anatomy** - Explicit separation of field and icon parts
3. **Theme-first** - Less inline styling, more theme configuration
4. **Icon customization** - Unique ability to replace dropdown arrow
5. **Form control integration** - Deeply integrated with Chakra's form system

## Patterns to Consider for Semantic UI

### Strengths to Adopt
1. **Native HTML foundation** - Ensures accessibility and standard behavior
2. **Multipart anatomy** - Clear separation of styling concerns
3. **Consistent state props** - `is` prefix pattern for boolean states
4. **Size/variant system** - Standardized visual variations
5. **Icon customization** - Allow brand-specific dropdown indicators
6. **Form control integration** - Consistent patterns across form elements

### Potential Improvements
1. **Enhanced option styling** - Go beyond native limitations where possible
2. **Multi-select support** - Provide a clear multi-select variant
3. **Searchable variant** - Built-in filtering for long option lists
4. **Loading state** - Show loading when options are fetched asynchronously
5. **Option groups** - Document and style `<optgroup>` support
6. **Clearable option** - Easy way to clear selection
7. **Custom option content** - Support for icons, descriptions in options (may require custom implementation)

### Questions for Semantic UI Design
1. Should we build on native `<select>` or create custom dropdown implementation?
2. How do we balance native accessibility with custom styling needs?
3. Should multi-select be a variant or separate component?
4. How should we handle searchable/filterable selects?
5. What level of option customization should we support (text only vs. rich content)?
6. Should we provide built-in async data loading patterns?
7. How do we style option groups (`<optgroup>`)?
8. Should we support option icons, descriptions, or other metadata?
9. How does the component integrate with our form validation system?
10. What's our approach to keyboard navigation enhancements?

## Comparison with Native Select

### What Chakra Adds
- Consistent visual styling across browsers
- Integration with design system (colors, sizes, variants)
- Icon customization
- Standardized state management
- Theme-based customization
- Dark mode support

### What Remains Native
- Dropdown behavior and positioning
- Option rendering
- Keyboard navigation
- Browser form integration
- Mobile select behavior (native picker)

## Accessibility Considerations

### Built-in (via native select)
- Keyboard navigation (arrow keys, type-to-search)
- Screen reader announcements
- Focus management
- Label association (via FormControl)
- Required field indication
- Invalid state communication

### Chakra Enhancements
- Visual state indicators align with ARIA states
- Color contrast maintained across variants
- Focus indicators clearly visible
- Dark mode maintains accessibility standards

# Chakra UI - Button Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://chakra-ui.com/docs/components/button
Status: ✅ Working (v2 documentation also available at https://v2.chakra-ui.com/docs/components/button)
Version: Current (v2 and v3)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Chakra UI provides excellent documentation with interactive examples, complete prop reference, accessibility guidance, and multiple version support.

## Component Definition
- **Core purpose**: To trigger actions or events in the user interface. Provides a semantic, accessible way for users to interact with the application through clicks or keyboard activation.
- **Mental model**: A clickable element that communicates an action that will occur. Can be styled to communicate hierarchy (primary/secondary), state (loading/disabled), and purpose through color schemes.
- **Semantic meaning**: Represents an actionable element in the interface. Visual styling (variant, color scheme, size) communicates the action's importance and type to users.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `colorScheme="blue"`)
- **Composed**: Via composition/children (e.g., `<Button>{content}</Button>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Text passed as children: `<Button>Click me</Button>` |
| Icon support | ✅ | Native | `leftIcon` and `rightIcon` props for icon placement |
| Icon + Text | ✅ | Native | Icons positioned via `leftIcon={<EmailIcon />}` or `rightIcon={<ArrowIcon />}` with automatic spacing |
| Loading indicator | ✅ | Native | `isLoading` prop with optional `loadingText`, `spinner`, and `spinnerPlacement` props |
| Custom content | ✅ | Composed | Any React children supported, including complex compositions |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Primary | ✅ | Native | `variant="solid"` (default) with `colorScheme` prop |
| Secondary | ✅ | Native | `variant="outline"` for secondary actions |
| Default | ✅ | Native | Default gray color scheme, solid variant |
| Link/Text | ✅ | Native | `variant="link"` for text-style buttons |
| Ghost | ✅ | Native | `variant="ghost"` for subtle, transparent buttons |
| Outline | ✅ | Native | `variant="outline"` for bordered buttons |
| Unstyled | ✅ | Native | `variant="unstyled"` for complete custom styling |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `isDisabled` prop, supports aria-disabled states |
| Loading | ✅ | Native | `isLoading` prop with spinner, `loadingText`, custom `spinner`, `spinnerPlacement="start\|end"` |
| Active | ✅ | Native | `isActive` prop for active state styling |
| Hover | ✅ | CSS-only | `_hover` style prop for custom hover states |
| Focus | ✅ | Native | Built-in focus-visible styles, customizable via `_focus` prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: "xs", "sm", "md" (default), "lg", "xl" (v3) |
| Color schemes | ✅ | Native | `colorScheme` prop: gray (default), red, orange, yellow, green, teal, blue, cyan, purple, pink, whiteAlpha, blackAlpha |
| Variants | ✅ | Native | `variant` prop: "solid" (default), "outline", "ghost", "link", "unstyled" |
| Full width | ✅ | CSS-only | Style props: `width="100%"` or custom width/height values |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard `onClick` prop (React event handler) |
| Button group | ✅ | Native | `<ButtonGroup>` component with `isAttached`, `spacing`, `size`, `variant` props |
| As link (href) | ✅ | Native | `as="a"` prop polymorphism for rendering as anchor element |
| Form submission | ✅ | Native | Standard `type="submit"` HTML attribute support |

## Code Examples

### Basic Usage
```jsx
import { Button } from '@chakra-ui/react'

<Button colorScheme='blue'>Button</Button>
```

### Size Variations
```jsx
import { Button, Stack } from '@chakra-ui/react'

<Stack spacing={4} direction='row' align='center'>
  <Button colorScheme='teal' size='xs'>Button</Button>
  <Button colorScheme='teal' size='sm'>Button</Button>
  <Button colorScheme='teal' size='md'>Button</Button>
  <Button colorScheme='teal' size='lg'>Button</Button>
  {/* v3 also supports 'xl' */}
  <Button colorScheme='teal' size='xl'>Button</Button>
</Stack>
```

### Variant Options
```jsx
<Stack direction='row' spacing={4} align='center'>
  <Button colorScheme='teal' variant='solid'>Solid</Button>
  <Button colorScheme='teal' variant='outline'>Outline</Button>
  <Button colorScheme='teal' variant='ghost'>Ghost</Button>
  <Button colorScheme='teal' variant='link'>Link</Button>
  <Button colorScheme='teal' variant='unstyled'>Unstyled</Button>
</Stack>
```

### Buttons with Icons
```jsx
import { EmailIcon, ArrowForwardIcon } from '@chakra-ui/icons'
// or use react-icons:
import { RiArrowRightLine, RiMailLine } from "react-icons/ri"

<Stack direction='row' spacing={4}>
  <Button leftIcon={<EmailIcon />} colorScheme='teal' variant='solid'>
    Email
  </Button>
  <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline'>
    Call us
  </Button>

  {/* v3 syntax - icons as children */}
  <Button colorPalette="teal" variant="solid">
    <RiMailLine /> Email
  </Button>
</Stack>
```

### Loading States
```jsx
<Stack spacing={4}>
  {/* Simple loading spinner */}
  <Button isLoading colorScheme='teal' variant='solid'>
    Email
  </Button>

  {/* Loading with text */}
  <Button isLoading loadingText='Submitting' colorScheme='teal' variant='outline'>
    Submit
  </Button>

  {/* Custom spinner */}
  <Button
    isLoading
    colorScheme='blue'
    spinner={<BeatLoader size={8} color='white' />}
  >
    Click me
  </Button>

  {/* Spinner placement control */}
  <Button isLoading loadingText='Loading' spinnerPlacement='start'>
    Submit
  </Button>
  <Button isLoading loadingText='Loading' spinnerPlacement='end'>
    Continue
  </Button>
</Stack>
```

### Button Groups
```jsx
import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

{/* Standard group with spacing */}
<ButtonGroup variant='outline' spacing='6'>
  <Button colorScheme='blue'>Save</Button>
  <Button>Cancel</Button>
</ButtonGroup>

{/* Attached group (no spacing, connected borders) */}
<ButtonGroup size='sm' isAttached variant='outline'>
  <Button>Save</Button>
  <IconButton aria-label='Add to friends' icon={<AddIcon />} />
</ButtonGroup>
```

### Custom Styling
```jsx
import { Box } from '@chakra-ui/react'

{/* Using style props */}
<Button
  size='md'
  height='48px'
  width='200px'
  border='2px'
  borderColor='green.500'
>
  Button
</Button>

{/* Completely custom with Box */}
<Box
  as='button'
  height='24px'
  px='8px'
  borderRadius='2px'
  fontWeight='semibold'
  bg='#f5f6f7'
  borderColor='#ccd0d5'
  color='#4b4f56'
  _hover={{ bg: '#ebedf0' }}
  _active={{ bg: '#dddfe2', transform: 'scale(0.98)' }}
>
  Join Group
</Box>
```

### Color Schemes
```jsx
<HStack wrap="wrap" gap="4">
  <Button colorScheme='gray'>Gray</Button>
  <Button colorScheme='red'>Red</Button>
  <Button colorScheme='orange'>Orange</Button>
  <Button colorScheme='yellow'>Yellow</Button>
  <Button colorScheme='green'>Green</Button>
  <Button colorScheme='teal'>Teal</Button>
  <Button colorScheme='blue'>Blue</Button>
  <Button colorScheme='cyan'>Cyan</Button>
  <Button colorScheme='purple'>Purple</Button>
  <Button colorScheme='pink'>Pink</Button>
</HStack>
```

### As Link Element
```jsx
<Button as='a' href='https://example.com' colorScheme='blue'>
  External Link
</Button>
```

### Form Submission
```jsx
<form onSubmit={handleSubmit}>
  <Button type='submit' colorScheme='blue'>
    Submit Form
  </Button>
</form>
```

## Props Reference

### Button Props
- **colorScheme**: `string` - Visual color appearance (gray, red, orange, yellow, green, teal, blue, cyan, purple, pink, whiteAlpha, blackAlpha). Default: "gray"
- **size**: `"xs" | "sm" | "md" | "lg" | "xl"` - Button dimensions. Default: "md"
- **variant**: `"ghost" | "outline" | "solid" | "link" | "unstyled"` - Visual style. Default: "solid"
- **isActive**: `boolean` - Styled in active state. Default: false
- **isDisabled**: `boolean` - Disable button. Default: false
- **isLoading**: `boolean` - Show spinner. Default: false
- **leftIcon**: `ReactElement` - Icon before label (v2)
- **rightIcon**: `ReactElement` - Icon after label (v2)
- **loadingText**: `string` - Text displayed when loading
- **spinner**: `ReactElement` - Custom loader component
- **spinnerPlacement**: `"start" | "end"` - Spinner position. Default: "start"
- **iconSpacing**: `string | number` - Space between icon and label

### ButtonGroup Props
- **isAttached**: `boolean` - Remove border radius between buttons. Default: false
- **isDisabled**: `boolean` - Disable all buttons. Default: false
- **spacing**: `string | number` - Gap between buttons. Default: "0.5rem"
- **size**: `string` - All children button sizes
- **variant**: `string` - All children button variant

## Notable Features

### CSS Variable-Driven Theming
Chakra UI uses CSS custom properties extensively for theming, allowing runtime theme switching without CSS-in-JS performance overhead. Each color scheme includes comprehensive semantic tokens (contrast, fg, subtle, muted, emphasized, solid, focus-ring).

### Polymorphic Component Pattern
The `as` prop allows buttons to render as any HTML element or React component, enabling semantic HTML while maintaining button styling (e.g., `as="a"` for links).

### Comprehensive State Management
Built-in handling for all interactive states (hover, focus, active, disabled, loading) with CSS transitions. The `_hover`, `_focus`, `_active` style props provide customization without fighting defaults.

### Accessibility First
- Semantic HTML `<button>` element
- Keyboard navigation (Space/Enter activation)
- Focus-visible states with appropriate focus rings
- ARIA attributes support (aria-disabled, aria-label)
- Screen reader friendly loading states

### Dark Mode Support
Full dark mode support through CSS variable system with `.dark` selector, automatically adjusting colors for dark themes.

### Flexible Icon Integration
Supports both dedicated icon props (v2) and icon-as-children composition (v3), with automatic spacing and sizing. Compatible with any icon library (Chakra Icons, React Icons, custom SVGs).

### Loading State Customization
Unique ability to customize loading spinner, placement, and text independently. Supports both built-in spinners and custom loading components.

### Button Group Composition
`ButtonGroup` component provides intelligent layout management with attached buttons, shared props, and proper border radius handling for grouped controls.

## Research Notes

### Version Differences
- **v2** uses `leftIcon` and `rightIcon` props for icon placement
- **v3** uses composition pattern with icons as children alongside text
- **v3** introduces `colorPalette` prop (replacing `colorScheme`)
- **v3** adds "xl" size option

### Documentation Access
The main documentation at chakra-ui.com focuses on the latest version, while v2.chakra-ui.com maintains documentation for the stable v2 release. Both versions are well-documented with comprehensive examples.

### CSS Architecture
Chakra UI's button implementation uses:
- Inline-flex display for proper content alignment
- CSS custom properties for theming (e.g., `--chakra-colors-color-palette-solid`)
- Responsive design with media queries for hover states
- 200ms transitions for smooth state changes
- Semantic color palettes with 50-950 shades

### Notable Implementation Patterns
- **Zero-runtime CSS**: Uses CSS variables instead of runtime CSS-in-JS where possible
- **Style props system**: Chakra's `sx` and style props enable inline styling without className management
- **Responsive values**: Size and other props can accept responsive arrays/objects
- **Component composition**: Encourages building complex UIs from simple primitives

### Observations
Chakra UI demonstrates a mature, production-ready button component with exceptional developer experience. The framework successfully balances flexibility (extensive customization options) with consistency (sensible defaults, comprehensive theming). The documentation quality is exemplary, with interactive examples and clear API references. The transition from v2 to v3 shows thoughtful evolution toward more composable patterns while maintaining backward compatibility concepts.

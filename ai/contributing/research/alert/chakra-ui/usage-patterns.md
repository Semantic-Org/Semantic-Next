# Chakra UI Alert - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://chakra-ui.com/docs/components/alert
> Version: v2 and v3 documented
> Last Verified: 2025-11-06

## Component Overview

The Alert component is used to communicate a state that affects a system, feature, or page. It provides visual and semantic feedback to users about important information, warnings, errors, or success messages.

**Core purpose**: Display status messages and notifications that require user attention or acknowledgment.

**Mental model**: A container that combines an icon/indicator, title, and description to convey system state changes or important information to users.

**Semantic meaning**: Represents an important message that should be announced to assistive technologies, with visual styling that communicates the severity or type of message through color and iconography.

## Version Differences

### v2 Architecture
- Uses named exports: `Alert`, `AlertIcon`, `AlertTitle`, `AlertDescription`
- Flat component composition
- Props: `status`, `variant`, `colorScheme`
- Example: `<Alert status="error"><AlertIcon />...</Alert>`

### v3 Architecture
- Uses dot notation: `Alert.Root`, `Alert.Indicator`, `Alert.Content`, `Alert.Title`, `Alert.Description`
- Built on Ark UI foundation (headless component library using Zag.js state machines)
- Props: `status`, `variant`, `colorPalette`, `size`
- Improved composition with `Alert.Content` wrapper
- Better separation of concerns with structured anatomy
- Example: `<Alert.Root status="error"><Alert.Indicator />...</Alert.Root>`

## Core Patterns

### Component Anatomy

**v2 Structure:**
```
Alert (container)
├── AlertIcon (status indicator)
├── AlertTitle (heading)
└── AlertDescription (body text)
```

**v3 Structure:**
```
Alert.Root (container)
├── Alert.Indicator (status indicator/icon)
├── Alert.Content (content wrapper)
│   ├── Alert.Title (heading)
│   └── Alert.Description (body text)
└── CloseButton (optional dismissal)
```

### Pattern Support Levels
- **Native**: Dedicated prop/API provided by the framework
- **Composed**: Via component composition and children
- **CSS-only**: Requires custom styling or style props

## Props & Configuration

### v2 Props

#### Alert (Root Component)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `"info" \| "warning" \| "success" \| "error" \| "loading"` | `"info"` | Alert status type affecting color scheme and icon |
| `variant` | `"subtle" \| "left-accent" \| "top-accent" \| "solid"` | `"subtle"` | Visual variant style |
| `colorScheme` | `string` | `"blue"` | Color combination for theming |
| `addRole` | `boolean` | `false` | Add ARIA role attribute |
| `size` | `string` | — | Alert size (custom implementation) |

#### AlertIcon
- Automatically displays appropriate icon based on `status` prop of parent Alert
- Accepts standard icon props (size, color, etc.)

#### AlertTitle
- Standard text/heading props
- Announced to screen readers as alert title

#### AlertDescription
- Standard text props
- Announced to screen readers as alert description

### v3 Props

#### Alert.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `"info" \| "warning" \| "success" \| "error" \| "neutral"` | `"info"` | Alert status affecting color scheme and indicator |
| `variant` | `"subtle" \| "surface" \| "outline" \| "solid"` | `"subtle"` | Visual variant style |
| `colorPalette` | `"gray" \| "red" \| "orange" \| "yellow" \| "green" \| "teal" \| "blue" \| "cyan" \| "purple" \| "pink"` | `"gray"` | Color palette (auto-inferred from status but can be overridden) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Alert dimensions and spacing |
| `as` | `ElementType` | `div` | Element type to render as |
| `asChild` | `boolean` | `false` | Use provided child element as root |

#### Alert.Indicator
- Displays status-based icon or custom content
- Can contain Spinner for loading states
- Inherits color from parent status/colorPalette

#### Alert.Content
- Wrapper component for title and description
- Provides proper spacing and layout
- New in v3 for better content organization

#### Alert.Title
- Heading element for alert
- Screen reader announced
- Standard text/heading props

#### Alert.Description
- Body text element for alert
- Screen reader announced
- Standard text props

## Visual Patterns

### Status Variants

| Status | Color | Icon | Use Case |
|--------|-------|------|----------|
| `info` | Blue | Info icon | General information, tips, neutral messages |
| `warning` | Orange | Warning icon | Cautionary messages, potential issues |
| `success` | Green | Check/success icon | Successful operations, confirmations |
| `error` | Red | Error/alert icon | Errors, failures, critical issues |
| `loading` (v2) | — | Spinner | Processing, loading states |
| `neutral` (v3) | Gray | Custom icon | Neutral informational messages |

### Visual Style Variants

| Variant | Appearance | Use Case |
|---------|------------|----------|
| `subtle` (default) | Soft background with colored text/icon | Most common, balanced visibility |
| `solid` | Solid colored background | High visibility, critical messages |
| `left-accent` (v2) | Left border accent | Moderate emphasis, sidebar notifications |
| `top-accent` (v2) | Top border accent | Banner-style notifications |
| `surface` (v3) | Surface background variant | Alternative to subtle |
| `outline` (v3) | Outlined border style | Minimal, clean appearance |

### Size Options (v3)

| Size | Use Case |
|------|----------|
| `sm` | Compact alerts, inline messages |
| `md` | Standard alerts (default) |
| `lg` | Prominent alerts, page-level messages |

## Composition Patterns

### Basic Alert (v2)

```jsx
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

<Alert status='error'>
  <AlertIcon />
  <AlertTitle>Your browser is outdated!</AlertTitle>
  <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
</Alert>
```

### Basic Alert (v3)

```jsx
import { Alert } from "@chakra-ui/react"

<Alert.Root status="error">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Invalid Fields</Alert.Title>
    <Alert.Description>
      Your form has some errors. Please fix them and try again.
    </Alert.Description>
  </Alert.Content>
</Alert.Root>
```

### Simple Alert (Title Only)

**v2:**
```jsx
<Alert status='success'>
  <AlertIcon />
  <AlertTitle>Data uploaded to the server. Fire on!</AlertTitle>
</Alert>
```

**v3:**
```jsx
<Alert.Root status="success">
  <Alert.Indicator />
  <Alert.Title>Data uploaded to the server. Fire on!</Alert.Title>
</Alert.Root>
```

### Alert with Description Only

**v2:**
```jsx
<Alert status='info'>
  <AlertIcon />
  <AlertDescription>
    Chakra is going live on August 30th. Get ready!
  </AlertDescription>
</Alert>
```

**v3:**
```jsx
<Alert.Root status="info">
  <Alert.Indicator />
  <Alert.Description>
    Chakra is going live on August 30th. Get ready!
  </Alert.Description>
</Alert.Root>
```

### All Status Variants

**v2:**
```jsx
import { Stack } from '@chakra-ui/react'

<Stack spacing={3}>
  <Alert status='error'>
    <AlertIcon />
    There was an error processing your request
  </Alert>

  <Alert status='success'>
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>

  <Alert status='warning'>
    <AlertIcon />
    Seems your account is about expire, upgrade now
  </Alert>

  <Alert status='info'>
    <AlertIcon />
    Chakra is going live on August 30th. Get ready!
  </Alert>
</Stack>
```

**v3:**
```jsx
import { Stack } from "@chakra-ui/react"

<Stack gap="3">
  <Alert.Root status="error">
    <Alert.Indicator />
    There was an error processing your request
  </Alert.Root>

  <Alert.Root status="success">
    <Alert.Indicator />
    Data uploaded to the server. Fire on!
  </Alert.Root>

  <Alert.Root status="warning">
    <Alert.Indicator />
    Seems your account is about expire, upgrade now
  </Alert.Root>

  <Alert.Root status="info">
    <Alert.Indicator />
    Chakra is going live on August 30th. Get ready!
  </Alert.Root>
</Stack>
```

### All Visual Variants

**v2:**
```jsx
<Stack spacing={3}>
  <Alert status='success' variant='subtle'>
    <AlertIcon />
    Subtle variant
  </Alert>

  <Alert status='success' variant='solid'>
    <AlertIcon />
    Solid variant
  </Alert>

  <Alert status='success' variant='left-accent'>
    <AlertIcon />
    Left accent variant
  </Alert>

  <Alert status='success' variant='top-accent'>
    <AlertIcon />
    Top accent variant
  </Alert>
</Stack>
```

**v3:**
```jsx
<Stack gap="3">
  <Alert.Root status="success" variant="subtle">
    <Alert.Indicator />
    Subtle variant
  </Alert.Root>

  <Alert.Root status="success" variant="solid">
    <Alert.Indicator />
    Solid variant
  </Alert.Root>

  <Alert.Root status="success" variant="outline">
    <Alert.Indicator />
    Outline variant
  </Alert.Root>

  <Alert.Root status="success" variant="surface">
    <Alert.Indicator />
    Surface variant
  </Alert.Root>
</Stack>
```

### Alert with CloseButton

**v2:**
```jsx
import { CloseButton, Box, useDisclosure } from '@chakra-ui/react'

function CompExample() {
  const { isOpen: isVisible, onClose, onOpen } = useDisclosure({
    defaultIsOpen: true
  })

  return isVisible ? (
    <Alert status='success'>
      <AlertIcon />
      <Box>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your application received. We'll respond within 48 hours.
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf='flex-start'
        position='relative'
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  ) : (
    <Button onClick={onOpen}>Show Alert</Button>
  )
}
```

**v3:**
```jsx
import { CloseButton } from "@chakra-ui/react"

<Alert.Root>
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Success!</Alert.Title>
    <Alert.Description>
      Your application has been received.
    </Alert.Description>
  </Alert.Content>
  <CloseButton pos="relative" top="-2" insetEnd="-2" />
</Alert.Root>
```

### Centered Vertical Layout

**v2:**
```jsx
<Alert
  status='success'
  variant='subtle'
  flexDirection='column'
  alignItems='center'
  justifyContent='center'
  textAlign='center'
  height='200px'
>
  <AlertIcon boxSize='40px' mr={0} />
  <AlertTitle mt={4} mb={1} fontSize='lg'>
    Application submitted!
  </AlertTitle>
  <AlertDescription maxWidth='sm'>
    Thanks for submitting your application. Our team will get back to you soon.
  </AlertDescription>
</Alert>
```

**v3:**
```jsx
<Alert.Root
  status="success"
  variant="subtle"
  flexDirection="column"
  alignItems="center"
  justifyContent="center"
  textAlign="center"
  height="200px"
>
  <Alert.Indicator boxSize="40px" mb={0} />
  <Alert.Content>
    <Alert.Title mt={4} mb={1} fontSize="lg">
      Application submitted!
    </Alert.Title>
    <Alert.Description maxWidth="sm">
      Thanks for submitting your application. Our team will get back to you soon.
    </Alert.Description>
  </Alert.Content>
</Alert.Root>
```

### Loading State Alert

**v2:**
```jsx
<Alert status='loading' variant='subtle'>
  <AlertIcon />
  <AlertDescription>Loading your data...</AlertDescription>
</Alert>
```

**v3:**
```jsx
import { Spinner } from "@chakra-ui/react"

<Alert.Root
  borderStartWidth="3px"
  borderStartColor="colorPalette.600"
  title="We are loading something"
>
  <Alert.Indicator>
    <Spinner size="sm" />
  </Alert.Indicator>
  <Alert.Title>We are loading something</Alert.Title>
</Alert.Root>
```

### Custom Color Palette (v3)

```jsx
<Alert.Root status="info" colorPalette="purple">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Custom Color</Alert.Title>
    <Alert.Description>
      This alert uses a purple color palette instead of the default blue.
    </Alert.Description>
  </Alert.Content>
</Alert.Root>
```

### Custom Icon

**v2:**
```jsx
import { Icon } from '@chakra-ui/react'
import { FiAlertCircle } from 'react-icons/fi'

<Alert status='info'>
  <Icon as={FiAlertCircle} w={5} h={5} mr={2} />
  <AlertDescription>Custom icon alert</AlertDescription>
</Alert>
```

**v3:**
```jsx
import { Icon } from "@chakra-ui/react"
import { FiAlertCircle } from "react-icons/fi"

<Alert.Root status="info">
  <Alert.Indicator>
    <Icon as={FiAlertCircle} />
  </Alert.Indicator>
  <Alert.Description>Custom icon alert</Alert.Description>
</Alert.Root>
```

## Layout Patterns

### Horizontal Layout (Default)
- Icon/Indicator on left
- Content (title + description) in center
- Optional close button on right
- Flex layout with start alignment

### Vertical/Centered Layout
- Icon/Indicator on top
- Content centered below
- Useful for full-width banners or prominent messages
- Achieved via flexDirection and alignment props

### Inline Alerts
- Small size variant (v3)
- Minimal spacing
- Integrated within forms or content sections

### Page-Level Alerts
- Large size variant (v3)
- Full-width banners
- Top accent or solid variants for visibility

## Accessibility

### ARIA Attributes

**v2:**
- `role="alert"` (when `addRole` prop is true, or automatic for certain statuses)
- `aria-live="polite"` for informational messages
- `aria-live="assertive"` for errors and warnings
- Screen readers announce title and description automatically

**v3:**
- Built on Ark UI which follows WAI-ARIA design patterns
- Automatic ARIA attribute management based on status
- `role="alert"` for important messages
- `aria-live` regions configured based on status severity
- Tested with real assistive technologies (WCAG compliant)

### Keyboard Support

Alert components generally don't require keyboard interaction unless they contain interactive elements (like CloseButton):

- **CloseButton**: Focusable via Tab key, activated with Space/Enter
- **Focus indicators**: Visible focus rings for keyboard navigation
- **Tab order**: Natural document flow, CloseButton typically last

### Screen Reader Support

- Status changes are announced immediately (aria-live)
- Icon meaning conveyed through status context
- Title and description properly associated and announced
- Loading states announced with appropriate context

### Color Contrast

- All status colors meet WCAG AA contrast requirements
- Solid variant provides highest contrast
- Subtle variant balances readability with visual hierarchy
- Dark mode support with automatic color adjustments

## Framework-Specific Features

### Polymorphic Component Pattern (v2 & v3)

The `as` prop allows rendering Alert as any HTML element or React component:

```jsx
// v2
<Alert as="section" status="info">
  <AlertIcon />
  Polymorphic alert as section element
</Alert>

// v3
<Alert.Root as="section" status="info">
  <Alert.Indicator />
  Polymorphic alert as section element
</Alert.Root>
```

### Style Props System

Chakra's comprehensive style props enable inline styling without className management:

```jsx
// v2
<Alert
  status="warning"
  bg="orange.100"
  borderLeft="4px"
  borderColor="orange.500"
  borderRadius="md"
  p={4}
>
  <AlertIcon />
  Custom styled alert
</Alert>

// v3
<Alert.Root
  status="warning"
  bg="orange.100"
  borderStart="4px"
  borderColor="orange.500"
  borderRadius="md"
  p={4}
>
  <Alert.Indicator />
  Custom styled alert
</Alert.Root>
```

### Responsive Design

Props can accept responsive arrays or objects for breakpoint-specific values:

```jsx
// v2
<Alert
  flexDirection={['column', 'row']}
  textAlign={['center', 'left']}
  status="info"
>
  <AlertIcon mb={[2, 0]} mr={[0, 2]} />
  <AlertDescription>Responsive alert layout</AlertDescription>
</Alert>

// v3
<Alert.Root
  flexDirection={{ base: 'column', md: 'row' }}
  textAlign={{ base: 'center', md: 'left' }}
  status="info"
>
  <Alert.Indicator mb={{ base: 2, md: 0 }} mr={{ base: 0, md: 2 }} />
  <Alert.Description>Responsive alert layout</Alert.Description>
</Alert.Root>
```

### CSS Variables Theming

**v2:**
- CSS custom properties for color schemes
- `--chakra-colors-*` variables for theming
- Runtime theme switching without CSS-in-JS overhead

**v3:**
- Enhanced CSS variable system with semantic tokens
- `colorPalette.subtle`, `colorPalette.solid`, `colorPalette.fg`, `colorPalette.contrast`
- Color placeholder that can be swapped at any DOM depth
- Configurable CSS variable prefix via `cssVarsPrefix` option

### Dark Mode Support

Both v2 and v3 provide automatic dark mode support:

```jsx
// Automatic dark mode color adjustments
<Alert status="success" variant="subtle">
  <Alert.Indicator />
  This alert automatically adapts to dark mode
</Alert.Root>
```

- Uses `.dark` selector or `data-theme` attribute
- All status colors have dark mode variants
- Maintains contrast ratios in dark mode
- Smooth transitions between modes

### Component Composition

Alert integrates seamlessly with other Chakra components:

```jsx
// v3 example with multiple components
import { Alert, Stack, Button, CloseButton, Text } from "@chakra-ui/react"

<Stack gap={4}>
  <Alert.Root status="info" variant="subtle">
    <Alert.Indicator />
    <Alert.Content>
      <Alert.Title>Update Available</Alert.Title>
      <Alert.Description>
        <Text>A new version is available.</Text>
        <Button size="sm" mt={2}>Update Now</Button>
      </Alert.Description>
    </Alert.Content>
    <CloseButton />
  </Alert.Root>
</Stack>
```

## Implementation Notes

### Ark UI Foundation (v3)

Chakra UI v3 is built on top of Ark UI, a headless component library:

- **State machines**: Uses Zag.js state machines for robust behavior
- **Framework agnostic**: Ark UI provides the logic layer
- **Perfect parity**: Same behavior across React, Solid, Vue, Svelte
- **Battle-tested**: Thoroughly tested with assistive technologies
- **Accessible by default**: Follows WAI-ARIA design patterns
- **Maintained by Chakra team**: Ensures tight integration

This architecture provides:
- More reliable state management
- Consistent behavior across frameworks
- Better accessibility out of the box
- Easier maintenance and testing

### Theming Architecture

**v2 Theming:**
```javascript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(['container', 'title', 'description', 'icon'])

const customVariant = definePartsStyle({
  container: {
    borderRadius: 'full',
    border: '2px solid',
  },
})

export const alertTheme = defineMultiStyleConfig({
  variants: { custom: customVariant },
})
```

**v3 Recipe System:**
```javascript
import { defineSlotRecipe } from "@chakra-ui/react"
import { alertAnatomy } from "@chakra-ui/react/anatomy"

const alertSlotRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  variants: {
    shape: {
      rounded: {
        root: {
          borderRadius: "full"
        },
      },
    },
  },
})
```

### Component Parts

**v2 Anatomy:**
- container
- title
- description
- icon
- spinner (for loading states)

**v3 Anatomy:**
- root
- indicator
- content
- title
- description

### Migration Considerations

When migrating from v2 to v3:

1. **Import changes**: Update to dot notation (`Alert.Root` instead of `Alert`)
2. **Component structure**: Add `Alert.Content` wrapper for title/description
3. **Icon component**: `AlertIcon` → `Alert.Indicator`
4. **Props**: `colorScheme` → `colorPalette`
5. **Variants**: `left-accent`, `top-accent` → `outline`, `surface`
6. **Custom icons**: Wrap in `Alert.Indicator` instead of replacing `AlertIcon`
7. **Theming**: Update from multi-style config to slot recipes

### Performance Considerations

- **Zero-runtime CSS**: CSS variables reduce runtime CSS-in-JS overhead
- **Component memoization**: Use React.memo for frequently updated alerts
- **Lazy loading**: Dynamic import for alert-heavy applications
- **CSS variable caching**: Theme values cached as CSS variables

### Best Practices

1. **Use appropriate status**: Match status to message severity
2. **Provide context**: Include both title and description for clarity
3. **Consider placement**: Page-level vs inline alerts
4. **Dismissible alerts**: Add CloseButton for non-critical messages
5. **Avoid overuse**: Too many alerts reduce their effectiveness
6. **Maintain consistency**: Use standard variants unless custom styling is necessary
7. **Test accessibility**: Verify screen reader announcements
8. **Responsive design**: Adjust layout for different screen sizes

## Research Notes

### Documentation Quality

Excellent comprehensive documentation with:
- Interactive examples in official docs and Storybook
- Complete prop reference tables
- Accessibility guidance
- Migration guides between versions
- Links to source code and recipe files

### Version Timeline

- **v0-v1**: Initial Alert implementation with basic status support
- **v2**: Mature implementation with multi-part component system
- **v3**: Complete rewrite on Ark UI foundation with improved composition patterns

### CSS Architecture

**v2:**
- Inline-flex display for content alignment
- CSS custom properties for color schemes
- Transition effects for state changes
- Multi-part style configuration system

**v3:**
- Enhanced CSS variable system with semantic tokens
- Recipe-based theming architecture
- Color palette placeholder system
- Improved CSS architecture for better performance

### Notable Patterns

1. **Multipart components**: Separates concerns (icon, title, description)
2. **Status-driven styling**: Icon and colors automatic based on status
3. **Flexible composition**: Mix and match parts as needed
4. **Style props integration**: Inline styling without className management
5. **Responsive support**: Built-in breakpoint handling
6. **Theming flexibility**: Multiple customization layers

### Cross-Framework Comparison

Chakra UI's Alert stands out for:
- Exceptional documentation quality
- Smooth v2 to v3 migration path
- Strong accessibility foundation (especially v3 with Ark UI)
- Comprehensive theming system
- React-first but Ark UI enables multi-framework support
- Active maintenance and community

### Observations

Chakra UI demonstrates thoughtful evolution in its Alert component:

1. **v2**: Production-ready with excellent DX, comprehensive features
2. **v3**: Strategic rewrite on Ark UI foundation improves reliability, accessibility, and cross-framework potential
3. **Composition patterns**: v3's dot notation and Content wrapper improve structure
4. **Theming system**: Migration from multi-style configs to recipes modernizes customization
5. **Accessibility**: v3's Ark UI foundation brings WAI-ARIA compliance and assistive technology testing
6. **Documentation**: Maintains high quality across both versions with clear migration paths

The component successfully balances developer experience, accessibility, and flexibility while evolving toward a more sustainable architecture.

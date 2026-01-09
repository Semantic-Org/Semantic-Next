# Chakra UI - Alert Usage Patterns

## Component URLs
- **v3**: https://chakra-ui.com/docs/components/alert
- **v2**: https://v2.chakra-ui.com/docs/components/alert
- **Status**: ✅ Both versions accessible

## Documentation Quality
Good - Both v2 and v3 documentation accessible with comprehensive API information, code examples, and theming documentation. v3 introduces significant compositional changes with new anatomy.

## Component Definition
- **Core purpose**: Communicates states that affect a system, feature, or page. Provides feedback mechanism for user notifications embedded inline within content flow.
- **Mental model**: A multipart, status-aware component that combines visual indicators (icons), semantic meaning (status), and flexible content areas. Functions as embedded notification distinct from overlays (Toast/Modal).
- **Semantic meaning**: Communicates feedback state (error, success, warning, info) with appropriate visual styling and iconography. Screen reader-announced through AlertTitle and AlertDescription.

## Version Differences

### v2 vs v3 Architecture

**v2 Structure (Simpler Composition)**:
```jsx
<Alert status="info">
  <AlertIcon />
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>
```

**v3 Structure (Namespaced Composition)**:
```jsx
<Alert.Root status="info">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Title</Alert.Title>
    <Alert.Description>Description</Alert.Description>
  </Alert.Content>
</Alert.Root>
```

**Key Changes**:
- **Namespaced components**: v3 uses `Alert.Root`, `Alert.Indicator`, `Alert.Content`, etc. (compound component pattern)
- **Content wrapper**: v3 introduces `Alert.Content` to group title and description
- **Indicator naming**: `AlertIcon` (v2) → `Alert.Indicator` (v3) - more semantic for loading states
- **ColorPalette prop**: v3 adds `colorPalette` for more flexible color overrides
- **Variant changes**: v3 uses `subtle | surface | outline | solid` vs v2's `subtle | solid | left-accent | top-accent`
- **Size prop**: v3 explicitly documents size prop (sm, md, lg, xl)

## Display Patterns

### Multi-Part Anatomy

**v2 Parts**:
- Container (main wrapper)
- Icon (status indicator)
- Title (heading)
- Description (body text)
- Spinner (loading state indicator)

**v3 Parts**:
- Root (main wrapper)
- Indicator (status icon or custom content)
- Content (wrapper for title/description)
- Title (heading)
- Description (body text)

### Layout Capabilities
| Pattern | Present | Details |
|---------|---------|---------|
| Flexbox composition | ✅ | Supports flexDirection, alignItems, justifyContent for custom layouts |
| Icon positioning | ✅ | Automatic left-aligned icon by default |
| Centered layouts | ✅ | Can center content vertically/horizontally using flex properties |
| Close button integration | ✅ | Composes with CloseButton for dismissible patterns |
| Custom content areas | ✅ | Full React/JSX content support in all sections |

## Content Patterns

| Pattern | Present | Details |
|---------|---------|---------|
| Title content | ✅ | AlertTitle (v2) / Alert.Title (v3) - screen reader announced |
| Description content | ✅ | AlertDescription (v2) / Alert.Description (v3) - screen reader announced |
| Icon support | ✅ | Status-based automatic icons or custom icons via Alert.Indicator |
| Loading spinner | ✅ | Can embed Spinner component in Alert.Indicator |
| Custom content | ✅ | ReactNode/JSX support across all content areas |
| Actions/buttons | ✅ | Can compose with Button, CloseButton, or custom actions |

## Behavior Patterns

### Status-Driven Styling
| Pattern | Present | Details |
|---------|---------|---------|
| Automatic icon mapping | ✅ | Status prop determines icon: info (i), success (✓), warning (⚠), error (×) |
| Color scheme mapping | ✅ | Status determines default color: info=blue, success=green, warning=orange, error=red |
| Accessibility roles | ✅ | addRole prop (v2) adds ARIA alert role when needed |
| Screen reader support | ✅ | Title and Description explicitly announced to screen readers |

### State Management
| Pattern | Present | Details |
|---------|---------|---------|
| Loading state | ✅ | status="loading" (v2) or custom Spinner in Alert.Indicator (v3) |
| Dismissible alerts | ✅ | Manual implementation with CloseButton + useDisclosure hook |
| Controlled visibility | ✅ | Parent manages visibility state, no built-in dismiss |
| Disabled state | ❌ | Not applicable - alerts are presentational feedback |

## Variant Patterns

### Status Variants (Both Versions)
| Status | Icon | Default Color | Purpose |
|--------|------|---------------|---------|
| info | Info icon (i) | Blue | Informational messages |
| success | Checkmark (✓) | Green | Success confirmations |
| warning | Warning icon (⚠) | Orange | Warnings and cautions |
| error | Error icon (×) | Red | Error messages |
| loading | Spinner (v2) | Blue | Loading/processing states |

### Visual Variants

**v2 Variants**:
| Variant | Description |
|---------|-------------|
| subtle | Soft background with colored text (default) |
| solid | Colored background with white text |
| left-accent | Subtle with left border accent |
| top-accent | Subtle with top border accent |

**v3 Variants**:
| Variant | Description |
|---------|-------------|
| subtle | Soft background with colored text (default) |
| solid | Colored background with white text |
| surface | Surface-level styling with contained appearance |
| outline | Border-based styling with transparent background |

### Size Options (v3)
| Size | Usage |
|------|-------|
| sm | Small, compact alerts |
| md | Default medium size |
| lg | Large alerts |
| xl | Extra-large alerts (can be extended via theme) |

### Color Customization
| Pattern | Present | Details |
|---------|---------|---------|
| colorScheme (v2) | ✅ | String-based color palette (e.g., "blue", "red", "teal") |
| colorPalette (v3) | ✅ | Overrides default status-based color scheme |
| Custom styles | ✅ | Direct style prop for border colors, widths, backgrounds |
| Design tokens | ✅ | References semantic tokens via colorPalette.solid, etc. |

## Code Examples

### Basic Alert (v2)
```jsx
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

// Simple alert with icon
<Alert status="error">
  <AlertIcon />
  <AlertTitle>Error!</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

// Different statuses
<Alert status="success">
  <AlertIcon />
  Success! Data uploaded.
</Alert>

<Alert status="warning">
  <AlertIcon />
  Warning! Your session is about to expire.
</Alert>

<Alert status="info">
  <AlertIcon />
  Info: Check your inbox for verification.
</Alert>

<Alert status="loading">
  <AlertIcon />
  Loading data...
</Alert>
```

### Basic Alert (v3)
```jsx
import { Alert } from "@chakra-ui/react"

// Simple alert with indicator
<Alert.Root status="info">
  <Alert.Indicator />
  <Alert.Title>This is an info alert</Alert.Title>
</Alert.Root>

// With description
<Alert.Root status="error">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Invalid Fields</Alert.Title>
    <Alert.Description>
      Your form has some errors. Please fix them and try again.
    </Alert.Description>
  </Alert.Content>
</Alert.Root>

// Different statuses
<Alert.Root status="success">
  <Alert.Indicator />
  <Alert.Title>Data uploaded to the server</Alert.Title>
</Alert.Root>

<Alert.Root status="warning">
  <Alert.Indicator />
  <Alert.Title>Heads up!</Alert.Title>
</Alert.Root>
```

### Visual Variants (v2)
```jsx
// Subtle (default)
<Alert status="info" variant="subtle">
  <AlertIcon />
  Subtle variant
</Alert>

// Solid
<Alert status="success" variant="solid">
  <AlertIcon />
  Solid variant with colored background
</Alert>

// Left accent
<Alert status="warning" variant="left-accent">
  <AlertIcon />
  Left accent border
</Alert>

// Top accent
<Alert status="error" variant="top-accent">
  <AlertIcon />
  Top accent border
</Alert>
```

### Visual Variants (v3)
```jsx
// Subtle (default)
<Alert.Root status="info" variant="subtle">
  <Alert.Indicator />
  <Alert.Title>Subtle variant</Alert.Title>
</Alert.Root>

// Solid
<Alert.Root status="success" variant="solid">
  <Alert.Indicator />
  <Alert.Title>Solid background variant</Alert.Title>
</Alert.Root>

// Surface
<Alert.Root status="warning" variant="surface">
  <Alert.Indicator />
  <Alert.Title>Surface variant</Alert.Title>
</Alert.Root>

// Outline
<Alert.Root status="error" variant="outline">
  <Alert.Indicator />
  <Alert.Title>Outline variant</Alert.Title>
</Alert.Root>
```

### Custom Colors (v2)
```jsx
// Custom color scheme
<Alert status="success" colorScheme="teal">
  <AlertIcon />
  Custom teal color scheme
</Alert>

// Custom styling
<Alert status="info" colorScheme="purple" variant="solid">
  <AlertIcon />
  Purple solid alert
</Alert>
```

### Custom Colors (v3)
```jsx
// Override default status color
<Alert.Root status="info" colorPalette="teal">
  <Alert.Indicator />
  <Alert.Title>Info alert with teal palette</Alert.Title>
</Alert.Root>

// Custom border styling
<Alert.Root
  status="success"
  borderStartWidth="3px"
  borderStartColor="colorPalette.600"
>
  <Alert.Indicator />
  <Alert.Title>Success with custom border</Alert.Title>
</Alert.Root>
```

### Loading State (v2)
```jsx
<Alert status="loading">
  <AlertIcon />
  <AlertTitle>Loading</AlertTitle>
  <AlertDescription>Please wait while we process your request.</AlertDescription>
</Alert>
```

### Loading State (v3)
```jsx
import { Alert, Spinner } from "@chakra-ui/react"

<Alert.Root borderStartWidth="3px" borderStartColor="colorPalette.600">
  <Alert.Indicator>
    <Spinner size="sm" />
  </Alert.Indicator>
  <Alert.Title>We are loading something</Alert.Title>
</Alert.Root>
```

### Custom Icons (v2)
```jsx
import { Alert, AlertIcon } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

<Alert status="warning">
  <WarningIcon w={4} h={4} />
  <AlertTitle>Custom icon</AlertTitle>
</Alert>
```

### Custom Icons (v3)
```jsx
import { Alert } from "@chakra-ui/react"
import { LuAlarmClockPlus } from "react-icons/lu"

<Alert.Root status="warning">
  <Alert.Indicator>
    <LuAlarmClockPlus />
  </Alert.Indicator>
  <Alert.Title>Submitting this form will delete your account</Alert.Title>
</Alert.Root>
```

### Dismissible Alert (v2)
```jsx
import { Alert, AlertIcon, CloseButton, useDisclosure } from '@chakra-ui/react'

function DismissibleAlert() {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  return isOpen ? (
    <Alert status="success">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Box>
      <CloseButton onClick={onClose} />
    </Alert>
  ) : null
}
```

### Dismissible Alert (v3)
```jsx
import { Alert, CloseButton } from "@chakra-ui/react"

<Alert.Root>
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Success!</Alert.Title>
    <Alert.Description>
      Your application has been received.
      We will review your application and respond within the next 48 hours.
    </Alert.Description>
  </Alert.Content>
  <CloseButton pos="relative" top="-2" insetEnd="-2" />
</Alert.Root>
```

### Centered Layout (v2)
```jsx
<Alert
  status="success"
  variant="subtle"
  flexDirection="column"
  alignItems="center"
  justifyContent="center"
  textAlign="center"
  height="200px"
>
  <AlertIcon boxSize="40px" mr={0} />
  <AlertTitle mt={4} mb={1} fontSize="lg">
    Application submitted!
  </AlertTitle>
  <AlertDescription maxWidth="sm">
    Thanks for submitting your application. Our team will get back to you soon.
  </AlertDescription>
</Alert>
```

### Centered Layout (v3)
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
  <Alert.Indicator boxSize="40px" mr={0} />
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

### Size Variants (v3)
```jsx
import { Stack, Alert } from "@chakra-ui/react"

<Stack gap="4">
  <Alert.Root size="sm" status="info">
    <Alert.Indicator />
    <Alert.Title>Small alert</Alert.Title>
  </Alert.Root>

  <Alert.Root size="md" status="success">
    <Alert.Indicator />
    <Alert.Title>Medium alert (default)</Alert.Title>
  </Alert.Root>

  <Alert.Root size="lg" status="warning">
    <Alert.Indicator />
    <Alert.Title>Large alert</Alert.Title>
  </Alert.Root>
</Stack>
```

### Compact Alert with Border (v3)
```jsx
<Alert.Root
  size="sm"
  borderStartWidth="3px"
  borderStartColor="colorPalette.solid"
  alignItems="center"
  status="success"
>
  <Alert.Title textStyle="sm">
    Heads up: Black Friday Sale (20% off)
  </Alert.Title>
</Alert.Root>
```

## API Reference

### v2 API

**Alert Component**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | "info" \| "warning" \| "success" \| "error" \| "loading" | "info" | Alert status determining icon and color |
| variant | "subtle" \| "solid" \| "left-accent" \| "top-accent" | "subtle" | Visual presentation style |
| colorScheme | string | "blue" | Color palette applied to alert |
| addRole | boolean | false | Whether to add ARIA alert role |
| size | string | — | Alert sizing |

**AlertIcon**
- No unique props - renders status-appropriate icon

**AlertTitle**
- Composes Box with no unique props - screen reader announced

**AlertDescription**
- Composes Box with no unique props - screen reader announced

### v3 API

**Alert.Root**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | "info" \| "warning" \| "success" \| "error" | "info" | Alert status determining icon and color |
| variant | "subtle" \| "solid" \| "surface" \| "outline" | "subtle" | Visual presentation style |
| colorPalette | string | "gray" (overridden by status) | Color palette - overrides status-based color |
| size | "sm" \| "md" \| "lg" \| "xl" | "md" | Alert size variant |

**Alert.Indicator**
- Accepts children (ReactNode) for custom icons or spinners
- Automatically renders status-appropriate icon if no children provided

**Alert.Content**
- Wrapper component for Alert.Title and Alert.Description
- No unique props

**Alert.Title**
- Screen reader announced title
- Supports textStyle and other text props

**Alert.Description**
- Screen reader announced description
- Supports textStyle and other text props

## Theming System

### v2 Theming

**Multipart Component Customization**:
```typescript
import { createMultiStyleConfigHelpers, definePartsStyle } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(['container', 'title', 'description', 'icon', 'spinner'])

// Custom variant
const customVariant = definePartsStyle({
  container: {
    borderRadius: 'full',
    border: '2px solid',
    borderColor: 'blue.500',
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    fontStyle: 'italic',
  },
})

// Define multi-style config
export const alertTheme = defineMultiStyleConfig({
  variants: { custom: customVariant },
})
```

**Parts**: container, title, description, icon, spinner

### v3 Theming

**Slot Recipe System**:
```typescript
import { defineSlotRecipe } from "@chakra-ui/react"
import { alertAnatomy } from "@chakra-ui/anatomy"

// Extending with new variant
const alertRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  variants: {
    shape: {
      rounded: {
        root: { borderRadius: 'full' },
      },
    },
  },
})

// Adding new size
const alertRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  sizes: {
    xl: {
      root: { fontSize: 'xl', p: 6 },
      indicator: { fontSize: '2xl' },
    },
  },
})
```

**Theme Configuration**:
- Recipes added to `theme.slotRecipes` object
- Uses `defineSlotRecipe` function
- Supports semantic tokens via `{token.reference}` syntax
- CLI scaffolding: `npx @chakra-ui/cli eject --outdir ./theme`

**Parts**: root, indicator, content, title, description

### Design Token Integration

**v2**:
- Uses color schemes from theme palette
- Direct style props for customization
- CSS custom properties for theming

**v3**:
- Semantic token references: `colorPalette.solid`, `colorPalette.600`
- Recipe-based customization system
- Token scaffolding via CLI
- Breakpoints, tokens, semanticTokens, textStyles, layerStyles integration

## Notable Features

### Status-Driven Architecture
- **Automatic icon mapping**: Each status automatically selects appropriate icon (info → i, success → ✓, warning → ⚠, error → ×)
- **Color automation**: Status determines default color scheme without manual configuration
- **Loading state**: v2 has dedicated loading status; v3 uses custom Spinner in Indicator
- **Semantic clarity**: Status prop provides clear mental model for feedback type

### Accessibility Features
- **Screen reader support**: AlertTitle and AlertDescription explicitly announced to assistive technologies
- **ARIA role**: Optional alert role via addRole prop (v2) or manual ARIA attributes (v3)
- **Semantic HTML**: Proper heading hierarchy and content structure
- **Keyboard navigation**: Works with CloseButton for dismissible patterns

### Composition Flexibility
- **Multipart anatomy**: Separate components for different content areas enable precise control
- **Content wrapper (v3)**: Alert.Content groups title/description for better layout management
- **Custom content**: Full ReactNode support allows any JSX content in any section
- **Layout control**: Flexbox properties enable vertical, horizontal, centered layouts
- **Action composition**: Easily compose with Button, CloseButton, Link components

### Color Customization
- **Status-based defaults**: Intelligent color mapping based on feedback type
- **Override capability**: colorScheme (v2) / colorPalette (v3) override status defaults
- **Design token integration**: v3 references semantic tokens for consistent theming
- **Custom styling**: Direct style prop for border colors, widths, backgrounds

### v3 Specific Enhancements
- **Compound component pattern**: Namespaced `Alert.*` components improve discoverability and organization
- **Recipe system**: Modern theming via slot recipes and design tokens
- **Size variants**: Explicit size prop with sm/md/lg/xl options
- **Variant evolution**: Replaces accent-based variants (left-accent, top-accent) with modern surface/outline
- **Content grouping**: Alert.Content wrapper provides better semantic structure
- **Indicator flexibility**: More semantic naming (Indicator vs Icon) reflects loading/custom content capability

### Loading State Implementation
- **v2**: Built-in `status="loading"` with automatic spinner icon
- **v3**: Manual Spinner component in Alert.Indicator for more control
- **Customization**: v3 approach allows custom loading animations and indicators
- **Size control**: Spinner size independently configurable (xs, sm, md, lg, xl)

### Dismissible Pattern
- **No built-in dismiss**: Component focuses on presentation, not state management
- **CloseButton composition**: Manual composition with CloseButton component
- **State management**: Uses useDisclosure hook or parent component state
- **Positioning control**: CloseButton positioned via Chakra layout props
- **Flexibility**: Allows custom dismiss logic and animations

### Theming Architecture
- **v2**: Multipart component with createMultiStyleConfigHelpers
- **v3**: Slot recipe system with defineSlotRecipe
- **Part-based customization**: Style each anatomical part independently
- **Variant extension**: Add custom variants without modifying core
- **Size extension**: Add custom sizes (e.g., xl) via theme
- **Dark mode support**: Built-in `_dark` selector in theme system
- **CLI tooling**: v3 provides scaffolding commands for theme generation

## Research Notes

### Documentation Access
- **v3 Documentation**: Successfully accessed at chakra-ui.com with comprehensive component examples
- **v2 Documentation**: Well-preserved at v2.chakra-ui.com with complete legacy API reference
- **Migration Guide**: Available at chakra-ui.com/docs/get-started/migration
- **Theming Docs**: Extensive recipe and semantic token documentation for v3
- **Community Resources**: Strong third-party tutorial ecosystem (I♥️Components, Horizon UI, etc.)

### Framework Approach Observations

**Component Evolution (v2 → v3)**:
- **Namespace adoption**: Shift to compound components improves API discoverability
- **Slot recipe system**: Modern theming architecture aligns with design token standards
- **Semantic refinement**: "Indicator" naming better reflects loading/custom content use cases
- **Content grouping**: Explicit Alert.Content wrapper improves accessibility and layout
- **Variant modernization**: Surface/outline variants replace directional accent variants
- **Breaking changes**: Composition pattern requires migration but provides better DX

**TypeScript Integration**:
- Comprehensive TypeScript support in both versions
- Type-safe prop definitions with string literal unions
- JSDoc annotations throughout codebase
- Exported anatomy definitions for theming

**Chakra UI Philosophy**:
- **Composability first**: Small, focused components that combine for complex UIs
- **Accessibility built-in**: Screen reader support, ARIA roles, semantic HTML
- **Flexible styling**: Multiple approaches (props, style, theme, recipes)
- **Status-driven design**: Semantic status prop drives visual presentation
- **Framework-agnostic patterns**: Uses standard React patterns, not framework-specific magic

**Design System Integration**:
- Strong design token foundation in v3
- Semantic tokens for contextual styling
- Color palette system with status mapping
- Recipe-based component customization
- CLI tooling for theme scaffolding
- Dark mode as first-class citizen

### Implementation Patterns

**Compositional Strategy**:
- Multi-part components with independent sub-components
- Optional parts (can omit Title, Description, Indicator)
- Flexible nesting (Alert.Content groups related parts)
- ReactNode children throughout for maximum flexibility

**Styling Architecture**:
- Status prop drives default styling
- Variant prop controls visual presentation
- Color prop overrides status-based colors
- Direct style prop for one-off customization
- Theme recipes for systematic customization
- Semantic token references in v3

**State Management**:
- Presentational component (no internal state)
- Dismissible pattern via parent state + CloseButton
- Loading state via status (v2) or custom Spinner (v3)
- No disabled state (not applicable for feedback)

**Accessibility Approach**:
- Semantic HTML structure
- Screen reader announcements for title/description
- Optional ARIA alert role
- Keyboard navigation support
- Color contrast considerations in variants

### Comparison Points for Semantic UI

**Strengths to Consider**:
- **Status-driven design**: Single prop controls icon + color + semantics
- **Multi-part anatomy**: Fine-grained control over component sections
- **Composition flexibility**: Easy to create custom layouts and content
- **Theming system**: Powerful recipe-based customization in v3
- **Accessibility focus**: Screen reader support, semantic HTML, ARIA roles
- **Loading state**: Both built-in (v2) and custom (v3) approaches work well
- **Color customization**: Override system with colorPalette/colorScheme
- **Size variants**: Explicit sizing options in v3
- **Design token integration**: v3 semantic tokens align with modern practices

**Potential Improvements**:
- **Built-in dismiss**: Could provide optional built-in close functionality
- **Action slots**: Explicit slot for actions/buttons would improve consistency
- **Icon customization**: More explicit API for custom icons per status
- **Animation support**: Built-in enter/exit animations for dismissible alerts
- **Compound variant API**: Combine status + variant in single prop
- **RTL support**: Document internationalization considerations

**Alignment with Web Standards**:
- React-specific (not web components)
- JSX composition pattern (not slots/custom elements)
- CSS-in-JS architecture (v2), recipe system (v3)
- Strong TypeScript integration
- Could benefit from custom element approach for framework independence
- Style prop pattern less standards-aligned than CSS parts/custom properties

**Migration Considerations**:
- v2 → v3 requires rewriting component composition
- Namespace change from flat to dotted (`Alert` → `Alert.Root`)
- Variant changes (accent-based → surface/outline)
- Loading status removed (use custom Spinner)
- API mostly compatible for basic use cases
- Theme system completely redesigned

### Cross-Framework Pattern Analysis

**Alert vs Message Terminology**:
- Chakra uses "Alert" for embedded feedback (aligns with MUI, Mantine, ShadCN)
- Distinct from Toast (overlay notifications)
- Similar to Ant Design "Message" but different implementation
- Comparable to PrimeReact "Message" component

**Composition Patterns**:
- Multi-part anatomy similar to Ant Design Divider (multiple sub-components)
- Status-driven styling similar to Ant Design Alert
- Custom icon pattern similar to Mantine Alert
- Dismissible pattern similar to ShadCN Alert with X button

**Variant Strategies**:
- Status variants (info/success/warning/error) are industry standard
- Visual variants evolved from accent-based to surface-based (v2 → v3)
- Size variants explicitly defined (sm/md/lg/xl)
- Color override via palette prop (flexible approach)

**Theming Evolution**:
- v2: Multi-style config (similar to Ant Design componentization)
- v3: Slot recipes (modern design token approach)
- Semantic tokens in v3 align with Radix Themes, ShadCN approaches
- Part-based styling similar to Mantine theme override system

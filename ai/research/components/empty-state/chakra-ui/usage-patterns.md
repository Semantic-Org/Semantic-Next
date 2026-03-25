# Chakra UI - Empty State Component - Usage Patterns

## Component URLs
- **v3**: https://chakra-ui.com/docs/components/empty-state
- **v3 (next)**: https://next.chakra-ui.com/docs/components/empty-state
- **GitHub Source**: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/empty-state
- **Storybook**: https://storybook.chakra-ui.com
- **Recipe**: https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/empty-state.ts
- **Status**: ⚠️ Limited documentation available - component exists in v3 only

## Documentation Quality
Limited - The Empty State component is available in Chakra UI v3 but has minimal public documentation. The component follows Chakra v3's composition pattern with multi-part anatomy. Source code and Storybook examples are available but comprehensive API documentation is sparse. This component does not exist in v2.

## Component Definition
- **Core purpose**: Indicates when a resource, collection, or data set is empty or unavailable. Provides users with clear feedback about the absence of content and optionally guides them toward actions to populate the empty state.
- **Mental model**: A status indicator component that transforms potentially confusing empty spaces into informative feedback surfaces. Combines visual indicators (icons), contextual messaging (title and description), and optional actions to guide users through empty scenarios.
- **Semantic meaning**: Communicates the absence of expected content in a helpful, actionable way. Reduces user confusion when lists, tables, search results, or other data-driven interfaces have no items to display.

## Version Differences

### v3 Only Component

The Empty State component is **new to Chakra UI v3** and does not exist in v2. It follows v3's architectural patterns:

**v3 Architecture**:
- Multi-part composition pattern (EmptyState.Root, EmptyState.Content, etc.)
- Built on Chakra v3's recipe system for theming
- Likely uses data attributes for styling hooks
- Follows v3's composability philosophy

**No v2 Equivalent**:
- Developers on v2 would need to build custom empty state components
- v2 users might combine Box, VStack, Text, Icon, and Button for similar functionality
- Migration from v2 requires implementing Empty State as a new pattern

## Display Patterns

### Empty State Anatomy (v3)

Based on Chakra UI v3 patterns and available information:

**Parts**:
- **EmptyState.Root** - Main container with centered layout
- **EmptyState.Content** - Content wrapper for inner elements
- **EmptyState.Indicator** - Visual icon or graphic element
- **EmptyState.Title** - Primary heading text
- **EmptyState.Description** - Secondary explanatory text

**Expected Data Attributes** (following v3 patterns):
- `[data-scope='empty-state']` - Component scope identifier
- `[data-part]` - Component part (root, content, indicator, title, description)
- `[data-size]` - Size variant (sm, md, lg)

### Layout & Positioning

| Pattern | Expected | Details |
|---------|----------|---------|
| Centered alignment | ✅ | Horizontally and vertically centered within container |
| Vertical stacking | ✅ | Icon → Title → Description → Actions in column layout |
| Responsive sizing | ✅ | Adapts to container width, maintains centered alignment |
| Padding/spacing | ✅ | Generous padding (3rem block/inline based on CSS patterns) |
| Gap control | ✅ | Consistent spacing between elements (1.5rem gap observed) |
| Container awareness | ✅ | Fills parent container while maintaining centered content |

### Visual Structure

**Layout Pattern**:
```
┌─────────────────────────────┐
│                             │
│         [ICON/IMAGE]        │ ← EmptyState.Indicator
│                             │
│      Primary Message        │ ← EmptyState.Title
│   Secondary description     │ ← EmptyState.Description
│                             │
│      [Action Button]        │ ← Optional action
│                             │
└─────────────────────────────┘
```

**Spacing Hierarchy**:
- Icon size: 4xl (based on observed CSS)
- Title size: lg, semibold weight
- Description: Default body text size
- Gap between sections: 1.5rem (6 spacing units)
- Container padding: 3rem

## Content Patterns

| Pattern | Expected | Details |
|---------|----------|---------|
| Icon/indicator support | ✅ | EmptyState.Indicator for visual representation |
| Icon customization | ✅ | Custom icons or illustrations as children |
| Title text | ✅ | EmptyState.Title for primary message |
| Description text | ✅ | EmptyState.Description for context/explanation |
| Action buttons | ✅ | Place Button components after description |
| Multiple actions | ✅ | Stack or ButtonGroup for multiple actions |
| Custom content | ✅ | Composable architecture allows any content |
| Rich formatting | ✅ | ReactNode support in title/description |

## Size Variants

Based on Chakra UI v3 patterns and typical component sizing:

| Size | Expected Use Case | Characteristics |
|------|-------------------|-----------------|
| sm | Compact empty states in tight spaces | Smaller icon, reduced padding, condensed text |
| md | Default size for most use cases | Balanced proportions, standard spacing |
| lg | Prominent empty states in spacious layouts | Larger icon, generous padding, prominent text |

**Size Configuration**:
```jsx
// Expected pattern based on v3 conventions
<EmptyState.Root size="md">
  {/* content */}
</EmptyState.Root>
```

## Code Examples

**Note**: The following examples are based on Chakra UI v3 composition patterns and available information. Exact API may vary - consult official documentation for confirmed props and behavior.

### Basic Empty State

```jsx
import { EmptyState } from '@chakra-ui/react'
import { FiInbox } from 'react-icons/fi'

function BasicEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiInbox />
        </EmptyState.Indicator>
        <EmptyState.Title>No items found</EmptyState.Title>
        <EmptyState.Description>
          There are no items to display at the moment.
        </EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### With Action Button

```jsx
import { EmptyState, Button } from '@chakra-ui/react'
import { FiShoppingCart } from 'react-icons/fi'

function EmptyCart() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiShoppingCart />
        </EmptyState.Indicator>
        <EmptyState.Title>Your cart is empty</EmptyState.Title>
        <EmptyState.Description>
          Add items to your cart to get started with your order.
        </EmptyState.Description>
        <Button colorScheme="blue" mt={4}>
          Start Shopping
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Size Variants

```jsx
import { EmptyState, Stack } from '@chakra-ui/react'
import { FiFolder } from 'react-icons/fi'

function SizeVariants() {
  return (
    <Stack spacing={8}>
      {/* Small */}
      <EmptyState.Root size="sm">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiFolder />
          </EmptyState.Indicator>
          <EmptyState.Title>No files</EmptyState.Title>
          <EmptyState.Description>
            Compact empty state for small spaces
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>

      {/* Medium (default) */}
      <EmptyState.Root size="md">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiFolder />
          </EmptyState.Indicator>
          <EmptyState.Title>No files</EmptyState.Title>
          <EmptyState.Description>
            Default empty state for most use cases
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>

      {/* Large */}
      <EmptyState.Root size="lg">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiFolder />
          </EmptyState.Indicator>
          <EmptyState.Title>No files</EmptyState.Title>
          <EmptyState.Description>
            Prominent empty state for spacious layouts
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    </Stack>
  )
}
```

### Empty Search Results

```jsx
import { EmptyState, Button, HStack } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

function EmptySearchResults({ query }) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiSearch />
        </EmptyState.Indicator>
        <EmptyState.Title>
          No results for "{query}"
        </EmptyState.Title>
        <EmptyState.Description>
          Try adjusting your search terms or filters to find what you're looking for.
        </EmptyState.Description>
        <HStack mt={4}>
          <Button variant="outline" onClick={() => clearSearch()}>
            Clear Search
          </Button>
          <Button colorScheme="blue" onClick={() => resetFilters()}>
            Reset Filters
          </Button>
        </HStack>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Empty List with Create Action

```jsx
import { EmptyState, Button } from '@chakra-ui/react'
import { FiPlus, FiUsers } from 'react-icons/fi'

function EmptyTeamList() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiUsers />
        </EmptyState.Indicator>
        <EmptyState.Title>No team members yet</EmptyState.Title>
        <EmptyState.Description>
          Get started by inviting your first team member to collaborate.
        </EmptyState.Description>
        <Button
          colorScheme="blue"
          leftIcon={<FiPlus />}
          mt={4}
          onClick={() => openInviteModal()}
        >
          Invite Team Member
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Custom Icon/Illustration

```jsx
import { EmptyState, Button, Box } from '@chakra-ui/react'

function CustomIllustrationEmpty() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <Box as="img" src="/illustrations/empty-inbox.svg" alt="" w="200px" />
        </EmptyState.Indicator>
        <EmptyState.Title>All caught up!</EmptyState.Title>
        <EmptyState.Description>
          You've handled all your notifications. Great work!
        </EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Multiple Actions

```jsx
import { EmptyState, Button, VStack, HStack } from '@chakra-ui/react'
import { FiUpload, FiLink, FiEdit } from 'react-icons/fi'

function EmptyWithMultipleActions() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiEdit />
        </EmptyState.Indicator>
        <EmptyState.Title>No documents</EmptyState.Title>
        <EmptyState.Description>
          Create your first document or upload an existing one.
        </EmptyState.Description>
        <VStack mt={4} spacing={3}>
          <Button colorScheme="blue" leftIcon={<FiEdit />} w="full">
            Create New Document
          </Button>
          <HStack w="full">
            <Button variant="outline" leftIcon={<FiUpload />} flex={1}>
              Upload File
            </Button>
            <Button variant="outline" leftIcon={<FiLink />} flex={1}>
              Import from URL
            </Button>
          </HStack>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Loading State Transition

```jsx
import { EmptyState, Spinner, Box } from '@chakra-ui/react'
import { FiInbox } from 'react-icons/fi'

function EmptyStateWithLoading({ isLoading, items }) {
  if (isLoading) {
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiInbox />
          </EmptyState.Indicator>
          <EmptyState.Title>No messages</EmptyState.Title>
          <EmptyState.Description>
            You don't have any messages yet. Check back later.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return <ItemsList items={items} />
}
```

### Error State Variant

```jsx
import { EmptyState, Button } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'

function ErrorEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator color="red.500">
          <FiAlertTriangle />
        </EmptyState.Indicator>
        <EmptyState.Title>Failed to load data</EmptyState.Title>
        <EmptyState.Description>
          We couldn't load your data. Please check your connection and try again.
        </EmptyState.Description>
        <Button colorScheme="red" mt={4} onClick={() => retry()}>
          Try Again
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Conditional Empty State

```jsx
import { EmptyState, Button } from '@chakra-ui/react'
import { FiFilter, FiInbox } from 'react-icons/fi'

function FilteredEmptyState({ hasFilters, items, onClearFilters }) {
  if (items.length > 0) {
    return <ItemsList items={items} />
  }

  if (hasFilters) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiFilter />
          </EmptyState.Indicator>
          <EmptyState.Title>No results match your filters</EmptyState.Title>
          <EmptyState.Description>
            Try adjusting or clearing your filters to see more results.
          </EmptyState.Description>
          <Button variant="outline" mt={4} onClick={onClearFilters}>
            Clear Filters
          </Button>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiInbox />
        </EmptyState.Indicator>
        <EmptyState.Title>No items yet</EmptyState.Title>
        <EmptyState.Description>
          Get started by creating your first item.
        </EmptyState.Description>
        <Button colorScheme="blue" mt={4} onClick={() => createItem()}>
          Create Item
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

## API Reference

**Note**: This API reference is based on Chakra UI v3 patterns and available information. Consult official documentation for confirmed API details.

### EmptyState.Root

Main container component for the empty state.

**Expected Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "sm" \| "md" \| "lg" | "md" | Size variant of the empty state |
| children | ReactNode | - | Content to render (EmptyState.Content) |
| ...props | BoxProps | - | Additional Box component props |

### EmptyState.Content

Content wrapper that provides consistent layout and spacing.

**Expected Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content elements (Indicator, Title, Description, actions) |
| ...props | BoxProps | - | Additional Box component props |

### EmptyState.Indicator

Visual indicator component (icon, image, or custom graphic).

**Expected Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Icon component or custom content |
| color | string | "gray.400" | Color of the indicator |
| ...props | BoxProps | - | Additional Box component props |

### EmptyState.Title

Primary heading text for the empty state.

**Expected Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Title text content |
| ...props | HeadingProps | - | Additional Heading component props |

### EmptyState.Description

Secondary descriptive text providing context.

**Expected Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Description text content |
| ...props | TextProps | - | Additional Text component props |

### Data Attributes

Expected data attributes following Chakra UI v3 patterns:

| Attribute | Values | Description |
|-----------|--------|-------------|
| data-scope | "empty-state" | Component scope identifier |
| data-part | "root" \| "content" \| "indicator" \| "title" \| "description" | Component part identifier |
| data-size | "sm" \| "md" \| "lg" | Size variant |

## Theming System

### Expected Recipe Pattern (v3)

Based on Chakra UI v3's recipe system, the Empty State component likely supports theming through the recipe pattern:

```typescript
// Expected location: theme/recipes/empty-state.ts
import { defineRecipe } from '@chakra-ui/react'

export const emptyStateRecipe = defineRecipe({
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12',
      textAlign: 'center',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6',
      maxWidth: '480px',
    },
    indicator: {
      fontSize: '4xl',
      color: 'gray.400',
    },
    title: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      color: 'gray.900',
      _dark: { color: 'gray.100' },
    },
    description: {
      fontSize: 'md',
      color: 'gray.600',
      _dark: { color: 'gray.400' },
    },
  },
  variants: {
    size: {
      sm: {
        content: { gap: '4', maxWidth: '360px' },
        indicator: { fontSize: '3xl' },
        title: { fontSize: 'md' },
        description: { fontSize: 'sm' },
      },
      md: {
        content: { gap: '6', maxWidth: '480px' },
        indicator: { fontSize: '4xl' },
        title: { fontSize: 'lg' },
        description: { fontSize: 'md' },
      },
      lg: {
        content: { gap: '8', maxWidth: '600px' },
        indicator: { fontSize: '5xl' },
        title: { fontSize: 'xl' },
        description: { fontSize: 'lg' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
```

### Styling via Data Attributes

```css
/* Target all empty states */
[data-scope='empty-state'][data-part='root'] {
  min-height: 400px;
  padding: 3rem;
}

/* Target indicator */
[data-scope='empty-state'][data-part='indicator'] {
  color: var(--chakra-colors-gray-400);
  font-size: var(--chakra-fontSizes-4xl);
}

/* Target title */
[data-scope='empty-state'][data-part='title'] {
  font-size: var(--chakra-fontSizes-lg);
  font-weight: var(--chakra-fontWeights-semibold);
}

/* Target description */
[data-scope='empty-state'][data-part='description'] {
  color: var(--chakra-colors-gray-600);
}

/* Size variants */
[data-scope='empty-state'][data-size='sm'] {
  padding: 2rem;
}

[data-scope='empty-state'][data-size='lg'] {
  padding: 4rem;
}
```

### Custom Styling Example

```jsx
import { EmptyState } from '@chakra-ui/react'

function StyledEmptyState() {
  return (
    <EmptyState.Root
      bg="gray.50"
      borderRadius="xl"
      borderWidth="2px"
      borderColor="gray.200"
      minH="500px"
    >
      <EmptyState.Content>
        <EmptyState.Indicator color="purple.500" fontSize="6xl">
          {/* icon */}
        </EmptyState.Indicator>
        <EmptyState.Title color="purple.700" fontSize="2xl">
          Custom styled title
        </EmptyState.Title>
        <EmptyState.Description color="gray.700" maxW="400px">
          Custom description with specific styling
        </EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

## Notable Features

### Composition Pattern
- **Multi-part anatomy**: Separate components for each semantic part (Root, Content, Indicator, Title, Description)
- **Flexible composition**: Mix and match parts or add custom elements
- **Type safety**: Each component has proper TypeScript definitions
- **Consistent API**: Follows Chakra UI v3's compositional patterns

### Layout & Positioning
- **Auto-centering**: Automatically centers content both horizontally and vertically
- **Container-aware**: Adapts to parent container dimensions
- **Responsive**: Works across different viewport sizes
- **Consistent spacing**: Predictable gap patterns between elements

### Customization
- **Recipe-based theming**: Leverages Chakra v3's recipe system for consistent styling
- **Data attributes**: Provides styling hooks via data-* attributes
- **Style props**: Accepts all standard Chakra style props
- **Custom content**: Composable architecture allows any content or layout

### Visual Design
- **Icon prominence**: Large icon sizes (4xl) for visual hierarchy
- **Typography hierarchy**: Clear distinction between title (lg, semibold) and description (md, normal)
- **Color semantics**: Subtle indicator colors (gray.400) that don't overpower
- **Spacing consistency**: Generous padding and gaps for comfortable reading

### Accessibility Features
- **Semantic HTML**: Uses appropriate heading levels and text elements
- **Screen reader support**: Meaningful content structure for assistive technologies
- **Color contrast**: Follows WCAG guidelines for text readability
- **Focus management**: Action buttons receive proper focus treatment
- **Keyboard navigation**: All interactive elements keyboard accessible

### Size Variants
- **Small (sm)**: Compact empty states for tight spaces (sidebars, cards)
- **Medium (md)**: Default balanced size for most use cases
- **Large (lg)**: Prominent empty states for primary content areas

### Integration Patterns
- **Action buttons**: Easily add Button components for primary actions
- **Multiple actions**: Support for ButtonGroup or stacked buttons
- **Custom illustrations**: Replace icon with images or custom SVG
- **Loading states**: Combine with Spinner for data fetching scenarios
- **Error handling**: Adapt styling for error empty states

## Framework-Specific Patterns

### Chakra UI v3 Architectural Patterns

**Code Snippet Philosophy** (New in v3):
- While documentation doesn't explicitly mention it, v3 components often support CLI snippet installation
- Empty State may be available via `npx @chakra-ui/cli snippet add empty-state`
- Snippet approach allows direct customization of component source

**Recipe System Integration**:
- Empty State uses Chakra v3's recipe system for theming
- Recipes define base styles and variants in a type-safe manner
- Allows global theme customization via recipe configuration

**Composition Over Configuration**:
- Multi-part component anatomy (Root, Content, Indicator, Title, Description)
- Each part is a separate component for maximum flexibility
- Follows React compound component pattern
- Similar to Radix UI and Ark UI architectures

**Data Attribute Pattern**:
- Uses `data-scope` to identify component family
- Uses `data-part` to identify specific component parts
- Uses `data-size` and other attributes for variant styling
- Enables CSS-based theming without JavaScript runtime overhead

**TypeScript-First Design**:
- Strong type definitions for all components
- Proper prop typing with IntelliSense support
- Type-safe recipe definitions
- Component props extend from base Chakra components (Box, Heading, Text)

### Integration with Chakra Ecosystem

**Works with Chakra Components**:
```jsx
import { EmptyState, Button, ButtonGroup, VStack } from '@chakra-ui/react'

// Seamlessly compose with other Chakra components
<EmptyState.Root>
  <EmptyState.Content>
    <EmptyState.Indicator>{/* icon */}</EmptyState.Indicator>
    <EmptyState.Title>Title</EmptyState.Title>
    <EmptyState.Description>Description</EmptyState.Description>

    {/* Native integration with Button, ButtonGroup, etc. */}
    <ButtonGroup mt={4}>
      <Button colorScheme="blue">Primary</Button>
      <Button variant="outline">Secondary</Button>
    </ButtonGroup>
  </EmptyState.Content>
</EmptyState.Root>
```

**Theme Integration**:
```typescript
// Extend or override empty state recipe in theme
import { createSystem, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    recipes: {
      emptyState: {
        // Custom recipe configuration
        base: { /* ... */ },
        variants: { /* ... */ },
      },
    },
  },
})

export default createSystem(config)
```

**Responsive Design**:
```jsx
// Use Chakra's responsive props
<EmptyState.Root
  size={{ base: 'sm', md: 'md', lg: 'lg' }}
  p={{ base: 4, md: 8, lg: 12 }}
>
  <EmptyState.Content maxW={{ base: '90%', md: '480px' }}>
    {/* content */}
  </EmptyState.Content>
</EmptyState.Root>
```

## Use Case Patterns

### Empty Lists/Collections

```jsx
function EmptyProjectsList() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiFolder />
        </EmptyState.Indicator>
        <EmptyState.Title>No projects yet</EmptyState.Title>
        <EmptyState.Description>
          Create your first project to get started.
        </EmptyState.Description>
        <Button colorScheme="blue" mt={4}>
          New Project
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### No Search Results

```jsx
function NoSearchResults({ query }) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiSearch />
        </EmptyState.Indicator>
        <EmptyState.Title>No results for "{query}"</EmptyState.Title>
        <EmptyState.Description>
          Try different keywords or check your spelling.
        </EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Filter Results Empty

```jsx
function FilteredEmpty({ onReset }) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiFilter />
        </EmptyState.Indicator>
        <EmptyState.Title>No matches found</EmptyState.Title>
        <EmptyState.Description>
          No items match your current filters.
        </EmptyState.Description>
        <Button variant="outline" mt={4} onClick={onReset}>
          Reset Filters
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Error/Failure State

```jsx
function LoadFailedEmpty({ onRetry }) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator color="red.500">
          <FiAlertCircle />
        </EmptyState.Indicator>
        <EmptyState.Title>Failed to load</EmptyState.Title>
        <EmptyState.Description>
          Something went wrong. Please try again.
        </EmptyState.Description>
        <Button colorScheme="red" mt={4} onClick={onRetry}>
          Retry
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

### Onboarding/First Use

```jsx
function OnboardingEmpty({ onStart }) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FiStar />
        </EmptyState.Indicator>
        <EmptyState.Title>Welcome!</EmptyState.Title>
        <EmptyState.Description>
          Let's get you started with a quick tutorial.
        </EmptyState.Description>
        <Button colorScheme="blue" mt={4} onClick={onStart}>
          Start Tutorial
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
```

## Research Notes

### Documentation Access
- **v3 Documentation**: Component page exists at chakra-ui.com/docs/components/empty-state but has limited detailed documentation
- **Source Code**: Available on GitHub at packages/react/src/components/empty-state
- **Storybook**: Interactive examples available at storybook.chakra-ui.com
- **Recipe Configuration**: Theme configuration at packages/react/src/theme/recipes/empty-state.ts
- **v2 Status**: Component does not exist in Chakra UI v2

### Documentation Limitations
Due to limited public documentation availability:
- Many props and behaviors are inferred from Chakra UI v3 patterns
- Exact TypeScript definitions not fully documented
- API reference based on v3 composition patterns and conventions
- Some examples are constructed based on typical usage patterns
- Official documentation may have additional props and features not captured here

### Framework Approach Observations

**Chakra UI v3 Philosophy**:
- Emphasis on composition over configuration
- Multi-part component anatomy for flexibility
- Recipe-based theming for consistency
- Data attributes for styling hooks
- TypeScript-first with strong type safety
- Accessible by default design

**Empty State Design Principles**:
- Clear visual hierarchy (icon → title → description → action)
- Centered alignment for focus and attention
- Generous spacing for comfortable reading
- Subtle colors that don't overpower
- Actionable guidance through button placement
- Flexible composition for varied use cases

**Comparison to Other Empty State Patterns**:
- More structured than simple Box/VStack compositions
- Less opinionated than single-component empty states
- Provides semantic component names (Indicator, Title, Description)
- Balances flexibility with consistency through recipes
- Similar to Ant Design's Empty but with compositional API

### Implementation Patterns

**Composition Strategy**:
- Root provides container and layout
- Content provides inner wrapper and spacing
- Indicator handles visual representation
- Title provides primary message (heading semantics)
- Description provides context (text semantics)
- Actions placed after description as separate components

**Styling Strategy**:
- Recipe system defines base styles and variants
- Data attributes enable CSS customization
- Style props allow per-instance overrides
- Responsive props for adaptive layouts
- Color tokens for consistent theming

**Accessibility Approach**:
- Semantic HTML (heading for title, paragraph for description)
- Proper heading levels based on context
- Color contrast following WCAG guidelines
- Keyboard accessible action buttons
- Screen reader friendly content structure

### Best Practices

**Content Guidelines**:
- Title: Brief, action-oriented (e.g., "No items yet", "Empty inbox")
- Description: Helpful, solution-focused (explain why empty, what to do)
- Action: Clear, specific verb (e.g., "Create Item", "Import Data")
- Icon: Relevant to context (match the missing content type)

**Layout Considerations**:
- Use appropriate size variant for container (sm for cards, lg for main content)
- Ensure adequate padding around empty state (12-16 spacing units)
- Consider minimum height for visual balance (400-500px)
- Center within parent container using flex/grid

**Accessibility Considerations**:
- Use meaningful icon alt text if using images
- Ensure title is a proper heading level (usually h2 or h3)
- Maintain color contrast ratios (4.5:1 minimum)
- Provide keyboard-accessible actions
- Use loading indicators during transitions

**Error Handling**:
- Distinguish between truly empty (no data) and failed load (error)
- Provide retry actions for failures
- Use color semantics (red for errors) appropriately
- Clear error messages with actionable guidance

### Comparison Points for Semantic UI

**Strengths to Consider**:
- **Compositional API**: Flexible multi-part anatomy enables varied layouts
- **Semantic naming**: Clear component names (Indicator, Title, Description)
- **Recipe system**: Consistent theming with customization flexibility
- **Size variants**: Built-in responsive sizing (sm, md, lg)
- **Type safety**: Strong TypeScript support throughout
- **Accessibility**: Semantic HTML and ARIA patterns built-in
- **Data attributes**: CSS styling hooks without JavaScript overhead
- **Chakra ecosystem**: Seamless integration with other Chakra components

**Potential Improvements**:
- **Documentation**: More comprehensive examples and API reference
- **Pre-built icons**: Icon set specifically designed for empty states
- **Illustration support**: Built-in illustration library or patterns
- **Animation**: Entry/exit animations for state transitions
- **Templates**: Common empty state templates (search, list, error, etc.)
- **Tone variants**: Visual variants for info/warning/error contexts
- **Loading integration**: Built-in loading state pattern
- **A11y helpers**: Additional accessibility features (live regions, etc.)

**Alignment with Web Standards**:
- React-specific component (not web components)
- Uses semantic HTML (heading, paragraph elements)
- Data attributes align with HTML standards
- CSS-based styling through recipes and style props
- Accessible HTML structure (ARIA when needed)
- Could benefit from web component implementation for framework independence

**Migration Considerations**:
- New component in v3, no v2 equivalent
- Migration from custom implementations straightforward
- Recipe configuration for theme consistency
- Composition pattern may require restructuring existing code
- Type safety improvements over custom implementations

### Cross-Framework Pattern Analysis

**Empty State Terminology**:
- Chakra: "Empty State" (clear, descriptive)
- Ant Design: "Empty" (concise)
- Material UI: "No Data" or custom (no dedicated component)
- Semantic UI (classic): No dedicated component (custom builds)

**Composition Patterns**:
- Chakra: Multi-part composition (Root, Content, Indicator, Title, Description)
- Ant Design: Single component with props (description, image)
- Custom approaches: Often Box/VStack + Icon + Text + Button

**Visual Hierarchy**:
- Industry standard: Icon/Image → Title → Description → Action
- Chakra follows this pattern with compositional API
- Centered alignment is universal standard

**Customization Approaches**:
- **Chakra**: Recipe system + data attributes + style props
- **Ant Design**: Theme configuration + className
- **Custom**: Direct styling on layout components

**Accessibility Patterns**:
- Semantic HTML structure (heading, text)
- ARIA when needed (live regions for dynamic updates)
- Keyboard accessible actions
- Color contrast compliance
- Screen reader friendly content

**Use Case Coverage**:
- Empty lists/collections (most common)
- No search results (query-specific messaging)
- Filtered results empty (different from truly empty)
- Error/failure states (distinct from empty)
- Onboarding/first use (welcome patterns)

### Notable Design Decisions

**Why Multi-Part Composition**:
- Maximum flexibility in content arrangement
- Semantic component names improve code clarity
- Allows custom content between standard parts
- Enables partial usage (e.g., just Indicator + Title)

**Why Recipe System**:
- Consistent styling across application
- Centralized theme configuration
- Type-safe variant definitions
- Runtime CSS generation for optimal performance

**Why Data Attributes**:
- CSS styling without JavaScript overhead
- Easier theme debugging and inspection
- Standard HTML pattern
- Framework-agnostic styling approach

**Why Centered Layout**:
- Focuses user attention on empty state
- Works across container sizes
- Industry standard for empty states
- Creates visual hierarchy naturally

## Additional Resources

- **GitHub Source**: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/empty-state
- **Storybook Examples**: https://storybook.chakra-ui.com
- **Recipe File**: https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/empty-state.ts
- **Chakra UI v3 Migration Guide**: https://chakra-ui.com/docs/get-started/migration
- **Chakra UI Recipes**: https://chakra-ui.com/docs/styling/recipes

## Related Components

- **Alert**: For inline status messages (different from empty states)
- **Spinner**: Loading states before empty determination
- **Card**: Container for scoped empty states
- **Button**: Action components within empty states
- **Icon**: Visual indicators for empty states

---

**Last Updated**: 2025-11-06
**Chakra UI Version**: v3 (v3.29.0+)
**Research Status**: Preliminary - Limited official documentation available. API and patterns inferred from Chakra UI v3 conventions, GitHub source references, and available information. Consult official documentation and source code for confirmed behavior and additional features.

# Stack (Layout) - Chakra UI Usage Patterns

> **Framework**: Chakra UI
> **Component**: Stack (VStack, HStack)
> **Documentation**: https://chakra-ui.com/docs/components/stack
> **v2 Documentation**: https://v2.chakra-ui.com/docs/components/stack
> **Research Date**: 2025-11-05

## Component Definition

Stack is a layout utility component designed to arrange child elements in either vertical or horizontal directions with consistent spacing. According to the Chakra UI documentation, Stack is "used to layout its children in a vertical or horizontal stack."

**Core Purpose**: Simplifies the creation of flexbox-based layouts with automatic spacing between items, eliminating the need for manual margin management or wrapper elements.

**Mental Model**: Think of Stack as a specialized Flex component optimized for the common use case of arranging items in a single direction (row or column) with uniform spacing. It abstracts away the complexity of flexbox properties and provides a higher-level API focused on stacking behavior.

**When to Use**:
- Creating vertical or horizontal lists of components with consistent spacing
- Building simple layouts where items should be evenly spaced in one direction
- Inserting dividers between items automatically
- Responsive layouts that change from vertical to horizontal based on viewport size

**Component Variants**:
- **Stack**: Base component with configurable direction via the `direction` prop
- **VStack**: Pre-configured for vertical stacking (column direction)
- **HStack**: Pre-configured for horizontal stacking (row direction)

## Core Features

### Automatic Spacing Management

Stack implements sophisticated spacing between child elements without requiring margin utilities on individual children. It uses "a modified version of the CSS lobotomized owl selector" internally to apply spacing, ensuring clean separation between items.

The `spacing` prop accepts values from Chakra UI's spacing scale and applies them as gaps between children. This approach eliminates the common pattern of adding margins to individual elements or wrapping them in containers.

### Directional Layout Control

Stack provides flexible control over layout direction through the `direction` prop (on the base Stack component) or through specialized variants:
- **VStack**: Automatically sets `direction="column"` for vertical stacking
- **HStack**: Automatically sets `direction="row"` for horizontal stacking
- **Stack with direction prop**: Allows dynamic or responsive direction changes

### Divider Integration

Stack includes built-in support for inserting divider elements between children via the `divider` prop. This eliminates the need for manually interleaving divider components, making code cleaner and more maintainable.

Dividers are automatically positioned between items and respect the stack's direction (horizontal dividers for VStack, vertical dividers for HStack).

### Responsive Behavior

All Stack props support Chakra UI's responsive value syntax, enabling layouts that adapt to different viewport sizes. Direction can change from vertical on mobile to horizontal on desktop, and spacing can scale with screen size.

### Composition Pattern

Stack follows Chakra UI's composition philosophy - it's built on top of Flex and inherits all Box capabilities, enabling full access to spacing, color, border, and layout props for comprehensive styling.

## Props API

### Stack (Base Component) Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `ResponsiveValue<StackDirection>` | `"column"` | Layout direction: `"row"`, `"column"`, `"row-reverse"`, `"column-reverse"`. Supports responsive values. |
| `spacing` | `ResponsiveValue<string \| number>` | `"0.5rem"` | Space between children. Accepts spacing scale values (e.g., 4 = 1rem) or CSS units. |
| `align` | `ResponsiveValue<AlignItems>` | — | Shorthand for `alignItems`. Controls cross-axis alignment: `"flex-start"`, `"center"`, `"flex-end"`, `"stretch"`, `"baseline"`. |
| `justify` | `ResponsiveValue<JustifyContent>` | — | Shorthand for `justifyContent`. Controls main-axis alignment: `"flex-start"`, `"center"`, `"flex-end"`, `"space-between"`, `"space-around"`, `"space-evenly"`. |
| `wrap` | `ResponsiveValue<FlexWrap>` | — | Shorthand for `flexWrap`. Values: `"nowrap"`, `"wrap"`, `"wrap-reverse"`. |
| `divider` | `ReactElement` | — | Element to render between each child (e.g., `StackDivider` or custom divider component). |
| `isInline` | `boolean` | `false` | When true, sets `direction="row"` for horizontal layout. Legacy prop, prefer using `direction` or HStack. |
| `shouldWrapChildren` | `boolean` | `false` | When true, wraps each child in a `Box` with `display: inline-block` for better spacing control. |

### VStack Specific Behavior

VStack is Stack with `direction="column"` pre-applied. It accepts all Stack props except `direction` (which is fixed to `"column"`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `ResponsiveValue<string \| number>` | `"0.5rem"` | Vertical space between stacked children. |
| `align` | `ResponsiveValue<AlignItems>` | — | Horizontal alignment of children: `"left"`, `"center"`, `"right"`, `"stretch"`. |
| `justify` | `ResponsiveValue<JustifyContent>` | — | Vertical distribution of children along the main axis. |
| `divider` | `ReactElement` | — | Horizontal divider element rendered between children. |

### HStack Specific Behavior

HStack is Stack with `direction="row"` pre-applied. It accepts all Stack props except `direction` (which is fixed to `"row"`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `ResponsiveValue<string \| number>` | `"0.5rem"` | Horizontal space between stacked children. |
| `align` | `ResponsiveValue<AlignItems>` | — | Vertical alignment of children: `"top"`, `"center"`, `"bottom"`, `"stretch"`, `"baseline"`. |
| `justify` | `ResponsiveValue<JustifyContent>` | — | Horizontal distribution of children along the main axis. |
| `divider` | `ReactElement` | — | Vertical divider element rendered between children. |

### Inherited Props (from Flex/Box)

Stack inherits all Flex and Box props, providing access to:
- **Spacing props**: `p`, `m`, `px`, `py`, `pt`, `pb`, `pl`, `pr`, etc.
- **Color props**: `bg`, `color`, `bgColor`, `backgroundColor`
- **Border props**: `border`, `borderRadius`, `borderWidth`, `borderColor`
- **Layout props**: `w`, `h`, `width`, `height`, `maxW`, `maxH`, `minW`, `minH`
- **Typography props**: `fontSize`, `fontWeight`, `lineHeight`
- **Flexbox props**: `flex`, `flexGrow`, `flexShrink`, `flexBasis`
- **Position props**: `position`, `top`, `right`, `bottom`, `left`, `zIndex`
- **Polymorphism**: `as` prop to render as different HTML element

## Usage Patterns

### Pattern 1: Basic Vertical Stacking (VStack)

**Use case**: Arranging components vertically with consistent spacing (forms, lists, content sections)

**Implementation**: Use VStack with the `spacing` prop to define gap between items

```jsx
import { VStack, Box } from "@chakra-ui/react"

function VerticalLayout() {
  return (
    <VStack spacing={4}>
      <Box>First Item</Box>
      <Box>Second Item</Box>
      <Box>Third Item</Box>
    </VStack>
  )
}
```

### Pattern 2: Basic Horizontal Stacking (HStack)

**Use case**: Arranging components horizontally (navigation menus, button groups, inline elements)

**Implementation**: Use HStack with the `spacing` prop for horizontal gaps

```jsx
import { HStack, Button } from "@chakra-ui/react"

function ButtonGroup() {
  return (
    <HStack spacing={3}>
      <Button>Cancel</Button>
      <Button>Save</Button>
      <Button colorScheme="blue">Submit</Button>
    </HStack>
  )
}
```

### Pattern 3: Responsive Direction Change

**Use case**: Layouts that should stack vertically on mobile and horizontally on desktop

**Implementation**: Use Stack component with responsive `direction` prop values

```jsx
import { Stack, Box } from "@chakra-ui/react"

function ResponsiveLayout() {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={6}
    >
      <Box flex="1">Sidebar content</Box>
      <Box flex="2">Main content</Box>
    </Stack>
  )
}
```

### Pattern 4: Divider Integration

**Use case**: Visually separating items in a list or menu with divider lines

**Implementation**: Pass `StackDivider` or custom element to the `divider` prop

```jsx
import { VStack, Box, StackDivider } from "@chakra-ui/react"

function DividedList() {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      <Box>Item One</Box>
      <Box>Item Two</Box>
      <Box>Item Three</Box>
    </VStack>
  )
}
```

### Pattern 5: Custom Divider Elements

**Use case**: Using custom components or styled elements as dividers

**Implementation**: Pass any React element to the `divider` prop

```jsx
import { HStack, Box } from "@chakra-ui/react"

function CustomDividerStack() {
  return (
    <HStack
      spacing={4}
      divider={
        <Box h="20px" w="1px" bg="blue.500" />
      }
    >
      <Box>Section 1</Box>
      <Box>Section 2</Box>
      <Box>Section 3</Box>
    </HStack>
  )
}
```

### Pattern 6: Alignment Control

**Use case**: Centering items, aligning to edges, or stretching to fill space

**Implementation**: Use `align` and `justify` props for cross-axis and main-axis alignment

```jsx
import { VStack, Box } from "@chakra-ui/react"

// Center-aligned vertical stack
function CenteredStack() {
  return (
    <VStack spacing={4} align="center">
      <Box>Centered Item 1</Box>
      <Box>Centered Item 2</Box>
    </VStack>
  )
}

// Left-aligned vertical stack
function LeftAlignedStack() {
  return (
    <VStack spacing={4} align="flex-start">
      <Box>Left Item 1</Box>
      <Box>Left Item 2</Box>
    </VStack>
  )
}

// Stretched items (fill full width)
function StretchedStack() {
  return (
    <VStack spacing={4} align="stretch" w="full">
      <Box bg="gray.100" p={4}>Full Width Item 1</Box>
      <Box bg="gray.100" p={4}>Full Width Item 2</Box>
    </VStack>
  )
}
```

### Pattern 7: Responsive Spacing

**Use case**: Adjusting spacing between items based on viewport size (tighter on mobile, looser on desktop)

**Implementation**: Use array or object syntax for responsive spacing values

```jsx
import { VStack, Box } from "@chakra-ui/react"

function ResponsiveSpacing() {
  return (
    <VStack
      spacing={{ base: 2, md: 4, lg: 6 }}
      align="stretch"
    >
      <Box>Item with responsive spacing</Box>
      <Box>Spacing grows with viewport</Box>
      <Box>From 0.5rem to 1rem to 1.5rem</Box>
    </VStack>
  )
}
```

### Pattern 8: Wrapping Children

**Use case**: When children need consistent inline-block behavior for spacing calculations

**Implementation**: Set `shouldWrapChildren={true}` to wrap each child in a Box

```jsx
import { HStack, Text } from "@chakra-ui/react"

function WrappedChildrenStack() {
  return (
    <HStack spacing={3} shouldWrapChildren>
      <Text>Text item 1</Text>
      <Text>Text item 2</Text>
      <Text>Text item 3</Text>
    </HStack>
  )
}
```

### Pattern 9: Combining with Flex Properties

**Use case**: When Stack's automatic behavior needs augmentation with specific flexbox controls

**Implementation**: Mix Stack props with inherited Flex/Box props

```jsx
import { HStack, Box } from "@chakra-ui/react"

function FlexControlledStack() {
  return (
    <HStack spacing={4} w="full">
      <Box flex="1">Grows to fill space</Box>
      <Box w="200px" flexShrink={0}>Fixed width</Box>
      <Box flex="2">Grows twice as much</Box>
    </HStack>
  )
}
```

### Pattern 10: Wrapping Stack Items

**Use case**: Allowing items to wrap to new lines when container width is insufficient

**Implementation**: Use the `wrap` prop with `"wrap"` value

```jsx
import { HStack, Box } from "@chakra-ui/react"

function WrappingStack() {
  return (
    <HStack spacing={4} wrap="wrap">
      <Box w="200px">Item 1</Box>
      <Box w="200px">Item 2</Box>
      <Box w="200px">Item 3</Box>
      <Box w="200px">Item 4</Box>
      <Box w="200px">Item 5</Box>
    </HStack>
  )
}
```

## Variants and Composition

### Stack Component Family

Chakra UI provides three variants of the Stack component:

1. **Stack (Base)**: Flexible direction via `direction` prop
   - Default direction: `"column"`
   - Use when direction needs to be dynamic or responsive
   - Most versatile variant

2. **VStack**: Specialized for vertical stacking
   - Pre-configured with `direction="column"`
   - Cannot change direction (locked to vertical)
   - Clearer semantic intent in code

3. **HStack**: Specialized for horizontal stacking
   - Pre-configured with `direction="row"`
   - Cannot change direction (locked to horizontal)
   - Clearer semantic intent in code

### Component Hierarchy

```
Stack (base component)
├── direction configurable
├── Built on Flex
└── Inherits all Box props

VStack (vertical variant)
├── direction="column" (fixed)
├── Extends Stack
└── All Stack props except direction

HStack (horizontal variant)
├── direction="row" (fixed)
├── Extends Stack
└── All Stack props except direction
```

### Composition with Other Components

**StackDivider**: Official divider component for Stack
```jsx
<VStack divider={<StackDivider borderColor="gray.200" />}>
  {/* children */}
</VStack>
```

**Box**: Can wrap Stack for additional styling layers
```jsx
<Box bg="white" shadow="md" borderRadius="lg">
  <VStack spacing={4} p={6}>
    {/* content */}
  </VStack>
</Box>
```

**Flex**: Stack is built on Flex, enabling mixed usage
```jsx
<Flex direction="column" gap={4}>
  <HStack spacing={2}>
    {/* horizontal items */}
  </HStack>
  <VStack spacing={2}>
    {/* vertical items */}
  </VStack>
</Flex>
```

## Accessibility

### Semantic HTML

Stack renders as a `<div>` element by default, which is semantically neutral. For better accessibility, use the `as` prop to render as more semantic elements when appropriate:

```jsx
// Render as nav for navigation menus
<HStack as="nav" spacing={4}>
  <Link>Home</Link>
  <Link>About</Link>
</HStack>

// Render as ul for lists
<VStack as="ul" spacing={2}>
  <Box as="li">Item 1</Box>
  <Box as="li">Item 2</Box>
</VStack>
```

### Keyboard Navigation

Stack itself is a non-interactive layout component. Interactive children (buttons, links, inputs) maintain their native keyboard navigation:
- Tab order follows visual order (top-to-bottom for VStack, left-to-right for HStack)
- No custom keyboard handling required
- Focus management handled by child components

### Screen Reader Support

- Stack doesn't add ARIA attributes by default (layout-only component)
- Use semantic HTML via the `as` prop for better screen reader context
- Children remain fully accessible to screen readers
- Reading order matches visual stacking order

### Focus Management

- No built-in focus management (non-interactive container)
- Focus behavior determined by child components
- Visual focus indicators work normally on interactive children
- Consider focus trap patterns when Stack contains modal or dialog content

### Color Contrast

- Stack itself has no color or visual styling by default
- Dividers should meet WCAG contrast requirements against background
- Use `borderColor` prop on StackDivider for accessible contrast
- Test divider visibility in both light and dark modes

## Responsive Design

### Breakpoint System

Chakra UI uses a mobile-first responsive system with the following breakpoints:
- `base`: 0px (default, mobile)
- `sm`: 480px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (small desktops)
- `xl`: 1280px (large desktops)
- `2xl`: 1536px (extra large screens)

### Responsive Syntax Options

**Array Syntax (mobile-first)**:
```jsx
<Stack
  direction={["column", "column", "row"]}
  spacing={[2, 4, 6]}
>
  {/* base: column, spacing 2 */}
  {/* sm: column, spacing 4 */}
  {/* md: row, spacing 6 */}
</Stack>
```

**Object Syntax (named breakpoints)**:
```jsx
<Stack
  direction={{ base: "column", md: "row" }}
  spacing={{ base: 2, md: 4, lg: 6 }}
>
  {/* More explicit and maintainable */}
</Stack>
```

### Responsive Direction Changes

Common pattern: vertical on mobile, horizontal on desktop
```jsx
<Stack
  direction={{ base: "column", lg: "row" }}
  spacing={6}
  align={{ base: "stretch", lg: "center" }}
>
  <Box flex="1">Sidebar</Box>
  <Box flex="3">Content</Box>
</Stack>
```

### Responsive Spacing Scaling

Spacing typically increases with viewport size:
```jsx
<VStack
  spacing={{ base: 3, md: 5, lg: 8 }}
  align="stretch"
>
  <Box>Tighter spacing on mobile</Box>
  <Box>Looser spacing on desktop</Box>
</VStack>
```

### Responsive Alignment

Alignment can adapt to layout changes:
```jsx
<Stack
  direction={{ base: "column", md: "row" }}
  align={{ base: "center", md: "flex-start" }}
  justify={{ base: "center", md: "space-between" }}
>
  <Box>Adapts alignment with direction</Box>
  <Box>Center on mobile, spread on desktop</Box>
</Stack>
```

## Theme Integration

### Design Token Integration

Stack integrates with Chakra UI's design token system:

**Spacing Scale**: The `spacing` prop accepts values from the spacing scale
- `spacing={4}` → `1rem` (16px)
- `spacing={8}` → `2rem` (32px)
- Custom values: `spacing="2.5rem"` or `spacing="20px"`

**Color Tokens**: Inherited Box props use color palette
```jsx
<VStack spacing={4} bg="gray.50" p={6}>
  {/* Uses theme color tokens */}
</VStack>
```

**Border Tokens**: StackDivider uses theme border styles
```jsx
<VStack divider={<StackDivider borderColor="gray.200" />}>
  {/* borderColor references theme colors */}
</VStack>
```

### Theme Customization

Stack behavior can be customized through Chakra UI's theme:

**Default Spacing**: Modify the global spacing scale
```js
// theme.js
export default extendTheme({
  spacing: {
    // Custom spacing values
  }
})
```

**StackDivider Styles**: Customize divider appearance
```js
// theme.js
export default extendTheme({
  components: {
    Divider: {
      baseStyle: {
        borderColor: 'gray.300',
        borderWidth: '1px',
      }
    }
  }
})
```

### Light/Dark Mode Support

Stack respects Chakra UI's color mode system:
```jsx
<VStack
  spacing={4}
  bg={{ base: "white", _dark: "gray.800" }}
  divider={
    <StackDivider
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    />
  }
>
  {/* Adapts to light/dark mode */}
</VStack>
```

## Related Components

### Flex
- **Purpose**: General-purpose flexbox container with full control
- **When to use**: Need fine-grained control over alignment, wrapping, grow/shrink behavior
- **Relationship**: Stack is built on Flex with preset defaults and spacing automation
- **Key difference**: Flex requires manual gap management, Stack automates spacing

### Box
- **Purpose**: Base layout component, renders as styled div
- **When to use**: General-purpose container, wrapper, or styled element
- **Relationship**: Stack inherits all Box props for styling
- **Key difference**: Box has no layout behavior, Stack implements flexbox stacking

### Wrap
- **Purpose**: Layout component that wraps children to new lines when space is insufficient
- **When to use**: Tag lists, chip collections, responsive button groups
- **Relationship**: Alternative to Stack with automatic wrapping behavior
- **Key difference**: Wrap is optimized for wrapping, Stack is optimized for stacking

### Grid / SimpleGrid
- **Purpose**: CSS Grid-based layout components
- **When to use**: Two-dimensional layouts, cards in rows and columns
- **Relationship**: Alternative layout system for more complex arrangements
- **Key difference**: Grid uses CSS Grid, Stack uses Flexbox

### Divider
- **Purpose**: Visual separator line component
- **When to use**: Manual divider placement between sections
- **Relationship**: StackDivider is a specialized version for Stack
- **Key difference**: Divider is standalone, StackDivider integrates with Stack's spacing system

### Center
- **Purpose**: Component that centers its children horizontally and vertically
- **When to use**: Centering content in a container
- **Relationship**: Could be implemented with Stack using alignment props
- **Key difference**: Center is specialized for centering, Stack is general-purpose

### Spacer
- **Purpose**: Flex spacer that expands to fill available space
- **When to use**: Inside HStack to push items apart
- **Relationship**: Complements Stack for specific spacing needs
- **Key difference**: Spacer creates dynamic space, Stack creates fixed gaps

## Framework-Specific Features

### Composition Architecture

Stack exemplifies Chakra UI's composition-based design philosophy:
- Built on Flex (which is built on Box)
- Inherits all capabilities of parent components
- Adds automatic spacing management on top
- Provides convenient API without hiding underlying flexbox

### Prop Alias System

Stack uses Chakra UI's prop alias pattern for improved DX:
- `direction` → `flexDirection`
- `align` → `alignItems`
- `justify` → `justifyContent`
- `wrap` → `flexWrap`

Aliases are shorter and more intuitive while mapping to standard CSS properties.

### Style Props System

Stack integrates with Chakra UI's style props system:
- All CSS properties available as props
- Responsive values on any prop
- Pseudo-class props (e.g., `_hover`, `_focus`)
- Design token references

### Chakra Factory Pattern

Stack can be created using the `chakra()` factory:
```jsx
import { chakra } from "@chakra-ui/react"

const CustomStack = chakra("div", {
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  }
})
```

### Polymorphic Components

Stack supports the `as` prop for rendering as different elements:
```jsx
<VStack as="section">  {/* Renders as <section> */}
<HStack as="nav">      {/* Renders as <nav> */}
<Stack as="ul">        {/* Renders as <ul> */}
```

### Recipe-Based Theming (Chakra UI v3)

In Chakra UI v3, Stack supports recipe-based theming for consistent styling:
```js
// theme.js
export default createSystem({
  recipes: {
    stack: {
      base: {
        gap: 4,
      },
      variants: {
        spaced: {
          gap: 8,
        },
        tight: {
          gap: 2,
        }
      }
    }
  }
})
```

### TypeScript Support

Full TypeScript definitions with prop autocomplete and type checking:
```typescript
import { VStack, StackProps } from "@chakra-ui/react"

interface CustomStackProps extends StackProps {
  customProp?: string
}

function CustomStack({ customProp, ...props }: CustomStackProps) {
  return <VStack {...props} />
}
```

## Code Examples

### Example 1: Simple Vertical Stack
```jsx
import { VStack, Box } from "@chakra-ui/react"

export function SimpleVerticalStack() {
  return (
    <VStack spacing={4}>
      <Box p={4} bg="blue.100">Item 1</Box>
      <Box p={4} bg="blue.200">Item 2</Box>
      <Box p={4} bg="blue.300">Item 3</Box>
    </VStack>
  )
}
```

### Example 2: Simple Horizontal Stack
```jsx
import { HStack, Box } from "@chakra-ui/react"

export function SimpleHorizontalStack() {
  return (
    <HStack spacing={6}>
      <Box w="100px" h="100px" bg="red.100" />
      <Box w="100px" h="100px" bg="red.200" />
      <Box w="100px" h="100px" bg="red.300" />
    </HStack>
  )
}
```

### Example 3: Responsive Stack Direction
```jsx
import { Stack, Box } from "@chakra-ui/react"

export function ResponsiveStack() {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={{ base: 4, md: 8 }}
      align="stretch"
    >
      <Box flex="1" p={6} bg="green.100">
        Sidebar content
      </Box>
      <Box flex="2" p={6} bg="green.200">
        Main content area
      </Box>
    </Stack>
  )
}
```

### Example 4: Stack with Dividers
```jsx
import { VStack, Box, StackDivider } from "@chakra-ui/react"

export function StackWithDividers() {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      <Box h="40px">Section 1</Box>
      <Box h="40px">Section 2</Box>
      <Box h="40px">Section 3</Box>
      <Box h="40px">Section 4</Box>
    </VStack>
  )
}
```

### Example 5: Navigation Menu with HStack
```jsx
import { HStack, Link, StackDivider } from "@chakra-ui/react"

export function NavigationMenu() {
  return (
    <HStack
      as="nav"
      spacing={6}
      divider={<StackDivider borderColor="gray.300" />}
    >
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/services">Services</Link>
      <Link href="/contact">Contact</Link>
    </HStack>
  )
}
```

### Example 6: Form Layout with VStack
```jsx
import { VStack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react"

export function FormStack() {
  return (
    <VStack spacing={5} align="stretch">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your name" />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Enter your email" />
      </FormControl>

      <FormControl>
        <FormLabel>Message</FormLabel>
        <Input placeholder="Enter your message" />
      </FormControl>

      <Button colorScheme="blue">Submit</Button>
    </VStack>
  )
}
```

### Example 7: Button Group with HStack
```jsx
import { HStack, Button } from "@chakra-ui/react"

export function ButtonGroupStack() {
  return (
    <HStack spacing={3} justify="flex-end">
      <Button variant="outline">Cancel</Button>
      <Button variant="solid">Save Draft</Button>
      <Button colorScheme="blue">Publish</Button>
    </HStack>
  )
}
```

### Example 8: Card List with VStack
```jsx
import { VStack, Box, Heading, Text } from "@chakra-ui/react"

export function CardListStack() {
  const cards = [
    { title: "Card 1", description: "First card description" },
    { title: "Card 2", description: "Second card description" },
    { title: "Card 3", description: "Third card description" },
  ]

  return (
    <VStack spacing={6} align="stretch">
      {cards.map((card, index) => (
        <Box
          key={index}
          p={6}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
        >
          <Heading size="md" mb={2}>{card.title}</Heading>
          <Text>{card.description}</Text>
        </Box>
      ))}
    </VStack>
  )
}
```

### Example 9: Responsive Alignment
```jsx
import { Stack, Box } from "@chakra-ui/react"

export function ResponsiveAlignment() {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={4}
      align={{ base: "center", md: "flex-start" }}
      justify={{ base: "center", md: "space-between" }}
    >
      <Box w="200px" h="100px" bg="purple.200">
        Centered on mobile
      </Box>
      <Box w="200px" h="100px" bg="purple.300">
        Space-between on desktop
      </Box>
      <Box w="200px" h="100px" bg="purple.400">
        Alignment adapts
      </Box>
    </Stack>
  )
}
```

### Example 10: Nested Stacks
```jsx
import { VStack, HStack, Box, Heading, Text } from "@chakra-ui/react"

export function NestedStacks() {
  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="lg" mb={4}>Dashboard</Heading>
      </Box>

      <HStack spacing={6} align="stretch">
        <VStack
          flex="1"
          spacing={4}
          p={6}
          bg="blue.50"
          borderRadius="md"
        >
          <Heading size="md">Stats</Heading>
          <Text>Users: 1,234</Text>
          <Text>Revenue: $56,789</Text>
        </VStack>

        <VStack
          flex="1"
          spacing={4}
          p={6}
          bg="green.50"
          borderRadius="md"
        >
          <Heading size="md">Activity</Heading>
          <Text>New signups: 45</Text>
          <Text>Active users: 892</Text>
        </VStack>
      </HStack>
    </VStack>
  )
}
```

## Notes and Observations

### Key Design Decisions

1. **Specialized Variants**: Chakra UI provides VStack and HStack as specialized variants rather than requiring a direction prop on every usage. This improves code clarity and reduces boilerplate.

2. **Automatic Spacing**: Stack uses a sophisticated CSS selector approach to apply spacing between children without requiring wrapper elements or manual margin management.

3. **Built on Flex**: Stack is not a new layout system but a convenience layer on top of flexbox, making it easy to understand and debug.

4. **Divider Integration**: Built-in divider support eliminates the common pattern of manually interleaving divider elements with content.

5. **Responsive First-Class**: All props support responsive values, making Stack adaptable to different viewport sizes without additional wrappers or media queries.

### Developer Experience Strengths

- **Minimal Boilerplate**: Stack eliminates repetitive flexbox configuration
- **Clear Semantic Intent**: VStack/HStack names clearly communicate layout direction
- **Consistent Spacing**: Design token integration ensures spacing consistency across the app
- **Type Safety**: Full TypeScript support with prop autocomplete
- **Gradual Adoption**: Can mix Stack with Flex for progressive enhancement

### Common Use Cases

1. **Form Layouts**: Vertical stacking of form fields with consistent spacing
2. **Navigation Menus**: Horizontal stacking of navigation links
3. **Button Groups**: Horizontal arrangement of related buttons
4. **Card Lists**: Vertical list of card components
5. **Sidebar Layouts**: Responsive layouts that change from vertical to horizontal
6. **Settings Panels**: Vertical list of settings with dividers
7. **Dashboard Widgets**: Nested stacks for complex dashboard layouts
8. **Content Sections**: Vertical stacking of page sections with spacing

### Comparison to Raw Flexbox

**Stack Advantages**:
- Automatic spacing between children (no manual margins)
- Clearer semantic intent (VStack vs Flex with direction="column")
- Built-in divider support
- Responsive API integrated into component props

**Raw Flex Advantages**:
- More explicit control over flexbox properties
- No abstraction layer to understand
- Familiar to developers who know CSS flexbox

### Comparison to CSS Grid

**When to use Stack**:
- Single-direction layouts (rows or columns)
- Simple spacing requirements
- Need for dividers between items
- When flexbox is sufficient

**When to use Grid**:
- Two-dimensional layouts (rows AND columns simultaneously)
- Complex alignment requirements
- Need for items to span multiple cells
- When CSS Grid features are required

### Performance Characteristics

- **Lightweight**: Minimal JavaScript overhead
- **CSS-Based**: Uses native CSS flexbox for layout
- **No Runtime Calculation**: Spacing applied via CSS, not JavaScript
- **Efficient Re-renders**: Only re-renders when props change
- **Optimized CSS**: Chakra's style system generates optimized CSS

### Gotchas and Considerations

1. **Width Behavior**: Stack doesn't span full container width by default (unlike Flex). Use `w="full"` or `align="stretch"` if needed.

2. **Spacing on Edges**: Stack only adds spacing between children, not around the edges. Use padding props for outer spacing.

3. **Direction Locked on VStack/HStack**: Cannot change direction dynamically on specialized variants. Use base Stack component if direction needs to be responsive.

4. **Divider Rendering**: Dividers are cloned and inserted between children, which can affect React keys and refs.

5. **shouldWrapChildren Performance**: Wrapping each child in a Box can impact performance with large lists. Use only when necessary.

6. **Flex vs Stack Width**: Developers transitioning from Flex may expect full-width behavior by default.

### Framework Philosophy

Stack exemplifies Chakra UI's design principles:
- **Composition over Configuration**: Built by composing simpler primitives
- **Progressive Disclosure**: Simple API with access to advanced features
- **Sensible Defaults**: Works well out of the box with minimal configuration
- **Responsive by Design**: Responsive values supported on all props
- **Type Safety**: Full TypeScript support throughout

### Potential Semantic UI Implementation Considerations

If implementing a similar Stack component for Semantic UI:

1. **Consider**: Whether to provide specialized VStack/HStack variants or a single Stack with direction prop
2. **Consider**: How to integrate with existing spacing/design token systems
3. **Consider**: Whether to support divider integration or leave it to composition
4. **Consider**: How to handle responsive direction changes with web components
5. **Consider**: Whether to build on Flex primitive or implement independently
6. **Consider**: How to provide TypeScript types for web components
7. **Consider**: Whether to use CSS gap property or margin-based spacing
8. **Consider**: How to handle Shadow DOM boundaries with dividers

### Version Compatibility Notes

- Stack API has remained stable across Chakra UI v1, v2, and v3
- v3 adds recipe-based theming but maintains backward compatibility
- Core props (`spacing`, `direction`, `align`, `justify`, `divider`) unchanged
- TypeScript types improved in recent versions
- Performance optimizations in v3 but no API changes required

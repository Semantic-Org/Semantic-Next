# Mantine - Flex Component

> Last Modified: 2025-11-05

## Component Definition

The Mantine Flex component is a layout primitive that provides a flexible container for composing elements using CSS flexbox. It serves as a versatile alternative to the more specialized Group (horizontal-only) and Stack (vertical-only) components, offering comprehensive control over flexbox properties with responsive behavior support.

**Core purpose**: Provides a powerful, flexible layout system for arranging child elements in both horizontal and vertical directions with full control over alignment, distribution, spacing, and wrapping behavior.

**Architecture**: A polymorphic component that renders as a flexbox container (default: div) with props that map directly to CSS flexbox properties. Supports responsive values through Mantine's breakpoint system and integrates with the theme's spacing scale.

**Common use cases**:
- Responsive navigation bars that stack on mobile
- Form layouts with dynamic alignment
- Card grids with wrapping behavior
- Toolbar and button groups with flexible spacing
- Complex dashboard layouts with mixed directions
- Content sections requiring precise alignment control

## Flexbox Patterns

### Direction Control

Flex provides full control over flex direction with support for all standard flexbox direction values:

**Row Direction** (default):
```jsx
<Flex direction="row">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Flex>
```
- Children arranged horizontally left-to-right
- Default behavior when direction prop omitted

**Column Direction**:
```jsx
<Flex direction="column">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Flex>
```
- Children arranged vertically top-to-bottom
- Useful for vertical lists and stacked content

**Row Reverse**:
```jsx
<Flex direction="row-reverse">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Flex>
```
- Children arranged horizontally right-to-left
- Reverses visual order without changing DOM order

**Column Reverse**:
```jsx
<Flex direction="column-reverse">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Flex>
```
- Children arranged vertically bottom-to-top
- Reverses vertical stacking order

**Responsive Direction**:
```jsx
<Flex direction={{ base: 'column', sm: 'row' }}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>
```
- Stacks vertically on mobile (base)
- Switches to horizontal row on small screens and above (sm)

### Alignment Patterns

**Main Axis Justification** (`justify` prop):

Maps to CSS `justifyContent` property for distribution along main axis:

```jsx
// Start alignment (default)
<Flex justify="flex-start">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// Center alignment
<Flex justify="center">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// End alignment
<Flex justify="flex-end">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// Space between
<Flex justify="space-between">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>

// Space around
<Flex justify="space-around">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>

// Space evenly
<Flex justify="space-evenly">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>
```

**Cross Axis Alignment** (`align` prop):

Maps to CSS `alignItems` property for alignment on cross axis:

```jsx
// Start alignment (default)
<Flex align="flex-start" mih={100}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// Center alignment
<Flex align="center" mih={100}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// End alignment
<Flex align="flex-end" mih={100}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// Stretch (full height/width)
<Flex align="stretch" mih={100}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>

// Baseline alignment
<Flex align="baseline" mih={100}>
  <Text size="xl">Large Text</Text>
  <Text size="sm">Small Text</Text>
</Flex>
```

**Responsive Alignment**:
```jsx
<Flex
  justify={{ base: 'center', sm: 'flex-start' }}
  align={{ base: 'stretch', md: 'center' }}
>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Flex>
```
- Center on mobile, start on small screens
- Stretch alignment on mobile, center on medium screens and above

### Wrapping Behavior

**Wrap** (default in examples):
```jsx
<Flex wrap="wrap" gap="md">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
  <Button>Button 4</Button>
  <Button>Button 5</Button>
</Flex>
```
- Items wrap to next line when container width insufficient
- Maintains gap spacing between wrapped items

**No Wrap**:
```jsx
<Flex wrap="nowrap" gap="md">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>
```
- Items remain on single line
- May overflow container or shrink items

**Wrap Reverse**:
```jsx
<Flex wrap="wrap-reverse" gap="md">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
  <Button>Button 4</Button>
</Flex>
```
- Items wrap in reverse direction
- New lines appear above/before existing lines

### Spacing Control

**Uniform Gap**:
```jsx
// Using theme spacing values
<Flex gap="xs">...</Flex>   // Extra small gap
<Flex gap="sm">...</Flex>   // Small gap
<Flex gap="md">...</Flex>   // Medium gap (common default)
<Flex gap="lg">...</Flex>   // Large gap
<Flex gap="xl">...</Flex>   // Extra large gap

// Using numeric values (pixels)
<Flex gap={8}>...</Flex>    // 8px gap
<Flex gap={16}>...</Flex>   // 16px gap
<Flex gap={32}>...</Flex>   // 32px gap
```

**Row Gap** (vertical spacing):
```jsx
<Flex rowGap="md" wrap="wrap">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
  <Button>Button 4</Button>
</Flex>
```
- Controls vertical spacing between wrapped rows
- Independent from horizontal spacing

**Column Gap** (horizontal spacing):
```jsx
<Flex columnGap="lg" wrap="wrap">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>
```
- Controls horizontal spacing between items
- Independent from vertical spacing

**Different Row and Column Gaps**:
```jsx
<Flex rowGap="xl" columnGap="md" wrap="wrap">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
  <Button>Button 4</Button>
</Flex>
```
- Larger vertical spacing (xl)
- Smaller horizontal spacing (md)
- Useful for card grids and form layouts

**Responsive Gap**:
```jsx
<Flex gap={{ base: 'sm', sm: 'lg' }} wrap="wrap">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>
```
- Small gap on mobile
- Large gap on small screens and above

### Polymorphic Rendering

**Semantic HTML Elements**:
```jsx
// Render as section
<Flex component="section" direction="column">
  <Title>Section Title</Title>
  <Text>Section content</Text>
</Flex>

// Render as nav
<Flex component="nav" gap="md">
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</Flex>

// Render as article
<Flex component="article" direction="column" gap="lg">
  <Title>Article Title</Title>
  <Text>Article content...</Text>
</Flex>
```
- Improves semantic HTML structure
- Better accessibility and SEO
- Default is `div` element

### Responsive Patterns

**Mobile-First Layout**:
```jsx
<Flex
  direction={{ base: 'column', sm: 'row' }}
  gap={{ base: 'sm', sm: 'lg' }}
  justify={{ sm: 'center' }}
>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Flex>
```
- Column layout (stacked) on mobile
- Row layout on tablets and above
- Small gap on mobile, large gap on desktop
- Centered on small screens and above

**Breakpoint-Specific Behavior**:
```jsx
<Flex
  direction={{ base: 'column', md: 'row', lg: 'row-reverse' }}
  align={{ base: 'stretch', md: 'center' }}
  justify={{ lg: 'space-between' }}
  gap={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}
>
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</Flex>
```
- Column on mobile (base)
- Row on medium screens (md)
- Row-reverse on large screens (lg)
- Progressive gap scaling across all breakpoints

## Code Examples

### Example 1: Basic Flex Container
```jsx
import { Flex, Button } from '@mantine/core';

function BasicFlexDemo() {
  return (
    <Flex
      mih={50}
      bg="rgba(0, 0, 0, .3)"
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="row"
      wrap="wrap"
    >
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Flex>
  );
}
```

### Example 2: Responsive Navigation Bar
```jsx
import { Flex, Button } from '@mantine/core';

function ResponsiveNav() {
  return (
    <Flex
      component="nav"
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: 'sm', sm: 'lg' }}
      justify={{ sm: 'center' }}
      align={{ base: 'stretch', sm: 'center' }}
    >
      <Button>Home</Button>
      <Button>Products</Button>
      <Button>About</Button>
      <Button>Contact</Button>
    </Flex>
  );
}
```

### Example 3: Centered Content Layout
```jsx
import { Flex, Card, Text } from '@mantine/core';

function CenteredLayout() {
  return (
    <Flex
      mih="100vh"
      justify="center"
      align="center"
      direction="column"
      gap="xl"
    >
      <Card>
        <Text>Centered Card 1</Text>
      </Card>
      <Card>
        <Text>Centered Card 2</Text>
      </Card>
    </Flex>
  );
}
```

### Example 4: Card Grid with Wrapping
```jsx
import { Flex, Card } from '@mantine/core';

function CardGrid() {
  return (
    <Flex
      gap="md"
      wrap="wrap"
      justify="flex-start"
      align="stretch"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} style={{ flexBasis: 'calc(33.333% - 16px)' }}>
          Card {index + 1}
        </Card>
      ))}
    </Flex>
  );
}
```

### Example 5: Form Layout with Mixed Alignment
```jsx
import { Flex, TextInput, Button } from '@mantine/core';

function FormLayout() {
  return (
    <Flex direction="column" gap="md">
      <Flex gap="sm" wrap="wrap">
        <TextInput label="First Name" style={{ flex: 1, minWidth: 200 }} />
        <TextInput label="Last Name" style={{ flex: 1, minWidth: 200 }} />
      </Flex>
      <TextInput label="Email" />
      <Flex justify="flex-end" gap="sm">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </Flex>
    </Flex>
  );
}
```

### Example 6: Toolbar with Space Between
```jsx
import { Flex, Button, Text } from '@mantine/core';

function Toolbar() {
  return (
    <Flex
      justify="space-between"
      align="center"
      gap="md"
      p="md"
      bg="gray.1"
    >
      <Text fw={700}>Dashboard</Text>
      <Flex gap="sm">
        <Button variant="outline">Settings</Button>
        <Button>Logout</Button>
      </Flex>
    </Flex>
  );
}
```

### Example 7: Vertical Stack with Custom Gaps
```jsx
import { Flex, Title, Text, Divider } from '@mantine/core';

function VerticalStack() {
  return (
    <Flex direction="column" gap="xl">
      <div>
        <Title order={2}>Section 1</Title>
        <Text>Content for section 1</Text>
      </div>
      <Divider />
      <div>
        <Title order={2}>Section 2</Title>
        <Text>Content for section 2</Text>
      </div>
      <Divider />
      <div>
        <Title order={2}>Section 3</Title>
        <Text>Content for section 3</Text>
      </div>
    </Flex>
  );
}
```

### Example 8: Reversed Direction Layout
```jsx
import { Flex, Badge } from '@mantine/core';

function ReversedLayout() {
  return (
    <Flex direction="row-reverse" gap="sm" justify="flex-start">
      <Badge color="blue">First (appears right)</Badge>
      <Badge color="green">Second</Badge>
      <Badge color="red">Third (appears left)</Badge>
    </Flex>
  );
}
```

### Example 9: Different Row and Column Gaps
```jsx
import { Flex, Paper } from '@mantine/core';

function GridWithDifferentGaps() {
  return (
    <Flex
      rowGap="xl"
      columnGap="md"
      wrap="wrap"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Paper
          key={index}
          p="md"
          style={{ width: 'calc(50% - 8px)' }}
        >
          Item {index + 1}
        </Paper>
      ))}
    </Flex>
  );
}
```

### Example 10: Responsive Complex Layout
```jsx
import { Flex, Card, Text, Image } from '@mantine/core';

function ResponsiveComplexLayout() {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: 'md', lg: 'xl' }}
      align={{ base: 'stretch', md: 'flex-start' }}
      justify={{ md: 'space-between' }}
    >
      <Card style={{ flex: 1 }}>
        <Image src="image1.jpg" alt="Image 1" />
        <Text mt="md">Card content 1</Text>
      </Card>
      <Card style={{ flex: 1 }}>
        <Image src="image2.jpg" alt="Image 2" />
        <Text mt="md">Card content 2</Text>
      </Card>
      <Card style={{ flex: 1 }}>
        <Image src="image3.jpg" alt="Image 3" />
        <Text mt="md">Card content 3</Text>
      </Card>
    </Flex>
  );
}
```

## Notable Features

### Polymorphic Component Support
- Can render as any HTML element via `component` prop
- Improves semantic HTML structure
- Better accessibility and SEO
- Examples: `component="section"`, `component="nav"`, `component="article"`

### Comprehensive Responsive System
- All flexbox props accept responsive values
- Breakpoint object syntax: `{ base: 'value', sm: 'value', md: 'value', lg: 'value', xl: 'value' }`
- Supports mobile-first and desktop-first approaches
- Fine-grained control at each breakpoint

### Theme Integration
- Gap props integrate with Mantine's spacing scale
- Values: `xs`, `sm`, `md`, `lg`, `xl`
- Consistent spacing across application
- Also accepts numeric pixel values for precise control

### Flexbox Gap Support
- Modern CSS gap property for clean spacing
- No margin hacks required
- Consistent spacing even with wrapping
- Note: Older browsers require PostCSS polyfill (`flex-gap-polyfill`)

### Style Props Support
- Accepts all Mantine style props (same as Box component)
- Common props: `mih` (min-height), `bg` (background), `p` (padding), `m` (margin)
- Inline styling via `style` prop
- Full sx prop support for advanced styling

### Comparison to Group and Stack

**Flex Advantages:**
- Supports both horizontal and vertical layouts
- Full responsive prop support
- Polymorphic rendering capability
- More granular control over wrapping and alignment
- Supports all standard flexbox values

**When to Use:**
- **Flex**: Complex layouts requiring responsive behavior, wrapping, or both directions
- **Group**: Simple horizontal layouts with equal-width children
- **Stack**: Simple vertical layouts with consistent spacing

## Research Notes

**Browser Compatibility:**
- Modern flexbox gap property requires recent browser versions
- Older browsers (IE11, older Safari) need PostCSS plugin: `flex-gap-polyfill`
- Consider fallback spacing for legacy support

**Performance Considerations:**
- Lightweight component with minimal overhead
- Flexbox calculations handled by browser's layout engine
- Responsive props create media queries (minimal bundle impact)

**Documentation Quality:**
- Clear, comprehensive documentation with interactive demos
- All props documented with CSS property mappings
- Comparison table with Group and Stack helpful for choosing component

**Version Stability:**
- Core component in Mantine v6.x and v7.x
- Stable API with consistent prop naming
- Part of Mantine's core layout system

**Real-World Usage:**
- Production-ready for responsive layouts
- Used extensively in Mantine's own documentation site
- Common in navigation bars, form layouts, card grids, and dashboards

**Import Path:**
```jsx
import { Flex } from '@mantine/core';
```

**TypeScript Support:**
- Full TypeScript support with prop types
- Generic component type for polymorphic rendering
- Autocomplete for all props in IDEs

---

**Research completed:** 2025-11-05
**Component:** Flex
**Framework:** Mantine
**Documentation:** https://mantine.dev/core/flex/

**Key Differentiators:**
- Polymorphic component architecture for semantic HTML flexibility
- Comprehensive responsive prop support across all flexbox properties
- Clean gap-based spacing without margin hacks
- Versatile alternative to specialized Group and Stack components
- Full integration with Mantine's theme system and style props
- Direct CSS flexbox property mapping for intuitive API

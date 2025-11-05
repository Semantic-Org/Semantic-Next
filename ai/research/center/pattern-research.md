# Component Pattern Research: Center (Layout)

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 2
- Date: 2025-11-05
- Unique patterns identified: 15+

## Component Definition Consensus

Center components provide automatic vertical and horizontal centering of content using flexbox. Universal mental model: "centering box wrapper."

**Primary Purpose:** Simplify the common task of center alignment by eliminating the need to manually configure flexbox properties, providing a declarative centering primitive.

**Mental Model:** A wrapper container that automatically centers its children both horizontally and vertically, eliminating the need to remember flexbox patterns.

**Semantic meaning:** Communicates intentional centered layout, creating visual prominence and focal points through geometric centering with symmetrical balance.

## Terminology Variations

- **Center** (2 frameworks) = Chakra UI, Mantine

Both frameworks use the term "Center" consistently.

## Pattern Inventory

### Core Centering Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Horizontal & vertical centering | Both axes centered simultaneously | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Flexbox-based | Uses display: flex with align/justify | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Children composition | Content as React children | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Box composition | Inherits layout component props | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Text content | Center text elements | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Icon centering | Center icon components | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Media support | Images, videos, any element | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Custom content | Any React nodes | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Complex component trees | Nested structures | 2/2 (100%) | **Level 1: Universal** | All | Composed |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Block-level centering | Default div container | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Inline centering | Inline element centering | 1/2 (50%) | **Level 3: Frequent** | Mantine | Native |
| Polymorphic element | Change root element type | 1/2 (50%) | **Level 3: Frequent** | Mantine | Native |

### Dimension Control Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Width control | Explicit width setting | 2/2 (100%) | **Level 1: Universal** | All | Native/CSS-only |
| Height control | Explicit height setting | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Max width | Constrain maximum width | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Min height | Minimum height constraint | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Responsive dimensions | Breakpoint-aware sizing | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Background color | Color backgrounds | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Border radius | Rounded corners | 2/2 (100%) | **Level 1: Universal** | All | Native/CSS-only |
| Padding | Internal spacing | 2/2 (100%) | **Level 1: Universal** | All | Native/CSS-only |
| Hover states | Interactive styling | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Dark mode support | Theme adaptation | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Specialized Variants

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Square variant | Equal width/height constraint | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Circle variant | Circular containers | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Absolute center | Absolute positioning variant | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |

## Notable Patterns

### Universal (100%)
- Flexbox-based centering
- Children composition
- Horizontal and vertical alignment
- Width and height control
- Background color support
- Responsive sizing
- Dark mode adaptation
- Box/layout component inheritance

### Chakra UI Specializations

**Four Component Variants:**

1. **Center** (base):
   - General-purpose centering
   - Flexible dimensions
   - Full Box prop inheritance

2. **Square**:
   - Equal width/height via `size` prop
   - Eliminates redundant width/height
   - Perfect for icons, avatars, badges

3. **Circle**:
   - Extends Square
   - Automatic `borderRadius="full"`
   - Perfect circular containers

4. **AbsoluteCenter**:
   - Absolute positioning with centering
   - `axis` prop: 'horizontal', 'vertical', 'both'
   - Overlay and positioned content

**Props API:**
```jsx
// Center/Square/Circle
<Center w="40px" h="40px" bg="blue.500" />
<Square size="40px" bg="purple.500" />
<Circle size="40px" bg="tomato" />

// AbsoluteCenter
<AbsoluteCenter axis="both">Overlay</AbsoluteCenter>
```

**Use Cases Documented:**
- Icons and badges
- Avatar placeholders
- Loading spinners
- Empty states
- Card layouts
- Button bases
- Overlays and positioned content

### Mantine Specializations

**Single Component with Props:**

**Inline Prop:**
```jsx
<Center inline>
  <IconArrowLeft />
  <Box>Text</Box>
</Center>
```
- Renders as inline element
- Centers inline content
- Unique to Mantine

**Polymorphic Component:**
```jsx
<Center component="button">
  Centered Button
</Center>
```
- Change root element via `component` prop
- Transform into any element/component
- Part of Mantine's polymorphic pattern

**Props API:**
```jsx
<Center
  maw={400}      // max-width
  h={100}        // height
  bg="var(--mantine-color-gray-light)"
  inline         // inline centering
  component="div" // polymorphic
>
```

**Use Cases Documented:**
- Icon + text combinations
- Link centering
- Button centering
- General content centering

## Implementation Notes

### Installation

**Chakra UI:**
```jsx
import { Center, Square, Circle, AbsoluteCenter } from '@chakra-ui/react'
```
Part of @chakra-ui/react core.

**Mantine:**
```tsx
import { Center } from '@mantine/core'
```
Part of @mantine/core v8.3.6.

### Basic Usage Comparison

**Chakra UI:**
```jsx
// Basic centering
<Center bg="gray.100" h="100px">
  Content
</Center>

// Square with size prop
<Square size="40px" bg="blue.500">
  Icon
</Square>

// Circle variant
<Circle size="40px" bg="red.500">
  5
</Circle>

// Absolute positioning
<AbsoluteCenter axis="both">
  Overlay
</AbsoluteCenter>
```

**Mantine:**
```tsx
// Basic centering
<Center maw={400} h={100} bg="var(--mantine-color-gray-light)">
  Content
</Center>

// Inline centering
<Center inline>
  <IconArrowLeft />
  <Box ml={5}>Text</Box>
</Center>

// Polymorphic
<Center component="button">
  Button
</Center>
```

### Flexbox Implementation

Both frameworks use the same underlying flexbox approach:
```css
display: flex;
align-items: center;      /* vertical centering */
justify-content: center;  /* horizontal centering */
```

### Responsive Patterns

**Chakra UI:**
```jsx
<Center
  w={["100px", "200px", "300px"]}  // Array syntax
  h={{ base: "100px", md: "200px" }} // Object syntax
>
```

**Mantine:**
```tsx
<Center
  maw={400}
  h={100}
  // Use Mantine responsive style props
>
```

## Design Philosophy Differences

### Chakra UI: Variant-Rich Approach
- **Philosophy**: Specialized components for specific use cases
- **Variants**: 4 distinct components (Center, Square, Circle, AbsoluteCenter)
- **Innovation**: Square's `size` prop, Circle's automatic radius
- **Audience**: Covers common geometric centering patterns
- **Props**: Inherits all Box props (~80+ props)

### Mantine: Minimal with Flexibility
- **Philosophy**: Single focused component with modifiers
- **Features**: Inline mode, polymorphic transformation
- **Innovation**: Inline centering, component prop
- **Audience**: Simple centering with extension points
- **Props**: Core props + polymorphic system

## Use Case Consensus

Both frameworks emphasize these primary use cases:
1. **Icon centering** - Small UI elements in containers
2. **Loading states** - Spinners and skeleton screens
3. **Empty states** - "No data" messages
4. **Badges/avatars** - Circular or square containers
5. **Card content** - Centered card layouts
6. **Button content** - Icon + text alignment

## Accessibility Considerations

### Common Patterns

**Semantic Flexibility:**
Both frameworks allow semantic HTML through:
- Chakra: Inherits `as` prop from Box
- Mantine: `component` prop for polymorphism

**Focus Management:**
- No special focus handling (presentational utility)
- Interactive states via polymorphism or parent components
- Keyboard navigation through composed content

**Color Contrast:**
Both frameworks support accessible color combinations through theme systems.

### Framework-Specific

**Chakra UI:**
- Theme color tokens meet WCAG standards
- Responsive text sizes for readability
- Dark mode adaptation built-in

**Mantine:**
- CSS variable system for consistent colors
- Theme-aware color palette
- Automatic dark mode support

## Comparison Notes

### Similarities
- Both use flexbox for centering
- Both support responsive dimensions
- Both integrate with framework design systems
- Both provide background color control
- Both compose with children naturally

### Differences

| Aspect | Chakra UI | Mantine |
|--------|-----------|---------|
| **Variants** | 4 components | 1 component |
| **Size API** | Square/Circle `size` prop | Standard width/height |
| **Inline Mode** | Via `as="span"` | Via `inline` prop |
| **Positioning** | AbsoluteCenter variant | Not provided |
| **Polymorphism** | Via `as` prop (Box) | Via `component` prop |
| **Prop Count** | ~80+ (Box inheritance) | ~10-15 core props |

## Limited Ecosystem Observation

Only 2 frameworks provide dedicated Center components out of the surveyed frameworks. Center utilities are specialized layout helpers that:
- Solve a specific, common use case
- Are syntactic sugar over flexbox
- Reduce boilerplate for simple centering
- Are considered convenience utilities

Many frameworks expect developers to use standard flexbox CSS or more general layout components rather than dedicated centering primitives.

## Raw Data

- [Chakra UI](./chakra-ui/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)

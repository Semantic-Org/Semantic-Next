# Mantine Skeleton Component - Usage Patterns Research

**Component:** Skeleton
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation URL:** https://mantine.dev/core/skeleton/
**Research Date:** 2025-11-04

---

## Component Definition

### Skeleton Component
**Core purpose:** A placeholder component for displaying loading states. Creates visual placeholders that indicate content is being loaded, improving perceived performance and user experience during asynchronous operations.

**Mental model:** Think of a wireframe or outline of content that appears while the actual content loads. Like a gray ghost or shadow of the real content structure that will eventually appear.

**Semantic meaning:** Communicates to users that content is loading and provides a visual preview of the content's structure and layout. Reduces layout shift by reserving space for incoming content.

**Primary use cases:**
1. **Standalone placeholders** - Create loading indicators that match the shape and size of expected content
2. **Content wrappers** - Wrap existing content to show/hide a loading overlay based on loading state

---

## Documentation Quality
**Overall:** Good - Clear examples, straightforward API, covers main use cases. Documentation is concise and focuses on practical patterns.

**Strengths:**
- Clear basic usage examples
- Shows both standalone and wrapper patterns
- Responsive sizing documented
- Theme integration explained

**Gaps:**
- Limited advanced composition examples
- No explicit accessibility guidance
- Animation customization not detailed beyond on/off

---

## Pattern Support Levels

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Content Patterns** | | | |
| Standalone placeholder | ✅ | Native | Self-closing component with dimensions |
| Content wrapper | ✅ | Native | Wraps children with loading overlay |
| **Dimension Patterns** | | | |
| Height control | ✅ | Native | Any valid CSS value (number, string, responsive object) |
| Width control | ✅ | Native | Any valid CSS value (number, string, responsive object) |
| Responsive sizing | ✅ | Native | Breakpoint-based object syntax for all size props |
| **Shape Patterns** | | | |
| Rectangle/default | ✅ | Native | Default shape with radius control |
| Circle variant | ✅ | Native | `circle` prop makes equal width/height with full radius |
| Radius control | ✅ | Native | Theme radius keys or any valid CSS value |
| **Visual Patterns** | | | |
| Animated loading | ✅ | Native | Default shimmer/pulse animation |
| Static placeholder | ✅ | Native | `animate={false}` disables animation |
| Visibility control | ✅ | Native | `visible` prop toggles loading overlay (wrapper mode) |
| **Theme Integration** | | | |
| Theme radius | ✅ | Native | Accepts theme.radius keys |
| Custom CSS values | ✅ | Native | Accepts any valid CSS for dimensions/radius |
| Responsive breakpoints | ✅ | Native | Uses theme.breakpoints for responsive objects |
| Style props | ✅ | Native | Mantine style props (mb, mt, etc.) |
| **Styling Patterns** | | | |
| className support | ✅ | Native | Single root element accepts className |
| Inline styles | ✅ | Native | style prop for custom inline styles |
| Style props | ✅ | Native | Mantine's style prop system |

---

## Code Examples

### Basic Usage - Standalone Skeletons

```jsx
import { Skeleton } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Circle skeleton for avatar */}
      <Skeleton height={50} circle mb="xl" />

      {/* Line skeletons for text */}
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </>
  );
}
```

### Content Wrapper Pattern - Loading Overlay

```jsx
import { useState } from 'react';
import { Skeleton, Button } from '@mantine/core';

function Demo() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Skeleton wraps content and shows/hides based on visible prop */}
      <Skeleton visible={loading}>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </Skeleton>

      <Button onClick={() => setLoading((l) => !l)}>
        Toggle Loading State
      </Button>
    </>
  );
}
```

### Dimension Control

```jsx
import { Skeleton } from '@mantine/core';

function DimensionExamples() {
  return (
    <>
      {/* Numeric values (pixels) */}
      <Skeleton height={50} width={200} />

      {/* String CSS values */}
      <Skeleton height="3rem" width="100%" />

      {/* Percentage widths */}
      <Skeleton height={8} width="70%" />
      <Skeleton height={8} width="50%" />
      <Skeleton height={8} width="30%" />

      {/* Full width */}
      <Skeleton height={100} />
    </>
  );
}
```

### Circle Variant

```jsx
import { Skeleton } from '@mantine/core';

function CircleSkeletons() {
  return (
    <>
      {/* Circle prop makes width and height equal, applies full radius */}
      <Skeleton height={50} circle />

      {/* Different sizes */}
      <Skeleton height={30} circle />
      <Skeleton height={40} circle />
      <Skeleton height={60} circle />

      {/* Common use: Avatar placeholder */}
      <Skeleton height={120} circle mb="md" />
    </>
  );
}
```

### Radius Control

```jsx
import { Skeleton } from '@mantine/core';

function RadiusExamples() {
  return (
    <>
      {/* Theme radius keys */}
      <Skeleton height={50} radius="xs" mb="sm" />
      <Skeleton height={50} radius="sm" mb="sm" />
      <Skeleton height={50} radius="md" mb="sm" />
      <Skeleton height={50} radius="lg" mb="sm" />
      <Skeleton height={50} radius="xl" mb="sm" />

      {/* Custom CSS values */}
      <Skeleton height={50} radius="4px" />
      <Skeleton height={50} radius="1rem" />

      {/* Fully rounded (pill shape) */}
      <Skeleton height={30} width={100} radius="xl" />
    </>
  );
}
```

### Animation Control

```jsx
import { Skeleton } from '@mantine/core';

function AnimationExamples() {
  return (
    <>
      {/* Default animated */}
      <Skeleton height={50} mb="sm" />

      {/* Animation disabled */}
      <Skeleton height={50} animate={false} />
    </>
  );
}
```

### Responsive Sizing

```jsx
import { Skeleton } from '@mantine/core';

function ResponsiveSkeleton() {
  return (
    <>
      {/* Responsive height: 30px base, 40px sm+, 50px lg+ */}
      <Skeleton
        height={{ base: 30, sm: 40, lg: 50 }}
        mb="md"
      />

      {/* Responsive width: 100% base, 80% sm+, 60% lg+ */}
      <Skeleton
        height={50}
        width={{ base: '100%', sm: '80%', lg: '60%' }}
        mb="md"
      />

      {/* Responsive radius: sm base, md medium+, xl large+ */}
      <Skeleton
        height={50}
        radius={{ base: 'sm', md: 'md', lg: 'xl' }}
        mb="md"
      />

      {/* Combined responsive properties */}
      <Skeleton
        height={{ base: 30, sm: 40, lg: 50 }}
        width={{ base: '100%', sm: '80%', lg: '60%' }}
        radius={{ base: 'sm', md: 'md', lg: 'xl' }}
      />
    </>
  );
}
```

### Card Loading Pattern

```jsx
import { Skeleton, Stack } from '@mantine/core';

function CardSkeleton() {
  return (
    <Stack>
      {/* Header image */}
      <Skeleton height={200} radius="md" />

      {/* Avatar and title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Skeleton height={50} circle />
        <div style={{ flex: 1 }}>
          <Skeleton height={12} width="40%" radius="xl" />
          <Skeleton height={10} width="30%" radius="xl" mt={6} />
        </div>
      </div>

      {/* Content lines */}
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} width="70%" radius="xl" />
    </Stack>
  );
}
```

### List Loading Pattern

```jsx
import { Skeleton, Stack } from '@mantine/core';

function ListSkeleton() {
  return (
    <Stack spacing="md">
      {Array(5).fill(0).map((_, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Skeleton height={40} circle />
          <div style={{ flex: 1 }}>
            <Skeleton height={10} width="60%" radius="xl" />
            <Skeleton height={8} width="40%" radius="xl" mt={6} />
          </div>
        </div>
      ))}
    </Stack>
  );
}
```

### Table Loading Pattern

```jsx
import { Skeleton, Table } from '@mantine/core';

function TableSkeleton() {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th><Skeleton height={12} /></Table.Th>
          <Table.Th><Skeleton height={12} /></Table.Th>
          <Table.Th><Skeleton height={12} /></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Array(5).fill(0).map((_, index) => (
          <Table.Tr key={index}>
            <Table.Td><Skeleton height={10} /></Table.Td>
            <Table.Td><Skeleton height={10} /></Table.Td>
            <Table.Td><Skeleton height={10} /></Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
```

### With Data Fetching

```jsx
import { useState, useEffect } from 'react';
import { Skeleton, Card, Text, Group, Avatar } from '@mantine/core';

function UserProfile({ userId }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  return (
    <Card>
      <Skeleton visible={loading}>
        <Group>
          <Avatar src={user?.avatar} size="lg" radius="xl" />
          <div>
            <Text size="lg" fw={500}>{user?.name}</Text>
            <Text size="sm" c="dimmed">{user?.email}</Text>
          </div>
        </Group>
        <Text mt="md">{user?.bio}</Text>
      </Skeleton>
    </Card>
  );
}
```

### Styling Examples

```jsx
import { Skeleton } from '@mantine/core';

function StyledSkeletons() {
  return (
    <>
      {/* Using className */}
      <Skeleton
        height={50}
        className="custom-skeleton"
      />

      {/* Using inline styles */}
      <Skeleton
        height={50}
        style={{ opacity: 0.5, borderRadius: '8px' }}
      />

      {/* Using Mantine style props */}
      <Skeleton
        height={50}
        mb="md"
        mt="sm"
        mx="auto"
      />
    </>
  );
}
```

### Theme Integration

```jsx
import { createTheme, MantineProvider, Skeleton } from '@mantine/core';

// Configure theme with custom breakpoints
const theme = createTheme({
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* Skeleton uses theme breakpoints and radius values */}
      <Skeleton
        height={{ base: 30, sm: 40, lg: 50 }}
        radius="md" // Uses theme.radius.md (8px)
      />
    </MantineProvider>
  );
}
```

---

## API Reference

### Skeleton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to wrap (wrapper mode) |
| `visible` | `boolean` | `true` | Controls visibility of loading overlay (wrapper mode) |
| `animate` | `boolean` | `true` | Controls whether skeleton displays animation |
| `height` | `number \| string \| ResponsiveValue` | - | Skeleton height (px if number, or any CSS value) |
| `width` | `number \| string \| ResponsiveValue` | - | Skeleton width (px if number, or any CSS value) |
| `radius` | `MantineRadius \| ResponsiveValue` | - | Border radius (theme key or CSS value) |
| `circle` | `boolean` | `false` | Makes width, height, and radius equal (for circular skeletons) |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| ...styleProps | - | - | Mantine style props (mb, mt, mx, etc.) |

### Type Definitions

```typescript
type ResponsiveValue<T> = T | {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

type MantineRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
```

### CSS Variables

The component creates CSS variables for styling:
- `--skeleton-height` - Computed height value
- `--skeleton-width` - Computed width value
- `--skeleton-radius` - Computed border radius value

**Circle mode:**
- Width: `rem(height)` (matches height)
- Radius: `1000px` (effectively fully rounded)

---

## Notable Features

### 1. Dual Mode Operation

The Skeleton component operates in two distinct modes:

**Standalone mode** (no children):
- Creates a simple placeholder element
- Purely visual loading indicator
- Size controlled by height/width props

**Wrapper mode** (with children):
- Wraps existing content
- `visible` prop controls loading overlay
- Preserves content layout while loading

This dual-mode design is more flexible than components that only support one pattern.

### 2. Circle Prop Convenience

The `circle` prop is a developer-friendly shorthand that:
- Sets width equal to height
- Applies full border radius (1000px)
- Eliminates need to manually set width and radius for circular placeholders

Common use case: Avatar placeholders where you only need to specify size once.

### 3. Responsive Object Syntax

Full responsive support through object notation for all dimensional props:

```jsx
<Skeleton
  height={{ base: 30, sm: 40, lg: 50 }}
  width={{ base: '100%', sm: '80%', lg: '60%' }}
  radius={{ base: 'sm', md: 'md', lg: 'xl' }}
/>
```

This pattern is consistent across Mantine components and provides declarative responsive design.

### 4. Theme Integration via Radius

The `radius` prop accepts theme keys (xs, sm, md, lg, xl), creating consistency with other components and making it easy to maintain design system coherence.

```jsx
// Uses theme.radius.md value
<Skeleton height={50} radius="md" />

// Can also use custom values
<Skeleton height={50} radius="8px" />
```

### 5. Animate Toggle

Simple boolean control over animation:
- `animate={true}` (default) - Shows shimmer/pulse animation
- `animate={false}` - Static gray placeholder

Useful for:
- Reducing motion for accessibility
- Performance optimization with many skeletons
- Static wireframe views

### 6. Style Props Integration

Skeleton supports Mantine's style props system, allowing spacing and layout control without custom CSS:

```jsx
<Skeleton
  height={50}
  mb="md"  // margin-bottom
  mt="sm"  // margin-top
  mx="auto" // margin-left and margin-right
/>
```

### 7. Single Root Element

The component renders a single root element, making it straightforward to style with `className` or `style` props. Unlike multi-element components that need `classNames` (plural), Skeleton's simplicity makes styling predictable.

### 8. Flexible Dimension Values

Height and width props accept:
- **Numbers** - Interpreted as pixels
- **Strings** - Any valid CSS value ('100%', '3rem', 'calc(100% - 20px)', etc.)
- **Responsive objects** - Breakpoint-based values

This flexibility accommodates various layout scenarios without requiring wrapper elements.

---

## Usage Patterns & Best Practices

### When to Use Standalone vs Wrapper Mode

**Use standalone mode when:**
- Creating loading placeholders from scratch
- Building skeleton layouts that don't match final content exactly
- Content structure is unknown or dynamic
- Need precise control over placeholder appearance

**Use wrapper mode when:**
- Content exists and you want to overlay a loading state
- Final content structure is known
- Want to preserve exact layout during loading
- Implementing progressive enhancement

### Responsive Design Patterns

```jsx
// Mobile-first approach
<Skeleton
  height={{ base: 100, md: 150, lg: 200 }}
  width={{ base: '100%', md: '80%', lg: 600 }}
/>

// Conditional sizing based on breakpoints
<Skeleton
  height={50}
  width={{ base: '100%', sm: '80%', md: '60%', lg: 400 }}
  radius={{ base: 'md', lg: 'xl' }}
/>
```

### Common Layout Patterns

**Text content:**
```jsx
<Skeleton height={8} radius="xl" />
<Skeleton height={8} mt={6} radius="xl" />
<Skeleton height={8} mt={6} width="70%" radius="xl" />
```

**User profile:**
```jsx
<Group>
  <Skeleton height={50} circle />
  <div style={{ flex: 1 }}>
    <Skeleton height={12} width="60%" radius="xl" />
    <Skeleton height={10} width="40%" radius="xl" mt={6} />
  </div>
</Group>
```

**Card/article:**
```jsx
<Stack>
  <Skeleton height={200} radius="md" /> {/* Image */}
  <Skeleton height={16} width="70%" radius="xl" /> {/* Title */}
  <Skeleton height={8} radius="xl" />
  <Skeleton height={8} radius="xl" />
  <Skeleton height={8} width="60%" radius="xl" />
</Stack>
```

### Animation Considerations

**Disable animation when:**
- Rendering many skeletons simultaneously (performance)
- User prefers reduced motion (accessibility)
- Creating static wireframes or mockups

```jsx
import { usePrefersReducedMotion } from '@mantine/hooks';

function AccessibleSkeleton(props) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return <Skeleton animate={!prefersReducedMotion} {...props} />;
}
```

---

## Implementation Details

### Component Structure

The Skeleton component is a simple, single-element component with minimal DOM overhead:

```html
<!-- Standalone mode -->
<div class="m_[hash] m_skeleton"></div>

<!-- Wrapper mode -->
<div class="m_[hash] m_skeleton">
  <!-- children rendered here -->
</div>
```

### CSS Variables System

The component uses a `varsResolver` that creates CSS custom properties:

```javascript
// Simplified implementation concept
varsResolver: (theme, props) => ({
  root: {
    '--skeleton-height': props.height,
    '--skeleton-width': props.circle
      ? rem(props.height)
      : props.width,
    '--skeleton-radius': props.circle
      ? '1000px'
      : getRadius(props.radius),
  },
})
```

### Responsive Values

Responsive object syntax uses Mantine's breakpoint system:

```jsx
// This object...
height={{ base: 30, sm: 40, lg: 50 }}

// Generates CSS similar to:
// .skeleton { height: 30px; }
// @media (min-width: 48em) { .skeleton { height: 40px; } }
// @media (min-width: 74em) { .skeleton { height: 50px; } }
```

### Animation Implementation

The animation is CSS-based, likely using keyframe animations:

```css
/* Simplified concept */
@keyframes skeleton-shimmer {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.skeleton-animate {
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

---

## Framework Integration Notes

### React Integration

- **Hooks friendly:** Works seamlessly with useState, useEffect for loading states
- **Conditional rendering:** Easy to toggle with ternary or logical operators
- **Composition:** Nests well with other Mantine components

### TypeScript Support

Full TypeScript support with:
- Type-safe props
- Responsive value types
- IntelliSense for theme radius keys

```typescript
import { Skeleton } from '@mantine/core';
import type { MantineRadius } from '@mantine/core';

const radius: MantineRadius = 'md'; // Type-safe theme key
<Skeleton height={50} radius={radius} />
```

### Mantine Theme System

**Breakpoints:**
- Uses `theme.breakpoints` for responsive objects
- Default: xs (30em), sm (48em), md (64em), lg (74em), xl (90em)

**Radius:**
- Uses `theme.radius` for radius prop values
- Default: xs (2px), sm (4px), md (8px), lg (16px), xl (32px)

**Style Props:**
- Supports all Mantine style props (spacing, positioning, etc.)
- Consistent with other components in the library

### Server-Side Rendering

Compatible with SSR:
- No client-only dependencies
- CSS-based animation (no JavaScript animation)
- Renders consistently on server and client

---

## Comparison to Similar Components

### Strengths

1. **Dual-mode design:** Both standalone and wrapper patterns in one component
2. **Circle convenience:** Dedicated prop for circular skeletons (common use case)
3. **Responsive objects:** Declarative, breakpoint-based responsive design
4. **Theme integration:** Uses theme radius values for consistency
5. **Simple API:** Minimal props, easy to understand and use
6. **Flexible dimensions:** Accepts numbers, strings, or responsive objects
7. **Style props:** Consistent spacing and layout control

### Unique Patterns

- **`circle` prop:** More convenient than manually setting equal width/height + full radius
- **`visible` prop naming:** Clear semantic meaning for wrapper mode
- **Responsive object syntax:** Same pattern across all Mantine components
- **CSS variables:** Enables advanced customization through theme

### Limitations

- **Single animation style:** Cannot customize animation duration, easing, or type
- **No variant prop:** All skeletons have same visual style (no outlined, gradient, etc.)
- **No built-in composition:** No Skeleton.Group or similar for coordinated loading
- **Limited accessibility:** No explicit ARIA or screen reader guidance in docs

---

## Accessibility Considerations

### Current Support

The Skeleton component's accessibility is implicit rather than explicit:

1. **Visual-only indicator:** Provides visual feedback for loading state
2. **Preserves layout:** Prevents layout shift, reducing cognitive load
3. **Animation toggle:** `animate={false}` respects reduced motion preferences

### Recommended Enhancements

For better accessibility, consider:

```jsx
import { Skeleton, VisuallyHidden } from '@mantine/core';

function AccessibleSkeleton({ loading, children, ...props }) {
  return (
    <>
      {loading && <VisuallyHidden>Loading content...</VisuallyHidden>}
      <Skeleton visible={loading} {...props}>
        {children}
      </Skeleton>
    </>
  );
}
```

Or with aria-live:

```jsx
<div aria-live="polite" aria-busy={loading}>
  <Skeleton visible={loading}>
    {content}
  </Skeleton>
</div>
```

### Reduced Motion

Respect user preferences:

```jsx
import { usePrefersReducedMotion } from '@mantine/hooks';

const prefersReducedMotion = usePrefersReducedMotion();

<Skeleton
  animate={!prefersReducedMotion}
  height={50}
/>
```

---

## Key Takeaways for Implementation

1. **Dual-Mode Architecture:** Component must support both standalone (self-closing) and wrapper (with children) modes
2. **Circle Convenience:** Dedicated prop for circular skeletons is common pattern worth supporting
3. **Responsive Design:** Object syntax for breakpoint-based responsive values is user-friendly
4. **Theme Integration:** Radius values should reference theme system for consistency
5. **Animation Control:** Boolean toggle for animation is sufficient for most use cases
6. **Flexible Dimensions:** Support numbers (px), strings (any CSS), and responsive objects
7. **Visible Prop:** Clear, semantic prop name for controlling wrapper mode visibility
8. **Style Props:** Integration with spacing/layout system reduces need for custom CSS
9. **Single Root Element:** Simplified styling with className/style rather than classNames
10. **CSS Variables:** Use custom properties for dynamic styling and theme integration

---

## Research Notes

### Design Philosophy

**Simplicity over features:**
- Minimal API surface
- Single responsibility (loading placeholder)
- No variants or complex configuration
- Focus on common use cases

**Composition over configuration:**
- Simple building block
- Developers compose complex layouts
- No built-in complex patterns
- Framework provides flexibility

**Theme consistency:**
- Uses theme radius values
- Respects theme breakpoints
- Follows Mantine style prop conventions
- Integrates with CSS variable system

### Common Use Cases

1. **Avatar placeholders** - Circle prop with appropriate size
2. **Text content** - Multiple line skeletons with varying widths
3. **Card layouts** - Combination of image, avatar, and text skeletons
4. **List items** - Repeated patterns of circle + text lines
5. **Table rows** - Grid of rectangular skeletons
6. **Form fields** - Input-shaped skeletons during load
7. **Content wrappers** - Overlay on existing content with visible prop

### Implementation Priorities

**Essential features:**
- Height and width props (responsive)
- Circle prop
- Radius prop (theme integration)
- Animate prop
- Visible prop (wrapper mode)
- Style props support

**Nice-to-have features:**
- Custom animation styles
- Variant prop
- Group component for coordinated loading
- Built-in ARIA/accessibility

---

**Research Status:** Complete

**Documentation Quality:** Good - Clear examples, practical patterns, theme integration documented. Could benefit from more accessibility guidance and advanced composition examples.

**Framework Maturity:** Production-ready. Simple, well-tested pattern that handles most loading state scenarios effectively.

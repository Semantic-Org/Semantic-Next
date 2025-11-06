# Stack (Layout) - Mantine Usage Patterns

> **Framework**: Mantine
> **Component**: Stack
> **Documentation**: https://mantine.dev/core/stack/
> **Research Date**: 2025-11-05

## Component Definition

Stack is a vertical flex container component designed to compose elements and components in a columnar layout. According to the Mantine documentation: "Compose elements and components in a vertical flex container."

**Mental Model**: Stack is a specialized layout primitive that simplifies vertical arrangement of children using CSS flexbox. It abstracts away common flexbox patterns for vertical stacking, providing a declarative API for spacing, alignment, and justification.

**When to Use**:
- Arranging elements vertically with consistent spacing
- Creating vertical lists or columns of components
- Building forms with vertically stacked fields
- Any scenario requiring vertical flex layout with gap control

**When Not to Use**:
- Horizontal layouts (use Group instead)
- Complex flex layouts requiring full control (use Flex instead)

## Core Features

### Vertical Flexbox Layout
Stack uses CSS flexbox with `flex-direction: column` to arrange children vertically. This provides automatic vertical stacking without manual styling.

### Gap-Based Spacing
Stack leverages the modern CSS `gap` property to manage spacing between children elements. This is more efficient than margin-based spacing as it doesn't add space before the first or after the last child.

**Browser Compatibility Note**: The component uses flexbox gap for spacing. For older browsers that don't support gap in flexbox, a PostCSS flex-gap-polyfill is available.

### Alignment Control
Stack supports standard flexbox alignment properties, allowing control over how children align along the cross-axis (horizontally in vertical stacks) and main-axis (vertically).

### Mantine Style Props Integration
Stack accepts all Mantine style props (like `h` for height, `bg` for background) making it fully integrated with Mantine's styling system.

## Props API

### Layout Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| align | `stretch \| center \| flex-start \| flex-end` | `stretch` | Controls cross-axis alignment (horizontal alignment of children) |
| justify | `center \| flex-start \| flex-end \| space-between \| space-around` | Not specified | Controls main-axis justification (vertical distribution of children) |
| gap | `xs \| sm \| md \| lg \| xl \| number \| string` | Not specified | Spacing between children elements |

### Dimension Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| h | `number \| string` | Not specified | Height of the Stack container |

### Styling Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| bg | `string` | Not specified | Background color (accepts Mantine color tokens) |

**Note**: Stack also accepts all standard Mantine style props and polymorphic component props, which are not exhaustively listed here but follow Mantine's standard prop patterns.

## Usage Patterns

### Pattern 1: Basic Vertical Stack
**Use case**: Simple vertical arrangement of components with consistent spacing
**Implementation**: Use Stack with gap prop to control spacing between children

```tsx
<Stack gap="md">
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Pattern 2: Centered Content Stack
**Use case**: Vertically and horizontally center content within a container
**Implementation**: Combine `justify="center"` and `align="center"` with a defined height

```tsx
<Stack
  h={300}
  bg="var(--mantine-color-body)"
  align="center"
  justify="center"
  gap="md"
>
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Pattern 3: Stretched Children
**Use case**: Children should expand to fill the container's width
**Implementation**: Use default `align="stretch"` behavior

```tsx
<Stack
  h={300}
  align="stretch"
  gap="md"
>
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Pattern 4: Space Distribution
**Use case**: Distribute children evenly within the container height
**Implementation**: Use `justify` with space-between or space-around values

```tsx
<Stack
  h={300}
  justify="space-between"
  gap="md"
>
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Pattern 5: Variable Spacing
**Use case**: Different spacing sizes based on context or theme
**Implementation**: Use Mantine spacing tokens (xs, sm, md, lg, xl) for gap

```tsx
// Small spacing
<Stack gap="xs">{children}</Stack>

// Medium spacing
<Stack gap="md">{children}</Stack>

// Large spacing
<Stack gap="xl">{children}</Stack>
```

## Variants and Composition

Stack does not have built-in variants. It is a foundational layout primitive designed for composition with other components.

**Composition Patterns**:
- Stack can contain any Mantine components or custom elements
- Multiple Stacks can be nested for complex layouts
- Stack works well inside other layout components (Grid, Container, etc.)
- Stack is commonly composed with Group (for horizontal sections within vertical stacks)

## Accessibility

The documentation does not explicitly mention accessibility features. As a layout component based on standard flexbox, Stack itself has minimal accessibility concerns. Accessibility considerations depend on the content placed within Stack:

- Stack renders as a standard div with flexbox styling
- No ARIA attributes are mentioned as part of Stack's implementation
- Semantic HTML structure within Stack children remains important
- Focus order follows DOM order (top to bottom)

## Responsive Design

The documentation does not explicitly demonstrate responsive design features in the shown examples. However, as Stack accepts all Mantine style props, it likely supports:

- Responsive gap values using Mantine's responsive syntax
- Responsive height and width values
- Responsive alignment and justification
- Integration with Mantine's breakpoint system

**Note**: Specific responsive API patterns are not demonstrated in the documentation accessed.

## Theme Integration

Stack integrates with Mantine's theming system through:

### Style Props System
Stack accepts Mantine's standard style props like `bg` which can reference theme colors:
```tsx
<Stack bg="var(--mantine-color-body)">
```

### Spacing Tokens
The `gap` prop accepts Mantine's spacing scale tokens (xs, sm, md, lg, xl) which are defined in the theme:
```tsx
<Stack gap="md"> // Uses theme.spacing.md
```

### CSS Variables
Stack can use Mantine CSS custom properties for dynamic theming:
```tsx
<Stack bg="var(--mantine-color-body)">
```

## Related Components

### Group
**Purpose**: Horizontal flex container (Stack's horizontal counterpart)
**When to Use**: Use Group for horizontal layouts instead of Stack

### Flex
**Purpose**: Full flexbox control with all flex properties
**When to Use**: Use Flex when you need more control than Stack/Group provide (custom flex-direction, flex-wrap, etc.)

### Space
**Purpose**: Additional spacing component
**When to Use**: For adding spacing in specific locations rather than uniform gaps

**Component Selection Guide**:
- Vertical layout with uniform spacing → Stack
- Horizontal layout with uniform spacing → Group
- Complex flex requirements → Flex
- Custom spacing needs → Space

## Framework-Specific Features

### Mantine Style Props Integration
Stack fully integrates with Mantine's style props system, accepting all standard props like:
- Dimension props (h, w, mih, miw, mah, maw)
- Spacing props (m, p, mx, my, px, py, etc.)
- Color props (bg, c)
- Display props

### Polymorphic Component
While not explicitly shown in the documentation excerpt, Mantine components typically support polymorphic rendering (changing the underlying HTML element). Stack likely supports this pattern.

### Theme Context
Stack automatically inherits from Mantine's ThemeProvider context, using theme values for spacing scales and colors.

### PostCSS Polyfill Support
Mantine provides specific guidance for older browser support via flex-gap-polyfill, indicating framework-level consideration for progressive enhancement.

## Code Examples

### Basic Stack
```tsx
<Stack gap="md">
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Centered Stack with Background
```tsx
<Stack
  h={300}
  bg="var(--mantine-color-body)"
  align="center"
  justify="center"
  gap="md"
>
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Stretched Alignment
```tsx
<Stack
  h={300}
  bg="var(--mantine-color-body)"
  align="stretch"
  justify="center"
  gap="md"
>
  <Button variant="default">1</Button>
  <Button variant="default">2</Button>
  <Button variant="default">3</Button>
</Stack>
```

### Alignment Variations
```tsx
// Start alignment
<Stack align="flex-start" gap="md">
  {children}
</Stack>

// End alignment
<Stack align="flex-end" gap="md">
  {children}
</Stack>

// Center alignment
<Stack align="center" gap="md">
  {children}
</Stack>
```

### Justification Variations
```tsx
// Space between
<Stack justify="space-between" h={300} gap="md">
  {children}
</Stack>

// Space around
<Stack justify="space-around" h={300} gap="md">
  {children}
</Stack>

// Center
<Stack justify="center" h={300} gap="md">
  {children}
</Stack>
```

## Notes and Observations

### Simplicity by Design
Stack is intentionally simple - it's a focused component that does one thing well (vertical flexbox layout). This aligns with Mantine's philosophy of providing composable primitives.

### Gap Property Usage
The reliance on CSS `gap` property is modern and clean, but the documentation explicitly calls out the need for polyfills in older browsers. This suggests Mantine prioritizes modern CSS while acknowledging real-world browser support needs.

### Relationship to Other Layout Components
The documentation explicitly positions Stack within a hierarchy:
- Stack = vertical
- Group = horizontal
- Flex = full control

This clear distinction helps developers choose the right tool.

### Theme Integration Depth
Stack's integration with Mantine's theme system (spacing tokens, CSS variables) shows it's designed as part of a cohesive design system rather than a standalone component.

### Minimal API Surface
The props API is deliberately small - just the essential flexbox properties needed for vertical stacking. This keeps the component easy to learn and use.

### TypeScript Usage
All code examples use TypeScript (.tsx), indicating first-class TypeScript support is expected.

### No Semantic HTML Variants
Stack does not appear to offer semantic HTML rendering options (like rendering as `<section>`, `<article>`, etc.). It's purely a layout primitive. (Note: This may be available via polymorphic component props not shown in the documentation.)

### Package Distribution
Stack is part of `@mantine/core` package (v8.3.6 referenced), not a separate package, indicating it's considered a core layout primitive.

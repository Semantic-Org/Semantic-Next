# Mantine Paper Component - Usage Patterns Research

**Component:** Paper
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation:** https://mantine.dev/core/paper/
**Research Date:** 2025-11-04

---

## Component Overview

### Purpose
Paper is Mantine's **foundational container primitive** that "renders white or dark background depending on color scheme." It serves as the basic building block for creating cards, dropdowns, modals, popovers, and other elevated surface components.

### Positioning
- **Primitive Component**: Used as the base for other components in the Mantine ecosystem
- **Design Pattern**: Implements the Material Design "Paper" or "Surface" concept
- **Direct Equivalent**: Semantic UI "Segment" component (both are basic container primitives)

### Design Philosophy
- Minimal by default
- Theme-aware (automatic light/dark mode adaptation)
- Polymorphic (can render as any HTML element)
- Composable foundation layer

---

## Container Patterns

### Basic Paper
The simplest usage is as a basic container with automatic theme-aware background:

```tsx
<Paper>
  Content here
</Paper>
```

**Behavior:**
- Renders white background in light mode
- Renders dark background in dark mode
- No shadow by default
- No border by default
- No padding by default

### Paper as Primitive
Paper is explicitly designed to be **used by other components** as their foundational container:

```tsx
// Example: Modal built on Paper
<Paper shadow="xl" radius="md" p="lg">
  <Modal.Content />
</Paper>

// Example: Card built on Paper
<Paper shadow="sm" withBorder radius="md" p="md">
  <Card.Header />
  <Card.Body />
</Paper>
```

**Design Pattern:**
- Higher-level components compose Paper for consistent container behavior
- Paper provides base styling; wrapping components add semantic meaning
- Allows component library to maintain consistent elevation and theming

---

## Variation Patterns

### Shadow System

Paper supports **five shadow levels** via the `shadow` prop:

```tsx
// No shadow (default)
<Paper>Content</Paper>

// Extra small shadow
<Paper shadow="xs">Content</Paper>

// Small shadow
<Paper shadow="sm">Content</Paper>

// Medium shadow
<Paper shadow="md">Content</Paper>

// Large shadow
<Paper shadow="lg">Content</Paper>

// Extra large shadow
<Paper shadow="xl">Content</Paper>
```

**Shadow Levels:**
- `xs` - Subtle elevation (hover states, slight separation)
- `sm` - Light elevation (cards, list items)
- `md` - Medium elevation (panels, dialogs)
- `lg` - High elevation (modals, popovers)
- `xl` - Maximum elevation (dropdowns, tooltips on top of modals)

**Use Cases:**
- Create visual hierarchy through elevation
- Indicate interactive vs static elements
- Layer UI components (modals over cards, tooltips over modals)

### Border Radius

Supports **five size options** for corner rounding:

```tsx
<Paper radius="xs">Sharp corners</Paper>
<Paper radius="sm">Slightly rounded</Paper>
<Paper radius="md">Medium rounded</Paper>
<Paper radius="lg">Large rounded</Paper>
<Paper radius="xl">Extra rounded</Paper>
```

**Radius Levels:**
- `xs` - Extra small (2px, subtle)
- `sm` - Small (4px, standard)
- `md` - Medium (8px, default for many components)
- `lg` - Large (16px, friendly)
- `xl` - Extra large (32px, pill-like)

### Padding

The `p` prop controls internal spacing:

```tsx
<Paper p="xs">Compact padding</Paper>
<Paper p="sm">Small padding</Paper>
<Paper p="md">Medium padding</Paper>
<Paper p="lg">Large padding</Paper>
<Paper p="xl">Extra large padding</Paper>
```

**Padding can also be directional:**
```tsx
<Paper px="md" py="lg">Horizontal: md, Vertical: lg</Paper>
<Paper pt="xl" pb="sm">Top: xl, Bottom: sm</Paper>
```

### Border Variant

The `withBorder` prop adds a subtle border:

```tsx
<Paper withBorder>
  Content with border
</Paper>

<Paper withBorder shadow="sm">
  Bordered with shadow
</Paper>
```

**Behavior:**
- Adds theme-aware border (adapts to light/dark mode)
- Often combined with `shadow="0"` for flat, bordered cards
- Useful for creating outlined containers without elevation

---

## Interactive Patterns

### Polymorphic Component Prop

Paper is **fully polymorphic** via the `component` prop, allowing it to render as any HTML element or React component:

```tsx
// Render as button
<Paper component="button" onClick={handleClick}>
  Clickable paper
</Paper>

// Render as anchor
<Paper component="a" href="/page">
  Link paper
</Paper>

// Render with Next.js Link
<Paper component={Link} to="/page">
  Next.js navigation
</Paper>

// Render as article
<Paper component="article">
  Semantic HTML5 article
</Paper>
```

**Use Cases:**
- Interactive cards (clickable, hoverable)
- Semantic HTML elements (article, section, aside)
- Framework integration (Next.js Link, React Router Link)
- Button-like surfaces

**Type Safety:**
The polymorphic typing ensures that when you specify `component="button"`, TypeScript understands the component accepts button props like `onClick`, `disabled`, etc.

### Component as Wrapper

Paper works well with the `children` prop pattern:

```tsx
<Paper shadow="md" p="lg" withBorder>
  <Heading>Title</Heading>
  <Text>Description text</Text>
  <Button>Action</Button>
</Paper>
```

**Pattern:**
- Accept any ReactNode as children
- No slot-based composition (unlike Web Components)
- Simple children-based content projection

---

## Styling Patterns

### Styles API System

Paper implements Mantine's **Styles API** for deep customization:

```tsx
<Paper
  shadow="sm"
  radius="md"
  p="xl"
  classNames={{
    root: 'custom-paper-root'
  }}
  styles={{
    root: {
      backgroundColor: 'var(--mantine-color-blue-light)',
      borderLeft: '4px solid var(--mantine-color-blue-filled)'
    }
  }}
>
  Custom styled paper
</Paper>
```

**Styles API Elements:**
- `root` - Main container element (only element Paper exposes)

**Two Customization Approaches:**
1. **`classNames` prop**: Apply custom CSS classes
2. **`styles` prop**: Apply inline styles (CSS-in-JS)

### Design Token Integration

Paper integrates with Mantine's theme system through CSS variables:

```tsx
// Using theme spacing
<Paper p="md">Uses theme.spacing.md</Paper>

// Using theme radius
<Paper radius="md">Uses theme.radius.md</Paper>

// Using theme shadows
<Paper shadow="lg">Uses theme.shadows.lg</Paper>
```

**Theme Variables (examples):**
- `--mantine-spacing-xs/sm/md/lg/xl` - Spacing scale
- `--mantine-radius-xs/sm/md/lg/xl` - Border radius scale
- `--mantine-shadow-xs/sm/md/lg/xl` - Shadow elevation scale
- `--mantine-color-body` - Background color (theme-aware)
- `--mantine-color-border` - Border color (theme-aware)

### Style Props

Paper supports Mantine's **style props** system for inline styling:

```tsx
<Paper
  shadow="md"
  p="xl"
  m="lg"          // margin
  bg="blue.1"     // background color
  c="dark.9"      // text color
  w={400}         // width
  h={300}         // height
>
  Styled with props
</Paper>
```

**Common Style Props:**
- `p/px/py/pt/pb/pl/pr` - Padding
- `m/mx/my/mt/mb/ml/mr` - Margin
- `w/h` - Width/Height
- `bg` - Background color
- `c` - Text color

---

## Content Patterns

### Children Prop Pattern

Paper uses the simple React `children` pattern for content:

```tsx
<Paper shadow="xs" p="md">
  {/* Any ReactNode */}
  <div>Content</div>
  <Component />
  {isVisible && <ConditionalContent />}
</Paper>
```

**Characteristics:**
- Accepts any `ReactNode` (elements, strings, fragments, etc.)
- No special slot system
- No named content areas
- Maximum flexibility

### No Built-In Content Structure

Unlike higher-level components (Card, Alert), Paper provides **no content structure**:

```tsx
// Paper doesn't provide these:
// - No header/body/footer slots
// - No title prop
// - No icon prop
// - No action areas

// You structure content manually:
<Paper shadow="sm" p="md">
  <div className="header">
    <h3>Title</h3>
  </div>
  <div className="body">
    <p>Content</p>
  </div>
  <div className="footer">
    <button>Action</button>
  </div>
</Paper>
```

**Design Rationale:**
Paper is intentionally primitive - higher-level components (Card, Modal) add semantic structure.

---

## Code Examples

### Minimal Paper
```tsx
import { Paper } from '@mantine/core';

<Paper>
  Basic container with theme-aware background
</Paper>
```

### Elevated Card
```tsx
import { Paper, Text } from '@mantine/core';

<Paper shadow="md" radius="md" p="xl" withBorder>
  <Text fw={500} size="lg" mb="xs">
    Card Title
  </Text>
  <Text c="dimmed" size="sm">
    Card content with shadow, border, and padding
  </Text>
</Paper>
```

### Interactive Card
```tsx
import { Paper } from '@mantine/core';

<Paper
  component="button"
  shadow="sm"
  p="md"
  radius="md"
  withBorder
  onClick={handleClick}
  style={{ cursor: 'pointer' }}
>
  Click me - I'm a button!
</Paper>
```

### Bordered Container (No Shadow)
```tsx
import { Paper } from '@mantine/core';

<Paper withBorder p="md" radius="sm">
  Flat container with border, no elevation
</Paper>
```

### Custom Styled Paper
```tsx
import { Paper } from '@mantine/core';

<Paper
  shadow="lg"
  radius="md"
  p="xl"
  styles={{
    root: {
      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }
  }}
>
  Custom gradient background
</Paper>
```

### Responsive Paper
```tsx
import { Paper } from '@mantine/core';

<Paper
  shadow={{ base: 'sm', md: 'md', lg: 'lg' }}
  p={{ base: 'sm', md: 'md', lg: 'xl' }}
  radius={{ base: 'sm', md: 'md' }}
>
  Responsive shadow, padding, and radius
</Paper>
```

### Nested Papers (Layering)
```tsx
import { Paper } from '@mantine/core';

<Paper shadow="lg" p="xl" radius="md">
  <h2>Outer Paper</h2>

  <Paper shadow="sm" p="md" radius="sm" mt="md">
    <p>Nested Paper with less elevation</p>
  </Paper>
</Paper>
```

---

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to render inside Paper |
| `shadow` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Box shadow intensity |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| string` | - | Border radius size |
| `p` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| string` | - | Padding (all sides) |
| `px` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| string` | - | Padding horizontal |
| `py` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| string` | - | Padding vertical |
| `pt/pb/pl/pr` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| string` | - | Directional padding |
| `withBorder` | `boolean` | `false` | Add theme-aware border |
| `component` | `React.ElementType` | `'div'` | Polymorphic element/component to render |
| `classNames` | `Partial<Record<'root', string>>` | - | Custom class names for Styles API |
| `styles` | `Partial<Record<'root', CSSProperties>>` | - | Inline styles for Styles API |

**Plus all standard HTML div attributes when `component` is not specified**

### Polymorphic Props

When using `component` prop, Paper accepts all props of the specified component:

```tsx
// Button props when component="button"
<Paper component="button" onClick={fn} disabled />

// Anchor props when component="a"
<Paper component="a" href="/page" target="_blank" />

// Next.js Link props when component={Link}
<Paper component={Link} to="/page" />
```

### Styles API Elements

Paper exposes only one element for styling:

- `root` - Main container element (`<div>` by default)

### Theme Integration

Paper reads from the Mantine theme:

```tsx
// In theme configuration
const theme = createTheme({
  shadows: {
    xs: '0 1px 3px rgba(0,0,0,0.12)',
    sm: '0 1px 6px rgba(0,0,0,0.12)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 8px 24px rgba(0,0,0,0.15)',
    xl: '0 12px 48px rgba(0,0,0,0.18)',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  }
});
```

---

## Notable Features

### 1. Primitive Foundation
Paper is explicitly designed as a **low-level primitive** that other components build upon, not as an end-user-facing component. This architectural decision:
- Promotes consistency across component library
- Centralizes theme-aware container behavior
- Enables composition patterns

### 2. Theme-Aware by Default
- Automatically adapts background color for light/dark mode
- No configuration needed for color scheme switching
- Seamless integration with Mantine's theme context

### 3. Polymorphic Architecture
Full polymorphic support through `component` prop:
- Type-safe component substitution
- Framework integration (Next.js, React Router, etc.)
- Semantic HTML flexibility
- Maintains props autocomplete and type checking

### 4. Minimal Surface Area
Paper has an **intentionally small API**:
- Only essential container props (shadow, padding, radius, border)
- No content structure opinions
- No built-in behaviors or state
- Maximum composability

### 5. Styles API Integration
Follows Mantine's Styles API pattern:
- `classNames` prop for CSS modules/classes
- `styles` prop for CSS-in-JS
- Granular control over component internals
- Consistent with other Mantine components

### 6. Design Token System
Deeply integrated with Mantine's design tokens:
- Shadow scale (xs → xl)
- Spacing scale (xs → xl)
- Radius scale (xs → xl)
- Theme color system
- Responsive value support

### 7. Responsive Props
Supports object notation for responsive values:
```tsx
<Paper shadow={{ base: 'sm', md: 'lg' }} />
```

### 8. Zero Runtime Overhead for Unused Props
Props are applied conditionally - if you don't specify `shadow`, no shadow styles are applied.

---

## Research Notes

### Strengths

**Architectural:**
- Clean primitive abstraction
- Excellent composability
- Minimal API surface
- Polymorphic flexibility

**Developer Experience:**
- Simple, intuitive API
- Strong TypeScript support
- Comprehensive Styles API
- Theme integration

**Design System Integration:**
- Consistent with Material Design patterns
- Token-based styling
- Automatic theme adaptation
- Responsive value support

### Observations

**Simplicity Focus:**
- No built-in interactivity
- No state management
- No content structure
- Pure presentational component

**Composition Over Configuration:**
- Build complex components by wrapping Paper
- Don't extend Paper's API - wrap it
- Higher-level components add semantics

**Framework Conventions:**
- React-centric (JSX, props, children)
- CSS-in-JS patterns
- Theme context dependency
- Polymorphic component typing

### Comparison to Semantic UI Segment

**Similarities:**
- Both are container primitives
- Both support elevation (shadow)
- Both support padding
- Both are composable foundations

**Differences:**
- Mantine: Polymorphic `component` prop
- Mantine: Styles API for deep customization
- Mantine: Responsive prop values
- Mantine: CSS-in-JS approach
- Semantic: Web Components architecture
- Semantic: Shadow DOM encapsulation
- Semantic: Attribute-based configuration

### Integration Patterns

**Used By (in Mantine ecosystem):**
- Card component
- Modal component
- Popover component
- Menu/Dropdown components
- Alert component (potentially)
- Notification component (potentially)

**Common Combinations:**
```tsx
// Paper + Text (simple card)
<Paper><Text>Content</Text></Paper>

// Paper + Stack (vertical layout)
<Paper><Stack>Items</Stack></Paper>

// Paper + Group (horizontal layout)
<Paper><Group>Items</Group></Paper>

// Paper as Link
<Paper component={Link}>Clickable card</Paper>
```

### Implementation Details

**CSS-in-JS Approach:**
- Uses Emotion or similar CSS-in-JS library
- Generates scoped class names
- Supports `classNames` and `styles` props
- Theme values injected as CSS variables

**Polymorphic Implementation:**
```tsx
// Simplified type signature
type PaperProps<C extends ElementType = 'div'> = {
  component?: C;
  shadow?: ShadowValue;
  radius?: RadiusValue;
  p?: SpacingValue;
  withBorder?: boolean;
  children?: ReactNode;
} & ComponentPropsWithoutRef<C>;
```

**Responsive Values:**
```tsx
// Object notation for breakpoints
<Paper shadow={{ base: 'sm', md: 'md', lg: 'lg' }} />

// Translates to media queries in generated CSS
```

### Accessibility

**Minimal Accessibility Surface:**
- No built-in ARIA attributes (it's a div by default)
- Polymorphic nature allows semantic HTML
- When used as button/link, accessibility comes from element type

**Recommended Practices:**
```tsx
// Use semantic elements when appropriate
<Paper component="article" aria-labelledby="title">
  <h2 id="title">Article Title</h2>
</Paper>

// Add roles when needed
<Paper role="region" aria-label="Card content">
  Content
</Paper>
```

---

## Key Takeaways for Cross-Framework Analysis

1. **Terminology**: "Paper" follows Material Design naming (vs "Segment" in Semantic UI, "Card" in others)
2. **Primitive Philosophy**: Explicitly designed as foundational primitive, not end-user component
3. **Polymorphic Pattern**: Deep React integration with polymorphic typing
4. **Composition Over Inheritance**: Build complex components by wrapping, not extending
5. **Theme-First Design**: Automatic theme adaptation is core feature
6. **Minimal API**: Only essential container properties exposed
7. **Styles API**: Granular customization through established pattern
8. **Design Tokens**: Five-tier scale for shadow/spacing/radius
9. **Zero Built-In Behavior**: Pure presentational component
10. **Framework Integration**: Designed for React ecosystem patterns

---

**Research Status:** Complete
**Documentation Quality:** Good - clear examples and API reference with Styles API details
**Framework Maturity:** Production-ready primitive component with strong TypeScript support
**Architectural Pattern:** Foundational primitive for building higher-level components

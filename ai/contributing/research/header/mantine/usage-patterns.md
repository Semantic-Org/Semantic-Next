# Mantine AppShell.Header Component - Usage Patterns Research

**Component:** AppShell.Header
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation URL:** https://mantine.dev/core/app-shell/
**Research Date:** 2025-11-05

---

## Component Definition

### AppShell.Header Component

**Core purpose:** A fixed-position header element within the Mantine AppShell layout system. Provides the top navigation/branding area of an application with automatic offset handling for the main content area.

**Mental model:** Think of it as the application's top bar or navigation strip that remains at the top of the viewport while content scrolls beneath. Part of a larger layout system that manages the spatial relationship between header, sidebar, footer, and main content.

**Semantic meaning:** Represents the structural header of an application layout. Renders as an HTML `<header>` element. Maintains fixed positioning with automatic z-index stacking. Designed to work within AppShell's layout coordination system.

**Primary use cases:**
- Top navigation bars
- Application headers with branding
- Action toolbars at the top of layouts
- Tab navigation strips
- Mobile navigation headers
- Combined with sidebars for complex layouts
- Sticky/persistent navigation across page scrolling

---

## Component Architecture & Positioning

### AppShell Layout Context

AppShell.Header is part of a larger component system:

```jsx
<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300 }}
  footer={{ height: 60 }}
>
  <AppShell.Header>Header content</AppShell.Header>
  <AppShell.Navbar>Navigation</AppShell.Navbar>
  <AppShell.Main>Main content</AppShell.Main>
  <AppShell.Footer>Footer content</AppShell.Footer>
</AppShell>
```

**Key principle:** Header configuration (height, visibility, offset) is declared in AppShell's `header` prop, not directly on the Header component itself.

### Positioning Behavior

**Fixed positioning:** AppShell.Header uses fixed positioning by default
- Remains at the top of the viewport
- Does not scroll with page content
- Overlays content by default without offset
- Z-index managed by AppShell (default: 200+)

**Offset configuration:** Whether main content is offset by header height
- `offset: true` - AppShell.Main gets top padding equal to header height
- `offset: false` - AppShell.Main receives no padding; header may overlay content

---

## Height Control

### Static Height Configuration

**Number value (most common):**
```jsx
<AppShell header={{ height: 60 }}>
  // Header with 60px height
</AppShell>
```

**Behavior:**
- Applied uniformly across all viewport sizes
- Uses pixel values internally
- Simple, predictable sizing
- Ideal for fixed-size headers

### Responsive Height Configuration

**Object with breakpoint keys:**
```jsx
<AppShell header={{
  height: {
    base: 48,      // Mobile: 48px
    sm: 60,        // Small: 60px
    md: 70,        // Medium: 70px
    lg: 80,        // Large: 80px
  }
}}>
```

**Behavior:**
- Different heights at different viewport sizes
- Uses Mantine's standard breakpoint system
- Header height changes at breakpoint thresholds
- Useful for adaptive layouts (e.g., taller on desktop)

### Height Presets

Common height values:

| Height | Use Case |
|--------|----------|
| 40-48px | Compact headers (mobile-first) |
| 56-60px | Standard headers with single line content |
| 64-70px | Headers with icons + text + actions |
| 80-100px | Large headers with multiple content sections |
| 120px+ | Hero-style headers with prominent branding |

### Dynamic Height Considerations

**Important limitation:** Header height is declared in AppShell props, not set dynamically on the component.

```jsx
// ✅ CORRECT: Configure in AppShell
<AppShell header={{ height: 60 }}>
  <AppShell.Header>Content</AppShell.Header>
</AppShell>

// ❌ ANTI-PATTERN: Can't override on component
<AppShell header={{ height: 60 }}>
  <AppShell.Header style={{ height: 80 }}>
    Height change won't work as expected
  </AppShell.Header>
</AppShell>
```

**Consequence:** Dynamic height changes require AppShell prop updates, not component-level styles.

---

## Offset Pattern & Content Layout

### Offset Behavior

The `offset` property determines spatial relationship between header and main content:

```jsx
<AppShell header={{ height: 60, offset: true }}>
  <AppShell.Header>Navigation</AppShell.Header>
  <AppShell.Main>
    {/* Main has top padding equal to header height */}
  </AppShell.Main>
</AppShell>
```

**offset: true (default)**
- AppShell.Main gets `paddingTop: headerHeight`
- Header appears above content
- No overlap or layering issues
- Clean separation between header and main area

**offset: false**
```jsx
<AppShell header={{ height: 60, offset: false }}>
  <AppShell.Header>Navigation</AppShell.Header>
  <AppShell.Main>
    {/* No padding; content extends under header */}
  </AppShell.Main>
</AppShell>
```

- AppShell.Main receives no padding
- Header overlays content (fixed positioning)
- Main content starts at top of viewport
- Header floats above content
- Useful for full-bleed backgrounds and hero sections

### Use Cases for offset: false

**Scroll-based header hiding:**
```jsx
import { useHeadroom } from '@mantine/hooks';

function AppWithHideableHeader() {
  const headroom = useHeadroom();

  return (
    <AppShell header={{ height: 60, offset: false }}>
      <AppShell.Header
        style={{
          transform: `translateY(${headroom.isScroll ? '-100%' : '0px'})`,
          transition: 'transform 300ms ease'
        }}
      >
        Navigation
      </AppShell.Header>
      <AppShell.Main>
        {/* Content fills viewport; scrolls under header */}
      </AppShell.Main>
    </AppShell>
  );
}
```

**Full-bleed hero section:**
```jsx
<AppShell header={{ height: 60, offset: false }}>
  <AppShell.Header>Navigation bar</AppShell.Header>
  <AppShell.Main>
    <div style={{ height: 400, background: 'linear-gradient(...)' }}>
      {/* Hero extends behind header */}
    </div>
  </AppShell.Main>
</AppShell>
```

**Parallax scrolling:**
```jsx
// With offset: false, header can have parallax effect
// relative to content scrolling beneath it
```

---

## Responsive Behavior

### Breakpoint-Based Sizing

Mantine's standard breakpoints:

```
xs: 576px   (extra small)
sm: 768px   (small)
md: 992px   (medium)
lg: 1200px  (large)
xl: 1408px  (extra large)
```

### Responsive Header Example

```jsx
<AppShell
  header={{
    height: {
      base: 48,    // 0-576px: 48px
      sm: 56,      // 576-768px: 56px
      md: 64,      // 768-992px: 64px
      lg: 72,      // 992px+: 72px
    }
  }}
>
  <AppShell.Header>
    {/* Layout adapts to height changes */}
  </AppShell.Header>
</AppShell>
```

### Responsive Content Within Header

Header content itself should be responsive:

```jsx
<AppShell header={{ height: { base: 48, md: 64 } }}>
  <AppShell.Header>
    <Group justify="space-between" align="center" h="100%">
      {/* Logo and branding */}
      <Logo />

      {/* Navigation - hidden on mobile via media query/display */}
      <Group gap="md" visibleFrom="sm">
        <NavLink>Home</NavLink>
        <NavLink>About</NavLink>
      </Group>

      {/* Mobile menu toggle - only on small screens */}
      <Burger hiddenFrom="sm" />
    </Group>
  </AppShell.Header>
</AppShell>
```

### Mobile-First Approach

Header typically:
- Starts compact on mobile (48px with icon + hamburger)
- Grows to include more content on tablet (56px)
- Fully displays on desktop (64-72px with full navigation)

---

## Border & Visual Styling

### Default Border Behavior

**AppShell.Header includes bottom border by default:**

```jsx
<AppShell header={{ height: 60 }}>
  <AppShell.Header>
    {/* Renders with a subtle bottom border separating it from content */}
  </AppShell.Header>
</AppShell>
```

**Purpose:**
- Visual separation between header and main content
- Provides visual anchor for fixed header
- Communicates structural hierarchy

### Disabling Border

**Via `withBorder` prop:**

```jsx
<AppShell header={{ height: 60, withBorder: false }}>
  <AppShell.Header>
    {/* No bottom border */}
  </AppShell.Header>
</AppShell>
```

**Use cases:**
- Seamless header when using gradient/color that continues
- Minimalist designs without visual separators
- Headers with custom bottom styling
- Full-bleed designs where border would interrupt visual flow

### Custom Border Styling

**Via theme/styles:**
```jsx
<AppShell
  header={{
    height: 60,
    withBorder: true
  }}
  styles={{
    header: {
      borderBottomColor: 'blue',
      borderBottomWidth: '2px',
    }
  }}
>
  <AppShell.Header>Custom border</AppShell.Header>
</AppShell>
```

---

## Z-Index Management

### Default Z-Index

**AppShell manages z-index stacking automatically:**

- Header z-index: typically 200+ by default
- Ensures header stays above other content
- Configurable via AppShell props

### Z-Index Customization

```jsx
<AppShell
  header={{ height: 60, zIndex: 300 }}
>
  <AppShell.Header>
    {/* Raised z-index if needed for specific layouts */}
  </AppShell.Header>
</AppShell>
```

**Use cases:**
- Modals/drawers that should appear above header
- Complex stacking contexts
- Third-party component integration

### Z-Index Considerations

- Keep header z-index lower than modals (typically 1000+)
- Higher than general page content (which defaults to auto/0)
- AppShell's coordinator usually handles this correctly

---

## Code Examples

### Basic Header

```jsx
import { AppShell, Header, Group, Title, Button } from '@mantine/core';

export function BasicHeader() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1} size="h3">My App</Title>
          <Button>Login</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {/* Page content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Header with Navigation

```jsx
import { AppShell, Header, Group, Button, Burger, Drawer } from '@mantine/core';
import { useState } from 'react';

export function HeaderWithNav() {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1} size="h3">Logo</Title>

          {/* Desktop Navigation */}
          <Group gap="md" visibleFrom="sm">
            <Button variant="subtle">Home</Button>
            <Button variant="subtle">About</Button>
            <Button variant="subtle">Contact</Button>
          </Group>

          {/* Mobile Menu Toggle */}
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            hiddenFrom="sm"
          />
        </Group>
      </AppShell.Header>

      {/* Mobile Menu */}
      <Drawer opened={opened} onClose={() => setOpened(false)}>
        {/* Mobile navigation items */}
      </Drawer>

      <AppShell.Main>
        {/* Content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Responsive Header

```jsx
import { AppShell, Header, Group, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconMenu2, IconSearch } from '@tabler/icons-react';

export function ResponsiveHeader() {
  const theme = useMantineTheme();

  return (
    <AppShell
      header={{
        height: {
          base: 48,
          sm: 56,
          md: 64
        }
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1} size={{ base: 'h4', md: 'h3' }}>
            App
          </Title>

          {/* Actions - adjust based on size */}
          <Group gap={0}>
            <ActionIcon
              variant="subtle"
              size={{ base: 'sm', md: 'md' }}
            >
              <IconSearch />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              size={{ base: 'sm', md: 'md' }}
            >
              <IconMenu2 />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {/* Content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Header with Offset Control

```jsx
import { AppShell, Header, Group, Button } from '@mantine/core';

export function HeaderWithScrolling() {
  return (
    <AppShell
      header={{
        height: 60,
        offset: false  // Content can scroll under header
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1}>Navigation</Title>
          <Button>Menu</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {/* Content extends behind header */}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Header with Hide-on-Scroll

```jsx
import { AppShell, Header, Group, Title, useHeadroom } from '@mantine/core';

export function HeaderHideOnScroll() {
  const headroom = useHeadroom();

  return (
    <AppShell
      header={{
        height: 60,
        offset: false
      }}
    >
      <AppShell.Header
        style={{
          transform: `translateY(${headroom.isScroll ? '-100%' : '0px'})`,
          transition: 'transform 300ms ease',
        }}
      >
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1}>Hide on Scroll</Title>
          <Button>Action</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {/* Long scrollable content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Complex Layout with Sidebar and Header

```jsx
import { AppShell, Header, Navbar, Footer, Container } from '@mantine/core';

export function ComplexLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
      footer={{ height: 60 }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1}>App Header</Title>
          {/* Navigation items */}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        {/* Sidebar navigation */}
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          {/* Main content */}
        </Container>
      </AppShell.Main>

      <AppShell.Footer>
        {/* Footer content */}
      </AppShell.Footer>
    </AppShell>
  );
}
```

### Header with No Bottom Border

```jsx
import { AppShell, Header, Group, Button } from '@mantine/core';

export function HeaderNoBorder() {
  return (
    <AppShell
      header={{
        height: 60,
        withBorder: false
      }}
    >
      <AppShell.Header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Group justify="space-between" align="center" h="100%" px="md">
          <Title order={1} c="white">
            Gradient Header
          </Title>
          <Button color="white" variant="subtle">Action</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {/* Content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

---

## API Reference

### AppShell.Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Header content |
| `className` | `string` | - | CSS class name |
| `style` | `CSSProperties` | - | Inline styles |

### AppShell Header Configuration (via AppShell `header` prop)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `height` | `number \| object` | - | Static or responsive header height (px) |
| `offset` | `boolean` | `true` | Whether main content is offset by header height |
| `withBorder` | `boolean` | `true` | Whether to display bottom border |
| `zIndex` | `number` | `200+` | CSS z-index stacking level |

### Example Configuration Structure

```jsx
<AppShell
  header={{
    height: 60,              // or { base: 48, md: 60 }
    offset: true,            // default
    withBorder: true,        // default
    zIndex: 200              // default (typically)
  }}
>
  {/* AppShell content */}
</AppShell>
```

---

## Notable Features & Patterns

### 1. AppShell Coordination System

**Key strength:** Header works within AppShell's coordinated layout system

- AppShell manages relationships between header, navbar, footer, main
- Automatic spacing/offsetting between components
- Single source of truth for layout dimensions
- Prevents overlapping and layout shift bugs

**Example:**
```jsx
// AppShell automatically handles spacing relationships
<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300, breakpoint: 'sm' }}
  footer={{ height: 60 }}
>
  {/* Header, Navbar, Footer are automatically spaced correctly */}
</AppShell>
```

### 2. Flexible Offset Strategy

**offset property enables two distinct use patterns:**

**Pattern A: Traditional offset (offset: true)**
- Content starts below header
- No overlap
- Simplest, most common pattern
- Good for static headers

**Pattern B: Overlay design (offset: false)**
- Header floats over content
- Content can extend under header
- Enables hide-on-scroll, full-bleed designs
- More advanced use cases

### 3. Responsive Height System

**Heights can be different per breakpoint:**

```jsx
header={{
  height: {
    base: 48,    // Mobile
    sm: 56,      // Tablet
    md: 64,      // Desktop
    lg: 72       // Large desktop
  }
}}
```

**Advantage:** Adapts visual hierarchy to screen size without code duplication

### 4. Border Control

**`withBorder` property provides simple visual separation:**

- Enabled by default (common pattern)
- Easily disabled for seamless designs
- Mantine's theme controls border color/width
- Subtle but effective visual cue

### 5. Use-Headroom Hook Integration

**Mantine provides `useHeadroom` for hide-on-scroll behavior:**

```jsx
const headroom = useHeadroom();
// Use headroom.isScroll to conditionally hide header
```

**Enables modern scroll-based header patterns without custom scroll listeners**

---

## Comparison to Other Frameworks

### vs Material-UI AppBar

**Similarities:**
- Fixed positioning at top
- Often contains navigation/branding
- Works within layout system
- Customizable styling

**Differences:**
- Mantine: Explicit offset configuration (offset property)
- MUI: Offset via `position` and CSS utilities
- Mantine: Part of AppShell system (coordinated layout)
- MUI: AppBar is standalone component

### vs Chakra UI Container

**Similarities:**
- React component wrapping content
- Responsive sizing

**Differences:**
- Mantine: Header (layout role) vs Chakra (container/wrapper role)
- Mantine: Fixed positioning by design
- Chakra: No equivalent coordinated layout system

### vs HTML `<header>`

**Semantic relationship:**
- AppShell.Header renders as `<header>` element
- Adds layout functionality via AppShell coordination
- Maintains semantic meaning while adding framework features

---

## Design Patterns Worth Noting

### 1. Hide-on-Scroll Pattern

Common modern pattern where header hides when scrolling down, reappears when scrolling up:

```jsx
const headroom = useHeadroom();
<AppShell.Header
  style={{
    transform: `translateY(${headroom.isScroll ? '-100%' : '0'})`
  }}
/>
```

**Benefits:**
- Maximizes vertical space during reading
- Header available when needed (top of page)
- Smooth, familiar interaction

### 2. Full-Width with Offset Content

Header takes full width while content is constrained:

```jsx
<AppShell header={{ height: 60, offset: false }}>
  <AppShell.Header style={{ width: '100%' }}>
    {/* Full viewport width */}
  </AppShell.Header>

  <AppShell.Main>
    <Container>
      {/* Constrained content below */}
    </Container>
  </AppShell.Main>
</AppShell>
```

### 3. Dynamic Height Awareness

Content layout must respect dynamic header heights:

```jsx
<AppShell header={{ height: { base: 48, md: 64 } }}>
  {/* Layout adapts as header height changes */}
</AppShell>
```

**Important:** Avoid hardcoded pixel values for layout; use flexible sizing.

---

## Implementation Notes

### Inferred Shadow DOM / Structure

AppShell.Header likely renders as:

```html
<header class="mantine-AppShell-header" style="height: 60px; position: fixed; top: 0; ...">
  {/* User-provided children */}
</header>
```

**Key CSS properties:**
- `position: fixed` - Stays at top of viewport
- `top: 0` - Aligns to viewport top
- `width: 100%` - Spans full viewport width
- `z-index: 200+` - Stays above content
- `height: [value]` - From configuration
- `border-bottom` - If withBorder enabled

### Performance Considerations

1. **Scroll event handling** - useHeadroom likely uses RAF for smooth animations
2. **Fixed positioning** - Usually performant (GPU-accelerated in modern browsers)
3. **No JavaScript overhead** - Layout system handles spacing; no layout recalculation on content scroll

### Accessibility Considerations

- Header renders as semantic `<header>` element
- Landmark role automatically recognized
- Navigation patterns should include skip links
- Focus management important for keyboard users
- Content hierarchy clear (heading hierarchy)

---

## Usage Patterns Summary

### When to Use AppShell.Header

✅ **Use AppShell.Header for:**
- Application top navigation
- Fixed branding/logo areas
- Top-level action toolbars
- Persistent navigation across pages
- Scroll-aware hiding patterns
- Complex layouts with sidebar/footer coordination

❌ **Don't use AppShell.Header for:**
- Simple page-level headers (use HTML `<header>`)
- Section-specific headers (use `<header>` or semantics)
- Non-fixed headers (use standard page flow)
- Headers within content (not layout-level)

### Common Patterns

**Standard offset layout:**
```jsx
<AppShell header={{ height: 60, offset: true }}>
  <AppShell.Header>Navigation</AppShell.Header>
  <AppShell.Main>Content starts below header</AppShell.Main>
</AppShell>
```

**Hide-on-scroll:**
```jsx
<AppShell header={{ height: 60, offset: false }}>
  <AppShell.Header>Header hides while scrolling</AppShell.Header>
  <AppShell.Main>Content scrolls under header</AppShell.Main>
</AppShell>
```

**Responsive sizing:**
```jsx
<AppShell header={{ height: { base: 48, md: 60 } }}>
  {/* Height adapts to screen size */}
</AppShell>
```

**No border variant:**
```jsx
<AppShell header={{ height: 60, withBorder: false }}>
  {/* Seamless header without visual separator */}
</AppShell>
```

---

## Research Metadata

**Research Completeness:** ✅ Comprehensive
- All major props documented
- Key patterns illustrated with code
- Offset behavior thoroughly explained
- Integration with AppShell system explained
- Responsive behavior detailed

**Documentation Gaps Identified:**
- Limited examples of advanced patterns (hide-on-scroll not extensively documented)
- No explicit accessibility guidelines
- Migration patterns from other frameworks absent
- Performance implications not discussed

**Unique Patterns Worth Noting:**
1. Coordinated AppShell layout system (unusual for component libraries)
2. Explicit offset control (offset property)
3. Responsive height object syntax
4. Integration with useHeadroom hook for scroll behavior

**Framework Maturity:** Production-ready
- Stable API (part of core @mantine/core)
- Well-integrated with Mantine theme system
- Handles complex layout scenarios
- No reported major issues

---

**Research Status:** Complete
**Quality Assessment:** Excellent - Well-designed component with clear patterns and good integration with layout system
**Recommended for Cross-Framework Study:** Yes - particularly the coordinated layout system approach and offset pattern


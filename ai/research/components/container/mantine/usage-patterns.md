# Mantine Container Component - Usage Patterns Research

**Component:** Container
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation URL:** https://mantine.dev/core/container/
**Research Date:** 2025-11-04

---

## Component Definition

### Container Component
**Core purpose:** A layout wrapper component that centers content horizontally and constrains its maximum width. Acts as a content container for maintaining consistent page layouts.

**Mental model:** Think of a physical container or frame that holds content within defined boundaries while keeping it centered on the page. Similar to the `.container` class in Bootstrap or the `Container` component in Material-UI.

**Semantic meaning:** Provides semantic page structure by defining content boundaries. Not interactive - purely presentational/structural. Establishes the primary content area width and centering.

**Primary use cases:**
- Page layout wrapper to constrain content width
- Section containers for consistent sizing across layouts
- Responsive content boundaries that adapt to viewport
- Grid-based layout foundations with breakout capabilities

---

## Documentation Quality

**Overall Quality:** Good - Clear examples with live demos, comprehensive API reference, and advanced pattern examples (grid strategy, responsive sizing)

**Strengths:**
- Multiple working examples demonstrating key features
- Clear distinction between block and grid strategies
- Advanced patterns documented (breakout, responsive sizes)
- Theme integration examples

**Gaps:**
- Limited explanation of size preset values (actual pixel values not shown in docs)
- No explicit accessibility guidance
- Padding system could be more thoroughly explained
- Missing migration examples from other frameworks

---

## Pattern Support Levels

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Size Patterns** | | | |
| Preset sizes | ✅ | Native | xs, sm, md, lg, xl size presets |
| Custom sizes | ✅ | Native | Numeric pixel values (e.g., 480) |
| Fluid mode | ✅ | Native | `fluid` prop for 100% width |
| Percentage sizes | ✅ | Native | String percentage values (e.g., "100%") |
| Responsive sizes | ✅ | Composed | Via Styles API and media queries |
| **Layout Patterns** | | | |
| Centering | ✅ | Native | Auto margin-based centering |
| Max-width constraint | ✅ | Native | Size-based max-width limiting |
| Padding control | ✅ | Native | `px` prop for horizontal padding |
| Block strategy | ✅ | Native | Default display: block with inline styles |
| Grid strategy | ✅ | Native | Display: grid for advanced layouts (v8.2.0+) |
| **Advanced Patterns** | | | |
| Content breakout | ✅ | Native | `data-breakout` attribute (grid strategy) |
| Nested containers | ✅ | Native | `data-container` for grid alignment |
| Theme integration | ✅ | Native | Custom sizes via theme configuration |
| **Customization** | | | |
| Styles API | ✅ | Native | `classNames` and `styles` props |
| Component extension | ✅ | Native | Via `createTheme` component defaults |
| CSS variables | ✅ | Native | Custom size presets via CSS vars |

---

## Code Examples

### Basic Usage

```jsx
import { Container } from '@mantine/core';

// Default container (uses 'md' size preset by default)
<Container>
  <p>Your content here</p>
</Container>

// With explicit size preset
<Container size="lg">
  <p>Large container content</p>
</Container>

// Extra small container
<Container size="xs">
  <p>Narrow content column</p>
</Container>
```

### Size Presets

```jsx
// All available preset sizes
<Container size="xs">Extra small container</Container>
<Container size="sm">Small container</Container>
<Container size="md">Medium container (default)</Container>
<Container size="lg">Large container</Container>
<Container size="xl">Extra large container</Container>
```

### Custom Sizes

```jsx
// Custom pixel value
<Container size={480}>
  <p>Container with max-width of 480px</p>
</Container>

// Custom string value
<Container size="600px">
  <p>Container with max-width of 600px</p>
</Container>

// Percentage-based
<Container size="90%">
  <p>Container taking 90% of parent width</p>
</Container>
```

### Fluid Container

```jsx
// Full-width container (100% viewport width)
<Container fluid>
  <p>This spans the full width of the viewport</p>
</Container>

// Equivalent to:
<Container size="100%">
  <p>This spans the full width of the viewport</p>
</Container>
```

### Padding Control

```jsx
// Custom horizontal padding
<Container px="xl">
  <p>Container with extra-large padding</p>
</Container>

// Remove default padding
<Container px={0}>
  <p>No horizontal padding</p>
</Container>

// Responsive padding using Mantine size values
<Container px={{ base: 'md', sm: 'lg', lg: 'xl' }}>
  <p>Responsive padding that increases with viewport</p>
</Container>

// Specific pixel padding
<Container px={24}>
  <p>Container with 24px horizontal padding</p>
</Container>
```

### Block Strategy (Default)

```jsx
// Default behavior - uses display: block
<Container strategy="block" size="md">
  <p>Standard block container with inline styles</p>
  <p>Max-width and padding applied via inline CSS</p>
</Container>

// This is the default, so strategy prop can be omitted
<Container size="md">
  <p>Same as above - block is default</p>
</Container>
```

### Grid Strategy (Advanced)

```jsx
// Grid-based container (v8.2.0+)
<Container strategy="grid" size="lg">
  <p>Container using CSS Grid layout</p>
  <p>Enables advanced breakout features</p>
</Container>
```

### Content Breakout Pattern

```jsx
// Grid strategy with breakout capability
<Container strategy="grid" size="md">
  <h2>Regular content within container bounds</h2>
  <p>This stays within the max-width constraint.</p>

  {/* Element that breaks out of container */}
  <div data-breakout>
    <img
      src="/full-width-image.jpg"
      alt="Full bleed"
      style={{ width: '100%' }}
    />
  </div>

  <p>Back to constrained content</p>
</Container>
```

### Nested Container in Breakout

```jsx
// Breakout with nested container maintaining alignment
<Container strategy="grid" size="md">
  <p>Main container content</p>

  {/* Full-width section with nested aligned content */}
  <div data-breakout style={{ backgroundColor: '#f0f0f0' }}>
    <div data-container>
      <h3>This content aligns with main container</h3>
      <p>Even though parent breaks out to full width</p>
    </div>
  </div>

  <p>More main content</p>
</Container>
```

### Responsive Container Sizes

```jsx
// Custom responsive max-width using Styles API
import { Container } from '@mantine/core';
import classes from './Demo.module.css';

function ResponsiveContainer() {
  return (
    <Container size="responsive" classNames={classes}>
      <p>This container has different max-widths at different breakpoints</p>
    </Container>
  );
}

// Demo.module.css
/*
.root {
  max-width: 100%;
}

@media (min-width: 48em) {
  .root {
    max-width: 600px;
  }
}

@media (min-width: 62em) {
  .root {
    max-width: 900px;
  }
}

@media (min-width: 75em) {
  .root {
    max-width: 1200px;
  }
}
*/
```

### Theme Integration - Custom Sizes

```jsx
import { MantineProvider, createTheme, Container } from '@mantine/core';

const theme = createTheme({
  components: {
    Container: {
      defaultProps: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1320,
          xxl: 1600,  // Custom size
        },
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Container size="xxl">
        <p>Custom extra-extra-large container</p>
      </Container>
    </MantineProvider>
  );
}
```

### Styles API Customization

```jsx
// Using classNames prop
<Container
  size="md"
  classNames={{
    root: 'custom-container-root'
  }}
>
  <p>Container with custom CSS class</p>
</Container>

// Using inline styles
<Container
  size="lg"
  styles={{
    root: {
      backgroundColor: 'var(--mantine-color-gray-0)',
      paddingTop: 'var(--mantine-spacing-xl)',
      paddingBottom: 'var(--mantine-spacing-xl)',
    }
  }}
>
  <p>Container with custom inline styles</p>
</Container>

// Combined approach
<Container
  size="md"
  classNames={{ root: 'page-container' }}
  styles={{
    root: {
      minHeight: '100vh',
    }
  }}
>
  <p>Combined styling approach</p>
</Container>
```

### Component Variants Pattern

```jsx
// Define reusable container variants
function NarrowContainer({ children }) {
  return (
    <Container size="xs" px="md">
      {children}
    </Container>
  );
}

function ArticleContainer({ children }) {
  return (
    <Container size={720} px="xl">
      {children}
    </Container>
  );
}

function FullBleedContainer({ children }) {
  return (
    <Container fluid px={0}>
      {children}
    </Container>
  );
}

// Usage
<ArticleContainer>
  <h1>Article Title</h1>
  <p>Article content...</p>
</ArticleContainer>
```

### Layout Composition Pattern

```jsx
// Using Container as page layout foundation
function PageLayout({ children }) {
  return (
    <>
      {/* Full-width header */}
      <header style={{ backgroundColor: '#000' }}>
        <Container size="xl" py="md">
          <Logo />
          <Navigation />
        </Container>
      </header>

      {/* Main content area */}
      <main>
        <Container size="lg" py="xl">
          {children}
        </Container>
      </main>

      {/* Full-width footer */}
      <footer style={{ backgroundColor: '#222' }}>
        <Container size="xl" py="lg">
          <FooterContent />
        </Container>
      </footer>
    </>
  );
}
```

### Advanced Grid Layout with Breakout

```jsx
// Complex layout using grid strategy
<Container strategy="grid" size="lg">
  {/* Regular content */}
  <article>
    <h1>Article Title</h1>
    <p>Introduction paragraph within container bounds...</p>
  </article>

  {/* Full-width quote with aligned content */}
  <div
    data-breakout
    style={{
      backgroundColor: 'var(--mantine-color-blue-0)',
      padding: 'var(--mantine-spacing-xl) 0'
    }}
  >
    <div data-container>
      <blockquote style={{ fontSize: '1.5rem' }}>
        "This quote breaks out visually but text aligns with main content"
      </blockquote>
    </div>
  </div>

  {/* Continue regular content */}
  <article>
    <h2>Next Section</h2>
    <p>More content aligned with container...</p>
  </article>

  {/* Full-width image gallery */}
  <div data-breakout>
    <ImageGallery images={images} />
  </div>

  {/* Final content */}
  <article>
    <h2>Conclusion</h2>
    <p>Final thoughts...</p>
  </article>
</Container>
```

---

## API Reference

### Container Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number` | `'md'` | Max-width preset or custom value (px, %, etc.) |
| `fluid` | `boolean` | `false` | Full-width mode (100% width), equivalent to `size="100%"` |
| `px` | `MantineSpacing` | Default spacing | Horizontal padding (left and right) |
| `py` | `MantineSpacing` | `undefined` | Vertical padding (top and bottom) |
| `strategy` | `'block' \| 'grid'` | `'block'` | Layout strategy - block uses inline styles, grid enables breakout features |
| `children` | `ReactNode` | - | Container content |
| `classNames` | `Partial<Record<'root', string>>` | - | Custom class names for Styles API |
| `styles` | `Partial<Record<'root', CSSProperties>>` | - | Inline styles for Styles API |

**Note:** MantineSpacing type accepts: `xs`, `sm`, `md`, `lg`, `xl`, number (pixels), or responsive object

### Styles API Elements

- `root` - Main container element

### Data Attributes (Grid Strategy Only)

- `data-breakout` - Applied to child elements to break out of container max-width
- `data-container` - Applied within breakout elements to re-align content with parent container

---

## Notable Features

### 1. Dual Strategy System

Container offers two distinct layout strategies:

**Block Strategy (Default):**
- Uses `display: block` with auto margins for centering
- Max-width and padding applied via inline styles
- Simpler, more predictable behavior
- Best for standard container use cases

**Grid Strategy (v8.2.0+):**
- Uses `display: grid` as foundation
- Enables advanced breakout patterns
- Supports `data-breakout` and `data-container` attributes
- More powerful for complex editorial layouts

This dual approach provides flexibility for different use cases without complicating the basic pattern.

### 2. Content Breakout System

The grid strategy's breakout capability is sophisticated:
- Children with `data-breakout` extend to full viewport width
- Nested `data-container` elements within breakout maintain alignment with parent container
- Enables magazine-style layouts with full-bleed sections
- Maintains content rhythm and alignment even with visual breakouts

This is rarely seen in container implementations and solves a common design challenge.

### 3. Flexible Size Configuration

Container accepts multiple size input types:
- **Presets:** `xs`, `sm`, `md`, `lg`, `xl` - theme-configurable
- **Numeric:** Direct pixel values (e.g., `480`)
- **String:** CSS values (e.g., `"600px"`, `"90%"`)
- **Fluid:** Boolean flag for 100% width
- **Responsive:** Via Styles API and custom CSS

This flexibility accommodates various design systems and use cases.

### 4. Theme-Aware Sizing

Size presets integrate with Mantine's theme system:
- Default presets can be customized globally via `createTheme`
- Custom size names can be added (e.g., `xxl`)
- All presets are CSS variable-based for runtime theming
- Consistent with Mantine's design token approach

### 5. Responsive Padding Support

The `px` (and `py`) props accept responsive objects:
```jsx
<Container px={{ base: 'md', sm: 'lg', lg: 'xl' }}>
```

This enables viewport-specific padding without custom CSS, maintaining component API consistency.

### 6. Minimal API Surface

Despite advanced capabilities, Container maintains a simple API:
- Only 7 primary props (plus Styles API)
- Clear naming (`fluid`, `px`, `strategy`)
- Sensible defaults (centered, `md` size, standard padding)
- Progressive disclosure of complexity (grid features opt-in)

### 7. CSS Variable Integration

Custom sizes can be defined via CSS variables:
```css
:root {
  --container-size-xs: 540px;
  --container-size-sm: 720px;
  /* etc. */
}
```

This supports design system tokens and runtime theming.

---

## Comparison to Other Frameworks

### Similarities to Common Patterns

**Bootstrap's Container:**
- Similar preset sizes concept (`container-sm`, `container-lg`, etc.)
- Fluid mode parallel (`container-fluid`)
- Horizontal padding by default
- Centering via auto margins

**Material-UI's Container:**
- `maxWidth` prop similar to Mantine's `size`
- `disableGutters` similar to `px={0}`
- Responsive breakpoint-based widths

### Unique Mantine Features

**Grid Strategy + Breakout:**
- Not commonly found in other frameworks
- Solves full-bleed layout problem elegantly
- Nested container alignment is sophisticated

**Dual Strategy System:**
- Most frameworks offer only one approach
- Allows optimization for use case (simple vs. complex)

**Responsive Padding Objects:**
- More granular than typical responsive props
- Consistent with Mantine's overall API design

### Design Philosophy Differences

**Mantine Approach:**
- Component-centric (not class-based like Bootstrap)
- Theme integration first-class
- Progressive complexity (simple by default, power when needed)
- CSS-in-JS friendly while supporting traditional CSS

**Compared to Utility-First (Tailwind):**
- Provides semantic component abstraction
- Encapsulates container logic rather than composing utilities
- Trade-off: Less granular control, but more maintainable

---

## Implementation Notes

### Inferred DOM Structure

**Block Strategy:**
```html
<div class="m_[hash] root" style="max-width: [size]; padding-left: [px]; padding-right: [px]; margin: 0 auto;">
  <!-- children -->
</div>
```

**Grid Strategy:**
```html
<div class="m_[hash] root" style="display: grid; grid-template-columns: minmax([px], 1fr) minmax(auto, [size]) minmax([px], 1fr);">
  <!-- children render in center column -->
  <!-- data-breakout elements span all columns -->
  <!-- data-container elements create nested grid with same structure -->
</div>
```

### Performance Considerations

1. **Block Strategy:** Minimal CSS, inline styles, very performant
2. **Grid Strategy:** More complex CSS Grid calculations, but still performant for most use cases
3. **Responsive Padding:** Uses media queries, standard browser optimization applies
4. **Theme Integration:** CSS variables allow runtime changes without re-renders

### Accessibility Notes

- Container is presentational/structural - no ARIA considerations needed
- Maintains document flow (no absolute positioning)
- Respects user zoom and text scaling
- No interactive elements, so no keyboard/focus concerns
- Width constraints help maintain readable line lengths (accessibility benefit)

---

## Usage Patterns Summary

### When to Use Container

✅ **Use Container for:**
- Main page content areas
- Section-level width constraints
- Centering content horizontally
- Maintaining consistent layout widths
- Creating full-bleed sections with aligned content (grid strategy)
- Blog posts, articles, documentation layouts

❌ **Don't Use Container for:**
- Individual component sizing (use component's own size props)
- Flex/Grid layout parent (use Stack, Group, Grid components)
- Vertical rhythm/spacing (use Stack, Space components)
- Full application wrapper (use AppShell or similar)

### Common Patterns

**Basic Page Layout:**
```jsx
<Container size="lg">
  {/* Page content */}
</Container>
```

**Editorial Layout with Breakouts:**
```jsx
<Container strategy="grid" size="md">
  {/* Mix of constrained and full-width content */}
</Container>
```

**Nested Containers:**
```jsx
<div style={{ backgroundColor: 'blue' }}>
  <Container size="xl">
    {/* Content within colored background */}
  </Container>
</div>
```

**Responsive Content Width:**
```jsx
<Container
  size={{ base: '100%', sm: '90%', md: 720, lg: 960 }}
  px={{ base: 'md', md: 'xl' }}
>
  {/* Fully responsive container */}
</Container>
```

---

## Integration with Mantine Ecosystem

### Works Well With

- **AppShell:** Container within AppShell.Main for content areas
- **Stack/Group:** Container wraps layout components for width constraint
- **Grid/SimpleGrid:** Container constrains grid width
- **Title/Text:** Typography components within Container for readable line lengths
- **Image:** Full-width images in breakout sections

### Theme Integration

```jsx
// Global configuration
const theme = createTheme({
  components: {
    Container: {
      defaultProps: {
        size: 'lg',
        px: 'md',
      },
      sizes: {
        xs: 540,
        sm: 720,
        md: 960,
        lg: 1140,
        xl: 1320,
      },
    },
  },
});
```

---

## Research Metadata

**Research Completeness:** ✅ Comprehensive
- All props documented and explained
- All major patterns illustrated with code
- Advanced features thoroughly explored
- Theme integration detailed
- Comparison analysis included

**Documentation Gaps Identified:**
- Exact default size values not specified in docs
- Default padding value not explicitly stated
- No accessibility section (though not critical for this component)
- Migration guide from other frameworks absent

**Unique Patterns Worth Noting:**
1. Grid strategy with breakout system (highly unique)
2. Nested container alignment within breakouts
3. Dual strategy approach for optimization
4. Responsive padding object syntax
5. Data attribute-based behavior modifiers

**Framework Maturity:** Production-ready
- Stable API since early versions
- Grid strategy added in v8.2.0 (recent enhancement)
- Well-integrated with Mantine theme system
- No reported major issues or breaking changes

---

**Research Status:** Complete
**Quality Assessment:** Excellent implementation with unique features (grid strategy/breakout) not commonly found elsewhere
**Recommended for Cross-Framework Study:** Yes - particularly the breakout pattern and dual strategy approach

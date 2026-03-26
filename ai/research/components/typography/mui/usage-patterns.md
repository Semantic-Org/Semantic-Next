# MUI - Typography Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://mui.com/material-ui/react-typography/
Status: ✅ Working
Version: v5 (current stable)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-organized documentation with clear API reference, theme integration, and semantic HTML guidance. Strong focus on accessibility and Material Design specifications. Documentation includes version-specific examples and migration guides.

## Component Definition
- **Core purpose**: Render text content following Material Design typography specifications with semantic HTML, predefined typographic scales, and theme integration
- **Mental model**: Single typography component with variant-based visual styles and polymorphic rendering to separate presentation from semantic HTML structure
- **Semantic meaning**: Implements Material Design typography system with 13 variants covering headings, body text, UI text, and decorative text patterns while maintaining proper document structure

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **System**: Via MUI System props (sx)
- **Not Supported**: Pattern not available

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Headings | ✅ | Native | `variant="h1"` through `variant="h6"` with Material Design sizing |
| Paragraphs | ✅ | Native | `paragraph` prop renders as `<p>` with margin spacing, body1/body2 variants |
| Inline text | ✅ | Native | Renders as `<span>` or `<div>` based on `component` prop |
| Code display | ⚠️ | System | No native code prop, use `sx` or custom styling |
| Links | ⚠️ | Composed | Use with Link component or `component="a"` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Display text | ✅ | Native | h1-h3 variants (6rem, 3.75rem, 3rem) for hero sections |
| Body text | ✅ | Native | body1 (1rem, 400 weight), body2 (0.875rem, 400 weight) |
| Caption text | ✅ | Native | `variant="caption"` (0.75rem, 700 weight) |
| Label text | ✅ | Native | `variant="button"` (0.875rem, 700 weight) for UI labels |
| Subtitle text | ✅ | Native | subtitle1 (1rem), subtitle2 (0.875rem) for secondary headings |
| Overline text | ✅ | Native | `variant="overline"` (0.75rem, 700 weight) for category labels |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ⚠️ | System | No native disabled prop, use `sx` for opacity/color |
| Muted/Secondary | ✅ | Native | `color="textSecondary"` for de-emphasized text |
| Error | ✅ | Native | `color="error"` for error messages |
| Success | ⚠️ | System | No native success color, use `color="success.main"` via sx |
| Warning | ⚠️ | System | Use `color="warning.main"` via sx prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Font size | ✅ | Native | 13 variants with predefined sizes (0.75rem - 6rem) |
| Font weight | ✅ | Native | Varies by variant (400-700), customizable via theme |
| Text color | ✅ | Native | `color` prop: initial, inherit, primary, secondary, textPrimary, textSecondary, error |
| Text alignment | ✅ | Native | `align` prop: inherit, left, center, right, justify |
| Truncation | ✅ | Native | `noWrap` prop prevents wrapping with text-overflow ellipsis |
| Line height | ✅ | Native | Predefined per variant via Material Design specs |
| Letter spacing | ✅ | Native | Predefined per variant via Material Design specs |
| Text transform | ⚠️ | System | No native prop, use `sx={{ textTransform: 'uppercase' }}` |
| Line clamping | ⚠️ | System | No native multi-line ellipsis, use sx with `-webkit-line-clamp` |
| Copyable | ❌ | Not Supported | No native copyable feature |
| Editable | ❌ | Not Supported | No native inline editing |
| Keyboard display | ⚠️ | Composed | Use with `<kbd>` element via `component="kbd"` |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Bottom margin | ✅ | Native | `gutterBottom` adds `marginBottom: '0.35em'` (relative) |
| Paragraph spacing | ✅ | Native | `paragraph` prop adds `marginBottom: 16px` (fixed) |
| Custom spacing | ✅ | System | Via `sx` prop with theme spacing scale |

## Polymorphic Rendering Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom element | ✅ | Native | `component` prop changes rendered HTML element |
| Semantic override | ✅ | Native | Apply h1 style to `<h2>` element: `variant="h1" component="h2"` |
| Variant mapping | ✅ | Native | Global `variantMapping` in theme to set default element per variant |

## Theme Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Theme typography | ✅ | Native | Accesses `theme.typography` for all variant styles |
| Custom variants | ✅ | Native | Extend typography variants in theme configuration |
| Responsive sizing | ✅ | Native | h1-h2 use `clamp()` for fluid typography (v5) |
| CSS custom properties | ✅ | Native | Uses CSS variables for theming with light/dark mode support |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fluid typography | ✅ | Native | h1 (clamp 2.5rem-3.5em), h2 (clamp 1.5rem-2.25rem) |
| Breakpoint variants | ⚠️ | System | Use `sx` with breakpoint syntax for responsive props |
| Viewport-based scaling | ✅ | Native | Built into Material Design type scale |

## Code Examples

### Basic Typography Variants
```tsx
import Typography from '@mui/material/Typography';

// Heading variants
<Typography variant="h1">h1. Heading</Typography>
<Typography variant="h2">h2. Heading</Typography>
<Typography variant="h3">h3. Heading</Typography>
<Typography variant="h4">h4. Heading</Typography>
<Typography variant="h5">h5. Heading</Typography>
<Typography variant="h6">h6. Heading</Typography>

// Subtitle variants
<Typography variant="subtitle1">
  subtitle1. Lorem ipsum dolor sit amet...
</Typography>
<Typography variant="subtitle2">
  subtitle2. Lorem ipsum dolor sit amet...
</Typography>

// Body variants
<Typography variant="body1">
  body1. Lorem ipsum dolor sit amet...
</Typography>
<Typography variant="body2">
  body2. Lorem ipsum dolor sit amet...
</Typography>

// UI text variants
<Typography variant="button" display="block">
  button text
</Typography>
<Typography variant="caption" display="block">
  caption text
</Typography>
<Typography variant="overline" display="block">
  overline text
</Typography>
```

### Polymorphic Rendering (Component Prop)
```tsx
// Visual h1 style, but semantic h2 element
<Typography variant="h1" component="h2">
  h1. Heading
</Typography>

// Render body1 as a span for inline text
<Typography variant="body1" component="span">
  Inline text with body1 styling
</Typography>

// Apply heading style to a div
<Typography variant="h3" component="div" gutterBottom>
  h3 styled div
</Typography>
```

### Color Variants
```tsx
import Typography from '@mui/material/Typography';

// Theme colors
<Typography color="primary">Primary color text</Typography>
<Typography color="secondary">Secondary color text</Typography>
<Typography color="error">Error color text</Typography>

// Text colors
<Typography color="textPrimary">Primary text color</Typography>
<Typography color="textSecondary">Secondary text color</Typography>

// Inherit color from parent
<Typography color="inherit">Inherited color</Typography>
```

### Text Alignment
```tsx
import Typography from '@mui/material/Typography';

<Typography align="left">Left aligned text (default)</Typography>
<Typography align="center">Center aligned text</Typography>
<Typography align="right">Right aligned text</Typography>
<Typography align="justify">Justified text</Typography>
```

### Spacing Props
```tsx
import Typography from '@mui/material/Typography';

// gutterBottom adds relative bottom margin (0.35em)
<Typography variant="h4" gutterBottom>
  Heading with gutter bottom
</Typography>

// paragraph renders as <p> with fixed 16px bottom margin
<Typography variant="body1" paragraph>
  This is the first paragraph with spacing.
</Typography>
<Typography variant="body1" paragraph>
  This is the second paragraph.
</Typography>
```

### Text Truncation
```tsx
import Typography from '@mui/material/Typography';

// noWrap prevents text wrapping with ellipsis
<Typography variant="body1" noWrap>
  This is a long sentence that will be truncated with ellipsis
  if it exceeds the container width and stays on a single line.
</Typography>

// Must be used with a constrained width
<Typography variant="h6" noWrap sx={{ maxWidth: 300 }}>
  Very long heading that needs to be truncated
</Typography>
```

### System Props (sx) for Advanced Styling
```tsx
import Typography from '@mui/material/Typography';

// Custom styling via sx prop
<Typography
  variant="h5"
  sx={{
    fontWeight: 'bold',
    color: 'primary.main',
    textTransform: 'uppercase',
    letterSpacing: 2,
  }}
>
  Custom styled heading
</Typography>

// Responsive styling
<Typography
  variant="body1"
  sx={{
    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
    color: { xs: 'text.secondary', md: 'text.primary' }
  }}
>
  Responsive text
</Typography>

// Multi-line ellipsis (line clamping)
<Typography
  variant="body2"
  sx={{
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
  }}
>
  This is a long paragraph that will be clamped to 3 lines with
  ellipsis at the end. Additional content will be hidden with
  overflow handling.
</Typography>
```

### Theme Integration
```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// Custom theme with typography overrides
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h1">Custom themed heading</Typography>
      <Typography variant="body1">Custom themed body text</Typography>
    </ThemeProvider>
  );
}
```

### Global Variant Mapping
```tsx
import { createTheme } from '@mui/material/styles';

// Configure default HTML elements for variants
const theme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',      // h1 variant renders as <h2>
          h2: 'h2',      // h2 variant renders as <h2>
          h3: 'h2',      // h3 variant renders as <h2>
          h4: 'h2',      // h4 variant renders as <h2>
          h5: 'h2',      // h5 variant renders as <h2>
          h6: 'h2',      // h6 variant renders as <h2>
          subtitle1: 'h3',
          subtitle2: 'h3',
          body1: 'p',
          body2: 'p',
        },
      },
    },
  },
});
```

### Accessing Theme Typography in Custom Components
```tsx
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

// Using makeStyles (v4 style)
const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}));

// Using useTheme hook (v5 style)
function CustomText() {
  const theme = useTheme();

  return (
    <div style={theme.typography.h6}>
      Text styled with h6 typography
    </div>
  );
}
```

### Combined Patterns
```tsx
import Typography from '@mui/material/Typography';

// Multiple props combined
<Typography
  variant="h3"
  component="h1"
  color="primary"
  align="center"
  gutterBottom
  sx={{
    fontWeight: 'bold',
    textTransform: 'uppercase',
    mb: 4  // Additional bottom margin via sx
  }}
>
  Hero Section Title
</Typography>

// Paragraph composition
<>
  <Typography variant="h4" component="h2" gutterBottom>
    Article Title
  </Typography>
  <Typography variant="subtitle1" color="textSecondary" paragraph>
    Article subtitle with muted color
  </Typography>
  <Typography variant="body1" paragraph>
    First paragraph of article content with automatic spacing.
  </Typography>
  <Typography variant="body1" paragraph>
    Second paragraph with consistent spacing.
  </Typography>
</>
```

## Notable Features

### Material Design Typography System
MUI Typography implements the complete Material Design type scale with 13 predefined variants, each with carefully crafted font size, weight, line height, and letter spacing. This provides a cohesive visual hierarchy out of the box.

### Polymorphic Component Pattern
The `component` prop enables complete separation of visual presentation from semantic HTML structure. You can apply h1 styling to any element (h2, div, span) without compromising accessibility or SEO, making it easy to maintain proper document outline while achieving desired visual designs.

### Global Variant Mapping
The `variantMapping` configuration in theme allows setting default HTML elements for each variant across the entire application. This is particularly useful for maintaining semantic HTML structure (e.g., preventing multiple h1 elements) while using visual variants freely.

### Fluid Typography with clamp()
MUI v5 implements responsive typography using CSS `clamp()` for h1 and h2 variants, enabling smooth font scaling across viewport sizes without media queries. h1 scales between 2.5rem and 3.5em, h2 between 1.5rem and 2.25rem.

### Comprehensive Theme Integration
Every typography style is defined in `theme.typography` and can be accessed programmatically, extended with custom variants, or overridden globally. The theme system uses CSS custom properties for runtime theming including dark mode support.

### System Props Integration (sx)
Typography supports the full MUI System API through the `sx` prop, enabling responsive styling, pseudo-selectors, nested selectors, and direct access to theme tokens without creating custom styled components.

### Relative vs Fixed Spacing
MUI provides two spacing approaches: `gutterBottom` uses relative units (0.35em) that scale with font size, while `paragraph` uses fixed pixels (16px). This gives fine-grained control over spacing behavior in different contexts.

### Built-in Accessibility Considerations
The component encourages proper semantic HTML through variant mapping and the component prop. The `srOnly` variant provides screen-reader-only text for accessibility. Material Design specifications include WCAG-compliant contrast ratios for color variants.

## Research Notes

- MUI Typography is a single component with variant-based styling, contrasting with Ant Design's compositional approach (Typography.Title, Typography.Text, etc.)
- The polymorphic `component` prop is a core feature enabling flexible semantic HTML structure
- No native interactive features (copyable, editable) - focused purely on text presentation
- Missing some text decoration features (text transform, line clamping) as native props, but fully achievable via `sx` system prop
- Strong emphasis on Material Design specifications and accessibility through semantic HTML
- Theme integration is deeper than most frameworks - every variant is theme-aware
- Font families: "General Sans" for headings, "IBM Plex Sans" for body text in documentation
- Version 5 introduced `sx` prop replacing `makeStyles` pattern from v4
- The `paragraph` prop is under consideration for deprecation (GitHub issues #16926, #42382) as it duplicates `component="p"` functionality
- gutterBottom uses `marginBottom: '0.35em'` (relative), paragraph uses `marginBottom: 16px` (fixed)
- Documentation structure: Main component page, separate API reference, migration guides
- No concept of "sub-components" - all variants are props on single Typography component
- Package: @mui/material
- Current version: v5 (stable), v4 still documented for migration support
- TypeScript support is first-class with comprehensive type definitions
- Responsive typography uses modern CSS features (clamp, custom properties) rather than JavaScript
- Missing enterprise-focused features like copyable/editable that Ant Design provides
- Text alignment and color are native props unlike many frameworks that require CSS
- The `display` prop is sometimes needed (e.g., `display="block"` for button/caption variants)
- Focus on composition over configuration - simple API surface with powerful theme system
- Works seamlessly with other MUI components through shared design tokens
- Light/dark mode theming is built-in via CSS custom properties and color-scheme
- Print styles are considered in the default theme
- Font loading uses `font-display: swap` for performance
- CSS architecture uses `@layer` for proper cascade management
- The variant mapping feature helps maintain single h1 for SEO while using h1 styles visually
- Material Design v3 updates are being progressively adopted in newer versions

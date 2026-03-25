# Mantine - Anchor Usage Patterns

## Component URL
https://mantine.dev/core/anchor/
Status: ✅ Working
Version: v8.3.6 (@mantine/core)
Last Verified: 2025-11-06

## Documentation Quality
Good - Clear examples with interactive demos, though lacking comprehensive API reference tables and accessibility documentation.

## Component Definition
- **Core purpose**: Provides a styled wrapper around the HTML `<a>` element with theme-consistent styling and typography controls, serving as the standard link component in Mantine applications.
- **Mental model**: A Text component that functions as a hyperlink - it inherits all text styling capabilities while adding link-specific behaviors like underline control and navigation.
- **Semantic meaning**: Represents navigational links and external references, maintaining semantic HTML while providing enhanced styling and theming capabilities.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Navigation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Internal navigation | ✅ | Native | Standard `href` prop for internal URLs |
| External navigation | ✅ | Native | `href` with `target="_blank"` shown in examples |
| Router integration | ✅ | Composed | Polymorphic `component` prop allows Next.js Link or React Router integration |
| Hash links | ⚠️ | Native | Standard `href` supports hash links (not explicitly documented but native `<a>` behavior preserved) |
| Download links | ⚠️ | Native | Standard `download` attribute likely supported (not documented) |

## Visual Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Underline styling | ✅ | Native | `underline` prop with 4 options: 'always', 'hover', 'never', 'not-hover' |
| Color customization | ✅ | Native | Inherits Text component props including `variant="gradient"` with `from`/`to` colors, theme color support |
| Visited state | ❌ | CSS-only | Not documented; would require custom CSS for `:visited` styling |
| Hover effects | ✅ | Native | Controlled via `underline="hover"` or `underline="not-hover"` props |
| Active state | ❌ | CSS-only | Not documented; no native prop for active link styling |
| Focus indicators | ⚠️ | Native | Likely uses default Mantine focus styles (not explicitly documented) |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onClick handler | ⚠️ | Native | Not documented but likely supports standard React `onClick` as native prop |
| New window/tab | ✅ | Native | Standard `target="_blank"` attribute shown in examples |
| Disabled state | ❌ | N/A | No disabled state documented or shown |
| No-follow attribute | ⚠️ | Native | Not documented but `rel` attribute likely supported as native HTML attribute |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ⚠️ | Native | Not documented but standard ARIA attributes likely pass through to native `<a>` |
| Keyboard navigation | ✅ | Native | Standard `<a>` keyboard behavior (Enter/Space) preserved |
| Screen reader support | ✅ | Native | Semantic `<a>` element provides native screen reader support |

## Code Examples

### Basic Usage
```jsx
import { Anchor } from '@mantine/core';

function Demo() {
  return (
    <Anchor href="https://mantine.dev/" target="_blank">
      Link text
    </Anchor>
  );
}
```

### Underline Variants
```jsx
// Always show underline
<Anchor href="https://mantine.dev/" underline="always">
  Always underlined
</Anchor>

// Show underline on hover only
<Anchor href="https://mantine.dev/" underline="hover">
  Hover to see underline
</Anchor>

// Never show underline
<Anchor href="https://mantine.dev/" underline="never">
  Never underlined
</Anchor>

// Hide underline on hover
<Anchor href="https://mantine.dev/" underline="not-hover">
  Underline disappears on hover
</Anchor>
```

### Gradient Styling (Text Component Inheritance)
```jsx
<Anchor
  href="https://mantine.dev/"
  variant="gradient"
  gradient={{ from: 'pink', to: 'yellow' }}
  fw={700}
  fz="xl"
>
  Gradient link
</Anchor>
```

### Router Integration (Polymorphic Component)
```jsx
import Link from 'next/link';

function Demo() {
  return (
    <Anchor component={Link} href="/about">
      Internal route with Next.js Link
    </Anchor>
  );
}
```

### Theme Configuration (Global Defaults)
```jsx
import { createTheme, MantineProvider, Anchor } from '@mantine/core';

const theme = createTheme({
  components: {
    Anchor: Anchor.extend({
      defaultProps: {
        underline: 'hover',
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* All anchors will have underline="hover" by default */}
    </MantineProvider>
  );
}
```

## Notable Features

### Polymorphic Component Pattern
The Anchor component supports Mantine's polymorphic component system through the `component` prop, enabling seamless integration with routing libraries like Next.js Link or React Router Link while maintaining Mantine's styling system. This is a sophisticated approach that separates styling concerns from navigation logic.

### Text Component Inheritance
By inheriting all Text component props, Anchor gains access to Mantine's comprehensive typography system including:
- Gradient variants with customizable color stops
- Font weight (`fw`) and size (`fz`) controls
- Theme-aware color system
- Line height and spacing controls

### Theme-Level Configuration
The component supports theme-level configuration through `Anchor.extend()`, allowing applications to set consistent underline behavior and other defaults globally rather than prop-by-prop.

### Flexible Underline Control
The four underline options ('always', 'hover', 'never', 'not-hover') provide more granular control than typical CSS approaches, with the 'not-hover' option being particularly unique.

### Ref Support
Full React ref support for imperative DOM access, useful for focus management and advanced interactions.

## Research Notes

### Documentation Gaps
- No comprehensive props table with TypeScript types
- Missing explicit documentation for standard HTML attributes (rel, download, aria-*)
- No examples of onClick handlers or event handling
- Visited state styling not addressed
- Active state styling not documented
- Focus indicator customization not shown
- Security considerations for external links (rel="noopener noreferrer") not mentioned

### Documentation Strengths
- Clear interactive demos for underline variations
- Good router integration examples
- Theme configuration well documented
- Gradient styling examples effectively demonstrate Text component inheritance
- Version information clearly displayed (v8.3.6)

### Framework Approach
Mantine takes a "styled native element" approach rather than reinventing link behavior. The Anchor component wraps `<a>` while adding theme integration and typography controls. This philosophy prioritizes composability and familiarity over feature completeness - advanced behaviors are expected to be composed through standard React patterns.

### Comparison Notes
Unlike some frameworks that provide dedicated props for external link security (rel="noopener") or visited state styling, Mantine relies on developers to apply these through standard HTML attributes. This keeps the component lean but may require more manual implementation of best practices.

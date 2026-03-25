# Mantine - Breadcrumbs Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/breadcrumbs/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Basic - The documentation provides essential usage patterns but lacks comprehensive API details, accessibility information, and advanced examples.

## Component Definition
- **Core purpose**: Automatically separates a list of React nodes with a configurable separator to create navigation breadcrumb trails
- **Mental model**: A container that wraps child elements and inserts visual separators between them
- **Semantic meaning**: Provides hierarchical navigation context showing the user's location within a site or application structure

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator="/"`)
- **Composed**: Via composition/children (e.g., `<Breadcrumb><Anchor>Item</Anchor></Breadcrumb>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Composed | Uses Mantine `Anchor` component as children |
| Icon support | ⚠️ | Composed | Not explicitly shown but likely supported via React nodes as children |
| Dropdown menus | ❌ | - | Not documented |
| Custom separators | ✅ | Native | `separator` prop accepts any string (e.g., `/`, `→`, `•`) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Composed | Array of Anchor components passed as children |
| With dropdown | ❌ | - | Not documented |
| Icon breadcrumb | ⚠️ | Composed | Not explicitly shown but React nodes as children should allow icons |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ⚠️ | CSS-only | Not explicitly documented; would require styling last child differently |
| Disabled items | ❌ | - | Not documented |
| Clickable/non-clickable | ✅ | Composed | Control via child component (Anchor vs plain text) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Native | `separator` prop accepts custom string characters |
| Size options | ⚠️ | CSS-only | Standard Mantine size props likely available but not shown |
| Responsive behavior | ⚠️ | CSS-only | Not documented; likely requires custom implementation |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Composed | Handled by child Anchor components with `href` prop |
| Router integration | ⚠️ | Composed | Not shown but Anchor accepts href; likely compatible with React Router |
| Programmatic nav | ⚠️ | Composed | Would be handled by navigation components used as children |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ❌ | - | Not documented |
| aria-current | ❌ | - | Not documented |
| Keyboard navigation | ⚠️ | Composed | Likely inherited from child Anchor components |

## Code Examples
```tsx
// Primary usage example - Basic breadcrumbs
import { Breadcrumbs, Anchor } from '@mantine/core';

const items = [
  { title: 'Mantine', href: '#' },
  { title: 'Mantine hooks', href: '#' },
  { title: 'use-id', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

function Demo() {
  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
        {items}
      </Breadcrumbs>
    </>
  );
}
```

## Notable Features
- **Flexible separator customization**: The `separator` prop accepts any string, allowing for diverse visual styles (/, →, •, >, etc.)
- **Separator spacing control**: The `separatorMargin` prop provides granular control over spacing around the separator
- **React node flexibility**: Accepts any React nodes as children, not limited to Anchor components
- **Minimal API surface**: Simple, focused component with just the essential props needed for breadcrumb functionality
- **Mantine ecosystem integration**: Works seamlessly with other Mantine components (Anchor, spacing system)

## Research Notes
- **Documentation completeness**: The official documentation is concise but lacks detail on:
  - Complete props table with all available options
  - Accessibility features and ARIA attributes
  - Responsive behavior patterns
  - Icon integration examples
  - Size variants
  - Current page indication patterns
- **Implementation approach**: Mantine takes a minimal approach - the Breadcrumbs component is essentially a smart container that handles separation logic, while navigation behavior is delegated to child components
- **Composition pattern**: Relies heavily on composition rather than built-in features, which provides flexibility but requires more setup code
- **No dedicated API for common patterns**: Features like "current page indication" or "collapsed items" would need to be implemented manually through styling or custom logic

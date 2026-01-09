# HeroUI - Link Usage Patterns

## Component URL
https://www.heroui.com/docs/components/link
Status: ✅ Working
Version: v2.8.0
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, complete API reference, and accessibility details.

## Component Definition
- **Core purpose**: Enables navigation between pages with styled hyperlink functionality while semantically rendering as an HTML `<a>` element.
- **Mental model**: A semantic anchor element enhanced with consistent styling, multiple visual states, and framework-agnostic navigation support.
- **Semantic meaning**: Communicates actionable text that navigates the user to another location, with visual feedback states to indicate interaction possibilities.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Navigation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Internal navigation | ✅ | Native | `href` prop accepts internal routes, works with `as` prop for framework routers |
| External navigation | ✅ | Native | `isExternal` prop automatically adds `target="_blank"` and `rel="noopener noreferrer"` |
| Router integration | ✅ | Native | Polymorphic `as` prop supports Next.js Link, React Router, Remix, etc. |
| Hash links | ✅ | Native | Standard `href="#anchor"` syntax supported |
| Download links | ✅ | Native | `download` prop (boolean or filename string) enables file downloads |

## Visual Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Underline styling | ✅ | Native | `underline` prop with 5 modes: "none" (default), "hover", "always", "active", "focus" |
| Color customization | ✅ | Native | `color` prop with 6 variants: "foreground", "primary" (default), "secondary", "success", "warning", "danger" |
| Visited state | ❌ | CSS-only | Not explicitly mentioned; would require custom CSS targeting `:visited` |
| Hover effects | ✅ | Native | Automatic hover styles based on `color` and `underline` props |
| Active state | ✅ | Native | `underline="active"` shows underline during active/pressed state |
| Focus indicators | ✅ | Native | Built-in focus ring with `data-focus` and `data-focus-visible` data attributes |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onClick handler | ✅ | Native | Standard React `onClick` prop supported (inherits from anchor element) |
| New window/tab | ✅ | Native | `target` prop for explicit control, or `isExternal` for automatic `target="_blank"` |
| Disabled state | ✅ | Native | `isDisabled` prop with keyboard handling and `data-disabled` attribute |
| No-follow attribute | ✅ | Native | `rel` prop for custom relationship metadata (e.g., "nofollow", "sponsored") |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ✅ | Native | ARIA support for custom element types, built on React Aria patterns |
| Keyboard navigation | ✅ | Native | Mouse, touch, and keyboard interaction support; Enter key activation |
| Screen reader support | ✅ | Native | Semantic `<a>` element with proper ARIA attributes when using custom elements |

## Additional Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | `size` prop: "sm", "md" (default), "lg" for responsive sizing |
| Block rendering | ✅ | Native | `isBlock` prop renders as block-level element with hover effects |
| Anchor icon | ✅ | Native | `showAnchorIcon` prop displays external link icon; `anchorIcon` for custom icons |
| Animation control | ✅ | Native | `disableAnimation` prop for performance or preference requirements |
| Custom hook | ✅ | Native | `useLink` hook available for building custom link components |
| Ping attribute | ✅ | Native | `ping` prop for tracking navigation (sends POST request on click) |
| Referrer policy | ✅ | Native | `referrerPolicy` prop for privacy and security control |

## Code Examples

### Basic Usage
```jsx
<Link href="#">
  Default Link
</Link>
```
[View Live Example](https://www.heroui.com/docs/components/link)

### Color Variants
```jsx
<Link color="primary" href="#">Primary</Link>
<Link color="secondary" href="#">Secondary</Link>
<Link color="success" href="#">Success</Link>
<Link color="warning" href="#">Warning</Link>
<Link color="danger" href="#">Danger</Link>
<Link color="foreground" href="#">Foreground</Link>
```

### Size Variants
```jsx
<Link size="sm" href="#">Small</Link>
<Link size="md" href="#">Medium (default)</Link>
<Link size="lg" href="#">Large</Link>
```

### Underline Modes
```jsx
<Link underline="none" href="#">No underline (default)</Link>
<Link underline="hover" href="#">Underline on hover</Link>
<Link underline="always" href="#">Always underlined</Link>
<Link underline="active" href="#">Underline when active</Link>
<Link underline="focus" href="#">Underline on focus</Link>
```

### External Links
```jsx
<Link isExternal href="https://example.com">
  External Link
</Link>

<Link isExternal showAnchorIcon href="https://example.com">
  External with Icon
</Link>

<Link
  isExternal
  showAnchorIcon
  anchorIcon={<CustomIcon />}
  href="https://example.com"
>
  Custom External Icon
</Link>
```

### Block Links
```jsx
<Link isBlock showAnchorIcon color="primary" href="#">
  Block Link with Icon
</Link>
```

### Disabled State
```jsx
<Link isDisabled href="#">
  Disabled Link
</Link>
```

### Download Links
```jsx
<Link download href="/files/document.pdf">
  Download PDF
</Link>

<Link download="report.pdf" href="/files/document.pdf">
  Download with Custom Filename
</Link>
```

### Framework Integration (Next.js)
```jsx
import NextLink from "next/link";

<Link as={NextLink} href="/dashboard">
  Next.js Route
</Link>
```

### Framework Integration (React Router)
```jsx
import { Link as RouterLink } from "react-router-dom";

<Link as={RouterLink} to="/about">
  React Router Link
</Link>
```

### Custom Hook Usage
```jsx
import { useLink } from "@heroui/react";

function CustomLink(props) {
  const {
    Component,
    children,
    getAnchorProps
  } = useLink({...props});

  return (
    <Component {...getAnchorProps()}>
      {children}
    </Component>
  );
}
```

## Notable Features
- **Polymorphic Design**: The `as` prop enables seamless integration with any client-side routing library without losing HeroUI styling and behavior.
- **Security by Default**: The `isExternal` prop automatically applies security best practices (`target="_blank"` + `rel="noopener noreferrer"`).
- **React Aria Foundation**: Built on React Aria hooks ensuring enterprise-grade accessibility across mouse, touch, and keyboard interactions.
- **Comprehensive State Feedback**: Five distinct underline modes provide fine-grained control over visual feedback timing.
- **Block Mode**: Unique `isBlock` pattern transforms link into block-level hover area, useful for card-style navigation.
- **Data Attributes for Styling**: Exposes `data-focus`, `data-focus-visible`, and `data-disabled` attributes enabling custom CSS targeting of component states.
- **Download Attribution**: Supports `ping` attribute for analytics tracking of link follows.
- **Flexible Iconography**: Built-in anchor icon display with customization support for brand consistency.

## Implementation Architecture
- **Component Type**: Polymorphic wrapper around HTML `<a>` element
- **Styling System**: Built on HeroUI's design token system with semantic color palette
- **Accessibility Library**: React Aria for cross-platform interaction patterns
- **Framework Compatibility**: Framework-agnostic with explicit support for Next.js, React Router, Remix via `as` prop

## Research Notes
- Documentation is well-structured with clear categorization of props by purpose (visual, navigation, behavior).
- The component strikes a balance between providing opinionated defaults (security for external links) while maintaining flexibility (custom icons, polymorphic rendering).
- No explicit support for visited state styling mentioned, likely requiring custom CSS.
- The `useLink` hook provides an escape hatch for advanced customization needs.
- Version 2.8.0 indicates active maintenance and feature development.
- The five-mode underline system ("none", "hover", "always", "active", "focus") is more granular than most link implementations, providing excellent visual feedback control.

# Chakra UI - Link Usage Patterns

## Component URL
https://v2.chakra-ui.com/docs/components/link
Status: ✅ Working
Version: v2 (Current documentation)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Includes prop documentation, code examples, router integration patterns, and accessibility guidance.

## Component Definition
- **Core purpose**: Provides an accessible, styled anchor element for navigation with seamless integration into routing libraries
- **Mental model**: A typography element that extends native anchor functionality with Chakra's design system, treating navigation as a styled semantic HTML element
- **Semantic meaning**: Represents a clickable navigation element that communicates interactivity and destination to users

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `href="/path"`, `isExternal`)
- **Composed**: Via composition/children (e.g., `as={NextLink}`)
- **CSS-only**: Requires custom styling (e.g., custom underline styles)

## Navigation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Internal navigation | ✅ | Native | `href` prop on default `<a>` element |
| External navigation | ✅ | Native | `isExternal` prop automatically adds `target="_blank"` and `rel="noopener noreferrer"` |
| Router integration | ✅ | Composed | `as` prop enables composition with Next.js Link, React Router Link, etc. |
| Hash links | ✅ | Native | Standard `href="#section"` with scroll-margin-top support |
| Download links | ✅ | Native | Standard `download` attribute on anchor element |

## Visual Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Underline styling | ✅ | Native | Default underline with 3px offset; customizable via `textDecoration` prop |
| Color customization | ✅ | Native | `color` prop (e.g., `color="teal.500"`) using Chakra's color palette |
| Visited state | ✅ | CSS-only | Supported through standard CSS pseudo-class, not exposed as prop |
| Hover effects | ✅ | Composed | Inherits from Box component; use `_hover` prop for custom styles |
| Active state | ✅ | Composed | Use `_active` prop for custom active state styling |
| Focus indicators | ✅ | Native | 2px outline with 2px offset using `focus-visible` for keyboard navigation |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onClick handler | ✅ | Native | Standard React `onClick` prop supported |
| New window/tab | ✅ | Native | `isExternal` prop or manual `target="_blank"` attribute |
| Disabled state | ❌ | CSS-only | No built-in `isDisabled` prop; requires custom implementation |
| No-follow attribute | ✅ | Native | Standard `rel="nofollow"` attribute supported |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ✅ | Native | Supports standard ARIA attributes (`aria-label`, `aria-describedby`, etc.) |
| Keyboard navigation | ✅ | Native | Full keyboard support with visible focus ring using `focus-visible` |
| Screen reader support | ✅ | Native | Semantic `<a>` element provides native screen reader announcements; `isExternal` adds proper attributes for external links |

## Code Examples

### Basic Usage
```jsx
import { Link } from '@chakra-ui/react'

<Link href="/docs">Documentation</Link>
```

### External Link with Icon
```jsx
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

<Link href='https://chakra-ui.com' isExternal>
  Chakra Design system <ExternalLinkIcon mx='2px' />
</Link>
```

### Inline with Text
```jsx
<Text>
  Did you know that{' '}
  <Link color='teal.500' href='#'>
    links can live inline with text
  </Link>
</Text>
```

### Next.js Integration (v13+)
```jsx
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

<Link as={NextLink} href='/home'>
  Home
</Link>
```

### React Router Integration
```jsx
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

<ChakraLink as={ReactRouterLink} to='/home'>
  Home
</ChakraLink>
```

### Custom Styled Next.js Link with Chakra Factory
```jsx
import NextLink from 'next/link'
import { chakra } from '@chakra-ui/react'

const MagicLink = chakra(NextLink, {
  shouldForwardProp: (prop) =>
    ['href', 'target', 'children'].includes(prop),
})

<MagicLink href='/docs' color='blue.500' target='_blank'>
  Documentation
</MagicLink>
```

[View Live Examples](https://v2.chakra-ui.com/docs/components/link)

## Notable Features

- **Seamless Router Integration**: The `as` prop pattern enables composition with any routing library while preserving Chakra's styling system
- **Automatic External Link Security**: `isExternal` prop automatically adds security attributes (`rel="noopener noreferrer"`)
- **Box Component Composition**: Inherits all Box component props, providing access to Chakra's complete styling API
- **Chakra Factory Pattern**: Advanced pattern for wrapping third-party components while maintaining full Chakra theming support
- **Focus-Visible Support**: Modern CSS focus-visible for accessible keyboard navigation without visual noise for mouse users
- **Underline Offset Design**: Default 3px text-underline-offset creates breathing room between text and underline
- **Design System Integration**: Native support for Chakra's color palette via `color` prop and style props like `_hover`, `_active`, `_focus`

## Research Notes

- Documentation is comprehensive and well-organized across v2 site
- v3 documentation exists but was less detailed during research; v2 docs provide more complete examples
- No built-in disabled state prop - requires custom implementation if needed
- The component is part of the `@chakra-ui/layout` package
- Visited state styling would require custom theme configuration or CSS selectors
- Strong emphasis on composition patterns for framework integration rather than building framework-specific variants
- The `as` prop pattern is Chakra's universal approach for component composition across all components

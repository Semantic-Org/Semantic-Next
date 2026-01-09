# ShadCN - Breadcrumb Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/breadcrumb
Status: ⚠️ Unable to verify (network restrictions)
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Good - Based on web search results, the documentation includes comprehensive component structure with multiple sub-components and code examples.

## Component Definition
- **Core purpose**: Provides hierarchical navigation showing the user's current location within a site structure, enabling users to navigate back to parent pages.
- **Mental model**: A trail of clickable links representing the path from the root to the current page, visually connected by separators.
- **Semantic meaning**: Communicates positional awareness within a hierarchy and provides quick navigation to ancestor pages.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator="/"`)
- **Composed**: Via composition/children (e.g., `<BreadcrumbItem>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Composed | Uses `<BreadcrumbLink>` component for clickable text links |
| Icon support | ✅ | Composed | Icons can be added as children to breadcrumb items |
| Dropdown menus | ✅ | Composed | `<BreadcrumbEllipsis>` component for collapsed/dropdown state |
| Custom separators | ✅ | Composed | `<BreadcrumbSeparator>` component accepts custom content |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Composed | Basic list with items, links, and separators |
| With dropdown | ✅ | Composed | Using BreadcrumbEllipsis for collapsed long paths |
| Icon breadcrumb | ✅ | Composed | Icons composable within BreadcrumbItem |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ✅ | Composed | `<BreadcrumbPage>` component for non-clickable current page |
| Disabled items | ✅ | CSS-only | Can apply disabled styles via className |
| Clickable/non-clickable | ✅ | Composed | BreadcrumbLink (clickable) vs BreadcrumbPage (non-clickable) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Composed | BreadcrumbSeparator accepts any content (/, >, •, icons) |
| Size options | ✅ | CSS-only | Controlled via className with Tailwind utilities |
| Responsive behavior | ✅ | Composed | BreadcrumbEllipsis enables responsive collapse patterns |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Composed | BreadcrumbLink wraps anchor tags for navigation |
| Router integration | ✅ | Composed | Works with Next.js Link or React Router via asChild |
| Programmatic nav | ✅ | Composed | Integration through router links with onClick handlers |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ✅ | Native | Can be applied to Breadcrumb root for landmark label |
| aria-current | ✅ | Native | BreadcrumbPage automatically applies aria-current="page" |
| Keyboard navigation | ✅ | Native | Standard link navigation with Tab/Enter inherited from links |

## Code Examples

### Basic Usage
```jsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### With Custom Separator
```jsx
import { Slash } from "lucide-react"

export function BreadcrumbWithCustomSeparator() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### With Dropdown (Ellipsis)
```jsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"

export function BreadcrumbWithDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### With Next.js Link
```jsx
import Link from "next/link"

export function BreadcrumbWithNextLink() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/products">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Product</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Component Structure

The ShadCN Breadcrumb follows a **composition-based architecture** with six distinct components:

1. **`<Breadcrumb>`** - Root container, provides semantic nav landmark
2. **`<BreadcrumbList>`** - Ordered list wrapper for breadcrumb items
3. **`<BreadcrumbItem>`** - Individual breadcrumb item container
4. **`<BreadcrumbLink>`** - Clickable link for navigable breadcrumb items
5. **`<BreadcrumbPage>`** - Non-clickable current page indicator
6. **`<BreadcrumbSeparator>`** - Visual separator between items
7. **`<BreadcrumbEllipsis>`** - Collapsed state indicator for long paths

### Component Hierarchy
```
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage />
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Notable Features

- **Copy-paste distribution model**: Components are copied directly into your project (typically at `@/components/ui/breadcrumb.tsx`), giving full customization control
- **Built on Radix UI primitives**: May leverage Radix UI patterns for accessibility and composition
- **Highly composable**: Each visual element is a separate component, allowing maximum flexibility
- **Router agnostic**: Works with any routing solution via `asChild` pattern (Next.js, React Router, etc.)
- **Responsive-ready**: BreadcrumbEllipsis component enables collapsing long paths on smaller screens
- **Accessible by default**: Uses semantic `<nav>` with proper ARIA attributes including `aria-current="page"`
- **Tailwind-first styling**: Leverages Tailwind CSS with CSS variables for theming
- **TypeScript support**: Full type safety included with copied components

## Installation

```bash
# Using CLI (recommended)
npx shadcn@latest add breadcrumb

# Manual installation
# 1. Copy component code from docs into components/ui/breadcrumb.tsx
# 2. Ensure Tailwind CSS and required utilities are configured
```

## Research Notes

- Unable to directly access documentation due to network restrictions, but component structure is well-documented in web search results
- ShadCN's copy-paste model means developers have complete control over implementation details
- The component uses a granular composition approach with separate components for each element (list, item, link, page, separator, ellipsis)
- BreadcrumbEllipsis is a unique feature not commonly found in other breadcrumb implementations, specifically designed for handling long navigation paths
- The distinction between BreadcrumbLink (clickable) and BreadcrumbPage (current, non-clickable) provides clear semantic separation
- The `asChild` pattern (inherited from Radix UI) allows seamless integration with routing libraries without wrapper components

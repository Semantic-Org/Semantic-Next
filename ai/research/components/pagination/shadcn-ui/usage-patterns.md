# Shadcn UI - Pagination Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/pagination
Status: ✅ Working
Version: Current
Last Verified: 2025-11-06

## Documentation Quality
Basic - Documentation provides a core example and installation instructions, but lacks comprehensive API documentation, variant details, and advanced usage patterns. The component is a compositional wrapper around standard HTML elements with minimal built-in logic.

## Component Definition
- **Core purpose**: Provide a set of presentational components for building pagination UI that allows users to navigate through multiple pages of content with numbered links, previous/next controls, and ellipsis indicators for large page ranges.
- **Mental model**: A compositional component system where developers assemble pagination UI from primitive building blocks (wrapper, content container, individual items, links, navigation buttons, ellipsis). The component provides styling and structure but not pagination logic.
- **Semantic meaning**: Communicates multi-page content navigation, current page location, and available navigation actions. Helps users understand their position in a data set and move between pages.

## Pattern Support Levels
- **Native**: Dedicated component/prop
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Composed | `PaginationLink` component renders individual page number links with href attribute |
| Previous/Next buttons | ✅ | Native | Dedicated `PaginationPrevious` and `PaginationNext` components with built-in icons and labels |
| First/Last buttons | ❌ | CSS-only | No dedicated components, would require custom implementation using PaginationLink |
| Page size selector | ❌ | CSS-only | Not included, would require separate Select component integration |
| Total count display | ❌ | CSS-only | Not included, would require custom text component |
| Quick jumper | ❌ | CSS-only | Not included, would require custom input component integration |
| Ellipsis indicator | ✅ | Native | Dedicated `PaginationEllipsis` component for showing truncated page ranges |
| Active page highlight | ✅ | Native | `PaginationLink` accepts `isActive` boolean prop for styling current page |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No size variants documented; styling would need custom CSS |
| Simplified mode | ❌ | Composed | No built-in simplified mode; could compose minimal version manually |
| Button style | ✅ | Native | Links styled as button-like elements via default styling |
| Disabled state | ❌ | CSS-only | No disabled prop documented; would require custom implementation |
| Custom rendering | ✅ | Composed | Full compositional control via React children pattern |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ❌ | CSS-only | Stateless component; navigation handled via href links |
| Controlled mode | ❌ | CSS-only | No built-in state management; purely presentational |
| Uncontrolled mode | ❌ | CSS-only | No state management; relies on URL/routing |
| Keyboard navigation | ✅ | Native | Standard browser link keyboard navigation (Tab, Enter) |
| Click handling | ✅ | Composed | Standard link click behavior; can be customized via Link component replacement |

## Code Examples
```jsx
// Primary usage example - Basic pagination with page numbers
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

```jsx
// Framework integration - Next.js routing
// Update PaginationLink component to use Next.js Link:
import Link from "next/link"
import { PaginationLink as BasePaginationLink } from "@/components/ui/pagination"

// Modify type from React.ComponentProps<"a"> to React.ComponentProps<typeof Link>
// Replace <a /> with <Link /> in the component JSX
```

## Installation
```bash
pnpm dlx shadcn@latest add pagination
```

## Notable Features
- **Compositional architecture**: Built from small, focused components that can be assembled flexibly
- **Active state prop**: `isActive` boolean on PaginationLink for highlighting current page
- **Ellipsis component**: Dedicated component for indicating skipped pages in large ranges
- **Framework-agnostic foundation**: Uses standard anchor tags by default, can be adapted to any routing system
- **Minimal JavaScript**: Relies on browser navigation and href attributes rather than complex JS logic
- **Accessible markup**: Uses semantic button and link elements with proper structure

## Implementation Approach
Shadcn UI's pagination is a **presentational component system** rather than a full-featured pagination solution:

1. **No State Management**: The component doesn't track current page, total pages, or handle page changes internally
2. **Routing-Based**: Relies on href attributes and browser/framework routing for navigation
3. **Manual Composition**: Developers must manually compose page number links and determine when to show ellipsis
4. **Styling Framework**: Primarily provides consistent styling and structure via Tailwind CSS classes
5. **Customization Expected**: Developers are expected to implement pagination logic, calculate page ranges, and handle state in parent components

## Architecture Pattern
```
Developer's Responsibility:
├── Calculate total pages
├── Determine current page
├── Generate page number array
├── Decide when to show ellipsis
├── Handle page change logic
└── Update URL/state

Shadcn Component Provides:
├── Visual structure and layout
├── Consistent styling
├── Accessible markup
├── Previous/Next button UI
├── Active state styling
└── Ellipsis indicator
```

## Research Notes
- **Documentation Gaps**: No comprehensive API reference, prop tables, or advanced usage examples
- **Minimalist Design**: Intentionally minimal feature set aligns with Shadcn UI's philosophy of providing starting points rather than full solutions
- **Customization Required**: Most real-world usage will require custom logic for page range calculation, state management, and event handling
- **Copy-Paste Approach**: Follows Shadcn UI's pattern of providing source code to copy and modify rather than npm packages
- **Framework Flexibility**: The basic structure can be adapted to any routing strategy (client-side, server-side, hash-based)
- **No Built-in Logic**: Unlike some component libraries, this doesn't include utilities for calculating page ranges, handling ellipsis logic, or managing pagination state

## Comparison Notes
Compared to feature-rich pagination components in libraries like Ant Design or Material UI:
- **More primitive**: Provides building blocks rather than complete solution
- **Less opinionated**: No built-in logic for common patterns
- **More flexible**: Easy to customize without fighting component abstractions
- **Less batteries-included**: Requires more implementation work from developers
- **Styling-focused**: Primary value is in consistent design rather than functionality

This approach is consistent with Shadcn UI's philosophy: provide well-designed, accessible component primitives that developers customize for their specific needs rather than attempting to cover all use cases out of the box.

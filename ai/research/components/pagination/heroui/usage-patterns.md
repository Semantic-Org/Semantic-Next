# HeroUI - Pagination Usage Patterns

## Component URL
https://www.heroui.com/docs/components/pagination
Status: ✅ Working
Version: v2.8.0
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - The documentation provides detailed information about all props, visual variants, functional capabilities, accessibility features, and includes code examples with interactive demos.

## Component Definition
- **Core purpose**: Provides navigation controls for dividing content across multiple pages, enabling users to move between pages of data in a sequential or random-access manner.
- **Mental model**: A horizontal row of interactive page buttons with optional navigation controls (previous/next) that allows users to navigate through paginated content. The component manages active page state and provides visual feedback about the current position within the total page range.
- **Semantic meaning**: Indicates position within a multi-page dataset and provides controls to navigate between pages. Communicates the total number of pages and current location through numbered buttons and visual highlighting.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Native | Numbered page buttons with `siblings` and `boundaries` props controlling how many pages are shown around current page and at start/end |
| Previous/Next buttons | ✅ | Native | Controlled via `showControls` boolean prop (default: false) |
| First/Last buttons | ❌ | - | Not provided as dedicated buttons; first/last pages appear as numbered buttons based on `boundaries` setting |
| Page size selector | ❌ | - | Not included; would require custom implementation |
| Total count display | ❌ | - | Not provided; component tracks total pages via `total` prop but doesn't display count text |
| Quick jumper | ✅ | Native | `dotsJump` prop (default: 5) controls how many pages are added when clicking ellipsis (...) dots |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with values: sm, md, lg (default: md) |
| Simplified mode | ✅ | Native | `isCompact` boolean prop (default: false) for reduced display style |
| Button style | ✅ | Native | `variant` prop: flat, bordered, light, faded (default: flat); `radius` prop: none, sm, md, lg, full (default: xl) |
| Disabled state | ✅ | Native | `isDisabled` boolean prop (default: false) disables all interactions |
| Custom rendering | ✅ | Native | `renderItem` function prop allows complete customization of pagination items with access to render props (isActive, onNext, onPrevious, setPage) |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | Event handler triggered when page changes (function receives new page number) |
| Controlled mode | ✅ | Native | `page` prop for controlled state management |
| Uncontrolled mode | ✅ | Native | `initialPage` prop (default: 1) for uncontrolled usage |
| Keyboard navigation | ✅ | Native | Built-in keyboard support with ARIA navigation role and semantic controls |
| Loop navigation | ✅ | Native | `loop` boolean prop (default: false) enables circular pagination wrapping at boundaries |
| Shadow effect | ✅ | Native | `showShadow` boolean prop (default: false) adds shadow to active page button |

## Code Examples
```jsx
// Primary usage example - Basic uncontrolled pagination
import {Pagination} from "@heroui/react";

export default function App() {
  return <Pagination initialPage={1} total={10} />;
}

// Controlled pagination with onChange
import {Pagination} from "@heroui/react";
import {useState} from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      page={currentPage}
      total={10}
      onChange={setCurrentPage}
    />
  );
}

// With navigation controls and custom styling
import {Pagination} from "@heroui/react";

export default function App() {
  return (
    <Pagination
      total={20}
      initialPage={1}
      showControls
      variant="bordered"
      size="lg"
      color="primary"
      radius="full"
    />
  );
}

// Compact mode with looping
import {Pagination} from "@heroui/react";

export default function App() {
  return (
    <Pagination
      total={15}
      initialPage={1}
      isCompact
      loop
      showControls
    />
  );
}

// Custom siblings and boundaries configuration
import {Pagination} from "@heroui/react";

export default function App() {
  return (
    <Pagination
      total={30}
      siblings={2}      // Show 2 pages on each side of current
      boundaries={2}    // Show 2 pages at start/end
      dotsJump={10}     // Jump 10 pages when clicking ellipsis
    />
  );
}

// Custom item rendering
import {Pagination, PaginationItemType} from "@heroui/react";

export default function App() {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button key={key} className={className} onClick={onNext}>
          Next
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button key={key} className={className} onClick={onPrevious}>
          Prev
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return <button key={key} className={className}>...</button>;
    }

    return (
      <button
        key={key}
        ref={ref}
        className={className}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <Pagination
      total={10}
      initialPage={1}
      renderItem={renderItem}
    />
  );
}
```
[View Live](https://www.heroui.com/docs/components/pagination) - Interactive examples available in official docs

## Notable Features
- **usePagination Hook**: Provides a headless pagination hook for building fully custom pagination implementations without the default UI, giving complete control over rendering and behavior
- **Ellipsis Navigation**: Clicking ellipsis dots jumps multiple pages (controlled by `dotsJump` prop) rather than just being a static indicator, providing efficient navigation through large page sets
- **Flexible Range Display**: Fine-grained control over which page numbers are visible through `siblings` (pages around current) and `boundaries` (pages at start/end) props, allowing adaptation to various space constraints
- **Nine Customizable Slots**: Extensive styling control through slots (`base`, `wrapper`, `prev`, `next`, `item`, `cursor`, `forwardIcon`, `ellipsis`, `chevronNext`) enabling deep customization without overriding internal structure
- **Animation Control**: Granular animation settings with `disableAnimation` and `disableCursorAnimation` props for performance optimization or custom animation implementations
- **Data Attributes**: Exposes comprehensive data attributes (`data-controls`, `data-loop`, `data-dots-jump`, `data-total`, `data-active-page`) for CSS-based styling and testing selectors
- **Color Theming**: Built-in color variants (default, primary, secondary, success, warning, danger) that integrate with the HeroUI theme system for consistent branding
- **Custom Aria Labels**: `getItemAriaLabel` prop allows customization of accessibility labels for internationalization or specific use case requirements

## Research Notes
- Documentation was comprehensive and well-organized with clear examples for all major use cases
- The component provides a good balance between ease of use (simple uncontrolled mode) and flexibility (controlled mode with custom rendering)
- The `renderItem` API is powerful but requires understanding of the PaginationItemType enum and render prop pattern
- The ellipsis click-to-jump feature is a nice UX enhancement not commonly found in other pagination implementations
- No built-in support for displaying total items count or page size selection, which are common requirements in data-heavy applications - these would need to be implemented as separate components
- The `loop` feature for circular navigation is a thoughtful addition for certain use cases but defaults to false (sensible default)
- Accessibility appears well-considered with ARIA roles, labels, and keyboard navigation built-in
- The component is part of a larger ecosystem (@heroui/react) and leverages shared theme and styling conventions

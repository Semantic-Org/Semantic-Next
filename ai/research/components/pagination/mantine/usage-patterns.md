# Mantine - Pagination Usage Patterns

## Component URL
https://mantine.dev/core/pagination/
Status: ✅ Working
Version: v8.3.6 (Current)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, props reference, compound component architecture, and customization options.

## Component Definition
- **Core purpose**: Displays the active page and enables navigation between multiple pages in a paginated data view. Provides intuitive controls for users to move through large datasets split across pages.
- **Mental model**: Users think of this as a "page switcher" - a familiar navigation pattern that shows where they are in a multi-page sequence and provides controls to move forward, backward, or jump to specific pages.
- **Semantic meaning**: Communicates pagination state and provides navigation affordance. Signals to users that content is split across multiple pages and gives them control over which page to view.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Native | Default behavior with numbered buttons. Can be hidden with `withPages={false}`. Supports `siblings` prop to control how many page numbers appear around active page (default: 1), and `boundaries` prop for items after previous/before next buttons (default: 1). |
| Previous/Next buttons | ✅ | Native | Built-in with customizable icons via `previousIcon` and `nextIcon` props. Available as separate components in compound mode: `Pagination.Previous` and `Pagination.Next`. |
| First/Last buttons | ✅ | Native | Available via `withEdges` boolean prop. Can be customized with `firstIcon` and `lastIcon` props. Available as separate components: `Pagination.First` and `Pagination.Last`. |
| Page size selector | ❌ | - | Not supported. Component only handles page navigation, not items-per-page selection. |
| Total count display | ❌ | Composed | Not built-in, but examples show composition with Text component to display "Showing X-Y of Z" alongside simplified pagination. |
| Quick jumper | ❌ | - | No built-in input to jump to specific page. Navigation is click-based only. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Five size variants: `xs`, `sm`, `md`, `lg`, `xl` via `size` prop. |
| Simplified mode | ✅ | Native | `withPages={false}` removes page number buttons, showing only prev/next controls. Useful for displaying count text separately. |
| Button style | ✅ | Native | Supports `color` prop for active item background, `radius` prop (xs/sm/md/lg/xl) for border radius, and `autoContrast` boolean for automatic text color adjustment. |
| Disabled state | ✅ | Native | `disabled` boolean prop disables all pagination controls. |
| Custom rendering | ✅ | Composed | Compound component architecture with `Pagination.Root`, `Pagination.Items`, `Pagination.Next`, `Pagination.Previous`, `Pagination.First`, `Pagination.Last` allows full layout customization. Custom icons via `nextIcon`, `previousIcon`, `firstIcon`, `lastIcon`, `dotsIcon` props. Link properties via `getItemProps()` and `getControlProps()` callbacks. |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | `onChange` function prop receives new page number when user clicks. |
| Controlled mode | ✅ | Native | Requires both `value` (current page) and `onChange` props for external state management. |
| Uncontrolled mode | ✅ | Native | Use `defaultValue` prop to set initial page without controlling state. Component manages its own state internally. |
| Keyboard navigation | ⚠️ | Native | Component is designed as accessible navigation element following standard pagination patterns, but specific keyboard shortcuts not documented. |

## Code Examples

### Basic Usage
```tsx
import { Pagination } from '@mantine/core';

function Demo() {
  return <Pagination total={10} />;
}
```

### Controlled Mode with State
```tsx
import { useState } from 'react';
import { Pagination } from '@mantine/core';

function Demo() {
  const [page, setPage] = useState(1);
  return <Pagination total={10} value={page} onChange={setPage} />;
}
```

### Simplified Mode with Total Count Display
```tsx
import { useState } from 'react';
import { Group, Pagination, Text } from '@mantine/core';

const limit = 10;
const total = 145;
const totalPages = Math.ceil(total / limit);

function Demo() {
  const [page, setPage] = useState(1);
  const message = `Showing ${limit * (page - 1) + 1} – ${Math.min(total, limit * page)} of ${total}`;

  return (
    <Group justify="flex-end">
      <Text size="sm">{message}</Text>
      <Pagination
        total={totalPages}
        value={page}
        onChange={setPage}
        withPages={false}
      />
    </Group>
  );
}
```

### With First/Last Controls
```tsx
<Pagination total={10} withEdges />
```

### Custom Siblings and Boundaries
```tsx
import { Pagination } from '@mantine/core';

// Control active item siblings (pages shown around current)
<Pagination total={20} siblings={1} defaultValue={10} /> {/* default */}
<Pagination total={20} siblings={2} defaultValue={10} />
<Pagination total={20} siblings={3} defaultValue={10} />

// Control boundary items (pages after previous/before next)
<Pagination total={20} boundaries={1} defaultValue={10} /> {/* default */}
<Pagination total={20} boundaries={2} defaultValue={10} />
<Pagination total={20} boundaries={3} defaultValue={10} />
```

### Custom Icons
```tsx
import { Pagination } from '@mantine/core';
import {
  IconArrowBarToRight,
  IconArrowBarToLeft,
  IconArrowLeft,
  IconArrowRight,
  IconGripHorizontal,
} from '@tabler/icons-react';

function Demo() {
  return (
    <Pagination
      total={10}
      withEdges
      nextIcon={IconArrowRight}
      previousIcon={IconArrowLeft}
      firstIcon={IconArrowBarToLeft}
      lastIcon={IconArrowBarToRight}
      dotsIcon={IconGripHorizontal}
    />
  );
}
```

### Compound Component Architecture
```tsx
import { Group, Pagination } from '@mantine/core';

function Demo() {
  return (
    <Pagination.Root total={10}>
      <Group gap={5} justify="center">
        <Pagination.First />
        <Pagination.Previous />
        <Pagination.Items />
        <Pagination.Next />
        <Pagination.Last />
      </Group>
    </Pagination.Root>
  );
}
```

### Disabled State
```tsx
<Pagination total={10} disabled />
```

### Different Sizes
```tsx
<Pagination total={10} size="xs" />
<Pagination total={10} size="sm" />
<Pagination total={10} size="md" /> {/* default */}
<Pagination total={10} size="lg" />
<Pagination total={10} size="xl" />
```

## Notable Features

- **Compound Component Architecture**: Mantine provides a powerful composition model with sub-components (`Pagination.Root`, `Pagination.Items`, `Pagination.Next`, `Pagination.Previous`, `Pagination.First`, `Pagination.Last`) that allow developers to create completely custom layouts while maintaining consistent behavior and styling.

- **Smart Ellipsis Handling**: The component intelligently shows ellipsis ("...") via the `dotsIcon` prop when there are too many pages to display, with fine-grained control over which pages are shown through `siblings` and `boundaries` props.

- **Flexible Styling System**: Integrates with Mantine's theming system with support for color customization, size variants, border radius control, and automatic contrast adjustment for accessibility.

- **Dual State Management**: Supports both controlled and uncontrolled modes, making it easy to integrate with existing state management or use as a standalone component.

- **Icon Customization**: All navigation icons can be replaced with custom components or icons from any icon library, not just Tabler icons.

- **Link Integration**: The `getItemProps()` and `getControlProps()` callbacks enable integration with routing libraries by allowing developers to add link properties to navigation controls.

- **Accessibility Focused**: Built with accessibility in mind as part of the Mantine design system, though specific ARIA attributes and keyboard navigation details are not extensively documented.

## Research Notes

- Documentation is well-organized with clear examples for each feature and variation.
- The compound component pattern is particularly well-designed, allowing for maximum flexibility without sacrificing usability for common cases.
- No page size selector (items per page) component is included - this would need to be composed separately with a Select component.
- Quick jumper functionality (input to jump to specific page) is not available out of the box.
- The simplified mode example demonstrates good composition patterns by showing how to combine the pagination control with a text display for showing record ranges.
- TypeScript support appears strong based on the examples, with good type inference for props.
- The documentation provides live interactive examples that can be tested directly on the page.

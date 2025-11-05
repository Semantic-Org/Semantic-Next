# Mantine - Navigation Menu Usage Patterns

> Last Modified: 2025-11-05

## Component URL
[https://mantine.dev/core/nav-link/](https://mantine.dev/core/nav-link/)
Status: ✅ Working
Version: Latest (v7+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured documentation with multiple examples, interactive playground, and detailed prop documentation.

## Component Definition
- **Core purpose**: Mantine's NavLink component is a polymorphic navigation link element designed for creating hierarchical navigation structures with built-in support for active states, nested links, and flexible content positioning. It serves as a core building block for navigation menus and sidebars.
- **Mental model**: A navigation link that can expand to show child links, supports visual hierarchy through indentation, and provides styling variants for indicating active/current page state.
- **Semantic meaning**: Represents a navigational destination or menu item in the UI, communicates the current active page through visual styling, and establishes parent-child relationships in multi-level navigation systems.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ❌ | N/A | Not applicable for NavLink component (used in navigation menus) |
| Navigation links | ✅ | Native | Core functionality via `href` prop and label text |
| Search integration | ❌ | N/A | Not part of NavLink; would be composed at navigation menu level |
| User menu/avatar | ✅ | Composed | Achievable via `rightSection` or `leftSection` props with custom components |
| Action buttons | ✅ | Composed | Can be placed in `rightSection` for supplementary actions |
| Primary label | ✅ | Native | `label` prop for main navigation text |
| Secondary description | ✅ | Native | `description` prop for additional context |
| Icon support | ✅ | Native | `leftSection` and `rightSection` props for flexible icon placement |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal navigation | ❌ | CSS-only | NavLink defaults to vertical; horizontal would require custom styling |
| Vertical navigation | ✅ | Native | Natural vertical layout for sidebar navigation |
| Nested menus | ✅ | Native | Full support via nested NavLink components as children with automatic visual hierarchy |
| Mega menu | ❌ | CSS-only | Not designed for mega menu patterns; better suited for traditional hierarchical menus |
| Collapsible sections | ✅ | Native | Expandable nested links with `defaultOpened` prop controlling initial state |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Current link | ✅ | Native | `active` prop for manual control; auto-detects via React Router's `aria-current` attribute |
| Hover states | ✅ | Native | Built-in hover styling through Mantine's theme system |
| Disabled links | ✅ | Native | `disabled` prop prevents interaction while maintaining visibility |
| Nested expansion | ✅ | Native | Nested NavLinks expand/collapse automatically; `defaultOpened` controls initial state |
| Focus states | ✅ | Native | Standard focus styling with `href` attribute required for focus management |
| Mobile menu toggle | ❌ | Composed | Not built-in; compose with Burger or Drawer components at menu container level |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Variants | ✅ | Native | Three variants available: `subtle`, `light`, `filled` |
| Color options | ✅ | Native | Full color palette support via `color` prop; applies to active state background |
| Auto contrast | ✅ | Native | `autoContrast` prop automatically adjusts text color for sufficient contrast when using filled variant |
| Disabled styling | ✅ | Native | Visual indication through opacity and cursor changes |
| Polymorphic element | ✅ | Native | `component` prop allows rendering as different HTML elements or React components |

## Code Examples

### Basic NavLink with Icon
```jsx
import { NavLink } from '@mantine/core';
import { IconHome2 } from '@tabler/icons-react';

function BasicNavLink() {
  return (
    <NavLink
      href="#required-for-focus"
      label="With icon"
      leftSection={<IconHome2 size={16} stroke={1.5} />}
    />
  );
}
```

### Active NavLink with Filled Variant
```jsx
import { NavLink } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';

function ActiveNavLink() {
  return (
    <NavLink
      href="#required-for-focus"
      label="Active filled"
      leftSection={<IconActivity size={16} stroke={1.5} />}
      variant="filled"
      active
      color="blue"
    />
  );
}
```

### Nested Navigation Structure
```jsx
import { NavLink } from '@mantine/core';
import { IconGauge, IconChevronDown } from '@tabler/icons-react';

function NestedNavigation() {
  return (
    <NavLink
      href="#required-for-focus"
      label="Parent link"
      leftSection={<IconGauge size={16} stroke={1.5} />}
      childrenOffset={28}
      defaultOpened={true}
    >
      <NavLink href="#required-for-focus" label="Child link 1" />
      <NavLink href="#required-for-focus" label="Child link 2" />
      <NavLink
        href="#required-for-focus"
        label="Nested child"
        childrenOffset={28}
      >
        <NavLink href="#required-for-focus" label="Grandchild link" />
      </NavLink>
    </NavLink>
  );
}
```

### NavLink with Description and Badge
```jsx
import { NavLink, Badge } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';

function NavLinkWithDescription() {
  return (
    <NavLink
      href="#required-for-focus"
      label="With description"
      description="Additional information or subtitle"
      leftSection={<IconBell size={16} stroke={1.5} />}
      rightSection={<Badge size="xs" color="red" circle>3</Badge>}
    />
  );
}
```

### Polymorphic NavLink with React Router
```jsx
import { NavLink } from '@mantine/core';
import { Link } from 'react-router-dom';

function PolymorphicNavLink() {
  return (
    <NavLink
      component={Link}
      to="/"
      label="Home"
    />
  );
}
```

### Disabled NavLink
```jsx
import { NavLink } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

function DisabledNavLink() {
  return (
    <NavLink
      href="#"
      label="Disabled link"
      leftSection={<IconLock size={16} stroke={1.5} />}
      disabled
    />
  );
}
```

### Using All Variants
```jsx
import { NavLink } from '@mantine/core';
import { IconHome2, IconSettings, IconUsers } from '@tabler/icons-react';

function NavLinkVariants() {
  return (
    <>
      <NavLink
        href="#"
        label="Subtle variant"
        leftSection={<IconHome2 size={16} stroke={1.5} />}
        variant="subtle"
        active
      />
      <NavLink
        href="#"
        label="Light variant"
        leftSection={<IconSettings size={16} stroke={1.5} />}
        variant="light"
        active
      />
      <NavLink
        href="#"
        label="Filled variant"
        leftSection={<IconUsers size={16} stroke={1.5} />}
        variant="filled"
        active
        autoContrast
      />
    </>
  );
}
```

### Right Section with Custom Action
```jsx
import { NavLink, ActionIcon } from '@mantine/core';
import { IconChevronRight, IconTrash } from '@tabler/icons-react';

function NavLinkWithAction() {
  return (
    <NavLink
      href="#"
      label="Link with action"
      leftSection={<IconChevronRight size={16} stroke={1.5} />}
      rightSection={
        <ActionIcon
          size="xs"
          color="red"
          radius="md"
          variant="transparent"
          onClick={(e) => {
            e.preventDefault();
            console.log('Delete action');
          }}
        >
          <IconTrash size={14} stroke={1.5} />
        </ActionIcon>
      }
    />
  );
}
```

[View Live Examples](https://mantine.dev/core/nav-link/) *(Interactive playground available on Mantine documentation site)*

## Notable Features

### Polymorphic Component Design
NavLink is fully polymorphic via the `component` prop, allowing it to render as any HTML element or React component (common pattern: React Router Link, Next.js Link). This ensures compatibility with any routing solution while maintaining consistent styling.

### React Router Integration
Automatic active state detection via React Router's `aria-current` attribute - no need to manually manage the `active` prop when using React Router NavLink. This reduces boilerplate in modern React applications.

### Visual Hierarchy Through Indentation
The `childrenOffset` prop (default 28px) automatically handles indentation for nested NavLinks, creating clean visual hierarchy without requiring manual CSS adjustments. Customizable per level for flexible design.

### Auto Contrast for Accessibility
The `autoContrast` prop automatically adjusts text color based on background in filled variant, ensuring WCAG AA contrast compliance when active state is applied.

### Flexible Content Positioning
The `leftSection` and `rightSection` props allow any ReactNode, enabling icon placement, badges, action buttons, or custom indicators without requiring wrapper elements or class manipulation.

### Expansion/Collapse Support
Nested NavLinks automatically handle expand/collapse behavior with visual indicators (chevron icons). The component manages open state without explicit state management in simple use cases.

## Research Notes

### Observations
- **Strong hierarchical support**: Mantine NavLink excels at creating nested navigation structures with minimal boilerplate - child NavLinks are first-class citizens rather than an afterthought
- **Clear active state handling**: The integration with React Router through `aria-current` is well-thought-out, reducing boilerplate for modern React applications
- **Variant system**: Three variants (subtle, light, filled) provide good range without being overwhelming - covers common navigation menu design patterns
- **Icon-first design**: The component assumes icon + text pattern (leftSection + label), which aligns with modern navigation UI trends

### Component Relationship to Navigation Menu Pattern
NavLink is a **single link component**, not a container for entire navigation menus. In practice, NavLink components are typically composed within parent containers (Stack, Group, or custom wrappers) to create complete navigation menus. This is different from all-in-one "NavMenu" components - Mantine favors composition.

### Notable API Decisions
- **`label` as primary prop**: Text content is managed separately from children, keeping text and nested links conceptually distinct
- **`description` as built-in pattern**: Secondary text is a first-class feature, not a composition pattern, suggesting Mantine values descriptive navigation
- **`childrenOffset` over class-based indentation**: Explicit prop for indentation amount makes responsive design easier and avoids CSS coupling


# Mantine - Tabs Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/tabs/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear explanations, multiple examples, and detailed prop descriptions. Well-organized with examples covering basic usage through advanced patterns.

## Component Definition
- **Core purpose**: Provides a tabbed interface component that enables users to switch between different views or content sections while maintaining a vertical tab list.
- **Mental model**: A container-based component where `<Tabs>` wraps both `<Tabs.List>` (tab controls) and `<Tabs.Panel>` (content areas), with automatic state management between selected tabs.
- **Semantic meaning**: Establishes structured, organized content presentation that allows users to quickly navigate between related sections or views without cluttering the interface.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `defaultValue`, `value`, `onChange`)
- **Composed**: Via composition/children (e.g., `<Tabs><Tabs.Tab></Tabs.Tab></Tabs>`)
- **CSS-only**: Requires custom styling (e.g., `classNames` prop with Styles API)

## State Management Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uncontrolled | ✅ | Native | `defaultValue` prop sets initial active tab; component manages state internally |
| Controlled | ✅ | Native | `value` and `onChange` props enable full external state control |
| Tab activation | ✅ | Native | `activateTabWithKeyboard` prop (default: true) enables arrow key navigation |
| Tab deactivation | ✅ | Native | `allowTabDeactivation` prop permits users to toggle active tab off |
| Panel mounting | ✅ | Native | `keepMounted` prop (default: true) controls whether inactive panels stay mounted |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal tabs | ✅ | Native | Default layout with tabs arranged horizontally in `<Tabs.List>` |
| Vertical tabs | ✅ | Native | `orientation="vertical"` stacks tabs vertically |
| Tab list positioning | ✅ | Native | `placement` prop controls position in vertical mode: "left" or "right" |
| Inverted layout | ✅ | Native | `inverted` prop places panel content above tab list |
| Tab growth | ✅ | Native | Use `grow` prop on `<Tabs.List>` to expand tabs to fill width |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Responsive orientation | ✅ | Composed | Use MediaQuery or responsive props to switch between horizontal/vertical |
| Mobile-friendly | ✅ | Native | Tabs respond to viewport with built-in scrolling support |
| Breakpoint-based layout | ✅ | Composed | Can conditionally render vertical vs horizontal based on breakpoints |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color variants | ✅ | Native | `color` prop on `<Tabs>` or individual `<Tabs.Tab>` elements customizes highlight color |
| Component variants | ✅ | Native | `variant` prop supports: "default" (underline), "outline", "pills" |
| Styles API | ✅ | Native | `classNames` prop with selectors: `root`, `list`, `panel`, `tab`, `tabLabel`, `tabSection` |
| Custom styling | ✅ | CSS-only | FloatingIndicator component for custom tab indicators |
| Icon styling | ✅ | Native | `leftSection` prop for icons; `aria-label` required for icon-only tabs |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ✅ | Native | Arrow keys (horizontal/vertical), Home/End keys, skip disabled tabs |
| ARIA labels | ✅ | Native | `aria-label` on `<Tabs.List>` and icon-only tabs required for screen readers |
| WAI-ARIA compliance | ✅ | Native | Follows WAI-ARIA Tabs pattern with proper roles and attributes |
| Tab disabling | ✅ | Native | `disabled` prop on individual `<Tabs.Tab>` elements skips during navigation |
| Focus management | ✅ | Native | Automatic focus handling with keyboard activation |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Router integration | ✅ | Composed | Works with React Router and Next.js; control via URL with `value` prop |
| Tab unmounting | ✅ | Native | Disable `keepMounted` to completely unmount inactive panels and reset state |
| Ref access | ✅ | Native | Get references to tab control elements for imperative control |
| Icon support | ✅ | Native | `leftSection` prop accepts React components for icons/custom elements |
| Nested tabs | ✅ | Composed | Tabs can be nested within panels for multi-level navigation |
| Tab badges | ✅ | Composed | Use `rightSection` prop on tabs for notification badges or status indicators |

## Code Examples

### Basic Uncontrolled Tabs
```jsx
<Tabs defaultValue="gallery">
  <Tabs.List>
    <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
    <Tabs.Tab value="messages">Messages</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>
  <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
</Tabs>
```

### Controlled Tabs with onChange
```jsx
const [activeTab, setActiveTab] = useState('gallery');

<Tabs value={activeTab} onChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
    <Tabs.Tab value="messages">Messages</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="gallery">Gallery content</Tabs.Panel>
  <Tabs.Panel value="messages">Messages content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Horizontal Tabs with Color
```jsx
<Tabs defaultValue="first" color="cyan">
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
  <Tabs.Panel value="third">Third tab</Tabs.Panel>
</Tabs>
```

### Vertical Tabs
```jsx
<Tabs defaultValue="settings" orientation="vertical">
  <Tabs.List>
    <Tabs.Tab value="account">Account Settings</Tabs.Tab>
    <Tabs.Tab value="privacy">Privacy</Tabs.Tab>
    <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">Account settings content</Tabs.Panel>
  <Tabs.Panel value="privacy">Privacy settings content</Tabs.Panel>
  <Tabs.Panel value="notifications">Notifications settings content</Tabs.Panel>
</Tabs>
```

### Tabs with Icons
```jsx
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

<Tabs defaultValue="gallery">
  <Tabs.List>
    <Tabs.Tab value="gallery" leftSection={<IconPhoto />}>
      Gallery
    </Tabs.Tab>
    <Tabs.Tab value="messages" leftSection={<IconMessageCircle />}>
      Messages
    </Tabs.Tab>
    <Tabs.Tab value="settings" leftSection={<IconSettings />}>
      Settings
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="gallery">Gallery content</Tabs.Panel>
  <Tabs.Panel value="messages">Messages content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Icon-Only Tabs
```jsx
<Tabs defaultValue="gallery" aria-label="Main navigation">
  <Tabs.List>
    <Tabs.Tab value="gallery" aria-label="Gallery">
      <IconPhoto />
    </Tabs.Tab>
    <Tabs.Tab value="messages" aria-label="Messages">
      <IconMessageCircle />
    </Tabs.Tab>
    <Tabs.Tab value="settings" aria-label="Settings">
      <IconSettings />
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="gallery">Gallery content</Tabs.Panel>
  <Tabs.Panel value="messages">Messages content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Outline Variant
```jsx
<Tabs defaultValue="first" variant="outline">
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
  <Tabs.Panel value="third">Third tab</Tabs.Panel>
</Tabs>
```

### Pills Variant
```jsx
<Tabs defaultValue="first" variant="pills">
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
  <Tabs.Panel value="third">Third tab</Tabs.Panel>
</Tabs>
```

### Grow Tabs (Full Width)
```jsx
<Tabs defaultValue="first">
  <Tabs.List grow>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
  <Tabs.Panel value="third">Third tab</Tabs.Panel>
</Tabs>
```

### Disabled Tab
```jsx
<Tabs defaultValue="first">
  <Tabs.List>
    <Tabs.Tab value="first">Enabled</Tabs.Tab>
    <Tabs.Tab value="second" disabled>
      Disabled
    </Tabs.Tab>
    <Tabs.Tab value="third">Enabled</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
  <Tabs.Panel value="third">Third tab</Tabs.Panel>
</Tabs>
```

### Inverted Layout (Panel Above Tabs)
```jsx
<Tabs defaultValue="first" inverted>
  <Tabs.Panel value="first">First tab content</Tabs.Panel>
  <Tabs.Panel value="second">Second tab content</Tabs.Panel>
  <Tabs.Panel value="third">Third tab content</Tabs.Panel>
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

### Tab with Badges (Right Section)
```jsx
<Tabs defaultValue="messages">
  <Tabs.List>
    <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
    <Tabs.Tab value="messages" rightSection={<Badge>5</Badge>}>
      Messages
    </Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="gallery">Gallery content</Tabs.Panel>
  <Tabs.Panel value="messages">Messages content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Allow Tab Deactivation
```jsx
<Tabs defaultValue="first" allowTabDeactivation>
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab content</Tabs.Panel>
  <Tabs.Panel value="second">Second tab content</Tabs.Panel>
  <Tabs.Panel value="third">Third tab content</Tabs.Panel>
</Tabs>
```

### Unmount Inactive Panels
```jsx
<Tabs defaultValue="first" keepMounted={false}>
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
    <Tabs.Tab value="third">Third</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab (resets state when hidden)</Tabs.Panel>
  <Tabs.Panel value="second">Second tab (resets state when hidden)</Tabs.Panel>
  <Tabs.Panel value="third">Third tab (resets state when hidden)</Tabs.Panel>
</Tabs>
```

### Right-Positioned Vertical Tabs
```jsx
<Tabs defaultValue="account" orientation="vertical" placement="right">
  <Tabs.List>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="privacy">Privacy</Tabs.Tab>
    <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">Account settings</Tabs.Panel>
  <Tabs.Panel value="privacy">Privacy settings</Tabs.Panel>
  <Tabs.Panel value="notifications">Notification settings</Tabs.Panel>
</Tabs>
```

### Router Integration with Next.js
```jsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TabsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'gallery';

  const handleTabChange = (tab) => {
    router.push(`?tab=${tab}`);
  };

  return (
    <Tabs value={activeTab} onChange={handleTabChange}>
      <Tabs.List>
        <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
        <Tabs.Tab value="messages">Messages</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="gallery">Gallery content</Tabs.Panel>
      <Tabs.Panel value="messages">Messages content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
    </Tabs>
  );
}
```

### Nested Tabs
```jsx
<Tabs defaultValue="general">
  <Tabs.List>
    <Tabs.Tab value="general">General</Tabs.Tab>
    <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="general">
    <Tabs defaultValue="profile">
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="account">Account</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">Profile content</Tabs.Panel>
      <Tabs.Panel value="account">Account content</Tabs.Panel>
    </Tabs>
  </Tabs.Panel>

  <Tabs.Panel value="advanced">
    Advanced settings content
  </Tabs.Panel>
</Tabs>
```

### Custom Styling with Styles API
```jsx
<Tabs
  defaultValue="first"
  classNames={{
    root: 'border-2 border-blue-500',
    list: 'gap-2 p-2 bg-gray-100',
    tab: 'px-4 py-2 font-semibold',
    tabLabel: 'uppercase text-sm',
    panel: 'p-4 bg-white rounded'
  }}
>
  <Tabs.List>
    <Tabs.Tab value="first">First</Tabs.Tab>
    <Tabs.Tab value="second">Second</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
</Tabs>
```

### Keyboard Navigation Control
```jsx
<Tabs defaultValue="first" activateTabWithKeyboard={false}>
  <Tabs.List>
    <Tabs.Tab value="first">First (No keyboard)</Tabs.Tab>
    <Tabs.Tab value="second">Second (No keyboard)</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="first">First tab</Tabs.Panel>
  <Tabs.Panel value="second">Second tab</Tabs.Panel>
</Tabs>
```

## Notable Features

### Flexible State Management
Supports both uncontrolled (with `defaultValue`) and controlled (with `value`/`onChange`) patterns, enabling integration with form libraries, URL routing, and global state management.

### Multiple Visual Variants
Three built-in variants (default underline, outline, pills) provide different visual aesthetics. Custom variants can be created using the FloatingIndicator component for advanced styling.

### Keyboard Accessibility
Full keyboard support with arrow keys (horizontal/vertical), Home/End keys for first/last tabs, and automatic focus management. Disabled tabs are skipped during navigation.

### Flexible Panel Mounting
The `keepMounted` prop controls whether inactive panels remain in the DOM or unmount completely. Unmounting resets internal state (useful for form inputs), while keeping mounted preserves state and improves switching speed.

### Router Integration
Works seamlessly with React Router and Next.js routing. Set `value` from URL params and `onChange` to update the URL, enabling bookmarkable tab states.

### Icon and Badge Support
The `leftSection` prop accepts any React component for icons or custom elements. The `rightSection` prop supports badges and status indicators for notification counts or tab status.

### Responsive Orientation
Tabs can switch between horizontal and vertical orientation. In vertical mode, the `placement` prop controls whether tabs appear on the left or right side.

### Inverted Layout
The `inverted` prop places panel content above the tab list, useful for certain design patterns where tab controls should appear at the bottom.

### Custom Indicators
While default variant uses an underline indicator, custom indicators can be created using Mantine's `FloatingIndicator` component for animated or styled indicators.

## Research Notes

- Documentation is comprehensive with well-organized examples progressing from basic to advanced patterns
- Mantine v8.3.6 provides a mature, production-ready tabs implementation following WAI-ARIA specifications
- The component supports both controlled and uncontrolled patterns, providing flexibility for different use cases
- Keyboard navigation is enabled by default, making it accessible without additional configuration
- The Styles API provides extensive customization capability through the `classNames` prop
- Router integration examples show patterns for URL-driven tab state (common in Next.js and React Router apps)
- The `keepMounted` prop provides an elegant solution for choosing between state preservation and reset
- Icon-only tabs require explicit `aria-label` attributes for screen reader accessibility
- Nested tabs are supported through composition, enabling multi-level navigation structures
- The component uses Mantine's design tokens and color system for consistent theming
- All examples use React/JSX syntax with the @mantine/core package

# Mantine - AppShell Header Component

## Component Overview

The Mantine AppShell.Header is a fixed-position header component that is part of the larger AppShell layout system. It provides a responsive header solution that remains visible at the top of the viewport and integrates seamlessly with other shell components (navbar, aside, footer). The header uses `position: fixed` to prevent scrolling with page content and automatically manages spacing offsets for the main content area.

**Common Use Cases:**
- Application navigation bars with logo and menu items
- Responsive headers with mobile burger menus
- Headers with search functionality
- User profile and action menus in header
- Headers that hide/show on scroll (with useHeadroom hook)
- Multi-row navigation layouts
- Headers with notification centers
- Headers integrating with collapsible side navigation

---

## Component URL & Status

**URL:** https://mantine.dev/core/app-shell/
**Status:** ✅ Working
**Date Verified:** 2025-11-10

---

## Documentation Quality

**Overall Rating:** Excellent

**Strengths:**
- Comprehensive code examples covering basic to advanced patterns
- Clear explanation of configuration object structure
- Well-documented responsive behavior with breakpoint examples
- Excellent coverage of integration with navbar and other shell components
- Good accessibility guidance with semantic HTML usage
- Detailed props documentation with type information
- Advanced patterns like useHeadroom scroll behavior documented

**Weaknesses:**
- Limited standalone header examples (most are within full AppShell context)
- Could use more examples of header content composition patterns
- Missing detailed examples of multi-row header layouts
- Limited guidance on header styling customization

---

## Content Patterns

### Logo/Brand Area
The header typically includes a logo or brand section positioned within the header content area.

```jsx
import { AppShell, Group, Text } from '@mantine/core';

function HeaderWithLogo() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <div>Logo</div>
          <Text>My Application</Text>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

### Navigation Links
Headers commonly contain navigation links as part of the content composition.

```jsx
import { AppShell, Group, Button } from '@mantine/core';

function HeaderWithNav() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>Logo</div>
          <Group>
            <Button variant="subtle">Home</Button>
            <Button variant="subtle">About</Button>
            <Button variant="subtle">Contact</Button>
          </Group>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

### Actions/Buttons
Headers include action buttons for common tasks and user interactions.

```jsx
import { AppShell, Group, Button, ActionIcon } from '@mantine/core';
import { IconBell, IconSettings } from '@tabler/icons-react';

function HeaderWithActions() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>Logo</div>
          <Group>
            <ActionIcon variant="subtle">
              <IconBell size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle">
              <IconSettings size={20} />
            </ActionIcon>
            <Button>Sign In</Button>
          </Group>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

### Search Functionality
Headers can incorporate search inputs for site-wide search.

```jsx
import { AppShell, Group, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function HeaderWithSearch() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>Logo</div>
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Button>Account</Button>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

### User Menu
Headers typically include user profile menus with account actions.

```jsx
import { AppShell, Group, Menu, Avatar, Text } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';

function HeaderWithUserMenu() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>Logo</div>
          <Menu>
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }}>
                <Avatar size="sm" />
                <Text size="sm">John Doe</Text>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconUser size={16} />}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={16} />} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

---

## Layout Patterns

### Fixed Position (Default)
Header uses `position: fixed` to remain visible during scrolling.

```jsx
import { AppShell } from '@mantine/core';

function FixedHeader() {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>Header stays fixed at top</AppShell.Header>
      <AppShell.Main>
        {/* Content scrolls beneath fixed header */}
      </AppShell.Main>
    </AppShell>
  );
}
```

**Key Features:**
- Header remains at viewport top during scroll
- Main content automatically offset by header height
- Z-index default of 100 ensures proper layering

### Sticky Position with Scroll Behavior
Header can hide/show based on scroll position using useHeadroom hook.

```jsx
import { AppShell, rem } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';

function ScrollBehaviorHeader() {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: false }}
      padding="md"
    >
      <AppShell.Header>Header hides on scroll down</AppShell.Header>
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        {/* Content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

**Key Features:**
- Header collapses when scrolling down past threshold
- Returns when scrolling up
- Manual padding management when offset disabled
- Configurable scroll threshold

### Responsive Height
Header height adjusts across different viewport sizes.

```jsx
import { AppShell } from '@mantine/core';

function ResponsiveHeightHeader() {
  return (
    <AppShell
      header={{
        height: {
          base: 48,  // Mobile
          sm: 60,    // Tablet
          lg: 76     // Desktop
        }
      }}
    >
      <AppShell.Header>Responsive height header</AppShell.Header>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell>
  );
}
```

**Key Features:**
- Different heights per breakpoint
- Main content offset adjusts automatically
- Smooth transitions between sizes

### Multi-Row Layout
Headers can contain multiple rows of content using layout components.

```jsx
import { AppShell, Group, Stack, Divider } from '@mantine/core';

function MultiRowHeader() {
  return (
    <AppShell header={{ height: 100 }}>
      <AppShell.Header>
        <Stack gap={0}>
          <Group h={50} px="md" justify="space-between">
            <div>Logo</div>
            <Group>
              <Button variant="subtle">Sign In</Button>
            </Group>
          </Group>
          <Divider />
          <Group h={50} px="md">
            <Button variant="subtle">Home</Button>
            <Button variant="subtle">Products</Button>
            <Button variant="subtle">About</Button>
            <Button variant="subtle">Contact</Button>
          </Group>
        </Stack>
      </AppShell.Header>
    </AppShell>
  );
}
```

---

## State Patterns

### Active/Selected Navigation
Track and display active navigation items within header.

```jsx
import { AppShell, Group, Button } from '@mantine/core';
import { useState } from 'react';

function HeaderWithActiveState() {
  const [active, setActive] = useState('home');

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <div>Logo</div>
          <Group>
            <Button
              variant={active === 'home' ? 'filled' : 'subtle'}
              onClick={() => setActive('home')}
            >
              Home
            </Button>
            <Button
              variant={active === 'about' ? 'filled' : 'subtle'}
              onClick={() => setActive('about')}
            >
              About
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

### Collapsed State
Header can be hidden programmatically.

```jsx
import { AppShell, Button } from '@mantine/core';
import { useState } from 'react';

function CollapsibleHeader() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppShell header={{ height: 60, collapsed }}>
      <AppShell.Header>Header content</AppShell.Header>
      <AppShell.Main>
        <Button onClick={() => setCollapsed(!collapsed)}>
          Toggle Header
        </Button>
      </AppShell.Main>
    </AppShell>
  );
}
```

### Scroll-Based Visibility
Dynamic visibility based on scroll position.

```jsx
import { AppShell } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';

function ScrollBasedHeader() {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: false }}
    >
      <AppShell.Header>
        Hides when scrolling down, shows when scrolling up
      </AppShell.Header>
      <AppShell.Main>{/* Content */}</AppShell.Main>
    </AppShell>
  );
}
```

---

## Variation Patterns

### Height Options

#### Fixed Height
Standard numeric height value.

```jsx
<AppShell header={{ height: 60 }}>
  <AppShell.Header>60px height header</AppShell.Header>
</AppShell>
```

#### Responsive Height
Height adapts to viewport size.

```jsx
<AppShell
  header={{
    height: {
      base: 48,   // Mobile: 48px
      sm: 60,     // Small: 60px
      md: 60,     // Medium: 60px
      lg: 76,     // Large: 76px
      xl: 76      // Extra large: 76px
    }
  }}
>
  <AppShell.Header>Responsive height</AppShell.Header>
</AppShell>
```

### Border Control

#### With Border (Default)
Header includes bottom border.

```jsx
<AppShell header={{ height: 60 }}>
  <AppShell.Header>Header with border</AppShell.Header>
</AppShell>
```

#### Without Border
Remove border for seamless appearance.

```jsx
<AppShell header={{ height: 60 }}>
  <AppShell.Header withBorder={false}>
    Header without border
  </AppShell.Header>
</AppShell>
```

### Z-Index Configuration

#### Default Z-Index
Standard z-index of 100.

```jsx
<AppShell header={{ height: 60 }}>
  <AppShell.Header>Default z-index: 100</AppShell.Header>
</AppShell>
```

#### Custom Z-Index
Override for specific layering needs.

```jsx
<AppShell header={{ height: 60 }} zIndex={200}>
  <AppShell.Header>Custom z-index: 200</AppShell.Header>
</AppShell>
```

### Layout Modes

#### Default Layout
Header spans full width, navbar height reduced by header height.

```jsx
<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300, breakpoint: 'sm' }}
  layout="default"
>
  <AppShell.Header>Full-width header</AppShell.Header>
  <AppShell.Navbar>Navbar</AppShell.Navbar>
</AppShell>
```

#### Alt Layout
Navbar extends full height, header width reduced by navbar width.

```jsx
<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300, breakpoint: 'sm' }}
  layout="alt"
>
  <AppShell.Header>Header beside navbar</AppShell.Header>
  <AppShell.Navbar>Full-height navbar</AppShell.Navbar>
</AppShell>
```

---

## Integration Patterns

### Header with Mobile Burger Menu
Standard responsive pattern with hamburger menu toggle.

```jsx
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function ResponsiveHeader() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <div>Logo</div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>Navigation</AppShell.Navbar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell>
  );
}
```

**Key Features:**
- Burger menu visible only on mobile
- Toggles navbar visibility
- Logo remains visible on all sizes

### Header with Separate Desktop/Mobile Navigation
Independent navigation controls per device type.

```jsx
import { AppShell, Button, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function DualNavigationHeader() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <div>Logo</div>
          </Group>
          <Button onClick={toggleDesktop} visibleFrom="sm">
            Toggle Sidebar
          </Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>Navigation</AppShell.Navbar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell>
  );
}
```

### Header with Notification Center
Header integrating notification functionality.

```jsx
import { AppShell, Group, Indicator, ActionIcon, Menu } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';

function HeaderWithNotifications() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>Logo</div>
          <Menu>
            <Menu.Target>
              <Indicator inline label="3" size={16}>
                <ActionIcon variant="subtle">
                  <IconBell size={20} />
                </ActionIcon>
              </Indicator>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Notifications</Menu.Label>
              <Menu.Item>New message from John</Menu.Item>
              <Menu.Item>Your order has shipped</Menu.Item>
              <Menu.Item>System update available</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

### Header with Search Bar
Header featuring integrated search functionality.

```jsx
import { AppShell, Group, TextInput, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

function HeaderWithSearch() {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>Logo</div>
          {searchVisible ? (
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 400 }}
            />
          ) : (
            <ActionIcon onClick={() => setSearchVisible(true)}>
              <IconSearch size={20} />
            </ActionIcon>
          )}
        </Group>
      </AppShell.Header>
    </AppShell>
  );
}
```

---

## Code Examples

### Example 1: Complete Responsive Header with Navigation

```jsx
import { AppShell, Burger, Group, Button, Menu, Avatar, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconSettings, IconLogout } from '@tabler/icons-react';

export function CompleteResponsiveHeader() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          {/* Left section with burger and logo */}
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl" fw={700}>MyApp</Text>
          </Group>

          {/* Center navigation - desktop only */}
          <Group visibleFrom="sm">
            <Button variant="subtle">Home</Button>
            <Button variant="subtle">Products</Button>
            <Button variant="subtle">About</Button>
            <Button variant="subtle">Contact</Button>
          </Group>

          {/* Right section with user menu */}
          <Menu>
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }}>
                <Avatar size={32} radius="xl" />
                <Text size="sm" visibleFrom="sm">John Doe</Text>
                <IconChevronDown size={16} />
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <Button variant="light" fullWidth>Home</Button>
          <Button variant="light" fullWidth>Products</Button>
          <Button variant="light" fullWidth>About</Button>
          <Button variant="light" fullWidth>Contact</Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Page content */}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Example 2: Header with Scroll Behavior

```jsx
import { AppShell, Group, Button, rem } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';

export function ScrollBehaviorHeader() {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: false }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text size="xl" fw={700}>MyApp</Text>
          <Group>
            <Button variant="subtle">Home</Button>
            <Button variant="subtle">Products</Button>
            <Button variant="subtle">About</Button>
            <Button>Sign In</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        {/* Long scrollable content */}
        {Array(100).fill(0).map((_, index) => (
          <p key={index}>
            Scroll down to hide header, scroll up to show it again
          </p>
        ))}
      </AppShell.Main>
    </AppShell>
  );
}
```

### Example 3: Header with Advanced Search

```jsx
import { AppShell, Group, TextInput, ActionIcon, Button, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function HeaderWithAdvancedSearch() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="xl" fw={700}>MyApp</Text>
          </Group>

          {searchExpanded ? (
            <Group style={{ flex: 1, maxWidth: 600 }}>
              <TextInput
                placeholder="Search products, articles, pages..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchValue('');
                    }}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                }
                style={{ flex: 1 }}
              />
              <Menu>
                <Menu.Target>
                  <ActionIcon>
                    <IconFilter size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Filter by</Menu.Label>
                  <Menu.Item>Products</Menu.Item>
                  <Menu.Item>Articles</Menu.Item>
                  <Menu.Item>Pages</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group>
              <ActionIcon
                onClick={() => setSearchExpanded(true)}
                size="lg"
                variant="subtle"
              >
                <IconSearch size={20} />
              </ActionIcon>
              <Button>Sign In</Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navigation</AppShell.Navbar>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell>
  );
}
```

### Example 4: Header with Notification Center

```jsx
import {
  AppShell,
  Group,
  ActionIcon,
  Indicator,
  Menu,
  Text,
  Avatar,
  ScrollArea,
  Badge
} from '@mantine/core';
import { IconBell, IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function HeaderWithNotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New message', message: 'You have a new message from John', read: false },
    { id: 2, title: 'Order shipped', message: 'Your order #1234 has been shipped', read: false },
    { id: 3, title: 'Update available', message: 'A new version is available', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text size="xl" fw={700}>MyApp</Text>

          <Group>
            <Menu width={320} position="bottom-end">
              <Menu.Target>
                <Indicator
                  inline
                  label={unreadCount}
                  size={16}
                  disabled={unreadCount === 0}
                >
                  <ActionIcon variant="subtle" size="lg">
                    <IconBell size={20} />
                  </ActionIcon>
                </Indicator>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <Group justify="space-between">
                    <Text>Notifications</Text>
                    {unreadCount > 0 && (
                      <Badge size="sm">{unreadCount} new</Badge>
                    )}
                  </Group>
                </Menu.Label>
                <ScrollArea.Autosize maxHeight={300}>
                  {notifications.map((notification) => (
                    <Menu.Item
                      key={notification.id}
                      leftSection={
                        <Avatar size="sm" radius="xl" />
                      }
                      rightSection={
                        !notification.read && (
                          <Badge size="xs" variant="dot" />
                        )
                      }
                    >
                      <div>
                        <Text size="sm" fw={500}>{notification.title}</Text>
                        <Text size="xs" c="dimmed">{notification.message}</Text>
                      </div>
                    </Menu.Item>
                  ))}
                </ScrollArea.Autosize>
                <Menu.Divider />
                <Menu.Item>
                  <Text size="sm" ta="center">View all notifications</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>Content</AppShell.Main>
    </AppShell>
  );
}
```

---

## Key Properties/Props

### AppShell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `object` | - | Header configuration object (height, collapsed, offset) |
| `navbar` | `object` | - | Navbar configuration object (width, breakpoint, collapsed) |
| `aside` | `object` | - | Aside configuration object (width, breakpoint, collapsed) |
| `footer` | `object` | - | Footer configuration object (height, collapsed, offset) |
| `padding` | `MantineSpacing` | `0` | Main content padding and section offsets |
| `layout` | `'default' \| 'alt'` | `'default'` | Positioning strategy for sections |
| `disabled` | `boolean` | `false` | Disable all sections except Main |
| `withBorder` | `boolean` | `true` | Add borders to all sections |
| `zIndex` | `number` | `100` | Z-index for all sections |
| `transitionDuration` | `number` | `200` | Animation duration in ms |
| `transitionTimingFunction` | `string` | `'ease'` | CSS timing function for animations |

### Header Configuration Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `height` | `number \| object` | - | Header height (number converts to rem, object for responsive) |
| `collapsed` | `boolean` | `false` | Hide header from view |
| `offset` | `boolean` | `true` | Whether Main should be offset by header height |

**Responsive Height Example:**
```typescript
header: {
  height: {
    base: 48,  // Mobile
    sm: 60,    // Small screens
    lg: 76     // Large screens
  }
}
```

### AppShell.Header Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Header content |
| `withBorder` | `boolean` | - | Override global border setting |
| `zIndex` | `number` | - | Override global z-index |
| `className` | `string` | - | CSS class for custom styling |
| `style` | `CSSProperties` | - | Inline styles |

### Integration Props (Navbar-related)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navbar.width` | `number \| object` | - | Navbar width (100% on mobile) |
| `navbar.breakpoint` | `MantineBreakpoint` | - | Viewport size for mobile mode |
| `navbar.collapsed` | `object` | - | Collapse state: `{ mobile: boolean, desktop: boolean }` |

---

## Notable Features

### 1. Automatic Offset Management
The header automatically manages spacing offsets for the main content area, eliminating manual padding calculations.

```jsx
<AppShell header={{ height: 60 }}>
  <AppShell.Header>Header</AppShell.Header>
  <AppShell.Main>
    {/* Content automatically offset by 60px */}
  </AppShell.Main>
</AppShell>
```

### 2. CSS Variables for Dynamic Styling
AppShell provides CSS variables for advanced customization:
- `--app-shell-header-height`
- `--app-shell-header-offset`

```jsx
<AppShell.Main style={{
  paddingTop: 'calc(var(--app-shell-header-height) + 1rem)'
}}>
  Content with custom offset
</AppShell.Main>
```

### 3. Integrated Scroll Behavior Hook
The `useHeadroom` hook from `@mantine/hooks` enables sophisticated scroll-based visibility.

```jsx
const pinned = useHeadroom({ fixedAt: 120 });

<AppShell header={{ height: 60, collapsed: !pinned }}>
  {/* Header hides on scroll down, shows on scroll up */}
</AppShell>
```

### 4. Responsive Breakpoint System
Headers support responsive configuration with breakpoint-specific values.

```jsx
<AppShell
  header={{
    height: {
      base: 48,   // < sm
      sm: 60,     // >= sm && < md
      md: 60,     // >= md && < lg
      lg: 76,     // >= lg && < xl
      xl: 76      // >= xl
    }
  }}
>
```

### 5. Semantic HTML Elements
AppShell.Header renders as a native `<header>` element, ensuring proper document structure and accessibility.

```jsx
// Renders as: <header class="...">Header content</header>
<AppShell.Header>Header content</AppShell.Header>
```

### 6. Two Layout Modes
AppShell supports two distinct layout strategies:

**Default Mode:** Header spans full width, navbar height reduced by header
**Alt Mode:** Navbar spans full height, header width reduced by navbar

```jsx
<AppShell layout="alt">
  {/* Alt layout positioning */}
</AppShell>
```

### 7. Independent Mobile/Desktop States
Separate collapse controls for mobile and desktop viewports enable sophisticated responsive behaviors.

```jsx
const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

<AppShell
  navbar={{
    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
  }}
>
```

### 8. Transition Customization
Fine-grained control over animation behavior.

```jsx
<AppShell
  transitionDuration={300}
  transitionTimingFunction="ease-in-out"
>
```

### 9. Border Control
Global and per-section border management.

```jsx
<AppShell withBorder={false}>  {/* No borders anywhere */}
  <AppShell.Header withBorder={true}>  {/* Override for header */}
```

### 10. Z-Index Management
Configurable stacking context for proper layering with other UI elements.

```jsx
<AppShell zIndex={200}>  {/* Global z-index */}
  <AppShell.Header zIndex={300}>  {/* Header-specific override */}
```

---

## Accessibility Notes

### Semantic HTML Structure
AppShell.Header renders as a native `<header>` element, providing proper landmark navigation for screen readers.

```jsx
// Renders as: <header>...</header>
<AppShell.Header>Header content</AppShell.Header>
```

### Keyboard Navigation
All interactive elements within the header (buttons, menus, links) maintain standard keyboard accessibility:
- **Tab**: Move between focusable elements
- **Enter/Space**: Activate buttons and controls
- **Arrow keys**: Navigate within menus

### Focus Management
When using the Burger component to toggle navigation:
```jsx
<Burger
  opened={opened}
  onClick={toggle}
  aria-label="Toggle navigation"  // Important for screen readers
/>
```

### Screen Reader Support
- Header content is announced as a banner landmark
- Navigation elements within header are properly labeled
- State changes (menu open/close) are communicated

### Best Practices

1. **Always provide aria-labels for icon buttons:**
```jsx
<ActionIcon aria-label="Open notifications">
  <IconBell />
</ActionIcon>
```

2. **Use semantic navigation markup:**
```jsx
<nav aria-label="Main navigation">
  <Group>
    <Button>Home</Button>
    <Button>About</Button>
  </Group>
</nav>
```

3. **Ensure sufficient color contrast** for text and interactive elements (WCAG AA: 4.5:1 for normal text)

4. **Maintain logical focus order** that follows visual layout

5. **Test with keyboard only** to verify all functionality is accessible

6. **Provide skip links** for users to bypass repetitive header content:
```jsx
<a href="#main-content" style={{ position: 'absolute', left: '-9999px' }}>
  Skip to main content
</a>
```

---

## Related Components

- **AppShell.Navbar** - Left sidebar navigation component
- **AppShell.Aside** - Right sidebar component
- **AppShell.Footer** - Fixed footer component
- **AppShell.Main** - Main content area
- **AppShell.Section** - Organized sections within navbar/aside
- **Burger** - Hamburger menu toggle button
- **Menu** - Dropdown menu component
- **ActionIcon** - Icon button component
- **Group** - Flexbox layout component
- **ScrollArea** - Custom scrollbar component

---

Research completed: 2025-11-10
Component: AppShell.Header
Framework: Mantine
Documentation: https://mantine.dev/core/app-shell/

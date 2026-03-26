# Mantine - Drawer Component

## Component Overview

The Mantine Drawer is an overlay panel component that slides in from any edge of the screen (left, right, top, or bottom) to display secondary content, navigation, or actions without full-page navigation. It provides a focused surface for displaying contextual information, forms, menus, or settings panels while keeping users within their current context.

**Common Use Cases:**
- Navigation panels and side menus
- Filter panels and search interfaces
- Settings and configuration screens
- Shopping carts and checkout flows
- User profiles and account details
- Form wizards and multi-step processes
- Contextual help and documentation
- Notification centers and activity feeds

---

## Usage Patterns

### Basic Usage

The simplest drawer implementation uses the `useDisclosure` hook for state management and includes the basic props for control:

```tsx
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';

function BasicDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>

      <Button variant="default" onClick={open}>
        Open Drawer
      </Button>
    </>
  );
}
```

**Key Components:**
1. **State Management** - Uses `useDisclosure` hook to control open/closed state
2. **opened** - Boolean prop controlling visibility
3. **onClose** - Callback function to handle drawer closing
4. **title** - Optional title displayed in the header

---

### Variants/Styles

Mantine Drawer does not have distinct visual variants like some other components. Instead, styling customization is achieved through:

#### Overlay Customization
Control the backdrop appearance with blur and opacity effects.

```tsx
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';

function CustomOverlayDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Drawer with custom overlay"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        Drawer content with blurred overlay background
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

#### Radius Customization
Control the border radius of the drawer panel.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  offset={8}
  radius="md"
  title="Drawer with border radius"
>
  Content
</Drawer>
```

#### Header Removal
Remove the header entirely for a minimal presentation.

```tsx
function HeaderlessDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} withCloseButton={false}>
        Drawer without header, press escape or click on overlay to close
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

---

### States

#### Closed State (Default)
Drawer is hidden from view. Only the trigger button or element is visible.

```tsx
const [opened, { open, close }] = useDisclosure(false); // false = closed by default

<Drawer opened={opened} onClose={close} title="Closed by default">
  Content
</Drawer>
```

#### Open State
Drawer slides in from the specified position and displays content with an overlay backdrop.

```tsx
const [opened, { open, close }] = useDisclosure(false);

// Call open() function to open the drawer
<Button onClick={open}>Open Drawer</Button>

<Drawer opened={opened} onClose={close} title="Now open">
  Visible content
</Drawer>
```

#### Controlled State
Full programmatic control over the drawer state.

```tsx
import { useState } from 'react';
import { Drawer, Button } from '@mantine/core';

function ControlledDrawer() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Controlled Drawer"
      >
        Content
      </Drawer>

      <Button onClick={() => setOpened(true)}>Open</Button>
      <Button onClick={() => setOpened(false)}>Close</Button>
    </>
  );
}
```

---

### Sizing Options

Drawer size determines the width (for left/right drawers) or height (for top/bottom drawers).

#### Predefined Sizes
Five standard size options available.

```tsx
// Extra small drawer
<Drawer size="xs" position="right" opened={opened} onClose={close}>
  Extra small drawer
</Drawer>

// Small drawer
<Drawer size="sm" position="right" opened={opened} onClose={close}>
  Small drawer
</Drawer>

// Medium drawer (default)
<Drawer size="md" position="right" opened={opened} onClose={close}>
  Medium drawer
</Drawer>

// Large drawer
<Drawer size="lg" position="right" opened={opened} onClose={close}>
  Large drawer
</Drawer>

// Extra large drawer
<Drawer size="xl" position="right" opened={opened} onClose={close}>
  Extra large drawer
</Drawer>
```

#### Custom Sizes
Use percentage, rem, or pixel values for precise sizing.

```tsx
// Percentage-based size
<Drawer size="55%" position="right" opened={opened} onClose={close}>
  55% width drawer
</Drawer>

// Fixed pixel size
<Drawer size={400} position="right" opened={opened} onClose={close}>
  400px width drawer
</Drawer>

// Rem-based size
<Drawer size="40rem" position="right" opened={opened} onClose={close}>
  40rem width drawer
</Drawer>

// Full width/height
<Drawer size="100%" position="right" opened={opened} onClose={close}>
  Full width drawer
</Drawer>
```

---

### Layout & Positioning

#### Position Options
Drawer can slide in from any of the four screen edges.

```tsx
// Left side (default)
<Drawer position="left" opened={opened} onClose={close} title="Left Drawer">
  Slides in from the left
</Drawer>

// Right side
<Drawer position="right" opened={opened} onClose={close} title="Right Drawer">
  Slides in from the right
</Drawer>

// Top
<Drawer position="top" opened={opened} onClose={close} title="Top Drawer">
  Slides in from the top
</Drawer>

// Bottom
<Drawer position="bottom" opened={opened} onClose={close} title="Bottom Drawer">
  Slides in from the bottom
</Drawer>
```

#### Offset from Edge
Add spacing between the drawer and viewport edge.

```tsx
<Drawer
  offset={8}
  radius="md"
  opened={opened}
  onClose={close}
  title="Drawer with offset"
>
  8px offset from screen edge
</Drawer>
```

---

### Content & Structure

#### Basic Content Structure
Simple content directly in the drawer body.

```tsx
<Drawer opened={opened} onClose={close} title="Simple Content">
  <p>This is the drawer content.</p>
  <p>It can contain text, components, or any React elements.</p>
</Drawer>
```

#### Compound Components for Full Control
Use compound components for complete customization of drawer structure.

```tsx
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';

function CompoundDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer.Root opened={opened} onClose={close}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Drawer title</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>Drawer content</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

**Compound Component Breakdown:**
- **Drawer.Root** - Context provider wrapper that manages state
- **Drawer.Overlay** - Background overlay/backdrop element
- **Drawer.Content** - Main drawer container
- **Drawer.Header** - Sticky header section (remains visible while scrolling)
- **Drawer.Title** - Semantic h2 heading element for accessibility
- **Drawer.CloseButton** - Close button control
- **Drawer.Body** - Content area that scrolls when content overflows

#### Rich Content in Drawers
Drawers can contain complex layouts, forms, tables, or any React components.

```tsx
import { Drawer, TextInput, Button, Stack, Divider } from '@mantine/core';

function FormDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="User Profile">
        <Stack>
          <TextInput label="First Name" placeholder="John" />
          <TextInput label="Last Name" placeholder="Doe" />
          <TextInput label="Email" placeholder="john@example.com" type="email" />
          <Divider />
          <Button>Save Changes</Button>
        </Stack>
      </Drawer>

      <Button onClick={open}>Edit Profile</Button>
    </>
  );
}
```

---

### Interactive Features

#### Scrolling Behavior
When content exceeds drawer height, it automatically scrolls within the body while the header remains sticky.

```tsx
function ScrollableDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  const content = Array(100)
    .fill(0)
    .map((_, index) => <p key={index}>Drawer with scroll</p>);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Header is sticky">
        {content}
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

#### ScrollArea Integration
Enhanced scroll control with Mantine's ScrollArea component.

```tsx
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, ScrollArea } from '@mantine/core';

function ScrollAreaDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  const content = Array(100)
    .fill(0)
    .map((_, index) => <p key={index}>Drawer with custom scroll</p>);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Custom scroll behavior"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {content}
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

#### Close Behavior Controls
Configure how users can close the drawer.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Custom close behavior"
  closeOnEscape={true}         // Close with Escape key (default: true)
  closeOnClickOutside={true}    // Close when clicking overlay (default: true)
  returnFocus={true}            // Return focus to trigger element (default: true)
>
  Content
</Drawer>
```

#### Custom Close Button Icon
Replace the default close button icon.

```tsx
import { IconXboxX } from '@tabler/icons-react';

function CustomCloseButtonDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Custom close icon"
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
      >
        Drawer content
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

---

### Animation & Transitions

#### Default Transition
Drawer slides in from its position with a smooth animation (200ms default).

```tsx
<Drawer opened={opened} onClose={close} title="Default animation">
  Smooth slide-in animation
</Drawer>
```

#### Custom Transition Configuration
Customize the animation type, duration, and timing function.

```tsx
function CustomTransitionDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Custom transition"
        transitionProps={{
          transition: 'rotate-left',
          duration: 150,
          timingFunction: 'linear'
        }}
      >
        Drawer with rotate-left transition
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

#### Transition Lifecycle Callbacks
Execute code at specific points in the animation lifecycle.

```tsx
import { useState } from 'react';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function TransitionCallbackDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerData, setDrawerData] = useState({
    title: '',
    message: '',
  });

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        onEnterTransitionEnd={() => {
          console.log('Drawer fully opened');
        }}
        onExitTransitionEnd={() => {
          // Clear data after drawer closes
          setDrawerData({ title: '', message: '' });
          console.log('Drawer fully closed and data cleared');
        }}
        title={drawerData.title}
      >
        {drawerData.message}
      </Drawer>

      <Button
        onClick={() => {
          setDrawerData({
            title: 'Edit your profile',
            message: 'Form content here'
          });
          open();
        }}
      >
        Open with data
      </Button>
    </>
  );
}
```

---

### Integration Patterns

#### Navigation Drawer
Use as a side navigation menu for mobile or desktop layouts.

```tsx
import { Drawer, NavLink, Button } from '@mantine/core';
import { IconHome, IconSettings, IconUser, IconLogout } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

function NavigationDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Navigation">
        <NavLink
          label="Dashboard"
          leftSection={<IconHome size={16} />}
          onClick={close}
        />
        <NavLink
          label="Profile"
          leftSection={<IconUser size={16} />}
          onClick={close}
        />
        <NavLink
          label="Settings"
          leftSection={<IconSettings size={16} />}
          onClick={close}
        />
        <NavLink
          label="Logout"
          leftSection={<IconLogout size={16} />}
          onClick={close}
        />
      </Drawer>

      <Button onClick={open}>Open Menu</Button>
    </>
  );
}
```

#### Filter Panel
Drawer containing filter controls for data tables or search results.

```tsx
import { Drawer, Button, Stack, Select, MultiSelect, RangeSlider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function FilterDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Filters" position="right">
        <Stack>
          <Select
            label="Category"
            placeholder="Select category"
            data={['Electronics', 'Clothing', 'Books', 'Home']}
          />
          <MultiSelect
            label="Brands"
            placeholder="Select brands"
            data={['Brand A', 'Brand B', 'Brand C']}
          />
          <RangeSlider
            label="Price Range"
            min={0}
            max={1000}
            defaultValue={[0, 500]}
          />
          <Button>Apply Filters</Button>
        </Stack>
      </Drawer>

      <Button onClick={open}>Show Filters</Button>
    </>
  );
}
```

#### Shopping Cart Drawer
Side panel showing cart items and checkout process.

```tsx
import { Drawer, Button, Group, Text, Divider, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function CartDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Shopping Cart" position="right">
        <Stack>
          {/* Cart items */}
          <Group justify="space-between">
            <Text>Product 1</Text>
            <Text>$29.99</Text>
          </Group>
          <Group justify="space-between">
            <Text>Product 2</Text>
            <Text>$49.99</Text>
          </Group>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text fw={700}>Total</Text>
            <Text fw={700}>$79.98</Text>
          </Group>
          <Button fullWidth>Checkout</Button>
        </Stack>
      </Drawer>

      <Button onClick={open}>View Cart (2)</Button>
    </>
  );
}
```

#### Multiple Drawers with Stack
Manage multiple drawers with automatic z-index and overlay management.

```tsx
import { Button, Group, Drawer, useDrawersStack } from '@mantine/core';

function MultipleDrawers() {
  const stack = useDrawersStack(['delete-page', 'confirm-action', 'really-confirm-action']);

  return (
    <>
      <Drawer.Stack>
        <Drawer {...stack.register('delete-page')} title="Delete this page?">
          Are you sure you want to delete this page? This action cannot be undone.
          <Group mt="lg" justify="flex-end">
            <Button onClick={stack.closeAll} variant="default">
              Cancel
            </Button>
            <Button onClick={() => stack.open('confirm-action')} color="red">
              Delete
            </Button>
          </Group>
        </Drawer>

        <Drawer {...stack.register('confirm-action')} title="Confirm action">
          Are you sure you want to perform this action? This action cannot be undone.
          If you are sure, press confirm button below.
          <Group mt="lg" justify="flex-end">
            <Button onClick={stack.closeAll} variant="default">
              Cancel
            </Button>
            <Button onClick={() => stack.open('really-confirm-action')} color="red">
              Confirm
            </Button>
          </Group>
        </Drawer>

        <Drawer {...stack.register('really-confirm-action')} title="Really confirm action">
          Jokes aside. You have confirmed this action. This is your last chance to cancel it.
          <Group mt="lg" justify="flex-end">
            <Button onClick={stack.closeAll} variant="default">
              Cancel
            </Button>
            <Button onClick={stack.closeAll} color="red">
              Confirm
            </Button>
          </Group>
        </Drawer>
      </Drawer.Stack>

      <Button onClick={() => stack.open('delete-page')}>
        Open drawer
      </Button>
    </>
  );
}
```

**Drawer.Stack Features:**
- Automatic z-index management for layered drawers
- Single overlay rendering (even with multiple open drawers)
- Focus trap limited to active/topmost drawer
- Escape key closes only the topmost drawer
- `useDrawersStack` hook for state management

---

### Accessibility Features

#### ARIA Support
Mantine Drawer automatically implements WAI-ARIA dialog patterns.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Accessible Drawer"  // Creates aria-labelledby connection
>
  {/* Automatically includes:
      - role="dialog" on drawer content
      - aria-modal="true" for modal behavior
      - aria-labelledby linking to title
      - aria-describedby for content description
  */}
  Content
</Drawer>
```

#### Custom ARIA Labels
Provide clear labels for assistive technologies.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Settings"
  closeButtonProps={{
    'aria-label': 'Close settings drawer'
  }}
>
  Settings content
</Drawer>
```

#### Focus Management
Control initial focus when drawer opens.

```tsx
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, TextInput } from '@mantine/core';

function FocusManagementDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Focus demo">
        <TextInput label="First input" placeholder="First input" />
        <TextInput
          data-autofocus  // This input receives focus when drawer opens
          label="Input with initial focus"
          placeholder="It has data-autofocus attribute"
          mt="md"
        />
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

#### Hidden Initial Focus Target
Use `FocusTrap.InitialFocus` for invisible initial focus.

```tsx
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, TextInput, FocusTrap } from '@mantine/core';

function HiddenFocusDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Focus demo">
        <FocusTrap.InitialFocus />  {/* Hidden element receives initial focus */}
        <TextInput label="First input" placeholder="First input" />
        <TextInput
          label="Second input"
          placeholder="Second input"
          mt="md"
        />
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
```

#### Focus Trap
Keep keyboard focus within the drawer.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Focus trapped drawer"
  trapFocus={true}  // Default: true - prevents tabbing outside drawer
>
  Content
</Drawer>
```

#### Keyboard Navigation
Full keyboard support for interactions:

- **Tab / Shift+Tab** - Navigate between focusable elements inside drawer
- **Escape** - Close the drawer (configurable via `closeOnEscape`)
- **Enter / Space** - Activate buttons and interactive elements

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Keyboard accessible"
  closeOnEscape={true}  // Allow closing with Escape key
  trapFocus={true}      // Keep focus within drawer
  returnFocus={true}    // Return focus to trigger after close
>
  Keyboard navigation enabled
</Drawer>
```

#### Screen Reader Support
All text and state changes are properly announced to screen readers:
- Drawer opening/closing is announced
- Title is read as dialog label
- Focus changes are announced
- Interactive elements have proper roles and labels

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opened` | `boolean` | `false` | Controls drawer visibility |
| `onClose` | `() => void` | - | Callback function when drawer closes |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Edge of screen where drawer appears |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number` | `'md'` | Width (left/right) or height (top/bottom) |
| `title` | `ReactNode` | - | Drawer title displayed in header |
| `offset` | `number` | `0` | Distance in pixels from viewport edge |
| `radius` | `number \| string` | `0` | Border radius of drawer panel |
| `withCloseButton` | `boolean` | `true` | Display close button in header |
| `closeButtonProps` | `object` | - | Props passed to close button (icon, aria-label, etc) |
| `overlayProps` | `object` | - | Overlay configuration (backgroundOpacity, blur) |
| `transitionProps` | `object` | - | Animation configuration (transition, duration, timingFunction) |
| `scrollAreaComponent` | `Component` | - | Custom scroll component (e.g., ScrollArea.Autosize) |
| `trapFocus` | `boolean` | `true` | Trap keyboard focus inside drawer |
| `closeOnEscape` | `boolean` | `true` | Allow closing with Escape key |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking overlay backdrop |
| `returnFocus` | `boolean` | `true` | Return focus to trigger element after close |
| `removeScrollProps` | `object` | - | React-remove-scroll configuration |
| `onEnterTransitionEnd` | `() => void` | - | Callback after opening animation completes |
| `onExitTransitionEnd` | `() => void` | - | Callback after closing animation completes |
| `className` | `string` | - | CSS class for custom styling |
| `styles` | `object` | - | Mantine styles object for theme customization |
| `classNames` | `object` | - | CSS classes for sub-elements |
| `children` | `ReactNode` | - | Drawer content |

### Compound Component Props

**Drawer.Root**
- `opened` - Controls drawer visibility
- `onClose` - Close callback
- All standard Drawer props

**Drawer.Overlay**
- `backgroundOpacity` - Overlay opacity (0-1)
- `blur` - Blur amount in pixels
- All standard overlay props

**Drawer.Content**
- Standard div props for the main container

**Drawer.Header**
- Standard header element props

**Drawer.Title**
- Standard h2 heading element props

**Drawer.Body**
- Standard div props for content area

**Drawer.CloseButton**
- `icon` - Custom close icon element
- `aria-label` - Accessibility label
- All standard button props

---

## Code Examples

### Example 1: Mobile Navigation Drawer
A responsive navigation menu that slides in from the left.

```tsx
import { Drawer, NavLink, Button, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconSettings,
  IconUser,
  IconShoppingCart,
  IconLogout,
  IconMenu2
} from '@tabler/icons-react';

export function MobileNavDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Menu"
        position="left"
        size="sm"
      >
        <Stack gap="xs">
          <NavLink
            label="Home"
            leftSection={<IconHome size={20} />}
            onClick={close}
          />
          <NavLink
            label="Profile"
            leftSection={<IconUser size={20} />}
            onClick={close}
          />
          <NavLink
            label="Shopping Cart"
            leftSection={<IconShoppingCart size={20} />}
            onClick={close}
          />
          <NavLink
            label="Settings"
            leftSection={<IconSettings size={20} />}
            onClick={close}
          />
          <NavLink
            label="Logout"
            leftSection={<IconLogout size={20} />}
            color="red"
            onClick={close}
          />
        </Stack>
      </Drawer>

      <Button
        onClick={open}
        leftSection={<IconMenu2 size={20} />}
        variant="subtle"
      >
        Menu
      </Button>
    </>
  );
}
```

### Example 2: E-commerce Filter Drawer
A right-side filter panel for product browsing.

```tsx
import {
  Drawer,
  Button,
  Stack,
  Select,
  MultiSelect,
  RangeSlider,
  Text,
  Group,
  Divider
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter } from '@tabler/icons-react';

export function ProductFilterDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const handleApplyFilters = () => {
    // Apply filter logic here
    console.log('Applying filters...');
    close();
  };

  const handleClearFilters = () => {
    setPriceRange([0, 500]);
    // Clear other filters
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Filter Products"
        position="right"
        size="md"
      >
        <Stack>
          <Select
            label="Category"
            placeholder="All categories"
            data={[
              'Electronics',
              'Clothing',
              'Books',
              'Home & Garden',
              'Sports & Outdoors'
            ]}
          />

          <MultiSelect
            label="Brands"
            placeholder="Select brands"
            data={[
              'Brand A',
              'Brand B',
              'Brand C',
              'Brand D',
              'Brand E'
            ]}
          />

          <div>
            <Text size="sm" fw={500} mb="xs">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Text>
            <RangeSlider
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              marks={[
                { value: 0, label: '$0' },
                { value: 500, label: '$500' },
                { value: 1000, label: '$1000' },
              ]}
            />
          </div>

          <Select
            label="Rating"
            placeholder="Minimum rating"
            data={[
              '5 stars',
              '4 stars & up',
              '3 stars & up',
              '2 stars & up'
            ]}
          />

          <Select
            label="Availability"
            placeholder="All items"
            data={[
              'In Stock',
              'Out of Stock',
              'Pre-order'
            ]}
          />

          <Divider my="md" />

          <Group grow>
            <Button variant="default" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Group>
        </Stack>
      </Drawer>

      <Button
        onClick={open}
        leftSection={<IconFilter size={18} />}
      >
        Filters
      </Button>
    </>
  );
}
```

### Example 3: Multi-Step Form Drawer
A drawer containing a wizard-style form process.

```tsx
import {
  Drawer,
  Button,
  TextInput,
  Stack,
  Group,
  Stepper,
  Select,
  Textarea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function MultiStepFormDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = () => {
    console.log('Form submitted');
    close();
    setActive(0); // Reset to first step
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Create New Account"
        position="right"
        size="lg"
      >
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Personal Info" description="Basic information">
            <Stack mt="md">
              <TextInput
                label="First Name"
                placeholder="John"
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                required
              />
              <TextInput
                label="Email"
                placeholder="john@example.com"
                type="email"
                required
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Address" description="Location details">
            <Stack mt="md">
              <TextInput
                label="Street Address"
                placeholder="123 Main St"
                required
              />
              <Group grow>
                <TextInput label="City" placeholder="New York" required />
                <TextInput label="State" placeholder="NY" required />
              </Group>
              <TextInput label="ZIP Code" placeholder="10001" required />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Preferences" description="Account settings">
            <Stack mt="md">
              <Select
                label="Account Type"
                placeholder="Select type"
                data={['Personal', 'Business', 'Enterprise']}
                required
              />
              <Textarea
                label="Additional Notes"
                placeholder="Any special requirements?"
                minRows={3}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack mt="md">
              <Text>All steps completed! Ready to create your account.</Text>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        <Group justify="space-between" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active < 2 && (
            <Button onClick={nextStep} ml="auto">
              Next
            </Button>
          )}
          {active === 2 && (
            <Button onClick={nextStep} ml="auto">
              Review
            </Button>
          )}
          {active === 3 && (
            <Button onClick={handleSubmit} ml="auto">
              Submit
            </Button>
          )}
        </Group>
      </Drawer>

      <Button onClick={open}>Sign Up</Button>
    </>
  );
}
```

### Example 4: Shopping Cart Drawer
A drawer displaying cart items and checkout process.

```tsx
import {
  Drawer,
  Button,
  Group,
  Text,
  Divider,
  Stack,
  Image,
  ActionIcon,
  Badge
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShoppingCart, IconTrash } from '@tabler/icons-react';

const cartItems = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, quantity: 1, image: '/headphones.jpg' },
  { id: 2, name: 'Laptop Stand', price: 49.99, quantity: 2, image: '/stand.jpg' },
  { id: 3, name: 'USB-C Cable', price: 12.99, quantity: 3, image: '/cable.jpg' },
];

export function ShoppingCartDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Shopping Cart"
        position="right"
        size="md"
      >
        <Stack>
          {cartItems.map((item) => (
            <Group key={item.id} justify="space-between" align="flex-start">
              <Group>
                <Image
                  src={item.image}
                  width={60}
                  height={60}
                  radius="sm"
                />
                <div>
                  <Text size="sm" fw={500}>{item.name}</Text>
                  <Text size="xs" c="dimmed">Qty: {item.quantity}</Text>
                  <Text size="sm" fw={700} mt={4}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </div>
              </Group>
              <ActionIcon variant="subtle" color="red">
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          ))}

          <Divider my="md" />

          <Stack gap="xs">
            <Group justify="space-between">
              <Text>Subtotal</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Tax (8%)</Text>
              <Text>${tax.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg" fw={700}>Total</Text>
              <Text size="lg" fw={700}>${total.toFixed(2)}</Text>
            </Group>
          </Stack>

          <Button fullWidth size="lg" mt="xl">
            Proceed to Checkout
          </Button>

          <Button fullWidth variant="subtle" onClick={close}>
            Continue Shopping
          </Button>
        </Stack>
      </Drawer>

      <Button
        onClick={open}
        leftSection={<IconShoppingCart size={20} />}
        rightSection={
          <Badge size="sm" variant="filled" color="red">
            {cartItems.length}
          </Badge>
        }
      >
        Cart
      </Button>
    </>
  );
}
```

---

## Accessibility Notes

### Built-in ARIA Support
Mantine Drawer automatically implements the WAI-ARIA dialog pattern:
- **role="dialog"** on drawer content for dialog semantics
- **aria-modal="true"** to indicate modal behavior
- **aria-labelledby** automatically links to title element
- **aria-describedby** for content description when provided

### Focus Management
- **Initial focus**: Automatically focuses first focusable element or `data-autofocus` element
- **Focus trap**: Keyboard focus stays within drawer when `trapFocus={true}` (default)
- **Focus return**: Returns focus to trigger element when `returnFocus={true}` (default)
- **Visual focus indicators**: Clear focus outlines on interactive elements

### Keyboard Accessibility
- **Tab / Shift+Tab**: Navigate between focusable elements inside drawer
- **Escape**: Close drawer when `closeOnEscape={true}` (default)
- **Enter / Space**: Activate buttons and controls
- Focus order follows DOM structure for predictable navigation

### Screen Reader Support
- Drawer opening is announced to screen readers
- Title is read as dialog label
- Content changes are announced appropriately
- Close button has clear aria-label
- State changes (opening/closing) are communicated

### Best Practices
1. **Always provide a title**: Use the `title` prop for proper ARIA labeling
2. **Clear close button labels**: Use `closeButtonProps={{ 'aria-label': 'Close drawer name' }}`
3. **Logical focus order**: Ensure tab order follows visual layout
4. **Keyboard testing**: Verify all functionality works without mouse
5. **Screen reader testing**: Test with NVDA, JAWS, or VoiceOver
6. **Avoid focus traps in nested content**: Ensure modals/dialogs inside drawers handle focus correctly
7. **Meaningful content**: Ensure drawer purpose is clear from title and content

---

## Common Patterns

### Pattern 1: Responsive Navigation Menu
Mobile-friendly navigation that slides in from the side.

```tsx
const [opened, { open, close }] = useDisclosure(false);

<Drawer opened={opened} onClose={close} title="Menu" position="left" size="xs">
  <Stack>
    <NavLink label="Home" onClick={close} />
    <NavLink label="Products" onClick={close} />
    <NavLink label="About" onClick={close} />
    <NavLink label="Contact" onClick={close} />
  </Stack>
</Drawer>
```

### Pattern 2: Settings Panel
Configuration drawer that slides from the right.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Settings"
  position="right"
  size="md"
>
  <Stack>
    <Switch label="Dark Mode" />
    <Switch label="Email Notifications" />
    <Select label="Language" data={['English', 'Spanish', 'French']} />
    <Button>Save Changes</Button>
  </Stack>
</Drawer>
```

### Pattern 3: Details/Preview Panel
Show detailed information without leaving current page.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="User Details"
  position="right"
  size="lg"
>
  <UserProfile userId={selectedUserId} />
</Drawer>
```

### Pattern 4: Notification Center
Display notifications and messages.

```tsx
<Drawer
  opened={opened}
  onClose={close}
  title="Notifications"
  position="right"
  size="sm"
>
  <Stack>
    {notifications.map(notification => (
      <NotificationCard key={notification.id} {...notification} />
    ))}
  </Stack>
</Drawer>
```

---

## Related Components

- **Modal** - Full-screen centered overlay for primary focus content
- **Popover** - Floating content attached to target element
- **Menu** - Dropdown menu for navigation and actions
- **Navbar** - Persistent navigation sidebar
- **Overlay** - Background overlay/backdrop component
- **ScrollArea** - Enhanced scrollable container
- **Dialog** - Simple confirmation or alert overlay
- **FloatingIndicator** - Positioning helper for floating elements

---

Research completed: 2025-11-06
Component: Drawer
Framework: Mantine
Documentation: https://mantine.dev/core/drawer/

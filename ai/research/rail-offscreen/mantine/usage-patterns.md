# Mantine Drawer - Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/drawer/
Status: ✅ Working
Version: v8.x (latest)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, extensive prop coverage, TypeScript support, and practical use cases demonstrating placement, sizing, state management, animations, accessibility, and advanced patterns.

## Component Overview

Mantine's **Drawer** component is a flexible, accessible off-canvas panel that slides in from the edges of the screen. It serves as a lightweight alternative to modals for navigation, forms, filters, and supplementary content.

The Drawer component is built on top of Mantine's Transition and Modal foundations, providing:
- Multiple positioning options (left, right, top, bottom)
- Customizable sizing and animations
- Full focus management and keyboard navigation
- ARIA-compliant accessibility
- Support for nested drawers via Drawer.Stack
- Integration with forms and complex content

**Mental Model**: A slide-out panel from any screen edge that overlays content, typically used for navigation, filtering, or contextual actions without blocking the main content entirely.

**Semantic Meaning**: Communicates supplementary, contextual content that can be dismissed, supporting workflows that require temporary interaction without full-page modal behavior.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `position="left"`, `opened={true}`)
- **Composed**: Via composition/children (e.g., `<Drawer.Header>`, `<Drawer.Body>`)
- **CSS-only**: Requires custom styling (e.g., Styles API for granular control)

## Basic Usage

### Simple Drawer Example

```tsx
import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Drawer Title">
        Drawer content goes here
      </Drawer>

      <Button onClick={open}>Open drawer</Button>
    </>
  );
}
```

The basic structure requires:
- **opened** - Boolean state controlling visibility
- **onClose** - Callback function when drawer closes
- **title** - Optional header text (sets `aria-labelledby`)
- **children** - Drawer content

### Drawer with Composed Structure

```tsx
import { Drawer, Button, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close}>
        <Drawer.Header>
          <Drawer.Title>My Drawer</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Stack>
            <Text>Content section</Text>
          </Stack>
        </Drawer.Body>

        <Drawer.Footer>
          <Button>Save</Button>
        </Drawer.Footer>
      </Drawer>

      <Button onClick={open}>Open drawer</Button>
    </>
  );
}
```

## Props/API

### Drawer (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opened` | `boolean` | `false` | Controlled open state |
| `onClose` | `() => void` | Required | Callback when drawer closes |
| `title` | `ReactNode` | `undefined` | Header text; sets aria-labelledby for accessibility |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Which edge the drawer slides from |
| `size` | `string \| number` | `'md'` | Width (left/right) or height (top/bottom); accepts xs, sm, md, lg, xl, full, or CSS values |
| `offset` | `number` | `0` | Offset between drawer and screen edge (px) |
| `padding` | `MantineSpacing` | `'md'` | Inner padding |
| `radius` | `MantineRadius` | `undefined` | Border radius |
| `shadow` | `MantineShadow` | `'xl'` | Shadow depth |
| `withCloseButton` | `boolean` | `true` | Show close button in header |
| `closeButtonProps` | `object` | `{}` | Props for close button component |
| `trapFocus` | `boolean` | `true` | Trap focus inside drawer |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key press |
| `closeOnClickOutside` | `boolean` | `true` | Close when overlay is clicked |
| `returnFocus` | `boolean` | `true` | Return focus to trigger element on close |
| `overlayProps` | `object` | `{}` | Props for overlay background |
| `transitionProps` | `object` | See below | Customize Transition component behavior |
| `zIndex` | `number` | `1000` | Base z-index for drawer |
| `portalProps` | `object` | `{}` | Portal configuration |
| `keepMounted` | `boolean` | `false` | Keep drawer in DOM when closed |
| `children` | `ReactNode` | `undefined` | Drawer content |

### Drawer.Header

Header section container.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Header content |

### Drawer.Title

Title element within header.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Title text |

### Drawer.CloseButton

Close button for header.

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` | Custom close icon |
| `aria-label` | `string` | ARIA label for accessibility |

### Drawer.Body

Body section container (typically the main content area).

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Body content |

### Drawer.Footer

Footer section container (typically for actions).

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Footer content |

### Drawer.Stack

Manages multiple drawers, handling z-index and focus management automatically.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Drawers to manage |

## Common Patterns

### Pattern 1: Basic Drawer with Header and Footer

```tsx
import { Drawer, Button, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function BasicDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Settings">
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Stack gap="md">
            <Text>Configure your preferences here</Text>
            {/* Content */}
          </Stack>
        </Drawer.Body>

        <Drawer.Footer>
          <Group justify="flex-end" gap="xs">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>
              Save
            </Button>
          </Group>
        </Drawer.Footer>
      </Drawer>

      <Button onClick={open}>Open Settings</Button>
    </>
  );
}
```

### Pattern 2: Navigation Drawer

```tsx
import { Drawer, Button, Stack, NavLink, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconSettings, IconUser } from '@tabler/icons-react';

function NavigationDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} position="left">
        <Drawer.Header>
          <Drawer.Title>Navigation</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Stack gap={0}>
            <NavLink
              label="Home"
              icon={<IconHome size={16} />}
              onClick={close}
            />
            <NavLink
              label="Settings"
              icon={<IconSettings size={16} />}
              onClick={close}
            />
            <NavLink
              label="Profile"
              icon={<IconUser size={16} />}
              onClick={close}
            />
          </Stack>
        </Drawer.Body>
      </Drawer>

      <Button onClick={open}>Menu</Button>
    </>
  );
}
```

### Pattern 3: Filter Drawer

```tsx
import { Drawer, Button, Checkbox, Group, Stack, Slider, RangeSlider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

function FilterDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filters, setFilters] = useState({
    inStock: false,
    featured: false
  });

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Filters" position="right">
        <Drawer.Header>
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Stack gap="lg">
            <div>
              <h3>Price Range</h3>
              <RangeSlider
                value={priceRange}
                onChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
              />
            </div>

            <div>
              <h3>Options</h3>
              <Checkbox
                label="In Stock"
                checked={filters.inStock}
                onChange={(e) =>
                  setFilters({ ...filters, inStock: e.currentTarget.checked })
                }
              />
              <Checkbox
                label="Featured"
                checked={filters.featured}
                onChange={(e) =>
                  setFilters({ ...filters, featured: e.currentTarget.checked })
                }
              />
            </div>
          </Stack>
        </Drawer.Body>

        <Drawer.Footer>
          <Group justify="flex-end" gap="xs">
            <Button variant="outline" onClick={close}>
              Clear
            </Button>
            <Button onClick={close}>
              Apply Filters
            </Button>
          </Group>
        </Drawer.Footer>
      </Drawer>

      <Button onClick={open}>Open Filters</Button>
    </>
  );
}
```

## Placement Patterns

### Left Drawer (Default)

```tsx
<Drawer position="left" size="md" opened={opened} onClose={close}>
  {/* Slides from left edge */}
</Drawer>
```

**Use Cases**: Navigation menus, filters (on desktop), sidebar content

### Right Drawer

```tsx
<Drawer position="right" size="md" opened={opened} onClose={close}>
  {/* Slides from right edge */}
</Drawer>
```

**Use Cases**: Chat panels, detail views, search results, filter panels

### Top Drawer

```tsx
<Drawer position="top" size={200} opened={opened} onClose={close}>
  {/* Slides from top edge */}
</Drawer>
```

**Use Cases**: Search bar, notification center, preview panels

### Bottom Drawer

```tsx
<Drawer position="bottom" size={300} opened={opened} onClose={close}>
  {/* Slides from bottom edge */}
</Drawer>
```

**Use Cases**: Action sheets, mobile menus, upward-expanding forms

## Size Patterns

### Predefined Sizes

```tsx
// Width for left/right, height for top/bottom
<Drawer size="xs" opened={opened} onClose={close}>
  {/* Extra small - 256px for left/right */}
</Drawer>

<Drawer size="sm" opened={opened} onClose={close}>
  {/* Small - 320px for left/right */}
</Drawer>

<Drawer size="md" opened={opened} onClose={close}>
  {/* Medium - 384px for left/right (default) */}
</Drawer>

<Drawer size="lg" opened={opened} onClose={close}>
  {/* Large - 512px for left/right */}
</Drawer>

<Drawer size="xl" opened={opened} onClose={close}>
  {/* Extra large - 640px for left/right */}
</Drawer>

<Drawer size="full" opened={opened} onClose={close}>
  {/* Full viewport width/height */}
</Drawer>
```

### Custom Sizes

```tsx
// Pixel values
<Drawer size={300} opened={opened} onClose={close}>
  {/* 300px width/height */}
</Drawer>

// Percentage values
<Drawer size="50%" opened={opened} onClose={close}>
  {/* 50% of viewport */}
</Drawer>

// Calculated values
<Drawer size="calc(100% - 200px)" opened={opened} onClose={close}>
  {/* Responsive sizing */}
</Drawer>
```

### Responsive Sizing

```tsx
import { useMediaQuery } from '@mantine/hooks';

function ResponsiveDrawer() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      size={isMobile ? 'full' : 'lg'}
      position={isMobile ? 'bottom' : 'left'}
    >
      {/* Content adjusts for mobile */}
    </Drawer>
  );
}
```

## Content Patterns

### Header Pattern

```tsx
import { Drawer, Group, ActionIcon, Drawer } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

<Drawer opened={opened} onClose={close}>
  <Drawer.Header>
    <div style={{ flex: 1 }}>
      <Drawer.Title>Title</Drawer.Title>
    </div>
    <Drawer.CloseButton />
  </Drawer.Header>
</Drawer>
```

### Body Pattern with Scrolling Content

```tsx
<Drawer opened={opened} onClose={close}>
  <Drawer.Body>
    {/* Content automatically handles overflow with scroll */}
    {/* Use Stack or other layout components */}
  </Drawer.Body>
</Drawer>
```

### Footer Pattern

```tsx
<Drawer opened={opened} onClose={close}>
  <Drawer.Footer>
    <Group justify="flex-end" gap="xs">
      <Button variant="outline" onClick={close}>
        Cancel
      </Button>
      <Button onClick={close}>
        Submit
      </Button>
    </Group>
  </Drawer.Footer>
</Drawer>
```

### Three-Section Layout

```tsx
<Drawer opened={opened} onClose={close} title="Complete Form">
  <Drawer.Header>
    <Drawer.Title>Form Title</Drawer.Title>
    <Drawer.CloseButton />
  </Drawer.Header>

  <Drawer.Body>
    {/* Form fields go here */}
  </Drawer.Body>

  <Drawer.Footer>
    {/* Action buttons */}
  </Drawer.Footer>
</Drawer>
```

## State Patterns

### Controlled Drawer (Recommended)

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
        title="Controlled"
      >
        Content
      </Drawer>

      <Button onClick={() => setOpened(true)}>
        Open
      </Button>
    </>
  );
}
```

### Uncontrolled Drawer with useDisclosure Hook

```tsx
import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function UncontrolledDrawer() {
  const [opened, { open, close, toggle }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Uncontrolled">
        Content
      </Drawer>

      <Button onClick={open}>Open</Button>
      <Button onClick={toggle}>Toggle</Button>
    </>
  );
}
```

**useDisclosure Hook Returns:**
- `opened` - Boolean state
- `open()` - Opens drawer
- `close()` - Closes drawer
- `toggle()` - Toggles state

## Animation Patterns

### Default Transition

The drawer uses Transition component for animations by default with slide effect.

```tsx
<Drawer opened={opened} onClose={close}>
  {/* Uses default slide animation */}
</Drawer>
```

### Custom Transition Properties

```tsx
import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function CustomTransition() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      transitionProps={{
        transition: 'fade',
        duration: 300,
        timingFunction: 'linear'
      }}
    >
      Content with custom animation
    </Drawer>
  );
}
```

**Available Transitions:**
- `'fade'` - Opacity change only
- `'slide-right'` - Slide from left to right
- `'slide-left'` - Slide from right to left
- `'slide-down'` - Slide from top to bottom
- `'slide-up'` - Slide from bottom to top
- `'rotate'` - Rotation effect
- `'scale'` - Scale transform

### Callback After Animation Completes

```tsx
import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function DrawerWithCallback() {
  const [opened, { open, close }] = useDisclosure(false);

  const handleClose = () => {
    close();
    // Called after animation completes
    setTimeout(() => {
      console.log('Drawer closed and animation finished');
    }, 300); // Match transitionProps duration
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      transitionProps={{ duration: 300 }}
    >
      Content
    </Drawer>
  );
}
```

## Nested Drawers

### Multiple Drawers with Drawer.Stack

```tsx
import { Drawer, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function NestedDrawers() {
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);

  return (
    <Drawer.Stack>
      <Drawer opened={opened1} onClose={close1} title="First Drawer">
        <Drawer.Header>
          <Drawer.Title>First Drawer</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Button onClick={open2}>
            Open second drawer
          </Button>
        </Drawer.Body>
      </Drawer>

      <Drawer opened={opened2} onClose={close2} title="Second Drawer">
        <Drawer.Header>
          <Drawer.Title>Second Drawer</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          Nested drawer content
        </Drawer.Body>
      </Drawer>
    </Drawer.Stack>
  );
}
```

**Drawer.Stack automatically handles:**
- Z-index layering
- Focus management
- Escape key behavior (closes innermost first)
- Overlay stacking

### Simple Nested Without Stack

```tsx
function SimpleNested() {
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened1} onClose={close1}>
        <Button onClick={open2}>Open nested</Button>
      </Drawer>

      <Drawer opened={opened2} onClose={close2}>
        Nested content
      </Drawer>
    </>
  );
}
```

## Accessibility

### ARIA Attributes

The Drawer component automatically provides:

```tsx
<Drawer opened={opened} onClose={close} title="Accessible Drawer">
  {/* Automatically sets:
    - aria-label or aria-labelledby (from title prop)
    - role="dialog"
    - aria-modal="true"
    - aria-hidden (when closed)
  */}
</Drawer>
```

### Focus Management

```tsx
import { Drawer, Button, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRef } from 'react';

function AccessibleDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Form"
        trapFocus
        returnFocus
      >
        <Drawer.Body>
          <Stack>
            {/* First focusable element gets initial focus */}
            <TextInput
              ref={inputRef}
              label="Name"
              placeholder="Auto-focused"
            />
            <Button>Submit</Button>
          </Stack>
        </Drawer.Body>
      </Drawer>

      <Button onClick={open}>Open</Button>
    </>
  );
}
```

**Focus Behaviors:**
- `trapFocus={true}` - Prevents focus from leaving drawer
- `returnFocus={true}` - Returns focus to trigger element on close
- First focusable element receives focus automatically

### Keyboard Navigation

Drawer supports full keyboard accessibility:

| Key | Behavior |
|-----|----------|
| **Escape** | Closes drawer (if `closeOnEscape={true}`) |
| **Tab** | Navigate through focusable elements (trapped inside) |
| **Shift+Tab** | Navigate backwards through focusable elements |

### Title for Accessibility

```tsx
// Good - explicitly set title
<Drawer opened={opened} onClose={close} title="Settings">
  {/* aria-labelledby automatically set */}
</Drawer>

// Alternative - use Drawer.Title
<Drawer opened={opened} onClose={close}>
  <Drawer.Header>
    <Drawer.Title>Settings</Drawer.Title>
    {/* Sets aria-labelledby */}
  </Drawer.Header>
</Drawer>
```

## Overlay Patterns

### Custom Overlay Styling

```tsx
import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function CustomOverlay() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
        color: '#000'
      }}
    >
      Content
    </Drawer>
  );
}
```

**Available overlayProps:**
- `backgroundOpacity` - Overlay transparency (0-1)
- `blur` - Blur effect (in pixels)
- `color` - Overlay color (hex or color name)

### No Overlay (Transparent)

```tsx
<Drawer
  opened={opened}
  onClose={close}
  overlayProps={{ backgroundOpacity: 0 }}
  closeOnClickOutside={false}
>
  {/* No overlay background */}
</Drawer>
```

## Integration Patterns

### Form Integration

```tsx
import { Drawer, Button, TextInput, Textarea, Stack, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

function FormDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      message: (value) => (value.length > 0 ? null : 'Message is required')
    }
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log('Form submitted:', values);
    close();
  });

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Contact Form">
        <Drawer.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Name"
                placeholder="Your name"
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps('email')}
              />
              <Textarea
                label="Message"
                placeholder="Your message"
                {...form.getInputProps('message')}
              />
            </Stack>
          </form>
        </Drawer.Body>

        <Drawer.Footer>
          <Group justify="flex-end" gap="xs">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => form.onSubmit(form.values)}>
              Send
            </Button>
          </Group>
        </Drawer.Footer>
      </Drawer>

      <Button onClick={open}>Contact</Button>
    </>
  );
}
```

### API Integration Pattern

```tsx
import { Drawer, Button, Loader, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';

function DataDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (opened) {
      setLoading(true);
      fetch('/api/data')
        .then(res => res.json())
        .then(data => {
          setData(data);
          setLoading(false);
        });
    }
  }, [opened]);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Data">
        <Drawer.Body>
          {loading ? (
            <Loader />
          ) : (
            <Stack>
              <Text>{JSON.stringify(data, null, 2)}</Text>
            </Stack>
          )}
        </Drawer.Body>
      </Drawer>

      <Button onClick={open}>Load Data</Button>
    </>
  );
}
```

## Advanced Patterns

### Drawer with Offset

```tsx
<Drawer
  opened={opened}
  onClose={close}
  offset={16}
  radius="md"
>
  {/* Drawer positioned with 16px offset from screen edge */}
</Drawer>
```

### Dismissal Control

```tsx
<Drawer
  opened={opened}
  onClose={close}
  closeOnEscape={true}
  closeOnClickOutside={true}
  trapFocus={true}
  returnFocus={true}
>
  {/* Full control over dismissal and focus behavior */}
</Drawer>
```

### Portal Configuration

```tsx
<Drawer
  opened={opened}
  onClose={close}
  portalProps={{
    target: '#drawer-container'
  }}
  withinPortal={true}
>
  {/* Renders in specified portal instead of document.body */}
</Drawer>
```

### Keep Mounted Pattern

```tsx
<Drawer
  opened={opened}
  onClose={close}
  keepMounted={true}
>
  {/* Component stays in DOM even when closed, preserves state */}
</Drawer>
```

### Event Callbacks

```tsx
import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function DrawerWithCallbacks() {
  const [opened, { open, close }] = useDisclosure(false);

  const handleClose = () => {
    console.log('Closing drawer');
    close();
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        onMouseEnter={() => console.log('Mouse entered drawer')}
        onMouseLeave={() => console.log('Mouse left drawer')}
      >
        Content
      </Drawer>

      <Button onClick={() => {
        console.log('Opening drawer');
        open();
      }}>
        Open
      </Button>
    </>
  );
}
```

## Notable Features

### Flexible Positioning System
- 4 directional positions (left, right, top, bottom)
- Support for viewport edges, not locked to dimensions
- Automatic size calculation based on content and constraints
- Offset support for spacing from edges

### Comprehensive Size System
- 6 predefined sizes (xs, sm, md, lg, xl, full)
- Support for custom pixel, percentage, and calculated values
- Responsive sizing capability
- Overflow handling with automatic scrolling

### Focus Trap Management
- Automatic focus trapping (first focusable element)
- Escape key handling
- Return focus on close
- Prevents focus loss from drawer
- Full keyboard navigation support

### Animation Framework
- Multiple transition types (fade, slide-left, slide-right, rotate, scale)
- Customizable duration and timing functions
- Smooth animations coordinated with state changes
- Callback support for post-animation actions

### Accessibility Compliance
- Full ARIA implementation (aria-label, aria-modal, role="dialog")
- Keyboard navigation support
- Screen reader optimization
- Focus management following WAI-ARIA dialog patterns

### Nested Drawer Support
- Drawer.Stack for managing multiple drawers
- Automatic z-index management
- Proper focus handling across nested instances
- Escape key closes innermost drawer first

### Flexible Content Structure
- Drawer.Header for title and close button
- Drawer.Body for main content with automatic scrolling
- Drawer.Footer for action buttons
- Support for composed layouts

### Portal Integration
- Renders outside component tree by default
- Configurable portal target
- Avoids stacking context issues
- Supports custom portal configuration

### Overlay Customization
- Background opacity control
- Blur effect support
- Color customization
- Click outside dismissal

### Hook Integration
- useDisclosure for state management
- Provides open, close, toggle methods
- Works with any state management library
- Mantine hooks ecosystem integration

## Notes

- **Performance**: Drawer uses Portal by default to avoid stacking context issues. Set `withinPortal={false}` only if portal rendering causes problems.
- **Mobile Optimization**: Consider using `position="bottom"` and `size="full"` on mobile devices for better UX.
- **Scroll Behavior**: Drawer body automatically handles overflow. Long content scrolls while header/footer remain fixed.
- **Accessibility Best Practice**: Always provide a `title` prop or use `<Drawer.Title>` for proper ARIA labeling.
- **Nesting**: Use `Drawer.Stack` for multiple drawers to ensure proper z-index and focus management.
- **Form Validation**: Drawer works well with Mantine's form hooks for validation and submission handling.
- **Animation Duration**: Default animation is 200ms. Consider user preferences and device performance.
- **Focus Return**: `returnFocus={true}` ensures accessibility by returning focus to the trigger element after closing.
- **Overlay Click**: `closeOnClickOutside={true}` is user-friendly but can be disabled for critical operations.
- **Package**: @mantine/core (part of the Mantine UI library ecosystem)
- **Version**: Tested with Mantine v8.x (latest)
- **Hooks Dependency**: Requires @mantine/hooks for useDisclosure hook
- **Framework**: React-based component, full TypeScript support

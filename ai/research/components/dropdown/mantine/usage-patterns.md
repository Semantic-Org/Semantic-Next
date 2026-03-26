# Mantine Menu Component - Usage Patterns Report

## Component Overview

Mantine's **Menu** component is a flexible, accessible dropdown menu solution for React applications. Unlike other frameworks that name this component "Dropdown," Mantine uses the semantic term "Menu" to emphasize its primary purpose: providing dropdown menus, context menus, and navigation drawers while maintaining WCAG accessibility standards.

The Menu component serves as Mantine's dropdown equivalent, built on top of their Popover component. It provides a complete solution for creating interactive menus with support for keyboard navigation, proper ARIA attributes, and flexible positioning. The component follows WAI-ARIA menu patterns and handles focus management, keyboard controls, and screen reader compatibility automatically.

## Basic Usage

### Simple Menu Example

```tsx
import { Menu, Button } from '@mantine/core';

function Demo() {
  return (
    <Menu>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Messages</Menu.Item>
        <Menu.Item>Gallery</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```

The basic structure consists of three main components:
- **Menu** - The container component that manages state and behavior
- **Menu.Target** - The trigger element that opens/closes the menu
- **Menu.Dropdown** - The overlay container for menu items

### Menu with Icons and Sections

```tsx
import { Menu, Button, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconTrash } from '@tabler/icons-react';

function MenuWithSections() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          Settings
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={<Text size="xs" c="dimmed">⌘K</Text>}
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
        >
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```

## Props/API Reference

### Menu (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opened` | `boolean` | `undefined` | Controlled open state |
| `defaultOpened` | `boolean` | `false` | Uncontrolled initial open state |
| `onChange` | `(opened: boolean) => void` | `undefined` | Callback when open state changes |
| `onOpen` | `() => void` | `undefined` | Callback when menu opens |
| `onClose` | `() => void` | `undefined` | Callback when menu closes |
| `trigger` | `'click' \| 'hover' \| 'click-hover'` | `'click'` | How the menu is triggered |
| `openDelay` | `number` | `0` | Open delay in ms (hover trigger) |
| `closeDelay` | `number` | `100` | Close delay in ms (hover trigger) |
| `closeOnItemClick` | `boolean` | `true` | Close menu when item is clicked |
| `closeOnEscape` | `boolean` | `true` | Close menu on Escape key |
| `trapFocus` | `boolean` | Auto | Trap focus within menu when open |
| `loop` | `boolean` | `true` | Loop keyboard navigation |
| `withinPortal` | `boolean` | `false` | Render dropdown in portal |
| `position` | `PopoverPosition` | `'bottom'` | Dropdown position relative to target |
| `offset` | `number \| OffsetOptions` | `5` | Dropdown offset from target |
| `width` | `number \| string` | `'target'` | Dropdown width |
| `shadow` | `MantineSize` | `'md'` | Dropdown shadow size |
| `radius` | `MantineSize \| number` | theme default | Border radius |
| `menuItemTabIndex` | `number` | `-1` | Tab index for menu items |

### Menu.Target

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactElement` | Single child element (required) |
| `refProp` | `string` | Ref prop name for custom components |

**Important:** Menu.Target requires a single child element. Strings, fragments, numbers, and multiple elements are not supported. Custom components must accept a ref prop.

### Menu.Dropdown

Inherits from Popover.Dropdown. Can be styled with system props (className, padding props, etc.).

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Menu items, labels, and dividers |

### Menu.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `ElementType` | `'button'` | Root element or component |
| `leftSection` | `ReactNode` | `undefined` | Content before label (icons) |
| `rightSection` | `ReactNode` | `undefined` | Content after label (shortcuts) |
| `color` | `MantineColor` | `undefined` | Item color (e.g., 'red' for danger) |
| `disabled` | `boolean` | `false` | Disable the item |
| `closeMenuOnClick` | `boolean` | `true` | Override closeOnItemClick for this item |
| `onClick` | `(event: React.MouseEvent) => void` | `undefined` | Click handler |

### Menu.Label

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Label text |

Used to create section headers within menus.

### Menu.Divider

Visual separator between menu sections. No props beyond standard HTML attributes.

## Variants & Patterns

### 1. Trigger Modes

#### Click Trigger (Default)

```tsx
<Menu trigger="click">
  <Menu.Target>
    <Button>Click to open</Button>
  </Menu.Target>
  <Menu.Dropdown>
    <Menu.Item>Option 1</Menu.Item>
  </Menu.Dropdown>
</Menu>
```

**Accessibility:** Fully accessible when using button elements. Supports Space and Enter key presses.

#### Hover Trigger

```tsx
<Menu trigger="hover" openDelay={100}>
  <Menu.Target>
    <Button>Hover to open</Button>
  </Menu.Target>
  <Menu.Dropdown>
    <Menu.Item>Option 1</Menu.Item>
  </Menu.Dropdown>
</Menu>
```

**Warning:** Not accessible via keyboard. Use with caution.

#### Click-Hover Trigger (Recommended for dual behavior)

```tsx
<Menu trigger="click-hover">
  <Menu.Target>
    <Button>Click or hover</Button>
  </Menu.Target>
  <Menu.Dropdown>
    <Menu.Item>Option 1</Menu.Item>
  </Menu.Dropdown>
</Menu>
```

**Best Practice:** Reveals on hover on desktop, click on mobile. Maintains accessibility.

### 2. Positioning

```tsx
// Position relative to target
<Menu position="top-start">
  {/* Menu content */}
</Menu>

<Menu position="right-start" offset={10}>
  {/* Menu content */}
</Menu>

<Menu position="bottom-end">
  {/* Menu content */}
</Menu>
```

Available positions:
- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`

### 3. Menu Items with Icons and Sections

```tsx
<Menu>
  <Menu.Target>
    <Button>Actions</Button>
  </Menu.Target>

  <Menu.Dropdown>
    <Menu.Label>Application</Menu.Label>
    <Menu.Item leftSection={<IconSettings size={14} />}>
      Settings
    </Menu.Item>
    <Menu.Item
      leftSection={<IconMessage size={14} />}
      rightSection={<Badge>3</Badge>}
    >
      Messages
    </Menu.Item>

    <Menu.Divider />

    <Menu.Label>Danger zone</Menu.Label>
    <Menu.Item
      color="red"
      leftSection={<IconTrash size={14} />}
    >
      Delete
    </Menu.Item>
  </Menu.Dropdown>
</Menu>
```

### 4. Disabled Items

```tsx
<Menu.Dropdown>
  <Menu.Item>Active item</Menu.Item>
  <Menu.Item disabled>Disabled item</Menu.Item>
  <Menu.Item>Another active item</Menu.Item>
</Menu.Dropdown>
```

### 5. Controlled vs Uncontrolled

#### Uncontrolled (Default)

```tsx
function UncontrolledMenu() {
  return (
    <Menu defaultOpened={false}>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Settings</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```

The Menu manages its own state internally.

#### Controlled

```tsx
function ControlledMenu() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Menu
        opened={opened}
        onChange={setOpened}
        onClose={() => console.log('Menu closed')}
      >
        <Menu.Target>
          <Button>Controlled menu</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => console.log('Profile')}>
            Profile
          </Menu.Item>
          <Menu.Item onClick={() => setOpened(false)}>
            Close manually
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Button onClick={() => setOpened(true)}>
        Open menu externally
      </Button>
    </>
  );
}
```

Use controlled mode for:
- External state synchronization
- Custom open/close logic
- Analytics tracking
- Coordinating with other UI elements

### 6. Nested Menus (Submenus)

```tsx
function NestedMenu() {
  return (
    <Menu position="right-start" trigger="click-hover">
      <Menu.Target>
        <Button>Actions</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Primary Action</Menu.Item>
        <Menu.Item>Secondary Action</Menu.Item>

        <Menu.Divider />

        {/* Nested submenu */}
        <Menu position="right-start" offset={10} withinPortal={false}>
          <Menu.Target>
            <Menu.Item rightSection={<IconChevronRight size={14} />}>
              Advanced Options
            </Menu.Item>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>Configuration</Menu.Item>
            <Menu.Item>Debug Tools</Menu.Item>
            <Menu.Item>Experimental</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Menu.Dropdown>
    </Menu>
  );
}
```

**Important for nested menus:**
- Set `withinPortal={false}` on nested Menu components
- Use `offset` to prevent visual overlap
- Position typically `right-start` or `left-start`

### 7. Custom Menu Item Components

```tsx
function CustomMenuItem() {
  return (
    <Menu>
      <Menu.Target>
        <Button>Custom items</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {/* Custom component as menu item */}
        <Menu.Item component="a" href="https://example.com">
          External Link
        </Menu.Item>

        {/* React Router Link */}
        <Menu.Item component={Link} to="/profile">
          Profile
        </Menu.Item>

        {/* Custom wrapper */}
        <Menu.Item component="div">
          <div style={{ display: 'flex', gap: '8px' }}>
            <Avatar size="sm" />
            <div>
              <Text size="sm">John Doe</Text>
              <Text size="xs" c="dimmed">john@example.com</Text>
            </div>
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```

**Note:** Custom components must forward refs and spread props to their root element.

### 8. Menu Without Portal

```tsx
<Menu withinPortal={false}>
  <Menu.Target>
    <Button>In-place menu</Button>
  </Menu.Target>
  <Menu.Dropdown>
    <Menu.Item>Option 1</Menu.Item>
  </Menu.Dropdown>
</Menu>
```

By default, `withinPortal` is `false`. Set to `true` to render in a React Portal (useful for avoiding overflow/z-index issues).

## Composition Patterns

### Standard Composition

```
<Menu>                      // Root container
  <Menu.Target>             // Trigger wrapper
    <Button />              // Actual trigger element
  </Menu.Target>

  <Menu.Dropdown>           // Dropdown container
    <Menu.Label />          // Section header
    <Menu.Item />           // Interactive item
    <Menu.Divider />        // Visual separator
  </Menu.Dropdown>
</Menu>
```

### Navigation Menu Pattern

```tsx
function NavigationMenu() {
  return (
    <Menu
      loop={false}
      withinPortal={false}
      trapFocus={false}
      menuItemTabIndex={0}
    >
      <Menu.Target>
        <Button>Navigation</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item component={Link} to="/home">
          Home
        </Menu.Item>
        <Menu.Item component={Link} to="/about">
          About
        </Menu.Item>
        <Menu.Item component={Link} to="/contact">
          Contact
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```

**Configuration for navigation:**
- `loop={false}` - Don't cycle navigation
- `withinPortal={false}` - Keep in document flow
- `trapFocus={false}` - Allow tabbing out
- `menuItemTabIndex={0}` - Make items tabbable

### Context Menu Pattern

```tsx
function useContextMenu() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opened, setOpened] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setOpened(true);
  };

  return {
    opened,
    position,
    onContextMenu: handleContextMenu,
    close: () => setOpened(false),
  };
}

function ContextMenuExample() {
  const menu = useContextMenu();

  return (
    <>
      <div onContextMenu={menu.onContextMenu}>
        Right-click me
      </div>

      <Menu opened={menu.opened} onChange={menu.close}>
        {/* Position menu at cursor */}
        <Menu.Dropdown style={{
          position: 'fixed',
          top: menu.position.y,
          left: menu.position.x
        }}>
          <Menu.Item>Copy</Menu.Item>
          <Menu.Item>Paste</Menu.Item>
          <Menu.Item>Delete</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
```

**Note:** For production context menus, consider using the `mantine-contextmenu` package which provides a complete solution.

## Styling & Theming

### 1. Styles API

Mantine Menu supports the Styles API for customizing inner elements:

```tsx
import classes from './Demo.module.css';

function StyledMenu() {
  return (
    <Menu
      classNames={{
        dropdown: classes.dropdown,
        item: classes.item,
        itemLabel: classes.itemLabel,
        itemSection: classes.itemSection,
        divider: classes.divider,
        label: classes.label,
      }}
    >
      {/* Menu content */}
    </Menu>
  );
}
```

**Available style targets:**
- `dropdown` - Overlay element
- `item` - Menu.Item root element
- `itemLabel` - Label of Menu.Item
- `itemSection` - Left and right sections of Menu.Item
- `divider` - Menu.Divider root element
- `label` - Menu.Label root element
- `chevron` - Submenu chevron icon

### 2. CSS Modules Integration

```css
/* Demo.module.css */
.dropdown {
  background-color: var(--mantine-color-dark-6);
  border: 1px solid var(--mantine-color-dark-4);
}

.item {
  color: var(--mantine-color-gray-0);
}

.item:hover {
  background-color: var(--mantine-color-dark-5);
}

.label {
  color: var(--mantine-color-dimmed);
  font-size: 0.75rem;
  text-transform: uppercase;
}
```

### 3. Inline Styles

```tsx
<Menu
  styles={{
    dropdown: {
      backgroundColor: '#1a1b1e',
      borderRadius: '8px',
    },
    item: {
      padding: '12px',
      '&:hover': {
        backgroundColor: '#25262b',
      },
    },
  }}
>
  {/* Menu content */}
</Menu>
```

**Note:** Inline styles have higher specificity and cannot be overridden without `!important`.

### 4. Theme Integration

```tsx
import { createTheme, MantineProvider, Menu } from '@mantine/core';

const theme = createTheme({
  components: {
    Menu: Menu.extend({
      defaultProps: {
        shadow: 'md',
        radius: 'md',
      },
      classNames: {
        dropdown: 'custom-menu-dropdown',
        item: 'custom-menu-item',
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* All menus will inherit these defaults */}
    </MantineProvider>
  );
}
```

### 5. CSS Variables

Mantine theme values are available as CSS variables:

```css
.custom-menu {
  --menu-bg: var(--mantine-color-gray-0);
  --menu-item-hover: var(--mantine-color-blue-light);

  background: var(--menu-bg);
  border-radius: var(--mantine-radius-md);
  box-shadow: var(--mantine-shadow-md);
}
```

## Accessibility

### ARIA Attributes

Menu automatically provides proper ARIA attributes:

- **Menu.Target**: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`
- **Menu.Dropdown**: `role="menu"`
- **Menu.Item**: `role="menuitem"`

### Keyboard Navigation

| Key | Action |
|-----|--------|
| **Space/Enter** | Open menu (on target) |
| **Escape** | Close menu |
| **Arrow Down** | Focus next item |
| **Arrow Up** | Focus previous item |
| **Home** | Focus first item |
| **End** | Focus last item |
| **Tab** | Close menu and move focus |

**Loop behavior:** When `loop={true}` (default), arrow keys cycle from last to first item and vice versa.

### Screen Reader Support

- Announces menu state (expanded/collapsed)
- Announces focused menu items
- Provides context about menu structure
- Announces item counts and positions

### Focus Management

**Default behavior (trigger="click"):**
- Focus trapped within menu when open
- Focus returns to trigger on close
- First item focused on open

**Navigation configuration:**
```tsx
<Menu
  loop={false}          // No cycling
  trapFocus={false}     // Allow tabbing out
  menuItemTabIndex={0}  // Make items tabbable
>
  {/* Navigation items */}
</Menu>
```

### Accessibility Best Practices

1. **Use button triggers:** Menu.Target should contain a `<button>` or Mantine `<Button>` for keyboard support
2. **Avoid hover-only:** `trigger="hover"` is not keyboard accessible
3. **Use click-hover for dual behavior:** `trigger="click-hover"` works on hover (desktop) and click (mobile/keyboard)
4. **Provide meaningful labels:** Use descriptive text for menu items
5. **Group related items:** Use Menu.Label and Menu.Divider for logical sections
6. **Indicate danger actions:** Use `color="red"` for destructive actions
7. **Add keyboard shortcuts:** Display shortcuts in `rightSection` for power users

### Accessibility Warning

**Not Accessible:**
```tsx
// ❌ Keyboard users cannot access this
<Menu trigger="hover">
  <Menu.Target>
    <div>Hover only</div>
  </Menu.Target>
  {/* ... */}
</Menu>
```

**Accessible:**
```tsx
// ✅ Works for keyboard and mouse
<Menu trigger="click">
  <Menu.Target>
    <Button>Accessible menu</Button>
  </Menu.Target>
  {/* ... */}
</Menu>

// ✅ Works for keyboard, mouse, and touch
<Menu trigger="click-hover">
  <Menu.Target>
    <Button>Dual-trigger menu</Button>
  </Menu.Target>
  {/* ... */}
</Menu>
```

## Best Practices

### When to Use Menu vs Other Components

**Use Menu when:**
- Creating dropdown menus with actions
- Building context menus
- Implementing command palettes
- Creating navigation dropdowns
- Showing lists of actions/options

**Use other components when:**
- **Select/MultiSelect:** Choosing from a list of values (form input)
- **Popover:** Displaying informational content or complex UI
- **Tooltip:** Showing brief help text on hover
- **Dropdown (deprecated):** Legacy code (migrate to Menu)

### Common Patterns

#### Action Menu

```tsx
<Menu>
  <Menu.Target>
    <ActionIcon>
      <IconDotsVertical />
    </ActionIcon>
  </Menu.Target>
  <Menu.Dropdown>
    <Menu.Item leftSection={<IconEdit />}>Edit</Menu.Item>
    <Menu.Item leftSection={<IconCopy />}>Duplicate</Menu.Item>
    <Menu.Divider />
    <Menu.Item color="red" leftSection={<IconTrash />}>
      Delete
    </Menu.Item>
  </Menu.Dropdown>
</Menu>
```

#### User Profile Menu

```tsx
<Menu width={200}>
  <Menu.Target>
    <UnstyledButton>
      <Group>
        <Avatar src={user.avatar} radius="xl" />
        <Text size="sm">{user.name}</Text>
        <IconChevronDown size={12} />
      </Group>
    </UnstyledButton>
  </Menu.Target>

  <Menu.Dropdown>
    <Menu.Item leftSection={<IconUser />}>Profile</Menu.Item>
    <Menu.Item leftSection={<IconSettings />}>Settings</Menu.Item>
    <Menu.Divider />
    <Menu.Item
      color="red"
      leftSection={<IconLogout />}
      onClick={handleLogout}
    >
      Logout
    </Menu.Item>
  </Menu.Dropdown>
</Menu>
```

#### Conditional Items

```tsx
<Menu.Dropdown>
  <Menu.Item>Always visible</Menu.Item>
  {user.isAdmin && (
    <Menu.Item leftSection={<IconShield />}>
      Admin Panel
    </Menu.Item>
  )}
  {!user.isPro && (
    <Menu.Item
      leftSection={<IconStar />}
      rightSection={<Badge>Pro</Badge>}
    >
      Upgrade
    </Menu.Item>
  )}
</Menu.Dropdown>
```

### Gotchas & Common Mistakes

1. **Multiple children in Target**
   ```tsx
   // ❌ Error: Menu.Target requires single child
   <Menu.Target>
     <Button>First</Button>
     <Button>Second</Button>
   </Menu.Target>

   // ✅ Wrap in a single element
   <Menu.Target>
     <Group>
       <Button>First</Button>
       <Button>Second</Button>
     </Group>
   </Menu.Target>
   ```

2. **Nested menus without withinPortal={false}**
   ```tsx
   // ❌ Clicking outside closes all menus
   <Menu>
     <Menu.Dropdown>
       <Menu>
         <Menu.Dropdown>Items</Menu.Dropdown>
       </Menu>
     </Menu.Dropdown>
   </Menu>

   // ✅ Disable portal for nested menus
   <Menu>
     <Menu.Dropdown>
       <Menu withinPortal={false}>
         <Menu.Dropdown>Items</Menu.Dropdown>
       </Menu>
     </Menu.Dropdown>
   </Menu>
   ```

3. **Custom components without ref forwarding**
   ```tsx
   // ❌ Won't work
   const CustomButton = ({ children }) => <button>{children}</button>;

   <Menu.Target>
     <CustomButton>Menu</CustomButton>
   </Menu.Target>

   // ✅ Forward ref
   const CustomButton = forwardRef(({ children, ...props }, ref) => (
     <button ref={ref} {...props}>{children}</button>
   ));
   ```

4. **Accessibility with hover trigger**
   ```tsx
   // ❌ Not keyboard accessible
   <Menu trigger="hover">

   // ✅ Use click-hover for best of both
   <Menu trigger="click-hover">
   ```

5. **Inline styles performance**
   ```tsx
   // ❌ Creates new object every render
   <Menu styles={{ item: { color: 'red' } }}>

   // ✅ Define outside component or use CSS modules
   const menuStyles = { item: { color: 'red' } };
   <Menu styles={menuStyles}>
   ```

## Comparison Notes

### Unique Mantine Approaches

1. **Composition over configuration:** Uses compound components (Menu.Target, Menu.Dropdown, Menu.Item) rather than prop-based configuration

2. **Built on Popover:** Menu is a specialized wrapper around the Popover component, inheriting positioning and portal logic

3. **Styles API:** Comprehensive styling system with classNames, styles props, and theme integration via CSS modules

4. **Trigger flexibility:** Supports click, hover, and click-hover triggers with mobile-aware behavior

5. **No string children in Target:** Requires React elements, not plain text or fragments

6. **Portal defaults:** `withinPortal={false}` by default (different from earlier versions)

7. **Focus management:** Automatically manages focus with `trapFocus` based on trigger type

8. **CSS Variables integration:** Full theme values exposed as CSS custom properties

9. **Component extension:** Theme system allows extending default props and classNames globally

10. **Nested menu support:** First-class support for submenus with proper portal handling

### Compared to Other Frameworks

**vs HTML `<details>/<summary>`:**
- Mantine Menu provides proper ARIA attributes and roles
- Better positioning control
- Keyboard navigation beyond native support
- Programmatic control

**vs Radix UI Menu:**
- Similar compound component approach
- Mantine includes built-in styling
- Radix is headless, Mantine is styled
- Both have excellent accessibility

**vs Material-UI Menu:**
- Mantine's Styles API is more flexible than MUI's sx prop
- Mantine uses CSS modules, MUI uses CSS-in-JS
- Both support controlled/uncontrolled modes
- MUI has more built-in variants

**vs Chakra UI Menu:**
- Similar component composition
- Both support theming
- Mantine requires single child in Target, Chakra allows render props
- Both have good TypeScript support

**vs Headless UI Menu:**
- Headless UI is unstyled, Mantine is styled
- Mantine provides more out-of-box features
- Both follow WAI-ARIA patterns
- Headless UI is framework-agnostic

## Summary

Mantine's Menu component is a production-ready dropdown menu solution that prioritizes accessibility, flexibility, and developer experience. Key strengths include:

- **Accessibility-first design** with proper ARIA attributes and keyboard navigation
- **Flexible composition** via compound components (Menu, Menu.Target, Menu.Dropdown, Menu.Item, Menu.Label, Menu.Divider)
- **Powerful styling system** supporting CSS modules, inline styles, and theme integration
- **Multiple trigger modes** (click, hover, click-hover) with mobile-aware behavior
- **Controlled and uncontrolled** modes for different use cases
- **Nested menu support** with proper portal handling
- **Rich customization** via Styles API and theme system

The component serves as Mantine's "dropdown" equivalent, emphasizing its semantic purpose as a menu system while providing the familiar dropdown interaction pattern. It's built on solid foundations (Popover component), follows web standards (WAI-ARIA), and integrates seamlessly with Mantine's design system.

# Chakra UI - Menu Usage Patterns

> **Component Name Clarification**: Chakra UI calls this component "Menu" rather than "Dropdown". The Menu component serves as Chakra's dropdown/menu implementation, providing an accessible dropdown interface for navigation and actions.

## Component URL
- **v3**: https://www.chakra-ui.com/docs/components/menu
- **v2**: https://v2.chakra-ui.com/docs/components/menu

Status: ✅ Working
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Chakra UI provides detailed documentation with code examples, accessibility information, and theming guidance for both v2 and v3.

---

## 1. Component Overview

The **Menu component** in Chakra UI is an accessible dropdown menu implementation for presenting a list of actions or options. It follows WAI-ARIA design patterns for menus and provides built-in keyboard navigation, focus management, and screen reader support.

**Key Characteristics**:
- Composable architecture with multiple sub-components
- Built-in accessibility (ARIA roles, keyboard navigation)
- Flexible positioning system
- Support for nested menus
- Rich content options (icons, shortcuts, groups, dividers)

---

## 2. Version Comparison (v2 vs v3)

### Major Architectural Changes

#### **v2 Component Structure** (Simpler, flat API)
```jsx
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuGroup } from '@chakra-ui/react';

<Menu>
  <MenuButton>Actions</MenuButton>
  <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <MenuDivider />
    <MenuItem>Delete</MenuItem>
  </MenuList>
</Menu>
```

#### **v3 Component Structure** (Compound pattern, more explicit)
```jsx
import { Menu, Portal } from '@chakra-ui/react';

<Menu.Root>
  <Menu.Trigger asChild>
    <Button>Actions</Button>
  </Menu.Trigger>
  <Portal>
    <Menu.Positioner>
      <Menu.Content>
        <Menu.Item value="download">Download</Menu.Item>
        <Menu.Item value="copy">Create a Copy</Menu.Item>
        <Menu.Separator />
        <Menu.Item value="delete">Delete</Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Portal>
</Menu.Root>
```

### Breaking Changes Summary

| Feature | v2 | v3 | Migration Impact |
|---------|----|----|------------------|
| **Component naming** | `<Menu>`, `<MenuButton>`, `<MenuList>`, `<MenuItem>` | `<Menu.Root>`, `<Menu.Trigger>`, `<Menu.Content>`, `<Menu.Item>` | HIGH - Requires renaming all components |
| **Positioning** | Implicit with Popper.js | Explicit `<Menu.Positioner>` component | MEDIUM - Must add Positioner wrapper |
| **Portal** | `<Portal>` available but not always required | Often needed for proper z-index layering | MEDIUM - May need to add Portal |
| **Lazy mounting** | `isLazy` prop | `lazyMount` + `unmountOnExit` props (default: true since v3.6.0) | LOW - Better defaults in v3 |
| **Disabled prop** | `isDisabled` | `disabled` | LOW - Simple prop rename |
| **Item identification** | No required identifier | `value` prop required on `<Menu.Item>` | MEDIUM - Must add value to all items |
| **Dividers** | `<MenuDivider />` | `<Menu.Separator />` | LOW - Component rename |
| **Groups** | `<MenuGroup>` | Component structure unclear in v3 | MEDIUM - Check migration docs |
| **Option groups** | `<MenuOptionGroup>`, `<MenuItemOption>` | `<Menu.RadioItemGroup>`, `<Menu.RadioItem>`, `<Menu.CheckboxItemGroup>`, `<Menu.CheckboxItem>` | MEDIUM - More explicit naming |
| **Internal state access** | Render prop pattern: `{({ isOpen }) => ...}` | `<Menu.Context>` | MEDIUM - Different API |
| **Theming API** | `useMultiStyleConfig` hook | Component-based theming (exact API unclear) | HIGH - May require significant theme refactoring |
| **Underlying library** | Custom implementation with Popper.js | Built on Ark UI state machine | HIGH - Different internal architecture |

### New Features in v3

1. **Explicit Positioner**: `<Menu.Positioner>` gives more control over positioning logic
2. **Better Performance**: `lazyMount` and `unmountOnExit` enabled by default (as of v3.6.0)
3. **Clearer Component Hierarchy**: Compound pattern makes parent-child relationships explicit
4. **Value-based Items**: Required `value` prop enables better programmatic control
5. **Navigate Prop**: Custom router integration via `navigate` callback on Menu.Root

### Known Migration Issues

1. **Z-index with Modals/Drawers**: Menus inside Drawers don't work by default because Menu uses `zIndex.dropdown` while Drawer uses `zIndex.modal`. Workaround: Use Portal with explicit target.
2. **No Codemods**: Manual migration required - no automated tooling available
3. **Documentation Gaps**: Some features not fully documented in initial v3 release
4. **Complex Migration**: Many teams have postponed migration due to extensive breaking changes

---

## 3. Basic Usage

### v2 Basic Example
```jsx
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

<Menu>
  <MenuButton as={Button}>
    Actions
  </MenuButton>
  <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <MenuItem>Mark as Draft</MenuItem>
    <MenuItem>Delete</MenuItem>
    <MenuItem>Attend a Workshop</MenuItem>
  </MenuList>
</Menu>
```

### v3 Basic Example
```jsx
import { Button, Menu, Portal } from '@chakra-ui/react';

<Menu.Root>
  <Menu.Trigger asChild>
    <Button variant="outline" size="sm">
      Open Menu
    </Button>
  </Menu.Trigger>
  <Portal>
    <Menu.Positioner>
      <Menu.Content>
        <Menu.Item value="new-txt">New Text File</Menu.Item>
        <Menu.Item value="new-file">New File...</Menu.Item>
        <Menu.Item value="new-win">New Window</Menu.Item>
        <Menu.Item value="open">Open...</Menu.Item>
        <Menu.Item value="export">Export</Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Portal>
</Menu.Root>
```

---

## 4. Props/API Reference

### v2 Props

#### Menu (Container)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controlled open state |
| `defaultIsOpen` | `boolean` | `false` | Uncontrolled default open state |
| `onOpen` | `() => void` | - | Callback when menu opens |
| `onClose` | `() => void` | - | Callback when menu closes |
| `closeOnSelect` | `boolean` | `true` | Close menu when item is selected |
| `closeOnBlur` | `boolean` | `true` | Close menu when focus leaves |
| `isLazy` | `boolean` | `false` | Lazy mount menu content |
| `placement` | `PopperJS.Placement` | `'bottom-start'` | Menu position relative to button |
| `gutter` | `number` | - | Distance between button and menu |
| `offset` | `[number, number]` | - | Offset for positioning (overrides gutter) |
| `flip` | `boolean` | `true` | Auto-flip menu when overflowing |
| `autoSelect` | `boolean` | `true` | Auto-select first enabled item on open |
| `computePositionOnMount` | `boolean` | `false` | Calculate position on mount |

#### MenuButton
- Composes `Box` - accepts all Box props
- Requires `ref` if using custom component
- Automatically receives: `aria-haspopup`, `aria-expanded`, `aria-controls`

#### MenuList
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rootProps` | `BoxProps` | - | Props for the motion.div wrapper |
- Composes `Box` - accepts all Box props

#### MenuItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDisabled` | `boolean` | `false` | Disable menu item |
| `isFocusable` | `boolean` | `false` | Whether disabled item is focusable |
| `closeOnSelect` | `boolean` | `true` | Override parent closeOnSelect |
| `icon` | `ReactElement` | - | Icon element before label |
| `iconSpacing` | `SpaceProps` | - | Spacing between icon and label |
| `command` | `string` | - | Right-aligned shortcut/command text |
| `commandSpacing` | `SpaceProps` | - | Spacing between label and command |
- Composes `Box` - accepts all Box props

#### MenuGroup
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Group title/label |
- Composes `Box` - accepts all Box props

#### MenuDivider
- Composes `Box` - accepts all Box props
- Visual separator for menu items and groups

#### MenuOptionGroup
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'radio' \| 'checkbox'` | - | Type of option group |
| `title` | `string` | - | Group title/label |
| `value` | `string \| string[]` | - | Selected value(s) |
| `defaultValue` | `string \| string[]` | - | Default selected value(s) |
| `onChange` | `(value) => void` | - | Callback when selection changes |

#### MenuItemOption
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Option value |
| `isChecked` | `boolean` | - | Controlled checked state |
| `type` | `'radio' \| 'checkbox'` | - | Type (inherited from group) |
- Inherits all MenuItem props

### v3 Props

#### Menu.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lazyMount` | `boolean` | `true` (since v3.6.0) | Defer mounting until menu opens |
| `unmountOnExit` | `boolean` | `true` (since v3.6.0) | Unmount menu when closed |
| `positioning` | `object` | - | Positioning configuration |
| `positioning.placement` | `Placement` | `'bottom-start'` | Menu position |
| `positioning.gutter` | `number` | - | Distance from trigger |
| `positioning.strategy` | `'absolute' \| 'fixed'` | `'absolute'` | CSS positioning strategy |
| `positioning.hideWhenDetached` | `boolean` | `false` | Hide when trigger is scrolled out of view |
| `navigate` | `({ value, node }) => void` | - | Custom navigation handler for router integration |
| Additional props from Ark UI | - | - | See Ark UI Menu documentation |

#### Menu.Trigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | - | Render as child element (polymorphic) |

#### Menu.Positioner
- Handles positioning logic
- Minimal props exposed

#### Menu.Content
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| Standard style props | - | - | Accepts Chakra style props (minW, etc.) |

#### Menu.Item
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Unique identifier for item |
| `disabled` | `boolean` | `false` | Disable menu item |
| `onSelect` | `() => void` | - | Callback when item selected |
| `asChild` | `boolean` | - | Render as child element (for links, etc.) |

#### Menu.Separator
- Simple visual divider
- No specific props (accepts style props)

#### Menu.RadioItemGroup / Menu.CheckboxItemGroup
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| string[]` | - | Selected value(s) |
| `onChange` | `(value) => void` | - | Selection change callback |

#### Menu.RadioItem / Menu.CheckboxItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **Required** | Option value |
| `disabled` | `boolean` | `false` | Disable option |

#### Menu.Context
- Provides access to internal menu state
- Replaces v2 render prop pattern

**Note**: v3 is built on Ark UI - consult [Ark UI Menu docs](https://ark-ui.com/docs/components/menu) for complete prop reference.

---

## 5. Variants & Patterns

### Trigger Types

#### v2: Button Trigger
```jsx
<Menu>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    Actions
  </MenuButton>
  <MenuList>...</MenuList>
</Menu>
```

#### v2: Custom Trigger
```jsx
<Menu>
  <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="outline" aria-label="Options" />
  <MenuList>...</MenuList>
</Menu>
```

#### v3: Button Trigger
```jsx
<Menu.Root>
  <Menu.Trigger asChild>
    <Button variant="outline">Open Menu</Button>
  </Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>
```

#### v3: Custom Trigger with asChild
```jsx
<Menu.Root>
  <Menu.Trigger asChild>
    <IconButton icon={<HamburgerIcon />} aria-label="Menu" />
  </Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>
```

### Placement/Positioning

#### v2: Placement Options
```jsx
<Menu placement="top-start">
  {/* Supports: bottom, top, left, right, auto */}
  {/* With variants: -start, -end */}
  {/* Full list: bottom-start, bottom-end, top-start, top-end, */}
  {/*            left-start, left-end, right-start, right-end */}
  {/*            auto, auto-start, auto-end */}
</Menu>
```

#### v2: Gutter and Offset
```jsx
<Menu gutter={12}>
  {/* Distance between button and menu */}
</Menu>

<Menu offset={[0, 20]}>
  {/* Manual offset - overrides gutter */}
</Menu>
```

#### v3: Positioning Object
```jsx
<Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
  {/* More explicit positioning API */}
</Menu.Root>
```

#### v3: Fixed Positioning (for Dialogs)
```jsx
<Menu.Root positioning={{ strategy: "fixed", hideWhenDetached: true }}>
  {/* Better for menus inside modals/drawers */}
</Menu.Root>
```

### Menu Items, Groups, Dividers

#### v2: Basic Structure
```jsx
<Menu>
  <MenuButton>File</MenuButton>
  <MenuList>
    <MenuItem command="Ctrl + N">New File</MenuItem>
    <MenuItem command="Ctrl + O">Open File</MenuItem>
    <MenuDivider />
    <MenuGroup title="Save">
      <MenuItem command="Ctrl + S">Save</MenuItem>
      <MenuItem command="Ctrl + Shift + S">Save As...</MenuItem>
      <MenuItem command="Ctrl + Alt + S">Save All</MenuItem>
    </MenuGroup>
    <MenuDivider />
    <MenuItem>Exit</MenuItem>
  </MenuList>
</Menu>
```

#### v3: Equivalent Structure
```jsx
<Menu.Root>
  <Menu.Trigger asChild><Button>File</Button></Menu.Trigger>
  <Menu.Content>
    <Menu.Item value="new">New File</Menu.Item>
    <Menu.Item value="open">Open File</Menu.Item>
    <Menu.Separator />
    {/* Group equivalent - structure TBD in v3 */}
    <Menu.Item value="save">Save</Menu.Item>
    <Menu.Item value="save-as">Save As...</Menu.Item>
    <Menu.Item value="save-all">Save All</Menu.Item>
    <Menu.Separator />
    <Menu.Item value="exit">Exit</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

### Nested Menus

#### v2: Nested Menu Pattern
```jsx
{/* Implementation details found in CodeSandbox examples */}
{/* Requires custom state management in v2 */}
```

#### v3: Nested Menu with TriggerItem
```jsx
<Menu.Root>
  <Menu.Trigger asChild><Button>Main Menu</Button></Menu.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item value="item1">Item 1</Menu.Item>
      <Menu.TriggerItem>
        <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
          <Menu.TriggerItem>Submenu</Menu.TriggerItem>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="sub1">Submenu Item 1</Menu.Item>
              <Menu.Item value="sub2">Submenu Item 2</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Menu.TriggerItem>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>
```

### Icons and Shortcuts

#### v2: Icons and Commands
```jsx
<MenuItem icon={<AddIcon />} command="⌘N">
  New File
</MenuItem>

<MenuItem icon={<EditIcon />} command="⌘E">
  Edit File
</MenuItem>

{/* IconSpacing and commandSpacing props available */}
<MenuItem icon={<DeleteIcon />} iconSpacing={4} command="⌘D" commandSpacing={8}>
  Delete
</MenuItem>
```

#### v3: Icons Pattern
```jsx
{/* Icon support via composition - exact pattern TBD */}
<Menu.Item value="new">
  <AddIcon /> New File
</Menu.Item>
```

### Disabled/Destructive Items

#### v2: Disabled and States
```jsx
<MenuItem isDisabled>
  Disabled Item
</MenuItem>

{/* Destructive styling via props */}
<MenuItem color="red.500">
  Delete Account
</MenuItem>

{/* Access internal state with render prop */}
<Menu>
  {({ isOpen }) => (
    <>
      <MenuButton isActive={isOpen}>
        {isOpen ? 'Close' : 'Open'}
      </MenuButton>
      <MenuList>...</MenuList>
    </>
  )}
</Menu>
```

#### v3: Disabled Items
```jsx
<Menu.Item value="disabled" disabled>
  Disabled Item
</Menu.Item>

{/* Destructive styling via style props */}
<Menu.Item value="delete" color="red.500">
  Delete Account
</Menu.Item>

{/* Access state via Context */}
<Menu.Root>
  <Menu.Context>
    {(context) => (
      <>
        <Menu.Trigger>
          {context.isOpen ? 'Close' : 'Open'}
        </Menu.Trigger>
        <Menu.Content>...</Menu.Content>
      </>
    )}
  </Menu.Context>
</Menu.Root>
```

### Custom Content

#### v2: Custom MenuItem Content
```jsx
<MenuItem>
  <Avatar size="sm" name="Dan Abrahmov" src="..." mr={2} />
  <span>Dan Abrahmov</span>
</MenuItem>

<MenuItem>
  <Box>
    <Text fontWeight="bold">Custom Action</Text>
    <Text fontSize="sm" color="gray.500">With description</Text>
  </Box>
</MenuItem>
```

#### v3: Custom Content via Composition
```jsx
<Menu.Item value="user" asChild>
  <Flex align="center">
    <Avatar size="sm" name="Dan Abrahmov" />
    <span>Dan Abrahmov</span>
  </Flex>
</Menu.Item>
```

### Option Groups (Radio/Checkbox)

#### v2: MenuOptionGroup
```jsx
<Menu closeOnSelect={false}>
  <MenuButton>Options</MenuButton>
  <MenuList>
    <MenuOptionGroup defaultValue="asc" title="Order" type="radio">
      <MenuItemOption value="asc">Ascending</MenuItemOption>
      <MenuItemOption value="desc">Descending</MenuItemOption>
    </MenuOptionGroup>
    <MenuDivider />
    <MenuOptionGroup title="Filters" type="checkbox">
      <MenuItemOption value="email">Email</MenuItemOption>
      <MenuItemOption value="phone">Phone</MenuItemOption>
      <MenuItemOption value="country">Country</MenuItemOption>
    </MenuOptionGroup>
  </MenuList>
</Menu>
```

#### v3: Radio and Checkbox Groups
```jsx
<Menu.Root>
  <Menu.Trigger asChild><Button>Options</Button></Menu.Trigger>
  <Menu.Content>
    <Menu.RadioItemGroup value={value} onChange={setValue}>
      <Menu.RadioItem value="asc">Ascending</Menu.RadioItem>
      <Menu.RadioItem value="desc">Descending</Menu.RadioItem>
    </Menu.RadioItemGroup>
    <Menu.Separator />
    <Menu.CheckboxItemGroup value={filters} onChange={setFilters}>
      <Menu.CheckboxItem value="email">Email</Menu.CheckboxItem>
      <Menu.CheckboxItem value="phone">Phone</Menu.CheckboxItem>
      <Menu.CheckboxItem value="country">Country</Menu.CheckboxItem>
    </Menu.CheckboxItemGroup>
  </Menu.Content>
</Menu.Root>
```

---

## 6. Composition Patterns

### v2 Component Hierarchy

```
Menu (container)
├── MenuButton (trigger)
└── MenuList (content container)
    ├── MenuItem (action item)
    ├── MenuDivider (separator)
    ├── MenuGroup (labeled group)
    │   └── MenuItem(s)
    └── MenuOptionGroup (checkable group)
        └── MenuItemOption(s)
```

### v3 Component Hierarchy

```
Menu.Root (container)
├── Menu.Trigger (trigger, polymorphic via asChild)
└── Portal (optional but recommended)
    └── Menu.Positioner (positioning wrapper)
        └── Menu.Content (content container)
            ├── Menu.Item (action item, requires value)
            ├── Menu.Separator (divider)
            ├── Menu.TriggerItem (nested menu trigger)
            ├── Menu.RadioItemGroup (radio group)
            │   └── Menu.RadioItem(s)
            └── Menu.CheckboxItemGroup (checkbox group)
                └── Menu.CheckboxItem(s)
```

### Composition Principles

**v2**: Flatter, simpler structure. Components are direct imports.

**v3**: Compound pattern with namespace. More explicit relationships. Requires `value` prop for items.

---

## 7. Styling & Theming

### v2 Theming System

#### Multipart Component Structure

Menu is a **multipart component** with these parts:
- `button` - MenuButton
- `list` - MenuList
- `item` - MenuItem
- `groupTitle` - MenuGroup title
- `command` - Command/shortcut text
- `divider` - MenuDivider

#### Using useMultiStyleConfig

```jsx
import { useMultiStyleConfig } from '@chakra-ui/react';

function CustomMenu(props) {
  const styles = useMultiStyleConfig('Menu', props);
  return (
    <Menu>
      <MenuButton sx={styles.button}>...</MenuButton>
      <MenuList sx={styles.list}>
        <MenuItem sx={styles.item}>...</MenuItem>
      </MenuList>
    </Menu>
  );
}
```

#### Theme Customization

```jsx
// theme.js
export const MenuTheme = {
  baseStyle: {
    list: {
      bg: 'white',
      borderRadius: 'md',
      boxShadow: 'lg',
      py: 2,
    },
    item: {
      py: 2,
      px: 4,
      _hover: {
        bg: 'gray.100',
      },
      _focus: {
        bg: 'gray.100',
      },
    },
    groupTitle: {
      fontSize: 'xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      color: 'gray.500',
      px: 4,
      py: 2,
    },
    command: {
      opacity: 0.6,
      fontSize: 'sm',
    },
    divider: {
      my: 2,
    },
  },
  sizes: {
    sm: {
      item: { fontSize: 'sm', py: 1, px: 3 },
    },
    md: {
      item: { fontSize: 'md', py: 2, px: 4 },
    },
    lg: {
      item: { fontSize: 'lg', py: 3, px: 5 },
    },
  },
  variants: {
    primary: {
      list: { borderColor: 'blue.500', borderWidth: '1px' },
      item: { color: 'blue.600' },
    },
  },
  defaultProps: {
    size: 'md',
  },
};
```

### v3 Theming System

**Note**: v3 theming API differs from v2. Exact details require consulting updated documentation.

#### Component-Based Theming

v3 uses a component-based theming approach tied to Ark UI patterns. Theme customization likely works differently from v2's `useMultiStyleConfig` approach.

#### Style Props

Direct style props work on v3 components:

```jsx
<Menu.Content minW="10rem" bg="white" borderRadius="md" boxShadow="lg">
  <Menu.Item color="blue.500">Styled Item</Menu.Item>
</Menu.Content>
```

---

## 8. Accessibility

### ARIA Implementation

Both v2 and v3 follow **WAI-ARIA Menu Pattern** guidelines.

#### ARIA Attributes (v2)

- **MenuButton**:
  - `role="button"`
  - `aria-haspopup="menu"`
  - `aria-expanded="true"` (when open)
  - `aria-controls="{menuListId}"`

- **MenuList**:
  - `role="menu"`
  - `id="{menuListId}"`

- **MenuItem**:
  - `role="menuitem"` (or `menuitemradio`/`menuitemcheckbox`)
  - `tabIndex={-1}` (for keyboard navigation)

- **MenuGroup**:
  - `role="group"`

- **MenuDivider**:
  - `role="separator"`
  - `aria-orientation="horizontal"`

#### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open menu (on button); Select item (on item) |
| `ArrowDown` | Open menu (on button); Move focus to next item |
| `ArrowUp` | Move focus to previous item |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Escape` | Close menu |
| `Tab` | Close menu and move focus forward |
| `Shift+Tab` | Close menu and move focus backward |
| `A-Z` | Type-ahead: Focus first item starting with typed letter |

#### Focus Management

- **Auto-focus**: First item auto-focused when menu opens (unless `autoSelect={false}`)
- **Focus trap**: Focus remains within menu while open
- **Focus return**: Focus returns to trigger button on close
- **Disabled items**: Can be made focusable with `isFocusable` (v2) for keyboard navigation

### Screen Reader Support

- Announces menu state changes (open/closed)
- Reads item labels, commands, and group titles
- Announces checked state for radio/checkbox items
- Proper role announcements for all elements

---

## 9. Best Practices

### When to Use Menu

✅ **Use Menu for**:
- Dropdown navigation menus
- Action lists (Edit, Delete, Share, etc.)
- Context menus (right-click menus)
- Filter/sort options
- User account menus

❌ **Don't Use Menu for**:
- Form select inputs (use `<Select>` instead)
- Multi-level site navigation (consider dedicated nav components)
- Long lists of items (consider virtualization or different UI pattern)

### Performance Optimization

#### v2
```jsx
{/* Lazy mount menu content */}
<Menu isLazy>
  <MenuButton>Actions</MenuButton>
  <MenuList>...</MenuList>
</Menu>

{/* Prevent unnecessary position calculations */}
<Menu computePositionOnMount={false}>
  ...
</Menu>
```

#### v3
```jsx
{/* v3.6.0+ has lazyMount=true by default */}
<Menu.Root lazyMount unmountOnExit>
  {/* Content only mounted when open */}
  {/* Unmounted when closed */}
</Menu.Root>
```

**Performance Issue**: In earlier v3 versions, closed menus would recalculate position on scroll, impacting performance. Fixed with lazy mounting defaults in v3.6.0.

### Migration Guide (v2 → v3)

#### Step 1: Update Imports
```jsx
// Before (v2)
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';

// After (v3)
import { Menu, Portal } from '@chakra-ui/react';
```

#### Step 2: Restructure Components
```jsx
// Before (v2)
<Menu>
  <MenuButton>Actions</MenuButton>
  <MenuList>
    <MenuItem>Download</MenuItem>
  </MenuList>
</Menu>

// After (v3)
<Menu.Root>
  <Menu.Trigger asChild>
    <Button>Actions</Button>
  </Menu.Trigger>
  <Portal>
    <Menu.Positioner>
      <Menu.Content>
        <Menu.Item value="download">Download</Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Portal>
</Menu.Root>
```

#### Step 3: Add Required Props
- Add `value` prop to all `<Menu.Item>` elements
- Add `asChild` to `<Menu.Trigger>` if wrapping a component
- Wrap content in `<Menu.Positioner>` and optionally `<Portal>`

#### Step 4: Rename Props
- `isDisabled` → `disabled`
- `isLazy` → `lazyMount` + `unmountOnExit`

#### Step 5: Update Option Groups
```jsx
// Before (v2)
<MenuOptionGroup type="radio" value={value}>
  <MenuItemOption value="a">A</MenuItemOption>
</MenuOptionGroup>

// After (v3)
<Menu.RadioItemGroup value={value}>
  <Menu.RadioItem value="a">A</Menu.RadioItem>
</Menu.RadioItemGroup>
```

#### Step 6: Update State Access
```jsx
// Before (v2)
<Menu>
  {({ isOpen }) => (
    <MenuButton>{isOpen ? 'Close' : 'Open'}</MenuButton>
  )}
</Menu>

// After (v3)
<Menu.Root>
  <Menu.Context>
    {(context) => (
      <Menu.Trigger>{context.isOpen ? 'Close' : 'Open'}</Menu.Trigger>
    )}
  </Menu.Context>
</Menu.Root>
```

#### Step 7: Fix Z-Index Issues
If Menu is inside a Modal/Drawer:
```jsx
<Menu.Root positioning={{ strategy: "fixed", hideWhenDetached: true }}>
  {/* Or use Portal with explicit container */}
</Menu.Root>
```

#### Step 8: Update Theming
- Review theme customizations - theming API changed significantly
- May need to refactor from `useMultiStyleConfig` to new v3 theming approach
- Consult v3 theming documentation for specifics

#### Migration Challenges
- **No automated tooling** - manual migration required
- **Documentation gaps** - some patterns not fully documented
- **Breaking changes** - extensive API changes across the board
- **Ecosystem impact** - may affect other components using Menu

---

## 10. Comparison Notes

### What Makes Chakra's Menu Unique

1. **Naming Convention**: Calls it "Menu" not "Dropdown" - emphasizes ARIA menu pattern compliance

2. **Multipart Architecture** (v2): Clear component composition with themed parts

3. **Compound Pattern** (v3): Explicit component relationships via namespaced components (`Menu.X`)

4. **Built on Ark UI** (v3): Leverages headless UI state machine for robust behavior

5. **Portal Integration**: First-class support for portaling menu content out of DOM hierarchy

6. **Chakra UI Styling**: Full integration with Chakra's design system and style props

7. **Type-ahead Search**: Built-in keyboard letter search to jump to items

8. **Option Groups**: Native support for radio and checkbox groups within menus

9. **Performance Focus** (v3): Lazy mounting enabled by default (v3.6.0+)

10. **Accessibility First**: Strong ARIA implementation with keyboard navigation out of the box

### Framework Philosophy

- **Web Standards**: Follows WAI-ARIA patterns closely
- **Developer Experience**: Balance between simplicity (v2) and explicitness (v3)
- **Composability**: All components accept style props and can be customized
- **Accessibility**: Non-negotiable - accessibility is built-in, not opt-in

---

## Research Notes

- **WebFetch blocked**: Unable to directly access chakra-ui.com, information gathered via WebSearch
- **v3 Documentation**: Some props and patterns not fully documented in search results
- **Ark UI Dependency**: v3 props may extend beyond Chakra docs - see Ark UI Menu for complete reference
- **Active Development**: v3 is relatively new, with ongoing improvements (v3.6.0 performance updates)
- **Migration Complexity**: Teams report significant migration effort; postponement common due to breaking changes
- **Z-index Issues**: Known issue with Menu in Drawer/Modal requires workarounds
- **Community Resources**: Active discussions on GitHub for implementation patterns and issues

---

## Additional Resources

- **Chakra UI v3 Docs**: https://www.chakra-ui.com/docs/components/menu
- **Chakra UI v2 Docs**: https://v2.chakra-ui.com/docs/components/menu
- **Migration Guide**: https://www.chakra-ui.com/docs/get-started/migration
- **Ark UI Menu**: https://ark-ui.com/docs/components/menu (v3 foundation)
- **GitHub Discussions**: https://github.com/chakra-ui/chakra-ui/discussions (implementation help)
- **WAI-ARIA Menu Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

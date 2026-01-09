# HeroUI Dropdown Component - Usage Pattern Report

**Research Date**: 2025-11-04
**Framework**: HeroUI (NextUI fork)
**Component**: Dropdown
**Documentation**: https://www.heroui.com/docs/components/dropdown

---

## 1. Component Overview

The HeroUI Dropdown component is a menu system that displays a list of actions or options that a user can choose. It extends the Popover component, inheriting all popover functionality (positioning, triggers, animations) while adding menu-specific features like selection tracking, keyboard navigation, and item management.

The Dropdown is designed for user-triggered action menus, context menus, and selection interfaces. It provides a complete composition system with five interrelated components that work together to create flexible menu experiences.

---

## 2. Basic Usage

### Minimal Example

```jsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from "@heroui/react";

function BasicDropdown() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
```

**Key Points**:
- `Dropdown` wrapper contains entire component system
- `DropdownTrigger` wraps the button/element that opens the menu
- `DropdownMenu` contains all items and accepts `aria-label` for accessibility
- `DropdownItem` requires unique `key` prop for identification
- Static items are defined inline as children

### Dynamic Items Example

```jsx
function DynamicDropdown() {
  const items = [
    { key: "new", label: "New File" },
    { key: "copy", label: "Copy Link" },
    { key: "edit", label: "Edit File" },
    { key: "delete", label: "Delete File", color: "danger" }
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Actions</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.color}
            className={item.color === "danger" ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
```

**Key Points**:
- Pass `items` prop to `DropdownMenu` for dynamic rendering
- Render function receives each item and returns `DropdownItem`
- Access item properties within render function for conditional styling

---

## 3. Props/API

### Dropdown Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Must contain `DropdownTrigger` and `DropdownMenu` |
| `type` | `'menu' \| 'listbox'` | `'menu'` | Menu interaction type |
| `trigger` | `'press' \| 'longPress'` | `'press'` | How menu opens |
| `isOpen` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `onOpenChange` | `(isOpen: boolean) => void` | - | Callback when open state changes |
| `isDisabled` | `boolean` | `false` | Disable entire dropdown |
| `closeOnSelect` | `boolean` | `true` | Close menu when item selected |
| `shouldBlockScroll` | `boolean` | `true` | Prevent body scroll when open |
| `placement` | `Placement` | `'bottom'` | Menu position relative to trigger |
| `offset` | `number` | `7` | Distance from trigger in pixels |
| `containerPadding` | `number` | `12` | Padding from viewport edges |
| `crossOffset` | `number` | `0` | Cross-axis offset |
| `shouldFlip` | `boolean` | `true` | Flip position if no space |
| `...PopoverProps` | - | - | Inherits all Popover component props |

**Placement Options**: `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-start'`, `'top-end'`, `'bottom-start'`, `'bottom-end'`, `'left-start'`, `'left-end'`, `'right-start'`, `'right-end'`

### DropdownTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactElement` | - | **Required**. Single child element (button, div, etc.) |

**Note**: The child must accept `ref` and standard DOM props (onClick, onKeyDown, etc.)

### DropdownMenu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((item: T) => ReactNode)` | - | Static items or render function |
| `items` | `Iterable<T>` | - | Data for dynamic rendering |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection behavior |
| `selectedKeys` | `'all' \| Iterable<Key>` | - | Controlled selected keys |
| `defaultSelectedKeys` | `'all' \| Iterable<Key>` | - | Uncontrolled default selection |
| `onSelectionChange` | `(keys: Selection) => void` | - | Callback when selection changes |
| `disabledKeys` | `Iterable<Key>` | - | Keys of disabled items |
| `disallowEmptySelection` | `boolean` | `false` | Require at least one selection |
| `variant` | `'solid' \| 'bordered' \| 'light' \| 'flat' \| 'faded' \| 'shadow'` | `'solid'` | Visual style variant |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Color theme |
| `aria-label` | `string` | - | Accessible label for menu |
| `topContent` | `ReactNode` | - | Content above menu items |
| `bottomContent` | `ReactNode` | - | Content below menu items |
| `emptyContent` | `ReactNode` | `'No items'` | Shown when no items present |
| `classNames` | `Record<string, string>` | - | Classes for menu slots |
| `itemClasses` | `Record<string, string>` | - | Classes applied to all items |
| `onAction` | `(key: Key) => void` | - | Callback when item activated |
| `onClose` | `() => void` | - | Callback when menu closes |
| `autoFocus` | `boolean \| 'first' \| 'last'` | `false` | Auto-focus behavior on open |
| `shouldFocusWrap` | `boolean` | `true` | Wrap focus at list boundaries |

### DropdownItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `Key` | - | **Required**. Unique identifier |
| `children` | `ReactNode` | - | Item content/label |
| `title` | `ReactNode` | - | Item title (alternative to children) |
| `description` | `ReactNode` | - | Secondary descriptive text |
| `shortcut` | `string` | - | Keyboard shortcut hint display |
| `startContent` | `ReactNode` | - | Icon/content before text |
| `endContent` | `ReactNode` | - | Icon/content after text |
| `isDisabled` | `boolean` | `false` | Disable this specific item |
| `isReadOnly` | `boolean` | `false` | Make item non-interactive |
| `className` | `string` | - | Custom CSS class |
| `classNames` | `Record<string, string>` | - | Classes for item slots |
| `href` | `string` | - | Link URL (renders as anchor) |
| `target` | `string` | - | Link target attribute |
| `rel` | `string` | - | Link relationship |
| `download` | `boolean \| string` | - | Download attribute |
| `ping` | `string` | - | Ping URLs |
| `referrerPolicy` | `ReferrerPolicy` | - | Referrer policy for links |
| `textValue` | `string` | - | Text for typeahead/accessibility |

**DropdownItem Slots**: `base`, `wrapper`, `title`, `description`, `shortcut`, `selectedIcon`

### DropdownSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((item: T) => ReactNode)` | - | Section items |
| `title` | `ReactNode` | - | Section heading |
| `items` | `Iterable<T>` | - | Dynamic items for section |
| `classNames` | `Record<string, string>` | - | Classes for section slots |
| `showDivider` | `boolean` | `false` | Show divider below section |

**DropdownSection Slots**: `base`, `heading`, `group`, `divider`

---

## 4. Variants & Patterns

### Trigger Types

```jsx
// Press trigger (default)
<Dropdown trigger="press">
  {/* Opens on click/tap */}
</Dropdown>

// Long press trigger
<Dropdown trigger="longPress">
  {/* Opens on long press/hold */}
</Dropdown>
```

### Placement/Positioning

```jsx
// Basic placement
<Dropdown placement="bottom-start">
  {/* Menu appears at bottom-left of trigger */}
</Dropdown>

// Custom offset
<Dropdown placement="right" offset={15}>
  {/* 15px away from trigger */}
</Dropdown>

// Cross offset (perpendicular adjustment)
<Dropdown placement="bottom" crossOffset={20}>
  {/* Shifted 20px along cross axis */}
</Dropdown>

// Disable auto-flip
<Dropdown placement="top" shouldFlip={false}>
  {/* Always stays at top, even if clipped */}
</Dropdown>
```

**All Placement Options**:
- `top`, `bottom`, `left`, `right` - Center aligned
- `top-start`, `bottom-start` - Left/top aligned
- `top-end`, `bottom-end` - Right/bottom aligned
- `left-start`, `right-start` - Top aligned
- `left-end`, `right-end` - Bottom aligned

### Menu Structure - Sections, Items, Shortcuts

```jsx
<DropdownMenu aria-label="Actions with sections">
  <DropdownSection title="File Operations">
    <DropdownItem
      key="new"
      description="Create a new file"
      shortcut="⌘N"
      startContent={<FileIcon />}
    >
      New File
    </DropdownItem>
    <DropdownItem
      key="open"
      description="Open existing file"
      shortcut="⌘O"
      startContent={<FolderIcon />}
    >
      Open
    </DropdownItem>
  </DropdownSection>

  <DropdownSection title="Edit" showDivider>
    <DropdownItem key="copy" shortcut="⌘C">
      Copy
    </DropdownItem>
    <DropdownItem key="paste" shortcut="⌘V">
      Paste
    </DropdownItem>
  </DropdownSection>
</DropdownMenu>
```

**Key Points**:
- `DropdownSection` groups related items with optional `title`
- `showDivider` adds visual separator after section
- `description` provides additional context below item title
- `shortcut` displays keyboard hint (right-aligned)

### Icons and Descriptions

```jsx
import { EditIcon, DeleteIcon, SaveIcon } from "./icons";

<DropdownMenu>
  <DropdownItem
    key="edit"
    description="Modify the selected item"
    startContent={<EditIcon />}
  >
    Edit
  </DropdownItem>

  <DropdownItem
    key="save"
    description="Save changes"
    startContent={<SaveIcon />}
    shortcut="⌘S"
  >
    Save
  </DropdownItem>

  <DropdownItem
    key="delete"
    description="Permanently delete"
    startContent={<DeleteIcon />}
    endContent={<WarningBadge />}
    color="danger"
  >
    Delete
  </DropdownItem>
</DropdownMenu>
```

### Disabled Items

```jsx
// Individual item disabled
<DropdownItem key="item1" isDisabled>
  Disabled Item
</DropdownItem>

// Multiple items disabled via menu
<DropdownMenu disabledKeys={["edit", "delete"]}>
  <DropdownItem key="new">New</DropdownItem>
  <DropdownItem key="edit">Edit</DropdownItem>
  <DropdownItem key="delete">Delete</DropdownItem>
</DropdownMenu>

// Disable entire dropdown
<Dropdown isDisabled>
  {/* Trigger becomes non-interactive */}
</Dropdown>
```

### Variants (Visual Styles)

```jsx
// Solid (default) - filled background
<DropdownMenu variant="solid">

// Bordered - outline style
<DropdownMenu variant="bordered">

// Light - subtle background
<DropdownMenu variant="light">

// Flat - minimal style
<DropdownMenu variant="flat">

// Faded - semi-transparent
<DropdownMenu variant="faded">

// Shadow - elevated appearance
<DropdownMenu variant="shadow">
```

### Colors

```jsx
<DropdownMenu color="default">   {/* Neutral theme */}
<DropdownMenu color="primary">   {/* Brand primary */}
<DropdownMenu color="secondary"> {/* Brand secondary */}
<DropdownMenu color="success">   {/* Success/confirmation */}
<DropdownMenu color="warning">   {/* Warning/caution */}
<DropdownMenu color="danger">    {/* Error/destructive */}
```

**Note**: Colors can also be applied per-item:

```jsx
<DropdownItem key="delete" color="danger">
  Delete
</DropdownItem>
```

### Single vs Multi-Selection

```jsx
// Single selection
function SingleSelect() {
  const [selected, setSelected] = useState(new Set(["text"]));

  return (
    <DropdownMenu
      aria-label="Format options"
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <DropdownItem key="text">Text</DropdownItem>
      <DropdownItem key="number">Number</DropdownItem>
      <DropdownItem key="date">Date</DropdownItem>
    </DropdownMenu>
  );
}

// Multiple selection (menu stays open)
function MultiSelect() {
  const [selected, setSelected] = useState(new Set(["code", "issues"]));

  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>
        <Button>Features ({selected.size})</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Features"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <DropdownItem key="code">Code</DropdownItem>
        <DropdownItem key="issues">Issues</DropdownItem>
        <DropdownItem key="wiki">Wiki</DropdownItem>
        <DropdownItem key="projects">Projects</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
```

**Key Points**:
- Use `Set` for tracking selected keys
- Set `closeOnSelect={false}` for multi-select to keep menu open
- Selected items show checkmark icon automatically
- Use `disallowEmptySelection` to require at least one selection

### Tailwind-Specific Patterns

```jsx
// Custom trigger styling with Tailwind
<DropdownTrigger>
  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
    Gradient Menu
  </Button>
</DropdownTrigger>

// Item styling with Tailwind classes
<DropdownItem
  key="premium"
  className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500"
>
  Premium Feature
</DropdownItem>

// Menu container styling
<DropdownMenu
  classNames={{
    base: "max-w-xs",
    list: "gap-1 p-2"
  }}
>
```

### Top/Bottom Content

```jsx
<DropdownMenu
  topContent={
    <div className="px-3 py-2 border-b">
      <p className="text-sm font-semibold">Quick Actions</p>
    </div>
  }
  bottomContent={
    <div className="px-3 py-2 border-t">
      <Button size="sm" fullWidth>View All</Button>
    </div>
  }
>
  <DropdownItem key="1">Action 1</DropdownItem>
  <DropdownItem key="2">Action 2</DropdownItem>
</DropdownMenu>
```

---

## 5. Composition Patterns

### Component Hierarchy

```
Dropdown (root container)
  └─ DropdownTrigger (interaction element)
       └─ Button/Element (must accept ref)
  └─ DropdownMenu (item container)
       ├─ topContent (optional)
       ├─ DropdownSection (grouping)
       │    └─ DropdownItem (individual options)
       ├─ DropdownItem (ungrouped items)
       ├─ bottomContent (optional)
       └─ emptyContent (fallback)
```

### Required Structure

```jsx
<Dropdown>
  {/* REQUIRED: Exactly one DropdownTrigger */}
  <DropdownTrigger>
    <Button>Trigger</Button>
  </DropdownTrigger>

  {/* REQUIRED: Exactly one DropdownMenu */}
  <DropdownMenu>
    {/* Items here */}
  </DropdownMenu>
</Dropdown>
```

### Static vs Dynamic Composition

```jsx
// Static - items defined inline
<DropdownMenu>
  <DropdownSection title="Group 1">
    <DropdownItem key="a">Item A</DropdownItem>
    <DropdownItem key="b">Item B</DropdownItem>
  </DropdownSection>
</DropdownMenu>

// Dynamic - items from data
<DropdownMenu items={sections}>
  {(section) => (
    <DropdownSection key={section.key} title={section.title} items={section.items}>
      {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
    </DropdownSection>
  )}
</DropdownMenu>
```

### Controlled vs Uncontrolled

```jsx
// Uncontrolled (component manages state)
<Dropdown defaultOpen>
  <DropdownMenu defaultSelectedKeys={["item1"]}>

// Controlled (external state management)
const [isOpen, setIsOpen] = useState(false);
const [selected, setSelected] = useState(new Set());

<Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
  <DropdownMenu
    selectedKeys={selected}
    onSelectionChange={setSelected}
  >
```

---

## 6. Styling & Theming

### Slot-Based Customization

**DropdownMenu Slots**:
- `base` - Outer menu container
- `list` - Inner list wrapper
- `emptyContent` - Empty state container

**DropdownItem Slots**:
- `base` - Item root element
- `wrapper` - Content wrapper
- `title` - Title text element
- `description` - Description text element
- `shortcut` - Shortcut display element
- `selectedIcon` - Selection indicator icon

**DropdownSection Slots**:
- `base` - Section root
- `heading` - Section title element
- `group` - Item group container
- `divider` - Separator element

### Styling Examples

```jsx
// Menu-level slot styling
<DropdownMenu
  classNames={{
    base: "min-w-[240px] rounded-lg shadow-xl",
    list: "p-2 gap-1"
  }}
>

// Item-level slot styling
<DropdownItem
  classNames={{
    base: "rounded-md data-[hover=true]:bg-primary-50",
    title: "text-sm font-medium",
    description: "text-xs text-default-500",
    shortcut: "text-xs text-default-400 font-mono"
  }}
>

// Bulk item styling via itemClasses
<DropdownMenu
  itemClasses={{
    base: "gap-4",
    title: "font-semibold"
  }}
>
```

### Tailwind Classes Integration

```jsx
// Direct className on items
<DropdownItem className="hover:bg-purple-100 dark:hover:bg-purple-900">

// Responsive design
<DropdownMenu className="w-full sm:w-64 md:w-80">

// Dark mode
<DropdownItem className="bg-white dark:bg-slate-800">

// Conditional styling
<DropdownItem
  className={cn(
    "transition-colors",
    isActive && "bg-primary text-primary-foreground"
  )}
>
```

### CSS Variables

HeroUI uses CSS custom properties for theming. Common variables:

```css
/* Menu-level variables (customize via CSS) */
--heroui-dropdown-background
--heroui-dropdown-border-color
--heroui-dropdown-shadow

/* Item-level variables */
--heroui-item-hover-background
--heroui-item-selected-background
--heroui-item-text-color
```

Apply via inline style or external CSS:

```jsx
<DropdownMenu
  style={{
    "--heroui-dropdown-background": "rgba(255, 255, 255, 0.9)"
  }}
>
```

### Data Attributes for Styling

DropdownItem exposes state via data attributes:

```jsx
// CSS targeting
.my-item[data-hover="true"] { }
.my-item[data-selected="true"] { }
.my-item[data-disabled="true"] { }
.my-item[data-focus="true"] { }
.my-item[data-focus-visible="true"] { }
.my-item[data-pressed="true"] { }

// Usage
<DropdownItem className="my-item data-[selected=true]:bg-blue-500">
```

---

## 7. Accessibility

### ARIA Implementation

**DropdownMenu**:
- Role: `menu` (default) or `listbox` (based on `type` prop)
- Required `aria-label` or `aria-labelledby`
- Automatic `aria-activedescendant` for focus management
- `aria-multiselectable` when `selectionMode="multiple"`

**DropdownItem**:
- Role: `menuitem` or `option`
- `aria-disabled` for disabled items
- `aria-selected` for selected items
- Complex labeling support via `textValue` prop

**DropdownTrigger**:
- `aria-haspopup="menu"`
- `aria-expanded` reflects open state
- `aria-controls` references menu ID

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Open menu (on trigger), Activate item (in menu) |
| `ArrowDown` | Next item (wraps to first) |
| `ArrowUp` | Previous item (wraps to last) |
| `Home` | First item |
| `End` | Last item |
| `Escape` | Close menu |
| `A-Z` | Typeahead navigation to matching items |
| `Tab` | Close menu and move to next focusable element |

**Auto-focus Options**:
```jsx
// Focus first item on open
<DropdownMenu autoFocus="first">

// Focus last item on open
<DropdownMenu autoFocus="last">

// No auto-focus (manual management)
<DropdownMenu autoFocus={false}>
```

**Focus Wrapping**:
```jsx
// Wrap focus at boundaries (default)
<DropdownMenu shouldFocusWrap={true}>

// Stop at first/last item
<DropdownMenu shouldFocusWrap={false}>
```

### Screen Reader Support

**Announcements**:
- Menu open/close state changes announced
- Selected item changes announced
- Disabled items identified
- Section headings read as navigation landmarks

**Complex Items**:
```jsx
<DropdownItem
  textValue="Edit document - Modify the current document - Shortcut Command E"
  description="Modify the current document"
  shortcut="⌘E"
>
  Edit Document
</DropdownItem>
```

The `textValue` prop provides complete context for screen readers without cluttering the visual presentation.

**Empty State**:
```jsx
<DropdownMenu
  emptyContent={
    <p role="status" aria-live="polite">
      No items available
    </p>
  }
>
```

---

## 8. Best Practices

### When to Use Dropdown

**Good Use Cases**:
- Action menus (File, Edit, View menus)
- Context menus (right-click actions)
- Selection lists with limited options
- Quick filters or view options
- User account/settings menus

**Avoid When**:
- Form inputs (use Select instead)
- Navigation with many nested levels (use navigation menu)
- Long lists (>20 items without search/filter)
- Critical primary actions (use visible buttons)

### Common Patterns

**1. Action Handler Pattern**
```jsx
function handleAction(key) {
  switch (key) {
    case "new":
      createNew();
      break;
    case "delete":
      confirmDelete();
      break;
  }
}

<DropdownMenu onAction={handleAction}>
```

**2. Confirmation Pattern**
```jsx
function handleDelete(key) {
  if (key === "delete") {
    setShowConfirmation(true);
  }
}

<DropdownItem key="delete" onAction={handleDelete}>
```

**3. Dynamic Content Pattern**
```jsx
const items = useMemo(() => {
  return data.filter(item => item.isAvailable);
}, [data]);

<DropdownMenu items={items}>
```

**4. Routing Integration**
```jsx
// Next.js
<DropdownItem key="profile" href="/profile">
  Profile
</DropdownItem>

// React Router (use as prop if needed)
<DropdownItem
  key="settings"
  onAction={() => navigate('/settings')}
>
  Settings
</DropdownItem>
```

### Gotchas & Tips

1. **Selection State Management**
   - Use `Set` for selected keys, not arrays
   - For single selection, still use `Set(["key"])`
   - Check `selected.has(key)` to test selection

2. **closeOnSelect Behavior**
   ```jsx
   // Single select - usually want auto-close (default)
   selectionMode="single" closeOnSelect={true}

   // Multi select - usually want to stay open
   selectionMode="multiple" closeOnSelect={false}
   ```

3. **Keys Must Be Unique**
   ```jsx
   // Bad - duplicate keys
   <DropdownItem key="1">...</DropdownItem>
   <DropdownItem key="1">...</DropdownItem>

   // Good - unique keys
   <DropdownItem key="edit-1">...</DropdownItem>
   <DropdownItem key="edit-2">...</DropdownItem>
   ```

4. **Trigger Must Accept Ref**
   ```jsx
   // Good - Button accepts ref
   <DropdownTrigger>
     <Button>Menu</Button>
   </DropdownTrigger>

   // Bad - Plain div needs forwardRef
   <DropdownTrigger>
     <div>Menu</div>  {/* May not work */}
   </DropdownTrigger>
   ```

5. **Performance with Large Lists**
   - Use `items` prop with render function for dynamic lists
   - Consider virtualization for 50+ items
   - Memoize item rendering functions
   - Use `textValue` for search/filter optimization

6. **Controlled State Timing**
   ```jsx
   // Update state in callback, not inline
   <DropdownMenu
     selectedKeys={selected}
     onSelectionChange={(keys) => {
       setSelected(keys);
       // Other side effects here
     }}
   >
   ```

---

## 9. Comparison Notes

### Unique/Notable Features vs Typical Dropdowns

1. **Popover Foundation**
   - Unlike basic dropdowns, extends full Popover API
   - Advanced positioning with auto-flip, offset, boundary detection
   - Can configure scroll blocking, focus guards, etc.

2. **Selection as First-Class Feature**
   - Built-in single/multiple selection modes
   - Automatic checkmark rendering
   - `disallowEmptySelection` for required selections
   - Unlike many dropdowns that only handle actions

3. **Rich Item Composition**
   - `description` and `shortcut` props built-in
   - `startContent` and `endContent` for icons
   - Complex items without custom rendering

4. **Tailwind-First Design**
   - Deep integration with Tailwind utilities
   - `classNames` prop with slot targeting
   - Data attributes for state-based styling
   - No CSS-in-JS required

5. **Section Support**
   - First-class `DropdownSection` component
   - Dividers, headings, grouped items
   - Dynamic sections with nested render functions

6. **Keyboard Navigation Excellence**
   - Typeahead search built-in
   - Full arrow key navigation
   - Configurable auto-focus and wrapping
   - Home/End key support

7. **Framework Agnostic Links**
   - `href` props work with Next.js automatically
   - Standard anchor attributes (target, rel, download)
   - No special router integration needed

8. **Accessibility by Default**
   - ARIA attributes automatic
   - Keyboard support without configuration
   - Screen reader announcements built-in
   - Complex item labeling support

9. **Content Zones**
   - `topContent` / `bottomContent` for headers/footers
   - `emptyContent` for zero-state messaging
   - Unlike basic dropdowns that only support items

10. **Data Attribute State Exposure**
    - `data-hover`, `data-selected`, `data-disabled`, etc.
    - Enables CSS-only interactive states
    - No JavaScript state tracking needed for styling

### HeroUI vs NextUI

HeroUI is a fork of NextUI with potential divergence. The Dropdown API appears consistent with NextUI's design patterns but verify version compatibility when migrating projects.

---

## Summary

The HeroUI Dropdown component is a comprehensive menu system built on Popover foundations with extensive accessibility, rich composition patterns, and Tailwind-first styling. It excels at action menus, context menus, and selection interfaces through five interrelated components (Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection).

**Key Strengths**:
- Excellent accessibility (ARIA, keyboard, screen reader)
- Flexible composition (sections, descriptions, shortcuts, icons)
- Built-in selection modes (none, single, multiple)
- Advanced positioning (12 placement options, auto-flip, offsets)
- Tailwind integration (slots, data attributes, utilities)
- Framework-agnostic routing support

**Recommended For**:
- Applications requiring accessible menu systems
- Tailwind-based design systems
- Projects needing selection + action menus
- Teams wanting minimal custom styling code

**Watch Out For**:
- Large lists need virtualization consideration
- Trigger must accept ref (wrapper needed for plain elements)
- Selection state uses `Set`, not arrays
- Keys must be unique across all items/sections

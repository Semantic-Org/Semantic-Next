# HeroUI Listbox Component - Usage Pattern Report

**Research Date**: 2025-11-05
**Framework**: HeroUI (NextUI fork)
**Component**: Listbox
**Documentation**: https://www.heroui.com/docs/components/listbox

---

## 1. Component Overview

The HeroUI Listbox component is an accessible, keyboard-navigable list selection interface built on React Aria's `useListBox` hook. It displays a collection of selectable options with comprehensive keyboard support, multiple selection modes, and support for both small and massive datasets through virtualization.

The Listbox is designed for scenarios where users need to select from a list of options with full keyboard accessibility, including typeahead navigation, arrow key traversal, and screen reader support. It's distinct from Dropdown menus in that it emphasizes multi-selection capability, large-dataset performance, and complex selection workflows rather than simple option picking.

The component system includes three primary parts:
- **Listbox**: Root wrapper managing selection state and behavior
- **ListboxItem**: Individual selectable options with rich content support
- **ListboxSection**: Grouping mechanism for organizing related items with optional visual separation

---

## 2. Basic Usage

### Minimal Example

```jsx
import { Listbox, ListboxItem } from "@heroui/react";

export default function BasicListbox() {
  return (
    <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
      <ListboxItem key="new">New file</ListboxItem>
      <ListboxItem key="copy">Copy link</ListboxItem>
      <ListboxItem key="edit">Edit file</ListboxItem>
      <ListboxItem key="delete" color="danger">
        Delete file
      </ListboxItem>
    </Listbox>
  );
}
```

**Key Points**:
- `Listbox` wrapper contains all items
- Each `ListboxItem` requires unique `key` prop for identification
- `aria-label` is required for accessibility when no visible label
- `onAction` callback fires when item is activated
- Static items defined as JSX children

### Dynamic Items Example

```jsx
import { Listbox, ListboxItem } from "@heroui/react";

function DynamicListbox() {
  const items = [
    { id: "new", label: "New File", description: "Create a new file" },
    { id: "open", label: "Open File", description: "Open an existing file" },
    { id: "save", label: "Save", description: "Save the current file" },
    { id: "delete", label: "Delete", description: "Delete the file", color: "danger" }
  ];

  return (
    <Listbox
      aria-label="File operations"
      items={items}
      onAction={(key) => handleAction(key)}
    >
      {(item) => (
        <ListboxItem
          key={item.id}
          color={item.color}
          description={item.description}
        >
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  );
}
```

**Key Points**:
- Pass `items` prop with data array to `Listbox`
- Render function receives each item and returns `ListboxItem`
- Access item properties for conditional rendering and styling
- Render function pattern enables efficient dynamic updates

### Controlled Selection Example

```jsx
function ControlledListbox() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["item1"]));

  return (
    <Listbox
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      aria-label="Select items"
    >
      <ListboxItem key="item1">Item 1</ListboxItem>
      <ListboxItem key="item2">Item 2</ListboxItem>
      <ListboxItem key="item3">Item 3</ListboxItem>
    </Listbox>
  );
}
```

**Key Points**:
- Use `Set` for tracking selected keys (not arrays)
- `selectedKeys` prop for controlled component
- `onSelectionChange` fires with new `Set` of selected keys
- Works with `selectionMode="single"` or `"multiple"`

---

## 3. Props/API Reference

### Listbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((item: T) => ReactNode)` | — | Static items or render function for dynamic rendering |
| `items` | `Iterable<T>` | — | Data collection for dynamic rendering |
| `aria-label` | `string` | — | Accessible label (required if no visible label) |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection behavior mode |
| `selectedKeys` | `'all' \| Iterable<Key>` | — | Controlled selected keys |
| `defaultSelectedKeys` | `'all' \| Iterable<Key>` | — | Uncontrolled default selection |
| `onSelectionChange` | `(keys: Selection) => void` | — | Callback when selection changes |
| `disabledKeys` | `Iterable<Key>` | — | Keys of disabled items |
| `disallowEmptySelection` | `boolean` | — | Require at least one selected item (single mode only) |
| `variant` | `'solid' \| 'bordered' \| 'light' \| 'flat' \| 'faded' \| 'shadow'` | `'solid'` | Visual style variant |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Color theme |
| `isVirtualized` | `boolean` | `false` | Enable virtual scrolling for large lists |
| `virtualization` | `VirtualizationConfig` | — | Configuration for virtualization |
| `topContent` | `ReactNode` | — | Content displayed above items |
| `bottomContent` | `ReactNode` | — | Content displayed below items |
| `emptyContent` | `ReactNode` | `'No items.'` | Shown when list is empty |
| `classNames` | `Record<string, string>` | — | Classes for slots (base, list, emptyContent) |
| `itemClasses` | `Record<string, string>` | — | Classes applied to all items |
| `onAction` | `(key: Key) => void` | — | Callback when item is activated |
| `shouldFocusWrap` | `boolean` | `true` | Wrap focus at list boundaries |
| `autoFocus` | `boolean \| 'first' \| 'last'` | `false` | Auto-focus behavior on mount |

### ListboxItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `Key` | — | **Required**. Unique identifier for the item |
| `children` | `ReactNode` | — | Item content/label text |
| `title` | `ReactNode` | — | Title text (alternative to children) |
| `description` | `ReactNode` | — | Secondary descriptive text below title |
| `startContent` | `ReactNode` | — | Icon/content before text |
| `endContent` | `ReactNode` | — | Icon/content after text |
| `isDisabled` | `boolean` | `false` | Disable this specific item |
| `isReadOnly` | `boolean` | `false` | Make item non-interactive but visible |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | — | Item-specific color |
| `className` | `string` | — | Custom CSS class for this item |
| `classNames` | `Record<string, string>` | — | Classes for item slots |
| `href` | `string` | — | Link URL (renders as anchor when provided) |
| `target` | `string` | — | Link target attribute |
| `rel` | `string` | — | Link relationship |
| `textValue` | `string` | — | Text for typeahead/accessibility |

**ListboxItem Slots**: `base`, `wrapper`, `title`, `description`, `selectedIcon`

### ListboxSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((item: T) => ReactNode)` | — | Section items |
| `title` | `ReactNode` | — | Section heading/title |
| `items` | `Iterable<T>` | — | Dynamic items for section |
| `classNames` | `Record<string, string>` | — | Classes for section slots |
| `showDivider` | `boolean` | `false` | Show visual divider after section |

**ListboxSection Slots**: `base`, `heading`, `group`, `divider`

### Virtualization Config

```typescript
interface VirtualizationConfig {
  maxListboxHeight?: number;  // Maximum height in pixels
  itemHeight?: number;        // Height of each item in pixels
}
```

---

## 4. Variants & Patterns

### Selection Modes

**None Mode (Default)** - No selection, read-only action list

```jsx
<Listbox aria-label="Actions" onAction={handleAction}>
  <ListboxItem key="new">New</ListboxItem>
  <ListboxItem key="open">Open</ListboxItem>
</Listbox>
```

**Single Selection Mode** - User picks one option

```jsx
function SingleSelect() {
  const [selected, setSelected] = React.useState(new Set(["item1"]));

  return (
    <Listbox
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ListboxItem key="item1">Option 1</ListboxItem>
      <ListboxItem key="item2">Option 2</ListboxItem>
      <ListboxItem key="item3">Option 3</ListboxItem>
    </Listbox>
  );
}
```

**Multiple Selection Mode** - Checkbox-style multi-selection

```jsx
function MultiSelect() {
  const [selected, setSelected] = React.useState(new Set(["item1", "item3"]));

  return (
    <Listbox
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ListboxItem key="item1">Feature 1</ListboxItem>
      <ListboxItem key="item2">Feature 2</ListboxItem>
      <ListboxItem key="item3">Feature 3</ListboxItem>
    </Listbox>
  );
}
```

**Key Points**:
- Use `Set` for selected keys, not arrays
- Single selection still returns `Set` with one key
- Multiple selection allows zero or more items (unless `disallowEmptySelection={true}`)

### Visual Variants

```jsx
// Solid (default) - filled background
<Listbox variant="solid">

// Bordered - outline style
<Listbox variant="bordered">

// Light - subtle background
<Listbox variant="light">

// Flat - minimal style
<Listbox variant="flat">

// Faded - semi-transparent
<Listbox variant="faded">

// Shadow - elevated appearance
<Listbox variant="shadow">
```

### Color Schemes

```jsx
<Listbox color="default">   {/* Neutral theme */}
<Listbox color="primary">   {/* Brand primary */}
<Listbox color="secondary"> {/* Brand secondary */}
<Listbox color="success">   {/* Success/confirmation */}
<Listbox color="warning">   {/* Warning/caution */}
<Listbox color="danger">    {/* Error/destructive */}
```

**Per-Item Color Override**:

```jsx
<ListboxItem key="delete" color="danger">
  Delete Item
</ListboxItem>
```

### Sections and Grouping

```jsx
<Listbox aria-label="Actions with sections">
  <ListboxSection title="File Operations" showDivider>
    <ListboxItem key="new">New File</ListboxItem>
    <ListboxItem key="open">Open File</ListboxItem>
    <ListboxItem key="save">Save</ListboxItem>
  </ListboxSection>

  <ListboxSection title="Edit Operations" showDivider>
    <ListboxItem key="cut">Cut</ListboxItem>
    <ListboxItem key="copy">Copy</ListboxItem>
    <ListboxItem key="paste">Paste</ListboxItem>
  </ListboxSection>

  <ListboxSection title="Danger Zone">
    <ListboxItem key="delete" color="danger">Delete</ListboxItem>
  </ListboxSection>
</Listbox>
```

**Key Points**:
- `ListboxSection` groups related items with optional `title`
- `showDivider` adds visual separator after section
- Sections can have their own `items` and render functions

### Icons and Descriptions

```jsx
import { EditIcon, DeleteIcon, SaveIcon, FolderIcon } from "./icons";

<Listbox>
  <ListboxItem
    key="edit"
    description="Modify the current item"
    startContent={<EditIcon />}
  >
    Edit
  </ListboxItem>

  <ListboxItem
    key="save"
    description="Save changes"
    startContent={<SaveIcon />}
  >
    Save
  </ListboxItem>

  <ListboxItem
    key="folder"
    description="Open in folder"
    startContent={<FolderIcon />}
    endContent={<ExternalLinkIcon />}
  >
    Show in Finder
  </ListboxItem>

  <ListboxItem
    key="delete"
    description="Permanently delete (cannot be undone)"
    startContent={<DeleteIcon />}
    color="danger"
  >
    Delete
  </ListboxItem>
</Listbox>
```

### Disabled Items

```jsx
// Individual item disabled
<ListboxItem key="item1" isDisabled>
  Disabled Item
</ListboxItem>

// Multiple items disabled via listbox
<Listbox disabledKeys={["edit", "delete"]}>
  <ListboxItem key="new">New</ListboxItem>
  <ListboxItem key="edit">Edit</ListboxItem>
  <ListboxItem key="delete">Delete</ListboxItem>
</Listbox>
```

**Visual Characteristics**:
- Reduced opacity
- No hover effects
- Not focusable via keyboard
- Not selectable

### Dynamic Collections with Complex Data

```jsx
function ComplexListbox() {
  const categories = [
    {
      title: "Fruits",
      items: [
        { id: "apple", label: "Apple", emoji: "🍎" },
        { id: "banana", label: "Banana", emoji: "🍌" }
      ]
    },
    {
      title: "Vegetables",
      items: [
        { id: "carrot", label: "Carrot", emoji: "🥕" },
        { id: "lettuce", label: "Lettuce", emoji: "🥬" }
      ]
    }
  ];

  return (
    <Listbox items={categories} selectionMode="multiple">
      {(category) => (
        <ListboxSection key={category.title} title={category.title} items={category.items}>
          {(item) => (
            <ListboxItem key={item.id} startContent={item.emoji}>
              {item.label}
            </ListboxItem>
          )}
        </ListboxSection>
      )}
    </Listbox>
  );
}
```

### Virtualization for Large Lists

```jsx
function VirtualizedListbox() {
  // Generate 10,000 items
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i}`
  }));

  return (
    <Listbox
      items={items}
      isVirtualized
      virtualization={{
        maxListboxHeight: 400,
        itemHeight: 40
      }}
      onAction={(key) => console.log("Selected:", key)}
    >
      {(item) => (
        <ListboxItem key={item.id}>
          {item.label}
        </ListboxItem>
      )}
    </Listbox>
  );
}
```

**Key Points**:
- Set `isVirtualized={true}` to enable virtual scrolling
- Provide `maxListboxHeight` (in pixels) for visible area
- Provide `itemHeight` (in pixels) for each item's height
- Essential for lists with 100+ items
- Can handle 10,000+ items efficiently

### Top/Bottom Content

```jsx
<Listbox
  topContent={
    <div className="px-2 py-1 border-b">
      <input
        type="text"
        placeholder="Search items..."
        className="w-full rounded px-2 py-1"
      />
    </div>
  }
  bottomContent={
    <div className="px-2 py-2 border-t text-sm text-default-500">
      Total items: {totalCount}
    </div>
  }
>
  {/* items */}
</Listbox>
```

---

## 5. Composition Patterns

### Component Hierarchy

```
Listbox (root container)
  ├─ topContent (optional)
  ├─ ListboxSection (optional grouping)
  │   ├─ heading (section title)
  │   └─ ListboxItem (individual options)
  ├─ ListboxItem (ungrouped items)
  ├─ bottomContent (optional)
  └─ emptyContent (fallback when empty)
```

### Required Structure

```jsx
<Listbox aria-label="Select options">
  {/* ListboxItem children required */}
  <ListboxItem key="1">Option 1</ListboxItem>
</Listbox>
```

### Static vs Dynamic Composition

**Static** - Items defined inline:

```jsx
<Listbox>
  <ListboxSection title="Group 1">
    <ListboxItem key="a">Item A</ListboxItem>
    <ListboxItem key="b">Item B</ListboxItem>
  </ListboxSection>
</Listbox>
```

**Dynamic** - Items from data:

```jsx
<Listbox items={sections}>
  {(section) => (
    <ListboxSection key={section.id} title={section.title} items={section.items}>
      {(item) => <ListboxItem key={item.id}>{item.label}</ListboxItem>}
    </ListboxSection>
  )}
</Listbox>
```

### Controlled vs Uncontrolled

**Uncontrolled** - Component manages selection state:

```jsx
<Listbox defaultSelectedKeys={["item1"]}>
  {/* items */}
</Listbox>
```

**Controlled** - External state management:

```jsx
const [selected, setSelected] = React.useState(new Set(["item1"]));

<Listbox
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  {/* items */}
</Listbox>
```

---

## 6. Styling & Theming

### Slot-Based Customization

**Listbox Slots**:
- `base` - Outer wrapper container
- `list` - Inner list wrapper (like `<ul>`)
- `emptyContent` - Empty state container

**ListboxItem Slots**:
- `base` - Item root element
- `wrapper` - Content wrapper
- `title` - Title text element
- `description` - Description text element
- `selectedIcon` - Selection indicator icon

**ListboxSection Slots**:
- `base` - Section root
- `heading` - Section title element
- `group` - Item group container
- `divider` - Separator element

### Styling Examples

```jsx
// Listbox-level slot styling
<Listbox
  classNames={{
    base: "max-w-xs rounded-lg shadow-lg",
    list: "p-2 gap-1"
  }}
>

// Item-level slot styling
<ListboxItem
  classNames={{
    base: "rounded-md data-[hover=true]:bg-primary-50",
    title: "text-sm font-medium",
    description: "text-xs text-default-500"
  }}
>

// Bulk item styling via itemClasses
<Listbox
  itemClasses={{
    base: "gap-4",
    title: "font-semibold"
  }}
>
```

### Tailwind Classes Integration

```jsx
// Direct className on items
<ListboxItem className="hover:bg-purple-100 dark:hover:bg-purple-900">

// Responsive design
<Listbox className="w-full sm:w-64 md:w-80">

// Dark mode
<ListboxItem className="bg-white dark:bg-slate-800">

// Conditional styling
<ListboxItem
  className={cn(
    "transition-colors",
    isActive && "bg-primary text-primary-foreground"
  )}
>
```

### Data Attributes for Styling

ListboxItem exposes state via data attributes:

| Attribute | Condition | Usage |
|-----------|-----------|-------|
| `data-disabled` | Item is disabled | `data-[disabled=true]:opacity-50` |
| `data-selected` | Item is selected | `data-[selected=true]:bg-primary` |
| `data-hover` | Item is hovered | `data-[hover=true]:bg-content2` |
| `data-focus` | Item has focus | `data-[focus=true]:outline` |
| `data-focus-visible` | Keyboard focus | `data-[focus-visible=true]:ring-2` |

```jsx
<ListboxItem
  className={cn(
    "p-3 rounded-md transition-colors",
    "data-[selected=true]:bg-primary data-[selected=true]:text-white",
    "data-[hover=true]:bg-content2",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
  )}
>
```

### CSS Variables

HeroUI uses CSS custom properties for theming:

```css
/* Global theme customization */
:root {
  --heroui-primary: 220 100% 50%;
  --heroui-content1: 0 0% 100%;
  --heroui-content2: 0 0% 98%;
}

.dark {
  --heroui-primary: 220 100% 60%;
  --heroui-content1: 0 0% 10%;
  --heroui-content2: 0 0% 15%;
}
```

---

## 7. Keyboard Navigation

### Built-In Keyboard Support

| Key | Action |
|-----|--------|
| `ArrowDown` | Move to next item (wraps to first) |
| `ArrowUp` | Move to previous item (wraps to last) |
| `Home` | Move to first item |
| `End` | Move to last item |
| `Enter` | Activate/select focused item |
| `Space` | Toggle selection (multi-select mode) |
| `A-Z` | Typeahead navigation to matching items |
| `Escape` | (In some contexts) Close or defocus |
| `Tab` | Move to next focusable element, close listbox if in popup context |

### Focus Management

```jsx
// Auto-focus first item on mount
<Listbox autoFocus="first">

// Auto-focus last item on mount
<Listbox autoFocus="last">

// No auto-focus
<Listbox autoFocus={false}>

// Wrap focus at boundaries (default)
<Listbox shouldFocusWrap={true}>

// Don't wrap focus at boundaries
<Listbox shouldFocusWrap={false}>
```

---

## 8. Accessibility

### ARIA Implementation

**Listbox Role**:
- Role: `listbox`
- `aria-label` (required if no visible label)
- `aria-multiselectable` when `selectionMode="multiple"`
- `aria-disabled` for disabled listbox

**ListboxItem Role**:
- Role: `option`
- `aria-disabled` for disabled items
- `aria-selected` for selected items
- Automatic `id` and `aria-controls` for focus management

**ListboxSection**:
- Provides semantic grouping
- Section titles accessible to screen readers

### Screen Reader Support

- Selection state announced ("selected", "not selected")
- Item descriptions read in context
- Section headings announced as navigation landmarks
- Disabled items identified as such
- Empty state announced appropriately

### Best Practices for Accessibility

1. **Always provide `aria-label`** if listbox lacks visible labeling
   ```jsx
   <Listbox aria-label="Select file type">
   ```

2. **Use meaningful item titles and descriptions**
   ```jsx
   <ListboxItem description="Create a new document">
     New Document
   </ListboxItem>
   ```

3. **Provide text value for complex items**
   ```jsx
   <ListboxItem textValue="Edit document - Modify the current document">
     <EditIcon /> Edit
   </ListboxItem>
   ```

4. **Manage focus appropriately**
   ```jsx
   <Listbox autoFocus="first">
   ```

5. **Use semantic section titles**
   ```jsx
   <ListboxSection title="Danger Zone">
     <ListboxItem key="delete" color="danger">Delete</ListboxItem>
   </ListboxSection>
   ```

### Keyboard Navigation Excellence

- Full arrow key support with wrapping
- Typeahead search (`A-Z` jumps to items)
- Home/End key navigation
- Configurable auto-focus and focus wrapping
- No mouse required for full interaction

---

## 9. Best Practices

### When to Use Listbox

**Good Use Cases**:
- Selection from lists with 5-50+ items
- Multiple selection workflows
- Keyboard-first interfaces
- Complex data filtering/bulk operations
- Search result displays
- Permission/role selection matrices
- Large dataset handling (with virtualization)
- Read-only item browsing with actions

**Avoid When**:
- Only 2-3 simple options (use Radio or Switch)
- Binary toggles (use Switch)
- Dropdown context menus (use Dropdown instead)
- Form field selection requiring modal (use Select)

### State Management

**Single Selection Best Practice**:
```jsx
const [selected, setSelected] = React.useState(new Set(["item1"]));

<Listbox
  selectionMode="single"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
```

**Multiple Selection Best Practice**:
```jsx
const [selected, setSelected] = React.useState(new Set(["item1", "item2"]));

<Listbox
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
```

**Important**: Always use `Set` for selection state, not arrays.

### Virtualization Guidelines

```jsx
// For 100+ items, enable virtualization
if (items.length > 100) {
  return (
    <Listbox
      items={items}
      isVirtualized
      virtualization={{
        maxListboxHeight: 400,
        itemHeight: 40
      }}
    >
      {/* render items */}
    </Listbox>
  );
}
```

### Common Patterns

**1. Action Handler with Selection**
```jsx
function handleAction(key) {
  console.log("Item activated:", key);
}

function handleSelection(keys) {
  console.log("Selected items:", Array.from(keys));
}

<Listbox
  selectionMode="multiple"
  onAction={handleAction}
  onSelectionChange={handleSelection}
>
  {/* items */}
</Listbox>
```

**2. Conditional Rendering Based on Selection**
```jsx
const [selected, setSelected] = React.useState(new Set());
const selectedCount = selected.size;

<div>
  <Listbox
    selectionMode="multiple"
    selectedKeys={selected}
    onSelectionChange={setSelected}
  >
    {/* items */}
  </Listbox>
  {selectedCount > 0 && (
    <Button color="danger">
      Delete {selectedCount} item{selectedCount !== 1 ? "s" : ""}
    </Button>
  )}
</div>
```

**3. Search-Filter Pattern**
```jsx
function FilteredListbox() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Listbox items={filtered}>
        {(item) => <ListboxItem key={item.id}>{item.label}</ListboxItem>}
      </Listbox>
    </>
  );
}
```

### Gotchas & Tips

1. **Use `Set` for selection, not arrays**
   ```jsx
   // Good
   const [selected, setSelected] = React.useState(new Set(["key1"]));

   // Bad
   const [selected, setSelected] = React.useState(["key1"]);
   ```

2. **Keys must be unique across all items**
   ```jsx
   // Good - unique keys
   <ListboxItem key="edit-1">Edit 1</ListboxItem>
   <ListboxItem key="edit-2">Edit 2</ListboxItem>

   // Bad - duplicate keys
   <ListboxItem key="edit">Edit 1</ListboxItem>
   <ListboxItem key="edit">Edit 2</ListboxItem>
   ```

3. **Always provide `aria-label`** if no visible label
   ```jsx
   <Listbox aria-label="Required - describes the listbox">
   ```

4. **Virtualization needs correct item heights**
   ```jsx
   // Mismatch between actual and configured height causes rendering issues
   virtualization={{
     itemHeight: 40  // Must match actual item height
   }}
   ```

5. **Disabled keys must exist in items**
   ```jsx
   // Keys must reference actual item keys
   <Listbox disabledKeys={["item1", "item3"]}>
     <ListboxItem key="item1">Item 1</ListboxItem>
     <ListboxItem key="item2">Item 2</ListboxItem>
     <ListboxItem key="item3">Item 3</ListboxItem>
   </Listbox>
   ```

6. **Performance with dynamic items**
   - Memoize item rendering for large lists
   - Use `key` prop correctly for React reconciliation
   - Consider `useCallback` for event handlers

---

## 10. Advanced Features

### Router Integration

```jsx
// Next.js Link integration
<ListboxItem
  key="settings"
  href="/settings/profile"
  target="_self"
>
  Profile Settings
</ListboxItem>

// React Router integration (via onAction)
<ListboxItem
  key="dashboard"
  onAction={() => navigate("/dashboard")}
>
  Dashboard
</ListboxItem>
```

### Complex Item Rendering

```jsx
<Listbox items={users} selectionMode="multiple">
  {(user) => (
    <ListboxItem
      key={user.id}
      title={user.name}
      description={user.email}
      startContent={
        <Avatar
          src={user.avatar}
          size="sm"
          alt={user.name}
        />
      }
      endContent={
        user.isActive && <Badge color="success">Active</Badge>
      }
      className={!user.isActive ? "opacity-50" : ""}
    >
      {user.name}
    </ListboxItem>
  )}
</Listbox>
```

### Search Integration Example

```jsx
function SearchableListbox() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredItems = useMemo(() =>
    items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Search items..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <Listbox
        items={filteredItems}
        aria-label="Search results"
        emptyContent={
          searchTerm ? "No items found" : "No items"
        }
      >
        {(item) => (
          <ListboxItem key={item.id}>
            {item.label}
          </ListboxItem>
        )}
      </Listbox>
    </div>
  );
}
```

---

## 11. Comparison Notes

### Unique/Notable Features vs Typical Listboxes

1. **React Aria Foundation**
   - Built on React Aria's battle-tested `useListBox` hook
   - Ensures WCAG 2.1 compliance
   - Comprehensive keyboard support out of the box
   - Unlike many custom listbox implementations

2. **Virtualization Support**
   - First-class virtual scrolling for massive datasets
   - Can handle 10,000+ items efficiently
   - Not all listbox libraries include this
   - Critical for enterprise applications

3. **Flexible Content Slots**
   - `description`, `startContent`, `endContent` props built-in
   - Rich item rendering without custom wrapper components
   - Slot-based styling system for granular control
   - Better than single-label-only approaches

4. **Selection as First-Class Feature**
   - Built-in single/multiple selection modes
   - Automatic checkmark rendering
   - Distinction from dropdown menus (which are action-focused)
   - Purpose-built for selection workflows

5. **Keyboard Excellence**
   - Typeahead navigation (type to jump to items)
   - Full arrow key support with configurable wrapping
   - Home/End key support
   - Better than many custom implementations

6. **Sections with Visual Grouping**
   - First-class `ListboxSection` component
   - Optional dividers and headings
   - Dynamic sections with nested render functions
   - Unlike flat-only alternatives

7. **Tailwind-First Design**
   - Deep integration with Tailwind utilities
   - Slot-based customization system
   - Data attributes for state-based styling
   - No CSS-in-JS required

8. **Router-Agnostic**
   - `href` prop works with Next.js Link automatically
   - Can use with React Router via `onAction` callback
   - Not tied to specific routing solution

9. **Action vs Selection Separation**
   - `onAction` for immediate item activation
   - `onSelectionChange` for selection tracking
   - Can use independently or together
   - More flexible than single-callback approaches

### HeroUI vs Other Component Libraries

**vs. Material-UI List:**
- HeroUI: Tailwind-based, smaller bundle
- MUI: Emotion/styled-components, larger ecosystem

**vs. Chakra UI Select:**
- HeroUI: More opinionated with built-in styles
- Chakra: More flexible with style props approach

**vs. Radix UI Roving Tabindex:**
- HeroUI: Higher-level with selection built-in
- Radix: Lower-level primitives, more control

**vs. Ant Design Select:**
- HeroUI: Modern React patterns, smaller bundle
- Ant: Enterprise features, more components

**vs. HeadlessUI Listbox:**
- HeroUI: Styled by default, rapid development
- HeadlessUI: Unstyled primitives, full control

---

## Summary

The HeroUI Listbox component is a production-ready, accessibility-first list selection interface built on React Aria foundations. It excels at single and multi-selection workflows, large-dataset handling through virtualization, and keyboard-navigable interfaces with comprehensive accessibility support.

### Key Strengths

- **Excellent accessibility**: React Aria foundation ensures WCAG compliance
- **Keyboard excellence**: Full keyboard navigation with typeahead
- **Virtualization support**: Handles 10,000+ items efficiently
- **Flexible composition**: Rich content slots (title, description, icons)
- **Multiple selection modes**: None, single, multiple with proper state management
- **Tailwind integration**: Slot-based styling with data attributes
- **Visual variants**: 6 variants and 6 color themes
- **Sections and grouping**: First-class section support with optional dividers
- **Router integration**: Works with Next.js and React Router

### Recommended For

- Applications requiring accessible list selection interfaces
- Keyboard-first and keyboard-navigable UIs
- Large dataset handling (100+ items)
- Multiple selection workflows
- Permission matrices and role selection
- Search result displays
- Tailwind-based design systems
- Teams wanting minimal custom styling code

### Watch Out For

- Must use `Set` for selection state, not arrays
- Keys must be unique across all items
- Virtualization requires correct `itemHeight` configuration
- `aria-label` required if no visible label
- Listbox is for selection/action lists, not dropdown menus
- Disabled keys must reference valid item keys

### Best for Patterns

- **Bulk operations**: Select multiple items, then perform action
- **Filtering/searching**: Searchable list with keyboard navigation
- **Role selection**: Assign roles/permissions from scrollable list
- **Large data tables**: With virtualization for performance
- **Keyboard-only interfaces**: Full support without mouse
- **Complex selection**: Multi-select with sections and icons

---

**Research completed:** 2025-11-05
**Documentation source:** https://www.heroui.com/docs/components/listbox
**Component Type:** Accessible selection list with virtualization support

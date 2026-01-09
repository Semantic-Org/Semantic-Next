# Radix UI Primitives - DropdownMenu Usage Patterns

> **Framework**: Radix UI Primitives (Unstyled)
> **Component**: DropdownMenu
> **Version**: 2.1.16 (as of January 2025)
> **Official Documentation**: https://www.radix-ui.com/primitives/docs/components/dropdown-menu
> **Package**: `@radix-ui/react-dropdown-menu`
> **Last Verified**: 2025-01-04

---

## 1. Component Overview

The Radix UI DropdownMenu is an **unstyled primitive component** that provides a fully accessible dropdown menu implementation adhering to the WAI-ARIA Menu Button design pattern. Unlike styled component libraries, Radix Primitives focus entirely on behavior, accessibility, and functionality, leaving all visual styling to the developer. This primitive handles complex implementation details including ARIA attributes, focus management, keyboard navigation, collision detection, and layering behavior, while providing complete flexibility for custom styling through any CSS approach (vanilla CSS, CSS-in-JS, Tailwind, etc.).

The DropdownMenu displays a menu of items triggered by a button, supporting nested submenus, checkable items (checkbox and radio), item groups with labels, customizable positioning with collision handling, and both modal and non-modal modes. It's designed for command menus, action lists, and settings panels where users need to select from a list of options.

---

## 2. Installation & Setup

### Installation

```bash
npm install @radix-ui/react-dropdown-menu
```

### Basic Import

```javascript
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
```

### Alternative Named Imports

```javascript
import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
  Separator,
  // ... other parts
} from "@radix-ui/react-dropdown-menu";
```

---

## 3. Basic Usage

Since Radix Primitives are unstyled, you must add your own styling. Here's a minimal example with inline styles:

```jsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

function BasicDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button style={{ padding: "8px 16px", cursor: "pointer" }}>
          Click me
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "5px",
            boxShadow: "0 10px 38px -10px rgba(0, 0, 0, 0.35)",
            minWidth: "220px",
          }}
        >
          <DropdownMenu.Item
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            New Tab
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            New Window
          </DropdownMenu.Item>

          <DropdownMenu.Separator
            style={{
              height: "1px",
              backgroundColor: "#e5e5e5",
              margin: "5px",
            }}
          />

          <DropdownMenu.Item
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Close Tab
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

### With Tailwind CSS

```jsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Actions
    </button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 min-w-[220px]">
      <DropdownMenu.Item className="px-2 py-2 cursor-pointer hover:bg-gray-100 rounded">
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Item className="px-2 py-2 cursor-pointer hover:bg-gray-100 rounded">
        Duplicate
      </DropdownMenu.Item>
      <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
      <DropdownMenu.Item className="px-2 py-2 cursor-pointer hover:bg-red-100 text-red-600 rounded">
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

---

## 4. API/Props - Component Parts

### 4.1 DropdownMenu.Root

**Purpose**: Container for all parts of a dropdown menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Traps focus and blocks interaction outside when true |
| `dir` | `"ltr" \| "rtl"` | - | Reading direction for proper submenu positioning |

**Usage**:
```jsx
// Uncontrolled
<DropdownMenu.Root defaultOpen={false}>

// Controlled
const [open, setOpen] = useState(false);
<DropdownMenu.Root open={open} onOpenChange={setOpen}>
```

---

### 4.2 DropdownMenu.Trigger

**Purpose**: The button that toggles the dropdown menu (and serves as positioning anchor).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merges props with child element instead of rendering button |
| `disabled` | `boolean` | `false` | Prevents opening the menu |

**ARIA Attributes Applied**:
- `aria-controls` - References the Content `id`
- `aria-expanded` - Reflects open/closed state
- `aria-haspopup="menu"` - Indicates it controls a menu

**Usage**:
```jsx
// Default button wrapper
<DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>

// Use your own button element
<DropdownMenu.Trigger asChild>
  <button className="custom-button">Options</button>
</DropdownMenu.Trigger>
```

---

### 4.3 DropdownMenu.Portal

**Purpose**: Portals the Content (and SubContent) into the document body.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | `HTMLElement` | `document.body` | Target container for portaling |
| `forceMount` | `boolean` | `false` | Force mount for animation control |

**Usage**:
```jsx
// Default - portals to document.body
<DropdownMenu.Portal>
  <DropdownMenu.Content>...</DropdownMenu.Content>
</DropdownMenu.Portal>

// Custom container
<DropdownMenu.Portal container={customElement}>
  <DropdownMenu.Content>...</DropdownMenu.Content>
</DropdownMenu.Portal>
```

---

### 4.4 DropdownMenu.Content

**Purpose**: The container that appears when the menu is open. Contains all menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side relative to trigger |
| `sideOffset` | `number` | `0` | Distance in pixels from trigger along side axis |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger |
| `alignOffset` | `number` | `0` | Offset in pixels along alignment axis |
| `avoidCollisions` | `boolean` | `true` | Adjust position to avoid viewport collisions |
| `collisionBoundary` | `Element \| Element[]` | `[]` | Boundary elements for collision detection |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding from boundary edges |
| `sticky` | `"partial" \| "always"` | `"partial"` | Keeps content in view during scroll |
| `hideWhenDetached` | `boolean` | `false` | Hides content when trigger is fully occluded |
| `loop` | `boolean` | `false` | Whether keyboard navigation loops |
| `onCloseAutoFocus` | `(event: Event) => void` | - | Called when focus returns to trigger |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Called when Escape is pressed |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | - | Called on outside pointer down |
| `onInteractOutside` | `(event: InteractOutsideEvent) => void` | - | Called on outside interaction |
| `forceMount` | `boolean` | `false` | Force mount for animation control |

**Data Attributes** (runtime collision detection):
- `[data-side]` - Current side after collision adjustment (`top` | `right` | `bottom` | `left`)
- `[data-align]` - Current alignment after collision adjustment (`start` | `center` | `end`)
- `[data-state]` - Open/closed state (`open` | `closed`)

**CSS Custom Properties**:
- `--radix-dropdown-menu-content-transform-origin` - Origin for animations based on position
- `--radix-dropdown-menu-content-available-width` - Available width before collision
- `--radix-dropdown-menu-content-available-height` - Available height before collision
- `--radix-dropdown-menu-trigger-width` - Width of the trigger element
- `--radix-dropdown-menu-trigger-height` - Height of the trigger element

**Usage**:
```jsx
<DropdownMenu.Content
  side="right"
  align="start"
  sideOffset={5}
  className="menu-content"
>
  {/* items */}
</DropdownMenu.Content>
```

---

### 4.5 DropdownMenu.Item

**Purpose**: A selectable menu item that can execute an action.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Prevents interaction and keyboard focus |
| `onSelect` | `(event: Event) => void` | - | Called when item is selected (can prevent closing with `event.preventDefault()`) |
| `textValue` | `string` | - | Text for typeahead (auto-detected from content if not provided) |

**Data Attributes**:
- `[data-disabled]` - Present when `disabled={true}`
- `[data-highlighted]` - Present when keyboard-focused or hovered

**Usage**:
```jsx
<DropdownMenu.Item
  onSelect={() => console.log("Item selected")}
  className="menu-item"
>
  Delete
</DropdownMenu.Item>

<DropdownMenu.Item disabled className="menu-item">
  Disabled Item
</DropdownMenu.Item>

// Prevent menu from closing
<DropdownMenu.Item onSelect={(e) => {
  e.preventDefault();
  // perform action but keep menu open
}}>
  Keep Open
</DropdownMenu.Item>
```

---

### 4.6 DropdownMenu.CheckboxItem

**Purpose**: An item with checkbox-like behavior (can be checked/unchecked).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| "indeterminate"` | `false` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Called when checked state changes |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `onSelect` | `(event: Event) => void` | - | Called on selection (default prevents closing) |
| `textValue` | `string` | - | Text for typeahead |

**Data Attributes**:
- `[data-state]` - Checked state (`checked` | `unchecked` | `indeterminate`)
- `[data-disabled]` - Present when disabled
- `[data-highlighted]` - Present when focused/hovered

**Usage**:
```jsx
const [showUrls, setShowUrls] = useState(true);
const [showPeople, setShowPeople] = useState(false);

<DropdownMenu.CheckboxItem
  checked={showUrls}
  onCheckedChange={setShowUrls}
>
  <DropdownMenu.ItemIndicator>
    <CheckIcon />
  </DropdownMenu.ItemIndicator>
  Show URLs
</DropdownMenu.CheckboxItem>

<DropdownMenu.CheckboxItem
  checked={showPeople}
  onCheckedChange={setShowPeople}
>
  <DropdownMenu.ItemIndicator>
    <CheckIcon />
  </DropdownMenu.ItemIndicator>
  Show People
</DropdownMenu.CheckboxItem>
```

---

### 4.7 DropdownMenu.RadioGroup

**Purpose**: Groups radio items for single-selection behavior.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Called when value changes |

**Usage**:
```jsx
const [color, setColor] = useState("blue");

<DropdownMenu.RadioGroup value={color} onValueChange={setColor}>
  <DropdownMenu.RadioItem value="red">
    <DropdownMenu.ItemIndicator>
      <DotFilledIcon />
    </DropdownMenu.ItemIndicator>
    Red
  </DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="blue">
    <DropdownMenu.ItemIndicator>
      <DotFilledIcon />
    </DropdownMenu.ItemIndicator>
    Blue
  </DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

---

### 4.8 DropdownMenu.RadioItem

**Purpose**: A selectable item within a RadioGroup (mutually exclusive selection).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required**. Unique value for this item |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `onSelect` | `(event: Event) => void` | - | Called on selection (default prevents closing) |
| `textValue` | `string` | - | Text for typeahead |

**Data Attributes**:
- `[data-state]` - Selection state (`checked` | `unchecked`)
- `[data-disabled]` - Present when disabled
- `[data-highlighted]` - Present when focused/hovered

---

### 4.9 DropdownMenu.ItemIndicator

**Purpose**: Renders an indicator (checkmark, dot) when parent CheckboxItem or RadioItem is checked.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceMount` | `boolean` | `false` | Force mount for animation control |

**Usage**:
```jsx
<DropdownMenu.CheckboxItem checked={isChecked}>
  <DropdownMenu.ItemIndicator>
    <CheckIcon /> {/* Only visible when checked */}
  </DropdownMenu.ItemIndicator>
  Enable Feature
</DropdownMenu.CheckboxItem>
```

---

### 4.10 DropdownMenu.Group

**Purpose**: Groups related items together (semantic grouping).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (structural only) |

**Usage**:
```jsx
<DropdownMenu.Group>
  <DropdownMenu.Label>Edit</DropdownMenu.Label>
  <DropdownMenu.Item>Cut</DropdownMenu.Item>
  <DropdownMenu.Item>Copy</DropdownMenu.Item>
  <DropdownMenu.Item>Paste</DropdownMenu.Item>
</DropdownMenu.Group>
```

---

### 4.11 DropdownMenu.Label

**Purpose**: Displays a label for a section of items (not focusable with keyboard).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (text content) |

**Usage**:
```jsx
<DropdownMenu.Label>Tools</DropdownMenu.Label>
<DropdownMenu.Item>Spell Check</DropdownMenu.Item>
<DropdownMenu.Item>Grammar Check</DropdownMenu.Item>
```

---

### 4.12 DropdownMenu.Separator

**Purpose**: Visual separator between menu items or groups.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| - | - | - | No props (visual only) |

**Usage**:
```jsx
<DropdownMenu.Item>Save</DropdownMenu.Item>
<DropdownMenu.Separator className="h-px bg-gray-300 my-1" />
<DropdownMenu.Item>Close</DropdownMenu.Item>
```

---

### 4.13 DropdownMenu.Arrow

**Purpose**: Optional visual arrow pointing to the trigger.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `10` | Arrow width in pixels |
| `height` | `number` | `5` | Arrow height in pixels |
| `asChild` | `boolean` | `false` | Use custom element as arrow |

**Usage**:
```jsx
<DropdownMenu.Content>
  <DropdownMenu.Arrow className="fill-white" />
  {/* items */}
</DropdownMenu.Content>
```

---

### 4.14 DropdownMenu.Sub

**Purpose**: Container for a submenu (nested menu).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

**Usage**:
```jsx
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>More Options</DropdownMenu.SubTrigger>
  <DropdownMenu.Portal>
    <DropdownMenu.SubContent>
      <DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
      <DropdownMenu.Item>Sub Item 2</DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Portal>
</DropdownMenu.Sub>
```

---

### 4.15 DropdownMenu.SubTrigger

**Purpose**: Item that opens a submenu (must be inside Sub).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Prevents opening submenu |
| `textValue` | `string` | - | Text for typeahead |

**Data Attributes**:
- `[data-state]` - Submenu state (`open` | `closed`)
- `[data-disabled]` - Present when disabled
- `[data-highlighted]` - Present when focused/hovered

**Usage**:
```jsx
<DropdownMenu.SubTrigger>
  More Tools
  <ChevronRightIcon /> {/* Convention: indicate submenu */}
</DropdownMenu.SubTrigger>
```

---

### 4.16 DropdownMenu.SubContent

**Purpose**: The content/container for submenu items.

Inherits all props from `DropdownMenu.Content` (see section 4.4).

**Additional Behavior**:
- Automatically positions relative to SubTrigger
- Default positioning differs (typically right/left based on reading direction)

---

## 5. Component Composition

### 5.1 Basic Structure

```jsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Label />
      <DropdownMenu.Item />
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem />
      <DropdownMenu.RadioGroup>
        <DropdownMenu.RadioItem />
      </DropdownMenu.RadioGroup>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger />
        <DropdownMenu.SubContent />
      </DropdownMenu.Sub>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### 5.2 Complete Example with All Features

```jsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons";

function AdvancedDropdown() {
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showUrls, setShowUrls] = useState(false);
  const [person, setPerson] = useState("pedro");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="trigger-button">Options</button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="content" sideOffset={5}>
          <DropdownMenu.Item className="item">
            New Tab <div className="shortcut">⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="item">
            New Window <div className="shortcut">⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="item" disabled>
            New Private Window <div className="shortcut">⇧+⌘+N</div>
          </DropdownMenu.Item>

          {/* Submenu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="subtrigger">
              More Tools
              <ChevronRightIcon />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="subcontent" sideOffset={2} alignOffset={-5}>
                <DropdownMenu.Item className="item">
                  Save Page As… <div className="shortcut">⌘+S</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="item">Create Shortcut…</DropdownMenu.Item>
                <DropdownMenu.Item className="item">Name Window…</DropdownMenu.Item>
                <DropdownMenu.Separator className="separator" />
                <DropdownMenu.Item className="item">Developer Tools</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="separator" />

          {/* Checkbox Items */}
          <DropdownMenu.CheckboxItem
            className="checkbox-item"
            checked={showBookmarks}
            onCheckedChange={setShowBookmarks}
          >
            <DropdownMenu.ItemIndicator className="indicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Bookmarks <div className="shortcut">⌘+B</div>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            className="checkbox-item"
            checked={showUrls}
            onCheckedChange={setShowUrls}
          >
            <DropdownMenu.ItemIndicator className="indicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Full URLs
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className="separator" />

          {/* Radio Group */}
          <DropdownMenu.Label className="label">People</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenu.RadioItem className="radio-item" value="pedro">
              <DropdownMenu.ItemIndicator className="indicator">
                <DotFilledIcon />
              </DropdownMenu.ItemIndicator>
              Pedro Duarte
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem className="radio-item" value="colm">
              <DropdownMenu.ItemIndicator className="indicator">
                <DotFilledIcon />
              </DropdownMenu.ItemIndicator>
              Colm Tuite
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Arrow className="arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

---

## 6. State Management

### 6.1 Uncontrolled (Default)

The dropdown manages its own open/closed state internally:

```jsx
<DropdownMenu.Root defaultOpen={false}>
  <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    {/* items */}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### 6.2 Controlled

You manage the open state externally:

```jsx
const [open, setOpen] = useState(false);

<DropdownMenu.Root open={open} onOpenChange={setOpen}>
  <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    {/* items */}
  </DropdownMenu.Content>
</DropdownMenu.Root>

// External control
<button onClick={() => setOpen(true)}>Open from outside</button>
```

### 6.3 Hover-Triggered (Custom Pattern)

```jsx
const [open, setOpen] = useState(false);

<DropdownMenu.Root open={open} onOpenChange={setOpen}>
  <DropdownMenu.Trigger asChild>
    <button
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      Hover Me
    </button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
  >
    {/* items */}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### 6.4 Data Attributes for State-Based Styling

All stateful components expose their state via `data-*` attributes:

```css
/* Style based on open state */
[data-state="open"] {
  background: lightblue;
}

[data-state="closed"] {
  background: gray;
}

/* Style disabled items */
[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

/* Style highlighted (focused/hovered) items */
[data-highlighted] {
  background: lightgray;
}

/* Style checked items */
[data-state="checked"] .indicator {
  display: block;
}

[data-state="unchecked"] .indicator {
  display: none;
}
```

---

## 7. Styling Approaches

Since Radix Primitives are completely unstyled, you have full flexibility in how you style them.

### 7.1 Vanilla CSS

```css
/* styles.css */
.dropdown-trigger {
  padding: 8px 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-content {
  background: white;
  border-radius: 6px;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
  min-width: 220px;
}

.dropdown-item {
  padding: 8px;
  cursor: pointer;
  border-radius: 3px;
  user-select: none;
}

.dropdown-item[data-highlighted] {
  background: #f0f0f0;
  outline: none;
}

.dropdown-item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

.dropdown-separator {
  height: 1px;
  background: #e5e5e5;
  margin: 5px;
}
```

```jsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger className="dropdown-trigger">
    Menu
  </DropdownMenu.Trigger>
  <DropdownMenu.Content className="dropdown-content">
    <DropdownMenu.Item className="dropdown-item">Item 1</DropdownMenu.Item>
    <DropdownMenu.Separator className="dropdown-separator" />
    <DropdownMenu.Item className="dropdown-item">Item 2</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### 7.2 Tailwind CSS

#### Option A: Direct Data Attribute Selectors (Modern)

```jsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Menu
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-1 min-w-[220px]">
      <DropdownMenu.Item className="px-2 py-2 text-sm rounded cursor-pointer outline-none data-[highlighted]:bg-gray-100 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none">
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Item className="px-2 py-2 text-sm rounded cursor-pointer outline-none data-[highlighted]:bg-gray-100">
        Duplicate
      </DropdownMenu.Item>
      <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
      <DropdownMenu.Item className="px-2 py-2 text-sm rounded cursor-pointer outline-none data-[highlighted]:bg-red-50 text-red-600">
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

#### Option B: tailwindcss-radix Plugin

Install: `npm install tailwindcss-radix`

Configure `tailwind.config.js`:
```javascript
module.exports = {
  plugins: [require("tailwindcss-radix")],
};
```

Usage:
```jsx
<DropdownMenu.Item className="px-2 py-2 radix-highlighted:bg-gray-100 radix-disabled:opacity-50">
  Item
</DropdownMenu.Item>

<DropdownMenu.Content className="radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down">
  {/* items */}
</DropdownMenu.Content>
```

### 7.3 CSS-in-JS (styled-components, emotion)

```jsx
import styled from "styled-components";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const StyledTrigger = styled(DropdownMenu.Trigger)`
  padding: 8px 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0051cc;
  }
`;

const StyledContent = styled(DropdownMenu.Content)`
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 10px 38px -10px rgba(0, 0, 0, 0.35);
  min-width: 220px;
`;

const StyledItem = styled(DropdownMenu.Item)`
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;

  &[data-highlighted] {
    background: #f5f5f5;
    outline: none;
  }

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
`;

function StyledDropdown() {
  return (
    <DropdownMenu.Root>
      <StyledTrigger>Options</StyledTrigger>
      <DropdownMenu.Portal>
        <StyledContent>
          <StyledItem>Edit</StyledItem>
          <StyledItem>Delete</StyledItem>
        </StyledContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

### 7.4 Collision-Aware Animations

Use data attributes and CSS custom properties for position-aware animations:

```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-content[data-state="open"][data-side="top"] {
  animation: slideUp 0.2s ease-out;
}

.dropdown-content[data-state="open"][data-side="bottom"] {
  animation: slideDown 0.2s ease-out;
}

/* Using transform-origin custom property */
.dropdown-content {
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 8. Accessibility

Radix UI DropdownMenu is built with accessibility as a core principle and fully implements the WAI-ARIA Menu Button pattern.

### 8.1 ARIA Attributes (Automatically Applied)

**Trigger**:
- `role="button"` (if not using native button)
- `aria-haspopup="menu"`
- `aria-expanded="true|false"` - Reflects open state
- `aria-controls="content-id"` - References Content element

**Content**:
- `role="menu"`
- `id="content-id"` - Required for `aria-controls` relationship

**Items**:
- `role="menuitem"`
- `tabindex="-1"` - Managed by roving tabindex
- `aria-disabled="true"` - When disabled

**CheckboxItem**:
- `role="menuitemcheckbox"`
- `aria-checked="true|false|mixed"` - Reflects checked state

**RadioItem**:
- `role="menuitemradio"`
- `aria-checked="true|false"` - Reflects selection

**RadioGroup**:
- `role="group"`

**Label**:
- No role (presentational text)

**Separator**:
- `role="separator"`
- `aria-orientation="horizontal"`

### 8.2 Keyboard Navigation

Radix handles all keyboard interactions automatically:

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Opens menu (when Trigger focused) |
| `ArrowDown` | Moves focus to next item (or first if none focused) |
| `ArrowUp` | Moves focus to previous item (or last if none focused) |
| `ArrowRight` | Opens submenu (when SubTrigger focused) |
| `ArrowLeft` | Closes submenu and returns to parent |
| `Home` / `End` | Moves focus to first/last item |
| `Esc` | Closes menu and returns focus to Trigger |
| `A-Z` | Typeahead: jumps to item starting with typed character |
| `Space` / `Enter` | Selects focused item and closes menu |

**Typeahead**: Automatically implemented using item text content (or `textValue` prop).

### 8.3 Focus Management

- **Auto-focus**: When menu opens, focus moves to first item (or last if opened with `ArrowUp`)
- **Roving tabindex**: Only one item is focusable at a time (active item has `tabindex="0"`, others have `tabindex="-1"`)
- **Focus trapping** (modal mode): Focus cannot leave menu until closed
- **Focus return**: When menu closes, focus returns to Trigger (customizable via `onCloseAutoFocus`)

### 8.4 Modal vs Non-Modal

**Modal mode** (`modal={true}`, default):
- Traps focus within menu
- Blocks interaction with content outside menu
- Dismisses on outside click
- Recommended for most use cases

**Non-modal mode** (`modal={false}`):
- Allows focus to move outside menu
- Does not block interaction with page
- Menu stays open until explicitly closed or item selected
- Use for persistent menus or special UX requirements

```jsx
<DropdownMenu.Root modal={false}>
  {/* Menu stays open, allows interaction outside */}
</DropdownMenu.Root>
```

### 8.5 Screen Reader Announcements

Radix ensures proper announcements through:
- Correct ARIA roles and states
- Dynamic `aria-expanded` updates
- `aria-checked` for checkbox/radio items
- Proper labeling via `aria-controls` relationship

---

## 9. Best Practices

### 9.1 When to Use Primitives vs Themes

**Use Radix Primitives (this component) when**:
- Building a custom design system from scratch
- You need complete control over styling
- You want flexibility in CSS approach (Tailwind, CSS-in-JS, vanilla CSS, etc.)
- You're implementing brand-specific designs
- You need to match existing design tokens

**Use Radix Themes DropdownMenu when**:
- You want professionally-designed components out of the box
- You need to ship quickly without custom styling
- You're building prototypes or internal tools
- You're comfortable with limited customization options
- You want a cohesive theme system across all components

**Key difference**: Primitives = 100% behavior, 0% style. Themes = behavior + styled components + theme system.

### 9.2 Composition Patterns

#### Pattern 1: Keep Menu Open on Selection

```jsx
<DropdownMenu.Item
  onSelect={(event) => {
    event.preventDefault(); // Prevents menu from closing
    // Perform action
  }}
>
  Action that keeps menu open
</DropdownMenu.Item>
```

#### Pattern 2: Programmatic Control

```jsx
const [open, setOpen] = useState(false);

// Open from external trigger
<button onClick={() => setOpen(true)}>Open Menu</button>

<DropdownMenu.Root open={open} onOpenChange={setOpen}>
  {/* menu */}
</DropdownMenu.Root>
```

#### Pattern 3: Nested Submenus

```jsx
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>Level 1</DropdownMenu.SubTrigger>
  <DropdownMenu.Portal>
    <DropdownMenu.SubContent>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Level 2</DropdownMenu.SubTrigger>
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Level 2 Item</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
    </DropdownMenu.SubContent>
  </DropdownMenu.Portal>
</DropdownMenu.Sub>
```

#### Pattern 4: Mixed Content Types

```jsx
<DropdownMenu.Content>
  {/* Regular items */}
  <DropdownMenu.Item>Action 1</DropdownMenu.Item>

  {/* Checkboxes */}
  <DropdownMenu.Separator />
  <DropdownMenu.CheckboxItem checked={flag1} onCheckedChange={setFlag1}>
    Option 1
  </DropdownMenu.CheckboxItem>

  {/* Radio group */}
  <DropdownMenu.Separator />
  <DropdownMenu.Label>Choose One</DropdownMenu.Label>
  <DropdownMenu.RadioGroup value={choice} onValueChange={setChoice}>
    <DropdownMenu.RadioItem value="a">Choice A</DropdownMenu.RadioItem>
    <DropdownMenu.RadioItem value="b">Choice B</DropdownMenu.RadioItem>
  </DropdownMenu.RadioGroup>

  {/* Submenu */}
  <DropdownMenu.Separator />
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
    <DropdownMenu.SubContent>
      <DropdownMenu.Item>Nested Item</DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
</DropdownMenu.Content>
```

### 9.3 Styling Best Practices

1. **Use data attributes for state-based styling**:
   ```css
   [data-highlighted] { background: lightgray; }
   [data-disabled] { opacity: 0.5; }
   [data-state="checked"] .indicator { display: block; }
   ```

2. **Leverage CSS custom properties for animations**:
   ```css
   .content {
     transform-origin: var(--radix-dropdown-menu-content-transform-origin);
   }
   ```

3. **Ensure sufficient contrast for accessibility**:
   - Text vs background should meet WCAG AA standards (4.5:1 minimum)
   - Use clear visual indicators for focused/hovered states

4. **Make click/touch targets at least 44×44px** for mobile usability

5. **Use Portal for proper z-index stacking**:
   ```jsx
   <DropdownMenu.Portal>
     <DropdownMenu.Content>
       {/* Rendered outside React tree, avoids z-index issues */}
     </DropdownMenu.Content>
   </DropdownMenu.Portal>
   ```

### 9.4 Performance Considerations

1. **Use `asChild` to avoid wrapper elements**:
   ```jsx
   // Renders <button> directly, not <button><button></button></button>
   <DropdownMenu.Trigger asChild>
     <button>Menu</button>
   </DropdownMenu.Trigger>
   ```

2. **Memoize item lists** if they're expensive to compute:
   ```jsx
   const items = useMemo(() => generateItems(), [dependencies]);
   ```

3. **Use `forceMount` for complex animations** (but be aware of performance impact):
   ```jsx
   <DropdownMenu.Content forceMount>
     {/* Always mounted in DOM, use CSS for show/hide */}
   </DropdownMenu.Content>
   ```

---

## 10. Comparison Notes: Primitives vs Other Approaches

### Radix Primitives Philosophy

**Unstyled Components**:
- Radix Primitives provide zero styling out of the box
- Complete separation of behavior and presentation
- Maximum flexibility for design systems

**Behavior-First Design**:
- Focus on accessibility, keyboard navigation, ARIA attributes
- Solves complex implementation challenges (focus management, collision detection, layering)
- Developers add styling via any CSS approach they prefer

### vs. Styled Component Libraries

**Styled Libraries** (Material-UI, Ant Design, Chakra UI):
- Provide pre-styled components with themes
- Faster initial development
- Limited customization (override styles via props/theme)
- Risk of "framework look" without extensive customization

**Radix Primitives**:
- No default styling (must style everything)
- Slower initial development, faster long-term iteration
- Complete customization freedom
- Creates unique, branded experiences
- Smaller bundle size (no style dependencies)

### vs. Radix Themes

**Radix Themes**:
- Built on top of Radix Primitives
- Provides styled components with a theme system
- Limited customization via theme tokens
- Not a styling system for Primitives (different component API)

**When to choose**:
- **Primitives**: Custom design system, unique branding, full control
- **Themes**: Quick prototyping, internal tools, prefer pre-styled

### vs. Headless UI / React ARIA

**Similar Philosophy**:
- All three provide unstyled, accessible components
- Focus on behavior and accessibility over styling

**Differences**:
- **Radix**: Rich component composition (Portal, Arrow, Sub, etc.)
- **Headless UI**: Simpler API, Tailwind-first approach
- **React ARIA**: Lower-level hooks, maximum flexibility, Adobe-backed

**Radix DropdownMenu advantages**:
- More granular component parts (Label, Separator, Group, ItemIndicator)
- Built-in collision detection and positioning
- Portal support out of the box
- Rich data attributes for styling

---

## Key Takeaways

1. **Unstyled Primitive**: Radix DropdownMenu provides behavior and accessibility; you provide all styling.

2. **Comprehensive Composition**: 16+ component parts (Root, Trigger, Content, Item, CheckboxItem, RadioItem, Sub, etc.) for complex menu structures.

3. **Accessibility Built-In**: Full WAI-ARIA Menu Button compliance, keyboard navigation, focus management, and screen reader support.

4. **Flexible Positioning**: Sophisticated collision detection with `side`, `align`, `sideOffset`, `alignOffset`, and runtime data attributes.

5. **State Management**: Both controlled and uncontrolled modes; rich data attributes (`data-state`, `data-highlighted`, `data-disabled`) for styling.

6. **Styling Freedom**: Use vanilla CSS, Tailwind, CSS-in-JS, or any approach; leverage data attributes and CSS custom properties.

7. **Best for Custom Design Systems**: Choose Primitives when you need complete control; choose Themes for pre-styled components.

8. **Rich Feature Set**: Supports submenus, checkbox/radio items, groups, labels, separators, arrows, and custom positioning.

---

## Additional Resources

- **Official Documentation**: https://www.radix-ui.com/primitives/docs/components/dropdown-menu
- **npm Package**: https://www.npmjs.com/package/@radix-ui/react-dropdown-menu
- **GitHub Repository**: https://github.com/radix-ui/primitives
- **CodeSandbox Examples**: https://codesandbox.io/examples/package/@radix-ui/react-dropdown-menu
- **tailwindcss-radix Plugin**: https://www.npmjs.com/package/tailwindcss-radix
- **WAI-ARIA Menu Button Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

# ShadCN DropdownMenu - Usage Pattern Report

## 1. Component Overview

The ShadCN DropdownMenu is a composable menu component system that displays a list of actions or functions triggered by a button. Built on top of Radix UI's dropdown menu primitives, it provides accessible, customizable menu functionality with full keyboard navigation and flexible composition patterns.

**Key Characteristic**: ShadCN uses a **copy-paste distribution model** rather than traditional npm package installation. Components are copied directly into your project's codebase (typically at `@/components/ui/`), allowing full customization and ownership of the code while maintaining consistency through the CLI tooling.

## 2. Installation/Setup

### CLI Installation (Recommended)

ShadCN provides a CLI tool to add components to your project:

```bash
pnpm dlx shadcn@latest add dropdown-menu
```

This command will:
- Copy the DropdownMenu component files into your project at `@/components/ui/dropdown-menu.tsx`
- Install required dependencies (`@radix-ui/react-dropdown-menu`)
- Configure TypeScript paths if needed

### Manual Installation

Alternatively, you can manually copy the component code:

1. Install the Radix UI dependency:
```bash
npm install @radix-ui/react-dropdown-menu
```

2. Copy the component code from the ShadCN documentation into your project at `@/components/ui/dropdown-menu.tsx`

3. Update your `tailwind.config.js` to include the component paths

### Dependencies

- **@radix-ui/react-dropdown-menu** - Core primitive implementation
- **React** (16.8+) - Hooks support required
- **Tailwind CSS** - For styling
- **class-variance-authority** (optional) - For variant management
- **clsx** or **tailwind-merge** - For className merging

### Import Usage

Once installed, import the component parts:

```javascript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
```

## 3. Basic Usage

### Minimal Example

```jsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Key Points**:
- `DropdownMenu` is the root container component
- `DropdownMenuTrigger` wraps the button that opens the menu (use `asChild` to render as your custom button)
- `DropdownMenuContent` contains all menu items
- `DropdownMenuItem` represents individual clickable items

### Standard Example with Labels and Separators

```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Profile
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Billing
      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Settings
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 4. Props/API

### DropdownMenu (Root)

The root container component that manages state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Whether the menu should be modal (blocks interaction with outside content) |
| `dir` | `"ltr" \| "rtl"` | - | Reading direction for layout |

### DropdownMenuTrigger

The button that toggles the dropdown menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Renders the trigger as the child element instead of wrapping it |
| `disabled` | `boolean` | `false` | Whether the trigger is disabled |

### DropdownMenuContent

The container for menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment relative to trigger |
| `alignOffset` | `number` | `0` | Offset in pixels along the align axis |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side of the trigger to render against |
| `sideOffset` | `number` | `0` | Distance in pixels from the trigger |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding from viewport edges for collision detection |
| `avoidCollisions` | `boolean` | `true` | Whether to prevent the content from overflowing viewport |
| `className` | `string` | - | Additional CSS classes |
| `loop` | `boolean` | `false` | Whether keyboard navigation should loop |
| `forceMount` | `boolean` | `false` | Force mounting even when closed |

### DropdownMenuItem

An individual menu item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `onSelect` | `(event: Event) => void` | - | Callback when item is selected |
| `textValue` | `string` | - | Text value for typeahead functionality |
| `inset` | `boolean` | `false` | Adds left padding (ShadCN-specific) |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuLabel

A label for grouping menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Adds left padding (ShadCN-specific) |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuSeparator

A visual separator between menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuShortcut

Displays keyboard shortcuts (visual only, doesn't implement functionality).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Shortcut text to display |

### DropdownMenuGroup

Groups related menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Menu items to group |

### DropdownMenuCheckboxItem

A menu item with checkbox functionality.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| "indeterminate"` | `false` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `textValue` | `string` | - | Text value for typeahead |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuRadioGroup

Container for radio button menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when value changes |

### DropdownMenuRadioItem

A radio button menu item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The value of this radio item |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuSub

Container for a submenu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### DropdownMenuSubTrigger

Trigger for opening a submenu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Whether the trigger is disabled |
| `inset` | `boolean` | `false` | Adds left padding (ShadCN-specific) |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuSubContent

Content container for a submenu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| (inherits positioning props from `DropdownMenuContent`) | - | - | Same positioning API as main content |

### DropdownMenuPortal

Portal component for rendering content in a different part of the DOM.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | `HTMLElement` | `document.body` | Container to portal into |
| `forceMount` | `boolean` | `false` | Force mounting even when closed |

## 5. Underlying Implementation

### Radix UI Primitives Used

The ShadCN DropdownMenu is a styled wrapper around **@radix-ui/react-dropdown-menu**, which provides the core functionality:

- **Radix Dropdown.Root** → `DropdownMenu`
- **Radix Dropdown.Trigger** → `DropdownMenuTrigger`
- **Radix Dropdown.Content** → `DropdownMenuContent`
- **Radix Dropdown.Item** → `DropdownMenuItem`
- **Radix Dropdown.Label** → `DropdownMenuLabel`
- **Radix Dropdown.Separator** → `DropdownMenuSeparator`
- **Radix Dropdown.CheckboxItem** → `DropdownMenuCheckboxItem`
- **Radix Dropdown.RadioGroup** → `DropdownMenuRadioGroup`
- **Radix Dropdown.RadioItem** → `DropdownMenuRadioItem`
- **Radix Dropdown.Sub** → `DropdownMenuSub`
- **Radix Dropdown.SubTrigger** → `DropdownMenuSubTrigger`
- **Radix Dropdown.SubContent** → `DropdownMenuSubContent`
- **Radix Dropdown.Portal** → `DropdownMenuPortal`
- **Radix Dropdown.Group** → `DropdownMenuGroup`

### Structure and Composition

The component follows a **compound component pattern** where multiple sub-components work together:

```
DropdownMenu (Root - State Management)
└── DropdownMenuTrigger (Button)
└── DropdownMenuContent (Portal + Positioning)
    ├── DropdownMenuLabel (Section Header)
    ├── DropdownMenuSeparator (Visual Divider)
    ├── DropdownMenuGroup (Logical Grouping)
    │   └── DropdownMenuItem (Action)
    │       └── DropdownMenuShortcut (Visual Only)
    ├── DropdownMenuCheckboxItem (Stateful Item)
    ├── DropdownMenuRadioGroup (Radio Container)
    │   └── DropdownMenuRadioItem (Radio Option)
    └── DropdownMenuSub (Nested Menu)
        ├── DropdownMenuSubTrigger (Submenu Trigger)
        └── DropdownMenuSubContent (Submenu Items)
```

### How It's Built

1. **Radix Primitives**: Provide headless, accessible foundation with state management, keyboard navigation, focus management, and ARIA attributes
2. **Tailwind Styling**: ShadCN adds Tailwind CSS classes for visual design
3. **React.forwardRef**: Components use `forwardRef` for proper ref forwarding
4. **Slot Pattern**: Uses `asChild` prop (via Radix Slot) to merge props with child components
5. **CSS Variables**: Uses CSS custom properties for theming integration
6. **Portal Rendering**: Content renders outside DOM hierarchy to avoid z-index issues

## 6. Variants & Patterns

### Menu Items

**Standard Item**:
```jsx
<DropdownMenuItem>Edit</DropdownMenuItem>
```

**Item with Icon**:
```jsx
<DropdownMenuItem>
  <User className="mr-2 h-4 w-4" />
  <span>Profile</span>
</DropdownMenuItem>
```

**Disabled Item**:
```jsx
<DropdownMenuItem disabled>Archive</DropdownMenuItem>
```

**Destructive Action**:
```jsx
<DropdownMenuItem className="text-red-600">
  <Trash className="mr-2 h-4 w-4" />
  <span>Delete</span>
</DropdownMenuItem>
```

### Labels and Separators

**Section Label**:
```jsx
<DropdownMenuLabel>My Account</DropdownMenuLabel>
```

**Separator**:
```jsx
<DropdownMenuSeparator />
```

**Inset Label** (aligned with items that have icons):
```jsx
<DropdownMenuLabel inset>More Tools</DropdownMenuLabel>
```

### Shortcuts and Icons

**Item with Shortcut**:
```jsx
<DropdownMenuItem>
  Save
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
```

**Item with Icon and Shortcut**:
```jsx
<DropdownMenuItem>
  <Save className="mr-2 h-4 w-4" />
  <span>Save</span>
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
```

### Checkboxes

**Checkbox Items with State**:
```jsx
import { useState } from "react"

function MenuWithCheckboxes() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          disabled
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Radio Items

**Radio Group Pattern**:
```jsx
import { useState } from "react"

function MenuWithRadio() {
  const [position, setPosition] = useState("bottom")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Position</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Sub-menus

**Nested Menu Pattern**:
```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      <span>Profile</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <UserPlus className="mr-2 h-4 w-4" />
        <span>Invite users</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Message</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>More...</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

### Inset Items

**Inset Pattern** (for alignment when mixing items with/without icons):
```jsx
<DropdownMenuContent>
  <DropdownMenuItem>
    <User className="mr-2 h-4 w-4" />
    <span>Profile</span>
  </DropdownMenuItem>
  <DropdownMenuItem>
    <Settings className="mr-2 h-4 w-4" />
    <span>Settings</span>
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuLabel inset>Team</DropdownMenuLabel>
  <DropdownMenuItem inset>Invite users</DropdownMenuItem>
  <DropdownMenuItem inset>New Team</DropdownMenuItem>
</DropdownMenuContent>
```

### Destructive Actions

**Destructive Item Pattern**:
```jsx
<DropdownMenuContent>
  <DropdownMenuItem>Edit</DropdownMenuItem>
  <DropdownMenuItem>Duplicate</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
    <Trash className="mr-2 h-4 w-4" />
    <span>Delete</span>
    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
  </DropdownMenuItem>
</DropdownMenuContent>
```

## 7. Composition Patterns

### All Component Parts and Their Roles

**DropdownMenu (Root Container)**
- **Purpose**: Manages open/closed state for the entire dropdown
- **Children**: Must contain exactly one `DropdownMenuTrigger` and one `DropdownMenuContent`
- **State Management**: Controls whether menu is open via `open`/`onOpenChange` or `defaultOpen`

**DropdownMenuTrigger**
- **Purpose**: The interactive element that opens/closes the menu
- **Usage**: Wrap a button or use `asChild` to merge with child component
- **Relationship**: Automatically associates with content via Radix context

**DropdownMenuContent**
- **Purpose**: Container for all menu items, rendered in a portal
- **Children**: Any combination of items, labels, separators, groups, and submenus
- **Positioning**: Controls alignment, side, and collision detection relative to trigger

**DropdownMenuItem**
- **Purpose**: Individual clickable action
- **Behavior**: Closes menu on click by default (unless prevented)
- **Flexibility**: Can contain any content (text, icons, shortcuts)

**DropdownMenuLabel**
- **Purpose**: Non-interactive section header
- **Usage**: Visually groups related items
- **Accessibility**: Properly labeled for screen readers

**DropdownMenuSeparator**
- **Purpose**: Visual divider between menu sections
- **Usage**: Improves scanability and grouping
- **Accessibility**: Announced as separator by screen readers

**DropdownMenuShortcut**
- **Purpose**: Displays keyboard shortcut hint
- **Behavior**: Visual only - does not implement keyboard functionality
- **Styling**: Typically right-aligned with reduced opacity

**DropdownMenuGroup**
- **Purpose**: Logical grouping of related items
- **Accessibility**: May be announced as group by screen readers
- **Styling**: No visual change by default

**DropdownMenuCheckboxItem**
- **Purpose**: Toggleable menu item with checkbox
- **State**: Manages checked state independently or controlled
- **Usage**: For multi-select options (show/hide features, filters)

**DropdownMenuRadioGroup**
- **Purpose**: Container for mutually exclusive radio options
- **State**: Manages single selected value
- **Children**: Contains `DropdownMenuRadioItem` components

**DropdownMenuRadioItem**
- **Purpose**: Single option in a radio group
- **State**: Selected based on group's value
- **Usage**: For single-select options (themes, positions, modes)

**DropdownMenuSub**
- **Purpose**: Container for nested submenu
- **State**: Manages open/closed state for submenu
- **Children**: Contains `DropdownMenuSubTrigger` and `DropdownMenuSubContent`

**DropdownMenuSubTrigger**
- **Purpose**: Menu item that opens a submenu
- **Behavior**: Shows indicator icon, opens submenu on hover/click
- **Relationship**: Works with `DropdownMenuSubContent` in same `DropdownMenuSub`

**DropdownMenuSubContent**
- **Purpose**: Content container for submenu items
- **Rendering**: Usually wrapped in `DropdownMenuPortal` for proper stacking
- **Positioning**: Automatically positions relative to trigger

**DropdownMenuPortal**
- **Purpose**: Renders children in a different part of the DOM
- **Usage**: Prevents z-index and overflow issues
- **Default**: Renders to document.body

### Composition Hierarchy

```
DropdownMenu
├─ DropdownMenuTrigger (required, exactly one)
└─ DropdownMenuContent (required, exactly one)
   ├─ DropdownMenuLabel (optional, multiple)
   ├─ DropdownMenuSeparator (optional, multiple)
   ├─ DropdownMenuGroup (optional, multiple)
   │  └─ DropdownMenuItem (multiple)
   │     └─ DropdownMenuShortcut (optional)
   ├─ DropdownMenuItem (optional, multiple)
   │  └─ DropdownMenuShortcut (optional)
   ├─ DropdownMenuCheckboxItem (optional, multiple)
   ├─ DropdownMenuRadioGroup (optional, multiple)
   │  └─ DropdownMenuRadioItem (multiple)
   └─ DropdownMenuSub (optional, multiple)
      ├─ DropdownMenuSubTrigger (required in sub)
      └─ DropdownMenuPortal (recommended)
         └─ DropdownMenuSubContent (required in sub)
            └─ (any menu items)
```

## 8. Styling & Theming

### Tailwind Classes

ShadCN components use Tailwind utility classes extensively. The DropdownMenu components have predefined classes that can be extended:

**Content Styling**:
```jsx
<DropdownMenuContent className="w-56 bg-popover text-popover-foreground">
  {/* items */}
</DropdownMenuContent>
```

**Item Styling**:
```jsx
<DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">
  Item
</DropdownMenuItem>
```

**Custom Width**:
```jsx
<DropdownMenuContent className="w-64">
  {/* wider menu */}
</DropdownMenuContent>
```

### CSS Variables

ShadCN uses CSS custom properties for theming, typically defined in your global CSS:

```css
:root {
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

.dark {
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
}
```

**Key Variables Used**:
- `--popover` - Background color of menu
- `--popover-foreground` - Text color
- `--accent` - Hover/focus background
- `--accent-foreground` - Hover/focus text
- `--destructive` - Destructive action color
- `--border` - Border and separator color
- `--radius` - Border radius

### Customization Approaches

**1. Inline Classes** (per instance):
```jsx
<DropdownMenuItem className="text-blue-600 font-semibold">
  Custom Item
</DropdownMenuItem>
```

**2. Modify Component File** (global changes):
Since components are copied into your project, you can edit `@/components/ui/dropdown-menu.tsx` directly:

```tsx
const DropdownMenuItem = React.forwardRef<...>(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "transition-colors", // Add custom classes here
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
)
```

**3. Wrapper Components** (reusable patterns):
```tsx
function DestructiveMenuItem({ children, ...props }) {
  return (
    <DropdownMenuItem
      className="text-red-600 focus:text-red-600 focus:bg-red-50"
      {...props}
    >
      {children}
    </DropdownMenuItem>
  )
}
```

**4. CSS Variables** (theme-wide):
Update your theme colors in `globals.css` or component-specific CSS:

```css
.my-custom-menu [data-radix-dropdown-menu-content] {
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
}
```

## 9. Accessibility

### ARIA Attributes from Radix

The DropdownMenu inherits comprehensive ARIA support from Radix UI:

**Structural ARIA**:
- `role="menu"` on content
- `role="menuitem"` on items
- `role="menuitemcheckbox"` on checkbox items
- `role="menuitemradio"` on radio items
- `role="separator"` on separators
- `role="group"` on groups
- `aria-labelledby` connecting trigger and content
- `aria-expanded` on trigger indicating state
- `aria-checked` on checkbox/radio items
- `aria-disabled` on disabled items

**Focus Management**:
- Trap focus within open menu
- Restore focus to trigger on close
- Proper focus visible indicators
- Disabled items are skip-focusable

### Keyboard Support

Full keyboard navigation is built-in:

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Open menu (on trigger) |
| `ArrowDown` | Move focus to next item |
| `ArrowUp` | Move focus to previous item |
| `ArrowRight` | Open submenu |
| `ArrowLeft` | Close submenu |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Esc` | Close menu |
| `Space` / `Enter` | Activate focused item |
| `A-Z` | Typeahead navigation to matching items |

### Screen Reader Support

- **Menu announcements**: Screen readers announce menu opening/closing
- **Item descriptions**: All items have proper accessible names
- **State changes**: Checkbox and radio state changes are announced
- **Disabled states**: Disabled items are announced as unavailable
- **Separators**: Separators are announced to indicate grouping
- **Submenus**: Nested menu relationships are conveyed

### Best Practices for Accessibility

1. **Use semantic triggers**: Wrap actual `<button>` elements with `asChild`
2. **Provide clear labels**: Ensure menu items have descriptive text
3. **Don't rely on color alone**: Use icons + text for destructive actions
4. **Test keyboard navigation**: Verify all items are reachable
5. **Test with screen readers**: Verify announcements are clear
6. **Avoid disabled items when possible**: Hide unavailable actions instead
7. **Use labels for grouping**: Help users understand menu organization

## 10. Best Practices

### When to Use

**Use DropdownMenu for**:
- Action menus triggered by buttons (Edit, Options, More)
- User account menus (Profile, Settings, Logout)
- Context-specific actions (File menu, Edit menu)
- Quick settings and preferences
- Multi-level navigation with submenus
- Checkbox/radio selection in menus

**Don't use DropdownMenu for**:
- Form select inputs (use Select component instead)
- Primary navigation (use Nav component)
- Long lists of data (use Combobox or Select with search)
- Always-visible options (use Tabs or RadioGroup)

### Common Customizations

**1. Positioning**:
```jsx
<DropdownMenuContent
  align="end"
  side="bottom"
  sideOffset={5}
>
```

**2. Preventing Auto-Close**:
```jsx
<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
  Don't close menu
</DropdownMenuItem>
```

**3. Dialog Integration**:
```jsx
<DropdownMenu modal={false}>
  {/* Now dialogs can open from menu items */}
</DropdownMenu>
```

**4. Custom Trigger**:
```jsx
<DropdownMenuTrigger asChild>
  <Avatar className="cursor-pointer">
    <AvatarImage src="/avatar.jpg" />
  </Avatar>
</DropdownMenuTrigger>
```

**5. Controlled State**:
```jsx
const [open, setOpen] = useState(false)

<DropdownMenu open={open} onOpenChange={setOpen}>
  {/* Programmatically control open state */}
</DropdownMenu>
```

### Gotchas and Pitfalls

**1. Missing `asChild` on Trigger**:
```jsx
// ❌ Wrong - creates nested buttons
<DropdownMenuTrigger>
  <Button>Open</Button>
</DropdownMenuTrigger>

// ✅ Correct - merges props
<DropdownMenuTrigger asChild>
  <Button>Open</Button>
</DropdownMenuTrigger>
```

**2. Portal Issues with Submenus**:
```jsx
// ❌ May have stacking issues
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>...</DropdownMenuSubContent>
</DropdownMenuSub>

// ✅ Use portal for proper rendering
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
  <DropdownMenuPortal>
    <DropdownMenuSubContent>...</DropdownMenuSubContent>
  </DropdownMenuPortal>
</DropdownMenuSub>
```

**3. Checkbox State Management**:
```jsx
// ❌ Uncontrolled without state
<DropdownMenuCheckboxItem>
  Option
</DropdownMenuCheckboxItem>

// ✅ Controlled with state
const [checked, setChecked] = useState(false)
<DropdownMenuCheckboxItem
  checked={checked}
  onCheckedChange={setChecked}
>
  Option
</DropdownMenuCheckboxItem>
```

**4. Shortcut Implementation**:
```jsx
// ❌ Shortcuts are visual only
<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>

// ✅ Implement keyboard handler separately
useEffect(() => {
  const handler = (e) => {
    if (e.metaKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```

**5. Width Not Applied**:
```jsx
// ❌ May not work due to specificity
<DropdownMenuContent width="200px">

// ✅ Use className
<DropdownMenuContent className="w-[200px]">
```

**6. Menu Closing on Dialog Open**:
```jsx
// ❌ Menu closes when dialog opens
<DropdownMenu>
  <DropdownMenuItem onClick={() => openDialog()}>
    Open Dialog
  </DropdownMenuItem>
</DropdownMenu>

// ✅ Set modal={false} on root
<DropdownMenu modal={false}>
  <DropdownMenuItem onClick={() => openDialog()}>
    Open Dialog
  </DropdownMenuItem>
</DropdownMenu>
```

### Performance Considerations

**1. Avoid Heavy Content**:
- Keep menu items lightweight
- Lazy load submenu content if possible
- Avoid expensive computations in render

**2. Use Portal Wisely**:
- Portals prevent stacking issues but have slight performance cost
- Only use for submenus, not main content (already portaled)

**3. Memoize Callbacks**:
```jsx
const handleSelect = useCallback((value) => {
  // Handle selection
}, [dependencies])
```

## 11. Comparison Notes

### Copy-Paste Model vs Traditional Component Libraries

**Traditional Component Libraries** (Material-UI, Ant Design, Chakra UI):
- **Distribution**: NPM packages, imported as dependencies
- **Updates**: `npm update` to get new versions
- **Customization**: Props-based API, limited style override options
- **Bundle Size**: Import entire library or tree-shake unused components
- **Control**: Less control over implementation details
- **Consistency**: Enforced through package version

**ShadCN Copy-Paste Model**:
- **Distribution**: CLI copies code into your project (`@/components/ui/`)
- **Updates**: Manual - rerun CLI command and merge changes
- **Customization**: Full control - edit component files directly
- **Bundle Size**: Only include components you copy
- **Control**: Complete ownership of code
- **Consistency**: Manual maintenance across projects

### Impact on Usage

**Advantages of Copy-Paste Model**:

1. **Full Customization**: Edit component source directly without fighting framework constraints
2. **No Version Lock**: No dependency on package updates or deprecations
3. **Transparency**: See exactly how components work by reading the code
4. **Flexibility**: Mix ShadCN with other libraries without conflicts
5. **Learning**: Study well-structured component implementations
6. **Tailwind-First**: Perfect integration with Tailwind workflows

**Disadvantages of Copy-Paste Model**:

1. **Manual Updates**: Must manually copy new versions to get bug fixes
2. **Consistency Burden**: Keeping components consistent across projects requires discipline
3. **Merge Conflicts**: Updating components after customization requires manual merging
4. **Code Duplication**: Same component copied to multiple projects
5. **Tooling**: Less IDE support for component API (no package typings)

### Usage Pattern Differences

**Traditional Library Pattern**:
```jsx
// Install once, import everywhere
npm install @mui/material

import { Menu, MenuItem } from '@mui/material'

<Menu>
  <MenuItem>Item</MenuItem>
</Menu>
```

**ShadCN Pattern**:
```jsx
// Copy component, customize as needed
pnpm dlx shadcn@latest add dropdown-menu

// Edit /components/ui/dropdown-menu.tsx to customize
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuItem>Item</DropdownMenuItem>
</DropdownMenu>
```

### When to Choose ShadCN

**Choose ShadCN when**:
- You want full control over component implementation
- You're using Tailwind CSS heavily
- You prefer composition over configuration
- You want to learn from well-structured code
- Your design system requires significant customization
- You're building a long-term project where ownership matters

**Choose Traditional Library when**:
- You need automatic updates and security patches
- You want consistent components across many projects
- You prefer props-based customization
- You need enterprise support and guarantees
- Your team is less experienced with React internals
- Rapid prototyping is the priority

### Migration Considerations

**Moving from Traditional to ShadCN**:
- Audit existing component usage patterns
- Copy ShadCN components one at a time
- Customize to match existing design system
- Gradually replace old components
- Remove old library when migration complete

**Moving from ShadCN to Traditional**:
- Choose target library with similar component API
- Map ShadCN components to library equivalents
- Extract customizations into wrapper components
- Replace imports incrementally
- Clean up copied component files

---

## Summary

The ShadCN DropdownMenu is a comprehensive, accessible menu component system built on Radix UI primitives with Tailwind CSS styling. Its unique copy-paste distribution model gives developers complete ownership and customization control while maintaining high-quality, accessible implementations.

**Key Takeaways**:
- **Composition-based**: Build complex menus from simple, composable parts
- **Accessible by default**: Full ARIA support and keyboard navigation from Radix UI
- **Highly customizable**: Edit component source directly or use Tailwind classes
- **Flexible patterns**: Supports items, checkboxes, radios, submenus, shortcuts, and more
- **Copy-paste model**: Own the code, customize freely, update manually
- **Production-ready**: Well-tested Radix primitives + polished Tailwind styling

The component excels at creating action menus, user account menus, and context-specific dropdown interfaces with full accessibility and extensive customization options.

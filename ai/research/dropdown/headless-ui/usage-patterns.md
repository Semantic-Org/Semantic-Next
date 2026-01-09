# Headless UI - Menu Component Usage Patterns

## Component URL
https://headlessui.com/react/menu

**Status**: ✅ Working
**Version**: Current (Headless UI v2.x for React)
**Last Verified**: 2025-11-04

---

## Documentation Quality
**Assessment**: Comprehensive

The Headless UI Menu documentation is thorough and well-structured, featuring:
- Complete API reference with prop tables
- Multiple code examples covering basic to advanced usage
- Detailed keyboard interaction table
- Accessibility documentation with WAI-ARIA patterns
- Styling approaches (data attributes + render props)
- Integration examples with animation libraries and frameworks

---

## Component Definition

### What is Menu?

**Core Purpose**: Menu provides an unstyled, fully accessible dropdown menu component for building custom navigation menus, action menus, and context menus with complete keyboard support and ARIA compliance.

**Mental Model**: Menu is a **headless behavior component** that manages:
- Open/close state and transitions
- Keyboard navigation (arrow keys, Home/End, type-ahead)
- Focus management and trapping
- Accessibility semantics (ARIA roles, attributes)
- Positioning and portal rendering
- Item activation and selection

**Key Characteristic**: **COMPLETELY UNSTYLED** - Headless UI provides zero CSS. All visual styling must be implemented by the developer using their preferred styling solution (Tailwind, CSS modules, styled-components, etc.).

**Semantic Meaning**: Menu represents a list of actions or navigation options triggered by a button. It follows the WAI-ARIA menu pattern for keyboard-operable command menus.

**Important Note**: Headless UI calls this component "Menu" (not "Dropdown"). The component serves:
- Command menus (actions like "Edit", "Delete", "Share")
- Navigation menus (links to different pages/sections)
- Context menus (right-click menus)
- Account menus (profile, settings, logout)

---

## Installation & Setup

### Installation
```bash
npm install @headlessui/react
```

### Basic Import
```jsx
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
```

### Optional Imports
```jsx
// For semantic grouping
import { MenuSection, MenuHeading, MenuSeparator } from '@headlessui/react'
```

### Requirements
- React 16.8+ (hooks support)
- React 18+ recommended for best compatibility

---

## Basic Usage

### Minimal Example (No Styling)
```jsx
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

function BasicMenu() {
  return (
    <Menu>
      <MenuButton>My account</MenuButton>
      <MenuItems anchor="bottom">
        <MenuItem>
          <a href="/settings">Settings</a>
        </MenuItem>
        <MenuItem>
          <a href="/support">Support</a>
        </MenuItem>
        <MenuItem>
          <a href="/logout">Sign out</a>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
```

**Note**: This renders functional HTML with full keyboard navigation and accessibility, but has NO visual styling (no colors, spacing, borders, shadows, etc.).

### Adding Styling with Tailwind
```jsx
function StyledMenu() {
  return (
    <Menu>
      <MenuButton className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        My account
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 p-1"
      >
        <MenuItem>
          <a
            href="/settings"
            className="block px-4 py-2 rounded-md data-focus:bg-blue-100"
          >
            Settings
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="/support"
            className="block px-4 py-2 rounded-md data-focus:bg-blue-100"
          >
            Support
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="/logout"
            className="block px-4 py-2 rounded-md data-focus:bg-red-100 text-red-700"
          >
            Sign out
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
```

**Key Points**:
1. All styling is manual via `className`
2. Use `data-focus` attribute to style focused/hovered items
3. Use `anchor` prop for automatic positioning
4. Developer controls all visual aspects (colors, spacing, typography, shadows)

---

## Composition Structure

### Component Hierarchy

```
Menu (root container - manages state)
├── MenuButton (trigger element)
└── MenuItems (dropdown container)
    ├── MenuItem (individual options)
    ├── MenuSeparator (visual dividers)
    └── MenuSection (semantic grouping)
        ├── MenuHeading (section label)
        └── MenuItem (grouped items)
```

### How They Work Together

**Menu**:
- Root component providing context for all child components
- Manages open/close state
- Coordinates keyboard navigation
- No visual representation

**MenuButton**:
- Trigger that toggles menu visibility
- Receives focus and keyboard events
- Typically renders as `<button>` (default)
- Can be customized with `as` prop

**MenuItems**:
- Container for menu options
- Automatically positioned via `anchor` prop
- Handles focus trapping and modal behavior
- Renders in portal by default (when using `anchor`)
- Can be animated with transitions

**MenuItem**:
- Individual selectable option
- Automatically closes menu when clicked
- Receives `data-focus` when keyboard/mouse focused
- Supports `disabled` state
- Renders as Fragment by default (allows any child element)

**MenuSeparator**:
- Visual divider between menu sections
- Renders as `<div>` with `role="separator"`
- Purely presentational (no interaction)

**MenuSection + MenuHeading**:
- Semantic grouping for related items
- MenuHeading labels the section for screen readers
- Improves accessibility and organization

---

## API / Props

### Menu Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `Fragment \| string \| Component` | `Fragment` | Element to render as |

**Render Props**:
- `open` (boolean): Whether menu is currently displayed
- `close` (function): Programmatically close the menu

**Data Attributes**:
- `data-open`: Present when menu is open

---

### MenuButton Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `button \| string \| Component` | `button` | Element to render as |
| `disabled` | `boolean` | `false` | Disable the button |

**Render Props**:
- `open` (boolean): Menu visibility state
- `focus` (boolean): Button has focus
- `hover` (boolean): Button is hovered
- `active` (boolean): Button is being pressed
- `autofocus` (boolean): Button has autofocus

**Data Attributes**:
- `data-open`: Menu is open
- `data-focus`: Button is focused
- `data-hover`: Button is hovered
- `data-active`: Button is being pressed
- `data-autofocus`: Button has autofocus attribute

**Behavior**:
- Clicks toggle menu open/closed
- Receives keyboard focus
- Arrow keys open menu and navigate to first/last item
- Enter/Space open menu and focus first item

---

### MenuItems Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `div \| string \| Component` | `div` | Element to render as |
| `anchor` | `string \| object` | `undefined` | Positioning configuration |
| `transition` | `boolean` | `false` | Enable transition data attributes |
| `static` | `boolean` | `false` | Always render (for external animation) |
| `unmount` | `boolean` | `true` | Remove from DOM when closed |
| `portal` | `boolean` | `false` | Render in portal (auto-enabled with anchor) |
| `modal` | `boolean` | `true` | Enable focus trapping and scroll locking |

**Anchor Prop Details**:

String format:
```jsx
anchor="bottom"           // bottom center
anchor="bottom start"     // bottom left
anchor="top end"          // top right
anchor="left"             // left center
```

Object format:
```jsx
anchor={{
  to: 'bottom start',     // Position (default: 'bottom')
  gap: '4px',             // Space between button and menu (default: 0)
  offset: '0px',          // Horizontal/vertical nudge (default: 0)
  padding: '8px'          // Viewport clearance (default: 0)
}}
```

CSS variable overrides:
```jsx
className="[--anchor-gap:4px] [--anchor-offset:8px]"
```

**Render Props**:
- `open` (boolean): Menu is displayed

**Data Attributes**:
- `data-open`: Menu is open
- `data-closed`: Menu is closed (for transitions)

---

### MenuItem Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `Fragment \| string \| Component` | `Fragment` | Element to render as |
| `disabled` | `boolean` | `false` | Disable the item |

**Render Props**:
- `focus` (boolean): Item is keyboard/mouse focused
- `disabled` (boolean): Item is disabled
- `close` (function): Programmatically close menu

**Data Attributes**:
- `data-focus`: Item is focused
- `data-disabled`: Item is disabled

**Behavior**:
- Automatically closes menu when clicked
- Skipped during keyboard navigation if disabled
- Receives focus on hover or arrow key navigation

---

### MenuSeparator Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `div \| string \| Component` | `div` | Element to render as |

**Behavior**:
- Renders with `role="separator"`
- Non-interactive (for visual division only)
- Must be styled manually (e.g., `className="h-px bg-gray-200 my-1"`)

---

### MenuSection Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `div \| string \| Component` | `div` | Element to render as |

**Purpose**: Semantic grouping of related menu items for screen readers

---

### MenuHeading Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `header \| string \| Component` | `header` | Element to render as |

**Purpose**: Accessible label for a MenuSection

---

## State Management

### Open/Close State

**Automatic Management**:
- Menu tracks open/close state internally
- MenuButton click toggles state
- MenuItem click closes menu
- Escape key closes menu
- Clicking outside closes menu

**Programmatic Control**:
```jsx
<Menu>
  {({ open, close }) => (
    <>
      <MenuButton>Options</MenuButton>
      {open && <div>Menu is open!</div>}
      <MenuItems anchor="bottom">
        <MenuItem>
          <button onClick={() => {
            doSomething();
            close(); // Manually close
          }}>
            Custom Action
          </button>
        </MenuItem>
      </MenuItems>
    </>
  )}
</Menu>
```

**Access via Render Props**:
```jsx
// At Menu level
<Menu>
  {({ open }) => (/* Use open state */)}
</Menu>

// At MenuItem level
<MenuItem>
  {({ close }) => (
    <button onClick={() => {
      handleAction();
      close();
    }}>
      Action
    </button>
  )}
</MenuItem>
```

---

### Active Item State

**Keyboard Navigation**:
- Arrow Up/Down: Navigate between enabled items
- Home / Page Up: Jump to first item
- End / Page Down: Jump to last item
- A-Z keys: Type-ahead search to matching item

**Mouse Navigation**:
- Hover over MenuItem: Becomes active (receives `data-focus`)
- Active item is highlighted via `data-focus` attribute

**Disabled Items**:
- Skipped during keyboard navigation
- Still visible but marked with `data-disabled`
- Developer controls styling for disabled state

---

### Focus Management

**Automatic Focus**:
- Opening menu focuses first item
- Arrow Down on button: Opens and focuses first item
- Arrow Up on button: Opens and focuses last item
- Closing menu returns focus to MenuButton
- Focus trapped within menu when open (via `modal` prop)

**Manual Focus Control**:
```jsx
// MenuItem provides focus state
<MenuItem>
  {({ focus }) => (
    <a className={focus ? 'bg-blue-100' : 'bg-white'}>
      Item
    </a>
  )}
</MenuItem>
```

---

### Keyboard Navigation

Full keyboard interaction table:

| Key(s) | Context | Behavior |
|--------|---------|----------|
| **Enter** / **Space** | MenuButton focused | Opens menu, focuses first non-disabled item |
| **Arrow Down** | MenuButton focused | Opens menu, focuses first item |
| **Arrow Up** | MenuButton focused | Opens menu, focuses last item |
| **Escape** | Menu open | Closes menu, refocuses button |
| **Arrow Down** | Menu open | Focuses next non-disabled item (wraps to first) |
| **Arrow Up** | Menu open | Focuses previous non-disabled item (wraps to last) |
| **Home** / **Page Up** | Menu open | Focuses first non-disabled item |
| **End** / **Page Down** | Menu open | Focuses last non-disabled item |
| **Enter** / **Space** | Menu open | Activates/clicks focused item, closes menu |
| **A–Z** (letters) | Menu open | Type-ahead: Focuses first item matching keystroke |

---

## Styling Approaches

### 1. Data Attribute Method (Recommended with Tailwind)

Use Tailwind's `data-*` modifiers to style based on state:

```jsx
<MenuButton className="
  rounded-md bg-blue-500 px-4 py-2 text-white
  data-active:bg-blue-600
  data-hover:bg-blue-400
  data-focus:ring-2 data-focus:ring-blue-300
">
  Menu
</MenuButton>

<MenuItem>
  <a className="
    block px-4 py-2 text-gray-700
    data-focus:bg-blue-100 data-focus:text-blue-900
    data-disabled:opacity-50 data-disabled:cursor-not-allowed
  ">
    Item
  </a>
</MenuItem>
```

**Available Data Attributes**:
- `data-open`: Menu/button is open
- `data-closed`: Menu is closed (for exit transitions)
- `data-focus`: Element is focused
- `data-hover`: Element is hovered
- `data-active`: Button is pressed
- `data-disabled`: Item is disabled
- `data-autofocus`: Element has autofocus
- `data-enter`: Entering transition
- `data-leave`: Exiting transition

---

### 2. Render Props Method

Access state through render prop functions:

```jsx
<MenuButton>
  {({ active, focus }) => (
    <button className={clsx(
      'rounded-md px-4 py-2',
      active && 'bg-blue-600',
      focus && 'ring-2 ring-blue-300',
      'bg-blue-500 text-white'
    )}>
      Menu
    </button>
  )}
</MenuButton>

<MenuItem>
  {({ focus, disabled }) => (
    <a className={clsx(
      'block px-4 py-2',
      focus && 'bg-blue-100',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      Item
    </a>
  )}
</MenuItem>
```

**Available Render Props**:
- `open` (boolean): Menu visibility
- `active` (boolean): Element is being pressed
- `focus` (boolean): Element has focus
- `hover` (boolean): Element is hovered
- `disabled` (boolean): Element is disabled
- `autofocus` (boolean): Element has autofocus
- `close` (function): Close menu programmatically

---

### 3. CSS Modules / Plain CSS

```css
/* menu.module.css */
.button {
  padding: 0.5rem 1rem;
  background: blue;
  color: white;
}

.button[data-active] {
  background: darkblue;
}

.menuItems {
  background: white;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.item {
  padding: 0.5rem 1rem;
}

.item[data-focus] {
  background: lightblue;
}

.item[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

```jsx
import styles from './menu.module.css'

<Menu>
  <MenuButton className={styles.button}>Menu</MenuButton>
  <MenuItems anchor="bottom" className={styles.menuItems}>
    <MenuItem>
      <a className={styles.item}>Item</a>
    </MenuItem>
  </MenuItems>
</Menu>
```

---

### 4. Styled-Components / CSS-in-JS

```jsx
import styled from 'styled-components'

const StyledMenuButton = styled.button`
  padding: 0.5rem 1rem;
  background: blue;
  color: white;
  border-radius: 0.375rem;

  &[data-active] {
    background: darkblue;
  }

  &[data-focus] {
    outline: 2px solid lightblue;
  }
`

const StyledMenuItem = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  color: #333;

  &[data-focus] {
    background: lightblue;
    color: darkblue;
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

<Menu>
  <MenuButton as={StyledMenuButton}>Menu</MenuButton>
  <MenuItems anchor="bottom">
    <MenuItem>
      <StyledMenuItem href="/settings">Settings</StyledMenuItem>
    </MenuItem>
  </MenuItems>
</Menu>
```

---

## Accessibility

### WAI-ARIA Menu Pattern

**Compliance**: Headless UI Menu follows the WAI-ARIA Authoring Practices for menu components.

**ARIA Roles**:
- Menu container: `role="menu"`
- Menu items: `role="menuitem"`
- Menu sections: `role="group"`
- Menu separators: `role="separator"`

**ARIA Attributes**:
- `aria-expanded`: On MenuButton (true/false based on open state)
- `aria-haspopup="menu"`: On MenuButton
- `aria-disabled`: On disabled MenuItem
- `aria-labelledby`: Links MenuSection to MenuHeading

**Automatic Implementation**: All ARIA attributes are managed automatically by Headless UI.

---

### Keyboard Support

**Full Keyboard Operability**: Every interaction available via mouse is also available via keyboard (see [Keyboard Navigation](#keyboard-navigation) section).

**Type-Ahead Search**: Pressing letter keys jumps to first matching item.

**Focus Management**:
- Focus trapped within menu when open (via `modal` prop)
- Escape returns focus to trigger button
- Tab key trapped within menu (doesn't leave)

**Disabled Item Handling**: Disabled items are:
- Skipped during keyboard navigation
- Marked with `aria-disabled`
- Still visible for context

---

### Focus Trapping & Modal Behavior

**Modal Mode** (default: `modal={true}`):
- Focus trapped within menu when open
- Outside elements marked `inert` (cannot be focused/clicked)
- Scroll locked on body
- Clicking outside closes menu

**Non-Modal Mode** (`modal={false}`):
- Focus can leave menu
- Outside elements remain interactive
- No scroll locking
- Clicking outside closes menu

```jsx
// Non-modal menu (allows external interaction)
<MenuItems anchor="bottom" modal={false}>
  {/* items */}
</MenuItems>
```

---

### Screen Reader Support

**Semantic HTML**: Menu components render with proper semantic roles for screen reader navigation.

**Grouping**: MenuSection and MenuHeading provide logical grouping:
```jsx
<MenuSection>
  <MenuHeading>Account Settings</MenuHeading>
  <MenuItem><a href="/profile">Profile</a></MenuItem>
  <MenuItem><a href="/billing">Billing</a></MenuItem>
</MenuSection>
```

**State Announcements**:
- Menu open/close state announced via `aria-expanded`
- Current focused item announced as user navigates
- Disabled state announced for disabled items

**Best Practices**:
- Use descriptive MenuButton text (not just icons)
- Provide text content in MenuItem (not just icons)
- Use MenuHeading to label sections
- Don't rely solely on color for state indication

---

## Best Practices

### When to Use Headless UI Menu

**Use Headless UI Menu when**:
- You have a custom design system with specific visual requirements
- You want full control over styling and animations
- You need maximum flexibility in component composition
- You're comfortable writing CSS for all states and interactions
- You value small bundle size and unstyled components
- Your team prefers utility-first CSS (Tailwind)

**Consider styled alternatives when**:
- You need quick prototyping with minimal styling effort
- You want pre-designed, production-ready components out of the box
- Your team prefers component libraries with built-in themes
- You don't have a dedicated design system

---

### Headless vs Styled Libraries

**Headless UI (Unstyled)**:
- ✅ Complete styling control
- ✅ No style conflicts or overrides
- ✅ Smaller bundle size (no CSS shipped)
- ✅ Design system agnostic
- ❌ Requires manual styling for every state
- ❌ More initial setup time
- ❌ No visual examples/inspiration

**Styled Libraries (e.g., Ant Design, MUI, Chakra)**:
- ✅ Ready-to-use with built-in styling
- ✅ Faster initial development
- ✅ Visual consistency out of the box
- ❌ Style overrides can be complex
- ❌ Larger bundle size (CSS included)
- ❌ Tied to library's design language

**Mental Model Difference**:
- Headless UI = "Behavior component" (you provide the look)
- Styled libraries = "Complete component" (behavior + look included)

---

### Common Patterns

**1. Button-based Actions**:
```jsx
<Menu>
  <MenuButton>Actions</MenuButton>
  <MenuItems anchor="bottom">
    <MenuItem>
      <button onClick={handleEdit}>Edit</button>
    </MenuItem>
    <MenuItem>
      <button onClick={handleDelete}>Delete</button>
    </MenuItem>
  </MenuItems>
</Menu>
```

**2. Link-based Navigation**:
```jsx
<Menu>
  <MenuButton>Navigate</MenuButton>
  <MenuItems anchor="bottom">
    <MenuItem>
      <a href="/dashboard">Dashboard</a>
    </MenuItem>
    <MenuItem>
      <a href="/settings">Settings</a>
    </MenuItem>
  </MenuItems>
</Menu>
```

**3. Mixed Content (Links + Actions)**:
```jsx
<Menu>
  <MenuButton>My Account</MenuButton>
  <MenuItems anchor="bottom">
    <MenuItem>
      <a href="/profile">View Profile</a>
    </MenuItem>
    <MenuSeparator />
    <MenuItem>
      <button onClick={handleLogout}>Sign Out</button>
    </MenuItem>
  </MenuItems>
</Menu>
```

**4. Disabled Items (Coming Soon Features)**:
```jsx
<MenuItem disabled>
  <a className="data-disabled:opacity-50">
    Premium Features (Coming Soon)
  </a>
</MenuItem>
```

**5. Grouped Sections**:
```jsx
<MenuItems anchor="bottom">
  <MenuSection>
    <MenuHeading>Account</MenuHeading>
    <MenuItem><a href="/profile">Profile</a></MenuItem>
    <MenuItem><a href="/billing">Billing</a></MenuItem>
  </MenuSection>
  <MenuSeparator />
  <MenuSection>
    <MenuHeading>Support</MenuHeading>
    <MenuItem><a href="/docs">Documentation</a></MenuItem>
    <MenuItem><a href="/help">Help Center</a></MenuItem>
  </MenuSection>
</MenuItems>
```

**6. Responsive Width (Match Button)**:
```jsx
<MenuItems
  anchor="bottom"
  className="w-[--button-width]"
>
  {/* Menu width matches button width */}
</MenuItems>
```

**7. Custom Positioning with Gap**:
```jsx
<MenuItems
  anchor={{
    to: 'bottom start',
    gap: '8px',
    padding: '16px'
  }}
>
  {/* items */}
</MenuItems>
```

---

### Avoiding Common Pitfalls

**Pitfall 1: Forgetting to Style**
```jsx
// ❌ This renders but looks broken (no styling)
<Menu>
  <MenuButton>Menu</MenuButton>
  <MenuItems>
    <MenuItem><a>Item</a></MenuItem>
  </MenuItems>
</Menu>

// ✅ Add styling via className
<Menu>
  <MenuButton className="bg-blue-500 text-white px-4 py-2 rounded">
    Menu
  </MenuButton>
  <MenuItems className="bg-white border rounded shadow-lg">
    <MenuItem>
      <a className="block px-4 py-2 data-focus:bg-blue-100">Item</a>
    </MenuItem>
  </MenuItems>
</Menu>
```

**Pitfall 2: Not Using `anchor` Prop**
```jsx
// ❌ Menu not positioned relative to button
<MenuItems>
  {/* items */}
</MenuItems>

// ✅ Use anchor for automatic positioning
<MenuItems anchor="bottom">
  {/* items */}
</MenuItems>
```

**Pitfall 3: Wrapping MenuItem Content Incorrectly**
```jsx
// ❌ Extra wrapper prevents proper event handling
<MenuItem>
  <div>
    <a href="/settings">Settings</a>
  </div>
</MenuItem>

// ✅ Direct child is the interactive element
<MenuItem>
  <a href="/settings">Settings</a>
</MenuItem>
```

**Pitfall 4: Not Styling Focus State**
```jsx
// ❌ No visual feedback for keyboard navigation
<MenuItem>
  <a>Item</a>
</MenuItem>

// ✅ Style focus state with data-focus
<MenuItem>
  <a className="data-focus:bg-blue-100">Item</a>
</MenuItem>
```

**Pitfall 5: Forgetting Fragment for Custom Links**
```jsx
// ❌ Next.js Link wrapped by MenuItem div
<MenuItem>
  <Link href="/settings">Settings</Link>
</MenuItem>

// ✅ Use Fragment to avoid wrapper (for older Next.js)
<MenuItem as={Fragment}>
  <Link href="/settings">Settings</Link>
</MenuItem>

// ✅ Next.js 13+ doesn't need Fragment workaround
```

---

## Comparison Notes: Headless vs Styled Libraries

### Philosophy Differences

**Headless UI Menu**:
- **Zero opinions on styling**: You bring your own CSS
- **Behavior-only component**: Focus on accessibility and state management
- **Design system agnostic**: Works with any styling approach
- **Minimal API surface**: Few props, flexible composition

**Ant Design Dropdown**:
- **Complete component**: Styling + behavior included
- **Opinionated design**: Ant Design visual language
- **Theme customization**: Override via less variables or ConfigProvider
- **Rich API**: Many props for customization

**MUI Menu**:
- **Material Design implementation**: Google's design language
- **Theme system**: Extensive theming via ThemeProvider
- **Component variants**: Styled variants out of the box
- **Integrated ecosystem**: Works seamlessly with other MUI components

**Chakra UI Menu**:
- **Middle ground**: Styled but highly customizable
- **Utility props**: `bg`, `color`, `p`, etc. for inline styling
- **Theme tokens**: Design tokens for consistent styling
- **Composable**: Similar composition pattern to Headless UI

---

### API Comparison: Headless UI vs Ant Design vs MUI

| Feature | Headless UI | Ant Design | MUI |
|---------|-------------|------------|-----|
| **Built-in Styling** | ❌ None | ✅ Full | ✅ Full |
| **Custom Styling** | ✅ Complete control | ⚠️ Override required | ⚠️ sx/styled API |
| **Positioning** | `anchor` prop + CSS vars | `placement` prop | `anchorEl` + Popper |
| **Transitions** | Manual (data attributes) | Built-in | Built-in (Grow/Fade) |
| **Keyboard Nav** | ✅ Full WAI-ARIA | ✅ Full | ✅ Full |
| **Type-ahead Search** | ✅ Built-in | ❌ Not standard | ❌ Not standard |
| **Disabled Items** | `disabled` prop | `disabled` prop | `disabled` prop |
| **Grouping** | MenuSection/Heading | Menu.ItemGroup | MenuList + Divider |
| **Icons** | Manual (you provide) | `icon` prop | `startIcon` prop |
| **Bundle Size** | Small (~5kb) | Large (~200kb+) | Large (~300kb+) |

---

### When Each Approach Shines

**Choose Headless UI when**:
- Building a completely custom design system
- You want minimal bundle size
- You're comfortable with utility-first CSS (Tailwind)
- You need maximum styling flexibility
- Your design doesn't match existing component libraries

**Choose Styled Libraries when**:
- Rapid prototyping or MVP development
- You want consistent, production-ready UI immediately
- Your design aligns with the library's aesthetic (Material, Ant)
- You prefer higher-level APIs with more built-in features
- You're building an admin dashboard or internal tool

---

## Notable Features

### 1. Automatic Positioning with Anchor

The `anchor` prop provides intelligent positioning that:
- **Detects viewport boundaries**: Flips menu if it would overflow
- **Adjusts dynamically**: Repositions as window resizes
- **Portal rendering**: Renders outside DOM hierarchy to avoid clipping
- **CSS variable integration**: Fine-tune with `--anchor-gap`, `--anchor-offset`, `--anchor-padding`

```jsx
// Simple positioning
<MenuItems anchor="bottom">...</MenuItems>

// Advanced control
<MenuItems
  anchor={{
    to: 'bottom start',
    gap: '8px',
    offset: '4px',
    padding: '16px'
  }}
>
  ...
</MenuItems>
```

---

### 2. Type-Ahead Search

Built-in type-ahead allows users to jump to items by typing:
- Press 'S' → Jumps to first item starting with 'S'
- Press 'Se' → Jumps to first item starting with 'Se'
- Press 'Set' → Jumps to "Settings"

**Implementation**: Automatic (no configuration needed)

---

### 3. Render Props for Dynamic Behavior

Access component state through render prop functions:

```jsx
<Menu>
  {({ open }) => (
    <>
      <MenuButton>
        Options {open ? '▲' : '▼'}
      </MenuButton>
      <MenuItems>...</MenuItems>
    </>
  )}
</Menu>

<MenuItem>
  {({ focus, disabled, close }) => (
    <button
      className={focus ? 'bg-blue-100' : ''}
      onClick={() => {
        doSomething();
        close();
      }}
    >
      Action
    </button>
  )}
</MenuItem>
```

---

### 4. Portal Rendering

Automatically renders menu in a portal to avoid:
- Z-index conflicts
- Overflow clipping from parent containers
- Scroll container issues

**Enabled automatically** when using `anchor` prop.

---

### 5. Built-in Transition Support

Native support for CSS transitions and animations:

**CSS Transitions**:
```jsx
<MenuItems
  transition
  className="
    transition duration-200
    data-enter:opacity-100 data-enter:scale-100
    data-leave:opacity-0 data-leave:scale-95
  "
>
  {/* items */}
</MenuItems>
```

**Animation Library Integration** (Framer Motion):
```jsx
import { AnimatePresence, motion } from 'framer-motion'

<Menu>
  {({ open }) => (
    <>
      <MenuButton>Menu</MenuButton>
      <AnimatePresence>
        {open && (
          <MenuItems
            static
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* items */}
          </MenuItems>
        )}
      </AnimatePresence>
    </>
  )}
</Menu>
```

---

### 6. Polymorphic `as` Prop

Render any component with custom elements:

```jsx
// Render as custom component
<MenuButton as={MyCustomButton}>Menu</MenuButton>

// Render as Fragment (no wrapper)
<MenuItem as={Fragment}>
  <a href="/settings">Settings</a>
</MenuItem>

// Render as semantic HTML
<MenuItems as="nav" anchor="bottom">
  {/* items */}
</MenuItems>
```

---

### 7. Framework Integration Patterns

**Next.js** (v13+ with App Router):
```jsx
import Link from 'next/link'

<MenuItem>
  <Link href="/dashboard" className="block px-4 py-2 data-focus:bg-blue-100">
    Dashboard
  </Link>
</MenuItem>
```

**React Router**:
```jsx
import { Link } from 'react-router-dom'

<MenuItem>
  <Link to="/dashboard" className="block px-4 py-2 data-focus:bg-blue-100">
    Dashboard
  </Link>
</MenuItem>
```

**Remix**:
```jsx
import { Link } from '@remix-run/react'

<MenuItem>
  <Link to="/dashboard" className="block px-4 py-2 data-focus:bg-blue-100">
    Dashboard
  </Link>
</MenuItem>
```

---

## Research Notes

### Data Collection Method
- Direct documentation fetch from https://headlessui.com/react/menu
- Research date: 2025-11-04
- Documentation version: Headless UI v2.x (current)

### Documentation Quality
The Headless UI documentation is excellent:
- Clear, comprehensive API tables
- Abundant code examples (basic to advanced)
- Detailed keyboard interaction reference
- Accessibility best practices documented
- Integration examples with popular tools (Tailwind, Framer Motion, Next.js)

### Key Observations

**Headless Philosophy**:
- Headless UI provides **zero styling** - this is by design, not an oversight
- Components are "behavior primitives" that manage state and accessibility
- Developers must style every state: default, hover, focus, active, disabled, open, closed
- This approach maximizes flexibility but increases initial implementation time

**Naming Convention**:
- Called "Menu" not "Dropdown" (semantic naming based on WAI-ARIA pattern)
- Components use descriptive names: MenuButton, MenuItems, MenuItem
- Props are minimal and focused on behavior, not appearance

**Positioning System**:
- The `anchor` prop is sophisticated and handles common positioning challenges
- Automatic viewport detection and flip behavior
- CSS variable integration for responsive design
- Portal rendering by default when positioning is enabled

**Accessibility First**:
- Every feature prioritizes keyboard navigation and screen reader support
- WAI-ARIA compliance is automatic (no manual ARIA needed)
- Type-ahead search, focus management, and modal behavior built-in
- Disabled state properly announced and handled

### Limitations

**No Visual Defaults**:
- Component renders unstyled HTML (functional but not presentable)
- Requires styling setup before use
- No "quick start" with default theme

**CSS Knowledge Required**:
- Developers must understand CSS layout, positioning, and responsive design
- Must style hover, focus, active, disabled states manually
- Must handle transitions and animations manually (though data attributes help)

**Framework Dependent**:
- React-specific (not available for Vue, Svelte, etc.)
- Requires React 16.8+ (hooks)
- Cannot be used in non-React projects

### Comparison to Other Headless Libraries

**Headless UI vs Radix UI Primitives**:
- Similar philosophy (unstyled, accessible)
- Radix has broader component coverage
- Headless UI has simpler API
- Headless UI tightly integrated with Tailwind CSS

**Headless UI vs Downshift**:
- Headless UI: Menu, Listbox, Combobox, etc.
- Downshift: Focus on select/autocomplete patterns
- Downshift is more flexible but lower-level
- Headless UI provides more components out of the box

---

## Recommendations for Semantic UI

### Core Concepts to Adopt

**1. Clear State Communication**:
- Headless UI's data attributes (`data-focus`, `data-open`, etc.) provide excellent state visibility
- Consider exposing similar state indicators for styling
- Support both CSS and JavaScript-based styling approaches

**2. Automatic Positioning**:
- The `anchor` prop pattern is elegant and solves real positioning challenges
- Semantic UI should provide intelligent positioning for dropdown-like components
- Consider viewport detection and automatic repositioning

**3. Render Props for Advanced Use Cases**:
- Providing `open`, `close`, `focus` state through render props enables advanced patterns
- Allows developers to build dynamic UIs that respond to component state
- Particularly useful for animations and conditional rendering

**4. Keyboard Navigation Excellence**:
- Type-ahead search is a standout feature users expect
- Home/End keys for boundary navigation
- Clear, predictable navigation patterns

**5. Focus Management**:
- Automatic focus return to trigger when closing
- Focus trapping in modal mode
- Skip disabled items during keyboard navigation

---

### Semantic UI Differentiators

**Pre-styled by Default**:
- Unlike Headless UI, Semantic UI should provide beautiful default styling
- Developers can opt-in to unstyled mode if needed
- Reduce time-to-first-render for common use cases

**Web Component Advantages**:
- Shadow DOM provides true style encapsulation (better than React context)
- Framework-agnostic usage (works in Vue, Angular, vanilla JS)
- Standard HTML attributes instead of React props

**Natural Language API**:
- Headless UI uses technical terms: `anchor`, `transition`, `modal`
- Semantic UI could use more natural language: `position`, `animate`, `trap-focus`
- Boolean attributes for common patterns: `<ui-menu open>` vs `<Menu open={true}>`

**Settings-Based Configuration**:
- Leverage Semantic UI's reactive settings system
- Allow runtime configuration changes (unlike React props)
- Support theme tokens for consistent design

---

### Implementation Priorities

**Must-Have (Level 1)**:
1. Keyboard navigation (arrows, Home/End, Enter/Space, Escape)
2. Type-ahead search
3. Focus management (trap, return to trigger)
4. Automatic positioning with viewport detection
5. Disabled item handling (skip in navigation, visual indicator)
6. WAI-ARIA compliance (roles, attributes)
7. Open/close state management
8. Click outside to close

**Should-Have (Level 2)**:
1. Transition/animation support (enter/leave states)
2. Portal rendering option (avoid z-index conflicts)
3. Grouped sections with headings (semantic structure)
4. Separators for visual organization
5. Modal vs non-modal modes
6. Programmatic open/close API
7. Custom positioning overrides

**Nice-to-Have (Level 3)**:
1. Multi-select mode (checkbox menu items)
2. Nested submenus
3. Tooltip integration (for menu items)
4. Icons with built-in spacing
5. Keyboard shortcuts display
6. Search/filter within menu
7. Virtual scrolling for long lists

---

### Styling Strategy

**Headless Mode** (optional):
```html
<!-- Unstyled mode for maximum flexibility -->
<ui-menu headless>
  <button slot="trigger">Menu</button>
  <div slot="items">
    <a href="/settings">Settings</a>
  </div>
</ui-menu>
```

**Styled Mode** (default):
```html
<!-- Beautiful defaults out of the box -->
<ui-menu>
  <button slot="trigger">Menu</button>
  <div slot="items">
    <a href="/settings">Settings</a>
  </div>
</ui-menu>
```

**Hybrid Approach**: Provide CSS custom properties for easy theming while maintaining default styles:
```css
ui-menu {
  --menu-bg: white;
  --menu-border: 1px solid #ccc;
  --menu-shadow: 0 2px 8px rgba(0,0,0,0.1);
  --item-padding: 0.5rem 1rem;
  --item-focus-bg: #f0f0f0;
}
```

---

## Key Insights

### The Headless Philosophy for Menus

**Core Principle**: Separate behavior from appearance.

Headless UI Menu is a "behavior component" that provides:
- ✅ State management (open/close, active item)
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Accessibility (ARIA, screen readers)
- ✅ Positioning logic
- ❌ Visual styling (you provide)

**Why This Matters**:
- Maximum design flexibility (no style overrides needed)
- Smaller bundle size (no CSS shipped)
- Works with any CSS methodology (Tailwind, CSS Modules, styled-components)
- Forces consideration of accessibility (not hidden behind default styles)

**Trade-off**:
- Higher initial implementation cost (must style everything)
- Requires CSS expertise for proper state styling
- No "quick start" with default appearance

---

### Comparison: Headless vs Styled Component Libraries

| Aspect | Headless UI (Unstyled) | Styled Libraries (Ant, MUI) |
|--------|------------------------|----------------------------|
| **Time to First Render** | Slower (must style) | Faster (pre-styled) |
| **Design Flexibility** | Complete control | Override system required |
| **Bundle Size** | Small (~5-10kb) | Large (100-300kb+) |
| **Learning Curve** | Low API, high CSS | High API, low CSS |
| **Maintenance** | Update styles manually | Update library version |
| **Consistency** | Manual (your responsibility) | Automatic (theme system) |
| **Accessibility** | Built-in, explicit | Built-in, transparent |

---

### Menu vs Dropdown: Terminology Clarity

**Headless UI's Terminology**:
- Component is called "Menu" (not Dropdown)
- Based on WAI-ARIA Menu pattern
- Designed for command menus and navigation lists

**Industry Terminology Variations**:
- "Dropdown" → Generic term for any popover triggered by a button
- "Menu" → Specifically for lists of actions/commands/navigation
- "Select" → For choosing from options (form control)
- "Popover" → Generic positioned overlay

**Semantic UI Consideration**: Choose clear, natural language naming that matches user mental models. Consider:
- `<ui-menu>` for action/navigation menus
- `<ui-dropdown>` for generic dropdown functionality
- `<ui-select>` for form select controls
- Clear documentation on when to use each

---

## URL Verification Status

- **Documentation URL**: https://headlessui.com/react/menu
  - Status: ✅ Accessible and comprehensive
  - Content: Complete API reference, examples, accessibility guide

- **Research Method**: Direct documentation fetch via WebFetch tool
- **Research Date**: 2025-11-04
- **Framework Version**: Headless UI v2.x (current stable)
- **Framework**: React (16.8+)
- **License**: MIT

---

## Summary

Headless UI Menu is a **behavior-only component** that provides:

1. **Complete keyboard navigation** (arrows, Home/End, type-ahead, Enter/Space/Escape)
2. **Automatic accessibility** (WAI-ARIA compliance, focus management, screen reader support)
3. **Intelligent positioning** (anchor prop with viewport detection and auto-flip)
4. **State management** (open/close, active item, disabled handling)
5. **Zero styling** (developer provides all CSS)

**Key Differentiator**: Headless UI prioritizes flexibility and accessibility over convenience. It requires more initial setup but provides complete design control.

**Best For**: Projects with custom design systems, teams comfortable with utility-first CSS (Tailwind), and applications requiring maximum styling flexibility.

**Not Ideal For**: Rapid prototyping, teams wanting pre-designed components, or projects without dedicated design resources.

The headless approach represents a paradigm shift from "complete components" to "behavior primitives," allowing frameworks like Semantic UI to choose where to fall on the spectrum between fully styled and completely unstyled.

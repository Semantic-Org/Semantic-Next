# Radix UI - Menubar Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/menubar
Status: ✅ Working
Version: 1.1.16
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Excellent documentation with complete API reference, accessibility guidelines, keyboard interactions, styling approaches with CSS custom properties, and detailed examples demonstrating all component capabilities.

## Component Definition
- **Core purpose**: Provides a visually persistent menu common in desktop applications, giving quick access to a consistent set of commands or actions. Functions as a menu bar positioned at the top of an application or window.
- **Mental model**: Users think of this as the traditional desktop application menu bar (like File/Edit/View menus in applications). It's a persistent, always-visible navigation and command structure.
- **Semantic meaning**: Represents a collection of related command menus that are always accessible. Communicates the primary actions and organizational structure of an application at the top-level navigation tier.

## Pattern Support Levels
- **Native**: Dedicated component APIs and props (e.g., `value`, `onValueChange`, `checked`, `disabled`)
- **Composed**: Via composition with children and multiple component parts (e.g., submenus, groups, separators)
- **CSS-only**: Styling and animations using data attributes and CSS custom properties

## Architecture Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Compound components | ✅ | Native | 15+ component parts compose the complete menubar system |
| Controlled/Uncontrolled | ✅ | Native | Supports both `value`/`onValueChange` (controlled) and `defaultValue` (uncontrolled) |
| Portal rendering | ✅ | Native | Built-in Portal component for rendering content in document body |
| Submenu nesting | ✅ | Composed | Sub, SubTrigger, SubContent components for nested menus |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Standard children pattern for all item types |
| Icon support | ✅ | Composed | Via children composition within items |
| Checkbox items | ✅ | Native | Dedicated CheckboxItem component with state |
| Radio items | ✅ | Native | Dedicated RadioItem component for exclusive selection |
| Labels | ✅ | Native | Dedicated Label component for non-focusable section headers |
| Custom content | ✅ | Composed | Full flexibility via children for any item content |
| Separators | ✅ | Native | Dedicated Separator component |
| Visual indicators | ✅ | Native | ItemIndicator component shows checked/selected state |
| Arrow connector | ✅ | Native | Optional Arrow component for visual connection |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/closed state | ✅ | Native | Managed via value/defaultValue on Root |
| Active menu tracking | ✅ | Native | Root tracks which menu is currently open |
| Disabled items | ✅ | Native | `disabled` prop on Item, CheckboxItem, RadioItem |
| Checked state | ✅ | Native | `checked` prop on CheckboxItem with boolean or 'indeterminate' |
| Selected state | ✅ | Native | RadioItem with `checked` prop and value matching |
| Highlighted state | ✅ | CSS-only | Exposed via `[data-highlighted]` attribute |
| Focus management | ✅ | Native | Automatic roving tabindex implementation |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ✅ | Native | Full arrow key navigation, Enter, Space, Escape |
| Type-ahead search | ✅ | Native | Quick navigation via keyboard input; `textValue` prop for custom text |
| Mouse interaction | ✅ | Native | Click to open, hover behaviors |
| Touch support | ✅ | Native | Works on touch devices |
| Focus trapping | ✅ | Native | Focus managed within open menu |
| Auto-focus | ✅ | Native | First/last item focused on open |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal menu bar | ✅ | Native | Primary layout - triggers arranged horizontally |
| Vertical dropdowns | ✅ | Native | Content appears in vertical dropdown panels |
| Submenu positioning | ✅ | Native | Submenus appear to the side with directional support |
| RTL support | ✅ | Native | `dir` prop on Root for right-to-left layouts |
| Item grouping | ✅ | Native | Group component for logical item organization |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Side placement | ✅ | Native | `side` prop: 'top', 'right', 'bottom', 'left' |
| Alignment | ✅ | Native | `align` prop: 'start', 'center', 'end' |
| Offset control | ✅ | Native | `sideOffset` and `alignOffset` props for pixel precision |
| Collision detection | ✅ | Native | `avoidCollisions` prop with smart repositioning |
| Collision boundary | ✅ | Native | `collisionBoundary` and `collisionPadding` for custom constraints |
| Sticky positioning | ✅ | Native | `sticky` prop with priority axis control |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| CSS custom properties | ✅ | CSS-only | 6 CSS variables for size and positioning data |
| Data attributes | ✅ | CSS-only | `[data-state]`, `[data-side]`, `[data-align]`, `[data-highlighted]`, `[data-disabled]` |
| Transform origin | ✅ | CSS-only | `--radix-menubar-content-transform-origin` for directional animations |
| Dimension constraints | ✅ | CSS-only | Variables for trigger width/height and available space |
| Collision-aware styling | ✅ | CSS-only | Data attributes reflect runtime collision adjustments |
| Custom styling | ✅ | CSS-only | Full control via className and style props |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| WAI-ARIA compliance | ✅ | Native | Implements Menu Button pattern with roving tabindex |
| Keyboard operability | ✅ | Native | Complete keyboard control without mouse dependency |
| Screen reader support | ✅ | Native | Proper ARIA attributes for state communication |
| Focus indicators | ✅ | Native/CSS-only | Automatic focus management with visual styling via data attributes |
| Semantic HTML | ✅ | Native | Proper roles and relationships |

## Component Parts

### Root Level
- `Menubar.Root` - Container for all menubar parts
  - Props: `asChild`, `value`, `defaultValue`, `onValueChange`, `dir`, `loop`

### Menu Level
- `Menubar.Menu` - Individual top-level menu container
  - Props: `value` (required)

- `Menubar.Trigger` - Button that opens/closes menu content
  - Props: `asChild`
  - Data: `[data-state]`, `[data-highlighted]`, `[data-disabled]`

### Content Level
- `Menubar.Portal` - Renders content in document body
  - Props: `container`, `forceMount`

- `Menubar.Content` - Dropdown menu container
  - Props: `asChild`, `loop`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`, `forceMount`, `side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `arrowPadding`, `sticky`, `hideWhenDetached`
  - Data: `[data-state]`, `[data-side]`, `[data-align]`

- `Menubar.Arrow` - Optional visual arrow pointing to trigger
  - Props: `asChild`, `width`, `height`

### Item Types
- `Menubar.Item` - Standard menu action item
  - Props: `asChild`, `disabled`, `onSelect`, `textValue`
  - Data: `[data-highlighted]`, `[data-disabled]`

- `Menubar.CheckboxItem` - Toggle state item
  - Props: `asChild`, `checked`, `onCheckedChange`, `disabled`, `onSelect`, `textValue`
  - Data: `[data-state]`, `[data-highlighted]`, `[data-disabled]`

- `Menubar.RadioGroup` - Container for radio items
  - Props: `asChild`, `value`, `onValueChange`

- `Menubar.RadioItem` - Mutually exclusive selection item
  - Props: `asChild`, `value` (required), `disabled`, `onSelect`, `textValue`
  - Data: `[data-state]`, `[data-highlighted]`, `[data-disabled]`

- `Menubar.ItemIndicator` - Shows checked/selected state
  - Props: `asChild`, `forceMount`
  - Data: `[data-state]`

- `Menubar.Label` - Non-focusable section label
  - Props: `asChild`

- `Menubar.Group` - Logical grouping container
  - Props: `asChild`

- `Menubar.Separator` - Visual divider
  - Props: `asChild`

### Submenu Structure
- `Menubar.Sub` - Submenu container
  - Props: `defaultOpen`, `open`, `onOpenChange`

- `Menubar.SubTrigger` - Opens nested menu
  - Props: `asChild`, `disabled`, `textValue`
  - Data: `[data-state]`, `[data-highlighted]`, `[data-disabled]`

- `Menubar.SubContent` - Submenu dropdown
  - Props: Same as Content (positioning, collision, etc.)
  - Data: `[data-state]`, `[data-side]`, `[data-align]`

## Code Examples

### Basic Menubar Structure
```jsx
import * as Menubar from '@radix-ui/react-menubar';

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>New Tab</Menubar.Item>
        <Menubar.Item>New Window</Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item disabled>Print...</Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

### Checkbox Items with Indicators
```jsx
<Menubar.CheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
  <Menubar.ItemIndicator>
    <CheckIcon />
  </Menubar.ItemIndicator>
  Show Bookmarks
</Menubar.CheckboxItem>
```

### Radio Group for Exclusive Selection
```jsx
<Menubar.RadioGroup value={person} onValueChange={setPerson}>
  <Menubar.RadioItem value="pedro">
    <Menubar.ItemIndicator>
      <DotIcon />
    </Menubar.ItemIndicator>
    Pedro Duarte
  </Menubar.RadioItem>
  <Menubar.RadioItem value="colm">
    <Menubar.ItemIndicator>
      <DotIcon />
    </Menubar.ItemIndicator>
    Colm Tuite
  </Menubar.RadioItem>
</Menubar.RadioGroup>
```

### Submenu Structure
```jsx
<Menubar.Sub>
  <Menubar.SubTrigger>Share</Menubar.SubTrigger>
  <Menubar.Portal>
    <Menubar.SubContent>
      <Menubar.Item>Email link</Menubar.Item>
      <Menubar.Item>Messages</Menubar.Item>
      <Menubar.Item>Notes</Menubar.Item>
    </Menubar.SubContent>
  </Menubar.Portal>
</Menubar.Sub>
```

### Positioning and Collision Handling
```jsx
<Menubar.Content
  side="bottom"
  align="start"
  sideOffset={5}
  alignOffset={-5}
  avoidCollisions={true}
  collisionPadding={10}
>
  {/* content */}
</Menubar.Content>
```

### Styled with CSS Custom Properties
```css
.MenubarContent {
  width: var(--radix-menubar-trigger-width);
  max-height: var(--radix-menubar-content-available-height);
  transform-origin: var(--radix-menubar-content-transform-origin);
}

/* Origin-aware animation */
.MenubarContent[data-side="top"] {
  animation: slideDown 0.3s ease;
}

.MenubarContent[data-side="bottom"] {
  animation: slideUp 0.3s ease;
}
```

### Controlled State Management
```jsx
function App() {
  const [activeMenu, setActiveMenu] = useState('');

  return (
    <Menubar.Root value={activeMenu} onValueChange={setActiveMenu}>
      <Menubar.Menu value="file">
        <Menubar.Trigger>File</Menubar.Trigger>
        {/* content */}
      </Menubar.Menu>
      <Menubar.Menu value="edit">
        <Menubar.Trigger>Edit</Menubar.Trigger>
        {/* content */}
      </Menubar.Menu>
    </Menubar.Root>
  );
}
```

## Keyboard Interactions

| Key | Behavior |
|-----|----------|
| **Space** | When focus is on Trigger, opens menu. When focus is on Item, activates item. |
| **Enter** | When focus is on Trigger, opens menu. When focus is on Item, activates item. |
| **ArrowDown** | When focus is on Trigger, opens menu. When focus is on Item, moves focus to next item. |
| **ArrowUp** | When focus is on Item, moves focus to previous item. |
| **ArrowRight** | When focus is on Trigger, moves focus to next trigger. When focus is on SubTrigger, opens submenu. |
| **ArrowLeft** | When focus is on Trigger, moves focus to previous trigger. When focus is on SubTrigger or in submenu, closes submenu. |
| **Esc** | Closes currently open menu and moves focus to its trigger. |
| **Character keys** | Activates type-ahead navigation to matching items. |

## Props/API Documentation

### Menubar.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `value` | string | — | Controlled active menu value |
| `defaultValue` | string | — | Uncontrolled default active menu |
| `onValueChange` | (value: string) => void | — | Callback when active menu changes |
| `dir` | 'ltr' \| 'rtl' | — | Reading direction for submenus |
| `loop` | boolean | false | Whether keyboard navigation wraps |

### Menubar.Menu
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | — | Required unique identifier for this menu |

### Menubar.Trigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |

**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### Menubar.Content
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `loop` | boolean | false | Whether keyboard navigation wraps |
| `onCloseAutoFocus` | (event) => void | — | Focus return behavior |
| `onEscapeKeyDown` | (event) => void | — | Escape key handler |
| `onPointerDownOutside` | (event) => void | — | Outside click handler |
| `onFocusOutside` | (event) => void | — | Outside focus handler |
| `onInteractOutside` | (event) => void | — | Outside interaction handler |
| `forceMount` | boolean | — | Force mounting for animation control |
| `side` | 'top' \| 'right' \| 'bottom' \| 'left' | 'bottom' | Preferred side relative to trigger |
| `sideOffset` | number | 0 | Pixel offset from trigger |
| `align` | 'start' \| 'center' \| 'end' | 'center' | Alignment relative to trigger |
| `alignOffset` | number | 0 | Pixel offset from alignment |
| `avoidCollisions` | boolean | true | Enable collision detection |
| `collisionBoundary` | Element \| Element[] | [] | Collision boundary elements |
| `collisionPadding` | number \| Partial<Record<Side, number>> | 0 | Padding from boundary edges |
| `arrowPadding` | number | 0 | Minimum padding from arrow to content edges |
| `sticky` | 'partial' \| 'always' | 'partial' | Sticky behavior during overflow |
| `hideWhenDetached` | boolean | false | Hide when trigger is fully occluded |

**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-side]`: "top" | "right" | "bottom" | "left"
- `[data-align]`: "start" | "center" | "end"

**CSS Variables:**
- `--radix-menubar-content-transform-origin`: Computed transform origin for animations
- `--radix-menubar-trigger-width`: Width of trigger element
- `--radix-menubar-trigger-height`: Height of trigger element
- `--radix-menubar-content-available-width`: Available width without causing overflow
- `--radix-menubar-content-available-height`: Available height without causing overflow

### Menubar.Item
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `disabled` | boolean | false | Prevents interaction |
| `onSelect` | (event) => void | — | Callback when item is selected |
| `textValue` | string | — | Text for type-ahead (defaults to content) |

**Data Attributes:**
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### Menubar.CheckboxItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `checked` | boolean \| 'indeterminate' | false | Checked state |
| `onCheckedChange` | (checked: boolean) => void | — | Callback when state changes |
| `disabled` | boolean | false | Prevents interaction |
| `onSelect` | (event) => void | — | Callback when item is selected |
| `textValue` | string | — | Text for type-ahead |

**Data Attributes:**
- `[data-state]`: "checked" | "unchecked" | "indeterminate"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### Menubar.RadioGroup
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `value` | string | — | Controlled selected value |
| `onValueChange` | (value: string) => void | — | Callback when selection changes |

### Menubar.RadioItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `value` | string | — | Required unique identifier |
| `disabled` | boolean | false | Prevents interaction |
| `onSelect` | (event) => void | — | Callback when item is selected |
| `textValue` | string | — | Text for type-ahead |

**Data Attributes:**
- `[data-state]`: "checked" | "unchecked"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### Menubar.ItemIndicator
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `forceMount` | boolean | — | Force mounting for animation control |

**Data Attributes:**
- `[data-state]`: "checked" | "unchecked"

### Menubar.Sub
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | boolean | false | Uncontrolled default open state |
| `open` | boolean | — | Controlled open state |
| `onOpenChange` | (open: boolean) => void | — | Callback when state changes |

### Menubar.SubTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `disabled` | boolean | false | Prevents interaction |
| `textValue` | string | — | Text for type-ahead |

**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### Menubar.SubContent
Same props as Menubar.Content (positioning, collision detection, event handlers, etc.)

### Menubar.Separator
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |

### Menubar.Label
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |

### Menubar.Group
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |

### Menubar.Arrow
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | false | Merge props onto child element |
| `width` | number | 10 | Arrow width in pixels |
| `height` | number | 5 | Arrow height in pixels |

## Notable Features

### Comprehensive Component System
Radix UI provides an exceptional 15+ component parts for building complete menubar interfaces. This is the most granular and composable menubar API in the ecosystem, with dedicated components for every use case including checkbox items, radio groups, submenus, separators, labels, and visual indicators.

### Advanced Positioning Engine
The positioning system is remarkably sophisticated with:
- Full control over side placement and alignment
- Pixel-precise offset controls (both side and align)
- Intelligent collision detection with configurable boundaries
- Sticky positioning with priority axis control
- Runtime-adjusted positioning exposed via data attributes
- Hide-when-detached for fully occluded triggers

### CSS Custom Properties Architecture
The 6 CSS variables provided expose crucial layout information:
- Transform origin for direction-aware animations
- Trigger dimensions for size matching
- Available space calculations for responsive constraints
- This enables animations that respond to actual positioning decisions

### State Management Flexibility
Complete support for both controlled and uncontrolled patterns at multiple levels:
- Root level for active menu tracking
- Submenu level for open/close state
- CheckboxItem and RadioGroup for selection state
- Allows progressive enhancement from simple to complex state management

### Type-Ahead Navigation
Built-in type-ahead with configurable `textValue` prop allows custom text matching beyond visible content. Enhances accessibility and power-user workflows.

### Accessibility as Foundation
The implementation prioritizes accessibility with:
- Full WAI-ARIA Menu Button pattern compliance
- Roving tabindex focus management
- Complete keyboard operability without mouse
- Proper semantic roles and state communication
- Screen reader optimized

### Polymorphic Components
Every component supports `asChild` prop for complete rendering control, enabling integration with animation libraries, custom styling systems, or other component libraries without wrapper elements.

### Event Handler Richness
Extensive event handlers for fine-grained control:
- Auto-focus behavior customization
- Outside interaction handling (pointer, focus, keyboard)
- Selection callbacks with event access
- Change callbacks for all stateful components

### Reading Direction Support
Native RTL support via `dir` prop on Root, with proper submenu positioning adjustments. Essential for internationalized applications.

### Portal Architecture
Built-in Portal component for rendering menu content in document body, preventing z-index issues and CSS containment problems common in complex layouts.

## Variants and Composition Patterns

### Menu Types Demonstrated
- **File operations**: New Tab, New Window, Print (with disabled state)
- **View toggles**: Checkbox items for UI element visibility
- **Profile selection**: Radio group for exclusive user selection
- **Nested actions**: Submenus for Share operations

### Composition Strategies
- **Grouping**: Use Group with Label for logical sections
- **Indicators**: ItemIndicator renders only when checked, perfect for icons
- **Separators**: Visual dividers between logical groups
- **Mixed content**: Combine Items, CheckboxItems, RadioItems, and Subs in single menu

### State Patterns
- **Indeterminate checkboxes**: Support for tri-state checkbox UI
- **Disabled items**: Can disable any item type while keeping visible
- **Controlled menus**: Full control over which menu is open
- **Uncontrolled simplicity**: Works great with just defaultValue

## Research Notes

### Documentation Strengths
- Exceptional API reference with complete prop tables
- Clear keyboard interaction documentation
- Excellent accessibility compliance explanation
- CSS custom properties well-documented with use cases
- Real-world examples with File/Edit/View/Profiles menus

### Implementation Philosophy
Radix UI clearly prioritizes:
1. **Composition over configuration**: Many small components rather than mega-component with all props
2. **Unstyled primitives**: Zero styling opinions, maximum control
3. **Accessibility first**: WAI-ARIA patterns as foundation, not afterthought
4. **Animation-ready**: CSS variables and data attributes designed for transitions
5. **Framework integration**: Polymorphic components via asChild for seamless integration

### Package Information
- Version: 1.1.16
- Size: 34.6 kB gzipped
- Package: @radix-ui/react-menubar
- Part of larger Radix Primitives collection

### Unique Aspects
This is the most comprehensive unstyled menubar primitive in the React ecosystem. The level of control and composition flexibility is exceptional, with features like collision detection, CSS variables for layout data, and complete accessibility built-in. The compound component architecture is more granular than any other framework's menubar implementation.

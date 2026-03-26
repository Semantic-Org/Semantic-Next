# ShadCN - Context Menu Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/context-menu
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides clear examples, installation instructions, and covers all component variants with working code examples. Well-structured with clear composition patterns.

## Component Definition
- **Core purpose**: Display a menu of actions or functions triggered by right-click (context menu) interaction on an element
- **Mental model**: Right-click activated overlay menu, similar to native OS context menus, providing contextual actions related to the trigger element
- **Semantic meaning**: Communicates available actions/operations contextually relevant to the element being interacted with, following the familiar desktop application pattern

## Pattern Support Levels
- **Native**: Dedicated component/prop API
- **Composed**: Via composition of sub-components
- **CSS-only**: Requires custom styling with className

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Menu items contain text via children |
| Icon support | ✅ | Composed | Icons can be added via children composition |
| Keyboard shortcuts | ✅ | Composed | `ContextMenuShortcut` component for displaying shortcuts |
| Section labels | ✅ | Composed | `ContextMenuLabel` for categorizing menu sections |
| Separators | ✅ | Composed | `ContextMenuSeparator` for visual grouping |
| Custom content | ✅ | Composed | Any React children accepted |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard menu items | ✅ | Composed | `ContextMenuItem` for basic actions |
| Checkbox items | ✅ | Composed | `ContextMenuCheckboxItem` with checked state |
| Radio items | ✅ | Composed | `ContextMenuRadioItem` within `ContextMenuRadioGroup` |
| Nested submenus | ✅ | Composed | `ContextMenuSub` with `ContextMenuSubTrigger` and `ContextMenuSubContent` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled items | ✅ | Native | `disabled` prop on menu items |
| Checked state | ✅ | Native | `checked` prop on checkbox items |
| Selected value | ✅ | Native | `value` prop on radio groups |
| Open/closed | ✅ | Native | Controlled via right-click interaction |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inset spacing | ✅ | Native | `inset` prop adds consistent spacing |
| Destructive variant | ✅ | Native | `variant="destructive"` for dangerous actions |
| Custom width | ✅ | CSS-only | `className="w-44"` or similar utility classes |
| Custom styling | ✅ | CSS-only | All components accept `className` prop |

## Code Examples

### Basic Context Menu
```jsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Advanced Usage with All Features
```jsx
<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent className="w-64">
    <ContextMenuItem inset>
      Back
      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem inset disabled>
      Forward
      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem inset>
      Reload
      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked>
      Show Bookmarks
      <ContextMenuShortcut>⌘B</ContextMenuShortcut>
    </ContextMenuCheckboxItem>
    <ContextMenuCheckboxItem>
      Show Full URLs
    </ContextMenuCheckboxItem>
    <ContextMenuSeparator />
    <ContextMenuRadioGroup value="pedro">
      <ContextMenuLabel inset>People</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuRadioItem value="pedro">
        Pedro Duarte
      </ContextMenuRadioItem>
      <ContextMenuRadioItem value="colm">
        Colm Tuite
      </ContextMenuRadioItem>
    </ContextMenuRadioGroup>
  </ContextMenuContent>
</ContextMenu>
```

### Nested Submenus
```jsx
<ContextMenuSub>
  <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
  <ContextMenuSubContent className="w-48">
    <ContextMenuItem>
      Save Page As...
      <ContextMenuShortcut>⌘S</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
    <ContextMenuItem>Name Window...</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Developer Tools</ContextMenuItem>
  </ContextMenuSubContent>
</ContextMenuSub>
```

### Destructive Action Pattern
```jsx
<ContextMenuItem variant="destructive">
  Delete
  <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
</ContextMenuItem>
```

[View Live](https://ui.shadcn.com/docs/components/context-menu)

## Component Architecture

### Composition Structure
The Context Menu follows a hierarchical composition pattern with clear parent-child relationships:

```
ContextMenu (root wrapper)
├── ContextMenuTrigger (element to right-click)
└── ContextMenuContent (menu overlay)
    ├── ContextMenuItem (standard action)
    ├── ContextMenuCheckboxItem (toggleable item)
    ├── ContextMenuRadioGroup (exclusive selection)
    │   ├── ContextMenuLabel (section header)
    │   └── ContextMenuRadioItem (radio option)
    ├── ContextMenuSub (nested submenu)
    │   ├── ContextMenuSubTrigger (submenu activator)
    │   └── ContextMenuSubContent (submenu overlay)
    ├── ContextMenuSeparator (divider)
    └── ContextMenuShortcut (keyboard hint)
```

### Props/API Documentation

**ContextMenu**
- Root wrapper component
- No documented custom props (wrapper only)

**ContextMenuTrigger**
- Children: React element to attach context menu to
- Activates on right-click

**ContextMenuContent**
- `className`: Optional styling
- Children: Menu items and components

**ContextMenuItem**
- `inset`: Boolean - adds consistent inset spacing
- `disabled`: Boolean - disables interaction
- `variant`: "default" | "destructive" - visual style
- `className`: Optional styling
- Children: Item content (text, icons, shortcuts)

**ContextMenuCheckboxItem**
- `checked`: Boolean - checkbox state
- `inset`: Boolean - adds inset spacing
- `disabled`: Boolean - disables interaction
- `className`: Optional styling
- Children: Item content

**ContextMenuRadioGroup**
- `value`: String - selected radio value
- `onValueChange`: Function - value change handler
- Children: Radio items

**ContextMenuRadioItem**
- `value`: String - radio value identifier
- `inset`: Boolean - adds inset spacing
- `disabled`: Boolean - disables interaction
- `className`: Optional styling
- Children: Item content

**ContextMenuLabel**
- `inset`: Boolean - adds inset spacing
- `className`: Optional styling
- Children: Label text

**ContextMenuSeparator**
- No custom props
- Visual divider only

**ContextMenuSub**
- Root wrapper for nested submenu
- No documented custom props

**ContextMenuSubTrigger**
- `inset`: Boolean - adds inset spacing
- `disabled`: Boolean - disables interaction
- `className`: Optional styling
- Children: Trigger content

**ContextMenuSubContent**
- `className`: Optional styling (commonly used for width)
- Children: Nested menu items

**ContextMenuShortcut**
- No custom props
- Children: Keyboard shortcut text (e.g., "⌘S")

## Styling Approaches

### Tailwind-Based Styling
ShadCN uses Tailwind CSS for all styling:

```jsx
// Custom width via className
<ContextMenuContent className="w-64">

// Custom submenu width
<ContextMenuSubContent className="w-48">
```

### Variant System
Built-in variant prop for semantic actions:
```jsx
<ContextMenuItem variant="destructive">
  Delete
</ContextMenuItem>
```

### Inset Pattern
Consistent `inset` prop across multiple components:
```jsx
<ContextMenuItem inset>Back</ContextMenuItem>
<ContextMenuLabel inset>People</ContextMenuLabel>
<ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
```

## Accessibility Patterns

### Keyboard Navigation
- Full keyboard navigation support (documented as inherited from Radix UI)
- Right-click or keyboard trigger support
- Arrow key navigation through menu items
- Enter/Space to select items
- Escape to close menu

### ARIA Implementation
Built on Radix UI primitives which provide:
- Proper ARIA roles and attributes
- Focus management
- Keyboard interaction patterns
- Screen reader announcements

### Semantic HTML
- Uses semantic button/menu roles
- Proper focus indicators
- Disabled state support

## Notable Features

1. **Radix UI Integration**: Built on top of Radix UI's Context Menu primitive, inheriting robust accessibility and keyboard navigation
2. **Composition First**: Highly composable API with dedicated components for each menu element type
3. **Keyboard Shortcuts Display**: Dedicated `ContextMenuShortcut` component for visual keyboard hints (display only, not functional bindings)
4. **Nested Submenu Support**: Full support for arbitrarily nested submenus with `ContextMenuSub` pattern
5. **Radio and Checkbox Patterns**: Native support for both exclusive (radio) and non-exclusive (checkbox) selection patterns
6. **Inset Consistency**: Uniform `inset` prop across multiple component types for alignment
7. **Destructive Variant**: Built-in semantic variant for dangerous actions
8. **Flexible Trigger**: Any React element can be a trigger via children composition
9. **Installation via CLI**: Uses ShadCN CLI for component installation (`pnpm dlx shadcn@latest add context-menu`)
10. **Tailwind Integration**: Native Tailwind CSS styling with className support on all components

## Research Notes

- Documentation is clear and comprehensive with practical examples
- Component demonstrates clear separation between structure (composition) and styling (Tailwind)
- The keyboard shortcut component is presentation-only; actual keyboard handling would need to be implemented separately
- All component variants and patterns are well-documented with code examples
- The Radix UI foundation provides enterprise-grade accessibility without additional configuration
- The destructive variant is the only documented semantic variant (no primary, secondary, etc.)
- No explicit size variants documented (sizing controlled via className)
- No loading or disabled states for the menu itself (only individual items can be disabled)
- The component follows ShadCN's philosophy of "copy and paste" components rather than installed dependencies

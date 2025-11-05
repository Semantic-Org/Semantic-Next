# ShadCN - Menubar Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/menubar
Status: ✅ Working
Version: Current (based on Radix UI Primitives)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Includes clear examples, installation instructions, composition patterns, and references to underlying Radix UI API documentation.

## Component Definition
- **Core purpose**: Provides a visually persistent menu bar common in desktop applications that gives quick access to a consistent set of commands. Mimics the menu bar pattern found in applications like macOS menu bars or traditional desktop software.
- **Mental model**: A horizontal bar containing multiple top-level menu triggers, each revealing a dropdown menu with commands, checkboxes, radio options, and submenus. Stays visible and accessible at all times.
- **Semantic meaning**: Communicates primary application commands and navigation in a persistent, organized structure. Signals desktop-application-style functionality to users.

## Pattern Support Levels
- **Native**: Built on Radix UI primitives with dedicated components for all functionality
- **Composed**: Hierarchical composition of specialized components
- **CSS-only**: Styled through Tailwind CSS classes and CSS variables

## Architecture Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Radix UI foundation | ✅ | Native | Built on @radix-ui/react-menubar primitives |
| Compositional API | ✅ | Native | Multiple specialized components compose together |
| Controlled state | ✅ | Native | value/onValueChange for controlled behavior |
| Uncontrolled state | ✅ | Native | defaultValue for uncontrolled behavior |
| Portal rendering | ✅ | Native | Optional portal to document.body |
| Polymorphic components | ✅ | Native | asChild prop for component composition |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text items | ✅ | Composed | MenubarItem with text children |
| Icon + text | ✅ | Composed | Custom composition within items |
| Keyboard shortcuts | ✅ | Native | MenubarShortcut component for displaying shortcuts |
| Labels | ✅ | Native | MenubarLabel for non-interactive labels |
| Separators | ✅ | Native | MenubarSeparator for visual grouping |
| Custom content | ✅ | Composed | Any React children in items |

## Menu Structure Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Multiple menus | ✅ | Native | Multiple MenubarMenu components |
| Nested submenus | ✅ | Native | MenubarSub with SubTrigger and SubContent |
| Menu grouping | ✅ | Native | MenubarGroup for logical grouping |
| Radio groups | ✅ | Native | MenubarRadioGroup and MenubarRadioItem |
| Checkbox items | ✅ | Native | MenubarCheckboxItem with checked state |
| Standard items | ✅ | Native | MenubarItem for basic actions |
| Disabled items | ✅ | Native | disabled prop on items |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/closed state | ✅ | Native | Controlled via value/defaultValue |
| Checked state | ✅ | Native | CheckboxItem with checked prop (boolean or 'indeterminate') |
| Selected state | ✅ | Native | RadioItem within RadioGroup |
| Highlighted state | ✅ | Native | data-highlighted attribute |
| Disabled state | ✅ | Native | disabled prop on items and triggers |
| Focus management | ✅ | Native | Roving tabindex implementation |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to open | ✅ | Native | MenubarTrigger opens menu |
| Keyboard navigation | ✅ | Native | Full keyboard support (arrows, enter, space, escape) |
| Focus trapping | ✅ | Native | Focus contained within open menu |
| Auto-close | ✅ | Native | Closes on selection or outside click |
| Hover behavior | ✅ | Native | Optional hover to open adjacent menus |
| onSelect callback | ✅ | Native | Fires when item is selected |
| onCheckedChange | ✅ | Native | Fires when checkbox/radio state changes |
| onValueChange | ✅ | Native | Fires when active menu changes |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Side positioning | ✅ | Native | side prop: "top" \| "right" \| "bottom" \| "left" |
| Alignment | ✅ | Native | align prop: "start" \| "center" \| "end" |
| Offset control | ✅ | Native | sideOffset and alignOffset props |
| Collision detection | ✅ | Native | avoidCollisions prop |
| Collision boundary | ✅ | Native | collisionBoundary prop |
| Sticky positioning | ✅ | Native | sticky prop |
| Submenu positioning | ✅ | Native | Automatic submenu positioning |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tailwind classes | ✅ | CSS-only | Styled with Tailwind utility classes |
| CSS variables | ✅ | Native | --radix-menubar-content-transform-origin, dimension vars |
| Data attributes | ✅ | Native | data-state, data-highlighted, data-disabled, data-side, data-align |
| Inset spacing | ✅ | Native | inset prop for visual indentation |
| Custom styling | ✅ | CSS-only | Full control via className prop |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA compliance | ✅ | Native | Follows Menu Button WAI-ARIA design pattern |
| Keyboard navigation | ✅ | Native | Arrow keys, Enter, Space, Escape |
| Focus management | ✅ | Native | Roving tabindex for items |
| Screen reader support | ✅ | Native | Proper ARIA attributes |
| Disabled state | ✅ | Native | Properly communicated to assistive tech |
| Focus return | ✅ | Native | Returns focus to trigger on close |

## Code Examples

### Basic Menubar
```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem disabled>New Incognito Window</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Undo <MenubarShortcut>⌘Z</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### Checkbox Items
```tsx
<MenubarMenu>
  <MenubarTrigger>View</MenubarTrigger>
  <MenubarContent>
    <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
    <MenubarCheckboxItem checked>
      Always Show Full URLs
    </MenubarCheckboxItem>
  </MenubarContent>
</MenubarMenu>
```

### Radio Groups
```tsx
<MenubarMenu>
  <MenubarTrigger>Profiles</MenubarTrigger>
  <MenubarContent>
    <MenubarRadioGroup value="benoit">
      <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
      <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
      <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
    </MenubarRadioGroup>
  </MenubarContent>
</MenubarMenu>
```

### Nested Submenus
```tsx
<MenubarMenu>
  <MenubarTrigger>File</MenubarTrigger>
  <MenubarContent>
    <MenubarItem>New Tab</MenubarItem>
    <MenubarSub>
      <MenubarSubTrigger>Share</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem>Email link</MenubarItem>
        <MenubarItem>Messages</MenubarItem>
        <MenubarItem>Notes</MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  </MenubarContent>
</MenubarMenu>
```

### With Inset Spacing
```tsx
<MenubarContent>
  <MenubarItem>
    Back <MenubarShortcut>⌘[</MenubarShortcut>
  </MenubarItem>
  <MenubarItem>
    Forward <MenubarShortcut>⌘]</MenubarShortcut>
  </MenubarItem>
  <MenubarItem>
    Reload <MenubarShortcut>⌘R</MenubarShortcut>
  </MenubarItem>
  <MenubarSeparator />
  <MenubarItem inset>More Tools</MenubarItem>
</MenubarContent>
```

## Component API

### Menubar (Root)
**Props from Radix UI:**
- `defaultValue?: string` - Default active menu (uncontrolled)
- `value?: string` - Active menu value (controlled)
- `onValueChange?: (value: string) => void` - Callback when active menu changes
- `dir?: "ltr" | "rtl"` - Text direction
- `loop?: boolean` - Whether keyboard navigation should loop (default: false)

### MenubarMenu
**Props from Radix UI:**
- `value?: string` - Unique value for this menu

### MenubarTrigger
**Props from Radix UI:**
- `asChild?: boolean` - Render as child element
**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### MenubarContent
**Props from Radix UI:**
- `side?: "top" | "right" | "bottom" | "left"` - Preferred side (default: "bottom")
- `sideOffset?: number` - Distance from trigger (default: 0)
- `align?: "start" | "center" | "end"` - Alignment (default: "start")
- `alignOffset?: number` - Offset from alignment axis (default: 0)
- `avoidCollisions?: boolean` - Prevent collisions (default: true)
- `collisionBoundary?: Element | Element[]` - Collision detection boundary
- `collisionPadding?: number | Partial<Record<Side, number>>` - Padding from boundary
- `sticky?: "partial" | "always"` - Stickiness behavior (default: "partial")
- `onCloseAutoFocus?: (event: Event) => void` - Focus return handler
- `onEscapeKeyDown?: (event: KeyboardEvent) => void` - Escape key handler
- `onPointerDownOutside?: (event: PointerDownOutsideEvent) => void` - Outside click handler
- `forceMount?: boolean` - Force mounting for animation control
**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-side]`: "left" | "right" | "bottom" | "top"
- `[data-align]`: "start" | "end" | "center"
**CSS Variables:**
- `--radix-menubar-content-transform-origin`: Transform origin based on position
- `--radix-menubar-content-available-width`: Available width
- `--radix-menubar-content-available-height`: Available height
- `--radix-menubar-trigger-width`: Trigger width
- `--radix-menubar-trigger-height`: Trigger height

### MenubarItem
**Props from Radix UI:**
- `disabled?: boolean` - Disable the item
- `onSelect?: (event: Event) => void` - Selection callback
- `textValue?: string` - Override text for typeahead
**Data Attributes:**
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### MenubarCheckboxItem
**Props from Radix UI:**
- `checked?: boolean | "indeterminate"` - Checked state
- `onCheckedChange?: (checked: boolean) => void` - State change callback
- `disabled?: boolean` - Disable the item
- `onSelect?: (event: Event) => void` - Selection callback
- `textValue?: string` - Override text for typeahead
**Data Attributes:**
- `[data-state]`: "checked" | "unchecked" | "indeterminate"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### MenubarRadioGroup
**Props from Radix UI:**
- `value?: string` - Selected radio value
- `onValueChange?: (value: string) => void` - Value change callback

### MenubarRadioItem
**Props from Radix UI:**
- `value: string` - Unique value (required)
- `disabled?: boolean` - Disable the item
- `onSelect?: (event: Event) => void` - Selection callback
- `textValue?: string` - Override text for typeahead
**Data Attributes:**
- `[data-state]`: "checked" | "unchecked"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### MenubarSub
**Props from Radix UI:**
- `defaultOpen?: boolean` - Default open state (uncontrolled)
- `open?: boolean` - Open state (controlled)
- `onOpenChange?: (open: boolean) => void` - Open state change callback

### MenubarSubTrigger
**Props from Radix UI:**
- `disabled?: boolean` - Disable the trigger
- `textValue?: string` - Override text for typeahead
**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-highlighted]`: Present when highlighted
- `[data-disabled]`: Present when disabled

### MenubarSubContent
**Props:** Same as MenubarContent
**Data Attributes:** Same as MenubarContent plus:
- `[data-orientation]`: "vertical" | "horizontal"

### MenubarSeparator
**Props from Radix UI:**
- `asChild?: boolean` - Render as child element

### MenubarLabel
**Props from Radix UI:**
- `asChild?: boolean` - Render as child element

### MenubarShortcut
**Purpose:** Displays keyboard shortcuts (ShadCN convention, not Radix primitive)
**Usage:** Typically renders in gray text aligned right

### MenubarGroup
**Props from Radix UI:**
- `asChild?: boolean` - Render as child element

## Installation
```bash
pnpm dlx shadcn@latest add menubar
```

## Notable Features
- **Radix UI Foundation**: Built on battle-tested Radix UI primitives ensuring accessibility and proper behavior
- **Desktop Application Pattern**: Specifically designed to mimic desktop menu bars (macOS, Windows)
- **Comprehensive State Management**: Supports both controlled and uncontrolled patterns
- **Polymorphic Components**: asChild prop allows flexible composition
- **Rich Item Types**: Supports standard items, checkboxes, radio groups, and submenus
- **Keyboard Shortcuts Display**: Dedicated component for showing shortcuts
- **Portal Rendering**: Optional portal for proper z-index layering
- **Collision Detection**: Intelligent positioning to stay within viewport
- **Data Attributes**: Rich data attributes enable state-based styling
- **CSS Variables**: Transform origin and dimension variables for animations
- **Full Keyboard Support**: Complete keyboard navigation matching desktop applications
- **Indeterminate State**: CheckboxItem supports three-state checkboxes
- **Focus Management**: Automatic focus handling with roving tabindex
- **Event Callbacks**: Granular control with onSelect, onCheckedChange, onValueChange
- **RTL Support**: Built-in right-to-left text direction support
- **Loop Navigation**: Optional keyboard navigation looping

## Research Notes
- ShadCN is a styled wrapper around Radix UI primitives, not a separate component library
- Documentation clearly references Radix UI for complete API details
- Installation adds source files to project rather than npm package dependency
- Follows desktop application conventions rather than web-only patterns
- Strong emphasis on keyboard navigation and accessibility
- Component composition is highly granular with specialized components for each pattern
- The MenubarShortcut component appears to be a ShadCN addition for conventional shortcut display
- Data attributes provide hooks for animation and conditional styling
- The API surface is extensive, reflecting the complexity of desktop menu bar patterns

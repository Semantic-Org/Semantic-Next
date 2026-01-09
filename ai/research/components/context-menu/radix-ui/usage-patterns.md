# Radix UI - Context Menu Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/context-menu
Status: ✅ Working
Version: 2.2.16 (32.08 kB gzipped)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with detailed API reference, accessibility features, keyboard interactions, styling guidance, and practical examples.

## Component Definition
- **Core purpose**: Displays a contextual menu at the pointer location, triggered by right-click or long-press, providing quick access to actions relevant to the clicked element.
- **Mental model**: A popup menu that appears on right-click (or long-press on touch devices) to provide context-specific actions. Users expect it to appear exactly where they clicked and contain actions relevant to what they clicked on.
- **Semantic meaning**: Represents contextual actions or options that are specific to the element or area where the user invoked the menu. Communicates "here are the actions you can perform on this item."

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`, `disabled`)
- **Composed**: Via composition/children (e.g., `<ContextMenu.Item>Text</ContextMenu.Item>`)
- **CSS-only**: Requires custom styling (e.g., data attributes like `[data-state]`)

## Architecture Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Compound component API | ✅ | Native | Multi-component system (Root, Trigger, Portal, Content, Item, etc.) |
| Headless/unstyled | ✅ | Native | Pure behavior, no default styling |
| Portal rendering | ✅ | Native | Dedicated `Portal` component for body rendering |
| Composition primitives | ✅ | Native | 13+ specialized components for different parts |

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Via children of Item components |
| Icon support | ✅ | Composed | Via composition within Item children |
| Custom content | ✅ | Composed | Any React children accepted |
| Checkbox items | ✅ | Native | Dedicated `CheckboxItem` component |
| Radio items | ✅ | Native | Dedicated `RadioItem` and `RadioGroup` components |
| Labels | ✅ | Native | Dedicated `Label` component for sections |
| Separators | ✅ | Native | Dedicated `Separator` component |
| Submenus | ✅ | Native | Dedicated `Sub`, `SubTrigger`, `SubContent` components |
| Item indicators | ✅ | Native | Dedicated `ItemIndicator` component for check/radio states |
| Arrow/pointer | ✅ | Native | Optional `Arrow` component |

## Trigger Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Right-click activation | ✅ | Native | Primary trigger method |
| Long-press activation | ✅ | Native | Touch device support |
| Custom trigger element | ✅ | Native | `asChild` prop for custom elements |
| Disabled state | ✅ | Native | `disabled` prop on Trigger |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/closed state | ✅ | Native | `onOpenChange` callback |
| Checked state (checkbox) | ✅ | Native | `checked` prop with boolean or 'indeterminate' |
| Selected state (radio) | ✅ | Native | Via RadioGroup value management |
| Disabled items | ✅ | Native | `disabled` prop on items |
| Highlighted state | ✅ | CSS-only | `[data-highlighted]` attribute |

## Positioning Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Pointer positioning | ✅ | Native | Appears at click/touch location |
| Side offset | ✅ | Native | `sideOffset` prop |
| Align offset | ✅ | Native | `alignOffset` prop |
| Collision detection | ✅ | Native | `avoidCollisions` prop (default true) |
| Sticky positioning | ✅ | Native | `sticky` prop with 'partial' or 'always' |
| Custom transform origin | ✅ | CSS-only | `--radix-context-menu-content-transform-origin` variable |

## Behavior Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Modal mode | ✅ | Native | `modal` prop (default true) |
| Loop navigation | ✅ | Native | `loop` prop for keyboard navigation wrapping |
| Reading direction | ✅ | Native | `dir` prop for RTL/LTR |
| Typeahead search | ✅ | Native | Built-in keyboard typeahead |
| Portal rendering | ✅ | Native | Explicit Portal component |
| Custom dismissal | ✅ | Native | Various event handlers for control |

## Accessibility Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| WAI-ARIA menu pattern | ✅ | Native | Full ARIA compliance |
| Keyboard navigation | ✅ | Native | Arrow keys, Space, Enter, Escape |
| Focus management | ✅ | Native | Roving tabindex implementation |
| Screen reader support | ✅ | Native | Proper ARIA roles and states |
| Typeahead support | ✅ | Native | Quick item selection by typing |

## Keyboard Interactions

| Key | Action |
|-----|--------|
| Space / Enter | Activate focused item, open submenu |
| ArrowDown | Move focus to next item |
| ArrowUp | Move focus to previous item |
| ArrowRight | Open submenu (LTR), close submenu (RTL) |
| ArrowLeft | Close submenu (LTR), open submenu (RTL) |
| Escape | Close menu and submenus |

## Styling Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Data attributes | ✅ | CSS-only | `[data-state]`, `[data-side]`, `[data-align]`, `[data-highlighted]`, `[data-disabled]` |
| CSS variables | ✅ | CSS-only | `--radix-context-menu-trigger-width`, `--radix-context-menu-content-available-height`, `--radix-context-menu-content-transform-origin` |
| Origin-aware animations | ✅ | CSS-only | Transform origin variable for directional animations |
| Completely unstyled | ✅ | Native | No default styles provided |

## Code Examples

### Basic Context Menu
```jsx
import * as ContextMenu from '@radix-ui/react-context-menu';

function BasicExample() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          <ContextMenu.Item className="ContextMenuItem">
            Back
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
            Forward
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
            Reload
          </ContextMenu.Item>
          <ContextMenu.Separator className="ContextMenuSeparator" />
          <ContextMenu.Item className="ContextMenuItem">
            More Tools
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
```

### With Checkbox Items
```jsx
import * as ContextMenu from '@radix-ui/react-context-menu';
import { CheckIcon } from '@radix-ui/react-icons';

function CheckboxExample() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Label>View Options</ContextMenu.Label>
          <ContextMenu.CheckboxItem
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <ContextMenu.ItemIndicator>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Bookmarks Bar
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenu.ItemIndicator>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Full URLs
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
```

### With Radio Items
```jsx
import * as ContextMenu from '@radix-ui/react-context-menu';
import { DotFilledIcon } from '@radix-ui/react-icons';

function RadioExample() {
  const [person, setPerson] = React.useState('pedro');

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem value="pedro">
              <ContextMenu.ItemIndicator>
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              Pedro Duarte
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="colm">
              <ContextMenu.ItemIndicator>
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              Colm Tuite
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
```

### With Submenus
```jsx
import * as ContextMenu from '@radix-ui/react-context-menu';

function SubmenuExample() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Item>Back</ContextMenu.Item>
          <ContextMenu.Item>Forward</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>
              More Tools
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent>
                <ContextMenu.Item>Save Page As…</ContextMenu.Item>
                <ContextMenu.Item>Create Shortcut…</ContextMenu.Item>
                <ContextMenu.Item>Name Window…</ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item>Developer Tools</ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
```

### Styling with Data Attributes
```css
.ContextMenuContent {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.ContextMenuContent[data-side='top'] {
  animation-name: slideDownAndFade;
}

.ContextMenuContent[data-side='bottom'] {
  animation-name: slideUpAndFade;
}

.ContextMenuItem {
  padding: 5px 10px;
  outline: none;
  cursor: default;
}

.ContextMenuItem[data-highlighted] {
  background-color: var(--violet-9);
  color: white;
}

.ContextMenuItem[data-disabled] {
  color: var(--mauve-8);
  pointer-events: none;
}
```

## Props/API Documentation

### ContextMenu.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dir` | `"ltr" \| "rtl"` | - | Reading direction for submenus |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Whether menu is modal |

### ContextMenu.Trigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child element |
| `disabled` | `boolean` | `false` | Disable menu activation |

### ContextMenu.Portal
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | `HTMLElement` | `document.body` | Portal container element |

### ContextMenu.Content
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loop` | `boolean` | `false` | Whether keyboard navigation wraps |
| `onCloseAutoFocus` | `(event: Event) => void` | - | Event handler called after closing |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Event handler for Escape key |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | - | Event handler for outside clicks |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` | - | Event handler for focus outside |
| `onInteractOutside` | `(event: InteractOutsideEvent) => void` | - | Event handler for outside interactions |
| `forceMount` | `boolean` | - | Force mount for animation control |
| `sideOffset` | `number` | `0` | Distance from trigger |
| `alignOffset` | `number` | `0` | Alignment offset |
| `avoidCollisions` | `boolean` | `true` | Enable collision detection |
| `collisionBoundary` | `Element \| Element[]` | `[]` | Collision boundary elements |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding for collision detection |
| `arrowPadding` | `number` | `0` | Padding around arrow |
| `sticky` | `"partial" \| "always"` | `"partial"` | Sticky positioning behavior |
| `hideWhenDetached` | `boolean` | `false` | Hide when reference is hidden |

### ContextMenu.Item
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable item |
| `onSelect` | `(event: Event) => void` | - | Event handler when item selected |
| `textValue` | `string` | - | Optional text for typeahead |

### ContextMenu.CheckboxItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| "indeterminate"` | `false` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Checked state change handler |
| `disabled` | `boolean` | `false` | Disable item |
| `onSelect` | `(event: Event) => void` | - | Event handler when item selected |
| `textValue` | `string` | - | Optional text for typeahead |

### ContextMenu.RadioGroup
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Value change handler |

### ContextMenu.RadioItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Required unique value |
| `disabled` | `boolean` | `false` | Disable item |
| `onSelect` | `(event: Event) => void` | - | Event handler when item selected |
| `textValue` | `string` | - | Optional text for typeahead |

### ContextMenu.ItemIndicator
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceMount` | `boolean` | - | Force mount for animation control |

### ContextMenu.Sub
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | - | Default open state |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |

### ContextMenu.SubTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable submenu trigger |
| `textValue` | `string` | - | Optional text for typeahead |

### ContextMenu.SubContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (Same props as Content) | - | - | All Content props apply |

## Composition Patterns

### Multi-level Nesting
Radix UI supports unlimited submenu nesting through the Sub/SubTrigger/SubContent composition pattern.

### Portal Flexibility
Each submenu can have its own Portal for flexible rendering control.

### Conditional ItemIndicator
ItemIndicator only renders when checkbox/radio is in checked state, allowing for clean animated transitions.

### asChild Pattern
The `asChild` prop allows rendering as any custom element while maintaining behavior, enabling maximum composition flexibility.

## Notable Features

### 1. Touch Device Support
Built-in long-press activation for touch devices, making context menus accessible on mobile.

### 2. Reading Direction Awareness
Full RTL/LTR support with automatic submenu direction adjustment based on `dir` prop.

### 3. Smart Positioning
Advanced collision detection and sticky positioning ensure menus always appear in optimal locations.

### 4. Indeterminate Checkbox State
Supports three-state checkboxes (checked, unchecked, indeterminate) for complex selection scenarios.

### 5. Typeahead Navigation
Built-in keyboard typeahead allows users to jump to items by typing their labels.

### 6. CSS Variable Integration
Provides contextual CSS variables (trigger width, available height, transform origin) for sophisticated styling and animations.

### 7. Modal and Non-Modal Modes
Flexible behavior control - modal mode blocks interaction with page, non-modal allows concurrent interactions.

### 8. Granular Event Control
Fine-grained control over dismissal behavior through multiple event handlers (escape key, outside click, outside focus, etc.).

### 9. Roving Tabindex
Implements WAI-ARIA roving tabindex pattern for optimal keyboard navigation and screen reader support.

### 10. Completely Headless
Zero default styling allows full design system integration while maintaining robust behavior and accessibility.

## Research Notes

### Documentation Quality
Radix UI provides exceptional documentation with comprehensive API references, detailed accessibility information, and practical examples. The docs clearly explain the compound component architecture and provide styling guidance.

### Architectural Approach
Radix UI takes a primitive-based, headless approach with maximum composition flexibility. The component is split into 13+ specialized primitives that can be composed together, giving developers fine-grained control over structure and behavior while maintaining accessibility.

### Accessibility-First Design
The component strictly follows WAI-ARIA patterns and provides extensive keyboard interaction documentation. Accessibility is clearly a core design principle, not an afterthought.

### Developer Experience
The `asChild` pattern and extensive TypeScript types suggest strong focus on DX. The compound component API may have a learning curve but provides maximum flexibility once understood.

### Framework Positioning
As a headless library, Radix UI positions itself as a behavior/accessibility layer that works with any styling solution. This is distinct from component libraries that provide complete styled components.

# ShadCN - Popover Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/popover
Status: ✅ Working

## Documentation Quality
Good - Clear, practical examples with complete code. Documentation is intentionally minimal, relying on Radix UI primitives documentation for advanced configuration. The shadcn approach is to provide working examples rather than exhaustive API documentation.

## Component Definition
- **Core purpose**: Displays rich, interactive content in a portal (rendered outside the DOM hierarchy), triggered by user interaction with a button or element
- **Mental model**: A floating content container positioned relative to a trigger element, rendered via portal to avoid z-index and overflow issues
- **Semantic meaning**: Non-modal overlay for contextual information, forms, or interactive controls that need to appear above other content without blocking the entire page

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Button trigger | ✅ | Primary pattern - Button component wrapped with `asChild` prop |
| Custom element trigger | ✅ | `PopoverTrigger asChild` allows any element to be a trigger |
| Programmatic control | ✅ | Via Radix `open` and `onOpenChange` props on Root |
| Controlled state | ✅ | Radix Root accepts `open` prop for external control |
| Uncontrolled state | ✅ | Radix Root accepts `defaultOpen` for unmanaged state |
| Hover trigger | ❌ | Not shown - click/focus only in examples |
| Context menu style | ❌ | Not demonstrated (right-click trigger) |
| Delayed trigger | ❌ | No delay configuration shown |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Rich HTML content | ✅ | Full support - forms, headings, text, inputs demonstrated |
| Form inputs | ✅ | Example shows Input and Label components within popover |
| Nested components | ✅ | Grid layouts, labels, inputs all composed inside content |
| Scrollable content | ❌ | Not demonstrated (but supported via CSS) |
| Header/footer sections | ❌ | No predefined content structure - free-form composition |
| Close button | ✅ | Via Radix `PopoverClose` component (not shown in shadcn example) |
| Custom width | ✅ | Via `className="w-80"` on PopoverContent |
| Max height | ❌ | Not shown - would use Tailwind classes |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Side positioning | ✅ | Radix: `side="top" \| "right" \| "bottom" \| "left"` |
| Alignment | ✅ | Radix: `align="start" \| "center" \| "end"` |
| Offset control | ✅ | Radix: `sideOffset` and `alignOffset` props (number pixels) |
| Collision detection | ✅ | Radix: `avoidCollisions={true}` (default) with automatic repositioning |
| Collision boundaries | ✅ | Radix: `collisionBoundary` and `collisionPadding` props |
| Sticky behavior | ✅ | Radix: `sticky="partial" \| "always"` when trigger moves |
| Hide when detached | ✅ | Radix: `hideWhenDetached={true}` if trigger scrolls out of view |
| Arrow pointer | ✅ | Radix: `PopoverArrow` component (not in shadcn example) |
| Custom anchor | ✅ | Radix: `PopoverAnchor` to position relative to different element |

## Behavior Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Click to open | ✅ | Default behavior on PopoverTrigger |
| Click outside to close | ✅ | Default Radix behavior with `onPointerDownOutside` hook |
| Escape key to close | ✅ | Default with `onEscapeKeyDown` hook for customization |
| Focus trap | ✅ | Automatic when `modal={true}` on Root |
| Focus return | ✅ | Returns to trigger on close via `onCloseAutoFocus` |
| Modal mode | ✅ | Radix: `modal={true}` blocks interaction with page |
| Non-modal mode | ✅ | Default `modal={false}` allows interaction with page |
| Auto-open | ✅ | Radix: `defaultOpen={true}` or controlled `open` prop |
| Portal rendering | ✅ | Content rendered in document.body via Radix Portal |
| Custom portal container | ✅ | Radix Portal: `container` prop for custom mount point |
| Force mount | ✅ | Radix Portal: `forceMount` to keep content in DOM when closed |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Keyboard navigation | ✅ | Tab/Shift+Tab through focusable elements, Escape to close |
| Space/Enter to open | ✅ | On trigger button |
| Outside interaction | ✅ | `onInteractOutside` event for custom handling |
| Focus management | ✅ | `onOpenAutoFocus` and `onCloseAutoFocus` hooks |
| Prevent auto-focus | ✅ | Call `event.preventDefault()` in auto-focus handlers |
| Nested popovers | ✅ | Supported via Radix composition |

## Code Examples

### Basic Popover with Form
```jsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

### Controlled Popover (Radix Pattern)
```jsx
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ControlledPopover() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        Content here
        <button onClick={() => setOpen(false)}>Close</button>
      </PopoverContent>
    </Popover>
  )
}
```

### Positioned Popover (Radix Pattern)
```jsx
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent
    side="top"
    align="start"
    sideOffset={5}
    alignOffset={-10}
  >
    Positioned content
  </PopoverContent>
</Popover>
```

### With Arrow (Radix Pattern)
```jsx
import { PopoverArrow } from "@radix-ui/react-popover"

<PopoverContent>
  <PopoverArrow className="fill-white" />
  Content with arrow pointer
</PopoverContent>
```

### Custom Anchor (Radix Pattern)
```jsx
import { PopoverAnchor } from "@radix-ui/react-popover"

<Popover>
  <PopoverTrigger>Trigger here</PopoverTrigger>
  <PopoverAnchor asChild>
    <div>Position relative to this element instead</div>
  </PopoverAnchor>
  <PopoverContent>Content positioned to anchor</PopoverContent>
</Popover>
```

### Modal Popover (Radix Pattern)
```jsx
<Popover modal={true}>
  <PopoverTrigger>Open modal popover</PopoverTrigger>
  <PopoverContent>
    Modal content - page interaction blocked
  </PopoverContent>
</Popover>
```

### Custom Focus Behavior (Radix Pattern)
```jsx
<PopoverContent
  onOpenAutoFocus={(event) => {
    event.preventDefault() // Prevent auto-focus on open
  }}
  onCloseAutoFocus={(event) => {
    event.preventDefault() // Prevent focus return to trigger
  }}
>
  Content
</PopoverContent>
```

### Handle Outside Interactions (Radix Pattern)
```jsx
<PopoverContent
  onPointerDownOutside={(event) => {
    // Custom handling for clicks outside
    console.log("Clicked outside")
  }}
  onInteractOutside={(event) => {
    // Prevent closing on outside interaction
    event.preventDefault()
  }}
>
  Content
</PopoverContent>
```

### Installation
```bash
pnpm dlx shadcn@latest add popover
```

## API Surface

### Popover (Root Component)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | — | Initial open state (uncontrolled) |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes |
| `modal` | `boolean` | `false` | Block interaction with page when open |

### PopoverTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props into child element instead of wrapping |

### PopoverAnchor
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Use child element as anchor point |

### PopoverPortal
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | `HTMLElement` | `document.body` | Where to render portal |
| `forceMount` | `boolean` | — | Force render when closed (for animations) |

### PopoverContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side relative to trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side |
| `sideOffset` | `number` | `0` | Distance in pixels from trigger |
| `alignOffset` | `number` | `0` | Fine-tune alignment position |
| `avoidCollisions` | `boolean` | `true` | Auto-reposition on collision |
| `collisionBoundary` | `Element \| Element[]` | `[]` | Elements to check for collisions |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding around boundaries |
| `sticky` | `"partial" \| "always"` | `"partial"` | Behavior when trigger moves |
| `hideWhenDetached` | `boolean` | `false` | Hide if trigger scrolls out of view |
| `onOpenAutoFocus` | `(event: Event) => void` | — | Called when content receives focus |
| `onCloseAutoFocus` | `(event: Event) => void` | — | Called when focus returns to trigger |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | Called when Escape is pressed |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | — | Called when pointer down outside |
| `onFocusOutside` | `(event: FocusEvent) => void` | — | Called when focus moves outside |
| `onInteractOutside` | `(event: Event) => void` | — | Called on any outside interaction |
| `className` | `string` | — | Tailwind/CSS classes for styling |

### PopoverArrow
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Styling for arrow element |
| `width` | `number` | `10` | Arrow width in pixels |
| `height` | `number` | `5` | Arrow height in pixels |

### PopoverClose
Component for explicit close buttons within content. Triggers popover close on click.

## Notable Features

### Radix UI Primitives Foundation
- Built on `@radix-ui/react-popover` headless components
- Inherits robust positioning engine (Floating UI)
- Full accessibility built-in (ARIA, keyboard nav, focus management)
- Battle-tested interaction patterns

### Copy-Paste Component Model
- Added to project via shadcn CLI (not npm package)
- Full source code ownership - modify freely
- Lives in `/components/ui/popover.tsx` in your project
- Pre-styled with Tailwind CSS but customizable

### Tailwind-First Styling
All visual customization via utility classes:
- Width: `className="w-80"` or `w-[400px]`
- Spacing: `gap-4`, `space-y-2`, `p-4`
- Layout: `grid`, `flex`, `grid-cols-3`
- Colors: `bg-popover`, `text-popover-foreground` (theme tokens)
- Shadows/borders: Defined in component defaults

### CSS Custom Properties (Radix)
Exposed for advanced styling and animations:
- `--radix-popover-content-transform-origin`: Animation origin point
- `--radix-popover-content-available-width`: Remaining horizontal space
- `--radix-popover-content-available-height`: Remaining vertical space
- `--radix-popover-trigger-width`: Trigger element width
- `--radix-popover-trigger-height`: Trigger element height

### Data Attributes (Radix)
For conditional styling:
- `[data-state="open|closed"]`: On Content, Trigger
- `[data-side="top|right|bottom|left"]`: On Content (actual rendered side)
- `[data-align="start|center|end"]`: On Content (actual alignment)

### Portal Rendering
- Content rendered outside DOM hierarchy (document.body by default)
- Avoids z-index stacking context issues
- Prevents overflow clipping problems
- Accessible despite portal (proper ARIA relationships maintained)

### Advanced Positioning
- **Collision detection**: Automatically flips/shifts to stay visible
- **Boundary awareness**: Respects viewport and custom boundaries
- **Smart alignment**: Adjusts based on available space
- **Sticky tracking**: Follows trigger when scrolling (configurable)
- **Detachment handling**: Can hide when trigger scrolls away

### Interaction Flexibility
- **Modal mode**: Blocks page interaction, traps focus (like dialog)
- **Non-modal mode**: Allows simultaneous page interaction
- **Custom dismissal**: Control what triggers close (outside click, escape)
- **Focus control**: Customize focus behavior on open/close

### Keyboard Accessibility
- **Space/Enter**: Open popover from trigger
- **Tab**: Navigate between focusable elements within content
- **Escape**: Close popover and return focus to trigger
- **Shift+Tab**: Reverse tab navigation

### React Framework Requirement
- Requires React 18+
- Uses hooks (useState, useEffect, useContext)
- Not a web component - framework-specific
- No SSR issues (portal rendering handled)

## Research Notes

### Documentation Accessibility
- Clean, minimal documentation with working examples
- Links to Radix UI docs for complete API reference
- Live interactive demo on documentation page
- CLI installation makes onboarding simple
- Source code available to inspect and modify

### Framework Philosophy
ShadCN's approach differs from traditional component libraries:

1. **Copy, don't install**:
   - Run `pnpm dlx shadcn@latest add popover`
   - Adds complete source to your project
   - You own the code, not a dependency

2. **Composition over configuration**:
   - Minimal prop API surface
   - Compose content freely (no slots, no rigid structure)
   - Extend via CSS, not props

3. **Radix UI foundation**:
   - Don't reinvent accessibility/positioning
   - Use battle-tested primitives
   - Add styling layer on top

4. **Tailwind CSS integration**:
   - All styling via utility classes
   - Theme tokens for consistency
   - No CSS modules or styled-components

### Comparison to Other Frameworks

| Feature | ShadCN/Radix | Ant Design | Chakra UI | MUI | Semantic UI Goal |
|---------|--------------|------------|-----------|-----|------------------|
| **Approach** | Copy-paste + Radix | npm package | npm package | npm package | Web component |
| **Trigger** | Any element (asChild) | Button/Custom | Button/Custom | Button/Custom | Flexible |
| **Positioning** | Radix (Floating UI) | CSS/Portal | Popper.js | Popper.js | Native/Library |
| **Portal** | Default (body) | Optional | Default | Default | Shadow DOM |
| **Modal mode** | Optional (prop) | Not built-in | Not built-in | Not built-in | Consider |
| **Arrow** | Optional component | Built-in | Built-in | Optional | Consider |
| **Anchor** | Separate element | Not shown | Not shown | Not shown | Useful |
| **Styling** | Tailwind classes | Less/CSS | Chakra tokens | Emotion CSS | Design tokens |
| **A11y** | Radix built-in | Manual | Built-in | Manual | Web standards |
| **Framework** | React only | React only | React only | React only | Framework-agnostic |

### Design Philosophy Insights

**Minimalism with Escape Hatches**:
- Provide working defaults
- Expose underlying Radix props when needed
- Don't hide complexity, make it accessible
- Trust developers to customize

**Composition over Configuration**:
- No `title`, `footer`, `header` props
- Just render what you want inside Content
- More flexible, less opinionated
- Requires more setup but infinite possibilities

**Accessibility First**:
- Never compromise on keyboard nav
- Focus management automatic
- ARIA relationships correct
- Screen reader tested (Radix handles this)

**Portal by Default**:
- Avoid z-index wars
- Prevent overflow clipping
- Position relative to viewport
- React portal API, not manual DOM manipulation

### Notable Implementation Details

**asChild Pattern**:
```jsx
<PopoverTrigger asChild>
  <Button>Click me</Button>
</PopoverTrigger>
```
- Uses Radix `Slot` utility
- Merges props into child instead of wrapping
- Prevents extra DOM nodes
- Maintains semantic HTML structure
- Preserves child's ref, events, styling

**Controlled vs Uncontrolled**:
- Uncontrolled: `defaultOpen={true}` - internal state
- Controlled: `open={isOpen} onOpenChange={setIsOpen}` - external state
- Both patterns supported equally
- No "preferred" pattern in docs

**Event Handler Composition**:
```jsx
<PopoverContent
  onPointerDownOutside={(event) => {
    // Your logic
    event.preventDefault() // Prevent default close
  }}
>
```
- All event handlers receive native events
- Can prevent default behaviors
- Compose multiple handlers
- Full control over interaction

**CSS Custom Properties for Animation**:
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-state="open"] {
  animation: slideIn 150ms ease-out;
  transform-origin: var(--radix-popover-content-transform-origin);
}
```
- Use data attributes for state-based styles
- Transform origin computed by Radix based on position
- Available width/height for responsive content
- Trigger dimensions for size matching

### Accessibility Considerations

**Focus Management**:
- On open: Focus moves to first focusable element in content
- Can prevent: `onOpenAutoFocus={(e) => e.preventDefault()}`
- On close: Focus returns to trigger
- Can prevent: `onCloseAutoFocus={(e) => e.preventDefault()}`

**Keyboard Navigation**:
- Tab order natural within content
- Escape always works (unless prevented)
- Arrow keys not used (unlike menus/selects)
- Focus trap in modal mode only

**Screen Reader Support**:
- Proper ARIA roles and relationships
- Trigger has `aria-expanded` state
- Content connected via ARIA attributes
- Portal doesn't break accessibility tree

**Mouse/Touch Support**:
- Click trigger to open
- Click outside to close (configurable)
- Touch events properly handled
- No pointer type discrimination

### Notable Omissions vs Other Frameworks

**No built-in patterns for**:
- Hover/delay triggers (click/focus only)
- Nested popovers (though technically supported)
- Tooltip-like behavior (separate component)
- Context menu trigger (right-click)
- Predefined content layouts (header/body/footer)
- Animation presets (CSS custom properties provided)
- Multiple popovers (composition)
- Resize observers (use CSS/JS manually)

**No props for**:
- Animation duration
- Z-index control
- Max width/height (use className)
- Background overlay/backdrop
- Close button (use PopoverClose component)
- Preset sizes (sm/md/lg)
- Color variants

### Performance Characteristics

**Rendering**:
- Portal rendering lazy (only when open)
- `forceMount` available for pre-rendering
- No virtual DOM overhead beyond React
- Positioning calculated on mount/scroll

**Memory**:
- Event listeners attached only when open
- Cleaned up properly on unmount
- No memory leaks in portal
- Radix handles lifecycle

**Positioning Updates**:
- Floating UI recalculates on scroll/resize
- Can be expensive with many open popovers
- Consider `sticky` and `hideWhenDetached` props
- Collision detection adds small overhead

## Key Takeaways for Semantic UI

### Pattern Alignment

✅ **Adopt These Patterns**:
1. **Composition architecture**: Root + Trigger + Content separation
2. **Portal rendering**: Avoid z-index issues (though Shadow DOM may suffice)
3. **Collision detection**: Auto-repositioning for viewport boundaries
4. **Focus management**: Automatic with customization hooks
5. **Data attributes**: `[data-state]`, `[data-side]`, `[data-align]` for styling
6. **CSS custom properties**: Expose positioning data for animations
7. **Keyboard navigation**: Space/Enter to open, Tab to navigate, Escape to close
8. **Outside interaction**: Click outside to close (with opt-out)
9. **Anchor flexibility**: Position relative to element other than trigger
10. **Modal mode option**: Block page interaction when needed

✅ **Consider These Features**:
1. **Controlled/uncontrolled state**: Support both patterns
2. **Arrow component**: Optional visual pointer
3. **Sticky behavior**: Track trigger when scrolling
4. **Hide when detached**: Remove from view if trigger scrolls away
5. **Collision boundaries**: Custom collision detection zones
6. **Side offset**: Numeric pixel distance from trigger
7. **Alignment offset**: Fine-tune positioning
8. **Event hooks**: onOpenAutoFocus, onCloseAutoFocus, onInteractOutside

### Pattern Divergence

❌ **Avoid These Approaches**:
1. **React-only implementation**: Maintain web component approach
2. **Copy-paste distribution**: Use npm package model
3. **Tailwind-only styling**: Support design token system
4. **asChild pattern**: Not applicable to web components (use slots)
5. **CLI installation**: Standard npm install sufficient

⚠️ **Adapt with Caution**:
1. **Portal to body**: Shadow DOM might eliminate need for portals
2. **Floating UI dependency**: Consider native CSS anchor positioning or lighter alternative
3. **Modal mode**: May conflict with shadow DOM or require different implementation
4. **Over-minimalism**: Semantic UI should provide common patterns (tooltips, popovers distinct)

### Potential Adoptions for Semantic UI Popover

**API Design**:
```javascript
// Settings-based approach
const settings = {
  open: false,           // Controlled state
  defaultOpen: false,    // Initial state
  trigger: 'click',      // 'click' | 'hover' | 'focus' | 'manual'
  modal: false,          // Block page interaction
  side: 'bottom',        // 'top' | 'right' | 'bottom' | 'left'
  align: 'center',       // 'start' | 'center' | 'end'
  sideOffset: 0,         // Pixels
  alignOffset: 0,        // Pixels
  avoidCollisions: true,
  arrow: false,          // Show arrow pointer
  closeOnEscape: true,
  closeOnOutsideClick: true,
  closeOnInsideClick: false,
}
```

**Slot-based Content**:
```html
<ui-popover>
  <button slot="trigger">Open</button>
  <div slot="content">
    <h4>Title</h4>
    <p>Content here</p>
  </div>
  <div slot="arrow"></div> <!-- Optional -->
</ui-popover>
```

**Event-based Communication**:
```javascript
popover.addEventListener('open', (e) => {})
popover.addEventListener('close', (e) => {})
popover.addEventListener('outside-click', (e) => {
  e.preventDefault() // Prevent close
})
```

**Design Token Integration**:
```css
:host {
  --popover-bg: var(--semantic-surface-elevated);
  --popover-border: var(--semantic-border-default);
  --popover-shadow: var(--semantic-shadow-lg);
  --popover-padding: var(--semantic-spacing-4);
  --popover-max-width: 400px;
}
```

### Critical Considerations

**Positioning Engine**:
- Radix uses Floating UI (modern, comprehensive)
- Semantic UI could use:
  - Native CSS anchor positioning (limited browser support)
  - Floating UI (add dependency)
  - Custom solution (significant effort)
  - Hybrid approach

**Portal vs Shadow DOM**:
- Radix: Renders to body via React portal
- Semantic UI: Already isolated via Shadow DOM
- Question: Does Shadow DOM eliminate need for portal?
- Consider: Nested scroll containers, z-index contexts

**Accessibility Parity**:
- Radix has years of a11y refinement
- Semantic UI must match:
  - Keyboard navigation
  - Focus management
  - Screen reader support
  - ARIA relationships
- Don't reinvent - reference Radix implementation

**Framework Agnostic Challenge**:
- Radix: React hooks for state management
- Semantic UI: Signals/reactive state
- Pattern translation needed
- Event-based communication vs props

### Implementation Priorities

**Phase 1 - Core Functionality**:
1. Trigger interaction (click)
2. Content rendering (slots)
3. Open/close state management
4. Basic positioning (side, align)
5. Keyboard support (Escape to close)
6. Outside click to close

**Phase 2 - Enhanced Positioning**:
1. Collision detection
2. Auto-repositioning
3. Side/align offsets
4. Viewport boundaries
5. Scroll handling

**Phase 3 - Advanced Features**:
1. Modal mode
2. Arrow component
3. Anchor element
4. Sticky behavior
5. Custom triggers (hover, focus)
6. Animation hooks

**Phase 4 - Polish**:
1. CSS custom properties for animations
2. Data attributes for styling
3. Performance optimization
4. Comprehensive a11y testing
5. Documentation and examples

### Open Questions for Semantic UI Team

1. **Positioning library**: Floating UI dependency or custom solution?
2. **Portal need**: Does Shadow DOM eliminate portal requirement?
3. **Popover vs Tooltip**: Separate components or unified with variants?
4. **Modal implementation**: How to block page interaction with web components?
5. **Animation approach**: CSS transitions, Web Animations API, or library?
6. **Trigger flexibility**: Support hover/focus or just click/manual?
7. **Nested popovers**: Support stacking or discourage?
8. **SSR concerns**: How to handle positioning without browser APIs?

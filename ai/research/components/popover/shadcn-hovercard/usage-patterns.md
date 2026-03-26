# ShadCN - Hover Card Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/hover-card
Status: ✅ Working

## Documentation Quality
Good - Clean examples with complete code showing typical hover card use case. Documentation is minimal by design, relying on Radix UI primitives documentation for full API details. Provides practical implementation example with profile preview pattern.

## Component Definition
- **Core purpose**: Allows sighted users to preview content available behind a link through hover interaction
- **Mental model**: A non-modal floating preview container that appears on hover, designed for supplementary information that enhances but isn't critical to the user experience
- **Semantic meaning**: Visual-only preview overlay for contextual information, specifically designed for mouse/hover interactions rather than keyboard-only users

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Hover trigger | ✅ | Primary pattern - displays on hover with delay |
| Link trigger | ✅ | Example shows `Button variant="link"` as trigger element |
| Custom element trigger | ✅ | `HoverCardTrigger asChild` allows any element to be trigger |
| Open delay | ✅ | Default 700ms delay before card appears on hover |
| Close delay | ✅ | Default 300ms delay before card closes after hover ends |
| Controlled state | ✅ | Radix Root accepts `open` prop for external control |
| Uncontrolled state | ✅ | Radix Root accepts `defaultOpen` for unmanaged state |
| Click trigger | ❌ | Not the intended interaction pattern (use Popover instead) |
| Focus trigger | ⚠️ | Tab key can open but accessibility limited |
| Programmatic control | ✅ | Via `open` and `onOpenChange` props on Root |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Rich HTML content | ✅ | Full support - Avatar, text, links demonstrated |
| Profile preview | ✅ | Primary example shows user profile card (@nextjs) |
| Avatar/image | ✅ | Example includes Avatar component with fallback |
| Text content | ✅ | Heading, description, metadata all shown |
| Links | ✅ | Can include clickable elements inside card |
| Nested components | ✅ | Composition of multiple UI components |
| Custom width | ✅ | Via `className="w-80"` on HoverCardContent |
| Scrollable content | ❌ | Not demonstrated (but supported via CSS) |
| Header/footer sections | ❌ | No predefined structure - free-form composition |
| Close button | ❌ | Not needed - closes automatically on hover out |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Side positioning | ✅ | Radix: `side="top" \| "right" \| "bottom" \| "left"` (default: `"bottom"`) |
| Alignment | ✅ | Radix: `align="start" \| "center" \| "end"` (default: `"center"`) |
| Offset control | ✅ | Radix: `sideOffset` (default: 0) and `alignOffset` (default: 0) props (number pixels) |
| Collision detection | ✅ | Radix: `avoidCollisions={true}` (default) with automatic repositioning |
| Collision boundaries | ✅ | Radix: `collisionBoundary` and `collisionPadding` props |
| Sticky behavior | ✅ | Radix: `sticky="partial" \| "always"` (default: `"partial"`) when trigger moves |
| Hide when detached | ✅ | Radix: `hideWhenDetached={true}` if trigger scrolls out of view |
| Arrow pointer | ✅ | Radix: `HoverCardArrow` component (not in shadcn example) |
| Custom anchor | ❌ | No separate anchor concept shown (unlike Popover) |

## Behavior Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Hover to open | ✅ | Primary behavior - appears after openDelay (700ms default) |
| Hover delay | ✅ | Configurable via `openDelay` prop (default: 700ms) |
| Close delay | ✅ | Configurable via `closeDelay` prop (default: 300ms) |
| Hover out to close | ✅ | Closes automatically after closeDelay when cursor leaves |
| Tab to open | ⚠️ | Tab key can trigger but not primary interaction |
| Escape to close | ❌ | Not mentioned (hover-focused, not keyboard-focused) |
| Click outside | ❌ | Not applicable - closes on hover out |
| Portal rendering | ✅ | Content rendered in document.body via Radix Portal |
| Custom portal container | ✅ | Radix Portal: `container` prop for custom mount point |
| Force mount | ✅ | Radix Portal: `forceMount` to keep content in DOM when closed |
| Modal mode | ❌ | Not applicable - non-blocking by nature |
| Focus trap | ❌ | No focus trapping - allows page interaction |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Keyboard navigation | ⚠️ | Limited - Tab to open/close, Enter to follow link |
| Hover interaction | ✅ | Primary interaction method - smooth delay handling |
| Content clickable | ✅ | Can interact with elements inside hover card |
| Prevent auto-close | ❌ | Not shown - would need custom event handling |
| Nested hover cards | ❌ | Not demonstrated or recommended |

## Code Examples

### Basic Hover Card with Profile Preview
```jsx
import { CalendarIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
```

### Controlled Hover Card (Radix Pattern)
```jsx
import { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function ControlledHoverCard() {
  const [open, setOpen] = useState(false)

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger>Hover or programmatically control</HoverCardTrigger>
      <HoverCardContent>
        Preview content
        <button onClick={() => setOpen(false)}>Close</button>
      </HoverCardContent>
    </HoverCard>
  )
}
```

### Custom Delays (Radix Pattern)
```jsx
<HoverCard
  openDelay={300}
  closeDelay={100}
>
  <HoverCardTrigger>Quick preview</HoverCardTrigger>
  <HoverCardContent>
    Appears faster (300ms), closes faster (100ms)
  </HoverCardContent>
</HoverCard>
```

### Positioned Hover Card (Radix Pattern)
```jsx
<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent
    side="top"
    align="start"
    sideOffset={5}
    alignOffset={-10}
  >
    Positioned preview
  </HoverCardContent>
</HoverCard>
```

### With Arrow (Radix Pattern)
```jsx
import { HoverCardArrow } from "@radix-ui/react-hover-card"

<HoverCardContent>
  <HoverCardArrow className="fill-white" />
  Content with arrow pointer
</HoverCardContent>
```

### Installation
```bash
pnpm dlx shadcn@latest add hover-card
```

## API Surface

### HoverCard (Root Component)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | — | Initial open state (uncontrolled) |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes |
| `openDelay` | `number` | `700` | Milliseconds before card appears on hover |
| `closeDelay` | `number` | `300` | Milliseconds before card closes after hover ends |

### HoverCardTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props into child element instead of wrapping |

**Data Attributes:**
- `[data-state]` - "open" | "closed"

### HoverCardPortal
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | `HTMLElement` | `document.body` | Where to render portal |
| `forceMount` | `boolean` | — | Force render when closed (for animations) |

### HoverCardContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props into child element |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side relative to trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side |
| `sideOffset` | `number` | `0` | Distance in pixels from trigger |
| `alignOffset` | `number` | `0` | Fine-tune alignment position |
| `avoidCollisions` | `boolean` | `true` | Auto-reposition on collision |
| `collisionBoundary` | `Element \| Element[]` | `[]` | Elements to check for collisions |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding around boundaries |
| `sticky` | `"partial" \| "always"` | `"partial"` | Behavior when trigger moves |
| `hideWhenDetached` | `boolean` | `false` | Hide if trigger scrolls out of view |
| `arrowPadding` | `number` | `0` | Arrow spacing from edges |
| `forceMount` | `boolean` | — | Force mount when closed |
| `className` | `string` | — | Tailwind/CSS classes for styling |

**Data Attributes:**
- `[data-state]` - "open" | "closed"
- `[data-side]` - "left" | "right" | "bottom" | "top"
- `[data-align]` - "start" | "end" | "center"

**CSS Custom Properties:**
- `--radix-hover-card-content-transform-origin` - Computed transform origin
- `--radix-hover-card-content-available-width` - Remaining horizontal space
- `--radix-hover-card-content-available-height` - Remaining vertical space
- `--radix-hover-card-trigger-width` - Trigger element width
- `--radix-hover-card-trigger-height` - Trigger element height

### HoverCardArrow
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props into child element |
| `className` | `string` | — | Styling for arrow element |
| `width` | `number` | `10` | Arrow width in pixels |
| `height` | `number` | `5` | Arrow height in pixels |

## Notable Features

### Radix UI Primitives Foundation
- Built on `@radix-ui/react-hover-card` headless components
- Inherits positioning engine (Floating UI)
- Purpose-built for hover interactions with timing controls
- Lightweight compared to full Popover implementation

### Copy-Paste Component Model
- Added to project via shadcn CLI (not npm package)
- Full source code ownership - modify freely
- Lives in `/components/ui/hover-card.tsx` in your project
- Pre-styled with Tailwind CSS but customizable

### Hover-Optimized Timing
- **Open delay (700ms)**: Prevents accidental triggers as cursor passes over elements
- **Close delay (300ms)**: Allows user to move cursor into card content
- Both delays fully configurable per use case
- Smooth, non-jarring user experience

### Tailwind-First Styling
All visual customization via utility classes:
- Width: `className="w-80"` or `w-[400px]`
- Spacing: `space-x-4`, `space-y-1`, `pt-2`
- Layout: `flex`, `justify-between`, `items-center`
- Colors: `text-muted-foreground`, `opacity-70` (theme tokens)
- Typography: `text-sm`, `font-semibold`

### CSS Custom Properties (Radix)
Exposed for advanced styling and animations:
- `--radix-hover-card-content-transform-origin`: Animation origin point
- `--radix-hover-card-content-available-width`: Remaining horizontal space
- `--radix-hover-card-content-available-height`: Remaining vertical space
- `--radix-hover-card-trigger-width`: Trigger element width
- `--radix-hover-card-trigger-height`: Trigger element height

### Data Attributes (Radix)
For conditional styling:
- `[data-state="open|closed"]`: On Content, Trigger
- `[data-side="top|right|bottom|left"]`: On Content (actual rendered side)
- `[data-align="start|center|end"]`: On Content (actual alignment)

### Portal Rendering
- Content rendered outside DOM hierarchy (document.body by default)
- Avoids z-index stacking context issues
- Prevents overflow clipping problems
- Maintains smooth hover experience across elements

### Advanced Positioning
- **Collision detection**: Automatically flips/shifts to stay visible
- **Boundary awareness**: Respects viewport and custom boundaries
- **Smart alignment**: Adjusts based on available space
- **Sticky tracking**: Follows trigger when scrolling (configurable)
- **Detachment handling**: Can hide when trigger scrolls away

### Keyboard Accessibility (Limited)
- **Tab**: Can open/close hover card
- **Enter**: Opens the link within trigger
- **Arrow keys**: Not used
- **Escape**: Not mentioned (hover-focused interaction)

### React Framework Requirement
- Requires React 18+
- Uses hooks (useState, useEffect, useContext)
- Not a web component - framework-specific
- No SSR issues (portal rendering handled)

## Research Notes

### Documentation Accessibility
- Clean documentation with practical example
- Links to Radix UI docs for complete API reference
- Live interactive demo on documentation page
- CLI installation makes onboarding simple
- Source code available to inspect and modify

### Framework Philosophy
ShadCN's hover card follows same patterns as other components:

1. **Copy, don't install**:
   - Run `pnpm dlx shadcn@latest add hover-card`
   - Adds complete source to your project
   - You own the code, not a dependency

2. **Composition over configuration**:
   - Minimal prop API surface
   - Compose content freely
   - Extend via CSS, not props

3. **Radix UI foundation**:
   - Purpose-built primitive for hover interactions
   - Battle-tested timing and positioning
   - Add styling layer on top

4. **Tailwind CSS integration**:
   - All styling via utility classes
   - Theme tokens for consistency

### Design Philosophy Insights

**Hover-First Design**:
- Optimized specifically for hover interactions
- Not a general-purpose popover
- Delays prevent accidental triggers
- Smooth, predictable behavior

**Visual Preview Pattern**:
- Intended for supplementary information only
- Not for critical content or actions
- Enhances experience but not required for functionality
- Profile previews, link previews, metadata display

**Accessibility Trade-offs**:
- Explicitly "for sighted users"
- Limited keyboard navigation
- Not suitable for critical information
- Screen reader users may not access content

**Non-Modal by Nature**:
- Never blocks page interaction
- No focus trapping
- Allows simultaneous content viewing
- Lightweight and unobtrusive

### Key Differences from Popover

| Feature | Hover Card | Popover |
|---------|-----------|---------|
| **Primary Trigger** | Hover (with delays) | Click/programmatic |
| **Open Delay** | 700ms default | Immediate |
| **Close Delay** | 300ms default | Immediate (on click outside) |
| **Modal Mode** | Not available | Optional via `modal` prop |
| **Focus Management** | Minimal | Full control (onOpenAutoFocus, etc.) |
| **Keyboard Support** | Limited (Tab, Enter) | Complete (Space, Enter, Escape, Tab) |
| **Close Trigger** | Hover out | Click outside, Escape |
| **Use Case** | Preview/supplementary info | Interactive content/forms |
| **Accessibility** | Visual-only | Full keyboard/screen reader |
| **Content Type** | Read-only previews | Interactive elements |
| **Close Button** | Not needed | Optional (PopoverClose) |
| **Anchor Element** | Not shown | Available (PopoverAnchor) |

### Notable Implementation Details

**asChild Pattern**:
```jsx
<HoverCardTrigger asChild>
  <Button variant="link">@nextjs</Button>
</HoverCardTrigger>
```
- Uses Radix `Slot` utility
- Merges props into child instead of wrapping
- Maintains semantic HTML structure
- Preserves link/button behavior

**Controlled vs Uncontrolled**:
- Uncontrolled: `defaultOpen={true}` - internal state
- Controlled: `open={isOpen} onOpenChange={setIsOpen}` - external state
- Both patterns supported
- Most use cases are uncontrolled (automatic hover behavior)

**Timing Configuration**:
```jsx
<HoverCard openDelay={300} closeDelay={100}>
```
- Lower openDelay = faster appearance (more responsive but may trigger accidentally)
- Higher openDelay = slower appearance (more deliberate, prevents accidents)
- Lower closeDelay = faster disappearance (snappier but less forgiving)
- Higher closeDelay = slower disappearance (easier to move cursor to content)

**CSS Custom Properties for Animation**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

[data-state="open"] {
  animation: fadeIn 150ms ease-out;
  transform-origin: var(--radix-hover-card-content-transform-origin);
}
```
- Use data attributes for state-based styles
- Transform origin computed by Radix based on position
- Subtle animations recommended (not jarring)

### Accessibility Considerations

**Limitations by Design**:
- Radix documentation states: "For sighted users only"
- Content may not be exposed to screen readers
- Keyboard-only users have limited access
- Not suitable for essential information or actions

**When to Use Hover Cards**:
✅ User profile previews
✅ Link destination previews
✅ Supplementary metadata
✅ Contextual information that enhances UX
✅ Non-critical content

**When NOT to Use Hover Cards**:
❌ Critical information users must see
❌ Interactive forms or controls
❌ Navigation options
❌ Error messages or warnings
❌ Content needed for task completion

**Keyboard Behavior**:
- Tab can trigger open/close
- Enter follows the link in trigger
- No Escape key handling mentioned
- No arrow key navigation
- Focus doesn't trap inside card

**Hover Behavior**:
- Predictable delays prevent accidental triggers
- Can move cursor into card to interact with content
- Moving cursor out closes after delay
- Smooth experience for mouse users

### Performance Characteristics

**Rendering**:
- Portal rendering lazy (only when open)
- `forceMount` available for pre-rendering
- Minimal overhead compared to Popover
- Positioning calculated on hover

**Memory**:
- Event listeners only attached when needed
- Cleaned up properly on unmount
- No memory leaks in portal
- Radix handles lifecycle

**Timing**:
- Uses setTimeout/clearTimeout for delays
- Efficient hover detection
- Debounced positioning updates
- Minimal CPU usage when idle

## Key Takeaways for Semantic UI

### Pattern Alignment

✅ **Adopt These Patterns**:
1. **Hover-specific component**: Separate from click-based Popover
2. **Configurable delays**: openDelay and closeDelay for optimal UX
3. **Preview-focused design**: Optimized for supplementary information
4. **Positioning system**: Same collision detection and positioning as Popover
5. **Data attributes**: `[data-state]` for styling hooks
6. **CSS custom properties**: For animations and responsive design
7. **Portal rendering**: (if not obviated by Shadow DOM)
8. **Non-modal nature**: Never blocks page interaction

✅ **Consider These Features**:
1. **Controlled/uncontrolled state**: Support both patterns
2. **Arrow component**: Optional visual pointer
3. **Sticky behavior**: Track trigger when scrolling
4. **Hide when detached**: Remove from view if trigger scrolls away
5. **Collision boundaries**: Custom collision detection zones

### Pattern Divergence

❌ **Avoid These Approaches**:
1. **React-only implementation**: Maintain web component approach
2. **Copy-paste distribution**: Use npm package model
3. **Tailwind-only styling**: Support design token system
4. **asChild pattern**: Not applicable to web components (use slots)
5. **Limited accessibility**: Semantic UI should strive for better keyboard/SR support

⚠️ **Adapt with Caution**:
1. **"Sighted users only" limitation**: Consider if this is acceptable for Semantic UI
2. **Portal to body**: Shadow DOM might eliminate need
3. **Minimal keyboard support**: Semantic UI may want more accessibility
4. **Separate component**: Consider if Popover with hover trigger mode is better

### Critical Differences from Popover

**When to Use Hover Card vs Popover**:

**Hover Card**:
- Link previews (user profiles, URLs)
- Supplementary information
- Metadata display
- Non-critical content
- Quick reference information
- Mouse-optimized interactions

**Popover**:
- Interactive forms
- Action menus
- Configuration panels
- Critical information
- Keyboard-accessible content
- Content requiring interaction

### Potential Semantic UI Implementation

**Option 1: Separate Components**
```javascript
// ui-hover-card (hover-specific)
const settings = {
  openDelay: 700,
  closeDelay: 300,
  // No modal, no keyboard complexity
}

// ui-popover (click/programmatic)
const settings = {
  trigger: 'click',
  modal: false,
  // Full keyboard/accessibility support
}
```

**Option 2: Unified with Trigger Mode**
```javascript
// ui-popover with trigger variants
const settings = {
  trigger: 'hover', // or 'click' or 'focus' or 'manual'
  openDelay: 700,   // only relevant for hover
  closeDelay: 300,  // only relevant for hover
  modal: false,
}
```

**Option 3: Hover as Popover Setting**
```javascript
// ui-popover with hover configuration
const settings = {
  on: 'hover',           // Semantic UI popup pattern
  hoverable: true,       // Keep popup open when hovering content
  delay: { show: 700, hide: 300 },
}
```

### Implementation Recommendations

**Hover Card as Distinct Component**:
Reasons to separate:
- Different use cases (preview vs interaction)
- Different accessibility requirements
- Simpler API surface for each
- Clear mental model for developers
- Easier to optimize each separately

**Accessibility Enhancement**:
Unlike Radix/ShadCN, Semantic UI could:
- Provide keyboard shortcut to reveal on focus
- Make content available to screen readers (with ARIA)
- Ensure essential info isn't hover-only
- Warn developers about accessibility limitations
- Offer alternative patterns for critical content

**Web Component Considerations**:
- Use hover events instead of React hooks
- Shadow DOM may eliminate portal need
- CSS custom properties for theming
- Slots for trigger and content
- Settings-based configuration instead of props

### Open Questions for Semantic UI Team

1. **Separate components**: Should Hover Card be distinct from Popover?
2. **Accessibility stance**: Accept "sighted users only" or enhance with keyboard/SR support?
3. **Timing defaults**: Use Radix's 700ms/300ms or different values?
4. **Naming**: "Hover Card" vs "Preview" vs "Popup on='hover'"?
5. **Feature scope**: Match Radix exactly or add enhancements?
6. **Critical content**: How to prevent developers from putting essential info in hover cards?
7. **Touch devices**: How to handle hover on mobile/tablet?
8. **Positioning library**: Same solution as Popover or different needs?

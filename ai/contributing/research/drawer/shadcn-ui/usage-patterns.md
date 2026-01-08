# Shadcn UI - Sheet & Drawer Usage Patterns

## Component URLs
- **Sheet**: https://ui.shadcn.com/docs/components/sheet (Status: ✅ Working)
- **Drawer**: https://ui.shadcn.com/docs/components/drawer (Status: ✅ Working)

## Documentation Quality
Excellent - Both components have clear, practical documentation with interactive examples. Sheet documentation references Radix UI for advanced configuration. Drawer documentation includes responsive patterns and best practices. Both leverage well-maintained underlying libraries with their own comprehensive docs.

## Component Definitions

### Sheet (Radix Dialog-based)
- **Core purpose**: Display content that complements the main content of the screen in a slide-out panel attached to screen edges
- **Mental model**: A side-anchored overlay dialog - extends traditional dialogs with directional positioning
- **Semantic meaning**: Modal overlay that slides from screen edges (top/right/bottom/left)
- **Underlying library**: Built on `@radix-ui/react-dialog` primitive
- **Package size**: 17.93 kB (gzipped) - inherited from Radix Dialog

### Drawer (Vaul-based)
- **Core purpose**: Mobile-friendly slide-out panel with gesture support for displaying supplementary content
- **Mental model**: Bottom sheet pattern with swipe-to-dismiss - optimized for touch interactions
- **Semantic meaning**: Draggable modal panel primarily for mobile experiences
- **Underlying library**: Built on Vaul library by Emil Kowalski
- **Key differentiator**: Includes motion and swipe gestures built using Embla, snap points for multi-position drawers

## Architectural Comparison

| Aspect | Sheet (Radix Dialog) | Drawer (Vaul) |
|--------|---------------------|---------------|
| **Primary use case** | Desktop-first modal overlays | Mobile-first bottom sheets |
| **Positioning** | 4-directional (top/right/bottom/left) | Primarily bottom (configurable direction) |
| **Interaction model** | Click/keyboard-driven | Gesture/swipe-driven with drag handles |
| **Animation approach** | CSS-based fade/scale transitions | Physics-based spring animations with Embla |
| **Accessibility foundation** | WAI-ARIA Dialog pattern | Custom accessible drawer pattern |
| **Gesture support** | None | Native swipe-to-dismiss, drag handles |
| **Snap points** | Not supported | Multi-position snap points (0-1 scale) |
| **Responsive strategy** | Same component, different positions | Often paired with Dialog for desktop fallback |

## Content Patterns

### Sheet
| Pattern | Present | Details |
|---------|---------|---------|
| Header section | ✅ | `SheetHeader` with `SheetTitle` and `SheetDescription` |
| Footer section | ✅ | `SheetFooter` for actions/buttons |
| Scrollable content | ✅ | Via CSS overflow control |
| Custom layout | ✅ | Full control via className and composition |
| Form integration | ✅ | Supports async form submission patterns |

### Drawer
| Pattern | Present | Details |
|---------|---------|---------|
| Header section | ✅ | `DrawerHeader` with `DrawerTitle` and `DrawerDescription` |
| Footer section | ✅ | `DrawerFooter` for action buttons |
| Drag handle | ✅ | Optional `DrawerHandle` component for visual affordance |
| Scrollable content | ✅ | Automatic scroll handling with gesture support |
| Snap positions | ✅ | Array-based snap points (e.g., [0.5, 0.8, 1.0]) |
| Input repositioning | ✅ | Auto-repositions when mobile keyboard appears |

## Type Patterns

### Sheet Positioning
| Pattern | Present | Details |
|---------|---------|---------|
| Top | ✅ | `side="top"` - slides from top edge |
| Right | ✅ | `side="right"` - slides from right (common for forms) |
| Bottom | ✅ | `side="bottom"` - slides from bottom |
| Left | ✅ | `side="left"` - slides from left (common for navigation) |

### Drawer Direction
| Pattern | Present | Details |
|---------|---------|---------|
| Bottom | ✅ | `direction="bottom"` (default) - classic bottom sheet |
| Top | ✅ | `direction="top"` - inverted bottom sheet |
| Left | ✅ | `direction="left"` - side drawer from left |
| Right | ✅ | `direction="right"` - side drawer from right |

## State Patterns

### Sheet
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | `open` + `onOpenChange` props via Radix Dialog |
| Uncontrolled | ✅ | `defaultOpen` prop for internal state management |
| Modal mode | ✅ | Default behavior - traps focus and blocks interaction |
| Non-modal mode | ✅ | `modal={false}` allows background interaction |
| Dismissible | ✅ | Escape key, overlay click, close button |

### Drawer
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | `open` + `onOpenChange` props |
| Uncontrolled | ✅ | `defaultOpen` for internal state |
| Modal mode | ✅ | `modal={true}` (default) - disables background |
| Dismissible | ✅ | `dismissible={true}` (default) - drag/click/escape to close |
| Non-dismissible | ✅ | `dismissible={false}` - requires explicit close action |
| Handle-only drag | ✅ | `handleOnly={true}` - restricts dragging to handle element |
| Snap point control | ✅ | `activeSnapPoint` + `setActiveSnapPoint` for controlled snapping |

## Variation Patterns

### Sheet Sizing
| Pattern | Present | Details |
|---------|---------|---------|
| Custom width | ✅ | Via `className` - e.g., `className="w-[400px] sm:w-[540px]"` |
| Custom height | ✅ | Via `className` for top/bottom sheets |
| Responsive sizing | ✅ | Tailwind responsive utilities (sm/md/lg breakpoints) |
| Full screen | ✅ | CSS classes for 100% viewport coverage |

### Drawer Snap Points
| Pattern | Present | Details |
|---------|---------|---------|
| Multi-position | ✅ | `snapPoints={[0.5, 0.8, 1.0]}` - percentage of screen height |
| Controlled snap | ✅ | `activeSnapPoint` + `setActiveSnapPoint` |
| Fade overlay | ✅ | `fadeFromIndex` - overlay fades starting at specific snap index |
| Sequential snapping | ✅ | `snapToSequentialPoint={false}` - allows velocity-based skipping |

### Styling Customization (Both)
| Pattern | Present | Details |
|---------|---------|---------|
| Tailwind classes | ✅ | Primary styling mechanism via `className` |
| CSS custom properties | ⚠️ | Limited - mostly Tailwind-driven |
| Animation control | ⚠️ | Built-in animations, limited customization via CSS |
| Portal container | ✅ | `container` prop for custom portal target |

## Code Examples

### Sheet - Basic Side Panel (Right)
```jsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

### Sheet - Different Positions
```jsx
// Top position
<SheetContent side="top">
  {/* Content */}
</SheetContent>

// Left position (navigation)
<SheetContent side="left">
  {/* Content */}
</SheetContent>

// Bottom position (mobile-like)
<SheetContent side="bottom">
  {/* Content */}
</SheetContent>

// Custom width
<SheetContent className="w-[400px] sm:w-[540px]">
  {/* Content */}
</SheetContent>
```

### Drawer - Basic Bottom Sheet
```jsx
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

### Drawer - With Snap Points
```jsx
import { Drawer } from "@/components/ui/drawer"

export function SnapPointsDrawer() {
  const [snap, setSnap] = React.useState<number | string | null>(null)

  return (
    <Drawer
      snapPoints={[0.5, 0.8, 1.0]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={1}
    >
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        {/* Drawer can be dragged to 50%, 80%, or 100% of screen height */}
        <div className="p-4">
          <p>Current snap: {snap}</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

### Responsive Pattern - Dialog on Desktop, Drawer on Mobile
```jsx
'use client'

import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

export function ResponsiveDialog({ children, ...props }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent className="sm:max-w-[425px]">
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  )
}
```

### Drawer - Non-Dismissible with Handle-Only Drag
```jsx
<Drawer
  dismissible={false}
  handleOnly={true}
>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHandle />
    {/* Can only drag via handle, cannot dismiss by swiping down */}
    <div className="p-4">
      <p>Must use close button</p>
    </div>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button>Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Installation
```bash
# Sheet
pnpm dlx shadcn@latest add sheet

# Drawer
pnpm dlx shadcn@latest add drawer
```

## API Surface

### Sheet (extends Radix Dialog)

#### Sheet (Root Component)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `modal` | `boolean` | `true` | Enables modal behavior with focus trap |

#### SheetContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Position on screen edge |
| `className` | `string` | - | Tailwind classes for sizing/styling |
| `onOpenAutoFocus` | `(event: Event) => void` | - | Radix: Called when opened and focus moves into content |
| `onCloseAutoFocus` | `(event: Event) => void` | - | Radix: Called when closed and focus returns to trigger |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Radix: Called when Escape key pressed |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | - | Radix: Called when pointer down outside content |
| `onInteractOutside` | `(event: Event) => void` | - | Radix: Called when interaction outside content |

#### Other Sheet Components
- `SheetTrigger` - Opens sheet (supports `asChild` for composition)
- `SheetClose` - Closes sheet (supports `asChild`)
- `SheetHeader` - Semantic header wrapper
- `SheetFooter` - Semantic footer wrapper
- `SheetTitle` - Accessible title (announces to screen readers)
- `SheetDescription` - Accessible description
- `SheetOverlay` - Background overlay (inherited from Radix)
- `SheetPortal` - Portal wrapper (inherited from Radix)

### Drawer (Vaul-based)

#### Drawer.Root
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Disables background interaction when enabled |
| `direction` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Drawer position and drag direction |
| `dismissible` | `boolean` | `true` | Allows closing via drag/click/escape |
| `handleOnly` | `boolean` | `false` | Restricts dragging to handle element only |
| `snapPoints` | `number[]` | - | Array of numbers from 0-1 (% of screen) |
| `activeSnapPoint` | `number \| string \| null` | - | Controlled snap point state |
| `setActiveSnapPoint` | `(point: number \| string \| null) => void` | - | Callback for snap point changes |
| `fadeFromIndex` | `number` | - | Snap index where overlay fade begins |
| `snapToSequentialPoint` | `boolean` | `true` | Disables velocity-based snap skipping |
| `repositionInputs` | `boolean` | `true` | Repositions inputs when keyboard appears |
| `container` | `HTMLElement` | `document.body` | Portal target element |
| `onAnimationEnd` | `(open: boolean) => void` | - | Triggered after animations complete |

#### Other Drawer Components
- `DrawerTrigger` - Opens drawer (supports `asChild`)
- `DrawerPortal` - Portals overlay and content to body
- `DrawerOverlay` - Background overlay (supports `asChild`)
- `DrawerContent` - Main drawer container (supports `asChild`)
- `DrawerClose` - Closes drawer (supports `asChild`)
- `DrawerTitle` - Accessible title announcement (supports `asChild`)
- `DrawerDescription` - Accessible description (supports `asChild`)
- `DrawerHandle` - Visual drag handle (no props)
- `DrawerHeader` - Semantic header wrapper
- `DrawerFooter` - Semantic footer wrapper

## Notable Features

### Sheet (Radix Dialog-based)

#### Comprehensive Accessibility
- **WAI-ARIA Dialog Pattern**: Full compliance with ARIA authoring practices
- **Focus Management**: Automatic focus trap in modal mode, returns focus to trigger on close
- **Screen Reader Support**: `SheetTitle` and `SheetDescription` provide context announcements
- **Keyboard Navigation**: Tab cycles through focusable elements, Escape closes, Space/Enter activates
- **Customizable Focus**: `onOpenAutoFocus` and `onCloseAutoFocus` for fine control

#### Flexible Positioning System
- **4-Directional Support**: Top, right, bottom, left positioning
- **Responsive Sizing**: Tailwind utilities for breakpoint-specific dimensions
- **No Fixed Dimensions**: Component doesn't impose size constraints
- **Portal Control**: Custom container for portal rendering

#### Radix UI Foundation Benefits
- **Battle-Tested Primitives**: Leverages Radix's mature, well-maintained Dialog
- **Composition Pattern**: Compound components for maximum flexibility
- **Event Callbacks**: Rich event lifecycle hooks (`onEscapeKeyDown`, `onPointerDownOutside`, etc.)
- **Controlled/Uncontrolled**: Supports both state management patterns
- **Async Form Support**: Built-in patterns for async submission handling

### Drawer (Vaul-based)

#### Gesture-First Interaction
- **Swipe-to-Dismiss**: Natural touch gesture for closing (when `dismissible={true}`)
- **Drag Handle**: Optional visual affordance with `DrawerHandle` component
- **Handle-Only Mode**: Restrict dragging to handle area (`handleOnly={true}`)
- **Physics-Based Animation**: Spring animations via Embla for smooth, natural motion
- **Velocity Awareness**: Gesture velocity affects snap point selection

#### Snap Points System
- **Multi-Position Drawers**: Array-based snap heights (e.g., `[0.5, 0.8, 1.0]`)
- **Percentage-Based**: Values from 0-1 represent screen coverage percentage
- **Controlled Snapping**: External state control via `activeSnapPoint`/`setActiveSnapPoint`
- **Smart Overlay**: `fadeFromIndex` fades overlay progressively based on snap position
- **Sequential Override**: `snapToSequentialPoint={false}` allows gesture-based snap skipping

#### Mobile-Optimized Features
- **Input Repositioning**: Automatically adjusts drawer when mobile keyboard appears
- **Touch-Friendly**: Designed for finger-based interaction patterns
- **Responsive Pairing**: Often combined with Dialog for desktop experiences
- **Bottom Sheet Pattern**: Native iOS/Android bottom sheet behavior

#### Customization & Control
- **Animation Callbacks**: `onAnimationEnd` for post-animation logic
- **Portal Target**: Custom `container` for specific DOM mounting
- **Modal/Non-Modal**: Toggle background interaction blocking
- **Direction Support**: Not just bottom - supports top/left/right as well

## Comparison Matrix: Sheet vs Drawer

| Feature | Sheet | Drawer | Winner |
|---------|-------|--------|--------|
| **Desktop UX** | ✅ Excellent | ⚠️ Good but not ideal | Sheet |
| **Mobile UX** | ⚠️ Works but basic | ✅ Optimized | Drawer |
| **Gesture support** | ❌ None | ✅ Full swipe/drag | Drawer |
| **Multi-position** | ❌ No snap points | ✅ Snap points | Drawer |
| **Accessibility** | ✅ WAI-ARIA Dialog | ⚠️ Custom pattern | Sheet |
| **Keyboard UX** | ✅ Full support | ✅ Full support | Tie |
| **Animation quality** | ⚠️ CSS-based | ✅ Physics-based | Drawer |
| **Directional flexibility** | ✅ 4 directions | ✅ 4 directions | Tie |
| **Maturity** | ✅ Radix (stable) | ⚠️ Vaul (unmaintained hobby project) | Sheet |
| **Package size** | 17.93 kB | Unknown | Unknown |
| **Form integration** | ✅ Async patterns | ✅ Standard support | Tie |
| **Event callbacks** | ✅ Rich Radix API | ✅ Animation callbacks | Tie |

## Research Notes

### Documentation Accessibility
- **Sheet**: Very clean documentation with Radix UI reference links for deep dives
- **Drawer**: Excellent docs with responsive pattern examples, though Vaul docs are minimal
- **Installation**: Both use shadcn CLI for seamless local installation
- **Examples**: Interactive demos on shadcn site, limited examples on Vaul site

### Framework Philosophy Alignment

#### Shadcn's Approach (Both Components)
1. **Copy, Don't Install**: Components added to project via CLI, not installed as dependencies
2. **Full Ownership**: Developer owns and can modify component source code
3. **Composition Over Configuration**: Minimal props with maximum flexibility via className
4. **Tailwind-First**: All styling through utility classes, no built-in theme system
5. **React-Only**: Tightly coupled to React, no framework-agnostic approach

#### Underlying Library Differences
- **Radix UI** (Sheet): Mature, well-maintained, comprehensive docs, large ecosystem
- **Vaul** (Drawer): Hobby project (unmaintained per creator), smaller community, focused scope

### Usage Patterns in the Wild

#### When to Use Sheet
- Desktop-first applications
- Navigation panels (left/right sheets)
- Form overlays needing strong accessibility
- Multi-directional use cases (top alerts, side panels)
- Projects requiring WAI-ARIA compliance
- When gesture support is not needed

#### When to Use Drawer
- Mobile-first applications
- Bottom sheet patterns (iOS/Android style)
- Gesture-driven interactions (swipe-to-dismiss)
- Multi-position drawers (snap points for partial/full height)
- Input-heavy forms on mobile (auto-repositioning)
- When physics-based animations are desired

#### When to Use Both
The documentation explicitly demonstrates combining Sheet/Drawer with Dialog for responsive experiences:
- **Desktop**: Use Dialog or Sheet for modal overlays
- **Mobile**: Use Drawer for bottom sheet interaction
- **Implementation**: `useMediaQuery` hook to switch based on breakpoint

### Accessibility Considerations

#### Sheet (Strong)
- Full WAI-ARIA Dialog pattern implementation via Radix
- Screen reader announcements via Title/Description
- Automatic focus management and trap
- Keyboard navigation (Tab, Escape, Space/Enter)
- Customizable focus events for advanced control

#### Drawer (Moderate)
- Custom accessibility implementation (not WAI-ARIA Dialog)
- Title/Description components for screen reader context
- Keyboard support for open/close
- Gesture accessibility may need additional ARIA labels
- Less mature accessibility testing compared to Radix

### Performance & Bundle Size
- **Sheet**: Inherits Radix Dialog's 17.93 kB (gzipped) footprint
- **Drawer**: Vaul size not documented, but includes Embla for gestures
- **Both**: Relatively lightweight given feature set
- **Consideration**: Shadcn approach bundles code in project (not tree-shakeable dependency)

### Maintenance & Sustainability

#### Sheet
- ✅ Built on Radix UI (actively maintained by WorkOS team)
- ✅ Large community, frequent updates
- ✅ Comprehensive docs and examples
- ✅ Enterprise-grade stability

#### Drawer
- ⚠️ Vaul explicitly marked as "unmaintained hobby project" by creator
- ⚠️ No active development plans
- ⚠️ Minimal documentation on Vaul site
- ✅ 8k stars, 335k+ projects using it (community adoption)
- ⚠️ Risk: Future React/browser changes may not be addressed

### Notable Design Decisions

#### Sheet
- **No built-in sizing**: Intentionally delegates to className for flexibility
- **No default animations**: Relies on Radix defaults, customizable via CSS
- **Portal by default**: All content rendered in body (customizable)
- **Modal by default**: Focus trap and background blocking standard

#### Drawer
- **Gesture-first**: Designed around swipe interactions, keyboard secondary
- **Snap points as core feature**: Multi-position drawers central to UX
- **Input awareness**: Mobile keyboard handling built-in
- **Bottom-default**: Optimized for bottom sheet pattern, other directions secondary

## Key Takeaways for Semantic UI

### Pattern Alignment
1. **Dual Component Strategy**: Separate Sheet (desktop) and Drawer (mobile) makes sense
2. **Directional Positioning**: 4-way positioning is table stakes for both patterns
3. **Controlled/Uncontrolled**: Support both state management patterns
4. **Accessibility Foundation**: WAI-ARIA Dialog pattern for Sheet is gold standard
5. **Gesture Support**: Mobile users expect swipe-to-dismiss for drawers

### Pattern Divergence
1. **React Dependency**: Shadcn is React-only, incompatible with Semantic UI's web component approach
2. **Copy-Paste Model**: CLI installation model doesn't fit npm package distribution
3. **Tailwind-Only Styling**: Semantic UI's design token system is more comprehensive
4. **Maintenance Risk**: Vaul's unmaintained status is concerning for enterprise use

### Potential Adoptions

#### From Sheet (Radix Dialog)
1. **Composition Pattern**: Separate Header, Title, Description, Footer, Content components
2. **Side Prop API**: Simple `side="top|right|bottom|left"` is clean and intuitive
3. **Focus Management**: Automatic focus trap with customizable callbacks
4. **Event Lifecycle**: Rich event hooks (onEscapeKeyDown, onPointerDownOutside, etc.)
5. **Portal Control**: Customizable container for portal rendering

#### From Drawer (Vaul)
1. **Snap Points System**: Array-based multi-position drawers (`snapPoints={[0.5, 0.8, 1.0]}`)
2. **Drag Handle Pattern**: Optional visual affordance for drag affordance
3. **Handle-Only Mode**: Restrict dragging to specific element for control
4. **Input Repositioning**: Auto-adjust when mobile keyboard appears
5. **Animation Callbacks**: Post-animation hooks for sequencing logic
6. **Fade Index**: Progressive overlay fade based on drawer position

#### Web Component Implementation Strategy
1. **Custom Gestures**: Implement swipe detection using Pointer Events API (web standard)
2. **Web Animations API**: Use native animation capabilities instead of React-specific libraries
3. **Focus Trap**: Implement focus management using browser FocusEvent APIs
4. **Accessibility**: Follow WAI-ARIA Dialog pattern with proper roles and states
5. **Responsive Patterns**: Use CSS media queries and custom elements for device adaptation

### Avoid These Patterns
1. **Framework Lock-In**: Don't tie to React - maintain framework-agnostic web components
2. **Unmaintained Dependencies**: Build gesture support in-house rather than relying on hobby projects
3. **Tailwind Dependency**: Support multiple styling approaches (design tokens, CSS variables, Tailwind)
4. **Copy-Paste Distribution**: Maintain standard npm package approach
5. **Mobile-Only Optimization**: Ensure both Sheet and Drawer work well across all devices

### Implementation Recommendations

#### For Semantic UI Sheet Component
```javascript
// Suggested API design
<ui-sheet side="right" modal open>
  <ui-sheet-trigger slot="trigger">
    <button>Open Sheet</button>
  </ui-sheet-trigger>

  <ui-sheet-header>
    <ui-sheet-title>Edit Profile</ui-sheet-title>
    <ui-sheet-description>Make changes here</ui-sheet-description>
  </ui-sheet-header>

  <ui-sheet-content>
    <!-- Form fields -->
  </ui-sheet-content>

  <ui-sheet-footer>
    <button>Save</button>
    <ui-sheet-close>Cancel</ui-sheet-close>
  </ui-sheet-footer>
</ui-sheet>
```

**Key Features:**
- `side` attribute: "top" | "right" | "bottom" | "left"
- `modal` boolean: Enable focus trap and background blocking
- `open` attribute for controlled state
- Slot-based content projection
- WAI-ARIA Dialog pattern compliance
- Escape key and overlay click to dismiss
- CSS custom properties for sizing/theming

#### For Semantic UI Drawer Component
```javascript
// Suggested API design
<ui-drawer
  direction="bottom"
  snap-points="[0.5, 0.8, 1.0]"
  active-snap="0.8"
  handle-only
  dismissible
>
  <ui-drawer-trigger slot="trigger">
    <button>Open Drawer</button>
  </ui-drawer-trigger>

  <ui-drawer-content>
    <ui-drawer-handle></ui-drawer-handle>

    <ui-drawer-header>
      <ui-drawer-title>Confirm Action</ui-drawer-title>
      <ui-drawer-description>This cannot be undone</ui-drawer-description>
    </ui-drawer-header>

    <!-- Content -->

    <ui-drawer-footer>
      <button>Confirm</button>
      <ui-drawer-close>Cancel</ui-drawer-close>
    </ui-drawer-footer>
  </ui-drawer-content>
</ui-drawer>
```

**Key Features:**
- `direction` attribute: "top" | "bottom" | "left" | "right"
- `snap-points` for multi-position support (JSON array)
- `active-snap` for controlled snap state
- `handle-only` restricts dragging to handle
- `dismissible` enables/disables swipe-to-dismiss
- Pointer Events API for gesture detection
- Web Animations API for physics-based motion
- Automatic input repositioning on mobile
- Accessible keyboard controls

### Testing Considerations
1. **Gesture Testing**: Test swipe velocities, drag distances, snap point accuracy
2. **Keyboard Navigation**: Tab order, Escape key, Space/Enter activation
3. **Screen Reader**: Title/Description announcements, role="dialog", focus management
4. **Responsive Behavior**: Test on various device sizes and orientations
5. **Animation Performance**: Ensure 60fps on mobile devices
6. **Touch Targets**: Minimum 44x44px for drag handles and close buttons

### Documentation Needs
1. **When to Use Sheet vs Drawer**: Clear guidance on desktop vs mobile patterns
2. **Responsive Patterns**: Examples combining both for adaptive UX
3. **Accessibility Guide**: Focus management, ARIA attributes, keyboard shortcuts
4. **Gesture Customization**: How to configure swipe thresholds and snap behavior
5. **Animation Control**: Customizing enter/exit transitions
6. **Form Integration**: Best practices for forms inside sheets/drawers

## Conclusion

Shadcn UI provides two well-designed, complementary approaches to slide-out panels:

**Sheet** excels as a desktop-first, accessibility-focused solution built on the rock-solid Radix UI Dialog primitive. Its WAI-ARIA compliance, comprehensive keyboard navigation, and mature ecosystem make it ideal for applications requiring strong accessibility guarantees and traditional modal overlay patterns.

**Drawer** shines in mobile-first contexts, offering gesture-driven interactions, snap points for multi-position panels, and physics-based animations. However, its dependency on the unmaintained Vaul library raises long-term sustainability concerns.

For Semantic UI, the key lesson is **separation of concerns**: Sheet and Drawer should be distinct components optimized for their respective use cases rather than a single "one-size-fits-all" solution. Both should be implemented as framework-agnostic web components using standard browser APIs (Pointer Events, Web Animations, Focus Management) while adhering to WAI-ARIA patterns for accessibility.

The compositional approach (separate Header, Title, Content, Footer components) provides flexibility, while the simple directional positioning API (`side`/`direction` attributes) offers an intuitive developer experience. Gesture support should be built in-house using web standards rather than relying on third-party libraries with uncertain maintenance futures.

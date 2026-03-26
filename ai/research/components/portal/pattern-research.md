# Component Pattern Research: Portal

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 4
- Date: 2025-11-05
- Unique patterns identified: 15+

## Component Definition Consensus

Portal components render React children into DOM nodes outside the parent component's hierarchy, escaping stacking contexts and overflow constraints. Universal mental model: "DOM wormhole" or "teleporter."

**Primary Purpose:** Enable rendering UI elements (modals, tooltips, dropdowns, popovers) outside their parent containers to avoid CSS stacking context, z-index, and overflow issues while maintaining React component relationships.

**Mental Model:** A teleportation mechanism that moves rendered content from its logical position in the React tree to a different physical location in the DOM tree (typically document.body).

**Semantic meaning:** Represents a rendering boundary that solves layout constraints, enabling overlay content to escape parent limitations while preserving React context, events, and component relationships.

## Terminology Variations

- **Portal** (4 frameworks) = Chakra UI, ShadCN, Mantine, Radix UI

All frameworks use the term "Portal" consistently, derived from React's `ReactDOM.createPortal` API.

## Pattern Inventory

### Core Functionality Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| ReactDOM.createPortal wrapper | Wraps React's portal API | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Default body target | Renders to document.body by default | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Custom container | Specify target DOM node | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Children composition | Content via React children | 4/4 (100%) | **Level 1: Universal** | All | Composed |
| React tree preservation | Maintains React relationships | 4/4 (100%) | **Level 1: Universal** | All | Native |

### Configuration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Container prop | HTMLElement for target | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Ref-based targeting | RefObject for container | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Radix UI | Native |
| Selector string targeting | CSS selector string | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Disabled/inline mode | Render in-place instead | 1/4 (25%) | **Level 4: Occasional** | Chakra UI | Native |
| Optional portaling | Conditional portal behavior | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| asChild prop | Merge props with child element | 2/4 (50%) | **Level 3: Frequent** | Radix UI, ShadCN | Native |
| Polymorphic element | Change root element type | 1/4 (25%) | **Level 4: Occasional** | Chakra UI | Native |
| Implicit wrapping | Portal built into components | 1/4 (25%) | **Level 4: Occasional** | ShadCN | Native |
| Nested portals | Portals within portals | 4/4 (100%) | **Level 1: Universal** | All | Composed |

### Optimization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Target reuse | Share container across portals | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Auto target creation | Automatic div in body | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Force mount | Keep mounted when hidden | 1/4 (25%) | **Level 4: Occasional** | ShadCN/Radix UI | Native |

### SSR Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| SSR awareness | Handles server rendering | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Mantine | Native |
| Inline during SSR | Renders in-place on server | 1/4 (25%) | **Level 4: Occasional** | Chakra UI | Native |
| SSR not supported | Client-only component | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |

### Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Modal integration | Used in Modal components | 2/4 (50%) | **Level 3: Frequent** | Mantine, ShadCN | Native |
| Drawer integration | Used in Drawer components | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Tooltip integration | Used in Tooltip components | 2/4 (50%) | **Level 3: Frequent** | Mantine, Radix UI | Native |
| Dropdown integration | Used in Dropdown components | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |

## Notable Patterns

### Universal (100%)
- ReactDOM.createPortal wrapper
- Default document.body target
- Custom container support
- Children composition
- React tree preservation
- Nested portal support

### Implementation Approaches

**Minimal API (Radix UI):**
- 2 props only: `container`, `asChild`
- Pure utility primitive
- 1.72 kB gzipped
- Foundation for other primitives

**Enhanced API (Chakra UI):**
- 4 props: `as`, `container`, `disabled`, `children`
- SSR-aware behavior
- Polymorphic element support
- Inline rendering mode

**Optimization-Focused (Mantine):**
- Target reuse via `reuseTargetNode`
- Selector string support
- Separate `OptionalPortal` component
- Auto target creation

**Abstraction Layer (ShadCN):**
- Re-exports Radix UI Portal
- Implicit in DialogContent
- Users rarely interact directly
- "Make simple things simple" approach

## Implementation Notes

### Installation

**Chakra UI:**
```jsx
import { Portal } from '@chakra-ui/react'
```
Part of @chakra-ui/react core.

**Mantine:**
```tsx
import { Portal, OptionalPortal } from '@mantine/core'
```
Part of @mantine/core v8.3.6.

**Radix UI:**
```bash
npm install @radix-ui/react-portal
```
Standalone package v1.1.9.

**ShadCN:**
```tsx
import { DialogPortal } from '@/components/ui/dialog'
```
Copy-paste, uses Radix UI internally.

### Basic Usage Comparison

**Chakra UI:**
```jsx
// Default (to body)
<Portal>
  <div>Portal content</div>
</Portal>

// Custom container
<Portal container={containerRef}>
  <div>Content</div>
</Portal>

// Inline rendering
<Portal disabled>
  <div>Renders in place</div>
</Portal>
```

**Mantine:**
```tsx
// Default (to body)
<Portal>
  <div>Portal content</div>
</Portal>

// Selector string
<Portal target=".custom-portal-container">
  <div>Content</div>
</Portal>

// Target reuse
<Portal reuseTargetNode>
  <div>Shared container</div>
</Portal>

// Optional portaling
<OptionalPortal withinPortal={condition}>
  <div>Conditionally portaled</div>
</OptionalPortal>
```

**Radix UI:**
```jsx
// Default (to body)
<Portal.Root>
  <div>Portal content</div>
</Portal.Root>

// Custom container
<Portal.Root container={containerRef.current}>
  <div>Content</div>
</Portal.Root>

// With composition
<Portal.Root asChild>
  <CustomComponent>Content</CustomComponent>
</Portal.Root>
```

**ShadCN:**
```tsx
// Implicit (in DialogContent)
<Dialog>
  <DialogContent>
    {/* Portal automatic */}
  </DialogContent>
</Dialog>

// Explicit (rare)
<DialogPortal>
  <DialogOverlay />
  <DialogPrimitive.Content>
    Content
  </DialogPrimitive.Content>
</DialogPortal>
```

### Container Specification Patterns

**Ref-based (Chakra UI, Radix UI):**
```jsx
const containerRef = useRef(null);

<div ref={containerRef} />
<Portal container={containerRef}>
  Content
</Portal>
```

**Direct Element (Radix UI):**
```jsx
const element = document.getElementById('portal-root');

<Portal.Root container={element}>
  Content
</Portal.Root>
```

**Selector String (Mantine):**
```jsx
<Portal target=".portal-container">
  Content
</Portal>
```

### SSR Handling

**Chakra UI:**
- Automatically renders inline during SSR
- Client-side activation post-hydration
- No hydration warnings

**Mantine:**
- Explicitly does not support SSR
- Content renders only after client mount
- Conditional rendering recommended

**Radix UI / ShadCN:**
- SSR behavior inherited from React
- Hydration handled by React reconciliation
- No special SSR mode

## Design Philosophy Differences

### Pure Utility (Radix UI)
- **Philosophy**: Minimal, unstyled primitive
- **API**: 2 props only
- **Size**: 1.72 kB gzipped
- **Audience**: Library builders, design systems
- **Integration**: Foundation for other primitives

### Enhanced Utility (Chakra UI)
- **Philosophy**: Developer-friendly defaults
- **API**: 4 props with polymorphism
- **Features**: SSR handling, inline mode
- **Audience**: Application developers
- **Integration**: Direct usage encouraged

### Optimization-Focused (Mantine)
- **Philosophy**: Performance and flexibility
- **API**: Multiple components (Portal, OptionalPortal)
- **Features**: Target reuse, selector strings
- **Audience**: Performance-conscious developers
- **Integration**: Built into overlay components

### Abstraction Layer (ShadCN)
- **Philosophy**: Hide complexity
- **API**: Re-export with no additions
- **Features**: Implicit in higher-level components
- **Audience**: Rapid prototyping
- **Integration**: Transparent to users

## Sophisticated Design Patterns

### Chakra UI - Disabled/Inline Mode Fallback

**What it does**: The `disabled` prop renders portaled content inline instead of to document.body, allowing a single Portal component to switch between portal and non-portal behavior without remounting. This enables responsive design patterns where overlay behavior depends on viewport size or other conditions.

```jsx
<Portal disabled={isMobileOrSmallViewport}>
  <div>Dynamically portaled or inline</div>
</Portal>
```

**Why it's sophisticated**: Portal components traditionally require either being present (portal to body) or absent (not mounted). Chakra UI solves the problem of needing the same component tree to sometimes portal and sometimes not port—critical for responsive overlays that might be inline dropdowns on mobile but floating modals on desktop. This avoids component tree restructuring based on responsive conditions.

**Evidence of design maturity**:
- Enables responsive portal behavior without conditional component rendering patterns
- SSR-aware (renders inline during server rendering automatically, solving hydration challenges)
- Maintains event bubbling and context access regardless of portal mode—React tree semantics preserved even when DOM position changes

---

### Mantine - Target Node Reuse Optimization

**What it does**: The `reuseTargetNode` prop consolidates multiple Portal instances into a single DOM container instead of creating separate portal divs for each instance. Multiple portals with this flag enabled share one target element appended to document.body.

```jsx
<Portal reuseTargetNode>
  <Tooltip>Tooltip 1</Tooltip>
</Portal>
<Portal reuseTargetNode>
  <Tooltip>Tooltip 2</Tooltip>
</Portal>
// Renders to same DOM node, not separate portal containers
```

**Why it's sophisticated**: It solves an often-overlooked problem: applications with many simultaneous portals (tooltips, popovers, notifications) create N portal container divs in the DOM. This optimization reduces DOM noise and improves performance by sharing a single container. Most frameworks ignore this; Mantine makes it explicit and available.

**Evidence of design maturity**:
- Recognizes that portal container proliferation is a real performance concern in production apps
- Provides explicit opt-in rather than auto-reuse (maintaining predictability for developers)
- Works across all portal instances in the app—demonstrates awareness of application-level, not just component-level, concerns

---

### Radix UI / Frameworks - React Tree Preservation Across Portal Boundary

**What it does**: Portal preserves React component tree semantics despite DOM repositioning. Events bubble through the React tree (not DOM tree), context providers remain accessible, and component lifecycle treats the portal as transparent—all features that would be impossible with naive DOM-only porting.

```jsx
<div onClick={handleParentClick}>
  <Portal>
    <button>Click me</button>
    {/* onClick bubbles to parent div via React tree, NOT DOM */}
  </Portal>
</div>

<ThemeProvider>
  <Portal>
    <StyledComponent /> {/* Accesses theme context normally */}
  </Portal>
</ThemeProvider>
```

**Why it's sophisticated**: This is the fundamental reason Portal exists as a React component rather than just calling `ReactDOM.createPortal` directly. Maintaining React semantics while breaking DOM hierarchy requires careful handling of context providers, event systems, and component relationships—it's non-obvious that this "just works."

**Evidence of design maturity**:
- Solves the problem that DOM tree and React tree divergence creates confusion about "where events go" and "how context flows"
- All frameworks implement this consistently, suggesting it's a solved, well-understood problem
- Developers can treat portal content as logically "inside" its parent component despite physical DOM position elsewhere

---

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **Modal dialogs** - Full-screen overlays
2. **Tooltips** - Positioned floating content
3. **Dropdowns** - Menus escaping overflow
4. **Popovers** - Contextual overlays
5. **Drawers** - Side panels
6. **Toast notifications** - Fixed-position alerts

## Technical Considerations

### React Event Bubbling
All frameworks note that events bubble through the React tree, not the DOM tree:
```jsx
<div onClick={handleClick}>
  <Portal>
    <button>Click</button> {/* Event bubbles to parent div */}
  </Portal>
</div>
```

### Focus Management
All frameworks note that focus management is the developer's responsibility:
- Portal maintains React relationships
- Tab order follows DOM order (not React order)
- Manual focus control required for accessibility

### Style Inheritance
Limited CSS inheritance across portal boundary:
- Inherited styles (color, font-family) may not apply
- Direct styling on portaled content required
- Theme context preserved via React

## Accessibility Considerations

### Common Patterns

**React Tree Preservation:**
- Context values accessible
- Event handlers work correctly
- Props flow naturally

**Focus Management:**
All frameworks require manual:
- Focus trapping for modals
- Focus return on close
- Tab order management

**Screen Readers:**
- DOM order matters for screen readers
- ARIA relationships may need explicit linking
- Modal content should have proper roles

### Best Practices (Documented)

**Chakra UI:**
- Use with Modal, Drawer for automatic focus management
- Consider SSR implications
- Test keyboard navigation

**Mantine:**
- Built into Modal/Drawer with focus traps
- Not recommended for standalone use
- Prefer higher-level components

**Radix UI:**
- Used internally in accessible primitives
- Focus management in Dialog, etc.
- Part of complete accessible patterns

## Comparison Notes

### Similarities
- All wrap ReactDOM.createPortal
- All default to document.body
- All support custom containers
- All maintain React relationships
- All compose via children

### Differences

| Aspect | Chakra UI | Mantine | Radix UI | ShadCN |
|--------|-----------|---------|----------|--------|
| **Props** | 4 props | 3 props | 2 props | Radix UI |
| **SSR** | Auto-handled | Not supported | React default | React default |
| **Targeting** | Ref-based | Ref + selector | Ref-based | Radix UI |
| **Optimization** | None | Target reuse | None | Radix UI |
| **Composition** | `as` prop | None | `asChild` | `asChild` |
| **Inline Mode** | `disabled` | OptionalPortal | None | forceMount |
| **Bundle** | Part of core | Part of core | 1.72 kB | Radix UI |

## Raw Data

- [Chakra UI](./chakra-ui/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
- [Radix UI](./radix-ui/usage-patterns.md)
- [ShadCN](./shadcn/usage-patterns.md)

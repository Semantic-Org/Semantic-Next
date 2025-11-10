# Popup/Popover - Aggregate Pattern Research

> Cross-framework analysis of Popup/Popover patterns across 10 UI frameworks
> Research Date: 2025-11-04

## Executive Summary

This report analyzes Popup/Popover component implementations across 10 modern UI frameworks (Ant Design, Chakra UI, Headless UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Radix UI, Semantic UI Classic, ShadCN). The component serves as a floating overlay for displaying rich, interactive content anchored to a trigger element—fundamentally different from tooltips by supporting complex interactions and from modals by being non-blocking and contextually positioned.

**Key Finding**: All frameworks converge on a compound component pattern with trigger + content separation, but diverge significantly on positioning APIs, state management, and trigger mode support. The modern trend is toward headless/unstyled implementations with sophisticated positioning systems built on Floating UI.

## Component Definition Consensus

### Core Purpose
All frameworks define popover as a **floating overlay for rich interactive content**, triggered by user action, displaying contextual information without navigation or modal blocking. Distinguished from:
- **Tooltip**: Simple, hover-triggered, read-only text
- **Popover**: Click-triggered, interactive, complex content
- **Modal**: Blocking, center-screen, critical workflows

### Mental Model
The shared mental model is a **"temporary expanded view"** or **"mini-dialog"** that:
- Appears near trigger element (spatial relationship)
- Contains interactive content (forms, buttons, navigation)
- Requires explicit dismissal (click outside, Esc, close button)
- Maintains page context (non-blocking, non-modal)

### Semantic Meaning
Popovers communicate **"supplementary information or actions available on demand"**—important but not critical to primary workflow.

## Terminology Analysis

### Primary Terms
| Framework | Component Name | Notes |
|-----------|---------------|-------|
| Ant Design | Popover | Standard term |
| Chakra UI | Popover | Standard term |
| Headless UI | Popover | Standard term |
| HeroUI | Popover | Standard term |
| Mantine | Popover | Standard term |
| Nuxt UI | Popover | Standard term |
| PrimeReact | OverlayPanel | Unique naming |
| Radix UI | Popover | Standard term |
| Semantic UI Classic | Popup | Semantic's term |
| ShadCN | Popover | Standard term |

**Observation**: PrimeReact uses "OverlayPanel" (emphasizing panel aspect), Semantic UI uses "Popup" (shorter, more casual), all others use "Popover" (industry standard).

### Sub-component Naming Patterns

**Root Component**:
- `<Popover>` - Ant Design, Chakra UI v2, Mantine, PrimeReact
- `<Popover.Root>` - Chakra UI v3, Radix UI, ShadCN
- `<Popover>` (state provider) - Headless UI, HeroUI, Nuxt UI

**Trigger Component**:
- `<PopoverTrigger>` - Chakra UI v2, HeroUI, Radix UI, ShadCN
- `<Popover.Trigger>` - Chakra UI v3, Headless UI
- `<PopoverButton>` - Headless UI (alternate)
- Child element - Ant Design, Mantine (implicit via children wrapping)
- Target prop/ref - PrimeReact, Semantic UI Classic

**Content Component**:
- `<PopoverContent>` - Chakra UI v2, HeroUI, Radix UI, ShadCN
- `<Popover.Content>` - Chakra UI v3, Headless UI
- `<PopoverPanel>` - Headless UI (alternate)
- `<Popover.Dropdown>` - Mantine
- Content prop - Ant Design, PrimeReact, Semantic UI Classic

## Pattern Support Matrix

### Trigger Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **Click trigger** | Universal (100%) | All 10 frameworks |
| **Hover trigger** | Common (70%) | Ant Design, Nuxt UI, Semantic UI Classic, Mantine, PrimeReact (partial), Chakra UI v2, ShadCN |
| **Focus trigger** | Common (80%) | Ant Design, Chakra UI, Headless UI, HeroUI, Mantine, PrimeReact, Radix UI, ShadCN |
| **Manual/controlled** | Universal (100%) | All 10 frameworks via state props |
| **Custom trigger element** | Universal (100%) | All support via composition or `asChild` pattern |
| **Context menu trigger** | Rare (10%) | Ant Design (via trigger prop), Mantine |
| **Multiple triggers** | Moderate (40%) | Chakra UI, Headless UI, Radix UI, Mantine |

**Usage Level**: Level 1 (Universal) - Click and controlled state
**Usage Level**: Level 2 (Common) - Hover and focus triggers
**Usage Level**: Level 4 (Occasional) - Context menu and multiple triggers

### Content Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **Text content** | Universal (100%) | All 10 frameworks |
| **Rich HTML/JSX** | Universal (100%) | All 10 frameworks |
| **Title/heading** | Universal (100%) | All support via composition or dedicated prop |
| **Form inputs** | Universal (100%) | All support interactive content |
| **Icons** | Universal (100%) | All via composition |
| **Actions/buttons** | Universal (100%) | All support via composition |
| **Images/media** | Universal (100%) | All support, some with special components (Radix `<Inset>`) |
| **Close button** | Common (80%) | Chakra UI, Headless UI, HeroUI (auto), Mantine, PrimeReact, Radix UI, ShadCN |
| **Header/body/footer** | Common (70%) | Chakra UI, Mantine, PrimeReact (via template), ShadCN |
| **Dynamic content** | Universal (100%) | All via render functions or reactive data |

**Usage Level**: Level 1 (Universal) - All basic content patterns

### Positioning Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **12 placements** | Universal (100%) | All 10 frameworks (top/right/bottom/left + start/end/center) |
| **Auto-positioning/flip** | Universal (100%) | All 10 frameworks with collision detection |
| **Offset control** | Universal (100%) | All frameworks via offset/gap props |
| **Arrow/pointer** | Universal (100%) | All frameworks support (some optional component) |
| **Collision boundary** | Common (80%) | Headless UI, HeroUI, Mantine, Nuxt UI, Radix UI, ShadCN, Chakra UI |
| **Virtual positioning** | Moderate (30%) | Headless UI, Nuxt UI, Radix UI (custom reference) |
| **Match trigger width** | Common (60%) | Headless UI, Mantine, Nuxt UI, PrimeReact, Radix UI, ShadCN |
| **Portal rendering** | Universal (90%) | All except Semantic UI Classic (automatic or configurable) |

**Usage Level**: Level 1 (Universal) - Basic 12-placement system with auto-flip
**Usage Level**: Level 2 (Common) - Collision boundaries and width matching
**Usage Level**: Level 3 (Moderate) - Virtual positioning

### Behavior Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **Click outside close** | Universal (100%) | All 10 frameworks (default behavior) |
| **Escape key close** | Universal (100%) | All 10 frameworks |
| **Tab navigation** | Universal (100%) | All support focus management |
| **Open/close animation** | Universal (100%) | All frameworks (built-in or via transition props) |
| **Focus trap** | Common (70%) | Chakra UI, Headless UI, HeroUI, Mantine, Radix UI, ShadCN |
| **Return focus** | Common (80%) | Chakra UI, Headless UI, HeroUI, Mantine, Radix UI, ShadCN |
| **Lazy mounting** | Common (60%) | Ant Design, Chakra UI, Headless UI, HeroUI, Mantine, ShadCN |
| **Modal mode** | Moderate (50%) | Headless UI, HeroUI, Nuxt UI, Radix UI, ShadCN |
| **Backdrop overlay** | Moderate (50%) | Chakra UI, Headless UI, HeroUI, Nuxt UI, ShadCN |
| **Scroll behavior** | Common (60%) | HeroUI, Mantine, Nuxt UI, PrimeReact, ShadCN |

**Usage Level**: Level 1 (Universal) - Basic dismiss and keyboard behavior
**Usage Level**: Level 2 (Common) - Advanced focus management and lazy mounting
**Usage Level**: Level 3 (Moderate) - Modal mode and backdrops

### Interactive Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **Controlled state** | Universal (100%) | All 10 frameworks (`open`/`isOpen` + callback) |
| **Uncontrolled state** | Universal (100%) | All 10 frameworks (`defaultOpen`) |
| **Render props** | Common (60%) | Chakra UI v2, Headless UI, Mantine, Nuxt UI, ShadCN |
| **Event callbacks** | Universal (100%) | All frameworks (`onOpenChange`, etc.) |
| **Keyboard shortcuts** | Rare (20%) | Nuxt UI (via defineShortcuts), custom implementations |
| **Nested popovers** | Moderate (40%) | Ant Design (limited), Chakra UI, Headless UI, Radix UI |
| **Grouped popovers** | Rare (20%) | Headless UI (`PopoverGroup`), Mantine |
| **Async actions** | Universal (100%) | All support via callbacks and state management |

**Usage Level**: Level 1 (Universal) - Controlled/uncontrolled state with callbacks
**Usage Level**: Level 2 (Common) - Render props for internal state access
**Usage Level**: Level 3 (Moderate) - Nested popover support
**Usage Level**: Level 4 (Occasional) - Keyboard shortcuts and grouped popovers

## Architectural Patterns

### Component Composition Models

**1. Compound Components (Modern Standard)**
- **Frameworks**: Chakra UI, Headless UI, HeroUI, Mantine, Radix UI, ShadCN
- **Pattern**: Separate Root, Trigger, and Content components
- **Example**:
```jsx
<Popover.Root>
  <Popover.Trigger>...</Popover.Trigger>
  <Popover.Content>...</Popover.Content>
</Popover.Root>
```
- **Benefits**: Clear separation of concerns, composable, type-safe
- **Drawbacks**: More verbose, requires understanding composition

**2. Prop-Based Content**
- **Frameworks**: Ant Design, PrimeReact, Semantic UI Classic
- **Pattern**: Content passed as prop, trigger as child
- **Example**:
```jsx
<Popover content={<div>...</div>} title="Title">
  <Button>Trigger</Button>
</Popover>
```
- **Benefits**: Concise, familiar pattern, less nesting
- **Drawbacks**: Less flexible for complex composition

**3. Hybrid Approach**
- **Frameworks**: Nuxt UI
- **Pattern**: Slots for both trigger and content
- **Example**:
```vue
<UPopover>
  <UButton label="Trigger" />
  <template #content>...</template>
</UPopover>
```
- **Benefits**: Vue-idiomatic, clean slot-based composition

### State Management Patterns

**1. Controlled + Uncontrolled (Universal)**
- All frameworks support both patterns
- Controlled: `open` + `onOpenChange` (or equivalent)
- Uncontrolled: `defaultOpen` for initial state
- Standard React pattern applied consistently

**2. Render Props (60% adoption)**
- Exposes internal state to children via function
- Pattern: `{({ open, close }) => ...}`
- Used by: Chakra UI v2, Headless UI, Mantine, Nuxt UI, ShadCN
- Enables conditional rendering based on open state

**3. Hooks for Nested Control**
- Headless UI: `useClose()` hook for deeply nested components
- Enables closing from anywhere in component tree
- Solves prop drilling for close callbacks

### Positioning Architecture

**1. Floating UI Integration (Majority)**
- **Frameworks**: Headless UI, HeroUI, Mantine, Nuxt UI, Radix UI, ShadCN
- Built on Floating UI (formerly Popper.js) for positioning
- Provides collision detection, auto-flip, boundary awareness
- Industry standard for floating element positioning

**2. Custom Positioning (Legacy)**
- **Frameworks**: Ant Design (rc-tooltip), Semantic UI Classic
- Proprietary positioning logic
- Less sophisticated collision detection
- Older codebases

**3. Positioning Prop Patterns**
- **Flat props**: `placement`, `offset`, `gutter` (Ant Design, Chakra UI v2)
- **Nested object**: `content={{ side, align, offset }}` (Nuxt UI, Headless UI v2)
- **Individual props**: `side`, `align`, `sideOffset` (Radix UI, ShadCN)

### Focus Management Approaches

**1. Automatic Focus Management (Common)**
- Focus moves to popover content on open
- Returns to trigger on close
- Standard behavior in 80% of frameworks

**2. Focus Trap (Advanced)**
- Traps tab navigation within popover
- Requires explicit prop: `focus`, `trapFocus`, `closeOnBlur={false}`
- Used for forms and critical interactions
- Supported: Chakra UI, Headless UI, HeroUI, Mantine, Radix UI

**3. Initial Focus Target**
- `initialFocusRef` (Chakra UI), `autoFocus` (HeroUI)
- Targets specific element on open (e.g., first input)
- Essential for form-based popovers

## Unique Features by Framework

### Ant Design
- **Render function content**: `content={() => ReactNode}` for dynamic generation
- **Shared API**: Tooltip, Popover, Popconfirm share same base props
- **Arrow customization**: `arrowPointAtCenter` boolean for centering

### Chakra UI
- **PopoverAnchor**: Separate trigger from positioning reference
- **useDisclosure hook**: Standardized state management pattern
- **Multi-part theming**: Anatomy-based styling system
- **Version duality**: v2 flat API vs v3 composition pattern

### Headless UI
- **PopoverGroup**: Manage multiple related popovers (tab navigation)
- **useClose hook**: Close from deeply nested components
- **Data attributes**: `data-open`, `data-closed` for CSS animations
- **Built-in anchoring**: v2 includes positioning (no external library needed)

### HeroUI
- **Trigger scaling**: `triggerScaleOnOpen` for visual feedback animation
- **Backdrop variants**: transparent, opaque, blur
- **Title props pattern**: Function-as-children for accessibility
- **React Aria foundation**: Built on React Aria primitives

### Mantine
- **Floating components family**: Unified API across Popover, Tooltip, Menu
- **Transition props**: `transition`, `transitionDuration` for animations
- **Width matching**: `width="target"` prop matches trigger
- **Floating UI direct**: Exposes full Floating UI middleware

### Nuxt UI
- **Dual mode**: Single component handles click and hover (auto switches to HoverCard)
- **Virtual positioning**: `reference` prop for cursor-following and custom anchors
- **Hover delays**: `open-delay` and `close-delay` for hover mode
- **CSS custom properties**: `--reka-popper-anchor-width` for responsive sizing

### PrimeReact
- **Template system**: `header`, `footer` templates for structured content
- **Event-rich**: `onShow`, `onHide`, `appendTo` for DOM control
- **PrimeNG heritage**: Shares patterns across Angular/React/Vue versions

### Radix UI
- **Dual API**: High-level Themes vs low-level Primitives
- **Inset component**: Special component for flush media alignment
- **Modal/non-modal**: Explicit `modal` prop for behavior switching
- **CSS variables**: `--radix-popover-content-transform-origin` for animations
- **Extensive callbacks**: `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, etc.

### Semantic UI Classic
- **Inline positioning**: `inline` prop renders next to trigger
- **Position modes**: `position`, `offset` for manual control
- **Event-heavy API**: `onCreate`, `onRemove`, `onShow`, `onHide`, `onVisible`, `onHidden`
- **Variation props**: `basic`, `flowing`, `inverted` style variants

### ShadCN
- **Copy-paste philosophy**: Not installed, copied into project
- **Radix + Tailwind**: Thin wrapper over Radix Primitives
- **Customization-first**: Designed to be modified directly
- **Portal default**: Always uses portal rendering

## Pattern Correlations

### Composition Pattern → Feature Richness
Frameworks using compound components (Root/Trigger/Content) tend to have:
- More granular control over positioning
- Better TypeScript integration
- More flexible content composition
- Higher developer experience satisfaction

### Headless → Customization Depth
Unstyled/headless frameworks (Headless UI, Radix UI, ShadCN) provide:
- Maximum styling flexibility
- Data attributes for state-based styling
- No style conflicts with design systems
- But require more setup for basic use cases

### Built-in Positioning → Documentation Quality
Frameworks with integrated positioning (not requiring external Floating UI setup):
- Have better documentation of positioning features
- Show more real-world examples
- Provide clearer mental models
- Examples: Headless UI v2, Nuxt UI

### React Aria Foundation → Accessibility Excellence
Frameworks built on React Aria (HeroUI, Radix UI via shared concepts):
- Strong ARIA attribute management
- Better keyboard navigation
- More robust focus management
- Clear accessibility documentation

## Support Level Classifications

### Level 1: Universal Patterns (100% adoption)
**Recommended for Semantic UI Next**

1. **Basic trigger modes**: Click, manual/controlled
2. **12-placement system**: top/right/bottom/left with start/end/center
3. **Auto-flip positioning**: Collision detection and viewport awareness
4. **Controlled/uncontrolled state**: `open` + `defaultOpen` patterns
5. **Basic dismiss behavior**: Click outside, Escape key, close button
6. **Rich content support**: Text, HTML, forms, images, interactive elements
7. **Portal rendering**: Render to body or custom container
8. **Animation support**: Enter/exit transitions
9. **Event callbacks**: `onOpenChange`, `onClose`
10. **Arrow/pointer**: Optional visual indicator

### Level 2: Common Patterns (64-82% adoption)
**Strongly consider for Semantic UI Next**

1. **Hover trigger mode**: Alternative activation method
2. **Focus trigger mode**: Focus-based opening
3. **Focus trap**: Contain tab navigation within popover
4. **Return focus**: Restore focus to trigger on close
5. **Lazy mounting**: Defer rendering until first open
6. **Initial focus target**: Auto-focus specific element
7. **Header/body/footer**: Structured content sections
8. **Collision boundaries**: Custom viewport boundaries
9. **Render props**: Internal state access via function children
10. **Offset controls**: Fine-grained spacing adjustment

### Level 3: Moderate Patterns (36-55% adoption)
**Consider for specialized use cases**

1. **Modal mode**: Blocking behavior with backdrop
2. **Backdrop overlay**: Visual page dimming
3. **Nested popovers**: Popovers within popovers
4. **Virtual positioning**: Custom reference elements (cursor-following)
5. **Match trigger width**: Content matches trigger dimensions
6. **Scroll behavior control**: Close on scroll, block scroll
7. **Update positioning strategy**: Dynamic repositioning

### Level 4: Occasional Patterns (18-27% adoption)
**Optional advanced features**

1. **Multiple triggers**: Multiple elements open same popover
2. **Keyboard shortcuts**: Global shortcuts for toggle
3. **Grouped popovers**: Coordinated multi-popover behavior
4. **Context menu trigger**: Right-click activation
5. **Custom animations**: Framework-specific animation control
6. **Anchor separation**: Trigger separate from position reference

### Level 5: Rare Patterns (9% adoption)
**Framework-specific innovations**

1. **Trigger scaling**: Visual feedback on trigger (HeroUI)
2. **Template system**: Named templates for structure (PrimeReact)
3. **Inline mode**: Non-floating positioning (Semantic UI Classic)
4. **Inset components**: Special flush media alignment (Radix UI)
5. **Dual mode auto-switch**: Single component handles click/hover (Nuxt UI)

## API Design Recommendations

### For Semantic UI Next (Web Components)

**1. Component Structure**
```html
<!-- Recommended: Compound component pattern -->
<sui-popover>
  <button slot="trigger">Open</button>
  <div slot="content">
    <!-- Rich content here -->
  </div>
</sui-popover>
```

**Rationale**: Modern standard, clear separation, aligns with web component best practices

**2. State Management**
```html
<!-- Controlled -->
<sui-popover open="{{isOpen}}" @open-change="handleChange">

<!-- Uncontrolled -->
<sui-popover default-open>
```

**Rationale**: Supports both React patterns via custom events and properties

**3. Positioning API**
```html
<!-- Option A: Flat props (simpler) -->
<sui-popover placement="top-start" offset="8">

<!-- Option B: Nested config (more powerful) -->
<sui-popover position='{"side":"top","align":"start","offset":8}'>
```

**Recommendation**: Option A for simplicity, with Option B available via JSON property for advanced cases

**4. Trigger Modes**
```html
<!-- Level 1: Always include -->
<sui-popover trigger="click">  <!-- default -->
<sui-popover trigger="manual"> <!-- controlled -->

<!-- Level 2: Strongly consider -->
<sui-popover trigger="hover" open-delay="500" close-delay="300">
<sui-popover trigger="focus">

<!-- Level 4: Optional -->
<sui-popover trigger="context-menu">
```

**5. Essential Props**
```typescript
interface PopoverProps {
  // State (Level 1)
  open?: boolean;
  defaultOpen?: boolean;
  // Positioning (Level 1)
  placement?: 'top' | 'top-start' | 'top-end' | ... ; // 12 options
  offset?: number;
  autoFlip?: boolean; // default: true
  // Trigger (Level 1-2)
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  // Behavior (Level 1)
  closeOnClickOutside?: boolean; // default: true
  closeOnEscape?: boolean; // default: true
  // Behavior (Level 2)
  trapFocus?: boolean;
  returnFocus?: boolean; // default: true
  lazyMount?: boolean;
  // Visual (Level 1)
  showArrow?: boolean;
  // Advanced (Level 2-3)
  modal?: boolean;
  backdrop?: boolean | 'blur' | 'opaque';
}
```

**6. Event API**
```typescript
interface PopoverEvents {
  // Level 1: Essential
  'open-change': CustomEvent<{ open: boolean }>;
  'close': CustomEvent<void>;

  // Level 2: Useful
  'before-open': CustomEvent<void>;
  'after-open': CustomEvent<void>;
  'before-close': CustomEvent<void>;
  'after-close': CustomEvent<void>;

  // Level 3: Advanced
  'click-outside': CustomEvent<MouseEvent>;
  'escape-key': CustomEvent<KeyboardEvent>;
}
```

**7. Slots**
```html
<sui-popover>
  <!-- Default slot or named trigger slot -->
  <button slot="trigger">Trigger</button>

  <!-- Content slot (required) -->
  <div slot="content">
    <h3 slot="header">Title</h3>  <!-- Optional -->
    <p>Main content</p>
    <div slot="footer">Actions</div>  <!-- Optional -->
  </div>

  <!-- Optional arrow customization -->
  <svg slot="arrow">...</svg>
</sui-popover>
```

**8. CSS Parts for Styling**
```css
sui-popover::part(trigger) { }
sui-popover::part(content) { }
sui-popover::part(arrow) { }
sui-popover::part(backdrop) { }
sui-popover::part(header) { }
sui-popover::part(body) { }
sui-popover::part(footer) { }
```

**9. Data Attributes for State-Based Styling**
```css
sui-popover[data-state="open"] { }
sui-popover[data-state="closed"] { }
sui-popover[data-placement="top"] { }
sui-popover[data-trigger="hover"] { }
```

**10. Progressive Enhancement**
```html
<!-- Minimum viable -->
<sui-popover>
  <button slot="trigger">Open</button>
  <div slot="content">Content</div>
</sui-popover>

<!-- Fully featured -->
<sui-popover
  trigger="hover"
  placement="top-start"
  offset="12"
  show-arrow
  trap-focus
  lazy-mount
  @open-change="handleChange"
>
  <button slot="trigger">Open</button>
  <div slot="content">
    <h3 slot="header">Title</h3>
    <p>Content</p>
    <button slot="footer" @click="close()">Close</button>
  </div>
</sui-popover>
```

## Implementation Priorities

### Phase 1: Core Functionality (MVP)
1. Compound component structure (Root, Trigger, Content)
2. Click trigger mode
3. Controlled and uncontrolled state
4. 12-placement positioning system
5. Auto-flip collision detection
6. Click outside and Escape key dismissal
7. Basic animations (fade in/out)
8. Portal rendering
9. Rich content support
10. Essential event callbacks

### Phase 2: Enhanced UX
1. Hover trigger mode with delays
2. Focus trigger mode
3. Arrow/pointer element
4. Focus trap and return focus
5. Lazy mounting
6. Initial focus target
7. Header/body/footer structure
8. Offset and gap controls
9. Collision boundaries
10. More transition options

### Phase 3: Advanced Features
1. Modal mode with backdrop
2. Virtual positioning support
3. Match trigger width
4. Nested popover support
5. Scroll behavior controls
6. Keyboard shortcuts
7. Multiple triggers
8. Custom positioning strategies
9. Advanced animation control
10. PopoverAnchor separation

## Testing & Accessibility Checklist

### ARIA & Semantics
- [ ] `role="dialog"` or `role="menu"` on content (context-dependent)
- [ ] `aria-expanded` on trigger reflects state
- [ ] `aria-controls` links trigger to content ID
- [ ] `aria-labelledby` or `aria-label` on content
- [ ] `aria-describedby` for additional context
- [ ] `aria-haspopup` on trigger indicates popup presence

### Keyboard Navigation
- [ ] Enter/Space opens popover from trigger
- [ ] Escape closes popover
- [ ] Tab navigates within content (or exits if not trapped)
- [ ] Focus returns to trigger on close
- [ ] Focus trap works when enabled
- [ ] Keyboard shortcuts don't conflict with page shortcuts

### Mouse/Pointer Interaction
- [ ] Click trigger toggles open/close
- [ ] Hover trigger respects delays
- [ ] Click outside closes (when enabled)
- [ ] Clicking content doesn't close popover
- [ ] Clicking close button closes popover
- [ ] Mouse wheel scroll behavior (close or ignore)

### Positioning & Collision
- [ ] All 12 placements render correctly
- [ ] Auto-flip prevents viewport overflow
- [ ] Collision boundaries respected
- [ ] Arrow points to trigger correctly
- [ ] Offset and gap values applied
- [ ] Portal rendering escapes overflow:hidden
- [ ] Matches trigger width when configured

### State Management
- [ ] Controlled state updates externally
- [ ] Uncontrolled state manages internally
- [ ] Default open works on mount
- [ ] Multiple popovers don't interfere
- [ ] Nested popovers work (if supported)
- [ ] Event callbacks fire at correct times

### Content & Composition
- [ ] Text content displays correctly
- [ ] HTML content renders properly
- [ ] Forms and inputs work within popover
- [ ] Images and media display
- [ ] Buttons and links function
- [ ] Slots/children composition works
- [ ] Header/footer structure (if supported)

### Performance
- [ ] Lazy mounting defers render
- [ ] No memory leaks on mount/unmount
- [ ] Smooth animations (60fps)
- [ ] Portal cleanup on unmount
- [ ] Event listeners cleaned up
- [ ] Large content doesn't cause jank

### Responsive & Mobile
- [ ] Touch interactions work (tap to open)
- [ ] Mobile viewport collision detection
- [ ] Backdrop works on mobile
- [ ] Focus management on mobile browsers
- [ ] Orientation changes handled
- [ ] Small screens don't clip content

## Framework Comparison Matrix

| Feature | Ant Design | Chakra UI | Headless UI | HeroUI | Mantine | Nuxt UI | PrimeReact | Radix UI | Semantic UI | ShadCN |
|---------|:----------:|:---------:|:-----------:|:------:|:-------:|:-------:|:----------:|:--------:|:-----------:|:------:|
| **Architecture** |
| Compound components | ❌ | ✅ v2/v3 | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Prop-based content | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Headless/unstyled | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Triggers** |
| Click | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hover | ✅ | ✅ v2 | ❌ | ❌ | ✅ | ✅ | ⚠️ | ❌ | ✅ | ✅ |
| Focus | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Manual/controlled | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Context menu | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Positioning** |
| 12 placements | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto-flip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Collision boundary | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Virtual positioning | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Match trigger width | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Arrow/pointer | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Behavior** |
| Focus trap | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Return focus | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Lazy mounting | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Modal mode | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Backdrop | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **State** |
| Controlled | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Uncontrolled | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Render props | ❌ | ✅ v2 | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Advanced** |
| Nested popovers | ⚠️ | ✅ | ✅ | ❌ | ⚠️ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Popover groups | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Anchor separation | ❌ | ✅ v2 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| useClose hook | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend**: ✅ Supported | ❌ Not supported | ⚠️ Partial/limited support

## Sophisticated Design Patterns

### Headless UI - PopoverGroup Multi-Popover Coordination

**What it does**: The `PopoverGroup` component manages multiple related popovers (typically in navigation bars) with sophisticated keyboard navigation. When tabbing between `PopoverButton` elements within a group, the popovers remain open rather than closing, enabling seamless keyboard navigation across a menu structure without requiring multiple open/close interactions.

```jsx
<PopoverGroup className="flex gap-4">
  <Popover>
    <PopoverButton>Solutions</PopoverButton>
    <PopoverPanel anchor="bottom">{/* content */}</PopoverPanel>
  </Popover>
  <Popover>
    <PopoverButton>Products</PopoverButton>
    <PopoverPanel anchor="bottom">{/* content */}</PopoverPanel>
  </Popover>
  {/* Tabbing between buttons keeps panels open */}
</PopoverGroup>
```

**Why it's sophisticated**: This solves a real UX problem that most popover implementations ignore—how to enable efficient keyboard navigation across multiple related popovers. Rather than closing on tab (standard behavior), the group maintains context, allowing users to arrow through related content without losing visual connection. This is fundamentally different from individual popover behavior and requires component-aware coordination.

**Evidence of design maturity**:
- Demonstrates understanding of actual navigation workflows where users expect to browse multiple related options sequentially
- Solves tab management complexity at the component level rather than forcing consumers to implement custom logic
- The feature is completely useless in other components (buttons, menus, dropdowns don't have this coordination need)

### Nuxt UI - Dual Mode Architecture (Click/Hover Auto-Switch)

**What it does**: A single `UPopover` component intelligently switches between click mode and hover mode via a `mode` prop. In hover mode, the component automatically delegates to Reka UI's HoverCard component with configurable delays (`open-delay`, `close-delay`). This eliminates the need to maintain two separate components while providing specialized behavior for each interaction pattern.

```vue
<!-- Click mode (default) -->
<UPopover>
  <UButton label="Open" />
  <template #content>Content</template>
</UPopover>

<!-- Hover mode with timing -->
<UPopover mode="hover" :open-delay="500" :close-delay="300">
  <UButton label="Hover me" />
  <template #content>Content</template>
</UPopover>
```

**Why it's sophisticated**: Most frameworks maintain separate Popover and HoverCard (or Tooltip) components because they have fundamentally different interaction semantics and underlying implementations. Nuxt UI's approach of unifying them under a mode flag requires careful architectural thinking to abstract the differences while maintaining both components' specialized behaviors. This is a component-specific design choice that reflects sophisticated understanding of the interaction patterns—hover and click have different timing, dismiss behaviors, and visual feedback requirements.

**Evidence of design maturity**:
- Simplifies the mental model for consumers (single component vs learning multiple related components)
- Maintains full fidelity of each mode's interaction semantics despite abstraction
- The delegation to HoverCard preserves specialized hover-card behaviors (delays, hover state tracking) that wouldn't exist in click-only popovers
- Pattern is completely component-specific: buttons don't need mode switching, menus don't benefit from automatic hover delegation

### Chakra UI - PopoverAnchor Separation Pattern

**What it does**: The `PopoverAnchor` component decouples the element that triggers position calculation (anchor) from the element that opens/closes the popover (trigger). This enables sophisticated edit-in-place UI patterns where a form or content input field anchors the popover while a separate button controls open/close state.

```jsx
<Popover isOpen={isEditing} onOpen={setIsEditing.on} closeOnBlur={false}>
  <HStack>
    <PopoverAnchor>
      <Input value={color} isDisabled={!isEditing} />
    </PopoverAnchor>
    <PopoverTrigger>
      <Button>{isEditing ? 'Save' : 'Edit'}</Button>
    </PopoverTrigger>
  </HStack>
  <PopoverContent>
    {/* Color picker positioned next to Input, triggered by Button */}
  </PopoverContent>
</Popover>
```

**Why it's sophisticated**: This solves a genuinely hard UX problem in floating UI components—the anchor element and trigger element often need to be visually separate. Most implementations conflate these, forcing consumers into awkward patterns where the trigger must contain or be adjacent to the anchor. Chakra's solution requires understanding the distinct responsibilities of positioning vs interaction, which is not obvious and not needed in simpler components.

**Evidence of design maturity**:
- Enables real-world UI patterns (inline editing, edit-in-place forms) that are nearly impossible with other architectures
- Requires sophisticated positioning calculations to decouple trigger from anchor location
- The pattern demonstrates restraint—it's an optional feature, not forced on all users; most popovers don't need it
- Completely component-specific: only popovers have this problem; dialogs and menus don't benefit from anchor separation

## Conclusion

The Popup/Popover component has reached consensus on core patterns across the industry:

**Universal Standards** (implement first):
1. Compound component architecture with Root/Trigger/Content
2. Click and controlled trigger modes
3. 12-placement positioning with auto-flip
4. Click outside and Escape dismissal
5. Controlled/uncontrolled state management
6. Rich content support via composition
7. Portal rendering for proper layering
8. Basic animations and transitions

**Strong Conventions** (implement second):
1. Hover and focus trigger modes
2. Focus trap and return focus behaviors
3. Lazy mounting for performance
4. Arrow/pointer indicators
5. Collision boundaries and offset controls
6. Header/body/footer content structure
7. Render props for internal state access

**Emerging Patterns** (consider for differentiation):
1. Modal mode with backdrop overlay
2. Virtual positioning for creative use cases
3. Grouped popover coordination (Headless UI's innovation)
4. Anchor separation pattern (Chakra/Radix innovation)
5. Dual-mode auto-switching (Nuxt UI innovation)

For **Semantic UI Next** as a web component library, prioritize Level 1 and Level 2 patterns while maintaining simplicity through progressive enhancement. The component should work with minimal configuration but expose advanced features through optional props and slots.

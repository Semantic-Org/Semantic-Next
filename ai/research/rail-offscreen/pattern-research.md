# Component Pattern Research: Drawer/Sidebar/Slideover (Rail/Offscreen)

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 8
- Date: 2025-11-05
- Unique patterns identified: 65+
- Research coverage: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI Classic, Vuetify

## Component Definition Consensus

Drawer/Sidebar/Slideover components solve the fundamental problem of **providing off-canvas content access** without consuming permanent screen space. They provide:

- **Secondary navigation** without cluttering primary views
- **Contextual actions** for filtering, settings, or details
- **Space efficiency** on mobile and desktop
- **Focus management** for accessibility
- **Overlay or push** behavior for content
- **Smooth animations** for entry/exit
- **Keyboard navigation** for dismissal and interaction

**Mental Models:**
- **Navigation Drawer** (MUI, Vuetify): Primary navigation panel with app integration
- **Offscreen Panel** (Ant Design, Chakra UI, Mantine): Temporary overlay for forms/content
- **Sidebar** (Semantic UI): Directional slide-in panel with multiple animation types
- **Slideover** (Nuxt UI): Vue-based slide-in dialog
- **Sheet** (HeroUI): React Aria-based drawer with composition

**Universal Characteristics:**
- Slides in from screen edge
- Overlay or backdrop
- Dismissible (backdrop click, ESC key, close button)
- Focus trapping
- Controlled/uncontrolled state
- Configurable placement (left/right/top/bottom)
- Smooth transitions

## Terminology Variations

### Component Names
- **Drawer**: Ant Design, Chakra UI, HeroUI, Mantine, MUI
- **Slideover**: Nuxt UI
- **Sidebar**: Semantic UI Classic
- **Navigation Drawer**: Vuetify (v-navigation-drawer)
- **Sheet/Offcanvas**: Alternative terms in some frameworks

### Placement Terms
- **anchor** (MUI): left/right/top/bottom
- **placement** (Ant Design, Chakra UI, HeroUI, Mantine): left/right/top/bottom
- **side** (Nuxt UI): right/left/top/bottom
- **location** (Vuetify): left/right/top/bottom/start/end
- **direction** (Semantic UI): left/right/top/bottom

### Display Mode Terms
- **temporary** (MUI, Vuetify): Overlay mode with backdrop
- **permanent** (MUI, Vuetify): Always visible
- **persistent** (MUI, Vuetify): Visible without backdrop
- **rail** (Vuetify): Collapsed icon-only mode
- **push/overlay** (Semantic UI): Animation type

## Pattern Inventory

### Placement Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Left placement | Slide from left | 8/8 (100%) | Level 1 | All |
| Right placement | Slide from right | 8/8 (100%) | Level 1 | All |
| Top placement | Slide from top | 7/8 (88%) | Level 2 | All except Semantic UI (limited) |
| Bottom placement | Slide from bottom | 7/8 (88%) | Level 2 | All except Semantic UI (limited) |
| Start/End (RTL) | Logical positioning | 2/8 (25%) | Level 4 | Vuetify, Semantic UI |
| Multi-directional | Multiple drawers from different sides | 8/8 (100%) | Level 1 | All |

### Size Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Fixed width | Pixel width | 8/8 (100%) | Level 1 | All |
| Percentage width | Relative width | 8/8 (100%) | Level 1 | All |
| Preset sizes | Named sizes (sm/md/lg) | 4/8 (50%) | Level 2 | HeroUI, Mantine, Nuxt UI, custom |
| Full width | 100% width | 6/8 (75%) | Level 2 | Most frameworks |
| Responsive sizing | Size per breakpoint | 5/8 (63%) | Level 2 | Modern frameworks |
| Min/max constraints | Width limits | 7/8 (88%) | Level 1 | CSS-based |
| Height control | For top/bottom | 8/8 (100%) | Level 1 | All |

### Display Mode Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Temporary/overlay | Modal overlay | 8/8 (100%) | Level 1 | All (default) |
| Permanent | Always visible | 2/8 (25%) | Level 4 | MUI, Vuetify |
| Persistent | No backdrop | 2/8 (25%) | Level 4 | MUI, Vuetify |
| Rail/mini | Collapsed icon mode | 1/8 (13%) | Level 5 | Vuetify |
| Mobile-aware | Different on mobile | 3/8 (38%) | Level 3 | MUI, Vuetify, Semantic UI |

### Content Structure Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Header section | Title area | 8/8 (100%) | Level 1 | All |
| Body section | Main content | 8/8 (100%) | Level 1 | All |
| Footer section | Action buttons | 8/8 (100%) | Level 1 | All |
| Close button | X to close | 8/8 (100%) | Level 1 | All |
| Scrollable content | Overflow scroll | 8/8 (100%) | Level 1 | All |
| Nested content | Complex layouts | 8/8 (100%) | Level 1 | All |
| Form integration | Forms in drawer | 8/8 (100%) | Level 1 | All |
| Navigation lists | Menu items | 7/8 (88%) | Level 1 | All except Ant Design |

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Controlled state | External state control | 8/8 (100%) | Level 1 | All |
| Uncontrolled state | Internal state | 3/8 (38%) | Level 3 | Chakra, HeroUI, custom |
| useDisclosure hook | State helper | 4/8 (50%) | Level 2 | Chakra, HeroUI, Mantine, Nuxt |
| Multiple drawers | Independent states | 8/8 (100%) | Level 1 | All |
| Nested drawers | Drawer in drawer | 5/8 (63%) | Level 2 | Ant, Chakra, HeroUI, Mantine, Semantic |
| Loading state | Async content | 2/8 (25%) | Level 4 | Ant Design, custom |

### Animation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Slide animation | Standard slide | 8/8 (100%) | Level 1 | All |
| Push content | Push main content | 2/8 (25%) | Level 4 | Ant Design, Semantic UI |
| Overlay | Overlay content | 8/8 (100%) | Level 1 | All |
| Scale down | Shrink content | 1/8 (13%) | Level 5 | Semantic UI |
| Uncover | Reveal beneath | 1/8 (13%) | Level 5 | Semantic UI |
| Slide along | Move with content | 1/8 (13%) | Level 5 | Semantic UI |
| Slide out | Push content out | 1/8 (13%) | Level 5 | Semantic UI |
| Custom transitions | Configurable | 5/8 (63%) | Level 2 | Modern frameworks |
| Transition duration | Speed control | 6/8 (75%) | Level 2 | Most frameworks |
| Disable animation | No animation | 5/8 (63%) | Level 2 | Modern frameworks |

### Backdrop/Overlay Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Backdrop overlay | Semi-transparent | 8/8 (100%) | Level 1 | All |
| Backdrop opacity | Opacity control | 7/8 (88%) | Level 1 | Most frameworks |
| Backdrop color | Custom color | 6/8 (75%) | Level 2 | Modern frameworks |
| Close on backdrop | Click to dismiss | 8/8 (100%) | Level 1 | All |
| Disable backdrop close | Prevent dismiss | 8/8 (100%) | Level 1 | All |
| No backdrop | Persistent mode | 3/8 (38%) | Level 3 | MUI, Vuetify, Semantic |
| Backdrop blur | Blur effect | 2/8 (25%) | Level 4 | CSS-based, Nuxt |
| Dim page | Darken content | 2/8 (25%) | Level 4 | Semantic UI, custom |

### Dismissal Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Close button | X button | 8/8 (100%) | Level 1 | All |
| ESC key | Keyboard dismiss | 8/8 (100%) | Level 1 | All |
| Backdrop click | Click outside | 8/8 (100%) | Level 1 | All |
| Disable ESC | Prevent ESC close | 7/8 (88%) | Level 1 | Most frameworks |
| Disable backdrop click | Prevent click dismiss | 8/8 (100%) | Level 1 | All |
| Custom close trigger | Manual close | 8/8 (100%) | Level 1 | All |
| Auto-close | Timed close | 1/8 (13%) | Level 5 | Custom implementations |
| Close on navigation | Router integration | 3/8 (38%) | Level 3 | SPA frameworks |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Focus trap | Keep focus inside | 8/8 (100%) | Level 1 | All |
| Return focus | Restore on close | 8/8 (100%) | Level 1 | All |
| aria-label | Accessible name | 8/8 (100%) | Level 1 | All |
| aria-describedby | Description | 5/8 (63%) | Level 2 | Modern frameworks |
| role="dialog" | Semantic role | 7/8 (88%) | Level 1 | Most frameworks |
| aria-modal | Modal state | 6/8 (75%) | Level 2 | Modern frameworks |
| Initial focus | Focus control | 7/8 (88%) | Level 1 | Most frameworks |
| Keyboard navigation | Tab/Shift+Tab | 8/8 (100%) | Level 1 | All |
| Screen reader support | Announcements | 8/8 (100%) | Level 1 | All |

### Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Form integration | Forms in drawer | 8/8 (100%) | Level 1 | All |
| Navigation menu | Nav items | 7/8 (88%) | Level 1 | Most frameworks |
| Filter panel | Filters/search | 6/8 (75%) | Level 2 | Common pattern |
| Settings panel | Configuration | 7/8 (88%) | Level 1 | Common pattern |
| Detail view | Item details | 6/8 (75%) | Level 2 | Common pattern |
| App bar integration | With header | 3/8 (38%) | Level 3 | MUI, Vuetify, Semantic |
| Router integration | Navigation sync | 3/8 (38%) | Level 3 | Vue/React Router |
| Portal mounting | Portal support | 7/8 (88%) | Level 1 | Modern frameworks |

### Mobile-Specific Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Swipeable | Touch gestures | 2/8 (25%) | Level 4 | MUI (SwipeableDrawer), custom |
| Full-width mobile | 100% on mobile | 6/8 (75%) | Level 2 | Common pattern |
| Bottom sheet | Mobile drawer | 3/8 (38%) | Level 3 | Bottom placement pattern |
| Touch-optimized | Large tap targets | 6/8 (75%) | Level 2 | Modern frameworks |
| Responsive behavior | Mode per screen | 4/8 (50%) | Level 2 | MUI, Vuetify, modern |

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Nested drawers | Multiple levels | 5/8 (63%) | Level 2 | Ant, Chakra, HeroUI, Mantine, Semantic |
| Multiple simultaneous | Multiple open | 3/8 (38%) | Level 3 | Semantic UI, custom |
| Exclusive mode | One at a time | 2/8 (25%) | Level 4 | Semantic UI, custom |
| Push distance control | Adjust push | 1/8 (13%) | Level 5 | Ant Design |
| Custom container | Portal target | 6/8 (75%) | Level 2 | Modern frameworks |
| Z-index management | Stacking control | 7/8 (88%) | Level 1 | Most frameworks |
| Destroy on close | Unmount content | 5/8 (63%) | Level 2 | Ant, Chakra, Mantine, MUI, Vuetify |
| Keep mounted | Persist DOM | 3/8 (38%) | Level 3 | Some frameworks |
| Lazy rendering | Load on open | 4/8 (50%) | Level 3 | Modern frameworks |

## Notable Patterns

### Universal Patterns (100%)
- Left and right placement
- Fixed and percentage width
- Temporary/overlay mode
- Header, body, footer sections
- Close button
- Scrollable content
- Nested content
- Form integration
- Controlled state
- Multiple independent drawers
- Slide animation
- Overlay mode
- Backdrop overlay
- Close on backdrop click
- Disable backdrop/ESC close
- Custom close trigger
- All accessibility patterns (focus trap, return focus, aria-label, keyboard nav, screen reader)

### Highly Adopted (75%+)
- Top and bottom placement (88%)
- Min/max width constraints (88%)
- Navigation lists (88%)
- Backdrop opacity (88%)
- Disable ESC (88%)
- role="dialog" (88%)
- Initial focus (88%)
- Navigation menu integration (88%)
- Settings panel pattern (88%)
- Z-index management (88%)
- Full width option (75%)
- Backdrop color (75%)
- aria-modal (75%)
- Filter panel (75%)
- Detail view (75%)
- Transition duration (75%)
- Portal mounting (75%)
- Full-width mobile (75%)
- Touch-optimized (75%)
- Custom container (75%)

### Emerging Patterns (60-74%)
- Responsive sizing (63%)
- Nested drawers (63%)
- Custom transitions (63%)
- Disable animation (63%)
- aria-describedby (63%)
- Destroy on close (63%)

## Sophisticated Design Patterns

### Ant Design - Push Distance Control for Nested Content

**What it does**: The `push` prop allows configurable control over how far page content shifts when a drawer opens. Instead of fixed push behavior, developers can specify exact distances (e.g., `push={{ distance: 180 }}`), enabling fine-tuned layout compensation for nested drawers and stacked overlays without CSS workarounds.

**Why it's sophisticated**: This solves the problem of overlapping content in drawer-heavy applications. When multiple drawers stack, each can independently control how much it pushes underlying content, preventing layout thrashing and visual conflicts. Most frameworks either push a fixed amount or don't push at all—Ant Design's parameterized approach handles complex overlay scenarios elegantly.

**Evidence of design maturity**:
- **Edge case handling**: Supports both boolean (`true`/`false`) and configuration object syntax, allowing toggle between overlay and push modes without prop restructuring
- **Real-world usage**: Essential for enterprise dashboards with filter panels, detail sidebars, and nested workflows where content repositioning must be predictable across deep component hierarchies
- **Design restraint**: Defaults to `{ distance: 180 }` (Material Design standard), avoiding unnecessary API surface while allowing override for specialized layouts

### Mantine - Drawer.Stack for Multi-Drawer Coordination

**What it does**: Mantine's `<Drawer.Stack>` wrapper component automatically manages z-index layering, focus trapping, and keyboard behavior across multiple open drawers. The innermost drawer closes first on Escape key press, and focus management coordinates across all nested instances without manual wiring.

**Why it's sophisticated**: Managing multiple concurrent drawers requires coordinated state across several concerns: stacking order, focus containment, escape key routing, and overlay layering. Drawer.Stack encapsulates this complexity into a composable container, eliminating the need for manual z-index calculations, focus managers, and event delegation logic that developers would otherwise hardcode.

**Evidence of design maturity**:
- **Edge case handling**: Properly handles rapid open/close cycles, prevents focus escapes through the stack, and routes Escape keystrokes to the correct drawer based on visual depth
- **Real-world usage**: Common in applications supporting parallel workflows (e.g., master-detail with quick-actions drawer, or multi-step forms with sub-forms in drawers)
- **Design restraint**: Drawer.Stack doesn't force specific layouts or composition patterns—it's a transparent orchestrator that works with any drawer content, children, or nesting depth

### Vuetify - Rail Mode with Expand-on-Hover

**What it does**: The `rail` prop transforms a drawer into a compact icon-only sidebar, and the `expand-on-hover` prop makes it expand to full width on mouse hover. Combined, this creates a collapsible persistent navigation that saves space while remaining instantly accessible—icons stay visible, text labels appear only on interaction.

**Why it's sophisticated**: This pattern solves a UX tension in navigation design: how to maximize content space while keeping navigation always accessible. Rather than hiding the drawer entirely (modal) or consuming permanent space (permanent), rail mode provides a middle ground. The hover expansion requires careful event handling to prevent jitter from rapid hover state changes and coordinate text reveal timing with width animations.

**Evidence of design maturity**:
- **Edge case handling**: Manages hover state across nested content without false triggers, coordinates CSS transitions with JavaScript state to prevent flashing or layout shifts during expand/collapse cycles
- **Real-world usage**: Ubiquitous in modern dashboards and content-heavy applications (Slack, Discord, VS Code all use similar patterns). Required for responsive designs that adapt between mobile (hidden), tablet (rail mode), and desktop (permanent full-width)
- **Design restraint**: No custom configuration needed—`rail` and `expand-on-hover` work independently or together, allowing progressive enhancement without API bloat. Rail width has sensible defaults but is configurable when needed

## Implementation Notes

### Placement Implementation

**Left/Right Placement**:
```jsx
// Ant Design
<Drawer placement="left" />
<Drawer placement="right" />

// MUI
<Drawer anchor="left" />
<Drawer anchor="right" />

// Chakra UI
<Drawer placement="left" />
<Drawer placement="right" />

// Vuetify
<v-navigation-drawer location="left" />
<v-navigation-drawer location="right" />
```

**Top/Bottom Placement**:
```jsx
// Most frameworks
<Drawer placement="top" />
<Drawer placement="bottom" />

// Semantic UI (limited support)
<div class="ui top sidebar"></div>
<div class="ui bottom sidebar"></div>
```

### Size Implementation

**Fixed Width**:
```jsx
// Ant Design
<Drawer width={378} /> // pixels
<Drawer width="50%" /> // percentage

// MUI
<Drawer sx={{ width: 250 }}>
  <Box sx={{ width: 250 }}>Content</Box>
</Drawer>

// Chakra UI
<DrawerContent maxW="400px">

// HeroUI
<Drawer size="md" /> // preset
```

**Responsive Sizing**:
```jsx
// Chakra UI
<DrawerContent w={{ base: "full", md: "400px" }}>

// MUI
<Drawer
  sx={{
    width: { xs: '100%', sm: 300, md: 400 }
  }}
>
```

### Display Mode Implementation

**Temporary (Overlay)**:
```jsx
// MUI
<Drawer variant="temporary" />

// Vuetify
<v-navigation-drawer temporary />
```

**Permanent**:
```jsx
// MUI
<Drawer variant="permanent" />

// Vuetify
<v-navigation-drawer permanent />
```

**Persistent**:
```jsx
// MUI
<Drawer variant="persistent" />

// Vuetify
<v-navigation-drawer persistent />
```

**Rail Mode** (Vuetify only):
```vue
<v-navigation-drawer rail />
```

### State Management

**Controlled State**:
```jsx
// React pattern
const [open, setOpen] = useState(false);
<Drawer open={open} onClose={() => setOpen(false)} />

// Vue pattern
const open = ref(false);
<v-navigation-drawer v-model="open" />
```

**useDisclosure Hook**:
```jsx
// Chakra UI
const { isOpen, onOpen, onClose } = useDisclosure();
<Drawer isOpen={isOpen} onClose={onClose} />

// Mantine
const [opened, { open, close }] = useDisclosure(false);
<Drawer opened={opened} onClose={close} />
```

### Animation Implementation

**Push vs Overlay**:
```jsx
// Ant Design (push mode)
<Drawer push={{ distance: 180 }} />

// Semantic UI (6 animation types)
$('.ui.sidebar')
  .sidebar({
    transition: 'push' // or 'overlay', 'scale down', 'uncover', 'slide along', 'slide out'
  })
  .sidebar('show');
```

**Transition Control**:
```jsx
// Chakra UI
<Drawer transitionDuration={300} />

// Mantine
<Drawer transitionProps={{ duration: 200, transition: 'fade' }} />
```

### Nested Drawers

**Drawer Stack**:
```jsx
// Mantine
<Drawer.Stack>
  <Drawer opened={opened1} onClose={close1}>First</Drawer>
  <Drawer opened={opened2} onClose={close2}>Second</Drawer>
</Drawer.Stack>

// Ant Design (push behavior)
<Drawer open={open1} push={{ distance: 180 }}>
  First
  <Button onClick={() => setOpen2(true)}>Open Nested</Button>
  <Drawer open={open2}>
    Nested
  </Drawer>
</Drawer>
```

### Accessibility Implementation

**Complete Accessible Drawer**:
```jsx
// Best practice
<Drawer
  open={open}
  onClose={handleClose}
  aria-label="Navigation drawer"
  aria-describedby="drawer-description"
  role="dialog"
  aria-modal="true"
>
  <p id="drawer-description">Main navigation menu</p>
  {/* Content */}
</Drawer>

// Focus management
const initialFocusRef = useRef();
<Drawer
  initialFocusRef={initialFocusRef}
  open={open}
>
  <input ref={initialFocusRef} />
</Drawer>
```

## Framework Comparison

| Framework | Best For | Strengths | Trade-offs |
|-----------|----------|-----------|------------|
| Ant Design | Enterprise apps | Push behavior, nested drawers, loading states | Less mobile-optimized |
| Chakra UI | Customization | Composition, hook integration, accessibility | More verbose setup |
| HeroUI | Modern React | Beautiful design, useDisclosure, accessibility | Smaller ecosystem |
| Mantine | Flexibility | Drawer.Stack, useDisclosure, comprehensive props | Requires hooks knowledge |
| MUI | Material Design | Three variants, SwipeableDrawer, mature ecosystem | Heavier bundle |
| Nuxt UI | Vue/Nuxt | Simple API, slots, overlay composable | Vue-specific |
| Semantic UI | Rich animations | 6 animation types, multi-directional, exclusive mode | jQuery-based, dated |
| Vuetify | Vue Material | Rail mode, responsive modes, Material Design | Vue-specific, learning curve |

## Accessibility

### WCAG Compliance

**Focus Management** (WCAG 2.1, 2.4.3 Focus Order):
```jsx
// ✅ Good - Focus trap
<Drawer
  open={open}
  onClose={handleClose}
  // Focus automatically trapped
>
  <input /> {/* First focusable element gets focus */}
</Drawer>

// ✅ Good - Return focus
// Focus returns to trigger on close (automatic)
```

**Keyboard Access** (WCAG 2.1, 2.1.1 Keyboard):
```jsx
// ✅ All frameworks support
// - ESC to close
// - Tab/Shift+Tab to navigate
// - Enter/Space on buttons
```

**ARIA Attributes** (WCAG 2.1, 4.1.2 Name, Role, Value):
```jsx
// ✅ Good - Complete ARIA
<Drawer
  open={open}
  aria-label="Settings"
  aria-describedby="settings-description"
  role="dialog"
  aria-modal="true"
>
  <p id="settings-description">Application settings</p>
</Drawer>
```

**Screen Reader Support**:
```jsx
// Announce drawer opening
<div role="status" aria-live="polite">
  {open && <span>Settings drawer opened</span>}
</div>
```

## Raw Data References

Individual framework research reports available at:
- `ai/research/rail-offscreen/ant-design/usage-patterns.md`
- `ai/research/rail-offscreen/chakra-ui/usage-patterns.md`
- `ai/research/rail-offscreen/heroui/usage-patterns.md`
- `ai/research/rail-offscreen/mantine/usage-patterns.md`
- `ai/research/rail-offscreen/mui/usage-patterns.md`
- `ai/research/rail-offscreen/nuxt-ui/usage-patterns.md`
- `ai/research/rail-offscreen/semantic-ui-classic/usage-patterns.md`
- `ai/research/rail-offscreen/vuetify/usage-patterns.md`

## Research Methodology

All research conducted on 2025-11-05 through parallel subagent research (8 subagents), direct documentation access, and cross-framework pattern analysis.

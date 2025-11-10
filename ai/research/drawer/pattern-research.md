# Component Pattern Research: Drawer / Offcanvas / Sheet / Sidebar

> Last Modified: 2025-11-06  
> Last Reviewed: 2025-11-10 (by Agent)

## Research Summary
- Frameworks surveyed: 12
- Date: 2025-11-06
- Unique patterns identified: 50+
- Research methodology: Descriptive analysis of official documentation from production UI frameworks

## Component Definition Consensus

Across all 12 frameworks, drawer/sheet/sidebar components are consistently defined as:

**Core Purpose**: A panel that slides in from the edge of the screen to display supplementary content, navigation, or actions without requiring full page navigation. Used to conserve screen space while providing access to additional UI elements.

**Mental Model**: Users conceptualize these as "slide-out panels" or "off-canvas content" - temporary or persistent surfaces that emerge from screen edges to reveal navigation menus, filters, settings, or contextual information.

**Semantic Meaning**: Communicates:
- Hierarchical navigation structure
- Supplementary or secondary content
- Context-specific actions or settings
- Temporary workspace or form entry
- Non-primary UI that can be hidden when not needed

## Terminology Variations

### Component Names
- **Drawer**: 8 frameworks (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Shadcn UI, Vuetify)
- **Sheet**: 1 framework (Shadcn UI - also has Drawer)
- **Sidebar**: 2 frameworks (PrimeReact, Semantic UI)
- **Sidenav**: 1 framework (Angular Material - "Side Navigation")
- **Navigation Drawer**: 1 framework (Vuetify - v-navigation-drawer)

### Positioning Terms
- **left/right**: 11 frameworks (most common)
- **start/end**: 3 frameworks (Angular Material, MUI, Vuetify - for RTL support)
- **top/bottom**: 10 frameworks (less common but widely supported)
- **placement**: 5 frameworks (Ant Design, Chakra UI, HeroUI, Mantine, PrimeReact)
- **anchor**: 1 framework (MUI)
- **position**: 3 frameworks (Angular Material, PrimeReact, Vuetify)

### Behavioral Terms
- **overlay/over**: 7 frameworks (temporary drawer over content)
- **push**: 5 frameworks (pushes content aside)
- **side**: 2 frameworks (Angular Material, MUI - drawer beside content)
- **modal**: 5 frameworks (drawer with backdrop)
- **persistent**: 2 frameworks (MUI, Angular Material - stays open)
- **permanent**: 2 frameworks (MUI, Angular Material - always visible)
- **temporary**: 2 frameworks (MUI, Angular Material - auto-closes)

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Header/Title | Dedicated header section | 11/12 (92%) | Level 1 (Universal) | Native/Composed | All except Semantic UI (manual) |
| Body/Content | Main scrollable content area | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Footer/Actions | Bottom action buttons | 10/12 (83%) | Level 2 (Common) | Native/Composed | All except PrimeReact, Vuetify (manual) |
| Close button | Dismiss drawer control | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (manual) |
| Custom content | Arbitrary content composition | 12/12 (100%) | Level 1 (Universal) | Composed | All frameworks |
| Navigation lists | Menu/navigation items | 10/12 (83%) | Level 2 (Common) | Composed | Most frameworks |
| Forms | Input forms in drawer | 8/12 (67%) | Level 2 (Common) | Composed | Most frameworks |
| Scrollable body | Independent scroll region | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |

### Architectural Patterns

| Pattern | Description | Prevalence | Usage Level | Details | Frameworks |
|---------|-------------|------------|-------------|---------|------------|
| Single component | Self-contained drawer | 5/12 (42%) | Level 3 (Moderate) | Simple API | Ant Design, MUI, Nuxt UI, PrimeReact, Vuetify |
| Multi-part composition | Root + sub-components | 7/12 (58%) | Level 3 (Moderate) | Flexible structure | Angular Material, Chakra UI, HeroUI, Mantine, Shadcn UI, Semantic UI, partial others |
| Portal rendering | Render outside DOM hierarchy | 9/12 (75%) | Level 2 (Common) | Z-index management | Most modern frameworks |
| Container system | Requires parent container | 2/12 (17%) | Level 4 (Occasional) | Layout pattern | Angular Material, Semantic UI |

### Placement Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Left edge | Slide from left | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Right edge | Slide from right | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Top edge | Slide from top | 10/12 (83%) | Level 2 (Common) | Native | All except Angular Material (indirect), Vuetify (bottom focus) |
| Bottom edge | Slide from bottom | 10/12 (83%) | Level 2 (Common) | Native | All except Angular Material (indirect), some limited |
| Four directions | All edge support | 8/12 (67%) | Level 2 (Common) | Native | Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Shadcn UI, Vuetify |

### Display Mode Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Overlay/Over | Drawer over content | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (has overlay transition) |
| Push | Pushes content aside | 6/12 (50%) | Level 3 (Moderate) | Native | Angular Material, Ant Design (nested), MUI, Semantic UI, Vuetify (partial) |
| Persistent | Stays open, no backdrop | 3/12 (25%) | Level 4 (Occasional) | Native | Angular Material, MUI, Vuetify (rail) |
| Permanent | Always visible | 2/12 (17%) | Level 4 (Occasional) | Native | Angular Material, MUI |
| Modal | With backdrop | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (dimmer) |
| Rail/Mini | Collapsed compact state | 2/12 (17%) | Level 4 (Occasional) | Native | Mantine (navbar), Vuetify (rail) |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Open/Close | Basic visibility toggle | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Loading state | Content loading indicator | 2/12 (17%) | Level 4 (Occasional) | Native | Ant Design (v5.18+), others manual |
| Disabled state | Prevent interaction | 1/12 (8%) | Level 5 (Rare) | Native | HeroUI |
| Dismissible control | Can/cannot be closed | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (manual) |
| Nested/Stacked | Multiple drawers open | 4/12 (33%) | Level 4 (Occasional) | Native | Ant Design, Mantine, Shadcn UI, others manual |

### Size Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Predefined sizes | xs/sm/md/lg/xl presets | 6/12 (50%) | Level 3 (Moderate) | Native | Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, Semantic UI |
| Custom width/height | Numeric or percentage | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Full screen | Covers entire viewport | 3/12 (25%) | Level 4 (Occasional) | Native | HeroUI, Nuxt UI, PrimeReact |
| Responsive sizing | Breakpoint-based sizes | 5/12 (42%) | Level 3 (Moderate) | Native | Angular Material, Chakra UI, HeroUI, MUI, Nuxt UI |

### Interaction Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Click outside to close | Backdrop/overlay dismiss | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (manual) |
| ESC key to close | Keyboard dismiss | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Swipe gestures | Touch dismiss | 4/12 (33%) | Level 4 (Occasional) | Native | Angular Material, Nuxt UI, Shadcn UI (Drawer), Vuetify |
| Drag handle | Visual grab indicator | 2/12 (17%) | Level 4 (Occasional) | Native | Nuxt UI, Shadcn UI (Drawer) |
| Snap points | Multi-position stops | 1/12 (8%) | Level 5 (Rare) | Native | Shadcn UI (Drawer via Vaul) |
| Focus trap | Confine keyboard navigation | 10/12 (83%) | Level 2 (Common) | Native | Most frameworks |
| Focus return | Return focus on close | 8/12 (67%) | Level 2 (Common) | Native | Most modern frameworks |
| Scroll blocking | Prevent body scroll | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (manual) |

### Animation Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Slide transition | Default enter/exit | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Fade backdrop | Backdrop animation | 10/12 (83%) | Level 2 (Common) | Native | Most frameworks |
| Custom transitions | Override animations | 4/12 (33%) | Level 4 (Occasional) | Native | Mantine, Nuxt UI, Semantic UI (6 types), Shadcn UI |
| Physics-based | Natural motion | 1/12 (8%) | Level 5 (Rare) | Native | Shadcn UI (Drawer via Vaul) |
| Timing control | Duration/easing config | 5/12 (42%) | Level 3 (Moderate) | Native | Ant Design, Mantine, MUI, Semantic UI, Vuetify |
| Animation callbacks | onEnter/onExit hooks | 6/12 (50%) | Level 3 (Moderate) | Native | Ant Design, Chakra UI, Mantine, MUI, Angular Material |

### Backdrop/Overlay Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Backdrop enabled | Default modal overlay | 11/12 (92%) | Level 1 (Universal) | Native | All except some Semantic UI transitions |
| Backdrop customization | Color/opacity/blur control | 10/12 (83%) | Level 2 (Common) | Native/CSS | Most frameworks |
| Backdrop click close | Dismiss on overlay click | 11/12 (92%) | Level 1 (Universal) | Native | All modern frameworks |
| Backdrop optional | Can disable overlay | 8/12 (67%) | Level 2 (Common) | Native | Ant Design, Angular Material, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, Vuetify |
| Custom backdrop content | Render in overlay | 2/12 (17%) | Level 4 (Occasional) | Native | HeroUI, PrimeReact |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| ARIA dialog role | Semantic role | 10/12 (83%) | Level 2 (Common) | Native | All except Semantic UI, Vuetify (navigation) |
| ARIA labels | Descriptive labels | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Focus management | Initial and return focus | 10/12 (83%) | Level 2 (Common) | Native | All except PrimeReact, Semantic UI (manual) |
| Keyboard navigation | Tab, ESC, Arrow keys | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Screen reader support | Announcements | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Content inert | Disable background | 8/12 (67%) | Level 2 (Common) | Native | Modern frameworks |

## Notable Patterns

### Highly Adopted (Level 1-2: 70%+)

These patterns represent established standards in drawer implementation:

**Universal Patterns (100%)**:
- Body/content area
- Custom content composition
- Left and right edge placement
- Open/close state management
- ESC key to dismiss
- Slide transition animation
- ARIA labels for accessibility
- Keyboard navigation support
- Screen reader compatibility
- Scrollable body content

**Near-Universal Patterns (83-92%)**:
- Header/title section (92%)
- Close button (92%)
- Top and bottom edge support (83%)
- Footer/actions area (83%)
- Overlay/modal mode (92%)
- Click outside to close (92%)
- Dismissible control (92%)
- Focus trap (83%)
- Portal rendering (75%)
- Backdrop enabled (92%)
- Backdrop customization (83%)
- Backdrop click close (92%)
- ARIA dialog role (83%)
- Focus management (83%)
- Fade backdrop animation (83%)
- Navigation list support (83%)

**Common Patterns (67-75%)**:
- Forms in drawer (67%)
- Four-directional support (67%)
- Focus return on close (67%)
- Backdrop optional (67%)
- Content inert (67%)

### Emerging Patterns (Level 3-4: 20-69%)

These patterns show moderate adoption and may be evolving best practices:

**Moderate Adoption (40-69%)**:
- Push/side mode (50%)
- Predefined sizes (50%)
- Animation callbacks (50%)
- Responsive sizing (42%)
- Single vs multi-part architecture (42% single, 58% composite)
- Timing control (42%)

**Occasional Adoption (20-39%)**:
- Nested/stacked drawers (33%)
- Swipe gestures (33%)
- Custom transitions (33%)
- Persistent mode (25%)
- Full screen size (25%)

### Unique Innovations (Level 5: <20%)

These patterns are framework-specific innovations or niche features:

**Angular Material**:
- Three distinct modes (over/push/side) with clear use cases
- Container-content architecture pattern
- Dual sidenav support (left + right simultaneously)
- BreakpointObserver integration for responsive
- Fixed positioning with gap props (fixedTopGap/fixedBottomGap)

**Semantic UI Classic**:
- Six animation transitions (overlay, push, scale down, uncover, slide along, slide out)
- Push behavior with multiple simultaneous sidebars
- Custom context support (not just full page)
- Dimmer (backdrop) variations
- `.pushable` container architecture
- iOS-specific mobile optimization

**Vuetify**:
- Rail mode (compact 56px width, expands on hover)
- Responsive `null` pattern (auto close on mobile, open on desktop)
- Bottom drawer for mobile optimization
- Background image support
- Mini-variant with expand-on-hover
- Touch gestures with `touchless` prop

**Shadcn UI**:
- Dual components (Sheet for desktop, Drawer for mobile)
- Physics-based animations (Drawer via Vaul)
- Snap points for multi-position
- Drag handle pattern
- Input repositioning for mobile keyboards
- **Critical**: Vaul is unmaintained hobby project

**Nuxt UI**:
- Background scaling effects when drawer opens
- Command palette integration pattern
- Keyboard shortcut integration
- Nested drawer support with state management
- Comprehensive slot architecture
- Direction-specific portal rendering

**Mantine**:
- ScrollArea integration for better scroll control
- Drawer stack management (useDrawersStack hook)
- Compound components (Root/Overlay/Content/Header/etc.)
- Transition lifecycle callbacks
- Offset positioning configuration

**Ant Design**:
- Multi-level nested drawers with push behavior
- Loading states (v5.18+ skeleton loader)
- getContainer for custom mount points
- destroyOnClose for state cleanup
- Size presets (default 378px, large 736px)

**HeroUI**:
- Disabled state support
- Backdrop blur/transparency variants
- Motion animation customization via Framer Motion
- Server component compatible

**PrimeReact**:
- Headless mode with complete UI control
- Four-edge positioning (including top/bottom)
- Full screen dedicated prop
- Multiple simultaneous instances
- Custom backdrop content via function prop

**MUI**:
- Three variants (temporary/persistent/permanent)
- Elevation system integration
- SwipeableDrawer for mobile optimization
- PaperProps for fine-grained control
- Motion timing per Material Design spec

**Chakra UI**:
- useDisclosure hook for state management
- Comprehensive focus management (initial/final refs)
- HTML form attribute integration
- Cross-frame focus management option
- Smart scroll preservation

## Pattern Correlations

### Co-occurring Patterns

When these patterns appear together, they often form coherent feature sets:

**Modal Drawer Pattern** (appears together in 11/12 frameworks):
- When Backdrop enabled → Click outside to close in 11/11 frameworks
- When Modal mode exists → Focus trap in 10/11 frameworks
- When Backdrop present → ESC key dismiss in 12/12 frameworks

**Accessibility Feature Set** (appears together in 10/12 frameworks):
- When ARIA dialog role → Focus management in 10/10 frameworks
- When Focus trap exists → Focus return in 8/10 frameworks
- When Screen reader support → Keyboard navigation in 12/12 frameworks

**Content Structure Pattern** (appears together in 10/12 frameworks):
- When Header exists → Footer in 10/11 frameworks
- When Close button present → Header section in 11/11 frameworks
- When Navigation lists → Scrollable body in 10/10 frameworks

**Animation System** (appears together in most frameworks):
- When Slide transition → Backdrop fade in 10/12 frameworks
- When Custom transitions → Timing control in 4/4 frameworks
- When Animation callbacks → Custom transitions in 5/6 frameworks

**Advanced Interaction Set**:
- Swipe gestures + Drag handle: 2 frameworks (Nuxt UI, Shadcn Drawer)
- Snap points + Drag handle: 1 framework (Shadcn Drawer)
- Push mode + Nested drawers: 2 frameworks (Ant Design, Semantic UI)

### Mutually Exclusive Patterns

Certain patterns rarely appear together, suggesting different design philosophies:

**Display Modes** (architectural preference):
- Modal-only (10/12) vs Modal + Push + Permanent modes (2/12: Angular Material, MUI)
- Single overlay vs multiple display mode variants
- Trade-off: simplicity vs flexibility

**Architecture Patterns**:
- Single component (5/12) vs Multi-part composition (7/12)
- Portal rendering vs Container system (Angular Material, Semantic UI)
- Simple API vs Compositional flexibility

**Animation Approaches**:
- CSS transitions (most frameworks) vs Physics-based (Shadcn Drawer)
- Predefined transitions vs Custom animation system
- Simple slide vs Six animation types (Semantic UI)

**State Management**:
- Props-based (most frameworks) vs Hook-based (Chakra UI, Mantine)
- Controlled only vs Controlled + Uncontrolled
- v-model (Vue) vs open prop + callback (React)

## Implementation Notes

### Architectural Approaches

**Single Component Pattern** (5/12 frameworks):
```jsx
// Simple API, self-contained
<Drawer
  open={isOpen}
  onClose={handleClose}
  placement="right"
>
  <div>Content</div>
</Drawer>
```
**Benefits**: Easy to use, minimal boilerplate
**Trade-offs**: Less compositional control

**Multi-Part Composition** (7/12 frameworks):
```jsx
// Angular Material
<mat-sidenav-container>
  <mat-sidenav>Content</mat-sidenav>
  <mat-sidenav-content>Main</mat-sidenav-content>
</mat-sidenav-container>

// Chakra UI
<Drawer>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerHeader />
    <DrawerBody />
    <DrawerFooter />
  </DrawerContent>
</Drawer>
```
**Benefits**: Flexible structure, clear semantics
**Trade-offs**: More verbose, multiple components

### State Management Patterns

**Controlled Pattern** (most frameworks):
```jsx
// React
const [open, setOpen] = useState(false);
<Drawer open={open} onClose={() => setOpen(false)} />

// Vue
const open = ref(false);
<UDrawer v-model:open="open" />

// Angular
<mat-sidenav [(opened)]="isOpen" />
```

**Hook-Based** (Chakra UI, Mantine):
```jsx
const { isOpen, onOpen, onClose } = useDisclosure();
<Drawer isOpen={isOpen} onClose={onClose} />
```

**jQuery-Based** (Semantic UI):
```javascript
$('.ui.sidebar').sidebar('toggle');
$('.ui.sidebar').sidebar('show');
$('.ui.sidebar').sidebar('hide');
```

### Placement Configuration

**String-based**:
```jsx
// Most common
placement="left" | "right" | "top" | "bottom"

// RTL-aware
anchor="start" | "end"  // MUI, Vuetify
position="start" | "end"  // Angular Material
```

**Four-Direction Pattern** (8 frameworks):
- Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Shadcn UI, Vuetify
- All four edges supported natively
- Different animation directions

### Display Mode Configuration

**Simple Modal** (10 frameworks):
```jsx
// Single overlay mode
<Drawer modal backdrop />
```

**Multiple Modes** (Angular Material, MUI):
```jsx
// Temporary (overlay with backdrop)
<Drawer variant="temporary" />

// Persistent (no backdrop, stays open)
<Drawer variant="persistent" />

// Permanent (always visible, no dismiss)
<Drawer variant="permanent" />
```

### Framework-Specific Idioms

**React Patterns** (9/12 frameworks):
- Controlled components with open + onClose
- Portal rendering to document body
- Focus management with refs
- Animation callbacks for lifecycle
- Composition with children

**Vue Patterns** (2/12 frameworks):
- v-model for two-way binding
- Named slots for content areas
- Scoped slots for advanced composition
- Composables for state (Nuxt UI)
- Kebab-case prop names

**Angular Patterns** (1/12 framework):
- Two-way binding with [(opened)]
- BreakpointObserver for responsive
- ViewChild refs for programmatic control
- RxJS observables for events
- Material Design integration

**jQuery Patterns** (1/12 framework):
- Method invocation via strings
- Callback-based events
- Settings object configuration
- DOM manipulation approach
- Progressive enhancement

## Key Insights for Component Library Design

### Universal Expectations (Implement These)

Based on 83%+ adoption rates, users expect:

1. **Core functionality**:
   - Left and right edge placement (100%)
   - Open/close state management (100%)
   - Scrollable body content (100%)
   - ESC key dismissal (100%)
   - ARIA labels and semantic HTML (100%)
   - Keyboard navigation (100%)

2. **Content structure**:
   - Header/title section (92%)
   - Body/content area (100%)
   - Footer/actions area (83%)
   - Close button (92%)

3. **Modal behavior**:
   - Backdrop/overlay (92%)
   - Click outside to close (92%)
   - Focus trap (83%)
   - Scroll blocking (92%)

4. **Positioning**:
   - Top and bottom support (83%)
   - Custom width/height (100%)

5. **Animations**:
   - Slide transition (100%)
   - Backdrop fade (83%)

6. **Accessibility**:
   - Screen reader support (100%)
   - Focus management (83%)
   - Content inert (67%)

### High-Value Optional Features (Consider These)

Based on 40-70% adoption and clear use cases:

1. **Display modes**: Push/persistent modes (50%)
2. **Sizing**: Predefined size presets (50%)
3. **Advanced interactions**: Swipe gestures (33%), Focus return (67%)
4. **Backdrop control**: Optional backdrop (67%)
5. **Animation control**: Callbacks (50%), Timing (42%)
6. **Responsive**: Breakpoint-based sizing (42%)
7. **Composition**: Multi-part architecture (58%)
8. **Portal rendering**: Z-index management (75%)

### Differentiating Features (Evaluate These)

Rare patterns that could provide competitive advantage:

1. **Advanced animations**:
   - Six transition types (Semantic UI)
   - Physics-based motion (Shadcn Drawer)
   - Custom transition system

2. **Responsive features**:
   - Rail/mini mode with expand-on-hover (Vuetify)
   - Responsive null pattern (Vuetify)
   - Bottom drawer for mobile (Vuetify)
   - SwipeableDrawer optimization (MUI)

3. **Advanced positioning**:
   - Snap points (Shadcn Drawer)
   - Fixed positioning with gaps (Angular Material)
   - Offset configuration (Mantine)

4. **State management**:
   - Nested drawer stack management (Mantine)
   - Multiple simultaneous drawers (Semantic UI, PrimeReact)
   - Background scaling effects (Nuxt UI)

5. **Developer experience**:
   - useDisclosure hook (Chakra UI)
   - Headless mode (PrimeReact)
   - Keyboard shortcut integration (Nuxt UI)
   - Command palette pattern (Nuxt UI)

### Anti-Patterns to Avoid

Patterns with low adoption or implementation issues:

1. **No top/bottom support**: Users expect four-directional (83% have it)
2. **No backdrop control**: Should be configurable (67% allow disabling)
3. **No keyboard support**: ESC and Tab are essential (100%)
4. **No focus management**: Accessibility requirement (83%)
5. **Manual close buttons only**: Should have click-outside/ESC (92%)
6. **No size customization**: Fixed sizes too limiting (100% allow custom)
7. **Unmaintained dependencies**: Vaul issue in Shadcn Drawer

## Recommendations for Semantic UI Next

### Core Features (Must-Have)

Implement these universal patterns:

1. **Basic Drawer Component**:
```jsx
<Drawer
  open={isOpen}
  onClose={handleClose}
  placement="right"
  size="md"
>
  <Drawer.Header>
    <Drawer.Title>Title</Drawer.Title>
    <Drawer.CloseButton />
  </Drawer.Header>
  <Drawer.Body>
    Content
  </Drawer.Body>
  <Drawer.Footer>
    <Button>Action</Button>
  </Drawer.Footer>
</Drawer>
```

2. **Four-directional placement**:
   - left, right, top, bottom
   - Default to right for consistency

3. **Content structure**:
   - Header with title
   - Scrollable body
   - Footer for actions
   - Built-in close button

4. **Modal behavior**:
   - Backdrop enabled by default
   - Click outside to close
   - ESC key dismissal
   - Focus trap
   - Body scroll blocking

5. **Animations**:
   - Slide transitions from edge
   - Backdrop fade in/out
   - Configurable duration

6. **Accessibility**:
   - ARIA dialog role
   - Proper labeling
   - Focus management (trap + return)
   - Keyboard navigation
   - Screen reader announcements

7. **Size system**:
   - Predefined sizes (xs, sm, md, lg, xl, full)
   - Custom width/height
   - Responsive sizing support

### Enhanced Features (Should-Have)

Add these high-value patterns:

1. **Display modes**:
   - Overlay (default)
   - Push (optional)
   - Consider persistent mode

2. **Advanced interactions**:
   - Swipe to dismiss on mobile
   - Touch gesture support
   - Drag handle indicator

3. **Backdrop customization**:
   - Color/opacity control
   - Blur effect option
   - Optional disable

4. **Portal rendering**:
   - Render outside DOM
   - Z-index management
   - Custom container option

5. **Animation callbacks**:
   - onOpen, onClose
   - onOpenStart, onCloseStart
   - onOpenComplete, onCloseComplete

6. **Focus control**:
   - Initial focus element
   - Return focus on close
   - Focus trap options

### Differentiating Features (Consider)

Evaluate these for competitive advantage:

1. **Smart responsive behavior**:
   - Auto-switch to bottom drawer on mobile
   - Rail/mini mode for desktop navigation
   - Responsive size presets

2. **Advanced animations**:
   - Multiple transition types
   - Custom easing functions
   - Motion design system integration

3. **Developer experience**:
   - State management hook
   - Keyboard shortcut integration
   - Nested drawer management
   - Background content effects

4. **Unique features**:
   - Command palette pattern
   - Multi-level nested drawers
   - Snap points for bottom sheets
   - Fixed positioning with gaps

5. **Web component advantages**:
   - Framework-agnostic
   - Shadow DOM encapsulation
   - Native CSS animations
   - Custom element registry

### Semantic UI Classic Migration

Preserve these valuable classic patterns:

**Keep**:
- Six animation transitions (overlay, push, scale down, uncover, slide along, slide out)
- Push behavior concept
- Custom context support
- Dimmer (backdrop) variations
- Mobile optimizations

**Modernize**:
- Remove jQuery dependency
- Replace method strings with props
- Convert callbacks to events
- Add TypeScript support
- Implement React patterns

**Add**:
- Accessibility features (focus trap, ARIA)
- Portal rendering
- Swipe gestures for mobile
- Responsive size system
- Animation callbacks
- Modern state management

## Conclusion

Drawer/Sheet/Sidebar implementation across modern frameworks shows strong consensus on fundamentals (placement, modal behavior, animations, accessibility) with divergence in advanced features (display modes, gestures, responsive patterns, animation systems).

**Key Takeaway**: All 12 frameworks implement the core patterns identically (slide from edges, backdrop, ESC dismiss, focus management). The competitive differentiation happens in:

1. **Display mode flexibility** (modal vs push vs persistent vs permanent)
2. **Responsive optimization** (mobile gestures, rail mode, auto-switching)
3. **Animation sophistication** (multiple transitions, physics, custom systems)
4. **Developer experience** (hooks, composition, state management)
5. **Advanced interactions** (snap points, drag handles, nested drawers)

For Semantic UI Next, the strategy should be:
- **Nail the fundamentals** (leverage patterns with 83%+ adoption)
- **Add high-value features** (display modes, gestures, responsive sizing)
- **Differentiate selectively** (preserve Classic's six transitions, add modern DX)
- **Modernize Classic patterns** (keep animation variety, drop jQuery)
- **Focus on web standards** (use native APIs, avoid unmaintained dependencies)

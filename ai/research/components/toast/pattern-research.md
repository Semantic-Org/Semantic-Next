# Component Pattern Research: Toast / Snackbar / Notification

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 7 (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact)
- Date: 2025-11-05
- Unique patterns identified: 60+
- Note: ShadCN excluded as headless library

## Component Definition Consensus

Across all frameworks, the toast/snackbar/notification component serves a universal purpose: **providing brief, non-disruptive feedback messages that appear temporarily at screen edges or corners to confirm user actions or communicate system status**. These transient overlays auto-dismiss after a short duration, ensuring they don't block user workflows while delivering important contextual information.

**Common Mental Model**: A temporary message overlay where:
1. **Triggered by events**: User actions or system events trigger toast display
2. **Appears at screen edge**: Positions at top, bottom, or corners without blocking content
3. **Auto-dismisses**: Disappears after a few seconds (typically 3-6 seconds)
4. **Non-modal**: Doesn't require user interaction to dismiss (though often can be manually closed)
5. **Queuing behavior**: Multiple toasts stack or queue for sequential display

**Semantic Meaning**: Communicates success confirmations, error notifications, informational updates, or warnings. Less critical than modal alerts—used for transient feedback that doesn't require immediate action. Common use cases: form submissions, copy confirmations, file uploads, saved changes, error messages.

## Terminology Variations

### Component Names
- **Message** (1 framework): Ant Design (lightweight toast)
- **Toast** (4 frameworks): Chakra UI, HeroUI, Nuxt UI, PrimeReact
- **Snackbar** (1 framework): MUI (Material Design term)
- **Notifications** (1 framework): Mantine (package: @mantine/notifications)

### API Approaches
- **Imperative/Programmatic**: `toast()`, `message.success()`, `notifications.show()`, `toastRef.current.show()`
- **Hook-based**: `useToast()`, `useNotifications()`
- **Composable**: `useToast()` (Nuxt UI - Vue composable)
- **Provider-based**: `<ToastProvider>` wrapping app
- **Ref-based**: `toastRef.current.show()` (PrimeReact)

### Prop/Attribute Terminology
- **Content**: `message` (Ant Design) = `description` (Chakra, HeroUI, Nuxt) = message prop (MUI)
- **Type/Status**: `type` (Ant Design) = `status` (Chakra) = `color` (HeroUI, Nuxt) = `severity` (MUI, PrimeReact)
- **Duration**: `duration` (Ant Design, Chakra, HeroUI) = `autoHideDuration` (MUI) = `life` (PrimeReact)
- **Position**: `top`/`bottom` (Ant Design) = `position` (Chakra, PrimeReact) = `anchorOrigin` (MUI) = built into composable (Mantine)

## Pattern Inventory

### Display Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Top-center position | Toast at top center of screen | 4/7 (57%) | Level 2 (Common) | Ant Design, Mantine, MUI, PrimeReact | Native |
| Bottom-center position | Toast at bottom center | 6/7 (86%) | Level 2 (Common) | Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact | Native |
| Top-right corner | Toast at top-right | 6/7 (86%) | Level 2 (Common) | Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact | Native |
| Top-left corner | Toast at top-left | 6/7 (86%) | Level 2 (Common) | Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact | Native |
| Bottom-right corner | Toast at bottom-right | 6/7 (86%) | Level 2 (Common) | Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact | Native |
| Bottom-left corner | Toast at bottom-left | 6/7 (86%) | Level 2 (Common) | Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact | Native |
| Multi-position support | Multiple toasts at different positions | 1/7 (14%) | Level 5 (Rare) | PrimeReact only | Native |
| Stacked display | Multiple toasts stack vertically | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Title | Primary heading text | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Description | Secondary body text | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Icons | Status or custom icons | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Close button | Manual dismiss control | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Action buttons | Interactive buttons in toast | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, MUI, Nuxt, PrimeReact | Native |
| Rich content | JSX/VNodes for complex layouts | 6/7 (86%) | Level 2 (Common) | All except Ant Design Message | Native or Composed |
| Avatar/Image | User avatars or images | 2/7 (29%) | Level 4 (Occasional) | HeroUI, Nuxt UI | Native |
| Progress indicator | Visual progress bar | 2/7 (29%) | Level 4 (Occasional) | HeroUI (promise), Nuxt UI | Native |

### Type/Status Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Success | Green/positive feedback | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Error | Red/negative feedback | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Warning | Yellow/caution message | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Info | Blue/informational message | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Loading | Spinner/progress indication | 4/7 (57%) | Level 2 (Common) | Ant Design, Chakra, HeroUI (promise), Nuxt (promise) | Native |
| Neutral/Default | Unstyled or subtle variant | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, Mantine, Nuxt, PrimeReact | Native |

### Behavior Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Auto-dismiss | Automatic timeout removal | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Manual dismiss | Click X or button to close | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Persistent/Sticky | No auto-dismiss (0 duration) | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native via duration=0/infinite |
| Pause on hover | Stop countdown when hovering | 4/7 (57%) | Level 2 (Common) | Chakra, HeroUI, Nuxt, PrimeReact | Native |
| Update existing toast | Modify toast content in place | 4/7 (57%) | Level 2 (Common) | Ant Design, Chakra, HeroUI, Mantine | Native |
| Queue management | Control max concurrent toasts | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, Nuxt, PrimeReact, Mantine | Native |
| Promise integration | Auto-update based on promise state | 3/7 (43%) | Level 3 (Moderate) | Chakra, HeroUI, Nuxt | Native |
| Programmatic close all | Dismiss all toasts at once | 6/7 (86%) | Level 2 (Common) | All except MUI | Native |
| Click-away dismiss | Close when clicking outside | 1/7 (14%) | Level 5 (Rare) | MUI only | Native |

### Animation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Slide-in animation | Toast slides from edge | 6/7 (86%) | Level 2 (Common) | All except Ant Design | Native |
| Fade animation | Toast fades in/out | 5/7 (71%) | Level 2 (Common) | Ant Design, MUI, others as option | Native |
| Scale/Grow animation | Toast scales up | 2/7 (29%) | Level 4 (Occasional) | MUI (option), Chakra | Native |
| Custom transitions | User-defined animations | 3/7 (43%) | Level 3 (Moderate) | Chakra, MUI, Nuxt | Native |
| Stacking animations | Smooth reordering when added/removed | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, Mantine, Nuxt, PrimeReact | Native |

### Styling Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Visual variants | Solid, subtle, bordered, etc. | 6/7 (86%) | Level 2 (Common) | All except Ant Design | Native |
| Custom styling | Apply custom CSS classes/styles | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Theme integration | Uses framework theme colors | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Dark mode support | Adapts to dark/light themes | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### API Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Imperative API | Call functions to show toasts | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Hook-based API | React hooks for toast control | 4/7 (57%) | Level 2 (Common) | Ant Design, Chakra, Mantine, MUI (custom) | Native |
| Provider-based | Wrap app with provider | 4/7 (57%) | Level 2 (Common) | Ant Design (App), Chakra, HeroUI, Nuxt (Toaster) | Native |
| Ref-based API | Access via React ref | 1/7 (14%) | Level 5 (Rare) | PrimeReact only | Native |
| Static methods | `message.success()` style | 2/7 (29%) | Level 4 (Occasional) | Ant Design (legacy), Mantine | Native |
| Composable API | Vue composable | 1/7 (14%) | Level 5 (Rare) | Nuxt UI only | Native |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| ARIA role alert | Semantic role for announcements | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Screen reader announcements | Content read to assistive tech | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Keyboard dismissal | ESC key to close | 6/7 (86%) | Level 2 (Common) | All except Ant Design | Native |
| Focus management | Proper focus handling | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Reduced motion | Respects prefers-reduced-motion | 4/7 (57%) | Level 2 (Common) | Chakra, MUI, Nuxt, likely others | Native |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Title and description content
- Icon support
- Close button
- Success, error, warning, info status types
- Auto-dismiss behavior
- Manual dismiss capability
- Persistent/sticky mode
- Stacked display for multiple toasts
- Imperative API
- Custom styling support
- Theme integration
- Dark mode support
- ARIA alert role
- Screen reader announcements
- Focus management

**Common Patterns (57-86% adoption):**
- Bottom-center, top-right, top-left, bottom-right, bottom-left positions (86%)
- Rich content/JSX support (86%)
- Slide-in animation (86%)
- Visual style variants (86%)
- Programmatic close all (86%)
- Keyboard dismissal (86%)
- Action buttons (71%)
- Queue management (71%)
- Fade animation (71%)
- Stacking animations (71%)
- Pause on hover (57%)
- Update existing toast (57%)
- Loading status (57%)
- Hook-based API (57%)
- Provider-based setup (57%)
- Reduced motion support (57%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-59%):**
- Promise integration (43% - Chakra, HeroUI, Nuxt)
- Custom transitions (43%)

**Occasional Adoption (20-39%):**
- Avatar/Image support (29%)
- Progress indicator (29%)
- Static methods API (29%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**
- **Ant Design**: Lightweight Message component vs full Notification; Static methods (legacy); App component context; Promise chaining for sequential messages
- **Chakra UI**: v3 code snippet pattern; createToaster() factory; Multi-part anatomy (v3); Pause/resume programmatic control
- **HeroUI**: Provider-based architecture; Outstanding promise integration (loading → success/error); Per-slot Tailwind customization; EndContent for actions
- **Mantine**: Non-provider architecture (global state); Separate @mantine/notifications package; notifications.update() for dynamic transformations; Built-in queue with max limit
- **MUI**: Click-away dismiss; SnackbarContent component; Third-party notistack integration; Close reason tracking
- **Nuxt UI**: Composable-driven API (useToast); Sonner-inspired stacking; Hover-to-expand with pause; VNode support; Built-in progress bar
- **PrimeReact**: Multi-position architecture (multiple ref instances); Seven position options; Ref-based imperative API; Batch message display; Dual template systems (message-level + component-level); Six severity levels

## Pattern Correlations

**When Action Buttons exist (5/7 frameworks):**
- 100% support multiple actions (5/5)
- 80% integrate with promise workflows (4/5: Chakra, HeroUI, Nuxt + MUI custom)
- Common actions: Undo, Retry, Dismiss, View Details

**When Promise Integration exists (3/7):**
- 100% auto-transition loading → success/error
- 100% show progress/spinner during loading
- Single toast updates in place vs creating new toasts
- Chakra, HeroUI, Nuxt all implement this pattern

**When Queue Management exists (5/7):**
- 80% support max concurrent limit (4/5: Chakra, Nuxt, PrimeReact, Mantine)
- 100% auto-stack when limit reached
- Queuing strategy: FIFO (first in, first out)

**When Pause on Hover exists (4/7):**
- 100% resume countdown after mouse leaves
- 75% also support programmatic pause/resume (3/4: Chakra has explicit methods)
- Improves UX by giving users time to read

**Position Support correlation:**
- 86% support 6 standard positions (6/7: all except Ant Design)
- Ant Design limited to top/bottom center only
- PrimeReact unique in supporting multiple independent toast containers at different positions simultaneously

**Update Pattern correlation:**
- When update exists (4/7), all use ID/key to identify toast
- Ant Design: key parameter
- Chakra: returns toast ID
- HeroUI: returns toast ID
- Mantine: ID parameter
- Enables "loading → success" transformation pattern

## Implementation Notes

### API Design Patterns

**Imperative APIs:**
1. **Function call** (Mantine): `notifications.show({ ... })`
2. **Hook return** (Chakra, Ant Design): `const toast = useToast(); toast({ ... })`
3. **Composable** (Nuxt): `const toast = useToast(); toast.add({ ... })`
4. **Ref methods** (PrimeReact): `toastRef.current.show({ ... })`
5. **Static methods** (Ant Design legacy): `message.success('...')`

**Provider Patterns:**
1. **Context provider** (Chakra, HeroUI): `<ToastProvider>` at app root
2. **App component** (Ant Design v5+): `<App>` wrapper for context
3. **Toaster component** (Nuxt): `<UToaster>` for rendering container
4. **No provider** (Mantine): Global state, no wrapping needed

**State Management:**
- Most frameworks use internal state management
- Toasts stored in framework-managed state
- Updates trigger re-renders
- Mantine uses module-level state (singleton pattern)

**Duration Control:**
- Default: 3-6 seconds (varies by framework)
- Infinite: 0, null, or Infinity
- Per-toast customization universal
- Global defaults configurable in most

### Architectural Observations

**Component Philosophy:**
- **Imperative-first** (6/7): Ant Design, Chakra, HeroUI, Mantine, Nuxt, PrimeReact
- **Declarative option** (1/7): MUI (component-based with state)
- **Hybrid approach** (some): Support both patterns

**Rendering Strategy:**
- **Portal-based** (most): Render outside app hierarchy
- **Fixed positioning**: Absolute/fixed CSS positioning
- **Z-index management**: High z-index to overlay content
- **Separate container**: Dedicated DOM node for toasts

**Queue Implementation:**
- **Built-in** (5/7): Chakra, HeroUI, Mantine, Nuxt, PrimeReact
- **Custom** (2/7): Ant Design, MUI (requires user implementation)
- **Max limit**: Configurable in frameworks with queues
- **Stacking**: Vertical stacking with smooth animations

**Animation Philosophy:**
- Most use CSS transitions or spring animations
- Chakra UI integrates with Framer Motion
- MUI uses Material-UI transitions
- Nuxt uses Tailwind-based animations

**Accessibility Approach:**
- All use ARIA `role="alert"` or `role="status"`
- Screen readers automatically announce new toasts
- Keyboard navigation standard (ESC to dismiss)
- Focus management varies by framework

**Promise Integration Strategy** (3 frameworks):**
1. **Single toast updates**: Loading state transforms to success/error
2. **Automatic icon changes**: Spinner → check/X icon
3. **Progress indication**: Optional progress bar
4. **Cleanup**: Auto-dismiss on completion or error

**Multi-position Support:**
- **Single active position** (6/7): One position per app instance
- **Multiple simultaneous** (1/7): PrimeReact supports multiple ref instances

## Sophisticated Design Patterns

### Chakra UI (v3) - Pause/Resume Timer Control

**What it does**: Chakra v3 provides `toaster.pause(id)` and `toaster.resume(id)` methods that allow programmatic control over the auto-dismiss countdown timer. This decouples timer management from browser hover events, giving applications direct control over when toasts should dismiss. A common use case: pause timer when a user begins interacting with a toast's action button.

```typescript
const toastId = toaster.create({ title: 'Processing', duration: 10000 })
toaster.pause(toastId)  // Pause the countdown
toaster.resume(toastId) // Resume the countdown
```

**Why it's sophisticated**: This solves a non-obvious UX problem: users might need uninterrupted time with a toast without relying on hover detection (which fails on touch devices or when focus moves away). The pause/resume pattern decouples the user's interaction intent from the technical mechanism of timeout control, enabling flexible dismissal strategies for different input types and accessibility needs.

**Evidence of design maturity**:
- Handles the edge case of touch devices where "hover" doesn't exist
- Works across focus changes (user can interact with other page elements while toast is paused)
- Allows applications to implement custom interaction patterns without fighting the framework
- Part of Chakra's evolution to give developers fine-grained programmatic control (v2 lacked this)

### Nuxt UI - Hover-to-Expand Stacking (Sonner-inspired)

**What it does**: Nuxt UI implements a space-saving stacking pattern where multiple toasts collapse into a single visible card showing only the most recent notification. Hovering expands the stack to reveal all queued toasts. This is controlled via the `expand` prop on `UToaster`. When collapsed, only the top toast is visible; hovering reveals the full stack vertically.

```vue
<UToaster :expand="true" :max="10" />

<!-- Multiple toasts appear as one collapsed card, expanding on hover -->
<!-- Hovering also pauses all auto-dismiss timers in the stack -->
```

**Why it's sophisticated**: This solves the fundamental problem of notification overflow without losing information. Most frameworks simply stack all toasts (eating screen real estate) or discard excess toasts. The expand-on-hover pattern provides "progressive disclosure"—users see what they need (latest notification) and can expand to see history without permanently occupying space. This requires special animation and interaction handling that's unique to the toast context.

**Evidence of design maturity**:
- Pauses all timers when stack is expanded (giving users time to read expanded notifications)
- Collapses stack after hover ends (returning to space-efficient state)
- Preserves notification history in collapsed state without displaying all visually
- Inspired by production-proven Sonner library, not a first-draft idea
- Requires coordination between hover detection, animation timing, and timer management

### HeroUI - Key-Based Programmatic Toast Control with Promise Integration

**What it does**: HeroUI's `addToast()` returns a unique string key that enables subsequent imperative control and promise-driven state transitions. A single toast can be identified, updated, or dismissed using this key. Combined with promise support, a toast can automatically transition from loading → success/error based on promise resolution without creating multiple toast instances.

```jsx
// Create and identify
const toastKey = addToast({
  title: 'Processing...',
  promise: apiCall(),
  timeout: Infinity
})

// Later: close specific toast
closeToast(toastKey)

// Or batch close all
closeAll()
```

**Why it's sophisticated**: This pattern solves two non-obvious problems simultaneously: (1) identifying individual toasts among many for targeted control, and (2) maintaining toast identity across state transitions. The promise integration means a single toast can represent an entire async operation lifecycle (loading spinner → success checkmark) without requiring the application to track state changes or create/destroy multiple toast instances. This is non-trivial because it requires the framework to map promise state transitions to visual updates while preserving the toast's DOM position and key reference.

**Evidence of design maturity**:
- Solves the "floating promises" problem (toasts created but never tracked for cleanup)
- Key-based control enables sophisticated patterns like "dismiss all errors" or "limit toasts per operation type"
- Promise pattern eliminates boilerplate for common async operation feedback (loading → success)
- Each toast maintains stable identity across state changes (not recreated on update)
- Enables queue management (provider can enforce maxVisibleToasts, queueing excess by key)

## Raw Data References

Individual framework research reports available at:
- `ai/research/toast/ant-design/usage-patterns.md`
- `ai/research/toast/chakra-ui/usage-patterns.md`
- `ai/research/toast/heroui/usage-patterns.md`
- `ai/research/toast/mantine/usage-patterns.md`
- `ai/research/toast/mui/usage-patterns.md`
- `ai/research/toast/nuxt-ui/usage-patterns.md`
- `ai/research/toast/primereact/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 7 UI frameworks' toast/snackbar/notification implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping

ShadCN excluded as headless library providing behavioral primitives without complete UI.

All findings represent actual implementations as of November 2025.

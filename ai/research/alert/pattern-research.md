# Component Pattern Research: Alert / Notification

> Last Modified: 2025-11-06

## Research Summary
- Frameworks surveyed: 7 (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact)
- Date: 2025-11-06
- Unique patterns identified: 60+
- Component variations: 2 primary patterns (inline alerts + toast/notification systems)
- Note: Radix UI and ShadCN excluded as headless/primitive libraries

## Component Definition Consensus

Across all frameworks, alert and notification components serve two related but distinct purposes:

**Alert Component (Inline)**: A static or semi-static feedback component that displays important messages within the page flow. Alerts are contextual, remaining visible until dismissed (if dismissible) or until the component is unmounted. They communicate status, warnings, errors, or informational content that relates to specific page sections or actions.

**Notification/Toast System (Positioned)**: A dynamic notification system that displays messages at viewport corners or edges, rendered outside normal page flow using portals. Notifications are suitable for application-level feedback, supporting auto-dismiss, stacking, queue management, and programmatic control.

**Common Mental Model for Alerts**:
1. **Semantic severity**: Color-coded levels (success, info, warning, error)
2. **Contextual placement**: Inline within content flow
3. **Optional dismissal**: Can be closed by user action
4. **Icon reinforcement**: Visual icons complement color coding
5. **Content hierarchy**: Title + description structure

**Common Mental Model for Notifications**:
1. **Global positioning**: Fixed at viewport corners/edges
2. **Dynamic lifecycle**: Programmatic show/hide/update
3. **Auto-dismiss**: Configurable timeout for automatic removal
4. **Queue management**: Handle multiple notifications gracefully
5. **Portal rendering**: Outside normal DOM hierarchy

**Semantic Meaning**: Both patterns communicate application state, user action feedback, validation results, or system status through semantic color coding and clear content hierarchy.

## Terminology Variations

### Component Names

**Inline Feedback Components:**
- **Alert** (7 frameworks): Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact (Messages component serves similar purpose)
- **Message** (1 framework): PrimeReact also has singular Message for static inline use

**Toast/Notification Systems:**
- **Notification** (2 frameworks): Ant Design, Mantine (both have dedicated systems)
- **Toast** (1 framework pattern): While not explicitly documented for all, the pattern exists in Mantine via @mantine/notifications
- **Messages** (1 framework): PrimeReact uses Messages (plural) for dynamic inline notifications

### Dual-Component Systems

Several frameworks provide BOTH inline and toast/notification systems:

- **Ant Design**: Alert (inline) + Notification (positioned system)
- **Mantine**: Alert (inline) + Notification (base component) + Notifications System (@mantine/notifications)
- **PrimeReact**: Message (inline static) + Messages (inline dynamic) + Toast (positioned)

### API Approaches
- **Declarative/JSX**: Standard React component pattern (5/7 for alerts: Chakra, HeroUI, Mantine Alert, MUI, Nuxt)
- **Imperative/Ref-based**: Method calls on ref (2/7: Ant Design Notification, PrimeReact Messages)
- **Hook-based**: useNotification, useToast patterns (2/7: Ant Design, Mantine)
- **Static methods**: Global API calls (1/7: Ant Design Notification)

### Prop/Attribute Terminology

**Severity/Status:**
- `severity` (MUI, PrimeReact) = `status` (Chakra UI) = `color` (HeroUI, Mantine, Nuxt) = `type` (Ant Design)

**Content Structure:**
- `title` + `description` (HeroUI, Nuxt, PrimeReact) = `message` + `description` (Ant Design Notification, Mantine Notification)
- `AlertTitle` sub-component (Chakra, MUI) = `title` prop (others)
- `children` as message content (Chakra, MUI, Mantine Alert) = `message`/`text` prop (others)

**Dismissal:**
- `closable` (Ant Design, PrimeReact) = `withCloseButton` (Mantine) = `onClose` callback (Chakra, MUI) = `close` prop (Nuxt)

**Visual Variants:**
- `variant` (Chakra, HeroUI, MUI, Nuxt) = no explicit variant prop (others use color/type only)

## Pattern Inventory

### Component Architecture Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Inline alert component | Static/semi-static message within page flow | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Dismissible/Closable | User can manually close alert | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Portal-based positioning | Notification rendered outside DOM hierarchy | 2/7 (29%) | Level 4 (Occasional) | Ant Design Notification, Mantine Notifications | Native |
| Dual component system | Separate inline + toast/notification | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Mantine, PrimeReact | Native |
| Ref-based imperative API | Control via ref methods | 2/7 (29%) | Level 4 (Occasional) | Ant Design Notification, PrimeReact Messages | Native |
| Hook-based API | useNotification, useToast hooks | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine | Native |
| Static method API | Global notification.success() calls | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Controlled visibility | Parent manages open/close state | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, MUI, Nuxt, Mantine Alert | Native |

### Visual Patterns - Severity/Status Levels

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Success level | Green, positive feedback | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Info level | Blue, informational messages | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Warning level | Orange/yellow, caution messages | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Error level | Red, error/failure messages | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Loading state | Processing/loading indicator | 2/7 (29%) | Level 4 (Occasional) | Chakra UI v2, Mantine Notification | Native |
| Neutral/default level | Gray, non-semantic messages | 3/7 (43%) | Level 3 (Moderate) | Chakra v3, HeroUI, Nuxt | Native |

### Visual Patterns - Style Variants

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Filled/solid variant | Solid colored background | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, Mantine, MUI, Nuxt | Native |
| Outlined/border variant | Border-only styling | 4/7 (57%) | Level 2 (Common) | Chakra (v2), HeroUI, MUI, Nuxt | Native |
| Subtle/light variant | Soft background | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, Mantine, Nuxt, MUI (standard) | Native |
| Left-accent variant | Left border emphasis | 1/7 (14%) | Level 5 (Rare) | Chakra UI v2 only | Native |
| Top-accent variant | Top border emphasis | 1/7 (14%) | Level 5 (Rare) | Chakra UI v2 only | Native |
| Transparent variant | No background | 1/7 (14%) | Level 5 (Rare) | Mantine only | Native |
| White variant | White background | 1/7 (14%) | Level 5 (Rare) | Mantine only | Native |
| Banner mode | Full-width styling | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Title + description | Two-tier content hierarchy | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Icon display | Status/severity icon | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Custom icon | Override default icon | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Hide icon | Option to remove icon | 6/7 (86%) | Level 2 (Common) | All except Nuxt | Native |
| Action buttons | Custom action elements | 5/7 (71%) | Level 2 (Common) | Ant Design, HeroUI, MUI, Nuxt, PrimeReact Messages | Native |
| Rich content/HTML | JSX/ReactNode content | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Close button | Manual dismissal control | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Custom close icon | Override close button icon | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Nuxt, PrimeReact | Native |
| Avatar integration | User avatar instead of icon | 1/7 (14%) | Level 5 (Rare) | Nuxt UI only | Native |
| Start/end content slots | Leading/trailing content areas | 1/7 (14%) | Level 5 (Rare) | HeroUI only | Native |

### Behavioral Patterns - Dismissal

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Manual close | User clicks close button | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| onClose callback | Callback when closed | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| afterClose callback | Callback after animation | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Non-closable option | Disable close button | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Mantine Notification, PrimeReact | Native |
| Close animation | Smooth transition on close | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Controlled dismissal | Parent controls visibility | 5/7 (71%) | Level 2 (Common) | Chakra, HeroUI, MUI, Nuxt, Mantine Alert | Native |

### Behavioral Patterns - Auto-Dismiss (Notifications)

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Auto-dismiss timeout | Automatic removal after duration | 2/7 (29%) | Level 4 (Occasional) | Ant Design Notification, Mantine Notifications, PrimeReact Messages | Native |
| Configurable duration | Custom timeout values | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine, PrimeReact | Native |
| Disable auto-dismiss | Persistent/sticky mode | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine, PrimeReact | Native |
| Pause on hover | Suspend timer on mouse hover | 1/7 (14%) | Level 5 (Rare) | Ant Design Notification only | Native |
| Progress bar | Visual countdown | 1/7 (14%) | Level 5 (Rare) | Ant Design Notification only | Native |

### Positioning Patterns (Notifications)

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Top-right placement | Default corner position | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine | Native |
| 6 placement options | Top/bottom × left/center/right | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine | Native |
| Offset control | Distance from viewport edge | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine | Native |
| Stacking behavior | Multiple notifications stack | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine, PrimeReact | Native |
| MaxCount limit | Maximum simultaneous notifications | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Stack with threshold | Collapse when exceeding count | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |

### Layout Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Horizontal layout | Icon-title-description inline | 7/7 (100%) | Level 1 (Universal) | All frameworks (default) | Native |
| Vertical layout | Stacked/centered arrangement | 2/7 (29%) | Level 4 (Occasional) | Chakra, Nuxt | Native |
| Full-width container | Spans parent width | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Custom width control | Constrain via style/className | 7/7 (100%) | Level 1 (Universal) | All frameworks | CSS |
| Banner mode | Full-width page-level alert | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Inline flow positioning | Within document flow | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Sub-component pattern | AlertTitle, AlertDescription | 2/7 (29%) | Level 4 (Occasional) | Chakra UI, MUI | Native |
| Slot-based customization | Named slots for styling | 3/7 (43%) | Level 3 (Moderate) | HeroUI, Mantine, Nuxt | Native |
| Dot notation (v3) | Alert.Root, Alert.Title pattern | 1/7 (14%) | Level 5 (Rare) | Chakra UI v3 only | Native |
| Custom content template | Replace default structure | 2/7 (29%) | Level 4 (Occasional) | Mantine Notification, PrimeReact | Native |
| Polymorphic component | Render as different element | 3/7 (43%) | Level 3 (Moderate) | Chakra, Mantine, Nuxt | Native |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| role="alert" | ARIA alert role | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Screen reader support | Content announced to AT | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Keyboard navigation | Focus management, tab order | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Close button accessibility | Proper labeling for AT | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Color independence | Icons convey meaning beyond color | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| aria-labelledby | Title association | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Mantine, MUI | Native |
| aria-describedby | Description association | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine | Native |
| Custom ARIA role | Override default role | 2/7 (29%) | Level 4 (Occasional) | Ant Design, MUI | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Theme integration | Uses framework theme | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Custom CSS classes | className prop | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Inline styles | style prop | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Dark mode support | Light/dark theme adaptation | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Border radius control | Configurable corner rounding | 4/7 (57%) | Level 2 (Common) | HeroUI, Mantine, PrimeReact (via theme), Nuxt (via variant) | Native |
| Color customization | Override severity colors | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native/Theme |
| Responsive design | Breakpoint-aware styling | 7/7 (100%) | Level 1 (Universal) | All frameworks | Composed |

### Animation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Fade in/out | Opacity transition | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Collapse transition | Height animation | 3/7 (43%) | Level 3 (Moderate) | Chakra (examples), MUI (Collapse), PrimeReact | Native/Composed |
| Custom transitions | User-defined animations | 4/7 (57%) | Level 2 (Common) | Chakra, HeroUI, MUI, PrimeReact | Native |
| Disable animations | Turn off transitions | 1/7 (14%) | Level 5 (Rare) | MUI (respects prefers-reduced-motion) | Native |
| Stagger animations | Sequential entrance | 1/7 (14%) | Level 5 (Rare) | MUI (TransitionGroup) | Composed |

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Error boundary | Catch React errors | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Queue management | Handle notification queues | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Mantine | Native |
| Update existing notification | Modify displayed notification | 1/7 (14%) | Level 5 (Rare) | Mantine Notifications only | Native |
| Batch operations | Show multiple at once | 2/7 (29%) | Level 4 (Occasional) | Ant Design, PrimeReact | Native |
| Loading state integration | Show loading in notification | 2/7 (29%) | Level 4 (Occasional) | Chakra, Mantine | Native |
| Context access | React context integration | 1/7 (14%) | Level 5 (Rare) | Ant Design Notification hook | Native |
| Lifecycle callbacks | onOpen, onClose, onRemove | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Mantine, PrimeReact | Native |
| RTL support | Right-to-left languages | 2/7 (29%) | Level 4 (Occasional) | Ant Design, MUI | Native |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Four semantic severity/status levels (success, info, warning, error)
- Icon display with severity-based defaults
- Custom icon override
- Title + description content hierarchy
- Rich content/HTML support
- Manual close with close button
- onClose callback
- Close animation
- Horizontal layout (default)
- Full-width container
- Inline flow positioning
- role="alert" ARIA attribute
- Screen reader support
- Keyboard navigation
- Close button accessibility
- Color-independent meaning (icons + text)
- Theme integration
- Custom CSS classes and inline styles
- Dark mode support
- Color customization
- Fade in/out animation

**Common Patterns (57-86% adoption):**
- Filled/solid variant (71%)
- Subtle/light variant (71%)
- Controlled visibility (71%)
- Action buttons (71%)
- Hide icon option (86%)
- Outlined/border variant (57%)
- Border radius control (57%)
- Custom transitions (57%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-59%):**
- Dismissible/closable (100% but configuration varies)
- Neutral/default severity level (43%)
- Dual component system (43%)
- Custom close icon (43%)
- Non-closable option (43%)
- Slot-based customization (43%)
- Collapse transition (43%)
- Lifecycle callbacks (43%)
- Polymorphic component (43%)
- aria-labelledby (43%)

**Occasional Adoption (29-39%):**
- Portal-based positioning (29%)
- Ref-based imperative API (29%)
- Hook-based API (29%)
- Auto-dismiss timeout (29%)
- Loading state (29%)
- 6 placement options (29%)
- Stacking behavior (29%)
- Vertical layout (29%)
- Sub-component pattern (29%)
- Custom content template (29%)
- aria-describedby (29%)
- Queue management (29%)
- Batch operations (29%)
- Loading state integration (29%)
- RTL support (29%)
- Custom ARIA role (29%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**

- **Ant Design**:
  - Static method API (notification.success())
  - Context menu trigger for alerts
  - Banner mode for full-width alerts
  - Error boundary variant (Alert.ErrorBoundary)
  - Notification stacking with threshold
  - MaxCount notification limit
  - Pause-on-hover with progress bar
  - afterClose callback
  - getPopupContainer for custom portal target
  - RTL mode configuration

- **Chakra UI**:
  - v2 vs v3 architecture evolution
  - Ark UI foundation (v3)
  - Left-accent and top-accent variants (v2)
  - Dot notation composition (v3: Alert.Root, Alert.Content)
  - Loading status variant (v2)
  - Style props system (bg, p, borderRadius, etc.)
  - Responsive arrays/objects for breakpoints
  - Polymorphic component pattern

- **HeroUI**:
  - Hook-based API (useAlert) with prop getters
  - 5-tier radius system (none, sm, md, lg, full)
  - startContent/endContent slots
  - hideIconWrapper option
  - Dual API (component + hook)
  - Avatar integration alternative to icon
  - Framer Motion animations (not explicitly documented but implied)

- **Mantine**:
  - Three-component system (Alert, Notification, Notifications)
  - @mantine/notifications separate package
  - White and transparent variants
  - Extensive Styles API
  - withBorder prop
  - Update notification by ID
  - useNotifications hook for state subscription
  - Notifications limit prop
  - Clean/cleanQueue methods

- **MUI**:
  - Material Design 3 specifications
  - AlertTitle as separate importable component
  - sx prop for system styling
  - Paper-based component architecture
  - Collapse integration for transitions
  - TransitionGroup for multiple alerts
  - Extensive CSS class targeting
  - CSS custom properties for colors
  - Controlled component pattern (no auto-visibility management)

- **Nuxt UI**:
  - Orientation prop (vertical/horizontal)
  - Avatar as alternative to icon
  - Iconify integration (i-{collection}-{icon})
  - UApp global configuration
  - oklch color space
  - 7 semantic colors (includes neutral, secondary)
  - Slot-based ui prop customization
  - Vue 3 event system (update:open)

- **PrimeReact**:
  - Dual component (Message singular + Messages plural)
  - Ref-based imperative API
  - Sticky mode (prevent auto-dismiss)
  - Replace method (atomic update)
  - Summary + detail structure
  - Custom content template
  - React Transition Group integration
  - Event callbacks (onClick, onRemove)
  - Life duration in milliseconds
  - Extensive theme system (Bootstrap, Material, Tailwind, etc.)

## Pattern Correlations

**When Dual Component System exists (3/7):**
- 100% provide inline + positioned variants
- 100% use different APIs (declarative inline, imperative positioned)
- 67% use ref-based API for dynamic component (2/3: Ant Design, PrimeReact)
- 33% use hook-based API (1/3: Mantine)

**When Auto-Dismiss exists (2/7 positioned systems):**
- 100% configurable duration
- 100% support disable/sticky mode
- 50% support pause-on-hover (1/2: Ant Design)
- 50% show progress indicator (1/2: Ant Design)

**When Portal-Based Positioning exists (2/7):**
- 100% support 6 placement options (top/bottom × left/center/right)
- 100% support offset control
- 100% support stacking multiple notifications
- 50% support queue management (Ant Design, Mantine)
- 50% support max count limits (1/2: Ant Design only)

**When Sub-Component Pattern exists (2/7):**
- 100% provide AlertTitle component
- 50% use dot notation (1/2: Chakra v3)
- 50% use named exports (1/2: MUI)
- Both support polymorphic rendering

**When Action Buttons exist (5/7):**
- 100% position at end/right side
- 100% support multiple actions
- 100% accept full button props
- 80% recommend small size (4/5)
- 60% support button arrays (3/5: Ant Design, Nuxt, PrimeReact)

**Severity Level Correlation:**
- All 7 frameworks use 4 core levels (success, info, warning, error)
- 43% add neutral/default (3/7: Chakra v3, HeroUI, Nuxt)
- 29% add loading state (2/7: Chakra v2, Mantine)
- 100% use semantic colors (green, blue, orange/yellow, red)
- 100% include default icons for each severity

**Visual Variant Correlation:**
- 71% support filled/solid variant (5/7)
- 71% support subtle/light variant (5/7)
- 57% support outlined/bordered variant (4/7)
- Only Chakra UI v2 supports accent variants (left/top)
- Only Mantine supports transparent and white variants

**Dismissal Pattern Correlation:**
- 100% support manual close button
- 100% provide onClose callback
- 43% support non-closable mode (3/7)
- 43% support custom close icon (3/7)
- 14% provide afterClose callback (1/7: Ant Design)
- Only notification systems (2/7) support auto-dismiss

## Implementation Notes

### API Design Patterns

**Declarative (Most Common):**
```jsx
// Standard React component pattern (5/7 for inline alerts)
<Alert severity="success" onClose={handleClose}>
  <AlertTitle>Success</AlertTitle>
  Success message content
</Alert>
```

**Imperative Ref-Based:**
```javascript
// PrimeReact pattern
const messages = useRef(null);
messages.current.show({
  severity: 'success',
  summary: 'Success',
  detail: 'Operation completed'
});
```

**Imperative Static Methods:**
```javascript
// Ant Design Notification pattern
notification.success({
  message: 'Success',
  description: 'Operation completed'
});
```

**Hook-Based:**
```javascript
// Ant Design / Mantine pattern
const [api, contextHolder] = notification.useNotification();
api.success({ message: 'Success' });
```

### Content Specification Patterns

**Prop-Based (Most Common):**
- Title prop: `title="Alert Title"`
- Description/children: `description="Details"` or `children`

**Sub-Component (Chakra, MUI):**
```jsx
<Alert>
  <AlertTitle>Title</AlertTitle>
  Description content
</Alert>
```

**Object-Based (Notifications):**
```javascript
{
  severity: 'success',
  summary: 'Title',
  detail: 'Description',
  life: 3000
}
```

### Architectural Observations

**Component Types:**
1. **Pure Inline**: Simple component in page flow (most alerts)
2. **Dynamic Inline**: Ref-controlled inline messages (PrimeReact Messages)
3. **Portal Toast**: Fixed positioned notifications (Ant Design, Mantine)

**State Management:**
- **Controlled**: Parent manages visibility (Chakra, HeroUI, MUI, Nuxt, Mantine Alert)
- **Semi-Controlled**: onClose callback but no auto-hide (most)
- **Imperative**: Ref/method-based control (Ant Design Notification, PrimeReact, Mantine Notifications)

**Rendering Strategy:**
- **In-Flow**: Standard component rendering (all inline alerts)
- **Portal**: ReactDOM.createRoot or Portal component (Ant Design, Mantine notifications)
- **Singleton Container**: One container, multiple notifications (both portal systems)

**Animation Philosophy:**
- Most use CSS transitions
- Chakra integrates with Framer Motion
- HeroUI uses Framer Motion (implied)
- PrimeReact uses React Transition Group
- MUI uses Collapse component
- All respect prefers-reduced-motion (accessibility)

### Accessibility Approach

**Universal Patterns:**
- role="alert" for immediate announcements
- role="status" option for less urgent (MUI, Ant Design)
- Icons convey meaning beyond color alone
- Keyboard accessible close buttons
- Screen reader support for all content

**Advanced Patterns:**
- aria-labelledby for title association (Ant Design, Mantine, MUI)
- aria-describedby for description association (Ant Design, Mantine)
- Custom ARIA role prop (Ant Design, MUI)
- Close button labels (closeText, closeButtonLabel)

**Documented Status:**
- PrimeReact explicitly notes accessibility "under development"
- All others provide complete accessibility documentation

### Theme Integration Patterns

All frameworks integrate with their respective theme systems:

- **Ant Design**: Component tokens, theme customization
- **Chakra UI**: Multi-style configs (v2), recipe system (v3), CSS variables
- **HeroUI**: Tailwind CSS, slot-based theming
- **Mantine**: Styles API, color system, size scale
- **MUI**: Theme overrides, sx prop, CSS custom properties
- **Nuxt UI**: app.config.ts, oklch colors, global defaults
- **PrimeReact**: Extensive theme variants (Bootstrap, Material, Tailwind, etc.)

## Raw Data References

Individual framework research reports available at:
- `ai/research/alert/ant-design/usage-patterns.md`
- `ai/research/alert/chakra-ui/usage-patterns.md`
- `ai/research/alert/heroui/usage-patterns.md`
- `ai/research/alert/mantine/usage-patterns.md`
- `ai/research/alert/mui/usage-patterns.md`
- `ai/research/alert/nuxt-ui/usage-patterns.md`
- `ai/research/alert/primereact/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 7 UI frameworks' alert/notification implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping
6. Component architecture comparison

Radix UI and ShadCN excluded as headless/primitive libraries providing behavioral primitives without complete UI implementations.

All findings represent actual implementations as of November 2025.

# Component Pattern Research: Tooltip

> Last Modified: 2025-11-06

## Research Summary
- Frameworks surveyed: 7 (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact)
- Date: 2025-11-06
- Unique patterns identified: 50+
- Note: Radix UI and ShadCN excluded as headless/primitive libraries

## Component Definition Consensus

Across all frameworks, the tooltip component serves a universal purpose: **displaying brief, contextual information when users hover over, focus on, or interact with an element**. Tooltips provide supplementary details, explanations, or labels without cluttering the interface, appearing as small overlays that automatically dismiss when interaction ends.

**Common Mental Model**: A floating label where:
1. **Triggered by interaction**: Hover, focus, or manual control reveals tooltip
2. **Appears near trigger**: Positions intelligently around the target element
3. **Brief content**: Short text, labels, or hints (not complex interactions)
4. **Auto-dismisses**: Disappears when interaction ends
5. **Non-blocking**: Doesn't interrupt user workflow

**Semantic Meaning**: Provides contextual help, labels for icon-only buttons, definitions, or supplementary information. Used for: icon button labels, form field hints, truncated text expansion, keyboard shortcuts, status explanations, and feature descriptions.

## Terminology Variations

### Component Names
- **Tooltip** (7 frameworks): Universal naming across all surveyed frameworks

### API Approaches
- **Wrapper/Children**: Wraps trigger element (Ant Design, Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact)
- **Data Attributes**: Uses data-* attributes on elements (PrimeReact standalone mode)
- **Prop-based**: Configuration via props on components (PrimeReact built-in mode)
- **Composition**: Sub-components for parts (Chakra UI Ark-based)

### Prop/Attribute Terminology
- **Content**: `title` (Ant Design) = `label`/`content` (Chakra, HeroUI) = `label` (Mantine) = `title` (MUI) = `text` (Nuxt)
- **Positioning**: `placement` (Ant Design, Chakra, HeroUI, MUI, PrimeReact) = `position` (Mantine, Nuxt)
- **Trigger**: `trigger` (Ant Design, PrimeReact) = `openOnClick` (Chakra) = `showOnFocus` (Mantine) = `disableHoverListener` (MUI)
- **Timing**: `mouseEnterDelay`/`mouseLeaveDelay` (Ant Design) = `openDelay`/`closeDelay` (Chakra, HeroUI, Mantine) = `enterDelay`/`leaveDelay` (MUI) = `showDelay`/`hideDelay` (PrimeReact)

## Pattern Inventory

### Trigger Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Hover trigger | Show on mouse hover | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native (default) |
| Focus trigger | Show on keyboard focus | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Click trigger | Show on click | 4/7 (57%) | Level 2 (Common) | Ant Design, Chakra, Mantine (disabled by default), PrimeReact | Native |
| Context menu trigger | Show on right-click | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Manual/Controlled | Programmatic open/close | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native via controlled state |
| Touch trigger | Show on touch devices | 3/7 (43%) | Level 3 (Moderate) | Mantine (disabled by default), MUI, Nuxt | Native |
| Multiple triggers | Combine hover+focus+click | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Mantine, PrimeReact | Native |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Text content | Simple string text | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Rich content/HTML | JSX, React nodes, HTML | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Dynamic content | Content updates reactively | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Multiline text | Word-wrapped content | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Icons in content | Icons alongside text | 6/7 (86%) | Level 2 (Common) | All except Ant Design has limited support | Composed |
| Keyboard shortcuts | Display kbd shortcuts | 1/7 (14%) | Level 5 (Rare) | Nuxt UI only | Native via `kbds` prop |
| Images | Image content in tooltip | 2/7 (29%) | Level 4 (Occasional) | Mantine (composed), PrimeReact (template) | Composed |

### Positioning Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| 12 placement options | Top/bottom/left/right with start/center/end | 6/7 (86%) | Level 2 (Common) | Ant Design, Chakra, HeroUI, MUI, Nuxt (partial), PrimeReact (partial) | Native |
| 5 basic placements | Top/bottom/left/right/mouse | 1/7 (14%) | Level 5 (Rare) | PrimeReact uses 5 | Native |
| Auto-adjustment/Flip | Repositions if out of viewport | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Offset control | Adjust distance from trigger | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Arrow/Pointer | Visual arrow pointing to trigger | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native (some require explicit enabling) |
| Arrow centering | Center arrow vs side alignment | 3/7 (43%) | Level 3 (Moderate) | Ant Design, Chakra, HeroUI | Native |
| Follow cursor | Tooltip tracks mouse movement | 3/7 (43%) | Level 3 (Moderate) | MUI, Nuxt (custom), PrimeReact (mouse position) | Native |
| Portal rendering | Renders outside DOM hierarchy | 6/7 (86%) | Level 2 (Common) | All except Ant Design (configurable) | Native |

### Behavior Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Auto-dismiss | Closes when interaction ends | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Open delay | Delay before showing | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Close delay | Delay before hiding | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Keyboard dismissal | ESC key closes tooltip | 6/7 (86%) | Level 2 (Common) | All except Ant Design | Native |
| Interactive content | Tooltip with clickable elements | 3/7 (43%) | Level 3 (Moderate) | Chakra, MUI (default), PrimeReact | Native |
| Controlled state | External open/close control | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Disabled state | Prevent tooltip from showing | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Z-index control | Custom stacking order | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Styling Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Color variants | Semantic or theme colors | 4/7 (57%) | Level 2 (Common) | Ant Design (presets), HeroUI, Mantine (background), Nuxt (limited) | Native |
| Custom background | Any background color | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native via CSS/props |
| Max width control | Limit tooltip width | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native or CSS |
| Custom CSS classes | Apply custom styles | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Theme integration | Uses framework theme | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Dark mode | Adapts to light/dark themes | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Animation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Fade animation | Opacity transition | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Scale animation | Size transition | 3/7 (43%) | Level 3 (Moderate) | Chakra, HeroUI, Nuxt | Native |
| Custom transitions | User-defined animations | 4/7 (57%) | Level 2 (Common) | Chakra, HeroUI, MUI, Nuxt | Native |
| Disable animations | Turn off transitions | 4/7 (57%) | Level 2 (Common) | Chakra, HeroUI, MUI, Nuxt | Native |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| ARIA role tooltip | Semantic role attribute | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| aria-describedby | Links tooltip to trigger | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Keyboard navigation | Tab to focus, ESC to close | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Screen reader support | Content announced to AT | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Focus management | Proper focus handling | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Color contrast | WCAG-compliant colors | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Hover and focus triggers
- Manual/controlled state
- Text and rich HTML content
- Dynamic reactive content
- Multiline text support
- Auto-adjustment/flip behavior
- Offset control
- Arrow/pointer display
- Auto-dismiss behavior
- Open and close delays
- Controlled state management
- Disabled state
- Z-index control
- Custom background colors
- Max width control
- Custom CSS classes
- Theme integration
- Dark mode support
- Fade animations
- Complete ARIA implementation
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

**Common Patterns (57-86% adoption):**
- 12 placement options (86%)
- Portal rendering (86%)
- Keyboard dismissal (86%)
- Icons in content (86%)
- Click trigger (57%)
- Color variants (57%)
- Custom transitions (57%)
- Disable animations (57%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-59%):**
- Touch trigger (43%)
- Multiple triggers (43%)
- Arrow centering (43%)
- Follow cursor (43%)
- Interactive content (43%)
- Scale animation (43%)

**Occasional Adoption (20-39%):**
- Images in content (29%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**
- **Ant Design**: Context menu trigger; Preset color options; Shared API with Popover/Popconfirm; Arrow centering control
- **Chakra UI**: Ark UI-based composition; Interactive mode (default on in v3); Programmatic open/close methods; Multi-part anatomy
- **HeroUI**: Framer Motion animations; Shadow depth control; Radius variants; Delay prop shortcuts
- **Mantine**: Floating UI integration; Three variants (Standard/Floating/Group); Granular event control (hover/focus/touch separate); Target prop flexibility
- **MUI**: Popper.js positioning; Interactive by default; Virtual element support; Follow cursor capability; Touch-specific delays
- **Nuxt UI**: Keyboard shortcuts display (`kbds` prop); Platform-aware shortcuts (⌘ vs Ctrl); Cursor tracking via custom ref; Global config via UApp
- **PrimeReact**: Dual-mode design (built-in vs standalone); Mouse tracking positioning; Data attribute positioning; Multi-element targeting; Template content system

## Pattern Correlations

**When Arrow exists (7/7 - universal):**
- 43% support arrow centering vs side positioning (3/7: Ant Design, Chakra, HeroUI)
- 100% allow hiding arrow
- 71% default to showing arrow (5/7), 29% require explicit enabling

**When Interactive Content exists (3/7):**
- 100% keep tooltip open when hovering over tooltip content
- 67% interactive by default (2/3: MUI), 33% require opt-in (Chakra)
- Used for tooltips with links, buttons, or rich actions

**When Follow Cursor exists (3/7):**
- Implementation varies: MUI built-in, PrimeReact mouse positioning, Nuxt custom ref
- All support offset adjustments
- Used for dynamic context or spatial awareness

**When Multiple Triggers exist (3/7):**
- Array-based config (Ant Design) vs boolean combinations (Mantine, PrimeReact)
- All support hover+focus combination
- Click trigger typically opt-in

**Portal Rendering correlation:**
- 86% render via portal (6/7)
- Ant Design configurable via `getPopupContainer`
- Ensures proper z-index stacking above other content

**Positioning system correlation:**
- 86% use 12 placements (6/7)
- All frameworks use similar naming: top, topStart, topEnd, etc.
- PrimeReact uses simplified 5-position system
- All support auto-flip/adjustment

## Implementation Notes

### API Design Patterns

**Wrapper Pattern (Universal):**
```jsx
<Tooltip label="Content">
  <button>Trigger</button>
</Tooltip>
```
All frameworks use this pattern as primary API.

**Controlled State:**
All frameworks support controlled visibility:
- Ant Design: `open` prop
- Chakra: `isOpen` prop
- HeroUI: `isOpen` prop
- Mantine: `opened` prop
- MUI: `open` prop
- Nuxt: `v-model:open`
- PrimeReact: N/A (uncontrolled only)

**Content Specification:**
1. **String prop** (most): `title`, `label`, `text`, `content`
2. **Render prop** (Ant Design): Function returning content
3. **Slot** (Nuxt): `#content` slot for Vue
4. **Template** (PrimeReact): Custom template for rich content

**Positioning APIs:**
- **Placement string**: "top", "topStart", "bottomEnd", etc.
- **Offset number/array**: Distance from trigger
- **Arrow boolean**: Show/hide pointer
- **Flip boolean**: Auto-reposition if out of viewport

### Architectural Observations

**Positioning Libraries:**
- **Floating UI** (Mantine): Modern positioning engine
- **Popper.js** (MUI): Mature positioning library
- **Ark UI** (Chakra): Headless primitive foundation
- **Reka UI** (Nuxt): Vue headless primitives
- **Custom** (Ant Design, HeroUI, PrimeReact): Framework-specific

**Rendering Strategy:**
- **Portal-based** (6/7): Render outside parent DOM
- **In-place option** (Ant Design): Via `getPopupContainer`
- **Z-index management**: High z-index for proper stacking

**Animation Philosophy:**
- Most use CSS transitions
- Chakra integrates Framer Motion
- HeroUI uses Framer Motion
- MUI uses Material-UI transitions
- Configurable in most frameworks

**Accessibility Approach:**
- All use ARIA `role="tooltip"`
- All use `aria-describedby` to link content
- Keyboard support universal (focus trigger)
- ESC to dismiss in 6/7 frameworks
- Screen reader announcements automatic

**Interactive Content Strategy:**
- **Default interactive** (MUI): Keeps tooltip open on hover
- **Opt-in interactive** (Chakra, PrimeReact): Requires prop
- **Not supported** (others): Use Popover instead

**Touch Device Handling:**
- **Long press** (most): Touch and hold to show
- **Tap** (some): Single tap shows/hides
- **Touch-specific delays** (MUI): Different timing for touch
- **Disabled by default** (Mantine): Performance consideration

## Sophisticated Design Patterns

### MUI - Interactive Tooltip with Clickable Content

**What it does**: Tooltips remain open when users hover over them (not just the trigger), allowing clicks on embedded links, buttons, or selectable text. The default behavior is `interactive={true}`, which reverses the common expectation that tooltips disappear immediately on pointer leave. This transforms tooltips from read-only overlays into temporary interactive layers that still auto-dismiss when the user's attention moves away.

**Why it's sophisticated**: This solves the fundamental tension between tooltips being "non-blocking supplementary information" and the real-world need for rich, actionable content (links, buttons, etc.). Rather than forcing users into a Popover for anything interactive, MUI recognizes that many use cases need a hybrid: mostly non-intrusive but occasionally interactive. The implementation maintains the mental model of "quick help" while enabling deeper actions without a component type change.

**Evidence of design maturity**:
- Default-on behavior (67% of frameworks make it opt-in, MUI enables by default) shows confidence in the pattern
- WCAG 2.1 criterion 1.4.13 compliance achieved by default rather than as an afterthought (interactive content support is accessibility requirement, not a nice-to-have)
- Sophisticated event management tracks both trigger and tooltip hover states independently to determine visibility, preventing premature dismissal

### Nuxt UI - Platform-Aware Keyboard Shortcut Display

**What it does**: The `kbds` prop accepts an array of key names that render as styled keyboard indicators. Unlike generic text content, this pattern is keyboard-aware: `"meta"` renders as `⌘` on macOS but as `Ctrl` on other systems. It pairs naturally with the `defineShortcuts` composable, creating a single source of truth for both the keyboard behavior and its visual hint. Example: `<UTooltip :kbds="['meta', 'S']">` displays the appropriate save shortcut symbol for the user's OS.

**Why it's sophisticated**: Most frameworks treat shortcuts as plain text content, requiring developers to handle platform detection themselves. Nuxt UI recognizes that tooltip-specific feature—keyboard shortcuts—deserves first-class support with platform awareness baked in. This isn't generic text rendering; it's a domain-specific pattern that acknowledges the component's role in teaching keyboard power-users.

**Evidence of design maturity**:
- Solves the localization/platform problem invisibly: same prop works globally without conditional rendering logic
- Tight integration with composable system means shortcut display and shortcut implementation stay synchronized
- Reflects understanding that keyboard hints are explicitly for teaching/discovery, not just passive information

### MUI - Follow Cursor with Virtual Element Positioning

**What it does**: Via the `followCursor` prop combined with virtual element support in `PopperProps`, tooltips can track the user's mouse position in real-time rather than staying anchored to the trigger element. This uses Popper.js's virtual element feature—a custom `getBoundingClientRect()` function that returns coordinates based on current mouse position. The tooltip reposition updates occur smoothly during pointer movement without requiring complex ref management from the developer.

**Why it's sophisticated**: This pattern acknowledges that some spatial information (heatmaps, charts, image annotations) requires dynamic positioning. Rather than force Popover or custom positioning logic, MUI provides a built-in pattern that works within the tooltip's existing lifecycle. It transforms a "static label" component into a "contextual probe" without changing the component's semantic meaning or default behavior.

**Evidence of design maturity**:
- Virtual element pattern is battle-tested in Popper.js but rarely exposed in component APIs; MUI's integration shows confidence
- Offset calculations respect the same positioning modifiers as static positioning, ensuring consistency
- Performance optimization implicit in the implementation (uses requestAnimationFrame-like updates under the hood, not per-pixel recalculation)

## Raw Data References

Individual framework research reports available at:
- `ai/research/tooltip/ant-design/usage-patterns.md`
- `ai/research/tooltip/chakra-ui/usage-patterns.md`
- `ai/research/tooltip/heroui/usage-patterns.md`
- `ai/research/tooltip/mantine/usage-patterns.md`
- `ai/research/tooltip/mui/usage-patterns.md`
- `ai/research/tooltip/nuxt-ui/usage-patterns.md`
- `ai/research/tooltip/primereact/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 7 UI frameworks' tooltip implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping

Radix UI and ShadCN excluded as headless/primitive libraries providing behavioral primitives without complete UI.

All findings represent actual implementations as of November 2025.

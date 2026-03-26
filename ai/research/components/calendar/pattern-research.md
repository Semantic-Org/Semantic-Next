# Component Pattern Research: Calendar / Date Picker

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 8
- Date: 2025-11-10
- Unique patterns identified: 90+
- Component type: Calendar / Date Picker for temporal data selection

## Component Definition Consensus

Across all surveyed frameworks, the Calendar / Date Picker component serves as a **temporal data input interface** that combines:

1. **Visual Calendar Display**: A grid-based month view with day cells, navigation controls, and selection indicators
2. **Input Field Integration**: Text input for keyboard entry with popup/inline calendar for visual selection
3. **Multiple Selection Modes**: Support for single dates, date ranges, and multiple dates
4. **Time Integration**: Optional time selection capabilities ranging from simple time pickers to full datetime combinations
5. **Validation & Restrictions**: Date boundaries, disabled dates/days, and custom validation logic
6. **Internationalization**: Locale-aware formatting, multiple calendar systems, and timezone handling

The mental model is consistently that of an **enhanced native date input** - providing the familiar calendar metaphor with significantly more power, customization, and consistency across browsers/platforms.

## Terminology Variations

### Component Names
- **DatePicker** (8 frameworks) - Most common term
- **Calendar** (5 frameworks) - Often used for standalone/inline variants
- **DateInput** (2 frameworks) - Input-focused variants

### Prop Names (Common Variations)
- **Selection Value**:
  - `value` (7 frameworks) - Standard controlled component pattern
  - `v-model` (1 framework - Vue) - Framework-specific reactivity
  - `selected` (2 frameworks) - Semantic alternative

- **Orientation/Direction**:
  - No direct equivalents for this component type

- **Date Format**:
  - `format` (5 frameworks) - Using date library format strings
  - `dateFormat` (3 frameworks) - More explicit
  - Auto-detected via locale (2 frameworks)

- **Date Boundaries**:
  - `minDate` / `maxDate` (7 frameworks) - Most common
  - `minValue` / `maxValue` (2 frameworks) - Value-oriented naming
  - `disablePast` / `disableFuture` (2 frameworks) - Semantic shortcuts

### Calendar System Terms
- **Gregorian** - Default across all frameworks
- **Hebrew** / **Islamic** / **Buddhist** / **Persian** / **Indian** - Supported by 3 frameworks via @internationalized/date

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Date input field | Text input with keyboard entry | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Calendar popup | Overlay/popover calendar on input focus/click | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Inline calendar | Persistent calendar display (no popup) | 7/8 (88%) | Level 1 (Universal) | Ant, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, shadcn/ui |
| Time selection | Integrated time picker with calendar | 5/8 (63%) | Level 2 (Common) | Ant, HeroUI, MUI, PrimeReact, shadcn/ui |
| Time-only mode | Time picker without date selection | 2/8 (25%) | Level 4 (Occasional) | HeroUI (via granularity), PrimeReact |
| Custom format | Date format strings (moment/dayjs/Intl) | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Calendar icon trigger | Visual button to open calendar | 6/8 (75%) | Level 2 (Common) | Ant, HeroUI, MUI, PrimeReact, Semantic UI, shadcn/ui |
| Natural language parsing | Text like "tomorrow", "next week" | 1/8 (13%) | Level 5 (Rare) | shadcn/ui |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Single date | Select one date | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Date range | Select start and end dates | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Multiple dates | Select multiple non-contiguous dates | 5/8 (63%) | Level 2 (Common) | Ant, Mantine, Nuxt UI, PrimeReact, shadcn/ui |
| Month picker | Month-level selection | 7/8 (88%) | Level 1 (Universal) | All except Semantic UI |
| Year picker | Year-level selection | 7/8 (88%) | Level 1 (Universal) | All except Semantic UI |
| Week picker | Week-based selection | 2/8 (25%) | Level 4 (Occasional) | Ant, PrimeReact (partial support) |
| Quarter picker | Quarterly selection | 1/8 (13%) | Level 5 (Rare) | Ant Design |
| DateTime selection | Combined date + time | 5/8 (63%) | Level 2 (Common) | Ant, HeroUI, MUI, PrimeReact, shadcn/ui |
| Timezone-aware | ZonedDateTime with timezone info | 3/8 (38%) | Level 4 (Occasional) | HeroUI, MUI, shadcn/ui |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Disabled | Entire component disabled | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Read-only | Prevent editing but allow viewing | 6/8 (75%) | Level 2 (Common) | Ant, HeroUI, MUI, Nuxt UI (none), PrimeReact, Semantic UI |
| Error/Invalid | Validation error state | 5/8 (63%) | Level 2 (Common) | Ant, HeroUI, MUI, PrimeReact, Semantic UI |
| Loading | Async loading indicator | 2/8 (25%) | Level 4 (Occasional) | MUI, Semantic UI (composable) |
| Clearable | Clear button to reset value | 6/8 (75%) | Level 2 (Common) | Ant, MUI, PrimeReact, Semantic UI, shadcn/ui (via field prop) |
| Required | Required field indicator | 3/8 (38%) | Level 4 (Occasional) | HeroUI, MUI, Semantic UI |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size variants | sm/md/lg size options | 7/8 (88%) | Level 1 (Universal) | All except shadcn/ui (uses CSS variables) |
| Visual variants | Different style presentations | 4/8 (50%) | Level 3 (Moderate) | Ant, HeroUI, MUI, PrimeReact |
| Date restrictions (min/max) | Boundary dates | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Disabled dates | Disable specific dates | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Disabled days | Disable days of week (e.g., weekends) | 5/8 (63%) | Level 2 (Common) | Ant, Mantine, Nuxt UI, PrimeReact, MUI |
| Locale support | Internationalization | 8/8 (100%) | Level 1 (Universal) | All frameworks |
| Custom cell rendering | Render custom date cell content | 7/8 (88%) | Level 1 (Universal) | All except Semantic UI |
| Presets/Shortcuts | Quick date selection buttons | 4/8 (50%) | Level 3 (Moderate) | Ant, Mantine, MUI, HeroUI |
| Timezone handling | Explicit timezone props | 3/8 (38%) | Level 4 (Occasional) | HeroUI, MUI, shadcn/ui |
| Multiple months display | Show 2+ consecutive months | 6/8 (75%) | Level 2 (Common) | Ant, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact |
| Month/year navigation dropdowns | Quick jump to month/year | 4/8 (50%) | Level 3 (Moderate) | HeroUI, MUI, PrimeReact, shadcn/ui |
| Alternative calendar systems | Hebrew, Islamic, Persian, etc. | 3/8 (38%) | Level 4 (Occasional) | HeroUI, Nuxt UI, shadcn/ui |
| Color variants | Color theme options | 2/8 (25%) | Level 4 (Occasional) | HeroUI, Nuxt UI |
| Touch UI mode | Mobile-optimized display | 2/8 (25%) | Level 4 (Occasional) | MUI, PrimeReact |
| Auto-close on select | Close popup after selection | 7/8 (88%) | Level 1 (Universal) | All except Mantine |

## Notable Patterns

### Highly Adopted (Level 1-2)

These patterns represent clear consensus across the ecosystem:

1. **Single Date Selection** (100%) - Universal default mode
2. **Date Range Selection** (100%) - Essential for booking/filtering scenarios
3. **Inline & Popup Modes** (100%/88%) - Flexibility in display approach
4. **Date Restrictions** (100%) - Min/max dates and disabled dates are standard
5. **Custom Formatting** (100%) - Every framework supports date format customization
6. **Locale Support** (100%) - Internationalization is universally addressed
7. **Size Variants** (88%) - Visual sizing is expected
8. **Custom Cell Rendering** (88%) - Highlighting special dates is common need
9. **Multiple Month Display** (75%) - Especially for range selection UX
10. **Auto-Close Behavior** (88%) - Expected UX for popup variants

### Emerging Patterns (Level 3-4)

These patterns show growing adoption and may become standard:

1. **Time Integration** (63%) - Combined date+time pickers increasingly common
2. **Multiple Date Selection** (63%) - Event/appointment scheduling driver
3. **Presets/Shortcuts** (50%) - UX enhancement for common selections
4. **Month/Year Dropdowns** (50%) - Quick navigation for distant dates
5. **Alternative Calendar Systems** (38%) - Growing internationalization awareness
6. **Timezone Awareness** (38%) - Critical for global applications
7. **Visual Variants** (50%) - Design system integration patterns
8. **Touch UI Mode** (25%) - Mobile-first considerations

### Unique Innovations (Level 5)

Framework-specific features that may indicate future trends:

1. **Natural Language Parsing** (shadcn/ui) - "Tomorrow", "next week" text input
2. **Quarter Picker** (Ant Design) - Business/financial reporting use case
3. **Time-Only Mode** (HeroUI, PrimeReact) - Specialized time selection
4. **Timezone Display Control** (HeroUI) - Show/hide timezone in UI
5. **Granular Time Precision** (HeroUI) - day/hour/minute/second levels
6. **Segment-Based Input** (HeroUI) - Tab between month/day/year segments
7. **Component Replacement** (Ant Design) - Deep customization via component slots
8. **Validation Behavior Modes** (HeroUI) - Native vs ARIA validation
9. **Fixed/Dynamic Week Layout** (Nuxt UI) - 4-6 weeks vs always 6 weeks
10. **Multiple Calendar Systems** (HeroUI, Nuxt UI, shadcn/ui) - Hebrew, Islamic, Buddhist, Indian calendars

## Pattern Correlations

### When Date Range exists → Multiple Months often present
- 5 of 8 frameworks with range selection show multiple months (63%)
- Design pattern: seeing both months in range improves UX

### When Time Selection exists → DateTime Combined Mode exists
- 5 of 5 frameworks with time also have datetime mode (100%)
- Never time-only without combined datetime option

### When Alternative Calendars exist → Advanced Internationalization exists
- All 3 frameworks with alt calendars also have timezone support (100%)
- Correlation: Deep i18n needs drive comprehensive temporal support

### When Custom Cell Rendering exists → Marked/Special Dates exist
- 7 of 7 frameworks with cell rendering support marked dates (100%)
- Primary use case for cell customization is date highlighting

### When Mobile Considerations exist → Touch UI or Responsive Behavior exists
- All frameworks address mobile, but 2 have explicit touchUI modes
- Pattern split: explicit mode vs automatic responsive adaptation

## Sophisticated Design Patterns

Beyond feature presence, certain patterns reveal evidence of deep user testing and non-obvious problem-solving. Here are three standout examples:

### 1. HeroUI's Segment-Based Keyboard Navigation

**What it does:** Users can Tab between month, day, and year segments within the input field, then use up/down arrows to increment/decrement each segment. For example, Tab to the month segment, press Up arrow to change from March to April, Tab to day, arrow keys adjust the day.

**Why it's sophisticated:** This solves the "date input format ambiguity" problem without requiring users to memorize format strings (is it MM/DD/YYYY or DD/MM/YYYY?). It also prevents the common UX failure of "user types 2 in the day field expecting 02 but gets rejected" by letting the component handle formatting. The segment approach is more accessible than typing—users with motor impairments find arrow keys easier than precise text entry.

**Evidence of design maturity:**
- Handles the edge case where pressing Up on December 31 correctly rolls over to January 1 of the next year (respects date validity)
- Supports both keyboard and mouse interaction on the same segments without mode confusion
- Built on React Aria's useDateField hook, indicating use of battle-tested accessibility patterns rather than custom implementation
- The feature can be disabled (`hideTimeZone={false}`) showing awareness that not all use cases need it—thoughtful restraint

### 2. MUI X's Responsive Desktop/Mobile Picker Switching

**What it does:** Uses CSS media query `@media (pointer: fine)` to automatically detect desktop (mouse/trackpad) vs mobile (touch) devices and switches between popup picker and fullscreen modal layouts without any configuration.

**Why it's sophisticated:** This goes beyond simple screen size breakpoints to detect the *input method*, which is the actual determining factor for optimal UX. A tablet might have a large screen but needs touch-optimized UI. The non-obvious insight is that popup popovers work poorly on mobile—they're hard to dismiss, block content, and have small touch targets. Fullscreen modals provide larger touch targets and clearer dismiss affordance.

**Evidence of design maturity:**
- Solves a problem many developers don't realize exists until user testing reveals touch users struggling with popovers
- Uses `pointer: fine` instead of screen width, showing understanding of modern device diversity (touch laptops, stylus tablets, etc.)
- The switch is automatic—no `mobileMode` prop to configure, preventing the "developer forgot to set mobile mode" bug
- Different components adapt differently (date picker vs time picker) based on what works best for that specific interaction pattern

### 3. Ant Design's Range-Aware disabledTime Function

**What it does:** The `disabledTime` function receives contextual information about whether it's being called for the start or end date in a range, plus the current values of both dates. This enables rules like "if start and end are same day, disable times before the start time in the end picker."

**Why it's sophisticated:** Most implementations only let you disable absolute times ("no times before 9 AM"), but this enables relative constraints based on user selections. The non-obvious problem is preventing invalid ranges: if a user picks 2:00 PM as start time, the end time picker should prevent selecting 1:00 PM on the same day. Without this context, you'd need external validation that shows errors after submission—much worse UX.

**Evidence of design maturity:**
- The API passes `{ from, type: 'start' | 'end' }` context—shows they anticipated this need through actual use cases
- Documentation includes specific example of "disable end times before start time on same day"—they observed users hitting this problem
- Works with min/max dates simultaneously—no weird interaction bugs between different constraint systems
- Falls back gracefully: if you don't need contextual logic, you can ignore the parameters and return a simple disabled hours array

## Implementation Notes

### Date Library Dependencies

Frameworks cluster into three approaches:

**1. Date Library Agnostic (Adapter Pattern)**
- MUI X: Supports Day.js, date-fns, Luxon, Moment via adapters
- Benefit: Choose your preferred date library
- Trade-off: More setup, need LocalizationProvider wrapper

**2. Specific Library Integration**
- Ant Design: dayjs/luxon (since v5.4.0)
- Mantine: dayjs exclusively
- PrimeReact: moment.js (legacy), accepts Date objects
- Semantic UI React: moment.js exclusively
- Trade-off: Less flexibility but simpler API

**3. Specialized Date Library**
- HeroUI: @internationalized/date (immutable, calendar-system aware)
- Nuxt UI: @internationalized/date
- shadcn/ui: React DayPicker (built-in date handling)
- Benefit: Type-safe, immutable, comprehensive i18n
- Trade-off: Learning curve, not standard JavaScript Date

### Architecture Patterns

**Monolithic Approach (Single Component)**
- PrimeReact: One Calendar component with mode prop
- Benefit: Centralized API, consistent behavior
- Trade-off: Larger bundle if only need subset

**Specialized Components (Component Family)**
- Semantic UI React: DateInput, TimeInput, DateTimeInput, etc.
- Benefit: Import only what you need, clear purpose
- Trade-off: More components to learn

**Composition Approach (Building Blocks)**
- shadcn/ui: Calendar primitive + Popover + Input + Button
- Benefit: Maximum flexibility, reusable patterns
- Trade-off: More assembly required

### Popup Management

**Built-in Popup**
- Ant, MUI, PrimeReact: Calendar handles popup internally
- Benefit: Consistent positioning, fewer props

**External Popup (Composition)**
- shadcn/ui: Use separate Popover component
- HeroUI: Separate DatePicker (input+calendar) vs Calendar (display)
- Benefit: Reuse popup logic, more control
- Trade-off: More composition code

### Value Management

**Controlled Only**
- Most frameworks: Require value + onChange pattern
- React standard pattern

**Controlled + Uncontrolled**
- Some frameworks: Support defaultValue for uncontrolled mode
- Nuxt UI: Both v-model and :default-value

### Validation Patterns

**Built-in Validation**
- Min/max dates (universal)
- Disabled dates/days (universal)
- Custom predicate functions (7/8 frameworks)

**External Validation**
- Error state prop (5/8 frameworks)
- Form library integration (most frameworks)
- Custom validation callbacks

## Raw Data

Individual framework reports available at:
- `ai/research/calendar/ant-design/usage-patterns.md`
- `ai/research/calendar/heroui/usage-patterns.md`
- `ai/research/calendar/mantine/usage-patterns.md`
- `ai/research/calendar/mui/usage-patterns.md`
- `ai/research/calendar/nuxt-ui/usage-patterns.md`
- `ai/research/calendar/primereact/usage-patterns.md`
- `ai/research/calendar/semantic-ui-react/usage-patterns.md`
- `ai/research/calendar/shadcn-ui/usage-patterns.md`

## Framework-Specific Highlights

### Ant Design
- **Strengths**: Comprehensive feature set, multiple date libraries, mask input format
- **Unique**: Quarter picker, component replacement system, week picker with display
- **Architecture**: Enterprise-focused with extensive native props

### HeroUI (NextUI)
- **Strengths**: Best-in-class internationalization, timezone support, calendar systems
- **Unique**: Segment-based keyboard navigation, granular time precision, Hebrew/Islamic/Buddhist calendars
- **Architecture**: Built on React Aria + @internationalized/date for robust i18n

### Mantine
- **Strengths**: Clean API, inline-first design, three selection modes
- **Unique**: Inline calendar (not popup), multi-column layout, preset support
- **Limitations**: No built-in popup (separate DatePickerInput), no time selection

### MUI X
- **Strengths**: Date library flexibility, comprehensive validation, responsive behavior
- **Unique**: Multiple adapter support, action bar customization, slots/slotProps system
- **Architecture**: Professional features, TypeScript-first, extensive customization

### Nuxt UI
- **Strengths**: @internationalized/date integration, compositional design, three selection modes
- **Unique**: Fixed vs dynamic week layout, external controls, calendar systems support
- **Architecture**: Vue-native with v-model, library-first approach

### PrimeReact
- **Strengths**: Feature-complete, multiple selection modes in one component, time integration
- **Unique**: TouchUI mode, time-only mode, template customization system
- **Architecture**: Mature component with years of refinement, extensive ARIA support

### Semantic UI React (Third-Party)
- **Strengths**: CSS-free architecture, multiple specialized components, moment.js integration
- **Unique**: Six component types (DateInput, TimeInput, etc.), marked dates, animation system
- **Limitations**: Archived package (no longer maintained), moment.js dependency

### shadcn/ui
- **Strengths**: Minimal abstraction, TypeScript-first, composition patterns
- **Unique**: Natural language parsing, React DayPicker wrapper, Persian calendar support
- **Architecture**: Building block approach, requires assembly, no built-in form integration

## Key Takeaways

### Universal Requirements
Every framework provides:
1. Single date and range selection
2. Popup and/or inline display modes
3. Date restrictions (min/max, disabled)
4. Locale/format customization
5. Size variations
6. Keyboard and mouse interaction

### Differentiation Points
Frameworks distinguish themselves through:
1. **Date Library Choice**: Adapter vs specific library vs specialized library
2. **Component Architecture**: Monolithic vs specialized vs composition
3. **Internationalization Depth**: Basic locale vs calendar systems vs full timezone
4. **Time Integration**: Separate vs integrated vs datetime vs time-only
5. **Mobile Strategy**: Responsive vs touch mode vs mobile-specific
6. **Customization Approach**: Props vs templates vs slots vs composition

### Design Decisions for New Implementations

When building a calendar/date picker, critical decisions include:

1. **Date Library**: Standard Date API, moment/dayjs, or specialized library?
2. **Component Count**: One component vs multiple specialized components?
3. **Popup Strategy**: Built-in vs compositional?
4. **Time Handling**: Integrated, separate, or none?
5. **Value Type**: Date objects, strings, or library-specific types?
6. **Selection Modes**: How many? (single/range/multiple)
7. **I18n Approach**: Locale-only or full calendar system support?
8. **Mobile Strategy**: Responsive or explicit touch mode?
9. **Customization**: Props, slots, templates, or composition?
10. **Validation**: Built-in or external?

The research shows no single "correct" approach - successful frameworks make different trade-offs based on their target use cases and architectural philosophy.

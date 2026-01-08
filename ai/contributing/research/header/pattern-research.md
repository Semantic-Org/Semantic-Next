# Component Pattern Research: Header/Navbar/AppBar

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 6
- Date: 2025-11-05
- Unique patterns identified: 40+
- Research coverage: Ant Design (Layout.Header), MUI (AppBar), Mantine (AppShell.Header), Semantic UI Classic (Header), Vuetify (v-app-bar), Chakra UI (no dedicated component)

## Component Definition Consensus

Header/Navbar/AppBar components solve the fundamental problem of **providing consistent top-level navigation and branding across an application**. They provide:

- **Brand identity** through logos and application titles
- **Primary navigation** with menus and links
- **User context** via profile menus and authentication controls
- **Global actions** like search, notifications, and settings
- **Visual hierarchy** establishing the top of the page structure

**Mental Models:**
- **Application Chrome** (MUI, Vuetify): Part of the application frame, distinct from content
- **Layout Component** (Ant Design, Mantine): Structural element coordinating with sidebar/content
- **Page Header** (Semantic UI): Content-level heading and section organization
- **Composition** (Chakra UI): Built from primitives rather than dedicated component

**Universal Characteristics (where applicable):**
- Positioned at top of viewport/page
- Contains navigation and branding
- Often fixed or sticky for persistent access
- Coordinates with page layout system
- Responsive behavior for mobile

## Terminology Variations

### Component Names
- **AppBar**: MUI (Material Design terminology)
- **v-app-bar**: Vuetify (Vue Material Design)
- **Layout.Header**: Ant Design (part of Layout system)
- **AppShell.Header**: Mantine (part of AppShell layout)
- **Header**: Semantic UI Classic (element-level component)
- **No Component**: Chakra UI (compose with Box/Flex)

### Positioning Terms
- **fixed**: Stays in viewport (5/5 frameworks with components)
- **sticky**: Sticks after scroll threshold (4/5)
- **static/relative**: Normal document flow (5/5)
- **absolute**: Positioned relative to container (3/5)

## Pattern Inventory

### Positioning Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Fixed positioning | Header stays at top | 5/5 (100%) | Level 1 | Ant, MUI, Mantine, Vuetify, Semantic |
| Sticky positioning | Sticks after scroll | 4/5 (80%) | Level 1 | MUI, Mantine, Vuetify, Semantic |
| Static positioning | Normal document flow | 5/5 (100%) | Level 1 | All with components |
| Absolute positioning | Container-relative | 3/5 (60%) | Level 2 | MUI, Vuetify, Mantine |
| Layout-integrated | Part of layout system | 3/5 (60%) | Level 2 | Ant, Mantine, Vuetify |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Logo/branding | Brand identity | 5/5 (100%) | Level 1 | All with components |
| Navigation links | Primary nav menu | 5/5 (100%) | Level 1 | All with components |
| User menu | Profile/account dropdown | 4/5 (80%) | Level 1 | Ant, MUI, Vuetify, Mantine |
| Search bar | Global search | 4/5 (80%) | Level 1 | Ant, MUI, Vuetify, Mantine |
| Action buttons | CTAs, notifications | 5/5 (100%) | Level 1 | All with components |
| Icons | Icon navigation | 5/5 (100%) | Level 1 | All with components |
| Titles/headings | Page/section titles | 5/5 (100%) | Level 1 | All (Semantic focused on this) |

### Visual Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Background colors | Theme/custom colors | 5/5 (100%) | Level 1 | All with components |
| Elevation/shadows | Depth indication | 4/5 (80%) | Level 1 | MUI, Vuetify, Ant, Mantine |
| Transparent background | Overlay style | 3/5 (60%) | Level 2 | MUI, Vuetify, custom |
| Gradient backgrounds | Visual interest | 2/5 (40%) | Level 3 | MUI, Ant (custom) |
| Borders | Bottom borders | 3/5 (60%) | Level 2 | Mantine, Semantic, Ant |
| Custom styling | Full CSS control | 5/5 (100%) | Level 1 | All |

### Height & Sizing Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Fixed height | Static height value | 5/5 (100%) | Level 1 | All with components |
| Responsive height | Height per breakpoint | 3/5 (60%) | Level 2 | Ant, Mantine, Vuetify |
| Dense mode | Compact 48px height | 3/5 (60%) | Level 2 | MUI, Vuetify, Ant |
| Prominent mode | Extended 128px height | 1/5 (20%) | Level 4 | Vuetify |
| Auto height | Content-based | 2/5 (40%) | Level 3 | Semantic, custom |

### Scroll Behavior Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Hide on scroll | Header disappears | 3/5 (60%) | Level 2 | MUI, Vuetify, Mantine |
| Elevate on scroll | Shadow appears | 3/5 (60%) | Level 2 | MUI, Vuetify, custom |
| Collapse on scroll | Height reduces | 1/5 (20%) | Level 4 | Vuetify |
| Static (no behavior) | Always visible | 5/5 (100%) | Level 1 | All (default) |
| Scroll target | Custom scroll container | 2/5 (40%) | Level 3 | MUI, Vuetify |

### Responsive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Mobile hamburger menu | Drawer navigation | 4/5 (80%) | Level 1 | Ant, MUI, Vuetify, Mantine |
| Responsive padding | Padding per breakpoint | 4/5 (80%) | Level 1 | Ant, MUI, Mantine, Vuetify |
| Responsive height | Height per breakpoint | 3/5 (60%) | Level 2 | Ant, Mantine, Vuetify |
| Hidden on mobile | Desktop-only header | 2/5 (40%) | Level 3 | Custom implementations |
| Adaptive content | Content changes | 5/5 (100%) | Level 1 | All with components |

### Layout Coordination Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Content offset | Push content down | 4/5 (80%) | Level 1 | Ant, Mantine, Vuetify, MUI |
| Overlay mode | Header above content | 3/5 (60%) | Level 2 | Mantine, Vuetify, MUI |
| Sidebar coordination | Works with sidebars | 3/5 (60%) | Level 2 | Ant, Mantine, Vuetify |
| Z-index management | Layering control | 5/5 (100%) | Level 1 | All with components |
| AppShell integration | Layout system | 2/5 (40%) | Level 3 | Ant, Mantine |

## Notable Patterns

### Universal Patterns (100%)
- Fixed/static positioning
- Logo and navigation content
- Background color theming
- Fixed height control
- Z-index management
- Semantic HTML
- Custom styling support

### Highly Adopted (80%)
- Sticky positioning
- User menus
- Search bars
- Elevation/shadows
- Mobile hamburger menus
- Responsive padding
- Content offset

### Emerging Patterns (60%)
- Absolute positioning
- Layout integration
- Transparent backgrounds
- Borders
- Responsive height
- Dense mode
- Hide/elevate on scroll
- Sidebar coordination
- Overlay mode

## Implementation Notes

### Two Distinct Header Paradigms

**Navigation Headers (4/5):**
- Application navigation and chrome
- Fixed/sticky positioning
- Logo, navigation, user controls
- Frameworks: Ant, MUI, Vuetify, Mantine

**Content Headers (1/5):**
- Content organization and hierarchy
- Static positioning
- Section titles, icons, dividers
- Framework: Semantic UI

### Positioning Strategies

**Fixed:**
```css
position: fixed; top: 0; left: 0; right: 0;
```
- Always visible
- Requires content offset

**Sticky:**
```css
position: sticky; top: 0;
```
- Sticks on scroll
- No offset needed

**Layout-Integrated:**
- Framework manages offsets
- Coordinates with sidebar/footer

### Scroll Behaviors

**Hide on Scroll:**
- Transform: translateY(-100%)
- Smooth transitions
- MUI useScrollTrigger

**Elevate on Scroll:**
- Add shadow when scrolled
- Visual feedback
- Common threshold: 10-50px

**Collapse:**
- Reduce height on scroll
- Vuetify prominent mode

## Accessibility

### Semantic HTML
```html
<header role="banner">
  <nav role="navigation" aria-label="Main">
```

### Skip Links
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trap in mobile menus

## Sophisticated Design Patterns

### Semantic UI Classic - Dual-Context Header System

**What it does**: Headers that adapt between two independent sizing contexts: fixed page hierarchy (h1-h5 scale relative to document base) and flexible content headers (sizes relative to surrounding text context). A single component type with two completely different mental models, enabling headers to work simultaneously as document outline anchors and context-relative emphasis elements without requiring different DOM structures.

**Why it's sophisticated**: This solves a fundamental problem exclusive to headers—the need to establish page hierarchy while simultaneously providing flexible scaling for use within any content container. Most frameworks force a choice: either structured hierarchy (with fixed semantic meaning) OR flexible sizing (sacrificing semantic meaning). Semantic UI's dual context approach allows both simultaneously. The implementation requires careful CSS design with two distinct sizing systems (absolute `rem` units for page headers, relative `em` units for content headers) that can coexist seamlessly.

**Evidence of design maturity**:
- Handles the edge case of maintaining semantic meaning (h1-h5) while supporting relative sizing (em-based scaling)
- Icon headers add a third pattern for visual-first content that requires special positioning and layout of both icon and text
- Sub-headers as contextual second-line metadata (timestamps, authors, status) enable rich information architecture without structural complexity
- Combinable modifiers (large + dividing + icon) demonstrate careful API design that prevents combinatorial explosion while enabling complex real-world patterns

### Mantine - Layout-Coordinated Offset System

**What it does**: Headers don't exist independently—they're part of AppShell's coordinated layout system. The `offset` property creates two distinct spatial patterns: traditional (content below header) and overlay (content behind header). Configuration is declarative at the parent AppShell level, not imperative on the Header component itself, enabling dynamic layout changes without imperative DOM manipulation. Responsive heights per breakpoint cascade from AppShell configuration, automatically adjusting content spacing as header height changes.

**Why it's sophisticated**: This solves a non-obvious header-specific problem: the layout system must stay synchronized with header height changes across responsive breakpoints without duplicating configuration or causing layout shifts. Mantine's solution inverts the typical component ownership—the Header doesn't configure itself; the AppShell coordinator manages all spatial relationships. This prevents the common bug pattern where responsive header heights cause content layout breaks. The two offset modes (traditional vs overlay) enable fundamentally different interaction patterns (hide-on-scroll, full-bleed content) from a single component, requiring deep understanding of how fixed positioning interacts with scrollable content.

**Evidence of design maturity**:
- Automatic z-index stacking prevents modal/drawer layering bugs without developer intervention
- Border control via `withBorder` prop enables seamless header transitions (removing border when gradient/color continues) or visual separation when needed
- Integration with `useHeadroom` hook for scroll-aware hiding demonstrates understanding that modern headers need reactive scroll behavior without imposing it
- Dynamic height awareness (content must flex when header height changes per breakpoint) prevents a class of responsive design bugs

### MUI - Material Design Elevation System with Scroll-Aware Reactivity

**What it does**: Headers use Material Design's elevation system (shadow depth 0-24) to establish visual hierarchy independently of z-index concerns. The `useScrollTrigger` hook enables scroll-aware elevation changes and conditional hiding without manual scroll event listeners. Toolbar as a distinct component enables flexible layout patterns (multi-row, dense mode, custom spacing) that adapt content density based on the header's role. Position prop supports five distinct positioning modes (static, fixed, sticky, relative, absolute) enabling headers to work in fundamentally different layout contexts.

**Why it's sophisticated**: This solves multiple header-specific problems that only exist in application contexts: (1) visual hierarchy through elevation without hardcoded z-index values creates themeable, composable solutions; (2) scroll-dependent behavior (hiding on scroll, elevating for depth cues) requires efficient scroll event handling that Material Design abstracts through hooks; (3) Toolbar separation enables layout flexibility that a monolithic component can't achieve. The elevation system is non-obvious—it's not just shadow; it's a complete visual language where shadow depth communicates container hierarchy, stacking context, and interaction state.

**Evidence of design maturity**:
- Material Design elevation scale (0-24) demonstrates understanding that shadows communicate layering semantics, not just aesthetics
- `useScrollTrigger` hook provides efficient scroll-dependent styling without scroll event performance penalties or imperative DOM manipulation
- Toolbar's `variant="dense"` (48px) vs regular (64px) vs custom heights enable responsive content density changes without separate component instances
- Integration with Drawer component through positioning and z-index coordination shows header maturity within larger layout systems
- Color theming (`enableColorOnDark`) handles the specific problem of header visibility in dark mode contexts

---

## Framework Recommendations

**For Application Navigation:**
- MUI: Comprehensive Material Design
- Vuetify: Rich scroll behaviors
- Ant: Strong layout integration

**For Layout Systems:**
- Mantine: Best coordination (AppShell)
- Ant: Mature Layout component

**For Content Organization:**
- Semantic UI: Content-focused headers

**For Scroll Behaviors:**
- Vuetify: Most options
- MUI: useScrollTrigger hook

## Raw Data References

Individual framework research reports available at:
- `ai/research/header/ant-design/usage-patterns.md`
- `ai/research/header/mui/usage-patterns.md`
- `ai/research/header/mantine/usage-patterns.md`
- `ai/research/header/semantic-ui-classic/usage-patterns.md`
- `ai/research/header/vuetify/usage-patterns.md`
- `ai/research/header/chakra-ui/no-component.md`

## Research Methodology

All research conducted on 2025-11-05 through parallel subagent research, direct documentation access, and cross-framework pattern analysis.

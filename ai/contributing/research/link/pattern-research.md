# Component Pattern Research: Link

> Last Modified: 2025-11-10 (Updated with Sophisticated Design Patterns section)

## Research Summary
- Frameworks surveyed: 6
- Date: 2025-11-06
- Unique patterns identified: 35+
- Terminology note: Most frameworks call this "Link", Mantine calls it "Anchor", Semantic UI treats it as part of List element

## Component Definition Consensus

Link components provide styled, accessible anchor elements for navigation. All frameworks conceptualize this as:

**Core Purpose**: Enable users to navigate between pages, sections, or external resources with consistent styling and behavior.

**Mental Model**: An enhanced HTML anchor tag (`<a>`) that:
- Integrates with client-side routers for SPA navigation
- Provides visual feedback for interaction states
- Maintains semantic HTML for accessibility
- Applies framework design system styling

**Common Use Cases** (documented across frameworks):
- Navigation menus (header, sidebar, footer)
- In-content hyperlinks within paragraphs
- Breadcrumb navigation
- External resource references
- Skip links for accessibility
- Call-to-action links styled as buttons

## Terminology Variations

### Component Names
- **"Link"** - 5 frameworks (Chakra UI, HeroUI, MUI, Nuxt UI, Semantic UI)
- **"Anchor"** - 1 framework (Mantine)

### Semantic HTML
- All frameworks render as `<a>` element (standard anchor tag)
- Nuxt UI uniquely renders as `<button>` when no navigation target provided

### API Naming Conventions
- **Navigation target**: `href` (4), `to` (2 - Vue-based)
- **External links**: `isExternal` (3), `external` (1), manual `target="_blank"` (2)
- **Router integration**: `as` prop (3), `component` prop (2), native (1 - Nuxt)
- **Active state**: `activeClass` (2 - Vue), CSS/theme (4)

## Pattern Inventory

### Navigation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Internal navigation | Standard same-origin navigation | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| External navigation | Links to external domains | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Router integration | Client-side router support | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Hash links | Same-page anchor navigation | 6/6 (100%) | **Level 1 (Universal)** | All frameworks (native `<a>` behavior) |
| Download links | File download triggers | 5/6 (83%) | **Level 1 (Universal)** | All except Semantic UI (CSS-only) |
| New window/tab | Open in new context | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |

### Router Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Polymorphic component | `as`/`component` prop pattern | 4/6 (67%) | **Level 2 (Common)** | Chakra UI, HeroUI, Mantine, MUI |
| Native router integration | Built-in framework router support | 1/6 (17%) | **Level 5 (Rare)** | Nuxt UI (Vue Router) |
| Manual composition | Developer wraps router component | 1/6 (17%) | **Level 5 (Rare)** | Semantic UI |

### Security Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Auto-security attributes | Automatic `rel="noopener noreferrer"` | 4/6 (67%) | **Level 2 (Common)** | Chakra UI, HeroUI, MUI, Nuxt UI |
| isExternal prop | Dedicated external link prop | 3/6 (50%) | **Level 3 (Moderate)** | Chakra UI, HeroUI, Nuxt UI |
| Manual security | Developer adds rel attributes | 2/6 (33%) | **Level 4 (Occasional)** | Mantine, Semantic UI |

### Visual Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Underline control | Toggle/customize underline display | 5/6 (83%) | **Level 1 (Universal)** | All except Semantic UI |
| Color customization | Theme-based color options | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Hover effects | Visual feedback on hover | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Active state | Visual indication of current page | 5/6 (83%) | **Level 1 (Universal)** | All except Mantine |
| Focus indicators | Keyboard focus styling | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Visited state | Browser visited link styling | 6/6 (100%) | **Level 1 (Universal)** | All frameworks (CSS-only) |

### Underline Pattern Details

| Framework | Underline Options | Default |
|-----------|------------------|---------|
| Chakra UI | Native prop, customizable offset | 3px underline offset |
| HeroUI | 5 modes: none, hover, always, active, focus | none |
| Mantine | 4 modes: always, hover, never, not-hover | - |
| MUI | 3 modes: always, hover, none | always |
| Nuxt UI | Default styling | Present |
| Semantic UI | CSS-only | None (CSS-only) |

**Notable**: HeroUI's 5-mode system is most granular; Mantine's "not-hover" is unique

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Active route detection | Auto-detect current page | 2/6 (33%) | **Level 4 (Occasional)** | Nuxt UI, Semantic UI (.active class) |
| Custom active classes | Developer-defined active styles | 2/6 (33%) | **Level 4 (Occasional)** | Nuxt UI, Semantic UI |
| Disabled state | Prevent link interaction | 2/6 (33%) | **Level 4 (Occasional)** | HeroUI, Nuxt UI |
| onClick handlers | Custom click handling | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Semantic HTML | Renders as `<a>` element | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| ARIA attribute support | aria-label, aria-describedby, etc. | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Keyboard navigation | Tab, Enter key support | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Screen reader support | Proper announcements | 6/6 (100%) | **Level 1 (Universal)** | All frameworks |
| Focus-visible | Modern focus indicators | 3/6 (50%) | **Level 3 (Moderate)** | Chakra UI, MUI, HeroUI |
| ARIA current attribute | Mark current page | 1/6 (17%) | **Level 5 (Rare)** | Nuxt UI |

### Advanced Features

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Gradient styling | Color gradient text | 1/6 (17%) | **Level 5 (Rare)** | Mantine (Text inheritance) |
| Block mode | Block-level rendering | 1/6 (17%) | **Level 5 (Rare)** | HeroUI |
| External link icon | Automatic icon display | 1/6 (17%) | **Level 5 (Rare)** | HeroUI |
| Prefetching | Route/asset prefetching | 1/6 (17%) | **Level 5 (Rare)** | Nuxt UI |
| View Transitions API | Modern page transitions | 1/6 (17%) | **Level 5 (Rare)** | Nuxt UI |
| Skip link pattern | Accessibility skip navigation | 1/6 (17%) | **Level 5 (Rare)** | MUI (documented) |
| Download attribute | Custom filename on download | 2/6 (33%) | **Level 4 (Occasional)** | HeroUI, Nuxt UI (explicit) |
| Rel attribute control | nofollow, sponsored, etc. | 5/6 (83%) | **Level 1 (Universal)** | All except Semantic UI (CSS-only) |
| Custom hook | Headless link logic | 1/6 (17%) | **Level 5 (Rare)** | HeroUI (useLink) |

### Framework-Specific Architectural Patterns

| Pattern | Description | Prevalence | Frameworks |
|---------|-------------|------------|------------|
| Typography inheritance | Link extends Text/Typography | 2/6 (33%) | Mantine, MUI |
| Chakra Factory | Wrap third-party with theming | 1/6 (17%) | Chakra UI |
| React Aria foundation | Built on React Aria hooks | 1/6 (17%) | HeroUI |
| List integration | Link as list element variant | 1/6 (17%) | Semantic UI |
| Dual element rendering | `<a>` or `<button>` based on props | 1/6 (17%) | Nuxt UI |

## Notable Patterns

### Highly Adopted (Level 1) - Industry Standards

These patterns represent universal expectations:

**Universal Patterns (100%)**:
- Internal and external navigation
- Router integration support
- Hash link navigation
- New window/tab opening
- Color customization
- Hover effects
- Focus indicators
- Semantic HTML (`<a>` element)
- ARIA attribute support
- Keyboard navigation
- Screen reader support
- onClick handlers

**Near-Universal (80-100%)**:
- Download links: 83%
- Underline control: 83%
- Active state styling: 83%
- Rel attribute control: 83%

These patterns are **essential** for any link component.

### Emerging Patterns (Level 2-3) - Growing Adoption

**Common Patterns (60-79%)**:
- Polymorphic component (as/component prop): 67%
- Automatic security attributes: 67%

**Moderate Patterns (40-59%)**:
- isExternal prop pattern: 50%
- Focus-visible implementation: 50%

These patterns indicate **evolving best practices** in the ecosystem.

### Unique Innovations (Level 4-5) - Framework-Specific

**Occasional Patterns (20-39%)**:
- Active route detection: 33%
- Custom active classes: 33%
- Disabled state: 33%
- Manual security approach: 33%
- Typography inheritance: 33%
- Download filename control: 33%

**Rare Patterns (<20%)**:
- Gradient styling (Mantine's Text inheritance)
- Block mode rendering (HeroUI)
- External link icon automation (HeroUI)
- Route prefetching (Nuxt UI)
- View Transitions API (Nuxt UI)
- Skip link pattern documentation (MUI)
- ARIA current attribute (Nuxt UI)
- Custom hook (HeroUI useLink)
- Chakra Factory pattern
- React Aria foundation
- List integration pattern (Semantic UI)
- Dual element rendering (Nuxt UI)

### Sophisticated Design Patterns

Beyond feature presence, these patterns show evidence of deep user testing or non-obvious problem-solving:

#### 1. Automatic Security Attributes (Chakra UI, HeroUI, MUI, Nuxt UI)

**What it does:**
When a link opens in a new window/tab (via `target="_blank"` or `isExternal` prop), these frameworks automatically add `rel="noopener noreferrer"` to the rendered anchor tag without developer intervention.

**Why it's sophisticated:**
This prevents the "tabnabbing" security vulnerability - where a malicious external site can use `window.opener` to redirect the original page to a phishing site. Most developers are unaware of this attack vector, and even those who know about it frequently forget to add the `rel` attribute. By making security automatic, these frameworks eliminate an entire class of vulnerabilities.

**Evidence of design maturity:**
- Solves a security problem invisible to most developers
- Prevents mistakes rather than requiring correct implementation
- 4/6 frameworks (67%) converged on this pattern independently - strong signal of real-world pain points
- The pattern is "pit of success" design - secure by default, opt-out if needed
- Shows awareness that developer memory is unreliable for security-critical details
- Similar to how modern browsers now require HTTPS for certain APIs - make the safe path the default path

#### 2. Nuxt UI's Dual Element Rendering (`<a>` vs `<button>`)

**What it does:**
Nuxt UI's Link component renders as `<a>` when an `href`/`to` prop is provided (navigation), but automatically renders as `<button>` when no navigation target is given. This happens transparently while maintaining the same visual styling and API surface.

**Why it's sophisticated:**
This enforces semantic HTML correctness - the component understands that buttons are for actions and anchors are for navigation. Most frameworks just always render as `<a>`, which creates accessibility issues when developers misuse links for actions (resulting in broken keyboard navigation and confused screen readers). By switching elements based on actual behavior, Nuxt UI prevents misuse at the framework level.

**Evidence of design maturity:**
- Requires deep understanding of HTML semantics and accessibility implications
- Prevents a common anti-pattern (clickable `<a>` without `href`) that plagues the web
- Shows awareness of screen reader user experience - buttons and links announce differently
- The fact that styling remains consistent across both elements shows architectural sophistication
- This is the kind of refinement that comes from accessibility testing with actual assistive technology users
- Trades implementation complexity for better end-user experience

#### 3. HeroUI's 5-Mode Underline System

**What it does:**
HeroUI provides 5 distinct underline modes: `none` (never), `hover` (on hover only), `always` (constant), `active` (when link is current page), and `focus` (on keyboard focus only). Most frameworks only provide 2-3 modes (always/hover/none).

**Why it's sophisticated:**
This shows understanding that links appear in wildly different contexts with different UX needs. Navigation menus benefit from hover-only (cleaner look). In-content links need always (scan-ability, accessibility). Button-styled links want none. The `active` mode specifically addresses navigation menus needing current-page indication. The `focus` mode serves keyboard users who need focus indicators but designers who want minimal visual chrome. Five modes is not arbitrary - each solves a specific real-world design constraint.

**Evidence of design maturity:**
- Goes beyond the minimum viable options most frameworks settle on
- The `active` mode shows awareness of navigation menu use cases specifically
- The `focus` mode balances accessibility requirements with design aesthetics
- Each mode maps to a legitimate design context, not just "more options = better"
- The granularity suggests feedback from designers working across multiple link contexts
- Contrast with Mantine's unique "not-hover" mode (underline disappears on hover) - shows different teams discovering edge cases through real usage

## Pattern Correlations

### Strong Correlations

**When Feature X Exists → Feature Y is Present**:
- **Polymorphic component** → Manual security attributes (4/4 = 100%)
- **isExternal prop** → Auto-security attributes (3/3 = 100%)
- **Vue framework** → to prop instead of href (2/2 = 100%)
- **React framework** → href prop (4/4 = 100%)
- **Underline control** → Multiple underline modes (5/5 = 100%)

**Notable Patterns**:
- Frameworks with auto-security ALL have isExternal prop or equivalent
- All Vue-based frameworks use `to` prop; all React use `href`
- Typography inheritance correlates with comprehensive styling systems

### Architectural Pattern Families

**Family 1: Enhanced Anchor (4 frameworks)**
- Chakra UI, HeroUI, MUI, Mantine
- Characteristics: Styled anchor with router integration, security features, theme system
- Best for: General-purpose React applications

**Family 2: Router-Native (1 framework)**
- Nuxt UI
- Characteristics: Deep router integration, Vue-specific patterns, advanced navigation features
- Best for: Vue/Nuxt applications

**Family 3: Presentational (1 framework)**
- Semantic UI
- Characteristics: CSS-only styling, no JavaScript, list-based pattern
- Best for: Server-rendered applications, framework-agnostic needs

### Router Integration Approaches

**Polymorphic Component Pattern** (4 frameworks):
- Chakra UI, HeroUI, Mantine, MUI
- Uses `as` or `component` prop to substitute router component
- TypeScript-safe component substitution

**Native Integration** (1 framework):
- Nuxt UI
- Built specifically for Vue Router
- No abstraction layer needed

**Manual Integration** (1 framework):
- Semantic UI
- Developer wraps or composes with router
- Maximum flexibility, minimal opinions

## Implementation Notes

### Minimal API

Most frameworks support a minimal usage like:
```jsx
<Link href="/page">Text</Link>
// or Vue:
<Link to="/page">Text</Link>
```

### Standard API

Common optional props across frameworks:
```jsx
<Link
  href="/page"           // Navigation target
  target="_blank"        // New window
  rel="nofollow"         // Link relationship
  onClick={handler}      // Click handler
  aria-label="description"  // Accessibility
/>
```

### Enhanced API

Frameworks with rich features:
```jsx
<Link
  // Navigation
  href="/page"
  isExternal              // External link flag

  // Visual
  underline="hover"       // Underline control
  color="primary"         // Color theme

  // Router (React)
  as={NextLink}           // Polymorphic rendering

  // Router (Vue)
  to="/page"
  exact                   // Exact route matching
  activeClass="active"    // Active route styling

  // Advanced
  prefetch                // Route prefetching
  disabled                // Disable interaction
/>
```

### Security Best Practices

**Automatic Security** (4 frameworks):
```jsx
// Chakra UI, HeroUI, MUI, Nuxt UI
<Link isExternal href="https://example.com">
  External Site
</Link>
// Automatically adds: rel="noopener noreferrer"
```

**Manual Security** (2 frameworks):
```jsx
// Mantine, Semantic UI
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Site
</Link>
```

## Framework-Specific Highlights

### Chakra UI
- **Composition-first**: `as` prop pattern for universal router integration
- **Chakra Factory**: Advanced pattern for wrapping third-party components
- **Box inheritance**: Full access to styling system
- **Focus-visible**: Modern keyboard focus indicators

### HeroUI/NextUI
- **Most granular underline**: 5 modes (none, hover, always, active, focus)
- **React Aria foundation**: Enterprise-grade accessibility
- **Block mode**: Transform to block-level hover area
- **External icon**: Automatic external link iconography
- **useLink hook**: Headless link logic for custom implementations

### Mantine
- **Text component inheritance**: Full typography system access
- **Unique "not-hover"**: Underline disappears on hover
- **Gradient support**: Color gradient text styling
- **Theme-level config**: Global Anchor defaults via `Anchor.extend()`
- **Polymorphic**: Component prop for router integration

### MUI
- **Material Design**: Strict Material Design compliance
- **Skip link pattern**: Accessibility documentation
- **Typography composition**: Seamless inline link integration
- **Auto-security**: Automatic noopener/noreferrer with target="_blank"
- **IBM Plex Sans**: Custom font stack

### Nuxt UI
- **Most advanced router integration**: Native Vue Router features
- **Prefetching**: Route and payload prefetching
- **View Transitions API**: Modern page transition support
- **Dual rendering**: `<a>` or `<button>` based on context
- **Granular matching**: exact, exactQuery, exactHash props
- **ARIA current**: Proper current page indication

### Semantic UI
- **CSS-first philosophy**: No JavaScript required
- **List integration**: Part of List element system
- **Dual pattern**: Link type and link content variations
- **Composable**: Works with list modifiers (horizontal, divided, bulleted)
- **Active class**: Manual current page indication

## Recommendations for Semantic UI Next

Based on this research, evidence-based recommendations:

### Core Features (Level 1 - Must Have)
Universal patterns (80%+):
- ✅ Standard href/to prop for navigation
- ✅ Router integration support (polymorphic or native)
- ✅ Internal and external navigation
- ✅ Hash link support
- ✅ New window/tab support (target prop)
- ✅ Download link support
- ✅ Underline control with multiple modes
- ✅ Color customization via theme
- ✅ Hover effects
- ✅ Active state indication
- ✅ Focus indicators (prefer focus-visible)
- ✅ Semantic HTML (`<a>` element)
- ✅ Full ARIA attribute support
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ onClick handler support
- ✅ Rel attribute support

### Standard Features (Level 2-3 - Should Have)
Common patterns (50-79%):
- ✅ Polymorphic component pattern (as/component prop)
- ✅ Automatic security attributes for external links
- ✅ isExternal prop or equivalent
- ✅ Focus-visible implementation

### Optional Features (Level 4 - Nice to Have)
Occasional patterns (20-49%):
- ⚠️ Active route detection (useful for navigation menus)
- ⚠️ Custom active class prop
- ⚠️ Disabled state (occasional need)
- ⚠️ Typography inheritance (if applicable to design system)

### Advanced Features (Level 5 - Evaluate Need)
Rare patterns (<20%):
- ❓ Block mode rendering (HeroUI innovation)
- ❓ External link icon automation
- ❓ Prefetching (framework-specific, complex)
- ❓ View Transitions API (cutting-edge, limited browser support)
- ❓ Custom hook (advanced use case)
- ❓ Gradient styling (design system dependent)

### Not Recommended
Patterns that are framework-specific or incompatible:
- ❌ List integration (Semantic UI Classic pattern, probably not needed)
- ❌ Dual element rendering (Nuxt-specific pattern)
- ❌ Chakra Factory (Chakra-specific pattern)

### Architecture Recommendation

**Recommended Approach**: Follow the **Enhanced Anchor** family pattern:
1. Start with semantic `<a>` element
2. Add polymorphic component support (as/component prop)
3. Provide automatic external link security
4. Include underline control (at least 3 modes)
5. Support theme-based coloring
6. Ensure accessibility (ARIA, keyboard, screen readers)
7. Focus-visible for modern focus indicators

**Security Philosophy**: Automatic security by default (like Chakra, HeroUI, MUI, Nuxt)
- isExternal prop that automatically adds target="_blank" and rel="noopener noreferrer"
- Developer can override with manual rel prop

**Underline Options** (recommend 3-4 modes):
- "always" - constant underline (common for in-content links)
- "hover" - underline on hover only (common for nav menus)
- "none" - no underline (common for button-style links)
- Optional: "focus" - underline on keyboard focus only

**Router Integration**: Polymorphic component pattern
- Simple `as` or `component` prop
- Works with Next.js, React Router, Remix, etc.
- TypeScript-safe if possible

### Design Philosophy Alignment

Semantic UI Next should emphasize:
1. **Semantic HTML** (universal across all frameworks)
2. **Security by default** (4/6 frameworks automate this)
3. **Accessibility-first** (100% of frameworks support this)
4. **Router-agnostic** (polymorphic pattern from 4/6 frameworks)
5. **Flexible styling** (underline/color control from 83-100% of frameworks)
6. **Reasonable defaults** (works immediately, customizable when needed)

## Raw Data

Individual framework reports available at:
- `ai/research/link/chakra-ui/usage-patterns.md`
- `ai/research/link/heroui/usage-patterns.md`
- `ai/research/link/mantine/usage-patterns.md`
- `ai/research/link/mui/usage-patterns.md`
- `ai/research/link/nuxt-ui/usage-patterns.md`
- `ai/research/link/semantic-ui/usage-patterns.md`

URL verification status: `ai/research/link/url-verification.md`

---

**Research Methodology**: Descriptive analysis of 6 UI frameworks, documenting actual implementation patterns. Pattern prevalence calculated as percentage of frameworks implementing each feature. Usage levels assigned based on prevalence ranges.

**Frameworks Researched**:
1. Chakra UI v2 - https://v2.chakra-ui.com/docs/components/link
2. HeroUI/NextUI v2.8.0 - https://www.heroui.com/docs/components/link
3. Mantine v8.3.6 - https://mantine.dev/core/anchor/
4. MUI v5+ - https://mui.com/material-ui/react-link/
5. Nuxt UI Current - https://ui.nuxt.com/components/link
6. Semantic UI Classic - https://semantic-ui.com/elements/list.html#link

**Usage Level Scale**:
- Level 1 (Universal): 80-100% adoption
- Level 2 (Common): 60-79% adoption
- Level 3 (Moderate): 40-59% adoption
- Level 4 (Occasional): 20-39% adoption
- Level 5 (Rare): <20% adoption

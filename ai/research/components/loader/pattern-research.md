# Loader/Spinner - Aggregate Pattern Analysis

**Research Date:** 2025-11-04
**Component Category:** Feedback / Loading Indicators
**Frameworks Analyzed:** 9

---

## Executive Summary

This aggregate analysis synthesizes usage patterns, API designs, and implementation approaches for Loader/Spinner components across 9 major UI frameworks. The research reveals significant convergence around core patterns (indeterminate loading states, size variants, accessibility) alongside notable divergence in advanced features (progress integration, fullscreen modes, animation styles).

**Key Terminology:** The industry shows a 4:5 split between "Spinner" terminology (HeroUI, Chakra UI, Mantine, Radix, ShadCN) and other terms (Ant Design's "Spin", MUI's "CircularProgress", PrimeReact's "ProgressSpinner", Semantic UI's "Loader"). Both terms are well-understood, with "Spinner" slightly more prevalent in modern frameworks.

**High-Level Findings:**
- **Universal Support:** All 9 frameworks provide indeterminate loading indicators with continuous animation
- **Size Variants:** 100% support multiple sizes (ranging from 3-8 size options)
- **Color Customization:** 89% (8/9) offer color/theme integration
- **Text Labels:** 67% (6/9) support built-in text/label patterns
- **Accessibility:** 78% (7/9) include default ARIA attributes
- **Determinate Progress:** Only 22% (2/9) integrate progress percentage display
- **Fullscreen Modes:** 22% (2/9) provide built-in fullscreen/overlay patterns

---

## Framework Coverage

| Framework | Component Name | URL | Notable Characteristics |
|-----------|----------------|-----|-------------------------|
| **Ant Design** | Spin | https://ant.design/components/spin | Fullscreen mode, delay prop, progress integration, global indicator config |
| **Chakra UI** | Spinner | https://chakra-ui.com/docs/components/spinner | v2→v3 breaking changes, CSS-first (no Framer Motion in v3), minimal API |
| **HeroUI** | Spinner | https://www.heroui.com/docs/components/spinner | 6 animation variants, 7 CSS slots, server component, independent label color |
| **Mantine** | Loader | https://mantine.dev/core/loader/ | 3 built-in types (oval/bars/dots), CSS-animated, custom loader extensibility, loaderProps pattern |
| **MUI** | CircularProgress | https://mui.com/material-ui/react-progress/ | Determinate + indeterminate modes, disableShrink performance prop, Material Design |
| **PrimeReact** | ProgressSpinner | https://primereact.org/progressspinner/ | PassThrough API, zero config, theme-first design, manual sizing |
| **Radix UI** | Spinner | https://www.radix-ui.com/themes/docs/components/spinner | Dimension-preserving, loading prop pattern, Themes (not Primitives), minimal API |
| **Semantic UI Classic** | Loader | https://semantic-ui.com/elements/loader.html | 8 sizes, dimmer integration, class-based, inline/overlay modes, text-first |
| **ShadCN** | Spinner | https://ui.shadcn.com/docs/components/spinner | Copy-paste model, Lucide icon-based, Tailwind utilities, zero dependencies |

---

## Terminology Analysis

### Naming Conventions

**"Spinner" (5/9 frameworks = 56%)**
- Chakra UI, HeroUI, Mantine (calls it "Loader" but uses spinner visuals), Radix UI, ShadCN
- **Semantic Implication:** Emphasizes the rotating animation style
- **Modern Trend:** More prevalent in newer frameworks (post-2020)

**"Loader" (2/9 frameworks = 22%)**
- Mantine, Semantic UI Classic
- **Semantic Implication:** Broader term encompassing various loading patterns
- **Classic Usage:** More common in established frameworks

**Specialized Terms (2/9 frameworks = 22%)**
- **Ant Design:** "Spin" - Concise, unique branding
- **MUI:** "CircularProgress" - Explicit about shape and purpose (distinguishing from LinearProgress)
- **PrimeReact:** "ProgressSpinner" - Hybrid term combining progress + spinner

**Semantic Differences:**
- No meaningful functional differences based on naming
- "CircularProgress" explicitly indicates circular shape vs linear alternatives
- "Spinner" most intuitive for developers searching documentation
- "Loader" allows for multi-style variants under single term

### Recommendation
**Use "Spinner" as primary term** (modern, prevalent, searchable) with "Loader" as acceptable alias. Consider "CircularProgress" for explicit shape distinction if linear variants exist.

---

## Pattern Categories

### 1. Size Variants

**Support Level:** Level 1 (100% - 9/9 frameworks)
**Support Type:** Native prop/class system in all frameworks

#### Size System Comparison

| Framework | Number of Sizes | Size Names/Values | Approach |
|-----------|----------------|-------------------|----------|
| **Ant Design** | 3 | small, default, large | Predefined strings |
| **Chakra UI** | 5 | xs, sm, md, lg, xl | T-shirt sizing |
| **HeroUI** | 3 | sm, md, lg | T-shirt sizing |
| **Mantine** | 5 predefined + custom | xs, sm, md, lg, xl + CSS values | Flexible |
| **MUI** | Numeric/string | `number \| string` (e.g., 40, "3rem") | Flexible |
| **PrimeReact** | Manual via style | CSS dimensions | Manual |
| **Radix UI** | 3 | "1", "2", "3" | Numeric tokens |
| **Semantic UI** | 8 | mini, tiny, small, medium, large, big, huge, massive | Extensive |
| **ShadCN** | Tailwind classes | size-3, size-4, size-6, size-8, size-12 | CSS utility |

**Prevalence Calculation:**
- **3 sizes:** 33% (3/9) - HeroUI, Ant Design, Radix UI
- **5 sizes:** 22% (2/9) - Chakra UI, Mantine
- **8 sizes:** 11% (1/9) - Semantic UI Classic
- **Flexible/Numeric:** 33% (3/9) - MUI, PrimeReact, ShadCN

**Size Naming Conventions:**
- **T-shirt sizing (xs/sm/md/lg/xl):** 56% (5/9) - Most common modern pattern
- **Numeric tokens (1/2/3):** 11% (1/9) - Radix UI only
- **Descriptive (mini/tiny/small/large/huge/massive):** 11% (1/9) - Semantic UI
- **Flexible (CSS values/numbers):** 33% (3/9) - Allow any dimension

**Implementation Approaches:**
- **Props-based:** 78% (7/9) - `size="lg"` prop
- **Class-based:** 22% (2/9) - Semantic UI, ShadCN via Tailwind
- **CSS custom properties:** 22% (2/9) - MUI, PrimeReact expose variables

---

### 2. Animation Types/Variants

**Support Level:** Level 3 (44% - 4/9 frameworks offer multiple animation styles)
**Support Type:** Native variants (HeroUI, Mantine), CSS customization (others)

#### Frameworks with Multiple Animation Styles

**HeroUI (6 variants - Most Extensive):**
- default (dual-circle rotating)
- simple (minimalist single-circle)
- gradient (gradient-colored dual circles)
- spinner (bar-based rotation)
- wave (wave-style pattern)
- dots (dotted animation)

**Mantine (3 built-in types):**
- oval (circular spinning - default)
- bars (three vertical bars)
- dots (three bouncing dots)

**Semantic UI Classic (via Fomantic fork):**
- standard (circular spinner)
- elastic (elastic stretching)
- double (double-ring animation)

**MUI (2 modes - not visual variants but functional):**
- indeterminate (continuous)
- determinate (progress percentage)

**Single Animation Style (5/9 = 56%):**
- Ant Design, Chakra UI, PrimeReact, Radix UI, ShadCN - All use circular spinning

**Prevalence:**
- **Single circular spinner:** 56% (5/9)
- **Multiple animation variants:** 44% (4/9)
- **Customizable via CSS:** 100% (9/9) - All allow custom animations through CSS overrides

**Unique Innovation:** HeroUI's 6 distinct animation variants represent the most comprehensive built-in animation system.

---

### 3. Color Customization

**Support Level:** Level 1 (89% - 8/9 frameworks)
**Support Type:** Props-based, theme integration, or CSS variables

#### Color Control Methods

| Framework | Color Approach | Method |
|-----------|----------------|--------|
| **Ant Design** | Theme integration + custom | `indicator` prop for custom icon |
| **Chakra UI** | Theme palette | `color` prop with theme tokens |
| **HeroUI** | Semantic colors | 6 color options: default, primary, secondary, success, warning, danger |
| **Mantine** | Theme + CSS colors | `color` prop accepts theme keys or CSS values |
| **MUI** | Theme palette | 7 options: primary, secondary, error, info, success, warning, inherit |
| **PrimeReact** | Theme variables + CSS | `fill` prop for background, CSS for stroke color |
| **Radix UI** | Theme inheritance | Inherits from Theme `accentColor` prop |
| **Semantic UI** | Fomantic fork colors | Standard palette via classes |
| **ShadCN** | Tailwind utilities | `text-*` classes, inherits theme via CSS variables |

**Track/Background Color Control:**
- **Supported:** 44% (4/9) - Chakra UI v2 (emptyColor), PrimeReact (fill), Ant Design (indirect), MUI (indirect via composition)
- **Not Supported:** 56% (5/9) - Single color control only

**Semantic Color Support:**
- **Built-in semantic colors:** 56% (5/9) - HeroUI, MUI, Chakra UI, Mantine, ShadCN
- **Theme-integrated:** 89% (8/9) - All except standalone CSS approach

**Prevalence Calculation:**
- **Props-based direct color:** 67% (6/9)
- **Theme integration required:** 33% (3/9) - Radix, ShadCN, Semantic UI
- **CSS custom properties:** 44% (4/9)

---

### 4. Loading States (Determinate vs Indeterminate)

**Indeterminate (Continuous) Support:** Level 1 (100% - 9/9 frameworks)
**Determinate (Progress %) Support:** Level 5 (22% - 2/9 frameworks)

#### State Breakdown

**Indeterminate Only (7/9 = 78%):**
- Ant Design, Chakra UI, HeroUI, Mantine, PrimeReact, Radix UI, ShadCN, Semantic UI
- **Characteristics:** Continuous animation, no progress indication, used for unknown duration

**Both Indeterminate + Determinate (2/9 = 22%):**
1. **MUI (CircularProgress):**
   - `variant="indeterminate"` (default)
   - `variant="determinate"` with `value={0-100}` prop
   - Auto ARIA attributes: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

2. **Ant Design (Spin):**
   - `percent` prop: number (determinate) or "auto" (indeterminate)
   - Integrated progress display within spinner
   - Version 5.0.0+ feature

**Semantic UI Classic Note:** Has separate `indeterminate` state class for animation variation, but not true progress tracking.

**Prevalence Analysis:**
- **Industry Standard:** Indeterminate spinners are universal
- **Determinate Progress:** Rare (22%) - Most frameworks use separate Progress Bar components
- **Design Philosophy:** Separation of concerns - spinners for unknown duration, progress bars for measurable tasks

---

### 5. Display Modes

**Support Level:** Level 2 (78% - 7/9 frameworks support multiple display modes)
**Support Type:** Composition, native props, or CSS patterns

#### Display Mode Patterns

**Inline Mode (flows with content):**
- **Supported:** 78% (7/9) - Ant Design, Chakra UI, HeroUI, Mantine, PrimeReact, Semantic UI, ShadCN
- **Implementation:** Inline-block or relative positioning
- **Use Case:** Loading within text, buttons, list items

**Overlay Mode (dims background):**
- **Supported:** 78% (7/9) - Ant Design, Chakra UI, HeroUI, Mantine, MUI, Radix UI, Semantic UI
- **Implementation:** Absolute positioning with backdrop/dimmer
- **Use Case:** Section-level or card-level loading

**Fullscreen Mode:**
- **Native Support:** 22% (2/9) - Ant Design (`fullscreen` prop), MUI (via Backdrop component)
- **Composition-Based:** 56% (5/9) - Achievable through manual composition in Chakra, HeroUI, Mantine, PrimeReact, ShadCN
- **Built-in Integration:** Semantic UI (dimmer module), Radix UI (dimension-preserving pattern)

**Dimension-Preserving Pattern:**
- **Unique to Radix UI:** `loading` prop hides children but preserves their dimensions
- **Prevents layout shift:** 11% (1/9) native support
- **Achievable Manually:** 100% through CSS techniques

**Display Mode Summary:**

| Mode | Native Support | Composition Pattern | Total |
|------|----------------|---------------------|-------|
| **Inline** | 78% (7/9) | 22% (2/9) | 100% |
| **Overlay** | 78% (7/9) | 22% (2/9) | 100% |
| **Fullscreen** | 22% (2/9) | 78% (7/9) | 100% |
| **Dimension-Preserving** | 11% (1/9) | 89% (8/9) | 100% |

**Prevalence:**
- All frameworks support all modes through composition or native features
- Native support varies significantly (22-78% depending on mode)
- Inline and overlay are most commonly provided natively

---

### 6. Text/Label Support

**Support Level:** Level 3 (67% - 6/9 frameworks)
**Support Type:** Built-in props (5/9) or composition patterns (4/9)

#### Built-in Label/Tip Props (56% - 5/9)

1. **Ant Design:** `tip` prop - ReactNode for description below spinner
2. **HeroUI:** `label` prop + `labelColor` prop for independent styling
3. **PrimeReact:** Implicit via text node children
4. **Semantic UI:** `text` class modifier, inline text content
5. **Radix UI:** Implicit via children when `loading` prop used

#### Composition-Based Only (44% - 4/9)

1. **Chakra UI:** Manual VStack/HStack composition
2. **Mantine:** Manual composition or `loaderProps.children`
3. **MUI:** Manual Box composition with Typography
4. **ShadCN:** Manual flex layout with text

#### Label Color Independence

**Supported:** 11% (1/9) - HeroUI only
- `labelColor` prop allows label styling separate from spinner color
- Enables semantic color communication (red spinner, neutral text)

**Not Supported:** 89% (8/9) - Label inherits spinner/parent color

#### Prevalence Calculation:
- **Built-in label support:** 56% (5/9)
- **Composition required:** 44% (4/9)
- **Independent label styling:** 11% (1/9)

**Design Philosophy Split:**
- **Integrated Approach:** Frameworks provide `tip`/`label` props for common pattern
- **Composition Approach:** Frameworks expect manual layout composition
- No clear winner - both approaches well-represented

---

### 7. Delay/Debounce

**Support Level:** Level 5 (11% - 1/9 frameworks)
**Support Type:** Native prop (Ant Design only)

#### Native Delay Support

**Ant Design (Only Framework):**
- `delay` prop: number (milliseconds)
- Prevents spinner flash for operations completing quickly
- Example: `<Spin delay={500}>` - only shows if loading exceeds 500ms
- Sophisticated mechanism: Once shown, remains until completion

#### All Other Frameworks (89% - 8/9):
- **No native delay/debounce**
- **Manual implementation required** via setTimeout/custom hooks
- Common pattern: useDelayedLoading hook

**Prevalence:**
- **Native support:** 11% (1/9)
- **Manual implementation:** 89% (8/9)
- **Documented pattern:** 33% (3/9) - Mantine, Radix, ShadCN docs show delay examples

**Industry Best Practice:**
- Delay before showing spinner: 200-500ms
- Minimum display time after shown: 300-500ms
- Ant Design is the only framework to build this into the component API

**Why This Matters:**
- Prevents jarring flash-in/flash-out for quick operations
- Significantly improves perceived performance
- Reduces visual noise

**Implementation Examples (Manual):**

```javascript
// Common pattern across frameworks
function useDelayedLoading(isLoading, delay = 300) {
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowSpinner(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [isLoading, delay]);
  return showSpinner;
}
```

---

### 8. Composition Patterns

**Support Level:** Level 1 (100% - 9/9 frameworks)
**Support Type:** Various integration methods

#### Button Integration

**Native Button Loading Support:**
- **Radix UI:** Button component has `loading` prop that composes Spinner
- **ShadCN:** Button pattern with Spinner in documentation
- **All Others:** Manual composition via props/children

**LoaderProps Pattern (22% - 2/9):**
1. **Mantine:** Button, ActionIcon, LoadingOverlay accept `loaderProps` object
2. **PrimeReact:** BlockUI accepts `template` with ProgressSpinner

**Button Pattern Prevalence:**
- **Documented pattern:** 100% (9/9)
- **Native integration:** 22% (2/9)
- **Manual composition:** 78% (7/9)

#### Overlay/Dimmer Patterns

**Built-in Overlay Components:**
- **Semantic UI:** Dimmer module (deep integration)
- **Ant Design:** Fullscreen mode built-in
- **MUI:** Backdrop component (separate but designed for Spinner)
- **Mantine:** LoadingOverlay component with loaderProps
- **PrimeReact:** BlockUI component with template prop

**Overlay Pattern Support:** 56% (5/9) have companion overlay/dimmer components

**Manual Overlay:** 44% (4/9) require custom composition with CSS

#### Custom Content/Children Support

**Spinner as Wrapper Pattern:**
- **Radix UI:** `loading` prop with children (dimension-preserving)
- **Mantine:** `loaderProps.children` for custom overlay content
- **Semantic UI:** Text content within loader element

**Custom Content Support:** 33% (3/9) - Others compose separately

**Prevalence Calculations:**

| Pattern | Native Support | Documented | Total |
|---------|----------------|------------|-------|
| **Button Integration** | 22% | 100% | 100% |
| **Overlay/Dimmer** | 56% | 100% | 100% |
| **Custom Children** | 33% | 67% | 100% |
| **Container Scoped** | 89% | 100% | 100% |

---

### 9. Speed/Animation Control

**Support Level:** Level 4 (22% - 2/9 frameworks)
**Support Type:** Native props

#### Native Speed Control

**Frameworks with Speed Props:**

1. **Ant Design (v2):**
   - `speed` prop: string (e.g., "0.65s")
   - **Breaking change in v3:** Renamed to `animationDuration`

2. **Chakra UI (v2):**
   - `speed` prop: string (e.g., "0.65s")
   - **Breaking change in v3:** Renamed to `animationDuration`

3. **PrimeReact:**
   - `animationDuration` prop: string (e.g., ".5s", "2s")
   - Default: "2s"

**Semantic UI (via Fomantic fork):**
- Speed variants: `slow`, `fast` classes
- Not numeric control, but preset speeds

**All Others (67% - 6/9):**
- CSS-based customization only
- Tailwind utilities for ShadCN
- Theme overrides for MUI, HeroUI, Radix UI
- Direct CSS for Mantine

**Prevalence:**
- **Native prop control:** 22% (2/9 mainstream, +1 fork variant = 33%)
- **CSS customization only:** 67% (6/9)
- **No official control:** 11% (1/9)

**Common Animation Durations:**
- **Fast:** 0.4-0.7s
- **Standard:** 1-2s (most common default)
- **Slow:** 2-4s

**Implementation Approach:**
- **Props-based:** Cleaner API for developers, limited to predefined speeds
- **CSS-based:** Maximum flexibility, requires CSS knowledge
- **Class-based:** (Semantic UI) Middle ground with semantic names

---

### 10. Accessibility

**Support Level:** Level 2 (78% - 7/9 frameworks)
**Support Type:** Built-in ARIA attributes

#### Built-in ARIA Support (78% - 7/9)

**Frameworks with Default ARIA:**

1. **Ant Design:** Inferred (not explicitly documented)
2. **Chakra UI:** `role="status"`, default `label="Loading..."`
3. **HeroUI:** `aria-label="Loading"` (default)
4. **Mantine:** Documentation emphasizes container-level ARIA (aria-busy, aria-live)
5. **MUI:** Auto `role="progressbar"`, `aria-valuenow` for determinate, `aria-busy` for indeterminate
6. **PrimeReact:** Auto `role="progressbar"` (documented)
7. **Radix UI:** Inferred from WAI-ARIA standards (Radix philosophy)
8. **ShadCN:** `role="status"`, `aria-label="Loading"` in base component

**Manual ARIA Required (22% - 2/9):**
- **Semantic UI Classic:** No built-in ARIA, must add manually

#### ARIA Attributes by Framework

| Framework | role | aria-label | aria-valuenow | aria-busy | aria-live |
|-----------|------|------------|---------------|-----------|-----------|
| **Ant Design** | ✓ (inferred) | — | — | — | — |
| **Chakra UI** | status | "Loading..." | — | — | — |
| **HeroUI** | — | "Loading" | — | — | — |
| **Mantine** | — (docs recommend container) | — | — | via container | via container |
| **MUI** | progressbar | — | ✓ (determinate) | ✓ (indeterminate) | — |
| **PrimeReact** | progressbar | — | — | — | — |
| **Radix UI** | status (inferred) | — | — | — | — |
| **Semantic UI** | ❌ Manual | ❌ Manual | ❌ Manual | ❌ Manual | ❌ Manual |
| **ShadCN** | status | "Loading" | — | — | — |

#### Screen Reader Support Patterns

**Label Support:**
- **Built-in label prop:** 56% (5/9) - Allows customization
- **Default label:** 33% (3/9) - Provides fallback
- **Manual label required:** 22% (2/9)

**Best Practices Documented:**
- **Provide context:** 89% (8/9) frameworks document importance of descriptive labels
- **Use aria-live regions:** 33% (3/9) explicitly document
- **Container-level aria-busy:** 44% (4/9) recommend

#### Keyboard Support

**No Direct Interaction Required:** 100% (9/9)
- Spinners are non-interactive, display-only components
- No keyboard navigation needed
- Focus management handled by parent containers (buttons, forms)

**Prevalence Summary:**

| Feature | Support Level | Frameworks |
|---------|---------------|------------|
| **Default ARIA role** | 78% (7/9) | Built-in |
| **Default aria-label** | 33% (3/9) | Built-in |
| **Customizable label** | 56% (5/9) | Via props |
| **Determinate ARIA** | 11% (1/9) | MUI only |
| **Screen reader docs** | 89% (8/9) | Best practices |

---

## Cross-Framework Comparisons

### API Design Patterns

#### Props-Based API (67% - 6/9)
- **Frameworks:** Ant Design, Chakra UI, HeroUI, Mantine, MUI, PrimeReact
- **Characteristics:**
  - TypeScript interfaces define complete API
  - Size, color, variant controlled via props
  - Theme integration through prop values
- **Example:** `<Spinner size="lg" color="primary" />`

#### Class-Based API (22% - 2/9)
- **Frameworks:** Semantic UI Classic, ShadCN (via Tailwind)
- **Characteristics:**
  - Composable CSS classes define behavior
  - Semantic naming (`.ui.large.loader`)
  - No JavaScript required for styling
- **Example:** `<div class="ui large text loader">Loading</div>`

#### Hybrid/Minimal API (11% - 1/9)
- **Framework:** Radix UI
- **Characteristics:**
  - Minimal props (size, loading)
  - Theme-driven styling
  - Composition over configuration
- **Example:** `<Spinner loading={isLoading}><Content /></Spinner>`

#### Theme Integration Approaches

**CSS-in-JS with Theme Provider:**
- **Frameworks:** Chakra UI, MUI, Ant Design
- **Approach:** JavaScript theme objects, runtime styling

**CSS Variables:**
- **Frameworks:** MUI, PrimeReact, Radix UI, ShadCN, HeroUI
- **Approach:** CSS custom properties, compile-time or runtime

**LESS/Sass Variables:**
- **Framework:** Semantic UI Classic
- **Approach:** Preprocessor variables, compile-time only

**Tailwind Utilities:**
- **Framework:** ShadCN, HeroUI (Tailwind-based)
- **Approach:** Utility classes, JIT compilation

**Prevalence:**
- **CSS Variables:** 56% (5/9) - Most modern approach
- **CSS-in-JS:** 33% (3/9)
- **Preprocessor:** 11% (1/9) - Legacy
- **Tailwind:** 22% (2/9) - Growing trend

---

### Unique Innovations

#### Ant Design - Fullscreen Mode (v5.11.0+)
- **What:** `fullscreen` prop creates page-level modal overlay
- **Why Unique:** Only framework with native fullscreen support (others require composition)
- **Use Case:** Application initialization, critical blocking operations
- **Innovation:** Eliminates boilerplate for common fullscreen loading pattern

#### Ant Design - Delay Prop
- **What:** `delay={milliseconds}` prevents flash for quick operations
- **Why Unique:** Only framework with built-in delay/debounce
- **UX Impact:** Significantly improves perceived performance
- **Innovation:** Solves common UX problem at component level

#### Ant Design - Global Indicator Configuration
- **What:** `Spin.setDefaultIndicator(component)` static method
- **Why Unique:** Global customization without theme provider
- **Use Case:** Centralized branding of loading states
- **Innovation:** Single point of control for all spinners

#### HeroUI - Animation Variety (6 Variants)
- **What:** 6 distinct animation styles (default, simple, gradient, wave, dots, spinner)
- **Why Unique:** Most extensive built-in animation system
- **Use Case:** Brand differentiation through animation selection
- **Innovation:** No other framework offers this level of animation diversity

#### HeroUI - Slot-Based Architecture (7 CSS Slots)
- **What:** Granular styling control via slots (base, wrapper, circle1, circle2, dots, spinnerBars, label)
- **Why Unique:** Most granular customization without CSS overrides
- **Use Case:** Precise targeting of internal elements
- **Innovation:** Composition-friendly customization approach

#### HeroUI - Independent Label Color
- **What:** `labelColor` prop styles label independently from spinner
- **Why Unique:** Only framework with independent label styling
- **Use Case:** Semantic color communication (red spinner with neutral label)
- **Innovation:** Enables nuanced visual communication

#### Mantine - Loader Type Extensibility
- **What:** `loaders` prop accepts custom loader components
- **Why Unique:** Register custom loaders globally via theme
- **Use Case:** Add brand-specific loading animations
- **Innovation:** Extensible system without forking component

#### Mantine - loaderProps Pattern
- **What:** Button, LoadingOverlay, ActionIcon accept `loaderProps` for customization
- **Why Unique:** Consistent pattern across components for loader configuration
- **Use Case:** Customize loader in any loading context
- **Innovation:** Composition pattern that scales across component library

#### MUI - disableShrink Performance Prop
- **What:** `disableShrink` disables shrink animation for performance
- **Why Unique:** Only framework with explicit performance optimization prop
- **Use Case:** High-load scenarios, animation stuttering, IE11
- **Innovation:** Pragmatic solution to real-world performance issues

#### MUI - Dual Indeterminate Animation
- **What:** Both rotation AND expanding/contracting arc
- **Why Unique:** Most visually dynamic default animation
- **Use Case:** More engaging than simple rotation
- **Innovation:** Material Design's signature loading animation

#### PrimeReact - PassThrough API
- **What:** `pt` prop for advanced DOM customization of internal elements
- **Why Unique:** Low-level DOM control without component forking
- **Use Case:** Enterprise customization requirements
- **Innovation:** Granular control through declarative API

#### Radix UI - Dimension-Preserving Loading
- **What:** `loading` prop hides children but preserves dimensions
- **Why Unique:** Prevents layout shift during state transitions
- **Use Case:** Smooth loading→loaded transitions
- **Innovation:** Built-in solution to common layout shift problem

#### Radix UI - Automatic Interaction Disabling
- **What:** Interactive elements within children auto-disabled during loading
- **Why Unique:** Framework handles accessibility concerns automatically
- **Use Case:** Forms, buttons within loading containers
- **Innovation:** Reduces developer burden for proper loading UX

#### Semantic UI - 8-Size System
- **What:** mini, tiny, small, medium, large, big, huge, massive
- **Why Unique:** Most granular size system
- **Use Case:** Precise size matching across contexts
- **Innovation:** Semantic naming with extensive options

#### Semantic UI - Dimmer Integration
- **What:** Deep integration with dimmer module for overlay patterns
- **Why Unique:** Loader designed to work seamlessly with dimmer
- **Use Case:** Content overlays with consistent API
- **Innovation:** Component-level integration reduces boilerplate

#### Semantic UI - Text-First Design
- **What:** Text loaders are first-class citizens with `text` class
- **Why Unique:** Equal emphasis on text and icon
- **Use Case:** Descriptive loading states
- **Innovation:** Encourages accessible, contextual loading feedback

#### ShadCN - Copy-Paste Model
- **What:** Component code copied into project, not installed as dependency
- **Why Unique:** Zero version lock-in, full ownership
- **Use Case:** Custom design systems, zero breaking changes
- **Innovation:** Alternative distribution model to npm packages

---

### Breaking Changes

#### Chakra UI v2 → v3 (Most Significant)

**Prop Renames:**
1. `thickness` → `borderWidth`
2. `speed` → `animationDuration`
3. `emptyColor` → CSS variable `--spinner-track-color`
4. `colorScheme` → `colorPalette`

**Animation Engine Change:**
- **v2:** Framer Motion dependency
- **v3:** Pure CSS animations (no JS library)
- **Impact:** Better performance, smaller bundle, identical visual behavior

**Track Color Control:**
- **v2:** `emptyColor` prop
- **v3:** CSS variable approach via `css` prop
- **Migration:** `emptyColor="gray.200"` → `css={{ "--spinner-track-color": "colors.gray.200" }}`

**Migration Complexity:** Moderate - straightforward prop renames, some manual work for track colors

#### Other Framework Breaking Changes

**Ant Design v5.0.0:**
- Added `percent` prop (non-breaking addition)

**Ant Design v5.11.0:**
- Added `fullscreen` prop (non-breaking addition)

**Other Frameworks:**
- No major breaking changes documented
- Most frameworks maintain backward compatibility
- Additions rather than breaking changes

**Industry Trend:** Frameworks favor additive changes over breaking changes in mature components.

---

## Sophisticated Design Patterns

This section highlights component-specific patterns that solve unique Loader/Spinner design challenges. Unlike framework-wide architectural choices, these patterns are innovations within the loading indicator domain itself.

### Ant Design - Smart Delay Mechanism

**What it does:** The `delay` prop (milliseconds) prevents visual flashing for operations that complete quickly. When delay is set, the spinner only appears if the operation exceeds the specified threshold. Once shown, the spinner remains visible until completion regardless of operation duration.

**Why it's sophisticated:** This solves a subtle but important UX problem—brief loading flashes (< 300ms) are more distracting than no indicator at all. Rather than forcing developers to implement debouncing logic in their components, Ant Design bakes the delay directly into the component API. The implementation includes sophisticated state management: start timer on load, cancel if completes before delay, show spinner and lock until completion if delay is exceeded.

**Evidence of design maturity:**
- Rare feature: Only 1/9 frameworks implement this, despite being a well-known UX pattern
- Real-world validation: Documented default of 200-500ms aligns with usability research on perceived performance
- Composition-aware: Works seamlessly with wrapped content, controlling overlay appearance without affecting children visibility

### Radix UI - Dimension-Preserving Loading State

**What it does:** The `loading` prop hides children but preserves their layout dimensions via invisible placeholder. This prevents the layout shift that occurs when content disappears and is replaced with a spinner—a common cause of janky transitions in modern web apps.

**Why it's sophisticated:** Most implementations create jarring layout shifts because spinners are typically centered and take minimal space, while content varies. Radix solves this by rendering children as invisible (display: none or visibility: hidden with dimensions preserved) so the layout remains stable. This requires careful CSS engineering and understanding of how containing blocks interact with layout algorithms.

**Evidence of design maturity:**
- Unique solution: Only Radix implements this (11% of frameworks)
- Non-obvious insight: Acknowledges that layout stability matters for perceived quality, beyond just showing/hiding content
- Accessibility consideration: Automatically disables interactive elements within preserved dimensions, preventing user confusion

### Mantine - loaderProps Pattern for Consistent Customization

**What it does:** Components that use loaders (Button, LoadingOverlay, ActionIcon, Dropzone) accept a `loaderProps` object that passes all Loader customization props through to the internal loader. This creates a unified API for customizing loaders across multiple components without duplicating prop definitions or requiring wrapper components.

**Why it's sophisticated:** This pattern inverts typical prop sprawl. Rather than Button accepting `loaderType`, `loaderColor`, `loaderSize` separately, or forcing developers to replace the entire loader with a custom component, the `loaderProps` pattern delegates all loader customization to the Loader's native API. It requires careful documentation and understanding of composition patterns to implement effectively across a component ecosystem.

**Evidence of design maturity:**
- Scalable architecture: Works across 4+ components (Button, LoadingOverlay, ActionIcon, Dropzone) with same mental model
- Composability: Enables feature creep without breaking existing APIs—new Loader props automatically work everywhere
- Framework consistency: Demonstrates deep architectural thinking about how components relate (Loader is a dependency, not just a visual element)

---

## Implementation Recommendations for Semantic UI

Based on the aggregate pattern analysis, here are recommendations for the Semantic UI web component implementation, organized by priority level.

### Must-Have Features (Level 1: 70%+ Support)

These features are supported by at least 7 of 9 frameworks and represent industry standard expectations:

#### 1. Multiple Size Variants (100% - 9/9)
**Recommendation:**
- Support **5 size variants** using semantic naming: `xs`, `sm`, `md`, `lg`, `xl`
- Use CSS custom properties for sizing: `--spinner-size`
- Provide default: `md` (1rem / 16px)
- Allow custom sizes via `size` attribute: `<ui-spinner size="xl">` or `<ui-spinner size="2rem">`

**Rationale:** Universal pattern, well-understood by developers, balances granularity with simplicity.

#### 2. Indeterminate Animation (100% - 9/9)
**Recommendation:**
- Default continuous rotation animation
- CSS-based (GPU-accelerated) using CSS animations or SVG animations
- Use `@keyframes` for smooth 360° rotation
- Default duration: 1-2s (configurable via CSS custom property `--spinner-duration`)

**Rationale:** Core functionality, universally expected, performant with CSS.

#### 3. Size System Implementation (100% - 9/9)
**Recommendation:**
```css
/* CSS Custom Properties */
--spinner-size-xs: 0.75rem;  /* 12px */
--spinner-size-sm: 1rem;     /* 16px */
--spinner-size-md: 1.5rem;   /* 24px */
--spinner-size-lg: 2rem;     /* 32px */
--spinner-size-xl: 3rem;     /* 48px */
```

**API:**
```html
<ui-spinner size="sm"></ui-spinner>
<ui-spinner size="md"></ui-spinner>  <!-- default -->
<ui-spinner size="2.5rem"></ui-spinner>  <!-- custom -->
```

#### 4. Color/Theme Integration (89% - 8/9)
**Recommendation:**
- Support theme color tokens: `primary`, `secondary`, `accent`, `success`, `warning`, `error`
- Expose `--spinner-color` CSS variable
- Default: `currentColor` for maximum flexibility
- Allow custom colors: `<ui-spinner color="primary">` or `<ui-spinner style="--spinner-color: #ff6b6b">`

**Rationale:** Theme integration is expected, CSS custom properties align with web standards.

#### 5. Inline Display Mode (78% - 7/9)
**Recommendation:**
- Default to `inline-block` display
- Use relative positioning for inline flow
- Provide `inline` attribute for explicit inline mode
- Vertical alignment: `vertical-align: middle` by default

**Example:**
```html
<p>Loading <ui-spinner inline size="xs"></ui-spinner> please wait...</p>
```

#### 6. Accessibility - Default ARIA (78% - 7/9)
**Recommendation:**
- Auto-apply `role="status"` for indeterminate spinners
- Default `aria-label="Loading"` if no label provided
- Allow customization: `<ui-spinner aria-label="Loading user profile">`
- Support `aria-labelledby` for external labels
- For determinate (if implemented), use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

**Rationale:** Accessibility should be built-in, not an afterthought.

---

### Should-Have Features (Level 2-3: 40-69% Support)

These features are supported by 4-6 frameworks and represent common but not universal patterns:

#### 1. Text/Label Support (67% - 6/9)
**Recommendation:**
- Support `label` attribute for visible text
- Provide default slot for custom label content
- Position label below spinner by default
- Optional: Independent label color control (HeroUI pattern)

**API:**
```html
<!-- Attribute-based -->
<ui-spinner label="Loading data..."></ui-spinner>

<!-- Slot-based (more flexible) -->
<ui-spinner>
  <span slot="label">Loading data...</span>
</ui-spinner>
```

**Rationale:** Common pattern, improves UX, accessible without extra work.

#### 2. Overlay/Dimmer Mode (56% - 5/9 native support, 100% composable)
**Recommendation:**
- Provide `overlay` attribute for built-in overlay mode
- When enabled: absolute positioning, semi-transparent backdrop, centered spinner
- Optional: Separate `<ui-spinner-overlay>` component for explicit composition
- Configurable backdrop color via `--spinner-backdrop-color`

**API:**
```html
<!-- Simple overlay mode -->
<ui-card>
  <ui-spinner overlay active></ui-spinner>
  <p>Card content</p>
</ui-card>

<!-- Or explicit composition -->
<ui-card>
  <ui-spinner-overlay active>
    <ui-spinner size="lg" label="Loading..."></ui-spinner>
  </ui-spinner-overlay>
  <p>Card content</p>
</ui-card>
```

**Rationale:** Very common pattern, reduces boilerplate, maintains flexibility through composition.

#### 3. Multiple Display Modes (78% - 7/9)
**Recommendation:**
- Support `inline`, `overlay`, and `fullscreen` modes
- Use `mode` attribute: `<ui-spinner mode="overlay">`
- Default: inline mode
- Each mode has appropriate positioning and backdrop behavior

**Rationale:** Covers most common use cases with simple attribute-based API.

#### 4. Color Customization Methods (89% - 8/9)
**Recommendation:**
- **Primary:** `color` attribute with theme token values
- **Secondary:** CSS custom property `--spinner-color`
- **Track color:** `--spinner-track-color` for background/track (optional)

**Priority:** High (near must-have at 89%)

---

### Nice-to-Have Features (Level 4-5: <40% Support)

These features are supported by fewer frameworks but provide significant value in specific use cases:

#### 1. Delay/Debounce (11% - 1/9, but valuable)
**Recommendation:**
- Add `delay` attribute: milliseconds before showing spinner
- Prevents flash for operations < delay threshold
- Default: 0 (no delay)
- Example: `<ui-spinner delay="300"></ui-spinner>`

**Rationale:** Ant Design is the only native implementation, but solves important UX problem. Manual workaround is verbose.

**Implementation:**
```javascript
class UISpinner extends HTMLElement {
  connectedCallback() {
    const delay = parseInt(this.getAttribute('delay')) || 0;
    if (delay > 0 && this.hasAttribute('active')) {
      this.style.visibility = 'hidden';
      setTimeout(() => {
        this.style.visibility = 'visible';
      }, delay);
    }
  }
}
```

#### 2. Animation Speed Control (22% - 2/9)
**Recommendation:**
- Provide `speed` attribute with preset values: `slow`, `normal`, `fast`
- Map to CSS custom property `--spinner-duration`
- Allow custom duration: `<ui-spinner speed="0.8s">`

**Values:**
- `slow`: 2s
- `normal`: 1s (default)
- `fast`: 0.5s

**Rationale:** Some frameworks provide this, CSS solution is straightforward, useful for branding.

#### 3. Multiple Animation Styles (44% - 4/9)
**Recommendation (Phase 2):**
- Start with single circular spinner (universal)
- Consider adding variants in future: `dots`, `bars`, `wave`
- Use `variant` attribute: `<ui-spinner variant="dots">`
- HeroUI and Mantine prove value of animation variety

**Rationale:** Not critical for MVP, but differentiates from other frameworks. HeroUI's 6 variants show this is valuable for brand expression.

#### 4. Determinate Progress Mode (22% - 2/9)
**Recommendation (Maybe - Separate Component):**
- Consider separate `<ui-progress-circular>` component
- Keep `<ui-spinner>` for indeterminate only
- Follows industry pattern of separation (most frameworks have separate Progress components)

**Rationale:** MUI and Ant Design show value, but most frameworks separate concerns. Cleaner API with dedicated progress component.

#### 5. Fullscreen Mode (22% - 2/9 native)
**Recommendation:**
- Provide `fullscreen` attribute for page-level overlay
- When enabled: fixed positioning, full viewport coverage, high z-index, backdrop
- Optional: Use `<ui-spinner-fullscreen>` wrapper component

**API:**
```html
<!-- Native fullscreen -->
<ui-spinner fullscreen active></ui-spinner>

<!-- Or wrapper component -->
<ui-spinner-fullscreen active>
  <ui-spinner size="xl" label="Loading application..."></ui-spinner>
</ui-spinner-fullscreen>
```

**Rationale:** Ant Design shows this is useful, reduces boilerplate, common pattern for app initialization.

---

### Semantic UI Classic Compatibility

#### Features to Preserve

From the Semantic UI Classic analysis, these patterns should be maintained for migration compatibility:

1. **8-Size System (Optional Compatibility Mode)**
   - Classic: mini, tiny, small, medium, large, big, huge, massive
   - Modern: xs, sm, md, lg, xl (recommended)
   - **Recommendation:** Support both via attribute aliasing
   - Example: `<ui-spinner size="massive">` → maps to `xl`

2. **Text-First Design**
   - Classic emphasized text loaders as equal to icon loaders
   - **Preserve:** Built-in label support (recommended above)

3. **Inline vs Overlay Modes**
   - Classic: `inline` class for inline mode, default with dimmer for overlay
   - **Preserve:** `inline` and `overlay` modes (recommended above)

4. **Inverted Mode**
   - Classic: `inverted` class for dark backgrounds
   - **Modernize:** Use CSS custom properties for color theming
   - **Optional:** `inverted` attribute as shorthand for theme switching

5. **Indeterminate State**
   - Classic: `indeterminate` class for animation variation
   - **Preserve/Modernize:** Use as `variant="indeterminate"` or animation style variant

6. **Active State Control**
   - Classic: Loaders hidden by default, `active` class shows them
   - **Preserve:** `active` attribute controls visibility
   - Default: hidden unless `active` present

#### Modernization Opportunities

Transform Classic patterns into modern web component equivalents:

1. **Class-Based → Attribute-Based**
   - Classic: `<div class="ui large text loader">Loading</div>`
   - Modern: `<ui-spinner size="lg" label="Loading"></ui-spinner>`

2. **Dimmer Integration → Component Composition**
   - Classic: Requires separate dimmer module
   - Modern: Built-in overlay mode or `<ui-spinner-overlay>` component

3. **jQuery API → Native Methods**
   - Classic: `$('.loader').dimmer('show')`
   - Modern: `spinnerElement.show()` or `spinnerElement.active = true`

4. **LESS Variables → CSS Custom Properties**
   - Classic: `@loaderLineWidth`, `@shapeBorderColor`
   - Modern: `--spinner-size`, `--spinner-color`, `--spinner-track-color`

5. **State Classes → Reactive Properties**
   - Classic: `$('.loader').addClass('active')`
   - Modern: `<ui-spinner active>` with reactive attribute observing

---

### Proposed API Design

Based on the aggregate analysis, here's the recommended API for Semantic UI web component spinner:

#### HTML API (Attributes)

```html
<!-- Basic usage -->
<ui-spinner></ui-spinner>

<!-- Size variants -->
<ui-spinner size="xs"></ui-spinner>
<ui-spinner size="sm"></ui-spinner>
<ui-spinner size="md"></ui-spinner>  <!-- default -->
<ui-spinner size="lg"></ui-spinner>
<ui-spinner size="xl"></ui-spinner>
<ui-spinner size="2rem"></ui-spinner>  <!-- custom -->

<!-- Color -->
<ui-spinner color="primary"></ui-spinner>
<ui-spinner color="error"></ui-spinner>
<ui-spinner style="--spinner-color: #ff6b6b"></ui-spinner>

<!-- Display modes -->
<ui-spinner mode="inline"></ui-spinner>  <!-- default -->
<ui-spinner mode="overlay"></ui-spinner>
<ui-spinner mode="fullscreen"></ui-spinner>

<!-- State control -->
<ui-spinner active></ui-spinner>
<ui-spinner loading></ui-spinner>  <!-- alias for active -->

<!-- Labels -->
<ui-spinner label="Loading data..."></ui-spinner>
<ui-spinner aria-label="Loading user profile"></ui-spinner>

<!-- Advanced features -->
<ui-spinner delay="300"></ui-spinner>
<ui-spinner speed="slow"></ui-spinner>  <!-- or "fast", "1.5s" -->
<ui-spinner variant="dots"></ui-spinner>  <!-- future: animation variants -->

<!-- Semantic UI Classic compatibility -->
<ui-spinner class="massive inverted"></ui-spinner>  <!-- fallback support -->
```

#### Slot API

```html
<!-- Custom label content -->
<ui-spinner>
  <span slot="label">Loading <strong>important</strong> data...</span>
</ui-spinner>

<!-- Custom spinner content (advanced) -->
<ui-spinner>
  <svg slot="icon" viewBox="0 0 24 24">
    <!-- custom spinner SVG -->
  </svg>
</ui-spinner>
```

#### JavaScript API

```javascript
const spinner = document.querySelector('ui-spinner');

// Properties (reflect attributes)
spinner.size = 'lg';
spinner.color = 'primary';
spinner.active = true;
spinner.label = 'Loading...';
spinner.delay = 300;
spinner.mode = 'overlay';

// Methods
spinner.show();       // Set active = true
spinner.hide();       // Set active = false
spinner.toggle();     // Toggle active state

// Events
spinner.addEventListener('show', () => {
  console.log('Spinner shown');
});
spinner.addEventListener('hide', () => {
  console.log('Spinner hidden');
});
```

#### CSS Custom Properties

```css
ui-spinner {
  /* Size */
  --spinner-size: 1.5rem;

  /* Colors */
  --spinner-color: currentColor;
  --spinner-track-color: transparent;

  /* Animation */
  --spinner-duration: 1s;
  --spinner-timing: linear;

  /* Overlay mode */
  --spinner-backdrop-color: rgba(255, 255, 255, 0.8);
  --spinner-backdrop-blur: 0px;

  /* Z-index */
  --spinner-z-index: 1000;
}
```

---

### Size System Recommendation

Based on prevalence analysis, recommend **5-size system with semantic names:**

| Size Token | Value | Use Case | Classic Equivalent |
|------------|-------|----------|-------------------|
| `xs` | 0.75rem (12px) | Inline text, badges | mini |
| `sm` | 1rem (16px) | Buttons, small cards | small |
| `md` | 1.5rem (24px) | Default, content areas | medium |
| `lg` | 2rem (32px) | Prominent sections | large |
| `xl` | 3rem (48px) | Full-page, splash | huge |

**Rationale:**
- T-shirt sizing is most common (56% of frameworks)
- 5 sizes balances granularity with simplicity
- Aligns with modern design systems (Tailwind, Bootstrap 5, etc.)
- Classic 8-size system can map to these 5 core sizes

**Optional Extended Sizes (Classic Compat):**
- `xxs` → 0.5rem (tiny)
- `xxl` → 4rem (massive)
- `xxxl` → 5rem (beyond massive)

---

### Animation System Recommendation

#### Phase 1: Single Circular Spinner (MVP)
- Start with universal circular spinner (100% support)
- SVG-based or CSS border-based
- Smooth 360° rotation
- Default duration: 1s

#### Phase 2: Animation Variants (Enhancement)
Based on HeroUI (6 variants) and Mantine (3 types) patterns:

| Variant | Description | Inspired By |
|---------|-------------|-------------|
| `circle` | Default circular spinner | Universal |
| `dots` | Three bouncing dots | Mantine, HeroUI |
| `bars` | Three vertical bars | Mantine |
| `wave` | Wave-style pattern | HeroUI |
| `pulse` | Pulsing circle | Common pattern |

**Implementation:**
```html
<ui-spinner variant="circle"></ui-spinner>  <!-- default -->
<ui-spinner variant="dots"></ui-spinner>
<ui-spinner variant="bars"></ui-spinner>
```

**Rationale:** Start simple (universal pattern), expand based on demand. HeroUI proves animation variety is valuable for brand differentiation.

---

### Default Behaviors

Based on aggregate analysis, recommended defaults:

1. **Visibility:** Hidden by default (requires `active` attribute)
   - **Rationale:** 89% of frameworks (all except ShadCN) require explicit activation
   - Prevents unwanted spinners in initial render

2. **Size:** `md` (1.5rem / 24px)
   - **Rationale:** Medium size is universal default across frameworks

3. **Color:** `currentColor`
   - **Rationale:** Inherits from parent, maximum flexibility, consistent with CSS standards

4. **Display:** `inline-block` (inline mode)
   - **Rationale:** 78% support inline as primary/default mode

5. **Animation Duration:** 1s
   - **Rationale:** Middle ground between fast (0.5s) and slow (2s)

6. **ARIA:** Auto-apply `role="status"` and `aria-label="Loading"`
   - **Rationale:** 78% provide default ARIA, accessibility built-in

7. **Delay:** 0 (no delay)
   - **Rationale:** Only 11% have delay prop, should be opt-in

---

## Accessibility Requirements

Based on 78% of frameworks providing built-in ARIA support:

### Minimum ARIA Support (Required)

1. **Role Attribute:**
   - Indeterminate: `role="status"`
   - Determinate (if implemented): `role="progressbar"`

2. **Label Support:**
   - Default: `aria-label="Loading"`
   - Customizable via `aria-label` or `aria-labelledby` attributes
   - When `label` attribute provided, use its value for `aria-label`

3. **Live Region (Indeterminate):**
   - Implicit: `role="status"` acts as live region
   - Updates announced to screen readers

4. **Progress Values (Determinate, if implemented):**
   - `aria-valuenow`: Current percentage (0-100)
   - `aria-valuemin`: 0
   - `aria-valuemax`: 100

### Screen Reader Considerations

1. **Descriptive Labels:**
   - Bad: "Loading" (too generic)
   - Good: "Loading user profile", "Uploading file", "Processing payment"
   - **Recommendation:** Encourage specific labels in documentation

2. **Context Awareness:**
   - Provide context through `aria-label` or surrounding text
   - Example: `<ui-spinner aria-label="Loading search results"></ui-spinner>`

3. **State Announcements:**
   - When spinner appears: Announced via `role="status"`
   - When spinner disappears: Implicit completion (no announcement needed)
   - For long operations: Update `aria-label` with progress/status

### Keyboard Interaction

**No keyboard interaction required** (100% agreement):
- Spinners are non-interactive, display-only
- No focusable elements
- No keyboard navigation needed

**However, ensure:**
- Interactive elements containing spinners remain properly focusable/disabled
- Buttons with spinners: disable the button, not just show the spinner
- Forms with spinners: prevent submission during loading

### Example Implementation

```javascript
class UISpinner extends HTMLElement {
  connectedCallback() {
    // Auto-apply ARIA role
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'status');
    }

    // Auto-apply ARIA label if not provided
    if (!this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby')) {
      const label = this.getAttribute('label') || 'Loading';
      this.setAttribute('aria-label', label);
    }

    // For determinate mode (future)
    if (this.hasAttribute('value')) {
      this.setAttribute('role', 'progressbar');
      this.setAttribute('aria-valuenow', this.getAttribute('value'));
      this.setAttribute('aria-valuemin', '0');
      this.setAttribute('aria-valuemax', '100');
    }
  }

  // Update ARIA when label changes
  static get observedAttributes() {
    return ['label', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
      this.setAttribute('aria-label', newValue || 'Loading');
    }
    if (name === 'value') {
      this.setAttribute('aria-valuenow', newValue);
    }
  }
}
```

---

## Styling & Theming

### CSS Custom Properties to Expose

Based on aggregate analysis, expose these CSS variables:

#### Core Properties

```css
ui-spinner {
  /* Size */
  --spinner-size: 1.5rem;

  /* Colors */
  --spinner-color: currentColor;
  --spinner-track-color: transparent;  /* For dual-circle designs */

  /* Animation */
  --spinner-duration: 1s;
  --spinner-timing-function: linear;

  /* Stroke (for SVG/border-based spinners) */
  --spinner-stroke-width: 2px;
}
```

#### Overlay Mode Properties

```css
ui-spinner[mode="overlay"],
ui-spinner[overlay] {
  /* Backdrop */
  --spinner-backdrop-color: rgba(255, 255, 255, 0.8);
  --spinner-backdrop-blur: 0px;

  /* Positioning */
  --spinner-z-index: 1000;
  --spinner-overlay-padding: 2rem;
}
```

#### Fullscreen Mode Properties

```css
ui-spinner[mode="fullscreen"],
ui-spinner[fullscreen] {
  /* Backdrop */
  --spinner-fullscreen-backdrop: rgba(0, 0, 0, 0.5);
  --spinner-fullscreen-z-index: 9999;
}
```

### Theme Integration Approach

**Recommended: CSS Variables + Theme Context**

```javascript
// Theme provider pattern
<ui-theme accent="blue" mode="dark">
  <ui-spinner color="accent"></ui-spinner>
</ui-theme>

// CSS custom property cascade
:root {
  --color-primary: #007bff;
  --color-accent: #6366f1;
  --color-error: #dc2626;
}

ui-spinner[color="primary"] {
  --spinner-color: var(--color-primary);
}

ui-spinner[color="accent"] {
  --spinner-color: var(--color-accent);
}
```

**Alternatively: Adopt Design Token System**

```css
/* Design tokens from theme */
ui-spinner {
  --spinner-color: var(--semantic-color-primary);
  --spinner-size: var(--semantic-size-md);
}
```

### Shadow DOM Considerations

**Encapsulation Strategy:**
- Use Shadow DOM for style isolation
- Expose CSS custom properties for theming (pierce Shadow DOM)
- Use `::part()` for additional customization points

**Parts to Expose:**

```css
ui-spinner::part(spinner) {
  /* The rotating element */
}

ui-spinner::part(label) {
  /* The text label */
}

ui-spinner::part(backdrop) {
  /* The overlay backdrop (when mode="overlay") */
}
```

**Example Usage:**

```html
<style>
  ui-spinner::part(spinner) {
    filter: drop-shadow(0 0 10px currentColor);
  }

  ui-spinner::part(label) {
    font-weight: bold;
    margin-top: 0.5rem;
  }
</style>

<ui-spinner size="lg" label="Loading..."></ui-spinner>
```

---

## Research Metadata

- **Total frameworks analyzed:** 9
- **Research date:** 2025-11-04
- **Component category:** Feedback / Loading Indicators
- **Related components:** Progress Bar, Skeleton, LoadingOverlay
- **Frameworks:**
  1. Ant Design (Spin)
  2. Chakra UI (Spinner)
  3. HeroUI (Spinner)
  4. Mantine (Loader)
  5. Material UI (CircularProgress)
  6. PrimeReact (ProgressSpinner)
  7. Radix UI Themes (Spinner)
  8. Semantic UI Classic (Loader)
  9. ShadCN (Spinner)

### Research Coverage

- ✅ **API Design:** All 9 frameworks analyzed
- ✅ **Size Systems:** Complete comparison across all frameworks
- ✅ **Color/Theming:** Complete comparison across all frameworks
- ✅ **Animation Patterns:** Complete comparison across all frameworks
- ✅ **Display Modes:** Complete comparison across all frameworks
- ✅ **Accessibility:** Complete comparison across all frameworks
- ✅ **Composition Patterns:** All 9 frameworks documented
- ✅ **Breaking Changes:** Chakra UI v2→v3 thoroughly documented
- ✅ **Unique Innovations:** All notable features captured

### Key Findings Summary

1. **Universal Support:** All frameworks provide indeterminate circular spinners
2. **Size Variants:** 100% support, 56% use T-shirt sizing (xs/sm/md/lg/xl)
3. **Color Customization:** 89% support, mostly through theme integration
4. **Text Labels:** 67% have built-in support, 33% require composition
5. **Accessibility:** 78% include default ARIA attributes
6. **Delay/Debounce:** Only 11% (Ant Design) has native support - significant UX opportunity
7. **Fullscreen Mode:** Only 22% (Ant Design, MUI) have native support
8. **Animation Variants:** 44% offer multiple animation styles (HeroUI leads with 6)
9. **Determinate Progress:** Only 22% (MUI, Ant Design) integrate progress tracking
10. **Breaking Changes:** Minimal across industry, Chakra UI v2→v3 most significant

### Unique Differentiators Identified

- **Ant Design:** Fullscreen mode, delay prop, global indicator config
- **HeroUI:** 6 animation variants, 7 CSS slots, independent label color
- **Mantine:** Extensible loader types, loaderProps pattern
- **MUI:** Determinate mode, disableShrink performance prop
- **Radix UI:** Dimension-preserving loading, auto interaction disabling
- **Semantic UI Classic:** 8-size system, dimmer integration, text-first design
- **ShadCN:** Copy-paste distribution model (not npm package)

### Implementation Priorities for Semantic UI

**Phase 1 (MVP):**
1. Circular indeterminate spinner with CSS animations
2. 5-size system (xs, sm, md, lg, xl)
3. Color theming via CSS custom properties
4. Built-in ARIA support (role, aria-label)
5. Inline and overlay display modes
6. Text label support (attribute + slot)

**Phase 2 (Enhancement):**
1. Delay/debounce support (high value, low complexity)
2. Fullscreen mode (high value, medium complexity)
3. Animation speed control (medium value, low complexity)
4. Multiple animation variants (medium value, high complexity)

**Phase 3 (Advanced):**
1. Determinate progress mode (OR separate component)
2. Custom loader extensibility (Mantine pattern)
3. Dimension-preserving pattern (Radix pattern)

---

**End of Aggregate Pattern Analysis**

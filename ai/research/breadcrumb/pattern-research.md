# Component Pattern Research: Breadcrumb

> Last Modified: 2025-11-05
> Last Reviewed: 2025-11-10 (by Codex)

## Research Summary
- **Frameworks surveyed**: 9
- **Date**: 2025-11-05
- **Unique patterns identified**: 28
- **Frameworks researched**: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Semantic UI Classic, ShadCN

## Component Definition Consensus

Across all frameworks, breadcrumbs consistently serve to:
- **Display hierarchical navigation** showing the user's current location within a site's structure
- **Provide navigational context** through a trail of links from root to current page
- **Enable upward navigation** allowing users to move to parent pages in the hierarchy

The mental model is universally understood as a "trail of breadcrumbs" (Hansel and Gretel metaphor) with visual separators between each hierarchical level.

## Terminology Variations

### Component Names
- **"Breadcrumb"** (singular): 6 frameworks - Ant Design, Chakra UI, Nuxt UI, PrimeReact, Semantic UI, ShadCN
- **"Breadcrumbs"** (plural): 3 frameworks - HeroUI, Mantine, MUI

### Architectural Patterns
- **Composition-based** (children): 7 frameworks - Chakra UI, HeroUI, Mantine, MUI, Nuxt UI (hybrid), Semantic UI, ShadCN
- **Data-driven** (items array): 3 frameworks - Ant Design (v5.3.0+), PrimeReact, Nuxt UI (hybrid)

### Current Page Terminology
- `isCurrentPage` prop - Chakra UI v2
- `isCurrent` prop - HeroUI
- `BreadcrumbPage` component - ShadCN
- `CurrentLink` component - Chakra UI v3
- `.active` class - Semantic UI
- Last item convention (no href) - Ant Design, MUI, Mantine, PrimeReact

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Text links | Clickable text navigation items | 9/9 (100%) | **Level 1** | Native/Composed | All frameworks |
| Icon support | Icons within or alongside breadcrumb items | 7/9 (78%) | **Level 2** | Native/Composed | Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, ShadCN |
| Custom separators | User-defined separator content (text, icons, components) | 9/9 (100%) | **Level 1** | Native (8) / CSS (PrimeReact) | All frameworks |
| Dropdown menus | Collapsible menu for nested or hidden navigation | 6/9 (67%) | **Level 2** | Native/Composed | Ant Design, Chakra UI v3, HeroUI, MUI, Nuxt UI, ShadCN |
| Avatar support | Avatar images for user-based navigation | 1/9 (11%) | **Level 5** | Native | Nuxt UI only |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Simple breadcrumb | Basic text links with separators | 9/9 (100%) | **Level 1** | All frameworks |
| Icon breadcrumb | Breadcrumb items with icons | 7/9 (78%) | **Level 2** | Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, ShadCN |
| Router-integrated | Seamless integration with routing libraries | 7/9 (78%) | **Level 2** | Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, ShadCN |
| With dropdown | Dropdown menus for nested navigation or overflow | 6/9 (67%) | **Level 2** | Ant Design, Chakra UI v3, HeroUI, MUI, Nuxt UI, ShadCN |
| With ellipsis | Collapsed/truncated breadcrumbs with expand | 4/9 (44%) | **Level 3** | Chakra UI v3, HeroUI, MUI, ShadCN |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Current page | Indication of current location (last item) | 9/9 (100%) | **Level 1** | All frameworks |
| Clickable/non-clickable | Distinction between links and text | 9/9 (100%) | **Level 1** | All frameworks |
| Disabled items | Items that cannot be interacted with | 5/9 (56%) | **Level 3** | HeroUI, MUI, PrimeReact, Nuxt UI, ShadCN |
| Focus states | Visual feedback for keyboard navigation | 9/9 (100%) | **Level 1** | All frameworks (via browser defaults or custom) |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Separator styles | Custom separator appearance (/, >, •, icons) | 9/9 (100%) | **Level 1** | All frameworks |
| Size options | Different breadcrumb sizes (sm, md, lg) | 3/9 (33%) | **Level 4** | Chakra UI, HeroUI, Semantic UI (native); others CSS-only |
| Responsive behavior | Automatic collapse/truncation on small screens | 4/9 (44%) | **Level 3** | Chakra UI, HeroUI, MUI, ShadCN |
| Color variants | Different color schemes or themes | 2/9 (22%) | **Level 4** | HeroUI (6 colors), Nuxt UI (theme-based) |
| Visual variants | Different visual styles (solid, bordered, light) | 1/9 (11%) | **Level 5** | HeroUI only |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Click navigation | Standard link click behavior | 9/9 (100%) | **Level 1** | All frameworks |
| Router integration | Integration with React Router, Next.js, etc. | 7/9 (78%) | **Level 2** | Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, ShadCN |
| Programmatic navigation | onClick handlers or router.push() | 7/9 (78%) | **Level 2** | Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, ShadCN |
| Expand collapsed items | Button/interaction to show hidden breadcrumbs | 3/9 (33%) | **Level 4** | HeroUI (renderEllipsis), MUI (expandText), ShadCN (ellipsis) |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Keyboard navigation | Tab, Enter, Space key support | 9/9 (100%) | **Level 1** | All frameworks |
| Semantic HTML | `<nav>` element with proper structure | 8/9 (89%) | **Level 1** | All except PrimeReact (undocumented) |
| aria-label | Navigation landmark labeling | 5/9 (56%) | **Level 3** | Chakra UI, HeroUI, MUI, Nuxt UI, ShadCN |
| aria-current | Current page indicator for screen readers | 3/9 (33%) | **Level 4** | Chakra UI, HeroUI (data-current), ShadCN |
| Separator hidden from screen readers | role="presentation" on separators | 2/9 (22%) | **Level 4** | Chakra UI, MUI |

## Notable Patterns

### Highly Adopted (Level 1: 90-100%)

**Universal breadcrumb foundations:**
- Text links with hierarchical navigation (100%)
- Custom separator configuration (100% – PrimeReact via CSS)
- Simple breadcrumb trails (100%)
- Current page indication (100%)
- Click navigation (100%)
- Keyboard navigation support (100%)

These patterns represent the **core breadcrumb contract** - every framework implements them in some form.

### Common Patterns (Level 2: 70-89%)

**Emerging standards:**
- **Icon support (78%)**: Documented native/composed icon usage in 7 frameworks
- **Router/programmatic integration (78%)**: Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, ShadCN tie into routers and navigation callbacks
- **Dropdown menu integration (67%)**: Growing pattern for nested navigation or overflow handling
  - Ant Design: Native `menu` prop on items
  - Chakra UI v3: Portal-based menu with `asChild`
  - HeroUI: Custom `renderEllipsis` function
  - MUI: Manual Menu composition
  - Nuxt UI: Slot-based dropdown integration
  - ShadCN: BreadcrumbEllipsis component

### Moderate Adoption (Level 3: 40-69%)

**Context-dependent features:**
- **Disabled items (56%)**: Supported by modern frameworks
- **Responsive behavior (44%)**: Growing concern for mobile UX
- **aria-label support (56%)**: Accessibility focus increasing
- **Ellipsis/collapse (44%)**: Handling long breadcrumb trails

### Occasional Patterns (Level 4: 20-39%)

**Specialized features:**
- **Size variants (33%)**: Native options limited to Chakra UI, HeroUI, and Semantic UI Classic
- **Expand collapsed items (33%)**: Different approaches to revealing hidden breadcrumbs
- **Color variants (22%)**: Theme-specific implementations
- **Separator role="presentation" (22%)**: Advanced accessibility consideration

### Rare Patterns (Level 5: <20%)

**Framework-specific innovations:**
- **Visual variants (11%)**: HeroUI's solid/bordered/light styles
- **Avatar support (11%)**: Nuxt UI's unique user-based navigation
- **Underline system (11%)**: HeroUI's 5-mode underline (none/hover/always/active/focus)
- **Global icon configuration (11%)**: Nuxt UI's appConfig pattern
- **Slot-based customization (22%)**: HeroUI and Nuxt UI's granular slot systems

## Pattern Correlations

### When dropdown menus exist:
- **67% include ellipsis/collapse** (4/6 frameworks with dropdowns also have ellipsis)
- Indicates dropdowns often serve overflow/truncation use cases

### When responsive behavior exists:
- **100% include max-items or ellipsis** (4/4 responsive frameworks)
- Responsive design strongly correlates with item truncation

### Composition vs. Data-driven:
- **Composition-based (78%)**: 7/9 frameworks use children/slots
- **Data-driven (22%)**: Only Ant Design and PrimeReact are purely array-based
- **Hybrid (11%)**: Nuxt UI supports both patterns

### Accessibility completeness:
- Frameworks with `aria-label` → **60% have aria-current** (3/5)
- Comprehensive accessibility is bundled, not piecemeal

## Implementation Notes

### API Design Patterns

**Three main architectural approaches emerged:**

1. **Composition-based (78%)**
   - Pattern: `<Breadcrumb><BreadcrumbItem>...</BreadcrumbItem></Breadcrumb>`
   - Frameworks: Chakra UI, HeroUI, Mantine, MUI, Semantic UI, ShadCN, Nuxt UI (hybrid)
   - Benefits: Maximum flexibility, familiar JSX patterns
   - Tradeoffs: More verbose, manual structure

2. **Data-driven (22%)**
   - Pattern: `<Breadcrumb items={[{label, href}]} />`
   - Frameworks: Ant Design (v5.3.0+), PrimeReact
   - Benefits: Concise, easy to generate from routes
   - Tradeoffs: Less flexible for custom content

3. **Hybrid (11%)**
   - Pattern: Supports both composition and data
   - Framework: Nuxt UI
   - Benefits: Flexibility for different use cases

### Router Integration Patterns

Frameworks use different mechanisms for router integration:

- **`as` prop** - Chakra UI v2 (`as={Link}`)
- **`asChild` pattern** - Chakra UI v3, ShadCN (`asChild` from Radix)
- **`component` prop** - MUI (`component={RouterLink}`)
- **`itemRender` function** - Ant Design (render function for custom links)
- **`command` callback** - PrimeReact (programmatic navigation)
- **`to` prop** - Nuxt UI (NuxtLink integration)
- **Direct href** - Mantine, Semantic UI (standard anchor behavior)

### Separator Implementation

**Two main approaches:**

1. **Global separator prop** (78%): Single separator for all items
   - Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, ShadCN
   - PrimeReact requires CSS overrides on `.p-breadcrumb-chevron`

2. **Per-item separators** (22%): Individual control
   - Ant Design (`Breadcrumb.Separator`), Chakra UI (item-level override)

3. **Icon vs. text** (100%): All frameworks support both

### Version Evolution Trends

**Ant Design** (v4 → v5):
- Shift from composition (`<Breadcrumb.Item>`) to data-driven (`items` array)
- Added dropdown menu support (v4.24.0)
- Deprecated overlay in favor of menu prop

**Chakra UI** (v2 → v3):
- Shift from props (`isCurrentPage`) to compositional components (`Breadcrumb.CurrentLink`)
- Introduced Radix-inspired "dot notation" API
- Added `asChild` pattern replacing `as` prop
- New `Breadcrumb.Ellipsis` component

**Common trends:**
- **Moving toward composition**: More granular component APIs
- **Improved accessibility**: Better ARIA support in newer versions
- **Responsive awareness**: Adding collapse/truncation features
- **TypeScript-first**: Stronger type inference and exports

### Naming Conventions

**Component naming patterns:**

- **Item containers**: `BreadcrumbItem` (majority), `BreadcrumbMenuItem` (Chakra v3 for dropdown)
- **Links**: `BreadcrumbLink` (most), `Link` with href (MUI), `Anchor` (Mantine)
- **Current page**: `Breadcrumb.CurrentLink` (Chakra v3), `BreadcrumbPage` (ShadCN), `Typography` (MUI), last item (Ant Design)
- **Separators**: `BreadcrumbSeparator` (most), `separator` prop (all), `divider` (Semantic UI)
- **Ellipsis**: `BreadcrumbEllipsis` (Chakra v3, ShadCN), `renderEllipsis` (HeroUI)

## Accessibility Insights

### Comprehensive vs. Basic Accessibility

**Comprehensive (5 frameworks):**
- Chakra UI, HeroUI, MUI, Nuxt UI, ShadCN
- Features: `aria-label`, semantic `<nav>`, proper keyboard nav, some with `aria-current`

**Basic (4 frameworks):**
- Ant Design, Mantine, PrimeReact, Semantic UI
- Features: Keyboard navigation through standard links, limited ARIA documentation

### Best Practice Patterns

1. **Semantic HTML** (89%):
   - Use `<nav>` element as landmark
   - Render as ordered list `<ol>` (MUI, Chakra, others)
   - Clear hierarchical structure

2. **ARIA Labeling** (56%):
   - `aria-label="breadcrumb"` on navigation landmark
   - Helps screen reader users identify navigation type

3. **Current Page Indication** (44% with aria-current):
   - `aria-current="page"` on last item
   - Some use `data-current` attribute instead

4. **Separator Handling** (22% explicit):
   - `role="presentation"` or `aria-hidden="true"` on separators
   - Prevents screen readers from announcing separators

5. **Keyboard Navigation** (100%):
   - Standard Tab/Shift+Tab for focus management
   - Enter/Space for activation
   - Focus rings for visibility

## Framework-Specific Innovations

### Ant Design
- **Dual API Support**: Both composition and data-driven (migration path)
- **itemRender Function**: Universal router integration without framework lock-in
- **Menu Prop**: Native dropdown support on items

### Chakra UI
- **Version 3 Transformation**: Complete API redesign with "dot notation"
- **asChild Pattern**: Radix UI-inspired composition
- **Ellipsis Component**: Built-in collapse indicator

### HeroUI
- **renderEllipsis**: Unique function-based customization for collapsed items
- **Underline System**: Five modes (none, hover, always, active, focus)
- **Data Attributes**: `data-current`, `data-disabled` for CSS-based styling
- **Visual Variants**: Solid, bordered, light styles

### Mantine
- **Minimalist Approach**: Component only handles separation logic
- **Pure Composition**: Maximum flexibility through children
- **separatorMargin**: Fine-grained spacing control

### MUI
- **maxItems with Auto-collapse**: Built-in responsive truncation
- **itemsBeforeCollapse / itemsAfterCollapse**: Configurable collapse behavior
- **expandText Prop**: Localizable expand button text
- **WAI-ARIA Reference**: Explicit accessibility documentation

### Nuxt UI
- **Hybrid API**: Supports both items array and composition
- **Avatar Support**: Unique user-based navigation pattern
- **Global Config**: App-wide icon customization via appConfig
- **Dynamic Slots**: Named slots via `item.slot` property
- **TypeScript-first**: Full type inference with exported interfaces

### PrimeReact
- **MenuModel API**: Shared API across all menu components
- **Separate Home Prop**: Explicit home configuration
- **Template System**: Complete render customization per item
- **Command vs URL**: Clear separation of navigation patterns

### Semantic UI Classic
- **Pure CSS Component**: No JavaScript required
- **Seven Size Scale**: mini, tiny, small, medium, large, big, huge, massive
- **Class-based API**: Human-readable class names
- **Icon Dividers**: Deep integration with icon system

### ShadCN
- **Copy-paste Distribution**: Full source code customization
- **Seven Sub-components**: Highly granular composition
- **Radix UI Foundation**: Accessibility and composition patterns
- **BreadcrumbEllipsis**: Dedicated collapse component

## Recommendations for Implementation

### Core Features (Must Have)
Based on Level 1 patterns (100% adoption):
1. Text links with hierarchical navigation
2. Custom separator configuration (text or icon separators)
3. Clear current page indication (non-clickable last item)
4. Click navigation with predictable focus/activation
5. Keyboard navigation support (Tab/Enter) with visible focus
6. Semantic HTML landmarks (`<nav>` with ordered/unordered lists)

### Standard Features (Should Have)
Based on Level 2-3 patterns (40-89% adoption):
1. Icon support within breadcrumb items (78%)
2. Router/programmatic integration hooks (78%)
3. Dropdown menu integration for nested navigation (67%)
4. Responsive collapse/ellipsis for long paths (56%)
5. Disabled state for items (56%)
6. `aria-label` support on the navigation landmark (56%)

### Enhanced Features (Nice to Have)
Based on Level 4-5 patterns (<40% adoption):
1. `aria-current` helpers baked into the API
2. Color/theme variants
3. Visual style variants (bordered, etc.)
4. Separator customization with role/presentation helpers
5. Avatar support for user navigation
6. Advanced slot/template systems

### API Design Recommendations

1. **Primary API**: Composition-based (78% of frameworks)
   - More familiar to React developers
   - Greater flexibility for custom content

2. **Optional API**: Data-driven items array (for route-based generation)
   - Useful for programmatic breadcrumb generation

3. **Router Integration**: Support multiple patterns
   - `asChild` pattern (modern, type-safe)
   - `as` prop (simpler but less type-safe)
   - `component` prop (MUI-style)

4. **Separator Design**: Global with per-item override
   - Default separator prop on container
   - Optional separator component for fine control

5. **Current Page**: Dedicated component or prop
   - `<Breadcrumb.CurrentLink>` component (Chakra v3 pattern)
   - `<BreadcrumbPage>` component (ShadCN pattern)
   - OR `isCurrent` prop (HeroUI pattern)

## Raw Data

Individual framework reports available at:
- `ai/research/breadcrumb/ant-design/usage-patterns.md`
- `ai/research/breadcrumb/chakra-ui/usage-patterns.md`
- `ai/research/breadcrumb/heroui/usage-patterns.md`
- `ai/research/breadcrumb/mantine/usage-patterns.md`
- `ai/research/breadcrumb/mui/usage-patterns.md`
- `ai/research/breadcrumb/nuxt-ui/usage-patterns.md`
- `ai/research/breadcrumb/primereact/usage-patterns.md`
- `ai/research/breadcrumb/semantic-ui-classic/usage-patterns.md`
- `ai/research/breadcrumb/shadcn/usage-patterns.md`

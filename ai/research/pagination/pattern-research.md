# Component Pattern Research: Pagination

> Last Modified: 2025-11-06

## Research Summary
- Frameworks surveyed: 10
- Date: 2025-11-06
- Unique patterns identified: 50+
- Terminology note: Most frameworks use "Pagination", Angular Material and PrimeReact use "Paginator"

## Component Definition Consensus

Pagination components provide navigation controls for dividing large datasets across multiple pages. All frameworks conceptualize this as:

**Core Purpose**: Enable users to navigate through multi-page content efficiently without overwhelming the interface with too much data at once.

**Mental Model**: A horizontal navigation control bar (typically at the bottom of content) that shows:
- Current position in the dataset
- Available pages to navigate to
- Navigation actions (previous, next, first, last)

**Common Use Cases** (documented across frameworks):
- Data tables and grids
- Search results
- Product listings
- Blog archives
- API responses with page limits

## Terminology Variations

### Component Names
- **"Pagination"** - 8 frameworks (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Shadcn UI, Semantic UI)
- **"Paginator"** - 2 frameworks (Angular Material, PrimeReact)

### Terminology for Controls
- **Previous/Next**: Universal term
- **First/Last**: Most common for boundary buttons
- **Items/Rows per page**: Interchangeable for page size
- **Zero-based vs One-based indexing**:
  - Zero-based: Angular Material (TablePagination), MUI TablePagination
  - One-based: All standalone pagination components

### Props/API Naming
- **Total count**: `total` (8), `totalRecords` (1), `count` (1)
- **Page size**: `pageSize` (6), `itemsPerPage` (2), `rowsPerPage` (2)
- **Current page**: `page` (7), `current` (1), `first` (1), `defaultPage` (uncontrolled)
- **Change handler**: `onChange` (7), `onPageChange` (2), `v-model` (1)

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Page numbers | Numbered buttons for direct page access | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Previous/Next buttons | Sequential navigation controls | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Ellipsis indicator | Visual indicator for skipped page ranges ("...") | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| First/Last buttons | Jump to boundary pages | 9/10 (90%) | **Level 1 (Universal)** | All except Shadcn UI (no dedicated component) |
| Page size selector | Dropdown to change items per page | 3/10 (30%) | **Level 4 (Occasional)** | Ant Design, PrimeReact, MUI (TablePagination only) |
| Total count display | Shows "X-Y of Z items" or similar | 3/10 (30%) | **Level 4 (Occasional)** | Angular Material, PrimeReact, MUI (TablePagination only) |
| Quick jumper | Input field for direct page number entry | 2/10 (20%) | **Level 5 (Rare)** | Ant Design, PrimeReact |

### Architectural Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Controlled mode | External state management with props | 9/10 (90%) | **Level 1 (Universal)** | All except Shadcn UI, Semantic UI (presentational only) |
| Uncontrolled mode | Component manages own state | 7/10 (70%) | **Level 2 (Common)** | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI |
| onChange callback | Event handler for page changes | 8/10 (80%) | **Level 1 (Universal)** | All except Nuxt UI (v-model), Shadcn UI, Semantic UI |
| Compound components | Sub-components for composition | 3/10 (30%) | **Level 4 (Occasional)** | Chakra UI, Mantine, Shadcn UI |
| Template system | String/function templates for layout | 1/10 (10%) | **Level 5 (Rare)** | PrimeReact |
| Render props | Function children pattern | 2/10 (20%) | **Level 5 (Rare)** | Chakra UI, HeroUI |

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Page prop (controlled) | Current page from parent state | 9/10 (90%) | **Level 1 (Universal)** | All except Shadcn UI, Semantic UI |
| DefaultPage prop (uncontrolled) | Initial page for internal state | 7/10 (70%) | **Level 2 (Common)** | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI |
| PageSize state tracking | Manage items per page | 8/10 (80%) | **Level 1 (Universal)** | All except Shadcn UI, Semantic UI |
| Zero-based indexing | Pages start at 0 | 2/10 (20%) | **Level 5 (Rare)** | Angular Material, MUI TablePagination |
| One-based indexing | Pages start at 1 | 8/10 (80%) | **Level 1 (Universal)** | Most frameworks |
| v-model binding | Vue reactive binding | 1/10 (10%) | **Level 5 (Rare)** | Nuxt UI |

### Display Configuration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Sibling count control | Pages shown around current | 7/10 (70%) | **Level 2 (Common)** | Ant Design (implied), Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Shadcn UI (manual) |
| Boundary count control | Pages shown at start/end | 5/10 (50%) | **Level 3 (Moderate)** | HeroUI, Mantine, MUI, Nuxt UI, Shadcn UI (manual) |
| Show/hide controls | Toggle first/last/prev/next buttons | 7/10 (70%) | **Level 2 (Common)** | Ant Design (implied), Angular Material, Chakra UI, Mantine, MUI, Nuxt UI, Shadcn UI |
| Show edges | Always show first/last pages | 3/10 (30%) | **Level 4 (Occasional)** | Mantine, Nuxt UI, HeroUI |
| Ellipsis jump | Click ellipsis to jump pages | 1/10 (10%) | **Level 5 (Rare)** | HeroUI (dotsJump prop) |

### Size and Style Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size variants | Small, medium, large options | 8/10 (80%) | **Level 1 (Universal)** | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact (manual), Shadcn UI (manual) |
| Shape variants | Circular vs rounded corners | 2/10 (20%) | **Level 5 (Rare)** | HeroUI, MUI |
| Visual variants | Outlined, filled, text styles | 5/10 (50%) | **Level 3 (Moderate)** | Chakra UI, HeroUI, MUI, Nuxt UI, Shadcn UI |
| Color customization | Active/inactive color control | 6/10 (60%) | **Level 3 (Moderate)** | Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI |
| Disabled state | Full component disable | 8/10 (80%) | **Level 1 (Universal)** | All except Shadcn UI, Semantic UI |
| Compact/simplified mode | Minimal UI variant | 7/10 (70%) | **Level 2 (Common)** | Ant Design, Angular Material, HeroUI, Mantine, Nuxt UI, PrimeReact, Shadcn UI |

### Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Custom icon replacement | Replace default nav icons | 7/10 (70%) | **Level 2 (Common)** | Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Semantic UI |
| ItemRender/renderItem | Custom page item rendering | 5/10 (50%) | **Level 3 (Moderate)** | Ant Design, HeroUI, Mantine, MUI, PrimeReact |
| Custom ARIA labels | Accessibility label customization | 4/10 (40%) | **Level 3 (Moderate)** | Chakra UI, HeroUI, MUI, PrimeReact |
| CSS class overrides | Style customization via classes | 9/10 (90%) | **Level 1 (Universal)** | All except Angular Material (theme-based) |
| Theme integration | Framework theme system support | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |

### Routing Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| URL link mode | Render as anchor tags | 4/10 (40%) | **Level 3 (Moderate)** | Chakra UI, MUI, Nuxt UI, Shadcn UI |
| Router integration | Built-in router support | 3/10 (30%) | **Level 4 (Occasional)** | Chakra UI (getPageUrl), Nuxt UI (to prop), Shadcn UI (href) |
| Button mode (default) | Interactive buttons with callbacks | 8/10 (80%) | **Level 1 (Universal)** | Most frameworks default to this |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| ARIA attributes | aria-label, aria-current support | 9/10 (90%) | **Level 1 (Universal)** | All except Semantic UI (manual implementation) |
| Keyboard navigation | Tab, Enter, Space support | 10/10 (100%) | **Level 1 (Universal)** | All frameworks (basic browser support minimum) |
| Screen reader support | ARIA live regions, role attributes | 7/10 (70%) | **Level 2 (Common)** | Angular Material, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, Shadcn UI |
| Custom aria-label functions | Programmatic label generation | 4/10 (40%) | **Level 3 (Moderate)** | Chakra UI, HeroUI, MUI, PrimeReact |
| Semantic HTML | nav element, proper roles | 8/10 (80%) | **Level 1 (Universal)** | All except Ant Design, Semantic UI (menu-based) |

### Data Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Client-side pagination | Slice local data arrays | 10/10 (100%) | **Level 1 (Universal)** | All frameworks support this pattern |
| Server-side pagination | Fetch data per page | 10/10 (100%) | **Level 1 (Universal)** | All frameworks support this pattern |
| Table integration | Built-in table component support | 3/10 (30%) | **Level 4 (Occasional)** | Ant Design, Angular Material, MUI |
| Data slicing helper | Built-in slice() method | 1/10 (10%) | **Level 5 (Rare)** | Chakra UI |
| Page range calculation | Built-in pageRange property | 2/10 (20%) | **Level 5 (Rare)** | Chakra UI, HeroUI (implicit) |

### Advanced Features

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Loop/circular navigation | Wrap around at boundaries | 1/10 (10%) | **Level 5 (Rare)** | HeroUI |
| Auto-hide on single page | Hide when only 1 page | 1/10 (10%) | **Level 5 (Rare)** | Ant Design |
| Responsive adaptation | Mobile-friendly adjustments | 2/10 (20%) | **Level 5 (Rare)** | Ant Design, MUI |
| Loading state | Built-in loading UI | 0/10 (0%) | **Not present** | None (handled externally via disabled state) |
| Animation control | Disable/customize animations | 1/10 (10%) | **Level 5 (Rare)** | HeroUI |
| Shadow effects | Visual depth styling | 1/10 (10%) | **Level 5 (Rare)** | HeroUI |
| Left/right content slots | Custom content injection | 1/10 (10%) | **Level 5 (Rare)** | PrimeReact |
| Headless hook | Unstyled logic-only hook | 1/10 (10%) | **Level 5 (Rare)** | HeroUI (usePagination) |

## Notable Patterns

### Highly Adopted (Level 1-2) - Industry Standards

These patterns represent the core expectations users have for pagination components:

**Universal Patterns (100%)**:
- Page numbers with clickable buttons
- Previous/Next navigation buttons
- Ellipsis indicators for large page ranges
- Keyboard navigation (minimum browser support)
- Theme system integration

**Near-Universal (80-90%)**:
- First/Last boundary buttons (90%)
- Controlled mode with external state (90%)
- Size variants (80%)
- Disabled state support (80%)
- onChange callback pattern (80%)
- ARIA attributes (90%)

These patterns should be considered **essential** for any modern pagination component.

### Emerging Patterns (Level 3-4) - Growing Adoption

These patterns are becoming increasingly common but not yet universal:

**Moderate Adoption (40-69%)**:
- Display configuration (sibling/boundary count): 50-70%
- Color customization: 60%
- Custom icon replacement: 70%
- Compact/simplified modes: 70%
- URL/router integration: 30-40%

**Occasional Adoption (20-39%)**:
- Page size selector: 30%
- Total count display: 30%
- Custom ARIA label functions: 40%

These patterns indicate **evolving best practices** where the community is still exploring optimal solutions.

### Unique Innovations (Level 5) - Framework-Specific

These rare patterns represent unique approaches that may indicate innovation or niche use cases:

**Architectural Innovations**:
- **PrimeReact's template system**: String-based layout tokens with callback customization
- **Chakra UI's data slicing helper**: Built-in `slice()` method for array pagination
- **HeroUI's headless hook**: Completely unstyled logic-only API

**UX Innovations**:
- **HeroUI's clickable ellipsis**: Jump multiple pages by clicking dots (dotsJump)
- **HeroUI's loop navigation**: Circular wraparound at boundaries
- **Ant Design's auto-hide**: Automatically hide on single page

**Integration Innovations**:
- **Nuxt UI's v-model binding**: Native Vue reactivity integration
- **Chakra UI's button/link mode**: Switch between SPA and SEO-friendly pagination
- **PrimeReact's content slots**: Left/right content injection points

## Pattern Correlations

### When Feature X Exists → Feature Y is Present

**Strong Correlations**:
- **Size variants** → Custom styling support (8/8 = 100%)
- **Controlled mode** → onChange callback (8/9 = 89%)
- **First/Last buttons** → Sibling/boundary configuration (5/9 = 56%)
- **Custom rendering** → ARIA customization (4/5 = 80%)
- **Table integration** → Page size selector (3/3 = 100%)

**Notable Exclusions**:
- **Compound components** → **No** template system (3 compound vs 1 template, mutually exclusive)
- **Presentational only** (Shadcn, Semantic) → **No** state management patterns
- **Page size selector** → **Usually** includes total count display (3/3 = 100%)

### Architectural Pattern Families

**Family 1: All-in-One Batteries-Included** (4 frameworks)
- Ant Design, HeroUI, MUI, PrimeReact
- Characteristics: Comprehensive features, page size selectors, total count, quick jumpers
- Best for: Enterprise applications, data-heavy interfaces

**Family 2: Core Pagination** (4 frameworks)
- Angular Material, Chakra UI, Mantine, Nuxt UI
- Characteristics: Essential features only, focused on page navigation
- Best for: General-purpose applications, flexible integration

**Family 3: Compositional/Presentational** (2 frameworks)
- Shadcn UI, Semantic UI
- Characteristics: Minimal JavaScript, HTML/CSS focused, manual state management
- Best for: Custom implementations, framework-agnostic needs

### State Management Approaches

**Controlled-Only** (1 framework):
- PrimeReact
- Must manage state externally, no internal state option

**Dual-Mode (Controlled + Uncontrolled)** (7 frameworks):
- Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI
- Flexible integration, works standalone or with state management

**Presentational-Only** (2 frameworks):
- Shadcn UI, Semantic UI
- No state management, purely visual components

## Implementation Notes

### Common API Patterns

**Minimal API** (required props only):
```typescript
<Pagination
  total={100}           // Total items
  page={1}              // Current page (controlled)
  onChange={handler}    // Page change handler
/>
```

**Standard API** (common optional props):
```typescript
<Pagination
  total={100}
  page={1}
  pageSize={10}
  onChange={handler}
  showFirstButton
  showLastButton
  siblingCount={1}
  boundaryCount={1}
  disabled={loading}
/>
```

**Advanced API** (full customization):
```typescript
<Pagination
  // Core
  total={100}
  page={1}
  pageSize={10}
  onChange={handler}

  // Display
  siblingCount={2}
  boundaryCount={1}
  showControls={true}

  // Styling
  size="md"
  variant="outlined"
  color="primary"

  // Customization
  renderItem={customRenderer}
  getItemAriaLabel={ariaFunction}

  // Router integration
  to={(page) => `/items?page=${page}`}
/>
```

### Design System Considerations

**Material Design Approach** (Angular Material, MUI):
- Range display ("1-10 of 100") instead of discrete pages
- Strong emphasis on table integration
- Built-in internationalization

**Enterprise Approach** (Ant Design, PrimeReact):
- Comprehensive feature sets
- Page size selectors and quick jumpers
- Template customization systems

**Modern Web Approach** (Chakra UI, Mantine, HeroUI):
- Compound component architecture
- Composition over configuration
- Headless patterns available

**Minimal Approach** (Shadcn UI, Semantic UI):
- Presentational components only
- Framework-agnostic
- Developer implements behavior

### Performance Considerations

**Client-Side Pagination** (pattern seen in all frameworks):
```typescript
const startIndex = (page - 1) * pageSize;
const currentItems = allItems.slice(startIndex, startIndex + pageSize);
```

**Server-Side Pagination** (pattern seen in all frameworks):
```typescript
useEffect(() => {
  fetch(`/api/items?page=${page}&limit=${pageSize}`)
    .then(res => res.json())
    .then(data => setItems(data.items));
}, [page, pageSize]);
```

**Optimization Patterns**:
- Disable component during loading (8/10 frameworks)
- Debounce page changes (0/10 documented, but common practice)
- Prefetch adjacent pages (0/10 built-in, manual implementation)
- Memoize page range calculations (implied in all frameworks)

### Accessibility Implementation Levels

**Level 1 - Basic** (2 frameworks):
- Semantic UI (manual implementation)
- Standard HTML keyboard navigation only

**Level 2 - Standard** (4 frameworks):
- Ant Design, HeroUI, Mantine, Nuxt UI
- ARIA attributes, keyboard support, proper roles

**Level 3 - Comprehensive** (4 frameworks):
- Angular Material, Chakra UI, MUI, PrimeReact
- Custom ARIA labels, screen reader announcements, focus management

## Framework-Specific Highlights

### Ant Design
- **Most comprehensive**: Quick jumper, page size selector, responsive, auto-hide
- **Enterprise focus**: Extensive configuration options
- **Locale support**: Built-in internationalization

### Angular Material
- **Material Design strict**: Range display instead of discrete pages
- **Best table integration**: MatTableDataSource automatic binding
- **i18n excellence**: MatPaginatorIntl service for full customization
- **Accessibility leader**: Recent PRs addressing keyboard navigation edge cases

### Chakra UI
- **Ark UI foundation**: Built on headless component library
- **Context API power**: Full state access via render props
- **Data slicing helper**: Built-in array slicing convenience
- **Dual mode**: Button or link rendering for SPA/SEO needs

### HeroUI/NextUI
- **Clickable ellipsis**: Unique UX innovation for quick page jumps
- **Headless hook**: usePagination for custom implementations
- **Loop navigation**: Circular pagination option
- **Nine customization slots**: Deep styling control

### Mantine
- **Compound components**: Highly flexible composition
- **Icon customization**: All navigation icons replaceable
- **Link integration**: getItemProps/getControlProps for router support
- **Clean API**: Well-designed prop naming and structure

### MUI
- **Dual components**: Pagination + TablePagination for different use cases
- **Material Design 3**: Latest design system integration
- **Extensive docs**: Most comprehensive documentation
- **Custom rendering**: renderItem with full PaginationItem control

### Nuxt UI
- **Vue-native**: v-model binding and composition API
- **Router integration**: Elegant `to` prop function
- **Theme system**: Deep Nuxt UI theme integration
- **Intelligent collapsing**: Smart page range algorithm

### PrimeReact
- **Template system**: Unique string-token layout system
- **Content slots**: Left/right content injection
- **Controlled-only**: Predictable state management
- **Accessibility strong**: Comprehensive ARIA and keyboard support

### Shadcn UI
- **Presentational only**: Pure UI components without logic
- **Copy-paste philosophy**: Source code to customize
- **Framework-agnostic**: Works with any routing/state solution
- **Compositional**: Build from primitive components

### Semantic UI
- **CSS-first**: Purely presentational, no JavaScript
- **Menu-based**: Pagination as menu variant
- **jQuery-era design**: Classic web development approach
- **Maximum flexibility**: No coupling to any framework

## Recommendations for Semantic UI Next

Based on this research, here are evidence-based recommendations:

### Core Features (Level 1 - Must Have)
These patterns are universal or near-universal (80%+):
- ✅ Numbered page buttons with ellipsis for large ranges
- ✅ Previous/Next navigation buttons
- ✅ First/Last boundary buttons
- ✅ Controlled mode (page + onChange props)
- ✅ Uncontrolled mode (defaultPage prop)
- ✅ Size variants (sm, md, lg minimum)
- ✅ Disabled state
- ✅ ARIA attributes and keyboard navigation
- ✅ CSS customization support

### Standard Features (Level 2-3 - Should Have)
These patterns are common (40-70%):
- ✅ Sibling count configuration (pages around current)
- ✅ Boundary count configuration (pages at start/end)
- ✅ Show/hide control buttons
- ✅ Color customization (active/inactive states)
- ✅ Icon replacement for navigation controls
- ✅ Simplified/compact mode
- ✅ Custom ARIA label functions

### Optional Features (Level 4-5 - Nice to Have)
These patterns are occasional or rare (20-40%):
- ⚠️ Page size selector (only needed for table integration)
- ⚠️ Total count display (only needed for table integration)
- ⚠️ Quick jumper input (rare, 20%)
- ⚠️ Router integration helpers (depends on ecosystem needs)
- ⚠️ Compound component architecture (alternative approach)

### Not Recommended
These patterns appear in <20% of frameworks:
- ❌ Template string systems (PrimeReact-specific)
- ❌ Loop/circular navigation (niche use case)
- ❌ Auto-hide on single page (can be handled externally)
- ❌ Clickable ellipsis jumps (interesting but non-standard)

### Architecture Recommendation

**Recommended Approach**: Follow the **Core Pagination** family pattern (Angular Material, Chakra UI, Mantine, Nuxt UI):
- Focus on essential navigation features
- Provide excellent API for the core use case
- Keep table integration separate (if needed)
- Support both controlled and uncontrolled modes
- Prioritize accessibility and keyboard navigation
- Allow customization through props, not templates

This approach balances:
- ✅ Comprehensive coverage of standard use cases
- ✅ Clean, predictable API
- ✅ Flexibility for advanced needs
- ✅ Maintainability and testability
- ✅ Accessibility compliance

### Design Philosophy Alignment

Semantic UI Next should emphasize:
1. **Semantic HTML** (like current Semantic UI)
2. **Flexibility** (both controlled and uncontrolled)
3. **Accessibility-first** (ARIA, keyboard, screen readers)
4. **Composition** (works well with other components)
5. **Reasonable defaults** (works out of the box, customizable when needed)

## Raw Data

Individual framework reports available at:
- `ai/research/pagination/ant-design/usage-patterns.md`
- `ai/research/pagination/angular-material/usage-patterns.md`
- `ai/research/pagination/chakra-ui/usage-patterns.md`
- `ai/research/pagination/heroui/usage-patterns.md`
- `ai/research/pagination/mantine/usage-patterns.md`
- `ai/research/pagination/mui/usage-patterns.md`
- `ai/research/pagination/nuxt-ui/usage-patterns.md`
- `ai/research/pagination/primereact/usage-patterns.md`
- `ai/research/pagination/shadcn-ui/usage-patterns.md`
- `ai/research/pagination/semantic-ui/usage-patterns.md`

URL verification status: `ai/research/pagination/url-verification.md`

---

**Research Methodology**: Descriptive analysis of 10 major UI frameworks, documenting actual implementation patterns rather than prescriptive recommendations. Pattern prevalence calculated as percentage of frameworks implementing each feature. Usage levels assigned based on prevalence ranges.

**Frameworks Researched**:
1. Ant Design 5.x - https://ant.design/components/pagination
2. Angular Material 19+ - https://material.angular.dev/components/paginator
3. Chakra UI v3 - https://chakra-ui.com/docs/components/pagination
4. HeroUI/NextUI v2.8 - https://www.heroui.com/docs/components/pagination
5. Mantine v8.3.6 - https://mantine.dev/core/pagination/
6. MUI v5/v6 - https://mui.com/material-ui/react-pagination/
7. Nuxt UI 3.0+ - https://ui.nuxt.com/components/pagination
8. PrimeReact 10.9.7 - https://primereact.org/paginator/
9. Shadcn UI Current - https://ui.shadcn.com/docs/components/pagination
10. Semantic UI Classic - https://semantic-ui.com/collections/menu.html#pagination

**Usage Level Scale**:
- Level 1 (Universal): 80-100% adoption
- Level 2 (Common): 60-79% adoption
- Level 3 (Moderate): 40-59% adoption
- Level 4 (Occasional): 20-39% adoption
- Level 5 (Rare): <20% adoption

# Component Pattern Research: Card

> Last Modified: 2025-11-04

## Research Summary
- Frameworks surveyed: 10
- Date: 2025-11-04
- Unique patterns identified: 85+
- Research focus: Structured content containers (NOT basic primitives like Segment/Paper)

## Component Definition Consensus

Across all 10 frameworks, Card components serve as **structured content containers** for organizing related information about a single subject. Key characteristics:

- **Structured content**: Provides predefined sections (header, media, body, actions/footer)
- **Single subject**: Represents one cohesive entity (product, user profile, article, etc.)
- **Semantic organization**: Enforces content hierarchy through sub-components or slots
- **Self-contained**: Typically includes all information and actions related to the subject
- **Visual distinction**: Usually elevated or bordered to distinguish from background

**Mental Model**: A "content card" that groups all information about one thing - think playing cards, business cards, or index cards. Unlike basic containers (Segment/Paper), Cards have opinions about structure.

**Card vs Segment/Paper**:
- **Segment/Paper**: Generic primitive container (no structure)
- **Card**: Structured view component (prescribed sections)

## Terminology Variations

### Component Naming
All frameworks use "Card" (100% consensus) - no alternative terminology found.

### Sub-Component Naming Patterns

| Sub-Component | Common Names | Prevalence |
|---------------|--------------|------------|
| Header | CardHeader, Card.Header, header slot | 10/10 (100%) |
| Body/Content | CardBody, CardContent, Card.Section, children, default slot | 10/10 (100%) |
| Footer/Actions | CardFooter, CardActions, footer slot | 10/10 (100%) |
| Media/Image | CardMedia, header prop, cover, Image | 8/10 (80%) |
| Title | CardTitle, title prop, Card.Meta | 10/10 (100%) |
| Description | CardDescription, subtitle prop, description, Card.Meta | 9/10 (90%) |

### Architectural Patterns

| Pattern | Frameworks | Count |
|---------|-----------|-------|
| **Sub-Component Model** | Ant Design, Chakra UI, HeroUI, Mantine, MUI, ShadCN | 6/10 (60%) |
| **Prop-Based Sections** | PrimeReact, Nuxt UI | 2/10 (20%) |
| **Slot-Based** | Nuxt UI, Radix UI | 2/10 (20%) |
| **Class-Based** | Semantic UI Classic | 1/10 (10%) |

**Note**: Some frameworks use hybrid approaches (e.g., Nuxt UI has both props and slots)

## Pattern Inventory

### Container Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Basic card | Simple bordered/elevated container | 10/10 (100%) | **Level 1** | All |
| Elevation/Shadow | Visual depth via shadows | 9/10 (90%) | **Level 1** | All except Semantic UI |
| Bordered | Border-based containment | 10/10 (100%) | **Level 1** | All |
| Hoverable | Hover state effects | 6/10 (60%) | **Level 3** | Ant Design, Chakra, HeroUI, MUI, Nuxt UI, ShadCN |
| Loading state | Built-in loading skeleton | 2/10 (20%) | **Level 5** | Ant Design, Semantic UI |
| Link card | Entire card as link | 4/10 (40%) | **Level 4** | Semantic UI, Chakra, Mantine, MUI (via CardActionArea) |
| Clickable/Pressable | Interactive card | 7/10 (70%) | **Level 2** | Ant Design, Chakra, HeroUI, Mantine, MUI, Nuxt UI, Radix UI |
| Fluid width | Full-width card | 3/10 (30%) | **Level 4** | Semantic UI, responsive via CSS |
| Card groups | Multiple cards container | 3/10 (30%) | **Level 4** | Semantic UI, grid layouts |

### Content Patterns - Header Section

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Header section | Dedicated header area | 10/10 (100%) | **Level 1** | All |
| Title | Card title/heading | 10/10 (100%) | **Level 1** | All |
| Subtitle/Description | Secondary header text | 9/10 (90%) | **Level 1** | All except Radix UI |
| Avatar | User/entity avatar in header | 5/10 (50%) | **Level 3** | Ant Design (Meta), Chakra, HeroUI, MUI, Semantic UI |
| Header actions | Actions in header area | 5/10 (50%) | **Level 3** | Ant Design, MUI, ShadCN (CardAction), Semantic UI |
| Header template | Custom header JSX | 3/10 (30%) | **Level 4** | PrimeReact, Nuxt UI, Radix UI |

### Content Patterns - Media/Image

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Cover image | Full-width top image | 8/10 (80%) | **Level 2** | Ant Design, Chakra, HeroUI, MUI, Nuxt UI, Radix UI, Semantic UI, ShadCN |
| CardMedia component | Dedicated media sub-component | 2/10 (20%) | **Level 5** | MUI, Ant Design |
| Image in header | Image as header content | 4/10 (40%) | **Level 4** | PrimeReact, Semantic UI, Nuxt UI |
| Background image | Image as background | 1/10 (10%) | **Level 5** | MUI (CardMedia mode) |
| Video support | Video media | 1/10 (10%) | **Level 5** | MUI |
| Inset pattern | Edge-to-edge media with padding | 1/10 (10%) | **Level 5** | Radix UI (Inset component) |

### Content Patterns - Body/Content

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Body section | Main content area | 10/10 (100%) | **Level 1** | All |
| Arbitrary children | Accept any content | 10/10 (100%) | **Level 1** | All |
| Padding control | Internal spacing | 9/10 (90%) | **Level 1** | All except Semantic UI |
| Multiple content blocks | Separate content sections | 3/10 (30%) | **Level 4** | Semantic UI, Mantine (Section), Ant Design (Grid) |
| Meta information | Structured metadata | 3/10 (30%) | **Level 4** | Ant Design (Card.Meta), HeroUI, Semantic UI |
| Description text | Longer description | 8/10 (80%) | **Level 2** | Most frameworks |

### Content Patterns - Footer/Actions

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Footer section | Bottom actions/info area | 10/10 (100%) | **Level 1** | All |
| Action buttons | CTA buttons in footer | 9/10 (90%) | **Level 1** | All except Radix UI |
| Button groups | Multiple buttons layout | 7/10 (70%) | **Level 2** | Ant Design, Chakra, HeroUI, MUI, PrimeReact, Semantic UI, ShadCN |
| Icon actions | Icon-only actions | 5/10 (50%) | **Level 3** | Ant Design, HeroUI, PrimeReact, Semantic UI |
| Social actions | Like/share/comment | 2/10 (20%) | **Level 5** | Chakra (examples), Semantic UI |
| Extra content | Additional footer info | 2/10 (20%) | **Level 5** | Ant Design, Semantic UI |
| Footer template | Custom footer JSX | 2/10 (20%) | **Level 5** | PrimeReact, Nuxt UI |

### Layout Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Vertical structure | Top-to-bottom sections | 10/10 (100%) | **Level 1** | All (default) |
| Horizontal layout | Side-by-side media + content | 5/10 (50%) | **Level 3** | Chakra, HeroUI, MUI, Semantic UI (not standard), ShadCN |
| Responsive direction | Mobile vertical, desktop horizontal | 3/10 (30%) | **Level 4** | Chakra, HeroUI, MUI |
| Grid layouts | Card.Grid internal grids | 2/10 (20%) | **Level 5** | Ant Design, Semantic UI |
| Card groups/grids | Multiple cards layout | 4/10 (40%) | **Level 4** | Semantic UI, all via external grid |
| Stackable | Mobile stacking | 1/10 (10%) | **Level 5** | Semantic UI Classic |
| Column counts | 2-8 cards per row | 1/10 (10%) | **Level 5** | Semantic UI Classic |
| Equal height | Matching card heights | 1/10 (10%) | **Level 5** | Semantic UI Classic |

### Variation Patterns - Visual Variants

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|-------------|-------------|------------|
| Elevation/Shadow levels | Multiple shadow depths | 6/10 (60%) | **Level 3** | Ant Design, Chakra, MUI (0-24), Mantine, Nuxt UI, Radix UI |
| Outlined variant | Border instead of shadow | 6/10 (60%) | **Level 3** | Ant Design (v5.24+), Chakra, MUI, Nuxt UI, Radix UI, Semantic UI |
| Filled/Solid variant | Filled background | 4/10 (40%) | **Level 4** | Chakra, Nuxt UI, Radix UI (surface) |
| Ghost/Subtle variant | Minimal styling | 3/10 (30%) | **Level 4** | Nuxt UI, Radix UI, Chakra (unstyled) |
| Classic variant | Traditional bordered | 1/10 (10%) | **Level 5** | Radix UI |
| Soft variant | Subtle background | 1/10 (10%) | **Level 5** | Nuxt UI |
| Raised variant | Explicit elevation | 2/10 (20%) | **Level 5** | Semantic UI, Chakra |

### Variation Patterns - Size Variants

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|-------------|-------------|------------|
| Size options | Multiple size presets | 4/10 (40%) | **Level 4** | Ant Design (default, small), Chakra (sm/md/lg), Radix UI (1-5), Mantine |
| Padding control | Adjustable internal spacing | 8/10 (80%) | **Level 2** | All except Semantic UI, ShadCN |
| Compact variant | Minimal spacing | 2/10 (20%) | **Level 5** | Ant Design, Radix UI (size 1) |
| Numeric size scale | 1-5 sizing system | 1/10 (10%) | **Level 5** | Radix UI |

### Variation Patterns - Color

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|-------------|-------------|------------|
| Color variants | Semantic colors | 3/10 (30%) | **Level 4** | Semantic UI (13 colors), Radix UI, Chakra (color schemes) |
| Background color | Custom background | 7/10 (70%) | **Level 2** | Most via CSS/style props |
| Theme colors | Design token colors | 6/10 (60%) | **Level 3** | Chakra, MUI, Mantine, Nuxt UI, Radix UI, ShadCN |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|-------------|-------------|------------|
| Clickable card | Entire card clickable | 7/10 (70%) | **Level 2** | Ant Design, Chakra, HeroUI, Mantine, MUI (ActionArea), Nuxt UI, Radix UI (asChild) |
| Hover effects | Visual hover feedback | 6/10 (60%) | **Level 3** | Ant Design, Chakra, HeroUI, MUI, Nuxt UI, ShadCN |
| Press events | Mobile-first press handling | 1/10 (10%) | **Level 5** | HeroUI |
| Ripple effects | Material ripple on click | 1/10 (10%) | **Level 5** | MUI |
| Reveal effects | Content reveal on hover | 1/10 (10%) | **Level 5** | Semantic UI |
| Dimmer effects | Overlay on hover | 1/10 (10%) | **Level 5** | Semantic UI |
| Selected state | Selected appearance | 2/10 (20%) | **Level 5** | Semantic UI, ShadCN (custom) |
| Disabled state | Disabled appearance | 3/10 (30%) | **Level 4** | HeroUI, Semantic UI, ShadCN (custom) |

### Specialized Features

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|-------------|-------------|------------|
| Tab integration | Built-in tabs | 1/10 (10%) | **Level 5** | Ant Design |
| Card.Grid | Internal grid sections | 1/10 (10%) | **Level 5** | Ant Design |
| Card.Meta | Avatar + title + description | 1/10 (10%) | **Level 5** | Ant Design |
| Card.Section | Position-aware sections | 1/10 (10%) | **Level 5** | Mantine |
| CardActionArea | Clickable wrapper | 1/10 (10%) | **Level 5** | MUI |
| Inset component | Edge-to-edge content | 1/10 (10%) | **Level 5** | Radix UI |
| asChild pattern | Element transformation | 1/10 (10%) | **Level 5** | Radix UI |
| Blur effects | Glassmorphism | 1/10 (10%) | **Level 5** | HeroUI |
| Loading skeleton | Automatic placeholder | 1/10 (10%) | **Level 5** | Ant Design |
| CardAction | Header action component | 1/10 (10%) | **Level 5** | ShadCN |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|-------------|-------------|------------|
| className prop | CSS class application | 10/10 (100%) | **Level 1** | All |
| style/sx prop | Inline styles | 9/10 (90%) | **Level 1** | All except Semantic UI |
| Sub-component styling | Style each section | 7/10 (70%) | **Level 2** | Ant Design, Chakra, HeroUI, MUI, PrimeReact, Radix UI, ShadCN |
| Slot-based styling | Style via slots | 2/10 (20%) | **Level 5** | HeroUI (classNames object), Nuxt UI (ui prop) |
| Style props shortcuts | bg, p, color shortcuts | 2/10 (20%) | **Level 5** | Chakra, Mantine |
| Theme integration | Design token system | 7/10 (70%) | **Level 2** | Chakra, HeroUI, Mantine, MUI, Nuxt UI, Radix UI, ShadCN |
| Data attributes | State-based styling | 2/10 (20%) | **Level 5** | HeroUI, ShadCN (custom) |
| CSS parts/variables | Standards-based | 2/10 (20%) | **Level 5** | Radix UI, MUI (CSS classes) |

## Pattern Correlations

### When Sub-Component Architecture Exists

**Sub-components present** → Framework provides:
- Individual section styling: 7/7 (100%)
- Type-safe composition: 7/7 (100%)
- Optional sections: 7/7 (100%)
- Flexible ordering: 6/7 (86%)

### When Elevation System Exists

**Shadow/Elevation** → Framework provides:
- Multiple shadow levels: 6/6 (100%)
- Hoverable cards: 5/6 (83%)
- Outlined alternative: 5/6 (83%)
- Theme integration: 6/6 (100%)

### When Clickable Cards Exist

**Clickable functionality** → Framework provides:
- Hover effects: 6/7 (86%)
- Keyboard navigation: 5/7 (71%)
- Semantic rendering (as link): 5/7 (71%)
- Ripple/press feedback: 2/7 (29%)

### Architectural Correlations

**Sub-Component Pattern** → Typically includes:
- React/Vue framework: 6/6 (100%)
- TypeScript support: 6/6 (100%)
- Optional all sections: 6/6 (100%)
- Composition flexibility: 6/6 (100%)

**Prop-Based Pattern** → Typically includes:
- Template support: 2/2 (100%)
- Simpler API: 2/2 (100%)
- Fewer total props: 2/2 (100%)
- Less TypeScript complexity: 2/2 (100%)

## Architectural Patterns

### Sub-Component Architectures

**1. React Multi-Part (60%)**
- **Frameworks**: Ant Design, Chakra UI, HeroUI, Mantine, MUI, ShadCN
- **Pattern**: Separate named components for each section
- **Example**:
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Body</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```
- **Pros**: Type-safe, flexible composition, clear structure
- **Cons**: More verbose, requires imports

**2. Prop-Based Sections (20%)**
- **Frameworks**: PrimeReact, Nuxt UI (hybrid)
- **Pattern**: Props define section content
- **Example**:
```jsx
<Card
  title="Title"
  subtitle="Description"
  header={<img />}
  footer={<Button />}
>
  Body content
</Card>
```
- **Pros**: Concise API, fewer components
- **Cons**: Less flexible, limited TypeScript help

**3. Slot-Based (20%)**
- **Frameworks**: Nuxt UI, Radix UI
- **Pattern**: Named slots for sections
- **Example**:
```vue
<Card>
  <template #header>Header</template>
  <template #default>Body</template>
  <template #footer>Footer</template>
</Card>
```
- **Pros**: Declarative, framework-native
- **Cons**: Framework-specific

**4. Class-Based (10%)**
- **Frameworks**: Semantic UI Classic
- **Pattern**: CSS classes define structure
- **Example**:
```html
<div class="ui card">
  <div class="image">...</div>
  <div class="content">
    <div class="header">...</div>
    <div class="description">...</div>
  </div>
  <div class="extra content">...</div>
</div>
```
- **Pros**: No JavaScript, pure HTML/CSS
- **Cons**: No type safety, manual structure

## Unique Features by Framework

### Ant Design Card
**Distinguishing capabilities:**
- Card.Grid sub-component for grid layouts within cards
- Card.Meta sub-component (avatar + title + description preset)
- Built-in tab integration
- Loading skeleton state
- Semantic DOM targeting (v5.14.0+)
- Variant evolution (bordered → variant prop in v5.24+)

### Chakra UI Card
**Distinguishing capabilities:**
- 4 variants (elevated/outline/filled/unstyled)
- Responsive direction control (vertical ↔ horizontal)
- Full style props system integration
- Size variants (sm/md/lg)
- Natural flexbox composition

### HeroUI Card
**Distinguishing capabilities:**
- Press event system (mobile-first vs click)
- Blur effects (isBlurred, isFooterBlurred)
- Data attribute styling (data-hover, data-pressed)
- Pressable mode (converts to button)
- Tailwind-first integration

### Mantine Card
**Distinguishing capabilities:**
- Built on Paper primitive (explicit inheritance)
- Card.Section with position-aware margins
- Sections must be direct children (technical constraint)
- Polymorphic component and section
- inheritPadding pattern

### MUI Card
**Distinguishing capabilities:**
- 5 specialized sub-components (most comprehensive)
- CardActionArea for full-card clickability with ripple
- CardMedia with dual modes (img vs background)
- Material Design 0-24 elevation scale
- Strong Material Design compliance

### Nuxt UI Card
**Distinguishing capabilities:**
- 4 variants (solid/outline/soft/subtle)
- Hybrid prop + slot approach
- Deep Tailwind integration
- ui prop for multi-level customization
- Vue-native patterns

### PrimeReact Card
**Distinguishing capabilities:**
- Minimal 7-prop API
- Title + subtitle props (string-only)
- Header/footer accept ReactNode
- Template-based customization
- Explicit Card vs Panel distinction

### Radix UI Themes Card
**Distinguishing capabilities:**
- Inset component for edge-to-edge content
- asChild pattern for element transformation
- Numeric size scale (1-5)
- 3 variants (surface/classic/ghost)
- Pure composition philosophy
- No built-in states (loading/disabled)

### Semantic UI Classic Card
**Distinguishing capabilities:**
- Most extensive pattern library (43+ patterns)
- Card groups with stackable/doubling
- Column count layouts (2-8 cards)
- Equal height matching
- 13 color variants
- Reveal effects, dimmers
- Pure CSS implementation
- View component classification

### ShadCN Card
**Distinguishing capabilities:**
- Copy-paste distribution model
- CardAction component (unique header action pattern)
- 6 sub-components
- No built-in variants (CSS-only)
- Tailwind-first approach
- Form-centric design patterns

## Support Level Classifications

### Level 1 (Universal - 100%)
Essential patterns found in ALL frameworks:
- Basic card container
- Header section with title
- Body/content section
- Footer/actions section
- Bordered appearance
- className/style customization
- Arbitrary children support
- Vertical structure

### Level 2 (Common - 70-89%)
Widely adopted patterns:
- Elevation/shadow (90%)
- Description/subtitle (90%)
- Action buttons in footer (90%)
- Clickable cards (70%)
- Cover/media image (80%)
- Padding control (80%)
- Hover effects (60%)
- Sub-component styling (70%)
- Theme integration (70%)
- Background customization (70%)

### Level 3 (Moderate - 40-69%)
Growing adoption:
- Hoverable cards (60%)
- Elevation levels (60%)
- Outlined variant (60%)
- Theme colors (60%)
- Avatar in header (50%)
- Header actions (50%)
- Horizontal layout (50%)
- Icon actions (50%)

### Level 4 (Occasional - 20-39%)
Selective implementation:
- Link card (40%)
- Card groups (30%)
- Color variants (30%)
- Responsive direction (30%)
- Multiple content blocks (30%)
- Disabled state (30%)
- Image in header (40%)
- Fluid width (30%)
- Size variants (40%)
- Header template (30%)
- Filled variant (40%)
- Compact variant (20%)
- Button groups (70% - actually Level 2)

### Level 5 (Rare - <20%)
Framework-specific innovations:
- Tab integration (10% - Ant Design)
- Card.Grid (10% - Ant Design)
- Card.Meta (10% - Ant Design)
- Card.Section (10% - Mantine)
- CardActionArea (10% - MUI)
- Inset component (10% - Radix UI)
- asChild pattern (10% - Radix UI)
- Blur effects (10% - HeroUI)
- Press events (10% - HeroUI)
- Loading skeleton (10% - Ant Design)
- CardAction (10% - ShadCN)
- Ripple effects (10% - MUI)
- Reveal effects (10% - Semantic UI)
- Dimmer effects (10% - Semantic UI)
- Stackable layout (10% - Semantic UI)
- Column counts (10% - Semantic UI)
- Equal height (10% - Semantic UI)
- 13 colors (10% - Semantic UI)
- Numeric size scale (10% - Radix UI)
- Classic variant (10% - Radix UI)
- Soft variant (10% - Nuxt UI)
- Ghost variant (30% - actually borderline Level 4)
- Footer template (20% - Level 5 confirmed)
- Social actions (20%)
- Extra content (20%)
- Selected state (20%)
- Data attributes (20%)
- Video support (10%)
- Background image (10%)

## API Design Recommendations

### For Web Component Implementation (Semantic UI Next)

Based on cross-framework analysis, recommended API structure:

```html
<!-- Basic Card -->
<ui-card>
  <ui-card-header slot="header">
    <ui-card-title>Card Title</ui-card-title>
    <ui-card-description>Card description</ui-card-description>
  </ui-card-header>
  <p>Card body content goes here</p>
  <ui-card-footer slot="footer">
    <ui-button>Action</ui-button>
  </ui-card-footer>
</ui-card>

<!-- With Media -->
<ui-card>
  <img slot="media" src="cover.jpg" alt="Cover" />
  <ui-card-header slot="header">
    <ui-card-title>Card with Cover</ui-card-title>
  </ui-card-header>
  <p>Content</p>
</ui-card>

<!-- Interactive Card -->
<ui-card clickable href="/details">
  <ui-card-header slot="header">
    <ui-card-title>Clickable Card</ui-card-title>
  </ui-card-header>
  <p>Click anywhere on this card</p>
</ui-card>

<!-- Variants -->
<ui-card variant="outlined" elevation="md">
  <ui-card-header slot="header">
    <ui-card-title>Styled Card</ui-card-title>
  </ui-card-header>
  <p>Outlined variant with medium elevation</p>
</ui-card>

<!-- Loading State -->
<ui-card loading>
  <ui-card-header slot="header">
    <ui-card-title>Loading</ui-card-title>
  </ui-card-header>
  <p>Content loading...</p>
</ui-card>

<!-- Custom Styling via CSS Parts -->
<style>
  ui-card::part(header) {
    background: var(--primary-color);
    color: white;
  }
  ui-card::part(footer) {
    border-top: 1px solid var(--border-color);
  }
</style>
```

**Recommended attributes:**
- `variant`: "elevated" | "outlined" | "filled" | "ghost"
- `elevation`: "none" | "sm" | "md" | "lg" | "xl"
- `padding`: "none" | "sm" | "md" | "lg" | "xl"
- `clickable`: boolean
- `href`: string (makes card a link)
- `loading`: boolean
- `disabled`: boolean
- `hoverable`: boolean

**Recommended slots:**
- `media` - Cover image/video area
- `header` - Header section (can contain title/description)
- Default slot - Body content
- `footer` - Footer/actions section

**Recommended CSS parts:**
- `::part(container)` - Root container
- `::part(media)` - Media area
- `::part(header)` - Header section
- `::part(content)` - Body content
- `::part(footer)` - Footer section

**Recommended events:**
- `click` - Card clicked (when clickable)
- `focus` - Card focused
- `blur` - Card blurred

**Recommended sub-components:**
- `<ui-card-header>` - Header container
- `<ui-card-title>` - Card title
- `<ui-card-description>` - Card description/subtitle
- `<ui-card-footer>` - Footer container

## Implementation Priorities

### Priority 1 (Must Have - Level 1)
Universal patterns essential for basic functionality:
- ✅ Basic card container element
- ✅ Header section with title
- ✅ Body/content section
- ✅ Footer/actions section
- ✅ Bordered/elevated visual treatment
- ✅ Arbitrary children via default slot
- ✅ className/style customization
- ✅ Vertical structure (default)

### Priority 2 (Should Have - Level 2)
Common patterns for modern UX:
- ✅ Elevation/shadow system
- ✅ Description/subtitle support
- ✅ Action buttons in footer
- ✅ Clickable card functionality
- ✅ Cover/media image support
- ✅ Padding control
- ✅ Hover effects
- ✅ Sub-component styling (CSS parts)
- ✅ Theme integration
- ✅ Background customization

### Priority 3 (Could Have - Level 3-4)
Enhancing patterns for specific use cases:
- ⚠️ Outlined variant
- ⚠️ Elevation levels (sm/md/lg/xl)
- ⚠️ Avatar in header
- ⚠️ Header actions area
- ⚠️ Horizontal layout option
- ⚠️ Icon actions
- ⚠️ Size variants
- ⚠️ Responsive direction
- ⚠️ Filled variant
- ⚠️ Ghost variant

### Priority 4 (Nice to Have - Level 5)
Framework-specific innovations to evaluate:
- 🔍 Loading skeleton (Ant Design pattern)
- 🔍 Card groups/grids (Semantic UI pattern)
- 🔍 Blur effects (HeroUI pattern)
- 🔍 Press events (mobile-first HeroUI approach)
- 🔍 Stackable/doubling (Semantic UI responsive patterns)
- 🔍 Reveal effects (Semantic UI pattern)
- 🔍 13 color variants (Semantic UI pattern)
- 🔍 Tab integration (Ant Design pattern)

## Testing Checklist

### Visual Tests
- [ ] Basic card renders with all sections
- [ ] Header/title/description display correctly
- [ ] Body content renders properly
- [ ] Footer/actions layout correctly
- [ ] Media/cover images display
- [ ] All elevation levels render
- [ ] All variants render (outlined, filled, ghost)
- [ ] Borders display correctly
- [ ] Theme switching works (light/dark)
- [ ] Hover states appear correctly
- [ ] Loading state displays skeleton

### Interactive Tests
- [ ] Clickable card navigation works
- [ ] Hover effects trigger correctly
- [ ] Click events fire properly
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Focus states visible
- [ ] Disabled state prevents interaction
- [ ] Link cards navigate correctly
- [ ] Action buttons in footer work

### Layout Tests
- [ ] Vertical structure (default)
- [ ] Horizontal layout (if implemented)
- [ ] Responsive direction switching
- [ ] Card groups/grids layout
- [ ] Stackable on mobile (if implemented)
- [ ] Equal heights in groups
- [ ] Media positioning (cover, header)
- [ ] Section padding applies correctly

### Styling Tests
- [ ] CSS parts accessible and styleable
- [ ] Design tokens apply correctly
- [ ] Custom CSS overrides work
- [ ] Slot content styles properly
- [ ] Sub-component styling works
- [ ] Responsive values work
- [ ] Theme colors apply

### Accessibility Tests
- [ ] Semantic HTML structure
- [ ] ARIA labels for clickable cards
- [ ] Keyboard navigation complete
- [ ] Screen reader announces sections
- [ ] Focus management correct
- [ ] Color contrast meets WCAG standards
- [ ] Image alt text support
- [ ] Link cards have proper roles

### Compatibility Tests
- [ ] Shadow DOM encapsulation works
- [ ] Slotted content renders correctly
- [ ] Nested cards work
- [ ] Works with forms
- [ ] Works with other components
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

## Raw Data References

Individual framework reports available at:
- `/ai/research/card/ant-design/usage-patterns.md` - 574 lines, Card.Grid, Card.Meta, Tab integration
- `/ai/research/card/chakra-ui/usage-patterns.md` - 331 lines, Multi-part, 4 variants, responsive
- `/ai/research/card/heroui/usage-patterns.md` - 743 lines, Press events, blur effects, mobile-first
- `/ai/research/card/mantine/usage-patterns.md` - 187 lines, Built on Paper, Card.Section
- `/ai/research/card/mui/usage-patterns.md` - 856 lines, 5 sub-components, Material Design
- `/ai/research/card/nuxt-ui/usage-patterns.md` - 424 lines, 4 variants, slot-based, Tailwind
- `/ai/research/card/primereact/usage-patterns.md` - 298 lines, Minimal API, template-based
- `/ai/research/card/radix-ui/usage-patterns.md` - 181 lines, Inset, asChild, composition-first
- `/ai/research/card/semantic-ui-classic/usage-patterns.md` - 476 lines, 43+ patterns, View component
- `/ai/research/card/shadcn/usage-patterns.md` - 475 lines, Copy-paste, 6 sub-components, Tailwind-first

---

**Research Methodology**: Descriptive pattern analysis across 10 major UI frameworks representing different architectural approaches (sub-component vs prop-based vs slot-based vs class-based, React vs Vue vs CSS-only).

**Research Status**: Complete
**Date**: 2025-11-04
**Frameworks**: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Radix UI, Semantic UI Classic, ShadCN
**Pattern Count**: 85+ unique patterns identified
**Total Lines Analyzed**: 4,545 lines across 10 framework reports

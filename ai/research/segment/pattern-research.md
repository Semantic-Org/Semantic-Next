# Component Pattern Research: Segment

> Last Modified: 2025-11-04

## Research Summary
- Frameworks surveyed: 5
- Date: 2025-11-04
- Unique patterns identified: 65+
- Research focus: Basic container primitives (NOT card components)

## Component Definition Consensus

Across all 5 frameworks, the segment-equivalent components serve as **foundational container primitives** for grouping and organizing content with visual boundaries. Key characteristics:

- **Visual grouping**: Creates visual separation between content areas
- **Basic primitive**: Foundation for building higher-level components (cards, modals, etc.)
- **Minimal structure**: Accepts arbitrary children without prescribing content organization
- **Theme-aware**: Automatically adapts to light/dark modes in modern frameworks
- **Elevation/depth**: Uses shadows or borders to create visual hierarchy

**Mental Model**: A "bordered box" or "surface container" that provides visual containment without semantic or structural opinions about what goes inside.

## Terminology Variations

Component naming across frameworks reveals different conceptual approaches:

| Term | Frameworks | Count | Conceptual Source |
|------|-----------|-------|-------------------|
| **Segment** | Semantic UI Classic | 1/5 (20%) | Semantic UI original terminology |
| **Paper** | MUI, Mantine | 2/5 (40%) | Material Design physical metaphor |
| **Box** | Chakra UI | 1/5 (20%) | Generic container primitive |
| **Panel** | PrimeReact | 1/5 (20%) | Traditional UI panel terminology |

**Value Terminology:**
- Shadow levels: "xs/sm/md/lg/xl" (80% - Mantine, MUI, Chakra, PrimeReact) vs "0-24" (20% - MUI only)
- Spacing: "xs/sm/md/lg/xl" (100% - all frameworks)
- Radius: "xs/sm/md/lg/xl" (100% - all frameworks)

**Architectural Approach:**
- **CSS-based**: Semantic UI Classic (20%) - class composition pattern
- **React components**: MUI, Chakra, Mantine, PrimeReact (80%) - props-based API

## Pattern Inventory

### Container Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Basic container | Minimal bordered/background container | 5/5 (100%) | **Level 1** | All |
| Raised/Elevated | Shadow-based elevation for depth | 5/5 (100%) | **Level 1** | All |
| Theme-aware background | Automatic light/dark mode adaptation | 4/5 (80%) | **Level 2** | MUI, Chakra, Mantine, PrimeReact |
| Polymorphic rendering | Render as any HTML element via prop | 3/5 (60%) | **Level 3** | Chakra, Mantine, MUI |
| Stacked/Layered | Visual stacking effect | 1/5 (20%) | **Level 5** | Semantic UI Classic only |
| Piled | Multiple-page pile illusion | 1/5 (20%) | **Level 5** | Semantic UI Classic only |
| Placeholder | Empty state container | 1/5 (20%) | **Level 5** | Semantic UI Classic only |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Arbitrary children | Accepts any content | 5/5 (100%) | **Level 1** | All |
| No content structure | No prescribed slots/areas | 5/5 (100%) | **Level 1** | All (by design) |
| Nested segments | Segments within segments | 5/5 (100%) | **Level 1** | All |
| Header support | Optional header text/template | 1/5 (20%) | **Level 5** | PrimeReact Panel only |
| Footer support | Optional footer template | 1/5 (20%) | **Level 5** | PrimeReact Panel only |

### Variation Patterns - Elevation/Shadow

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Shadow elevation | Box-shadow based depth | 5/5 (100%) | **Level 1** | All |
| 5-tier shadow system | xs/sm/md/lg/xl scale | 3/5 (60%) | **Level 3** | Chakra, Mantine, PrimeReact |
| 24-level elevation | Material Design 0-24 scale | 1/5 (20%) | **Level 5** | MUI only |
| No shadow option | Flat appearance | 5/5 (100%) | **Level 1** | All |
| Raised variant | Explicit "raised" class | 1/5 (20%) | **Level 5** | Semantic UI Classic |

### Variation Patterns - Borders & Radius

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Border radius control | Rounded corners | 5/5 (100%) | **Level 1** | All |
| 5-tier radius system | xs/sm/md/lg/xl scale | 4/5 (80%) | **Level 2** | MUI, Chakra, Mantine, PrimeReact |
| Square corners option | Disable border-radius | 2/5 (40%) | **Level 4** | MUI, Chakra |
| Circular variant | Perfect circle shape | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Border toggle | Optional border | 2/5 (40%) | **Level 4** | Mantine (withBorder), Semantic UI |
| Outlined variant | Border instead of shadow | 1/5 (20%) | **Level 5** | MUI only |

### Variation Patterns - Spacing

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Padding control | Internal spacing | 5/5 (100%) | **Level 1** | All |
| Directional padding | px/py/pt/pb/pl/pr props | 4/5 (80%) | **Level 2** | Chakra, Mantine, MUI, PrimeReact |
| Spacing scale | xs/sm/md/lg/xl tokens | 5/5 (100%) | **Level 1** | All |
| Padded variant | Increased padding class | 1/5 (20%) | **Level 5** | Semantic UI ("very padded") |
| Compact variant | Minimal padding class | 1/5 (20%) | **Level 5** | Semantic UI Classic |

### Variation Patterns - Colors

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Background color | Customizable bg color | 5/5 (100%) | **Level 1** | All |
| Design token colors | Theme color palette | 4/5 (80%) | **Level 2** | Chakra, Mantine, MUI, PrimeReact |
| 13 named colors | Extensive color palette | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Color emphasis levels | Primary/secondary/tertiary | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Inverted colors | Dark background variant | 1/5 (20%) | **Level 5** | Semantic UI Classic |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| className prop | CSS class application | 5/5 (100%) | **Level 1** | All |
| style/sx prop | Inline styles | 5/5 (100%) | **Level 1** | All |
| Style props shortcuts | bg, p, m, w, h shortcuts | 2/5 (40%) | **Level 4** | Chakra, Mantine |
| Pseudo-selector props | _hover, _focus, _dark | 1/5 (20%) | **Level 5** | Chakra only |
| Styles API | Granular part styling | 1/5 (20%) | **Level 5** | Mantine only |
| Multiple className targets | Separate classes for parts | 1/5 (20%) | **Level 5** | PrimeReact |
| Class composition | Multiple CSS classes | 1/5 (20%) | **Level 5** | Semantic UI Classic |

### Layout Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Flexbox support | Display flex capability | 4/5 (80%) | **Level 2** | Chakra, MUI, Mantine, PrimeReact |
| Grid support | Display grid capability | 4/5 (80%) | **Level 2** | Chakra, MUI, Mantine, PrimeReact |
| Attached segments | Seamless border connection | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Horizontal segments | Side-by-side layout | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Segment groups | Grouped container pattern | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Gap spacing | Modern gap property | 2/5 (40%) | **Level 4** | Chakra, MUI |
| Aspect ratio control | Maintain aspect ratio | 1/5 (20%) | **Level 5** | Chakra only |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Polymorphic component | Render as different element | 3/5 (60%) | **Level 3** | Chakra, Mantine, MUI |
| Clickable container | Button/link rendering | 3/5 (60%) | **Level 3** | Chakra, Mantine, MUI |
| Collapsible/toggleable | Built-in collapse | 1/5 (20%) | **Level 5** | PrimeReact Panel only |
| Hover states | _hover pseudo styling | 2/5 (40%) | **Level 4** | Chakra, MUI |
| Loading state | Built-in loading indicator | 1/5 (20%) | **Level 5** | Semantic UI Classic |
| Disabled state | Disabled appearance | 1/5 (20%) | **Level 5** | Semantic UI Classic |

### Responsive Design Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Responsive props | Breakpoint-based values | 4/5 (80%) | **Level 2** | Chakra, MUI, Mantine, PrimeReact |
| Array syntax | Mobile-first arrays | 1/5 (20%) | **Level 5** | Chakra only |
| Object syntax | Named breakpoint objects | 3/5 (60%) | **Level 3** | Chakra, MUI, Mantine |
| Media query support | CSS media queries | 5/5 (100%) | **Level 1** | All (via CSS) |
| Responsive visibility | Hide at breakpoints | 1/5 (20%) | **Level 5** | Chakra |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Semantic HTML via prop | as/component prop | 3/5 (60%) | **Level 3** | Chakra, Mantine, MUI |
| ARIA support | Built-in ARIA attrs | 1/5 (20%) | **Level 5** | PrimeReact (toggleable) |
| Keyboard navigation | Built-in keyboard support | 1/5 (20%) | **Level 5** | PrimeReact (toggleable) |
| Role attributes | Semantic roles | 5/5 (100%) | **Level 1** | All (via semantic HTML) |

## Notable Patterns

### Highly Adopted (Level 1-2) - 90%+ Prevalence

**Universal Patterns (100%):**
- Basic container with visual boundary
- Raised/elevated shadow depth
- Arbitrary children support
- No prescribed content structure
- Nested container capability
- Background color control
- Padding control
- Border radius control
- className and style props
- Spacing scale tokens

**Common Patterns (70-89%):**
- Theme-aware automatic backgrounds (80%)
- 5-tier shadow system xs→xl (60%)
- 5-tier radius system xs→xl (80%)
- Directional padding control (80%)
- Design token color integration (80%)
- Flexbox/Grid support (80%)
- Responsive prop values (80%)

### Emerging Patterns (Level 3-4) - 36-69% Prevalence

**Moderate Adoption (40-69%):**
- Polymorphic component rendering (60%)
- Clickable container support (60%)
- Object-syntax responsive values (60%)
- Border toggle option (40%)
- Square corners option (40%)
- Style props shortcuts (40%)
- Hover state styling (40%)

### Unique Innovations (Level 5) - <20% Prevalence

**Framework-Specific Features:**

1. **MUI Paper**:
   - 24-level Material Design elevation scale (0-24)
   - Outlined variant (border instead of shadow)
   - Material Design spec compliance

2. **Chakra UI Box**:
   - Pseudo-selector props (_hover, _focus, _dark, _before, _after)
   - Array syntax responsive values (mobile-first)
   - Responsive visibility utilities (hideFrom, hideBelow)
   - layerStyle preset system
   - Aspect ratio control
   - RTL logical properties (ms/me/ps/pe)

3. **Semantic UI Classic Segment**:
   - Stacked appearance (layered pages effect)
   - Piled appearance (multiple page stack)
   - Placeholder segment (empty states)
   - Attached segments (seamless borders)
   - Horizontal segments and groups
   - Circular variant
   - 13 named colors with emphasis levels
   - Inverted color scheme
   - Loading and disabled states
   - Basic variant (minimal styling)
   - Clearing variant (float management)
   - Floated segments

4. **Mantine Paper**:
   - Styles API for granular customization
   - withBorder boolean prop
   - Explicit primitive foundation role

5. **PrimeReact Panel**:
   - **Built-in collapsible functionality** (unique among all researched frameworks)
   - Controlled/uncontrolled state management
   - headerTemplate and footerTemplate customization
   - Separate onExpand/onCollapse/onToggle events
   - Keyboard navigation for toggle
   - ARIA attributes for collapsible state
   - Multiple className/style targets (root, header, content)

## Pattern Correlations

### When Shadow Elevation Exists

**Shadow system present** → Framework provides:
- Spacing scale tokens: 5/5 (100%)
- Border radius tokens: 5/5 (100%)
- Theme integration: 5/5 (100%)
- Responsive values: 4/5 (80%)

### When Polymorphic Component Exists

**Polymorphic rendering** → Framework provides:
- TypeScript integration: 3/3 (100%)
- Semantic HTML capability: 3/3 (100%)
- Framework router integration: 3/3 (100%)
- Clickable container support: 3/3 (100%)

### When Style Props System Exists

**Style props shortcuts** → Framework provides:
- Design token integration: 2/2 (100%)
- Responsive array/object syntax: 2/2 (100%)
- Theme-aware values: 2/2 (100%)
- Pseudo-selector support: 1/2 (50%)

### Visual Variant Systems

**Frameworks with extensive variants (Semantic UI)**:
- More CSS classes: Yes
- More color options: Yes
- More layout patterns: Yes
- Less JavaScript API: Yes

**Frameworks with minimal variants (MUI, Mantine, Chakra, PrimeReact)**:
- Fewer built-in variants: Yes
- More customization via props: Yes
- More JavaScript API: Yes
- More composition patterns: Yes

## Architectural Patterns

### API Design Approaches

**1. Class-Based Composition (20%)**
- **Framework**: Semantic UI Classic
- **Pattern**: Multiple CSS classes combined for effects
- **Example**: `class="ui raised very padded blue segment"`
- **Pros**: Declarative, no JavaScript, flexible combinations
- **Cons**: No type safety, limited dynamic behavior

**2. Props-Based Configuration (80%)**
- **Frameworks**: MUI, Chakra, Mantine, PrimeReact
- **Pattern**: Props control all visual aspects
- **Example**: `<Paper shadow="lg" p="xl" withBorder>`
- **Pros**: Type-safe, dynamic, programmatic control
- **Cons**: Requires JavaScript, larger bundle

### Styling System Patterns

**1. CSS Classes (20%)**
- **Framework**: Semantic UI Classic
- **Approach**: Pre-compiled CSS with BEM-like naming
- **Pattern**: `.ui.raised.segment`, `.ui.primary.segment`

**2. CSS-in-JS (60%)**
- **Frameworks**: MUI, Chakra, Mantine
- **Approach**: Runtime style generation with theme access
- **Pattern**: `sx={{ ... }}` or style props

**3. Hybrid (20%)**
- **Framework**: PrimeReact
- **Approach**: CSS classes with theme system
- **Pattern**: CSS classes + className/style props

### Polymorphism Patterns

**3 frameworks (60%) support polymorphic rendering:**

```tsx
// Chakra UI
<Box as="section">Content</Box>

// Mantine
<Paper component="article">Content</Paper>

// MUI
<Paper component="nav">Content</Paper>
```

**Benefits observed:**
- Semantic HTML without losing styling
- Type-safe component substitution
- Framework integration (Next.js Link, React Router)
- SEO and accessibility improvements

### Responsive Design Patterns

**Array Syntax (Chakra only - 20%)**:
```jsx
<Box width={['100%', '50%', '25%']} />
// Mobile-first: base, sm, md breakpoints
```

**Object Syntax (60% - Chakra, MUI, Mantine)**:
```jsx
<Paper shadow={{ base: 'sm', md: 'md', lg: 'lg' }} />
// Named breakpoints
```

**Traditional CSS (100% - all via classes or media queries)**

## Unique Features by Framework

### Semantic UI Classic Segment
**Distinguishing capabilities:**
- Most extensive visual variants (43+ patterns)
- Unique depth cues (raised/stacked/piled)
- Attachment system for seamless borders
- Horizontal and grouped segments
- 13 color palette with emphasis levels
- Pure CSS implementation (no JavaScript)

**Design philosophy**: Maximum flexibility through class composition

### MUI Paper
**Distinguishing capabilities:**
- Full Material Design elevation specification (0-24 scale)
- Outlined variant (border vs shadow approach)
- Strongest theme integration
- Material Design compliance

**Design philosophy**: Material Design adherence, theme-first design

### Chakra UI Box
**Distinguishing capabilities:**
- Most powerful styling API (pseudo-selectors, RTL, etc.)
- Array and object responsive syntax
- Foundation for all other Chakra components
- Most extensive style prop system
- Responsive visibility utilities

**Design philosophy**: Composition-first, maximum styling power in primitives

### Mantine Paper
**Distinguishing capabilities:**
- Explicit primitive foundation role
- Styles API for granular customization
- withBorder pattern
- Minimal API surface by design

**Design philosophy**: Intentional minimalism, building block for higher components

### PrimeReact Panel
**Distinguishing capabilities:**
- **ONLY framework with built-in collapsible** (unique in research)
- Template system (headerTemplate/footerTemplate)
- Controlled/uncontrolled dual patterns
- Granular styling targets (root/header/content)
- Full accessibility (keyboard, ARIA)

**Design philosophy**: Interactive container vs passive primitive

## Implementation Notes

### CSS Architecture Comparison

**Semantic UI Classic**:
- Pre-compiled LESS/CSS
- BEM-like class naming
- CSS variables for theming
- No runtime overhead

**Modern React Frameworks**:
- CSS-in-JS (MUI, Chakra, Mantine)
- Runtime style generation
- Scoped styles by default
- Theme token access via JavaScript

**PrimeReact**:
- Traditional CSS with classes
- Theme system integration
- className + style prop pattern

### TypeScript Integration

**All React frameworks (80%) provide:**
- Full TypeScript type definitions
- Props autocomplete
- Type-safe polymorphism (where applicable)
- Theme token types

**Semantic UI Classic (20%)**:
- No TypeScript (vanilla CSS/HTML)
- Type safety through valid HTML attributes only

### Theme System Integration

**4/5 frameworks (80%) offer:**
- Automatic light/dark mode
- Design token systems
- Centralized theme configuration
- CSS custom properties

**Semantic UI Classic (20%)**:
- Manual theme switching
- CSS variables for customization
- No automatic color scheme detection

## Support Level Classifications

### Level 1 (Universal - 100%)
Essential patterns found in ALL frameworks:
- Basic container with visual boundaries
- Shadow/elevation depth control
- Arbitrary children support
- Nested containers
- Padding control
- Border radius control
- Background color customization
- className and style props
- No prescribed content structure

### Level 2 (Common - 70-89%)
Widely adopted patterns:
- Theme-aware backgrounds (80%)
- 5-tier elevation system (60% direct, 100% via props)
- Design token integration (80%)
- Directional padding (80%)
- Flexbox/Grid support (80%)
- Responsive prop values (80%)

### Level 3 (Moderate - 40-69%)
Growing adoption patterns:
- Polymorphic rendering (60%)
- Clickable containers (60%)
- Named breakpoint responsive values (60%)

### Level 4 (Occasional - 20-39%)
Selective implementation:
- Border toggle (40%)
- Square corners option (40%)
- Style props shortcuts (40%)
- Hover state styling (40%)

### Level 5 (Rare - <20%)
Framework-specific innovations:
- Collapsible functionality (20% - PrimeReact)
- 24-level elevation (20% - MUI)
- Pseudo-selector props (20% - Chakra)
- Stacked/piled effects (20% - Semantic UI)
- Template system (20% - PrimeReact)
- Styles API (20% - Mantine)
- Attached segments (20% - Semantic UI)
- 13-color palette (20% - Semantic UI)

## API Design Recommendations

### For Web Component Implementation (Semantic UI Next)

Based on cross-framework analysis, recommended API structure:

```html
<!-- Basic Usage -->
<ui-segment>
  Content here
</ui-segment>

<!-- With Elevation -->
<ui-segment elevation="md">
  Elevated content
</ui-segment>

<!-- With Padding -->
<ui-segment padding="lg">
  Padded content
</ui-segment>

<!-- With Border -->
<ui-segment bordered>
  Bordered content
</ui-segment>

<!-- Rounded Corners -->
<ui-segment radius="lg">
  Rounded content
</ui-segment>

<!-- Combined Attributes -->
<ui-segment elevation="lg" padding="xl" radius="md" bordered>
  Fully styled segment
</ui-segment>

<!-- Collapsible (inspired by PrimeReact) -->
<ui-segment collapsible>
  <span slot="header">Section Title</span>
  Content that can be collapsed
</ui-segment>

<!-- Custom Styling via CSS Parts -->
<ui-segment class="custom-segment">
  <style>
    .custom-segment::part(container) {
      background: linear-gradient(...);
    }
  </style>
  Content
</ui-segment>
```

**Recommended attributes:**
- `elevation`: "none" | "xs" | "sm" | "md" | "lg" | "xl"
- `padding`: "none" | "xs" | "sm" | "md" | "lg" | "xl"
- `radius`: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full"
- `bordered`: boolean
- `collapsible`: boolean
- `collapsed`: boolean (controlled state)
- `loading`: boolean
- `disabled`: boolean

**Recommended CSS parts:**
- `::part(container)` - Root container
- `::part(header)` - Header area (when collapsible)
- `::part(content)` - Content area
- `::part(footer)` - Footer area (optional)
- `::part(toggle)` - Toggle button (when collapsible)

**Recommended slots:**
- Default slot - Main content
- `header` - Header content
- `footer` - Footer content

**Recommended events:**
- `toggle` - Fired when collapsed state changes
- `expand` - Fired when expanded
- `collapse` - Fired when collapsed

## Implementation Priorities

### Priority 1 (Must Have - Level 1)
Universal patterns essential for basic functionality:
- ✅ Basic container element
- ✅ Elevation/shadow system (5-tier minimum)
- ✅ Padding control (5-tier minimum)
- ✅ Border radius control (5-tier minimum)
- ✅ Background customization
- ✅ Arbitrary children via default slot
- ✅ Theme-aware backgrounds (light/dark)
- ✅ Nested containers

### Priority 2 (Should Have - Level 2)
Common patterns for modern UX:
- ✅ Design token integration
- ✅ Directional padding (px/py/pt/pb/pl/pr via CSS)
- ✅ Responsive values (via CSS custom properties)
- ✅ Border toggle option
- ✅ Square corners option

### Priority 3 (Could Have - Level 3-4)
Enhancing patterns for specific use cases:
- ⚠️ Collapsible functionality (PrimeReact pattern - unique value)
- ⚠️ Loading state (Semantic UI Classic pattern)
- ⚠️ Disabled state (Semantic UI Classic pattern)
- ⚠️ Hover state styling
- ⚠️ Multiple elevation levels (consider 24 like MUI)

### Priority 4 (Nice to Have - Level 5)
Framework-specific innovations to evaluate:
- 🔍 Attached segments (Semantic UI pattern - for forms/layouts)
- 🔍 Stacked/piled effects (Semantic UI pattern - visual depth)
- 🔍 Placeholder variant (Semantic UI pattern - empty states)
- 🔍 Color variants (Semantic UI pattern - status colors)
- 🔍 Emphasis levels (Semantic UI pattern - hierarchy)

## Testing Checklist

### Visual Tests
- [ ] Basic segment renders with default styling
- [ ] All elevation levels render correctly (xs/sm/md/lg/xl)
- [ ] All padding levels apply correctly (xs/sm/md/lg/xl)
- [ ] All radius levels render correctly (xs/sm/md/lg/xl)
- [ ] Bordered variant shows border
- [ ] Theme switching (light/dark) works correctly
- [ ] Nested segments render properly
- [ ] Background colors apply correctly

### Interactive Tests (if collapsible implemented)
- [ ] Collapsible toggle works
- [ ] Controlled mode functions correctly
- [ ] Uncontrolled mode functions correctly
- [ ] Keyboard navigation works (Enter/Space)
- [ ] Smooth collapse/expand animation
- [ ] ARIA attributes update correctly

### Styling Tests
- [ ] CSS parts accessible and styleable
- [ ] Design tokens apply correctly
- [ ] Custom CSS overrides work
- [ ] Responsive values work across breakpoints
- [ ] RTL support (if implemented)

### Accessibility Tests
- [ ] Semantic HTML structure
- [ ] ARIA attributes (if collapsible)
- [ ] Keyboard navigation (if interactive)
- [ ] Screen reader announcements
- [ ] Focus management
- [ ] Color contrast meets WCAG standards

### Compatibility Tests
- [ ] Shadow DOM encapsulation works
- [ ] Slotted content renders correctly
- [ ] CSS custom properties cascade properly
- [ ] Works with form elements
- [ ] Nesting with other components
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

## Raw Data References

Individual framework reports available at:
- `/ai/research/segment/semantic-ui-classic/usage-patterns.md` - 530 lines, 43+ patterns
- `/ai/research/segment/mui/usage-patterns.md` - 927 lines, Material Design elevation
- `/ai/research/segment/chakra-ui/usage-patterns.md` - 364 lines, polymorphic primitive
- `/ai/research/segment/mantine/usage-patterns.md` - 732 lines, foundational primitive
- `/ai/research/segment/primereact/usage-patterns.md` - 516 lines, unique collapsible feature

---

**Research Methodology**: Descriptive pattern analysis across 5 major UI frameworks representing different architectural approaches (CSS-based vs React components, class-based vs props-based, minimal vs extensive variant systems).

**Research Status**: Complete
**Date**: 2025-11-04
**Frameworks**: Semantic UI Classic, MUI, Chakra UI, Mantine, PrimeReact
**Pattern Count**: 65+ unique patterns identified

# Component Pattern Research: Stack (Layout)

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3 (Chakra UI, MUI, Mantine)
- Date: 2025-11-05
- Unique patterns identified: 20+ distinct patterns across layout direction, spacing management, and responsive design

## Component Definition Consensus

Stack is a one-dimensional layout component that provides a convenient wrapper for flexbox-based vertical (and sometimes horizontal) arrangements of child elements. All three frameworks consistently conceptualize Stack as:

- **Core purpose**: Simplify flexbox layouts by managing consistent spacing between children in a single direction (primarily vertical)
- **Mental model**: A declarative layout primitive that eliminates manual margin management and provides friendly props for common stacking patterns
- **Semantic meaning**: A purely structural layout primitive with no inherent semantic meaning (renders as `div` by default), focused on arranging children in a stack

**Key observation**: Stack is universally positioned as a high-level convenience component - all frameworks provide it as a specialized flexbox container with automatic spacing management and a simplified API compared to raw flex containers.

## Terminology Variations

### Component Names
- **Stack** (3/3): Universal naming across all frameworks
- **VStack** (1/3): Chakra UI provides specialized vertical variant
- **HStack** (1/3): Chakra UI provides specialized horizontal variant
- **Group** (1/3): Mantine provides separate component for horizontal layouts (not called HStack)

### Direction Control
- **direction** (2/3): Chakra UI, MUI - `direction="column"` or `direction="row"`
- **No direction prop** (1/3): Mantine - Stack is always vertical, use Group for horizontal
- **Direction variants** (1/3): Chakra UI - VStack/HStack as separate components

### Spacing Props
- **spacing** (2/3): Chakra UI, MUI - `spacing={4}` uses theme spacing scale
- **gap** (2/3): Chakra UI (alternative), Mantine - `gap="md"` uses theme tokens
- **Spacing tokens**: All support theme-based spacing values

### Alignment Props
- **align** (2/3): Chakra UI, Mantine - `align="center"` (shorthand)
- **alignItems** (2/3): MUI, Chakra - `alignItems="center"` (CSS property name)
- **justify** (2/3): Chakra UI, Mantine - `justify="center"` (shorthand)
- **justifyContent** (2/3): MUI, Chakra - `justifyContent="center"` (CSS property name)

### Responsive Support
- **Object notation** (3/3): All support `{xs: 'column', md: 'row'}` or similar
- **Array notation** (2/3): Chakra UI, MUI support `[value1, value2, value3]` syntax

### Polymorphism
- **as** (1/3): Chakra UI - `as="section"`
- **component** (1/3): MUI - `component="section"`
- **Not documented** (1/3): Mantine - likely supports polymorphism but not explicitly shown

## Pattern Inventory

### Core Layout Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Vertical stacking default | Default flex-direction column | 3/3 (100%) | Level 1 | All (Stack default) |
| Direction control | Set flex-direction | 2/3 (67%) | Level 3 | Chakra (direction prop), MUI (direction prop) |
| Spacing management | Consistent gaps between children | 3/3 (100%) | Level 1 | All (spacing/gap prop) |
| Alignment control | Cross-axis alignment | 3/3 (100%) | Level 1 | All (align/alignItems prop) |
| Justification control | Main-axis distribution | 3/3 (100%) | Level 1 | All (justify/justifyContent prop) |

### Direction and Variant Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Specialized variants | VStack/HStack components | 1/3 (33%) | Level 4 | Chakra UI (VStack, HStack) |
| Separate horizontal component | Different component for horizontal | 1/3 (33%) | Level 4 | Mantine (Group) |
| Bidirectional single component | One component handles both directions | 2/3 (67%) | Level 3 | Chakra UI (Stack), MUI (Stack) |
| Row reverse | Reverse horizontal direction | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| Column reverse | Reverse vertical direction | 2/3 (67%) | Level 3 | Chakra UI, MUI |

### Spacing Implementation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| CSS gap property | Modern gap-based spacing | 3/3 (100%) | Level 1 | All (Chakra via gap, MUI via useFlexGap, Mantine default) |
| Theme spacing scale | Numeric multipliers of base unit | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| Named spacing tokens | xs/sm/md/lg/xl tokens | 2/3 (67%) | Level 3 | Chakra UI, Mantine |
| Margin-based fallback | Fallback for older browsers | 1/3 (33%) | Level 4 | MUI (default unless useFlexGap) |
| PostCSS polyfill | Browser compatibility layer | 1/3 (33%) | Level 4 | Mantine (flex-gap-polyfill) |

### Responsive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Object notation | Breakpoint objects `{base, md, lg}` | 3/3 (100%) | Level 1 | All |
| Array notation | Breakpoint arrays `[v1, v2, v3]` | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| Responsive direction | Change direction at breakpoints | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| Responsive spacing | Different gaps at breakpoints | 3/3 (100%) | Level 1 | All |
| Responsive alignment | Adjust alignment per breakpoint | 3/3 (100%) | Level 1 | All |

### Divider Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Built-in divider prop | Divider element between children | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| Automatic divider positioning | Framework handles divider placement | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| StackDivider component | Dedicated divider component | 1/3 (33%) | Level 4 | Chakra UI |
| No built-in dividers | Dividers via composition | 1/3 (33%) | Level 4 | Mantine |

### Integration Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Theme integration | Gap uses theme spacing | 3/3 (100%) | Level 1 | All |
| Polymorphic rendering | Render as different elements | 2/3 (67%) | Level 3 | Chakra (as), MUI (component) |
| Style props system | Accept framework styling props | 3/3 (100%) | Level 1 | All |
| Box prop inheritance | Inherits base container props | 1/3 (33%) | Level 4 | Chakra UI (full Box inheritance) |
| sx prop styling | CSS-in-JS styling prop | 1/3 (33%) | Level 4 | MUI |

### Wrapping Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Wrap control | flex-wrap prop | 2/3 (67%) | Level 3 | Chakra UI, MUI |
| shouldWrapChildren | Wrap each child in container | 1/3 (33%) | Level 4 | Chakra UI |
| No wrap support | Stack doesn't wrap | 1/3 (33%) | Level 4 | Mantine |

## Notable Patterns

### Highly Adopted (Level 1, 100% adoption)

**Universal patterns across all Stack implementations:**

- **Vertical default**: All frameworks default to column/vertical direction
- **Spacing management**: All provide props for consistent gaps between children
- **Theme integration**: All integrate with theme spacing scales
- **Alignment control**: All provide cross-axis alignment props
- **Justification control**: All provide main-axis distribution props
- **Responsive design**: All props accept responsive values
- **CSS gap property**: All use modern CSS gap (with fallbacks/polyfills)
- **Style props system**: All integrate with their framework's styling system

### Emerging Patterns (Level 3, 67% adoption)

**Patterns with moderate adoption:**

- **Bidirectional control**: 67% support both vertical and horizontal in one component
- **Direction changes**: 67% allow responsive direction switching
- **Polymorphic rendering**: 67% can render as different HTML elements
- **Theme spacing scale**: 67% use numeric multipliers (spacing={4})
- **Named spacing tokens**: 67% support xs/sm/md/lg/xl tokens
- **Built-in dividers**: 67% have divider prop for automatic separation
- **Array responsive notation**: 67% support array syntax for breakpoints
- **Wrap control**: 67% support flexbox wrapping

### Unique Innovations

**Framework-specific features:**

**Chakra UI**:
- **VStack/HStack variants**: Specialized components for explicit direction - improves code readability
- **Full Box inheritance**: All Box props available on Stack - maximum flexibility
- **shouldWrapChildren prop**: Wraps each child in Box for consistent inline-block behavior
- **Both array and object responsive syntax**: Most flexible responsive API
- **StackDivider component**: Dedicated divider component designed for Stack
- **isInline legacy prop**: Backward compatibility for horizontal layouts

**MUI**:
- **useFlexGap flag**: Opt-in to CSS gap vs margin-based spacing - browser compatibility control
- **sx prop system**: Powerful theme-aware CSS-in-JS styling
- **Direction defaults to column**: Most semantic default for "Stack" naming
- **component prop**: Semantic HTML rendering with TypeScript support
- **Comprehensive flexWrap control**: Full flex wrapping support

**Mantine**:
- **Separate Stack/Group components**: Clear distinction between vertical (Stack) and horizontal (Group)
- **Minimal API surface**: Just the essential props - easy to learn
- **PostCSS polyfill guidance**: Explicit browser support strategy
- **Style props integration**: Deep integration with Mantine's styling system
- **Always vertical**: Stack is opinionated - use Group for horizontal

## Pattern Correlations

### When vertical stacking exists:
- Spacing management always present (3/3, 100%)
- Alignment control always present (3/3, 100%)
- Theme integration always present (3/3, 100%)
- Suggests: Core stacking features are universally bundled

### When direction control exists:
- Row and column supported (2/2, 100%)
- Reverse directions supported (2/2, 100%)
- Responsive direction changes supported (2/2, 100%)
- Suggests: Direction control is comprehensive when provided

### When divider support exists:
- Automatic positioning present (2/2, 100%)
- Respects direction present (2/2, 100%)
- Suggests: Divider integration is well thought-out when implemented

### When responsive support is strong:
- Object notation always present (3/3, 100%)
- Works on all props (3/3, 100%)
- Theme breakpoints used (3/3, 100%)
- Suggests: Responsive design is holistic, not piecemeal

## Implementation Notes

### Common Technical Approaches

1. **Base Implementation Pattern**:
   ```
   Stack = Flex + { flex-direction: column } + automatic spacing management
   ```
   All frameworks build Stack as a specialized flex container

2. **Spacing Implementation**:
   - **Modern approach**: CSS gap property (Chakra, MUI with useFlexGap, Mantine)
   - **Fallback approach**: Margin-based spacing with CSS selectors (MUI default)
   - **Polyfill approach**: PostCSS polyfill for old browsers (Mantine)

3. **Default Behavior**:
   - **Direction**: All default to column (vertical)
   - **Spacing**: Chakra 0.5rem, MUI 0, Mantine not specified
   - **Alignment**: Chakra/MUI stretch, Mantine stretch

4. **API Philosophy**:
   - **Chakra UI**: Maximum flexibility - supports everything
   - **MUI**: Balanced - comprehensive but focused
   - **Mantine**: Minimal - does one thing well

5. **Responsive Value Processing**:
   ```
   direction={{base: 'column', md: 'row'}}
   → @media (min-width: md) { flex-direction: row; }
   ```
   Mobile-first media query generation

### Performance Considerations

- **Minimal overhead**: Stack adds negligible cost over base flex container
- **CSS gap vs margin**: Gap is more performant and cleaner
- **No wrapper elements**: Children rendered directly (except Chakra shouldWrapChildren)
- **Shared styles**: Framework styling systems optimize CSS reuse

### Framework-Specific Strengths

**Chakra UI**:
- Most comprehensive API (direction, spacing, gap, dividers, wrapping)
- VStack/HStack variants improve code clarity
- Full Box prop inheritance provides maximum styling flexibility
- Both shorthand (align) and CSS property names (alignItems) supported

**MUI**:
- Excellent responsive design with mobile-first philosophy
- useFlexGap flag provides browser compatibility control
- Powerful sx prop for theme-aware inline styling
- component prop with TypeScript support for semantic HTML
- Well-documented and mature implementation

**Mantine**:
- Cleanest, most focused API (vertical stacking only)
- Clear separation: Stack (vertical) vs Group (horizontal)
- Deep style props integration
- Explicit browser support guidance with PostCSS polyfill
- TypeScript-first approach

## Architectural Insights

### Three Implementation Philosophies

1. **Chakra UI - Maximum Versatility**:
   - Stack can do everything (bidirectional with variants)
   - Multiple ways to achieve same result (spacing vs gap, align vs alignItems)
   - Full Box inheritance adds all styling capabilities
   - Philosophy: One component, all options

2. **MUI - Balanced Flexibility**:
   - Single Stack with comprehensive props
   - Modern and fallback implementations (useFlexGap flag)
   - sx prop for powerful custom styling
   - Philosophy: Flexible but focused

3. **Mantine - Focused Simplicity**:
   - Stack is vertical-only, Group for horizontal
   - Minimal prop surface (just essentials)
   - One way to do things (opinionated)
   - Philosophy: Do one thing extremely well

### Naming Philosophy Evolution

**"Stack" naming conventions:**
- All agree "Stack" implies vertical/column direction as default
- Chakra adds V/H prefixes for variants
- Mantine uses separate names (Stack vs Group)
- Industry moving toward semantic component names over generic containers

### Stack vs Flex Trade-offs

| Aspect | Stack | Flex |
|--------|-------|------|
| Use case | Simple one-direction stacking | Complex multi-property flex layouts |
| Props | Simplified (spacing, align, justify) | Comprehensive (all flex properties) |
| Spacing | Automatic gap management | Manual gap/margin management |
| Learning curve | Low | Medium |
| Flexibility | Medium | High |

**When to use Stack**:
- Simple vertical or horizontal arrangements
- Need consistent spacing between items
- Want to avoid manual margin management
- Building forms, lists, button groups

**When to use Flex**:
- Need fine-grained flex control (grow, shrink, basis)
- Complex alignment requirements
- Need to mix different flex behaviors
- Building complex responsive layouts

## Recommendations for Implementation

Based on pattern prevalence, a robust Stack implementation should include:

### Essential Features (Level 1, 100% adoption)
1. Vertical (column) default direction
2. Spacing management with theme integration (spacing or gap prop)
3. Cross-axis alignment control (align/alignItems)
4. Main-axis justification control (justify/justifyContent)
5. Responsive prop support on all props (object notation)
6. CSS gap property for spacing
7. Integration with framework styling system
8. Theme-aware spacing values

### Recommended Features (Level 3, 67% adoption)
1. Direction control (row/column) or separate horizontal variant
2. Responsive direction changes
3. Polymorphic rendering (as/component prop)
4. Named spacing tokens (xs/sm/md/lg/xl)
5. Theme spacing scale (numeric multipliers)
6. Built-in divider support
7. Array syntax for responsive values
8. Wrap control (flexWrap prop)

### Optional Innovations (<67% adoption)
1. Specialized variants (VStack/HStack)
2. Full base container prop inheritance
3. useFlexGap flag for browser compatibility
4. PostCSS polyfill for old browsers
5. shouldWrapChildren for inline-block behavior
6. sx prop for CSS-in-JS styling
7. StackDivider specialized component

### API Design Recommendations

**Direction Approach** (choose one):
1. Single component with direction prop (MUI approach)
2. Base + specialized variants (Chakra approach - Stack/VStack/HStack)
3. Separate vertical/horizontal components (Mantine approach - Stack/Group)

**Spacing Prop Naming**:
- Recommend `gap` over `spacing` (aligns with CSS property name)
- Support both theme tokens (xs/sm/md) and numeric values
- Consider supporting both numeric scale and direct CSS values

**Alignment Prop Naming**:
- Support both shorthand (`align`, `justify`) and CSS names (`alignItems`, `justifyContent`)
- Shorthand improves DX, CSS names aid migration and clarity

**Responsive Syntax**:
- Object notation is essential (100% adoption)
- Array notation is nice-to-have (67% adoption)
- Mobile-first approach is standard

### Theme Integration Strategy

1. **Spacing scale**: Always resolve through theme spacing
2. **Breakpoints**: Use theme breakpoint definitions
3. **Defaults**: Consider theme-configurable defaults
4. **Tokens**: Accept both theme tokens and raw CSS values

## Testing Considerations

Comprehensive testing should cover:

1. **Direction Patterns**:
   - Vertical (column) default
   - Horizontal (row) if supported
   - Row-reverse and column-reverse if supported
   - Responsive direction changes

2. **Spacing Behavior**:
   - Numeric spacing values
   - Theme token spacing values
   - Responsive spacing values
   - Gap implementation (no margin on first/last child)

3. **Alignment Combinations**:
   - All align × justify combinations
   - start, center, end, space-between, space-around, stretch
   - Baseline alignment
   - Responsive alignment changes

4. **Responsive Behavior**:
   - Object notation resolution
   - Array notation resolution (if supported)
   - Breakpoint transitions
   - Mobile-first cascade

5. **Divider Integration** (if supported):
   - Dividers render between children (not before first/after last)
   - Dividers respect direction (horizontal for vertical Stack)
   - Dividers with responsive direction changes

6. **Integration**:
   - Children rendering (no unwanted wrappers)
   - Polymorphic rendering (if supported)
   - Style props integration
   - Theme value resolution

7. **Edge Cases**:
   - Empty Stack container
   - Single child (no dividers/spacing issues)
   - Many children (performance)
   - Nested Stacks

## Framework Comparison Summary

| Feature | Chakra UI | MUI | Mantine |
|---------|-----------|-----|---------|
| **Direction control** | ✅ direction prop + VStack/HStack | ✅ direction prop | ❌ No (vertical only) |
| **Horizontal layout** | ✅ HStack variant | ✅ direction="row" | ✅ Group component (separate) |
| **Spacing prop** | ✅ spacing + gap | ✅ spacing | ✅ gap |
| **Spacing type** | Theme scale + tokens | Theme scale | Theme tokens |
| **Default spacing** | 0.5rem | 0 | Not specified |
| **Alignment** | ✅ align (alias) + alignItems | ✅ alignItems | ✅ align |
| **Justification** | ✅ justify (alias) + justifyContent | ✅ justifyContent | ✅ justify |
| **Responsive** | ✅ Array & Object | ✅ Array & Object | ✅ Object |
| **Dividers** | ✅ divider prop + StackDivider | ✅ divider prop | ❌ No built-in |
| **Wrap control** | ✅ wrap prop | ✅ flexWrap prop | ❌ No |
| **Polymorphism** | ✅ as prop | ✅ component prop | Likely (not doc'd) |
| **Style system** | ✅ Box props | ✅ sx prop | ✅ Style props |
| **CSS gap** | ✅ gap prop | ✅ useFlexGap flag | ✅ Default |
| **Browser fallback** | Not mentioned | ✅ Margin-based default | ✅ PostCSS polyfill |
| **API complexity** | High (many options) | Medium (balanced) | Low (minimal) |
| **Philosophy** | Maximum versatility | Balanced flexibility | Focused simplicity |

## Key Takeaways

### Design Patterns:
1. **Stack universally means vertical**: All frameworks default to column direction
2. **Spacing automation is core**: Gap management is the primary value proposition
3. **Theme integration is expected**: Spacing always ties to theme/design system
4. **Responsive design is standard**: All props support breakpoint-based values
5. **Semantic clarity matters**: VStack/HStack or Stack/Group improve code readability

### Implementation Approaches:
1. **One component vs multiple**: Trade-off between versatility (single Stack) and clarity (Stack/VStack/HStack or Stack/Group)
2. **CSS gap vs margin**: Modern approach (gap) with fallbacks (margin/polyfills)
3. **Prop naming**: Balance between CSS property names and friendly shorthands
4. **API surface**: Trade-off between comprehensive (Chakra) and minimal (Mantine)

### Framework Trends:
1. **Moving toward gap property**: CSS gap is the modern standard
2. **Responsive-first design**: Breakpoint support on all props
3. **Theme integration depth**: Not just spacing values, but entire design system
4. **TypeScript-first**: All frameworks provide comprehensive types
5. **Composition over configuration**: Stack as primitive for building complex layouts

## Raw Data

Individual framework reports available at:
- `/ai/research/stack/chakra-ui/usage-patterns.md`
- `/ai/research/stack/mui/usage-patterns.md`
- `/ai/research/stack/mantine/usage-patterns.md`

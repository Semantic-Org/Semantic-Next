# Component Pattern Research: Flex (Layout)

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3 (Chakra UI, Ant Design, Mantine)
- Date: 2025-11-05
- Unique patterns identified: 15+ distinct patterns across flexbox layout, alignment, and responsive design

## Component Definition Consensus

Flex is a specialized layout component that provides a convenient wrapper for CSS flexbox layouts. All three frameworks consistently conceptualize Flex as:

- **Core purpose**: Simplify flexbox layouts by providing a pre-configured `display: flex` container with intuitive props for common flexbox patterns
- **Mental model**: A declarative flex container that eliminates the need to manually set `display: flex` and provides friendly prop names for flexbox properties
- **Semantic meaning**: A purely structural layout primitive with no inherent semantic meaning (renders as `div` by default), focused on arranging children in flexible layouts

**Key observation**: Flex is a convenience component - all three frameworks position it as a specialized version of their base Box/container component with `display: flex` pre-applied and friendly flex-specific prop names.

## Terminology Variations

### Component Names
- **Flex** (3/3): Universal naming across all frameworks

### Direction Props
- **direction** (1): Chakra UI - `direction="column"`
- **vertical** (1): Ant Design - boolean prop `vertical={true}` (defaults horizontal)
- **direction** (1): Mantine - `direction="column"` (same as Chakra)

### Alignment Props
**Justify (main axis)**:
- **justify** (2): Chakra, Mantine - `justify="center"`
- **justifyContent** (3): All support full CSS property name
- Ant Design: `justify` with more options ('start', 'end', 'center', 'space-around', 'space-between', 'space-evenly', 'normal')

**Align (cross axis)**:
- **align** (2): Chakra, Mantine - `align="center"`
- **alignItems** (3): All support full CSS property name
- Ant Design: `align` with options ('start', 'end', 'center', 'baseline', 'stretch', 'normal')

### Spacing Props
- **gap** (3): Universal CSS gap property support
- Ant Design: Also accepts `gap={[horizontal, vertical]}` array format
- Theme tokens: All support theme-aware gap values

### Wrap Props
- **wrap** (3): All support wrap control
- Values: 'wrap', 'nowrap', 'wrap-reverse' (standard CSS values)

### Polymorphism
- **as** (1): Chakra UI - `as="section"`
- **component** (1): Mantine - `component="section"`
- Ant Design: No explicit polymorphism documented

## Pattern Inventory

### Core Flexbox Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Direction control | Set flex-direction | 3/3 (100%) | Level 1 | All (direction/vertical prop) |
| Justify content | Main axis alignment | 3/3 (100%) | Level 1 | All (justify prop) |
| Align items | Cross axis alignment | 3/3 (100%) | Level 1 | All (align prop) |
| Gap spacing | Space between items | 3/3 (100%) | Level 1 | All (CSS gap support) |
| Wrap control | Control line wrapping | 3/3 (100%) | Level 1 | All (wrap prop) |

### Additional Flexbox Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Flex grow/shrink | Control item sizing | 2/3 (67%) | Level 3 | Chakra (via Box props), Mantine (style props) |
| Basis control | Initial main size | 2/3 (67%) | Level 3 | Chakra, Mantine |
| Row/column gap | Separate axis gaps | 2/3 (67%) | Level 3 | Ant (via array), Mantine (rowGap/columnGap) |
| Reverse direction | Reverse item order | 3/3 (100%) | Level 1 | All (row-reverse, column-reverse) |

### Responsive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Responsive direction | Change direction at breakpoints | 3/3 (100%) | Level 1 | All |
| Responsive alignment | Adjust alignment per breakpoint | 3/3 (100%) | Level 1 | All |
| Responsive gap | Different gaps at breakpoints | 3/3 (100%) | Level 1 | All |
| Object notation | Breakpoint objects `{sm, md, lg}` | 3/3 (100%) | Level 1 | All |
| Array notation | Breakpoint arrays `[v1, v2, v3]` | 2/3 (67%) | Level 3 | Chakra, Ant (for gap only) |

### Layout Pattern Defaults
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Horizontal default | Flex-direction: row by default | 3/3 (100%) | Level 1 | All |
| Start alignment default | Justify: flex-start default | 2/3 (67%) | Level 3 | Chakra, Ant (horizontal), Mantine |
| Stretch alignment default | Align: stretch default | 1/3 (33%) | Level 4 | Ant (vertical mode) |

### Integration Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Box prop inheritance | Inherits spacing/color props | 2/3 (67%) | Level 3 | Chakra (full Box), Mantine (style props) |
| Theme integration | Gap uses theme spacing | 3/3 (100%) | Level 1 | All |
| Polymorphic rendering | Render as different elements | 2/3 (67%) | Level 3 | Chakra (as), Mantine (component) |
| CSS passthrough | Accept all CSS flex properties | 3/3 (100%) | Level 1 | All (via style or direct props) |

## Notable Patterns

### Highly Adopted (Level 1, 100% adoption)

**Universal patterns across all Flex implementations:**

- **Direction control**: All provide convenient direction prop (though naming differs)
- **Justify and align**: All provide friendly props for main/cross axis alignment
- **Gap support**: Modern CSS gap universally supported
- **Wrap control**: All support flex-wrap via wrap prop
- **Responsive design**: All props accept responsive values
- **Theme integration**: Gap values integrate with theme spacing scales
- **Horizontal default**: All default to row/horizontal direction

### Emerging Patterns (Level 3, 67% adoption)

**Patterns with moderate adoption:**

- **Flex item control**: 67% support grow/shrink/basis (Chakra, Mantine)
- **Separate row/column gaps**: 67% support independent axis gaps
- **Polymorphic rendering**: 67% can render as different HTML elements
- **Box prop inheritance**: 67% inherit additional styling props from base Box component
- **Array responsive notation**: 67% support array syntax (Chakra fully, Ant for gap only)

### Unique Innovations

**Framework-specific features:**

- **Ant Design array gap format**: `gap={[16, 8]}` for [horizontal, vertical] gaps - unique convenient syntax
- **Ant Design alignment defaults**: Different defaults for horizontal (start) vs vertical (stretch) modes - context-aware defaults
- **Ant Design minimal size**: Only ~670B bundle impact - extremely lightweight
- **Chakra UI prop aliases**: Most intuitive aliases (justify, align, direction, wrap) for rapid development
- **Chakra UI full Box inheritance**: All Box styling props available on Flex
- **Mantine polymorphism**: Most sophisticated component prop with full type safety
- **Mantine separate gap props**: `rowGap` and `columnGap` props in addition to unified `gap`

## Pattern Correlations

### When direction control exists:
- Justify content always present (3/3, 100%)
- Align items always present (3/3, 100%)
- Wrap control always present (3/3, 100%)
- Gap support always present (3/3, 100%)
- Suggests: Flex components bundle all core flexbox features together

### When Box inheritance exists:
- Polymorphic rendering present in 2/2 cases (100%)
- Responsive patterns comprehensive in 2/2 cases (100%)
- Suggests: Full Box inheritance correlates with rich feature sets

### When theme integration is strong:
- Gap uses theme tokens in 3/3 cases (100%)
- Responsive breakpoints from theme in 3/3 cases (100%)
- Suggests: Theme integration is holistic, not piecemeal

## Implementation Notes

### Common Technical Approaches

1. **Base Implementation Pattern**:
   ```
   Flex = Box + { display: 'flex' } + flex-specific prop mapping
   ```
   All frameworks use this conceptual model - Flex is a specialized Box

2. **Prop Alias Strategy**:
   - **Friendly aliases**: `justify`, `align`, `direction`, `wrap`
   - **CSS passthr ough**: `justifyContent`, `alignItems`, `flexDirection`, `flexWrap`
   - **Support both**: Chakra and Mantine support both alias and CSS property names

3. **Default Alignment Behavior**:
   - **Chakra**: No defaults, uses CSS defaults (flex-start, stretch)
   - **Ant Design**: Context-aware - horizontal (start), vertical (stretch)
   - **Mantine**: Uses CSS defaults

4. **Gap Implementation**:
   - **Modern CSS gap**: All use native CSS gap property
   - **Theme resolution**: `gap={4}` → `theme.spacing[4]`
   - **Browser support**: Modern browsers only (IE11 not supported)

5. **Responsive Value Processing**:
   ```
   direction={{base: 'column', md: 'row'}}
   → @media (min-width: md) { flex-direction: row; }
   ```
   Mobile-first media query generation

### Performance Considerations

- **Minimal overhead**: Flex adds negligible performance cost over Box
- **CSS gap**: More performant than margin-based spacing
- **No wrapper elements**: Children rendered directly (unlike some spacing components)
- **Bundle size**: Ant Design's Flex is only ~670B

### Framework-Specific Strengths

**Chakra UI**:
- Most intuitive prop names (direction vs vertical boolean)
- Full Box prop inheritance (maximum flexibility)
- Excellent prop alias system (both short and CSS names work)

**Ant Design**:
- Extremely lightweight (~670B)
- Unique array gap format for quick horizontal/vertical gaps
- Context-aware defaults (different for horizontal vs vertical)
- Most alignment options (7 justify, 6 align)

**Mantine**:
- Most sophisticated polymorphic support
- Separate rowGap/columnGap props
- Full responsive object support on all props
- Clean API without prop bloat

## Architectural Insights

### Three Implementation Philosophies

1. **Chakra UI - Maximum Convenience**:
   - Flex inherits ALL Box props (spacing, colors, etc.)
   - Multiple ways to set properties (aliases + CSS names)
   - Direction prop accepts 4 values (row, column, row-reverse, column-reverse)
   - Philosophy: Make common patterns effortless

2. **Ant Design - Minimalist Efficiency**:
   - Minimal prop surface (only flex-specific props)
   - Clever shortcuts (vertical boolean, gap array)
   - Context-aware defaults
   - Smallest bundle size
   - Philosophy: Do one thing well, keep it small

3. **Mantine - Structured Flexibility**:
   - Balanced prop set (flex + essential style props)
   - Polymorphic rendering for semantic HTML
   - Separate and unified gap control
   - Clean API boundaries
   - Philosophy: Flexibility with structure

### Prop Naming Evolution

The industry shows movement toward:
- **Friendly aliases** over CSS property names (justify vs justifyContent)
- **Boolean shortcuts** for common cases (vertical prop)
- **Unified syntax** (object notation for responsive)
- **Theme integration** (gap values from spacing scale)

### Flex vs Stack/Group Trade-offs

| Aspect | Flex | Stack | Group |
|--------|------|-------|-------|
| Use case | Custom layouts | Vertical/horizontal stacking | Horizontal grouping |
| Props | Full flexbox | Direction + gap | Gap only |
| Alignment | Full control | Basic | Basic |
| Complexity | Medium | Low | Low |
| Flexibility | High | Medium | Low |

**When to use Flex**:
- Need custom alignment (justify, align)
- Need wrapping control
- Need responsive direction changes
- Need reverse direction
- Complex flex layouts

**When to use Stack/Group**:
- Simple vertical or horizontal stacking
- Don't need custom alignment
- Want minimal API surface
- Simpler mental model preferred

## Recommendations for Implementation

Based on pattern prevalence, a robust Flex implementation should include:

### Essential Features (Level 1, 100% adoption)
1. Direction control (prop accepting row, column, row-reverse, column-reverse)
2. Justify content alignment (prop with all flex justification values)
3. Align items alignment (prop with all flex alignment values)
4. Gap spacing (CSS gap with theme integration)
5. Wrap control (prop with wrap, nowrap, wrap-reverse)
6. Responsive prop support on all props
7. Theme-aware gap values
8. Horizontal (row) default direction

### Recommended Features (Level 3, 67% adoption)
1. Flex grow/shrink/basis control (via inherited or dedicated props)
2. Separate row and column gaps
3. Polymorphic rendering (as/component prop)
4. Box prop inheritance (spacing, colors, etc.)
5. Array syntax for responsive values
6. Prop aliases (both friendly and CSS property names)

### Optional Innovations (<67% adoption)
1. Array gap format for [horizontal, vertical] gaps
2. Context-aware alignment defaults
3. Boolean direction shortcuts (vertical prop)
4. Minimal bundle optimization
5. Extended alignment options beyond CSS standard

### Prop Naming Recommendations

**Recommend friendly aliases**:
- `direction` over `flexDirection` (more intuitive)
- `justify` over `justifyContent` (shorter, clearer)
- `align` over `alignItems` (shorter, clearer)
- `wrap` over `flexWrap` (sufficient)

**Support both alias and CSS names** (like Chakra):
- Zero downside
- Accommodates all developer preferences
- Easier migration from CSS

**Consider boolean shortcuts** (like Ant):
- `vertical` prop for common column direction
- Reduces cognitive load for simple cases
- Can coexist with full direction prop

### Theme Integration Strategy

1. **Gap spacing**: Always resolve through theme spacing scale
2. **Breakpoints**: Use theme breakpoint definitions
3. **Defaults**: Consider theme-defined defaults
4. **Tokens**: Accept both theme tokens and raw CSS values

## Testing Considerations

Comprehensive testing should cover:

1. **Direction Patterns**:
   - Row (default)
   - Column
   - Row-reverse
   - Column-reverse
   - Responsive direction changes

2. **Alignment Combinations**:
   - All justify × align combinations
   - Start, center, end, space-between, space-around, space-evenly
   - Baseline and stretch alignment
   - Responsive alignment changes

3. **Gap Behavior**:
   - Numeric gap values
   - Theme token gap values
   - Responsive gap values
   - Row and column gaps (if supported)
   - Array gap format (if supported)

4. **Wrap Scenarios**:
   - Nowrap behavior
   - Wrap with multiple lines
   - Wrap-reverse
   - Gap spacing with wrapped items

5. **Responsive Behavior**:
   - Object notation resolution
   - Array notation resolution (if supported)
   - Breakpoint transitions
   - Mobile-first cascade

6. **Integration**:
   - Children rendering (no wrappers added)
   - Polymorphic rendering (if supported)
   - Box prop inheritance (if supported)
   - Theme value resolution

7. **Edge Cases**:
   - Empty Flex container
   - Single child
   - Many children (wrapping performance)
   - Conflicting props (e.g., direction array + vertical boolean)

## Framework Comparison Summary

| Feature | Chakra UI | Ant Design | Mantine |
|---------|-----------|------------|---------|
| **Direction prop** | ✅ direction | ✅ vertical (boolean) | ✅ direction |
| **Justify prop** | ✅ justify (alias) | ✅ justify (7 options) | ✅ justify (alias) |
| **Align prop** | ✅ align (alias) | ✅ align (6 options) | ✅ align (alias) |
| **Gap support** | ✅ gap | ✅ gap + array format | ✅ gap + rowGap/columnGap |
| **Wrap control** | ✅ wrap | ✅ wrap | ✅ wrap |
| **Responsive** | ✅ Array & Object | ✅ Object only | ✅ Object |
| **Polymorphism** | ✅ as prop | ❌ No | ✅ component prop |
| **Box inheritance** | ✅ Full | ❌ Minimal | ⚠️ Style props |
| **Prop aliases** | ✅ Both | ✅ Aliases only | ✅ Both |
| **Bundle size** | Standard | ~670B (minimal) | Standard |
| **Defaults** | CSS defaults | Context-aware | CSS defaults |
| **Philosophy** | Maximum convenience | Minimal efficiency | Structured flexibility |

## Raw Data

Individual framework reports available at:
- `/ai/research/flex/chakra-ui/usage-patterns.md`
- `/ai/research/flex/ant-design/usage-patterns.md`
- `/ai/research/flex/mantine/usage-patterns.md`

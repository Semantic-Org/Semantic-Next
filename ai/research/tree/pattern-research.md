# Component Pattern Research: Tree / Tree View

> Last Modified: 2025-11-10 (Enhanced with Sophisticated Design Patterns section)

## Research Summary
- Frameworks surveyed: 5 (Ant Design, Mantine, MUI, Nuxt UI, PrimeReact)
- Date: 2025-11-10
- Unique patterns identified: 47

## Component Definition Consensus

Tree components across frameworks consistently represent **hierarchical data structures** that enable users to view, navigate, and interact with parent-child relationships. The mental model is universally that of a file system explorer or organizational chart where nodes can be expanded to reveal children, selected for actions, and manipulated through various interactions.

**Core Purpose**: Display and enable interaction with nested, hierarchical data through an expandable/collapsible interface.

**Common Use Cases**:
- File system browsers / directory trees
- Organizational charts
- Taxonomy browsers
- Navigation menus
- Settings hierarchies
- Category structures

## Terminology Variations

### Component Names
- "Tree" (4 frameworks) = Ant Design, Mantine, PrimeReact, Nuxt UI
- "TreeView" / "Tree View" (1 framework) = MUI
- Specialized variants: "DirectoryTree" (Ant Design), "SimpleTreeView" vs "RichTreeView" (MUI)

### Prop/API Names
- **Expansion control**: `expandedKeys` (Ant Design, PrimeReact) = `expanded` (MUI) = `v-model:expanded` (Nuxt UI) = `useTree()` state (Mantine)
- **Selection control**: `selectedKeys` (Ant Design, PrimeReact) = `selectedItems` (MUI) = `v-model` (Nuxt UI) = `useTree()` state (Mantine)
- **Node checking**: `checkable` (Ant Design) = `checkboxSelection` (MUI) = composed via slots (Mantine, Nuxt UI) = `selectionMode="checkbox"` (PrimeReact)
- **Data structure**: `treeData` (Ant Design) = `data` (Mantine) = `items` (MUI, Nuxt UI) = `value` (PrimeReact)

### State Values
- **Node identifiers**: All frameworks use string-based unique keys/IDs
- **Selection format**: Object-based `{ 'key': true }` (Ant Design, PrimeReact) vs array-based `['key1', 'key2']` (MUI, Nuxt UI, Mantine)

## Pattern Inventory

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Text content | Display text labels on nodes | 5/5 (100%) | **Level 1 (Universal)** | All via native `title`/`label` prop |
| Icon support | Display icons alongside labels | 5/5 (100%) | **Level 1 (Universal)** | Native in Ant Design, MUI, Nuxt UI, PrimeReact; Composed in Mantine |
| Custom content | Render arbitrary content in nodes | 5/5 (100%) | **Level 1 (Universal)** | Native rendering functions in all frameworks |
| Badges/counts | Display badges or count indicators | 4/5 (80%) | **Level 2 (Common)** | Composed support in Ant Design, Mantine, MUI, Nuxt UI; not documented in PrimeReact |

### Interaction Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Expandable/collapsible | Toggle node expansion state | 5/5 (100%) | **Level 1 (Universal)** | Native in all frameworks with comprehensive state control |
| Selectable nodes | Click to select nodes | 5/5 (100%) | **Level 1 (Universal)** | Native in all frameworks, single selection by default |
| Multi-select | Select multiple nodes simultaneously | 5/5 (100%) | **Level 1 (Universal)** | Native via dedicated prop in all frameworks |
| Checkable nodes | Display checkboxes for selection | 5/5 (100%) | **Level 1 (Universal)** | Native in Ant Design, MUI, PrimeReact; Composed in Mantine, Nuxt UI |
| Parent-child checkbox relationships | Auto-check children when parent checked | 3/5 (60%) | **Level 3 (Moderate)** | Native in Ant Design, Nuxt UI (v4.1+); Composed in Mantine; NOT in MUI (by design); Native in PrimeReact |
| Draggable nodes | Drag-and-drop reordering | 3/5 (60%) | **Level 3 (Moderate)** | Native in Ant Design, PrimeReact; Pro in MUI; Composed in Nuxt UI; Not in Mantine |
| Search/filter | Filter visible nodes by text | 3/5 (60%) | **Level 3 (Moderate)** | Native in Ant Design (function), PrimeReact (built-in UI); Custom in MUI; Not in Mantine, Nuxt UI |
| Label editing | Edit node labels inline | 1/5 (20%) | **Level 4 (Occasional)** | Native in MUI only (free version) |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Expanded/Collapsed | Track which nodes are expanded | 5/5 (100%) | **Level 1 (Universal)** | Native controlled/uncontrolled in all frameworks |
| Selected | Track which nodes are selected | 5/5 (100%) | **Level 1 (Universal)** | Native state management in all frameworks |
| Loading | Display loading indicators | 3/5 (60%) | **Level 3 (Moderate)** | Native in Ant Design, MUI, PrimeReact; Not in Mantine, Nuxt UI |
| Disabled | Disable interaction with nodes | 3/5 (60%) | **Level 3 (Moderate)** | Native in Ant Design, MUI, Nuxt UI; Not in Mantine, PrimeReact (undocumented) |
| Focused | Track keyboard focus state | 2/5 (40%) | **Level 3 (Moderate)** | Explicitly exposed in MUI, implicit in all via keyboard nav |
| Indeterminate | Partial selection state for parents | 4/5 (80%) | **Level 2 (Common)** | Native in Ant Design, Mantine, Nuxt UI (v4.1+), PrimeReact; Manual in MUI |

### Data Loading Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Async loading | Load children on-demand | 3/5 (60%) | **Level 3 (Moderate)** | Native in Ant Design (`loadData`), PrimeReact (`onExpand`); Pro in MUI (lazy loading); Not in Mantine, Nuxt UI |
| Initial data | Provide full tree upfront | 5/5 (100%) | **Level 1 (Universal)** | All frameworks support complete initial data |

### Performance Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Virtual scrolling | Render only visible nodes | 2/5 (40%) | **Level 3 (Moderate)** | Native in Ant Design (default v5), Nuxt UI (v4.1+); Pro/In-Progress in MUI; Not in Mantine, PrimeReact |
| Large dataset optimization | Techniques for 1000+ nodes | 3/5 (60%) | **Level 3 (Moderate)** | Virtual scroll in Ant Design, Nuxt UI; Async loading in Ant Design, PrimeReact; Performance issues >1000 in MUI without Pro |

### Visual Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Connecting lines | Visual lines between parent-child | 1/5 (20%) | **Level 4 (Occasional)** | Native in Ant Design only; CSS-only in others |
| Block node style | Full-width node backgrounds | 2/5 (40%) | **Level 3 (Moderate)** | Native in Ant Design, Nuxt UI; CSS-only in MUI, Mantine, PrimeReact |
| Custom indentation | Control nesting indentation | 3/5 (60%) | **Level 3 (Moderate)** | Native prop in Mantine, MUI, Nuxt UI; Style-based in Ant Design, PrimeReact |
| Custom icons | Replace expand/collapse icons | 5/5 (100%) | **Level 1 (Universal)** | All frameworks support custom icons |

### Specialized Variants
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Directory tree | File/folder specific styling | 3/5 (60%) | **Level 3 (Moderate)** | Dedicated component in Ant Design; Examples in MUI, Nuxt UI; Natural use case in all |
| Flat rendering | Display hierarchy without nesting | 1/5 (20%) | **Level 4 (Occasional)** | Native in Nuxt UI v4.1+ only |

### Architecture Patterns
| Pattern | Description | Prevalence | Usage Level | Support Details |
|---------|-------------|------------|-------------|-----------------|
| Controlled state | External state management | 5/5 (100%) | **Level 1 (Universal)** | All frameworks support controlled state patterns |
| Uncontrolled state | Internal state management | 5/5 (100%) | **Level 1 (Universal)** | All frameworks provide uncontrolled/default state options |
| Hooks-based state | State via React/Vue hooks | 3/5 (60%) | **Level 3 (Moderate)** | Explicit in Mantine (`useTree`), MUI (`useTreeViewApiRef`); Implicit via React/Vue hooks in all |
| Template/slot customization | Replace component internals | 3/5 (60%) | **Level 3 (Moderate)** | Native in Mantine (`renderNode`), MUI (slots), Nuxt UI (slots), PrimeReact (templates) |
| Imperative API | Programmatic control methods | 2/5 (40%) | **Level 3 (Moderate)** | Explicit in Mantine (`tree.expand()`), MUI (`apiRef`); Event-based in others |

## Notable Patterns

### Highly Adopted (Level 1-2) - Clear Consensus

**Level 1 (Universal - 100%):**
- Text content display via native props
- Icon support (native or composed)
- Custom content rendering
- Expandable/collapsible nodes with state control
- Single and multi-selection
- Checkable nodes (native or composed)
- Expanded/collapsed state tracking
- Selected state tracking
- Controlled and uncontrolled state patterns
- Custom icon replacement

**Level 2 (Common - 70-89%):**
- Badge/count display (80% via composition)
- Indeterminate checkbox state (80% native support)

These patterns represent the **core expectations** for any tree component implementation.

### Emerging Patterns (Level 3-4) - Moderate Adoption

**Level 3 (Moderate - 40-69%):**
- Parent-child checkbox relationships (60%): Becoming expected, but MUI deliberately excludes
- Drag-and-drop reordering (60%): Often behind paywalls or composition
- Search/filter (60%): Split between native UI and custom implementation
- Loading states (60%): Critical for async scenarios
- Disabled nodes (60%): Common need but inconsistent support
- Async data loading (60%): Essential for large datasets
- Virtual scrolling (40%): Growing importance with performance demands
- Directory tree variants (60%): Common specialized use case

**Level 4 (Occasional - 20-39%):**
- Connecting lines (20%): Visual preference, not functional necessity
- Inline label editing (20%): Specialized requirement
- Flat rendering mode (20%): Recent innovation (Nuxt UI v4.1)

### Unique Innovations (Level 5) - Framework-Specific

**Ant Design:**
- DirectoryTree specialized component (separate from main Tree)
- Virtual scrolling enabled by default in v5
- `scrollTo()` method for programmatic navigation

**Mantine:**
- Complete state separation via `useTree` hook pattern
- Minimal default styling philosophy
- Value-based operations (strings, not objects)

**MUI:**
- Two-component strategy (SimpleTreeView vs RichTreeView)
- Explicit parent-child selection independence (design choice)
- Pro/Community feature split with commercial licensing

**Nuxt UI:**
- `propagate-select` and `bubble-select` props for explicit control
- Flat rendering mode with visual indentation (v4.1+)
- VueUse integration patterns

**PrimeReact:**
- Dual filter modes ("lenient" vs "strict")
- `togglerTemplate` separate from `nodeTemplate`
- Three distinct selection modes with fine-grained control

### Sophisticated Design Patterns

Beyond feature presence, these patterns show evidence of deep user testing or non-obvious problem-solving. They represent solutions preventing problems rather than just enabling features, demonstrating edge case awareness and design maturity.

#### 1. Mantine's `elementProps` Pattern - Accessibility Preservation in Custom Rendering

**What it does**: When using custom `renderNode` rendering, Mantine provides a pre-configured `elementProps` object containing all necessary event handlers, ARIA attributes, and styling that must be spread onto the custom element's root.

**Why it's sophisticated**: This solves the critical problem "How do we allow complete visual customization without breaking accessibility?" Most frameworks either restrict customization or trust developers to implement accessibility correctly (often resulting in broken keyboard navigation and screen reader support). Mantine's approach makes the correct choice (spreading elementProps) the path of least resistance while still allowing full customization.

**Evidence of design maturity**:
- Prevents the common mistake of custom rendering breaking focus management
- Requires no accessibility knowledge from developers implementing custom nodes
- Pattern works with any component architecture (divs, custom components, etc.)
- Documented clearly with examples showing proper spreading technique
- Represents thoughtful restraint: they could have just exposed raw APIs, but chose to guide correct usage

#### 2. MUI's Explicit Parent-Child Selection Independence - Deliberate Default Choice

**What it does**: When selecting a parent node in checkbox mode, MUI does NOT automatically select children. When all children are selected, the parent does NOT automatically become selected. This is explicitly documented as a design choice.

**Why it's sophisticated**: This represents a non-obvious insight: automatic cascading selection creates confusion in many real-world scenarios. Consider a file browser where selecting a "Documents" folder doesn't mean you want all 10,000 documents selected for deletion. Or a permissions tree where granting access to a department shouldn't automatically grant access to all sub-departments. MUI chose the safer, more predictable default despite "auto-cascade" being the common pattern that frameworks cargo-cult from each other.

**Evidence of design maturity**:
- Explicit documentation of the design decision and rationale
- Community requests for cascading behavior are acknowledged but design is defended
- Developers who need cascading can implement it (custom implementation documented)
- Choice prioritizes predictability over convenience
- Shows willingness to diverge from "standard" when the standard causes problems

#### 3. PrimeReact's Dual Filter Modes - Different Mental Models for "Search"

**What it does**: Provides two filter modes: "lenient" (stops searching at first matching node) and "strict" (continues searching through all descendants of matching nodes).

**Why it's sophisticated**: This reveals understanding that "filtering a tree" has two distinct mental models that users switch between based on context:
- **Lenient mode** answers: "Show me the categories containing my search term" (user wants to find the right folder)
- **Strict mode** answers: "Show me everything related to my search term" (user wants to find all matching content)

Most frameworks implement one behavior and force users to adapt their mental model to the tool. PrimeReact identified that these are fundamentally different user intents requiring different implementations.

**Evidence of design maturity**:
- Naming clearly communicates the difference without requiring documentation reading
- Default choice (lenient) handles the more common "navigate to section" use case
- Feature emerged from real usage patterns, not theoretical completeness
- Solves a problem most developers don't realize exists until they've built the wrong thing

## Pattern Correlations

### When expandable/collapsible exists (100%) →
- Expanded/collapsed state tracking present in 5/5 frameworks (100%)
- Async loading available in 3/5 frameworks (60%)

### When checkable nodes exist (100%) →
- Indeterminate state present in 4/5 frameworks (80%)
- Parent-child relationships present in 3/5 frameworks (60%)
- Multi-select mode present in 5/5 frameworks (100%)

### When virtual scrolling exists (40%) →
- Async loading present in 2/2 frameworks (100% correlation)
- Height prop required in 2/2 frameworks (100% correlation)

### When drag-drop exists (60%) →
- Selection mode present in 3/3 frameworks (100% correlation)
- Never paired with virtual scrolling (0% correlation)

### When custom rendering exists (100%) →
- Icon support present in 5/5 frameworks (100% correlation)
- Badge/count support achievable in 4/5 frameworks (80% correlation)

## Implementation Notes

### State Management Approaches

**Object-Based Keys** (Ant Design, PrimeReact):
```javascript
{ '0-0': true, '0-0-1': true }
```

**Array-Based Keys** (MUI, Nuxt UI, Mantine):
```javascript
['0-0', '0-0-1']
```

**Hook-Based State** (Mantine, MUI):
- External state management via dedicated hooks
- Imperative control methods
- Complete separation of state and presentation

### Performance Thresholds

- **< 100 nodes**: All frameworks perform well without optimization
- **100-1000 nodes**: Virtual scrolling recommended but optional
- **1000-5000 nodes**: Virtual scrolling critical (Ant Design, Nuxt UI) or async loading required
- **> 5000 nodes**: Virtual scrolling mandatory; MUI reports stack overflow issues without Pro version

### Customization Strategies

**Template/Render Functions** (Universal pattern):
- Ant Design: `titleRender`
- Mantine: `renderNode`
- MUI: `slots` system
- Nuxt UI: Vue slots (`#item`, `#item-leading`, etc.)
- PrimeReact: `nodeTemplate`, `togglerTemplate`

**Styling Approaches**:
- CSS classes (all frameworks)
- Inline styles via props (Ant Design, MUI, Nuxt UI)
- Theme system integration (MUI, Mantine)
- Minimal defaults (Mantine) vs opinionated styling (others)

### Accessibility Patterns

All frameworks provide:
- Keyboard navigation (arrow keys, enter, space)
- ARIA attributes (`role="tree"`, `role="treeitem"`)
- Focus management

Variations:
- Tab behavior (Ant Design, MUI, Nuxt UI most robust)
- Screen reader support (all adequate, PrimeReact most detailed)
- Disabled item navigation control (MUI only)

## Data Structure Consensus

### Common TreeNode Properties
```typescript
{
  // Universal (5/5)
  key/id: string           // Unique identifier
  label/title: string      // Display text
  children: TreeNode[]     // Child nodes

  // Very Common (4-5/5)
  icon: string | ReactNode // Icon representation
  disabled: boolean        // Disable interaction

  // Common (3-4/5)
  data: any               // Custom data payload
  leaf: boolean           // Leaf node indicator

  // Framework-specific
  // Ant Design: disableCheckbox, checkable, selectable, switcherIcon
  // MUI: itemId (instead of key)
  // Nuxt UI: defaultExpanded, trailingIcon, slot
  // PrimeReact: partialChecked (in selection state)
  // Mantine: value (instead of key)
}
```

## Framework Philosophy Comparison

### Ant Design
- **Philosophy**: Comprehensive, batteries-included
- **Strength**: Feature completeness, virtual scrolling by default
- **Approach**: Native props for everything

### Mantine
- **Philosophy**: Composition over configuration
- **Strength**: Flexibility through hooks and minimal styling
- **Approach**: State externalization, renderNode for all customization

### MUI
- **Philosophy**: Material Design adherence with enterprise features
- **Strength**: Deep customization via slots, pro features for scale
- **Approach**: Two-component strategy, commercial feature split

### Nuxt UI
- **Philosophy**: Vue-native with modern features
- **Strength**: Recent innovations (flat rendering, virtualization in v4.1)
- **Approach**: Vue composition patterns, slot-based customization

### PrimeReact
- **Philosophy**: Controlled components with accessibility focus
- **Strength**: Comprehensive selection modes, dual filter modes
- **Approach**: Template-based customization, accessibility-first

## Common Limitations Across Frameworks

1. **No built-in search UI** (3/5): Expected to be implemented externally
2. **No connecting lines by default** (4/5): Requires custom CSS
3. **Virtual scrolling gaps**: Only 2/5 have free native support
4. **Drag-drop barriers**: Often Pro feature or requires integration
5. **Large dataset challenges**: Performance issues >1000 nodes common
6. **Parent-child selection inconsistency**: Different philosophies on cascading

## Recommendations for Implementation

### Must-Have Features (Level 1)
- Text display via native prop
- Icon support (native or easy composition)
- Expandable/collapsible with state control
- Single and multi-selection
- Checkable nodes
- Custom content rendering
- Controlled and uncontrolled state patterns

### Should-Have Features (Level 2-3)
- Indeterminate checkbox state
- Parent-child checkbox relationships
- Loading state support
- Disabled state
- Async data loading for large datasets
- Search/filter capability (at least function-based)
- Virtual scrolling or performance optimization

### Nice-to-Have Features (Level 4-5)
- Drag-and-drop reordering
- Inline label editing
- Connecting lines
- Directory tree variant
- Flat rendering mode
- Block node styling

### Architecture Recommendations

1. **Support both controlled and uncontrolled patterns** (universal)
2. **Provide render function/template escape hatch** (universal need)
3. **Consider hook-based state management** (emerging pattern)
4. **Plan for virtual scrolling from start** (critical for scale)
5. **Document performance thresholds clearly** (user expectations)
6. **Make parent-child behavior configurable** (different use cases)

## Raw Data

Individual framework reports available at:
- `ai/research/tree/ant-design/usage-patterns.md`
- `ai/research/tree/mantine/usage-patterns.md`
- `ai/research/tree/mui/usage-patterns.md`
- `ai/research/tree/nuxt-ui/usage-patterns.md`
- `ai/research/tree/primereact/usage-patterns.md`

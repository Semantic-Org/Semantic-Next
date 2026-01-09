# Component Pattern Research: Select / Dropdown / Listbox

> Last Modified: 2025-11-06

## Research Summary
- **Frameworks surveyed**: 11 (Ant Design, Chakra UI, Headless UI, HeroUI/NextUI, Mantine, Material UI, Nuxt UI, PrimeReact, Radix UI Primitives, Radix UI Themes, ShadCN)
- **Date**: 2025-11-06
- **Unique patterns identified**: 60+
- **Research coverage**: Comprehensive across React (8), Vue (1), and headless (3) ecosystems

## Component Definition Consensus

All frameworks agree on the core purpose: **a form control that enables users to select one or more values from a collapsible list of predefined options**. However, they diverge on implementation philosophy:

### Implementation Approaches (3 Categories)

1. **Enhanced Native Select** (2 frameworks: Chakra UI, parts of Mantine)
   - Wraps native `<select>` with design system styling
   - Maintains browser-native behavior and mobile pickers
   - Limited to text-only options
   - Example: Chakra UI's Select component

2. **Custom Implementation** (6 frameworks: Ant Design, HeroUI, MUI, Nuxt UI, PrimeReact, Mantine)
   - Completely custom dropdown with full styling control
   - Supports rich content (icons, avatars, badges, custom layouts)
   - Better cross-browser consistency
   - Example: Ant Design's Select with virtual scrolling

3. **Headless Primitives** (3 frameworks: Headless UI, Radix UI Primitives, ShadCN)
   - Unstyled behavior primitives with full accessibility
   - Maximum customization freedom
   - Require consumer to provide all styling
   - Example: Radix UI's compound component pattern

### Mental Model Spectrum

**Native Select Thinking** → **Dropdown Menu Thinking** → **Combobox Thinking**

- **Left**: Simple single choice from predefined list (Chakra UI)
- **Center**: Rich selection with search/filter (Ant Design, Mantine)
- **Right**: Input-like with autocomplete (not covered by pure Select components)

Most frameworks position their Select in the center, with clear separation from Autocomplete/Combobox components.

## Terminology Variations

| Term | Frameworks | Context |
|------|-----------|---------|
| **Select** | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix Primitives, Radix Themes, ShadCN | Most common term, implies single selection |
| **Dropdown** | PrimeReact | Emphasizes the expansion behavior |
| **Listbox** | Headless UI | ARIA pattern name, emphasizes accessible list |
| **NativeSelect** | MUI | Explicit native `<select>` wrapper variant |

### Sub-Component Terminology

| Concept | Terminology Variations |
|---------|----------------------|
| **Trigger Button** | Trigger (8), Button (2), Field (1) |
| **Dropdown Panel** | Content (6), Options (2), Panel (2), Listbox (1) |
| **Individual Option** | Item (7), Option (4) |
| **Selection Indicator** | Checkmark (5), ItemIndicator (3), Check icon (3) |
| **Group Header** | Label (8), Group Label (3) |

**Observation**: Compound component architectures (Radix, Headless UI, ShadCN) use more granular terminology to reflect their composition patterns.

## Pattern Inventory

### Content Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Text-only options** | 11/11 (100%) | Level 1 | All | Universal - string arrays or text children |
| **Icon + Text in options** | 11/11 (100%) | Level 1-2 | All | Via composition (6) or itemTemplate (5) |
| **Grouped options** | 11/11 (100%) | Level 1 | All | Native support in all frameworks |
| **Placeholder text** | 11/11 (100%) | Level 1 | All | Dedicated prop in all frameworks |
| **Disabled individual options** | 11/11 (100%) | Level 1 | All | Item-level disabled prop/flag |
| **Custom option rendering** | 11/11 (100%) | Level 1-2 | All | Template functions (6) or composition (5) |
| **Avatars/Images in options** | 9/11 (82%) | Level 2 | Ant Design, HeroUI, Nuxt UI, PrimeReact, Mantine, MUI, Headless UI, Radix primitives, ShadCN | Via custom rendering |
| **Chip/Badge in options** | 4/11 (36%) | Level 3 | HeroUI, Nuxt UI, Ant Design (tags mode), MUI (with custom render) | Native in HeroUI/Nuxt, composed in others |
| **Rich HTML content** | 10/11 (91%) | Level 2 | All except Chakra UI (native) | Full React/Vue node support |
| **Sections/Separators** | 10/11 (91%) | Level 2 | All except Chakra UI | Dedicated Separator components |
| **Panel footer content** | 2/11 (18%) | Level 4 | PrimeReact, Ant Design | Template props for footer actions |
| **Empty state messaging** | 6/11 (55%) | Level 3 | Ant Design, Mantine, Nuxt UI, Headless UI (composed), Radix (composed), ShadCN (composed) | "Nothing found" or custom empty states |

**Key Insight**: All frameworks support rich content beyond text, but implementation varies significantly (template props vs composition vs slots).

### State Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Disabled (entire component)** | 11/11 (100%) | Level 1 | All | Universal disabled prop |
| **Controlled value** | 11/11 (100%) | Level 1 | All | value + onChange pattern |
| **Uncontrolled value** | 11/11 (100%) | Level 1 | All | defaultValue prop |
| **Loading state** | 7/11 (64%) | Level 2-3 | Ant Design, HeroUI, Nuxt UI, PrimeReact, ShadCN (via CSS), Mantine (docs), MUI (custom) | Dedicated loading prop (5) or composed (2) |
| **Invalid/Error state** | 9/11 (82%) | Level 2 | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Headless UI (via prop), Radix Primitives | Visual error indication |
| **Required validation** | 10/11 (91%) | Level 2 | All except PrimeReact (implied) | Form integration with required prop |
| **Read-only state** | 6/11 (55%) | Level 3 | Chakra UI, Mantine, MUI, Ant Design (workaround), Chakra (explicit), PrimeReact (docs) | Dedicated prop (5) or disabled workaround |
| **Controlled open state** | 10/11 (91%) | Level 2 | All except Chakra UI | open + onOpenChange props |
| **Clear/reset selection** | 8/11 (73%) | Level 2 | Ant Design, HeroUI, Mantine, Nuxt UI, PrimeReact, Headless UI (manual), Radix (manual), ShadCN (manual) | Clearable/clear button prop |

**Key Insight**: State management is comprehensive across all frameworks with excellent controlled/uncontrolled pattern support.

### Variation Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Size variants** | 9/11 (82%) | Level 1-2 | All except Radix Primitives, ShadCN | Dedicated size prop (xs, sm, md, lg, xl) |
| **Visual style variants** | 10/11 (91%) | Level 1-2 | All except ShadCN | outlined, filled, bordered, flushed, etc. |
| **Color theming** | 8/11 (73%) | Level 2 | Chakra UI, HeroUI, Nuxt UI, MUI, Radix Themes, Ant Design (status), Mantine (via theme), PrimeReact (via theme) | Theme color integration |
| **Border radius control** | 4/11 (36%) | Level 3 | HeroUI, Nuxt UI, Radix Themes, Chakra UI | Dedicated radius prop |
| **Full width option** | 8/11 (73%) | Level 2 | Most frameworks | fullWidth or w-full pattern |
| **Highlight/focus indicators** | 11/11 (100%) | Level 1 | All | Automatic focus states |
| **Checkmark vs highlight** | 7/11 (64%) | Level 2-3 | Ant Design, PrimeReact, Radix (composed), Headless UI (composed), MUI (composed), ShadCN (composed), HeroUI | Toggle selection indicator style |

**Key Insight**: Size and variant systems are nearly universal, showing strong design system integration expectations.

### Selection Behavior Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Single selection** | 11/11 (100%) | Level 1 | All | Core functionality |
| **Multiple selection** | 9/11 (82%) | Level 1-2 | All except Chakra UI, Radix Themes | Multiple/multi-select prop |
| **Allow deselect** | 3/11 (27%) | Level 4 | Mantine, Headless UI, Ant Design (implicit) | Optional deselection of selected item |
| **Auto-select on blur** | 1/11 (9%) | Level 5 | Mantine only | Commits highlighted option on blur |
| **labelInValue mode** | 2/11 (18%) | Level 4 | Ant Design, Mantine (via onChange) | Returns object instead of just value |
| **Custom value comparison** | 3/11 (27%) | Level 4 | Headless UI (by prop), Radix (string only), Ant Design (fieldNames) | Configurable equality checking |

**Key Insight**: Multi-select is nearly universal in custom implementations but absent from native wrappers.

### Search & Filter Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Built-in filter/search** | 7/11 (64%) | Level 2-3 | Ant Design, Mantine, PrimeReact, Headless UI (typeahead), Radix (typeahead), ShadCN (typeahead), HeroUI (typeahead) | filter or searchable prop |
| **Custom filter function** | 4/11 (36%) | Level 3 | Ant Design, Mantine, PrimeReact, Headless UI (manual) | Configurable filter logic |
| **Type-ahead navigation** | 11/11 (100%) | Level 1 | All | Built-in keyboard typing search |
| **Controlled search value** | 3/11 (27%) | Level 4 | Ant Design, Mantine, Headless UI (manual) | searchValue + onSearchChange |
| **Editable input** | 2/11 (18%) | Level 4 | PrimeReact, Ant Design (implicit via tags) | Allows manual text entry |

**Key Insight**: Type-ahead is universal, but full search/filter varies. Headless libraries rely on composition.

### Performance & Scaling Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Virtual scrolling** | 4/11 (36%) | Level 3 | Ant Design, HeroUI, PrimeReact, Mantine (via limit) | Native virtualization for 1000+ items |
| **Item limit/pagination** | 3/11 (27%) | Level 4 | Mantine, Ant Design (via filter), HeroUI | Render limit for performance |
| **Lazy loading** | 2/11 (18%) | Level 4 | Ant Design (composed), HeroUI (async) | Load options on demand |
| **Debounced search** | 1/11 (9%) | Level 5 | Ant Design (documented pattern) | Debounce filter input |

**Key Insight**: Virtual scrolling is present in production-grade libraries handling large datasets, absent in primitives.

### Positioning & Layout Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Auto-positioning** | 11/11 (100%) | Level 1 | All | Automatic collision detection |
| **Side/alignment control** | 9/11 (82%) | Level 2 | All except Chakra UI, Mantine | Explicit side, align props |
| **Offset adjustments** | 8/11 (73%) | Level 2 | Headless UI, Radix Primitives, Radix Themes, ShadCN, MUI, PrimeReact, Ant Design, HeroUI | Fine-tune positioning |
| **Portal rendering** | 9/11 (82%) | Level 2 | All except Chakra UI, Nuxt UI | Render outside DOM hierarchy |
| **Item-aligned positioning** | 3/11 (27%) | Level 4 | Radix Primitives, Radix Themes, ShadCN | MacOS-style menu alignment |
| **Width matching** | 6/11 (55%) | Level 3 | Headless UI, Radix, ShadCN, Mantine, Ant Design, MUI | Match trigger width |

**Key Insight**: Positioning sophistication separates primitives (granular control) from styled libraries (good defaults).

### Interactive & Event Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **onChange handler** | 11/11 (100%) | Level 1 | All | Value change callback |
| **onOpen/onClose handlers** | 9/11 (82%) | Level 2 | All except Chakra UI, Nuxt UI | Dropdown visibility callbacks |
| **Keyboard navigation** | 11/11 (100%) | Level 1 | All | Arrow keys, Enter, Escape, Home/End |
| **Click outside to close** | 11/11 (100%) | Level 1 | All | Standard dropdown behavior |
| **onSelect/onDeselect** | 2/11 (18%) | Level 4 | Ant Design, Headless UI (manual) | Granular selection events |
| **Custom render value** | 8/11 (73%) | Level 2 | Ant Design, HeroUI, Mantine, MUI, PrimeReact, Radix (composed), Headless UI (composed), ShadCN (composed) | Transform displayed value |

**Key Insight**: Event handling is comprehensive with excellent separation between value changes and UI interactions.

### Form Integration Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Implementation |
|---------|-----------|-------------|-----------|----------------|
| **Name prop** | 10/11 (91%) | Level 1 | All except ShadCN (implicit via Radix) | Native form field naming |
| **Hidden native select** | 6/11 (55%) | Level 2-3 | Chakra UI (native), MUI (hidden), Radix Primitives, Radix Themes, ShadCN, Headless UI | Form submission compatibility |
| **Required validation** | 10/11 (91%) | Level 2 | All except PrimeReact | HTML5 required attribute |
| **Error message display** | 6/11 (55%) | Level 3 | Chakra UI, HeroUI, MUI, Nuxt UI, Ant Design (composed), Mantine (composed) | Helper text integration |
| **Label association** | 9/11 (82%) | Level 2 | All except Radix Primitives, ShadCN (manual) | Proper label linkage |

**Key Insight**: Form integration varies from tight (MUI FormControl) to loose (Radix Primitives manual).

## Notable Patterns

### Highly Adopted (Level 1-2: 70%+ implementations)

1. **Text-only options** (100%) - Universal baseline
2. **Icon + Text options** (100%) - Industry expectation for modern UIs
3. **Grouped options with labels** (100%) - Critical for usability with many options
4. **Placeholder text** (100%) - Standard empty state pattern
5. **Disabled items** (100%) - Granular control requirement
6. **Custom option rendering** (100%) - Flexibility for branded UIs
7. **Controlled/Uncontrolled modes** (100%) - React pattern standard
8. **Size variants** (82%) - Design system integration
9. **Visual style variants** (91%) - Design system flexibility
10. **Multiple selection** (82%) - Expected in custom implementations
11. **Loading state** (64%) - Async data requirement
12. **Invalid/Error state** (82%) - Form validation necessity
13. **Controlled open state** (91%) - Programmatic control
14. **Clear selection** (73%) - User convenience
15. **Keyboard navigation** (100%) - Accessibility baseline
16. **Type-ahead search** (100%) - Usability enhancement
17. **Portal rendering** (82%) - Z-index management
18. **Auto-positioning** (82%) - Collision avoidance
19. **onChange handler** (100%) - State management core
20. **Name prop for forms** (91%) - Form integration

**Implementation Recommendation**: These patterns should be considered baseline requirements for any modern Select component.

### Emerging Patterns (Level 3-4: 30-70% implementations)

1. **Avatars in options** (82%) - Increasingly common for user/entity selectors
2. **Rich HTML content** (91%) - Flexibility expectation growing
3. **Sections/Separators** (91%) - Visual organization pattern
4. **Read-only state** (55%) - Display-only mode demand
5. **Color theming** (73%) - Design system sophistication
6. **Checkmark vs highlight toggle** (64%) - Selection indicator preference
7. **Built-in filter/search** (64%) - Moving from nice-to-have to expected
8. **Custom filter function** (55%) - Power user requirement
9. **Width matching** (55%) - Visual alignment preference
10. **Custom render value** (73%) - Branded display needs
11. **Error message display** (55%) - Inline validation trend
12. **Label association** (82%) - Accessibility maturation

**Implementation Recommendation**: Consider these patterns based on target use cases and design system sophistication.

### Unique Innovations (Level 5: <30% implementations)

1. **Chip/Badge in options** (36%) - Visual categorization
   - **Leaders**: HeroUI, Nuxt UI with native integration
   - **Use case**: Issue types, priorities, tags

2. **Panel footer content** (18%) - Action area pattern
   - **Leaders**: PrimeReact, Ant Design
   - **Use case**: "Add new option" buttons, item counts

3. **Virtual scrolling** (36%) - Performance optimization
   - **Leaders**: Ant Design (100k items), HeroUI, PrimeReact, Mantine (limit prop)
   - **Use case**: Large datasets (1000+ items)

4. **Allow deselect** (27%) - UX flexibility
   - **Leaders**: Mantine, Headless UI, Ant Design
   - **Use case**: Optional selection fields

5. **Auto-select on blur** (9%) - Workflow optimization
   - **Leaders**: Mantine only
   - **Use case**: Keyboard-first users, rapid data entry

6. **labelInValue mode** (18%) - Data handling
   - **Leaders**: Ant Design, Mantine
   - **Use case**: Avoid lookup overhead, full object access

7. **Custom value comparison** (27%) - Object handling
   - **Leaders**: Headless UI (by prop), Ant Design (fieldNames)
   - **Use case**: Complex object values, custom equality

8. **Item-aligned positioning** (27%) - MacOS-style UX
   - **Leaders**: Radix ecosystem (Primitives, Themes, ShadCN)
   - **Use case**: Native-feeling menus

9. **Debounced search** (9%) - API optimization
   - **Leaders**: Ant Design (documented pattern)
   - **Use case**: Remote search, API rate limits

10. **Editable input** (18%) - Hybrid behavior
    - **Leaders**: PrimeReact, Ant Design (tags mode)
    - **Use case**: Filter + manual entry combination

**Implementation Recommendation**: Evaluate these based on specific user needs and framework positioning (basic vs advanced).

## Pattern Correlations

### Strong Correlations (Patterns that appear together)

1. **Custom Implementation + Rich Content**
   - Frameworks: Ant Design, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact
   - Pattern: Custom dropdown enables avatars, badges, icons, complex layouts
   - Correlation: 100% of custom implementations support rich content

2. **Multiple Selection + Checkmark Indicators**
   - Frameworks: Ant Design, HeroUI, MUI, PrimeReact, Radix (composed), Headless UI
   - Pattern: Multi-select typically shows checkboxes or checkmarks
   - Correlation: 83% of multi-select implementations have explicit indicators

3. **Search/Filter + Virtual Scrolling**
   - Frameworks: Ant Design, HeroUI, PrimeReact, Mantine
   - Pattern: Searchable selects with large datasets need virtualization
   - Correlation: 100% of virtualized selects support filtering

4. **Headless/Unstyled + Compound Components**
   - Frameworks: Headless UI, Radix Primitives, ShadCN
   - Pattern: Primitives use multi-component composition
   - Correlation: 100% of headless libraries use compound pattern

5. **Template Props + Custom Rendering**
   - Frameworks: Ant Design, HeroUI, PrimeReact, Mantine, MUI
   - Pattern: Template functions enable rich customization
   - Correlation: All React libraries with templates support custom rendering

6. **Portal Rendering + Positioning Control**
   - Frameworks: Headless UI, Radix, ShadCN, MUI, Ant Design, PrimeReact
   - Pattern: Portals require sophisticated positioning
   - Correlation: 90% of portaled components have granular positioning

7. **Form Integration + Hidden Native Select**
   - Frameworks: Chakra UI, MUI, Radix Primitives, Radix Themes, ShadCN, Headless UI
   - Pattern: Native select ensures form submission compatibility
   - Correlation: 75% of form-integrated selects use hidden native

8. **Design System + Size/Variant Props**
   - Frameworks: Chakra UI, HeroUI, Nuxt UI, MUI, Radix Themes, Mantine
   - Pattern: Theme integration requires variant systems
   - Correlation: 100% of design system libraries have sizes/variants

### Anti-Correlations (Patterns that don't appear together)

1. **Native Select Wrapper + Rich Content**
   - Native wrappers (Chakra UI) limited to text-only
   - Rich content requires custom implementation

2. **Headless/Unstyled + Built-in Variants**
   - Primitives (Radix, Headless UI) provide no visual variants
   - Styled libraries (MUI, Ant Design) provide variants

3. **Virtual Scrolling + Native Select**
   - Virtualization requires custom rendering
   - Native select has browser-controlled rendering

4. **Compound Components + Simple API**
   - Multi-component architecture increases complexity
   - Single-component API limits flexibility

## Implementation Notes

### Technical Patterns

1. **Positioning Architecture**
   - **Floating UI integration**: Radix UI, Headless UI use Floating UI for positioning
   - **Custom positioning**: Ant Design, Mantine, PrimeReact have proprietary systems
   - **Item-aligned strategy**: Radix ecosystem positions relative to selected item (MacOS-style)
   - **Popper strategy**: Most use traditional dropdown below trigger

2. **Value Management**
   - **String-only values**: Radix Primitives, Headless UI (HTML limitation for accessibility)
   - **Any value type**: Ant Design, Mantine, MUI (React-only, not form-compatible)
   - **Object comparison**: Headless UI (by prop), Ant Design (fieldNames) solve reference equality
   - **labelInValue**: Ant Design returns full object to avoid lookups

3. **Rendering Strategies**
   - **Portal default**: Most frameworks render in portal for z-index control
   - **In-DOM option**: Available for nested contexts (modals, popovers)
   - **Virtual rendering**: Ant Design, HeroUI, PrimeReact render only visible items
   - **Lazy loading**: Some support on-demand option loading

4. **Event Handling**
   - **Value change**: All frameworks provide onChange with new value
   - **Open/close**: Most expose onOpenChange for visibility control
   - **Selection events**: Ant Design, Headless UI provide onSelect/onDeselect
   - **Blur handling**: Mantine's autoSelectOnBlur unique

5. **Accessibility Implementation**
   - **ARIA patterns**: All follow ListBox or Combobox WAI-ARIA patterns
   - **Keyboard navigation**: Universal arrow keys, Enter, Escape, type-ahead
   - **Focus management**: Automatic focus trap and restoration
   - **Screen reader**: All provide proper ARIA attributes and announcements
   - **Hidden native select**: Common pattern for form compatibility

### API Design Patterns

1. **Prop-Driven Configuration** (Ant Design, Mantine, PrimeReact, MUI)
   - Many props for features (clearable, searchable, loading, etc.)
   - Higher prop count but simpler usage
   - Less composition, more configuration

2. **Compound Components** (Radix, Headless UI, ShadCN, Nuxt UI)
   - Multiple sub-components compose to create UI
   - Lower per-component prop count
   - More composition, less configuration
   - Clearer separation of concerns

3. **Hybrid Approach** (HeroUI, MUI, Nuxt UI)
   - Props for common patterns
   - Slots/composition for advanced cases
   - Balance flexibility and simplicity

4. **Template Functions** (React ecosystem)
   - renderOption, valueTemplate, itemTemplate
   - Function props for custom rendering
   - Powerful but requires React knowledge

5. **Slot-Based** (Vue ecosystem)
   - Named slots for customization
   - More declarative than functions
   - Framework-idiomatic (Vue)

### Architectural Approaches

1. **Monolithic Component**
   - Single component with many props
   - Examples: Ant Design Select, Mantine Select
   - Pros: Simpler to use, less boilerplate
   - Cons: Less flexible, harder to customize parts

2. **Compound Components**
   - Multiple components working together
   - Examples: Radix UI, Headless UI, ShadCN
   - Pros: Maximum flexibility, clear structure
   - Cons: More boilerplate, steeper learning curve

3. **Wrapper + Primitives**
   - High-level component with primitive escape hatch
   - Examples: Mantine (Select wraps Combobox), MUI (variants wrap Input base)
   - Pros: Simple for common cases, powerful for complex
   - Cons: Two APIs to learn

### Framework-Specific Innovations

1. **Ant Design**
   - Tags mode: User-created values with tokenization
   - labelInValue: Return full object instead of just value
   - Virtual scrolling: 100,000 item demos
   - Field name remapping: Adapt any data structure

2. **Headless UI**
   - ListboxSelectedOption: Auto-renders selected option content
   - by prop: Smart object comparison without lookups
   - Dual styling: Data attributes + render props
   - Horizontal orientation: Left/right navigation

3. **Mantine**
   - limit prop: Render limit for performance (not virtualization)
   - allowDeselect: Toggle deselection of selected items
   - autoSelectOnBlur: Commit highlighted option on blur
   - Custom filter function: Full control over search logic

4. **Material UI**
   - renderValue: Transform displayed value
   - Multiple with chips: Built-in multi-select with chips
   - Three variants: standard, outlined, filled
   - FormControl integration: Deep form ecosystem

5. **Radix UI**
   - Item-aligned positioning: MacOS-style menu behavior
   - Two positioning modes: item-aligned vs popper
   - String values only: HTML constraint for accessibility
   - ItemText requirement: Ensures typeahead works

## Raw Data

Individual framework reports:
- [Ant Design](/home/jack/semantic/next/ai/research/select/ant-design/usage-patterns.md)
- [Chakra UI](/home/jack/semantic/next/ai/research/select/chakra-ui/usage-patterns.md)
- [Headless UI](/home/jack/semantic/next/ai/research/select/headless-ui/usage-patterns.md)
- [HeroUI/NextUI](/home/jack/semantic/next/ai/research/select/heroui/usage-patterns.md)
- [Mantine](/home/jack/semantic/next/ai/research/select/mantine/usage-patterns.md)
- [Material UI](/home/jack/semantic/next/ai/research/select/mui/usage-patterns.md)
- [Nuxt UI](/home/jack/semantic/next/ai/research/select/nuxt-ui/usage-patterns.md)
- [PrimeReact](/home/jack/semantic/next/ai/research/select/primereact/usage-patterns.md)
- [Radix UI Primitives](/home/jack/semantic/next/ai/research/select/radix-ui-primitives/usage-patterns.md)
- [Radix UI Themes](/home/jack/semantic/next/ai/research/select/radix-ui-themes/usage-patterns.md)
- [ShadCN](/home/jack/semantic/next/ai/research/select/shadcn/usage-patterns.md)

## Key Insights for Implementation

### 1. Core Feature Set (Must-Have)

Based on 90%+ prevalence across frameworks:

- **Selection modes**: Single (100%) and multiple (82%)
- **Content types**: Text, icons, grouped options, placeholders
- **State management**: Controlled/uncontrolled, open/closed control
- **Interaction**: Keyboard navigation, type-ahead, click handling
- **Accessibility**: Full ARIA implementation, focus management
- **Form integration**: Name prop, validation support
- **Visual feedback**: Disabled items, selection indicators, focus states
- **Positioning**: Auto-positioning with collision detection

### 2. Important Features (Should-Have)

Based on 60-90% prevalence:

- **Rich content**: Avatars, images, custom layouts
- **Visual variants**: Size options, style variants
- **State indicators**: Loading, error/invalid states
- **Clear action**: Reset/clear selection button
- **Sections**: Visual separators, group labels
- **Portal rendering**: Z-index control
- **Search/filter**: Type-ahead baseline, optional full search

### 3. Advanced Features (Nice-to-Have)

Based on 30-60% prevalence:

- **Performance**: Virtual scrolling for large datasets
- **Customization**: Custom render functions, template slots
- **Positioning control**: Side, alignment, offset configuration
- **Theme integration**: Color schemes, design tokens
- **Value management**: Custom comparison, labelInValue mode
- **Special states**: Read-only, highlight vs checkmark toggle

### 4. Specialized Features (Context-Dependent)

Based on <30% prevalence:

- **Chips/badges**: For categorization use cases
- **Panel footer**: For actions like "Add new"
- **Editable input**: Hybrid filter + manual entry
- **Auto-select on blur**: Workflow optimization
- **Debounced search**: API rate limiting
- **Item-aligned positioning**: Native feel on desktop

### 5. API Design Recommendations

**For Semantic UI (Web Components):**

1. **Hybrid architecture**: Simple API for common cases, composition for advanced
   ```html
   <!-- Simple: 80% use case -->
   <ui-select name="theme" placeholder="Select theme">
     <ui-option value="light">Light</ui-option>
     <ui-option value="dark">Dark</ui-option>
   </ui-select>

   <!-- Advanced: 20% use case -->
   <ui-select name="user" searchable>
     <ui-select-group label="Team Members">
       <ui-option value="1">
         <ui-avatar src="..."></ui-avatar>
         <span>John Doe</span>
       </ui-option>
     </ui-select-group>
   </ui-select>
   ```

2. **Boolean props for features**: Follow web platform conventions
   - `multiple`, `disabled`, `required`, `searchable`, `clearable`, `loading`

3. **Size/variant attributes**: String enums for design system
   - `size="sm|md|lg"`, `variant="outlined|filled|ghost"`

4. **Events**: Standard DOM event names with detail
   - `change` event with detail: `{ value, option }`
   - `search` event for filter input
   - `open`/`close` events for dropdown visibility

5. **Slots for customization**: Named slots for flexibility
   - Default slot for options
   - `trigger` slot for custom button
   - `empty` slot for no results
   - `footer` slot for actions

6. **CSS custom properties**: Theme integration
   - `--ui-select-trigger-height`
   - `--ui-select-border-radius`
   - `--ui-select-dropdown-max-height`

### 6. Accessibility Baseline

All implementations must include:

1. **ARIA semantics**: role="combobox" or role="listbox"
2. **Keyboard support**: Arrow keys, Enter, Escape, Home, End, type-ahead
3. **Focus management**: Focus trap, restoration, visible indicators
4. **Screen reader**: Proper announcements for state changes
5. **Labels**: Programmatic label association
6. **States**: Disabled, required, invalid properly communicated

### 7. Performance Considerations

1. **Virtual scrolling threshold**: Consider for 100+ items
2. **Portal rendering**: Enable by default for z-index control
3. **Lazy rendering**: Only render dropdown content when open
4. **Debouncing**: Built-in for search input (300ms standard)
5. **Memoization**: Cache filtered results, option rendering

### 8. Implementation Priorities

**Phase 1: Core** (90%+ patterns)
- Single/multiple selection
- Text options with icons
- Grouped options
- Controlled/uncontrolled
- Keyboard navigation
- Basic positioning

**Phase 2: Essential** (70-90% patterns)
- Search/filter
- Loading states
- Error states
- Clear button
- Portal rendering
- Size variants

**Phase 3: Advanced** (50-70% patterns)
- Virtual scrolling
- Custom rendering
- Positioning control
- Theme integration
- Avatar/badge support

**Phase 4: Specialized** (<50% patterns)
- Editable input
- Panel footer
- Auto-select on blur
- Item-aligned positioning

### 9. Framework Lessons

**Learn from Ant Design**:
- Virtual scrolling implementation for scale
- labelInValue pattern for data handling
- Tags mode for user-created values

**Learn from Headless UI**:
- ListboxSelectedOption reduces boilerplate
- by prop solves object comparison elegantly
- Dual styling (data attributes + render props)

**Learn from Mantine**:
- limit prop simpler than full virtualization
- allowDeselect improves UX flexibility
- Custom filter function for power users

**Learn from Radix UI**:
- Item-aligned positioning for native feel
- String-only values for accessibility
- Compound components for flexibility

**Learn from Material UI**:
- FormControl integration pattern
- renderValue for custom display
- Multiple positioning strategies

### 10. Common Pitfalls to Avoid

1. **Over-composition**: Don't require 10+ components for basic select
2. **Under-composition**: Don't lock users into single API
3. **Missing search**: Filter/search expected in modern UIs
4. **Poor performance**: Large lists need virtualization or limits
5. **Weak accessibility**: ARIA patterns are not optional
6. **Fixed positioning**: Auto-positioning with collision detection required
7. **String-only limitation**: Consider non-form use cases
8. **Missing clear action**: Users expect to reset selections
9. **No loading state**: Async data loading is common
10. **Inadequate theming**: Design system integration expected

---

## Sophisticated Design Patterns

### Ant Design - labelInValue Mode

**What it does**: Instead of returning just the selected value, `labelInValue` returns an object containing both value and label: `{ value: 'lucy', label: 'Lucy' }`. This eliminates the need to maintain a separate lookup table to map values back to their display text after selection.

```typescript
<Select
  labelInValue
  defaultValue={{ value: 'lucy', label: 'Lucy' }}
  onChange={(selected) => {
    console.log(selected); // { value: 'lucy', label: 'Lucy' }
  }}
  options={options}
/>
```

**Why it's sophisticated**: This pattern solves a non-obvious problem in data handling: preventing the lookup overhead when you need both the value and label. Most developers reach for this pattern only after struggling with the common scenario of having a user ID selected but needing the user name for display or submission.

**Evidence of design maturity**:
- Reduces boilerplate in form submission where both value and display text are needed
- Demonstrates understanding that selection context often requires more than just a value
- Enables offline-first applications where lookup tables may not be available
- Used extensively in real-world production code where data efficiency matters

### Mantine - autoSelectOnBlur Pattern

**What it does**: The `autoSelectOnBlur` prop automatically commits the currently highlighted option when the Select loses focus (e.g., when tabbing away). This bridges the keyboard-only workflow where users type to filter, then move to the next field without explicitly selecting.

```jsx
<Select
  searchable
  autoSelectOnBlur
  placeholder="Type and tab away"
  data={['React', 'Angular', 'Vue', 'Svelte']}
/>
```

**Why it's sophisticated**: This pattern reveals deep thinking about keyboard-first interaction patterns. Developers recognize that requiring an explicit Enter key press after finding what you want creates friction in rapid data entry workflows. The pattern acknowledges that blur (focus leaving) is a natural commit point.

**Evidence of design maturity**:
- Addresses the gap between type-ahead search and form submission in single interaction
- Demonstrates understanding of real-world data entry workflows
- Only 9% adoption (Mantine only) shows this is advanced pattern thinking
- Solves the problem without requiring developer intervention in event handling
- Respects keyboard-first accessibility paradigm while improving UX

### Headless UI - ListboxSelectedOption Component

**What it does**: The `ListboxSelectedOption` component automatically mirrors the selected option's content in the button without manual mapping or conditional rendering. Define your option content once, and it automatically appears in both the closed button and open list.

```jsx
<Listbox value={selected} onChange={setSelected}>
  <ListboxButton>
    <ListboxSelectedOption placeholder="Select a person..." />
  </ListboxButton>
  <ListboxOptions anchor="bottom">
    {people.map((person) => (
      <ListboxOption key={person.id} value={person}>
        {person.name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

**Why it's sophisticated**: This pattern eliminates a subtle but pervasive problem in Select implementations: the need to duplicate option rendering logic for both the dropdown list and the selected display. Developers typically resort to manual value-to-display mapping, storing separate label properties, or useState workarounds. ListboxSelectedOption recognizes the semantic relationship between "what you can select" and "what displays when selected."

**Evidence of design maturity**:
- Reduces boilerplate in the 80% common case while allowing escape hatch for 20% complex cases
- Demonstrates understanding of React rendering patterns and component composition
- Prevents visual inconsistency between option content and selected display
- Works seamlessly with rich content (icons, descriptions, custom layouts)
- Unique solution not found in other frameworks, showing original design thinking

---

## Summary

The Select/Dropdown/Listbox component is one of the most complex and feature-rich UI primitives, with significant variation in implementation philosophy across frameworks. Key findings:

1. **Universal patterns** (90%+ adoption) should be baseline: single/multi selection, grouped options, keyboard navigation, accessibility, form integration
2. **Emerging standards** (60-90% adoption) are becoming expected: search/filter, loading states, rich content, visual variants
3. **Implementation split**: Native wrappers vs custom implementations vs headless primitives
4. **API approaches**: Prop-driven vs compound components vs hybrid
5. **Performance matters**: Virtual scrolling or render limits required for scale
6. **Accessibility non-negotiable**: All frameworks prioritize ARIA compliance
7. **Flexibility spectrum**: Balance simple API for common cases with composition for advanced needs

**Recommendation for Semantic UI**: Adopt hybrid architecture with simple default API and composition-based advanced features, prioritize universal and emerging patterns, ensure full accessibility, and provide performance optimizations for large datasets.

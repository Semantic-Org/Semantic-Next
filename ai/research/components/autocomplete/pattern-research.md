# Component Pattern Research: Autocomplete / Combobox

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 10 (includes 11 component implementations - Mantine has both Autocomplete and Combobox)
- Date: 2025-11-10
- Unique patterns identified: 35+

## Component Definition Consensus

Across frameworks, there are **two conceptual models** for this component type:

### Model 1: "Autocomplete" - Freeform Input with Suggestions
**Philosophy**: Help users type faster, but don't restrict their input.
- Users can type anything (not forced to select from list)
- Suggestions are aids, not constraints
- Emphasizes text entry over selection
- **Examples**: Ant Design AutoComplete, Mantine Autocomplete

### Model 2: "Combobox" - Searchable Selection
**Philosophy**: Combine search functionality with structured selection.
- Search-to-select interaction pattern
- May or may not allow freeform input (depends on "creatable" support)
- Emphasizes selection over text entry
- **Examples**: ShadCN Combobox, Chakra UI Combobox, Headless UI Combobox

### Hybrid Approaches
Several frameworks blur these lines:
- **MUI Autocomplete** supports both via `freeSolo` prop
- **Vuetify** separates them: `v-autocomplete` (strict) vs `v-combobox` (allows custom values)
- **Mantine** offers both as separate components with different philosophies

## Terminology Variations

### Component Names
- **"Autocomplete"**: 6 frameworks (Ant Design, MUI, Mantine, PrimeReact, HeroUI, Vuetify)
- **"Combobox"**: 6 frameworks (ShadCN, Chakra UI, Mantine, Headless UI, Vuetify)
- **Both**: 2 frameworks (Mantine, Vuetify)

### Common Prop Terminology
| Concept | Variations |
|---------|------------|
| Data source | `options`, `data`, `suggestions`, `items`, `collection` |
| Filter function | `filterOption`, `filter`, `completeMethod`, `defaultFilter`, `onInputChange` |
| Selection handler | `onChange`, `onSelectionChange`, `onSelect`, `onOptionSubmit` |
| Loading state | `loading`, `isLoading`, `:loading` |
| Custom rendering | `renderOption`, `itemTemplate`, `renderOption`, `<template v-slot:item>` |
| Multiple selection | `multiple`, ❌ (many frameworks single-select only) |

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text input | Editable text input field | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Dropdown list | Popup list of options | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Filtering/search | Real-time filtering as user types | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Custom option rendering | Rich content in dropdown options | 10/10 (100%) | **Level 1 (Universal)** | All (Native: 7, Composed: 3) |
| Multiple selection | Select multiple values | 6/10 (60%) | **Level 3 (Moderate)** | Chakra UI, MUI, Mantine Combobox, PrimeReact, Vuetify, Headless UI |
| Creatable options | Allow user-defined values | 7/10 (70%) | **Level 2 (Common)** | Ant Design, MUI, Mantine (both), Headless UI, HeroUI, Vuetify Combobox |
| Grouping | Organize options into sections | 7/10 (70%) | **Level 2 (Common)** | Ant Design, MUI, Mantine (both), PrimeReact, Vuetify, HeroUI |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Single select | Select one value | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Multi select | Select multiple values | 6/10 (60%) | **Level 3 (Moderate)** | Chakra UI, MUI, Mantine Combobox, PrimeReact, Vuetify, Headless UI |
| Async/remote data | Load options from API | 9/10 (90%) | **Level 1 (Universal)** | All except ShadCN (composition-based, not explicitly shown) |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Loading | Display loading indicator | 8/10 (80%) | **Level 2 (Common)** | MUI, PrimeReact, Vuetify, Headless UI, HeroUI (native); Chakra UI, Mantine Combobox (CSS-only) |
| Disabled | Disable component/options | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Error/Invalid | Validation error state | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Empty state | No options available | 9/10 (90%) | **Level 1 (Universal)** | All except Mantine Autocomplete (intentionally omitted) |
| No results | Filter returns nothing | 9/10 (90%) | **Level 1 (Universal)** | All except Mantine Autocomplete (intentionally omitted) |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size options | sm/md/lg variants | 9/10 (90%) | **Level 1 (Universal)** | All except ShadCN (CSS-only) |
| Placeholder text | Input hint text | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Clear button | Clear selected value(s) | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Icons | Add icons to input/options | 10/10 (100%) | **Level 1 (Universal)** | All frameworks |
| Virtualization | Efficient rendering for large lists | 5/10 (50%) | **Level 3 (Moderate)** | MUI, PrimeReact, Headless UI, HeroUI (native); Mantine Combobox (via limit prop) |

## Notable Patterns

### Highly Adopted (Level 1-2)

#### Universal Patterns (100%)
1. **Text input with filtering**: Every framework provides a text input that filters options in real-time
2. **Single selection**: Default behavior across all implementations
3. **Custom option rendering**: All frameworks support rich content (icons, descriptions, metadata)
4. **Disabled states**: Universal support for both component-level and option-level disabling
5. **Error/validation states**: All provide native or composed validation feedback
6. **Clear button**: Standard UX pattern to clear selection

#### Near-Universal (80-90%)
1. **Async/remote data**: 9/10 frameworks explicitly support or enable async data loading
2. **Loading states**: 8/10 provide dedicated loading indicators
3. **Size variants**: 9/10 offer multiple size options
4. **Empty/no results states**: 9/10 handle empty data scenarios

### Emerging Patterns (Level 3-4)

#### Moderate Adoption (50-70%)
1. **Multiple selection** (60%): 6 frameworks support, but many explicitly single-select only
   - When present, typically chip/tag-based display
   - Significant implementation complexity increase
   - HeroUI/NextUI explicitly chose single-select for simpler mental model

2. **Creatable options** (70%): Ability to enter custom values not in list
   - Distinguishes "autocomplete" from "select" semantics
   - 3 frameworks native, 4 via composition

3. **Grouping** (70%): Organize options hierarchically
   - Implementation varies: nested objects vs special properties vs dedicated components

4. **Virtualization** (50%): Performance optimization for 1000+ options
   - Native support: MUI, PrimeReact, Headless UI, HeroUI
   - Alternative approaches: Mantine's `limit` prop, scroll areas

### Unique Innovations (Level 5)

#### Framework-Specific Patterns

**ShadCN - Responsive Desktop/Mobile Pattern**
- Popover on desktop, Drawer on mobile
- Shared command palette logic
- Media query-based component switching

**Chakra UI - Advanced Control Hook**
- `useCombobox` hook for external state access
- `Highlight` component integration for emphasizing matches
- `ComboboxRootProvider` pattern

**Mantine - Headless Combobox Primitive**
- Separate low-level Combobox for building custom patterns
- `useCombobox` hook with comprehensive state methods
- Manual wiring philosophy (developer controls filtering, async, etc.)

**PrimeReact - Template Slots System**
- Multiple template slots: item, selectedItem, panelFooter, optionGroup
- Comprehensive keyboard navigation matrices in docs
- `forceSelection` prop for strict validation

**Vuetify - Dual Component Architecture**
- `v-autocomplete`: Strict selection from list
- `v-combobox`: Allows custom values (returns strings)
- Clear semantic separation of use cases

**Headless UI - Anchor Positioning System**
- Sophisticated dropdown positioning with `anchor` prop
- Dynamic width syncing via CSS variables
- Portal rendering with modal behavior control

**HeroUI - Performance-First Design**
- `@tanstack/react-virtual` integration for virtualization
- `useAsyncList` first-class async support
- Scroll shadows for visual feedback

**Ant Design - Input-First Philosophy**
- Accepts any input component as child (Input, TextArea, Input.Search)
- `options` array format preferred over JSX for performance
- Clear differentiation from Select component

### Sophisticated Design Patterns

Beyond simple feature checklists, several frameworks demonstrate sophisticated problem-solving that reveals deep user testing and edge case awareness:

#### 1. Headless UI's Query Reset on Close

**What it does**: The documentation explicitly demonstrates using the `onClose` callback to reset the search query: `onClose={() => setQuery('')}`

**Why it's sophisticated**: This prevents a subtle UX bug where users reopen the dropdown and see a filtered list from their previous session, creating confusion about missing options. Most developers wouldn't discover this issue until user testing revealed the confusion.

**Evidence of design maturity**: The pattern is prominently featured in every example, not tucked away in advanced documentation. The team clearly identified this as a default behavior users expect, not an edge case. This shows real-world usage observation rather than just implementing the ARIA combobox spec.

#### 2. Vuetify's cache-items Requirement for Async Multi-Select

**What it does**: When using multiple selection with async data, Vuetify requires the `cache-items` prop to prevent selected items from disappearing when they're filtered out of the current results.

**Why it's sophisticated**: This solves a non-obvious problem: In multi-select, when you search for "apple" and select it, then search for "banana", the "apple" chip should remain visible even though it's not in the current filtered list. Without caching, selected items would vanish from the UI when the filter changes. Most developers would implement filtering first and only discover this bug during QA.

**Evidence of design maturity**: The requirement is documented explicitly in the async data examples, suggesting it emerged from real implementation issues. The solution shows understanding of the interaction between selection state, display state, and filtering - a complexity that only becomes apparent when building real applications.

#### 3. Mantine Autocomplete's Intentional "No Results" Omission

**What it does**: Unlike other frameworks, Mantine Autocomplete deliberately doesn't show a "no results found" message when filtering returns no matches.

**Why it's sophisticated**: This is thoughtful restraint based on the component's mental model. Since the Autocomplete is designed for freeform text entry (users can type anything), showing "no results" would be contradictory and confusing. The user isn't blocked - they can still submit their typed value. A "no results" message would imply failure when the interaction is actually working as designed.

**Evidence of design maturity**: The documentation explicitly states this is by design and recommends alternative components for strict selection. This shows careful consideration of how UI messages affect user mental models, rather than blindly copying patterns from other frameworks. The team chose to omit a "standard" feature because it would harm UX in this specific context.

#### 4. Chakra UI's Explicit updateSelectedOptionIndex Requirement

**What it does**: When the options list changes (e.g., from filtering), developers must manually call `combobox.updateSelectedOptionIndex()` to reset keyboard navigation position.

**Why it's sophisticated**: This prevents a subtle keyboard navigation bug: Without resetting, arrow keys would start from the previous position in a different options array, causing unexpected jumps or crashes. The explicit requirement makes the state synchronization visible rather than hiding it with "magic" auto-detection that might fail in edge cases.

**Evidence of design maturity**: Rather than attempting fragile automatic detection (when did options "really" change?), Chakra makes the requirement explicit and provides the method. The documentation includes this in filtering examples, showing awareness that developers will hit this issue. This is API design that prioritizes correctness over convenience, suggesting experience with the failure modes of "smart" automatic solutions.

#### 5. MUI's isOptionEqualToValue Prop

**What it does**: MUI provides `isOptionEqualToValue` prop to customize how selected values are matched against option objects, rather than relying on reference equality.

**Why it's sophisticated**: This solves a React-specific pitfall: When options are derived from state/props, they're recreated on each render with new object references. Using `===` equality would fail to recognize selected options, breaking the UI. The prop allows matching by ID or other stable identifier. This is a problem that only becomes apparent with React's rendering model and would manifest as "my selection randomly clears" bugs that are hard to debug.

**Evidence of design maturity**: The API accommodates React's behavior rather than fighting it or requiring developers to memoize everything. The documentation includes this in basic examples, not as an advanced topic, suggesting the team knows this is a common pitfall. The prop accepts both a field name (simple case) or comparator function (complex case), showing progressive sophistication.

#### 6. HeroUI's Automatic Scroll Shadows

**What it does**: When the dropdown list is scrollable, HeroUI automatically adds subtle shadows at the top/bottom edges to indicate more content is available.

**Why it's sophisticated**: This provides affordance (visual hint) that the list scrolls without requiring explicit user configuration. Users often don't realize lists are scrollable when content is cut off exactly at boundaries. The shadow is a design detail that prevents users from missing options, but it requires the framework to detect scroll state and manage visual feedback - complexity the developer doesn't have to implement.

**Evidence of design maturity**: The feature is automatic (zero configuration) but can be customized or disabled via `scrollShadowProps`. This shows understanding that the default should "just work" for accessibility/UX, but power users may need control. The shadows are subtle enough not to distract but visible enough to serve their purpose - evidence of visual design refinement beyond pure functionality.

## Pattern Correlations

### When Multiple Selection Exists → Other Patterns Present
- **6/6** frameworks with multiple selection also support custom option rendering (100%)
- **5/6** support async data loading (83%)
- **4/6** support grouping (67%)
- **Multiple selection often correlates with chip/tag-based display**

### When Virtualization Exists → Performance Focus
- **5/5** frameworks with virtualization also document large dataset handling (100%)
- **4/5** provide explicit item height configuration (80%)
- **Virtualization indicates framework targets enterprise/data-heavy use cases**

### When Creatable Options Exist → Freeform Philosophy
- **7/7** frameworks with creatable options allow any text input (100%)
- **6/7** provide explicit "autocomplete vs select" guidance in docs (86%)
- **Creatable strongly correlates with "assistance" vs "restriction" mental model**

### Headless vs Styled Frameworks
**Headless/Compositional** (ShadCN, Chakra UI, Mantine Combobox, Headless UI):
- More composition, fewer props
- Manual wiring for filtering/async
- Maximum flexibility, more boilerplate
- Data attributes for styling

**Styled/Opinionated** (Ant Design, MUI, PrimeReact, Vuetify, HeroUI):
- More props, less composition
- Built-in filtering/async patterns
- Faster to implement, less flexible
- Theme-based styling

## Implementation Notes

### Naming Conventions

**API Design Patterns:**
1. **Props-based**: `<Autocomplete options={data} onChange={...} />` (MUI, Ant Design, PrimeReact)
2. **Composition-based**: `<Combobox><ComboboxInput /><ComboboxOptions>...</ComboboxOptions></Combobox>` (Headless UI, ShadCN)
3. **Dot-notation**: `<Combobox.Root><Combobox.Input /></Combobox.Root>` (Chakra UI, Mantine)

**Data Structures:**
- Simple arrays: `['React', 'Vue', 'Angular']`
- Object arrays: `[{ label: 'React', value: 'react' }]`
- Grouped: `[{ group: 'Frontend', items: [...] }]`
- Nested: `{ label: 'Category', options: [...] }`

### Filtering Approaches

**Client-side (Native):**
- Default in most frameworks
- Case-insensitive substring matching common
- Customizable via filter function

**Server-side (Composed):**
- Developer manages filtering
- Framework provides input change events
- Common for async/remote data

**Hybrid:**
- MUI, Vuetify support both via `no-filter` or custom `filterOptions`
- Ant Design provides `filterOption` prop

### State Management

**Controlled:**
- `value`/`onChange` pattern (MUI, Ant Design, PrimeReact, Vuetify)
- `selectedKey`/`onSelectionChange` (HeroUI)
- Full developer control over state

**Uncontrolled:**
- `defaultValue` or `defaultSelectedKey`
- Component manages internal state
- Less boilerplate for simple cases

**Hook-based:**
- `useCombobox` returns store object (Chakra UI, Mantine)
- Methods like `openDropdown()`, `closeDropdown()`
- External state access pattern

### Accessibility Patterns

**Universal Features:**
- Keyboard navigation (arrows, Enter, Escape, Tab)
- ARIA attributes (role="combobox", aria-expanded, etc.)
- Screen reader support
- Focus management

**Advanced Features (some frameworks):**
- Type-ahead search within options
- Home/End keys for first/last option
- Backspace to remove chips in multi-select
- Live region announcements

**Documentation Quality:**
- PrimeReact: Comprehensive ARIA keyboard matrices
- Headless UI: Dedicated keyboard interaction guide
- HeroUI: Accessibility section in docs
- Most frameworks: ARIA support implied or briefly mentioned

## Architecture Patterns

### Composition Strategies

**1. Single Component with Props** (High-level)
```jsx
<Autocomplete
  options={data}
  multiple={true}
  loading={isLoading}
  onChange={handleChange}
/>
```
**Examples**: Ant Design, MUI, PrimeReact, HeroUI
**Pros**: Quick to implement, less boilerplate
**Cons**: Less flexible, many props

**2. Composable Primitives** (Headless)
```jsx
<Combobox>
  <ComboboxInput />
  <ComboboxOptions>
    <ComboboxOption>...</ComboboxOption>
  </ComboboxOptions>
</Combobox>
```
**Examples**: Headless UI, ShadCN, Mantine Combobox
**Pros**: Maximum flexibility, granular control
**Cons**: More boilerplate, steeper learning curve

**3. Hook + Components** (Hybrid)
```jsx
const combobox = useCombobox(config)
<Combobox store={combobox}>
  <Combobox.Input />
  ...
</Combobox>
```
**Examples**: Chakra UI, Mantine
**Pros**: External state access, programmatic control
**Cons**: Additional concepts to learn

### Render Prop Patterns

**Template Props** (React):
- `renderOption`, `renderInput`, `renderTags`, `renderGroup` (MUI)
- `itemTemplate`, `selectedItemTemplate`, `panelFooterTemplate` (PrimeReact)
- `renderOption` callback (Mantine Autocomplete)

**Slots** (Vue):
- `<template v-slot:item="data">` (Vuetify)
- Scoped slots provide access to item data

**Function Children** (Render Props):
- `{(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}` (HeroUI)
- `{({ option: person }) => <ComboboxOption>...</ComboboxOption>}` (Headless UI)

### Performance Optimizations

**Virtualization Implementations:**
1. **react-window integration** (MUI) - External library
2. **VirtualScroller** (PrimeReact) - Built-in component
3. **@tanstack/react-virtual** (HeroUI) - Modern external lib
4. **Native `virtual` prop** (Headless UI) - Framework-provided
5. **Limit rendering** (Mantine) - Alternative to full virtualization

**Other Optimizations:**
- Debounced async operations (common pattern)
- `options` array preferred over JSX children (Ant Design)
- Conditional rendering based on open state
- `cache-items` for multi-select with async (Vuetify)

## Framework-Specific Strengths

### Best for...

**Enterprise/Data-Heavy Apps**: MUI, PrimeReact, HeroUI
- Comprehensive features
- Virtualization for large datasets
- Strong TypeScript support
- Extensive documentation

**Maximum Flexibility**: Headless UI, Mantine Combobox
- Headless architecture
- Full control over rendering
- Minimal opinions
- Build custom patterns

**Rapid Prototyping**: Ant Design, Vuetify, HeroUI
- Quick setup
- Sensible defaults
- Good built-in styling
- Less configuration needed

**Design System Integration**: Chakra UI, HeroUI
- Theme-aware
- Consistent with ecosystem
- Strong design token system
- Accessibility built-in

**Vue Ecosystem**: Vuetify
- Native Vue patterns
- v-model bindings
- Slots for customization
- Material Design adherence

**React Ecosystem**: All except Vuetify
- 9/10 frameworks React-only
- Deep React integration
- Hooks, render props, composition

## Raw Data

Individual framework reports available at:
- `ai/research/autocomplete/shadcn/usage-patterns.md`
- `ai/research/autocomplete/chakra-ui/usage-patterns.md`
- `ai/research/autocomplete/ant-design/usage-patterns.md`
- `ai/research/autocomplete/mui/usage-patterns.md`
- `ai/research/autocomplete/mantine-autocomplete/usage-patterns.md`
- `ai/research/autocomplete/mantine-combobox/usage-patterns.md`
- `ai/research/autocomplete/primereact/usage-patterns.md`
- `ai/research/autocomplete/vuetify/usage-patterns.md`
- `ai/research/autocomplete/headless-ui/usage-patterns.md`
- `ai/research/autocomplete/heroui/usage-patterns.md`

URL verification and status tracking:
- `ai/research/autocomplete/url-verification.md`

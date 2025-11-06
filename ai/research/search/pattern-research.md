# Component Pattern Research: Search / Autocomplete / Combobox

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 5 (Ant Design, HeroUI, Mantine, MUI, PrimeReact)
- Date: 2025-11-05
- Unique patterns identified: 50+
- Note: Headless UI and ShadCN excluded as headless/primitive libraries providing behavior without UI

## Component Definition Consensus

Across all frameworks, the search/autocomplete component serves a universal purpose: **assisting user input by providing real-time suggestions from a predefined or dynamically-loaded set of options**. The component combines text input with a contextual dropdown of filtered suggestions, allowing users to either select from suggestions or enter custom values (depending on configuration).

**Common Mental Model**: A text input field where:
1. **As user types**: System filters/searches available options and displays matches
2. **Dropdown appears**: Shows relevant suggestions below the input
3. **User selects or continues typing**: Can pick a suggestion or enter freeform text
4. **Async loading**: Can fetch suggestions from APIs as user types

**Semantic Meaning**: Reduces cognitive load by suggesting valid options while typing. Improves data quality by guiding users toward expected values. Speeds up input by reducing typing. Commonly used for: search bars, location pickers, tag selectors, contact lookup, and form fields with many options.

## Terminology Variations

### Component Names
- **AutoComplete** (3 frameworks): Ant Design, HeroUI, PrimeReact
- **Autocomplete** (1 framework): MUI (lowercase 'c')
- **Combobox** (1 framework): Mantine

### Prop/Attribute Terminology
- **Options/Data**: `options` (Ant Design, MUI) = `items` (HeroUI) = `suggestions` (PrimeReact) = N/A (Mantine uses manual Options rendering)
- **Filtering**: `filterOption` (Ant Design) = `filter` prop (HeroUI) = `filterBy` (MUI) = `completeMethod` (PrimeReact)
- **Multiple Selection**: `mode="multiple"` (Ant Design) = `selectionMode="multiple"` (HeroUI) = `multiple` (MUI, PrimeReact)
- **Freeform Input**: `options` undefined (Ant Design) = `allowsCustomValue` (HeroUI) = `freeSolo` (MUI) = `forceSelection={false}` (PrimeReact)
- **Async Loading**: Custom implementation (Ant Design) = `isLoading` + async (HeroUI) = custom loading (MUI) = `completeMethod` (PrimeReact)
- **Clear Button**: Built-in (most) = `isClearable` (HeroUI) = `disableClearable` (MUI)

## Pattern Inventory

### Type Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Single Selection | Pick one item from suggestions | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (default behavior) |
| Multiple Selection | Select multiple items with chips/tags | 4/5 (80%) | Level 2 (Common) | Ant Design, HeroUI, MUI, PrimeReact | Native via `multiple`/`mode`/`selectionMode` |
| Freeform/Free Solo | Allow custom values not in list | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via config |
| Strict Selection | Only allow selection from list | 4/5 (80%) | Level 2 (Common) | Ant Design (default), HeroUI, MUI (default), PrimeReact (`forceSelection`) | Native via config |
| Async/Remote Data | Load suggestions from API | 5/5 (100%) | Level 1 (Universal) | All frameworks | Application-level with loading state |
| Controlled Mode | External state management | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `value` + `onChange` |
| Uncontrolled Mode | Internal state management | 4/5 (80%) | Level 2 (Common) | Ant Design, HeroUI, MUI, PrimeReact | Native via `defaultValue` |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Text Input | Core input field | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (fundamental) |
| Suggestion List | Dropdown of filtered options | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (fundamental) |
| Filtering/Search | Filter options by typed text | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (built-in or customizable) |
| Highlight Matches | Emphasize matched text in suggestions | 1/5 (20%) | Level 4 (Occasional) | Ant Design (custom via render) | Composed via custom rendering |
| Custom Option Rendering | Rich option display (avatars, descriptions) | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via render props/templates |
| Grouped Options | Categorized option sections | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via data structure or Section components |
| Icons/Prefixes | Visual indicators in input | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via props or slots |
| Chips/Tags Display | Visual tokens for multi-selection | 4/4 (100% of multi-select) | Level 2 (Common) | All frameworks with multi-select | Native (automatic in multi mode) |
| Option Descriptions | Secondary text in options | 4/5 (80%) | Level 2 (Common) | HeroUI, MUI, PrimeReact, Ant Design (custom) | Native or Composed |
| Start/End Content | Adornments on either side of input | 4/5 (80%) | Level 2 (Common) | HeroUI, MUI (adornments), PrimeReact (icons), Mantine | Native via props |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Loading State | Show spinner while fetching | 4/5 (80%) | Level 2 (Common) | HeroUI, MUI, PrimeReact, Ant Design (custom) | Native via `loading`/`isLoading` prop |
| Empty State | No results message | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via empty message prop or custom rendering |
| Error/Invalid State | Validation error display | 4/5 (80%) | Level 2 (Common) | Ant Design, HeroUI, MUI, PrimeReact | Native via `status`/`isInvalid`/`error` |
| Disabled State | Non-interactive appearance | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `disabled` prop |
| Read-only State | Display-only mode | 3/5 (60%) | Level 2 (Common) | HeroUI, MUI, PrimeReact | Native via `readOnly`/`inputProps.readOnly` |
| Focus State | Keyboard focus indication | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Open/Closed State | Dropdown visibility | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic or controlled) |

### Variation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Size Options | Predefined size variants | 4/5 (80%) | Level 2 (Common) | Ant Design, HeroUI, MUI, PrimeReact | Native via `size` prop |
| Visual Variants | Style variations (outlined, filled, etc.) | 3/5 (60%) | Level 2 (Common) | HeroUI (4 variants), MUI (3 variants), PrimeReact | Native via `variant` prop |
| Debounced Search | Throttle API calls while typing | 5/5 (100%) | Level 1 (Universal) | All frameworks | Application-level (user implements) |
| Virtualization | Render only visible options (performance) | 3/5 (60%) | Level 2 (Common) | HeroUI, MUI, PrimeReact | Native via virtualization prop |
| Portal Rendering | Render dropdown in document body | 3/5 (60%) | Level 2 (Common) | MUI, PrimeReact, Mantine | Native via portal prop |
| Full Width | Stretch to container width | 4/5 (80%) | Level 2 (Common) | Ant Design (style), HeroUI, MUI, PrimeReact | Native via prop or default |
| Label Placement | Position of label relative to input | 2/5 (40%) | Level 3 (Moderate) | HeroUI (inside/outside), MUI (standard/outlined) | Native via layout props |

### Interactive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Keyboard Navigation | Arrow keys, Enter, Escape | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Click Selection | Mouse click to select | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Type-ahead Search | Filter as user types | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic or custom) |
| Clear Button | Reset/clear input value | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (built-in or configurable) |
| Dropdown Toggle | Manually open/close dropdown | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via click or button |
| onSearch Callback | Notify on input change | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `onSearch`/`onInputChange`/`onQuery` |
| onChange Callback | Notify on selection change | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `onChange`/`onSelectionChange` |
| onSelect Callback | Notify on option select | 3/5 (60%) | Level 2 (Common) | Ant Design, Mantine (via store), PrimeReact | Native via dedicated callback |
| Focus Management | Programmatic focus control | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via ref methods |
| Backfill on Navigate | Auto-fill input while arrowing | 1/5 (20%) | Level 4 (Occasional) | Ant Design (`backfill` prop) | Native prop |
| Custom Filter Function | Override default filtering logic | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via filter prop/function |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| ARIA Combobox Role | Semantic combobox/listbox roles | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| ARIA Attributes | aria-expanded, aria-activedescendant, etc. | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Keyboard Support | Full keyboard operation | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Screen Reader Labels | Descriptive labels for assistive tech | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `aria-label` or label element |
| Focus Management | Proper focus flow and trapping | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Required Field | Mark as required for forms | 4/5 (80%) | Level 2 (Common) | HeroUI, MUI, PrimeReact, Mantine | Native via `required` prop |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Single selection from suggestions
- Freeform/custom value input support
- Async/remote data loading
- Controlled component pattern
- Text input with suggestion list
- Filtering/search functionality
- Custom option rendering
- Grouped options support
- Icon/prefix support
- Empty state handling
- Disabled state
- Focus state
- Open/closed dropdown state
- Full keyboard navigation
- Click selection
- Type-ahead search
- Clear button
- Search/input change callback
- Selection change callback
- Custom filter functions
- Complete ARIA accessibility implementation

**Common Patterns (60-89% adoption):**
- Multiple selection with tags (80%)
- Strict selection mode (80%)
- Uncontrolled mode (80%)
- Loading state indicator (80%)
- Error/invalid state (80%)
- Size variants (80%)
- Full width option (80%)
- Start/end content slots (80%)
- Option descriptions (80%)
- Read-only state (60%)
- Visual style variants (60%)
- Virtualization for large lists (60%)
- Portal rendering (60%)
- onSelect dedicated callback (60%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-59%):**
- Label placement options (40%)

**Occasional Adoption (20-39%):**
- Text match highlighting (20%)
- Backfill on keyboard navigation (20%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**
- **Ant Design**: `backfill` prop (auto-fills input while navigating with arrows); Can use TextArea or any input element via `children`; Custom validation states (v4.19.0+)
- **HeroUI**: Start/end content slots for rich input decoration; Required field marking; Dynamic collections for advanced data management; 4 visual variants (flat, bordered, underlined, faded)
- **Mantine**: Hook-based state management (`useCombobox`) for complete control; Event source tracking (keyboard vs mouse); Split functionality (EventsTarget + DropdownTarget); Explicitly designed as primitive building block
- **MUI**: Dual state management (`value` vs `inputValue`); `freeSolo` mode for hybrid behavior; Fixed options in multi-select (non-removable); Checkbox mode for multi-selection; Virtualization with `react-window`; `useAutocomplete` headless hook
- **PrimeReact**: `completeMethod` callback for async loading; `forceSelection` mode for validation; `dropdown` mode toggle (show all vs current); Selection limits for multi-select; ItemTemplate + SelectedItemTemplate customization

## Pattern Correlations

**When Multiple Selection exists (4/4 frameworks with it):**
- 100% show chips/tags for selected items
- 100% provide keyboard interaction for tag removal
- 75% support selection limits (3/4: HeroUI, MUI, PrimeReact)
- Tags typically have close/remove buttons

**When Async Data exists:**
- 80% provide native loading state prop (4/5: HeroUI, MUI, PrimeReact + Ant Design manual)
- 100% rely on user implementing debouncing
- Typical pattern: `onSearch`/`onInputChange` → debounced API call → update options

**When Grouped Options exist:**
- Implementation methods vary: data structure (Ant Design, MUI), Section components (HeroUI), template (PrimeReact), manual rendering (Mantine)
- All frameworks support headers/labels for groups

**When Virtualization exists (3/5):**
- Performance optimization for 1000+ items
- HeroUI: Built-in with `disallowEmptySelection`
- MUI: Via `ListboxComponent` with `react-window`
- PrimeReact: Native `virtualScrollerOptions`

**Custom Rendering correlation:**
- All 5 frameworks support rich custom rendering
- Methods: render functions (Ant Design, MUI), slots (HeroUI, PrimeReact), manual composition (Mantine)
- Common use cases: avatars, descriptions, badges, multi-line content

**Size Variants:**
- 4/5 frameworks offer predefined sizes
- Common scale: small, medium, large
- Some frameworks extend with extra-small or extra-large

## Implementation Notes

### API Design Patterns

**Data Source:**
1. **Options array** (Ant Design, MUI): `options={[{ value, label }]}`
2. **Items collection** (HeroUI): `items={items}` or `<AutocompleteItem>` children
3. **Suggestions** (PrimeReact): `suggestions={results}` populated by `completeMethod`
4. **Manual rendering** (Mantine): User renders `<Combobox.Option>` components

**Filtering Approach:**
1. **Client-side** (default in most): Framework filters options based on input
2. **Server-side**: User implements in `onSearch`/`completeMethod`, updates data
3. **Custom filter** function: All frameworks allow override of filter logic

**Multiple Selection:**
- Typically enabled via prop: `multiple`, `mode="multiple"`, `selectionMode="multiple"`
- State becomes array: `value={[1, 2, 3]}`
- Visual feedback: Chips/tags with remove buttons
- Keyboard: Backspace removes last tag

**Freeform Input (Custom Values):**
1. **Implicit** (Ant Design): Not providing options or allowing unmatched input
2. **Explicit prop** (HeroUI): `allowsCustomValue={true}`
3. **Mode-based** (MUI): `freeSolo={true}`
4. **Force selection toggle** (PrimeReact): `forceSelection={false}`

**Async Data Loading:**
- Universal pattern: User implements async in search callback
- Loading state: Some native (`isLoading`), some manual (via `loading` prop)
- Debouncing: User responsibility (lodash debounce, custom hook)
- Typical flow: type → debounce → API → update options → hide loading

### Architectural Observations

**Component Philosophy:**
- **High-level components** (4 frameworks): Ant Design, HeroUI, MUI, PrimeReact - all-in-one with props
- **Primitive/compositional** (1 framework): Mantine - building block requiring manual assembly

**State Management:**
- **Controlled pattern universal**: All support external state via `value` + `onChange`
- **Uncontrolled pattern common**: 80% support `defaultValue`
- **Dual state** (MUI unique): Separate `value` (selected) and `inputValue` (typed text)

**Rendering Strategy:**
- **Render props/functions** (Ant Design, MUI): Pass function to render custom options
- **Slot-based** (HeroUI, PrimeReact): Named slots for customization points
- **Manual composition** (Mantine): User builds structure with sub-components

**Virtualization Strategy:**
- **Built-in** (HeroUI, PrimeReact): Native props enable virtualization
- **Integration-based** (MUI): Integrate `react-window` via `ListboxComponent` prop
- **Performance threshold**: Typically recommended for 1000+ items

**Accessibility Approach:**
- All frameworks implement ARIA combobox pattern
- Automatic ARIA attributes: `role`, `aria-expanded`, `aria-activedescendant`, etc.
- Keyboard navigation universal: Arrow keys, Enter, Escape, Home/End
- Screen reader support: Option announcements, selection feedback

**Filtering Philosophy:**
- **Client-side default**: Most frameworks filter in browser
- **Case-insensitive default**: Common behavior
- **Substring matching**: Standard approach
- **Customizable**: All allow custom filter logic
- **Server-side**: User implements via callbacks for large datasets

## Raw Data References

Individual framework research reports available at:
- `ai/research/search/ant-design/usage-patterns.md`
- `ai/research/search/heroui/usage-patterns.md`
- `ai/research/search/mantine/usage-patterns.md`
- `ai/research/search/mui/usage-patterns.md`
- `ai/research/search/primereact/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 5 UI frameworks' autocomplete/combobox implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping

Headless UI and ShadCN were excluded as they provide behavioral primitives without complete UI implementations, focusing on logic layers that developers integrate into their own designs.

All findings represent actual implementations as of November 2025.

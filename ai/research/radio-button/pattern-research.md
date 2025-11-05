# Component Pattern Research: Radio Button / Radio Group

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 14
- Date: 2025-11-05
- Unique patterns identified: 45+
- Research methodology: Descriptive analysis of official documentation from production UI frameworks

## Component Definition Consensus

Across all 14 frameworks, radio buttons are consistently defined as:

**Core Purpose**: A form control for mutually exclusive selection from a predefined set of options. Users select exactly one choice from a group, with selecting a new option automatically deselecting the previous choice.

**Mental Model**: A coordinated group of circular selection indicators where only one can be active at a time. Users conceptualize this as "pick exactly one from these options" - distinct from checkboxes which allow multiple selections.

**Semantic Meaning**: Communicates single-choice selection through:
- Circular visual indicators (vs. square for checkboxes)
- Mutual exclusivity enforced at the group level
- Clear visual distinction between selected and unselected states
- Group-level labels/legends that frame the decision context

## Terminology Variations

### Component Names
- **RadioButton** + **RadioGroup**: 5 frameworks (Ant Design, HeroUI, PrimeReact, Shadcn UI, Vuetify)
- **Radio** + **RadioGroup**: 6 frameworks (Chakra UI, Headless UI, Mantine, MUI, Radix Primitives, Radix Themes)
- **Radio** (single component or checkbox module): 2 frameworks (Angular Material uses mat-radio-button + mat-radio-group, Nuxt UI uses RadioGroup.Root + RadioGroup.Item)
- **Checkbox module variation**: 1 framework (Semantic UI Classic - radio is a checkbox type)

### Architectural Terms
- **Group/Root**: Container component managing mutual exclusivity
- **Item/Button**: Individual radio button within a group
- **Indicator**: Visual marker showing selected state (Mantine, Radix terminology)

### Prop Names: Value Management
- **value**: 14/14 frameworks (universal term)
- **defaultValue** (uncontrolled): 10/14 frameworks
- **v-model** (Vue-specific): 2/14 frameworks (Nuxt UI, Vuetify)
- **checked**: 3/14 frameworks (Angular Material, Ant Design, PrimeReact)

### Prop Names: Change Handlers
- **onChange**: 7/14 (Ant Design, Angular Material, Chakra UI, MUI, PrimeReact, Semantic UI, Vuetify)
- **onValueChange**: 4/14 (Headless UI, Radix Primitives, Radix Themes, Shadcn UI)
- **onUpdate:modelValue / @update:modelValue**: 2/14 (Nuxt UI, Vuetify - Vue 3 pattern)

### Prop Names: Layout
- **orientation** (horizontal/vertical): 9/14 frameworks
- **row / column**: 1/14 (Vuetify)
- **inline**: 2/14 (Nuxt UI, Vuetify v3)
- **direction** (via layout components): 3/14 (Chakra UI, Mantine, others via composition)

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Text labels | Primary text label for each radio option | 14/14 (100%) | Level 1 (Universal) | Native or Composed | All frameworks |
| Description text | Secondary explanatory text below label | 8/14 (57%) | Level 3 (Moderate) | Native | Headless UI, HeroUI, Mantine, Nuxt UI, Radix Primitives (partial), Shadcn (composed), Chakra UI, Vuetify (limited) |
| Group label/legend | Label for the entire radio group | 13/14 (93%) | Level 1 (Universal) | Native | All except PrimeReact (composed) |
| Icon support | Icons within radio labels | 14/14 (100%) | Level 1 (Universal) | Composed | All frameworks (via composition or slots) |
| Custom content | Arbitrary content in labels | 14/14 (100%) | Level 1 (Universal) | Composed | All frameworks |
| Empty/unlabeled | Radio button without visible label | 8/14 (57%) | Level 3 (Moderate) | Native | Ant Design (fitted), Mantine, Semantic UI (fitted), others |
| HTML in labels | Rich HTML content in labels | 10/14 (71%) | Level 2 (Common) | Slots/Composed | Most frameworks via composition |
| Error messages | Validation error text | 10/14 (71%) | Level 2 (Common) | Native | Angular Material, HeroUI, MUI, Nuxt UI, PrimeReact, Vuetify, others |

### Architectural Patterns

| Pattern | Description | Prevalence | Usage Level | Details | Frameworks |
|---------|-------------|------------|-------------|---------|------------|
| Two-component architecture | Separate Group and Item components | 13/14 (93%) | Level 1 (Universal) | RadioGroup + Radio pattern | All except Semantic UI Classic |
| Group manages state | Container coordinates mutual exclusivity | 14/14 (100%) | Level 1 (Universal) | State at group level | All frameworks |
| Name-based grouping | HTML name attribute for native grouping | 14/14 (100%) | Level 1 (Universal) | Native HTML pattern | All frameworks |
| Compound components | Radio.Group, Radio.Item notation | 3/14 (21%) | Level 4 (Occasional) | Namespace pattern | Mantine, Nuxt UI, Radix Themes |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Standard radio | Traditional circular radio appearance | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Radio group | Container managing multiple radios | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Button-style radios | Radio group styled as segmented buttons | 3/14 (21%) | Level 4 (Occasional) | Native | Ant Design (solid/outline), Mantine (filled/outline), Angular Material (partial) |
| Card-style radios | Options presented as selectable cards | 3/14 (21%) | Level 4 (Occasional) | Native | Mantine (Radio.Card), Nuxt UI (card variant), others via CSS |
| Slider-style radios | Horizontal slider appearance | 1/14 (7%) | Level 5 (Rare) | Native | Semantic UI Classic |
| Toggle-style radios | Toggle switch appearance | 1/14 (7%) | Level 5 (Rare) | Native | Semantic UI Classic |
| Visual variants | Multiple presentation styles | 4/14 (29%) | Level 4 (Occasional) | Native | Nuxt UI (list/card/table), Radix Themes (surface/classic/soft), Semantic UI (standard/slider/toggle), Mantine (variants) |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Checked/Selected | Visual indication of selected radio | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Unchecked | Default unselected state | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Disabled (individual) | Single radio button disabled | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Disabled (group) | Entire group disabled | 13/14 (93%) | Level 1 (Universal) | Native | All except PrimeReact (CSS-only) |
| Required | Validation requiring selection | 13/14 (93%) | Level 1 (Universal) | Native | All except Semantic UI (via callbacks) |
| Error/Invalid | Visual error state indication | 10/14 (71%) | Level 2 (Common) | Native | Angular Material, Chakra UI, HeroUI, MUI, Nuxt UI (partial), PrimeReact, Vuetify, others |
| Readonly | Prevents changes but shows value | 4/14 (29%) | Level 4 (Occasional) | Native | Angular Material, Semantic UI Classic, Vuetify, HeroUI |
| Focus/Hover | Interactive state indicators | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks (varying implementations) |
| Mandatory/Always-selected | Group always has a value | 1/14 (7%) | Level 5 (Rare) | Native | Vuetify |
| Loading | Skeleton or loading state | 0/14 (0%) | Not found | - | None |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Size options | Predefined size variants (sm/md/lg) | 8/14 (57%) | Level 3 (Moderate) | Native | Ant Design (3), Chakra UI (3), HeroUI (3), Mantine (5), MUI (3), Nuxt UI (5), Radix Themes (3), Vuetify (density) |
| Color options | Theme color customization | 7/14 (50%) | Level 3 (Moderate) | Native | Chakra UI, HeroUI, Mantine, MUI (7 colors), Nuxt UI (7 colors), Radix Themes, Vuetify |
| Orientation | Horizontal vs vertical layout | 13/14 (93%) | Level 1 (Universal) | Native | All except PrimeReact (uses layout components) |
| Spacing control | Control gaps between radios | 14/14 (100%) | Level 1 (Universal) | Various | All frameworks (native props, CSS, or layout components) |
| High contrast mode | Enhanced contrast for accessibility | 2/14 (14%) | Level 5 (Rare) | Native | Radix Themes, HeroUI (partial) |
| Indicator position | Start/end/hidden indicator placement | 1/14 (7%) | Level 5 (Rare) | Native | Nuxt UI |
| Block layout | Full-width responsive layout | 1/14 (7%) | Level 5 (Rare) | Native | Ant Design |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| onChange handler | Callback when selection changes | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Controlled mode | External state control | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Uncontrolled mode | Internal state management | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Form integration | Native HTML form submission | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Keyboard navigation | Arrow keys navigate group | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Loop navigation | Circular keyboard navigation | 6/14 (43%) | Level 3 (Moderate) | Native | Headless UI, Nuxt UI, Radix Primitives, Radix Themes, Shadcn UI, HeroUI |
| BeforeChange callbacks | Validation before state change | 1/14 (7%) | Level 5 (Rare) | Native | Semantic UI Classic |
| Event attachment | Connect external elements to control | 1/14 (7%) | Level 5 (Rare) | Native | Semantic UI Classic |
| Integer values | Numeric values (not strings) | 5/14 (36%) | Level 4 (Occasional) | Native | Ant Design, Nuxt UI, Vuetify, others (all support) |
| Object values | Complex object as value | 4/14 (29%) | Level 4 (Occasional) | Native | Headless UI, HeroUI, Mantine, PrimeReact |
| Query methods | Programmatic state queries | 1/14 (7%) | Level 5 (Rare) | Native | Semantic UI Classic |

### Validation Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Rules-based validation | Array of validation functions | 5/14 (36%) | Level 4 (Occasional) | Native | HeroUI, MUI, Nuxt UI (via UForm), Vuetify, Chakra UI (partial) |
| Error messages prop | Display validation errors | 8/14 (57%) | Level 3 (Moderate) | Native | Angular Material, HeroUI, MUI, Nuxt UI, Vuetify, Chakra UI, PrimeReact, others |
| Required prop | HTML5 required attribute | 13/14 (93%) | Level 1 (Universal) | Native | All except Semantic UI (via callbacks) |
| Invalid prop | Explicit invalid state | 4/14 (29%) | Level 4 (Occasional) | Native | HeroUI, PrimeReact, Vuetify, Angular Material |
| Form library integration | Works with validation libraries | 8/14 (57%) | Level 3 (Moderate) | Native | Angular Material, HeroUI, MUI, Nuxt UI, PrimeReact, Vuetify, Chakra UI, others |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| ARIA roles | Proper radio/radiogroup roles | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Roving tabindex | Single tab stop per group | 9/14 (64%) | Level 2 (Common) | Native | Headless UI, Radix Primitives, Radix Themes, Shadcn UI, Angular Material, Chakra UI, HeroUI, MUI, Mantine |
| Label association | Proper id/htmlFor linking | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Keyboard navigation | Complete arrow key support | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Screen reader support | Announces state and labels | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Focus indicators | Visible focus state | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| Disabled communication | ARIA disabled attributes | 14/14 (100%) | Level 1 (Universal) | Native | All frameworks |
| RTL support | Right-to-left layout | 3/14 (21%) | Level 4 (Occasional) | Native | Radix Primitives, Radix Themes, Shadcn UI |

## Notable Patterns

### Highly Adopted (Level 1-2: 70%+)

These patterns represent established standards in radio button implementation:

**Universal Patterns (100%)**:
- Two-component architecture (Group + Item) for state management
- Text labels for each option
- Standard circular radio appearance
- Checked/unchecked/disabled states at both individual and group levels
- onChange/onValueChange callbacks
- Controlled and uncontrolled modes
- Native HTML form integration
- Complete keyboard navigation with arrow keys
- ARIA accessibility support
- Label association via id/htmlFor or automatic

**Near-Universal Patterns (90%+)**:
- Group label or legend for context
- Required prop for validation
- Orientation control (horizontal/vertical)
- Disabled state at group level

**Common Patterns (70-89%)**:
- Error/invalid state indication
- Error message display
- Icons via composition or slots

### Emerging Patterns (Level 3-4: 20-69%)

These patterns show moderate adoption and may be evolving best practices:

**Moderate Adoption (40-69%)**:
- Description/helper text for each option (57%)
- Size variants (sm/md/lg) (57%)
- Form validation library integration (57%)
- Color customization options (50%)
- Loop navigation for keyboard (43%)

**Occasional Adoption (20-39%)**:
- Integer and object value support (29-36%)
- Readonly state (29%)
- Button-style radio variants (21%)
- Card-style radio options (21%)
- Rules-based validation (36%)
- Invalid state prop (29%)

### Unique Innovations (Level 5: <20%)

These patterns are framework-specific innovations or niche features:

**Semantic UI Classic**:
- Slider-style radios (horizontal slider appearance)
- Toggle-style radios (toggle switch appearance)
- beforeChecked/beforeUnchecked callbacks for validation
- Event attachment system (connect external elements)
- Query methods (programmatic state queries)
- Uncheckable control setting

**Vuetify**:
- Mandatory prop (ensures always-selected state)
- Density options (compact/comfortable)
- True-value/false-value for custom boolean states
- Theme integration via useTheme() composable

**Nuxt UI**:
- Three visual variants (list/card/table)
- Indicator position control (start/end/hidden)
- Flexible field mapping (valueKey/labelKey/descriptionKey)
- Per-item UI customization

**Mantine**:
- Radio.Card for rich card-based selection
- Radio.Indicator for visual-only indicators
- Filled/outline variants for button-style
- Comprehensive size system (xs-xl, 5 sizes)

**Radix Themes**:
- Three visual variants (surface/classic/soft)
- High contrast mode for accessibility
- Automatic text alignment when composed with Text component

**Ant Design**:
- Button-style with solid/outline variants
- Block layout option (full-width)
- Options prop for data-driven rendering

**Angular Material**:
- Interactive disabled state for accessibility
- Change events only fire from user interaction (not programmatic)

**Headless UI**:
- Dual styling approaches (data attributes vs render props)
- Object value comparison strategies
- Fragment rendering option

## Pattern Correlations

### Co-occurring Patterns

When these patterns appear together, they often form coherent feature sets:

**State Management + Validation** (appears together in 10/14 frameworks):
- When Error/Invalid state exists → Error messages present in 8/10 frameworks
- When Required prop exists → Form integration present in 13/13 frameworks
- When Rules-based validation exists → Form library integration in 5/5 frameworks

**Layout Control + Spacing** (appears together in 14/14 frameworks):
- When Orientation prop exists → Spacing control in 13/13 frameworks
- When Size variants exist → Color options in 6/8 frameworks
- When Visual variants exist → Multiple layout modes in 4/4 frameworks

**Advanced Features Clustering**:
- Description text + Validation + Error messages: 6 frameworks (Chakra UI, HeroUI, Mantine, Nuxt UI, Vuetify, MUI)
- Size + Color + Orientation: 7 frameworks (Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix Themes, Vuetify)
- Button-style + Size + Color: 2 frameworks (Ant Design, Mantine)

**Accessibility Feature Sets**:
- Roving tabindex + Loop navigation + RTL support: Radix family (Primitives, Themes, Shadcn, Headless UI)
- ARIA + Keyboard + Screen reader: Universal (14/14)
- High contrast + Color options: 2 frameworks (Radix Themes, HeroUI)

### Mutually Exclusive Patterns

Certain patterns rarely appear together, suggesting different design philosophies:

**jQuery vs Modern Framework** (0/14 co-occurrence):
- Semantic UI Classic (jQuery-based) vs all others (React/Vue/Angular)
- jQuery method invocation vs component props
- Behavior modules vs component lifecycle

**Primitive vs Styled** (generally exclusive):
- Radix Primitives (unstyled) vs Radix Themes (pre-styled)
- Headless UI (unstyled) vs styled implementations
- CSS-only customization vs native variant props

**Data-driven vs Composition** (implementation preference):
- Ant Design options prop vs composition-heavy frameworks
- Nuxt UI items array vs individual Radio components
- Trade-off: convenience vs flexibility

**Group Wrapper vs Individual**:
- Most frameworks: explicit RadioGroup wrapper (13/14)
- Semantic UI: name-based grouping without wrapper (1/14)
- Pattern evolution toward explicit containers

## Implementation Notes

### Architectural Approaches

**Two-Component Pattern (13/14 frameworks)**:
- **RadioGroup/Root**: Container managing mutual exclusivity, keyboard navigation, and form integration
- **Radio/RadioButton/Item**: Individual selectable options
- **Benefits**: Clear separation of concerns, state management at appropriate level
- **Trade-offs**: Slightly more verbose than single-component approach

**State Management Locations**:
- **Group-level state**: 14/14 frameworks (value/defaultValue on container)
- **Individual checked prop**: 3/14 frameworks also support (Ant Design, Angular Material, PrimeReact)
- **Name-based grouping**: All frameworks support native HTML name attribute as fallback

**Styling Approaches**:
1. **Unstyled primitives** (3/14): Radix Primitives, Headless UI, Shadcn UI (wrapper over Radix)
   - Maximum customization flexibility
   - Requires more setup and CSS knowledge
   - Behavior separated from styling

2. **Pre-styled with variants** (8/14): Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix Themes, Vuetify
   - Built-in visual variants and size options
   - Balances convenience with customization
   - Theme system integration

3. **Minimal styling** (2/14): Angular Material, PrimeReact
   - Basic styled appearance following design system
   - Limited built-in variants
   - Customization via CSS/theme variables

4. **jQuery-based** (1/14): Semantic UI Classic
   - Class-based styling with CSS framework
   - JavaScript behavior module pattern
   - Progressive enhancement approach

### API Design Patterns

**Value Management**:
```
// Uncontrolled (10/14 frameworks)
<RadioGroup defaultValue="option1">

// Controlled (14/14 frameworks)
<RadioGroup value={value} onChange={setValue}>

// Vue v-model (2/14 frameworks)
<v-radio-group v-model="value">
```

**Layout Control**:
```
// Orientation prop (9/14 frameworks)
<RadioGroup orientation="horizontal">

// Layout component (3/14 frameworks)
<Stack direction="row">
  <RadioGroup>...</RadioGroup>
</Stack>

// Row/column props (1/14 framework - Vuetify)
<v-radio-group row>
```

**Label Association**:
```
// Automatic via composition (most frameworks)
<Radio value="1">Label text</Radio>

// Manual id/htmlFor (Shadcn, Radix, MUI)
<RadioGroupItem value="1" id="r1" />
<Label htmlFor="r1">Label text</Label>

// Prop-based (some frameworks support both)
<Radio value="1" label="Label text" />
```

### Naming Conventions

**Component Naming**:
- **Compound namespace**: Radio.Group, Radio.Item (Mantine, Nuxt UI)
- **PascalCase separate**: RadioGroup, RadioButton (most React frameworks)
- **Kebab-case**: v-radio-group, v-radio (Vue frameworks)
- **Material-prefix**: mat-radio-group, mat-radio-button (Angular Material)

**Prop Naming**:
- **Value**: `value` (universal across all frameworks)
- **Change handler**: `onChange` (7/14), `onValueChange` (4/14), `@update:modelValue` (2/14)
- **Default value**: `defaultValue` (10/14), `default-value` (1/14 kebab-case)
- **Disabled**: `disabled` (universal)
- **Orientation**: `orientation` (9/14), `row/column` (1/14), `direction` via layout (4/14)

### Framework-Specific Idioms

**React Patterns** (10/14 frameworks):
- Controlled components with value + onChange
- Uncontrolled with defaultValue + ref
- Composition with children or explicit components
- Data attributes for styling hooks ([data-state], [data-disabled])

**Vue Patterns** (2/14 frameworks):
- v-model for two-way binding
- Slots for custom content
- Kebab-case prop names
- Reactive refs and computed properties

**Angular Patterns** (1/14 framework):
- ControlValueAccessor interface for forms
- ngModel for template-driven forms
- FormControl for reactive forms
- Material Design theming system

**jQuery Patterns** (1/14 framework):
- Behavior modules initialized via $('.selector').radio()
- String-based method invocation
- Callback-based event handling
- Progressive enhancement from HTML

## Framework Philosophy Observations

### Accessibility-First Frameworks

**Radix Family** (Primitives, Themes, Shadcn):
- WAI-ARIA radio group pattern implementation
- Roving tabindex for single tab stop
- Keyboard navigation with loop control
- RTL support built-in
- Data attributes for state-based styling

**Headless UI**:
- Complete accessibility out of the box
- Unstyled primitive approach
- Render props for dynamic styling
- Focus management and keyboard navigation
- Screen reader optimization

### Material Design Adherents

**Angular Material, MUI, Vuetify**:
- Strict Material Design specifications
- Consistent visual language
- Elevation and shadow systems
- Color system from Material palette
- Density/size options matching Material guidelines

### Composition-Heavy Frameworks

**Chakra UI, Mantine**:
- Stack/Flex components for layout
- Icon integration via composition
- Description text via additional components
- Flexible arrangement patterns
- CSS-in-JS styling systems

### Data-Driven Frameworks

**Ant Design, Nuxt UI**:
- Options/items array for configuration
- Data-driven rendering preferred over composition
- Simpler API for dynamic lists
- Less verbose for programmatic generation
- Trade-off: reduced flexibility for complex layouts

### Primitive-Based Frameworks

**Shadcn UI, Radix family**:
- Behavior separated from styling
- Copy-paste philosophy (Shadcn)
- Maximum customization control
- Requires more CSS knowledge
- Build-your-own design system approach

## Key Insights for Component Library Design

### Universal Expectations (Implement These)

Based on 90%+ adoption rates, users expect:

1. **Two-component architecture**: RadioGroup (container) + Radio (item)
2. **Mutual exclusivity**: Group manages single-selection logic
3. **Standard states**: Checked, unchecked, disabled (both individual and group)
4. **Dual state modes**: Both controlled and uncontrolled
5. **Form integration**: Native HTML form submission via name attribute
6. **Keyboard navigation**: Complete arrow key support with proper focus management
7. **Label support**: Clear label association patterns
8. **Change handlers**: Callbacks for value changes
9. **Orientation control**: Horizontal and vertical layouts
10. **ARIA compliance**: Full accessibility support

### High-Value Optional Features (Consider These)

Based on 40-70% adoption and clear use cases:

1. **Size variants**: Small, medium, large options (57%)
2. **Description text**: Helper text below each option (57%)
3. **Color customization**: Theme color integration (50%)
4. **Error states**: Visual validation feedback (71%)
5. **Loop navigation**: Circular keyboard navigation (43%)
6. **Form validation**: Rules-based validation system (36%)
7. **Readonly state**: Display-only mode (29%)

### Differentiating Features (Evaluate These)

Rare patterns that could provide competitive advantage:

1. **Visual variants**: Multiple presentation styles (card/list/table)
2. **Button-style radios**: Segmented control appearance
3. **Indicator positioning**: Start/end/hidden options
4. **Interactive disabled**: Focusable but non-changeable (Angular Material)
5. **Mandatory selection**: Always-selected state (Vuetify)
6. **Before callbacks**: Validation before state changes (Semantic UI)
7. **Object values**: Complex data as radio values (4 frameworks)

### Anti-Patterns to Avoid

Patterns with low adoption or implementation issues:

1. **Manual ID generation**: Auto-generate IDs, allow override
2. **No group wrapper**: Explicit containers clearer than name-only grouping
3. **Loading states**: Not found in any framework (not a standard pattern)
4. **jQuery dependency**: Modern frameworks have moved to React/Vue/Angular
5. **Orientation affects behavior only**: Users expect visual layout changes too
6. **String-only values**: Support integers and objects for flexibility

## Recommendations for Semantic UI Next

### Core Features (Must-Have)

Implement these universal patterns:

1. **Two-component architecture**:
   ```jsx
   <RadioGroup value={value} onChange={setValue}>
     <Radio value="option1">Option 1</Radio>
     <Radio value="option2">Option 2</Radio>
   </RadioGroup>
   ```

2. **Standard states**:
   - Checked/unchecked
   - Disabled (individual and group)
   - Focus/hover indicators
   - Required for validation

3. **Dual modes**:
   - Controlled: `value` + `onChange`
   - Uncontrolled: `defaultValue`

4. **Form integration**:
   - `name` prop for native form submission
   - Value attribute on each radio
   - Works without JavaScript

5. **Complete keyboard support**:
   - Arrow keys for navigation
   - Space to select
   - Tab to enter/exit group
   - Optional loop navigation

6. **Accessibility**:
   - Proper ARIA roles and attributes
   - Roving tabindex (single tab stop)
   - Label association (auto-generate IDs)
   - Screen reader support

7. **Layout control**:
   - Orientation prop (horizontal/vertical)
   - Spacing options
   - Visual layout matches keyboard behavior

### Enhanced Features (Should-Have)

Add these high-value patterns:

1. **Size variants**: 3-5 sizes (xs, sm, md, lg, xl)
2. **Description text**: Helper text support for each option
3. **Color customization**: Integrate with theme system
4. **Error states**: Visual validation feedback + error messages
5. **Validation system**: Rules-based or integration with validation libraries

### Differentiating Features (Consider)

Evaluate these for competitive advantage:

1. **Visual variants**:
   - Standard radio
   - Button/segmented control style
   - Card-based selection
   - Consider Semantic UI Classic's slider/toggle styles

2. **Advanced content**:
   - Icon positioning
   - Rich HTML in descriptions
   - Custom indicator designs

3. **Developer experience**:
   - Auto-generate IDs for labels
   - Flexible value types (string/number/object)
   - TypeScript support with generics
   - Comprehensive error messages

4. **Framework compatibility**:
   - React version (primary)
   - Consider Vue/Svelte adapters
   - Framework-agnostic core (like Radix)

### Semantic UI Classic Migration

Preserve these classic patterns where valuable:

**Keep**:
- Visual style variations (if modernized)
- Semantic class naming philosophy
- Progressive enhancement approach
- Fitted variant concept

**Modernize**:
- Remove jQuery dependency
- Replace callbacks with event handlers
- Convert behavior modules to React components
- Update API to match modern conventions
- Maintain backward-compatible class names

**Add**:
- TypeScript support
- React hooks integration
- Composition patterns
- Modern state management

## Conclusion

Radio button implementation across modern frameworks shows strong consensus on core patterns (architecture, states, accessibility) with divergence in advanced features (variants, validation, customization). The universal patterns represent user expectations that should be met, while optional patterns offer opportunities for differentiation.

**Key Takeaway**: All 14 frameworks implement the fundamentals identically (mutual exclusivity, keyboard navigation, form integration, accessibility). The competitive differentiation happens in:
1. Visual variants and styling flexibility
2. Developer experience (API ergonomics, TypeScript, documentation)
3. Validation and error handling
4. Advanced content patterns (descriptions, icons, custom layouts)
5. Framework-specific integrations (theme systems, form libraries, design systems)

For Semantic UI Next, the strategy should be:
- **Nail the fundamentals** (leverage patterns with 90%+ adoption)
- **Add high-value optionals** (size, colors, descriptions, validation)
- **Differentiate selectively** (choose 2-3 unique features aligned with Semantic UI philosophy)
- **Modernize Classic patterns** (preserve valuable innovations, drop jQuery baggage)

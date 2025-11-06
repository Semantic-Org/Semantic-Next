# Component Pattern Research: Textarea

> Last Modified: 2025-11-06

## Research Summary
- Frameworks surveyed: 7 (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact)
- Date: 2025-11-06
- Unique patterns identified: 50+
- Note: Headless UI and ShadCN excluded as headless/primitive libraries

## Component Definition Consensus

Across all frameworks, the textarea component serves a universal purpose: **enabling multi-line text input for longer-form content where users need to enter multiple lines of text**. Textareas are form controls that automatically handle line breaks, allowing users to enter paragraphs, comments, descriptions, messages, and other extended textual content.

**Common Mental Model**: A flexible text container where:
1. **Multi-line capability**: Accepts line breaks and multiple paragraphs
2. **Dynamic height**: Can auto-resize to show all content without scrolling
3. **Form integration**: Standard form control with validation support
4. **Visual feedback**: Shows state through styling (focus, error, disabled)
5. **Accessibility**: Keyboard navigable with screen reader support

**Semantic Meaning**: Represents a multi-line plain text editing control, suitable for entering substantial amounts of unrestricted text where automatic wrapping and explicit line breaks are expected. Used for: comments, descriptions, messages, feedback, notes, code snippets, addresses, and any content requiring multiple lines.

## Terminology Variations

### Component Names
- **Textarea** (4 frameworks): Chakra UI, HeroUI, Mantine, Nuxt UI
- **TextArea** (2 frameworks): Ant Design (Input.TextArea), MUI (TextField multiline)
- **InputTextarea** (1 framework): PrimeReact

### API Approaches
- **Dedicated component**: Separate textarea component (6/7: Chakra, HeroUI, Mantine, Nuxt, PrimeReact, Ant Design)
- **Variant of text input**: TextField with multiline prop (1/7: MUI)
- **Composition pattern**: Part of Input family (1/7: Ant Design Input.TextArea)

### Prop/Attribute Terminology

**Auto-Sizing Feature:**
- `autoSize` (Ant Design) = `autoresize` (HeroUI, Nuxt) = `autoResize` (PrimeReact) = `autosize` (Mantine) = `minRows`/`maxRows` (MUI) = auto-enabled (Chakra via TextareaAutosize example)

**Height Control:**
- `rows` (universal standard) = initial visible rows
- `minRows`/`maxRows` (MUI, Mantine, HeroUI, Nuxt) = bounded auto-growth
- `autoSize.minRows`/`autoSize.maxRows` (Ant Design) = bounded auto-growth

**Resize Control:**
- `resize` prop (Chakra, Mantine) = CSS resize property control
- Native CSS styling (others)

**Character Counting:**
- `showCount` (Ant Design) = `count` prop (Ant Design advanced) = manual implementation (others)

**Validation:**
- `status` (Ant Design) = `isInvalid` (Chakra, HeroUI) = `error` (Mantine, MUI) = `highlight` (Nuxt) = manual (PrimeReact)

## Pattern Inventory

### Core Functionality Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Multi-line input | Accepts line breaks and paragraphs | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Controlled component | Parent manages state via value prop | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Uncontrolled component | Component manages own state | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Placeholder text | Hint text when empty | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Initial rows | Set starting height via rows prop | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Auto-Sizing Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Auto-resize/autosize | Height grows with content | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Minimum rows | Set minimum visible rows | 6/7 (86%) | Level 2 (Common) | All except PrimeReact | Native |
| Maximum rows | Set maximum rows before scroll | 6/7 (86%) | Level 2 (Common) | All except PrimeReact | Native |
| Unbounded growth | Grows infinitely with content | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Bounded growth | Grows to max then scrolls | 6/7 (86%) | Level 2 (Common) | All except PrimeReact | Native |
| Resize delay | Debounce resize calculation | 1/7 (14%) | Level 5 (Rare) | Nuxt UI only | Native |
| Height change callback | Event when height changes | 1/7 (14%) | Level 5 (Rare) | HeroUI only | Native |
| Cache measurements | Reuse height calculations | 1/7 (14%) | Level 5 (Rare) | HeroUI only | Native |

### Character Counting Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| maxLength attribute | Browser-enforced character limit | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native HTML |
| Show character count | Display current character count | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Custom count formatter | Format character count display | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Emoji-aware counting | Count emojis as single character | 1/7 (14%) | Level 5 (Rare) | Ant Design only (v5.10+) | Native |
| Count strategy | Custom counting logic | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Exceed formatter | Custom message when limit exceeded | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Manual counter | Developer implements character count | 6/7 (86%) | Level 2 (Common) | All except Ant Design | Composed |

### Visual Patterns - Variants

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Outlined/border variant | Border around textarea | 7/7 (100%) | Level 1 (Universal) | All frameworks (default or option) | Native |
| Filled variant | Filled background | 5/7 (71%) | Level 2 (Common) | Ant Design, Chakra, HeroUI, Mantine, MUI | Native |
| Borderless variant | No border | 2/7 (29%) | Level 4 (Occasional) | Ant Design, Chakra (unstyled) | Native |
| Flushed variant | Bottom border only | 2/7 (29%) | Level 4 (Occasional) | Chakra, HeroUI (underlined) | Native |
| Unstyled variant | No default styling | 2/7 (29%) | Level 4 (Occasional) | Chakra, Mantine | Native |
| Soft/subtle variants | Light styling | 2/7 (29%) | Level 4 (Occasional) | HeroUI, Nuxt | Native |
| Ghost variant | Minimal appearance | 1/7 (14%) | Level 5 (Rare) | Nuxt UI only | Native |

### Visual Patterns - Sizes

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Multiple size options | 3+ predefined sizes | 6/7 (86%) | Level 2 (Common) | All except PrimeReact | Native |
| 3 sizes (sm/md/lg) | Three size options | 4/7 (57%) | Level 2 (Common) | Chakra, HeroUI, Mantine (has xs/xl too), Nuxt (has xs/xl too) | Native |
| 4 sizes (xs/sm/md/lg) | Four size options | 2/7 (29%) | Level 4 (Occasional) | Chakra, MUI (sm/md) | Native |
| 5 sizes (xs/sm/md/lg/xl) | Five size options | 2/7 (29%) | Level 4 (Occasional) | Mantine, Nuxt | Native |
| Size affects padding/font | Size controls typography | 6/7 (86%) | Level 2 (Common) | All except PrimeReact | Native |

### Visual Patterns - Styling

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Custom className | Apply custom CSS classes | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Inline styles | style prop for CSS | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Theme integration | Uses framework theme | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Dark mode support | Light/dark theme adaptation | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Border radius control | Configurable corner rounding | 4/7 (57%) | Level 2 (Common) | HeroUI, Mantine, MUI (theme), Nuxt | Native |
| Color scheme/palette | Multiple color options | 3/7 (43%) | Level 3 (Moderate) | Chakra, HeroUI, Nuxt | Native |
| Focus border color | Custom focus color | 2/7 (29%) | Level 4 (Occasional) | Chakra, MUI (errorBorderColor) | Native |

### Behavioral Patterns - Resize Control

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| User manual resize | User can drag to resize | 7/7 (100%) | Level 1 (Universal) | All frameworks (browser default) | Native |
| Disable manual resize | Prevent user resizing | 7/7 (100%) | Level 1 (Universal) | All frameworks via CSS | Native/CSS |
| Resize prop | Control resize behavior | 2/7 (29%) | Level 4 (Occasional) | Chakra, Mantine | Native |
| Vertical only resize | Height adjustment only | 2/7 (29%) | Level 4 (Occasional) | Chakra, Mantine | Native |
| Horizontal only resize | Width adjustment only | 2/7 (29%) | Level 4 (Occasional) | Chakra, Mantine | Native |
| Both directions resize | Width and height | 2/7 (29%) | Level 4 (Occasional) | Chakra, Mantine | Native |
| Resize event callback | Detect resize events | 2/7 (29%) | Level 4 (Occasional) | Ant Design, HeroUI | Native |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Disabled state | Prevent user interaction | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Read-only state | Display without editing | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Error/invalid state | Show validation error | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Required field | Mark as required | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Warning state | Non-critical validation | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Loading state | Show loading indicator | 2/7 (29%) | Level 4 (Occasional) | HeroUI, Nuxt | Native |
| Focus state | Visual focus indicator | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Hover state | Visual hover feedback | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Content Enhancement Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Label text | Associated label | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Helper text/description | Guidance below textarea | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Error message | Validation feedback | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Clear button | Quick clear content | 1/7 (14%) | Level 5 (Rare) | Ant Design, HeroUI (isClearable) | Native |
| Icon integration | Add icons to textarea | 2/7 (29%) | Level 4 (Occasional) | HeroUI, Nuxt | Native |
| Avatar integration | User avatar display | 2/7 (29%) | Level 4 (Occasional) | HeroUI, Nuxt | Native |
| Tooltip support | Hover tooltip | 1/7 (14%) | Level 5 (Rare) | PrimeReact only | Native |
| Left/right sections | Custom content areas | 1/7 (14%) | Level 5 (Rare) | Mantine only | Native |

### Form Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Form control | Standard form integration | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Label association | Link label to textarea | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Form validation | Built-in validation support | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Required indicator | Asterisk or visual marker | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Form library support | React Hook Form, Formik | 7/7 (100%) | Level 1 (Universal) | All frameworks | Composed |
| Form submission | name attribute support | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Validation on blur | Validate when focus lost | 7/7 (100%) | Level 1 (Universal) | All frameworks | Composed |

### Focus Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Auto-focus | Focus on mount | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Auto-focus delay | Delayed focus with timing | 1/7 (14%) | Level 5 (Rare) | Nuxt UI only | Native |
| Programmatic focus | Via ref.focus() | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Focus cursor position | Control cursor placement | 1/7 (14%) | Level 5 (Rare) | Ant Design only | Native |
| Focus callbacks | onFocus/onBlur events | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Semantic textarea element | Native <textarea> | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| aria-label support | Accessible name | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| aria-describedby | Link to description | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| aria-invalid | Indicate error state | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| aria-required | Indicate required field | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Keyboard navigation | Tab, arrow keys, shortcuts | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Screen reader support | Announced as textarea | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Color contrast | WCAG-compliant colors | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |

### Label Placement Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Label above (default) | Standard label position | 7/7 (100%) | Level 1 (Universal) | All frameworks | Native |
| Floating label | Label moves on focus | 1/7 (14%) | Level 5 (Rare) | MUI only | Native |
| Label inside | Label within textarea border | 1/7 (14%) | Level 5 (Rare) | HeroUI only | Native |
| Label outside-left | Label to left side | 1/7 (14%) | Level 5 (Rare) | HeroUI only | Native |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Multi-line text input with line breaks
- Controlled and uncontrolled component patterns
- Placeholder text support
- Initial rows configuration
- Auto-resize/autosize capability
- Unbounded growth mode
- maxLength attribute for character limits
- Outlined/bordered visual variant
- Custom className and inline styles
- Theme integration and dark mode
- Disabled, read-only, error, required states
- Focus and hover state styling
- Label, helper text, error message support
- Standard form integration
- Label association with id/htmlFor
- Form validation support
- Required field indicators
- Auto-focus on mount
- Programmatic focus via ref
- Focus/blur event callbacks
- Semantic <textarea> element
- Complete ARIA support (label, describedby, invalid, required)
- Keyboard navigation
- Screen reader compatibility
- WCAG color contrast
- Label above textarea (default)

**Common Patterns (57-86% adoption):**
- Minimum rows configuration (86%)
- Maximum rows configuration (86%)
- Bounded auto-growth (86%)
- Multiple size options 3+ (86%)
- Manual character counter implementation (86%)
- Filled variant (71%)
- Size affects padding and typography (86%)
- Border radius control (57%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-59%):**
- Color scheme/palette options (43%)

**Occasional Adoption (29-39%):**
- Borderless variant (29%)
- Flushed/bottom-border variant (29%)
- Unstyled variant (29%)
- Soft/subtle style variants (29%)
- 3 sizes (sm/md/lg) pattern (29% exact, but 57% have 3+ sizes)
- Resize prop for control (29%)
- Vertical/horizontal/both resize options (29% each)
- Resize event callback (29%)
- Focus border color customization (29%)
- Loading state indicator (29%)
- Icon integration (29%)
- Avatar integration (29%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**

- **Ant Design**:
  - Input.TextArea composition (part of Input family)
  - Advanced character counting with `count` prop
  - Emoji-aware counting strategy (v5.10+)
  - Custom count formatter
  - Exceed formatter for over-limit messages
  - Built-in showCount display
  - Warning validation state (beyond error)
  - Clear button with custom icon (allowClear)
  - Cursor position control on focus
  - onPressEnter callback
  - afterClose callback
  - Banner mode
  - onResize callback with dimensions

- **Chakra UI**:
  - 4 size variants (xs/sm/md/lg)
  - Resize prop (horizontal/vertical/none/both)
  - Focus border color customization
  - Error border color customization
  - Color scheme prop (12 options)
  - Flushed variant (bottom border only)
  - Style props system (bg, p, borderRadius)
  - Polymorphic component pattern

- **HeroUI**:
  - useTextarea hook with prop getters
  - 5 radius options (none/sm/md/lg/full)
  - 4 visual variants (flat/bordered/faded/underlined)
  - Start content and end content slots
  - isClearable with clear button
  - onClear callback
  - cacheMeasurements for auto-resize
  - onHeightChange callback
  - disableAutosize option
  - Validation behavior modes (native/aria)
  - Custom validate function
  - React Aria foundation
  - 7 DOM slots for customization
  - Data attributes for state styling

- **Mantine**:
  - Inherits from Input and Input.Wrapper
  - Left section and right section props
  - 5 sizes (xs/sm/md/lg/xl)
  - 3 variants (default/filled/unstyled)
  - Resize prop (none/both/horizontal/vertical)
  - Extensive Styles API
  - withAsterisk prop (visual without required)
  - withErrorStyles control
  - inputWrapperOrder customization
  - inputContainer wrapper function
  - Autosize with minRows/maxRows
  - Complete CSS Modules integration

- **MUI**:
  - TextField with multiline prop (not separate component)
  - TextareaAutosize component under the hood
  - minRows/maxRows for bounded growth
  - Three variants (outlined/filled/standard)
  - Two sizes (small/medium)
  - Material Design 3 compliance
  - Floating label pattern
  - sx prop for system styling
  - InputProps/InputLabelProps/FormHelperTextProps
  - Color variants (primary/secondary/error/info/success/warning)
  - Margin prop (none/dense/normal)
  - fullWidth prop
  - Collapse animation integration

- **Nuxt UI**:
  - 5 variants (outline/soft/subtle/ghost/none)
  - 5 sizes (xs/sm/md/lg/xl)
  - 7 color themes (includes neutral/secondary)
  - autoresizeDelay performance optimization
  - maxrows with 0 = unlimited
  - autofocus with autofocusDelay
  - Leading and trailing icons
  - Avatar prop with AvatarProps
  - Loading state with custom loading-icon
  - Highlight prop for validation emphasis
  - as prop for polymorphic rendering
  - Vue 3 v-model with modelModifiers
  - Reka UI foundation
  - UApp global configuration
  - oklch color space

- **PrimeReact**:
  - Minimalist API (only autoResize and tooltip custom props)
  - autoResize boolean (single prop)
  - Tooltip integration built-in
  - tooltipOptions for configuration
  - No minRows/maxRows (autoResize is unlimited)
  - Theme Designer customization
  - p-* class naming convention
  - Extensive theme variants (Bootstrap, Material, Tailwind, etc.)
  - CDN import option

## Pattern Correlations

**When Auto-Resize exists (7/7 - universal):**
- 86% provide min/max row controls (6/7)
- 86% support bounded growth mode (6/7)
- 100% support unbounded growth mode
- Only 14% provide resize delay option (1/7: Nuxt)
- Only 14% provide height change callback (1/7: HeroUI)
- All use similar naming: autoSize/autosize/autoResize

**When Multiple Sizes exist (6/7):**
- 67% provide 3+ sizes (4/7 have exactly 3, 2/7 have 5)
- 100% of implementations affect padding and font size
- Size affects all text, not just initial height
- Common naming: xs/sm/md/lg/xl

**When Visual Variants exist:**
- 100% provide outlined/bordered as default or option
- 71% provide filled variant (5/7)
- 29% provide borderless option (2/7)
- 29% provide flushed/underlined option (2/7)
- Naming varies: variant, appearance, style

**Character Counting correlation:**
- Only Ant Design (1/7) provides built-in character counter
- 86% rely on manual implementation (6/7)
- All support maxLength for hard limits
- Ant Design unique in soft limit support (count.max)

**Resize Control correlation:**
- Only Chakra and Mantine (2/7) provide resize prop
- Others rely on CSS styling
- When present, supports: horizontal, vertical, both, none
- All frameworks support disabling via CSS

**Auto-Focus correlation:**
- 100% support autoFocus attribute
- Only Nuxt (1/7) provides delay option
- Only Ant Design (1/7) provides cursor position control

**Form Integration correlation:**
- 100% work as standard form controls
- 100% support label association
- 100% support validation states
- 100% compatible with form libraries (React Hook Form, Formik)
- All use similar patterns for error display

## Implementation Notes

### API Design Patterns

**Dedicated Component (6/7):**
```jsx
// Chakra, HeroUI, Mantine, Nuxt, PrimeReact, Ant Design
<Textarea
  value={text}
  onChange={handleChange}
  placeholder="Enter text"
/>
```

**TextField Variant (1/7):**
```jsx
// MUI only
<TextField
  multiline
  rows={4}
  value={text}
  onChange={handleChange}
/>
```

### Auto-Resize Patterns

**Simple Boolean (3/7):**
```jsx
// Mantine, PrimeReact, HeroUI (partial)
<Textarea autosize />
<InputTextarea autoResize />
```

**With Min/Max Rows (4/7):**
```jsx
// MUI, Mantine, HeroUI, Nuxt
<TextField multiline minRows={3} maxRows={10} />
<Textarea autosize minRows={3} maxRows={10} />
<UTextarea autoresize :maxrows="10" />
```

**Object Configuration (1/7):**
```jsx
// Ant Design
<TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
```

### Character Count Patterns

**Built-in (1/7):**
```jsx
// Ant Design only
<TextArea showCount maxLength={100} />
<TextArea count={{ show: true, max: 100 }} />
```

**Manual (6/7):**
```jsx
// All others
const [text, setText] = useState('');
<Textarea value={text} maxLength={500} />
<Text>{text.length}/500</Text>
```

### Validation State Patterns

**Via Status Prop:**
```jsx
// Ant Design
<TextArea status="error" />
<TextArea status="warning" />
```

**Via Boolean Props:**
```jsx
// Chakra, HeroUI
<Textarea isInvalid />
<Textarea isRequired />
```

**Via Error Prop:**
```jsx
// Mantine, MUI
<Textarea error="This field is required" />
<TextField error helperText="Required" />
```

**Via Highlight Prop:**
```jsx
// Nuxt
<UTextarea :highlight="hasError" color="error" />
```

### Architectural Observations

**Component Types:**
1. **Pure Textarea Component**: Dedicated component (6/7)
2. **Input Family Member**: Ant Design Input.TextArea
3. **TextField Extension**: MUI multiline prop

**Auto-Resize Implementation:**
- Most use measurement-based height calculation
- MUI uses TextareaAutosize component under hood
- HeroUI uses react-textarea-autosize
- All recalculate on input/window resize events
- Nuxt provides delay option for performance

**State Management:**
- 100% support controlled components
- 100% support uncontrolled components
- All use React patterns (value + onChange)
- Vue framework (Nuxt) uses v-model

**Inheritance Patterns:**
- Mantine inherits from Input and Input.Wrapper
- Ant Design extends Input component
- Chakra extends Input foundation
- Others are standalone components

### Theme Integration Patterns

All frameworks integrate with their respective theme systems:

- **Ant Design**: Component tokens, ConfigProvider
- **Chakra UI**: defineStyleConfig, theme overrides, style props
- **HeroUI**: Slot-based theming, Tailwind CSS integration
- **Mantine**: Styles API, CSS Modules, theme object
- **MUI**: sx prop, theme overrides, CSS custom properties
- **Nuxt UI**: app.config.ts, ui prop, oklch colors
- **PrimeReact**: Theme Designer, extensive preset themes

### Accessibility Approach

**Universal Patterns:**
- All use semantic <textarea> element
- All support ARIA attributes (label, describedby, invalid, required)
- All provide keyboard navigation
- All announce to screen readers
- All support label association

**Known Issues:**
- Ant Design: Some ARIA label issues reported
- MUI: Hidden measurement textarea accessibility warning
- PrimeReact: Accessibility docs "under development"

## Raw Data References

Individual framework research reports available at:
- `ai/research/textarea/ant-design/usage-patterns.md`
- `ai/research/textarea/chakra-ui/usage-patterns.md`
- `ai/research/textarea/heroui/usage-patterns.md`
- `ai/research/textarea/mantine/usage-patterns.md`
- `ai/research/textarea/mui/usage-patterns.md`
- `ai/research/textarea/nuxt-ui/usage-patterns.md`
- `ai/research/textarea/primereact/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 7 UI frameworks' textarea implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping
6. Feature matrix compilation

Headless UI and ShadCN excluded as headless/primitive libraries providing behavioral primitives without complete UI implementations.

All findings represent actual implementations as of November 2025.

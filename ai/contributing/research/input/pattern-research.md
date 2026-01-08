# Component Pattern Research: Input/TextField

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 8
- Date: 2025-11-05
- Unique patterns identified: 70+
- Research coverage: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI Classic, Vuetify

## Component Definition Consensus

Input/TextField components solve the fundamental problem of **capturing single-line text data from users** in a consistent, accessible, and validated manner. They provide:

- **Text data capture** through keyboard input
- **Visual feedback** for focus, error, and validation states
- **Label management** for identifying input purpose
- **Validation support** with error messaging
- **Content enhancement** through prefix/suffix elements (icons, buttons, text)
- **Type-specific behavior** for email, password, number, search, etc.
- **Accessibility** through proper ARIA attributes and semantic HTML

**Mental Models:**
- **Form Field** (MUI, Vuetify): Complete form control with label, input, and helper text
- **Enhanced Input** (Ant Design, Chakra UI, HeroUI): Native input with additional props
- **Base Component** (Mantine): Low-level primitive for building specialized inputs
- **CSS-First** (Semantic UI): HTML input with CSS class modifiers
- **Validated Field** (Nuxt UI): Input with built-in form validation integration

**Universal Characteristics:**
- Built on native HTML `<input>` element
- Single-line text input (multiline uses textarea/separate component)
- Controlled and uncontrolled modes
- Placeholder support
- Disabled and readonly states
- Focus management
- Change event handling

## Terminology Variations

### Component Names
- **Input**: Ant Design, Chakra UI, HeroUI, Mantine, Semantic UI, Nuxt UI
- **TextField**: MUI, Vuetify
- **TextInput**: Mantine (specialized variant)
- **v-text-field**: Vuetify (Vue component)
- **UInput**: Nuxt UI (prefixed)

### Size Terms
- **Small/Medium/Large**: Ant Design (small/middle/large), MUI (small/medium), HeroUI (sm/md/lg)
- **xs/sm/md/lg/xl**: Chakra UI, Nuxt UI
- **Density**: Vuetify (default/comfortable/compact)
- **Named sizes**: Semantic UI (mini/tiny/small/large/big/huge/massive)

### Visual Variant Terms
- **Outlined/Filled/Standard**: MUI, Vuetify
- **Outline/Filled/Flushed/Unstyled**: Chakra UI
- **Flat/Bordered/Faded/Underlined**: HeroUI
- **Default/Filled/Unstyled**: Mantine
- **Outline/Soft/Subtle/Ghost/None**: Nuxt UI
- **No variants** (CSS classes): Semantic UI, Ant Design

### Validation State Terms
- **error**: MUI, Vuetify, Mantine, HeroUI, Semantic UI
- **isInvalid**: Chakra UI, HeroUI
- **status**: Ant Design (error/warning)
- **highlight**: Nuxt UI (error state)

## Pattern Inventory

### Input Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text input | Default text type | 8/8 (100%) | Level 1 | All |
| Email input | Email with validation | 8/8 (100%) | Level 1 | All |
| Password input | Password with masking | 8/8 (100%) | Level 1 | All |
| Number input | Numeric input | 8/8 (100%) | Level 1 | All |
| Search input | Search type | 7/8 (88%) | Level 1 | All except HeroUI |
| Telephone input | Tel type | 7/8 (88%) | Level 1 | All except HeroUI |
| URL input | URL type | 7/8 (88%) | Level 1 | All except HeroUI |
| Date input | Date picker | 6/8 (75%) | Level 2 | All except HeroUI, Nuxt UI |
| Time input | Time picker | 6/8 (75%) | Level 2 | All except HeroUI, Nuxt UI |
| Color input | Color picker | 3/8 (38%) | Level 3 | MUI, Vuetify, Chakra |
| File input | File upload | 2/8 (25%) | Level 4 | MUI, HeroUI |

### Visual Variant Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Outlined variant | Border outline | 7/8 (88%) | Level 1 | MUI, Chakra, HeroUI, Vuetify, Nuxt, Semantic, Ant |
| Filled variant | Solid background | 6/8 (75%) | Level 1 | MUI, Chakra, Mantine, Vuetify, Nuxt, HeroUI |
| Underlined variant | Bottom border only | 4/8 (50%) | Level 2 | MUI, Chakra (flushed), HeroUI, Vuetify |
| Unstyled variant | No default styling | 3/8 (38%) | Level 3 | Chakra, Mantine, Nuxt |
| Borderless variant | No visible border | 2/8 (25%) | Level 4 | Ant Design, Nuxt (ghost) |

### Size Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Small size | Compact input | 8/8 (100%) | Level 1 | All |
| Medium/default size | Standard input | 8/8 (100%) | Level 1 | All |
| Large size | Prominent input | 8/8 (100%) | Level 1 | All |
| Extra small | Very compact | 3/8 (38%) | Level 3 | Chakra, Nuxt, Semantic |
| Extra large | Very prominent | 2/8 (25%) | Level 4 | Nuxt, Semantic |
| Responsive sizing | Size per breakpoint | 2/8 (25%) | Level 4 | Chakra, custom |
| Full width | 100% width | 8/8 (100%) | Level 1 | All (default or prop) |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Disabled state | No interaction | 8/8 (100%) | Level 1 | All |
| Readonly state | View only, copyable | 8/8 (100%) | Level 1 | All |
| Error state | Validation error | 8/8 (100%) | Level 1 | All |
| Warning state | Validation warning | 2/8 (25%) | Level 4 | Ant Design, custom |
| Focus state | Active interaction | 8/8 (100%) | Level 1 | All |
| Loading state | Async operation | 5/8 (63%) | Level 2 | Ant, Chakra, HeroUI, Nuxt, Vuetify |
| Required state | Field required | 8/8 (100%) | Level 1 | All |
| Success state | Validation passed | 3/8 (38%) | Level 3 | HeroUI, Nuxt, custom |

### Label & Placeholder Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Static label | Label above input | 8/8 (100%) | Level 1 | All |
| Floating label | Animated label | 4/8 (50%) | Level 2 | MUI, Vuetify, HeroUI, Nuxt |
| Placeholder text | Hint when empty | 8/8 (100%) | Level 1 | All |
| Persistent placeholder | Always visible | 2/8 (25%) | Level 4 | Vuetify, custom |
| Helper text | Description below | 8/8 (100%) | Level 1 | All |
| Required indicator | Asterisk or text | 8/8 (100%) | Level 1 | All |
| Label placement | Top/left/inside | 7/8 (88%) | Level 1 | All except Semantic |
| Character counter | Count characters | 5/8 (63%) | Level 2 | Ant, HeroUI, Nuxt, Vuetify, custom |

### Prefix & Suffix Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Icon prefix | Icon before text | 8/8 (100%) | Level 1 | All |
| Icon suffix | Icon after text | 8/8 (100%) | Level 1 | All |
| Text prefix | Text before input | 7/8 (88%) | Level 1 | All except HeroUI |
| Text suffix | Text after input | 7/8 (88%) | Level 1 | All except HeroUI |
| Button prefix | Button before input | 6/8 (75%) | Level 2 | Ant, Chakra, Mantine, Semantic, Vuetify, Nuxt |
| Button suffix | Button after input | 7/8 (88%) | Level 1 | All except HeroUI |
| Clear button | X to clear value | 7/8 (88%) | Level 1 | All except Semantic |
| Password toggle | Show/hide password | 7/8 (88%) | Level 1 | All except Semantic |
| Addon before | Prepended element | 4/8 (50%) | Level 2 | Ant, Chakra (InputLeftAddon), Semantic, MUI |
| Addon after | Appended element | 4/8 (50%) | Level 2 | Ant, Chakra (InputRightAddon), Semantic, MUI |
| Avatar prefix | User avatar | 2/8 (25%) | Level 4 | Nuxt, custom |

### Validation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Required validation | Field required | 8/8 (100%) | Level 1 | All |
| Error message display | Show validation errors | 8/8 (100%) | Level 1 | All |
| Pattern validation | Regex validation | 7/8 (88%) | Level 1 | All except Semantic |
| Min/max length | Character limits | 7/8 (88%) | Level 1 | All except Semantic |
| Custom validation | Function validation | 7/8 (88%) | Level 1 | All except Semantic |
| Async validation | Server-side validation | 5/8 (63%) | Level 2 | Ant, Chakra, HeroUI, Nuxt, Vuetify |
| Real-time validation | Validate on input | 8/8 (100%) | Level 1 | All |
| Lazy validation | Validate on blur | 6/8 (75%) | Level 2 | MUI, Vuetify, Nuxt, Chakra, custom |
| Form integration | Form context validation | 8/8 (100%) | Level 1 | All |
| Multiple error messages | Show multiple errors | 5/8 (63%) | Level 2 | MUI, Vuetify, HeroUI, custom |

### Form Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Form component integration | Native form system | 7/8 (88%) | Level 1 | All except Semantic |
| React Hook Form | RHF integration | 6/8 (75%) | Level 1 | Ant, Chakra, HeroUI, Mantine, MUI, Nuxt |
| Formik integration | Formik support | 4/8 (50%) | Level 2 | Chakra, Mantine, MUI, custom |
| Zod validation | Zod schema | 3/8 (38%) | Level 3 | Ant, HeroUI, custom |
| Yup validation | Yup schema | 3/8 (38%) | Level 3 | Chakra, MUI, custom |
| Uncontrolled mode | defaultValue | 8/8 (100%) | Level 1 | All |
| Controlled mode | value + onChange | 8/8 (100%) | Level 1 | All |
| Form submission | onSubmit integration | 8/8 (100%) | Level 1 | All |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| aria-label support | Accessible label | 8/8 (100%) | Level 1 | All |
| aria-describedby | Error association | 8/8 (100%) | Level 1 | All |
| aria-invalid | Error state | 8/8 (100%) | Level 1 | All |
| aria-required | Required field | 8/8 (100%) | Level 1 | All |
| Label association | for/id linking | 8/8 (100%) | Level 1 | All |
| Keyboard navigation | Tab, Enter, Esc | 8/8 (100%) | Level 1 | All |
| Focus management | Focus ring | 8/8 (100%) | Level 1 | All |
| Screen reader support | Semantic HTML | 8/8 (100%) | Level 1 | All |
| Error announcements | Live regions | 4/8 (50%) | Level 2 | MUI, Vuetify, HeroUI, custom |
| Touch target size | 44px+ minimum | 6/8 (75%) | Level 1 | Modern frameworks |

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Auto-focus | Focus on mount | 8/8 (100%) | Level 1 | All |
| Auto-complete | Browser autocomplete | 8/8 (100%) | Level 1 | All |
| Debounced input | Delay onChange | 5/8 (63%) | Level 2 | Common pattern |
| Masked input | Format input (phone) | 4/8 (50%) | Level 3 | Custom implementations |
| Input groups | Multiple inputs together | 4/8 (50%) | Level 3 | Ant, Chakra, Semantic, custom |
| Copy to clipboard | Copy button | 2/8 (25%) | Level 4 | Nuxt, custom |
| Character limit | Max length visual | 5/8 (63%) | Level 2 | Ant, HeroUI, Nuxt, Vuetify, custom |
| Password strength | Strength indicator | 3/8 (38%) | Level 3 | Custom implementations |
| Search suggestions | Autocomplete dropdown | 2/8 (25%) | Level 4 | Semantic, custom |
| Clear on escape | Esc to clear | 3/8 (38%) | Level 3 | Custom implementations |

### Styling & Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Custom className | CSS class override | 8/8 (100%) | Level 1 | All |
| Inline styles | Style prop | 8/8 (100%) | Level 1 | All |
| Theme integration | Design tokens | 7/8 (88%) | Level 1 | All except Semantic |
| sx prop | MUI system | 1/8 (13%) | Level 5 | MUI |
| Styled components | CSS-in-JS | 6/8 (75%) | Level 2 | React frameworks |
| Tailwind classes | Utility classes | 2/8 (25%) | Level 4 | Nuxt UI, HeroUI |
| CSS variables | Custom properties | 5/8 (63%) | Level 2 | Modern frameworks |
| Slot customization | Template slots | 2/8 (25%) | Level 4 | Vuetify, Nuxt |

## Notable Patterns

### Universal Patterns (100%)
- Text/email/password/number input types
- Small/medium/large sizes
- Disabled and readonly states
- Error state
- Focus state
- Required field
- Static labels
- Placeholder text
- Helper text
- Icon prefix/suffix
- Error message display
- Required validation
- Real-time validation
- Form integration
- Uncontrolled and controlled modes
- All accessibility patterns (aria-*, label, keyboard, focus)
- Auto-focus
- Auto-complete
- Custom className and inline styles

### Highly Adopted (75%+)
- Search/tel/URL input types (88%)
- Outlined variant (88%)
- Label placement (88%)
- Text prefix/suffix (88%)
- Button suffix (88%)
- Clear button (88%)
- Password toggle (88%)
- Pattern validation (88%)
- Min/max length (88%)
- Custom validation (88%)
- Form component integration (88%)
- Theme integration (88%)
- Date/time input (75%)
- Filled variant (75%)
- Button prefix (75%)
- Lazy validation (75%)
- React Hook Form (75%)
- Touch target size (75%)
- Styled components (75%)

### Emerging Patterns (60-74%)
- Loading state (63%)
- Character counter (63%)
- Async validation (63%)
- Multiple error messages (63%)
- Debounced input (63%)
- Character limit visual (63%)
- CSS variables (63%)

## Implementation Notes

### Input Type Implementation

**Text (Default)**:
```jsx
// All frameworks
<Input type="text" placeholder="Enter text" />
```

**Email with Validation**:
```jsx
// Ant Design
<Input type="email" />

// Chakra UI
<Input type="email" />

// MUI
<TextField type="email" />

// Vuetify
<v-text-field type="email" />
```

**Password with Toggle**:
```jsx
// Ant Design
<Input.Password placeholder="Password" />

// Chakra UI
<InputGroup>
  <Input type={show ? 'text' : 'password'} />
  <InputRightElement>
    <IconButton onClick={() => setShow(!show)} />
  </InputRightElement>
</InputGroup>

// MUI
<TextField
  type={showPassword ? 'text' : 'password'}
  InputProps={{
    endAdornment: (
      <IconButton onClick={() => setShowPassword(!show)}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    )
  }}
/>
```

### Visual Variant Implementation

**Outlined (Most Common)**:
```jsx
// MUI
<TextField variant="outlined" />

// Chakra UI
<Input variant="outline" />

// HeroUI
<Input variant="bordered" />

// Vuetify
<v-text-field variant="outlined" />
```

**Filled**:
```jsx
// MUI
<TextField variant="filled" />

// Chakra UI
<Input variant="filled" />

// Mantine
<Input variant="filled" />
```

**Underlined/Flushed**:
```jsx
// Chakra UI
<Input variant="flushed" />

// HeroUI
<Input variant="underlined" />

// Vuetify
<v-text-field variant="underlined" />
```

### Size Implementation

**Small/Medium/Large**:
```jsx
// Ant Design
<Input size="small" />
<Input size="middle" />
<Input size="large" />

// MUI
<TextField size="small" />
<TextField size="medium" />

// Chakra UI
<Input size="sm" />
<Input size="md" />
<Input size="lg" />

// HeroUI
<Input size="sm" />
<Input size="md" />
<Input size="lg" />
```

### Validation Implementation

**Error State with Message**:
```jsx
// Ant Design
<Input status="error" />
<Form.Item validateStatus="error" help="Error message">
  <Input />
</Form.Item>

// Chakra UI
<Input isInvalid />
<FormErrorMessage>Error message</FormErrorMessage>

// MUI
<TextField error helperText="Error message" />

// Vuetify
<v-text-field :error="true" error-messages="Error message" />
```

**Custom Validation**:
```jsx
// React Hook Form (Chakra UI example)
const { register, formState: { errors } } = useForm();

<Input
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  })}
  isInvalid={!!errors.email}
/>

// Vuetify
<v-text-field
  :rules="[
    v => !!v || 'Required',
    v => v.length >= 8 || 'Min 8 characters'
  ]"
/>
```

### Prefix/Suffix Implementation

**Icon Prefix**:
```jsx
// Ant Design
<Input prefix={<SearchOutlined />} />

// Chakra UI
<InputGroup>
  <InputLeftElement>
    <SearchIcon />
  </InputLeftElement>
  <Input />
</InputGroup>

// MUI
<TextField
  InputProps={{
    startAdornment: <SearchIcon />
  }}
/>

// Nuxt UI
<UInput icon="i-heroicons-magnifying-glass" />
```

**Text Prefix/Suffix (Currency)**:
```jsx
// Ant Design
<Input prefix="$" suffix="USD" />

// Chakra UI
<InputGroup>
  <InputLeftAddon>$</InputLeftAddon>
  <Input />
  <InputRightAddon>USD</InputRightAddon>
</InputGroup>

// MUI
<TextField
  InputProps={{
    startAdornment: <InputAdornment position="start">$</InputAdornment>,
    endAdornment: <InputAdornment position="end">USD</InputAdornment>
  }}
/>

// Semantic UI
<div class="ui labeled input">
  <div class="ui label">$</div>
  <input type="text">
  <div class="ui label">USD</div>
</div>
```

**Clear Button**:
```jsx
// Ant Design
<Input allowClear />

// HeroUI
<Input isClearable />

// Nuxt UI
<UInput :trailing-icon="value ? 'i-heroicons-x-mark' : undefined" />
```

### Form Integration

**React Hook Form**:
```jsx
// Generic pattern
const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    {...register('email', { required: true })}
    error={!!errors.email}
  />
</form>
```

**Native Form System**:
```jsx
// Ant Design
<Form onFinish={onFinish}>
  <Form.Item name="email" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>

// Vuetify
<v-form @submit="onSubmit">
  <v-text-field v-model="email" :rules="rules" />
</v-form>
```

### Accessibility Implementation

**Complete Accessible Input**:
```jsx
// Best practice pattern
<label htmlFor="email">
  Email Address
  <span aria-label="required">*</span>
</label>
<Input
  id="email"
  type="email"
  aria-describedby="email-error email-help"
  aria-invalid={hasError}
  aria-required="true"
/>
<p id="email-help">We'll never share your email</p>
{hasError && <p id="email-error" role="alert">Invalid email</p>}
```

## Framework Comparison

| Framework | Best For | Strengths | Trade-offs |
|-----------|----------|-----------|------------|
| Ant Design | Enterprise apps | Complete form system, character counter, addon system | Less flexible styling |
| Chakra UI | Customization | Excellent composition, InputGroup system, theme integration | More verbose for complex inputs |
| HeroUI | Modern React | Beautiful design, comprehensive validation, good DX | Smaller ecosystem |
| Mantine | Flexibility | Low-level control, polymorphic, specialized variants | Base Input requires more setup |
| MUI | Material Design | Complete TextField, multiple variants, mature ecosystem | Heavier bundle size |
| Nuxt UI | Vue/Nuxt apps | Iconify integration, Tailwind-based, form integration | Vue-specific |
| Semantic UI | Simple projects | CSS-based, no JS required, straightforward HTML | Limited validation |
| Vuetify | Vue Material | Rich features, comprehensive validation, density options | Vue-specific, learning curve |

## Accessibility

### WCAG Compliance

**Labels** (WCAG 2.1, 3.3.2 Labels or Instructions):
```jsx
// ✅ Good - Visible label
<label htmlFor="email">Email</label>
<Input id="email" />

// ✅ Good - aria-label
<Input aria-label="Email address" />

// ❌ Bad - No label
<Input placeholder="Email" /> {/* Placeholder is not a label */}
```

**Error Identification** (WCAG 2.1, 3.3.1 Error Identification):
```jsx
// ✅ Good - Error message associated
<Input
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error">Please enter a valid email</p>

// ❌ Bad - Error not programmatically associated
<Input />
<p style={{color: 'red'}}>Error</p>
```

**Required Fields** (WCAG 2.1, 3.3.2):
```jsx
// ✅ Good - Programmatic indication
<label>
  Email <span aria-label="required">*</span>
</label>
<Input required aria-required="true" />

// ❌ Bad - Visual only
<label>Email *</label>
<Input />
```

**Keyboard Access** (WCAG 2.1, 2.1.1 Keyboard):
```jsx
// ✅ All frameworks support Tab, Shift+Tab, Enter
// Built-in for native input element
```

### Screen Reader Support

**Error Announcements**:
```jsx
// Live region for dynamic errors
<div role="alert" aria-live="polite">
  {error && <p>{error}</p>}
</div>
```

**State Changes**:
```jsx
// Announce loading state
<Input
  aria-busy={loading}
  aria-label={loading ? "Loading..." : "Search"}
/>
```

## Sophisticated Design Patterns

### Chakra UI / MUI - InputAdornment System (Prefix/Suffix Element Composition)

**What it does**: Enables composition of arbitrary elements (icons, text, buttons) before and after the input text through a dedicated component wrapper system (InputAdornment, InputGroup, InputLeftElement, InputRightElement). Elements are positioned inside the input container, not outside, allowing them to integrate as part of the single-line text entry experience while maintaining focus and event handling boundaries.

**Why it's sophisticated**: The non-obvious problem solved here is how to add interactive or informational content to an input without breaking the semantic meaning of the underlying text field or compromising keyboard navigation. A naive approach would wrap the input in a div and absolutely position elements, but this breaks focus management, selection behavior, and accessibility. The proper solution creates a positioning context that integrates elements as part of the input's layout model while keeping them outside the actual input element's DOM structure. This allows password toggle buttons, clear buttons, loading spinners, and icon indicators to coexist with text entry.

**Evidence of design maturity**:
- Solves the "password visibility toggle" edge case - toggle changes input type without losing focus or selection state
- Distinguishes between static addons (text prefixes like "$", "https://") and interactive elements (buttons, icons) through separate component types
- Supports multiple elements on the same side without overlap issues through positioning APIs
- Real-world usage shows this pattern essential for every modern form library (currency inputs, phone formatting, search with icons)
- Design restraint: Elements don't interfere with input's native placeholder or value display, preserving standard input behavior

### MUI / Vuetify - Floating Label with Automatic Shrink and Animation

**What it does**: Implements a label that is initially positioned inside the input space (or above it at small size), then automatically "floats" upward with smooth animation when the input receives focus or contains a value, while the label shrinks to a smaller font size and changes color. The component system automatically triggers this animation and manages the label's z-index, positioning, and responsive font scaling based on focus/blur/value states.

**Why it's sophisticated**: The underlying problem is space efficiency in form layouts - traditional labels above inputs waste vertical space, while placeholder-only inputs sacrifice accessibility. The non-obvious insight is that a label can occupy the same visual space as the input while empty, then transition to a permanent position above when needed. This requires solving several interconnected problems: (1) detecting the "filled" state independently from focus, (2) animating without layout shift (using CSS transitions on position/scale rather than DOM manipulation), (3) managing color contrast as the label moves from inside to outside the input boundary, (4) handling edge cases like long labels that would overflow, and (5) maintaining accessibility by ensuring the label is always associated with the input even during animation.

**Evidence of design maturity**:
- MUI's implementation handles the "persistent placeholder" case where both placeholder and label exist simultaneously (label for accessibility, placeholder for hint)
- Vuetify's density options show careful consideration of how label animation scales across different use cases
- Real-world testing reveals the pattern works across all input types (email, password, number) without behavior changes
- Responsive behavior shows the pattern adapts label size and position based on screen size
- Design restraint: Animation is subtle (not overly dramatic) and respects prefers-reduced-motion for accessibility

### Ant Design - Dynamic Character Count with Status Feedback

**What it does**: Provides a configurable character counter that displays current/maximum character count, often with customizable formatter functions. The counter integrates with validation status, changing visual appearance (color, icon) as the user approaches length limits or encounters validation errors. The pattern includes optional "showCount" prop with custom formatter support to display counts in different formats (e.g., "50/100", "50 of 100 chars remaining", visual progress bar).

**Why it's sophisticated**: The non-obvious problem is that displaying character count is simple, but providing meaningful feedback as count approaches limits requires solving several problems: (1) determining optimal warning thresholds that vary by input type (password vs. comment), (2) distinguishing between "at limit" errors and "approaching limit" warnings visually without duplicating error messages, (3) formatting the count display in culturally appropriate ways (some regions prefer "50/100", others "50 of 100"), (4) ensuring the counter updates performantly without debounce lag, (5) preventing the counter text from shifting input width during keystroke, and (6) handling the edge case where an input has no maxLength but character count is still useful for user guidance.

**Evidence of design maturity**:
- Implementation includes formatter function support to handle custom display logic without code duplication
- Form integration shows the pattern works in context where character count complements form-level validation
- Real-world observation: character counters become essential for any user-generated content field (bios, comments, descriptions)
- Design restraint: Counter doesn't trigger validation errors automatically (that's form's job), only provides feedback; the choice to enforce maxLength is separate from showing count
- Accessibility consideration: Counter text is associated with input via aria-describedby pattern for screen readers

## Raw Data References

Individual framework research reports available at:
- `ai/research/input/ant-design/usage-patterns.md`
- `ai/research/input/chakra-ui/usage-patterns.md`
- `ai/research/input/heroui/usage-patterns.md`
- `ai/research/input/mantine/usage-patterns.md`
- `ai/research/input/mui/usage-patterns.md`
- `ai/research/input/nuxt-ui/usage-patterns.md`
- `ai/research/input/semantic-ui-classic/usage-patterns.md`
- `ai/research/input/vuetify/usage-patterns.md`

## Research Methodology

All research conducted on 2025-11-05 through parallel subagent research (8 subagents), direct documentation access, and cross-framework pattern analysis.

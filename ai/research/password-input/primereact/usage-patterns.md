# PrimeReact - Password Usage Patterns

## Component URL
https://primereact.org/password
Status: ✅ Working
Version: 10.9.7 (current), with v11 and v9 versions available
Last Verified: 2025-11-05

## Documentation Quality
**Assessment: Good (3.5/5)**

**Strengths:**
- Clear code examples for each major pattern
- Well-organized visual demonstrations
- Comprehensive accessibility documentation with keyboard shortcuts table
- Props clearly documented with types and defaults
- Version switcher for different releases
- Working interactive examples on the page

**Areas for Improvement:**
- No detailed explanation of strength calculation algorithm
- Missing API reference table with all props in one place
- No TypeScript interface documentation visible
- Limited explanation of when to use each pattern
- No performance considerations documented
- No mention of validation patterns or regex examples
- Template customization examples could be more detailed

## Component Definition
- **Core purpose**: Provides a specialized input field for password entry with real-time strength validation feedback, helping users create secure passwords by displaying strength indicators (weak/medium/strong) and optionally revealing password characters
- **Mental model**: An enhanced text input that wraps standard password functionality with visual feedback about password quality, presented as a popup overlay during typing
- **Semantic meaning**: This is a form control specifically designed for password entry that communicates password strength requirements and current password quality to users through visual indicators and customizable labels

## Pattern Support Levels
- **Native**: Features implemented directly through component props and built into the core component behavior (e.g., strength meter, toggle mask, validation states)
- **Composed**: Patterns that require wrapping or combining with other PrimeReact components (e.g., FloatLabel wrapper, form integration with form libraries)
- **CSS-only**: Visual variations controlled entirely through styling props without behavioral changes (e.g., filled variant, custom styling through Pass Through)

## Core Patterns

### Input Modes
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic password input | ✅ | Native | Simple password field without strength feedback, enabled via `feedback={false}` |
| Controlled component | ✅ | Native | Requires `value` and `onChange` props for state management |
| Strength meter | ✅ | Native | Default behavior - shows popup with strength indicator during typing |
| Toggle mask (show/hide) | ✅ | Native | Icon button to reveal password text, enabled via `toggleMask` prop |

### Validation & Feedback
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Real-time strength validation | ✅ | Native | Automatic strength calculation displayed as popup (weak/medium/strong) |
| Custom strength labels | ✅ | Native | `promptLabel`, `weakLabel`, `mediumLabel`, `strongLabel` props for i18n |
| Invalid state | ✅ | Native | `invalid` boolean prop for validation error indication |
| Disabled state | ✅ | Native | `disabled` boolean prop prevents interaction |

### Visual Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Outlined (default) | ✅ | CSS-only | Default visual style with border outline |
| Filled | ✅ | CSS-only | Higher visual emphasis via `variant="filled"` prop |
| Float label | ✅ | Composed | Requires wrapping in `<FloatLabel>` component |

### Customization
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom header template | ✅ | Native | `header` prop accepts JSX for popup header content |
| Custom footer template | ✅ | Native | `footer` prop accepts JSX for popup footer content |
| Placeholder text | ✅ | Native | Standard `placeholder` prop |
| Pass Through styling | ✅ | Native | Advanced customization via PrimeReact Pass Through API |

### Accessibility
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ✅ | Native | `aria-label` and `aria-labelledby` props supported |
| Label association | ✅ | Composed | Standard HTML `<label for="">` pattern with `id`/`inputId` |
| Keyboard navigation | ✅ | Native | Tab for focus, Escape to close strength meter popup |
| Screen reader feedback | ✅ | Native | aria-live region announces strength changes |

### Form Integration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled input | ✅ | Native | Standard React controlled component pattern |
| Form validation | ✅ | Composed | Works with validation libraries via `invalid` prop |
| Tab order | ✅ | Native | `tabIndex` prop for custom tab order |

## Code Examples

### Basic Password Input (No Strength Meter)
```javascript
import { Password } from 'primereact/password';

function BasicPassword() {
  const [value, setValue] = useState('');

  return (
    <Password
      value={value}
      onChange={(e) => setValue(e.target.value)}
      feedback={false}
      tabIndex={1}
    />
  );
}
```
**Note:** Strength meter is enabled by default, so `feedback={false}` is required for basic password input.

### Password with Strength Meter (Default)
```javascript
function PasswordWithMeter() {
  const [value, setValue] = useState('');

  return (
    <Password
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```
**Behavior:** Displays strength indicator as a popup while entering values. Automatically shows weak/medium/strong labels.

### Custom Locale Labels
```javascript
function LocalizedPassword() {
  const [value, setValue] = useState('');

  return (
    <Password
      value={value}
      onChange={(e) => setValue(e.target.value)}
      promptLabel="Choose a password"
      weakLabel="Too simple"
      mediumLabel="Average complexity"
      strongLabel="Complex password"
    />
  );
}
```
**Use case:** Internationalization or custom messaging to match brand voice.

### Toggle Mask (Show/Hide Password)
```javascript
function ToggleMaskPassword() {
  const [value, setValue] = useState('');

  return (
    <Password
      value={value}
      onChange={(e) => setValue(e.target.value)}
      toggleMask
    />
  );
}
```
**Behavior:** An icon is displayed to show the value as plain text when clicked.

### Custom Header and Footer Templates
```javascript
function TemplatedPassword() {
  const [value, setValue] = useState('');

  const header = <div className="font-bold mb-3">Pick a password</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  return (
    <Password
      value={value}
      onChange={(e) => setValue(e.target.value)}
      header={header}
      footer={footer}
    />
  );
}
```
**Use case:** Custom password requirements or branding in the strength meter popup.

### Float Label Pattern
```javascript
import { FloatLabel } from 'primereact/floatlabel';

function FloatLabelPassword() {
  const [value, setValue] = useState('');

  return (
    <FloatLabel>
      <Password
        inputId="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <label htmlFor="password">Password</label>
    </FloatLabel>
  );
}
```
**Behavior:** A floating label appears on top of the input field when focused.

### Filled Variant
```javascript
function FilledPassword() {
  const [value, setValue] = useState('');

  return (
    <Password
      variant="filled"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      feedback={false}
      tabIndex={1}
    />
  );
}
```
**Use case:** Higher visual emphasis than default outlined style.

### Invalid State (Validation Error)
```javascript
function ValidatedPassword() {
  const [value, setValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsInvalid(newValue.length > 0 && newValue.length < 8);
  };

  return (
    <Password
      value={value}
      onChange={handleChange}
      invalid={isInvalid}
    />
  );
}
```

### Disabled State
```javascript
function DisabledPassword() {
  return (
    <Password
      disabled
      placeholder="Disabled"
    />
  );
}
```

### Accessibility Examples

#### With HTML Label
```javascript
<label htmlFor="pwd1">Password</label>
<Password id="pwd1" value={value} onChange={(e) => setValue(e.target.value)} />
```

#### With ARIA Label Reference
```javascript
<span id="pwd2">Password</span>
<Password
  aria-labelledby="pwd2"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### With Direct ARIA Label
```javascript
<Password
  aria-label="Password"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Styling Approaches

### Variant System
PrimeReact Password supports two built-in visual variants:

1. **Outlined (default)**: Standard border outline style
   ```javascript
   <Password variant="outlined" />
   // Or simply:
   <Password />
   ```

2. **Filled**: Higher visual emphasis with filled background
   ```javascript
   <Password variant="filled" />
   ```

### Theming Integration
- **SASS API**: Component styles can be customized via PrimeReact's SASS variables
- **CSS Layers**: Modern CSS cascade layers support for style organization
- **Pass Through**: Advanced customization API for targeting internal component elements
- **Theme System**: Works with all PrimeReact themes (Lara, Material, Bootstrap, etc.)

### Customization Points
The component exposes several customization points:
- Strength meter popup appearance via `header` and `footer` templates
- Label text via `promptLabel`, `weakLabel`, `mediumLabel`, `strongLabel`
- Visual variant via `variant` prop
- Standard HTML attributes like `className`, `style`
- Pass Through API for deep customization of internal elements

### Popup Styling
The strength meter displays as a popup overlay with:
- Visual indicator bar showing strength (color-coded: red/orange/green)
- Text label indicating strength level
- Optional custom header and footer content
- Automatic positioning relative to input field

## Accessibility Patterns

### ARIA Support
**Implemented:**
- `aria-label`: Direct accessible name for the input
- `aria-labelledby`: Reference to external labeling element
- `aria-live`: Region that announces strength changes to screen readers
- Proper role semantics (inherits from native input)

**Screen Reader Behavior:**
"Screen reader is notified about changes to password strength using a section with aria-live."

### Label Association Methods
1. **HTML label with for/id** (recommended):
   ```javascript
   <label htmlFor="pwd1">Password</label>
   <Password id="pwd1" />
   ```

2. **ARIA labelledby**:
   ```javascript
   <span id="pwd2">Password</span>
   <Password aria-labelledby="pwd2" />
   ```

3. **ARIA label** (when no visible label):
   ```javascript
   <Password aria-label="Password" />
   ```

### Keyboard Navigation
| Key | Function |
|-----|----------|
| **Tab** | Moves focus to the input field |
| **Escape** | Closes the strength meter popup if open |

**Additional keyboard behavior:**
- Standard text input keyboard interactions (typing, cursor movement, select all, etc.)
- Tab order customizable via `tabIndex` prop
- Popup automatically opens when typing begins
- Popup closes on Escape or when focus leaves the input

### Focus Management
- Input receives browser default focus styling
- Focus indicator visible for keyboard navigation
- Tab order respects `tabIndex` prop when provided
- Focus trapped appropriately when popup is open

### Screen Reader Considerations
- Strength changes announced in real-time via aria-live region
- Labels properly associated with input for context
- Toggle mask button announced as button with appropriate label
- Invalid state communicated to assistive technology via `invalid` prop

## Notable Features

### Strength Calculation
- **Automatic strength detection**: Component automatically calculates password strength based on entered characters
- **Real-time feedback**: Strength indicator updates as user types
- **Three-tier system**: Weak, Medium, Strong classification
- **Visual indicator**: Color-coded bar (typically red/orange/green)
- **Algorithm**: Not documented in detail, appears to consider character variety and length

**Note:** The specific strength calculation algorithm is not exposed in the documentation. It appears to be internal logic that evaluates character complexity.

### Toggle Mask Feature
- **Icon button**: Eye icon appears on the right side of input
- **Toggle behavior**: Clicking reveals password as plain text, clicking again masks it
- **Accessibility**: Button properly labeled for screen readers
- **Use case**: Allows users to verify password entry accuracy

### Popup Behavior
- **Automatic display**: Opens when user begins typing
- **Positioning**: Appears below input field with automatic positioning
- **Dismissal**: Closes on Escape key or when focus leaves
- **Content**: Displays strength indicator, label, and optional header/footer
- **Non-blocking**: Does not prevent form submission or interaction

### Template Customization
The `header` and `footer` props accept any JSX content, enabling:
- Custom password requirements list
- Branding elements
- Helper text and tips
- Links to password policy documentation
- Visual enhancements

### Locale Support
All strength labels are customizable via props:
- `promptLabel`: Initial prompt text
- `weakLabel`: Weak password label
- `mediumLabel`: Medium strength label
- `strongLabel`: Strong password label

This enables full internationalization without requiring a separate locale system.

### Form Integration
- **Controlled component**: Requires explicit value/onChange management
- **Validation friendly**: `invalid` prop integrates with validation libraries
- **Form submission**: Works with standard HTML forms
- **Compatible with**: React Hook Form, Formik, and other form libraries
- **No uncontrolled mode**: Must manage state externally

### State Management
PrimeReact Password is **controlled-only**:
```javascript
// Required pattern
const [value, setValue] = useState('');
<Password value={value} onChange={(e) => setValue(e.target.value)} />

// No uncontrolled mode available
// This won't work:
<Password defaultValue="initial" />
```

## Research Notes

### Framework Context
- Part of PrimeReact UI component library (React implementation of PrimeFaces)
- Maintained by PrimeTek
- Enterprise-focused component library
- Extensive theme collection available
- Version 10.9.7 current at time of research

### Component Philosophy
- Controlled-only approach (no uncontrolled mode)
- Built-in validation feedback (strength meter is default)
- Template-based customization for complex needs
- Consistent with PrimeReact's overall API patterns

### Limitations Observed
1. **No uncontrolled mode**: Cannot use without state management
2. **Algorithm opacity**: Strength calculation logic not documented or customizable
3. **Limited validation hooks**: No callbacks before/during/after validation
4. **No custom strength levels**: Fixed three-tier system (weak/medium/strong)
5. **No regex prop**: Cannot specify custom validation patterns directly
6. **Template verbosity**: Custom requirements require full template implementation

### Strengths Observed
1. **Zero configuration strength meter**: Works out of the box with sensible defaults
2. **Good internationalization support**: All labels customizable
3. **Flexible templates**: Header/footer allow rich customization
4. **Consistent API**: Follows PrimeReact conventions
5. **Good accessibility**: ARIA support and keyboard navigation built-in
6. **Toggle mask feature**: Convenient show/hide functionality

### Comparison to Standard Input
Unlike standard HTML password inputs, this component:
- ✅ Provides built-in strength validation
- ✅ Offers visual feedback via popup
- ✅ Includes toggle mask functionality
- ❌ Requires controlled state management
- ❌ Adds component library dependency
- ❌ Less flexibility in validation logic

### Use Case Recommendations

**Use PrimeReact Password when:**
- Building forms with password creation (signup, password reset)
- Need real-time strength feedback without custom implementation
- Using PrimeReact for other form components
- Want consistent theming across password inputs
- Need built-in toggle mask feature
- Require internationalization support

**Consider alternatives when:**
- Need uncontrolled component for simple forms
- Require custom strength calculation algorithm
- Want more granular validation hooks
- Building lightweight application (avoid large library)
- Need custom strength levels beyond weak/medium/strong
- Prefer headless/unstyled components

### Related PrimeReact Components
- **InputText**: Basic text input component
- **FloatLabel**: Floating label wrapper (used in examples)
- **Divider**: Used in template examples for visual separation
- **Form validation**: Integrates with PrimeReact form patterns

### Technical Considerations
- **Bundle size**: Part of larger PrimeReact library
- **Dependencies**: Requires PrimeReact core and theme
- **Browser support**: Modern browsers (ES6+)
- **React version**: Compatible with React 18+
- **TypeScript**: Full TypeScript support (types included)

### Migration Notes
- **v9 → v10**: Version switcher available on docs site
- **v10 → v11**: Preview available, migration path documented separately
- **Breaking changes**: Not detailed on this page, check migration guides

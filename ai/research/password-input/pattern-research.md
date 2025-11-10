# Component Pattern Research: Password Input

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 5
- Date: 2025-11-05
- Unique patterns identified: 60+

## Component Definition Consensus

Password Input components provide specialized text inputs for secure password entry with visibility toggle and validation features. Universal mental model: "Masked input with reveal toggle."

**Primary Purpose:** Enable secure password entry while balancing security (masked characters) with usability (temporary reveal option to verify correctness), along with optional strength validation and feedback.

**Mental Model:** A text input that defaults to obscuring entered characters for security, with an integrated toggle button (eye icon) that switches between masked and visible states, allowing users to verify their input when needed.

**Semantic meaning:** Communicates secure, sensitive data entry specifically for passwords or confidential information, signaling to users, browsers, and assistive technologies that special security handling applies.

## Terminology Variations

- **PasswordInput** (2 frameworks) = Chakra UI, Mantine
- **Input.Password** (1 framework) = Ant Design (subcomponent)
- **Password** (1 framework) = PrimeReact
- **Input type="password"** (1 framework) = ShadCN (standard HTML pattern)

All frameworks provide password input functionality with varying naming approaches.

## Pattern Inventory

### Visibility Toggle Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Show/hide toggle button | Eye icon button | 5/5 (100%) | **Level 1: Universal** | All | Native/Composed |
| Default hidden state | Masked by default | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Click to toggle | Click activation | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Hover to toggle | Hover activation | 1/5 (20%) | **Level 5: Rare** | Ant Design | Native |
| Controlled visibility | External state control | 4/5 (80%) | **Level 2: Common** | Chakra, Ant Design, Mantine, PrimeReact | Native |
| Custom toggle icons | Replace eye icon | 3/5 (60%) | **Level 3: Frequent** | Ant Design, Mantine, PrimeReact | Native |
| Disable toggle | Remove toggle button | 2/5 (40%) | **Level 3: Frequent** | Ant Design, PrimeReact | Native |

### Size Variant Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Multiple sizes | 3+ size options | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Small size | Compact input | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Medium/default size | Standard size | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Large size | Prominent input | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Extra small (xs) | Minimum size | 2/5 (40%) | **Level 3: Frequent** | Chakra UI, Mantine | Native |
| Extra large (xl) | Maximum size | 1/5 (20%) | **Level 5: Rare** | Mantine | Native |

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Controlled mode | value + onChange | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Uncontrolled mode | defaultValue | 4/5 (80%) | **Level 2: Common** | ShadCN, Chakra, Ant Design, Mantine | Native |
| Disabled state | Non-interactive | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Read-only state | View-only | 2/5 (40%) | **Level 3: Frequent** | Ant Design, ShadCN | Native |
| Error/invalid state | Validation feedback | 5/5 (100%) | **Level 1: Universal** | All | Native/Composed |

### Password Strength Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Strength meter | Visual indicator | 2/5 (40%) | **Level 3: Frequent** | Chakra UI, PrimeReact | Native/Composed |
| Strength calculation | Algorithm-based | 1/5 (20%) | **Level 5: Rare** | PrimeReact | Native |
| Weak/medium/strong tiers | Three-level system | 1/5 (20%) | **Level 5: Rare** | PrimeReact | Native |
| Custom strength logic | User-defined rules | 1/5 (20%) | **Level 5: Rare** | Chakra UI | Composed |
| Real-time validation | Live feedback | 2/5 (40%) | **Level 3: Frequent** | Chakra UI, PrimeReact | Native/Composed |

### Form Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Form library support | react-hook-form, etc. | 5/5 (100%) | **Level 1: Universal** | All | Native/Composed |
| Validation integration | Error display | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Label association | Label component | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Helper text | Hints and descriptions | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Required indicator | Visual asterisk | 5/5 (100%) | **Level 1: Universal** | All | Composed |

### Input Enhancement Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Placeholder text | Empty state hint | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Prefix icons | Leading icons | 3/5 (60%) | **Level 3: Frequent** | Ant Design, Mantine, PrimeReact | Native |
| Suffix content | Trailing content | 2/5 (40%) | **Level 3: Frequent** | Ant Design, Mantine | Native |
| Clear button | Remove all text | 2/5 (40%) | **Level 3: Frequent** | Ant Design, PrimeReact | Native |
| Character counter | Length display | 1/5 (20%) | **Level 5: Rare** | Ant Design | Native |
| Max length | Character limit | 5/5 (100%) | **Level 1: Universal** | All | Native |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| ARIA labels | Screen reader labels | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Keyboard navigation | Tab, Enter support | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Focus management | Caret preservation | 3/5 (60%) | **Level 3: Frequent** | Ant Design, Mantine, PrimeReact | Native |
| aria-invalid | Error state | 5/5 (100%) | **Level 1: Universal** | All | Native |
| aria-describedby | Helper text association | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Autocomplete attributes | Browser hints | 5/5 (100%) | **Level 1: Universal** | All | Native |

### Security Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Auto-clear on hide | Clear when toggling | 1/5 (20%) | **Level 5: Rare** | Ant Design | Native |
| Autocomplete control | Password manager hints | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Toggle mask | Alternative to visibility | 1/5 (20%) | **Level 5: Rare** | PrimeReact | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Visual variants | Filled, outlined, etc. | 4/5 (80%) | **Level 2: Common** | Ant Design, Mantine, PrimeReact, ShadCN | Native |
| Border radius options | Rounded corners | 2/5 (40%) | **Level 3: Frequent** | Mantine, ShadCN | CSS-only |
| Custom CSS classes | className prop | 5/5 (100%) | **Level 1: Universal** | All | CSS-only |
| Styles API | Granular styling | 1/5 (20%) | **Level 5: Rare** | Mantine | CSS-only |
| Theme integration | Design system colors | 5/5 (100%) | **Level 1: Universal** | All | Native |

## Notable Patterns

### Universal (100%)
- Visibility toggle button
- Masked by default
- Click to toggle visibility
- Multiple size variants
- Controlled mode (value + onChange)
- Disabled state
- Error/invalid state
- Form library support
- Label association
- Placeholder text
- Max length limit
- ARIA labels
- Keyboard navigation
- aria-invalid
- Autocomplete attributes
- Custom CSS classes
- Theme integration

### ShadCN Specializations
- No dedicated password component
- Standard Input with type="password"
- Community-driven patterns
- Copy-paste enhancement model
- Minimal built-in features
- Full customization freedom
- Tailwind CSS styling
- Radix UI foundation (for enhanced versions)

### Chakra UI Specializations
- PasswordInput dedicated component
- 4 size variants (xs, sm, md, lg)
- PasswordStrengthMeter companion
- Composable architecture (v3)
- Controlled visibility state
- Field wrapper integration
- React Hook Form native support
- Style props system

### Ant Design Specializations
- Input.Password subcomponent
- Hover activation mode (unique)
- Custom icon rendering function
- Auto-clear on hide toggle
- Prefix/suffix support (v5.27.0+)
- Two size presets + default
- Character counter (showCount)
- Focus and caret preservation
- Action modes (click/hover)

### Mantine Specializations
- 5 size variants (xs-xl)
- 3 visual variants (default, filled, unstyled)
- Controlled/uncontrolled visibility
- Synchronized visibility across inputs
- Comprehensive Styles API (9 selectors)
- Custom toggle icons
- Input component inheritance
- Border radius options
- Polymorphic component

### PrimeReact Specializations
- Built-in strength meter
- Automatic strength calculation
- Three-tier system (weak/medium/strong)
- Toggle mask feature
- Popup-based feedback
- Template customization
- Internationalization support
- Controlled-only approach
- FloatLabel integration

## Sophisticated Design Patterns

### Ant Design - Auto-Clear Security Mechanism

**What it does**: Uses an internal `useRemovePasswordTimeout` hook that automatically clears the password value when the user toggles visibility to the hidden state. The mechanism works transparently without configuration—when a user clicks the eye icon to hide the password, the component internally clears the value from memory.

```jsx
<Input.Password
  visibilityToggle={{
    visible: passwordVisible,
    onVisibleChange: setPasswordVisible,
  }}
/>
// When visible changes from true to false, value is automatically cleared
```

**Why it's sophisticated**: This solves a subtle but real security concern that most developers never think about: password values remaining in JavaScript memory after being hidden. It represents a mindful decision about the security/usability tradeoff—the component chooses the secure path by default, assuming users who hide the password want it cleared rather than persisted.

**Evidence of design maturity**:
- Prevents accidental password exposure through memory inspection or debugging
- Works invisibly without requiring developer intervention (no opt-in flag needed)
- Balances UX (users don't need to manually clear) with security (value is purged automatically)
- Demonstrates consideration of real-world threat models beyond typical UI concerns

### PrimeReact - Built-in Strength Meter with Zero Configuration

**What it does**: The component includes an automatic strength calculation algorithm that evaluates password complexity and displays a popup indicator (weak/medium/strong) as users type. The strength meter appears by default and can be disabled with `feedback={false}`. The popup includes customizable labels for internationalization and optional header/footer templates for extended requirements.

```jsx
<Password
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  promptLabel="Choose a password"
  weakLabel="Too weak"
  mediumLabel="Decent"
  strongLabel="Strong"
  header={<div>Password Requirements</div>}
/>
```

**Why it's sophisticated**: This inverts the typical framework pattern where strength validation is left to developers. By making strength feedback the default behavior, PrimeReact solves the problem that most password forms need validation feedback—the component eliminates the "empty form validation" problem by providing sensible defaults. The popup overlay design keeps feedback contextually near the input without disrupting form layout.

**Evidence of design maturity**:
- Three-tier strength system (weak/medium/strong) reflects UX research on user comprehension
- Popup-based feedback prevents layout jank and responsive design issues
- Automatic strength detection removes need for developers to implement their own algorithms
- Template customization (header/footer) shows restraint—provides defaults but allows brands to customize without forcing component replacement

### Mantine - Synchronized Visibility Across Multiple Inputs

**What it does**: Enables multiple password inputs to share visibility state through controlled mode. By passing the same `visible` and `onVisibilityChange` props to multiple `PasswordInput` components, toggling one input's visibility toggle affects all of them simultaneously. This pattern is essential for password confirmation scenarios where users expect both fields to reveal/hide together.

```jsx
const [visible, setVisible] = useState(false);

<PasswordInput
  label="Password"
  visible={visible}
  onVisibilityChange={setVisible}
/>
<PasswordInput
  label="Confirm Password"
  visible={visible}
  onVisibilityChange={setVisible}
/>
```

**Why it's sophisticated**: This solves a non-obvious UX problem specific to password fields—the cognitive load of managing two separate visibility states when users are trying to confirm their password entry. The solution recognizes that password confirmation scenarios are a distinct use case that deserves special support without requiring custom abstraction layers.

**Evidence of design maturity**:
- Recognizes password/confirm password as a distinct interaction pattern (separate from general input reuse)
- Maintains flexibility through controlled props (developers aren't forced into this pattern)
- Works seamlessly with uncontrolled mode for single-input scenarios (no breaking changes to simple cases)
- Design restraint: provides the capability without making it mandatory or opaque

## Implementation Notes

### Installation

**ShadCN:**
```bash
npx shadcn-ui@latest add input
```

**Chakra UI:**
```bash
npm install @chakra-ui/react
```

**Ant Design:**
```bash
npm install antd
```

**Mantine:**
```bash
npm install @mantine/core
```

**PrimeReact:**
```bash
npm install primereact
```

### Basic Usage Comparison

**ShadCN:**
```jsx
import { Input } from "@/components/ui/input"

<Input type="password" placeholder="Enter password" />
```

**Chakra UI:**
```jsx
import { PasswordInput } from "@/components/ui/password-input"

<PasswordInput placeholder="Enter password" />
```

**Ant Design:**
```jsx
import { Input } from 'antd'

<Input.Password placeholder="Enter password" />
```

**Mantine:**
```tsx
import { PasswordInput } from '@mantine/core'

<PasswordInput placeholder="Enter password" />
```

**PrimeReact:**
```jsx
import { Password } from 'primereact/password'

<Password placeholder="Enter password" />
```

### Visibility Control Patterns

**Controlled (Chakra UI):**
```jsx
const [visible, setVisible] = useState(false)

<PasswordInput
  visible={visible}
  onVisibleChange={setVisible}
/>
```

**Controlled (Ant Design):**
```jsx
const [visible, setVisible] = useState(false)

<Input.Password
  visibilityToggle={{
    visible,
    onVisibleChange: setVisible
  }}
/>
```

**Controlled (Mantine):**
```tsx
const [visible, setVisible] = useState(false)

<PasswordInput
  visible={visible}
  onVisibilityChange={setVisible}
/>
```

### Custom Toggle Icons

**Ant Design:**
```jsx
<Input.Password
  iconRender={(visible) =>
    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
  }
/>
```

**Mantine:**
```tsx
<PasswordInput
  visibilityToggleIcon={({ reveal }) =>
    reveal ? <IconEye /> : <IconEyeOff />
  }
/>
```

### Strength Meter Patterns

**Chakra UI:**
```jsx
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui"

<Field>
  <PasswordInput value={password} onChange={setPassword} />
  <PasswordStrengthMeter value={password} />
</Field>
```

**PrimeReact:**
```jsx
<Password
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  promptLabel="Enter a password"
  weakLabel="Weak"
  mediumLabel="Medium"
  strongLabel="Strong"
/>
```

### Size Variants Comparison

**ShadCN:**
```jsx
{/* No built-in sizes - use className */}
<Input type="password" className="h-8" /> {/* Small */}
<Input type="password" className="h-10" /> {/* Default */}
<Input type="password" className="h-12" /> {/* Large */}
```

**Chakra UI:**
```jsx
<PasswordInput size="xs" />
<PasswordInput size="sm" />
<PasswordInput size="md" /> {/* Default */}
<PasswordInput size="lg" />
```

**Ant Design:**
```jsx
<Input.Password size="small" />
<Input.Password /> {/* Default */}
<Input.Password size="large" />
```

**Mantine:**
```tsx
<PasswordInput size="xs" />
<PasswordInput size="sm" />
<PasswordInput size="md" /> {/* Default */}
<PasswordInput size="lg" />
<PasswordInput size="xl" />
```

## Design Philosophy Differences

### Minimal/Community-Driven (ShadCN)
- **Philosophy**: Copy-paste primitives, community enhancement
- **Approach**: Standard HTML input with type="password"
- **Visibility Toggle**: Not provided, community patterns available
- **Strength Meter**: Not provided, custom implementation needed
- **Audience**: Developers wanting full control
- **Distribution**: Copy into project, full ownership

### Composable/Modular (Chakra UI)
- **Philosophy**: Dedicated component with companion meter
- **Approach**: Composable architecture (v3)
- **Visibility Toggle**: Built-in with controlled state
- **Strength Meter**: Separate PasswordStrengthMeter component
- **Audience**: React developers, design system builders
- **Distribution**: npm package with theme system

### Feature-Rich/Integrated (Ant Design)
- **Philosophy**: Subcomponent with advanced features
- **Approach**: Part of Input component family
- **Visibility Toggle**: Built-in with click/hover modes
- **Strength Meter**: Not built-in, Form validation instead
- **Audience**: Enterprise applications
- **Distribution**: npm package with ConfigProvider

### Flexible/Extensible (Mantine)
- **Philosophy**: Input extension with comprehensive API
- **Approach**: Inherits from Input component
- **Visibility Toggle**: Built-in with custom icons
- **Strength Meter**: Composable with Progress/Popover
- **Audience**: Modern React applications
- **Distribution**: npm package with Styles API

### Validation-Focused (PrimeReact)
- **Philosophy**: Password-specific with built-in validation
- **Approach**: Standalone component with strength meter
- **Visibility Toggle**: Built-in with toggle mask alternative
- **Strength Meter**: Automatic calculation, popup feedback
- **Audience**: Form-heavy applications
- **Distribution**: npm package with PrimeReact suite

## Use Case Consensus

All frameworks emphasize these password input use cases:
1. **Login forms** - User authentication
2. **Registration forms** - Account creation
3. **Password change** - Account settings
4. **Password reset** - Recovery flows
5. **Multi-step forms** - Wizard password steps
6. **Confirmation fields** - Password matching
7. **Admin panels** - Secure settings

## Key Differences

### Component Model
- **Dedicated Component**: Chakra, Mantine, PrimeReact
- **Subcomponent**: Ant Design (Input.Password)
- **Standard Input**: ShadCN (type="password")

### Visibility Toggle
- **Always Built-in**: Chakra, Mantine, PrimeReact, Ant Design
- **Community Pattern**: ShadCN

### Activation Mode
- **Click Only**: ShadCN, Chakra, Mantine, PrimeReact
- **Click or Hover**: Ant Design (configurable)

### Strength Meter
- **Built-in**: PrimeReact
- **Companion Component**: Chakra UI
- **Composable**: Mantine
- **Not Provided**: ShadCN, Ant Design

### Size Options
- **3 sizes**: ShadCN (CSS), Ant Design
- **4 sizes**: Chakra UI
- **5 sizes**: Mantine

### State Management
- **Controlled + Uncontrolled**: ShadCN, Chakra, Ant Design, Mantine
- **Controlled Only**: PrimeReact

### Styling Approach
- **Tailwind**: ShadCN
- **CSS-in-JS**: Chakra UI
- **Theme System**: Ant Design, PrimeReact
- **Styles API**: Mantine

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Chakra UI](./chakra-ui/usage-patterns.md)
- [Ant Design](./ant-design/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)

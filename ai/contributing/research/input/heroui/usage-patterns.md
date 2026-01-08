# HeroUI Input - Usage Patterns

## Component Overview

The HeroUI Input component is a flexible text input element designed for capturing user text in forms, search fields, and other interactive scenarios. Built on native HTML input with React integration, it provides a rich set of configuration options for sizing, theming, validation, and visual customization while maintaining full accessibility compliance.

**Key Purpose**: Provide a reusable, themeable text input component that handles single-line text entry with built-in support for validation, icons, labels, and error messaging.

**Framework Context**: HeroUI (formerly NextUI) is a modern React component library built on Tailwind CSS with a focus on beautiful design and developer experience.

---

## Basic Usage

### Minimal Input

```jsx
import { Input } from "@heroui/react";

export default function BasicInput() {
  return <Input placeholder="Enter text..." />;
}
```

### Controlled Input (Recommended for Forms)

```jsx
import { useState } from "react";
import { Input } from "@heroui/react";

export default function ControlledInput() {
  const [value, setValue] = useState("");

  return (
    <Input
      value={value}
      onValueChange={setValue}
      placeholder="Type something..."
    />
  );
}
```

### Uncontrolled Input (With Initial Value)

```jsx
import { Input } from "@heroui/react";

export default function UncontrolledInput() {
  return (
    <Input
      defaultValue="Initial text"
      placeholder="Edit this text..."
    />
  );
}
```

---

## Props/API

### State & Value Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value (use with `onValueChange`) |
| `defaultValue` | `string` | — | Uncontrolled initial value |
| `placeholder` | `string` | — | Placeholder text shown when input is empty |
| `isDisabled` | `boolean` | `false` | Prevents user interaction |
| `isReadOnly` | `boolean` | `false` | Allows viewing but not editing |
| `isClearable` | `boolean` | `false` | Shows clear button to reset value |

### Validation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isRequired` | `boolean` | `false` | Marks field as required, shows asterisk in label |
| `isInvalid` | `boolean` | `false` | Applies invalid state styling |
| `minLength` | `number` | — | Minimum character requirement |
| `maxLength` | `number` | — | Maximum character limit |
| `pattern` | `string` | — | Regex pattern for validation |
| `validate` | `(value: string) => ValidationError \| true \| null` | — | Custom validation function |
| `validationBehavior` | `"native" \| "aria"` | `"native"` | HTML5 or ARIA-based validation |
| `errorMessage` | `ReactNode \| ((value) => ReactNode)` | — | Error message display |

### Appearance Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"flat" \| "bordered" \| "faded" \| "underlined"` | `"flat"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Component size |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | Color scheme |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | — | Border radius |
| `fullWidth` | `boolean` | `true` | Spans full container width |
| `disableAnimation` | `boolean` | `false` | Removes transitions and animations |

### Label Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label text or element |
| `labelPlacement` | `"inside" \| "outside" \| "outside-left" \| "outside-top"` | `"inside"` | Label position relative to input |

### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startContent` | `ReactNode` | — | Content rendered before input text (left side) |
| `endContent` | `ReactNode` | — | Content rendered after input text (right side) |
| `type` | `"text" \| "email" \| "url" \| "password" \| "tel" \| "search" \| "file"` | `"text"` | HTML input type |
| `description` | `ReactNode` | — | Helper text below input |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `classNames` | `Partial<Record<slot>>` | — | Custom CSS classes per slot |
| `baseRef` | `RefObject<HTMLDivElement>` | — | Ref to wrapper element |

### Event Props

| Prop | Type | Description |
|------|------|-------------|
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | Fired on input change (native event) |
| `onValueChange` | `(value: string) => void` | Fired on input change (value string) |
| `onClear` | `() => void` | Fired when clear button is clicked |
| `onFocus` | `(e: React.FocusEvent<HTMLInputElement>) => void` | Fired on focus |
| `onBlur` | `(e: React.FocusEvent<HTMLInputElement>) => void` | Fired on blur |

---

## Common Patterns

### Pattern 1: Email Input with Validation

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function EmailInput() {
  const [email, setEmail] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setIsInvalid(value !== "" && !validateEmail(value));
  };

  return (
    <Input
      type="email"
      label="Email"
      placeholder="Enter your email"
      value={email}
      onValueChange={handleEmailChange}
      isInvalid={isInvalid}
      errorMessage={isInvalid ? "Please enter a valid email" : ""}
      startContent={<EmailIcon />}
    />
  );
}
```

### Pattern 2: Password Input with Toggle Visibility

```jsx
import { Input, Button } from "@heroui/react";
import { useState } from "react";

export default function PasswordInput() {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label="Password"
      placeholder="Enter your password"
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      type={isVisible ? "text" : "password"}
      value={password}
      onValueChange={setPassword}
    />
  );
}
```

### Pattern 3: Search Input with Clear Button

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function SearchInput() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Input
      placeholder="Search..."
      value={searchValue}
      onValueChange={setSearchValue}
      isClearable
      onClear={() => setSearchValue("")}
      startContent={<SearchIcon />}
    />
  );
}
```

### Pattern 4: Phone Number Input with Format

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function PhoneInput() {
  const [phone, setPhone] = useState("");

  const formatPhoneNumber = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (value) => {
    setPhone(formatPhoneNumber(value));
  };

  return (
    <Input
      type="tel"
      label="Phone Number"
      placeholder="(555) 123-4567"
      value={phone}
      onValueChange={handlePhoneChange}
      startContent={<PhoneIcon />}
      maxLength={14}
    />
  );
}
```

### Pattern 5: Form Integration with React Hook Form

```jsx
import { Input } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";

export default function FormWithInput() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      email: ""
    }
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="username"
        control={control}
        rules={{ required: "Username is required", minLength: 3 }}
        render={({ field }) => (
          <Input
            {...field}
            label="Username"
            placeholder="Choose a username"
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: "Email is required", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            label="Email"
            placeholder="Enter your email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 6: Number Input with Min/Max Constraints

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function NumberInput() {
  const [number, setNumber] = useState("");

  const validateNumber = (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return "Must be a number";
    if (num < 0) return "Must be positive";
    if (num > 100) return "Must be 100 or less";
    return true;
  };

  return (
    <Input
      type="number"
      label="Score"
      placeholder="Enter score (0-100)"
      value={number}
      onValueChange={setNumber}
      validate={validateNumber}
      validationBehavior="aria"
      min={0}
      max={100}
    />
  );
}
```

---

## Visual Variations

### Variant Styles

HeroUI Input provides 4 visual style variants:

**1. Flat Variant (Default)**
```jsx
<Input variant="flat" label="Flat Input" />
```
- Solid background with light styling
- Best for standard forms
- Most commonly used

**2. Bordered Variant**
```jsx
<Input variant="bordered" label="Bordered Input" />
```
- Clear border outline
- Good for minimal designs
- Higher visual distinction

**3. Faded Variant**
```jsx
<Input variant="faded" label="Faded Input" />
```
- Subtle background with border
- Balanced appearance
- Works well in dense forms

**4. Underlined Variant**
```jsx
<Input variant="underlined" label="Underlined Input" />
```
- Minimal style with bottom border only
- Material Design inspired
- Best for compact layouts

### Color Schemes

HeroUI Input supports semantic color variants:

```jsx
<Input color="default" label="Default" />    {/* Neutral gray */}
<Input color="primary" label="Primary" />    {/* Brand color */}
<Input color="secondary" label="Secondary" /> {/* Secondary brand */}
<Input color="success" label="Success" />    {/* Green - positive state */}
<Input color="warning" label="Warning" />    {/* Orange - caution */}
<Input color="danger" label="Error" />       {/* Red - error state */}
```

**Color + Variant Combination**
```jsx
<Input
  variant="bordered"
  color="primary"
  label="Bordered Primary Input"
/>
```

### Border Radius Options

```jsx
<Input radius="none" label="No radius" />      {/* Sharp corners */}
<Input radius="sm" label="Small radius" />     {/* 4px */}
<Input radius="md" label="Medium radius" />    {/* 8px */}
<Input radius="lg" label="Large radius" />     {/* 12px */}
<Input radius="full" label="Full radius" />    {/* Pill-shaped */}
```

---

## Size Patterns

### Three-Size System

HeroUI Input implements a t-shirt sizing system:

**Small (sm)**
```jsx
<Input size="sm" label="Small Input" />
```
- Compact height (~36px)
- Reduced padding and font size
- Best for dense layouts or mobile

**Medium (md) - Default**
```jsx
<Input size="md" label="Medium Input" />
```
- Standard height (~44px)
- Default padding and font size
- Recommended for most use cases

**Large (lg)**
```jsx
<Input size="lg" label="Large Input" />
```
- Spacious height (~52px)
- Increased padding and font size
- Better for accessibility, touch targets

### Responsive Sizing

```jsx
// Custom implementation for responsive sizes
import { useMediaQuery } from "@heroui/react";

export default function ResponsiveInput() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Input
      size={isMobile ? "sm" : "md"}
      label="Responsive Input"
    />
  );
}
```

### Full Width Control

```jsx
{/* Default: fullWidth={true} */}
<Input label="Full Width Input" />  {/* Spans 100% of container */}

{/* Fixed width container */}
<div className="w-64">
  <Input fullWidth={false} label="Fixed Width Input" />
</div>

{/* Inline with other elements */}
<div className="flex gap-2">
  <Input fullWidth={false} className="flex-1" label="Flexible" />
  <button>Submit</button>
</div>
```

---

## States

### Disabled State

```jsx
import { Input } from "@heroui/react";

export default function DisabledInput() {
  return (
    <>
      <Input
        isDisabled
        label="Disabled Input"
        placeholder="Cannot interact"
        defaultValue="Locked value"
      />
      {/* Visual feedback: */}
      {/* - Reduced opacity (0.5) */}
      {/* - cursor: not-allowed */}
      {/* - No interactions allowed */}
      {/* - Value cannot be changed */}
    </>
  );
}
```

**Use Cases:**
- Form fields awaiting parent state
- Locked fields after submission
- Conditional field disabling based on other inputs

### Read-Only State

```jsx
import { Input } from "@heroui/react";

export default function ReadOnlyInput() {
  return (
    <>
      <Input
        isReadOnly
        label="Read-Only Input"
        value="Cannot be edited"
      />
      {/* Difference from disabled: */}
      {/* - Still selectable and copyable */}
      {/* - Can receive focus */}
      {/* - Better for displaying computed/derived values */}
    </>
  );
}
```

**Use Cases:**
- Display computed values (totals, sums)
- Show system-generated IDs
- Reference fields user cannot modify

### Invalid State

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function InvalidInput() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && value.length < 3;

  return (
    <Input
      value={value}
      onValueChange={setValue}
      onBlur={() => setTouched(true)}
      isInvalid={isInvalid}
      label="Username"
      placeholder="Minimum 3 characters"
      errorMessage={isInvalid ? "Username must be at least 3 characters" : ""}
    />
  );
}
```

**Visual Indicators:**
- Red/danger color border
- Error message displayed below
- Red text for label and helper text

### Focused State

```jsx
{/* Automatically managed */}
<Input
  label="Focused"
  onFocus={() => console.log("Focused")}
  onBlur={() => console.log("Blurred")}
/>

{/* Data attributes for styling */}
{/* data-focus, data-focus-visible applied by component */}
```

**Focus Ring Styling:**
- Applied only on keyboard navigation (`:focus-visible`)
- Skipped on mouse click (`:focus:not(:focus-visible)`)
- Customizable via CSS overrides

---

## Validation Patterns

### Built-in HTML5 Validation

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function HTMLValidation() {
  const [errors, setErrors] = useState({});

  const validateForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Browser validates based on type, pattern, required attributes
  };

  return (
    <form onSubmit={validateForm}>
      <Input
        type="email"
        name="email"
        label="Email"
        isRequired
        validationBehavior="native"
      />
      <Input
        type="url"
        name="website"
        label="Website"
        validationBehavior="native"
      />
      <Input
        name="username"
        label="Username"
        minLength={3}
        maxLength={20}
        isRequired
      />
      <button type="submit">Validate</button>
    </form>
  );
}
```

### Custom Validation Function

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function CustomValidation() {
  const [username, setUsername] = useState("");

  // Reserved usernames to avoid
  const reservedNames = ["admin", "root", "system", "guest"];

  const validateUsername = (value) => {
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value.length > 20) {
      return "Username must be at most 20 characters";
    }
    if (reservedNames.includes(value.toLowerCase())) {
      return "This username is reserved";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }
    return true; // Valid
  };

  return (
    <Input
      value={username}
      onValueChange={setUsername}
      validate={validateUsername}
      validationBehavior="aria"
      label="Username"
      description="3-20 characters, alphanumeric and _ - only"
    />
  );
}
```

### Async Validation Pattern

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function AsyncValidation() {
  const [email, setEmail] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const checkEmailAvailability = async (value) => {
    if (!value.includes("@")) return "Invalid email format";

    setIsValidating(true);
    try {
      const response = await fetch(`/api/check-email?email=${value}`);
      const { available } = await response.json();

      if (!available) {
        setError("Email already registered");
        return "Email already registered";
      }
      setError("");
      return true;
    } catch (err) {
      setError("Unable to verify email");
      return "Unable to verify email";
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Input
      type="email"
      value={email}
      onValueChange={setEmail}
      onBlur={() => checkEmailAvailability(email)}
      label="Email"
      isInvalid={!!error}
      errorMessage={error}
      description={isValidating ? "Checking availability..." : ""}
    />
  );
}
```

### Multi-Field Validation

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function PasswordMatch() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = password && confirmPassword === password;

  return (
    <>
      <Input
        type="password"
        label="Password"
        value={password}
        onValueChange={setPassword}
        isRequired
      />
      <Input
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onValueChange={setConfirmPassword}
        isInvalid={confirmPassword !== "" && !passwordsMatch}
        errorMessage={!passwordsMatch && confirmPassword ? "Passwords do not match" : ""}
        isRequired
      />
    </>
  );
}
```

---

## Label & Placeholder Patterns

### Label Placement Options

**Inside Placement (Default)**
```jsx
<Input
  label="Inside Label"
  placeholder="Placeholder text"
  labelPlacement="inside"
/>
```
- Label appears as floating label
- Floats above when focused/filled
- Material Design pattern

**Outside Placement**
```jsx
<Input
  label="Outside Label"
  placeholder="Placeholder text"
  labelPlacement="outside"
/>
```
- Label displayed above input
- Always visible
- Traditional form layout

**Outside-Left Placement**
```jsx
<Input
  label="Label"
  placeholder="Placeholder text"
  labelPlacement="outside-left"
/>
```
- Label positioned to the left
- Best for narrow forms
- Horizontal layouts

**Outside-Top Placement**
```jsx
<Input
  label="Label"
  placeholder="Placeholder text"
  labelPlacement="outside-top"
/>
```
- Explicit label above input
- Clear visual hierarchy
- Accessible by default

### Required Field Indicator

```jsx
<Input
  label="Email"
  isRequired
  placeholder="Enter your email"
/>
```
**Visual Feedback:**
- Red asterisk (*) appended to label
- Indicates field must be filled
- Combined with validation on submit

### Helper Text (Description)

```jsx
<Input
  label="Password"
  description="Must be at least 8 characters with uppercase, lowercase, and numbers"
  placeholder="Create a strong password"
/>
```

**Features:**
- Shown below input
- Always visible (not error-related)
- Guides user on requirements
- Different color from error messages

### Label Customization

```jsx
import { Input } from "@heroui/react";

export default function CustomLabel() {
  return (
    <Input
      label={
        <div className="flex items-center gap-1">
          <span>Username</span>
          <span className="text-sm text-default-400">(optional)</span>
        </div>
      }
      placeholder="Enter username"
    />
  );
}
```

---

## Prefix & Suffix Patterns

### Icons as Prefix (startContent)

```jsx
import { Input } from "@heroui/react";
import { SearchIcon, MailIcon, LockIcon } from "heroui-icons";

export default function PrefixIcons() {
  return (
    <>
      <Input
        placeholder="Search..."
        startContent={<SearchIcon />}
      />
      <Input
        type="email"
        placeholder="your@email.com"
        startContent={<MailIcon />}
      />
      <Input
        type="password"
        placeholder="Password"
        startContent={<LockIcon />}
      />
    </>
  );
}
```

### Icons as Suffix (endContent)

```jsx
import { Input } from "@heroui/react";
import { CloseIcon, CopyIcon, CheckIcon } from "heroui-icons";

export default function SuffixIcons() {
  return (
    <>
      {/* Clear button as suffix */}
      <Input
        isClearable
        placeholder="Type to search"
      />

      {/* Copy icon */}
      <Input
        readOnly
        value="token-abc-123-def-456"
        endContent={
          <button
            onClick={() => navigator.clipboard.writeText("token-abc-123-def-456")}
          >
            <CopyIcon />
          </button>
        }
      />

      {/* Status indicator */}
      <Input
        value="processing"
        isReadOnly
        endContent={<CheckIcon className="text-success" />}
      />
    </>
  );
}
```

### Currency Input with Prefix

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function CurrencyInput() {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (value) => {
    // Remove non-numeric except decimal
    const numeric = value.replace(/[^\d.]/g, "");
    // Ensure only one decimal point
    const parts = numeric.split(".");
    const formatted = parts.length > 2
      ? parts[0] + "." + parts[1]
      : numeric;
    setAmount(formatted);
  };

  return (
    <Input
      type="text"
      label="Amount"
      placeholder="0.00"
      value={amount}
      onValueChange={handleAmountChange}
      startContent={
        <span className="text-default-400">$</span>
      }
      endContent={
        <span className="text-default-400">USD</span>
      }
    />
  );
}
```

### Unit Suffix Pattern

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function UnitInput() {
  const [value, setValue] = useState("");

  return (
    <>
      <Input
        type="number"
        label="Distance"
        placeholder="0"
        value={value}
        onValueChange={setValue}
        endContent={
          <span className="text-default-400">km</span>
        }
      />
      <Input
        type="number"
        label="Temperature"
        placeholder="0"
        endContent={
          <span className="text-default-400">°C</span>
        }
      />
      <Input
        type="number"
        label="Weight"
        placeholder="0"
        endContent={
          <span className="text-default-400">lbs</span>
        }
      />
    </>
  );
}
```

### Button as Suffix

```jsx
import { Input, Button } from "@heroui/react";
import { useState } from "react";

export default function InputWithButton() {
  const [search, setSearch] = useState("");

  return (
    <Input
      placeholder="Enter search term"
      value={search}
      onValueChange={setSearch}
      endContent={
        <Button
          isIconOnly
          variant="light"
          onClick={() => console.log("Search:", search)}
        >
          Search
        </Button>
      }
    />
  );
}
```

---

## Input Types

HeroUI Input supports standard HTML input types:

### Text Input (Default)
```jsx
<Input type="text" label="Text" />
```

### Email Input
```jsx
<Input
  type="email"
  label="Email"
  placeholder="user@example.com"
  validationBehavior="native"
/>
```

### Password Input
```jsx
import { useState } from "react";
import { Input } from "@heroui/react";

export default function PasswordInputType() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      type={isVisible ? "text" : "password"}
      label="Password"
      endContent={
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}
```

### URL Input
```jsx
<Input
  type="url"
  label="Website"
  placeholder="https://example.com"
  validationBehavior="native"
/>
```

### Telephone Input
```jsx
<Input
  type="tel"
  label="Phone"
  placeholder="(555) 123-4567"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
/>
```

### Search Input
```jsx
<Input
  type="search"
  placeholder="Search..."
  isClearable
/>
```

### File Input
```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function FileInput() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0]);
  };

  return (
    <Input
      type="file"
      label="Upload Document"
      onChange={handleFileChange}
      accept=".pdf,.doc,.docx"
    />
  );
}
```

---

## Accessibility

### ARIA Attributes

HeroUI Input automatically applies accessibility attributes:

```jsx
import { Input } from "@heroui/react";

export default function AccessibleInput() {
  return (
    <>
      {/* Automatic: role="textbox", aria-label derived from label */}
      <Input label="Username" />

      {/* Explicit label via htmlFor/id */}
      <label htmlFor="email-input">Email Address</label>
      <Input id="email-input" placeholder="user@example.com" />

      {/* Error association via aria-describedby */}
      <Input
        aria-describedby="password-error"
        isInvalid
        errorMessage="Password too short"
      />

      {/* Description text linking */}
      <Input
        label="Password"
        description="Minimum 8 characters"
        aria-describedby="password-help"
      />
    </>
  );
}
```

### Keyboard Navigation

```jsx
{/* Automatically supported: */}
{/* - Tab: Focus input */}
{/* - Shift+Tab: Focus previous element */}
{/* - Standard text editing (Arrow keys, Ctrl+A, etc.) */}
{/* - Clear button (if isClearable) accessed via Tab + Enter */}
```

### Screen Reader Support

**Required for proper announcements:**

```jsx
{/* Method 1: Label (recommended) */}
<Input label="Full Name" placeholder="Enter your name" />
{/* Announces: "Full Name, input, edit text" */}

{/* Method 2: aria-label */}
<Input aria-label="Full Name" placeholder="Enter your name" />

{/* Method 3: Associated label element */}
<label htmlFor="fullname">Full Name</label>
<Input id="fullname" placeholder="Enter your name" />

{/* With error messages */}
<Input
  label="Password"
  type="password"
  isInvalid
  errorMessage="Password does not meet requirements"
/>
{/* Announces state: "Password, input, invalid, Password does not meet requirements" */}
```

### Touch Target Size

```jsx
{/* Default sizes meet minimum 44x44px touch target */}
<Input size="sm" />  {/* ~36px - May need larger on mobile */}
<Input size="md" />  {/* ~44px - Minimum recommended */}
<Input size="lg" />  {/* ~52px - Optimal accessibility */}
```

### Color Contrast

```jsx
{/* Built-in high contrast for readability */}
<Input color="default" />  {/* Sufficient contrast in light/dark modes */}
<Input label="Required Field" isRequired /> {/* Red asterisk has sufficient contrast */}
<Input isInvalid /> {/* Error state styling maintains 4.5:1 contrast ratio */}
```

### Animation Preference

```jsx
import { Input } from "@heroui/react";

export default function AccessibleAnimations() {
  return (
    <>
      {/* Respects prefers-reduced-motion */}
      <Input label="Animated (respects preferences)" />

      {/* Explicit animation disable */}
      <Input disableAnimation label="No animations" />
    </>
  );
}
```

---

## Integration Patterns

### Formik Integration

```jsx
import { Input } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(8).required("Password is required"),
});

export default function FormikForm() {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => console.log(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        label="Email"
        name="email"
        type="email"
        value={formik.values.email}
        onValueChange={(value) => formik.setFieldValue("email", value)}
        onBlur={formik.handleBlur}
        isInvalid={formik.touched.email && !!formik.errors.email}
        errorMessage={formik.errors.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formik.values.password}
        onValueChange={(value) => formik.setFieldValue("password", value)}
        isInvalid={formik.touched.password && !!formik.errors.password}
        errorMessage={formik.errors.password}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### React Hook Form Integration

```jsx
import { Input } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";

export default function RHFForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="username"
        control={control}
        rules={{ required: "Username required" }}
        render={({ field }) => (
          <Input
            {...field}
            label="Username"
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: "Email required" }}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            label="Email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Data Binding Pattern

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function DataBinding() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Input
        label="First Name"
        value={formData.firstName}
        onValueChange={(value) => handleChange("firstName", value)}
      />
      <Input
        label="Last Name"
        value={formData.lastName}
        onValueChange={(value) => handleChange("lastName", value)}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onValueChange={(value) => handleChange("email", value)}
      />
    </>
  );
}
```

---

## Advanced Patterns

### Debounced Input for Search

```jsx
import { Input } from "@heroui/react";
import { useState, useEffect } from "react";

export default function DebouncedSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (debouncedValue) {
      // Perform search with debouncedValue
      console.log("Searching:", debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Input
      placeholder="Search products..."
      value={searchValue}
      onValueChange={setSearchValue}
      isClearable
      onClear={() => {
        setSearchValue("");
        setDebouncedValue("");
        setResults([]);
      }}
    />
  );
}
```

### Input with Character Counter

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function CounterInput() {
  const [value, setValue] = useState("");
  const maxLength = 100;
  const remaining = maxLength - value.length;

  return (
    <Input
      value={value}
      onValueChange={setValue}
      maxLength={maxLength}
      label="Bio"
      placeholder="Tell us about yourself"
      description={`${value.length}/${maxLength} characters`}
      isInvalid={remaining < 10}
    />
  );
}
```

### Masked Input Pattern

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function MaskedInput() {
  const [creditCard, setCreditCard] = useState("");

  const formatCreditCard = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits
      .slice(0, 16)
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  return (
    <Input
      type="text"
      label="Credit Card"
      placeholder="1234 5678 9012 3456"
      value={creditCard}
      onValueChange={(value) => setCreditCard(formatCreditCard(value))}
      maxLength={19}
      description="Format: 1234 5678 9012 3456"
    />
  );
}
```

### Dependent Inputs Pattern

```jsx
import { Input } from "@heroui/react";
import { useState } from "react";

export default function DependentInputs() {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const isStateVisible = country === "US" || country === "CA";
  const isCityVisible = !!country;

  return (
    <>
      <Input
        label="Country"
        value={country}
        onValueChange={setCountry}
        placeholder="Select country"
      />

      {isStateVisible && (
        <Input
          label="State"
          value={state}
          onValueChange={setState}
          placeholder="Select state"
          isDisabled={!country}
        />
      )}

      {isCityVisible && (
        <Input
          label="City"
          value={city}
          onValueChange={setCity}
          placeholder="Enter city"
          isDisabled={!country}
        />
      )}
    </>
  );
}
```

### Multi-Input Validation

```jsx
import { Input, Button } from "@heroui/react";
import { useState } from "react";

export default function MultiInputForm() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});

  const errors = {
    email: inputs.email && !inputs.email.includes("@") ? "Invalid email" : null,
    password: inputs.password && inputs.password.length < 8 ? "Min 8 chars" : null,
    confirmPassword: inputs.password && inputs.confirmPassword !== inputs.password ? "Passwords don't match" : null,
  };

  const isFormValid = inputs.email && inputs.password === inputs.confirmPassword && Object.values(errors).every(e => !e);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (isFormValid) console.log(inputs); }}>
      <Input
        type="email"
        label="Email"
        value={inputs.email}
        onValueChange={(email) => setInputs(prev => ({ ...prev, email }))}
        onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
        isInvalid={touched.email && !!errors.email}
        errorMessage={errors.email}
      />
      <Input
        type="password"
        label="Password"
        value={inputs.password}
        onValueChange={(password) => setInputs(prev => ({ ...prev, password }))}
        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
        isInvalid={touched.password && !!errors.password}
        errorMessage={errors.password}
      />
      <Input
        type="password"
        label="Confirm Password"
        value={inputs.confirmPassword}
        onValueChange={(confirmPassword) => setInputs(prev => ({ ...prev, confirmPassword }))}
        onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
      />
      <Button disabled={!isFormValid} type="submit">Register</Button>
    </form>
  );
}
```

---

## Data Attributes

HeroUI Input automatically applies data attributes for styling based on state:

```jsx
{/* Applied automatically based on component state */}
<Input data-invalid={isInvalid} />     {/* Present when isInvalid={true} */}
<Input data-required={isRequired} />   {/* Present when isRequired={true} */}
<Input data-readonly={isReadOnly} />   {/* Present when isReadOnly={true} */}
<Input data-disabled={isDisabled} />   {/* Present when isDisabled={true} */}
<Input data-hover />                   {/* Applied on hover */}
<Input data-focus />                   {/* Applied on focus */}
<Input data-focus-visible />           {/* Applied on keyboard focus */}
```

**CSS Styling with Data Attributes:**
```css
/* Style invalid state */
input[data-invalid] {
  border-color: #f31260;
}

/* Style disabled state */
input[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Style read-only state */
input[data-readonly] {
  background-color: #f5f5f5;
}

/* Hover effects */
input[data-hover]:not([data-disabled]) {
  border-color: #333;
}

/* Focus styling */
input[data-focus]:not([data-disabled]) {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}
```

---

## Styling & Customization

### CSS Class Overrides via classNames Prop

```jsx
import { Input } from "@heroui/react";

export default function CustomStyled() {
  return (
    <Input
      label="Custom Styled"
      classNames={{
        base: "custom-input-base",
        label: "text-blue-500 font-bold",
        input: "text-lg",
        inputWrapper: "bg-blue-50",
        innerWrapper: "px-4",
        clearButton: "text-red-500",
        helperWrapper: "hidden",
        description: "text-sm",
        errorMessage: "text-red-600 font-bold",
      }}
    />
  );
}
```

### Tailwind CSS Customization

```jsx
import { Input } from "@heroui/react";

export default function TailwindCustomized() {
  return (
    <Input
      label="Tailwind Styled"
      classNames={{
        base: "px-2 py-4",
        label: "text-red-500",
        input: "focus:outline-blue-500 focus:ring-2",
        inputWrapper: "shadow-md border-2 border-gray-300",
      }}
      placeholder="Custom Tailwind styles"
    />
  );
}
```

### Variant-Specific Styling

```jsx
import { Input } from "@heroui/react";

export default function VariantStyles() {
  return (
    <>
      {/* Flat variant customization */}
      <Input
        variant="flat"
        label="Flat Input"
        classNames={{
          inputWrapper: "bg-gradient-to-r from-blue-50 to-purple-50",
        }}
      />

      {/* Bordered variant with custom border */}
      <Input
        variant="bordered"
        label="Bordered Input"
        classNames={{
          inputWrapper: "border-2 border-blue-300",
        }}
      />

      {/* Underlined variant with custom underline */}
      <Input
        variant="underlined"
        label="Underlined Input"
        classNames={{
          inputWrapper: "border-b-4 border-purple-500",
        }}
      />
    </>
  );
}
```

### useInput Hook for Custom Implementation

```jsx
import { useInput } from "@heroui/react";
import { useRef } from "react";

export default function CustomInputComponent() {
  const inputRef = useRef(null);
  const {
    label,
    value,
    isInvalid,
    isRequired,
    validationErrors,
    baseRef,
    isDisabled,
    isClearable,
    handleChange,
    handleClear,
  } = useInput({
    defaultValue: "",
    onValueChange: (val) => console.log("Value:", val),
    type: "text",
    isRequired: true,
  });

  return (
    <div ref={baseRef}>
      <label>{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
      />
      {isClearable && <button onClick={handleClear}>Clear</button>}
      {isInvalid && <span>{validationErrors}</span>}
    </div>
  );
}
```

---

## Notes

### Important Observations

1. **onValueChange vs onChange**
   - `onValueChange` receives the string value directly (preferred)
   - `onChange` receives the React SyntheticEvent
   - Use `onValueChange` for cleaner code

2. **Label Placement Recommendation**
   - `inside` (default) - Modern, floating label pattern
   - `outside` - Traditional, always-visible labels
   - `outside-left` - For horizontal/narrow forms
   - Choose based on form layout and space constraints

3. **Validation Behavior**
   - `native` - Browser's built-in validation (default)
   - `aria` - Custom validation via ARIA attributes
   - Use `native` for standard HTML5 constraints
   - Use `aria` for custom validation functions

4. **Size Selection Best Practices**
   - `sm` - Dense layouts, data tables, sidebar forms
   - `md` (default) - Most common, balanced
   - `lg` - Accessibility-focused, mobile-friendly, prominent forms

5. **Error Message Display**
   - Pass string directly: `errorMessage="Invalid email"`
   - Or function for dynamic: `errorMessage={(value) => validate(value)}`
   - Automatically linked via `aria-describedby`

6. **Clear Button Behavior**
   - `isClearable={true}` shows X button
   - Clicking triggers `onClear` callback
   - Manual clearing: `onClear={() => setValue("")}`

7. **Accessibility by Default**
   - Built-in ARIA labels and descriptions
   - Keyboard navigation automatically supported
   - Focus visible styling respects user preferences
   - Screen reader friendly with proper announcements

8. **Performance Considerations**
   - Use `onValueChange` instead of `onChange` for better performance
   - Debounce search inputs to reduce API calls
   - Use `validationBehavior="aria"` for expensive async validation

9. **Form Integration Priority**
   - React Hook Form - Recommended for complex forms
   - Formik - Good alternative with simpler API
   - Native HTML forms - Works well for simple cases
   - All three approaches supported seamlessly

10. **CSS Custom Properties**
    - HeroUI uses Tailwind CSS internally
    - Limited CSS variable exposure compared to other libraries
    - Customization primarily via `classNames` prop
    - Consider `useInput` hook for advanced styling needs

### Common Gotchas

1. **Required Validation**
   - `isRequired` shows asterisk but doesn't enforce validation
   - Add validation logic for actual constraint
   - Combine with `validationBehavior` for enforcement

2. **Password Visibility Toggle**
   - Default `type="password"` doesn't include toggle button
   - Must implement manually with custom button in `endContent`
   - Consider accessibility when implementing

3. **File Inputs**
   - Limited customization compared to text inputs
   - State management for file selection requires special handling
   - Consider third-party file upload components for advanced needs

4. **Controlled vs Uncontrolled**
   - Don't mix: use either `value` or `defaultValue`, not both
   - Controlled inputs require `onValueChange` handler
   - Can't switch from uncontrolled to controlled mid-render

5. **Label Association**
   - Labels with `inside` placement don't create native `<label>` element
   - For screen readers, either use `label` prop or external `<label>` with `htmlFor`
   - Test with actual screen reader for verification

---

## Framework Comparison Context

### HeroUI Position in Market

**Strengths:**
- Rich variant system (4 variants + 6 colors + 5 radius options)
- Built on Tailwind CSS (familiar to React developers)
- NextUI heritage (stable, battle-tested)
- Comprehensive size system (sm/md/lg)
- Strong form integration support

**Differences from Similar Libraries:**

| Aspect | HeroUI | Material-UI | Chakra UI | Mantine |
|--------|--------|------------|-----------|---------|
| Styling Base | Tailwind CSS | Emotion | Emotion | CSS-in-JS |
| Label Placement Options | 4 options | 1 (top) | 1 (top) | 2 options |
| Size Variants | 3 (sm/md/lg) | 3 (small/medium/large) | 3 (sm/md/lg) | 5 (xs/sm/md/lg/xl) |
| Color System | 6 colors | Material Design palette | Semantic colors | Theme colors |
| Clearable Support | Built-in | No | No | No |
| Custom Validation | Yes | Yes | Yes | Yes |
| Form Integration | Excellent | Good | Good | Excellent |

### When to Choose HeroUI Input

**Ideal for:**
- React projects already using Tailwind CSS
- Developers who prefer utility-first styling
- Projects needing multiple variant options
- Teams familiar with NextUI/HeroUI ecosystem
- Applications requiring strong form integration

**Less ideal for:**
- Non-React frameworks (Vue, Angular)
- Projects with complex custom styling needs beyond Tailwind
- Teams preferring CSS-in-JS over utility classes
- Minimal bundle size as primary concern


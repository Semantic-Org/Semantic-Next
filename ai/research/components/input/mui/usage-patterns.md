# MUI (Material-UI) - TextField Usage Patterns

## Component URL
https://mui.com/material-ui/react-text-field/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/text-field/
Version: Current (v5+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, code examples, validation patterns, and accessibility guidance.

---

## 1. Component Overview

The MUI TextField component is a Material Design implementation of a text input control with built-in label support, validation, error states, and adornments. It combines multiple Material-UI components (FormControl, InputLabel, OutlinedInput/FilledInput/Input, FormHelperText) into a single convenient component, providing a cohesive input experience with consistent styling, animations, and accessibility features. The component supports extensive customization through theming, the sx prop, and component composition patterns.

### Key Characteristics
- **Unified Input Component**: Combines FormControl, InputLabel, Input variant, and FormHelperText
- **Multiple Variants**: Outlined (default), Filled, and Standard (Legacy) styles
- **Built-in Validation**: Error state, helper text, and validation messaging
- **Label Management**: Animated labels that float above input on focus/fill
- **Adornment Support**: InputAdornment for prefix/suffix elements
- **Full Control**: Can be used controlled or uncontrolled
- **Material Design Compliance**: Follows Material Design 3 specifications

---

## 2. Basic Usage

### Import
```jsx
import TextField from '@mui/material/TextField';
// or
import { TextField } from '@mui/material';
```

### Simple Text Input
```jsx
<TextField />
```

### With Label
```jsx
<TextField label="First Name" />
```

### With Placeholder
```jsx
<TextField label="Email" placeholder="you@example.com" />
```

### With Default Value
```jsx
<TextField label="Username" defaultValue="john_doe" />
```

### Controlled Input
```jsx
import React, { useState } from 'react';

function ControlledTextField() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <TextField
      label="Email"
      value={value}
      onChange={handleChange}
    />
  );
}
```

### Uncontrolled Input
```jsx
<TextField label="Name" defaultValue="John" />
```

---

## 3. Props/API

### Core TextField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| ReactNode` | - | The label text displayed in or above the input |
| `value` | `string \| number` | - | The value of the input element (controlled component) |
| `defaultValue` | `string \| number` | - | The default value (uncontrolled component) |
| `onChange` | `function` | - | Callback fired when the input value changes |
| `placeholder` | `string` | - | The placeholder text displayed when empty |
| `error` | `boolean` | `false` | If `true`, the input and label appear in error state |
| `helperText` | `string \| ReactNode` | - | Helper text displayed below the input |
| `type` | `string` | `'text'` | Type of the input element (text, password, number, email, etc.) |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | The variant of the text field |
| `size` | `'small' \| 'medium'` | `'medium'` | The size of the text field |
| `disabled` | `boolean` | `false` | If `true`, the input is disabled |
| `required` | `boolean` | `false` | If `true`, the input is marked as required |
| `multiline` | `boolean` | `false` | If `true`, renders as a textarea |
| `rows` | `number` | `1` | Number of rows for multiline input |
| `maxRows` | `number` | - | Maximum number of rows for multiline textarea |
| `minRows` | `number` | - | Minimum number of rows for multiline textarea |
| `autoFocus` | `boolean` | `false` | If `true`, the input is focused on mount |
| `autoComplete` | `string` | - | HTML autocomplete attribute value |
| `fullWidth` | `boolean` | `false` | If `true`, the input takes up full width of parent |
| `name` | `string` | - | Name attribute of the input element |
| `id` | `string` | - | The id of the input element |
| `inputProps` | `object` | - | Attributes applied to the input element |
| `InputProps` | `object` | - | Props applied to the Input component |
| `InputLabelProps` | `object` | - | Props applied to the InputLabel component |
| `FormHelperTextProps` | `object` | - | Props applied to the FormHelperText component |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning'` | `'primary'` | The color of the field |
| `focused` | `boolean` | - | If `true`, the input is focused |
| `select` | `boolean` | `false` | If `true`, renders as a select input |
| `margin` | `'none' \| 'dense' \| 'normal'` | `'none'` | Margin size of the field |
| `sx` | `object \| function` | - | System prop for custom styling |
| `classes` | `object` | - | Override or extend component styles |

### Input Type Variations

TextField supports all HTML input types:

| Type | Example | Use Case |
|------|---------|----------|
| `'text'` | `<TextField type="text" />` | General text input (default) |
| `'email'` | `<TextField type="email" />` | Email address input |
| `'password'` | `<TextField type="password" />` | Secure password input |
| `'number'` | `<TextField type="number" />` | Numeric input with spinner |
| `'tel'` | `<TextField type="tel" />` | Telephone number |
| `'url'` | `<TextField type="url" />` | URL/web address |
| `'search'` | `<TextField type="search" />` | Search query |
| `'date'` | `<TextField type="date" />` | Date picker |
| `'time'` | `<TextField type="time" />` | Time picker |
| `'datetime-local'` | `<TextField type="datetime-local" />` | Date and time picker |
| `'month'` | `<TextField type="month" />` | Month selector |
| `'week'` | `<TextField type="week" />` | Week selector |
| `'color'` | `<TextField type="color" />` | Color picker |

---

## 4. Visual Variants

### Outlined Variant (Recommended, Default)
```jsx
<TextField label="Outlined" variant="outlined" />
```

**Characteristics**:
- Border around the input
- Label floats above on focus/fill
- Recommended by Material Design 3
- Best for form layouts
- Clearest visual hierarchy

### Filled Variant
```jsx
<TextField label="Filled" variant="filled" />
```

**Characteristics**:
- Background color fill
- Border only at bottom
- Label floats above on focus/fill
- Works well in dense layouts
- Legacy Material Design style

### Standard Variant (Legacy)
```jsx
<TextField label="Standard" variant="standard" />
```

**Characteristics**:
- Border only at bottom
- Minimal visual footprint
- Label floats above on focus/fill
- Legacy Material Design v1 style
- Use sparingly in new designs

### Side-by-Side Comparison
```jsx
function VariantComparison() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField label="Outlined" variant="outlined" />
      <TextField label="Filled" variant="filled" />
      <TextField label="Standard" variant="standard" />
    </Box>
  );
}
```

---

## 5. Size Variants

### Medium Size (Default)
```jsx
<TextField label="Medium" size="medium" />
```

### Small Size
```jsx
<TextField label="Small" size="small" />
```

**Use Cases**:
- Compact layouts
- Form tables
- Inline editing
- Dense lists
- Sidebar forms

### Responsive Sizing
```jsx
<TextField
  label="Responsive Size"
  size={{ xs: 'small', md: 'medium' }}
/>
```

### Custom Size with sx Prop
```jsx
<TextField
  label="Custom Size"
  sx={{
    '& .MuiInputBase-root': {
      height: 56,
    },
    '& .MuiInputBase-input': {
      padding: '16px 12px',
    },
  }}
/>
```

---

## 6. States

### Disabled State
```jsx
<TextField label="Disabled" disabled />

<TextField
  label="Disabled with value"
  defaultValue="Cannot edit"
  disabled
/>
```

### Focused State
```jsx
<TextField label="Focused" focused />
```

### Error State
```jsx
<TextField
  label="Password"
  type="password"
  error
  helperText="Password is too short"
/>
```

### Loading/Processing State
```jsx
function LoadingField() {
  const [loading, setLoading] = useState(false);

  return (
    <TextField
      label="Search"
      disabled={loading}
      InputProps={{
        endAdornment: (
          loading && <CircularProgress size={20} />
        ),
      }}
    />
  );
}
```

### Read-Only State
```jsx
<TextField
  label="Read-only"
  defaultValue="Cannot change"
  inputProps={{ readOnly: true }}
/>
```

---

## 7. Validation Patterns

### Simple Required Validation
```jsx
<TextField label="Email" required />
```

### Email Validation
```jsx
import React, { useState } from 'react';

function EmailValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError(true);
      setHelperText('Please enter a valid email address');
    } else {
      setError(false);
      setHelperText('');
    }
  };

  return (
    <TextField
      label="Email"
      value={email}
      onChange={handleChange}
      error={error}
      helperText={helperText}
    />
  );
}
```

### Password Strength Validation
```jsx
function PasswordField() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const handleChange = (event) => {
    const pwd = event.target.value;
    setPassword(pwd);

    if (pwd.length < 6) setStrength('weak');
    else if (pwd.length < 12) setStrength('medium');
    else setStrength('strong');
  };

  const getColor = () => {
    switch (strength) {
      case 'weak': return 'error';
      case 'medium': return 'warning';
      case 'strong': return 'success';
      default: return 'primary';
    }
  };

  return (
    <>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handleChange}
        color={getColor()}
      />
      {strength && (
        <Typography variant="caption" color={getColor()}>
          Password strength: {strength}
        </Typography>
      )}
    </>
  );
}
```

### Min/Max Length Validation
```jsx
function LengthValidation() {
  const [value, setValue] = useState('');
  const minLength = 5;
  const maxLength = 20;
  const isError = value.length > 0 && (value.length < minLength || value.length > maxLength);

  return (
    <TextField
      label="Username"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={isError}
      helperText={
        isError
          ? `Must be between ${minLength} and ${maxLength} characters`
          : `${value.length}/${maxLength}`
      }
      inputProps={{ minLength, maxLength }}
    />
  );
}
```

### Form Validation Integration (React Hook Form)
```jsx
import { Controller, useForm } from 'react-hook-form';

function FormValidation() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
    </form>
  );
}
```

---

## 8. Label & Placeholder Patterns

### Label Positioning
```jsx
// Label above (default, floats on focus/fill)
<TextField label="Standard label" />

// No label
<TextField placeholder="Just placeholder" />

// Label with required indicator
<TextField label="Email" required />
```

### Placeholder vs Label
```jsx
// ✅ Good: Use label for description
<TextField label="Email Address" placeholder="you@example.com" />

// ❌ Avoid: Placeholder instead of label (accessibility issue)
<TextField placeholder="Email Address" />

// ✅ Good: Placeholder for example/hint
<TextField label="Phone" placeholder="+1 (555) 000-0000" />
```

### Custom Label Content
```jsx
import { InputLabel, TextField } from '@mui/material';

<TextField
  InputLabelProps={{
    required: true,
    sx: {
      '&.Mui-required': {
        color: 'error.main',
      },
    },
  }}
  label="Custom Label"
/>
```

### Persistent Label
```jsx
<TextField
  label="Label"
  InputLabelProps={{
    shrink: true, // Always float the label
  }}
/>
```

---

## 9. Prefix & Suffix Patterns with InputAdornment

### Import InputAdornment
```jsx
import { TextField, InputAdornment } from '@mui/material';
```

### Suffix Icon
```jsx
import { Search as SearchIcon } from '@mui/icons-material';

<TextField
  label="Search"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>
```

### Prefix Icon
```jsx
import { Email as EmailIcon } from '@mui/icons-material';

<TextField
  label="Email"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <EmailIcon />
      </InputAdornment>
    ),
  }}
/>
/>
```

### Prefix Text (Currency, Unit)
```jsx
<TextField
  label="Amount"
  type="number"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">$</InputAdornment>
    ),
  }}
/>

<TextField
  label="Height"
  type="number"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">cm</InputAdornment>
    ),
  }}
/>
```

### Suffix Button
```jsx
import { Button } from '@mui/material';

function PasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label="Password"
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="text"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}
```

### Clear Button
```jsx
import { IconButton, Clear as ClearIcon } from '@mui/material';

function ClearableTextField() {
  const [value, setValue] = useState('');

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        endAdornment: (
          value && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setValue('')}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        ),
      }}
    />
  );
}
```

### Loading Indicator
```jsx
import { CircularProgress } from '@mui/material';

function SearchWithLoading() {
  const [loading, setLoading] = useState(false);

  return (
    <TextField
      label="Search"
      InputProps={{
        endAdornment: (
          loading && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          )
        ),
      }}
    />
  );
}
```

### Combined Prefix and Suffix
```jsx
<TextField
  label="URL"
  defaultValue="example"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">https://</InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">.com</InputAdornment>
    ),
  }}
/>
```

---

## 10. Multiline & Textarea Patterns

### Simple Multiline
```jsx
<TextField
  label="Comments"
  multiline
  rows={4}
/>
```

### Auto-Expanding Textarea
```jsx
<TextField
  label="Description"
  multiline
  minRows={3}
  maxRows={10}
/>
```

### Full Example
```jsx
function MultilineExample() {
  const [value, setValue] = useState('');

  return (
    <TextField
      label="Message"
      multiline
      minRows={4}
      maxRows={10}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText={`${value.length} characters`}
    />
  );
}
```

---

## 11. Input Types

### Email Input
```jsx
<TextField
  label="Email"
  type="email"
  inputProps={{ 'aria-label': 'email' }}
/>
```

### Password Input
```jsx
<TextField
  label="Password"
  type="password"
/>
```

### Number Input
```jsx
<TextField
  label="Age"
  type="number"
  inputProps={{ min: 0, max: 120 }}
/>
```

### Date Input
```jsx
<TextField
  label="Birthday"
  type="date"
  InputLabelProps={{ shrink: true }}
/>
```

### Search Input
```jsx
<TextField
  label="Search"
  type="search"
  placeholder="Enter search term"
/>
```

### URL Input
```jsx
<TextField
  label="Website"
  type="url"
  placeholder="https://example.com"
/>
```

---

## 12. Accessibility

### ARIA Labels
```jsx
// Using label prop (preferred)
<TextField label="Email" />

// Using inputProps for additional description
<TextField
  label="Email"
  inputProps={{
    'aria-label': 'email address',
    'aria-describedby': 'email-helper-text',
  }}
  helperText="We'll never share your email"
  FormHelperTextProps={{ id: 'email-helper-text' }}
/>
```

### Required Fields
```jsx
<TextField
  label="Name"
  required
  inputProps={{ 'aria-required': true }}
/>
```

### Error Announcements
```jsx
<TextField
  label="Password"
  type="password"
  error={passwordError}
  helperText="Password must be at least 8 characters"
  FormHelperTextProps={{
    id: 'password-error',
    role: 'alert',
  }}
  inputProps={{
    'aria-invalid': passwordError,
    'aria-describedby': 'password-error',
  }}
/>
```

### Keyboard Navigation
TextField provides full keyboard navigation automatically:
- **Tab**: Focus the input
- **Shift+Tab**: Move to previous element
- **Enter**: Submit form (if in form context)
- **Standard editing keys**: Work normally

### Best Practices
```jsx
// ✅ Good: Always provide labels
<TextField label="Your Name" />

// ✅ Good: Use helperText for validation messages
<TextField
  label="Email"
  error={hasError}
  helperText="Please enter a valid email"
/>

// ✅ Good: Mark required fields visually
<TextField label="Required Field" required />

// ❌ Avoid: Placeholder-only input (no permanent label)
<TextField placeholder="Name" />

// ❌ Avoid: Using title attribute instead of label
<TextField title="Name" />
```

---

## 13. Integration Patterns

### Form Integration
```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="message"
        label="Message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Send
      </Button>
    </form>
  );
}
```

### With Formik
```jsx
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

function LoginForm() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        fullWidth
        margin="normal"
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth>
        Sign In
      </Button>
    </form>
  );
}
```

### With React Hook Form
```jsx
import { Controller, useForm } from 'react-hook-form';

function SearchForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="search"
        control={control}
        rules={{ required: 'Search term is required' }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Search"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
```

---

## 14. Advanced Patterns

### Character Count
```jsx
function CharCountField() {
  const [value, setValue] = useState('');
  const maxLength = 100;

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
      label="Description"
      multiline
      rows={4}
      fullWidth
      inputProps={{ maxLength }}
      helperText={`${value.length}/${maxLength}`}
    />
  );
}
```

### Debounced Input
```jsx
import { useEffect, useState } from 'react';

function DebouncedSearch() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      // Perform search or API call here
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <TextField
      label="Search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
```

### Input Mask/Format
```jsx
import { TextField, InputAdornment } from '@mui/material';

function PhoneField() {
  const [value, setValue] = useState('');

  const formatPhone = (input) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  return (
    <TextField
      label="Phone"
      value={formatPhone(value)}
      onChange={(e) => setValue(e.target.value)}
      placeholder="(555) 000-0000"
    />
  );
}
```

### Suggestions/Autocomplete Field
```jsx
import { Autocomplete, TextField } from '@mui/material';

const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

function AutocompleteField() {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} label="Fruit" />}
    />
  );
}
```

### Real-time Validation
```jsx
function RealTimeValidation() {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(null);

  const validateEmail = (value) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValid);
  };

  return (
    <TextField
      label="Email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
      }}
      error={emailValid === false}
      helperText={
        emailValid === false ? 'Invalid email' : emailValid ? 'Valid email' : ''
      }
      focused={emailValid === true}
    />
  );
}
```

---

## 15. Styling & Theming

### Using the sx Prop
```jsx
<TextField
  label="Custom Styled"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      '& fieldset': {
        borderColor: 'primary.main',
      },
      '&:hover fieldset': {
        borderColor: 'primary.dark',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'secondary.main',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 14px',
    },
  }}
/>
```

### Custom Input Colors
```jsx
<TextField
  label="Custom Color"
  color="secondary"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1976d2',
      },
    },
  }}
/>
```

### Using Styled Components
```jsx
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: theme.transitions.create(['border-color']),
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
    },
  },
}));

// Usage
<StyledTextField label="Styled Input" />
```

### Theme Customization
```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TextField label="Themed Input" />
    </ThemeProvider>
  );
}
```

### CSS Classes
```jsx
<TextField
  label="Custom Classes"
  classes={{
    root: 'custom-text-field',
  }}
  sx={{
    '&.custom-text-field .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
    },
  }}
/>
```

---

## 16. Margin & Spacing

### Margin Options
```jsx
// No margin (default)
<TextField label="No Margin" margin="none" />

// Dense margin (smaller spacing)
<TextField label="Dense" margin="dense" />

// Normal margin
<TextField label="Normal" margin="normal" />
```

### Full Width
```jsx
<TextField label="Full Width" fullWidth />
```

### Custom Spacing with sx
```jsx
<TextField
  label="Custom Spacing"
  sx={{
    mb: 2,      // margin-bottom
    mt: 1,      // margin-top
    px: 2,      // padding horizontal
  }}
/>
```

---

## 17. Common Use Cases

### Login Form
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleLogin = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      return;
    }
    // Handle login
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', py: 4 }}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        helperText={emailError ? 'Invalid email' : ''}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        sx={{ mt: 3 }}
      >
        Sign In
      </Button>
    </Box>
  );
}
```

### Search Bar
```jsx
import { Search as SearchIcon } from '@mui/icons-material';

function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // Perform search
  };

  return (
    <TextField
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
```

### Inline Editing
```jsx
function EditableCell() {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('Initial Value');

  return editing ? (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => setEditing(false)}
      autoFocus
      size="small"
    />
  ) : (
    <Box onClick={() => setEditing(true)}>
      {value}
    </Box>
  );
}
```

### Filter/Search with Results
```jsx
function FilterInput() {
  const [filter, setFilter] = useState('');
  const [results, setResults] = useState([]);

  const handleFilterChange = (value) => {
    setFilter(value);
    // Filter results
  };

  return (
    <Box>
      <TextField
        label="Filter"
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
        fullWidth
      />
      <Box sx={{ mt: 2 }}>
        {results.map((result, i) => (
          <Typography key={i}>{result}</Typography>
        ))}
      </Box>
    </Box>
  );
}
```

---

## 18. Notes

### Component Composition
- TextField is a **convenience component** combining FormControl, InputLabel, OutlinedInput/FilledInput/Input, and FormHelperText
- For advanced use cases, you can use these components directly for more granular control
- The component handles label animation and state management automatically

### Performance Considerations
- Avoid re-creating InputAdornment components unnecessarily
- Use stable callbacks (useCallback) in onChange handlers for large lists
- Consider memoizing TextField if it has expensive parent renders

### Browser Compatibility
- All input types have good browser support
- Native date/time pickers may vary by browser (consider third-party libraries for consistency)
- Password managers work with standard TextField inputs

### Material Design Alignment
- MUI TextField follows Material Design 3 specifications
- Outlined variant is the recommended default
- Label animations and error states conform to Material Design guidelines

### Common Patterns from MUI Documentation
1. Use `margin="normal"` for spacing in forms
2. Combine with Box and Stack for complex layouts
3. Use `fullWidth` when inside a constrained container
4. Prefer `size="small"` for dense layouts
5. Use InputAdornment for icons and text decorations

---

## Research Notes

- MUI TextField is a highly flexible, production-ready component with excellent documentation
- The component integrates seamlessly with form validation libraries (React Hook Form, Formik, etc.)
- Strong accessibility support with proper ARIA attributes
- Extensive customization options through sx prop and theme overrides
- Material Design 3 compliance ensures modern appearance and behavior
- Clear separation of concerns through proper composition of underlying components
- Well-tested in production with large community adoption
- Documentation includes practical examples for common use cases
- The component supports both controlled and uncontrolled usage patterns
- InputAdornment integration enables creative UI patterns while maintaining accessibility

---

## Notable Features

1. **Multiple Variants**: Outlined, Filled, and Standard provide different visual presentations for different design contexts

2. **Automatic Label Management**: Labels animate beautifully, shrink on focus/fill, and improve form usability automatically

3. **Integrated Validation**: Built-in error states and helperText provide a unified validation UX

4. **InputAdornment Flexibility**: Support for custom prefix/suffix elements enables rich input patterns (currency, units, actions)

5. **Full HTML Input Support**: All input types (email, password, number, date, etc.) are supported with proper handling

6. **Form Integration**: Works seamlessly with major form libraries and validation libraries

7. **Accessibility First**: Proper ARIA attributes, keyboard navigation, and screen reader support out of the box

8. **Theming Support**: Extensive customization through theme overrides for consistent application-wide styling

9. **Component Flexibility**: Can change root component type or customize spacing (margin, size)

10. **Multiline Support**: Auto-expanding textarea with min/max row control for flexible text areas

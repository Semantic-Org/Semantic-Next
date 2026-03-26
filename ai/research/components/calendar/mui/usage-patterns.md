# MUI X DatePicker - Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://mui.com/x/react-date-pickers/date-picker/
Status: ✅ Working
Version: MUI X v6+ (Current as of 2025-11-10)
Last Verified: 2025-11-10

## Documentation Quality
Excellent - Comprehensive API documentation with detailed property descriptions, interactive code examples, extensive customization options, and thorough coverage of localization, validation, and timezone handling.

## Component Definition
- **Core purpose**: Provides a comprehensive date selection interface with support for keyboard input, calendar popup, multiple date library adapters (Day.js, date-fns, Luxon, Moment), and extensive customization options for desktop and mobile experiences.
- **Mental model**: A semantic date input control that combines a text field for keyboard entry with a calendar popup for visual selection, supporting responsive behavior that adapts between desktop and mobile interfaces.
- **Semantic meaning**: Communicates date value, availability (disabled/read-only), validation status (error), and date constraints (min/max dates, disabled dates) through visual and structural patterns.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value`, `onChange`, `minDate`, `maxDate`, `disabled`, `views`, `format`)
- **Composed**: Via slots and slotProps (e.g., custom TextField, ActionBar, arrow icons)
- **Adapter-based**: Requires date library adapter (Day.js, date-fns, Luxon, Moment.js)

---

## Component Overview

The MUI X DatePicker is a sophisticated date selection component that provides:
- Multiple date library adapters (Day.js, date-fns, Luxon, Moment.js)
- Controlled and uncontrolled modes
- Responsive behavior (automatically switches between desktop and mobile)
- Multiple views (day, month, year)
- Comprehensive validation (min/max dates, disabled dates, custom validators)
- Keyboard and calendar input methods
- Extensive customization through slots and slotProps
- Timezone support (with compatible adapters)
- Localization for international date formats
- Desktop, Mobile, and Static variants

---

## Basic Usage

### Simple DatePicker with Day.js
```jsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BasicDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Select date" />
    </LocalizationProvider>
  );
}
```

### Date Library Adapters
```jsx
// Day.js (Recommended - smallest bundle size)
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker />
</LocalizationProvider>

// date-fns v2.x
import { AdapterDateFnsV2 } from '@mui/x-date-pickers/AdapterDateFnsV2';
<LocalizationProvider dateAdapter={AdapterDateFnsV2}>
  <DatePicker />
</LocalizationProvider>

// date-fns v3.x/v4.x
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker />
</LocalizationProvider>

// Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
<LocalizationProvider dateAdapter={AdapterLuxon}>
  <DatePicker />
</LocalizationProvider>

// Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
<LocalizationProvider dateAdapter={AdapterMoment}>
  <DatePicker />
</LocalizationProvider>
```

---

## Props/API

### Core Value Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `TDate \| null` | - | The selected date (controlled) |
| `defaultValue` | `TDate \| null` | - | Default selected date (uncontrolled) |
| `onChange` | `(value: TDate \| null, context: FieldChangeHandlerContext) => void` | - | Callback when date changes |
| `format` | `string` | Adapter default | Date format string (e.g., 'MM/DD/YYYY') |
| `formatDensity` | `'dense' \| 'spacious'` | `'dense'` | Adds spacing around separators when 'spacious' |

### View Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `views` | `Array<'day' \| 'month' \| 'year'>` | `['day', 'year']` | Array of views to show |
| `openTo` | `'day' \| 'month' \| 'year'` | `'day'` | View to open to initially |

### Validation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minDate` | `TDate` | - | Minimum selectable date |
| `maxDate` | `TDate` | - | Maximum selectable date |
| `disablePast` | `boolean` | `false` | Disable dates before today |
| `disableFuture` | `boolean` | `false` | Disable dates after today |
| `shouldDisableDate` | `(day: TDate) => boolean` | - | Custom function to disable specific dates |
| `shouldDisableMonth` | `(month: TDate) => boolean` | - | Custom function to disable specific months |
| `shouldDisableYear` | `(year: TDate) => boolean` | - | Custom function to disable specific years |

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disables the picker |
| `readOnly` | `boolean` | `false` | Makes the picker read-only |
| `name` | `string` | - | Name attribute for form integration |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `closeOnSelect` | `boolean` | Desktop: `true`, Mobile: `false` | Close picker after date selection |
| `disableOpenPicker` | `boolean` | `false` | Disable opening the popup calendar |
| `autoFocus` | `boolean` | `false` | Auto-focus the field on mount |

### Responsive Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `desktopModeMediaQuery` | `string` | `'@media (pointer: fine)'` | Media query to determine desktop mode |

### Localization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timezone` | `string` | System timezone | Timezone for date representation (Day.js, Luxon, Moment only) |

### Slots

| Slot | Default | Description |
|------|---------|-------------|
| `textField` | `TextField` | Form control to render the value |
| `field` | Adapter-specific | Component for keyboard input |
| `actionBar` | `PickersActionBar` | Action bar at bottom of popup |
| `leftArrowIcon` | `ArrowLeft` | Icon for previous month button |
| `rightArrowIcon` | `ArrowRight` | Icon for next month button |
| `previousIconButton` | `IconButton` | Button for previous month |
| `nextIconButton` | `IconButton` | Button for next month |

### SlotProps

| SlotProp | Type | Description |
|----------|------|-------------|
| `textField` | `object` | Props passed to TextField component |
| `field` | `object` | Props passed to field component (e.g., `clearable`, `size`) |
| `actionBar` | `object` | Props passed to ActionBar (e.g., `actions: ['clear', 'today']`) |

---

## Content Patterns

### Pattern Category 1: Date Input Methods

#### Keyboard Input with Calendar Popup
```jsx
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker label="Enter or select date" />
</LocalizationProvider>
```

#### Calendar-Only Input (Disabled Keyboard)
```jsx
<DatePicker
  label="Calendar only"
  disableOpenPicker={false}
  slotProps={{
    textField: {
      inputProps: { readOnly: true }
    }
  }}
/>
```

#### Keyboard-Only Input (No Calendar)
```jsx
<DatePicker
  label="Keyboard only"
  disableOpenPicker={true}
/>
```

---

### Pattern Category 2: Custom Date Formats

#### Standard Format Strings
```jsx
// US Format
<DatePicker
  label="MM/DD/YYYY"
  format="MM/DD/YYYY"
/>

// European Format
<DatePicker
  label="DD/MM/YYYY"
  format="DD/MM/YYYY"
/>

// ISO Format
<DatePicker
  label="YYYY-MM-DD"
  format="YYYY-MM-DD"
/>

// Long Format
<DatePicker
  label="MMMM DD, YYYY"
  format="MMMM DD, YYYY"
/>
```

#### Format with Spacious Density
```jsx
<DatePicker
  label="With spacing"
  format="MM/DD/YYYY"
  formatDensity="spacious"
/>
// Result: "11 / 10 / 2025" instead of "11/10/2025"
```

---

### Pattern Category 3: Calendar Popup Variations

#### Standard Desktop Calendar
```jsx
<DatePicker label="Desktop calendar" />
// Opens calendar popup on click (desktop)
```

#### Mobile-Optimized Calendar
```jsx
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

<MobileDatePicker label="Mobile calendar" />
// Opens fullscreen modal on mobile devices
```

#### Static Calendar (Always Visible)
```jsx
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

<StaticDatePicker
  defaultValue={dayjs()}
/>
// No input field, calendar always displayed
```

#### Responsive Calendar (Auto-detects)
```jsx
<DatePicker
  label="Responsive"
  desktopModeMediaQuery="@media (pointer: fine)"
/>
// Automatically switches between desktop and mobile based on media query
```

---

### Pattern Category 4: Time Selection Integration

#### Date and Time Combined
```jsx
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

<DateTimePicker
  label="Date & Time"
/>
```

#### Date with Separate Time
```jsx
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

<>
  <DatePicker label="Date" />
  <TimePicker label="Time" />
</>
```

---

## Type Patterns

### Pattern Category 5: Single Date Selection

#### Controlled Single Date
```jsx
import { useState } from 'react';
import dayjs from 'dayjs';

const [value, setValue] = useState(dayjs());

<DatePicker
  label="Controlled picker"
  value={value}
  onChange={(newValue) => setValue(newValue)}
/>
```

#### Uncontrolled Single Date
```jsx
<DatePicker
  label="Uncontrolled picker"
  defaultValue={dayjs('2025-11-10')}
/>
```

---

### Pattern Category 6: Date Range Selection

#### Single Input Date Range
```jsx
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

<DateRangePicker
  slots={{ field: SingleInputDateRangeField }}
  label="Date range"
/>
```

#### Multi-Input Date Range
```jsx
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

<DateRangePicker
  slots={{ field: MultiInputDateRangeField }}
  slotProps={{ textField: { InputProps: { label: ['From', 'To'] } } }}
/>
```

---

### Pattern Category 7: View-Specific Pickers

#### Month Picker Only
```jsx
<DatePicker
  label="Month"
  views={['month', 'year']}
  openTo="month"
/>
```

#### Year Picker Only
```jsx
<DatePicker
  label="Year"
  views={['year']}
  openTo="year"
/>
```

#### Month and Year (No Day)
```jsx
<DatePicker
  label="Month & Year"
  views={['month', 'year']}
  openTo="month"
  format="MM/YYYY"
/>
```

#### Day, Month, and Year (All Views)
```jsx
<DatePicker
  label="Full date"
  views={['year', 'month', 'day']}
/>
```

---

### Pattern Category 8: Quarter and Week Pickers

#### Quarter Picker
```jsx
// Requires custom implementation with views configuration
<DatePicker
  label="Quarter"
  views={['month']}
  shouldDisableMonth={(month) => {
    const monthNum = month.month();
    return monthNum % 3 !== 0; // Only Q1, Q2, Q3, Q4 months
  }}
/>
```

#### Week Picker
```jsx
// Requires custom field implementation
// MUI X doesn't have built-in week picker, needs customization
```

---

## State Patterns

### Pattern Category 9: Disabled State

#### Fully Disabled Picker
```jsx
<DatePicker
  label="Disabled"
  disabled
/>
```

#### Disabled with Value
```jsx
<DatePicker
  label="Disabled with value"
  value={dayjs('2025-11-10')}
  disabled
/>
```

---

### Pattern Category 10: Read-Only State

#### Read-Only Picker
```jsx
<DatePicker
  label="Read-only"
  value={dayjs('2025-11-10')}
  readOnly
/>
```

---

### Pattern Category 11: Error State

#### Error State from Validation
```jsx
const [error, setError] = useState(null);

<DatePicker
  label="With error"
  value={value}
  onChange={(newValue) => {
    setValue(newValue);
    setError(null);
  }}
  onError={(newError) => setError(newError)}
  slotProps={{
    textField: {
      error: !!error,
      helperText: error
    }
  }}
/>
```

#### Manual Error State
```jsx
<DatePicker
  label="Invalid date"
  slotProps={{
    textField: {
      error: true,
      helperText: "Date is required"
    }
  }}
/>
```

---

### Pattern Category 12: Loading State

#### Loading Indicator
```jsx
// Custom implementation using slotProps
<DatePicker
  label="Loading dates..."
  disabled={isLoading}
  slotProps={{
    textField: {
      InputProps: {
        endAdornment: isLoading ? <CircularProgress size={20} /> : null
      }
    }
  }}
/>
```

---

## Variation Patterns

### Pattern Category 13: Size Variants

#### Small Picker
```jsx
<DatePicker
  label="Small"
  slotProps={{
    textField: { size: 'small' }
  }}
/>
```

#### Medium Picker (Default)
```jsx
<DatePicker
  label="Medium"
  slotProps={{
    textField: { size: 'medium' }
  }}
/>
```

Note: MUI DatePicker supports 'small' and 'medium' sizes only (no 'large').

---

### Pattern Category 14: Date Restrictions

#### Disable Past Dates
```jsx
<DatePicker
  label="Future dates only"
  disablePast
/>
```

#### Disable Future Dates
```jsx
<DatePicker
  label="Past dates only"
  disableFuture
/>
```

#### Min and Max Date Range
```jsx
<DatePicker
  label="Limited range"
  minDate={dayjs('2025-01-01')}
  maxDate={dayjs('2025-12-31')}
/>
```

#### Custom Date Disabling
```jsx
// Disable weekends
<DatePicker
  label="Weekdays only"
  shouldDisableDate={(date) => {
    const day = date.day();
    return day === 0 || day === 6; // Sunday or Saturday
  }}
/>

// Disable specific dates
<DatePicker
  label="No holidays"
  shouldDisableDate={(date) => {
    const holidays = ['2025-12-25', '2025-01-01'];
    return holidays.includes(date.format('YYYY-MM-DD'));
  }}
/>
```

---

### Pattern Category 15: Locale and Internationalization

#### French Locale
```jsx
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
  <DatePicker label="Date" />
</LocalizationProvider>
```

#### German Locale
```jsx
import 'dayjs/locale/de';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
  <DatePicker label="Datum" />
</LocalizationProvider>
```

#### Spanish Locale
```jsx
import 'dayjs/locale/es';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
  <DatePicker label="Fecha" />
</LocalizationProvider>
```

#### With date-fns Locale
```jsx
import { de } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
  <DatePicker label="Datum" />
</LocalizationProvider>
```

---

### Pattern Category 16: Custom Rendering

#### Custom TextField Variant
```jsx
<DatePicker
  label="Filled variant"
  slotProps={{
    textField: { variant: 'filled' }
  }}
/>

<DatePicker
  label="Standard variant"
  slotProps={{
    textField: { variant: 'standard' }
  }}
/>

<DatePicker
  label="Outlined variant"
  slotProps={{
    textField: { variant: 'outlined' }
  }}
/>
```

#### Custom Action Bar
```jsx
<DatePicker
  label="With actions"
  slotProps={{
    actionBar: {
      actions: ['clear', 'today', 'cancel', 'accept']
    }
  }}
/>

// Clear only
<DatePicker
  label="Clear only"
  slotProps={{
    actionBar: {
      actions: ['clear']
    }
  }}
/>
```

#### Custom Arrow Icons
```jsx
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

<DatePicker
  label="Custom arrows"
  slots={{
    leftArrowIcon: ChevronLeft,
    rightArrowIcon: ChevronRight
  }}
/>
```

---

### Pattern Category 17: Presets and Shortcuts

#### Date Range with Shortcuts
```jsx
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const shortcuts = [
  { label: 'This Week', getValue: () => [dayjs().startOf('week'), dayjs().endOf('week')] },
  { label: 'Last Week', getValue: () => [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')] },
  { label: 'Last 7 Days', getValue: () => [dayjs().subtract(7, 'days'), dayjs()] },
  { label: 'Current Month', getValue: () => [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: 'Next Month', getValue: () => [dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month')] },
  { label: 'Reset', getValue: () => [null, null] }
];

<DateRangePicker
  slotProps={{
    shortcuts: {
      items: shortcuts
    }
  }}
/>
```

---

### Pattern Category 18: Timezone Handling

#### UTC Timezone
```jsx
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="UTC time"
    timezone="UTC"
  />
</LocalizationProvider>
```

#### Specific Timezone
```jsx
<DatePicker
  label="New York time"
  timezone="America/New_York"
/>

<DatePicker
  label="Tokyo time"
  timezone="Asia/Tokyo"
/>
```

#### System Timezone (Default)
```jsx
<DatePicker
  label="System timezone"
  timezone="system"
/>
```

Note: Timezone support requires Day.js, Luxon, or Moment.js adapter. Not supported with date-fns.

---

## Code Examples from Documentation

### Complete Working Example: Controlled DatePicker
```jsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ControlledDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2025-11-10'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
```

### Complete Working Example: Validation
```jsx
import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ValidationExample() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select date"
        minDate={dayjs('2025-01-01')}
        maxDate={dayjs('2025-12-31')}
        disablePast
        shouldDisableDate={(date) => {
          // Disable weekends
          const day = date.day();
          return day === 0 || day === 6;
        }}
      />
    </LocalizationProvider>
  );
}
```

### Complete Working Example: Custom Views
```jsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ViewsExample() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Month and Year"
        views={['month', 'year']}
        openTo="month"
        format="MM/YYYY"
      />
    </LocalizationProvider>
  );
}
```

### Complete Working Example: Form Integration
```jsx
import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Stack } from '@mui/material';

export default function FormExample() {
  const [birthDate, setBirthDate] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birthDate) {
      setError('Date is required');
      return;
    }
    console.log('Submitted:', birthDate.format('YYYY-MM-DD'));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <DatePicker
            label="Birth Date"
            value={birthDate}
            onChange={(newValue) => {
              setBirthDate(newValue);
              setError(null);
            }}
            disableFuture
            slotProps={{
              textField: {
                required: true,
                error: !!error,
                helperText: error,
                name: 'birthDate'
              }
            }}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}
```

### Complete Working Example: Clearable DatePicker
```jsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ClearableDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Clearable"
        slotProps={{
          field: { clearable: true }
        }}
      />
    </LocalizationProvider>
  );
}
```

---

## Notable Features

### 1. Multiple Date Library Support
MUI X DatePicker uniquely supports multiple date manipulation libraries through adapters:
- **Day.js** (Recommended - smallest bundle ~2kb)
- **date-fns** (Popular, functional approach)
- **Luxon** (Modern, immutable, timezone support)
- **Moment.js** (Legacy support)

### 2. Responsive by Default
The DatePicker component automatically detects device capabilities and switches between desktop (popup) and mobile (fullscreen modal) interfaces using media queries.

### 3. Comprehensive Validation
Built-in validation props cover most use cases:
- `minDate` / `maxDate` for range constraints
- `disablePast` / `disableFuture` for temporal constraints
- `shouldDisableDate` for custom validation logic
- Error propagation to parent forms

### 4. Advanced Customization
Extensive customization through the slots/slotProps pattern:
- Replace any internal component (TextField, ActionBar, Icons)
- Pass props to internal components without replacing them
- Customize keyboard shortcuts and action buttons

### 5. Timezone Support
Full timezone support with compatible adapters (Day.js, Luxon, Moment):
- Display dates in specific timezones
- Handle timezone conversions automatically
- Maintain timezone information in value state

### 6. Accessibility
Built-in accessibility features:
- Full keyboard navigation
- ARIA labels and roles
- Screen reader announcements
- Focus management

### 7. Professional Features (MUI X Pro)
Pro version includes:
- DateRangePicker with single or multi-input fields
- Keyboard shortcuts/presets
- Advanced field customization

---

## Research Notes

### Architecture Observations

1. **Adapter Pattern**: The use of date library adapters provides flexibility but requires careful setup. The LocalizationProvider must wrap all date pickers at the application root or component tree level.

2. **Slots System**: MUI's slots/slotProps pattern is more verbose than simple props but provides powerful customization without component composition complexity.

3. **Responsive Behavior**: The automatic desktop/mobile switching is convenient but can be overridden with specific components (DesktopDatePicker, MobileDatePicker) for explicit control.

4. **Validation Architecture**: Validation happens at multiple levels:
   - Prop-level (minDate, maxDate, disablePast, disableFuture)
   - Function-level (shouldDisableDate, shouldDisableMonth, shouldDisableYear)
   - Error callback (onError) for integration with form libraries

### Comparison to Other Libraries

**Strengths vs Ant Design:**
- More flexible with date library choice (not locked into moment/dayjs)
- Stronger TypeScript support
- Better timezone handling with compatible adapters
- More granular customization through slots

**Potential Challenges:**
- More verbose API (slotProps nesting)
- Requires date library adapter setup
- Timezone support not available with date-fns adapter
- Pro features require paid license

### Implementation Recommendations

1. **Choose Day.js adapter** for new projects (smallest bundle, timezone support)
2. **Use controlled components** for forms and state management
3. **Leverage slotProps** for TextField customization (size, variant, error states)
4. **Consider StaticDatePicker** for always-visible date selection interfaces
5. **Use validation props** instead of custom validation when possible
6. **Set up LocalizationProvider** at app root for consistent date handling
7. **Test responsive behavior** across devices or use explicit Desktop/Mobile variants

### Notable Patterns

- **Action Bar Customization**: Can show/hide clear, today, cancel, accept buttons via slotProps
- **View Configuration**: `views` and `openTo` props control which calendar views appear and which opens first
- **Format Density**: `formatDensity="spacious"` adds spacing around date separators for better readability
- **Clearable Field**: Must be configured via `slotProps.field.clearable` rather than top-level prop
- **Error Handling**: Errors are propagated through `onError` callback and can be displayed via `slotProps.textField.error` and `helperText`

### Date Library Adapter Considerations

| Adapter | Bundle Size | Timezone | Immutable | Notes |
|---------|-------------|----------|-----------|-------|
| Day.js | ~2kb | ✅ (with plugins) | ❌ | Recommended for new projects |
| date-fns | ~13kb | ❌ | ✅ (v3+) | Functional, tree-shakeable |
| Luxon | ~72kb | ✅ (native) | ✅ | Best timezone support |
| Moment.js | ~68kb | ✅ (with plugin) | ❌ | Legacy, avoid for new projects |

### Accessibility Features

- Full keyboard navigation (arrows, enter, escape, tab)
- ARIA labels automatically applied
- Screen reader announcements for date changes
- Focus management in calendar popups
- High contrast mode support
- Customizable labels via slotProps

---

## Summary

The MUI X DatePicker is a comprehensive, production-ready date selection component that excels in:
- **Flexibility**: Multiple date library adapters, extensive customization through slots
- **Developer Experience**: TypeScript support, comprehensive documentation, active maintenance
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader compatibility
- **Internationalization**: Locale support, timezone handling (with compatible adapters), format customization
- **Validation**: Built-in constraints (min/max, past/future) and custom validation functions
- **Responsive Design**: Automatic desktop/mobile adaptation or explicit control

Perfect for applications requiring robust, customizable date selection with strong TypeScript support and international requirements. The adapter pattern provides flexibility but requires initial setup. Consider the Pro version for date ranges and advanced features.

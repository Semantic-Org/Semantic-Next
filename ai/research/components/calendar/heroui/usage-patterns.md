# HeroUI - DatePicker Usage Patterns

## Component URL
https://www.heroui.com/docs/components/date-picker
Status: ✅ Working
Version: Current (HeroUI/NextUI v2.x)
Last Verified: 2025-11-10

## Documentation Quality
Excellent - comprehensive documentation with interactive demos, full API reference, extensive code examples, and real-world use cases. The documentation covers basic usage, advanced patterns, internationalization, timezone handling, and accessibility features. HeroUI (formerly NextUI) provides one of the most feature-complete date picker implementations in the React ecosystem.

---

## 1. Component Definition

### Core Purpose
Enable users to enter or select a date and time value by merging a DateInput field with a Calendar popover, providing both keyboard input and visual selection methods.

### Mental Model
A text input field with an embedded calendar button trigger. Clicking the button or focusing the input opens a calendar popover for visual date selection, while the input allows direct keyboard entry and navigation of date segments (month/day/year/time).

### Semantic Meaning
Represents a date/time input control that combines the precision of text entry with the discoverability and ease-of-use of visual calendar selection. Communicates temporal data collection intent with support for various granularities (day-only through second-precision datetime).

---

## 2. Content Patterns

### Date Input Methods

**Keyboard Input:**
- Direct text entry in localized format
- Tab/Arrow navigation between date segments (month/day/year)
- Increment/decrement segments with up/down arrows
- Automatic format validation

**Calendar Selection:**
- Visual date picking from calendar grid
- Month/year quick selection
- Multi-month view (1-3 months)
- Preset quick-select buttons

**Hybrid Approach:**
- Input field always visible for keyboard users
- Calendar button trigger for visual selection
- Both methods update the same underlying value

### Date Value Types

The component supports multiple date/time value types:

```typescript
// Calendar date (day precision, no time)
CalendarDate

// Calendar datetime (includes time)
CalendarDateTime

// Zoned datetime (includes timezone)
ZonedDateTime

// Null for no selection
null
```

### Calendar Popup Behavior

**Trigger Options:**
- Click selector button (calendar icon)
- Focus input field (configurable)
- Keyboard shortcut when input focused

**Popup Features:**
- Modal overlay with calendar grid
- Month/year navigation
- Optional month/year picker dropdowns
- Custom top/bottom content areas
- Configurable visible months (1-3)

**Positioning:**
- Controlled via popoverProps
- Auto-positioning relative to input
- Responsive to viewport boundaries

### Time Selection

**Granularity Levels:**
- `day` - Date only, no time component
- `hour` - Date with hour precision
- `minute` - Date with minute precision (most common for datetime)
- `second` - Date with second precision

**Time Input Features:**
- Inline time field when granularity includes time
- 12-hour or 24-hour format (hourCycle prop)
- Timezone display (toggleable)
- Leading zeros option
- Segment-based navigation

### Custom Format Support

**Localization:**
- Automatic format based on locale
- Locale-specific date separators
- Locale-specific time formats
- RTL support for appropriate locales

**Display Customization:**
- Custom placeholder value
- Custom selector icon
- Custom label positioning
- Custom description/error messages

---

## 3. Type Patterns

### Single Date Selection

**Basic Date Picker:**
```jsx
import { DatePicker } from "@heroui/react";

// Simple date selection
<DatePicker label="Event Date" />

// With default value
<DatePicker
  label="Birth Date"
  defaultValue={parseDate("2024-04-04")}
/>

// Controlled
const [date, setDate] = useState(parseDate("2024-01-01"));
<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
/>
```

### Date Range Selection

**Note:** HeroUI provides a separate `DateRangePicker` component for range selection. The standard `DatePicker` is for single dates only.

### DateTime Selection

**With Time Component:**
```jsx
import { DatePicker } from "@heroui/react";
import { parseDateTime } from "@internationalized/date";

// Date and time selection
<DatePicker
  label="Meeting Time"
  granularity="minute"
  defaultValue={parseDateTime("2024-04-04T12:30")}
/>

// With seconds
<DatePicker
  label="Precise Timestamp"
  granularity="second"
  defaultValue={parseDateTime("2024-04-04T12:30:45")}
/>
```

### Timezone-Aware DateTime

```jsx
import { parseZonedDateTime } from "@internationalized/date";

<DatePicker
  label="Conference Call"
  granularity="minute"
  defaultValue={parseZonedDateTime("2024-04-04T12:30[America/New_York]")}
/>

// Hide timezone display
<DatePicker
  label="Local Time"
  granularity="minute"
  hideTimeZone
  defaultValue={parseZonedDateTime("2024-04-04T12:30[America/New_York]")}
/>
```

### Month/Year Picker

```jsx
// Enable month and year quick selection
<DatePicker
  label="Select Month"
  showMonthAndYearPickers
/>
```

### Week Picker

**Note:** Week selection would need to be implemented through custom validation/selection logic. Not a built-in variant.

### Quarter Picker

**Note:** Quarter selection would need to be implemented through custom validation/selection logic. Not a built-in variant.

---

## 4. State Patterns

### Disabled State

```jsx
// Fully disabled
<DatePicker
  label="Birth Date"
  isDisabled
  defaultValue={parseDate("2024-01-01")}
/>
```

**Behavior:**
- Input field not focusable
- Calendar button inactive
- Visual disabled styling applied
- No interaction possible

### Read-Only State

```jsx
// Read-only (can focus, cannot edit)
<DatePicker
  label="Appointment Date"
  isReadOnly
  defaultValue={parseDate("2024-04-04")}
/>
```

**Behavior:**
- Input field focusable for reading
- Calendar button inactive
- No editing allowed
- Value can be read/copied

### Required State

```jsx
// Required field
<DatePicker
  label="Start Date"
  isRequired
/>
```

**Behavior:**
- Visual required indicator (typically asterisk)
- Form validation enforces value
- Error state if submitted empty

### Invalid/Error State

**Static Error:**
```jsx
<DatePicker
  label="Birth Date"
  isInvalid
  errorMessage="Please enter a valid birth date"
/>
```

**Dynamic Error:**
```jsx
<DatePicker
  label="Appointment"
  isInvalid={date && !isWeekend(date)}
  errorMessage={(value) => {
    if (value && isWeekend(value)) {
      return "Appointments are only available on weekdays";
    }
  }}
/>
```

### Loading State

**Note:** No built-in loading state. Would need to be implemented through custom UI or disabled state during async operations.

---

## 5. Variation Patterns

### Size Variants

```jsx
import { DatePicker } from "@heroui/react";

<div className="flex gap-4">
  <DatePicker size="sm" label="Small" />
  <DatePicker size="md" label="Medium" />
  <DatePicker size="lg" label="Large" />
</div>
```

**Supported Sizes:**
- `sm` - Compact size for dense layouts
- `md` - Default size (most common)
- `lg` - Larger size for emphasis or accessibility

### Visual Variants

```jsx
// Flat variant (default)
<DatePicker variant="flat" label="Flat" />

// Bordered variant
<DatePicker variant="bordered" label="Bordered" />

// Faded variant
<DatePicker variant="faded" label="Faded" />

// Underlined variant
<DatePicker variant="underlined" label="Underlined" />
```

**Variants:**
- `flat` - Subtle background, no border
- `bordered` - Clear border outline
- `faded` - Lighter background with border
- `underlined` - Bottom border only

### Color Variants

```jsx
<DatePicker color="default" label="Default" />
<DatePicker color="primary" label="Primary" />
<DatePicker color="secondary" label="Secondary" />
<DatePicker color="success" label="Success" />
<DatePicker color="warning" label="Warning" />
<DatePicker color="danger" label="Danger" />
```

### Radius Variants

```jsx
<DatePicker radius="none" label="No Radius" />
<DatePicker radius="sm" label="Small Radius" />
<DatePicker radius="md" label="Medium Radius" />
<DatePicker radius="lg" label="Large Radius" />
<DatePicker radius="full" label="Full Radius" />
```

### Label Placement

```jsx
// Inside the input
<DatePicker labelPlacement="inside" label="Event Date" />

// Outside above the input
<DatePicker labelPlacement="outside" label="Event Date" />

// Outside to the left
<DatePicker labelPlacement="outside-left" label="Event Date" />
```

### Date Restrictions

**Min/Max Dates:**
```jsx
import { today, getLocalTimeZone } from "@internationalized/date";

<DatePicker
  label="Appointment"
  minValue={today(getLocalTimeZone())}
  maxValue={today(getLocalTimeZone()).add({ weeks: 1 })}
/>
```

**Unavailable Dates:**
```jsx
<DatePicker
  label="Meeting Date"
  isDateUnavailable={(date) => {
    // Block weekends
    const day = date.toDate(getLocalTimeZone()).getDay();
    return day === 0 || day === 6;
  }}
/>
```

**Validation Function:**
```jsx
<DatePicker
  label="Future Date"
  validate={(value) => {
    if (!value) return "Date is required";
    if (value.compare(today(getLocalTimeZone())) < 0) {
      return "Date must be in the future";
    }
  }}
/>
```

### Locale Support

```jsx
import { I18nProvider } from "@react-aria/i18n";

// Hebrew calendar
<I18nProvider locale="he-IL-u-ca-hebrew">
  <DatePicker label="תאריך" />
</I18nProvider>

// Indian calendar
<I18nProvider locale="en-IN-u-ca-indian">
  <DatePicker label="Date" />
</I18nProvider>

// Islamic calendar
<I18nProvider locale="ar-SA-u-ca-islamic">
  <DatePicker label="التاريخ" />
</I18nProvider>

// Buddhist calendar
<I18nProvider locale="th-TH-u-ca-buddhist">
  <DatePicker label="วันที่" />
</I18nProvider>
```

### Custom Rendering

**Custom Selector Icon:**
```jsx
import { CalendarIcon } from "./icons";

<DatePicker
  label="Date"
  selectorIcon={<CalendarIcon />}
/>
```

**Selector Button Placement:**
```jsx
// Icon at start
<DatePicker selectorButtonPlacement="start" label="Date" />

// Icon at end (default)
<DatePicker selectorButtonPlacement="end" label="Date" />
```

**Custom Calendar Content:**
```jsx
import { Button, ButtonGroup } from "@heroui/react";

<DatePicker
  label="Select Date"
  CalendarTopContent={
    <ButtonGroup fullWidth>
      <Button onPress={() => setValue(today(getLocalTimeZone()))}>
        Today
      </Button>
    </ButtonGroup>
  }
  CalendarBottomContent={
    <ButtonGroup fullWidth>
      <Button onPress={() => setValue(today(getLocalTimeZone()).add({ weeks: 1 }))}>
        Next Week
      </Button>
      <Button onPress={() => setValue(today(getLocalTimeZone()).add({ months: 1 }))}>
        Next Month
      </Button>
    </ButtonGroup>
  }
/>
```

### Preset Selections

**Common Presets Implementation:**
```jsx
import { DatePicker, Button, ButtonGroup } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

function DatePickerWithPresets() {
  const [value, setValue] = useState(null);

  return (
    <DatePicker
      label="Appointment Date"
      value={value}
      onChange={setValue}
      CalendarTopContent={
        <ButtonGroup
          fullWidth
          className="px-3 pb-2 pt-3"
          size="sm"
        >
          <Button onPress={() => setValue(today(getLocalTimeZone()))}>
            Today
          </Button>
          <Button onPress={() => setValue(today(getLocalTimeZone()).add({ days: 1 }))}>
            Tomorrow
          </Button>
          <Button onPress={() => setValue(today(getLocalTimeZone()).add({ weeks: 1 }))}>
            Next Week
          </Button>
        </ButtonGroup>
      }
    />
  );
}
```

### Timezone Handling

**Explicit Timezone:**
```jsx
import { parseZonedDateTime } from "@internationalized/date";

<DatePicker
  label="Conference Time"
  granularity="minute"
  defaultValue={parseZonedDateTime("2024-04-04T12:30[America/Los_Angeles]")}
/>
```

**Show/Hide Timezone:**
```jsx
// Show timezone (default when using ZonedDateTime)
<DatePicker
  label="Global Meeting"
  granularity="minute"
  defaultValue={parseZonedDateTime("2024-04-04T12:30[UTC]")}
/>

// Hide timezone display
<DatePicker
  label="Local Time"
  granularity="minute"
  hideTimeZone
  defaultValue={parseZonedDateTime("2024-04-04T12:30[America/New_York]")}
/>
```

**Daylight Saving Time:**
The component handles DST transitions automatically through the `@internationalized/date` library.

---

## 6. Actual Code Examples from Docs

### Basic Usage

```jsx
import { DatePicker } from "@heroui/react";

export default function App() {
  return <DatePicker label="Birth Date" />;
}
```

### With Default Value

```jsx
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Birth Date"
      defaultValue={parseDate("2024-04-04")}
    />
  );
}
```

### Disabled

```jsx
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Birth Date"
      isDisabled
      defaultValue={parseDate("2024-04-04")}
    />
  );
}
```

### Read-Only

```jsx
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Birth Date"
      isReadOnly
      defaultValue={parseDate("2024-04-04")}
    />
  );
}
```

### Required

```jsx
import { DatePicker } from "@heroui/react";

export default function App() {
  return <DatePicker label="Birth Date" isRequired />;
}
```

### With Description

```jsx
import { DatePicker } from "@heroui/react";

export default function App() {
  return (
    <DatePicker
      label="Birth Date"
      description="Enter your date of birth"
    />
  );
}
```

### With Error Message

```jsx
import { DatePicker } from "@heroui/react";

export default function App() {
  return (
    <DatePicker
      label="Birth Date"
      isInvalid
      errorMessage="Please enter a valid date"
    />
  );
}
```

### With Validation

```jsx
import { DatePicker } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Appointment Date"
      validate={(value) => {
        if (!value) return "Date is required";
        if (value.compare(today(getLocalTimeZone())) < 0) {
          return "Date must be in the future";
        }
      }}
    />
  );
}
```

### With Time

```jsx
import { DatePicker } from "@heroui/react";
import { parseDateTime } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Event Date"
      granularity="minute"
      defaultValue={parseDateTime("2024-04-04T12:30")}
    />
  );
}
```

### With Timezone

```jsx
import { DatePicker } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Event Date"
      granularity="minute"
      defaultValue={parseZonedDateTime("2024-04-04T12:30[America/Los_Angeles]")}
    />
  );
}
```

### With Month and Year Pickers

```jsx
import { DatePicker } from "@heroui/react";

export default function App() {
  return (
    <DatePicker
      label="Event Date"
      showMonthAndYearPickers
    />
  );
}
```

### With Custom Selector Icon

```jsx
import { DatePicker } from "@heroui/react";
import { CalendarIcon } from "./CalendarIcon";

export default function App() {
  return (
    <DatePicker
      label="Event Date"
      selectorIcon={<CalendarIcon />}
    />
  );
}
```

### With Visible Months

```jsx
import { DatePicker } from "@heroui/react";

export default function App() {
  return (
    <DatePicker
      label="Event Date"
      visibleMonths={3}
    />
  );
}
```

### With Unavailable Dates

```jsx
import { DatePicker } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function App() {
  return (
    <DatePicker
      label="Appointment Date"
      isDateUnavailable={(date) => {
        const day = date.toDate(getLocalTimeZone()).getDay();
        return day === 0 || day === 6; // Block weekends
      }}
    />
  );
}
```

### With Presets

```jsx
import { DatePicker, Button, ButtonGroup } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function App() {
  const [value, setValue] = useState(null);

  return (
    <DatePicker
      label="Appointment Date"
      value={value}
      onChange={setValue}
      CalendarTopContent={
        <ButtonGroup fullWidth className="px-3 pb-2 pt-3" size="sm">
          <Button onPress={() => setValue(today(getLocalTimeZone()))}>
            Today
          </Button>
          <Button onPress={() => setValue(today(getLocalTimeZone()).add({ days: 1 }))}>
            Tomorrow
          </Button>
        </ButtonGroup>
      }
    />
  );
}
```

### International Calendars

```jsx
import { DatePicker } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

export default function App() {
  return (
    <I18nProvider locale="he-IL-u-ca-hebrew">
      <DatePicker label="תאריך" />
    </I18nProvider>
  );
}
```

### Controlled

```jsx
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

export default function App() {
  const [date, setDate] = useState(parseDate("2024-04-04"));

  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        label="Date"
        value={date}
        onChange={setDate}
      />
      <p>Selected date: {date?.toString()}</p>
    </div>
  );
}
```

---

## 7. Notable Features

### 1. Comprehensive Timezone Support

Full timezone awareness with automatic DST handling:

```jsx
import { parseZonedDateTime, getLocalTimeZone } from "@internationalized/date";

// Timezone-aware value
<DatePicker
  granularity="minute"
  defaultValue={parseZonedDateTime("2024-04-04T12:30[America/New_York]")}
/>
```

**Why it's notable:**
- Handles daylight saving time transitions correctly
- Preserves timezone information through user interactions
- Converts between timezones accurately
- Essential for global applications

### 2. International Calendar System Support

Support for multiple calendar systems via Unicode extensions:

```jsx
// Hebrew calendar
<I18nProvider locale="he-IL-u-ca-hebrew">
  <DatePicker label="תאריך" />
</I18nProvider>

// Indian calendar
<I18nProvider locale="en-IN-u-ca-indian">
  <DatePicker label="Date" />
</I18nProvider>

// Islamic calendar
<I18nProvider locale="ar-SA-u-ca-islamic">
  <DatePicker label="التاريخ" />
</I18nProvider>

// Buddhist calendar
<I18nProvider locale="th-TH-u-ca-buddhist">
  <DatePicker label="วันที่" />
</I18nProvider>
```

**Why it's notable:**
- Goes beyond simple date formatting to support non-Gregorian calendars
- Rare feature in web component libraries
- Critical for truly international applications
- Handles complex calendar conversions automatically

### 3. Granular Time Selection

Fine control over datetime precision:

```jsx
// Day only
<DatePicker granularity="day" />

// Hour precision
<DatePicker granularity="hour" />

// Minute precision
<DatePicker granularity="minute" />

// Second precision
<DatePicker granularity="second" />
```

**Why it's notable:**
- Prevents unnecessary UI complexity
- Matches precision to use case
- Clear API for controlling displayed fields

### 4. Segment-Based Keyboard Navigation

Advanced keyboard interaction:

- Tab between date segments (month/day/year/hour/minute)
- Arrow up/down to increment/decrement each segment
- Direct typing to replace segment values
- Automatic validation on segment change

**Why it's notable:**
- Superior keyboard accessibility
- Faster than typing entire dates
- Reduces formatting errors
- Follows native input behavior patterns

### 5. Custom Preset Buttons

Flexible quick-selection options:

```jsx
<DatePicker
  CalendarTopContent={
    <ButtonGroup fullWidth>
      <Button onPress={() => setValue(today(getLocalTimeZone()))}>Today</Button>
      <Button onPress={() => setValue(startOfWeek())}>Start of Week</Button>
    </ButtonGroup>
  }
  CalendarBottomContent={
    <ButtonGroup fullWidth>
      <Button onPress={() => setValue(endOfMonth())}>End of Month</Button>
    </ButtonGroup>
  }
/>
```

**Why it's notable:**
- Highly customizable preset placement
- Supports complex preset logic
- Can add any React component
- More flexible than fixed preset options

### 6. Multi-Month Calendar View

Display multiple months simultaneously:

```jsx
<DatePicker
  visibleMonths={3}  // Display 1-3 months
  pageBehavior="visible"  // Advance by visible months
/>
```

**Why it's notable:**
- Improves date range visibility
- Reduces navigation for near-future dates
- Configurable pagination behavior
- Max 3 months (performance balanced)

### 7. Month/Year Quick Selection

Fast navigation to distant dates:

```jsx
<DatePicker showMonthAndYearPickers />
```

**Why it's notable:**
- Essential for birth dates or historical dates
- Reduces clicks for year-level navigation
- Toggle-able for simple vs. complex use cases

### 8. Unavailable Date Marking

Function-based date restrictions:

```jsx
<DatePicker
  isDateUnavailable={(date) => {
    // Complex business logic
    const day = date.toDate(getLocalTimeZone()).getDay();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = checkHolidays(date);
    return isWeekend || isHoliday;
  }}
/>
```

**Why it's notable:**
- Function-based allows complex logic
- Visual indication in calendar
- Prevents selection of invalid dates
- More flexible than simple min/max

### 9. Validation Behavior Options

Control validation timing:

```jsx
// Native HTML validation
<DatePicker validationBehavior="native" />

// ARIA validation (client-side)
<DatePicker validationBehavior="aria" />
```

**Why it's notable:**
- Choose between native form validation and custom
- Server-side rendering compatible
- Progressive enhancement friendly

### 10. Comprehensive Styling Slots

Slot-based styling system:

```jsx
<DatePicker
  classNames={{
    base: "max-w-md",
    selectorButton: "text-primary",
    selectorIcon: "text-xl",
    popoverContent: "bg-background",
    calendar: "border-none",
    calendarContent: "bg-default-100",
    timeInputLabel: "text-small",
    timeInput: "px-4",
  }}
/>
```

**Available slots:**
- `base` - Root wrapper
- `selectorButton` - Calendar button
- `selectorIcon` - Calendar icon
- `popoverContent` - Popover container
- `calendar` - Calendar wrapper
- `calendarContent` - Calendar content area
- `timeInputLabel` - Time section label
- `timeInput` - Time input field

**Why it's notable:**
- Fine-grained styling control
- Predictable slot names
- Supports utility class frameworks
- Maintains encapsulation

### 11. Hour Cycle Control

12-hour vs 24-hour format:

```jsx
// 24-hour format
<DatePicker hourCycle={24} granularity="minute" />

// 12-hour format with AM/PM
<DatePicker hourCycle={12} granularity="minute" />
```

**Why it's notable:**
- Override locale defaults when needed
- User preference support
- Clear API for time format

### 12. Accessible by Default

Built-in accessibility features:

- Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- Screen reader announcements for all interactions
- ARIA labels and roles
- Focus management
- Focusable date segments
- Disabled date announcements

**Why it's notable:**
- No additional work needed for accessibility
- Follows ARIA best practices
- Keyboard users get full functionality
- Screen reader tested

---

## 8. Research Notes

### Framework Architecture

HeroUI (formerly NextUI) is built on top of:
- **React Aria** - Adobe's accessibility library
- **React Stately** - State management hooks
- **@internationalized/date** - Advanced date/time library

This architecture provides:
- Robust accessibility out of the box
- International calendar support
- Timezone handling
- Complex date calculations

### Design System Integration

**Consistent with HeroUI:**
- Size variants (sm/md/lg)
- Color system (default/primary/secondary/success/warning/danger)
- Visual variants (flat/bordered/faded/underlined)
- Radius variants (none/sm/md/lg/full)
- Label placement patterns
- Description/error message patterns

### Value Management

**Two Patterns:**
1. **Uncontrolled** - Uses `defaultValue`, manages state internally
2. **Controlled** - Uses `value` and `onChange`, external state management

This follows standard React patterns and integrates well with form libraries.

### Date Library Integration

The component requires `@internationalized/date` for date values:

```jsx
import {
  parseDate,           // Parse date string to CalendarDate
  parseDateTime,       // Parse datetime string to CalendarDateTime
  parseZonedDateTime,  // Parse datetime with timezone
  today,               // Get today's date
  getLocalTimeZone,    // Get user's timezone
} from "@internationalized/date";
```

This library choice provides:
- Immutable date objects
- Timezone awareness
- Calendar system support
- Precise date arithmetic
- Type safety

### Calendar vs DatePicker vs DateRangePicker

**HeroUI provides three related components:**

1. **Calendar** - Calendar grid only (no input field)
2. **DatePicker** - Input field + calendar popover (single date)
3. **DateRangePicker** - Input field + calendar popover (date range)

This research focuses on DatePicker specifically.

### Browser Compatibility

Built for modern browsers with:
- ESM module support
- CSS custom properties
- Modern JavaScript features
- React 18+ features

No IE11 support.

### Performance Considerations

**Optimization Features:**
- Lazy loading of calendar popover
- Virtual rendering for month/year pickers
- Efficient re-rendering through React Aria
- Max 3 visible months (performance limit)

**Potential Concerns:**
- Large bundle size due to internationalization support
- Date library dependency adds to bundle
- Complex timezone calculations may impact performance

### Use Case Fit

**Ideal for:**
- Applications requiring international calendar support
- Timezone-aware scheduling applications
- Forms with date/datetime input
- Booking and reservation systems
- Event management interfaces
- Applications needing precise time selection

**May be overkill for:**
- Simple date selection without internationalization
- Applications targeting only one calendar system
- Cases where native `<input type="date">` suffices
- Static site generation (requires React)

### Comparison to Native HTML Input

**Advantages over `<input type="date">`:**
- Consistent cross-browser appearance
- More styling control
- Preset/quick select options
- Custom validation logic
- International calendar support
- Timezone handling
- Month/year quick navigation
- Multi-month view
- Custom icon/branding

**Disadvantages compared to native:**
- Larger bundle size
- Requires JavaScript
- More complex implementation
- May not match OS date picker (accessibility trade-off)

### Migration Considerations

**From other date pickers:**
- Similar API to React-based date pickers
- May need to adapt to `@internationalized/date` value types
- Validation patterns differ from some libraries
- Controlled/uncontrolled patterns are standard React

**To this component:**
- Benefits: Better internationalization, timezone support, accessibility
- Challenges: Learning new date library, potential bundle size increase
- Migration path: Can run alongside other date inputs during transition

### Customization Limitations

**What can be customized:**
- Visual appearance (colors, sizes, variants, radius)
- Calendar icon
- Preset buttons (top/bottom content)
- Validation logic
- Date availability
- Label/description/error text
- Multiple styling slots

**What cannot be customized easily:**
- Core calendar rendering (would need to fork component)
- Input field rendering (slot-based only)
- Keyboard interaction patterns
- Date library (tightly coupled to @internationalized/date)

### Integration with Forms

**Works with:**
- React Hook Form (via controlled mode)
- Formik (via controlled mode)
- Native form submission (with validation)
- Custom form libraries

**Form features:**
- Required validation
- Custom validation functions
- Error message display
- Disabled/read-only states
- Native validation behavior option

### Accessibility Features

**WCAG Compliance:**
- Keyboard navigable (Tab, Arrow keys, Enter, Esc)
- Screen reader compatible with proper announcements
- Focus management (focus returns to trigger on close)
- ARIA attributes for all interactive elements
- Disabled dates announced to screen readers
- Clear focus indicators

**Keyboard Shortcuts:**
- Tab - Navigate between segments/buttons
- Arrow Up/Down - Increment/decrement segment
- Arrow Left/Right - Navigate calendar grid
- Enter - Select date / open calendar
- Escape - Close calendar
- Space - Open/close calendar

### Internationalization Depth

**What's internationalized:**
- Date format (locale-specific)
- First day of week (locale-specific)
- Month/day names (locale-specific)
- Calendar system (Gregorian, Hebrew, Islamic, Buddhist, Indian, etc.)
- Number formatting (locale-specific)
- RTL layout support
- Timezone names

**How it works:**
- Uses Unicode locale extensions (e.g., `en-US-u-ca-hebrew`)
- Integrates with `I18nProvider` from React Aria
- Automatic locale detection (can be overridden)
- Respects user's browser locale by default

### Testing Considerations

**Testability:**
- Component accepts test IDs via props
- Controlled mode allows full state control
- Clear event handlers for interaction testing
- Accessible DOM structure for query selectors

**Test scenarios:**
- Value selection and onChange
- Validation behavior
- Disabled/read-only states
- Keyboard navigation
- Preset button clicks
- Date restriction enforcement
- Error message display
- Timezone handling
- Locale switching

---

## 9. Pattern Support Summary

### Content Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Keyboard Date Input | ✅ Native | Direct text entry with segment navigation |
| Calendar Visual Selection | ✅ Native | Click-based date selection from grid |
| Time Selection | ✅ Native | Inline time field with granularity control |
| Custom Format | ✅ Native | Automatic locale-based formatting |
| Placeholder | ✅ Native | Via `placeholderValue` prop |

### Type Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Single Date | ✅ Native | Default behavior |
| Date Range | ⚠️ Separate Component | Use `DateRangePicker` instead |
| Multiple Dates | ❌ Not Supported | Would need custom implementation |
| Month Picker | ⚠️ Partial | `showMonthAndYearPickers` enables quick selection |
| Year Picker | ⚠️ Partial | `showMonthAndYearPickers` enables quick selection |
| Week Picker | ❌ Not Supported | Custom implementation needed |
| Quarter Picker | ❌ Not Supported | Custom implementation needed |
| DateTime | ✅ Native | Via `granularity` prop |
| Timezone-Aware | ✅ Native | ZonedDateTime value type |

### State Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Disabled | ✅ Native | `isDisabled` prop |
| Read-Only | ✅ Native | `isReadOnly` prop |
| Required | ✅ Native | `isRequired` prop |
| Invalid/Error | ✅ Native | `isInvalid` + `errorMessage` |
| Loading | ❌ Not Built-in | Use disabled state or custom UI |

### Variation Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Size Variants | ✅ Native | sm, md, lg |
| Visual Variants | ✅ Native | flat, bordered, faded, underlined |
| Color Variants | ✅ Native | 6 color options |
| Radius Variants | ✅ Native | none, sm, md, lg, full |
| Label Placement | ✅ Native | inside, outside, outside-left |
| Date Restrictions | ✅ Native | min/max + `isDateUnavailable` function |
| Locale Support | ✅ Native | Full internationalization |
| Custom Rendering | ✅ Native | Selector icon, calendar content areas |
| Presets | ✅ Native | Via `CalendarTopContent`/`CalendarBottomContent` |
| Timezone Handling | ✅ Native | Full timezone support with DST |

---

## 10. API Reference Summary

### Key Props

**Value & Control:**
- `value` - Controlled mode value (CalendarDate | CalendarDateTime | ZonedDateTime | null)
- `defaultValue` - Uncontrolled mode initial value
- `onChange` - Value change callback
- `placeholderValue` - Placeholder when no value

**Appearance:**
- `label` - Input label text
- `labelPlacement` - inside | outside | outside-left
- `variant` - flat | bordered | faded | underlined
- `color` - default | primary | secondary | success | warning | danger
- `size` - sm | md | lg
- `radius` - none | sm | md | lg | full
- `description` - Helper text below input
- `errorMessage` - Error text (string or function)
- `classNames` - Slot-based styling object

**State:**
- `isDisabled` - Disable the input
- `isReadOnly` - Read-only mode
- `isRequired` - Required validation
- `isInvalid` - Error state
- `isDateUnavailable` - Function to mark dates as unavailable
- `validate` - Custom validation function
- `validationBehavior` - native | aria

**Calendar:**
- `showMonthAndYearPickers` - Enable month/year quick selection
- `visibleMonths` - 1-3 months to display
- `firstDayOfWeek` - 0-6 (Sunday-Saturday)
- `pageBehavior` - visible | single
- `minValue` - Minimum selectable date
- `maxValue` - Maximum selectable date

**Time:**
- `granularity` - day | hour | minute | second
- `hourCycle` - 12 | 24
- `hideTimeZone` - Hide timezone display
- `shouldForceLeadingZeros` - Force leading zeros in time

**Customization:**
- `selectorIcon` - Custom calendar icon
- `selectorButtonPlacement` - start | end
- `CalendarTopContent` - Custom content above calendar
- `CalendarBottomContent` - Custom content below calendar
- `popoverProps` - Props for popover component
- `calendarProps` - Props for calendar component
- `timeInputProps` - Props for time input component

### Return Value / Events

**onChange Callback:**
```typescript
onChange?: (value: DateValue | null) => void
```

Where `DateValue` is one of:
- `CalendarDate` - Date without time
- `CalendarDateTime` - Date with time
- `ZonedDateTime` - Date with time and timezone

### Styling Slots

Available `classNames` keys:
- `base` - Root wrapper
- `selectorButton` - Calendar button
- `selectorIcon` - Calendar icon
- `popoverContent` - Popover wrapper
- `calendar` - Calendar wrapper
- `calendarContent` - Calendar content
- `timeInputLabel` - Time label
- `timeInput` - Time input

### Data Attributes

For state-based styling:
- `data-open` - Calendar is open
- `data-invalid` - Invalid state
- `data-disabled` - Disabled state
- `data-readonly` - Read-only state
- `data-required` - Required state
- `data-focus` - Input is focused
- `data-hover` - Input is hovered

---

## Summary

The HeroUI DatePicker is a comprehensive, accessible, and highly internationalized date/time input component that stands out for:

✅ **Exceptional internationalization** - Multiple calendar systems (Hebrew, Islamic, Buddhist, Indian)
✅ **Full timezone support** - Automatic DST handling and timezone conversions
✅ **Granular time control** - Day, hour, minute, or second precision
✅ **Advanced keyboard navigation** - Segment-based date entry
✅ **Flexible customization** - Presets, custom icons, custom calendar content
✅ **Multi-month view** - Display 1-3 months simultaneously
✅ **Month/year pickers** - Fast navigation to distant dates
✅ **Comprehensive validation** - Custom functions, unavailable dates, min/max
✅ **Multiple visual styles** - 4 variants, 6 colors, 5 radius options, 3 sizes
✅ **Accessibility first** - Built on React Aria with full keyboard/screen reader support
✅ **Form integration** - Native and ARIA validation modes
✅ **Controlled/uncontrolled** - Standard React patterns

The component is built on a solid foundation (React Aria + @internationalized/date) that provides enterprise-grade date handling capabilities rarely found in other component libraries. It's particularly well-suited for global applications requiring calendar system flexibility and timezone precision.

**Best for:** International applications, scheduling systems, booking platforms, event management
**May be overkill for:** Simple date selection in single-locale applications, static sites

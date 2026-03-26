# Mantine - DatePicker Component

## Component URL

**URL**: https://mantine.dev/dates/date-picker/
**Status**: Active and maintained
**Framework Version**: Mantine 8.3.7 (as of documentation review)
**Package**: `@mantine/dates`

---

## Documentation Quality Assessment

**Overall Quality**: Comprehensive and well-structured

**Strengths**:
- Clear progression from basic to advanced usage patterns
- Live interactive demos for each feature
- TypeScript code examples with proper type annotations
- Good coverage of core functionality and customization options
- Excellent keyboard navigation documentation
- Clear prop descriptions with expected types

**Weaknesses**:
- Limited CSS customization and theming guidance
- No explicit error state or validation pattern examples
- Missing timezone handling documentation
- No loading or async state patterns
- Minimal accessibility documentation beyond keyboard navigation
- No performance considerations mentioned
- Browser compatibility not addressed
- Limited production-readiness guidance

**Code Examples**: Abundant and practical, with real-world use cases demonstrated

---

## Component Definition

### Core Purpose

The DatePicker is an **inline calendar component** for selecting single dates, multiple dates, or date ranges. Unlike a date input field, this is a visual calendar picker that displays directly in the UI rather than in a popup/dropdown.

### Mental Model

DatePicker is a **stateless calendar visualization component** that:
- Displays a calendar month view by default with navigation controls
- Supports different selection modes (single, multiple, range)
- Provides controlled component patterns for external state management
- Acts as a pure UI component without input field wrapping
- Can be composed with other components for complete date selection experiences

**Key Distinction**: This is the calendar picker itself, not a complete date selection solution. For input field + calendar popup, Mantine provides separate `DatePickerInput` and `DateInput` components.

### Semantic Meaning

DatePicker represents a **calendar-based date selection interface**. It embodies the familiar calendar metaphor with:
- Month/year navigation (previous/next controls)
- Weekday headers and grid layout
- Visual distinction for selected dates, weekends, and current date
- Multiple granularity levels (day, month, year selection)
- Keyboard navigation following standard calendar interaction patterns

**Semantic Use Cases**:
- Appointment or event date selection
- Date range filtering (reports, analytics dashboards)
- Availability calendars (booking systems)
- Date-based navigation in time-series data
- Multi-date selection for batch operations

---

## Content Patterns

### Date Input

**Single Date Selection** (Default):
```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string | null>(null);
  return <DatePicker value={value} onChange={setValue} />;
}
```

**Key Points**:
- Value is a string in ISO date format or null
- onChange provides the selected date
- Clicking a date updates the value
- No input field - pure calendar display

### Calendar Popup

**Note**: DatePicker itself does NOT include popup/dropdown functionality. It's an inline component.

For popup behavior, use `DatePickerInput`:
```tsx
import { DatePickerInput } from '@mantine/dates';

function PopupDemo() {
  const [value, setValue] = useState<string | null>(null);
  return <DatePickerInput value={value} onChange={setValue} />;
}
```

### Time Selection

DatePicker does NOT include time selection. For date + time:
```tsx
import { DateTimePicker } from '@mantine/dates';

function DateTimeDemo() {
  const [value, setValue] = useState<string | null>(null);
  return <DateTimePicker value={value} onChange={setValue} />;
}
```

### Custom Format

Format controlled via dayjs patterns:

```tsx
// Month label format
<DatePicker
  monthLabelFormat="MMMM YYYY"
  value={value}
  onChange={setValue}
/>

// Year list format
<DatePicker
  yearsListFormat="YY"
  value={value}
  onChange={setValue}
/>

// Decade label format
<DatePicker
  decadeLabelFormat="YYYY"
  value={value}
  onChange={setValue}
/>
```

**Format Options**:
- `monthLabelFormat` - Header display (default: "MMMM YYYY")
- `yearLabelFormat` - Year header (default: "YYYY")
- `decadeLabelFormat` - Decade header (default: "YYYY")
- `monthsListFormat` - Month list items (default: "MMM")
- `yearsListFormat` - Year list items (default: "YYYY")

All formats use dayjs format strings.

### Presets (Quick Selection)

**Single Date Presets**:
```tsx
import dayjs from 'dayjs';

<DatePicker
  value={value}
  onChange={setValue}
  presets={[
    { value: dayjs().format('YYYY-MM-DD'), label: 'Today' },
    { value: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), label: 'Yesterday' },
    { value: dayjs().add(1, 'day').format('YYYY-MM-DD'), label: 'Tomorrow' }
  ]}
/>
```

**Range Presets**:
```tsx
const today = dayjs();
<DatePicker
  type="range"
  value={value}
  onChange={setValue}
  presets={[
    {
      value: [today.subtract(7, 'day').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
      label: 'Last 7 days'
    },
    {
      value: [today.subtract(30, 'day').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
      label: 'Last 30 days'
    }
  ]}
/>
```

---

## Type Patterns

### Single Date

**Default mode** - select one date:
```tsx
const [value, setValue] = useState<string | null>(null);
<DatePicker value={value} onChange={setValue} />
```

**With Deselect**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  allowDeselect
/>
```
Clicking the selected date again deselects it (sets value to null).

### Date Range

Select start and end dates:
```tsx
const [value, setValue] = useState<[string | null, string | null]>([null, null]);
<DatePicker type="range" value={value} onChange={setValue} />
```

**Key Behaviors**:
- First click sets start date
- Second click sets end date
- Date range is highlighted visually
- Value is a tuple: `[startDate, endDate]`

**Allow Single Date in Range**:
```tsx
<DatePicker
  type="range"
  value={value}
  onChange={setValue}
  allowSingleDateInRange
/>
```
Allows `[date, date]` as a valid range (same day start and end).

### Multiple Dates

Select multiple non-contiguous dates:
```tsx
const [value, setValue] = useState<string[]>([]);
<DatePicker type="multiple" value={value} onChange={setValue} />
```

**Key Behaviors**:
- Click adds date to array
- Click selected date removes it from array
- All selected dates highlighted
- No ordering requirement

### Month Picker

Focus on month selection:
```tsx
<DatePicker
  defaultLevel="month"
  maxLevel="month"
  value={value}
  onChange={setValue}
/>
```

Or use dedicated component:
```tsx
import { MonthPicker } from '@mantine/dates';
<MonthPicker value={value} onChange={setValue} />
```

### Year Picker

Focus on year selection:
```tsx
<DatePicker
  defaultLevel="year"
  maxLevel="year"
  value={value}
  onChange={setValue}
/>
```

Or use dedicated component:
```tsx
import { YearPicker } from '@mantine/dates';
<YearPicker value={value} onChange={setValue} />
```

### Week Picker

**Not directly supported**. Can be implemented via custom logic:
```tsx
<DatePicker
  withWeekNumbers
  getDayProps={(date) => ({
    onClick: () => {
      const weekStart = dayjs(date).startOf('week');
      const weekEnd = dayjs(date).endOf('week');
      setValue([weekStart.format('YYYY-MM-DD'), weekEnd.format('YYYY-MM-DD')]);
    }
  })}
/>
```

### Quarter Picker

**Not directly supported**. Would require custom implementation with `renderDay` or `defaultLevel="month"` with custom click handling.

---

## State Patterns

### Disabled

**Disable Entire Picker**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  disabled
/>
```

**Disable Specific Dates**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
/>
```
This example disables weekends.

**Disable Date Ranges via Min/Max**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  minDate={new Date()}
  maxDate={dayjs().add(1, 'year').toDate()}
/>
```
Disables all dates before today and after one year from now.

**Disable Specific Dates via getDayProps**:
```tsx
const holidays = ['2025-12-25', '2025-01-01'];
<DatePicker
  value={value}
  onChange={setValue}
  getDayProps={(date) => ({
    disabled: holidays.includes(dayjs(date).format('YYYY-MM-DD'))
  })}
/>
```

### Read-Only

**Not explicitly documented**. Potential implementations:

**Via Controlled State** (Prevent changes):
```tsx
<DatePicker
  value={value}
  onChange={() => {}} // No-op onChange
/>
```

**Via CSS Pointer Events** (Visual only):
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  style={{ pointerEvents: 'none' }}
/>
```

**Note**: True read-only mode would require custom styling to indicate non-interactive state.

### Error

**Not directly supported**. No built-in error state prop.

Potential implementation via custom styling:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  styles={(theme) => ({
    calendar: {
      border: hasError ? `2px solid ${theme.colors.red[6]}` : undefined
    }
  })}
/>
```

For error states with inputs, use `DatePickerInput` which supports `error` prop:
```tsx
<DatePickerInput
  value={value}
  onChange={setValue}
  error="Please select a valid date"
/>
```

### Loading

**Not directly supported**. No built-in loading state.

Potential wrapper implementation:
```tsx
import { LoadingOverlay, Box } from '@mantine/core';

<Box pos="relative">
  <LoadingOverlay visible={loading} />
  <DatePicker value={value} onChange={setValue} />
</Box>
```

---

## Variation Patterns

### Sizes

Built-in size prop with 5 variants:
```tsx
<DatePicker value={value} onChange={setValue} size="xs" />
<DatePicker value={value} onChange={setValue} size="sm" />
<DatePicker value={value} onChange={setValue} size="md" /> {/* Default */}
<DatePicker value={value} onChange={setValue} size="lg" />
<DatePicker value={value} onChange={setValue} size="xl" />
```

**Size affects**:
- Calendar width and height
- Font sizes
- Padding and spacing
- Touch target sizes

### Restrictions

**Date Boundaries**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  minDate={new Date('2025-01-01')}
  maxDate={new Date('2025-12-31')}
/>
```

**Exclude Specific Dates**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  excludeDate={(date) => {
    // Exclude weekends
    if (date.getDay() === 0 || date.getDay() === 6) return true;
    // Exclude holidays
    const holidays = ['2025-12-25', '2025-07-04'];
    return holidays.includes(dayjs(date).format('YYYY-MM-DD'));
  }}
/>
```

**Maximum Navigation Level**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  maxLevel="month" // Can't navigate to year/decade view
/>
```

### Locale

**Global Locale** (via DatesProvider):
```tsx
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/ru';

<DatesProvider settings={{ locale: 'ru' }}>
  <DatePicker value={value} onChange={setValue} />
</DatesProvider>
```

**Component-Level Locale**:
```tsx
import 'dayjs/locale/es';

<DatePicker
  value={value}
  onChange={setValue}
  locale="es"
/>
```

**First Day of Week**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  firstDayOfWeek={1} // Monday (0 = Sunday, 6 = Saturday)
/>
```

**Weekend Days**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  weekendDays={[5, 6]} // Friday and Saturday
/>
```

### Custom Rendering

**Custom Day Rendering**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  renderDay={(date) => {
    const day = date.getDate();
    const isFriday13 = date.getDay() === 5 && day === 13;

    return (
      <div style={{ position: 'relative' }}>
        {day}
        {isFriday13 && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 2,
            background: 'red'
          }} />
        )}
      </div>
    );
  }}
/>
```

**Custom Day Props** (More common pattern):
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  getDayProps={(date) => {
    const isFriday13 = date.getDay() === 5 && date.getDate() === 13;
    return {
      style: isFriday13 ? { background: 'red', color: 'white' } : {},
      'aria-label': isFriday13 ? `${date.toDateString()} - Friday the 13th` : undefined
    };
  }}
/>
```

**Custom Month Control Props**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  getMonthControlProps={(date) => ({
    disabled: date.getMonth() > 5, // Disable months after June
    style: date.getMonth() === 0 ? { fontWeight: 'bold' } : {}
  })}
/>
```

**Custom Year Control Props**:
```tsx
<DatePicker
  value={value}
  onChange={setValue}
  getYearControlProps={(date) => ({
    disabled: date.getFullYear() < 2020
  })}
/>
```

### Presets (Covered in Content Patterns)

See "Content Patterns > Presets" above for detailed examples.

### Timezone

**Not directly supported or documented**.

DatePicker works with dayjs which has timezone plugin support, but the component itself doesn't expose timezone configuration.

For timezone-aware date selection, would need to:
1. Install dayjs timezone plugin
2. Convert dates to/from desired timezone outside component
3. Pass converted dates to component

```tsx
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

// Manual timezone handling outside component
const handleChange = (date: string | null) => {
  if (date) {
    const tzDate = dayjs.tz(date, 'America/New_York').format();
    setValue(tzDate);
  }
};

<DatePicker value={value} onChange={handleChange} />
```

---

## Actual Code Examples from Docs

### Example 1: Basic Usage

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string | null>(null);
  return <DatePicker value={value} onChange={setValue} />;
}
```

### Example 2: Multiple Dates

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string[]>([]);
  return <DatePicker type="multiple" value={value} onChange={setValue} />;
}
```

### Example 3: Date Range

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<[string | null, string | null]>([null, null]);
  return <DatePicker type="range" value={value} onChange={setValue} />;
}
```

### Example 4: Controlled Date Display

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [date, setDate] = useState(new Date());

  const handleChange = (val: [Date | null, Date | null]) => {
    // Jump to next year when start date selected
    if (val[0] !== null && val[1] === null) {
      setDate((current) => new Date(current.getFullYear() + 1, 1));
    }
    setValue(val);
  };

  return (
    <DatePicker
      type="range"
      value={value}
      onChange={handleChange}
      date={date}
      onDateChange={setDate}
    />
  );
}
```

### Example 5: Multiple Columns

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<[string | null, string | null]>([null, null]);
  return (
    <DatePicker
      type="range"
      value={value}
      onChange={setValue}
      numberOfColumns={2}
    />
  );
}
```

### Example 6: Min/Max Dates

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

function Demo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      minDate={new Date()}
      maxDate={dayjs().add(1, 'year').toDate()}
    />
  );
}
```

### Example 7: Exclude Dates

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  );
}
```

### Example 8: Hide Outside Dates

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DatePicker
      value={value}
      onChange={setValue}
      hideOutsideDates
    />
  );
}
```

### Example 9: Week Numbers

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DatePicker
      value={value}
      onChange={setValue}
      withWeekNumbers
    />
  );
}
```

### Example 10: Custom Day Rendering

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function Demo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      renderDay={(date) => {
        const day = date.getDate();
        return (
          <div>
            <div>{day}</div>
            {day === 13 && <div style={{ fontSize: 10 }}>🔮</div>}
          </div>
        );
      }}
    />
  );
}
```

### Example 11: Presets

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

function Demo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      presets={[
        { value: dayjs().format('YYYY-MM-DD'), label: 'Today' },
        { value: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), label: 'Yesterday' },
        { value: dayjs().add(1, 'day').format('YYYY-MM-DD'), label: 'Tomorrow' }
      ]}
    />
  );
}
```

### Example 12: Range Presets

```tsx
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

function Demo() {
  const [value, setValue] = useState<[string | null, string | null]>([null, null]);
  const today = dayjs();

  return (
    <DatePicker
      type="range"
      value={value}
      onChange={setValue}
      presets={[
        {
          value: [today.subtract(7, 'day').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
          label: 'Last 7 days'
        },
        {
          value: [today.subtract(30, 'day').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
          label: 'Last 30 days'
        }
      ]}
    />
  );
}
```

---

## Notable Features

### 1. Inline Calendar Component

DatePicker is **not** a popup/dropdown component. It displays inline in the UI as a calendar widget. For popup behavior, use `DatePickerInput` instead.

### 2. Three Selection Modes

Supports single date, multiple dates, and date range selection through the `type` prop, making it versatile for different use cases.

### 3. Controlled Date Navigation

The `date` and `onDateChange` props allow full control over which month/year is displayed, enabling custom navigation behaviors (e.g., auto-advance to next year when selecting range start date).

### 4. Flexible Date Restrictions

Multiple ways to restrict selectable dates:
- `minDate` / `maxDate` for boundaries
- `excludeDate` function for complex logic
- `getDayProps` for per-date customization
- Navigation controls automatically disable when outside boundaries

### 5. Multi-Column Layout

`numberOfColumns` prop enables side-by-side calendar display, particularly useful for range selection with clear visualization of start/end dates in adjacent months.

### 6. Preset Support

Built-in preset functionality for common date selections (Today, Yesterday, Last 7 days, etc.) without custom implementation.

### 7. Custom Rendering Flexibility

Three customization layers:
- `renderDay` - Complete custom day rendering
- `getDayProps` - Add props/styles to day controls
- `getMonthControlProps` / `getYearControlProps` - Customize month/year controls

### 8. Keyboard Navigation

Full keyboard support with arrow key navigation, making it accessible without mouse interaction.

### 9. Internationalization Support

Comprehensive i18n via dayjs locales with component-level or global configuration through `DatesProvider`.

### 10. Week Number Display

ISO week number display via `withWeekNumbers` prop, useful for business applications.

### 11. Granularity Levels

Supports navigation through three levels (day, month, year) with configurable `defaultLevel` and `maxLevel` for constraining picker to specific granularity.

### 12. Custom Week Configuration

`firstDayOfWeek` and `weekendDays` props allow cultural customization of calendar display.

---

## Research Notes

### Strengths

1. **Clean API Design**: Simple, intuitive props with clear TypeScript types
2. **Flexibility**: Three selection modes cover most use cases
3. **Customization**: Multiple layers of customization without overwhelming API surface
4. **Accessibility**: Built-in keyboard navigation and ARIA label support
5. **Internationalization**: Excellent i18n support through dayjs integration
6. **Documentation**: Comprehensive examples with live demos

### Limitations

1. **No Built-in Popup**: Requires separate `DatePickerInput` component for popup behavior
2. **No Time Selection**: Separate `DateTimePicker` component required
3. **No Error States**: No built-in error/validation UI (must be implemented externally)
4. **No Loading States**: No built-in loading/async handling
5. **No Timezone Support**: Timezone handling must be implemented externally
6. **Limited Styling Docs**: Minimal guidance on CSS customization and theming
7. **No Week/Quarter Pickers**: Requires custom implementation for these granularities

### Comparison to Other Frameworks

**vs Ant Design DatePicker**:
- Mantine: Inline component, simpler API, no popup built-in
- Ant Design: Includes popup/dropdown, more comprehensive feature set, built-in time selection

**Notable Differences**:
- Mantine separates inline picker from input+popup (`DatePickerInput`)
- Mantine uses dayjs exclusively, Ant Design uses dayjs/moment
- Mantine has cleaner, more modern API surface
- Ant Design has more production-ready features (validation, error states, loading)

### Implementation Considerations

1. **Use Case Alignment**: Ideal for inline calendar displays, dashboards, date selection widgets
2. **Not Ideal For**: Traditional form inputs (use `DatePickerInput` instead)
3. **Accessibility**: Strong keyboard support but manual ARIA label configuration needed for full accessibility
4. **Performance**: No documented performance characteristics; likely efficient given controlled component pattern
5. **Integration**: Works well in React ecosystems; requires dayjs as peer dependency

### Recommended Patterns

1. **Form Integration**: Wrap in form field component with label and error display
2. **Validation**: Implement validation in onChange handler and show errors outside component
3. **Loading States**: Use `LoadingOverlay` from Mantine Core when fetching date-related data
4. **Timezone Handling**: Convert dates to/from timezone in onChange handler using dayjs-timezone
5. **Week Selection**: Use `getDayProps` to implement custom week selection logic
6. **Error States**: Use `styles` prop to apply error styling when validation fails

---

Research completed: 2025-11-10
Component: DatePicker
Framework: Mantine v8.3.7
Package: @mantine/dates
Documentation: https://mantine.dev/dates/date-picker/

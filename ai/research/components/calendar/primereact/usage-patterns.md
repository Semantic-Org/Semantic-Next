# PrimeReact - Calendar Usage Patterns

## Component URL
https://www.primefaces.org/primereact-v8/calendar/
https://primereact.org/calendar/ (current version)
Status: ✅ Working (v8 redirected to access restriction, current docs accessible)
Version: v8 and v10+
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - includes API reference, live interactive demos, and extensive code examples. The Calendar component is a mature, feature-rich date/time picker with support for single/multiple/range selection, inline and popup modes, time selection, and extensive customization options. Documentation includes accessibility guidelines following WAI-ARIA standards.

**Note:** This research was conducted based on web search results and documentation summaries. Direct page content extraction was blocked (403) for the v8 documentation URL. The information presented reflects the component's documented capabilities across versions as of the verification date.

---

## 1. Component Overview

The Calendar component in PrimeReact provides a comprehensive interface for date and time selection. It supports multiple selection modes (single, multiple, range), various view types (date, month, year), inline or popup display, time selection with different hour formats, and extensive customization through templates and props.

**Core Purpose:** Enable users to select dates and times through an interactive calendar interface with support for various input patterns, date restrictions, and display formats.

**Mental Model:** An input field that opens a calendar popup (or displays inline), similar to native date inputs but with enhanced functionality including time selection, multiple/range selection, and visual date restrictions.

**Semantic Meaning:** Communicates date/time selection intent, provides visual feedback of selected dates, and enforces date boundaries and validation rules through visual and interactive cues.

---

## 2. Basic Usage

### Simple Calendar

```jsx
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

// Basic calendar with default behavior
function App() {
  const [date, setDate] = useState(null);

  return (
    <Calendar
      value={date}
      onChange={(e) => setDate(e.value)}
    />
  );
}
```

### With Default Value

```jsx
const [date, setDate] = useState(new Date());

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
/>
```

### With Icon

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  showIcon
/>
```

---

## 3. Props/API

### Core Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | Date \| Date[] | null | Selected date(s) - controlled component |
| onChange | function | - | Callback when value changes, receives event object with e.value |
| dateFormat | string | 'mm/dd/yy' | Format for displaying dates |
| inline | boolean | false | Display calendar inline instead of in popup |
| selectionMode | 'single' \| 'multiple' \| 'range' | 'single' | Type of date selection |
| showTime | boolean | false | Enable time selection |
| hourFormat | '12' \| '24' | '24' | Hour format for time picker |
| timeOnly | boolean | false | Display only time picker (no date) |
| view | 'date' \| 'month' \| 'year' | 'date' | Current view of the calendar |
| disabled | boolean | false | When present, element cannot be edited and focused |
| readOnlyInput | boolean | false | Prevent manual date entry |
| minDate | Date | - | Minimum selectable date |
| maxDate | Date | - | Maximum selectable date |
| disabledDates | Date[] | - | Array of dates to disable |
| disabledDays | number[] | - | Array of day indexes to disable (0=Sunday, 6=Saturday) |
| showIcon | boolean | false | Display calendar icon next to input |
| showButtonBar | boolean | false | Show today and clear buttons at footer |
| touchUI | boolean | false | Optimize overlay display for touch devices (center screen) |
| numberOfMonths | number | 1 | Number of months to display |
| viewDate | Date | - | Date whose month/year are used to display the calendar |
| monthNavigator | boolean | false | Enable month dropdown navigator |
| yearNavigator | boolean | false | Enable year dropdown navigator |
| yearRange | string | - | Year range for navigator (e.g., "2010:2030") |
| hideOnRangeSelection | boolean | false | Hide calendar after range selection complete |
| placeholder | string | - | Placeholder text for input field |
| invalid | boolean | false | Display invalid state styling |
| variant | 'outlined' \| 'filled' | 'outlined' | Visual style variant |
| style | object | - | Inline styles for component |
| className | string | - | CSS class names |

### Template Props

| Prop | Type | Description |
|------|------|-------------|
| dateTemplate | function | Template for date cell content. Receives metadata object with day, month, year, otherMonth, today, selectable |
| headerTemplate | function | Custom content for calendar header |
| footerTemplate | function | Custom content for calendar footer |

### ARIA Props

| Prop | Type | Description |
|------|------|-------------|
| aria-label | string | ARIA label for accessibility |
| aria-labelledby | string | ID of element that labels the calendar |

---

## 4. Content Patterns

### Date Input

Standard date selection through calendar interface:

```jsx
const [date, setDate] = useState(null);

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  placeholder="Select a date"
/>
```

### Calendar Popup

Default mode - calendar appears in overlay:

```jsx
// Popup mode (default)
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  showIcon
/>

// Inline mode - always visible
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  inline
/>
```

### Time Selection

Enable time picking with showTime:

```jsx
// 24-hour format (default)
<Calendar
  value={datetime}
  onChange={(e) => setDatetime(e.value)}
  showTime
/>

// 12-hour format
<Calendar
  value={datetime}
  onChange={(e) => setDatetime(e.value)}
  showTime
  hourFormat="12"
/>

// Time only (no date)
<Calendar
  value={time}
  onChange={(e) => setTime(e.value)}
  timeOnly
  showTime
/>
```

### Custom Format

Customize date display format:

```jsx
// US format
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  dateFormat="mm/dd/yy"
/>

// European format
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  dateFormat="dd/mm/yy"
/>

// Long format
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  dateFormat="DD, MM d, yy"
/>
```

---

## 5. Type Patterns

### Single Date Selection

Default mode for selecting one date:

```jsx
const [date, setDate] = useState(null);

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  selectionMode="single" // default, can be omitted
/>
```

### Date Range Selection

Select start and end dates:

```jsx
const [dates, setDates] = useState(null);

<Calendar
  value={dates}
  onChange={(e) => setDates(e.value)}
  selectionMode="range"
  readOnlyInput
  hideOnRangeSelection
/>
```

### Multiple Dates Selection

Select multiple individual dates:

```jsx
const [dates, setDates] = useState(null);

<Calendar
  value={dates}
  onChange={(e) => setDates(e.value)}
  selectionMode="multiple"
  readOnlyInput
/>
```

### Month Picker

Select month and year only:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  view="month"
  dateFormat="mm/yy"
/>
```

### Year Picker

Select year only:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  view="year"
  dateFormat="yy"
/>
```

---

## 6. State Patterns

### Disabled State

Completely disable the calendar:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  disabled
/>
```

### Read-Only State

Prevent manual text input but allow calendar selection:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  readOnlyInput
/>
```

### Invalid/Error State

Display validation error styling:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  invalid
  placeholder="Required field"
/>
```

### Loading State

While PrimeReact Calendar doesn't have a built-in loading state, you can compose it:

```jsx
<div style={{ position: 'relative' }}>
  <Calendar
    value={date}
    onChange={(e) => setDate(e.value)}
    disabled={isLoading}
  />
  {isLoading && <Spinner />}
</div>
```

---

## 7. Variation Patterns

### Size Variants

PrimeReact doesn't have explicit size props for Calendar, but you can use CSS:

```jsx
// Small
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  className="p-inputtext-sm"
/>

// Large
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  className="p-inputtext-lg"
/>
```

### Visual Variants

```jsx
// Outlined (default)
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  variant="outlined"
/>

// Filled
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  variant="filled"
/>
```

### Date Restrictions

Restrict selectable dates using boundaries and disabled dates:

```jsx
const today = new Date();
const minDate = new Date();
minDate.setDate(today.getDate() - 7);
const maxDate = new Date();
maxDate.setDate(today.getDate() + 30);

// Date boundaries
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  minDate={minDate}
  maxDate={maxDate}
  readOnlyInput
/>

// Disable specific dates
const invalidDates = [
  new Date(2025, 11, 25), // Christmas
  new Date(2026, 0, 1)    // New Year
];

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  disabledDates={invalidDates}
  readOnlyInput
/>

// Disable specific days of week (e.g., weekends)
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  disabledDays={[0, 6]} // Sunday and Saturday
  readOnlyInput
/>
```

### Locale Support

Configure regional date formats and translations:

```jsx
import { addLocale } from 'primereact/api';

// Add Spanish locale
addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar'
});

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  locale="es"
/>
```

### Custom Rendering

Use templates to customize date cells:

```jsx
const dateTemplate = (date) => {
  // Highlight weekends
  if (date.day === 0 || date.day === 6) {
    return (
      <strong style={{ color: 'red' }}>
        {date.day}
      </strong>
    );
  }
  return date.day;
};

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  dateTemplate={dateTemplate}
/>
```

### Header/Footer Customization

```jsx
const headerTemplate = () => (
  <div style={{ padding: '0.5rem' }}>
    <strong>Select Date</strong>
  </div>
);

const footerTemplate = () => (
  <div style={{ padding: '0.5rem', textAlign: 'center' }}>
    <Button label="Today" onClick={() => setDate(new Date())} />
  </div>
);

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  headerTemplate={headerTemplate}
  footerTemplate={footerTemplate}
/>
```

### Button Bar

Quick access to today and clear actions:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  showButtonBar
/>
```

### Navigation Enhancements

Month and year dropdowns for quick navigation:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  monthNavigator
  yearNavigator
  yearRange="2000:2030"
/>
```

### Multiple Months Display

Show multiple months side by side:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  numberOfMonths={2}
/>

// Works great with range selection
<Calendar
  value={dates}
  onChange={(e) => setDates(e.value)}
  selectionMode="range"
  numberOfMonths={2}
  readOnlyInput
/>
```

### Touch UI Mode

Optimized for mobile devices:

```jsx
<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  touchUI
  showIcon
/>
```

### Presets/Quick Selection

Using custom footer template for presets:

```jsx
const presetTemplate = () => (
  <div style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
    <Button label="Today" onClick={() => setDate(new Date())} text />
    <Button label="Tomorrow" onClick={() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
    }} text />
    <Button label="Next Week" onClick={() => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDate(nextWeek);
    }} text />
  </div>
);

<Calendar
  value={date}
  onChange={(e) => setDate(e.value)}
  footerTemplate={presetTemplate}
/>
```

---

## 8. Actual Code Examples from Documentation

### Basic Date Selection

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function BasicDemo() {
  const [date, setDate] = useState(null);

  return (
    <div className="card flex justify-content-center">
      <Calendar value={date} onChange={(e) => setDate(e.value)} />
    </div>
  );
}
```

### Date and Time

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function TimeDemo() {
  const [datetime12h, setDateTime12h] = useState(null);
  const [datetime24h, setDateTime24h] = useState(null);

  return (
    <div className="card flex flex-wrap gap-3 p-fluid">
      <div className="flex-auto">
        <label htmlFor="calendar-12h" className="font-bold block mb-2">
          12 Hour Format
        </label>
        <Calendar
          id="calendar-12h"
          value={datetime12h}
          onChange={(e) => setDateTime12h(e.value)}
          showTime
          hourFormat="12"
        />
      </div>
      <div className="flex-auto">
        <label htmlFor="calendar-24h" className="font-bold block mb-2">
          24 Hour Format
        </label>
        <Calendar
          id="calendar-24h"
          value={datetime24h}
          onChange={(e) => setDateTime24h(e.value)}
          showTime
          hourFormat="24"
        />
      </div>
    </div>
  );
}
```

### Date Range Selection

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function RangeDemo() {
  const [dates, setDates] = useState(null);

  return (
    <div className="card flex justify-content-center">
      <Calendar
        value={dates}
        onChange={(e) => setDates(e.value)}
        selectionMode="range"
        readOnlyInput
        hideOnRangeSelection
        showIcon
      />
    </div>
  );
}
```

### Multiple Date Selection

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function MultipleDemo() {
  const [dates, setDates] = useState(null);

  return (
    <div className="card flex justify-content-center">
      <Calendar
        value={dates}
        onChange={(e) => setDates(e.value)}
        selectionMode="multiple"
        readOnlyInput
      />
    </div>
  );
}
```

### Date Restrictions

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function RestrictionsDemo() {
  const [date, setDate] = useState(null);

  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = (month === 0) ? 11 : month - 1;
  let prevYear = (prevMonth === 11) ? year - 1 : year;
  let nextMonth = (month === 11) ? 0 : month + 1;
  let nextYear = (nextMonth === 0) ? year + 1 : year;

  let minDate = new Date();
  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);

  let maxDate = new Date();
  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  let invalidDates = [today];

  return (
    <div className="card flex justify-content-center">
      <Calendar
        value={date}
        onChange={(e) => setDate(e.value)}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={invalidDates}
        disabledDays={[0, 6]}
        readOnlyInput
      />
    </div>
  );
}
```

### Month/Year Picker

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function MonthYearDemo() {
  const [date, setDate] = useState(null);

  return (
    <div className="card flex justify-content-center">
      <Calendar
        value={date}
        onChange={(e) => setDate(e.value)}
        view="month"
        dateFormat="mm/yy"
      />
    </div>
  );
}
```

### Inline Calendar

```jsx
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function InlineDemo() {
  const [date, setDate] = useState(null);

  return (
    <div className="card flex justify-content-center">
      <Calendar
        value={date}
        onChange={(e) => setDate(e.value)}
        inline
        showWeek
      />
    </div>
  );
}
```

---

## 9. Notable Features

### 1. Multiple Selection Modes

Unique flexibility with three distinct selection patterns:

```jsx
// Single date (default)
<Calendar value={date} onChange={(e) => setDate(e.value)} />

// Multiple discrete dates
<Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="multiple" />

// Date range (start and end)
<Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" />
```

This versatility covers most date selection use cases without requiring multiple components.

### 2. Comprehensive Time Support

Time selection integrated with date picking:

```jsx
// Date + Time
<Calendar value={datetime} onChange={(e) => setDatetime(e.value)} showTime />

// Time only (no date)
<Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly showTime />

// 12 or 24 hour formats
<Calendar showTime hourFormat="12" />
<Calendar showTime hourFormat="24" />
```

### 3. Month/Year View Modes

Direct month or year selection without date granularity:

```jsx
// Month + Year selection
<Calendar view="month" dateFormat="mm/yy" />

// Year only selection
<Calendar view="year" dateFormat="yy" />
```

Useful for reports, filters, or settings that only need month/year precision.

### 4. Flexible Date Restrictions

Multiple ways to constrain selectable dates:

```jsx
<Calendar
  minDate={minDate}           // Minimum boundary
  maxDate={maxDate}           // Maximum boundary
  disabledDates={[date1, date2]}  // Specific dates to disable
  disabledDays={[0, 6]}       // Day of week to disable (0=Sun, 6=Sat)
/>
```

Powerful for business rules like "no weekends" or "only future dates."

### 5. Advanced Navigation

Quick navigation through large date ranges:

```jsx
<Calendar
  monthNavigator
  yearNavigator
  yearRange="2000:2030"  // Dropdown with 30 years of options
/>
```

Much faster than clicking through months for distant dates.

### 6. Template Customization

Render custom content in date cells and sections:

```jsx
const dateTemplate = (date) => {
  // Custom rendering based on date properties:
  // date.day, date.month, date.year, date.today, date.selectable, date.otherMonth
  if (date.day === 15) {
    return <strong style={{ color: 'blue' }}>{date.day}</strong>;
  }
  return date.day;
};

<Calendar
  dateTemplate={dateTemplate}
  headerTemplate={customHeader}
  footerTemplate={customFooter}
/>
```

Enables highlighting special dates (holidays, events, availability).

### 7. Touch-Optimized UI

Mobile-friendly calendar display:

```jsx
<Calendar touchUI />
```

Displays calendar centered on screen as a modal overlay, optimized for touch interaction.

### 8. Multiple Month Display

Show several months simultaneously:

```jsx
<Calendar numberOfMonths={2} />
<Calendar numberOfMonths={3} />
```

Particularly useful for range selection, allowing users to see context across months.

### 9. Inline Mode

Persistent calendar display without popup:

```jsx
<Calendar inline />
```

Good for dashboards or when calendar is always relevant to the context.

### 10. Built-in Button Bar

Quick actions without custom footer:

```jsx
<Calendar showButtonBar />
```

Adds "Today" and "Clear" buttons automatically at footer.

### 11. Locale/Internationalization

Full i18n support through locale configuration:

```jsx
import { addLocale } from 'primereact/api';

addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', ...],
  monthNames: ['enero', 'febrero', ...],
  today: 'Hoy',
  clear: 'Limpiar'
});

<Calendar locale="es" />
```

### 12. ReadOnlyInput Mode

Allow calendar interaction but prevent manual typing:

```jsx
<Calendar readOnlyInput />
```

Useful to prevent invalid manual input while still allowing calendar selection.

---

## 10. Research Notes

### Observations

1. **Mature Component:** The Calendar is a well-established PrimeReact component with extensive features spanning v8 through v10+. It shows years of refinement and real-world usage.

2. **Selection Mode Flexibility:** The three selection modes (single, multiple, range) cover virtually all date selection patterns without requiring separate components or complex configuration.

3. **Time Integration:** Unlike many calendar components that separate date and time selection, PrimeReact Calendar integrates time picking directly, including a time-only mode.

4. **View Abstraction:** The ability to switch between date, month, and year views provides appropriate granularity for different use cases (appointments vs. quarterly reports).

5. **Navigation Patterns:** The combination of monthNavigator/yearNavigator for dropdowns plus multiple month display provides both quick jumps and context visibility.

6. **Template System:** The dateTemplate function receives rich metadata (day, month, year, today, selectable, otherMonth) enabling sophisticated custom rendering without fighting the component.

7. **Accessibility Focus:** Recent versions (v10+) show significant ARIA improvements, including proper roles, labels, keyboard navigation, and screen reader support.

8. **Mobile Consideration:** The touchUI mode demonstrates awareness of different interaction contexts, optimizing for touch vs. mouse input.

### Limitations & Considerations

1. **Documentation Access:** Direct access to the v8 documentation was blocked (403 error), requiring inference from current docs and search results. Some v8-specific features may not be fully captured.

2. **Time Picker Limitations:** Time selection is not supported in multiple selection mode, only in single and range modes.

3. **CSS Size Variants:** Unlike some PrimeReact components, Calendar doesn't have explicit size props, relying on CSS classes (p-inputtext-sm, p-inputtext-lg).

4. **Bundle Size:** As a feature-rich component with popup overlay, time selection, multiple views, and templates, Calendar likely has a larger footprint than minimal date pickers.

5. **Keyboard Accessibility Issues:** GitHub issues indicate some keyboard navigation problems, particularly with focus management when closing the popup with Escape key (v10.8.4).

6. **Manual Input Challenges:** The interaction with manual text entry has been described as cumbersome, with delete/backspace clearing the entire input. readOnlyInput is often recommended to work around this.

7. **Range Selection Constraints:** Issues have been reported with range selection across multiple years or months, suggesting some edge cases in range mode.

### Framework Integration

The Calendar follows PrimeReact's established patterns:

- Controlled component pattern with value/onChange
- Consistent disabled/invalid state handling
- Template-based customization
- Locale support through PrimeReact API
- CSS class naming conventions (p-calendar, p-inputtext)
- Integration with PrimeReact theming system
- Form validation compatibility
- ConfigProvider support for global settings

### Use Cases

**Ideal for:**
- Appointment scheduling (date + time)
- Date range filters (analytics, reports)
- Event planning (multiple dates)
- Booking systems (restrictions + availability)
- Reporting interfaces (month/year views)
- International applications (locale support)
- Mobile-first applications (touchUI)
- Dashboard widgets (inline mode)

**May be overkill for:**
- Simple birth date input (native input might suffice)
- Year-only selection (could use Select dropdown)
- Cases requiring extensive custom calendar logic
- Minimal bundle size requirements

### Comparison to Other Frameworks

**Unique Strengths:**
- Three selection modes in one component
- Integrated time selection with time-only mode
- Month/year views without separate components
- touchUI mode for mobile optimization
- Template system with rich date metadata
- Built-in button bar

**Standard Features:**
- Min/max date boundaries (common)
- Disabled dates/days (common)
- Inline and popup modes (common)
- Locale support (common)
- Icon trigger (common)
- Date formatting (universal)

**Potential Gaps:**
- No preset/quick date selection (must compose via templates)
- No week picker mode (only date/month/year)
- No quarter picker
- No timezone handling (uses browser local time)
- Limited custom overlay positioning
- No built-in "relative date" input ("3 days ago")

### Integration with Semantic UI

For Semantic UI Calendar implementation, consider:

1. **Web Component Approach:** Shadow DOM for calendar popup encapsulation, with slot-based icon customization.

2. **Selection Modes:** Support single, multiple, and range as distinct selectionMode setting. Use array values for multiple/range.

3. **Time Integration:** Consider time selection as opt-in via showTime setting, with separate timeOnly mode.

4. **View Modes:** Support date/month/year view switching, potentially as a view setting or separate components.

5. **Template System:** Enable custom date cell rendering through either template elements or render function settings.

6. **Accessibility:** Follow ARIA calendar patterns with proper roles, keyboard navigation (arrows for dates, Enter to select, Escape to close), and screen reader announcements.

7. **Restrictions:** Support minDate, maxDate, disabledDates array, disabledDays array for comprehensive date constraints.

8. **Locale:** Use browser Intl API for formatting, with override capability for custom locales.

9. **Mobile UX:** Consider touch-optimized overlay positioning, possibly with bottom sheet pattern for mobile.

10. **Form Integration:** Use ElementInternals for native form participation and validation.

11. **State Variants:** Support disabled, readonly, invalid states consistently with other form components.

12. **Inline Mode:** Support both popup and inline display modes.

13. **Navigation:** Consider month/year dropdowns for quick navigation through large date ranges.

---

## 11. Accessibility

### ARIA Implementation

The Calendar component includes comprehensive ARIA support:

**Input Element:**
- Role: `combobox`
- `aria-autocomplete="none"`
- `aria-haspopup="dialog"`
- `aria-expanded` (true when popup open)
- `aria-controls` (references popup ID)
- `aria-label` or `aria-labelledby` for identification

**Optional Calendar Button:**
- `aria-haspopup` attribute
- `aria-expanded` reflects popup state
- `aria-controls` links to popup
- `aria-label` describes button purpose

**Popup Panel:**
- Role: `dialog`
- `aria-modal="true"`
- `aria-label` identifies the calendar

**Navigation Buttons:**
- `aria-label` values from locale API:
  - prevYear, nextYear
  - prevMonth, nextMonth
  - prevDecade, nextDecade
  - chooseMonth, chooseYear (for pickers)

**Date Table:**
- Role: `grid`
- Proper `scope` and `abbr` tags for headers
- Each date cell has `aria-label` with full date
- Selected dates have `aria-selected="true"`

### Keyboard Support

**Input Field Focus:**
- **Enter** or **Space**: Open calendar popup
- **Tab**: Move to next focusable element

**Calendar Popup Open:**
- **Arrow Keys**: Navigate between dates
  - Up/Down: Move by week
  - Left/Right: Move by day
- **Enter**: Select focused date and close popup
- **Space**: Select focused date
- **Escape**: Close popup without selection
- **Tab**: Navigate through popup controls
- **Page Up/Down**: Navigate by month
- **Home**: First day of month
- **End**: Last day of month

**Month/Year Navigators:**
- **Tab**: Navigate to dropdowns
- **Arrow Keys**: Navigate dropdown options
- **Enter**: Select option

### Focus Management

- Input field is keyboard focusable
- Focus returns to input/button when popup closes
- Focus trap within popup when open
- Visual focus indicators on dates and controls
- Logical tab order through popup elements

### Screen Reader Support

- Input announces current value
- Popup open/close state communicated
- Date navigation announces current date
- Selected date changes announced
- Navigation between months/years announced
- Disabled dates identified
- Date restrictions communicated

### Known Accessibility Issues

**Focus Loss (v10.8.4):**
When hovering over the calendar and pressing Escape without navigating, focus unexpectedly moves to page root instead of returning to the trigger. This is a bug tracked in GitHub issues.

**Manual Input Challenges:**
Delete/backspace clears entire input, making corrections difficult. This affects keyboard-only users. Workaround: use readOnlyInput to disable manual entry.

### Best Practices

1. **Always Label:** Provide aria-label or associate with a label element
2. **ReadOnlyInput Recommended:** Prevents input errors and simplifies keyboard interaction
3. **Clear Instructions:** Indicate date format and any restrictions
4. **Error Messages:** Use invalid state with descriptive error text
5. **Min/Max Boundaries:** Clearly communicate date restrictions
6. **Icon Trigger:** showIcon provides larger click target for motor impairments
7. **Touch Optimization:** Use touchUI for mobile/tablet interfaces
8. **High Contrast:** Ensure calendar works with high contrast modes
9. **Focus Indicators:** Don't remove focus outlines via CSS

---

## 12. Pattern Support Levels

### Native Support

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single Date Selection | ✅ | Native | Default selectionMode |
| Multiple Date Selection | ✅ | Native | selectionMode="multiple" |
| Date Range Selection | ✅ | Native | selectionMode="range" |
| Time Selection | ✅ | Native | showTime prop with 12/24 hour format |
| Time Only Mode | ✅ | Native | timeOnly prop |
| Month View | ✅ | Native | view="month" |
| Year View | ✅ | Native | view="year" |
| Inline Display | ✅ | Native | inline prop |
| Popup Display | ✅ | Native | Default mode |
| Date Boundaries | ✅ | Native | minDate and maxDate props |
| Disabled Dates | ✅ | Native | disabledDates array |
| Disabled Days | ✅ | Native | disabledDays array (0-6) |
| Date Format | ✅ | Native | dateFormat prop |
| Locale Support | ✅ | Native | locale prop with addLocale API |
| Icon Trigger | ✅ | Native | showIcon prop |
| Button Bar | ✅ | Native | showButtonBar prop |
| Month Navigator | ✅ | Native | monthNavigator prop |
| Year Navigator | ✅ | Native | yearNavigator with yearRange |
| Multiple Months | ✅ | Native | numberOfMonths prop |
| Touch UI | ✅ | Native | touchUI prop |
| ReadOnly Input | ✅ | Native | readOnlyInput prop |
| Disabled State | ✅ | Native | disabled prop |
| Invalid State | ✅ | Native | invalid prop |
| Visual Variants | ✅ | Native | variant prop (outlined/filled) |

### Template-Based Support

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom Date Rendering | ✅ | Template | dateTemplate prop with metadata |
| Custom Header | ✅ | Template | headerTemplate prop |
| Custom Footer | ✅ | Template | footerTemplate prop |
| Preset Dates | ✅ | Template | Via footerTemplate with custom buttons |
| Event Indicators | ✅ | Template | Via dateTemplate styling |
| Availability Display | ✅ | Template | Via dateTemplate conditional rendering |

### CSS-Only Customization

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size Variants | ✅ | CSS | p-inputtext-sm, p-inputtext-lg classes |
| Custom Styling | ✅ | CSS | className and style props |
| Theme Colors | ✅ | CSS | PrimeReact theme variables |

### Not Supported

| Pattern | Present | Notes |
|---------|---------|-------|
| Week Picker | ❌ | Would need custom implementation |
| Quarter Picker | ❌ | Would need custom implementation |
| Timezone Selection | ❌ | Uses browser local time |
| Relative Date Input | ❌ | No "3 days ago" parsing |
| Date Shortcuts | ❌ | No built-in keyboard shortcuts for common dates |

---

## 13. Styling & Theming

### CSS Class Names

PrimeReact Calendar uses the following CSS class structure:

- `.p-calendar` - Main wrapper element
- `.p-calendar-w-btn` - Wrapper when showIcon is true
- `.p-inputtext` - Input element (inherits from PrimeReact input styling)
- `.p-calendar-trigger` - Calendar icon button
- `.p-datepicker` - Calendar popup panel
- `.p-datepicker-header` - Header section with navigation
- `.p-datepicker-prev` - Previous month/year button
- `.p-datepicker-next` - Next month/year button
- `.p-datepicker-title` - Month/year display area
- `.p-datepicker-table` - Date grid table
- `.p-datepicker-today` - Today's date cell
- `.p-datepicker-other-month` - Dates from other months
- `.p-disabled` - Disabled dates
- `.p-highlight` - Selected date(s)
- `.p-datepicker-buttonbar` - Footer button bar
- `.p-timepicker` - Time selection controls

### Custom Styling

```css
/* Customize input size */
.custom-calendar .p-inputtext {
  width: 200px;
  height: 40px;
  font-size: 1rem;
}

/* Style calendar panel */
.custom-calendar .p-datepicker {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

/* Highlight weekends */
.custom-calendar .p-datepicker-table td:first-child,
.custom-calendar .p-datepicker-table td:last-child {
  background-color: #f0f0f0;
}

/* Custom selected date styling */
.custom-calendar .p-highlight {
  background-color: #007bff;
  color: white;
}

/* Today indicator */
.custom-calendar .p-datepicker-today > span {
  border: 2px solid #007bff;
}
```

### Theme Integration

PrimeReact Calendar integrates with PrimeReact's theming system:

```jsx
import { PrimeReactProvider } from 'primereact/api';

<PrimeReactProvider theme="lara-light-blue">
  <Calendar value={date} onChange={(e) => setDate(e.value)} />
</PrimeReactProvider>
```

Available themes include:
- Lara (light/dark)
- Material Design
- Bootstrap
- Fluent
- And many more

### CSS Variables

Leverage CSS custom properties for dynamic theming:

```css
:root {
  --primary-color: #007bff;
  --surface-ground: #ffffff;
  --text-color: #333333;
}

.p-calendar {
  --calendar-highlight-bg: var(--primary-color);
}
```

---

## 14. Related Components

Within the PrimeReact ecosystem:

- **InputText** - Basic text input (fallback for simple date entry)
- **Dropdown** - Selection pattern (similar to month/year navigators)
- **Button** - Trigger button (when using showIcon)
- **OverlayPanel** - Popup pattern (similar calendar overlay behavior)
- **InputNumber** - Numeric input (time picker uses similar controls)
- **Form** - Form validation and integration
- **FloatLabel** - Label positioning pattern

---

## 15. Version Information

- **Component Availability:** PrimeReact v1.0+ (legacy), significantly enhanced in v8+
- **Current Versions:** v8 (stable, widely used), v10+ (latest with enhanced accessibility)
- **v8 Documentation:** www.primefaces.org/primereact-v8/calendar/ (access restricted during research)
- **Current Documentation:** primereact.org/calendar/
- **Documentation Last Verified:** 2025-11-10
- **Current Status:** Active, maintained component with ongoing improvements

**Version Milestones:**
- **v8:** Established API, stable feature set
- **v10:** Enhanced ARIA support, improved keyboard navigation
- **v10.8.4:** Known focus management issue with Escape key

---

## Summary

The PrimeReact Calendar is a comprehensive, mature date/time selection component supporting:

✅ Three selection modes (single, multiple, range)
✅ Time selection with 12/24 hour formats
✅ Time-only mode
✅ Month and year view modes
✅ Inline and popup display
✅ Date boundaries (min/max)
✅ Disabled dates and days
✅ Custom date formatting
✅ Locale/internationalization
✅ Icon trigger
✅ Button bar (today/clear)
✅ Month/year navigation dropdowns
✅ Multiple month display
✅ Touch-optimized UI
✅ Read-only input mode
✅ Disabled state
✅ Invalid/error state
✅ Template customization (date, header, footer)
✅ ARIA accessibility features
✅ Keyboard navigation
✅ Screen reader support
✅ Theme integration
✅ Visual variants (outlined/filled)

The component represents a feature-complete, production-ready date/time picker suitable for enterprise applications with complex date selection requirements, internationalization needs, and accessibility standards.

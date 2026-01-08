# Semantic UI React - Calendar Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://github.com/arfedulov/semantic-ui-calendar-react
Status: ⚠️ Package Archived (August 17, 2025) - Read-only
Live Demo: https://arfedulov.github.io/semantic-ui-calendar-react/
Version: 0.8.0+ (CSS-free)
Last Verified: 2025-11-10

## Documentation Quality
Good - Comprehensive README with detailed API reference, multiple component types, clear usage examples, and props documentation. Live demo site available. However, package is now archived and no longer maintained.

## Component Definition
- **Core purpose**: A datepicker and calendar input component system for Semantic UI React that provides date, time, and date range selection capabilities.
- **Mental model**: A collection of specialized input components that extend Semantic UI's Input component with calendar/time picker popups. Each component is purpose-built for specific temporal selection needs (date, time, datetime, range, month, year).
- **Semantic meaning**: Form input components for temporal data selection. Communicates "select a date/time value" with visual calendar/clock interfaces. Third-party package, not part of core Semantic UI React (no official calendar component exists in core).

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Date input | ✅ | Native | `DateInput` component for single date selection with calendar popup |
| Time input | ✅ | Native | `TimeInput` component for time selection with clock picker |
| Date-time input | ✅ | Native | `DateTimeInput` component combining date and time selection in single input |
| Range input | ✅ | Native | `DatesRangeInput` component for selecting start and end dates |
| Month input | ✅ | Native | `MonthInput` component for month-only selection |
| Year input | ✅ | Native | `YearInput` component for year-only selection |
| Calendar popup | ✅ | Native | Default behavior - calendar appears as popup on input focus |
| Inline calendar | ✅ | Native | `inline` boolean prop displays calendar permanently without popup |
| Custom format | ✅ | Native | `dateFormat`, `timeFormat`, `dateTimeFormat` props using moment.js format strings |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single date | ✅ | Native | `DateInput` component - primary single date selection |
| Date range | ✅ | Native | `DatesRangeInput` component with start/end date selection; `allowSameEndDate` prop for same-day ranges |
| Time only | ✅ | Native | `TimeInput` component with 24-hour or AM/PM format via `timeFormat` prop |
| Date + Time | ✅ | Native | `DateTimeInput` component with combined picker; configurable separator via `divider` prop |
| Month picker | ✅ | Native | `MonthInput` component for month-level selection |
| Year picker | ✅ | Native | `YearInput` component for year-level selection |
| Multi-date | ❌ | Not Available | No support for selecting multiple non-contiguous dates |
| Week picker | ❌ | Not Available | No dedicated week selection component |
| Quarter picker | ❌ | Not Available | No quarter-based selection |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled value | ✅ | Native | `value` prop with `onChange` handler following standard Semantic UI React pattern |
| Disabled dates | ✅ | Native | `disable` prop accepts string/moment/Date/Array to disable specific dates; `enable` Array prop enables only specified dates |
| Min/Max dates | ✅ | Native | `minDate` and `maxDate` props restrict selectable date range (string or moment) |
| Clearable | ✅ | Native | `clearable` boolean enables clear button; `clearIcon` prop for custom icon; `onClear` callback |
| Marked dates | ✅ | Native | `marked` prop (moment/Date/Array) highlights dates; `markColor` prop for Semantic UI color |
| Read-only | ✅ | Composed | Can use standard Semantic UI Input `readOnly` prop |
| Error state | ✅ | Composed | Can use standard Semantic UI Input `error` prop |
| Loading state | ✅ | Composed | Can use standard Semantic UI Input `loading` prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Composed | Standard Semantic UI Input size variations (mini, small, large, big, huge, massive) |
| Icon position | ✅ | Native | `iconPosition` prop: 'left' or 'right' (default: 'right'); `icon` prop for custom icon or false to hide |
| Popup position | ✅ | Native | `popupPosition` prop: 'top left', 'top right', 'bottom left', 'bottom right', 'top center', 'bottom center' (default: 'top left') |
| Inline label | ✅ | Native | `inlineLabel` boolean places label beside input instead of above |
| Start mode | ✅ | Native | `startMode` prop: 'year', 'month', or 'day' (default: 'day') - sets initial calendar view level |
| Closable | ✅ | Native | `closable` boolean auto-closes popup after date selection |
| Close behavior | ✅ | Native | `closeOnMouseLeave` boolean closes on cursor exit (default: true) |
| Locale | ✅ | Native | `localization` prop accepts moment locale code; requires moment locale import |
| Custom picker size | ✅ | Native | `pickerWidth` string prop for custom width; `pickerStyle` object for advanced styling |
| Animation | ✅ | Native | `animation` string (default: 'scale') and `duration` number in ms (default: 200) |
| Mobile keyboard | ✅ | Native | `hideMobileKeyboard` boolean prevents mobile keyboard display |
| Mount node | ✅ | Native | `mountNode` prop specifies DOM node for picker rendering (portal-like behavior) |
| Preserve view mode | ✅ | Native | `preserveViewMode` boolean remembers last view mode (default: true) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | `onChange(event, {name, value})` - standard Semantic UI React event signature |
| onClear callback | ✅ | Native | `onClear` function triggered after clear icon click |
| Initial date | ✅ | Native | `initialDate` prop (string/moment/Date) sets calendar opening date (defaults to today) |
| Keyboard navigation | ⚠️ | Unknown | Not documented in README - unclear if keyboard navigation within calendar is supported |
| Click outside to close | ✅ | Native | Popup closes on outside click (standard popup behavior) |
| Mouse leave to close | ✅ | Native | `closeOnMouseLeave` boolean (default: true) |

## Code Examples

### Basic DateInput Example
```javascript
import React from 'react';
import { Form } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';

class DateForm extends React.Component {
  state = { date: '' };

  handleChange = (event, {name, value}) => {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Form>
        <DateInput
          name="date"
          placeholder="Date"
          value={this.state.date}
          iconPosition="left"
          onChange={this.handleChange}
        />
      </Form>
    );
  }
}
```

### TimeInput Example
```javascript
import { TimeInput } from 'semantic-ui-calendar-react';

// 24-hour format (default)
<TimeInput
  name="time"
  placeholder="Time"
  value={this.state.time}
  iconPosition="left"
  onChange={this.handleChange}
/>

// AM/PM format
<TimeInput
  name="time"
  placeholder="Time"
  value={this.state.time}
  timeFormat="AMPM"
  onChange={this.handleChange}
/>

// Without minutes
<TimeInput
  name="time"
  placeholder="Time"
  value={this.state.time}
  disableMinute
  onChange={this.handleChange}
/>
```

### DateTimeInput Example
```javascript
import { DateTimeInput } from 'semantic-ui-calendar-react';

<DateTimeInput
  name="dateTime"
  placeholder="Date Time"
  value={this.state.dateTime}
  iconPosition="left"
  onChange={this.handleChange}
/>

// Custom format and divider
<DateTimeInput
  name="dateTime"
  placeholder="Date Time"
  value={this.state.dateTime}
  dateFormat="YYYY-MM-DD"
  timeFormat="AMPM"
  divider=" at "
  onChange={this.handleChange}
/>
```

### DatesRangeInput Example
```javascript
import { DatesRangeInput } from 'semantic-ui-calendar-react';

<DatesRangeInput
  name="datesRange"
  placeholder="From - To"
  value={this.state.datesRange}
  iconPosition="left"
  onChange={this.handleChange}
/>

// Allow same start and end date
<DatesRangeInput
  name="datesRange"
  placeholder="From - To"
  value={this.state.datesRange}
  allowSameEndDate
  onChange={this.handleChange}
/>
```

### Inline Calendar Example
```javascript
<DateInput
  inline
  name="date"
  value={this.state.date}
  onChange={this.handleChange}
/>
```

### Clearable Input Example
```javascript
import { Icon } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';

<DateInput
  clearable
  clearIcon={<Icon name="remove" color="red" />}
  name="date"
  value={this.state.date}
  onChange={this.handleChange}
  onClear={() => console.log('Cleared!')}
/>
```

### Date Restrictions Example
```javascript
import moment from 'moment';

// Min and max dates
<DateInput
  name="date"
  value={this.state.date}
  minDate="2020-01-01"
  maxDate={moment().add(1, 'year')}
  onChange={this.handleChange}
/>

// Disable specific dates
<DateInput
  name="date"
  value={this.state.date}
  disable={['2025-12-25', '2025-12-31']}
  onChange={this.handleChange}
/>

// Enable only specific dates (all others disabled)
<DateInput
  name="date"
  value={this.state.date}
  enable={['2025-12-25', '2025-12-26', '2025-12-27']}
  onChange={this.handleChange}
/>
```

### Marked Dates Example
```javascript
import moment from 'moment';

<DateInput
  name="date"
  value={this.state.date}
  marked={[moment(), moment().add(3, 'days')]}
  markColor="red"
  onChange={this.handleChange}
/>
```

### Localization Example
```javascript
import moment from 'moment';
import 'moment/locale/ru';

// Global locale (affects all moment instances)
moment.locale('ru');

// Component-level locale
<DateInput
  name="date"
  value={this.state.date}
  localization="ru"
  onChange={this.handleChange}
/>
```

### Complete Multi-Input Form Example
```javascript
import React from 'react';
import { Form } from 'semantic-ui-react';
import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput,
  YearInput,
  MonthInput
} from 'semantic-ui-calendar-react';

class DateTimeForm extends React.Component {
  state = {
    date: '',
    time: '',
    dateTime: '',
    datesRange: '',
    year: '',
    month: ''
  };

  handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <Form>
        <DateInput
          name="date"
          placeholder="Date"
          value={this.state.date}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <TimeInput
          name="time"
          placeholder="Time"
          value={this.state.time}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <DateTimeInput
          name="dateTime"
          placeholder="Date Time"
          value={this.state.dateTime}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <DatesRangeInput
          name="datesRange"
          placeholder="From - To"
          value={this.state.datesRange}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <YearInput
          name="year"
          placeholder="Year"
          value={this.state.year}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <MonthInput
          name="month"
          placeholder="Month"
          value={this.state.month}
          iconPosition="left"
          onChange={this.handleChange}
        />
      </Form>
    );
  }
  }
```

### Custom Picker Styling Example
```javascript
<DateInput
  name="date"
  value={this.state.date}
  pickerWidth="400px"
  pickerStyle={{
    border: '2px solid blue',
    borderRadius: '8px'
  }}
  onChange={this.handleChange}
/>
```

### Custom Animation Example
```javascript
<DateInput
  name="date"
  value={this.state.date}
  animation="fade"
  duration={300}
  onChange={this.handleChange}
/>
```

## Notable Features

### CSS-Free Architecture
Starting with version 0.8.0, the component is completely CSS-free, relying solely on Semantic UI React's styling system. This eliminates stylesheet conflicts and simplifies integration.

### Moment.js Integration
Deep integration with moment.js provides:
- Flexible date formatting via standard moment format strings
- Comprehensive internationalization and localization support
- Robust date parsing and manipulation
- Timezone support through moment-timezone (if installed)

### Multiple Input Component Types
Six specialized components for different temporal selection needs:
1. **DateInput** - Single date selection
2. **TimeInput** - Time-only selection with format options
3. **DateTimeInput** - Combined date and time
4. **DatesRangeInput** - Start and end date pairs
5. **YearInput** - Year-level selection
6. **MonthInput** - Month-level selection

### Date Restriction System
Comprehensive date constraint options:
- **Min/Max Dates**: Set selectable range boundaries
- **Disable Array**: Block specific dates or date arrays
- **Enable Array**: Whitelist-only approach (all dates disabled except listed)
- Supports string, moment, or Date object formats

### Marked Dates
Visual highlighting system for important dates:
- Accepts single date or array of dates
- Customizable mark color using Semantic UI color names
- Useful for events, deadlines, or special dates

### Flexible Display Modes
Three primary display modes:
1. **Popup Mode** (default) - Calendar appears on input focus
2. **Inline Mode** - Persistent calendar display
3. **Clearable Mode** - Adds clear button to reset value

### Popup Positioning
Eight position options for popup calendar:
- Top: left, center, right
- Bottom: left, center, right
- Default: "top left"

### Calendar Start Mode
Three entry points for calendar navigation:
- **day** (default) - Month view with selectable days
- **month** - Year view with selectable months
- **year** - Decade view with selectable years

### Time Format Options
Three time display formats:
- **"24"** - 24-hour format (default)
- **"AMPM"** - Uppercase AM/PM
- **"ampm"** - Lowercase am/pm

### Mobile-Friendly Features
- `hideMobileKeyboard` prop prevents mobile keyboard interference
- Touch-friendly calendar interface
- Responsive popup positioning

### Animation System
Customizable popup animations:
- Default: 'scale' animation
- Configurable animation type via CSS class name
- Adjustable duration (default: 200ms)

### View Mode Persistence
`preserveViewMode` (default: true) remembers last calendar view level:
- User navigates to year view → next opening shows year view
- Improves UX for repeated year/month selections

### Portal-Like Mounting
`mountNode` prop allows rendering calendar popup to specific DOM node:
- Useful for avoiding z-index issues
- Enables better control over popup rendering context
- Similar to React Portal pattern

### Semantic UI React Integration
Full compatibility with Semantic UI React ecosystem:
- Inherits all standard Input props
- Works within Form components
- Supports all size variations (mini, small, large, etc.)
- Compatible with error, loading, disabled states
- Follows Semantic UI React event signature conventions

## Research Notes

### Package Status
**IMPORTANT**: Repository was archived on August 17, 2025, and is now read-only. No further development or maintenance expected. Consider this when planning long-term usage.

### Third-Party Nature
This is NOT part of core Semantic UI React. It's a community-created package that fills the gap for calendar/datepicker functionality. Semantic UI React core has no official calendar component (see GitHub issue #908).

### Documentation Access
- **GitHub**: https://github.com/arfedulov/semantic-ui-calendar-react (archived, read-only)
- **NPM**: https://www.npmjs.com/package/semantic-ui-calendar-react (403 error on direct access)
- **Live Demo**: https://arfedulov.github.io/semantic-ui-calendar-react/ (functional interactive examples)
- **CDN**: Available via jsDelivr for quick testing

### Installation Methods
Two primary installation approaches:
1. **NPM Package**: `npm i semantic-ui-calendar-react` (standard approach)
2. **CDN**: `https://cdn.jsdelivr.net/npm/semantic-ui-calendar-react@latest/dist/umd/semantic-ui-calendar-react.js` (for quick prototyping)

### Dependency Requirements
- **React**: Peer dependency (version not specified in documentation)
- **Semantic UI React**: Required peer dependency
- **Moment.js**: Required for date formatting and localization
- **Moment Locales**: Optional, import as needed for internationalization

### Implementation Observations
- Built using Semantic UI React Input component as foundation
- Popup behavior likely uses Semantic UI React Popup component internally
- CSS-free design suggests heavy reliance on Semantic UI React's theming system
- Event signature follows standard Semantic UI React pattern: `(event, {name, value})`

### Unique Strengths
1. **Component Specialization**: Six purpose-built components vs. one monolithic calendar
2. **CSS-Free**: Zero stylesheet dependencies (v0.8.0+)
3. **Moment.js Integration**: Powerful formatting and i18n without custom implementation
4. **Date Restriction Flexibility**: Enable/disable specific dates, min/max, marked dates
5. **Multiple Display Modes**: Popup, inline, and clearable variations
6. **Semantic UI React Native**: Perfect integration with SUI React ecosystem
7. **View Mode Persistence**: Remembers user's preferred calendar navigation level
8. **Time Format Options**: 24-hour and AM/PM variants
9. **Range Selection**: Dedicated component for date ranges
10. **Mobile Considerations**: Keyboard hiding and touch-friendly design

### Potential Limitations
1. **No Multi-Date Selection**: Cannot select multiple non-contiguous dates
2. **No Week Picker**: Missing week-based selection component
3. **No Quarter Picker**: No quarter-based selection
4. **Archived Status**: No future updates or bug fixes expected
5. **Moment.js Dependency**: Moment is in maintenance mode (consider alternatives like Day.js)
6. **Limited Accessibility Documentation**: ARIA support not explicitly documented
7. **No Timezone Picker**: Requires manual moment-timezone integration
8. **No Recurring Date Patterns**: No built-in support for recurring events

### Migration Considerations
Given the archived status, users should consider:
1. **Forking**: Create maintained fork if critical to project
2. **Alternative Libraries**: Explore react-datepicker, react-day-picker, or date-fns-based solutions
3. **Day.js Migration**: Consider porting to Day.js (moment-compatible API, smaller bundle)
4. **Custom Implementation**: Build custom calendar using Semantic UI React primitives

### Alternative Packages
Related packages discovered during research:
- `semantic-ui-calendar` - Original jQuery-based version for vanilla Semantic UI
- `mf-semantic-ui-calendar` - Alternative npm package (unclear if maintained)
- Official Semantic UI React has no native calendar (GitHub issue #908 remains open)

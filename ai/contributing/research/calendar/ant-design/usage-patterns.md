# Ant Design - Calendar / Date Picker Usage Patterns

## Component URL
https://ant.design/components/date-picker

Status: ✅ Working
Version: 5.x (Current - Latest features include v5.14.0 enhancements)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - The documentation provides detailed API tables, extensive props documentation, version notes, and GitHub-hosted markdown files with complete specifications.

## Component Definition
- **Core purpose**: Enables users to select or input dates through an accessible input field that opens a popup calendar interface. Solves the fundamental problem of date entry and selection in forms and data entry scenarios.
- **Mental model**: Users think of this as an interactive date entry field - click to open a calendar, select a date visually or type it in directly, with optional time selection for datetime scenarios.
- **Semantic meaning**: Communicates a temporal data input point in the UI, signaling to users that date/time information is required or can be provided. The component represents a standardized, culturally-aware method for date entry.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `showTime={true}`, `disabled={true}`)
- **Composed**: Via composition/children (e.g., `renderExtraFooter`)
- **CSS-only**: Requires custom styling (not primary pattern for Ant Design)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Date input field | ✅ | Native | Built-in text input with date formatting, supports keyboard entry |
| Calendar popup | ✅ | Native | Full calendar interface opens on click/focus |
| Time selection | ✅ | Native | `showTime` prop enables integrated time picker |
| Custom format | ✅ | Native | `format` prop accepts string, array, function, or object with mask type |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single date | ✅ | Native | Default `<DatePicker />` component |
| Date range | ✅ | Native | `<RangePicker />` component with start/end selection |
| Multiple dates | ✅ | Native | `multiple` prop on DatePicker (v5.14.0+) |
| Month picker | ✅ | Native | `picker="month"` prop |
| Year picker | ✅ | Native | `picker="year"` prop |
| Week picker | ✅ | Native | `picker="week"` prop with `showWeek` display option (v5.14.0+) |
| Quarter picker | ✅ | Native | `picker="quarter"` prop (v4.1.0+) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop (boolean), array format `[true, false]` for RangePicker to disable individual inputs |
| Read-only | ✅ | Native | `inputReadOnly` prop prevents manual text entry while allowing calendar selection |
| Error state | ✅ | Native | `status="error"` prop for validation feedback |
| Loading | ❌ | CSS-only | No native loading state, would require custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="small"` \| `"middle"` \| `"large"` (middle is default) |
| Date restrictions | ✅ | Native | `disabledDate` function, `minDate`/`maxDate` props, `disabledTime` for time restrictions (works with showTime) |
| Locale support | ✅ | Native | Via ConfigProvider or component-level `locale` prop, supports dayjs/luxon locales |
| Custom rendering | ✅ | Native | `cellRender` function for custom cell content (v5.4.0+, replaces dateRender) |
| Presets | ✅ | Native | `presets` array on RangePicker for quick date range selection, supports callback functions (v5.8.0+) |
| Timezone support | ✅ | Composed | Via dayjs/luxon timezone plugins, not built into component but supported through date library |
| Visual variants | ✅ | Native | `variant="outlined"` \| `"borderless"` \| `"filled"` \| `"underlined"` (v5.13.0+) |
| Panel control | ✅ | Native | `open` prop for controlled visibility, `mode` prop for panel display mode |
| Custom footer | ✅ | Native | `renderExtraFooter` function to add custom content below calendar |
| Component replacement | ✅ | Native | `components` prop for replacing internal components (v5.14.0+) |

## Code Examples

### Basic DatePicker
```jsx
import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';

const App = () => {
  const [date, setDate] = useState(null);

  const handleChange = (value) => {
    console.log('Selected Date:', value ? value.format('YYYY-MM-DD') : 'None');
    setDate(value);
  };

  return (
    <Space direction="vertical">
      <DatePicker onChange={handleChange} />
      <div>Selected: {date ? date.format('YYYY-MM-DD') : 'None'}</div>
    </Space>
  );
};

export default App;
```

### RangePicker with Time Selection
```jsx
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const App = () => {
  const onChange = (dates, dateStrings) => {
    console.log('From:', dateStrings[0], 'To:', dateStrings[1]);
  };

  const onOk = (value) => {
    console.log('onOk:', value);
  };

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
        onOk={onOk}
      />
    </Space>
  );
};
```

### Size Variations
```jsx
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const App = () => (
  <Space direction="vertical" size={12}>
    <DatePicker size="large" placeholder="Large" />
    <DatePicker placeholder="Default (Middle)" />
    <DatePicker size="small" placeholder="Small" />
    <RangePicker size="large" />
  </Space>
);
```

### Disabled Dates and Times
```jsx
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// Disable dates before today
const disabledDate = (current) => {
  return current && current < dayjs().endOf('day');
};

// Disable specific time ranges
const disabledRangeTime = (_, type) => {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};

const App = () => (
  <RangePicker
    showTime
    disabledDate={disabledDate}
    disabledTime={disabledRangeTime}
  />
);
```

### Disabled States (Individual Inputs)
```jsx
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const App = () => (
  <Space direction="vertical" size={12}>
    {/* Disable entire picker */}
    <DatePicker disabled />

    {/* Disable start date only */}
    <RangePicker disabled={[true, false]} />

    {/* Disable end date only */}
    <RangePicker disabled={[false, true]} />
  </Space>
);
```

### Presets for Quick Selection
```jsx
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const App = () => (
  <RangePicker
    presets={[
      { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
      { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
      { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
      { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
    ]}
  />
);
```

### Different Picker Types
```jsx
import { DatePicker, Space } from 'antd';

const App = () => (
  <Space direction="vertical" size={12}>
    <DatePicker picker="date" placeholder="Select Date" />
    <DatePicker picker="week" placeholder="Select Week" />
    <DatePicker picker="month" placeholder="Select Month" />
    <DatePicker picker="quarter" placeholder="Select Quarter" />
    <DatePicker picker="year" placeholder="Select Year" />
  </Space>
);
```

### Status and Variants
```jsx
import { DatePicker, Space } from 'antd';

const App = () => (
  <Space direction="vertical" size={12}>
    <DatePicker status="error" placeholder="Error state" />
    <DatePicker status="warning" placeholder="Warning state" />

    <DatePicker variant="outlined" placeholder="Outlined (default)" />
    <DatePicker variant="filled" placeholder="Filled" />
    <DatePicker variant="borderless" placeholder="Borderless" />
  </Space>
);
```

### Custom Cell Rendering
```jsx
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const App = () => {
  const cellRender = (current, info) => {
    // Highlight weekends
    if (current.day() === 0 || current.day() === 6) {
      return (
        <div style={{
          border: '1px solid #1890ff',
          borderRadius: '50%'
        }}>
          {current.date()}
        </div>
      );
    }
    return info.originNode;
  };

  return <DatePicker cellRender={cellRender} />;
};
```

### Locale Configuration
```jsx
import { ConfigProvider, DatePicker } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const App = () => (
  <ConfigProvider locale={locale}>
    <DatePicker />
  </ConfigProvider>
);
```

[View Live Examples](https://ant.design/components/date-picker#components-date-picker-demo-basic)

## Notable Features

### Advanced Date Library Support
- **Flexible Date Libraries**: Since v5.4.0, Ant Design supports replacing dayjs with luxon or other date libraries while maintaining full functionality
- **Custom Date Library Integration**: Provides a plugin system for custom date libraries via `generatePicker` utility

### Enhanced Control and Flexibility
- **Mask Input Format**: v5.14.0 introduced `format={{ type: 'mask', format: 'YYYY-MM-DD' }}` for guided input
- **Controlled Panel Visibility**: `open` prop enables complete control over calendar popup display
- **Confirm Button**: `needConfirm` prop requires explicit confirmation before date selection completes
- **Multi-level Time Restrictions**: `disabledTime` supports `info.from` parameter for sophisticated range-based time limitations (2025 enhancement)

### Component Composition
- **Custom Footer**: `renderExtraFooter` function allows adding action buttons or info text below the calendar
- **Component Replacement**: v5.14.0 `components` prop enables replacing internal subcomponents for deep customization
- **Clear Button Customization**: `allowClear` accepts object to customize the clear button appearance

### Accessibility and UX
- **Keyboard Navigation**: Full keyboard support for date navigation and selection
- **Auto Focus**: `autoFocus` prop for immediate interaction on mount
- **Placeholder Customization**: String or array format for single/range pickers
- **Visual Feedback**: Status prop (`error`, `warning`) provides immediate validation feedback
- **Multiple Visual Variants**: Four distinct styles (outlined, filled, borderless, underlined) for different design systems

### Panel Control
- **Mode Control**: Switch between date/month/year panel views programmatically
- **Default Panel Date**: `defaultPickerValue` sets the initial calendar view without setting a selected value
- **Panel Change Callbacks**: `onPanelChange` tracks when users navigate between months/years

### Developer Experience
- **TypeScript Support**: Full type definitions included
- **Methods API**: `blur()` and `focus()` methods for programmatic control
- **Comprehensive Event Callbacks**: onChange, onOk, onOpenChange, onPanelChange, onFocus, onBlur with detailed parameters
- **Range-Aware Events**: v5.14.0 adds range position indicator (`start`/`end`) to focus/blur events

## Research Notes

### Documentation Access
- The main documentation at https://ant.design/components/date-picker renders primarily CSS in direct fetches, but the content is accessible via web search and GitHub
- The authoritative documentation source is the GitHub markdown file at https://github.com/ant-design/ant-design/blob/master/components/date-picker/index.en-US.md
- Code examples are comprehensive but sometimes spread across multiple tutorial sites (GeeksforGeeks, Scaler, Tabnine)

### Framework Approach Observations
- **React-First Design**: Deeply integrated with React ecosystem (hooks, component patterns)
- **Date Library Agnostic**: Modern versions (5.4.0+) support multiple date libraries, showing architectural flexibility
- **Comprehensive Native Support**: Almost every common date/time pattern has native prop support rather than requiring composition
- **Continuous Enhancement**: Active development with meaningful features added in recent versions (5.13.0 variants, 5.14.0 mask input and component replacement)
- **Enterprise Focus**: Feature set clearly targets enterprise form scenarios (validation states, customization, accessibility)

### Version Evolution
- **v4.1.0**: Added quarter picker
- **v4.4.0**: Added `showNow` for current datetime shortcut
- **v5.4.0**: Introduced `cellRender` (replaced `dateRender`), added luxon support
- **v5.8.0**: Enhanced presets with callback function support
- **v5.13.0**: Added `variant` prop for visual styles
- **v5.14.0**: Major enhancements - `multiple` selection, mask format, component replacement, improved TypeScript types

### Integration Patterns
- Global configuration via `ConfigProvider` for consistent locale/theme settings
- Individual component-level props override global settings
- Seamless integration with Ant Design Form component for validation
- Event-driven architecture with comprehensive callback props

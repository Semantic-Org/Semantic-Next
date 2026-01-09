# Ant Design - Statistic Component Usage Patterns

## Research Metadata
- **Framework**: Ant Design (React)
- **Component**: Statistic
- **Documentation URL**: https://ant.design/components/statistic/
- **Research Date**: 2025-11-04
- **URL Status**: Accessible (web search and documentation extraction)

---

## Component Definition

### Statistic Component
**Purpose**: Display statistical numbers with enhanced visual prominence. Used to highlight important numerical data and present statistical information with accompanying descriptive titles.

**Mental Model**: Statistic is a **numeric display** component designed to:
- Highlight important numerical data prominently
- Display counts, metrics, and key performance indicators
- Show formatted values with contextual prefixes/suffixes
- Present time-based countdowns and countups
- Provide loading states during data fetching

**Key Characteristic**: Standalone display element focused on making numbers the hero; emphasizes readability and prominence over interactivity.

---

## When to Use

Use Statistic when you need to:
- Display key metrics or KPIs prominently (active users, revenue, growth rate)
- Show formatted numbers with units or context (currency, percentages, ratios)
- Create dashboards or analytics displays
- Present time-based information (countdowns, deadlines)
- Highlight data changes with visual indicators (trend arrows)

**Common Use Cases**:
- Dashboard statistics and metrics
- Financial data display (account balances, transaction amounts)
- Analytics and reporting (conversion rates, engagement metrics)
- Countdown timers (sales end time, event start time)
- User engagement metrics (likes, followers, views)

---

## Statistic Component - Detailed Analysis

### Supported Variants & Types

#### 1. **Basic Statistic** (Level 1 - Core)
**Support**: Full
**Description**: Simple numeric display with title

```jsx
import { Statistic } from 'antd';

<Statistic title="Active Users" value={112893} />
```

**Key Features**:
- Required: `value` prop
- Optional: `title` prop for descriptive label
- Automatically formats numbers with default separators
- Clean, prominent typography

#### 2. **Precision Control** (Level 1 - Core)
**Support**: Full
**Description**: Control decimal places for numeric values

```jsx
<Statistic
  title="Account Balance (CNY)"
  value={112893}
  precision={2}
/>
// Displays: 112,893.00
```

**Key Features**:
- `precision` prop specifies decimal places
- Automatically rounds values
- Common for financial data, percentages
- Works with both integer and float values

#### 3. **Prefix and Suffix** (Level 1 - Core)
**Support**: Full
**Description**: Add contextual elements before or after the value

```jsx
import { LikeOutlined } from '@ant-design/icons';

// Icon prefix
<Statistic
  title="Feedback"
  value={1128}
  prefix={<LikeOutlined />}
/>

// Text suffix
<Statistic
  title="Unmerged"
  value={93}
  suffix="/ 100"
/>

// Percentage with suffix
<Statistic
  title="Growth Rate"
  value={11.28}
  precision={2}
  suffix="%"
/>
```

**Prefix Options**:
- React components (icons, custom elements)
- Text strings
- Commonly used for: currency symbols, icons

**Suffix Options**:
- Text strings (units, ratios)
- React components
- Commonly used for: units (%, /100), labels

#### 4. **Value Styling** (Level 1 - Core)
**Support**: Full
**Description**: Custom styling for the value portion

```jsx
<Statistic
  title="Active"
  value={11.28}
  precision={2}
  valueStyle={{ color: '#3f8600' }}
  prefix={<ArrowUpOutlined />}
  suffix="%"
/>
```

**Common Patterns**:
- Color coding for positive/negative values
- Green for increases/positive: `{ color: '#3f8600' }`
- Red for decreases/negative: `{ color: '#cf1322' }`
- Custom typography, sizing, weights
- Conditional styling based on value thresholds

#### 5. **Loading State** (Level 1 - Core)
**Support**: Full (v4.8.0+)
**Description**: Display loading indicator while data is fetching

```jsx
<Statistic
  title="Active Users"
  value={112893}
  loading
/>

// Or with boolean
<Statistic
  title="Active Users"
  value={112893}
  loading={isLoading}
/>
```

**Key Features**:
- Shows skeleton/loading placeholder
- Maintains component layout during load
- Boolean prop for dynamic control
- Added in version 4.8.0

#### 6. **Number Formatting** (Level 1 - Core)
**Support**: Full
**Description**: Control group and decimal separators

```jsx
<Statistic
  title="Large Number"
  value={1234567890}
  groupSeparator=","
  decimalSeparator="."
/>
// Displays: 1,234,567,890

// European format
<Statistic
  title="Large Number"
  value={1234567890.50}
  groupSeparator="."
  decimalSeparator=","
  precision={2}
/>
// Displays: 1.234.567.890,50
```

**Props**:
- `groupSeparator`: Thousands separator (default: `,`)
- `decimalSeparator`: Decimal separator (default: `.`)
- Supports international number formats
- Works with `precision` prop

#### 7. **Custom Formatter** (Level 2 - Common)
**Support**: Full
**Description**: Complete control over value rendering

```jsx
<Statistic
  title="Conversion Rate"
  value={0.8543}
  formatter={(value) => `${(value * 100).toFixed(2)}%`}
/>
// Displays: 85.43%

// Complex formatting
<Statistic
  title="Active Time"
  value={3665}
  formatter={(value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }}
/>
// Displays: 1h 1m
```

**Use Cases**:
- Complex number formatting
- Custom units or representations
- Conditional formatting logic
- Non-standard display requirements
- Calculations before display

#### 8. **Countdown Statistic** (Level 1 - Core)
**Support**: Full via `Statistic.Countdown`
**Description**: Time-based countdown display

```jsx
import { Statistic } from 'antd';
const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2; // 2 days from now

<Countdown
  title="Countdown"
  value={deadline}
  onFinish={() => console.log('Finished!')}
/>
```

**Key Features**:
- Automatically counts down to target time
- Updates in real-time
- `onFinish` callback when countdown reaches zero
- `onChange` callback for value updates (v4.16.0+)
- Accepts timestamp (number) or moment object

#### 9. **Countdown Formatting** (Level 1 - Core)
**Support**: Full
**Description**: Custom time display formats

```jsx
// Hours, minutes, seconds
<Countdown
  title="Countdown"
  value={deadline}
  format="HH:mm:ss"
/>

// With milliseconds
<Countdown
  title="Million Seconds"
  value={deadline}
  format="HH:mm:ss:SSS"
/>

// Day-level countdown
<Countdown
  title="Days Remaining"
  value={deadline}
  format="D 天 H 时 m 分 s 秒"
/>

// Custom format tokens
<Countdown
  value={deadline}
  format="D [days] HH:mm:ss"
/>
```

**Format Tokens** (moment.js syntax):
- `D` - Days
- `HH` - Hours (2 digits)
- `mm` - Minutes (2 digits)
- `ss` - Seconds (2 digits)
- `SSS` - Milliseconds (3 digits)
- `[text]` - Literal text (not formatted)

**Default Format**: `HH:mm:ss`

---

## Statistic API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **value** | `string \| number` | - | Display value | Level 1 |
| **title** | `ReactNode` | - | Display title | Level 1 |
| **precision** | `number` | - | Number of decimal places | Level 1 |
| **prefix** | `ReactNode` | - | Prefix node before value | Level 1 |
| **suffix** | `ReactNode` | - | Suffix node after value | Level 1 |
| **valueStyle** | `CSSProperties` | - | Custom styles for value | Level 1 |
| **loading** | `boolean` | `false` | Loading status indicator | Level 1 |
| **formatter** | `(value) => ReactNode` | - | Custom value display logic | Level 2 |
| **groupSeparator** | `string` | `,` | Thousands separator | Level 1 |
| **decimalSeparator** | `string` | `.` | Decimal separator | Level 1 |

---

## Statistic.Countdown API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **value** | `number \| moment` | - | Target countdown time | Level 1 |
| **title** | `ReactNode` | - | Display title | Level 1 |
| **format** | `string` | `HH:mm:ss` | Time format (moment syntax) | Level 1 |
| **prefix** | `ReactNode` | - | Prefix node before value | Level 1 |
| **suffix** | `ReactNode` | - | Suffix node after value | Level 1 |
| **valueStyle** | `CSSProperties` | - | Custom styles for value | Level 1 |
| **onFinish** | `() => void` | - | Callback when countdown ends | Level 1 |
| **onChange** | `(value: number) => void` | - | Callback during countdown | Level 2 |

**Note**: In version 5.25.0+, use `Statistic.Timer` instead of `Countdown` (naming change, same functionality).

---

## Common Usage Patterns

### Dashboard Statistics
**Pattern**: Display multiple metrics in a grid layout

```jsx
import { Row, Col, Statistic, Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

<Row gutter={16}>
  <Col span={6}>
    <Card>
      <Statistic
        title="Active Users"
        value={112893}
        valueStyle={{ color: '#3f8600' }}
        prefix={<ArrowUpOutlined />}
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card>
      <Statistic
        title="Revenue"
        value={98765}
        precision={2}
        prefix="$"
        valueStyle={{ color: '#3f8600' }}
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card>
      <Statistic
        title="Conversion Rate"
        value={11.28}
        precision={2}
        suffix="%"
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card>
      <Statistic
        title="Bounce Rate"
        value={9.3}
        precision={2}
        suffix="%"
        valueStyle={{ color: '#cf1322' }}
        prefix={<ArrowDownOutlined />}
      />
    </Card>
  </Col>
</Row>
```

**Key Characteristics**:
- Grid layout for multiple statistics
- Cards for visual separation
- Color coding for positive/negative values
- Icons for trend indication
- Consistent formatting within sections

### Financial Display
**Pattern**: Show monetary values with proper formatting

```jsx
// Account balance
<Statistic
  title="Account Balance"
  value={112893.45}
  precision={2}
  prefix="$"
  groupSeparator=","
  decimalSeparator="."
/>

// With currency symbol and styling
<Statistic
  title="Total Revenue"
  value={1234567.89}
  precision={2}
  prefix="¥"
  valueStyle={{ fontSize: '32px', fontWeight: 'bold' }}
/>

// Negative balance
<Statistic
  title="Outstanding"
  value={-5432.10}
  precision={2}
  prefix="$"
  valueStyle={{ color: '#cf1322' }}
/>
```

**Key Characteristics**:
- Always use `precision={2}` for currency
- Prefix with currency symbol
- Color code negative values
- Group separators for readability

### Percentage Metrics
**Pattern**: Display rates, ratios, and percentages

```jsx
// Growth rate with trend
<Statistic
  title="Growth Rate"
  value={11.28}
  precision={2}
  suffix="%"
  valueStyle={{ color: '#3f8600' }}
  prefix={<ArrowUpOutlined />}
/>

// Conversion rate
<Statistic
  title="Conversion Rate"
  value={3.45}
  precision={2}
  suffix="%"
/>

// Ratio format
<Statistic
  title="Success Rate"
  value={93}
  suffix="/ 100"
/>
```

**Key Characteristics**:
- Use `suffix="%"` for percentages
- Precision typically 2 decimal places
- Consider trend arrows for rates
- Ratio format with suffix for context

### Countdown Timers
**Pattern**: Display time-based countdowns

```jsx
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // 2 days, 30 seconds

// Standard countdown
<Countdown
  title="Event Starts In"
  value={deadline}
  format="D [days] HH:mm:ss"
/>

// Sale countdown with action
<Countdown
  title="Flash Sale Ends"
  value={deadline}
  onFinish={() => {
    message.info('Sale has ended!');
    // Disable purchase button, redirect, etc.
  }}
/>

// Precise countdown with milliseconds
<Countdown
  title="Auction Ends"
  value={deadline}
  format="HH:mm:ss:SSS"
  valueStyle={{ color: '#cf1322' }}
/>
```

**Key Characteristics**:
- Use appropriate format for duration
- `onFinish` callback for post-countdown actions
- Consider red styling for urgency
- Show days for long durations

### Loading States
**Pattern**: Handle asynchronous data fetching

```jsx
import { useState, useEffect } from 'react';

function DashboardStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Statistic
          title="Active Users"
          value={stats.activeUsers}
          loading={loading}
        />
      </Col>
      <Col span={8}>
        <Statistic
          title="Revenue"
          value={stats.revenue}
          precision={2}
          prefix="$"
          loading={loading}
        />
      </Col>
      <Col span={8}>
        <Statistic
          title="Growth"
          value={stats.growth}
          suffix="%"
          loading={loading}
        />
      </Col>
    </Row>
  );
}
```

**Key Characteristics**:
- Boolean `loading` prop
- Maintains layout during load
- Consistent across multiple statistics
- Skeleton/placeholder displayed

### Custom Formatting
**Pattern**: Complex value transformations

```jsx
// Time duration from seconds
<Statistic
  title="Average Session"
  value={3665}
  formatter={(value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }}
/>

// Large number abbreviation
<Statistic
  title="Total Views"
  value={1234567}
  formatter={(value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  }}
/>

// Custom percentage calculation
<Statistic
  title="Completion Rate"
  value={245}
  formatter={(value) => {
    const total = 300;
    const percentage = (value / total * 100).toFixed(1);
    return `${value}/${total} (${percentage}%)`;
  }}
/>
```

**Key Characteristics**:
- Full control over display
- Can perform calculations
- Return any React node
- Useful for non-standard formats

---

## Visual Design Patterns

### Trend Indicators
**Pattern**: Show data direction with icons and colors

```jsx
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

// Positive trend (green)
<Statistic
  title="Revenue Growth"
  value={11.28}
  precision={2}
  suffix="%"
  valueStyle={{ color: '#3f8600' }}
  prefix={<ArrowUpOutlined />}
/>

// Negative trend (red)
<Statistic
  title="Churn Rate"
  value={9.3}
  precision={2}
  suffix="%"
  valueStyle={{ color: '#cf1322' }}
  prefix={<ArrowDownOutlined />}
/>

// Neutral (default)
<Statistic
  title="Stability Index"
  value={100}
/>
```

**Color Conventions**:
- Green (`#3f8600`): Positive, growth, increase
- Red (`#cf1322`): Negative, decrease, warning
- Default (gray): Neutral, informational

### Card Layouts
**Pattern**: Statistics within card components

```jsx
import { Card, Statistic } from 'antd';

<Card>
  <Statistic
    title="Active Users"
    value={11.28}
    precision={2}
    valueStyle={{ color: '#3f8600' }}
    prefix={<ArrowUpOutlined />}
    suffix="%"
  />
</Card>

// Multiple statistics in one card
<Card title="Today's Overview">
  <Row gutter={16}>
    <Col span={12}>
      <Statistic title="Views" value={8846} />
    </Col>
    <Col span={12}>
      <Statistic title="Sales" value={6560} prefix="$" />
    </Col>
  </Row>
</Card>
```

**Benefits**:
- Visual grouping
- Consistent spacing
- Clear boundaries
- Professional appearance

### Typography Hierarchy
**Pattern**: Emphasize important metrics

```jsx
// Large prominent stat
<Statistic
  title="Primary KPI"
  value={112893}
  valueStyle={{
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1890ff'
  }}
/>

// Secondary metrics
<Statistic
  title="Supporting Metric"
  value={11.28}
  precision={2}
  suffix="%"
  valueStyle={{ fontSize: '24px' }}
/>

// Tertiary details
<Statistic
  title="Detail"
  value={1234}
  valueStyle={{ fontSize: '16px' }}
/>
```

---

## Advanced Features

### Real-time Updates
**Pattern**: Live updating statistics

```jsx
import { useState, useEffect } from 'react';

function LiveStatistic() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch new data or calculate
      setValue(prev => prev + Math.floor(Math.random() * 10));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Statistic
      title="Live Users"
      value={value}
      prefix="👥"
    />
  );
}
```

### Countdown with Actions
**Pattern**: Trigger behaviors when countdown completes

```jsx
import { Countdown } from 'antd';
import { message, Modal } from 'antd';

function SaleCountdown({ deadline, onExpire }) {
  const handleFinish = () => {
    message.warning('Sale has ended!');
    Modal.info({
      title: 'Sale Ended',
      content: 'Thank you for participating!',
    });
    onExpire?.();
  };

  return (
    <Countdown
      title="Flash Sale Ends In"
      value={deadline}
      format="HH:mm:ss"
      onFinish={handleFinish}
      valueStyle={{ color: '#cf1322', fontSize: '32px' }}
    />
  );
}
```

### Conditional Styling
**Pattern**: Dynamic styling based on value

```jsx
function ConditionalStatistic({ title, value, threshold = 0 }) {
  const getValueStyle = () => {
    if (value > threshold) {
      return { color: '#3f8600' }; // Green
    } else if (value < threshold) {
      return { color: '#cf1322' }; // Red
    }
    return {}; // Default
  };

  const getPrefix = () => {
    if (value > threshold) {
      return <ArrowUpOutlined />;
    } else if (value < threshold) {
      return <ArrowDownOutlined />;
    }
    return null;
  };

  return (
    <Statistic
      title={title}
      value={Math.abs(value)}
      precision={2}
      suffix="%"
      valueStyle={getValueStyle()}
      prefix={getPrefix()}
    />
  );
}

// Usage
<ConditionalStatistic title="Growth" value={11.28} threshold={10} />
<ConditionalStatistic title="Loss" value={-5.32} threshold={0} />
```

### Responsive Statistics
**Pattern**: Adapt to different screen sizes

```jsx
import { useMediaQuery } from 'react-responsive';

function ResponsiveStatistic({ title, value }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Statistic
      title={title}
      value={value}
      valueStyle={{
        fontSize: isMobile ? '24px' : '48px',
      }}
    />
  );
}
```

---

## Pattern Support Levels Summary

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Basic value display | Level 1 | Core feature |
| Precision control | Level 1 | Core feature |
| Prefix/Suffix | Level 1 | Core feature |
| Value styling | Level 1 | Core feature |
| Loading state | Level 1 | Core feature |
| Number formatting | Level 1 | Core feature |
| Countdown timer | Level 1 | Core feature |
| Countdown formatting | Level 1 | Core feature |
| Custom formatter | Level 2 | Common |
| Countdown callbacks | Level 1 | Core feature |
| Countdown onChange | Level 2 | Common |

---

## Complete Code Examples

### Example 1: Analytics Dashboard

```jsx
import { Row, Col, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

function AnalyticsDashboard() {
  return (
    <div style={{ padding: '24px', background: '#f0f2f5' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={112893}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={98765.43}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Growth Rate"
              value={11.28}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Bounce Rate"
              value={9.3}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
```

### Example 2: E-commerce Flash Sale

```jsx
import { Card, Statistic, Row, Col, Button } from 'antd';
import { useState } from 'react';

const { Countdown } = Statistic;

function FlashSale() {
  const [saleEnded, setSaleEnded] = useState(false);
  const deadline = Date.now() + 1000 * 60 * 60 * 2; // 2 hours

  return (
    <Card
      title="⚡ Flash Sale"
      style={{ maxWidth: 600, margin: '24px auto' }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Countdown
            title="Sale Ends In"
            value={deadline}
            format="HH:mm:ss"
            onFinish={() => setSaleEnded(true)}
            valueStyle={{
              color: saleEnded ? '#999' : '#cf1322',
              fontSize: '32px'
            }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Discount"
            value={50}
            suffix="%"
            valueStyle={{
              color: '#3f8600',
              fontSize: '32px'
            }}
          />
        </Col>
      </Row>
      <Button
        type="primary"
        size="large"
        block
        disabled={saleEnded}
        style={{ marginTop: 16 }}
      >
        {saleEnded ? 'Sale Ended' : 'Shop Now'}
      </Button>
    </Card>
  );
}
```

### Example 3: Financial Overview

```jsx
import { Card, Statistic, Row, Col, Divider } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined
} from '@ant-design/icons';

function FinancialOverview({ loading = false }) {
  return (
    <Card title="Financial Overview" style={{ margin: '24px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Total Revenue"
            value={1234567.89}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="USD"
            loading={loading}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Total Orders"
            value={8846}
            prefix={<ShoppingOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Active Customers"
            value={6560}
            prefix={<UserOutlined />}
            loading={loading}
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Average Order"
            value={139.68}
            precision={2}
            prefix="$"
            loading={loading}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Conversion Rate"
            value={3.45}
            precision={2}
            suffix="%"
            loading={loading}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Customer LTV"
            value={567.89}
            precision={2}
            prefix="$"
            loading={loading}
          />
        </Col>
      </Row>
    </Card>
  );
}
```

### Example 4: System Monitoring

```jsx
import { Row, Col, Card, Statistic } from 'antd';
import { useState, useEffect } from 'react';

function SystemMonitoring() {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data
      setStats({
        cpu: Math.random() * 100,
        memory: 60 + Math.random() * 20,
        disk: 45 + Math.random() * 10,
        uptime: Date.now() / 1000,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value, warning = 70, danger = 90) => {
    if (value >= danger) return '#cf1322';
    if (value >= warning) return '#faad14';
    return '#3f8600';
  };

  return (
    <Card title="System Resources" style={{ margin: '24px' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="CPU Usage"
            value={stats.cpu}
            precision={1}
            suffix="%"
            valueStyle={{ color: getColor(stats.cpu) }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Memory Usage"
            value={stats.memory}
            precision={1}
            suffix="%"
            valueStyle={{ color: getColor(stats.memory) }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Disk Usage"
            value={stats.disk}
            precision={1}
            suffix="%"
            valueStyle={{ color: getColor(stats.disk) }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Uptime"
            value={stats.uptime}
            formatter={(value) => {
              const hours = Math.floor(value / 3600);
              return `${hours}h`;
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}
```

---

## Implementation Philosophy

### Design Principles

**Clarity First**: The primary goal is to make numbers immediately understandable and prominent. Everything else is secondary.

**Contextual Support**: Titles, prefixes, and suffixes provide essential context without cluttering the main value.

**Visual Hierarchy**: The value is always the hero, with supporting elements in subdued styling.

**Formatting Flexibility**: Supports international number formats, custom formatting, and domain-specific representations.

**Responsive Design**: Works well in various layouts (cards, grids, lists) and adapts to container sizes.

### Key Design Decisions

1. **Separation of Concerns**: Static value display (Statistic) vs. dynamic time display (Countdown) are separate but related components.

2. **Formatter Escape Hatch**: While props handle 90% of cases, the `formatter` function provides complete control for edge cases.

3. **Loading State Integration**: Built-in loading state maintains layout consistency during async operations.

4. **Style Customization**: `valueStyle` prop enables visual coding (colors, sizes) without requiring custom components.

5. **Countdown as Sub-component**: `Statistic.Countdown` maintains API consistency while providing specialized time-based functionality.

---

## Accessibility Considerations

### Semantic HTML
- Title should be descriptive enough to understand context
- Value should be readable by screen readers
- Consider ARIA labels for icon-only prefixes

### Visual Accessibility
- Ensure sufficient color contrast for value text
- Don't rely solely on color to convey meaning (use icons, text)
- Consider font size and weight for readability
- Loading state should be perceivable

### Time-based Content
- Countdown components should have descriptive titles
- Consider adding alerts when countdown reaches zero
- onChange callback enables accessibility features (announcements)

### Internationalization
- Group/decimal separators support regional formats
- Format string supports localized labels
- Consider number localization for different regions

---

## Unique & Notable Features

### 1. Built-in Number Formatting
Unlike many statistic components, Ant Design provides comprehensive formatting options without requiring external libraries:
- Group separators (thousands)
- Decimal separators
- Precision control
- All work together seamlessly

### 2. Loading State Integration
The `loading` prop (v4.8.0+) is unusual and highly practical:
- Maintains layout during data fetch
- Consistent with Ant Design's loading patterns
- Eliminates need for custom skeleton components

### 3. Countdown Sub-component
`Statistic.Countdown` provides specialized time-based display:
- Real-time updates without manual intervals
- Flexible format strings (moment.js syntax)
- Lifecycle callbacks (`onFinish`, `onChange`)
- Accepts both timestamps and moment objects

### 4. Formatter Function Flexibility
The `formatter` prop is powerful:
- Receives value as input
- Returns React node (not just string)
- Can perform calculations
- Enables any custom representation

### 5. Prefix/Suffix ReactNode Support
Unlike simple string props, prefix/suffix accept full React components:
- Icons, badges, avatars
- Custom styled elements
- Interactive components (though not recommended)

### 6. Style Props Hierarchy
Clean separation of styling:
- Component-level styles (Card, layout)
- Value-level styles (`valueStyle`)
- Title remains consistently styled
- Allows precise visual control

---

## Comparison with Similar Components

### Statistic vs. Badge (Count Display)

| Aspect | Statistic | Badge |
|--------|-----------|-------|
| Purpose | Prominent data display | Notification indicator |
| Value Type | Any number/string | Typically small counts |
| Formatting | Rich formatting options | Overflow only (`99+`) |
| Layout | Standalone element | Overlay on other elements |
| Title | Always has title | Optional text |
| Loading | Built-in loading state | No loading state |

**When to Use**:
- **Statistic**: Dashboard metrics, analytics, financial data
- **Badge**: Notification counts, status indicators, overlays

### Statistic vs. Progress

| Aspect | Statistic | Progress |
|--------|-----------|-------|
| Purpose | Display final value | Show completion status |
| Representation | Number | Visual bar/circle |
| Context | Absolute values | Percentage/ratio |
| Interactivity | Display only | Sometimes interactive |
| Time-based | Countdown variant | No time features |

**When to Use**:
- **Statistic**: Metrics, totals, specific values
- **Progress**: Task completion, loading, percentages

---

## Research Notes

### Data Collection Method
- Web search extraction from official Ant Design documentation
- Documentation page content analysis
- API table extraction from multiple sources
- Cross-referenced v4 and v5 documentation
- Research date: 2025-11-04

### Documentation Quality
- Comprehensive API documentation available
- Clear examples for all major features
- Well-documented props with types and defaults
- Version information for newer features
- Some features require direct documentation access for full details

### Version Considerations
- `loading` prop added in v4.8.0
- `onChange` callback for Countdown added in v4.16.0
- `Statistic.Timer` replaces `Countdown` in v5.25.0+ (naming change only)
- Core features stable across recent versions

---

## Recommendations for Semantic UI

### Implementation Priority

**Must-Have (Level 1)**:
1. Basic value display with title
2. Precision control for decimal places
3. Prefix and suffix support (ReactNode)
4. Value styling customization
5. Number formatting (group/decimal separators)
6. Loading state indicator
7. Countdown variant with format strings
8. Countdown callbacks (onFinish)

**Should-Have (Level 2)**:
1. Custom formatter function
2. Countdown onChange callback
3. Advanced format string tokens
4. Responsive design patterns

**Consider**:
- Real-time update patterns
- Integration with data fetching libraries
- Accessibility enhancements (ARIA labels)
- Animation on value changes

### Semantic UI Adaptation

**Natural Language API**:
- Consider: `<ui-statistic value="112893" title="Active Users">`
- Settings-based: `statistic.settings({ precision: 2, prefix: '$' })`
- Countdown: `<ui-statistic countdown value="..." format="...">`

**Component Structure**:
```html
<!-- Basic statistic -->
<ui-statistic value="112893" title="Active Users" />

<!-- With formatting -->
<ui-statistic
  value="98765.43"
  title="Revenue"
  precision="2"
  prefix="$"
  group-separator=","
/>

<!-- With styling -->
<ui-statistic
  value="11.28"
  title="Growth"
  precision="2"
  suffix="%"
  value-style='{"color": "#3f8600"}'
>
  <template name="prefix">
    <ui-icon name="arrow-up" />
  </template>
</ui-statistic>

<!-- Countdown -->
<ui-statistic
  countdown
  value="1672531200000"
  title="Sale Ends"
  format="HH:mm:ss"
/>
```

**Reactive Settings**:
```javascript
// Update value dynamically
statistic.settings.value = newValue;

// Toggle loading
statistic.settings.loading = true;

// Change formatting
statistic.settings.precision = 3;
```

**Event System**:
```javascript
// Countdown finished
element.addEventListener('countdown-finish', (e) => {
  console.log('Countdown completed!');
});

// Value changed (countdown)
element.addEventListener('countdown-change', (e) => {
  console.log('New value:', e.detail.value);
});
```

### Semantic UI Differentiators

**Shadow DOM Styling**:
- Value styling through CSS custom properties
- Theme-aware color system (success, error, warning)
- Responsive typography tokens

**Template-based Content**:
- Prefix/suffix as named slots
- Title as slot for rich content
- Formatter as template helper function

**Signals Integration**:
- Reactive value updates
- Computed formatters
- Live data binding

### Key Insights

1. **Single-Purpose Component**: Statistic has one job - display numbers prominently. It does this extremely well without feature bloat.

2. **Formatting is King**: The real power is in flexible, international number formatting built-in. Most frameworks require libraries for this.

3. **Countdown Separation**: Keeping countdown as a variant (not separate component) maintains API consistency while specializing functionality.

4. **Loading State**: The loading prop is deceptively important for real-world applications dealing with async data.

5. **Style Customization Balance**: Enough styling control (`valueStyle`) without overwhelming API surface.

6. **Prefix/Suffix Flexibility**: ReactNode support (not just strings) enables rich visual context without custom components.

---

## Conclusion

Ant Design's Statistic component exemplifies focused design: it displays numbers prominently with excellent formatting support. The component's strength lies in its comprehensive number formatting options, built-in loading states, and the specialized Countdown variant for time-based displays.

For Semantic UI implementation, the key is maintaining this clarity of purpose while adapting to Shadow DOM, template-based composition, and reactive settings. The natural language API should make common patterns (dashboard stats, financial displays, countdowns) straightforward while preserving flexibility for advanced use cases.

**Core Principle**: Make numbers the hero, provide rich formatting options, and get out of the way.

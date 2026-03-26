# Statistic Component - Aggregate Pattern Research

**Research Date**: 2025-11-04
**Frameworks Analyzed**: 3
**Total Individual Reports**: 3

---

## Executive Summary

This research analyzed statistic/stat display patterns across 3 major UI frameworks (Ant Design, Chakra UI, Semantic UI Classic). Statistic components serve as data visualization primitives that emphasize numerical or quantitative measurements with contextual labels.

### Key Findings

**Universal Purpose**: All frameworks implement statistics as display components that:
- Present numerical values prominently with visual hierarchy
- Provide contextual labels/titles for understanding
- Support prefixes/suffixes for units and context
- Enable color coding for semantic meaning (positive/negative trends)

**Philosophical Differences**:
- **Ant Design**: Interactive statistics with countdowns, loading states, and rich number formatting
- **Chakra UI v2→v3**: Major architectural evolution (compound components, FormatNumber integration, explicit indicators)
- **Semantic UI Classic**: Comprehensive display variations with flexible content types (text, icons, images)

**Version Evolution**: Chakra UI v2 → v3 represents significant modernization:
- Architecture: Named exports → Compound components (Stat.Root, Stat.Label, Stat.ValueText)
- Trend indicators: `<StatArrow type="increase" />` → `<Stat.UpIndicator />` / `<Stat.DownIndicator />`
- Number formatting: Manual → FormatNumber integration
- New components: Stat.ValueUnit for explicit unit display
- Group container: StatGroup → Layout components (SimpleGrid, etc.)

---

## Component Definition

### Statistic Component Mental Models

**Ant Design**: Numeric display component for highlighting key metrics and KPIs. Emphasizes data prominence through typography, supports countdown timers for time-based data, and provides comprehensive number formatting (precision, separators, custom formatters). Loading states integrated for async data scenarios.

**Chakra UI**: Data display primitive that presents statistical information with a title, value, and optional context. v2 focused on basic display with trend arrows; v3 evolved to compound component architecture with better composition, explicit up/down indicators, and FormatNumber integration for internationalization.

**Semantic UI Classic**: View-level component treating statistics as prominent data displays. Unusually flexible value content support (text, icons, images) compared to typical frameworks. Emphasizes layout flexibility with vertical/horizontal orientations and comprehensive grouping mechanisms for dashboard-style displays.

### Primary Use Cases

**Universal across all frameworks**:
- Dashboard metrics and KPIs
- Analytics displays (conversion rates, engagement metrics)
- Financial data (revenue, account balances, transaction amounts)
- User statistics (active users, followers, views)
- Performance indicators with trends

**Framework-Specific**:
- **Ant Design**: Countdown timers for sales/events, loading states for data fetching
- **Chakra UI**: Badge integration for color-coded trends, icon composition
- **Semantic UI**: Mixed content values (icons, images in values), horizontal inline layouts

---

## Pattern Category Analysis

### 1. Component Architecture

#### Compound Component Pattern
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Chakra UI v3** implements compound component architecture:

**v3 Structure**:
```jsx
<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>$45,890</Stat.ValueText>
  <Stat.HelpText>Since last month</Stat.HelpText>
</Stat.Root>
```

**Benefits**:
- Clear namespace prevents naming conflicts
- Better TypeScript support and autocomplete
- More discoverable API (Stat. shows all subcomponents)
- Explicit component relationships

**v2 Structure** (for comparison):
```jsx
<Stat>
  <StatLabel>Revenue</StatLabel>
  <StatNumber>$45,890</StatNumber>
  <StatHelpText>Since last month</StatHelpText>
</Stat>
```

**Other Frameworks**:
- **Ant Design**: Single `Statistic` component with sub-component `Statistic.Countdown`
- **Semantic UI**: Class-based HTML structure (`.ui.statistic` > `.value` + `.label`)

#### Class-Based Structure
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Semantic UI Classic**:
```html
<div class="ui statistic">
  <div class="value">5,550</div>
  <div class="label">Downloads</div>
</div>
```

**Pattern**: Pure CSS-based implementation, no JavaScript required
**Flexibility**: Source order determines label position (above or below value)

#### Single Component with Props
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Ant Design**:
```jsx
<Statistic
  title="Active Users"
  value={112893}
  prefix={<LikeOutlined />}
  suffix="/ 100"
/>
```

**Pattern**: All-in-one component with prop-based configuration

---

### 2. Value Display Patterns

#### Numeric Values
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support numeric value display with automatic formatting:

| Framework | Basic Numeric | Implementation |
|-----------|---------------|----------------|
| **Ant Design** | ✅ | `value={112893}` displays with default separators |
| **Chakra UI v2** | ✅ | `<StatNumber>112893</StatNumber>` |
| **Chakra UI v3** | ✅ | `<Stat.ValueText>112893</Stat.ValueText>` |
| **Semantic UI** | ✅ | `<div class="value">112893</div>` |

#### Text Values
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Semantic UI Classic** (most explicit):
```html
<div class="text value">
  Three<br>
  Thousand
</div>
```
**Pattern**: Dedicated `text` class modifier for text-based values

**Chakra UI**: Implicit (any content in ValueText)
```jsx
<Stat.ValueText>Excellent</Stat.ValueText>
```

**Ant Design**: Through custom formatter
```jsx
<Statistic
  value={1}
  formatter={() => "Excellent"}
/>
```

#### Icon Values
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Semantic UI Classic** (native composition):
```html
<div class="value">
  <i class="plane icon"></i> 5
</div>
```

**Chakra UI** (via composition):
```jsx
<Stat.ValueText>
  <Icon as={FiUsers} boxSize={6} mr={2} />
  12,456
</Stat.ValueText>
```

**Ant Design**: Via prefix/suffix props
```jsx
<Statistic
  value={5}
  prefix={<PlaneIcon />}
/>
```

#### Image Values
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Semantic UI Classic**:
```html
<div class="value">
  <img src="avatar.jpg" class="ui circular inline image">
  42
</div>
```

**Use Case**: Team member counts, user statistics with avatars

---

### 3. Label/Title Patterns

#### Basic Labels
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks provide contextual labels:

**Ant Design**:
```jsx
<Statistic title="Downloads" value={5550} />
```

**Chakra UI v3**:
```jsx
<Stat.Label>Downloads</Stat.Label>
```

**Semantic UI**:
```html
<div class="label">Downloads</div>
```

#### Label Positioning
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Semantic UI Classic** (source order determines position):
```html
<!-- Label below (most common) -->
<div class="ui statistic">
  <div class="value">40,509</div>
  <div class="label">Views</div>
</div>

<!-- Label above -->
<div class="ui statistic">
  <div class="label">Views</div>
  <div class="value">40,509</div>
</div>
```

**Chakra UI**: Via component order in JSX
```jsx
<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>  {/* Label first = above */}
  <Stat.ValueText>$45k</Stat.ValueText>
</Stat.Root>
```

**Ant Design**: Fixed title above value (no built-in option to reverse)

---

### 4. Prefix/Suffix Support

#### Prefix Elements
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support prefix elements (icons, currency symbols, etc.):

**Ant Design**:
```jsx
// Icon prefix
<Statistic
  title="Feedback"
  value={1128}
  prefix={<LikeOutlined />}
/>

// Currency prefix
<Statistic
  title="Revenue"
  value={45890}
  prefix="$"
/>
```

**Chakra UI v3** (via Badge or composition):
```jsx
<Stat.ValueText>
  <Icon as={FiDollarSign} mr={2} />
  $45,890
</Stat.ValueText>
```

**Semantic UI** (via content composition):
```html
<div class="value">
  <i class="dollar icon"></i>
  45,890
</div>
```

#### Suffix Elements
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support suffix elements (units, ratios, percentages):

**Ant Design**:
```jsx
// Percentage suffix
<Statistic
  title="Growth Rate"
  value={11.28}
  suffix="%"
/>

// Ratio suffix
<Statistic
  title="Success Rate"
  value={93}
  suffix="/ 100"
/>
```

**Chakra UI v3** (dedicated component):
```jsx
<Stat.ValueText>
  45
  <Stat.ValueUnit>ms</Stat.ValueUnit>
</Stat.ValueText>
```

**Pattern Insight**: Chakra v3's `Stat.ValueUnit` is unique - explicit component for unit display

**Common Suffix Patterns**:
- Units: %, ms, sec, min, hr, KB, MB, GB
- Ratios: "/ 100", "/ 1000"
- Labels: per day, per user, total

---

### 5. Number Formatting

#### Precision Control
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Ant Design**:
```jsx
<Statistic
  title="Account Balance"
  value={112893}
  precision={2}
/>
// Displays: 112,893.00
```

**Chakra UI v3** (via FormatNumber):
```jsx
<Stat.ValueText>
  <FormatNumber
    value={112893}
    minimumFractionDigits={2}
    maximumFractionDigits={2}
  />
</Stat.ValueText>
// Displays: 112,893.00
```

**Semantic UI Classic**: No built-in (format value before display)

#### Thousand Separators
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Ant Design**:
```jsx
<Statistic
  value={1234567890}
  groupSeparator=","
  decimalSeparator="."
/>
// Displays: 1,234,567,890

// European format
<Statistic
  value={1234567890.50}
  groupSeparator="."
  decimalSeparator=","
  precision={2}
/>
// Displays: 1.234.567.890,50
```

**Chakra UI v3** (via FormatNumber using Intl.NumberFormat):
```jsx
<FormatNumber value={1234567} />
// Automatically formats with locale-appropriate separators
```

**Pattern Insight**:
- Ant Design provides explicit separator props
- Chakra uses browser's Intl.NumberFormat API (locale-aware)
- Semantic UI requires pre-formatting

#### Locale-Based Formatting
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Chakra UI v3** via FormatNumber integration:
```jsx
<FormatNumber
  value={1234.56}
  style="currency"
  currency="USD"
  locale="en-US"
/>
// Displays: $1,234.56

<FormatNumber
  value={1234.56}
  style="currency"
  currency="EUR"
  locale="de-DE"
/>
// Displays: 1.234,56 €
```

**Implementation**: Uses `Intl.NumberFormat` API
**Benefit**: Automatic localization without manual configuration

#### Custom Formatters
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Ant Design**:
```jsx
// Time duration from seconds
<Statistic
  title="Average Session"
  value={3665}
  formatter={(value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }}
/>

// Large number abbreviation
<Statistic
  title="Total Views"
  value={1234567}
  formatter={(value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  }}
/>
```

**Pattern**: Function receives value, returns ReactNode
**Power**: Can perform calculations, conditionals, return any content
**Use Case**: Non-standard formats, domain-specific representations

---

### 6. Trend Indicators

#### Up/Down Arrows
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Ant Design** (via prefix/suffix with icon):
```jsx
<Statistic
  title="Growth Rate"
  value={11.28}
  precision={2}
  suffix="%"
  valueStyle={{ color: '#3f8600' }}
  prefix={<ArrowUpOutlined />}
/>
```

**Chakra UI v2** (type-based):
```jsx
<StatHelpText>
  <StatArrow type='increase' />
  23.36%
</StatHelpText>
```

**Chakra UI v3** (explicit components):
```jsx
<Badge colorPalette="green" gap="0">
  <Stat.UpIndicator />
  12%
</Badge>

<Badge colorPalette="red" gap="0">
  <Stat.DownIndicator />
  9.05%
</Badge>
```

**Pattern Evolution**: Chakra moved from `type` prop to separate components for better clarity

**Semantic UI Classic**: No built-in (compose manually with icons + colors)

#### Color Coding
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support semantic color coding for trends:

**Common Color Conventions**:
- **Green**: Positive trends, increases, growth (`#3f8600` in Ant Design)
- **Red**: Negative trends, decreases, warnings (`#cf1322` in Ant Design)
- **Default/Gray**: Neutral, informational

**Ant Design**:
```jsx
<Statistic
  value={11.28}
  valueStyle={{ color: '#3f8600' }}  // Custom styling
/>
```

**Chakra UI v3**:
```jsx
<Badge colorPalette="green">  // Theme-based colors
  <Stat.UpIndicator />
  12%
</Badge>
```

**Semantic UI Classic**:
```html
<div class="green statistic">  // Semantic color classes
  <div class="value">14</div>
  <div class="label">Green</div>
</div>
```

---

### 7. Help Text / Context

#### Supporting Text
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks provide supporting/help text:

**Ant Design**: No dedicated help text (use description or compose separately)

**Chakra UI v3**:
```jsx
<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>$45,890</Stat.ValueText>
  <Stat.HelpText>Since last month</Stat.HelpText>
</Stat.Root>
```

**Semantic UI Classic**: No built-in (add via HTML composition)

**Common Help Text Patterns**:
- Time ranges: "Feb 12 - Feb 28"
- Comparisons: "Since last month", "Compared to last year"
- Updates: "Updated 5 minutes ago"
- Context: "Per transaction", "This week"

#### Trend Text with Indicators
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Ant Design**:
```jsx
<Statistic
  value={345670}
  prefix={<ArrowUpOutlined />}
  suffix={<span style={{ fontSize: '14px' }}>23.36%</span>}
/>
```

**Chakra UI v3**:
```jsx
<Badge colorPalette="green" gap="0">
  <Stat.UpIndicator />
  23.36%
</Badge>
```

**Pattern**: Combine arrow indicator + percentage change + color coding

---

### 8. Loading States

#### Loading Indicator
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Ant Design** (v4.8.0+):
```jsx
<Statistic
  title="Active Users"
  value={112893}
  loading={true}
/>

// Dynamic loading
<Statistic
  title="Revenue"
  value={revenue}
  loading={isLoading}
/>
```

**Implementation**: Shows skeleton/loading placeholder while maintaining layout
**Benefit**: Prevents layout shift during async data fetching

**Other Frameworks**: Must compose with separate Skeleton component
```jsx
// Chakra UI manual approach
{isLoading ? (
  <Skeleton height="60px" />
) : (
  <Stat.ValueText>{value}</Stat.ValueText>
)}
```

---

### 9. Countdown/Timer Features

#### Built-in Countdown
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Ant Design** via `Statistic.Countdown`:
```jsx
import { Statistic } from 'antd';
const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2; // 2 days

<Countdown
  title="Flash Sale Ends"
  value={deadline}
  format="D [days] HH:mm:ss"
  onFinish={() => console.log('Sale ended!')}
/>
```

**Features**:
- Real-time countdown updates
- Customizable format strings (moment.js syntax)
- `onFinish` callback when countdown reaches zero
- `onChange` callback for value updates (v4.16.0+)
- Accepts timestamp or moment object

**Format Tokens**:
- `D` - Days
- `HH` - Hours (2 digits)
- `mm` - Minutes (2 digits)
- `ss` - Seconds (2 digits)
- `SSS` - Milliseconds (3 digits)
- `[text]` - Literal text

**Default Format**: `HH:mm:ss`

**Common Patterns**:
```jsx
// Event countdown
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
    // Disable purchase, redirect, etc.
  }}
/>

// Precise millisecond countdown
<Countdown
  title="Auction Ends"
  value={deadline}
  format="HH:mm:ss:SSS"
  valueStyle={{ color: '#cf1322' }}
/>
```

**Pattern Insight**: No other framework provides built-in countdown functionality

---

### 10. Group Layouts

#### Statistic Groups
**Prevalence**: 3/3 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support grouped statistics:

**Ant Design**: Manual layout via Row/Col
```jsx
<Row gutter={16}>
  <Col span={6}>
    <Statistic title="Active Users" value={112893} />
  </Col>
  <Col span={6}>
    <Statistic title="Revenue" value={98765} prefix="$" />
  </Col>
</Row>
```

**Chakra UI v2**: Dedicated StatGroup component
```jsx
<StatGroup>
  <Stat>
    <StatLabel>Sent</StatLabel>
    <StatNumber>345,670</StatNumber>
  </Stat>
  <Stat>
    <StatLabel>Clicked</StatLabel>
    <StatNumber>45</StatNumber>
  </Stat>
</StatGroup>
```

**Chakra UI v3**: Layout components (StatGroup removed)
```jsx
<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
  <Stat.Root>
    <Stat.Label>Users</Stat.Label>
    <Stat.ValueText>345,670</Stat.ValueText>
  </Stat.Root>
  <Stat.Root>
    <Stat.Label>Revenue</Stat.Label>
    <Stat.ValueText>$45,890</Stat.ValueText>
  </Stat.Root>
</SimpleGrid>
```

**Semantic UI Classic**: Dedicated statistics group
```html
<div class="ui statistics">
  <div class="statistic">
    <div class="value">22</div>
    <div class="label">Faves</div>
  </div>
  <div class="statistic">
    <div class="value">31,200</div>
    <div class="label">Views</div>
  </div>
</div>
```

**Pattern Evolution**: Chakra v3 simplified by removing dedicated group component, favoring standard layout primitives

#### Evenly Divided Groups
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Semantic UI Classic**:
```html
<!-- Four equal-width columns -->
<div class="ui four statistics">
  <div class="statistic">...</div>
  <div class="statistic">...</div>
  <div class="statistic">...</div>
  <div class="statistic">...</div>
</div>

<!-- Options: one, two, three, four, five, six, seven, eight, nine, ten -->
```

**Pattern**: Word-number classes create equal-width grid layouts

---

### 11. Color Systems

#### Semantic Colors
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Semantic UI Classic** (most comprehensive):
12 color options: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`

```html
<div class="red statistic">
  <div class="value">27</div>
  <div class="label">Red</div>
</div>

<div class="green statistic">
  <div class="value">14</div>
  <div class="label">Green</div>
</div>
```

**Chakra UI v3** (via colorPalette):
```jsx
<Badge colorPalette="green">
  <Stat.UpIndicator />
  12%
</Badge>

<Badge colorPalette="red">
  <Stat.DownIndicator />
  9%
</Badge>
```

**Ant Design**: Custom colors via `valueStyle` prop
```jsx
<Statistic
  value={11.28}
  valueStyle={{ color: '#3f8600' }}  // Green
/>

<Statistic
  value={-5.32}
  valueStyle={{ color: '#cf1322' }}  // Red
/>
```

#### Color Palette Integration
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Chakra UI v3**:
```jsx
<Stat.Root colorPalette="blue">
  <Stat.Label>Users</Stat.Label>
  <Stat.ValueText>12,456</Stat.ValueText>
  <Badge colorPalette="blue">
    <Stat.UpIndicator />
    23%
  </Badge>
</Stat.Root>
```

**Available Palettes**: gray, red, orange, yellow, green, teal, blue, cyan, purple, pink, whiteAlpha, blackAlpha

---

### 12. Size Variations

#### Predefined Size Tiers
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Semantic UI Classic**:
```html
<!-- 6 size options -->
<div class="ui mini statistic">...</div>
<div class="ui tiny statistic">...</div>
<div class="ui small statistic">...</div>
<div class="ui statistic">...</div>         <!-- Default -->
<div class="ui large statistic">...</div>
<div class="ui huge statistic">...</div>
```

**Pattern**: Predefined size classes scale value + label proportionally

**Other Frameworks**: Use flexible fontSize props instead of tiers
```jsx
// Chakra UI v3
<Stat.ValueText fontSize={{ base: "2xl", md: "4xl" }}>
```

---

### 13. Orientation

#### Horizontal Layout
**Prevalence**: 1/3 frameworks (33%)
**Support Level**: Level 5 (Rare)

**Only Semantic UI Classic**:
```html
<!-- Single horizontal statistic -->
<div class="ui horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Horizontal group -->
<div class="ui horizontal statistics">
  <div class="statistic">
    <div class="value">2,204</div>
    <div class="label">Views</div>
  </div>
  <div class="statistic">
    <div class="value">3,322</div>
    <div class="label">Downloads</div>
  </div>
</div>
```

**Layout**: Value and label side-by-side instead of stacked
**Use Case**: Inline metrics, compact displays, header statistics

**Other Frameworks**: Achieve via flexbox/grid layout composition

---

### 14. Inverted Styles

#### Dark Mode Support
**Prevalence**: 2/3 frameworks (67%)
**Support Level**: Level 2 (Common)

**Semantic UI Classic**:
```html
<div class="ui inverted segment">
  <div class="ui inverted statistic">
    <div class="value">54</div>
    <div class="label">Inverted</div>
  </div>

  <!-- Colored inverted -->
  <div class="ui red inverted statistic">
    <div class="value">27</div>
    <div class="label">Red</div>
  </div>
</div>
```

**Chakra UI**: Via theme color modes
```jsx
<Stat.Root>
  <Stat.Label color="gray.600" _dark={{ color: "gray.400" }}>
    Users
  </Stat.Label>
  <Stat.ValueText color="gray.900" _dark={{ color: "white" }}>
    12,456
  </Stat.ValueText>
</Stat.Root>
```

**Ant Design**: No dedicated inverted mode (manual styling)

---

## Cross-Framework Pattern Summary

### Universal Patterns (Level 1: 90-100% adoption)

1. **Numeric value display** - 3/3 (100%)
   - Core feature: display numbers prominently

2. **Label/title support** - 3/3 (100%)
   - Contextual descriptive text for values

3. **Prefix elements** - 3/3 (100%)
   - Icons, currency symbols before values

4. **Suffix elements** - 3/3 (100%)
   - Units, percentages, ratios after values

5. **Color coding** - 3/3 (100%)
   - Semantic colors for positive/negative/neutral

6. **Group layouts** - 3/3 (100%)
   - Display multiple statistics together

### Common Patterns (Level 2: 70-89% adoption)

1. **Precision control** - 2/3 (67%)
   - Decimal place specification
   - Not available: Semantic UI Classic

2. **Thousand separators** - 2/3 (67%)
   - Comma/period separators for readability
   - Not available: Semantic UI Classic

3. **Text values** - 2/3 (67%)
   - Non-numeric text content in values
   - Semantic UI (explicit), Chakra (implicit)

4. **Icon values** - 2/3 (67%)
   - Icons integrated into values
   - Semantic UI, Chakra UI

5. **Trend indicators** - 2/3 (67%)
   - Up/down arrows for changes
   - Ant Design, Chakra UI

6. **Help text** - 2/3 (67%)
   - Supporting contextual text
   - Chakra UI, manual composition in others

7. **Label positioning** - 2/3 (67%)
   - Label above or below value
   - Semantic UI, Chakra UI

8. **Semantic colors** - 2/3 (67%)
   - Predefined color systems
   - Semantic UI, Chakra UI

9. **Inverted/dark mode** - 2/3 (67%)
   - Dark background support
   - Semantic UI, Chakra UI

### Moderate Patterns (Level 3: 40-69% adoption)

1. **Image values** - 1/3 (33%)
   - Semantic UI Classic only

2. **Custom formatters** - 1/3 (33%)
   - Ant Design only

3. **Locale-based formatting** - 1/3 (33%)
   - Chakra UI v3 only (via FormatNumber)

4. **Loading states** - 1/3 (33%)
   - Ant Design only

5. **Countdown functionality** - 1/3 (33%)
   - Ant Design only

6. **Compound components** - 1/3 (33%)
   - Chakra UI v3 only

7. **Evenly divided groups** - 1/3 (33%)
   - Semantic UI Classic only

8. **Size tiers** - 1/3 (33%)
   - Semantic UI Classic only

9. **Horizontal orientation** - 1/3 (33%)
   - Semantic UI Classic only

10. **Color palette integration** - 1/3 (33%)
    - Chakra UI v3 only

### Occasional Patterns (Level 4: 20-39% adoption)

No patterns in this tier (all patterns are either >33% or at 33%)

### Rare Patterns (Level 5: <20% adoption)

All patterns at 33% adoption technically fall into "Moderate" tier, but these are framework-unique innovations worth noting:

1. **Stat.ValueUnit component** - Chakra UI v3 only (explicit unit display)
2. **FormatNumber integration** - Chakra UI v3 only (internationalization)
3. **Countdown.onChange callback** - Ant Design only (real-time updates)
4. **Progress bar integration** - Manual composition (documented in research)
5. **Sparkline integration** - Manual composition (documented in research)

---

## Key Insights

### 1. Three Distinct Philosophies

**Ant Design**: Feature-rich with countdown, loading states, custom formatters
- Most comprehensive built-in features
- Focus: Interactive, production-ready metrics

**Chakra UI**: Evolution from simple to sophisticated
- v2: Basic display with trend arrows
- v3: Compound components, FormatNumber, explicit indicators
- Focus: Composition, internationalization, modern patterns

**Semantic UI Classic**: Display flexibility champion
- 20+ variations (sizes, colors, orientations, content types)
- Pure CSS, no JavaScript
- Focus: Visual presentation options

### 2. Compound Components are Future Direction

**Only Chakra UI v3** implements this pattern, but it shows clear benefits:
- Better namespace organization (Stat.*)
- Improved TypeScript support
- Clearer component relationships
- Better documentation structure

**Recommendation**: Adopt compound component pattern for Semantic UI

### 3. Number Formatting is Critical but Inconsistent

**Three approaches**:
1. **Built-in props** (Ant Design): `precision`, `groupSeparator`, `decimalSeparator`
2. **Integration** (Chakra v3): FormatNumber component using Intl.NumberFormat
3. **Manual** (Semantic UI): Pre-format before display

**Best Practice**: Chakra's FormatNumber integration via Intl.NumberFormat
- Automatic locale support
- Standard browser API
- No manual configuration

**Recommendation**: Provide both built-in props AND format slot/helper

### 4. Trend Indicators Should Be Explicit

**Evolution**:
- **Chakra v2**: `<StatArrow type="increase" />`
- **Chakra v3**: `<Stat.UpIndicator />` and `<Stat.DownIndicator />`

**Improvement**: Explicit components are more discoverable and type-safe

**Ant Design Pattern**: Prefix/suffix props (flexible but less explicit)

**Recommendation**: Provide explicit `<ui-statistic-up>` and `<ui-statistic-down>` components

### 5. Loading States Are Essential for Modern Apps

**Only Ant Design** provides built-in loading state (v4.8.0+)

**Use Case**: Async data fetching (dashboards, analytics, real-time data)

**Pattern**: Skeleton placeholder maintains layout during load
```jsx
<Statistic
  title="Revenue"
  value={revenue}
  loading={isLoading}  // Shows skeleton
/>
```

**Recommendation**: Built-in loading state is must-have for modern statistic component

### 6. Countdown is Valuable Niche Feature

**Only Ant Design** provides dedicated countdown component

**Use Cases**:
- Flash sales countdown
- Event start timers
- Auction end times
- Session expiration warnings

**Pattern**: Separate sub-component (`Statistic.Countdown`) vs main component

**Recommendation**: Provide `<ui-statistic-countdown>` as separate component

### 7. Help Text Improves Context

**Pattern**: Additional text below value for context
- Time ranges: "Feb 12 - Feb 28"
- Comparisons: "Since last month"
- Updates: "Updated 5 minutes ago"

**Chakra UI v3** makes this first-class with `Stat.HelpText`

**Recommendation**: Include help text as standard feature

### 8. Value Content Flexibility Varies Widely

**Most flexible** (Semantic UI Classic):
- Text values (`<div class="text value">`)
- Icon values (`<i class="icon"></i> 5`)
- Image values (`<img> 42`)
- Mixed content

**Least flexible** (Ant Design):
- Primarily numeric
- Custom content via formatter function

**Recommendation**: Support multiple content types via slots

### 9. Horizontal Orientation is Underserved

**Only Semantic UI Classic** provides horizontal layout option

**Use Case**: Inline metrics, compact displays, header statistics

**Pattern**: Value and label side-by-side instead of stacked
```html
<div class="ui horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>
```

**Recommendation**: Preserve horizontal orientation as Semantic UI heritage feature

### 10. Group Simplification Trend

**Evolution**:
- **Semantic UI Classic**: Dedicated group container with size/color inheritance
- **Chakra v2**: StatGroup component
- **Chakra v3**: Removed StatGroup, use layout components (SimpleGrid)
- **Ant Design**: Manual layout via Row/Col

**Trend**: Moving away from specialized group containers toward standard layout primitives

**Recommendation**: Provide optional `<ui-statistics-group>` for convenience, but encourage standard grid/flex layout

---

## Sophisticated Design Patterns

This section identifies design patterns that are deeply thoughtful about component-specific problems - not general framework features that could apply to any component.

### Semantic UI Classic - Horizontal Orientation as Layout Escape Hatch

**What it does**: Provides an alternate layout mode where value and label sit side-by-side instead of stacked. This creates a compact display pattern useful for inline metrics, header statistics, and mixed content layouts where vertical stacking wastes space.

```html
<!-- Horizontal layout -->
<div class="ui horizontal statistic">
  <div class="value">2,204</div>
  <div class="label">Views</div>
</div>

<!-- Horizontal group -->
<div class="ui horizontal statistics">
  <div class="statistic">
    <div class="value">2,204</div>
    <div class="label">Views</div>
  </div>
  <div class="statistic">
    <div class="value">3,322</div>
    <div class="label">Downloads</div>
  </div>
</div>
```

**Why it's sophisticated**: Horizontal orientation solves a real layout problem - statistics are traditionally presented as large vertical cards, but many real-world contexts need compact inline metrics (next to text, in headers, in compact dashboards). The elegant solution is source-order independence: same HTML structure, CSS modifier determines flow direction.

**Evidence of design maturity**:
- **Edge case handling**: Label positioning (above/below) is independent of orientation - you can have horizontal with label on top or bottom by source order alone
- **Real-world usage**: Used for embedded statistics in long-form content, header metric displays, and sidebar analytics
- **Design restraint**: Doesn't add a prop; leverages existing class-based composition pattern - horizontal is a modifier like "red" or "small"

**Validation test**: If we removed Statistic, would horizontal orientation still exist in other components? No - this is a display paradigm specific to statistics where the primary value needs equal visual weight as the label context. Lists, tables, and other data components don't have this "value + label prominence balance" problem.

---

### Chakra UI v3 - Explicit Value Unit Component

**What it does**: Provides `Stat.ValueUnit` as a dedicated component for displaying units alongside numeric values. This separates the value from its unit, enabling CSS to style them independently and providing semantic clarity about what's unit vs. what's value.

```jsx
import { Stat } from "@chakra-ui/react"

<Stat.Root>
  <Stat.Label>Response Time</Stat.Label>
  <Stat.ValueText>
    45
    <Stat.ValueUnit>ms</Stat.ValueUnit>
  </Stat.ValueText>
</Stat.Root>

<!-- Can be styled independently -->
<style>{`
  Stat.ValueUnit {
    font-size: 0.7em;  /* Smaller than value */
    font-weight: normal;  /* Less bold than value */
    margin-left: 0.25em;  /* Spacing */
  }
`}</style>
```

**Why it's sophisticated**: The problem this solves is typography hierarchy + semantic precision. Values and units have different visual weights but are semantically related. Without explicit separation, you end up with string concatenation ("45ms") which is rigid - CSS can't style the unit differently. This pattern recognizes that units have specific typographic needs: they should be smaller, lighter weight, and visually subordinate to the main value.

**Evidence of design maturity**:
- **Edge case handling**: Unit component works with any number format (simple numeric, FormatNumber component, custom expressions) without special configuration
- **Real-world usage**: Essential for scientific notation (µm, MHz), time units (ms, sec, min), data units (KB, MB, GB), rate units (/sec, /min)
- **Design restraint**: Doesn't require formatter configuration or special props - just a wrapping component that lets CSS handle typography

**Validation test**: If we removed Statistic, would explicit unit components exist elsewhere? Partially - some components might use units, but Statistic is unique because units are so integral to its semantic meaning. Every metric type (time, data, rate, ratio) has default units that need visual distinction. No other component has this pattern of "value always paired with unit that needs different styling."

---

### Ant Design - Custom Formatter as Escape Hatch for Domain-Specific Representation

**What it does**: Provides a `formatter` function prop that transforms the value before display, enabling representation of non-standard formats: time durations from seconds, number abbreviations (1234567 → "1.2M"), percentages from decimals, or any domain-specific representation.

```jsx
import { Statistic } from 'antd';

// Time duration formatting
<Statistic
  title="Average Session"
  value={3665}
  formatter={(value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }}
/>

// Large number abbreviation
<Statistic
  title="Total Views"
  value={1234567}
  formatter={(value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  }}
/>

// Complex: percentage calculation display
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

**Why it's sophisticated**: This pattern reveals deep thinking about a core statistic use case: sometimes the value in your database doesn't match how users think about the metric. A duration is stored as seconds (3665) but needs display as "1h 1m". A large count is stored as absolute number but needs display as "1.2M". The formatter acknowledges that statistics often require transformation logic - not just formatting, but semantic re-representation. This is more flexible than props-based solutions (precision, separators) because it handles transformations that don't map to simple configuration.

**Evidence of design maturity**:
- **Edge case handling**: Formatter receives raw value and can return any ReactNode (string, number, JSX), enabling composition of prefix + formatted value + suffix patterns
- **Real-world usage**: Time duration formatting (session length, countdown timers), number abbreviation (social media counts), percentage calculations (progress, conversion rates), custom units (engineering notation)
- **Design restraint**: Provides single function prop rather than explosion of formatting configuration - design philosophy that acknowledges "we can't predict all formatting needs"

**Validation test**: If we removed Statistic, would custom formatters as escape hatches exist elsewhere? Yes, in many components - but for Statistic, it's uniquely important because the whole purpose is making a number prominent, and prominence requires correct representation. Other components display many pieces of data; Statistic displays one metric that must be formatted correctly to communicate meaning. The formatter isn't optional complexity - it's essential to the component's core value proposition.

---

## Recommendations for Semantic UI Implementation

### Component Structure

**Recommended Approach**: Compound component architecture with optional wrappers

**Base Component**: `ui-statistic` with compound structure
```html
<ui-statistic>
  <ui-statistic-label>Revenue</ui-statistic-label>
  <ui-statistic-value>$45,890</ui-statistic-value>
  <ui-statistic-help>Since last month</ui-statistic-help>
</ui-statistic>
```

**Specialized Components**:
- `<ui-statistic-countdown>` - Timer/countdown variant
- `<ui-statistics-group>` - Optional group wrapper
- `<ui-statistic-up>` - Upward trend indicator
- `<ui-statistic-down>` - Downward trend indicator

**Alternative Flat API** (for simple cases):
```html
<ui-statistic
  label="Revenue"
  value="$45,890"
  help="Since last month"
></ui-statistic>
```

### Must-Have Features (Level 1)

#### 1. Basic Value Display
```html
<!-- Numeric values -->
<ui-statistic>
  <ui-statistic-label>Downloads</ui-statistic-label>
  <ui-statistic-value>5,550</ui-statistic-value>
</ui-statistic>

<!-- With settings object -->
<ui-statistic .settings="{
  label: 'Active Users',
  value: 112893
}"></ui-statistic>
```

#### 2. Label/Title Support
```html
<!-- Label below (default) -->
<ui-statistic>
  <ui-statistic-value>40,509</ui-statistic-value>
  <ui-statistic-label>Views</ui-statistic-label>
</ui-statistic>

<!-- Label above (order matters) -->
<ui-statistic>
  <ui-statistic-label>Views</ui-statistic-label>
  <ui-statistic-value>40,509</ui-statistic-value>
</ui-statistic>
```

#### 3. Prefix/Suffix Support
```html
<!-- Icon prefix -->
<ui-statistic>
  <ui-statistic-value>
    <ui-icon slot="prefix" name="dollar"></ui-icon>
    45,890
  </ui-statistic-value>
  <ui-statistic-label>Revenue</ui-statistic-label>
</ui-statistic>

<!-- Text suffix -->
<ui-statistic>
  <ui-statistic-value>
    93
    <span slot="suffix">/ 100</span>
  </ui-statistic-value>
  <ui-statistic-label>Success Rate</ui-statistic-label>
</ui-statistic>

<!-- Unit component (Chakra pattern) -->
<ui-statistic>
  <ui-statistic-value>
    45
    <ui-statistic-unit>ms</ui-statistic-unit>
  </ui-statistic-value>
  <ui-statistic-label>Response Time</ui-statistic-label>
</ui-statistic>
```

#### 4. Color Coding
```html
<!-- Positive (green) -->
<ui-statistic color="green">
  <ui-statistic-value>+11.28%</ui-statistic-value>
  <ui-statistic-label>Growth</ui-statistic-label>
</ui-statistic>

<!-- Negative (red) -->
<ui-statistic color="red">
  <ui-statistic-value>-5.3%</ui-statistic-value>
  <ui-statistic-label>Churn</ui-statistic-label>
</ui-statistic>

<!-- Semantic color system -->
<ui-statistic color="blue">   <!-- Informational -->
<ui-statistic color="orange"> <!-- Warning -->
<ui-statistic color="teal">   <!-- Success -->
```

#### 5. Trend Indicators
```html
<!-- Up indicator (explicit component) -->
<ui-statistic>
  <ui-statistic-value>
    <ui-statistic-up></ui-statistic-up>
    11.28%
  </ui-statistic-value>
  <ui-statistic-label>Growth Rate</ui-statistic-label>
</ui-statistic>

<!-- Down indicator -->
<ui-statistic>
  <ui-statistic-value>
    <ui-statistic-down></ui-statistic-down>
    9.3%
  </ui-statistic-value>
  <ui-statistic-label>Bounce Rate</ui-statistic-label>
</ui-statistic>

<!-- With color -->
<ui-statistic color="green">
  <ui-statistic-value>
    <ui-statistic-up></ui-statistic-up>
    23.36%
  </ui-statistic-value>
</ui-statistic>
```

#### 6. Group Layouts
```html
<!-- Basic group -->
<ui-statistics-group>
  <ui-statistic>
    <ui-statistic-value>22</ui-statistic-value>
    <ui-statistic-label>Faves</ui-statistic-label>
  </ui-statistic>
  <ui-statistic>
    <ui-statistic-value>31,200</ui-statistic-value>
    <ui-statistic-label>Views</ui-statistic-label>
  </ui-statistic>
  <ui-statistic>
    <ui-statistic-value>22</ui-statistic-value>
    <ui-statistic-label>Members</ui-statistic-label>
  </ui-statistic>
</ui-statistics-group>

<!-- Or use standard grid -->
<ui-grid columns="3" gap="4">
  <ui-statistic>...</ui-statistic>
  <ui-statistic>...</ui-statistic>
  <ui-statistic>...</ui-statistic>
</ui-grid>
```

### Should-Have Features (Level 2)

#### 1. Number Formatting
```html
<!-- Precision control -->
<ui-statistic
  value="112893"
  precision="2"
>
  <ui-statistic-label>Account Balance</ui-statistic-label>
</ui-statistic>
<!-- Displays: 112,893.00 -->

<!-- Thousand separators -->
<ui-statistic
  value="1234567890"
  group-separator=","
  decimal-separator="."
></ui-statistic>
<!-- Displays: 1,234,567,890 -->

<!-- Format helper (template) -->
<ui-statistic>
  <ui-statistic-value>{formatNumber(112893, { precision: 2 })}</ui-statistic-value>
  <ui-statistic-label>Balance</ui-statistic-label>
</ui-statistic>
```

#### 2. Help Text
```html
<ui-statistic>
  <ui-statistic-label>Total Revenue</ui-statistic-label>
  <ui-statistic-value>$45,890</ui-statistic-value>
  <ui-statistic-help>Since last month</ui-statistic-help>
</ui-statistic>

<!-- With trend -->
<ui-statistic>
  <ui-statistic-value>
    <ui-statistic-up></ui-statistic-up>
    $45,890
  </ui-statistic-value>
  <ui-statistic-help>12% increase</ui-statistic-help>
</ui-statistic>
```

#### 3. Text Values
```html
<!-- Text value (explicit) -->
<ui-statistic>
  <ui-statistic-value type="text">
    Three<br>
    Thousand
  </ui-statistic-value>
  <ui-statistic-label>Signups</ui-statistic-label>
</ui-statistic>

<!-- Qualitative values -->
<ui-statistic>
  <ui-statistic-value>Excellent</ui-statistic-value>
  <ui-statistic-label>Status</ui-statistic-label>
</ui-statistic>
```

#### 4. Loading States
```html
<!-- Built-in loading (Ant Design pattern) -->
<ui-statistic loading>
  <ui-statistic-label>Revenue</ui-statistic-label>
  <ui-statistic-value>$45,890</ui-statistic-value>
</ui-statistic>

<!-- Custom loading slot -->
<ui-statistic>
  <ui-skeleton slot="loading" height="60px"></ui-skeleton>
  <ui-statistic-value>{revenue}</ui-statistic-value>
</ui-statistic>
```

#### 5. Semantic UI Classic Patterns
```html
<!-- Size tiers (simplified: 3-5 sizes) -->
<ui-statistic size="small">...</ui-statistic>
<ui-statistic size="medium">...</ui-statistic>  <!-- Default -->
<ui-statistic size="large">...</ui-statistic>

<!-- Horizontal orientation -->
<ui-statistic orientation="horizontal">
  <ui-statistic-value>2,204</ui-statistic-value>
  <ui-statistic-label>Views</ui-statistic-label>
</ui-statistic>

<!-- Inverted for dark backgrounds -->
<ui-statistic inverted>
  <ui-statistic-value>54</ui-statistic-value>
  <ui-statistic-label>Inverted</ui-statistic-label>
</ui-statistic>
```

#### 6. Icon Values
```html
<ui-statistic>
  <ui-statistic-value>
    <ui-icon name="plane"></ui-icon>
    5
  </ui-statistic-value>
  <ui-statistic-label>Flights</ui-statistic-label>
</ui-statistic>
```

### Consider Features (Level 3-5)

#### 1. Countdown Component
```html
<ui-statistic-countdown
  value="2025-12-31T23:59:59"
  format="D [days] HH:mm:ss"
>
  <ui-statistic-label>Flash Sale Ends</ui-statistic-label>
</ui-statistic-countdown>

<!-- With callback -->
<ui-statistic-countdown
  value="..."
  format="HH:mm:ss"
  onfinish={() => console.log('Countdown ended!')}
></ui-statistic-countdown>
```

**Format Tokens**:
- `D` - Days
- `HH` - Hours (2 digits)
- `mm` - Minutes (2 digits)
- `ss` - Seconds (2 digits)

#### 2. Custom Formatters
```html
<!-- Via template helper -->
<ui-statistic>
  <ui-statistic-value>
    {formatDuration(3665)}
  </ui-statistic-value>
  <ui-statistic-label>Average Session</ui-statistic-label>
</ui-statistic>

<!-- Via formatter function -->
<ui-statistic
  value="1234567"
  formatter={(value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  }}
></ui-statistic>
```

#### 3. Image Values (Semantic UI Classic)
```html
<ui-statistic>
  <ui-statistic-value>
    <ui-image src="avatar.jpg" avatar circular></ui-image>
    42
  </ui-statistic-value>
  <ui-statistic-label>Team Members</ui-statistic-label>
</ui-statistic>
```

#### 4. Evenly Divided Groups (Semantic UI Classic)
```html
<ui-statistics-group columns="4">
  <ui-statistic>...</ui-statistic>
  <ui-statistic>...</ui-statistic>
  <ui-statistic>...</ui-statistic>
  <ui-statistic>...</ui-statistic>
</ui-statistics-group>
```

#### 5. Locale-Based Formatting
```html
<!-- Via Intl.NumberFormat helper -->
<ui-statistic>
  <ui-statistic-value>
    {formatNumber(45890, {
      style: 'currency',
      currency: 'USD',
      locale: 'en-US'
    })}
  </ui-statistic-value>
</ui-statistic>
```

### Settings Architecture

```javascript
defineComponent({
  name: 'ui-statistic',
  defaultSettings: {
    // Core settings
    label: null,              // Label text (or use slot)
    value: null,              // Value (or use slot)
    help: null,               // Help text (or use slot)

    // Formatting
    precision: null,          // Decimal places
    groupSeparator: ',',      // Thousands separator
    decimalSeparator: '.',    // Decimal separator
    formatter: null,          // Custom formatter function

    // Visual
    color: null,              // Semantic color (red, green, blue, etc.)
    size: 'medium',           // small | medium | large
    orientation: 'vertical',  // vertical | horizontal
    inverted: false,          // Dark mode

    // State
    loading: false,           // Show loading state

    // Prefix/suffix
    prefix: null,             // Prefix content
    suffix: null,             // Suffix content

    // Semantic UI Classic patterns
    avatar: false,            // Avatar-style image value
    bordered: false,          // Add border
    circular: false,          // Circular image
    centered: false,          // Center alignment
    floated: null,            // left | right
  }
})
```

**Countdown Settings**:
```javascript
defineComponent({
  name: 'ui-statistic-countdown',
  defaultSettings: {
    value: null,              // Target timestamp or duration
    format: 'HH:mm:ss',       // Format string (D, HH, mm, ss, SSS)
    onfinish: null,           // Callback when countdown ends
    onchange: null,           // Callback on value change
  }
})
```

**Group Settings**:
```javascript
defineComponent({
  name: 'ui-statistics-group',
  defaultSettings: {
    columns: null,            // Number of columns (1-10)
    gap: 4,                   // Spacing between items
    orientation: 'vertical',  // vertical | horizontal
    // Group-level styling
    size: null,               // Apply to all children
    color: null,              // Apply to all children
    inverted: false,          // Apply to all children
  }
})
```

### Natural Language HTML Examples

```html
<!-- Dashboard Statistics -->
<ui-statistics-group columns="4" gap="6">
  <!-- Total Users -->
  <ui-statistic color="blue">
    <ui-statistic-label>Total Users</ui-statistic-label>
    <ui-statistic-value>
      <ui-icon slot="prefix" name="users"></ui-icon>
      112,893
    </ui-statistic-value>
  </ui-statistic>

  <!-- Revenue with trend -->
  <ui-statistic color="green">
    <ui-statistic-label>Revenue</ui-statistic-label>
    <ui-statistic-value precision="2">
      <ui-icon slot="prefix" name="dollar"></ui-icon>
      98,765.43
    </ui-statistic-value>
    <ui-statistic-help>
      <ui-statistic-up></ui-statistic-up>
      12% increase
    </ui-statistic-help>
  </ui-statistic>

  <!-- Conversion Rate -->
  <ui-statistic>
    <ui-statistic-label>Conversion Rate</ui-statistic-label>
    <ui-statistic-value precision="2">
      11.28
      <ui-statistic-unit>%</ui-statistic-unit>
    </ui-statistic-value>
  </ui-statistic>

  <!-- Bounce Rate (negative) -->
  <ui-statistic color="red">
    <ui-statistic-label>Bounce Rate</ui-statistic-label>
    <ui-statistic-value precision="2">
      <ui-statistic-down></ui-statistic-down>
      9.3
      <ui-statistic-unit>%</ui-statistic-unit>
    </ui-statistic-value>
  </ui-statistic>
</ui-statistics-group>

<!-- Flash Sale Countdown -->
<ui-statistic-countdown
  value="2025-12-31T23:59:59"
  format="HH:mm:ss"
  color="red"
>
  <ui-statistic-label>Flash Sale Ends In</ui-statistic-label>
</ui-statistic-countdown>

<!-- Loading State -->
<ui-statistic loading={isLoading}>
  <ui-statistic-label>Revenue</ui-statistic-label>
  <ui-statistic-value>{revenue}</ui-statistic-value>
</ui-statistic>

<!-- Horizontal Layout -->
<ui-statistic orientation="horizontal" size="small">
  <ui-statistic-value>2,204</ui-statistic-value>
  <ui-statistic-label>Views</ui-statistic-label>
</ui-statistic>

<!-- Text Value -->
<ui-statistic>
  <ui-statistic-value type="text">
    Three<br>
    Thousand
  </ui-statistic-value>
  <ui-statistic-label>Signups</ui-statistic-label>
</ui-statistic>

<!-- With Image (Semantic UI Classic) -->
<ui-statistic>
  <ui-statistic-value>
    <ui-image src="avatar.jpg" avatar circular></ui-image>
    42
  </ui-statistic-value>
  <ui-statistic-label>Team Members</ui-statistic-label>
</ui-statistic>
```

### Shadow DOM Considerations

**Structure**:
```html
<ui-statistic>
  #shadow-root
    <div class="statistic" part="statistic">
      <slot name="label">
        <!-- Or internal label element -->
      </slot>
      <div class="value" part="value">
        <slot name="prefix"></slot>
        <slot name="value">
          <!-- Or internal value element -->
        </slot>
        <slot name="suffix"></slot>
      </div>
      <slot name="help">
        <!-- Or internal help element -->
      </slot>
    </div>
</ui-statistic>
```

**CSS Parts**:
```css
/* External styling via ::part */
ui-statistic::part(statistic) {
  background: white;
  padding: 1rem;
}

ui-statistic::part(value) {
  font-size: 3rem;
  font-weight: bold;
}
```

**Theme CSS Variables**:
```css
:root {
  --statistic-value-size: 2.5rem;
  --statistic-label-size: 0.875rem;
  --statistic-help-size: 0.75rem;

  --statistic-color-positive: #3f8600;
  --statistic-color-negative: #cf1322;
  --statistic-color-neutral: #666;

  --statistic-size-small: 1.5rem;
  --statistic-size-medium: 2.5rem;
  --statistic-size-large: 3.5rem;
}
```

---

## Conclusion

Statistic component research reveals **strong consensus on core functionality** with **meaningful diversity in advanced features**:

### Universal Patterns (100% adoption):
1. Numeric value display with visual prominence
2. Label/title for context
3. Prefix/suffix support (icons, units)
4. Color coding (semantic meaning)
5. Group layouts (multiple statistics together)

### Common Patterns (67% adoption):
1. Number formatting (precision, separators)
2. Text values (non-numeric content)
3. Icon values (icons in values)
4. Trend indicators (arrows, colors)
5. Help text (supporting context)
6. Dark mode/inverted styles

### Framework-Unique Innovations:
- **Ant Design**: Countdown component, loading states, custom formatters
- **Chakra UI v3**: Compound components, FormatNumber integration, explicit indicators (UpIndicator/DownIndicator), ValueUnit component
- **Semantic UI Classic**: 20+ variations (sizes, colors, orientations), flexible content types (text, icons, images), horizontal layout

### Key Strategic Findings:

1. **Compound Components are Modern Standard**: Chakra v3's evolution shows benefits (namespace, discoverability, TypeScript)
2. **Number Formatting Critical**: Ant Design's props vs Chakra's FormatNumber integration both work; provide both approaches
3. **Trend Indicators Should Be Explicit**: Separate components (`<ui-statistic-up>`) better than type props
4. **Loading States Essential**: Async data fetching is common use case
5. **Countdown is Valuable Niche**: Separate component for time-based displays
6. **Horizontal Orientation Underserved**: Only Semantic UI Classic provides this

### Semantic UI Implementation Strategy:

**Component Structure**: Compound components with optional flat API
- `<ui-statistic>` - Base component
- `<ui-statistic-label>` - Label/title
- `<ui-statistic-value>` - Numeric/text value
- `<ui-statistic-help>` - Supporting text
- `<ui-statistic-up>` - Upward trend indicator
- `<ui-statistic-down>` - Downward trend indicator
- `<ui-statistic-unit>` - Unit display (ms, %, etc.)
- `<ui-statistic-countdown>` - Timer/countdown variant
- `<ui-statistics-group>` - Group wrapper (optional)

**Must-Have Features**:
1. Basic value/label display
2. Prefix/suffix slots
3. Color coding system
4. Trend indicators (up/down)
5. Group layouts
6. Number formatting (precision, separators)

**Should-Have Features**:
1. Help text
2. Loading states
3. Text values
4. Icon values
5. Horizontal orientation
6. Size variations
7. Inverted/dark mode

**Consider Features**:
1. Countdown component
2. Custom formatters
3. Image values (Semantic UI Classic)
4. Locale-based formatting
5. Evenly divided groups

**Differentiators**:
- Compound component architecture (modern)
- Semantic UI Classic heritage (horizontal, sizes, content flexibility)
- Built-in loading states (Ant Design pattern)
- Explicit trend indicators (Chakra v3 pattern)
- Countdown variant (Ant Design pattern)
- Natural language API (readable, semantic)

This positions Semantic UI statistic as **comprehensive yet modern**, balancing heritage patterns with contemporary best practices from Ant Design and Chakra UI evolution.

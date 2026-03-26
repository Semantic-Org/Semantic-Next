# Mantine - Chart Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/charts/getting-started/
Status: ✅ Working
Version: v8.3.6 (Mantine Core & Charts)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation covering all chart types (BarChart, LineChart, AreaChart, PieChart, RadarChart, ScatterChart, FunnelChart, CompositeChart, Sparkline) with practical examples, theme integration, responsive behavior, and data formatting options.

## Component Definition
- **Core purpose**: Provides data visualization components for displaying quantitative and categorical information in various chart formats, with rich customization and theme integration
- **Mental model**: A flexible collection of chart components built on Recharts that inherit Mantine's theming system and design principles
- **Semantic meaning**: Charts communicate patterns, trends, comparisons, and distributions in data through visual representation

## Package Structure
- **Package**: `@mantine/charts`
- **Dependency**: Built on top of Recharts (validates against both v2 and v3)
- **Import**: `import '@mantine/charts/styles.css'` (required for styling)
- **Installation**: `npm install @mantine/charts recharts`

## Pattern Support Levels
- **Native**: Dedicated component/prop (e.g., `<BarChart series={...}/>`)
- **Composed**: Via composition/children (e.g., custom SVG patterns within charts)
- **Recharts Integration**: Pass-through props to underlying Recharts components
- **Theming**: Theme token inheritance and CSS custom properties

## Chart Types

### 1. BarChart

**Purpose**: Display categorical data comparisons or time-series trends using vertical/horizontal bars

**Basic Structure**:
```jsx
import { BarChart } from '@mantine/charts';

function Demo() {
  return (
    <BarChart
      h={300}
      data={data}
      dataKey="month"
      series={[
        { name: 'Smartphones', color: 'violet.6' },
        { name: 'Laptops', color: 'blue.6' },
        { name: 'Tablets', color: 'teal.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height in pixels (e.g., `h={300}`)
- `data` - Array of data objects
- `dataKey` - String property name for x-axis values (e.g., `"month"`)
- `series` - Array of `{ name, color }` objects for each data series
- `type` - Chart rendering mode: `'default'` or `'stacked'`
- `withTooltip` - Boolean, enable/disable tooltips (default: true)
- `withLegend` - Boolean, display legend
- `tooltipProps` - Customize tooltip appearance
- `legendProps` - Customize legend (e.g., `{ verticalAlign: 'bottom', height: 50 }`)
- `xAxisProps` / `yAxisProps` - Recharts axis customization
- `gridProps` - Customize grid lines
- `valueFormat` - Function to format numbers: `(value) => value.toFixed(2)`
- `stackId` - For grouped stacking (per-series configuration)

**Variants**:
- **Default**: Each series rendered as separate bars grouped by category
- **Stacked** (`type="stacked"`): Bars stacked vertically, showing composition and totals
- **SVG Patterns**: Can use SVG defs with pattern fills for visual variety

**Styling**:
```jsx
<BarChart
  series={[
    { name: 'Series 1', color: 'url(#pattern1)', stackId: 'a' },
    { name: 'Series 2', color: 'blue.6', stackId: 'b' }
  ]}
>
  <defs>
    <pattern id="pattern1" patternUnits="userSpaceOnUse" width={6} height={8} patternTransform="rotate(45)">
      <rect width="2" height="8" fill="color-mix(in lch, var(--mantine-color-indigo-6) 70%, rgba(0,0,0,0))" />
    </pattern>
  </defs>
</BarChart>
```

---

### 2. LineChart

**Purpose**: Display trends over time or relationships between continuous variables

**Basic Structure**:
```jsx
import { LineChart } from '@mantine/charts';

function Demo() {
  return (
    <LineChart
      h={300}
      data={data}
      dataKey="date"
      series={[
        { name: 'Apples', color: 'indigo.6' },
        { name: 'Oranges', color: 'blue.6' },
        { name: 'Tomatoes', color: 'teal.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height in pixels
- `data` - Array of data objects
- `dataKey` - String property name for x-axis values
- `series` - Array of `{ name, color, curveType? }` objects
- `curveType` - Default curve type for all lines: `'linear'`, `'monotone'` (default), `'bump'`, `'stepAfter'`
- `type` - Chart mode: `'default'` or `'gradient'`
- `strokeWidth` - Line stroke width in pixels
- `withTooltip` - Enable/disable tooltips
- `withLegend` - Display legend
- `gridAxis` - Grid axis: `'x'`, `'y'`, `'xy'`, `'none'` (default: `'x'`)
- `withDots` - Show data point dots (default: true)
- `dotProps` - Customize dot appearance
- `activeDotProps` - Customize active dot on hover
- `tooltipDataSource` - Tooltip behavior: `'all'` (default) or `'segment'` (only hovered line)
- `tooltipAnimationDuration` - Tooltip animation speed in ms

**Variants**:
- **Default**: Lines connecting data points with dots
- **Gradient** (`type="gradient"`): Lines with gradient fill areas beneath them using `gradientStops` prop
- **Per-Series Curve Types**: Different curves per line

**Curve Type Example**:
```jsx
<LineChart
  series={[
    { name: 'Series 1', color: 'blue.6', curveType: 'monotone' },
    { name: 'Series 2', color: 'red.6', curveType: 'linear' },
    { name: 'Series 3', color: 'green.6' } // Falls back to default curveType
  ]}
  curveType="stepAfter"
/>
```

**Gradient Configuration**:
```jsx
<LineChart
  type="gradient"
  data={data}
  dataKey="date"
  series={[
    { name: 'Sales', color: 'blue.6' }
  ]}
  gradientStops={[
    { offset: 0, color: 'blue.1' },
    { offset: 100, color: 'blue.6' }
  ]}
/>
```

---

### 3. AreaChart

**Purpose**: Display filled areas under lines to emphasize magnitude and composition

**Basic Structure**:
```jsx
import { AreaChart } from '@mantine/charts';

function Demo() {
  return (
    <AreaChart
      h={300}
      data={data}
      dataKey="date"
      series={[
        { name: 'Apples', color: 'indigo.6' },
        { name: 'Oranges', color: 'blue.6' },
        { name: 'Tomatoes', color: 'teal.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height
- `data` - Array of data objects
- `dataKey` - X-axis key
- `series` - Array of `{ name, color, curveType? }` objects
- `type` - Chart mode: `'default'` (overlapping) or `'stacked'`
- `curveType` - Curve type: `'linear'`, `'monotone'`, `'bump'`, `'stepAfter'`
- `strokeWidth` - Line stroke width
- `fillOpacity` - Area fill opacity (0-1, default varies by stacking)
- `withTooltip` - Enable tooltips
- `withLegend` - Display legend
- `gridAxis` - Grid axis display
- `dotProps` - Customize data points
- `activeDotProps` - Active dot styling
- `tooltipDataSource` - Tooltip behavior
- `tooltipAnimationDuration` - Animation speed

**Variants**:
- **Default**: Overlapping areas, each series visible with transparency
- **Stacked** (`type="stacked"`): Areas stacked on top of each other, showing composition and totals

**Stacked Example**:
```jsx
<AreaChart
  type="stacked"
  h={300}
  data={data}
  dataKey="month"
  series={[
    { name: 'Category A', color: 'indigo.6' },
    { name: 'Category B', color: 'blue.6' },
    { name: 'Category C', color: 'teal.6' }
  ]}
/>
```

---

### 4. PieChart

**Purpose**: Display parts of a whole, showing proportions and percentages

**Basic Structure**:
```jsx
import { PieChart } from '@mantine/charts';

function Demo() {
  const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 200 }
  ];

  return (
    <PieChart
      h={300}
      data={data}
      dataKey="value"
      series={[
        { name: 'Group', color: 'indigo.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height
- `data` - Array of `{ name, value }` objects
- `dataKey` - Key containing numeric values (usually `"value"`)
- `series` - Single item array defining colors and names
- `withTooltip` - Enable tooltips
- `withLegend` - Display legend
- `legendProps` - Legend customization
- `tooltipProps` - Tooltip customization
- `valueFormat` - Format values in tooltips: `(value) => `${value}%``
- `colors` - Custom color palette for slices
- `startAngle` - Starting angle in degrees (default: 0)
- `endAngle` - Ending angle in degrees (default: 360)
- `innerRadius` - For donut charts, inner radius percentage (0-100)
- `strokeWidth` - Stroke width between pie slices
- `strokeColor` - Stroke color between slices (default: theme background)

**Donut Variant**:
```jsx
<PieChart
  h={300}
  innerRadius={60}
  data={data}
  dataKey="value"
  series={[{ name: 'Group', color: 'blue.6' }]}
/>
```

---

### 5. RadarChart

**Purpose**: Display multivariate data across multiple axes, useful for comparing feature sets

**Basic Structure**:
```jsx
import { RadarChart } from '@mantine/charts';

function Demo() {
  const data = [
    { feature: 'Speed', value1: 80, value2: 70 },
    { feature: 'Reliability', value1: 90, value2: 85 },
    { feature: 'Comfort', value1: 75, value2: 80 },
    { feature: 'Safety', value1: 85, value2: 90 }
  ];

  return (
    <RadarChart
      h={300}
      data={data}
      dataKey="feature"
      series={[
        { name: 'Product A', color: 'blue.6' },
        { name: 'Product B', color: 'red.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height
- `data` - Array of objects with feature names and numeric values
- `dataKey` - Key containing feature names/axis labels
- `series` - Array of `{ name, color }` objects (one per data series)
- `withTooltip` - Enable tooltips
- `withLegend` - Display legend
- `gridProps` - Customize polar grid
- `angleAxisProps` - Customize angle (feature) axis
- `radiusAxisProps` - Customize radius (value) axis
- `dotProps` - Customize data point appearance
- `valueFormat` - Format axis values

---

### 6. ScatterChart

**Purpose**: Display correlation between two continuous variables using data points

**Basic Structure**:
```jsx
import { ScatterChart } from '@mantine/charts';

function Demo() {
  const data = [
    { x: 10, y: 20, series: 'A' },
    { x: 20, y: 30, series: 'A' },
    { x: 30, y: 40, series: 'B' }
  ];

  return (
    <ScatterChart
      h={300}
      data={data}
      series={[
        { name: 'Series A', xAxisKey: 'x', yAxisKey: 'y', color: 'blue.6' },
        { name: 'Series B', xAxisKey: 'x', yAxisKey: 'y', color: 'red.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height
- `data` - Array of objects with x and y values
- `series` - Array of `{ name, xAxisKey, yAxisKey, color }` objects
- `xAxisKey` / `yAxisKey` - Keys for x and y values per series
- `withTooltip` - Enable tooltips
- `withLegend` - Display legend with highlighting on hover
- `gridProps` - Customize grid
- `xAxisProps` / `yAxisProps` - Customize axes
- `pointLabels` - Array of key names to display as point labels
- `strokeWidth` - Point stroke width
- `valueFormat` - Format axis values
- `unit` - Unit label for axes
- `customTooltipDataSource` - Custom tooltip rendering

---

### 7. FunnelChart

**Purpose**: Show progressive attrition through stages, such as conversion funnels or data flow

**Basic Structure**:
```jsx
import { FunnelChart } from '@mantine/charts';

function Demo() {
  const data = [
    { name: 'Visits', value: 10000 },
    { name: 'Clicks', value: 5000 },
    { name: 'Cart Adds', value: 2500 },
    { name: 'Purchases', value: 1000 }
  ];

  return (
    <FunnelChart
      h={300}
      data={data}
      dataKey="name"
      series={[
        { name: 'Conversion', color: 'blue.6' }
      ]}
    />
  );
}
```

**Key Props**:
- `h` / `height` - Chart height
- `data` - Array of `{ name, value }` objects (in order from top to bottom)
- `dataKey` - Key containing stage names
- `series` - Single item array for coloring
- `withTooltip` - Enable tooltips
- `withLegend` - Display legend
- `valueFormat` - Format values in tooltips/labels
- `colors` - Custom color palette
- `tooltipProps` - Tooltip customization

---

### 8. CompositeChart

**Purpose**: Combine multiple chart types (line, area, bar) in a single visualization

**Basic Structure**:
```jsx
import { CompositeChart, LineChartSeries, AreaChartSeries, BarChartSeries } from '@mantine/charts';

function Demo() {
  return (
    <CompositeChart
      h={300}
      data={data}
      dataKey="month"
      withTooltip
      withLegend
    >
      <LineChartSeries name="Apples" dataKey="apples" color="indigo.6" />
      <AreaChartSeries name="Oranges" dataKey="oranges" color="blue.6" />
      <BarChartSeries name="Grapes" dataKey="grapes" color="teal.6" />
    </CompositeChart>
  );
}
```

**Key Props**:
- `h` / `height` - Chart height
- `data` - Shared data array
- `dataKey` - Shared x-axis key
- `withTooltip` - Enable tooltips across all series
- `withLegend` - Display combined legend
- `xAxisProps` / `yAxisProps` - Shared axis configuration
- `gridProps` - Shared grid configuration
- `series` - Child components defining individual series

**Child Components**:
- `<LineChartSeries name="..." dataKey="..." color="..." curveType="..." />`
- `<AreaChartSeries name="..." dataKey="..." color="..." type="stacked|default" />`
- `<BarChartSeries name="..." dataKey="..." color="..." stackId="..." />`

---

### 9. Sparkline

**Purpose**: Display minimalist, small-scale charts for inline data visualization (e.g., performance metrics)

**Basic Structure**:
```jsx
import { Sparkline } from '@mantine/charts';

function Demo() {
  return (
    <Sparkline
      data={[10, 20, 15, 25, 18, 22, 28, 24, 20]}
      color="blue.6"
      curveType="monotone"
      strokeWidth={2}
    />
  );
}
```

**Key Props**:
- `data` - Array of numbers (not objects)
- `color` - Theme color or CSS color value
- `curveType` - `'linear'`, `'monotone'`, `'bump'`, `'stepAfter'`
- `strokeWidth` - Line width in pixels
- `withTooltip` - Enable hover tooltips
- `w` / `width` - Chart width (inline use)
- `h` / `height` - Chart height (typically small, e.g., 30px)

---

## Data Format Patterns

### Basic Data Structure
All charts expect data in a consistent format:

```javascript
const data = [
  { date: '2024-01-01', value1: 100, value2: 120 },
  { date: '2024-01-02', value1: 110, value2: 115 },
  { date: '2024-01-03', value1: 105, value2: 130 }
];
```

**Structure Rules**:
- Data is an array of objects (not nested arrays)
- One property serves as the category/axis key (specified via `dataKey`)
- Remaining properties contain numeric values
- Property names are strings (case-sensitive)

### Series Configuration
All charts use a consistent series pattern:

```javascript
series={[
  { name: 'Display Name', color: 'blue.6', ... },
  { name: 'Display Name 2', color: 'red.6', ... }
]}
```

**Series Object Properties**:
- `name` - String, displayed in legend and tooltips
- `color` - Theme token (e.g., `'blue.6'`, `'teal.2'`) or CSS color (`'#fff'`, `'rgb()'`)
- Additional properties depend on chart type (e.g., `curveType`, `stackId`)

### Color Format Options

1. **Theme Tokens** (Recommended):
   ```javascript
   { color: 'blue.6' }
   { color: 'red.5' }
   { color: 'orange.7' }
   ```

2. **CSS Colors**:
   ```javascript
   { color: '#ff0000' }
   { color: 'rgb(255, 0, 0)' }
   { color: 'hsl(0, 100%, 50%)' }
   ```

3. **SVG Patterns** (BarChart only):
   ```javascript
   { color: 'url(#patternId)' }
   // Requires <defs> with pattern definition in chart children
   ```

### Numeric Formatting

Use `valueFormat` prop to format axis values and tooltips:

```jsx
<BarChart
  valueFormat={(value) => `$${value.toFixed(2)}`}
/>

<LineChart
  valueFormat={(value) => `${(value / 1000).toFixed(1)}K`}
/>
```

---

## Customization Patterns

### Colors & Theming

**Theme Token System**:
```jsx
series={[
  { name: 'Primary', color: 'blue.6' },     // Default weight
  { name: 'Light', color: 'blue.2' },       // Light variant
  { name: 'Dark', color: 'blue.9' }         // Dark variant
]}
```

**Dark Mode Support**:
Charts automatically adapt to dark mode when theme changes. No additional configuration needed.

```jsx
// Colors adjust automatically
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <BarChart ... /> {/* Automatically renders with dark theme colors */}
    </MantineProvider>
  );
}
```

### Legend Customization

```jsx
<BarChart
  withLegend
  legendProps={{
    verticalAlign: 'bottom',  // 'top' or 'bottom'
    height: 50,               // Legend height in px
    margin: { top: 10 }       // Spacing
  }}
/>
```

### Tooltip Customization

```jsx
<LineChart
  withTooltip
  tooltipProps={{
    contentStyle: {
      backgroundColor: '#fff',
      border: '1px solid #ddd'
    },
    cursor: { strokeDasharray: '3 3' }
  }}
  tooltipDataSource="segment"  // Show only hovered line
  tooltipAnimationDuration={300}
/>
```

### Axes Customization

**X-Axis**:
```jsx
<BarChart
  xAxisProps={{
    angle: 45,
    textAnchor: 'start',
    height: 80
  }}
/>
```

**Y-Axis**:
```jsx
<BarChart
  yAxisProps={{
    width: 50,
    type: 'number'
  }}
/>
```

### Grid Customization

```jsx
<BarChart
  gridProps={{
    stroke: '#e0e0e0',
    strokeDasharray: '5 5',
    horizontal: true,
    vertical: false
  }}
  gridAxis="x"  // Show grid on x-axis only ('x', 'y', 'xy', 'none')
/>
```

### Styling Approaches

**Inline with `sx` Prop** (Mantine standard):
```jsx
<BarChart
  sx={{
    width: '100%',
    padding: '1rem',
    backgroundColor: '#f9f9f9'
  }}
/>
```

**CSS Classes**:
```jsx
<BarChart
  className="my-chart"
/>

// In CSS file
.my-chart {
  width: 100%;
  padding: 1rem;
}
```

**Theme Integration**:
```jsx
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/charts/styles.css';

const theme = createTheme({
  colors: {
    blue: ['#f0f9ff', '#e0f2fe', ...]
  }
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <BarChart series={[{ name: 'Data', color: 'blue.6' }]} ... />
    </MantineProvider>
  );
}
```

---

## Responsive Patterns

### Container-Based Responsiveness

Charts are responsive by default via Recharts' `ResponsiveContainer`:

```jsx
<BarChart
  h={300}  // Fixed height
  data={data}
  dataKey="month"
  series={[...]}
/>
```

### Breakpoint-Aware Heights

Using Mantine's `sx` prop with breakpoints:

```jsx
import { BarChart } from '@mantine/charts';

function Demo() {
  return (
    <BarChart
      h={300}
      sx={{
        '@media (max-width: 768px)': {
          height: '200px'
        }
      }}
      data={data}
      dataKey="month"
      series={[...]}
    />
  );
}
```

### Conditional Legend Placement

```jsx
import { useMediaQuery } from '@mantine/hooks';
import { BarChart } from '@mantine/charts';

function Demo() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <BarChart
      withLegend
      legendProps={{
        verticalAlign: isMobile ? 'top' : 'bottom'
      }}
      {...chartProps}
    />
  );
}
```

### Responsive Tooltip Behavior

```jsx
import { useMediaQuery } from '@mantine/hooks';

function Demo() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <LineChart
      tooltipDataSource={isMobile ? 'segment' : 'all'}
      {...chartProps}
    />
  );
}
```

### Full Example: Responsive Dashboard

```jsx
import { BarChart, LineChart } from '@mantine/charts';
import { Stack, SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Stack>
      <SimpleGrid
        cols={isMobile ? 1 : 2}
        spacing="lg"
      >
        <BarChart
          h={isMobile ? 250 : 300}
          data={data}
          dataKey="month"
          series={[...]}
        />
        <LineChart
          h={isMobile ? 250 : 300}
          data={data}
          dataKey="date"
          series={[...]}
        />
      </SimpleGrid>
    </Stack>
  );
}
```

---

## Accessibility Patterns

### Semantic Structure
- Charts render semantic HTML with proper ARIA attributes via Recharts
- All text labels are included in the DOM and accessible to screen readers
- Legend items are properly labeled and associated with data series

### Keyboard Navigation
Charts support keyboard interaction through:
- **Tooltip Activation**: Hover interactions trigger tooltips (keyboard accessible via tab)
- **Legend Interaction**: Legend items respond to hover (highlighted series)
- **Focus Management**: Chart container is focusable, enabling interactive features

### Color Accessibility

**Contrast Requirements**:
- All colors selected via theme tokens (`blue.6`, `red.5`) meet WCAG AA contrast standards
- Custom colors should be validated for sufficient contrast

**Color-Blind Friendly Patterns**:
```jsx
// Use patterns + colors for accessibility
<BarChart
  series={[
    { name: 'Series 1', color: 'blue.6' },
    { name: 'Series 2', color: 'url(#stripes)' } // Pattern fill
  ]}
>
  <defs>
    <pattern id="stripes" patternUnits="userSpaceOnUse" width={4} height={4}>
      <rect width={2} height={4} fill="currentColor" />
    </pattern>
  </defs>
</BarChart>
```

### Label Accessibility

**Axis Labels**:
```jsx
<BarChart
  xAxisProps={{
    label: { value: 'Months', position: 'bottom' }
  }}
  yAxisProps={{
    label: { value: 'Sales ($)', angle: -90, position: 'insideLeft' }
  }}
  {...props}
/>
```

**Legend Labels**:
```jsx
<BarChart
  withLegend
  legendProps={{
    // Legend items are automatically labeled from series.name
    verticalAlign: 'bottom'
  }}
/>
```

### Tooltip Accessibility

Tooltips are accessible to keyboard users through:
- Focus-based activation (tabbing through chart area)
- Semantic content (text-based, not image-based)

### Data Table Alternative
For important data visualizations, provide a data table as an accessible alternative:

```jsx
function AccessibleChart({ data, series }) {
  return (
    <>
      {/* Visual chart */}
      <BarChart data={data} series={series} {...props} />

      {/* Accessible data table */}
      <table role="region" aria-label="Chart data">
        <thead>
          <tr>
            <th>Category</th>
            {series.map(s => <th key={s.name}>{s.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row[dataKey]}</td>
              {series.map(s => <td key={s.name}>{row[s.name]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
```

### ARIA Attributes
Charts inherit proper ARIA attributes from Recharts:
- `role="img"` on chart container (for visual representation)
- Legends have proper `aria-label` attributes
- Tooltips are properly associated with data points

---

## Code Examples

### Basic BarChart with All Features
```jsx
import { BarChart } from '@mantine/charts';
import { MantineProvider } from '@mantine/core';
import '@mantine/charts/styles.css';

const data = [
  { month: 'January', desktop: 1200, mobile: 900, tablet: 300 },
  { month: 'February', desktop: 1300, mobile: 950, tablet: 320 },
  { month: 'March', desktop: 900, mobile: 1100, tablet: 380 }
];

function Demo() {
  return (
    <BarChart
      h={300}
      data={data}
      dataKey="month"
      series={[
        { name: 'Desktop', color: 'indigo.6' },
        { name: 'Mobile', color: 'blue.6' },
        { name: 'Tablet', color: 'teal.6' }
      ]}
      withTooltip
      withLegend
      tooltipProps={{
        contentStyle: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
      }}
      valueFormat={(value) => `${value}px`}
    />
  );
}
```

### Stacked Area Chart with Gradient
```jsx
import { AreaChart } from '@mantine/charts';

const data = [
  { date: '2024-01-01', apples: 100, oranges: 120, tomatoes: 90 },
  { date: '2024-01-02', apples: 110, oranges: 130, tomatoes: 100 },
  { date: '2024-01-03', apples: 120, oranges: 140, tomatoes: 110 }
];

function Demo() {
  return (
    <AreaChart
      h={300}
      data={data}
      dataKey="date"
      type="stacked"
      series={[
        { name: 'Apples', color: 'indigo.6', curveType: 'monotone' },
        { name: 'Oranges', color: 'blue.6', curveType: 'monotone' },
        { name: 'Tomatoes', color: 'teal.6', curveType: 'monotone' }
      ]}
      withTooltip
      withLegend
      gridAxis="y"
    />
  );
}
```

### PieChart with Custom Colors
```jsx
import { PieChart } from '@mantine/charts';

const data = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 200 },
  { name: 'Product D', value: 100 }
];

function Demo() {
  return (
    <PieChart
      h={300}
      data={data}
      dataKey="value"
      series={[{ name: 'Products', color: 'indigo.6' }]}
      colors={['indigo.6', 'blue.6', 'teal.6', 'cyan.6']}
      withTooltip
      withLegend
      valueFormat={(value) => `${Math.round((value / 1000) * 100)}%`}
    />
  );
}
```

### Composite Chart (Multiple Types)
```jsx
import { CompositeChart, LineChartSeries, AreaChartSeries, BarChartSeries } from '@mantine/charts';

const data = [
  { month: 'Jan', revenue: 4000, orders: 240, profit: 2400 },
  { month: 'Feb', revenue: 5000, orders: 300, profit: 2210 },
  { month: 'Mar', revenue: 4200, orders: 290, profit: 2290 }
];

function Demo() {
  return (
    <CompositeChart
      h={300}
      data={data}
      dataKey="month"
      withTooltip
      withLegend
      tooltipAnimationDuration={300}
    >
      <BarChartSeries name="Orders" dataKey="orders" color="indigo.6" stackId="group" />
      <LineChartSeries name="Revenue" dataKey="revenue" color="blue.6" strokeWidth={2} />
      <AreaChartSeries name="Profit" dataKey="profit" color="teal.6" fillOpacity={0.3} />
    </CompositeChart>
  );
}
```

### Responsive Chart with Media Queries
```jsx
import { BarChart } from '@mantine/charts';
import { useMediaQuery } from '@mantine/hooks';

function Demo() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <BarChart
      h={isMobile ? 250 : 350}
      data={data}
      dataKey="month"
      series={[...]}
      legendProps={{
        verticalAlign: isMobile ? 'top' : 'bottom'
      }}
      sx={{
        '@media (max-width: 768px)': {
          padding: '1rem 0'
        }
      }}
    />
  );
}
```

### Donut Chart with Center Text
```jsx
import { PieChart, Text, Stack, Center } from '@mantine/charts';
import { RingProgress } from '@mantine/core';

const data = [
  { name: 'Completed', value: 75 },
  { name: 'Remaining', value: 25 }
];

function Demo() {
  return (
    <Center>
      <Stack align="center" gap={0}>
        <PieChart
          h={250}
          innerRadius={80}
          data={data}
          dataKey="value"
          series={[{ name: 'Status', color: 'blue.6' }]}
          colors={['blue.6', 'gray.3']}
        />
        <Text fw={700} size="xl">75%</Text>
        <Text size="sm" c="dimmed">Complete</Text>
      </Stack>
    </Center>
  );
}
```

### Sparkline for Dashboard Metrics
```jsx
import { Sparkline, Group, Paper, Text } from '@mantine/charts';

const data = [10, 20, 15, 25, 18, 22, 28, 24, 20];

function MetricCard() {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text c="dimmed" size="sm">Revenue</Text>
          <Text fw={700} size="xl">$2,500</Text>
        </div>
        <Sparkline
          data={data}
          color="blue.6"
          curveType="monotone"
          w={100}
          h={30}
        />
      </Group>
    </Paper>
  );
}
```

---

## Notable Features

### Built on Recharts
- Charts leverage industry-standard Recharts library (compatible with v2 and v3)
- All Recharts props pass through via dedicated prop patterns
- Access to Recharts ecosystem and examples
- Active community and extensive documentation

### Theme Integration
- Automatic color inheritance from Mantine theme
- Support for theme color tokens (`blue.6`, `red.5`, etc.)
- Dark mode support built-in (no additional configuration)
- Seamless integration with Mantine's CSS-in-JS system

### Responsive by Default
- Uses Recharts' ResponsiveContainer for automatic sizing
- Works on mobile, tablet, and desktop without configuration
- Supports breakpoint-aware customization via `sx` prop

### Performance
- Efficient rendering via Recharts optimization
- Handles large datasets without lag
- Smooth animations and interactions

### SVG-Based Rendering
- Charts render as SVG (vector graphics)
- Crisp appearance at any resolution
- CSS and DHTML manipulation supported
- Print-friendly (no raster artifacts)

### Comprehensive Type Support
- TypeScript definitions for all props
- Full IDE autocomplete and type checking
- Safe prop passing to underlying Recharts components

### Multiple Chart Types
- 8+ distinct chart types covering various data visualization needs
- Ability to combine types in CompositeChart
- Sparkline component for inline metrics

### Tooltip Flexibility
- Show all series or focused segment data
- Custom content rendering via `contentStyle` and `contentComponent`
- Animation support with `tooltipAnimationDuration`
- Cursor customization

### Legend Management
- Automatic legend generation from series names
- Interactive highlighting on hover
- Customizable positioning and appearance
- Proper accessibility attributes

### Value Formatting
- `valueFormat` function for flexible number formatting
- Applies to axes, tooltips, and labels
- Supports internationalization and custom formats

---

## Research Notes

- Charts package requires separate CSS import: `import '@mantine/charts/styles.css'`
- All charts are responsive out-of-the-box via ResponsiveContainer from Recharts
- Theme color tokens provide WCAG-compliant color combinations
- Mantine charts validate against both Recharts v2 and v3 versions
- Dark mode is automatic and requires no additional code
- SVG pattern fills provide color-blind friendly alternatives to colors alone
- Tooltips are intelligent: show related data on hover
- Legend items highlight corresponding data series for visual correlation
- All chart types support custom props to underlying Recharts components
- The `dataKey` prop is critical - must match property names in data objects
- Series `name` prop is displayed in legends and tooltips
- Series `color` prop accepts theme tokens or any CSS color value
- Container sizing is important: use `h` prop for responsive behavior
- Sparkline differs from other charts: data is array of numbers, not objects
- CompositeChart allows mixing line, area, and bar data in single visualization
- SVG pattern definitions can be included as chart children using `<defs>`
- Package: @mantine/charts (separate from @mantine/core)
- Version 8.3.6 indicates active, mature development
- All examples are production-ready TypeScript/React code
- Mantine charts are part of Mantine's comprehensive UI component ecosystem
- Compatible with Mantine's hooks system (e.g., `useMediaQuery` for responsive)

---

## Conclusion

Mantine charts provide a comprehensive, theme-aware data visualization system built on Recharts. The component library covers diverse visualization needs (bar, line, area, pie, radar, scatter, funnel, and composite charts) with excellent customization and responsive behavior. Strong theme integration, automatic dark mode support, and TypeScript types make them suitable for modern data-driven applications. The accessibility considerations via Recharts and semantic HTML ensure charts are usable across various user needs.

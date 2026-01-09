# ShadCN UI - Chart Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/chart
Status: ✅ Working
Version: Current (Recharts v2, with v3 support in testing)
Last Verified: 2025-11-05

## Documentation Quality
Excellent - Comprehensive documentation with clear examples for multiple chart types, installation instructions, theming patterns, and responsive design guidance.

## Component Definition
- **Core purpose**: Provides composition-based chart components built on Recharts that allow you to create various data visualizations (bar, line, area, pie, radar, radial charts). Offers a flexible, no-abstraction approach where you work directly with Recharts primitives and bring in custom tooltip/legend components only when needed.
- **Mental model**: A set of utility components and configuration patterns that wrap Recharts without abstracting it away. Charts are data-driven visualizations that compose Recharts components with custom styling and theming through CSS variables. Not a monolithic chart component, but rather utilities that enhance Recharts with proper theming and responsive patterns.
- **Semantic meaning**: Represents data visualization and analytics components that communicate trends, distributions, comparisons, and relationships in data through visual graphical representations. Accessibility and clarity are core concerns.

## Pattern Support Levels
- **Native**: Dedicated component or prop
- **Composed**: Via composition with Recharts components
- **CSS-only**: Requires custom styling
- **Config-driven**: Via ChartConfig object

## Chart Type Patterns
| Chart Type | Present | Support | Details |
|-----------|---------|---------|---------|
| Bar Chart | ✅ | Composed | Multi-series bar charts with grouped, stacked, and horizontal variants |
| Line Chart | ✅ | Composed | Single and multi-line charts with markers and smoothing options |
| Area Chart | ✅ | Composed | Stacked and unstacked area charts for cumulative/part-to-whole visualization |
| Pie Chart | ✅ | Composed | Pie and donut charts with multiple size options and label positioning |
| Radar Chart | ✅ | Composed | Radar/spider charts for multi-dimensional comparison |
| Radial Chart | ✅ | Composed | Circular/radial progress and distribution charts |
| Scatter Plot | ✅ | Composed | Scatter charts for correlation visualization |
| Combination | ✅ | Composed | Mixed chart types (bar + line) in single visualization |

## Recharts Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Direct component usage | ✅ | Composed | Use Recharts components directly (BarChart, LineChart, etc.) |
| Data binding | ✅ | Composed | Pass data array to chart component via data prop |
| Series rendering | ✅ | Composed | Use Bar, Line, Area, Pie components to render data series |
| Axis configuration | ✅ | Composed | XAxis, YAxis, CartesianGrid for coordinate system charts |
| Legend support | ✅ | Native | ChartLegend and ChartLegendContent custom components |
| Tooltip integration | ✅ | Native | ChartTooltip and ChartTooltipContent custom components |
| Responsive sizing | ✅ | Composed | ResponsiveContainer with custom height/width handling |

## Theming Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| CSS variable colors | ✅ | Config-driven | ChartConfig uses var(--color-KEY) references |
| Light mode | ✅ | Native | Default light theme via CSS variables |
| Dark mode | ✅ | Native | Automatic dark mode support via CSS custom properties |
| Custom palette | ✅ | Config-driven | Define colors in ChartConfig object |
| Theme consistency | ✅ | Config-driven | Colors pull from design system via CSS custom properties |
| Color tokens | ✅ | Config-driven | HSL, OKLCH, or hex color formats supported |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fluid width | ✅ | CSS-only | w-full class on ChartContainer for full width |
| Fixed minimum height | ✅ | CSS-only | min-h-[200px] or similar required for responsiveness |
| Aspect ratio sizing | ✅ | CSS-only | aspect-ratio classes for square or custom ratios |
| Mobile optimization | ✅ | CSS-only | Breakpoint utilities (xl:, 2xl:) for responsive heights |
| Container queries | ✅ | Composed | Responsive data transformation based on container size |
| Margin management | ✅ | Composed | Top margin for legend/labels h-[calc(100%-theme(spacing.24))] |

## Composition Approach Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ChartContainer wrapper | ✅ | Native | Provides theming context and configuration scoping |
| ChartConfig object | ✅ | Config-driven | Central configuration object for labels and colors |
| Custom tooltip content | ✅ | Composed | ChartTooltipContent with indicator, hideLabel, hideIndicator props |
| Custom legend content | ✅ | Composed | ChartLegendContent for legend customization |
| Recharts primitives | ✅ | Composed | Direct usage of CartesianGrid, XAxis, YAxis, Bar, Line, etc. |
| Nested structure | ✅ | Composed | Chart components nest inside ResponsiveContainer structure |
| Props passthrough | ✅ | Composed | Pass Recharts props directly to chart components |

## Code Examples

### Installation
```bash
npx shadcn@latest add chart
```

### Basic Bar Chart
```typescript
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { month: 'January', desktop: 400, mobile: 240 },
  { month: 'February', desktop: 300, mobile: 139 },
  { month: 'March', desktop: 200, mobile: 980 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function BarChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" />
        <Bar dataKey="mobile" fill="var(--color-mobile)" />
      </BarChart>
    </ChartContainer>
  )
}
```

### Line Chart with Multiple Series
```typescript
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const chartData = [
  { date: 'Jan 1', revenue: 2000, visitors: 1000 },
  { date: 'Jan 2', revenue: 3000, visitors: 1400 },
  { date: 'Jan 3', revenue: 2500, visitors: 1200 },
]

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function LineChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="revenue" stroke="var(--color-revenue)" />
        <Line dataKey="visitors" stroke="var(--color-visitors)" />
      </LineChart>
    </ChartContainer>
  )
}
```

### Area Chart
```typescript
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { month: 'January', users: 400, revenue: 2400 },
  { month: 'February', users: 300, revenue: 1398 },
  { month: 'March', users: 200, revenue: 9800 },
]

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function AreaChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <AreaChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="users" fill="var(--color-users)" stroke="var(--color-users)" />
        <Area dataKey="revenue" fill="var(--color-revenue)" stroke="var(--color-revenue)" />
      </AreaChart>
    </ChartContainer>
  )
}
```

### Pie Chart
```typescript
import { Pie, PieChart, Cell } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const chartData = [
  { name: 'Chrome', value: 400 },
  { name: 'Safari', value: 300 },
  { name: 'Firefox', value: 200 },
]

const chartConfig = {
  chrome: { label: 'Chrome', color: 'hsl(var(--chart-1))' },
  safari: { label: 'Safari', color: 'hsl(var(--chart-2))' },
  firefox: { label: 'Firefox', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

export function PieChartExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartConfig[entry.name as keyof typeof chartConfig]?.color}
            />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  )
}
```

### Responsive Chart with Breakpoints
```typescript
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
]

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function ResponsiveChartExample() {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] w-full xl:h-[300px] 2xl:h-[400px]"
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" />
      </BarChart>
    </ChartContainer>
  )
}
```

### Customized Tooltip
```typescript
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function CustomTooltipExample() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel={false}
              hideIndicator={false}
              indicator="dashed"
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" />
      </BarChart>
    </ChartContainer>
  )
}
```

### Dark Mode Aware Theming
```typescript
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1) / 0.9)',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2) / 0.9)',
  },
} satisfies ChartConfig

// CSS variables automatically adapt to dark mode:
// Light mode: --chart-1: 200 100% 50%
// Dark mode: --chart-1: 200 100% 60%
```

## Notable Features

### Composition-First Architecture
- Charts are built using Recharts components directly, not wrapped in abstractions
- Only bring in custom components (ChartContainer, ChartTooltip, ChartLegend) when needed
- No "chart type" abstraction - each chart type uses its own Recharts component
- Full control over Recharts props and behavior

### ChartConfig Pattern
- Central configuration object for labels and colors
- TypeScript-safe with `satisfies ChartConfig` constraint
- Separates data configuration from visual structure
- Colors reference CSS variables for theme integration
- Enables consistent labeling across legends, tooltips, and data

### CSS Variable Theming
- All colors use CSS custom properties (var(--color-KEY))
- Supports light and dark mode through variable overrides
- Colors defined as HSL, OKLCH, or hex formats
- Theme-agnostic - works with any design system that provides color variables

### Responsive Container Strategy
- Requires explicit min-h-[VALUE] on ChartContainer for proper responsive behavior
- Width automatically fills container (w-full)
- Height managed via Tailwind classes for breakpoint control
- Margins calculated with h-[calc(100%-theme(spacing.24))] for legends

### Custom Tooltip/Legend Components
- ChartTooltipContent with customizable behavior (hideLabel, hideIndicator, indicator type)
- ChartLegendContent for legend customization
- Both components automatically pull colors from ChartConfig
- Support for custom labelKey and nameKey props

### Accessibility Considerations
- Recharts provides base accessibility features (aria attributes)
- Tooltips improve data exploration without modifying DOM structure
- Color-only differentiation supplemented with legends
- Proper semantic structure maintained throughout

### Recharts v2 & v3 Compatibility
- Current implementation uses Recharts v2
- v3 support in active testing phase
- Installation requires recharts dependency (pnpm add recharts)
- React 19 compatibility may require react-is dependency override

## Research Notes

### Framework Approach
ShadCN UI's chart philosophy differs fundamentally from pre-built chart solutions:
- **No abstraction**: Uses Recharts directly without wrapper layer
- **Composition-based**: Build charts by composing Recharts components
- **Copy-paste ready**: Components copied into projects, fully customizable
- **Styling flexible**: Uses Tailwind CSS, not CSS-in-JS or modules

### Design Philosophy
- **Data-driven visualization**: Charts built around data structure and rendering
- **Theme-first**: CSS variable approach enables design system integration
- **Minimal API surface**: Only provides what Recharts doesn't (theming, responsive patterns)
- **Flexibility over convention**: Prefers composition to opinionated patterns

### Composition Strategy
- **ChartContainer**: Provides theming context and responsive wrapper
- **ChartConfig**: Configuration object for labels and colors
- **Recharts primitives**: BarChart, LineChart, Area, etc. used directly
- **Coordinate system**: CartesianGrid, XAxis, YAxis for structured layouts
- **Custom components**: ChartTooltip, ChartLegend for enhanced UX

### Theming Implementation
- **CSS variables pattern**: All colors reference var(--color-KEY) from config
- **No color injection**: Colors defined in ChartConfig, not modified by component
- **Light/dark support**: CSS variable values change per theme
- **Design token compatible**: Colors can reference design system tokens

### Responsive Patterns
- **Container-driven**: min-h-[VALUE] required for chart responsiveness
- **Breakpoint-aware**: Use Tailwind's xl:, 2xl: for height adjustments
- **Fluid width**: Charts expand to full container width by default
- **Aspect ratio control**: Tailwind aspect-ratio classes for proportional sizing

### Pattern Observations
1. **No built-in animation**: Recharts provides animation; integrate directly if needed
2. **Legend auto-coloring**: ChartLegendContent automatically uses ChartConfig colors
3. **Tooltip flexibility**: ChartTooltipContent supports multiple customization options
4. **Data transformation**: Handle data processing outside chart component
5. **Multi-series support**: All chart types support multiple data series

### Strengths
- Extremely flexible through direct Recharts access
- Clean separation of concerns (config vs. rendering)
- Theme integration is straightforward via CSS variables
- Type-safe configuration with TypeScript
- Comprehensive chart type coverage
- Excellent responsive design patterns

### Potential Limitations
- Requires understanding of Recharts component structure
- No pre-built "smart" chart that infers configuration
- Min-height requirement for responsiveness must be remembered
- Data transformation logic must be handled externally
- No built-in loading or error states

### Semantic UI Integration Considerations
- **Composition vs props**: ShadCN uses composition with Recharts; Semantic UI could wrap in a custom component
- **Config pattern**: ChartConfig approach is elegant and type-safe
- **CSS variable theming**: Pattern aligns well with design system integration
- **Responsive patterns**: Container-based sizing could inform responsive component design
- **Component nesting**: Deep nesting of Recharts components might be simplified with wrapper components
- **Custom tooltips**: ShadCN's ChartTooltip/ChartTooltipContent pattern is reusable
- **Legend integration**: Custom legend component pattern demonstrates composition benefits
- **Accessibility**: Recharts provides base accessibility; additional ARIA attributes could enhance

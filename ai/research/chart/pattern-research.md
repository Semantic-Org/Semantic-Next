# Component Pattern Research: Chart

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3
- Date: 2025-11-05
- Unique patterns identified: 35+

## Component Definition Consensus

Chart components provide data visualization through various graphical representations (bar, line, area, pie, radar, etc.). Universal mental model: "transform numeric data into visual insights."

**Primary Purpose:** Enable users to visualize quantitative data through interactive, customizable graphical representations that reveal patterns, trends, comparisons, and distributions.

**Mental Model:** Interactive data visualizations with tooltips, legends, and responsive behavior.

**Semantic meaning:** Represents quantitative information through visual graphical encoding that communicates patterns and insights more effectively than raw numbers.

## Terminology Variations

- **Charts** (3 frameworks) = Mantine, PrimeReact, ShadCN

Note: Chart components are specialized and not universally provided by all UI frameworks. Only 3 of the surveyed frameworks offer dedicated chart components.

## Pattern Inventory

### Chart Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Bar/Column Chart | Vertical or horizontal bars for categorical comparison | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Composed |
| Line Chart | Connected data points showing trends over time | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Composed |
| Area Chart | Filled area under line showing magnitude/composition | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Composed |
| Pie Chart | Circular chart showing part-to-whole relationships | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Composed |
| Radar Chart | Multi-axis comparison of multiple variables | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Composed |
| Scatter Chart | Data points showing correlation between variables | 2/3 (67%) | **Level 2: Common** | Mantine, ShadCN | Mantine: Native; ShadCN: Composed |
| Doughnut Chart | Pie chart with center cutout | 2/3 (67%) | **Level 2: Common** | Mantine, PrimeReact | Native |
| Funnel Chart | Progressive stages showing conversion/flow | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |
| Polar Area Chart | Circular chart with equal angles | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Composite Chart | Multiple chart types in single visualization | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |
| Sparkline | Minimalist inline chart without axes | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |
| Radial Chart | Circular progress/distribution charts | 1/3 (33%) | **Level 4: Occasional** | ShadCN | Composed |

### Data Binding Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Object array data | Data as array of objects with key-value pairs | 2/3 (67%) | **Level 2: Common** | Mantine, ShadCN | Native |
| Labels array | Separate labels array for axis/legend | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Series configuration | Array defining multiple data series | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Color mapping | Associate colors with data series | 3/3 (100%) | **Level 1: Universal** | All | Mantine/ShadCN: Config; PrimeReact: Direct |
| Value formatting | Function to format displayed numbers | 2/3 (67%) | **Level 2: Common** | Mantine, PrimeReact | Native |

### Interaction Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Tooltip on hover | Display values on data point hover | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Custom component |
| Click events | Handle data point click events | 2/3 (67%) | **Level 2: Common** | Mantine, PrimeReact | Native |
| Legend interaction | Click legend to show/hide series | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Zoom/pan | Interactive zoom and pan controls | 0/3 (0%) | **Level 5: Rare** | None | Not supported natively |
| Tooltip customization | Custom tooltip content and styling | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Props; PrimeReact: Callbacks; ShadCN: Component |

### Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Color customization | Custom colors for series | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Theme tokens; PrimeReact: Direct colors; ShadCN: CSS vars |
| Legend configuration | Control legend position, visibility, style | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Axis customization | Configure axis labels, ticks, ranges | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Props; PrimeReact: Options; ShadCN: Components |
| Grid customization | Control grid lines visibility and style | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Animation control | Configure chart animations | 2/3 (67%) | **Level 2: Common** | Mantine, PrimeReact | Native |
| Responsive sizing | Charts adapt to container size | 3/3 (100%) | **Level 1: Universal** | All | Native/CSS |

### Theming Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Theme integration | Colors inherit from design system | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: CSS vars; ShadCN: CSS vars |
| Dark mode support | Automatic dark mode adaptation | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Automatic; PrimeReact: Manual; ShadCN: CSS vars |
| Color tokens | Use semantic color tokens | 2/3 (67%) | **Level 2: Common** | Mantine, ShadCN | Mantine: Theme tokens; ShadCN: CSS variables |
| Custom palette | Define custom color palettes | 3/3 (100%) | **Level 1: Universal** | All | Native |

### Layout Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Stacked series | Stack multiple series vertically | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Grouped series | Group bars/data side by side | 3/3 (100%) | **Level 1: Universal** | All | Mantine: Native; PrimeReact: Native; ShadCN: Composed |
| Horizontal orientation | Horizontal bar charts | 2/3 (67%) | **Level 2: Common** | Mantine, PrimeReact | Native |
| Gradient fills | Gradient backgrounds for areas | 2/3 (67%) | **Level 2: Common** | Mantine, ShadCN | Mantine: Native; ShadCN: Recharts |
| SVG patterns | Pattern fills for accessibility | 1/3 (33%) | **Level 4: Occasional** | Mantine | Composed |

## Notable Patterns

### Universal (100%)
- Bar, Line, Area, Pie, and Radar charts
- Tooltip on hover with value display
- Legend display with configurable layout
- Color customization for series
- Responsive sizing and layout
- Theme integration with design system
- Dark mode support

### Architectural Approaches

**Wrapper Architecture (PrimeReact):**
- Thin wrapper around Chart.js library
- Minimal abstraction over base library
- Direct access to Chart.js features
- React integration layer only

**Native Components (Mantine):**
- Purpose-built chart components
- Built on Recharts with Mantine patterns
- Theme-first integration
- 9 distinct chart types as separate components

**Composition Pattern (ShadCN):**
- Direct Recharts component usage
- Custom configuration pattern (ChartConfig)
- CSS variable theming
- No chart type abstraction

### Data Format Differences

**Mantine:**
```javascript
data = [
  { month: 'Jan', value1: 100, value2: 120 }
]
series = [
  { name: 'Series 1', color: 'blue.6' }
]
```

**PrimeReact:**
```javascript
data = {
  labels: ['Jan', 'Feb'],
  datasets: [{
    label: 'Series 1',
    data: [100, 120],
    backgroundColor: 'rgba(...)'
  }]
}
```

**ShadCN:**
```javascript
data = [
  { month: 'Jan', value1: 100, value2: 120 }
]
config = {
  value1: { label: 'Series 1', color: 'hsl(var(--chart-1))' }
}
```

### Mantine Specializations
- Separate @mantine/charts package
- 9 chart types including Sparkline, Funnel, Composite
- Theme color tokens (e.g., 'blue.6')
- Built-in gradient support
- Per-series curve types
- SVG pattern fills

### PrimeReact Specializations
- Chart.js 3.3.2+ wrapper
- Plugin system access
- Direct Chart.js instance access
- Center text plugin for doughnuts
- Real-time data streaming examples
- Chart export as image

### ShadCN Specializations
- Composition-first philosophy
- No chart type abstraction
- ChartConfig pattern for type-safe configuration
- CSS variable-based theming
- Copy-paste customizable components
- Recharts v2 (v3 in testing)

## Implementation Notes

### Library Dependencies

**Mantine:**
- Package: `@mantine/charts`
- Dependency: Recharts v2/v3
- CSS: `import '@mantine/charts/styles.css'`
- Installation: `npm install @mantine/charts recharts`

**PrimeReact:**
- Package: `primereact`
- Dependency: Chart.js 3.3.2+
- Import: `import Chart from 'primereact/chart'`
- Installation: `npm install primereact chart.js`

**ShadCN:**
- CLI: `npx shadcn@latest add chart`
- Dependency: Recharts v2
- Copies components to project (not npm package)
- Installation: Recharts installed as dependency

### Responsive Strategies

**Mantine:**
- ResponsiveContainer automatic
- Height via `h` prop
- Breakpoint-aware via `sx` prop
- useMediaQuery hook for conditional logic

**PrimeReact:**
- Chart.js responsive: true by default
- Container sizing via CSS/inline styles
- PrimeFlex utilities for grid layout
- onResize callback for dynamic behavior

**ShadCN:**
- Requires min-h-[VALUE] on ChartContainer
- Width automatic (w-full)
- Breakpoint utilities (xl:, 2xl:) for height
- Tailwind-first responsive approach

### Color Management

**Mantine:**
- Theme color tokens: `'blue.6'`, `'red.5'`
- CSS colors: `'#ff0000'`, `'rgb(...)'`
- SVG patterns: `'url(#pattern)'`
- Automatic dark mode adaptation

**PrimeReact:**
- Direct color values: `'rgba(54, 162, 235, 0.8)'`
- CSS variables: `'var(--text-color)'`
- Theme-aware via PrimeReact CSS variables
- Dark mode requires manual color switches

**ShadCN:**
- CSS variables: `'hsl(var(--chart-1))'`
- ChartConfig mapping: `{ key: { color: 'var(...)' } }`
- Automatic dark mode via CSS variable values
- Design system integration ready

## Limited Ecosystem Observation

Only 3 frameworks provide Chart components out of the broader ecosystem. Charts are considered specialized functionality requiring:
- External library dependency (Chart.js or Recharts)
- Complex data visualization logic
- Performance considerations for large datasets
- Accessibility concerns for visual representations

Many frameworks expect developers to integrate chart libraries directly rather than providing wrapper components.

## Accessibility Considerations

### Common Patterns
- Semantic HTML structure (via Recharts/Chart.js)
- ARIA attributes for screen readers
- Keyboard-accessible tooltips
- Legend click handlers for show/hide
- Proper contrast for colors

### Framework-Specific

**Mantine:**
- Theme colors meet WCAG AA standards
- SVG pattern support for color-blind users
- Proper ARIA roles from Recharts
- Focus management on chart container

**PrimeReact:**
- Chart.js accessibility features inherited
- ARIA label props supported
- Color contrast recommendations
- Keyboard navigation via Chart.js

**ShadCN:**
- Recharts base accessibility
- Custom tooltip/legend components accessible
- Color-only differentiation supplemented with legends
- Semantic structure maintained

### Recommendations
- Provide data table alternative for important visualizations
- Use patterns/textures in addition to colors
- Include descriptive labels and legends
- Ensure sufficient color contrast
- Support keyboard navigation

## Raw Data

- [Mantine](./mantine/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)
- [ShadCN](./shadcn/usage-patterns.md)

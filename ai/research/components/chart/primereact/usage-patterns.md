# PrimeReact - Chart Usage Patterns

## Component URL
https://www.primefaces.org/primereact-v8/chart/
Status: ✅ Working
Alternative (Current): https://primereact.org/chart/
API Reference: https://primereact.org/chart/
Version: v8+ (Chart.js 3.3.2+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - PrimeReact provides detailed documentation with interactive live examples, code samples, and complete API reference. Documentation references Chart.js 3.3.2+ for advanced customization options.

---

## 1. Component Overview

The PrimeReact Chart component is a lightweight wrapper around Chart.js 3.3.2+ that provides React integration for building interactive, responsive data visualizations. It supports six chart types (Line, Bar, Pie, Doughnut, Radar, and Polar Area) and offers extensive customization through Chart.js options. The component is designed for both simple and complex data visualization scenarios, with a focus on flexibility, responsiveness, and seamless integration with PrimeReact's theming system.

Key characteristics:
- **Wrapper Architecture**: Wraps Chart.js library for React consumption
- **Chart Type Support**: 6 core chart types with unlimited customization
- **Data-Driven**: Declarative data binding with reactive updates
- **Responsive**: Built-in responsive behavior with CSS utility support
- **Theme Integration**: Works with PrimeReact's CSS variable-based theming system
- **Accessibility**: Inherits Chart.js accessibility features

---

## 2. Installation & Setup

### Installation

```bash
npm install primereact chart.js
```

### Import

```javascript
// Import component
import Chart from 'primereact/chart';

// Chart.js must be available (installed separately)
import 'chart.js/auto'; // Auto-register chart types
```

### Basic Implementation

```jsx
import React, { useState } from 'react';
import Chart from 'primereact/chart';

function SimpleChart() {
  const [chartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56],
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true
      }
    ]
  });

  const [options] = useState({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales'
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  });

  return <Chart type="line" data={chartData} options={options} />;
}
```

---

## 3. Chart Types & Data Formats

### 3.1 Line Chart

**Use Cases**: Time series data, trend analysis, performance tracking, multiple data comparisons

**Data Format:**
```javascript
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#4bc0c0',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2
    },
    {
      label: 'Dataset 2',
      data: [28, 48, 40, 19, 86, 27],
      borderColor: '#ff6b6b',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2
    }
  ]
};
```

**Common Options:**
```javascript
const lineOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  },
  plugins: {
    filler: {
      propagate: true
    },
    title: {
      display: true,
      text: 'Line Chart Example'
    },
    legend: {
      display: true,
      position: 'top'
    }
  }
};
```

**Example Implementation:**
```jsx
<Chart type="line" data={lineChartData} options={lineOptions} />
```

---

### 3.2 Bar Chart

**Use Cases**: Comparing values across categories, distribution analysis, performance metrics, categorical data visualization

**Data Format:**
```javascript
const barChartData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue',
      data: [120, 190, 150, 170],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(231, 233, 237, 0.8)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(231, 233, 237, 1)'
      ],
      borderWidth: 1
    },
    {
      label: 'Expenses',
      data: [80, 120, 90, 110],
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }
  ]
};
```

**Common Options:**
```javascript
const barOptions = {
  indexAxis: 'x', // 'x' for vertical bars, 'y' for horizontal
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 50
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Bar Chart Example'
    },
    legend: {
      display: true,
      position: 'top'
    }
  }
};
```

**Horizontal Bar Chart:**
```javascript
// For horizontal bars, use indexAxis: 'y'
const horizontalBarOptions = {
  ...barOptions,
  indexAxis: 'y'
};
```

**Example Implementation:**
```jsx
<Chart type="bar" data={barChartData} options={barOptions} />
```

---

### 3.3 Pie Chart

**Use Cases**: Part-to-whole relationships, percentage distributions, composition analysis, single-level categorization

**Data Format:**
```javascript
const pieChartData = {
  labels: ['Product A', 'Product B', 'Product C', 'Product D'],
  datasets: [
    {
      data: [300, 50, 100, 75],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    }
  ]
};
```

**Common Options:**
```javascript
const pieOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: 'Pie Chart Example'
    },
    legend: {
      display: true,
      position: 'right'
    },
    datalabels: {
      color: '#fff',
      formatter: (value, ctx) => {
        return Math.round(value) + '%';
      }
    }
  }
};
```

**Example Implementation:**
```jsx
<Chart type="pie" data={pieChartData} options={pieOptions} />
```

---

### 3.4 Doughnut Chart

**Use Cases**: Similar to pie charts but with center space for additional information, status indicators, percentage displays

**Data Format:**
```javascript
const doughnutChartData = {
  labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
  datasets: [
    {
      data: [300, 150, 100, 50],
      backgroundColor: [
        'rgba(75, 192, 75, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(244, 67, 54, 0.8)'
      ],
      borderColor: [
        'rgba(75, 192, 75, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(244, 67, 54, 1)'
      ],
      borderWidth: 2,
      // Doughnut-specific options
      cutout: '60%' // Controls the inner circle size
    }
  ]
};
```

**Center Text Plugin (Custom Implementation):**
```javascript
// To display text in the doughnut hole, use a plugin
const chartPlugins = [
  {
    id: 'centerText',
    beforeDatasetsDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.restore();
      ctx.font = 'bold 16px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';

      const text = 'Total: 600';
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }
];
```

**Common Options:**
```javascript
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: 'Doughnut Chart Example'
    },
    legend: {
      display: true,
      position: 'bottom'
    }
  }
};
```

**Example Implementation:**
```jsx
<Chart
  type="doughnut"
  data={doughnutChartData}
  options={doughnutOptions}
  plugins={chartPlugins}
/>
```

---

### 3.5 Radar Chart

**Use Cases**: Multi-dimensional data comparison, skill assessment, attribute ratings, performance analysis across multiple criteria

**Data Format:**
```javascript
const radarChartData = {
  labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Features'],
  datasets: [
    {
      label: 'Car A',
      data: [65, 59, 90, 81, 56, 55],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderWidth: 2
    },
    {
      label: 'Car B',
      data: [28, 48, 40, 19, 96, 27],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderWidth: 2
    }
  ]
};
```

**Common Options:**
```javascript
const radarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Radar Chart Example'
    },
    legend: {
      display: true,
      position: 'top'
    }
  }
};
```

**Example Implementation:**
```jsx
<Chart type="radar" data={radarChartData} options={radarOptions} />
```

---

### 3.6 Polar Area Chart

**Use Cases**: Similar to radar but with equal angles, comparison of values across categories, distribution analysis

**Data Format:**
```javascript
const polarChartData = {
  labels: ['North', 'South', 'East', 'West', 'Central'],
  datasets: [
    {
      label: 'Region Sales',
      data: [120, 190, 150, 170, 145],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 2
    }
  ]
};
```

**Common Options:**
```javascript
const polarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 200
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Polar Area Chart Example'
    },
    legend: {
      display: true,
      position: 'right'
    }
  }
};
```

**Example Implementation:**
```jsx
<Chart type="polarArea" data={polarChartData} options={polarOptions} />
```

---

## 4. Component Props/API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'line' \| 'bar' \| 'pie' \| 'doughnut' \| 'radar' \| 'polarArea'` | - | The chart type to display. Required. |
| `data` | `object` | - | Chart data object containing labels and datasets. Required. |
| `options` | `object` | - | Chart configuration and customization options. Optional. |
| `plugins` | `array` | - | Array of Chart.js plugins to extend functionality. Optional. |
| `id` | `string` | - | Unique identifier for the chart DOM element. Optional. |
| `style` | `object` | - | Inline CSS styles for the chart container. Optional. |
| `className` | `string` | - | CSS class names for the chart container. Optional. |
| `width` | `number` | - | Width of the chart container in pixels (alternative to CSS). Optional. |
| `height` | `number` | - | Height of the chart container in pixels (alternative to CSS). Optional. |
| `onDataSelect` | `function` | - | Callback fired when a data point is clicked. Signature: `(event) => void`. Optional. |

### Data Structure

All charts use a consistent data structure:

```javascript
{
  labels: Array<string>,     // Category or axis labels
  datasets: [
    {
      label: string,         // Dataset name
      data: Array<number>,   // Numeric values
      // Chart-type-specific properties
      backgroundColor: string | Array<string>,
      borderColor: string | Array<string>,
      borderWidth: number,
      fill: boolean,
      tension: number,
      // ... more options
    }
  ]
}
```

### Options Structure

Options follow Chart.js 3.3.2+ structure:

```javascript
{
  // Responsive behavior
  responsive: boolean,
  maintainAspectRatio: boolean,
  aspectRatio: number,

  // Animation and interaction
  animation: object,
  interaction: object,

  // Scales (not used in pie/doughnut/polar)
  scales: object,

  // Plugins (legend, title, tooltip, etc.)
  plugins: {
    title: object,
    legend: object,
    tooltip: object,
    datalabels: object,
    filler: object
    // ... more plugins
  },

  // Chart-specific options
  // ...
}
```

---

## 5. Chart.js Integration

### Chart.js Dependency

PrimeReact Chart is a thin wrapper around Chart.js. The underlying library must be installed separately:

```bash
npm install chart.js
```

### Chart.js Version

- **Supported Versions**: 3.3.2+
- **Current Recommended**: 4.x (latest)

### Auto-Registration

To automatically register all chart types, use:

```javascript
import 'chart.js/auto';
```

### Manual Registration (if needed)

```javascript
import Chart from 'chart.js/auto';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  PolarAreaController,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  PolarAreaController,
  Tooltip,
  Legend,
  Filler
);
```

### Chart.js Plugin System

PrimeReact supports Chart.js plugins via the `plugins` prop:

```jsx
const customPlugin = {
  id: 'customLabel',
  afterDatasetsDraw(chart) {
    // Plugin implementation
  }
};

<Chart type="bar" data={data} options={options} plugins={[customPlugin]} />
```

### Direct Chart Instance Access

To access the underlying Chart.js instance:

```javascript
import Chart from 'primereact/chart';
import { useRef } from 'react';

function ChartComponent() {
  const chartRef = useRef(null);

  const getChartInstance = () => {
    if (chartRef.current) {
      return chartRef.current.chart; // Access Chart.js instance
    }
  };

  return <Chart ref={chartRef} type="line" data={data} options={options} />;
}
```

---

## 6. Customization Options

### 6.1 Data Customization

**Per-Dataset Customization:**
```javascript
const customData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Primary',
      data: [120, 190, 150, 170],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      tension: 0.4,        // Line smoothness
      fill: true,          // Fill area under line
      pointRadius: 5,      // Data point size
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }
  ]
};
```

### 6.2 Scale Customization

**Y-Axis Scale:**
```javascript
const scaleOptions = {
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10,
        font: { size: 12 },
        color: '#666',
        callback: (value) => '$' + value
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: true
      }
    }
  }
};
```

**X-Axis Scale:**
```javascript
const xAxisOptions = {
  scales: {
    x: {
      ticks: {
        font: { size: 12 },
        color: '#666'
      },
      grid: {
        display: false
      }
    }
  }
};
```

### 6.3 Legend Customization

```javascript
const legendOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'top',        // 'top', 'right', 'bottom', 'left'
      align: 'center',        // 'start', 'center', 'end'
      labels: {
        color: '#333',
        font: { size: 14, weight: 'bold' },
        padding: 20,
        usePointStyle: true,   // Use point style instead of rectangle
        pointStyle: 'circle',  // 'circle', 'rect', 'star', etc.
        generateLabels: (chart) => {
          // Custom label generation
          return chart.data.datasets.map((dataset, i) => ({
            text: dataset.label,
            fillStyle: dataset.backgroundColor,
            hidden: false,
            index: i
          }));
        }
      },
      onClick: (e, legendItem, legend) => {
        // Custom legend item click handler
        const chart = legend.chart;
        const datasetIndex = legendItem.datasetIndex;
        chart.toggleDataVisibility(datasetIndex, datasetIndex);
      }
    }
  }
};
```

### 6.4 Title Customization

```javascript
const titleOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Sales Report',
      font: {
        size: 18,
        weight: 'bold',
        family: 'Arial'
      },
      color: '#333',
      padding: {
        top: 10,
        bottom: 30
      },
      align: 'center'
    }
  }
};
```

### 6.5 Tooltip Customization

```javascript
const tooltipOptions = {
  plugins: {
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#4bc0c0',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        title: (context) => 'Custom Title',
        label: (context) => {
          const value = context.parsed.y;
          return `Value: $${value}`;
        },
        afterLabel: (context) => {
          return 'Additional info';
        }
      }
    }
  }
};
```

### 6.6 Animation Customization

```javascript
const animationOptions = {
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart',
    onProgress: function(animation) {
      // Called for each animation frame
    },
    onComplete: function(animation) {
      // Called when animation completes
    }
  }
};
```

---

## 7. Event Handling

### Chart Click Events

```javascript
const handleChartClick = (event) => {
  if (event.elements.length > 0) {
    const dataIndex = event.elements[0].index;
    const datasetIndex = event.elements[0].datasetIndex;
    const value = event.chart.data.datasets[datasetIndex].data[dataIndex];
    console.log(`Clicked data point: ${value}`);
  }
};

<Chart type="bar" data={data} options={options} onDataSelect={handleChartClick} />
```

### Chart Lifecycle Events

Using Chart.js plugins to hook into lifecycle events:

```javascript
const lifecyclePlugin = {
  id: 'lifecycle',

  afterInit(chart) {
    console.log('Chart initialized');
  },

  beforeDraw(chart) {
    console.log('Before draw');
  },

  afterDraw(chart) {
    console.log('After draw - chart is fully rendered');
  },

  beforeDatasetsDraw(chart) {
    console.log('Before datasets drawn');
  },

  beforeEvent(chart, args) {
    console.log('Event triggered:', args.event.type);
  }
};

<Chart type="line" data={data} options={options} plugins={[lifecyclePlugin]} />
```

---

## 8. Styling & Theming

### 8.1 Container Styling

**CSS Classes:**
```jsx
// Using PrimeFlex CSS utilities
<Chart
  type="line"
  data={data}
  options={options}
  className="w-full md:w-30rem"
/>

// Or with custom CSS classes
<Chart
  type="line"
  data={data}
  options={options}
  className="custom-chart-container"
/>
```

**Inline Styles:**
```jsx
<Chart
  type="line"
  data={data}
  options={options}
  style={{
    width: '100%',
    height: '400px',
    padding: '20px'
  }}
/>
```

### 8.2 PrimeReact Theme Integration

PrimeReact provides theme variables that can be used in chart options:

```javascript
// Using PrimeReact CSS variables
const themeAwareOptions = {
  plugins: {
    legend: {
      labels: {
        color: 'var(--text-color)',
        font: { size: 14 }
      }
    },
    title: {
      display: true,
      text: 'Sales Report',
      color: 'var(--text-color)'
    }
  },
  scales: {
    y: {
      ticks: {
        color: 'var(--text-color)'
      },
      grid: {
        color: 'var(--surface-border)'
      }
    },
    x: {
      ticks: {
        color: 'var(--text-color)'
      },
      grid: {
        color: 'var(--surface-border)'
      }
    }
  }
};
```

### 8.3 Dark Mode Support

```javascript
const getDarkModeOptions = (isDarkMode) => ({
  plugins: {
    legend: {
      labels: {
        color: isDarkMode ? '#e0e0e0' : '#333'
      }
    }
  },
  scales: {
    y: {
      ticks: {
        color: isDarkMode ? '#e0e0e0' : '#666'
      },
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
});
```

### 8.4 Responsive Sizing

**Using PrimeFlex Utilities:**
```jsx
<div className="grid">
  <div className="col-12 md:col-6">
    <Chart type="line" data={data} options={options} />
  </div>
  <div className="col-12 md:col-6">
    <Chart type="bar" data={data} options={options} />
  </div>
</div>
```

**Using Chart Options:**
```javascript
const responsiveOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 16 / 9,

  // Media query-like behavior via plugins
  onResize: (chart, size) => {
    if (size.width < 768) {
      chart.options.plugins.legend.position = 'bottom';
    } else {
      chart.options.plugins.legend.position = 'right';
    }
  }
};
```

---

## 9. Advanced Patterns

### 9.1 Dynamic Data Updates

```jsx
function DynamicChart() {
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [10, 20, 30],
      backgroundColor: 'rgba(54, 162, 235, 0.8)'
    }]
  });

  const updateData = () => {
    setChartData(prev => ({
      ...prev,
      datasets: [{
        ...prev.datasets[0],
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100]
      }]
    }));
  };

  return (
    <>
      <Chart type="bar" data={chartData} options={options} />
      <button onClick={updateData}>Update Data</button>
    </>
  );
}
```

### 9.2 Multiple Charts Comparison

```jsx
function ChartComparison() {
  const chartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Revenue',
      data: [120, 190, 150, 170],
      backgroundColor: 'rgba(54, 162, 235, 0.8)'
    }]
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <Chart type="line" data={chartData} options={options} />
      </div>
      <div className="col-12 md:col-6">
        <Chart type="bar" data={chartData} options={options} />
      </div>
      <div className="col-12 md:col-6">
        <Chart type="pie" data={chartData} options={options} />
      </div>
      <div className="col-12 md:col-6">
        <Chart type="radar" data={chartData} options={options} />
      </div>
    </div>
  );
}
```

### 9.3 Data Filtering with Charts

```jsx
function FilteredChart() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const allData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Sales',
      data: [10, 20, 30, 25, 40]
    }]
  };

  const filteredData = {
    'all': allData,
    'high': {
      ...allData,
      datasets: [{
        label: 'Sales (High)',
        data: [30, 25, 40]
      }]
    }
  };

  return (
    <>
      <select onChange={(e) => setSelectedFilter(e.target.value)}>
        <option value="all">All Data</option>
        <option value="high">High Values</option>
      </select>
      <Chart
        type="line"
        data={filteredData[selectedFilter]}
        options={options}
      />
    </>
  );
}
```

### 9.4 Export Chart as Image

```javascript
// Using Chart.js canvas reference
const exportChartAsImage = (chartRef) => {
  if (chartRef.current && chartRef.current.chart) {
    const imageUrl = chartRef.current.chart.toBase64Image();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'chart.png';
    link.click();
  }
};
```

---

## 10. Performance Optimization

### 10.1 Lazy Loading Charts

```jsx
import { lazy, Suspense } from 'react';

const LazyChart = lazy(() => import('./Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <LazyChart />
    </Suspense>
  );
}
```

### 10.2 Memoization

```javascript
import { memo } from 'react';

const OptimizedChart = memo(function ChartComponent({ data, options }) {
  return <Chart type="line" data={data} options={options} />;
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
```

### 10.3 Data Aggregation for Large Datasets

```javascript
// Aggregate large datasets to improve performance
function aggregateData(rawData, aggregationLevel = 7) {
  const aggregated = [];
  for (let i = 0; i < rawData.length; i += aggregationLevel) {
    const slice = rawData.slice(i, i + aggregationLevel);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    aggregated.push(Math.round(avg));
  }
  return aggregated;
}

const largeDataset = {
  labels: generateLabels(1000),
  datasets: [{
    label: 'Large Dataset',
    data: aggregateData(generateData(1000))
  }]
};
```

---

## 11. Common Patterns & Use Cases

### 11.1 Dashboard with Multiple Charts

```jsx
function SalesDashboard() {
  const salesData = { /* ... */ };
  const revenueData = { /* ... */ };
  const regionData = { /* ... */ };
  const trendData = { /* ... */ };

  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        <Card>
          <Chart type="pie" data={salesData} options={pieOptions} />
        </Card>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <Card>
          <Chart type="doughnut" data={revenueData} options={doughnutOptions} />
        </Card>
      </div>
      <div className="col-12 md:col-6 lg:col-6">
        <Card>
          <Chart type="bar" data={regionData} options={barOptions} />
        </Card>
      </div>
      <div className="col-12">
        <Card>
          <Chart type="line" data={trendData} options={lineOptions} />
        </Card>
      </div>
    </div>
  );
}
```

### 11.2 Real-Time Data Streaming

```jsx
function RealtimeChart() {
  const [chartData, setChartData] = useState({
    labels: ['0s', '1s', '2s', '3s', '4s'],
    datasets: [{
      label: 'Real-time Data',
      data: [10, 20, 30, 25, 40],
      backgroundColor: 'rgba(54, 162, 235, 0.8)'
    }]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.datasets[0].data, Math.random() * 100];
        const newLabels = [...prev.labels, `${prev.labels.length}s`];

        // Keep only last 10 data points
        if (newData.length > 10) {
          newData.shift();
          newLabels.shift();
        }

        return {
          labels: newLabels,
          datasets: [{
            ...prev.datasets[0],
            data: newData
          }]
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Chart type="line" data={chartData} options={options} />;
}
```

### 11.3 Interactive Filtering

```jsx
function FilterableChart() {
  const [filters, setFilters] = useState({
    region: 'all',
    quarter: 'all'
  });

  const getFilteredData = () => {
    // Logic to filter data based on selected filters
    return filteredChartData;
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Dropdown
          value={filters.region}
          options={regions}
          onChange={(e) => setFilters(p => ({ ...p, region: e.value }))}
        />
        <Dropdown
          value={filters.quarter}
          options={quarters}
          onChange={(e) => setFilters(p => ({ ...p, quarter: e.value }))}
        />
      </div>
      <Chart type="bar" data={getFilteredData()} options={options} />
    </>
  );
}
```

---

## 12. Accessibility

### ARIA Labels

```jsx
<Chart
  type="line"
  data={data}
  options={options}
  aria-label="Monthly Sales Trend"
  aria-describedby="chart-description"
/>
<p id="chart-description">
  Shows the trend of sales over the past 12 months, with three product lines compared
</p>
```

### Keyboard Navigation

Chart.js provides built-in keyboard support through plugins. Enable interaction:

```javascript
const accessibleOptions = {
  interaction: {
    mode: 'nearest',
    intersect: false
  },
  plugins: {
    tooltip: {
      enabled: true
    }
  }
};
```

### Color Contrast

Ensure color choices meet WCAG AA standards (4.5:1 contrast ratio):

```javascript
const accessibleColors = {
  datasets: [
    {
      backgroundColor: '#0066cc',  // Good contrast
      borderColor: '#000000'       // High contrast
    }
  ]
};
```

---

## 13. Browser Support & Compatibility

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Dependencies
- React 16.3+
- Chart.js 3.3.2+

### Polyfills
For older browsers, ensure the following polyfills are included:
- Array.from()
- Object.assign()
- Promise

---

## 14. Best Practices

### ✅ Do
1. **Memoize chart options** to prevent unnecessary re-renders
2. **Use semantic colors** that represent data meaning
3. **Provide chart titles** for context
4. **Include legends** when using multiple datasets
5. **Use responsive options** for mobile compatibility
6. **Aggregate large datasets** for performance
7. **Test accessibility** with screen readers
8. **Use appropriate chart types** for your data

### ❌ Don't
1. **Don't use pie charts** for more than 5-6 categories
2. **Don't use 3D effects** (reduces readability)
3. **Don't use rainbow colors** (use a cohesive palette)
4. **Don't forget labels** on axes
5. **Don't place charts** at tiny sizes
6. **Don't animate** every update (performance issue)
7. **Don't truncate data** without explanation
8. **Don't mix incompatible chart types** on same dataset

---

## 15. Migration Guide (Classic UI to Semantic UI)

### Key Differences from Semantic UI Classic

**Semantic UI Classic (jQuery-based):**
```html
<div class="ui chart">
  <canvas id="myChart"></canvas>
</div>

<script>
$('#myChart').chart({
  type: 'line',
  data: { ... }
});
</script>
```

**PrimeReact (Modern React):**
```jsx
import Chart from 'primereact/chart';

<Chart type="line" data={chartData} options={chartOptions} />
```

### Migration Steps
1. Replace jQuery initialization with React component import
2. Convert chart data to declarative props
3. Move Chart.js configuration to options prop
4. Use React state for dynamic data updates
5. Leverage React lifecycle for data fetching

---

## 16. Troubleshooting

### Common Issues & Solutions

**Issue: Chart not rendering**
- Ensure Chart.js is installed: `npm install chart.js`
- Verify data structure matches chart type
- Check console for errors

**Issue: Legend position ignored**
```javascript
// Correct property nesting
plugins: {
  legend: {
    position: 'top'  // Not chartOptions.legend.position
  }
}
```

**Issue: Responsive not working**
```javascript
// Must have responsive: true
responsive: true,
maintainAspectRatio: true  // Set false for custom aspect ratio
```

**Issue: Data labels not showing**
- Use a data labels plugin: `npm install chartjs-plugin-datalabels`
- Register in plugins prop

---

## 17. Research Notes

- PrimeReact Chart is a lightweight wrapper focused on React integration
- All styling and advanced configuration is delegated to Chart.js options
- Strong integration with PrimeReact's theming system via CSS variables
- Excellent for enterprise dashboards and data visualization needs
- Community support through GitHub issues and StackOverflow
- Active development with regular updates to match Chart.js versions
- Comprehensive examples and interactive demos on official documentation

---

## 18. Notable Features

1. **Chart.js Integration**: Direct access to full Chart.js feature set
2. **Minimal Abstraction**: Thin wrapper that doesn't hide functionality
3. **TypeScript Support**: Full type definitions available
4. **Plugin System**: Extensible via Chart.js plugins
5. **Theme Integration**: Works seamlessly with PrimeReact themes
6. **Performance**: Handles large datasets efficiently
7. **Responsive by Default**: Built-in responsive behavior
8. **Multiple Chart Types**: 6 main types + Chart.js plugins for more
9. **Event Handling**: Access to chart click events and interactions
10. **Accessibility**: Inherits Chart.js accessibility features

---

## Research Metadata

**Total Framework Coverage:** PrimeReact v8+ with Chart.js 3.3.2+

**Research Date:** 2025-11-05

**Component Category:** Data Visualization / Charts

**Chart Types Analyzed:** 6
- Line Chart
- Bar Chart
- Pie Chart
- Doughnut Chart
- Radar Chart
- Polar Area Chart

**Data Integration:** Chart.js-based (labels + datasets structure)

**Customization Approach:** Chart.js options + plugins system

**Styling Method:** CSS utilities + Chart.js configuration + CSS variables

**Accessibility Support:** WCAG AA compliance via Chart.js

**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## Conclusion

PrimeReact Chart provides a modern, React-friendly wrapper around Chart.js with excellent customization capabilities. It's ideal for:

- ✅ Enterprise dashboards requiring multiple chart types
- ✅ Data-driven applications with dynamic updates
- ✅ Projects already using PrimeReact components
- ✅ Developers who want direct access to Chart.js features
- ✅ Responsive, accessible data visualizations

The component's strength lies in its minimal abstraction layer, allowing full leveraging of Chart.js capabilities while maintaining React patterns and PrimeReact theme integration.

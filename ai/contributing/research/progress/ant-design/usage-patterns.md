# Ant Design - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/progress
Status: ✅ Working
Version: 5.x (Current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, multiple type variants, code examples, and design guidance.

## Component Definition
- **Core purpose**: Displays the current progress of an operation, providing visual feedback for asynchronous tasks, file uploads, multi-step processes, and long-running operations.
- **Mental model**: A progress indicator that visualizes completion percentage or indeterminate progress. Adapts to different contexts: linear progress bars for horizontal workflows, circular progress for focused indicators, and dashboard-style arcs for compact displays.
- **Semantic meaning**: Communicates operation progress state to users, reducing anxiety during wait times. Visual state changes (success, error, normal) provide additional context about operation outcome.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `percent={50}`, `type="line"`, `status="success"`)
- **Composed**: Via composition/children (e.g., custom content around progress, slots for additional text)
- **CSS-only**: Requires custom styling (e.g., custom colors, animations, dimensions)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `format` prop accepts function to render custom text (e.g., `format={(percent) => \`${percent}%\`}`) |
| Percentage display | ✅ | Native | Built-in percentage display via `format` prop. Default shows percentage or custom format |
| Label/title | ✅ | Composed | No built-in title prop; wrap Progress in layout component or use `format` for inline text |
| Icon support | ✅ | Native | Status icons auto-displayed based on `status` prop (success checkmark, error X, etc.) |
| Animated indicator | ✅ | Native | `strokeLinecap="round"` and default animation for active state |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | `type="line"` (default) - Horizontal progress bar for sequential operations |
| Circular | ✅ | Native | `type="circle"` - Circular progress indicator for focused, compact display |
| Dashboard/Arc | ✅ | Native | `type="dashboard"` - 75% arc progress for dashboard-style displays |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | Set `percent` undefined or omit to show indeterminate animation (continuous spinner) |
| Normal state | ✅ | Native | `status="normal"` (default) - Standard progress display with blue color |
| Success state | ✅ | Native | `status="success"` - Green color with checkmark icon, indicates completion |
| Error state | ✅ | Native | `status="exception"` - Red color with error icon, indicates failure |
| Active/animating | ✅ | Native | Default animated state for active operations; animation controlled via CSS |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | No direct `size` prop; control via `width`/`height` props and `strokeWidth` |
| Percentage display | ✅ | Native | `percent: number` (0-100). `showInfo: boolean` (default: true) toggles percentage display |
| Color customization | ✅ | Native | `strokeColor: string \| object` - CSS color or gradient object for custom colors |
| Segment/steps | ✅ | Native | `steps: number` - Divides progress bar into segments (e.g., 5-step progress) |
| Stroke width | ✅ | Native | `strokeWidth: number` - Controls bar thickness (default: 6 for line, 4 for circle) |

## Code Examples

### Basic Linear Progress
```jsx
import { Progress } from 'antd';

// Simple progress bar with default formatting
<Progress percent={30} />

// With custom text
<Progress percent={50} format={(percent) => `${percent} Steps`} />

// Without percentage display
<Progress percent={75} showInfo={false} />

// Indeterminate progress (no percent value)
<Progress percent={undefined} />
```

### Circular Progress
```jsx
// Circular progress indicator
<Progress type="circle" percent={75} />

// Smaller circular progress
<Progress type="circle" percent={60} width={100} />

// Circular with custom format
<Progress
  type="circle"
  percent={45}
  format={(percent) => `${percent}%`}
/>

// Indeterminate circular
<Progress type="circle" percent={undefined} />
```

### Dashboard Style
```jsx
// 75% arc for dashboard displays
<Progress type="dashboard" percent={65} />

// Compact dashboard progress
<Progress
  type="dashboard"
  percent={50}
  width={80}
  strokeWidth={3}
/>
```

### State Variations
```jsx
// Success state (green with checkmark)
<Progress percent={100} status="success" />

// Error/Exception state (red with X)
<Progress percent={45} status="exception" />

// Normal state (default blue)
<Progress percent={60} status="normal" />

// Indeterminate state (animated)
<Progress percent={undefined} />
```

### Segmented Progress (Steps)
```jsx
// Divide progress into steps
<Progress percent={40} steps={5} />

// Steps with custom colors
<Progress
  percent={60}
  steps={10}
  strokeColor="#faad14"
/>

// Circular with steps
<Progress
  type="circle"
  percent={80}
  steps={4}
/>
```

### Custom Colors & Styling
```jsx
// Solid custom color
<Progress
  percent={50}
  strokeColor="#722ed1"
/>

// Gradient color
<Progress
  percent={75}
  strokeColor={{
    '0%': '#108ee9',
    '100%': '#87d068',
  }}
/>

// Color by percentage
<Progress
  percent={85}
  strokeColor={
    85 > 70 ? '#52c41a' : (85 > 40 ? '#faad14' : '#f5222d')
  }
/>

// Custom stroke width
<Progress
  percent={60}
  strokeWidth={10}
/>
```

### Format & Text Customization
```jsx
// Custom format function
<Progress
  percent={50}
  format={(percent) => `Processing: ${percent}%`}
/>

// Status-specific format
<Progress
  percent={100}
  status="success"
  format={() => 'Complete'}
/>

// Complex custom display
<Progress
  percent={65}
  format={(percent) => (
    <span>{percent}% Downloaded</span>
  )}
/>
```

### Multi-Progress Patterns
```jsx
// Multiple progress indicators
<div>
  <Progress percent={25} /> {/* Step 1 */}
  <Progress percent={50} /> {/* Step 2 */}
  <Progress percent={75} /> {/* Step 3 */}
  <Progress percent={100} status="success" /> {/* Complete */}
</div>

// Stacked progress for multiple items
<div>
  <div>Downloads: <Progress percent={30} /></div>
  <div>Processing: <Progress percent={60} /></div>
  <div>Upload: <Progress percent={90} /></div>
</div>
```

### Responsive Progress
```jsx
// Responsive width
<Progress
  percent={70}
  style={{ width: '100%' }}
/>

// Container-based sizing
<div style={{ width: '300px' }}>
  <Progress percent={40} />
</div>

// Circle with dynamic width
<Progress
  type="circle"
  percent={55}
  width={`min(200px, 80vw)`}
/>
```

## API Reference

### Main Props

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| `percent` | number | 0 | Percentage of progress (0-100). Omit or undefined for indeterminate | - |
| `type` | 'line' \| 'circle' \| 'dashboard' | 'line' | Type of progress bar | - |
| `status` | 'success' \| 'exception' \| 'normal' | 'normal' | Status of progress (colors and icons) | - |
| `format` | (percent: number) => React.ReactNode | `percent => \`${percent}%\`` | Custom format function for progress text | - |
| `strokeWidth` | number | 6 (line), 4 (circle) | Width of progress stroke in pixels | - |
| `strokeColor` | string \| object | theme primary color | Color of progress bar (CSS color or gradient) | - |
| `showInfo` | boolean | true | Show percentage text display | - |
| `steps` | number | - | Divide progress into discrete steps | - |
| `width` | number | 132 (circle), 100% (line) | Width in pixels for circle/dashboard type | - |
| `gapDegree` | number | 0 | Arc gap angle in degrees (circle/dashboard) | - |
| `gapPosition` | 'top' \| 'right' \| 'bottom' \| 'left' | 'top' | Position of gap in circle/dashboard | - |
| `strokeLinecap` | 'butt' \| 'square' \| 'round' | 'round' | Line cap style (affects rounded corners) | - |
| `success` | object | - | Success config: `{ percent: number, strokeColor: string }` | - |
| `trailingColor` | string | - | Color of unfilled track portion | - |

## Notable Features

### Type Variants with Clear Use Cases
- **Line**: Best for sequential workflows, file uploads, multi-step processes. Full width utilization
- **Circle**: Best for focused indicators, KPI dashboards, analytics. Space-efficient
- **Dashboard**: Best for compact dashboard displays. 75% arc provides clear visual impact in small spaces

### Status-Based Styling
- Automatic color and icon changes based on status: success (green/checkmark), exception (red/X), normal (blue)
- Provides clear visual feedback on operation outcome
- Can be dynamically updated as operation progresses

### Flexible Text Display
- `format` prop allows complete control over displayed text
- Can show custom labels, units, or multi-line information
- `showInfo` prop toggles percentage display entirely

### Segmented Progress
- `steps` prop divides progress into discrete segments
- Useful for step-based workflows or milestone tracking
- Each segment fills completely before moving to next

### Color Customization System
- Solid colors via `strokeColor: string`
- Gradient colors via `strokeColor: { '0%': color, '100%': color }`
- Dynamic colors based on percentage or state
- `trailingColor` for unfilled track customization

### Indeterminate State
- Omit `percent` prop or set to `undefined` for animated indeterminate progress
- Shows continuous animation without specific completion percentage
- Ideal for operations with unknown duration

### Positioning & Spacing Control
- `gapDegree` and `gapPosition` for circle/dashboard customization
- `gapDegree` default 0 creates complete circle; increase for arc display
- `gapPosition` controls where the arc gap appears

## Research Notes

### Documentation Access
- Documentation successfully accessed at https://ant.design/components/progress
- Comprehensive API table with prop descriptions and version information
- Multiple live examples demonstrating all variants and patterns
- GitHub source documentation provides TypeScript interfaces

### Framework Approach Observations

**Type Diversity:**
- Three distinct type variants (line, circle, dashboard) cover different UI contexts
- Clear semantic mapping: line for workflows, circle for focus, dashboard for compactness
- No bloated component - each type has distinct purpose

**Status as First-Class Concept:**
- Status prop elevates state management to API level
- Automatic icon rendering based on status (success checkmark, error X)
- Reduces need for custom state management outside component

**Indeterminate as Default Behavior:**
- Omitting `percent` prop naturally shows indeterminate animation
- No separate "loading" prop needed - undefined percent = indeterminate
- Elegant API design reducing prop explosion

**Flexible Text Rendering:**
- `format` prop pattern is powerful and flexible
- Allows complete control without prop multiplication (no percentageFormat, labelFormat, etc.)
- Supports React elements via format function return type

**Segmentation Pattern:**
- `steps` prop divides progress into discrete segments
- Alternative approach to percentage-based progress
- Useful for milestone tracking or step-based workflows

**Color Customization Sophistication:**
- Gradient support via object syntax is enterprise-grade
- Dynamic colors based on state reduces CSS class combinations
- `trailingColor` for track customization adds polish

**Gap Control for Circle/Dashboard:**
- `gapDegree` and `gapPosition` provide fine-grained control
- Enables dashboard-style 75% arc without separate component
- Shows attention to detail for compact displays

### Comparison to Other Libraries

**vs. Material-UI Progress:**
- Ant Design has simpler API (fewer required props)
- Material-UI separates determinate/indeterminate into different components
- Ant Design's status prop is more semantic than Material-UI's color prop

**vs. Bootstrap Progress:**
- Bootstrap is CSS-only, Ant Design provides React component
- Ant Design offers more variants (circle, dashboard) out-of-box
- Bootstrap requires wrapping for custom content, Ant Design uses format prop

**vs. Chakra UI Progress:**
- Similar API philosophy but Ant Design has better gradient support
- Chakra Progress is simpler but less feature-rich
- Ant Design's steps feature unique

### Semantic UI Alignment Opportunities

**Strengths to Adopt:**
1. Type variants with clear semantic purposes
2. Status as first-class API concept
3. Indeterminate state via prop omission (not separate prop)
4. Flexible format function pattern
5. Gradient color support for advanced use cases
6. Steps segmentation for milestone-based progress

**Potential Semantic UI Improvements:**
1. Web standards approach (Custom Elements vs React components)
2. Shadow DOM encapsulation for style isolation
3. Slot-based composition for maximum flexibility
4. More explicit gap/positioning API
5. Built-in animation control (start, stop, pause)
6. Progress event system for tracking milestones

**API Simplification Opportunities:**
1. Consider `animated: boolean` prop instead of implicit behavior
2. Could use `trailingColor` as `trackColor` for clarity
3. Consider `milestone` or `segment` terminology alongside `steps`
4. Could standardize `format` vs custom render patterns

### Edge Cases & Implementation Notes

**Percent Boundaries:**
- Values > 100 might be clamped or overflow visually
- Values < 0 likely treated as 0
- Non-integer values supported (e.g., 50.5%)

**Indeterminate Behavior:**
- Typically shown as continuous rotating animation
- Smooth UX for unknown-duration operations
- Should have delay mechanism to prevent flash

**Status Transitions:**
- Smooth color transitions between status changes
- Icons smoothly animate in/out
- Consider easing functions for polish

**Size Responsiveness:**
- Circle/dashboard width in pixels - may not be responsive
- Line type respects container width but no responsive sizing
- May need wrapper components for responsive progress

**Performance:**
- Multiple simultaneous Progress instances could impact animation performance
- Gradients might have performance cost on lower-end devices
- CSS animations should be GPU-accelerated

**Accessibility Gaps (Potential):**
- Progress bar should have `role="progressbar"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` recommended
- Screen reader support for status changes not documented
- Color-only status indication may fail color-blind users

## Variants & Patterns

### Linear Progress Variants

**Full Width Progress (Default):**
```jsx
<Progress percent={45} /> // 100% container width
```

**Contained Progress:**
```jsx
<div style={{ width: '200px' }}>
  <Progress percent={60} />
</div>
```

**Mini Progress (Small Stroke):**
```jsx
<Progress percent={75} strokeWidth={2} />
```

### Circular Progress Variants

**Standard Circular:**
```jsx
<Progress type="circle" percent={65} width={100} />
```

**Large Circular (Dashboard):**
```jsx
<Progress type="circle" percent={75} width={200} />
```

**Circle with Gap:**
```jsx
<Progress
  type="circle"
  percent={55}
  gapDegree={30}
  gapPosition="bottom"
/>
```

### Color Patterns

**Theme-Based (Default):**
```jsx
<Progress percent={50} /> // Uses theme primary color
```

**Semantic Colors:**
```jsx
// Success path (green)
<Progress percent={100} status="success" />

// Error path (red)
<Progress percent={45} status="exception" />

// Custom blue
<Progress percent={60} strokeColor="#1890ff" />
```

**Gradient Progress:**
```jsx
<Progress
  percent={70}
  strokeColor={{
    '0%': '#87d068',
    '50%': '#faad14',
    '100%': '#f5222d'
  }}
/>
```

### Dynamic Progress

**Percentage-Based Styling:**
```jsx
function DynamicProgress({ percent }) {
  const getColor = (p) => {
    if (p >= 80) return '#52c41a'; // green
    if (p >= 50) return '#faad14'; // orange
    return '#f5222d'; // red
  };

  const getStatus = (p) => {
    if (p >= 100) return 'success';
    if (p === 0) return 'exception';
    return 'normal';
  };

  return (
    <Progress
      percent={percent}
      status={getStatus(percent)}
      strokeColor={getColor(percent)}
    />
  );
}
```

**Multi-Step Progress Display:**
```jsx
// Display progress for multiple concurrent operations
const operations = [
  { name: 'Download', progress: 35 },
  { name: 'Verify', progress: 20 },
  { name: 'Install', progress: 0 }
];

{operations.map(op => (
  <div key={op.name}>
    <span>{op.name}</span>
    <Progress percent={op.progress} />
  </div>
))}
```

## Best Practices

### When to Use Each Type

**Use Linear When:**
- Sequential workflows or multi-step processes
- File uploads/downloads (shows ongoing progress)
- Page load indicators
- Need full-width utilization
- Data processing with clear start/end

**Use Circular When:**
- Space-constrained dashboards
- Individual metric/KPI display
- Skill level indicators
- Percentage-at-a-glance displays
- Standalone progress widgets

**Use Dashboard When:**
- Compact space with arc display
- Dashboard-style metrics
- KPI monitoring
- Want 75% arc (not full circle)
- Visual appeal with compact dimensions

### Status Management

**Success Signaling:**
```jsx
{isComplete && (
  <Progress percent={100} status="success" />
)}
```

**Error Handling:**
```jsx
{hasError && (
  <Progress percent={currentProgress} status="exception" />
)}
```

**Progressive Feedback:**
```jsx
<Progress
  percent={progress}
  status={
    progress === 100 ? 'success' :
    progress === 0 ? 'exception' :
    'normal'
  }
/>
```

### Color Best Practices

**Avoid Color-Only Indication:**
```jsx
// Bad: Color only indicates status (fails for color-blind users)
<Progress percent={50} strokeColor={isSuccess ? 'green' : 'red'} />

// Good: Use status prop + color for redundancy
<Progress
  percent={50}
  status={isSuccess ? 'success' : 'exception'}
  strokeColor={isSuccess ? '#52c41a' : '#f5222d'}
/>
```

**Gradient for Visual Hierarchy:**
```jsx
// Creates sense of momentum and progression
<Progress
  percent={65}
  strokeColor={{
    '0%': '#87d068',
    '100%': '#faad14'
  }}
/>
```

### Format Text Guidelines

**Keep Format Functions Pure:**
```jsx
// Good: No side effects
format={(percent) => `${percent}%`}

// Avoid: Side effects in format
format={(percent) => {
  analytics.trackProgress(percent); // Side effect
  return `${percent}%`;
}}
```

**Accessibility-Aware Formatting:**
```jsx
// Good: Descriptive text
format={(percent) => `${percent}% installed`}

// Better: Include screen reader text
format={(percent) => (
  <>
    <span>{percent}%</span>
    <span className="sr-only">progress</span>
  </>
)}
```

## Gotchas & Anti-Patterns

**❌ Don't: Use for Indeterminate Without Clear Indication**
```jsx
// Bad: User doesn't know if operation is proceeding
<Progress percent={undefined} />
```

**✅ Do: Pair with Contextual Label**
```jsx
// Good: Clear what's being processed
<div>
  <p>Processing your upload...</p>
  <Progress percent={undefined} />
</div>
```

**❌ Don't: Ignore Color-Blind Users**
```jsx
// Bad: Red = error, green = success (color only)
<Progress
  percent={50}
  strokeColor={isError ? 'red' : 'green'}
/>
```

**✅ Do: Pair Color with Icons/Text**
```jsx
// Good: Status + color + icon
<Progress
  percent={100}
  status="success"
/>
```

**❌ Don't: Rapidly Flashing Status Changes**
```jsx
// Bad: Seizure-inducing rapid changes
setInterval(() => {
  setStatus(status === 'success' ? 'exception' : 'success');
}, 100);
```

**✅ Do: Debounce Status Changes**
```jsx
// Good: Smooth transitions
const debouncedStatus = useDebounce(calculatedStatus, 300);
<Progress percent={percent} status={debouncedStatus} />
```

**❌ Don't: Store Format as Inline Object**
```jsx
// Bad: Re-renders excessively
strokeColor={{ '0%': '#87d068', '100%': '#faad14' }}
```

**✅ Do: Memoize Complex Objects**
```jsx
// Good: Stable reference
const progressGradient = useMemo(
  () => ({ '0%': '#87d068', '100%': '#faad14' }),
  []
);
<Progress percent={70} strokeColor={progressGradient} />
```

## Summary

Ant Design's Progress component is a mature, flexible indicator supporting three distinct visual variants (line, circle, dashboard) with comprehensive customization options. Key strengths include semantic status management, flexible text formatting, gradient support, and clear type/use case mapping.

The component excels at providing visual feedback for asynchronous operations while maintaining a clean, composable API. The format prop pattern is particularly elegant for text customization without prop explosion.

For Semantic UI implementation, focus on adopting the multi-variant approach with clear semantic purposes, elevate status to first-class API concept, support gradient colors, and provide segmentation capabilities. Consider web standards architecture (Custom Elements, Shadow DOM) while maintaining API compatibility with Ant Design's proven patterns.

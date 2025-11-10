# Ant Design - Timeline Usage Patterns

## Component URL
https://ant.design/components/timeline
Status: ✅ Working
Version: v5.x (Latest) with backward compatibility to v2.x
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Includes multiple layout modes, color semantics, state management, and modern API with `items` prop alongside legacy `Timeline.Item` children API.

## Component Definition
- **Core purpose**: Display a series of information ordered by time in chronological (ascending/descending) sequence, with visual indicators and connectors to show progression through events or states
- **Mental model**: A vertical list of timestamped events with customizable markers and visual states, useful for workflows, changelogs, process tracking, and historical timelines
- **Semantic meaning**: Communicates sequential progression through events, status changes, or workflow stages with visual emphasis on completion states (success/warning/error/pending)

## Pattern Support Levels
- **Native**: Dedicated props for layout, state, and styling (e.g., `mode="alternate"`, `color="green"`, `pending={true}`)
- **Composed**: Via composition/children (e.g., `<Timeline><Timeline.Item /></Timeline>` - legacy) or modern items array (e.g., `<Timeline items={[...]} />`)
- **CSS-only**: Via style props and className for advanced customization (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native/Composed | Content rendered directly in Timeline.Item children or via `children` property in items array |
| Icon support | ✅ | Native | `dot` prop accepts custom elements, icons, or React components to replace default circle indicator |
| Custom content | ✅ | Composed | Full React component support within Timeline.Item children or complex structures in items array |
| Timestamps | ✅ | Composed | No native timestamp prop; typically rendered as text/label within item content area |
| Descriptions | ✅ | Composed | Can be composed via children content or label positioning with `label` prop in items |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default mode, content flows top-to-bottom with connector line running vertically |
| Horizontal layout | ❌ | Not supported | Timeline is inherently vertical; no native horizontal variant |
| Alternate layout | ✅ | Native | `mode="alternate"` alternates items left-right for visual balance in vertical timeline |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Pending state | ✅ | Native | `pending={true}` or `pending={ReactNode}` shows ghost node at end indicating ongoing status |
| Loading state | ✅ | Native | Works with `pending` prop; can customize loader with `pendingDot` prop |
| Error state | ✅ | Native | Indicated via `color="red"` on Timeline.Item for visual error/warning state |
| Success state | ✅ | Native | Indicated via `color="green"` on Timeline.Item for completed/success status |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | Predefined: `blue` (default/ongoing), `green` (success), `red` (error/warning), `gray` (disabled). Custom color hex/RGB supported via string |
| Dot variants | ✅ | Native/Composed | Default filled circle; `dot` prop replaces with custom elements, icons, or React components |
| Connector styles | ❌ | CSS-only | No native prop; requires custom styling via CSS to modify connector line appearance (dashed, dotted, etc.) |
| Size options | ❌ | CSS-only | No native size variants; sizing controlled via CSS and custom dot element dimensions |
| Position control | ✅ | Native | `mode` prop (`left`, `alternate`, `right`) controls horizontal positioning of timeline line; `position` prop on individual items overrides |

## Code Examples

### Modern Usage (v5.2.0+) - Recommended
```jsx
import { Timeline } from 'antd';

const items = [
  {
    children: 'Create a services site 2015-09-01',
    color: 'green',
  },
  {
    children: 'Solve initial network problems 2015-09-01',
    color: 'green',
  },
  {
    children: 'Technical testing 2015-09-02',
  },
  {
    children: 'Network problems being solved 2015-09-05',
    color: 'red',
  },
  {
    children: 'Waiting for a fix...',
    pending: true,
    dot: <Spin />,
  },
];

export default () => <Timeline items={items} />;
```

### Alternate Layout Mode
```jsx
import { Timeline } from 'antd';

const items = [
  {
    children: 'Login on home page 2015-09-01',
  },
  {
    children: 'Solve initial network problems 2015-09-01',
    color: 'green',
  },
  {
    children: 'Technical testing 2015-09-02',
  },
  {
    children: 'Network problems being solved 2015-09-05',
    color: 'red',
  },
  {
    children: 'Waiting for a fix...',
    pending: true,
  },
];

export default () => <Timeline items={items} mode="alternate" />;
```

### Right-Aligned Layout
```jsx
<Timeline items={items} mode="right" />
```

### Custom Dot with Icons
```jsx
import { Timeline, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from 'antd';

const items = [
  {
    dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
    children: 'Create a services site 2015-09-01',
    color: 'green',
  },
  {
    dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
    children: 'In progress 2015-09-02',
  },
  {
    dot: <ExclamationCircleOutlined style={{ fontSize: '16px' }} />,
    children: 'Error encountered 2015-09-03',
    color: 'red',
  },
];

export default () => <Timeline items={items} />;
```

### Legacy Usage (Deprecated in v5.2.0+)
```jsx
import { Timeline } from 'antd';

export default () => (
  <Timeline>
    <Timeline.Item color="green">
      Create a services site 2015-09-01
    </Timeline.Item>
    <Timeline.Item color="green">
      Solve initial network problems 2015-09-01
    </Timeline.Item>
    <Timeline.Item>
      Technical testing 2015-09-02
    </Timeline.Item>
    <Timeline.Item color="red">
      Network problems being solved 2015-09-05
    </Timeline.Item>
    <Timeline.Item pending>
      Waiting for a fix...
    </Timeline.Item>
  </Timeline>
);
```

### Reversed Timeline
```jsx
<Timeline items={items} reverse />
```

### Custom Pending Content
```jsx
<Timeline
  items={items}
  pending={<a href="#">See more</a>}
  pendingDot={<Spin />}
/>
```

[View Live](https://ant.design/components/timeline/#examples)

## Notable Features
- **Modern API (v5.2.0+)**: Simplified `items` prop usage with better TypeScript support and performance
- **Multiple layout modes**: `left`, `alternate`, `right` for flexible timeline positioning
- **Rich color semantics**: Built-in semantic colors (green=success, red=error, blue=default, gray=disabled)
- **Fully customizable indicators**: `dot` prop supports React components, icons, and custom elements
- **Pending state visualization**: Native support for indicating ongoing/loading status with custom loading indicators
- **Reverse ordering**: Can display events in ascending or descending chronological order
- **Compound component pattern**: Supports both modern array-based and legacy children-based APIs
- **Custom styling**: Full CSS customization support via className and style props
- **Accessibility**: Proper semantic HTML with support for custom ARIA attributes

## API Reference

### Timeline Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | TimelineItemProps[] | `undefined` | Array of timeline items (v5.2.0+) |
| `mode` | `'left' \| 'alternate' \| 'right'` | `undefined` | Layout mode for positioning items |
| `pending` | boolean \| string \| ReactNode | `false` | Ghost node display or content for ongoing status |
| `pendingDot` | ReactNode | Spin icon | Custom indicator for pending node |
| `reverse` | boolean | false | Reverse items order |
| `className` | string | `undefined` | CSS class name |
| `style` | CSSProperties | `undefined` | Inline styles |
| `prefixCls` | string | `'ant-timeline'` | Prefix for internal classes |

### Timeline.Item Props (Legacy)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | string | `'blue'` | Indicator circle color (green/red/blue/gray or hex) |
| `dot` | ReactNode | Circle | Custom indicator element |
| `children` | ReactNode | `undefined` | Item content |
| `position` | `'left' \| 'right'` | `undefined` | Override mode positioning for this item |
| `label` | ReactNode | `undefined` | Label displayed alongside connector line |

### TimelineItemProps (Modern items array)
```typescript
interface TimelineItemProps {
  children?: React.ReactNode;
  color?: string;
  dot?: React.ReactNode;
  position?: 'left' | 'right';
  label?: React.ReactNode;
}
```

## Research Notes
- Ant Design Timeline API changed significantly in v5.2.0 with introduction of `items` prop for improved performance
- Legacy `<Timeline.Item>` children API still supported but marked for deprecation
- Component documentation uses both modern and legacy examples; modern approach recommended for new projects
- Latest version (v5.x) is fully TypeScript typed with comprehensive prop support
- Component relies on CSS Grid and Flexbox for layout; no SVG-based rendering
- Custom styling can override default connector line styling for specialized visual variants
- The `mode` prop significantly impacts visual presentation; `alternate` is popular for balanced layouts
- Pending state is essential for showing ongoing processes or incomplete workflows

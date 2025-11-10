# PrimeReact - Timeline Usage Patterns

## Component URL
https://primereact.org/timeline/
Status: ✅ Working
Version: v8 (primereact-v8)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - includes multiple examples, prop documentation, and visual demonstrations across different layout configurations.

## Component Definition
- **Core purpose**: Visualizes a series of chained events in a chronological or logical sequence
- **Mental model**: Users think of Timeline as a vertical or horizontal chain of connected events, where each event has a marker (visual indicator), content, and optional supplementary information
- **Semantic meaning**: Communicates progression, history, workflow steps, or chronological order in the UI. The connecting line reinforces the relationship between sequential events

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `layout="vertical"`, `align="alternate"`)
- **Composed**: Via composition/children (e.g., `content` and `opposite` function props)
- **CSS-only**: Requires custom styling (e.g., `className="..."` for advanced customization)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Via `content` function prop that receives item parameter |
| Icon support | ✅ | Composed | Custom markers via `marker` function prop for icon rendering |
| Custom content | ✅ | Composed | Full template support through `content` callback - can render images, text, and complex markup |
| Timestamps | ✅ | Composed | Typically rendered via `opposite` function prop for date/time display |
| Descriptions | ✅ | Composed | Multi-line descriptions supported within `content` templates |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default mode via `layout="vertical"` prop |
| Horizontal layout | ✅ | Native | Alternative mode via `layout="horizontal"` prop |
| Alternate layout | ✅ | Native | Events alternate sides via `align="alternate"` for vertical or horizontal |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Pending state | ✅ | Composed | Can be implemented via marker customization and CSS classes |
| Loading state | ✅ | Composed | Status indicators rendered within content templates |
| Error state | ✅ | Composed | Visual status variants controlled through marker styling |
| Success state | ✅ | Composed | Status represented through marker styling and colors |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Composed | Markers can be styled with different colors via custom marker functions |
| Dot variants | ✅ | Composed | Custom marker rendering allows solid dots, icons, or complex markers |
| Connector styles | ✅ | CSS-only | Line connecting events styled through CSS classes and custom styling |
| Size options | ✅ | Composed | Marker size controlled via marker function and CSS classes |
| Position control | ✅ | Native | Full control via `layout` (vertical/horizontal) and `align` (left/right/alternate) props |

## Core Props Reference
- **value**: Array of event objects to display
- **content**: Function `(item: any) => JSX.Element` - renders content for each event
- **marker**: Function `(item: any) => JSX.Element` - renders custom marker/indicator
- **opposite**: Function `(item: any) => JSX.Element` - renders supplementary content opposite the main timeline line
- **align**: `"left" | "right" | "alternate"` - controls content positioning
- **layout**: `"vertical" | "horizontal"` - determines timeline orientation
- **className**: Standard CSS class support for container styling

## Code Examples

### Basic Vertical Timeline
```jsx
import { Timeline } from 'primereact/timeline';

const events = [
  { status: 'Ordered', date: '15/10/2020' },
  { status: 'Processing', date: '15/10/2020' },
  { status: 'Shipped', date: '15/10/2020' },
  { status: 'Delivered', date: '15/10/2020' }
];

<Timeline
  value={events}
  align="left"
  layout="vertical"
  content={(item) => item.status}
/>
```

### Alternate Layout with Custom Markers
```jsx
<Timeline
  value={events}
  align="alternate"
  className="customized-timeline"
  marker={(item) => (
    <span className="custom-marker">
      <i className="pi pi-check"></i>
    </span>
  )}
  content={(item) => <span>{item.status}</span>}
  opposite={(item) => <small className="p-text-secondary">{item.date}</small>}
/>
```

### Horizontal Timeline
```jsx
<Timeline
  value={events}
  layout="horizontal"
  align="top"
  content={(item) => item.status}
/>
```

### Rich Template Example
```jsx
<Timeline
  value={events}
  align="left"
  layout="vertical"
  content={(item) => (
    <Card>
      <p className="font-bold">{item.status}</p>
      <p>{item.description}</p>
      <img src={item.image} style={{width: '200px'}} />
    </Card>
  )}
  opposite={(item) => <small className="text-color-secondary">{item.date}</small>}
/>
```

[View Live](https://primereact.org/timeline/) *(available on official documentation site)*

## Notable Features
- **Semantic Structure**: Uses semantic `<ol>` elements for proper accessibility
- **Flexible Content**: Full support for complex templates beyond simple text
- **Dual-sided Display**: `opposite` prop allows meaningful supplementary information (dates, statuses, metadata)
- **No Interactive Requirements**: Passive component - doesn't require keyboard navigation or focus management
- **Composition-First Design**: Embraces React composition patterns through function props rather than slot-based APIs
- **Layout Flexibility**: Single component handles both vertical and horizontal orientations with alignment options
- **Marker Customization**: Deep customization of timeline indicators through dedicated marker prop

## Research Notes
- The component is well-documented with multiple examples demonstrating different configurations
- Primary documentation is accessible at `primereact.org/timeline/` (redirects from `primefaces.org/primereact-v8/timeline/`)
- The design philosophy emphasizes composition and function props for template rendering
- Strong accessibility focus with semantic HTML (`<ol>` elements)
- Component is suitable for displaying ordered sequences: workflow steps, order tracking, version history, project milestones
- Opposite prop is particularly useful for displaying metadata (dates, statuses, details) without cluttering the main content

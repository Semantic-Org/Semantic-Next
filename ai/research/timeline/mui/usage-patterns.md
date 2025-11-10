# MUI - Timeline Usage Patterns

## Component URL
https://mui.com/material-ui/react-timeline/
Status: ✅ Working
Version: Current (v5+ MUI, originally from Material-UI Lab)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Includes API reference, component guides, and working examples. The component is well-documented across multiple pages with clear examples and interactive documentation.

## Component Definition
- **Core purpose**: Visually display a series of events, milestones, or sequential information in chronological order. Provides structured representation of timelines where order and temporal relationships matter.
- **Mental model**: Think of it as a vertical (or horizontal) chain of discrete events, where each event has a visual marker (dot) connected by lines to adjacent events. Users understand it as "what happened when" or "steps in a process."
- **Semantic meaning**: Communicates a temporal sequence, causality, progress, or procedural steps. Commonly used for: product timelines, process flows, project milestones, event histories, and progress indicators.

## Pattern Support Levels
- **Native**: Dedicated props/API (e.g., `align="alternate"`, `color="primary"`)
- **Composed**: Via composition/children (e.g., `<Timeline><TimelineItem><TimelineSeparator><TimelineDot/><TimelineConnector/></TimelineSeparator><TimelineContent/></TimelineItem></Timeline>`)
- **CSS-only**: Via class names (e.g., `.MuiTimeline-alignAlternate`, `classes` prop for style overrides)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | `<TimelineContent>` or `<TimelineOppositeContent>` wraps text and elements |
| Icon support | ✅ | Composed | Icons placed inside `<TimelineDot>` as children - fully flexible |
| Custom content | ✅ | Composed | Any JSX/HTML can be nested in `<TimelineContent>` or dot |
| Timestamps | ✅ | Composed | Use `<TimelineOppositeContent>` for opposite-side content (typical use: dates) |
| Descriptions | ✅ | Composed | `<TimelineContent>` can contain Paper components with full descriptions |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default and primary layout; component is oriented vertically by default |
| Horizontal layout | ❌ | Not Supported | No explicit horizontal mode; would require custom CSS |
| Alternate layout | ✅ | Native | `align="alternate"` on `<Timeline>` positions items on alternating sides |
| Left-aligned | ✅ | Native | `align="left"` (default behavior) positions all content on left |
| Right-aligned | ✅ | Native | `align="right"` positions all content on right side |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Pending state | ✅ | Composed | Use `variant="outlined"` on TimelineDot + conditional rendering |
| Loading state | ✅ | Composed | Can add loading indicator as TimelineContent child; no built-in support |
| Error state | ✅ | Composed | Use `color="error"` on TimelineDot or custom styling |
| Success state | ✅ | Composed | Use `color="secondary"` or custom color via theme |
| Active/highlight | ✅ | Composed | Use different `color` or add CSS class via `classes` prop |
| Disabled state | ⚠️ | CSS-only | No native prop; requires custom styling via `classes` or inline styles |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop on TimelineDot: `'primary'` (default), `'secondary'`, `'grey'`, `'inherit'` |
| Dot variants | ✅ | Native | `variant` prop on TimelineDot: `'default'` (filled), `'outlined'` (hollow/bordered) |
| Connector styles | ❌ | CSS-only | No native prop for connector color/style; requires custom CSS via classes |
| Size options | ❌ | CSS-only | No native size prop; adjust via CSS custom properties or `classes` override |
| Position control | ✅ | Native | `align` prop on Timeline: `'left'` (default), `'right'`, `'alternate'` |

## Code Examples

### Basic Timeline with Alternate Layout
```jsx
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

<Timeline align="alternate">
  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color="primary" />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      Step 1: Start Project
    </TimelineContent>
  </TimelineItem>

  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color="secondary" />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      Step 2: Development
    </TimelineContent>
  </TimelineItem>

  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color="success" />
    </TimelineSeparator>
    <TimelineContent>
      Step 3: Complete
    </TimelineContent>
  </TimelineItem>
</Timeline>
```

### Timeline with Icons and Opposite Content
```jsx
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Paper from '@material-ui/core/Paper';

<Timeline align="alternate">
  <TimelineItem>
    <TimelineOppositeContent color="textSecondary">
      9:30 am
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot color="primary">
        <FastfoodIcon />
      </TimelineDot>
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      <Paper elevation={3} style={{ padding: '6px 16px' }}>
        <h4>Breakfast</h4>
        <p>At 9:30 AM</p>
      </Paper>
    </TimelineContent>
  </TimelineItem>
</Timeline>
```

### Timeline with Outlined Dots
```jsx
<Timeline align="alternate">
  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot variant="outlined" color="primary" />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      Pending Action
    </TimelineContent>
  </TimelineItem>

  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color="secondary" />
    </TimelineSeparator>
    <TimelineContent>
      Completed
    </TimelineContent>
  </TimelineItem>
</Timeline>
```

[View Live](https://mui.com/material-ui/react-timeline/) *(official examples at MUI docs)*

## Notable Features

- **Composition-First Architecture**: Unlike many UI frameworks, MUI Timeline is built entirely through composition. There's no single "Timeline" component that does everything - you compose small, focused subcomponents (`TimelineItem`, `TimelineSeparator`, `TimelineDot`, `TimelineConnector`, `TimelineContent`). This provides maximum flexibility.

- **Flexible Content Model**: Any content can go inside a TimelineDot (icons, images, text, custom React components) or TimelineContent (full Paper components with rich content). The framework doesn't prescribe what each element should contain.

- **Theme Integration**: All color props (`color="primary"`, `color="secondary"`) use the Material-UI theme palette. TimelineDot colors are derived from the theme, making it easy to maintain design consistency.

- **Opposite Content Pattern**: The `TimelineOppositeContent` component solves the common use case of displaying supplementary information (like timestamps or metadata) on the opposite side of the main content. This is a particularly clever pattern for timeline UIs.

- **Lab Package Status**: Timeline was originally in Material-UI Lab (experimental) but is now part of the stable MUI distribution, indicating it's mature and production-ready.

- **CSS Class API**: Extensive use of the `classes` prop for customization, allowing style overrides at the component level without ejecting to global CSS.

## Component API Summary

### Timeline Props
- `align`: `'left'` | `'right'` | `'alternate'` (default: `'left'`)
- `children`: ReactNode (TimelineItem elements)
- `classes`: object (for CSS overrides)

### TimelineItem Props
- `children`: ReactNode (TimelineSeparator, TimelineContent, etc.)
- `classes`: object (for CSS overrides)

### TimelineDot Props
- `color`: `'primary'` | `'secondary'` | `'grey'` | `'inherit'` (default: `'grey'`)
- `variant`: `'default'` | `'outlined'` (default: `'default'`)
- `children`: ReactNode (icons or custom content)
- `classes`: object (for CSS overrides)

### TimelineContent Props
- `children`: ReactNode (text, components, etc.)
- `classes`: object (for CSS overrides)

### TimelineOppositeContent Props
- `children`: ReactNode (timestamps, labels, etc.)
- `color`: CSS color property value (default: textSecondary)
- `classes`: object (for CSS overrides)

### TimelineSeparator Props
- `children`: ReactNode (TimelineDot and/or TimelineConnector)
- `classes`: object (for CSS overrides)

### TimelineConnector Props
- `classes`: object (for CSS overrides)

## Research Notes

- **Accessibility**: MUI Timeline components are built on semantic HTML and standard accessibility patterns. The vertical layout naturally supports keyboard navigation and screen readers.

- **Color System**: The component integrates deeply with MUI's theme system. The documented color options (`primary`, `secondary`, `grey`) come from the theme palette, making it adaptable to any design system.

- **No Built-In States**: Unlike some component libraries, MUI doesn't provide explicit "pending," "completed," or "disabled" states on Timeline. Instead, you compose the appearance using the available props (`color`, `variant`) and conditional rendering. This is a design philosophy that prioritizes flexibility.

- **Lack of Horizontal Timeline**: Notably, there's no built-in horizontal timeline orientation. The component is optimized for vertical layouts, which is the dominant use case. Horizontal timelines would require custom CSS.

- **Lab to Stable Transition**: The component was originally in `@material-ui/lab` but has been promoted to the core MUI distribution, indicating maturity and long-term support.

- **Import Pattern Change**: Version 5+ of MUI uses `@mui/lab/Timeline` instead of `@material-ui/lab/Timeline`. The API remains largely the same.

- **Documentation Clarity**: The official MUI documentation provides interactive examples with source code. The composition model is well-explained through examples, though it requires understanding the component hierarchy.

- **Performance Considerations**: Since Timeline is composed of many small components, performance depends on the number of items. For very large timelines (hundreds of items), consider virtualization techniques, though the component itself doesn't provide this out of the box.

- **Styling Philosophy**: MUI favors the `classes` prop over inline `sx` prop for Timeline components (in earlier versions). This has evolved in MUI v5+ where both patterns are supported equally.

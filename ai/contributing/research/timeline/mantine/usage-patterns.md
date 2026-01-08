# Mantine - Timeline Usage Patterns

## Component URL
https://mantine.dev/core/timeline/
Status: ✅ Working
Version: @mantine/core 8.3.7
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-structured with multiple examples, clear prop documentation, and visual demonstrations

## Component Definition
- **Core purpose**: Display a list of events in chronological order with visual timeline indicators
- **Mental model**: A vertical (or horizontal) sequence of events with visual connectors and markers that users scan from top to bottom
- **Semantic meaning**: Communicates temporal progression, process workflow steps, activity feeds, or historical event sequences

## Pattern Support Levels
- **Native**: Dedicated props and API (e.g., `active`, `color`, `lineVariant`, `align`)
- **Composed**: Via composition of `Timeline` and `Timeline.Item` components
- **CSS-only**: Via Styles API for custom styling of internal elements

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Content within `Timeline.Item` children; text wrapped in `<Text>` component for consistency |
| Icon support | ✅ | Composed | `bullet` prop accepts custom React components (Icon, ThemeIcon, Avatar, etc.) |
| Custom content | ✅ | Composed | Any React component can be used as bullet; child content is flexible |
| Timestamps | ✅ | Composed | No dedicated prop; typically added as separate `<Text>` component with `xs` size |
| Descriptions | ✅ | Composed | Rich content via child components; `title` prop for main heading |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default layout; no explicit prop needed |
| Horizontal layout | ❌ | Not supported | Component designed for vertical chronological flow only |
| Alternate layout | ❌ | Not supported | Items always align to single side (determined by `align` prop) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Pending state | ❌ | CSS-only | Not built-in; could be styled via Styles API or custom className |
| Loading state | ❌ | CSS-only | Not built-in; would require custom implementation or Skeleton wrapper |
| Error state | ❌ | CSS-only | Not built-in; could use color prop with theme error color |
| Success state | ✅ | Native | Inherent in visual progression; can emphasize with `active` prop and color |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop accepts theme colors (primary, success, error, warning, etc.) |
| Dot variants | ✅ | Composed | `bullet` prop accepts custom components (default circle, Icon, Avatar, ThemeIcon) |
| Connector styles | ✅ | Native | `lineVariant` prop supports "solid" (default) and "dashed" line styles |
| Size options | ✅ | Native | `bulletSize` controls bullet dimensions; `lineWidth` controls connector thickness |
| Position control | ✅ | Native | `align` prop positions bullets/line left or right relative to content |

## Code Examples

### Basic Usage with Active State
```jsx
import { Timeline, Text } from '@mantine/core';
import { IconGitBranch, IconGitCommit, IconGitPullRequest } from '@tabler/icons-react';

<Timeline active={1} bulletSize={24} lineWidth={2}>
  <Timeline.Item bullet={<IconGitBranch size={12} />} title="New branch">
    <Text c="dimmed" size="sm">You created new branch fix/broken-link from master</Text>
    <Text size="xs" mt={4}>13 minutes ago</Text>
  </Timeline.Item>

  <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commits on fix/broken-link">
    <Text c="dimmed" size="sm">You pushed 3 commits to fix/broken-link branch</Text>
    <Text size="xs" mt={4}>11 minutes ago</Text>
  </Timeline.Item>

  <Timeline.Item title="Code review" bullet={<IconGitPullRequest size={12} />}>
    <Text c="dimmed" size="sm">Review of pull request #34 has been completed</Text>
    <Text size="xs" mt={4}>7 minutes ago</Text>
  </Timeline.Item>
</Timeline>
```

### Customized Bullets and Styling
```jsx
import { Timeline, ThemeIcon, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';

<Timeline active={2} bulletSize={32} lineWidth={3} color="teal">
  <Timeline.Item bullet={<ThemeIcon color="teal" radius="xl" variant="light"><IconCircleCheck size={18} /></ThemeIcon>}>
    <Text weight={500}>Completed Task</Text>
  </Timeline.Item>

  <Timeline.Item bullet={<ThemeIcon color="blue" radius="xl" variant="light"><IconCircleCheck size={18} /></ThemeIcon>}>
    <Text weight={500}>In Progress</Text>
  </Timeline.Item>

  <Timeline.Item bullet={<ThemeIcon radius="xl" variant="outline"><IconCircleCheck size={18} /></ThemeIcon>}>
    <Text weight={500}>Pending</Text>
  </Timeline.Item>
</Timeline>
```

### Alignment and Line Variants
```jsx
import { Timeline, Text } from '@mantine/core';

// Right-aligned with dashed lines
<Timeline align="right" lineVariant="dashed" color="orange">
  <Timeline.Item title="Event 1">
    <Text c="dimmed" size="sm">Details here</Text>
  </Timeline.Item>

  <Timeline.Item title="Event 2">
    <Text c="dimmed" size="sm">More details</Text>
  </Timeline.Item>
</Timeline>
```

### Avatar Bullets
```jsx
import { Timeline, Avatar, Text } from '@mantine/core';

<Timeline bulletSize={48}>
  <Timeline.Item bullet={<Avatar radius="xl" />}>
    <Text weight={500}>User Activity</Text>
  </Timeline.Item>

  <Timeline.Item bullet={<Avatar color="blue" radius="xl">JD</Avatar>}>
    <Text weight={500}>John Doe joined</Text>
  </Timeline.Item>
</Timeline>
```

## Notable Features

- **Flexible Bullet Customization**: The `bullet` prop accepts any React component, enabling rich customization from simple icons to complex avatar components
- **Color Synchronization**: The `color` prop applies to both the active bullet/line styling and visual hierarchy
- **Two-Alignment System**: `align="left"` or `align="right"` determines positioning without needing alternate layout variants
- **Line Variant Support**: Solid and dashed line styles (`lineVariant="solid"` | `"dashed"`) provide visual variation
- **Strict Composition Rule**: `Timeline.Item` must be direct children of `Timeline` - no wrapper components allowed, requiring careful JSX structure
- **Active State Highlighting**: The `active` prop highlights all items up to a specified index, communicating progress or completion status
- **Responsive Typography**: Designed to pair with Mantine's Text component for consistent, responsive sizing

## Research Notes

- **Documentation Access**: Website loads normally without redirects; version info clearly displayed
- **Framework Pattern**: Follows Mantine's compound component pattern (Timeline + Timeline.Item) common across the library
- **No Horizontal Support**: Unlike some timeline libraries, Mantine deliberately restricts to vertical layout for clarity
- **Composition Constraints**: The documented limitation about wrapping Timeline.Item is an important implementation detail affecting component hierarchy design
- **Icon Library Integration**: Examples use Tabler icons (@tabler/icons-react), Mantine's recommended icon library
- **Theme Integration**: Full integration with Mantine's theming system via `color` prop and Styles API
- **No Built-in States**: Unlike some components, timeline doesn't include loading, error, or pending states as built-in features; these must be composed from other Mantine components

## Comparison Notes for Semantic UI Implementation

**Key Differences to Consider**:
1. Mantine uses compound components (`Timeline.Item`) while Semantic UI would likely use slot-based composition
2. Mantine's `active` prop highlights items *up to* an index, not individual items
3. Bullet customization in Mantine is through prop composition, not template slots
4. No native horizontal layout support differs from some timeline implementations
5. Line variant is limited to solid/dashed, without dotted or custom patterns

**Patterns Worth Adopting**:
- `bullet` prop accepting any component enables flexible customization
- `active` prop showing progress/completion state is semantically clear
- `align` prop simplifies layout control without alternate variants
- Text component pairing for consistent typography


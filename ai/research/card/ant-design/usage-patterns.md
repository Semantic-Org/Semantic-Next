# Ant Design - Card Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ant.design/components/card
Status: ✅ Working
Version: 5.24.0+ (Current)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, TypeScript interfaces, multiple code examples demonstrating various patterns, and design guidance on when to use the component.

## Component Definition
- **Core purpose**: A container for displaying information related to a single subject. Provides structured sections (header, body, cover, footer/actions) to organize related content and actions. This is DIFFERENT from basic container primitives like Segment or Paper - Card has semantic structure.
- **Mental model**: A content card with distinct, purpose-driven sections - like a physical card with a title, image, description, and action buttons. Functions as a complete unit of related information.
- **Semantic meaning**: Communicates a discrete piece of content with clear boundaries. When multiple cards are displayed together, each represents a separate entity (product, article, user profile, etc.).

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `title`, `extra`, `cover`, `actions`, `loading`, `hoverable`)
- **Composed**: Via composition/children/sub-components (e.g., `<Card.Grid>`, `<Card.Meta>`, card body via children)
- **CSS-only**: Requires custom styling (e.g., custom animations, non-standard layouts)

## Container Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic card | ✅ | Native | Default card with title and content area via children |
| Bordered card | ✅ | Native | `variant="outlined"` (default) - renders border around card. Legacy `bordered` prop deprecated in favor of `variant` (v5.24.0+) |
| Borderless card | ✅ | Native | `variant="borderless"` - removes card border for seamless integration |
| Hoverable card | ✅ | Native | `hoverable={true}` - lifts card on hover with shadow effect |
| Loading card | ✅ | Native | `loading={true}` - shows skeleton placeholder while content loads |
| Inner card | ✅ | Native | `type="inner"` - nested card style for card-within-card layouts |
| Small card | ✅ | Native | `size="small"` - compact card variant (default: `"default"`) |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header/Title | ✅ | Native | `title` prop accepts ReactNode for card header |
| Body content | ✅ | Composed | Main content via `children` prop (ReactNode) |
| Cover/Media | ✅ | Native | `cover` prop for top media (images, videos) - ReactNode |
| Meta section | ✅ | Composed | `<Card.Meta>` sub-component with avatar, title, description props |
| Actions footer | ✅ | Native | `actions` prop accepts Array&lt;ReactNode> for footer action buttons |
| Extra content | ✅ | Native | `extra` prop for top-right content (typically links/buttons) - ReactNode |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Grid layouts | ✅ | Composed | `<Card.Grid>` sub-component for grid-based card sections. Props: `hoverable`, `style`, `className` |
| Card groups | ✅ | CSS-only | Multiple cards arranged via external layout (Space, Flex, Grid components) |
| Column layouts | ✅ | CSS-only | Cards in columns using Ant Design's Grid system (Row/Col) |
| Nested cards | ✅ | Native | `type="inner"` for cards within cards - distinct inner card styling |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | `size="default" \| "small"` (default: "default") |
| Border variants | ✅ | Native | `variant="outlined" \| "borderless"` (default: "outlined", v5.24.0+) |
| Type variants | ✅ | Native | `type="inner"` for nested card appearance (undefined for default) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hoverable | ✅ | Native | `hoverable={true}` - elevation/shadow on hover |
| Clickable | ✅ | CSS-only | Wrap card in `<a>` or add `onClick` handler to Card |
| Grid hover | ✅ | Composed | `<Card.Grid hoverable={true/false}>` - individual grid cell hover (default: true) |
| Tabs integration | ✅ | Native | `tabList` prop with array of tabs, `activeTabKey`, `onTabChange` callback for tab switching within card |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom styles | ✅ | Native | `style` prop for inline CSS. Standard React CSSProperties |
| Custom classes | ✅ | Native | `className` prop for external CSS classes |
| Semantic DOM styling | ✅ | Native | `classNames` and `styles` props (v5.14.0+) for targeting internal card parts (header, body, cover, actions, etc.) |
| Design tokens | ✅ | Native | Component tokens for theming (documented in Design Token section) |

## Code Examples

### Basic Card
```jsx
import { Card } from 'antd';

// Simple card with title and content
<Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
  <p>Card content</p>
  <p>Card content</p>
  <p>Card content</p>
</Card>

// Small size variant
<Card size="small" title="Small size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
  <p>Card content</p>
  <p>Card content</p>
</Card>
```

### Bordered and Borderless
```jsx
// Bordered card (default)
<Card variant="outlined" title="Bordered Card">
  Content with border
</Card>

// Borderless card
<Card variant="borderless" title="Borderless Card" style={{ background: '#f0f0f0' }}>
  Content without border
</Card>

// Legacy API (deprecated but still works)
<Card bordered={false} title="No Border">
  Content
</Card>
```

### Hoverable Card
```jsx
// Card with hover effect
<Card hoverable title="Hoverable Card" cover={<img src="..." alt="cover" />}>
  Hover over this card to see elevation effect
</Card>
```

### Loading State
```jsx
import { Card, Switch } from 'antd';
import { useState } from 'react';

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} />
      <Card loading={loading} actions={[<SettingOutlined />, <EditOutlined />]}>
        <Card.Meta
          avatar={<Avatar src="https://..." />}
          title="Card title"
          description="This is the description"
        />
      </Card>
    </>
  );
};
```

### Card with Cover and Actions
```jsx
import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

<Card
  style={{ width: 300 }}
  cover={
    <img
      alt="example"
      src="https://example.com/image.png"
    />
  }
  actions={[
    <SettingOutlined key="setting" />,
    <EditOutlined key="edit" />,
    <EllipsisOutlined key="ellipsis" />,
  ]}
>
  <Meta
    avatar={<Avatar src="https://..." />}
    title="Card title"
    description="This is the description"
  />
</Card>
```

### Grid Card Layout
```jsx
import { Card } from 'antd';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

<Card title="Card Title">
  <Card.Grid style={gridStyle}>Content</Card.Grid>
  <Card.Grid hoverable={false} style={gridStyle}>Content (no hover)</Card.Grid>
  <Card.Grid style={gridStyle}>Content</Card.Grid>
  <Card.Grid style={gridStyle}>Content</Card.Grid>
  <Card.Grid style={gridStyle}>Content</Card.Grid>
  <Card.Grid style={gridStyle}>Content</Card.Grid>
  <Card.Grid style={gridStyle}>Content</Card.Grid>
</Card>
```

### Inner/Nested Cards
```jsx
<Card title="Outer Card title">
  <Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
    Inner Card content
  </Card>
  <Card
    style={{ marginTop: 16 }}
    type="inner"
    title="Inner Card title"
    extra={<a href="#">More</a>}
  >
    Inner Card content
  </Card>
</Card>
```

### Card with Tabs
```jsx
import { Card } from 'antd';
import { useState } from 'react';

const tabList = [
  { key: 'tab1', tab: 'Tab 1' },
  { key: 'tab2', tab: 'Tab 2' },
];

const contentList = {
  tab1: <p>Content for Tab 1</p>,
  tab2: <p>Content for Tab 2</p>,
};

const App = () => {
  const [activeKey, setActiveKey] = useState('tab1');

  return (
    <Card
      title="Card with Tabs"
      extra={<a href="#">More</a>}
      tabList={tabList}
      activeTabKey={activeKey}
      onTabChange={setActiveKey}
    >
      {contentList[activeKey]}
    </Card>
  );
};
```

### Card with Tab Bar Extra Content
```jsx
const tabList = [
  { key: 'article', label: 'article' },
  { key: 'app', label: 'app' },
  { key: 'project', label: 'project' },
];

<Card
  tabList={tabList}
  activeTabKey={activeKey}
  tabBarExtraContent={<a href="#">More</a>}
  onTabChange={setActiveKey}
  tabProps={{ size: 'middle' }}
>
  {contentList[activeKey]}
</Card>
```

### Semantic DOM Customization (v5.14.0+)
```jsx
// Custom classes for semantic card parts
<Card
  title="Card Title"
  classNames={{
    header: 'custom-header-class',
    body: 'custom-body-class',
    actions: 'custom-actions-class',
  }}
  styles={{
    header: { backgroundColor: '#f0f0f0' },
    body: { padding: '24px' },
  }}
>
  Card content
</Card>
```

## Complete TypeScript Interface

### Card Component Props
```typescript
interface CardProps {
  // Content
  title?: ReactNode;                          // Card title
  children?: ReactNode;                       // Main card body content
  cover?: ReactNode;                          // Top cover image/media
  extra?: ReactNode;                          // Top-right extra content
  actions?: ReactNode[];                      // Bottom action buttons array

  // Appearance
  variant?: 'outlined' | 'borderless';        // Card border style (default: 'outlined', v5.24.0+)
  bordered?: boolean;                         // Legacy: toggle border (deprecated, use variant)
  hoverable?: boolean;                        // Lift on hover (default: false)
  size?: 'default' | 'small';                 // Card size (default: 'default')
  type?: 'inner';                             // Inner card style for nesting

  // State
  loading?: boolean;                          // Show loading skeleton (default: false)

  // Tabs
  tabList?: TabItemType[];                    // List of tab items
  activeTabKey?: string;                      // Current active tab key
  defaultActiveTabKey?: string;               // Initial active tab key
  tabBarExtraContent?: ReactNode;             // Extra content in tab bar
  tabProps?: TabsProps;                       // Props passed to Tabs component
  onTabChange?: (key: string) => void;        // Tab change callback

  // Styling
  style?: CSSProperties;                      // Inline styles
  className?: string;                         // CSS class name
  classNames?: Record<SemanticDOM, string>;   // Semantic DOM classes (v5.14.0+)
  styles?: Record<SemanticDOM, CSSProperties>; // Semantic DOM styles (v5.14.0+)
}

// Semantic DOM parts that can be styled
type SemanticDOM =
  | 'header'
  | 'body'
  | 'extra'
  | 'title'
  | 'actions'
  | 'cover';
```

### Card.Grid Props
```typescript
interface CardGridProps {
  hoverable?: boolean;                        // Enable hover effect (default: true)
  style?: CSSProperties;                      // Inline styles
  className?: string;                         // CSS class name
}
```

### Card.Meta Props
```typescript
interface CardMetaProps {
  avatar?: ReactNode;                         // Avatar or icon
  title?: ReactNode;                          // Title content
  description?: ReactNode;                    // Description content
  style?: CSSProperties;                      // Inline styles
  className?: string;                         // CSS class name
}
```

## Notable Features

### Variant System (v5.24.0+)
- Modern `variant` prop replaces legacy `bordered` boolean
- Two variants: `outlined` (with border, default) and `borderless`
- Provides clearer naming and room for future variant additions
- Backward compatible: legacy `bordered` prop still functional

### Loading Skeleton
- Native loading state with automatic skeleton UI
- Shows placeholder for avatar, title, description, and actions
- Useful during data fetching without custom loading UI
- Works seamlessly with Card.Meta and actions

### Card.Meta Sub-component
- Dedicated component for structured metadata display
- Combines avatar, title, and description in consistent layout
- Commonly used for user profiles, article previews, product cards
- Self-contained styling and spacing

### Card.Grid Sub-component
- Creates grid-based sections within a single card
- Each grid cell can have independent hover behavior
- Useful for dashboards, feature matrices, settings panels
- Flexible width/layout via inline styles

### Actions Array
- Footer action area accepts array of ReactNode elements
- Automatically spaced and styled consistently
- Common pattern: icon buttons for quick actions
- Position: always at bottom of card

### Tab Integration
- Native tab support without external Tab component
- `tabList` prop for tab definitions
- Controlled via `activeTabKey` and `onTabChange`
- `tabBarExtraContent` for additional tab bar controls
- `tabProps` pass-through for Tab component configuration

### Inner Card Type
- Distinct visual style for nested cards
- Lighter background and border for visual hierarchy
- Common pattern: parent card with multiple inner cards
- Maintains all standard card features

### Hoverable Behavior
- Subtle elevation/shadow animation on hover
- Can be applied to entire card or individual Grid cells
- Signals interactivity without explicit button
- Often used with clickable card containers

### Extra Content Positioning
- `extra` prop places content in top-right of header
- Common use: "More" links, action buttons, badges
- Aligns with title automatically
- ReactNode support for flexible content

### Semantic DOM Customization (v5.14.0+)
- `classNames` prop for targeting internal card parts
- `styles` prop for inline styling of semantic sections
- Parts: header, body, extra, title, actions, cover
- Enables precise styling without CSS specificity issues
- Useful for theme overrides and component-level customization

### Size Variants
- Two sizes: `default` and `small`
- Affects padding, title size, and overall spacing
- Small size useful for dense layouts, sidebars, dashboards
- Consistent sizing across all card features

### Cover Pattern
- Top-positioned media area via `cover` prop
- Full-width image/video common pattern
- Often combined with Meta component for rich content cards
- ReactNode support allows custom cover content

## Research Notes

### Documentation Access
- Primary documentation available at https://ant.design/components/card
- GitHub markdown source: https://github.com/ant-design/ant-design/tree/master/components/card
- Demo examples in TypeScript with comprehensive patterns
- Well-structured API documentation with version annotations

### Framework Approach Observations

**Component Composition Strategy:**
- Main Card component with two specialized sub-components (Grid, Meta)
- Sub-components accessed via static properties: `Card.Grid`, `Card.Meta`
- Clean namespace separation while maintaining cohesive API
- Sub-components can be used independently of main Card

**Semantic Structure:**
- Clear separation of card sections: cover, header, body, actions
- Each section has dedicated prop for content
- Semantic DOM feature (v5.14.0+) exposes internal structure for styling
- Structure enforces consistent card anatomy across applications

**Progressive Enhancement:**
- Basic usage: just title and children
- Enhanced: add cover, actions, extra content
- Advanced: tabs, grid layouts, inner cards, semantic styling
- Each layer adds capability without breaking simpler use cases

**Variant Evolution:**
- Shift from boolean `bordered` to string `variant` prop
- Room for future variants beyond outlined/borderless
- Maintains backward compatibility with deprecated prop
- Clear versioning (v5.24.0+) indicates when change occurred

**Loading State Pattern:**
- Single boolean prop triggers comprehensive loading UI
- Automatic skeleton for all card sections
- No need to build custom loading placeholders
- Skeleton adapts to card configuration (actions, meta, etc.)

**Tab Integration Design:**
- Tabs built into Card rather than requiring composition
- Reduces nesting complexity for common pattern
- Pass-through `tabProps` for advanced tab configuration
- Controlled component pattern with activeTabKey/onTabChange

**Grid Sub-component:**
- Flexible grid system within single card container
- Hover behavior controllable per cell
- Manual styling for layout (no preset grid columns)
- Useful for dashboard-style content organization

**Meta Sub-component Pattern:**
- Encapsulates common metadata layout (avatar + title + description)
- Reduces boilerplate for common card pattern
- Consistent styling across applications
- Can be used with or without other card features

**Inner Card Type:**
- Dedicated styling for nested cards
- Visual hierarchy through background/border changes
- Common in complex layouts (card lists within cards)
- Maintains full card API in nested context

### TypeScript Integration
- Full TypeScript definitions for all props
- SemanticDOM type for classNames/styles targeting
- ReactNode for flexible content acceptance
- Array types for actions and tabList
- Strong typing for tab-related callbacks

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Very clean separation of concerns (cover, header, body, actions)
- Semantic DOM customization is powerful pattern
- Loading state out-of-box reduces implementation burden
- Sub-component pattern (Card.Grid, Card.Meta) is elegant
- Tab integration shows value of common pattern built-in
- Size variants provide flexibility without API explosion

**Potential Improvements:**
- More flexible grid layouts (preset columns, responsive)
- Slot-based content projection (more web-standard)
- Cover aspect ratio controls
- Animation controls for loading transitions
- Clickable card pattern could be more explicit (href prop)

**Alignment with Web Standards:**
- React-specific (not web components)
- Could benefit from custom element/shadow DOM encapsulation
- Semantic DOM pattern is good but CSS parts would be more standard
- Sub-components via static properties is React idiom, not web standard

### Design Patterns Observed

**Content Organization:**
- Hierarchical structure: cover > header (title + extra) > body > actions
- Clear visual and semantic boundaries between sections
- Actions always at bottom reinforces consistency
- Extra content always top-right provides predictable layout

**Interaction Patterns:**
- Hoverable indicates interactivity without explicit affordance
- Grid cells with individual hover suggest clickable segments
- Actions array pattern encourages icon-based quick actions
- Tab integration for multi-view content within single card

**Layout Flexibility:**
- Card.Grid for matrix layouts within single card
- Inner type for nested card hierarchies
- Borderless variant for seamless integration
- Size variants for different density needs

**State Communication:**
- Loading state is passive (no progress indication)
- Hoverable state is visual-only feedback
- Tab state is controlled component pattern
- No error state (intentional design choice)

### API Design Lessons

**Prop Naming:**
- Clear, descriptive names (hoverable, borderless, inner)
- Semantic section names (cover, extra, actions)
- Consistent boolean patterns (hoverable, loading)
- ReactNode for all content props (maximum flexibility)

**Deprecation Strategy:**
- Maintain old props with warnings
- Clear version annotations for new features
- Gradual migration path (bordered → variant)
- Documentation shows both old and new patterns

**Sub-component Pattern:**
- Static properties for related components
- Reduces import statements
- Clear component relationships
- Namespaced but cohesive

**Customization Layers:**
1. Props for common configurations
2. style/className for basic customization
3. classNames/styles for semantic part targeting
4. Design tokens for theme-level changes

**Orthogonal Features:**
- Variant, size, type are independent
- Hoverable works with any variant
- Loading works with all features
- Features compose without conflicts

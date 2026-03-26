# Ant Design - Badge & Tag Component Usage Patterns

## Research Metadata
- **Framework**: Ant Design (React)
- **Components**: Badge, Tag
- **Documentation URLs**:
  - Badge: https://ant.design/components/badge/
  - Tag: https://ant.design/components/tag/
- **Research Date**: 2025-11-04
- **URL Status**: Accessible (web search data extraction)

---

## Component Definitions

### Badge Component
**Purpose**: Small numerical values or status indicators that appear in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

**Mental Model**: Badge is primarily an **overlay/indicator** component designed to:
- Display counts/numbers on other UI elements (avatars, icons, links)
- Show status dots for state indication
- Add ribbon decorations to cards/containers
- Provide visual notification cues

**Key Characteristic**: Often wraps or overlays other elements; can be standalone for status indication.

### Tag Component
**Purpose**: Compact labeling elements for categorizing or marking items.

**Mental Model**: Tag is a **standalone label** component designed to:
- Categorize and label content
- Display selections/filters
- Show removable items (closeable variant)
- Create interactive selection lists (checkable variant)

**Key Characteristic**: Standalone element (not an overlay); focused on categorization and labeling.

---

## Component Relationship & Differences

### Functional Distinction

| Aspect | Badge | Tag |
|--------|-------|-----|
| **Primary Use** | Notification/status indicator | Content labeling/categorization |
| **Positioning** | Often overlaid on other elements | Standalone inline element |
| **Common Pattern** | Wrapped around avatars/icons | Used in lists, forms, filters |
| **Count Display** | Primary feature (with overflow) | Not applicable |
| **Removal** | N/A (persistent indicator) | Closeable variant available |
| **Selection** | N/A | Checkable variant available |
| **Status** | Status dots (success/error/warning) | Color variants for visual coding |

### When to Use Which

**Use Badge when:**
- Showing unread counts on notifications
- Indicating status on user avatars
- Adding corner ribbons to cards
- Displaying numerical indicators

**Use Tag when:**
- Categorizing items (articles, products)
- Showing selected filters
- Creating removable chips/pills
- Building tag input systems

---

## Badge Component - Detailed Analysis

### Supported Variants & Types

#### 1. **Basic Count Badge** (Level 1 - Core)
**Support**: Full
**Description**: Displays numerical count, typically overlaid on another element

```jsx
<Badge count={5}>
  <Avatar shape="square" size="large" />
</Badge>
```

**Key Features**:
- Hides when count is 0 (unless `showZero={true}`)
- Animated count changes
- Wraps child elements

#### 2. **Overflow Count** (Level 1 - Core)
**Support**: Full
**Description**: Shows `${overflowCount}+` when count exceeds threshold

```jsx
<Badge count={99} overflowCount={99}>
  <Avatar shape="square" size="large" />
</Badge>
// Displays: "99+"
```

**Default**: `overflowCount={99}`

#### 3. **Dot Badge** (Level 1 - Core)
**Support**: Full
**Description**: Simple red dot without numerical count

```jsx
<Badge dot>
  <a href="#">Link something</a>
</Badge>
```

**Use Case**: Binary notification state (has notifications vs. none)

#### 4. **Status Badge** (Level 1 - Core)
**Support**: Full - 5 preset statuses
**Description**: Standalone badge with status indicator and text

```jsx
<Badge status="success" text="Success" />
<Badge status="error" text="Error" />
<Badge status="default" text="Default" />
<Badge status="processing" text="Processing" />
<Badge status="warning" text="Warning" />
```

**Statuses**:
- `success` - Green dot
- `error` - Red dot
- `default` - Gray dot
- `processing` - Blue animated dot
- `warning` - Orange/yellow dot

#### 5. **Ribbon Badge** (Level 2 - Common)
**Support**: Full via `Badge.Ribbon`
**Description**: Corner ribbon decoration for cards/containers

```jsx
<Badge.Ribbon text="Hippies">
  <Card title="Pushes open the window" size="small">
    and raises the spyglass.
  </Card>
</Badge.Ribbon>
```

**Positioning**: Typically top-right corner
**Use Case**: Featured items, promotional tags

#### 6. **Custom Color Badge** (Level 1 - Core)
**Support**: Full - Preset colors + custom hex
**Description**: Colored dot badges for visual coding

```jsx
<Badge color="blue" text="blue" />
<Badge color="#f50" text="custom" />
```

**Preset Colors**: Series of colorful badge styles available

### Badge API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **count** | `ReactNode` | - | Number to show in badge | Level 1 |
| **showZero** | `boolean` | `false` | Show badge when count is 0 | Level 1 |
| **overflowCount** | `number` | `99` | Max count to show | Level 1 |
| **dot** | `boolean` | `false` | Show red dot without number | Level 1 |
| **status** | `'success' \| 'processing' \| 'default' \| 'error' \| 'warning'` | - | Set Badge as status dot | Level 1 |
| **color** | `string` | - | Custom color or preset color | Level 1 |
| **text** | `ReactNode` | - | Status text to display | Level 1 |
| **offset** | `[number, number]` | - | Position offset `[left, top]` | Level 2 |
| **size** | `'default' \| 'small'` | `'default'` | Size of the badge | Level 1 |

### Badge Positioning & Overlay Patterns

#### Overlay Mode (Most Common)
**Pattern**: Badge wraps child element and positions indicator

```jsx
<Badge count={5}>
  <Avatar />
</Badge>
```

**Default Position**: Top-right corner of child element

#### Offset Positioning
**Support**: Level 2
**Pattern**: Fine-tune position with `[left, top]` offset

```jsx
<Badge count={5} offset={[10, 10]}>
  <Avatar />
</Badge>
```

#### Standalone Mode
**Pattern**: Badge as independent element (status badges)

```jsx
<Badge status="processing" text="Processing" />
```

### Badge Size Variants

**Support**: Level 1 (when count is set)

- `default` - Standard badge size
- `small` - Compact badge size

```jsx
<Badge size="small" count={5}>
  <Avatar />
</Badge>
```

### Badge Color System

#### Preset Status Colors
**Support**: Level 1
- Success (green)
- Error (red)
- Default (gray)
- Processing (blue, animated)
- Warning (orange/yellow)

#### Custom Colors
**Support**: Level 1
- Preset color names
- Hex color values (#f50, etc.)

### Badge Special Features

#### Animated Count Changes
**Support**: Level 1
**Description**: Count transitions are animated automatically

#### Processing Animation
**Support**: Level 1
**Description**: `status="processing"` shows animated pulsing dot

---

## Tag Component - Detailed Analysis

### Supported Variants & Types

#### 1. **Basic Tag** (Level 1 - Core)
**Support**: Full
**Description**: Simple text label with optional color

```jsx
<Tag>Tag 1</Tag>
<Tag color="magenta">magenta</Tag>
<Tag color="red">red</Tag>
```

#### 2. **Closeable Tag** (Level 1 - Core)
**Support**: Full
**Description**: Tag with close icon that can be removed

```jsx
<Tag closable onClose={log}>
  Tag 2
</Tag>
```

**Behavior**: Fires `onClose` event when close icon clicked

#### 3. **Checkable Tag** (Level 2 - Common)
**Support**: Full via `Tag.CheckableTag`
**Description**: Toggle-able tag that works like a checkbox

```jsx
import { Tag } from 'antd';
const { CheckableTag } = Tag;

<CheckableTag
  checked={isChecked}
  onChange={(checked) => handleChange(checked)}
>
  Tag Label
</CheckableTag>
```

**Key Characteristics**:
- Controlled component (requires `checked` prop)
- No uncontrolled mode
- Toggle behavior on click
- Visual state change

#### 4. **Icon Tag** (Level 2 - Common)
**Support**: Full
**Description**: Tag with custom icon

```jsx
<Tag icon={<TwitterOutlined />} color="#55acee">
  Twitter
</Tag>
```

**Support Version**: Icon prop added in v5.27.0 for CheckableTag

#### 5. **Bordered Tag** (Level 1 - Core)
**Support**: Full
**Description**: Control border display

```jsx
<Tag bordered={false}>No Border</Tag>
```

### Tag API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **color** | `string` | - | Color of the tag (preset or hex) | Level 1 |
| **closable** | `boolean` | `false` | Whether tag can be closed | Level 1 |
| **onClose** | `(e) => void` | - | Callback when tag is closed | Level 1 |
| **icon** | `ReactNode` | - | Custom icon | Level 2 |
| **bordered** | `boolean` | `true` | Whether tag has border | Level 1 |

### CheckableTag API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **checked** | `boolean` | `false` | Checked status (controlled) | Level 1 |
| **onChange** | `(checked) => void` | - | Callback when checked state changes | Level 1 |
| **onClick** | `(e) => void` | - | Click handler | Level 1 |
| **icon** | `ReactNode` | - | Custom icon (v5.27.0+) | Level 2 |

### Tag Color Variants

#### Preset Status Colors
**Support**: Level 1
- `success` - Green
- `processing` - Blue
- `error` - Red
- `warning` - Orange/Yellow
- `default` - Gray

#### Preset Vibrant Colors
**Support**: Level 1
- magenta
- red
- volcano
- orange
- gold
- lime
- green
- cyan
- blue
- geekblue
- purple
- pink

#### Custom Colors
**Support**: Level 1
- Hex color strings (e.g., `#f50`)

### Tag Interactive Behaviors

#### Close Interaction
**Pattern**: Closeable tags
**Support**: Level 1

```jsx
const handleClose = (e) => {
  console.log('Tag closed');
};

<Tag closable onClose={handleClose}>
  Closeable Tag
</Tag>
```

**Behavior**: Tag is immediately removed when close icon clicked

#### Check/Toggle Interaction
**Pattern**: CheckableTag
**Support**: Level 2

```jsx
const [checked, setChecked] = useState(false);

<CheckableTag
  checked={checked}
  onChange={setChecked}
>
  Toggle Me
</CheckableTag>
```

**Behavior**: Visual state toggles; acts like checkbox

### Tag Special Features

#### Dynamic Tag Lists
**Support**: Level 2
**Pattern**: Add/remove tags dynamically

**Common Use Case**: Tag input systems where users can add/remove tags

#### Icon Support
**Support**: Level 2
**Pattern**: Add icons before tag text

```jsx
<Tag icon={<CheckCircleOutlined />} color="success">
  Success
</Tag>
```

---

## Usage Pattern Comparison

### Count/Number Display

| Feature | Badge | Tag |
|---------|-------|-----|
| Number display | ✅ Primary feature | ❌ Not supported |
| Overflow handling | ✅ `overflowCount` prop | ❌ N/A |
| Show zero | ✅ `showZero` prop | ❌ N/A |

### Visual Variants

| Feature | Badge | Tag |
|---------|-------|-----|
| Dot indicator | ✅ `dot` prop | ❌ N/A |
| Status colors | ✅ 5 presets | ✅ 5 presets |
| Custom colors | ✅ Hex + presets | ✅ Hex + presets |
| Vibrant colors | ⚠️ Limited | ✅ 12 presets |
| Ribbon variant | ✅ `Badge.Ribbon` | ❌ N/A |
| Icon support | ❌ N/A | ✅ `icon` prop |
| Border control | ❌ N/A | ✅ `bordered` prop |

### Positioning & Layout

| Feature | Badge | Tag |
|---------|-------|-----|
| Overlay mode | ✅ Wraps children | ❌ Standalone only |
| Standalone mode | ✅ Status badges | ✅ Primary mode |
| Position offset | ✅ `[left, top]` | ❌ N/A |
| Size control | ✅ `small/default` | ❌ Inherits from CSS |

### Interactive Features

| Feature | Badge | Tag |
|---------|-------|-----|
| Closeable | ❌ N/A | ✅ `closable` prop |
| Checkable/Toggle | ❌ N/A | ✅ `CheckableTag` |
| Animated | ✅ Count changes, processing | ❌ N/A |
| Events | ❌ Display only | ✅ `onClose`, `onChange`, `onClick` |

---

## Pattern Support Levels Summary

### Badge Component

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Count display | Level 1 | Core feature |
| Overflow count | Level 1 | Core feature |
| Dot indicator | Level 1 | Core feature |
| Status badges | Level 1 | Core feature |
| Custom colors | Level 1 | Core feature |
| Size variants | Level 1 | Core feature |
| Ribbon variant | Level 2 | Common |
| Position offset | Level 2 | Common |
| Animated changes | Level 1 | Core feature |

### Tag Component

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Basic label | Level 1 | Core feature |
| Color variants | Level 1 | Core feature |
| Closeable | Level 1 | Core feature |
| Bordered control | Level 1 | Core feature |
| Checkable variant | Level 2 | Common |
| Icon support | Level 2 | Common |
| Status colors | Level 1 | Core feature |
| Vibrant colors | Level 1 | Core feature |

---

## Code Examples

### Badge Examples

#### Basic Count Badge
```jsx
import { Badge, Avatar } from 'antd';

// Simple count
<Badge count={5}>
  <Avatar shape="square" size="large" />
</Badge>

// With overflow
<Badge count={99}>
  <Avatar shape="square" size="large" />
</Badge>
// Displays: "99"

<Badge count={100} overflowCount={99}>
  <Avatar shape="square" size="large" />
</Badge>
// Displays: "99+"

// Show zero
<Badge count={0} showZero>
  <Avatar shape="square" size="large" />
</Badge>
```

#### Dot Badge
```jsx
// Notification indicator
<Badge dot>
  <NotificationOutlined style={{ fontSize: 16 }} />
</Badge>

// Link with notification
<Badge dot>
  <a href="#">Link something</a>
</Badge>
```

#### Status Badges
```jsx
// Standalone status indicators
<Badge status="success" text="Success" />
<Badge status="error" text="Error" />
<Badge status="default" text="Default" />
<Badge status="processing" text="Processing" />
<Badge status="warning" text="Warning" />
```

#### Ribbon Badge
```jsx
import { Badge, Card } from 'antd';

<Badge.Ribbon text="Hippies">
  <Card title="Pushes open the window" size="small">
    and raises the spyglass.
  </Card>
</Badge.Ribbon>

<Badge.Ribbon text="Hippies" color="pink">
  <Card title="Pushes open the window" size="small">
    and raises the spyglass.
  </Card>
</Badge.Ribbon>
```

#### Custom Colors
```jsx
<Badge color="blue" text="blue" />
<Badge color="green" text="green" />
<Badge color="red" text="red" />
<Badge color="cyan" text="cyan" />
<Badge color="#f50" text="#f50" />
```

#### Size and Positioning
```jsx
// Small badge
<Badge size="small" count={5}>
  <Avatar shape="square" size="large" />
</Badge>

// Position offset
<Badge count={5} offset={[10, 10]}>
  <Avatar shape="square" size="large" />
</Badge>
```

### Tag Examples

#### Basic Tags
```jsx
import { Tag } from 'antd';

<Tag>Tag 1</Tag>
<Tag>Tag 2</Tag>
<Tag>Tag 3</Tag>
```

#### Colored Tags
```jsx
// Status colors
<Tag color="success">success</Tag>
<Tag color="processing">processing</Tag>
<Tag color="error">error</Tag>
<Tag color="warning">warning</Tag>
<Tag color="default">default</Tag>

// Vibrant colors
<Tag color="magenta">magenta</Tag>
<Tag color="red">red</Tag>
<Tag color="volcano">volcano</Tag>
<Tag color="orange">orange</Tag>
<Tag color="gold">gold</Tag>
<Tag color="lime">lime</Tag>
<Tag color="green">green</Tag>
<Tag color="cyan">cyan</Tag>
<Tag color="blue">blue</Tag>
<Tag color="geekblue">geekblue</Tag>
<Tag color="purple">purple</Tag>
<Tag color="pink">pink</Tag>

// Custom hex color
<Tag color="#f50">#f50</Tag>
<Tag color="#2db7f5">#2db7f5</Tag>
<Tag color="#87d068">#87d068</Tag>
<Tag color="#108ee9">#108ee9</Tag>
```

#### Closeable Tags
```jsx
const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);

const handleClose = (removedTag) => {
  const newTags = tags.filter((tag) => tag !== removedTag);
  setTags(newTags);
};

{tags.map((tag) => (
  <Tag closable onClose={() => handleClose(tag)} key={tag}>
    {tag}
  </Tag>
))}
```

#### Checkable Tags
```jsx
import { Tag } from 'antd';
const { CheckableTag } = Tag;

const tagsData = ['Movies', 'Books', 'Music', 'Sports'];
const [selectedTags, setSelectedTags] = useState(['Books']);

const handleChange = (tag, checked) => {
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter((t) => t !== tag);
  setSelectedTags(nextSelectedTags);
};

{tagsData.map((tag) => (
  <CheckableTag
    key={tag}
    checked={selectedTags.includes(tag)}
    onChange={(checked) => handleChange(tag, checked)}
  >
    {tag}
  </CheckableTag>
))}
```

#### Icon Tags
```jsx
import { Tag } from 'antd';
import { TwitterOutlined, YoutubeOutlined, FacebookOutlined, LinkedinOutlined } from '@ant-design/icons';

<Tag icon={<TwitterOutlined />} color="#55acee">
  Twitter
</Tag>
<Tag icon={<YoutubeOutlined />} color="#cd201f">
  Youtube
</Tag>
<Tag icon={<FacebookOutlined />} color="#3b5999">
  Facebook
</Tag>
<Tag icon={<LinkedinOutlined />} color="#55acee">
  LinkedIn
</Tag>
```

#### Bordered Control
```jsx
// No border
<Tag bordered={false}>No Border</Tag>
<Tag bordered={false} color="processing">No Border</Tag>
<Tag bordered={false} color="success">No Border</Tag>

// With border (default)
<Tag>With Border</Tag>
<Tag color="processing">With Border</Tag>
```

---

## Implementation Philosophy

### Badge Design Philosophy
Ant Design's Badge component embodies a **notification-first** approach:
- Primary use: Count indicators for notifications/messages
- Secondary use: Status indication for UI states
- Tertiary use: Decorative ribbons for emphasis
- Always overlay-capable, sometimes standalone
- Animation for dynamic counts enhances user attention

### Tag Design Philosophy
Ant Design's Tag component embodies a **categorization-first** approach:
- Primary use: Content labeling and categorization
- Secondary use: Interactive selection (checkable)
- Tertiary use: Dynamic item management (closeable)
- Always standalone, never overlay
- Rich color palette for visual coding

### Complementary Usage
The two components complement each other:
- **Badge** answers: "How many?" or "What status?"
- **Tag** answers: "What category?" or "Which items?"
- Badge draws attention to changes/counts
- Tag organizes and labels content

---

## Accessibility Considerations

### Badge Accessibility
- Status badges should have meaningful text
- Count badges are typically decorative
- Color should not be the only indicator (use with icons/text)
- Overflow handling (`99+`) provides context

### Tag Accessibility
- CheckableTag acts like checkbox (keyboard navigable)
- Closeable tags provide keyboard close support
- Color-coded tags should include text labels
- `bordered={false}` tags should maintain sufficient contrast

---

## Research Notes

### Data Collection Method
- Web search extraction from official Ant Design documentation
- Multiple searches to gather comprehensive API information
- Cross-referenced Badge and Tag component documentation
- Research date: 2025-11-04

### Documentation Quality
- Official documentation is comprehensive
- Clear API prop tables available
- Extensive code examples provided
- Strong component distinction and guidance

### Limitations
- Direct URL fetching returned CSS instead of content
- Relied on web search result extraction
- Some advanced features may not be fully documented in search results
- Full API reference tables would require direct documentation access

---

## Recommendations for Semantic UI

### Badge Implementation Priority

**Must-Have (Level 1)**:
1. Count display with children wrapping
2. Overflow count with configurable threshold
3. Dot indicator variant
4. Status badge (standalone with text)
5. Basic color customization
6. Show zero option

**Should-Have (Level 2)**:
1. Ribbon variant for cards
2. Position offset control
3. Size variants
4. Animated count changes

**Consider**:
- Processing/animated status indicators
- Multiple preset color systems

### Tag Implementation Priority

**Must-Have (Level 1)**:
1. Basic text labels
2. Color variants (status + vibrant presets)
3. Closeable with onClose event
4. Border control
5. Custom hex colors

**Should-Have (Level 2)**:
1. Checkable tag variant
2. Icon support
3. Dynamic tag list patterns

**Consider**:
- Extensive preset color palette (12+ colors)
- Clear separation between Tag and CheckableTag APIs

### Semantic UI Differentiators

**Natural Language Patterns**:
- Consider: `<ui-badge count="5">` vs `<ui-badge number="5">`
- Consider: `<ui-tag removable>` vs `<ui-tag closeable>`

**Settings Architecture**:
- Leverage reactive settings for count updates
- Use settings for color, size, variant configuration

**Component Composition**:
- Badge wrapping children aligns well with slot-based composition
- Tag content via default slot
- CheckableTag could be a variation setting rather than separate component

### Key Insight
Ant Design maintains clear separation: Badge for notification/status overlay, Tag for categorization/labeling. This distinction should be preserved in Semantic UI implementation while adapting to natural language patterns.

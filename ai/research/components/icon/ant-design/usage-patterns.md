# Ant Design Icon - Usage Patterns

## Research Metadata
- **Framework**: Ant Design (React)
- **Component**: Icon
- **Documentation URL**: https://ant.design/components/icon/
- **Research Date**: 2025-11-05
- **Version Researched**: 4.x and 5.x (latest)

---

## Component Overview

The Icon component is a **display component** for rendering SVG-based icons in Ant Design applications. It serves as the foundational icon system, providing access to a comprehensive icon library with multiple visual themes (outlined, filled, two-tone) and styling customization options.

**Mental Model**: Icon is a **semantic visual indicator and decorative element** that:
- Renders SVG icons from the @ant-design/icons library with consistent styling
- Provides multiple visual themes to communicate different visual weights and meanings
- Supports dynamic sizing, rotation, and color customization
- Integrates seamlessly with other components (buttons, inputs, navigation, etc.)
- Enables custom SVG icons through the `component` prop for extensibility

**Key Characteristic**: A composable, themeable SVG icon system with three built-in visual variants (Outlined, Filled, Two-Tone) and extensive customization options.

---

## Core Features & API

### 1. **Icon Library Integration** (Level 1 - Core)
**Support**: Full via @ant-design/icons package
**Description**: Access to 1000+ pre-built SVG icons with three theme variants

```jsx
import { HomeOutlined, HomeFilled, HomeTwoTone } from '@ant-design/icons';

// Outlined theme (default visual weight)
<HomeOutlined />

// Filled theme (solid, heavy visual weight)
<HomeFilled />

// Two-tone theme (color customizable)
<HomeTwoTone />
```

**Key Features**:
- **Icon Naming Convention**: Component names follow `{IconName}{Theme}` pattern
  - `HomeOutlined` - Outline stroke style (most common)
  - `HomeFilled` - Solid fill style
  - `HomeTwoTone` - Two-color style (primary + secondary color)
- **Tree-Shaking Compatible**: Only imported icons are bundled
- **1000+ Icons**: Covers UI, navigation, common actions, notifications, status indicators, and custom needs
- **Consistent Rendering**: All icons render at same baseline with consistent scaling

### 2. **Basic Icon Display** (Level 1 - Core)
**Support**: Full
**Description**: Simple SVG icon rendering with optional styling

```jsx
import { StarOutlined, StarFilled } from '@ant-design/icons';

// Basic icon (uses component theme as-is)
<StarOutlined />

// With inline className
<StarOutlined className="custom-icon" />

// With inline styles
<StarOutlined style={{ color: 'blue', fontSize: '20px' }} />
```

**Properties**:
- Renders as `<svg>` element (not `<i>` tag like font icons)
- Inherits color from parent text color if not specified
- Uses flexbox alignment (vertical-align: -0.125em)
- Small baseline alignment offset for text integration

### 3. **Size Control** (Level 1 - Core)
**Support**: Full via `fontSize` style property
**Description**: Flexible sizing via CSS font-size property

```jsx
import { SmileOutlined } from '@ant-design/icons';

// Default size (1em, inherits from parent)
<SmileOutlined />

// Explicit sizes via className or style
<SmileOutlined style={{ fontSize: '16px' }} />
<SmileOutlined style={{ fontSize: '24px' }} />
<SmileOutlined style={{ fontSize: '32px' }} />

// Responsive sizing (with Tailwind or custom CSS)
<SmileOutlined className="text-lg md:text-2xl lg:text-4xl" />

// Via CSS variables
<SmileOutlined style={{ fontSize: 'var(--icon-size, 1em)' }} />
```

**Size Patterns**:
- **Relative Sizing**: Use `em` units to scale with parent font size (recommended)
- **Fixed Sizing**: Use `px` for explicit pixel sizes
- **Proportional**: Icons maintain aspect ratio at all sizes
- **Default**: 1em (16px in typical browsers)
- **Common Sizes**: 16px (small), 20px (medium), 24px (standard), 32px (large), 48px (extra large)

### 4. **Rotation & Transform** (Level 1 - Core)
**Support**: Full via `rotate` prop (v4.0+)
**Description**: Rotate icons to indicate direction or state

```jsx
import { ArrowRightOutlined } from '@ant-design/icons';

// Rotate by degrees
<ArrowRightOutlined rotate={90} />   // Points down
<ArrowRightOutlined rotate={180} />  // Points left
<ArrowRightOutlined rotate={270} />  // Points up

// Dynamic rotation (e.g., loading indicator)
<LoadingOutlined style={{ animation: 'spin 1s linear infinite' }} />

// With custom CSS animation
<div style={{
  animation: 'spin 1s linear infinite'
}}>
  <LoadingOutlined />
</div>
```

**Rotation Details**:
- **rotate prop**: Accepts degrees (0-360) for static rotation
- **CSS Animation**: Use CSS `transform: rotate()` or animation for dynamic effects
- **Common Use Cases**:
  - Loading spinners: continuous rotation
  - Navigation arrows: rotate to match text direction
  - Status indicators: different angles for states
  - Expandable sections: rotate chevron on toggle

### 5. **Color & Theming** (Level 1 - Core)
**Support**: Full via CSS properties and `twoToneColor` prop
**Description**: Customize icon colors through multiple methods

```jsx
import { HeartOutlined, HeartFilled, HeartTwoTone } from '@ant-design/icons';

// Outlined/Filled: Inherit from text color (simplest)
<HeartOutlined style={{ color: 'red' }} />
<HeartFilled style={{ color: '#ff0000' }} />

// Two-Tone: Customize primary color (v4.4+)
<HeartTwoTone twoToneColor="#ff0000" />          // Red
<HeartTwoTone twoToneColor="gold" />             // Gold
<HeartTwoTone twoToneColor="rgb(255, 0, 0)" />  // RGB

// Multiple color keywords supported
<HeartTwoTone twoToneColor="cyan" />
<HeartTwoTone twoToneColor="magenta" />
<HeartTwoTone twoToneColor="orange" />

// Via Ant Design theme colors
import { theme } from 'antd';
const { useToken } = theme;
const { colorPrimary } = useToken();
<HeartTwoTone twoToneColor={colorPrimary} />
```

**Color Methods**:
- **Named Colors**: 'red', 'blue', 'green', 'gold', 'cyan', 'magenta', 'orange', 'purple', 'volcano', 'geekblue', 'lime'
- **Hex Colors**: '#ff0000', '#00ff00', etc.
- **RGB**: 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 0.5)'
- **CSS Variables**: Via style object and custom properties
- **Theme Token Integration**: Use Ant Design theme tokens for consistency

### 6. **Spin Animation** (Level 1 - Core)
**Support**: Full via `spin` prop (v4.0+)
**Description**: Built-in spinning animation for loading states

```jsx
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';

// Built-in spin prop (applies CSS animation)
<LoadingOutlined spin />
<SyncOutlined spin />

// Equivalent CSS (if not using spin prop)
<LoadingOutlined style={{
  animation: 'spinAntIcon 1s linear infinite'
}} />

// In Spin component context
import { Spin } from 'antd';
<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
```

**Spin Details**:
- **spin prop**: Boolean, applies `animation: spinAntIcon 1s linear infinite`
- **CSS Keyframes**: Ant Design provides `@keyframes spinAntIcon { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
- **Duration**: 1 second per rotation
- **Common Use Cases**:
  - Loading indicators
  - Data fetching states
  - Refresh operations
  - Processing indicators

### 7. **Custom SVG Icons** (Level 2 - Advanced)
**Support**: Full via `component` prop
**Description**: Use custom SVG components instead of @ant-design/icons

```jsx
// Method 1: Custom React component that renders SVG
const CustomHomeIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

// Use with Icon component
import Icon from '@ant-design/icons';
<Icon component={CustomHomeIcon} />

// Method 2: Inline SVG component
const CustomIcon = ({ style }) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={style}
  >
    {/* SVG path or content */}
  </svg>
);

<Icon component={CustomIcon} style={{ color: 'blue', fontSize: '20px' }} />

// Method 3: External SVG file import (with webpack loader)
// Requires svg-react-loader or similar
import ExternalSvgIcon from './custom-icon.svg?react';
<Icon component={ExternalSvgIcon} />
```

**Custom Icon Requirements**:
- Component should accept `style`, `className`, and other standard props
- SVG should use relative dimensions (1em x 1em viewBox)
- Use `fill="currentColor"` to inherit text color
- Width and height should be `1em` for proper scaling
- ViewBox should match actual icon dimensions

### 8. **Theme Prop** (Level 2 - Advanced)
**Support**: Limited - mainly for internal use
**Description**: Specify icon theme variant explicitly

```jsx
import Icon from '@ant-design/icons';
import { HomeOutlined } from '@ant-design/icons';

// Themes are typically handled via import selection
// Home icon with outline theme (default import)
<HomeOutlined />

// Direct Icon component with theme (rarely used directly)
// Most apps use pre-imported themed icons instead
```

**Theme Notes**:
- Three themes: 'outlined' (default), 'filled', 'twotone'
- Typically handled at import time (e.g., `HomeOutlined` vs `HomeFilled`)
- `theme` prop rarely needed; use correct icon import instead

---

## Props/API Reference

### Icon Component Props

```typescript
interface IconProps extends React.SVGProps<SVGSVGElement> {
  // Icon styling
  className?: string;                    // CSS class for styling
  style?: React.CSSProperties;          // Inline styles (fontSize, color, etc.)

  // Icon rendering
  component?: React.ComponentType<any>; // Custom React component for SVG rendering

  // Icon animation
  spin?: boolean;                        // Apply spinning animation (v4.0+)
  rotate?: number;                       // Rotate icon by degrees (0-360) (v4.0+)

  // Two-tone coloring (Two-Tone theme only)
  twoToneColor?: string | string[];      // Color for two-tone icons

  // Internal/Less common
  theme?: 'outlined' | 'filled' | 'twotone';  // Icon theme variant
  viewBox?: string;                      // SVG viewBox override
  preserveAspectRatio?: string;         // SVG aspect ratio behavior
  fill?: string;                         // SVG fill color

  // Standard SVG attributes
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  xmlns?: string;

  // Standard HTML attributes
  title?: string;                        // Accessibility tooltip/title
  onClick?: (event: React.MouseEvent) => void;  // Click handler
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  [key: string]: any;                   // Other SVG/HTML attributes
}
```

### Key Props Explained

| Prop | Type | Default | Purpose | Example |
|------|------|---------|---------|---------|
| `style` | CSSProperties | - | Inline styling (font-size, color, etc.) | `style={{ fontSize: '24px', color: 'red' }}` |
| `className` | string | - | CSS class for custom styling | `className="custom-icon-class"` |
| `spin` | boolean | false | Apply spinning animation | `<LoadingOutlined spin />` |
| `rotate` | number | - | Rotate icon in degrees | `<ArrowOutlined rotate={90} />` |
| `twoToneColor` | string | - | Color for two-tone icons | `<HeartTwoTone twoToneColor="red" />` |
| `component` | React.ComponentType | - | Custom SVG component | `component={CustomSvgIcon}` |
| `title` | string | - | Accessibility tooltip | `<StarOutlined title="Favorite" />` |

---

## Common Usage Patterns

### Pattern 1: Icon in Button
**Use Case**: Buttons with icons as visual indicators or action symbols
**Implementation**: Combine Icon with Button component

```jsx
import { Button } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

// Icon-only button
<Button type="primary" icon={<SearchOutlined />} />

// Icon with text
<Button type="primary" icon={<SearchOutlined />}>
  Search
</Button>

// Different button types with icons
<Button icon={<DeleteOutlined />}>Delete</Button>
<Button type="dashed" icon={<EditOutlined />}>Edit</Button>
<Button type="text" icon={<SaveOutlined />}>Save</Button>

// Icon position control (v5.1.0+)
<Button icon={<SearchOutlined />} iconPosition="end">
  Search
</Button>

// Conditional icon based on state
<Button icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}>
  {loading ? 'Downloading...' : 'Download'}
</Button>
```

### Pattern 2: Loading & Async States
**Use Case**: Indicate asynchronous operations (data fetching, processing)
**Implementation**: Use spinning icons or Spin component with custom icons

```jsx
import { LoadingOutlined, SyncOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

// Simple spinning icon
<LoadingOutlined spin style={{ fontSize: '24px' }} />

// In button showing loading state
<Button loading icon={<LoadingOutlined />}>
  Submitting...
</Button>

// Custom loading indicator with Spin component
<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />

// Sync/refresh indicator
<SyncOutlined spin />

// Download progress indicator
<CloudDownloadOutlined style={{
  animation: 'spin 1s linear infinite',
  fontSize: '24px'
}} />

// Loading with text
<div>
  <LoadingOutlined spin style={{ marginRight: '8px' }} />
  Processing data...
</div>
```

### Pattern 3: Form & Input Icons
**Use Case**: Visual indicators within input fields and form controls
**Implementation**: Use icons as adornments in form fields

```jsx
import { Input, Form, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SearchOutlined } from '@ant-design/icons';

// Input with prefix icon
<Input
  prefix={<UserOutlined />}
  placeholder="Username"
/>

// Input with suffix icon (for status indication)
<Input
  suffix={<CheckCircleOutlined style={{ color: 'green' }} />}
  value="Valid input"
/>

// Search input with icon
<Input
  prefix={<SearchOutlined />}
  placeholder="Search..."
/>

// Form field with icon label
<Form.Item label={<><UserOutlined /> Username</>}>
  <Input />
</Form.Item>

// Password field with toggle visibility
const [visible, setVisible] = useState(false);
<Input
  type={visible ? 'text' : 'password'}
  prefix={<LockOutlined />}
  suffix={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
  onClick={() => setVisible(!visible)}
/>
```

### Pattern 4: Navigation & Menu Icons
**Use Case**: Visual indicators for navigation items, menu entries
**Implementation**: Combine icons with navigation components

```jsx
import { Menu, Layout } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

// Menu with icons
<Menu>
  <Menu.Item icon={<HomeOutlined />} key="home">
    Home
  </Menu.Item>
  <Menu.Item icon={<UserOutlined />} key="profile">
    Profile
  </Menu.Item>
  <Menu.Item icon={<SettingOutlined />} key="settings">
    Settings
  </Menu.Item>
  <Menu.Divider />
  <Menu.Item icon={<LogoutOutlined />} key="logout" danger>
    Logout
  </Menu.Item>
</Menu>

// Navigation breadcrumbs with icons
<Breadcrumb>
  <Breadcrumb.Item>
    <HomeOutlined /> Home
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <UserOutlined /> Profile
  </Breadcrumb.Item>
</Breadcrumb>
```

### Pattern 5: Status & Alert Icons
**Use Case**: Communicate status, warnings, errors, success
**Implementation**: Color-coded icons with semantic meaning

```jsx
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

// Success indication
<div style={{ color: 'green' }}>
  <CheckCircleOutlined /> Operation successful
</div>

// Error indication
<div style={{ color: 'red' }}>
  <CloseCircleOutlined /> Operation failed
</div>

// Warning indication
<div style={{ color: 'orange' }}>
  <WarningOutlined /> Warning: Please review
</div>

// Info indication
<div style={{ color: 'blue' }}>
  <InfoCircleOutlined /> Information
</div>

// In alert/notification context
<Alert
  icon={<CheckCircleOutlined />}
  message="Success"
  type="success"
/>

<Alert
  icon={<ExclamationCircleOutlined />}
  message="Warning"
  type="warning"
/>
```

### Pattern 6: Rating & Favorite (Two-Tone Icons)
**Use Case**: Interactive state indicators with visual emphasis
**Implementation**: Use Two-Tone icons for richer visual communication

```jsx
import { StarOutlined, StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';

// Toggle between outlined and filled for state
const [starred, setStarred] = useState(false);
<span
  style={{ cursor: 'pointer', fontSize: '24px' }}
  onClick={() => setStarred(!starred)}
>
  {starred ? (
    <StarFilled style={{ color: 'gold' }} />
  ) : (
    <StarOutlined />
  )}
</span>

// Favorite toggle
const [liked, setLiked] = useState(false);
<span onClick={() => setLiked(!liked)} style={{ cursor: 'pointer' }}>
  {liked ? (
    <HeartFilled style={{ color: 'red' }} />
  ) : (
    <HeartOutlined />
  )}
</span>

// Rating display
<div>
  {[1, 2, 3, 4, 5].map((num) => (
    <StarFilled
      key={num}
      style={{ color: num <= rating ? 'gold' : '#ccc' }}
    />
  ))}
</div>
```

### Pattern 7: Icon with Tooltip (Accessibility)
**Use Case**: Provide context for icon-only buttons or unclear icons
**Implementation**: Combine Icon with Tooltip component

```jsx
import { Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

// Icon button with tooltip
<Tooltip title="Delete item">
  <Button icon={<DeleteOutlined />} danger />
</Tooltip>

// Icon with hover text
<Tooltip title="Edit this entry">
  <EditOutlined style={{ cursor: 'pointer' }} />
</Tooltip>

// Tooltip with icon
<Tooltip title={<>Download <DownloadOutlined /></>}>
  <Button>Download File</Button>
</Tooltip>

// Group of icon buttons with tooltips
<Space>
  <Tooltip title="Edit">
    <Button icon={<EditOutlined />} />
  </Tooltip>
  <Tooltip title="Delete">
    <Button icon={<DeleteOutlined />} danger />
  </Tooltip>
  <Tooltip title="Download">
    <Button icon={<DownloadOutlined />} />
  </Tooltip>
</Space>
```

### Pattern 8: Dynamic Icon Selection
**Use Case**: Choose icons based on data, state, or conditions
**Implementation**: Import multiple icons and select conditionally

```jsx
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const statusIconMap = {
  success: <CheckCircleOutlined style={{ color: 'green' }} />,
  error: <CloseCircleOutlined style={{ color: 'red' }} />,
  warning: <ExclamationCircleOutlined style={{ color: 'orange' }} />,
  loading: <LoadingOutlined spin style={{ color: 'blue' }} />,
  unknown: <QuestionCircleOutlined style={{ color: 'gray' }} />
};

// Usage
const status = 'success';
<div>{statusIconMap[status]} Operation {status}</div>

// With conditional rendering
const getStatusIcon = (status) => {
  switch(status) {
    case 'pending':
      return <LoadingOutlined spin />;
    case 'completed':
      return <CheckCircleOutlined style={{ color: 'green' }} />;
    case 'failed':
      return <CloseCircleOutlined style={{ color: 'red' }} />;
    default:
      return <QuestionCircleOutlined />;
  }
};

<div>{getStatusIcon(taskStatus)}</div>
```

### Pattern 9: Icon Size Variations
**Use Case**: Use appropriately sized icons for different contexts
**Implementation**: Apply font-size through style or className

```jsx
import { HomeOutlined } from '@ant-design/icons';

// Semantic size variations
<div>
  {/* Extra small - 12px */}
  <HomeOutlined style={{ fontSize: '12px' }} />

  {/* Small - 16px */}
  <HomeOutlined style={{ fontSize: '16px' }} />

  {/* Medium/Default - 20px (common) */}
  <HomeOutlined style={{ fontSize: '20px' }} />

  {/* Large - 24px */}
  <HomeOutlined style={{ fontSize: '24px' }} />

  {/* Extra Large - 32px (headings) */}
  <HomeOutlined style={{ fontSize: '32px' }} />

  {/* Responsive sizing */}
  <HomeOutlined className="text-sm md:text-base lg:text-lg" />
</div>

// Proportional sizing (respects parent font-size)
<div style={{ fontSize: '24px' }}>
  <HomeOutlined />  {/* 24px due to 1em = 24px */}
</div>

// In button context (inherits from Button style)
<Button type="primary">
  <HomeOutlined /> Home {/* Size adapts with button */}
</Button>
```

### Pattern 10: Custom SVG Icons
**Use Case**: Use custom icons not in Ant Design library
**Implementation**: Create custom SVG component and pass via `component` prop

```jsx
import Icon from '@ant-design/icons';

// Custom SVG component
const CustomLogoIcon = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 200 200"
    fill="currentColor"
    {...props}
  >
    <circle cx="100" cy="100" r="80" fill="currentColor" />
    <path d="..." fill="white" />
  </svg>
);

// Use custom icon with Icon component
<Icon component={CustomLogoIcon} />

// With styling
<Icon
  component={CustomLogoIcon}
  style={{ fontSize: '32px', color: 'blue' }}
/>

// In button
<Button icon={<Icon component={CustomLogoIcon} />}>
  Custom Button
</Button>

// Complete custom icon library pattern
const icons = {
  logo: CustomLogoIcon,
  custom: AnotherCustomIcon,
  // ...
};

// Use throughout app
<Icon component={icons.logo} style={{ fontSize: '24px' }} />
```

---

## Visual Variations & Themes

### Icon Themes

#### 1. **Outlined Theme** (Default, Most Common)
**Characteristics**: Stroke-based, lightweight, clear visual hierarchy
**Best For**: UI controls, navigation, general-purpose indication
**Example**: `HomeOutlined`, `SearchOutlined`, `UserOutlined`

```jsx
import { HomeOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

<div>
  <HomeOutlined />   {/* Outlined home */}
  <SearchOutlined /> {/* Outlined search */}
  <UserOutlined />   {/* Outlined user */}
</div>
```

**Visual Weight**: Light (good for dense UIs, minimal prominence)
**Use Cases**: Default buttons, menu items, navigation, form icons

#### 2. **Filled Theme** (Solid Visual Weight)
**Characteristics**: Solid fill-based, heavier visual weight, emphasis
**Best For**: Primary actions, status indicators needing emphasis
**Example**: `HomeFilled`, `StarFilled`, `HeartFilled`

```jsx
import { HomeFilled, StarFilled, HeartFilled } from '@ant-design/icons';

<div>
  <HomeFilled />    {/* Solid filled home */}
  <StarFilled />    {/* Solid filled star */}
  <HeartFilled />   {/* Solid filled heart */}
</div>
```

**Visual Weight**: Heavy (good for emphasis, highlights, important actions)
**Use Cases**: Favorites/ratings, status badges, primary action emphasis, toggles

#### 3. **Two-Tone Theme** (Dual Color)
**Characteristics**: Dual-color design with primary and secondary tones
**Best For**: Rich visual communication, contextual information
**Example**: `HomeTwoTone`, `SmileTwoTone`, `FileExcelTwoTone`

```jsx
import { HomeTwoTone, SmileTwoTone, FileExcelTwoTone } from '@ant-design/icons';

// Default colors
<HomeTwoTone />

// Custom primary color
<SmileTwoTone twoToneColor="gold" />
<FileExcelTwoTone twoToneColor="green" />

// With theme colors
<HomeTwoTone twoToneColor={colorPrimary} />
```

**Visual Weight**: Medium (balanced emphasis)
**Color Customization**: Primary color customizable via `twoToneColor` prop
**Use Cases**: File type indicators, status with context, rich information display

---

## Size Patterns

### Semantic Size System

```jsx
import { HomeOutlined } from '@ant-design/icons';

// Size naming convention (CSS font-size)
const ICON_SIZES = {
  xs: '12px',      // Extra small - breadcrumbs, tags
  sm: '14px',      // Small - compact UIs, helper text
  md: '16px',      // Medium - default, form labels
  base: '18px',    // Base - standard content
  lg: '20px',      // Large - main actions, headings
  xl: '24px',      // Extra large - prominent features
  '2xl': '28px',   // 2x large - large headings
  '3xl': '32px',   // 3x large - hero sections
  '4xl': '40px',   // 4x large - banners
  '5xl': '48px',   // 5x large - large displays
};

// Usage
<HomeOutlined style={{ fontSize: ICON_SIZES.xs }} />
<HomeOutlined style={{ fontSize: ICON_SIZES.lg }} />

// Responsive sizing with Tailwind-like classes
<HomeOutlined className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl" />

// In component context
<Button type="primary" size="large" icon={<HomeOutlined style={{ fontSize: '20px' }} />} />
```

### Fixed vs Relative Sizing

```jsx
// Relative sizing (recommended - scales with parent)
<div style={{ fontSize: '24px' }}>
  <HomeOutlined />  {/* 24px = 1em */}
</div>

// Fixed sizing (explicit pixels)
<HomeOutlined style={{ fontSize: '24px' }} />

// Viewport-relative (via CSS variables)
<HomeOutlined style={{ fontSize: 'clamp(12px, 5vw, 48px)' }} />

// In scaled contexts
<div style={{ transform: 'scale(1.5)' }}>
  <HomeOutlined />  {/* Scales proportionally */}
</div>
```

---

## Color & Theming

### Color Methods

#### 1. **Outlined/Filled Icons - Text Color Inheritance**
```jsx
import { HomeOutlined, HomeFilled } from '@ant-design/icons';

// Inherit from parent color (default)
<div style={{ color: 'blue' }}>
  <HomeOutlined />  {/* Blue icon */}
</div>

// Explicit color
<HomeOutlined style={{ color: 'red' }} />
<HomeFilled style={{ color: '#00ff00' }} />

// Color keywords
<HomeOutlined style={{ color: 'gold' }} />
<HomeFilled style={{ color: 'cyan' }} />
```

#### 2. **Two-Tone Icons - Primary Color Customization**
```jsx
import { HomeTwoTone, StarTwoTone } from '@ant-design/icons';

// Default (uses theme primary)
<HomeTwoTone />

// Custom single color
<HomeTwoTone twoToneColor="red" />
<StarTwoTone twoToneColor="gold" />

// RGB color
<HomeTwoTone twoToneColor="rgb(255, 0, 0)" />

// Theme token integration
import { theme } from 'antd';
const { useToken } = theme;

function MyComponent() {
  const { token } = useToken();
  return <HomeTwoTone twoToneColor={token.colorPrimary} />;
}
```

#### 3. **Color-Coded Status Patterns**
```jsx
// Semantic color meanings
const statusColors = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
  default: 'gray'
};

<CheckCircleOutlined style={{ color: statusColors.success }} />
<CloseCircleOutlined style={{ color: statusColors.error }} />
<ExclamationCircleOutlined style={{ color: statusColors.warning }} />
<InfoCircleOutlined style={{ color: statusColors.info }} />
```

---

## Icon Libraries

### 1. **@ant-design/icons** (Official Icon Package)
**Size**: 1000+ icons across 3 themes
**Maintenance**: Official Ant Design team
**Version**: Paired with antd version (v5.x for antd 5.x)

**Themes Included**:
- Outlined (default, 1000+)
- Filled (~400)
- TwoTone (~100+)

**Import Method**:
```jsx
import { HomeOutlined, HomeFilled, HomeTwoTone } from '@ant-design/icons';
```

**Icon Categories**:
- Directions: arrow-left, arrow-right, arrow-up, etc.
- Suggested: backup, cloud, etc.
- Common: home, settings, user, etc.
- Status: check-circle, cross-circle, warning, etc.
- Edit: copy, delete, edit, etc.
- Data: bar-chart, line-chart, etc.
- Brand: ant-design, github, twitter, etc.
- And many more...

### 2. **Font Icon Support** (Legacy, Not Recommended)
**Note**: Ant Design v3.9.0+ uses SVG icons exclusively. Font icons are deprecated.

```jsx
// Font icons (old approach - NOT recommended)
// Font icons required separate stylesheet and icon font files
// Limited support in modern Ant Design versions

// Modern approach: Use @ant-design/icons SVG package
import { HomeOutlined } from '@ant-design/icons';
<HomeOutlined />
```

### 3. **Custom Icon Library Integration**
**Method**: Pass custom SVG components via `component` prop

```jsx
// Import custom icons from another library
import { FaHome, FaSearch } from 'react-icons/fa';
import Icon from '@ant-design/icons';

// Wrap in Icon component
<Icon component={FaHome} />
<Icon component={FaSearch} />

// However, note: this may not align with Ant Design styling/sizing
// Custom SVG component pattern is preferred:
const CustomHome = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    {/* SVG path */}
  </svg>
);
<Icon component={CustomHome} />
```

---

## Custom Icons

### Method 1: Inline SVG Component (Recommended)
**Pros**: Full control, proper sizing, color inheritance
**Cons**: Verbose inline

```jsx
import Icon from '@ant-design/icons';

const CustomCheckIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

<Icon component={CustomCheckIcon} />
<Icon component={CustomCheckIcon} style={{ fontSize: '24px', color: 'green' }} />
```

### Method 2: External SVG File (With Loader)
**Pros**: Separate concerns, reusable
**Cons**: Requires build tooling (webpack with svg-react-loader)

```jsx
// Requires webpack configuration:
// loader: 'svg-react-loader'

import CustomIcon from './icons/custom-check.svg?react';
import Icon from '@ant-design/icons';

<Icon component={CustomIcon} />
```

### Method 3: Icon Font/Sprite Approach
**Pros**: Single HTTP request, traditional approach
**Cons**: Less flexible, deprecated in modern Ant Design

```jsx
// Create custom icon font (using iconfont.cn or similar)
// Then use Icon.createFromIconfontCN()

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/xxxx.js',
});

<MyIcon type="icon-smile" />
```

### Best Practice for Custom Icons

```jsx
// Create a custom icon library wrapper
import Icon from '@ant-design/icons';

// Define custom icons
const CustomLogoIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    {/* SVG content */}
  </svg>
);

// Export as Icon components
export const CustomLogo = (props) => (
  <Icon component={CustomLogoIcon} {...props} />
);

// Usage
<CustomLogo style={{ fontSize: '32px' }} />
<CustomLogo style={{ color: 'blue' }} />
```

---

## Accessibility

### 1. **Icon-Only Buttons**
**Accessibility Issue**: Icons without labels are ambiguous for screen readers
**Solution**: Add `title` prop or wrap in Tooltip

```jsx
import { Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

// Without accessibility (AVOID)
<Button icon={<DeleteOutlined />} />

// With title attribute
<Button
  icon={<DeleteOutlined />}
  title="Delete this item"
  aria-label="Delete item"
/>

// With Tooltip (RECOMMENDED)
<Tooltip title="Delete this item">
  <Button icon={<DeleteOutlined />} aria-label="Delete item" />
</Tooltip>
```

### 2. **ARIA Attributes**
```jsx
import { LoadingOutlined } from '@ant-design/icons';

// For loading indicators
<LoadingOutlined
  spin
  aria-label="Loading"
  role="status"
/>

// For interactive icons
<DeleteOutlined
  onClick={handleDelete}
  aria-label="Delete item"
  role="button"
  tabIndex={0}
/>
```

### 3. **Color Accessibility**
**Issue**: Don't rely on color alone to communicate meaning
**Solution**: Combine color with icons, text, or patterns

```jsx
// AVOID: Color-only indication
<CheckCircleOutlined style={{ color: 'green' }} />

// BETTER: Icon shape + color
<CheckCircleOutlined style={{ color: 'green' }} />

// BEST: Icon + text
<div>
  <CheckCircleOutlined style={{ color: 'green' }} />
  {' '}Success
</div>

// High contrast
<DeleteOutlined style={{ color: 'red' }} /> {/* Sufficient contrast */}
```

### 4. **Icon Text Alternatives**
```jsx
// Decorative icons (purely visual)
<span aria-hidden="true">
  <SpaceIcon />
</span>

// Semantic icons (meaningful)
<span aria-label="Favorites">
  <StarFilled style={{ color: 'gold' }} />
</span>

// Icon as content indicator
<span role="img" aria-label="Success">
  <CheckCircleOutlined style={{ color: 'green' }} />
</span>
```

---

## Interactive Patterns

### Pattern 1: Clickable Icon
**Use Case**: Icon as actionable element
**Implementation**: Add onClick handler and styling

```jsx
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

// Clickable icon with hover effect
<div
  onClick={handleClick}
  style={{
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
  <DeleteOutlined />
</div>

// Or use Icon button wrapper
<Button
  type="text"
  icon={<DeleteOutlined />}
  onClick={handleDelete}
/>
```

### Pattern 2: Icon State Toggle
**Use Case**: Icon changes based on state
**Implementation**: Conditional rendering

```jsx
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const [liked, setLiked] = useState(false);

<div
  onClick={() => setLiked(!liked)}
  style={{ cursor: 'pointer', fontSize: '24px' }}
>
  {liked ? (
    <HeartFilled style={{ color: 'red' }} />
  ) : (
    <HeartOutlined />
  )}
</div>
```

### Pattern 3: Icon with Dropdown/Menu
**Use Case**: Icon triggers menu or dropdown options
**Implementation**: Combine with Dropdown component

```jsx
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';

const menu = (
  <Menu>
    <Menu.Item key="1">Edit</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
);

<Dropdown overlay={menu}>
  <DownOutlined style={{ cursor: 'pointer' }} />
</Dropdown>
```

### Pattern 4: Icon Animation on Interaction
**Use Case**: Animated feedback for user interactions
**Implementation**: CSS animation combined with state

```jsx
import { SyncOutlined } from '@ant-design/icons';

const [rotating, setRotating] = useState(false);

<SyncOutlined
  onClick={async () => {
    setRotating(true);
    await fetchData();
    setRotating(false);
  }}
  style={{
    cursor: 'pointer',
    animation: rotating ? 'spin 1s linear infinite' : 'none'
  }}
/>
```

---

## Advanced Patterns

### Pattern 1: Icon with Badge
**Use Case**: Display notifications/counts on icons
**Implementation**: Combine with Badge component

```jsx
import { BellOutlined } from '@ant-design/icons';
import { Badge } from 'antd';

<Badge count={5}>
  <BellOutlined style={{ fontSize: '24px' }} />
</Badge>

// With offset for positioning
<Badge count={5} offset={[-5, 5]}>
  <BellOutlined style={{ fontSize: '24px' }} />
</Badge>
```

### Pattern 2: Icon Rotation for Direction
**Use Case**: Indicate direction or expand/collapse state
**Implementation**: Use `rotate` prop with state

```jsx
import { CaretDownOutlined } from '@ant-design/icons';

const [expanded, setExpanded] = useState(false);

<div
  onClick={() => setExpanded(!expanded)}
  style={{ cursor: 'pointer' }}
>
  <CaretDownOutlined
    rotate={expanded ? 180 : 0}
    style={{ transition: 'transform 0.3s' }}
  />
  {' '}Menu
</div>
```

### Pattern 3: Icon Morphing with Theme Switch
**Use Case**: Different icons for light/dark mode
**Implementation**: Conditional icon selection based on theme

```jsx
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { theme } from 'antd';

function ThemeToggle() {
  const { theme: currentTheme } = theme.useToken();

  return (
    <div onClick={toggleTheme} style={{ cursor: 'pointer' }}>
      {currentTheme === 'light' ? (
        <MoonOutlined />
      ) : (
        <SunOutlined />
      )}
    </div>
  );
}
```

### Pattern 4: Icon Skeleton Loader
**Use Case**: Placeholder icons during loading
**Implementation**: Show icon skeleton while content loads

```jsx
import { Skeleton } from 'antd';

function IconPlaceholder({ loading, icon }) {
  if (loading) {
    return <Skeleton.Avatar active size="large" />;
  }
  return icon;
}

<IconPlaceholder
  loading={isLoading}
  icon={<HomeOutlined style={{ fontSize: '32px' }} />}
/>
```

### Pattern 5: Icon Grid/Gallery
**Use Case**: Display multiple icons with hover effects
**Implementation**: Grid layout with interactive icons

```jsx
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';

const iconList = [
  'HomeOutlined',
  'UserOutlined',
  'SettingOutlined',
  'SearchOutlined'
];

<Space wrap>
  {iconList.map(name => {
    const IconComponent = Icons[name];
    return (
      <div
        key={name}
        style={{
          padding: '12px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <IconComponent style={{ fontSize: '24px' }} />
      </div>
    );
  })}
</Space>
```

---

## Important Notes

### Performance Considerations

1. **Tree-Shaking**: Only import icons you use
```jsx
// Good: Tree-shaking friendly
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

// Avoid: Imports entire icon library
import * as Icons from '@ant-design/icons';
```

2. **Icon Library Size**: @ant-design/icons adds ~100KB (gzipped) when using multiple icons
```jsx
// Monitor bundle size
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
```

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 support: Requires polyfills for SVG rendering
- Mobile browsers: Full SVG icon support

### Styling Considerations

1. **Color Inheritance**: Icons inherit `color` from parent by default
2. **Font-Size Scaling**: Use `em` units for responsive sizing
3. **Vertical Alignment**: Icons align with baseline using flexbox (no extra space)

### Common Pitfalls to Avoid

1. **Forgetting Accessibility**: Always provide labels for icon-only controls
2. **Inconsistent Sizing**: Mix of `px`, `em`, and percentage units
3. **Over-Styling**: Avoid overriding SVG viewBox or color inheritance
4. **Missing Semantics**: Use semantic HTML with icon support (buttons, links, etc.)

### Version Compatibility

- @ant-design/icons v5.x → antd v5.x (SVG icons, modern features)
- @ant-design/icons v4.x → antd v4.x (SVG icons, v4 features)
- @ant-design/icons v1-3 → antd v2-3 (deprecated, font icons)

---

## Code Examples Summary

### Complete Icon Component Patterns

```jsx
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Button, Space, Tooltip, Badge } from 'antd';

function IconShowcase() {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <Space direction="vertical" size="large">
      {/* Basic icons */}
      <div>
        <HomeOutlined />
        <UserOutlined style={{ marginLeft: '8px' }} />
        <SettingOutlined style={{ marginLeft: '8px' }} />
      </div>

      {/* Sized icons */}
      <div>
        <HomeOutlined style={{ fontSize: '16px' }} />
        <HomeOutlined style={{ fontSize: '24px' }} />
        <HomeOutlined style={{ fontSize: '32px' }} />
      </div>

      {/* Colored icons */}
      <div>
        <HomeOutlined style={{ color: 'blue' }} />
        <HomeOutlined style={{ color: 'red' }} />
        <HomeOutlined style={{ color: 'green' }} />
      </div>

      {/* Icons in buttons */}
      <Space>
        <Button type="primary" icon={<HomeOutlined />}>
          Home
        </Button>
        <Button icon={<UserOutlined />}>User</Button>
        <Button icon={<SettingOutlined />} />
      </Space>

      {/* Loading indicator */}
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        {loading && <LoadingOutlined spin />} Load Data
      </Button>

      {/* Interactive icons */}
      <div
        onClick={() => setLiked(!liked)}
        style={{ cursor: 'pointer', fontSize: '24px' }}
      >
        {liked ? '❤️' : '🤍'} {liked ? 'Liked' : 'Like'}
      </div>

      {/* Icons with tooltips */}
      <Space>
        <Tooltip title="Edit">
          <Button icon={<EditOutlined />} />
        </Tooltip>
        <Tooltip title="Delete">
          <Button icon={<DeleteOutlined />} danger />
        </Tooltip>
      </Space>

      {/* Icon with badge */}
      <Badge count={5}>
        <HomeOutlined style={{ fontSize: '24px' }} />
      </Badge>
    </Space>
  );
}

export default IconShowcase;
```

---

## Summary Table

| Feature | Support | Notes |
|---------|---------|-------|
| **Icon Library** | ✅ 1000+ icons | @ant-design/icons package, 3 themes |
| **Size Control** | ✅ Full | Font-size CSS property |
| **Rotation** | ✅ Full | `rotate` prop (v4.0+) |
| **Color** | ✅ Full | CSS color inheritance, `twoToneColor` for two-tone |
| **Spin Animation** | ✅ Full | `spin` prop for loading states |
| **Custom Icons** | ✅ Full | `component` prop for custom SVG |
| **Accessibility** | ⚠️ Partial | Requires manual ARIA/labels |
| **Theme Support** | ✅ Full | Outlined, Filled, Two-Tone themes |
| **Mobile Support** | ✅ Full | Full SVG support on all modern browsers |
| **TypeScript** | ✅ Full | Complete type definitions |
| **Styling** | ✅ Full | className, style props |
| **Composition** | ✅ Full | Works in buttons, inputs, navigation |


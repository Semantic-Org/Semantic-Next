# Mantine Icon - Usage Patterns

**Research Date**: 2025-11-05
**Framework**: Mantine
**Source**: https://mantine.dev/core/icon/
**Version**: Mantine 7.x

---

## Component Overview

The Mantine Icon component is a lightweight, SVG-based icon wrapper that provides a minimal abstraction over SVG icons. Unlike component libraries that include comprehensive icon sets, Mantine takes a flexible approach: the Icon component itself is unopinionated about which icons you use, while Mantine provides integration with **Tabler Icons** as the recommended icon library.

**Core Philosophy**:
- Minimal wrapper around SVG icons
- Works with any SVG icon library
- Built-in Tabler Icons integration (via `@tabler/icons-react`)
- Direct SVG element support
- Flexible sizing and styling

**Use Cases**:
- Displaying SVG icons in UI components
- Creating button icons
- Status indicators with custom icons
- Navigation icons
- Form field icons
- Decorative icons
- Custom SVG-based iconography

---

## Basic Usage

### Minimal Icon Component

```jsx
import { Icon } from '@mantine/core';
import { IconHeart, IconSearch } from '@tabler/icons-react';

// Using Tabler Icons
<Icon>
  <IconHeart />
</Icon>

// Using inline SVG
<Icon>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 12h18M12 3v18" />
  </svg>
</Icon>
```

### With Tabler Icons

```jsx
import { Icon } from '@mantine/core';
import {
  IconHeart,
  IconSearch,
  IconSettings,
  IconUser,
  IconCheck,
  IconX
} from '@tabler/icons-react';

// Icon only
<Icon><IconHeart /></Icon>

// In a Button
<Button leftSection={<Icon><IconSearch /></Icon>}>
  Search
</Button>

// In a component
<TextInput
  leftSection={<Icon><IconSearch /></Icon>}
  placeholder="Search..."
/>

// Multiple sizes
<Icon size={16}><IconHeart /></Icon>
<Icon size={24}><IconHeart /></Icon>
<Icon size={32}><IconHeart /></Icon>
```

---

## Props/API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | SVG element or icon component (required) |
| `size` | `number \| string` | - | Icon dimensions (width and height) |
| `color` | `string` | `'currentColor'` | CSS color value |
| `stroke` | `number` | `1.5` | SVG stroke width |
| `style` | `CSSProperties` | - | Inline CSS styles |
| `className` | `string` | - | CSS class name |

### Color System Props

```jsx
// Named theme colors
<Icon color="blue">...</Icon>
<Icon color="red">...</Icon>
<Icon color="green">...</Icon>
<Icon color="yellow">...</Icon>
<Icon color="cyan">...</Icon>
<Icon color="magenta">...</Icon>
<Icon color="white">...</Icon>
<Icon color="black">...</Icon>
<Icon color="gray">...</Icon>

// Semantic colors
<Icon color="dimmed">...</Icon>        // Gray.6
<Icon color="text">...</Icon>          // Text color
<Icon color="dark">...</Icon>          // Dark theme text

// Custom color
<Icon color="rgba(255, 0, 0, 0.5)">...</Icon>
<Icon color="#ff6b6b">...</Icon>
```

### Size Options

```jsx
// Numeric sizes (in pixels)
<Icon size={16}>...</Icon>   // 16px
<Icon size={20}>...</Icon>   // 20px
<Icon size={24}>...</Icon>   // 24px
<Icon size={32}>...</Icon>   // 32px
<Icon size={48}>...</Icon>   // 48px

// String sizes with rem
<Icon size="xs">...</Icon>    // 0.75rem (12px)
<Icon size="sm">...</Icon>    // 1rem (16px)
<Icon size="md">...</Icon>    // 1.25rem (20px)
<Icon size="lg">...</Icon>    // 1.75rem (28px)
<Icon size="xl">...</Icon>    // 2rem (32px)

// Flexible CSS values
<Icon size="100%">...</Icon>  // Fills parent
<Icon size="2em">...</Icon>   // Relative to font-size
```

### Stroke Width Control

```jsx
// Default stroke (1.5px)
<Icon><IconHeart /></Icon>

// Thinner stroke (lighter appearance)
<Icon stroke={1}><IconHeart /></Icon>
<Icon stroke={1.2}><IconHeart /></Icon>

// Thicker stroke (bolder appearance)
<Icon stroke={2}><IconHeart /></Icon>
<Icon stroke={2.5}><IconHeart /></Icon>
<Icon stroke={3}><IconHeart /></Icon>

// Combined with size
<Icon size={24} stroke={1.5}><IconHeart /></Icon>
```

---

## Common Patterns

### Pattern 1: Icon Buttons

```jsx
import { Icon, Button, ActionIcon } from '@mantine/core';
import { IconHeart, IconTrash, IconEdit, IconDownload } from '@tabler/icons-react';

// With Button component
<Button
  leftSection={<Icon><IconDownload /></Icon>}
>
  Download
</Button>

// With ActionIcon (icon-only button)
<ActionIcon>
  <Icon><IconHeart /></Icon>
</ActionIcon>

// Icon button with variant
<ActionIcon variant="light" color="red">
  <Icon><IconTrash /></Icon>
</ActionIcon>

// Icon button with size
<ActionIcon size="lg">
  <Icon><IconEdit /></Icon>
</ActionIcon>
```

### Pattern 2: Form Field Icons

```jsx
import { Icon, TextInput, Select, PasswordInput } from '@mantine/core';
import { IconSearch, IconMail, IconLock } from '@tabler/icons-react';

// Search input
<TextInput
  placeholder="Search..."
  leftSection={<Icon><IconSearch /></Icon>}
/>

// Email input
<TextInput
  type="email"
  placeholder="you@example.com"
  leftSection={<Icon color="gray"><IconMail /></Icon>}
/>

// Password input
<PasswordInput
  placeholder="Enter password"
  leftSection={<Icon><IconLock /></Icon>}
/>

// Right section icon (action icon)
<TextInput
  placeholder="Type and clear"
  rightSection={<Icon><IconX /></Icon>}
/>

// Select with icon
<Select
  placeholder="Choose language"
  leftSection={<Icon><IconWorld /></Icon>}
  data={['JavaScript', 'TypeScript', 'Python']}
/>
```

### Pattern 3: Status and State Indicators

```jsx
import { Icon, Badge, Group } from '@mantine/core';
import {
  IconCheck,
  IconAlertCircle,
  IconX,
  IconClock
} from '@tabler/icons-react';

// Success status
<Badge
  leftSection={<Icon><IconCheck /></Icon>}
  color="green"
>
  Completed
</Badge>

// Error status
<Badge
  leftSection={<Icon><IconX /></Icon>}
  color="red"
>
  Failed
</Badge>

// Warning status
<Badge
  leftSection={<Icon><IconAlertCircle /></Icon>}
  color="yellow"
>
  Warning
</Badge>

// Pending status
<Badge
  leftSection={<Icon><IconClock /></Icon>}
  color="gray"
>
  Pending
</Badge>

// In conditional rendering
{loading && <Icon><IconLoader /></Icon>}
{success && <Icon color="green"><IconCheck /></Icon>}
{error && <Icon color="red"><IconX /></Icon>}
```

### Pattern 4: Navigation Icons

```jsx
import { Icon, NavLink, Stack } from '@mantine/core';
import {
  IconHome,
  IconSettings,
  IconUsers,
  IconBook
} from '@tabler/icons-react';

// Navigation menu
<Stack>
  <NavLink
    label="Home"
    leftSection={<Icon><IconHome /></Icon>}
  />
  <NavLink
    label="Settings"
    leftSection={<Icon><IconSettings /></Icon>}
  />
  <NavLink
    label="Users"
    leftSection={<Icon><IconUsers /></Icon>}
  />
  <NavLink
    label="Documentation"
    leftSection={<Icon><IconBook /></Icon>}
  />
</Stack>
```

### Pattern 5: Decorative Icons

```jsx
import { Icon, Center, Stack, Text } from '@mantine/core';
import {
  IconStar,
  IconHeartHandshake,
  IconRocket,
  IconSparkles
} from '@tabler/icons-react';

// Empty state illustration
<Stack align="center">
  <Icon size={80} stroke={1.5} color="gray">
    <IconSparkles />
  </Icon>
  <Text>No items found</Text>
</Stack>

// Feature highlights
<Center>
  <Icon size={48} color="blue">
    <IconRocket />
  </Icon>
</Center>
<Text>Launch your project</Text>

// Testimonial rating
<Group>
  <Icon color="yellow"><IconStar /></Icon>
  <Icon color="yellow"><IconStar /></Icon>
  <Icon color="yellow"><IconStar /></Icon>
  <Icon color="yellow"><IconStar /></Icon>
  <Icon color="yellow"><IconStar /></Icon>
</Group>
```

### Pattern 6: Icon Sizing Scales

```jsx
import { Icon, Group } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

// Standard scale
<Group>
  <Icon size="xs"><IconHeart /></Icon>   {/* 12px */}
  <Icon size="sm"><IconHeart /></Icon>   {/* 16px */}
  <Icon size="md"><IconHeart /></Icon>   {/* 20px */}
  <Icon size="lg"><IconHeart /></Icon>   {/* 28px */}
  <Icon size="xl"><IconHeart /></Icon>   {/* 32px */}
</Group>

// Numeric pixels
<Group>
  <Icon size={12}><IconHeart /></Icon>
  <Icon size={16}><IconHeart /></Icon>
  <Icon size={20}><IconHeart /></Icon>
  <Icon size={24}><IconHeart /></Icon>
  <Icon size={32}><IconHeart /></Icon>
  <Icon size={48}><IconHeart /></Icon>
  <Icon size={64}><IconHeart /></Icon>
</Group>

// Responsive sizing (with styled component)
<Icon size={{ base: 24, sm: 32, md: 40 }}>
  <IconHeart />
</Icon>
```

### Pattern 7: Color Variations

```jsx
import { Icon, Group } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

// Theme colors
<Group>
  <Icon color="red"><IconHeart /></Icon>
  <Icon color="pink"><IconHeart /></Icon>
  <Icon color="grape"><IconHeart /></Icon>
  <Icon color="violet"><IconHeart /></Icon>
  <Icon color="indigo"><IconHeart /></Icon>
  <Icon color="blue"><IconHeart /></Icon>
  <Icon color="cyan"><IconHeart /></Icon>
  <Icon color="teal"><IconHeart /></Icon>
  <Icon color="green"><IconHeart /></Icon>
  <Icon color="lime"><IconHeart /></Icon>
  <Icon color="yellow"><IconHeart /></Icon>
  <Icon color="orange"><IconHeart /></Icon>
</Group>

// Semantic colors
<Group>
  <Icon color="text"><IconHeart /></Icon>         {/* Text color */}
  <Icon color="dimmed"><IconHeart /></Icon>       {/* Dimmed text */}
  <Icon color="white"><IconHeart /></Icon>        {/* White */}
  <Icon color="black"><IconHeart /></Icon>        {/* Black */}
  <Icon color="gray"><IconHeart /></Icon>         {/* Gray */}
</Group>

// Hex colors
<Group>
  <Icon color="#ff6b6b"><IconHeart /></Icon>
  <Icon color="#4ecdc4"><IconHeart /></Icon>
  <Icon color="#ffe66d"><IconHeart /></Icon>
</Group>

// RGBA colors
<Group>
  <Icon color="rgba(255, 0, 0, 0.5)"><IconHeart /></Icon>
  <Icon color="rgba(0, 0, 255, 0.7)"><IconHeart /></Icon>
</Group>
```

### Pattern 8: Stroke Width Variations

```jsx
import { Icon, Group } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

// Light icons (thin stroke)
<Group>
  <Icon size={24} stroke={1}><IconSearch /></Icon>
  <Icon size={24} stroke={1.2}><IconSearch /></Icon>
</Group>

// Medium icons (default stroke)
<Group>
  <Icon size={24} stroke={1.5}><IconSearch /></Icon>  {/* Default */}
  <Icon size={24} stroke={2}><IconSearch /></Icon>
</Group>

// Bold icons (thick stroke)
<Group>
  <Icon size={24} stroke={2.5}><IconSearch /></Icon>
  <Icon size={24} stroke={3}><IconSearch /></Icon>
</Group>

// Icon weight system for design consistency
const iconWeights = {
  light: 1,
  normal: 1.5,
  bold: 2.5
};

<Icon size={24} stroke={iconWeights.bold}>
  <IconSearch />
</Icon>
```

---

## Visual Variations

### Stroke Styles

```jsx
import { Icon } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

// Filled appearance (thick stroke + large size)
<Icon size={32} stroke={2.5}><IconHeart /></Icon>

// Outlined appearance (medium stroke)
<Icon size={24} stroke={1.5}><IconHeart /></Icon>

// Thin/light appearance (thin stroke)
<Icon size={24} stroke={1}><IconHeart /></Icon>
```

### Opacity and Transparency

```jsx
import { Icon } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

// Semi-transparent (dimmed)
<Icon style={{ opacity: 0.5 }}><IconStar /></Icon>

// Disabled appearance
<Icon color="gray" style={{ opacity: 0.6 }}><IconStar /></Icon>

// Subtle background
<Icon color="blue" style={{ opacity: 0.7 }}><IconStar /></Icon>
```

### Rotation and Transforms

```jsx
import { Icon } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

// Rotated icons
<Icon style={{ transform: 'rotate(45deg)' }}>
  <IconArrowRight />
</Icon>

<Icon style={{ transform: 'rotate(90deg)' }}>
  <IconArrowRight />
</Icon>

<Icon style={{ transform: 'rotate(180deg)' }}>
  <IconArrowRight />
</Icon>

// Flipped icons
<Icon style={{ transform: 'scaleX(-1)' }}>
  <IconArrowRight />
</Icon>

<Icon style={{ transform: 'scaleY(-1)' }}>
  <IconArrowRight />
</Icon>
```

### Animations

```jsx
import { Icon } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { keyframes } from '@mantine/core';

// Spinning loader
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

<Icon
  size={24}
  style={{
    animation: `${spin} 1s linear infinite`
  }}
>
  <IconLoader />
</Icon>

// Pulse animation
const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 }
});

<Icon
  style={{
    animation: `${pulse} 2s ease-in-out infinite`
  }}
>
  <IconHeart />
</Icon>

// Bounce animation
const bounce = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-8px)' }
});

<Icon
  style={{
    animation: `${bounce} 2s ease-in-out infinite`
  }}
>
  <IconArrowUp />
</Icon>
```

---

## Size Patterns

### String Sizes (Mantine Breakpoints)

```jsx
import { Icon, Group } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

// Named sizes (based on Mantine spacing scale)
<Group>
  <Icon size="xs"><IconStar /></Icon>    {/* 0.75rem / 12px */}
  <Icon size="sm"><IconStar /></Icon>    {/* 1rem / 16px */}
  <Icon size="md"><IconStar /></Icon>    {/* 1.25rem / 20px */}
  <Icon size="lg"><IconStar /></Icon>    {/* 1.75rem / 28px */}
  <Icon size="xl"><IconStar /></Icon>    {/* 2rem / 32px */}
</Group>
```

### Numeric Sizes (Pixels)

```jsx
import { Icon } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

// Direct pixel values
<Icon size={16}><IconHeart /></Icon>
<Icon size={20}><IconHeart /></Icon>
<Icon size={24}><IconHeart /></Icon>
<Icon size={32}><IconHeart /></Icon>
<Icon size={48}><IconHeart /></Icon>
<Icon size={64}><IconHeart /></Icon>
```

### Responsive Sizes

```jsx
import { Icon } from '@mantine/core';
import { IconSmartphone } from '@tabler/icons-react';
import styled from '@emotion/styled';

// Using styled component for responsive sizing
const ResponsiveIcon = styled(Icon)`
  @media (max-width: 768px) {
    font-size: 20px;
  }
  @media (min-width: 769px) {
    font-size: 32px;
  }
`;

<ResponsiveIcon><IconSmartphone /></ResponsiveIcon>

// Or using container queries
<Icon
  size={{ base: 20, sm: 24, md: 32, lg: 40, xl: 48 }}
>
  <IconSmartphone />
</Icon>
```

### Size Recommendations by Use Case

```jsx
import { Icon, Group } from '@mantine/core';
import {
  IconSearch,
  IconHome,
  IconSettings,
  IconAlert,
  IconHeart
} from '@tabler/icons-react';

// Inline icons in text (small)
<Icon size="sm"><IconSearch /></Icon>  {/* 16px */}

// Button icons (medium)
<Icon size="md"><IconHome /></Icon>    {/* 20px */}

// Navigation icons (medium-large)
<Icon size={24}><IconSettings /></Icon>

// Status/alert icons (medium)
<Icon size={20}><IconAlert /></Icon>

// Standalone icons/decorations (large)
<Icon size={48}><IconHeart /></Icon>

// Hero section icons (extra large)
<Icon size={80}><IconHeart /></Icon>
```

---

## Color/Theming

### Theme Color Integration

```jsx
import { Icon, MantineProvider, createTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

const theme = createTheme({
  colors: {
    custom: [
      '#f0f0f0',
      '#e0e0e0',
      '#d0d0d0',
      '#b0b0b0',
      '#808080',
      '#606060',
      '#404040',
      '#202020',
      '#101010',
      '#000000'
    ]
  }
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Icon color="custom.5"><IconHeart /></Icon>
    </MantineProvider>
  );
}
```

### Contextual Colors

```jsx
import { Icon, Group } from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconInfo,
  IconX
} from '@tabler/icons-react';

// Status colors
<Group>
  <Icon color="green"><IconCheck /></Icon>      {/* Success */}
  <Icon color="red"><IconX /></Icon>            {/* Error */}
  <Icon color="yellow"><IconAlertCircle /></Icon> {/* Warning */}
  <Icon color="blue"><IconInfo /></Icon>        {/* Info */}
</Group>
```

### Dark Mode Support

```jsx
import { Icon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

function ThemeToggle() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Icon color={colorScheme === 'dark' ? 'yellow' : 'gray'}>
      {colorScheme === 'dark' ? <IconMoon /> : <IconSun />}
    </Icon>
  );
}

// Or with CSS custom properties
<Icon style={{ color: 'var(--mantine-color-text)' }}>
  <IconHeart />
</Icon>
```

### Custom Color Patterns

```jsx
import { Icon } from '@mantine/core';
import { IconGradient } from '@tabler/icons-react';

// Using CSS variables
<Icon style={{ color: 'var(--mantine-color-blue-6)' }}>
  <IconGradient />
</Icon>

// Using Mantine color function
import { useMantineTheme } from '@mantine/core';

function CustomColorIcon() {
  const theme = useMantineTheme();
  return (
    <Icon color={theme.colors.violet[6]}>
      <IconGradient />
    </Icon>
  );
}
```

---

## Icon Libraries

### Tabler Icons (Recommended)

Mantine officially recommends **Tabler Icons** as the primary icon library.

**Installation:**
```bash
npm install @tabler/icons-react
```

**Features:**
- 4,500+ icons
- Consistent design language
- Customizable stroke width
- Regular, filled, and brand variants
- SVG-based (scalable, crisp at any size)

**Usage:**
```jsx
import {
  IconHeart,
  IconSearch,
  IconSettings,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconExternalLink
} from '@tabler/icons-react';

<Icon><IconHeart /></Icon>
<Icon><IconSearch /></Icon>
<Icon><IconSettings /></Icon>
```

**Icon Categories:**
- **Basic**: Heart, Star, Circle, Square, Triangle
- **Navigation**: ChevronRight, ChevronDown, ArrowUp, ArrowRight
- **Social**: BrandGithub, BrandTwitter, BrandLinkedin, BrandFacebook
- **Communication**: Mail, MessageCircle, Phone, Bell
- **Media**: Image, Video, Music, Camera
- **UI**: Menu, X, Plus, Minus, Check
- **Business**: Briefcase, Building, TrendingUp, Cash
- **Travel**: Map, MapPin, Compass, Navigation
- **Weather**: Cloud, CloudRain, Sun, Moon
- **And many more...**

### Alternative Icon Libraries

While Tabler Icons is recommended, Icon component works with any SVG icon library:

```jsx
import { Icon } from '@mantine/core';

// React Icons
import { FiHeart, FiSearch } from 'react-icons/fi';

<Icon><FiHeart /></Icon>
<Icon><FiSearch /></Icon>

// Heroicons
import { HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

<Icon><HeartIcon /></Icon>
<Icon><MagnifyingGlassIcon /></Icon>

// Material Design Icons
import SearchIcon from '@mui/icons-material/Search';

<Icon><SearchIcon /></Icon>

// Font Awesome (with react-fontawesome)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';

<Icon><FontAwesomeIcon icon={faHeart} /></Icon>
<Icon><FontAwesomeIcon icon={faSearch} /></Icon>
```

---

## Custom Icons

### Inline SVG Icons

```jsx
import { Icon } from '@mantine/core';

// Simple custom SVG
<Icon>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 12h18M12 3v18" strokeLinecap="round" />
  </svg>
</Icon>

// Custom icon with fill
<Icon>
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
</Icon>

// Complex custom SVG
<Icon size={24}>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
</Icon>
```

### Creating Custom Icon Components

```jsx
import { Icon } from '@mantine/core';

// Reusable custom icon component
function CustomHeartIcon({ size = 24, color = 'currentColor' }) {
  return (
    <Icon size={size} color={color}>
      <svg viewBox="0 0 24 24" fill={color}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </Icon>
  );
}

// Usage
<CustomHeartIcon size={32} color="red" />

// Creating icon factory
const createIcon = (svgPath, displayName) => {
  function CustomIcon({ size = 24, color = 'currentColor', ...props }) {
    return (
      <Icon size={size} color={color} {...props}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d={svgPath} />
        </svg>
      </Icon>
    );
  }
  CustomIcon.displayName = displayName;
  return CustomIcon;
};

const RocketIcon = createIcon('M12 2v20M2 12h20', 'RocketIcon');
<RocketIcon size={32} />
```

### Animated Custom Icons

```jsx
import { Icon } from '@mantine/core';
import { keyframes } from '@emotion/react';

function AnimatedIcon() {
  const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  return (
    <Icon size={24} style={{ animation: `${rotate} 2s linear infinite` }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    </Icon>
  );
}
```

---

## Accessibility

### ARIA Labels for Icons

```jsx
import { Icon } from '@mantine/core';
import { IconHeart, IconSearch, IconTrash } from '@tabler/icons-react';

// Icon-only button with label
<button aria-label="Add to favorites">
  <Icon><IconHeart /></Icon>
</button>

// Search icon with label
<input
  aria-label="Search products"
  placeholder="Search..."
/>
<Icon title="Search"><IconSearch /></Icon>

// Delete action with label
<button aria-label="Delete item">
  <Icon><IconTrash /></Icon>
</button>
```

### Decorative Icons

```jsx
import { Icon } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

// When icon has accompanying text, mark as decorative
<div>
  <Icon aria-hidden="true"><IconStar /></Icon>
  <span>Featured</span>
</div>

// Without aria-hidden (icon has no label)
<div>
  <Icon><IconStar /></Icon>
  {/* This is poor accessibility - no context */}
</div>
```

### Semantic HTML with Icons

```jsx
import { Icon, Badge, Group } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

// Status indicator with semantic meaning
<Badge
  leftSection={<Icon><IconCheck /></Icon>}
  color="green"
  role="status"
  aria-label="Status: Approved"
>
  Approved
</Badge>

// Error notification
<div role="alert" aria-live="polite">
  <Icon color="red"><IconAlertCircle /></Icon>
  <span>An error occurred</span>
</div>
```

### Color Contrast Accessibility

```jsx
import { Icon } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

// Ensure sufficient contrast
// White icon on light background - WCAG AA violation
<Icon color="white" style={{ background: 'lightgray' }}>
  <IconHeart />
</Icon>

// Dark icon on light background - WCAG AA compliant
<Icon color="black" style={{ background: 'white' }}>
  <IconHeart />
</Icon>

// High contrast colors
<Icon color="red"><IconHeart /></Icon>      {/* Good contrast */}
<Icon color="darkgray"><IconHeart /></Icon> {/* Acceptable */}
```

---

## Interactive Patterns

### Clickable Icons

```jsx
import { Icon, ActionIcon } from '@mantine/core';
import { IconHeart, IconShare } from '@tabler/icons-react';

// As ActionIcon (proper button semantics)
<ActionIcon onClick={() => console.log('Liked!')}>
  <Icon><IconHeart /></Icon>
</ActionIcon>

// In a button
<button onClick={() => handleLike()}>
  <Icon><IconHeart /></Icon>
  Like
</button>

// With hover effects
<button
  onClick={() => handleShare()}
  style={{ transition: 'transform 0.2s' }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
>
  <Icon><IconShare /></Icon>
</button>
```

### Icon Toggle States

```jsx
import { Icon, ActionIcon } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useState } from 'react';

function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <ActionIcon
      onClick={() => setLiked(!liked)}
      color={liked ? 'red' : 'gray'}
    >
      <Icon>
        {liked ? <IconHeartFilled /> : <IconHeart />}
      </Icon>
    </ActionIcon>
  );
}
```

### Icon Loading States

```jsx
import { Icon, Button } from '@mantine/core';
import { IconDownload, IconLoader } from '@tabler/icons-react';
import { useState } from 'react';
import { keyframes } from '@emotion/react';

function DownloadButton() {
  const [loading, setLoading] = useState(false);

  const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  return (
    <Button
      leftSection={
        <Icon
          style={loading ? { animation: `${spin} 1s linear infinite` } : {}}
        >
          {loading ? <IconLoader /> : <IconDownload />}
        </Icon>
      }
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      }}
      disabled={loading}
    >
      {loading ? 'Downloading...' : 'Download'}
    </Button>
  );
}
```

### Icon with Tooltip

```jsx
import { Icon, ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle, IconHelp } from '@tabler/icons-react';

// Icon with tooltip
<Tooltip label="Click for more information">
  <ActionIcon>
    <Icon><IconInfoCircle /></Icon>
  </ActionIcon>
</Tooltip>

// Help icon with hover tooltip
<Tooltip label="Enter your email address" position="right">
  <Icon color="blue"><IconHelp /></Icon>
</Tooltip>
```

### Icon Feedback/Hover Effects

```jsx
import { Icon, Group } from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { useState } from 'react';

function RatingStars() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <Group>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          color={star <= (hover || rating) ? 'yellow' : 'gray'}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(star)}
        >
          {star <= (hover || rating) ? <IconStarFilled /> : <IconStar />}
        </Icon>
      ))}
    </Group>
  );
}
```

---

## Advanced Patterns

### Icon System with Props

```jsx
import { Icon, Group } from '@mantine/core';
import {
  IconHeart,
  IconSearch,
  IconSettings,
  IconUser
} from '@tabler/icons-react';

// Icon system configuration
const iconConfig = {
  xs: { size: 12, stroke: 1 },
  sm: { size: 16, stroke: 1.2 },
  md: { size: 20, stroke: 1.5 },
  lg: { size: 28, stroke: 1.75 },
  xl: { size: 32, stroke: 2 }
};

// Icon component wrapper
function SystemIcon({ name, size = 'md', color, ...props }) {
  const IconComponent = {
    heart: IconHeart,
    search: IconSearch,
    settings: IconSettings,
    user: IconUser
  }[name];

  const config = iconConfig[size];

  return (
    <Icon
      size={config.size}
      stroke={config.stroke}
      color={color}
      {...props}
    >
      <IconComponent />
    </Icon>
  );
}

// Usage
<SystemIcon name="heart" size="lg" color="red" />
<SystemIcon name="search" size="md" color="gray" />
```

### Dynamic Icon Mapping

```jsx
import { Icon } from '@mantine/core';
import {
  IconHome,
  IconSettings,
  IconUsers,
  IconBell,
  IconLogout
} from '@tabler/icons-react';

const iconMap = {
  home: IconHome,
  settings: IconSettings,
  users: IconUsers,
  notifications: IconBell,
  logout: IconLogout
};

// Generic icon renderer
function DynamicIcon({ name, size = 24, color = 'currentColor' }) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <Icon size={size} color={color}>
      <IconComponent />
    </Icon>
  );
}

// Usage
<DynamicIcon name="home" size={24} color="blue" />
<DynamicIcon name="settings" size={20} color="gray" />
```

### Icon with Badge Overlay

```jsx
import { Icon, Badge, Group, ThemeIcon } from '@mantine/core';
import {
  IconBell,
  IconMail,
  IconMessageCircle
} from '@tabler/icons-react';

// Icon with notification badge
function NotificationIcon({ count, color = 'red' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Icon size={24}><IconBell /></Icon>
      {count > 0 && (
        <Badge
          color={color}
          size="xs"
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            minWidth: 20,
            height: 20,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {count}
        </Badge>
      )}
    </div>
  );
}

// Usage
<NotificationIcon count={5} />
<NotificationIcon count={0} />
```

### Conditional Icon Rendering

```jsx
import { Icon, Group } from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle
} from '@tabler/icons-react';

function StatusIcon({ status }) {
  const statusIconMap = {
    success: { icon: IconCheck, color: 'green' },
    error: { icon: IconX, color: 'red' },
    pending: { icon: IconClock, color: 'yellow' },
    warning: { icon: IconAlertCircle, color: 'orange' }
  };

  const { icon: IconComponent, color } = statusIconMap[status] || {};

  return IconComponent ? (
    <Icon color={color} size={20}>
      <IconComponent />
    </Icon>
  ) : null;
}

// Usage
<StatusIcon status="success" />
<StatusIcon status="error" />
<StatusIcon status="pending" />
```

---

## Notes

### Key Characteristics

1. **Minimalist Design Philosophy**: The Icon component is deliberately minimal - it's just a wrapper around SVG elements. This philosophy contrasts with frameworks like Material-UI that bundle comprehensive icon sets.

2. **Tabler Icons Integration**: Mantine officially recommends Tabler Icons (`@tabler/icons-react`) as the primary icon library. With 4,500+ icons and consistent design, it covers most use cases.

3. **Stroke Width Control**: Unlike many icon libraries, Tabler Icons (used with Mantine's Icon component) provides fine-grained stroke width control. This is valuable for creating visual hierarchies (light, normal, bold).

4. **Size Flexibility**: Mantine's Icon component accepts both named sizes (xs, sm, md, lg, xl) and numeric pixel values, providing maximum flexibility.

5. **Color System Integration**: Icons automatically respect Mantine's theme color system, making theming consistent across components.

6. **Composable by Default**: The composition pattern (Icon wrapping SVG) is enforced, encouraging better component architecture.

7. **No Built-in Icon Set**: Unlike Material-UI or Chakra UI which include icon libraries, Mantine requires explicit icon library installation. This keeps bundle size lean for projects that don't need icons.

### Design Patterns Unique to Mantine

1. **Stroke-based Icons**: Emphasis on customizable stroke width rather than filled/outlined variants
2. **Minimal Component**: Single Icon component that wraps SVG, not separate variants
3. **SVG-first Approach**: No icon fonts, no image sprites - pure SVG scaling
4. **Recommendation-based**: Official recommendation for Tabler Icons rather than bundled set

### Performance Considerations

1. **SVG Icons**: Scale perfectly at any size, crisp on all devices
2. **No Icon Font**: Avoids FOUT (Flash of Unstyled Text) issues
3. **Tree-shakeable**: With proper bundling, unused icons don't increase bundle size
4. **Lightweight Component**: Icon wrapper itself is minimal (~1KB gzipped)

### Accessibility Notes

1. **ARIA Labels Required**: Icon-only buttons need aria-label or aria-labelledby
2. **Decorative Icons**: Use aria-hidden="true" for icons that accompany text
3. **Color Not Sole Indicator**: Never use color alone for meaningful information
4. **Focus Management**: ActionIcon automatically handles focus styling
5. **Screen Reader Testing**: Tabler Icons are SVG-based and screen reader compatible

### Common Pitfalls

1. **Missing Labels**: Icons without accompanying text need aria-labels
2. **Color Contrast**: Ensure sufficient contrast between icon and background
3. **Inconsistent Sizes**: Use the size system (xs/sm/md/lg/xl) for visual consistency
4. **Hardcoded Colors**: Use Mantine theme colors for consistent theming
5. **No Fallbacks**: Custom icons should have proper SVG structure

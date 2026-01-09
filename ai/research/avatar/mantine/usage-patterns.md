# Mantine - Avatar Component

## Component Overview

The Mantine Avatar is a visual component that displays user profile images, automatically generated initials, or fallback icons. It provides a consistent way to represent users, accounts, or entities throughout an application with flexible customization options for size, color, and appearance.

**Common Use Cases:**
- User profile pictures in navigation headers and user menus
- Author avatars in comments, posts, and activity feeds
- Team member lists and contact directories
- Chat application user identifiers
- Visual representation of accounts or entities when images aren't available
- Grouped avatar displays showing multiple users (Avatar.Group)

---

## Usage Patterns

### Basic Usage

The simplest avatar implementation displays an image with an alt text for accessibility:

```jsx
import { Avatar } from '@mantine/core';

export function BasicAvatar() {
  return (
    <Avatar
      src="https://example.com/user-photo.jpg"
      alt="John Doe"
    />
  );
}
```

When no image is provided, the avatar displays a default placeholder icon:

```jsx
<Avatar alt="User placeholder" />
```

---

### Initials Display

One of Mantine's most powerful features is automatic initials generation from names:

#### Auto-Generated Initials

```jsx
// Automatically extracts "JD" from name
<Avatar name="John Doe" alt="John Doe" />

// Extracts "AS" from name
<Avatar name="Alice Smith" alt="Alice Smith" />

// Works with single names - extracts "J"
<Avatar name="John" alt="John" />
```

#### Initials with Color Generation

Using `color="initials"` generates consistent colors based on name hashing:

```jsx
// Same name always produces same color
<Avatar name="John Doe" color="initials" alt="John Doe" />
<Avatar name="Alice Smith" color="initials" alt="Alice Smith" />

// Color is deterministic - "John Doe" will always get the same color
<Avatar name="John Doe" color="initials" alt="John Doe" />
```

#### Restricting Color Palette

Control which colors can be used for initials:

```jsx
// Only use specific brand colors
<Avatar
  name="John Doe"
  color="initials"
  allowedInitialsColors={['blue', 'red', 'green', 'purple']}
  alt="John Doe"
/>
```

---

### Avatar.Group Component

Display multiple avatars in a stacked, overlapping layout:

#### Basic Group

```jsx
import { Avatar } from '@mantine/core';

export function AvatarGroup() {
  return (
    <Avatar.Group spacing="md">
      <Avatar src="user1.jpg" alt="User 1" />
      <Avatar src="user2.jpg" alt="User 2" />
      <Avatar src="user3.jpg" alt="User 3" />
    </Avatar.Group>
  );
}
```

#### With Spacing Control

```jsx
// Tight overlap
<Avatar.Group spacing="xs">
  <Avatar name="John Doe" alt="John Doe" />
  <Avatar name="Jane Smith" alt="Jane Smith" />
  <Avatar name="Bob Jones" alt="Bob Jones" />
</Avatar.Group>

// Loose overlap
<Avatar.Group spacing="lg">
  <Avatar name="John Doe" alt="John Doe" />
  <Avatar name="Jane Smith" alt="Jane Smith" />
</Avatar.Group>
```

#### With Overflow Indicator

Show "+N" indicator for additional users:

```jsx
<Avatar.Group spacing="sm">
  <Avatar src="user1.jpg" alt="User 1" />
  <Avatar src="user2.jpg" alt="User 2" />
  <Avatar src="user3.jpg" alt="User 3" />
  <Avatar>+5</Avatar>
</Avatar.Group>
```

#### With Tooltips

Combine with Tooltip for enhanced UX:

```jsx
import { Avatar, Tooltip } from '@mantine/core';

export function AvatarGroupWithTooltips() {
  const users = [
    { name: 'John Doe', image: 'user1.jpg' },
    { name: 'Jane Smith', image: 'user2.jpg' },
    { name: 'Bob Jones', image: 'user3.jpg' },
  ];

  return (
    <Avatar.Group spacing="sm">
      {users.map((user) => (
        <Tooltip key={user.name} label={user.name}>
          <Avatar src={user.image} alt={user.name} />
        </Tooltip>
      ))}
    </Avatar.Group>
  );
}
```

**Important:** Avatar.Group children must be direct Avatar components. Wrapping avatars in other elements (like divs) will break the layout.

---

### Variants/Styles

Mantine Avatar supports multiple visual variants:

#### Filled Variant (default)

Solid background color with content:

```jsx
<Avatar variant="filled" color="blue" alt="User" />
```

#### Light Variant

Subtle, light background version:

```jsx
<Avatar variant="light" color="blue" name="John Doe" alt="John Doe" />
```

#### Outline Variant

Border with transparent background:

```jsx
<Avatar variant="outline" color="blue" name="JS" alt="Jane Smith" />
```

#### Transparent Variant

No background, just content:

```jsx
<Avatar variant="transparent" color="blue" name="BD" alt="Bob Doe" />
```

#### White Variant

White background (useful on colored backgrounds):

```jsx
<Avatar variant="white" name="AD" alt="Alice Doe" />
```

---

### States

#### With Image (Default State)

Normal display with loaded image:

```jsx
<Avatar
  src="https://example.com/user-photo.jpg"
  alt="John Doe"
/>
```

#### Placeholder State (Image Failed or null)

When image fails to load or src is null/undefined, shows placeholder:

```jsx
// No src provided - shows default icon
<Avatar alt="Placeholder user" />

// Image fails to load - automatically shows fallback
<Avatar src="invalid-url.jpg" alt="Failed to load" />

// Explicitly null src
<Avatar src={null} alt="No image available" />
```

#### Custom Placeholder Content

Provide custom placeholder content as children:

```jsx
// Custom text placeholder
<Avatar color="blue" alt="Custom placeholder">
  JD
</Avatar>

// Custom icon placeholder
import { IconUser } from '@tabler/icons-react';

<Avatar color="grape" alt="User icon">
  <IconUser size={24} />
</Avatar>
```

---

### Sizing Options

Mantine provides standard size options:

```jsx
// Extra small
<Avatar size="xs" src="user.jpg" alt="User" />

// Small
<Avatar size="sm" src="user.jpg" alt="User" />

// Medium (default)
<Avatar size="md" src="user.jpg" alt="User" />

// Large
<Avatar size="lg" src="user.jpg" alt="User" />

// Extra large
<Avatar size="xl" src="user.jpg" alt="User" />

// Custom size in pixels
<Avatar size={80} src="user.jpg" alt="User" />
```

---

### Border Radius

Control the roundness of the avatar:

```jsx
// Extra small radius (nearly square)
<Avatar radius="xs" src="user.jpg" alt="User" />

// Small radius
<Avatar radius="sm" src="user.jpg" alt="User" />

// Medium radius (default)
<Avatar radius="md" src="user.jpg" alt="User" />

// Large radius
<Avatar radius="lg" src="user.jpg" alt="User" />

// Extra large radius (nearly circular)
<Avatar radius="xl" src="user.jpg" alt="User" />

// Custom radius
<Avatar radius={8} src="user.jpg" alt="User" />

// Fully circular
<Avatar radius="50%" src="user.jpg" alt="User" />

// Square corners
<Avatar radius={0} src="user.jpg" alt="User" />
```

---

### Color Customization

#### Theme Colors

Use predefined Mantine theme colors:

```jsx
<Avatar color="blue" name="JD" alt="John Doe" />
<Avatar color="red" name="AS" alt="Alice Smith" />
<Avatar color="green" name="BJ" alt="Bob Jones" />
<Avatar color="grape" name="MK" alt="Mary King" />
<Avatar color="orange" name="TS" alt="Tom Stone" />
```

#### Automatic Color from Name

Let Mantine generate colors based on name hash:

```jsx
// Generates consistent color for each unique name
<Avatar color="initials" name="John Doe" alt="John Doe" />
<Avatar color="initials" name="Jane Smith" alt="Jane Smith" />
```

#### Custom Colors

Use custom hex values or CSS colors:

```jsx
<Avatar color="#ff6b6b" name="JD" alt="John Doe" />
<Avatar color="rgb(51, 154, 240)" name="AS" alt="Alice Smith" />
```

---

### Polymorphic Component

Avatar can render as different HTML elements for semantic purposes:

#### As Link

```jsx
// Standard anchor tag
<Avatar
  component="a"
  href="/profile/john-doe"
  src="user.jpg"
  alt="John Doe"
/>

// With React Router Link
import { Link } from 'react-router-dom';

<Avatar
  component={Link}
  to="/profile/john-doe"
  src="user.jpg"
  alt="John Doe"
/>

// With Next.js Link
import Link from 'next/link';

<Avatar
  component={Link}
  href="/profile/john-doe"
  src="user.jpg"
  alt="John Doe"
/>
```

#### As Button

```jsx
<Avatar
  component="button"
  onClick={() => console.log('Avatar clicked')}
  src="user.jpg"
  alt="John Doe"
/>
```

---

### Integration Patterns

#### In Navigation Headers

```jsx
import { Avatar, Group, Menu, Text } from '@mantine/core';

export function UserMenu() {
  return (
    <Menu>
      <Menu.Target>
        <Group style={{ cursor: 'pointer' }}>
          <Avatar src="user.jpg" alt="John Doe" />
          <Text>John Doe</Text>
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```

#### In Comment Lists

```jsx
import { Avatar, Group, Stack, Text } from '@mantine/core';

export function CommentItem({ comment }) {
  return (
    <Group align="flex-start">
      <Avatar src={comment.author.avatar} alt={comment.author.name} />
      <Stack spacing="xs" style={{ flex: 1 }}>
        <Group>
          <Text weight={500}>{comment.author.name}</Text>
          <Text size="xs" color="dimmed">{comment.timestamp}</Text>
        </Group>
        <Text>{comment.content}</Text>
      </Stack>
    </Group>
  );
}
```

#### In User Cards

```jsx
import { Avatar, Card, Group, Stack, Text, Button } from '@mantine/core';

export function UserCard({ user }) {
  return (
    <Card shadow="sm" padding="lg">
      <Stack align="center" spacing="md">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="xl"
          radius="xl"
        />
        <Text weight={500} size="lg">{user.name}</Text>
        <Text size="sm" color="dimmed">{user.role}</Text>
        <Group>
          <Button variant="light">Message</Button>
          <Button variant="outline">Follow</Button>
        </Group>
      </Stack>
    </Card>
  );
}
```

#### In Lists with Status Indicators

```jsx
import { Avatar, Group, Text, Badge, Indicator } from '@mantine/core';

export function UserListItem({ user }) {
  return (
    <Group>
      <Indicator color={user.online ? 'green' : 'gray'} position="bottom-end">
        <Avatar src={user.avatar} alt={user.name} />
      </Indicator>
      <div style={{ flex: 1 }}>
        <Text weight={500}>{user.name}</Text>
        <Text size="xs" color="dimmed">{user.status}</Text>
      </div>
      <Badge color={user.online ? 'green' : 'gray'}>
        {user.online ? 'Online' : 'Offline'}
      </Badge>
    </Group>
  );
}
```

#### In Chat Interfaces

```jsx
import { Avatar, Group, Paper, Stack, Text } from '@mantine/core';

export function ChatMessage({ message }) {
  return (
    <Group align="flex-start" spacing="sm">
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.name}
        size="sm"
      />
      <Stack spacing={4} style={{ flex: 1 }}>
        <Group spacing="xs">
          <Text size="sm" weight={500}>{message.sender.name}</Text>
          <Text size="xs" color="dimmed">{message.time}</Text>
        </Group>
        <Paper p="xs" radius="md" style={{ backgroundColor: '#f1f3f5' }}>
          <Text size="sm">{message.content}</Text>
        </Paper>
      </Stack>
    </Group>
  );
}
```

#### In Team Member Grids

```jsx
import { Avatar, SimpleGrid, Stack, Text } from '@mantine/core';

export function TeamGrid({ members }) {
  return (
    <SimpleGrid cols={4} spacing="lg">
      {members.map((member) => (
        <Stack key={member.id} align="center" spacing="sm">
          <Avatar
            src={member.avatar}
            alt={member.name}
            size="xl"
            radius="xl"
          />
          <Text weight={500} align="center">{member.name}</Text>
          <Text size="sm" color="dimmed" align="center">{member.title}</Text>
        </Stack>
      ))}
    </SimpleGrid>
  );
}
```

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL for the avatar |
| `alt` | `string` | - | **Required** - Alt text for accessibility and placeholder title |
| `name` | `string` | - | Person's name - automatically generates initials |
| `color` | `string \| 'initials'` | - | Background color; `"initials"` auto-generates from name hash |
| `allowedInitialsColors` | `string[]` | - | Restricts color palette when using `color="initials"` |
| `variant` | `'filled' \| 'light' \| 'outline' \| 'transparent' \| 'white'` | `'filled'` | Visual style variant |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| string` | `'xl'` | Border radius (number in px or string like "50%") |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | Avatar size |
| `component` | `React.ElementType` | `'div'` | Polymorphic component type (e.g., 'a', 'button', Link) |
| `children` | `ReactNode` | - | Custom placeholder content when image not available |
| `className` | `string` | - | CSS class for custom styling |
| `style` | `CSSProperties` | - | Inline styles |

### Avatar.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'sm'` | Gap between overlapping avatars |
| `children` | `ReactNode` | - | Must be direct Avatar components only |

---

## Code Examples

### Example 1: User Profile Header

Display user information with avatar, name, and actions:

```jsx
import { Avatar, Group, Stack, Text, Button } from '@mantine/core';

export function ProfileHeader({ user }) {
  return (
    <Group align="center" spacing="lg" p="md">
      <Avatar
        src={user.profilePicture}
        alt={user.name}
        size="xl"
        radius="xl"
      />
      <Stack spacing="xs" style={{ flex: 1 }}>
        <Text size="xl" weight={700}>{user.name}</Text>
        <Text color="dimmed">{user.email}</Text>
        <Text size="sm">{user.bio}</Text>
      </Stack>
      <Button variant="outline">Edit Profile</Button>
    </Group>
  );
}
```

### Example 2: Comment Thread

Display nested comments with avatars:

```jsx
import { Avatar, Group, Stack, Text, Paper } from '@mantine/core';

const comments = [
  {
    id: 1,
    author: { name: 'John Doe', avatar: 'john.jpg' },
    content: 'This is a great post!',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    author: { name: 'Jane Smith', avatar: null },
    content: 'I completely agree!',
    timestamp: '1 hour ago',
  },
];

export function CommentThread() {
  return (
    <Stack spacing="md">
      {comments.map((comment) => (
        <Group key={comment.id} align="flex-start" spacing="sm">
          <Avatar
            src={comment.author.avatar}
            name={comment.author.name}
            color="initials"
            alt={comment.author.name}
          />
          <Stack spacing={4} style={{ flex: 1 }}>
            <Group spacing="xs">
              <Text weight={500}>{comment.author.name}</Text>
              <Text size="xs" color="dimmed">{comment.timestamp}</Text>
            </Group>
            <Text>{comment.content}</Text>
          </Stack>
        </Group>
      ))}
    </Stack>
  );
}
```

### Example 3: Team Members with Avatar.Group

Show team composition with overflow indicator:

```jsx
import { Avatar, Group, Text, Tooltip } from '@mantine/core';

const team = [
  { id: 1, name: 'John Doe', avatar: 'john.jpg' },
  { id: 2, name: 'Jane Smith', avatar: 'jane.jpg' },
  { id: 3, name: 'Bob Jones', avatar: 'bob.jpg' },
  { id: 4, name: 'Alice Brown', avatar: null },
  { id: 5, name: 'Charlie Wilson', avatar: null },
];

export function TeamDisplay() {
  const displayedMembers = team.slice(0, 3);
  const remainingCount = team.length - 3;

  return (
    <Group>
      <Text weight={500}>Project Team:</Text>
      <Avatar.Group spacing="sm">
        {displayedMembers.map((member) => (
          <Tooltip key={member.id} label={member.name}>
            <Avatar
              src={member.avatar}
              name={member.name}
              color="initials"
              alt={member.name}
            />
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip label={`${remainingCount} more members`}>
            <Avatar color="gray" alt={`${remainingCount} more members`}>
              +{remainingCount}
            </Avatar>
          </Tooltip>
        )}
      </Avatar.Group>
    </Group>
  );
}
```

### Example 4: User Selection List

Selectable user list with avatars and online status:

```jsx
import { Avatar, Checkbox, Group, Stack, Text, Paper, Indicator } from '@mantine/core';
import { useState } from 'react';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'john.jpg', online: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: null, online: false },
  { id: 3, name: 'Bob Jones', email: 'bob@example.com', avatar: 'bob.jpg', online: true },
];

export function UserSelectionList() {
  const [selected, setSelected] = useState([]);

  const handleToggle = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Stack spacing="xs">
      {users.map((user) => (
        <Paper
          key={user.id}
          p="sm"
          withBorder
          style={{
            cursor: 'pointer',
            backgroundColor: selected.includes(user.id) ? '#f1f3f5' : 'white',
          }}
          onClick={() => handleToggle(user.id)}
        >
          <Group>
            <Checkbox
              checked={selected.includes(user.id)}
              onChange={() => {}}
              tabIndex={-1}
            />
            <Indicator
              color={user.online ? 'green' : 'gray'}
              position="bottom-end"
              size={10}
            >
              <Avatar
                src={user.avatar}
                name={user.name}
                color="initials"
                alt={user.name}
              />
            </Indicator>
            <Stack spacing={0} style={{ flex: 1 }}>
              <Text weight={500}>{user.name}</Text>
              <Text size="xs" color="dimmed">{user.email}</Text>
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
```

### Example 5: Polymorphic Avatar Links

Create clickable avatar navigation:

```jsx
import { Avatar, Group, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

const recentUsers = [
  { id: 1, name: 'John Doe', avatar: 'john.jpg', username: 'johndoe' },
  { id: 2, name: 'Jane Smith', avatar: null, username: 'janesmith' },
  { id: 3, name: 'Bob Jones', avatar: 'bob.jpg', username: 'bobjones' },
];

export function RecentUsers() {
  return (
    <Stack spacing="md">
      <Text weight={700}>Recent Users</Text>
      {recentUsers.map((user) => (
        <Group key={user.id} spacing="sm">
          <Avatar
            component={Link}
            to={`/users/${user.username}`}
            src={user.avatar}
            name={user.name}
            color="initials"
            alt={user.name}
            style={{ cursor: 'pointer' }}
          />
          <Stack spacing={0}>
            <Text
              component={Link}
              to={`/users/${user.username}`}
              weight={500}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {user.name}
            </Text>
            <Text size="xs" color="dimmed">@{user.username}</Text>
          </Stack>
        </Group>
      ))}
    </Stack>
  );
}
```

---

## Accessibility Notes

### Alt Text Requirement

The `alt` prop is **required** for proper accessibility:

```jsx
// Good - provides context
<Avatar src="user.jpg" alt="John Doe profile picture" />

// Good - describes placeholder
<Avatar alt="User profile placeholder" />

// Bad - missing alt text
<Avatar src="user.jpg" />
```

### Semantic HTML with Polymorphic Component

Use appropriate HTML elements for different contexts:

```jsx
// Use button for interactive avatars
<Avatar
  component="button"
  onClick={handleClick}
  alt="Open user menu"
/>

// Use link for navigation
<Avatar
  component="a"
  href="/profile"
  alt="View John Doe's profile"
/>

// Use div (default) for decorative avatars
<Avatar alt="John Doe" />
```

### Image Loading States

The component automatically handles failed image loads, showing placeholder content when images can't be displayed. The `alt` text becomes the title attribute for the placeholder.

### Focus Management

When using interactive avatars (button/link), ensure proper focus styling:

```jsx
<Avatar
  component="button"
  onClick={handleClick}
  alt="User menu"
  style={{
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.2s',
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = '#228be6';
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = 'transparent';
  }}
/>
```

### Avatar.Group Accessibility

When using Avatar.Group, ensure each avatar has descriptive alt text:

```jsx
<Avatar.Group spacing="sm">
  <Avatar src="user1.jpg" alt="John Doe" />
  <Avatar src="user2.jpg" alt="Jane Smith" />
  <Avatar src="user3.jpg" alt="Bob Jones" />
  <Avatar alt="5 additional team members">+5</Avatar>
</Avatar.Group>
```

### Best Practices

1. **Always provide alt text** - Describes the person or placeholder
2. **Use initials for missing images** - Better UX than generic icons
3. **Consistent sizing** - Use same size within context (e.g., all comments)
4. **Color meaning** - Don't rely solely on color to convey information
5. **Interactive feedback** - Provide hover/focus states for clickable avatars

---

## Common Patterns

### Pattern 1: User Mention/Tag System

Displaying mentioned users in content:

```jsx
import { Avatar, Group, Text, Badge } from '@mantine/core';

export function UserMention({ user }) {
  return (
    <Badge
      variant="light"
      size="lg"
      pl={4}
      leftSection={
        <Avatar
          src={user.avatar}
          name={user.name}
          color="initials"
          size="xs"
          alt={user.name}
        />
      }
    >
      @{user.username}
    </Badge>
  );
}
```

### Pattern 2: Avatar with Status Badge

Show user status with badge overlay:

```jsx
import { Avatar, Badge } from '@mantine/core';

export function AvatarWithStatus({ user }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar src={user.avatar} alt={user.name} size="lg" />
      <Badge
        size="sm"
        color={user.status === 'busy' ? 'red' : 'green'}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      >
        {user.status}
      </Badge>
    </div>
  );
}
```

### Pattern 3: Color-Coded Avatar Groups

Use initials colors to represent departments or roles:

```jsx
const departments = {
  engineering: ['blue', 'cyan'],
  design: ['grape', 'violet'],
  marketing: ['orange', 'yellow'],
};

export function DepartmentAvatars({ users, department }) {
  return (
    <Avatar.Group spacing="sm">
      {users.map((user) => (
        <Avatar
          key={user.id}
          name={user.name}
          color="initials"
          allowedInitialsColors={departments[department]}
          alt={user.name}
        />
      ))}
    </Avatar.Group>
  );
}
```

### Pattern 4: Placeholder with Custom Icons

Use custom icons for system users or bots:

```jsx
import { Avatar } from '@mantine/core';
import { IconRobot, IconSettings } from '@tabler/icons-react';

export function SystemAvatars() {
  return (
    <Group>
      <Avatar color="blue" alt="System Bot">
        <IconRobot size={24} />
      </Avatar>
      <Avatar color="gray" alt="System Settings">
        <IconSettings size={24} />
      </Avatar>
    </Group>
  );
}
```

---

## Unique Mantine Features

### 1. Automatic Initials Generation

Mantine automatically extracts and displays initials from the `name` prop, eliminating the need for manual initials calculation:

```jsx
// Framework handles initials extraction
<Avatar name="John Michael Doe" alt="John Michael Doe" />
// Displays: "JD"
```

### 2. Deterministic Color Hashing

Using `color="initials"` generates consistent colors based on name hash, ensuring the same person always gets the same color across your application:

```jsx
// Same name = same color, different names = different colors
<Avatar name="Alice Smith" color="initials" alt="Alice Smith" />
<Avatar name="Bob Jones" color="initials" alt="Bob Jones" />
```

### 3. Restricted Color Palettes

The `allowedInitialsColors` prop lets you limit color options to match your brand or organizational scheme:

```jsx
// Only brand colors
<Avatar
  name="Jane Doe"
  color="initials"
  allowedInitialsColors={['blue.6', 'red.6', 'green.6']}
  alt="Jane Doe"
/>
```

### 4. Avatar.Group Stacking

Purpose-built Avatar.Group component with spacing control and overflow handling:

```jsx
<Avatar.Group spacing="sm">
  {users.map(user => (
    <Avatar key={user.id} src={user.avatar} alt={user.name} />
  ))}
  <Avatar>+{remainingUsers}</Avatar>
</Avatar.Group>
```

### 5. Polymorphic Component Support

Full TypeScript-safe polymorphic component API for semantic HTML:

```jsx
// Type-safe link component
<Avatar
  component={Link}
  to="/profile"
  src="user.jpg"
  alt="Profile"
/>
```

### 6. Automatic Fallback Handling

Built-in image failure detection with automatic fallback to placeholder content, using alt text as title attribute.

---

## Related Components

- **Indicator** - Add status dots or badges to avatars
- **Badge** - Display counts or status alongside avatars
- **Tooltip** - Show full names on hover in Avatar.Group
- **Group** - Layout multiple elements with avatars
- **Stack** - Vertical layouts with avatars
- **Menu** - User menu dropdowns triggered by avatar
- **Card** - User profile cards featuring avatars
- **Paper** - Container for avatar lists

---

Research completed: 2025-11-05
Component: Avatar
Framework: Mantine
Documentation: https://mantine.dev/core/avatar/

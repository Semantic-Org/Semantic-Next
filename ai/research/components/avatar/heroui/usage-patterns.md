# HeroUI - Avatar Component

> Last Modified: 2025-11-05

## Component Overview

The HeroUI Avatar component visually represents users or entities through profile pictures, initials, icons, or custom fallback content. It provides comprehensive image loading handling with automatic fallback generation, making it ideal for user profiles, comment systems, chat interfaces, and collaborative tools.

**Core purpose**: Displays user identity through images with intelligent fallback behavior (auto-generated initials with accessible background colors, icons, or custom components) when images fail to load or are unavailable.

**Architecture**: A single-component design with `Avatar` as the primary element and `AvatarGroup` as a composition wrapper for displaying multiple avatars together. Built on React Aria hooks (`useHover`, `useFocusRing`) for accessibility and interaction management.

**Common use cases**: User profiles, comment threads, team member lists, chat message senders, collaborative document editors, organization member displays, contact lists, notification avatars, mentions and tags.

## Usage Patterns

### Basic Usage

The simplest Avatar implementation displays an image with automatic fallback handling:

```jsx
import { Avatar } from "@heroui/react"

// Basic image avatar
<Avatar src="https://example.com/user-photo.jpg" />

// Avatar with name (generates initials fallback)
<Avatar name="Jane Doe" />

// Avatar with custom icon
<Avatar icon={<UserIcon />} />

// Avatar with multiple fallback options
<Avatar
  src="https://example.com/photo.jpg"
  name="John Smith"
  icon={<UserIcon />}
/>
```

### Content Types

HeroUI Avatar supports four primary content types with automatic fallback cascade:

**1. Image Content** (Primary):
```jsx
<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
```
- Loaded via `src` prop
- Supports `imgProps` for image-specific attributes (alt, loading, etc.)
- Custom image component via `ImgComponent` prop
- Automatically falls back on load failure

**2. Text/Initials Content** (Fallback):
```jsx
<Avatar name="Jane Doe" />
```
- Auto-generates initials from `name` prop
- Default: First character of each word (e.g., "Jane Doe" → "JD")
- Custom logic via `getInitials` prop
- Random accessible background colors assigned
- Screen reader friendly with aria-label

**3. Icon Content** (Secondary Fallback):
```jsx
import { UserIcon } from "@heroicons/react/24/outline"

<Avatar icon={<UserIcon />} />
```
- Custom icon component via `icon` prop
- Default `AvatarIcon` when no content provided
- Centered within avatar circle/square
- Inherits color scheme

**4. Custom Fallback Content**:
```jsx
<Avatar
  src="invalid-url.jpg"
  showFallback
  fallback={
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-600">
      <span className="text-white text-xs">N/A</span>
    </div>
  }
/>
```
- Via `fallback` prop
- Complete React component support
- Override default fallback behavior
- Custom styling and layout

**Fallback Priority Cascade**:
```
1. Image (src) → 2. Custom fallback → 3. Initials (name) → 4. Icon → 5. Default AvatarIcon
```

### Types

**Single Avatar**:
```jsx
// Standard standalone avatar
<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
```
- Independent display
- Full props support
- Individual state management
- Can be clickable via `as="button"`

**Avatar Group**:
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

<AvatarGroup>
  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
</AvatarGroup>
```
- Horizontal row layout (default)
- Overlapping avatars via negative margin
- Shared group styling
- Max count truncation
- Grid layout option

**Avatar Group with Max Count**:
```jsx
<AvatarGroup max={3}>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
  <Avatar src="user4.jpg" />
  <Avatar src="user5.jpg" />
</AvatarGroup>
```
- Limits visible avatars (default: 5)
- Shows "+N" indicator for remaining
- `max` prop controls limit
- Remaining count auto-calculated

**Avatar Group with Total Count**:
```jsx
<AvatarGroup max={3} total={10}>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
</AvatarGroup>
```
- `total` prop shows custom count
- Displays "+7" when total exceeds displayed
- Use when not all avatars rendered
- Useful for large team displays

**Avatar Group Grid Layout**:
```jsx
<AvatarGroup isGrid max={7}>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
  <Avatar src="user4.jpg" />
  <Avatar src="user5.jpg" />
  <Avatar src="user6.jpg" />
  <Avatar src="user7.jpg" />
  <Avatar src="user8.jpg" />
</AvatarGroup>
```
- Grid layout via `isGrid` prop
- No overlapping (unlike default)
- Better for larger groups
- Responsive grid columns

### Shapes

Avatar shape controlled via `radius` prop:

**Circle (Default)**:
```jsx
<Avatar src="user.jpg" radius="full" />
```
- `radius="full"` or omit prop
- Standard circular avatar
- Most common pattern
- Universal recognition

**Rounded Square**:
```jsx
// Large rounded corners
<Avatar src="user.jpg" radius="lg" />

// Medium rounded corners
<Avatar src="user.jpg" radius="md" />

// Small rounded corners
<Avatar src="user.jpg" radius="sm" />
```
- Softer rectangular appearance
- Modern design aesthetic
- Good for brand logos

**Square**:
```jsx
<Avatar src="user.jpg" radius="none" />
```
- Sharp corners (no radius)
- Good for architectural/design content
- Less common for user profiles

**Shape Variants Summary**:
- `radius="full"` - Circle (default, most common)
- `radius="lg"` - Large rounded corners
- `radius="md"` - Medium rounded corners
- `radius="sm"` - Small rounded corners
- `radius="none"` - Square (no rounding)

### Sizing Options

HeroUI provides three preset sizes plus custom sizing:

**Size Variants**:
```jsx
import { Avatar } from "@heroui/react"

// Small
<Avatar src="user.jpg" size="sm" />

// Medium (default)
<Avatar src="user.jpg" size="md" />

// Large
<Avatar src="user.jpg" size="lg" />
```

**Size Specifications**:
- `sm` - Small: Compact display, tight spaces, inline with text
- `md` - Medium: Default, balanced for most use cases
- `lg` - Large: Prominent display, profile headers, feature cards

**Custom Sizing**:
```jsx
// Custom dimensions via className
<Avatar
  src="user.jpg"
  classNames={{
    base: "w-20 h-20", // Tailwind: 80px × 80px
  }}
/>

// Custom dimensions via style
<Avatar
  src="user.jpg"
  className="w-[100px] h-[100px]"
/>
```

**Responsive Sizing**:
```jsx
<Avatar
  src="user.jpg"
  classNames={{
    base: "w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20",
  }}
/>
```

### States

**Default State**:
```jsx
<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
```
- Standard display
- Image loaded successfully
- Interactive hover effects available
- Focus ring on keyboard navigation

**Disabled State**:
```jsx
<Avatar
  src="user.jpg"
  isDisabled
/>
```
- Visual indication via opacity reduction
- Non-interactive
- Cursor changes to not-allowed
- Applied to entire group via `AvatarGroup`

**Disabled Group**:
```jsx
<AvatarGroup isDisabled>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
</AvatarGroup>
```
- All avatars inherit disabled state
- Single prop controls entire group
- Consistent disabled appearance

**Bordered State**:
```jsx
<Avatar
  src="user.jpg"
  isBordered
/>
```
- Adds border frame around avatar
- Useful for emphasis or selection
- Color inherits from theme or `color` prop
- Common pattern: Selected user indicator

**Bordered with Color**:
```jsx
<Avatar
  src="user.jpg"
  isBordered
  color="success"
/>
```
- Colored border indicates status
- Green for online/active
- Red for offline/busy
- Custom semantic meaning

**Loading/Fallback State**:
```jsx
<Avatar
  src="loading-or-failed-url.jpg"
  name="John Doe"
  showFallback
/>
```
- Automatic during image load
- Automatic on load failure
- Shows fallback content
- Seamless user experience

**Focusable State**:
```jsx
<Avatar
  src="user.jpg"
  isFocusable
/>
```
- Enables keyboard navigation
- Focus ring appears on tab
- Accessible interaction
- Use with `as="button"` for clickable avatars

**Clickable State**:
```jsx
<Avatar
  as="button"
  src="user.jpg"
  isFocusable
  onClick={() => console.log("Avatar clicked")}
/>
```
- Rendered as button element
- Full keyboard support
- Click and Enter/Space activation
- Common for profile navigation

### Variations

**Color Palette Variants**:
```jsx
// Default gray
<Avatar src="user.jpg" color="default" />

// Primary theme color
<Avatar src="user.jpg" color="primary" />

// Secondary theme color
<Avatar src="user.jpg" color="secondary" />

// Success green
<Avatar src="user.jpg" color="success" />

// Warning yellow/orange
<Avatar src="user.jpg" color="warning" />

// Danger red
<Avatar src="user.jpg" color="danger" />
```

**Semantic Color Usage**:
- `default` - Neutral, standard users
- `primary` - Main brand color, important users
- `secondary` - Alternative emphasis
- `success` - Online status, verified accounts
- `warning` - Away status, pending actions
- `danger` - Offline, blocked, error states

**Color with Borders**:
```jsx
<Avatar
  src="user.jpg"
  color="success"
  isBordered
/>
```
- Border color matches `color` prop
- Visual status indicator
- Common pattern for online/offline states

**Color Applied to Fallbacks**:
```jsx
<Avatar
  name="Jane Doe"
  color="primary"
/>
```
- Background color for initials
- Icon color inheritance
- Consistent themed appearance

**Custom Styled Avatars**:
```jsx
<Avatar
  src="user.jpg"
  classNames={{
    base: "bg-gradient-to-br from-indigo-500 to-pink-500",
    icon: "text-white",
  }}
/>
```
- Full Tailwind CSS support
- Gradient backgrounds
- Custom border styles
- Shadow effects

### Interactive Patterns

**Clickable Avatar Navigation**:
```jsx
import { Avatar } from "@heroui/react"
import { useRouter } from "next/navigation"

function UserAvatar({ userId, src, name }) {
  const router = useRouter()

  return (
    <Avatar
      as="button"
      src={src}
      name={name}
      isFocusable
      onClick={() => router.push(`/users/${userId}`)}
    />
  )
}
```

**Avatar with Hover Effects**:
```jsx
<Avatar
  src="user.jpg"
  classNames={{
    base: "transition-transform hover:scale-110 cursor-pointer",
  }}
  onClick={handleClick}
/>
```

**Avatar with Tooltip**:
```jsx
import { Avatar, Tooltip } from "@heroui/react"

<Tooltip content="John Doe - Software Engineer">
  <Avatar src="user.jpg" name="John Doe" />
</Tooltip>
```

**Avatar Group with Individual Click Handlers**:
```jsx
<AvatarGroup max={5}>
  {users.map(user => (
    <Avatar
      key={user.id}
      as="button"
      src={user.avatar}
      name={user.name}
      onClick={() => handleUserClick(user.id)}
      isFocusable
    />
  ))}
</AvatarGroup>
```

**Avatar with Online Status Badge**:
```jsx
<div className="relative">
  <Avatar src="user.jpg" />
  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
</div>
```

**Avatar with Custom Count Rendering**:
```jsx
<AvatarGroup
  max={3}
  total={15}
  renderCount={(count) => (
    <Avatar
      classNames={{
        base: "bg-gradient-to-br from-purple-500 to-pink-500",
      }}
      name={`+${count}`}
    />
  )}
>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
</AvatarGroup>
```

**Editable Avatar Upload**:
```jsx
import { Avatar } from "@heroui/react"
import { Camera } from "@heroicons/react/24/outline"

function EditableAvatar({ currentSrc, onUpload }) {
  return (
    <div className="relative group">
      <Avatar src={currentSrc} size="lg" />
      <button
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onUpload}
      >
        <Camera className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}
```

**Initials Generation Logic**:
```jsx
<Avatar
  name="John Smith Doe"
  getInitials={(name) => {
    // Custom logic: First and last name only
    const words = name.split(' ')
    if (words.length >= 2) {
      return words[0][0] + words[words.length - 1][0]
    }
    return words[0][0]
  }}
/>
// Displays "JD" instead of default "JSD"
```

### Layout & Positioning

**Inline with Text**:
```jsx
<div className="flex items-center gap-2">
  <Avatar src="user.jpg" size="sm" />
  <span>John Doe commented on your post</span>
</div>
```

**Stacked Horizontal Group**:
```jsx
<AvatarGroup>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
</AvatarGroup>
```
- Default group layout
- Overlapping avatars (negative margin)
- Z-index stacking (first on top)

**Grid Layout Group**:
```jsx
<AvatarGroup isGrid max={9}>
  {users.map(user => (
    <Avatar key={user.id} src={user.avatar} />
  ))}
</AvatarGroup>
```
- No overlap
- Responsive columns
- Better for larger groups

**Responsive Avatar Sizing**:
```jsx
<Avatar
  src="user.jpg"
  classNames={{
    base: "w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16",
  }}
/>
```

**Centered in Container**:
```jsx
<div className="flex justify-center items-center h-screen">
  <Avatar src="user.jpg" size="lg" />
</div>
```

**Profile Header Layout**:
```jsx
<div className="flex flex-col items-center gap-4 p-6">
  <Avatar src="user.jpg" size="lg" isBordered />
  <div className="text-center">
    <h2 className="text-2xl font-bold">John Doe</h2>
    <p className="text-gray-500">Software Engineer</p>
  </div>
</div>
```

**Comment Thread Layout**:
```jsx
<div className="flex gap-3">
  <Avatar src="user.jpg" size="sm" />
  <div className="flex-1">
    <div className="flex items-center gap-2">
      <span className="font-semibold">John Doe</span>
      <span className="text-sm text-gray-500">2 hours ago</span>
    </div>
    <p>This is a comment...</p>
  </div>
</div>
```

### Integration Patterns

**User Profile Card**:
```jsx
import { Avatar, Card, CardBody } from "@heroui/react"

function UserCard({ user }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatar}
            size="lg"
            isBordered
            color="primary"
          />
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
```

**Team Members List**:
```jsx
import { Avatar } from "@heroui/react"

function TeamList({ members }) {
  return (
    <div className="space-y-3">
      {members.map(member => (
        <div key={member.id} className="flex items-center gap-3">
          <Avatar
            src={member.avatar}
            name={member.name}
            size="sm"
            color={member.isOnline ? "success" : "default"}
            isBordered={member.isOnline}
          />
          <div className="flex-1">
            <p className="font-medium">{member.name}</p>
            <p className="text-xs text-gray-500">{member.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Chat Message Sender**:
```jsx
function ChatMessage({ message }) {
  return (
    <div className="flex gap-3 p-4">
      <Avatar
        src={message.sender.avatar}
        name={message.sender.name}
        size="sm"
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{message.sender.name}</span>
          <span className="text-xs text-gray-500">
            {message.timestamp}
          </span>
        </div>
        <p className="mt-1">{message.content}</p>
      </div>
    </div>
  )
}
```

**Collaborative Document Editors**:
```jsx
function ActiveEditors({ editors }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Active now:</span>
      <AvatarGroup max={3} size="sm">
        {editors.map(editor => (
          <Avatar
            key={editor.id}
            src={editor.avatar}
            name={editor.name}
            color="success"
            isBordered
          />
        ))}
      </AvatarGroup>
    </div>
  )
}
```

**Notification Item**:
```jsx
function NotificationItem({ notification }) {
  return (
    <div className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer">
      <Avatar
        src={notification.user.avatar}
        name={notification.user.name}
        size="sm"
      />
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.user.name}</span>
          {' '}{notification.action}
        </p>
        <p className="text-xs text-gray-500">{notification.timestamp}</p>
      </div>
    </div>
  )
}
```

**Custom Avatar Hook Implementation**:
```jsx
import { useAvatar } from "@heroui/react"

function CustomAvatar(props) {
  const {
    Component,
    ImgComponent,
    src,
    icon,
    alt,
    name,
    imgProps,
    slots,
    classNames,
    getAvatarProps,
    getImageProps,
  } = useAvatar(props)

  return (
    <Component {...getAvatarProps()}>
      {src && <ImgComponent {...getImageProps()} />}
      {!src && icon}
      {!src && !icon && name && (
        <span className={classNames.name}>{name[0]}</span>
      )}
    </Component>
  )
}
```

### Accessibility Features

**Built-in ARIA Support**:
```jsx
<Avatar
  src="user.jpg"
  name="John Doe"
  // Automatically generates:
  // aria-label="John Doe"
  // alt="John Doe"
/>
```

**Semantic Fallback Labels**:
- Image alt text from `name` prop
- Aria-label on fallback content
- Screen reader friendly initials
- Icon components with proper labels

**Keyboard Navigation**:
```jsx
<Avatar
  as="button"
  src="user.jpg"
  isFocusable
  // Supports:
  // - Tab navigation
  // - Enter/Space activation
  // - Focus ring visibility
/>
```

**Focus Management**:
```jsx
<Avatar
  src="user.jpg"
  isFocusable
  // Uses React Aria's useFocusRing
  // data-focus-visible attribute for styling
/>
```

**Hover State Data Attributes**:
```jsx
<Avatar
  src="user.jpg"
  // Provides data-hover attribute
  // For accessible hover styling
  classNames={{
    base: "data-[hover=true]:scale-105",
  }}
/>
```

**Screen Reader Announcements**:
```jsx
// Avatar with status
<div role="img" aria-label="John Doe, online">
  <Avatar src="user.jpg" name="John Doe" color="success" isBordered />
</div>
```

**Color Contrast**:
- Auto-generated fallback colors meet WCAG AA
- Border colors maintain sufficient contrast
- Icon fallbacks visible against backgrounds
- Text initials readable on colored backgrounds

**Accessible Group Count**:
```jsx
<AvatarGroup max={3} total={10}>
  {/* ... avatars ... */}
  {/* +7 indicator has proper aria-label */}
</AvatarGroup>
```

## Key Properties/Props

### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image URL for avatar |
| `name` | `string` | - | User name (generates initials fallback and aria-label) |
| `icon` | `ReactNode` | - | Custom icon fallback when no image/name |
| `fallback` | `ReactNode` | - | Custom fallback component (overrides initials/icon) |
| `showFallback` | `boolean` | `false` | Force show fallback even with valid src |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | Color theme for avatar and borders |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"full"` | Border radius (full = circle, none = square) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Preset size variant |
| `isBordered` | `boolean` | `false` | Add border frame around avatar |
| `isDisabled` | `boolean` | `false` | Apply disabled styling and behavior |
| `isFocusable` | `boolean` | `false` | Enable keyboard focus and focus ring |
| `ImgComponent` | `ComponentType` | `"img"` | Custom component to replace img element |
| `imgProps` | `ImgHTMLAttributes` | - | Props passed to image element |
| `getInitials` | `(name: string) => string` | First char of each word | Custom initials generation logic |
| `classNames` | `Record<"base" \| "img" \| "fallback" \| "name" \| "icon", string>` | - | Custom classes for avatar slots |
| `as` | `ElementType` | `"span"` | Element type (use "button" for clickable) |

### AvatarGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | `5` | Maximum avatars to display before showing count |
| `total` | `number` | - | Total count to display (overrides calculated count) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size applied to all child avatars |
| `color` | `string` | `"default"` | Color applied to all child avatars |
| `radius` | `string` | `"full"` | Radius applied to all child avatars |
| `isBordered` | `boolean` | `false` | Apply borders to all child avatars |
| `isDisabled` | `boolean` | `false` | Disable all child avatars |
| `isGrid` | `boolean` | `false` | Use grid layout instead of overlapping |
| `renderCount` | `(count: number) => ReactNode` | Default "+N" avatar | Custom rendering for remaining count |
| `classNames` | `Record<"base" \| "count", string>` | - | Custom classes for group slots |

## Code Examples

### Example 1: Basic Avatar with Image
```jsx
import { Avatar } from "@heroui/react"

export const BasicAvatar = () => {
  return (
    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
  )
}
```

### Example 2: Avatar with Name Fallback
```jsx
import { Avatar } from "@heroui/react"

export const AvatarWithName = () => {
  return (
    <Avatar name="Jane Doe" />
  )
}
```

### Example 3: Avatar Size Variants
```jsx
import { Avatar } from "@heroui/react"

export const AvatarSizes = () => {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        size="sm"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        size="md"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        size="lg"
      />
    </div>
  )
}
```

### Example 4: Avatar with Colors
```jsx
import { Avatar } from "@heroui/react"

export const ColoredAvatars = () => {
  return (
    <div className="flex gap-3">
      <Avatar src="user.jpg" color="default" />
      <Avatar src="user.jpg" color="primary" />
      <Avatar src="user.jpg" color="secondary" />
      <Avatar src="user.jpg" color="success" />
      <Avatar src="user.jpg" color="warning" />
      <Avatar src="user.jpg" color="danger" />
    </div>
  )
}
```

### Example 5: Bordered Avatars
```jsx
import { Avatar } from "@heroui/react"

export const BorderedAvatars = () => {
  return (
    <div className="flex gap-4">
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        isBordered
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        isBordered
        color="primary"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        isBordered
        color="success"
      />
    </div>
  )
}
```

### Example 6: Avatar Shapes
```jsx
import { Avatar } from "@heroui/react"

export const AvatarShapes = () => {
  return (
    <div className="flex gap-4">
      <Avatar src="user.jpg" radius="full" />
      <Avatar src="user.jpg" radius="lg" />
      <Avatar src="user.jpg" radius="md" />
      <Avatar src="user.jpg" radius="sm" />
      <Avatar src="user.jpg" radius="none" />
    </div>
  )
}
```

### Example 7: Disabled Avatar
```jsx
import { Avatar } from "@heroui/react"

export const DisabledAvatar = () => {
  return (
    <Avatar
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      isDisabled
    />
  )
}
```

### Example 8: Avatar with Custom Fallback
```jsx
import { Avatar } from "@heroui/react"
import { UserIcon } from "@heroicons/react/24/solid"

export const CustomFallbackAvatar = () => {
  return (
    <Avatar
      src="invalid-url.jpg"
      showFallback
      fallback={
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-600">
          <UserIcon className="w-6 h-6 text-white" />
        </div>
      }
    />
  )
}
```

### Example 9: Clickable Avatar
```jsx
import { Avatar } from "@heroui/react"

export const ClickableAvatar = () => {
  const handleClick = () => {
    console.log("Avatar clicked")
  }

  return (
    <Avatar
      as="button"
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      isFocusable
      onClick={handleClick}
      className="cursor-pointer"
    />
  )
}
```

### Example 10: Basic Avatar Group
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

export const BasicAvatarGroup = () => {
  return (
    <AvatarGroup>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
    </AvatarGroup>
  )
}
```

### Example 11: Avatar Group with Max Count
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

export const AvatarGroupWithMax = () => {
  return (
    <AvatarGroup max={3}>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
    </AvatarGroup>
  )
}
```

### Example 12: Avatar Group with Total Count
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

export const AvatarGroupWithTotal = () => {
  return (
    <AvatarGroup max={3} total={10}>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
    </AvatarGroup>
  )
}
```

### Example 13: Avatar Group Grid Layout
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

export const AvatarGroupGrid = () => {
  return (
    <AvatarGroup isGrid max={7}>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026710d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026712d" />
    </AvatarGroup>
  )
}
```

### Example 14: Avatar Group Disabled
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

export const DisabledAvatarGroup = () => {
  return (
    <AvatarGroup isDisabled>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
    </AvatarGroup>
  )
}
```

### Example 15: Custom Count Rendering
```jsx
import { Avatar, AvatarGroup } from "@heroui/react"

export const CustomCountAvatar = () => {
  return (
    <AvatarGroup
      max={3}
      total={15}
      renderCount={(count) => (
        <Avatar
          classNames={{
            base: "bg-gradient-to-br from-purple-500 to-pink-500",
          }}
          name={`+${count}`}
        />
      )}
    >
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
    </AvatarGroup>
  )
}
```

### Example 16: Custom Initials Logic
```jsx
import { Avatar } from "@heroui/react"

export const CustomInitialsAvatar = () => {
  return (
    <Avatar
      name="John Smith Doe"
      getInitials={(name) => {
        const words = name.split(' ')
        if (words.length >= 2) {
          return words[0][0] + words[words.length - 1][0]
        }
        return words[0][0]
      }}
    />
  )
}
```

### Example 17: Avatar with Icon Fallback
```jsx
import { Avatar } from "@heroui/react"
import { UserIcon } from "@heroicons/react/24/outline"

export const AvatarWithIcon = () => {
  return (
    <Avatar icon={<UserIcon className="w-6 h-6" />} />
  )
}
```

### Example 18: Profile Header
```jsx
import { Avatar } from "@heroui/react"

export const ProfileHeader = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        size="lg"
        isBordered
        color="primary"
      />
      <div className="text-center">
        <h2 className="text-2xl font-bold">Jane Doe</h2>
        <p className="text-gray-500">Software Engineer</p>
      </div>
    </div>
  )
}
```

### Example 19: Comment Thread
```jsx
import { Avatar } from "@heroui/react"

export const CommentThread = () => {
  const comments = [
    {
      id: 1,
      author: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      content: "This is a great post!",
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
      content: "I totally agree with you.",
      time: "1 hour ago"
    }
  ]

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="flex gap-3">
          <Avatar src={comment.avatar} name={comment.author} size="sm" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-gray-500">{comment.time}</span>
            </div>
            <p className="mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Example 20: Team Members with Status
```jsx
import { Avatar } from "@heroui/react"

export const TeamMembers = () => {
  const members = [
    { id: 1, name: "Alice Johnson", avatar: "user1.jpg", isOnline: true },
    { id: 2, name: "Bob Smith", avatar: "user2.jpg", isOnline: false },
    { id: 3, name: "Carol White", avatar: "user3.jpg", isOnline: true }
  ]

  return (
    <div className="space-y-3">
      {members.map(member => (
        <div key={member.id} className="flex items-center gap-3">
          <Avatar
            src={member.avatar}
            name={member.name}
            size="sm"
            color={member.isOnline ? "success" : "default"}
            isBordered={member.isOnline}
          />
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-xs text-gray-500">
              {member.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Accessibility Notes

**ARIA Implementation**:
- Automatic `aria-label` generation from `name` prop
- Image alt text derived from name for screen readers
- Focus ring management via React Aria's `useFocusRing` hook
- Data attributes (`data-focus`, `data-hover`, `data-focus-visible`) for accessible styling

**Screen Reader Support**:
- Fallback content includes proper labeling
- Initials announced with full name
- Icon fallbacks have accessible labels
- Group count indicator readable by screen readers

**Keyboard Accessibility**:
- Tab navigation when `isFocusable` enabled
- Enter/Space activation for button avatars
- Visible focus rings via `data-focus-visible`
- No keyboard traps in avatar groups

**Color Accessibility**:
- Auto-generated fallback colors meet WCAG AA contrast
- Border colors maintain sufficient contrast ratios
- Color not sole indicator of status (use with text/icons)
- Works in light and dark modes

**Best Practices**:
- Always provide `name` prop for fallback and accessibility
- Use `as="button"` with `isFocusable` for interactive avatars
- Combine colored borders with text status indicators
- Provide alternative text context for images
- Test with screen readers and keyboard-only navigation

## Common Patterns

1. **User Profile Display**: Large avatar with name, role, and bordered styling for emphasis
2. **Comment/Chat Avatar**: Small avatar inline with message sender name and timestamp
3. **Team Member List**: Medium avatars with online status indication via colored borders
4. **Collaborative Editors**: Avatar group showing active users with max count truncation
5. **Notification Items**: Small avatar with user action description and relative time
6. **Profile Card**: Large bordered avatar with gradient or color theme
7. **Mentions/Tags**: Small avatars inline with text in content
8. **User Selector**: Clickable avatars in grid layout for multi-select interfaces
9. **Status Indicators**: Bordered avatars with semantic colors (green=online, red=offline)
10. **Fallback Cascade**: Image → Custom fallback → Initials → Icon for graceful degradation

## Related Components

- **Avatar** - Primary component for user representation
- **AvatarGroup** - Composition wrapper for multiple avatars
- **Tooltip** - Provides additional user context on hover
- **Badge** - Status indicator overlays on avatars
- **Card** - Container for profile displays
- **Button** - Interactive avatar triggers (use `as="button"`)
- **Popover** - User details on avatar click/hover
- **Dropdown** - User menu triggered by avatar
- **Modal** - Profile editing interfaces

## Notable Features

- **Intelligent Fallback System**: Automatic cascade from image → custom fallback → initials → icon with seamless transitions
- **Auto-generated Initials**: Random accessible background colors with WCAG AA compliance
- **React Aria Integration**: Built on `useHover` and `useFocusRing` hooks for accessible interactions
- **Custom Hooks**: `useAvatar` and `useAvatarGroup` for building custom implementations
- **Flexible Content**: Supports images, text, icons, and custom React components
- **Stacked Groups**: Overlapping avatar display with z-index management
- **Grid Layout Option**: Non-overlapping grid display for larger groups
- **Max Count Truncation**: Automatic "+N" indicator with customizable rendering
- **Semantic Colors**: Six color variants (default, primary, secondary, success, warning, danger)
- **Shape Variants**: Five radius options from full circle to square
- **Slots System**: Granular styling control (base, img, fallback, name, icon)
- **Custom Image Component**: Replace default img element via `ImgComponent` prop
- **Initials Logic Override**: Custom `getInitials` function for specialized name parsing
- **Keyboard Navigation**: Full focus management and activation support
- **Data Attributes**: `data-hover`, `data-focus`, `data-focus-visible` for state-based styling

---

**Research completed:** 2025-11-05
**Component:** Avatar
**Framework:** HeroUI (NextUI)
**Documentation:** https://www.heroui.com/docs/components/avatar

**Implementation Details:**
- Built with React Aria hooks for accessibility
- Composition-based architecture (Avatar + AvatarGroup)
- Automatic fallback cascade with intelligent content selection
- Full Tailwind CSS integration via `classNames` prop
- Production-ready with comprehensive props and customization options

# Chakra UI - Avatar Component

## Component Overview

The Chakra UI Avatar component represents user identities through profile pictures, text initials, or fallback icons. It provides a flexible, accessible way to display user profiles with automatic fallback handling, grouping capabilities, and status indicators.

**Core purpose**: Display user profile pictures with intelligent fallback to initials or icons when images are unavailable. Provides visual identity representation across applications with consistent sizing and accessible implementation.

**Architecture**: Composition-based system with three main exports: `Avatar` (main component), `AvatarBadge` (status indicator wrapper), and `AvatarGroup` (container for multiple avatars). In v3, uses subcomponents: `Avatar.Root`, `Avatar.Image`, and `Avatar.Fallback` following Ark UI patterns.

**Common use cases**: User profile displays, comment author attribution, team member lists, conversation participants, online status indicators, account switchers, collaborative editing presence.

## Usage Patterns

### Content Patterns

#### Image Display
The primary avatar mode displays profile photos with proper image scaling:

```jsx
import { Avatar } from '@chakra-ui/react'

// Basic image avatar
<Avatar src="https://bit.ly/sage-adebayo" />

// With accessible name for alt text
<Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
```

**Behavior**:
- Uses `object-fit: cover` for proper image scaling within circular/square bounds
- Image loads asynchronously with fallback during loading
- Automatically generates alt text from `name` prop for accessibility

#### Text/Initials Display
When no image is provided or image fails to load, displays user initials:

```jsx
// Generates "SA" initials with random accessible background color
<Avatar name="Segun Adebayo" />

// Custom initials generation
<Avatar
  name="Segun Adebayo"
  getInitials={(name) => name.split(' ').map(n => n[0]).join('')}
/>
```

**Behavior**:
- Automatically extracts initials from `name` prop (first letter of each word)
- Displays initials in uppercase with medium font weight
- Generates accessible background color based on name hash
- Custom `getInitials` function allows custom initial extraction logic

#### Icon Fallback
Default icon displays when neither image nor name is available:

```jsx
// Default user icon fallback
<Avatar />

// Custom fallback icon
<Avatar icon={<CustomUserIcon />} />
```

**Behavior**:
- Shows default user icon when no name or image provided
- Custom icons can replace default fallback
- Icon automatically sized relative to avatar dimensions

#### Fallback States
Intelligent fallback system with automatic state transitions:

```jsx
// v3 explicit fallback control
<Avatar.Root>
  <Avatar.Image src="https://example.com/photo.jpg" />
  <Avatar.Fallback>SA</Avatar.Fallback>
</Avatar.Root>

// Fallback with custom background
<Avatar name="Segun Adebayo" bg="teal.500" />
```

**State flow**:
1. Initial render: Shows fallback during image load
2. Image loads: Transitions to image display
3. Image error: Returns to fallback (initials or icon)
4. Data attributes track state: `data-state="visible|hidden"` on Image and Fallback

### Type Patterns

#### Single Avatar
Individual user representation:

```jsx
// Basic single avatar
<Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />

// With size control
<Avatar
  size="xl"
  name="Kent Dodds"
  src="https://bit.ly/kent-c-dodds"
/>

// With custom styling
<Avatar
  name="Ryan Florence"
  src="https://bit.ly/ryan-florence"
  showBorder
  borderColor="blue.500"
/>
```

#### Group/Multiple Avatars
Stacked avatar display for teams or multiple users:

```jsx
import { AvatarGroup } from '@chakra-ui/react'

// Basic group
<AvatarGroup>
  <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
  <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
  <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
  <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
</AvatarGroup>

// With size and spacing control
<AvatarGroup size="md" spacing="-1rem">
  <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
  <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
  <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
</AvatarGroup>
```

**Behavior**:
- Avatars overlap with negative spacing for compact display
- Borders automatically added to distinguish overlapping avatars
- Border color matches background for visual separation
- Uses `data-group-item` attribute with `border-width: 2px`

#### Stacked with Overflow
Limited display with overflow count:

```jsx
// Show max 3 avatars, display "+2" for overflow
<AvatarGroup max={3}>
  <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
  <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
  <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
  <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
  <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
</AvatarGroup>
```

**Behavior**:
- `max` prop limits visible avatars
- Excess count displayed as "+N" label in avatar style
- Overflow avatar uses theme styling from `excessLabel` part
- All avatars still present in DOM for accessibility

### Shape Patterns

#### Circle (Default)
Standard circular avatars:

```jsx
// Default circular shape
<Avatar name="Segun Adebayo" />

// v3 with custom CSS variable
<Avatar
  style={{ '--avatar-radius': 'var(--chakra-radii-full)' }}
  name="Segun Adebayo"
/>
```

**Styling**:
- Uses `border-radius: 9999px` or `--avatar-radius: var(--chakra-radii-full)`
- Default shape across all Chakra UI versions
- Consistent circular appearance regardless of image aspect ratio

#### Square
Sharp cornered avatars:

```jsx
// Custom square avatar (v2)
<Avatar
  name="Segun Adebayo"
  borderRadius="0"
/>

// v3 with CSS variable
<Avatar
  style={{ '--avatar-radius': '0' }}
  name="Segun Adebayo"
/>
```

#### Rounded/Soft Square
Slightly rounded corners for softer appearance:

```jsx
// Rounded corners (v2)
<Avatar
  name="Segun Adebayo"
  borderRadius="md"
/>

// v3 with CSS variable
<Avatar
  style={{ '--avatar-radius': 'var(--chakra-radii-md)' }}
  name="Segun Adebayo"
/>
```

**Common radius values**:
- `full`: Perfect circle (9999px)
- `md`: Medium rounded (0.375rem / 6px)
- `lg`: Large rounded (0.5rem / 8px)
- `xl`: Extra large rounded (0.75rem / 12px)
- `0`: Sharp square corners

### State Patterns

#### Loading State
Image loading with fallback display:

```jsx
// Automatic loading state (v3)
<Avatar.Root>
  <Avatar.Image src="https://example.com/photo.jpg" />
  <Avatar.Fallback>
    <Spinner size="sm" />
  </Avatar.Fallback>
</Avatar.Root>

// With status change callback
<Avatar.Root
  onStatusChange={(details) => console.log('Loading status:', details.status)}
>
  <Avatar.Image src="https://example.com/photo.jpg" />
  <Avatar.Fallback>Loading...</Avatar.Fallback>
</Avatar.Root>
```

**Behavior**:
- Fallback displays during image load
- Smooth transition when image loads successfully
- `onStatusChange` callback provides loading status
- Data attributes: `data-state="visible|hidden"` on Image/Fallback

#### Error State
Image load failure handling:

```jsx
// Automatic error fallback
<Avatar name="Segun Adebayo" src="invalid-url.jpg" />

// Custom error fallback
<Avatar
  name="Segun Adebayo"
  src="invalid-url.jpg"
  icon={<WarningIcon />}
/>

// Programmatic error state (v3)
const avatar = useAvatar()
avatar.setError() // Manually trigger error state
```

**Behavior**:
- Automatically displays initials/icon when image fails
- No visual error indication by default (graceful degradation)
- Can programmatically control error state via context API

#### Status/Presence Indicators
Online/offline/busy status badges:

```jsx
import { AvatarBadge } from '@chakra-ui/react'

// Online status (green badge)
<Avatar>
  <AvatarBadge boxSize="1.25em" bg="green.500" />
</Avatar>

// Offline status (gray badge)
<Avatar>
  <AvatarBadge boxSize="1.25em" bg="gray.400" />
</Avatar>

// Busy status (red badge)
<Avatar>
  <AvatarBadge boxSize="1.25em" bg="red.500" />
</Avatar>

// Custom status with border
<Avatar>
  <AvatarBadge
    boxSize="1.25em"
    bg="green.500"
    borderColor="white"
    borderWidth="2px"
  />
</Avatar>
```

**Behavior**:
- Badge positioned at bottom-right corner
- Use `em` units for sizing relative to avatar (recommended)
- Border typically matches background color for separation
- Common pattern: green=online, gray=offline, red=busy, yellow=away

### Variation Patterns

#### Size Variations
Seven standard size options:

```jsx
import { Stack } from '@chakra-ui/react'

// All size variants (v2)
<Stack direction="row" spacing={4}>
  <Avatar size="2xs" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  <Avatar size="xs" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  <Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  <Avatar size="md" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  <Avatar size="lg" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  <Avatar size="xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
  <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
</Stack>

// v3 custom size via CSS variable
<Avatar
  style={{ '--avatar-size': '80px' }}
  name="Custom Size"
/>
```

**Size reference**:
- `2xs`: Smallest, compact inline display
- `xs`: Extra small, list items
- `sm`: Small, dense layouts
- `md`: Medium, default size (2.5rem / 40px in v3)
- `lg`: Large, prominent display
- `xl`: Extra large, profile headers
- `2xl`: Largest, hero sections

**CSS variables (v3)**:
- `--avatar-size`: Overall dimensions (default: `var(--chakra-sizes-10)`)
- `--avatar-font-size`: Initials font size (default: `var(--chakra-font-sizes-md)`)

#### Color Variations
Custom color schemes and backgrounds:

```jsx
// Custom background color
<Avatar name="Segun Adebayo" bg="teal.500" />

// Color scheme (v2)
<Avatar name="Segun Adebayo" colorScheme="purple" />

// Multiple color variations
<Stack direction="row" spacing={4}>
  <Avatar name="Dan Abrahmov" bg="red.500" />
  <Avatar name="Kent Dodds" bg="blue.500" />
  <Avatar name="Ryan Florence" bg="purple.500" />
  <Avatar name="Segun Adebayo" bg="green.500" />
</Stack>

// v3 with color palette system
<Avatar
  style={{
    '--avatar-bg': 'var(--chakra-colors-purple-subtle)',
    '--avatar-color': 'var(--chakra-colors-purple-fg)'
  }}
  name="Segun Adebayo"
/>
```

**Behavior**:
- Default: Random accessible color based on name hash
- Custom `bg` prop overrides default color
- Uses color palette with `-muted`, `-fg`, `-subtle` variants in v3
- Ensures proper contrast for accessibility

#### Border Variations
Border styling for visual emphasis:

```jsx
// With border
<Avatar name="Segun Adebayo" showBorder />

// Custom border color
<Avatar
  name="Segun Adebayo"
  showBorder
  borderColor="blue.500"
/>

// Custom border width
<Avatar
  name="Segun Adebayo"
  borderWidth="3px"
  borderColor="purple.500"
/>

// Group borders (automatic)
<AvatarGroup>
  <Avatar name="Dan Abrahmov" />
  <Avatar name="Kent Dodds" />
</AvatarGroup>
```

**Behavior**:
- `showBorder` adds default border
- Borders automatically added in `AvatarGroup` for separation
- Border color typically matches background (`var(--chakra-colors-bg)`)
- Group items have `border-width: 2px` via `data-group-item` attribute

#### Badge/Status Variations
Different badge styles for various states:

```jsx
// Simple dot indicator
<Avatar>
  <AvatarBadge boxSize="1em" bg="green.500" />
</Avatar>

// Badge with border for contrast
<Avatar>
  <AvatarBadge
    boxSize="1.25em"
    bg="green.500"
    borderColor="white"
    borderWidth="2px"
  />
</Avatar>

// Custom badge content (icon or number)
<Avatar>
  <AvatarBadge
    boxSize="1.5em"
    bg="red.500"
    fontSize="xs"
  >
    3
  </AvatarBadge>
</Avatar>

// Multiple states
<Stack direction="row" spacing={4}>
  <Avatar name="Online User">
    <AvatarBadge boxSize="1.25em" bg="green.500" />
  </Avatar>
  <Avatar name="Away User">
    <AvatarBadge boxSize="1.25em" bg="yellow.500" />
  </Avatar>
  <Avatar name="Busy User">
    <AvatarBadge boxSize="1.25em" bg="red.500" />
  </Avatar>
  <Avatar name="Offline User">
    <AvatarBadge boxSize="1.25em" bg="gray.400" />
  </Avatar>
</Stack>
```

**Common patterns**:
- Online: Green badge (green.500)
- Away: Yellow/amber badge (yellow.500)
- Busy/DND: Red badge (red.500)
- Offline: Gray badge (gray.400)
- Notification count: Red badge with number

### Interactive Patterns

#### Clickable Avatars
Avatars as navigation or action triggers:

```jsx
import { Link } from '@chakra-ui/react'

// Avatar as link
<Link href="/profile/segun">
  <Avatar
    name="Segun Adebayo"
    src="https://bit.ly/sage-adebayo"
    cursor="pointer"
    _hover={{ opacity: 0.8 }}
  />
</Link>

// Avatar as button
<Avatar
  as="button"
  name="Segun Adebayo"
  onClick={() => console.log('Avatar clicked')}
  cursor="pointer"
  _hover={{ transform: 'scale(1.05)' }}
  _active={{ transform: 'scale(0.95)' }}
/>

// With focus styles
<Avatar
  as="button"
  name="Segun Adebayo"
  _focusVisible={{
    outline: '2px solid',
    outlineColor: 'blue.500',
    outlineOffset: '2px'
  }}
/>
```

**Behavior**:
- Use `as` prop to render as button or link
- Add cursor and hover states for interactivity
- Focus-visible styles for keyboard navigation
- Smooth transitions enhance user experience

#### Tooltip Integration
Additional context on hover:

```jsx
import { Tooltip } from '@chakra-ui/react'

// Avatar with tooltip
<Tooltip label="Segun Adebayo - Software Engineer">
  <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
</Tooltip>

// Group with individual tooltips
<AvatarGroup>
  <Tooltip label="Ryan Florence">
    <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
  </Tooltip>
  <Tooltip label="Segun Adebayo">
    <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
  </Tooltip>
  <Tooltip label="Kent Dodds">
    <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
  </Tooltip>
</AvatarGroup>
```

**Behavior**:
- Provides additional user information on hover
- Works seamlessly with individual and grouped avatars
- Maintains accessibility with proper ARIA labels

#### Upload/Change Profile Picture
Interactive avatar for profile picture updates:

```jsx
import { IconButton } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

// Avatar with edit overlay
<Box position="relative" display="inline-block">
  <Avatar
    size="2xl"
    name="Segun Adebayo"
    src="https://bit.ly/sage-adebayo"
  />
  <IconButton
    position="absolute"
    bottom="0"
    right="0"
    icon={<EditIcon />}
    size="sm"
    colorScheme="blue"
    borderRadius="full"
    aria-label="Change profile picture"
    onClick={handleUpload}
  />
</Box>

// Clickable avatar for upload
<Avatar
  as="label"
  htmlFor="avatar-upload"
  size="2xl"
  name="Segun Adebayo"
  cursor="pointer"
  _hover={{ opacity: 0.8 }}
>
  <input
    id="avatar-upload"
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
</Avatar>
```

**Common patterns**:
- Edit button overlay for profile picture changes
- Click entire avatar to trigger file picker
- Visual feedback on hover/interaction
- File input hidden with label association

## Key Properties/Props

### Avatar Props (v2)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `undefined` | Name used for generating initials and accessible alt text |
| `src` | `string` | `undefined` | Image source URL for profile picture |
| `size` | `"2xs" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Size of the avatar |
| `showBorder` | `boolean` | `false` | Add border around avatar |
| `borderColor` | `string` | `undefined` | Border color (uses theme colors) |
| `bg` | `string` | Auto-generated | Background color for fallback (uses theme colors) |
| `color` | `string` | `undefined` | Text color for initials |
| `icon` | `ReactElement` | `<UserIcon />` | Custom fallback icon when no name or image |
| `iconLabel` | `string` | `"avatar"` | Accessible label for fallback icon |
| `getInitials` | `(name: string) => string` | Default extractor | Function to customize initial generation from name |
| `loading` | `"eager" \| "lazy"` | `"eager"` | Image loading strategy |
| `ignoreFallback` | `boolean` | `false` | Skip fallback and show image immediately |
| `borderRadius` | `string \| number` | `"full"` | Border radius (full=circle, md/lg=rounded, 0=square) |
| `colorScheme` | `string` | `undefined` | Color scheme from theme |

### Avatar.Root Props (v3)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onStatusChange` | `(details: { status: 'loading' \| 'loaded' \| 'error' }) => void` | `undefined` | Callback when image loading status changes |
| `ids` | `{ root?: string, image?: string, fallback?: string }` | `undefined` | Custom element IDs |
| `asChild` | `boolean` | `false` | Enable composition with custom elements |

### Avatar.Image Props (v3)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | Required | Image source URL |
| `asChild` | `boolean` | `false` | Enable composition pattern |

**Data attributes**:
- `data-scope="avatar"`
- `data-part="image"`
- `data-state="visible|hidden"` (visible when loaded, hidden during load or error)

### Avatar.Fallback Props (v3)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `undefined` | Fallback content (initials, icon, or custom) |
| `asChild` | `boolean` | `false` | Enable composition pattern |

**Data attributes**:
- `data-scope="avatar"`
- `data-part="fallback"`
- `data-state="visible|hidden"` (visible during load or error, hidden when image loads)

### AvatarGroup Props (v2)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | `undefined` | Maximum number of avatars to display before showing "+N" |
| `size` | `"2xs" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Size applied to all child avatars |
| `spacing` | `string \| number` | `"-0.75rem"` | Gap between avatars (negative for overlap) |
| `children` | `ReactNode` | Required | Avatar components to display in group |

### AvatarBadge Props (v2)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `boxSize` | `string \| number` | `undefined` | Size of badge (recommend `em` units for scaling) |
| `bg` | `string` | Required | Background color for badge |
| `borderColor` | `string` | `"white"` | Border color for separation |
| `borderWidth` | `string \| number` | `"0"` | Border width |
| `placement` | `"top-start" \| "top-end" \| "bottom-start" \| "bottom-end"` | `"bottom-end"` | Position of badge on avatar |

## Code Examples

### Example 1: Basic Avatar with Image and Fallback

```jsx
import { Avatar } from '@chakra-ui/react'

export const BasicAvatar = () => {
  return (
    <>
      {/* Avatar with image */}
      <Avatar
        name="Segun Adebayo"
        src="https://bit.ly/sage-adebayo"
      />

      {/* Avatar with initials fallback */}
      <Avatar name="Segun Adebayo" />

      {/* Avatar with icon fallback */}
      <Avatar />
    </>
  )
}
```

### Example 2: Avatar Sizes

```jsx
import { Avatar, Stack } from '@chakra-ui/react'

export const AvatarSizes = () => {
  return (
    <Stack direction="row" spacing={4}>
      <Avatar size="2xs" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      <Avatar size="xs" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      <Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      <Avatar size="md" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      <Avatar size="lg" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      <Avatar size="xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
    </Stack>
  )
}
```

### Example 3: Avatar Group

```jsx
import { Avatar, AvatarGroup } from '@chakra-ui/react'

export const BasicAvatarGroup = () => {
  return (
    <AvatarGroup size="md" spacing="-1rem">
      <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
      <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
      <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
      <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
      <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
    </AvatarGroup>
  )
}
```

### Example 4: Avatar Group with Max Limit

```jsx
import { Avatar, AvatarGroup } from '@chakra-ui/react'

export const AvatarGroupMax = () => {
  return (
    <AvatarGroup size="md" max={3}>
      <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
      <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
      <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
      <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
      <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
    </AvatarGroup>
  )
}
```

### Example 5: Avatar with Status Badge

```jsx
import { Avatar, AvatarBadge } from '@chakra-ui/react'

export const AvatarWithBadge = () => {
  return (
    <>
      {/* Online status */}
      <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo">
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>

      {/* With border for separation */}
      <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds">
        <AvatarBadge
          boxSize="1.25em"
          bg="green.500"
          borderColor="white"
          borderWidth="2px"
        />
      </Avatar>
    </>
  )
}
```

### Example 6: Avatar Status Variations

```jsx
import { Avatar, AvatarBadge, Stack } from '@chakra-ui/react'

export const AvatarStatusVariations = () => {
  return (
    <Stack direction="row" spacing={4}>
      {/* Online */}
      <Avatar name="Online User">
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>

      {/* Away */}
      <Avatar name="Away User">
        <AvatarBadge boxSize="1.25em" bg="yellow.500" />
      </Avatar>

      {/* Busy */}
      <Avatar name="Busy User">
        <AvatarBadge boxSize="1.25em" bg="red.500" />
      </Avatar>

      {/* Offline */}
      <Avatar name="Offline User">
        <AvatarBadge boxSize="1.25em" bg="gray.400" />
      </Avatar>
    </Stack>
  )
}
```

### Example 7: Avatar Color Variations

```jsx
import { Avatar, Stack } from '@chakra-ui/react'

export const AvatarColors = () => {
  return (
    <Stack direction="row" spacing={4}>
      <Avatar name="Dan Abrahmov" bg="red.500" />
      <Avatar name="Kent Dodds" bg="blue.500" />
      <Avatar name="Ryan Florence" bg="purple.500" />
      <Avatar name="Segun Adebayo" bg="green.500" />
      <Avatar name="Prosper Otemuyiwa" bg="orange.500" />
    </Stack>
  )
}
```

### Example 8: Avatar Shape Variations

```jsx
import { Avatar, Stack } from '@chakra-ui/react'

export const AvatarShapes = () => {
  return (
    <Stack direction="row" spacing={4}>
      {/* Circle (default) */}
      <Avatar
        name="Segun Adebayo"
        src="https://bit.ly/sage-adebayo"
        borderRadius="full"
      />

      {/* Rounded */}
      <Avatar
        name="Segun Adebayo"
        src="https://bit.ly/sage-adebayo"
        borderRadius="md"
      />

      {/* Square */}
      <Avatar
        name="Segun Adebayo"
        src="https://bit.ly/sage-adebayo"
        borderRadius="0"
      />
    </Stack>
  )
}
```

### Example 9: Clickable Avatar

```jsx
import { Avatar } from '@chakra-ui/react'

export const ClickableAvatar = () => {
  return (
    <Avatar
      as="button"
      name="Segun Adebayo"
      src="https://bit.ly/sage-adebayo"
      onClick={() => console.log('Avatar clicked')}
      cursor="pointer"
      _hover={{
        opacity: 0.8,
        transform: 'scale(1.05)'
      }}
      _active={{
        transform: 'scale(0.95)'
      }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'blue.500',
        outlineOffset: '2px'
      }}
    />
  )
}
```

### Example 10: Avatar with Tooltip

```jsx
import { Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react'

export const AvatarWithTooltip = () => {
  return (
    <AvatarGroup>
      <Tooltip label="Ryan Florence - Co-founder of Remix">
        <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
      </Tooltip>

      <Tooltip label="Segun Adebayo - Creator of Chakra UI">
        <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
      </Tooltip>

      <Tooltip label="Kent Dodds - Educator & OSS Developer">
        <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
      </Tooltip>
    </AvatarGroup>
  )
}
```

### Example 11: Avatar v3 with Programmatic Control

```jsx
import { Avatar, useAvatar } from '@chakra-ui/react'

export const AvatarProgrammaticControl = () => {
  return (
    <Avatar.Root
      onStatusChange={(details) => {
        console.log('Status changed:', details.status)
      }}
    >
      <Avatar.Image src="https://bit.ly/sage-adebayo" />
      <Avatar.Fallback>SA</Avatar.Fallback>
    </Avatar.Root>
  )
}
```

### Example 12: Avatar Upload Interface

```jsx
import { Avatar, Box, IconButton } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { useState } from 'react'

export const AvatarUpload = () => {
  const [avatarSrc, setAvatarSrc] = useState('https://bit.ly/sage-adebayo')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarSrc(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box position="relative" display="inline-block">
      <Avatar
        size="2xl"
        name="Segun Adebayo"
        src={avatarSrc}
      />
      <IconButton
        as="label"
        htmlFor="avatar-upload"
        position="absolute"
        bottom="0"
        right="0"
        icon={<EditIcon />}
        size="sm"
        colorScheme="blue"
        borderRadius="full"
        cursor="pointer"
        aria-label="Change profile picture"
      />
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  )
}
```

## Accessibility Notes

**ARIA Implementation**:
- Image avatars include `alt` attribute derived from `name` prop
- Fallback icons have accessible labels via `iconLabel` prop
- Proper semantic HTML structure maintained
- AvatarGroup excess label announced to screen readers

**Screen Reader Support**:
- User names announced via alt text on images
- Initials announced as text content
- Status badges should include accessible labels
- Tooltip content provides additional context

**Keyboard Navigation**:
- Clickable avatars receive focus with visible focus ring
- Focus styles configurable via `_focusVisible` prop
- Tab order follows DOM structure in groups
- Standard button/link keyboard interactions when using `as` prop

**Focus Indicators**:
- Default focus-visible outline: 2px solid with 2px offset
- Customizable via `_focusVisible` pseudo prop
- High contrast focus rings for accessibility compliance
- Focus styles work in light and dark modes

**Color Accessibility**:
- Random background colors ensure WCAG contrast requirements
- All color palettes tested for accessibility
- Never rely on color alone to convey status (use labels with badges)
- Works with color blind users through distinct patterns

**Semantic HTML**:
- Uses semantic `img` elements for profile pictures
- Proper button/link semantics when interactive
- Maintains heading hierarchy in adjacent labels
- Group structure preserves avatar relationships

## Common Patterns

1. **User Profile Header**: Large avatar with name and bio, edit button overlay
2. **Comment Attribution**: Small avatar with username inline in comment threads
3. **Team Member Grid**: Grid of large avatars with names and roles, clickable for profiles
4. **Online Presence List**: Avatar group with status badges showing online/offline users
5. **Conversation Participants**: Stacked avatar group with max limit showing "you + 3 others"
6. **Account Switcher**: Clickable avatars in dropdown for multi-account switching
7. **Collaborative Editing**: Small avatars showing active users on document with tooltips
8. **Recent Activity**: Timeline of avatars showing user actions with timestamps
9. **File Upload Preview**: Large avatar as upload target with drag-and-drop support
10. **Search Results**: Small avatars in user search results with name highlighting

## Related Components

- **Avatar** - Main user identity display component (primary component)
- **AvatarBadge** - Status indicator positioned on avatar corner
- **AvatarGroup** - Container for displaying multiple avatars with overlap
- **Tooltip** - Provides additional user information on hover
- **Badge** - Alternative for status indicators and counts
- **Image** - Underlying image component for photo display
- **Icon** - Fallback icon component for default state
- **Box** - Container for custom avatar compositions
- **Button** - Interactive wrapper for clickable avatars
- **Menu** - Dropdown menu triggered by avatar click

---

**Research completed:** 2025-11-05
**Component:** Avatar
**Framework:** Chakra UI
**Documentation:** https://chakra-ui.com/docs/components/avatar (v3) and https://v2.chakra-ui.com/docs/components/avatar (v2)

**Notable Features:**
- Intelligent fallback system: image → initials → icon with automatic state transitions
- Built-in accessibility with auto-generated alt text from name prop
- Seven standardized size options from 2xs to 2xl
- AvatarGroup with overflow management and customizable spacing
- AvatarBadge for status indicators with relative sizing using em units
- Composition-based architecture in v3 with Ark UI foundation
- Programmatic control via context API in v3 (useAvatar hook)
- CSS custom properties for flexible styling (--avatar-size, --avatar-radius, --avatar-font-size)
- Random accessible background colors generated from name hash
- Seamless integration with other Chakra components (Tooltip, Button, Menu)

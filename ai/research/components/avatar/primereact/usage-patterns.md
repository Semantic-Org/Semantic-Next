# PrimeReact - Avatar Component

## Component Overview

The Avatar component in PrimeReact represents people using icons, labels, and images. It is a versatile UI element designed to display user representations in multiple formats - from simple initials to profile pictures. The component excels in user identification contexts such as profile displays, comment sections, team member lists, and messaging interfaces.

**Core purpose**: Visual representation of users, contacts, or entities through images, text labels, or icons, providing instant recognition in UI layouts.

**Architecture**: A standalone component that supports three content modes (label, icon, image) with optional grouping capabilities via AvatarGroup. The component is highly customizable through inline styles and CSS classes.

**Common use cases**: User profiles, contact lists, comment authors, team member displays, chat participants, notification indicators (when paired with Badge), and user selection interfaces.

---

## Usage Patterns

### Basic Usage - Label Avatar

Display user initials or single characters using the `label` property:

```jsx
import { Avatar } from 'primereact/avatar';

// Simple label avatar
<Avatar label="P" />

// Label avatar with size
<Avatar label="P" size="xlarge" />

// Multiple label avatars with different initials
<Avatar label="A" />
<Avatar label="B" />
<Avatar label="C" />
```

### Icon-Based Avatars

Use font icons (PrimeIcons) as avatar content:

```jsx
import { Avatar } from 'primereact/avatar';

// Simple icon avatar
<Avatar icon="pi pi-user" />

// Icon avatar with size
<Avatar icon="pi pi-user" size="xlarge" />

// Custom styled icon avatar
<Avatar
  icon="pi pi-user"
  size="large"
  style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
/>
```

### Image-Based Avatars

Display profile pictures or photos:

```jsx
import { Avatar } from 'primereact/avatar';

// Local image
<Avatar image="/images/avatar/amyelsner.png" size="xlarge" />

// Remote image (URL)
<Avatar image="https://www.gravatar.com/avatar/example" />

// Image with circle shape
<Avatar image="/images/avatar/amyelsner.png" size="xlarge" shape="circle" />

// Image with square shape (default)
<Avatar image="/images/avatar/asiyajavayant.png" size="large" />
```

---

## Variants/Styles

### Shape Variants

PrimeReact Avatar supports two shape options:

**Circle Shape**:
```jsx
// Circular avatar
<Avatar label="P" shape="circle" />
<Avatar icon="pi pi-user" shape="circle" />
<Avatar image="/images/avatar/user.png" shape="circle" />
```

**Square Shape (Default)**:
```jsx
// Square/rounded avatar (default when shape not specified)
<Avatar label="P" />
<Avatar icon="pi pi-user" />
<Avatar image="/images/avatar/user.png" />
```

### Color Customization

Custom colors via inline styles:

```jsx
// Blue background with white text
<Avatar
  label="V"
  style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
/>

// Green background with white icon
<Avatar
  icon="pi pi-user"
  style={{ backgroundColor: '#4CAF50', color: '#ffffff' }}
/>

// Custom background colors for different users
<Avatar label="A" style={{ backgroundColor: '#9C27B0', color: '#fff' }} />
<Avatar label="B" style={{ backgroundColor: '#FF5722', color: '#fff' }} />
<Avatar label="C" style={{ backgroundColor: '#00BCD4', color: '#fff' }} />
```

### CSS Class Styling

Apply custom CSS classes for advanced styling:

```jsx
// Custom CSS class
<Avatar label="P" className="custom-avatar-class" />

// PrimeFlex utility classes
<Avatar
  label="U"
  className="mr-2"
/>

// Multiple classes
<Avatar
  icon="pi pi-user"
  className="custom-avatar shadow-3"
/>
```

---

## States

### Default State

Standard avatar display without special states:

```jsx
// Label avatar - default state
<Avatar label="P" />

// Icon avatar - default state
<Avatar icon="pi pi-user" />

// Image avatar - default state
<Avatar image="/images/avatar/user.png" />
```

### With Badge State

Add notification indicators using Badge component:

```jsx
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

// Avatar with notification count
<Avatar label="U" className="p-overlay-badge">
  <Badge value="4" />
</Avatar>

// Avatar with severity indicator
<Avatar icon="pi pi-user" className="p-overlay-badge">
  <Badge value="2" severity="danger" />
</Avatar>

// Image avatar with badge
<Avatar image="/images/avatar/user.png" shape="circle" className="p-overlay-badge">
  <Badge value="5" />
</Avatar>
```

### No Special Interactive States

PrimeReact Avatar does not include built-in interactive states (hover, focus, active, disabled) by default. The component is primarily presentational and "does not include any roles and attributes by default" and contains "no interactive elements."

---

## Sizing Options

PrimeReact Avatar supports multiple size variants through the `size` prop:

**Available Sizes**:
- `xlarge` - Extra large size
- `large` - Large size
- Default (medium) - When size prop is omitted

```jsx
// Extra large avatar
<Avatar label="P" size="xlarge" />

// Large avatar
<Avatar label="M" size="large" />

// Default size (medium)
<Avatar label="S" />

// Size comparison
<Avatar icon="pi pi-user" size="xlarge" />
<Avatar icon="pi pi-user" size="large" />
<Avatar icon="pi pi-user" />
```

### Size with Different Content Types

```jsx
// Label avatars with sizes
<Avatar label="XL" size="xlarge" />
<Avatar label="L" size="large" />
<Avatar label="M" />

// Icon avatars with sizes
<Avatar icon="pi pi-user" size="xlarge" />
<Avatar icon="pi pi-user" size="large" />
<Avatar icon="pi pi-user" />

// Image avatars with sizes
<Avatar image="/images/avatar/user1.png" size="xlarge" shape="circle" />
<Avatar image="/images/avatar/user2.png" size="large" shape="circle" />
<Avatar image="/images/avatar/user3.png" shape="circle" />
```

---

## Layout & Positioning

### Inline Avatars

Display avatars inline with other content:

```jsx
import { Avatar } from 'primereact/avatar';

function UserProfile() {
  return (
    <div className="flex align-items-center">
      <Avatar label="P" className="mr-2" />
      <span>Peter Johnson</span>
    </div>
  );
}
```

### Avatar Groups

Stack multiple avatars together using AvatarGroup:

```jsx
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';

// Basic avatar group
<AvatarGroup>
  <Avatar image="/images/avatar/amyelsner.png" size="large" shape="circle" />
  <Avatar image="/images/avatar/asiyajavayant.png" size="large" shape="circle" />
  <Avatar image="/images/avatar/onyamalimba.png" size="large" shape="circle" />
</AvatarGroup>

// Avatar group with overflow indicator
<AvatarGroup>
  <Avatar image="/images/avatar/amyelsner.png" size="large" shape="circle" />
  <Avatar image="/images/avatar/asiyajavayant.png" size="large" shape="circle" />
  <Avatar image="/images/avatar/onyamalimba.png" size="large" shape="circle" />
  <Avatar label="+2" shape="circle" size="large" />
</AvatarGroup>

// Mixed content in avatar group
<AvatarGroup>
  <Avatar image="/images/avatar/user1.png" shape="circle" />
  <Avatar image="/images/avatar/user2.png" shape="circle" />
  <Avatar label="JD" shape="circle" />
  <Avatar icon="pi pi-user" shape="circle" />
  <Avatar label="+5" shape="circle" />
</AvatarGroup>
```

### Grid Layout

Display avatars in grid arrangements:

```jsx
function AvatarGrid() {
  return (
    <div className="grid">
      <div className="col-3">
        <Avatar label="A" size="large" shape="circle" />
      </div>
      <div className="col-3">
        <Avatar label="B" size="large" shape="circle" />
      </div>
      <div className="col-3">
        <Avatar label="C" size="large" shape="circle" />
      </div>
      <div className="col-3">
        <Avatar label="D" size="large" shape="circle" />
      </div>
    </div>
  );
}
```

### List Layout

Avatars in list items:

```jsx
function UserList() {
  const users = [
    { name: 'Amy Elsner', image: '/images/avatar/amyelsner.png' },
    { name: 'Asiya Javayant', image: '/images/avatar/asiyajavayant.png' },
    { name: 'Onyama Limba', image: '/images/avatar/onyamalimba.png' }
  ];

  return (
    <ul className="list-none p-0">
      {users.map((user, index) => (
        <li key={index} className="flex align-items-center p-3">
          <Avatar image={user.image} shape="circle" className="mr-3" />
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  );
}
```

---

## Content & Structure

### Label Content

Display text, initials, or abbreviations:

```jsx
// Single letter
<Avatar label="P" />

// Two letter initials
<Avatar label="AB" />

// Abbreviations
<Avatar label="CEO" />
<Avatar label="CTO" />
<Avatar label="CFO" />

// Numbers
<Avatar label="1" />
<Avatar label="+5" />
```

### Icon Content

Use PrimeIcons or custom icon fonts:

```jsx
// User icon
<Avatar icon="pi pi-user" />

// Other PrimeIcons
<Avatar icon="pi pi-star" />
<Avatar icon="pi pi-heart" />
<Avatar icon="pi pi-briefcase" />
<Avatar icon="pi pi-building" />
<Avatar icon="pi pi-users" />

// Custom icon classes
<Avatar icon="custom-icon-class" />
```

### Image Content

Display photographs and profile pictures:

```jsx
// Local file path
<Avatar image="/images/avatar/amyelsner.png" />

// Absolute URL
<Avatar image="https://example.com/avatar.jpg" />

// Gravatar URL
<Avatar image="https://www.gravatar.com/avatar/hash" />

// Data URI
<Avatar image="data:image/png;base64,..." />
```

### Empty/Placeholder Content

When no content is specified, avatar displays empty:

```jsx
// Empty avatar (no label, icon, or image)
<Avatar />

// Can be styled as placeholder
<Avatar style={{ backgroundColor: '#e0e0e0' }} />
```

---

## Interactive Features

### Badge Integration

Add notification indicators to avatars:

```jsx
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

// Notification count badge
<Avatar label="U" className="p-overlay-badge">
  <Badge value="4" />
</Avatar>

// Status badge with severity
<Avatar icon="pi pi-user" className="p-overlay-badge">
  <Badge value="!" severity="danger" />
</Avatar>

// Multiple avatars with badges
<div className="flex gap-3">
  <Avatar image="/images/avatar/user1.png" shape="circle" className="p-overlay-badge">
    <Badge value="5" />
  </Avatar>
  <Avatar image="/images/avatar/user2.png" shape="circle" className="p-overlay-badge">
    <Badge value="2" severity="warning" />
  </Avatar>
  <Avatar image="/images/avatar/user3.png" shape="circle" className="p-overlay-badge">
    <Badge value="10" severity="success" />
  </Avatar>
</div>
```

### Click Handling

Add click handlers for interactive avatars:

```jsx
function InteractiveAvatar() {
  const handleClick = (user) => {
    console.log('Avatar clicked:', user);
  };

  return (
    <Avatar
      label="P"
      onClick={() => handleClick('Peter')}
      style={{ cursor: 'pointer' }}
    />
  );
}
```

### Tooltip Integration

Add tooltips for additional information:

```jsx
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';

function AvatarWithTooltip() {
  return (
    <>
      <Avatar
        label="P"
        data-pr-tooltip="Peter Johnson"
        data-pr-position="top"
      />
      <Tooltip target=".p-avatar" />
    </>
  );
}
```

---

## Animation & Transitions

PrimeReact Avatar does not include built-in animations. Custom animations can be added via CSS:

```jsx
// Custom CSS animation
<Avatar
  label="P"
  className="animated-avatar"
  style={{
    transition: 'all 0.3s ease',
  }}
/>

// Hover animation via CSS
<style>
{`
  .animated-avatar:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`}
</style>
```

---

## Integration Patterns

### With User Cards

```jsx
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function UserCard() {
  return (
    <Card>
      <div className="flex flex-column align-items-center">
        <Avatar
          image="/images/avatar/amyelsner.png"
          size="xlarge"
          shape="circle"
        />
        <h3 className="mt-3 mb-2">Amy Elsner</h3>
        <p className="text-color-secondary">Product Designer</p>
        <Button label="View Profile" />
      </div>
    </Card>
  );
}
```

### With DataTable

```jsx
import { Avatar } from 'primereact/avatar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function UsersTable() {
  const users = [
    { name: 'Amy Elsner', email: 'amy@example.com', avatar: '/images/avatar/amyelsner.png' },
    { name: 'Asiya Javayant', email: 'asiya@example.com', avatar: '/images/avatar/asiyajavayant.png' }
  ];

  const avatarTemplate = (rowData) => {
    return <Avatar image={rowData.avatar} shape="circle" />;
  };

  return (
    <DataTable value={users}>
      <Column field="avatar" header="Photo" body={avatarTemplate} />
      <Column field="name" header="Name" />
      <Column field="email" header="Email" />
    </DataTable>
  );
}
```

### With Menu

```jsx
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

function UserMenu() {
  const items = [
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Settings', icon: 'pi pi-cog' },
    { label: 'Logout', icon: 'pi pi-sign-out' }
  ];

  return (
    <div className="flex align-items-center">
      <Avatar
        image="/images/avatar/user.png"
        shape="circle"
        className="mr-2"
      />
      <Menu model={items} popup />
    </div>
  );
}
```

### With Chat Interface

```jsx
import { Avatar } from 'primereact/avatar';

function ChatMessage({ message, sender, avatar, timestamp }) {
  return (
    <div className="flex gap-3 p-3">
      <Avatar image={avatar} shape="circle" />
      <div className="flex-1">
        <div className="flex justify-content-between">
          <strong>{sender}</strong>
          <span className="text-sm text-color-secondary">{timestamp}</span>
        </div>
        <p className="mt-2">{message}</p>
      </div>
    </div>
  );
}
```

### With Comment Section

```jsx
import { Avatar } from 'primereact/avatar';

function Comment({ author, avatar, content, time }) {
  return (
    <div className="flex gap-3 mb-3">
      <Avatar image={avatar} shape="circle" />
      <div className="flex-1">
        <div className="flex align-items-center gap-2 mb-1">
          <strong>{author}</strong>
          <span className="text-sm text-color-secondary">{time}</span>
        </div>
        <p>{content}</p>
      </div>
    </div>
  );
}
```

---

## Accessibility Features

### Manual Accessibility Implementation Required

PrimeReact Avatar "does not include any roles and attributes by default" and contains "no interactive elements." Developers must manually add accessibility features:

**Required Attributes**:

```jsx
// Role attribute for screen readers
<Avatar
  label="P"
  role="img"
  aria-label="Profile picture of Peter Johnson"
/>

// Using aria-labelledby
<div>
  <span id="user-name" className="sr-only">Amy Elsner</span>
  <Avatar
    image="/images/avatar/amyelsner.png"
    role="img"
    aria-labelledby="user-name"
  />
</div>

// For decorative avatars (no announcement needed)
<Avatar
  icon="pi pi-user"
  role="presentation"
  aria-hidden="true"
/>
```

### Keyboard Navigation

Add keyboard support when avatars are interactive:

```jsx
function AccessibleAvatar() {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Handle activation
      console.log('Avatar activated');
    }
  };

  return (
    <Avatar
      label="P"
      tabIndex={0}
      role="button"
      aria-label="View Peter Johnson's profile"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      style={{ cursor: 'pointer' }}
    />
  );
}
```

### Focus Management

Provide visible focus indicators:

```jsx
// CSS for focus styling
<style>
{`
  .p-avatar:focus {
    outline: 2px solid #2196F3;
    outline-offset: 2px;
  }

  .p-avatar:focus-visible {
    box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.5);
  }
`}
</style>

<Avatar
  label="P"
  tabIndex={0}
  role="button"
  aria-label="User avatar"
/>
```

### Color Contrast

Ensure sufficient contrast for text and icon content:

```jsx
// Good contrast examples
<Avatar
  label="P"
  style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
  role="img"
  aria-label="P"
/>

<Avatar
  icon="pi pi-user"
  style={{ backgroundColor: '#1976D2', color: '#ffffff' }}
  role="img"
  aria-label="User icon"
/>
```

### Screen Reader Announcements

Provide meaningful descriptions:

```jsx
// Image avatar with alt-like description
<Avatar
  image="/images/avatar/amyelsner.png"
  role="img"
  aria-label="Profile photo of Amy Elsner, Product Designer"
/>

// Group avatars with description
<AvatarGroup role="list" aria-label="Team members">
  <Avatar
    image="/images/avatar/user1.png"
    role="listitem"
    aria-label="Amy Elsner"
  />
  <Avatar
    image="/images/avatar/user2.png"
    role="listitem"
    aria-label="Asiya Javayant"
  />
  <Avatar
    label="+5"
    role="listitem"
    aria-label="5 more team members"
  />
</AvatarGroup>
```

---

## Key Properties/Props

### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `null` | Text content to display (typically initials or abbreviations) |
| `icon` | `string` | `null` | Icon class name (e.g., "pi pi-user" for PrimeIcons) |
| `image` | `string` | `null` | Image URL or file path for the avatar |
| `size` | `'xlarge' \| 'large' \| 'normal'` | `'normal'` | Size of the avatar |
| `shape` | `'circle' \| 'square'` | `'square'` | Shape of the avatar |
| `style` | `object` | `null` | Inline styles object for custom styling |
| `className` | `string` | `null` | CSS class names for additional styling |
| `imageAlt` | `string` | `null` | Alt text for image avatars (for accessibility) |
| `template` | `any` | `null` | Template of the content (custom rendering) |
| `onClick` | `function` | `null` | Click event handler |

### AvatarGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `object` | `null` | Inline styles for the group container |
| `className` | `string` | `null` | CSS class names for the group container |

**Note**: AvatarGroup primarily acts as a layout container for multiple Avatar components. The visual stacking and overlap is handled through CSS.

---

## Code Examples

### Example 1: Basic Label Avatars

```jsx
import { Avatar } from 'primereact/avatar';

export function BasicLabels() {
  return (
    <div className="flex gap-3">
      <Avatar label="P" />
      <Avatar label="V" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
      <Avatar label="U" size="xlarge" />
    </div>
  );
}
```

### Example 2: Icon Avatars

```jsx
import { Avatar } from 'primereact/avatar';

export function IconAvatars() {
  return (
    <div className="flex gap-3">
      <Avatar icon="pi pi-user" />
      <Avatar icon="pi pi-user" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
      <Avatar icon="pi pi-user" size="xlarge" />
    </div>
  );
}
```

### Example 3: Image Avatars

```jsx
import { Avatar } from 'primereact/avatar';

export function ImageAvatars() {
  return (
    <div className="flex gap-3">
      <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
      <Avatar image="/images/avatar/asiyajavayant.png" size="large" shape="circle" />
      <Avatar image="/images/avatar/onyamalimba.png" size="xlarge" shape="circle" />
    </div>
  );
}
```

### Example 4: Avatar Group

```jsx
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';

export function TeamAvatars() {
  return (
    <AvatarGroup>
      <Avatar image="/images/avatar/amyelsner.png" size="large" shape="circle" />
      <Avatar image="/images/avatar/asiyajavayant.png" size="large" shape="circle" />
      <Avatar image="/images/avatar/onyamalimba.png" size="large" shape="circle" />
      <Avatar label="+2" shape="circle" size="large" />
    </AvatarGroup>
  );
}
```

### Example 5: Avatars with Badges

```jsx
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

export function AvatarsWithNotifications() {
  return (
    <div className="flex gap-3">
      <Avatar label="U" className="p-overlay-badge">
        <Badge value="4" />
      </Avatar>
      <Avatar icon="pi pi-user" className="p-overlay-badge">
        <Badge value="2" severity="danger" />
      </Avatar>
      <Avatar image="/images/avatar/user.png" shape="circle" className="p-overlay-badge">
        <Badge value="!" severity="warning" />
      </Avatar>
    </div>
  );
}
```

### Example 6: User Profile Card

```jsx
import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export function ProfileCard() {
  return (
    <Card className="text-center" style={{ width: '300px' }}>
      <Avatar
        image="/images/avatar/amyelsner.png"
        size="xlarge"
        shape="circle"
        className="mb-3"
      />
      <h3 className="mt-0 mb-2">Amy Elsner</h3>
      <p className="text-color-secondary mb-3">Product Designer</p>
      <div className="flex gap-2 justify-content-center">
        <Button label="Follow" icon="pi pi-user-plus" />
        <Button label="Message" icon="pi pi-envelope" className="p-button-outlined" />
      </div>
    </Card>
  );
}
```

### Example 7: User List with Avatars

```jsx
import { Avatar } from 'primereact/avatar';

export function UserList() {
  const users = [
    { name: 'Amy Elsner', role: 'Designer', avatar: '/images/avatar/amyelsner.png', status: 'active' },
    { name: 'Asiya Javayant', role: 'Developer', avatar: '/images/avatar/asiyajavayant.png', status: 'away' },
    { name: 'Onyama Limba', role: 'Manager', avatar: '/images/avatar/onyamalimba.png', status: 'offline' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="flex flex-column gap-3">
      {users.map((user, index) => (
        <div key={index} className="flex align-items-center p-3 border-round hover:surface-hover" style={{ cursor: 'pointer' }}>
          <div style={{ position: 'relative' }}>
            <Avatar image={user.avatar} shape="circle" size="large" />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(user.status),
                border: '2px solid white'
              }}
            />
          </div>
          <div className="ml-3 flex-1">
            <div className="font-bold">{user.name}</div>
            <div className="text-sm text-color-secondary">{user.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 8: Comment Section

```jsx
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

export function CommentSection() {
  const comments = [
    {
      author: 'Amy Elsner',
      avatar: '/images/avatar/amyelsner.png',
      content: 'This is a great feature! Really helpful for our team.',
      time: '2 hours ago'
    },
    {
      author: 'Asiya Javayant',
      avatar: '/images/avatar/asiyajavayant.png',
      content: 'I agree! The new design is much more intuitive.',
      time: '1 hour ago'
    }
  ];

  return (
    <div className="flex flex-column gap-4">
      {comments.map((comment, index) => (
        <div key={index} className="flex gap-3">
          <Avatar image={comment.avatar} shape="circle" />
          <div className="flex-1">
            <div className="flex align-items-center gap-2 mb-2">
              <strong>{comment.author}</strong>
              <span className="text-sm text-color-secondary">{comment.time}</span>
            </div>
            <p className="m-0 mb-2">{comment.content}</p>
            <div className="flex gap-2">
              <Button label="Like" icon="pi pi-thumbs-up" className="p-button-text p-button-sm" />
              <Button label="Reply" icon="pi pi-reply" className="p-button-text p-button-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 9: Chat Interface

```jsx
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export function ChatInterface() {
  const messages = [
    { sender: 'Amy Elsner', avatar: '/images/avatar/amyelsner.png', text: 'Hello! How are you?', time: '10:30 AM', own: false },
    { sender: 'You', avatar: '/images/avatar/me.png', text: 'Hi Amy! I am doing great, thanks!', time: '10:32 AM', own: true }
  ];

  return (
    <div className="flex flex-column h-full">
      <div className="flex-1 overflow-auto p-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 mb-3 ${msg.own ? 'flex-row-reverse' : ''}`}>
            <Avatar image={msg.avatar} shape="circle" />
            <div className={`flex-1 ${msg.own ? 'text-right' : ''}`}>
              <div className="flex gap-2 align-items-center mb-1" style={{ justifyContent: msg.own ? 'flex-end' : 'flex-start' }}>
                <strong>{msg.sender}</strong>
                <span className="text-sm text-color-secondary">{msg.time}</span>
              </div>
              <div
                className="inline-block p-3 border-round"
                style={{
                  backgroundColor: msg.own ? '#2196F3' : '#f5f5f5',
                  color: msg.own ? 'white' : 'inherit'
                }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 border-top-1 surface-border">
        <InputText placeholder="Type a message..." className="flex-1" />
        <Button icon="pi pi-send" />
      </div>
    </div>
  );
}
```

### Example 10: Team Selection

```jsx
import { useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';

export function TeamSelection() {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const allMembers = [
    { id: 1, name: 'Amy Elsner', avatar: '/images/avatar/amyelsner.png' },
    { id: 2, name: 'Asiya Javayant', avatar: '/images/avatar/asiyajavayant.png' },
    { id: 3, name: 'Onyama Limba', avatar: '/images/avatar/onyamalimba.png' }
  ];

  const toggleMember = (member) => {
    setSelectedMembers(prev =>
      prev.find(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
  };

  const isSelected = (member) => selectedMembers.find(m => m.id === member.id);

  return (
    <div>
      <h3>Select Team Members</h3>
      <div className="flex gap-3 mb-4">
        {allMembers.map(member => (
          <div
            key={member.id}
            onClick={() => toggleMember(member)}
            style={{
              cursor: 'pointer',
              opacity: isSelected(member) ? 1 : 0.5,
              transform: isSelected(member) ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s'
            }}
          >
            <Avatar
              image={member.avatar}
              shape="circle"
              size="large"
              style={{
                border: isSelected(member) ? '3px solid #2196F3' : 'none'
              }}
            />
            <div className="text-center text-sm mt-2">{member.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4>Selected Members ({selectedMembers.length})</h4>
        <AvatarGroup>
          {selectedMembers.map(member => (
            <Avatar
              key={member.id}
              image={member.avatar}
              shape="circle"
              size="large"
            />
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
}
```

---

## Accessibility Notes

1. **No Built-in ARIA**: Component does not include roles or attributes by default - must be manually added
2. **Role Attribute**: Add `role="img"` for image-like avatars
3. **Descriptive Labels**: Always provide `aria-label` or `aria-labelledby` to describe the avatar content
4. **Keyboard Support**: Not interactive by default - add `tabIndex`, keyboard handlers, and role when needed
5. **Focus Indicators**: Provide visible focus styling for interactive avatars
6. **Color Contrast**: Ensure sufficient contrast between text/icons and background colors
7. **Decorative Content**: Use `role="presentation"` and `aria-hidden="true"` for purely decorative avatars
8. **Alt Text**: When using images, consider adding meaningful `imageAlt` prop values
9. **Group Announcements**: For AvatarGroup, consider adding `role="list"` with appropriate item roles
10. **Status Indicators**: When using badges or status dots, ensure they have accessible text alternatives

---

## Common Patterns

1. **User Profile Display**: Large circular avatar with name and role information
2. **Comment Authors**: Small circular avatar next to comment text with timestamp
3. **Team Member Lists**: Row of circular avatars with names, often with status indicators
4. **Chat Messages**: Avatar aligned with message bubbles to identify speakers
5. **Notification Indicators**: Avatar with badge showing unread count or status
6. **Avatar Groups**: Overlapping circular avatars showing team or participants (+N overflow)
7. **User Selection**: Clickable avatars with visual feedback for multi-select scenarios
8. **Data Table Rows**: Small avatars in table cells for user identification
9. **Navigation Headers**: Avatar in app header/navbar for user menu access
10. **Empty States**: Placeholder avatars with icons or initials for users without photos

---

## Related Components

- **Badge** - For notification counts and status indicators on avatars
- **AvatarGroup** - Container for displaying multiple avatars in a stacked layout
- **Card** - Often used to contain avatar with user information
- **DataTable** - Displays avatars in table rows for user lists
- **Menu** - User menus often triggered by clicking avatar
- **Tooltip** - Provides additional information on avatar hover
- **Button** - Interactive actions near avatars (follow, message, etc.)
- **Chip** - Alternative for displaying user identity with text and optional image
- **InputText** - Used alongside avatars in chat and comment interfaces

---

**Research completed:** 2025-11-05
**Component:** Avatar
**Framework:** PrimeReact
**Documentation:** https://primereact.org/avatar/

**Notable Features:**
- Three content modes: label (text), icon (font icons), and image (photos)
- Two shape variants: circle and square (default)
- Multiple size options: xlarge, large, and normal (default)
- AvatarGroup component for stacked avatar displays
- Badge integration for notifications and status indicators
- Highly customizable via inline styles and CSS classes
- No built-in accessibility - requires manual ARIA implementation
- No built-in interactive states or animations
- Simple, flexible API focused on visual representation

# Ant Design - Avatar Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/avatar
Status: ✅ Working
Version: Current (v5.x documented at main site, v4.x examples available)
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive API documentation available with TypeScript interfaces. Examples accessible through documentation site and third-party resources. The component is well-documented across multiple versions with clear prop definitions and use cases.

## Component Definition
- **Core purpose**: Represents people or objects visually through images, icons, or characters. Used for user profiles, entity representations, and visual identification in UI.
- **Mental model**: A flexible display container that can show different types of visual identifiers (photo, icon, initials) with automatic fallback handling. Can be used individually or grouped for representing multiple entities.
- **Semantic meaning**: Communicates identity and presence of users or objects in the interface. When grouped, indicates collective participation or membership. Often paired with badges for status indication.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image avatar | ✅ | Native | `src` prop accepts string URL or ReactNode for image source |
| Text/Initials | ✅ | Composed | Text passed as `children`, auto font-sizing based on container width |
| Icon avatar | ✅ | Native | `icon` prop accepts ReactNode for custom icons |
| Fallback handling | ✅ | Native | Priority-based fallback: `icon` > `children` when image load fails. `onError` callback provided |
| Custom content | ✅ | Composed | ReactNode children support allows any custom content |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single avatar | ✅ | Native | Default Avatar component usage |
| Avatar group | ✅ | Native | `Avatar.Group` component (added v4.5.0+) with overflow handling |
| Stacked avatars | ✅ | Native | Avatar.Group provides stacked display with `maxCount` for overflow |

## Shape Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Circle | ✅ | Native | `shape="circle"` (default) |
| Square | ✅ | Native | `shape="square"` |
| Rounded | ❌ | CSS-only | Not built-in, would require custom styling |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | CSS-only | No built-in loading state |
| Error state | ✅ | Native | `onError` callback triggered on image load failure, fallback content shown |
| Online/offline status | ❌ | Composed | Achieved via Badge component integration |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size`: `large` \| `small` \| `default` \| number \| responsive object with breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) |
| Color options | ✅ | Composed | Custom colors via `style` prop (e.g., `backgroundColor`, `color`) |
| Border/ring | ❌ | CSS-only | No built-in border/ring styling |
| Badge/indicator | ✅ | Composed | Seamless integration with Badge component for status/notification indicators |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ❌ | Composed | No built-in click handling, wrap in button/link for interactivity |
| Tooltip on hover | ❌ | Composed | No built-in tooltip, use Tooltip component wrapper |
| Image upload/change | ❌ | Composed | No built-in upload, use Upload component for dynamic image changing |

## Code Examples

### Basic Avatar Types
```jsx
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Image avatar
<Avatar src="https://example.com/avatar.jpg" />

// Icon avatar
<Avatar icon={<UserOutlined />} />

// Letter/text avatar
<Avatar>U</Avatar>
<Avatar>USER</Avatar>

// With custom colors
<Avatar style={{ backgroundColor: '#87d068' }}>A</Avatar>
<Avatar style={{ backgroundColor: '#1890ff' }}>B</Avatar>
```

### Size Variants
```jsx
// Preset sizes
<Avatar size="large" src="user.jpg" />
<Avatar size="default" src="user.jpg" />
<Avatar size="small" src="user.jpg" />

// Custom numeric size
<Avatar size={64} src="user.jpg" />

// Responsive sizing (v4.0+)
<Avatar
  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
  src="user.jpg"
/>
```

### Shape Options
```jsx
// Circle (default)
<Avatar shape="circle" icon={<UserOutlined />} />

// Square
<Avatar shape="square" icon={<UserOutlined />} />
```

### Fallback Handling
```jsx
// Image with icon fallback
<Avatar
  src="https://example.com/broken-image.jpg"
  icon={<UserOutlined />}
  onError={() => console.log('Image load failed')}
/>

// Image with text fallback
<Avatar src="invalid-url.jpg">
  USER
</Avatar>

// Priority: icon takes precedence over children
<Avatar
  src="invalid-url.jpg"
  icon={<UserOutlined />}
>
  This text won't show if image fails - icon shows instead
</Avatar>
```

### Avatar Group
```jsx
import { Avatar } from 'antd';

// Basic group
<Avatar.Group>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
</Avatar.Group>

// Group with overflow handling
<Avatar.Group
  maxCount={3}
  maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
  <Avatar src="user4.jpg" />
  <Avatar src="user5.jpg" />
  {/* Shows first 3, displays "+2" indicator */}
</Avatar.Group>

// Group with custom popover placement
<Avatar.Group
  maxCount={2}
  maxPopoverPlacement="bottom"
  maxPopoverTrigger="click"
>
  <Avatar style={{ backgroundColor: '#87d068' }}>A</Avatar>
  <Avatar style={{ backgroundColor: '#1890ff' }}>B</Avatar>
  <Avatar style={{ backgroundColor: '#722ed1' }}>C</Avatar>
</Avatar.Group>
```

### With Badge
```jsx
import { Avatar, Badge } from 'antd';

// Status indicator
<Badge count={1}>
  <Avatar shape="square" icon={<UserOutlined />} />
</Badge>

// Online status dot
<Badge dot>
  <Avatar src="user.jpg" />
</Badge>

// Custom status
<Badge status="success">
  <Avatar icon={<UserOutlined />} />
</Badge>
```

### Letter Avatar with Gap Control
```jsx
// Default gap (4px)
<Avatar>User Name</Avatar>

// Custom gap for spacing control
<Avatar gap={2}>Long User Name</Avatar>

// Automatic font size adjustment for long text
<Avatar style={{ backgroundColor: '#f56a00' }}>
  Very Long Username
</Avatar>
```

### Advanced Usage
```jsx
// With drag control
<Avatar
  src="user.jpg"
  draggable={false}
/>

// With CORS settings
<Avatar
  src="https://cross-origin-domain.com/avatar.jpg"
  crossOrigin="anonymous"
/>

// With srcSet for responsive images
<Avatar
  src="avatar-default.jpg"
  srcSet="avatar-1x.jpg 1x, avatar-2x.jpg 2x, avatar-3x.jpg 3x"
  alt="User avatar"
/>
```

### Complete TypeScript Interface
```typescript
// Avatar Props
interface AvatarProps {
  alt?: string;                                    // Alternative text for image
  gap?: number;                                    // Letter spacing (default: 4)
  icon?: ReactNode;                                // Icon for icon avatar
  shape?: 'circle' | 'square';                     // Avatar shape (default: circle)
  size?: number | 'large' | 'small' | 'default' | // Avatar size
         { xs?: number; sm?: number; md?: number;  // Responsive sizes
           lg?: number; xl?: number; xxl?: number; };
  src?: string | ReactNode;                        // Image source
  srcSet?: string;                                 // Responsive image sources
  draggable?: boolean | 'true' | 'false';         // Drag behavior
  crossOrigin?: 'anonymous' | 'use-credentials' | ''; // CORS settings
  onError?: () => boolean;                         // Error handler (return false to prevent default)
}

// Avatar.Group Props (v4.5.0+)
interface AvatarGroupProps {
  maxCount?: number;                               // Max avatars to show
  maxPopoverPlacement?: 'top' | 'bottom';         // Overflow popover position (default: top)
  maxPopoverTrigger?: 'hover' | 'focus' | 'click'; // Popover trigger (default: hover)
  maxStyle?: CSSProperties;                        // Overflow indicator styling
  size?: number | 'large' | 'small' | 'default' | // Group avatar size
         { xs?: number; sm?: number; md?: number;
           lg?: number; xl?: number; xxl?: number; };
}
```

## Notable Features

### Automatic Font Sizing
- Letter-type avatars automatically scale font size based on container width
- `gap` prop controls spacing between text and avatar edges
- Ensures text readability across different avatar sizes
- Particularly useful for initials or short text identifiers

### Priority-Based Fallback System
- Intelligent fallback hierarchy: `icon` > `children` when `src` fails
- `onError` callback provides control over error handling
- Return `false` from `onError` to prevent default fallback behavior
- Ensures avatars always display meaningful content

### Responsive Sizing
- Accepts responsive object with breakpoint keys (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`)
- Automatically adjusts avatar size based on screen width
- Consistent with Ant Design's responsive grid system
- Useful for maintaining proper proportions across devices

### Avatar.Group Overflow Management
- `maxCount` limits visible avatars, shows "+N" indicator for excess
- Popover displays hidden avatars on hover/click/focus
- Customizable overflow indicator styling via `maxStyle`
- `maxPopoverPlacement` and `maxPopoverTrigger` control popover behavior
- Efficient space usage for displaying multiple users/entities

### RTL Support
- Component automatically handles RTL text direction
- Consistent with Ant Design's internationalization features
- Proper mirroring behavior in RTL layouts

### Image Control Properties
- `draggable` prop controls image drag behavior (useful for preventing unwanted drags)
- `crossOrigin` for CORS image handling from external domains
- `srcSet` support for responsive images across different pixel densities
- `alt` text for accessibility and SEO

### Badge Integration
- Seamless composition with Badge component
- Common pattern for online/offline status indicators
- Notification counts on avatars
- Status dots for presence indication

### ReactNode Flexibility
- `icon` and `src` props accept ReactNode, not just primitives
- Allows custom icon components, SVG elements, or complex image structures
- Children can be any ReactNode for maximum flexibility
- Enables advanced customization scenarios

## Research Notes

### Documentation Access
- Primary documentation successfully accessible at ant.design
- Web scraping encountered minified assets, required alternative sources
- Comprehensive information gathered from:
  - Legacy v4.x documentation (most detailed API reference)
  - GeeksforGeeks tutorial examples
  - TypeScript interface definitions
  - Multiple version comparisons for feature tracking

### Framework Approach Observations

**Component Design Philosophy:**
- Simple, focused component with single responsibility (display identity)
- Flexible content model supporting multiple display types
- Composition-based for advanced features (badge, tooltip)
- Progressive enhancement through Avatar.Group sub-component

**TypeScript Integration:**
- Well-defined TypeScript interfaces with comprehensive prop types
- Union types for clear prop options (shape, size presets)
- Responsive object typing for complex size configurations
- Version annotations track feature additions

**Responsive Design:**
- Breakpoint-based sizing aligns with Ant Design's grid system
- Consistent breakpoint naming across component library
- Mobile-first approach with multiple device targets
- Automatic adjustment reduces need for media queries

**Accessibility Considerations:**
- `alt` prop for image avatars aids screen readers
- Semantic HTML structure (likely uses `img` or `span`)
- Keyboard navigation support through standard DOM
- Badge integration maintains accessibility

**Error Handling:**
- Robust fallback system prevents empty/broken avatars
- Callback-based error handling for custom logic
- Priority system ensures predictable fallback behavior
- User control over default fallback via onError return value

**Group Behavior:**
- Overflow handling solves common UI space constraints
- Popover reveals hidden information without cluttering interface
- Customizable trigger/placement for different use cases
- Maintains individual avatar props within group context

### Implementation Patterns

**Prop Naming:**
- Clear, descriptive names (`maxPopoverPlacement` over `popoverPos`)
- Consistent with React/web standards (`src`, `alt`, `crossOrigin`)
- Prefixed related props for discoverability (`maxCount`, `maxStyle`, `maxPopoverPlacement`)

**Styling Architecture:**
- Style prop for one-off customizations
- Likely uses CSS-in-JS or CSS Modules internally
- Design tokens probably available for consistent theming
- Component tokens for Avatar-specific customization

**Content Model:**
- Single content slot (children) with specialized props (icon, src)
- Clear precedence rules for multiple content types
- ReactNode flexibility enables complex scenarios
- No slot-based composition (unlike Web Components)

**Size System:**
- Preset keywords for common sizes (small, default, large)
- Numeric values for precise control
- Responsive object for adaptive sizing
- Consistent size naming across component library

### Comparison Points for Semantic UI

**Strengths to Adopt:**
- Clear fallback priority system (icon > children)
- Responsive sizing with breakpoint objects
- Group component with overflow management
- Gap property for letter spacing control
- Comprehensive TypeScript definitions
- Badge integration pattern

**Potential Improvements:**
- Web Component approach for framework independence
- CSS Custom Properties for theming (vs style prop)
- Slot-based composition for clearer content areas
- Built-in loading state
- Native border/ring variants
- Built-in tooltip/popover support

**Framework Differences:**
- React-specific (not web standards based)
- Requires Ant Design ecosystem for full functionality
- JSX-based API vs HTML attributes
- JavaScript configuration vs declarative markup

**Alignment with Semantic UI Goals:**
- Consider web component implementation for portability
- CSS Parts/Custom Properties for theme customization
- Declarative HTML API with progressive enhancement
- Shadow DOM for true encapsulation
- Framework-agnostic approach
- Maintain simplicity while adding robust fallback handling

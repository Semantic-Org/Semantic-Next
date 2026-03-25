# Ant Design - Skeleton Usage Patterns

## Component URL
https://ant.design/components/skeleton
Status: ✅ Working (Documentation site accessible)

## Documentation Quality
Excellent - Comprehensive API documentation with TypeScript interfaces, interactive examples, and clear prop descriptions. Multiple sub-components well-documented.

## Component Definition
- **Core purpose**: Provides placeholder loading states that mimic the structure of content being loaded. Used to improve perceived performance and user experience during data fetching or content rendering.
- **Mental model**: A progressive disclosure pattern that shows content structure before actual data arrives. Acts as a visual preview of what's coming, reducing perceived wait time and layout shift.
- **Semantic meaning**: Communicates "content is loading" state through structural placeholders. Different skeleton types (avatar, button, input, image) provide contextual hints about the content type being loaded.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Supports children prop - when loading=false, displays actual content; when loading=true, shows skeleton |
| Avatar placeholder | ✅ | Dedicated avatar skeleton with shape and size options |
| Button placeholder | ✅ | Skeleton.Button for button-like loading states |
| Input placeholder | ✅ | Skeleton.Input for form field loading states |
| Image placeholder | ✅ | Skeleton.Image for image loading states |
| Custom content | ✅ | Skeleton.Node accepts ReactNode children for custom skeleton shapes |
| Paragraph structure | ✅ | Configurable paragraph with rows and widths |
| Title element | ✅ | Optional title placeholder with configurable width |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Composite skeleton | ✅ | Main Skeleton combines avatar, title, and paragraph |
| Avatar skeleton | ✅ | Skeleton.Avatar - standalone avatar placeholder |
| Button skeleton | ✅ | Skeleton.Button - button-shaped placeholder |
| Input skeleton | ✅ | Skeleton.Input - input field placeholder |
| Image skeleton | ✅ | Skeleton.Image - image placeholder |
| Node skeleton | ✅ | Skeleton.Node - custom content skeleton |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | `loading` prop controls skeleton visibility vs actual content |
| Active animation | ✅ | `active` prop enables wave/shimmer animation effect |
| Static | ✅ | Default state without animation |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Avatar/Button/Input support size: 'large' \| 'small' \| 'default' |
| Shape variants | ✅ | Avatar: 'circle' \| 'square'; Button: 'circle' \| 'square' \| 'round' \| 'default' |
| Rounded corners | ✅ | `round` prop (boolean) - adds border radius to paragraph and title |
| Block display | ✅ | Button `block` prop for full-width display |
| Row configuration | ✅ | Paragraph `rows` prop controls number of lines |
| Width control | ✅ | Paragraph `width` accepts number, string, or array for per-row widths |
| Title visibility | ✅ | `title` prop can be boolean or SkeletonTitleProps object |
| Paragraph visibility | ✅ | `paragraph` prop can be boolean or SkeletonParagraphProps object |
| Avatar visibility | ✅ | `avatar` prop can be boolean or SkeletonAvatarProps object |

## Code Examples

### Basic Skeleton
```jsx
import { Skeleton } from 'antd';

// Simple skeleton with default configuration
<Skeleton />

// Active animation
<Skeleton active />

// Rounded corners
<Skeleton round />
```

### Composite Skeleton with Avatar
```jsx
// Avatar with title and paragraph (default: 3 rows)
<Skeleton avatar />

// Custom avatar shape and size
<Skeleton
  avatar={{
    shape: 'square',
    size: 'large'
  }}
/>

// Avatar with custom paragraph rows
<Skeleton
  avatar
  paragraph={{ rows: 4 }}
/>

// Full customization with active animation
<Skeleton
  active
  avatar={{
    shape: 'circle',
    size: 64
  }}
  paragraph={{
    rows: 5,
    width: ['100%', '90%', '80%', '70%', '60%']
  }}
  round
/>
```

### Title and Paragraph Control
```jsx
// Only paragraph, no title
<Skeleton title={false} />

// Only title, no paragraph
<Skeleton paragraph={false} />

// Custom title width
<Skeleton
  title={{ width: '50%' }}
  paragraph={{ rows: 3 }}
/>

// Custom paragraph row widths
<Skeleton
  paragraph={{
    rows: 4,
    width: [300, 250, 200, 150]  // Can use numbers (pixels) or strings
  }}
/>

// Mixed width units
<Skeleton
  paragraph={{
    rows: 3,
    width: ['100%', 200, '80%']  // Mix percentages and pixels
  }}
/>
```

### Loading State Pattern
```jsx
import { Skeleton, Button } from 'antd';
import { useState } from 'react';

function ContentWithSkeleton() {
  const [loading, setLoading] = useState(false);

  const showSkeleton = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div>
      <Skeleton loading={loading} active>
        <div>
          <h4>Actual Content Title</h4>
          <p>This is the real content that appears when loading completes.</p>
          <p>The skeleton will be hidden and this content will be shown.</p>
        </div>
      </Skeleton>

      <Button onClick={showSkeleton}>
        Show Loading State
      </Button>
    </div>
  );
}
```

### Skeleton.Avatar Standalone
```jsx
import { Skeleton } from 'antd';

// Basic avatar skeleton
<Skeleton.Avatar />

// Active animation
<Skeleton.Avatar active />

// Circle avatar (default)
<Skeleton.Avatar shape="circle" size="large" />

// Square avatar
<Skeleton.Avatar shape="square" size={64} />

// Different sizes
<Skeleton.Avatar size="small" />
<Skeleton.Avatar size="default" />
<Skeleton.Avatar size="large" />
<Skeleton.Avatar size={100} />  // Custom pixel size
```

### Skeleton.Button Standalone
```jsx
import { Skeleton } from 'antd';

// Basic button skeleton
<Skeleton.Button />

// Active animation
<Skeleton.Button active />

// Shape variants
<Skeleton.Button shape="default" />  // Rectangular with slight rounding
<Skeleton.Button shape="round" />    // Pill-shaped
<Skeleton.Button shape="circle" />   // Circular
<Skeleton.Button shape="square" />   // Square corners

// Size variants
<Skeleton.Button size="small" />
<Skeleton.Button size="default" />
<Skeleton.Button size="large" />

// Block (full-width) display
<Skeleton.Button block />
<Skeleton.Button block shape="round" size="large" />

// Combined properties
<Skeleton.Button
  active
  shape="round"
  size="large"
  block
/>
```

### Skeleton.Input Standalone
```jsx
import { Skeleton } from 'antd';

// Basic input skeleton
<Skeleton.Input />

// Active animation
<Skeleton.Input active />

// Size variants
<Skeleton.Input size="small" />
<Skeleton.Input size="default" />
<Skeleton.Input size="large" />

// Block (full-width) display
<Skeleton.Input block />
<Skeleton.Input active size="large" block />
```

### Skeleton.Image Standalone
```jsx
import { Skeleton } from 'antd';

// Basic image skeleton
<Skeleton.Image />

// Custom size (uses style prop)
<Skeleton.Image style={{ width: 200, height: 200 }} />

// Note: Skeleton.Image doesn't accept loading prop
// It's always in skeleton state unless you replace it with actual <Image>
```

### Skeleton.Node Custom Content
```jsx
import { Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Custom skeleton with icon
<Skeleton.Node active>
  <UserOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
</Skeleton.Node>

// Custom skeleton with any content
<Skeleton.Node active>
  <div style={{ width: 100, height: 100, background: '#f0f0f0' }}>
    Custom Shape
  </div>
</Skeleton.Node>
```

### Complex Layout Examples
```jsx
// Card layout with avatar and content
<div style={{ padding: 20, background: '#fff' }}>
  <Skeleton
    loading={true}
    active
    avatar={{ size: 'large' }}
    paragraph={{ rows: 4 }}
    round
  />
</div>

// List of items with avatars
<div>
  {[1, 2, 3].map(item => (
    <div key={item} style={{ marginBottom: 16 }}>
      <Skeleton
        loading={true}
        active
        avatar
        paragraph={{ rows: 2 }}
      />
    </div>
  ))}
</div>

// Form layout with inputs and buttons
<div style={{ width: 400 }}>
  <Skeleton.Input active block style={{ marginBottom: 16 }} />
  <Skeleton.Input active block style={{ marginBottom: 16 }} />
  <Skeleton.Input active block style={{ marginBottom: 16 }} />
  <Skeleton.Button active block />
</div>

// Media grid
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
  <Skeleton.Image />
  <Skeleton.Image />
  <Skeleton.Image />
  <Skeleton.Image />
  <Skeleton.Image />
  <Skeleton.Image />
</div>

// Profile header
<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
  <Skeleton.Avatar size={80} />
  <div style={{ flex: 1 }}>
    <Skeleton active title paragraph={{ rows: 2 }} />
  </div>
  <Skeleton.Button />
</div>
```

### Complete TypeScript Interfaces

```typescript
// Main Skeleton Component
export interface SkeletonProps {
  active?: boolean;                              // Show animation effect (default: false)
  loading?: boolean;                             // Display skeleton when true
  prefixCls?: string;                            // Prefix for CSS classes
  className?: string;                            // Custom CSS class
  rootClassName?: string;                        // Root element class name
  style?: React.CSSProperties;                   // Inline styles
  children?: React.ReactNode;                    // Content to show when loading=false
  avatar?: SkeletonAvatarProps | boolean;        // Avatar configuration (default: false)
  title?: SkeletonTitleProps | boolean;          // Title configuration (default: true)
  paragraph?: SkeletonParagraphProps | boolean;  // Paragraph configuration (default: true)
  round?: boolean;                               // Show rounded borders (default: false)
}

// Avatar Sub-component
export interface SkeletonAvatarProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;                    // Show animation effect
  shape?: 'circle' | 'square';         // Avatar shape (default: 'circle')
  size?: number | 'large' | 'small' | 'default';  // Avatar size (default: 'default')
}

// Title Sub-component
export interface SkeletonTitleProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;             // Title width (default: '38%')
}

// Paragraph Sub-component
export interface SkeletonParagraphProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  rows?: number;                                    // Number of paragraph rows (default: 3)
  width?: number | string | Array<number | string>; // Width of each row
}

// Button Sub-component
export interface SkeletonButtonProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;                                        // Show animation effect
  block?: boolean;                                         // Display block-level button
  shape?: 'circle' | 'round' | 'square' | 'default';      // Button shape (default: 'default')
  size?: 'large' | 'small' | 'default';                   // Button size (default: 'default')
}

// Input Sub-component
export interface SkeletonInputProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;                          // Show animation effect
  block?: boolean;                           // Display block-level input
  size?: 'large' | 'small' | 'default';     // Input size (default: 'default')
}

// Image Sub-component
export interface SkeletonImageProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  // Note: No active prop for Image - it's always static
}

// Node Sub-component (Custom content)
export interface SkeletonNodeProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;           // Show animation effect
  children?: React.ReactNode; // Custom skeleton content
}
```

## Notable Features

### Comprehensive Sub-Components
- Six distinct skeleton types (main, avatar, button, input, image, node) provide placeholders for all common UI elements
- Each sub-component can be used independently or composed together
- Consistent API across sub-components (active, size, shape patterns)
- Allows building complex skeleton layouts matching actual content structure

### Active Animation System
- Wave/shimmer animation effect (`active` prop) improves perceived performance
- Animation can be applied to main component or individual sub-components
- Consistent animation behavior across all skeleton types
- Provides visual feedback that loading is in progress

### Flexible Width Configuration
- Paragraph width accepts number (pixels), string (CSS units), or array
- Array allows per-row width customization for more realistic content shapes
- Mixed units supported (percentages, pixels, etc.)
- Enables precise matching of actual content layout

### Shape Primitives
- **Avatar shapes**: circle (default), square
- **Button shapes**: default (slightly rounded), round (pill), circle, square
- Shape options match common UI element designs
- Provides visual context for the type of content being loaded

### Size System
- Consistent size options: 'small', 'default', 'large'
- Custom numeric sizes supported (pixels)
- Size system aligns with Ant Design's overall design language
- Enables skeleton to match actual component sizes

### Loading State Integration
- `loading` prop controls skeleton visibility vs actual content
- Children prop contains real content to display when loaded
- Smooth transition pattern between skeleton and content
- Prevents layout shift during content loading

### Round Corners Option
- Global `round` prop adds border radius to title and paragraph
- Creates softer, more modern skeleton appearance
- Matches rounded UI design trends
- Applied consistently to all paragraph rows and title

### Block Display Mode
- Button and Input support `block` prop for full-width display
- Enables skeleton to match block-level layouts
- Useful for forms and full-width button patterns
- Maintains responsive layout structure

### Custom Skeleton Content
- Skeleton.Node accepts ReactNode children for completely custom skeletons
- Allows matching unique UI elements not covered by standard types
- Maintains consistent animation behavior with custom content
- Enables extension beyond built-in skeleton types

## Research Notes

### Documentation Access
- Official documentation at ant.design/components/skeleton is comprehensive and accessible
- Interactive examples allow testing different prop combinations
- TypeScript interfaces well-documented with JSDoc annotations
- GitHub source code provides authoritative API reference

### Framework Approach Observations

**Component Architecture:**
- Main Skeleton component acts as composite container
- Six specialized sub-components for specific UI element types
- Each sub-component can function independently
- Consistent prop naming conventions across all types
- Clean separation between loading state container (main) and element types (sub-components)

**Progressive Loading Pattern:**
- `loading` prop creates clear boolean switch between skeleton and content
- Children prop pattern allows wrapping actual content
- Avoids need for separate conditional rendering in consuming code
- Enables gradual content reveal as data loads

**Visual Design Philosophy:**
- Skeleton shapes intentionally resemble actual content
- Active animation provides progress feedback
- Round corners option supports modern UI aesthetics
- Size and shape consistency with Ant Design component library

**Flexibility vs Simplicity:**
- Simple default behavior (just `<Skeleton />` works)
- Deep customization available when needed
- Progressive disclosure of complexity
- Sensible defaults reduce configuration burden

**TypeScript Integration:**
- Comprehensive type definitions for all props
- Discriminated unions for shape and size options
- Type safety prevents invalid prop combinations
- Excellent IDE autocomplete support

**Composition Patterns:**
- Sub-components can be composed to match any layout
- Independent control of avatar, title, paragraph
- Enables building complex skeletons from simple primitives
- Grid and flex layouts supported through standard CSS

### Implementation Patterns

**Prop Naming Conventions:**
- Consistent use of `active` across all components for animation
- Shape and size follow standard patterns
- Boolean props use clear affirmative names (loading, active, round, block)
- Configuration objects match sub-component names (avatar, title, paragraph)

**Styling Architecture:**
- Multiple customization layers: prefixCls, className, rootClassName, style
- CSS-in-JS likely used with design tokens
- Style prop for one-off customizations
- Round prop provides global styling control

**Width Configuration Design:**
- Flexible type: number | string | Array<number | string>
- Supports both absolute and relative units
- Array enables per-row customization without complex configuration
- Type system prevents common errors

**Sub-Component Pattern:**
- Compound component pattern (Skeleton.Avatar, Skeleton.Button, etc.)
- Each sub-component is independently importable
- Shared base props (active, prefixCls, className, style)
- Type-specific props (shape, size, block, rows, etc.)

**Animation System:**
- Single boolean prop (`active`) controls animation
- Consistent animation effect across all skeleton types
- Performance-optimized (likely CSS animations, not JavaScript)
- No configuration needed - just on/off

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Comprehensive set of sub-components covers all common use cases
- Excellent composition patterns for complex layouts
- Very clear and consistent API design
- Strong TypeScript integration
- Flexible width configuration (especially array support)
- Shape primitives well-designed and useful
- Loading state pattern is intuitive and reduces boilerplate

**Potential Improvements:**
- Could benefit from web component architecture for framework independence
- Design token exposure could be more explicit
- Animation customization limited (just on/off, no speed/style options)
- Image skeleton could support aspect ratio control
- No built-in list/grid skeleton patterns (must compose manually)

**Alignment with Web Standards:**
- React-specific implementation (not web components)
- Could use custom elements for broader framework compatibility
- Style prop pattern less standards-aligned than CSS parts/properties
- Shadow DOM encapsulation not used (styles are global with prefixes)

**API Design Lessons:**
- Compound component pattern works very well for sub-components
- Boolean configuration props (avatar, title, paragraph) with object alternative is elegant
- Consistent prop naming across components reduces learning curve
- Loading wrapper pattern with children is more intuitive than separate show/hide logic

**Composition Philosophy:**
- Building complex from simple works well
- Sub-components as building blocks enables infinite layout variations
- Main Skeleton provides common pattern (avatar + title + paragraph)
- Manual composition with sub-components handles edge cases

### Advanced Use Cases

**Skeleton for Different Content Types:**
```jsx
// Article/Blog post
<Skeleton
  active
  title={{ width: '60%' }}
  paragraph={{
    rows: 8,
    width: ['100%', '100%', '100%', '90%', '95%', '100%', '85%', '70%']
  }}
  round
/>

// User profile card
<Skeleton
  active
  avatar={{ size: 100, shape: 'circle' }}
  title={{ width: '40%' }}
  paragraph={{ rows: 2, width: ['60%', '50%'] }}
/>

// Product card
<div style={{ width: 300 }}>
  <Skeleton.Image style={{ width: 300, height: 300 }} />
  <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 16 }} />
  <Skeleton.Button active block style={{ marginTop: 16 }} />
</div>

// Data table row
<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
  <Skeleton.Avatar size="small" />
  <div style={{ flex: 1 }}>
    <Skeleton active title={false} paragraph={{ rows: 1 }} />
  </div>
  <Skeleton.Button size="small" />
</div>

// Form with mixed inputs
<div style={{ width: 400 }}>
  <Skeleton.Input active block style={{ marginBottom: 16 }} />
  <Skeleton.Input active block size="large" style={{ marginBottom: 16 }} />
  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
    <Skeleton.Input active style={{ flex: 1 }} />
    <Skeleton.Input active style={{ flex: 1 }} />
  </div>
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
    <Skeleton.Button active />
    <Skeleton.Button active shape="round" />
  </div>
</div>
```

**Responsive Skeleton Patterns:**
```jsx
// Responsive grid that adjusts skeleton layout
function ResponsiveCardSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: 16
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <Skeleton.Image style={{ width: '100%', height: 200 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  );
}
```

**Conditional Skeleton Parts:**
```jsx
// Show different skeleton configurations based on data
function SmartSkeleton({ hasAvatar, hasTitle, paragraphRows }) {
  return (
    <Skeleton
      active
      avatar={hasAvatar}
      title={hasTitle}
      paragraph={{ rows: paragraphRows }}
    />
  );
}

// Usage
<SmartSkeleton hasAvatar={true} hasTitle={true} paragraphRows={4} />
<SmartSkeleton hasAvatar={false} hasTitle={true} paragraphRows={2} />
```

## Summary

Ant Design's Skeleton component is a comprehensive, well-designed loading placeholder system. Key strengths:

1. **Complete Coverage**: Six sub-components cover all common UI elements
2. **Intuitive API**: Loading wrapper pattern reduces boilerplate, consistent props across components
3. **Flexible Composition**: Can build any layout from simple primitives
4. **Visual Quality**: Active animation, shape options, round corners create polished loading states
5. **Type Safety**: Excellent TypeScript integration with comprehensive interfaces
6. **Developer Experience**: Sensible defaults, progressive complexity, clear documentation

The component excels at matching actual content structure during loading, improving perceived performance and reducing layout shift. The combination of a composite main component (for common patterns) and independent sub-components (for custom layouts) provides both convenience and flexibility.

For Semantic UI implementation, consider adopting:
- The loading wrapper pattern with children
- Compound component pattern for sub-types
- Flexible width configuration with array support
- Consistent active animation across all variants
- Shape primitive options (circle, square, round, default)
- Boolean-or-object prop pattern for optional configuration

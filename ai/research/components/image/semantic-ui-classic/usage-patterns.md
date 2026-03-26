# Semantic UI Classic - Image Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://semantic-ui.com/elements/image.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of all image patterns with clear visual examples and detailed descriptions. The image component is well-documented with examples for every variation.

## Component Definition
- **Core purpose**: Displays graphical content with semantic styling and layout controls. Images are a fundamental building block for displaying visual content in web applications.
- **Mental model**: A display element for visual content (photos, illustrations, diagrams, avatars) that can be styled and positioned using semantic class modifiers. Users understand images as non-interactive visual information unless wrapped in links.
- **Semantic meaning**: Communicates visual information through various display styles (avatar for users, circular for profiles, bordered for emphasis). The component supports both `<img>` and `<svg>` elements.

## Pattern Support Levels
- **Native**: Dedicated class/API
- **Composed**: Via HTML composition
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic image | ✅ | Native | Standard image with `class="ui image"` |
| Image link | ✅ | Composed | Image wrapped in anchor tag for clickable images |
| SVG support | ✅ | Native | SVG elements supported with same class API |
| Alt text | ✅ | Native | Standard HTML `alt` attribute for accessibility |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Avatar | ✅ | Native | `class="ui avatar image"` - inline circular image for user profiles |
| Bordered | ✅ | Native | `class="ui bordered image"` - adds border for emphasis |
| Rounded | ✅ | Native | `class="ui rounded image"` - applies border-radius |
| Circular | ✅ | Native | `class="ui circular image"` - creates circular appearance |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hidden | ✅ | Native | `class="ui hidden image"` - conceals image from view |
| Disabled | ✅ | Native | `class="ui disabled image"` - shows non-interactive dimmed state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | 8 sizes: mini (35px), tiny (80px), small (150px), medium (300px), large (450px), big (600px), huge (800px), massive (960px) |
| Fluid | ✅ | Native | `class="ui fluid image"` - expands to full container width |
| Centered | ✅ | Native | `class="ui centered image"` - centers within content block |
| Spaced | ✅ | Native | `class="ui spaced image"` - adds separation from adjacent content |
| Floated | ✅ | Native | `class="ui left floated image"` or `right floated` - floats for text wrapping |
| Top aligned | ✅ | Native | `class="ui top aligned image"` - aligns to top of adjacent content |
| Middle aligned | ✅ | Native | `class="ui middle aligned image"` - vertically centers with adjacent content |
| Bottom aligned | ✅ | Native | `class="ui bottom aligned image"` - aligns to bottom of adjacent content |

## Group Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image groups | ✅ | Native | `class="ui images"` - container for multiple images with uniform sizing |
| Sized groups | ✅ | Native | `class="ui [size] images"` - applies uniform size to all child images |

## Code Examples

### Basic Image Types
```html
<!-- Standard Image -->
<img class="ui image" src="/images/wireframe/image.png" alt="description">

<!-- SVG Image -->
<svg class="ui image" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

### Image Link
```html
<!-- Clickable Image -->
<a href="https://example.com">
  <img class="ui image" src="/images/wireframe/image-text.png" alt="link image">
</a>
```

### Avatar Images
```html
<!-- Avatar (inline with text) -->
<img class="ui avatar image" src="/images/avatar.png" alt="User Name">
<span>Username</span>

<!-- Multiple Avatars -->
<img class="ui avatar image" src="/images/avatar1.png" alt="User 1">
<img class="ui avatar image" src="/images/avatar2.png" alt="User 2">
<img class="ui avatar image" src="/images/avatar3.png" alt="User 3">
```

### Display Style Variations
```html
<!-- Bordered (emphasizes edges of white/transparent content) -->
<img class="ui bordered image" src="/images/wireframe/white-image.png" alt="bordered">

<!-- Rounded (applies border-radius) -->
<img class="ui rounded image" src="/images/wireframe/square-image.png" alt="rounded">

<!-- Circular (creates circular appearance) -->
<img class="ui circular image" src="/images/wireframe/square-image.png" alt="circular">

<!-- Combined Styles -->
<img class="ui bordered rounded image" src="/images/wireframe/image.png" alt="bordered and rounded">
<img class="ui bordered circular image" src="/images/wireframe/square-image.png" alt="bordered and circular">
```

### Layout Variations
```html
<!-- Fluid (full container width) -->
<img class="ui fluid image" src="/images/wireframe/image.png" alt="fluid">

<!-- Centered (centers within content block) -->
<div class="ui container">
  <img class="ui centered image" src="/images/wireframe/image.png" alt="centered">
</div>

<!-- Spaced (adds separation from adjacent content) -->
<p>
  Text content before the image...
  <img class="ui spaced image" src="/images/wireframe/image.png" alt="spaced">
  Text content after the image...
</p>
```

### Floating Images
```html
<!-- Left Floated -->
<div class="ui container">
  <img class="ui left floated image" src="/images/wireframe/text-image.png" alt="left floated">
  <p>This text will wrap around the left-floated image. The image is pulled to the left side of the container, and the text flows around it on the right side. This is useful for creating magazine-style layouts with integrated imagery.</p>
</div>

<!-- Right Floated -->
<div class="ui container">
  <img class="ui right floated image" src="/images/wireframe/text-image.png" alt="right floated">
  <p>This text will wrap around the right-floated image. The image is pulled to the right side of the container, and the text flows around it on the left side. This creates a natural reading flow for content with accompanying images.</p>
</div>

<!-- Multiple Floated Images -->
<div class="ui container">
  <img class="ui small left floated image" src="/images/wireframe/image.png" alt="left">
  <img class="ui small right floated image" src="/images/wireframe/image.png" alt="right">
  <p>Text content that flows between and around multiple floated images...</p>
</div>
```

### Vertical Alignment
```html
<!-- Top Aligned -->
<img class="ui top aligned image" src="/images/wireframe/square-image.png" alt="top aligned">
<span>This text is aligned with the top of the image. The image and text baseline start at the same vertical position.</span>

<!-- Middle Aligned -->
<img class="ui middle aligned image" src="/images/wireframe/square-image.png" alt="middle aligned">
<span>This text is vertically centered with the image. The middle of the image aligns with the middle of the text line.</span>

<!-- Bottom Aligned -->
<img class="ui bottom aligned image" src="/images/wireframe/square-image.png" alt="bottom aligned">
<span>This text is aligned with the bottom of the image. The text baseline aligns with the bottom edge of the image.</span>
```

### Size Variations
```html
<!-- Mini (35px) -->
<img class="ui mini image" src="/images/wireframe/image.png" alt="mini">

<!-- Tiny (80px) -->
<img class="ui tiny image" src="/images/wireframe/image.png" alt="tiny">

<!-- Small (150px) -->
<img class="ui small image" src="/images/wireframe/image.png" alt="small">

<!-- Medium (300px) - Default -->
<img class="ui medium image" src="/images/wireframe/image.png" alt="medium">

<!-- Large (450px) -->
<img class="ui large image" src="/images/wireframe/image.png" alt="large">

<!-- Big (600px) -->
<img class="ui big image" src="/images/wireframe/image.png" alt="big">

<!-- Huge (800px) -->
<img class="ui huge image" src="/images/wireframe/image.png" alt="huge">

<!-- Massive (960px) -->
<img class="ui massive image" src="/images/wireframe/image.png" alt="massive">
```

### Sized Images with Other Variations
```html
<!-- Small Circular Avatar -->
<img class="ui small circular image" src="/images/avatar.png" alt="small avatar">

<!-- Medium Bordered Rounded -->
<img class="ui medium bordered rounded image" src="/images/wireframe/image.png" alt="medium bordered rounded">

<!-- Large Centered -->
<img class="ui large centered image" src="/images/wireframe/image.png" alt="large centered">

<!-- Tiny Floated -->
<img class="ui tiny right floated image" src="/images/wireframe/image.png" alt="tiny floated">
```

### Image Groups
```html
<!-- Basic Image Group -->
<div class="ui images">
  <img class="ui image" src="/images/wireframe/image.png" alt="1">
  <img class="ui image" src="/images/wireframe/image.png" alt="2">
  <img class="ui image" src="/images/wireframe/image.png" alt="3">
  <img class="ui image" src="/images/wireframe/image.png" alt="4">
</div>

<!-- Small Image Group (all images become small) -->
<div class="ui small images">
  <img class="ui image" src="/images/wireframe/image.png" alt="1">
  <img class="ui image" src="/images/wireframe/image.png" alt="2">
  <img class="ui image" src="/images/wireframe/image.png" alt="3">
  <img class="ui image" src="/images/wireframe/image.png" alt="4">
</div>

<!-- Tiny Image Group -->
<div class="ui tiny images">
  <img class="ui image" src="/images/wireframe/image.png" alt="1">
  <img class="ui image" src="/images/wireframe/image.png" alt="2">
  <img class="ui image" src="/images/wireframe/image.png" alt="3">
  <img class="ui image" src="/images/wireframe/image.png" alt="4">
</div>

<!-- Medium Image Group -->
<div class="ui medium images">
  <img class="ui image" src="/images/wireframe/image.png" alt="1">
  <img class="ui image" src="/images/wireframe/image.png" alt="2">
  <img class="ui image" src="/images/wireframe/image.png" alt="3">
</div>

<!-- Avatar Group -->
<div class="ui images">
  <img class="ui avatar image" src="/images/avatar1.png" alt="user 1">
  <img class="ui avatar image" src="/images/avatar2.png" alt="user 2">
  <img class="ui avatar image" src="/images/avatar3.png" alt="user 3">
</div>
```

### State Examples
```html
<!-- Hidden Image (not visible) -->
<img class="ui hidden image" src="/images/wireframe/image.png" alt="hidden">

<!-- Disabled Image (dimmed appearance) -->
<img class="ui disabled image" src="/images/wireframe/image.png" alt="disabled">

<!-- Disabled Avatar -->
<img class="ui disabled avatar image" src="/images/avatar.png" alt="disabled user">
```

### Complex Combined Patterns
```html
<!-- Bordered Circular Avatar with Size -->
<img class="ui mini bordered circular image" src="/images/avatar.png" alt="mini avatar">
<img class="ui tiny bordered circular image" src="/images/avatar.png" alt="tiny avatar">
<img class="ui small bordered circular image" src="/images/avatar.png" alt="small avatar">

<!-- Rounded Bordered Floated Image -->
<img class="ui small rounded bordered left floated image" src="/images/wireframe/image.png" alt="complex">
<p>Content that wraps around this bordered, rounded, floated image...</p>

<!-- Centered Circular Image -->
<div class="ui container">
  <img class="ui medium centered circular image" src="/images/avatar.png" alt="centered circular">
</div>

<!-- Fluid Rounded Image -->
<div class="ui container">
  <img class="ui fluid rounded image" src="/images/wireframe/image.png" alt="fluid rounded">
</div>
```

### Linked Image Variations
```html
<!-- Linked Avatar -->
<a href="/profile/user123">
  <img class="ui avatar image" src="/images/avatar.png" alt="User Profile">
  <span>View Profile</span>
</a>

<!-- Linked Circular Image -->
<a href="/gallery">
  <img class="ui small circular image" src="/images/photo.png" alt="Gallery">
</a>

<!-- Linked Bordered Image -->
<a href="/product">
  <img class="ui medium bordered image" src="/images/product.png" alt="Product">
</a>
```

## Notable Features
- **Class-based API**: All variations achieved through composable CSS classes following consistent naming pattern
- **SVG support**: Full support for SVG elements with the same class API as raster images
- **Default sizing behavior**: Images use original dimensions up to container size unless a size class is specified
- **Avatar specialization**: Dedicated avatar class for inline user profile images
- **Vertical alignment**: Three alignment options (top, middle, bottom) for inline image positioning with text
- **Floating with text wrap**: Images can float left or right with text wrapping naturally around them
- **Group sizing**: Image groups can enforce uniform sizing across all child images
- **Centered positioning**: Built-in centering within content blocks
- **Spaced variation**: Automatic spacing from adjacent content
- **Fluid responsiveness**: Images can expand to full container width while maintaining aspect ratio
- **Border styling**: Bordered variation particularly useful for white or transparent images
- **Shape variations**: Multiple shape options (rounded corners, fully circular)
- **Eight size tiers**: Comprehensive size system from mini (35px) to massive (960px)
- **State support**: Hidden and disabled states for visibility and interaction control
- **Combinable modifiers**: Classes can be combined (e.g., `ui small bordered circular image`)

## Research Notes
- **Framework approach**: Class-based utility system consistent with other Semantic UI components. Uses compositional approach where multiple classes add functionality.
- **Accessibility foundation**: Standard HTML `alt` attribute for image descriptions, essential for screen readers.
- **Sizing philosophy**: Without size class, images respect original dimensions up to container bounds. This prevents unexpected scaling and maintains image quality.
- **Avatar use case**: Avatar class specifically designed for inline user profile images, sized appropriately for text lines.
- **Circular images**: Work best with square source images to avoid distortion. Circular cropping is applied via CSS.
- **Bordered images**: Particularly useful for images with white backgrounds or transparency that might otherwise blend into page background.
- **Floating behavior**: Floated images use CSS float property, causing adjacent content to wrap around them. Common in article layouts.
- **Vertical alignment**: Controls how inline images align with text baseline. Default is bottom-aligned.
- **Image groups**: Container enforces uniform sizing and spacing for galleries or collections of images.
- **Spaced images**: Adds margin around image, useful when embedding images within text content.
- **Centered images**: Uses margin auto technique to center block-level images horizontally.
- **Fluid images**: Particularly important for responsive design, allowing images to scale with container width.
- **State classes**: Hidden class applies `display: none`, while disabled class typically reduces opacity to show non-interactive state.
- **jQuery dependency**: This is the jQuery-based classic version. While the image component is primarily CSS-based, the framework context assumes jQuery availability.
- **Semantic naming**: Class names describe purpose or appearance (avatar, circular, bordered) rather than specific CSS properties.
- **Combination patterns**: Multiple modifiers can be combined logically (e.g., small + circular + bordered).
- **No JavaScript required**: Image component is purely CSS-based; no JavaScript initialization needed for basic functionality.
- **Consistent with framework**: Follows same naming conventions and patterns as other Semantic UI components (`ui [variations] image`).
- **Historical context**: Part of the original Semantic UI framework that popularized human-readable, semantic CSS class names.
- **Design system integration**: Size values align with framework's overall spacing and sizing system.

## Implementation Patterns

### Class Composition Order
The typical class order follows this pattern:
```
ui [size] [type] [state] [layout] image
```

Examples:
- `ui small circular image`
- `ui large bordered rounded image`
- `ui mini disabled avatar image`
- `ui medium left floated image`

### Group Container Pattern
Image groups use a container with `images` (plural) and apply size at the container level:
```html
<div class="ui [size] images">
  <img class="ui image" src="...">
  <img class="ui image" src="...">
</div>
```

### Link Wrapping Pattern
To make images clickable, wrap the entire `<img>` element in an anchor tag:
```html
<a href="[url]">
  <img class="ui [variations] image" src="...">
</a>
```

### Float Clearing Pattern
When using floated images, ensure parent containers clear floats properly:
```html
<div style="clear: both;">
  <!-- Content after floated images -->
</div>
```

Or use Semantic UI's segment or container components which handle this automatically.

### Responsive Sizing Pattern
Combine fluid with max-width for responsive images:
```html
<!-- Fluid up to a maximum size -->
<img class="ui fluid image" style="max-width: 600px;" src="...">
```

### Avatar List Pattern
Multiple avatars in sequence (common in social applications):
```html
<div>
  <img class="ui avatar image" src="/user1.png" alt="User 1">
  <img class="ui avatar image" src="/user2.png" alt="User 2">
  <img class="ui avatar image" src="/user3.png" alt="User 3">
  <span>and 12 others</span>
</div>
```

## Comparison with Modern Patterns

### Semantic UI Classic Approach
```html
<img class="ui small circular bordered image" src="...">
```

### Modern Component Framework Equivalent
```jsx
<Image size="small" circular bordered src="..." />
```

### CSS-in-JS Equivalent
```javascript
<img
  className={classNames('image', {
    small: size === 'small',
    circular: circular,
    bordered: bordered
  })}
  src="..."
/>
```

The Semantic UI Classic approach uses composable CSS classes, while modern frameworks often use props or CSS-in-JS. All three approaches achieve the same visual result through different abstraction levels.

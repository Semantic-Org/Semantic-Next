# Ant Design - Image Component Usage Patterns

## Research Metadata
- **Framework**: Ant Design (React)
- **Component**: Image
- **Documentation URL**: https://ant.design/components/image/
- **Research Date**: 2025-11-04
- **Version Researched**: 4.x and 5.x (latest)

---

## Component Definition

### Image Component
**Purpose**: Previewable image component with progressive loading, fallback handling, and built-in preview functionality.

**Mental Model**: Image is a **media display component** designed to:
- Display images with enhanced functionality beyond native `<img>` tag
- Provide built-in preview/zoom capabilities
- Handle loading states with placeholders
- Gracefully handle errors with fallback images
- Support grouped image galleries with preview navigation
- Optimize image loading and display

**Key Characteristic**: Enhanced `<img>` element with preview modal, loading states, error handling, and group gallery support.

---

## Core Features

### 1. **Basic Image Display** (Level 1 - Core)
**Support**: Full
**Description**: Enhanced image display with built-in preview on click

```jsx
import { Image } from 'antd';

<Image
  width={200}
  src="https://example.com/image.png"
/>
```

**Key Features**:
- Automatic preview modal on click
- Maintains aspect ratio
- Supports standard `<img>` attributes

### 2. **Preview Functionality** (Level 1 - Core)
**Support**: Full - Modal overlay with zoom controls
**Description**: Click-to-preview with full-screen modal overlay

```jsx
<Image
  src="image.jpg"
  preview={{
    visible: false,
    onVisibleChange: (visible) => setVisible(visible),
  }}
/>
```

**Preview Features**:
- Zoom in/out controls
- Rotate controls
- Flip horizontal/vertical
- Download image
- Close button
- Keyboard navigation (ESC to close, arrow keys for gallery navigation)
- Customizable preview source (different resolution for preview)

**Preview Modal Controls**:
- **Zoom**: Mouse wheel or +/- buttons
- **Rotate**: Left/right rotation buttons
- **Flip**: Horizontal and vertical flip
- **Download**: Download button to save image
- **Close**: X button or ESC key
- **Fullscreen**: Maximize button

### 3. **Fallback Images** (Level 1 - Core)
**Support**: Full
**Description**: Display fallback image when primary image fails to load

```jsx
<Image
  src="invalid-image.png"
  fallback="https://via.placeholder.com/200x200?text=Error"
/>
```

**Use Cases**:
- Error handling for broken images
- Missing image placeholders
- Network failure graceful degradation

### 4. **Progressive Loading with Placeholder** (Level 1 - Core)
**Support**: Full
**Description**: Show placeholder while image loads

```jsx
<Image
  src="large-image.jpg"
  placeholder={
    <Image
      preview={false}
      src="thumbnail.jpg"
      width={200}
    />
  }
/>
```

**Patterns**:
- Low-quality placeholder (LQIP) pattern
- Blur-up effect using thumbnail
- Skeleton or spinner placeholders
- Progressive JPEG loading

**Common Implementation**:
```jsx
// Using a blurred thumbnail
<Image
  src="full-resolution.jpg"
  placeholder={
    <div style={{ filter: 'blur(10px)' }}>
      <Image preview={false} src="thumbnail.jpg" />
    </div>
  }
/>
```

### 5. **Image.PreviewGroup** (Level 1 - Core)
**Support**: Full via `Image.PreviewGroup`
**Description**: Group multiple images into a gallery with preview navigation

```jsx
import { Image } from 'antd';

<Image.PreviewGroup>
  <Image width={200} src="image1.jpg" />
  <Image width={200} src="image2.jpg" />
  <Image width={200} src="image3.jpg" />
</Image.PreviewGroup>
```

**Key Features**:
- Navigate between images in preview mode
- Previous/Next controls in preview
- Image counter display (e.g., "2 / 5")
- Shared preview modal for all images in group
- Arrow key navigation
- Custom counter render function

**Preview Group Navigation**:
```jsx
<Image.PreviewGroup
  preview={{
    countRender: (current, total) => `Image ${current} of ${total}`,
    current: 0,
    onChange: (current) => console.log('Current image:', current),
  }}
>
  {images.map(img => (
    <Image key={img.id} src={img.url} width={200} />
  ))}
</Image.PreviewGroup>
```

### 6. **Controlled Preview** (Level 2 - Common)
**Support**: Full
**Description**: Programmatically control preview visibility

```jsx
const [visible, setVisible] = useState(false);

<>
  <Button onClick={() => setVisible(true)}>
    Show Preview
  </Button>
  <Image
    preview={{
      visible,
      onVisibleChange: (value) => setVisible(value),
    }}
    src="image.jpg"
  />
</>
```

**Use Cases**:
- Custom trigger elements
- Programmatic preview opening
- External preview controls
- Analytics tracking on preview open/close

### 7. **Preview from One Image** (Level 2 - Common)
**Support**: Full
**Description**: Click one image to preview, but navigate through entire group

```jsx
<Image.PreviewGroup
  preview={{
    visible,
    onVisibleChange: setVisible,
  }}
>
  <Image src="image1.jpg" />
  <Image src="image2.jpg" />
  <Image
    src="image3.jpg"
    onClick={() => setVisible(true)}
  />
</Image.PreviewGroup>
```

### 8. **Custom Preview Source** (Level 2 - Common)
**Support**: Full via `preview.src`
**Description**: Use different image for preview than display

```jsx
<Image
  src="thumbnail.jpg"
  width={200}
  preview={{
    src: "full-resolution.jpg",
  }}
/>
```

**Use Cases**:
- Display thumbnail, preview full resolution
- Bandwidth optimization
- Different aspect ratios for thumbnail vs preview
- CDN URL variations

### 9. **Disable Preview** (Level 1 - Core)
**Support**: Full
**Description**: Disable the preview functionality

```jsx
<Image
  src="image.jpg"
  preview={false}
/>
```

**Use Cases**:
- Static image display
- Thumbnails that shouldn't be clickable
- Controlled preview workflows
- Performance optimization

---

## Image Component API

### Image Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **src** | `string` | - | Image source URL | Level 1 |
| **width** | `string \| number` | - | Image width | Level 1 |
| **height** | `string \| number` | - | Image height | Level 1 |
| **alt** | `string` | - | Image description for accessibility | Level 1 |
| **fallback** | `string` | - | Fallback image URL on error | Level 1 |
| **placeholder** | `ReactNode` | - | Placeholder content while loading | Level 1 |
| **preview** | `boolean \| PreviewType` | `true` | Preview configuration or disable | Level 1 |
| **rootClassName** | `string` | - | Root element class name | Level 1 |
| **onError** | `(e: Event) => void` | - | Error callback | Level 2 |
| **onLoad** | `(e: Event) => void` | - | Load callback | Level 2 |

### PreviewType Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **visible** | `boolean` | - | Preview visibility (controlled) | Level 2 |
| **onVisibleChange** | `(visible: boolean, prevVisible: boolean) => void` | - | Visibility change callback | Level 2 |
| **src** | `string` | - | Custom preview source URL | Level 2 |
| **mask** | `ReactNode` | `"Preview"` | Custom preview mask content | Level 2 |
| **maskClassName** | `string` | - | Preview mask class name | Level 2 |
| **current** | `number` | - | Current image index in group | Level 2 |
| **countRender** | `(current: number, total: number) => ReactNode` | `"current / total"` | Custom counter render | Level 2 |
| **scaleStep** | `number` | `0.5` | Zoom step value | Level 2 |
| **getContainer** | `string \| HTMLElement \| (() => HTMLElement)` | - | Preview container mount point | Level 3 |
| **movable** | `boolean` | `true` | Whether image is draggable in preview | Level 2 |
| **onTransform** | `{ transform: TransformType, action: TransformAction }` | - | Transform callback | Level 3 |
| **toolbarRender** | `(originalNode, info) => React.ReactNode` | - | Custom toolbar render | Level 3 |
| **imageRender** | `(originalNode, info) => React.ReactNode` | - | Custom image render | Level 3 |

### Image.PreviewGroup Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **preview** | `boolean \| PreviewGroupType` | `true` | Preview configuration | Level 1 |
| **items** | `string[] \| { src: string, ... }[]` | - | Preview items (5.7.0+) | Level 2 |

---

## Usage Patterns

### Pattern 1: Basic Image with Preview
**Level**: 1 - Core
**Description**: Standard image display with click-to-preview

```jsx
<Image
  width={200}
  src="https://example.com/photo.jpg"
  alt="Photo description"
/>
```

**Behavior**:
- Displays image at 200px width
- Click opens preview modal
- Preview modal has zoom, rotate, download controls
- ESC key closes preview

### Pattern 2: Image with Fallback
**Level**: 1 - Core
**Description**: Graceful error handling with fallback image

```jsx
<Image
  src="https://example.com/image.jpg"
  fallback="https://via.placeholder.com/200?text=Image+Not+Found"
  alt="Product image"
/>
```

**Behavior**:
- Attempts to load primary image
- On error, displays fallback image
- Fallback image is not previewable by default

### Pattern 3: Progressive Loading
**Level**: 1 - Core
**Description**: Show thumbnail while full image loads

```jsx
<Image
  src="https://example.com/high-res.jpg"
  placeholder={
    <Image
      preview={false}
      src="https://example.com/thumbnail.jpg"
      width={200}
    />
  }
  width={200}
/>
```

**Behavior**:
- Displays blurred/small thumbnail immediately
- Loads full resolution in background
- Swaps to full resolution when loaded
- Smooth transition between states

### Pattern 4: Image Gallery
**Level**: 1 - Core
**Description**: Multiple images with shared preview

```jsx
<Image.PreviewGroup>
  <Image width={200} src="photo1.jpg" />
  <Image width={200} src="photo2.jpg" />
  <Image width={200} src="photo3.jpg" />
  <Image width={200} src="photo4.jpg" />
</Image.PreviewGroup>
```

**Behavior**:
- Click any image to open preview
- Navigate between images with arrows
- Shows counter "1 / 4", "2 / 4", etc.
- Keyboard arrow keys navigate
- All preview controls available

### Pattern 5: Thumbnail Grid with Full Resolution Preview
**Level**: 2 - Common
**Description**: Display thumbnails, preview full resolution

```jsx
const images = [
  {
    thumb: 'thumb1.jpg',
    full: 'full1.jpg'
  },
  {
    thumb: 'thumb2.jpg',
    full: 'full2.jpg'
  }
];

<Image.PreviewGroup>
  {images.map((img, index) => (
    <Image
      key={index}
      width={150}
      src={img.thumb}
      preview={{
        src: img.full
      }}
    />
  ))}
</Image.PreviewGroup>
```

**Benefits**:
- Fast initial load (small thumbnails)
- High quality preview (full resolution)
- Bandwidth optimization
- Better user experience

### Pattern 6: Controlled Preview with Custom Trigger
**Level**: 2 - Common
**Description**: External button controls preview

```jsx
const [visible, setVisible] = useState(false);

<div>
  <Button
    type="primary"
    onClick={() => setVisible(true)}
  >
    View Image
  </Button>

  <Image
    width={0}
    height={0}
    style={{ display: 'none' }}
    src="image.jpg"
    preview={{
      visible,
      onVisibleChange: (vis) => setVisible(vis),
    }}
  />
</div>
```

**Use Cases**:
- Custom UI triggers
- Hidden image preview
- Lightbox-style galleries
- Programmatic preview control

### Pattern 7: Custom Preview Counter
**Level**: 2 - Common
**Description**: Customize gallery counter display

```jsx
<Image.PreviewGroup
  preview={{
    countRender: (current, total) => (
      <span style={{ color: '#fff', fontSize: 20 }}>
        Photo {current} of {total}
      </span>
    ),
  }}
>
  <Image src="photo1.jpg" width={200} />
  <Image src="photo2.jpg" width={200} />
  <Image src="photo3.jpg" width={200} />
</Image.PreviewGroup>
```

### Pattern 8: Lazy Loading Implementation
**Level**: 2 - Common
**Description**: Combine with Intersection Observer for lazy loading

```jsx
import { Image } from 'antd';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ src, alt }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && (
        <Image
          src={src}
          alt={alt}
          placeholder={<Skeleton.Image />}
        />
      )}
    </div>
  );
};
```

**Benefits**:
- Only loads images when visible
- Improves initial page load
- Reduces bandwidth usage
- Better performance on long pages

### Pattern 9: Custom Preview Mask
**Level**: 2 - Common
**Description**: Customize hover overlay content

```jsx
<Image
  src="product.jpg"
  preview={{
    mask: (
      <div>
        <EyeOutlined style={{ marginRight: 8 }} />
        View Product
      </div>
    ),
  }}
/>
```

### Pattern 10: Responsive Images
**Level**: 2 - Common
**Description**: Different images for different screen sizes

```jsx
<Image
  src={window.innerWidth > 768 ? 'large.jpg' : 'small.jpg'}
  width="100%"
  style={{ maxWidth: 600 }}
  preview={{
    src: 'full-resolution.jpg'
  }}
/>
```

---

## Advanced Features

### 1. **Transform Controls in Preview**
**Support**: Level 1 - Core
**Description**: Built-in image manipulation in preview mode

**Available Transformations**:
- **Zoom**: In/out with mouse wheel or buttons
- **Rotate**: Left/right 90° rotation
- **Flip**: Horizontal and vertical flip
- **Reset**: Return to original state
- **Download**: Save image to device

**Keyboard Shortcuts**:
- ESC: Close preview
- Left/Right arrows: Navigate in gallery
- Mouse wheel: Zoom in/out

### 2. **Custom Toolbar Render**
**Support**: Level 3 - Advanced
**Description**: Customize preview toolbar buttons (5.7.0+)

```jsx
<Image
  src="image.jpg"
  preview={{
    toolbarRender: (originalNode, info) => (
      <div>
        {originalNode}
        <Button onClick={() => console.log('Custom action')}>
          Custom Button
        </Button>
      </div>
    ),
  }}
/>
```

### 3. **Custom Image Render**
**Support**: Level 3 - Advanced
**Description**: Fully custom preview image rendering

```jsx
<Image
  src="image.jpg"
  preview={{
    imageRender: (originalNode, info) => (
      <div className="custom-preview-wrapper">
        {originalNode}
        <div className="custom-overlay">
          Custom overlay content
        </div>
      </div>
    ),
  }}
/>
```

### 4. **Preview with Items Array**
**Support**: Level 2 - Common
**Description**: Define preview items without rendering images (5.7.0+)

```jsx
<Image.PreviewGroup
  items={[
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
  ]}
>
  <Image src="image1.jpg" width={200} />
</Image.PreviewGroup>
```

**Use Case**: Preview more images than displayed on page

### 5. **Transform Event Tracking**
**Support**: Level 3 - Advanced
**Description**: Track user interactions in preview

```jsx
<Image
  src="image.jpg"
  preview={{
    onTransform: ({ transform, action }) => {
      console.log('Transform action:', action); // 'zoom' | 'rotate' | 'flip'
      console.log('Current transform:', transform);
      // { x, y, rotate, scale, flipX, flipY }
    },
  }}
/>
```

---

## Responsive Behavior

### Width and Height Handling
**Pattern**: Flexible sizing with max constraints

```jsx
// Fixed size
<Image width={200} height={200} src="image.jpg" />

// Percentage width
<Image width="100%" src="image.jpg" />

// Max width constraint
<Image
  width="100%"
  style={{ maxWidth: 600 }}
  src="image.jpg"
/>

// Maintain aspect ratio
<Image
  width={200}
  src="image.jpg"
  // Height automatically calculated
/>
```

### Responsive Grid Layout
**Pattern**: Image grid with responsive columns

```jsx
import { Row, Col, Image } from 'antd';

<Image.PreviewGroup>
  <Row gutter={[16, 16]}>
    {images.map((img, index) => (
      <Col xs={24} sm={12} md={8} lg={6} key={index}>
        <Image
          src={img}
          width="100%"
          style={{ objectFit: 'cover', height: 200 }}
        />
      </Col>
    ))}
  </Row>
</Image.PreviewGroup>
```

---

## Accessibility Considerations

### Alt Text
**Requirement**: Level 1 - Required
**Description**: Always provide meaningful alt text

```jsx
<Image
  src="product.jpg"
  alt="Blue cotton t-shirt, front view"
/>
```

### Keyboard Navigation
**Support**: Level 1 - Built-in
**Description**: Full keyboard support in preview

- **ESC**: Close preview
- **Left Arrow**: Previous image
- **Right Arrow**: Next image
- **Tab**: Navigate toolbar buttons

### Screen Reader Support
**Support**: Level 1 - Built-in
**Description**: Proper ARIA labels and roles

- Preview mask has accessible label
- Toolbar buttons have aria-labels
- Image counter is announced
- Loading and error states are communicated

### Focus Management
**Support**: Level 1 - Built-in
**Description**: Proper focus handling

- Focus trapped in preview modal
- Focus returns to trigger on close
- Keyboard navigation maintains focus visibility

---

## Performance Considerations

### 1. **Lazy Loading**
**Pattern**: Combine with intersection observer

```jsx
import { Skeleton, Image } from 'antd';

const LazyImage = ({ src, ...props }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {inView ? (
        <Image src={src} {...props} />
      ) : (
        <Skeleton.Image active />
      )}
    </div>
  );
};
```

### 2. **Progressive JPEG**
**Pattern**: Use progressive JPEG for better perceived performance

```jsx
<Image
  src="progressive-photo.jpg" // Progressive JPEG
  placeholder={<Skeleton.Image />}
/>
```

### 3. **Thumbnail Strategy**
**Pattern**: Load small thumbnails first, full resolution on preview

```jsx
<Image
  src="thumbnail.jpg" // 50KB
  width={200}
  preview={{
    src: "full-resolution.jpg" // 500KB
  }}
/>
```

### 4. **CDN Optimization**
**Pattern**: Use CDN with query parameters for different sizes

```jsx
const imageUrl = "https://cdn.example.com/photo.jpg";

<Image
  src={`${imageUrl}?w=200&q=80`} // Thumbnail
  preview={{
    src: `${imageUrl}?w=1920&q=90` // Full resolution
  }}
/>
```

---

## Error Handling Patterns

### Pattern 1: Fallback with Retry
**Level**: 2 - Common

```jsx
const [imageSrc, setImageSrc] = useState(primaryUrl);
const [attempts, setAttempts] = useState(0);

<Image
  src={imageSrc}
  onError={() => {
    if (attempts < 3) {
      setAttempts(prev => prev + 1);
      setTimeout(() => setImageSrc(primaryUrl + '?retry=' + attempts), 1000);
    } else {
      setImageSrc(fallbackUrl);
    }
  }}
  fallback={fallbackUrl}
/>
```

### Pattern 2: Error State Display
**Level**: 2 - Common

```jsx
const [error, setError] = useState(false);

<div>
  <Image
    src="image.jpg"
    onError={() => setError(true)}
    fallback="placeholder.jpg"
  />
  {error && (
    <Alert
      message="Image failed to load"
      type="warning"
      closable
    />
  )}
</div>
```

### Pattern 3: Graceful Degradation
**Level**: 2 - Common

```jsx
<Image
  src={highResUrl}
  fallback={mediumResUrl}
  placeholder={
    <Image
      preview={false}
      src={lowResUrl}
    />
  }
/>
```

---

## Common Use Cases

### 1. **Product Gallery**
```jsx
const ProductGallery = ({ product }) => (
  <Image.PreviewGroup>
    <Row gutter={16}>
      <Col span={24}>
        <Image
          src={product.mainImage}
          width="100%"
          alt={product.name}
        />
      </Col>
      <Col span={24}>
        <Row gutter={8}>
          {product.thumbnails.map((thumb, index) => (
            <Col key={index} span={6}>
              <Image
                src={thumb}
                width="100%"
                preview={{
                  src: product.fullImages[index]
                }}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  </Image.PreviewGroup>
);
```

### 2. **Avatar with Preview**
```jsx
<Image
  width={64}
  height={64}
  style={{ borderRadius: '50%', objectFit: 'cover' }}
  src={user.avatar}
  alt={user.name}
  preview={{
    src: user.avatarLarge,
    mask: 'View profile picture'
  }}
/>
```

### 3. **Image Grid Gallery**
```jsx
const ImageGrid = ({ images }) => (
  <Image.PreviewGroup>
    <Row gutter={[16, 16]}>
      {images.map((image) => (
        <Col xs={12} sm={8} md={6} lg={4} key={image.id}>
          <Image
            src={image.thumbnail}
            width="100%"
            style={{ height: 150, objectFit: 'cover' }}
            preview={{
              src: image.full
            }}
          />
        </Col>
      ))}
    </Row>
  </Image.PreviewGroup>
);
```

### 4. **Blog Post Featured Image**
```jsx
<Image
  width="100%"
  src={post.featuredImage}
  alt={post.title}
  placeholder={
    <Skeleton.Image
      active
      style={{ width: '100%', height: 400 }}
    />
  }
  fallback="https://via.placeholder.com/800x400?text=No+Image"
/>
```

### 5. **Lightbox Gallery**
```jsx
const Lightbox = ({ images, startIndex = 0 }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>
        Open Gallery
      </Button>
      <Image.PreviewGroup
        preview={{
          visible,
          onVisibleChange: setVisible,
          current: startIndex,
          countRender: (current, total) => (
            <span style={{ fontSize: 20 }}>
              {current} / {total}
            </span>
          ),
        }}
      >
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            style={{ display: 'none' }}
          />
        ))}
      </Image.PreviewGroup>
    </>
  );
};
```

---

## Implementation Philosophy

### Ant Design Image Philosophy
Ant Design's Image component embodies a **user-experience-first** approach:

1. **Preview by Default**: Images are interactive and previewable by default
2. **Progressive Enhancement**: Placeholder → Thumbnail → Full Resolution
3. **Error Resilience**: Graceful fallback handling for broken images
4. **Gallery Integration**: Built-in group preview for galleries
5. **Performance Conscious**: Separate thumbnail/preview sources for optimization
6. **Accessibility**: Full keyboard navigation and screen reader support
7. **Transform Controls**: Rich manipulation tools in preview mode
8. **Customization**: Extensive customization options for advanced use cases

### Design Principles

**Progressive Disclosure**:
- Start with thumbnails/placeholders
- Load full resolution on demand
- Preview modal provides focused viewing experience

**Error Handling**:
- Never leave users with broken images
- Fallback images maintain layout
- Visual feedback for loading states

**Performance**:
- Lazy loading support
- Separate thumbnail/full resolution
- Efficient preview modal (single modal for all images)

**Accessibility**:
- Keyboard navigation
- Screen reader support
- Focus management
- Semantic HTML

---

## Pattern Support Levels Summary

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Basic image display | Level 1 | Core feature |
| Preview modal | Level 1 | Core feature |
| Fallback images | Level 1 | Core feature |
| Progressive loading | Level 1 | Core feature |
| PreviewGroup gallery | Level 1 | Core feature |
| Controlled preview | Level 2 | Common |
| Custom preview source | Level 2 | Common |
| Preview from one image | Level 2 | Common |
| Disable preview | Level 1 | Core feature |
| Custom preview mask | Level 2 | Common |
| Transform controls | Level 1 | Core feature |
| Keyboard navigation | Level 1 | Core feature |
| Custom toolbar | Level 3 | Advanced |
| Custom image render | Level 3 | Advanced |
| Items array API | Level 2 | Common |
| Transform tracking | Level 3 | Advanced |
| Lazy loading | Level 2 | Common |
| Responsive sizing | Level 1 | Core feature |

---

## Browser Compatibility

**Supported Browsers**:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

**Progressive Enhancement**:
- Falls back to standard `<img>` if JavaScript disabled
- Preview requires JavaScript

---

## Recommendations for Semantic UI

### Must-Have (Level 1) Features

1. **Basic Image Display**
   - Standard `<ui-image>` with `src`, `width`, `height`, `alt`
   - Maintain aspect ratio
   - Standard HTML img attributes support

2. **Preview Modal**
   - Click to open preview modal
   - Zoom in/out controls
   - Close button and ESC key
   - Transform controls (rotate, flip)
   - Download functionality

3. **Fallback Images**
   - `fallback` attribute for error handling
   - Graceful degradation
   - Visual indicator for broken images

4. **Progressive Loading**
   - Placeholder support via slot
   - Loading states
   - Smooth transitions

5. **PreviewGroup**
   - `<ui-image-group>` wrapper component
   - Navigation between images
   - Counter display
   - Shared preview modal

6. **Responsive Sizing**
   - Percentage-based widths
   - Max-width constraints
   - Maintain aspect ratio
   - Object-fit support

### Should-Have (Level 2) Features

1. **Controlled Preview**
   - Programmatic preview control
   - Visibility state management
   - Custom triggers

2. **Custom Preview Source**
   - Different image for preview
   - Thumbnail/full-resolution pattern
   - Bandwidth optimization

3. **Custom Preview Mask**
   - Customizable hover overlay
   - Custom preview trigger text/icon

4. **Lazy Loading Support**
   - Built-in intersection observer
   - Optional lazy loading
   - Loading skeleton integration

5. **Custom Counter**
   - Customizable gallery counter
   - Template-based counter render

6. **Transform Event Tracking**
   - Callbacks for zoom, rotate, flip
   - Analytics integration

### Consider (Level 3) Features

1. **Custom Toolbar**
   - Extend preview toolbar
   - Custom action buttons
   - Toolbar positioning

2. **Custom Image Render**
   - Full preview customization
   - Custom overlay content
   - Advanced use cases

3. **Items Array API**
   - Define gallery without rendering all images
   - Virtual gallery support
   - Performance optimization

### Semantic UI Differentiators

**Natural Language Patterns**:
```html
<!-- Ant Design -->
<Image preview={false} />

<!-- Semantic UI Could Offer -->
<ui-image no-preview>
<ui-image previewable="false">
```

**Settings Architecture**:
```javascript
// Reactive settings
image.settings.previewable = false;
image.settings.fallback = 'placeholder.jpg';
image.settings.scaleStep = 0.5;
```

**Component Composition**:
```html
<!-- Gallery with natural structure -->
<ui-image-gallery>
  <ui-image src="photo1.jpg"></ui-image>
  <ui-image src="photo2.jpg"></ui-image>
  <ui-image src="photo3.jpg"></ui-image>
</ui-image-gallery>
```

**Slot-Based Placeholders**:
```html
<ui-image src="full.jpg">
  <div slot="placeholder">
    <ui-image src="thumb.jpg" no-preview></ui-image>
  </div>
  <div slot="fallback">
    <ui-icon name="image-broken"></ui-icon>
  </div>
</ui-image>
```

**Event System**:
```javascript
const events = {
  'load ui-image': () => console.log('Image loaded'),
  'error ui-image': () => console.log('Image error'),
  'preview-open ui-image': () => console.log('Preview opened'),
  'preview-close ui-image': () => console.log('Preview closed'),
  'transform ui-image': ({ data }) => console.log('Transform:', data),
};
```

### Key Architectural Considerations

1. **Preview Modal Management**
   - Single shared modal instance for performance
   - Portal-based rendering
   - Focus trap and keyboard handling
   - Z-index management

2. **Loading States**
   - Signal-based loading state
   - Reactive placeholder display
   - Smooth transitions

3. **Error Handling**
   - Signal-based error state
   - Fallback image management
   - Retry mechanisms

4. **Gallery Coordination**
   - Parent-child communication
   - Shared state management
   - Navigation state tracking

5. **Performance**
   - Lazy loading integration
   - Image caching strategy
   - Progressive loading
   - Thumbnail optimization

### Implementation Priority

**Phase 1: Core Display & Preview**
- Basic image display
- Preview modal with zoom controls
- Keyboard navigation
- Close functionality

**Phase 2: Error Handling & Loading**
- Fallback images
- Placeholder support
- Loading states
- Error callbacks

**Phase 3: Gallery Features**
- PreviewGroup component
- Gallery navigation
- Counter display
- Group coordination

**Phase 4: Advanced Features**
- Custom preview source
- Controlled preview
- Transform tracking
- Lazy loading

**Phase 5: Customization**
- Custom masks
- Custom toolbars
- Advanced transforms
- Custom renderers

---

## Research Notes

### Data Collection Method
- Web search extraction from official Ant Design documentation
- HTML structure analysis from Ant Design 4.x documentation
- API reference cross-referencing
- Industry-standard image component patterns
- Research date: 2025-11-04

### Documentation Quality
- Official documentation is comprehensive
- Rich interactive examples available
- Clear API prop tables
- Extensive use case coverage
- Strong progressive enhancement guidance

### Key Insights

1. **Preview is Core**: Unlike basic `<img>` wrappers, Ant Design treats preview as a first-class feature
2. **Gallery Integration**: PreviewGroup provides seamless multi-image experiences
3. **Performance Focus**: Separate thumbnail/preview sources optimize bandwidth
4. **Error Resilience**: Multiple fallback mechanisms ensure graceful degradation
5. **Accessibility**: Full keyboard navigation and screen reader support built-in
6. **Transform Controls**: Rich manipulation tools enhance preview experience
7. **Progressive Loading**: Placeholder → Thumbnail → Full Resolution pattern
8. **Customization**: Extensive hooks for advanced customization

---

## Conclusion

Ant Design's Image component represents a mature, production-ready solution for image display and preview. It goes far beyond a simple `<img>` wrapper to provide:

- **Rich preview experience** with zoom, rotate, flip, download
- **Gallery functionality** with seamless navigation
- **Progressive loading** for optimal performance
- **Error handling** with fallback images
- **Accessibility** with full keyboard and screen reader support
- **Customization** for advanced use cases

For Semantic UI implementation, focus should be on:
1. Core preview modal with transform controls
2. Gallery/group functionality
3. Progressive loading patterns
4. Error handling and fallbacks
5. Natural language API patterns
6. Slot-based composition
7. Reactive settings architecture

The component should maintain Semantic UI's philosophy of natural, declarative syntax while delivering the rich functionality users expect from modern image components.

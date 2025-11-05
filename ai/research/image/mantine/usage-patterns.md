# Mantine Image Component - Usage Patterns Research

**Component:** Image
**Framework:** Mantine (React)
**Package:** @mantine/core
**Documentation URL:** https://mantine.dev/core/image/
**Research Date:** 2025-11-04

---

## Component Definition

**Core purpose:** Minimal wrapper around the standard HTML `img` element with optional fallback functionality and Mantine styling integration.

**Mental model:** Enhanced native image element that provides fail-safe loading behavior and responsive sizing patterns while remaining lightweight and unstyled by default.

**Semantic meaning:** Displays raster or vector graphics with optional error handling. Maintains native `<img>` semantics unless polymorphically rendered as another component.

**Design Philosophy:** Minimalist approach - provides just enough enhancement over native `<img>` to handle common patterns (fallbacks, responsive sizing) without imposing heavy styling opinions.

---

## Documentation Quality

**Overall:** Good - Clear examples covering primary use cases (basic, sizing, fallback, Next.js integration). API is straightforward but documentation is intentionally brief given the component's minimal scope.

**Strengths:**
- Clear code examples
- Practical Next.js integration example
- Explicit recommendation about height setting
- Shows various `fit` behavior patterns

**Gaps:**
- No explicit aspect ratio examples (handled through style props)
- Limited accessibility guidance
- No loading state patterns shown
- No figure/caption patterns (likely a separate component or user implementation)
- No placeholder loading patterns documented

---

## Pattern Support Levels

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Content Patterns** | | | |
| Image source | ✅ | Native | `src` prop (standard img src) |
| Fallback image | ✅ | Native | `fallbackSrc` prop for error handling |
| Alt text | ✅ | Native | Standard `alt` prop (HTML passthrough) |
| **Sizing Patterns** | | | |
| Width control | ✅ | Native | `w` style prop (defaults to 100%) |
| Height control | ✅ | Native | `h` style prop (recommended for stability) |
| Object fit | ✅ | Native | `fit` prop (cover, contain, fill, scale-down, none) |
| Responsive sizing | ✅ | Composed | Via Mantine style props system |
| Aspect ratio | ⚠️ | Composed | Via style props (not dedicated prop) |
| **Visual Patterns** | | | |
| Border radius | ✅ | Native | `radius` prop (xs, sm, md, lg, xl) |
| Custom styling | ✅ | Native | Style props and classNames |
| **Error Handling** | | | |
| Fallback source | ✅ | Native | `fallbackSrc` automatically shown on error |
| Error callback | ⚠️ | Composed | Via standard `onError` event |
| **Loading Patterns** | | | |
| Load callback | ⚠️ | Composed | Via standard `onLoad` event |
| Loading state | ❌ | N/A | Not provided (minimalist design) |
| Placeholder | ⚠️ | Composed | Via fallback or wrapper component |
| **Framework Integration** | | | |
| Polymorphic | ✅ | Native | `component` prop (e.g., Next.js Image) |
| Theme integration | ✅ | Native | Radius and styling follow theme |
| **Accessibility** | | | |
| Alt text | ✅ | Native | Standard HTML `alt` attribute |
| ARIA support | ⚠️ | Composed | Via standard HTML aria-* props |
| **Figure/Caption** | | | |
| Figure element | ❌ | N/A | Not provided (separate component pattern) |
| Caption support | ❌ | N/A | Not provided (separate component pattern) |

**Legend:**
- ✅ Native: Built into component
- ⚠️ Composed: Achievable through standard props/composition
- ❌ N/A: Not applicable or not provided

---

## Code Examples

### Basic Usage

```jsx
import { Image } from '@mantine/core';

// Simple image (defaults to 100% width)
function Demo() {
  return (
    <Image
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      alt="Descriptive alt text"
    />
  );
}
```

### With Border Radius

```jsx
// Rounded corners using theme radius values
<Image
  radius="md"
  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
  alt="Image with rounded corners"
/>

// Other radius options
<Image radius="xs" src="..." alt="..." />  // Small radius
<Image radius="sm" src="..." alt="..." />  // Small-medium radius
<Image radius="md" src="..." alt="..." />  // Medium radius
<Image radius="lg" src="..." alt="..." />  // Large radius
<Image radius="xl" src="..." alt="..." />  // Extra large radius
```

### Fixed Height (Recommended Pattern)

```jsx
// Setting height prevents layout shifts during load
<Image
  radius="md"
  h={200}
  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
  alt="Image with fixed height"
/>
```

**Note:** Documentation explicitly recommends setting height to prevent layout jumps during image loading.

### Custom Width and Height

```jsx
// Explicit width and height
<Image
  h={200}
  w={300}
  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
  alt="Image with fixed dimensions"
/>

// Auto width with contain fit
<Image
  h={200}
  w="auto"
  fit="contain"
  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
  alt="Image with auto width"
/>
```

### Object Fit Patterns

```jsx
// Cover (default) - fills container, may crop
<Image
  h={200}
  fit="cover"
  src="..."
  alt="..."
/>

// Contain - fits within container, preserves aspect ratio
<Image
  h={200}
  fit="contain"
  src="..."
  alt="..."
/>

// Fill - stretches to fill container (may distort)
<Image
  h={200}
  fit="fill"
  src="..."
  alt="..."
/>

// Scale-down - same as contain but never larger than original
<Image
  h={200}
  fit="scale-down"
  src="..."
  alt="..."
/>

// None - original size, may overflow
<Image
  h={200}
  fit="none"
  src="..."
  alt="..."
/>
```

### Fallback Image

```jsx
// Shows fallback when primary source fails
<Image
  radius="md"
  src={null}  // or invalid URL
  h={200}
  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
  alt="Image with fallback"
/>

// Real-world example with potentially failing image
<Image
  radius="md"
  src="https://unreliable-source.com/image.jpg"
  fallbackSrc="https://example.com/fallback.jpg"
  h={200}
  alt="Product image"
/>
```

### Responsive Sizing with Style Props

```jsx
// Responsive height using Mantine style props
<Image
  src="..."
  alt="..."
  h={{ base: 150, sm: 200, md: 250, lg: 300 }}
  w="100%"
  radius="md"
/>

// Responsive width and height
<Image
  src="..."
  alt="..."
  h={{ base: 200, md: 300 }}
  w={{ base: '100%', md: 400 }}
  fit="cover"
/>
```

### Aspect Ratio Control (Composed Pattern)

```jsx
// Using aspect ratio via container styling
import { Box, Image } from '@mantine/core';

<Box style={{ aspectRatio: '16/9' }}>
  <Image
    src="..."
    alt="..."
    h="100%"
    w="100%"
    fit="cover"
  />
</Box>

// Alternative: Using CSS aspect ratio on Image
<Image
  src="..."
  alt="..."
  w="100%"
  style={{ aspectRatio: '4/3' }}
  fit="cover"
/>
```

### Next.js Integration (Polymorphic)

```jsx
import NextImage from 'next/image';
import { Image } from '@mantine/core';

// Use Next.js Image component with Mantine styling
function Demo() {
  return (
    <Image
      component={NextImage}
      src={myImage}
      alt="My image"
      radius="md"
    />
  );
}

// With additional Next.js props
<Image
  component={NextImage}
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority
  radius="lg"
/>
```

### With Custom Styling

```jsx
// Using className
<Image
  src="..."
  alt="..."
  className="custom-image-class"
  h={200}
/>

// Using style prop
<Image
  src="..."
  alt="..."
  style={{
    border: '2px solid #eee',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}
  h={200}
/>
```

### Error and Load Event Handling

```jsx
import { useState } from 'react';

function ImageWithStatus() {
  const [status, setStatus] = useState('loading');

  return (
    <div>
      <Image
        src="https://example.com/image.jpg"
        fallbackSrc="https://example.com/fallback.jpg"
        alt="Example"
        h={200}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      <p>Status: {status}</p>
    </div>
  );
}
```

### Gallery Pattern

```jsx
import { SimpleGrid, Image } from '@mantine/core';

function ImageGallery({ images }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {images.map((img) => (
        <Image
          key={img.id}
          src={img.url}
          alt={img.alt}
          h={200}
          fit="cover"
          radius="md"
          fallbackSrc="https://placehold.co/600x400?text=Not+Found"
        />
      ))}
    </SimpleGrid>
  );
}
```

### Figure with Caption (Composed Pattern)

```jsx
import { Image, Text, Stack } from '@mantine/core';

function FigureImage({ src, alt, caption }) {
  return (
    <Stack gap="xs" component="figure" style={{ margin: 0 }}>
      <Image
        src={src}
        alt={alt}
        radius="md"
        h={250}
      />
      {caption && (
        <Text component="figcaption" size="sm" c="dimmed" ta="center">
          {caption}
        </Text>
      )}
    </Stack>
  );
}

// Usage
<FigureImage
  src="https://example.com/sunset.jpg"
  alt="Sunset over mountains"
  caption="Fig 1: Sunset captured in Rocky Mountains, Colorado"
/>
```

### Lazy Loading Pattern

```jsx
// Native lazy loading
<Image
  src="..."
  alt="..."
  h={200}
  loading="lazy"  // Standard HTML attribute
/>

// Eager loading (default)
<Image
  src="..."
  alt="..."
  h={200}
  loading="eager"
/>
```

### Clickable Image Pattern

```jsx
// As link (polymorphic)
<Image
  component="a"
  href="/gallery/image-detail"
  src="..."
  alt="..."
  h={200}
  radius="md"
  style={{ cursor: 'pointer' }}
/>

// With click handler
<Image
  src="..."
  alt="..."
  h={200}
  onClick={(e) => console.log('Image clicked')}
  style={{ cursor: 'pointer' }}
/>
```

---

## API Reference

### Image Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL (standard HTML img src) |
| `alt` | `string` | - | Alternative text for accessibility (standard HTML) |
| `fallbackSrc` | `string` | - | Fallback image shown when src fails to load |
| `h` | `React.CSSProperties['height'] \| ResponsiveProp` | - | Image height (recommended to prevent layout shift) |
| `w` | `React.CSSProperties['width'] \| ResponsiveProp` | `'100%'` | Image width (defaults to 100% of parent) |
| `fit` | `React.CSSProperties['objectFit']` | `'cover'` | Object-fit CSS property (cover, contain, fill, scale-down, none) |
| `radius` | `MantineRadius` | - | Border radius (xs, sm, md, lg, xl, or number) |
| `component` | `React.ElementType` | `'img'` | Root element type for polymorphic behavior |
| `onLoad` | `React.ReactEventHandler<HTMLImageElement>` | - | Callback when image successfully loads |
| `onError` | `React.ReactEventHandler<HTMLImageElement>` | - | Callback when image fails to load |
| `loading` | `'lazy' \| 'eager'` | - | Native lazy loading attribute |
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |

**Note:** Image component also accepts all standard HTML `<img>` attributes via prop spreading.

### Radius Values (Theme-Based)

| Value | Description |
|-------|-------------|
| `xs` | Extra small radius |
| `sm` | Small radius |
| `md` | Medium radius |
| `lg` | Large radius |
| `xl` | Extra large radius |
| `number` | Custom pixel value |

### Object Fit Values

| Value | Behavior |
|-------|----------|
| `cover` (default) | Fills container, maintains aspect ratio, may crop |
| `contain` | Fits within container, maintains aspect ratio, may letterbox |
| `fill` | Stretches to fill container, may distort aspect ratio |
| `scale-down` | Same as contain but never scales up |
| `none` | Displays at original size, may overflow |

---

## Notable Features

### 1. Minimalist Design Philosophy

**Intentionally Lightweight:** Unlike many component libraries that provide heavily styled image components with loading skeletons, complex placeholder systems, and built-in figure/caption support, Mantine's Image is deliberately minimal. This design choice:
- Keeps bundle size small
- Maintains flexibility for custom implementations
- Avoids imposing visual opinions
- Stays close to native HTML behavior

**When this matters:** Teams that want full control over loading states, placeholders, and image presentation without fighting against framework defaults.

### 2. Fallback Image System

**Built-in Error Handling:** The `fallbackSrc` prop provides automatic image fallback when the primary source fails. This is implemented at the component level rather than requiring manual `onError` handlers.

```jsx
<Image
  src={userAvatar}
  fallbackSrc="/images/default-avatar.png"
  alt="User avatar"
/>
```

**Advantage over native:** Eliminates boilerplate for a common pattern. Most frameworks require manual error handling for this behavior.

### 3. Polymorphic Component Pattern

**Framework Agnostic Integration:** The `component` prop allows seamless integration with other image components (Next.js Image, Gatsby Image, etc.) while maintaining Mantine's styling API.

```jsx
// Works with Next.js optimized images
<Image component={NextImage} src={...} />

// Works with custom image components
<Image component={CustomLazyImage} src={...} />
```

**Why this matters:** Enables using framework-specific optimizations (lazy loading, blur-up placeholders, automatic format selection) while keeping consistent styling API across the application.

### 4. Responsive Style Props

**Built-in Responsive Sizing:** Height and width props support Mantine's responsive object syntax:

```jsx
<Image
  h={{ base: 150, sm: 200, md: 300 }}
  w={{ base: '100%', md: 500 }}
/>
```

**Advantage:** No need for media queries or separate responsive wrappers. Breakpoint-based sizing is declarative and component-local.

### 5. Theme-Integrated Radius

**Consistent Border Radius:** Radius values (`xs`, `sm`, `md`, `lg`, `xl`) automatically follow the application's theme configuration, ensuring visual consistency across all image instances.

```jsx
// Uses theme radius values
<Image radius="md" />
```

**Design system benefit:** Changing theme radius values updates all images globally. No need to hunt down and update individual styles.

### 6. Layout Shift Prevention Pattern

**Explicit Height Recommendation:** Documentation explicitly recommends setting `h` prop to prevent Cumulative Layout Shift (CLS) during image loading:

> "In most cases, you will need to set image height to prevent layout jumps when image is loading."

**Web Vitals Consideration:** This guidance helps developers build better performing sites by addressing a core web vital metric.

### 7. Standard HTML Passthrough

**Native Attribute Support:** All standard `<img>` attributes (alt, loading, decoding, srcSet, sizes, crossOrigin, etc.) work via prop spreading:

```jsx
<Image
  src="..."
  alt="..."
  loading="lazy"
  decoding="async"
  srcSet="image-480w.jpg 480w, image-800w.jpg 800w"
  sizes="(max-width: 600px) 480px, 800px"
/>
```

**Flexibility:** Developers aren't limited to explicitly supported props. Any HTML img attribute works.

---

## Theme System Integration

### How Image Integrates with Mantine Theme

**Radius Values:**
```typescript
// In theme configuration
const theme = {
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  }
};

// Image automatically uses these values
<Image radius="md" /> // Uses 8px from theme
```

**Responsive Breakpoints:**
```typescript
// Theme breakpoints
const theme = {
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  }
};

// Used in responsive props
<Image h={{ base: 150, md: 250, xl: 350 }} />
```

**Style Props System:**
Image supports all Mantine style props (margin, padding, etc.):

```jsx
<Image
  src="..."
  m="md"       // margin
  p="xs"       // padding
  mt="lg"      // margin-top
  w="100%"     // width
  maw={500}    // max-width
/>
```

---

## Implementation Patterns & Best Practices

### 1. Always Set Height for Known Dimensions

**Problem:** Images without explicit height cause layout shift as they load.

**Solution:**
```jsx
// ✅ Good - prevents CLS
<Image h={200} src="..." alt="..." />

// ❌ Bad - causes layout shift
<Image src="..." alt="..." />
```

### 2. Use Fallback for User-Generated Content

**Problem:** User-uploaded images may fail to load or be deleted.

**Solution:**
```jsx
// ✅ Good - always shows something
<Image
  src={user.avatarUrl}
  fallbackSrc="/images/default-avatar.png"
  alt={user.name}
  h={100}
/>
```

### 3. Combine with Aspect Ratio for Responsive Images

**Problem:** Fixed height breaks responsive layouts.

**Solution:**
```jsx
// ✅ Good - maintains aspect ratio across viewports
<Image
  src="..."
  alt="..."
  w="100%"
  style={{ aspectRatio: '16/9' }}
  fit="cover"
/>
```

### 4. Use Polymorphic Pattern for Framework-Specific Optimizations

**Problem:** Need Next.js optimizations but want Mantine styling.

**Solution:**
```jsx
// ✅ Good - best of both worlds
<Image
  component={NextImage}
  src={heroImage}
  alt="..."
  width={1200}
  height={600}
  priority
  radius="md"
/>
```

### 5. Compose Figure/Caption When Needed

**Problem:** Need semantic figure markup with caption.

**Solution:**
```jsx
// ✅ Good - semantic and accessible
<Box component="figure">
  <Image src="..." alt="..." h={300} />
  <Text component="figcaption" size="sm" c="dimmed">
    Figure 1: Description
  </Text>
</Box>
```

---

## Comparison to Other Approaches

### vs. Native `<img>` Element

| Feature | Native `<img>` | Mantine Image |
|---------|---------------|---------------|
| Fallback handling | Manual onError | Built-in fallbackSrc |
| Responsive sizing | CSS/media queries | Prop-based responsive object |
| Border radius | CSS | Theme-integrated radius prop |
| Object fit | CSS property | Fit prop (more discoverable) |
| Style props | N/A | Full Mantine style props |
| Polymorphic | N/A | Component prop |

**When to use native:** Simple static images with no fallback needs.

**When to use Mantine Image:** Responsive layouts, user-generated content, theme integration, fallback requirements.

### vs. Next.js Image

| Feature | Next.js Image | Mantine Image |
|---------|--------------|---------------|
| Automatic optimization | ✅ Yes | ❌ No (but can wrap Next.js Image) |
| Fallback support | Manual | Built-in |
| Theme integration | N/A | Full Mantine theme |
| Style props | Limited | Full Mantine system |
| Blur placeholder | ✅ Yes | ❌ No |

**Best approach:** Use Mantine Image with `component={NextImage}` for both optimizations and consistent styling.

### vs. Heavy Image Components (Material-UI, Chakra)

**Mantine's approach is intentionally lighter:**
- No built-in loading skeleton
- No built-in placeholder system
- No built-in figure/caption component
- Fewer props to learn

**Trade-off:** More flexibility and smaller bundle vs. less out-of-box functionality.

---

## Missing Features (By Design)

These are intentionally not included in Mantine's minimalist approach:

1. **Loading States:** No built-in loading skeleton or spinner
2. **Placeholder System:** No blur-up or low-quality image placeholders (use Next.js Image via polymorphism if needed)
3. **Figure Component:** No dedicated figure/caption component (compose using Box and Text)
4. **Lightbox Integration:** No built-in modal/lightbox behavior
5. **Image Comparison:** No side-by-side comparison modes
6. **Zoom/Pan:** No built-in zoom controls
7. **Lazy Load Component:** Uses native `loading="lazy"` instead of custom implementation
8. **Art Direction:** No built-in `<picture>` element support (use srcSet/sizes or polymorphism)

**Philosophy:** These features are better implemented at the application level or through composition with other Mantine components, avoiding bloat for users who don't need them.

---

## Accessibility Considerations

### Built-in Accessibility

**Native HTML Semantics:** Image component renders as `<img>` by default, inheriting native accessibility.

**Required Considerations:**
1. **Always provide `alt` text:**
   ```jsx
   // ✅ Good
   <Image src="..." alt="Descriptive text" />

   // ❌ Bad
   <Image src="..." />
   ```

2. **Use empty alt for decorative images:**
   ```jsx
   // ✅ Good for decorative
   <Image src="decoration.svg" alt="" />
   ```

3. **Avoid text in images without alt text duplication:**
   ```jsx
   // ✅ Good - alt duplicates image text
   <Image src="sale-banner.jpg" alt="50% off sale this weekend" />
   ```

### Advanced Accessibility Patterns

**Loading attribute for performance:**
```jsx
// Above fold - load immediately
<Image src="hero.jpg" alt="..." loading="eager" />

// Below fold - lazy load
<Image src="gallery-item.jpg" alt="..." loading="lazy" />
```

**ARIA attributes (when needed):**
```jsx
<Image
  src="..."
  alt=""
  role="presentation"  // Explicitly decorative
/>

<Image
  src="diagram.jpg"
  alt="System architecture diagram"
  aria-describedby="diagram-description"
/>
<div id="diagram-description">
  Detailed text description of the diagram...
</div>
```

---

## Research Notes

### Design Philosophy Insights

**Minimalism as a Feature:**
Mantine's Image component follows the Unix philosophy: "Do one thing and do it well." It:
- Wraps `<img>` with minimal enhancements
- Provides fallback handling (most common need)
- Integrates with theme system
- Stays out of the way otherwise

**Composition Over Configuration:**
Rather than baking in figure/caption, loading states, lightbox behavior, etc., Mantine expects developers to compose these from other components:
- Figure/caption: Use Box + Text
- Loading states: Use Skeleton component
- Lightbox: Use Modal component
- Placeholders: Use Next.js Image via polymorphism

### Implementation Simplicity

The component's minimal API surface suggests a very straightforward implementation:
1. Render `<img>` (or polymorphic component)
2. Apply style props
3. Apply theme radius
4. Handle error → swap to fallbackSrc
5. Pass through remaining props

This simplicity means:
- Easy to understand
- Easy to debug
- Easy to customize
- Small bundle size
- Predictable behavior

### Framework Comparison Insights

**Mantine vs. Material-UI:** Material-UI doesn't have a dedicated Image component, expecting developers to use native `<img>` or third-party solutions. Mantine provides just enough to be useful.

**Mantine vs. Chakra:** Chakra's Image has similar features but includes skeleton loading by default. Mantine separates these concerns.

**Mantine vs. Ant Design:** Ant Design has a more feature-rich Image with built-in preview/lightbox. Mantine takes the minimalist approach.

**Positioning:** Mantine's Image sits in a sweet spot - more helpful than Material-UI's absence, less opinionated than Ant Design's full-featured approach.

---

## Key Takeaways for Cross-Framework Analysis

1. **Minimalist Philosophy:** Intentionally lightweight wrapper over native `<img>` rather than feature-rich component
2. **Fallback as Primary Feature:** Built-in `fallbackSrc` addresses most common enhancement need
3. **Polymorphic Power:** Can wrap Next.js Image or other optimized image components while maintaining consistent API
4. **Theme Integration:** Radius values and responsive props follow theme configuration
5. **Layout Shift Awareness:** Documentation explicitly recommends height setting for web performance
6. **Composition Encouraged:** Expects figure/caption, loading states, etc. to be composed from other components
7. **Native HTML Respect:** Passes through all standard HTML attributes, doesn't hide native functionality
8. **Style Props System:** Full Mantine style props support for spacing, sizing, etc.
9. **Responsive First:** Built-in responsive sizing via breakpoint object syntax
10. **No Loading States:** Intentionally avoids built-in skeleton/placeholder (use Skeleton component separately)
11. **Object Fit First-Class:** Dedicated `fit` prop makes common CSS pattern more discoverable
12. **Framework Agnostic:** Works with any image optimization library via polymorphism

---

## When to Use Mantine Image

**Use Mantine Image when:**
- Building with Mantine design system (theme consistency)
- Need fallback image handling
- Want responsive sizing via props instead of CSS
- Using Next.js Image but want consistent Mantine styling
- Prefer composition over configuration
- Want minimal bundle overhead

**Consider alternatives when:**
- Need built-in loading skeletons (use Mantine Image + Skeleton component)
- Need complex lightbox/gallery features (use with Mantine Modal)
- Need blur-up placeholders (use Next.js Image via polymorphism)
- Need art direction with `<picture>` (native HTML or specialized library)
- Want zero abstraction (use native `<img>`)

---

**Research Status:** Complete
**Documentation Quality:** Good - Clear and practical, though intentionally brief given minimal scope
**Framework Maturity:** Production-ready. Mature minimalist design that does one thing well.
**Unique Approach:** Strikes balance between helpful (fallback, theme integration) and minimal (no loading states, placeholders)

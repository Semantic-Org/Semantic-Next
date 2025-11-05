# HeroUI - Image Usage Patterns

> Last Modified: 2025-11-04

## Component URL
**Image**: https://www.heroui.com/docs/components/image
Status: ✅ URL accessible
Version: Current (HeroUI v2.x - Previously NextUI)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The component has detailed documentation with examples, API references, and integration patterns. However, some features lack extensive code examples (particularly advanced responsive patterns and object-fit usage).

---

## Component Definition
- **Core purpose**: Display images with enhanced loading states, fallback handling, blur effects, and zoom interactions. Provides a wrapper around the native `<img>` element with additional UX features like skeleton loaders and smooth transitions.
- **Mental model**: An enhanced image element that handles loading states gracefully, provides visual feedback during load, and supports interactive features (zoom). Users expect images to load smoothly with visual placeholders and fallback handling for broken images.
- **Semantic meaning**: Represents visual content with progressive enhancement - from skeleton placeholder → loading image → fully loaded image. Communicates visual information with proper accessibility through alt text and loading states.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children/slots
- **CSS-only**: Requires custom styling

---

## Loading Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Eager loading** | ✅ | Native | `loading="eager"` - Load immediately (default browser behavior) |
| **Lazy loading** | ✅ | Native | `loading="lazy"` - Native browser lazy loading |
| **Skeleton animation** | ✅ | Native | Automatic skeleton loader during image load (enabled by default) |
| **Disable skeleton** | ✅ | Native | `disableSkeleton={true}` - Remove skeleton animation |
| **Opacity transition** | ✅ | Native | Automatic fade-in animation on successful load |
| **Fallback image** | ✅ | Native | `fallbackSrc` - Display fallback when primary src fails |
| **Loading callback** | ✅ | Native | `onLoad` - Event handler when image loads successfully |
| **Error callback** | ✅ | Native | `onError` - Event handler when image fails to load |

### Code Example - Loading Patterns
```jsx
import {Image} from "@heroui/react";

// Lazy loading with skeleton
<Image
  alt="Product image"
  src="https://example.com/product.jpg"
  loading="lazy"
  width={300}
  height={400}
/>

// Eager loading without skeleton
<Image
  alt="Hero image"
  src="https://example.com/hero.jpg"
  loading="eager"
  disableSkeleton={true}
  width={1200}
  height={600}
/>

// Fallback handling
<Image
  alt="User avatar"
  src="https://example.com/avatar.jpg"
  fallbackSrc="https://example.com/default-avatar.jpg"
  width={100}
  height={100}
/>

// Loading state callbacks
<Image
  alt="Gallery image"
  src="https://example.com/photo.jpg"
  onLoad={(e) => console.log("Image loaded successfully")}
  onError={() => console.log("Failed to load image")}
  width={400}
  height={300}
/>
```

---

## Visual Effect Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Blur effect** | ✅ | Native | `isBlurred={true}` - Duplicates image with blur as background |
| **Zoom effect** | ✅ | Native | `isZoomed={true}` - Scale image on hover interaction |
| **Shadow** | ✅ | Native | `shadow="none" \| "sm" \| "md" \| "lg"` - Drop shadow effect |
| **Border radius** | ✅ | Native | `radius="none" \| "sm" \| "md" \| "lg" \| "full"` |
| **Custom transitions** | ⚠️ | CSS-only | Requires custom CSS through `classNames` prop |

### Code Example - Visual Effects
```jsx
import {Image} from "@heroui/react";

// Blur effect
<Image
  alt="Background image"
  src="https://example.com/background.jpg"
  isBlurred={true}
  width={400}
  height={300}
/>

// Zoom on hover
<Image
  alt="Product detail"
  src="https://example.com/product-detail.jpg"
  isZoomed={true}
  width={500}
  height={400}
/>

// Combined effects with shadow and radius
<Image
  alt="Card image"
  src="https://example.com/card.jpg"
  isBlurred={true}
  isZoomed={true}
  shadow="lg"
  radius="lg"
  width={300}
  height={400}
/>

// Full radius (circular/pill)
<Image
  alt="Avatar"
  src="https://example.com/avatar.jpg"
  radius="full"
  width={100}
  height={100}
/>
```

---

## Responsive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **srcSet** | ✅ | Native | `srcSet` - Responsive image sources for different resolutions |
| **sizes** | ✅ | Native | `sizes` - Image size hints for responsive selection |
| **Width/height** | ✅ | Native | Numeric `width` and `height` props (not CSS dimensions) |
| **Object-fit** | ⚠️ | CSS-only | Requires custom CSS via `classNames.img` |
| **Aspect ratio** | ⚠️ | CSS-only | Set via width/height props or custom CSS |

### Code Example - Responsive Patterns
```jsx
import {Image} from "@heroui/react";

// Responsive with srcSet and sizes
<Image
  alt="Responsive image"
  src="https://example.com/image-800w.jpg"
  srcSet="https://example.com/image-400w.jpg 400w,
          https://example.com/image-800w.jpg 800w,
          https://example.com/image-1200w.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  width={800}
  height={600}
/>

// Fixed dimensions
<Image
  alt="Fixed size thumbnail"
  src="https://example.com/thumb.jpg"
  width={200}
  height={200}
/>

// Custom object-fit via classNames
<Image
  alt="Cover image"
  src="https://example.com/cover.jpg"
  width={400}
  height={300}
  classNames={{
    img: "object-cover"
  }}
/>
```

---

## Size Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Explicit dimensions** | ✅ | Native | `width` and `height` props (numbers) |
| **Aspect ratio** | ⚠️ | CSS-only | Maintained via width/height ratio or CSS |
| **Responsive sizing** | ✅ | Native | Via `srcSet` and `sizes` attributes |
| **Fluid width** | ⚠️ | CSS-only | Can use CSS through `classNames.wrapper` or `classNames.img` |

**Note**: The `width` and `height` props are numeric values passed to the underlying `<img>` element, not CSS dimensions. For CSS-based sizing, use the `classNames` prop.

### Code Example - Sizing
```jsx
import {Image} from "@heroui/react";

// Explicit dimensions
<Image
  alt="Fixed size"
  src="https://example.com/image.jpg"
  width={400}
  height={300}
/>

// Aspect ratio via dimensions
<Image
  alt="16:9 aspect ratio"
  src="https://example.com/video-thumbnail.jpg"
  width={1920}
  height={1080}
/>

// Custom CSS sizing
<Image
  alt="Full width"
  src="https://example.com/banner.jpg"
  classNames={{
    wrapper: "w-full",
    img: "w-full h-auto"
  }}
/>
```

---

## Radius Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **None** | ✅ | Native | `radius="none"` - Square corners (0 radius) |
| **Small** | ✅ | Native | `radius="sm"` - Slightly rounded corners |
| **Medium** | ✅ | Native | `radius="md"` - Moderately rounded corners |
| **Large** | ✅ | Native | `radius="lg"` - Very rounded corners (default) |
| **Full** | ✅ | Native | `radius="full"` - Fully circular/pill shape |

### Code Example - Radius
```jsx
import {Image} from "@heroui/react";

<div className="flex gap-4">
  <Image
    alt="No radius"
    src="https://example.com/image.jpg"
    radius="none"
    width={200}
    height={200}
  />
  <Image
    alt="Small radius"
    src="https://example.com/image.jpg"
    radius="sm"
    width={200}
    height={200}
  />
  <Image
    alt="Medium radius"
    src="https://example.com/image.jpg"
    radius="md"
    width={200}
    height={200}
  />
  <Image
    alt="Large radius"
    src="https://example.com/image.jpg"
    radius="lg"
    width={200}
    height={200}
  />
  <Image
    alt="Full radius (circle)"
    src="https://example.com/image.jpg"
    radius="full"
    width={200}
    height={200}
  />
</div>
```

---

## Shadow Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **None** | ✅ | Native | `shadow="none"` - No shadow (default) |
| **Small** | ✅ | Native | `shadow="sm"` - Subtle shadow |
| **Medium** | ✅ | Native | `shadow="md"` - Moderate shadow |
| **Large** | ✅ | Native | `shadow="lg"` - Prominent shadow |

### Code Example - Shadows
```jsx
import {Image} from "@heroui/react";

<div className="flex gap-4">
  <Image
    alt="No shadow"
    src="https://example.com/image.jpg"
    shadow="none"
    width={200}
    height={200}
  />
  <Image
    alt="Small shadow"
    src="https://example.com/image.jpg"
    shadow="sm"
    width={200}
    height={200}
  />
  <Image
    alt="Medium shadow"
    src="https://example.com/image.jpg"
    shadow="md"
    width={200}
    height={200}
  />
  <Image
    alt="Large shadow"
    src="https://example.com/image.jpg"
    shadow="lg"
    width={200}
    height={200}
  />
</div>
```

---

## Wrapper Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Default wrapper** | ✅ | Native | Wrapper enabled by default - supports skeleton, zoom, alignment |
| **Remove wrapper** | ✅ | Native | `removeWrapper={true}` - Renders bare `<img>` without wrapper |

### Code Example - Wrapper Control
```jsx
import {Image} from "@heroui/react";

// Default: With wrapper (supports skeleton, zoom)
<Image
  alt="With wrapper"
  src="https://example.com/image.jpg"
  isZoomed={true}
  width={300}
  height={200}
/>

// Without wrapper (bare img element)
<Image
  alt="Without wrapper"
  src="https://example.com/image.jpg"
  removeWrapper={true}
  width={300}
  height={200}
/>
```

**Note**: When `removeWrapper={true}`:
- Skeleton animation is disabled
- Zoom functionality is disabled
- Custom wrapper styling via `classNames.wrapper` has no effect
- The component renders as a plain `<img>` element

---

## Slot Customization Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **img slot** | ✅ | Native | Style the `<img>` element via `classNames.img` |
| **wrapper slot** | ✅ | Native | Style the wrapper container via `classNames.wrapper` |
| **zoomedWrapper slot** | ✅ | Native | Style the zoom container via `classNames.zoomedWrapper` |
| **blurredImg slot** | ✅ | Native | Style the blurred background via `classNames.blurredImg` |

### Code Example - Slot Customization
```jsx
import {Image} from "@heroui/react";

// Custom styling via classNames slots
<Image
  alt="Custom styled image"
  src="https://example.com/image.jpg"
  width={400}
  height={300}
  classNames={{
    wrapper: "p-4 bg-gray-100 rounded-xl",
    img: "object-cover grayscale hover:grayscale-0 transition",
    zoomedWrapper: "border-4 border-blue-500",
    blurredImg: "opacity-50"
  }}
  isZoomed={true}
  isBlurred={true}
/>
```

---

## Next.js Integration Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Next.js Image wrapper** | ✅ | Native | Use `as={NextImage}` to wrap Next.js Image component |
| **Hybrid approach** | ✅ | Composed | Combine HeroUI features with Next.js optimization |

### Code Example - Next.js Integration
```jsx
import {Image} from "@heroui/react";
import NextImage from "next/image";

// HeroUI Image wrapping Next.js Image
<Image
  alt="Optimized hero image"
  as={NextImage}
  src="https://heroui.com/images/hero-card-complete.jpeg"
  width={300}
  height={200}
/>

// Advanced: HeroUI features + Next.js optimization
<Image
  alt="Optimized with effects"
  as={NextImage}
  src="https://example.com/product.jpg"
  width={600}
  height={400}
  isBlurred={true}
  isZoomed={true}
  radius="lg"
  shadow="md"
  priority // Next.js prop
/>
```

**Important Considerations**:
- HeroUI Image is client-side only (uses hooks for states/animations)
- If you don't need loading states, skeleton, blur, or zoom → use Next.js Image directly
- When combining both, HeroUI props (isBlurred, isZoomed) work alongside Next.js props (priority, quality, fill)
- The `as` prop polymorphism allows seamless integration

---

## Accessibility Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Alt text** | ✅ | Native | `alt` prop - Required for screen readers |
| **Loading attribute** | ✅ | Native | `loading="eager" \| "lazy"` - Native lazy loading |
| **Semantic HTML** | ✅ | Native | Renders proper `<img>` element |
| **Error handling** | ✅ | Native | `onError` callback + `fallbackSrc` for failed loads |

### Code Example - Accessibility
```jsx
import {Image} from "@heroui/react";

// Accessible image with proper alt text
<Image
  alt="A golden retriever playing fetch in a sunny park"
  src="https://example.com/dog-playing.jpg"
  width={400}
  height={300}
/>

// Decorative image (empty alt)
<Image
  alt=""
  src="https://example.com/decorative-pattern.jpg"
  width={200}
  height={200}
/>

// With fallback for reliability
<Image
  alt="User profile: Jane Doe"
  src="https://example.com/profiles/jane.jpg"
  fallbackSrc="https://example.com/default-avatar.jpg"
  width={100}
  height={100}
/>
```

---

## Notable Features

### 1. Skeleton Loading Animation
**How it works**: While the image is loading, an animated skeleton placeholder is displayed. On successful load, the skeleton fades out and the image fades in with an opacity transition.

**Configuration**:
- Enabled by default
- Disable via `disableSkeleton={true}`
- Automatically disabled when `removeWrapper={true}`

**Use cases**:
- Progressive content loading
- Visual feedback during slow network conditions
- Improved perceived performance

### 2. Blur Effect Implementation
**How it works**: When `isBlurred={true}`, the component duplicates the image and renders a blurred version as a background layer. The sharp image is rendered on top.

**Technical details**:
- Uses the `blurredImg` slot for styling
- Creates layered effect (blurred background + sharp foreground)
- Requires wrapper to be enabled

**Use cases**:
- Hero sections with text overlay
- Card backgrounds
- Aesthetic depth effects

### 3. Zoom on Hover
**How it works**: When `isZoomed={true}`, the image scales up on hover interaction. The `zoomedWrapper` slot prevents overflow.

**Technical details**:
- Hover-triggered CSS transform scale
- Contained within `zoomedWrapper` bounds
- Smooth transition animation
- Requires wrapper to be enabled

**Use cases**:
- Product galleries
- Portfolio images
- Interactive image previews

### 4. Fallback Handling
**How it works**: If the primary `src` fails to load, the component automatically displays the `fallbackSrc` image.

**Failure scenarios covered**:
- Network errors
- 404 Not Found
- Invalid image data
- Permission errors

**Use cases**:
- User avatars (fallback to default avatar)
- Product images (fallback to placeholder)
- Graceful degradation

### 5. Wrapper Control
**Why it matters**: The wrapper enables skeleton, zoom, and blur features but adds DOM structure. For performance-critical scenarios or when these features aren't needed, `removeWrapper={true}` renders a bare `<img>` element.

**Trade-offs**:
- **With wrapper**: Full features, additional DOM nodes
- **Without wrapper**: Minimal DOM, no skeleton/zoom/blur

### 6. Slot-Based Styling
**Flexibility**: The `classNames` prop exposes four distinct slots for granular styling control:
- `wrapper` - Container styling
- `img` - Image element styling
- `zoomedWrapper` - Zoom container styling
- `blurredImg` - Blurred background styling

This enables precise customization of each visual layer.

### 7. Native Lazy Loading
**Browser-native**: Uses the HTML `loading` attribute for lazy loading, which is:
- Supported by modern browsers
- Zero JavaScript overhead
- Automatic viewport detection
- Configurable via `loading="lazy"` prop

### 8. Responsive Image Support
**Standards-compliant**: Supports `srcSet` and `sizes` attributes for responsive images:
- Multiple resolution sources
- Automatic resolution selection
- Bandwidth-aware loading
- Art direction support

---

## Research Notes

### Framework Architecture Observations

**Client-Side Focus**: HeroUI Image is explicitly client-side with hooks for loading states and animations. This is intentional - the component prioritizes UX features (skeleton, blur, zoom) over server-side rendering. For SSR/SSG without client features, Next.js Image is recommended directly.

**Slot-Based Architecture**: The component uses a four-slot system (wrapper, img, zoomedWrapper, blurredImg) for styling. This provides granular control while maintaining component encapsulation.

**Effect Layering**: Blur and zoom effects are implemented as wrapper-dependent features. The blur effect duplicates the image DOM, which has performance implications for many images.

**Wrapper as Feature Gate**: The `removeWrapper` prop is a performance escape hatch. When true, it strips all enhanced features and renders a plain `<img>` - this is an interesting pattern for progressive enhancement.

### Cross-Framework Considerations

For web components adaptation:

**Loading States**:
1. **Skeleton**: Use Shadow DOM `<slot>` with fallback skeleton content that's replaced on load
2. **Transitions**: CSS transitions triggered by loading state attribute (data-loading)
3. **Callbacks**: Use custom events `imageload` and `imageerror`

**Blur Effect**:
1. **Implementation**: Duplicate image in Shadow DOM with CSS blur filter
2. **Layering**: Use absolute positioning with z-index stacking
3. **Performance**: Consider Intersection Observer to only apply blur when visible

**Zoom Effect**:
1. **CSS-first**: Use `:hover` pseudo-class with transform scale
2. **Overflow**: Wrapper with `overflow: hidden` prevents zoom spillover
3. **Smooth**: CSS transition for transform property

**Wrapper Control**:
1. **Pattern**: Conditional template rendering based on wrapper boolean
2. **Feature detection**: Disable wrapper-dependent features when wrapper is off
3. **Performance**: Direct `<img>` rendering for minimal overhead

**Responsive Images**:
1. **Native**: Pass through srcSet/sizes to native `<img>` element
2. **Standards-based**: No framework-specific magic needed
3. **Browser-native**: Leverage built-in browser optimization

### API Design Insights

**Minimal API Surface**: The Image component has a relatively small prop surface compared to other HeroUI components. This is appropriate - it's an enhancement of a native element, not a complex widget.

**Boolean Flags for Features**: Using `isBlurred`, `isZoomed`, `disableSkeleton`, `removeWrapper` as boolean flags is clear and discoverable. The "is" prefix for state and "disable" prefix for opt-out is consistent.

**Slot Naming Convention**: The `classNames` object uses descriptive slot names:
- `wrapper` - Clear purpose
- `img` - Matches native element
- `zoomedWrapper` - Feature-specific
- `blurredImg` - Feature-specific

This naming makes customization intuitive.

**Separate Loading Props**: Having both `loading` (native attribute) and `disableSkeleton` (custom feature) separates concerns - browser lazy loading vs. UI feedback.

**Fallback Simplicity**: Single `fallbackSrc` prop is simpler than fallback chains or callback patterns. Covers 90% of use cases.

### Performance Considerations

**Skeleton Default**: Skeleton is enabled by default, adding DOM and animation overhead. For image-heavy pages, consider `disableSkeleton={true}`.

**Blur Duplication**: The blur effect duplicates the image in DOM, doubling memory usage per blurred image. Use sparingly on image-heavy pages.

**Wrapper Overhead**: The wrapper adds DOM structure. For galleries with hundreds of images, consider `removeWrapper={true}` for images that don't need enhanced features.

**Native Lazy Loading**: Using `loading="lazy"` leverages browser-native lazy loading with zero JavaScript. This is far more performant than JavaScript-based solutions.

**Zoom CSS**: Zoom uses CSS transform, which is GPU-accelerated. This is efficient compared to JavaScript-based zoom solutions.

### Accessibility Considerations

**Alt Text Required**: The documentation shows `alt` prop in all examples, reinforcing accessibility. However, the component doesn't enforce required alt text (unfortunate but consistent with native `<img>`).

**Loading States**: The skeleton provides visual feedback during load, but no ARIA live region announces loading to screen readers. This could be improved.

**Fallback Images**: When a fallback image loads, the alt text remains the same. This is correct - the alt text describes the content, not the specific image source.

**Decorative Images**: Empty alt text (`alt=""`) is supported for decorative images, following best practices.

### Next.js Integration Philosophy

**Polymorphic Component**: Using the `as` prop to wrap Next.js Image is elegant. It allows composition of HeroUI features (blur, zoom, skeleton) with Next.js optimization (automatic srcSet, lazy loading, priority).

**Client-Side Caveat**: The documentation explicitly warns that HeroUI Image is client-side. This is honest and helps developers make informed decisions.

**Hybrid Approach**: The pattern of combining both frameworks' strengths (Next.js optimization + HeroUI UX features) is practical and well-documented.

**When to Use What**:
- **Next.js Image alone**: SSR/SSG, no client features needed, optimal performance
- **HeroUI Image alone**: Client-only, want skeleton/blur/zoom, non-Next.js projects
- **Combined (as={NextImage})**: Need both Next.js optimization and HeroUI features

### Potential Improvements

1. **Object-fit Control**: No native prop for object-fit (cover, contain, fill). Requires CSS via `classNames.img`. A dedicated `objectFit` prop would improve DX.

2. **Aspect Ratio Prop**: No dedicated aspect ratio prop. Must calculate via width/height or use CSS. An `aspectRatio` prop (e.g., "16/9", "4/3") would be convenient.

3. **Loading State Exposure**: No way to access loading state externally (e.g., for coordinating multiple images). An `onLoadingChange` callback could help.

4. **Blur Intensity**: The blur effect has no intensity control. A `blurAmount` prop (e.g., "sm", "md", "lg") would add flexibility.

5. **Zoom Scale Control**: The zoom scale is fixed. A `zoomScale` prop (e.g., 1.1, 1.5, 2.0) would allow customization.

6. **Placeholder Image**: No placeholder image support (distinct from fallback). A `placeholderSrc` for low-res preview during load would enhance perceived performance.

7. **Multiple Fallbacks**: Only one fallback level. A fallback chain (try source 2, then 3, then default) could improve reliability.

8. **ARIA Live Region**: Loading states aren't announced to screen readers. Adding ARIA live regions would improve accessibility.

9. **Intersection Observer**: No built-in intersection observer for advanced lazy loading control. Could improve performance for long pages.

10. **Progress Indication**: No progress bar or percentage for large images. Could improve UX on slow connections.

---

## Installation

```bash
# CLI installation
npx heroui-cli@latest add image

# Manual installation (npm)
npm install @heroui/image

# Manual installation (yarn)
yarn add @heroui/image

# Manual installation (pnpm)
pnpm add @heroui/image

# Manual installation (bun)
bun add @heroui/image
```

### Import Styles
```javascript
// Global import (includes all components)
import {Image} from "@heroui/react";

// Individual import (tree-shakeable)
import {Image} from "@heroui/image";
```

---

## Complete API Reference

### Image Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | Image source URL (required) |
| `alt` | string | - | Alternative text for accessibility (required) |
| `srcSet` | string | - | Responsive image sources for different screen sizes/resolutions |
| `sizes` | string | - | Image size hints for browser to select from srcSet |
| `width` | number | - | Image width in pixels |
| `height` | number | - | Image height in pixels |
| `loading` | "eager" \| "lazy" | - | Native browser loading strategy |
| `radius` | "none" \| "sm" \| "md" \| "lg" \| "full" | "lg" | Border radius size |
| `shadow` | "none" \| "sm" \| "md" \| "lg" | "none" | Drop shadow size |
| `fallbackSrc` | string | - | Fallback image URL when src fails to load |
| `isBlurred` | boolean | false | Enable blur effect (duplicates image with blur background) |
| `isZoomed` | boolean | false | Enable zoom effect on hover |
| `removeWrapper` | boolean | false | Render without wrapper (disables skeleton/zoom/blur) |
| `disableSkeleton` | boolean | false | Disable skeleton loading animation |
| `classNames` | object | - | Custom CSS classes for component slots |
| `onLoad` | (e: Event) => void | - | Callback when image loads successfully |
| `onError` | () => void | - | Callback when image fails to load |
| `as` | ElementType | "img" | Render as different component (e.g., NextImage) |

### classNames Slots

| Slot | Description | Use Case |
|------|-------------|----------|
| `wrapper` | Outer container element | Layout, spacing, background |
| `img` | The `<img>` element itself | Object-fit, filters, transforms |
| `zoomedWrapper` | Zoom overflow container | Border, clipping, zoom bounds |
| `blurredImg` | Blurred background image | Blur styling, opacity, layering |

### Example: All Props Combined
```jsx
<Image
  // Core image attributes
  src="https://example.com/high-res.jpg"
  srcSet="https://example.com/small.jpg 400w,
          https://example.com/medium.jpg 800w,
          https://example.com/high-res.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  alt="Product showcase image"
  width={800}
  height={600}

  // Loading behavior
  loading="lazy"
  fallbackSrc="https://example.com/placeholder.jpg"
  disableSkeleton={false}

  // Visual effects
  isBlurred={true}
  isZoomed={true}
  radius="lg"
  shadow="md"

  // Event handlers
  onLoad={(e) => console.log("Loaded:", e.target.src)}
  onError={() => console.error("Failed to load image")}

  // Custom styling
  classNames={{
    wrapper: "p-4 bg-gradient-to-br from-purple-500 to-pink-500",
    img: "object-cover filter hover:brightness-110 transition",
    zoomedWrapper: "border-4 border-white shadow-xl",
    blurredImg: "opacity-60 blur-2xl"
  }}
/>
```

---

## Usage Scenarios

### Hero Section
```jsx
<Image
  alt="Hero background"
  src="https://example.com/hero.jpg"
  isBlurred={true}
  loading="eager"
  width={1920}
  height={1080}
  radius="none"
  classNames={{
    wrapper: "w-full h-screen",
    img: "object-cover w-full h-full"
  }}
/>
```

### Product Gallery
```jsx
<div className="grid grid-cols-4 gap-4">
  {products.map((product) => (
    <Image
      key={product.id}
      alt={product.name}
      src={product.image}
      isZoomed={true}
      radius="md"
      shadow="sm"
      width={300}
      height={300}
      loading="lazy"
    />
  ))}
</div>
```

### User Avatar
```jsx
<Image
  alt={`${user.name}'s avatar`}
  src={user.avatarUrl}
  fallbackSrc="/default-avatar.jpg"
  radius="full"
  width={100}
  height={100}
  disableSkeleton={true}
/>
```

### Card Thumbnail
```jsx
<Image
  alt="Blog post thumbnail"
  src={post.thumbnailUrl}
  width={400}
  height={250}
  radius="lg"
  shadow="md"
  isZoomed={true}
  loading="lazy"
  classNames={{
    img: "object-cover"
  }}
/>
```

### Optimized Next.js Image
```jsx
import NextImage from "next/image";

<Image
  alt="Optimized hero"
  as={NextImage}
  src="/hero.jpg"
  width={1200}
  height={600}
  priority
  isBlurred={true}
  radius="lg"
/>
```

---

## Conclusion

HeroUI's Image component provides a well-balanced enhancement of the native `<img>` element with focus on user experience features:

**Key Strengths**:
- **Skeleton loading**: Automatic visual feedback during image load
- **Blur effect**: Elegant background blur pattern for hero sections
- **Zoom on hover**: Interactive image exploration
- **Fallback handling**: Graceful error recovery
- **Performance control**: `removeWrapper` escape hatch for minimal DOM
- **Next.js integration**: Seamless composition via `as` prop
- **Slot-based styling**: Granular customization through `classNames`

**Notable Design Choices**:
- Client-side focused (hooks for state management)
- Wrapper-dependent features (blur, zoom, skeleton)
- Native lazy loading (leverages browser capabilities)
- Minimal API surface (focused enhancement, not complete replacement)

**Trade-offs**:
- No SSR for enhanced features (skeleton, blur, zoom are client-only)
- Blur effect duplicates image in DOM (performance consideration)
- Limited prop surface (object-fit, aspect ratio require CSS)
- Single fallback level (no fallback chains)

**Best Suited For**:
- Client-rendered applications
- Image galleries with zoom
- Hero sections with blur effects
- Cards and thumbnails with loading states
- Next.js projects needing both optimization and UX features

The component strikes a good balance between native element simplicity and enhanced UX features, with clear documentation of when to use native/Next.js alternatives for optimal performance.

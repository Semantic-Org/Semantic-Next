# Image Component - Aggregate Pattern Research

**Research Date**: 2025-11-04
**Frameworks Analyzed**: 6
**Total Individual Reports**: 6

---

## Executive Summary

This research analyzed image display patterns across 6 UI frameworks. A key finding is that frameworks take fundamentally different philosophical approaches to image components:

**Single Image Enhancement** (4 frameworks):
- **Ant Design**: Preview modal + gallery + progressive loading
- **Chakra UI**: Lazy loading + fallback system + responsive sizing
- **HeroUI**: Skeleton loading + blur effects + zoom interaction
- **Mantine**: Minimal wrapper + polymorphic rendering

**Image Collections** (1 framework):
- **MUI**: ImageList system with 4 layout variants (standard, quilted, woven, masonry)

**Pure Display** (1 framework):
- **Semantic UI Classic**: 20+ display variations with class-based API

**Note**: No framework provides both comprehensive single-image features AND collection/gallery features in a single component.

---

## Component Philosophy: Single vs Collection

### Single Image Approaches

**Ant Design Philosophy**:
- Images are **previewable media** with built-in zoom/transform controls
- Gallery navigation is first-class feature
- Progressive loading with placeholders
- Focus: User interaction with images (preview, zoom, download)

**Chakra UI Philosophy**:
- Images are **enhanced `<img>` elements** with intelligent defaults
- Automatic lazy loading (performance-first)
- Fallback handling prevents broken image icons
- Focus: Production-ready reliability

**HeroUI Philosophy**:
- Images are **UX-enhanced elements** with visual feedback
- Skeleton loading during load (perceived performance)
- Interactive effects (blur backgrounds, zoom on hover)
- Focus: Client-side user experience

**Mantine Philosophy**:
- Images are **minimally wrapped native elements**
- Just enough enhancement (fallbacks, responsive sizing)
- Composition over configuration
- Focus: Lightweight, unopinionated

### Collection/Gallery Approach

**MUI Philosophy**:
- Images are primarily **collections** not singletons
- Four distinct layout variants for different browsing patterns
- Metadata overlays with ImageListItemBar
- Focus: Organized presentation of multiple images

### Display Variations Approach

**Semantic UI Classic Philosophy**:
- Images are **display elements** with semantic styling
- 8 size tiers, 4 display styles, 7 layout options
- Pure CSS class-based API
- Focus: Comprehensive visual presentation

---

## Pattern Category Analysis

### 1. Loading Patterns

#### Lazy Loading
**Prevalence**: 5/6 frameworks (83%)

| Framework | Lazy Loading | Implementation | Default Behavior |
|-----------|--------------|----------------|------------------|
| **Ant Design** | ✅ | Native `loading="lazy"` | Not default (preview affects behavior) |
| **Chakra UI** | ✅ | Automatic via component | Enabled by default |
| **HeroUI** | ✅ | Native `loading="lazy"` | Not default (manual) |
| **Mantine** | ⚠️ | Native HTML attribute | Manual (passthrough) |
| **MUI** | ✅ | Native `loading="lazy"` on items | Shown in examples |
| **Semantic UI** | ❌ | Not built-in | N/A |

**Support Level**: Level 1 (Universal - 83%)

**Key Insight**: Chakra UI is **only framework** to enable lazy loading by default, showing proactive performance optimization philosophy.

#### Placeholder/Loading States

**Ant Design Approach**:
- `placeholder` prop accepts ReactNode
- Blur-up pattern support (LQIP - Low Quality Image Placeholder)
- Smooth opacity transitions
```jsx
<Image
  placeholder={<BlurImage preview={false} src={lowQualitySrc} />}
  src={highQualitySrc}
/>
```

**HeroUI Approach**:
- **Skeleton animation** (enabled by default)
- Automatic skeleton during load
- `disableSkeleton={true}` to disable
- Opacity fade-in on load
```jsx
<Image src="image.jpg" /> {/* Skeleton shows automatically */}
```

**Other Frameworks**:
- Chakra UI: Fallback shows during load if provided
- Mantine: No built-in placeholder (compose with Skeleton component)
- MUI: No built-in (could compose with Skeleton)
- Semantic UI: No built-in

**Support Level**: Level 3 (Moderate - 33% native, 67% could compose)

**Pattern Recommendation**: Slot-based placeholder is most flexible
```html
<ui-image src="full.jpg">
  <div slot="placeholder">
    <ui-skeleton height="200px"></ui-skeleton>
  </div>
</ui-image>
```

#### Progressive Loading
**Prevalence**: 1/6 frameworks (17%)

**Only Ant Design** provides dedicated progressive loading:
- Display thumbnail immediately
- Load full resolution in background
- Smooth transition on load
- Optimizes perceived performance

**Support Level**: Level 5 (Rare - 17%)

**Use Case**: Product images, galleries, hero sections where initial visual is critical

---

### 2. Error Handling Patterns

#### Fallback Images
**Prevalence**: 4/6 frameworks (67%)

| Framework | Fallback | Implementation | Levels |
|-----------|----------|----------------|--------|
| **Ant Design** | ✅ | `fallback` prop (URL) | Single level |
| **Chakra UI** | ✅ | `fallbackSrc` (URL) or `fallback` (component) | Dual (image or custom) |
| **HeroUI** | ✅ | `fallbackSrc` prop (URL) | Single level |
| **Mantine** | ✅ | `fallbackSrc` prop (URL) | Single level |
| **MUI** | ❌ | Not built-in | Manual onError handling |
| **Semantic UI** | ❌ | Not built-in | Manual |

**Support Level**: Level 2 (Common - 67%)

**Chakra UI Unique Feature**: Dual fallback system
```jsx
{/* Fallback image */}
<Image src="broken.jpg" fallbackSrc="placeholder.jpg" />

{/* Custom fallback component */}
<Image
  src="broken.jpg"
  fallback={<Box bg="gray.200" h="200px"><Text>Image unavailable</Text></Box>}
/>
```

**Pattern Insight**: Most frameworks use simple URL-based fallback. Only Chakra supports custom component fallbacks.

#### Disable Fallback
**Prevalence**: 1/6 frameworks (17%)

**Only Chakra UI** provides `ignoreFallback` prop to opt out of fallback system entirely.

**Use Case**: When you want native browser broken image icon or have external error handling.

**Support Level**: Level 5 (Rare - 17%)

---

### 3. Preview/Zoom Functionality

#### Built-in Preview Modal
**Prevalence**: 1/6 frameworks (17%)

**Only Ant Design** provides comprehensive preview functionality:

**Preview Features**:
- Click-to-preview modal overlay
- Zoom in/out controls
- Rotate left/right
- Flip horizontal/vertical
- Download image button
- Keyboard navigation (ESC, arrows)
- Custom preview source (thumbnail → full resolution)
- Gallery navigation (prev/next)

```jsx
<Image
  src="thumbnail.jpg"
  preview={{
    src: "full-resolution.jpg",
    onVisibleChange: (visible) => setOpen(visible),
    scaleStep: 0.5,
    mask: <div>Click to preview</div>
  }}
/>
```

**Image.PreviewGroup**:
```jsx
<Image.PreviewGroup>
  <Image src="image1.jpg" />
  <Image src="image2.jpg" />
  <Image src="image3.jpg" />
</Image.PreviewGroup>
{/* Clicking any image opens gallery with navigation */}
```

**Support Level**: Level 5 (Unique to Ant Design)

#### Zoom on Hover
**Prevalence**: 1/6 frameworks (17%)

**Only HeroUI** provides native zoom-on-hover:
```jsx
<Image isZoomed={true} src="product.jpg" />
{/* Scales image on hover using CSS transform */}
```

**Support Level**: Level 5 (Rare - 17%)

**Pattern**: Other frameworks could achieve via CSS `:hover` transforms, but HeroUI makes it first-class prop.

---

### 4. Visual Effects

#### Blur Effect
**Prevalence**: 1/6 frameworks (17%)

**Only HeroUI** provides native blur effect:
```jsx
<Image isBlurred={true} src="image.jpg" />
{/* Duplicates image with blurred background layer */}
```

**Implementation**: Creates two `<img>` elements in DOM (one blurred, one sharp)

**Support Level**: Level 5 (Rare - 17%)

**Performance Note**: DOM duplication impacts image-heavy pages

#### Shadow System
**Prevalence**: 1/6 frameworks (17%)

**Only HeroUI** provides dedicated shadow prop:
```jsx
<Image shadow="sm" src="card-image.jpg" />
{/* Options: none, sm, md, lg */}
```

**Other Frameworks**: Could apply via CSS/style props but not dedicated prop

**Support Level**: Level 5 (Rare - 17%)

#### Border Radius/Rounded
**Prevalence**: 5/6 frameworks (83%)

| Framework | Border Radius | Implementation |
|-----------|---------------|----------------|
| **Ant Design** | ⚠️ | Via style prop (no dedicated prop) |
| **Chakra UI** | ✅ | `borderRadius` or `rounded` prop |
| **HeroUI** | ✅ | `radius` prop (none/sm/md/lg/full) |
| **Mantine** | ✅ | `radius` prop (theme values) |
| **MUI** | ⚠️ | Via sx prop (not dedicated) |
| **Semantic UI** | ✅ | `rounded` or `circular` class |

**Support Level**: Level 1 (Universal - 83% with dedicated API)

**Common Options**: none, small, medium, large, full (circular)

---

### 5. Sizing & Layout Patterns

#### Size System

**Semantic UI Classic** (most comprehensive):
- **8 size tiers**: mini (35px), tiny (80px), small (150px), medium (300px), large (450px), big (600px), huge (800px), massive (960px)
- Applied via class: `class="ui small image"`
- Group sizing: `class="ui tiny images"` applies to all children

**Other Frameworks**:
- Use flexible width/height props (no predefined tiers)
- Responsive sizing via breakpoint objects/arrays

**Support Level**: Level 5 (Unique to Semantic UI)

**Pattern Insight**: Modern frameworks prefer flexible sizing over predefined tiers

#### Responsive Sizing
**Prevalence**: 4/6 frameworks (67%)

**Chakra UI** (responsive array/object):
```jsx
<Image width={{ base: "100%", md: "50%", lg: "33%" }} />
<Image width={["100%", "50%", "33%"]} />
```

**Mantine** (responsive object):
```jsx
<Image h={{ base: 150, md: 250, xl: 350 }} />
```

**HeroUI**: Via native srcSet/sizes (not responsive props)

**MUI**: Manual useMediaQuery required (no built-in responsive props)

**Support Level**: Level 2 (Common - 67%)

**Key Weakness**: MUI requires manual media query handling
```jsx
const matches = useMediaQuery('(min-width:600px)');
<ImageList cols={matches ? 3 : 1}>
```

#### Aspect Ratio
**Prevalence**: 2/6 frameworks (33%)

**Chakra UI**:
```jsx
<Image aspectRatio={16/9} src="video-thumbnail.jpg" />
```

**MUI**: Via ImageListItem `cols`/`rows` props (indirect)
```jsx
<ImageListItem cols={2} rows={2}> {/* Takes 2x2 grid space */}
```

**Others**: Manual via height/width or CSS

**Support Level**: Level 4 (Occasional - 33%)

#### Object-Fit
**Prevalence**: 3/6 frameworks (50%)

| Framework | Object-Fit | Options |
|-----------|-----------|---------|
| **Chakra UI** | ✅ `fit` or `objectFit` prop | cover, contain, fill, none, scale-down |
| **HeroUI** | ⚠️ CSS only | Via `classNames.img` |
| **Mantine** | ✅ `fit` prop | cover, contain, fill, scale-down, none |

**Support Level**: Level 3 (Moderate - 50% native support)

**Common Pattern**: `objectFit="cover"` with fixed dimensions for consistent card images

---

### 6. Framework Integration Patterns

#### Next.js Image Integration
**Prevalence**: 3/6 frameworks (50%)

**Chakra UI** (three approaches):
```jsx
// 1. @chakra-ui/next-js package with asChild
import { Image } from "@chakra-ui/next-js";
<Image asChild>
  <NextImage src="..." />
</Image>

// 2. Chakra factory
const ChakraNextImage = chakra(NextImage, {
  shouldForwardProp: (prop) => ['width', 'height', 'src', 'alt'].includes(prop)
});

// 3. Box wrapper
<Box boxSize="sm">
  <NextImage src="..." />
</Box>
```

**Mantine** (polymorphic component prop):
```jsx
<Image
  component={NextImage}
  src="..."
  // Next.js Image props work directly
/>
```

**HeroUI** (asChild pattern):
```jsx
<Image as={NextImage} src="..." />
```

**Support Level**: Level 3 (Moderate - 50%)

**Pattern Insight**: Polymorphic rendering (`component`/`as` props) is elegant solution

---

### 7. Gallery/Collection Patterns

#### Image Preview Groups
**Prevalence**: 1/6 frameworks (17%)

**Only Ant Design**:
```jsx
<Image.PreviewGroup>
  <Image width={200} src="img1.jpg" />
  <Image width={200} src="img2.jpg" />
  <Image width={200} src="img3.jpg" />
</Image.PreviewGroup>
```

**Features**:
- Shared preview modal
- Gallery navigation (prev/next buttons)
- Image counter (e.g., "2 / 5")
- Custom counter render function

**Support Level**: Level 5 (Unique)

#### ImageList Variants
**Prevalence**: 1/6 frameworks (17%)

**Only MUI** provides dedicated collection component:

**Four Layout Variants**:

1. **Standard**: Uniform grid
```jsx
<ImageList cols={3} rowHeight={164}>
  {items.map(item => <ImageListItem><img src={item} /></ImageListItem>)}
</ImageList>
```

2. **Quilted**: Variable tile sizes
```jsx
<ImageList variant="quilted" cols={4}>
  <ImageListItem cols={2} rows={2}> {/* Featured: 2x2 */}
  <ImageListItem cols={1} rows={1}> {/* Standard: 1x1 */}
</ImageList>
```

3. **Woven**: Alternating aspect ratios
```jsx
<ImageList variant="woven" cols={3} gap={8}>
```

4. **Masonry**: Dynamic heights (Pinterest-style)
```jsx
<ImageList variant="masonry" cols={3}>
```

**ImageListItemBar**: Metadata overlay
```jsx
<ImageListItemBar
  title="Image title"
  subtitle="Author name"
  position="below" {/* or "top", "bottom" */}
  actionIcon={<IconButton><Star /></IconButton>}
/>
```

**Support Level**: Level 5 (Unique to MUI)

**Use Cases**:
- Standard: Product catalogs, photo albums
- Quilted: Editorial content with hierarchy
- Woven: Rhythmic browsing experiences
- Masonry: Pinterest-style feeds

#### Semantic UI Image Groups
**Prevalence**: 1/6 frameworks (17%)

```html
<div class="ui small images">
  <img src="image1.jpg">
  <img src="image2.jpg">
  <img src="image3.jpg">
</div>
<!-- All images sized "small" uniformly -->
```

**Support Level**: Level 5 (Unique)

**Pattern**: Simple container applies uniform sizing to children

---

### 8. Accessibility Patterns

#### Alt Text
**Prevalence**: 6/6 frameworks (100%)

All frameworks support standard HTML `alt` attribute.

**Support Level**: Level 1 (Universal)

**Best Practice**: All frameworks recommend required alt text
- Chakra UI: Documents alt as required prop
- Others: Standard HTML passthrough

#### ARIA Support
**Prevalence**: 6/6 frameworks (100%)

All frameworks pass through ARIA attributes to underlying `<img>` element.

**Support Level**: Level 1 (Universal)

#### Loading Announcements
**Prevalence**: 0/6 frameworks (0%)

**Gap Identified**: No framework provides ARIA live region announcements for loading state changes.

**Opportunity**:
```html
<ui-image src="...">
  <div slot="loading" role="status" aria-live="polite" aria-label="Image loading">
    <ui-skeleton></ui-skeleton>
  </div>
</ui-image>
```

---

### 9. Performance Patterns

#### Lazy Loading Summary

| Framework | Default Lazy | Manual Control | SSR Handling |
|-----------|--------------|----------------|--------------|
| **Ant Design** | ❌ | ✅ `loading="lazy"` | Manual |
| **Chakra UI** | ✅ Auto | ✅ `loading` attribute + `Img` component for SSR | ✅ Dedicated `Img` |
| **HeroUI** | ❌ | ✅ `loading="lazy"` | ❌ Client-only |
| **Mantine** | ❌ | ✅ HTML passthrough | Polymorphic |
| **MUI** | ❌ | ✅ Shown in examples | Standard React |
| **Semantic UI** | ❌ | ❌ Not built-in | N/A |

**Key Insight**: Only Chakra UI enables lazy loading by default AND provides SSR-optimized component.

#### Width/Height for Layout Stability
**Prevalence**: 4/6 frameworks (67%)

**Mantine Documentation** explicitly recommends:
> "Set image height to avoid layout shift"

**Chakra UI**: `htmlWidth` and `htmlHeight` props set native dimensions

**Best Practice**: Prevent Cumulative Layout Shift (CLS) by specifying dimensions

**Support Level**: Level 2 (Common)

---

### 10. Advanced Features

#### Custom Preview Source
**Prevalence**: 1/6 frameworks (17%)

**Only Ant Design**:
```jsx
<Image
  src="thumbnail-300x300.jpg"  // Display thumbnail
  preview={{ src: "full-4000x4000.jpg" }}  // Preview full resolution
/>
```

**Use Case**: Bandwidth optimization - display small thumbnail, preview large image

**Support Level**: Level 5 (Unique)

#### Transform Controls
**Prevalence**: 1/6 frameworks (17%)

**Only Ant Design** provides preview modal with:
- Zoom (mouse wheel or +/- buttons)
- Rotate (left/right buttons)
- Flip horizontal/vertical
- Download button
- Fullscreen toggle

**Support Level**: Level 5 (Unique)

#### Controlled Preview State
**Prevalence**: 1/6 frameworks (17%)

**Only Ant Design**:
```jsx
const [visible, setVisible] = useState(false);
<Image
  preview={{
    visible,
    onVisibleChange: setVisible
  }}
/>
```

**Use Case**: Programmatic preview opening, tracking analytics

**Support Level**: Level 5 (Unique)

---

## Cross-Framework Pattern Summary

### Universal Patterns (Level 1: 90-100% adoption)

1. **Alt text support** - 6/6 (100%)
2. **Standard img attributes** - 6/6 (100%)
3. **ARIA passthrough** - 6/6 (100%)
4. **Border radius** - 5/6 (83%)
5. **Lazy loading** (manual) - 5/6 (83%)

### Common Patterns (Level 2: 70-89% adoption)

1. **Fallback images** - 4/6 (67%)
2. **Responsive sizing** - 4/6 (67%)
3. **Layout stability (width/height)** - 4/6 (67%)

### Moderate Patterns (Level 3: 40-69% adoption)

1. **Object-fit control** - 3/6 (50%)
2. **Next.js integration** - 3/6 (50%)
3. **Placeholder/loading states** - 2/6 (33% native)
4. **Aspect ratio** - 2/6 (33%)

### Occasional Patterns (Level 4: 20-39% adoption)

No patterns in this tier (gap between 33% and 17%)

### Rare Patterns (Level 5: <20% adoption)

1. **Preview modal** - 1/6 (17%) - Ant Design only
2. **Gallery groups** - 1/6 (17%) - Ant Design only
3. **Image collections** - 1/6 (17%) - MUI only
4. **Blur effect** - 1/6 (17%) - HeroUI only
5. **Zoom on hover** - 1/6 (17%) - HeroUI only
6. **Skeleton loading** - 1/6 (17%) - HeroUI only
7. **Progressive loading** - 1/6 (17%) - Ant Design only
8. **Transform controls** - 1/6 (17%) - Ant Design only
9. **Shadow prop** - 1/6 (17%) - HeroUI only
10. **Size tiers** - 1/6 (17%) - Semantic UI only
11. **Display styles** - 1/6 (17%) - Semantic UI only
12. **Polymorphic rendering** - 2/6 (33%) - Mantine, partial Chakra

---

## Key Insights

### 1. No Single "Image Component" Standard

Frameworks address different use cases:
- **Ant Design**: Interactive preview/gallery
- **Chakra UI**: Production reliability
- **HeroUI**: Visual polish
- **Mantine**: Minimal enhancement
- **MUI**: Collections/layouts
- **Semantic UI**: Display variations

**Implication**: Semantic UI should decide primary use case or provide multiple components (`ui-image`, `ui-image-gallery`, `ui-image-list`)

### 2. Preview/Zoom is Rare but Valuable

Only **Ant Design** provides built-in preview modal, yet it's one of the most user-friendly features for:
- Product catalogs
- Photo galleries
- Documentation images
- Portfolios

**Opportunity**: Semantic UI could differentiate by providing preview as first-class feature

### 3. Lazy Loading Should Be Default

**Chakra UI** is only framework with default lazy loading, showing performance-first philosophy.

**Recommendation**: Enable lazy loading by default with opt-out

### 4. Fallback Handling is Expected

**67% of frameworks** provide fallback images - it's a common expectation.

**Chakra's dual system** (fallback image OR component) is elegant:
```jsx
<Image fallback={<Skeleton />} /> // Component
<Image fallbackSrc="placeholder.jpg" /> // Image URL
```

### 5. MUI's Collection Focus is Unique

MUI doesn't optimize single images - it focuses on **organized presentation** of collections.

**Four variants** (standard, quilted, woven, masonry) show thoughtful layout design.

**Implication**: Semantic UI should consider if image collections warrant separate component

### 6. Responsive Props Gap

**MUI requires manual media queries** - major pain point:
```jsx
const matches = useMediaQuery('(min-width:600px)');
<ImageList cols={matches ? 3 : 1}>
```

vs. Chakra's elegant responsive props:
```jsx
<Image width={["100%", "50%", "33%"]} />
```

**Opportunity**: Built-in responsive props are significant UX improvement

### 7. HeroUI's Visual Polish Features Are Unique

**Blur effect**, **zoom on hover**, **skeleton loading** - only HeroUI provides these visual polish features natively.

**Trade-off**: DOM duplication for blur effect (performance cost)

**Pattern**: CSS-only alternatives exist, but dedicated props improve DX

### 8. Semantic UI Classic's Comprehensiveness is Unmatched

**20+ variations** (8 sizes, 4 display styles, 7 layouts) - no other framework approaches this.

**Modern frameworks**: Prefer flexible props over predefined classes

**Lesson**: Semantic UI's strength is breadth - preserve this while modernizing

### 9. SSR is Underserved

Only **Chakra UI** provides dedicated SSR component (`Img`).

**Gap**: Most frameworks don't address SSR-specific needs

**Opportunity**: Shadow DOM + progressive enhancement could handle SSR elegantly

### 10. Polymorphic Rendering is Powerful

**Mantine** and **Chakra** allow rendering as different components:
```jsx
<Image component={NextImage} />
```

**Benefit**: Combine framework styling with optimization libraries (Next.js Image, Cloudinary, etc.)

**Pattern**: Maps well to web components via slots or `as` attribute

---

## Recommendations for Semantic UI Implementation

### Component Structure Decision

**Option A: Single Comprehensive Component**
```html
<ui-image
  src="..."
  previewable
  lazy
  fallback-src="..."
  rounded
  size="medium"
></ui-image>
```
**Advantages**: Simple API, single import
**Disadvantages**: Large API surface, mixed concerns

**Option B: Multiple Specialized Components**
```html
<!-- Basic display -->
<ui-image src="..." lazy fallback-src="..."></ui-image>

<!-- With preview -->
<ui-image-preview src="..." thumbnail-src="..."></ui-image-preview>

<!-- Gallery -->
<ui-image-gallery>
  <ui-image src="1.jpg"></ui-image>
  <ui-image src="2.jpg"></ui-image>
</ui-image-gallery>

<!-- Collections (MUI-style) -->
<ui-image-list variant="masonry" columns="3">
  <ui-image-list-item src="1.jpg" title="..."></ui-image-list-item>
</ui-image-list>
```
**Advantages**: Clear separation of concerns, focused APIs
**Disadvantages**: More components to learn

**Option C: Hybrid - Base + Extensions** (recommended)
```html
<!-- Base image (Level 1 features) -->
<ui-image
  src="..."
  lazy
  fallback-src="..."
  aspect-ratio="16/9"
  fit="cover"
></ui-image>

<!-- Preview wrapper (adds modal) -->
<ui-image-preview>
  <ui-image src="thumb.jpg" preview-src="full.jpg"></ui-image>
</ui-image-preview>

<!-- Gallery wrapper (adds navigation) -->
<ui-image-group>
  <ui-image src="1.jpg"></ui-image>
  <ui-image src="2.jpg"></ui-image>
</ui-image-group>
```

**Recommendation**: **Option C** - provides flexibility while maintaining focused APIs

### Must-Have Features (Level 1)

#### `ui-image` (Base Component)

1. **Basic Display**:
   - `src`, `alt` attributes
   - Standard HTML img passthrough
   - Aspect ratio control

2. **Loading**:
   - Lazy loading (enabled by default with opt-out)
   - Loading callback (`onload` event)
   - Error callback (`onerror` event)

3. **Error Handling**:
   - `fallback-src` attribute for fallback image
   - Fallback slot for custom content
   - Error state styling

4. **Sizing**:
   - Flexible width/height
   - Responsive sizing (breakpoint-based)
   - Object-fit control (cover, contain, fill, etc.)

5. **Visual**:
   - Border radius (none, sm, md, lg, full)
   - Theme integration

6. **Accessibility**:
   - Required alt text
   - ARIA passthrough
   - Semantic HTML

### Should-Have Features (Level 2)

1. **Loading States**:
   - Placeholder slot for loading state
   - Skeleton integration
   - Opacity transition on load

2. **Advanced Sizing**:
   - Aspect ratio constraint
   - Max width/height
   - Maintain aspect on resize

3. **Semantic UI Classic Patterns**:
   - Display styles: avatar, bordered, rounded, circular
   - Size tiers: small, medium, large (simplified from 8 to 3-5)
   - Layout options: centered, floated, aligned

4. **Performance**:
   - Width/height for layout stability
   - Prevent CLS (Cumulative Layout Shift)

### Consider Features (Level 3-5)

1. **Preview Modal** (`ui-image-preview` or setting):
   - Click-to-preview modal
   - Zoom in/out controls
   - Keyboard navigation
   - Custom preview source (Ant Design pattern)

2. **Gallery Navigation** (`ui-image-group`):
   - Previous/next navigation
   - Image counter
   - Shared modal across group
   - Gallery thumbnails

3. **Visual Effects**:
   - Blur effect (HeroUI pattern)
   - Zoom on hover
   - Shadow system
   - Filters

4. **Image Collections** (`ui-image-list`):
   - Grid layouts
   - Masonry variant
   - Responsive columns
   - Metadata overlays

5. **Framework Integration**:
   - Polymorphic rendering (`as` attribute)
   - Next.js compatibility
   - Cloudinary integration

6. **Advanced Features**:
   - Progressive loading (LQIP)
   - Transform controls (rotate, flip)
   - Download functionality
   - Controlled preview state

### API Design Recommendations

#### Natural Language Settings

```html
<!-- Basic -->
<ui-image src="photo.jpg" alt="Description" lazy></ui-image>

<!-- With fallback -->
<ui-image
  src="photo.jpg"
  fallback-src="placeholder.jpg"
  alt="Product"
></ui-image>

<!-- With placeholder slot -->
<ui-image src="photo.jpg">
  {#slot placeholder}
    <ui-skeleton height="300px"></ui-skeleton>
  {/slot}
  {#slot fallback}
    <div class="error-state">Failed to load</div>
  {/slot}
</ui-image>

<!-- Sizing and fit -->
<ui-image
  src="hero.jpg"
  aspect-ratio="16/9"
  fit="cover"
  rounded="lg"
></ui-image>

<!-- Responsive -->
<ui-image
  src="responsive.jpg"
  width="100% md:50% lg:33%"
></ui-image>

<!-- Semantic UI Classic styles -->
<ui-image src="avatar.jpg" avatar circular></ui-image>
<ui-image src="card.jpg" size="small" bordered></ui-image>
```

#### Settings Architecture

```javascript
defineComponent({
  name: 'ui-image',
  defaultSettings: {
    lazy: true,              // Lazy load by default
    fit: 'fill',             // Object-fit: cover | contain | fill | none | scale-down
    radius: null,            // Border radius: sm | md | lg | full
    aspectRatio: null,       // e.g., "16/9", "4/3"
    fallbackSrc: null,       // Fallback image URL
    loading: 'lazy',         // HTML loading attribute
    decoding: 'async',       // HTML decoding attribute
    // Semantic UI Classic patterns
    avatar: false,           // Avatar style (inline circular)
    bordered: false,         // Add border
    rounded: false,          // Border radius
    circular: false,         // Full circle
    centered: false,         // Center alignment
    fluid: false,            // Full width
    size: null,              // small | medium | large
  }
})
```

#### Preview Wrapper Component

```html
<ui-image-preview>
  <ui-image
    src="thumbnail.jpg"
    preview-src="full-resolution.jpg"
    alt="Product"
  ></ui-image>
</ui-image-preview>

<!-- With gallery -->
<ui-image-group>
  <ui-image src="1.jpg" alt="Image 1"></ui-image>
  <ui-image src="2.jpg" alt="Image 2"></ui-image>
  <ui-image src="3.jpg" alt="Image 3"></ui-image>
</ui-image-group>
<!-- Clicking any image opens modal with navigation -->
```

#### Image List Component

```html
<ui-image-list variant="masonry" columns="1 sm:2 md:3 lg:4" gap="4">
  <ui-image-list-item src="1.jpg" alt="Photo 1">
    {#slot caption}
      <h3>Title</h3>
      <p>Description</p>
    {/slot}
  </ui-image-list-item>
</ui-image-list>
```

### Shadow DOM Considerations

**Advantages**:
- Style encapsulation (prevents CSS conflicts)
- Progressive enhancement (SSR-friendly)
- Standard web component portability

**Challenges**:
- Slot projection for placeholder/fallback
- Preview modal requires Portal/teleport
- Theme integration across shadow boundary

**Recommended Pattern**:
```html
<!-- Shadow DOM structure -->
<ui-image>
  #shadow-root
    <div class="image-container">
      <slot name="placeholder"></slot>
      <img class="image" />
      <slot name="fallback"></slot>
    </div>
</ui-image>
```

**Preview Modal** (portal to document body):
```javascript
// Preview modal rendered outside shadow DOM
const modal = document.createElement('ui-image-preview-modal');
document.body.appendChild(modal);
```

---

## Conclusion

Image component research reveals significant diversity in framework approaches:

**No universal standard** - frameworks optimize for different use cases (preview, performance, visual polish, collections)

**Strong consensus** on:
1. Fallback handling (67%)
2. Lazy loading support (83%)
3. Responsive sizing (67%)
4. Border radius (83%)

**Unique innovations**:
- **Ant Design**: Preview modal with transform controls + gallery navigation
- **Chakra UI**: Default lazy loading + SSR optimization + dual fallback system
- **HeroUI**: Visual polish (skeleton, blur, zoom)
- **Mantine**: Minimalist + polymorphic rendering
- **MUI**: Collection layouts (4 variants)
- **Semantic UI Classic**: Comprehensive display variations (20+ patterns)

**Strategic Recommendation**:

Implement **hybrid approach** with three components:

1. **`ui-image`** (Core): Lazy loading, fallbacks, responsive sizing, object-fit, Semantic UI Classic display styles
2. **`ui-image-preview`** (Enhancement): Preview modal, zoom, gallery navigation (Ant Design pattern)
3. **`ui-image-list`** (Collections): Grid layouts, masonry, responsive columns (MUI pattern)

This balances **modern expectations** (lazy loading, fallbacks) with **Semantic UI heritage** (comprehensive variations) while adding **differentiating features** (preview modal, collections).

**Key Differentiators**:
- Default lazy loading (following Chakra)
- Built-in preview modal (Ant Design pattern)
- Semantic UI Classic display styles (avatar, circular, bordered)
- Responsive props without media queries (better than MUI)
- Slot-based placeholder/fallback (flexible)
- Optional image collection layouts (MUI pattern)

This positions Semantic UI as having both **comprehensive display options** (heritage) and **modern UX features** (preview, lazy loading) that rival or exceed other frameworks.

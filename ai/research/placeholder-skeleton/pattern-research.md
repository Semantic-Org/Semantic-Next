# Placeholder/Skeleton Component - Aggregate Pattern Research

**Research Date**: 2025-11-04
**Frameworks Analyzed**: 9
**Total Individual Reports**: 9

---

## Executive Summary

This research analyzed placeholder/skeleton loading patterns across 9 major UI frameworks (Ant Design, Chakra UI, HeroUI, Mantine, Material-UI, Nuxt UI, PrimeReact, ShadCN, Semantic UI Classic). Skeleton components serve as visual placeholder primitives that display during content loading to improve perceived performance and prevent layout shift.

### Key Findings

**Terminology Variance**:
- **"Skeleton"**: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, ShadCN (8/9 = 89%)
- **"Placeholder"**: Semantic UI Classic only (1/9 = 11%)

**Universal Purpose**: All frameworks implement skeletons/placeholders to:
- Display visual placeholders during asynchronous content loading
- Reduce perceived loading time by showing content structure
- Prevent layout shift when content arrives
- Improve user experience with animated feedback

**Philosophical Differences**:
- **Ant Design**: Comprehensive sub-component system (6 types) with loading wrapper pattern
- **Chakra UI**: Three specialized components (Skeleton, SkeletonCircle, SkeletonText) with isLoaded/loading pattern evolution (v2→v3)
- **HeroUI**: Minimal Tailwind-first approach with isLoaded boolean control
- **Mantine**: Dual-mode operation (standalone vs wrapper) with circle convenience prop
- **Material-UI**: Four shape variants (text, circular, rectangular, rounded) with Material Design specs
- **Nuxt UI**: Radically simple primitive (as prop + Tailwind classes)
- **PrimeReact**: Minimal API (6 props) with pure composition approach
- **ShadCN**: Copy-paste distribution, no props, pure Tailwind className composition
- **Semantic UI Classic**: Class-based CSS architecture with six line-length modifiers

**Version Evolution Highlights**:
- **Chakra UI v2 → v3**: Breaking change from `isLoaded` to `loading` (inverted logic)
- **Chakra UI v3**: New animation variants (pulse, shine) with CSS variable theming
- **HeroUI v3**: Enhanced animation control hierarchy (component → provider → CSS variable)

---

## Component Definition

### Mental Models Across Frameworks

**Ant Design**: Progressive disclosure pattern showing content structure before data arrives. Uses minimal luminance for visibility, acts as visual preview reducing perceived wait time and layout shift.

**Chakra UI**: Low-fidelity representation of content shape and structure. Provides visual feedback that "something is loading" without revealing exact content, improving perceived performance.

**HeroUI**: Content placeholder that mimics structure of actual content, creating smooth perceived performance improvement. Content is present in DOM but visibility controlled by isLoaded prop.

**Mantine**: Visual skeleton/wireframe of content that will eventually appear. Users understand content is loading and see approximate layout. Dual-mode: standalone placeholder OR content wrapper with loading overlay.

**Material-UI**: Display placeholder preview before data loads to reduce load-time frustration. Uses minimal luminance for visibility in all conditions. Material Design 3 specifications for loading states.

**Nuxt UI**: Visual placeholder component for loading feedback. Maintains layout structure before content loads, creates smooth perceived performance. Single primitive with maximum flexibility through composition.

**PrimeReact**: Reserve space for content appearing asynchronously. Improves perceived performance by showing content structure, prevents layout shift.

**ShadCN**: Visual placeholder feedback while content loads. Acts as "temporary content shapes" previewing layout before actual content arrives. Maintains layout stability and communicates loading state.

**Semantic UI Classic**: Reserve space for content appearing asynchronously in layout. Provides visual feedback during loading states to improve perceived performance and user experience.

### Primary Use Cases

**Universal across all frameworks**:
- Loading states for cards, lists, and grids
- Avatar placeholders during image loading
- Text content loading (articles, comments, descriptions)
- Complex layouts (social media feeds, video cards)
- Dashboard widgets loading data
- Profile information loading
- Form field placeholders
- Media galleries loading images

**Framework-Specific**:
- **Ant Design**: Skeleton.Node for custom content, comprehensive table row patterns
- **Chakra UI**: Suspense fallback integration, provider-level animation control
- **Mantine**: Wrapper mode with `visible` prop for progressive disclosure
- **Material-UI**: YouTube video cards, Facebook post patterns per Material Design
- **ShadCN**: Arbitrary Tailwind values for precise custom sizing

---

## Pattern Category Analysis

### 1. Component Architecture

#### Compound Component Pattern
**Prevalence**: 1/9 frameworks (11%)
**Support Level**: Level 5 (Rare)

**Only Ant Design** implements compound component architecture:

```jsx
<Skeleton />  // Main composite component
<Skeleton.Avatar />
<Skeleton.Button />
<Skeleton.Input />
<Skeleton.Image />
<Skeleton.Node />
```

**Benefits**:
- Clear namespace prevents naming conflicts
- Dedicated sub-components for specific UI elements
- Consistent API across all skeleton types
- Can be used independently or composed

**Other Frameworks**:
- **Chakra UI**: Separate named components (Skeleton, SkeletonCircle, SkeletonText) - not compound pattern
- **All others**: Single component with composition

#### Specialized Component Set
**Prevalence**: 2/9 frameworks (22%)
**Support Level**: Level 4 (Occasional)

**Chakra UI** and **Ant Design** provide multiple specialized components:

**Chakra UI (3 components)**:
- `Skeleton` - rectangular placeholders
- `SkeletonCircle` - circular avatars
- `SkeletonText` - multi-line text with automatic width variation

**Ant Design (6 sub-components)**:
- `Skeleton` - composite (avatar + title + paragraph)
- `Skeleton.Avatar` - avatars/icons
- `Skeleton.Button` - button placeholders
- `Skeleton.Input` - form fields
- `Skeleton.Image` - images
- `Skeleton.Node` - custom content

#### Single Component with Variants
**Prevalence**: 2/9 frameworks (22%)
**Support Level**: Level 4 (Occasional)

**Material-UI** and **Mantine** use variant props:

**Material-UI (4 variants)**:
```jsx
<Skeleton variant="text" />      // Default
<Skeleton variant="circular" />  // Avatars
<Skeleton variant="rectangular" /> // Images
<Skeleton variant="rounded" />   // Modern cards
```

**Mantine (2 shapes)**:
```jsx
<Skeleton />                 // Rectangle (default)
<Skeleton circle />          // Circle (with size prop)
```

#### Pure Composition / Single Primitive
**Prevalence**: 5/9 frameworks (56%)
**Support Level**: Level 2 (Common)

**HeroUI, Nuxt UI, PrimeReact, ShadCN, Semantic UI Classic** provide single building blocks:

```jsx
// HeroUI - Tailwind classes for shapes
<Skeleton className="h-12 w-12 rounded-full" />

// Nuxt UI - Polymorphic with Tailwind
<USkeleton as="div" class="h-12 w-12 rounded-full" />

// PrimeReact - Shape prop + dimensions
<Skeleton shape="circle" size="50px" />

// ShadCN - Pure Tailwind composition
<Skeleton className="h-12 w-12 rounded-full" />

// Semantic UI - Class-based structure
<div class="ui placeholder">
  <div class="image"></div>
</div>
```

**Pattern Insight**: Majority (56%) favor composition over configuration, providing primitives that developers combine for complex layouts.

---

### 2. Loading State Patterns

#### isLoaded/loading Boolean Control
**Prevalence**: 4/9 frameworks (44%)
**Support Level**: Level 2 (Common)

**Chakra UI (v2)**, **HeroUI**, **Mantine (wrapper mode)**, **Ant Design**:

**Chakra v2 Pattern**:
```jsx
<Skeleton isLoaded={isLoaded}>
  <Text>Actual content</Text>
</Skeleton>
```
- `isLoaded={false}` → show skeleton
- `isLoaded={true}` → show content

**Chakra v3 Breaking Change**:
```jsx
<Skeleton loading={loading}>
  <Text>Actual content</Text>
</Skeleton>
```
- `loading={true}` → show skeleton
- `loading={false}` → show content
- **Logic inverted** from v2

**HeroUI Pattern**:
```jsx
<Skeleton isLoaded={isLoaded}>
  <div>Content</div>
</Skeleton>
```

**Mantine Wrapper Mode**:
```jsx
<Skeleton visible={loading}>
  <p>Content appears when visible=false</p>
</Skeleton>
```

**Ant Design Pattern**:
```jsx
<Skeleton loading={loading}>
  <div>Content</div>
</Skeleton>
```

**Pattern Benefits**:
- Single component handles both states
- No conditional rendering needed in consumer code
- Smooth fade-in transition built-in
- Content pre-mounted (SEO-friendly)
- Maintains layout during transition

#### Conditional Rendering Pattern
**Prevalence**: 5/9 frameworks (56%)
**Support Level**: Level 2 (Common)

**Material-UI, Nuxt UI, PrimeReact, ShadCN, Semantic UI Classic**:

```jsx
// Manual conditional rendering
{loading ? (
  <Skeleton variant="rectangular" height={200} />
) : (
  <ActualContent />
)}
```

**Pattern Characteristics**:
- Developer manages show/hide logic
- More verbose but explicit
- Allows custom transition logic
- Component doesn't track loading state

---

### 3. Shape Primitives

#### Circle/Avatar Shape
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support circular skeletons for avatars:

| Framework | Implementation | Size Control |
|-----------|----------------|--------------|
| **Ant Design** | `<Skeleton.Avatar shape="circle" />` | `size` prop (number or 'small'/'default'/'large') |
| **Chakra UI** | `<SkeletonCircle />` | `size` prop (spacing token) |
| **HeroUI** | `className="rounded-full"` | Tailwind width/height classes |
| **Mantine** | `<Skeleton circle />` | `height` prop (width matches height automatically) |
| **Material-UI** | `<Skeleton variant="circular" />` | `width` and `height` props |
| **Nuxt UI** | `class="rounded-full"` | Tailwind dimension classes |
| **PrimeReact** | `<Skeleton shape="circle" />` | `size` prop (CSS units) |
| **ShadCN** | `className="rounded-full"` | Tailwind h-* and w-* classes |
| **Semantic UI** | N/A (no dedicated circle) | Must use custom CSS |

**Mantine's Circle Convenience**: Unique `circle` prop that automatically:
- Sets width equal to height
- Applies 50% border-radius
- Simplifies API (only specify size once)

**Example Comparison**:
```jsx
// Mantine - simplest
<Skeleton height={50} circle />

// Material-UI - explicit
<Skeleton variant="circular" width={50} height={50} />

// ShadCN - Tailwind classes
<Skeleton className="h-12 w-12 rounded-full" />
```

#### Rectangle Shape
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support rectangular skeletons (default shape for most):

```jsx
// Explicit variant (Material-UI)
<Skeleton variant="rectangular" width={210} height={118} />

// Default shape (most frameworks)
<Skeleton width={210} height={118} />

// Tailwind classes (HeroUI, Nuxt UI, ShadCN)
<Skeleton className="h-32 w-64" />

// Class-based (Semantic UI)
<div class="ui placeholder">
  <div class="image"></div>
</div>
```

#### Text Line Shape
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support text line skeletons:

**Dedicated Text Components**:
- **Chakra UI**: `<SkeletonText noOfLines={4} />` - automatic line width variation
- **Material-UI**: `<Skeleton variant="text" />` - height controlled by fontSize

**Line Length Modifiers** (Semantic UI Classic only):
```html
<div class="full line"></div>
<div class="very long line"></div>
<div class="long line"></div>
<div class="medium line"></div>
<div class="short line"></div>
<div class="very short line"></div>
```

**Composition Approach** (others):
```jsx
// Multiple skeletons with varying widths
<Skeleton width="100%" height={8} />
<Skeleton width="80%" height={8} />
<Skeleton width="60%" height={8} />
```

**Semantic UI Unique Feature**: Six-tier line length system provides finest-grained control (11% of frameworks).

#### Rounded Rectangle
**Prevalence**: 7/9 frameworks (78%)
**Support Level**: Level 2 (Common)

Most frameworks support rounded corners:

| Framework | Implementation |
|-----------|----------------|
| **Ant Design** | `round` prop (boolean) adds border-radius to paragraph/title |
| **Chakra UI** | `borderRadius` via sx/style props |
| **HeroUI** | Tailwind `rounded-*` classes |
| **Mantine** | `radius` prop (theme keys or CSS values) |
| **Material-UI** | `variant="rounded"` dedicated variant |
| **Nuxt UI** | Tailwind `rounded-md` (default), customizable |
| **PrimeReact** | `borderRadius` prop (CSS units) |
| **ShadCN** | Tailwind `rounded-*` classes |
| **Semantic UI** | Not documented (would need custom CSS) |

**Material-UI Distinction**: Only framework with dedicated `rounded` variant separate from `rectangular`.

---

### 4. Animation Types

#### Pulse Animation
**Prevalence**: 8/9 frameworks (89%)
**Support Level**: Level 1 (Universal)

Fading in-and-out opacity animation:

| Framework | Implementation | Default |
|-----------|----------------|---------|
| **Ant Design** | `active` prop enables animation | ✅ |
| **Chakra UI v2** | Default animation (no control) | ✅ |
| **Chakra UI v3** | `variant="pulse"` | ✅ |
| **HeroUI** | `animationType="pulse"` | ❌ (shimmer default) |
| **Mantine** | `animate` prop (default true) | ✅ |
| **Material-UI** | `animation="pulse"` | ✅ |
| **Nuxt UI** | `animate-pulse` class | ✅ |
| **PrimeReact** | Not documented (appears to use shimmer) | ❌ |
| **ShadCN** | `animate-pulse` class | ✅ |
| **Semantic UI** | `active` class enables shimmer | ❌ (static default) |

**Implementation**: CSS-based opacity transition (0.5s - 2s duration typical)

#### Wave/Shimmer Animation
**Prevalence**: 7/9 frameworks (78%)
**Support Level**: Level 2 (Common)

Left-to-right gradient flow animation:

| Framework | Implementation | Default |
|-----------|----------------|---------|
| **Ant Design** | `active` prop (shimmer effect) | ❌ |
| **Chakra UI v3** | `variant="shine"` | ❌ |
| **HeroUI** | `animationType="shimmer"` (default in v3) | ✅ |
| **Material-UI** | `animation="wave"` | ❌ |
| **Nuxt UI** | Default via CSS (shimmer-like) | ✅ |
| **PrimeReact** | `animation="wave"` (default) | ✅ |
| **Semantic UI** | `active` class (shimmer) | ❌ |
| **ShadCN** | Not available | N/A |

**Known Issues**:
- **Material-UI**: Wave animation may become invisible with custom background colors (use pulse instead)

#### No Animation / Static
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support disabling animation:

```jsx
// Explicit false
<Skeleton animation={false} />        // Chakra, Mantine, Material-UI
<Skeleton animationType="none" />     // HeroUI
<Skeleton disableAnimation />         // HeroUI
<Skeleton animation="none" />         // PrimeReact

// No active class (Ant Design, Semantic UI)
<Skeleton />  // Static by default

// Remove animation via className override (ShadCN, Nuxt UI)
<Skeleton className="animate-none" />
```

**Use Cases**:
- Many skeletons on page (performance)
- Accessibility (respect prefers-reduced-motion)
- Static wireframes/mockups
- Print views

---

### 5. Dimension Control

#### Width Prop
**Prevalence**: 7/9 frameworks (78%)
**Support Level**: Level 2 (Common)

| Framework | Width Prop | Accepted Values |
|-----------|------------|-----------------|
| **Ant Design** | `width` (paragraph) | number, string, array |
| **Chakra UI** | Style props | Any CSS unit |
| **Mantine** | `width` | number (px), string, responsive object |
| **Material-UI** | `width` | number (px), string, responsive object |
| **PrimeReact** | `width` | CSS units (default "100%") |
| **HeroUI** | N/A | Tailwind classes |
| **Nuxt UI** | N/A | Tailwind classes |
| **ShadCN** | N/A | Tailwind classes |
| **Semantic UI** | N/A | Line length classes |

**Ant Design Array Pattern** (unique):
```jsx
<Skeleton.Paragraph
  rows={4}
  width={['100%', '90%', '80%', '70%']}
/>
```
Allows per-row width customization for realistic paragraph shapes.

#### Height Prop
**Prevalence**: 7/9 frameworks (78%)
**Support Level**: Level 2 (Common)

Similar distribution to width:

```jsx
// Number (pixels)
<Skeleton height={50} />

// String (CSS units)
<Skeleton height="3rem" />

// Responsive object (Mantine, Material-UI)
<Skeleton height={{ base: 100, md: 150, lg: 200 }} />
```

**Material-UI fontSize Pattern**:
```jsx
// Text variant height via font-size
<Skeleton variant="text" sx={{ fontSize: '2rem' }} />
```

#### Responsive Sizing
**Prevalence**: 5/9 frameworks (56%)
**Support Level**: Level 2 (Common)

**Object Syntax** (Chakra UI, Mantine, Material-UI):
```jsx
// Chakra UI
<Skeleton
  height={{ base: 100, md: 150, lg: 200 }}
  width={{ base: '100%', md: '80%', lg: 600 }}
/>

// Mantine
<Skeleton
  height={{ base: 30, sm: 40, lg: 50 }}
  width={{ base: '100%', sm: '80%', lg: '60%' }}
/>
```

**Tailwind Responsive Modifiers** (HeroUI, Nuxt UI, ShadCN):
```jsx
<Skeleton className="h-32 md:h-48 lg:h-64 w-full md:w-3/4" />
```

**Semantic UI**: Automatic responsive tiers via CSS breakpoints

---

### 6. Composition Patterns

#### Paragraph/Multi-Line Text
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

**Dedicated Components**:

**Chakra UI SkeletonText**:
```jsx
<SkeletonText
  noOfLines={4}
  spacing={4}
  skeletonHeight={2}
/>
```
- Automatic line width variation (last line shorter)
- Configurable line count, spacing, height

**Ant Design Paragraph**:
```jsx
<Skeleton
  paragraph={{
    rows: 5,
    width: ['100%', '90%', '80%', '70%', '60%']
  }}
/>
```
- Per-row width array
- Precise control over each line

**Semantic UI Paragraph Container**:
```html
<div class="ui placeholder">
  <div class="paragraph">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
```

**Composition Approach** (others):
```jsx
// Multiple skeleton components
<div className="space-y-2">
  <Skeleton width="100%" height={8} />
  <Skeleton width="90%" height={8} />
  <Skeleton width="70%" height={8} />
</div>
```

#### Avatar + Text Pattern
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

Most common composite pattern across all frameworks:

```jsx
// Chakra UI
<HStack>
  <SkeletonCircle size="12" />
  <VStack align="start" flex="1">
    <Skeleton height="4" width="60%" />
    <Skeleton height="3" width="40%" />
  </VStack>
</HStack>

// Material-UI
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  <Skeleton variant="circular" width={40} height={40} />
  <Box sx={{ flex: 1 }}>
    <Skeleton width="60%" />
    <Skeleton width="40%" />
  </Box>
</Box>

// Nuxt UI (canonical example)
<div class="flex items-center gap-4">
  <USkeleton class="h-12 w-12 rounded-full" />
  <div class="grid gap-2">
    <USkeleton class="h-4 w-[250px]" />
    <USkeleton class="h-4 w-[200px]" />
  </div>
</div>

// ShadCN (primary example)
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

**Pattern Consistency**: Despite different implementations, all frameworks show this pattern prominently in documentation.

#### Card Layout Pattern
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

Common composite: image + title + description lines

```jsx
// Ant Design
<Skeleton avatar paragraph={{ rows: 3 }} />

// Material-UI
<Card>
  <Skeleton variant="rectangular" height={140} />
  <CardContent>
    <Skeleton height={10} style={{ marginBottom: 6 }} />
    <Skeleton height={10} width="80%" />
  </CardContent>
</Card>

// Semantic UI
<div class="ui card">
  <div class="ui placeholder">
    <div class="image header">
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="paragraph">
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</div>
```

---

### 7. Theme Integration

#### CSS Custom Properties / Design Tokens
**Prevalence**: 6/9 frameworks (67%)
**Support Level**: Level 2 (Common)

**Chakra UI v3** (CSS variables):
```jsx
<Skeleton
  css={{
    '--start-color': 'colors.gray.100',
    '--end-color': 'colors.gray.300'
  }}
/>
```

**HeroUI** (theme tokens):
```jsx
// Uses bg-elevated theme color
<Skeleton className="bg-elevated" />
```

**Material-UI** (theme palette):
```jsx
<Skeleton sx={{ bgcolor: 'grey.300' }} />
```

**Nuxt UI** (theme config):
```typescript
export default defineAppConfig({
  ui: {
    skeleton: {
      base: 'animate-pulse rounded-md bg-elevated'
    }
  }
})
```

**Semantic UI** (CSS variables):
```css
--surface-d /* PrimeReact theme color */
```

#### Dark Mode Support
**Prevalence**: 9/9 frameworks (100%)
**Support Level**: Level 1 (Universal)

All frameworks support dark mode:

**Automatic** (theme-aware):
- **Ant Design**: Uses theme palette
- **Chakra UI**: rgba(text.primary / 0.11) light, rgba(text.primary / 0.13) dark
- **Material-UI**: rgba(text.primary / 0.11) light, rgba(text.primary / 0.13) dark
- **Nuxt UI**: bg-elevated adapts to mode

**Manual** (class-based):
```jsx
// HeroUI
<Skeleton className="bg-gray-200 dark:bg-gray-800" />

// ShadCN
<Skeleton className="bg-muted" /> // theme-aware
```

**Material-UI Luminance Strategy**:
- Light mode: 11% black opacity
- Dark mode: 13% white opacity (slightly higher for visibility)

---

### 8. Accessibility Patterns

#### ARIA Attributes
**Prevalence**: 0/9 frameworks (0%)
**Support Level**: Level 5 (Rare)

**No framework** includes built-in ARIA attributes in default implementation.

**Recommended Manual Implementation**:
```jsx
<Box
  role="status"
  aria-busy="true"
  aria-label="Loading content"
>
  <Skeleton />
</Box>

// Screen reader announcement
<span className="sr-only" role="status" aria-live="polite">
  {loading ? 'Loading content...' : 'Content loaded'}
</span>
```

**Pattern Gap**: Accessibility is left to developers to implement manually.

#### Reduced Motion Support
**Prevalence**: 2/9 frameworks (22%)
**Support Level**: Level 4 (Occasional)

**Chakra UI** and **Material-UI** document reduced motion:

```jsx
// Chakra UI - manual implementation
import { usePrefersReducedMotion } from '@chakra-ui/react';

const prefersReducedMotion = usePrefersReducedMotion();
<Skeleton animate={!prefersReducedMotion} />

// Material-UI - CSS-based
<Skeleton
  sx={{
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    }
  }}
/>
```

**Tailwind Frameworks** (ShadCN, HeroUI, Nuxt UI):
```jsx
<Skeleton className="motion-safe:animate-pulse motion-reduce:animate-none" />
```

**Pattern Insight**: Most frameworks rely on developers to implement motion preferences.

---

## Cross-Framework Pattern Summary

### Universal Patterns (9/9 frameworks = 100%)

1. **Circle/Avatar Shape**: All support circular skeletons for avatars
2. **Rectangle Shape**: All support rectangular placeholders
3. **Text Line Support**: All support text line skeletons
4. **No Animation Option**: All allow disabling animation
5. **Composite Patterns**: All show avatar+text and card layouts in docs
6. **Dark Mode**: All support light/dark themes
7. **Multi-Line Text**: All support multiple line composition

### Common Patterns (5-7/9 frameworks = 56-78%)

1. **Rounded Rectangles**: 7/9 (78%) support rounded corners
2. **Wave/Shimmer Animation**: 7/9 (78%) provide shimmer effect
3. **Width Prop**: 7/9 (78%) have explicit width property
4. **Height Prop**: 7/9 (78%) have explicit height property
5. **Theme Integration**: 6/9 (67%) use design tokens/CSS variables
6. **Responsive Sizing**: 5/9 (56%) support responsive dimensions

### Moderate Patterns (3-4/9 frameworks = 33-44%)

1. **isLoaded/loading Control**: 4/9 (44%) wrap content with loading prop
2. **Pulse Animation Default**: 8/9 (89%) use pulse, but only ~4/9 as default
3. **Dedicated Text Component**: 2/9 (22%) have SkeletonText-like component

### Occasional Patterns (2/9 frameworks = 22%)

1. **Specialized Component Set**: 2/9 (22%) - Chakra UI, Ant Design
2. **Reduced Motion Documentation**: 2/9 (22%) - Chakra UI, Material-UI

### Rare Patterns (1/9 frameworks = 11%)

1. **Compound Components**: 1/9 (11%) - Ant Design only
2. **Per-Row Width Arrays**: 1/9 (11%) - Ant Design only
3. **Six Line Length Modifiers**: 1/9 (11%) - Semantic UI Classic only
4. **Circle Convenience Prop**: 1/9 (11%) - Mantine only
5. **Copy-Paste Distribution**: 1/9 (11%) - ShadCN only
6. **"Placeholder" Terminology**: 1/9 (11%) - Semantic UI Classic only

---

## Key Insights

### 1. Terminology: "Skeleton" Dominates

**89% use "Skeleton"**, only Semantic UI Classic uses "Placeholder" (added v2.4.0, likely influenced by pre-2015 terminology before "skeleton screens" became standard).

**Recommendation for Semantic UI Next**: Use "Skeleton" as primary term for modern alignment, but consider `ui-placeholder` as element name for Semantic UI continuity.

### 2. Two Philosophical Approaches

**Composition-First (56%)**:
- Single primitive component
- Developers compose complex layouts
- Tailwind/class-based styling (HeroUI, Nuxt UI, ShadCN, Semantic UI)
- Minimal API surface

**Configuration-First (44%)**:
- Multiple specialized components or variants
- Pre-built patterns via props
- Component-based API (Ant Design, Chakra UI, Mantine, Material-UI)
- Larger API surface

**Trend**: Modern frameworks increasingly favor composition (ShadCN philosophy gaining traction).

### 3. Loading State API Evolution

**Chakra UI v2 → v3 Breaking Change** highlights API design challenges:

```jsx
// v2: isLoaded (positive logic)
<Skeleton isLoaded={dataLoaded}>
  <Content />
</Skeleton>

// v3: loading (negative logic)
<Skeleton loading={dataLoading}>
  <Content />
</Skeleton>
```

**Developer Mental Model Conflict**:
- `isLoaded={true}` feels intuitive (content IS loaded)
- `loading={true}` aligns with conventional state naming
- Both have merit; breaking change painful

**Semantic UI Opportunity**: Choose the more intuitive API from the start.

### 4. Animation Variety Limited

Despite different animation types (pulse, wave, shimmer):
- **Implementation**: All CSS-based
- **Effect**: Similar visual feedback (subtle movement)
- **Configuration**: Mostly boolean (on/off), rarely customizable

**Gap**: No framework offers rich animation customization (speed, easing, direction, intensity).

**Opportunity**: Semantic UI could provide animation control via settings:
```javascript
settings: {
  animation: {
    type: 'pulse' | 'wave' | 'shimmer',
    duration: '2s',
    intensity: 'subtle' | 'normal' | 'prominent'
  }
}
```

### 5. Accessibility Neglected

**0% of frameworks include built-in ARIA attributes** for skeleton components.

**Current State**: Developers must manually add:
- `role="status"`
- `aria-busy="true"`
- `aria-label` descriptions
- `aria-live` regions for screen reader announcements

**Semantic UI Opportunity**: Build accessibility in by default:
```html
<ui-skeleton
  aria-label="Loading user profile"
  role="status"
>
  <!-- Skeleton automatically includes proper ARIA -->
</ui-skeleton>
```

### 6. Responsive Design Approaches Diverge

**Prop-Based** (Chakra UI, Mantine, Material-UI):
```jsx
<Skeleton height={{ base: 100, md: 150, lg: 200 }} />
```

**Tailwind Modifiers** (HeroUI, Nuxt UI, ShadCN):
```jsx
<Skeleton className="h-32 md:h-48 lg:h-64" />
```

**CSS Breakpoints** (Semantic UI Classic):
- Automatic responsive tiers
- No per-instance control

**Semantic UI Next**: Web components + CSS custom properties could enable both:
```html
<ui-skeleton
  --height-sm="100px"
  --height-md="150px"
  --height-lg="200px"
/>
```

### 7. Unique Innovations

**Ant Design - Per-Row Width Arrays**:
```jsx
<Skeleton.Paragraph
  rows={5}
  width={['100%', '90%', '80%', '70%', '60%']}
/>
```
Most precise paragraph shape control of any framework.

**Mantine - Circle Prop**:
```jsx
<Skeleton height={50} circle />
```
Simplest API for circular skeletons (auto-sets width and border-radius).

**Chakra UI - Automatic Line Variation**:
```jsx
<SkeletonText noOfLines={4} />
```
Last line automatically shorter (natural paragraph ending).

**Semantic UI Classic - Six Line Lengths**:
```html
<div class="very short line"></div>
<div class="short line"></div>
<div class="medium line"></div>
<div class="long line"></div>
<div class="very long line"></div>
<div class="full line"></div>
```
Finest-grained line length control.

**ShadCN - Copy-Paste Distribution**:
- Component source in your project
- Zero version lock-in
- Full customization freedom
- Radically different distribution model

### 8. Material Design Influence

**Material-UI's four-variant system** (text, circular, rectangular, rounded) provides clearest semantic distinction:
- `text` - typography placeholders
- `circular` - avatars
- `rectangular` - images/media
- `rounded` - modern cards/buttons

**Insight**: Variant names describe content type, not just shape. This could inform Semantic UI's natural language API.

---

## Recommendations for Semantic UI Next

### 1. Component Architecture

**Recommendation**: **Hybrid Approach** - Single primitive with optional specialized companions

**Primary Component**: `<ui-skeleton>`
```html
<!-- Basic usage - composition-first -->
<ui-skeleton shape="rectangle" width="200px" height="100px"></ui-skeleton>
<ui-skeleton shape="circle" size="48px"></ui-skeleton>
```

**Optional Convenience Components**:
```html
<!-- For common patterns -->
<ui-skeleton-text lines="3"></ui-skeleton-text>
<ui-skeleton-avatar size="large"></ui-skeleton-avatar>
<ui-skeleton-card></ui-skeleton-card>
```

**Rationale**:
- Serves both composition-first (56%) and configuration-first (44%) philosophies
- Convenience components reduce boilerplate for common patterns
- Basic primitive enables custom compositions

### 2. API Design - Settings Architecture

**Recommended Settings Structure**:

```javascript
{
  // Core Settings
  shape: 'rectangle' | 'circle' | 'rounded',  // Material-UI inspired
  width: string | number,                      // CSS units or pixels
  height: string | number,
  size: string | number,                       // Shorthand for circle (width = height)

  // Animation Settings
  animation: {
    enabled: boolean,                          // Default: true
    type: 'pulse' | 'wave' | 'shimmer',       // Default: 'pulse'
    duration: string,                          // Default: '2s'
    timing: string,                            // Default: 'ease-in-out'
  },

  // Loading State Control
  loading: boolean,                            // Chakra v3 pattern (true = show skeleton)

  // Appearance
  variant: 'default' | 'inverted',            // Semantic UI pattern
  rounded: boolean,                            // Ant Design pattern

  // Accessibility (built-in!)
  ariaLabel: string,                           // Auto-generates if not provided
  announceLoaded: boolean,                     // Screen reader announcement

  // Responsive (via CSS custom properties)
  responsive: {
    sm: { width, height },
    md: { width, height },
    lg: { width, height }
  }
}
```

**Example Usage**:
```html
<ui-skeleton
  .settings="{
    shape: 'circle',
    size: '48px',
    animation: { type: 'shimmer', duration: '1.5s' },
    loading: true,
    ariaLabel: 'Loading user avatar'
  }"
></ui-skeleton>
```

### 3. Must-Have Features (Level 1)

Based on universal patterns (100% prevalence):

1. ✅ **Circle Shape** - All frameworks
2. ✅ **Rectangle Shape** - All frameworks
3. ✅ **Text Line Support** - All frameworks
4. ✅ **Animation Control** - Enable/disable minimum
5. ✅ **Dark Mode** - Automatic theme adaptation
6. ✅ **Multi-Line Composition** - For paragraphs
7. ✅ **Avatar + Text Pattern** - Document as canonical example
8. ✅ **Card Layout Pattern** - Document as canonical example

### 4. Should-Have Features (Level 2)

Based on common patterns (56-78% prevalence):

1. ✅ **Rounded Rectangle** - 78% support
2. ✅ **Pulse Animation** - 89% have it (most as default)
3. ✅ **Wave/Shimmer Animation** - 78% support
4. ✅ **Width/Height Props** - 78% explicit control
5. ✅ **Loading State Wrapper** - 44% (but valuable pattern)
6. ✅ **Responsive Sizing** - 56% support
7. ✅ **Theme Integration** - 67% use design tokens

### 5. Consider Features (Level 3-5)

Unique/rare patterns worth considering:

**From Ant Design** (11% - rare but valuable):
- Per-row width arrays for precise paragraph shaping
- Countdown/timer variant (specialized use case)

**From Mantine** (11% - excellent DX):
- `circle` convenience prop (simplest circle API)
- Dual-mode operation (standalone vs wrapper)

**From Chakra UI** (22% - good pattern):
- Automatic line width variation in SkeletonText
- Dedicated SkeletonText component

**From Semantic UI Classic** (11% - legacy value):
- Six line-length modifiers (very short → full)
- Paragraph grouping container

**From Material-UI**:
- Four semantic variants (text, circular, rectangular, rounded)
- fontSize-based height for text variant

### 6. Key Differentiators for Semantic UI

**Built-In Accessibility** (0% competition):
```html
<ui-skeleton
  aria-label="Loading user profile"
  announce-loaded
  role="status"
>
  <!-- Accessibility handled automatically -->
</ui-skeleton>
```

**Natural Language Settings**:
```html
<ui-skeleton
  shape="circle"
  emphasis="subtle"
  animation="shimmer"
  speed="slow"
></ui-skeleton>
```

**Semantic Variants** (Material-UI inspired + Semantic UI terminology):
```html
<ui-skeleton variant="avatar"></ui-skeleton>
<ui-skeleton variant="text"></ui-skeleton>
<ui-skeleton variant="media"></ui-skeleton>
<ui-skeleton variant="card"></ui-skeleton>
```

**Rich Animation Control** (no framework offers):
```javascript
settings: {
  animation: {
    type: 'pulse' | 'wave' | 'shimmer',
    duration: '1s' | '2s' | '3s',
    timing: 'ease' | 'ease-in-out' | 'linear',
    intensity: 'subtle' | 'normal' | 'prominent'
  }
}
```

**Settings Object Philosophy**:
```javascript
// Semantic UI pattern
<ui-skeleton .settings="{ /* all config */ }"></ui-skeleton>

// vs. prop explosion (other frameworks)
<Skeleton
  variant="circular"
  width={40}
  height={40}
  animation="pulse"
  loading={true}
  sx={{ bgcolor: 'grey.300' }}
/>
```

### 7. Recommended Terminology

**Primary**: "Skeleton" (aligns with 89% of modern frameworks)

**Element Name Options**:

**Option A - Modern alignment**:
```html
<ui-skeleton></ui-skeleton>
<ui-skeleton-text></ui-skeleton-text>
<ui-skeleton-avatar></ui-skeleton-avatar>
```

**Option B - Semantic UI continuity**:
```html
<ui-placeholder></ui-placeholder>
<ui-placeholder-text></ui-placeholder-text>
<ui-placeholder-avatar></ui-placeholder-avatar>
```

**Option C - Hybrid** (recommended):
```html
<!-- Primary component uses modern term -->
<ui-skeleton></ui-skeleton>

<!-- Variants use Semantic UI Classic terminology for continuity -->
<ui-skeleton variant="placeholder"></ui-skeleton>

<!-- Documentation mentions both terms -->
<!-- "Skeleton (also called Placeholder in Semantic UI Classic)" -->
```

**Rationale for Option C**:
- Aligns with industry standard (89%)
- Maintains Semantic UI Classic continuity via variant
- Clearest for new users while honoring legacy

### 8. Implementation Priorities

**Phase 1 - Core (Must Have)**:
```html
<!-- Basic shapes -->
<ui-skeleton shape="rectangle" width="200px" height="100px"></ui-skeleton>
<ui-skeleton shape="circle" size="48px"></ui-skeleton>
<ui-skeleton shape="rounded" width="200px" height="60px"></ui-skeleton>

<!-- Animation control -->
<ui-skeleton animation="pulse"></ui-skeleton>
<ui-skeleton animation="wave"></ui-skeleton>
<ui-skeleton animation="none"></ui-skeleton>

<!-- Loading state wrapper -->
<ui-skeleton loading="${this.isLoading}">
  <div>Actual content</div>
</ui-skeleton>

<!-- Built-in accessibility -->
<!-- Automatic role="status" and aria-busy -->
```

**Phase 2 - Enhancement (Should Have)**:
```html
<!-- Specialized components -->
<ui-skeleton-text lines="3" spacing="2"></ui-skeleton-text>
<ui-skeleton-avatar size="large"></ui-skeleton-avatar>

<!-- Responsive sizing -->
<ui-skeleton
  .responsive="{ sm: '100px', md: '150px', lg: '200px' }"
></ui-skeleton>

<!-- Theme integration -->
<ui-skeleton variant="inverted"></ui-skeleton>

<!-- Rich animation settings -->
<ui-skeleton
  .settings="{
    animation: { type: 'shimmer', duration: '1.5s', intensity: 'subtle' }
  }"
></ui-skeleton>
```

**Phase 3 - Advanced (Nice to Have)**:
```html
<!-- Per-line width control (Ant Design pattern) -->
<ui-skeleton-text
  .lineWidths="['100%', '90%', '80%', '70%']"
></ui-skeleton-text>

<!-- Semantic variants (Material-UI inspired) -->
<ui-skeleton variant="avatar"></ui-skeleton>
<ui-skeleton variant="media"></ui-skeleton>
<ui-skeleton variant="text"></ui-skeleton>

<!-- Custom content (Ant Design Node pattern) -->
<ui-skeleton-node>
  <custom-element></custom-element>
</ui-skeleton-node>
```

### 9. Code Example - Recommended API

**Simple Avatar + Text Pattern**:
```html
<div class="flex items-center gap-4">
  <ui-skeleton
    shape="circle"
    size="48px"
    aria-label="Loading avatar"
  ></ui-skeleton>

  <div class="flex flex-col gap-2">
    <ui-skeleton width="250px" height="16px"></ui-skeleton>
    <ui-skeleton width="200px" height="14px"></ui-skeleton>
  </div>
</div>
```

**Settings-Based Configuration**:
```html
<ui-skeleton
  .settings="{
    shape: 'circle',
    size: '48px',
    animation: { type: 'pulse', duration: '2s' },
    loading: true,
    variant: 'default',
    ariaLabel: 'Loading profile picture'
  }"
></ui-skeleton>
```

**Card Pattern with Wrapper**:
```html
<ui-skeleton loading="${this.isLoading}">
  <div class="card">
    <img src="${this.data.image}" />
    <h3>${this.data.title}</h3>
    <p>${this.data.description}</p>
  </div>
</ui-skeleton>

<!-- When loading=true, shows skeleton -->
<!-- When loading=false, shows content with fade-in -->
```

**Convenience Component**:
```html
<ui-skeleton-text
  lines="4"
  spacing="2"
  .lineWidths="['100%', '90%', '80%', '60%']"
></ui-skeleton-text>
```

---

## Summary: Pattern Prevalence

| Pattern | Prevalence | Level | Priority |
|---------|------------|-------|----------|
| Circle/Avatar Shape | 9/9 (100%) | 1 (Universal) | Must Have |
| Rectangle Shape | 9/9 (100%) | 1 (Universal) | Must Have |
| Text Line Support | 9/9 (100%) | 1 (Universal) | Must Have |
| No Animation Option | 9/9 (100%) | 1 (Universal) | Must Have |
| Avatar + Text Pattern | 9/9 (100%) | 1 (Universal) | Must Have |
| Card Layout Pattern | 9/9 (100%) | 1 (Universal) | Must Have |
| Dark Mode Support | 9/9 (100%) | 1 (Universal) | Must Have |
| Pulse Animation | 8/9 (89%) | 1 (Universal) | Must Have |
| Rounded Rectangle | 7/9 (78%) | 2 (Common) | Should Have |
| Wave/Shimmer Animation | 7/9 (78%) | 2 (Common) | Should Have |
| Width Prop | 7/9 (78%) | 2 (Common) | Should Have |
| Height Prop | 7/9 (78%) | 2 (Common) | Should Have |
| Theme Integration | 6/9 (67%) | 2 (Common) | Should Have |
| Responsive Sizing | 5/9 (56%) | 2 (Common) | Should Have |
| Loading Wrapper | 4/9 (44%) | 3 (Moderate) | Consider |
| Specialized Components | 2/9 (22%) | 4 (Occasional) | Consider |
| Reduced Motion Docs | 2/9 (22%) | 4 (Occasional) | Consider |
| Compound Components | 1/9 (11%) | 5 (Rare) | Optional |
| Per-Row Width Arrays | 1/9 (11%) | 5 (Rare) | Optional |
| Six Line Lengths | 1/9 (11%) | 5 (Rare) | Optional |
| Circle Convenience Prop | 1/9 (11%) | 5 (Rare) | Optional |
| Copy-Paste Distribution | 1/9 (11%) | 5 (Rare) | N/A |

---

## Final Recommendations

### 1. Primary Component API

```html
<ui-skeleton
  shape="rectangle | circle | rounded"
  width="css-value"
  height="css-value"
  size="css-value"
  animation="pulse | wave | shimmer | none"
  loading="boolean"
  variant="default | inverted"
  aria-label="string"
></ui-skeleton>
```

### 2. Convenience Components

```html
<ui-skeleton-text lines="number"></ui-skeleton-text>
<ui-skeleton-avatar size="small | medium | large"></ui-skeleton-avatar>
<ui-skeleton-card></ui-skeleton-card>
```

### 3. Settings Architecture

```javascript
settings: {
  shape: 'rectangle' | 'circle' | 'rounded',
  width: string | number,
  height: string | number,
  animation: {
    enabled: boolean,
    type: 'pulse' | 'wave' | 'shimmer',
    duration: string,
    timing: string
  },
  loading: boolean,
  variant: 'default' | 'inverted',
  ariaLabel: string,
  announceLoaded: boolean
}
```

### 4. Key Differentiators

1. **Built-in accessibility** (0% competition)
2. **Rich animation control** (no framework offers)
3. **Natural language settings** (Semantic UI philosophy)
4. **Semantic variants** (Material-UI + Semantic UI)
5. **Settings object** (reduces prop explosion)

### 5. Documentation Focus

**Primary Examples**:
1. Avatar + Text (most common pattern - 100%)
2. Card Layout (universal pattern - 100%)
3. List Items (high-frequency use case)
4. Table Rows (common pattern)

**Advanced Examples**:
1. Loading state wrapper pattern
2. Responsive sizing
3. Custom animations
4. Accessibility implementation

---

**Aggregate Analysis Complete**: Comprehensive cross-framework pattern research covering 9 frameworks, 20+ pattern categories, and detailed recommendations for Semantic UI Next implementation.

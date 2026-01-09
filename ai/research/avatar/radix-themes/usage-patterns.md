# Radix UI Themes - Avatar Component Usage Patterns

## Research Metadata
- **Framework**: Radix UI Themes (React)
- **Component**: Avatar
- **Documentation URL**: https://www.radix-ui.com/themes/docs/components/avatar
- **Primitives URL**: https://www.radix-ui.com/primitives/docs/components/avatar
- **Source Code**: https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/avatar.tsx
- **Research Date**: 2025-11-05
- **URL Status**: Accessible (via web search data extraction)

---

## Component Definition

### Avatar Component
**Purpose**: Display a profile picture, user initials, or fallback icon for representing users in an interface.

**Mental Model**: Avatar is a **user representation component** designed to:
- Display profile images with automatic loading detection
- Show fallback content (initials, icons) when images unavailable
- Provide consistent user identity visualization
- Support graceful degradation with intelligent fallback mechanism

**Key Characteristic**: Built on Radix Primitives Avatar; automatically handles image loading states with smart fallback system. Combines image display with fallback rendering in a single unified component.

**Note on Radix Themes**: This is the **styled version** built on top of Radix Primitives Avatar. It provides a complete design system integration with theming, sizing, and color variants that the primitive doesn't include.

---

## Avatar Component - Detailed Analysis

### Component Architecture

**Primitive Foundation**: Radix Themes Avatar builds on Radix Primitives Avatar which has three parts:
1. **Avatar.Root** - Container wrapper
2. **Avatar.Image** - Image element with load detection
3. **Avatar.Fallback** - Fallback content renderer

**Themes Integration**: The Themes version wraps these primitives with:
- Unified component API (no manual Root/Image/Fallback composition required)
- Built-in theming and design tokens
- Size scale integration
- Color system integration
- Variant styling

### Supported Variants & Types

#### 1. **Size Variants** (Level 1 - Core)
**Support**: Full - 8 size options
**Description**: Controls avatar dimensions using numeric scale

**Available Sizes**:
- `size="1"` - Extra small (16px scale)
- `size="2"` - Small
- `size="3"` - Default/medium size
- `size="4"` - Medium-large
- `size="5"` - Large
- `size="6"` - Extra large
- `size="7"` - 2X large
- `size="8"` - 3X large

```jsx
<Avatar size="1" src="..." fallback="A" />
<Avatar size="2" src="..." fallback="A" />
<Avatar size="3" src="..." fallback="A" />
<Avatar size="4" src="..." fallback="A" />
<Avatar size="5" src="..." fallback="A" />
<Avatar size="6" src="..." fallback="A" />
<Avatar size="7" src="..." fallback="A" />
<Avatar size="8" src="..." fallback="A" />
```

**Default**: `size="3"`

**Responsive Sizing**: Supports responsive size objects for breakpoint-based sizing.

```jsx
<Avatar size={{ initial: '2', md: '4', lg: '6' }} src="..." fallback="A" />
```

#### 2. **Visual Variants** (Level 1 - Core)
**Support**: Full - 2 variant options
**Description**: Controls the visual style of the fallback background

**Available Variants**:
- `solid` - Filled background with higher contrast
- `soft` - Subtle, muted background (default)

```jsx
<Avatar variant="solid" color="indigo" fallback="JD" />
<Avatar variant="soft" color="indigo" fallback="JD" />
```

**Default**: `soft` variant

**Note**: Variants only affect fallback rendering, not the image display.

#### 3. **Color System** (Level 1 - Core)
**Support**: Full - Complete theme color palette
**Description**: Semantic color assignment for fallback backgrounds using theme accent colors

**Color Options Include**:
- Gray (neutral)
- Blue (information)
- Green/Jade (success)
- Amber/Yellow (warning)
- Red/Crimson (error)
- Indigo, Purple, Pink, Cyan, Orange, and more accent colors

```jsx
<Avatar color="blue" fallback="AB" />
<Avatar color="green" fallback="CD" />
<Avatar color="orange" fallback="EF" />
<Avatar color="crimson" fallback="GH" />
<Avatar color="indigo" fallback="IJ" />
```

**Philosophy**: Full theme palette access enables flexible color assignment for user categorization or brand alignment.

**Note**: Color only applies to fallback rendering (when no image or image fails to load).

#### 4. **High Contrast Mode** (Level 1 - Accessibility)
**Support**: Full
**Description**: Increases background color contrast for improved visibility

```jsx
<Avatar color="indigo" variant="solid" highContrast fallback="HC" />
<Avatar color="indigo" variant="soft" highContrast fallback="HC" />
```

**Use Case**: Improves visibility against varied backgrounds; meets accessibility standards; essential for users with vision impairments.

**Application**: Works with fallback rendering only.

#### 5. **Radius Control** (Level 2 - Styling)
**Support**: Full
**Description**: Assigns specific border-radius value, overriding theme defaults

```jsx
<Avatar radius="none" fallback="SQ" />      {/* Square */}
<Avatar radius="small" fallback="SM" />     {/* Slightly rounded */}
<Avatar radius="medium" fallback="MD" />    {/* Moderately rounded */}
<Avatar radius="large" fallback="LG" />     {/* Highly rounded */}
<Avatar radius="full" fallback="CI" />      {/* Circular - most common */}
```

**Default**: Typically `full` (circular) for avatars

**Note**: Allows per-component radius customization independent of global theme radius setting.

#### 6. **Fallback System** (Level 1 - Core)
**Support**: Full - Flexible fallback content
**Description**: Content rendered when image unavailable or fails to load

**Fallback Types**:
- Single character initials: `fallback="A"`
- Multiple character initials: `fallback="AB"` or `fallback="JD"`
- Custom React elements: `fallback={<IconUser />}`
- Complex elements: `fallback={<CustomSVG />}`

```jsx
{/* Single initial */}
<Avatar src="..." fallback="A" />

{/* Two initials */}
<Avatar src="..." fallback="JD" />

{/* Three characters */}
<Avatar src="..." fallback="ABC" />

{/* Custom icon */}
<Avatar src="..." fallback={<UserIcon />} />
```

**Fallback Behavior**:
- Displays when image is loading
- Displays when image fails to load
- Displays when no `src` provided
- Can use optional `delayMs` in primitive for flash prevention

### Avatar API Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **src** | `string` | - | Image source URL | Level 1 |
| **fallback** | `ReactNode` | - | Fallback content (initials/icon) | Level 1 |
| **alt** | `string` | - | Image alt text for accessibility | Level 1 |
| **size** | `'1' \| '2' \| '3' \| '4' \| '5' \| '6' \| '7' \| '8' \| Responsive` | `'3'` | Component size scale | Level 1 |
| **variant** | `'solid' \| 'soft'` | `'soft'` | Fallback visual style | Level 1 |
| **color** | `ThemeColor` | - | Fallback theme accent color | Level 1 |
| **highContrast** | `boolean` | `false` | Enhanced contrast mode | Level 1 |
| **radius** | `'none' \| 'small' \| 'medium' \| 'large' \| 'full'` | `'full'` | Border radius override | Level 2 |
| **asChild** | `boolean` | `false` | Composition via Slot | Level 2 |
| **Margin props** | Various | - | Common margin spacing | Level 1 |

**Base Element**: Composite of `<span>` (container) + `<img>` (image) + fallback element

**Additional Props**: Inherits standard HTML image attributes.

### Image Loading Behavior

#### Automatic Load Detection
**Feature**: Avatar automatically detects image loading states
**Behavior**:
1. Image begins loading when `src` provided
2. Fallback displays during loading
3. Image replaces fallback when successfully loaded
4. Fallback persists if image fails to load

#### Loading State Control (Primitive Level)
**Advanced Feature**: `onLoadingStatusChange` handler for manual control

```jsx
// Primitive API (not in Themes wrapper)
<Avatar.Image
  src="..."
  onLoadingStatusChange={(status) => {
    console.log(status); // 'idle' | 'loading' | 'loaded' | 'error'
  }}
/>
```

#### Fallback Delay (Primitive Level)
**Feature**: Optional `delayMs` prop prevents content flashing
**Use Case**: Prevents jarring visual changes on fast connections

```jsx
// Primitive API
<Avatar.Fallback delayMs={600}>
  AB
</Avatar.Fallback>
```

**Philosophy**: Optimize perceived performance by delaying fallback on slow networks while avoiding flash on fast networks.

### Variant Behavior Comparison

| Variant | Fallback Background | Fallback Text | Use Case |
|---------|---------------------|---------------|----------|
| **solid** | Fully filled | High contrast | Maximum visibility, bold presence |
| **soft** | Subtle tint | Medium contrast | Default, gentle appearance |

**Note**: When image successfully loads, variant has no visible effect.

### Size Scale Dimensions

**Philosophy**: 8-step size scale provides granular control from tiny icons to large profile headers.

**Usage Patterns**:
- **Size 1-2**: Inline mentions, compact lists
- **Size 3-4**: Standard user lists, comments (most common)
- **Size 5-6**: Emphasis contexts, cards
- **Size 7-8**: Profile headers, hero sections

**Responsive Sizing**: Size can adapt to viewport breakpoints.

### Color Palette Integration

**Theme Integration**: Avatar fallbacks deeply integrate with Radix Themes color system:
- 12-step color scale per color
- Automatic dark mode support
- Accent color pairing with complementary grays
- Consistent color application across variants

**Use Cases for Color**:
- User categorization (team roles, departments)
- Status indication (online/offline/away)
- Brand alignment (company colors)
- Visual differentiation in lists

**Color Accessibility**: Built on accessible color contrast ratios; high-contrast mode provides additional enhancement.

### Composition Patterns

#### AsChild Pattern (Level 2)
**Support**: Full
**Description**: Renders Avatar behavior onto a child element instead of default span

```jsx
// Wrap custom element with Avatar styling
<Avatar asChild>
  <a href="/profile">
    <img src="..." />
  </a>
</Avatar>
```

**Philosophy**: Follows Radix Primitives composition pattern; enables polymorphic component behavior.

#### Margin Props Pattern (Level 1)
**Support**: Full
**Description**: Common margin properties for layout control

```jsx
<Avatar m="2" src="..." fallback="AB" />           {/* Margin all sides */}
<Avatar mx="4" src="..." fallback="CD" />          {/* Margin horizontal */}
<Avatar my="2" src="..." fallback="EF" />          {/* Margin vertical */}
<Avatar mt="1" mb="3" src="..." fallback="GH" />   {/* Individual margins */}
```

**Integration**: Part of Radix Themes layout prop system.

---

## Code Examples

### Basic Avatar Usage
```jsx
import { Avatar } from '@radix-ui/themes';

// With image source
<Avatar
  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
  fallback="A"
/>

// With initials fallback
<Avatar fallback="JD" />

// With alt text for accessibility
<Avatar
  src="..."
  fallback="AB"
  alt="Alice Brown profile picture"
/>
```

### Size Variants
```jsx
import { Flex, Avatar } from '@radix-ui/themes';

<Flex align="center" gap="2">
  <Avatar size="1" src="..." fallback="A" />
  <Avatar size="2" src="..." fallback="B" />
  <Avatar size="3" src="..." fallback="C" />
  <Avatar size="4" src="..." fallback="D" />
  <Avatar size="5" src="..." fallback="E" />
  <Avatar size="6" src="..." fallback="F" />
  <Avatar size="7" src="..." fallback="G" />
  <Avatar size="8" src="..." fallback="H" />
</Flex>
```

### Visual Variants with Color
```jsx
// Solid variant (higher contrast fallback)
<Avatar variant="solid" color="indigo" fallback="JD" />
<Avatar variant="solid" color="crimson" fallback="AB" />

// Soft variant (subtle fallback)
<Avatar variant="soft" color="blue" fallback="CD" />
<Avatar variant="soft" color="green" fallback="EF" />
```

### Fallback Color System
```jsx
// Using theme colors for categorization
<Avatar color="blue" fallback="AB" />     {/* Information/Admin */}
<Avatar color="green" fallback="CD" />    {/* Active/Success */}
<Avatar color="orange" fallback="EF" />   {/* Warning/Pending */}
<Avatar color="crimson" fallback="GH" />  {/* Error/Inactive */}
<Avatar color="gray" fallback="IJ" />     {/* Neutral/Default */}
```

### High Contrast Mode
```jsx
// Standard contrast
<Avatar color="indigo" variant="soft" fallback="ST" />

// Enhanced contrast for better visibility
<Avatar color="indigo" variant="soft" highContrast fallback="HC" />

// Works with solid variant too
<Avatar color="blue" variant="solid" highContrast fallback="AB" />
```

### Radius Customization
```jsx
// Square avatar
<Avatar radius="none" fallback="SQ" />

// Slightly rounded
<Avatar radius="small" fallback="SM" />

// Circular (most common for avatars)
<Avatar radius="full" fallback="CI" />
```

### Responsive Sizing
```jsx
// Different sizes at different breakpoints
<Avatar
  size={{ initial: '2', md: '4', lg: '6' }}
  src="..."
  fallback="RS"
/>
```

### Fallback Content Types
```jsx
import { UserIcon } from '@/icons';

// Single initial
<Avatar fallback="A" />

// Two initials (common pattern)
<Avatar fallback="JD" />

// Three characters
<Avatar fallback="ABC" />

// Custom icon fallback
<Avatar fallback={<UserIcon />} />

// Custom SVG
<Avatar fallback={
  <svg viewBox="0 0 24 24">
    <path d="..." />
  </svg>
} />
```

### Combined Patterns
```jsx
// Multiple props combined
<Avatar
  src="..."
  fallback="JD"
  variant="solid"
  color="indigo"
  size="6"
  highContrast
  radius="full"
  alt="John Doe profile"
/>

// With spacing
<Avatar
  src="..."
  fallback="AB"
  color="blue"
  variant="soft"
  m="2"
/>
```

### Practical Use Cases

#### User Profile Header
```jsx
import { Flex, Avatar, Box, Heading, Text } from '@radix-ui/themes';

<Flex gap="4" align="center">
  <Avatar
    size="7"
    src="https://..."
    fallback="JD"
    radius="full"
  />
  <Box>
    <Heading size="6">John Doe</Heading>
    <Text color="gray">Software Engineer</Text>
  </Box>
</Flex>
```

#### Comment List
```jsx
import { Flex, Avatar, Box, Text } from '@radix-ui/themes';

<Flex gap="3">
  <Avatar
    size="3"
    src="..."
    fallback="AB"
    color="blue"
  />
  <Box>
    <Text weight="bold">Alice Brown</Text>
    <Text color="gray">Great article!</Text>
  </Box>
</Flex>
```

#### Team Member Grid
```jsx
import { Grid, Avatar, Text, Box } from '@radix-ui/themes';

<Grid columns="4" gap="4">
  <Box>
    <Avatar size="5" color="indigo" fallback="JD" />
    <Text>John Doe</Text>
  </Box>
  <Box>
    <Avatar size="5" color="cyan" fallback="AB" />
    <Text>Alice Brown</Text>
  </Box>
  <Box>
    <Avatar size="5" color="orange" fallback="CD" />
    <Text>Chris Davis</Text>
  </Box>
  <Box>
    <Avatar size="5" color="crimson" fallback="EF" />
    <Text>Emma Foster</Text>
  </Box>
</Grid>
```

#### Avatar Group (Manual)
```jsx
import { Flex, Avatar } from '@radix-ui/themes';

// Overlapping avatars
<Flex style={{ marginLeft: '-8px' }}>
  <Avatar size="4" src="..." fallback="A" style={{ marginLeft: '8px' }} />
  <Avatar size="4" src="..." fallback="B" style={{ marginLeft: '-12px', zIndex: 1 }} />
  <Avatar size="4" src="..." fallback="C" style={{ marginLeft: '-12px', zIndex: 2 }} />
  <Avatar size="4" fallback="+5" variant="solid" color="gray" style={{ marginLeft: '-12px', zIndex: 3 }} />
</Flex>
```

#### Status Indicator with Avatar
```jsx
import { Box, Avatar } from '@radix-ui/themes';

// Avatar with online status dot
<Box position="relative" style={{ display: 'inline-block' }}>
  <Avatar size="5" src="..." fallback="JD" />
  <Box
    position="absolute"
    bottom="0"
    right="0"
    style={{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: 'var(--green-9)',
      border: '2px solid var(--color-background)'
    }}
  />
</Box>
```

#### Fallback Only (No Image)
```jsx
// Using Avatar for initials display without image
<Avatar color="indigo" variant="solid" fallback="AB" />
<Avatar color="cyan" variant="soft" fallback="CD" />
<Avatar color="orange" variant="solid" fallback="EF" />
```

---

## Pattern Support Levels Summary

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Size scale (1-8) | Level 1 | Core feature |
| Visual variants (2 types) | Level 1 | Core feature |
| Color palette integration | Level 1 | Core feature |
| Fallback system (flexible) | Level 1 | Core feature |
| Image loading detection | Level 1 | Core feature |
| High contrast mode | Level 1 | Core accessibility |
| Radius control | Level 2 | Styling customization |
| Responsive sizing | Level 1 | Core responsive |
| AsChild composition | Level 2 | Advanced composition |
| Margin props | Level 1 | Core layout |
| Alt text support | Level 1 | Core accessibility |
| Automatic image fallback | Level 1 | Core feature |

---

## Implementation Philosophy

### Avatar Design Philosophy
Radix UI Themes Avatar embodies a **smart fallback** approach:
- Automatic image loading detection (no manual state management)
- Flexible fallback content (text, initials, icons, custom elements)
- Graceful degradation when images fail
- Built on accessible primitive foundation
- Theming integration for fallback styling
- Size scale for diverse use cases (inline to hero)
- Composition patterns for advanced usage

### Radix Themes Patterns
**Key Characteristics**:
- Built on Radix Primitives Avatar (Root/Image/Fallback architecture)
- Unified component API (no manual primitive composition)
- 8-step size scale (most granular among Radix components)
- Variant system for fallback styling
- Full color palette access for categorization
- Automatic dark mode through color system
- Responsive sizing support
- Layout props (margin) built into component
- AsChild for polymorphic composition

### Primitive vs Themes Distinction
**Radix Primitives Avatar**:
- Unstyled, accessible foundation
- Manual composition (Root + Image + Fallback)
- Load state control via `onLoadingStatusChange`
- Fallback delay with `delayMs`
- Maximum flexibility and control

**Radix Themes Avatar**:
- Styled, design system integrated
- Unified component (automatic composition)
- Theme color system integration
- Size scale and variants
- Simplified API for common use cases

**When to Use Which**:
- **Themes**: Most use cases, rapid development, design system consistency
- **Primitives**: Custom styling needs, maximum control, non-React frameworks

---

## Accessibility Considerations

### Image Alternative Text
**Requirement**: Always provide `alt` prop for images
```jsx
<Avatar
  src="..."
  fallback="JD"
  alt="John Doe profile picture"
/>
```

**Screen Reader Experience**: Alt text read when image loads; fallback content read when image unavailable.

### High Contrast Support
- `highContrast` prop enhances fallback visibility
- Works with all variant and color combinations
- Meets WCAG contrast requirements
- Essential for users with vision impairments

### Color Semantics
- Color should not be sole information indicator
- Combine color with text labels or initials
- Theme ensures accessible contrast ratios
- High-contrast mode provides additional safety

### Keyboard & Focus
- Avatar is presentational (non-interactive by default)
- When wrapped in interactive elements (links, buttons), inherits that element's accessibility
- No keyboard interaction needed for static avatar
- Interactive avatars should use semantic HTML (button, anchor)

### Fallback Accessibility
- Text fallback content is screen-reader accessible
- Icon fallbacks should include appropriate ARIA labels
- Initials provide meaningful alternative to images
- Automatic fallback ensures content always available

---

## Research Notes

### Data Collection Method
- Web search extraction from official Radix UI Themes documentation
- Web search extraction from Radix Primitives Avatar documentation
- GitHub source code review for TypeScript interfaces
- Cross-referenced Themes and Primitives documentation
- Research date: 2025-11-05

### Documentation Quality
- Official Themes documentation is clear and comprehensive
- Interactive examples provided
- Primitives documentation provides architectural foundation
- TypeScript definitions publicly available
- Strong theme integration documentation
- Size scale well-documented
- Color system documented separately

### Limitations
- Direct URL fetching blocked; relied on web search
- Exact size dimensions (px/rem) not explicitly documented
- Some primitive features (delayMs, onLoadingStatusChange) not exposed in Themes wrapper
- Avatar group pattern not officially documented (manual implementation required)
- Status indicator pattern requires custom implementation

### Notable Observations

**Radix Themes vs Radix Primitives**:
- This research covers Radix **Themes** (opinionated design system)
- Radix **Primitives** provide unstyled, accessible foundation
- Avatar exists in both (Primitive = foundation, Themes = styled wrapper)
- Themes simplifies API but hides some primitive features
- Primitives require manual Root/Image/Fallback composition

**Framework Integration**:
- React-specific component library
- Requires React 16.8+ (hooks)
- Not framework-agnostic or portable
- CSS-in-JS approach via design tokens
- Requires Radix Themes provider context

**Size Scale Granularity**:
- 8-step size scale (most granular among Radix components)
- Most components use 1-3 or 1-4 scale
- Avatar's 1-8 scale reflects diverse use cases (inline to hero)

**Fallback Intelligence**:
- Automatic load detection (no manual state)
- Flexible fallback content (not just text)
- Graceful degradation built-in
- Optional delay mechanism at primitive level

---

## Recommendations for Semantic UI

### Avatar Implementation Priority

**Must-Have (Level 1)**:
1. Image source support with automatic loading
2. Fallback content system (text, initials, custom elements)
3. Automatic image load detection and fallback triggering
4. Size scale with clear progression (consider 1-8 or simplified 1-5)
5. Alt text support for accessibility
6. Circular/square radius options
7. Color system integration for fallback styling
8. Variant system for fallback appearance

**Should-Have (Level 2)**:
1. High-contrast mode for accessibility
2. Responsive sizing support
3. Margin/spacing controls
4. Composition patterns (slot-based equivalent to asChild)
5. Loading state visibility control
6. Fallback delay to prevent flash

**Consider**:
- Avatar group component for overlapping displays
- Status indicator integration (badge/dot overlay)
- Presence indicators (online/offline/away)
- Custom color palette configuration
- 12-step color scale system
- Dark mode support

### Semantic UI Differentiators

**Natural Language Patterns**:
- Radix uses numeric size scale (`1`-`8`)
- Consider: `tiny`, `small`, `medium`, `large`, `huge`, `massive` for semantic naming
- Or hybrid: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`
- Radix uses `color` prop; consider `accent` or `tone` for clarity

**Settings Architecture**:
- Leverage reactive settings for src, fallback, color, variant, size
- Support runtime changes to all visual properties
- Use settings for radius, contrast overrides
- Enable dynamic image swapping

**Component Composition**:
- Image content via `src` attribute or setting
- Fallback content via slot or `fallback` attribute
- Automatic Root/Image/Fallback composition (like Themes, not Primitives)
- Consider separate primitive for advanced users (manual composition)

**Web Component Advantages**:
- Shadow DOM for true style encapsulation
- Standard HTML attributes instead of React props
- Framework-agnostic usage
- Progressive enhancement support
- Native image loading API integration
- Built-in slot system for fallback content

**Event Handling**:
- Dispatch custom events for load states (`imageLoaded`, `imageError`, `fallbackShown`)
- Enable external load state monitoring
- Support manual load triggering
- Provide load state data attributes for CSS

### Radix Themes Insights

**Strengths**:
- Automatic image loading detection (excellent DX)
- Flexible fallback system (not limited to text)
- 8-step size scale (accommodates diverse use cases)
- Simple, unified API (vs complex primitive composition)
- Graceful degradation built-in
- Strong accessibility foundation
- Theme integration for consistent styling

**Potential Adaptations for Semantic UI**:
- Automatic fallback mechanism maps well to web component lifecycle
- Size scale provides clear sizing strategy
- Variant pattern for fallback styling
- Color system for user categorization
- High-contrast mode addresses real accessibility needs
- Radius control enables design flexibility

**Considerations**:
- Radix approach is React-specific; requires adaptation
- Primitives provide more control but complex API
- Themes simplify API but hide some features
- CSS-in-JS vs Shadow DOM CSS approach
- Theme provider context vs web standards theming

### Web Component Implementation Strategy

**Automatic Loading Detection**:
```javascript
// Use native image load events
const img = shadowRoot.querySelector('img');
img.addEventListener('load', () => {
  // Hide fallback, show image
  dispatchEvent('imageLoaded', { src: img.src });
});
img.addEventListener('error', () => {
  // Show fallback, hide image
  dispatchEvent('imageError', { src: img.src });
});
```

**Fallback Slot System**:
```html
<!-- Default slot for image -->
<slot name="image">
  <img src="{src}" alt="{alt}" />
</slot>

<!-- Fallback slot for custom content -->
<slot name="fallback">
  <span class="initials">{fallback}</span>
</slot>
```

**Reactive Settings**:
```javascript
defaultSettings: {
  src: null,
  fallback: '',
  alt: '',
  size: 'medium',
  variant: 'soft',
  color: null,
  highContrast: false,
  radius: 'full'
}
```

**Load State Data Attributes**:
```css
/* Style based on load state */
:host([data-image-state="loading"]) .fallback {
  display: flex;
}
:host([data-image-state="loaded"]) .fallback {
  display: none;
}
:host([data-image-state="error"]) .fallback {
  display: flex;
}
```

### Key Insight
Radix UI Themes Avatar demonstrates the value of **automatic state management** for image loading. By handling load detection internally and providing intelligent fallback rendering, it eliminates boilerplate and improves developer experience. The 8-step size scale reflects avatar's diverse use cases (inline mentions to hero headers). The separation between Primitives (maximum control) and Themes (simplified API) shows two valid approaches—Semantic UI could provide both or unify them with a comprehensive settings system.

---

## Comparison: Themes vs Primitives

**Radix Primitives Avatar** (Unstyled Foundation):
- Manual composition required (Root + Image + Fallback)
- `onLoadingStatusChange` callback for load state
- `delayMs` prop on Fallback to prevent flash
- Maximum flexibility and control
- No styling opinions
- Framework-agnostic styling

**Radix Themes Avatar** (Styled Wrapper):
- Automatic composition (unified component)
- Size scale (1-8)
- Variant system (solid/soft)
- Color palette integration
- Theme design tokens
- Simplified API

**Usage Recommendations**:
- **Most developers**: Use Themes for speed and consistency
- **Custom designs**: Use Primitives for full styling control
- **Design systems**: Use Themes or build on Primitives

### Implications for Semantic UI
When designing Avatar primitive, consider:
1. **Unified component** (like Themes) vs **manual composition** (like Primitives)
2. Unified approach simpler but less flexible
3. Manual composition powerful but complex API
4. Could provide both: high-level component + low-level parts
5. Settings system could bridge gap (one component, configurable behavior)

---

## URL Verification Status

- **Themes Documentation URL**: https://www.radix-ui.com/themes/docs/components/avatar
  - Status: ✅ Accessible via web search
  - Content: Comprehensive API documentation with examples

- **Primitives Documentation URL**: https://www.radix-ui.com/primitives/docs/components/avatar
  - Status: ✅ Accessible via web search
  - Content: Foundation component architecture

- **Source Code URL**: https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/avatar.tsx
  - Status: ✅ Accessible
  - Content: TypeScript implementation with prop definitions

- **Research Method**: Web search data extraction (direct fetch blocked)
- **Research Date**: 2025-11-05
- **Framework Version**: Radix Themes (current/latest)

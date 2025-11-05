# Label/Badge Component - Aggregate Pattern Research

**Research Date**: 2025-11-04
**Frameworks Analyzed**: 10
**Components Researched**: Badge (9), Tag/Chip (6), Label (1)
**Total Individual Reports**: 10

---

## Executive Summary

This research analyzed label/badge/tag patterns across 10 major UI frameworks. A key finding is that frameworks take fundamentally different approaches to organizing these related concepts:

**Unified Approach** (3 frameworks):
- **Semantic UI Classic**: Single `Label` component handles badges, tags, and labels
- **Nuxt UI**: Single `Badge` component serves both badge and tag purposes
- **ShadCN**: Single `Badge` component (explicitly shown as dual-purpose)

**Separated Approach** (5 frameworks):
- **Ant Design**: Separate `Badge` (overlay/notification) and `Tag` (categorization)
- **Chakra UI**: Separate `Badge` (status) and `Tag` (categorization)
- **HeroUI**: Separate `Badge` (overlay) and `Chip` (standalone)
- **Mantine**: Separate `Badge` (display) and `Chip` (interactive selection)
- **PrimeReact**: Separate `Badge` (notification) and `Tag` (categorization)

**Badge-Only Approach** (2 frameworks):
- **MUI**: Badge only (no Tag/Chip component)
- **Radix UI**: Badge only (serves labeling use cases)

---

## Component Philosophy: Badge vs Tag

### Framework Definitions

#### Badge Mental Models (9 frameworks)
- **Notification/Count Indicator**: Display numerical values (Ant Design, MUI, HeroUI, PrimeReact)
- **Status Indicator**: Show state/status with dot or text (all frameworks)
- **Overlay Element**: Positioned on other components (Ant Design, MUI, HeroUI, PrimeReact)
- **Standalone Label**: Inline status/category marker (Nuxt UI, Radix UI, ShadCN)

#### Tag/Chip Mental Models (6 frameworks)
- **Categorization Element**: Label content categories (Ant Design, Chakra, PrimeReact)
- **Interactive Selection**: Toggleable/selectable filters (Mantine, HeroUI)
- **Removable Label**: Dismissible with close button (Ant Design, Chakra, HeroUI, PrimeReact)
- **Keyword/Metadata Display**: Show tags/hashtags (all Tag implementations)

#### Semantic UI Classic Label (unique unified approach)
- **Content Classification System**: Badges + Tags + Labels as variations of classification
- **Spatial Relationships**: Extensive positioning (corner, ribbon, attached, floating, pointing)
- **Use Case Agnostic**: Same component serves notifications, categories, and labels

### When Frameworks Separate Badge from Tag

| Framework | Badge Use Cases | Tag/Chip Use Cases |
|-----------|-----------------|-------------------|
| **Ant Design** | Notification counts, status dots, overlays on avatars/icons | Category labels, closeable filters, tag clouds |
| **Chakra UI** | Status indicators, feature flags, notification counts | Category labels, filter chips, multi-select displays |
| **HeroUI** | Overlay notifications, status dots on avatars | Standalone tags, closeable selections, filter lists |
| **Mantine** | Display-only status/counts, visual indicators | Interactive form controls (checkbox/radio behavior) |
| **PrimeReact** | Notification counts, status overlays | Category labels with icons, inline tags |

**Common Distinction Pattern**:
- **Badge**: Overlay positioning, numeric content, non-interactive
- **Tag**: Inline positioning, text content, interactive (closeable/selectable)

---

## Pattern Category Analysis

### 1. Content Patterns

#### Numeric Content
**Prevalence**: 9/9 Badge implementations (100%)
**Pattern**: Display numerical counts with overflow handling

| Framework | Max Count Support | Overflow Pattern | Show Zero |
|-----------|------------------|------------------|-----------|
| Ant Design | ✅ `overflowCount` (default: 99) | "99+" | ✅ `showZero` |
| Chakra UI | ❌ Not built-in | Manual | ❌ |
| HeroUI | ❌ Not built-in | Manual | ❌ |
| Mantine | ❌ Not built-in | Manual | ❌ |
| MUI | ✅ `max` (default: 99) | "99+" | ✅ `showZero` |
| Nuxt UI | ❌ Not built-in | Manual | ❌ |
| PrimeReact | ❌ Not built-in | Manual | ❌ |
| Radix UI | ❌ Not built-in | Manual | ❌ |
| ShadCN | ❌ Not built-in | Manual | ❌ |

**Support Level**: Level 1 (Universal) - all Badge components support numeric content
**Implementation Notes**:
- Only Ant Design and MUI provide built-in overflow handling
- "99+" pattern is industry standard for notification counts
- Most frameworks expect manual implementation for overflow

#### Text Content
**Prevalence**: 10/10 (100%)
**Pattern**: Short text labels/status messages

**Support Level**: Level 1 (Universal)
**Common Patterns**:
- Status text: "New", "Active", "Pending", "Success"
- Category labels: Technology names, keywords
- Feature flags: "Beta", "Premium", "Featured"

**Text Length Considerations**:
- All frameworks optimize for 1-4 character display
- Longer text supported but affects visual consistency
- Some frameworks provide size adjustments for text length

#### Icon Support

**Badge Icon Support**:
| Framework | Icon Support | Implementation |
|-----------|--------------|----------------|
| Ant Design | ❌ No dedicated support | Composition only |
| Chakra UI | ✅ Children composition | Inline icons |
| HeroUI | ❌ Not shown | - |
| Mantine | ✅ `leftSection`/`rightSection` | Dedicated slots |
| MUI | ❌ Not shown | - |
| Nuxt UI | ✅ `icon` prop | Native with positioning |
| PrimeReact | ❌ Not shown | - |
| Radix UI | ❌ Not shown | - |
| ShadCN | ✅ Children composition | Inline icons |
| Semantic UI Classic | ✅ Nested `<i>` elements | Composed icons |

**Tag/Chip Icon Support**:
| Framework | Icon Support | Positioning |
|-----------|--------------|-------------|
| Ant Design | ✅ `icon` prop | Before text |
| Chakra UI v2 | ✅ `TagLeftIcon`/`TagRightIcon` | Left or right |
| Chakra UI v3 | ✅ `Tag.StartElement`/`Tag.EndElement` | Start or end |
| HeroUI | ✅ `startContent`/`endContent` | Dual slots |
| Mantine | ✅ `icon` prop (Chip) | Custom checkmark replacement |
| PrimeReact | ✅ `icon` prop | Adjacent to text |

**Support Level**: Level 2 (Common - 70-89%)
**Pattern Insight**: Tag/Chip components have stronger icon support than Badge components

#### Avatar Support
**Prevalence**: 4/10 frameworks

| Framework | Component | Avatar Support | Implementation |
|-----------|-----------|----------------|----------------|
| Chakra UI | Tag | ✅ | Composition with Avatar component |
| HeroUI | Chip | ✅ | Native `avatar` prop |
| Nuxt UI | Badge | ✅ | Native `avatar` prop |
| Semantic UI Classic | Label | ✅ | `image label` class with `<img>` |

**Support Level**: Level 4 (Occasional - 20-39%)
**Use Cases**: User tags, contact chips, assignee labels

#### Dot Indicator
**Prevalence**: 6/9 Badge implementations (67%)

| Framework | Dot Support | Implementation |
|-----------|-------------|----------------|
| Ant Design | ✅ `dot` prop | Dedicated prop, small circle |
| Chakra UI | ❌ | - |
| HeroUI | ✅ Content-less badge | Empty `content` shows dot |
| Mantine | ❌ | - |
| MUI | ✅ `variant="dot"` | Variant option, 8px circle |
| Nuxt UI | ❌ | - |
| PrimeReact | ✅ `p-badge-dot` class | CSS class pattern |
| Radix UI | ❌ | - |
| ShadCN | ❌ | - |

**Support Level**: Level 2 (Common - 67%)
**Use Cases**: Online/offline status, unread indicator, processing state

---

### 2. Variant Patterns

#### Visual Variant Systems

**4-Variant Systems** (most common):

**Chakra UI Pattern**:
- `solid` - Filled background, high contrast
- `soft`/`subtle` - Light background tint
- `outline` - Border only
- `surface` - Elevated with shadow (v3)

**Nuxt UI Pattern**:
- `solid` - Filled
- `soft` - Subtle tint
- `outline` - Border
- `subtle` - Minimal

**Radix UI Pattern**:
- `solid` - Filled
- `soft` - Subtle (default)
- `surface` - Elevated
- `outline` - Border

**ShadCN Pattern**:
- `default` - Primary filled
- `secondary` - Secondary filled
- `destructive` - Error filled
- `outline` - Border

**7-Variant System**:

**Mantine Badge**:
- `filled` - Solid fill
- `light` - Subtle background
- `outline` - Border only
- `dot` - Dot indicator
- `gradient` - Gradient fill
- `transparent` - Minimal
- `white` - Light backgrounds

**Variant Prevalence Analysis**:

| Variant Type | Frameworks | Prevalence |
|--------------|-----------|------------|
| **Solid/Filled** | 10/10 | 100% (Level 1) |
| **Soft/Light/Subtle** | 8/10 | 80% (Level 1) |
| **Outline/Bordered** | 9/10 | 90% (Level 1) |
| **Dot** | 6/10 | 60% (Level 2) |
| **Surface/Elevated** | 3/10 | 30% (Level 4) |
| **Gradient** | 1/10 | 10% (Level 5) |
| **Transparent** | 2/10 | 20% (Level 4) |

**Recommendation**: 3-4 core variants provide optimal balance
- **Must-have**: Solid, Soft, Outline (90%+ adoption)
- **Should-have**: Dot (60% adoption, important for status)
- **Consider**: Surface, Gradient, Transparent (nice-to-have)

---

### 3. Color Systems

#### Color Philosophy Approaches

**Semantic Color Approach** (predefined types):
- **Ant Design**: 5 status colors (success, error, default, processing, warning)
- **Chakra UI**: 12 theme colors + semantic names
- **MUI**: 7 semantic (default, primary, secondary, error, warning, info, success)
- **PrimeReact**: 4 severity (success, info, warning, danger)

**Theme Palette Approach** (full color access):
- **Nuxt UI**: All theme colors + 7 semantic
- **Radix UI**: Full 12-step color scale, all theme colors
- **Mantine**: All theme colors

**Hybrid Approach**:
- **HeroUI**: 6 semantic colors (default, primary, secondary, success, warning, danger)
- **ShadCN**: Design token system (primary, secondary, destructive, foreground)
- **Semantic UI Classic**: 13 named colors (red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black)

#### Standard Semantic Colors

| Color | Semantic Meaning | Prevalence |
|-------|------------------|------------|
| **Success** / Green | Positive state, completion | 10/10 (100%) |
| **Error** / Danger / Destructive / Red | Error state, critical | 10/10 (100%) |
| **Warning** / Amber / Yellow | Caution, warning | 10/10 (100%) |
| **Info** / Blue | Informational | 9/10 (90%) |
| **Primary** | Brand primary color | 8/10 (80%) |
| **Secondary** | Brand secondary | 7/10 (70%) |
| **Default** / Neutral / Gray | Neutral state | 10/10 (100%) |

**Support Level**: Level 1 (Universal) for success/error/warning/default

#### Color Count by Framework

| Framework | Named Colors | Custom Colors | Total Flexibility |
|-----------|--------------|---------------|-------------------|
| Ant Design | 12 vibrant + 5 status | ✅ Hex | High |
| Chakra UI | 12 theme colors | ✅ Via theme | Very High |
| HeroUI | 6 semantic | ✅ Theme integration | Medium |
| Mantine | All theme colors | ✅ Theme system | Very High |
| MUI | 7 semantic | ✅ Via theme | High |
| Nuxt UI | 7 semantic + theme | ✅ Full theme palette | Very High |
| PrimeReact | 4 severity | ❌ Limited | Low |
| Radix UI | Full theme palette | ✅ 12-step scales | Very High |
| ShadCN | Design tokens | ✅ Tailwind palette | Very High |
| Semantic UI | 13 named | ✅ Via CSS | Medium |

**Pattern Insight**: Modern frameworks trend toward full theme palette access rather than limited predefined colors

---

### 4. Size Systems

#### Size Scale Patterns

**Numeric Scale** (1-3 or similar):
- **Radix UI**: 1, 2, 3 (revised scale)
- **Material Design**: Implicit numeric scaling

**Named Scale** (xs-xl):
- **Ant Design**: xs, sm, md, lg (Badge size)
- **Chakra UI**: xs, sm, md, lg (Badge: 4 sizes)
- **Chakra UI**: sm, md, lg (Tag: 3 sizes)
- **HeroUI**: sm, md, lg (both Badge and Chip)
- **Mantine**: xs, sm, md, lg, xl (Badge)
- **Nuxt UI**: xs, sm, md, lg, xl (Badge)
- **MUI**: No dedicated size prop (contextual)
- **PrimeReact**: default, large, xlarge (Badge)
- **ShadCN**: No built-in size variants
- **Semantic UI**: mini, tiny, small, medium, large, big, huge, massive (8 sizes!)

**Size Prevalence**:

| Size | Frameworks Supporting | Prevalence |
|------|----------------------|------------|
| **Small** | 9/10 | 90% (Level 1) |
| **Medium** | 9/10 | 90% (Level 1) |
| **Large** | 9/10 | 90% (Level 1) |
| **Extra Small** | 6/10 | 60% (Level 2) |
| **Extra Large** | 4/10 | 40% (Level 3) |

**Recommendation**: 3-5 size scale optimal
- **Core**: small, medium, large (90% adoption)
- **Extended**: xs, xl for special cases
- **Semantic UI approach**: 8 sizes is excessive but shows comprehensive scaling

---

### 5. Positioning & Overlay Patterns

#### Overlay/Badge Positioning

**Frameworks with Overlay Support**:
- **Ant Design**: Wraps children, default top-right
- **MUI**: Wraps children, `anchorOrigin` prop (4 positions)
- **HeroUI**: Wraps children, `placement` prop (4 corners)
- **PrimeReact**: `p-overlay-badge` wrapper class
- **Semantic UI Classic**: `floating label` (requires `position: relative`)

**Position Options**:
| Position | Ant Design | MUI | HeroUI | Prevalence |
|----------|-----------|-----|--------|------------|
| Top-right | ✅ Default | ✅ | ✅ | 5/5 (100%) |
| Top-left | ❌ | ✅ | ✅ | 3/5 (60%) |
| Bottom-right | ❌ | ✅ | ✅ | 3/5 (60%) |
| Bottom-left | ❌ | ✅ | ✅ | 3/5 (60%) |

**MUI Unique Features**:
- **Overlap modes**: `circular` vs `rectangular` (adjusts offset based on child shape)
- **Precise positioning**: Calculates offsets for optimal visibility

**Support Level**: Level 2 (Common - 50%) for overlay positioning
**Pattern**: Only half of frameworks support overlay/wrapper pattern

#### Semantic UI Classic Unique Positioning

**9 Positioning Types** (most comprehensive):
1. **Corner labels**: Anchored to container corners
2. **Ribbon labels**: Attached to edges with ribbon effect
3. **Attached labels**: Fixed to segment edges (top/bottom/corners)
4. **Floating labels**: Overlaid badge-style
5. **Pointing labels**: Directional arrows (left/right/above/below)
6. **Horizontal labels**: Inline with content flow
7. **Tag labels**: Tag-style standalone
8. **Image labels**: With avatar/image
9. **Circular labels**: Badge circles

**Support Level**: Level 5 (Unique) - no other framework approaches this positioning variety

---

### 6. Interactive Patterns

#### Closeable/Removable

**Tag/Chip Closeable Support**:
| Framework | Closeable | Implementation | Event |
|-----------|-----------|----------------|-------|
| Ant Design | ✅ | `closable` prop | `onClose` |
| Chakra UI v2 | ✅ | `TagCloseButton` | `onClick` |
| Chakra UI v3 | ✅ | `Tag.CloseTrigger` | `onClick` |
| HeroUI | ✅ | `onClose` prop | Auto close button |
| Mantine | ❌ | Not built-in | - |
| PrimeReact | ❌ | Not built-in | Manual |
| Semantic UI | ✅ | Delete icon `<i class="delete icon"></i>` | Manual JS |

**Support Level**: Level 2 (Common - 57% of Tag implementations)

**Badge Closeable Support**: None (badges are typically non-interactive overlays)

#### Pressable/Clickable Chips

**Mantine Chip** (unique interactive model):
- Built on native checkbox/radio inputs
- **Controlled**: `checked` + `onChange`
- **Uncontrolled**: `defaultChecked`
- **Chip.Group**: Manages single or multiple selection
- **Use case**: Interactive filters, multi-select, toggle controls

**HeroUI Chip**:
- **Press events**: `onPress`, `onPressStart`, `onPressEnd`, `onPressChange`, `onPressUp`
- **Mobile-first**: React Aria `usePress` hook
- **Combined**: Can be both pressable and closeable

**Support Level**: Level 3 (Moderate - 33% of Chip implementations have dedicated press handling)

---

### 7. Component Architecture Patterns

#### Single Component

**Frameworks**: 3
- **Semantic UI Classic**: `Label` handles all use cases
- **Nuxt UI**: `Badge` serves badge + tag
- **ShadCN**: `Badge` dual-purpose

**Advantages**:
- Simpler API surface
- Shared props/variants
- Single import

**Disadvantages**:
- Less semantic clarity
- Mixed use case patterns
- Potential API bloat

#### Compound Components (Chakra v3 Pattern)

**Chakra UI v3 Tag**:
```jsx
<Tag.Root>
  <Tag.StartElement><Icon /></Tag.StartElement>
  <Tag.Label>Text</Tag.Label>
  <Tag.EndElement>
    <Tag.CloseTrigger />
  </Tag.EndElement>
</Tag.Root>
```

**Advantages**:
- Explicit structure
- Clear semantic roles
- TypeScript-friendly
- Flexible composition

**Support Level**: Level 3 (Moderate - only Chakra v3 uses this extensively for Tag)

#### Separate Components

**Frameworks**: 5 (Ant Design, Chakra, HeroUI, Mantine, PrimeReact)

**Badge typically**:
- Wrapper/overlay pattern
- Numeric content focused
- Non-interactive
- Status indication

**Tag/Chip typically**:
- Standalone/inline
- Text content focused
- Interactive (closeable/selectable)
- Categorization

---

### 8. Special Features Analysis

#### Ribbon Variant
**Prevalence**: 2/10 frameworks
- **Ant Design**: `Badge.Ribbon` component
- **Semantic UI Classic**: `ribbon label` class

**Support Level**: Level 5 (Rare - 20%)
**Use Cases**: Featured items, promotional tags, section headers
**Pattern**: Decorative ribbon extending from card/segment edge

#### Gradient Support
**Prevalence**: 2/10 frameworks
- **Mantine**: `variant="gradient"` with `from`/`to`/`deg` props
- **ShadCN**: Via Tailwind gradient utilities

**Support Level**: Level 5 (Rare - 20%)

#### High Contrast Mode
**Prevalence**: 1/10 frameworks
- **Radix UI**: `highContrast` boolean prop

**Support Level**: Level 5 (Rare - 10%)
**Purpose**: Accessibility enhancement, WCAG compliance

#### Auto Contrast
**Prevalence**: 1/10 frameworks
- **Mantine**: `autoContrast` prop adjusts text color automatically

**Support Level**: Level 5 (Rare - 10%)
**Purpose**: Ensures readable contrast without manual color pairing

#### Contextual Sizing
**Prevalence**: 2/10 frameworks
- **MUI**: Scales based on parent element
- **Semantic UI Classic**: Scales within headings

**Support Level**: Level 5 (Rare - 20%)
**Pattern**: Badge automatically adapts size to context

#### Detail/Secondary Text
**Prevalence**: 2/10 frameworks
- **Ant Design**: Nested detail content in Tag
- **Semantic UI Classic**: `<div class="detail">` pattern

**Support Level**: Level 5 (Rare - 20%)
**Use Cases**: Count displays, metadata, sub-labels

---

### 9. Accessibility Patterns

#### ARIA Support

**Explicit Accessibility Features**:
| Framework | Feature | Implementation |
|-----------|---------|----------------|
| Chakra UI | Focus management | Built-in for closeable tags |
| Chakra UI | Keyboard support | Enter/Space for close triggers |
| HeroUI | Keyboard accessible | Press events via React Aria |
| Mantine | Form control accessibility | Native input foundation (Chip) |
| MUI | Screen reader support | `aria-hidden` when invisible |
| Radix UI | High contrast mode | `highContrast` prop |

**Support Level**: Level 2 (Common - most frameworks mention accessibility)

**Common Patterns**:
- Close buttons need `aria-label`
- Pressable badges should use `aria-pressed`
- Color should not be sole indicator
- Screen reader announcement of badge content

---

### 10. Advanced Composition Patterns

#### AsChild / Polymorphic Rendering

**Frameworks with Polymorphic Support**:
- **Mantine Badge**: `component` prop (render as any element)
- **Radix UI**: `asChild` prop (Slot pattern)
- **ShadCN**: `asChild` prop (Radix Slot)
- **Semantic UI Classic**: Semantic HTML (`<a>`, `<div>`, etc.)

**Support Level**: Level 3 (Moderate - 40%)

**Pattern**:
```typescript
// Instead of wrapper div
<Badge asChild>
  <a href="/profile">Profile Badge</a>
</Badge>
```

#### Slot-Based Composition

**Frameworks with Named Slots**:
- **Nuxt UI**: `#leading`, `#trailing`, default
- **HeroUI Chip**: `startContent`, `endContent`, `avatar`
- **Mantine Badge**: `leftSection`, `rightSection`

**Support Level**: Level 3 (Moderate - 30%)

---

## Cross-Framework Pattern Summary

### Universal Patterns (Level 1: 90-100% adoption)

1. **Text content support** - 10/10 (100%)
2. **Color variants** - 10/10 (100%)
   - Success/green: 100%
   - Error/red: 100%
   - Warning/yellow: 100%
   - Default/neutral: 100%
3. **Solid variant** - 10/10 (100%)
4. **Soft/light variant** - 8/10 (80%)
5. **Outline variant** - 9/10 (90%)
6. **Size variants** - 9/10 (90%)
   - Small: 90%
   - Medium: 90%
   - Large: 90%
7. **Numeric content** (Badge) - 9/9 (100%)

### Common Patterns (Level 2: 70-89% adoption)

1. **Icon support** - 7/10 (70%)
2. **Dot variant** - 6/9 Badge (67%)
3. **Closeable tags** - 4/7 Tag implementations (57%)
4. **Explicit size props** - 7/10 (70%)

### Moderate Patterns (Level 3: 40-69% adoption)

1. **Overlay positioning** - 5/10 (50%)
2. **Avatar support** - 4/10 (40%)
3. **Polymorphic rendering** - 4/10 (40%)
4. **Named slots** - 3/10 (30%)

### Occasional Patterns (Level 4: 20-39% adoption)

1. **Surface/elevated variant** - 3/10 (30%)
2. **Extra small size** - 6/10 (60%)
3. **Extra large size** - 4/10 (40%)

### Rare Patterns (Level 5: <20% adoption)

1. **Ribbon variant** - 2/10 (20%)
2. **Gradient support** - 2/10 (20%)
3. **High contrast mode** - 1/10 (10%)
4. **Auto contrast** - 1/10 (10%)
5. **Contextual sizing** - 2/10 (20%)
6. **Detail/secondary text** - 2/10 (20%)
7. **Max count overflow** - 2/9 Badge (22%)
8. **Show zero** - 2/9 Badge (22%)

---

## Key Insights

### 1. Badge vs Tag Separation is Not Universal

**50% of frameworks** separate Badge from Tag/Chip, **30% unify** them, **20% provide Badge only**.

**Arguments for Separation**:
- Clear semantic distinction (notification vs categorization)
- Different interaction patterns (overlay vs inline, non-interactive vs closeable)
- Prevents API bloat from mixed concerns

**Arguments for Unification**:
- Reduces component count
- Shared visual styling
- Flexible use case adaptation
- Simpler mental model

**Recommendation**: Semantic UI should consider **separation** to maintain semantic clarity and natural language naming benefits.

### 2. Variant Systems Converge on 3-4 Core Options

**Optimal set**:
- **Solid/Filled**: High emphasis (100% adoption)
- **Soft/Light**: Medium emphasis (80% adoption)
- **Outline**: Low emphasis (90% adoption)
- **Dot** (Badge only): Minimal indicator (67% Badge adoption)

Additional variants (surface, gradient, transparent) are nice-to-have but not essential.

### 3. Color Systems Trend Toward Theme Integration

**Evolution**:
- Early frameworks: Predefined semantic colors only
- Modern frameworks: Full theme palette access + semantic names

**Recommendation**: Provide both semantic shortcuts (success/error/warning/info) AND full theme color access for flexibility.

### 4. Icon Support is Expected in Tags, Optional in Badges

**Tag/Chip**: 86% have icon support (6/7 implementations)
**Badge**: 40% have explicit icon support (4/10 implementations)

**Pattern**: Tags are more content-rich; badges are more minimalist

### 5. Overlay Positioning is Not Standard

Only **5/10 frameworks** (50%) provide overlay/wrapper patterns for badges. The other half treat badges as standalone inline elements.

**Implication**: "Badge" means different things:
- Overlay notification (Ant Design, MUI, HeroUI)
- Standalone label (Nuxt UI, Radix UI, ShadCN)
- Both (Semantic UI Classic via floating label)

### 6. Interactive Patterns Vary Significantly

**Non-interactive** (traditional badges): Most Badge implementations
**Closeable** (removable tags): 57% of Tag implementations
**Selectable** (form controls): Only Mantine Chip, HeroUI Chip

**Recommendation**: Closeable is expected for tags; badges should remain non-interactive (except when composed as links).

### 7. Size Systems: 3-5 Sizes Optimal

**Semantic UI Classic's 8 sizes** is an outlier. Most frameworks settle on **3-5 sizes**.

**Common patterns**:
- 3 sizes: sm, md, lg (minimal)
- 5 sizes: xs, sm, md, lg, xl (comprehensive)

### 8. Advanced Features are Rare

**Features found in <30% of frameworks**:
- Ribbon styling
- Gradient fills
- High contrast modes
- Auto contrast
- Contextual sizing
- Detail/secondary text
- Overflow count handling

**Implication**: These are differentiators, not table stakes

### 9. Accessibility Varies Widely

Only **Chakra UI**, **HeroUI**, **Mantine**, **MUI**, and **Radix UI** explicitly document accessibility features.

**Common needs**:
- Focus management for closeable tags
- Keyboard support (Enter/Space)
- ARIA labels for icon-only badges
- Color + text (not color alone)
- Screen reader announcements

### 10. Semantic UI Classic's Comprehensive Approach is Unique

**9 positioning types**, **8 sizes**, **unified Badge/Tag/Label** - no other framework approaches this level of comprehensiveness.

**Lesson**: Semantic UI's strength is breadth of use cases. Modern implementation should preserve this while modernizing API.

---

## Recommendations for Semantic UI Implementation

### Component Structure Decision

**Option A: Unified `ui-label` Component** (like Semantic UI Classic)
- Single component handles badges, tags, labels
- Settings determine behavior (`overlay`, `tag`, `ribbon`, `pointing`, etc.)
- Advantages: Preserves classic API, familiar to existing users
- Disadvantages: Large API surface, mixed concerns

**Option B: Separate `ui-badge` and `ui-tag`** (like Ant Design)
- `ui-badge`: Overlay notifications, counts, status dots
- `ui-tag`: Standalone labels, closeable chips, categories
- Advantages: Clear semantics, focused APIs, natural language clarity
- Disadvantages: Two components to learn/maintain

**Option C: Hybrid** (recommended)
- **`ui-badge`**: Notification counts, overlays, status indicators
  - Supports: overlay positioning, numeric content, dot variant, sizes, colors
- **`ui-tag`**: Categorization, labels, closeable chips
  - Supports: icons, closeable, variants, sizes, colors
- **`ui-label`**: General labeling (simple wrapper/alias for tag?)
  - Or: Semantic UI Classic comprehensive positioning types as advanced tag settings

**Recommendation**: **Option C (Hybrid)** balances semantic clarity with familiar naming.

### Must-Have Features (Level 1)

#### `ui-badge`
1. **Content**:
   - Numeric display
   - Text display (short)
   - Dot variant (no content)
2. **Variants**:
   - Solid (filled)
   - Soft (subtle background)
   - Outline (border only)
3. **Colors**:
   - Semantic: success, error, warning, info, default
   - Theme integration: all theme colors accessible
4. **Sizes**: sm, md, lg minimum
5. **Overlay positioning**: Top-right default (like notifications)

#### `ui-tag`
1. **Content**:
   - Text
   - Icon support (leading/trailing)
2. **Variants**:
   - Solid
   - Soft
   - Outline
3. **Colors**: Same as badge
4. **Sizes**: sm, md, lg minimum
5. **Closeable**: Close icon with `onClose` event

### Should-Have Features (Level 2)

#### `ui-badge`
1. Max count overflow ("99+")
2. Show zero option
3. Additional sizes: xs, xl
4. Positioning: all 4 corners (top-right, top-left, bottom-right, bottom-left)
5. Overlap mode (circular vs rectangular)

#### `ui-tag`
1. Avatar support
2. Multiple icon slots (start + end)
3. Rounded variant (pill shape)
4. Additional sizes: xs, xl

### Consider Features (Level 3-5)

1. **Ribbon variant** (Semantic UI Classic heritage)
2. **Pointing variant** (Semantic UI Classic heritage - useful for validation)
3. **Attached positioning** (Semantic UI Classic heritage)
4. **Corner labels** (Semantic UI Classic heritage)
5. **Gradient fills**
6. **High contrast mode**
7. **Detail/secondary text**
8. **Interactive chips** (selectable/checkable)

### API Design Recommendations

#### Natural Language Settings

```html
<!-- Badge -->
<ui-badge count="5" color="error">
  <ui-icon name="bell"></ui-icon>
</ui-badge>

<ui-badge dot color="success" position="bottom-right">
  <ui-avatar src="user.jpg"></ui-avatar>
</ui-badge>

<ui-badge .settings="{ variant: 'soft', color: 'primary', size: 'sm' }">
  New
</ui-badge>

<!-- Tag -->
<ui-tag color="info" closeable>
  Category
</ui-tag>

<ui-tag icon="check" color="success" variant="outline">
  Verified
</ui-tag>

<ui-tag .settings="{ avatar: { src: 'user.jpg' }, closeable: true }">
  John Doe
</ui-tag>
```

#### Slot-Based Composition

```html
<!-- Badge with custom content -->
<ui-badge color="primary">
  {#slot}
    <ui-icon name="star"></ui-icon>
    Featured
  {/slot}
</ui-badge>

<!-- Tag with icon slots -->
<ui-tag color="blue">
  {#slot leading}
    <ui-icon name="code"></ui-icon>
  {/slot}
  TypeScript
  {#slot trailing}
    <ui-icon name="x" @click="handleClose"></ui-icon>
  {/slot}
</ui-tag>
```

#### Settings Architecture

```javascript
defineComponent({
  name: 'ui-badge',
  defaultSettings: {
    variant: 'solid',    // solid | soft | outline | dot
    color: 'default',    // semantic colors + theme colors
    size: 'md',          // xs | sm | md | lg | xl
    position: 'top-right', // top-right | top-left | bottom-right | bottom-left
    overlap: 'rectangular', // rectangular | circular
    showZero: false,
    max: 99
  }
})

defineComponent({
  name: 'ui-tag',
  defaultSettings: {
    variant: 'solid',    // solid | soft | outline
    color: 'default',
    size: 'md',
    icon: null,          // icon name
    iconPosition: 'leading', // leading | trailing
    closeable: false,
    rounded: false       // pill shape
  }
})
```

---

## Conclusion

This research reveals significant diversity in how modern UI frameworks approach label/badge/tag components. The key strategic decision for Semantic UI is whether to maintain the classic unified approach or adopt the modern separated pattern.

**Key Findings**:
1. No consensus on Badge vs Tag separation (50% separate, 30% unified, 20% badge-only)
2. Strong consensus on core variants (solid, soft, outline) and semantic colors
3. Icon support expected in tags, optional in badges
4. Overlay positioning important for notification badges
5. Closeable behavior expected for categorization tags
6. 3-5 size scale is optimal
7. Advanced features (ribbon, gradient, etc.) are differentiators, not requirements

**Strategic Recommendation**:
Implement **separate `ui-badge` and `ui-tag` components** with optional **`ui-label` as comprehensive advanced variant** preserving Semantic UI Classic's unique positioning features (ribbon, pointing, corner, attached). This balances modern semantic clarity with classic comprehensive functionality.

**Implementation Priority**:
1. **Phase 1**: Core Badge (overlay, counts, dot) + Core Tag (text, closeable, icons)
2. **Phase 2**: Advanced positioning (ribbon, pointing, corner) as `ui-label` or tag settings
3. **Phase 3**: Polish features (gradients, high contrast, detail text)

This approach positions Semantic UI as both **modern** (clear badge/tag separation) and **comprehensive** (preserving classic advanced features).

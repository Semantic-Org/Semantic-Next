# Component Pattern Research: Avatar

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 12
- Date: 2025-11-05
- Unique patterns identified: 40+
- Research methodology: Descriptive analysis of official documentation from production UI frameworks

## Component Definition Consensus

Across all 12 frameworks, avatars are consistently defined as:

**Core Purpose**: A visual representation of a user or entity, typically displayed as a circular or square image, initials, or icon. Used to provide quick visual identification in user interfaces.

**Mental Model**: Users conceptualize avatars as "profile pictures" or "user badges" - a compact, recognizable visual identifier that represents a person, account, or entity in the interface.

**Semantic Meaning**: Communicates:
- User identity and presence
- Profile representation in social contexts
- Visual hierarchy in user lists
- Status or role through badges/indicators
- Placeholder for missing profile images

## Terminology Variations

### Component Names
- **Avatar**: 11 frameworks (universal term)
- **Image (with avatar class)**: 1 framework (Semantic UI Classic)

### Architectural Terms
- **Avatar + AvatarGroup**: 8 frameworks (Ant Design, Chakra UI, HeroUI, Mantine, MUI, PrimeReact, Shadcn UI, Vuetify)
- **Avatar.Root/Image/Fallback**: 2 frameworks (Radix Primitives, Shadcn UI - composition pattern)
- **Compound components**: Avatar.Group (Mantine), AvatarGroup (MUI, Chakra UI)

### Prop Names: Content
- **src**: 12/12 frameworks (universal for image source)
- **alt**: 12/12 frameworks (universal for accessibility)
- **name**: 6/12 frameworks (auto-generate initials - Chakra UI, HeroUI, Mantine, Nuxt UI, Radix Themes, others)
- **icon**: 8/12 frameworks (dedicated icon support)
- **children**: 12/12 frameworks (custom content via composition)

### Prop Names: Shape
- **shape**: 4/12 (Ant Design, HeroUI, PrimeReact - circle/square)
- **radius/rounded**: 5/12 (Chakra UI, HeroUI, Mantine, Radix Themes, custom)
- **circular/square**: 3/12 (MUI, Semantic UI, Vuetify - boolean or string)
- **tile**: 1/12 (Vuetify - for square shape)

### Prop Names: Size
- **size**: 10/12 frameworks (string presets or numeric)
- **width/height**: 2/12 (Vuetify, custom CSS)
- Size range varies: 3-8 predefined sizes across frameworks

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Image display | Primary profile photo/picture | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Text/Initials | Display user initials or short text | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI |
| Icon fallback | Icon when no image available | 10/12 (83%) | Level 2 (Common) | Native | All except Semantic UI, Vuetify |
| Auto-initials generation | Extract initials from name prop | 6/12 (50%) | Level 3 (Moderate) | Native | Chakra UI, HeroUI, Mantine, Nuxt UI, Radix Themes, Shadcn UI |
| Fallback cascade | Priority-based fallback system | 10/12 (83%) | Level 2 (Common) | Native | Most frameworks |
| Custom content | Arbitrary React/Vue nodes | 12/12 (100%) | Level 1 (Universal) | Composed | All frameworks |
| Placeholder | Generic user placeholder | 8/12 (67%) | Level 2 (Common) | Native | Most frameworks |

### Architectural Patterns

| Pattern | Description | Prevalence | Usage Level | Details | Frameworks |
|---------|-------------|------------|-------------|---------|------------|
| Single component | Standalone Avatar component | 12/12 (100%) | Level 1 (Universal) | Core pattern | All frameworks |
| Group component | Dedicated component for multiple avatars | 8/12 (67%) | Level 2 (Common) | AvatarGroup pattern | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Shadcn UI |
| Composition pattern | Root/Image/Fallback structure | 2/12 (17%) | Level 4 (Occasional) | Radix pattern | Radix Primitives, Shadcn UI |
| Slot-based | Vue slots for content | 2/12 (17%) | Level 4 (Occasional) | Vue pattern | Nuxt UI, Vuetify |

### Shape Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Circle | Circular avatar (default) | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Square | Sharp corners | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI (uses circular class) |
| Rounded | Soft corners between circle/square | 9/12 (75%) | Level 2 (Common) | Native | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix Themes, Shadcn UI, Vuetify |
| Custom radius | Fine-grained corner control | 6/12 (50%) | Level 3 (Moderate) | Native/CSS | Chakra UI, Mantine, Radix Themes, Shadcn UI, others |

### Size Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Predefined sizes | Named size presets (xs/sm/md/lg/xl) | 10/12 (83%) | Level 2 (Common) | Native | All except Semantic UI, Vuetify |
| 3 sizes | Small/Medium/Large | 3/12 (25%) | Level 4 (Occasional) | Native | Ant Design (partial), PrimeReact, Semantic UI |
| 5 sizes | xs through xl | 3/12 (25%) | Level 4 (Occasional) | Native | Chakra UI, Mantine, MUI (via theme) |
| 6-7 sizes | Extended range | 2/12 (17%) | Level 5 (Rare) | Native | HeroUI, Nuxt UI (3xs-3xl) |
| 8 sizes | Maximum granularity | 1/12 (8%) | Level 5 (Rare) | Native | Radix Themes (1-8) |
| Custom sizing | Numeric or CSS values | 12/12 (100%) | Level 1 (Universal) | Native/CSS | All frameworks |
| Responsive sizing | Breakpoint-based sizes | 4/12 (33%) | Level 4 (Occasional) | Native | Ant Design, Chakra UI, HeroUI, Radix Themes |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Loading state | Display while image loads | 11/12 (92%) | Level 1 (Universal) | Native | All except Semantic UI |
| Error/fallback | Handle failed image loads | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Status badge | Online/offline/busy indicator | 8/12 (67%) | Level 2 (Common) | Native/Composed | Ant Design, Chakra UI, HeroUI, MUI, Nuxt UI, PrimeReact, Shadcn UI, Vuetify |
| Notification badge | Count or alert indicator | 7/12 (58%) | Level 3 (Moderate) | Composed | Badge component integration |
| Disabled state | Non-interactive appearance | 2/12 (17%) | Level 4 (Occasional) | Native | HeroUI, Nuxt UI |
| Active/selected | Highlight selected avatar | 3/12 (25%) | Level 4 (Occasional) | CSS-only | Manual styling |

### Group Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Stacked/overlapping | Avatars overlap each other | 8/12 (67%) | Level 2 (Common) | Native | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Shadcn UI |
| Max count with overflow | Show "+N" for excess avatars | 7/12 (58%) | Level 3 (Moderate) | Native | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact |
| Spacing control | Gap between stacked avatars | 8/12 (67%) | Level 2 (Common) | Native | Group components |
| Popover on overflow | Click "+N" to see all | 2/12 (17%) | Level 4 (Occasional) | Native | Ant Design, MUI (renderSurplus) |
| Grid layout | Avatars in grid formation | 3/12 (25%) | Level 4 (Occasional) | CSS/Composed | HeroUI, Nuxt UI, custom |
| Horizontal list | Side-by-side without overlap | 4/12 (33%) | Level 4 (Occasional) | CSS/Composed | Various |

### Color Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Theme colors | Semantic color palette | 7/12 (58%) | Level 3 (Moderate) | Native | Chakra UI, HeroUI, MUI, Nuxt UI, Radix Themes, Vuetify, Mantine |
| Auto-generated colors | Deterministic color from name | 2/12 (17%) | Level 4 (Occasional) | Native | HeroUI, Mantine (color="initials") |
| Custom background | Specify fallback color | 10/12 (83%) | Level 2 (Common) | Native/CSS | Most frameworks |
| Gradient backgrounds | Multi-color gradients | 2/12 (17%) | Level 4 (Occasional) | CSS/Composed | MUI, custom styling |
| Variant styles | Solid/light/outline styles | 2/12 (17%) | Level 4 (Occasional) | Native | Mantine, Radix Themes |

### Border & Ring Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Border/ring | Outline around avatar | 9/12 (75%) | Level 2 (Common) | Native/CSS | Most frameworks |
| Border color | Custom border colors | 7/12 (58%) | Level 3 (Moderate) | Native/CSS | Various |
| Border width | Adjustable border thickness | 6/12 (50%) | Level 3 (Moderate) | CSS | Various |
| Automatic group borders | Borders on stacked avatars | 3/12 (25%) | Level 4 (Occasional) | Native | Chakra UI, Shadcn UI, others |
| Ring offset | Space between avatar and ring | 2/12 (17%) | Level 4 (Occasional) | CSS | Tailwind-based frameworks |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Clickable | Avatar as button/link | 12/12 (100%) | Level 1 (Universal) | Composed | All frameworks |
| Hover effects | Visual feedback on hover | 10/12 (83%) | Level 2 (Common) | CSS | Most frameworks |
| Tooltip integration | Show name/info on hover | 9/12 (75%) | Level 2 (Common) | Composed | Most frameworks |
| Upload/change | Update profile picture | 4/12 (33%) | Level 4 (Occasional) | Composed | Chakra UI, HeroUI, Nuxt UI, custom |
| AsChild/polymorphic | Render as different element | 3/12 (25%) | Level 4 (Occasional) | Native | Nuxt UI, Radix Primitives, Shadcn UI |
| Drag and drop | Reorder avatars | 1/12 (8%) | Level 5 (Rare) | Custom | Ant Design (documented) |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Support Type | Frameworks |
|---------|-------------|------------|-------------|--------------|------------|
| Alt text | Required image alt attribute | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| ARIA labels | Additional screen reader context | 10/12 (83%) | Level 2 (Common) | Native | Most frameworks |
| Semantic HTML | img element for images | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |
| Color contrast | WCAG compliant fallback colors | 8/12 (67%) | Level 2 (Common) | Native | Most frameworks |
| Focus indicators | Visible focus states | 10/12 (83%) | Level 2 (Common) | Native | Most frameworks |
| Keyboard navigation | Tab to focus, enter to activate | 12/12 (100%) | Level 1 (Universal) | Native | All frameworks |

## Notable Patterns

### Highly Adopted (Level 1-2: 70%+)

These patterns represent established standards in avatar implementation:

**Universal Patterns (100%)**:
- Image display with src/alt props
- Fallback handling for failed/missing images
- Custom content via children/composition
- Circular shape (default)
- Clickable/interactive support
- Accessibility via alt text and semantic HTML
- Keyboard navigation support

**Near-Universal Patterns (83-92%)**:
- Text/initials display
- Icon fallback
- Predefined size variants
- Square shape option
- Loading state handling
- Custom background colors
- Hover effects
- ARIA labels and focus indicators

**Common Patterns (67-83%)**:
- Rounded shape variant
- Avatar group/stacking
- Status badge integration
- Spacing control in groups
- Theme color integration
- Tooltip integration
- Color contrast compliance
- Border/ring styling

### Emerging Patterns (Level 3-4: 20-69%)

These patterns show moderate adoption and may be evolving best practices:

**Moderate Adoption (40-69%)**:
- Max count with overflow indicator (58%)
- Notification badge support (58%)
- Custom border colors (58%)
- Auto-initials from name prop (50%)
- Custom radius control (50%)
- Border width control (50%)

**Occasional Adoption (20-39%)**:
- Upload/change functionality (33%)
- Responsive sizing (33%)
- Horizontal list layout (33%)
- Automatic group borders (25%)
- AsChild/polymorphic rendering (25%)
- Grid layout (25%)
- Active/selected state (25%)
- 5-size system (25%)

### Unique Innovations (Level 5: <20%)

These patterns are framework-specific innovations or niche features:

**Size Systems**:
- **Radix Themes**: 8-level size scale (1-8) for maximum granularity
- **Nuxt UI**: 9 sizes (3xs through 3xl) for extended range
- **Ant Design**: Responsive size objects with breakpoints

**Auto-Generation Features**:
- **Mantine**: Deterministic color hashing from name (`color="initials"`)
- **HeroUI**: Random WCAG AA-compliant colors for auto-initials
- **Chakra UI**: Smart initials extraction from full names

**Advanced Fallback Systems**:
- **Ant Design**: Priority-based fallback (icon > children > alt)
- **Radix Primitives**: Delayed fallback with `delayMs` to prevent flash
- **Shadcn UI**: Loading status callbacks with `onLoadingStatusChange`

**Group Features**:
- **Ant Design**: Popover integration for overflow avatars
- **MUI**: Custom `renderSurplus` callback for formatting "+N"
- **Chakra UI**: Automatic border calculation for stacked avatars

**Composition Patterns**:
- **Radix Primitives**: Three-part Avatar.Root/Image/Fallback
- **Nuxt UI**: Status chip with inset mode and 4-corner positioning
- **Mantine**: Restricted color palettes via `allowedInitialsColors`

**Semantic UI Classic**:
- Avatar as Image element variation (not standalone component)
- Inline formatting focus
- Class-based API instead of props

## Pattern Correlations

### Co-occurring Patterns

When these patterns appear together, they often form coherent feature sets:

**Image + Fallback System** (appears together in 12/12 frameworks):
- When Image display exists → Fallback handling in 12/12 frameworks
- When Auto-initials exists → Fallback cascade in 6/6 frameworks
- When Icon fallback exists → Loading state in 10/10 frameworks

**Size + Shape Control** (appears together in 10/12 frameworks):
- When Size variants exist → Shape options in 10/10 frameworks
- When Custom sizing exists → Custom radius in 6/12 frameworks
- When Responsive sizing exists → Theme integration in 4/4 frameworks

**Group Features Clustering**:
- Stacking + Max count + Overflow: 7 frameworks (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact)
- Stacking + Spacing control + Borders: 8 frameworks (group component pattern)
- Overflow + Popover/Tooltip: 5 frameworks (MUI, Ant Design, others)

**Status Indicator Sets**:
- Badge + Color + Position: 8 frameworks (status indicator pattern)
- Badge + Tooltip + Click: 6 frameworks (interactive status)
- Online/offline + Notification count: 5 frameworks (dual badge system)

**Accessibility Feature Sets**:
- Alt + ARIA + Focus: Universal (12/12)
- Alt + Color contrast + Semantic HTML: 8+ frameworks
- Keyboard + Screen reader + WCAG: 10+ frameworks

### Mutually Exclusive Patterns

Certain patterns rarely appear together, suggesting different design philosophies:

**Composition vs Configuration** (implementation preference):
- Radix Primitives' Root/Image/Fallback vs single Avatar component
- Prop-based configuration vs slot-based composition
- Trade-off: flexibility vs simplicity

**Size System Philosophies**:
- Fixed presets (3-5 sizes) vs granular scale (8 levels)
- Named sizes (xs/sm/md) vs numeric (1-8)
- Responsive objects vs single value

**Fallback Strategies**:
- Auto-generate initials vs manual specification
- Priority cascade vs simple fallback
- Delayed rendering vs immediate display

**Group Implementation**:
- Dedicated AvatarGroup component vs CSS-only stacking
- Built-in overflow handling vs manual composition
- Automatic spacing vs manual gaps

## Implementation Notes

### Architectural Approaches

**Single Component Pattern (10/12 frameworks)**:
- **Avatar**: Self-contained component with all functionality
- **Benefits**: Simple API, easy to use, single import
- **Trade-offs**: Less granular control, prop-heavy API

**Group Component Pattern (8/12 frameworks)**:
- **AvatarGroup + Avatar**: Separate component for groups
- **Benefits**: Specialized group features, cleaner individual Avatar API
- **Trade-offs**: Additional component to learn, parent-child coordination

**Composition Pattern (2/12 frameworks)**:
- **Avatar.Root/Image/Fallback**: Radix Primitives approach
- **Benefits**: Maximum flexibility, explicit control flow
- **Trade-offs**: More verbose, steeper learning curve

**Image Element Variation (1/12 frameworks)**:
- **Semantic UI**: Avatar as image class modifier
- **Benefits**: Simple, reuses existing image component
- **Trade-offs**: Limited features, no dedicated API

### Content Management Strategies

**Fallback Priority Systems**:
```
// Ant Design approach
<Avatar src="image.jpg" icon={<UserOutlined />}>
  Fallback Text
</Avatar>
// Priority: src → icon → children → alt[0]

// Radix/Shadcn approach
<Avatar>
  <AvatarImage src="image.jpg" />
  <AvatarFallback>FT</AvatarFallback>
</Avatar>
// Explicit fallback composition

// Auto-initials approach (Mantine, HeroUI)
<Avatar name="John Doe" src="image.jpg" />
// Auto-generates "JD" if image fails
```

**Loading State Management**:
```
// Automatic (most frameworks)
<Avatar src="image.jpg" />
// Handles loading internally

// With callbacks (Radix, Shadcn)
<Avatar onLoadingStatusChange={(status) => console.log(status)} />

// With delay to prevent flash (Radix Primitives)
<AvatarFallback delayMs={600}>JD</AvatarFallback>
```

### Size System Patterns

**Named Presets (10/12 frameworks)**:
```jsx
// 3-size system
<Avatar size="small" />  // PrimeReact
<Avatar size="large" />

// 5-size system
<Avatar size="xs" />     // Chakra UI, Mantine
<Avatar size="xl" />

// 7-size system
<Avatar size="3xs" />    // Nuxt UI
<Avatar size="3xl" />

// 8-level system
<Avatar size="1" />      // Radix Themes
<Avatar size="8" />
```

**Responsive Sizing**:
```jsx
// Ant Design
<Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80 }} />

// Radix Themes
<Avatar size={{ initial: "2", md: "4", lg: "6" }} />

// Chakra UI
<Avatar size={{ base: "sm", md: "md", lg: "lg" }} />
```

### Group Implementation Patterns

**Stacking with Overflow**:
```jsx
// With max count
<AvatarGroup max={3}>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
  <Avatar src="user4.jpg" />  // Shows as "+2"
  <Avatar src="user5.jpg" />
</AvatarGroup>

// With custom overflow rendering (MUI)
<AvatarGroup
  max={4}
  total={24}
  renderSurplus={(surplus) => <Avatar>+{surplus}k</Avatar>}
/>

// With popover (Ant Design)
<Avatar.Group maxCount={2} maxPopoverTrigger="click">
```

**Spacing Control**:
```jsx
// Dedicated spacing prop
<AvatarGroup spacing="medium" />  // Chakra UI
<AvatarGroup spacing={-8} />      // MUI (negative for overlap)

// Via CSS
<div style={{ display: 'flex', gap: '8px' }}>
  <Avatar />
  <Avatar />
</div>
```

### Framework-Specific Idioms

**React Patterns** (10/12 frameworks):
- Props-based configuration
- Children for custom content
- Composition with Badge/Tooltip
- onError callbacks for image failures
- imgProps for pass-through attributes

**Vue Patterns** (2/12 frameworks):
- Slots for custom content
- v-model for dynamic updates
- Scoped slots for advanced composition
- Kebab-case prop names

**Radix Ecosystem**:
- AsChild for polymorphic rendering
- Data attributes for styling hooks
- Composition-first architecture
- DelayMs for UX optimization

**Material Design Frameworks** (MUI, Vuetify):
- Theme integration first-class
- sx prop for inline styling
- Color palette from theme
- Density/spacing from design system

## Key Insights for Component Library Design

### Universal Expectations (Implement These)

Based on 83%+ adoption rates, users expect:

1. **Image display with fallback**: Primary image with graceful degradation
2. **Three content types**: Image, text/initials, icon
3. **Two shapes minimum**: Circle (default) and square
4. **Size variants**: At least 3-5 predefined sizes
5. **Loading state**: Handle async image loading
6. **Error handling**: Fallback when image fails to load
7. **Accessibility**: Alt text, ARIA labels, semantic HTML
8. **Clickable support**: Easy to make interactive
9. **Custom content**: Children/slots for flexibility
10. **Stacking support**: Multiple avatars together

### High-Value Optional Features (Consider These)

Based on 40-70% adoption and clear use cases:

1. **Avatar group component**: Dedicated component for collections (67%)
2. **Max count with overflow**: "+N" indicator for excess avatars (58%)
3. **Auto-initials generation**: Extract from name prop (50%)
4. **Status badge integration**: Online/offline indicators (67%)
5. **Custom radius**: Fine-tuned corner control (50%)
6. **Theme colors**: Semantic color palette (58%)
7. **Border styling**: Rings and outlines (75%)
8. **Responsive sizing**: Breakpoint-based sizes (33%)
9. **Tooltip integration**: Show info on hover (75%)

### Differentiating Features (Evaluate These)

Rare patterns that could provide competitive advantage:

1. **Auto-generated colors**: Deterministic colors from name (Mantine)
2. **Delayed fallback**: Prevent flash on fast loads (Radix Primitives)
3. **8-level size scale**: Maximum granularity (Radix Themes)
4. **Popover overflow**: Click "+N" to see all (Ant Design)
5. **Custom surplus rendering**: Format overflow count (MUI)
6. **Status chip system**: 4-corner positioning with inset (Nuxt UI)
7. **Restricted color palettes**: Control auto-colors (Mantine)
8. **Loading status callbacks**: Programmatic state tracking (Shadcn UI)
9. **Polymorphic rendering**: AsChild pattern (Radix, Nuxt UI)

### Anti-Patterns to Avoid

Patterns with low adoption or implementation issues:

1. **No image fallback**: Broken images are user-hostile (0% no fallback)
2. **Circle-only**: Users expect shape options (92% have square)
3. **No group support**: Common use case (67% have groups)
4. **Manual initials only**: Auto-generation saves developer time
5. **No accessibility**: Alt text and ARIA are essential (100% adoption)
6. **No loading state**: Async images need handling (92% adoption)
7. **Fixed sizes only**: Custom sizing needed for flexibility

## Recommendations for Semantic UI Next

### Core Features (Must-Have)

Implement these universal patterns:

1. **Basic Avatar Component**:
   ```jsx
   <Avatar
     src="user.jpg"
     alt="User Name"
     size="md"
     shape="circle"
   >
     Fallback Content
   </Avatar>
   ```

2. **Three content modes**:
   - Image (src prop)
   - Text/Initials (text or auto-generated)
   - Icon (icon prop or custom)

3. **Standard shapes**:
   - Circle (default)
   - Square
   - Rounded (soft corners)

4. **Size system**:
   - At least 5 sizes (xs, sm, md, lg, xl)
   - Custom size support
   - Responsive sizing optional

5. **Fallback system**:
   - Automatic error handling
   - Priority cascade (image → custom → icon)
   - Loading state indication

6. **Accessibility**:
   - Required alt text
   - ARIA labels
   - Semantic HTML
   - Keyboard navigation
   - Color contrast compliance

7. **Group component**:
   ```jsx
   <AvatarGroup max={3} spacing="sm">
     <Avatar src="user1.jpg" />
     <Avatar src="user2.jpg" />
     <Avatar src="user3.jpg" />
   </AvatarGroup>
   ```

### Enhanced Features (Should-Have)

Add these high-value patterns:

1. **Auto-initials**: Extract from name prop
2. **Status badges**: Online/offline/busy indicators
3. **Border styling**: Rings and custom borders
4. **Theme colors**: Integrate with color system
5. **Hover tooltips**: Show name/info on hover
6. **Max count overflow**: "+N" for excess avatars
7. **Spacing control**: Gap between stacked avatars
8. **Custom radius**: Fine-tune corners

### Differentiating Features (Consider)

Evaluate these for competitive advantage:

1. **Smart color generation**:
   - Deterministic colors from name
   - WCAG AA-compliant auto-colors
   - Restricted palette option

2. **Advanced fallback**:
   - Delayed rendering to prevent flash
   - Priority-based cascade
   - Custom fallback components

3. **Status system**:
   - Position control (4 corners)
   - Inset mode for circles
   - Multiple concurrent badges

4. **Group features**:
   - Popover for overflow
   - Custom surplus rendering
   - Grid and list layouts

5. **Developer experience**:
   - TypeScript generics for src types
   - Polymorphic rendering
   - Loading state callbacks
   - Comprehensive error messages

### Semantic UI Classic Migration

Preserve these valuable classic patterns:

**Keep**:
- Inline formatting concept (avatar in text)
- Circular class modifier pattern
- Integration with existing image system
- Semantic class naming

**Modernize**:
- Create dedicated Avatar component
- Add native props (not just classes)
- Implement group functionality
- Add auto-initials and fallback
- Improve accessibility

**Add**:
- Status badge integration
- Size variants beyond inline
- Shape options
- Loading states
- TypeScript support
- React-specific patterns

## Conclusion

Avatar implementation across modern frameworks shows strong consensus on fundamentals (image/text/icon, shapes, fallback, accessibility) with divergence in advanced features (auto-generation, groups, status indicators, color systems).

**Key Takeaway**: All 12 frameworks implement the core patterns identically (image with fallback, circular shape, accessibility). The competitive differentiation happens in:

1. **Auto-generation features** (initials, colors, fallback cascade)
2. **Group functionality** (stacking, overflow, spacing, popover)
3. **Status indicators** (badges, positioning, multiple states)
4. **Size systems** (granularity, responsiveness, customization)
5. **Developer experience** (API ergonomics, TypeScript, documentation)

For Semantic UI Next, the strategy should be:
- **Nail the fundamentals** (leverage patterns with 83%+ adoption)
- **Add high-value features** (auto-initials, groups, status badges)
- **Differentiate selectively** (choose 2-3 unique features aligned with Semantic UI philosophy)
- **Modernize Classic patterns** (preserve inline formatting concept, drop image element dependency)
- **Focus on DX** (TypeScript, clear API, comprehensive examples)

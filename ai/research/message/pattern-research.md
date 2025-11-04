# Message/Alert - Aggregate Pattern Research

> Cross-framework analysis of Message/Alert patterns across 9 UI frameworks
> Research Date: 2025-11-04

## Executive Summary

This report analyzes Message/Alert component implementations across 9 modern UI frameworks (Ant Design, Chakra UI, Mantine, MUI, Nuxt UI, PrimeReact, Radix UI, Semantic UI Classic, ShadCN). The component serves as an embedded notification mechanism for displaying important contextual information with semantic meaning (info, success, warning, error).

**Key Finding**: Frameworks diverge significantly on terminology (Message vs Alert), API design (imperative vs declarative), and feature richness (minimalist vs comprehensive). The modern trend favors declarative composition with semantic status/severity props, while legacy approaches use imperative APIs or class-based patterns.

## Terminology Analysis

### Component Naming

| Framework | Name | Rationale |
|-----------|------|-----------|
| Ant Design | Message | Transient feedback (imperative API) |
| Chakra UI | Alert | Material Design alignment, embedded static display |
| Mantine | Alert | Industry standard term |
| MUI | Alert | Material Design specification |
| Nuxt UI | Alert | Industry standard |
| PrimeReact | Message | Form validation focus |
| Radix UI | Callout | Unique terminology, emphasizes attention-getting |
| Semantic UI Classic | Message | Original Semantic terminology |
| ShadCN | Alert | Following modern conventions |

**Observation**: "Alert" is the dominant term (6/9 frameworks), aligning with Material Design and WAI-ARIA standards. "Message" emphasizes communication aspect (Ant Design, PrimeReact, Semantic UI). "Callout" is Radix's unique take emphasizing visual distinction.

### Message vs Toast vs Notification

All frameworks distinguish between:
- **Message/Alert**: Embedded, static, contextual feedback within content flow
- **Toast/Notification**: Transient overlays at screen edges
- **Modal/Dialog**: Blocking, center-screen, critical interactions

## API Design Patterns

### 1. Imperative API (Rare)

**Example**: Ant Design Message
**Pattern**: Method calls trigger messages programmatically

```typescript
// Static methods
message.success('Success message');
message.error('Error occurred');

// Hook-based (context-aware)
const [messageApi, contextHolder] = message.useMessage();
messageApi.open({ type: 'info', content: 'Hello' });
```

**Characteristics**:
- Messages rendered outside component tree
- Programmatic control via method calls
- Useful for global notification systems
- Not idiomatic for most React/Vue patterns

**Adoption**: 1/9 frameworks (11%)

### 2. Declarative Composition (Dominant)

**Example**: Chakra UI, MUI, ShadCN
**Pattern**: JSX components with sub-components for structure

```jsx
<Alert status="error">
  <AlertIcon />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>
```

**Characteristics**:
- Standard React/Vue component patterns
- Composable sub-components for flexibility
- Conditional rendering via parent state
- Idiomatic framework integration

**Adoption**: 7/9 frameworks (78%)

### 3. Class-Based Composition (Legacy)

**Example**: Semantic UI Classic
**Pattern**: CSS classes define behavior and appearance

```html
<div class="ui error message">
  <div class="header">Error</div>
  <p>Something went wrong</p>
</div>
```

**Characteristics**:
- jQuery-era pattern
- No JavaScript required for display
- Class modifiers for all variations
- Manual event binding for interactions

**Adoption**: 1/9 frameworks (11% - legacy only)

## Pattern Support Matrix

### Content Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **Text content** | Universal (100%) | All 9 frameworks |
| **Title/heading** | Universal (100%) | All 9 frameworks (via props or components) |
| **Description/body** | Universal (100%) | All 9 frameworks |
| **Icon support** | Universal (100%) | All 9 frameworks |
| **Rich content/JSX** | Common (78%) | 7/9: Chakra, Mantine, MUI, Nuxt UI, PrimeReact, Radix UI, ShadCN |
| **Action buttons** | Moderate (44%) | 4/9: MUI, Nuxt UI, ShadCN (manual), Semantic UI (manual) |
| **Lists** | Moderate (44%) | 4/9: MUI, PrimeReact, Semantic UI, ShadCN |
| **Avatar** | Rare (11%) | 1/9: Nuxt UI |

**Level 1 (Universal)**: Title, description, icons, basic text
**Level 2 (Common)**: Rich HTML/JSX content
**Level 3 (Moderate)**: Action buttons, lists
**Level 5 (Rare)**: Avatar integration

### Semantic Types

| Type | Support | Details |
|------|---------|---------|
| **Info** | Universal (100%) | All frameworks - blue theme, info icon |
| **Success** | Universal (100%) | All frameworks - green theme, checkmark icon |
| **Warning** | Universal (100%) | All frameworks - yellow/orange theme, warning icon |
| **Error** | Universal (100%) | All frameworks - red theme, error/x icon |
| **Loading** | Moderate (33%) | 3/9: Ant Design, Chakra UI v2, Semantic UI (icon) |
| **Secondary** | Rare (22%) | 2/9: PrimeReact, Nuxt UI |
| **Contrast** | Rare (11%) | 1/9: PrimeReact |

**Observation**: The four core types (info, success, warning, error) are truly universal, forming the semantic foundation across all frameworks.

### Behavior Patterns

| Pattern | Support Level | Frameworks |
|---------|--------------|------------|
| **Static display** | Universal (100%) | All 9 frameworks (default behavior) |
| **Dismissible** | Common (78%) | 7/9: Chakra UI, Mantine, MUI, Nuxt UI, PrimeReact (partial), Semantic UI, ShadCN (manual) |
| **Auto-dismiss** | Rare (11%) | 1/9: Ant Design (imperative API) |
| **Animation** | Moderate (44%) | 4/9: Ant Design, Chakra UI, Mantine (partial), Semantic UI (transition) |
| **Hidden/visible state** | Common (67%) | 6/9: Ant Design, Chakra UI, Mantine, Nuxt UI, Radix UI, Semantic UI |
| **ARIA role="alert"** | Universal (100%) | All frameworks support or default to role="alert" |

**Level 1**: Static display, ARIA semantics
**Level 2**: Dismissible, visibility control
**Level 3**: Auto-dismiss (rare, usually separate Toast component)

### Visual Variants

| Variant | Support Level | Frameworks |
|---------|--------------|------------|
| **Filled/solid** | Common (78%) | 7/9: Ant Design, Chakra UI, Mantine, MUI, Nuxt UI, PrimeReact, ShadCN (default) |
| **Outlined/border** | Common (67%) | 6/9: Chakra UI, Mantine, MUI, Nuxt UI, Radix UI, ShadCN (destructive) |
| **Subtle/soft** | Common (67%) | 6/9: Chakra UI, Mantine, Nuxt UI, Radix UI, ShadCN (default), MUI (standard) |
| **Left accent** | Rare (22%) | 2/9: Chakra UI v2, PrimeReact (via custom styles) |
| **Top accent** | Rare (11%) | 1/9: Chakra UI v2 |
| **Surface** | Rare (22%) | 2/9: Chakra UI v3, Radix UI |

**Most Common Pattern**: Frameworks provide 2-4 visual variants, with filled/solid and outlined being most prevalent.

### Size Variants

| Framework | Sizes Supported | Options |
|-----------|-----------------|---------|
| Ant Design | ❌ No | N/A |
| Chakra UI v3 | ✅ Yes | sm, md, lg, xl |
| Mantine | ❌ No | N/A |
| MUI | ❌ No | N/A |
| Nuxt UI | ❌ No | N/A |
| PrimeReact | ❌ No | N/A |
| Radix UI | ✅ Yes | 1, 2, 3 |
| Semantic UI | ✅ Yes | mini, tiny, small, default, large, big, huge, massive |
| ShadCN | ❌ No | N/A |

**Support Level**: Occasional (33% - 3/9 frameworks)

**Observation**: Size variants are not standard. Semantic UI has the most comprehensive size system (7 sizes).

## Architectural Patterns

### Sub-Component Composition

**High Composition (Separate Components)**:
- Chakra UI: `Alert`, `AlertIcon`, `AlertTitle`, `AlertDescription`, `AlertCloseButton`
- MUI: `Alert`, `AlertTitle`
- Radix UI: `Callout.Root`, `Callout.Icon`, `Callout.Text`
- ShadCN: `Alert`, `AlertTitle`, `AlertDescription`

**Medium Composition (Some Components)**:
- Nuxt UI: `UAlert` (single component with title/description props)
- Mantine: `Alert` (single component with title prop)

**Low Composition (Props Only)**:
- Ant Design: Imperative API with config object
- PrimeReact: `Message` (text prop or content prop)

**Pattern Insight**: Modern frameworks favor **multi-component composition** for flexibility, while simpler implementations use **prop-based configuration**.

### Icon Pattern

| Framework | Icon Pattern | Details |
|-----------|--------------|---------|
| Ant Design | Auto-mapped | Icon selected automatically based on message type |
| Chakra UI | Component | `<AlertIcon>` renders appropriate icon, customizable |
| Mantine | Prop | `icon` prop accepts ReactNode |
| MUI | Prop + mapping | `icon` prop, `iconMapping` for custom type icons |
| Nuxt UI | Prop | `icon` prop with string identifier ("i-lucide-*") |
| PrimeReact | Auto | Icons automatic based on severity |
| Radix UI | Composed | Manual `<Callout.Icon>` composition |
| Semantic UI | Manual | `<i class="icon">` composed in HTML |
| ShadCN | Composed | Icon as child element |

**Dominant Pattern (56%)**: Auto-mapped or dedicated component for icons
**Modern Trend**: Flexible composition allowing custom icons

### Title/Description Pattern

**Separate Components** (Preferred by 44%):
- Chakra UI: `<AlertTitle>` + `<AlertDescription>`
- MUI: `<AlertTitle>` (description as children)
- Radix UI: `<Callout.Text>` (can be multiple)
- ShadCN: `<AlertTitle>` + `<AlertDescription>`

**Props-Based** (44%):
- Ant Design: `content` parameter
- Nuxt UI: `title` + `description` props
- PrimeReact: `text` or `content` prop
- Mantine: `title` prop + children

**Class-Based** (11%):
- Semantic UI: `<div class="header">` + paragraph

**Trend**: Split between component composition (cleaner JSX) and prop-based (less verbose).

## Status/Severity Prop Analysis

### Terminology

| Term | Frameworks | Count |
|------|-----------|-------|
| `severity` | MUI, PrimeReact | 2/9 |
| `status` | Chakra UI | 1/9 |
| `color` | Mantine, Nuxt UI, Radix UI | 3/9 |
| `type` | Ant Design (imperative) | 1/9 |
| `variant` | ShadCN (limited: default/destructive) | 1/9 |
| Class-based | Semantic UI | 1/9 |

**Most Semantic**: `severity` and `status` clearly indicate message importance
**Most Flexible**: `color` allows non-semantic usage (brand colors)

### Default Values

- **MUI**: `severity="success"` (default)
- **Chakra UI**: `status="info"` (default)
- **Mantine**: No default (must specify color)
- **Nuxt UI**: `color="primary"` (default)
- **Radix UI**: No default color
- **ShadCN**: `variant="default"` (neutral)

**Pattern**: Most frameworks default to neutral/info state, requiring explicit error/success specification.

## Dismissible Patterns

### Implementation Approaches

**1. Close Prop + Callback** (Most Common):
```jsx
// MUI
<Alert onClose={() => setOpen(false)}>Message</Alert>

// Chakra UI (manual)
<Alert>
  <AlertDescription>Message</AlertDescription>
  <CloseButton onClick={onClose} />
</Alert>

// Nuxt UI
<UAlert close title="Dismissible" />
```

**2. Imperative Close**:
```typescript
// Ant Design
const key = 'unique-msg';
message.open({ key, content: 'Message' });
message.destroy(key); // Close programmatically
```

**3. Manual Implementation**:
```html
<!-- Semantic UI -->
<div class="ui message">
  <i class="close icon"></i>
  Message
</div>
<script>
$('.message .close').on('click', function() {
  $(this).closest('.message').transition('fade');
});
</script>
```

**Key Insight**: Modern frameworks provide native close functionality, but implementation varies from automatic (MUI) to manual (Chakra, ShadCN).

### Close Button Patterns

| Pattern | Frameworks | Details |
|---------|-----------|---------|
| Automatic close icon | MUI | Renders close icon when `onClose` provided |
| Dedicated component | Chakra UI, Semantic UI | `<CloseButton>` or `<i class="close icon">` |
| Boolean prop | Nuxt UI, Mantine | `close={true}` or `withCloseButton` |
| Manual composition | ShadCN | Developer adds close button manually |
| N/A | Ant Design, PrimeReact, Radix UI | Not emphasized or not built-in |

## Accessibility Patterns

### ARIA Roles

| Framework | Default Role | Configurable |
|-----------|--------------|--------------|
| Ant Design | `alert` | No |
| Chakra UI | None (optional `addRole`) | Yes (v2) |
| Mantine | `alert` | No |
| MUI | `alert` | Yes (role prop) |
| Nuxt UI | Implied | - |
| PrimeReact | `alert` | No |
| Radix UI | None (supports role prop) | Yes |
| Semantic UI | None (CSS-based) | No |
| ShadCN | `alert` | No |

**Universal**: `role="alert"` is standard across frameworks
**Best Practice**: Alert role announces to screen readers when dynamically shown

### Screen Reader Considerations

**MUI Notable Limitation**: "Dynamically displayed alerts are announced, but static alerts on page load are NOT announced."

**Chakra UI**: AlertTitle and AlertDescription automatically announced via semantic structure

**Semantic UI**: No explicit ARIA support in classic version (relies on semantic HTML)

### High-Contrast Mode

**Radix UI** is the only framework with explicit `highContrast` prop for enhanced accessibility. This is a unique feature worth considering.

## Unique Features by Framework

### Ant Design
1. **Promise interface**: Chain messages sequentially via `.then()`
2. **Message updating**: Update existing message via `key` parameter
3. **Global configuration**: `message.config()` for app-wide defaults
4. **Hook-based context**: `useMessage()` for ConfigProvider integration
5. **Imperative API**: Method calls vs declarative components

### Chakra UI
1. **Multi-part anatomy**: Extensive sub-component breakdown
2. **PopoverAnchor pattern**: Applied to Alert in some use cases
3. **Loading status**: Dedicated loading state with spinner (v2)
4. **Recipe system**: v3 slot recipes for theming
5. **Status-driven**: Single prop controls icon, color, semantics

### Mantine
1. **Styles API**: Granular control over 8 internal elements
2. **Required closeButtonLabel**: Enforced accessibility for close buttons
3. **Theme-aware colors**: Automatic light/dark mode adaptation
4. **Static messaging focus**: Designed for persistent, not transient

### MUI
1. **AlertTitle separation**: Separate component (not prop)
2. **Three-tier icon control**: Per-instance, per-severity, global theme
3. **Action prop**: Flexible action element support
4. **Paper inheritance**: Inherits elevation and Paper props
5. **Material Design alignment**: Strict specification compliance

### Nuxt UI
1. **Avatar support**: Unique avatar integration (image, icon, initials)
2. **Actions as data**: Array prop for button configurations
3. **Orientation control**: Horizontal/vertical layout switching
4. **Four variants**: solid, soft, subtle, outline (more than typical 2-3)
5. **Close icon customization**: `close-icon` prop for custom dismiss icon

### PrimeReact
1. **Dual content API**: `text` prop OR `content` prop (rich JSX)
2. **Six severity levels**: Includes secondary and contrast variants
3. **Form validation focus**: Optimized for inline field feedback
4. **Keyboard support**: Enter/Space keys close message
5. **Messages vs Message**: Separate components for single vs multiple

### Radix UI
1. **Callout terminology**: Unique naming emphasizing attention
2. **High-contrast mode**: `highContrast` prop for accessibility
3. **Composition-only**: No rigid structure, full flexibility
4. **Theme integration**: Deep Radix Themes dependency
5. **Minimal API**: Intentionally limited prop surface

### Semantic UI Classic
1. **7-size system**: mini, tiny, small, default, large, big, huge, massive
2. **Attachment system**: Top/bottom attached to adjacent components
3. **Floating variant**: Elevated appearance with shadow
4. **Icon message structure**: Content wrapper for flexbox layout
5. **Class-based API**: jQuery-era pattern, all variants via classes

### ShadCN
1. **Copy-paste philosophy**: Not installed via npm, code ownership
2. **CVA integration**: Class Variance Authority for type-safe variants
3. **Grid layout**: Uses CSS grid (not flexbox) for icon alignment
4. **Minimal variants**: Only default and destructive
5. **No built-in dismiss**: Intentionally persistent

## Color Palette Analysis

### Semantic Colors

**Universal** (All frameworks):
- Info (blue)
- Success (green)
- Warning (yellow/orange/amber)
- Error (red)

**Common Extensions**:
- Neutral/Gray: Mantine, Nuxt UI, Radix UI
- Primary/Secondary: Nuxt UI
- Contrast: PrimeReact

### Decorative Colors

| Framework | Decorative Palette | Count |
|-----------|-------------------|-------|
| Semantic UI | 12 colors | red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, black |
| Chakra UI | Full theme | Any theme color |
| Radix UI | Full theme | Any theme color |
| Mantine | Full theme | Any theme color |
| Others | Limited | Typically semantic only |

**Pattern**: Frameworks split between **semantic-only** (focused) and **full-palette** (flexible).

## Pattern Correlations

### Status-Driven → Icon Automation
Frameworks with status/severity props **automatically map icons**:
- Ant Design: type → icon
- Chakra UI: status → AlertIcon
- MUI: severity → default icon
- PrimeReact: severity → icon

**Correlation**: 89% of frameworks with status props auto-map icons

### Composition → Flexibility
Frameworks with sub-components have **more layout flexibility**:
- Chakra UI: vertical, centered, custom layouts
- MUI: Custom action compositions
- Radix UI: Icon-only, text-only, combined

**Insight**: Component composition enables non-standard layouts without prop explosion

### Imperative API → Auto-Dismiss
Ant Design's imperative API naturally supports **duration-based auto-dismiss**, while declarative components typically don't:
- Ant Design: `duration` parameter for auto-dismiss
- Others: Manual state management for visibility

**Reason**: Imperative APIs control lifecycle externally, enabling temporal behavior

## Support Level Classifications

### Level 1: Universal Patterns (100% adoption)
**Must implement for Semantic UI Next**

1. **Four semantic types**: info, success, warning, error
2. **Text content**: Title and description/body
3. **Icon support**: Visual indicators for types
4. **Static display**: Embedded in content flow
5. **Rich content**: HTML/JSX within message
6. **ARIA role="alert"**: Screen reader support
7. **Conditional rendering**: Show/hide via state
8. **Basic styling**: Background color, borders, padding

### Level 2: Common Patterns (67-78% adoption)
**Strongly consider for Semantic UI Next**

1. **Dismissible behavior**: Close button with callback
2. **Visual variants**: Filled, outlined, subtle (2-3 options)
3. **Custom icon support**: Override default icons
4. **Hidden/visible state**: Explicit visibility control
5. **Custom styling**: className or style prop
6. **Flexible title/description**: Props or sub-components

### Level 3: Moderate Patterns (33-44% adoption)
**Consider for specialized use cases**

1. **Action buttons**: Native action support or slot
2. **List content**: Bulleted/numbered lists
3. **Animation**: Enter/exit transitions
4. **Size variants**: Small, medium, large options
5. **Loading state**: Spinner or loading indicator
6. **Multiple severities**: Beyond core 4 types

### Level 4: Occasional Patterns (22-33% adoption)
**Optional advanced features**

1. **Left/top accent**: Border accent styling
2. **Surface variant**: Elevated appearance
3. **Auto-dismiss**: Temporal display (rare for static alerts)
4. **Orientation control**: Horizontal/vertical layout
5. **Color palette**: Beyond semantic colors

### Level 5: Rare Patterns (11% adoption)
**Framework-specific innovations**

1. **Avatar integration**: Personalized messages (Nuxt UI)
2. **Promise chaining**: Sequential messages (Ant Design)
3. **Message updating**: Update existing via key (Ant Design)
4. **High-contrast mode**: Accessibility enhancement (Radix UI)
5. **Imperative API**: Method-based vs declarative (Ant Design)
6. **Attachment**: Attached to adjacent elements (Semantic UI)
7. **Floating**: Elevated above content (Semantic UI)

## API Design Recommendations

### For Semantic UI Next (Web Components)

**1. Component Structure**

```html
<!-- Recommended: Web component with slots -->
<ui-message type="error" dismissible>
  <ui-message-header slot="header">Error Occurred</ui-message-header>
  <p slot="content">Something went wrong. Please try again.</p>
  <ui-button slot="actions" variant="ghost" size="sm">Retry</ui-button>
</ui-message>

<!-- Simpler variant -->
<ui-message type="success">
  Operation completed successfully.
</ui-message>
```

**2. Essential Props**

```typescript
interface MessageProps {
  // Type/Severity (Level 1)
  type?: 'info' | 'success' | 'warning' | 'error';

  // Behavior (Level 1-2)
  dismissible?: boolean;
  visible?: boolean;
  hidden?: boolean;

  // Visual (Level 2)
  variant?: 'filled' | 'outlined' | 'subtle';
  icon?: string | boolean; // Icon name or false to hide

  // Size (Level 3)
  size?: 'mini' | 'tiny' | 'small' | '' | 'large' | 'big' | 'huge' | 'massive';

  // Layout (Level 4)
  attached?: 'top' | 'bottom' | boolean;
  floating?: boolean;
  compact?: boolean;

  // Accessibility (Level 1)
  role?: string; // default: 'alert'
  'aria-live'?: 'polite' | 'assertive';
}
```

**3. Events**

```typescript
interface MessageEvents {
  // Level 1-2
  'close': CustomEvent<void>;
  'dismiss': CustomEvent<void>;

  // Level 3
  'before-close': CustomEvent<{ cancel: () => void }>;
  'after-close': CustomEvent<void>;
}
```

**4. Slots**

```html
<ui-message>
  <!-- Icon slot (optional) -->
  <ui-icon slot="icon" name="check-circle"></ui-icon>

  <!-- Header slot (optional) -->
  <ui-message-header slot="header">Title</ui-message-header>

  <!-- Default/content slot (required) -->
  <p slot="content">Main message content</p>

  <!-- Actions slot (optional) -->
  <div slot="actions">
    <ui-button size="sm">Action</ui-button>
  </div>

  <!-- Close button (auto-generated if dismissible) -->
  <ui-icon-button slot="close" icon="x"></ui-icon-button>
</ui-message>
```

**5. CSS Parts for Styling**

```css
ui-message::part(root) { }
ui-message::part(icon) { }
ui-message::part(header) { }
ui-message::part(content) { }
ui-message::part(actions) { }
ui-message::part(close-button) { }
```

**6. Data Attributes for State-Based Styling**

```css
ui-message[data-type="error"] { }
ui-message[data-type="success"] { }
ui-message[data-variant="outlined"] { }
ui-message[data-dismissible] { }
ui-message[data-visible="false"] { }
```

**7. Progressive Enhancement Examples**

```html
<!-- Minimum viable -->
<ui-message type="info">
  Please check your email for verification.
</ui-message>

<!-- With header -->
<ui-message type="warning">
  <ui-message-header slot="header">Warning</ui-message-header>
  Your session will expire in 5 minutes.
</ui-message>

<!-- Full featured -->
<ui-message
  type="error"
  variant="outlined"
  size="large"
  dismissible
  floating
  @close="handleClose"
>
  <ui-icon slot="icon" name="alert-triangle"></ui-icon>
  <ui-message-header slot="header">Upload Failed</ui-message-header>
  <div slot="content">
    <p>The file could not be uploaded:</p>
    <ul>
      <li>File size exceeds 10MB limit</li>
      <li>Invalid file format</li>
    </ul>
  </div>
  <ui-button slot="actions" size="sm" variant="ghost">Retry</ui-button>
</ui-message>
```

## Implementation Priorities

### Phase 1: Core Functionality (MVP)
1. Four semantic types (info, success, warning, error)
2. Basic title + content structure
3. Icon support (auto-mapped to types)
4. Static display in content flow
5. role="alert" for accessibility
6. Basic styling (colors, borders, padding)
7. Conditional rendering (visible/hidden)
8. Simple text content

### Phase 2: Enhanced UX
1. Dismissible behavior with close button
2. Three visual variants (filled, outlined, subtle)
3. Custom icon override
4. Rich content support (HTML/lists)
5. Header/content sub-components
6. Event callbacks (close, dismiss)
7. Custom styling (className, CSS parts)
8. Animation (enter/exit transitions)

### Phase 3: Advanced Features
1. Action buttons/slot
2. Size variants (Semantic UI's 7-size system)
3. Loading state
4. Attached positioning (top/bottom)
5. Floating variant
6. Compact variant
7. List content styling
8. Multiple types per page

### Phase 4: Semantic UI Classic Parity
1. Full color palette (12 colors)
2. Complete size system (mini through massive)
3. Attachment system integration
4. Transition animations
5. Icon message layout
6. Class composition patterns (adapted)
7. State management (hidden/visible)

## Testing & Accessibility Checklist

### ARIA & Semantics
- [ ] `role="alert"` on message container
- [ ] `aria-live="polite"` or `"assertive"` based on severity
- [ ] `aria-atomic="true"` for complete message reading
- [ ] Proper heading hierarchy for title/header
- [ ] Semantic HTML (h2-h6 for headers, p for content)
- [ ] Icon has `aria-hidden="true"` (decorative)

### Keyboard Navigation
- [ ] Close button keyboard accessible (Enter/Space)
- [ ] Tab order correct (icon → content → actions → close)
- [ ] Focus visible on interactive elements
- [ ] Escape key closes dismissible messages (optional)
- [ ] Action buttons keyboard accessible

### Screen Reader Testing
- [ ] Message announced when dynamically shown
- [ ] Title read before content
- [ ] Close button has proper label
- [ ] Icon not read (decorative)
- [ ] Action buttons properly labeled
- [ ] Severity communicated (via text or hidden label)

### Visual & Color
- [ ] Color contrast meets WCAG AA standards
- [ ] Information not conveyed by color alone
- [ ] Icons reinforce semantic meaning
- [ ] High-contrast mode support (optional)
- [ ] Dark mode compatible
- [ ] Visible focus indicators

### Content & Structure
- [ ] Title and content distinguishable
- [ ] Lists properly formatted
- [ ] Links visually distinct
- [ ] Rich content maintains hierarchy
- [ ] Long content scrollable if needed
- [ ] Content width constrained for readability

### Behavior
- [ ] Dismiss button works as expected
- [ ] Animation smooth and not jarring
- [ ] Auto-dismiss (if implemented) has sufficient duration
- [ ] Multiple messages stack properly
- [ ] Messages don't overlap content
- [ ] Visible/hidden state transitions smoothly

### Responsive & Mobile
- [ ] Readable on small screens
- [ ] Touch targets adequate (44x44px minimum)
- [ ] Horizontal scrolling avoided
- [ ] Tap to dismiss works on mobile
- [ ] Icons scale appropriately
- [ ] Layout adapts to narrow viewports

## Framework Comparison Matrix

| Feature | Ant Design | Chakra UI | Mantine | MUI | Nuxt UI | PrimeReact | Radix UI | Semantic UI | ShadCN |
|---------|:----------:|:---------:|:-------:|:---:|:-------:|:----------:|:--------:|:-----------:|:------:|
| **Architecture** |
| Declarative | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Imperative | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sub-components | ❌ | ✅ v2/v3 | ❌ | ⚠️ | ❌ | ❌ | ✅ | ⚠️ | ✅ |
| **Content** |
| Title/header | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Description/body | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Icon auto-map | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Custom icon | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Rich content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Actions | ❌ | ⚠️ | ❌ | ✅ | ✅ | ❌ | ❌ | ⚠️ | ⚠️ |
| Lists | ❌ | ❌ | ❌ | ⚠️ | ❌ | ⚠️ | ❌ | ✅ | ✅ |
| **Types** |
| Info | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Success | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Warning | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Error | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loading | ✅ | ✅ v2 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ icon | ❌ |
| **Variants** |
| Filled/solid | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Outlined | ❌ | ⚠️ v2 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ⚠️ |
| Subtle/soft | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Left accent | ❌ | ✅ v2 | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| Surface | ❌ | ✅ v3 | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Behavior** |
| Dismissible | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ❌ | ✅ | ❌ |
| Auto-dismiss | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Animation | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Visible/hidden | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ | ❌ | ⚠️ | ✅ | ⚠️ |
| **Styling** |
| Size variants | ❌ | ✅ v3 | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Color palette | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ❌ |
| Custom styling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Accessibility** |
| role="alert" | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ❌ | ✅ |
| Screen reader | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| High-contrast | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Keyboard support | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ |

**Legend**: ✅ Full support | ⚠️ Partial/manual | ❌ Not supported

## Conclusion

The Message/Alert component has achieved strong consensus on core patterns:

**Universal Standards** (implement first):
1. Four semantic types (info, success, warning, error)
2. Title and description/content structure
3. Icon support (auto-mapped or composed)
4. Static embedded display
5. Role="alert" for accessibility
6. Rich content support (HTML/JSX)
7. Conditional visibility control
8. Basic visual variants (filled, outlined, subtle)

**Strong Conventions** (implement second):
1. Dismissible behavior with close button
2. Custom icon override capability
3. Event callbacks (close, dismiss)
4. Multiple visual variants (2-4 options)
5. Flexible title/description (props or components)
6. Custom styling hooks (className, CSS parts)

**Emerging Patterns** (consider for differentiation):
1. Avatar integration (Nuxt UI innovation)
2. High-contrast mode (Radix UI accessibility)
3. Action button slots (MUI, Nuxt UI pattern)
4. Orientation control (Nuxt UI flexibility)
5. Imperative API option (Ant Design approach)
6. Attachment system (Semantic UI Classic legacy)

**For Semantic UI Next** as a web component library:
- Prioritize Level 1 and Level 2 patterns for MVP
- Maintain Semantic UI Classic's comprehensive size and color systems
- Use web component slots for flexible content composition
- Provide both prop-based shortcuts and full composition flexibility
- Support progressive enhancement from simple to complex
- Ensure WCAG AAA accessibility compliance
- Integrate seamlessly with Semantic UI design tokens

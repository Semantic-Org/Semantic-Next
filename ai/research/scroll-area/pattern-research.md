# Component Pattern Research: Scroll Area

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 4
- Date: 2025-11-05
- Unique patterns identified: 35+

## Component Definition Consensus

Scroll Area components provide custom-styled scrollbars while maintaining native browser scrolling functionality. Universal mental model: "Custom scrollbars without sacrificing native behavior."

**Primary Purpose:** Replace default browser scrollbars with visually consistent, styled alternatives while preserving native scrolling performance, accessibility, and behavior.

**Mental Model:** A container wrapper that augments native browser scrolling with custom visual chrome - the scrolling mechanism remains browser-native (keyboard, wheel, touch), but the scrollbar appearance is customizable and consistent across browsers.

**Semantic meaning:** Represents a scrollable content region with enhanced visual control, communicating "styled scroll container" while maintaining all expectations of native scrolling (accessibility, performance, familiar interaction patterns).

## Terminology Variations

- **Scroll Area** (2 frameworks) = ShadCN, Radix UI
- **ScrollArea** (1 framework) = Mantine
- **ScrollPanel** (1 framework) = PrimeReact

All frameworks provide the same core concept but with variations in API design and feature richness.

## Pattern Inventory

### Scrollbar Visibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Hover visibility | Show on hover only | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Always visible | Scrollbars never hide | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Scroll visibility | Show during scroll | 3/4 (75%) | **Level 2: Common** | ShadCN, Radix UI, Mantine | Native |
| Auto visibility | Browser-like auto | 2/4 (50%) | **Level 3: Frequent** | Radix UI, Mantine | Native |
| Never visible | Always hidden | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Hide delay control | Configurable fade delay | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Mantine | Native |

### Orientation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Vertical scrolling | Y-axis scrolling | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Horizontal scrolling | X-axis scrolling | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Bi-directional | Both axes enabled | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Direction control | Specify which axes | 2/4 (50%) | **Level 3: Frequent** | Radix UI, Mantine | Native |

### Size and Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size variants | Multiple size options | 2/4 (50%) | **Level 3: Frequent** | Radix UI, Mantine | Native |
| Custom scrollbar size | Pixel-based sizing | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Radius variants | Border radius options | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |
| CSS class customization | className prop | 4/4 (100%) | **Level 1: Universal** | All | CSS-only |
| Inline styling | style prop | 4/4 (100%) | **Level 1: Universal** | All | CSS-only |
| Data attributes | State-based styling | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | CSS-only |
| Theme integration | Design system colors | 4/4 (100%) | **Level 1: Universal** | All | CSS-only |

### Component Structure Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Root container | Wrapper element | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Viewport element | Scrollable area | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Composed |
| Scrollbar element | Visual scrollbar | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Composed |
| Thumb element | Draggable indicator | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Composed |
| Corner element | Bi-directional intersection | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Composed |
| Single component | All-in-one wrapper | 2/4 (50%) | **Level 3: Frequent** | Mantine, PrimeReact | Native |

### Programmatic Control Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Viewport ref access | Direct DOM access | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Scroll to position | Imperative scrolling | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Scroll into view | Element navigation | 1/4 (25%) | **Level 4: Occasional** | Mantine | Composed |
| Scroll position monitoring | Position callbacks | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Refresh method | Update scrollbar state | 1/4 (25%) | **Level 4: Occasional** | PrimeReact | Native |

### Advanced Feature Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Autosize variant | Auto-scroll on overflow | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Max dimension constraints | Height/width limits | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Overflow detection | Overflow callbacks | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Offset scrollbars | Prevent content overlap | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Overscroll behavior | Boundary behavior control | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Native scrolling mechanism | Browser-native scroll | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Keyboard navigation | Arrow/Page keys | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Screen reader support | ARIA semantics | 3/4 (75%) | **Level 2: Common** | ShadCN, Radix UI, Mantine | Native |
| Touch support | Mobile gestures | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Mouse wheel support | Scroll wheel | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Touch target sizing | 44×44px minimum | 1/4 (25%) | **Level 4: Occasional** | ShadCN | Native |

## Notable Patterns

### Universal (100%)
- Custom scrollbar styling
- Native browser scrolling mechanism
- Hover visibility mode
- Always visible mode
- Vertical scrolling support
- Horizontal scrolling support
- Bi-directional scrolling
- CSS class customization
- Inline style support
- Theme integration
- Keyboard navigation
- Touch gestures
- Mouse wheel support

### ShadCN Specializations
- Built on Radix UI Scroll Area primitives (v1.2.10, 6.73 kB)
- Five composable primitives (Root, Viewport, Scrollbar, Thumb, Corner)
- Copy-paste distribution model
- Tailwind-first styling approach
- Data attributes for state styling
- 44×44px touch targets on thumbs
- Configurable hide delay (600ms default)
- Integration with Next.js Image
- Zero ARIA configuration (native semantics)
- Cross-browser viewport hiding

### Radix UI Specializations
- Progressive enhancement philosophy
- Three size variants (12px, 16px, 20px)
- Five radius variants (none, small, medium, large, full)
- Responsive prop system with breakpoints
- Four display types (always, auto, scroll, hover)
- Directional control (vertical, horizontal, both)
- AsChild polymorphic rendering
- Margin prop system
- Radix Themes integration
- Native + custom hybrid approach

### Mantine Specializations
- Five visibility behaviors (hover, scroll, auto, always, never)
- Custom scrollbar size in pixels
- Viewport ref for imperative control
- Scroll position monitoring via callback
- ScrollArea.Autosize composition
- Max dimension constraints (mah, maw)
- Overflow detection callbacks
- Offset scrollbar system
- Overscroll behavior control
- Keyboard navigation integration patterns
- Comprehensive Styles API (5 selectors)
- Searchable list patterns
- Autocomplete integration examples

### PrimeReact Specializations
- Minimal API surface (3 props)
- Imperative refresh() method
- CSS-centric customization
- Lightweight implementation
- Automatic scrollbar detection
- PrimeReact design token integration
- React-specific implementation
- Basic feature set

## Implementation Notes

### Installation

**ShadCN:**
```bash
pnpm dlx shadcn@latest add scroll-area
```

**Radix UI:**
```bash
npm install @radix-ui/react-scroll-area
```

**Mantine:**
```bash
npm install @mantine/core
```

**PrimeReact:**
```bash
npm install primereact
```

### Basic Usage Comparison

**ShadCN:**
```jsx
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-72 w-48 rounded-md border">
  <div className="p-4">
    {/* Long content */}
  </div>
</ScrollArea>
```

**Radix UI:**
```jsx
import { ScrollArea } from '@radix-ui/themes'

<ScrollArea
  size="2"
  radius="medium"
  scrollbars="vertical"
  style={{ height: 180 }}
>
  {/* Long content */}
</ScrollArea>
```

**Mantine:**
```tsx
import { ScrollArea } from '@mantine/core'

<ScrollArea h={250} type="hover">
  {/* Long content */}
</ScrollArea>
```

**PrimeReact:**
```jsx
import { ScrollPanel } from 'primereact/scrollpanel'

<ScrollPanel style={{ width: '100%', height: '200px' }}>
  {/* Long content */}
</ScrollPanel>
```

### Horizontal Scrolling Pattern

**ShadCN:**
```jsx
<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
  <div className="flex w-max space-x-4 p-4">
    {/* Horizontal content */}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

**Radix UI:**
```jsx
<ScrollArea scrollbars="horizontal" style={{ width: 300 }}>
  <Flex gap="3" style={{ minWidth: 600 }}>
    {/* Horizontal content */}
  </Flex>
</ScrollArea>
```

**Mantine:**
```tsx
<ScrollArea w={300} scrollbars="x">
  <div style={{ minWidth: 600 }}>
    {/* Horizontal content */}
  </div>
</ScrollArea>
```

**PrimeReact:**
```jsx
<ScrollPanel style={{ width: '300px', height: '100px' }}>
  <div style={{ width: '600px' }}>
    {/* Horizontal content */}
  </div>
</ScrollPanel>
```

### Programmatic Control Pattern

**Mantine (Only framework with programmatic control):**
```tsx
import { useRef } from 'react'
import { ScrollArea } from '@mantine/core'

function Demo() {
  const viewport = useRef<HTMLDivElement>(null)

  const scrollToTop = () =>
    viewport.current.scrollTo({ top: 0, behavior: 'smooth' })

  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth'
    })

  return (
    <>
      <button onClick={scrollToTop}>Top</button>
      <button onClick={scrollToBottom}>Bottom</button>
      <ScrollArea h={200} viewportRef={viewport}>
        {/* Content */}
      </ScrollArea>
    </>
  )
}
```

### Visibility Mode Comparison

**ShadCN/Radix UI:**
```jsx
// Hover (default)
<ScrollArea type="hover" scrollHideDelay={600}>

// Always visible
<ScrollArea type="always">

// Show during scroll
<ScrollArea type="scroll">

// Auto (browser-like)
<ScrollArea type="auto">
```

**Mantine:**
```tsx
// Hover
<ScrollArea type="hover" scrollHideDelay={1000}>

// Always visible
<ScrollArea type="always">

// Show during scroll
<ScrollArea type="scroll">

// Auto (browser-like)
<ScrollArea type="auto">

// Never visible (unique to Mantine)
<ScrollArea type="never">
```

**PrimeReact:**
```jsx
// Only one mode - always visible when needed
<ScrollPanel>
```

### Autosize Pattern (Mantine Only)

```tsx
import { ScrollArea } from '@mantine/core'

<ScrollArea.Autosize
  mah={250}
  onOverflowChange={(hasOverflow) => console.log(hasOverflow)}
>
  {/* Content - scrolls when exceeds 250px */}
</ScrollArea.Autosize>
```

## Design Philosophy Differences

### Compositional/Primitive (ShadCN, Radix UI)
- **Philosophy**: Headless primitives with explicit structure
- **Approach**: Separate components for each piece (Root, Viewport, Scrollbar, Thumb)
- **Styling**: External (Tailwind/CSS)
- **Control**: Maximum flexibility for custom implementations
- **Audience**: Design system builders
- **Distribution**: Copy-paste (ShadCN) or npm (Radix Primitives)

### Integrated/Feature-Rich (Mantine)
- **Philosophy**: Comprehensive component with advanced features
- **Approach**: Single component with extensive prop API
- **Styling**: Built-in theme system + Styles API
- **Control**: Balance of power and convenience
- **Audience**: Application developers seeking rich features
- **Distribution**: npm package with full ecosystem

### Minimal/Lightweight (PrimeReact)
- **Philosophy**: Simple custom scrollbar replacement
- **Approach**: Minimal API for basic styling
- **Styling**: CSS class overrides
- **Control**: Basic scrolling with visual consistency
- **Audience**: Developers needing simple custom scrollbars
- **Distribution**: npm package with PrimeReact suite

## Sophisticated Design Patterns

### Mantine - ScrollArea.Autosize Composition

**What it does**: A compound component that automatically enables scrolling only when content exceeds a specified maximum dimension (height or width). The scrollable container grows with content until the max constraint is reached, then activates scroll behavior. It includes an `onOverflowChange` callback to detect when content exceeds constraints.

```tsx
<ScrollArea.Autosize mah={300} onOverflowChange={(hasOverflow) => console.log(hasOverflow)}>
  {/* Content - grows with layout, scrolls when mah exceeded */}
</ScrollArea.Autosize>
```

**Why it's sophisticated**: Most scroll containers require explicit height/width properties, creating a coupling between layout and scrolling capability. ScrollArea.Autosize decouples these concerns by making scrolling activation data-driven. This solves a real-world problem: popovers, autocomplete dropdowns, and modals need to grow with content until they hit viewport limits, then scroll. Without this pattern, developers must manage height calculations and scroll visibility manually.

**Evidence of design maturity**:
- Solves the "autocomplete scrolling" problem elegantly by composing with TextInput and Popover, handling variable-length result lists
- The `onOverflowChange` callback enables UI patterns that respond to content overflow (showing icons, adjusting spacing, etc.)
- Tight integration with Mantine's `max-height` and `max-width` token system rather than requiring pixel values

---

### Mantine - Offset Scrollbars System

**What it does**: The `offsetScrollbars` prop prevents content from being hidden under overlay scrollbars by adding intelligent padding. It supports directional control (`"x"`, `"y"`, `"xy"`) and conditional application (`"present"` only when scrollbars are actually visible).

```tsx
// Add padding only when scrollbars appear, prevents layout shift
<ScrollArea offsetScrollbars="present">
  {/* Content remains visible, scrollbar doesn't overlap */}
</ScrollArea>

// Offset specific directions
<ScrollArea offsetScrollbars="x">  {/* Only horizontal offset */}
```

**Why it's sophisticated**: This pattern addresses a subtle but pervasive UX problem: overlay scrollbars shift content layout when they appear (creating jarring visual resets). The `"present"` value is particularly clever—it only adds padding when scrollbars are actually needed, avoiding unnecessary layout inflation. This demonstrates thoughtful handling of edge cases that affect user experience.

**Evidence of design maturity**:
- The three options (`"x"`, `"y"`, `"xy"`) reflect understanding of different overflow scenarios
- The `"present"` option shows restraint—the component could force always offsetting (simpler) but instead uses conditional logic
- Prevents the "content jumps when scrollbars appear" problem that frustrates users in data tables and modals

---

### Radix UI - Responsive Prop System with Breakpoints

**What it does**: Scroll Area props like `size` and `radius` accept responsive values through the `Responsive<>` type, automatically adapting scrollbar dimensions across viewport breakpoints. Mobile devices get compact scrollbars (size "1"), while desktop gets prominent ones (size "3").

```tsx
<ScrollArea
  size={{ initial: "1", sm: "2", md: "3" }}
  radius={{ initial: "none", md: "medium" }}
  scrollbars="vertical"
>
  {/* Scrollbar size adapts based on viewport */}
</ScrollArea>
```

**Why it's sophisticated**: This pattern recognizes that scrollbar sizing is not static across devices—touch targets need to be larger on mobile, while desktop users prefer compact scrollbars. Rather than requiring developers to manually implement media queries or render different components, this pushes responsive logic into the component API itself. It's component-specific because it applies Radix Themes' responsive system *specifically to scrollbar dimensions*, not general layout.

**Evidence of design maturity**:
- Integration with Radix Themes' `Responsive<>` type wrapper shows architectural coherence
- Recognizes the WCAG 44×44px touch target requirement and adapts scrollbar size accordingly
- Avoids the anti-pattern of fixed scrollbar sizes that work poorly on mobile
- Responsive sizing for scrollbar radius (full pill-shape on mobile for easier targeting) shows attention to interaction UX

---

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **Consistent scrollbar styling** - Cross-browser visual consistency
2. **Design system integration** - Match brand styling
3. **Content panels** - Fixed-height content areas (sidebars, chat, logs)
4. **Data tables** - Scrollable table content
5. **Code blocks** - Horizontal and vertical code scrolling
6. **Image galleries** - Horizontal scrolling galleries
7. **Dropdown content** - Scrollable menu/list items
8. **Modal bodies** - Scrollable dialog content

## Key Differences

### Architecture
- **Compositional** (ShadCN, Radix UI): Separate primitive components
- **Monolithic** (Mantine, PrimeReact): Single wrapper component

### Feature Richness
- **Basic** (PrimeReact): Custom scrollbars only
- **Standard** (ShadCN, Radix UI): Custom scrollbars + visibility modes
- **Advanced** (Mantine): Everything + programmatic control + autosize

### Visibility Modes
- **PrimeReact**: 1 mode (always when needed)
- **ShadCN/Radix UI**: 4 modes (hover, always, scroll, auto)
- **Mantine**: 5 modes (adds "never")

### Programmatic Control
- **PrimeReact**: refresh() method only
- **ShadCN/Radix UI**: None documented
- **Mantine**: Full imperative API with refs and callbacks

### Size Configuration
- **ShadCN**: CSS classes only
- **Radix UI**: 3 predefined sizes (1, 2, 3)
- **Mantine**: Custom pixel sizing
- **PrimeReact**: CSS classes only

### Distribution Model
- **ShadCN**: Copy-paste components (you own the code)
- **Radix UI**: npm package (primitives or themes)
- **Mantine**: npm package (integrated ecosystem)
- **PrimeReact**: npm package (component suite)

### Accessibility Maturity
- **ShadCN/Radix UI**: Full WCAG compliance via native scrolling
- **Mantine**: Comprehensive keyboard/screen reader support
- **PrimeReact**: Marked as "under development"

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Radix UI](./radix-ui/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)

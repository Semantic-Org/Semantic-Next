# Component Pattern Research: Kbd (Keyboard Key)

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 5
- Date: 2025-11-05
- Unique patterns identified: 20+

## Component Definition Consensus

Kbd components display keyboard keys and shortcuts in a visually distinct, semantically correct manner. Universal mental model: "visual representation of physical keyboard keys."

**Primary Purpose:** Represent keyboard input visually, making keyboard shortcuts and navigation discoverable to users in documentation, tutorials, and UI instructions.

**Mental Model:** A styled semantic element that mimics the appearance of physical keyboard keys, communicating "press this key" or "use this keyboard shortcut."

**Semantic meaning:** Indicates keyboard input to both users and assistive technologies, representing text that should be entered from a keyboard device.

## Terminology Variations

- **Kbd** (5 frameworks) = ShadCN, Chakra UI, Nuxt UI, Mantine, HeroUI

All frameworks use the abbreviation "Kbd" derived from the HTML `<kbd>` element.

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Text content | Key labels as children | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Unicode symbols | Keyboard symbols (⌘, ⇧, ⌥, ⌃) | 4/5 (80%) | **Level 2: Common** | ShadCN, Mantine, Nuxt UI, HeroUI | Composed |
| Single character | Single letter/number keys | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Multi-character text | Words like "Shift", "Enter", "Esc" | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Custom content | Any React children | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Icon support | Built-in icon rendering | 1/5 (20%) | **Level 4: Occasional** | HeroUI | Native |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Single key | Individual keyboard key display | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Key combinations | Multiple keys shown together | 5/5 (100%) | **Level 1: Universal** | All | Composed/Native |
| Modifier keys | Command, shift, ctrl, option, alt | 2/5 (40%) | **Level 3: Frequent** | Nuxt UI, HeroUI | Native |
| Action keys | Enter, delete, escape, tab, space | 1/5 (20%) | **Level 4: Occasional** | HeroUI | Native |
| Navigation keys | Arrows, page up/down, home, end | 1/5 (20%) | **Level 4: Occasional** | HeroUI | Native |
| Platform-aware keys | Meta key adapts to OS | 2/5 (40%) | **Level 3: Frequent** | Nuxt UI, HeroUI | Native |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Standalone usage | Single Kbd component | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Grouped keys | Container for multiple keys | 1/5 (20%) | **Level 4: Occasional** | ShadCN | Native (KbdGroup) |
| Separator support | Text between keys (+ or space) | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Inline text integration | Within prose or instructions | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Button integration | Kbd inside button components | 1/5 (20%) | **Level 4: Occasional** | ShadCN | Composed |
| Tooltip integration | Kbd in tooltip content | 1/5 (20%) | **Level 4: Occasional** | ShadCN | Composed |
| Input group integration | Kbd in input addons | 1/5 (20%) | **Level 4: Occasional** | ShadCN | Composed |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size options | Multiple size variants | 3/5 (60%) | **Level 2: Common** | Nuxt UI, Mantine, Chakra UI | Native |
| Color options | Multiple color themes | 1/5 (20%) | **Level 4: Occasional** | Nuxt UI | Native |
| Visual styles | Outline, soft, subtle, solid variants | 1/5 (20%) | **Level 4: Occasional** | Nuxt UI | Native |
| Custom styling | className/class prop for Tailwind | 5/5 (100%) | **Level 1: Universal** | All | CSS-only |

### API Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Children-based content | Content as React children | 5/5 (100%) | **Level 1: Universal** | All | Composed |
| Value prop | String key value | 1/5 (20%) | **Level 4: Occasional** | Nuxt UI | Native |
| Keys prop | Array of predefined keys | 1/5 (20%) | **Level 4: Occasional** | HeroUI | Native |
| Dual content API | Both value prop and children | 1/5 (20%) | **Level 4: Occasional** | Nuxt UI | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Semantic HTML | Uses `<kbd>` element | 5/5 (100%) | **Level 1: Universal** | All | Native |
| Inline-flex display | Integrates with text flow | 2/5 (40%) | **Level 3: Frequent** | Chakra UI, Nuxt UI | Native |
| User-select disabled | Prevents text copying | 1/5 (20%) | **Level 4: Occasional** | Chakra UI | Native |
| Text uppercase | Uppercase transformation | 1/5 (20%) | **Level 4: Occasional** | Nuxt UI | Native |
| Slot-based styling | Multiple style injection points | 1/5 (20%) | **Level 4: Occasional** | HeroUI | Native |

## Notable Patterns

### Universal (100%)
- Semantic `<kbd>` HTML element
- Text content via children
- Single key display
- Key combinations (composed)
- Custom styling support
- Inline text integration

### Architectural Approaches

**Minimalist (ShadCN, Chakra UI, Mantine):**
- Simple API with children only
- No predefined key types
- Composition for combinations
- Maximum flexibility

**Value-Based (Nuxt UI):**
- Both children and value prop
- Platform-aware meta key
- Variant system (7 colors × 4 styles)
- Size tiers (sm, md, lg)

**Typed Keys (HeroUI):**
- 21 predefined key types
- TypeScript-first approach
- Icon support for modifier keys
- Slot-based styling architecture

### Common Key Combination Pattern

All frameworks use similar composition for shortcuts:

**ShadCN:**
```jsx
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>B</Kbd>
</KbdGroup>
```

**Others:**
```jsx
<div>
  <Kbd>Ctrl</Kbd> + <Kbd>B</Kbd>
</div>
```

### Platform-Specific Symbols

**Nuxt UI & HeroUI:**
Support `meta` key that intelligently displays:
- ⌘ on macOS
- Ctrl on Windows/Linux

This eliminates manual platform detection in application code.

### ShadCN Specializations
- KbdGroup component for grouping
- Extensive integration examples (Button, Tooltip, Input)
- Separator flexibility (text, spans, custom)
- Tailwind-first customization
- Copy-paste component model

### Chakra UI Specializations
- Theme-aware color system
- Focus-visible states for keyboard navigation
- User-select disabled
- Inline-flex for text flow
- Deep theming integration
- Automatic light/dark mode

### Nuxt UI Specializations
- Compound variant system (color × variant)
- Platform-aware meta key
- Dual content API (value prop + slot)
- Three size tiers with coordinated dimensions
- Text uppercase transformation
- v4.1.0 with active development

### Mantine Specializations
- Five size variants (xs, sm, md, lg, xl)
- Composition-based design philosophy
- Part of @mantine/core v8.3.6
- Unicode symbol support documented
- dir="ltr" for internationalization
- Minimal configuration approach

### HeroUI Specializations
- 21 predefined key types (TypeScript enum)
- Built-in icons for modifier keys
- Slot-based styling system (base, abbr, content)
- Server component compatible
- Comprehensive key coverage (modifier, action, navigation)
- Title attributes for accessibility

## Implementation Notes

### Installation

**ShadCN:**
```bash
pnpm dlx shadcn@latest add kbd
```

**Chakra UI:**
```jsx
import { Kbd } from '@chakra-ui/react'
```

**Nuxt UI:**
```vue
<UKbd>K</UKbd>
```

**Mantine:**
```tsx
import { Kbd } from '@mantine/core'
```

**HeroUI:**
```jsx
import { Kbd } from '@heroui/react'
```

### Basic Usage Comparison

**ShadCN:**
```jsx
<Kbd>⌘</Kbd>
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

**Chakra UI:**
```jsx
<Kbd>Shift + Tab</Kbd>
```

**Nuxt UI:**
```vue
<UKbd value="meta" />
<UKbd>K</UKbd>
```

**Mantine:**
```tsx
<Kbd>⌘</Kbd> + <Kbd>Shift</Kbd>
```

**HeroUI:**
```jsx
<Kbd keys={["command"]}>K</Kbd>
<Kbd keys={["command", "shift"]}>N</Kbd>
```

### Size System Comparison

**Nuxt UI (3 sizes):**
- sm: h-4, min-w-16px, text-10px
- md: h-5, min-w-20px, text-11px
- lg: h-6, min-w-24px, text-12px

**Mantine (5 sizes):**
- xs, sm, md, lg, xl (specific dimensions not documented)

**Chakra UI:**
- Default small size only (not configurable via prop)

**ShadCN & HeroUI:**
- No size prop (CSS-only customization)

### Key Combination Approaches

**Explicit Container (ShadCN):**
```jsx
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

**Composition (Most frameworks):**
```jsx
<div className="flex gap-1">
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>K</Kbd>
</div>
```

**Native Array (HeroUI):**
```jsx
<Kbd keys={["command", "shift"]}>N</Kbd>
```

## Sophisticated Design Patterns

### Nuxt UI - Platform-Aware Meta Key Rendering

**What it does**: The `value="meta"` prop automatically renders the correct modifier key symbol based on the user's operating system—displaying ⌘ on macOS and Ctrl on Windows/Linux. This eliminates the need for application-level platform detection and conditional rendering when documenting cross-platform keyboard shortcuts.

```vue
<!-- Automatically adapts to user's platform -->
<UKbd value="meta" />  <!-- Shows ⌘ on macOS, Ctrl on others -->

<!-- Used in typical shortcut patterns -->
<div class="flex gap-1">
  <UKbd value="meta" />
  <span>+</span>
  <UKbd>K</UKbd>
</div>
```

**Why it's sophisticated**: Most frameworks require developers to manually detect the operating system and render different content accordingly. Nuxt UI encapsulates this logic at the component level, treating platform awareness as a first-class concern. The value "meta" is a domain-specific abstraction that acknowledges the real-world fact that keyboard documentation spans multiple platforms with different visual conventions. This pattern addresses a subtle but pervasive problem in cross-platform UI: reducing cognitive load for developers and preventing mistakes in platform-specific keyboard documentation.

**Evidence of design maturity**:
- Recognizes that keyboard documentation is inherently cross-platform and builds this into the component's vocabulary
- The abstraction is discoverable (a developer reading `value="meta"` immediately understands its purpose without consulting documentation)
- Reduces boilerplate: developers write one line instead of conditional platform detection logic scattered throughout their codebase
- Demonstrates understanding that some component concerns (platform specificity) benefit from being expressed declaratively rather than imperatively

---

### ShadCN - Semantic Key Grouping Container

**What it does**: The `KbdGroup` component provides an explicit semantic container for grouping multiple keyboard keys, enabling developers to represent keyboard shortcuts as composable units while preserving semantic meaning. This pattern allows flexible separator support (text, symbols, or custom elements) while maintaining a clear, intentional structure for multi-key combinations.

```jsx
// Explicit grouping with semantic intent
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>B</Kbd>
</KbdGroup>

// Flexible separators
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>B</Kbd>
</KbdGroup>

// Platform-aware symbols
<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>⇧</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

**Why it's sophisticated**: Most frameworks require developers to compose keyboard shortcuts using generic containers (divs with flex layout) or plain text separators ("+"). ShadCN recognizes that keyboard combinations are conceptually distinct entities deserving their own component abstraction. The KbdGroup pattern encapsulates the layout and semantic intent of "a group of keys that together form a shortcut." This approach surfaces an important design insight: grouping isn't just a visual concern, it's a semantic one. Developers using KbdGroup communicate their intent more clearly, and future maintainers understand that a set of Kbd elements belong together as a logical unit.

**Evidence of design maturity**:
- Provides a distinct component for a distinct concept (single key vs. key combination), rather than forcing developers to infer intent from layout
- Enables flexible separator patterns while maintaining structural consistency
- Creates an extension point for future features (e.g., conflict detection, visual validation of keyboard combos)
- Demonstrates recognition that composition alone isn't sufficient; explicit grouping semantics matter for clarity and maintainability

---

### HeroUI - Slot-Based Styling Architecture

**What it does**: Components expose multiple named styling slots (`base`, `abbr`, `content`) that can be independently styled via the `classNames` prop, enabling fine-grained visual control over distinct parts of the keyboard key representation without requiring CSS overrides or breaking encapsulation.

```jsx
// Fine-grained styling control via slots
<Kbd
  keys={["command"]}
  classNames={{
    base: "custom-container-style",      // Overall wrapping element
    abbr: "custom-key-badge-style",      // Individual key styling
    content: "custom-text-style"         // Main content area
  }}
>
  K
</Kbd>
```

**Why it's sophisticated**: Traditional approaches force developers to either accept the component's default styling or override styles at the CSS level (brittle, global scope risk) or use className props for the entire component (monolithic, all-or-nothing customization). HeroUI's slot system recognizes that keyboard keys have multiple distinct visual parts—the container, the individual key badges, and the text content—and assigns each its own customization point. This pattern is non-obvious because it requires thinking about component internals as a first-class API concern, not an implementation detail. It demonstrates sophisticated thinking about the tension between encapsulation and customization: slots provide controlled leakage that improves DX without sacrificing predictability.

**Evidence of design maturity**:
- Names slots semantically (abbr for "abbreviation" suggesting keyboard-specific understanding), showing intent beyond generic "left/right/center"
- Allows granular styling control without exposing the component's DOM structure to CSS selectors
- Provides TypeScript-safe customization (classNames is a typed Partial<Record>), preventing invalid slot names
- Demonstrates understanding that visual components need to balance framework integrity with real-world customization pressure

---

## Accessibility Considerations

### Common Patterns Across Frameworks

**Semantic HTML:**
All frameworks use the `<kbd>` HTML element, providing:
- Proper semantic meaning for screen readers
- Standard browser handling
- Appropriate text-to-speech pronunciation

**Screen Reader Support:**
- Content announced as "keyboard input"
- Text content read naturally
- No special ARIA attributes needed (semantic element sufficient)

**Non-Interactive Nature:**
- Component is display-only
- No keyboard navigation required
- No focus management needed
- Not part of tab order

### Framework-Specific Accessibility

**Chakra UI:**
- Focus-visible states for when Kbd is within focusable context
- User-select disabled prevents accidental copying

**HeroUI:**
- Title attributes on command keys
- Platform-specific key descriptions

**Nuxt UI:**
- Platform-aware meta key improves comprehension
- Visual clarity through variant combinations

## Design Philosophy Differences

### Minimalist Approach (ShadCN, Chakra UI, Mantine)
- **Philosophy**: Simple, focused components
- **API**: Children-based content only
- **Flexibility**: Maximum (no opinions)
- **Customization**: External (CSS/Tailwind)
- **Audience**: Developers who want control

### Variant System (Nuxt UI)
- **Philosophy**: Comprehensive theming
- **API**: Size, color, variant props
- **Flexibility**: Structured options
- **Customization**: Built-in + CSS
- **Audience**: Rapid development

### Type System (HeroUI)
- **Philosophy**: Type-safe, comprehensive
- **API**: Predefined key types with icons
- **Flexibility**: Guided choices
- **Customization**: Slot-based
- **Audience**: TypeScript developers

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **Documentation** - Showing keyboard shortcuts in help text
2. **Tooltips** - Displaying shortcuts in hover states
3. **Command palettes** - Showing available key bindings
4. **Onboarding** - Teaching keyboard navigation
5. **Accessibility info** - Communicating keyboard alternatives

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Chakra UI](./chakra-ui/usage-patterns.md)
- [Nuxt UI](./nuxt-ui/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
- [HeroUI](./heroui/usage-patterns.md)

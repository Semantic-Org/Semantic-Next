# Component Pattern Research: Code

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3 (Chakra UI, Mantine, HeroUI)
- Date: 2025-11-05
- Unique patterns identified: 15+ distinct patterns across semantic HTML, styling, and theme integration

## Component Definition Consensus

Code is an inline typography component that displays short code snippets, technical terms, or programming-related text within flowing content. All three frameworks consistently conceptualize Code as:

- **Core purpose**: Display inline code references with semantic HTML (`<code>` element) and visual styling that distinguishes code from regular text
- **Mental model**: A presentational wrapper for inline code that provides consistent styling without syntax highlighting capabilities
- **Semantic meaning**: Uses semantic `<code>` HTML element to indicate computer code, providing meaning to assistive technologies

**Key observation**: Code is universally positioned as an **inline-only** or **inline-first** component - all frameworks design it primarily for short code snippets within prose, not for multi-line code blocks (though Mantine uniquely supports both modes).

## Terminology Variations

### Component Names
- **Code** (3/3): Universal naming across all frameworks

### Display Modes
- **Inline only** (2/3): Chakra UI, HeroUI - render only `<code>` elements
- **Inline + Block** (1/3): Mantine - `block` prop switches to `<pre>` element

### Color Props
- **colorPalette** (1/3): Chakra UI - `colorPalette="teal"`
- **color** (2/3): Mantine, HeroUI - `color="blue"` or `color="primary"`

### Size Control
- **Style props** (1/3): Chakra UI - via fontSize and other style props
- **No explicit sizes** (1/3): Mantine - no size prop documented
- **size prop** (1/3): HeroUI - `size="sm|md|lg"`

## Pattern Inventory

### Semantic HTML Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| `<code>` element | Semantic HTML code element | 3/3 (100%) | Level 1 | All |
| Inline display | Default inline rendering | 3/3 (100%) | Level 1 | All |
| `<pre>` element | Block preformatted element | 1/3 (33%) | Level 4 | Mantine (block prop) |
| Monospace font | Automatic monospace typography | 3/3 (100%) | Level 1 | All |

### Styling Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Background color | Subtle background for contrast | 3/3 (100%) | Level 1 | All |
| Text color | Customizable foreground color | 3/3 (100%) | Level 1 | All |
| Border styling | Borders or outlines | 2/3 (67%) | Level 3 | Chakra UI (muted borders), HeroUI (implicit) |
| Border radius | Rounded corners | 3/3 (100%) | Level 1 | All |
| Padding | Internal spacing | 3/3 (100%) | Level 1 | All |

### Color Customization Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Theme color palette | Framework color system | 3/3 (100%) | Level 1 | All |
| Semantic colors | Meaning-based colors | 1/3 (33%) | Level 4 | HeroUI (success/warning/danger) |
| Custom color values | Direct color specification | 2/3 (67%) | Level 3 | Mantine (CSS vars), Chakra (style props) |
| Dark mode support | Automatic theme adaptation | 3/3 (100%) | Level 1 | All |

### Size and Typography Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size variants | Predefined size options | 1/3 (33%) | Level 4 | HeroUI (sm/md/lg) |
| Style prop sizing | Manual size control | 1/3 (33%) | Level 4 | Chakra UI (fontSize, etc.) |
| Default sizing | Single default size | 1/3 (33%) | Level 4 | Mantine |
| Font family | Monospace font stack | 3/3 (100%) | Level 1 | All |
| Line height | Typography integration | 3/3 (100%) | Level 1 | All |

### Display Mode Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Inline-only | Code renders inline only | 2/3 (67%) | Level 3 | Chakra UI, HeroUI |
| Block mode | Multi-line code block support | 1/3 (33%) | Level 4 | Mantine (block prop) |
| Preserved formatting | Whitespace preservation | 1/3 (33%) | Level 4 | Mantine (via `<pre>`) |

### Theme Integration Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Design token integration | Uses framework tokens | 3/3 (100%) | Level 1 | All |
| Color palette system | Framework color naming | 3/3 (100%) | Level 1 | All |
| Automatic dark mode | Theme-aware colors | 3/3 (100%) | Level 1 | All |
| Typography scale | Font size from theme | 3/3 (100%) | Level 1 | All |
| Spacing scale | Padding from theme | 3/3 (100%) | Level 1 | All |

### API Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Minimal props | Few dedicated props | 2/3 (67%) | Level 3 | Mantine (3 props), HeroUI (4 props) |
| Style props system | Comprehensive styling API | 1/3 (33%) | Level 4 | Chakra UI (all Box props) |
| Children content | ReactNode children | 3/3 (100%) | Level 1 | All |
| No syntax highlighting | No built-in highlighting | 3/3 (100%) | Level 1 | All |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Semantic HTML | `<code>` element usage | 3/3 (100%) | Level 1 | All |
| Screen reader support | Inherent from semantics | 3/3 (100%) | Level 1 | All |
| No ARIA additions | Relies on native semantics | 3/3 (100%) | Level 1 | All |
| Keyboard accessibility | No special keyboard needs | 3/3 (100%) | Level 1 | All |

## Notable Patterns

### Highly Adopted (Level 1, 100% adoption)

**Universal patterns across all Code implementations:**

- **Semantic `<code>` element**: All use proper HTML semantics
- **Inline display**: All render inline with text by default
- **Monospace typography**: All apply monospace fonts automatically
- **Background coloring**: All provide subtle background for distinction
- **Text color customization**: All support color changes
- **Border radius**: All include rounded corners
- **Internal padding**: All add padding for visual comfort
- **Theme integration**: All connect to framework design systems
- **Color palette support**: All use framework color naming
- **Dark mode compatibility**: All adapt to theme mode changes
- **Typography scale**: All inherit from theme typography
- **Spacing scale**: All use theme spacing values
- **Children content**: All accept ReactNode children
- **No syntax highlighting**: None provide syntax highlighting
- **Screen reader support**: All rely on semantic HTML

### Emerging Patterns (Level 3, 67% adoption)

**Patterns with moderate adoption:**

- **Inline-only design** (67%): Chakra UI, HeroUI focus solely on inline use
- **Border styling** (67%): Chakra, HeroUI include borders or outlines
- **Custom color values** (67%): Mantine, Chakra support direct color specification
- **Minimal props** (67%): Mantine, HeroUI keep API surface small

### Unique Innovations

**Framework-specific features:**

**Chakra UI**:
- **Full style props system**: Access to all Chakra Box props (spacing, layout, typography)
- **colorPalette prop**: Uses Chakra's palette naming (`colorPalette="teal"`)
- **Design token integration**: Deep integration with Chakra token system
- **Polymorphic rendering**: `as` prop to render as different elements
- **Recipe-based theming**: v3 theming architecture support

**Mantine**:
- **Dual-mode component**: Only framework supporting both inline and block modes
- **Block prop**: Switches from `<code>` to `<pre>` element
- **Preserved formatting**: Block mode preserves whitespace and line breaks
- **Color scale notation**: Uses Mantine's dot notation (`color="blue.9"`)
- **CSS custom properties**: Supports `var(--mantine-color-*)` values
- **Text color prop**: Separate `c` prop for text color
- **Styles API**: Granular style customization system

**HeroUI**:
- **Size variants**: Only framework with explicit size prop (`sm/md/lg`)
- **Semantic color system**: Six semantic variants (default/primary/secondary/success/warning/danger)
- **Border radius control**: Five radius options including `full` for pill shape
- **Server Component support**: Works with Next.js App Router and RSC
- **Minimal API**: Only 4 props total - most focused implementation

## Pattern Correlations

### When semantic HTML is prioritized:
- Inline display present (3/3, 100%)
- Monospace fonts automatic (3/3, 100%)
- No ARIA additions needed (3/3, 100%)
- Suggests: Semantic foundation reduces accessibility work

### When theme integration is strong:
- Color palettes present (3/3, 100%)
- Dark mode support automatic (3/3, 100%)
- Typography scale used (3/3, 100%)
- Suggests: Theme integration is comprehensive

### When API is minimal:
- Focus on essential props (2/2, 100%)
- No syntax highlighting (2/2, 100%)
- Clear use case (inline code) (2/2, 100%)
- Suggests: Simplicity correlates with focused purpose

## Implementation Notes

### Common Technical Approaches

1. **Semantic HTML Foundation**:
   ```html
   <code>content</code>  <!-- All frameworks -->
   <pre>content</pre>    <!-- Mantine with block prop -->
   ```

2. **Monospace Typography**:
   - System monospace stack (SFMono, Menlo, Monaco, Consolas, etc.)
   - Inherited from theme configuration
   - Consistent across frameworks

3. **Visual Distinction**:
   - Background: Subtle color (often gray-based)
   - Padding: Small internal spacing (px/py)
   - Border radius: Rounded corners (typically sm or md)
   - Border: Optional subtle border (Chakra, HeroUI)

4. **Color Customization**:
   - **Chakra**: `colorPalette="teal"` (palette-based)
   - **Mantine**: `color="blue.9"` (scale-based)
   - **HeroUI**: `color="primary"` (semantic-based)

5. **Theme Integration**:
   - Colors resolve from theme palette
   - Spacing values from theme scale
   - Typography inherits theme fonts
   - Dark mode colors auto-switch

### Performance Considerations

- **Lightweight**: All implementations are minimal wrappers
- **No JavaScript logic**: Pure presentation components
- **CSS-based**: Styling via CSS, no runtime computation
- **Semantic HTML**: Browser-native rendering performance
- **No syntax highlighting**: Avoids heavy parsing/highlighting libraries

### Framework-Specific Strengths

**Chakra UI**:
- Most flexible via style props system
- Best for custom styling needs
- Deepest theme integration
- Polymorphic rendering capability

**Mantine**:
- Only dual-mode implementation (inline + block)
- Best for versatile code display needs
- CSS custom properties support
- Styles API for advanced customization

**HeroUI**:
- Clearest API (only 4 props)
- Best size variant system
- Most semantic color options
- Server Component compatible

## Architectural Insights

### Three Implementation Philosophies

1. **Flexible (Chakra UI)**:
   - Style props system provides maximum control
   - Inline-only but highly customizable
   - Philosophy: Give developers full styling power

2. **Versatile (Mantine)**:
   - Dual-mode for inline and block use cases
   - Moderate props with theme integration
   - Philosophy: Handle both inline and block needs

3. **Focused (HeroUI)**:
   - Minimal prop surface (4 props)
   - Clear size and color options
   - Philosophy: Simple API for common inline needs

### API Design Patterns

**Minimalist approach (HeroUI)**:
- Only essential props
- Semantic color naming
- Explicit size variants

**Style props approach (Chakra)**:
- Core color prop + full style props
- Maximum flexibility
- Framework consistency

**Hybrid approach (Mantine)**:
- Core props (block, color, c)
- Additional Styles API
- Balance of simplicity and power

### Code vs Related Components

| Aspect | Code | Code Block | Kbd | Pre |
|--------|------|------------|-----|-----|
| Purpose | Inline code | Multi-line code | Keyboard keys | Preformatted text |
| HTML | `<code>` | `<pre><code>` | `<kbd>` | `<pre>` |
| Display | Inline | Block | Inline | Block |
| Highlighting | No | Maybe | No | No |
| Use case | Technical terms | Examples | Shortcuts | Formatted text |

## Recommendations for Implementation

Based on pattern prevalence, a robust Code implementation should include:

### Essential Features (Level 1, 100% adoption)
1. Semantic `<code>` HTML element
2. Inline display (inline or inline-flex)
3. Monospace font family
4. Background color (subtle, theme-based)
5. Text color customization
6. Border radius (rounded corners)
7. Internal padding (px/py spacing)
8. Theme color palette integration
9. Automatic dark mode support
10. Typography scale inheritance
11. Spacing scale integration
12. ReactNode children support
13. No syntax highlighting (keep simple)
14. Screen reader compatibility (via semantics)

### Recommended Features (Level 3, 67% adoption)
1. Border styling (subtle outline)
2. Custom color value support (CSS vars, direct colors)
3. Minimal props API (keep surface small)

### Optional Innovations (<67% adoption)
1. Block mode (`<pre>` element support)
2. Size variants (sm/md/lg)
3. Semantic color system (success/warning/danger)
4. Border radius variants (none/sm/md/lg/full)
5. Style props system (comprehensive styling)
6. Polymorphic rendering (as prop)
7. Text color prop (separate from background)
8. Preserved formatting (whitespace)

### API Design Recommendations

**Choose Approach**:
1. **Minimal** (HeroUI style) - for simplicity
2. **Style props** (Chakra style) - for flexibility
3. **Dual-mode** (Mantine style) - for versatility

**Essential Props**:
- `children`: ReactNode (required)
- `color`: string (theme color)
- Optional: `size`, `radius`, `block`

**Avoid**:
- Syntax highlighting (separate concern)
- Line numbers (use dedicated code block)
- Copy functionality (separate feature)
- Language detection (external responsibility)

### Theme Integration Strategy

1. **Color system**: Resolve from theme palette
2. **Spacing**: Use theme spacing scale
3. **Typography**: Monospace from theme fonts
4. **Dark mode**: Auto-switch via theme
5. **Defaults**: Theme-defined default colors

## Testing Considerations

Comprehensive testing should cover:

1. **Semantic HTML**:
   - Renders `<code>` element
   - Block mode renders `<pre>` (if supported)
   - Proper semantic structure

2. **Inline Display**:
   - Flows with text inline
   - No line breaks added
   - Proper alignment with text

3. **Typography**:
   - Monospace font applied
   - Font size appropriate
   - Line height correct

4. **Styling**:
   - Background color renders
   - Text color applies
   - Border radius present
   - Padding correct

5. **Color Variants**:
   - Theme colors resolve correctly
   - Custom colors work
   - Dark mode switches properly

6. **Theme Integration**:
   - Uses theme values
   - Responds to theme changes
   - Design tokens resolve

7. **Accessibility**:
   - Screen readers recognize code
   - No accessibility violations
   - Keyboard accessible (inherit)

8. **Edge Cases**:
   - Empty children
   - Long text wrapping
   - Special characters
   - Nested elements

## Framework Comparison Summary

| Feature | Chakra UI | Mantine | HeroUI |
|---------|-----------|---------|--------|
| **HTML element** | `<code>` | `<code>` or `<pre>` | `<code>` |
| **Display modes** | Inline only | Inline + Block | Inline only |
| **Color prop** | colorPalette | color | color |
| **Color system** | Palette (teal/blue) | Scale (blue.9) | Semantic (primary/success) |
| **Size variants** | ❌ Via style props | ❌ No | ✅ sm/md/lg |
| **Border radius** | ✅ Via theme | ✅ Default | ✅ none/sm/md/lg/full |
| **Custom colors** | ✅ Style props | ✅ CSS vars | ⚠️ Via color prop |
| **Style props** | ✅ Full Box props | ⚠️ Styles API | ❌ No |
| **Semantic colors** | ❌ No | ❌ No | ✅ 6 variants |
| **Block mode** | ❌ No (separate component) | ✅ block prop | ❌ No (separate component) |
| **API complexity** | High (all style props) | Low (3 props) | Lowest (4 props) |
| **Flexibility** | Highest | Medium | Lowest |
| **Focus** | Customization | Versatility | Simplicity |

## Key Takeaways

### Design Patterns:
1. **Semantic HTML is universal**: All use `<code>` element
2. **Inline-first design**: Primarily for inline code references
3. **Theme integration standard**: All connect to design systems
4. **No syntax highlighting**: All are presentational wrappers only
5. **Minimal complexity**: All implementations are lightweight

### Implementation Approaches:
1. **Inline-only** (Chakra, HeroUI): Focus on inline use case
2. **Dual-mode** (Mantine): Handle inline and block
3. **Style props** (Chakra): Maximum flexibility via styling API
4. **Minimal API** (HeroUI, Mantine): Keep props surface small

### Framework Trends:
1. **Moving toward**: Semantic HTML, theme integration, dark mode support
2. **Moving away from**: Built-in syntax highlighting, complex features
3. **Staying simple**: Code as presentational wrapper, not full solution

### Selection Criteria:
- **Need maximum customization**: Chakra UI (style props system)
- **Need block mode too**: Mantine (inline + block with block prop)
- **Want simplicity**: HeroUI (4 props, clear options)
- **Inline focus**: Chakra UI or HeroUI
- **Server Components**: HeroUI (Next.js App Router support)

### Common Misconceptions:
1. **Not a syntax highlighter**: All frameworks keep this separate
2. **Not for code blocks**: Primarily inline (except Mantine)
3. **Not interactive**: No copy buttons or execution
4. **Not language-aware**: No parsing or validation

## Raw Data

Individual framework reports available at:
- `/ai/research/code/chakra-ui/usage-patterns.md`
- `/ai/research/code/mantine/usage-patterns.md`
- `/ai/research/code/heroui/usage-patterns.md`

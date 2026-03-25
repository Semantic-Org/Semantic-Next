# Component Pattern Research: Carousel

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 5
- Date: 2025-11-10
- Unique patterns identified: 25+

## Component Definition Consensus

Across all frameworks, the Carousel component is consistently conceptualized as:

- **Core purpose**: A container that displays content in a sequential, rotating format to conserve space while presenting multiple items of equal importance
- **Mental model**: A "viewport window" or "revolving door" that shows one or more items at a time from a larger collection, allowing users to navigate through the sequence
- **Semantic meaning**: Communicates a browsable collection of related content where users can move forward/backward through items without leaving context

All frameworks converge on viewing the carousel as fundamentally a **space-saving navigation pattern** for presenting sequential content with user-controlled progression.

## Terminology Variations

### Component Names
- **Carousel** (5/5 frameworks) - Universal term

### Prop/Config Names
- **Orientation**: `orientation` (Mantine, Nuxt UI, ShadCN, PrimeReact) vs embedded in `dotPosition` (Ant Design)
- **Looping**: `infinite` (Ant Design) = `loop` (Mantine, Nuxt UI, ShadCN) = `circular` (PrimeReact)
- **Visible items**: `slidesToShow` (Ant Design) = `slideSize` (Mantine) = `basis-*` utility (ShadCN, Nuxt UI) = `numVisible` (PrimeReact)
- **Auto-rotation**: `autoplay` (Ant Design, Nuxt UI) = `autoplayInterval` (PrimeReact) = plugin-based (Mantine, ShadCN)

### Architecture Approaches
- **Direct implementation**: 0/5 frameworks
- **Wrapper around Embla Carousel**: 3/5 (Mantine, Nuxt UI, ShadCN)
- **Wrapper around react-slick**: 1/5 (Ant Design)
- **Custom implementation**: 1/5 (PrimeReact)

## Pattern Inventory

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Image slides | Display image content | 5/5 (100%) | **Level 1** | All | Composed (5/5) |
| Card slides | Display card components | 5/5 (100%) | **Level 1** | All | Composed (5/5) |
| Custom content | Arbitrary JSX/content | 5/5 (100%) | **Level 1** | All | Composed (5/5) |
| Multiple items per slide | Show 2+ items simultaneously | 5/5 (100%) | **Level 1** | All | Native: 3/5 (Ant, Mantine, PrimeReact), CSS-only: 2/5 (ShadCN, Nuxt UI) |

### Type Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Horizontal scroll | Default left-right scrolling | 5/5 (100%) | **Level 1** | All | Native (5/5) |
| Vertical scroll | Top-down scrolling | 5/5 (100%) | **Level 1** | All | Native: 4/5 (Mantine, Nuxt UI, ShadCN, PrimeReact), CSS-only: 1/5 (Ant) |
| Fade transition | Crossfade between items | 3/5 (60%) | **Level 3** | Ant Design, Mantine, Nuxt UI | Native: 2/5 (Ant, Nuxt UI), Plugin: 1/5 (Mantine) |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Autoplay | Automatic progression | 5/5 (100%) | **Level 1** | All | Native: 3/5 (Ant, Nuxt UI, PrimeReact), Plugin: 2/5 (Mantine, ShadCN) |
| Pause on hover | Stop autoplay on mouse enter | 3/5 (60%) | **Level 3** | Ant, Mantine, Nuxt UI | Native: 2/5 (Ant, Nuxt UI), Composed: 1/5 (Mantine). Note: ShadCN and PrimeReact likely support but not documented |
| Loading state | Display loading indicator | 0/5 (0%) | **Level 5** | None | Not supported |

### Navigation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Arrow controls | Prev/Next buttons | 5/5 (100%) | **Level 1** | All | Native: 4/5 (Ant, Mantine, Nuxt UI, PrimeReact), Composed: 1/5 (ShadCN) |
| Navigation dots | Page indicators | 4/5 (80%) | **Level 2** | Ant, Mantine, Nuxt UI, PrimeReact | Native (4/4) |
| Thumbnail navigation | Clickable thumbnail strip | 1/5 (20%) | **Level 4** | Nuxt UI | Composed (documented pattern) |

### Interaction Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Swipe/drag support | Touch/mouse dragging | 5/5 (100%) | **Level 1** | All | Native (5/5, via underlying libraries) |
| Infinite loop | Continuous scrolling | 5/5 (100%) | **Level 1** | All | Native (5/5) |
| Speed control | Transition/autoplay timing | 5/5 (100%) | **Level 1** | All | Native (5/5) |
| Keyboard navigation | Arrow key support | 5/5 (100%) | **Level 1** | All | Native (5/5, via libraries) |

### Responsive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Breakpoint configuration | Adjust behavior per screen size | 4/5 (80%) | **Level 2** | Ant, Mantine, Nuxt UI, PrimeReact | Native: 3/5 (Ant, Mantine, PrimeReact), CSS-only: 1/5 (Nuxt UI) |
| Container queries | Respond to container size | 1/5 (20%) | **Level 4** | Mantine | Native (alternative mode) |
| Responsive item count | Change visible items by viewport | 5/5 (100%) | **Level 1** | All | Various approaches |

### Customization Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Custom arrow icons | Replace default arrows | 5/5 (100%) | **Level 1** | All | Native (5/5) |
| Dot position control | Place dots on different sides | 1/5 (20%) | **Level 4** | Ant Design | Native (top/bottom/left/right) |
| Programmatic control | API for external control | 5/5 (100%) | **Level 1** | All | Native (5/5) |
| Event callbacks | Hooks for state changes | 5/5 (100%) | **Level 1** | All | Native (5/5) |

### Plugin/Extension Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Plugin architecture | Extensibility via plugins | 3/5 (60%) | **Level 3** | Mantine, Nuxt UI, ShadCN | Native (Embla-based) |
| Auto-scroll | Continuous motion animation | 1/5 (20%) | **Level 4** | Nuxt UI | Plugin |
| Auto-height | Dynamic container height | 2/5 (40%) | **Level 3** | Mantine, Nuxt UI | Plugin |
| Wheel gestures | Mouse wheel navigation | 2/5 (40%) | **Level 3** | Mantine, Nuxt UI | Plugin |
| Class name toggling | CSS class on active slide | 1/5 (20%) | **Level 4** | Nuxt UI | Plugin (`.is-snapped`) |

### Advanced Features
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Alignment control | Align slides (start/center/end) | 5/5 (100%) | **Level 1** | All | Native (5/5) |
| Drag-free scrolling | Stop anywhere without snap | 2/5 (40%) | **Level 3** | Mantine, Nuxt UI | Native (Embla option) |
| Accessibility attributes | ARIA labels, roles, live regions | 5/5 (100%) | **Level 1** | All | Native (5/5) |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Image, card, and custom content support through composition
- Horizontal scrolling as default behavior
- Autoplay functionality (though implementation varies)
- Arrow navigation controls
- Swipe/drag support for touch devices
- Infinite looping capability
- Speed/timing control
- Programmatic API access
- Event callbacks for state changes
- Keyboard navigation
- Accessibility features (ARIA)
- Alignment control

**Very Common Patterns (80%+ adoption):**
- Vertical scrolling orientation (100% support, varying implementation)
- Navigation dots/indicators (80% - ShadCN omits as it favors composition)
- Responsive breakpoint configuration (80% - ShadCN uses CSS-only approach)
- Multiple items per slide (100% support via different methods)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-60%):**
- **Plugin architecture** (60%): Embla-based frameworks leverage plugin ecosystem; others use monolithic approach
- **Fade transitions** (60%): Supported but not universally prioritized
- **Pause on hover** (60%): Documented in 3/5, likely supported in 2 more
- **Auto-height adjustment** (40%): Growing interest in dynamic sizing
- **Wheel gesture support** (40%): Mouse wheel as navigation input
- **Drag-free scrolling** (40%): Free-form positioning without snap points

**Occasional Patterns (20-40%):**
- **Container queries** (20%): Only Mantine offers as alternative to media queries
- **Thumbnail navigation** (20%): Pattern documented in Nuxt UI as common use case
- **Dot position control** (20%): Ant Design's unique 4-way positioning (top/bottom/left/right)
- **Auto-scroll continuous motion** (20%): Specialized animation effect
- **Class name state toggles** (20%): CSS-driven effects via active slide classes

### Unique Innovations (Level 5)

**Framework-Specific Patterns:**

1. **Ant Design - Dual Documentation Approach**
   - Wraps react-slick but documents minimal custom API
   - Users reference external library for advanced features
   - Trade-off: simplicity vs. complete documentation

2. **Ant Design - Four-Way Dot Positioning**
   - `dotPosition` prop allows top/bottom/left/right placement
   - Only framework with explicit vertical dot positioning
   - Unique in offering this level of indicator control

3. **Mantine - Dual Responsive Systems**
   - Offers both media queries AND container queries
   - `type="media"` vs `type="container"` modes
   - Forward-thinking approach to responsive design

4. **Nuxt UI - Seven Plugin Modules**
   - Most comprehensive plugin documentation
   - Includes auto-scroll, class-names, wheel-gestures
   - Demonstrates advanced Embla ecosystem integration

5. **PrimeReact - Accessibility Excellence**
   - Most detailed accessibility documentation
   - Explicit ARIA live region management
   - Documented keyboard interaction patterns
   - Separates autoplay and non-autoplay screen reader behavior

6. **ShadCN - Composition-First Architecture**
   - Breaks carousel into 5 separate components
   - Minimal wrapper around Embla
   - Developers compose functionality rather than configure props
   - No built-in dots (requires custom implementation)

7. **ShadCN - CLI Installation Model**
   - Downloads source code into project vs npm package
   - Full customization control at cost of manual updates
   - Unique distribution approach in UI library space

## Pattern Correlations

### Positive Correlations

**Embla Carousel → Plugin Architecture**
- When framework wraps Embla (3/3 frameworks) → Plugin support is present
- Mantine, Nuxt UI, ShadCN all leverage Embla's plugin ecosystem
- Correlation: 100%

**Plugin Architecture → Auto-Height Support**
- When plugins supported (3/3) → Auto-height available via plugin
- Mantine and Nuxt UI document auto-height plugin usage
- Correlation: 67%

**Native Breakpoint Config → Native Dot Positioning**
- When breakpoints are native (3/3) → Dots are also native
- Ant Design, Mantine, PrimeReact follow this pattern
- Correlation: 100%

**Embla-Based → Vertical Orientation Native**
- All Embla-based frameworks (3/3) have native vertical support
- Non-Embla frameworks show variation (PrimeReact native, Ant CSS-only)
- Correlation: 100% for Embla-based

**External Library Wrapper → No Loading State**
- All frameworks (5/5) lack built-in loading states
- Loading is considered external concern (data fetching layer)
- Correlation: 100%

### Negative Correlations

**Composition-First Design ⊗ Built-in Dots**
- ShadCN uses composition pattern → No built-in dots component
- Favors custom implementation over opinionated defaults
- Trade-off: flexibility vs. convenience

**Thin Wrapper Philosophy ⊗ Complete Documentation**
- Ant Design (wraps react-slick) → References external docs
- ShadCN (wraps Embla) → References Embla docs for advanced features
- Trade-off: minimal abstraction vs. self-contained documentation

**CSS-Only Responsive ⊗ Native Breakpoint Props**
- ShadCN/Nuxt UI use Tailwind utilities → No breakpoint props
- Ant/Mantine/PrimeReact have breakpoint props → Less CSS-centric
- Architectural decision: configuration vs. styling layer

### Pattern Clusters

**Cluster 1: Embla-Based Modern Frameworks** (Mantine, Nuxt UI, ShadCN)
- Plugin architecture support
- Native vertical orientation
- Embla API access for programmatic control
- Event-driven architecture
- Drag-free scrolling option
- Auto-height plugin availability

**Cluster 2: Traditional Prop-Based Frameworks** (Ant Design, PrimeReact)
- Native breakpoint configuration
- Comprehensive prop APIs
- Built-in navigation dots
- Template/function-based rendering
- Self-contained implementations (PrimeReact) or established wrapper (Ant)

**Cluster 3: Autoplay Implementation Approaches**
- **Native boolean/config**: Ant Design, Nuxt UI, PrimeReact
- **Plugin-based**: Mantine, ShadCN
- Both approaches achieve same outcome with different extensibility trade-offs

## Implementation Notes

### Architectural Patterns

**Library Wrapper Dominance**: 4/5 frameworks wrap external carousel libraries rather than building from scratch
- **react-slick** (Ant Design): Mature but older library
- **Embla Carousel** (Mantine, Nuxt UI, ShadCN): Modern, plugin-based architecture
- **Custom** (PrimeReact): Full internal implementation

**Composition vs. Configuration Spectrum**:
- **Heavy Composition**: ShadCN (5 components), Nuxt UI (slot-based)
- **Balanced**: Mantine (`<Carousel.Slide>` pattern)
- **Configuration-Heavy**: PrimeReact (template functions), Ant Design (children-based)

### Naming Conventions

**Consistent Patterns**:
- `orientation`: 4/5 frameworks use this exact term
- `loop/infinite/circular`: Unanimous concept with terminology variation
- `autoplay`: Widely recognized term (even in plugin context)

**Divergent Patterns**:
- **Visible items**: No consensus (slidesToShow, slideSize, basis-*, numVisible)
- **Navigation controls**: arrows, controls, prev/next, nextButton/prevButton
- **Indicators**: dots, indicators, page dots, quick navigation

### API Design Philosophies

**Pass-Through Pattern**:
- Ant Design → react-slick props
- Mantine/Nuxt UI/ShadCN → Embla options
- Allows access to underlying library features without wrapper reimplementation

**Template Functions**:
- PrimeReact: `itemTemplate` function prop
- Ant Design: Children-based composition
- Mantine/Nuxt UI: Slot-based rendering
- ShadCN: Component composition

**Responsive Strategies**:
1. **Native breakpoint arrays**: Ant Design, PrimeReact (object arrays with breakpoint keys)
2. **Theme breakpoint objects**: Mantine (e.g., `{ base: '100%', sm: '50%' }`)
3. **CSS utility classes**: ShadCN, Nuxt UI (Tailwind responsive utilities)

### Documentation Approaches

**Self-Contained** (PrimeReact, Nuxt UI):
- Complete API reference in framework docs
- Minimal external references required
- Higher documentation maintenance burden

**Hybrid** (Mantine):
- Core features documented in framework
- Plugin features reference Embla docs
- Balance of convenience and completeness

**Reference-Heavy** (Ant Design, ShadCN):
- Basic usage documented
- Advanced features require external library documentation
- Lower maintenance but steeper learning curve

### Installation and Distribution

**Standard NPM Packages**: Ant Design, Mantine, Nuxt UI, PrimeReact
- Traditional package installation
- Automatic updates via package manager
- Library-controlled versioning

**Source Code Distribution**: ShadCN
- CLI downloads component source into project
- Full customization capability
- Manual update process
- Unique in carousel space

### Accessibility Implementation

**Universal Features** (5/5 frameworks):
- Keyboard navigation (arrow keys)
- Swipe/drag gestures
- Programmatic API access

**Best-in-Class** (PrimeReact):
- Explicit ARIA live region documentation
- Proper role assignments
- Hidden content management
- Separate screen reader behavior for autoplay/manual modes

**Library-Provided** (Embla-based):
- Accessibility handled by underlying Embla library
- Generally solid but less explicitly documented

## Sophisticated Design Patterns

### PrimeReact - Conditional ARIA Live Regions

**What it does**: PrimeReact dynamically adjusts its ARIA `live` attribute based on whether autoplay is active. When autoplay is enabled, it sets `aria-live="off"` to prevent screen readers from announcing every automatic slide transition. When in manual mode, it uses `aria-live="polite"` to announce user-initiated changes.

**Why it's sophisticated**: This solves a non-obvious accessibility problem that only emerges through real screen reader testing. Imagine being a blind user trying to read page content while a carousel announces "Slide 2 of 5... Slide 3 of 5..." every 3 seconds. It's the audio equivalent of a popup appearing while you're trying to read. Most developers would assume "more announcements = more accessible," but PrimeReact recognized that good accessibility sometimes means knowing when to be quiet. The pattern shows deep understanding that screen reader users need different feedback for user-initiated vs automatic actions.

**Evidence of design maturity**:
- Requires actual screen reader user testing to discover this pain point
- Shows restraint - resisting the urge to announce everything
- Demonstrates understanding of different interaction modes (manual vs automatic)
- Solves a problem that sighted developers rarely consider
- Indicates engagement with accessibility community feedback

This pattern is carousel-specific because carousels uniquely combine both automatic and manual progression modes, requiring different accessibility strategies for each.

### Ant Design - Four-Way Dot Positioning

**What it does**: Ant Design's `dotPosition` prop uniquely allows positioning pagination dots on all four sides of the carousel (top, bottom, left, right). When set to left or right, the dots automatically orient vertically. This is the only carousel implementation surveyed that provides built-in vertical dot positioning.

**Why it's sophisticated**: This addresses specific design system needs that emerge in real-world applications. Consider a carousel in a right-hand sidebar where bottom dots would be cut off, or a full-width hero carousel where side dots provide better visual balance. Most frameworks only support top/bottom positioning (if any choice at all), forcing developers to override CSS or restructure layouts. Ant Design anticipated these layout constraints and provided a complete solution. The automatic orientation switch (horizontal dots for top/bottom, vertical for left/right) shows attention to visual logic.

**Evidence of design maturity**:
- Solves real layout constraint problems in production applications
- Automatic orientation switching shows thoughtful interaction design
- Only framework to provide this level of positioning control
- Addresses edge cases like RTL layouts and constrained spaces
- Indicates feedback from enterprise users with diverse layout needs

This is carousel-specific because pagination dots are a carousel UI pattern, and the four-way positioning addresses unique carousel layout challenges in complex applications.

## Recommendations for Semantic UI

Based on this research, the following patterns show strong ecosystem consensus and should be prioritized:

### Essential Patterns (100% adoption)
1. **Content flexibility via composition** - All frameworks support arbitrary content
2. **Horizontal and vertical orientations** - Universal expectation
3. **Autoplay with configurable timing** - Standard feature (implementation approach flexible)
4. **Arrow navigation controls** - Universal navigation pattern
5. **Infinite looping option** - Expected carousel behavior
6. **Swipe/drag support** - Mobile-first expectation
7. **Programmatic API access** - Required for advanced use cases
8. **Event callbacks** - Integration with external state management
9. **Keyboard navigation** - Accessibility requirement
10. **Multiple items per slide** - Common layout pattern

### Recommended Patterns (60-80% adoption)
1. **Navigation dots/indicators** - 80% adoption, consider making native
2. **Vertical orientation support** - 100% presence but implementation varies
3. **Responsive breakpoint configuration** - 80% via props or CSS
4. **Fade transitions** - 60% support, common requested feature
5. **Pause on hover** - 60% documented (likely universal via autoplay plugins)

### Optional/Advanced Patterns
1. **Plugin architecture** - 60% adoption, consider for extensibility
2. **Container query support** - Emerging pattern (20% but growing)
3. **Thumbnail navigation** - 20% documented, common real-world pattern
4. **Auto-height adjustment** - 40% adoption, useful for dynamic content

### Patterns to Avoid
1. **Built-in loading states** - 0% adoption, considered external concern
2. **Complex built-in styling** - Frameworks favor customization over opinions

### Architecture Recommendations

**Consider Embla Carousel as foundation**:
- 3/5 modern frameworks use it
- Plugin ecosystem provides extensibility
- Active maintenance and modern architecture
- Accessibility built-in

**Favor composition over configuration**:
- Trend toward component composition (ShadCN, Nuxt UI leading)
- Balances flexibility with ease of use
- Aligns with modern React patterns

**Provide both native and CSS-responsive options**:
- Native props for common cases
- CSS utilities for fine-grained control
- Serve both developer preferences

**Document accessibility explicitly**:
- PrimeReact model shows value of detailed a11y docs
- ARIA patterns should be clearly documented
- Don't rely solely on library-provided accessibility

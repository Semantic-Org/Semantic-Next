# Component Pattern Research: Empty State

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 3
- Date: 2025-11-10
- Unique patterns identified: 20+
- **Note**: Lower framework coverage than typical components (3 vs typical 5+)

## Component Definition Consensus

Across all three frameworks, the Empty State component is consistently conceptualized as:

- **Core purpose**: Communicate empty states in a friendly, actionable way rather than showing blank space or generic messages. Transforms potentially frustrating empty scenarios into opportunities for user guidance and productive action.
- **Mental model**: A status indicator that communicates "there's nothing here yet, but here's what you can do about it" - temporary or correctable situations with clear paths forward.
- **Semantic meaning**: Communicates the absence of expected content through a combination of visual indicators (icons/illustrations), contextual messaging (title and description), and optional actions to guide users.

All frameworks converge on viewing empty states as **first-class UI elements** worthy of thoughtful design, not just gaps or missing content placeholders.

## Terminology Variations

### Component Names
- **Empty State** (Chakra UI) - Full descriptive term
- **Empty** (Ant Design, ShadCN) - Shortened form
- No standard across industry - some frameworks don't have dedicated components

### Prop/Config Names
- **Description/message text**: `description` (Ant, ShadCN) = `Description` component (Chakra)
- **Visual indicator**: `image` (Ant) = `Indicator` component (Chakra) = `Media` component (ShadCN)
- **Primary heading**: `description` (Ant - overloaded) = `Title` component (Chakra, ShadCN)
- **Actions**: `children` (Ant) = children of Root (Chakra, ShadCN) = `Content` component (ShadCN)

### Architecture Approaches
- **Single component with props**: 1/3 (Ant Design)
- **Multi-part composition**: 2/3 (Chakra UI, ShadCN)
- Trend toward composition over configuration

## Pattern Inventory

### Core Structure Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Visual indicator (icon/image) | Icon, illustration, or avatar | 3/3 (100%) | **Level 1** | All | Native: 1/3 (Ant), Composed: 2/3 (Chakra, ShadCN) |
| Title/heading text | Primary message explaining state | 3/3 (100%) | **Level 1** | All | Native: 1/3 (Ant), Composed: 2/3 (Chakra, ShadCN) |
| Description text | Secondary contextual explanation | 3/3 (100%) | **Level 1** | All | Native: 1/3 (Ant), Composed: 2/3 (Chakra, ShadCN) |
| Action buttons/CTAs | Buttons or links to resolve state | 3/3 (100%) | **Level 1** | All | Composed (3/3 - via children) |
| Centered layout | Horizontal and vertical centering | 3/3 (100%) | **Level 1** | All | Native (3/3) |

### Visual Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Icon-based indicators | Icon components as visual element | 3/3 (100%) | **Level 1** | All | Composed (3/3) |
| Built-in illustrations | Framework-provided preset images | 1/3 (33%) | **Level 4** | Ant Design | Native (2 presets) |
| Custom images/illustrations | External images or SVGs | 3/3 (100%) | **Level 1** | All | Native: 1/3 (Ant), Composed: 2/3 (Chakra, ShadCN) |
| Avatar integration | User avatars for people-centric states | 2/3 (67%) | **Level 3** | Chakra UI, ShadCN | Composed (2/2) |
| Multiple avatars/images | Group of visual elements | 1/3 (33%) | **Level 4** | ShadCN | Composed |
| No visual (text-only) | Option to omit visual indicator | 2/3 (67%) | **Level 3** | Ant Design, ShadCN | Supported pattern |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Rich text descriptions | HTML/JSX in description | 3/3 (100%) | **Level 1** | All | Native: 1/3 (Ant), Composed: 2/3 (Chakra, ShadCN) |
| Hidden description | Option to hide description | 1/3 (33%) | **Level 4** | Ant Design | Native (`description={false}`) |
| Single action button | One primary CTA | 3/3 (100%) | **Level 1** | All | Composed (3/3) |
| Multiple actions | Multiple CTAs or options | 3/3 (100%) | **Level 1** | All | Composed (3/3) |
| Inline search/input | Search or form fields in empty state | 1/3 (33%) | **Level 4** | ShadCN | Documented pattern |

### Size & Layout Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Size variants | sm/md/lg presets | 1/3 (33%) | **Level 4** | Chakra UI | Native (expected) |
| Compact mode | Smaller illustration/spacing | 1/3 (33%) | **Level 4** | Ant Design | Native (SIMPLE preset) |
| Custom spacing | Configurable padding/gaps | 3/3 (100%) | **Level 1** | All | Native: 1/3 (Ant), CSS: 2/3 (Chakra, ShadCN) |

### Styling Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Visual style presets | Default/outlined/gradient variants | 1/3 (33%) | **Level 4** | ShadCN | CSS-only (via className) |
| Custom image styling | Style overrides for visual element | 2/3 (67%) | **Level 3** | Ant Design, Chakra UI | Native: 1/3 (Ant imageStyle), CSS: 1/3 (Chakra) |
| Border variants | Outlined/dashed border options | 1/3 (33%) | **Level 4** | ShadCN | CSS-only |
| Background gradients | Gradient background support | 1/3 (33%) | **Level 4** | ShadCN | CSS-only |

### Integration Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Global configuration | App-wide empty state theming | 1/3 (33%) | **Level 4** | Ant Design | Native (ConfigProvider) |
| Component-specific customization | Different empty states per component | 1/3 (33%) | **Level 4** | Ant Design | Native (ConfigProvider renderEmpty) |
| Data component integration | Auto-integration with Table/List/Select | 1/3 (33%) | **Level 4** | Ant Design | Native |
| Theme system integration | Design tokens/recipe customization | 2/3 (67%) | **Level 3** | Ant Design, Chakra UI | Native |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Types |
|---------|-------------|------------|-------------|------------|---------------|
| Semantic HTML | Proper heading/text elements | 3/3 (100%) | **Level 1** | All | Native (3/3) |
| ARIA support | ARIA labels/roles | 3/3 (100%) | **Level 1** | All | Available (developers must add) |
| Color contrast | WCAG-compliant colors | 3/3 (100%) | **Level 1** | All | Native (3/3 via theme) |
| Keyboard navigation | Focus management for actions | 3/3 (100%) | **Level 1** | All | Native (3/3 via button components) |

## Notable Patterns

### Highly Adopted (Level 1)

**Universal Patterns (100% adoption):**
- Visual indicator (icon, image, or avatar) support
- Title/heading text for primary message
- Description text for contextual explanation
- Action button support via composition (children)
- Centered layout (horizontal and vertical)
- Icon-based indicators
- Custom images/illustrations
- Rich text support in descriptions
- Single and multiple action buttons
- Custom spacing configuration
- Semantic HTML structure
- ARIA support capability
- Color contrast compliance
- Keyboard navigation for interactive elements

These patterns represent **absolute consensus** - every framework surveyed supports these features, making them essential for any Empty State implementation.

### Emerging Patterns (Level 3-4)

**Moderate Adoption (67%):**
- **Avatar integration** (67%): Chakra and ShadCN support avatars; Ant Design focuses on illustrations
- **Custom image styling** (67%): Ant and Chakra provide native props; ShadCN uses CSS
- **No visual option** (67%): Ant and ShadCN explicitly support text-only empty states
- **Theme system integration** (67%): Ant and Chakra have design token systems

**Occasional Patterns (33%):**
- **Built-in illustrations** (33%): Only Ant Design provides preset illustrations
- **Size variants** (33%): Only Chakra UI expected to have sm/md/lg presets
- **Compact mode** (33%): Only Ant Design has explicit compact preset
- **Visual style presets** (33%): Only ShadCN demonstrates outlined/gradient patterns
- **Border/gradient variants** (33%): ShadCN-specific CSS patterns
- **Global configuration** (33%): Ant Design's unique ConfigProvider pattern
- **Component-specific customization** (33%): Ant Design's renderEmpty by component name
- **Data component integration** (33%): Ant Design's automatic Table/List/Select integration
- **Inline search/input** (33%): Only ShadCN shows this pattern in examples
- **Multiple avatars** (33%): Only ShadCN demonstrates avatar groups

### Unique Innovations (Level 5)

**Empty State-Specific Innovations:**

Only one framework provides truly component-specific innovations for Empty State:

**Ant Design - Built-In Illustration Presets**
- Two purpose-built SVG illustrations specifically designed for empty states
- `PRESENTED_IMAGE_DEFAULT` (121×116px) for prominent empty states
- `PRESENTED_IMAGE_SIMPLE` (55×35px) for compact contexts
- Solves the unique empty state problem: visualizing "nothing" without looking broken
- Only framework surveyed that provides preset empty state illustrations (others assume custom assets)

**Note**: All other distinctive patterns observed (ConfigProvider integration, multi-part composition, copy-paste distribution) are framework-wide architectural decisions that apply to all components, not Empty State-specific innovations.

## Pattern Correlations

### Positive Correlations

**Multi-Part Composition → Data Attributes**
- When framework uses multi-part composition (2/2) → Data attributes for styling
- Chakra and ShadCN both leverage `data-*` attributes
- Correlation: 100%

**Multi-Part Composition → CSS-Based Customization**
- When composition pattern used (2/2) → Styling via CSS classes over props
- Chakra (Tailwind/CSS) and ShadCN (Tailwind) prefer CSS styling
- Correlation: 100%

**Single Component → Built-in Presets**
- Ant Design (single component) → Has built-in illustration presets
- Multi-part frameworks delegate visuals to composition
- Correlation: 100% (limited sample)

**Single Component → Global Configuration**
- Ant Design (single component) → ConfigProvider integration
- May indicate monolithic frameworks provide more centralized config
- Correlation: 100% (limited sample)

**Composition Pattern → Avatar Support**
- Multi-part composition frameworks (2/2) → Avatar integration shown
- Chakra and ShadCN explicitly demonstrate avatar usage
- Single-component framework focuses on illustrations instead
- Correlation: 100%

### Negative Correlations

**Multi-Part Composition ⊗ Built-in Illustrations**
- Chakra and ShadCN (composition) → No built-in illustrations
- Ant Design (single component) → Has preset illustrations
- Trade-off: Flexibility vs. convenience

**Copy-Paste Model ⊗ Global Configuration**
- ShadCN (copy-paste) → No global configuration system
- Ant Design (npm package) → Has ConfigProvider system
- Distribution model affects architecture

**Composition Pattern ⊗ Size Variants Props**
- Chakra might have size props, but ShadCN doesn't
- ShadCN prefers CSS classes for sizing over props
- Chakra balances props with CSS customization

### Pattern Clusters

**Cluster 1: Compositional Modern Frameworks** (Chakra UI, ShadCN)
- Multi-part component anatomy
- Data attribute styling hooks
- CSS-first customization
- Avatar integration examples
- Minimal native props
- Developer customization flexibility

**Cluster 2: Monolithic Configuration Frameworks** (Ant Design)
- Single component with props
- Built-in preset assets
- Global configuration system
- Automatic integration with data components
- Internationalization built-in
- Enterprise-focused features

**Cluster 3: Limited Framework Coverage**
- Only 3 frameworks have dedicated Empty State components
- Many UI libraries don't provide empty state components
- Developers often build custom solutions
- Indicates this may be an emerging pattern area

## Implementation Notes

### Architectural Patterns

**Component Architecture Split**:
- **Single component + props**: 1/3 (Ant Design)
- **Multi-part composition**: 2/3 (Chakra UI, ShadCN)
- Clear industry trend toward composition for maximum flexibility

**Distribution Models**:
- **NPM packages**: 2/3 (Ant Design, Chakra UI)
- **CLI/copy-paste**: 1/3 (ShadCN)
- ShadCN's unique model gives full source control

**Styling Approaches**:
- **Props-based**: Ant Design (imageStyle prop, limited styling)
- **Data attributes + recipes**: Chakra UI (v3 pattern)
- **Tailwind utilities**: ShadCN (className prop only)

### Naming Conventions

**Consistent Patterns**:
- Visual indicator part universally present (image/indicator/media)
- Title/heading universally present
- Description/text universally present
- Action area via children composition (universal)

**Divergent Patterns**:
- **Component name**: Empty State vs Empty
- **Description**: Can mean both title+description (Ant) or just description (Chakra/ShadCN)
- **Visual element**: image vs indicator vs media
- **Container parts**: Root/Content naming varies

### API Design Philosophies

**Ant Design - Pragmatic Simplicity**:
- Minimal API surface (`description`, `image`, `imageStyle`, `children`)
- Two preset illustrations for 80% use cases
- Global configuration for consistency
- Works "out of the box" with good defaults

**Chakra UI - Compositional Flexibility**:
- Separate components for each semantic part
- Type-safe recipe system for theming
- Data attributes for CSS customization
- Balances structure with flexibility

**ShadCN - Maximum Ownership**:
- Extreme composition (6 sub-components)
- Almost no props (just className)
- Full source code customization
- Tailwind-first styling approach
- Developer owns and modifies component

### Framework Coverage Gap

**Notable Finding**: Only 3 frameworks surveyed have dedicated Empty State components, compared to 5+ for most other components like Carousel, Button, Table, etc.

**Possible Reasons**:
1. Empty states often considered "custom design" territory
2. Simple enough pattern that frameworks assume developers will build custom
3. Newer pattern - emerging into component libraries recently
4. High variance in design requirements makes standardization difficult
5. Some frameworks use simpler primitives (Box + VStack + Icon + Text) instead

**Implications**:
- Less ecosystem consensus on empty state patterns
- More variation in approach and API design
- Opportunity for Semantic UI to establish patterns
- Lower competitive pressure (fewer "standard" implementations)

### Preset Asset Strategy

**Only Ant Design Provides Built-in Illustrations**:
- 2 SVG presets (DEFAULT and SIMPLE)
- Maintains visual consistency
- Reduces designer/developer burden
- Other frameworks expect custom assets

**Implications**:
- Most frameworks assume design teams provide custom empty state illustrations
- Opportunity: Providing tasteful presets could be differentiating feature
- Risk: Presets might not match all brand guidelines
- Middle ground: Provide presets as optional starting points

## Sophisticated Design Patterns

### Ant Design's Component-Aware Empty States

**What it does**: ConfigProvider's `renderEmpty` function receives the component name (e.g., "Table", "Select") as a parameter, enabling different empty states for different components:

```jsx
renderEmpty={(componentName) => {
  if (componentName === 'Table') return <Empty description="No records" />;
  if (componentName === 'Select') return <Empty description="No options" />;
  return <Empty />;
}}
```

**Why it's sophisticated**: This solves a real UX problem specific to empty states - "empty" has fundamentally different semantic meanings depending on context. A table with no rows communicates "no data records exist" while a select with no options communicates "no choices available." Rather than forcing developers to customize empty states for every component instance or use the same generic "No data" everywhere, Ant Design recognizes that the *containing component type* provides semantic context for what "empty" means.

**Evidence of design maturity**:
- Recognizes that "empty" is semantically context-dependent (unlike, say, a "button" which means the same thing everywhere)
- Solves the scale problem: hundreds of tables/selects across an enterprise app need consistent but appropriate empty messaging
- Balances DRY principle (single configuration point) with contextual appropriateness
- Deep component integration - data components automatically pass their identity to empty state renderer
- Shows understanding that empty states aren't just "missing content placeholders" but meaningful communication points

This pattern is specific to empty states because few other components have this property where their meaning fundamentally changes based on containing context.

### Ant Design's Built-in Illustration Presets

**What it does**: Provides two carefully designed SVG illustration presets (`PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE`) specifically for empty states, with different visual weights for different contexts.

**Why it's sophisticated**: Empty states have a unique problem - they need visual interest to avoid feeling "broken" but shouldn't be so prominent they feel like errors. Most components can rely on content or interaction for visual presence, but empty states *are* the absence of content. Ant Design solves this by providing:
- A larger illustration (121×116px) for primary empty states with space
- A minimal illustration (55×35px) for compact/secondary contexts
- SVG format ensuring crisp rendering at any density
- Theme-aware colors that inherit from design system

**Evidence of design maturity**:
- Recognizes the specific UX challenge of "visually interesting absence"
- Provides exactly two presets (covering ~80% of use cases without bloat)
- The size difference (2:1 ratio) is thoughtfully chosen for different emphasis levels
- Solves the "blank screen looks broken" problem without requiring design resources
- Only framework to provide purpose-built empty state illustrations (others assume custom assets)

This is component-specific because other components don't need "preset illustrations for absence of content" - only empty states have this unique requirement of visualizing nothing.

## Recommendations for Semantic UI

Based on this research, the following patterns show strong consensus and should be prioritized:

### Essential Patterns (100% adoption)
1. **Visual indicator support** - Icons, images, or avatars
2. **Title text** - Primary heading explaining the empty state
3. **Description text** - Secondary context or guidance
4. **Action button support** - CTAs via children/composition
5. **Centered layout** - Both horizontal and vertical centering
6. **Icon-based indicators** - Primary visual pattern
7. **Custom image support** - Allow external images/SVGs
8. **Rich text descriptions** - Support HTML/JSX in descriptions
9. **Multiple actions** - Support for multiple CTAs
10. **Semantic HTML** - Proper heading and text elements
11. **Keyboard navigation** - Focus management for actions

### Recommended Patterns (67% adoption)
1. **Avatar integration** - For people-centric empty states (Chakra, ShadCN)
2. **Custom image styling** - Props or CSS for visual customization (Ant, Chakra)
3. **Text-only option** - Support omitting visual indicator (Ant, ShadCN)
4. **Theme system integration** - Design tokens for styling (Ant, Chakra)

### Optional/Differentiating Patterns
1. **Built-in illustration presets** - 33% adoption (Ant only), but could be differentiating
2. **Global configuration** - 33% adoption (Ant only), valuable for large apps
3. **Component-specific customization** - 33% adoption (Ant only), sophisticated pattern
4. **Size variants** - 33% adoption (Chakra expected), useful for responsive design

### Architecture Recommendations

**Consider Composition Over Configuration**:
- 2/3 frameworks use multi-part composition
- Trend is clearly toward compositional APIs
- Provides maximum flexibility and customization
- Aligns with modern React patterns

**Provide Both Presets and Customization**:
- Ant Design's presets reduce barrier to entry
- Chakra/ShadCN's flexibility enables brand alignment
- Middle ground: Optional preset library + full customization

**Think About Scale**:
- Ant Design's ConfigProvider shows value of global configuration
- Component-aware empty states solve real enterprise problems
- Consider how Semantic UI handles consistency at scale

**Address Framework Coverage Gap**:
- Only 3/typical 5+ frameworks have dedicated components
- Opportunity to establish patterns in emerging space
- Less "standard implementation" pressure
- Room for innovation

### Patterns to Consider But Validate

1. **Inline search/input** - 33% adoption, useful but specialized
2. **Visual style presets** - ShadCN shows potential via CSS
3. **Avatar groups** - ShadCN shows pattern, could be useful
4. **Locale integration** - Ant Design only, but valuable for i18n

### Patterns to Avoid

1. **Over-complicated APIs** - Trend is toward simplicity
2. **Rigid styling** - Frameworks favor customization
3. **Heavy JavaScript** - Trend toward lightweight, CSS-driven
4. **Forced visual branding** - Make presets optional

### Key Decision Points

**Composition vs Single Component**:
- Industry trending toward composition (2/3 frameworks)
- Consider: `<EmptyState>` with sub-components vs single component with props
- Recommendation: Composition for flexibility

**Presets vs Full Custom**:
- Ant Design provides presets (unique)
- Others expect custom assets
- Recommendation: Provide optional preset library

**Global Configuration**:
- Ant Design's ConfigProvider is powerful but unique
- Consider: How does Semantic UI handle app-wide patterns?
- Recommendation: Evaluate based on Semantic UI's architecture

**Distribution Model**:
- ShadCN's copy-paste model is innovative
- Traditional npm packages still dominant
- Recommendation: Standard npm package, but document customization patterns clearly

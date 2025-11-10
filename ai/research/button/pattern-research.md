# Component Pattern Research: Button

> Last Modified: 2024-11-04

## Research Summary
- Frameworks surveyed: 11
- Date: 2024-11-04
- Unique patterns identified: 85+

## Component Definition Consensus

Across all frameworks, the Button component is consistently understood as:

**Core Purpose**: A clickable interactive element that triggers actions, form submissions, or navigation. It serves as the primary actionable control in user interfaces.

**Mental Model**: Users understand buttons as "things to click" that cause something to happen - whether submitting a form, opening a dialog, navigating to a page, or triggering an operation.

**Semantic Meaning**: Buttons communicate:
- **Action hierarchy** through visual weight (primary, secondary, tertiary/ghost)
- **Intent/consequence** through colors (success, danger, warning, info)
- **State** through visual feedback (loading, disabled, active, hover, focus)
- **Actionability** through visual affordances that signal interactivity

## Terminology Variations

### Component Names
- **Button** (11/11 frameworks) = Universal standard name

### Variant Naming
| Concept | Primary Terms | Alternative Terms | Frameworks |
|---------|---------------|-------------------|------------|
| **Filled/Solid** | "solid", "contained", "filled" | "default", "primary" style | 10/11 |
| **Outlined** | "outline", "outlined" | "border", "basic" | 10/11 |
| **Text/Ghost** | "ghost", "text", "link" | "subtle", "transparent" | 11/11 |
| **Soft/Light** | "soft", "light" | "faded", "subtle" | 6/11 |

### State Naming
| State | Property Names | Frameworks |
|-------|----------------|------------|
| **Disabled** | `disabled`, `isDisabled` | 11/11 |
| **Loading** | `loading`, `isLoading` | 8/11 (others compose or wrap) |
| **Active** | `active`, `isActive` | 8/11 |

### Size Naming
| Size | Common Names | Alternative Names |
|------|--------------|-------------------|
| **Extra Small** | `xs`, `extra small` | `mini`, `tiny` |
| **Small** | `sm`, `small` | `compact-sm` |
| **Medium** | `md`, `medium`, `default` | (default state) |
| **Large** | `lg`, `large` | `big` |
| **Extra Large** | `xl`, `extra large` | `huge`, `massive` |

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| **Text content** | Display plain text | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Icon support** | Display icons (alone or with text) | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Icon + Text** | Icons positioned with text | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Loading indicator** | Show loading spinner/state | 8/11 (73%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Radix UI, Semantic UI Classic |
| **Custom content** | Arbitrary React/Vue nodes | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Icon positioning** | Control icon placement (left/right/top/bottom) | 7/11 (64%) | Level 2 (Common) | Ant Design, PrimeReact, HeroUI, Nuxt UI, Semantic Classic, Chakra (v2), MUI |
| **Badge/Counter** | Display notification badges | 1/11 (9%) | Level 5 (Rare) | PrimeReact only |
| **Avatar** | Integrated avatar component | 1/11 (9%) | Level 5 (Rare) | Nuxt UI only |

**Icon Integration Approaches:**
- **Dedicated props** (7/11): `icon`, `leftIcon`, `rightIcon`, `startIcon`, `endIcon`, `leadingIcon`, `trailingIcon`
- **Composition** (4/11): Icons as children with automatic spacing (Headless UI, Radix UI, ShadCN, Semantic Classic)

### Type Patterns (Visual Variants)

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| **Solid/Filled** | Filled background (high emphasis) | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Outline/Bordered** | Border only (medium emphasis) | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Ghost/Text** | Minimal styling (low emphasis) | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Soft/Light** | Subtle background tint | 7/11 (64%) | Level 2 (Common) | Chakra, HeroUI, Mantine, Nuxt UI, Radix, ShadCN (secondary), Ant Design (as separate variant) |
| **Link style** | Underlined text appearance | 8/11 (73%) | Level 2 (Common) | Ant Design, Chakra, MUI, Nuxt UI, PrimeReact, Radix, ShadCN, Semantic Classic |
| **Gradient** | Linear gradient backgrounds | 2/11 (18%) | Level 5 (Rare) | Mantine, Ant Design (via color/variant) |
| **Dashed** | Dashed border styling | 1/11 (9%) | Level 5 (Rare) | Ant Design only |

**Variant Terminology:**
- **Solid**: "solid" (6), "contained" (1 - MUI), "filled" (2 - Ant, Mantine), "default" (1 - Chakra)
- **Outline**: "outline" (7), "outlined" (2 - MUI, PrimeReact), "basic" (1 - Semantic Classic)
- **Ghost**: "ghost" (8), "text" (2 - MUI, PrimeReact), "link" (2 - Chakra, Nuxt UI)

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| **Disabled** | Prevents interaction | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Loading** | Shows loading indicator | 8/11 (73%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Radix UI, Semantic UI Classic |
| **Hover** | Visual feedback on hover | 11/11 (100%) | Level 1 (Universal) | All frameworks (CSS/automatic) |
| **Focus** | Keyboard focus indication | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Active/Pressed** | Pressed state styling | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Loading delay** | Delay before showing spinner | 1/11 (9%) | Level 5 (Rare) | Ant Design only |
| **Data-disabled** | Visual-only disabled (allows tooltips) | 2/11 (18%) | Level 5 (Rare) | Mantine, HeroUI |
| **loadingAuto** | Promise-aware auto-loading | 1/11 (9%) | Level 5 (Rare) | Nuxt UI only |

**Loading Implementation Approaches:**
- **Native prop** (8/11): Boolean `loading` prop with built-in spinner/disable behavior
- **Composition/adjacent component** (Headless UI, ShadCN) or dedicated `LoadingButton` (MUI) when native prop is absent
- Native implementations typically allow swapping the spinner icon and choosing whether it replaces the label or sits in start/end positions

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| **Size options** | Multiple size variants | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Color customization** | Semantic color variants | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Full width** | Button spans container | 10/11 (91%) | Level 1 (Universal) | All except Headless UI |
| **Border radius** | Control roundness | 6/11 (55%) | Level 3 (Moderate) | HeroUI, Mantine, Radix, Semantic Classic (circular), Nuxt UI, ShadCN (via className) |
| **Compact/Dense** | Reduced padding variant | 4/11 (36%) | Level 4 (Occasional) | Mantine, Semantic Classic, PrimeReact, Ant Design |
| **Square** | Equal padding (icon buttons) | 3/11 (27%) | Level 4 (Occasional) | Nuxt UI, HeroUI, ShadCN (icon sizes) |
| **Elevation/Shadow** | Shadow variants | 3/11 (27%) | Level 4 (Occasional) | MUI, HeroUI, PrimeReact (raised) |
| **High contrast** | Enhanced contrast mode | 2/11 (18%) | Level 5 (Rare) | Radix, Mantine (autoContrast) |
| **Block display** | Display as block element | 2/11 (18%) | Level 5 (Rare) | Nuxt UI, Ant Design |

**Size System Statistics:**
- **3 sizes** (33%): MUI, HeroUI, Radix (4 levels)
- **5 sizes** (55%): Chakra (v3: xs-xl), Mantine (xs-xl), Nuxt UI (xs-xl), Ant Design (small-large), PrimeReact
- **6+ sizes** (12%): Semantic Classic (8 sizes: mini-massive)

**Color Systems:**
- **Semantic colors** (11/11): primary, secondary, success, warning, error/danger, info
- **Extended palettes** (6/11): Ant (13 presets), Chakra (12+), Mantine (theme colors), Semantic Classic (13)
- **Theme integration** (11/11): All support custom color schemes through theme systems

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| **Click handler** | onClick/onPress events | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **As link** | Render as anchor/link | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Form submission** | type="submit" support | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Button group** | Grouped button layouts | 7/11 (64%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, MUI, PrimeReact, Semantic UI Classic |
| **Polymorphic rendering** | Render as custom elements | 9/11 (82%) | Level 2 (Common) | Headless, HeroUI, Mantine, MUI, Nuxt UI, Radix, ShadCN, Chakra, PrimeReact |
| **Icon-only buttons** | Dedicated icon button support | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| **Ripple effect** | Touch feedback animation | 3/11 (27%) | Level 4 (Occasional) | HeroUI, MUI, Chakra (configurable) |
| **Dropdown button** | Split button with dropdown | 2/11 (18%) | Level 5 (Rare) | Ant Design (deprecated), HeroUI (pattern) |
| **Toggle state** | Persistent on/off state | 2/11 (18%) | Level 5 (Rare) | Semantic Classic, Nuxt UI (active state) |
| **Tooltip integration** | Built-in tooltip support | 2/11 (18%) | Level 5 (Rare) | PrimeReact, Semantic Classic |

**Polymorphic Approaches:**
- **`as` prop** (5/11): Headless UI, HeroUI, Mantine, Nuxt UI, Chakra
- **`asChild` prop** (3/11): Radix, ShadCN, HeroUI
- **`component` prop** (2/11): MUI, Mantine
- **`href` prop** (3/11): Ant Design, MUI, PrimeReact

## Notable Patterns

### Highly Adopted (Level 1-2)

These patterns represent industry consensus and should be strongly considered for any button implementation:

#### **Core Content Patterns**
1. **Universal icon support** - All frameworks support icons, but approaches vary:
   - **Props approach** (64%): Dedicated icon props for positioning
   - **Composition approach** (36%): Icons as children with automatic spacing

2. **Loading states** - 8/11 frameworks ship native loading indicators; the rest rely on composition or separate components:
   - Native loading props: Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Radix UI, Semantic UI Classic
   - Headless UI and ShadCN compose spinners manually; MUI uses the separate `LoadingButton` component
   - Most native implementations support custom icons and spinner placement for branding control

3. **Text + Icon combinations** - Universal pattern with automatic spacing

#### **Variant Hierarchy**
1. **Three-tier visual weight** (100%):
   - High emphasis: Solid/Contained/Filled
   - Medium emphasis: Outline/Bordered
   - Low emphasis: Ghost/Text/Link

2. **Soft/Light variant** (64%) - Emerging as fourth-tier emphasis level

#### **Size Systems**
1. **5-size scale most common** (xs/sm/md/lg/xl) - 55% of frameworks
2. **Icon-specific sizes** - Dedicated sizing for icon-only buttons (27%)

#### **Color Semantics**
1. **Universal semantic palette**: primary, secondary, success, warning, error/danger, info
2. **Extended color systems** (55%): Beyond basic semantics

#### **State Management**
1. **Disabled state** - Universal support (11/11)
2. **Loading states** - Native props in 8/11 frameworks; Headless UI, ShadCN, and MUI rely on composition or adjacent components
3. **Focus-visible states** - Keyboard navigation support (11/11)
4. **Active/Pressed states** - Visual feedback (11/11)

### Emerging Patterns (Level 3-4)

Patterns with moderate adoption that may represent evolving best practices:

1. **Soft/Light variant** (64%) - Growing alternative to ghost buttons
2. **Border radius control** (55%) - Design system flexibility
3. **Compact/Dense variants** (36%) - Space-efficient layouts
4. **Icon positioning props** (64%) - Enhanced icon control vs pure composition
5. **Polymorphic rendering** (82%) - Flexibility in element output
6. **Ripple effects** (27%) - Touch feedback (mostly Material Design)

### Unique Innovations (Level 5)

Framework-specific patterns that may be ahead of the curve or solving niche needs:

1. **Ant Design**:
   - Type as syntactic sugar for color+variant combinations
   - PresetColors system (13 themed options)
   - Auto-space insertion for Chinese characters
   - Loading delay configuration
   - Semantic DOM customization (classNames/styles props)

2. **Nuxt UI**:
   - `loadingAuto` - Promise-aware automatic loading state management
   - Separate active state styling (activeColor, activeVariant)
   - Integrated avatar support
   - Triple icon system (icon, leadingIcon, trailingIcon)

3. **Mantine**:
   - Dual disabled states (disabled vs data-disabled for tooltips)
   - Dual size system (regular + compact variants)
   - autoContrast feature for WCAG compliance
   - Gradient variant with angle control
   - Justify content control for icon placement

4. **HeroUI**:
   - Data attributes for all interaction states
   - useButton hook for custom implementations
   - Integrated ripple effect component

5. **Radix UI**:
   - Ghost variant uses negative margins for optical text alignment
   - Loading state preserves button dimensions (prevents layout shift)
   - Responsive size prop types

6. **Semantic UI Classic**:
   - Animated content reveal (3 animation types)
   - "Or divider" pattern for choice indication
   - Social media branded buttons (7 platforms)
   - 8-size scale (mini to massive)
   - Attached button positioning

7. **ShadCN**:
   - Copy-paste component model (not npm package)
   - CVA (class-variance-authority) for type-safe variants
   - Radix Slot for polymorphism without wrappers

8. **Headless UI**:
   - Pure behavior focus (zero styling)
   - Dual API (data attributes + render props)
   - Complete styling freedom

## Pattern Correlations

### When Solid Variant Exists → Outline Variant Present
- **Correlation**: 11/11 (100%)
- **Pattern**: All frameworks provide both filled and outlined variants
- **Insight**: These represent the minimum viable variant set

### When Icon Props Exist → Icon Position Control Present
- **Correlation**: 7/7 (100%)
- **Pattern**: Frameworks with dedicated icon props provide position control
- **Insight**: Icon props demand position configuration

### When Loading Prop Exists → Disabled State Auto-Applied
- **Correlation**: 10/10 (100%) - except MUI (separate component)
- **Pattern**: Loading buttons automatically disable to prevent double-submission
- **Insight**: Loading and disabled are coupled states

### When Button Groups Exist → Size/Variant Inheritance Present
- **Correlation**: 9/10 (90%)
- **Pattern**: Button groups cascade props to children
- **Insight**: Group configuration reduces repetition

### When Polymorphic → Link Rendering Supported
- **Correlation**: 9/9 (100%)
- **Pattern**: Polymorphic buttons always support anchor rendering
- **Insight**: Button-styled links are primary polymorphic use case

### When Material Design Influence → Ripple Effect Present
- **Correlation**: 3/3 (100%) - MUI, HeroUI, Chakra (optional)
- **Pattern**: Material Design frameworks implement ripple feedback
- **Insight**: Ripple is Material Design signature pattern

### When Theme System Exists → Custom Color Support Present
- **Correlation**: 11/11 (100%)
- **Pattern**: All frameworks integrate with theme/design systems
- **Insight**: Buttons are primary theme consumers

## Implementation Notes

### Icon Integration Strategies

**Two Dominant Approaches:**

1. **Props-Based** (64% - 7/11 frameworks):
   ```jsx
   // Ant Design, Chakra, HeroUI, MUI, Nuxt UI, PrimeReact, Mantine
   <Button icon={<Icon />} />
   <Button leftIcon={<Icon />} rightIcon={<Icon />} />
   <Button startIcon={<Icon />} endIcon={<Icon />} />
   ```
   **Pros**: Type-safe, discoverable, position control built-in
   **Cons**: More verbose, less composable

2. **Composition-Based** (36% - 4/11 frameworks):
   ```jsx
   // Headless UI, Radix, ShadCN, Semantic Classic
   <Button><Icon /> Text</Button>
   <Button>Text <Icon /></Button>
   ```
   **Pros**: Flexible, natural composition, simpler API
   **Cons**: No built-in position control, manual spacing

**Hybrid Approach** (18% - 2/11):
- Chakra UI v3, Nuxt UI support both patterns

### Loading State Architectures

**Three Implementation Patterns:**

1. **Native boolean prop** (73% - 8/11):
   ```jsx
   <Button loading>Submit</Button>
   <Button loading={isSubmitting}>Submit</Button>
   ```

2. **Composition-based loading** (18% - Headless UI, ShadCN):
   ```jsx
   <Button disabled={loading}>
     {loading && <Spinner />}
     {loading ? 'Saving…' : 'Save'}
   </Button>
   ```
   Relies on manual spinner composition plus `disabled`.

3. **Separate component** (9% - 1/11):
   ```jsx
   // MUI
   import { LoadingButton } from '@mui/lab'
   <LoadingButton loading>Submit</LoadingButton>
   ```

4. **Advanced configuration** (subset of native implementations):
   ```jsx
   // Ant Design
   <Button loading={{ delay: 300, icon: <CustomIcon /> }} />

   // Nuxt UI
   <Button loadingAuto @click={asyncHandler} />
   ```

**Spinner Placement:** Native implementations typically either replace the entire label (center) or reserve start/end slots for inline spinners; both patterns appear across frameworks depending on icon support.

### Variant Naming Conventions

**Filled Variant Names:**
- `solid` (55%) - Chakra, HeroUI, Mantine, Nuxt UI, Radix, ShadCN
- `contained` (9%) - MUI
- `filled` (18%) - Ant Design, Mantine (also solid)
- `default` (9%) - Chakra (default value)
- (no name, default styling) (9%) - Semantic Classic

**Outlined Variant Names:**
- `outline` (64%) - Chakra, HeroUI, Mantine, Nuxt UI, Radix, ShadCN, Ant
- `outlined` (18%) - MUI, PrimeReact
- `basic` (9%) - Semantic Classic

**Ghost Variant Names:**
- `ghost` (64%) - Chakra, HeroUI, Nuxt UI, Radix, ShadCN, Ant, Mantine
- `text` (27%) - MUI, PrimeReact, Ant (separate)
- `link` (36%) - Chakra, Nuxt UI, ShadCN, Ant (separate)

### Size System Patterns

**Common Size Scales:**
- **3 sizes**: small, medium, large (18% - MUI, HeroUI)
- **4 sizes**: 1-4 or xs/sm/md/lg (9% - Radix)
- **5 sizes**: xs, sm, md, lg, xl (55% - majority)
- **8+ sizes**: mini, tiny, small, medium, large, big, huge, massive (9% - Semantic Classic)

**Compact Variants:**
- **Separate compact scale** (9%) - Mantine: compact-xs through compact-xl
- **Compact modifier** (18%) - Semantic Classic, PrimeReact
- **Reduced padding only** (9%) - Ant Design

### Polymorphic Rendering Patterns

**Four Approaches Identified:**

1. **`as` prop** (45%):
   ```jsx
   <Button as="a" href="/">Link</Button>
   <Button as={CustomComponent}>Custom</Button>
   ```

2. **`asChild` prop** (27%):
   ```jsx
   <Button asChild>
     <a href="/">Link</a>
   </Button>
   ```

3. **`component` prop** (18%):
   ```jsx
   <Button component="a" href="/">Link</Button>
   <Button component={Link} to="/">Link</Button>
   ```

4. **`href` prop** (27%):
   ```jsx
   <Button href="/">Auto-renders as link</Button>
   ```

### Button Group Patterns

**Two Implementation Approaches:**

1. **Wrapper Component** (82%):
   ```jsx
   <ButtonGroup>
     <Button>One</Button>
     <Button>Two</Button>
   </ButtonGroup>
   ```

2. **CSS Class** (18%):
   ```html
   <div class="ui buttons">
     <button>One</button>
     <button>Two</button>
   </div>
   ```

**Group Features:**
- **Prop cascading** (82%): size, variant, color inherit from group
- **Orientation** (73%): horizontal (default) + vertical
- **Connected borders** (82%): Adjacent buttons share borders
- **Attached buttons** (9%): Semantic Classic - buttons attached to other content

## API Design Insights

### Prop Naming Conventions

**Boolean Prefixes:**
- **`is` prefix** (45%): isDisabled, isLoading, isActive - HeroUI, Chakra, Mantine, MUI (some)
- **No prefix** (55%): disabled, loading, active - Ant, Headless, Nuxt, Radix, ShadCN, Semantic, PrimeReact

**Insight**: `is` prefix makes boolean intent clearer but adds verbosity. No clear winner.

**Icon Props:**
- **Positional**: `leftIcon`, `rightIcon` (18%)
- **Directional**: `startIcon`, `endIcon` (27%) - Better for RTL
- **Semantic**: `leadingIcon`, `trailingIcon` (9%)
- **Generic**: `icon` (64%)

**Insight**: `start`/`end` is more i18n-friendly than `left`/`right`.

### Prop vs Class-Based Configuration

**Prop-Based (Modern)** - 82% of frameworks:
```jsx
<Button variant="outline" size="lg" color="primary" />
```
**Pros**: Type-safe, discoverable, React/Vue native
**Cons**: Larger API surface, more props to learn

**Class-Based (Classic)** - 18%:
```html
<button class="ui primary button large outlined">
```
**Pros**: Composable, flexible, smaller API
**Cons**: No type safety, requires docs, specificity issues

**Hybrid** - 9% (PrimeReact):
```jsx
<Button label="Click" className="p-button-success p-button-outlined" />
```
**Pros**: Balance of both approaches
**Cons**: Inconsistent API

### Color Architecture

**Two Paradigms:**

1. **Semantic + Extended** (73%):
   - Base: primary, secondary, success, warning, error, info
   - Extended: Full theme palette access
   - Examples: Chakra (12+ colors), Ant (13 presets), Semantic Classic (13)

2. **Semantic Only** (27%):
   - Limited to semantic colors only
   - Custom colors via theming system
   - Examples: MUI, HeroUI, Radix

**Insight**: Extended palettes provide flexibility but increase complexity.

### Variant Orthogonality

**Independent Axes** (Best Practice):
- **Visual style**: solid, outline, ghost, soft
- **Color**: primary, secondary, success, danger, etc.
- **Size**: xs, sm, md, lg, xl
- **State**: loading, disabled, active

**Example** (Chakra UI):
```jsx
<Button variant="outline" color="red" size="lg" isLoading />
```

**Benefit**: Exponential combinations without API explosion.

**Anti-Pattern** - Coupled variants:
```jsx
// Don't do this
<Button primaryOutline largeDanger />
```

## Accessibility Patterns

All 11 frameworks demonstrate strong accessibility support:

### Universal Patterns (100%)
1. **Semantic HTML**: Use native `<button>` element
2. **Keyboard support**: Space and Enter activation
3. **Focus indicators**: Visible focus states
4. **Disabled semantics**: Proper aria-disabled/disabled attributes
5. **Screen reader support**: Appropriate ARIA attributes

### Notable Accessibility Features

**Focus Management:**
- **Focus-visible** (100%): All frameworks distinguish mouse vs keyboard focus
- **Focus ring customization** (45%): Theme-level focus styling

**Disabled State:**
- **Standard disabled** (100%): Prevents all interaction
- **Visual-only disabled** (18%): Mantine, HeroUI - allows tooltips on disabled buttons
  ```jsx
  <Button data-disabled>Hover shows tooltip</Button>
  ```

**Loading State Announcements:**
- **Most frameworks** (8/11): Implicit through disabled state while loading
- **Best practice** (rare): Explicit aria-busy or live region announcements

**Icon-Only Buttons:**
- **aria-label required** (100%): All frameworks expect labels on icon buttons
  ```jsx
  <Button icon={<Icon />} aria-label="Delete" />
  ```

**Polymorphic Accessibility:**
- **Semantic preservation** (82%): Button styles on links maintain semantics
  ```jsx
  <Button as="a" href="/">Looks like button, behaves like link</Button>
  ```

## Cross-Framework Learnings

### What Works Well

1. **Three-tier variant hierarchy** - Solid/Outline/Ghost provides clear visual weight
2. **Semantic color palette** - Primary, secondary, success, warning, error, info
3. **Native loading states** - Built-in spinner/disable behavior in 8/11 frameworks; remaining libraries rely on composition
4. **Icon integration** - Whether props or composition, all support it well
5. **Polymorphic rendering** - Button-styled links are essential
6. **Button groups** - Coordinated multi-button layouts remain common (7/11) even if not universal
7. **Full-width option** - Essential for mobile/form layouts
8. **Focus-visible** - Better UX than always-visible focus rings

### Pain Points & Gaps

1. **Loading state inconsistency**:
   - Some center-replace, others inline with text
   - No standard for loading+text vs loading-only
   - MUI requires separate component

2. **Icon positioning complexity**:
   - Props vs composition trade-offs
   - No consensus on icon spacing
   - Left/right vs start/end naming

3. **Size naming chaos**:
   - xs/sm/md/lg/xl vs small/medium/large vs mini/tiny/small/medium/large/big/huge/massive
   - No standard compact variant approach

4. **Badge/counter patterns**:
   - Only 9% support natively
   - Common use case (notification buttons)
   - Usually requires wrapper components

5. **Tooltip integration**:
   - Only 18% have built-in support
   - Disabled buttons + tooltips require workarounds
   - data-disabled pattern is elegant but rare

6. **Active state ambiguity**:
   - Sometimes "pressed", sometimes "selected"
   - Toggle buttons vs single-press actions unclear
   - Nuxt UI's separate active styling is innovative

7. **Loading delay pattern**:
   - Ant Design has it, others don't
   - Prevents "flash of loading state" for fast operations
   - Should be more common

### Innovation Opportunities

Based on unique patterns found:

1. **Promise-aware loading** (Nuxt UI):
   ```jsx
   <Button loadingAuto onClick={async () => await submitForm()} />
   ```
   Eliminates manual loading state management.

2. **Auto-contrast** (Mantine):
   ```jsx
   <Button color="lime" autoContrast />
   ```
   Automatic WCAG-compliant text color.

3. **Loading delay** (Ant Design):
   ```jsx
   <Button loading={{ delay: 300 }}>Submit</Button>
   ```
   Prevents loading flash on fast operations.

4. **Data-disabled** (Mantine, HeroUI):
   ```jsx
   <Tooltip><Button data-disabled>Hover me</Button></Tooltip>
   ```
   Visual disable without blocking pointer events.

5. **Active state customization** (Nuxt UI):
   ```jsx
   <Button active activeColor="success" activeVariant="solid" />
   ```
   Complete control over active appearance.

6. **Dimension preservation** (Radix):
   - Loading state maintains button size
   - Prevents layout shift

7. **Gradient variants** (Mantine):
   ```jsx
   <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }} />
   ```
   Advanced visual options.

## Recommendations for Semantic UI

### Must-Have Patterns (Level 1)
Based on near-universal adoption (≥ ~70%; explicitly universal where noted):

1. ✅ **Core variants**: solid, outline, ghost/text
2. ✅ **Size system**: minimum 5 sizes (xs-xl)
3. ✅ **Semantic colors**: primary, secondary, success, warning, error, info
4. ✅ **States**: disabled, hover/focus/active, plus a native loading prop to match the majority expectation
5. ✅ **Icon support**: Either props or composition pattern
6. ✅ **Loading indicators**: Built-in spinner/disable behavior (8/11 frameworks already ship this)
7. ✅ **Full-width option**: Essential for responsive layouts
8. ✅ **Button groups**: Coordinated multi-button layouts (7/11 frameworks ship a first-class pattern)
9. ✅ **Polymorphic rendering**: Button-styled links
10. ✅ **Form integration**: type="submit" support

### Should-Have Patterns (Level 2)
Based on 64-82% adoption:

1. ⚠️ **Soft/light variant**: Emerging as standard fourth tier
2. ⚠️ **Icon positioning**: Left/right or start/end control
3. ⚠️ **Border radius control**: Design system flexibility
4. ⚠️ **Custom loading icons**: Branding flexibility
5. ⚠️ **Spinner placement**: Start/center/end options
6. ⚠️ **Extended color palette**: Beyond basic semantics
7. ⚠️ **Vertical button groups**: Not just horizontal

### Nice-to-Have Patterns (Level 3-4)
Based on 27-55% adoption:

1. 💡 **Compact variants**: Space-efficient options
2. 💡 **Square buttons**: Icon-only sizing
3. 💡 **Ripple effects**: Touch feedback (optional)
4. 💡 **High contrast mode**: Accessibility enhancement
5. 💡 **Elevation/shadow**: Material Design patterns

### Innovative Patterns to Consider (Level 5)
Unique features worth evaluating:

1. 🚀 **Promise-aware loading** (Nuxt UI): Automatic state management
2. 🚀 **Auto-contrast** (Mantine): WCAG compliance automation
3. 🚀 **Loading delay** (Ant Design): Prevent flash of loading state
4. 🚀 **Data-disabled** (Mantine): Tooltip compatibility
5. 🚀 **Active state customization** (Nuxt UI): Flexible active appearance
6. 🚀 **Dimension preservation** (Radix): Layout shift prevention
7. 🚀 **Gradient variants** (Mantine): Advanced visuals

### API Design Recommendations

**Variant Naming:**
- Use `solid`, `outline`, `ghost` as primary tier names
- Consider `soft` as fourth tier
- Avoid coupling (e.g., "primaryOutline")

**Size Naming:**
- Prefer `xs`, `sm`, `md`, `lg`, `xl` (most common)
- Support icon-specific sizes
- Consider compact variants for dense UIs

**Icon Props:**
- Consider both approaches:
  - Props: `startIcon`, `endIcon` (better for RTL than left/right)
  - Composition: Natural for React/Vue developers
- If props, provide position control

**State Props:**
- Prefer no prefix: `disabled`, `loading`, `active`
- Consider `isDisabled` if team prefers explicit boolean naming

**Loading Pattern:**
- Native `loading` prop (don't use separate component)
- Support custom spinner
- Support placement control (start/center/end)
- Consider loading delay to prevent flash

**Polymorphic Rendering:**
- Use `as` prop (most common pattern)
- Support common cases: links, custom components
- Consider `asChild` for composition flexibility

**Color System:**
- Start with semantic colors
- Provide theme integration for custom colors
- Consider extended palette if design system requires

**Button Groups:**
- Wrapper component pattern
- Cascade size/variant/color props
- Support horizontal + vertical
- Handle connected borders

### Web Component Considerations

Since Semantic UI uses web components:

1. **Shadow DOM implications**:
   - Styling isolation is built-in
   - Slotted content for icon composition
   - CSS custom properties for theming

2. **Settings proxy pattern**:
   - Reactive configuration (similar to props)
   - Can provide both props-like and attribute-based APIs

3. **Event handling**:
   - Use dispatchEvent for loading state changes
   - Bubble events for form integration

4. **Icon patterns**:
   - Slots: `<slot name="start">` and `<slot name="end">`
   - Or settings: `settings.icon` with position control

5. **Loading state**:
   - Can use internal state management
   - Template conditionals for spinner display

6. **Polymorphic pattern**:
   - Can wrap anchor elements
   - Or use `href` setting to auto-render as link

## Conclusion

The button component research reveals strong consensus on core patterns while showing innovation in progressive enhancement features. All 11 frameworks demonstrate:

- **Universal agreement** on essential patterns (variants, states, sizes, colors)
- **Divergent approaches** on implementation details (props vs composition, naming conventions)
- **Innovation opportunities** in loading state management, accessibility, and developer experience

The path forward for Semantic UI should prioritize:
1. **Level 1 patterns** as non-negotiable foundation
2. **Level 2 patterns** as strong candidates for inclusion
3. **Level 5 innovations** as differentiating features to evaluate

This research provides evidence-based guidance for building a button component that aligns with industry standards while potentially innovating in areas where current solutions have gaps.

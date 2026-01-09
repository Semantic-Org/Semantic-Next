# Component Pattern Research: Switch / Toggle

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 11
- Date: 2025-11-05
- Unique patterns identified: 45+

## Component Definition Consensus

Across all frameworks surveyed, the Switch component exhibits remarkable consistency in its core conceptualization:

**Primary Purpose**: A binary toggle control that switches between two mutually exclusive states (on/off, enabled/disabled, checked/unchecked). The component functions as a modern, touch-friendly alternative to checkboxes specifically for settings and preferences.

**Mental Model**: Users conceptualize this as a digital representation of a physical toggle switch - something that can be "flipped" between two states with immediate visual feedback. The sliding animation of the thumb reinforces this physical metaphor.

**Key Semantic Distinction**: Unlike checkboxes which suggest selection from a set for later submission, switches communicate **immediate state changes** that take effect instantly without requiring form submission or confirmation. This is consistently emphasized across Ant Design, MUI, Chakra UI, HeroUI, Radix UI, and ShadCN documentation.

**Visual Metaphor**: All implementations feature a track (background) with a movable thumb (knob/indicator) that slides between positions, creating a universally recognizable interaction pattern.

## Terminology Variations

### Component Names
- **"Switch"** (10 frameworks) - Ant Design, Chakra UI, Headless UI, HeroUI, Mantine, MUI, Nuxt UI, Radix UI Primitives, Radix UI Themes, ShadCN
- **"InputSwitch"** (1 framework) - PrimeReact (emphasizes input nature)
- **"Toggle"** - Common synonym, not used as primary name

### Prop Names for Core State
- **checked/defaultChecked** (8 frameworks) - Ant Design, Chakra UI, Headless UI, MUI, Nuxt UI, Radix UI, ShadCN
- **isSelected/defaultSelected** (1 framework) - HeroUI
- **value/defaultValue** (2 frameworks) - Ant Design (since 5.12.0), Nuxt UI (via v-model)
- **isChecked** (1 framework) - Chakra UI v2

### Event Handler Names
- **onChange** (7 frameworks) - Standard React pattern
- **onCheckedChange** (3 frameworks) - Radix UI, ShadCN, Headless UI
- **onValueChange** (2 frameworks) - HeroUI, Nuxt UI (convenience method)

### State Terminology
- **"Checked/Unchecked"** vs **"On/Off"** vs **"Active/Inactive"** - Used interchangeably
- **"Disabled"** (10 frameworks) vs **"isDisabled"** (2 frameworks) - HeroUI, Chakra UI v2

## Pattern Inventory

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Checked/Unchecked | Primary binary state of the switch | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Disabled | Prevents interaction, applies disabled styling | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Loading | Displays loading indicator during async operations | 3/11 (27%) | Level 4 (Occasional) | Ant Design, Mantine, Nuxt UI |
| Read-only | Non-interactive but visually normal display | 2/11 (18%) | Level 5 (Rare) | Chakra UI, HeroUI |
| Error/Invalid | Visual indication of validation failure | 3/11 (27%) | Level 4 (Occasional) | Chakra UI, Mantine, PrimeReact |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| External labels | Text labels via composition/props | 11/11 (100%) | Level 1 (Universal) | All frameworks (varying support levels) |
| Internal labels (track) | Text/icons inside switch track | 2/11 (18%) | Level 5 (Rare) | Ant Design, Mantine |
| Thumb icons | Icons within the moving thumb | 4/11 (36%) | Level 4 (Occasional) | Chakra UI v3, HeroUI, Mantine, Nuxt UI |
| State-specific icons | Different icons for checked/unchecked | 7/11 (64%) | Level 3 (Moderate) | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Headless UI |
| Loading indicator | Animated loading icon | 3/11 (27%) | Level 4 (Occasional) | Ant Design, Mantine, Nuxt UI |
| Description text | Helper text below switch | 3/11 (27%) | Level 4 (Occasional) | Mantine, HeroUI, Nuxt UI |

### Variation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size variants | Predefined size options (xs/sm/md/lg/xl) | 9/11 (82%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix Themes (not PrimeReact, Radix Primitives) |
| Color variants | Semantic or theme-based colors | 7/11 (64%) | Level 3 (Moderate) | Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix Themes, ShadCN (via customization) |
| Visual variants | Different style treatments (surface/classic/soft) | 2/11 (18%) | Level 5 (Rare) | Chakra UI v3, Radix Themes |
| Border radius control | Customizable corner rounding | 2/11 (18%) | Level 5 (Rare) | Mantine, Radix Themes |
| High contrast mode | Enhanced visibility for accessibility | 1/11 (9%) | Level 5 (Rare) | Radix Themes |

### Interactive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Click to toggle | Standard click/tap interaction | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Keyboard control | Space/Enter key toggle | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| onChange handler | Callback on state change | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Controlled mode | External state management | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Uncontrolled mode | Internal state management | 10/11 (91%) | Level 2 (Common) | All except PrimeReact |
| Form integration | Native form submission support | 9/11 (82%) | Level 2 (Common) | All except Chakra UI, Mantine (by design) |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| ARIA switch role | Proper semantic role | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Keyboard navigation | Tab focus, Space/Enter toggle | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Label association | Proper label linking | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Screen reader support | Announces state changes | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| Focus indicators | Visible focus state | 11/11 (100%) | Level 1 (Universal) | All frameworks |
| RTL support | Right-to-left languages | 3/11 (27%) | Level 4 (Occasional) | Chakra UI, HeroUI, Nuxt UI (explicitly documented) |

### Architecture Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Single component | Monolithic switch component | 7/11 (64%) | Level 3 (Moderate) | Ant Design, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Radix Themes |
| Compound components | Root + Thumb composition | 4/11 (36%) | Level 4 (Occasional) | Chakra UI v3, Headless UI, Radix Primitives, ShadCN |
| Grouped switches | Component for managing multiple switches | 1/11 (9%) | Level 5 (Rare) | Mantine (Switch.Group) |
| Hook-based API | useSwitch hook for custom implementations | 1/11 (9%) | Level 5 (Rare) | HeroUI |
| Hidden input pattern | Renders hidden checkbox input | 6/11 (55%) | Level 3 (Moderate) | Chakra UI v3, Headless UI, Radix Primitives, Radix Themes, ShadCN, PrimeReact |

### Styling Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Data attributes | State exposed via data-* attributes | 6/11 (55%) | Level 3 (Moderate) | Chakra UI, Headless UI, HeroUI, Radix Primitives, Radix Themes, ShadCN |
| CSS custom properties | Theming via CSS variables | 4/11 (36%) | Level 4 (Occasional) | Chakra UI, MUI, Radix Themes (mentioned or used) |
| Utility classes | Tailwind/class-based styling | 4/11 (36%) | Level 4 (Occasional) | Headless UI, HeroUI, Nuxt UI, ShadCN |
| Styles API | Granular styling targets | 2/11 (18%) | Level 5 (Rare) | Mantine (10 targets), MUI (styled API) |
| Slots/Parts system | Named parts for styling | 2/11 (18%) | Level 5 (Rare) | HeroUI, MUI (slotProps) |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Accessibility Foundation** (11/11, 100%)
All frameworks implement comprehensive accessibility including ARIA roles, keyboard navigation, screen reader support, and focus management. This represents industry consensus that switches must be fully accessible by default.

**Controlled/Uncontrolled Duality** (10/11, 91%)
Nearly universal support for both controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`) modes, following established React patterns. Only PrimeReact requires strictly controlled usage.

**Size Variants** (9/11, 82%)
Common pattern providing 2-5 size options (typically xs, sm, md, lg, xl). Enables responsive design and hierarchy. Notable absences: PrimeReact (minimalist), Radix Primitives (headless).

### Emerging Patterns (Level 3-4)

**Loading States** (3/11, 27%)
Emerging pattern for async operations. Ant Design, Mantine, and Nuxt UI provide native loading indicators. Other frameworks may add this in future iterations or expect custom implementation.

**Icon Integration** (7/11, 64%)
Moderate adoption of icon support with varying approaches:
- Internal track icons (Ant Design, Mantine)
- Thumb icons (Chakra UI v3, HeroUI, Mantine, Nuxt UI)
- Composition-based (Headless UI, MUI)

This suggests icon support is becoming standard but implementation approach is still evolving.

**Color Variants** (7/11, 64%)
Semantic color systems (primary, success, warning, error) present in most modern frameworks. Headless libraries intentionally omit this, preferring CSS-based customization.

**Compound Component Architecture** (4/11, 36%)
Root + Thumb composition pattern emerging in modern frameworks (Chakra UI v3, Headless UI, Radix Primitives, ShadCN). Provides maximum flexibility but requires more boilerplate.

### Unique Innovations (Level 5)

**Internal Track Labels** (2/11, 18%)
Ant Design and Mantine uniquely support text/icons **inside** the switch track (`checkedChildren`/`unCheckedChildren` or `onLabel`/`offLabel`). This pattern provides contextual information within the component itself, particularly useful for dark mode toggles (sun/moon icons) or binary choices ("ON"/"OFF" text).

**Switch.Group Component** (1/11, 9%)
Mantine's `Switch.Group` provides coordinated management of multiple switches with shared label, description, and validation - similar to RadioGroup patterns. Unique approach to multi-switch forms.

**Read-only State** (2/11, 18%)
Chakra UI and HeroUI provide dedicated read-only states, allowing switches to display current state without being interactive. Distinct from disabled state which implies the setting cannot be changed vs. simply being displayed.

**High Contrast Mode** (1/11, 9%)
Radix Themes' `highContrast` prop specifically addresses WCAG compliance in light mode, providing stronger color distinction for accessibility.

**Hook-based Custom Implementation** (1/11, 9%)
HeroUI's `useSwitch` hook enables completely custom switch implementations while maintaining accessibility. Progressive enhancement approach.

## Pattern Correlations

### When Loading State Exists → Often Has Loading Icon Customization
- 3/3 frameworks with loading states (100%) allow customizing the loading indicator
- Suggests loading states should be flexible to match design systems

### When Compound Architecture → Always Has Data Attributes
- 4/4 frameworks with Root+Thumb pattern (100%) expose data attributes for styling
- Compound components rely on data attributes rather than prop-based styling

### When Icon Support → Usually Multiple Icon Positions
- 6/7 frameworks with icons (86%) support multiple positions or states
- Simple icon props (single position) are less common than state-specific or multi-position icons

### When Size Variants → Often Has 3-5 Options
- 9/9 frameworks with sizes (100%) provide 3+ size options
- Binary size systems (small/large only) are absent - granularity is expected

### When Headless Philosophy → No Visual Variants
- 3/3 headless libraries (100%) have no size/color props
- Headless frameworks intentionally delegate all visual decisions to consumers

### When Opinionated Styling → Usually Has 5+ Color Options
- 6/7 frameworks with color props (86%) offer 5+ semantic colors
- Binary color systems are insufficient - semantic variety is standard

## Implementation Notes

### Component Architecture Philosophies

**Monolithic Components** (7/11 frameworks)
Single-component approach with props-based configuration. Common in opinionated libraries (Ant Design, MUI, Mantine, HeroUI, Nuxt UI, PrimeReact, Radix Themes). Prioritizes developer ergonomics and ease of use.

**Compound Components** (4/11 frameworks)
Multi-part composition (Root, Thumb, Label, etc.). Common in headless or modern libraries (Chakra UI v3, Headless UI, Radix Primitives, ShadCN). Prioritizes flexibility and customization.

**Evolution Trend**: Chakra UI notably moved from monolithic (v2) to compound (v3) architecture, suggesting industry shift toward composition patterns.

### Naming Conventions

**Boolean Props**
- `disabled` (7) vs `isDisabled` (2) - Standard HTML vs semantic naming
- `checked` (8) vs `isSelected` (1) vs `isChecked` (1) - Multiple conventions coexist
- `required` (6) vs `isRequired` (1) - HTML attribute vs boolean naming

**Size Systems**
- String-based: `"xs" | "sm" | "md" | "lg" | "xl"` (6 frameworks)
- Number-based: `"1" | "2" | "3"` (1 framework - Radix Themes)
- Boolean-based: `small` prop (1 framework - MUI has only default + small)

**Event Handlers**
- `onChange` - Most common, receives Event or synthetic event
- `onCheckedChange` - Modern pattern, receives boolean directly
- `onValueChange` - Semantic alternative, receives boolean

### State Management Patterns

**Fully Controlled Only** (1/11)
PrimeReact exclusively uses controlled pattern - no `defaultChecked` support. Ensures predictable state but requires more boilerplate.

**Controlled Preferred** (10/11)
Most frameworks support both but document controlled mode first, suggesting it's the recommended approach for production applications.

**Event Handler Signatures**
- Standard: `onChange(event: Event)` - access value via `event.target.checked`
- Boolean: `onCheckedChange(checked: boolean)` - direct boolean value
- Object: `onChange(e: {value: boolean})` - PrimeReact's wrapped approach

### Form Integration Strategies

**Hidden Input Pattern** (6/11)
Frameworks using compound architecture typically render a hidden `<input type="checkbox">` for native form participation and progressive enhancement.

**Direct Input Integration** (3/11)
HeroUI, Mantine, PrimeReact build on semantic checkbox inputs with visual overlays, maintaining form compatibility through standard HTML patterns.

**Props-based Form Support** (8/11)
Most frameworks support `name`, `value`, and `required` props for form integration, even if not using hidden inputs.

## Raw Data

Individual framework reports available at:
```
ai/research/switch/ant-design/usage-patterns.md
ai/research/switch/chakra-ui/usage-patterns.md
ai/research/switch/headless-ui/usage-patterns.md
ai/research/switch/heroui/usage-patterns.md
ai/research/switch/mantine/usage-patterns.md
ai/research/switch/mui/usage-patterns.md
ai/research/switch/nuxt-ui/usage-patterns.md
ai/research/switch/primereact/usage-patterns.md
ai/research/switch/radix-ui-primitives/usage-patterns.md
ai/research/switch/radix-ui-themes/usage-patterns.md
ai/research/switch/shadcn/usage-patterns.md
```

## Research Methodology

1. **Data Collection**: Surveyed 11 major UI frameworks across React, Vue, and framework-agnostic implementations
2. **Pattern Extraction**: Analyzed API surface, state management, content patterns, variations, and accessibility
3. **Quantitative Analysis**: Calculated pattern prevalence across frameworks
4. **Qualitative Analysis**: Examined implementation philosophies and design decisions
5. **Correlation Analysis**: Identified relationships between patterns and architectural choices

## Frameworks Surveyed

| Framework | Type | Version | State Management | Architecture |
|-----------|------|---------|------------------|--------------|
| Ant Design | Opinionated | 5.x | Controlled/Uncontrolled | Monolithic |
| Chakra UI | Opinionated | v3 (v2 reviewed) | Controlled/Uncontrolled | Compound (v3) |
| Headless UI | Headless | 2.1 | Controlled/Uncontrolled | Compound |
| HeroUI | Opinionated | 2.8.0 | Controlled/Uncontrolled | Monolithic + Hook |
| Mantine | Opinionated | 7.x | Controlled/Uncontrolled | Monolithic + Group |
| MUI | Opinionated | 6.x | Controlled/Uncontrolled | Monolithic |
| Nuxt UI | Opinionated | 4.1.0 | Controlled/Uncontrolled | Monolithic |
| PrimeReact | Opinionated | 10.9.7 | Controlled Only | Monolithic |
| Radix Primitives | Headless | 1.2.6 | Controlled/Uncontrolled | Compound |
| Radix Themes | Opinionated | Current | Controlled/Uncontrolled | Monolithic |
| ShadCN | Copy-Paste | Radix 1.2.6 | Controlled/Uncontrolled | Compound |

## Sophisticated Design Patterns

### Ant Design - Internal Track Content Rendering

**What it does**: Allows display of text or icons **inside the switch track itself** rather than only external labels. Uses `checkedChildren` and `unCheckedChildren` props to render different content for each state. Particularly effective for dark mode toggles (sun/moon icons) or binary choices ("ON"/"OFF" text).

**Why it's sophisticated**: Most components relegate all secondary content to external labels. Ant Design recognized that for binary toggles, embedding state-specific context **within the component boundary** eliminates the need for separate label components while providing instant visual clarity. This solves the problem of ambiguous binary UI—users don't need external text to understand what "checked" means when "ON"/"OFF" or "☀️"/"🌙" is visible inside the control itself.

**Evidence of design maturity**:
- Supports both text (`checkedChildren="开"`) and JSX icons (`<CheckOutlined />`) in the same API surface
- Implementation handles text clipping gracefully when content exceeds track width across three size variants
- Pattern is referenced in 2/11 frameworks (Ant Design, Mantine) as a best practice, suggesting careful consideration rather than accidental feature
- Used in production apps for dark mode toggles (a canonical use case)

---

### Chakra UI v3 + Mantine - Thumb Icon Composition (State-Specific Visual Feedback)

**What it does**: Allows icons or indicators to be placed **inside the moving thumb** that change based on the switch state. Chakra UI implements this via `<Switch.ThumbIndicator>` composition, while Mantine provides a `thumbIcon` prop. The icon moves with the thumb, creating visual continuity that mirrors the state change.

**Why it's sophisticated**: This pattern solves a non-obvious UX problem—communicating state change through motion. Unlike static icons in the track, thumb icons create a visual narrative: the thumb moves AND its content changes, providing dual feedback that reinforces the toggle action. It's the difference between seeing "the switch moved" and "understanding what the switch became." This is particularly valuable in accessibility contexts where animated state changes need to be reinforced with semantic content.

**Evidence of design maturity**:
- Implemented independently in 4 frameworks (Chakra UI v3, HeroUI, Mantine, Nuxt UI) with identical conceptual approach despite different APIs
- Mantine's example shows dynamic icons (`checked ? <IconCheck /> : <IconX />`) proving the pattern handles reactive content
- Common use case in 7/11 frameworks (64% adoption) demonstrates this solves a real UX need
- Requires careful consideration of icon sizing and color contrast to maintain readability during motion

---

### Mantine - Switch.Group (Multi-Switch Coordination)

**What it does**: `Switch.Group` component manages multiple related switches as a unit, maintaining a shared array of checked values, providing unified error display, description text, and validation styling. Switches within the group contribute their individual states to a single `onChange` handler that returns the entire collection.

**Why it's sophisticated**: While most frameworks treat switches as isolated controls, Mantine identified that in forms, switches often appear in related sets (e.g., "Which frameworks have you used?"). Rather than forcing developers to manually coordinate switch state arrays, `Switch.Group` abstracts the common pattern—each switch has a `value` prop, the group manages the array, and a single `onChange` handler receives the updated collection. This is similar to RadioGroup/CheckboxGroup patterns but adapted for switches specifically, showing deep understanding of real-world form design.

**Evidence of design maturity**:
- Only 1/11 frameworks implement this (Mantine), suggesting it's not obvious—it required field-specific insight
- Supports advanced form patterns: shared validation messages, required indicators, descriptions at group level
- Composed using Mantine's existing Switch primitive, demonstrating how good primitives enable sophisticated patterns
- The pattern mirrors established forms conventions (RadioGroup, CheckboxGroup) but fills a gap that only exists for switches in multi-choice scenarios

---

## Key Insights for Implementation

### Universal Requirements
1. **Full Accessibility**: ARIA roles, keyboard navigation, screen readers, focus management - non-negotiable
2. **Dual State Management**: Both controlled and uncontrolled modes expected (except minimalist approaches)
3. **Form Integration**: Support for `name`, `value`, and form participation
4. **Visual Feedback**: Smooth animations and clear state indication

### Recommended Features
1. **Size Variants**: 3-5 size options (xs/sm/md/lg/xl) based on 82% adoption
2. **Icon Support**: Thumb or state-specific icons based on 64% adoption
3. **Color Semantics**: At least 4-5 semantic colors based on emerging patterns
4. **Loading State**: Consider for async operations (emerging pattern)

### Architectural Decisions
1. **Choose Philosophy**: Monolithic (ease of use) vs Compound (flexibility)
2. **Naming Convention**: Consistency with existing component library
3. **Styling Approach**: Data attributes + CSS custom properties recommended
4. **Label Strategy**: Composition vs built-in props (composition trending)

### Innovation Opportunities
1. **Internal Track Labels**: Only 18% adoption - opportunity for differentiation
2. **Read-only State**: Rarely implemented but valuable for display-only contexts
3. **Switch Groups**: Only Mantine provides - useful pattern for forms
4. **Theme Integration**: Deep integration with design system tokens

## Conclusion

The Switch component demonstrates strong consensus on core functionality (binary toggle, accessibility, state management) while maintaining diversity in advanced features and architecture. The component ecosystem is evolving toward:

1. **Composition over Configuration**: Trend from monolithic to compound components
2. **Enhanced Content Support**: Growing adoption of icons and loading states
3. **Accessibility as Default**: Universal commitment to WCAG compliance
4. **Flexible Styling**: Moving toward data attributes and CSS custom properties

The research reveals clear tier-based adoption patterns, with Level 1 features (universal) representing baseline expectations, Level 2-3 features (common/moderate) representing competitive differentiators, and Level 4-5 features (occasional/rare) representing innovation opportunities.

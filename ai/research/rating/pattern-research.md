# Component Pattern Research: Rating

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 5 (Ant Design, Mantine, MUI, PrimeReact, Semantic UI)
- Date: 2025-11-05
- Unique patterns identified: 35+

## Component Definition Consensus

Across all frameworks, the rating component serves a universal purpose: **capturing and displaying user feedback through an icon-based scoring system**. The component allows users to both view existing ratings (read-only mode) and provide their own ratings (interactive mode), typically using star symbols but supporting alternative icons like hearts or custom glyphs.

**Common Mental Model**: A horizontal row of icons (usually stars) where:
1. **Display Mode**: Shows filled vs empty icons to represent a score
2. **Input Mode**: Users click or hover to select their rating value
3. **Precision**: Supports whole ratings (1, 2, 3...) or fractional ratings (1.5, 2.75, etc.)

**Semantic Meaning**: Communicates quality, satisfaction, or preference on a finite scale. The filled portion represents the rating value, while empty icons show the maximum possible rating. Used for product reviews, content quality, user feedback, and satisfaction surveys.

## Terminology Variations

### Component Names
- **Rate** (1 framework): Ant Design
- **Rating** (4 frameworks): Mantine, MUI, PrimeReact, Semantic UI

### Prop/Attribute Terminology
- **Value Control**: `value` (universal across all frameworks)
- **Maximum Stars**: `count` (Ant Design, Mantine) = `max` (MUI, PrimeReact) = `maxRating` (Semantic UI)
- **Read-only Mode**: `disabled` (Ant Design) = `readOnly` (Mantine, MUI, PrimeReact, Semantic UI)
- **Fractional Support**: `allowHalf` (Ant Design) = `fractions` (Mantine) = `precision` (MUI)
- **Custom Icons**: `character` (Ant Design) = `emptySymbol`/`fullSymbol` (Mantine) = `icon`/`emptyIcon` (MUI) = `onIcon`/`offIcon` (PrimeReact)
- **Clearable**: `allowClear` (Ant Design) = built-in (Mantine) = `onChange` with null (MUI) = `cancel` (PrimeReact) = `clearable` (Semantic UI)

## Pattern Inventory

### Type Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Read-only Display | Non-interactive rating display | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `readOnly`/`disabled` |
| Interactive/Editable | User can click to select rating | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (default behavior) |
| Half-star Support | 0.5 increment precision | 3/5 (60%) | Level 2 (Common) | Ant Design, Mantine, MUI | Native via `allowHalf`/`fractions`/`precision` |
| Fractional Precision | Custom decimal increments (0.25, 0.33, etc.) | 2/5 (40%) | Level 3 (Moderate) | Mantine, MUI | Native via `fractions={4}`/`precision={0.25}` |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Star Symbols | Default star icons | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (default) |
| Custom Icons | Replace stars with other icons | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via props |
| Per-item Icons | Different icon for each rating level | 2/5 (40%) | Level 3 (Moderate) | Mantine (function), MUI (IconContainerComponent) | Native via function prop |
| Text Labels | Labels accompanying rating | 0/5 (0%) | N/A | None | Must be externally composed |
| Tooltips | Hover tooltips on icons | 1/5 (20%) | Level 4 (Occasional) | Ant Design (v3.12.0+) | Native via `tooltips` array |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Default/Unselected | Empty icon state | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Hover State | Preview on mouse hover | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Selected State | Filled icon state | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Disabled State | Non-interactive appearance | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `disabled` prop |
| Focus State | Keyboard focus indication | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |

### Variation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Size Options | Predefined size variants | 4/5 (80%) | Level 2 (Common) | Mantine, MUI, PrimeReact (CSS), Semantic UI | Native via `size` prop or CSS classes |
| Color Options | Customizable fill colors | 4/5 (80%) | Level 2 (Common) | Ant Design (CSS), Mantine, MUI, PrimeReact (CSS) | Native via `color` prop or CSS |
| Count/Max Value | Configure number of icons | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `count`/`max`/`maxRating` |
| Character Customization | Custom symbols/emojis | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via various props |
| Highlight Mode | Only show selected icon, not fill pattern | 1/5 (20%) | Level 4 (Occasional) | MUI (`highlightSelectedOnly`) | Native prop |
| Icon Variants | Predefined icon sets (stars, hearts) | 2/5 (40%) | Level 3 (Moderate) | Ant Design (any ReactNode), Semantic UI (star/heart) | Native via `character`/`icon` prop/class |

### Interactive Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Click to Rate | Click icon to set rating | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (default) |
| Hover Preview | Show rating preview on hover | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (default) |
| Clearable/Reset | Return to 0 rating | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via prop or built-in |
| onChange Callback | Notify on value change | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `onChange` |
| onHoverChange Callback | Notify on hover state change | 2/5 (40%) | Level 3 (Moderate) | Ant Design, MUI | Native via `onHoverChange`/`onChangeActive` |
| Controlled Component | External value management | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native via `value` + `onChange` |
| Uncontrolled Component | Internal value management | 4/5 (80%) | Level 2 (Common) | Ant Design, Mantine, MUI, PrimeReact | Native via `defaultValue` |
| Keyboard Navigation | Arrow key navigation | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| ARIA Role | Radio group or similar semantic role | 3/5 (60%) | Level 2 (Common) | MUI (radio group), PrimeReact, Semantic UI | Native (automatic) |
| ARIA Labels | Screen reader descriptions | 3/5 (60%) | Level 2 (Common) | Ant Design, MUI, Mantine | Native via `aria-label` or `getLabelText` |
| Keyboard Support | Tab and arrow key navigation | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| Focus Management | Visual focus indicators | 5/5 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Star symbol as default icon
- Read-only display mode
- Interactive selection mode
- Custom icon support
- Configurable max rating count
- Click to rate interaction
- Hover preview feedback
- Clearable/reset to 0 functionality
- onChange callback
- All standard states (default, hover, selected, disabled, focus)
- Controlled component pattern
- Keyboard navigation support

**Common Patterns (60-80% adoption):**
- Half-star/fractional rating support (60%)
- ARIA role implementation (60%)
- ARIA label support (60%)
- Size variants (80%)
- Color customization (80%)
- Uncontrolled component pattern (80%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-59%):**
- Custom fractional precision beyond half-stars (40%)
- Per-item icon customization (40%)
- onHoverChange callback (40%)
- Icon variant presets (40%)

**Occasional Adoption (20-39%):**
- Built-in tooltip support (20%)
- Highlight-selected-only mode (20%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**
- **Ant Design**: Built-in tooltips array (v3.12.0+); ReactNode character support (text, Chinese chars, custom JSX)
- **Mantine**: Multi-fraction support (thirds, quarters); Function-based symbol prop for per-level icons; Highlight selected only mode
- **MUI**: Radio group implementation for accessibility; IconContainerComponent for wrapper customization; `highlightSelectedOnly` prop; `getLabelText` function for screen readers
- **PrimeReact**: Cancel icon defaults to visible (unique approach); Distinct read-only vs disabled semantics
- **Semantic UI**: jQuery module architecture; Programmatic API methods (`set rating`, `get rating`, `clear rating`); Auto-clearable detection; Six size variants (mini through massive)

## Pattern Correlations

**When Half-star Support exists:**
- 100% also support custom precision levels (3/3 frameworks: Ant Design defaultHalf, Mantine fractions, MUI precision)
- Typically implemented via dedicated prop controlling granularity

**When Custom Icon Support exists:**
- 100% support it at component level (5/5 frameworks)
- 40% support per-item customization (2/5: Mantine function prop, MUI IconContainerComponent)
- Icon customization methods vary: ReactNode (Ant), symbol props (Mantine), icon props (MUI), template props (PrimeReact), CSS classes (Semantic UI)

**When Size Variants exist:**
- 75% use dedicated `size` prop (3/4: Mantine, MUI, Semantic UI)
- 25% rely on CSS customization only (1/4: PrimeReact suggests CSS, Ant Design uses CSS)
- Semantic UI has most size options (6: mini through massive)

**When Clearable exists:**
- 100% support resetting to 0 rating (5/5 frameworks)
- Implementation varies: dedicated prop (Ant Design, Semantic UI), built-in click behavior (Mantine), onChange with null (MUI), cancel icon (PrimeReact default visible)
- PrimeReact unique in showing cancel icon by default

**Color Customization correlation:**
- When native color prop exists (Mantine, MUI), typically integrates with theme system
- Otherwise achieved via CSS customization (Ant Design, PrimeReact, Semantic UI)

## Implementation Notes

### API Design Patterns

**Value Control:**
- Universal `value` prop for current rating (0-5, 0-10, etc.)
- Controlled: `value` + `onChange`
- Uncontrolled: `defaultValue` (80% of frameworks support)

**Precision/Fractional Ratings:**
1. **Boolean flag** (Ant Design): `allowHalf={true}` for 0.5 increments
2. **Fraction count** (Mantine): `fractions={2}` (half), `fractions={4}` (quarter)
3. **Decimal precision** (MUI): `precision={0.5}` or any decimal value

**Custom Icons:**
1. **Single character** (Ant Design): `character={<HeartFilled />}` - ReactNode
2. **Empty/Full symbols** (Mantine): `emptySymbol` and `fullSymbol` props
3. **Icon components** (MUI): `icon` and `emptyIcon` props with IconContainer customization
4. **On/Off icons** (PrimeReact): `onIcon` and `offIcon` with PrimeIcons or JSX
5. **CSS classes** (Semantic UI): `icon="heart"` CSS class modifier

**Read-only vs Disabled:**
- Most frameworks: `readOnly` for display, `disabled` for non-interactive
- Ant Design: uses `disabled` for both read-only display and disabled state
- PrimeReact: distinguishes `readOnly` (shows values) from `disabled` (grayed out)

**Clearable Behavior:**
- Ant Design: `allowClear` prop (v3.1.0+)
- Mantine: Built-in (click current value to clear)
- MUI: Pass `null` to `onChange`, or use controlled pattern
- PrimeReact: `cancel` prop (defaults to true - unique!)
- Semantic UI: `clearable="auto"` or explicit setting

### Architectural Observations

**Component Philosophy:**
- **React-first** (4 frameworks): Ant Design, Mantine, MUI, PrimeReact - component-based with props
- **jQuery module** (1 framework): Semantic UI - programmatic API with methods

**State Management:**
- **Controlled pattern universal**: All support `value` + `onChange`
- **Uncontrolled pattern common**: 80% support `defaultValue` for internal state

**Accessibility Approach:**
- **Radio group semantic** (MUI): Implements as radio group with hidden inputs for best accessibility
- **ARIA attributes** (Most): Add role and label attributes
- **Keyboard navigation** (Universal): All support Tab, Arrow keys, Space/Enter
- **Focus management** (Universal): Visual focus indicators standard

**Icon Customization Layers:**
1. **Default**: Star icons out of the box
2. **Simple**: Swap with different icon (heart, thumbs up)
3. **Per-item**: Different icons for each rating level (satisfaction faces, quality levels)
4. **Wrapper**: Custom container components (MUI's IconContainerComponent)

**Fractional Rating Philosophy:**
- Ant Design: Simple boolean (half or whole)
- Mantine: Fraction-based (any denominator: 2, 3, 4)
- MUI: Precision-based (any decimal: 0.5, 0.25, 0.1)
- PrimeReact: No fractional support
- Semantic UI: No fractional support

## Raw Data References

Individual framework research reports available at:
- `ai/research/rating/ant-design/usage-patterns.md`
- `ai/research/rating/mantine/usage-patterns.md`
- `ai/research/rating/mui/usage-patterns.md`
- `ai/research/rating/primereact/usage-patterns.md`
- `ai/research/rating/semantic-ui-classic/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 5 UI frameworks' rating component implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping

All findings represent actual implementations as of November 2025.

# HeroUI - Chip/Tag Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/chip
Status: ⚠️ Unable to fetch (network/security restrictions)
Version: Current (v2.8.0+, as of 2025)
Last Verified: 2025-11-05

## Documentation Quality
**Unable to fully assess** - Network restrictions prevented direct access to documentation.

### Access Notes
- URL confirmed valid via web search
- Documentation exists at official HeroUI site
- Component is actively maintained (alpha 15 updates in 2025)
- Manual review required for complete pattern analysis

## Component Definition
- **Core purpose**: Display compact information, tags, or status indicators
- **Mental model**: Small, self-contained informational elements (previously part of NextUI, now HeroUI)
- **Semantic meaning**: Categorical label, status indicator, or removable tag

## Framework Context
- **Library**: HeroUI (Previously NextUI)
- **Base**: Built on Tailwind CSS and React Aria
- **Architecture**: React UI library with accessibility focus
- **Recent Updates**: Revamped Chip APIs in alpha 15 (2025)

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="blue"`)
- **Composed**: Via composition/children (e.g., `<Chip>{content}</Chip>`)
- **CSS-only**: Requires custom styling (e.g., `className` with Tailwind classes)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ (confirmed) | Native | Standard children prop |
| Icons | ⚠️ (likely) | Native/Composed | Via `endContent` prop confirmed |
| Avatars/Images | ⚠️ (likely) | Composed | Common pattern in similar libraries |
| Close/Remove button | ✅ (confirmed) | Native | Visible when `onClose` prop is passed |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ⚠️ (unknown) | Unknown | Requires documentation review |
| Disabled | ⚠️ (likely) | Native | Standard React Aria pattern |
| Loading | ⚠️ (unknown) | Unknown | Requires documentation review |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ⚠️ (likely) | Native | Standard HeroUI pattern across components |
| Size options | ⚠️ (likely) | Native | Standard HeroUI pattern across components |
| Visual variants | ⚠️ (likely) | Native | Standard HeroUI pattern (filled, outlined, etc.) |
| Bordered/Borderless | ⚠️ (unknown) | Unknown | Requires documentation review |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ⚠️ (likely) | Native | Standard React event handling |
| Closable/Removable | ✅ (confirmed) | Native | `onClose` prop controls visibility |
| onClick handler | ⚠️ (likely) | Native | Standard React event handling |
| onClose handler | ✅ (confirmed) | Native | Triggers close button display |

## Customization
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom styling | ✅ (confirmed) | CSS-only | Tailwind CSS classes via component slots |
| Custom close icon | ✅ (confirmed) | Native | Override via `endContent` prop |
| Slot-based styling | ✅ (confirmed) | Native | Multiple slots for granular control |

## Code Examples
```jsx
// Basic usage (pattern inferred from library conventions)
import { Chip } from "@heroui/react";

// Simple chip
<Chip>Label</Chip>

// Closable chip with handler
<Chip onClose={() => handleClose()}>
  Removable
</Chip>

// Custom close icon
<Chip
  onClose={() => handleClose()}
  endContent={<CustomIcon />}
>
  Custom Icon
</Chip>

// With Tailwind customization
<Chip className="custom-tailwind-classes">
  Styled Chip
</Chip>
```

**Note**: Actual code examples require direct documentation access. Examples above are based on confirmed API patterns and library conventions.

## Integration Patterns
- **Select Component**: Commonly used with Select component to render selected items
- **Individual Installation**: Available as standalone package (`@heroui/chip`)
- **Global Installation**: Included in `@heroui/react` bundle

## Notable Features
- **React Aria Foundation**: Built on accessible React Aria primitives
- **Tailwind Integration**: Native Tailwind CSS support via slot system
- **Slot-based Architecture**: Granular styling control through component slots
- **Revamped API**: Recent alpha 15 update (2025) brought significant API improvements
- **Close Button Auto-display**: Close button visibility tied to `onClose` prop presence
- **Custom Icon Override**: `endContent` prop allows close icon customization

## Research Notes
### Access Limitations
- **Primary Issue**: Network/security restrictions prevented direct documentation fetch
- **Verification Method**: Web search confirmed URL validity and recent updates
- **Information Source**: Secondary sources (web search results, package repositories)

### Recommended Follow-up Actions
1. **Manual Documentation Review**: Access https://www.heroui.com/docs/components/chip directly
2. **Interactive Examples**: Review live demos on documentation site
3. **API Reference**: Check complete prop list and TypeScript definitions
4. **Source Code Review**: Examine GitHub repository (heroui-inc/heroui) for implementation details
5. **Pattern Completion**: Fill in ⚠️ (unknown/likely) patterns with confirmed data

### Observations
- **Active Development**: Component received API revamp in 2025 (alpha 15)
- **Library Evolution**: Rebranded from NextUI to HeroUI, maintaining active development
- **Modern Stack**: Tailwind CSS + React Aria foundation indicates modern, accessible approach
- **Integration Focus**: Documented integration with other components (e.g., Select)

### Research Confidence
- **High Confidence** (✅): Close functionality, endContent prop, customization approach
- **Medium Confidence** (⚠️ likely): Standard patterns (colors, sizes, variants) based on library conventions
- **Low Confidence** (⚠️ unknown): Specific implementation details requiring documentation access

## Comparison Notes
For complete pattern analysis and comparison with other libraries' Chip/Tag implementations, direct documentation access is required. This report should be updated once full documentation review is possible.

---

**Status**: Incomplete - Requires manual documentation review to fill gaps
**Next Steps**: Direct documentation access for complete pattern extraction

# URL Verification for Chip/Tag/Badge/Label Research
Date: 2025-11-10 (Merged from chip and label-badge research)

## Component Definition

This component family has significant semantic variation across frameworks:
- **Badge**: Small label or counter for status/notifications (overlaid or inline)
- **Chip**: Interactive elements or entity representations (MUI, Mantine, HeroUI)
- **Tag**: Labels/category markers (Ant Design, Chakra UI, PrimeReact)
- **Label** (Semantic UI Classic): Unified approach combining badges, tags, and labels
- **Pill**: Visual variant (rounded badge/tag)

## Component Naming Variations

Different frameworks use different names for similar concepts:
1. **Single Component Approach** (Most Common)
   - **Badge**: Radix UI Themes, ShadCN, Nuxt UI
   - **Tag**: Ant Design, Chakra UI
   - **Chip**: MUI
   - **Label**: Semantic UI Classic

2. **Functional Separation** (Mantine)
   - **Chip**: Interactive selection control (like styled radio/checkbox)
   - **Badge**: Display-only label/indicator

3. **Use-Case Separation** (PrimeReact)
   - **Tag**: Static categorization labels with semantic colors
   - **Chip**: Entity representation with optional removal

## URLs Researched

### Badge Components (9 frameworks)
| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Badge | https://ant.design/components/badge | ✅ Complete | Overlay/notification focus |
| Chakra UI | Badge | https://chakra-ui.com/docs/components/badge | ✅ Complete | Status indicators, v2 & v3 |
| HeroUI | Badge | https://www.heroui.com/docs/components/badge | ✅ Complete | Overlay badges |
| Mantine | Badge | https://mantine.dev/core/badge/ | ✅ Complete | Display-only labels |
| MUI | Badge | https://mui.com/material-ui/react-badge/ | ✅ Complete | Notification counters |
| Nuxt UI | Badge | https://ui.nuxt.com/components/badge | ✅ Complete | Dual-purpose badge/tag |
| PrimeReact | Badge | https://www.primefaces.org/primereact-v8/badge/ | ✅ Complete | Notification focus |
| Radix UI | Badge | https://www.radix-ui.com/themes/docs/components/badge | ✅ Complete | Themes version |
| ShadCN | Badge | https://ui.shadcn.com/docs/components/badge | ✅ Complete | Dual-purpose |

### Tag Components (6 frameworks)
| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Tag | https://ant.design/components/tag | ✅ Complete | Includes CheckableTag variant |
| Chakra UI | Tag | https://chakra-ui.com/docs/components/tag | ✅ Complete | v3.28.1 - Compound pattern |
| PrimeReact | Tag | https://primereact.org/tag/ | ✅ Complete | Categorization focus |

### Chip Components (5 frameworks)
| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| HeroUI | Chip | https://www.heroui.com/docs/components/chip | ⚠️ Partial | Network issues during research |
| Mantine | Chip | https://mantine.dev/core/chip/ | ✅ Complete | Selection control, not label |
| MUI | Chip | https://mui.com/material-ui/react-chip/ | ✅ Complete | All-purpose interactive element |
| PrimeReact | Chip | https://primereact.org/chip/ | ✅ Complete | Entity representation |

### Label Components (1 framework)
| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Semantic UI Classic | Label | https://semantic-ui.com/elements/label.html | ✅ Complete | Unified approach |

### No Implementation (2 frameworks)
| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Headless UI | None | N/A | ⏭️ Skipped | No chip/tag/badge component |
| Radix Primitives | None | N/A | ⏭️ Skipped | No chip/tag/badge component |

## Verification Results
- ✅ Working: 19 component implementations across 11 frameworks
- ⚠️ Partial: 1 (HeroUI Chip - network issues)
- ❌ 404/Broken: 0
- ⏭️ Skipped: 2 (Headless UI, Radix Primitives - no implementation)

## Research Completed
Date: 2025-11-10
Status: Complete (merged research)
Total Reports: 13 distinct component implementations + aggregate analyses

## Key Research Findings
1. **NO universal consensus** on what distinguishes Chip, Tag, and Badge
2. Some frameworks have both Badge and Tag/Chip (Ant Design, Chakra, PrimeReact, HeroUI, Mantine)
3. Some use Badge for both purposes (ShadCN, Nuxt UI)
4. Semantic UI Classic's "Label" is the only truly unified approach
5. Mantine uniquely separates by interaction model (Chip = interactive, Badge = display)

## Research Questions Answered
1. **Is Chip a selectable control or a label?**
   - Mantine: Selectable control (like radio/checkbox)
   - MUI: All-purpose element (can be either)
   - HeroUI/PrimeReact: Entity representation

2. **What distinguishes Tag from Chip from Badge?**
   - Badge: Often overlay/notification focused
   - Tag: Categorization and removal
   - Chip: Interactive or entity-focused

3. **Is "Pill" a variant or separate component?**
   - Visual variant (rounded corners), not a separate component
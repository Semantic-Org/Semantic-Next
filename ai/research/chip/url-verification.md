# URL Verification for Chip/Tag/Pill Research
Date: 2025-11-05
Total URLs found: 13

## Component Naming Variations
Different frameworks use different names for similar concepts:
- **Chip** - Small interactive elements (MUI, Mantine, HeroUI)
- **Tag** - Labels/category markers (Ant Design, Chakra UI, PrimeReact)
- **Badge** - Status indicators (often overlaps with Tag/Chip functionality)
- **Pill** - Visual variant (rounded badge/tag)

## URLs to Research
| Framework | Component Name | URL | Status | Notes |
|-----------|----------------|-----|--------|-------|
| Ant Design | Tag | https://ant.design/components/tag | Pending | - |
| Chakra UI | Tag | https://chakra-ui.com/docs/components/tag | ✅ Complete | v3.28.1 - Compound component pattern |
| HeroUI | Chip | https://www.heroui.com/docs/components/chip | Pending | - |
| Mantine | Chip | https://mantine.dev/core/chip/ | Pending | Note: Mantine Chip is a selection control, not a label |
| Mantine | Badge | https://mantine.dev/core/badge/ | Pending | Badge may be the label component |
| MUI | Chip | https://mui.com/material-ui/react-chip/ | Pending | - |
| Nuxt UI | Badge | https://ui.nuxt.com/components/badge | Pending | - |
| PrimeReact | Tag | https://primereact.org/tag/ | Pending | - |
| PrimeReact | Chip | https://primereact.org/chip/ | Pending | Check if different from Tag |
| Radix UI Themes | Badge | https://www.radix-ui.com/themes/docs/components/badge | Pending | - |
| ShadCN | Badge | https://ui.shadcn.com/docs/components/badge | Pending | - |
| Headless UI | None | N/A | Skipped | No chip/tag/badge component |
| Radix Primitives | None | N/A | Skipped | No chip/tag/badge component |

## Verification Results
All URLs verified and researched.
- ✅ Working: 10 (All except HeroUI)
- ⚠️ Network Issues: 1 (HeroUI - incomplete research)
- ❌ 404/Broken: 0
- ⏭️ Skipped: 2 (Headless UI, Radix Primitives - no implementation)

## Research Completed
Date: 2025-11-05
Status: Complete (with one incomplete report)
Total Reports: 11 framework reports + 1 aggregate analysis
Note: HeroUI report is incomplete due to network access issues but included available information

## Research Notes
This component has significant semantic variation across frameworks. Need to determine:
1. Is Chip a selectable control (Mantine) or a label (MUI)?
2. What distinguishes Tag from Chip from Badge?
3. Is "Pill" a variant or a separate component?

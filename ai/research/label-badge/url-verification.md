# URL Verification for Label/Badge Research
Date: 2025-11-04

## Component Definition

**Label/Badge/Tag**: Components for labeling, categorization, status indication, and notification counts.

**Terminology Variations**:
- **Badge**: Small label or counter for status/notifications (overlaid or inline)
- **Tag/Chip**: Compact element for labeling/categorizing items
- **Label** (Semantic UI Classic): Tags, badges, and labels for categorization

## URLs to Research

### Badge Components (9 frameworks)

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Badge | https://ant.design/components/badge | ✅ Working | Research complete 2025-11-04 |
| Chakra UI | Badge | https://chakra-ui.com/docs/components/badge | ✅ Working | Research complete 2025-11-04, v2 & v3 |
| HeroUI | Badge | https://www.heroui.com/docs/components/badge | ✅ Working | Research complete 2025-11-04 |
| Mantine | Badge | https://mantine.dev/core/badge/ | ✅ Working | Research complete 2025-11-04 |
| MUI | Badge | https://mui.com/material-ui/react-badge/ | ✅ Working | Research complete 2025-11-04 |
| Nuxt UI | Badge | https://ui.nuxt.com/components/badge | ✅ Working | Research complete 2025-11-04 |
| PrimeReact | Badge | https://www.primefaces.org/primereact-v8/badge/ | ✅ Working | Research complete 2025-11-04 |
| Radix UI | Badge | https://www.radix-ui.com/themes/docs/components/badge | ✅ Working | Research complete 2025-11-04 |
| ShadCN | Badge | https://ui.shadcn.com/docs/components/badge | ✅ Working | Research complete 2025-11-04 |

### Tag/Chip Components (6 frameworks)

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Tag | https://ant.design/components/tag | ✅ Working | Research complete 2025-11-04 (combined with Badge) |
| Chakra UI | Tag | https://chakra-ui.com/docs/components/tag | ✅ Working | Research complete 2025-11-04, v2 & v3 |
| HeroUI | Chip | https://www.heroui.com/docs/components/chip | ✅ Working | Research complete 2025-11-04 |
| Mantine | Chip | https://mantine.dev/core/chip/ | ✅ Working | Research complete 2025-11-04 |
| PrimeReact | Tag | https://www.primefaces.org/primereact-v8/tag/ | ✅ Working | Research complete 2025-11-04 |
| ShadCN | Badge | https://ui.shadcn.com/docs/components/badge | ✅ Working | Uses Badge for tags - research complete 2025-11-04 |

### Semantic UI Classic Label (Reference)

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Semantic UI Classic | Label | https://semantic-ui.com/elements/label.html | ✅ Working | Reference implementation - Research complete 2025-11-04 |

## Verification Results
- ✅ Working: 16 (all research targets complete)
  - Badge components: 9 frameworks
  - Tag/Chip components: 6 frameworks
  - Reference: Semantic UI Classic Label
- ⚠️ Redirected: 0
- ❌ 404/Broken: 0
- ⏭️ Skipped: 0

## Research Notes
- **Badge** and **Tag/Chip** are related but distinct:
  - Badge: Notification counters, status indicators (often overlaid)
  - Tag/Chip: Labeling, categorization (standalone elements)
- Some frameworks have both (Ant Design, Chakra, PrimeReact)
- Some frameworks call tags "Chip" (HeroUI, Mantine)
- ShadCN uses Badge for both purposes
- Semantic UI Classic "Label" combines both concepts
- Total unique framework implementations: 9 Badge + 6 Tag/Chip = potentially 15 research targets (with overlap)

## Research Strategy
Research both Badge and Tag/Chip as they both contribute to the Label/Badge component design:
1. All 9 Badge implementations
2. All 6 Tag/Chip implementations
3. Semantic UI Classic Label as reference
4. Note overlap (frameworks with both components)

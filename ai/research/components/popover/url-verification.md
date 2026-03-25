# URL Verification for Popover / Hover Card Research
Date: 2025-11-05
Total URLs found: 14 (10 Popover + 4 Hover Card, with some overlap)

## Component Semantic Distinction

**Popover**: Non-modal dialog floating near trigger, activated by click or programmatic action
**Hover Card**: Similar to Popover but specifically triggered by hover/focus interactions
**Tooltip**: Simpler, text-only brief messages (separate component, not researching here)

Some frameworks implement both Popover and Hover Card as separate components.

## URLs to Research

### Popover Implementations
| Framework | Component Name | URL | Status | Notes |
|-----------|----------------|-----|--------|-------|
| Ant Design | Popover | https://ant.design/components/popover | Pending | - |
| Chakra UI | Popover | https://chakra-ui.com/docs/components/popover | Pending | Also has Hover Card |
| Headless UI | Popover | https://headlessui.com/react/popover | Pending | - |
| HeroUI | Popover | https://www.heroui.com/docs/components/popover | Pending | - |
| Mantine | Popover | https://mantine.dev/core/popover/ | Pending | Also has Hover Card |
| Nuxt UI | Popover | https://ui.nuxt.com/components/popover | Pending | - |
| PrimeReact | OverlayPanel | https://primereact.org/overlaypanel/ | Pending | Different naming |
| Radix UI Primitives | Popover | https://www.radix-ui.com/primitives/docs/components/popover | Pending | Headless |
| Radix UI Themes | Popover | https://www.radix-ui.com/themes/docs/components/popover | Pending | Also has Hover Card |
| ShadCN | Popover | https://ui.shadcn.com/docs/components/popover | Pending | Also has Hover Card |

### Hover Card Implementations (Subset)
| Framework | Component Name | URL | Status | Notes |
|-----------|----------------|-----|--------|-------|
| Chakra UI | Hover Card | https://chakra-ui.com/docs/components/hover-card | Pending | Separate from Popover |
| Mantine | Hover Card | https://mantine.dev/core/hover-card/ | Pending | Separate from Popover |
| Radix UI Primitives | Hover Card | https://www.radix-ui.com/primitives/docs/components/hover-card | Pending | Headless |
| Radix UI Themes | Hover Card | https://www.radix-ui.com/themes/docs/components/hover-card | Pending | Separate from Popover |
| ShadCN | Hover Card | https://ui.shadcn.com/docs/components/hover-card | Pending | Separate from Popover |

## Verification Results
[Update as URLs are verified]
- ✅ Working: 0
- ⚠️ Redirected: 0
- ❌ 404/Broken: 0
- ⏭️ Skipped: 0

## Research Notes
Key questions to investigate:
1. What distinguishes Popover from Hover Card in frameworks that have both?
2. Do Popovers support hover trigger or only click?
3. Are Hover Cards just Popovers with hover trigger, or do they have different features?
4. What about focus triggers (keyboard accessibility)?
5. How do these relate to Tooltip components?

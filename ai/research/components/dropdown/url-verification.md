# URL Verification for Dropdown Research
Date: 2025-11-04

## Component Definition

**Dropdown**: A versatile overlay component that displays a list of options, actions, or content when triggered. The term "dropdown" has multiple interpretations across frameworks:

1. **Dropdown Menu**: Navigation-focused component showing actions/links (similar to Menu)
2. **Dropdown Select**: Form control for selecting options (similar to Select)
3. **Unified Dropdown**: Multi-purpose component supporting both use cases (Semantic UI Classic pattern)

**Key Features**: Trigger interaction (click/hover), overlay positioning, keyboard navigation, search/filter, multi-select, custom content, form integration, accessibility (ARIA menus/listboxes).

**Semantic UI Classic Context**: Semantic UI's Dropdown is a unified component that can function as selection dropdown (form control), search selection, menu dropdown, and more. This research will focus on understanding how modern frameworks handle these patterns.

**Note**: This component overlaps with "Select" (dedicated form control) and "Menu" (navigation actions). Research will clarify the distinctions across frameworks.

## URLs to Research

### Frameworks with Dropdown Components

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Dropdown | https://ant.design/components/dropdown | ✅ Complete | Research completed 2025-11-04 - Menu-focused, split button |
| Chakra UI | Menu | https://chakra-ui.com/docs/components/menu | ✅ Complete | Research completed 2025-11-04 - v2 & v3 comparison |
| Headless UI | Menu | https://headlessui.com/react/menu | ✅ Complete | Research completed 2025-11-04 - Unstyled primitive, intelligent positioning |
| HeroUI | Dropdown | https://www.heroui.com/docs/components/dropdown | ✅ Complete | Research completed 2025-11-04 - Selection modes, rich composition |
| Mantine | Menu | https://mantine.dev/core/menu/ | ✅ Complete | Research completed 2025-11-04 - Compound pattern, hover trigger |
| MUI | Menu | https://mui.com/material-ui/react-menu/ | ✅ Complete | Research completed 2025-11-04 - Material Design, anchorEl pattern |
| Nuxt UI | DropdownMenu | https://ui.nuxt.com/components/dropdown-menu | ✅ Complete | Research completed 2025-11-04 - Items-based, checkbox support |
| PrimeReact | Menu | https://www.primefaces.org/primereact-v8/menu/ | ✅ Complete | Research completed 2025-11-04 - Model-driven, dual mode |
| Radix UI | DropdownMenu | https://www.radix-ui.com/primitives/docs/components/dropdown-menu | ✅ Complete | Research completed 2025-11-04 - Primitives, 16+ parts |
| Semantic UI Classic | Dropdown | https://semantic-ui.com/modules/dropdown.html | ✅ Complete | Research completed 2025-11-04 - Unified multi-purpose component |
| ShadCN | DropdownMenu | https://ui.shadcn.com/docs/components/dropdown-menu | ✅ Complete | Research completed 2025-11-04 - Copy-paste, Radix + Tailwind |

## Verification Results
- ✅ Working: 11 (all research complete)
- ⏳ Pending: 0
- ⚠️ Redirected: 0
- ❌ 404/Broken: 0
- ⏭️ Skipped: 0

## Research Notes
- **Naming Inconsistency**: Some frameworks call it "Dropdown", others "Menu", some "DropdownMenu"
- **Semantic UI Distinction**: Classic Dropdown is multi-purpose (menu + select + search), unlike modern frameworks that separate concerns
- **Modern Pattern**: Most frameworks separate "Dropdown/Menu" (actions) from "Select" (form control)
- Key research question: Should Semantic UI Next maintain the unified approach or adopt separate components?
- Related components to cross-reference: Select (form control), Menu (navigation), Combobox (searchable select)

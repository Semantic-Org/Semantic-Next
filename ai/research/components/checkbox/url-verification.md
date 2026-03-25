# URL Verification for Checkbox Research
Date: 2025-11-04

## Component Definition

**Checkbox**: A form control that allows users to select one or more values from a set of options, often representing a binary (on/off) choice. Can be used individually or in groups for multiple selections.

**Key Features**: Checked/unchecked states, indeterminate state (for "select all" scenarios), label association, form integration, keyboard navigation, grouping, disabled state, validation states, controlled/uncontrolled modes.

**Use Cases**: Multi-select forms, settings panels, feature toggles, terms acceptance, filtering interfaces, permission management, task lists.

## URLs to Research

### Dedicated Checkbox Components

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Checkbox | https://ant.design/components/checkbox | ✅ Complete | Research completed 2025-11-04 - Checkbox.Group, indeterminate |
| Chakra UI | Checkbox | https://chakra-ui.com/docs/components/checkbox | ✅ Complete | Research completed 2025-11-04 - v2 & v3 comparison, composable architecture |
| Headless UI | Checkbox | https://headlessui.com/react/checkbox | ✅ Complete | Research completed 2025-11-04 - Unstyled primitive, data attributes |
| HeroUI | Checkbox | https://www.heroui.com/docs/components/checkbox | ✅ Complete | Research completed 2025-11-04 - Slot-based styling, line-through |
| Mantine | Checkbox | https://mantine.dev/core/checkbox/ | ✅ Complete | Research completed 2025-11-04 - Styles API, Checkbox.Card |
| MUI | Checkbox | https://mui.com/material-ui/react-checkbox/ | ✅ Complete | Research completed 2025-11-04 - Material Design, FormControlLabel |
| Nuxt UI | Checkbox | https://ui.nuxt.com/components/checkbox | ✅ Complete | Research completed 2025-11-04 - Card variant, indeterminate |
| PrimeReact | Checkbox | https://www.primefaces.org/primereact-v8/checkbox/ | ✅ Complete | Research completed 2025-11-04 - Controlled only, extensive theming |
| Radix UI | Checkbox | https://www.radix-ui.com/primitives/docs/components/checkbox | ✅ Complete | Research completed 2025-11-04 - Primitives (unstyled), WAI-ARIA |
| Semantic UI Classic | Checkbox | https://semantic-ui.com/modules/checkbox.html | ✅ Complete | Research completed 2025-11-04 - Reference implementation, 4 types |
| ShadCN | Checkbox | https://ui.shadcn.com/docs/components/checkbox | ✅ Complete | Research completed 2025-11-04 - Copy-paste, Radix + Tailwind |

## Verification Results
- ✅ Working: 11 (all research complete)
- ⏳ Pending: 0
- ⚠️ Redirected: 0
- ❌ 404/Broken: 0
- ⏭️ Skipped: 0

## Research Notes
- Checkbox is a universal form control component
- All 11 major frameworks provide dedicated Checkbox implementations
- Common pattern: Supports both individual checkboxes and checkbox groups
- Key distinction from Switch: Checkbox for selection (multiple OK), Switch for state toggle (on/off)
- Radix UI provides both unstyled primitives AND styled themes version
- This is a foundational form component with strong accessibility requirements

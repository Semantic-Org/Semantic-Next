# URL Verification for Loader/Spinner Research
Date: 2025-11-04

## Component Definition

**Loader / Spinner**: An animated graphic that indicates a loading or processing state. Provides visual feedback to users that an operation is in progress.

**Key Features**: Animated spinning/rotating indicator, size variants, color theming, indeterminate (continuous) animation, optional overlay/inline modes, accessibility (aria-busy, role="status").

**Terminology Variations**:
- **Loader**: Semantic UI Classic, Mantine (2 frameworks)
- **Spinner**: Chakra UI, HeroUI, Radix UI (3+ frameworks)
- **Spin**: Ant Design (1 framework)
- **CircularProgress**: MUI (1 framework)
- **ProgressSpinner**: PrimeReact (1 framework)

## URLs to Research

### Dedicated Loader/Spinner Components

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Spin | https://ant.design/components/spin | ✅ Complete | Research completed 2025-11-04 - Fullscreen mode, progress integration |
| Chakra UI | Spinner | https://chakra-ui.com/docs/components/spinner | ✅ Complete | Research completed 2025-11-04 - v2 & v3 comparison |
| HeroUI | Spinner | https://www.heroui.com/docs/components/spinner | ✅ Complete | Research completed 2025-11-04 - 6 animation variants |
| Mantine | Loader | https://mantine.dev/core/loader/ | ✅ Complete | Research completed 2025-11-04 - 3 types (oval/bars/dots) |
| MUI | CircularProgress | https://mui.com/material-ui/react-progress/#circular | ✅ Complete | Research completed 2025-11-04 - Material Design 3 |
| PrimeReact | ProgressSpinner | https://www.primefaces.org/primereact-v8/progressspinner/ | ✅ Complete | Research completed 2025-11-04 - Lightweight SVG |
| Radix UI | Spinner | https://www.radix-ui.com/themes/docs/components/spinner | ✅ Complete | Research completed 2025-11-04 - Themes only |
| Semantic UI Classic | Loader | https://semantic-ui.com/elements/loader.html | ✅ Complete | Research completed 2025-11-04 - Reference implementation |
| ShadCN | Spinner | https://ui.shadcn.com/docs/components/spinner | ✅ Complete | Research completed 2025-11-04 - Minimalist copy-paste |

### Frameworks Without Dedicated Loaders

| Framework | Alternative | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Nuxt UI | (Uses Skeleton) | https://ui.nuxt.com/components/skeleton | ⏭️ Skipped | No dedicated loader - uses skeleton for loading states |

## Verification Results
- ✅ Working: 9 (all research complete)
- ⏳ Pending: 0
- ⚠️ Redirected: 0
- ❌ 404/Broken: 0
- ⏭️ Skipped: 0

## Research Notes
- Loader/Spinner is a universal loading indicator component
- Multiple naming conventions across frameworks (Loader, Spinner, Spin, Progress variants)
- Most frameworks separate Loader/Spinner (indeterminate) from Progress Bar (determinate)
- MUI combines both in Progress component with CircularProgress/LinearProgress variants
- Radix UI's Spinner is part of Themes (not Primitives) - visual component only
- This is a foundational feedback component present in nearly all UI libraries

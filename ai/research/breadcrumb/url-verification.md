# URL Verification for Breadcrumb Research
Date: 2025-11-04

## Component Definition

**Breadcrumb**: A navigation aid that shows the user's current location within a site's hierarchical structure. Provides a trail of links back to parent pages, enabling users to understand their position and navigate upward through the hierarchy.

**Key Features**: Hierarchical navigation path, clickable links to parent pages, separators (chevrons, slashes, etc.), current page indicator, responsive behavior, accessibility (aria-label="breadcrumb", aria-current), optional home icon.

**Use Cases**: Multi-level website navigation, e-commerce product categories, documentation sites, application dashboards, file browsers, settings panels.

**Terminology Note**: Most frameworks use "Breadcrumb" singular, though some (Hero

UI, Mantine, MUI) use the plural "Breadcrumbs".

## URLs to Research

### Frameworks with Breadcrumb Components

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Ant Design | Breadcrumb | https://ant.design/components/breadcrumb | ✅ Working | v5.x comprehensive docs, v5.3.0+ items API, React Router integration |
| Chakra UI | Breadcrumb | https://chakra-ui.com/docs/components/breadcrumb | ✅ Working | v3.28.1 with v2 docs available, compositional API |
| HeroUI | Breadcrumbs | https://www.heroui.com/docs/components/breadcrumbs | ✅ Working | Plural form, v2.8.0, comprehensive features |
| Mantine | Breadcrumbs | https://mantine.dev/core/breadcrumbs/ | ✅ Working | Plural form, v8.3.6, minimalist |
| MUI | Breadcrumbs | https://mui.com/material-ui/react-breadcrumbs/ | ✅ Working | Material Design v5+, plural form, comprehensive |
| Nuxt UI | Breadcrumb | https://ui.nuxt.com/components/breadcrumb | ✅ Working | v4.1.0, hybrid API, TypeScript-first |
| PrimeReact | BreadCrumb | https://www.primefaces.org/primereact-v8/breadcrumb/ | ✅ Working | v8, Array-driven, MenuModel API |
| Semantic UI Classic | Breadcrumb | https://semantic-ui.com/collections/breadcrumb.html | ✅ Working | jQuery-based reference implementation |
| ShadCN | Breadcrumb | https://ui.shadcn.com/docs/components/breadcrumb | ⚠️ Network restricted | Copy-paste distribution model, researched via web search |

## Verification Results
- ✅ Working: 8
- ⏳ Pending: 0
- ⚠️ Network restricted: 1
- ❌ 404/Broken: 0
- ⏭️ Skipped: 0

## Research Notes
- 9 frameworks with dedicated Breadcrumb components
- Terminology varies: "Breadcrumb" (6 frameworks) vs "Breadcrumbs" (3 frameworks)
- Headless UI and Radix UI do not provide dedicated Breadcrumb components
- This is a navigation component with strong accessibility requirements (ARIA landmark)
- Separators are a key visual element (commonly chevrons, slashes, dots)

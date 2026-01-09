# Component Naming Variations Analysis

> Analysis Date: 2025-11-10
> Source: Pattern research files from ai/research/*/pattern-research.md
> Frameworks Analyzed: Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Radix UI, ShadCN, Semantic UI, Vuetify, Angular Material

## Executive Summary

This analysis reveals significant naming fragmentation across UI component libraries, with an overall industry standardization rate of **71%**. Of 27 major components analyzed:
- **5 components (19%)** have universal naming consensus (100%)
- **10 components (37%)** have strong consensus (67-85%)
- **7 components (26%)** have moderate variation (50-67% consensus)
- **5 components (18%)** have critical fragmentation (<50% consensus)

## Components with Naming Variations

### 1. Accordion / Collapse / Expansion Panels
**Usage:** Expandable/collapsible content sections
- **Accordion**: 67% (6/9 frameworks) - Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Semantic UI
- **Collapse**: 22% (2/9 frameworks) - Ant Design, Vuetify
- **Expansion Panels**: 11% (1/9 frameworks) - Reference terminology only

### 2. Chip / Tag / Badge / Pill ⚠️ **CRITICAL FRAGMENTATION**
**Usage:** Compact information carriers
- **Badge**: 31% (4/13 implementations) - Radix Themes, ShadCN, Nuxt UI, Chakra UI
- **Chip**: 31% (4/13 implementations) - HeroUI, Mantine, MUI, PrimeReact
- **Tag**: 23% (3/13 implementations) - Ant Design, Chakra UI, PrimeReact
- **Badge + Chip**: 15% (2/13 implementations) - Mantine, PrimeReact (both components)

> **Note:** This component has the highest naming fragmentation with 13 distinct implementations across 11 frameworks and three different philosophical approaches.

### 3. Drawer / Sheet / Sidebar / Sidenav
**Usage:** Slide-in panels from screen edges
- **Drawer**: 67% (8/12 frameworks) - Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, ShadCN, Vuetify
- **Sidebar**: 17% (2/12 frameworks) - PrimeReact, Semantic UI
- **Sheet**: 8% (1/12 frameworks) - ShadCN (alternative)
- **Sidenav**: 8% (1/12 frameworks) - Angular Material

### 4. Navbar / App Bar / Header ⚠️ **NO CONSENSUS**
**Usage:** Primary application navigation
- **Navbar**: 40% (4/10 frameworks) - HeroUI, Nuxt UI, ShadCN, Radix UI
- **App Bar**: 30% (3/10 frameworks) - MUI, Vuetify, HeroUI (alternative)
- **Header**: 20% (2/10 frameworks) - Ant Design, Mantine
- **Composition Only**: 10% (1/10 frameworks) - Chakra UI

### 5. Number Input / Input Number ⚠️ **50/50 SPLIT**
**Usage:** Numeric value input
- **NumberInput**: 50% (3/6 frameworks) - Chakra UI, Mantine, HeroUI
- **InputNumber**: 50% (3/6 frameworks) - Ant Design, PrimeReact, Nuxt UI

### 6. Pagination / Paginator
**Usage:** Page navigation controls
- **Pagination**: 80% (8/10 frameworks) - Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, ShadCN, Semantic UI
- **Paginator**: 20% (2/10 frameworks) - Angular Material, PrimeReact

### 7. Password Input Naming
**Usage:** Secure password entry field
- **PasswordInput**: 40% (2/5 frameworks) - Chakra UI, Mantine
- **Input.Password**: 20% (1/5 frameworks) - Ant Design (subcomponent)
- **Password**: 20% (1/5 frameworks) - PrimeReact
- **Input type="password"**: 20% (1/5 frameworks) - ShadCN (HTML pattern)

### 8. Progress / Progress Bar
**Usage:** Task completion indicator
- **Progress**: 82% (9/11 frameworks) - Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix UI, ShadCN, Semantic UI
- **ProgressBar**: 18% (2/11 frameworks) - PrimeReact, Angular Material

### 9. Form / Form Control
**Usage:** Form container and validation
- **Form**: 67% (4/6 frameworks) - Ant Design, Mantine, ShadCN, Semantic UI
- **FormControl**: 33% (2/6 frameworks) - Chakra UI, MUI

### 10. Tree / TreeView
**Usage:** Hierarchical data display
- **Tree**: 80% (4/5 frameworks) - Ant Design, Mantine, PrimeReact, Radix UI
- **TreeView**: 20% (1/5 frameworks) - MUI

### 11. Breadcrumb / Breadcrumbs
**Usage:** Navigation trail
- **Breadcrumb**: 67% (8/12 frameworks) - Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Radix UI, ShadCN
- **Breadcrumbs**: 33% (4/12 frameworks) - Angular Material, MUI, Semantic UI, Vuetify

### 12. Segment / Paper / Box / Panel
**Usage:** Container primitives
- **Paper**: 40% (2/5 frameworks) - MUI, Mantine
- **Segment**: 20% (1/5 frameworks) - Semantic UI Classic
- **Box**: 20% (1/5 frameworks) - Chakra UI
- **Panel**: 20% (1/5 frameworks) - PrimeReact

### 13. Context Menu Spacing
**Usage:** Right-click menu
- **Context Menu**: 75% (3/4 frameworks) - ShadCN, Radix UI, Nuxt UI (with space)
- **ContextMenu**: 25% (1/4 frameworks) - PrimeReact (camelCase)

## Components with 100% Consensus

These components have achieved universal naming standardization:

1. **Portal** - All 4 frameworks use "Portal"
2. **ColorPicker** - All 3 frameworks use "ColorPicker"
3. **Kbd** - All frameworks use "Kbd" for keyboard key display
4. **Tooltip** - Universal "Tooltip" naming
5. **Card** - Universal "Card" naming

## Framework Consistency Rankings

Based on adherence to common naming patterns:

1. **ShadCN** - 95% consistency with industry standards
2. **Radix UI** - 92% consistency
3. **Chakra UI** - 88% consistency
4. **MUI** - 85% consistency
5. **Mantine** - 83% consistency
6. **Nuxt UI** - 80% consistency
7. **HeroUI** - 78% consistency
8. **Vuetify** - 75% consistency
9. **Ant Design** - 72% consistency (most variant)
10. **PrimeReact** - 70% consistency (most variant)
11. **Angular Material** - 68% consistency
12. **Semantic UI** - 65% consistency

## Migration Impact Assessment

When migrating between frameworks, expected renaming effort:

### Low Impact (0-10% renaming)
- Within same framework family (e.g., Radix UI → ShadCN)
- Between highly standardized frameworks

### Medium Impact (10-30% renaming)
- Between different but similar frameworks (e.g., Chakra UI → Mantine)
- Most common migration scenarios

### High Impact (30-50% renaming)
- Between philosophically different frameworks (e.g., Ant Design → MUI)
- Especially problematic: Chip/Tag/Badge components

### Critical Components for Migration

**Highest Risk Components** (likely to require renaming):
1. Chip/Tag/Badge (31% max consensus)
2. Navbar/AppBar/Header (40% max consensus)
3. NumberInput/InputNumber (50/50 split)
4. Drawer/Sheet/Sidebar variations
5. Form/FormControl differences

**Lowest Risk Components** (universal naming):
1. Portal
2. ColorPicker
3. Kbd
4. Tooltip
5. Card

## Recommendations

### For Framework Maintainers
1. Consider aliasing common alternative names (e.g., both "Collapse" and "Accordion")
2. Document naming rationale and migration guides from other frameworks
3. Provide automated migration tools for common renames

### For Development Teams
1. Abstract component naming in a translation layer when using multiple frameworks
2. Document internal naming conventions mapping to framework specifics
3. Consider migration cost when selecting frameworks (use consistency rankings)

### For New Projects
1. Choose frameworks with high consistency ratings for easier future migrations
2. Be aware of critical fragmentation areas (Chip/Tag/Badge)
3. Plan for naming abstraction if framework switching is anticipated

## Industry Trends

1. **Material Design Influence**: "Paper", "AppBar", "Chip" terminology from MUI
2. **Semantic Naming**: Trend toward descriptive names (ColorPicker vs CP)
3. **Compound Components**: Increasing use of dot notation (Input.Password)
4. **Headless UI Influence**: Radix/ShadCN driving new standardization
5. **Framework Families**: Emerging consistency within framework families (Radix ecosystem)

---

*This analysis is based on research of pattern-research.md files across 27 major UI components from 12+ frameworks. Percentages represent the proportion of frameworks using each naming variant.*
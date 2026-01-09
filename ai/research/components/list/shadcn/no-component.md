# ShadCN UI - List Component Research

## Component Status

**ShadCN does NOT have a dedicated List component.**

## Alternative Solutions

ShadCN provides the following primitives that can be used to create list-like layouts:

### 1. **Item Component** (Primary Alternative)
The closest equivalent to a List component in ShadCN is the **Item component**, which is a flex container designed specifically for displaying list-like content.

- **Location**: https://ui.shadcn.com/docs/components/item
- **Sub-components**:
  - `ItemGroup` - Container for grouping items together
  - `ItemContent` - Main content area
  - `ItemTitle` - Item title
  - `ItemDescription` - Descriptive text
  - `ItemMedia` - Images or icons
  - `ItemActions` - Action elements (buttons, icons)

### 2. **Other List-Related Components**
- **Navigation Menu** - For navigation lists
- **Select** - For dropdown selection lists
- **Command** - For command palette / searchable lists

## Why No Dedicated List Component?

ShadCN follows a philosophy of providing flexible primitives rather than opinionated, complete components. This allows developers to:
1. Build custom list implementations tailored to specific needs
2. Combine primitives for maximum flexibility
3. Reduce bundle size by only using necessary features

The Item component pattern is the recommended approach for building list layouts in ShadCN.

## Research Date

November 2025

## Notes

ShadCN's approach emphasizes composition over pre-built components, making it a headless/primitive-first UI library. The Item component provides the building blocks needed to construct various list patterns.

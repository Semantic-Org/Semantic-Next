# URL Verification for Segment Research
Date: 2025-11-04
Total URLs found: 5

## Component Definition

**Segment**: A basic visual container/block for grouping content. Used for visual segmentation - NOT a structured card component.

**Key Distinction**:
- Segment = Basic container primitive (Paper/Box/Panel)
- Card = Structured component with header/media/actions (separate component #6)

## URLs to Research

| Framework | Component | URL | Status | Notes |
|-----------|-----------|-----|--------|-------|
| Semantic UI Classic | Segment | https://semantic-ui.com/elements/segment.html | ✅ Working | Reference implementation - 43+ patterns |
| MUI | Paper | https://mui.com/material-ui/react-paper/ | ✅ Working | Material Design elevation 0-24 |
| Chakra UI | Box | https://chakra-ui.com/docs/components/box | ✅ Working | Most abstract container primitive, v3.28.1 |
| Mantine | Paper | https://mantine.dev/core/paper/ | ✅ Working | Primitive foundation, 5-tier system |
| PrimeReact | Panel | https://primereact.org/panel/ | ✅ Working | Unique collapsible feature |

## Verification Results
- ✅ Working: 5
- ⚠️ Redirected: 0
- ❌ 404/Broken: 0
- ⏭️ Skipped (Card components): 6

## Excluded Components (Cards, not Segments)
These were in the exhaustive list but are Card components, not Segment equivalents:
- Ant Design Card
- Mantine Card
- Nuxt UI Card
- PrimeReact Card
- ShadCN Card
- Radix UI Card

## Research Notes
- Most modern frameworks don't distinguish between "segment" and "card"
- Many frameworks jumped straight to Card without a simpler container primitive
- Researching 5 frameworks with actual segment/paper/box/panel primitives
- Card component research will happen separately as component #6

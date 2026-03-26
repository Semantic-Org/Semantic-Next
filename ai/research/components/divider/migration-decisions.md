# Divider Migration Decisions

## Features Included

### Content (Auto-Horizontal)
- **Text**: `text` attribute for centered text
- **Icon**: `icon` attribute for centered icon
- **Decision**: Content presence triggers horizontal layout automatically
- **usageLevel**: 1 (text), 2 (icon)

### Types

#### Vertical
- **Kept**: Yes, easier with modern shadow DOM
- **usageLevel**: 3

#### Styled (NEW)
- **Added**: Based on actual designer usage
- **Options**: solid, fade, soft, double
- **usageLevel**: 2

### Variations

#### Spacing (Replaces fitted/section)
- **Unified**: Combined fitted/section into single scale
- **Options**: mini through massive (standard scale)
- **usageLevel**: 1

#### Hidden
- **Kept**: Yes, semantic spacing value
- **usageLevel**: 4

#### Clearing
- **Kept**: Yes, still used for float layouts (newspaper style)
- **usageLevel**: 5

## Features Removed

### Inverted
- **Reason**: Theme tokens handle this automatically
- **Migration**: Just remove, works automatically

### Fitted
- **Reason**: Replaced by `spacing="mini"`
- **Migration**: `fitted` → `spacing="mini"`

### Section
- **Reason**: Replaced by `spacing="huge"`
- **Migration**: `section` → `spacing="huge"`

## Modernization Improvements

1. **Content-driven layout**: No explicit horizontal type needed
2. **Unified spacing scale**: Consistent with other components
3. **Modern styled options**: Based on real designer usage
4. **Slot support**: Better than text nodes (future)
5. **Theme-aware**: Automatic light/dark adaptation

## Implementation Priority

1. Level 1: text content, spacing variation
2. Level 2: icon content, styled types
3. Level 3: vertical type
4. Level 4: hidden variation
5. Level 5: clearing variation
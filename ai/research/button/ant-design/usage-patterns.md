# Ant Design - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://ant.design/components/button
Status: ✅ Working
Version: 5.21.0+ (Current)
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, code examples, and design guidance.

## Component Definition
- **Core purpose**: Provides clickable elements that trigger actions or navigation across five semantic types (primary, default, dashed, text, link) with extensive state and style variations.
- **Mental model**: A semantic action trigger with progressive enhancement - starts with basic button types and layered with modifiers (danger, ghost, loading, disabled, block) to create contextually appropriate actions.
- **Semantic meaning**: Communicates action priority (primary vs default), destructiveness (danger), loading state, and availability (disabled) through visual hierarchy and color.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `type="primary"`, `danger`, `loading`, `size="large"`)
- **Composed**: Via composition/children (e.g., `<Button>{content}</Button>`, `<Button icon={<Icon />}>Text</Button>`)
- **CSS-only**: Requires custom styling (e.g., custom colors beyond presets)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop accepts any ReactNode. Auto-space insertion between Chinese characters via `autoInsertSpace` (default: true, v5.17.0+) |
| Icon support | ✅ | Native | `icon` prop accepts ReactNode. Position controlled via `iconPosition: 'start' \| 'end'` (default: 'start', v5.17.0+) |
| Icon + Text | ✅ | Native + Composed | Icon via `icon` prop + text via children. Icon position configurable. Example: `<Button icon={<SearchOutlined />}>Search</Button>` |
| Loading indicator | ✅ | Native | `loading` prop accepts boolean or `{delay: number, icon: ReactNode}` (icon support v5.23.0+). Automatically disables button and shows spinner |
| Custom content | ✅ | Composed | Children prop accepts any ReactNode for flexible content composition |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Primary | ✅ | Native | `type="primary"` - Main action button (max one per section). Syntactic sugar for `color="primary" variant="solid"` |
| Secondary | ✅ | Native | `type="default"` (default value) - Series of actions without priority. Maps to default color/variant |
| Default | ✅ | Native | `type="default"` - Same as secondary, the base button type |
| Link/Text | ✅ | Native | `type="link"` for external links, `type="text"` for most secondary actions. Both are distinct types |
| Dashed | ✅ | Native | `type="dashed"` - Commonly used for "add more" actions. Syntactic sugar for `variant="dashed"` |
| Ghost | ✅ | Native | `ghost={true}` - Transparent background for complex backgrounds/home pages. Works with any type |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled={true}` - Prevents interaction when actions unavailable |
| Loading | ✅ | Native | `loading={true}` or `loading={{delay: 300, icon: <CustomIcon />}}`. Auto-disables, prevents multiple submits. Delay in ms (v5.23.0+) |
| Active | ✅ | CSS-only | Active state handled by browser/CSS, not exposed as prop |
| Hover | ✅ | CSS-only | Hover effects automatic based on type/variant/color combination |
| Focus | ✅ | CSS-only | Focus states handled automatically. Wave effect configurable via ConfigProvider |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="large" \| "middle" \| "small"` (default: "middle") |
| Shape options | ✅ | Native | `shape="default" \| "circle" \| "round"` (default: "default") |
| Block/Full width | ✅ | Native | `block={true}` - Fits button width to parent container |
| Color variants | ✅ | Native | `color="default" \| "primary" \| "danger" \| PresetColors` where PresetColors = 'blue', 'purple', 'cyan', 'green', 'magenta', 'pink', 'red', 'orange', 'yellow', 'volcano', 'geekblue', 'lime', 'gold' (v5.21.0+) |
| Danger/Destructive | ✅ | Native | `danger={true}` - Risk action indicator for deletion/authorization. Works with all types |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | `onClick={(event) => void}` - Standard React event handler |
| Button group | ✅ | Deprecated | Button.Group component exists but marked deprecated in examples |
| Dropdown button | ❌ | N/A | Not part of Button component (separate Dropdown component in Ant Design) |
| As link (href) | ✅ | Native | `href={string}` renders anchor tag. `target={string}` for link target attribute |
| Form submission | ✅ | Native | `htmlType="submit" \| "reset" \| "button"` (default: "button") - Native HTML button types |

## Code Examples

### Basic Type Usage (Syntactic Sugar)
```jsx
// Traditional type-based API
<Button type="primary">Primary Button</Button>
<Button type="default">Default Button</Button>
<Button type="dashed">Dashed Button</Button>
<Button type="text">Text Button</Button>
<Button type="link">Link Button</Button>
```

### Color & Variant API (v5.21.0+)
```jsx
// Type is syntactic sugar for color + variant
<Button type="primary">click</Button>
// Equivalent to:
<Button color="primary" variant="solid">click</Button>

// Variant options: outlined, dashed, solid, filled, text, link
<Button variant="outlined">Outlined</Button>
<Button variant="filled">Filled</Button>

// PresetColors for custom color schemes
<Button color="blue">Blue Button</Button>
<Button color="volcano">Volcano Button</Button>
```

### Icon Integration
```jsx
// Icon only
<Button icon={<SearchOutlined />} />

// Icon + Text
<Button icon={<SearchOutlined />}>Search</Button>

// Icon position control (v5.17.0+)
<Button icon={<DownloadOutlined />} iconPosition="end">
  Download
</Button>
```

### Loading States
```jsx
// Simple loading
<Button loading>Loading...</Button>

// Loading with delay (v5.23.0+)
<Button loading={{ delay: 300 }}>
  Submit
</Button>

// Custom loading icon (v5.23.0+)
<Button loading={{ icon: <CustomSpinner /> }}>
  Processing
</Button>
```

### Size & Shape Variations
```jsx
// Sizes
<Button size="large">Large</Button>
<Button size="middle">Middle (default)</Button>
<Button size="small">Small</Button>

// Shapes
<Button shape="default">Default</Button>
<Button shape="round">Round</Button>
<Button shape="circle" icon={<SearchOutlined />} />
```

### State Modifiers
```jsx
// Danger actions
<Button type="primary" danger>Delete</Button>

// Ghost mode (transparent background)
<Button type="primary" ghost>Ghost Primary</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Block (full width)
<Button block>Block Button</Button>
```

### Link Button
```jsx
// Renders as anchor tag
<Button href="https://example.com" target="_blank">
  External Link
</Button>
```

### Form Integration
```jsx
// Form submission
<Button htmlType="submit">Submit Form</Button>
<Button htmlType="reset">Reset Form</Button>
```

### Semantic DOM Customization (v5.4.0+)
```jsx
// Custom classes for semantic parts
<Button classNames={{ icon: 'custom-icon-class' }}>
  Button
</Button>

// Custom styles for semantic parts
<Button styles={{ icon: { color: 'red' } }}>
  Button
</Button>
```

### Disabling Wave Effect
```jsx
<ConfigProvider wave={{ disabled: true }}>
  <Button>No Wave Effect</Button>
</ConfigProvider>
```

## Notable Features

### Type as Syntactic Sugar
- The `type` prop is **syntactic sugar** for `color` + `variant` combinations (v5.21.0+)
- Provides mapping between traditional types and new color/variant system
- Example: `type="primary"` = `color="primary" variant="solid"`
- Enables backward compatibility while supporting new flexibility

### Auto-Space Insertion (v5.17.0+)
- `autoInsertSpace` automatically adds space between Chinese characters (default: true)
- Improves typography for mixed language content
- Can be disabled per-button if needed

### Advanced Loading Configuration (v5.23.0+)
- Loading state supports delay before showing spinner
- Custom loading icons via `loading.icon`
- Prevents multiple form submissions automatically

### Color System Evolution
- PresetColors provide 13 themed color options
- Can combine with any variant (outlined, dashed, solid, filled, text, link)
- Generates extensive button variations from simple API

### Icon Positioning (v5.17.0+)
- Icons can be placed at start or end
- Controlled via `iconPosition` prop
- Useful for directional actions (back/forward)

### Semantic DOM Structure (v5.4.0+)
- `classNames` prop for targeting semantic DOM parts
- `styles` prop for inline semantic styles
- Enables precise styling without CSS specificity battles

### Ghost Pattern
- Makes button background transparent
- Maintains type-specific borders and text colors
- Recommended for complex backgrounds and hero sections

### Danger Modifier
- Orthogonal to type - works with all button types
- Creates danger variants: danger primary, danger default, etc.
- Consistent risk signaling across button hierarchy

### Block Layout
- Full-width buttons via single prop
- Common in mobile layouts and forms
- No custom CSS required

### HTML Button Types
- `htmlType` prop maps to native `type` attribute
- Enables proper form integration (submit/reset)
- Separated from visual `type` for clarity

## Research Notes

### Access & Documentation
- Documentation successfully accessed at https://ant.design/components/button
- GitHub source documentation also available at https://github.com/ant-design/ant-design/blob/master/components/button/index.en-US.md
- Comprehensive API table with version annotations
- Clear versioning indicates feature introduction points (helpful for compatibility)

### Framework Approach Observations

**API Evolution Strategy:**
- Demonstrates thoughtful API evolution from `type`-based to `color`/`variant`-based system
- Maintains backward compatibility via "syntactic sugar" concept
- Version annotations (5.17.0, 5.21.0, 5.23.0) show active development

**Orthogonal Properties:**
- Danger, ghost, disabled, loading, block are orthogonal modifiers
- Can combine with any type/color/variant for exponential variations
- Avoids API explosion by composing properties

**Semantic Customization:**
- `classNames` and `styles` props (v5.4.0+) allow targeting internal DOM structure
- Maintains encapsulation while enabling customization
- Advanced pattern for design system integration

**Progressive Enhancement:**
- Basic types (primary, default, dashed, text, link) for common needs
- Advanced color system for theme customization
- Preset colors provide middle ground between basic and fully custom

**Icon Integration:**
- Icon as first-class citizen via dedicated prop
- Position control via separate prop (clean API)
- Supports icon-only buttons via shape combinations

**Loading Patterns:**
- Simple boolean for basic use
- Object config for advanced control (delay, custom icon)
- Progressive API complexity based on needs

**Design Guidance:**
- Documentation includes usage recommendations ("max one primary per section")
- Semantic naming reflects intended use (e.g., "dashed for adding actions")
- Clear hierarchy: primary > default > text/link

**Potential Challenges:**
- Button.Group deprecated suggests rethinking group patterns
- Type vs color/variant duality may confuse newcomers (though well-documented)
- Large API surface (30+ props) requires good documentation (which they provide)

**Strengths:**
- Extremely comprehensive feature set
- Clear version annotations for new features
- Thoughtful API design balancing simplicity and power
- Strong backward compatibility story
- Excellent documentation quality with design rationale

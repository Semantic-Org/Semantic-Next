# Component Pattern Research: Icon

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 6
- Date: 2025-11-05
- Unique patterns identified: 55+
- Research coverage: Ant Design, Chakra UI, MUI, Nuxt UI, Semantic UI Classic, Mantine

## Component Definition Consensus

Icon components solve the fundamental problem of **displaying scalable, accessible visual symbols** in user interfaces. They provide:

- **Visual communication** through standardized symbols and glyphs
- **Consistent sizing** across the application
- **Theming integration** with color systems
- **Accessibility** through proper ARIA attributes and semantic HTML
- **Icon library integration** for thousands of pre-built icons
- **Custom icon support** for brand-specific or custom SVG icons

**Mental Models:**
- **Icon-as-Component** (Ant Design, MUI, Nuxt UI, Mantine): React/Vue components wrapping SVG icons
- **Icon-as-Element** (Semantic UI): HTML `<i>` element with CSS classes
- **Icon-as-Wrapper** (Chakra UI): Box-based wrapper extending SVG with theme capabilities
- **Library-Specific** vs **Library-Agnostic**: Some frameworks bundle icons, others require separate libraries

**Universal Characteristics:**
- SVG-based rendering (except Semantic UI which uses CSS with Feather icons)
- Scalable without quality loss
- Color inheritance from parent or explicit theming
- Size control through props or CSS
- Support for custom icons
- Accessibility attributes (aria-label, role, etc.)

## Terminology Variations

### Component Names
- **Icon**: Ant Design, MUI, Chakra UI, Mantine (generic wrapper)
- **UIcon**: Nuxt UI (prefixed for Nuxt UI components)
- **`<i class="icon">`**: Semantic UI Classic (HTML element with CSS)
- **SvgIcon**: MUI (for custom SVG icons)
- **IconButton**: MUI, Chakra UI (interactive icon wrapper)

### Icon Libraries
- **@ant-design/icons**: Ant Design (1000+ icons, 3 themes)
- **@mui/icons-material**: MUI (1000+ Material Design icons, 5 variants)
- **react-icons**: Chakra UI (multiple icon sets)
- **Iconify**: Nuxt UI (150,000+ icons from 150+ collections)
- **@tabler/icons-react**: Mantine (4,500+ Tabler icons)
- **Feather Icons**: Semantic UI Classic (280+ icons built-in)

### Sizing Terms
- **fontSize** (Ant Design): Uses CSS font-size
- **boxSize** (Chakra UI): Sets both width and height
- **fontSize** (MUI): String sizes (small/medium/large/inherit)
- **size** (Nuxt UI): Tailwind classes (size-4, size-5, etc.)
- **size classes** (Semantic UI): mini/tiny/small/large/big/huge/massive
- **size prop** (Mantine): Numeric pixels or string tokens

## Pattern Inventory

### Icon Source Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Bundled icon library | Framework provides icon library | 4/6 (67%) | Level 1 | Ant, MUI, Semantic, (Mantine recommends Tabler) |
| External library required | Must install separate icon package | 3/6 (50%) | Level 1 | Chakra, Nuxt, Mantine |
| String identifiers | Icon names as strings | 2/6 (33%) | Level 2 | Nuxt (Iconify), Semantic (class names) |
| Component imports | Import icon as React/Vue component | 5/6 (83%) | Level 1 | Ant, MUI, Chakra, Nuxt, Mantine |
| Custom SVG support | Use custom SVG icons | 6/6 (100%) | Level 1 | All |
| Icon font support | Font-based icons (deprecated) | 1/6 (17%) | Level 4 | MUI (legacy) |

### Rendering Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| SVG rendering | Render as inline SVG | 6/6 (100%) | Level 1 | All |
| CSS-based rendering | Use CSS masks/backgrounds | 2/6 (33%) | Level 2 | Semantic (Feather), Nuxt (mode="css") |
| Component wrapper | Wrap SVG in component | 5/6 (83%) | Level 1 | All except Semantic |
| Direct SVG element | Raw `<svg>` with CSS classes | 1/6 (17%) | Level 3 | Semantic |
| currentColor inheritance | Inherit color from parent | 6/6 (100%) | Level 1 | All |

### Size Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Fixed size tokens | Predefined size options | 6/6 (100%) | Level 1 | All |
| Custom numeric sizes | Pixel or rem values | 5/6 (83%) | Level 1 | All except Semantic |
| Font-size based | Use CSS font-size | 3/6 (50%) | Level 1 | Ant, MUI, Chakra |
| Explicit width/height | Separate width and height props | 3/6 (50%) | Level 2 | Chakra, Mantine, Nuxt |
| Responsive sizing | Size per breakpoint | 3/6 (50%) | Level 2 | Chakra, Nuxt (Tailwind), custom |
| Size inheritance | inherit size from parent | 3/6 (50%) | Level 2 | MUI, Ant, Chakra |
| Small/Medium/Large | Semantic size names | 4/6 (67%) | Level 1 | MUI, Semantic, Mantine (tokens), Ant |
| Mini to Massive scale | 8-point scale | 1/6 (17%) | Level 4 | Semantic |

### Color & Theming Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Theme color tokens | Use design system colors | 5/6 (83%) | Level 1 | All except Semantic |
| Semantic colors | Named colors (primary, error, etc.) | 5/6 (83%) | Level 1 | Ant, MUI, Chakra, Semantic, Mantine |
| Custom CSS colors | Hex, RGB, named colors | 6/6 (100%) | Level 1 | All |
| Color inheritance | currentColor from parent | 6/6 (100%) | Level 1 | All |
| Dark mode support | Automatic dark mode colors | 4/6 (67%) | Level 1 | MUI, Chakra, Nuxt, Mantine |
| Two-tone icons | Dual color icons | 1/6 (17%) | Level 3 | Ant Design |
| Color prop | Explicit color prop | 5/6 (83%) | Level 1 | Ant, MUI, Chakra, Mantine, Nuxt |
| CSS class colors | Color via className | 3/6 (50%) | Level 2 | Semantic, Nuxt (Tailwind), custom |
| Gradient fills | SVG gradient support | 2/6 (33%) | Level 3 | Chakra, custom SVGs |

### Icon Variants & Styles

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Outlined style | Stroke-based icons | 5/6 (83%) | Level 1 | Ant, MUI, Semantic (Feather), Tabler, Material |
| Filled style | Solid fill icons | 4/6 (67%) | Level 1 | Ant, MUI, Material, Heroicons |
| Two-tone style | Two color icons | 1/6 (17%) | Level 3 | Ant Design |
| Rounded style | Rounded corners | 1/6 (17%) | Level 3 | MUI (Material Rounded) |
| Sharp style | Sharp corners | 1/6 (17%) | Level 3 | MUI (Material Sharp) |
| Multiple icon sets | Choose from multiple libraries | 3/6 (50%) | Level 1 | Chakra (react-icons), Nuxt (Iconify), Mantine |
| Stroke width control | Customize stroke thickness | 2/6 (33%) | Level 2 | Mantine (Tabler), custom SVGs |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| aria-label support | Accessible label | 6/6 (100%) | Level 1 | All |
| aria-hidden | Hide decorative icons | 5/6 (83%) | Level 1 | All except Semantic |
| role attribute | Semantic role | 5/6 (83%) | Level 1 | All except Semantic |
| Semantic HTML | Proper element choice | 6/6 (100%) | Level 1 | All |
| Focusable control | Make icon keyboard accessible | 3/6 (50%) | Level 2 | Chakra, MUI (IconButton), custom |
| Title element | SVG title for tooltips | 2/6 (33%) | Level 3 | Custom SVGs, Semantic |
| Screen reader text | Visually hidden text | 4/6 (67%) | Level 2 | Common pattern, not built-in |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Click handlers | onClick events | 6/6 (100%) | Level 1 | All |
| Icon buttons | Button wrapper for icons | 5/6 (83%) | Level 1 | All except Semantic (use link) |
| Hover effects | Visual feedback on hover | 6/6 (100%) | Level 1 | All |
| Toggle states | Active/inactive icons | 4/6 (67%) | Level 2 | Common pattern across frameworks |
| Loading spinners | Rotating animation | 5/6 (83%) | Level 1 | Ant, MUI, Chakra, Semantic, Mantine |
| Disabled state | Reduced opacity/interaction | 4/6 (67%) | Level 2 | MUI, Semantic, Chakra, Mantine |
| Ripple effect | Material ripple | 1/6 (17%) | Level 3 | MUI (with IconButton) |
| Link icons | Icon as clickable link | 3/6 (50%) | Level 2 | Semantic (native), others via wrapper |

### Animation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Spin animation | Continuous rotation | 5/6 (83%) | Level 1 | Ant, MUI, Chakra, Semantic, Mantine |
| Rotation transform | Static rotation (90°, 180°, etc.) | 4/6 (67%) | Level 2 | Ant, Chakra, Nuxt, custom |
| Transitions | Smooth property changes | 5/6 (83%) | Level 1 | Common pattern, CSS-based |
| Keyframe animations | Custom animations | 3/6 (50%) | Level 3 | Chakra, custom CSS |
| Pulse/heartbeat | Scale animation | 2/6 (33%) | Level 3 | Custom implementations |
| Flip animation | Horizontal/vertical flip | 2/6 (33%) | Level 3 | Custom CSS transforms |

### Layout & Positioning Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Icon + text combinations | Icon alongside text | 6/6 (100%) | Level 1 | All |
| Icon in buttons | Button with icon | 6/6 (100%) | Level 1 | All |
| Icon in inputs | Form field icons | 5/6 (83%) | Level 1 | All except Semantic (custom) |
| Icon before text | Left position | 6/6 (100%) | Level 1 | All |
| Icon after text | Right position | 5/6 (83%) | Level 1 | Common pattern |
| Icon only | No accompanying text | 6/6 (100%) | Level 1 | All |
| Fitted/no margins | Remove default spacing | 2/6 (33%) | Level 2 | Semantic, custom |
| Icon groups | Multiple icons together | 2/6 (33%) | Level 3 | Semantic, custom |
| Stacked icons | Icons layered on top | 1/6 (17%) | Level 4 | Semantic |

### Integration Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Button integration | Icons in buttons | 6/6 (100%) | Level 1 | All |
| Input/form integration | Icons in form fields | 5/6 (83%) | Level 1 | All except Semantic (custom) |
| Navigation menu icons | Icons in nav items | 6/6 (100%) | Level 1 | All |
| Badge overlays | Badge on icon | 3/6 (50%) | Level 2 | MUI, Ant, custom |
| Tooltip integration | Tooltip on icon hover | 5/6 (83%) | Level 1 | Common pattern, not built-in |
| Dropdown triggers | Icon opens dropdown | 5/6 (83%) | Level 1 | Common pattern |
| Status indicators | Icon shows status | 6/6 (100%) | Level 1 | All |
| Breadcrumb icons | Icons in breadcrumbs | 5/6 (83%) | Level 2 | Common pattern |

### Custom Icon Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Inline SVG | Direct SVG in code | 6/6 (100%) | Level 1 | All |
| SVG imports | Import SVG as component | 5/6 (83%) | Level 1 | React/Vue frameworks |
| createIcon utility | Factory for custom icons | 2/6 (33%) | Level 2 | MUI (createSvgIcon), custom |
| Icon wrapper component | Reusable custom icon wrapper | 5/6 (83%) | Level 2 | All except Semantic |
| SVG sprite sheets | External SVG sprites | 1/6 (17%) | Level 4 | Nuxt (optional) |
| CSS mask-image | CSS-based custom icons | 1/6 (17%) | Level 4 | Semantic UI |
| Component render function | h() or JSX factory | 2/6 (33%) | Level 3 | Nuxt (Vue h()), React |

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Icon search/picker | Searchable icon gallery | 0/6 (0%) | Level 5 | Not built-in (custom) |
| Dynamic icon selection | Render icon from string | 3/6 (50%) | Level 2 | Nuxt (Iconify), MUI, Semantic |
| Icon collections | Categorized icon sets | 3/6 (50%) | Level 2 | Nuxt (Iconify), react-icons, Tabler |
| Tree-shaking | Bundle only used icons | 5/6 (83%) | Level 1 | All except Semantic |
| SSR support | Server-side rendering | 5/6 (83%) | Level 1 | Modern frameworks |
| TypeScript support | Type definitions | 5/6 (83%) | Level 1 | All except Semantic |
| Icon composition | Build complex icons | 2/6 (33%) | Level 3 | Semantic (groups), custom |
| Icon morphing | Animated transitions between icons | 0/6 (0%) | Level 5 | Custom implementations |
| Multi-color icons | Icons with 3+ colors | 2/6 (33%) | Level 3 | Ant (two-tone), custom SVGs |

## Notable Patterns

### Universal Patterns (100%)
- SVG rendering
- currentColor inheritance
- Fixed size tokens
- Custom CSS colors
- aria-label support
- Semantic HTML
- Click handlers
- Icon + text combinations
- Button integration
- Navigation menu icons
- Custom inline SVG support
- Icon-only display
- Status indicators

### Highly Adopted (80%+)
- Component imports (83%)
- Color prop (83%)
- Theme color tokens (83%)
- Semantic colors (83%)
- Custom numeric sizes (83%)
- Outlined style (83%)
- aria-hidden (83%)
- role attribute (83%)
- Icon buttons (83%)
- Loading spinners (83%)
- Icon in inputs (83%)
- Spin animation (83%)
- Transitions (83%)
- SVG imports (83%)
- Icon wrapper component (83%)
- Tree-shaking (83%)
- SSR support (83%)
- TypeScript support (83%)
- Tooltip integration (83%)
- Dropdown triggers (83%)

### Emerging Patterns (60-79%)
- Bundled icon library (67%)
- Small/Medium/Large sizes (67%)
- Dark mode support (67%)
- Filled style (67%)
- Screen reader text (67%)
- Toggle states (67%)
- Rotation transform (67%)
- Accessibility focus (67%)

### Specialized Patterns (40-59%)
- External library required (50%)
- Font-size based sizing (50%)
- Explicit width/height (50%)
- Responsive sizing (50%)
- Size inheritance (50%)
- CSS class colors (50%)
- Multiple icon sets (50%)
- Focusable control (50%)
- Toggle states (50%)
- Badge overlays (50%)
- Dynamic icon selection (50%)
- Icon collections (50%)
- Keyframe animations (50%)

## Implementation Notes

### Icon Library Approaches

**Bundled Libraries (Ant Design, MUI, Semantic UI)**:
```jsx
// Ant Design - Import from @ant-design/icons
import { HomeOutlined, HomeFilled, HomeTwoTone } from '@ant-design/icons';
<HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />

// MUI - Import from @mui/icons-material
import HomeIcon from '@mui/icons-material/Home';
<HomeIcon fontSize="large" color="primary" />

// Semantic UI - CSS classes
<i class="ui home icon"></i>
```

**External Libraries (Chakra UI, Nuxt UI, Mantine)**:
```jsx
// Chakra UI - react-icons
import { Icon } from '@chakra-ui/react';
import { FiHome } from 'react-icons/fi';
<Icon as={FiHome} boxSize="6" color="blue.500" />

// Nuxt UI - Iconify
<UIcon name="i-heroicons-home" class="size-6" />

// Mantine - Tabler Icons
import { Icon } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
<Icon size={24}><IconHome /></Icon>
```

### Sizing Strategies

**Font-Size Based**:
```jsx
// Ant Design, Chakra UI
<Icon style={{ fontSize: '24px' }} />
<Icon fontSize="2xl" /> // Chakra
```

**Explicit Size Props**:
```jsx
// MUI
<Icon fontSize="small" />  // 20px
<Icon fontSize="medium" /> // 24px
<Icon fontSize="large" />  // 35px

// Chakra UI
<Icon boxSize="6" />  // 1.5rem (24px)

// Mantine
<Icon size={24} />    // 24px
<Icon size="lg" />    // Token size
```

**CSS Classes**:
```jsx
// Semantic UI
<i class="ui large icon"></i>
<i class="ui huge icon"></i>

// Nuxt UI (Tailwind)
<UIcon name="..." class="size-6" />
<UIcon name="..." class="w-6 h-6" />
```

### Color Patterns

**Theme Colors**:
```jsx
// MUI
<Icon color="primary" />
<Icon color="error" />

// Ant Design
<Icon style={{ color: token.colorPrimary }} />

// Chakra UI
<Icon color="blue.500" />
```

**Custom Colors**:
```jsx
// All frameworks support
<Icon style={{ color: '#1890ff' }} />
<Icon style={{ color: 'tomato' }} />
<Icon style={{ color: 'rgb(255, 87, 51)' }} />
```

**currentColor Inheritance**:
```jsx
// All frameworks
<div style={{ color: 'red' }}>
  <Icon /> {/* Inherits red color */}
</div>
```

### Custom Icon Implementation

**Inline SVG**:
```jsx
// React frameworks
<Icon>
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
  </svg>
</Icon>
```

**SVG Component Import**:
```jsx
// Vite/Webpack with SVGR
import { ReactComponent as CustomIcon } from './custom-icon.svg';
<Icon as={CustomIcon} />
```

**Create Icon Utility**:
```jsx
// MUI
import { createSvgIcon } from '@mui/material/utils';
const CustomIcon = createSvgIcon(
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />,
  'Custom'
);
```

### Accessibility Best Practices

**Decorative Icons**:
```jsx
// Icon is purely decorative (has accompanying text)
<Button>
  <Icon aria-hidden="true" /> Save
</Button>
```

**Meaningful Icons**:
```jsx
// Icon-only button (icon conveys meaning)
<IconButton aria-label="Delete item">
  <DeleteIcon />
</IconButton>
```

**Screen Reader Text**:
```jsx
// Icon with visually hidden text
<Button>
  <Icon aria-hidden="true" />
  <span className="sr-only">Save document</span>
</Button>
```

### Loading Spinner Pattern

**Built-in Spin**:
```jsx
// Ant Design
import { LoadingOutlined } from '@ant-design/icons';
<LoadingOutlined spin />

// Semantic UI
<i class="ui loading icon"></i>

// MUI (with CircularProgress)
<CircularProgress size={20} />
```

**CSS Animation**:
```jsx
// Custom spin animation
<Icon className="animate-spin" />

// CSS
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
```

## Icon Library Comparison

| Framework | Icon Library | Icon Count | Variants | Tree-Shakeable | License |
|-----------|--------------|------------|----------|----------------|---------|
| Ant Design | @ant-design/icons | 1000+ | 3 (Outlined, Filled, Two-Tone) | ✅ | MIT |
| Chakra UI | react-icons | 20,000+ | Multiple sets | ✅ | Various |
| MUI | @mui/icons-material | 1000+ | 5 (Filled, Outlined, Rounded, Sharp, Two-Tone) | ✅ | Apache 2.0 |
| Nuxt UI | Iconify | 150,000+ | 150+ collections | ✅ | Various |
| Semantic UI | Feather Icons | 280+ | 1 | ❌ (CSS-based) | MIT |
| Mantine | Tabler Icons (recommended) | 4,500+ | 1 (Outline) | ✅ | MIT |

### Icon Library Characteristics

**Ant Design (@ant-design/icons)**:
- Designed specifically for Ant Design
- Three visual weights (Outlined, Filled, Two-Tone)
- Consistent with Ant Design principles
- Best for Ant Design projects

**Chakra UI (react-icons)**:
- Aggregates multiple icon libraries
- Feather, Material Design, Font Awesome, Heroicons, etc.
- Extremely large selection
- Choose single set for consistency

**MUI (@mui/icons-material)**:
- Official Material Design icons
- Five style variants
- Best Material Design compliance
- Large bundle size if using many icons

**Nuxt UI (Iconify)**:
- Largest icon collection (150,000+)
- Access 150+ icon sets
- String-based icon selection
- Best for Vue/Nuxt projects

**Semantic UI (Feather Icons)**:
- Built-in CSS-based icons
- Lightweight, minimalist design
- Limited selection (280 icons)
- No tree-shaking (all icons in CSS)

**Mantine (Tabler Icons)**:
- Modern, consistent design
- Stroke-width customization
- Good selection (4,500+)
- Clean, professional appearance

## Accessibility

### WCAG Compliance

**Icon-only Controls** (WCAG 2.1, 1.1.1 Non-text Content):
```jsx
// ✅ Good - Accessible label
<IconButton aria-label="Delete item">
  <DeleteIcon />
</IconButton>

// ❌ Bad - No accessible name
<IconButton>
  <DeleteIcon />
</IconButton>
```

**Decorative Icons** (WCAG 2.1, 1.1.1):
```jsx
// ✅ Good - Hidden from screen readers
<Button>
  <Icon aria-hidden="true" /> Save
</Button>

// ✅ Also good - Semantic structure
<Button>
  <Icon /> <span>Save</span>
</Button>
```

**Color Contrast** (WCAG 2.1, 1.4.3):
```jsx
// Ensure icons meet 3:1 contrast ratio for UI components
<Icon color="gray.600" /> {/* Check contrast against background */}
```

**Keyboard Accessibility** (WCAG 2.1, 2.1.1):
```jsx
// ✅ Good - Keyboard accessible button
<IconButton onClick={handleClick}>
  <SettingsIcon />
</IconButton>

// ❌ Bad - Not keyboard accessible
<Icon onClick={handleClick} />
```

### Screen Reader Support

**Meaningful Icons**:
```jsx
// Option 1: aria-label
<Icon aria-label="Error" role="img">
  <ErrorIcon />
</Icon>

// Option 2: Visually hidden text
<span>
  <Icon aria-hidden="true" />
  <span className="sr-only">Error</span>
</span>

// Option 3: title element (SVG)
<svg>
  <title>Error</title>
  <path d="..." />
</svg>
```

**Status Icons**:
```jsx
// Status indicator with label
<span role="status" aria-live="polite">
  <Icon aria-hidden="true" />
  <span className="sr-only">Loading</span>
</span>
```

## Framework Recommendations

**For Comprehensive Icon Libraries**:
- Nuxt UI: 150,000+ icons via Iconify
- Chakra UI: 20,000+ icons via react-icons
- MUI: 1000+ Material Design icons

**For Design Consistency**:
- Ant Design: Three visual weights, consistent design
- MUI: Five Material Design variants
- Mantine: Tabler Icons with stroke customization

**For Performance**:
- Ant Design: Tree-shaking, optimized SVGs
- MUI: Tree-shaking, code splitting
- Mantine: Lightweight wrapper, minimal overhead

**For Customization**:
- Chakra UI: Full style system access
- Ant Design: Theme integration, two-tone colors
- Mantine: Stroke width control, flexible sizing

**For Accessibility**:
- All frameworks support ARIA attributes
- MUI: Best IconButton implementation
- Chakra UI: Built-in focus management

**For Custom Icons**:
- Chakra UI: Easiest custom SVG integration
- MUI: createSvgIcon utility
- All frameworks: Inline SVG support

## Raw Data References

Individual framework research reports available at:
- `ai/research/icon/ant-design/usage-patterns.md`
- `ai/research/icon/chakra-ui/usage-patterns.md`
- `ai/research/icon/mui/usage-patterns.md`
- `ai/research/icon/nuxt-ui/usage-patterns.md`
- `ai/research/icon/semantic-ui-classic/usage-patterns.md`
- `ai/research/icon/mantine/usage-patterns.md`

## Research Methodology

All research conducted on 2025-11-05 through parallel subagent research (6 subagents), direct documentation access, and cross-framework pattern analysis.

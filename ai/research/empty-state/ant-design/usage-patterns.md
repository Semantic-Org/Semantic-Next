# Ant Design - Empty Component - Usage Patterns
> Framework: Ant Design
> Last Updated: 2025-11-06
> Documentation URL: https://ant.design/components/empty/
> Component Category: Data Display
> Version Researched: 5.x (backward compatible with 3.x/4.x)

## Overview

The Empty component is an empty state placeholder that displays friendly, user-centric messaging when no data is available. It serves as both a visual indication of an empty state and an opportunity to guide users toward productive actions through calls-to-action and helpful instructions.

**Core Purpose**: Communicate empty states in a friendly, actionable way rather than showing blank space or generic error messages. The component reduces user confusion and provides clear paths forward when data is unavailable.

**Mental Model**: Users understand Empty states as temporary or correctable situations - "there's nothing here yet, but here's what you can do about it." The component transforms potentially frustrating empty states into opportunities for user guidance and onboarding.

**Semantic Meaning**:
- **Informational**: Explains why content is missing (no search results, no items created yet, no data available)
- **Actionable**: Provides next steps through child buttons or links
- **Brand-aligned**: Uses illustration style to maintain visual consistency
- **Contextual**: Adapts to different contexts (tables, lists, search results, etc.)

## Core Concepts

### Empty State Philosophy

Ant Design treats empty states as first-class UI elements worthy of thoughtful design. Rather than generic "no data" messages, the Empty component provides:

1. **Visual Identity**: Built-in illustrations that maintain Ant Design's visual language
2. **Contextual Messaging**: Customizable descriptions that explain the specific empty state
3. **Action Orientation**: Support for child elements (buttons, links) that guide users forward
4. **Global Consistency**: Integration with ConfigProvider for application-wide empty state theming

### Architectural Pattern

The Empty component follows a **simple presentational pattern** rather than complex composition. It's a single component that accepts:
- An illustration (built-in preset or custom)
- A description (text or rich content)
- Optional child elements (typically buttons for calls-to-action)

This contrasts with more complex component patterns - Empty is intentionally straightforward because empty states should be clear and unambiguous.

### Integration Strategy

Empty is designed as both:
1. **Standalone component**: Direct usage in custom layouts `<Empty />`
2. **Default fallback**: Automatic integration into data display components (Table, List, Select, etc.) through ConfigProvider

The ConfigProvider integration allows applications to define a single custom empty state that applies across all Ant Design components, ensuring consistency without repetitive prop passing.

## Component API

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `description` | `ReactNode` | `undefined` | Customize the description text or content displayed below the image. Can be a string, React element, or any renderable content. Use `false` to hide description entirely. |
| `image` | `ReactNode \| string` | `Empty.PRESENTED_IMAGE_DEFAULT` | Customize the illustration shown. Accepts a string URL for external images, one of the built-in preset constants (`Empty.PRESENTED_IMAGE_DEFAULT` or `Empty.PRESENTED_IMAGE_SIMPLE`), or a custom React element (like an SVG component). |
| `imageStyle` | `CSSProperties` | `undefined` | CSS style object for customizing the image container. Commonly used for adjusting dimensions, margins, or positioning of the illustration. |
| `children` | `ReactNode` | `undefined` | Optional content rendered below the description, typically used for call-to-action buttons or helpful links. |

### Common Props

The Empty component also inherits common Ant Design component props including:
- Standard HTML attributes
- `className` for custom styling
- `style` for inline CSS
- Data attributes for testing

### Built-in Image Presets

Ant Design provides two carefully designed illustration presets:

**`Empty.PRESENTED_IMAGE_DEFAULT`** (Default)
- Dimensions: 121px × 116px
- Style: Full-color illustration with Ant Design visual language
- Use case: Standard empty states with ample space
- Visual weight: Medium emphasis

**`Empty.PRESENTED_IMAGE_SIMPLE`** (Simplified)
- Dimensions: 55px × 35px
- Style: Minimal, simplified monochrome icon
- Use case: Compact layouts, secondary empty states, inline usage
- Visual weight: Low emphasis

Both illustrations are SVG-based, ensuring crisp rendering at any display density and supporting theme color inheritance.

## Usage Patterns

### Pattern 1: Basic Empty State (Default)

The simplest usage with no props, showing the default illustration and no description.

```jsx
import { Empty } from 'antd';

<Empty />
```

**When to use**: Quick placeholder during development, or when the empty state is self-explanatory from context (e.g., in a clearly labeled "Recent Items" section).

**Characteristics**:
- Shows default illustration
- No description text
- No call-to-action
- Minimal visual emphasis

### Pattern 2: Descriptive Empty State

Adding contextual description to explain why the state is empty.

```jsx
<Empty description="No data available" />

// Or with custom styling
<Empty description={
  <span>
    No search results found for <strong>"react components"</strong>
  </span>
} />
```

**When to use**: Most production empty states should include descriptions. Helps users understand:
- Why content is missing (no results, no items created, access denied, etc.)
- Whether the state is temporary or permanent
- What might have caused it (search returned no matches, filters too restrictive, etc.)

**Characteristics**:
- Clear, contextual messaging
- Supports rich content (bold, links, icons)
- Maintains friendly, helpful tone

### Pattern 3: No Description Empty State

Explicitly hiding the description for ultra-minimal presentations.

```jsx
<Empty description={false} />
```

**When to use**:
- Inline empty states where space is extremely limited
- When the surrounding context makes description redundant
- Secondary or supporting empty states that don't need emphasis

**Characteristics**:
- Illustration only
- Maximum space efficiency
- Minimal visual interruption

### Pattern 4: Simple/Compact Empty State

Using the simplified illustration for space-constrained layouts.

```jsx
import { Empty } from 'antd';

<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  description="No items"
/>
```

**When to use**:
- Dropdown menus, select components, or popovers
- Inline empty states within dense layouts
- Mobile views with limited vertical space
- Secondary panels or sidebars

**Characteristics**:
- Smaller footprint (55px × 35px vs 121px × 116px)
- Lower visual weight
- Cleaner for repeated/frequent empty states

### Pattern 5: Actionable Empty State

Adding call-to-action buttons to guide users toward resolving the empty state.

```jsx
import { Empty, Button } from 'antd';

<Empty description="You haven't created any projects yet">
  <Button type="primary">Create Project</Button>
</Empty>

// Or multiple actions
<Empty description="No items in your cart">
  <Button type="primary">Browse Products</Button>
  <Button type="link">View Saved Items</Button>
</Empty>
```

**When to use**: Empty states that users can actively resolve:
- No items created → "Create Item" button
- No search results → "Clear Filters" or "Browse All" button
- No content uploaded → "Upload Content" button
- Empty cart → "Continue Shopping" button

**Characteristics**:
- Guides users toward productive next steps
- Transforms passive state into actionable moment
- Primary action should resolve the empty state
- Secondary actions provide alternatives

### Pattern 6: Custom Image/Illustration

Replacing the default illustration with brand-specific or context-specific imagery.

```jsx
// Using a URL
<Empty
  image="https://example.com/custom-empty.svg"
  description="No notifications"
/>

// Using a custom React component
import { SearchOutlined } from '@ant-design/icons';

<Empty
  image={
    <SearchOutlined style={{ fontSize: 64, color: '#999' }} />
  }
  description="No search results found"
/>

// Using a custom SVG component
import CustomEmptyIllustration from './CustomEmptyIllustration';

<Empty
  image={<CustomEmptyIllustration />}
  imageStyle={{ height: 100 }}
  description="Custom empty state"
/>
```

**When to use**:
- Brand-specific empty states that match design system
- Context-specific illustrations (search → magnifying glass, upload → cloud icon)
- Maintaining visual consistency across a custom design system
- Emotionally resonant illustrations for critical empty states

**Characteristics**:
- Full control over visual presentation
- Can match specific brand guidelines
- Supports SVG for scalability
- Accepts external URLs for hosted illustrations

### Pattern 7: Styled Custom Empty State

Customizing the illustration appearance through CSS styling.

```jsx
<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  imageStyle={{
    height: 60,
    marginBottom: 16,
    opacity: 0.6
  }}
  description={
    <span style={{ color: '#999' }}>
      No data to display
    </span>
  }
/>
```

**When to use**:
- Adjusting visual weight/emphasis
- Matching specific design requirements
- Creating visual hierarchy among multiple empty states
- Adapting to different background colors

**Characteristics**:
- Fine-grained control over presentation
- CSS-based customization
- Can adjust size, opacity, spacing, colors
- Maintains component structure

### Pattern 8: Rich Content Empty State

Using complex descriptions with formatting, links, and semantic structure.

```jsx
<Empty description={
  <div>
    <p style={{ marginBottom: 8 }}>
      No items match your current filters
    </p>
    <Button type="link" onClick={clearFilters}>
      Clear all filters
    </Button>
  </div>
}>
  <Button type="primary">Browse All Items</Button>
</Empty>
```

**When to use**:
- Empty states requiring detailed explanation
- Multiple related actions or information
- Onboarding or first-run experiences
- Error recovery scenarios with specific instructions

**Characteristics**:
- Multi-paragraph descriptions
- Embedded links and actions
- Hierarchical information
- Helpful, instructional tone

### Pattern 9: Global Empty State Configuration

Defining application-wide empty state customization through ConfigProvider.

```jsx
import { ConfigProvider, Empty } from 'antd';

const customRenderEmpty = (componentName) => {
  // Different empty states for different components
  if (componentName === 'Table') {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No records found"
      />
    );
  }

  if (componentName === 'Select') {
    return <Empty description="No options" />;
  }

  return <Empty />;
};

<ConfigProvider renderEmpty={customRenderEmpty}>
  {/* All Ant Design components within will use custom empty states */}
  <App />
</ConfigProvider>
```

**When to use**:
- Ensuring consistent empty states across entire application
- Implementing brand-specific empty state designs
- Localizing empty states (translation, cultural adaptations)
- A/B testing different empty state approaches

**Characteristics**:
- Single configuration point
- Applies to Table, List, Select, TreeSelect, Cascader, Transfer
- Component-specific customization possible
- Reduces prop repetition across components

### Pattern 10: Empty State in Context (Table Integration)

Demonstrating how Empty appears within host components like Table.

```jsx
import { Table, Empty } from 'antd';

<Table
  columns={columns}
  dataSource={[]} // Empty data
  locale={{
    emptyText: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No data available"
      >
        <Button onClick={loadData}>Load Data</Button>
      </Empty>
    )
  }}
/>
```

**When to use**:
- Customizing empty states for specific component instances
- Adding context-specific actions (reload, filter adjustment, etc.)
- Overriding global ConfigProvider empty states for specific cases

**Characteristics**:
- Component-specific integration
- Preserves component layout/styling
- Can include interactive elements
- Overrides defaults

## Examples from Documentation

### Example 1: Basic Usage
Demonstrates the default Empty component with no props.

```jsx
<Empty />
```

**Purpose**: Shows the simplest possible usage with default illustration and no description.

### Example 2: Choose Image
Shows selection between built-in illustration presets.

```jsx
<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
```

**Purpose**: Demonstrates the compact illustration option for space-constrained layouts.

### Example 3: Customize
Full customization with custom image, description, and action button.

```jsx
<Empty
  image="custom-image-url.png"
  imageStyle={{ height: 60 }}
  description={
    <span>
      Customize <a href="#API">Description</a>
    </span>
  }
>
  <Button type="primary">Create Now</Button>
</Empty>
```

**Purpose**: Showcases all customization capabilities - custom image, styled image, rich description, and call-to-action.

### Example 4: ConfigProvider
Global empty state configuration affecting all child components.

```jsx
import { ConfigProvider, Select } from 'antd';

const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Custom empty content</p>
  </div>
);

<ConfigProvider renderEmpty={customizeRenderEmpty}>
  <Select options={[]} style={{ width: 200 }} />
  {/* Select will show custom empty state when no options */}
</ConfigProvider>
```

**Purpose**: Demonstrates application-wide empty state theming and how it applies to integrated components like Select.

### Example 5: No Description
Showing illustration without any description text.

```jsx
<Empty description={false} />
```

**Purpose**: Ultra-minimal empty state for contexts where description is redundant or space is extremely limited.

## Accessibility

### Semantic Structure

The Empty component implements appropriate semantic HTML:

```html
<div class="ant-empty">
  <div class="ant-empty-image">
    <svg><!-- Illustration --></svg>
  </div>
  <div class="ant-empty-description">Description text</div>
  <div class="ant-empty-footer">
    <!-- Children/actions -->
  </div>
</div>
```

**Semantic DOM Elements**:
- Root container with `ant-empty` class for styling hook
- Image container wrapping illustration
- Description container for text content
- Footer container for child actions

### ARIA Patterns

**Current Implementation**:
- No explicit ARIA roles on the Empty component itself
- Relies on semantic HTML structure
- Child buttons maintain their own accessibility attributes

**Recommended Usage**:
```jsx
<Empty
  description="No items available"
  aria-label="Empty state: No items available"
>
  <Button type="primary" aria-label="Create your first item">
    Create Item
  </Button>
</Empty>
```

### Keyboard Navigation

- Empty component itself is not interactive (no focus management needed)
- Child buttons/links maintain standard keyboard accessibility
- Tab order flows naturally through action buttons
- Enter/Space activate buttons as expected

### Screen Reader Considerations

**Best Practices**:
1. Always provide meaningful descriptions (avoid `description={false}` unless truly necessary)
2. Ensure description text is concise but complete
3. Include context in button labels ("Create Project" vs just "Create")
4. Consider aria-label for additional screen reader context

**Example**:
```jsx
<Empty
  description="You have no projects. Create your first project to get started."
>
  <Button
    type="primary"
    aria-label="Create your first project"
  >
    Create Project
  </Button>
</Empty>
```

### Color Contrast

- Default illustrations use sufficient contrast ratios
- Custom illustrations should maintain WCAG AA standards (4.5:1 for text, 3:1 for graphics)
- Description text inherits theme colors with adequate contrast
- Test custom styling against background colors

## Framework-Specific Patterns

### Integration with Ant Design Ecosystem

**1. ConfigProvider Integration**

Ant Design's Empty component uniquely integrates with ConfigProvider's `renderEmpty` prop, allowing centralized empty state management across the entire component library. This is a distinctive feature not commonly found in other frameworks.

```jsx
<ConfigProvider renderEmpty={customRenderEmpty}>
  {/* Affects: Table, List, Select, TreeSelect, Cascader, Transfer, Mentions */}
</ConfigProvider>
```

**Affected Components**:
- **Table**: Empty data rows
- **List**: Empty list items
- **Select/TreeSelect/Cascader**: No options available
- **Transfer**: Empty transfer lists
- **Mentions**: No mention suggestions

**2. Component Name Context**

The `renderEmpty` function receives the component name as a parameter, enabling component-specific empty states:

```jsx
renderEmpty={(componentName) => {
  if (componentName === 'Table') return <Empty description="No records" />;
  if (componentName === 'Select') return <Empty description="No options" />;
  return <Empty />;
}}
```

This component-aware pattern is unique to Ant Design.

**3. Built-in Locale Support**

Empty component integrates with Ant Design's internationalization system:

```jsx
import { ConfigProvider, Empty } from 'antd';
import zhCN from 'antd/locale/zh_CN';

<ConfigProvider locale={zhCN}>
  <Empty /> {/* Automatically shows Chinese text */}
</ConfigProvider>
```

Default descriptions are automatically translated across 40+ languages when using locale-specific imports.

**4. Design Token Integration**

Ant Design v5 introduced design token system integration for Empty:

```jsx
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    components: {
      Empty: {
        // Custom tokens for Empty component
        colorTextDescription: '#999',
        colorIcon: '#bfbfbf',
      }
    }
  }}
>
  <Empty />
</ConfigProvider>
```

**Customizable Tokens**:
- Description text color
- Icon/illustration color
- Spacing and dimensions
- Font sizes

**5. CSS-in-JS Styling**

Ant Design v5 uses CSS-in-JS for dynamic theming. The Empty component's styles are generated at runtime based on theme tokens, enabling:
- Dynamic theme switching without page reload
- Component-level style isolation
- Token-based customization
- SSR-compatible styling

**6. Single Component Pattern**

Unlike some frameworks that use multi-component composition (e.g., `<Empty.Image>`, `<Empty.Description>`), Ant Design uses a single component with props. This creates a simpler API surface but less granular control over internal structure.

**Comparison**:
```jsx
// Ant Design approach (single component)
<Empty image={img} description={desc}>
  <Button />
</Empty>

// Alternative composition approach (not Ant Design)
<Empty>
  <Empty.Image src={img} />
  <Empty.Description>{desc}</Empty.Description>
  <Empty.Actions>
    <Button />
  </Empty.Actions>
</Empty>
```

Ant Design's approach prioritizes simplicity over compositional flexibility.

**7. Preset Constants Pattern**

The use of component-attached constants (`Empty.PRESENTED_IMAGE_DEFAULT`) follows Ant Design's broader pattern of exposing configuration through component namespaces, similar to `Input.Password`, `Button.Group`, etc.

**8. Table Integration Pattern**

The `locale.emptyText` prop in Table and other data components specifically expects Empty component instances:

```jsx
<Table
  locale={{
    emptyText: <Empty description="No data" />
  }}
/>
```

This creates a standardized way to customize empty states across data display components.

### Ant Design Philosophy Reflected

**1. Pragmatic Simplicity**: Simple prop-based API rather than complex composition
**2. System Integration**: Deep integration with ConfigProvider and theme system
**3. Consistency**: Single empty state pattern used across all data components
**4. Internationalization First**: Built-in locale support from initial design
**5. Enterprise Focus**: Global configuration for large-scale applications

## Notes

### Historical Context

The Empty component was introduced in Ant Design v3.12.0 (December 2018) through PR #13651. Prior to this, empty states were handled inconsistently across components, often just showing empty space or basic "No Data" text without illustrations.

The component was designed to solve:
1. Inconsistent empty state UX across the component library
2. Lack of visual identity in empty states
3. Missing opportunity for user guidance and action
4. Need for global empty state configuration

### Design Decisions

**Why single component instead of composition?**
The Ant Design team chose a simpler prop-based API because empty states should be straightforward. The complexity of multi-component composition wasn't justified for a component that's inherently simple.

**Why two built-in illustrations?**
Having exactly two presets (default and simple) covers the vast majority of use cases:
- Default for primary empty states with space
- Simple for compact/secondary empty states

More presets would increase API surface without proportional benefit.

**Why ConfigProvider integration?**
Enterprise applications needed a way to maintain consistent empty states across hundreds of component instances without prop drilling. The ConfigProvider pattern solved this elegantly.

### Common Patterns in the Wild

**1. First-Run Experiences**
Empty states are frequently used for onboarding:
```jsx
<Empty description="Welcome! You haven't created anything yet">
  <Button type="primary" size="large">Get Started</Button>
</Empty>
```

**2. Search Results**
Search empty states often include filter clearing:
```jsx
<Empty
  description={`No results for "${searchTerm}"`}
>
  <Button onClick={clearSearch}>Clear Search</Button>
  <Button type="link" onClick={clearFilters}>Clear Filters</Button>
</Empty>
```

**3. Permission Denied**
Using empty states for access control messaging:
```jsx
<Empty
  image={<LockOutlined style={{ fontSize: 64 }} />}
  description="You don't have permission to view this content"
>
  <Button onClick={requestAccess}>Request Access</Button>
</Empty>
```

**4. Network Errors**
Empty states can communicate connection issues:
```jsx
<Empty
  description="Unable to load data. Please check your connection."
>
  <Button onClick={retry}>Retry</Button>
</Empty>
```

### Testing Considerations

**Unit Testing**:
```jsx
import { render, screen } from '@testing-library/react';
import { Empty } from 'antd';

test('renders description', () => {
  render(<Empty description="No data" />);
  expect(screen.getByText('No data')).toBeInTheDocument();
});

test('renders children', () => {
  render(
    <Empty>
      <button>Action</button>
    </Empty>
  );
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

**Visual Regression Testing**:
Empty states should be included in visual regression suites to catch:
- Illustration changes
- Layout shifts
- Theme token updates
- Responsive behavior

### Performance Characteristics

- **Lightweight**: Minimal JavaScript footprint
- **SVG-based**: Illustrations are inline SVG (no image requests)
- **CSS-in-JS**: Styles generated once and cached
- **Render Cost**: Very low - simple DOM structure with no complex logic

### Version Compatibility

**v3.12.0+**: Initial release with basic props
**v3.16.0+**: Added `imageStyle` prop
**v4.x**: Maintained API compatibility
**v5.x**: Added design token customization and semantic DOM structure

The API has remained remarkably stable across major versions.

### Migration Notes

**From v4 to v5**:
- No breaking changes to Empty component API
- Design tokens added (optional enhancement)
- Semantic DOM structure added (non-breaking)
- ConfigProvider `renderEmpty` remains unchanged

**From custom implementations**:
When migrating from custom empty state components:
1. Replace custom empty divs with `<Empty />`
2. Move descriptions to `description` prop
3. Move action buttons to `children`
4. Consider ConfigProvider for global consistency

### Related Components

**Components that integrate with Empty**:
- **Table**: Uses Empty for zero-data states
- **List**: Shows Empty when dataSource is empty
- **Select/TreeSelect/Cascader**: Display Empty when no options
- **Transfer**: Shows Empty in empty panels
- **Mentions**: Uses Empty when no suggestions

**Complementary components**:
- **Result**: For success/error/warning states (vs. empty states)
- **Spin**: For loading states (before showing Empty)
- **Alert**: For informational messages (different purpose than Empty)

### Best Practices Summary

**DO**:
- ✅ Always provide meaningful descriptions in production
- ✅ Include call-to-action buttons when users can resolve the empty state
- ✅ Use `Empty.PRESENTED_IMAGE_SIMPLE` for compact layouts
- ✅ Leverage ConfigProvider for application-wide consistency
- ✅ Test empty states as thoroughly as populated states
- ✅ Consider empty states during design phase, not as afterthought

**DON'T**:
- ❌ Show blank space without explanation
- ❌ Use generic "No Data" without context
- ❌ Include multiple primary action buttons (one primary CTA)
- ❌ Make empty states visually heavy/distracting
- ❌ Forget about empty state accessibility
- ❌ Use Empty for error states (use Result instead)

### Future Considerations

Potential enhancements being discussed in the community:
- Additional built-in illustration presets for common contexts
- Animation support for state transitions
- Dark mode optimized illustrations
- Component-level illustration theming through design tokens
- More granular semantic DOM customization through `classNames` prop

### Resources

**Official Documentation**:
- Component docs: https://ant.design/components/empty/
- Design specs: https://ant.design/docs/spec/research-empty/
- ConfigProvider: https://ant.design/components/config-provider/
- Design tokens: https://ant.design/docs/react/customize-theme/

**Community Resources**:
- GitHub discussions: https://github.com/ant-design/ant-design/discussions
- Stack Overflow tag: `antd`
- Component source: https://github.com/ant-design/ant-design/tree/master/components/empty

**Related Reading**:
- Empty States: When to Use Which UX Pattern
- Designing for the Empty States
- Ant Design Empty component RFC and design rationale

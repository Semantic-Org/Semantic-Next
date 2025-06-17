# Semantic UI Example Creation Guide

> **For:** AI agents creating examples for the Semantic UI documentation system  
> **Prerequisites:** Understanding of example types and documentation structure  
> **Scope:** Documentation metadata, playground behavior, file organization requirements  
> **Related:** [Component Development Guide](../guides/component-generation-instructions.md) • [Package Examples](./package-example-guide.md)  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## 📋 **Documentation vs Component Development**

**This guide covers documentation system requirements.** For component implementation patterns, see:
**[Component Development Guide](../guides/component-generation-instructions.md)** - Framework usage, architecture, and implementation best practices.

---

## 📋 **Complete Documentation Metadata System**

### **Example Types & Their Behaviors**

#### **Component Examples** (`exampleType: 'component'`)
- **Purpose**: Interactive UI components with templates, CSS, and JavaScript
- **Includes**: Automatic SUI framework injections, component APIs, design tokens
- **File Structure**: `component.js`, `component.html`, `component.css` + optional page files
- **Use Case**: Interactive components, UI elements, widgets

#### **Package Examples** (`exampleType: 'log'`)
- **Purpose**: Demonstrating core packages (reactivity, utils, query)
- **Includes**: Console logging scripts, package imports only
- **File Structure**: Usually just `index.js` or simple JS files
- **Use Case**: Signal/Reaction demos, utility function examples, DOM query examples
- **Special Behavior**: Hides `page.html`, focuses on console output

#### **Page Examples** (`exampleType: 'page'`)
- **Purpose**: Standalone pages without automatic SUI injections
- **Includes**: No automatic framework imports (manual setup required)
- **File Structure**: Custom structure, often `page.html` with manual imports
- **Use Case**: CDN integration examples, external library demos

#### **Folder Examples** (`exampleType: 'folder'`)
- **Purpose**: Complex examples with multiple related files
- **Includes**: All files in the folder directory
- **File Structure**: Multiple components, subcomponents, utilities
- **Use Case**: Complete applications, multi-component systems

### **Complete Metadata Field Reference**

#### **Required Fields**
```yaml
title: 'Example Name'              # Display name (can be long)
exampleType: 'component'           # component|log|page|folder
subcategory: 'UI Components'       # Organization category
description: 'Brief description'   # Functionality summary
tags: ['component', 'ui']          # Search/filtering tags
```

#### **Optional Organization Fields**
```yaml
id: 'short-name'                   # Override folder matching (useful for long titles)
category: 'Components'             # Top-level grouping
shortTitle: 'Button'               # Compact menu name
hidden: true                       # Hide from public listings
```

#### **Playground Behavior Fields**
```yaml
selectedFile: 'component.js'       # Default active file tab
fold: false                        # Show/hide import/export boilerplate
tip: 'Use design tokens'           # Helpful implementation note
additionalPageFiles: ['demo.js']   # Files grouped with page files in menus
```

### **Playground Layout System**

#### **File Organization Logic**
- **Component Files**: `component.js`, `component.html`, `component.css`, `index.js`
  - Appear in **left panel/menu** (Panel 0)
  - Get `'grow'` sizing (expand to fill space)
  - Considered "definition" files

- **Page Files**: `page.html`, `page.css`, `page.js` + `additionalPageFiles`
  - Appear in **right panel/menu** (Panel 1) 
  - Get smaller sizing (11% each)
  - Considered "demo/usage" files

#### **Responsive Behavior**
- **Desktop (>1200px)**: Separate component/page menus, panels or tabs
- **Tablet (768-1200px)**: Combined menus, vertical layout
- **Mobile (<768px)**: Single tab view with code/preview toggle

#### **Layout Modes**
- **Tabs**: Single menu, selected file shows in content area
- **Panels**: Split view, both sides visible, resizable

### **Example Type Decision Guide**

```
Creating interactive UI component?
├── Complex multi-file system → exampleType: 'folder'
└── Standard component → exampleType: 'component'

Demonstrating core package APIs?
├── Reactivity/Utils/Query demos → exampleType: 'log'
└── Learning/tutorial focus → exampleType: 'log'

Creating standalone page/integration?
├── CDN usage example → exampleType: 'page'
├── External library demo → exampleType: 'page'
└── Manual setup required → exampleType: 'page'
```

## 🚀 **Step-by-Step Creation Process**

The creation process varies by example type. Choose the appropriate workflow:

### **For Component Examples** (`exampleType: 'component'`)

#### Step 1: Plan and Setup
- Use TodoWrite tool to plan the multi-step component creation task
- Determine component name and functionality  
- Check `/src/components/` for existing first-party UI components to use

#### Step 2: Read Component Specifications
- Read relevant component spec files at `/src/components/{component}/specs/{component}.json`
- Review existing similar examples in `/docs/src/examples/` for patterns

#### Step 3: Create Required Directory Structure

**🚨 MANDATORY: Component File Structure & Paths**

When creating a new component example, you **MUST** follow this exact structure:

```
/docs/src/examples/my-component-name/
├── component.js     # Main component definition (REQUIRED)
├── component.html   # Component template (REQUIRED) 
├── component.css    # Component styles (REQUIRED)
├── page.html        # Custom demo (optional - auto-generated if missing)
├── page.css         # Demo styling (optional)
└── page.js          # Demo interactions (optional)

/docs/src/content/examples/
└── my-component-name.mdx  # Metadata file (REQUIRED)
```

**Critical Requirements:**
1. **Component files** MUST go in `/docs/src/examples/your-component-name/`
2. **Metadata file** MUST go in `/docs/src/content/examples/your-component-name.mdx`
3. **Both locations are REQUIRED** - the component will not work without both
4. **Folder name and metadata filename MUST match** (e.g., `loader/` folder → `loader.mdx` file)
5. **Title in metadata MUST match folder name** (e.g., folder `loader` → title `'Loader'`)

**❌ Wrong Paths (DO NOT USE):**
- `/examples/your-component/` (this is for standalone examples, not docs)
- `/docs/src/examples/your-component.mdx` (metadata goes in content/examples/)
- Missing either component files OR metadata file

#### Step 4: Create Component Metadata File
Create `/docs/src/content/examples/my-component-name.mdx`:
```markdown
---
title: 'My Component Name'
exampleType: 'component'
subcategory: 'UI Components'
description: 'Brief description of functionality'
tags: ['component', 'ui', 'interaction']
---
```

#### Step 5: Implement Component Files

For component implementation patterns, see: **[Component Generation Instructions](../guides/component-generation-instructions.md)**

**Key Requirements for Documentation Examples:**
- **component.js**: Use `defineComponent`, `self.method()` references, `$` prefixed queries
- **component.html**: Use first-party UI components (`<ui-button>`, `<ui-input>`), semantic classes
- **component.css**: Use design tokens (`var(--spacing)`), semantic class names (`.large`, `.primary`)

**🚨 CRITICAL: Page File Standards**

**page.html and page.css MUST follow the same standards as component files:**
- **page.css** must use design tokens (`var(--spacing)`, `var(--text-color)`) not hardcoded values
- **page.html** must use terse, semantic class names (`.container`, `.grid`, `.item`) not hyphenated names (`.demo-container`, `.loader-grid`)
- **page.css** must use CSS nesting and natural hierarchy patterns
- **page.js** must prefix all query variables with `$` (`const $button = $('#btn')`)
- **Never use inline styles** in `page.html` - use `page.css` for demo page styling

**Subcomponent files:**
- Use hyphenated names like `todo-item.js`, `todo-item.html`, `todo-item.css`

### **For Page/Integration Examples** (`exampleType: 'page'`)

#### Step 1: Plan Integration Demo
- Determine what external integration to show (CDN usage, external library)
- Plan manual setup requirements

#### Step 2: Create Custom Structure
```
/docs/src/examples/integration-name/
├── page.html        # Manual HTML setup
├── page.css         # Custom styling
└── page.js          # Integration code
```

#### Step 3: Create Integration Metadata
```markdown
---
title: 'CDN Integration Example'
exampleType: 'page'
subcategory: 'CDN Usage'
description: 'Shows how to use SUI from CDN'
tags: ['cdn', 'integration', 'setup']
---
```

#### Step 4: Implement Manual Setup
- Manually import SUI from CDN or external sources
- Show complete setup without automatic injections

### **Universal Steps** (All Example Types)

#### Step 6: Critical Requirements Check
- Folder name matches metadata filename
- Title in metadata matches folder name  
- Using `self.method()` not `this.method()` (components only)
- CSS uses design tokens not hardcoded values (components only)
- Query variables prefixed with `$` (components only)
- HTML attributes lowercase (`showlabel` not `showLabel`) (components only)

#### Step 7: Test and Validate
- Run lint/typecheck commands if available
- Verify example loads in documentation system
- Test functionality and console output
- Mark TodoWrite tasks as completed

#### Step 8: Optional Enhancements
- Add `additionalPageFiles` for related demo utilities
- Configure `selectedFile` for optimal user experience
- Add helpful `tip` for implementation guidance
- Set `fold: false` if you want to show all code

## Adding New Examples to Documentation

When creating examples to showcase your components or packages, you need to add them to the documentation system. This involves two main parts: creating a metadata file and providing the actual implementation files.

### 1. Create Example Metadata (.mdx file)

Create a `.mdx` file in `/docs/src/content/examples/` with frontmatter metadata:

#### **Component Example Metadata**
```markdown
---
title: 'Advanced Progress Bar'
id: 'progress-bar'                 # Short folder name
exampleType: 'component'
category: 'Components'
subcategory: 'UI Components'
tags: ['component', 'ui', 'progress', 'animation']
description: 'Animated progress indicator with multiple themes and sizes'
tip: 'Use the size and theme props to customize appearance'
selectedFile: 'component.js'
additionalPageFiles: ['demo-data.js']  # If you have demo utilities
---
```

**Common subcategories:**
- **Components**: `UI Components`, `Form Elements`, `Layout`, `Data Display`, `Navigation`, `Feedback`
- **Packages**: `Reactivity`, `Query System`, `Utilities`, `Design Tokens`
- **Integration**: `CDN Usage`, `External Libraries`, `Build Tools`

### 2. Create Component Files

Add your component files in `/docs/src/examples/your-component-name/`:

**Required files:**
- `component.js` - Main component definition
- `component.html` - Component template
- `component.css` - Component styles

**Optional files:**
- `page.html` - Custom usage example (auto-generated if not provided)
- `page.js` - Page-level JavaScript for complex demos
- `page.css` - Page-specific styling
- Additional subcomponent files (e.g., `sub-item.js`, `sub-item.html`, `sub-item.css`)

### 3. Understanding Auto-Generated page.html

If you don't provide a `page.html` file, the system automatically generates one using your component's tag name (e.g., `<your-component></your-component>`). This auto-generation relies on the `tagName` being defined in your `component.js` via `defineComponent`.

**For template-only components** (defined using `defineComponent` but without a `tagName`), auto-generation of `page.html` is not applicable as there's no tag to render. In such cases, you **must** provide a custom `page.html`. This custom page should demonstrate how to programmatically create an instance of the template and render it (e.g., by importing the template definition and calling its `render()` method, then appending the result to the DOM or integrating it with a host component).

**Auto-generated structure:**
```html
<your-component></your-component>
```

**When to provide custom page.html:**
- Your component needs specific configuration or settings
- You want to demonstrate multiple usage patterns
- The component requires surrounding context or container elements
- You need to show component composition or interaction

**Example custom page.html:**
```html
<div class="demo-container">
  <h3>Basic Usage</h3>
  <my-component size="small"></my-component>

  <h3>With Custom Settings</h3>
  <my-component size="large" theme="dark"></my-component>
</div>
```

### 4. File Organization Examples

**Simple component (auto-generated page):**
```
/docs/src/examples/simple-button/
├── component.js     # Main component
├── component.html   # Template
├── component.css    # Styles
└── (page.html auto-generated)
```

**Complex component with custom demo:**
```
/docs/src/examples/advanced-table/
├── component.js     # Main table component
├── component.html   # Table template
├── component.css    # Table styles
├── row.js          # Row subcomponent
├── row.html        # Row template
├── row.css         # Row styles
├── page.html       # Custom demo page
├── page.js         # Demo interactions
└── page.css        # Demo styling
```

**Multi-component system:**
```
/docs/src/examples/todo-list/
├── component.js     # Main todo-list
├── component.html   # List template
├── component.css    # List styles
├── todo-item.js    # Item subcomponent
├── todo-item.html  # Item template
├── todo-item.css   # Item styles
├── todo-header.js  # Header subcomponent
├── todo-header.html # Header template
├── todo-header.css # Header styles
├── todo-footer.js  # Footer subcomponent
├── todo-footer.html # Footer template
├── todo-footer.css # Footer styles
├── page.html       # Complete demo
└── page.css        # Demo styling
```

---

**Last Updated:** Complete example creation system documentation  
**Maintenance:** Update this file when adding new example types or changing metadata schema
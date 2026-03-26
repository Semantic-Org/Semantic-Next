# Ant Design — Component Documentation Structure
## Component Analyzed: Select
## URL: https://ant.design/components/select

## Page Chrome

The page uses a three-column layout:
- **Left sidebar**: Category-grouped component navigation via a vertical menu. Components are organized under groups like "General", "Layout", "Navigation", "Data Entry", "Data Display", "Feedback", "Other". Select lives under "Data Entry".
- **Center**: Main documentation content, which is the widest column (18/24 grid on md+).
- **Right sidebar**: A fixed-position `ant-anchor` table of contents listing all H2 headings and their sub-items (individual demos, API sub-sections, FAQ entries). The TOC is hierarchical: top-level sections (When To Use, Examples, API, Semantic DOM, Design Token, FAQ) are shown with nested children indented beneath them.

At the very top of the content area:
- **H1**: "Select" with an edit icon link to the GitHub source markdown file.
- **Description/subtitle**: Not shown as a visible subtitle on the rendered page, but exists in frontmatter metadata (`description: A dropdown menu for displaying choices.`) and in the page's `<meta>` tags.
- **Metadata bar**: A compact `ant-descriptions` table showing three items:
  - **Import**: Copy-paste import statement
  - **GitHub**: Link to source code on GitHub
  - **Docs**: Link to the source markdown file for editing
- **Prev/Next navigation** at the very bottom links to adjacent components in the same category, with left/right arrow icons.

## Source Format

The documentation is authored as a single Markdown file (`index.en-US.md`) with YAML frontmatter. Key frontmatter fields:
- `category`: Component (used for grouping in sidebar)
- `group`: Data Entry (sub-category)
- `title`: Select
- `description`: One-line description
- `cover` / `coverDark`: Preview images for the component gallery page
- `demo.cols: 2`: Controls the column layout of the examples section

Demos are referenced inline via `<code src="./demo/basic.tsx">Title</code>` tags. Some have a `version` attribute (e.g., `version="5.13.0"`) for version badges, and some have a `debug` attribute which marks them as debug-only (hidden in production docs).

## Section Taxonomy (in page order)

### 1. Component Title + Metadata
- **Purpose**: Identify the component, provide quick-access links for developers.
- **Content type**: H1 heading with edit link, followed by a structured metadata table (Import, GitHub, Docs).
- **Notes**: The metadata bar is compact and utility-focused. The import statement is copy-pasteable. There is no prose description shown here in the rendered page — the description is only in metadata/SEO. This is a lean, "jump straight to business" approach.

### 2. When To Use
- **Purpose**: "When should I reach for this component instead of alternatives?"
- **Content type**: Short bulleted list (3 items for Select) providing usage guidance.
- **Notes**: This is terse and decision-oriented. Each bullet either describes the primary use case, recommends an alternative for a specific scenario (Radio for fewer than 5 options), or disambiguates from a similar component (AutoComplete). Cross-links to related components (Radio, AutoComplete) are inline. There is no live demo here — this is purely guidance prose.

### 3. Examples
- **Purpose**: "Show me the component in action across its key variations and use cases."
- **Content type**: A grid of interactive demo blocks, laid out in 2 columns (controlled by `demo.cols: 2` frontmatter). Each demo is a self-contained "code-box" block.
- **Notes**: This is the largest section on the page, containing 28 visible demos (plus several `debug`-only demos hidden in production). The section is headed by a simple H2 "Examples" and has global controls in the top-right corner for expand/collapse all code blocks.

#### Demo Block Structure (code-box)
Each demo block has a consistent internal structure:
1. **Live preview area** (`code-box-demo`): The rendered component at the top, inside a bordered container. This is fully interactive — users can click, type, select.
2. **Title bar** (`code-box-title`): A short descriptive title (e.g., "Basic Usage", "Custom Search", "Tags"). Some titles include a version badge (e.g., "5.22.0") for features added in specific versions.
3. **Description** (`code-box-description`): A brief prose description explaining what the demo shows (e.g., "Multiple selection, selecting from existing items."). May contain inline code and links.
4. **Action bar** (`code-box-actions`): A row of icon buttons:
   - **Expand/collapse code** toggle (shows/hides the source code)
   - **Copy code** button
   - **Open in CodeSandbox** button
   - **Open in StackBlitz** button
   - **Open on GitHub** link (5 action buttons per demo)
5. **Code block** (`code-box-codeblock`): The full source code, hidden by default (collapsed), expandable via the toggle. Rendered with syntax highlighting.

#### Demo Ordering
The demos progress from basic to advanced:
- Basic Usage, Search, Multiple Selection (core features)
- Sizes, Variants, Placement (visual customization)
- Tags, Option Groups, Coordinate (mode-specific features)
- Search and Select Users, Custom Dropdown (integration patterns)
- Big Data, Responsive, Custom Tag Render (advanced/performance)
- Status, Max Count (form integration)
- Custom Semantic DOM Styling (newest feature, v6.0.0)

### 4. API
- **Purpose**: "What props, methods, and sub-components does this component accept?"
- **Content type**: Multiple markdown tables organized by sub-component/feature, preceded by a link to common props.
- **Notes**: Opens with a brief cross-reference to shared/common props documentation. Then breaks into sub-sections:

#### 4a. Select props (H3)
- A wide table with 5 columns: **Property** | **Description** | **Type** | **Default** | **Version**
- Roughly 50+ props listed alphabetically
- Deprecated props are shown with strikethrough text (e.g., `~~dropdownRender~~`) and include a migration note ("use `popupRender` instead")
- Complex types use inline code formatting and line breaks
- Version column shows when a prop was added (e.g., "5.8.0") or when sub-features were added (e.g., "5.8.0: Support object type")
- Followed by a blockquote note with a common gotcha/tip

#### 4b. showSearch (H3)
- A separate props table for the `showSearch` object configuration
- Same 5-column structure as the main props table
- Contains props that were moved from the top-level Select to this sub-object

#### 4c. Select Methods (H3)
- A narrower 3-column table: **Name** | **Description** | **Version**
- Lists imperative methods like `blur()` and `focus()`

#### 4d. Option props (H3)
- Props table for the `<Option>` sub-component
- Same 5-column structure

#### 4e. OptGroup props (H3)
- Props table for the `<OptGroup>` sub-component
- Same 5-column structure

### 5. Semantic DOM
- **Purpose**: "What is the internal DOM structure and how can I target individual parts for styling?"
- **Content type**: An interactive visual diagram rendered from a special simplified demo (`code-box-simplify`).
- **Notes**: This is a distinctive Ant Design v5+ pattern. The diagram shows the component's rendered DOM tree with labeled regions (root, prefix, content, placeholder, clear, input, suffix, popup.root, popup.list, popup.listItem). Each region is visually highlighted with colored borders and labels. These region names correspond to keys used in the `classNames` and `styles` props for targeted customization. This section was introduced to support Ant Design's "Semantic DOM" styling API.

### 6. Design Token
- **Purpose**: "What design tokens control this component's appearance, and how do I customize them?"
- **Content type**: A tabbed table with two views, selectable via a segmented control:
  - **Component Token**: Tokens specific to Select (e.g., `optionSelectedBg`, `optionHeight`, `selectorBg`)
  - **Global Token**: Shared tokens that affect Select (e.g., colors, border radius, font sizes)
- **Notes**: Each table has 4 columns: **Token Name** | **Description** | **Type** | **Default Value**. The token table is rendered by a special `<ComponentTokenTable>` component. This section supports Ant Design's theme customization system where tokens can be overridden at the theme provider level.

### 7. FAQ
- **Purpose**: "What common issues will I run into and how do I solve them?"
- **Content type**: A series of H3 sub-headings, each phrased as a question, followed by a prose answer. Some answers include inline code examples.
- **Notes**: Contains 6 FAQ entries for Select. Each question has a custom anchor ID (e.g., `#faq-tags-mode-duplicate`) for direct linking. Questions are phrased in the user's voice ("Why sometimes...", "When I click...", "I don't want..."). Answers range from one-line explanations to multi-paragraph responses with code snippets. Some answers link to external CodeSandbox examples for interactive reproduction. The FAQ entries cover:
  1. Duplicate options in tags mode
  2. Dropdown not closing with popupRender
  3. Keeping dropdown open with popupRender
  4. Custom option scroll breaking (virtual scroll)
  5. Missing aria attributes in a11y tests
  6. tagRender dropdown pop-up behavior

## Overall Pattern

Ant Design's documentation philosophy is **reference-first with extensive demonstration**. The page flow is:

1. **Orient** (When To Use) — One brief section that positions the component relative to alternatives. No demo, just decision guidance.
2. **Demonstrate** (Examples) — The bulk of the page. A massive grid of 28+ interactive demos covering virtually every feature and configuration. Demos are preview-first (live component at top, code hidden by default), laid out in a 2-column grid for scanability. Each demo is self-contained with export-to-sandbox capabilities.
3. **Specify** (API) — Exhaustive prop tables grouped by sub-component. Deprecation annotations inline. Version badges track feature additions across releases.
4. **Visualize structure** (Semantic DOM) — A unique feature showing the component's internal DOM structure for CSS targeting.
5. **Customize theme** (Design Token) — Token tables for theming, split into component-specific and global tokens.
6. **Troubleshoot** (FAQ) — Common gotchas phrased as user questions with direct answers.

Key characteristics:
- **No "Usage" or "Getting Started" prose section** — There is no narrative introduction explaining how to use the component. You learn by reading the examples. The "When To Use" section is about *decision-making*, not *how-to*.
- **Demos are the documentation** — With 28 demos, virtually every prop and configuration is demonstrated visually rather than described in prose. This is a "show, don't tell" approach taken to an extreme.
- **Two-column demo grid** — Unlike libraries that show demos full-width in sequence, Ant Design uses a compact 2-column grid that puts more demos above the fold. Simple demos (basic, search) are small enough to fit in half-width.
- **Code is hidden by default** — The live preview is always visible, but source code requires an explicit expand action. This prioritizes visual scanning over code reading.
- **Sandbox export on every demo** — CodeSandbox and StackBlitz buttons on each demo enable instant reproduction/experimentation.
- **Deprecation visible inline** — Deprecated props are shown with strikethrough in the API table alongside their replacement, rather than being removed or hidden. This aids migration.
- **Semantic DOM diagram** — A distinctive pattern not found in most UI libraries. Visually maps the component's internal structure to the `classNames`/`styles` API.
- **Frontmatter-driven** — The entire page structure is generated from a single markdown file with declarative demo references. The rendering framework handles layout, code extraction, live preview, and sandbox export.
- **i18n built-in** — The file is `index.en-US.md`, with Chinese counterpart at `index.zh-CN.md`. Language is determined by URL suffix.
- **Progressive complexity in demos** — Demos flow from basic usage through customization, integration patterns, advanced features, and finally debug-only examples (hidden in production).

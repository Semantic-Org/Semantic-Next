# Component Pattern Research: Transfer / Transfer List

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3
- Date: 2025-11-05
- Unique patterns identified: 20+

## Component Definition Consensus

Transfer components provide dual-list interfaces for moving items between available and selected states. Universal mental model: "move items from one list to another."

**Primary Purpose:** Enable users to select multiple items from a source list and transfer them to a target list, typically for permissions, feature selection, or list management.

**Mental Model:** Two side-by-side lists with controls to move items between them.

**Semantic meaning:** Represents selection and organization of items into chosen/unchosen categories.

## Terminology Variations

- **Transfer** (1 framework) = Ant Design
- **Transfer List** (1 framework) = MUI
- **PickList** (1 framework) = PrimeReact

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Item text display | Basic text rendering | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Custom item rendering | Rich content templates | 3/3 (100%) | **Level 1: Universal** | All | Ant/Prime: Native; MUI: Composed |
| Headers | List titles | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Selection checkboxes | Multi-select UI | 3/3 (100%) | **Level 1: Universal** | All | Native |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Dual-list layout | Side-by-side lists | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Transfer buttons | Move controls | 3/3 (100%) | **Level 1: Universal** | All | Native |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Selection state | Track selected items | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Transfer state | Track transferred items | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Disabled items | Non-transferable items | 2/3 (67%) | **Level 2: Common** | Ant, PrimeReact | Native |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Search/filter | Find items | 3/3 (100%) | **Level 1: Universal** | All | Ant/Prime: Native; MUI: Composed |
| One-way transfer | Left to right only | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |
| Move all buttons | Bulk transfer | 2/3 (67%) | **Level 2: Common** | MUI, PrimeReact | Native |
| Reordering | Within-list order | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Item counters | Show counts | 1/3 (33%) | **Level 4: Occasional** | MUI | Composed |

## Notable Patterns

### Universal (100%)
- Dual-list interface
- Selection via checkboxes
- Transfer via buttons
- Custom rendering support
- Search/filter capability

### Ant Design Specializations
- One-way transfer mode
- Scroll event handlers
- Custom operation text
- Disabled item support
- Flexible render prop

### MUI Specializations
- Composition-based (no pre-built component)
- Select all checkbox
- Indeterminate states
- Item counter display
- Two architecture patterns

### PrimeReact Specializations
- 10 filter match modes
- Within-list reordering
- Touch device meta key handling
- Granular control visibility
- Multi-field filtering

## Implementation Notes

### Architecture Approaches

**Monolithic (Ant, PrimeReact):**
- Single component with props
- All features built-in

**Compositional (MUI):**
- Pattern from primitives
- Custom implementation required

### Transfer Mechanisms

**Button-based (Universal):**
- All frameworks use buttons
- No drag-drop by default

**Event Callbacks:**
- Ant: onChange, onSelectChange
- MUI: Custom handlers
- Prime: onMoveToTarget, onMoveToSource, etc.

## Limited Ecosystem Observation

Only 3 frameworks provide Transfer components - considered specialized functionality.

## Sophisticated Design Patterns

### Ant Design - Dual-State Feedback Loop (Selection vs. Transfer Separation)

**What it does**: Separates item selection (checkbox toggling) from item transfer (button actions). Users first select items, then deliberately move them via buttons. This creates a two-stage workflow where selected items are visually marked but not transferred until the user explicitly clicks the transfer button. Selection persists across lists, allowing users to select from both left and right lists independently before any transfer occurs.

**Why it's sophisticated**: Transfer components must balance the tension between "what's selected" and "what moves." Most components collapse this into a single action, but Ant Design's explicit separation enables sophisticated workflows. It allows users to build up selections across both lists before committing to a transfer, and selection state can be cleared independently from transfer state. This prevents accidental transfers and creates clear intent signals—a non-obvious problem that many transfer interfaces get wrong.

**Evidence of design maturity**:
- Selective callback system (onChange vs. onSelectChange) shows deep understanding that selection and transfer are distinct operations with different lifecycles
- Ability to programmatically control selectedKeys independently of targetKeys creates powerful composition patterns for validation, confirmation dialogs, and multi-step workflows
- The scroll event handler (onScroll) was added specifically to support lazy-loading patterns, indicating the framework anticipated advanced use cases beyond basic transfers

---

### PrimeReact - Touch-Aware Multi-Select with Platform Adaptation

**What it does**: The metaKeySelection property automatically disables itself on touch devices, allowing users to select multiple items without holding Ctrl/Cmd on mobile. The same prop, on desktop, enforces the meta key requirement. The framework detects the device type at runtime and adjusts the interaction paradigm without requiring developers to write conditional logic.

**Why it's sophisticated**: Transfer components typically ignore the fundamental input model differences between touch and keyboard-mouse interfaces. Touch devices have no "meta key" concept, yet many transfer implementations force users to use a key that doesn't exist on their device. PrimeReact's solution is non-obvious: instead of creating separate components or forcing developers to detect devices, it modifies its own behavior. This requires the component to understand device capabilities and adjust its API expectations accordingly—a cross-cutting concern that few components address.

**Evidence of design maturity**:
- The feature ships as a simple prop but requires sophisticated runtime detection logic under the hood
- Event payload structure (onMoveToTarget, onMoveToSource) designed to work identically whether items came from touch selection or keyboard selection
- Filter system works across both interaction models, indicating the entire component was architected with multi-device support from the ground up

---

### Ant Design - Granular One-Way Transfer Mode with Directional Control

**What it does**: The oneWay prop restricts transfers to left→right only, removing the left-pointing button. This creates a wizard-like workflow where items flow in one direction. Combined with the separate render prop for custom item templates and the disabled item mechanism, it enables scenarios where users can only advance items through stages but not move them backward—useful for progressive disclosure workflows or state-machine-like interfaces.

**Why it's sophisticated**: Most transfer components assume bidirectional movement is the baseline use case. The one-way mode solves a non-obvious problem: enforcing progression workflows where moving backward is either forbidden or creates validation issues. It requires the component to understand that transfer direction isn't just a UI affordance—it's a semantic constraint that affects validation, state management, and workflow intent. The fact that disabled items, render functions, and one-way mode all work together suggests the component was designed with state-machine-like workflows in mind from the beginning.

**Evidence of design maturity**:
- Works seamlessly with custom rendering and disabled items, suggesting the component anticipated combining multiple constraint types
- Operations prop allows custom button labels, enabling "Next Step" / "Complete" language instead of generic directional arrows
- Form integration (Form.Item wrapper pattern) suggests the component understood one-way mode would be used in multi-step form submissions

---

## Raw Data

- [Ant Design](./ant-design/usage-patterns.md)
- [MUI](./mui/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)

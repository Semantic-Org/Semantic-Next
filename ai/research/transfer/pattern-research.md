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

## Raw Data

- [Ant Design](./ant-design/usage-patterns.md)
- [MUI](./mui/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)

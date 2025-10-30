# AI Agent Context Instructions

> **For:** AI agents working with Semantic UI documentation  
> **Purpose:** Optimize documentation usage for AI-specific workflows  
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## Semantic UI Context Optimization

### **Framework-Specific Considerations**
This documentation is structured around Semantic UI's unique architecture:
- **Signals-based reactivity** requiring understanding of reactive vs non-reactive contexts
- **Component tree navigation** as the primary state sharing mechanism
- **Shadow DOM encapsulation** affecting query strategies
- **Design token system** with specific CSS custom property patterns

### **Context Loading for Semantic UI**
The framework's complexity requires strategic context loading:
- **Start with mental model** for architectural foundation
- **Task-specific guides** provide implementation patterns
- **Specialized packages** can be used independently
- **Examples are canonical** - they demonstrate best practices

---

## Context Loading Optimization

### Document Size Guidelines
- Each document designed for ~8K token context windows
- Cross-references minimize duplication
- Sections tagged with use cases for targeted loading

### **Progressive Context Building**

Level 0: Foundational Context
├── Read: `ai/00-START-HERE.md` (Navigation hub)
├── Read: `ai/foundations/mental-model.md` (Core architectural concepts)
└── Confirm: Foundational context is loaded before proceeding to task-s

Level 1: Foundation
├── Read: 00-START-HERE.md (navigation)
├── Read: mental-model.md (architecture)
└── Decision: What type of task?

Level 2: Task-Specific
├── Component Creation → components/generation.md
├── Implementation Patterns → components/patterns.md
├── API Reference → quick-reference.md
├── Codebase Navigation → codebase-navigation-guide.md
└── Standalone Packages → packages/ API documentation

Level 3: Implementation
├── Grep: Find relevant examples
├── Read: Selected examples
├── Glob: Find related files
└── Read: Implementation details

Level 4: Verification & Refinement
├── Grep: Source code for key terms to find ground truth
├── Read: Specialized guides to cross-reference concepts
└── Synthesize: Refine answer with verified details before responding

### Context Window Management
- **Start with** `00-START-HERE.md` for navigation
- **Load specific documents** based on current task
- **Use cross-references** rather than loading multiple documents
- **Follow prerequisites** to build context efficiently

---

## Task-Based Context Loading

### Component Creation Tasks
**Context:** [`guides/component-generation-instructions.md`](/ai/guides/components/generation.md)
**Supplementary:** [`foundations/quick-reference.md`](/ai/foundations/quick-reference.md) for API syntax

### Architecture Understanding
**Context:** [`foundations/mental-model.md`](/ai/foundations/mental-model.md)
**Supplementary:** [`guides/patterns-cookbook.md`](/ai/guides/components/patterns.md) for implementation

### Debugging/Problem Solving
**Context:** [`foundations/codebase-navigation-guide.md`](/ai/foundations/codebase-navigation-guide.md)
**Supplementary:** Source code files as identified

### Advanced Implementation
**Context:** [`guides/patterns-cookbook.md`](/ai/guides/components/patterns.md)
**Supplementary:** [`packages/`](/ai/packages/) API documentation for specific packages

---

## Information Retrieval Strategy

### Document Types
- **`foundations/`** - Core concepts, no prerequisites
- **`guides/`** - Implementation-focused, may require foundation knowledge
- **`packages/`** - Standalone package API documentation, framework-independent
- **`documentation/`** - Documentation authoring and writing guidelines
- **`workflows/`** - Step-by-step processes for specific tasks
- **`meta/`** - Documentation about documentation

### Cross-Reference Navigation
- Documents link to related content without duplication
- "Related" sections provide context for connecting concepts
- Prerequisites indicate required background knowledge

### Search Patterns
1. **Unknown concepts** → foundations/mental-model.md
2. **Syntax lookup** → foundations/quick-reference.md
3. **Implementation patterns** → guides/ documents
4. **Code location** → foundations/codebase-navigation-guide.md
5. **Standalone package usage** → packages/ API documentation
6. **Step-by-step processes** → workflows/ task-specific procedures
7. **Documentation quality** → documentation/writing/ style guides

---

## AI-Specific Considerations

### Context Optimization
- Documents avoid human-specific concepts (reading time, learning curves)
- Information hierarchy optimized for random access
- Cross-references preserve context without token overhead

### Decision Trees
- Clear conditional logic for document selection
- Task-based entry points
- Minimal context switching between documents

### Anti-Patterns for AI
- ❌ Loading multiple large documents simultaneously
- ❌ Starting with specialized packages before understanding core concepts
- ❌ Ignoring prerequisites in complex guides
- ✅ Following the decision trees in `00-START-HERE.md`
- ✅ Using cross-references to minimize context load
- ✅ Building context incrementally based on task complexity

---

## Maintenance Notes

### Document Updates
- Cross-references updated when files move
- Navigation elements added to new documents
- Decision trees updated for new content

### AI Feedback Integration
- Document structure based on AI agent usage patterns
- Context loading strategies refined based on effectiveness
- Navigation optimized for non-linear access patterns

---

**Last Updated:** Initial organizational structure complete  

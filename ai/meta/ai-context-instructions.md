# AI Agent Context Instructions

> **For:** AI agents working with Semantic UI documentation  
> **Purpose:** Optimize documentation usage for AI-specific workflows  
> **Back to:** [Documentation Hub](../00-START-HERE.md)

---

## Context Loading Optimization

### Document Size Guidelines
- Each document designed for ~8K token context windows
- Cross-references minimize duplication
- Sections tagged with use cases for targeted loading

### Hierarchical Information Access
```
Quick Lookup → foundations/quick-reference.md
Implementation → guides/ documents  
Deep Understanding → foundations/mental-model.md
Specialized Packages → specialized/ documents
```

### Context Window Management
- **Start with** `00-START-HERE.md` for navigation
- **Load specific documents** based on current task
- **Use cross-references** rather than loading multiple documents
- **Follow prerequisites** to build context efficiently

---

## Task-Based Context Loading

### Component Creation Tasks
**Context:** [`guides/component-generation-instructions.md`](../guides/component-generation-instructions.md)  
**Supplementary:** [`foundations/quick-reference.md`](../foundations/quick-reference.md) for API syntax

### Architecture Understanding
**Context:** [`foundations/mental-model.md`](../foundations/mental-model.md)  
**Supplementary:** [`guides/patterns-cookbook.md`](../guides/patterns-cookbook.md) for implementation

### Debugging/Problem Solving
**Context:** [`foundations/codebase-navigation-guide.md`](../foundations/codebase-navigation-guide.md)  
**Supplementary:** Source code files as identified

### Advanced Implementation
**Context:** [`guides/patterns-cookbook.md`](../guides/patterns-cookbook.md)  
**Supplementary:** [`specialized/`](../specialized/) documents for specific packages

---

## Information Retrieval Strategy

### Document Types
- **`foundations/`** - Core concepts, no prerequisites
- **`guides/`** - Implementation-focused, may require foundation knowledge  
- **`specialized/`** - Standalone packages, framework-independent
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
5. **Standalone usage** → specialized/ documents

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
**Next Review:** After observing AI agent usage patterns with new structure
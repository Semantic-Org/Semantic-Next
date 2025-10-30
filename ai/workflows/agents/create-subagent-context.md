# Agent Context Creation Workflow

**Purpose**: Guide for creating specialized agent context files for the Semantic UI multi-agent system  
**Output**: Complete agent context.md file that enables domain-specific expertise  
**Prerequisites**: Understanding of multi-agent architecture and specific domain to be contextualized

## Overview

Agent context files provide specialized expertise for domain or process agents within the Semantic UI multi-agent system. Each context shapes an agent to be an expert advocate for their domain while maintaining the reference-based approach that prevents context contamination.

## Phase 1: Domain Analysis and Foundation

### 1.1 Load Mandatory Foundation Context
**Always start by reading these files:**
```
ai/meta/context-loading-instructions.md    (Agent operational protocol)
ai/00-START-HERE.md                        (Task routing and document discovery)  
ai/foundations/mental-model.md             (Core concepts and terminology)
```

### 1.2 Understand the Multi-Agent Architecture
**Read the architecture documentation:**
```
ai/proposals/task-based-agent-architecture.md   (System overview)
ai/agents/orchestrator.md                       (Orchestration patterns)
ai/agents/input-spec.md                         (Input format)
ai/agents/output-spec.md                        (Output format)
```

### 1.3 Analyze Existing Agent Context Patterns
**Study existing agent contexts to understand patterns:**
```bash
# Use tools to examine existing contexts
Read ai/agents/domain/component/context.md     (Domain agent example)
Read ai/agents/process/testing/context.md      (Process agent example)
Read ai/agents/process/types/context.md        (Cross-domain specialist example)
```

**Key patterns to identify:**
- Agent role definition and argumentative stance
- Specialized context loading sections
- Domain philosophy and core patterns
- Argumentative challenge structures
- Success criteria frameworks
- Domain-specific output examples

### 1.4 Define Agent Scope and Boundaries
**Clarify what the agent DOES and DOES NOT handle:**
- **Primary responsibilities** (what they implement/create)
- **Secondary responsibilities** (what they advise on)
- **Explicit exclusions** (what other agents handle)
- **Argumentative position** (their expertise perspective)

**Example scope definition:**
```
✅ DOES: Author HTML template files, design expression syntax, create control flow
❌ DOES NOT: Implement template compiler, modify templating engine, optimize AST parsing
🤝 COLLABORATES: With component agent on data context, with testing agent on template scenarios
```

## Phase 2: Domain Research and Canonical Source Discovery

### 2.1 Map Canonical Documentation
**Use Task tool for comprehensive domain exploration:**
```javascript
Task({
  description: "Map domain documentation",
  prompt: `Find all canonical documentation for [DOMAIN]. Look for:
  1. API documentation in docs/src/pages/
  2. Usage guides and tutorials
  3. Example implementations in docs/src/examples/
  4. Source code structure in packages/[domain]/
  5. Existing patterns in src/components/
  
  Return organized list of canonical sources with descriptions.`
})
```

### 2.2 Identify Implementation Patterns
**Find real-world usage patterns:**
- **Package source code**: `packages/[domain]/src/` (implementation patterns)
- **Component examples**: `src/components/` (usage patterns)  
- **Documentation examples**: `docs/src/examples/` (canonical patterns)
- **Lesson progressions**: `docs/src/content/lessons/` (learning patterns)

### 2.3 Discover Tool Usage Patterns
**Identify how agents should find information:**
- **Read tool**: For specific files with known paths
- **Glob tool**: For pattern-based file discovery (`**/*.html`, `**/*dropdown*`)
- **Grep tool**: For content-based searches within files
- **Task tool**: For complex, multi-step exploration

### 2.4 Document Reference Hierarchy
**Organize information sources by authority:**
1. **Primary sources**: Official API docs, core implementation
2. **Pattern sources**: Canonical examples, framework components  
3. **Learning sources**: Tutorials, progressive examples
4. **Context sources**: Architecture guides, mental models

## Phase 3: Context Architecture Design

### 3.1 Design Context Loading Strategy
**Create progressive context loading:**
```markdown
### Required Foundation Context
**Load these mandatory documents first:**
1. ai/meta/context-loading-instructions.md
2. ai/00-START-HERE.md  
3. ai/foundations/mental-model.md

### Domain-Specific Context
1. **Primary Documentation**
   - docs/src/pages/[domain]/ - Complete API reference
   - ai/packages/[domain].md - Package-specific guide

2. **Canonical Examples (BEST SOURCE for patterns)**
   - docs/src/examples/[domain]/ - Real usage patterns
   - src/components/ - Framework component examples

3. **Implementation Resources**
   - packages/[domain]/src/ - Core implementation (use Read tool)
   - Use Glob tool for pattern discovery: **/*[domain]*
```

### 3.2 Define Domain Philosophy
**Articulate the domain's core principles:**
- **Primary patterns** the domain follows
- **Key concepts** that drive decisions
- **Design principles** that guide implementation
- **Anti-patterns** to avoid

### 3.3 Create Argumentative Framework
**Define how this agent challenges others:**
```markdown
### Challenge Domain Agents
- **[Other Domain] Agent**: "This conflicts with [domain] patterns"
  - **Response**: "[Domain] perspective and justification"

### Challenge Process Agents  
- **Testing Agent**: "This is difficult to test"
  - **Response**: "[Domain] testing philosophy and approach"
```

## Phase 4: Context File Creation

### 4.1 Follow Standard Context Structure
**Use this template structure:**
```markdown
# [Domain] Implementation Agent Context

> **Agent Role**: [Specific Role Title]
> **Domain**: [Clear domain boundaries]
> **Argumentative Stance**: "[Key question this agent always asks]"

## Core Responsibilities
[5-7 specific responsibilities]

## Specialized Context Loading
[Progressive context loading strategy]

## [Domain] Philosophy
[Core patterns and principles with code examples]

## Argumentative Challenges
[How this agent challenges others]

## Success Criteria
[Measurable quality standards]

## Domain-Specific Output Examples
[Extended output format with domain fields]
```

### 4.2 Reference-First Approach
**Always use references instead of duplication:**
```markdown
❌ WRONG: Inline template syntax examples and API details
✅ CORRECT: "Read docs/src/pages/templates/expressions.mdx for expression syntax"

❌ WRONG: Copy component patterns into context
✅ CORRECT: "Study docs/src/examples/component/minimal/ for basic patterns"

❌ WRONG: Repeat information from other guides  
✅ CORRECT: "Use ai/guides/html/style-guide.md and ai/guides/styling/css-guide.md for markup and styling conventions"
```

### 4.3 Tool Integration Instructions
**Specify how agents should discover information:**
```markdown
- **Finding Examples**: Use Glob tool with `docs/src/examples/**/*[domain]*`
- **Source Analysis**: Use Read tool on `packages/[domain]/src/` files
- **Pattern Discovery**: Use Task tool for complex exploration
- **Code Search**: Use Grep tool for specific implementation patterns
```

### 4.4 Domain-Specific Output Extensions
**Extend the standard output format:**
```javascript
"handoff_context": {
  "for_next_agent": "Standard handoff information",
  "concerns": ["Standard concerns array"],
  "recommendations": ["Standard recommendations"],
  "for_[specific]_agent": {
    "[domain]_specific_field": "Domain-relevant information",
    "[requirements]": ["What this agent needs"],
    "[context]": ["Domain-specific context"]
  }
}
```

## Phase 5: Validation and Integration

### 5.1 Create Supporting Files
**Required files for agent integration:**
- [ ] **context.md** - Main agent expertise and patterns
- [ ] **role.md** - Brief capability summary for orchestrator
- [ ] **settings.json** - Tool permissions and file access patterns

**role.md format:**
```markdown
**Agent Identifier**: [domain]_implementation_agent

**Domain**: [Brief domain description]

**Capabilities**: [Concise list of what this agent can do]
```

**settings.json format:**
```json
{
  "permissions": {
    "allow": [
      "Read(packages/[domain]/**)",
      "Edit(packages/[domain]/src/**)",
      "Edit(packages/[domain]/test/**)",
      "Write(packages/[domain]/src/**)",
      "Write(packages/[domain]/test/**)",
      "MultiEdit(packages/[domain]/src/**)",
      "MultiEdit(packages/[domain]/test/**)",
      "Read(docs/src/examples/[domain]/**)",
      "Edit(docs/src/examples/[domain]/**)",
      "Write(docs/src/examples/[domain]/**)",
      "MultiEdit(docs/src/examples/[domain]/**)",
      "Read(docs/src/pages/api/[domain]/**)",
      "Read(docs/src/pages/[domain]/**)",
      "Read(ai/packages/[domain].md)",
      "Read(ai/packages/[domain].md)"
    ],
    "deny": [],
    "additionalDirectories": [],
    "defaultMode": "default"
  }
}
```

### 5.2 Validate Against Existing Patterns
**Check consistency with existing agent contexts:**
- [ ] **Structure consistency**: Follows established template format
- [ ] **Reference approach**: Uses canonical sources, not duplication
- [ ] **Argumentative clarity**: Clear stance and challenge framework
- [ ] **Tool integration**: Proper use of Read/Glob/Task instructions

### 5.3 Test Context Completeness
**Verify the context enables expertise:**
- [ ] Agent can find all necessary documentation
- [ ] Clear boundaries between this and other agents
- [ ] Specific argumentative position for productive conflicts
- [ ] Complete success criteria for quality measurement
- [ ] Domain-specific output format for handoffs

### 5.4 Integration with Multi-Agent System
**Ensure proper system integration:**
- [ ] Context file location: `ai/agents/domain/[name]/context.md` or `ai/agents/process/[name]/context.md`
- [ ] Corresponding role.md file for orchestrator planning
- [ ] Agent identifier matches input-spec.md naming conventions
- [ ] Output format extensions documented in context
- [ ] Settings.json provides appropriate file access permissions

### 5.5 Verification Steps
**Final validation checklist:**
- [ ] Agent identifier appears in `ai/agents/input-spec.md`
- [ ] All referenced documentation files exist and are accessible
- [ ] Context loading strategy is complete and follows patterns
- [ ] Argumentative challenges are domain-specific and meaningful
- [ ] Success criteria are measurable and relevant
- [ ] Domain-specific output examples match actual needs

## Key Principles

### 1. **Reference-Based Context Shaping**
Always point to canonical sources rather than duplicating content. Agents have full tool access to read documentation and explore code.

### 2. **Progressive Context Loading**
Start with foundation, then layer domain-specific context based on task requirements. Avoid context contamination.

### 3. **Argumentative Expertise**
Each agent should have a clear perspective they argue from, creating productive conflicts that improve overall quality.

### 4. **Tool-Enabled Discovery**
Design contexts that teach agents HOW to find information using available tools, not just WHAT information they need.

### 5. **AI-Procedural Instruction Design**
Write instructions for AI agents, not humans. Use algorithmic decision trees rather than cautionary narratives.

### 6. **Domain Boundary Clarity**
Clear separation between what this agent handles versus what other agents handle prevents overlap and confusion.

### 7. **Quality-Focused Success Criteria**
Measurable criteria enable other agents to evaluate this agent's work and provide meaningful feedback.

## AI-Procedural Instruction Design Patterns

### ✅ Effective AI Instructions
```markdown
**FORMAT**: [Action] + [Target Audience] + [Cognitive Approach] + [Output Format]

**INSTEAD OF** (Human-oriented):
"Be careful not to remove technical terminology - previous agents made mistakes"

**USE** (AI-procedural):
"IF removing adverbs describing implementation → QUERY user for confirmation"

**PATTERN TEMPLATE**:
- **IF** [condition] → **THEN** [action]
- **PROCEDURE**: [step-by-step process]
- **PATTERN**: [generalizable rule]
- **CHECK**: [validation step]
```

### ✅ Decision Tree Format
```markdown
### Validation Protocol
1. **SCAN** content for [specific pattern]
2. **IF** pattern detected → **HALT** and flag for review
3. **IF** uncertain → **PRESERVE** original and note concern
4. **VERIFY** final output maintains [specific requirement]
```

### ❌ Avoid Human-Emotional Language
- "Be careful" → Use "VERIFY"
- "Previous agents learned" → Use "PROCEDURE"
- "It's important to" → Use "MUST" or "REQUIRED"
- "Try to avoid" → Use "IF X → DO Y"

## Common Anti-Patterns to Avoid

### ❌ Context Contamination
- Duplicating information available in canonical sources
- Including irrelevant domain information "just in case"
- Copying patterns from other agent contexts without adaptation

### ❌ Scope Creep
- Making agent responsible for too many different concerns
- Unclear boundaries with other agents
- Trying to be expert in everything rather than specialized

### ❌ Static Information
- Hardcoding API examples that might change
- Including implementation details that belong in source code
- Providing outdated patterns instead of references to current docs

### ❌ Weak Argumentative Position
- Generic challenges that any agent could make
- No clear domain expertise perspective
- Avoiding productive conflicts that improve quality

## Success Metrics

A successful agent context enables:
1. **Domain Expertise**: Agent can handle complex domain-specific tasks
2. **Productive Arguments**: Agent challenges others from specialized perspective
3. **Efficient Discovery**: Agent knows where to find needed information
4. **Quality Advocacy**: Agent maintains domain standards and best practices
5. **Clear Handoffs**: Agent provides domain-specific context to other agents

This workflow ensures consistent, high-quality agent contexts that enable the multi-agent system to handle complex development workflows with appropriate domain expertise and quality assurance.

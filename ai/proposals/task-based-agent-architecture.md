# Task-Based Agent Architecture for Semantic UI

## Overview

This document describes the multi-agent system architecture implemented for the Semantic UI codebase using Claude's native Task tool instead of custom MCP tooling. The system addresses the need for specialized domain expertise while maintaining coordination across complex development workflows.

## Architecture Summary

### Core Components

1. **Orchestrator Agent** - Coordinates workflow and routes tasks between specialists
2. **Domain Agents** - Deep expertise in specific packages (Component, Query, etc.)
3. **Process Agents** - Cross-domain quality specialists (Testing, Types, Documentation, etc.)
4. **Structured Communication** - Standardized input/output formats and question routing

### Key Files

- `/ai/agents/orchestrator.md` - Orchestrator coordination instructions
- `/ai/agents/input-spec.md` - Agent input format specification
- `/ai/agents/output-spec.md` - Agent output format specification  
- `/ai/agents/question-answering-spec.md` - Question routing format specification
- `/ai/agents/{domain|process}/{agent}/context.md` - Agent expertise and patterns
- `/ai/agents/{domain|process}/{agent}/role.md` - Agent capability summaries for orchestrator

## System Purpose

### Problems Solved

1. **Context Dilution** - Single agents cannot maintain deep expertise across all domains simultaneously
2. **Pattern Conflicts** - Different packages have conflicting conventions that require specialized knowledge
3. **Quality Consistency** - Need systematic coverage of testing, types, documentation across all work
4. **Coordination Overhead** - Complex workflows require systematic handoffs and context accumulation

### Benefits Achieved

- **Deep Domain Expertise** - Each agent maintains specialized knowledge in their area
- **Productive Conflict Resolution** - Agents challenge each other from their specialized perspectives
- **Systematic Quality** - Process agents ensure consistent standards across all domains
- **Context Efficiency** - Specialized contexts reduce cognitive load per agent
- **Scalable Architecture** - New agents can be added for new domains or quality concerns

## Technical Implementation

### Task Tool Invocation Pattern

Instead of custom MCP tools, the system uses Claude's native Task tool with structured prompts:

```javascript
Task({
  description: "Agent type work",
  prompt: `AGENT ROLE: agent_identifier
CURRENT TASK: [specific work]
ACCUMULATED CONTEXT: [previous agent outputs]
ANSWERED QUESTIONS: [resolved Q&A]
MANDATORY STEPS:
1. Read context: /path/to/agent/context.md
2. Read output spec: /path/to/output-spec.md
3. Execute task following specifications`
})
```

### Communication Protocol

**Sequential Context Accumulation:**
- Each agent receives full context from previous agents
- Agent outputs are accumulated in structured JSON
- Questions are routed between agents or to users
- Answers are collected and passed forward

**Structured Agent Response:**
```json
{
  "status": "complete|needs_input|blocked",
  "deliverables": { "files_changed": [], "summary": "..." },
  "handoff_context": { "for_next_agent": "...", "concerns": [], "recommendations": [] },
  "questions": [{ "for_agent": "...", "question": "...", "type": "..." }]
}
```

### Question Routing System

**Agent-to-Agent Questions:**
- Agent returns `status: "needs_input"` with questions
- Orchestrator routes questions to appropriate specialist agents
- Answers are collected and passed back to original agent
- Original agent continues with resolved questions

**Question Types:**
- `multiple_choice` - Discrete implementation approaches
- `yes_no` - Binary decisions or confirmations  
- `free_form` - Open-ended explanations

## Agent Specializations

### Domain Agents
- **Component Implementation Agent** - Web component lifecycle, Shadow DOM, reactivity integration
- **Query Implementation Agent** - DOM manipulation, traversal, chaining patterns
- **Templating Implementation Agent** - AST compilation, expression evaluation
- **Reactivity Implementation Agent** - Signals, reactions, dependency tracking
- **Utils Implementation Agent** - Utility functions, performance optimization

### Process Agents
- **Testing Agent** - Quality assurance, edge case coverage across ALL packages
- **Types Agent** - TypeScript definitions, developer experience across ALL packages
- **Documentation Agent** - API docs, examples, user guides across ALL packages
- **Integration Agent** - System coherence, cross-package compatibility
- **Releasing Agent** - Version management, branching, commit messages, release notes
- **Build Tools Agent** - Build processes, internal packages, npm scripts

## Workflow Patterns

### Typical Implementation Flow
1. **Domain Agent** (Component/Query/etc.) - Implements core functionality
2. **Testing Agent** - Creates comprehensive test coverage
3. **Types Agent** - Adds TypeScript definitions
4. **Documentation Agent** - Creates user-facing documentation
5. **Integration Agent** - Verifies system coherence
6. **Releasing Agent** - Prepares for release

### Question Resolution Flow
1. Agent encounters decision point requiring other expertise
2. Agent returns `needs_input` status with structured questions
3. Orchestrator routes questions to appropriate specialist agents
4. Specialist agents provide answers based on their expertise
5. Answers are accumulated and passed back to original agent
6. Original agent continues with resolved information

## Context Management

### Context Shaping Strategy
- **Orchestrator** has full context window with complete workflow state
- **Individual Agents** receive curated context relevant to their task
- **Question Answering** uses minimal context focused on answering the specific question
- **Context Accumulation** builds structured knowledge as workflow progresses

### Anti-Patterns Avoided
- **Context Contamination** - Generic specs avoid domain-specific examples
- **Context Creep** - Question routing includes only relevant information
- **Context Duplication** - Agents load their own specialized context files
- **Context Confusion** - Clear separation between task execution and question answering modes

## Mercier's Argumentative Theory Integration

The system implements Mercier's Argumentative Theory through productive conflicts:

**Domain vs Domain Conflicts:**
- Component Agent: "This should follow component lifecycle patterns"
- Query Agent: "But this breaks Query chaining conventions"

**Process vs Domain Conflicts:**
- Types Agent: "This API signature confuses TypeScript users"
- Component Agent: "But this is how component architecture works"

**Resolution Mechanism:**
- Conflicts surface through the question routing system
- Specialist agents provide expert perspectives
- Integration Agent resolves conflicts for system coherence
- Final decisions consider all stakeholder perspectives

## Comparison to MCP Approach

### Why Task Tool Instead of MCP

**MCP Limitations:**
- Tool passthrough restrictions in `claude mcp serve`
- Complex setup and configuration requirements
- Additional infrastructure dependencies

**Task Tool Benefits:**
- Uses Claude's native capabilities
- Simpler implementation and maintenance
- More flexible context passing
- Direct integration with existing Claude Code workflows

### Migration Path

The architecture was designed to be implementation-agnostic. The same agent specializations, communication protocols, and workflow patterns could be implemented using:
- Native Task tool (current implementation)
- Custom MCP tools (if limitations are resolved)
- Other agent coordination systems

## Future Extensions

### Adding New Agents
1. Create `/ai/agents/{domain|process}/{new-agent}/` directory
2. Write `context.md` with specialized expertise
3. Write `role.md` with capability summary
4. Add agent identifier to orchestrator documentation
5. Define typical workflow integration points

### Adding New Quality Concerns
Process agents can be added for new cross-cutting concerns:
- Security Agent - Security review across all packages
- Performance Agent - Performance optimization across all domains
- Accessibility Agent - A11y compliance across all components

### Workflow Customization
Different types of work may require different agent sequences:
- **Bug Fixes**: Domain Agent → Testing Agent → Integration Agent
- **New Features**: Domain Agent → Testing Agent → Types Agent → Documentation Agent → Integration Agent
- **Refactoring**: Domain Agent → Testing Agent → Integration Agent

This architecture provides a systematic, scalable approach to managing complex development workflows while maintaining deep domain expertise and systematic quality assurance.
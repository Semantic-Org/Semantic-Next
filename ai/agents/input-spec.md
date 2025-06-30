# Agent Input Specification

Input format for Semantic UI agents:

## Input Structure

Agents receive their input as a structured prompt containing:

```
AGENT ROLE: [Agent Name]
MANDATORY: DO NOT PROCEED until you Read:
- ai/agents/shared-context.md
- ai/agents/[domain|process]/[agent_name]/context.md 
- Complete ALL mandatory context loading instructions listed there
WORKFLOW POSITION: [Position in sequence, e.g., "3 of 5"]

CURRENT TASK:
[Specific task description]

ACCUMULATED CONTEXT:
[JSON object with all previous agent outputs]

ANSWERED QUESTIONS:
[Array of previously answered questions with responses]

WORKFLOW STATUS:
[Current state of the overall workflow]
```

## Detailed Sections

### AGENT ROLE
Identifies which agent is being invoked using consistent snake_case identifiers:
- Example: `AGENT ROLE: component_implementation_agent`
- Used to load the correct context.md file
- Must match the agent identifiers used in question routing

Valid agent identifiers: See [agent-list.md](./agent-list.md) for complete list of agent identifiers and their folder locations.

### WORKFLOW POSITION
Helps agent understand their place in the sequence:
- Example: `WORKFLOW POSITION: 2 of 6 (after Agent A, before Agent B)`
- Provides awareness of what came before and what comes next

### CURRENT TASK
The specific work this agent should perform. This can be either:

**A. Primary workflow task:**
```
CURRENT TASK:
Implement the new feature X that handles operation Y according to the specified requirements. The feature should support both scenario A and scenario B.
```

**B. Question answering task:**
```
CURRENT TASK:
[QUESTION FROM: some_agent]
Please answer the following question based on your expertise:

Question: Which approach should we use for implementing feature X?
Type: multiple_choice
Options:
1. Approach A with benefit X
2. Approach B with benefit Y
3. Alternative method C
4. Different strategy entirely

Context: Feature X needs to handle both use case A and use case B effectively.
```

### ACCUMULATED CONTEXT
JSON object containing complete outputs from all previous agents (excluding agents invoked only for questions):
```json
{
  "agent_a": {
    "status": "complete",
    "deliverables": {
      "files_changed": ["src/module-a.js"],
      "files_created": [],
      "files_deleted": [],
      "summary": "Added feature X to module A"
    },
    "handoff_context": {
      "for_next_agent": "Feature X uses pattern Y for extensibility",
      "concerns": ["Performance optimization needs consideration"],
      "recommendations": ["Consider caching strategy"]
    },
    "questions": []
  },
  "agent_b": {
    "status": "needs_input",
    "deliverables": {
      "files_changed": [],
      "files_created": ["src/helper.js"],
      "files_deleted": [],
      "summary": "Created helper structure for feature Y"
    },
    "handoff_context": {
      "for_next_agent": "Basic structure in place, awaiting design decision",
      "concerns": ["API consistency with existing patterns"],
      "recommendations": ["Follow established conventions"]
    },
    "questions": [
      {
        "for_user": true,
        "question": "Should feature Y support advanced mode?",
        "type": "yes_no",
        "context": "Advanced mode is more flexible but impacts simplicity"
      }
    ]
  }
}
```

### ANSWERED QUESTIONS
Resolution of any questions from previous iterations:
```json
[
  {
    "from_agent": "agent_b",
    "question": "Should feature Y support advanced mode?",
    "type": "yes_no",
    "answer": "no",
    "answered_by": "user",
    "context": "Advanced mode is more flexible but impacts simplicity",
    "rationale": "Keep it simple for better user experience"
  },
  {
    "from_agent": "agent_a", 
    "question": "How should we handle data management?",
    "type": "multiple_choice",
    "options": [
      "Approach A with automatic handling",
      "Approach B with manual control",
      "Approach C with event-based system",
      "Approach D with minimal overhead"
    ],
    "answer": "Approach C with event-based system",
    "answered_by": "agent_c",
    "context": "This affects all modules that need to manage state",
    "rationale": "Maintains separation of concerns and allows flexible backends"
  }
]
```

### WORKFLOW STATUS
High-level workflow state:
```
WORKFLOW STATUS:
- Overall Goal: Add data() method to Query package
- Progress: 2 of 6 agents completed
- Blocking Issues: None
- Next Steps: Complete Query implementation, then Testing agent
```

## Agent Processing Instructions

When an agent receives input, they should:

1. **Parse the structured input** to understand their task and context
2. **Load their specialized context** from their context.md file
3. **Load the output specification** from output-spec.md
4. **Review accumulated context** to understand previous decisions
5. **Consider answered questions** to avoid re-asking resolved issues
6. **Execute their specialized task** based on all available information
7. **Return structured output** per the output specification

## Response Format When Answering Questions

When an agent is invoked to answer a question (not perform a workflow task), they should return a simplified response:

```json
{
  "status": "complete",
  "deliverables": {
    "files_changed": [],
    "files_created": [],
    "files_deleted": [],
    "summary": "Answered question about TypeScript approach"
  },
  "handoff_context": {
    "for_next_agent": "Recommended method overloads for better developer experience",
    "concerns": [],
    "recommendations": ["Use overloads for get/set operations"]
  },
  "questions": [],
  "answer": {
    "selected": "Method overloads for better IntelliSense",
    "rationale": "Provides better IDE support and clearer API contract"
  }
}
```

## Example Complete Input

```
AGENT ROLE: testing_agent
MANDATORY: DO NOT PROCEED until you Read:
- ai/agents/shared-context.md
- ai/agents/process/testing/context.md 
- Complete ALL mandatory context loading instructions listed there
WORKFLOW POSITION: 3 of 6 (after query_implementation_agent, before types_agent)

CURRENT TASK:
Create comprehensive tests for the new Query.data() method implementation, ensuring coverage of single elements, collections, and edge cases.

ACCUMULATED CONTEXT:
{
  "component_implementation_agent": {
    "status": "complete",
    "deliverables": {
      "files_changed": ["packages/component/src/component.js"],
      "summary": "Added data property to component instances"
    }
  },
  "query_implementation_agent": {
    "status": "complete",
    "deliverables": {
      "files_changed": ["packages/query/src/query.js"],
      "files_created": ["packages/query/src/data-handler.js"],
      "summary": "Implemented Query.data() with get/set functionality"
    },
    "handoff_context": {
      "for_next_agent": "data() method uses defineProperty for reactivity. Supports chaining.",
      "concerns": ["Performance with large collections needs testing"],
      "recommendations": ["Test with 1000+ elements", "Verify memory cleanup"]
    }
  }
}

ANSWERED QUESTIONS:
[
  {
    "from_agent": "query_implementation_agent",
    "question": "Should data() method support deep object merging?",
    "type": "yes_no", 
    "answer": "no",
    "answered_by": "user"
  }
]

WORKFLOW STATUS:
- Overall Goal: Add data() method to Query package
- Progress: Implementation complete, testing phase
- Blocking Issues: None
- Next Steps: Tests, then TypeScript definitions
```

## Important Notes

1. **Fresh Context**: Each agent starts fresh - they don't retain memory from previous invocations
2. **Complete Information**: All relevant decisions and context must be in the input
3. **Question History**: Include all Q&A to prevent redundant questions
4. **Workflow Awareness**: Agents should understand their role in the larger process
5. **Task Clarity**: The current task should be specific and actionable

This specification ensures consistent communication to agents and enables them to work effectively despite starting with fresh contexts each time.
# Agent Output Specification

Required JSON response format for all Semantic UI agents:

## Schema

```json
{
  "status": "complete|needs_input|blocked",
  "deliverables": {
    "files_changed": ["path/to/file.js"],
    "files_created": ["path/to/new-file.js"],
    "files_deleted": ["path/to/removed-file.js"],
    "summary": "Brief description of work completed"
  },
  "handoff_context": {
    "for_next_agent": "Key information the next agent needs to know",
    "concerns": ["List of concerns or issues identified"],
    "recommendations": ["Suggested approaches or considerations"],
  },
  "questions": [
    {
      "for_agent": "agent_name",
      "question": "Specific question for another agent",
      "type": "free_form"
    },
    {
      "for_user": true,
      "question": "Question that requires user input",
      "type": "multiple_choice|yes_no|free_form",
      "options": ["For multiple_choice: array of options"],
      "context": "Additional context to help answer the question"
    }
  ]
}
```

## Fields

**status** (required): "complete" | "needs_input" | "blocked"

**deliverables** (required):
- files_changed: string[]
- files_created: string[]
- files_deleted: string[]
- summary: string

**handoff_context** (required):
- for_next_agent: string
- concerns: string[]
- recommendations: string[]
- [custom fields as documented in agent context.md]

**questions** (required when status="needs_input"):
- for_agent: agent_identifier | undefined
- for_user: boolean | undefined
- question: string
- type: "multiple_choice" | "yes_no" | "free_form"
- options: string[] (required for multiple_choice)
- context: string (optional)

## Requirements

**complete**: questions=[], all deliverables fields populated
**needs_input**: questions.length >= 1
**blocked**: concerns must explain blocking issue

## Examples

### Complete Status
```json
{
  "status": "complete",
  "deliverables": {
    "files_changed": ["packages/query/src/query.js"],
    "files_created": [],
    "files_deleted": [],
    "summary": "Implemented Query.data() method with getter/setter pattern"
  },
  "handoff_context": {
    "for_next_agent": "Added Query.data() using defineProperty for reactive updates. Method supports both single and multiple element selections.",
    "concerns": ["Performance with large datasets needs testing"],
    "recommendations": ["Consider adding caching for repeated data access"]
  },
  "questions": []
}
```

### Needs Input Status
```json
{
  "status": "needs_input",
  "deliverables": {
    "files_changed": [],
    "files_created": ["packages/component/src/helpers/data-manager.js"],
    "files_deleted": [],
    "summary": "Created data management helper structure"
  },
  "handoff_context": {
    "for_next_agent": "Partial implementation complete, awaiting API design decision",
    "concerns": ["Reactive data updates conflict with TypeScript inference"],
    "recommendations": ["Could use proxy pattern or getter/setter approach"]
  },
  "questions": [
    {
      "for_agent": "some_agent",
      "question": "How should we handle this technical decision?",
      "type": "multiple_choice",
      "options": [
        "Approach A with benefit X",
        "Approach B with benefit Y",
        "Alternative approach C",
        "Different strategy entirely"
      ]
    },
    {
      "for_user": true,
      "question": "Should we proceed with this approach?",
      "type": "yes_no",
      "context": "This decision impacts the overall architecture"
    }
  ]
}
```

### Blocked Status
```json
{
  "status": "blocked",
  "deliverables": {
    "files_changed": [],
    "files_created": [],
    "files_deleted": [],
    "summary": "Unable to proceed with implementation"
  },
  "handoff_context": {
    "for_next_agent": "Discovered fundamental architecture conflict",
    "concerns": ["Requested pattern violates Shadow DOM encapsulation principles"],
    "recommendations": ["Need to reconsider approach or modify requirements"]
  },
  "questions": [
    {
      "for_user": true,
      "question": "Should we proceed with this approach despite the architectural concerns?",
      "type": "yes_no",
      "context": "This approach conflicts with established framework principles"
    }
  ]
}
```

## Question Type Examples

### Multiple Choice Questions
Use when there are discrete approaches to choose between:
```json
{
  "for_agent": "relevant_agent",
  "question": "Which implementation approach should we use?",
  "type": "multiple_choice",
  "options": [
    "Option A with trade-off X",
    "Option B with trade-off Y",
    "Alternative approach C",
    "Different strategy entirely"
  ],
  "context": "This affects the overall system architecture"
}
```

### Yes/No Questions
Use for binary decisions or confirmations:
```json
{
  "for_user": true,
  "question": "Should we proceed with this implementation approach?",
  "type": "yes_no",
  "context": "This decision has downstream implications"
}
```

### Free Form Questions
Use when the answer requires explanation or is open-ended:
```json
{
  "for_agent": "relevant_agent",
  "question": "How should we handle this technical challenge?",
  "type": "free_form",
  "context": "Current approach has performance and compatibility concerns"
}
```

## Output Formatting

Agents must return their response as a JSON code block:

```
```json
{
  "status": "complete",
  ...
}
```
```

This ensures the orchestrator can reliably parse the response.

## Important Notes

1. **Always include all required fields** - Use empty arrays/strings rather than omitting fields
2. **Be specific in questions** - Include context so the recipient can answer effectively
3. **Use agent names from the system** - Refer to agents by their exact names (e.g., "component_implementation_agent")
4. **Keep summaries concise** - 1-2 sentences maximum
5. **Preserve partial work** - Even when blocked, include any analysis or code written
6. **Domain-specific fields** - Add relevant fields to handoff_context as documented in your agent's context.md

This specification ensures consistent communication between agents and enables reliable orchestration of complex workflows.

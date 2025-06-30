# Agent Question-Answering Specification

Format for agents answering questions from other agents.

## Question Input Format

When an agent is invoked to answer a question, they receive:

```
AGENT ROLE: [agent_identifier]
MODE: QUESTION_ANSWERING

QUESTION FROM: [asking_agent_identifier]

Question: [The specific question text]
Type: multiple_choice|yes_no|free_form
Options: [For multiple_choice only]
1. [Option 1]
2. [Option 2]
3. [Option 3]
4. [Option 4]

Question Context: [Context provided by asking agent]

RELEVANT CONTEXT:
[Orchestrator-curated context specifically needed to answer this question]
```

## Question Output Format

Agents answering questions return a simplified JSON structure:

```json
{
  "mode": "question_answer",
  "answer": {
    "selected": "For multiple_choice: the exact option text chosen",
    "value": "For yes_no: 'yes' or 'no', for free_form: the text answer",
    "rationale": "Explanation for the choice based on expertise"
  },
  "additional_recommendations": [
    "Optional specific implementation guidance",
    "Optional warnings or considerations"
  ]
}
```

## Context Shaping Guidelines

The orchestrator should include in RELEVANT CONTEXT only:
- Specific technical constraints mentioned in accumulated context
- Existing patterns from the same package/domain
- Direct dependencies that affect the answer
- Configuration or environment details if relevant

The orchestrator should NOT include:
- Full accumulated context from all agents
- Unrelated implementation details
- Context from other packages unless directly relevant
- Historical decisions unless they constrain this choice

## Examples

### Multiple Choice Question

**Input format:**
```
AGENT ROLE: [agent_identifier]
MODE: QUESTION_ANSWERING

QUESTION FROM: [asking_agent_identifier]

Question: [The question text]
Type: multiple_choice
Options:
1. [Option 1]
2. [Option 2]
3. [Option 3]
4. [Option 4]

Question Context: [Context from the asking agent]

RELEVANT CONTEXT:
[Orchestrator-curated context for answering this question]
```

**Output format:**
```json
{
  "mode": "question_answer",
  "answer": {
    "selected": "[The exact option text chosen]",
    "rationale": "[The rationale for choosing this answer]"
  },
  "additional_recommendations": [
    "[Optional specific guidance]",
    "[Optional warnings or considerations]"
  ]
}
```

### Yes/No Question

**Input format:**
```
AGENT ROLE: [agent_identifier]
MODE: QUESTION_ANSWERING

QUESTION FROM: [asking_agent_identifier]

Question: [The yes/no question text]
Type: yes_no

Question Context: [Context from the asking agent]

RELEVANT CONTEXT:
[Orchestrator-curated context for answering this question]
```

**Output format:**
```json
{
  "mode": "question_answer",
  "answer": {
    "value": "yes|no",
    "rationale": "[The rationale for this yes/no choice]"
  },
  "additional_recommendations": [
    "[Optional specific guidance]",
    "[Optional warnings or considerations]"
  ]
}
```

### Free Form Question

**Input format:**
```
AGENT ROLE: [agent_identifier]
MODE: QUESTION_ANSWERING

QUESTION FROM: [asking_agent_identifier]

Question: [The open-ended question text]
Type: free_form

Question Context: [Context from the asking agent]

RELEVANT CONTEXT:
[Orchestrator-curated context for answering this question]
```

**Output format:**
```json
{
  "mode": "question_answer", 
  "answer": {
    "value": "[The free-form answer text]",
    "rationale": "[The rationale for this approach/answer]"
  },
  "additional_recommendations": [
    "[Optional specific guidance]",
    "[Optional warnings or considerations]"
  ]
}
```

## Important Notes

1. **Mode Distinction**: The `mode: "question_answer"` field clearly distinguishes Q&A from task execution
2. **No State Accumulation**: Q&A responses don't add to accumulated context
3. **Focused Responses**: No deliverables, handoff_context, or status fields needed
4. **Context Efficiency**: Orchestrator must curate minimal relevant context
5. **Clear Attribution**: Always indicate which agent asked the question

This specification ensures efficient, focused communication for inter-agent questions while preventing context bloat.
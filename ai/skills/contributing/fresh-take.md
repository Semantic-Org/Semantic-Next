---
title: Fresh Take — Context-Pruned Subagent Delegation
description: How to distill a deep conversation into a bias-free problem brief and delegate to a fresh subagent. Covers separating problem knowledge from solution momentum, structuring evaluation documents, choosing consultation lenses, and presenting results without reconciliation bias.
keywords: [subagent, fresh perspective, context pruning, isolation, delegation, second opinion, evaluation, bias-free]
audience: contributing
skill: fresh-take
type: skill
---

# Fresh Take — Context-Pruned Subagent Delegation

> **Skill:** `fresh-take`
> **Purpose:** Distill conversation context into a bias-free problem brief and delegate to a fresh subagent for independent evaluation

---

## Why This Exists

Deep conversations build two things simultaneously: **problem knowledge** and **solution momentum**. Problem knowledge is valuable — constraints discovered, edge cases surfaced, invariants identified. Solution momentum is dangerous when seeking a fresh perspective — it's the gravitational pull of the direction you've been heading.

The naive approach of summarizing the conversation for a subagent carries both. The subagent ends up exploring the same neighborhood you're already in, which defeats the purpose of asking. The value of a fresh take comes precisely from the agent arriving at the problem without your trajectory.

This skill guides the extraction of the former while isolating the latter.

---

## The Two Categories

### Problem Knowledge (Transfer This)

These are facts about the problem space that are true regardless of solution approach:

- **Architecture** — How the relevant systems work, described as facts
- **Constraints** — Hard limits discovered through exploration
- **Symptoms** — Observable behaviors that define the problem
- **Invariants** — Properties that any correct solution must preserve
- **Technical context** — Relevant code, APIs, data structures, file paths
- **Success criteria** — How you'd know a solution is correct

### Solution Momentum (Isolate This)

These are artifacts of the direction you've been heading:

- **Approaches tried** — Specific strategies explored or considered
- **Current hypothesis** — What you think the answer might be
- **Implementation details** — Code written toward a solution
- **Diagnoses** — "The issue is probably..." framing
- **Emotional narrative** — "We're close to...", "This almost works..."
- **Narrowing language** — "The trick is probably...", "We just need to..."

### The Tricky Middle Ground

Failed attempts often *reveal* constraints. The constraint is what matters, not the attempt:

```
❌ "We tried memoization and it didn't work because AST nodes are mutable"
   → Biases against memoization specifically

✅ "AST nodes are mutable — identity changes across render passes"
   → Transfers the constraint, leaves solution space open

❌ "The hash-based cache key collides when the same snippet is invoked twice"
   → Reveals your caching approach

✅ "The same AST subtree can appear at multiple call sites with different data contexts"
   → Transfers the structural fact about the problem
```

The test: could a reader reconstruct your specific approach from this sentence? If yes, rephrase as the underlying fact.

---

## Context Contamination

Isolation must be **structural**, not **instructional**. You cannot tell an agent to ignore something it has already read. Once information enters the context window, it influences generation — period. This is the single most common way a fresh take gets compromised.

### Negative Framing Does Not Work

The instinct is to give the agent more context with guardrails: "Read `renderer.js` to understand the architecture, but DO NOT follow the caching approach you see there." This fails every time. The agent has now seen the caching approach. It will gravitate toward it, react against it, or define its thinking in relation to it. All three outcomes are contamination.

```
❌ "Read renderer.js but ignore the renderTrees cache implementation"
   → The agent now knows there's a cache called renderTrees and will
     orbit around that whether it intends to or not

❌ "Look at the current solution for structural context but propose
    your own approach independently"
   → "Independently" means nothing once the current solution is loaded

❌ "Here's what we tried [detailed description]. Now forget that and
    think from scratch."
   → The agent cannot forget. The description is in its context window
     and will anchor its reasoning.
```

There is no phrasing, emphasis, or instruction that undoes having read something. If the agent shouldn't be influenced by it, the agent shouldn't see it.

### Structural Strategies

**Use a clean file state.** If your in-progress solution has modified source files the agent needs to read, those modifications ARE your solution. The agent reading "the current code" is reading your approach. Stash or use a git worktree so the agent sees the pre-modification state:

```bash
# Option 1: Stash before launching the agent
git stash
# ... launch agent, let it read files ...
git stash pop

# Option 2: Use the Agent tool's worktree isolation
# The agent gets a clean copy at the base branch state
Agent(isolation: "worktree", ...)
```

**Separate the problem files from the solution files.** If you've written new code as part of your approach (a new cache module, a helper function), don't list those files in the brief. They are artifacts of your direction. The agent needs the files that *define the problem space* — the existing architecture, the code that exhibits the symptoms.

**Don't include your evaluation document's answers.** If you've already written analysis alongside the brief (notes, hypotheses, a plan document), keep those out of the agent's file list. The brief poses questions; the agent should never see your answers to those questions.

### The "Cheat to the Test" Problem

Agents are sophisticated pattern matchers. If they can see any artifact of your solution — even indirectly — they will converge toward it. This isn't dishonesty; it's how inference works. Your solution attempt is evidence about the problem structure, and the agent will use that evidence whether you tell it to or not.

Common leaks:
- **Modified source files** — Your changes are visible in the code the agent reads
- **Workspace files** — Plans, notes, or scratch files in `ai/workspace/` that describe your approach
- **Branch names or commit messages** — `feat/cache-subtrees` tells the agent what direction you went
- **The brief itself** — If the brief's structure mirrors your solution's structure, the framing leaks the approach

The goal is a clean room. The agent should encounter the problem the way someone would if they'd just been handed the codebase and told "here's what's broken."

---

## The Brief Structure

The evaluation document is the core artifact. It should be self-contained — the subagent reads this and the source files, nothing else.

### Template

```markdown
## Task: [Neutral framing of what's being evaluated]

[One line of meta-instruction: read files before answering, evaluate current state]

### Architecture Overview
[How the relevant systems work — facts only, no opinions]

### [Key Mechanism 1]
[Deeper explanation of the subsystem most relevant to the problem]

### [Key Mechanism 2]
[Additional subsystem context if needed]

### Concrete Problems
1. [Symptom described observationally, not diagnostically]
2. [Another symptom]
3. [Another symptom]

### Questions — Evaluate Independently
**Question 1:** [Open-ended, invites investigation not confirmation]
**Question 2:** [Another angle on the problem]
**Question 3:** [Another angle]

### Source Files to Read
- `path/to/relevant/file.js`
- `path/to/another/file.js`
```

### What Makes Each Section Work

**Task line** — Frame as evaluation, not as debugging. "Evaluate a subtree caching strategy" not "Help us fix our caching bugs."

**Architecture** — Describe how things *work*, not how they *fail*. The subagent should understand the system before encountering the problems.

**Concrete Problems** — Symptoms, not diagnoses. "Loses resolved state when parent re-renders" not "The cache invalidation is wrong." Let the agent form its own diagnosis.

**Questions** — The phrasing matters enormously. "Is caching necessary?" invites genuine evaluation. "How should we fix the cache?" presupposes caching is the right approach.

```
❌ "How should we fix the cache invalidation?"
   → Presupposes caching, presupposes invalidation is the issue

✅ "Is caching subtrees necessary? What are the real costs of the alternative?"
   → Invites the agent to potentially conclude caching is wrong entirely
```

**Source Files** — List every file the agent needs. Don't make it search — that wastes its attention on navigation instead of analysis.

---

## Consultation Lenses

The same brief can be wrapped with different meta-instructions to get different kinds of analysis. Run multiple lenses in parallel for richer results.

### Neutral Evaluation

No additional framing beyond what's in the brief. The agent evaluates independently.

```
Read the evaluation prompt at [path], then read ALL source files listed in it.
Answer all questions with detailed analysis grounded in the actual code.
Do not read git history or diffs — evaluate only the current code state.
```

Best for: getting an unbiased assessment of the problem space.

### Challenge Evaluation

Explicitly asks the agent to push back on assumptions.

```
Read the evaluation prompt at [path], then read ALL source files listed in it.
Answer all questions with detailed analysis grounded in the actual code.
Assume the existing implementation can be improved through first-principles
thinking. Do not accept the current approach as given — challenge its
assumptions, identify where it may be overengineered or underengineered,
and propose alternatives if you see better paths. Be contrarian where the
evidence supports it.
```

Best for: stress-testing an approach you're leaning toward, surfacing alternatives you haven't considered.

### Survey

Asks the agent to map the solution space broadly rather than converge on one answer.

```
Read the evaluation prompt at [path], then read ALL source files listed in it.
For each question, identify 3-5 fundamentally different approaches. For each
approach, describe the mechanism, tradeoffs, and what it optimizes for.
Do not recommend one — map the space.
```

Best for: early-stage exploration when you want to understand what categories of solutions exist.

### Reframe

Asks the agent to question the problem itself.

```
Read the evaluation prompt at [path], then read ALL source files listed in it.
Before answering the specific questions, evaluate whether they are the RIGHT
questions. Is the problem framed correctly? Are there upstream causes or
alternative framings that would dissolve the problem rather than solve it?
Then answer the questions as stated.
```

Best for: when you suspect you might be solving a symptom rather than a root cause.

---

## The Process

### Step 1: Extract

Analyze the current conversation. Identify what has been learned about the problem versus what direction has been explored. Draft a list:

- **Facts discovered** (transfer)
- **Constraints identified** (transfer, but rephrase without approach context)
- **Hypotheses formed** (isolate)
- **Approaches attempted** (isolate, but extract any revealed constraints)

### Step 2: Draft the Brief

Write the evaluation document following the template above. Save it to `ai/workspace/` so it's reviewable and reusable.

### Step 3: Review with User

Present the draft brief. Explicitly ask:

1. "Does this accurately capture the problem space?"
2. "Is anything here actually an assumption rather than a constraint?"
3. "Is anything missing that a fresh evaluator would need to know?"
4. "Which lens do you want — neutral, challenge, survey, or reframe?"

This review step is the quality gate. The user may notice that something framed as a "constraint" is actually a design choice they made, or that a "fact" encodes a bias they didn't notice.

### Step 4: Isolate the Environment

Before launching, verify the agent won't encounter solution artifacts:

- **Modified source files?** → Stash changes or use `isolation: "worktree"` so the agent reads clean state
- **Workspace files with plans/notes?** → Don't include those paths in the brief's file list
- **New files created as part of your approach?** → Exclude from the file list entirely

If the agent needs to read files that contain your in-progress modifications, you must use structural isolation (stash or worktree). There is no instructional workaround.

### Step 5: Launch

Spawn the subagent(s) with the chosen lens wrapping the brief. If the user wants multiple lenses, run them in parallel — each agent gets the same brief with a different meta-instruction.

Tell the agent to write its analysis to a file in `ai/workspace/` so the results persist beyond the subagent's context.

### Step 6: Present Without Reconciliation

When the subagent returns, present its findings as-is. Do not immediately compare with the current conversation's direction. Do not editorialize ("Interestingly, this confirms our earlier hypothesis...").

Let the user absorb the fresh perspective on its own terms before any reconciliation with prior thinking. The value is in the delta between what the fresh agent sees and what you've been discussing — collapsing that delta prematurely destroys the signal.

After the user has processed the results, then — and only then — help reconcile if asked.

---

## Anti-Patterns

**Summarizing the conversation as the brief.** A summary preserves narrative structure, which carries solution momentum. The brief should be *restructured*, not summarized.

**Including "what we've tried."** Even framed neutrally ("Previous approaches include..."), this anchors the subagent. If an approach revealed a constraint, transfer the constraint. Drop the approach.

**Asking leading questions.** "Don't you think X would be better?" is not an independent evaluation. Frame questions to genuinely permit any answer, including ones that contradict your current direction.

**Reconciling immediately.** "The fresh agent agrees with our approach!" collapses the value of the exercise. Let the user read the analysis, sit with it, and draw their own conclusions about how it relates to the prior conversation.

**Over-specifying the source files.** List what's needed, but don't pre-highlight specific functions or lines. Let the agent discover what's important — its attention pattern is itself informative.

---

## Quick Reference

| Step | Action | Output |
|------|--------|--------|
| Extract | Separate problem knowledge from solution momentum | Categorized list |
| Draft | Write evaluation document from problem knowledge | `ai/workspace/{topic}-evaluation.md` |
| Review | User validates brief for hidden bias | Approved brief |
| Isolate | Stash/worktree so agent reads clean file state | Clean environment |
| Launch | Spawn subagent(s) with chosen lens | Running agent(s) |
| Present | Show results without editorial reconciliation | Fresh analysis |

| Lens | Use When | Instruction Flavor |
|------|----------|-------------------|
| Neutral | Default — unbiased assessment | "Evaluate independently" |
| Challenge | Stress-testing a leaned-toward approach | "Be contrarian where evidence supports it" |
| Survey | Early exploration, mapping the space | "Identify 3-5 fundamentally different approaches" |
| Reframe | Suspecting you're solving the wrong problem | "Are these the right questions?" |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Internals** | `use_skill internals` | Understanding framework architecture for brief context |
| **Render Pipeline** | `use_skill render-pipeline` | Renderer-specific evaluation context |
| **Mental Model** | `use_skill mental-model` | Core framework concepts for brief framing |

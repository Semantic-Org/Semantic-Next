---
title: Pattern Research E&O Verification Workflow
description: Systematic workflow for verifying pattern research documents against individual framework files to identify and correct errors and omissions.
keywords: [verification, research, quality assurance, E&O, subagents, validation, accuracy]
audience: contributing
type: workflow
workflow: verify-pattern-research
---

# Pattern Research E&O Verification Workflow

> Last Updated: 2025-11-10
> Version: 1.2

**Purpose**: Systematically verify pattern research meta-analysis documents for errors and omissions (E&O)
**Target**: Agents performing quality assurance on consolidated cross-framework research
**Input**: Completed pattern-research.md file and individual framework usage-patterns.md files
**Output**: Verified, corrected pattern-research.md with documented accuracy

---

## Overview

This workflow uses subagents to systematically verify consolidated pattern research documents against individual framework research files. The workflow supports parallel verification, iterative correction cycles, and configurable thoroughness levels.

**Key Principles**:
- Use subagents for independent verification to catch systematic errors
- Verify all corrections made by subagents before applying them
- Multiple verification rounds may be needed to achieve high accuracy
- Small error counts (1-3) require careful human/agent validation

---

## Workflow Steps

### Step 0: Self-Reflection & Tooling Check

Before touching the research files, pause for a self-assessment:

1. **Confirm subagent tooling**: Do you have an automated `AskUserQuestion` or subagent-launch tool available in this runtime?
   - ✅ **Yes** → Proceed to Step 1 with normal delegation.
   - ❌ **No** → Record the limitation in your notes and switch to the manual multi-pass protocol below.
2. **Capability reminder**: Briefly restate (to yourself) what this runtime _can_ do (e.g., read files, edit docs, run scripts) so you plan within actual constraints.
3. **Cognitive guardrail**: Commit to double-checking every applied correction against primary sources, since you are now both the discoverer and verifier.

#### Manual Multi-Pass Protocol (when no subagent tool exists)

If you lack automated subagents, emulate them explicitly:

- **Virtual roles**: Run at least two distinct passes per round—one as “Discoverer” (issue hunting) and one as “Verifier” (independent confirmation). Log them separately so the audit trail mirrors multi-agent behavior.
- **Deliberate divergence**: For the Discoverer pass, push breadth (scan for every possible inconsistency). For the Verifier pass, push depth (recompute numbers, quote sources). Treat each pass as if a different agent with its own reasoning style performed it.
- **Prompt resets**: Between passes, restate the task from scratch to reduce anchoring bias. First-principles thinking from ML research shows that independent reasoning chains catch more errors than iterative edits on one chain.
- **Evidence-first corrections**: Do not modify files until the Verifier pass cites exact line numbers from both the consolidated report and the originating framework file.
- **Meta-review**: After corrections, perform a short self-reflection: “If I were a skeptical reviewer, what would I challenge?” Only exit the workflow when that answer is “nothing obvious remains.”

This manual approach preserves the error-and-omission benefits of multi-agent verification while staying realistic about tooling limits.

### Step 1: Initial Configuration

**Ask the user for workflow configuration:**

Use the **AskUserQuestion** tool if available (Claude Code), otherwise present options as A/B/C and ask for response.

**Questions to ask:**

1. **How many subagents to use for verification?**
   - **Option A**: Single subagent (Sequential, thorough verification)
   - **Option B**: Multiple subagents 2-3 (Parallel verification with consensus validation)
   - Recommendation: Start with 1, use multiple for large research files

2. **Verification mode:**
   - **Option A**: Single pass (Run verification once and report findings)
   - **Option B**: Check until clean (Iterate until a subagent reports zero errors)
   - **Option C**: Maximum rounds (Specify limit, e.g., "max 3 rounds")

3. **Pattern scope** (optional):
   - All patterns (default)
   - Specific sections only (e.g., "only Content Patterns and Type Patterns")

**If using AskUserQuestion tool (Claude Code):**
```
AskUserQuestion with 2 questions:
Q1: "How many subagents should I use for verification?"
Q2: "Which verification mode should I use?"
```

**If AskUserQuestion unavailable (other agents):**
```
Please configure the verification workflow:

1. How many subagents?
   A) 1 subagent (thorough, sequential)
   B) 2-3 subagents (parallel, consensus validation)

2. Verification mode?
   A) Single pass
   B) Check until clean
   C) Max rounds (specify number)

Please respond with your choices (e.g., "1A, 2B" or "B, single pass")
```

---

### Step 2: Prepare Verification Task

**Document the scope:**

1. **Identify the research files:**
   ```
   - Consolidated research: ai/research/[component]/pattern-research.md
   - Individual frameworks: ai/research/[component]/[framework]/usage-patterns.md
   - Count total frameworks documented
   ```

2. **Note any recent corrections:**
   - If this is a re-verification, list previously fixed errors
   - Tell subagents NOT to report these as errors again

3. **Define verification requirements:**
   - Framework count verification
   - Numerical accuracy (X/N counts, percentages)
   - Framework attribution accuracy
   - Pattern prevalence calculations
   - Code example accuracy
   - Internal consistency checks
   - **Unique Innovations validation**: Component-level vs framework-level features

---

### Step 3: Deploy Subagent(s)

#### Single Subagent Mode

Deploy one general-purpose subagent with detailed instructions:

```markdown
**Your Task:**
Review `/path/to/pattern-research.md` for errors and omissions by comparing
against individual framework research files.

**Context:**
- Research claims to cover N frameworks
- [List all framework research file paths]
- [Note any recent corrections to avoid re-reporting]

**What to Verify:**
1. Framework count accuracy
2. All X/N counts and percentages
3. Framework attributions for each pattern
4. Missing patterns from individual files
5. Code example accuracy
6. Internal consistency
7. **Unique Innovations section** - Component-level vs framework-level features

**CRITICAL: Unique Innovations Validation**

The "Unique Innovations" section must only contain features that are unique to THIS SPECIFIC COMPONENT'S implementation, NOT framework-wide architectural choices.

**Invalid entries (framework-level):**
- Styling philosophies that apply to all components (e.g., "Material Design variants", "Tailwind integration")
- Framework-wide state management patterns (e.g., "Context-first architecture", "Zero dependencies")
- General design system requirements (e.g., "Copy-to-project approach")
- Packaging or bundling decisions that affect all components
- Framework-wide APIs that happen to be used by this component

**Valid entries (component-level):**
- Component-specific APIs (e.g., "Form.List" for dynamic field arrays)
- Unique architectural patterns for THIS component (e.g., "Field-level re-rendering" in Form)
- Component-specific integrations (e.g., "Form.Provider" for multi-form coordination)
- Features that only exist in this component's implementation

**Validation test:** If we removed this component from the framework, would this feature still exist in other components? If YES, it's framework-level and should be removed from Unique Innovations.

**CRITICAL - Your Deliverable:**

For EACH error found, provide:
- **Error #**: [number]
- **Line**: [number]
- **Current**: "[exact quote]"
- **Should be**: "[corrected text]"
- **Evidence**: [framework file and line number]

Provide:
- Total error count
- Overall accuracy assessment (percentage)
- Recommendation (ready / needs corrections)
```

#### Parallel Subagent Mode

Deploy 2-3 subagents simultaneously, **each verifying the ENTIRE document independently**:

**IMPORTANT**: Each subagent reviews ALL sections of the document. This is NOT about dividing work - it's about **consensus validation**. Multiple independent reviews of the same content help catch errors that a single agent might miss and validate findings through agreement.

**Subagent A**: Reviews entire document, all sections
**Subagent B**: Reviews entire document, all sections (independent from A)
**Subagent C**: Reviews entire document, all sections (independent from A & B)

Each subagent uses the same prompt and verifies:
- Framework count accuracy
- All X/N counts and percentages
- Framework attributions for each pattern
- Missing patterns from individual files
- Code example accuracy
- Internal consistency
- **Unique Innovations section**: Component-level vs framework-level features (see detailed criteria in Single Subagent Mode)

After all subagents complete, **cross-check their findings for consensus**:
- Compare error reports: Do multiple agents identify the same errors?
- **Consensus errors** (2+ agents agree): Likely valid, priority for correction
- **Unique errors** (only 1 agent found): Requires careful validation
- **Contradictions** (agents disagree): Manual validation required with user input
- **Zero errors vs many errors**: Investigate discrepancy carefully

---

### Step 4: Validate Subagent Findings

**CRITICAL: Validate small error counts (1-3 errors)**

When a subagent reports only 1-3 errors, this is a **potential AI failure mode**. The subagent may:
- Feel pressure to report *something* even if nothing is wrong
- Focus too narrowly and miss broader patterns
- Overcorrect edge cases

**Validation process:**
1. **Read the source framework files** directly at the cited line numbers
2. **Verify the claim** independently
3. **Check for contradictory evidence** in other parts of the file
4. **Consider the pattern's intent** (e.g., "via CSS" vs explicit prop)
5. **For ambiguous classification decisions**: Use AskUserQuestion tool to involve user in judgment calls

**When to involve the user:**
- Classification ambiguity: Is "supports via CSS" the same as "native prop support"?
- Philosophy questions: Is Radix UI "Tailwind integrated" or just "styling-agnostic"?
- Methodology clarification: Should we count frameworks that mention patterns vs demonstrate them?
- Disputed findings: When subagents strongly disagree (e.g., 0 errors vs 4 errors)

**If using AskUserQuestion tool (Claude Code):**

Present each disputed claim using the tool with:
- Your assessment of the evidence
- 2-3 clear options for resolution (e.g., "Yes, it's an error" vs "No, it's acceptable")
- Description explaining implications of each choice

Example:
```
AskUserQuestion:
Q: "Should ShadCN be included in max-width constraint pattern (line 73)?"
Options:
  A) No - 2/4 only (Pattern should only count native prop support)
  B) Yes - keep 3/4 (ShadCN supports it via Tailwind classes, that counts)
```

**If AskUserQuestion unavailable (other agents):**

Present each claim clearly and ask for A/B/C response:
```
**Claim: Line 73 - Max-width constraint count**

Current: 3/4 (75%) | Chakra UI, Mantine, ShadCN
Evidence: Only Chakra (maxW) and Mantine (maw) have native props.
         ShadCN only supports via className with Tailwind.

Should ShadCN be included?
A) No - 2/4 only (count native props only)
B) Yes - keep 3/4 (CSS-only counts as support)

Your choice (A or B)?
```

**Examples of invalid claims to watch for:**
- "Framework X supports Y" based on a single ambiguous line
- Counting "CSS achievable" vs "prop-based" inconsistently
- Reporting different naming conventions as errors (e.g., `type` vs `orientation`)
- Overcorrecting percentages due to rounding (e.g., 64.5% → "should be 65%")

**If validation fails:**
- Do NOT apply the correction
- Note the invalid claim in your summary
- Consider deploying another subagent for a fresh perspective

---

### Step 5: Apply Verified Corrections

For each VALIDATED error:

1. **Update the todo list** with specific line numbers and corrections
2. **Apply corrections systematically** using the Edit tool
3. **Mark each todo as completed** after applying
4. **Track correction count** (report total at end)

**Update Pattern:**
```
- Current: [exact wrong text]
- Corrected: [exact right text]
- Evidence: [framework file:line]
```

---

### Step 6: Re-Verification (if needed)

**When to re-verify:**
- User specified "check until clean" mode
- Initial verification found >10 errors
- Corrections may have introduced new inconsistencies

**Re-verification process:**

1. **Deploy fresh subagent** with updated context:
   ```markdown
   **Context:**
   - [N] corrections were just applied
   - Previous errors found: [list line numbers]
   - Task: Verify these corrections AND check for new errors
   ```

2. **Subagent should report:**
   - ✅ VERIFIED for each previous correction
   - ❌ INCORRECT if correction was wrong
   - NEW ERROR # for any newly discovered issues

3. **Stopping conditions:**
   - Subagent reports 0 errors found
   - Maximum rounds reached (if specified)
   - Only 1-3 errors remain and validation shows they're questionable

---

### Step 7: Final Report

Provide comprehensive summary:

```markdown
## Pattern Research E&O Verification Complete

### Component: [name]
### Verification Rounds: [count]
### Total Errors Found: [count]
### Total Corrections Applied: [count]

### Corrections Summary:

**Round 1: [N] errors**
1. Line X: [description]
2. Line Y: [description]
...

**Round 2: [N] errors** (if applicable)
...

### Validation Notes:
- [Any claims rejected during validation]
- [Any uncertain areas requiring human review]

### Final Accuracy: ~X%
### Status: ✅ Ready for use / ⚠️ Needs human review

### Changes Made:
[git diff --stat output]
```

---

### Step 8: Finalize Documentation and Meta-Files

This final step ensures that the work is discoverable and that project-wide tracking files are up-to-date.

1.  **Update `pattern-research.md` version and metadata:**
    - Increment the version number (Major.Minor.Patch):
      - **Major (X.0.0)**: Complete re-research, methodology change, framework set change
      - **Minor (1.X.0)**: E&O corrections, pattern additions/removals, data fixes
      - **Patch (1.1.X)**: Typos, formatting, clarifications (no data changes)
    - Update `> Last Modified: YYYY-MM-DD` in the header metadata block
    - Add `> Last Reviewed: YYYY-MM-DD (by Agent)` if this was a verification pass without changes

2.  **Add Version History entry to `pattern-research.md`:**
    - Append a new entry to the "Version History" section at the bottom of the file
    - If no Version History section exists, create it before the "Raw Data" section
    - Entry format:
      ```markdown
      ### Version X.Y.Z (YYYY-MM-DD) - E&O Verification Round N
      **Agent**: [Your agent name/ID]
      **Changes**:
      - [Specific change with line reference]
      - [Another change with evidence]

      **Evidence**:
      - [framework/usage-patterns.md:line-numbers]
      - [Methodology notes]

      **Confidence**: [percentage]% ([reasoning])
      ```
    - Include all corrections made, evidence citations, and confidence level
    - Keep entries evidence-focused for auditability

3.  **Update the shared checklist (`ai/artifacts/eo-list.md`):**
    - This single file is the source of truth for pattern research status and E&O verification
    - Flip the component entry to `[+]` when you start, `[x]` when you finish, and back to `[ ]` if you hand off
    - Include the latest version number and "Last Reviewed" date so teammates can see validation state

---

## Decision Tree

```
START
  ↓
Ask User: How many subagents? Mode?
  ↓
Single or Multiple?
  ├─ Single → Deploy 1 subagent (full review)
  └─ Multiple → Deploy 2-3 subagents (sections) → Cross-check results
  ↓
Receive subagent report(s)
  ↓
Error count?
  ├─ 0 errors → Report success → Finalize Docs → END
  ├─ 1-3 errors → VALIDATE CAREFULLY (manual checks)
  └─ 4+ errors → Validate all
  ↓
Apply verified corrections
  ↓
Check mode?
  ├─ Single pass → Generate report → Finalize Docs → END
  └─ Check until clean → Re-verify → Loop to "Receive report"
```

---

## Common Pitfalls

### ❌ Anti-Patterns

1. **Blindly applying subagent corrections**
   - Always validate, especially for small error counts
   - Subagents can hallucinate errors under pressure

2. **Not cross-checking parallel subagents**
   - Multiple subagents may contradict each other
   - Resolve conflicts before applying corrections

3. **Treating CSS-achievable as not-supported**
   - Pattern research often counts "achievable via CSS" as support
   - Be consistent with the research methodology

4. **Ignoring usage level changes**
   - Correcting prevalence (e.g., 7/11 → 8/11) changes usage levels
   - Update both percentage AND level (3→2, 4→3, etc.)

5. **Missing feature matrix consistency**
   - Pattern tables and feature matrices must match
   - Verify both when making corrections

### ✅ Best Practices

1. **Start with single subagent verification**
   - Understand error patterns before parallelizing
   - Easier to validate and track

2. **Use "check until clean" for critical research**
   - Ensures high accuracy for decision-making
   - Worth the extra time for foundational research

3. **Document validation process**
   - Note which claims were manually verified
   - Helps future verifications and debugging

4. **Preserve evidence in commit messages**
   - Include subagent findings in commits
   - Makes historical review easier

---

## Example Sessions

### Example 1: Single Subagent with Iterations

```markdown
User: "Please verify ai/research/modal/pattern-research.md for E&O"

Agent: I'll verify the modal pattern research. Let me ask:

1. How many subagents should I use?
   - 1 (thorough, sequential)
   - 2-3 (parallel, consensus validation)

2. Verification mode?
   - Single pass (report findings once)
   - Check until clean (iterate until zero errors)
   - Max N rounds (specify limit)

User: "Use 1 subagent, check until clean, max 3 rounds"

Agent: Understood. I'll:
1. Deploy a subagent to review all 9 frameworks
2. Validate and apply corrections
3. Re-verify until clean or 3 rounds reached

[Deploys subagent...]

Agent: Round 1 complete. Found 11 errors. Validating...

[Validates each error against source files...]

Agent: Validated 11/11 errors. Applying corrections...

[Applies corrections with todo tracking...]

Agent: Round 1 corrections applied. Deploying verification subagent...

[Deploys second subagent...]

Agent: Round 2 complete. Found 4 new errors. Validating...

[Validates 4 errors - all confirmed...]

Agent: Validated 4/4 errors. Applying corrections...

[Applies corrections...]

Agent: Round 2 corrections applied. Final verification...

[Deploys third subagent...]

Agent: Round 3 complete. Found 0 errors ✅

Total: 15 errors corrected across 3 rounds
Accuracy improved: 85% → 99%
Status: Ready for use
```

### Example 2: Parallel Subagents with User Validation

```markdown
User: "Please verify ai/research/aspect-ratio/pattern-research.md for E&O"

Agent: I'll verify the aspect-ratio pattern research. Let me ask:

1. How many subagents? 1 or 2-3?
2. Verification mode?

User: "Use 2-3 subagents, single pass"

Agent: Understood. I'll deploy 3 independent subagents, each reviewing the ENTIRE document.
This provides consensus validation - if multiple agents find the same errors, we can be
confident they're real issues.

[Deploys 3 subagents in parallel with identical prompts...]

Agent: All 3 subagents completed. Comparing findings:
- Agent A: Found 4 errors (lines 46, 73, 66, 38)
- Agent B: Found 0 errors (claimed 100% accuracy)
- Agent C: Found 1 error (line 35)

Significant disagreement detected. Let me validate each disputed claim against source files
and discuss ambiguous cases with you.

**Claim 1: Line 46 - "Native (1)" notation unclear**
[Presents evidence and asks user for decision...]

User confirms: "Yes, it's an error"

**Claim 2: Line 73 - Max-width constraint should exclude ShadCN**
[Presents evidence about native props vs CSS-only...]

User confirms: "No - 2/4 only. Pattern should only count native prop support."

[Continues through all 5 disputed claims with user validation...]

Agent: User confirmed all 5 errors. Applying corrections:
1. Line 46: Native (1) → Native
2. Line 73: 3/4 → 2/4 (removed ShadCN)
3. Line 66: 2/4 → 1/4 (removed Radix UI)
4. Line 38: 2/4 → 4/4 (added All frameworks)
5. Line 35: 3/4 → 4/4 (added ShadCN)

[Applies all corrections...]

Total: 5 errors found and corrected
Accuracy: 98.6%
Status: ✅ Ready for use

Key insight: Parallel mode revealed inconsistency between agents (0 vs 4 errors),
prompting deeper validation and user involvement for classification decisions.
```

---

## Related Workflows

- **research-component-patterns.md**: Creates the initial pattern research
- **primitive-refine.md**: Uses verified research to make editorial decisions and write specs
- **pattern-research-integration.md**: Methodology guide for research interpretation

---

## Notes for Future Improvements

- Consider automated regression testing for previously verified research
- Build a library of common E&O patterns to prime subagents
- Track inter-framework naming variations (Dialog/Modal, Divider/Separator)
- Develop confidence scoring for subagent claims

---

## Version History

- **1.2** (2025-11-10): Migrated from separate eo-review-log.md files to embedded Version History sections in pattern-research.md with natural prose format
- **1.1** (2025-11-10): Added component-level vs framework-level uniqueness validation criteria for Unique Innovations section
- **1.0** (2025-11-06): Initial workflow based on modal and divider E&O sessions

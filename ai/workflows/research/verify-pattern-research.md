# Pattern Research E&O Verification Workflow

> Last Updated: 2025-11-06
> Version: 1.0

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

Use the AskUserQuestion tool to present each disputed claim with:
- Your assessment of the evidence
- Clear options for resolution
- Implications of each choice

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

1.  **Update `pattern-research.md` review date:**
    - Every `pattern-research.md` must include a `> Last Reviewed: YYYY-MM-DD (by Agent)` line directly under the existing metadata block.
    - Add the field if missing or refresh the date (ISO format) whenever you touch the document so downstream agents know when the research was last validated.

2.  **Update the shared checklist (`ai/artifacts/eo-list.md`):**
    - This single file is the source of truth for pattern research status and E&O verification.
    - Flip the component entry to `[+]` when you start, `[x]` when you finish, and back to `[ ]` if you hand off.
    - Include the latest “Last Reviewed” metadata so teammates can see when the doc was last validated.

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
- **evaluate-research-extend-spec.md**: Uses verified research to update specs
- **pattern-research-integration.md**: Methodology guide for research interpretation

---

## Notes for Future Improvements

- Consider automated regression testing for previously verified research
- Build a library of common E&O patterns to prime subagents
- Track inter-framework naming variations (Dialog/Modal, Divider/Separator)
- Develop confidence scoring for subagent claims

---

## Version History

- **1.0** (2025-11-06): Initial workflow based on modal and divider E&O sessions

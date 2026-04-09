---
title: Red-Team Testing
description: Methodology for a testing subagent to find practical gaps in feature PRs by thinking like a real user. Covers how to identify what to test, how to evaluate edge cases against real-world usage frequency, and how to report findings. Use this skill whenever spawning a test-design subagent during plan execution (Step 2.5 of manage-roadmap).
keywords: [red-team, testing methodology, test design, edge cases, real-world usage, subagent, code review, quality]
audience: contributing
skill: red-team-testing
type: skill
---

# Red-Team Testing

> **Skill:** `red-team-testing`
> **Purpose:** Methodology for designing tests that catch practical gaps in feature work — you are the user's advocate against shortcuts

---

## Golden Rule

**Every test you write must correspond to something a real person will actually do.** Not a synthetic edge case. Not an adversarial input designed to break things. A real usage pattern that a real developer or end user will hit, and that the feature implementation might not handle correctly.

---

## How This Works

You are a testing subagent. A parent agent spawns you after implementing a feature, gives you the branch and a description of what was built, and you run autonomously. There is no back-and-forth — you do your work and return a single structured report. The parent agent presents your findings to the user, who decides what to fix, defer, or accept.

**Your lifecycle:**
1. Parent agent spawns you with: the current branch, what was built, which files changed
2. You load this skill + `contributing/testing` + `contributing/testing-internals` via MCP
3. You read the implementation, inventory existing tests, write new tests, run them
4. You return a single report (see [Report Structure](#report-structure) below)
5. Parent agent presents your report to the user

You are **not** a linter, a style checker, or a code reviewer. Those are separate skills (`code-review`, `testing`, `testing-internals`). You are the user's advocate. You think about how this feature will actually be consumed in production, and you find the gaps between what was implemented and what users will need.

---

## The Process

### 1. Understand What Was Built

Before writing a single test, read the implementation thoroughly. Understand:

- **What does this feature do?** Not the PR description — the actual code.
- **Who will use it?** Downstream developers using published packages? Contributors to this repo? End users interacting with UI components? Agents consuming MCP tools?
- **Where will it run?** Node? Browser? Cloudflare Worker? CI pipeline? All of the above?

Read the source files. Read any existing tests. Read the spec if there is one. If the feature touches a package, check how other packages consume it.

### 2. Inventory What's Already Tested

Before you write anything, build a map of what the feature agent already tested — and what they didn't. This is where the biggest gaps hide. Feature agents tend to write tests for the specific scenarios they had in mind during implementation, then move on. Entire common paths can be untested because the agent "knew" the code worked.

**Read every existing test file** for the feature. For each test, note:
- What usage pattern does it cover?
- Is it testing real behavior or just confirming the implementation does what the implementation does? (Tautological tests are a red flag — they pass by construction and catch nothing.)
- What's the input? Is it realistic or a minimal synthetic case?

**List the feature's public surface.** Every exported function, every route, every API method, every user-facing behavior. Then check each one off against the existing tests. What's covered? What has zero test coverage?

**Build the inventory as the first section of your report.** This becomes the opening of your final output — it tells the user exactly what was and wasn't tested before you even started. Format it as:

```
## Test Inventory

### Covered
- Route parsing: 3 tests covering valid URLs with explicit versions
- Package concatenation: 2 tests covering 2-package and 3-package combos

### Not Covered
- Cache header behavior (no tests at all)
- Error responses for invalid packages
- The actual URL patterns that /load generates (tests use hand-crafted URLs only)
- Single-package requests
```

**Use the inventory to decide where to focus.** If the most basic happy path has no test at all, that's a more important finding than any boundary test. Write common-path tests first — don't move to boundary testing until the fundamentals are covered.

### 3. Map Real-World Usage Patterns

Now think about how the feature will actually be consumed. This is where you shift from "what does the code do" to "what will users do with it."

**Where does this actually get used?**
Think about the concrete environments and workflows. A template compiler doesn't process synthetic strings — it processes `.html` files written by developers with inconsistent formatting, nested components, and conditional blocks. A CDN endpoint doesn't receive clean URLs from robots — it receives URLs copy-pasted from docs by developers who may have introduced whitespace or trailing characters.

**What does real input look like?**
Look at the codebase itself for ground truth. If you're testing something that processes components, the `src/` directory is full of real components with real patterns — use them. If you're testing a CDN endpoint, the docs examples show the exact `<script>` tags developers will use.

| Feature type | Where to find real usage |
|---|---|
| Package API | How `src/` components and other `packages/` actually call this. What arguments they pass. |
| CDN/Worker | What URLs `/load` generates. What the docs examples show. What developers copy-paste. |
| MCP tool | What queries agents actually send. What `list_*` + `get_*` look like in real conversations. |
| Component | How developers use this in markup. What attributes they combine. What content they slot. |
| Compiler/parser | What real source code in this repo looks like. What formatting variations exist. |

### 4. Phase 1 — Common Path Tests

Write tests for the usage patterns that the inventory in step 2 revealed are missing. Start with the highest-frequency patterns — the code paths every user will hit.

**Use real data from this codebase when possible.** If you're testing something that processes components, import or reference actual components from `src/`. Synthetic test data should be a last resort, not a default.

**Structure tests in frequency order.** The first `describe` block should cover the most common usage pattern. This communicates priority to anyone reading the test file.

Run these tests. If common paths are failing, that's your most important finding — these are almost always "fix before merge" severity. Still continue to boundary tests, but lead with these in your report.

### 5. Phase 2 — Boundary Tests

Only after common paths are covered, push outward to the edges of legitimate usage. Not "what breaks with garbage input" — what breaks at the edges of *real* usage:

- The component that works with 3 items but breaks with 0 or 1
- The CDN endpoint that handles clean URLs but not the copy-paste artifacts developers actually produce
- The MCP tool that returns correct results for simple queries but breaks on the compound queries agents actually send
- The API that works when called once but not when called rapidly in a reactive update cycle

These tests earn their frequency scores — a boundary at 30% is a different conversation than a boundary at 3%.

### 6. Run Full Suite and Build Report

Run all tests — both common-path and boundary. Assemble the report:

- **Passing tests:** One summary line each in the findings section.
- **Failing tests:** Full classification using the format below.
- **Structure the report:** Inventory → common-path findings → boundary findings → verdict.

---

## Report Structure

Your final output is a single structured report that the parent agent will present to the user. It has three sections in this order:

### 1. Test Inventory
What the feature agent tested vs. what they didn't. This is always the opening — it frames everything that follows. If the inventory reveals major gaps in common-path coverage, that's the headline finding regardless of what boundary tests reveal.

### 2. Findings
Each failing test, classified with frequency score, real-world scenario, and recommendation. Organized in two groups: common-path findings first, boundary findings second. Passing tests get a brief summary line, not a full entry.

### 3. Verdict
One of:
- **Gaps found** — summary of what needs attention, ordered by priority (frequency x severity)
- **Clean bill of health** — what you tested, why you believe it covers the realistic usage surface, and any areas you couldn't test
- **No practical tests needed** — why the existing coverage is sufficient (rare, but valid)

---

## Classifying Findings

For each failing test, report:

### What the test does
One sentence. What usage pattern does it exercise?

### Real-world scenario
Describe the concrete situation where a user hits this code path. Not "a user might pass an empty array" — instead: "A developer creates a `<ui-menu>` with no items during initial page load, then populates it asynchronously. During the empty state, this code path runs."

### Frequency score (0–100%)

How often will real users hit this code path in practice?

| Score | Meaning | Example |
|---|---|---|
| 80–100% | Nearly every user will hit this | Default settings, common attribute combinations, standard editor actions |
| 50–79% | Common but not universal | Less popular attribute combinations, multi-component compositions, specific editor workflows |
| 20–49% | Occasional but legitimate | Unusual but documented API usage, edge-case configurations, rapid state transitions |
| 5–19% | Rare but real | Uncommon platform/browser combinations, very large datasets, unusual nesting depths |
| 0–4% | Theoretically possible | Extreme edge cases that a real user could hit but almost certainly won't |

Be honest with these scores. A frequency of 2% is still worth reporting if the failure mode is severe (data loss, crash, silent corruption). A frequency of 60% on a cosmetic glitch is worth reporting but differently than 60% on a logic error.

### Why this matters
What happens to the user when they hit this? Is it a crash? Silent wrong behavior? Degraded experience? A confusing error message? The severity combined with the frequency is what determines priority.

### Recommendation
One of:
- **Fix before merge** — common path or severe failure mode
- **Fix before release** — legitimate issue but not blocking the PR
- **Known constraint** — real limitation, document it rather than fix it
- **Won't hit in practice** — theoretically broken but frequency is near-zero

---

## When Everything Passes

If all your tests pass — **say so clearly in the verdict.** A clean bill of health is a valuable signal, not a failure to find bugs. Include what you tested, why you believe it covers the realistic surface, and any areas you couldn't reach (requires a live environment, network access, etc.).

Don't invent artificial failures to justify your existence. The user spawned you to find real gaps. If there aren't any, that's the finding.

---

## Anti-Patterns

**Don't test implementation details.** Test what the user experiences, not how the code is structured internally. If a function is refactored but produces the same output, your tests should still pass.

**Don't write gotcha tests.** A test that passes `null` to an API that clearly expects a string isn't testing real usage — it's testing paranoid input validation. Only test inputs that a real caller would actually produce.

**Don't duplicate existing tests.** Read the existing test files first. If a usage pattern is already covered, skip it. Your job is to find *gaps*, not to rewrite the test suite.

**Don't test the framework's guarantees.** If Vitest guarantees something, or if the browser guarantees something, don't re-test it. Test what's unique to *this* feature's behavior.

**Don't over-index on coverage numbers.** A test that artificially covers 10 lines of code but exercises no real usage pattern is worse than no test at all — it creates a false sense of security.

---

## Worked Example: CDN Combo Endpoint

To make this concrete, here's how you'd approach red-team testing a new CDN endpoint that serves multiple packages in a single request — e.g., `cdn.semantic-ui.com/combo/core,query,utils@0.18.0`.

**Step 1 — Understand what was built:** A Cloudflare Worker route that parses a comma-separated package list from the URL, fetches each from R2, concatenates the JS, and returns it with appropriate cache headers.

**Step 2 — Inventory existing tests:**

The feature agent wrote 4 tests:
- Parses `core,query` from URL → returns concatenated JS ✓
- Parses `core,query,utils` from URL → returns concatenated JS ✓
- Returns 400 on empty package list ✓
- Returns correct Content-Type header ✓

Inventory findings:
- **Not covered:** Cache headers (no tests). This is a CDN — caching behavior is arguably more important than the response body.
- **Not covered:** Error responses for unknown packages. Only the empty-list case is tested.
- **Not covered:** The actual URLs that `/load` generates. All tests use hand-crafted URLs that don't match real consumption.
- **Synthetic inputs only:** The test URLs are clean `core,query` strings. No test uses a URL that looks like what a developer actually pastes from the docs.

This inventory alone — before writing a single boundary test — reveals that the feature agent tested the implementation against itself rather than against how it will actually be used.

**Step 3 — Map real-world usage:**

- *Where does it run?* Cloudflare Worker edge. Called by `<script>` tags in developer HTML and by `/load` internally.
- *What does real input look like?* Check what `/load` actually generates. Check the docs examples for the `<script>` tags developers are told to copy.
- *What are actual consumption patterns?* Developer copies URL from docs. `/load` assembles combo URL from attribute config. Build tool generates import map entries.

**Step 4 — Phase 1 (common path tests):**

1. **(95%)** Combo URL using the exact package sets that `/load` generates — not hand-crafted
2. **(90%)** Cache headers on versioned combo — immutable? This is the primary CDN contract
3. **(85%)** Cache headers on `@latest` combo — short TTL? Getting this wrong serves stale code to every developer indefinitely

**Step 5 — Phase 2 (boundary tests):**

4. **(50%)** Single-package combo — degenerate but valid, shouldn't 500
5. **(30%)** Mixed versions — `core@0.18.0,query@latest` — coherent response or silent incompatibility?
6. **(15%)** Unknown package name — clear 404 or cryptic Worker error?
7. **(5%)** Extremely long combo URL (20+ packages) — graceful degradation

**Step 6 — Run and classify:** The phase 1 findings (cache headers untested, synthetic-only URLs) are the headline. The boundary tests add color but the inventory is the story.

---

## Quick Reference

**Subagent lifecycle:** Spawned with branch + description → load skills → read code → inventory → write tests → run → return report

**Before writing tests:**
1. Load `contributing/testing` + `contributing/testing-internals` via MCP
2. Read the implementation thoroughly
3. Read all existing tests — build the inventory first

**The three phases (sequential, each feeds the next):**

| Phase | Question | Decision |
|---|---|---|
| **Inventory** | What obvious paths have no tests at all? | Decide where to focus — common gaps first |
| **Common paths** | Are the things every user does actually tested with realistic inputs? | Write and run these tests first |
| **Boundaries** | What breaks at the edges of legitimate usage? | Write and run after common paths |

**Report structure:** Inventory → Common-path findings → Boundary findings → Verdict

**For each failing test:**
- What it tests (one sentence)
- Real-world scenario (concrete, not abstract)
- Frequency score with justification
- Severity and recommendation

**Valid verdicts:**
- Gaps found → prioritized by frequency x severity
- Clean bill of health → what was tested and why it's sufficient
- No practical tests needed → why existing coverage is sufficient

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Writing Tests** | `testing` | You need test mechanics — environments, Vitest patterns, file placement |
| **Test Infrastructure** | `testing-internals` | You need to understand config, CI pipeline, coverage setup |
| **Code Review** | `code-review` | Reviewing code quality and standards compliance (runs after testing) |
| **Manage Roadmap** | `manage-roadmap` | Understanding the plan execution workflow this skill fits into |

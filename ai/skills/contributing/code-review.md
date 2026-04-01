---
title: Code Review Process
description: How to self-review PRs in this project — 5 parallel Opus agents with different lenses, iterative fix-and-rerun until clean. Adapted from Anthropic's code-review skill with project-specific adjustments.
keywords: [code review, PR review, self-review, quality]
audience: contributing
skill: code-review
type: skill
---

# Code Review Process

> **Skill:** `code-review`
> **When to use:** After opening a PR, before requesting user review.

## Overview

Self-review uses 5 parallel Opus agents, each examining the PR diff through a different lens. Fix issues found, then rerun until both the agent and the user agree no relevant fixes remain.

## What to Skip (Self-Review Only)

When you authored the PR, skip:
- **Eligibility checks** — you know it's open and not a draft
- **PR summary** — you know what it does

## Compliance Source of Truth

The source of truth for project standards is `ai/` (skills, context docs), not CLAUDE.md (which is a symlink to AGENTS.md and serves as a landing page for external agents).

## The 5 Review Agents

Launch all 5 in parallel. Always use **Opus** — never Sonnet or Haiku for review agents.

Each agent runs `gh pr diff {number}` and examines the changes through its lens:

### Agent 1 — Standards Compliance
Audit changes against project standards in CLAUDE.md and `ai/skills/`. Check code formatting, commit format conventions, non-obvious patterns, and documented conventions.

### Agent 2 — Shallow Bug Scan
Read the implementation file changes and scan for obvious bugs. Focus on logic errors, regex edge cases, incorrect key construction, missing error handling, content-type or cache header bugs. Ignore documentation, skill files, and plan files. Focus on large bugs, avoid nitpicks and likely false positives.

### Agent 3 — Git History Context
Read git blame and history of modified files. Check if new changes conflict with patterns established in previous commits or break assumptions from existing code.

### Agent 4 — Previous PR Comments
Find previous PRs that touched the same files. Check their comments for feedback that may also apply to the current changes.

### Agent 5 — Code Comment Compliance
Read existing code comments in the modified files. Check if the new code complies with guidance in those comments (e.g., "Updated when new packages are added", "Source of truth:" markers).

## Handling Results

### Present all findings to the user

Do not silently triage which issues matter. Present every finding from every agent with:
- The file and line reference
- Why it was flagged
- Which agent found it

The user decides what to fix, what to defer, and what to accept.

### Scoring (from Anthropic's rubric)

For each issue, assess confidence on a 0-100 scale:

| Score | Meaning |
|---|---|
| 0 | False positive — doesn't stand up to light scrutiny, or is pre-existing |
| 25 | Might be real, but may also be false positive. Stylistic issues not explicitly called out in standards. |
| 50 | Verified real, but may be a nitpick or rarely hit in practice. Not very important relative to the rest of the PR. |
| 75 | Verified, very likely to be hit in practice. The existing approach is insufficient. Directly impacts functionality or explicitly mentioned in project standards. |
| 100 | Confirmed real, will happen frequently. Evidence directly confirms this. |

### What counts as a false positive

From Anthropic's code-review skill (verbatim):

- Pre-existing issues
- Something that looks like a bug but is not actually a bug
- Pedantic nitpicks that a senior engineer wouldn't call out
- Issues that a linter, typechecker, or compiler would catch (eg. missing or incorrect imports, type errors, broken tests, formatting issues, pedantic style issues like newlines). No need to run these build steps yourself -- it is safe to assume that they will be run separately as part of CI.
- General code quality issues (eg. lack of test coverage, general security issues, poor documentation), unless explicitly required in CLAUDE.md
- Issues that are called out in CLAUDE.md, but explicitly silenced in the code (eg. due to a lint ignore comment)
- Changes in functionality that are likely intentional or are directly related to the broader change
- Real issues, but on lines that the user did not modify in their pull request

## Iterative Loop

After fixing issues from a round:

1. Commit and push fixes
2. Rerun all 5 agents against the updated PR diff
3. Present new findings to the user
4. Repeat until a round comes back clean

A round is "clean" when both the agents and the user agree there are no remaining issues worth fixing.

## Completion

After the final clean round, report the result to the user in conversation. No need to post a comment on the PR.

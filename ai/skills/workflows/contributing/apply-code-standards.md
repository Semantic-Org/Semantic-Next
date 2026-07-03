---
title: Apply Code Standards
description: Workflow for bringing existing code up to repo standards — the structure, naming, and comment pass. Run against a PR, package, or file that works but doesn't yet read like the codebase.
keywords: [refactor, cleanup, code standards, comment pass, rename, reorder, legibility, review]
audience: contributing
type: workflow
workflow: apply-code-standards
---

# AI Workflow: Apply Code Standards

**The prune / rename / reorder pass over working code**

This workflow exists because the shape doesn't converge on its own — historically the maintainer has had to push whole-package reshapes through review by hand (the schema package went from twelve verb files to its class shape across one long PR of prompted rejiggering). Running this pass proactively means the maintainer reviews polish, not structure.

The target is code that works and tests green but doesn't yet read like the codebase: agent output, a prototype graduating to a package, a PR before review. Read the `coding-standards` skill first — it defines the destination, this workflow is the route.

---

## Ground Rules

- **Read the whole unit before editing anything.** The full PR, the full package. You cannot judge a comment or a name without knowing what ships around it.
- **One file at a time, one commit per file.** `Refactor(scope): <file> standards pass`. Per-file commits make the review diffable on GitHub.
- **Tests after every file.** Behavior is invariant through this pass. A comment-and-structure commit that breaks a test has smuggled a semantic change.
- **Mechanical changes execute, semantic changes escalate.** Renames, reorders, comment rewrites, and code-reads-better swaps (`!isObject(x)` for a null-and-typeof chain) proceed without asking. Anything that changes behavior — a guard that looks wrong, an API that should merge — goes on the escalation ledger (below) instead of into the diff.
- **Hold big ideas until the end.** Collect them while passing through, present them as one batch when the sweep finishes. Never bundle a design change silently into a "cleanup" commit.

---

## Step 1: Read and Map

Read every shipping source file in the unit. Note per file:

- loose function families that share a threaded first argument (a class waiting to be named)
- classes whose member order tells no story
- names that describe mechanism instead of intent
- comment density and what the comments narrate
- vocabulary drift (two words for one concept, or one word meaning two things across files)

Do not edit during this step. The map decides file order: structural offenders first, comment-only files last.

## Step 2: Structure Pass (per file)

Apply the `coding-standards` anatomy:

1. **Find the noun.** If the file is a bag of functions threading one argument, reshape into a class that owns it. This is the largest transform in the pass — when it applies, do it first and alone in its own commit.
2. **Reorder the class to the house anatomy**: brand, adjustable statics, `static defaults` + extend constructor, then boxed concern sections in use order, machinery late, interop last, lowercase factory closing the file.
3. **Colocate private helpers** directly after their caller. Convert out-param accumulators to pure `<noun>From(input)` builders.
4. **Small classes stay flat** — do not add section headers to a three-method class.

Reordering members and adding section headers changes no behavior; a full function-bag-to-class reshape does change the public surface — treat that as semantic and escalate first unless the unit is pre-release and the maintainer has already blessed the shape.

## Step 3: Naming Pass (per file)

1. List rename candidates: mechanism names, abbreviations, out-param verbs (`collect`, `walk` feeding an accumulator), identifiers the surrounding comments consistently call something else. That last signal is the strongest — when every comment says "the recompute engine" and the class says `ComputedIndex`, the class is misnamed. The corpus is the naming authority: before minting a replacement, grep for what neighboring layers, docs, and tests already call the concept and align to it.
2. **Shadow-grep before renaming.** For a rename `Old` → `New`, first grep for existing uses of `New`, locals that would shadow it, and params sharing the name. Sed cannot see scope — every collision found now is a bug avoided.
3. Rename mechanically: `git mv` for files (kebab-case follows the class), sed across the references, then a residual grep for the old name that must come back empty. Include `types/*.d.ts` and README references.
4. Update any comment that names the old identifier in the same commit.

## Step 4: Comment Pass (per file)

For each comment, in place:

1. **Delete what the code already says** — and what anyone who understands the package already knows. Method-level "what this does" docs go; the name, the code, and the `.d.ts` carry them.
2. **Reframe mechanism as intent.** Not "uses X because" but the goal, then the action: `// validates against siblings so needs doc`, `// cloned for safety`. Lead with the win when the point is performance.
3. **Compress to the kernel.** One line is the default. Multi-line survives only when each line carries a distinct fact a reader cannot reconstruct — a real trap, a cross-boundary invariant, a design tradeoff.
4. **Move comments to the exact line they explain** rather than stacking them at the method head. Merge adjacent stacks (`/* header */` butting a `//` line).
5. **Simplify code instead of commenting it.** If the comment explains a clunky expression, replace the expression with the utils vocabulary that says it directly and delete the comment.
6. **Orientation one-liners are welcome** where a name is dense: a usage example (`// Used to merge multiple schemas i.e. new Schema([A, B])`), a role label on idiom blocks (`// brand field`), a return shape on a resolver.
7. **File-lead comments shrink but survive** — the maintainer revoices these personally, so aim for short and accurate rather than perfect.
8. **Watch the jargon flags.** Words that encode internal mechanism as shorthand get replaced with plain intent verbs. Currently flagged: *pin*, *ride*, *gated* (as adjectives — the data layer's `gate` noun is established API). Keep the house vocabulary consistent: derive, release, seed, prune, notify, located/bound, advisory/authoritative.

Leave alone: tests (looser register), `.d.ts` JSDoc (API reference, a different genre), teaching artifacts (`types/sample.js`), README and guide prose (human-voiced).

## Step 5: Verify and Commit (per file)

1. Confirm the diff is what it claims. For a comment-only commit:

   ```bash
   git diff <file> | grep -E '^[+-]' | grep -vE '^[+-]{3}' | grep -vE '^[+-]\s*(//|/\*|\*|\*/|$)'
   ```

   Anything this prints is a code change — either intended (name it in the commit) or a mistake (fix it).
2. Run the package's tests. Then the dependents' tests when the file is imported across packages.
3. Commit per file, push on the maintainer's cadence for the branch.

## Step 6: The Escalation Ledger

While passing through, some findings are design problems wearing a comment:

- a comment that argues for a guard ("which is the source of truth?") — the constraint may be wrong, re-derive it from intent
- a naive case that silently degrades through an advanced verb
- two exports whose names suggest kinship their semantics don't have

Collect these with a one-sentence cost ledger each (X costs A, Y costs B) and present them as a batch at the end of the sweep. The maintainer rules; blessed items land as their own commits with tests, never folded into cleanup.

## Definition of Done

- every shipping source file passed structure, naming, and comments
- all suites green, per-file commits pushed
- old identifiers grep to zero across src, types, and docs
- the escalation ledger delivered — empty or ruled on
- vocabulary consistent across the unit (one term per concept)

---

## Related Skills

| Skill | Type | Use when... |
|-------|------|-------------|
| **coding-standards** | skill | The destination this workflow drives toward — read it first |
| **code-comments** | skill | The comment calibration in depth |
| **code-formatting** | skill | Voice and syntax-level conventions |
| **author-pull-requests** | skill | Writing up the PR once the pass lands |

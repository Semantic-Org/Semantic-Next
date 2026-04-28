# Agent Workspace

Per-developer scratch space. Plans, drafts, reports, screenshots, traces — anything supporting an in-flight task lives here. Nothing inside this folder is tracked by this repo (except this README).

## Setup (cross-machine sync)

Replace this directory with your personal workspace repo so files persist across machines.

**Symlink** (recommended — keeps the personal repo as its own logical thing):

```bash
rm -rf ai/workspace
ln -s ~/dev/semantic/workspace ai/workspace
```

**Subrepo** (clone the personal repo directly into this path):

```bash
rm -rf ai/workspace
git clone git@github.com:<you>/sui-workspace.git ai/workspace
```

Either way, this README disappears from your working tree after setup. Silence git noise with:

```bash
git update-index --skip-worktree ai/workspace/README.md
```

## Agent conventions

How agents file canonical work (plans, skills, research) is documented in `AGENTS.md` under `<agent_workspace>`. This folder is for in-flight scratch only.

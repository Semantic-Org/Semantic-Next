#!/usr/bin/env bash
# Gates the first edit to core framework source (packages/*/src) each session
# with a pointer to the core edit protocol, then allows the retry. Content
# lives in ai/skills/contributing/core-package-edits.md (MCP: core-package-edits).

input=$(cat)

read -r file_path session_id < <(node -e '
  const i = JSON.parse(require("fs").readFileSync(0, "utf8"));
  process.stdout.write((i.tool_input?.file_path ?? "") + " " + (i.session_id ?? "unknown") + "\n");
' <<<"$input" 2>/dev/null)
[ -n "$file_path" ] || exit 0

case "$file_path" in
  */packages/*/src/*) ;;
  *) exit 0 ;;
esac

marker="${TMPDIR:-/tmp}/claude-core-edit-ack-${session_id}"
if [ -f "$marker" ]; then
  exit 0
fi
touch "$marker"

cat >&2 << 'EOF'
Core edit gate: first edit to packages/*/src this session. The edit is paused, not denied.

Framework source has an ownership structure the target file may not show — the module
that owns a semantic is often not the file where the symptom lives. Before re-running:

  1. use_skill core-package-edits — the protocol: find the owning abstraction,
     extend existing shapes, match the package's signatures
  2. list_workflows — a path-specific workflow may exist for this change
     (add-signal-feature, add-query-method, add-template-syntax, ...)

Arrived here mid-task from other work? A scoped core fix lands cleaner when delegated
to a fresh agent briefed to explore the whole package first.

Re-run the edit to proceed.
EOF
exit 2

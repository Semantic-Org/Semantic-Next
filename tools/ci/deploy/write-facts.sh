#!/usr/bin/env bash
# Turn a deploy step's captured output into the facts file the report workflow
# reads. Reads url.txt / inspect.txt from the workspace root (written by the
# deploy step) rather than taking them as arguments, so a deploy URL never lands
# in a shell command line.
#
# Usage: write-facts.sh <target-id> <deploy-exit-code>
set -euo pipefail

id="$1"
code="$2"

mkdir -p deploy-facts
url="$(tail -1 url.txt 2>/dev/null || true)"
inspect="$(cat inspect.txt 2>/dev/null || true)"

if [ "$code" = "0" ] && [ -n "$url" ]; then
  jq -n --arg id "$id" --arg url "$url" --arg inspect "$inspect" \
    '{id: $id, status: "ready", url: $url} + (if $inspect != "" then {inspect: $inspect} else {} end)' \
    > "deploy-facts/$id.json"
else
  jq -n --arg id "$id" '{id: $id, status: "failed"}' > "deploy-facts/$id.json"
fi
cat "deploy-facts/$id.json"

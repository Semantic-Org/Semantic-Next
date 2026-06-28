#!/usr/bin/env bash
# Turn a deploy step's captured output into the facts file the report workflow
# reads. Reads url.txt from the workspace root (written by the deploy step)
# rather than taking it as an argument, so a deploy URL never lands in a shell
# command line.
#
# Usage: write-facts.sh <target-id> <deploy-exit-code>
set -euo pipefail

id="$1"
code="$2"

mkdir -p deploy-facts
url="$(tail -1 url.txt 2>/dev/null || true)"

if [ "$code" = "0" ] && [ -n "$url" ]; then
  jq -n --arg id "$id" --arg url "$url" '{id: $id, status: "ready", url: $url}' > "deploy-facts/$id.json"
else
  jq -n --arg id "$id" '{id: $id, status: "failed"}' > "deploy-facts/$id.json"
fi
cat "deploy-facts/$id.json"

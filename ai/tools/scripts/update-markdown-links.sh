#!/bin/bash
# Update Markdown Links Script
# Finds and replaces markdown link paths across all .md files in the ai/ directory
# Usage: ./update-markdown-links.sh <old-path> <new-path> [--dry-run]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    echo "Usage: $0 <old-path> <new-path> [--dry-run]"
    echo ""
    echo "Arguments:"
    echo "  old-path    The old path to replace (e.g., 'ai/agents/orchestrator.md')"
    echo "  new-path    The new path to use (e.g., 'ai/tools/sub-agents/orchestrator.md')"
    echo "  --dry-run   Preview changes without modifying files (optional)"
    echo ""
    echo "Examples:"
    echo "  # Preview changes"
    echo "  $0 'ai/agents/orchestrator.md' 'ai/tools/sub-agents/orchestrator.md' --dry-run"
    echo ""
    echo "  # Apply changes"
    echo "  $0 'ai/agents/orchestrator.md' 'ai/tools/sub-agents/orchestrator.md'"
    echo ""
    echo "Notes:"
    echo "  - Searches all .md files in the ai/ directory"
    echo "  - Updates both inline links [text](path) and reference links [text]: path"
    echo "  - Handles paths with and without leading slashes"
    echo "  - Escapes special regex characters in paths"
    exit 1
}

# Check arguments
if [ $# -lt 2 ]; then
    usage
fi

OLD_PATH="$1"
NEW_PATH="$2"
DRY_RUN=false

if [ "$3" = "--dry-run" ]; then
    DRY_RUN=true
fi

# Escape special regex characters
escape_regex() {
    echo "$1" | sed 's/[.[\*^$()+?{|]/\\&/g'
}

OLD_PATH_ESCAPED=$(escape_regex "$OLD_PATH")
NEW_PATH_ESCAPED=$(escape_regex "$NEW_PATH")

# Get absolute path to ai directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Markdown Link Update Tool${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Old path: ${RED}$OLD_PATH${NC}"
echo -e "New path: ${GREEN}$NEW_PATH${NC}"
echo -e "Search directory: $AI_DIR"
echo -e "Mode: $([ "$DRY_RUN" = true ] && echo "${YELLOW}DRY RUN${NC}" || echo "${GREEN}LIVE${NC}")"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Find all markdown files and search for the old path
MATCHES=0
FILES_CHANGED=0

# Create patterns for different link formats
# Pattern 1: Inline links [text](path)
PATTERN1="\\](${OLD_PATH_ESCAPED})"
REPLACE1="](${NEW_PATH}"

# Pattern 2: Inline links with leading slash [text](/path)
PATTERN2="\\](/${OLD_PATH_ESCAPED})"
REPLACE2="](/${NEW_PATH}"

# Pattern 3: Reference-style links [text]: path
PATTERN3="^([[:space:]]*\\[.*\\]:[[:space:]]*)(${OLD_PATH_ESCAPED})"
REPLACE3="\\1${NEW_PATH}"

# Pattern 4: Reference-style links with leading slash
PATTERN4="^([[:space:]]*\\[.*\\]:[[:space:]]*)(/${OLD_PATH_ESCAPED})"
REPLACE4="\\1/${NEW_PATH}"

# Pattern 5: Backtick-quoted paths `path`
PATTERN5="\`(${OLD_PATH_ESCAPED})\`"
REPLACE5="\`${NEW_PATH}\`"

# Pattern 6: Backtick-quoted paths with leading slash
PATTERN6="\`(/${OLD_PATH_ESCAPED})\`"
REPLACE6="\`/${NEW_PATH}\`"

# Pattern 7: Plain text paths in markdown (standalone on line)
PATTERN7="^([[:space:]]*[-*][[:space:]]+.*:?[[:space:]]*)(${OLD_PATH_ESCAPED})([[:space:]]*$)"
REPLACE7="\\1${NEW_PATH}\\3"

# Pattern 8: Plain text paths with leading slash
PATTERN8="^([[:space:]]*[-*][[:space:]]+.*:?[[:space:]]*)(/${OLD_PATH_ESCAPED})([[:space:]]*$)"
REPLACE8="\\1/${NEW_PATH}\\3"

while IFS= read -r file; do
    # Check if file contains the old path
    if grep -qE "(${OLD_PATH_ESCAPED}|/${OLD_PATH_ESCAPED})" "$file"; then
        MATCHES=$((MATCHES + 1))
        FILES_CHANGED=$((FILES_CHANGED + 1))

        REL_PATH="${file#$AI_DIR/}"
        echo -e "${YELLOW}📄 $REL_PATH${NC}"

        # Show matching lines with context
        grep -nE "(${OLD_PATH_ESCAPED}|/${OLD_PATH_ESCAPED})" "$file" | while IFS=: read -r line_num line_content; do
            echo -e "   ${BLUE}Line $line_num:${NC} $line_content"
        done

        if [ "$DRY_RUN" = false ]; then
            # Apply all replacements using sed
            sed -E -i.bak \
                -e "s|${PATTERN1}|${REPLACE1}|g" \
                -e "s|${PATTERN2}|${REPLACE2}|g" \
                -e "s|${PATTERN3}|${REPLACE3}|g" \
                -e "s|${PATTERN4}|${REPLACE4}|g" \
                -e "s|${PATTERN5}|${REPLACE5}|g" \
                -e "s|${PATTERN6}|${REPLACE6}|g" \
                -e "s|${PATTERN7}|${REPLACE7}|g" \
                -e "s|${PATTERN8}|${REPLACE8}|g" \
                "$file"

            # Remove backup file
            rm -f "${file}.bak"

            echo -e "   ${GREEN}✓ Updated${NC}"
        else
            echo -e "   ${YELLOW}⚠ Would update (dry run)${NC}"
        fi
        echo ""
    fi
done < <(find "$AI_DIR" -type f -name "*.md")

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN COMPLETE${NC}"
    echo -e "Found ${YELLOW}$FILES_CHANGED${NC} file(s) that would be updated"
    echo ""
    echo -e "To apply these changes, run:"
    echo -e "${GREEN}$0 '$OLD_PATH' '$NEW_PATH'${NC}"
else
    echo -e "${GREEN}COMPLETE${NC}"
    echo -e "Updated ${GREEN}$FILES_CHANGED${NC} file(s)"
fi
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

exit 0

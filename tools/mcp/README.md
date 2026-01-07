# Semantic UI MCP Server

An MCP (Model Context Protocol) server that provides Semantic UI component specs to LLMs for authoring assistance.

## What It Does

This server exposes Semantic UI component specifications to AI assistants, enabling them to:

- Discover available components
- Understand component APIs (attributes, variations, states, slots)
- Generate correct markup with proper tag names and attributes
- Access usage examples embedded in specs

## Installation

### From npm (when published)

```bash
npm install -g @semantic-ui/mcp-server
```

### From source (local development)

```bash
cd tools/mcp-server
npm install
npm run build
```

## Configuration

### Claude Code (CLI)

Install globally from npm:

```bash
claude mcp add --transport stdio semantic-ui -- npx -y @semantic-ui/mcp-server
```

Or from a local build:

```bash
claude mcp add --transport stdio semantic-ui -- node /path/to/tools/mcp-server/dist/index.js
```

Manage with:

```bash
claude mcp list              # List installed servers
claude mcp get semantic-ui   # Show server details
claude mcp remove semantic-ui # Remove server
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "semantic-ui": {
      "command": "npx",
      "args": ["-y", "@semantic-ui/mcp-server"]
    }
  }
}
```

## Available Tools

### list_components

Lists all available Semantic UI components with their tag names and descriptions.

**Parameters:** None

**Returns:**
```json
[
  {
    "tagName": "ui-button",
    "name": "Button",
    "description": "A button indicates a possible user action.",
    "pluralTagName": "ui-buttons"
  },
  ...
]
```

### get_component

Gets the full spec for a component, including child components.

**Parameters:**
- `query` (string): Component name or tag name. Accepts:
  - Tag names: `ui-button`, `menu-item`
  - Short forms: `button`, `menu`
  - Display names: `Button`, `Menu Item`

**Returns:**
```json
{
  "resolved": "ui-menu",
  "spec": { /* full component spec */ },
  "children": [ /* child component specs, e.g., menu-item */ ]
}
```

## Component Spec Structure

Each spec contains:

| Field | Description |
|-------|-------------|
| `tagName` | HTML element name (`ui-button`) |
| `name` | Display name (`Button`) |
| `description` | Component purpose |
| `content` | Slots and content attributes |
| `types` | Behavioral variations (mutually exclusive) |
| `states` | Runtime states (disabled, loading, active) |
| `variations` | Visual variations (size, color, can combine) |
| `settings` | Configurable properties |
| `events` | Custom events emitted |

## Development

```bash
# Bundle specs from source
npm run bundle-specs

# Build TypeScript
npm run build

# Run server directly
npm start
```

## How It Works

1. At build time, specs are bundled from `src/primitives/**/specs/*.spec.json`
2. Specs are written to `dist/data/` for runtime access
3. Server exposes specs via MCP protocol over stdio
4. LLMs query specs to understand component APIs before generating markup

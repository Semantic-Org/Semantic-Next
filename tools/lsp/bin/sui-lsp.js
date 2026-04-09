#!/usr/bin/env node

// Start the Semantic UI Language Server via stdio transport.
// Usage: sui-lsp --stdio
//
// Editor integration:
//   Neovim (lspconfig):  cmd = { 'sui-lsp', '--stdio' }
//   Helix:               command = 'sui-lsp' args = ['--stdio']
//   Sublime LSP:         command = ['sui-lsp', '--stdio']
//   VS Code:             use the @semantic-ui/vscode extension instead (uses IPC)

import '../src/server.js';

export default function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Semantic UI MCP Server</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Lato', sans-serif; font-weight: 300; max-width: 640px; margin: 80px auto; padding: 0 20px; color: #e0e0e0; background: #1a1a1a; line-height: 1.6; }
    h1 { font-weight: 700; font-size: 1.4em; }
    h2 { font-weight: 400; font-size: 1.1em; margin-top: 2em; }
    code { background: #2a2a2a; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    .code-block { position: relative; }
    .code-block pre { background: #2a2a2a; padding: 16px; padding-right: 48px; border-radius: 8px; overflow-x: auto; margin: 8px 0; }
    .copy-btn { position: absolute; top: 8px; right: 8px; background: none; border: 1px solid #444; border-radius: 4px; padding: 4px 6px; cursor: pointer; color: #999; transition: color 0.15s, border-color 0.15s; }
    .copy-btn:hover { color: #e0e0e0; border-color: #666; }
    .copy-btn.copied { color: #4ade80; border-color: #4ade80; }
    .copy-btn svg { display: block; width: 16px; height: 16px; }
    a { color: #7eb8f7; }
    p { margin: 0.5em 0; }
  </style>
</head>
<body>
  <h1>Semantic UI MCP Server</h1>
  <p>This is the <a href="https://modelcontextprotocol.io">Model Context Protocol</a> server for <a href="https://next.semantic-ui.com">Semantic UI</a>.</p>
  <h2>Setup</h2>
  <p>Add to Claude Code:</p>
  <div class="code-block">
    <button class="copy-btn" onclick="copyCode(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
    <pre>claude mcp add --transport http semantic-ui https://mcp.semantic-ui.com/mcp</pre>
  </div>
  <p>Or add to <code>.mcp.json</code>:</p>
  <div class="code-block">
    <button class="copy-btn" onclick="copyCode(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
    <pre>{
  "mcpServers": {
    "semantic-ui": {
      "type": "http",
      "url": "https://mcp.semantic-ui.com/mcp"
    }
  }
}</pre>
  </div>
  <h2>Endpoint</h2>
  <p>MCP protocol endpoint: <code>POST /mcp</code></p>
  <script>
    function copyCode(btn) {
      const text = btn.parentElement.querySelector('pre').textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1500);
      });
    }
  </script>
</body>
</html>`);
}

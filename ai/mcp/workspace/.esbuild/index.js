var index_default = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Workspace - Semantic UI Component Testing</title>
    <link rel="stylesheet" href="/dist/semantic-ui.css">
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .component-list {
            margin-top: 2rem;
        }
        .component-link {
            display: block;
            padding: 1rem;
            margin: 0.5rem 0;
            background: #f1f3f4;
            text-decoration: none;
            color: #333;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .component-link:hover {
            background: #e8eaed;
        }
        .code {
            background: #f1f3f4;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>\u{1F916} AI Workspace</h1>
        <p>Simple testing environment for Semantic UI components.</p>
        
        <h2>Getting Started</h2>
        <ol>
            <li>Create component files in <span class="code">ai/workspace/components/my-component/</span></li>
            <li>Use the standard pattern: <span class="code">component.js</span>, <span class="code">component.html</span>, <span class="code">component.css</span></li>
            <li>Test your component at <span class="code">/component.html?name=my-component</span></li>
        </ol>

        <h2>Quick Links</h2>
        <div class="component-list">
            <a href="/component.html" class="component-link">
                \u{1F4DD} Component Tester - Test any component
            </a>
            <a href="/component.html?name=example" class="component-link">
                \u{1F3AF} Example Component - See how it works
            </a>
        </div>

        <h2>Available Components</h2>
        <div id="components-list">
            <p>Loading components...</p>
        </div>
    </div>

    <script type="module">
        // Scan for available components
        async function loadComponentsList() {
            try {
                const response = await fetch('/components/');
                const html = await response.text();
                
                // Simple parsing of directory listing
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('a[href]');
                
                const components = Array.from(links)
                    .map(link => link.getAttribute('href'))
                    .filter(href => href && href !== '../' && href.endsWith('/'))
                    .map(href => href.replace('/', ''));

                const container = document.getElementById('components-list');
                if (components.length > 0) {
                    container.innerHTML = components.map(name => 
                        \`<a href="/component.html?name=\${name}" class="component-link">
                            \u{1F9E9} \${name}
                        </a>\`
                    ).join('');
                } else {
                    container.innerHTML = '<p>No components found. Create your first component!</p>';
                }
            } catch (error) {
                document.getElementById('components-list').innerHTML = 
                    '<p>Could not load components list.</p>';
            }
        }

        loadComponentsList();
    <\/script>
</body>
</html>`;
export { index_default as default };
// # sourceMappingURL=index.js.map

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';

/*
  Resolves the .js component file that owns a given .html template URI.
  Convention-based: button.html → button.js in the same directory.
  Fallback: scans sibling .js files for a reference to the template filename.
*/
export function resolveComponentFile(templateUri) {
  const templatePath = uriToPath(templateUri);
  if (!templatePath) { return null; }

  const dir = dirname(templatePath);
  const base = basename(templatePath, '.html');

  // Convention: button.html → button.js
  const conventionPath = resolve(dir, `${base}.js`);
  if (existsSync(conventionPath)) {
    return conventionPath;
  }

  // Fallback: scan sibling .js files for a reference to this template
  try {
    const htmlFile = basename(templatePath);
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.js') || file.endsWith('.spec.js') || file.endsWith('.component.js')) {
        continue;
      }
      const jsPath = resolve(dir, file);
      try {
        if (readFileSync(jsPath, 'utf8').includes(htmlFile)) {
          return jsPath;
        }
      }
      catch { /* skip unreadable */ }
    }
  }
  catch { /* dir not readable */ }

  return null;
}

/*
  Converts a document URI to a filesystem path.
  Handles file:// and vscode-remote://wsl+distro/ schemes.
*/
export function uriToPath(uri) {
  try {
    const parsed = new URL(uri);

    // Standard file URI
    if (parsed.protocol === 'file:') {
      let p = decodeURIComponent(parsed.pathname);
      // Windows: /C:/path → C:/path
      if (/^\/[A-Z]:/i.test(p)) { p = p.slice(1); }
      return p;
    }

    // VSCode Remote WSL: vscode-remote://wsl+Ubuntu/home/jack/...
    if (parsed.protocol === 'vscode-remote:' && parsed.hostname?.startsWith('wsl+')) {
      // pathname is /home/jack/... (the Linux path, directly usable in WSL)
      return decodeURIComponent(parsed.pathname);
    }
  }
  catch { /* unparseable URI */ }

  return null;
}

import { each } from '@semantic-ui/utils';

/* These are top level to make it easier to format */

export const htmlHideMarkerStart = `<!-- playground-hide -->`;
export const htmlHideMarkerEnd = `<!-- playground-hide-end -->`;
export const htmlFoldMarkerStart = `<!-- playground-fold -->`;
export const htmlFoldMarkerEnd = `<!-- playground-fold-end -->`;

export const hideMarkerStart = `/* playground-hide */`;
export const hideMarkerEnd = `/* playground-hide-end */`;

export const foldMarkerStart = `/* playground-fold */`;
export const foldMarkerEnd = `/* playground-fold-end */`;

export const hideCode = ({ text = '', isHTML = false, removeLines = true } = {}) => {
  const start = (isHTML) ? htmlHideMarkerStart : hideMarkerStart;
  const end = (isHTML) ? htmlHideMarkerEnd : hideMarkerEnd;
  let html = `${start}${text}${end}`;
  if (removeLines) {
    html = html.replace(/[\r\n]+/g, '');
  }
  return html;
};
export const foldCode = ({ text = '', isHTML = false, removeLines = true } = {}) => {
  const start = (isHTML) ? htmlFoldMarkerStart : foldMarkerStart;
  const end = (isHTML) ? htmlFoldMarkerEnd : foldMarkerEnd;
  let html = `${start}${text}${end}`;
  if (removeLines) {
    html = html.replace(/[\r\n]+/g, '');
  }
  return html;
};
const indentLines = (str, spaces = 2) => {
  const indent = ' '.repeat(spaces);
  return str.split('\n').map(line => `${indent}${line}`).join('\n');
};

export const componentJSBefore = ``;
export const componentJSAfter = ``;

export const componentHTMLBefore = ``;
export const componentHTMLAfter = ``;

export const componentCSSBefore = ``;
export const componentCSSAfter = ``;

export const isStaticBuild = Boolean(process.env.VERCEL_URL);

// we can use the node_modules path for imports when running in server mode
// this will let you check examples/playground against local versions of packages
// instead of tagged npm versions
export const packageBase = isStaticBuild
  ? 'https://cdn.jsdelivr.net/npm'
  : `${import.meta.env.SITE}/node_modules`;

const suiBase = isStaticBuild
  ? `${packageBase}/@semantic-ui/core@${PACKAGE_VERSION}`
  : `${packageBase}/@semantic-ui/core`;

export const errorJS = `
  const ErrorInterceptor = {
    init() {
      this.originalOnerror = window.onerror;
      window.onerror = this.handleError.bind(this);
      window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
    },

    formatError(error, source, line, col) {
      let message = "";
      const file = source.split('/').pop();
      message += \`<span class="error-name">\${error.name}: \${error.message}</span>\`;
      message += \`<div class="error-location">at \${file}:\${line}:\${col}</div>\`;
      return message;
    },

    handleError(msg, source, line, col, error) {
      const newHash = \`\${msg}\${source}\${line}\`;
      if(this.lastHash == newHash) {
        return;
      }
      this.lastHash = newHash;
      let container = document.getElementById('error-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'error-container';
        document.body.appendChild(container);
      };

      const errorDiv = document.createElement('div');
      errorDiv.classList.add('error-item')

      const formattedError = this.formatError(error, source, line, col);
      errorDiv.innerHTML = formattedError;

      container.appendChild(errorDiv);

      if (this.originalOnerror) {
        return this.originalOnerror(msg, source, line, col, error);
      }
      return false;
    },

    handleRejection(event) {
      const reason = event.reason;
      const message = reason?.message || 'Promise Rejection';
      this.handleError(message, 'Promise', 0, 0, reason);
    },

    clear() {
      const container = document.getElementById('error-container');
      if (container) {
        container.innerHTML = '';
      }
    }
};

  // Auto-initialize
  ErrorInterceptor.init();

  export default ErrorInterceptor;
`;

export const logJS = `${hideMarkerStart}
// Store references to original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  clear: console.clear,
  table: console.table,
  group: console.group,
  groupEnd: console.groupEnd,
  groupCollapsed: console.groupCollapsed
};

let groupLevel = 0;
let groupStack = [];

// Enhanced console.clear
console.clear = function() {
  originalConsole.clear.apply(console, arguments);
  const container = document.getElementById('log-container');
  if(container) {
    container.innerHTML = '';
  }
  groupLevel = 0;
  groupStack = [];
};

// Helper to create log container
function getLogContainer() {
  let logContainer = document.getElementById('log-container');
  if (!logContainer) {
    logContainer = document.createElement('div');
    logContainer.id = 'log-container';
    document.body.appendChild(logContainer);
  }
  return logContainer;
}

// Helper to create log entry
function createLogEntry(messages, type = 'log', collapsed = false) {
  const logContainer = getLogContainer();
  const logEntry = document.createElement('div');
  logEntry.className = \`log-entry log-\${type}\`;
  
  // Add indentation for groups
  if (groupLevel > 0) {
    logEntry.style.paddingLeft = \`\${groupLevel * 20}px\`;
    logEntry.classList.add('log-grouped');
  }
  
  // Add collapse functionality for groups
  if (type === 'group') {
    logEntry.classList.add('log-group-header');
    if (collapsed) {
      logEntry.classList.add('collapsed');
    }
    logEntry.style.cursor = 'pointer';
    logEntry.onclick = function() {
      this.classList.toggle('collapsed');
      // Toggle visibility of following grouped items
      let next = this.nextElementSibling;
      const targetLevel = groupLevel;
      while (next && (next.classList.contains('log-grouped') || next.classList.contains('log-group-header'))) {
        const nextLevel = (next.style.paddingLeft.match(/\\d+/) || [0])[0] / 20;
        if (nextLevel <= targetLevel) break;
        next.style.display = this.classList.contains('collapsed') ? 'none' : 'block';
        next = next.nextElementSibling;
      }
    };
  }
  
  logEntry.innerHTML = messages;
  logContainer.appendChild(logEntry);
  return logEntry;
}

// Enhanced console.log
console.log = function() {
  originalConsole.log.apply(console, arguments);
  const messages = Array.from(arguments).map(arg => {
    // Skip formatting for primitive arguments at top level
    const skipFormat = (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean');
    return formatValue(arg, skipFormat);
  }).join(' ');
  createLogEntry(messages, 'log');
};

// Console.warn
console.warn = function() {
  originalConsole.warn.apply(console, arguments);
  const messages = Array.from(arguments).map(arg => {
    const skipFormat = (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean');
    return formatValue(arg, skipFormat);
  }).join(' ');
  createLogEntry(\`⚠️ \${messages}\`, 'warn');
};

// Console.error
console.error = function() {
  originalConsole.error.apply(console, arguments);
  const messages = Array.from(arguments).map(arg => {
    const skipFormat = (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean');
    return formatValue(arg, skipFormat);
  }).join(' ');
  createLogEntry(\`❌ \${messages}\`, 'error');
};

// Console.info
console.info = function() {
  originalConsole.info.apply(console, arguments);
  const messages = Array.from(arguments).map(arg => {
    const skipFormat = (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean');
    return formatValue(arg, skipFormat);
  }).join(' ');
  createLogEntry(\`ℹ️ \${messages}\`, 'info');
};

// Console.table
console.table = function(data) {
  originalConsole.table.apply(console, arguments);
  if (Array.isArray(data) || (typeof data === 'object' && data !== null)) {
    const tableHTML = createTableHTML(data);
    createLogEntry(tableHTML, 'table');
  } else {
    createLogEntry(formatValue(data), 'table');
  }
};

// Console.group
console.group = function() {
  originalConsole.group.apply(console, arguments);
  const label = arguments.length > 0 ? Array.from(arguments).join(' ') : 'Group';
  groupStack.push({ label, level: groupLevel });
  createLogEntry(\`▼ \${label}\`, 'group');
  groupLevel++;
};

// Console.groupCollapsed  
console.groupCollapsed = function() {
  originalConsole.groupCollapsed.apply(console, arguments);
  const label = arguments.length > 0 ? Array.from(arguments).join(' ') : 'Group';
  groupStack.push({ label, level: groupLevel });
  createLogEntry(\`▶ \${label}\`, 'group', true);
  groupLevel++;
};

// Console.groupEnd
console.groupEnd = function() {
  originalConsole.groupEnd.apply(console, arguments);
  if (groupLevel > 0) {
    groupLevel--;
    groupStack.pop();
  }
};

// Create table HTML for console.table
function createTableHTML(data) {
  if (Array.isArray(data)) {
    if (data.length === 0) return '<div class="empty-table">Empty Array</div>';
    
    // Check if array contains objects
    const firstItem = data[0];
    if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
      const headers = [...new Set(data.flatMap(item => Object.keys(item || {})))];
      let tableHTML = '<table class="console-table"><thead><tr><th>(index)</th>';
      headers.forEach(header => {
        tableHTML += \`<th>\${header}</th>\`;
      });
      tableHTML += '</tr></thead><tbody>';
      
      data.forEach((item, index) => {
        tableHTML += \`<tr><td class="table-index">\${index}</td>\`;
        headers.forEach(header => {
          const value = item?.[header];
          tableHTML += \`<td>\${formatValue(value, false, true)}</td>\`;
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';
      return tableHTML;
    }
  }
  
  // Handle objects or simple arrays
  if (typeof data === 'object' && data !== null) {
    const entries = Array.isArray(data) ? data.map((val, idx) => [idx, val]) : Object.entries(data);
    if (entries.length === 0) return '<div class="empty-table">Empty Object</div>';
    
    let tableHTML = '<table class="console-table"><thead><tr><th>(index)</th><th>Value</th></tr></thead><tbody>';
    entries.forEach(([key, value]) => {
      tableHTML += \`<tr><td class="table-index">\${key}</td><td>\${formatValue(value, false, true)}</td></tr>\`;
    });
    tableHTML += '</tbody></table>';
    return tableHTML;
  }
  
  return formatValue(data);
}

function formatValue(value, skipFormat = false, inTable = false) {
  if (skipFormat) {
    return String(value);
  }
  
  if (value === null) {
    return \`<span class="json-null">null</span>\`;
  } else if (value === undefined) {
    return \`<span class="json-undefined">undefined</span>\`;
  } else if (typeof value === 'string') {
    return \`<span class="json-string">"\${value}"</span>\`;
  } else if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return \`<span class="json-nan">NaN</span>\`;
    } else if (!Number.isFinite(value)) {
      return \`<span class="json-infinity">\${value}</span>\`;
    }
    return \`<span class="json-number">\${value}</span>\`;
  } else if (typeof value === 'boolean') {
    return \`<span class="json-boolean">\${value}</span>\`;
  } else if (typeof value === 'symbol') {
    return \`<span class="json-symbol">\${value.toString()}</span>\`;
  } else if (typeof value === 'function') {
    const funcStr = value.toString();
    const isArrow = funcStr.includes('=>');
    const funcName = value.name || 'anonymous';
    if (inTable) {
      return \`<span class="json-function">ƒ \${funcName}()</span>\`;
    }
    return \`<span class="json-function">ƒ \${funcName}() { \${isArrow ? funcStr : '...'} }</span>\`;
  } else if (value instanceof Date) {
    return \`<span class="json-date">\${value.toISOString()}</span>\`;
  } else if (value instanceof RegExp) {
    return \`<span class="json-regexp">\${value.toString()}</span>\`;
  } else if (value instanceof Error) {
    return \`<span class="json-error">\${value.name}: \${value.message}</span>\`;
  } else if (Array.isArray(value)) {
    if (inTable) {
      return \`<span class="json-array">Array(\${value.length})</span>\`;
    }
    if (value.length === 0) {
      return \`<span class="json-array">[]</span>\`;
    }
    const contents = value.map(item => formatValue(item)).join(', ');
    return \`<span class="json-array">[\${contents}]</span>\`;
  } else if (typeof value === 'object' && value !== null) {
    // Handle DOM elements
    if (value.nodeType) {
      const tagName = value.tagName?.toLowerCase() || 'node';
      const id = value.id ? \`#\${value.id}\` : '';
      const className = value.className ? \`.\${value.className.split(' ').join('.')}\` : '';
      return \`<span class="json-dom">&lt;\${tagName}\${id}\${className}&gt;</span>\`;
    }
    
    // Check if it's a custom class instance
    const constructor = value.constructor;
    const isCustomClass = constructor && constructor !== Object && constructor.name !== 'Object';
    
    if (isCustomClass) {
      const className = constructor.name;
      const keys = Object.keys(value);
      if (inTable) {
        return \`<span class="json-class">\${className} {...}</span>\`;
      }
      if (keys.length === 0) {
        return \`<span class="json-class">\${className} {}</span>\`;
      }
      const formattedObject = keys.slice(0, 3).map(key => {
        return \`<span class="json-key">"\${key}"</span>: \${formatValue(value[key])}\`;
      }).join(', ');
      const more = keys.length > 3 ? ', ...' : '';
      return \`<span class="json-class">\${className}</span> {\${formattedObject}\${more}}\`;
    }
    
    // Regular plain object
    const keys = Object.keys(value);
    if (inTable) {
      return \`<span class="json-object">Object {\${keys.length}}</span>\`;
    }
    if (keys.length === 0) {
      return \`<span class="json-object">{}</span>\`;
    }
    const formattedObject = keys.slice(0, 3).map(key => {
      return \`<span class="json-key">"\${key}"</span>: \${formatValue(value[key])}\`;
    }).join(', ');
    const more = keys.length > 3 ? ', ...' : '';
    return \`<span class="json-object">{\${formattedObject}\${more}}</span>\`;
  } else {
    return \`<span class="json-unknown">\${String(value)}</span>\`;
  }
}
${hideMarkerEnd}`;

export const headLibraryJS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<script src="${suiBase}/dist/bundle/semantic-ui.js" type="module"></script>
<link rel="stylesheet" href="${suiBase}/dist/semantic-ui.css"></link>
<script>
  document.querySelector('html').removeAttribute('style');
  if(localStorage.getItem('theme') == 'dark') {
    document.querySelector('html').classList.add('dark');
  }
  function dispatchCustomEvent(eventName) {
    const event = new CustomEvent(eventName, { bubbles: true, cancelable: true, composed: true });
    window.frameElement.dispatchEvent(event);
  }
  window.addEventListener('focus', function() {
    dispatchCustomEvent('iframefocus');
  }, true);
  window.addEventListener('blur', function() {
    dispatchCustomEvent('iframeblur');
  }, true);
  document.addEventListener('touchstart', function(){});
</script>
<style>
  html.dark body { background-color: #000000; }
  body { touch-action: auto; height: auto; overflow: auto; min-width: 0px; padding: 1rem }
</style>
`;

// TODO
const wrapConsole = `${hideMarkerStart}
${hideMarkerEnd}`;

export const errorCSS = `
  html #error-container {
    color: rgb(99 11 11);
    background-image: linear-gradient(45deg, oklch(0.93 0.05 14.52), oklch(0.94 0.02 14.16));
    border-left: 3px solid oklch(0.53 0.13 20.81);
  }
  html.dark #error-container {
    color: rgb(255 255 255);
    border: none;
    background-color: oklch(0.37 0.17 28.96);
    background-image: linear-gradient(45deg, var(--transparent-white), var(--transparent-black));
    border-radius: 4px;
  }
  #error-container {
    font-family: "Lato", sans-serif;
    gap: 5px;
    white-space: pre-wrap;
    margin: 10px 0;
    padding: 10px 14px;
    border-radius: 0px 4px 4px 0px;
    overflow: auto;
    max-height: 300px;

    .error-item {
    }
    .error-name {
    }
    .error-stack {
      color: var(--standard-30);
      margin-left: 20px;
    }
    .error-location {
      font-size: 13px;
      color: var(--standard-70);
    }
  }
`;

export const logCSS = `
  #log-container {
    font-family: monospace,
    system-ui,
     -apple-system, BlinkMacSystemFont,
     "Segoe UI",
     "Roboto",
     "Oxygen",
     "Ubuntu",
     "Cantarell",
     "Fira Sans",
     "Droid Sans",
     "Lato",
     sans-serif
    ;
    width: 100%;
    margin: 0;
    padding: 0 0.5rem;
    color: var(--text-color);

    .log-entry {
      border-top: var(--border);
      padding: 4px 0;
      word-wrap: break-word;
    }
    .log-entry:first-child {
      border-top: none;
    }

    /* Log types */
    .log-warn {
      background: rgba(255, 193, 7, 0.1);
      border-left: 3px solid #ffc107;
      padding-left: 8px;
    }
    .log-error {
      background: rgba(220, 53, 69, 0.1);
      border-left: 3px solid #dc3545;
      padding-left: 8px;
    }
    .log-info {
      background: rgba(13, 202, 240, 0.1);
      border-left: 3px solid #0dcaf0;
      padding-left: 8px;
    }

    /* Groups */
    .log-group-header {
      font-weight: bold;
      user-select: none;
      padding: 2px 0;
      color: var(--text-color);
    }
    .log-group-header.collapsed::before {
      content: '▶ ';
    }
    .log-group-header:not(.collapsed)::before {
      content: '▼ ';
    }
    .log-grouped {
      border-left: 1px solid var(--border-color);
      margin-left: 10px;
    }

    /* Tables */
    .console-table {
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 12px;
      width: 100%;
      max-width: 100%;
    }
    .console-table th,
    .console-table td {
      border: 1px solid var(--border-color);
      padding: 4px 8px;
      text-align: left;
      vertical-align: top;
    }
    .console-table th {
      background: var(--background-secondary);
      font-weight: bold;
      position: sticky;
      top: 0;
    }
    .console-table .table-index {
      background: var(--background-tertiary);
      font-weight: bold;
      text-align: center;
      min-width: 60px;
    }
    .empty-table {
      font-style: italic;
      color: var(--standard-40);
      padding: 8px 0;
    }

    /* Simple original colors matching dev tools console */
    .json-key { color: var(--standard-40); }
    .json-string { color: var(--text-color); }
    .json-number { color: var(--primary-text-color); }
    .json-boolean { color: var(--primary-text-color); }
    .json-null { color: var(--standard-40); font-style: italic; }
    .json-undefined { color: var(--standard-40); font-style: italic; }
    .json-nan { color: var(--primary-text-color); }
    .json-infinity { color: var(--primary-text-color); }
    .json-date { color: var(--purple-80); }
    .json-class { color: var(--secondary-text-color); font-weight: bold; }
    .json-function { color: var(--text-color); }
    .json-symbol { color: var(--text-color); }
    .json-regexp { color: var(--text-color); }
    .json-error { color: var(--text-color); font-weight: bold; }
    .json-array { color: var(--standard-40); }
    .json-object { color: var(--standard-40); }
    .json-dom { color: var(--purple-80); font-weight: bold; }
    .json-unknown { color: var(--standard-40); }
  }
`;

/*
  Handles files that should be included in iframe
  for injecting scripts
*/

export const getIndexHTMLBefore = function({ files = {}, includeLog } = {}) {
  // page styling always first
  const pageScripts = ['page.css'];

  // log always next
  if (includeLog) {
    pageScripts.push('log.js');
    pageScripts.push('log.css');
  }

  // error always before component
  pageScripts.push('error.js');
  pageScripts.push('error.css');

  // components always last
  if (files['index.js']) {
    pageScripts.push('index.js');
  }
  if (files['component.js']) {
    pageScripts.push('component.js');
  }

  // page code always last
  pageScripts.push('page.js');

  const getScriptCode = function() {
    let html = '';
    each(pageScripts, (src) => {
      if (files[src]?.generated) {
        html += `${htmlHideMarkerStart}`;
      }
      if (src.search('.js') >= 0) {
        html += `    <script src="./${src}" type="module"></script>\n`;
      }
      else if (src.search('.css') >= 0) {
        html += `    <link href="./${src}" rel="stylesheet">\n`;
      }
      if (files[src]?.generated) {
        html += `${htmlHideMarkerEnd}`;
      }
    });
    return html;
  };

  return `<html>
  <head>
${hideCode({ text: headLibraryJS, isHTML: true })} ${getScriptCode()}  </head>
  <body>
`;
};

export const pageHTMLAfter = `
  </body>
</html>`;

export const pageJSBefore = ``;
export const pageJSAfter = ``;

export const pageCSSBefore = ``;
export const pageCSSAfter = ``;

/*
  Provides content injections that should appear
  before and after file contents for playground
  based off filename
*/
export const getPlaygroundInjections = ({ files, includeLog } = {}) => {
  const pageHTMLBefore = getIndexHTMLBefore({ files, includeLog });
  let injections = {
    'component.js': {
      before: componentJSBefore,
      after: componentJSAfter,
    },
    'component.html': {
      before: componentHTMLBefore,
      after: componentHTMLAfter,
    },
    'component.css': {
      before: componentCSSBefore,
      after: componentCSSAfter,
    },
    'page.js': {
      before: pageJSBefore,
      after: pageJSAfter,
    },
    'page.html': {
      before: pageHTMLBefore,
      after: pageHTMLAfter,
    },
    'page.css': {
      before: pageCSSBefore,
      after: pageCSSAfter,
    },
  };
  return injections;
};

/*
  Adds file injections to files
*/
export const addPlaygroundInjections = (files, {
  includeLog = false,
} = {}) => {
  const fileInjections = getPlaygroundInjections({ files, includeLog });
  each(files, (file, name) => {
    if (fileInjections[name]) {
      const { before = '', after = '' } = fileInjections[name];
      let content = files[name].content.trim();
      // html will be inside <body> tag so we need to indent
      if (name == 'page.html') {
        content = indentLines(content, 4);
      }
      files[name].content = `${before}${content}${after}`;
    }
  });
  return files;
};

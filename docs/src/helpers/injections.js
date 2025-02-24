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
  if(removeLines) {
    html = html.replace(/[\r\n]+/g, '');
  }
  return html;
};
export const foldCode = ({ text = '', isHTML = false, removeLines = true } = {}) => {
  const start = (isHTML) ? htmlFoldMarkerStart : foldMarkerStart;
  const end = (isHTML) ? htmlFoldMarkerEnd : foldMarkerEnd;
  let html = `${start}${text}${end}`;
  if(removeLines) {
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

export const isStaticBuild = true || Boolean(process.env.VERCEL_URL);

// we can use the node_modules path for imports when running in server mode
// this will let you check examples/playground against local versions of packages
// instead of tagged npm versions
export const packageBase = isStaticBuild
  ? 'https://unpkg.com'
  : `${import.meta.env.SITE}/node_modules`
;

const suiBase = isStaticBuild
  ? `${packageBase}/@semantic-ui/core@latest`
  : `${packageBase}/@semantic-ui/core`
;

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
const oldClear = console.clear;
console.clear = function() {
  oldClear.apply(console, arguments); // Keep default logging to the console
  const container = document.getElementById('log-container');
  if(container) {
    container.innerHTML = '';
  }
};
const oldLog = console.log;
console.log = function() {
  oldLog.apply(console, arguments); // Keep default logging to the console

  // Create the container for logs if it does not exist
  let logContainer = document.getElementById('log-container');
  if (!logContainer) {
    const body = document.body;

    // Create a container for logs
    logContainer = document.createElement('div');

    // Append the log container to the body
    body.appendChild(logContainer);
  }

  // Convert all arguments to a readable string with styling
  const messages = Array.from(arguments).map(arg => {
    const skipFormat = typeof arg == 'string';
    return formatJSON(arg, skipFormat);
  }).join(' ');

  // Create and append the formatted message to the log container
  const formattedMessage = document.createElement('div'); // Use div to replicate console line
  formattedMessage.innerHTML = \`\${messages}\`; // Use innerHTML to include styled spans
  logContainer.appendChild(formattedMessage);
};

function formatJSON(value, skipFormat = false) {
  if(skipFormat) {
    return value;
  }
  if (typeof value === 'string') {
    return \`<span class="json-string">"\${value}"</span>\`;
  } else if (typeof value === 'number') {
    return \`<span class="json-number">\${value}</span>\`;
  } else if (typeof value === 'boolean') {
    return \`<span class="json-boolean">\${value}</span>\`;
  } else if (Array.isArray(value)) {
    const contents = value.map(item => formatJSON(item)).join(', ');
    return \`[\${contents}]\`;
  } else if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    const formattedObject = keys.map(key => {
      return \`<span class="json-key">"\${key}"</span>: \${formatJSON(value[key])}\`;
    }).join(', ');
    return \`{\${formattedObject}}\`;
  } else {
    return String(value);
  }
}
${hideMarkerEnd}`;


export const headLibraryJS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<script src="${suiBase}/dist/semantic-ui.js" type="module"></script>
<link rel="stylesheet" href="${suiBase}/dist/semantic-ui.css"></link>
<link rel="stylesheet" href="${suiBase}/dist/theme/base.css"></link>
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
`

export const logCSS = `
  #log-container {
    font-family: system-ui,
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
    color: var(--standard-60);

    .json-key { color: #656565; }
    .json-string { color: var(--primary-text-color); }
    .json-number { color: var(--primary-text-color); }
    .json-boolean { color: var(--primary-text-color); }
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
  if(includeLog) {
    pageScripts.push('log.js');
    pageScripts.push('log.css');
  }

  // error always before component
  pageScripts.push('error.js');
  pageScripts.push('error.css');

  // components always last
  pageScripts.push('index.js');
  pageScripts.push('component.js');

  // page code always last
  pageScripts.push('page.js');

  const getScriptCode = function() {
    let html = '';
    each(pageScripts, (src) => {
      if(files[src]?.generated) {
        html += `${htmlHideMarkerStart}`;
      }
      if(src.search('.js') >= 0) {
        html += `   <script src="./${src}" type="module"></script>\n`;
      }
      else if(src.search('.css') >= 0) {
        html += `   <link href="./${src}" rel="stylesheet">\n`;
      }
      if(files[src]?.generated) {
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
  const pageHTMLBefore = getIndexHTMLBefore({ files, includeLog});
  let injections = {
    'component.js': {
      before: componentJSBefore,
      after: componentJSAfter,
    },
    'component.html': {
      before: componentHTMLBefore,
      after: componentHTMLAfter
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
      after: pageHTMLAfter
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
    if(fileInjections[name]) {
      const { before = '', after = '' } = fileInjections[name];
      let content = files[name].content.trim();
      // html will be inside <body> tag so we need to indent
      if(name == 'page.html') {
        content = indentLines(content, 4);
      }
      files[name].content = `${before}${content}${after}`;
    }
  });
  return files;
};


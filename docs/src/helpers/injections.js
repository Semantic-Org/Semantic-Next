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

export const headLibraryJS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<script src="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.js" type="module"></script>
<link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.css">
<link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/theme/base.css">
<script>
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
`;

export const logJS = `${hideMarkerStart}
const oldLog = console.log;
console.log = function() {
  oldLog.apply(console, arguments); // Keep default logging to the console

  // Create the container for logs if it does not exist
  let logContainer = document.getElementById('log-container');
  if (!logContainer) {
    const body = document.body;

    // Create a container for logs
    logContainer = document.createElement('div');
    logContainer.id = 'log-container';
    logContainer.style.fontFamily = 'Consolas, "Courier New", monospace';
    logContainer.style.color = '#AAAAAA';
    logContainer.style.margin = '0';
    logContainer.style.width = '100%'; // Full width
    logContainer.style.boxSizing = 'border-box'; // Box-sizing

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

// TODO
const wrapConsole = `${hideMarkerStart}
${hideMarkerEnd}`;


export const logCSS = `${hideMarkerStart}
  .json-key { color: #656565; }
  .json-string { color: #58A6FF; }
  .json-number { color: #58A6FF; }
  .json-boolean { color: #58A6FF; }
${hideMarkerEnd}`;


/*
  Handles files that should be included in iframe
  for injecting scripts
*/

export const getIndexHTMLBefore = function({ files = {}, includeLog } = {}) {
  const pageScripts = [
    'component.js',
    'page.js',
    'page.css',
  ];

  if(includeLog) {
    pageScripts.unshift('index.js');
    pageScripts.unshift('log.js');
    pageScripts.unshift('log.css');
  }

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
${getScriptCode()} ${hideCode({ text: headLibraryJS, isHTML: true })}  </head>
  <body>
`;
};


export const pageHTMLAfter = `
  </body>
</html>`;

export const pageJSBefore = `${hideMarkerStart}
document.querySelector('html').removeAttribute('style');
if(localStorage.getItem('theme') == 'dark') {
  document.querySelector('html').classList.add('dark');
}${hideMarkerEnd}`;
export const pageJSAfter = ``;

export const pageCSSBefore = `${hideMarkerStart}body { height: auto; overflow: auto; min-width: 0px; padding: 1rem }${hideMarkerEnd}`;
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


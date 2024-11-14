import { asyncEach, get, each } from '@semantic-ui/utils';

/* These are top level to make it easier to format */

export const htmlHideMarkerStart = `<!-- playground-hide -->`;
export const htmlHideMarkerEnd = `<!-- playground-hide-end -->`;

export const hideMarkerStart = `/* playground-hide */`;
export const hideMarkerEnd = `/* playground-hide-end */`;

export const foldMarkerStart = `/* playground-fold */`;
export const foldMarkerEnd = `/* playground-fold-end */`;

export const componentJSBefore = ``;
export const componentJSAfter = ``;

export const componentHTMLBefore = ``;
export const componentHTMLAfter = ``;

export const componentCSSBefore = ``;
export const componentCSSAfter = ``;

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

export const getIndexHTMLBefore = function({ includeLog } = {}) {
  const pageScripts = [
    'component.js',
    'index.js',
    'index.css',
  ];

  if(includeLog) {
    pageScripts.unshift('log.js');
    pageScripts.unshift('log.css');
  }

  const getScriptCode = function() {
    let html = '';
    each(pageScripts, (src) => {
      if(src.search('.js') >= 0) {
        html += `\n<script src="./${src}" type="module"></script>`;
      }
      else if(src.search('.css') >= 0) {
        html += `\n<link href="./${src}" rel="stylesheet">`;
      }
    });
    return html;
  };

  return `${htmlHideMarkerStart}
  <html>
  <head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.js" type="module"></script>
  <link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.css"></link>
  <link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/theme/base.css"></link>
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
    document.addEventListener('touchstart', {});
  </script>
  <!-- This defines the component tag and makes it available on your page !-->
  ${getScriptCode()}
  </head>
  <body>
  ${htmlHideMarkerEnd}`;
};


export const indexHTMLAfter = `${htmlHideMarkerStart}</body></html>${htmlHideMarkerEnd}`;

export const indexJSBefore = `${hideMarkerStart}
document.querySelector('html').removeAttribute('style');
if(localStorage.getItem('theme') == 'dark') {
  document.querySelector('html').classList.add('dark');
}${hideMarkerEnd}`;
export const indexJSAfter = ``;

export const indexCSSBefore = `${hideMarkerStart}body { height: auto; overflow: auto; min-width: 0px; padding: 1rem }${hideMarkerEnd}`;
export const indexCSSAfter = ``;


/*
  Provides content injections that should appear
  before and after file contents for playground
  based off filename
*/
export const getPlaygroundInjections = ({ includeLog } = {}) => {
  const indexHTMLBefore = getIndexHTMLBefore({includeLog});
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
    'index.js': {
      before: indexJSBefore,
      after: indexJSAfter,
    },
    'index.html': {
      before: indexHTMLBefore,
      after: indexHTMLAfter
    },
    'index.css': {
      before: indexCSSBefore,
      after: indexCSSAfter,
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
  const fileInjections = getPlaygroundInjections({ includeLog });
  each(files, (file, name) => {
    if(fileInjections[name]) {
      const { before, after } = fileInjections[name];
      files[name].content = (before || '') + files[name].content + (after || '').trim();
    }
  });
  return files;
};


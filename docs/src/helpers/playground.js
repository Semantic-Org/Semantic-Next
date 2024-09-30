import { asyncEach, tokenize, inArray, get, camelToKebab, filterObject, each } from '@semantic-ui/utils';

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

export const getIndexHTMLBefore = function(type) {
  const pageScripts = [
    'component.js',
    'index.js',
    'index.css',
  ];

  if(type == 'log') {
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

export const getSandboxURL = () => {
  return `/sandbox/`;
};

export const getExampleID = (example) => {
  const exampleID = example?.id || tokenize(example?.title);
  return exampleID;
};

export const hideComponentBoilerplate = (code) => {
  // Regex to match everything up to and including the last line with getText
  const getTextRegex = /^[\s\S]*(?:getText\([^)]*\)[;\s]*$)/m;

  // Regex to match from createComponent to the end of the file
  const createComponentRegex = /^createComponent[\s\S]*$/m;

  // Apply the first fold
  let foldedCode = code.replace(getTextRegex, (match) => {
    return `// click ellipsus to show imports ${foldMarkerStart}\n\n${match.trim()}\n${foldMarkerEnd}\n\n`;
  });

  // Apply the second fold
  foldedCode = foldedCode.replace(createComponentRegex, (match) => {
    return `// click ellipsus to show exports ${foldMarkerStart}\n\n${match}\n${foldMarkerEnd}\n`;
  });

  return foldedCode;
};

export const getExampleFiles = async(example, allExampleFiles) => {
  const exampleID = getExampleID(example);
  if(!exampleID) {
    return;
  }
  let hasComponent = false;
  const exampleFiles = {};
  await asyncEach(allExampleFiles, async (file, path) => {
    const pathRegExp = new RegExp(`../../examples/.*${exampleID}/`);
    if (path.match(pathRegExp)) {

      const fileName = path.replace(pathRegExp, '');

      const getContentType = (filename) => {
        const extension = filename.split('.').pop();
        const contentTypes = {
          html: 'text/html',
          css: 'text/css',
          js: 'text/javascript'
        };
        return get(contentTypes, extension) || 'text/html';
      };

      if(inArray(fileName, ['index.html'])) {
        const fileContent = await file();
        exampleFiles['index.html'] = {
          contentType: 'text/html',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['index.css'])) {
        const fileContent = await file();
        exampleFiles['index.css'] = {
          contentType: 'text/css',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['index.js'])) {
        const fileContent = await file();
        exampleFiles['index.js'] = {
          contentType: 'text/javascript',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['component.js', `${exampleID}.js`])) {
        const fileContent = await file();
        let fileText = fileContent.default;
        hasComponent = fileText.search('createComponent') > -1;
        if(example.fold !== false) {
          fileText = hideComponentBoilerplate(fileText);
        }
        exampleFiles['component.js'] = {
          contentType: 'text/javascript',
          content: fileText
        };
      }
      else if(example.exampleType == 'folder') {
        const fileContent = await file();
        exampleFiles[fileName] = {
          contentType: getContentType(fileName),
          content: fileContent.default
        };
        return;
      }
      else if(inArray(fileName, ['component.html', `${exampleID}.html`])) {
        const fileContent = await file();
        exampleFiles['component.html'] = {
          contentType: 'text/html',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['component.css', `${exampleID}.css`])) {
        const fileContent = await file();
        exampleFiles['component.css'] = {
          contentType: 'text/css',
          content: fileContent.default
        };
      }
    }
  });
  // auto generate index.html if not specified for component
  if(!exampleFiles['index.html']?.content) {

    // get tag name from contents
    let tagName;
    if(hasComponent) {
      let matches = exampleFiles['component.js'].content.match(/tagName: '(.*)'/);
      if(matches?.length > 1) {
        tagName = matches[1];
      }
      else {
        tagName = camelToKebab(exampleID);
      }
    }

    exampleFiles['index.html'] = {
      contentType: 'text/html',
      generated: true,
      content: (tagName)
        ? `<${tagName}></${tagName}>`
        : ``
    };
  }

  if(example.exampleType == 'log') {
    exampleFiles['log.js'] = {
      contentType: 'text/javascript',
      generated: true,
      hidden: true,
      content: logJS
    };
    exampleFiles['log.css'] = {
      contentType: 'text/css',
      generated: true,
      hidden: true,
      content: logCSS
    };
  }

  // auto generate index.css/js if not specified for component
  if(!exampleFiles['index.css']?.content) {
    exampleFiles['index.css'] = {
      contentType: 'text/css',
      generated: true,
      content: ''
    };
  }
  if(!exampleFiles['component.js']?.content) {
    exampleFiles['component.js'] = {
      contentType: 'text/javascript',
      generated: true,
      content: ''
    };
  }
  if(!exampleFiles['index.js']?.content) {
    exampleFiles['index.js'] = {
      contentType: 'text/javascript',
      generated: true,
      content: ''
    };
  }
  return exampleFiles;
};

export const getPlaygroundInjections = (type) => {
  const indexHTMLBefore = getIndexHTMLBefore(type);
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

export const addPlaygroundInjections = (files, type) => {
  const fileInjections = getPlaygroundInjections(type);
  each(files, (file, name) => {
    if(fileInjections[name]) {
      const { before, after } = fileInjections[name];
      files[name].content = (before || '') + files[name].content + (after || '').trim();
    }
  });
  return files;
};

export const getEmptyProjectFiles = ({
  withInjections = false
} = {}) => {
  let emptyFiles = {
    'component.js': {
      contentType: 'text/javascript',
      content: '',
    },
    'component.html': {
      contentType: 'text/html',
      content: '',
    },
    'component.css': {
      contentType: 'text/css',
      content: '',
    },
    'index.js': {
      contentType: 'text/javascript',
      content: '',
    },
    'index.html': {
      contentType: 'text/html',
      content: '',
    },
    'index.css': {
      contentType: 'text/css',
      content: '',
    },
  };
  if(withInjections) {
    emptyFiles = addPlaygroundInjections(emptyFiles);
  }
  return emptyFiles;
};


export const getPanelIndexes = (files, type) => {
  let indexes;
  if(type == 'log') {
    indexes = {
      'index.js': 0,
    };
  }
  else {
    indexes = {
      'component.js': 0,
      'component.html': 0,
      'component.css': 0,
      'index.html': 1,
      'index.css': 1,
      'index.js': 1,
    };
  }
  // filter out generated and absent files
  indexes = filterObject(indexes, (value, key) => {
    if(!files[key] || files[key]?.generated) {
      return false;
    }
    return true;
  });
  // use right pane for css if no index files
  if(!indexes['index.html'] && !indexes['index.css'] && !indexes['index.js']) {
    indexes['component.css'] = 1;
  }
  return indexes;
};

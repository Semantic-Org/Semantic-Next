import { asyncEach, tokenize, inArray, camelToKebab, each } from '@semantic-ui/utils';

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


export const indexHTMLBeforeStandard = `${htmlHideMarkerStart}
<html>
<head>
<script src="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.js" type="module"></script>
<link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.css"></link>
<link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/theme/base.css"></link>
<!-- This defines the component tag and makes it available on your page !-->
<script src="./component.js" type="module"></script>
<script src="./index.js" type="module"></script>
<link href="./index.css" rel="stylesheet">
</head>
<body>
<script>if(localStorage.getItem('theme') == 'dark') {
  document.querySelector('body').classList.add('dark');
}</script>
${htmlHideMarkerEnd}
`;

// nothing dif yet
export const indexHTMLBeforeUI = indexHTMLBeforeStandard;

export const indexHTMLAfter = `${htmlHideMarkerStart}</body></html>${htmlHideMarkerEnd}`;

export const indexJSBefore = `${foldMarkerStart}if(localStorage.getItem('theme') == 'dark') {
  document.querySelector('body').classList.add('dark');
}${foldMarkerEnd}

// theme code folded


`;
export const indexJSAfter = ``;

export const indexCSSBefore = `${hideMarkerStart}body { height: auto; }${hideMarkerEnd}body {
  padding: 1rem;
}`;
export const indexCSSAfter = ``;

export const getSandboxURL = () => {
  return `/sandbox/`;
};

export const getExampleFiles = async(example, files) => {
  const exampleID = example.id || tokenize(example.title);
  if(!exampleID) {
    return;
  }
  let hasComponent = false;
  const exampleFiles = {};
  await asyncEach(files, async (file, path) => {
    const pathRegExp = new RegExp(`../../example-files/${exampleID}/`);
    if (path.match(pathRegExp)) {
      const fileName = path.replace(pathRegExp, '');
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
      else if(inArray(fileName, ['component.js', `${exampleID}.js`])) {
        const fileContent = await file();
        hasComponent = true;
        exampleFiles['component.js'] = {
          contentType: 'text/javascript',
          content: fileContent.default
        };
      }
    }
  });
  // auto generate index.html if not specified for component
  if(exampleFiles['component.js']?.content && !exampleFiles['index.html']?.content) {

    // get tag name from contents
    let tagName;
    if(hasComponent) {
      let matches = exampleFiles['component.js'].content.match(/tagName: '(.*)'/);
      if(matches.length > 1) {
        tagName = matches[1];
      }
      else {
        tagName = camelToKebab(exampleID);
      }
    }

    exampleFiles['index.html'] = {
      contentType: 'text/html',
      content: `<${tagName}></${tagName}>`
    };
  }
  // auto generate index.css/js if not specified for component
  if(!exampleFiles['index.css']?.content) {
    exampleFiles['index.css'] = {
      contentType: 'text/css',
      content: ''
    };
  }
  if(!exampleFiles['index.js']?.content) {
    exampleFiles['index.js'] = {
      contentType: 'text/javascript',
      content: ''
    };
  }

  return exampleFiles;
};

export const getPlaygroundInjections = (type) => {
  const indexHTMLBefore = (type == 'ui')
    ? indexHTMLBeforeUI
    : indexHTMLBeforeStandard
  ;
  return {
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
};

export const addPlaygroundInjections = (files, type) => {
  const fileInjections = getPlaygroundInjections(type);
  each(files, (file, name) => {
    if(fileInjections[name]) {
      const { before, after } = fileInjections[name];
      files[name].content = (before || '') + files[name].content + (after || '');
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


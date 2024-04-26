import { asyncEach, tokenize, inArray, camelToKebab, each } from '@semantic-ui/utils';

/* These are top level to make it easier to format */

export const componentJSBefore = ``;
export const componentJSAfter = ``;

export const componentHTMLBefore = ``;
export const componentHTMLAfter = ``;

export const componentCSSBefore = ``;
export const componentCSSAfter = ``;


export const indexHTMLBeforeStandard = `<!-- playground-hide -->
<html>
<head>
<!-- This defines the component tag and makes it available on your page !-->
<script src="./component.js" type="module"></script>
<link href="./index.css" rel="stylesheet">
</head>
<body>
<!-- playground-hide-end -->
`;
export const indexHTMLBeforeUI = `<!-- playground-hide -->
<html>
<head>
<!-- This defines the component tag and makes it available on your page !-->
<script src="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.js" type="module"></script>
<link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/semantic-ui.css"></link>
<link rel="stylesheet" href="https://unpkg.com/@semantic-ui/core@latest/dist/theme/base.css"></link>
<script src="./component.js" type="module"></script>
<link href="./index.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body>
<!-- playground-hide-end -->
`;

export const indexHTMLAfter = `<!-- playground-hide --></body></html><!-- playground-hide-end -->`;

export const indexJSBefore = `/* playground-fold */ body { padding 1rem; font-family: Lato; } /* playground-fold-end */`;
export const indexJSAfter = ``;

export const indexCSSBefore = `/* playground-fold */ body { padding 1rem; font-family: Lato; } /* playground-fold-end */`;
export const indexCSSAfter = ``;

export const getExampleFiles = async(example, files) => {
  const exampleID = example.id || tokenize(example.title);
  if(!exampleID) {
    return;
  }
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
        exampleFiles['index.html'] = {
          contentType: 'text/css',
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
          contentType: 'text/javascript',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['component.js', `${exampleID}.js`])) {
        const fileContent = await file();
        exampleFiles['component.js'] = {
          contentType: 'text/javascript',
          content: fileContent.default
        };
      }
    }
  });
  // auto generate index.html if not specified for component
  if(exampleFiles['component.js']?.content && !exampleFiles['index.html']?.content) {
    const tagName = camelToKebab(exampleID);
    exampleFiles['index.html'] = {
      contentType: 'text/html',
      content: `<${tagName}></${tagName}>`
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
    if(file.content && fileInjections[name]) {
      const { before, after } = fileInjections[name];
      files[name].content = before + files[name].content + after;
    }
  });
  return files;
};

